'use strict';
// Somente agregados editoriais selecionados; não imprime nem exporta respostas individuais.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const M = require('../report-metrics');
const root = path.resolve(__dirname, '..');
const bytes = fs.readFileSync(path.join(root, 'dados_pesquisa_477.json'));
const rows = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
const engine = M.create(rows, { provider: 'local_snapshot' });
const specs = {
  young_rent: { field: 'home', options: ['Moro de aluguel mas quero uma casa própria'], filters: { age: '25 a 34 anos' } },
  rent: { field: 'home', options: ['Moro de aluguel mas quero uma casa própria'] },
  price: { field: 'barrier', options: ['É tudo muito caro'] },
  destination: { field: 'destination', options: ['Centro / Oeste (ex: Aquarius, Vila Adyana)'] },
  car: { field: 'transport', options: ['Carro próprio'] },
  bus: { field: 'transport', options: ['Ônibus'] },
  bus_low_income: { field: 'transport', options: ['Ônibus'], filters: { income: M.income[0] } },
  mobility_lacks: { field: 'lacks', options: ['Melhorar o ônibus e o trânsito'] },
  pride: { field: 'pride', options: ['Sim'] }
};
const metrics = Object.fromEntries(Object.entries(specs).map(([name, spec]) => {
  const result = engine.calculate(spec);
  if (result.valid < 10 || result.numerator < 10 || result.valid - result.numerator < 10) {
    throw new Error('Base insuficiente para divulgação editorial: ' + name);
  }
  return [name, { spec, valid: result.valid, numerator: result.numerator, value: result.value, formatted: result.formatted }];
}));
const result = {
  calculated_at: '2026-11-20', source: 'dados_pesquisa_477.json',
  source_sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  engine: 'report-metrics.js', engine_sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'report-metrics.js'))).digest('hex'),
  N: engine.N,
  scope: 'Retrato da base local utilizada nesta edição editorial; não certifica sincronia com o banco de produção. Percentuais entre respostas válidas de cada pergunta e recorte; transporte e demandas admitem múltiplas escolhas. Não extrapolar para toda a população municipal.',
  metrics
};
fs.writeFileSync(path.join(root, 'docs/blog/indicadores-report.json'), JSON.stringify(result, null, 2) + '\n');
console.log('9 indicadores agregados recalculados; base total: ' + engine.N + '.');
