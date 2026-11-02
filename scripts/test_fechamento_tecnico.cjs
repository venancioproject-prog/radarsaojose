const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('data/radar_hub/radar_hub_package.json')),overlay=JSON.parse(read('data/radar_hub/mobilidade_reconciliation_20261008.json'));
const ids=new Set(overlay.overrides.map(r=>r.evidence_id));assert.equal(ids.size,42);
// Parser CSV independente: evidencia tem vírgulas/aspas e não pode ser split(',').
function parseCsv(text){let rows=[],row=[],v='',quoted=false;for(let i=1;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){v+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(v);v='';}else if(c==='\r'&&!quoted&&text[i+1]==='\n'){row.push(v);rows.push(row);row=[];v='';i++;}else v+=c;}row.push(v);rows.push(row);return rows;}
async function run(remote,offline){
 const calls=[],elements=new Map(),readyListeners=[];
 const el=id=>({id,textContent:'',innerHTML:'',style:{},dataset:{},classList:{add(){},remove(){},contains(){return false}},appendChild(e){elements.set(e.id,e)},parentNode:{appendChild(e){elements.set(e.id,e)}}});
 const c={RADAR_HUB_VERIFY_ONLINE_PACKAGE:remote,document:{readyState:'loading',getElementById:id=>elements.get(id),querySelectorAll:()=>[],createElement:()=>el(''),addEventListener(type,fn){if(type==='DOMContentLoaded')readyListeners.push(fn)}},setTimeout:fn=>fn(),sessionStorage:{getItem:()=>null,setItem(){}},console:{warn(){},log(){}},fetch:async url=>{calls.push(url);if(offline)throw Error('offline');return {ok:true,json:async()=>structuredClone(pkg)}}};
 c.window=c;vm.createContext(c);vm.runInContext(read('radar_hub_controller.js'),c);
 const pending=Promise.all([c.initRadarHub(),c.initRadarHub()]);assert.equal(c.getRadarHubExport(),null,'Não renderizar pacote antes dos scripts/DOM');assert.equal(calls.length,0);
 c.document.readyState='interactive';for(const fn of readyListeners)fn();await pending;assert.equal(calls.length,remote?1:0);
 for(const axis of ['demografia','saude','seguranca','economia','financas','meio_ambiente','educacao','mobilidade']){c.switchRadarHubAxis(axis);const e=c.getRadarHubExport();assert.equal(e.dataset_version,pkg.dataset_version);assert.equal(e.indicators.length,122);}
 const baseline=JSON.parse(JSON.stringify(c.getMobilidadeP4Export()));
 for(const cat of ['todas','automoveis','motos'])for(const mode of ['anual','mensal']){
  c.filterHubChart('mob_frota','categoria',cat);c.filterHubChart('mob_fatalidades','mode',mode);
  const rows=JSON.parse(JSON.stringify(c.getMobilidadeP4Export()));assert.deepEqual(rows,baseline,'Filtro gráfico não altera séries de bilhetagem exportadas');
  const affected=rows.filter(r=>ids.has(r.id));assert.equal(affected.length,42);
  for(const r of affected){assert.equal(r.valor,null);assert.equal(r.evidencia.normalized_value,null);assert.equal(r.evidencia.display_value,null);assert.equal(r.status_declarado,'SUSPENSO_ERRO_COLUNA');assert.ok(r.evidencia.raw_value,'Preservar evidência forense');}
  for(const subset of [...(!remote&&!offline&&cat==='todas'&&mode==='anual'?[rows,rows.filter(r=>r.evidencia.family==='transporte_bilhetagem')]:[]),affected,affected.filter(r=>r.competencia==='2026-09'),affected.filter(r=>r.competencia==='2026-11')]){
   const parsed=parseCsv(c.serializeRadarHubCsv(subset));const keys=parsed.shift(),idCol=keys.indexOf('id'),valueCol=keys.indexOf('valor'),statusCol=keys.indexOf('status_declarado');
   assert.equal(parsed.length,subset.length);for(const r of parsed)if(ids.has(r[idCol])){assert.equal(r[valueCol],'');assert.equal(r[statusCol],'SUSPENSO_ERRO_COLUNA');}
  }
 }
 for(const i of c.getRadarHubExport().indicators){const native=pkg.metadataRegistry.indicators.find(r=>r.indicator_id===i.id);assert.equal(i.competencia,native.competencia??native.base_year??null);if(native.audit_status.startsWith('SUSPENSO'))assert.equal(i.valor,null);}
 console.log(`PASS fechamento: remoto=${remote}, offline=${offline}; 8 eixos, 42 IDs, 6 combinações de filtros, CSV/JSON, carga concorrente e sem duplicação padrão.`);
}
(async()=>{for(const remote of [false,true])for(const offline of [false,true])await run(remote,offline)})().catch(e=>{console.error(e);process.exitCode=1});
