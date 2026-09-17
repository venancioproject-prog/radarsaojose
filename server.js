const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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
  '.webp': 'image/webp'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Roteador de APIs Serverless (/api/consultor, /api/oraculo, etc.)
  if (pathname.startsWith('/api/')) {
    const routeName = pathname.replace('/api/', '').replace(/\.js$/, '');
    const apiPath = path.resolve(__dirname, 'api', `${routeName}.js`);
    
    if (fs.existsSync(apiPath)) {
      try {
        delete require.cache[require.resolve(apiPath)];
        const handler = require(apiPath);

        // Helper de compatibilidade Serverless / Express (res.status().json())
        res.status = function(statusCode) {
          res.statusCode = statusCode;
          return {
            json: (data) => {
              if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify(data));
            },
            send: (data) => {
              res.end(data);
            },
            end: () => {
              res.end();
            }
          };
        };
        res.json = function(data) {
          if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(data));
        };
        req.query = parsedUrl.query || {};

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch(e) {
              req.body = {};
            }
            await handler(req, res);
          });
        } else {
          req.body = {};
          await handler(req, res);
        }
        return;
      } catch (err) {
        console.error(`API ${routeName} Error:`, err);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    }
  }

  if (pathname === '/' || pathname === '') {
    pathname = '/app.html';
  }

  let filePath = path.join(__dirname, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: ' + pathname);
        return;
      }
    } else if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'app.html');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Error loading file: ' + readErr.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log('Servidor Radar SJC rodando em http://localhost:' + PORT);
  console.log('App: http://localhost:' + PORT + '/app.html');
  console.log('Oraculo: http://localhost:' + PORT + '/app.html#personas');
});
