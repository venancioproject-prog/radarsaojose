// Audit snapshot only. No writes to CSV, Supabase or application data.
const fs = require('node:fs');
const crypto = require('node:crypto');
const S = require('../report-source.js');
const M = require('../report-metrics.js');
function parseCSV(text) {
  const rows = []; let row = [], value = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(value); value = ''; }
    else if ((c === '\r' || c === '\n') && !quoted) { if (c === '\r' && text[i + 1] === '\n') i++; row.push(value); if (row.some(Boolean)) rows.push(row); row = []; value = ''; }
    else value += c;
  }
  if (quoted) throw new Error('Unclosed CSV quotation.');
  if (value || row.length) { row.push(value); rows.push(row); }
  return rows;
}
async function run() {
  const app = fs.readFileSync('app.js', 'utf8');
  const snapshot = await S.fetchSnapshot({ url: app.match(/const SUPABASE_URL = "([^"]+)"/)[1], key: app.match(/const SUPABASE_ANON_KEY = "([^"]+)"/)[1] });
  const bytes = fs.readFileSync('respostas.csv.csv');
  const [headers, ...rows] = parseCSV(bytes.toString('utf8').replace(/^\uFEFF/, ''));
  if (rows.some(row => row.length !== headers.length)) throw new Error('CSV column count mismatch.');
  const supKeys = Object.keys(snapshot.records[0]).filter(k => k !== 'id');
  const histogram = (values, normalize = true) => { const map = new Map(); values.forEach(v => { const clean = normalize ? M.clean(v) : String(v ?? ''); map.set(clean, (map.get(clean) || 0) + 1); }); return map; };
  const columns = headers.map((header, index) => {
    const key = supKeys.find(k => M.clean(k) === M.clean(header)) || supKeys.find(k => M.clean(header).startsWith(M.clean(k)));
    if (!key) return { csvColumn: header, status: 'UNMAPPED_COLUMN' };
    const csv = histogram(rows.map(r => r[index])), sup = histogram(snapshot.records.map(r => r[key]));
    const variants = [...new Set([...csv.keys(), ...sup.keys()])];
    const difference = variants.reduce((sum, value) => sum + Math.abs((csv.get(value) || 0) - (sup.get(value) || 0)), 0);
    const rawCsv = histogram(rows.map(r => r[index]), false), rawSup = histogram(snapshot.records.map(r => r[key]), false);
    const rawDifference = [...new Set([...rawCsv.keys(), ...rawSup.keys()])].reduce((sum, value) => sum + Math.abs((rawCsv.get(value) || 0) - (rawSup.get(value) || 0)), 0);
    return { csvColumn: header, supabaseField: key, status: difference ? 'DISTRIBUTION_DIFFERENCE' : rawDifference ? 'WHITESPACE_DIFFERENCE' : 'MATCH', minimumDifferentResponses: difference / 2, minimumRawDifferentResponses: rawDifference / 2, csvValid: rows.length - (csv.get('') || 0), supabaseValid: snapshot.records.length - (sup.get('') || 0) };
  });
  const result = { purpose: 'Audit only. No synchronization. Marginal distributions do not prove row identity.', csvFile: 'respostas.csv.csv', csvSHA256: crypto.createHash('sha256').update(bytes).digest('hex'), csvN: rows.length, supabaseN: snapshot.records.length, comparedAt: new Date().toISOString(), normalization: 'Whitespace only; response meanings unchanged.', columns, differences: columns.filter(c => c.status !== 'MATCH') };
  fs.writeFileSync('tmp/report-metrics-phase3-tests/csv-comparison.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ csvN: result.csvN, supabaseN: result.supabaseN, differences: result.differences }));
  return result;
}
if (require.main === module) run().catch(e => { console.error(e.message); process.exitCode = 1; });
module.exports = { run, parseCSV };
