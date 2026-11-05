'use strict';

// ============================================================================
// lib/db-pool.js
// Gerenciador de Connection Pooling, Concorrência (Bulkhead/Semaphore),
// Singleflight (Deduplicação de Queries Simultâneas), Cache TTL e Fechamento
// de Conexões Ociosas para Ambiente Serverless (Vercel + Supabase / Supavisor)
// ============================================================================

const http = require('http');
const https = require('https');

const DEFAULT_POOL_CONFIG = Object.freeze({
  maxConcurrent: Number(process.env.DB_POOL_MAX_CONCURRENT) || 10,
  maxQueueSize: Number(process.env.DB_POOL_MAX_QUEUE) || 60,
  acquireTimeoutMs: Number(process.env.DB_POOL_ACQUIRE_TIMEOUT_MS) || 6000,
  queryTimeoutMs: Number(process.env.DB_POOL_QUERY_TIMEOUT_MS) || 8000,
  idleTimeoutMs: Number(process.env.DB_POOL_IDLE_TIMEOUT_MS) || 15000,
  keepAliveMsecs: Number(process.env.DB_POOL_KEEPALIVE_MS) || 10000,
  maxRetries: Number(process.env.DB_POOL_MAX_RETRIES) || 2,
  retryBaseDelayMs: Number(process.env.DB_POOL_RETRY_BASE_MS) || 120,
  defaultCacheTtlMs: Number(process.env.DB_POOL_CACHE_TTL_MS) || 5000,
  pgPoolPort: 6543,
  pgDirectPort: 5432,
  pgDefaultConnectionLimit: Number(process.env.DB_PG_CONNECTION_LIMIT) || 5,
  pgPoolTimeoutSec: Number(process.env.DB_PG_POOL_TIMEOUT_SEC) || 10,
  pgConnectTimeoutSec: Number(process.env.DB_PG_CONNECT_TIMEOUT_SEC) || 5
});

/**
 * Converte e valida uma connection string PostgreSQL direta (porta 5432 / Session Mode)
 * para o Pooler Transacional do Supabase / Supavisor / PgBouncer (porta 6543).
 *
 * Em ambiente Serverless (Vercel), conexões TCP diretas na porta 5432 esgotam
 * o limite do PostgreSQL rapidamente (~30-60 conexões). O modo transacional
 * (porta 6543 + pgbouncer=true) libera a conexão física imediatamente após cada transação.
 *
 * @param {string} rawUrl - URL de conexão PostgreSQL (ex: DATABASE_URL)
 * @param {object} [opts] - Opções de limite do pool
 * @returns {{ pooledUrl: string, directUrl: string, usesTransactionPooler: boolean, params: object }}
 */
function normalizePoolerConnectionString(rawUrl, opts = {}) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return {
      pooledUrl: '',
      directUrl: '',
      usesTransactionPooler: false,
      params: {}
    };
  }

  const connectionLimit = Number(opts.connectionLimit) || DEFAULT_POOL_CONFIG.pgDefaultConnectionLimit;
  const poolTimeout = Number(opts.poolTimeout) || DEFAULT_POOL_CONFIG.pgPoolTimeoutSec;
  const connectTimeout = Number(opts.connectTimeout) || DEFAULT_POOL_CONFIG.pgConnectTimeoutSec;

  try {
    const parsedDirect = new URL(rawUrl.trim());
    const parsedPooled = new URL(rawUrl.trim());

    const isPostgresProtocol =
      parsedPooled.protocol === 'postgres:' || parsedPooled.protocol === 'postgresql:';

    if (!isPostgresProtocol) {
      return {
        pooledUrl: rawUrl.trim(),
        directUrl: rawUrl.trim(),
        usesTransactionPooler: false,
        params: {}
      };
    }

    // Preserva URL direta na porta 5432 (exclusiva para migrações DDL fora do runtime serverless)
    if (!parsedDirect.port || parsedDirect.port === '6543') {
      parsedDirect.port = String(DEFAULT_POOL_CONFIG.pgDirectPort);
    }
    parsedDirect.searchParams.delete('pgbouncer');
    parsedDirect.searchParams.delete('connection_limit');

    // Força Transaction Pooler (porta 6543) para o runtime Serverless
    const isSupabaseHost =
      parsedPooled.hostname.includes('supabase.co') ||
      parsedPooled.hostname.includes('supabase.com') ||
      parsedPooled.hostname.includes('pooler.supabase');

    if (isSupabaseHost || parsedPooled.port === '5432' || !parsedPooled.port) {
      parsedPooled.port = String(DEFAULT_POOL_CONFIG.pgPoolPort);
    }

    parsedPooled.searchParams.set('pgbouncer', 'true');
    parsedPooled.searchParams.set('connection_limit', String(connectionLimit));
    parsedPooled.searchParams.set('pool_timeout', String(poolTimeout));
    parsedPooled.searchParams.set('connect_timeout', String(connectTimeout));

    return {
      pooledUrl: parsedPooled.toString(),
      directUrl: parsedDirect.toString(),
      usesTransactionPooler: parsedPooled.port === '6543' && parsedPooled.searchParams.get('pgbouncer') === 'true',
      params: {
        port: Number(parsedPooled.port),
        pgbouncer: true,
        connectionLimit,
        poolTimeout,
        connectTimeout
      }
    };
  } catch (_) {
    return {
      pooledUrl: rawUrl.trim(),
      directUrl: rawUrl.trim(),
      usesTransactionPooler: false,
      params: {}
    };
  }
}

/**
 * Pool de Conexões e Orquestrador de Concorrência para Serverless (Vercel + Supabase).
 *
 * Funcionalidades:
 * 1. Agentes HTTP/HTTPS Keep-Alive compartilhados com reciclagem automática de sockets ociosos (`idleTimeoutMs`).
 * 2. Semáforo de Concorrência (Bulkhead): limita conexões simultâneas por instância Serverless (`maxConcurrent`)
 *    e enfileira picos de tráfego com timeout (`acquireTimeoutMs`) para não afogar o Supabase em 30+ usuários simultâneos.
 * 3. Singleflight (Coalescência de Requisições): se 50 usuários dispararem a mesma leitura ao mesmo tempo,
 *    apenas 1 conexão vai ao banco e as 50 requisições recebem o resultado compartilhado.
 * 4. Cache em memória de curto prazo (TTL) com limpeza automática de entradas expiradas/ociosas.
 * 5. Retry exponencial com jitter para falhas transitórias de pool (`429`, `502`, `503`, `504`).
 */
class ServerlessConnectionPool {
  constructor(options = {}) {
    this.config = {
      ...DEFAULT_POOL_CONFIG,
      ...options
    };

    this.activeCount = 0;
    this.waitQueue = [];
    this.inFlightReads = new Map();
    this.readCache = new Map();
    this.lastActivityAt = Date.now();
    this.idleTimer = null;
    this.closed = false;

    this.stats = {
      activeConnections: 0,
      peakConcurrent: 0,
      queuedRequests: 0,
      totalAcquired: 0,
      totalReleased: 0,
      totalTimeouts: 0,
      totalQueueRejected: 0,
      totalRetries: 0,
      coalescedHits: 0,
      cacheHits: 0,
      idleEvictions: 0
    };

    // Agentes Keep-Alive com limite estrito de sockets e encerramento automático de conexões ociosas
    this.httpAgent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: this.config.keepAliveMsecs,
      maxSockets: this.config.maxConcurrent,
      maxFreeSockets: Math.max(2, Math.floor(this.config.maxConcurrent / 2)),
      timeout: this.config.idleTimeoutMs
    });

    this.httpsAgent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: this.config.keepAliveMsecs,
      maxSockets: this.config.maxConcurrent,
      maxFreeSockets: Math.max(2, Math.floor(this.config.maxConcurrent / 2)),
      timeout: this.config.idleTimeoutMs
    });

    this._scheduleIdleCheck();
  }

  _scheduleIdleCheck() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    this.idleTimer = setTimeout(() => {
      this.evictIdleResources();
    }, this.config.idleTimeoutMs);

    if (this.idleTimer && typeof this.idleTimer.unref === 'function') {
      this.idleTimer.unref();
    }
  }

  /**
   * Encerra conexões livres ociosas e limpa entradas expiradas do cache.
   */
  evictIdleResources(force = false) {
    const now = Date.now();

    // 1. Limpa cache expirado
    for (const [key, entry] of this.readCache.entries()) {
      if (force || now >= entry.expiresAt) {
        this.readCache.delete(key);
      }
    }

    // 2. Se o pool está sem requisições ativas e ocioso além do idleTimeoutMs, destrói sockets livres
    const idleDuration = now - this.lastActivityAt;
    if (force || (this.activeCount === 0 && idleDuration >= this.config.idleTimeoutMs)) {
      if (this.httpAgent && typeof this.httpAgent.destroy === 'function') {
        this.httpAgent.destroy();
      }
      if (this.httpsAgent && typeof this.httpsAgent.destroy === 'function') {
        this.httpsAgent.destroy();
      }
      this.stats.idleEvictions += 1;
    }

    if (!this.closed && this.activeCount > 0) {
      this._scheduleIdleCheck();
    }
  }

  /**
   * Adquire um slot no pool de conexões respeitando maxConcurrent e acquireTimeoutMs.
   */
  acquire() {
    this.lastActivityAt = Date.now();
    this._scheduleIdleCheck();

    if (this.activeCount < this.config.maxConcurrent) {
      this.activeCount += 1;
      this.stats.activeConnections = this.activeCount;
      this.stats.totalAcquired += 1;
      if (this.activeCount > this.stats.peakConcurrent) {
        this.stats.peakConcurrent = this.activeCount;
      }
      return Promise.resolve();
    }

    if (this.waitQueue.length >= this.config.maxQueueSize) {
      this.stats.totalQueueRejected += 1;
      const err = new Error('DB_POOL_EXHAUSTED: Limite máximo de conexões em fila atingido.');
      err.code = 'DB_POOL_EXHAUSTED';
      err.status = 503;
      return Promise.reject(err);
    }

    return new Promise((resolve, reject) => {
      const waiter = {
        resolve: () => {
          clearTimeout(waiter.timer);
          this.stats.queuedRequests = this.waitQueue.length;
          this.activeCount += 1;
          this.stats.activeConnections = this.activeCount;
          this.stats.totalAcquired += 1;
          if (this.activeCount > this.stats.peakConcurrent) {
            this.stats.peakConcurrent = this.activeCount;
          }
          resolve();
        },
        reject: (err) => {
          clearTimeout(waiter.timer);
          this.stats.queuedRequests = this.waitQueue.length;
          reject(err);
        },
        timer: null
      };

      waiter.timer = setTimeout(() => {
        const idx = this.waitQueue.indexOf(waiter);
        if (idx !== -1) {
          this.waitQueue.splice(idx, 1);
        }
        this.stats.queuedRequests = this.waitQueue.length;
        this.stats.totalTimeouts += 1;
        const err = new Error(`DB_POOL_ACQUIRE_TIMEOUT: Tempo limite (${this.config.acquireTimeoutMs}ms) aguardando conexão disponível.`);
        err.code = 'DB_POOL_ACQUIRE_TIMEOUT';
        err.status = 503;
        reject(err);
      }, this.config.acquireTimeoutMs);

      if (waiter.timer && typeof waiter.timer.unref === 'function') {
        waiter.timer.unref();
      }

      this.waitQueue.push(waiter);
      this.stats.queuedRequests = this.waitQueue.length;
    });
  }

  /**
   * Libera um slot no pool e acorda a próxima requisição da fila imediatamente.
   */
  release() {
    this.lastActivityAt = Date.now();
    if (this.activeCount > 0) {
      this.activeCount -= 1;
    }
    this.stats.activeConnections = this.activeCount;
    this.stats.totalReleased += 1;

    if (this.waitQueue.length > 0 && this.activeCount < this.config.maxConcurrent) {
      const next = this.waitQueue.shift();
      this.stats.queuedRequests = this.waitQueue.length;
      if (next) {
        next.resolve();
        return;
      }
    }

    this._scheduleIdleCheck();
  }

  /**
   * Executa uma função assíncrona dentro de um slot gerenciado do pool,
   * garantindo liberação (`release()`) mesmo em caso de exceção.
   */
  async runControlled(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }

  /**
   * Executa uma requisição HTTP/PostgREST ao Supabase com:
   * - Controle de concorrência (Semaphore / Pool)
   * - Timeout rígido por query (`AbortController`) para evitar conexões zumbis
   * - Singleflight (coalescência de leituras idênticas simultâneas)
   * - Cache opcional por TTL (`cacheTtlMs`)
   * - Retry automático com backoff exponencial + jitter em erros transitórios (502/503/504/429)
   *
   * @param {string} url - URL completa do endpoint Supabase
   * @param {object} [init] - Opções do fetch (method, headers, body, signal)
   * @param {object} [poolOpts] - Opções do pool (fetchImpl, timeoutMs, cacheTtlMs, cacheKey, coalesce, maxRetries)
   */
  async fetchWithPool(url, init = {}, poolOpts = {}) {
    const fetchFn = poolOpts.fetchImpl || global.fetch;
    if (typeof fetchFn !== 'function') {
      throw new Error('Fetch implementation indisponível no runtime.');
    }

    const method = String(init.method || 'GET').toUpperCase();
    const isRead = method === 'GET' || method === 'HEAD';
    const coalesce = poolOpts.coalesce !== undefined ? Boolean(poolOpts.coalesce) : isRead;
    const cacheTtlMs = Number(poolOpts.cacheTtlMs) || 0;
    const timeoutMs = Number(poolOpts.timeoutMs) || this.config.queryTimeoutMs;
    const maxRetries = poolOpts.maxRetries !== undefined ? Number(poolOpts.maxRetries) : (isRead ? this.config.maxRetries : 0);

    // Chave segura para cache/coalescência (inclui URL + escopo de autorização)
    const authHeader = (init.headers && (init.headers.Authorization || init.headers.authorization || init.headers.apikey)) || '';
    const authFingerprint = authHeader ? String(authHeader).slice(-16) : 'anon';
    const requestKey = poolOpts.cacheKey || `${method}:${url}:${authFingerprint}`;

    // 1. Verifica Cache TTL em memória para leituras
    if (isRead && cacheTtlMs > 0) {
      const cached = this.readCache.get(requestKey);
      if (cached && Date.now() < cached.expiresAt) {
        this.stats.cacheHits += 1;
        return this._cloneBufferedResponse(cached.snapshot);
      }
    }

    // 2. Singleflight: se já existe uma leitura idêntica em andamento, compartilha a mesma Promise
    if (isRead && coalesce && this.inFlightReads.has(requestKey)) {
      this.stats.coalescedHits += 1;
      const sharedSnapshot = await this.inFlightReads.get(requestKey);
      return this._cloneBufferedResponse(sharedSnapshot);
    }

    const executeNetworkCall = async () => {
      let attempt = 0;
      while (true) {
        attempt += 1;
        try {
          const snapshot = await this.runControlled(async () => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            if (timer && typeof timer.unref === 'function') {
              timer.unref();
            }

            try {
              const mergedHeaders = {
                Connection: 'keep-alive',
                ...(init.headers || {})
              };

              const res = await fetchFn(url, {
                ...init,
                method,
                headers: mergedHeaders,
                signal: init.signal || controller.signal
              });

              let rawText = '';
              let parsedJson;
              let hasJson = false;
              if (typeof res.text === 'function') {
                rawText = await res.text();
              } else if (typeof res.json === 'function') {
                parsedJson = await res.json();
                hasJson = true;
                rawText = parsedJson !== undefined ? JSON.stringify(parsedJson) : '';
              }
              return {
                ok: Boolean(res.ok),
                status: Number(res.status) || (res.ok ? 200 : 500),
                statusText: res.statusText || '',
                headers: res.headers || null,
                rawText,
                parsedJson,
                hasJson
              };
            } finally {
              clearTimeout(timer);
            }
          });

          // Se o banco/pooler retornou erro transitório de saturação e ainda há tentativas
          const isTransientStatus =
            snapshot.status === 429 ||
            snapshot.status === 502 ||
            snapshot.status === 503 ||
            snapshot.status === 504;

          if (isTransientStatus && attempt <= maxRetries) {
            this.stats.totalRetries += 1;
            const jitter = Math.floor(Math.random() * 60);
            const delay = this.config.retryBaseDelayMs * Math.pow(2, attempt - 1) + jitter;
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }

          if (isRead && cacheTtlMs > 0 && snapshot.ok) {
            this.readCache.set(requestKey, {
              snapshot,
              expiresAt: Date.now() + cacheTtlMs
            });
          }

          return snapshot;
        } catch (err) {
          const isRetryableError =
            err &&
            err.code !== 'DB_POOL_EXHAUSTED' &&
            err.code !== 'DB_POOL_ACQUIRE_TIMEOUT' &&
            attempt <= maxRetries;

          if (isRetryableError) {
            this.stats.totalRetries += 1;
            const jitter = Math.floor(Math.random() * 60);
            const delay = this.config.retryBaseDelayMs * Math.pow(2, attempt - 1) + jitter;
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          throw err;
        }
      }
    };

    if (isRead && coalesce) {
      const promise = executeNetworkCall();
      this.inFlightReads.set(requestKey, promise);
      try {
        const snapshot = await promise;
        return this._cloneBufferedResponse(snapshot);
      } finally {
        this.inFlightReads.delete(requestKey);
      }
    }

    // Mutação (POST/PATCH/PUT/DELETE): invalida caches relacionados à tabela e executa
    if (!isRead) {
      this.invalidateCacheByUrl(url);
    }

    const snapshot = await executeNetworkCall();
    return this._cloneBufferedResponse(snapshot);
  }

  _cloneBufferedResponse(snapshot) {
    const textValue = snapshot.rawText !== undefined ? snapshot.rawText : '';
    return {
      ok: snapshot.ok,
      status: snapshot.status,
      statusText: snapshot.statusText,
      headers: snapshot.headers,
      text: async () => textValue,
      json: async () => {
        if (snapshot.hasJson) {
          return snapshot.parsedJson !== undefined ? JSON.parse(JSON.stringify(snapshot.parsedJson)) : null;
        }
        return textValue ? JSON.parse(textValue) : null;
      }
    };
  }

  invalidateCacheByUrl(url) {
    if (!url || this.readCache.size === 0) return;
    try {
      const tableMatch = String(url).match(/\/rest\/v1\/([a-zA-Z0-9_]+)/);
      const tableName = tableMatch ? tableMatch[1] : null;
      if (!tableName) {
        this.readCache.clear();
        return;
      }
      for (const key of this.readCache.keys()) {
        if (key.includes(`/rest/v1/${tableName}`)) {
          this.readCache.delete(key);
        }
      }
    } catch (_) {
      this.readCache.clear();
    }
  }

  getStats() {
    return {
      ...this.stats,
      activeConnections: this.activeCount,
      queuedRequests: this.waitQueue.length,
      inFlightReads: this.inFlightReads.size,
      cachedEntries: this.readCache.size,
      maxConcurrent: this.config.maxConcurrent,
      maxQueueSize: this.config.maxQueueSize,
      idleTimeoutMs: this.config.idleTimeoutMs
    };
  }

  async drain() {
    this.closed = true;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    this.evictIdleResources(true);
  }
}

// Singleton global reutilizado entre invocações quentes (warm starts) na Vercel
const GLOBAL_POOL_SYMBOL = Symbol.for('radarsaojose.serverless.dbPool');

function getDbPool(options) {
  if (!globalThis[GLOBAL_POOL_SYMBOL]) {
    globalThis[GLOBAL_POOL_SYMBOL] = new ServerlessConnectionPool(options);
  }
  return globalThis[GLOBAL_POOL_SYMBOL];
}

// Garante encerramento limpo de conexões ociosas quando o container Serverless recicla
if (typeof process !== 'undefined' && typeof process.once === 'function') {
  process.once('SIGTERM', () => {
    const pool = globalThis[GLOBAL_POOL_SYMBOL];
    if (pool) pool.drain().catch(() => {});
  });
  process.once('beforeExit', () => {
    const pool = globalThis[GLOBAL_POOL_SYMBOL];
    if (pool) pool.evictIdleResources(true);
  });
}

module.exports = {
  DEFAULT_POOL_CONFIG,
  ServerlessConnectionPool,
  getDbPool,
  normalizePoolerConnectionString
};
