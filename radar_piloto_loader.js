/* Isolated pilot loader: exact canonical axis snapshots, verified before parsing. */
(function () {
  'use strict';
  const release = window.RADAR_PILOTO_RELEASE;
  const memory = new Map(), pending = new Map();
  const metrics = {loads: [], renders: []};
  async function sha(bytes) {
    if (!window.crypto?.subtle) throw new Error('Verificação SHA256 exige HTTPS ou localhost.');
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
  }
  function database() {
    return new Promise((resolve, reject) => {
      const r = indexedDB.open('radar-piloto-verified-v1', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('snapshots');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }
  async function cacheGet(key) {
    let db;
    try { db = await database(); return await new Promise((resolve, reject) => {
      const r = db.transaction('snapshots').objectStore('snapshots').get(key);
      r.onsuccess = () => resolve(r.result || null); r.onerror = () => reject(r.error);
    }); } catch (_) { return null; } finally { db?.close(); }
  }
  async function cachePut(key, bytes) {
    let db;
    try { db = await database(); return await new Promise((resolve, reject) => {
      const t = db.transaction('snapshots', 'readwrite'); t.objectStore('snapshots').put(bytes, key);
      t.oncomplete = () => resolve(true); t.onerror = () => reject(t.error); t.onabort = () => reject(t.error);
    }); } catch (_) { return false; } finally { db?.close(); }
  }
  async function verified(url, expected, key) {
    let failure;
    try {
      const response = await fetch(url, {cache: 'no-store'});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const bytes = await response.arrayBuffer();
      if (await sha(bytes) !== expected) throw new Error('Hash divergente: ' + url);
      return {bytes, origin: 'online', cached: await cachePut(key, bytes)};
    } catch (error) { failure = error; }
    const bytes = await cacheGet(key);
    if (bytes && await sha(bytes) === expected) return {bytes, origin: 'cache verificado', cached: true};
    throw new Error('Dados desta versão indisponíveis. Nenhum valor antigo foi substituído. ' + failure.message);
  }
  function parse(bytes) { return JSON.parse(new TextDecoder().decode(bytes)); }
  async function load(axis) {
    if (!['demografia', 'educacao'].includes(axis)) throw new Error('Eixo fora do piloto.');
    if (memory.has(axis)) return memory.get(axis);
    if (pending.has(axis)) return pending.get(axis);
    const promise = (async () => {
      const start = performance.now();
      const manifestResult = await verified(release.manifest_url, release.manifest_sha256,
        release.dataset_version + ':manifest:' + release.manifest_sha256);
      const manifest = parse(manifestResult.bytes);
      if (manifest.schema_version !== 1 || manifest.dataset_version !== release.dataset_version)
        throw new Error('Manifest de versão incompatível.');
      const entry = manifest.axes[axis];
      if (!entry || !/^[a-f0-9]{64}$/.test(entry.sha256)) throw new Error('Manifest incompleto.');
      const fetched = await verified(entry.url, entry.sha256, release.dataset_version + ':' + axis + ':' + entry.sha256);
      if (fetched.bytes.byteLength !== entry.bytes) throw new Error('Tamanho do shard divergente.');
      const parseStart = performance.now();
      const snapshot = parse(fetched.bytes);
      const parseMs = performance.now() - parseStart;
      if (snapshot.schema_version !== 1 || snapshot.axis !== axis || snapshot.dataset_version !== release.dataset_version ||
          Object.keys(snapshot.groundTruth.eixos).join() !== axis ||
          snapshot.metadataRegistry.indicators.some(i => i.category !== axis)) throw new Error('Recorte de versão/eixo inválido.');
      metrics.loads.push({axis, origin: fetched.origin, cached: fetched.cached, bytes: entry.bytes,
        totalMs: performance.now() - start, parseMs, manifestBytes: manifestResult.bytes.byteLength,
        dataset_version: snapshot.dataset_version, heap: performance.memory?.usedJSHeapSize ?? null});
      memory.set(axis, snapshot);
      return snapshot;
    })();
    pending.set(axis, promise);
    try { return await promise; } finally { pending.delete(axis); }
  }
  let navigation = 0;
  async function navigate(axis) {
    const token = ++navigation;
    const container = document.getElementById('radar-piloto-root');
    const status = document.getElementById('radar-piloto-status');
    status.textContent = 'Carregando e verificando ' + (axis === 'demografia' ? 'Demografia' : 'Educação') + '…';
    container.setAttribute('aria-busy', 'true');
    document.querySelectorAll('[data-piloto-axis]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pilotoAxis === axis)));
    try {
      const snapshot = await load(axis);
      if (token !== navigation) return;
      const start = performance.now();
      window.RadarPiloto.mount(axis, container, snapshot);
      metrics.renders.push({axis, ms: performance.now() - start, heap: performance.memory?.usedJSHeapSize ?? null});
      status.textContent = 'Versão verificada · ' + (metrics.loads.find(x => x.axis === axis)?.origin || 'memória') + ' · ' + snapshot.dataset_version;
      history.replaceState(null, '', '#'+axis);
    } catch (error) {
      if (token !== navigation) return;
      container.radarPiloto?.destroy();
      delete container.radarPiloto;
      container.replaceChildren();
      const p = document.createElement('p'); p.className = 'rp-unavailable'; p.textContent = error.message;
      const retry = document.createElement('button'); retry.textContent = 'Tentar novamente'; retry.onclick = () => navigate(axis);
      container.append(p, retry); status.textContent = 'Indisponível nesta versão; dados não substituídos.';
    } finally { if (token === navigation) container.setAttribute('aria-busy', 'false'); }
  }
  async function offline() {
    const status = document.getElementById('radar-piloto-status');
    const button = document.getElementById('radar-piloto-offline');
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = 'Verificando o leitor offline e armazenando os dois recortes…';
    try {
      const registration = await navigator.serviceWorker.register('radar_piloto_sw.js');
      const worker = registration.installing || registration.waiting || registration.active;
      if (!worker) throw new Error('Leitor offline não disponível.');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => { worker.removeEventListener('statechange', changed); reject(new Error('Instalação offline não concluída; tente novamente com rede.')); }, 20000);
        function changed() {
          if (worker.state === 'activated') { clearTimeout(timeout); worker.removeEventListener('statechange', changed); resolve(); }
          else if (worker.state === 'redundant') { clearTimeout(timeout); worker.removeEventListener('statechange', changed); reject(new Error('Integridade do leitor offline rejeitada.')); }
        }
        worker.addEventListener('statechange', changed); changed();
      });
      // Registration only caches the isolated shell. Explicit action stores both verified axes.
      await Promise.all(['demografia', 'educacao'].map(load));
      const manifestKey = release.dataset_version + ':manifest:' + release.manifest_sha256;
      let manifestBytes = await cacheGet(manifestKey);
      if (!manifestBytes || await sha(manifestBytes) !== release.manifest_sha256) {
        const fresh = await verified(release.manifest_url, release.manifest_sha256, manifestKey);
        if (!fresh.cached) throw new Error('Armazenamento local indisponível ou sem espaço.');
        manifestBytes = fresh.bytes;
      }
      const manifest = parse(manifestBytes);
      for (const axis of ['demografia', 'educacao']) {
        const entry = manifest.axes[axis], key = release.dataset_version + ':' + axis + ':' + entry.sha256;
        const bytes = await cacheGet(key);
        if (!bytes || await sha(bytes) !== entry.sha256) {
          const fresh = await verified(entry.url, entry.sha256, key);
          if (!fresh.cached) throw new Error('Não foi possível armazenar ' + axis + '.');
        }
      }
      status.textContent = 'Dois eixos verificados armazenados. A disponibilidade offline depende da preservação do cache pelo navegador; teste recarregando sem rede.';
    } catch (error) { status.textContent = 'Não foi possível preparar offline: ' + error.message; }
    finally { button.disabled = false; }
  }
  window.RadarPilotoData = {load, navigate, metrics, prepareOffline: offline};
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-piloto-axis]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.pilotoAxis)));
    document.getElementById('radar-piloto-offline').addEventListener('click', offline);
    navigate(location.hash === '#educacao' ? 'educacao' : 'demografia');
  });
})();
