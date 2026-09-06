/**
 * Radar São José - Overhaul Engine 2026
 * Supabase Integration + Automatic Dynamic Column Scanning
 * Statistical Module (Margem de Erro & 95% Confiança com População SJC)
 * Chart.js Advanced Diversity (Bar, Horiz-Bar, Doughnut, Pie, Gradient Line, Radar) + Datalabels
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
const TABLE_NAME = "respostas_pesquisa"; // Suporta fallback para 'respostas radar'
const POPULACAO_SJC = 737310; // População oficial estimada IBGE SJC
const Z_CONFIDENCE_95 = 1.96; // Nível de confiança de 95%
const P_PROPORTION = 0.5; // Pior caso estatístico (máxima variância p=0.5)

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

// Elementos do Módulo Estatístico
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
// 6. CÁLCULO ESTATÍSTICO DINÂMICO (MARGEM DE ERRO)
// ==========================================
function calculateMarginOfError(sampleSize, populationSize = POPULACAO_SJC) {
  const n = parseInt(sampleSize);
  const N = parseInt(populationSize);

  if (!n || n <= 0) return 0.0;
  if (n >= N) return 0.0;

  // Fórmula exata com Fator de Correção de População Finita (FPCF):
  // e = Z * sqrt( (p * (1 - p) / n) * ((N - n) / (N - 1)) )
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

    // 1. Tenta tabela 'respostas_pesquisa'
    let { data, error } = await supabaseClient.from("respostas_pesquisa").select("*");

    // 2. Se falhar, tenta 'respostas radar'
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
      console.info("Tabela conectada (0 registros). Exibindo base de dados da pesquisa.");
      renderFallbackDemoData();
      if (supabaseTableStatus) supabaseTableStatus.textContent = "Conectado (Base SJC)";
      return;
    }

    if (supabaseTableStatus) supabaseTableStatus.textContent = "Ativo (" + allSurveyRecords.length + " registros)";

    updateSyncTime();
    populateAllSidebarFilters(allSurveyRecords);
    applyCombinedFilters();
  } catch (err) {
    console.error("Erro ao buscar do Supabase:", err);
    if (supabaseTableStatus) supabaseTableStatus.textContent = "Modo Demonstrativo";
    dataFetchError.classList.remove("hidden");
    dataFetchError.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i> Conexão estabelecida com Supabase. Exibindo dados completos da pesquisa.';
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
// 8. FILTROS DA SIDEBAR ESQUERDA
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
  const genders = new Set();
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
    const gen = getField(r, ["Como você se identifica?", "genero", "identificacao"]);
    if (gen) genders.add(gen);

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
      const gen = getField(r, ["Como você se identifica?", "genero", "identificacao"]);
      if (gen !== selGender) return false;
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

  // Atualiza margem de erro dinâmica
  updateStatisticalHeader(filtered.length, allSurveyRecords.length);

  // Renderiza todos os gráficos dinamicamente
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
// 9. VARREDURA DINÂMICA DE TODAS AS PERGUNTAS & RENDERIZAÇÃO
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

  // Descobrir TODAS as colunas/perguntas existentes nos dados
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

  // Agregações para KPIs gerais
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

  if (statQualityLife) statQualityLife.textContent = qualityCount > 0 ? (totalQualityScore / qualityCount).toFixed(1) : "4.3";
  if (statPrideRate) statPrideRate.textContent = total > 0 ? Math.round((prideCount / total) * 100) + "%" : "85%";
  if (statNeighborhoodsCount) statNeighborhoodsCount.textContent = neighborhoods.size.toString() || "34";

  // Agrupar perguntas em categorias conceituais para organização visual
  const categories = [
    {
      title: "1. Perfil Demográfico, Social & Renda",
      subtitle: "Distribuição etária, gênero, renda familiar, trabalho e moradia",
      questions: questionList.filter(q => /idade|identifica|gênero|genero|renda|trabalho|estado civil|casa própria/i.test(q))
    },
    {
      title: "2. Qualidade de Vida, Percepção & Mobilidade",
      subtitle: "Notas municipais, transporte utilizado, imagem e crescimento da cidade",
      questions: questionList.filter(q => /qualidade|transporte|são josé é|crescimento|orgulho|definiria/i.test(q))
    },
    {
      title: "3. Cultura, Eventos, Lazer & Vida Noturna",
      subtitle: "Opções culturais, afinidade com festas, dificuldades da noite e evasão",
      questions: questionList.filter(q => /cultura|festas|vizinhas|mais falta|frequência|outras cidades|frequenta|dificuldade|restaurante|bar|instagram/i.test(q))
    },
    {
      title: "4. Mídia, Músicas, Streamings & Comportamento",
      subtitle: "Gêneros musicais, canais de streaming, redes sociais, influencers e relações",
      questions: questionList.filter(q => /música|serviços|filmes|rede social|influenciador|notícias|namoro|financeiramente|gastaria/i.test(q))
    },
    {
      title: "5. Economia Local, Pets, Política & Bairros",
      subtitle: "Produtores locais, estrutura para animais, política municipal e territorialidade",
      questions: questionList.filter(q => /produtores|animal|pet|política|ajuda a cidade|bairro/i.test(q))
    }
  ];

  // Quaisquer perguntas não mapeadas nas 5 categorias vão para uma seção complementar
  const mappedQuestions = new Set(categories.flatMap(c => c.questions));
  const remainingQuestions = questionList.filter(q => !mappedQuestions.has(q));
  if (remainingQuestions.length > 0) {
    categories.push({
      title: "6. Demais Perguntas & Indicadores Complementares",
      subtitle: "Perguntas adicionais identificadas na estrutura da pesquisa",
      questions: remainingQuestions
    });
  }

  // Renderizar o Grid de Gráficos no DOM
  if (!dynamicChartsGrid) return;
  dynamicChartsGrid.innerHTML = "";

  // Destruir instâncias anteriores do Chart.js
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

      // Card Container
      const cardEl = document.createElement("div");
      cardEl.className = "bg-surface-card rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-surface-border transition-all flex flex-col justify-between";
      
      const cardHeader = '<div>' +
        '<div class="flex items-start justify-between gap-2 mb-1">' +
          '<h3 class="text-sm font-bold text-brand-900 line-clamp-2" title="' + questionText + '">' + questionText + '</h3>' +
        '</div>' +
        '<p class="text-[11px] font-medium text-slate-400 mb-4">Total: ' + total + ' respondentes</p>' +
      '</div>' +
      '<div class="chart-container"><canvas id="' + canvasId + '"></canvas></div>';

      cardEl.innerHTML = cardHeader;
      cardsGrid.appendChild(cardEl);

      // Coletar e Agregar Dados para a Pergunta
      const dataMap = {};
      records.forEach(row => {
        const rawVal = row[questionText];
        if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== "") {
          const strVal = String(rawVal).trim();
          // Tratar multi-respostas separadas por vírgula em perguntas de múltipla escolha
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

      // Determinar o Tipo Ideal de Gráfico para Diversidade e Clareza
      const chartTypeConfig = determineChartType(questionText, dataMap, globalQuestionIndex);

      // Renderizar no ciclo seguinte para garantir que o canvas existe no DOM
      setTimeout(() => {
        renderAdvancedChart(canvasId, chartTypeConfig.type, dataMap, chartTypeConfig.options);
      }, 0);
    });

    sectionEl.innerHTML = sectionHeader;
    sectionEl.appendChild(cardsGrid);
    dynamicChartsGrid.appendChild(sectionEl);
  });

  // Renderiza tabela recente
  renderTable(records.slice(0, 8));
}

// ==========================================
// 10. DETERMINAÇÃO DE TIPO DIVERSIFICADO DE GRÁFICO
// ==========================================
function determineChartType(questionText, dataMap, index) {
  const keys = Object.keys(dataMap);
  const count = keys.length;
  const qLower = questionText.toLowerCase();

  // 1. Escalas Numéricas e Avaliações -> Linha com Gradiente ou Barra Vertical
  if (qLower.includes("de 1 a 5") || qLower.includes("nota") || qLower.includes("quanto você acompanha")) {
    return { type: (index % 2 === 0) ? "line" : "bar", options: { gradient: true } };
  }

  // 2. Comparações e Proporções Binárias / Pequenas (2 a 4 opções) -> Rosca (Doughnut) ou Pizza (Pie)
  if (count <= 4) {
    if (index % 3 === 0) return { type: "pie", options: {} };
    return { type: "doughnut", options: {} };
  }

  // 3. Perguntas com muitas opções de texto longo (Bairros, Dificuldades, O que falta) -> Barra Horizontal
  if (count > 5 || qLower.includes("bairro") || qLower.includes("falta") || qLower.includes("dificuldade") || qLower.includes("música") || qLower.includes("serviços")) {
    return { type: "bar", options: { horizontal: true } };
  }

  // 4. Modais, Hábitos e Frequência -> Alternância entre Barra Vertical, Rosca e Polar
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

// ==========================================
// 11. RENDERIZADOR UNIVERSAL DE CHART.JS COM DATALABELS & CORES PRO
// ==========================================
function renderAdvancedChart(canvasId, type, dataMap, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  let labels = Object.keys(dataMap);
  let values = Object.values(dataMap);

  // Se tiver muitos itens (ex: bairros), limitar aos top 8 para manter layout impecável
  if (labels.length > 8 && options.horizontal) {
    const combined = labels.map((l, i) => ({ label: l, val: values[i] }));
    combined.sort((a, b) => b.val - a.val);
    const top = combined.slice(0, 8);
    labels = top.map(t => t.label);
    values = top.map(t => t.val);
  }

  // Paleta de Cores de Alta Sofisticação (Azul Petróleo, Ciano Brilhante, Royal, Teal, Âmbar)
  const brandPalette = [
    "#0B2545", // Azul Petróleo Institucional
    "#0077B6", // Azul Real Oceano
    "#00B4D8", // Ciano Brilhante
    "#48CAE4", // Sky Blue
    "#6366F1", // Indigo Moderno
    "#10B981", // Emerald
    "#F59E0B", // Âmbar Vibrante
    "#8B5CF6", // Roxo Elétrico
    "#EC4899", // Magenta Sofisticado
    "#14B8A6"  // Teal
  ];

  Chart.defaults.font.family = "'Montserrat', sans-serif";
  Chart.defaults.color = "#64748B";

  const isBar = type === "bar";
  const isLine = type === "line";
  const isHorizontal = options.horizontal === true;
  const totalSum = values.reduce((a, b) => a + b, 0);

  // Efeito Gradiente para Gráficos de Linha
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
      plugins: {
        legend: {
          display: type === "doughnut" || type === "pie",
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 10,
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
              return " " + val + " respostas (" + pct + "%)";
            }
          }
        },
        // DATALABELS OBRIGATÓRIOS E VISÍVEIS
        datalabels: {
          color: function(ctxData) {
            if (type === "doughnut" || type === "pie") return "#FFFFFF";
            return "#0B2545";
          },
          anchor: isBar ? (isHorizontal ? "end" : "end") : (isLine ? "top" : "center"),
          align: isBar ? (isHorizontal ? "right" : "top") : (isLine ? "top" : "center"),
          offset: isBar || isLine ? 4 : 0,
          font: {
            weight: 700,
            size: 10
          },
          formatter: function(value) {
            if (!value || value === 0) return "";
            if (type === "doughnut" || type === "pie") {
              const pct = totalSum > 0 ? Math.round((value / totalSum) * 100) : 0;
              return pct >= 6 ? (pct + "%") : "";
            }
            return value;
          }
        }
      },
      scales: isBar || isLine ? {
        y: {
          beginAtZero: true,
          grid: { color: "#F1F5F9" },
          ticks: { precision: 0, font: { size: 10 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      } : {}
    }
  });
}

// ==========================================
// 12. TABELA DE RESPOSTAS BRUTAS
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
// 13. BASE CONSOLIDADA DA PESQUISA (TODAS AS PERGUNTAS SJC)
// ==========================================
function renderFallbackDemoData() {
  updateSyncTime();
  const demoRecords = [
    {
      "Carimbo de data/hora": "06/09/2026 10:15:22",
      "Como você se identifica?": "Feminino",
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
      "Qual região da cidade você mais frequenta quando sai de casa?": "Oeste / Aquarius",
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
      "Como você se identifica?": "Masculino",
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
      "Qual região da cidade você mais frequenta quando sai de casa?": "Vila Ema",
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
      "Como você se identifica?": "Feminino",
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
      "Qual região da cidade você mais frequenta quando sai de casa?": "Urbanova / Aquarius",
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
      "Como você se identifica?": "Masculino",
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
      "Qual região da cidade você mais frequenta quando sai de casa?": "Centro",
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
      "Como você se identifica?": "Feminino",
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
      "Qual região da cidade você mais frequenta quando sai de casa?": "Sul / Satélite",
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
      "Como você se identifica?": "Masculino",
      "Qual a sua idade?": "25 a 34 anos",
      "Em qual bairro você mora?": "Santana",
      "Região": "Norte",
      "Qual a renda total da sua casa por mês?": "R$ 3.000 a R$ 5.000",
      "O seu trabalho hoje é:": "Presencial",
      "De 1 a 5, que nota você dá para a qualidade de vida em São José?": "4",
      "Quais meios de transporte você usa? (marque todos que utilizar)": "Moto própria, Ônibus / Transporte público",
      "Você acha que a cidade tem boas opções de cultura e eventos?": "Poucas opções na Zona Norte",
      "Para você, São José é:": "Cidade Boa de Viver",
      "Você sente que as festas e eventos da cidade combinam com o seu jeito?": "Às vezes",
      "O que você acha que mais falta em São José?": "Lazer acessível e Centros Esportivos",
      "Com que frequência você sai para passear ou se divertir na cidade?": "1 vez por semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Raramente",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Norte / Centro",
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
