const assert = require('node:assert/strict');
const fs = require('node:fs');
const M = require('../report-metrics.js');
const S = require('../report-source.js');
const B = require('../report-bindings.js');
async function run() {
  const { snapshot, full, initial } = await require('./test-report-metrics.cjs').run();
  // Lot B: question bases and critical indicators, independently checked counts.
  assert.equal(full.metric('comparison_better').valid, 473);
  assert.equal(full.metric('comparison_better').numerator, 214);
  assert.equal(full.metric('comparison_worse').numerator, 87);
  assert.equal(full.metric('micro').numerator, 102);
  assert.equal(full.metric('micro_bus').valid, 102);
  assert.equal(full.metric('micro_bus').numerator, 58);
  assert.equal(full.metric('retired_bus').formatted, '30,4%');
  assert.equal(full.distribution('home').valid, 470);
  assert.equal(full.distribution('local').valid, 474);
  assert.equal(full.distribution('pet').valid, 475);
  assert.equal(full.distribution('petScore').valid, 469);
  assert.equal(full.distribution('lacks').incompatible.length, 1);
  console.log('Lot B: valid bases, comparison direction and mobility passed.');
  // Lot C: original categories and segment-specific denominators.
  const women = full.cross('gender', 'home').find(c => c.segment === 'Mulher Cis');
  assert.equal(women.valid, 262);
  assert.equal(women.categories.find(c => c.category === 'Tenho Casa Própria').numerator, 113);
  assert.equal(women.categories.find(c => c.category === 'Moro de aluguel mas quero uma casa própria').numerator, 118);
  assert.equal(full.cross('region', 'future').length, 6);
  for (const region of full.cross('region', 'future')) {
    assert.deepEqual(region.categories.map(c => c.category).sort(), ['Do mesmo jeito', 'Melhorando', 'Piorando']);
    assert.equal(region.categories.reduce((s, c) => s + c.numerator, 0), region.valid);
  }
  const filters = [{ region: 'Norte' }, { age: '18 a 24 anos' }, { income: M.income[0] }, { work: 'Dono de empresa' }, { region: 'Norte', work: 'Dono de empresa' }];
  const samples = filters.map(filter => {
    const e = M.create(snapshot.records, snapshot.metadata, filter);
    const independent = M.normalize(snapshot.records).filter(row => Object.entries(filter).every(([f, v]) => row.values[f] === v));
    assert.equal(e.n, independent.length);
    const metrics = Object.keys(M.definitions).map(id => e.metric(id));
    metrics.forEach(r => { assert.deepEqual(r.filters, filter); assert(r.n <= e.n); assert(r.valid <= r.n); });
    return { filters: filter, N: e.N, n: e.n, metrics };
  });
  assert(samples[3].n < 20 && samples[3].n > 0);
  assert.equal(samples[3].n, 18);
  const empty = M.create(snapshot.records, snapshot.metadata, { age: 'INEXISTENTE' });
  assert.equal(empty.n, 0); assert.equal(empty.metric('pride').formatted, '—');
  console.log('Lot C: gender, region, income, age, small and empty bases passed.');
  // Lot D: every declared binding must use an existing question and an existing answer.
  const specs = Object.values(B.rules).flatMap(r => Object.values(r)).flat().filter(s => !s.name);
  specs.forEach(spec => {
    assert(M.fields[spec.field], spec.field);
    const actual = full.distribution(spec.field).categories.map(c => c.category);
    spec.options.forEach(option => assert(actual.includes(option), spec.field + ': unrecognized answer ' + option));
    Object.entries(spec.filters || {}).forEach(([field, values]) => (Array.isArray(values) ? values : [values]).forEach(value => assert(full.distribution(field).categories.some(c => c.category === value), field + ': unrecognized segment ' + value)));
    const r = full.calculate(spec); assert(r.valid <= r.n && r.n <= r.N);
  });
  let calls = 0;
  const fake = async (url, request) => { calls++; const from = Number(request.headers.Range.split('-')[0]); return { ok: true, headers: { get: () => `${from}-${from}/2` }, json: async () => [{ id: from + 1 }] }; };
  const cached = S.create({ url: 'https://example.invalid', key: 'test', fetchImpl: fake, pageSize: 1 });
  const [one, two] = await Promise.all([cached.load(), cached.load()]); assert.strictEqual(one, two); assert.equal(calls, 2);
  await cached.load(); assert.equal(calls, 2); await cached.load({ force: true }); assert.equal(calls, 4);
  await assert.rejects(S.fetchSnapshot({ url: '', key: '', fetchImpl: async () => ({ ok: true, headers: { get: () => '0-0/2' }, json: async () => [{ id: 1 }] }) }), /repeated identifier/);
  console.log('Lot D: declarative rules, paginated source and cache passed.');
  const proof = { purpose: 'Test evidence only; never an application data source.', source: snapshot.metadata, initial, critical: Object.keys(M.definitions).map(id => full.metric(id)), cross: { genderHome: full.cross('gender', 'home'), regionFuture: full.cross('region', 'future'), incomeExternal: full.cross('income', 'external') }, samples };
  fs.writeFileSync('tmp/report-metrics-phase3-tests/lots.json', JSON.stringify(proof, null, 2));
  return { snapshot, full, proof };
}
if (require.main === module) run().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { run };
