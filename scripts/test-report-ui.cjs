const fs = require('node:fs'), assert = require('node:assert/strict');
const { chromium } = require('C:/Users/leose/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const M = require('../report-metrics.js');
async function run() {
  const { snapshot, proof } = await require('./test-report-phase3.cjs').run();
  const current = fs.readFileSync('app.html', 'utf8'), baseline = fs.readFileSync('tmp/report-metrics-phase3-backup/app.resume.html', 'utf8');
  const includes = ['report-metrics.js', 'report-source.js', 'report-bindings.js', 'report-metrics-ui.js'].map(src => `  <script src="${src}?v=phase3-20261003"></script>\r\n`).join('');
  assert.equal(current.replace(includes, ''), baseline, 'HTML outside metric script includes must remain byte-identical.');
  const originalJS = fs.readFileSync('tmp/report-metrics-phase3-backup/app.js', 'utf8'), currentJS = fs.readFileSync('app.js', 'utf8');
  const before = 'window.renderExecutiveReportCharts = function', after = '// MÓDULO DO CONSULTOR ESTRATÉGICO IA';
  assert.equal(currentJS.slice(0, currentJS.indexOf(before)), originalJS.slice(0, originalJS.indexOf(before)));
  assert.equal(currentJS.slice(currentJS.indexOf(after)), originalJS.slice(originalJS.indexOf(after)));
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route('**/*', route => route.abort());
    await page.setContent(current.replace(/<script\b[\s\S]*?<\/script>/gi, ''), { waitUntil: 'domcontentloaded', timeout: 10000 });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const preservation = () => page.locator('#executive-report-view').evaluate(e => ({ text: e.textContent, articles: [...e.querySelectorAll(':scope > article')].map(a => a.className), media: [...e.querySelectorAll('img,video,source,iframe')].map(m => ({ tag: m.tagName, src: m.getAttribute('src'), classes: m.className })), quotes: [...e.querySelectorAll('blockquote')].map(q => q.textContent) }));
    const initial = await preservation();
    for (const path of ['report-metrics.js', 'report-source.js', 'report-bindings.js', 'report-metrics-ui.js']) await page.addScriptTag({ content: fs.readFileSync(path, 'utf8') });
    // Exercise the real chart adapters with captured configs; rendering geometry is unchanged.
    await page.addScriptTag({ content: `const executiveChartInstances = {}; globalThis.Chart = class { static controllers = {sankey:true}; constructor(ctx,config){this.config=config;globalThis.testCharts[ctx.canvas.id]=config;} destroy(){} }; globalThis.testCharts={};\n` + currentJS.slice(currentJS.indexOf('function renderReportChartSankey'), currentJS.indexOf(after) - 48) });
    await page.evaluate(records => {
      window.fetch = async () => ({ ok: true, headers: { get: () => '0-476/' + records.length }, json: async () => records });
    }, snapshot.records);
    const audits = [];
    for (const filter of [{}, ...proof.samples.map(s => s.filters), { age: 'INEXISTENTE' }]) {
      const audit = await page.evaluate(async filters => {
        await RadarReportUI.render({ url: 'https://example.invalid', key: 'test', filters, bar: renderReportChartBar, sankey: renderReportChartSankey });
        return RadarReportUI.audit();
      }, filter);
      assert.equal(audit.state, 'READY');
      const e = M.create(snapshot.records, snapshot.metadata, filter);
      assert.equal(audit.n, e.n);
      for (const binding of audit.bindings.filter(b => b.spec)) {
        assert.deepEqual(binding.result.filters, filter);
        assert.equal(binding.displayed, binding.result.formatted);
        if (binding.result.rule?.options) binding.result.rule.options.forEach(option => assert(e.distribution(binding.result.field).categories.some(c => c.category === option) || e.n === 0 || binding.result.valid === 0 || M.create(snapshot.records).distribution(binding.result.field).categories.some(c => c.category === option), 'Unknown option: ' + option));
      }
      const chartChecks = await page.evaluate(() => Object.entries(testCharts).map(([id, config]) => {
        if (config.type === 'sankey') return config.data.datasets[0].data.every(raw => config.options.plugins.tooltip.callbacks.label({ raw }).endsWith(raw.formatted));
        const d = RadarReportUI.audit().charts[id];
        return config.data.datasets[0].data.every((raw, i) => raw === d.categories[i].value && config.options.plugins.tooltip.callbacks.label({ raw, dataIndex: i }).trim() === d.categories[i].formatted && config.options.plugins.datalabels.formatter(raw, { dataIndex: i }) === d.categories[i].formatted);
      }));
      assert(chartChecks.every(Boolean), 'Charts, labels and tooltips must use ready central results.');
      assert(await page.locator('[data-report-metric]').evaluateAll(es => es.every(el => el.dataset.validationStatus === 'NÃO_REPRODUZÍVEL' || el.title === el.textContent)), 'Public numerical tooltips repeat formatted results.');
      audits.push(audit);
    }
    const initialAudit = audits[0];
    assert(initialAudit.bindings.filter(b => [14, 28, 30].includes(b.block) && b.result?.field === 'comparison').every(b => b.displayed === '18,4%'));
    assert.equal(initialAudit.bindings.find(b => b.block === 24 && b.original === '46.5%').displayed, '39,7%');
    assert.equal(initialAudit.bindings.find(b => b.block === 26 && b.original === '55,6%').displayed, '45,0%');
    assert.equal(initialAudit.bindings.find(b => b.block === 21 && b.original === '44.6%').displayed, '30,4%');
    // Rapid filter changes: the last request owns the whole report.
    const race = await page.evaluate(async () => {
      await Promise.all([RadarReportUI.render({ filters: { region: 'Sul' } }), RadarReportUI.render({ filters: { work: 'Dono de empresa' } })]);
      return RadarReportUI.audit();
    });
    assert.deepEqual(race.filters, { work: 'Dono de empresa' }); assert.equal(race.n, 18);
    // Existing sidebar controls must reach the same authoritative filtered collection.
    await page.evaluate(() => { const select = document.getElementById('filter-region'); select.add(new Option('Norte', 'Norte')); select.value = 'Norte'; });
    const sidebar = await page.evaluate(async () => { await RadarReportUI.render({}); return RadarReportUI.audit(); });
    assert.deepEqual(sidebar.filters, { region: 'Norte' }); assert.equal(sidebar.n, 55);
    // Reconstruct original numeric tokens to compare all other report text exactly.
    await page.locator('[data-report-metric]').evaluateAll(elements => { elements.forEach(el => { el.textContent = el.dataset.reportOriginal; }); });
    const preserved = await preservation(); assert.deepEqual(preserved, initial, 'Media, quotations, chapter classes and all nonnumeric text preserved.');
    await page.evaluate(() => { window.fetch = async () => { throw new Error('Simulated source unavailable'); }; });
    const failure = await page.evaluate(async () => { await RadarReportUI.render({ force: true }); return RadarReportUI.audit(); });
    assert.equal(failure.state, 'SOURCE_ERROR'); assert(failure.bindings.filter(b => b.spec).every(b => b.displayed === '—'));
    assert.deepEqual(errors, []);
    fs.writeFileSync('tmp/report-metrics-phase3-tests/ui.json', JSON.stringify({ purpose: 'Technical test evidence; not an application source.', preservation: { htmlIdenticalExceptIncludes: true, unrelatedJSIdentical: true, reportTextAndMediaPreserved: true, articles: initial.articles.length, media: initial.media.length, quotes: initial.quotes.length }, audits, sourceFailure: failure.state }, null, 2));
    console.log(JSON.stringify({ ui: 'PASS', bindings: audits[0].bindings.length, pending: audits[0].unresolved.length, preservation: 'PASS', filters: audits.map(a => ({ filters: a.filters, n: a.n })), offline: 'PASS' }));
    return audits;
  } finally { await browser.close(); }
}
if (require.main === module) run().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { run };
