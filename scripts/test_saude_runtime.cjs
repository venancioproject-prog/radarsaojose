// Regression tests of the real controller: online JSON and offline constants.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'radar_hub_controller.js'), 'utf8');
const gt = JSON.parse(fs.readFileSync(path.join(root, 'data/radar_hub/sjc_open_data_ground_truth.json')));

async function run(offline) {
  const elements = new Map();
  const charts = new Map();
  function element(id = '') {
    const classes = new Set();
    return {id, textContent: '', innerHTML: '', style: {}, dataset: {},
      classList: {add: (...xs) => xs.forEach(x => classes.add(x)), remove: (...xs) => xs.forEach(x => classes.delete(x)), contains: x => classes.has(x)},
      getContext: () => ({id, createLinearGradient: () => ({addColorStop() {}})}),
      parentNode: {appendChild: el => elements.set(el.id, el)},
    };
  }
  for (const id of ['Leitos','Mortalidade','Vacinas','Causas','Nascidos','Dengue','Internacoes','AtencaoBasica','Procedimentos']) {
    elements.set('hubChartSaude'+id, element('hubChartSaude'+id));
  }
  for (let i = 0; i < 4; i++) for (const kind of ['label','value']) {
    const id = `hub-saude-inter-${kind}-${i}`; elements.set(id, element(id));
  }
  for (const id of ['drawer-indicator-name','drawer-audit-status','drawer-val','drawer-methodology','hub-audit-status-text']) elements.set(id,element(id));
  class Chart {
    constructor(ctx, config) { this.config=config; charts.set(ctx.id, this); this.id=ctx.id; }
    destroy() { charts.delete(this.id); }
    static defaults = {font:{},plugins:{legend:{labels:{}},tooltip:{}}};
    static register() {}
  }
  const document = {getElementById: id => elements.get(id) || null, querySelectorAll: () => [],
    createElement: () => element(), addEventListener() {}};
  const context = {document, Chart, console:{log(){},warn(){},error(){}},
    setTimeout: fn => fn(), sessionStorage:{getItem:()=>null,setItem(){}},
    fetch: async url => {
      if (offline) throw new Error('offline test');
      const file = path.join(root, url);
      return {ok: fs.existsSync(file), json: async () => JSON.parse(fs.readFileSync(file))};
    }};
  context.window=context;
  vm.createContext(context); vm.runInContext(code,context);
  await context.initRadarHub(); context.switchRadarHubAxis('saude');
  const config = key => charts.get('hubChartSaude'+key)?.config;
  assert.equal(config('Leitos'),undefined);
  assert.equal(config('Nascidos'),undefined);
  assert.equal(config('Procedimentos'),undefined);
  assert.match(elements.get('fallback-hubChartSaudeLeitos').innerHTML,/em verificação/);
  assert.match(elements.get('fallback-hubChartSaudeNascidos').innerHTML,/7.463/);
  assert.deepEqual(Array.from(config('Mortalidade').data.datasets[0].data),[10,8.2,7.65]);
  context.filterHubChart('mortalidade_infantil','period','recente');
  assert.deepEqual(Array.from(config('Mortalidade').data.labels),['2024','2025']);
  assert.deepEqual(Array.from(config('Mortalidade').data.datasets[1].data),[9,9]);
  assert.doesNotThrow(() => config('Mortalidade').options.plugins.tooltip.callbacks.label({datasetIndex:0,dataIndex:0,parsed:{y:8.2}}));
  context.filterHubChart('saude_vacinas','ano','2025');
  assert.equal(config('Vacinas').data.datasets[0].data[1],91.67);
  assert.equal(config('Vacinas').data.datasets[0].data[2],null); // not zero
  assert.match(config('Vacinas').data.labels[1],/parcial/);
  context.filterHubChart('saude_causas','ano','2024');
  assert.match(config('Causas').data.datasets[0].label,/5.028/);
  context.filterHubChart('saude_internacoes','ano','2023');
  assert.match(elements.get('hub-saude-inter-label-0').textContent,/2023/);
  assert.match(elements.get('hub-saude-inter-value-0').textContent,/5.456/);
  context.filterHubChart('saude_internacoes','ano','serie');
  assert.deepEqual(Array.from(config('Internacoes').data.datasets[0].data),[32995,35282,37008,38738]);
  context.filterHubChart('saude_atencao_basica','view','cobertura');
  assert.deepEqual(Array.from(config('AtencaoBasica').data.datasets[0].data),[61.63,57.95]);
  assert.ok(config('AtencaoBasica').options.scales.y.min < 57.95);
  context.filterHubChart('saude_atencao_basica','view','consultas');
  assert.deepEqual(Array.from(config('AtencaoBasica').data.datasets[0].data),[978233,1285049]);
  context.filterHubChart('saude_dengue','period','recente');
  assert.match(config('Dengue').data.labels.at(-1),/SE 1–50/);
  assert.equal(config('Dengue').data.datasets[0].data.at(-1),98163);
  assert.equal(config('Dengue').data.datasets[0].data[1],null);
  context.openIndicatorMetadata('saude_causas_mortalidade');
  assert.match(elements.get('drawer-indicator-name').textContent,/Óbitos/);
  context.openIndicatorMetadata('saude_leitos_hospitalares_total');
  assert.match(elements.get('drawer-audit-status').textContent,/NÃO VERIFICADO/);
  // Repeated filters must destroy and recreate, not leave stale charts or cards.
  for (const year of ['2024','2023','2024']) context.filterHubChart('saude_internacoes','ano',year);
  assert.match(elements.get('hub-saude-inter-value-0').textContent,/5.053/);
  console.log(`${offline?'Offline':'JSON'}: gráficos, filtros, lacunas, tooltips e fichas OK`);
}
run(false).then(()=>run(true)).catch(e=>{console.error(e);process.exitCode=1;});
