// P1.1: contrato visual e exportação usando fontes P1 imutáveis; sem imagens.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),load=f=>fs.readFileSync(path.join(root,f),'utf8');
const pkg=JSON.parse(load('data/radar_hub/radar_hub_package.json'));
const evidence=JSON.parse(load('data/radar_hub/economia_evidence_2026-10-04.json'));
const emap=new Map(evidence.evidences.map(e=>[e.evidence_id,e]));
const html=load('app.html'),block=html.slice(html.indexOf('<div id="hub-axis-container-economia"'),html.indexOf('<!-- EIXO: EDUCAÇÃO BÁSICA',html.indexOf('<div id="hub-axis-container-economia"')));
const keys=['Pib','Nominal','Setores','Estrutura','Estoque','Saldo','Movimentacao','Anual','Empresas','Remuneracao'];
assert.equal((block.match(/<canvas /g)||[]).length,10);assert.equal((block.match(/id="eco-source-/g)||[]).length,10);
assert.equal((block.match(/class="text-xl sm:text-2xl font-black/g)||[]).length,7); // 6 KPIs + page title is excluded below by ID
// User-suspended numbers must never appear in this current presentation.
for(const text of ['92.140','51.240','25.180','6.920','5.080','214.042','2.512','54%','38%','Estrutura Empresarial por Porte'])assert.ok(!block.includes(text),text);
async function run(offline,missing=false){
 const elements=new Map(),charts=new Map();
 const element=id=>{const attrs=new Map(),classes=new Set();return {id,textContent:'',innerHTML:'',style:{},dataset:{},children:[],
 classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,on)=>{if(on)classes.add(x);else classes.delete(x)}},
 setAttribute:(k,v)=>attrs.set(k,v),getAttribute:k=>attrs.get(k),getContext:()=>({id,createLinearGradient:()=>({addColorStop(){}})}),appendChild:x=>elements.set(x.id,x),parentNode:{appendChild:x=>elements.set(x.id,x)}}};
 for(const match of block.matchAll(/id="([^"]+)"/g))elements.set(match[1],element(match[1]));
 for(const id of ['drawer-indicator-name','drawer-audit-status','drawer-val','drawer-source','drawer-system','drawer-year','drawer-freq','drawer-geo','drawer-methodology','drawer-evidencia-box','drawer-evidencia-trecho','drawer-evidencia-data','drawer-evidencia-url','drawer-url-link','drawer-context-warning-text'])elements.set(id,element(id));
 class Chart{constructor(ctx,c){this.id=ctx.id;this.config=c;charts.set(ctx.id,c)}destroy(){charts.delete(this.id)}static defaults={font:{},plugins:{legend:{labels:{}},tooltip:{}}};static register(){}}
 let fetches=0;const context={document:{getElementById:id=>elements.get(id)||null,querySelectorAll:()=>[],createElement:()=>element(''),addEventListener(){}},Chart,console:{log(){},warn(){},error(){}},setTimeout:f=>f(),sessionStorage:{getItem:()=>null,setItem(){}},fetch:async url=>{fetches++;if(offline)throw Error('offline');assert.equal(url,'data/radar_hub/radar_hub_package.json');return {ok:true,json:async()=>JSON.parse(JSON.stringify(pkg))}}};context.window=context;context.RADAR_HUB_VERIFY_ONLINE_PACKAGE=true;
 vm.createContext(context);vm.runInContext(load('radar_hub_controller.js'),context);vm.runInContext(load('economia_visual.js'),context);
 if(missing)vm.runInContext(`RADAR_HUB_PACKAGE.groundTruth.eixos.economia.pib_serie_historica[0].pib_milhoes=null;RADAR_HUB_PACKAGE.groundTruth.eixos.economia.novo_caged_serie_mensal.filter(r=>r.ano===2026)[0].saldo=null;RADAR_HUB_PACKAGE.groundTruth.eixos.economia.novo_caged_serie_mensal.filter(r=>r.ano===2026)[1].saldo=0;`,context);
 await context.initRadarHub();context.switchRadarHubAxis('economia');assert.equal(fetches,1);
 const chart=key=>charts.get('hubChartEconomia'+key);
 assert.equal(charts.size,10);
 for(const [key,type] of [['Pib','line'],['Nominal','bar'],['Setores','bar'],['Estrutura','line'],['Estoque','line'],['Saldo','bar'],['Movimentacao','bar'],['Anual','bar'],['Empresas','bar'],['Remuneracao','line']])assert.equal(chart(key).type,type,key);
 assert.equal(chart('Setores').options.indexAxis,'y');assert.equal(chart('Setores').data.datasets.length,5);assert.equal(chart('Setores').options.scales.x.max,100);
 assert.equal(chart('Estrutura').data.datasets.length,5);assert.equal(chart('Estoque').data.labels.length,80);
 assert.equal(chart('Pib').data.labels.length,22);assert.equal(chart('Nominal').data.labels.length,21);
 assert.equal(chart('Movimentacao').data.datasets.length,2);assert.equal(chart('Empresas').data.datasets.length,2);
 for(const key of keys){const footer=elements.get('eco-source-'+key).innerHTML;assert.match(footer,/Fonte:/);assert.match(footer,/target="_blank" rel="noopener noreferrer"/);const urls=[...footer.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));assert.ok(urls.length);for(const url of urls)assert.ok(evidence.source_accesses.some(a=>a.status_code===200 && a.url===url),url);}
 assert.match(elements.get('hub-econ-pib-total').textContent,/61,4/);assert.match(elements.get('hub-kpi-emprego-reference').textContent,/ago\/2026/);
 assert.ok(chart('Anual').data.labels.at(-1).endsWith('*'));assert.match(elements.get('eco-insight-Anual').textContent,/parcial até ago/);
 assert.deepEqual(Array.from(chart('Empresas').data.labels),['2022','2023','2024']);
 const pid=chart('Pib').data.datasets[0].data;if(missing){assert.equal(pid[0],null);assert.equal(chart('Nominal').data.datasets[0].data[0],null);assert.equal(chart('Saldo').data.datasets[0].data[0],null);assert.equal(chart('Saldo').data.datasets[0].data[1],0)}
 context.filterEconomiaVisual('pib','per_capita');assert.equal(chart('Pib').data.datasets.length,1);assert.equal(chart('Pib').data.datasets[0].data.at(-1),pkg.groundTruth.eixos.economia.pib_serie_historica.at(-1).pib_per_capita);
 context.filterEconomiaVisual('salary','sm');assert.deepEqual(Array.from(chart('Remuneracao').data.datasets[0].data),pkg.groundTruth.eixos.economia.cempre_serie.filter(r=>r.variable_id==='1606').map(r=>r.value));
 context.filterEconomiaVisual('saldoYear','2020');assert.equal(chart('Saldo').data.labels.length,12);
 context.filterEconomiaVisual('movementYear','2026');assert.equal(chart('Movimentacao').data.labels.length,8);
 context.filterEconomiaVisual('composition','2002');assert.deepEqual(Array.from(chart('Setores').data.labels),[missing?'2021':'2002']);
 context.filterEconomiaVisual('composition','2023');assert.deepEqual(Array.from(chart('Setores').data.labels),[missing?'2021':'2002'],'ano não publicado não entra no filtro');
 for(const key of keys){context.openEconomiaVisualMetadata(key);assert.match(elements.get('drawer-methodology').textContent,/3549904/);assert.ok(elements.get('drawer-year').textContent);assert.ok(elements.get('drawer-evidencia-data').textContent);assert.ok(elements.get('drawer-url-link').href.startsWith('https://'));}
 context.openEconomiaVisualMetadata('Nominal');assert.match(elements.get('drawer-audit-status').textContent,/Calculado/);assert.match(elements.get('drawer-methodology').textContent,/PIB atual/);
 const exported=context.getRadarHubExport();assert.equal(exported.indicators.length,pkg.metadataRegistry.indicators.length);assert.equal(exported.economia_series.length,525);
 for(const row of exported.economia_series){assert.ok(row.url);assert.ok(row.unidade);assert.ok(row.competencia);assert.ok(row.evidencia.ids.length);for(const id of row.evidencia.ids)assert.ok(emap.has(id),id);if(row.valor!=null && row.status_declarado==='VALIDADO_EXTERNAMENTE')assert.ok(row.evidencia.ids.every(id=>emap.get(id).status==='VALIDADO_EXTERNAMENTE'));}
 if(!missing){
  for(const row of exported.economia_series){const es=row.evidencia.ids.map(id=>emap.get(id));let expected;
   if(row.id==='eco_serie_pib_total')expected=es[0].display_value/1000;
   else if(row.id.startsWith('eco_participacao_'))expected=100*es[0].display_value/es[1].display_value;
   else if(row.id==='eco_variacao_nominal')expected=(es[0].display_value/es[1].display_value-1)*100;
   else if(row.id.startsWith('eco_anual_') && row.status_declarado==='CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS')expected=es.reduce((a,e)=>a+e.display_value,0);
   else expected=es[0].display_value;
   assert.ok(Math.abs(row.valor-expected)<1e-7,row.id+' '+row.competencia);
  }
  fs.writeFileSync(path.join(root,'docs/dados-publicos-revisao/p1-1-economia/exportacao-series.json'),JSON.stringify(exported.economia_series,null,2));
  fs.writeFileSync(path.join(root,'docs/dados-publicos-revisao/p1-1-economia/exportacao-series.csv'),context.serializeRadarHubCsv(exported.economia_series));
 }
 context.switchRadarHubAxis('saude');assert.equal(context.getRadarHubExport().economia_series,undefined,'exportação dos demais eixos preservada');
 console.log(`PASS ${offline?'offline':'online'}${missing?' null/zero':''}: 6 KPIs, 10 gráficos, fontes P1, filtros, tooltips, fichas e 525 registros exportáveis.`);
}
run(false).then(()=>run(true)).then(()=>run(true,true)).catch(e=>{console.error(e);process.exitCode=1});
