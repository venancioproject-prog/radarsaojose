const assert = require('node:assert/strict');
const fs = require('node:fs');
const M = require('../report-metrics.js');
const S = require('../report-source.js');

function fixture(id, values) {
  return Object.fromEntries([['id', id], ...Object.entries(values).map(([key, value]) => [M.fields[key].keys[1], value])]);
}
async function run() {
  assert.deepEqual(M.splitMultiple('Apps de transporte (Uber, 99), Ônibus, Ônibus'), ['Apps de transporte (Uber, 99)', 'Ônibus']);
  const f = [fixture(1, { pride: ' Sim ', comparison: 'Não sei dizer', transport: ['Ônibus', 'Ônibus'] }), fixture(2, { pride: null, comparison: '', transport: 'Carro próprio' }), fixture(3, { pride: 'Não', comparison: 'São melhores', transport: '' })];
  const e = M.create(f);
  assert.equal(e.metric('pride').value, 50);
  assert.equal(e.metric('pride').missing, 1);
  assert.equal(e.distribution('comparison').valid, 2);
  assert.equal(e.distribution('transport').categories.find(x => x.category === 'Ônibus').numerator, 1);
  assert.equal(e.n, 3);
  assert.equal(M.create(f, {}, { region: 'Norte' }).metric('pride').value, null);
  const dup = M.eligibility(M.normalize([f[0], f[0]]));
  assert.equal(dup.N, 2); assert.equal(dup.duplicateIds.length, 1);
  const incompatible = M.create([fixture(1, { lacks: 'Não falta nada, Mais segurança' })]).distribution('lacks');
  assert.equal(incompatible.incompatible.length, 1);
  const scalar = M.create([fixture(1, { quality: '0' }), fixture(2, { quality: '5' }), fixture(3, { quality: '' })]).metric('quality');
  assert.equal(scalar.valid, 1); assert.equal(scalar.invalid.length, 1); assert.equal(scalar.missing, 1);
  const source = fs.readFileSync('app.js', 'utf8');
  const url = source.match(/const SUPABASE_URL = "([^"]+)"/)[1];
  const key = source.match(/const SUPABASE_ANON_KEY = "([^"]+)"/)[1];
  const snapshot = await S.fetchSnapshot({ url, key, signal: AbortSignal.timeout(30000) });
  const full = M.create(snapshot.records, snapshot.metadata);
  const expected = { pride: '74,2%', external: '66,2%', spend: '69,6%', events_no: '60,0%', regular: '84,7%', culture_yes: '50,7%', price: '33,1%', no_place: '23,5%' };
  const initial = Object.entries(expected).map(([id, formatted]) => {
    const result = full.metric(id);
    assert.equal(result.formatted, formatted, `${id}: investigate official data changes; never force the result.`);
    assert.equal(result.N, 477);
    return result;
  });
  console.log(JSON.stringify({ lot: 'A', N: full.N, metrics: initial.map(m => ({ id: m.metric_id, valid: m.valid, numerator: m.numerator, raw: m.value, formatted: m.formatted })) }));
  fs.mkdirSync('tmp/report-metrics-phase3-tests', { recursive: true });
  fs.writeFileSync('tmp/report-metrics-phase3-tests/reproduction.json', JSON.stringify({ purpose: 'Generated test evidence; NOT an operational data source.', source: snapshot.metadata, metrics: initial }, null, 2));
  return { snapshot, full, initial };
}
if (require.main === module) run().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { run, fixture };
