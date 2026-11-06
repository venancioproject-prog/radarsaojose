const http = require('http');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('node:stream/promises');

// Carrega .env se existir
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).replace(/^['"]|['"\r]$/g, '').trim();
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.webp': 'image/webp',
  '.geojson': 'application/geo+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.avif': 'image/avif'
};

const staticDirectories = new Set([
  'artigos', 'assets', 'data', 'fotos_influenciadores', 'fotos_radar', 'mais_fotos_radar',
  'midia_sjc', 'public-data', 'thumbnails', 'web-media', 'Landing page_files', 'data_personas'
]);
const internalAsset = /^(?:server|check|fix|patch|temp|debug|test|backup)(?:[-_.]|$)|^dados_pesquisa|^comunidade_/i;
const assetExtensions = new Set(Object.keys(MIME_TYPES).filter(ext => ext !== '.csv'));

function send(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

async function readJson(req, res, limit) {
  if (Number(req.headers['content-length']) > limit) {
    send(res, 413, 'Corpo da requisição acima do limite.');
    return false;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > limit) {
      send(res, 413, 'Corpo da requisição acima do limite.');
      return false;
    }
    chunks.push(chunk);
  }
  try {
    req.body = size ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
    return true;
  } catch (_) {
    send(res, 400, 'JSON inválido.');
    return false;
  }
}

const rootPath = fs.promises.realpath(__dirname);
const server = http.createServer({ requestTimeout: 15000, headersTimeout: 10000 }, async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const root = await rootPath;
    const queryStart = req.url.indexOf('?');
    const rawPath = queryStart < 0 ? req.url : req.url.slice(0, queryStart);
    if (!rawPath.startsWith('/') || rawPath.startsWith('//')) return send(res, 400, 'URL inválida.');
    let pathname;
    try { pathname = decodeURIComponent(rawPath); }
    catch (_) { return send(res, 400, 'URL inválida.'); }
    const segments = pathname.split('/').filter(Boolean);
    if (/[\\\x00-\x1f]/.test(pathname) || segments.some(part => part.startsWith('.') || part.includes(':'))) {
      return send(res, 400, 'URL inválida.');
    }

    if (segments[0] === 'api') {
      const route = segments.length === 2 && /^([a-z][a-z0-9-]*)(?:\.js)?$/i.exec(segments[1]);
      const file = route && path.join(root, 'api', route[1] + '.js');
      if (!file || !fs.existsSync(file)) return send(res, 404, 'Rota inexistente.');
      const handler = require(file);
      if (typeof handler !== 'function') return send(res, 404, 'Rota inexistente.');
      res.status = status => { res.statusCode = status; return res; };
      res.json = data => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data));
      };
      res.send = data => res.end(data);
      const query = new URLSearchParams(queryStart < 0 ? '' : req.url.slice(queryStart + 1));
      req.query = Object.fromEntries([...new Set(query.keys())].map(key => {
        const values = query.getAll(key);
        return [key, values.length === 1 ? values[0] : values];
      }));
      if (handler.config?.api?.bodyParser !== false && ['POST','PUT','PATCH','DELETE'].includes(req.method)) {
        const limit = route[1] === 'upload' ? 14 * 1024 * 1024 : 256 * 1024;
        if (!await readJson(req, res, limit)) return;
      }
      await handler(req, res);
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Método não permitido.');
    if (!segments.length) segments.push('index.html');
    const leaf = segments.at(-1);
    if (internalAsset.test(leaf) || (segments.length > 1 && !staticDirectories.has(segments[0])) ||
        segments.includes('migrations') || segments.includes('evidence') ||
        (segments[0] === 'data_personas' && segments[1] !== 'capivara')) {
      return send(res, 404, 'Arquivo inexistente.');
    }
    if (!path.extname(leaf)) segments[segments.length - 1] += '.html';
    const extension = path.extname(segments.at(-1)).toLowerCase();
    if (!assetExtensions.has(extension)) return send(res, 404, 'Arquivo inexistente.');
    const file = await fs.promises.realpath(path.join(root, ...segments)).catch(() => null);
    if (!file || !file.startsWith(root + path.sep) || !(await fs.promises.stat(file)).isFile()) {
      return send(res, 404, 'Arquivo inexistente.');
    }
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    if (req.method === 'HEAD') return res.end();
    await pipeline(fs.createReadStream(file), res);
  } catch (_) {
    if (!res.headersSent) send(res, 500, 'Erro interno.');
    else if (!res.writableEnded) res.destroy();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Servidor Radar SJC em http://127.0.0.1:' + server.address().port);
});
