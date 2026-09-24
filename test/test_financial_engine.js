// =========================================================================
// RADAR SÃO JOSÉ - TESTES UNITÁRIOS DO MOTOR FINANCEIRO SEBRAE
// Valida todas as fórmulas de 5.1 a 5.13 e Construção de Cenários (6)
// =========================================================================

const assert = require('assert');

function calculateCompleteFinancials(planData) {
  const f = planData.financial_plan;

  // 5.1 Investimentos Fixos
  let totalFixosA = 0;
  (f.investimentos_fixos_a_maquinas || []).forEach(item => {
    item.total = (Number(item.qty) || 0) * (Number(item.unit_val) || 0);
    totalFixosA += item.total;
  });

  let totalFixosB = 0;
  (f.investimentos_fixos_b_moveis || []).forEach(item => {
    item.total = (Number(item.qty) || 0) * (Number(item.unit_val) || 0);
    totalFixosB += item.total;
  });

  let totalFixosC = 0;
  (f.investimentos_fixos_c_veiculos || []).forEach(item => {
    item.total = (Number(item.qty) || 0) * (Number(item.unit_val) || 0);
    totalFixosC += item.total;
  });

  const totalInvestimentosFixos = totalFixosA + totalFixosB + totalFixosC;

  // 5.3 Investimentos Pré-Operacionais
  let totalPreOperacional = 0;
  (f.pre_operational_investments || []).forEach(item => {
    totalPreOperacional += Number(item.val) || 0;
  });

  // 5.5 Estimativa de Faturamento Mensal
  let faturamentoMensalTotal = 0;
  let totalAssinantes = 0;
  (f.faturamento_produtos || []).forEach(p => {
    p.total = (Number(p.qty) || 0) * (Number(p.price) || 0);
    faturamentoMensalTotal += p.total;
    if (p.is_subscription) {
      totalAssinantes += Number(p.qty) || 0;
    }
  });
  const mrr = faturamentoMensalTotal;
  const arr = mrr * 12;

  // 5.6 & 5.8 CMV / Custos dos Materiais Diretos
  let cmvTotal = 0;
  (f.faturamento_produtos || []).forEach(p => {
    let custoUnitarioInsumos = 0;
    if (p.insumos && Array.isArray(p.insumos)) {
      p.insumos.forEach(ins => {
        ins.total = (Number(ins.qty) || 0) * (Number(ins.unit_cost) || 0);
        custoUnitarioInsumos += ins.total;
      });
    } else {
      custoUnitarioInsumos = Number(p.unit_cogs) || 0;
    }
    p.unit_cogs = custoUnitarioInsumos;
    p.cmd_total = (Number(p.qty) || 0) * custoUnitarioInsumos;
    cmvTotal += p.cmd_total;
  });

  // 5.7 Custos de Comercialização
  let subtotal1Impostos = 0;
  (f.custos_comercializacao_impostos || []).forEach(imp => {
    imp.faturamento = faturamentoMensalTotal;
    imp.total = ((Number(imp.pct) || 0) / 100) * faturamentoMensalTotal;
    subtotal1Impostos += imp.total;
  });

  let subtotal2GastosVendas = 0;
  (f.custos_comercializacao_vendas || []).forEach(gv => {
    gv.faturamento = faturamentoMensalTotal;
    gv.total = ((Number(gv.pct) || 0) / 100) * faturamentoMensalTotal;
    subtotal2GastosVendas += gv.total;
  });

  const totalComercializacao = subtotal1Impostos + subtotal2GastosVendas;
  const custosVariaveisTotais = cmvTotal + totalComercializacao;

  // 5.9 Custos com Mão de Obra
  let totalMaoDeObra = 0;
  (f.mao_de_obra || []).forEach(mo => {
    mo.encargos_val = ((Number(mo.encargos_pct) || 0) / 100) * (Number(mo.salario) || 0);
    mo.total_funcao = ((Number(mo.salario) || 0) + mo.encargos_val) * (Number(mo.num_empregados) || 0);
    totalMaoDeObra += mo.total_funcao;
  });

  // 5.10 Depreciação
  let totalDepreciacaoMensal = 0;
  (f.depreciacao_ativos || []).forEach(dep => {
    const vidaUtil = Number(dep.vida_util_anos) || 5;
    dep.depreciacao_anual = (Number(dep.valor_bem) || 0) / vidaUtil;
    dep.depreciacao_mensal = dep.depreciacao_anual / 12;
    totalDepreciacaoMensal += dep.depreciacao_mensal;
  });

  // 5.11 Custos Fixos Operacionais Mensais
  let totalCustosFixosOperacionais = 0;
  (f.custos_fixos_operacionais || []).forEach(cf => {
    totalCustosFixosOperacionais += Number(cf.custo_mensal) || 0;
  });
  const totalCustosFixos = totalCustosFixosOperacionais + totalMaoDeObra + totalDepreciacaoMensal;

  // 5.2 Capital de Giro & Caixa Mínimo
  let totalEstoqueInicial = 0;
  (f.estoque_inicial || []).forEach(est => {
    est.total = (Number(est.qty) || 0) * (Number(est.unit_val) || 0);
    totalEstoqueInicial += est.total;
  });

  // Prazos Médios (Passos 1 a 4)
  let pmv = 0;
  (f.prazos_vendas || []).forEach(pv => {
    pv.media_ponderada = ((Number(pv.pct_vendas) || 0) / 100) * (Number(pv.dias) || 0);
    pmv += pv.media_ponderada;
  });

  let pmc = 0;
  (f.prazos_compras || []).forEach(pc => {
    pc.media_ponderada = ((Number(pc.pct_compras) || 0) / 100) * (Number(pc.dias) || 0);
    pmc += pc.media_ponderada;
  });

  const nme = Number(f.necessidade_dias_estoque) || 0;
  const subtotal1Prazos = pmv + nme;
  const subtotal2Prazos = pmc;
  const necessidadeLiquidaDias = subtotal1Prazos - subtotal2Prazos;

  // Passo 5: Caixa Mínimo
  const custoTotalEmpresaMensal = totalCustosFixos + custosVariaveisTotais;
  const custoTotalDiario = custoTotalEmpresaMensal / 30;
  const caixaMinimo = Math.max(0, custoTotalDiario * necessidadeLiquidaDias);
  const totalCapitalDeGiro = totalEstoqueInicial + caixaMinimo;

  // 5.4 Investimento Total
  const investimentoTotal = totalInvestimentosFixos + totalCapitalDeGiro + totalPreOperacional;

  // 5.12 Demonstrativo de Resultados (DRE Mensal & Anual)
  const receitaTotal = faturamentoMensalTotal;
  const margemContribuicao = receitaTotal - custosVariaveisTotais;
  const indiceMargemContribuicao = receitaTotal > 0 ? (margemContribuicao / receitaTotal) : 0;
  const lucroLiquidoMensal = margemContribuicao - totalCustosFixos;
  const lucroLiquidoAnual = lucroLiquidoMensal * 12;

  // 5.13 Indicadores de Viabilidade
  const pontoEquilibrioRs = indiceMargemContribuicao > 0 ? (totalCustosFixos / indiceMargemContribuicao) : 0;
  
  // Preço e custo variável médio por unidade
  const precoMedioUnitario = totalAssinantes > 0 ? (receitaTotal / totalAssinantes) : (f.faturamento_produtos[0]?.price || 1000);
  const custoVariavelUnitarioMedio = totalAssinantes > 0 ? (custosVariaveisTotais / totalAssinantes) : 0;
  const margemContribuicaoUnitaria = precoMedioUnitario - custoVariavelUnitarioMedio;
  const pontoEquilibrioUnidades = margemContribuicaoUnitaria > 0 ? Math.ceil(totalCustosFixos / margemContribuicaoUnitaria) : 0;

  const lucratividadePct = receitaTotal > 0 ? ((lucroLiquidoMensal / receitaTotal) * 100) : 0;
  const rentabilidadePct = investimentoTotal > 0 ? ((lucroLiquidoAnual / investimentoTotal) * 100) : 0;
  const paybackAnos = (lucroLiquidoAnual > 0) ? (investimentoTotal / lucroLiquidoAnual) : 0;
  const paybackMeses = paybackAnos * 12;

  // 6. Cenários (Pessimista -25%, Provável, Otimista +35%)
  const propVariavel = receitaTotal > 0 ? (custosVariaveisTotais / receitaTotal) : 0;
  const cenarios = {
    pessimista: {
      receita: receitaTotal * 0.75,
      custos_variaveis: (receitaTotal * 0.75) * propVariavel,
      custos_fixos: totalCustosFixos,
      lucro: (receitaTotal * 0.75) - ((receitaTotal * 0.75) * propVariavel) - totalCustosFixos
    },
    provavel: {
      receita: receitaTotal,
      custos_variaveis: custosVariaveisTotais,
      custos_fixos: totalCustosFixos,
      lucro: lucroLiquidoMensal
    },
    otimista: {
      receita: receitaTotal * 1.35,
      custos_variaveis: (receitaTotal * 1.35) * propVariavel,
      custos_fixos: totalCustosFixos,
      lucro: (receitaTotal * 1.35) - ((receitaTotal * 1.35) * propVariavel) - totalCustosFixos
    }
  };

  return {
    totalInvestimentosFixos,
    totalFixosA,
    totalFixosB,
    totalFixosC,
    totalEstoqueInicial,
    pmv,
    pmc,
    necessidadeLiquidaDias,
    custoTotalDiario,
    caixaMinimo,
    totalCapitalDeGiro,
    totalPreOperacional,
    investimentoTotal,
    faturamentoMensalTotal,
    mrr,
    arr,
    totalAssinantes,
    cmvTotal,
    subtotal1Impostos,
    subtotal2GastosVendas,
    totalComercializacao,
    custosVariaveisTotais,
    totalMaoDeObra,
    totalDepreciacaoMensal,
    totalCustosFixos,
    margemContribuicao,
    indiceMargemContribuicao,
    lucroLiquidoMensal,
    lucroLiquidoAnual,
    pontoEquilibrioRs,
    pontoEquilibrioUnidades,
    lucratividadePct,
    rentabilidadePct,
    paybackAnos,
    paybackMeses,
    cenarios
  };
}

// SUÍTE DE TESTES UNITÁRIOS
const mockPlan = {
  financial_plan: {
    investimentos_fixos_a_maquinas: [
      { item: "Notebook Dell / Mac M3", qty: 2, unit_val: 10000 },
      { item: "Monitores 4K", qty: 2, unit_val: 2500 }
    ],
    investimentos_fixos_b_moveis: [
      { item: "Mesas e Cadeiras Ergonômicas", qty: 2, unit_val: 1500 }
    ],
    investimentos_fixos_c_veiculos: [],
    pre_operational_investments: [
      { item: "Registro INPI", val: 3500 },
      { item: "Pesquisa de Campo SJC", val: 12000 }
    ],
    faturamento_produtos: [
      { name: "Plataforma Radar São José (Anual)", qty: 2, price: 12000, is_subscription: true, unit_cogs: 380 },
      { name: "Inteligência Aplicada", qty: 1, price: 8000, is_subscription: false, unit_cogs: 1000 }
    ],
    custos_comercializacao_impostos: [
      { name: "Simples Nacional", pct: 6.0 }
    ],
    custos_comercializacao_vendas: [
      { name: "Comissões Afiliados", pct: 10.0 },
      { name: "Taxa Gateway", pct: 3.2 }
    ],
    mao_de_obra: [
      { role: "Assistente Comercial", num_empregados: 1, salario: 2500, encargos_pct: 40.0 }
    ],
    depreciacao_ativos: [
      { item: "Equipamentos de Informática", valor_bem: 25000, vida_util_anos: 5 }
    ],
    custos_fixos_operacionais: [
      { name: "Pró-Labore Leonardo", custo_mensal: 6000 },
      { name: "Pró-Labore Mayumi", custo_mensal: 5000 },
      { name: "Servidores & Cloud", custo_mensal: 1200 },
      { name: "Contabilidade & Jurídico", custo_mensal: 800 }
    ],
    estoque_inicial: [
      { item: "Materiais Promocionais e Dossiês", qty: 100, unit_val: 20 }
    ],
    prazos_vendas: [
      { prazo: "À vista", pct_vendas: 40, dias: 0 },
      { prazo: "30 dias", pct_vendas: 60, dias: 30 }
    ],
    prazos_compras: [
      { prazo: "À vista", pct_compras: 30, dias: 0 },
      { prazo: "30 dias", pct_compras: 70, dias: 30 }
    ],
    necessidade_dias_estoque: 5
  }
};

console.log("=== INICIANDO TESTES DO MOTOR FINANCEIRO SEBRAE ===");

const res = calculateCompleteFinancials(mockPlan);

// Teste 1: Investimentos Fixos
assert.strictEqual(res.totalFixosA, 25000, "Subtotal A deve ser 25.000");
assert.strictEqual(res.totalFixosB, 3000, "Subtotal B deve ser 3.000");
assert.strictEqual(res.totalInvestimentosFixos, 28000, "Total Fixos deve ser 28.000");
console.log("✓ Teste 1 (Investimentos Fixos 5.1): Passou!");

// Teste 2: Faturamento Mensal & Custos Variáveis
assert.strictEqual(res.faturamentoMensalTotal, 32000, "Faturamento Mensal deve ser 32.000");
assert.strictEqual(res.cmvTotal, 1760, "CMV Total (2x380 + 1x1000) deve ser 1.760");
assert.strictEqual(res.subtotal1Impostos, 1920, "Impostos 6% de 32.000 deve ser 1.920");
assert.strictEqual(res.subtotal2GastosVendas, 4224, "Gastos Vendas 13.2% de 32.000 deve ser 4.224");
assert.strictEqual(res.custosVariaveisTotais, 7904, "Custos Variáveis Totais deve ser 7.904");
console.log("✓ Teste 2 (Faturamento 5.5 e Custos Variáveis 5.7/5.8): Passou!");

// Teste 3: Mão de Obra e Depreciação
assert.strictEqual(res.totalMaoDeObra, 3500, "Mão de Obra (2500 + 40%) deve ser 3.500");
assert.strictEqual(res.totalDepreciacaoMensal, 416.6666666666667, "Depreciação mensal (25000/5/12) deve ser 416.67");
console.log("✓ Teste 3 (Mão de Obra 5.9 e Depreciação 5.10): Passou!");

// Teste 4: Prazos e Caixa Mínimo
assert.strictEqual(res.pmv, 18, "PMV deve ser 18 dias (60% de 30)");
assert.strictEqual(res.pmc, 21, "PMC deve ser 21 dias (70% de 30)");
assert.strictEqual(res.necessidadeLiquidaDias, 2, "Necessidade Líquida deve ser (18+5) - 21 = 2 dias");
assert.ok(res.caixaMinimo > 0, "Caixa Mínimo deve ser positivo");
console.log("✓ Teste 4 (Prazos e Caixa Mínimo 5.2): Passou!");

// Teste 5: DRE e Indicadores
assert.strictEqual(res.margemContribuicao, 24096, "Margem de Contribuição deve ser 32.000 - 7.904 = 24.096");
assert.ok(res.lucroLiquidoMensal > 0, "Lucro Líquido deve ser positivo");
assert.ok(res.pontoEquilibrioRs > 0, "Ponto de Equilíbrio deve ser calculado");
assert.ok(res.lucratividadePct > 0, "Lucratividade deve ser positiva");
assert.ok(res.rentabilidadePct > 0, "Rentabilidade deve ser positiva");
assert.ok(res.paybackMeses > 0, "Payback deve ser calculado");
console.log("✓ Teste 5 (DRE 5.12 e Indicadores 5.13): Passou!");

// Teste 6: Cenários
assert.ok(res.cenarios.pessimista.receita < res.cenarios.provavel.receita, "Cenário pessimista deve ter menor receita");
assert.ok(res.cenarios.otimista.receita > res.cenarios.provavel.receita, "Cenário otimista deve ter maior receita");
console.log("✓ Teste 6 (Construção de Cenários 6): Passou!");

console.log("\n=======================================================");
console.log("TODOS OS TESTES DO MOTOR FINANCEIRO PASSARAM COM SUCESSO!");
console.log("=======================================================");
