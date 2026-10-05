// Read-only smoke test: real Supabase fetch, real Chart.js and the existing plugins.
const fs = require('node:fs'), assert = require('node:assert/strict');
const { chromium } = require('C:/Users/leose/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
async function run() {
  const js = fs.readFileSync('app.js', 'utf8'), html = fs.readFileSync('app.html', 'utf8');
  const config = { url: js.match(/const SUPABASE_URL = "([^"]+)"/)[1], key: js.match(/const SUPABASE_ANON_KEY = "([^"]+)"/)[1] };
  const scripts = [...html.matchAll(/<script src="(https:\/\/cdn\.jsdelivr\.net\/npm\/chart[^\"]+)"/g)].map(m => m[1]);
  const libraries = await Promise.all(scripts.map(async url => { const response = await fetch(url, { signal: AbortSignal.timeout(20000) }); if (!response.ok) throw new Error('Chart dependency unavailable.'); return response.text(); }));
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().url().startsWith(config.url + '/rest/v1/respostas_pesquisa?') && route.request().method() === 'GET' ? route.continue() : route.abort());
    await page.setContent(html.replace(/<script\b[\s\S]*?<\/script>/gi, ''), { waitUntil: 'domcontentloaded', timeout: 10000 });
    for (const library of libraries) await page.addScriptTag({ content: library });
    for (const file of ['report-metrics.js', 'report-source.js', 'report-bindings.js', 'report-metrics-ui.js']) await page.addScriptTag({ content: fs.readFileSync(file, 'utf8') });
    const end = js.indexOf('// MÓDULO DO CONSULTOR ESTRATÉGICO IA');
    await page.addScriptTag({ content: 'const executiveChartInstances = {}; Chart.register(ChartDataLabels);\n' + js.slice(js.indexOf('function renderReportChartSankey'), end - 48) });
    const proof = await page.evaluate(async config => {
      await RadarReportUI.render({ ...config, bar: renderReportChartBar, sankey: renderReportChartSankey });
      const audit = RadarReportUI.audit();
      return { state: audit.state, N: audit.N, n: audit.n, percent: document.getElementById('rep-val-orgulho').textContent, charts: Object.entries(executiveChartInstances).map(([id, chart]) => ({ id, type: chart.config.type, data: chart.data.datasets[0].data.length, width: chart.width, height: chart.height })), source: audit.provenance?.table };
    }, config);
    assert.equal(proof.state, 'READY'); assert.equal(proof.N, 477); assert.equal(proof.percent, '74,2%'); assert.equal(proof.charts.length, 5); assert(proof.charts.every(c => c.width > 0 && c.height > 0 && c.data > 0)); assert.deepEqual(errors, []);
    fs.writeFileSync('tmp/report-metrics-phase3-tests/live-browser.json', JSON.stringify(proof, null, 2));
    console.log(JSON.stringify({ liveSource: 'PASS', chartRendering: 'PASS', N: proof.N, charts: proof.charts.length, errors: errors.length }));
  } finally { await browser.close(); }
}
if (require.main === module) run().catch(e => { console.error(e.message); process.exitCode = 1; });
module.exports = { run };
