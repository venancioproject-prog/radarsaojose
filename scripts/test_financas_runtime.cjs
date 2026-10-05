// P2: origem online/offline, ausência, zero, estágios e exportação; sem imagens.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=f=>fs.readFileSync(path.join(root,f),'utf8');
const pkg=JSON.parse(load('data/radar_hub/radar_hub_package.json'));
async function run(offline,missing=false){
 const elements=new Map(),charts=new Map(),gradient={addColorStop(){}};
 function el(id){return {id,textContent:'',innerHTML:'',style:{},children:[],classList:{add(){},remove(){},toggle(){}},getContext:()=>({id,createLinearGradient:()=>gradient}),appendChild(x){elements.set(x.id,x)},parentNode:{appendChild(x){elements.set(x.id,x)}}};}
 for(const id of ['hubChartFinancasSerie','hubChartFinancasFuncoes','hubChartFinancasReceitas','hubChartFinancasLRF','fin-p2-receita-2024','fin-p2-liquidada-2024','fin-p2-resultado-2023'])elements.set(id,el(id));
 const doc={getElementById:id=>elements.get(id)||null,querySelectorAll:()=>[],createElement:()=>el(''),addEventListener(){}};
 class Chart{constructor(ctx,c){charts.set(ctx.id,c);this.id=ctx.id;}destroy(){charts.delete(this.id)}static defaults={font:{},plugins:{legend:{labels:{}},tooltip:{}}};static register(){}}
 const context={document:doc,Chart,console:{log(){},warn(){},error(){}},sessionStorage:{getItem:()=>null,setItem(){}},setTimeout:f=>f(),fetch:async()=>{if(offline)throw Error('offline');return {ok:true,json:async()=>JSON.parse(JSON.stringify(pkg))}}};context.window=context;vm.createContext(context);vm.runInContext(load('radar_hub_controller.js'),context);
 if(missing)vm.runInContext(`RADAR_HUB_PACKAGE.groundTruth.eixos.financas.orcamento_serie_historica[0].receita_milhoes=null;RADAR_HUB_PACKAGE.groundTruth.eixos.financas.orcamento_serie_historica[1].receita_milhoes=0;RADAR_HUB_PACKAGE.groundTruth.eixos.financas.series_orcamentarias_anuais.find(r=>r.ano===2024).despesa_liquidada=null;`,context);
 await context.initRadarHub();context.switchRadarHubAxis('financas');
 const line=charts.get('hubChartFinancasSerie');assert.equal(line.type,'bar');assert.equal(line.data.labels.length,11);assert.equal(line.data.datasets[1].label,'Despesa Liquidada');assert.ok(!line.data.labels.includes(2026));
 if(missing){assert.equal(line.data.datasets[0].data[0],null);assert.equal(line.data.datasets[0].data[1],0);assert.equal(elements.get('fin-p2-liquidada-2024').textContent,'Dado não disponível');}
 else assert.match(elements.get('fin-p2-liquidada-2024').textContent,/4,77/);
 const balance=pkg.financasAudit.indicators.fin_superavit_orcamentario_2023;assert.ok(balance.value<0);assert.match(elements.get('fin-p2-resultado-2023').textContent,/-263,14/);
 assert.equal(charts.has('hubChartFinancasFuncoes'),false);assert.equal(charts.has('hubChartFinancasReceitas'),false);
 assert.equal(charts.get('hubChartFinancasLRF').data.datasets[0].data[2],pkg.financasAudit.indicators.fin_despesa_pessoal_rcl_pct.value);
 const exported=context.getRadarHubExport();assert.ok(exported.financas_series.length>8000);assert.equal(exported.economia_series,undefined);
 const unresolved=exported.indicators.find(r=>r.id==='fin_pessoal_despesacompessoaltotal_2025');assert.equal(unresolved.valor,null);assert.equal(unresolved.status_declarado,'NAO_VERIFICADO');assert.equal(unresolved.competencia,'2025-RGF-Q3');
 const nullSeries=exported.financas_series.find(r=>r.evidencia.evidence_id===unresolved.evidencia.evidence_id);assert.equal(nullSeries.valor,null);
 const csv=context.serializeRadarHubCsv([{id:'missing',valor:null},{id:'zero',valor:0}]);assert.ok(csv.includes('"zero","","","0"'));assert.ok(csv.includes('"missing","","",""'));
 if(!missing){fs.writeFileSync(path.join(root,'docs/dados-publicos-revisao/p2-financas/exportacao-verificada.json'),JSON.stringify(exported,null,2));fs.writeFileSync(path.join(root,'docs/dados-publicos-revisao/p2-financas/exportacao-verificada.csv'),context.serializeRadarHubCsv([...exported.indicators,...exported.financas_series]));}
 context.switchRadarHubAxis('saude');assert.equal(context.getRadarHubExport().financas_series,undefined);
 console.log(`PASS P2 ${offline?'offline':'online'}${missing?' null/zero':''}: cards, períodos, estágios, suspensão, exportação ${exported.financas_series.length} observações.`);
}
run(false).then(()=>run(true)).then(()=>run(true,true)).catch(e=>{console.error(e);process.exitCode=1});
