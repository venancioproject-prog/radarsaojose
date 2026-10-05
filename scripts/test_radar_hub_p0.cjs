const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root,'radar_hub_controller.js'),'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root,'data/radar_hub/radar_hub_package.json')));
async function run(mode) {
  const calls = [];
  const charts = new Map();
  const elements = new Map();
  function el(id) {
    return {id,textContent:'',children:[],style:{},dataset:{},getContext:()=>({id,createLinearGradient:()=>({addColorStop(){}})}),classList:{add(){},remove(){},contains(){return false;}},
      appendChild(e){this.children.push(e);elements.set(e.id,e);},querySelector(){return this.content;}};
  }
  for(const id of ['hub-audit-status-text','hub-audit-validity-text','hub-kpi-emprego','hub-kpi-emprego-reference','hub-audit-modal']) elements.set(id,el(id));
  elements.get('hub-kpi-emprego').parentNode=el('parent');
  elements.get('hub-audit-modal').content=el('content');
  class Chart {
    static defaults={font:{},plugins:{legend:{labels:{}},tooltip:{}}};
    static register(){}
    constructor(ctx,config){charts.set(ctx.id,config);this.id=ctx.id;}
    destroy(){charts.delete(this.id);}
  }
  const sandbox = {setTimeout:fn=>fn(),sessionStorage:{getItem:()=>null,setItem(){}},console:{log(){},warn(){}},document:{getElementById:id=>elements.get(id),querySelectorAll:()=>[],
    createElement:()=>el(''),addEventListener(){}},fetch:async url=>{
      calls.push(url);
      if(['throw','missing','employment'].includes(mode)) throw Error('offline');
      if(mode==='404') return {ok:false};
      if(mode==='invalid-json') return {ok:true,json:async()=>{throw Error('JSON inválido');}};
      const p = structuredClone(pkg);
      if(mode==='mixed') p.metadataRegistry.indicators[0].value=999;
      if(mode==='old') p.dataset_version='old';
      return {ok:true,json:async()=>p};
    }};
  sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(code,sandbox);
  if(mode==='missing') {
    sandbox.Chart=Chart;
    for(const id of ['hubChartMeioAmbienteAr','hubChartEconomiaEmprego','hubChartMobilidadeFatalidades']) elements.set(id,el(id));
    // Injeção de falhas só no sandbox: não modifica os arquivos de dados.
    vm.runInContext(`
      RADAR_HUB_PACKAGE.groundTruth.eixos.meio_ambiente.qualidade_ar_cetesb_mensal_2023_2024['2024']=[{jd_satelite_dias_bom:null},{jd_satelite_dias_bom:0}];
      RADAR_HUB_PACKAGE.groundTruth.eixos.economia.novo_caged_serie_mensal.filter(r=>r.ano===2026)[0].saldo=null;
      RADAR_HUB_PACKAGE.groundTruth.eixos.economia.novo_caged_serie_mensal.filter(r=>r.ano===2026)[1].saldo=0;
      RADAR_HUB_PACKAGE.groundTruth.eixos.mobilidade.fatalidades_transito_mensal_2023_2024['2024']=[{fatalidades:null},{fatalidades:0}];
    `,sandbox);
  }
  if(mode==='employment') {
    vm.runInContext(`
      RADAR_HUB_PACKAGE.metadataRegistry.indicators.push(
        {indicator_id:'econ_caged_estoque_2025',audit_status:'CONFIRMADO',base_year:'2025',value:50,evidencia:{valor:50,url:'fixture',competencia:'01/2025',parcial:true}},
        {indicator_id:'econ_caged_estoque_2024',audit_status:'CONFIRMADO',base_year:'2024',value:40,evidencia:{valor:40,url:'fixture',competencia:'12/2024'}}
      );
      RADAR_HUB_PACKAGE.groundTruth.eixos.economia.emprego_formal_novo_caged.estoque_carteiras_assinadas_2025=50;
      RADAR_HUB_PACKAGE.groundTruth.eixos.economia.emprego_formal_novo_caged.estoque_carteiras_assinadas_2024=40;
    `,sandbox);
  }
  await Promise.all([sandbox.initRadarHub(),sandbox.initRadarHub()]);
  assert.equal(calls.length,1,'carga única concorrente');
  assert.equal(calls[0],'data/radar_hub/radar_hub_package.json');
  const exported=sandbox.getRadarHubExport();
  if(mode==='online') {
    const out=path.join(root,'docs/dados-publicos-revisao',pkg.financasAudit ? 'p2-financas/compatibilidade-p0' : 'p1-economia');
    fs.mkdirSync(out,{recursive:true});
    fs.writeFileSync(path.join(out,'exportacao-verificada.json'),JSON.stringify(exported,null,2));
    fs.writeFileSync(path.join(out,'exportacao-verificada.csv'),sandbox.serializeRadarHubCsv(exported.indicators));
  }
  assert.equal(exported.dataset_version,pkg.dataset_version);
  assert.equal(exported.indicators.length,pkg.metadataRegistry.indicators.length+(mode==='employment'?2:0));
  assert.equal(exported.indicators[0].valor,pkg.metadataRegistry.indicators[0].value);
  assert.equal(exported.audit_status,'AUDITORIA_NAO_CARREGADA');
  assert.match(elements.get('hub-audit-status-text').textContent,/Auditoria não carregada/);
  assert.equal(elements.get('hub-kpi-emprego').textContent,pkg.economiaAudit.indicators.econ_caged_estoque_2026_08.value.toLocaleString('pt-BR'));
  assert.match(elements.get('hub-kpi-emprego-reference').textContent,/2026-08/);
  sandbox.openAuditReportModal();
  assert.match(elements.get('hub-audit-modal').content.children.map(x=>x.textContent).join(' '),/Sem vínculo comprovado/);
  const csv=sandbox.serializeRadarHubCsv([{id:'a,"b\nc',valor:0,nome:'á'},{id:'missing',valor:null}]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('\r\n'));
  assert.ok(csv.includes('"a,""b\nc"'));
  assert.ok(csv.includes('"0"'));
  assert.ok(!csv.includes('\\n'));
  if(mode==='missing') {
    for(const [axis,chart] of [['meio_ambiente','hubChartMeioAmbienteAr'],['economia','hubChartEconomiaEmprego'],['mobilidade','hubChartMobilidadeFatalidades']]) {
      sandbox.switchRadarHubAxis(axis);
      if(axis==='mobilidade')sandbox.filterHubChart('mob_fatalidades','mode','mensal');
      const data=charts.get(chart).data.datasets[0].data;
      assert.equal(data[0],null,chart+': null preservado');
      assert.equal(data[1],0,chart+': zero preservado');
      const formatter=charts.get(chart).options.plugins.datalabels?.formatter;
      if(formatter) assert.doesNotThrow(()=>formatter(null));
    }
  }
  console.log(mode+': pacote atômico, auditoria ausente, emprego conflitante, CSV e concorrência OK');
}
(async()=>{for(const mode of ['online','throw','404','invalid-json','mixed','old','missing','employment']) await run(mode);})().catch(e=>{console.error(e);process.exitCode=1;});
