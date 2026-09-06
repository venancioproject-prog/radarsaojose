/**
 * Radar São José - Dashboard Engine
 * Supabase Auth + Database + Chart.js Visualization
 */

// ==========================================
// 1. CONFIGURAÇÃO DO SUPABASE
// ==========================================
// Substitua pelas suas credenciais obtidas no Painel do Supabase:
// https://app.supabase.com/project/_/settings/api
const SUPABASE_URL = "https://toryvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8nKUF28dbMM8EOSPrgJRlA_19taJqW9";

// Inicialização do cliente Supabase
let supabaseClient = null;
try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase não configurado ou credenciais pendentes:", err);
}

// Instâncias dos gráficos para evitar re-renderização duplicada
let chartDistributionInstance = null;
let chartRegionsInstance = null;
let chartTimelineInstance = null;

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

// Elementos de Métricas / KPIs
const statTotalResponses = document.getElementById("stat-total-responses");
const statSatisfactionRate = document.getElementById("stat-satisfaction-rate");
const statRegionsCount = document.getElementById("stat-regions-count");
const statTodayResponses = document.getElementById("stat-today-responses");
const recentRecordsTableBody = document.getElementById("recent-records-table-body");

// ==========================================
// 3. INICIALIZAÇÃO & VERIFICAÇÃO DE SESSÃO
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  // Configurar ano atual no rodapé
  const yearElement = document.getElementById("year-current");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Toggle de visibilidade da senha
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      togglePasswordIcon.classList.toggle("fa-eye", !isPassword);
      togglePasswordIcon.classList.toggle("fa-eye-slash", isPassword);
    });
  }

  // Listener para submissão do formulário de login
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Listener de Logout
  if (btnLogout) {
    btnLogout.addEventListener("click", handleLogout);
  }

  // Listener de Recarregamento de dados
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      refreshIcon.classList.add("fa-spin");
      fetchSurveyData().finally(() => {
        setTimeout(() => refreshIcon.classList.remove("fa-spin"), 600);
      });
    });
  }

  // Verificar se há uma sessão ativa
  await checkActiveSession();
});

/**
 * Checa a sessão atual do usuário no Supabase
 */
async function checkActiveSession() {
  if (!supabaseClient) {
    console.info("Supabase aguardando configuração de credenciais no app.js.");
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
// 4. AUTENTICAÇÃO (LOGIN & LOGOUT)
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

  // Se as chaves padrão ainda não foram alteradas, informar o usuário
  if (!supabaseClient) {
    showLoginAlert("Configure suas credenciais do Supabase no arquivo app.js para conectar.", "warning");
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
    console.error("Erro na autenticação:", err);
    let msg = "Falha ao autenticar. Verifique suas credenciais.";
    if (err.message.includes("Invalid login credentials")) {
      msg = "E-mail ou senha incorretos.";
    } else if (err.message.includes("Email not confirmed")) {
      msg = "E-mail ainda não confirmado no Supabase.";
    }
    showLoginAlert(msg, "error");
  } finally {
    setLoginLoading(false);
  }
}

async function handleLogout() {
  if (!supabaseClient) {
    showLogin();
    return;
  }

  try {
    await supabaseClient.auth.signOut();
  } catch (err) {
    console.error("Erro ao sair:", err);
  } finally {
    showLogin();
  }
}

function setLoginLoading(isLoading) {
  btnLogin.disabled = isLoading;
  btnLoginText.classList.toggle("hidden", isLoading);
  btnLoginSpinner.classList.toggle("hidden", !isLoading);
}

function showLoginAlert(message, type = "error") {
  loginErrorAlert.classList.remove("hidden", "bg-red-50", "text-red-700", "border-red-200", "bg-amber-50", "text-amber-700", "border-amber-200");
  
  if (type === "warning") {
    loginErrorAlert.classList.add("bg-amber-50", "text-amber-800", "border-amber-200");
  } else {
    loginErrorAlert.classList.add("bg-red-50", "text-red-700", "border-red-200");
  }

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
// 5. CARREGAMENTO DE DADOS (SUPABASE)
// ==========================================
async function fetchSurveyData() {
  if (!supabaseClient) {
    renderFallbackDemoData();
    return;
  }

  try {
    dataFetchError.classList.add("hidden");

    // Consulta à tabela 'respostas_pesquisa'
    const { data, error } = await supabaseClient
      .from("respostas_pesquisa")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    updateSyncTime();
    processAndRenderData(data || []);
  } catch (err) {
    console.error("Erro ao buscar dados do Supabase:", err);
    dataFetchError.classList.remove("hidden");
    dataFetchError.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-2"></i> Não foi possível sincronizar com a tabela 'respostas_pesquisa': ${err.message}. Exibindo dados prévios ou estrutura base.`;
    renderFallbackDemoData();
  }
}

function updateSyncTime() {
  const now = new Date();
  lastSyncTime.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ==========================================
// 6. PROCESSAMENTO & VISUALIZAÇÃO (CHART.JS)
// ==========================================
function processAndRenderData(records) {
  // 1. Métricas Principais
  const total = records.length;
  statTotalResponses.textContent = total.toLocaleString("pt-BR");

  if (total === 0) {
    statSatisfactionRate.textContent = "0%";
    statRegionsCount.textContent = "0";
    statTodayResponses.textContent = "0";
    renderCharts([], {}, {});
    renderTable([]);
    return;
  }

  // Bairros/Regiões únicas
  const regionsMap = {};
  const ratingsMap = { "Ótimo / Bom": 0, "Regular": 0, "Ruim / Péssimo": 0 };
  const timelineMap = {};

  const todayStr = new Date().toISOString().split("T")[0];
  let todayCount = 0;
  let positiveCount = 0;

  records.forEach((row) => {
    // Região / Bairro (tenta campos comuns: bairro, regiao, localidade)
    const region = row.bairro || row.regiao || row.cidade || "Não informado";
    regionsMap[region] = (regionsMap[region] || 0) + 1;

    // Avaliação / Satisfação (tenta campos: avaliacao, satisfacao, nota, status)
    const rawRating = (row.avaliacao || row.satisfacao || row.classificacao || "").toString().toLowerCase();
    if (rawRating.includes("otimo") || rawRating.includes("ótimo") || rawRating.includes("bom") || rawRating === "5" || rawRating === "4") {
      ratingsMap["Ótimo / Bom"]++;
      positiveCount++;
    } else if (rawRating.includes("regular") || rawRating === "3") {
      ratingsMap["Regular"]++;
    } else if (rawRating.includes("ruim") || rawRating.includes("pessimo") || rawRating.includes("péssimo") || rawRating === "1" || rawRating === "2") {
      ratingsMap["Ruim / Péssimo"]++;
    } else {
      // Caso seja outro texto ou categórico
      const cat = row.avaliacao || row.resposta || "Geral";
      ratingsMap[cat] = (ratingsMap[cat] || 0) + 1;
      positiveCount += 0.5;
    }

    // Data / Evolução Temporal
    const dateField = row.created_at || row.data || row.data_hora;
    if (dateField) {
      const dateKey = new Date(dateField).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      timelineMap[dateKey] = (timelineMap[dateKey] || 0) + 1;

      if (dateField.startsWith(todayStr)) {
        todayCount++;
      }
    }
  });

  // Atualização dos Cards
  const positivePercentage = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  statSatisfactionRate.textContent = `${positivePercentage}%`;
  statRegionsCount.textContent = Object.keys(regionsMap).length.toString();
  statTodayResponses.textContent = todayCount.toString();

  // Renderizar Gráficos e Tabela
  renderCharts(ratingsMap, regionsMap, timelineMap);
  renderTable(records.slice(0, 5));
}

/**
 * Renderização dos Gráficos com Chart.js seguindo a Paleta de Tons de Azul
 */
function renderCharts(ratingsMap, regionsMap, timelineMap) {
  // Paleta de Azuis Sofisticados
  const brandBlues = [
    "#0B2545", // Azul Petróleo Profundo
    "#134074", // Azul Real Intenso
    "#00B4D8", // Ciano Vibrante
    "#48CAE4", // Azul Claro
    "#90E0EF", // Azul Suave
    "#0077B6"  // Azul Oceano
  ];

  // Configurações Globais do Chart.js
  Chart.defaults.font.family = "'Montserrat', sans-serif";
  Chart.defaults.color = "#64748B";

  // --- Gráfico 1: Distribuição de Avaliações (Doughnut) ---
  const ctxDist = document.getElementById("chartDistribution")?.getContext("2d");
  if (ctxDist) {
    if (chartDistributionInstance) chartDistributionInstance.destroy();
    
    chartDistributionInstance = new Chart(ctxDist, {
      type: "doughnut",
      data: {
        labels: Object.keys(ratingsMap),
        datasets: [{
          data: Object.values(ratingsMap),
          backgroundColor: [brandBlues[0], brandBlues[2], "#E2E8F0"],
          borderWidth: 2,
          borderColor: "#FFFFFF",
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 16,
              font: { size: 12, weight: 500 }
            }
          }
        }
      }
    });
  }

  // --- Gráfico 2: Respostas por Região / Bairro (Bar Horizontal/Vertical) ---
  const ctxReg = document.getElementById("chartRegions")?.getContext("2d");
  if (ctxReg) {
    if (chartRegionsInstance) chartRegionsInstance.destroy();

    const regionLabels = Object.keys(regionsMap).slice(0, 7);
    const regionValues = regionLabels.map(k => regionsMap[k]);

    chartRegionsInstance = new Chart(ctxReg, {
      type: "bar",
      data: {
        labels: regionLabels,
        datasets: [{
          label: "Respostas",
          data: regionValues,
          backgroundColor: brandBlues[1],
          borderRadius: 8,
          maxBarThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#F1F5F9" },
            ticks: { precision: 0 }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // --- Gráfico 3: Linha do Tempo (Line Chart Elegante) ---
  const ctxTime = document.getElementById("chartTimeline")?.getContext("2d");
  if (ctxTime) {
    if (chartTimelineInstance) chartTimelineInstance.destroy();

    const timelineLabels = Object.keys(timelineMap);
    const timelineValues = Object.values(timelineMap);

    const gradient = ctxTime.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, "rgba(0, 180, 216, 0.35)");
    gradient.addColorStop(1, "rgba(0, 180, 216, 0.0)");

    chartTimelineInstance = new Chart(ctxTime, {
      type: "line",
      data: {
        labels: timelineLabels.length ? timelineLabels : ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [{
          label: "Volume Diário de Respostas",
          data: timelineValues.length ? timelineValues : [0, 0, 0, 0, 0, 0, 0],
          fill: true,
          backgroundColor: gradient,
          borderColor: brandBlues[2],
          borderWidth: 3,
          pointBackgroundColor: brandBlues[0],
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#F1F5F9" },
            ticks: { precision: 0 }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}

/**
 * Renderiza as linhas recentes da tabela
 */
function renderTable(rows) {
  if (!recentRecordsTableBody) return;

  if (rows.length === 0) {
    recentRecordsTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="py-8 text-center text-slate-400 font-medium">
          Nenhum registro encontrado na tabela 'respostas_pesquisa'.
        </td>
      </tr>
    `;
    return;
  }

  recentRecordsTableBody.innerHTML = rows.map((row) => {
    const idDisplay = row.id ? `#${String(row.id).slice(0, 6)}` : "#---";
    const dateFormatted = row.created_at ? new Date(row.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Recente";
    const local = row.bairro || row.regiao || row.cidade || "São José";
    const avaliacao = row.avaliacao || row.resposta || row.opiniao || "Registrado";

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3.5 px-6 font-semibold text-slate-900">
          ${idDisplay}
          <span class="block text-xs font-normal text-slate-400">${dateFormatted}</span>
        </td>
        <td class="py-3.5 px-6 font-medium text-slate-700">${local}</td>
        <td class="py-3.5 px-6 text-slate-600 truncate max-w-xs">${avaliacao}</td>
        <td class="py-3.5 px-6 text-right">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Sincronizado
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * Conjunto de demonstração padrão (Mock Data) para visualização imediata caso ainda não haja conexão
 */
function renderFallbackDemoData() {
  updateSyncTime();
  const demoRecords = [
    { id: "101", bairro: "Kobrasol", avaliacao: "Ótimo", created_at: new Date().toISOString() },
    { id: "102", bairro: "Campinas", avaliacao: "Bom", created_at: new Date().toISOString() },
    { id: "103", bairro: "Praia Comprida", avaliacao: "Regular", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "104", bairro: "Barreiros", avaliacao: "Ótimo", created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: "105", bairro: "Forquilhinhas", avaliacao: "Bom", created_at: new Date(Date.now() - 259200000).toISOString() },
  ];
  processAndRenderData(demoRecords);
}
