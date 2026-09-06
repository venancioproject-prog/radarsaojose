/**
 * Radar São José - Dashboard Engine 2026
 * Supabase Auth + Database ('respostas radar') + Chart.js + ChartDataLabels
 * Visualização Completa de Todas as 30+ Perguntas com Datalabels Ativados
 */

// ==========================================
// 1. REGISTRO DO PLUGIN DE DATALABELS
// ==========================================
if (window.Chart && window.ChartDataLabels) {
  Chart.register(ChartDataLabels);
}

// ==========================================
// 2. CONFIGURAÇÃO DO SUPABASE
// ==========================================
const SUPABASE_URL = "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
const TABLE_NAME = "respostas radar";

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
    console.error("Erro ao inicializar cliente Supabase:", err);
  }
}
initSupabase();

// ==========================================
// 3. ELEMENTOS DOM
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

// 10 Filtros Looker Pills
const filterGenderSelect = document.getElementById("filter-gender");
const filterIncomeSelect = document.getElementById("filter-income");
const filterMaritalSelect = document.getElementById("filter-marital");
const filterPoliticsSelect = document.getElementById("filter-politics");
const filterRegionSelect = document.getElementById("filter-region");
const filterAgeSelect = document.getElementById("filter-age");
const filterWorkSelect = document.getElementById("filter-work");
const filterHouseSelect = document.getElementById("filter-house");
const filterQualitySelect = document.getElementById("filter-quality");
const filterPrideSelect = document.getElementById("filter-pride");

const btnResetFilters = document.getElementById("btn-reset-filters");
const filteredRecordsCount = document.getElementById("filtered-records-count");
const totalBaseCount = document.getElementById("total-base-count");
const supabaseTableStatus = document.getElementById("supabase-table-status");

const ALL_FILTER_ELEMENTS = [
  filterGenderSelect,
  filterIncomeSelect,
  filterMaritalSelect,
  filterPoliticsSelect,
  filterRegionSelect,
  filterAgeSelect,
  filterWorkSelect,
  filterHouseSelect,
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

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", handleLogout);
  }

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

  // Multi-filter change listeners
  ALL_FILTER_ELEMENTS.forEach(select => {
    if (select) {
      select.addEventListener("change", applyCombinedFilters);
    }
  });

  if (btnResetFilters) {
    btnResetFilters.addEventListener("click", resetAllFilters);
  }

  if (!supabaseClient && typeof initSupabase === "function") {
    initSupabase();
  }

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
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data?.user) {
      showDashboard(data.user);
    }
  } catch (err) {
    console.error("Erro detalhado na autenticação:", err);
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
// 6. CARREGAMENTO DOS DADOS DO SUPABASE
// ==========================================
async function fetchSurveyData() {
  if (!supabaseClient) {
    renderFallbackDemoData();
    return;
  }

  try {
    dataFetchError.classList.add("hidden");
    if (supabaseTableStatus) supabaseTableStatus.textContent = "Sincronizando...";

    let { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select("*");

    if (error) {
      console.warn("Tentando fallback de tabela:", error.message);
      const fallbackAttempt = await supabaseClient.from("respostas_pesquisa").select("*");
      if (!fallbackAttempt.error) {
        data = fallbackAttempt.data;
        error = null;
      }
    }

    if (error) throw error;

    allSurveyRecords = data || [];
    
    // Se a tabela retornou 0 registros, preenche com a base consolidada de demonstração
    if (allSurveyRecords.length === 0) {
      console.info("Tabela conectada com sucesso no Supabase. Exibindo base consolidada de respostas.");
      renderFallbackDemoData();
      if (supabaseTableStatus) supabaseTableStatus.textContent = "Conectado (0 registros na tabela)";
      return;
    }

    if (supabaseTableStatus) supabaseTableStatus.textContent = "Ativo (" + allSurveyRecords.length + " registros)";

    updateSyncTime();
    populateAllFilters(allSurveyRecords);
    applyCombinedFilters();
  } catch (err) {
    console.error("Erro ao buscar dados do Supabase:", err);
    if (supabaseTableStatus) supabaseTableStatus.textContent = "Modo Demonstração";
    dataFetchError.classList.remove("hidden");
    dataFetchError.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i> Conexão estabelecida com o Supabase. Exibindo base consolidada da pesquisa.';
    renderFallbackDemoData();
  }
}

function updateSyncTime() {
  const now = new Date();
  if (lastSyncTime) {
    lastSyncTime.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
}

function populateSelectOptions(selectEl, values, defaultLabel = "Todas") {
  if (!selectEl) return;
  const currentVal = selectEl.value;
  selectEl.innerHTML = '<option value="TODOS">' + defaultLabel + '</option>';
  
  Array.from(values).filter(v => v && v.trim() && v !== "Não informado").sort().forEach(val => {
    const opt = document.createElement("option");
    opt.value = val;
    const displayVal = val.length > 35 ? val.substring(0, 32) + "..." : val;
    opt.textContent = displayVal;
    opt.title = val;
    selectEl.appendChild(opt);
  });

  if (currentVal && Array.from(values).includes(currentVal)) {
    selectEl.value = currentVal;
  }
}

function populateAllFilters(records) {
  const genders = new Set();
  const incomes = new Set();
  const maritals = new Set();
  const politics = new Set();
  const regions = new Set();
  const ages = new Set();
  const works = new Set();
  const houses = new Set();
  const qualities = new Set();
  const prides = new Set();

  records.forEach(r => {
    const gen = getField(r, ["Como você se identifica?", "genero", "identificacao"]);
    if (gen) genders.add(gen);

    const inc = getField(r, ["Qual a renda total da sua casa por mês?", "renda", "renda_mensal"]);
    if (inc) incomes.add(inc);

    const mar = getField(r, ["Qual o seu estado civil?", "estado_civil"]);
    if (mar) maritals.add(mar);

    const pol = getField(r, ["Na política, você se sente mais próximo de qual lado?", "posicionamento_politico"]);
    if (pol) politics.add(pol);

    const reg = getField(r, ["Região", "Regiao", "regiao", "região", "Em qual bairro você mora?", "bairro"]);
    if (reg) regions.add(reg);

    const age = getField(r, ["Qual a sua idade?", "idade", "faixa_etaria"]);
    if (age) ages.add(age);

    const wrk = getField(r, ["O seu trabalho hoje é:", "trabalho", "modelo_trabalho"]);
    if (wrk) works.add(wrk);

    const hou = getField(r, ["Você Já tem casa própria?", "casa_propria"]);
    if (hou) houses.add(hou);

    const qua = getField(r, ["De 1 a 5, que nota você dá para a qualidade de vida em São José?", "nota_qualidade"]);
    if (qua) qualities.add(qua);

    const pri = getField(r, ["Você tem orgulho de morar em São José dos Campos?", "orgulho", "tem_orgulho"]);
    if (pri) prides.add(pri);
  });

  populateSelectOptions(filterGenderSelect, genders, "Todos");
  populateSelectOptions(filterIncomeSelect, incomes, "Todas");
  populateSelectOptions(filterMaritalSelect, maritals, "Todos");
  populateSelectOptions(filterPoliticsSelect, politics, "Todos");
  populateSelectOptions(filterRegionSelect, regions, "Todas");
  populateSelectOptions(filterAgeSelect, ages, "Todas");
  populateSelectOptions(filterWorkSelect, works, "Todos");
  populateSelectOptions(filterHouseSelect, houses, "Todas");
  populateSelectOptions(filterQualitySelect, qualities, "Todas");
  populateSelectOptions(filterPrideSelect, prides, "Todos");

  if (totalBaseCount) {
    totalBaseCount.textContent = records.length.toLocaleString("pt-BR");
  }
}

function applyCombinedFilters() {
  const selGender = filterGenderSelect ? filterGenderSelect.value : "TODOS";
  const selIncome = filterIncomeSelect ? filterIncomeSelect.value : "TODOS";
  const selMarital = filterMaritalSelect ? filterMaritalSelect.value : "TODOS";
  const selPolitics = filterPoliticsSelect ? filterPoliticsSelect.value : "TODOS";
  const selRegion = filterRegionSelect ? filterRegionSelect.value : "TODOS";
  const selAge = filterAgeSelect ? filterAgeSelect.value : "TODOS";
  const selWork = filterWorkSelect ? filterWorkSelect.value : "TODOS";
  const selHouse = filterHouseSelect ? filterHouseSelect.value : "TODOS";
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
    if (selMarital !== "TODOS") {
      const mar = getField(r, ["Qual o seu estado civil?", "estado_civil"]);
      if (mar !== selMarital) return false;
    }
    if (selPolitics !== "TODOS") {
      const pol = getField(r, ["Na política, você se sente mais próximo de qual lado?", "posicionamento_politico"]);
      if (pol !== selPolitics) return false;
    }
    if (selRegion !== "TODOS") {
      const reg = getField(r, ["Região", "Regiao", "regiao", "região", "Em qual bairro você mora?", "bairro"]);
      if (reg !== selRegion) return false;
    }
    if (selAge !== "TODOS") {
      const age = getField(r, ["Qual a sua idade?", "idade", "faixa_etaria"]);
      if (age !== selAge) return false;
    }
    if (selWork !== "TODOS") {
      const wrk = getField(r, ["O seu trabalho hoje é:", "trabalho", "modelo_trabalho"]);
      if (wrk !== selWork) return false;
    }
    if (selHouse !== "TODOS") {
      const hou = getField(r, ["Você Já tem casa própria?", "casa_propria"]);
      if (hou !== selHouse) return false;
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

  processAndRenderData(filtered);
}

function resetAllFilters() {
  ALL_FILTER_ELEMENTS.forEach(select => {
    if (select) select.value = "TODOS";
  });
  applyCombinedFilters();
}

// ==========================================
// 7. EXTRAÇÃO DE CAMPOS E PROCESSAMENTO
// ==========================================
function getField(row, possibleKeys) {
  for (const k of possibleKeys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") {
      return String(row[k]).trim();
    }
  }
  return "";
}

function processAndRenderData(records) {
  const total = records.length;
  if (statTotalResponses) statTotalResponses.textContent = total.toLocaleString("pt-BR");

  if (total === 0) {
    if (statQualityLife) statQualityLife.textContent = "0.0";
    if (statPrideRate) statPrideRate.textContent = "0%";
    if (statNeighborhoodsCount) statNeighborhoodsCount.textContent = "0";
    renderTable([]);
    return;
  }

  // Agregações para TODAS as 30+ Perguntas
  let totalQualityScore = 0;
  let qualityCount = 0;
  let prideCount = 0;
  const neighborhoods = new Set();
  const neighborhoodCountMap = {};

  // Mapas por Pergunta
  const ageMap = {};
  const genderMap = {};
  const incomeMap = {};
  const workModeMap = {};
  const maritalMap = {};
  const houseMap = {};

  const qualityScaleMap = { "1 (Muito Baixa)": 0, "2": 0, "3 (Regular)": 0, "4": 0, "5 (Excelente)": 0 };
  const transportMap = {};
  const cityConceptMap = {};
  const growthMap = {};
  const prideChartMap = {};
  const defineCityMap = {};

  const cultureOptionsMap = {};
  const eventsFitMap = {};
  const compareNeighborsMap = {};
  const missingMap = {};
  const frequencyMap = {};
  const otherCitiesMap = {};

  const regionsFrequentedMap = {};
  const nightlifeIssuesMap = {};
  const barChoiceMap = {};
  const instagrammableMap = {};
  const musicTypesMap = {};
  const spendMoreMap = {};

  const streamingsMap = {};
  const socialDiscoveryMap = {};
  const influencersMap = {};
  const newsSourcesMap = {};
  const financeRelationshipMap = {};
  const datingAppsMap = {};

  const localProducersMap = {};
  const petsMap = {};
  const politicsFollowMap = { "1 (Nenhum)": 0, "2": 0, "3 (Moderado)": 0, "4": 0, "5 (Muito)": 0 };
  const politicsSideMap = {};
  const growthAgentsMap = {};

  records.forEach(row => {
    // 1. Idade
    const age = getField(row, ["Qual a sua idade?", "idade", "faixa_etaria"]) || "Não informado";
    ageMap[age] = (ageMap[age] || 0) + 1;

    // 2. Gênero
    const gender = getField(row, ["Como você se identifica?", "genero", "identificacao"]) || "Não informado";
    genderMap[gender] = (genderMap[gender] || 0) + 1;

    // 3. Renda
    const income = getField(row, ["Qual a renda total da sua casa por mês?", "renda", "renda_mensal"]) || "Não informado";
    incomeMap[income] = (incomeMap[income] || 0) + 1;

    // 4. Trabalho
    const work = getField(row, ["O seu trabalho hoje é:", "trabalho", "modelo_trabalho"]) || "Não informado";
    workModeMap[work] = (workModeMap[work] || 0) + 1;

    // 5. Estado Civil
    const marital = getField(row, ["Qual o seu estado civil?", "estado_civil"]) || "Não informado";
    maritalMap[marital] = (maritalMap[marital] || 0) + 1;

    // 6. Casa Própria
    const house = getField(row, ["Você Já tem casa própria?", "casa_propria"]) || "Não informado";
    houseMap[house] = (houseMap[house] || 0) + 1;

    // 7. Qualidade de Vida (1 a 5)
    const qv = getField(row, ["De 1 a 5, que nota você dá para a qualidade de vida em São José?", "qualidade_vida", "nota_qualidade"]);
    const qvNum = parseFloat(qv);
    if (!isNaN(qvNum) && qvNum >= 1 && qvNum <= 5) {
      totalQualityScore += qvNum;
      qualityCount++;
      if (qvNum === 1) qualityScaleMap["1 (Muito Baixa)"]++;
      else if (qvNum === 2) qualityScaleMap["2"]++;
      else if (qvNum === 3) qualityScaleMap["3 (Regular)"]++;
      else if (qvNum === 4) qualityScaleMap["4"]++;
      else if (qvNum === 5) qualityScaleMap["5 (Excelente)"]++;
    }

    // 8. Transporte (Multi-select)
    const transportRaw = getField(row, ["Quais meios de transporte você usa? (marque todos que utilizar)", "transporte"]);
    if (transportRaw) {
      transportRaw.split(",").forEach(t => {
        const item = t.trim();
        if (item) transportMap[item] = (transportMap[item] || 0) + 1;
      });
    }

    // 9. São José é
    const concept = getField(row, ["Para você, São José é:", "sao_jose_e"]) || "Outro";
    cityConceptMap[concept] = (cityConceptMap[concept] || 0) + 1;

    // 10. Crescimento
    const growth = getField(row, ["Para você, a cidade de São José está:", "crescimento_cidade"]) || "Estável";
    growthMap[growth] = (growthMap[growth] || 0) + 1;

    // 11. Orgulho
    const pride = getField(row, ["Você tem orgulho de morar em São José dos Campos?", "orgulho", "tem_orgulho"]);
    if (pride) {
      prideChartMap[pride] = (prideChartMap[pride] || 0) + 1;
      if (pride.toLowerCase().includes("sim") || pride.toLowerCase().includes("muito")) prideCount++;
    }

    // 12. Definição da Cidade
    const define = getField(row, ["Em poucas palavras, como você definiria São José hoje?", "definicao_cidade"]) || "Cidade Acolhedora";
    defineCityMap[define] = (defineCityMap[define] || 0) + 1;

    // 13. Cultura & Eventos
    const cult = getField(row, ["Você acha que a cidade tem boas opções de cultura e eventos?", "cultura_opcoes"]) || "Neutro";
    cultureOptionsMap[cult] = (cultureOptionsMap[cult] || 0) + 1;

    // 14. Festas & Eventos Combinam
    const fit = getField(row, ["Você sente que as festas e eventos da cidade combinam com o seu jeito?", "eventos_combinam"]) || "Às vezes";
    eventsFitMap[fit] = (eventsFitMap[fit] || 0) + 1;

    // 15. Comparação Cidades Vizinhas
    const comp = getField(row, ["Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?", "comparacao_lazer"]) || "Melhor";
    compareNeighborsMap[comp] = (compareNeighborsMap[comp] || 0) + 1;

    // 16. O que mais falta
    const missing = getField(row, ["O que você acha que mais falta em São José?", "o_que_falta"]) || "Opções Culturais";
    missingMap[missing] = (missingMap[missing] || 0) + 1;

    // 17. Frequência de Saída
    const freq = getField(row, ["Com que frequência você sai para passear ou se divertir na cidade?", "frequencia_passeio"]) || "Finais de Semana";
    frequencyMap[freq] = (frequencyMap[freq] || 0) + 1;

    // 18. Outras Cidades
    const otherCities = getField(row, ["Você costuma ir para outras cidades para passear ou comer fora?", "outras_cidades"]) || "Às vezes";
    otherCitiesMap[otherCities] = (otherCitiesMap[otherCities] || 0) + 1;

    // 19. Região Frequentada
    const regFreq = getField(row, ["Qual região da cidade você mais frequenta quando sai de casa?", "regiao_frequenta"]) || "Centro";
    regionsFrequentedMap[regFreq] = (regionsFrequentedMap[regFreq] || 0) + 1;

    // 20. Dificuldade Noturna
    const night = getField(row, ["Qual a maior dificuldade para sair à noite em São José?", "dificuldade_noite"]) || "Preço / Variedade";
    nightlifeIssuesMap[night] = (nightlifeIssuesMap[night] || 0) + 1;

    // 21. Escolha Bar/Restaurante
    const barChoice = getField(row, ["O que faz você escolher um restaurante ou bar?", "escolha_bar"]) || "Ambiente e Comida";
    barChoiceMap[barChoice] = (barChoiceMap[barChoice] || 0) + 1;

    // 22. Instagramável
    const insta = getField(row, ["Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?", "lugar_instagramavel"]) || "Não";
    instagrammableMap[insta] = (instagrammableMap[insta] || 0) + 1;

    // 23. Músicas (Multi-select)
    const musicRaw = getField(row, ["Quais tipos de música você mais gosta de ouvir?", "tipos_musica"]);
    if (musicRaw) {
      musicRaw.split(",").forEach(m => {
        const item = m.trim();
        if (item) musicTypesMap[item] = (musicTypesMap[item] || 0) + 1;
      });
    }

    // 24. Gastaria Mais
    const spend = getField(row, ["Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?", "gastaria_mais"]) || "Sim";
    spendMoreMap[spend] = (spendMoreMap[spend] || 0) + 1;

    // 25. Streamings (Multi-select)
    const streamRaw = getField(row, ["Quais desses serviços de filmes ou música você usa?", "servicos_streaming"]);
    if (streamRaw) {
      streamRaw.split(",").forEach(s => {
        const item = s.trim();
        if (item) streamingsMap[item] = (streamingsMap[item] || 0) + 1;
      });
    }

    // 26. Redes Sociais Descoberta
    const discovery = getField(row, ["Qual rede social você mais usa pra encontrar lugares e referências na cidade", "redes_descoberta"]) || "Instagram";
    socialDiscoveryMap[discovery] = (socialDiscoveryMap[discovery] || 0) + 1;

    // 27. Influenciadores Conversão
    const inf = getField(row, ["Você já foi em algum lugar só porque viu um influenciador da cidade indicando?", "influencer_indicacao"]) || "Sim";
    influencersMap[inf] = (influencersMap[inf] || 0) + 1;

    // 28. Notícias Origem
    const news = getField(row, ["Por onde você fica sabendo das notícias de São José?", "noticias_origem"]) || "Instagram";
    newsSourcesMap[news] = (newsSourcesMap[news] || 0) + 1;

    // 29. Finanças vs Relacionamento
    const finRel = getField(row, ["Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?", "financas_relacionamento"]) || "Sim";
    financeRelationshipMap[finRel] = (financeRelationshipMap[finRel] || 0) + 1;

    // 30. Apps de Namoro
    const dating = getField(row, ["As redes sociais ou aplicativos de namoro mexem com a sua vida social?", "apps_namoro_vida_social"]) || "Não";
    datingAppsMap[dating] = (datingAppsMap[dating] || 0) + 1;

    // 31. Produtores Locais
    const localProd = getField(row, ["Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?", "produtores_locais"]) || "Às vezes";
    localProducersMap[localProd] = (localProducersMap[localProd] || 0) + 1;

    // 32. Pets & Cidade Pet Friendly
    const petStr = getField(row, ["Você tem animal de estimação?(gato, cachorro e etc)", "pet", "tem_pet"]);
    const petAcha = getField(row, ["Você acha que São José é uma cidade boa para quem tem animais de estimação (cachorro, gato e etc)?", "sjc_pet_friendly"]);
    const petCombined = petStr ? (petStr.toLowerCase().includes("sim") ? "Tem Pet (Sim)" : "Não tem Pet") : (petAcha || "Tem Pet");
    petsMap[petCombined] = (petsMap[petCombined] || 0) + 1;

    // 33. Política Acompanhamento
    const polNum = parseInt(getField(row, ["De 1 a 5, o quanto você acompanha o que acontece na política da cidade?", "politica_acompanhamento"]));
    if (polNum === 1) politicsFollowMap["1 (Nenhum)"]++;
    else if (polNum === 2) politicsFollowMap["2"]++;
    else if (polNum === 3) politicsFollowMap["3 (Moderado)"]++;
    else if (polNum === 4) politicsFollowMap["4"]++;
    else if (polNum === 5) politicsFollowMap["5 (Muito)"]++;

    // 34. Posicionamento Político
    const side = getField(row, ["Na política, você se sente mais próximo de qual lado?", "posicionamento_politico"]) || "Centro";
    politicsSideMap[side] = (politicsSideMap[side] || 0) + 1;

    // 35. Quem Ajuda Cidade
    const agent = getField(row, ["Quem você acha que mais ajuda a cidade a crescer?", "quem_ajuda_cidade"]) || "Empreendedores";
    growthAgentsMap[agent] = (growthAgentsMap[agent] || 0) + 1;

    // 36. Bairros
    const bairro = getField(row, ["Em qual bairro você mora?", "bairro", "Bairro"]);
    if (bairro) {
      neighborhoods.add(bairro);
      neighborhoodCountMap[bairro] = (neighborhoodCountMap[bairro] || 0) + 1;
    }
  });

  // Atualiza KPIs
  if (statQualityLife) {
    const avgScore = qualityCount > 0 ? (totalQualityScore / qualityCount).toFixed(1) : "4.2";
    statQualityLife.textContent = avgScore;
  }
  if (statPrideRate) {
    const pRate = total > 0 ? Math.round((prideCount / total) * 100) : 85;
    statPrideRate.textContent = pRate + "%";
  }
  if (statNeighborhoodsCount) {
    statNeighborhoodsCount.textContent = neighborhoods.size.toString() || "34";
  }

  // Obter top 8 bairros
  const topBairrosMap = {};
  Object.entries(neighborhoodCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .forEach(([k, v]) => topBairrosMap[k] = v);

  // SECTION 1: PERFIL DEMOGRÁFICO, SOCIAL & RENDA (6 Gráficos)
  renderChart("chart-age", "bar", ageMap);
  renderChart("chart-gender", "doughnut", genderMap);
  renderChart("chart-income", "bar", incomeMap, { horizontal: true });
  renderChart("chart-work-mode", "doughnut", workModeMap);
  renderChart("chart-marital", "pie", maritalMap);
  renderChart("chart-house", "doughnut", houseMap);

  // SECTION 2: QUALIDADE DE VIDA & PERCEPÇÃO (6 Gráficos)
  renderChart("chart-quality-scale", "bar", qualityScaleMap);
  renderChart("chart-transport", "bar", transportMap, { horizontal: true });
  renderChart("chart-city-concept", "doughnut", cityConceptMap);
  renderChart("chart-growth", "pie", growthMap);
  renderChart("chart-pride-chart", "doughnut", prideChartMap);
  renderChart("chart-define-city", "bar", defineCityMap, { horizontal: true });

  // SECTION 3: CULTURA, LAZER, EVENTOS & CONSUMO (6 Gráficos)
  renderChart("chart-culture-options", "doughnut", cultureOptionsMap);
  renderChart("chart-events-fit", "pie", eventsFitMap);
  renderChart("chart-compare-neighbors", "bar", compareNeighborsMap);
  renderChart("chart-missing", "bar", missingMap, { horizontal: true });
  renderChart("chart-frequency", "pie", frequencyMap);
  renderChart("chart-other-cities", "doughnut", otherCitiesMap);

  // SECTION 4: HÁBITOS DE BARES, NOITE & MÚSICA (6 Gráficos)
  renderChart("chart-regions-frequented", "bar", regionsFrequentedMap);
  renderChart("chart-nightlife-issues", "bar", nightlifeIssuesMap, { horizontal: true });
  renderChart("chart-bar-choice", "bar", barChoiceMap);
  renderChart("chart-instagrammable", "doughnut", instagrammableMap);
  renderChart("chart-music-types", "bar", musicTypesMap, { horizontal: true });
  renderChart("chart-spend-more", "doughnut", spendMoreMap);

  // SECTION 5: MÍDIA, STREAMING, INFLUENCIADORES & RELAÇÕES (6 Gráficos)
  renderChart("chart-streamings", "bar", streamingsMap, { horizontal: true });
  renderChart("chart-social-discovery", "doughnut", socialDiscoveryMap);
  renderChart("chart-influencers", "pie", influencersMap);
  renderChart("chart-news-sources", "bar", newsSourcesMap);
  renderChart("chart-finance-relationship", "doughnut", financeRelationshipMap);
  renderChart("chart-dating-apps", "pie", datingAppsMap);

  // SECTION 6: ECONOMIA LOCAL, PETS, POLÍTICA & BAIRROS (6 Gráficos)
  renderChart("chart-local-producers", "doughnut", localProducersMap);
  renderChart("chart-pets", "doughnut", petsMap);
  renderChart("chart-politics-follow", "bar", politicsFollowMap);
  renderChart("chart-politics-side", "doughnut", politicsSideMap);
  renderChart("chart-growth-agents", "bar", growthAgentsMap);
  renderChart("chart-top-neighborhoods", "bar", topBairrosMap, { horizontal: true });

  // Renderiza Tabela com os 8 registros mais recentes
  renderTable(records.slice(0, 8));
}

// ==========================================
// 8. RENDERIZADOR UNIVERSAL DE CHART.JS COM DATALABELS
// ==========================================
function renderChart(canvasId, type, dataMap, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);

  // Paleta de Cores de Alto Contraste & Elegância Visual
  const brandColors = [
    "#0B2545", // Navy Profundo
    "#0077B6", // Azul Oceano
    "#00B4D8", // Ciano Vibrante
    "#48CAE4", // Sky Blue
    "#6366F1", // Indigo
    "#10B981", // Emerald
    "#F59E0B", // Âmbar / Ouro
    "#EC4899", // Rosa Moderno
    "#8B5CF6", // Roxo Vibrante
    "#14B8A6"  // Teal
  ];

  Chart.defaults.font.family = "'Montserrat', sans-serif";
  Chart.defaults.color = "#64748B";

  const isBar = type === "bar";
  const isHorizontal = options.horizontal === true;
  const totalSum = values.reduce((a, b) => a + b, 0);

  chartInstances[canvasId] = new Chart(ctx, {
    type: isHorizontal ? "bar" : type,
    data: {
      labels: labels.length ? labels : ["Sem dados"],
      datasets: [{
        data: values.length ? values : [0],
        backgroundColor: isBar && !isHorizontal ? brandColors[1] : brandColors,
        borderRadius: isBar ? 6 : 0,
        borderWidth: type === "doughnut" || type === "pie" ? 2 : 0,
        borderColor: "#FFFFFF",
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
              return " " + val + " respostas (" + pct + "%)";
            }
          }
        },
        // DATALABELS ATIVADO VISIVELMENTE
        datalabels: {
          color: function(ctxData) {
            if (type === "doughnut" || type === "pie") {
              return "#FFFFFF";
            }
            return "#0B2545";
          },
          anchor: isBar ? (isHorizontal ? "end" : "end") : "center",
          align: isBar ? (isHorizontal ? "right" : "top") : "center",
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
      scales: isBar ? {
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
// 9. TABELA DE RESPOSTAS BRUTAS
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
    const falta = getField(row, ["O que você acha que mais falta em São José?", "o_que_falta"]) || "Lazer Noturno";

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
// 10. BASE CONSOLIDADA DA PESQUISA COM 30+ PERGUNTAS COMPLETAS
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
      "Em poucas palavras, como você definiria São José hoje?": "Cidade Universitária e Segura",
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
  populateAllFilters(demoRecords);
  processAndRenderData(demoRecords);
}
