const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'admin-crm.html');
let html = fs.readFileSync(filePath, 'utf8');

const secFinanceiroHtml = `        <!-- ==================== SEÇÃO 5: PLANO FINANCEIRO SEBRAE CIRÚRGICO ==================== -->
        <section id="sec-financeiro" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-10">
          <div class="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">SEBRAE • Seção 5</span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900">5. Plano Financeiro Estruturado (Metodologia Oficial SEBRAE)</h2>
              <p class="text-xs text-slate-500">Estimativas de Investimentos Fixos, Capital de Giro em 5 Passos, Fontes de Recursos, Faturamento, Insumos, Mão de Obra, DRE e Viabilidade.</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button type="button" onclick="recalculateAllFinancials(); saveBusinessPlan(false);" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer">
                <i class="fa-solid fa-calculator"></i> Recalcular Tudo
              </button>
            </div>
          </div>

          <!-- 5.1 ESTIMATIVA DOS INVESTIMENTOS FIXOS -->
          <div class="space-y-6 pt-2">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.1</span>
                Estimativa dos Investimentos Fixos (Máquinas, Móveis & Veículos)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Tabelas A, B e C para apuração do Ativo Imobilizado com cálculo automático (Qtd × Unitário).</p>
            </div>

            <!-- Tabela A: Máquinas e Equipamentos -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Tabela A — Máquinas e Equipamentos (Notebooks, Monitores, Servidores, etc.)</h4>
                <button type="button" onclick="addNewFixosRow('A')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Linha A</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Descrição</th>
                      <th class="px-3 py-2.5 text-center w-24">Quantidade</th>
                      <th class="px-4 py-2.5 text-right w-36">Valor Unitário (R$)</th>
                      <th class="px-4 py-2.5 text-right w-36">Total (R$)</th>
                      <th class="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody id="fixosTableA_Body" class="divide-y divide-slate-100"></tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td colspan="3" class="px-4 py-2.5 text-slate-600">Subtotal A (Máquinas e Equipamentos)</td>
                      <td id="subtotalFixosA" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Tabela B: Móveis e Utensílios -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Tabela B — Móveis e Utensílios (Mesas, Cadeiras Ergonômicas, etc.)</h4>
                <button type="button" onclick="addNewFixosRow('B')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Linha B</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Descrição</th>
                      <th class="px-3 py-2.5 text-center w-24">Quantidade</th>
                      <th class="px-4 py-2.5 text-right w-36">Valor Unitário (R$)</th>
                      <th class="px-4 py-2.5 text-right w-36">Total (R$)</th>
                      <th class="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody id="fixosTableB_Body" class="divide-y divide-slate-100"></tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td colspan="3" class="px-4 py-2.5 text-slate-600">Subtotal B (Móveis e Utensílios)</td>
                      <td id="subtotalFixosB" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Tabela C: Veículos -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Tabela C — Veículos</h4>
                <button type="button" onclick="addNewFixosRow('C')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Linha C</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Descrição</th>
                      <th class="px-3 py-2.5 text-center w-24">Quantidade</th>
                      <th class="px-4 py-2.5 text-right w-36">Valor Unitário (R$)</th>
                      <th class="px-4 py-2.5 text-right w-36">Total (R$)</th>
                      <th class="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody id="fixosTableC_Body" class="divide-y divide-slate-100"></tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td colspan="3" class="px-4 py-2.5 text-slate-600">Subtotal C (Veículos)</td>
                      <td id="subtotalFixosC" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Resumo 5.1 -->
            <div class="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
              <div class="font-black text-xs uppercase tracking-wider">Total dos Investimentos Fixos (Subtotal A + Subtotal B + Subtotal C):</div>
              <div id="totalInvestimentosFixosDisplay" class="text-xl font-black text-emerald-400">R$ 0</div>
            </div>
          </div>

          <!-- 5.2 CAPITAL DE GIRO -->
          <div class="space-y-6 pt-4 border-t border-slate-200">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.2</span>
                Estimativa do Capital de Giro (Estoque Inicial & Caixa Mínimo em 5 Passos)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Metodologia oficial SEBRAE para cálculo da Necessidade Líquida em Dias e Caixa Mínimo Operacional.</p>
            </div>

            <!-- Tabela A: Estoque Inicial -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Tabela A — Estoque Inicial (Materiais, Licenças, Kits, etc.)</h4>
                <button type="button" onclick="addNewEstoqueRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Item de Estoque</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Descrição</th>
                      <th class="px-3 py-2.5 text-center w-24">Quantidade</th>
                      <th class="px-4 py-2.5 text-right w-36">Valor Unitário (R$)</th>
                      <th class="px-4 py-2.5 text-right w-36">Total (R$)</th>
                      <th class="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody id="estoqueTableBody" class="divide-y divide-slate-100"></tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td colspan="3" class="px-4 py-2.5 text-slate-600">Total do Estoque Inicial (Subtotal 1)</td>
                      <td id="totalEstoqueInicialDisplay" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Tabela B: Caixa Mínimo em 5 Passos -->
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Tabela B — Caixa Mínimo (Metodologia SEBRAE em 5 Passos)</h4>

              <!-- Passo 1: Contas a Receber (PMV) -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-800">Passo 1 — Contas a Receber (Prazo Médio de Vendas - PMV)</span>
                  <button type="button" onclick="addNewPrazoVendaRow()" class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold cursor-pointer">+ Prazo</button>
                </div>
                <div class="overflow-x-auto rounded-lg border border-slate-100">
                  <table class="w-full text-xs text-left">
                    <thead>
                      <tr class="bg-slate-50 text-[10px] font-bold text-slate-500 border-b">
                        <th class="px-3 py-1.5">Condição</th>
                        <th class="px-3 py-1.5 text-center w-24">% Vendas</th>
                        <th class="px-3 py-1.5 text-center w-24">Dias</th>
                        <th class="px-3 py-1.5 text-right w-32">Ponderação (Dias)</th>
                        <th class="px-2 py-1.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody id="prazosVendasTableBody" class="divide-y divide-slate-100"></tbody>
                    <tfoot>
                      <tr class="font-black bg-slate-50/50">
                        <td colspan="3" class="px-3 py-1.5 text-slate-700">Prazo Médio de Vendas (PMV Total):</td>
                        <td id="pmvTotalDisplay" class="px-3 py-1.5 text-right text-cyan-800">0 dias</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- Passo 2: Fornecedores (PMC) -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-800">Passo 2 — Fornecedores (Prazo Médio de Compras - PMC)</span>
                  <button type="button" onclick="addNewPrazoCompraRow()" class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold cursor-pointer">+ Prazo</button>
                </div>
                <div class="overflow-x-auto rounded-lg border border-slate-100">
                  <table class="w-full text-xs text-left">
                    <thead>
                      <tr class="bg-slate-50 text-[10px] font-bold text-slate-500 border-b">
                        <th class="px-3 py-1.5">Condição</th>
                        <th class="px-3 py-1.5 text-center w-24">% Compras</th>
                        <th class="px-3 py-1.5 text-center w-24">Dias</th>
                        <th class="px-3 py-1.5 text-right w-32">Ponderação (Dias)</th>
                        <th class="px-2 py-1.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody id="prazosComprasTableBody" class="divide-y divide-slate-100"></tbody>
                    <tfoot>
                      <tr class="font-black bg-slate-50/50">
                        <td colspan="3" class="px-3 py-1.5 text-slate-700">Prazo Médio de Compras (PMC Total):</td>
                        <td id="pmcTotalDisplay" class="px-3 py-1.5 text-right text-cyan-800">0 dias</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <!-- Passo 3: Estoques (NME) -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span class="text-xs font-bold text-slate-800 block">Passo 3 — Estoques (Necessidade Média de Estoque - NME)</span>
                  <span class="text-[11px] text-slate-500">Tempo médio de permanência dos insumos / servidores em estoque.</span>
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-xs font-bold text-slate-600">Dias de Estoque:</label>
                  <input type="number" id="finInput_diasEstoque" oninput="recalculateAllFinancials()" class="w-20 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-center text-slate-900" />
                </div>
              </div>

              <!-- Passo 4: Necessidade Líquida de Capital de Giro em Dias -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <span class="text-xs font-bold text-slate-800 block">Passo 4 — Necessidade Líquida de Capital de Giro em Dias</span>
                <div class="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-400 font-bold block">1. PMV</span>
                    <strong id="passo4_pmv" class="text-slate-800 text-sm">0 d</strong>
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-400 font-bold block">+ 2. NME</span>
                    <strong id="passo4_nme" class="text-slate-800 text-sm">0 d</strong>
                  </div>
                  <div class="p-2 bg-cyan-50 rounded-lg">
                    <span class="text-[10px] text-cyan-700 font-bold block">(=) Subtotal 1</span>
                    <strong id="passo4_sub1" class="text-cyan-900 text-sm">0 d</strong>
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-400 font-bold block">(-) 3. PMC</span>
                    <strong id="passo4_pmc" class="text-slate-800 text-sm">0 d</strong>
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-400 font-bold block">(=) Subtotal 2</span>
                    <strong id="passo4_sub2" class="text-slate-800 text-sm">0 d</strong>
                  </div>
                  <div class="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span class="text-[10px] text-emerald-700 font-bold block">Necessidade Liq.</span>
                    <strong id="passo4_liq" class="text-emerald-950 text-sm">0 dias</strong>
                  </div>
                </div>
              </div>

              <!-- Passo 5: Cálculo do Caixa Mínimo em R$ -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <span class="text-xs font-bold text-slate-800 block">Passo 5 — Cálculo do Caixa Mínimo em R$</span>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-500 font-bold block">Custos Fixos Mensais:</span>
                    <strong id="passo5_fixo" class="text-slate-900 text-sm">R$ 0</strong>
                  </div>
                  <div class="p-2.5 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-500 font-bold block">Custos Variáveis Mensais:</span>
                    <strong id="passo5_var" class="text-slate-900 text-sm">R$ 0</strong>
                  </div>
                  <div class="p-2.5 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-500 font-bold block">Custo Total Mensal:</span>
                    <strong id="passo5_tot" class="text-slate-900 text-sm">R$ 0</strong>
                  </div>
                  <div class="p-2.5 bg-slate-50 rounded-lg">
                    <span class="text-[10px] text-slate-500 font-bold block">Custo Diário (Total / 30):</span>
                    <strong id="passo5_diario" class="text-slate-900 text-sm">R$ 0</strong>
                  </div>
                </div>
                <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span class="text-xs font-black text-emerald-950 uppercase tracking-wider">Caixa Mínimo (Custo Diário × <span id="passo5_dias">0</span> dias):</span>
                    <span class="text-[11px] text-emerald-700 block">Recursos mínimos necessários para girar a operação sem sobressaltos.</span>
                  </div>
                  <div id="passo5_caixaMinimo" class="text-xl font-black text-emerald-700">R$ 0</div>
                </div>
              </div>

              <!-- Resumo Capital de Giro Total -->
              <div class="p-4 rounded-xl bg-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="space-y-0.5">
                  <span class="font-bold text-slate-300">Resumo Capital de Giro:</span>
                  <div class="text-[11px] text-slate-400">Estoque Inicial (<span id="resumoEstoqueInicial">R$ 0</span>) + Caixa Mínimo (<span id="resumoCaixaMinimo">R$ 0</span>)</div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Capital de Giro:</span>
                  <strong id="resumoCapitalGiroTotal" class="text-lg font-black text-emerald-400">R$ 0</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- 5.3 INVESTIMENTOS PRÉ-OPERACIONAIS -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.3</span>
                  Investimentos Pré-Operacionais
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Despesas com legalização, marcas (INPI), pesquisa primária de campo, contratos e validação.</p>
              </div>
              <button type="button" onclick="addNewPreOpRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Despesa</button>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-2.5">Descrição das Despesas Pré-Operacionais</th>
                    <th class="px-4 py-2.5 text-right w-44">Valor (R$)</th>
                    <th class="px-3 py-2.5 text-right w-12"></th>
                  </tr>
                </thead>
                <tbody id="preOpTableBody" class="divide-y divide-slate-100"></tbody>
                <tfoot>
                  <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                    <td class="px-4 py-2.5 text-slate-600">Total dos Investimentos Pré-Operacionais</td>
                    <td id="preOpTotalDisplay" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- 5.4 INVESTIMENTO TOTAL & FONTES DE RECURSOS -->
          <div class="space-y-6 pt-4 border-t border-slate-200">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.4</span>
                Investimento Total & Fontes de Recursos
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Consolidação do Investimento Total (1+2+3) e validação da origem do capital próprio / financiado.</p>
            </div>

            <!-- Tabela 1: Composição do Investimento Total -->
            <div class="space-y-2">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Tabela 1 — Composição do Investimento Total</h4>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Discriminação dos Investimentos</th>
                      <th class="px-4 py-2.5 text-right w-40">Valor (R$)</th>
                      <th class="px-4 py-2.5 text-right w-28">% Participação</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr>
                      <td class="px-4 py-2 font-medium text-slate-800">1. Investimentos Fixos (Subtotal 5.1)</td>
                      <td id="invTot_fixos" class="px-4 py-2 text-right font-bold text-slate-900">R$ 0</td>
                      <td id="invTot_fixos_pct" class="px-4 py-2 text-right font-bold text-slate-600">0%</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium text-slate-800">2. Capital de Giro (Subtotal 5.2)</td>
                      <td id="invTot_giro" class="px-4 py-2 text-right font-bold text-slate-900">R$ 0</td>
                      <td id="invTot_giro_pct" class="px-4 py-2 text-right font-bold text-slate-600">0%</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium text-slate-800">3. Investimentos Pré-Operacionais (Subtotal 5.3)</td>
                      <td id="invTot_preop" class="px-4 py-2 text-right font-bold text-slate-900">R$ 0</td>
                      <td id="invTot_preop_pct" class="px-4 py-2 text-right font-bold text-slate-600">0%</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-slate-900 text-white font-black text-xs">
                      <td class="px-4 py-3 uppercase tracking-wider">Total do Investimento (1 + 2 + 3)</td>
                      <td id="invTot_geral" class="px-4 py-3 text-right text-emerald-400 text-sm">R$ 0</td>
                      <td class="px-4 py-3 text-right text-emerald-400">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Tabela 2: Fontes de Recursos -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Tabela 2 — Fontes de Recursos</h4>
                  <p class="text-[11px] text-slate-500">A soma percentual de todas as fontes de capital deve totalizar 100%.</p>
                </div>
                <div class="flex items-center gap-2">
                  <div id="validaFontesPill"></div>
                  <button type="button" onclick="addNewFonteRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Fonte</button>
                </div>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Fonte de Recursos</th>
                      <th class="px-4 py-2.5 text-right w-40">Valor (R$)</th>
                      <th class="px-4 py-2.5 text-right w-28">% Participação</th>
                      <th class="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody id="fontesRecursosTableBody" class="divide-y divide-slate-100"></tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td class="px-4 py-2.5 text-slate-600">Total das Fontes de Recursos</td>
                      <td id="totalFontesDisplay" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                      <td class="px-4 py-2.5 text-right text-slate-900">100%</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <!-- 5.5 ESTIMATIVA DO FATURAMENTO MENSAL -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.5</span>
                  Estimativa do Faturamento Mensal
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Receita mensal estimada por produto/serviço (Quantidade × Preço de Venda Unitário).</p>
              </div>
              <button type="button" onclick="addNewProdutoRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Produto/Serviço</button>
            </div>

            <!-- Cards Indicadores SaaS -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="p-3 bg-cyan-50 rounded-xl border border-cyan-200">
                <span class="text-[10px] font-black uppercase text-cyan-700 block">MRR Projetado (Mensal)</span>
                <strong id="saasMrrDisplay" class="text-lg font-black text-cyan-950">R$ 0</strong>
              </div>
              <div class="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span class="text-[10px] font-black uppercase text-blue-700 block">ARR Projetado (Anualizado)</span>
                <strong id="saasArrDisplay" class="text-lg font-black text-blue-950">R$ 0</strong>
              </div>
              <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span class="text-[10px] font-black uppercase text-emerald-700 block">Assinantes SaaS Radar</span>
                <strong id="saasSubscribersDisplay" class="text-lg font-black text-emerald-950">0 assinantes</strong>
              </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-2.5">Produto / Serviço</th>
                    <th class="px-3 py-2.5 text-center w-28">Qtd Estimada (Mês)</th>
                    <th class="px-4 py-2.5 text-right w-36">Preço Unitário (R$)</th>
                    <th class="px-4 py-2.5 text-right w-40">Faturamento Total (R$)</th>
                    <th class="px-3 py-2.5 text-right w-12"></th>
                  </tr>
                </thead>
                <tbody id="faturamentoTableBody" class="divide-y divide-slate-100"></tbody>
                <tfoot>
                  <tr class="bg-slate-900 text-white font-black text-xs">
                    <td colspan="3" class="px-4 py-3 uppercase tracking-wider">Faturamento Total Estimado Mensal</td>
                    <td id="totalFaturamentoDisplay" class="px-4 py-3 text-right text-emerald-400 text-sm">R$ 0</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- 5.6 ESTIMATIVA DO CUSTO UNITÁRIO DE MATERIAIS / INSUMOS -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.6</span>
                Estimativa do Custo Unitário de Materiais Diretos e/ou Mercadorias Vendidas
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Detalhamento dos insumos diretos para cada produto/serviço ofertado.</p>
            </div>
            <div id="custosUnitariosContainer" class="space-y-6">
              <!-- Hidratado dinamicamente para cada produto -->
            </div>
          </div>

          <!-- 5.7 ESTIMATIVA DOS CUSTOS DE COMERCIALIZAÇÃO -->
          <div class="space-y-6 pt-4 border-t border-slate-200">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.7</span>
                Estimativa dos Custos de Comercialização
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Subtotal 1 (Impostos sobre faturamento) + Subtotal 2 (Gastos com vendas: comissões, gateways, taxas).</p>
            </div>

            <!-- Subtotal 1: Impostos -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Subtotal 1 — Impostos e Tributos</h4>
                <button type="button" onclick="addNewImpostoRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Imposto</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Descrição do Tributo</th>
                      <th class="px-3 py-2.5 text-center w-28">% Alíquota</th>
                      <th class="px-4 py-2.5 text-right w-40">Valor Mensal (R$)</th>
                      <th class="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody id="comercializacaoImpostosTableBody" class="divide-y divide-slate-100"></tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td colspan="2" class="px-4 py-2.5 text-slate-600">Subtotal 1 (Impostos)</td>
                      <td id="subtotal1ImpostosDisplay" class="px-4 py-2.5 text-right text-rose-700">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Subtotal 2: Gastos com Vendas -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Subtotal 2 — Gastos com Vendas (Comissões & Gateway)</h4>
                <button type="button" onclick="addNewGastoVendaRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Gasto de Venda</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Descrição do Gasto</th>
                      <th class="px-3 py-2.5 text-center w-28">% sobre Vendas</th>
                      <th class="px-4 py-2.5 text-right w-40">Valor Mensal (R$)</th>
                      <th class="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody id="comercializacaoVendasTableBody" class="divide-y divide-slate-100"></tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td colspan="2" class="px-4 py-2.5 text-slate-600">Subtotal 2 (Gastos com Vendas)</td>
                      <td id="subtotal2GastosVendasDisplay" class="px-4 py-2.5 text-right text-rose-700">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Total Comercialização -->
            <div class="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span class="font-black text-xs uppercase tracking-wider">Total dos Custos de Comercialização (Subtotal 1 + Subtotal 2):</span>
              <span id="totalComercializacaoDisplay" class="text-xl font-black text-rose-400">R$ 0</span>
            </div>
          </div>

          <!-- 5.8 APURAÇÃO DO CUSTO DOS MATERIAIS DIRETOS / CMV -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.8</span>
                Apuração do Custo dos Materiais Diretos e/ou Mercadorias Vendidas (CMV)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Calculado automaticamente pelo produto entre a Estimativa de Vendas e o Custo Unitário de Insumos.</p>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-2.5">Produto / Serviço</th>
                    <th class="px-3 py-2.5 text-center w-28">Estimativa Vendas</th>
                    <th class="px-4 py-2.5 text-right w-36">Custo Unitário Insumos</th>
                    <th class="px-4 py-2.5 text-right w-40">Custo Total Mensal (R$)</th>
                  </tr>
                </thead>
                <tbody id="cmvTableBody" class="divide-y divide-slate-100"></tbody>
                <tfoot>
                  <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                    <td colspan="3" class="px-4 py-2.5 text-slate-600">Total do Custo dos Materiais Diretos / CMV</td>
                    <td id="totalCmvDisplay" class="px-4 py-2.5 text-right text-rose-700">R$ 0</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- 5.9 ESTIMATIVA DOS CUSTOS COM MÃO DE OBRA -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.9</span>
                  Estimativa dos Custos com Mão de Obra
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Cálculo de colaboradores CLT/PJ: Nº de empregados × Salário Base × (1 + % Encargos).</p>
              </div>
              <button type="button" onclick="addNewMaoDeObraRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Função</button>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-2.5">Função</th>
                    <th class="px-3 py-2.5 text-center w-24">Nº Empregados</th>
                    <th class="px-4 py-2.5 text-right w-36">Salário Base (R$)</th>
                    <th class="px-3 py-2.5 text-center w-28">% Encargos</th>
                    <th class="px-4 py-2.5 text-right w-36">Total Mensal (R$)</th>
                    <th class="px-3 py-2.5 text-right w-12"></th>
                  </tr>
                </thead>
                <tbody id="maoDeObraTableBody" class="divide-y divide-slate-100"></tbody>
                <tfoot>
                  <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                    <td colspan="4" class="px-4 py-2.5 text-slate-600">Total dos Custos com Mão de Obra</td>
                    <td id="totalMaoDeObraDisplay" class="px-4 py-2.5 text-right text-rose-700">R$ 0</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- 5.10 ESTIMATIVA DO CUSTO COM DEPRECIAÇÃO -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.10</span>
                  Estimativa do Custo com Depreciação
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Depreciação contábil mensal e anual baseada na vida útil dos ativos imobilizados.</p>
              </div>
              <button type="button" onclick="addNewDepreciacaoRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Ativo</button>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-2.5">Ativo / Bem</th>
                    <th class="px-4 py-2.5 text-right w-36">Valor do Bem (R$)</th>
                    <th class="px-3 py-2.5 text-center w-28">Vida Útil (Anos)</th>
                    <th class="px-4 py-2.5 text-right w-36">Deprec. Anual (R$)</th>
                    <th class="px-4 py-2.5 text-right w-36">Deprec. Mensal (R$)</th>
                    <th class="px-3 py-2.5 text-right w-12"></th>
                  </tr>
                </thead>
                <tbody id="depreciacaoTableBody" class="divide-y divide-slate-100"></tbody>
                <tfoot>
                  <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                    <td colspan="4" class="px-4 py-2.5 text-slate-600">Total da Depreciação Mensal</td>
                    <td id="totalDepreciacaoMensalDisplay" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- 5.11 ESTIMATIVA DOS CUSTOS FIXOS OPERACIONAIS MENSAIS -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.11</span>
                  Estimativa dos Custos Fixos Operacionais Mensais
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Despesas administrativas, pró-labore, softwares, contabilidade e integração automática da folha e depreciação.</p>
              </div>
              <button type="button" onclick="addNewCustoFixoRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">+ Despesa Fixa</button>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-2.5">Descrição do Custo Fixo</th>
                    <th class="px-4 py-2.5 text-right w-44">Valor Mensal (R$)</th>
                    <th class="px-3 py-2.5 text-right w-12"></th>
                  </tr>
                </thead>
                <tbody id="custosFixosTableBody" class="divide-y divide-slate-100"></tbody>
                <tfoot>
                  <tr class="bg-slate-50 font-medium text-xs border-t border-slate-200 text-slate-600">
                    <td class="px-4 py-2">Subtotal Outros Custos Fixos Operacionais</td>
                    <td id="subtotalCustosFixosOperacionaisDisplay" class="px-4 py-2 text-right font-bold text-slate-800">R$ 0</td>
                    <td></td>
                  </tr>
                  <tr class="bg-slate-900 text-white font-black text-xs">
                    <td class="px-4 py-3 uppercase tracking-wider">Total Custos Fixos Gerais (Outros + Mão de Obra + Depreciação)</td>
                    <td id="totalCustosFixosGeraisDisplay" class="px-4 py-3 text-right text-rose-400 text-sm">R$ 0</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- 5.12 DEMONSTRATIVO DE RESULTADOS (DRE) -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.12</span>
                Demonstrativo de Resultados (DRE Mensal & Anual)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Apuração do Resultado Operacional Líquido, Margem de Contribuição e % sobre a Receita Total.</p>
            </div>
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-2.5">Item do Demonstrativo</th>
                    <th class="px-4 py-2.5 text-right w-40">Valor Mensal (R$)</th>
                    <th class="px-4 py-2.5 text-right w-28">% sobre Receita</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr class="font-bold text-slate-900 bg-slate-50/50">
                    <td class="px-4 py-2.5">1. Receita Total com Vendas</td>
                    <td id="dre_receita" class="px-4 py-2.5 text-right text-slate-900">R$ 0</td>
                    <td class="px-4 py-2.5 text-right text-slate-500">100,0%</td>
                  </tr>
                  <tr class="text-rose-600">
                    <td class="px-4 py-2 pl-8">(-) Custos dos Materiais Diretos / CMV (5.8)</td>
                    <td id="dre_cmv" class="px-4 py-2 text-right">- R$ 0</td>
                    <td id="dre_cmv_pct" class="px-4 py-2 text-right">0%</td>
                  </tr>
                  <tr class="text-rose-600">
                    <td class="px-4 py-2 pl-8">(-) Impostos sobre Vendas (5.7 Subtotal 1)</td>
                    <td id="dre_impostos" class="px-4 py-2 text-right">- R$ 0</td>
                    <td id="dre_impostos_pct" class="px-4 py-2 text-right">0%</td>
                  </tr>
                  <tr class="text-rose-600">
                    <td class="px-4 py-2 pl-8">(-) Gastos com Vendas / Comissões (5.7 Subtotal 2)</td>
                    <td id="dre_vendas" class="px-4 py-2 text-right">- R$ 0</td>
                    <td id="dre_vendas_pct" class="px-4 py-2 text-right">0%</td>
                  </tr>
                  <tr class="font-bold text-rose-700 bg-rose-50/30">
                    <td class="px-4 py-2.5">2. Total de Custos Variáveis</td>
                    <td id="dre_custosVarTotais" class="px-4 py-2.5 text-right">- R$ 0</td>
                    <td id="dre_custosVarTotais_pct" class="px-4 py-2.5 text-right">0%</td>
                  </tr>
                  <tr class="font-bold text-emerald-800 bg-emerald-50/50">
                    <td class="px-4 py-3">3. Margem de Contribuição (1 - 2)</td>
                    <td id="dre_margemContribuicao" class="px-4 py-3 text-right text-emerald-700 text-sm">R$ 0</td>
                    <td id="dre_margemContribuicao_pct" class="px-4 py-3 text-right text-emerald-700 text-sm font-black">0%</td>
                  </tr>
                  <tr class="text-rose-600">
                    <td class="px-4 py-2.5">4. (-) Custos Fixos Totais (5.11)</td>
                    <td id="dre_custosFixosTotais" class="px-4 py-2.5 text-right font-bold">- R$ 0</td>
                    <td id="dre_custosFixosTotais_pct" class="px-4 py-2.5 text-right font-bold">0%</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-emerald-600 text-white font-black text-sm">
                    <td class="px-4 py-3.5 uppercase tracking-wider">5. Lucro / Prejuízo Operacional Líquido Mensal (3 - 4)</td>
                    <td id="dre_lucroLiquido" class="px-4 py-3.5 text-right text-base">R$ 0</td>
                    <td id="dre_lucroLiquido_pct" class="px-4 py-3.5 text-right text-base">0%</td>
                  </tr>
                  <tr class="bg-slate-900 text-slate-300 font-bold text-xs">
                    <td class="px-4 py-2.5">Lucro Líquido Anualizado Projetado (12 meses):</td>
                    <td id="dre_lucroLiquidoAnual" class="px-4 py-2.5 text-right text-emerald-400 font-black text-sm" colspan="2">R$ 0</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- 5.13 INDICADORES DE VIABILIDADE -->
          <div class="space-y-4 pt-4 border-t border-slate-200">
            <div class="border-b border-slate-200 pb-2">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">5.13</span>
                Indicadores de Viabilidade 100% Automatizados (Metodologia SEBRAE)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Ponto de Equilíbrio, Lucratividade, Rentabilidade e Prazo de Retorno do Investimento (Payback).</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- PE -->
              <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/80 shadow-2xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-700 block">Ponto de Equilíbrio (PE)</span>
                <div id="ind_pe_rs" class="text-xl font-black text-amber-950">R$ 0</div>
                <div id="ind_pe_unidades" class="text-xs font-bold text-amber-800">0 unidades / mês</div>
                <p class="text-[10px] text-amber-600 font-medium pt-1">Custo Fixo Total ÷ % Margem Contribuição</p>
              </div>

              <!-- Lucratividade -->
              <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/80 shadow-2xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">Lucratividade (%)</span>
                <div id="ind_lucratividade" class="text-xl font-black text-emerald-950">0%</div>
                <div class="text-xs font-bold text-emerald-800">Margem Líquida</div>
                <p class="text-[10px] text-emerald-600 font-medium pt-1">(Lucro Líquido ÷ Receita Total) × 100</p>
              </div>

              <!-- Rentabilidade -->
              <div class="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/80 shadow-2xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">Rentabilidade ROI (%)</span>
                <div id="ind_rentabilidade" class="text-xl font-black text-indigo-950">0%</div>
                <div class="text-xs font-bold text-indigo-800">Retorno Anual do Capital</div>
                <p class="text-[10px] text-indigo-600 font-medium pt-1">(Lucro Líquido Anual ÷ Inv. Total) × 100</p>
              </div>

              <!-- Payback -->
              <div class="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/80 shadow-2xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-purple-700 block">Prazo de Retorno (Payback)</span>
                <div id="ind_payback" class="text-xl font-black text-purple-950">0 anos</div>
                <div class="text-xs font-bold text-purple-800">Tempo de retorno do capital</div>
                <p class="text-[10px] text-purple-600 font-medium pt-1">Investimento Total ÷ Lucro Líquido Anual</p>
              </div>
            </div>

            <!-- GRÁFICOS FINANCEIROS CHART.JS -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Composição das Contas (DRE Visual)</h4>
                <div class="h-64 relative">
                  <canvas id="dreBreakdownChartCanvas"></canvas>
                </div>
              </div>

              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Curva de Ponto de Equilíbrio (Break-Even)</h4>
                <div class="h-64 relative">
                  <canvas id="breakEvenChartCanvas"></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 6: CONSTRUÇÃO DE CENÁRIOS ==================== -->
        <section id="sec-cenarios" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">SEBRAE • Seção 6</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">6. Construção de Cenários (Pessimista, Provável & Otimista)</h2>
            <p class="text-xs text-slate-500">Simulação de sensibilidade com recálculo proporcional automático (Pessimista -25%, Provável e Otimista +35%).</p>
          </div>

          <!-- SLIDERS DE SENSIBILIDADE INTERATIVOS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div class="flex justify-between text-xs font-black text-slate-800 mb-1.5">
                <span>Novos Assinantes / Ano</span>
                <span id="simLabelSubscribers" class="text-cyan-700">20 clientes</span>
              </div>
              <input type="range" id="simSliderSubscribers" min="5" max="80" value="20" oninput="updateScenarioSimulator()" class="w-full accent-cyan-600 cursor-pointer" />
            </div>

            <div>
              <div class="flex justify-between text-xs font-black text-slate-800 mb-1.5">
                <span>Preço do Radar Anual</span>
                <span id="simLabelPrice" class="text-emerald-700">R$ 12.000</span>
              </div>
              <input type="range" id="simSliderPrice" min="8000" max="22000" step="1000" value="12000" oninput="updateScenarioSimulator()" class="w-full accent-emerald-600 cursor-pointer" />
            </div>

            <div>
              <div class="flex justify-between text-xs font-black text-slate-800 mb-1.5">
                <span>Projetos Inteligência Aplicada</span>
                <span id="simLabelApplied" class="text-indigo-700">6 projetos</span>
              </div>
              <input type="range" id="simSliderApplied" min="0" max="20" value="6" oninput="updateScenarioSimulator()" class="w-full accent-indigo-600 cursor-pointer" />
            </div>

            <div>
              <div class="flex justify-between text-xs font-black text-slate-800 mb-1.5">
                <span>Variação de Custos Fixos</span>
                <span id="simLabelCostVar" class="text-rose-700">0%</span>
              </div>
              <input type="range" id="simSliderCostVar" min="-30" max="50" step="5" value="0" oninput="updateScenarioSimulator()" class="w-full accent-rose-600 cursor-pointer" />
            </div>
          </div>

          <!-- TABELA COMPARATIVA DOS 3 CENÁRIOS -->
          <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                  <th class="px-4 py-3 text-slate-500">Item do Cenário</th>
                  <th class="px-4 py-3 text-right text-rose-700 bg-rose-50/50">Pessimista (-25%)</th>
                  <th class="px-4 py-3 text-right text-blue-900 bg-blue-50/50">Provável (Meta)</th>
                  <th class="px-4 py-3 text-right text-emerald-800 bg-emerald-50/50">Otimista (+35%)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="px-4 py-2.5 font-bold text-slate-800">Receita Total Mensal</td>
                  <td id="cen_pess_rec" class="px-4 py-2.5 text-right font-bold text-slate-900 bg-rose-50/20">R$ 0</td>
                  <td id="cen_prov_rec" class="px-4 py-2.5 text-right font-black text-slate-900 bg-blue-50/20">R$ 0</td>
                  <td id="cen_otim_rec" class="px-4 py-2.5 text-right font-bold text-slate-900 bg-emerald-50/20">R$ 0</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 text-slate-600">Custos Variáveis Totais</td>
                  <td id="cen_pess_var" class="px-4 py-2.5 text-right text-rose-700 bg-rose-50/20">R$ 0</td>
                  <td id="cen_prov_var" class="px-4 py-2.5 text-right text-slate-700 bg-blue-50/20">R$ 0</td>
                  <td id="cen_otim_var" class="px-4 py-2.5 text-right text-slate-700 bg-emerald-50/20">R$ 0</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 text-slate-600">Custos Fixos Totais</td>
                  <td id="cen_pess_fix" class="px-4 py-2.5 text-right text-slate-700 bg-rose-50/20">R$ 0</td>
                  <td id="cen_prov_fix" class="px-4 py-2.5 text-right text-slate-700 bg-blue-50/20">R$ 0</td>
                  <td id="cen_otim_fix" class="px-4 py-2.5 text-right text-slate-700 bg-emerald-50/20">R$ 0</td>
                </tr>
                <tr class="font-black text-sm border-t border-slate-200">
                  <td class="px-4 py-3 uppercase tracking-wider text-slate-900">Lucro Líquido Mensal</td>
                  <td id="cen_pess_lucro" class="px-4 py-3 text-right text-rose-700 bg-rose-50/50">R$ 0</td>
                  <td id="cen_prov_lucro" class="px-4 py-3 text-right text-blue-950 bg-blue-50/50">R$ 0</td>
                  <td id="cen_otim_lucro" class="px-4 py-3 text-right text-emerald-700 bg-emerald-50/50">R$ 0</td>
                </tr>
                <tr class="font-bold text-xs bg-slate-50">
                  <td class="px-4 py-2 uppercase tracking-wider text-slate-600">Margem Líquida (%)</td>
                  <td id="cen_pess_margem" class="px-4 py-2 text-right text-rose-700">0%</td>
                  <td id="cen_prov_margem" class="px-4 py-2 text-right text-blue-900">0%</td>
                  <td id="cen_otim_margem" class="px-4 py-2 text-right text-emerald-700">0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- GRÁFICO COMPARATIVO CHART.JS -->
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Comparação Gráfica: Receita vs Custos vs Lucro por Cenário</h4>
            <div class="h-64 relative">
              <canvas id="scenarioComparisonChartCanvas"></canvas>
            </div>
          </div>
        </section>`;

// Replace from <section id="sec-financeiro" to </section> before <section id="sec-swot"
const startMarker = '<section id="sec-financeiro"';
const endMarker = '<!-- ==================== SEÇÃO 7: MATRIZ SWOT';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Marcadores não encontrados no HTML:', { startIndex, endIndex });
  process.exit(1);
}

const newHtml = html.slice(0, startIndex) + secFinanceiroHtml + '\n\n        ' + html.slice(endIndex);
fs.writeFileSync(filePath, newHtml, 'utf8');
console.log('✅ Seções 5 e 6 do admin-crm.html atualizadas com sucesso!');
