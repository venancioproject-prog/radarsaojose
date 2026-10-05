// P2.1: mesma apresentação online/offline, null, zero e ciclo de instâncias.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),load=f=>fs.readFileSync(path.join(root,f),'utf8');
const pkg=JSON.parse(load('data/radar_hub/radar_hub_package.json'));
const html=load('app.html'),block=html.slice(html.indexOf('<div id="hub-axis-container-financas"'),html.indexOf('<!-- EIXO: BENCHMARK',html.indexOf('<div id="hub-axis-container-financas"')));
async function run(offline,missing=false){
 const elements=new Map(),charts=new Map();let created=0,destroyed=0;
 const el=id=>({id,textContent:'',innerHTML:'',style:{},options:[],classList:{add(){},remove(){},toggle(){}},getContext:()=>({id,createLinearGradient:()=>({addColorStop(){}})}),parentElement:{style:{}},appendChild(){},parentNode:{appendChild(){}}});
 for(const m of block.matchAll(/id="([^"]+)"/g))elements.set(m[1],el(m[1]));
 for(const m of block.matchAll(/<select[^>]*id="([^"]+)"[^>]*>(.*?)<\/select>/gs))elements.get(m[1]).options=[...m[2].matchAll(/option value="([^"]+)"/g)].map(m=>({value:m[1]}));
 class Chart{constructor(canvas,c){assert.ok(!charts.has(canvas.id),'duplicate Chart');this.id=canvas.id;this.options=c.options;this.data=c.data;this.config=c;charts.set(this.id,this);created++;}destroy(){charts.delete(this.id);destroyed++;}static defaults={font:{},plugins:{legend:{labels:{}},tooltip:{}}};static register(){}}
 const c={document:{getElementById:id=>elements.get(id)||null,querySelectorAll:()=>[],createElement:()=>el(''),addEventListener(){}},Chart,console:{log(){},warn(){},error(){}},setTimeout:f=>f(),sessionStorage:{getItem:()=>null,setItem(){}},fetch:async()=>{if(offline)throw Error('offline');return {ok:true,json:async()=>JSON.parse(JSON.stringify(pkg))}}};c.window=c;vm.createContext(c);vm.runInContext(load('radar_hub_controller.js'),c);vm.runInContext(load('financas_visual.js'),c);
 if(missing)vm.runInContext("RADAR_HUB_PACKAGE.groundTruth.eixos.financas.series_orcamentarias_anuais[0].receita_realizada=null;RADAR_HUB_PACKAGE.groundTruth.eixos.financas.series_orcamentarias_anuais[1].receita_realizada=0",c);
 await c.initRadarHub();c.switchRadarHubAxis('financas');assert.equal(charts.size,12);
 const chart=k=>charts.get('hubChartFinancas'+k);
 if(missing){assert.equal(chart('Orcamento').data.datasets[0].data[0],null);assert.equal(chart('Orcamento').data.datasets[0].data[1],0);}
 assert.equal(chart('Resultado').data.datasets[0].data.at(-1),-133440022.16);
 const gap=chart('Divida').data.labels.indexOf('2025-RGF-Q3');assert.equal(chart('Divida').data.datasets[0].data[gap],null);
 const before=c.getFinancasVisualState().indexSize;
 for(let i=0;i<20;i++){c.filterFinancasVisual('budgetStage',i%2?'empenhada':'paga');assert.equal(charts.size,12);assert.equal(c.getFinancasVisualState().indexSize,before);}
 assert.equal(created-destroyed,12);
 const exportRows=c.getRadarHubExport().financas_series;assert.equal(exportRows.length,9777);
 for(const r of exportRows){assert.ok(r.url.startsWith('https://apidatalake.tesouro.gov.br/'));assert.ok(r.evidencia.exercise&&r.evidencia.period_number&&r.evidencia.family&&r.evidencia.statement);if(r.status_declarado==='NAO_VERIFICADO')assert.equal(r.valor,null);}
 const csv=c.serializeRadarHubCsv(exportRows);assert.ok(csv.includes('period_number')&&csv.includes('break_segment'));
 if(!offline){const out=path.join(root,'docs/dados-publicos-revisao/p2-1-financas');fs.writeFileSync(path.join(out,'exportacao-verificada.json'),JSON.stringify(exportRows));fs.writeFileSync(path.join(out,'exportacao-verificada.csv'),csv);}
 console.log(`PASS P2.1 ${offline?'offline':'online'}${missing?' null/zero':''}: KPIs, dados, 12 Chart sem duplicação, índice reutilizado, 9777 registros JSON/CSV.`);
}
run(false).then(()=>run(true)).then(()=>run(true,true)).catch(e=>{console.error(e);process.exitCode=1});
