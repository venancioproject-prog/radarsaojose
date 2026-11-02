const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pkg=JSON.parse(fs.readFileSync(path.join(root,'data/radar_hub/radar_hub_package.json'))),code=fs.readFileSync(path.join(root,'radar_hub_controller.js'),'utf8');
async function run(offline,missing=false){
 const elements=new Map(),charts=new Map();function el(id=''){return {id,textContent:'',innerHTML:'',style:{},dataset:{},classList:{add(){},remove(){},contains(){return false}},getContext:()=>({id,createLinearGradient:()=>({addColorStop(){}})}),parentNode:{appendChild:x=>elements.set(x.id,x)}}}
 for(const id of ['hubChartEconomiaPib','hubChartEconomiaEmprego','hubChartEconomiaEmpresas','hubChartEconomiaSetores','hub-econ-caged-year','hub-kpi-emprego','hub-kpi-emprego-reference','hub-econ-pib-total','hub-econ-pib-pc','hub-econ-empresas','drawer-audit-status','drawer-val','drawer-year','drawer-evid-trecho'])elements.set(id,el(id));
 class Chart{constructor(ctx,c){charts.set(ctx.id,c)}destroy(){}static defaults={font:{},plugins:{legend:{labels:{}},tooltip:{}}};static register(){}}
 const context={Chart,document:{getElementById:id=>elements.get(id)||null,querySelectorAll:()=>[],createElement:()=>el(),addEventListener(){}},console:{log(){},warn(){},error(){}},setTimeout:f=>f(),sessionStorage:{getItem:()=>null,setItem(){}},fetch:async url=>{if(offline)throw Error('offline');return {ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,url)))}}};context.window=context;context.RADAR_HUB_VERIFY_ONLINE_PACKAGE=true;
 let src=code;
 if(missing){const p=JSON.parse(JSON.stringify(pkg));p.groundTruth.eixos.economia.novo_caged_serie_mensal.filter(r=>r.ano===2026)[0].saldo=null;p.groundTruth.eixos.economia.novo_caged_serie_mensal.filter(r=>r.ano===2026)[1].saldo=0;src=src.replace(/const RADAR_HUB_PACKAGE = .*?;\r?\n\/\* RADAR_HUB_PACKAGE_END/s,'const RADAR_HUB_PACKAGE = '+JSON.stringify(p)+';\n/* RADAR_HUB_PACKAGE_END');}
 vm.createContext(context);vm.runInContext(src,context);await context.initRadarHub();context.switchRadarHubAxis('economia');
 const config=()=>charts.get('hubChartEconomiaEmprego');
 assert.deepEqual(Array.from(charts.get('hubChartEconomiaPib').data.labels),pkg.groundTruth.eixos.economia.pib_serie_historica.map(r=>String(r.ano)));
 assert.equal(charts.has('hubChartEconomiaEmpresas'),false);assert.match(elements.get('hub-econ-empresas').textContent,/não disponível/);
 const stocks=pkg.metadataRegistry.indicators.find(i=>i.indicator_id==='econ_caged_estoque_2026_08');assert.equal(elements.get('hub-kpi-emprego').textContent,stocks.value.toLocaleString('pt-BR'));assert.match(elements.get('hub-kpi-emprego-reference').textContent,/2026-08/);
 const years=[...new Set(pkg.groundTruth.eixos.economia.novo_caged_serie_mensal.map(r=>String(r.ano)))];assert.deepEqual([...elements.get('hub-econ-caged-year').innerHTML.matchAll(/value="(\d+)"/g)].map(x=>x[1]),years);
 if(missing){assert.equal(config().data.datasets[0].data[0],null);assert.equal(config().data.datasets[0].data[1],0);}
 context.filterHubChart('econ_caged','ano','2021');context.filterHubChart('econ_caged','metrica','estoque');assert.deepEqual(Array.from(config().data.datasets[0].data),pkg.groundTruth.eixos.economia.novo_caged_serie_mensal.filter(r=>r.ano===2021).map(r=>r.estoque));
 context.filterHubChart('econ_caged','ano','1990');assert.ok(config().data.labels.every(x=>x.startsWith('2026-')));
 context.filterHubChart('econ_caged','mode','anual');assert.deepEqual(Array.from(config().data.labels),['2020','2021','2022','2023','2024','2025','2026 parcial até agosto']);
 context.openIndicatorMetadata('econ_caged_estoque_2024');assert.equal(elements.get('drawer-year').textContent,'2024-12');context.openIndicatorMetadata('econ_pib_municipal');assert.match(elements.get('drawer-audit-status').textContent,/VALIDADO_EXTERNAMENTE/);
 const exp=context.getRadarHubExport();for(const ind of pkg.metadataRegistry.indicators.filter(i=>i.category==='economia')){const row=exp.indicators.find(r=>r.id===ind.indicator_id);assert.equal(row.valor,ind.value);assert.equal(row.competencia,ind.competencia);assert.equal(row.status_declarado,ind.audit_status);assert.equal(row.url,ind.official_url)}
 const csv=context.serializeRadarHubCsv(exp.indicators);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"NAO_VERIFICADO"'));
 if(!missing){fs.writeFileSync(path.join(root,'docs/dados-publicos-revisao/p1-economia/exportacao-verificada.json'),JSON.stringify(exp,null,2));fs.writeFileSync(path.join(root,'docs/dados-publicos-revisao/p1-economia/exportacao-verificada.csv'),csv)}
 if(offline && !missing){
   vm.runInContext("RADAR_HUB_PACKAGE.metadataRegistry.indicators.find(i=>i.indicator_id==='econ_caged_estoque_2026_08').evidence_id='wrong-id'; RADAR_HUB_PACKAGE.metadataRegistry.indicators.find(i=>i.indicator_id==='econ_total_empresas_ativas').value=92140;",context);
   context.switchRadarHubAxis('economia');
   assert.equal(elements.get('hub-kpi-emprego').textContent,'Dado não disponível','evidência de outro ID não valida estoque');
   assert.equal(elements.get('hub-econ-empresas').textContent,'Dado não disponível','valor alegado sem validação não volta ao card');
 }
 console.log(`PASS ${offline?'offline':'online'}${missing?' null/zero':''}: cards, filtros, 22 anos, estoque, anual, ficha e exportação.`);
}
run(false).then(()=>run(true)).then(()=>run(true,true)).catch(e=>{console.error(e);process.exitCode=1});
