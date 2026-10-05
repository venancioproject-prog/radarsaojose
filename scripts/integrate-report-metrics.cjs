// Surgical integration with explicit boundaries. Never restores unrelated user changes.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const file = 'app.js', htmlFile = 'app.html';
let js = fs.readFileSync(file, 'utf8'), html = fs.readFileSync(htmlFile, 'utf8');
const start = js.indexOf('window.renderExecutiveReportCharts = function(records) {');
const end = js.indexOf('\nfunction renderReportChartDoughnut', start);
assert(start >= 0 && end > start);
const replacement = `window.renderExecutiveReportCharts = function() {
  renderExecutivePersonasCards();
  return window.RadarReportUI.render({
    url: SUPABASE_URL, key: SUPABASE_ANON_KEY,
    bar: renderReportChartBar, sankey: renderReportChartSankey,
    clear: () => {
      Object.keys(executiveChartInstances).forEach(id => {
        executiveChartInstances[id].destroy(); delete executiveChartInstances[id];
      });
    }
  });
};
`;
js = js.slice(0, start) + replacement + js.slice(end);
js = js.replace('return ` ${item.from} → ${item.to}: ${item.flow} fluxo`;', 'return ` ${item.from} → ${item.to}: ${item.formatted}`;');
js = js.replace('function renderReportChartBar(canvasId, labels, data, color, total) {', `function renderReportChartBar(canvasId, categories, color) {
  const labels = categories.map(c => c.category);
  const data = categories.map(c => c.value);`);
js = js.replace(`const val = context.raw || 0;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                return " " + pct + "%";`.replace(/\n/g, '\r\n'), 'return " " + categories[context.dataIndex].formatted;');
js = js.replace(`formatter: (value) => {
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
              return pct + "%";
            }`.replace(/\n/g, '\r\n'), 'formatter: (value, context) => categories[context.dataIndex].formatted');
assert(!js.slice(js.indexOf('function renderReportChartBar'), js.indexOf('// MÓDULO DO CONSULTOR ESTRATÉGICO IA', js.indexOf('function renderReportChartBar'))).includes('val / total'));
const anchor = '  <script src="app.js?v=20261003-shell"></script>';
assert(html.includes(anchor));
html = html.replace(anchor, ['report-metrics.js', 'report-source.js', 'report-bindings.js', 'report-metrics-ui.js'].map(src => `  <script src="${src}?v=phase3-20261003"></script>`).join('\r\n') + '\r\n' + anchor);
fs.writeFileSync(file, js); fs.writeFileSync(htmlFile, html);
console.log('Presentation renderer and four script includes integrated.');
