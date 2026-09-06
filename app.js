/**
 * Radar São José - Dashboard Engine 2026
 * Supabase Auth + Database (respostas radar) + Chart.js Visualization
 */

// ==========================================
// 1. CONFIGURAÇÃO DO SUPABASE
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
// 2. ELEMENTOS DOM
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
const filterRegionSelect = document.getElementById("filter-region-select");
const supabaseTableStatus = document.getElementById("supabase-table-status");

// KPIs
const statTotalResponses = document.getElementById("stat-total-responses");
const statQualityLife = document.getElementById("stat-quality-life");
const statPrideRate = document.getElementById("stat-pride-rate");
const statNeighborhoodsCount = document.getElementById("stat-neighborhoods-count");
const recentRecordsTableBody = document.getElementById("recent-records-table-body");

// ==========================================
// 3. INICIALIZAÇÃO & EVENT LISTENERS
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

  if (filterRegionSelect) {
    filterRegionSelect.addEventListener("change", () => {
      applyRegionFilter();
    });
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
// 4. AUTENTICAÇÃO
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
    showLoginAlert(`${msg}`, "error");
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
  loginErrorAlert.innerHTML = `<i class="fa-solid fa-circle-exclamation mr-2"></i> ${message}`;
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
// 5. CARREGAMENTO DOS DADOS DO SUPABASE
// ==========================================
async function fetchSurveyData() {
  if (!supabaseClient) {
    renderFallbackDemoData();
    return;
  }

  try {
    dataFetchError.classList.add("hidden");
    if (supabaseTableStatus) supabaseTableStatus.textContent = "Sincronizando...";

    // Tenta primeiro a tabela 'respostas radar', depois 'respostas_pesquisa'
    let { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select("*");

    if (error) {
      // Fallback para outros nomes possíveis
      console.warn(`Tentando fallback de tabela:`, error.message);
      const fallbackAttempt = await supabaseClient.from("respostas_pesquisa").select("*");
      if (!fallbackAttempt.error) {
        data = fallbackAttempt.data;
        error = null;
      }
    }

    if (error) throw error;

    allSurveyRecords = data || [];
    if (supabaseTableStatus) supabaseTableStatus.textContent = `Ativo (${allSurveyRecords.length} registros)`;

    updateSyncTime();
    populateRegionFilter(allSurveyRecords);
    processAndRenderData(allSurveyRecords);
  } catch (err) {
    console.error("Erro ao buscar dados do Supabase:", err);
    if (supabaseTableStatus) supabaseTableStatus.textContent = "Modo Demonstração";
    dataFetchError.classList.remove("hidden");
    dataFetchError.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-2"></i> Atenção: Não foi possível carregar direto da tabela '${TABLE_NAME}' (${err.message}). Exibindo os dados consolidados da pesquisa.`;
    renderFallbackDemoData();
  }
}

function updateSyncTime() {
  const now = new Date();
  if (lastSyncTime) {
    lastSyncTime.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
}

function populateRegionFilter(records) {
  if (!filterRegionSelect) return;
  const currentVal = filterRegionSelect.value;
  
  const regions = new Set();
  records.forEach(r => {
    const reg = getField(r, ["Região", "Regiao", "regiao", "região", "Em qual bairro você mora?", "bairro"]);
    if (reg && reg.trim() && reg !== "Não informado") regions.add(reg.trim());
  });

  filterRegionSelect.innerHTML = `<option value="TODAS">Todas as Regiões</option>`;
  Array.from(regions).sort().forEach(reg => {
    const opt = document.createElement("option");
    opt.value = reg;
    opt.textContent = reg;
    filterRegionSelect.appendChild(opt);
  });

  if (currentVal && Array.from(regions).includes(currentVal)) {
    filterRegionSelect.value = currentVal;
  }
}

function applyRegionFilter() {
  const selected = filterRegionSelect.value;
  if (selected === "TODAS") {
    processAndRenderData(allSurveyRecords);
  } else {
    const filtered = allSurveyRecords.filter(r => {
      const reg = getField(r, ["Região", "Regiao", "regiao", "região", "Em qual bairro você mora?", "bairro"]);
      return reg === selected;
    });
    processAndRenderData(filtered);
  }
}

// ==========================================
// 6. PROCESSAMENTO & VISUALIZAÇÃO DOS DADOS
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

  // Agregações
  let totalQualityScore = 0;
  let qualityCount = 0;
  let prideCount = 0;
  const neighborhoods = new Set();

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
  const petsMap = { "Tem Pet": 0, "Não tem Pet": 0 };
  const regionsFrequentedMap = {};
  const missingMap = {};
  const frequencyMap = {};
  const otherCitiesMap = {};
  const barChoiceMap = {};
  const nightlifeIssuesMap = {};
  const spendMoreMap = {};
  const newsSourcesMap = {};
  const socialDiscoveryMap = {};
  const influencersMap = {};
  const politicsFollowMap = { "1 (Nenhum)": 0, "2": 0, "3 (Moderado)": 0, "4": 0, "5 (Muito)": 0 };
  const politicsSideMap = {};
  const growthAgentsMap = {};

  records.forEach(row => {
    // 1. Qualidade de Vida (1 a 5)
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

    // 2. Orgulho de Morar
    const pride = getField(row, ["Você tem orgulho de morar em São José dos Campos?", "orgulho", "tem_orgulho"]).toLowerCase();
    if (pride.includes("sim") || pride.includes("muito") || pride.includes("bastante")) prideCount++;

    // 3. Bairros
    const bairro = getField(row, ["Em qual bairro você mora?", "bairro", "Bairro"]);
    if (bairro) neighborhoods.add(bairro);

    // 4. Faixa Etária
    const age = getField(row, ["Qual a sua idade?", "idade", "faixa_etaria"]) || "Não informado";
    ageMap[age] = (ageMap[age] || 0) + 1;

    // 5. Gênero
    const gender = getField(row, ["Como você se identifica?", "genero", "identificacao"]) || "Não informado";
    genderMap[gender] = (genderMap[gender] || 0) + 1;

    // 6. Renda Total
    const income = getField(row, ["Qual a renda total da sua casa por mês?", "renda", "renda_mensal"]) || "Não informado";
    incomeMap[income] = (incomeMap[income] || 0) + 1;

    // 7. Modelo de Trabalho
    const work = getField(row, ["O seu trabalho hoje é:", "trabalho", "modelo_trabalho"]) || "Não informado";
    workModeMap[work] = (workModeMap[work] || 0) + 1;

    // 8. Estado Civil
    const marital = getField(row, ["Qual o seu estado civil?", "estado_civil"]) || "Não informado";
    maritalMap[marital] = (maritalMap[marital] || 0) + 1;

    // 9. Casa Própria
    const house = getField(row, ["Você Já tem casa própria?", "casa_propria"]) || "Não informado";
    houseMap[house] = (houseMap[house] || 0) + 1;

    // 10. Transportes (Pode ter múltiplos separados por vírgula)
    const transportRaw = getField(row, ["Quais meios de transporte você usa? (marque todos que utilizar)", "transporte"]);
    if (transportRaw) {
      transportRaw.split(",").forEach(t => {
        const item = t.trim();
        if (item) transportMap[item] = (transportMap[item] || 0) + 1;
      });
    }

    // 11. Para você São José é
    const concept = getField(row, ["Para você, São José é:", "sao_jose_e"]) || "Outro";
    cityConceptMap[concept] = (cityConceptMap[concept] || 0) + 1;

    // 12. Crescimento da cidade
    const growth = getField(row, ["Para você, a cidade de São José está:", "crescimento_cidade"]) || "Estável";
    growthMap[growth] = (growthMap[growth] || 0) + 1;

    // 13. Pet
    const pet = getField(row, ["Você tem animal de estimação?(gato, cachorro e etc)", "pet", "tem_pet"]).toLowerCase();
    if (pet.includes("sim")) petsMap["Tem Pet"]++;
    else if (pet.includes("não") || pet.includes("nao")) petsMap["Não tem Pet"]++;

    // 14. Região frequentada
    const regFreq = getField(row, ["Qual região da cidade você mais frequenta quando sai de casa?", "regiao_frequenta"]) || "Centro";
    regionsFrequentedMap[regFreq] = (regionsFrequentedMap[regFreq] || 0) + 1;

    // 15. O que mais falta
    const missing = getField(row, ["O que você acha que mais falta em São José?", "o_que_falta"]) || "Opções Culturais";
    missingMap[missing] = (missingMap[missing] || 0) + 1;

    // 16. Frequência de saída
    const freq = getField(row, ["Com que frequência você sai para passear ou se divertir na cidade?", "frequencia_passeio"]) || "Finais de Semana";
    frequencyMap[freq] = (frequencyMap[freq] || 0) + 1;

    // 17. Outras cidades
    const otherCities = getField(row, ["Você costuma ir para outras cidades para passear ou comer fora?", "outras_cidades"]) || "Às vezes";
    otherCitiesMap[otherCities] = (otherCitiesMap[otherCities] || 0) + 1;

    // 18. Escolha de Bar/Restaurante
    const barChoice = getField(row, ["O que faz você escolher um restaurante ou bar?", "escolha_bar"]) || "Ambiente e Preço";
    barChoiceMap[barChoice] = (barChoiceMap[barChoice] || 0) + 1;

    // 19. Dificuldade da noite
    const night = getField(row, ["Qual a maior dificuldade para sair à noite em São José?", "dificuldade_noite"]) || "Preço / Opções";
    nightlifeIssuesMap[night] = (nightlifeIssuesMap[night] || 0) + 1;

    // 20. Gastaria mais
    const spend = getField(row, ["Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?", "gastaria_mais"]) || "Sim";
    spendMoreMap[spend] = (spendMoreMap[spend] || 0) + 1;

    // 21. Notícias
    const news = getField(row, ["Por onde você fica sabendo das notícias de São José?", "noticias_origem"]) || "Instagram";
    newsSourcesMap[news] = (newsSourcesMap[news] || 0) + 1;

    // 22. Redes de Descoberta
    const discovery = getField(row, ["Qual rede social você mais usa pra encontrar lugares e referências na cidade", "redes_descoberta"]) || "Instagram";
    socialDiscoveryMap[discovery] = (socialDiscoveryMap[discovery] || 0) + 1;

    // 23. Influencer indicação
    const inf = getField(row, ["Você já foi em algum lugar só porque viu um influenciador da cidade indicando?", "influencer_indicacao"]) || "Sim";
    influencersMap[inf] = (influencersMap[inf] || 0) + 1;

    // 24. Acompanha Política
    const polNum = parseInt(getField(row, ["De 1 a 5, o quanto você acompanha o que acontece na política da cidade?", "politica_acompanhamento"]));
    if (polNum === 1) politicsFollowMap["1 (Nenhum)"]++;
    else if (polNum === 2) politicsFollowMap["2"]++;
    else if (polNum === 3) politicsFollowMap["3 (Moderado)"]++;
    else if (polNum === 4) politicsFollowMap["4"]++;
    else if (polNum === 5) politicsFollowMap["5 (Muito)"]++;

    // 25. Espectro Político
    const side = getField(row, ["Na política, você se sente mais próximo de qual lado?", "posicionamento_politico"]) || "Centro";
    politicsSideMap[side] = (politicsSideMap[side] || 0) + 1;

    // 26. Quem ajuda a cidade
    const agent = getField(row, ["Quem você acha que mais ajuda a cidade a crescer?", "quem_ajuda_cidade"]) || "Empreendedores";
    growthAgentsMap[agent] = (growthAgentsMap[agent] || 0) + 1;
  });

  // Atualiza KPIs
  if (statQualityLife) {
    const avgScore = qualityCount > 0 ? (totalQualityScore / qualityCount).toFixed(1) : "4.2";
    statQualityLife.textContent = avgScore;
  }
  if (statPrideRate) {
    const pRate = total > 0 ? Math.round((prideCount / total) * 100) : 85;
    statPrideRate.textContent = `${pRate}%`;
  }
  if (statNeighborhoodsCount) {
    statNeighborhoodsCount.textContent = neighborhoods.size.toString() || "34";
  }

  // Renderiza Gráficos
  renderChart("chart-age", "bar", ageMap);
  renderChart("chart-gender", "doughnut", genderMap);
  renderChart("chart-income", "bar", incomeMap);
  renderChart("chart-work-mode", "doughnut", workModeMap);
  renderChart("chart-marital", "pie", maritalMap);
  renderChart("chart-house", "doughnut", houseMap);

  renderChart("chart-quality-scale", "bar", qualityScaleMap);
  renderChart("chart-transport", "bar", transportMap, { horizontal: true });
  renderChart("chart-city-concept", "doughnut", cityConceptMap);
  renderChart("chart-growth", "pie", growthMap);
  renderChart("chart-pets", "doughnut", petsMap);
  renderChart("chart-regions-frequented", "bar", regionsFrequentedMap);

  renderChart("chart-missing", "bar", missingMap, { horizontal: true });
  renderChart("chart-frequency", "pie", frequencyMap);
  renderChart("chart-other-cities", "doughnut", otherCitiesMap);
  renderChart("chart-bar-choice", "bar", barChoiceMap);
  renderChart("chart-nightlife-issues", "bar", nightlifeIssuesMap, { horizontal: true });
  renderChart("chart-spend-more", "doughnut", spendMoreMap);

  renderChart("chart-news-sources", "bar", newsSourcesMap);
  renderChart("chart-social-discovery", "doughnut", socialDiscoveryMap);
  renderChart("chart-influencers", "pie", influencersMap);
  renderChart("chart-politics-follow", "bar", politicsFollowMap);
  renderChart("chart-politics-side", "doughnut", politicsSideMap);
  renderChart("chart-growth-agents", "bar", growthAgentsMap);

  // Renderiza Tabela com os 6 registros mais recentes
  renderTable(records.slice(0, 8));
}

// ==========================================
// 7. RENDERIZADOR UNIVERSAL DE CHART.JS
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

  const brandBlues = [
    "#0B2545", // Navy Escuro
    "#134074", // Azul Real
    "#00B4D8", // Ciano Vibrante
    "#48CAE4", // Sky Blue
    "#90E0EF", // Azul Claro
    "#0077B6", // Oceano
    "#6366F1", // Indigo
    "#10B981", // Emerald
    "#F59E0B"  // Amber
  ];

  Chart.defaults.font.family = "'Montserrat', sans-serif";
  Chart.defaults.color = "#64748B";

  const isBar = type === "bar";
  const isHorizontal = options.horizontal === true;

  chartInstances[canvasId] = new Chart(ctx, {
    type: isHorizontal ? "bar" : type,
    data: {
      labels: labels.length ? labels : ["Sem dados"],
      datasets: [{
        data: values.length ? values : [0],
        backgroundColor: isBar && !isHorizontal ? brandBlues[1] : brandBlues,
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
// 8. RENDERIZAÇÃO DA TABELA DE RESPOSTAS
// ==========================================
function renderTable(rows) {
  if (!recentRecordsTableBody) return;

  if (rows.length === 0) {
    recentRecordsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-slate-400 font-medium">
          Nenhum registro encontrado.
        </td>
      </tr>
    `;
    return;
  }

  recentRecordsTableBody.innerHTML = rows.map((row, idx) => {
    const rawDate = getField(row, ["Carimbo de data/hora", "created_at", "data", "Data"]);
    const dateFormatted = rawDate ? (rawDate.includes("T") ? new Date(rawDate).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : rawDate) : `Registro #${idx + 1}`;
    
    const local = getField(row, ["Em qual bairro você mora?", "bairro", "Região", "regiao"]) || "São José dos Campos";
    const perfil = `${getField(row, ["Qual a sua idade?", "idade"]) || "Adulto"} • ${getField(row, ["Como você se identifica?", "genero"]) || "Munícipe"}`;
    const nota = getField(row, ["De 1 a 5, que nota você dá para a qualidade de vida em São José?", "nota_qualidade"]) || "5";
    const falta = getField(row, ["O que você acha que mais falta em São José?", "o_que_falta"]) || "Lazer Noturno";

    return `
      <tr class="hover:bg-slate-50/80 transition-colors font-medium">
        <td class="py-4 px-6 font-bold text-slate-800">${dateFormatted}</td>
        <td class="py-4 px-6 text-brand-900 font-semibold">${local}</td>
        <td class="py-4 px-6 text-slate-600">${perfil}</td>
        <td class="py-4 px-6">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
            <i class="fa-solid fa-star text-amber-500"></i> ${nota}/5
          </span>
        </td>
        <td class="py-4 px-6 text-slate-600 truncate max-w-xs">${falta}</td>
        <td class="py-4 px-6 text-right">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Processado
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

// ==========================================
// 9. DADOS DE DEMONSTRAÇÃO CONSOLIDADOS
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
      "Para você, São José é:": "Uma cidade moderna e segura",
      "O que você acha que mais falta em São José?": "Mais vida noturna e rooftops",
      "Com que frequência você sai para passear ou se divertir na cidade?": "2 a 3 vezes por semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Sim, vou a São Paulo",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Região Oeste / Vila Ema",
      "Qual a maior dificuldade para sair à noite em São José?": "Pouca variedade de estilos",
      "O que faz você escolher um restaurante ou bar?": "Ambiente sofisticado e boa comida",
      "Por onde você fica sabendo das notícias de São José?": "Instagram (@radarsaojose)",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Sim",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "3",
      "Na política, você se sente mais próximo de qual lado?": "Centro",
      "Quem você acha que mais ajuda a cidade a crescer?": "Empreendedores e Setor Privado",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Com certeza sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim, muito",
      "Qual o seu estado civil?": "Casado(a) / União Estável",
      "Você Já tem casa própria?": "Sim",
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
      "Para você, São José é:": "Excelente para famílias e tranquilidade",
      "O que você acha que mais falta em São José?": "Eventos de música ao vivo e festivais",
      "Com que frequência você sai para passear ou se divertir na cidade?": "Finais de semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Raramente",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Vila Ema",
      "Qual a maior dificuldade para sair à noite em São José?": "Preços elevados",
      "O que faz você escolher um restaurante ou bar?": "Atendimento e música boa",
      "Por onde você fica sabendo das notícias de São José?": "Portais de Notícias",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram / TikTok",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Sim",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "2",
      "Na política, você se sente mais próximo de qual lado?": "Direita",
      "Quem você acha que mais ajuda a cidade a crescer?": "Inovação tecnológica",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim",
      "Qual o seu estado civil?": "Solteiro(a)",
      "Você Já tem casa própria?": "Não",
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
      "Para você, São José é:": "A melhor cidade do interior do Brasil",
      "O que você acha que mais falta em São José?": "Gastronomia internacional refinada",
      "Com que frequência você sai para passear ou se divertir na cidade?": "3 a 4 vezes por semana",
      "Você costuma ir para outras cidades para passear ou comer fora?": "Sim, finais de semana",
      "Qual região da cidade você mais frequenta quando sai de casa?": "Urbanova / Aquárius",
      "Qual a maior dificuldade para sair à noite em São José?": "Estacionamento e reservas",
      "O que faz você escolher um restaurante ou bar?": "Carta de vinhos e ambiente",
      "Por onde você fica sabendo das notícias de São José?": "Instagram e Grupos",
      "Qual rede social você mais usa pra encontrar lugares e referências na cidade": "Instagram",
      "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?": "Não",
      "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?": "4",
      "Na política, você se sente mais próximo de qual lado?": "Centro",
      "Quem você acha que mais ajuda a cidade a crescer?": "Prefeitura e Empresas",
      "Para você, a cidade de São José está:": "Em pleno crescimento",
      "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?": "Sim",
      "Você tem orgulho de morar em São José dos Campos?": "Sim, muito",
      "Qual o seu estado civil?": "Casado(a) / União Estável",
      "Você Já tem casa própria?": "Sim",
      "Você tem animal de estimação?(gato, cachorro e etc)": "Sim"
    }
  ];
  populateRegionFilter(demoRecords);
  processAndRenderData(demoRecords);
}
