// Script para injetar a interface executiva e os scripts no admin-crm.html
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'admin-crm.html');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Injetar scripts de Chart.js e html2pdf.js no <head> se ainda não existirem
if (!content.includes('chart.umd.min.js')) {
  const marker = '<script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>';
  const cdnScripts = `${marker}
  <!-- Chart.js 4.4 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <!-- html2pdf.js Bundle CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>`;
  content = content.replace(marker, cdnScripts);
}

// 2. Novo HTML completo do tab-plan
const newTabPlanHtml = `    <!-- ==================== TAB: BUSINESS PLAN (PLANO DE NEGÓCIOS SEBRAE & MONDAY.COM) ==================== -->
    <div id="tab-plan" class="tab-content hidden flex-1 flex flex-col bg-slate-50">
      
      <!-- SUB-HEADER / TOOLBAR EXECUTIVO -->
      <div class="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
        <div>
          <div class="flex items-center gap-2 text-[11px] font-black text-cyan-700 uppercase tracking-wider mb-1">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>Plano de Negócios Executivo • Metodologia SEBRAE</span>
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              100% Editável & Interativo
            </span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Estratégia, Finanças Cirúrgicas & Execução Ágil (Leonardo & Mayumi)</h1>
          <p class="text-xs text-slate-500 font-medium">Plano completo baseado no modelo oficial do SEBRAE para SaaS, integrado ao quadro de entregas Monday.com e simulador de cenários.</p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <div id="planSyncIndicator" class="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
            <i class="fa-solid fa-check text-emerald-500"></i>
            <span>Salvo no navegador</span>
          </div>

          <button type="button" onclick="saveBusinessPlan(true)" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer">
            <i class="fa-solid fa-floppy-disk"></i>
            <span>Salvar Alterações</span>
          </button>

          <button type="button" onclick="exportBusinessPlanPDF()" class="px-3.5 py-2 rounded-xl bg-[#0B2545] hover:bg-[#133E6D] text-white border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs" title="Exportar PDF Formatado no Padrão Oficial SEBRAE">
            <i class="fa-solid fa-file-pdf text-rose-400"></i>
            <span>Exportar PDF Sebrae</span>
          </button>

          <button type="button" onclick="resetBusinessPlanToDefaults()" class="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 text-xs transition-colors cursor-pointer" title="Restaurar Modelo Oficial do Documento-Base (Set/2026)">
            <i class="fa-solid fa-arrow-rotate-left"></i>
          </button>
        </div>
      </div>

      <!-- BARRA DE NAVEGAÇÃO RÁPIDA (QUICK-JUMP BUTTONS) -->
      <div class="bg-slate-100/90 backdrop-blur-md border-b border-slate-200 px-6 py-2.5 sticky top-[81px] z-20 overflow-x-auto custom-scrollbar flex items-center gap-2">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">Ir para Seção:</span>
        <button type="button" onclick="jumpToPlanSection('sec-monday')" id="btn-jump-sec-monday" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-cyan-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs hover:bg-cyan-500 shrink-0 transition-all">
          <i class="fa-solid fa-table-columns text-cyan-200"></i>
          <span>Quadro Monday (Leo & Mayumi)</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-executivo')" id="btn-jump-sec-executivo" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-briefcase text-slate-400"></i>
          <span>1. Sumário Executivo</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-mercado')" id="btn-jump-sec-mercado" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-chart-pie text-slate-400"></i>
          <span>2. Análise de Mercado</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-marketing')" id="btn-jump-sec-marketing" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-bullhorn text-slate-400"></i>
          <span>3. Plano de Marketing</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-operacional')" id="btn-jump-sec-operacional" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-gears text-slate-400"></i>
          <span>4. Plano Operacional</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-financeiro')" id="btn-jump-sec-financeiro" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-calculator text-emerald-600"></i>
          <span>5. Financeiro Cirúrgico</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-cenarios')" id="btn-jump-sec-cenarios" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-sliders text-indigo-600"></i>
          <span>6. Simulador de Cenários</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-swot')" id="btn-jump-sec-swot" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-shield-halved text-amber-500"></i>
          <span>7. Matriz SWOT</span>
        </button>
        <button type="button" onclick="jumpToPlanSection('sec-avaliacao')" id="btn-jump-sec-avaliacao" class="plan-jump-btn px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all">
          <i class="fa-solid fa-clipboard-check text-slate-400"></i>
          <span>8. Avaliação Final</span>
        </button>
      </div>

      <!-- CORPO PRINCIPAL DE MÓDULOS -->
      <div class="p-6 sm:p-8 space-y-12 flex-grow max-w-7xl w-full mx-auto pb-24">

        <!-- ==================== MÓDULO MONDAY.COM: DIVISÃO DE TAREFAS ==================== -->
        <section id="sec-monday" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div class="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-cyan-600 mb-1">
                <i class="fa-solid fa-table-columns"></i>
                <span>Gestão Ágil de Execução • Padrão Monday.com</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Divisão de Metas: Leonardo & Mayumi</h2>
              <p class="text-xs text-slate-500">Acompanhamento em tempo real de quem faz o quê no plano de negócios com status coloridos, prioridades e progresso percentual.</p>
            </div>

            <!-- Botão Adicionar Tarefa -->
            <button type="button" onclick="addNewMondayTask()" class="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer self-start lg:self-auto">
              <i class="fa-solid fa-plus"></i>
              <span>Nova Tarefa</span>
            </button>
          </div>

          <!-- BARRAS DE PROGRESSO: GERAL, LEONARDO E MAYUMI -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Progresso Geral -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-bars-progress text-cyan-600"></i> Progresso Geral do Plano
                </span>
                <span id="mondayOverallPct" class="font-black text-cyan-700">0%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div id="mondayOverallBar" class="bg-cyan-600 h-2.5 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>

            <!-- Progresso Leonardo -->
            <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-blue-900">
                <span class="flex items-center gap-2">
                  <img src="fotos_radar/LEONARDO.jpeg" class="w-5 h-5 rounded-full object-cover border border-blue-300" onerror="this.src='fotos_radar/LEONARDO.jpeg'" />
                  <span>Leonardo Venâncio</span>
                </span>
                <span id="mondayLeoPct" class="font-black text-blue-700">0%</span>
              </div>
              <div class="w-full bg-blue-200/60 rounded-full h-2.5 overflow-hidden">
                <div id="mondayLeoBar" class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>

            <!-- Progresso Mayumi -->
            <div class="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-purple-900">
                <span class="flex items-center gap-2">
                  <img src="fotos_radar/mayumi.jpg" class="w-5 h-5 rounded-full object-cover border border-purple-300" onerror="this.src='fotos_radar/mayumi.jpg'" />
                  <span>Mayumi Nagano</span>
                </span>
                <span id="mondayMayPct" class="font-black text-purple-700">0%</span>
              </div>
              <div class="w-full bg-purple-200/60 rounded-full h-2.5 overflow-hidden">
                <div id="mondayMayBar" class="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>
          </div>

          <!-- BARRA DE FILTROS MONDAY -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Filtrar Responsável:</span>
              <button type="button" onclick="setMondayFilter('all')" id="filter-monday-all" class="px-3 py-1.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold shadow-xs transition-all">Todos</button>
              <button type="button" onclick="setMondayFilter('leonardo')" id="filter-monday-leonardo" class="px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5">
                <img src="fotos_radar/LEONARDO.jpeg" class="w-4 h-4 rounded-full object-cover" />
                <span>Leonardo</span>
              </button>
              <button type="button" onclick="setMondayFilter('mayumi')" id="filter-monday-mayumi" class="px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5">
                <img src="fotos_radar/mayumi.jpg" class="w-4 h-4 rounded-full object-cover" />
                <span>Mayumi</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Status:</span>
              <select onchange="setMondayStatusFilter(this.value)" class="text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none">
                <option value="all">Todos os Status</option>
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Andamento</option>
                <option value="done">Concluído</option>
                <option value="blocked">Travado</option>
              </select>
            </div>
          </div>

          <!-- TABELA MONDAY INTERATIVA -->
          <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs custom-scrollbar">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th class="px-4 py-3">Tarefa / Entrega Estratégica</th>
                  <th class="px-4 py-3">Responsável</th>
                  <th class="px-4 py-3">Fase / Módulo</th>
                  <th class="px-4 py-3 text-center">Status Monday</th>
                  <th class="px-4 py-3 text-center">Prioridade</th>
                  <th class="px-4 py-3 text-center">Prazo</th>
                  <th class="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody id="mondayTasksTableBody" class="divide-y divide-slate-100 bg-white">
                <!-- Hidratado via JavaScript -->
              </tbody>
            </table>
          </div>
          <p class="text-[11px] text-slate-400 italic">
            * Dica: Clique nos botões de Status (ex: "Em Andamento") e Prioridade para alternar seus valores instantaneamente!
          </p>
        </section>

        <!-- ==================== SEÇÃO 1: SUMÁRIO EXECUTIVO ==================== -->
        <section id="sec-executivo" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-cyan-600 block">SEBRAE • Seção 1</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">1. Sumário Executivo & Empreendedores</h2>
            <p class="text-xs text-slate-500">A visão geral do negócio, sócios fundadores, enquadramento jurídico e divisão das cotas de capital social.</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">1.1 Resumo dos Principais Pontos (Negócio, Produto, Clientes e Proposta de Valor)</label>
              <textarea id="planExecBusinessDesc" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 leading-relaxed outline-none focus:bg-white focus:border-cyan-500 transition-all"></textarea>
            </div>

            <!-- Sócios Dinâmicos -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="text-xs font-black uppercase tracking-wider text-slate-700">1.2 Dados dos Empreendedores (Leonardo & Mayumi)</label>
                <button type="button" onclick="addNewPartner()" class="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <i class="fa-solid fa-user-plus text-cyan-600"></i> + Adicionar Sócio
                </button>
              </div>
              <div id="partnersCardsContainer" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Hidratado via JavaScript -->
              </div>
            </div>

            <!-- Dados da Empresa & Enquadramento -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">1.3 Razão Social / Nome Fantasia</label>
                <input type="text" id="planCompanyName" value="Radar São José Tecnologia e Inteligência Territorial Ltda" onchange="currentBusinessPlan.company_name = this.value; saveBusinessPlan(false);" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800" />
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">CNPJ</label>
                <input type="text" id="planCompanyCnpj" value="58.291.442/0001-90" onchange="currentBusinessPlan.cnpj = this.value; saveBusinessPlan(false);" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800" />
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">1.6 Forma Jurídica</label>
                <input type="text" id="planExecLegalForm" value="Sociedade Limitada (LTDA)" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800" />
              </div>
              <div class="sm:col-span-2 lg:col-span-3">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">1.4 Missão da Empresa</label>
                <textarea id="planExecMission" rows="2" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed"></textarea>
              </div>
              <div class="sm:col-span-2 lg:col-span-3">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">1.7 Enquadramento Tributário & Tributos Aplicáveis</label>
                <input type="text" id="planExecTaxDetail" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800" />
              </div>
            </div>

            <!-- Tabela Capital Social com Validação 100% -->
            <div class="pt-4 border-t border-slate-100">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">1.8 Capital Social & Distribuição de Cotas</h4>
                  <p class="text-[11px] text-slate-500">A soma percentual de todos os sócios deve totalizar exatamente 100% conforme exigência do Sebrae.</p>
                </div>
                <div id="capitalValidationPill">
                  <!-- Hidratado via JavaScript -->
                </div>
              </div>

              <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2.5">Nome do Sócio</th>
                      <th class="px-4 py-2.5 text-right">Valor Aportado (R$)</th>
                      <th class="px-4 py-2.5 text-right">% Participação</th>
                    </tr>
                  </thead>
                  <tbody id="capitalSocialTableBody">
                    <!-- Hidratado via JavaScript -->
                  </tbody>
                  <tfoot>
                    <tr class="bg-slate-50/80 font-black text-xs border-t border-slate-200">
                      <td class="px-4 py-3 uppercase tracking-wider text-slate-700">Total do Capital Social</td>
                      <td id="capitalTotalVal" class="px-4 py-3 text-right text-slate-900">R$ 50.000</td>
                      <td id="capitalTotalPct" class="px-4 py-3 text-right text-slate-900">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Fonte de Recursos -->
            <div>
              <label class="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">1.9 Fonte de Recursos & Investimentos</label>
              <textarea id="planExecFunding" rows="2" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed"></textarea>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 2: ANÁLISE DE MERCADO ==================== -->
        <section id="sec-mercado" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-cyan-600 block">SEBRAE • Seção 2</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">2. Análise de Mercado (Clientes, Concorrentes & Fornecedores)</h2>
            <p class="text-xs text-slate-500">Mapeamento do comportamento das empresas de São José dos Campos, matriz comparativa contra sistemas tradicionais e parceiros de infraestrutura.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">2.1 Personas dos Clientes</label>
              <textarea id="planMarketPersonas" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Comportamento de Compra</label>
              <textarea id="planMarketBehavior" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Área de Abrangência Territorial</label>
              <textarea id="planMarketScope" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
            </div>
          </div>

          <!-- Tabela Concorrentes -->
          <div class="pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">2.2 Matriz Comparativa de Concorrentes</h4>
                <p class="text-[11px] text-slate-500">Diferenciais do Radar São José contra grandes sistemas de SP e institutos estáticos.</p>
              </div>
              <button type="button" onclick="addNewCompetitor()" class="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-plus text-cyan-600"></i> + Concorrente
              </button>
            </div>
            <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white custom-scrollbar">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-3 py-2.5">Player / Empresa</th>
                    <th class="px-3 py-2.5">Qualidade dos Dados</th>
                    <th class="px-3 py-2.5">Preço / Modelo</th>
                    <th class="px-3 py-2.5">Canal / Entrega</th>
                    <th class="px-3 py-2.5">Atendimento</th>
                    <th class="px-3 py-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody id="competitorsTableBody">
                  <!-- Hidratado via JavaScript -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tabela Fornecedores -->
          <div class="pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">2.3 Estudo dos Principais Fornecedores</h4>
                <p class="text-[11px] text-slate-500">Parceiros de cloud, banco de dados, APIs de inteligência artificial e gateway de pagamentos.</p>
              </div>
              <button type="button" onclick="addNewSupplier()" class="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-plus text-cyan-600"></i> + Fornecedor
              </button>
            </div>
            <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white custom-scrollbar">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-3 py-2.5">Fornecedor</th>
                    <th class="px-3 py-2.5">Descrição dos Serviços / Itens</th>
                    <th class="px-3 py-2.5">Preço / Custo Médio</th>
                    <th class="px-3 py-2.5">Prazo / Entrega</th>
                    <th class="px-3 py-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody id="suppliersTableBody">
                  <!-- Hidratado via JavaScript -->
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 3: PLANO DE MARKETING ==================== -->
        <section id="sec-marketing" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-cyan-600 block">SEBRAE • Seção 3</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">3. Plano de Marketing & Portfólio de Produtos</h2>
            <p class="text-xs text-slate-500">Radar São José Anual, camada gratuita Radar Aberto, Inteligência Aplicada, Pesquisa e Patrocínio do Blog.</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">3.1 Descrição Detalhada dos Produtos e Serviços Oferecidos</label>
              <textarea id="planMktProductsDesc" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed"></textarea>
            </div>

            <!-- Tabela Preços -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">3.2 Tabela de Preços & Estratégia de Monetização</h4>
                <button type="button" onclick="addNewPricingRow()" class="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <i class="fa-solid fa-plus text-cyan-600"></i> + Produto
                </button>
              </div>
              <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-3">Produto / Serviço</th>
                      <th class="px-4 py-3">Preço / Ticket</th>
                      <th class="px-4 py-3">Estratégia Comercial</th>
                      <th class="px-4 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody id="pricingTableBody">
                    <!-- Hidratado via JavaScript -->
                  </tbody>
                </table>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">3.3 Estratégias Promocionais & Atração Orgânica</label>
                <textarea id="planMktPromo" rows="3" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">3.4 Estrutura de Comercialização & Canais de Venda</label>
                <textarea id="planMktCommercial" rows="3" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 4: PLANO OPERACIONAL ==================== -->
        <section id="sec-operacional" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-cyan-600 block">SEBRAE • Seção 4</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">4. Plano Operacional & Arquitetura SaaS</h2>
            <p class="text-xs text-slate-500">Infraestrutura técnica, capacidade de servidores, fluxo do cliente e plano de expansão de equipe.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">4.1 Layout / Arquitetura do Sistema</label>
              <textarea id="planOpLayout" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">4.2 Capacidade Técnica & Uptime</label>
              <textarea id="planOpCapacity" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">4.3 Processos Operacionais (Onboarding & Ativação 2h)</label>
              <textarea id="planOpProcesses" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800"></textarea>
            </div>
          </div>

          <!-- Tabela Pessoal -->
          <div class="pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">4.4 Necessidade de Pessoal & Quadro de Funções</h4>
                <p class="text-[11px] text-slate-500">Estrutura enxuta inicial (Leonardo e Mayumi) e marcos de contratações futuras.</p>
              </div>
              <button type="button" onclick="addNewStaffRow()" class="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-plus text-cyan-600"></i> + Cargo
              </button>
            </div>
            <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th class="px-4 py-3">Cargo / Função</th>
                    <th class="px-4 py-3">Qualificações Necessárias</th>
                    <th class="px-4 py-3 text-center">Quantidade</th>
                    <th class="px-4 py-3">Responsável Atual / Planejado</th>
                    <th class="px-4 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody id="staffTableBody">
                  <!-- Hidratado via JavaScript -->
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 5: PLANO FINANCEIRO ULTRA-DETALHADO ==================== -->
        <section id="sec-financeiro" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">SEBRAE • Seção 5</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">5. Plano Financeiro Cirúrgico & Viabilidade SaaS</h2>
            <p class="text-xs text-slate-500">Modelagem completa com Capex, Capital de Giro, Faturamento Multicanal, Unit Economics, DRE Automatizado, EBITDA e Indicadores Oficiais SEBRAE.</p>
          </div>

          <!-- 4 CARDS RESUMO FINANCEIRO NO TOPO -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/80 shadow-2xs">
              <span class="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-1">Receita Bruta Anual</span>
              <div id="kpiGrossRevenue" class="text-2xl font-black text-blue-950">R$ 0</div>
              <span id="kpiMrrEquiv" class="text-xs font-bold text-blue-700 mt-1 block">R$ 0 / mês</span>
            </div>

            <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/80 shadow-2xs">
              <span class="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">Lucro Líquido Anual</span>
              <div id="kpiNetProfit" class="text-2xl font-black text-emerald-950">+ R$ 0</div>
              <span id="kpiNetProfitMonthly" class="text-xs font-bold text-emerald-700 mt-1 block">+ R$ 0 / mês</span>
            </div>

            <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/80 shadow-2xs">
              <span class="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">Ponto de Equilíbrio (PE)</span>
              <div id="kpiBreakEven" class="text-lg font-black text-amber-950">0 Assinantes</div>
              <span class="text-xs font-medium text-amber-700 mt-1 block">Momento do empate das contas</span>
            </div>

            <div class="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/80 shadow-2xs">
              <span class="text-[10px] font-black uppercase tracking-wider text-purple-600 block mb-1">Payback do Investimento</span>
              <div id="kpiPayback" class="text-2xl font-black text-purple-950">0 Meses</div>
              <span class="text-xs font-medium text-purple-700 mt-1 block">Prazo de retorno total</span>
            </div>
          </div>

          <!-- TABELAS CAPEX & PRÉ-OPERACIONAL -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Capex -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">5.1 Investimentos Fixos (Capex)</h4>
                  <p class="text-[11px] text-slate-500">Notebooks, monitores, gravação e ergonomia.</p>
                </div>
                <button type="button" onclick="addNewCapexRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">+ Item</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2">Item</th>
                      <th class="px-4 py-2 text-center">Qtd</th>
                      <th class="px-4 py-2 text-right">Unitário</th>
                      <th class="px-4 py-2 text-right">Total</th>
                      <th class="px-4 py-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody id="capexTableBody">
                    <!-- Hidratado via JavaScript -->
                  </tbody>
                  <tfoot>
                    <tr class="bg-slate-50 font-black text-xs border-t border-slate-200">
                      <td colspan="3" class="px-4 py-2 text-slate-600">Total Investimentos Fixos</td>
                      <td id="capexTotalDisplay" class="px-4 py-2 text-right text-slate-900">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Pré-Operacional -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">5.3 Investimentos Pré-Operacionais</h4>
                  <p class="text-[11px] text-slate-500">INPI, contratos, pesquisa primária de campo (722 pessoas).</p>
                </div>
                <button type="button" onclick="addNewPreOpRow()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">+ Despesa</button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th class="px-4 py-2">Descrição da Despesa</th>
                      <th class="px-4 py-2 text-right">Valor Aportado (R$)</th>
                      <th class="px-4 py-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody id="preOpTableBody">
                    <!-- Hidratado via JavaScript -->
                  </tbody>
                  <tfoot>
                    <tr class="bg-slate-50 font-black text-xs border-t border-slate-200">
                      <td class="px-4 py-2 text-slate-600">Total Pré-Operacional</td>
                      <td id="preOpTotalDisplay" class="px-4 py-2 text-right text-slate-900">R$ 0</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <!-- INPUTS CIRÚRGICOS: FATURAMENTO, CUSTOS E OPEX -->
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-black text-slate-900 uppercase tracking-wider">Parâmetros Cirúrgicos da Operação (Edite e recalcula em tempo real)</h4>
                <p class="text-xs text-slate-500">Qualquer alteração nos campos abaixo atualiza instantaneamente o DRE, margens e gráficos.</p>
              </div>
              <button type="button" onclick="recalculateAllFinancials(); saveBusinessPlan(false);" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs">
                Recalcular Tudo
              </button>
            </div>

            <!-- Grupo 1: Faturamento Multicanal -->
            <div class="space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-cyan-700">Faturamento Multicanal Projetado (Ano 1)</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Nº Assinantes Anuais</label>
                  <input type="number" id="finInput_annualSubscribers" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Preço Anual Radar</label>
                  <input type="number" step="500" id="finInput_annualPrice" oninput="recalculateAllFinancials()" class="w-full font-black text-emerald-700 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Qtd Inteligência Aplicada</label>
                  <input type="number" id="finInput_appliedIntelProjects" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Qtd Pesquisa Sob Encomenda</label>
                  <input type="number" id="finInput_customResearchProjects" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Qtd Matérias Patrocinadas</label>
                  <input type="number" id="finInput_blogSponsorships" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
              </div>
            </div>

            <!-- Grupo 2: Deduções, Variáveis e COGS SaaS -->
            <div class="space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-amber-700">Custos Variáveis, COGS SaaS & Comissões</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Imposto Simples (%)</label>
                  <input type="number" step="0.5" id="finInput_taxRatePct" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Comissão Parceiros (%)</label>
                  <input type="number" step="1" id="finInput_affiliateCommissionPct" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Gateway Asaas (%)</label>
                  <input type="number" step="0.1" id="finInput_gatewayRatePct" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">COGS / Servidor p/ Usuário/Ano</label>
                  <input type="number" step="20" id="finInput_cogsPerUserYear" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
              </div>
            </div>

            <!-- Grupo 3: Custos Fixos Mensais (Opex) -->
            <div class="space-y-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-indigo-700">Custos Fixos Mensais (Folha, Pró-labore & Ferramentas)</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Pró-labore Leonardo (Mês)</label>
                  <input type="number" step="500" id="finInput_proLaboreLeonardo" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Pró-labore Mayumi (Mês)</label>
                  <input type="number" step="500" id="finInput_proLaboreMayumi" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Equipe / Assistente (Mês)</label>
                  <input type="number" step="500" id="finInput_staffPayroll" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
                <div class="bg-white p-3 rounded-xl border border-slate-200">
                  <label class="text-[10px] font-bold text-slate-500 block mb-1">Softwares SaaS / Cloud (Mês)</label>
                  <input type="number" step="100" id="finInput_cloudTools" oninput="recalculateAllFinancials()" class="w-full font-black text-slate-800 text-sm outline-none" />
                </div>
              </div>
            </div>
          </div>

          <!-- DRE AUTOMATIZADO E INDICADORES DE VIABILIDADE -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            <!-- Tabela DRE Completa -->
            <div class="space-y-3">
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">5.12 Demonstrativo do Resultado do Exercício (DRE Anual)</h4>
                <p class="text-[11px] text-slate-500">Cálculo contábil auditado de receitas, deduções, margem de contribuição e EBITDA.</p>
              </div>
              <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table class="w-full text-left text-xs border-collapse">
                  <tbody class="divide-y divide-slate-100">
                    <tr class="font-bold text-slate-900 bg-slate-50/50">
                      <td class="px-4 py-2.5">Receita Operacional Bruta</td>
                      <td id="dreGrossRevenue" class="px-4 py-2.5 text-right font-black text-slate-900">R$ 0</td>
                    </tr>
                    <tr class="text-rose-600">
                      <td class="px-4 py-2.5">(-) Impostos & Tributos (Simples)</td>
                      <td id="dreTaxes" class="px-4 py-2.5 text-right font-bold">- R$ 0</td>
                    </tr>
                    <tr class="font-bold text-slate-800 bg-slate-50/30">
                      <td class="px-4 py-2.5">(=) Receita Operacional Líquida</td>
                      <td id="dreNetRevenue" class="px-4 py-2.5 text-right font-black">R$ 0</td>
                    </tr>
                    <tr class="text-amber-700">
                      <td class="px-4 py-2.5">(-) Custos Variáveis (COGS + Comissões + Gateway)</td>
                      <td id="dreVariableCosts" class="px-4 py-2.5 text-right font-bold">- R$ 0</td>
                    </tr>
                    <tr class="font-bold text-emerald-800 bg-emerald-50/50">
                      <td class="px-4 py-2.5">(=) Margem de Contribuição Bruta</td>
                      <td id="dreContributionMargin" class="px-4 py-2.5 text-right font-black">R$ 0 (0%)</td>
                    </tr>
                    <tr class="text-rose-600">
                      <td class="px-4 py-2.5">(-) Custos Fixos Operacionais (Opex + Mão de Obra)</td>
                      <td id="dreFixedCosts" class="px-4 py-2.5 text-right font-bold">- R$ 0</td>
                    </tr>
                    <tr class="text-slate-500">
                      <td class="px-4 py-2.5">(-) Depreciação de Equipamentos</td>
                      <td id="dreDepreciation" class="px-4 py-2.5 text-right">- R$ 0</td>
                    </tr>
                    <tr class="font-bold text-slate-900 bg-slate-50">
                      <td class="px-4 py-2.5">(=) EBITDA / LAIDA</td>
                      <td id="dreEbitda" class="px-4 py-2.5 text-right font-black">R$ 0</td>
                    </tr>
                    <tr class="font-black text-sm text-emerald-700 bg-emerald-100/60 border-t-2 border-emerald-300">
                      <td class="px-4 py-3">(=) LUCRO OPERACIONAL LÍQUIDO</td>
                      <td id="dreNetProfit" class="px-4 py-3 text-right">R$ 0</td>
                    </tr>
                    <tr class="text-xs font-bold text-slate-600">
                      <td class="px-4 py-2">Margem Líquida no Bolso</td>
                      <td id="dreNetMargin" class="px-4 py-2 text-right">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Indicadores Oficiais SEBRAE -->
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">5.13 Indicadores Oficiais de Viabilidade SEBRAE</h4>
                <p class="text-[11px] text-slate-500">Métricas financeiras padronizadas para análise bancária e investidores.</p>
              </div>

              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Ponto de Equilíbrio (R$)</span>
                  <div id="viaPeReais" class="text-lg font-black text-slate-900">R$ 0</div>
                  <span id="viaPeClientes" class="text-[10px] text-slate-500 font-bold block mt-1">0 clientes anuais</span>
                </div>

                <div class="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-0.5">Lucratividade (%)</span>
                  <div id="viaLucratividade" class="text-lg font-black text-emerald-950">0%</div>
                  <span class="text-[10px] text-emerald-700 font-medium block mt-1">(Lucro Líquido / Receita)</span>
                </div>

                <div class="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                  <span class="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-0.5">Rentabilidade ROI (%)</span>
                  <div id="viaRentabilidade" class="text-lg font-black text-indigo-950">0%</div>
                  <span class="text-[10px] text-indigo-700 font-medium block mt-1">(Lucro / Investimento Total)</span>
                </div>

                <div class="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
                  <span class="text-[10px] font-black uppercase tracking-wider text-purple-700 block mb-0.5">Payback Simples</span>
                  <div id="viaPayback" class="text-lg font-black text-purple-950">0 Meses</div>
                  <span class="text-[10px] text-purple-700 font-medium block mt-1">Retorno do capital inicial</span>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Investimento Total Consolidado (Capex + Pré-Op + Giro):</span>
                  <span id="viaInvestimentoTotal" class="font-black text-slate-900">R$ 0</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Necessidade de Capital de Giro & Reserva:</span>
                  <span id="viaCapitalGiro" class="font-bold text-slate-800">R$ 0</span>
                </div>
              </div>
            </div>
          </div>

          <!-- GRÁFICOS FINANCEIROS CHART.JS -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            <!-- Gráfico 1: Composição do DRE -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Composição das Contas (DRE Visual)</h4>
              <div class="h-64 relative">
                <canvas id="dreBreakdownChartCanvas"></canvas>
              </div>
            </div>

            <!-- Gráfico 2: Curva de Ponto de Equilíbrio -->
            <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Curva de Ponto de Equilíbrio (Break-Even)</h4>
              <div class="h-64 relative">
                <canvas id="breakEvenChartCanvas"></canvas>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 6: SIMULADOR DE CENÁRIOS INTERATIVO ==================== -->
        <section id="sec-cenarios" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">SEBRAE • Seção 6</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">6. Simulador de Cenários Interativo com Sliders</h2>
            <p class="text-xs text-slate-500">Mova os controles deslizantes para ver em tempo real como o negócio se comporta nos cenários Pessimista, Provável e Otimista.</p>
          </div>

          <!-- SLIDERS DE SENSIBILIDADE -->
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

          <!-- CARDS COMPARATIVOS DOS 3 CENÁRIOS -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Pessimista -->
            <div class="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
              <div class="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
                <i class="fa-solid fa-cloud-rain"></i> Cenário Pessimista
              </div>
              <div class="space-y-1.5 text-xs">
                <div class="flex justify-between text-slate-600"><span>Receita Bruta:</span> <strong id="simPessGross" class="text-slate-900">R$ 0</strong></div>
                <div class="flex justify-between text-slate-600"><span>Lucro Líquido:</span> <strong id="simPessProfit" class="text-rose-700">R$ 0</strong></div>
                <div class="flex justify-between text-slate-600"><span>Margem Líquida:</span> <strong id="simPessMargin" class="text-slate-800">0%</strong></div>
              </div>
            </div>

            <!-- Provável -->
            <div class="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
              <div class="flex items-center gap-2 text-blue-900 font-black text-xs uppercase tracking-wider">
                <i class="fa-solid fa-circle-check"></i> Cenário Provável (Meta)
              </div>
              <div class="space-y-1.5 text-xs">
                <div class="flex justify-between text-slate-600"><span>Receita Bruta:</span> <strong id="simProvGross" class="text-slate-900">R$ 0</strong></div>
                <div class="flex justify-between text-slate-600"><span>Lucro Líquido:</span> <strong id="simProvProfit" class="text-emerald-700">R$ 0</strong></div>
                <div class="flex justify-between text-slate-600"><span>Margem Líquida:</span> <strong id="simProvMargin" class="text-slate-800">0%</strong></div>
              </div>
            </div>

            <!-- Otimista -->
            <div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
              <div class="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                <i class="fa-solid fa-rocket"></i> Cenário Otimista
              </div>
              <div class="space-y-1.5 text-xs">
                <div class="flex justify-between text-slate-600"><span>Receita Bruta:</span> <strong id="simOtimGross" class="text-slate-900">R$ 0</strong></div>
                <div class="flex justify-between text-slate-600"><span>Lucro Líquido:</span> <strong id="simOtimProfit" class="text-emerald-700">R$ 0</strong></div>
                <div class="flex justify-between text-slate-600"><span>Margem Líquida:</span> <strong id="simOtimMargin" class="text-slate-800">0%</strong></div>
              </div>
            </div>
          </div>

          <!-- GRÁFICO COMPARATIVO CHART.JS -->
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Comparação Gráfica: Receita vs Custos vs Lucro por Cenário</h4>
            <div class="h-64 relative">
              <canvas id="scenarioComparisonChartCanvas"></canvas>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 7: MATRIZ SWOT (F.O.F.A.) ==================== -->
        <section id="sec-swot" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-amber-600 block">SEBRAE • Seção 7</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">7. Avaliação Estratégica (Matriz F.O.F.A. / SWOT Dinâmica)</h2>
            <p class="text-xs text-slate-500">Forças, Oportunidades, Fraquezas e Ameaças mapeadas para a consolidação do Radar São José.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- FORÇAS -->
            <div class="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <i class="fa-solid fa-dumbbell"></i> Forças (Fatores Internos Positivos)
                </h4>
                <button type="button" onclick="addNewSwotItem('forca')" class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500">+ Item</button>
              </div>
              <div id="swotList_forca" class="space-y-2">
                <!-- Hidratado via JavaScript -->
              </div>
            </div>

            <!-- OPORTUNIDADES -->
            <div class="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-2">
                  <i class="fa-solid fa-lightbulb"></i> Oportunidades (Mercado / Externo)
                </h4>
                <button type="button" onclick="addNewSwotItem('oportunidade')" class="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500">+ Item</button>
              </div>
              <div id="swotList_oportunidade" class="space-y-2">
                <!-- Hidratado via JavaScript -->
              </div>
            </div>

            <!-- FRAQUEZAS -->
            <div class="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-2">
                  <i class="fa-solid fa-triangle-exclamation"></i> Fraquezas (Aprimoramento Interno)
                </h4>
                <button type="button" onclick="addNewSwotItem('fraqueza')" class="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-500">+ Item</button>
              </div>
              <div id="swotList_fraqueza" class="space-y-2">
                <!-- Hidratado via JavaScript -->
              </div>
            </div>

            <!-- AMEAÇAS -->
            <div class="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-2">
                  <i class="fa-solid fa-shield-virus"></i> Ameaças (Fatores Externos de Risco)
                </h4>
                <button type="button" onclick="addNewSwotItem('ameaca')" class="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500">+ Item</button>
              </div>
              <div id="swotList_ameaca" class="space-y-2">
                <!-- Hidratado via JavaScript -->
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== SEÇÃO 8: AVALIAÇÃO DO PLANO & REFLEXÃO ==================== -->
        <section id="sec-avaliacao" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-[10px] font-black uppercase tracking-wider text-cyan-600 block">SEBRAE • Seção 8</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">8. Avaliação do Plano de Negócio & Governança</h2>
            <p class="text-xs text-slate-500">Reflexão final dos fundadores, independência em relação ao Studio 8 e princípios de tomada de decisão.</p>
          </div>

          <div>
            <label class="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Reflexão Estratégica Final</label>
            <textarea id="planEvalReflection" rows="4" onchange="saveBusinessPlan(false)" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 leading-relaxed outline-none focus:bg-white focus:border-cyan-500 transition-all"></textarea>
          </div>

          <div class="p-6 bg-[#0B2545] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="space-y-1">
              <h4 class="text-sm font-black text-cyan-300">Pronto para Apresentação ao SEBRAE ou Bancos de Fomento?</h4>
              <p class="text-xs text-slate-300">Exporte este planejamento completo em PDF oficial diagramado em formato executivo.</p>
            </div>
            <div class="flex items-center gap-3">
              <button type="button" onclick="exportBusinessPlanPDF()" class="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer">
                <i class="fa-solid fa-file-pdf"></i>
                <span>Baixar PDF Executivo</span>
              </button>
            </div>
          </div>
        </section>

      </div>

    </div>`;

// 3. Substituir o bloco antigo do tab-plan
const oldTabStart = '<!-- ==================== TAB: BUSINESS PLAN (PLANO DE NEGÓCIOS EDITÁVEL) ==================== -->';
const nextTabMarker = '<!-- ==================== TAB 3: RELATÓRIOS ==================== -->';

const startIdx = content.indexOf(oldTabStart);
const endIdx = content.indexOf(nextTabMarker);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + newTabPlanHtml + '\n\n    ' + content.slice(endIdx);
  console.log('✅ Bloco HTML do tab-plan substituído com sucesso!');
} else {
  console.error('❌ Não foi possível encontrar os marcadores de tab-plan no HTML.');
  process.exit(1);
}

// 4. Injetar <script src="business-plan-controller.js"></script> antes de </body> se não existir
if (!content.includes('business-plan-controller.js')) {
  const scriptTag = '  <script src="business-plan-controller.js"></script>\n</body>';
  content = content.replace('</body>', scriptTag);
  console.log('✅ Script business-plan-controller.js injetado antes de </body>!');
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('🎉 admin-crm.html atualizado com sucesso!');
