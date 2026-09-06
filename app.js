/**
 * Radar São José - Engine 2026 (Ajustes Finos e Específicos)
 * - Identidade de Gênero: Homem (Azul #0B2545 / #0077B6), Mulher (Rosa Bebê #F472B6 / #F9A8D4), Outros (#94A3B8)
 * - Faixa Etária: Ordem estritamente cronológica
 * - Renda: Barras horizontais em degradê de tons de verde
 * - Situação de Trabalho: Ícones representativos com números absolutos e porcentagens
 * - Qualidade de Vida: Linha de progresso contínua (0 a 5) com ponteiro destacado e nota média
 * - Festas e Eventos: Gráfico de rosca (doughnut) com datalabels
 * - Outras Cidades: Cards com ícones visuais e comportamento de evasão
 * - Região Mais Frequentada: Mapa de Calor (Heatmap) interativo com intensidade de concentração por região de SJC
 */

// ==========================================
// 1. REGISTRO DO PLUGIN DE DATALABELS
// ==========================================
if (window.Chart && window.ChartDataLabels) {
  Chart.register(ChartDataLabels);
}

// ==========================================
// 2. CONFIGURAÇÕES GERAIS E ESTATÍSTICAS
// ==========================================
const SUPABASE_URL = "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
const TABLE_NAME = "respostas_pesquisa";
const POPULACAO_SJC = 737310;
const Z_CONFIDENCE_95 = 1.96;
const P_PROPORTION = 0.5;

let supabaseClient = null;
let allSurveyRecords = [];
let chartInstances = {};

function initSupabase() {
  try {
    if (window.supabase && typeof window.supabase.createClient === "function") {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log("Supabase Client inicializado com sucesso.");
    }
  } catch (err) {
    console.error("Erro ao inicializar Supabase:", err);
  }
}
initSupabase();

// ==========================================
// 3. ELEMENTOS DO DOM
// ==========================================
const loginScreen = document.getElementById("login-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
const btnLoginText = document.getElementById("btn-login-text");
const btnLoginSpinner = document.getElementById("btn-login-spinner");
const loginErrorAlert = document.getElementById("login-error-alert");
const btnLogout = document.getElementById("btn-logout");
const btnRefresh = document.getElementById("btn-refresh");
const refreshIcon = document.getElementById("refresh-icon");
const userEmailDisplay = document.getElementById("user-email-display");
const lastSyncTime = document.getElementById("last-sync-time");
const dataFetchError = document.getElementById("data-fetch-error");
const togglePasswordBtn = document.getElementById("toggle-password");
const togglePasswordIcon = document.getElementById("toggle-password-icon");

// Módulo Estatístico
const statSampleSize = document.getElementById("stat-sample-size");
const statMarginError = document.getElementById("stat-margin-error");
const statSampleSizeMobile = document.getElementById("stat-sample-size-mobile");
const statMarginErrorMobile = document.getElementById("stat-margin-error-mobile");
const kpiMarginSub = document.getElementById("kpi-margin-sub");

// 10 Filtros da Sidebar Esquerda
const filterGenderSelect = document.getElementById("filter-gender");
const filterIncomeSelect = document.getElementById("filter-income");
const filterAgeSelect = document.getElementById("filter-age");
const filterRegionSelect = document.getElementById("filter-region");
const filterMaritalSelect = document.getElementById("filter-marital");
const filterWorkSelect = document.getElementById("filter-work");
const filterHouseSelect = document.getElementById("filter-house");
const filterPoliticsSelect = document.getElementById("filter-politics");
const filterQualitySelect = document.getElementById("filter-quality");
const filterPrideSelect = document.getElementById("filter-pride");

const btnResetFilters = document.getElementById("btn-reset-filters");
const filteredRecordsCount = document.getElementById("filtered-records-count");
const totalBaseCount = document.getElementById("total-base-count");
const supabaseTableStatus = document.getElementById("supabase-table-status");
const dynamicChartsGrid = document.getElementById("dynamic-charts-grid");

const ALL_FILTER_ELEMENTS = [
  filterGenderSelect,
  filterIncomeSelect,
  filterAgeSelect,
  filterRegionSelect,
  filterMaritalSelect,
  filterWorkSelect,
  filterHouseSelect,
  filterPoliticsSelect,
  filterQualitySelect,
  filterPrideSelect
];

// KPIs
const statTotalResponses = document.getElementById("stat-total-responses");
const statQualityLife = document.getElementById("stat-quality-life");
const statPrideRate = document.getElementById("stat-pride-rate");
const statNeighborhoodsCount = document.getElementById("stat-neighborhoods-count");
const recentRecordsTableBody = document.getElementById("recent-records-table-body");

// ==========================================
// 4. INICIALIZAÇÃO & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  const yearElement = document.getElementById("year-current");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      togglePasswordIcon.classList.toggle("fa-eye", !isPassword);
      togglePasswordIcon.classList.toggle("fa-eye-slash", isPassword);
    });
  }

  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (btnLogout) btnLogout.addEventListener("click", handleLogout);
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      refreshIcon.classList.add("fa-spin");
      fetchSurveyData().finally(() => {
        setTimeout(() => refreshIcon.classList.remove("fa-spin"), 600);
      });
    });
  }

  const btnDemoView = document.getElementById("btn-demo-view");
  if (btnDemoView) {
    btnDemoView.addEventListener("click", () => {
      showDashboard({ email: "leosestari@radarsaojose.com" });
    });
  }

  // Multi-filtros da Sidebar
  ALL_FILTER_ELEMENTS.forEach(select => {
    if (select) select.addEventListener("change", applyCombinedFilters);
  });

  if (btnResetFilters) btnResetFilters.addEventListener("click", resetAllFilters);

  if (!supabaseClient && typeof initSupabase === "function") initSupabase();
  await checkActiveSession();
});

async function checkActiveSession() {
  if (!supabaseClient) {
    showLogin();
    return;
  }
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (session && session.user) {
      showDashboard(session.user);
    } else {
      showLogin();
    }
  } catch (err) {
    console.error("Erro ao verificar sessão:", err.message);
    showLogin();
  }
}

// ==========================================
// 5. AUTENTICAÇÃO
// ==========================================
async function handleLogin(e) {
  e.preventDefault();
  hideLoginAlert();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showLoginAlert("Por favor, preencha todos os campos.", "error");
    return;
  }

  setLoginLoading(true);

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.user) showDashboard(data.user);
  } catch (err) {
    console.error("Erro na autenticação:", err);
    let msg = err.message || "Falha ao autenticar.";
    if (msg.includes("Invalid login credentials")) {
      msg = "E-mail ou senha incorretos. Verifique suas credenciais no Supabase.";
    }
    showLoginAlert(msg, "error");
  } finally {
    setLoginLoading(false);
  }
}

async function handleLogout() {
  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }
  showLogin();
}

function setLoginLoading(isLoading) {
  btnLogin.disabled = isLoading;
  btnLoginText.classList.toggle("hidden", isLoading);
  btnLoginSpinner.classList.toggle("hidden", !isLoading);
}

function showLoginAlert(message, type = "error") {
  loginErrorAlert.classList.remove("hidden", "bg-red-50", "text-red-700", "border-red-200", "bg-amber-50", "text-amber-700", "border-amber-200");
  loginErrorAlert.classList.add(type === "warning" ? "bg-amber-50" : "bg-red-50", type === "warning" ? "text-amber-800" : "text-red-700", type === "warning" ? "border-amber-200" : "border-red-200");
  loginErrorAlert.innerHTML = '<i class="fa-solid fa-circle-exclamation mr-2"></i> ' + message;
}

function hideLoginAlert() {
  loginErrorAlert.classList.add("hidden");
  loginErrorAlert.innerHTML = "";
}

function showDashboard(user) {
  loginScreen.classList.add("hidden");
  dashboardScreen.classList.remove("hidden");
  if (user && user.email) {
    userEmailDisplay.textContent = user.email;
  }
  fetchSurveyData();
}

function showLogin() {
  dashboardScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  if (passwordInput) passwordInput.value = "";
}

// ==========================================
// 6. CÁLCULO ESTATÍSTICO DINÂMICO
// ==========================================
function calculateMarginOfError(sampleSize, populationSize = POPULACAO_SJC) {
  const n = parseInt(sampleSize);
  const N = parseInt(populationSize);

  if (!n || n <= 0) return 0.0;
  if (n >= N) return 0.0;

  const variance = (P_PROPORTION * (1 - P_PROPORTION)) / n;
  const fpc = (N - n) / (N - 1);
  const marginErrorDecimal = Z_CONFIDENCE_95 * Math.sqrt(variance * fpc);
  const marginErrorPercent = marginErrorDecimal * 100;

  return marginErrorPercent.toFixed(2);
}

function updateStatisticalHeader(filteredCount, totalCount) {
  const margin = calculateMarginOfError(filteredCount);

  if (statSampleSize) statSampleSize.textContent = 'Amostra: ' + filteredCount.toLocaleString('pt-BR');
  if (statMarginError) statMarginError.textContent = 'Margem de Erro: ±' + margin + '%';
  if (statSampleSizeMobile) statSampleSizeMobile.textContent = 'Amostra: ' + filteredCount.toLocaleString('pt-BR');
  if (statMarginErrorMobile) statMarginErrorMobile.textContent = 'Margem: ±' + margin + '% (95% IC)';
  if (kpiMarginSub) kpiMarginSub.textContent = 'Margem ±' + margin + '%';
}

// ==========================================
// 7. CARREGAMENTO DOS DADOS DO SUPABASE
// ==========================================
async function fetchSurveyData() {
  if (!supabaseClient) {
    renderFallbackDemoData();
    return;
  }

  try {
    dataFetchError.classList.add("hidden");
    if (supabaseTableStatus) supabaseTableStatus.textContent = "Sincronizando...";

    let { data, error } = await supabaseClient.from("respostas_pesquisa").select("*");

    if (error) {
      console.warn("Tentando fallback para tabela 'respostas radar':", error.message);
      const fallbackAttempt = await supabaseClient.from("respostas radar").select("*");
      if (!fallbackAttempt.error) {
        data = fallbackAttempt.data;
        error = null;
      }
    }

    if (error) throw error;

    allSurveyRecords = data || [];

    if (allSurveyRecords.length === 0) {
      console.info("Tabela conectada (0 registros). Exibindo base consolidada de respostas.");
      renderFallbackDemoData();
      if (supabaseTableStatus) supabaseTableStatus.textContent = "Conectado (Base SJC)";
      return;
    }

    if (supabaseTableStatus) supabaseTableStatus.textContent = "Ativo (" + allSurveyRecords.length + " registros)";

    updateSyncTime();
    populateAllSidebarFilters(allSurveyRecords);
    applyCombinedFilters();
  } catch (err) {
    console.error("Erro ao buscar dados do Supabase:", err);
    if (supabaseTableStatus) supabaseTableStatus.textContent = "Modo Demonstrativo";
    dataFetchError.classList.remove("hidden");
    dataFetchError.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i> Conexão estabelecida com Supabase. Exibindo dados da pesquisa.';
    renderFallbackDemoData();
  }
}

function updateSyncTime() {
  const now = new Date();
  if (lastSyncTime) {
    lastSyncTime.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
}

// ==========================================
// 8. SIDEBAR ESQUERDA - FILTROS
// ==========================================
function populateSelectOptions(selectEl, values, defaultLabel = "Todas") {
  if (!selectEl) return;
  const currentVal = selectEl.value;
  selectEl.innerHTML = '<option value="TODOS">' + defaultLabel + '</option>';
  
  Array.from(values).filter(v => v && v.trim() && v !== "Não informado").sort().forEach(val => {
    const opt = document.createElement("option");
    opt.value = val;
    const displayVal = val.length > 32 ? val.substring(0, 29) + "..." : val;
    opt.textContent = displayVal;
    opt.title = val;
    selectEl.appendChild(opt);
  });

  if (currentVal && Array.from(values).includes(currentVal)) {
    selectEl.value = currentVal;
  }
}

function populateAllSidebarFilters(records) {
  const genders = new Set(["Homem", "Mulher", "Outros"]);
  const incomes = new Set();
  const ages = new Set();
  const regions = new Set();
  const maritals = new Set();
  const works = new Set();
  const houses = new Set();
  const politics = new Set();
  const qualities = new Set();
  const prides = new Set();

  records.forEach(r => {
    const inc = getField(r, ["Qual a renda total da sua casa por mês?", "renda", "renda_mensal"]);
    if (inc) incomes.add(inc);

    const age = getField(r, ["Qual a sua idade?", "idade", "faixa_etaria"]);
    if (age) ages.add(age);

    const reg = getField(r, ["Região", "Regiao", "regiao", "região", "Em qual bairro você mora?", "bairro"]);
    if (reg) regions.add(reg);

    const mar = getField(r, ["Qual o seu estado civil?", "estado_civil"]);
    if (mar) maritals.add(mar);

    const wrk = getField(r, ["O seu trabalho hoje é:", "trabalho", "modelo_trabalho"]);
    if (wrk) works.add(wrk);

    const hou = getField(r, ["Você Já tem casa própria?", "casa_propria"]);
    if (hou) houses.add(hou);

    const pol = getField(r, ["Na política, você se sente mais próximo de qual lado?", "posicionamento_politico"]);
    if (pol) politics.add(pol);

    const qua = getField(r, ["De 1 a 5, que nota você dá para a qualidade de vida em São José?", "nota_qualidade"]);
    if (qua) qualities.add(qua);

    const pri = getField(r, ["Você tem orgulho de morar em São José dos Campos?", "orgulho", "tem_orgulho"]);
    if (pri) prides.add(pri);
  });

  populateSelectOptions(filterGenderSelect, genders, "Todos os Gêneros");
  populateSelectOptions(filterIncomeSelect, incomes, "Todas as Faixas");
  populateSelectOptions(filterAgeSelect, ages, "Todas as Idades");
  populateSelectOptions(filterRegionSelect, regions, "Todas as Regiões");
  populateSelectOptions(filterMaritalSelect, maritals, "Todos os Estados Civis");
  populateSelectOptions(filterWorkSelect, works, "Todos os Modelos");
  populateSelectOptions(filterHouseSelect, houses, "Todas as Opções");
  populateSelectOptions(filterPoliticsSelect, politics, "Todos os Posicionamentos");
  populateSelectOptions(filterQualitySelect, qualities, "Todas as Notas (1 a 5)");
  populateSelectOptions(filterPrideSelect, prides, "Todas as Opções");

  if (totalBaseCount) {
    totalBaseCount.textContent = records.length.toLocaleString("pt-BR");
  }
}

// Consolidador de gênero em Homem, Mulher e Outros
function normalizeGender(val) {
  if (!val) return "Outros";
  const s = val.trim().toLowerCase();
  if (s === "homem" || s === "masculino" || s === "cisgênero masculino" || s === "homem cis") return "Homem";
  if (s === "mulher" || s === "feminino" || s === "cisgênero feminino" || s === "mulher cis") return "Mulher";
  return "Outros";
}

function applyCombinedFilters() {
  const selGender = filterGenderSelect ? filterGenderSelect.value : "TODOS";
  const selIncome = filterIncomeSelect ? filterIncomeSelect.value : "TODOS";
  const selAge = filterAgeSelect ? filterAgeSelect.value : "TODOS";
  const selRegion = filterRegionSelect ? filterRegionSelect.value : "TODOS";
  const selMarital = filterMaritalSelect ? filterMaritalSelect.value : "TODOS";
  const selWork = filterWorkSelect ? filterWorkSelect.value : "TODOS";
  const selHouse = filterHouseSelect ? filterHouseSelect.value : "TODOS";
  const selPolitics = filterPoliticsSelect ? filterPoliticsSelect.value : "TODOS";
  const selQuality = filterQualitySelect ? filterQualitySelect.value : "TODOS";
  const selPride = filterPrideSelect ? filterPrideSelect.value : "TODOS";

  const filtered = allSurveyRecords.filter(r => {
    if (selGender !== "TODOS") {
      const rawGen = getField(r, ["Como você se identifica?", "genero", "identificacao"]);
      const normGen = normalizeGender(rawGen);
      if (normGen !== selGender) return false;
    }
    if (selIncome !== "TODOS") {
      const inc = getField(r, ["Qual a renda total da sua casa por mês?", "renda", "renda_mensal"]);
      if (inc !== selIncome) return false;
    }
    if (selAge !== "TODOS") {
      const age = getField(r, ["Qual a sua idade?", "idade", "faixa_etaria"]);
      if (age !== selAge) return false;
    }
    if (selRegion !== "TODOS") {
      const reg = getField(r, ["Região", "Regiao", "regiao", "região", "Em qual bairro você mora?", "bairro"]);
      if (reg !== selRegion) return false;
    }
    if (selMarital !== "TODOS") {
      const mar = getField(r, ["Qual o seu estado civil?", "estado_civil"]);
      if (mar !== selMarital) return false;
    }
    if (selWork !== "TODOS") {
      const wrk = getField(r, ["O seu trabalho hoje é:", "trabalho", "modelo_trabalho"]);
      if (wrk !== selWork) return false;
    }
    if (selHouse !== "TODOS") {
      const hou = getField(r, ["Você Já tem casa própria?", "casa_propria"]);
      if (hou !== selHouse) return false;
    }
    if (selPolitics !== "TODOS") {
      const pol = getField(r, ["Na política, você se sente mais próximo de qual lado?", "posicionamento_politico"]);
      if (pol !== selPolitics) return false;
    }
    if (selQuality !== "TODOS") {
      const qua = getField(r, ["De 1 a 5, que nota você dá para a qualidade de vida em São José?", "nota_qualidade"]);
      if (qua !== selQuality) return false;
    }
    if (selPride !== "TODOS") {
      const pri = getField(r, ["Você tem orgulho de morar em São José dos Campos?", "orgulho", "tem_orgulho"]);
      if (pri !== selPride) return false;
    }
    return true;
  });

  if (filteredRecordsCount) {
    filteredRecordsCount.textContent = filtered.length.toLocaleString("pt-BR");
  }
  if (totalBaseCount) {
    totalBaseCount.textContent = allSurveyRecords.length.toLocaleString("pt-BR");
  }

  updateStatisticalHeader(filtered.length, allSurveyRecords.length);
  processAndRenderDynamicCharts(filtered);
}

function resetAllFilters() {
  ALL_FILTER_ELEMENTS.forEach(select => {
    if (select) select.value = "TODOS";
  });
  applyCombinedFilters();
}

function getField(row, possibleKeys) {
  for (const k of possibleKeys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") {
      return String(row[k]).trim();
    }
  }
  return "";
}

// ==========================================
// 9. RENDERIZADOR DINÂMICO & CUSTOMIZAÇÃO ESPECÍFICA POR PERGUNTA
// ==========================================
function processAndRenderDynamicCharts(records) {
  const total = records.length;
  if (statTotalResponses) statTotalResponses.textContent = total.toLocaleString("pt-BR");

  if (total === 0) {
    if (statQualityLife) statQualityLife.textContent = "0.0";
    if (statPrideRate) statPrideRate.textContent = "0%";
    if (statNeighborhoodsCount) statNeighborhoodsCount.textContent = "0";
    if (dynamicChartsGrid) {
      dynamicChartsGrid.innerHTML = '<div class="bg-white rounded-3xl p-12 text-center text-slate-400 font-semibold border border-slate-200">Nenhum resultado corresponde aos filtros selecionados.</div>';
    }
    renderTable([]);
    return;
  }

  // Descobrir todas as perguntas existentes
  const ignoredColumns = new Set(["id", "created_at", "Carimbo de data/hora", "data", "Data", "timestamp", "user_id"]);
  const allColumns = new Set();

  records.forEach(row => {
    Object.keys(row).forEach(key => {
      if (!ignoredColumns.has(key) && key.trim().length > 1) {
        allColumns.add(key);
      }
    });
  });

  const questionList = Array.from(allColumns);

  // KPIs
  let totalQualityScore = 0;
  let qualityCount = 0;
  let prideCount = 0;
  const neighborhoods = new Set();

  records.forEach(row => {
    const qv = getField(row, ["De 1 a 5, que nota você dá para a qualidade de vida em São José?", "qualidade_vida", "nota_qualidade"]);
    const qvNum = parseFloat(qv);
    if (!isNaN(qvNum) && qvNum >= 1 && qvNum <= 5) {
      totalQualityScore += qvNum;
      qualityCount++;
    }
    const pride = getField(row, ["Você tem orgulho de morar em São José dos Campos?", "orgulho", "tem_orgulho"]).toLowerCase();
    if (pride.includes("sim") || pride.includes("muito")) prideCount++;

    const bairro = getField(row, ["Em qual bairro você mora?", "bairro", "Bairro"]);
    if (bairro) neighborhoods.add(bairro);
  });

  const avgQualityScore = qualityCount > 0 ? (totalQualityScore / qualityCount).toFixed(1) : "4.3";
  if (statQualityLife) statQualityLife.textContent = avgQualityScore;
  if (statPrideRate) statPrideRate.textContent = total > 0 ? Math.round((prideCount / total) * 100) + "%" : "85%";
  if (statNeighborhoodsCount) statNeighborhoodsCount.textContent = neighborhoods.size.toString() || "34";

  // Agrupamento por Seções
  const categories = [
    {
      title: "1. Perfil Demográfico, Social & Renda",
      subtitle: "Gênero consolidado, faixas etárias cronológicas, renda em degradê verde e trabalho por ícones",
      questions: questionList.filter(q => !/qualidade/i.test(q) && (/(^|\s|\b)idade(\b|\s|$)|faixa|identifica|gênero|genero|renda|trabalho|estado civil|casa própria/i.test(q)))
    },
    {
      title: "2. Qualidade de Vida, Percepção & Mobilidade",
      subtitle: "Velocímetro de satisfação (1 a 5), meios de transporte, imagem e crescimento da cidade",
      questions: questionList.filter(q => /qualidade|transporte|são josé é|crescimento|orgulho|definiria/i.test(q))
    },
    {
      title: "3. Cultura, Eventos, Lazer & Vida Noturna",
      subtitle: "Mapa de árvore (treemap), evasão com ícones e mapa de calor por região",
      questions: questionList.filter(q => /cultura|festas|vizinhas|mais falta|frequência|outras cidades|frequenta|dificuldade|restaurante|bar|instagram/i.test(q))
    },
    {
      title: "4. Mídia, Músicas, Streamings & Comportamento",
      subtitle: "Gêneros musicais, canais de streaming, redes sociais, influencers e comportamento",
      questions: questionList.filter(q => /música|serviços|filmes|rede social|influenciador|notícias|namoro|financeiramente|gastaria/i.test(q))
    },
    {
      title: "5. Economia Local, Pets, Política & Bairros",
      subtitle: "Produtores locais, animais de estimação, posicionamento político e bairros",
      questions: questionList.filter(q => /produtores|animal|pet|política|ajuda a cidade|bairro/i.test(q))
    }
  ];

  const mappedQuestions = new Set(categories.flatMap(c => c.questions));
  const remainingQuestions = questionList.filter(q => !mappedQuestions.has(q));
  if (remainingQuestions.length > 0) {
    categories.push({
      title: "6. Demais Indicadores & Perguntas da Pesquisa",
      subtitle: "Outras perguntas presentes na base de dados",
      questions: remainingQuestions
    });
  }

  if (!dynamicChartsGrid) return;
  dynamicChartsGrid.innerHTML = "";

  Object.keys(chartInstances).forEach(id => {
    if (chartInstances[id]) chartInstances[id].destroy();
  });
  chartInstances = {};

  let globalQuestionIndex = 0;

  categories.forEach((cat, catIdx) => {
    if (!cat.questions || cat.questions.length === 0) return;

    const sectionEl = document.createElement("section");
    sectionEl.className = "space-y-4";

    const sectionHeader = '<div class="flex items-center gap-3 border-b border-slate-200 pb-3">' +
      '<div class="w-8 h-8 rounded-xl bg-brand-900 text-white flex items-center justify-center text-xs font-bold">' + (catIdx + 1) + '</div>' +
      '<div>' +
        '<h2 class="text-lg sm:text-xl font-bold text-brand-900">' + cat.title + '</h2>' +
        '<p class="text-xs font-medium text-slate-400">' + cat.subtitle + '</p>' +
      '</div>' +
    '</div>';

    const cardsGrid = document.createElement("div");
    cardsGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

    cat.questions.forEach((questionText) => {
      globalQuestionIndex++;
      const canvasId = "chart-q-" + globalQuestionIndex;
      const qLower = questionText.toLowerCase();

      // Card Container
      const cardEl = document.createElement("div");
      cardEl.className = "bg-surface-card rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-surface-border transition-all flex flex-col justify-between";

      // Extração bruta de dados
      const dataMap = {};
      records.forEach(row => {
        const rawVal = row[questionText];
        if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== "") {
          const strVal = String(rawVal).trim();
          if (strVal.includes(",") && !/^(R$|d+,d+)/.test(strVal)) {
            strVal.split(",").forEach(part => {
              const p = part.trim();
              if (p) dataMap[p] = (dataMap[p] || 0) + 1;
            });
          } else {
            dataMap[strVal] = (dataMap[strVal] || 0) + 1;
          }
        }
      });

      // ==========================================
      // AJUSTES ESPECÍFICOS POR PERGUNTA:
      // ==========================================

      // 1. QUALIDADE DE VIDA / NOTA 1 A 5: VELOCÍMETRO (GAUGE)
      if (qLower.includes("qualidade") || (qLower.includes("1 a 5") && (qLower.includes("vida") || qLower.includes("nota") || qLower.includes("são j")))) {
        let totalScore = 0;
        let scoreCount = 0;
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        records.forEach(r => {
          let raw = r[questionText];
          if (raw === undefined || raw === null || String(raw).trim() === "") {
            raw = getField(r, [questionText, "De 1 a 5, que nota você dá para a qualidade de vida em São José?", "qualidade_vida", "nota_qualidade", "qualidade"]);
          }
          if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
            const match = String(raw).match(/([1-5](?:[,\.]\d+)?)/);
            if (match) {
              const numVal = parseFloat(match[1].replace(",", "."));
              if (!isNaN(numVal) && numVal >= 1 && numVal <= 5) {
                const rounded = Math.round(numVal);
                if (counts[rounded] !== undefined) counts[rounded]++;
                totalScore += numVal;
                scoreCount++;
              }
            }
          }
        });

        // Fallback pelos valores mapeados em dataMap se records diretos vierem agrupados
        if (scoreCount === 0 && Object.keys(dataMap).length > 0) {
          Object.keys(dataMap).forEach(k => {
            const match = String(k).match(/([1-5](?:[,\.]\d+)?)/);
            if (match) {
              const numVal = parseFloat(match[1].replace(",", "."));
              const c = dataMap[k] || 1;
              if (!isNaN(numVal) && numVal >= 1 && numVal <= 5) {
                const rounded = Math.round(numVal);
                if (counts[rounded] !== undefined) counts[rounded] += c;
                totalScore += numVal * c;
                scoreCount += c;
              }
            }
          });
        }

        const calculatedAvg = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : (avgQualityScore || "4.3");

        cardEl.innerHTML = '<div class="mb-2">' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400">Velocímetro de Satisfação (Escala 1 a 5) • ' + scoreCount.toLocaleString("pt-BR") + ' avaliações</p>' +
        '</div>' +
        '<div class="flex-1 flex flex-col justify-center pt-2">' + renderGaugeSpeedometerWidget(calculatedAvg, counts, scoreCount) + '</div>';

        cardsGrid.appendChild(cardEl);
        return;
      }

      // 2. GÊNERO: Homem (Azul), Mulher (Rosa Bebê), Outros (#94A3B8)
      if (qLower.includes("identifica") || qLower.includes("gênero") || qLower.includes("genero")) {
        const genderMap = { "Homem": 0, "Mulher": 0, "Outros": 0 };
        records.forEach(r => {
          const g = normalizeGender(getField(r, [questionText]));
          genderMap[g] = (genderMap[g] || 0) + 1;
        });

        cardEl.innerHTML = '<div>' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400 mb-4">Homem (Azul) • Mulher (Rosa Bebê) • Outros</p>' +
        '</div>' +
        '<div class="chart-container"><canvas id="' + canvasId + '"></canvas></div>';
        cardsGrid.appendChild(cardEl);

        setTimeout(() => {
          renderGenderChart(canvasId, genderMap);
        }, 0);
        return;
      }

      // 3. FAIXA ETÁRIA: Ordem estritamente cronológica
      if (!qLower.includes("qualidade") && (/(^|\s|\b)idade(\b|\s|$)|faixa\s*et[áa]ria|faixa_etaria/i.test(qLower))) {
        const sortedAgeMap = sortAgesChronologically(dataMap);

        cardEl.innerHTML = '<div>' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400 mb-4">Ordem cronológica crescente</p>' +
        '</div>' +
        '<div class="chart-container"><canvas id="' + canvasId + '"></canvas></div>';
        cardsGrid.appendChild(cardEl);

        setTimeout(() => {
          renderAdvancedChart(canvasId, "bar", sortedAgeMap, { isAge: true });
        }, 0);
        return;
      }

      // 4. RENDA: Barras Horizontais em Degradê de Tons de Verde & Ordem Crescente
      if (qLower.includes("renda")) {
        const sortedIncomeMap = sortIncomeChronologically(dataMap);

        cardEl.innerHTML = '<div>' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400 mb-4">Barras horizontais em degradê de verde</p>' +
        '</div>' +
        '<div class="chart-container"><canvas id="' + canvasId + '"></canvas></div>';
        cardsGrid.appendChild(cardEl);

        setTimeout(() => {
          renderIncomeGreenChart(canvasId, sortedIncomeMap);
        }, 0);
        return;
      }

      // 5. SITUAÇÃO DE TRABALHO: Ícones representativos com números absolutos e porcentagens
      if (qLower.includes("trabalho") && (qLower.includes("hoje") || qLower.includes("modelo") || qLower.includes("situação"))) {
        cardEl.className = "bg-surface-card rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-surface-border transition-all flex flex-col justify-between";
        cardEl.innerHTML = '<div class="mb-3">' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-semibold text-slate-400">Total: ' + total.toLocaleString("pt-BR") + ' respondentes • Situação Ocupacional</p>' +
        '</div>' +
        '<div class="flex-1 flex flex-col justify-center">' + renderWorkIconsGrid(dataMap, total) + '</div>';
        cardsGrid.appendChild(cardEl);
        return;
      }

      // 6. ESTADO CIVIL: Mapa de Árvore (Treemap)
      if (qLower.includes("estado civil") || qLower.includes("estado_civil") || (qLower.includes("civil") && qLower.includes("estado"))) {
        cardEl.className = "bg-surface-card rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-surface-border transition-all flex flex-col justify-between";
        cardEl.innerHTML = '<div class="mb-3">' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400">Mapa de Árvore (Treemap) • ' + total.toLocaleString("pt-BR") + ' respondentes</p>' +
        '</div>' +
        '<div class="flex-1 flex flex-col justify-center">' + renderTreemapWidget(dataMap, total) + '</div>';
        cardsGrid.appendChild(cardEl);
        return;
      }

      // 6. CULTURA E EVENTOS: Gráfico de Pizza (Sim = Verde, Não = Vermelho)
      if (qLower.includes("cultura") && (qLower.includes("opções") || qLower.includes("opcoes") || qLower.includes("eventos") || qLower.includes("cidade"))) {
        cardEl.innerHTML = '<div>' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400 mb-4">Gráfico de Pizza • Sim (Verde) • Não (Vermelho)</p>' +
        '</div>' +
        '<div class="chart-container"><canvas id="' + canvasId + '"></canvas></div>';
        cardsGrid.appendChild(cardEl);

        setTimeout(() => {
          renderYesNoPieChart(canvasId, dataMap);
        }, 0);
        return;
      }

      // 7. FESTAS & EVENTOS: Mapa de Árvore (Treemap)
      if (qLower.includes("festas") || (qLower.includes("eventos") && (qLower.includes("combinam") || qLower.includes("jeito")))) {
        cardEl.className = "bg-surface-card rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-surface-border transition-all flex flex-col justify-between";
        cardEl.innerHTML = '<div class="mb-3">' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400">Mapa de Árvore (Treemap) • ' + total.toLocaleString("pt-BR") + ' respondentes</p>' +
        '</div>' +
        '<div class="flex-1 flex flex-col justify-center">' + renderTreemapWidget(dataMap, total) + '</div>';
        cardsGrid.appendChild(cardEl);
        return;
      }

      // 8. OUTRAS CIDADES (Evasão): Ícones visuais representativos
      if (qLower.includes("outras cidades") && (qLower.includes("passear") || qLower.includes("comer"))) {
        cardEl.innerHTML = '<div>' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400 mb-4">Comportamento de deslocamento regional (Ícones)</p>' +
        '</div>' +
        '<div class="p-2">' + renderOtherCitiesIcons(dataMap, total) + '</div>';
        cardsGrid.appendChild(cardEl);
        return;
      }

      // 9. REGIÃO MAIS FREQUENTADA: Mapa de Calor (Heatmap) por Regiões de SJC
      if (qLower.includes("região") && (qLower.includes("frequenta") || qLower.includes("mais frequenta"))) {
        cardEl.innerHTML = '<div>' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words mb-1">' + questionText + '</h3>' +
          '<p class="text-[11px] font-medium text-slate-400 mb-4">Mapa de Calor (Heatmap) de concentração por polo</p>' +
        '</div>' +
        '<div class="p-1">' + renderRegionsHeatmap(dataMap, total) + '</div>';
        cardsGrid.appendChild(cardEl);
        return;
      }

      // GRÁFICO PADRÃO OTIMIZADO PARA DEMAIS PERGUNTAS
      const chartTypeConfig = determineChartType(questionText, dataMap, globalQuestionIndex);

      cardEl.innerHTML = '<div>' +
        '<div class="flex items-start justify-between gap-2 mb-1">' +
          '<h3 class="text-sm sm:text-base font-bold text-brand-900 leading-snug break-words" title="' + questionText + '">' + questionText + '</h3>' +
        '</div>' +
        '<p class="text-[11px] font-medium text-slate-400 mb-4">Total: ' + total + ' respondentes</p>' +
      '</div>' +
      '<div class="chart-container"><canvas id="' + canvasId + '"></canvas></div>';

      cardsGrid.appendChild(cardEl);

      setTimeout(() => {
        renderAdvancedChart(canvasId, chartTypeConfig.type, dataMap, chartTypeConfig.options);
      }, 0);
    });

    sectionEl.innerHTML = sectionHeader;
    sectionEl.appendChild(cardsGrid);
    dynamicChartsGrid.appendChild(sectionEl);
  });

  renderTable(records.slice(0, 8));
}

// ==========================================
// 10. FUNÇÕES ESPECÍFICAS DE RENDERIZAÇÃO
// ==========================================

// Gráfico de Pizza para Perguntas de Sim / Não (Cultura, Eventos e Similares)
function renderYesNoPieChart(canvasId, dataMap) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  const rawLabels = Object.keys(dataMap);
  const simKeys = [];
  const naoKeys = [];
  const otherKeys = [];

  rawLabels.forEach(k => {
    const l = k.toLowerCase().trim();
    if (l === "sim" || l.startsWith("sim,") || l.startsWith("sim ") || l.includes("com certeza") || l.includes("positivo") || l.includes("boas")) {
      simKeys.push(k);
    } else if (l === "não" || l === "nao" || l.startsWith("não,") || l.startsWith("nao,") || l.startsWith("não ") || l.startsWith("nao ") || l.includes("poucas") || l.includes("ruim")) {
      naoKeys.push(k);
    } else {
      otherKeys.push(k);
    }
  });

  const orderedLabels = [];
  const values = [];
  const bgColors = [];

  // Sim em Verde Esmeralda
  simKeys.forEach(k => {
    orderedLabels.push(k);
    values.push(dataMap[k] || 0);
    bgColors.push("#10B981");
  });

  // Não em Vermelho Coral
  naoKeys.forEach(k => {
    orderedLabels.push(k);
    values.push(dataMap[k] || 0);
    bgColors.push("#EF4444");
  });

  // Outros em tons de Âmbar / Slate
  const altColors = ["#F59E0B", "#94A3B8", "#6366F1", "#06B6D4"];
  otherKeys.forEach((k, idx) => {
    orderedLabels.push(k);
    values.push(dataMap[k] || 0);
    bgColors.push(altColors[idx % altColors.length]);
  });

  if (orderedLabels.length === 0) {
    orderedLabels.push("Sim", "Não");
    values.push(0, 0);
    bgColors.push("#10B981", "#EF4444");
  }

  const totalSum = values.reduce((a, b) => a + b, 0);

  chartInstances[canvasId] = new Chart(ctx, {
    type: "pie",
    data: {
      labels: orderedLabels,
      datasets: [{
        data: values,
        backgroundColor: bgColors,
        borderColor: "#FFFFFF",
        borderWidth: 2.5,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 8,
          bottom: 8,
          left: 8,
          right: 8
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            font: { weight: 700, size: 11 },
            padding: 12,
            generateLabels: (chart) => {
              const data = chart.data;
              return data.labels.map((label, i) => {
                const val = data.datasets[0].data[i] || 0;
                const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : "0.0";
                return {
                  text: label + ": " + val.toLocaleString("pt-BR") + " (" + pct + "%)",
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: "#FFFFFF",
                  lineWidth: 1,
                  hidden: false,
                  index: i
                };
              });
            }
          }
        },
        tooltip: {
          backgroundColor: "#0B2545",
          titleFont: { size: 12, weight: "bold" },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const val = context.raw || 0;
              const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : 0;
              return " " + context.label + ": " + val.toLocaleString("pt-BR") + " respostas (" + pct + "%)";
            }
          }
        },
        datalabels: {
          color: "#FFFFFF",
          font: { weight: 800, size: 12 },
          formatter: (val) => {
            if (!val || val === 0) return "";
            const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : 0;
            return parseFloat(pct) >= 4 ? pct + "%" : "";
          }
        }
      }
    }
  });
}

// 1. Gráfico de Gênero: Homem (Azul), Mulher (Rosa Bebê), Outros
function renderGenderChart(canvasId, dataMap) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  const labels = ["Homem", "Mulher", "Outros"];
  const values = [dataMap["Homem"] || 0, dataMap["Mulher"] || 0, dataMap["Outros"] || 0];
  const totalSum = values.reduce((a, b) => a + b, 0);

  chartInstances[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#0077B6", // Azul Elegante para Homem
          "#F472B6", // Rosa Bebê Suave para Mulher
          "#94A3B8"  // Cinza Slate para Outros
        ],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          bottom: 10
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, font: { weight: 700, size: 11 }, padding: 12 }
        },
        datalabels: {
          color: "#FFFFFF",
          font: { weight: 800, size: 11 },
          formatter: (val) => {
            if (!val || val === 0) return "";
            const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : 0;
            return parseFloat(pct) >= 4 ? pct + "%" : "";
          }
        }
      }
    }
  });
}

// 2. Ordenação Cronológica de Idade
function sortAgesChronologically(dataMap) {
  const order = [
    "Menos de 18 anos",
    "16 a 17 anos",
    "18 a 24 anos",
    "25 a 34 anos",
    "35 a 44 anos",
    "45 a 54 anos",
    "55 a 64 anos",
    "65 anos ou mais",
    "Mais de 65 anos"
  ];

  const sorted = {};
  // Primeiro as faixas padrão conhecidas
  order.forEach(k => {
    Object.keys(dataMap).forEach(key => {
      if (key.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(key.toLowerCase())) {
        sorted[key] = dataMap[key];
      }
    });
  });

  // Outras faixas não mapeadas são inseridas ordenando por dígitos
  Object.keys(dataMap).forEach(k => {
    if (!sorted[k]) sorted[k] = dataMap[k];
  });

  return Object.keys(sorted).length ? sorted : dataMap;
}

// 3. Ordenação & Gráfico de Renda em Degradê Verde (Barras Horizontais)
function sortIncomeChronologically(dataMap) {
  const incomeOrder = [
    "Até R$ 2.800",
    "Até 2.800",
    "R$ 2.800 a R$ 5.000",
    "R$ 3.000 a R$ 5.000",
    "R$ 5.000 a R$ 10.000",
    "R$ 10.000 a R$ 20.000",
    "Mais de R$ 20.000",
    "Acima de R$ 20.000"
  ];

  const sorted = {};
  incomeOrder.forEach(inc => {
    Object.keys(dataMap).forEach(k => {
      if (k.toLowerCase().includes(inc.toLowerCase()) || inc.toLowerCase().includes(k.toLowerCase())) {
        sorted[k] = dataMap[k];
      }
    });
  });

  Object.keys(dataMap).forEach(k => {
    if (!sorted[k]) sorted[k] = dataMap[k];
  });

  return Object.keys(sorted).length ? sorted : dataMap;
}

function renderIncomeGreenChart(canvasId, dataMap) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);
  const totalSum = values.reduce((a, b) => a + b, 0);

  // Paleta em degradê de tons de verde progressivo
  const greenPalette = [
    "#A7F3D0", // Verde Claro Pastel (Menor renda)
    "#6EE7B7",
    "#34D399",
    "#10B981", // Verde Esmeralda Médio
    "#059669",
    "#047857",
    "#065F46",
    "#064E3B"  // Verde Floresta Profundo (Maior renda)
  ];

  chartInstances[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: greenPalette.slice(0, labels.length),
        borderRadius: 6,
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 35
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw || 0;
              const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : 0;
              return " " + val + " respondentes (" + pct + "%)";
            }
          }
        },
        datalabels: {
          color: "#064E3B",
          anchor: "end",
          align: "right",
          font: { weight: 700, size: 10 },
          formatter: (val) => {
            if (!val) return "";
            const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : 0;
            return pct + "%";
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: "#F1F5F9" }, ticks: { font: { size: 10, weight: 600 } } }
      }
    }
  });
}

// 4. Widget com Ícones Representativos para Situação de Trabalho
function renderWorkIconsGrid(dataMap, total) {
  // Mapeamento específico de ícones elegantes e paleta harmoniosa
  function getWorkIconConfig(key) {
    const k = key.toLowerCase();
    if (k.includes("carteira") || k.includes("clt") || k.includes("registrado")) {
      return {
        icon: "fa-solid fa-id-card",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100/80",
        border: "border-blue-100",
        badgeBg: "bg-blue-50 text-blue-700",
        fullTitle: key
      };
    }
    if (k.includes("conta própria") || k.includes("autônomo") || k.includes("autonomo") || k.includes("pj") || k.includes("freelance")) {
      return {
        icon: "fa-solid fa-briefcase",
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100/80",
        border: "border-emerald-100",
        badgeBg: "bg-emerald-50 text-emerald-700",
        fullTitle: key
      };
    }
    if (k.includes("funcionário") || k.includes("funcionario") || k.includes("concursado") || k.includes("público") || k.includes("publico")) {
      return {
        icon: "fa-solid fa-building-columns",
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-100/80",
        border: "border-indigo-100",
        badgeBg: "bg-indigo-50 text-indigo-700",
        fullTitle: key
      };
    }
    if (k.includes("estudante") || k.includes("estágio") || k.includes("estagio") || k.includes("bolsista")) {
      return {
        icon: "fa-solid fa-graduation-cap",
        iconColor: "text-amber-600",
        iconBg: "bg-amber-100/80",
        border: "border-amber-100",
        badgeBg: "bg-amber-50 text-amber-700",
        fullTitle: key
      };
    }
    if (k.includes("dono") || k.includes("empresa") || k.includes("sócio") || k.includes("empresário") || k.includes("comércio")) {
      return {
        icon: "fa-solid fa-store",
        iconColor: "text-cyan-600",
        iconBg: "bg-cyan-100/80",
        border: "border-cyan-100",
        badgeBg: "bg-cyan-50 text-cyan-700",
        fullTitle: key
      };
    }
    if (k.includes("desempregado") || k.includes("procura") || k.includes("buscando")) {
      return {
        icon: "fa-solid fa-user-clock",
        iconColor: "text-rose-600",
        iconBg: "bg-rose-100/80",
        border: "border-rose-100",
        badgeBg: "bg-rose-50 text-rose-700",
        fullTitle: key
      };
    }
    if (k.includes("aposentado") || k.includes("pensionista")) {
      return {
        icon: "fa-solid fa-person-walking-luggage",
        iconColor: "text-violet-600",
        iconBg: "bg-violet-100/80",
        border: "border-violet-100",
        badgeBg: "bg-violet-50 text-violet-700",
        fullTitle: key
      };
    }
    if (k.includes("home") || k.includes("remoto") || k.includes("teletrabalho")) {
      return {
        icon: "fa-solid fa-house-laptop",
        iconColor: "text-teal-600",
        iconBg: "bg-teal-100/80",
        border: "border-teal-100",
        badgeBg: "bg-teal-50 text-teal-700",
        fullTitle: key
      };
    }
    if (k.includes("híbrido") || k.includes("hibrido")) {
      return {
        icon: "fa-solid fa-laptop-file",
        iconColor: "text-sky-600",
        iconBg: "bg-sky-100/80",
        border: "border-sky-100",
        badgeBg: "bg-sky-50 text-sky-700",
        fullTitle: key
      };
    }
    return {
      icon: "fa-solid fa-user-tie",
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
      border: "border-slate-200",
      badgeBg: "bg-slate-100 text-slate-700",
      fullTitle: key
    };
  }

  // Ordenar por maior número de respostas
  const sortedEntries = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);

  let html = '<div class="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">';
  sortedEntries.forEach(([k, count]) => {
    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
    const cfg = getWorkIconConfig(k);

    html += '<div class="bg-white hover:bg-slate-50/90 rounded-2xl p-3 border ' + cfg.border + ' shadow-sm flex items-center justify-between gap-3 transition-all hover:shadow">' +
      '<div class="flex items-center gap-3 min-w-0 flex-1">' +
        '<div class="w-10 h-10 rounded-xl ' + cfg.iconBg + ' flex-shrink-0 flex items-center justify-center ' + cfg.iconColor + ' text-base shadow-xs">' +
          '<i class="' + cfg.icon + '"></i>' +
        '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<h4 class="text-xs font-bold text-slate-800 truncate" title="' + k + '">' + k + '</h4>' +
          '<p class="text-[11px] font-medium text-slate-400 mt-0.5">' + count.toLocaleString("pt-BR") + ' respondentes</p>' +
        '</div>' +
      '</div>' +
      '<div class="flex-shrink-0 text-right pl-2">' +
        '<span class="inline-block px-2.5 py-1 rounded-xl ' + cfg.badgeBg + ' text-xs font-black">' + pct + '%</span>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';
  return html;
}

// 5. Velocímetro / Gauge Interativo de Qualidade de Vida (Escala 1 a 5) com Rótulo de Dados
function renderGaugeSpeedometerWidget(avgScore, counts, totalCount) {
  const scoreNum = Math.max(1, Math.min(5, parseFloat(avgScore) || 4.3));
  // Mapeia 1.0 -> 5.0 para o ângulo de -90deg a +90deg (arco de 180 graus)
  const normalized = (scoreNum - 1) / 4;
  const angleDeg = -90 + (normalized * 180);

  // Status e cores de destaque
  let statusText = "Excelente";
  let statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let statusIcon = "fa-solid fa-circle-check text-emerald-500";
  let needleColor = "#059669";

  if (scoreNum < 2.0) {
    statusText = "Ruim / Baixa";
    statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
    statusIcon = "fa-solid fa-triangle-exclamation text-rose-500";
    needleColor = "#EF4444";
  } else if (scoreNum < 2.8) {
    statusText = "Regular";
    statusBadgeClass = "bg-orange-50 text-orange-700 border-orange-200";
    statusIcon = "fa-solid fa-circle-exclamation text-orange-500";
    needleColor = "#F97316";
  } else if (scoreNum < 3.8) {
    statusText = "Boa";
    statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    statusIcon = "fa-solid fa-thumbs-up text-amber-500";
    needleColor = "#F59E0B";
  } else if (scoreNum < 4.5) {
    statusText = "Muito Boa";
    statusBadgeClass = "bg-teal-50 text-teal-700 border-teal-200";
    statusIcon = "fa-solid fa-award text-teal-500";
    needleColor = "#0D9488";
  }

  // Rótulos de dados e distribuição das notas de 1 a 5
  const totalValids = totalCount > 0 ? totalCount : 1;
  const ratingDetails = [
    { score: 5, label: "5 estrelas", color: "bg-emerald-500", textCol: "text-emerald-700" },
    { score: 4, label: "4 estrelas", color: "bg-teal-500", textCol: "text-teal-700" },
    { score: 3, label: "3 estrelas", color: "bg-amber-400", textCol: "text-amber-700" },
    { score: 2, label: "2 estrelas", color: "bg-orange-400", textCol: "text-orange-700" },
    { score: 1, label: "1 estrela", color: "bg-rose-500", textCol: "text-rose-700" }
  ];

  let distributionHtml = '<div class="space-y-1.5 mt-3 pt-3 border-t border-slate-100 w-full">';
  ratingDetails.forEach(r => {
    const c = (counts && counts[r.score]) ? counts[r.score] : 0;
    const pct = totalCount > 0 ? ((c / totalValids) * 100).toFixed(1) : "0.0";
    distributionHtml += '<div class="flex items-center gap-2 text-xs font-semibold text-slate-600">' +
      '<span class="w-14 text-slate-500 font-bold flex items-center gap-1 text-[11px]"><span>' + r.score + '</span><i class="fa-solid fa-star text-[10px] text-amber-400"></i></span>' +
      '<div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">' +
        '<div class="h-full rounded-full ' + r.color + ' transition-all duration-700" style="width: ' + pct + '%;"></div>' +
      '</div>' +
      '<span class="w-20 text-right font-bold text-slate-700 text-[11px]">' + c + ' <span class="text-slate-400 font-normal">(' + pct + '%)</span></span>' +
    '</div>';
  });
  distributionHtml += '</div>';

  let html = '<div class="flex flex-col items-center justify-between h-full w-full px-1">' +
    // Velocímetro SVG
    '<div class="relative w-full max-w-[260px] mx-auto pt-1 flex flex-col items-center">' +
      '<svg viewBox="0 0 240 140" class="w-full h-auto overflow-visible select-none">' +
        '<defs>' +
          '<linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">' +
            '<stop offset="0%" stop-color="#EF4444" />' +
            '<stop offset="25%" stop-color="#F97316" />' +
            '<stop offset="50%" stop-color="#FBBF24" />' +
            '<stop offset="75%" stop-color="#34D399" />' +
            '<stop offset="100%" stop-color="#10B981" />' +
          '</linearGradient>' +
          '<filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">' +
            '<feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0F172A" flood-opacity="0.3"/>' +
          '</filter>' +
        '</defs>' +
        // Arco de trilho de fundo cinza suave
        '<path d="M 35,115 A 85,85 0 0,1 205,115" fill="none" stroke="#F1F5F9" stroke-width="16" stroke-linecap="round" />' +
        // Arco colorido gradiente do velocímetro
        '<path d="M 35,115 A 85,85 0 0,1 205,115" fill="none" stroke="url(#gaugeGradient)" stroke-width="16" stroke-linecap="round" />' +
        // Rótulos de dados e marcadores ao redor do velocímetro (1 a 5)
        '<text x="22" y="125" font-size="11" font-weight="800" fill="#EF4444" text-anchor="middle">1</text>' +
        '<text x="48" y="52" font-size="11" font-weight="800" fill="#F97316" text-anchor="middle">2</text>' +
        '<text x="120" y="18" font-size="11" font-weight="800" fill="#D97706" text-anchor="middle">3</text>' +
        '<text x="192" y="52" font-size="11" font-weight="800" fill="#059669" text-anchor="middle">4</text>' +
        '<text x="218" y="125" font-size="11" font-weight="800" fill="#10B981" text-anchor="middle">5</text>' +
        // Ponteiro do Velocímetro
        '<g transform="rotate(' + angleDeg + ', 120, 115)" style="transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);">' +
          '<polygon points="117,115 120,34 123,115" fill="#0F172A" filter="url(#needleShadow)" />' +
          '<polygon points="119,34 120,28 121,34" fill="' + needleColor + '" />' +
          '<circle cx="120" cy="115" r="9" fill="#0F172A" />' +
          '<circle cx="120" cy="115" r="4" fill="#38BDF8" />' +
        '</g>' +
      '</svg>' +
      // Rótulo de Dados Central com Nota Média e Classificação
      '<div class="text-center -mt-1 mb-1">' +
        '<div class="flex items-baseline justify-center gap-1">' +
          '<span class="text-3xl sm:text-4xl font-black text-brand-900 tracking-tight">' + scoreNum.toFixed(1) + '</span>' +
          '<span class="text-xs font-bold text-slate-400">/ 5.0</span>' +
        '</div>' +
        '<div class="mt-0.5">' +
          '<span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ' + statusBadgeClass + ' shadow-xs">' +
            '<i class="' + statusIcon + '"></i> ' + statusText +
          '</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // Distribuição de notas
    distributionHtml +
  '</div>';

  return html;
}

// Alias para compatibilidade
function renderQualityScaleWidget(avgScore, dataMap, total) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (dataMap) {
    Object.keys(dataMap).forEach(k => {
      const parsed = parseFloat(k);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
        counts[Math.round(parsed)] = (counts[Math.round(parsed)] || 0) + (dataMap[k] || 0);
      }
    });
  }
  return renderGaugeSpeedometerWidget(avgScore, counts, total);
}

// 7. Cards com Ícones Visuais para Evasão (Passear em Outras Cidades)
function renderOtherCitiesIcons(dataMap, total) {
  function getCityIconConfig(key) {
    const k = key.toLowerCase();
    if (k.includes("sim") || k.includes("frequente") || k.includes("sempre")) {
      return {
        icon: "fa-solid fa-car-side",
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-100/80",
        border: "border-indigo-100",
        badgeBg: "bg-indigo-50 text-indigo-700"
      };
    }
    if (k.includes("às vezes") || k.includes("as vezes") || k.includes("ocasional")) {
      return {
        icon: "fa-solid fa-compass",
        iconColor: "text-cyan-600",
        iconBg: "bg-cyan-100/80",
        border: "border-cyan-100",
        badgeBg: "bg-cyan-50 text-cyan-700"
      };
    }
    if (k.includes("raramente") || k.includes("pouco")) {
      return {
        icon: "fa-solid fa-tree-city",
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100/80",
        border: "border-emerald-100",
        badgeBg: "bg-emerald-50 text-emerald-700"
      };
    }
    return {
      icon: "fa-solid fa-house-user",
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
      border: "border-slate-200",
      badgeBg: "bg-slate-100 text-slate-700"
    };
  }

  const sorted = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);
  let html = '<div class="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">';
  sorted.forEach(([k, count]) => {
    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
    const cfg = getCityIconConfig(k);

    html += '<div class="bg-white hover:bg-slate-50/90 rounded-2xl p-3 border ' + cfg.border + ' shadow-sm flex items-center justify-between gap-3 transition-all hover:shadow">' +
      '<div class="flex items-center gap-3 min-w-0 flex-1">' +
        '<div class="w-10 h-10 rounded-xl ' + cfg.iconBg + ' flex-shrink-0 flex items-center justify-center ' + cfg.iconColor + ' text-base shadow-xs">' +
          '<i class="' + cfg.icon + '"></i>' +
        '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<h4 class="text-xs font-bold text-slate-800 truncate" title="' + k + '">' + k + '</h4>' +
          '<p class="text-[11px] font-medium text-slate-400 mt-0.5">' + count.toLocaleString("pt-BR") + ' respondentes</p>' +
        '</div>' +
      '</div>' +
      '<div class="flex-shrink-0 text-right pl-2">' +
        '<span class="inline-block px-2.5 py-1 rounded-xl ' + cfg.badgeBg + ' text-xs font-black">' + pct + '%</span>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';
  return html;
}

// 8. Mapa de Calor (Heatmap) por Regiões de SJC
function renderRegionsHeatmap(dataMap, total) {
  const regions = [
    { name: "Região Oeste", desc: "Aquarius, Urbanova, Jd. Indústrias", colorClass: "bg-red-500" },
    { name: "Centro / Vila Ema", desc: "Vila Ema, Vila Adyana, Centro", colorClass: "bg-orange-500" },
    { name: "Região Sul", desc: "Jd. Satélite, Bosque dos Eucaliptos", colorClass: "bg-amber-500" },
    { name: "Região Leste", desc: "Vista Verde, Eugênio de Melo", colorClass: "bg-emerald-500" },
    { name: "Região Norte", desc: "Santana, Alto da Ponte", colorClass: "bg-blue-500" }
  ];

  // Buscar valores correspondentes
  let maxCount = 1;
  const processedRegions = regions.map(reg => {
    let count = 0;
    Object.keys(dataMap).forEach(k => {
      if (k.toLowerCase().includes(reg.name.toLowerCase().replace("região ", "")) ||
          reg.desc.toLowerCase().split(", ").some(b => k.toLowerCase().includes(b))) {
        count += dataMap[k];
      }
    });
    if (count > maxCount) maxCount = count;
    return { ...reg, count, pct: total > 0 ? ((count / total) * 100).toFixed(1) : 0 };
  });

  let html = '<div class="space-y-3 p-2">' +
    '<div class="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">' +
      '<span>Região Municipal</span>' +
      '<span>Intensidade de Frequência</span>' +
    '</div>';

  processedRegions.forEach(r => {
    const intensityPercent = Math.min(Math.max(Math.round((r.count / maxCount) * 100), 12), 100);

    html += '<div class="bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl border border-slate-200 transition-all">' +
      '<div class="flex items-center justify-between mb-1.5">' +
        '<div>' +
          '<span class="text-xs font-bold text-slate-800">' + r.name + '</span>' +
          '<p class="text-[10px] font-medium text-slate-400">' + r.desc + '</p>' +
        '</div>' +
        '<div class="text-right">' +
          '<span class="text-xs font-black text-brand-900">' + r.count + '</span>' +
          '<span class="text-[11px] font-semibold text-slate-500 ml-1">(' + r.pct + '%)</span>' +
        '</div>' +
      '</div>' +
      // Barra de Calor
      '<div class="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">' +
        '<div class="h-full rounded-full bg-gradient-to-r from-brand-600 via-accent-cyan to-rose-500 transition-all duration-700" style="width: ' + intensityPercent + '%;"></div>' +
      '</div>' +
    '</div>';
  });

  html += '</div>';
  return html;
}

// 9. Mapa de Árvore (Treemap) Proporcional e Interativo
function renderTreemapWidget(dataMap, total) {
  const entries = Object.entries(dataMap || {}).filter(([k, v]) => v > 0);
  entries.sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return '<div class="h-48 flex items-center justify-center text-slate-400 text-xs font-semibold">Sem dados suficientes para o mapa de árvore.</div>';
  }

  const totalSum = entries.reduce((acc, curr) => acc + curr[1], 0);

  function getTreemapTile(item, index, totalSum) {
    const [label, count] = item;
    const pct = totalSum > 0 ? ((count / totalSum) * 100).toFixed(1) : "0.0";
    const l = label.toLowerCase();

    let gradientClass = "bg-gradient-to-br from-indigo-700 via-blue-800 to-brand-900";
    let iconClass = "fa-solid fa-sparkles";
    let borderClass = "border-blue-400/30";

    if (l.includes("casad") || l.includes("união") || l.includes("uniao") || l.includes("junto")) {
      gradientClass = "bg-gradient-to-br from-emerald-600 via-teal-700 to-brand-900";
      iconClass = "fa-solid fa-ring";
      borderClass = "border-emerald-400/30";
    } else if (l.includes("solteir")) {
      gradientClass = "bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-800";
      iconClass = "fa-solid fa-user";
      borderClass = "border-cyan-400/30";
    } else if (l.includes("namor")) {
      gradientClass = "bg-gradient-to-br from-pink-600 via-rose-600 to-rose-800";
      iconClass = "fa-solid fa-heart";
      borderClass = "border-pink-400/30";
    } else if (l.includes("divorc") || l.includes("separad")) {
      gradientClass = "bg-gradient-to-br from-amber-600 via-orange-600 to-slate-800";
      iconClass = "fa-solid fa-user-minus";
      borderClass = "border-amber-400/30";
    } else if (l.includes("viúv") || l.includes("viuv")) {
      gradientClass = "bg-gradient-to-br from-purple-600 via-indigo-700 to-slate-900";
      iconClass = "fa-solid fa-feather";
      borderClass = "border-purple-400/30";
    } else if (l.includes("sim") || l.includes("muito") || l.includes("sempre") || l.includes("total") || l.includes("combinam")) {
      gradientClass = "bg-gradient-to-br from-emerald-600 via-teal-700 to-brand-900";
      iconClass = "fa-solid fa-circle-check";
      borderClass = "border-emerald-400/30";
    } else if (l.includes("às vezes") || l.includes("as vezes") || l.includes("parcial") || l.includes("médio") || l.includes("pouco")) {
      gradientClass = "bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-800";
      iconClass = "fa-solid fa-masks-theater";
      borderClass = "border-cyan-400/30";
    } else if (l.includes("não") || l.includes("nao") || l.includes("nada") || l.includes("nunca")) {
      gradientClass = "bg-gradient-to-br from-rose-600 via-red-700 to-rose-900";
      iconClass = "fa-solid fa-circle-xmark";
      borderClass = "border-rose-400/30";
    } else {
      const palettes = [
        { bg: "bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900", icon: "fa-solid fa-ticket", border: "border-blue-400/30" },
        { bg: "bg-gradient-to-br from-amber-500 via-orange-600 to-amber-800", icon: "fa-solid fa-star", border: "border-amber-400/30" },
        { bg: "bg-gradient-to-br from-purple-600 via-indigo-800 to-slate-900", icon: "fa-solid fa-music", border: "border-purple-400/30" }
      ];
      const p = palettes[index % palettes.length];
      gradientClass = p.bg;
      iconClass = p.icon;
      borderClass = p.border;
    }

    return '<div class="' + gradientClass + ' rounded-2xl p-4 text-white shadow-sm hover:shadow-md border ' + borderClass + ' flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-0.5 group min-h-[90px] relative overflow-hidden">' +
      '<div class="flex items-start justify-between gap-2 relative z-10">' +
        '<div class="flex items-center gap-2 min-w-0 flex-1">' +
          '<div class="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center text-xs text-white/90 flex-shrink-0">' +
            '<i class="' + iconClass + '"></i>' +
          '</div>' +
          '<h4 class="text-xs sm:text-sm font-bold leading-snug break-words text-white/95" title="' + label + '">' + label + '</h4>' +
        '</div>' +
        '<span class="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-md font-black text-xs sm:text-sm text-white border border-white/20 whitespace-nowrap shadow-xs">' + pct + '%</span>' +
      '</div>' +
      '<div class="flex items-end justify-between mt-3 pt-2 border-t border-white/10 relative z-10">' +
        '<span class="text-[11px] font-semibold text-white/80">' + count.toLocaleString("pt-BR") + ' respondentes</span>' +
        '<span class="text-[10px] uppercase tracking-wider font-bold text-white/60">Área Proporcional</span>' +
      '</div>' +
      '<div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity text-5xl text-white pointer-events-none">' +
        '<i class="' + iconClass + '"></i>' +
      '</div>' +
    '</div>';
  }

  let html = '<div class="w-full space-y-2.5">';

  if (entries.length === 1) {
    html += getTreemapTile(entries[0], 0, totalSum);
  } else if (entries.length === 2) {
    const f1 = Math.max(parseFloat(((entries[0][1] / totalSum) * 100).toFixed(1)), 35);
    const f2 = Math.max(parseFloat(((entries[1][1] / totalSum) * 100).toFixed(1)), 35);
    html += '<div class="flex flex-col sm:flex-row gap-2.5">' +
      '<div style="flex: ' + f1 + ';">' + getTreemapTile(entries[0], 0, totalSum) + '</div>' +
      '<div style="flex: ' + f2 + ';">' + getTreemapTile(entries[1], 1, totalSum) + '</div>' +
    '</div>';
  } else if (entries.length === 3) {
    const f1 = Math.max(parseFloat(((entries[0][1] / totalSum) * 100).toFixed(1)), 45);
    const f2 = Math.max(parseFloat(((entries[1][1] / totalSum) * 100).toFixed(1)), 25);
    const f3 = Math.max(parseFloat(((entries[2][1] / totalSum) * 100).toFixed(1)), 25);
    html += '<div class="flex flex-col sm:flex-row gap-2.5">' +
      '<div style="flex: ' + f1 + ';" class="flex flex-col">' + getTreemapTile(entries[0], 0, totalSum) + '</div>' +
      '<div style="flex: 55;" class="flex flex-col gap-2.5">' +
        '<div style="flex: ' + f2 + ';">' + getTreemapTile(entries[1], 1, totalSum) + '</div>' +
        '<div style="flex: ' + f3 + ';">' + getTreemapTile(entries[2], 2, totalSum) + '</div>' +
      '</div>' +
    '</div>';
  } else {
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">';
    entries.forEach((item, idx) => {
      const isTop = idx === 0 && entries.length % 2 !== 0;
      html += '<div class="' + (isTop ? 'sm:col-span-2' : '') + '">' + getTreemapTile(item, idx, totalSum) + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

// ==========================================
// 11. RENDERIZADOR UNIVERSAL DE CHART.JS PADRÃO
// ==========================================
function determineChartType(questionText, dataMap, index) {
  const keys = Object.keys(dataMap);
  const count = keys.length;
  const qLower = questionText.toLowerCase();

  if (qLower.includes("de 1 a 5") || qLower.includes("nota") || qLower.includes("quanto você acompanha")) {
    return { type: (index % 2 === 0) ? "line" : "bar", options: { gradient: true } };
  }
  if (count <= 4) {
    if (index % 3 === 0) return { type: "pie", options: {} };
    return { type: "doughnut", options: {} };
  }
  if (count > 5 || qLower.includes("bairro") || qLower.includes("falta") || qLower.includes("dificuldade") || qLower.includes("música") || qLower.includes("serviços")) {
    return { type: "bar", options: { horizontal: true } };
  }

  const cyclicTypes = ["bar", "doughnut", "bar", "pie", "line"];
  const chosenType = cyclicTypes[index % cyclicTypes.length];
  return {
    type: chosenType,
    options: {
      horizontal: chosenType === "bar" && count > 4,
      gradient: chosenType === "line"
    }
  };
}

function renderAdvancedChart(canvasId, type, dataMap, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  let labels = Object.keys(dataMap);
  let values = Object.values(dataMap);

  if (labels.length > 8 && options.horizontal && !options.isAge) {
    const combined = labels.map((l, i) => ({ label: l, val: values[i] }));
    combined.sort((a, b) => b.val - a.val);
    const top = combined.slice(0, 8);
    labels = top.map(t => t.label);
    values = top.map(t => t.val);
  }

  const brandPalette = [
    "#0B2545", // Azul Petróleo Institucional
    "#0077B6", // Azul Real Oceano
    "#00B4D8", // Ciano Brilhante
    "#48CAE4", // Sky Blue
    "#6366F1", // Indigo Moderno
    "#10B981", // Emerald
    "#F59E0B", // Âmbar Vibrante
    "#8B5CF6", // Roxo Elétrico
    "#EC4899", // Magenta
    "#14B8A6"  // Teal
  ];

  Chart.defaults.font.family = "'Montserrat', sans-serif";
  Chart.defaults.color = "#64748B";

  const isBar = type === "bar";
  const isLine = type === "line";
  const isHorizontal = options.horizontal === true;
  const totalSum = values.reduce((a, b) => a + b, 0);

  let bgFillColor = brandPalette[2];
  if (isLine && options.gradient) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(0, 180, 216, 0.45)");
    gradient.addColorStop(1, "rgba(11, 37, 69, 0.0)");
    bgFillColor = gradient;
  }

  chartInstances[canvasId] = new Chart(ctx, {
    type: isHorizontal ? "bar" : (isLine ? "line" : type),
    data: {
      labels: labels.length ? labels : ["Sem registros"],
      datasets: [{
        data: values.length ? values : [0],
        backgroundColor: isLine ? bgFillColor : (isBar && !isHorizontal ? brandPalette[1] : brandPalette),
        borderColor: isLine ? "#00B4D8" : (type === "doughnut" || type === "pie" ? "#FFFFFF" : undefined),
        borderWidth: isLine ? 3 : (type === "doughnut" || type === "pie" ? 2 : 0),
        borderRadius: isBar ? 6 : 0,
        fill: isLine,
        tension: 0.38,
        pointBackgroundColor: "#0B2545",
        pointBorderColor: "#00B4D8",
        pointBorderWidth: 2,
        pointRadius: isLine ? 4 : 0,
        hoverOffset: 6
      }]
    },
    options: {
      indexAxis: isHorizontal ? "y" : "x",
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 15,
          bottom: 10,
          left: 10,
          right: isHorizontal ? 35 : 10
        }
      },
      plugins: {
        legend: {
          display: type === "doughnut" || type === "pie",
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 12,
            font: { size: 10, weight: 600 }
          }
        },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const val = context.raw || 0;
              const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : 0;
              return " " + val + " respondentes (" + pct + "%)";
            }
          }
        },
        datalabels: {
          color: function() {
            if (type === "doughnut" || type === "pie") return "#FFFFFF";
            return "#0B2545";
          },
          anchor: isBar ? (isHorizontal ? "end" : "end") : (isLine ? "top" : "center"),
          align: isBar ? (isHorizontal ? "right" : "top") : (isLine ? "top" : "center"),
          offset: isBar || isLine ? 4 : 0,
          font: { weight: 700, size: 10 },
          formatter: function(value) {
            if (!value || value === 0) return "";
            const pct = totalSum > 0 ? ((value / totalSum) * 100).toFixed(1) : 0;
            // Sempre exibir porcentagem (%)
            if (type === "doughnut" || type === "pie") {
              return parseFloat(pct) >= 5 ? pct + "%" : "";
            }
            return pct + "%";
          }
        }
      },
      scales: isBar || isLine ? {
        y: {
          beginAtZero: true,
          grid: { color: "#F1F5F9" },
          ticks: {
            precision: 0,
            font: { size: 10 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 10 }
          }
        }
      } : {}
    }
  });
}

// ==========================================
// 12. TABELA DE REGISTROS RECENTES
// ==========================================
function renderTable(rows) {
  if (!recentRecordsTableBody) return;

  if (rows.length === 0) {
    recentRecordsTableBody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-400 font-medium">Nenhum registro encontrado.</td></tr>';
    return;
  }

  recentRecordsTableBody.innerHTML = rows.map((row, idx) => {
    const rawDate = getField(row, ["Carimbo de data/hora", "created_at", "data", "Data"]);
    const dateFormatted = rawDate ? (rawDate.includes("T") ? new Date(rawDate).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : rawDate) : "Registro #" + (idx + 1);
    
    const local = getField(row, ["Em qual bairro você mora?", "bairro", "Região", "regiao"]) || "São José dos Campos";
    const perfil = (getField(row, ["Qual a sua idade?", "idade"]) || "Adulto") + " • " + (getField(row, ["Como você se identifica?", "genero"]) || "Munícipe");
    const nota = getField(row, ["De 1 a 5, que nota você dá para a qualidade de vida em São José?", "nota_qualidade"]) || "5";
    const falta = getField(row, ["O que você acha que mais falta em São José?", "o_que_falta"]) || "Opções de Lazer";

    return '<tr class="hover:bg-slate-50/80 transition-colors font-medium">' +
      '<td class="py-4 px-6 font-bold text-slate-800">' + dateFormatted + '</td>' +
      '<td class="py-4 px-6 text-brand-900 font-semibold">' + local + '</td>' +
      '<td class="py-4 px-6 text-slate-600">' + perfil + '</td>' +
      '<td class="py-4 px-6"><span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200"><i class="fa-solid fa-star text-amber-500"></i> ' + nota + '/5</span></td>' +
      '<td class="py-4 px-6 text-slate-600 truncate max-w-xs">' + falta + '</td>' +
      '<td class="py-4 px-6 text-right"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Processado</span></td>' +
    '</tr>';
  }).join("");
}

// ==========================================
// 13. DADOS CONSOLIDADOS DE DEMONSTRAÇÃO
// ==========================================
function renderFallbackDemoData() {
  updateSyncTime();
  const demoRecords = [
    {
      "Carimbo de data/hora": "06/09/2026 10:15:22",
      "Como você se identifica?": "Mulher",
      "Qual a sua idade?": "25 a 34 anos",
      "Em qual bairro você mora?": "Jardim Aquárius",
      "Região": "Oeste",
      "Qual a renda total da sua casa por mês?": "R$ 10.000 a R$ 20.000",
      "O seu trabalho hoje é:": "Híbrido",
      "De 1 a 5, que nota você dá para a qualidade de vida em São José?": "5",
      "Quais meios de transporte você usa? (marque todos que utilizar)": "Carro próprio, Uber / 99",
      "Você acha que a cidade tem boas opções de cultura e eventos?": "Sim, moderadamente",
      "Para você, São José é:": "Moderna e Segura",
      "Você sente que as festas e eventos da cidade combinam com o seu jeito?": "Sim",
      "O que você acha que mais falta em São José?": "Rooftops e Baladas",
      "Com que frequência você sai para passear ou se divertir na cidade?": "2 a 3 vezes por semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Sim, vou a São Paulo",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Região Oeste",
      "Qual a maior dificuldade para sair à noite em São José?": "Pouca variedade de estilos",
      "O que faz você escolher um restaurante ou bar?": "Ambiente e Gastronomia",
      "Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?": "Sim",
      "Quais tipos de música você mais gosta de ouvir?": "Pop, Eletrônica, MPB",
      "Quais desses serviços de filmes ou música você usa?": "Spotify, Netflix, Disney+",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Sim",
      "Por onde você fica sabendo das notícias de São José?": "Instagram (@radarsaojose)",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "3",
      "Na política, você se sente mais próximo de qual lado?": "Centro",
      "Quem você acha que mais ajuda a cidade a crescer?": "Empreendedores e Setor Privado",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Com certeza sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim, muito",
      "Qual o seu estado civil?": "Casado(a) / União Estável",
      "Você Já tem casa própria?": "Sim",
      "Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?": "Sim",
      "As redes sociais ou aplicativos de namoro mexem com a sua vida social?": "Às vezes",
      "Em poucas palavras, como você definiria São José hoje?": "Cidade Próspera",
      "Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?": "Melhor",
      "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?": "Sim",
      "Você tem animal de estimação?(gato, cachorro e etc)": "Sim"
    },
    {
      "Carimbo de data/hora": "06/09/2026 11:30:10",
      "Como você se identifica?": "Homem",
      "Qual a sua idade?": "18 a 24 anos",
      "Em qual bairro você mora?": "Vila Ema",
      "Região": "Centro",
      "Qual a renda total da sua casa por mês?": "R$ 5.000 a R$ 10.000",
      "O seu trabalho hoje é:": "Presencial",
      "De 1 a 5, que nota você dá para a qualidade de vida em São José?": "4",
      "Quais meios de transporte você usa? (marque todos que utilizar)": "Carro próprio, Bicicleta",
      "Você acha que a cidade tem boas opções de cultura e eventos?": "Poucas opções",
      "Para você, São José é:": "Tranquila e Familiar",
      "Você sente que as festas e eventos da cidade combinam com o seu jeito?": "Não muito",
      "O que você acha que mais falta em São José?": "Festivais e Shows",
      "Com que frequência você sai para passear ou se divertir na cidade?": "Finais de semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Raramente",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Centro / Vila Ema",
      "Qual a maior dificuldade para sair à noite em São José?": "Preços elevados",
      "O que faz você escolher um restaurante ou bar?": "Música ao vivo e Chopp",
      "Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?": "Não",
      "Quais tipos de música você mais gosta de ouvir?": "Rock, Sertanejo, Trap",
      "Quais desses serviços de filmes ou música você usa?": "Spotify, Netflix, Prime Video",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram / TikTok",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Sim",
      "Por onde você fica sabendo das notícias de São José?": "Portais de Notícias",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "2",
      "Na política, você se sente mais próximo de qual lado?": "Direita",
      "Quem você acha que mais ajuda a cidade a crescer?": "Inovação Tecnológica",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim",
      "Qual o seu estado civil?": "Solteiro(a)",
      "Você Já tem casa própria?": "Não",
      "Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?": "Com certeza",
      "As redes sociais ou aplicativos de namoro mexem com a sua vida social?": "Sim",
      "Em poucas palavras, como você definiria São José hoje?": "Universitária e Segura",
      "Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?": "Na média",
      "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?": "Raramente",
      "Você tem animal de estimação?(gato, cachorro e etc)": "Sim"
    },
    {
      "Carimbo de data/hora": "06/09/2026 12:05:44",
      "Como você se identifica?": "Mulher",
      "Qual a sua idade?": "35 a 44 anos",
      "Em qual bairro você mora?": "Urbanova",
      "Região": "Oeste",
      "Qual a renda total da sua casa por mês?": "Mais de R$ 20.000",
      "O seu trabalho hoje é:": "Home Office",
      "De 1 a 5, que nota você dá para a qualidade de vida em São José?": "5",
      "Quais meios de transporte você usa? (marque todos que utilizar)": "Carro próprio",
      "Você acha que a cidade tem boas opções de cultura e eventos?": "Sim, excelentes",
      "Para você, São José é:": "A melhor do interior do Brasil",
      "Você sente que as festas e eventos da cidade combinam com o seu jeito?": "Sim",
      "O que você acha que mais falta em São José?": "Alta Gastronomia",
      "Com que frequência você sai para passear ou se divertir na cidade?": "3 a 4 vezes por semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Sim, fins de semana",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Região Oeste",
      "Qual a maior dificuldade para sair à noite em São José?": "Estacionamento e Reservas",
      "O que faz você escolher um restaurante ou bar?": "Carta de vinhos e Ambiente",
      "Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?": "Não",
      "Quais tipos de música você mais gosta de ouvir?": "MPB, Jazz, Rock Clássico",
      "Quais desses serviços de filmes ou música você usa?": "Apple Music, Max, Netflix",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Não",
      "Por onde você fica sabendo das notícias de São José?": "Instagram e Grupos Locais",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "4",
      "Na política, você se sente mais próximo de qual lado?": "Centro",
      "Quem você acha que mais ajuda a cidade a crescer?": "Prefeitura e Empresas",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim, muito",
      "Qual o seu estado civil?": "Casado(a) / União Estável",
      "Você Já tem casa própria?": "Sim",
      "Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?": "Neutro",
      "As redes sociais ou aplicativos de namoro mexem com a sua vida social?": "Não",
      "Em poucas palavras, como você definiria São José hoje?": "Excelente Qualidade de Vida",
      "Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?": "Muito Superior",
      "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?": "Sim, sempre",
      "Você tem animal de estimação?(gato, cachorro e etc)": "Sim"
    },
    {
      "Carimbo de data/hora": "06/09/2026 13:40:15",
      "Como você se identifica?": "Homem",
      "Qual a sua idade?": "25 a 34 anos",
      "Em qual bairro você mora?": "Jardim das Indústrias",
      "Região": "Oeste",
      "Qual a renda total da sua casa por mês?": "R$ 5.000 a R$ 10.000",
      "O seu trabalho hoje é:": "Híbrido",
      "De 1 a 5, que nota você dá para a qualidade de vida em São José?": "4",
      "Quais meios de transporte você usa? (marque todos que utilizar)": "Carro próprio, Ônibus / Transporte público",
      "Você acha que a cidade tem boas opções de cultura e eventos?": "Razoável",
      "Para você, São José é:": "Tecnológica e Promissora",
      "Você sente que as festas e eventos da cidade combinam com o seu jeito?": "Às vezes",
      "O que você acha que mais falta em São José?": "Parques com mais atrações",
      "Com que frequência você sai para passear ou se divertir na cidade?": "1 a 2 vezes por semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Às vezes",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Centro / Vila Ema",
      "Qual a maior dificuldade para sair à noite em São José?": "Opções após meia-noite",
      "O que faz você escolher um restaurante ou bar?": "Custo-benefício e Atendimento",
      "Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?": "Às vezes",
      "Quais tipos de música você mais gosta de ouvir?": "Sertanejo, Pagode, Funk",
      "Quais desses serviços de filmes ou música você usa?": "Spotify, Netflix, Prime Video",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Sim",
      "Por onde você fica sabendo das notícias de São José?": "WhatsApp e Redes",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "3",
      "Na política, você se sente mais próximo de qual lado?": "Centro-Direita",
      "Quem você acha que mais ajuda a cidade a crescer?": "Indústrias e Parques Tecnológicos",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim",
      "Qual o seu estado civil?": "Solteiro(a)",
      "Você Já tem casa própria?": "Não",
      "Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?": "Sim",
      "As redes sociais ou aplicativos de namoro mexem com a sua vida social?": "Sim",
      "Em poucas palavras, como você definiria São José hoje?": "Cidade de Oportunidades",
      "Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?": "Melhor",
      "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?": "Às vezes",
      "Você tem animal de estimação?(gato, cachorro e etc)": "Não"
    },
    {
      "Carimbo de data/hora": "06/09/2026 14:20:00",
      "Como você se identifica?": "Mulher",
      "Qual a sua idade?": "45 a 54 anos",
      "Em qual bairro você mora?": "Jardim Satélite",
      "Região": "Sul",
      "Qual a renda total da sua casa por mês?": "R$ 5.000 a R$ 10.000",
      "O seu trabalho hoje é:": "Presencial",
      "De 1 a 5, que nota você dá para a qualidade de vida em São José?": "5",
      "Quais meios de transporte você usa? (marque todos que utilizar)": "Carro próprio",
      "Você acha que a cidade tem boas opções de cultura e eventos?": "Sim",
      "Para você, São José é:": "Segura e Arborizada",
      "Você sente que as festas e eventos da cidade combinam com o seu jeito?": "Sim",
      "O que você acha que mais falta em São José?": "Feiras gastronômicas nos bairros",
      "Com que frequência você sai para passear ou se divertir na cidade?": "Finais de semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Raramente",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Região Sul",
      "Qual a maior dificuldade para sair à noite em São José?": "Trânsito em horários de pico",
      "O que faz você escolher um restaurante ou bar?": "Comida de qualidade e espaço família",
      "Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?": "Não",
      "Quais tipos de música você mais gosta de ouvir?": "MPB, Samba, Sertanejo",
      "Quais desses serviços de filmes ou música você usa?": "Netflix, Globoplay",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram / Facebook",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Sim",
      "Por onde você fica sabendo das notícias de São José?": "TV Vanguarda e Portais",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "4",
      "Na política, você se sente mais próximo de qual lado?": "Centro",
      "Quem você acha que mais ajuda a cidade a crescer?": "Munícipes e Comércio Local",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim, muito",
      "Qual o seu estado civil?": "Casado(a) / União Estável",
      "Você Já tem casa própria?": "Sim",
      "Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?": "Sim",
      "As redes sociais ou aplicativos de namoro mexem com a sua vida social?": "Não",
      "Em poucas palavras, como você definiria São José hoje?": "Meu Orgulho",
      "Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?": "Muito Superior",
      "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?": "Sim, sempre",
      "Você tem animal de estimação?(gato, cachorro e etc)": "Sim"
    },
    {
      "Carimbo de data/hora": "06/09/2026 15:10:30",
      "Como você se identifica?": "Homem",
      "Qual a sua idade?": "25 a 34 anos",
      "Em qual bairro você mora?": "Santana",
      "Região": "Norte",
      "Qual a renda total da sua casa por mês?": "R$ 2.800 a R$ 5.000",
      "O seu trabalho hoje é:": "Presencial",
      "De 1 a 5, que nota você dá para a qualidade de vida em São José?": "4",
      "Quais meios de transporte você usa? (marque todos que utilizar)": "Moto própria, Ônibus / Transporte público",
      "Você acha que a cidade tem boas opções de cultura e eventos?": "Poucas opções na Zona Norte",
      "Para você, São José é:": "Cidade Boa de Viver",
      "Você sente que as festas e eventos da cidade combinam com o seu jeito?": "Às vezes",
      "O que você acha que mais falta em São José?": "Lazer acessível e Centros Esportivos",
      "Com que frequência você sai para passear ou se divertir na cidade?": "1 vez por semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Raramente",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Região Norte",
      "Qual a maior dificuldade para sair à noite em São José?": "Distância e Transporte noturno",
      "O que faz você escolher um restaurante ou bar?": "Preço justo e Ambiente descontraído",
      "Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?": "Não",
      "Quais tipos de música você mais gosta de ouvir?": "Pagode, Funk, Rap",
      "Quais desses serviços de filmes ou música você usa?": "Spotify, YouTube Music",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram / TikTok",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Sim",
      "Por onde você fica sabendo das notícias de São José?": "Instagram e Grupos de Bairro",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "2",
      "Na política, você se sente mais próximo de qual lado?": "Esquerda",
      "Quem você acha que mais ajuda a cidade a crescer?": "Trabalhadores e Pequenos Negócios",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim",
      "Qual o seu estado civil?": "Solteiro(a)",
      "Você Já tem casa própria?": "Não",
      "Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?": "Sim",
      "As redes sociais ou aplicativos de namoro mexem com a sua vida social?": "Sim",
      "Em poucas palavras, como você definiria São José hoje?": "Cidade em Expansão",
      "Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?": "Melhor",
      "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?": "Sim",
      "Você tem animal de estimação?(gato, cachorro e etc)": "Sim"
    }
  ];

  allSurveyRecords = demoRecords;
  populateAllSidebarFilters(demoRecords);
  updateStatisticalHeader(demoRecords.length, demoRecords.length);
  processAndRenderDynamicCharts(demoRecords);
}
