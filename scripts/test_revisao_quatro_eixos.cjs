const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('data/radar_hub/radar_hub_package.json')),overlay=JSON.parse(read('data/radar_hub/mobilidade_reconciliation_20261008.json'));
const ids=new Set(overlay.overrides.map(r=>r.evidence_id));assert.equal(ids.size,42);
// Parser CSV independente: evidencia tem vírgulas/aspas e não pode ser split(',').
function parseCsv(text){let rows=[],row=[],v='',quoted=false;for(let i=1;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){v+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(v);v='';}else if(c==='\r'&&!quoted&&text[i+1]==='\n'){row.push(v);rows.push(row);row=[];v='';i++;}else v+=c;}row.push(v);rows.push(row);return rows;}
async function run(remote,offline){
 const calls=[],listeners=[];
 const c={RADAR_HUB_VERIFY_ONLINE_PACKAGE:remote,document:{readyState:'loading',getElementById:()=>null,querySelectorAll:()=>[],createElement:()=>({style:{},classList:{add(){},remove(){}}}),addEventListener(t,f){if(t==='DOMContentLoaded')listeners.push(f)}},setTimeout:f=>f(),sessionStorage:{getItem:()=>null,setItem(){}},console:{warn(){},log(){}},fetch:async u=>{calls.push(u);if(offline)throw Error('offline');return {ok:true,json:async()=>structuredClone(pkg)}}};c.window=c;vm.createContext(c);vm.runInContext(read('radar_hub_controller.js'),c);
 const init=c.initRadarHub();c.document.readyState='interactive';listeners.forEach(f=>f());await init;
 for(const axis of ['educacao','saude','seguranca','demografia']){
  c.switchRadarHubAxis(axis);const ex=JSON.parse(JSON.stringify(c.getRevisaoQuatroEixosExport(axis)));const expected=Object.entries(pkg.groundTruth.eixos[axis].series_auditadas).flatMap(([family,rows])=>rows.map(r=>({...r,family})));
  assert.equal(ex.length,expected.length,axis+' full series export');const byid=new Map(ex.map(r=>[r.id,r]));assert.equal(byid.size,ex.length,'unique evidence IDs');
  for(const native of expected){const r=byid.get(native.evidence_id);assert.ok(r,native.evidence_id);assert.equal(r.valor,native.value);assert.equal(r.unidade,native.unit);assert.equal(r.competencia,native.period);assert.equal(r.status_declarado,native.status);assert.equal(r.evidencia.family,native.family);assert.ok(r.url?.startsWith('http'),'official URL');assert.ok(r.evidencia.sha256,'raw hash');if(native.status.startsWith('SUSPENSO'))assert.equal(r.valor,null);}
  assert.deepEqual(JSON.parse(JSON.stringify(c.getRadarHubExport()[axis+'_series'])),ex);
  const csv=parseCsv(c.serializeRadarHubCsv(ex));const headers=csv.shift(),idcol=headers.indexOf('id'),valcol=headers.indexOf('valor');assert.equal(csv.length,ex.length);for(const row of csv){const r=byid.get(row[idcol]);assert.equal(row[valcol],r.valor===null?'':String(r.valor));}
 }
 assert.equal(calls.length,remote?1:0);const bill=c.getMobilidadeP4Export().filter(r=>ids.has(r.id));assert.equal(bill.length,42);assert.ok(bill.every(r=>r.valor===null));
 console.log(`PASS revisão: remoto=${remote}, offline=${offline}; quatro séries integrais, hash, unidade, competência, null, JSON/CSV e 42 P4`);
}
(async()=>{for(const remote of [false,true])for(const offline of [false,true])await run(remote,offline);const html=read('app.html');for(const claim of ['557.069','569.237','97,86%'])assert.ok(!html.includes(claim),'Afirmação censitária sem evidência removida: '+claim);const source=read('radar_hub_controller.js').split('\n').slice(25).join('\n');assert.ok(!source.includes('142850'),'Denominador educacional legado removido');})().catch(e=>{console.error(e);process.exitCode=1});
