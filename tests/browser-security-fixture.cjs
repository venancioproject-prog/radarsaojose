'use strict';
// Local visual/security fixture. No real login, payment, email or database access.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { buildPolicy, scriptHash } = require('../scripts/build-browser-csp.cjs');
const root = path.resolve(__dirname, '..');
const port = Number(process.argv[2] || 32117);
if (!Number.isInteger(port) || port < 1024 || port > 65000) throw new Error('Invalid fixture port');
let externalRequests = 0;
const allowed = 'document.getElementById("approved").textContent="Código aprovado executou normalmente";';
const observer = `document.addEventListener('securitypolicyviolation',e=>{
  if(e.blockedURI==='inline')document.getElementById('unexpected').textContent='Script inesperado bloqueado';
  if(e.blockedURI.startsWith('http://127.0.0.1:${port + 1}'))document.getElementById('remote').textContent='Origem externa não autorizada bloqueada';
});try{eval('document.getElementById("eval").textContent="FALHA: eval executou"')}catch(e){document.getElementById('eval').textContent='Execução de texto como código bloqueada'}`;
const fixture = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Conferência isolada de segurança</title>
<style>body{font:17px Arial;background:#eef4fa;color:#0b2545;margin:28px}main{max-width:750px;background:white;padding:28px;border-radius:16px}p{padding:12px;background:#e9f9f0;border-radius:8px}button{padding:14px;border:0;border-radius:8px;background:#0b2545;color:white}</style>
<main><h1>Conferência isolada do navegador</h1><p id="approved">Aguardando código aprovado</p><p id="unexpected">Aguardando bloqueio de código inesperado</p><p id="remote">Aguardando bloqueio externo</p><p id="eval">Aguardando teste de execução</p><p id="handler">Aguardando clique no botão existente</p><button onclick="document.getElementById('handler').textContent='Botão existente continua funcionando'">Testar botão existente</button><small>Dados sintéticos. Sem contas ou pagamentos reais.</small></main>
<script src="/fixture-observer.js"></script><script>${allowed}</script>
<script>document.getElementById('unexpected').textContent='FALHA: código inesperado executou'</script>
<script src="http://127.0.0.1:${port + 1}/unapproved.js"></script></html>`;

const extra = http.createServer((req,res)=>{ externalRequests+=1;res.writeHead(200,{'Content-Type':'application/javascript'});res.end("document.getElementById('remote').textContent='FALHA: origem externa executou'"); });
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://127.0.0.1');
  res.setHeader('Cache-Control','no-store');
  if(url.pathname==='/sanitizer-fixture.html'){
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Content-Security-Policy',buildPolicy());
    return res.end('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Conferência do conteúdo editorial</title><h1>Conteúdo editorial protegido</h1><div id="content"></div><div id="missing"></div><table><tbody id="plan-table"></tbody></table><ul id="checks"></ul><script src="/vendor/dompurify-3.4.17.min.js"></script><script src="/radar-safe-content.js"></script><script src="/sanitizer-fixture.js"></script></html>');
  }
  if(url.pathname==='/sanitizer-fixture.js'){
    res.setHeader('Content-Type','application/javascript');
    return res.end(`const target=document.getElementById('content');
      radarSafeContent.render(target,'<h2>Texto editorial</h2><p>Parágrafo com <strong>destaque</strong>.</p><ul><li>Lista mantida</li></ul><table><tbody><tr><td>Tabela mantida</td></tr></tbody></table><a href="javascript:alert(1)" onclick="alert(1)">Link inválido</a><img src="javascript:alert(1)" onerror="alert(1)" alt="Imagem inválida"><script>alert(1)</script><svg onload="alert(1)"></svg><iframe srcdoc="erro"></iframe>');
      const safe=!!target.querySelector('h2')&&!!target.querySelector('strong')&&!!target.querySelector('li')&&!!target.querySelector('td');
      const inactive=!target.querySelector('script,svg,iframe,[onclick],[onerror],[onload]')&&!target.querySelector('a').hasAttribute('href')&&!target.querySelector('img').hasAttribute('src');
      const purifier=window.DOMPurify;window.DOMPurify=undefined;radarSafeContent.render(document.getElementById('missing'),'<img onerror="alert(1)">');window.DOMPurify=purifier;
      const closed=document.getElementById('missing').textContent.includes('com segurança')&&!document.getElementById('missing').querySelector('img');
      const table=document.getElementById('plan-table');radarSafeContent.renderPlan(table,'<tr><td class="plan-table-cell" contenteditable="true" style="font-weight:700" onclick="alert(1)">Custo salvo</td><td><button type="button" class="plan-del-row-btn">Excluir linha</button></td></tr>');
      const tableSafe=table.querySelector('td')?.textContent==='Custo salvo'&&table.querySelector('td')?.getAttribute('contenteditable')==='true'&&table.querySelector('td')?.style.fontWeight==='700'&&!!table.querySelector('button.plan-del-row-btn')&&!table.querySelector('[onclick]');
      for(const [ok,text] of [[tableSafe,'Tabela editável e botão preservados sem evento injetado'],[safe,'Texto, destaque, lista e tabela preservados'],[inactive,'Scripts, atributos ativos e URLs perigosas removidos'],[closed,'Falha da biblioteca bloqueia conteúdo inseguro']]){const li=document.createElement('li');li.textContent=(ok?'PASSOU: ':'FALHOU: ')+text;document.getElementById('checks').append(li);}`);
  }
  if(url.pathname==='/security-fixture.html'){
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Content-Security-Policy',buildPolicy().replace('; script-src-attr',' '+scriptHash(allowed)+'; script-src-attr'));
    return res.end(fixture);
  }
  if(url.pathname==='/fixture-observer.js'){res.setHeader('Content-Type','application/javascript');return res.end(observer);}
  if(url.pathname==='/fixture-status'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({externalRequests}));}
  if(url.pathname==='/api/asaas-checkout' && url.searchParams.get('browserConfig')==='1'){
    res.setHeader('Content-Type','application/javascript');
    return res.end('window.radarSupabaseConfig={url:"https://fixture.invalid",key:"fixture-only-public-key",preview:true};');
  }
  const pathname=decodeURIComponent(url.pathname);
  const permitted = /^\/(?:[^/]+\.(?:html|js|css)|vendor\/[^/]+|(?:fotos_radar|web-media)\/[A-Za-z0-9_./% -]+)$/.test(pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!permitted || !file.startsWith(root+path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()){
    res.writeHead(404);return res.end('Not found');
  }
  if(pathname.endsWith('.html'))res.setHeader('Content-Security-Policy',buildPolicy());
  const type={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'}[path.extname(file)] || 'application/octet-stream';
  res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));
});
extra.listen(port+1,'127.0.0.1',()=>server.listen(port,'127.0.0.1',()=>console.log('Fixture ready on 127.0.0.1:'+port)));
function close(){server.close();extra.close();}
process.on('SIGINT',close);process.on('SIGTERM',close);
