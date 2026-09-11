/**
 * Radar São José - Dashboard de Mídia & Análise do Instagram
 * Módulo de Inteligência de Notícias e Redes Sociais SJC (10 Canais Oficiais)
 * Integração Supabase + Fallback JSON + Gráficos Chart.js Responsivos + Treemap Editorial
 */

(function () {
  if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
    try {
      Chart.register(ChartDataLabels);
    } catch (e) {}
  }

  let allMidiaRecords = [];
  let filteredMidiaRecords = [];
  let midiaChartInstances = {};
  let currentMidiaPage = 1;
  const MIDIA_PAGE_SIZE = 15;
  let midiaSortColumn = 'engajamento_total';
  let midiaSortOrder = 'desc';

  const THEME_COLORS = {
    brandDark: '#0B2545',
    brandBlue: '#2070aa',
    brandLightBlue: '#57a9db',
    accentCyan: '#00B4D8',
    accentSky: '#48CAE4',
    accentEmerald: '#10B981',
    accentAmber: '#F59E0B',
    accentRose: '#F43F5E',
    accentViolet: '#6366F1',
    accentPurple: '#8B5CF6',
    neutralGray: '#64748B',
    lightBg: '#F8FAFC',
    border: '#E2E8F0'
  };

  const PROFILE_COLORS = {
    'lifeinforma': '#F59E0B',        // Âmbar / Laranja
    'aquivaleoficial': '#EC4899',    // Rosa / Magenta Aqui Vale
    'cbnvale': '#E11D48',            // Vermelho CBN
    'bandvaletv': '#2563EB',         // Azul Royal Band
    'spriomais': '#8B5CF6',          // Roxo SP RIO+
    'noticias.sjcampos': '#10B981',  // Verde Cidade SJC
    'redevanguarda': '#0284C7',      // Azul Globo/Vanguarda
    'jovempansjc': '#EA580C',        // Laranja Jovem Pan
    'vale360news': '#0D9488',        // Teal Vale 360
    'jornalovale': '#D97706'         // Dourado O Vale
  };

  function getProfileColor(profile) {
    if (PROFILE_COLORS[profile]) return PROFILE_COLORS[profile];
    let hash = 0;
    for (let i = 0; i < profile.length; i++) {
      hash = profile.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  const SENTIMENT_COLORS = {
    'Positivo': '#10B981',
    'Neutro': '#64748B',
    'Negativo': '#F43F5E',
    'Polarizado/Debate quente': '#8B5CF6'
  };

  // 1. CARREGAMENTO ULTRA RÁPIDO DOS DADOS
  async function fetchMidiaData() {
    showMidiaLoading(true);
    let data = [];
    let source = "preloaded";

    // 1. Prioridade 1: Dados embutidos instantaneamente na memória (7.543 posts)
    if (typeof window.PRELOADED_MIDIA_DATA !== 'undefined' && Array.isArray(window.PRELOADED_MIDIA_DATA) && window.PRELOADED_MIDIA_DATA.length > 0) {
      data = window.PRELOADED_MIDIA_DATA;
      source = "preloaded_js";
    }

    // 2. Prioridade 2: Carregamento direto do JSON local consolidado caso não esteja embutido
    if (!data || data.length === 0) {
      try {
        const response = await fetch('midia_sjc/analise_midia_sjc.json?v=' + Date.now());
        if (response.ok) {
          data = await response.json();
          source = "local_json";
        }
      } catch (jsonErr) {
        console.warn("[MIDIA] Falha ao carregar JSON local, tentando Supabase:", jsonErr);
      }
    }

    // 3. Prioridade 3: Fallback para o Supabase caso o arquivo local não responda
    if (!data || data.length === 0) {
      try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          const res = await supabaseClient
            .from('analise_midia_sjc')
            .select('*')
            .range(0, 10000);
          if (res && !res.error && res.data && res.data.length > 0) {
            data = res.data;
            source = "supabase";
          }
        }
      } catch (err) {
        console.error("[MIDIA] Erro ao buscar dados do Supabase:", err);
      }
    }

  function fixTextEncoding(str) {
    if (!str || typeof str !== 'string') return str;
    let s = str;
    // Map known double-encoded UTF-8 sequences and corrupted characters
    const textFixMap = {
      'Economia & NegÃ³cios': 'Economia & Negócios',
      'SeguranÃ§a PÃºblica': 'Segurança Pública',
      'PolÃ­tica & GestÃ£o PÃºblica': 'Política & Gestão Pública',
      'SaÃºde PÃºblica': 'Saúde Pública',
      'EducaÃ§Ã£o & Tecnologia': 'Educação & Tecnologia',
      'TrÃ¢nsito & Mobilidade': 'Trânsito & Mobilidade',
      'Cotidiano & Cidade': 'Cotidiano & Cidade',
      'Cultura & Entretenimento': 'Cultura & Entretenimento',
      'Defesa Civil & Clima': 'Defesa Civil & Clima',
      'Esporte': 'Esporte',
      'ComÃ©rcio, IndÃºstria & NegÃ³cios': 'Comércio, Indústria & Negócios',
      'GeraÃ§Ã£o de Empregos & Oportunidades': 'Geração de Empregos & Oportunidades',
      'HistÃ³rias Locais & Utilidade PÃºblica': 'Histórias Locais & Utilidade Pública',
      'Policiamento & OcorrÃªncias Urbanas': 'Policiamento & Ocorrências Urbanas',
      'AdministraÃ§Ã£o Municipal & PolÃ­ticas PÃºblicas': 'Administração Municipal & Políticas Públicas',
      'Impactos e Danos ClimÃ¡ticos': 'Impactos e Danos Climáticos',
      'Estrutura Hospitalar & VacinaÃ§Ã£o': 'Estrutura Hospitalar & Vacinação',
      'EducaÃ§Ã£o, Tecnologia & InovaÃ§Ã£o': 'Educação, Tecnologia & Inovação',
      'EleiÃ§Ãµes & CenÃ¡rio PolÃ­tico': 'Eleições & Cenário Político',
      'Alertas MeteorolÃ³gicos & Tempestades': 'Alertas Meteorológicos & Tempestades',
      'HomicÃ­dios & Crimes Violentos': 'Homicídios & Crimes Violentos',
      'TrÃ¢nsito e OcorrÃªncias em Rodovias': 'Trânsito e Ocorrências em Rodovias',
      'Obras ViÃ¡rias & CirculaÃ§Ã£o': 'Obras Viárias & Circulação',
      'SÃ£o JosÃ© E.C. & Esportes na Cidade': 'São José E.C. & Esportes na Cidade',
      'OperaÃ§Ãµes Policiais & PrisÃµes': 'Operações Policiais & Prisões',
      'Combate ao TrÃ¡fico de Drogas': 'Combate ao Tráfico de Drogas',
      'Concursos PÃºblicos & Carreiras': 'Concursos Públicos & Carreiras',
      'Combate Ã  Dengue & Epidemias': 'Combate à Dengue & Epidemias',
      'Shows, Cultura & Eventos Urbanos': 'Shows, Cultura & Eventos Urbanos',
      'Poder Legislativo & Leis': 'Poder Legislativo & Leis',
      'Transporte Coletivo & Mobilidade': 'Transporte Coletivo & Mobilidade',
      'DescontraÃ­do': 'Descontraído',
      'CrÃ­tico': 'Crítico',
      'PrestaÃ§Ã£o de Contas & Cidadania': 'Prestação de Contas & Cidadania',
      'Debate PolÃ­tico & OpiniÃ£o': 'Debate Político & Opinião',
      'Utilidade PÃºblica & Oportunidade': 'Utilidade Pública & Oportunidade',
      'Torcida & CelebraÃ§Ã£o Local': 'Torcida & Celebração Local',
      'Medo, Luto & comoÃ§Ã£o': 'Medo, Luto & Comoção',
      'IndignaÃ§Ã£o & CobranÃ§a': 'Indignação & Cobrança',
      'Curiosidade & ViralizaÃ§Ã£o': 'Curiosidade & Viralização',
      'TarcÃ­sio de Freitas': 'Tarcísio de Freitas',
      'CSI SÃ£o JosÃ©': 'CSI São José',
      'PolÃ­cia Militar / BAEP': 'Polícia Militar / BAEP'
    };
    if (textFixMap[s]) return textFixMap[s];
    for (const [bad, good] of Object.entries(textFixMap)) {
      if (s.includes(bad)) s = s.split(bad).join(good);
    }
    return s;
  }

  function sanitizeMidiaRecord(r) {
    if (!r) return r;
    const clean = { ...r };
    if (clean['ï»¿id'] !== undefined && clean.id === undefined) {
      clean.id = clean['ï»¿id'];
    }
    ['tema_central', 'subtema', 'tom_noticia', 'sentimento_comentarios', 'gatilho_engajamento', 'entidades_citadas'].forEach(field => {
      if (clean[field]) {
        clean[field] = fixTextEncoding(clean[field]);
      }
    });
    return clean;
  }

  showMidiaLoading(false);

  if (data && data.length > 0) {
    allMidiaRecords = data.map(sanitizeMidiaRecord);
    window.allMidiaRecords = allMidiaRecords;
    filteredMidiaRecords = [...allMidiaRecords];
    window.filteredMidiaRecords = filteredMidiaRecords;
      
      const statusBadge = document.getElementById('midia-data-status-badge');
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Base Conectada (${data.length.toLocaleString('pt-BR')} posts)`;
        statusBadge.className = "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30";
      }

      populateMidiaFilterOptions();
      setTimeout(() => {
        renderMidiaDashboard();
      }, 50);
    } else {
      showMidiaError("Não foi possível carregar os dados de mídia.");
    }
  }

  // Hook disparado na troca de aba
  window.onSwitchToMidiaTab = function() {
    const loadingState = document.getElementById('midia-loading-state');
    const dashboardContent = document.getElementById('midia-dashboard-content');
    
    if (allMidiaRecords && allMidiaRecords.length > 0) {
      if (loadingState) loadingState.classList.add('hidden');
      if (dashboardContent) dashboardContent.classList.remove('hidden');
      populateMidiaFilterOptions();
      setTimeout(() => {
        renderMidiaDashboard();
      }, 50);
    } else {
      fetchMidiaData();
    }
  };

  function showMidiaLoading(show) {
    const loadingState = document.getElementById('midia-loading-state');
    const dashboardContent = document.getElementById('midia-dashboard-content');
    const errorState = document.getElementById('midia-error-state');

    if (loadingState) loadingState.classList.toggle('hidden', !show);
    if (dashboardContent) dashboardContent.classList.toggle('hidden', show);
    if (errorState) errorState.classList.add('hidden');
  }

  function showMidiaError(msg) {
    const loadingState = document.getElementById('midia-loading-state');
    const dashboardContent = document.getElementById('midia-dashboard-content');
    const errorState = document.getElementById('midia-error-state');
    const errorMessage = document.getElementById('midia-error-message');

    if (loadingState) loadingState.classList.add('hidden');
    if (dashboardContent) dashboardContent.classList.add('hidden');
    if (errorState) errorState.classList.remove('hidden');
    if (errorMessage) errorMessage.textContent = msg;
  }

  // 2. POVOAMENTO DOS FILTROS DINÂMICOS
  function populateMidiaFilterOptions() {
    const perfilSelect = document.getElementById('filter-midia-perfil');
    const temaSelect = document.getElementById('filter-midia-tema');
    const sentimentoSelect = document.getElementById('filter-midia-sentimento');
    const tomSelect = document.getElementById('filter-midia-tom');

    const perfis = [...new Set(allMidiaRecords.map(r => r.perfil).filter(Boolean))].sort();
    const temas = [...new Set(allMidiaRecords.map(r => r.tema_central).filter(Boolean))].sort();
    const sentimentos = [...new Set(allMidiaRecords.map(r => r.sentimento_comentarios).filter(Boolean))].sort();
    const tons = [...new Set(allMidiaRecords.map(r => r.tom_noticia).filter(Boolean))].sort();

    if (perfilSelect) {
      perfilSelect.innerHTML = `<option value="">Todos os Perfis (${perfis.length} canais)</option>`;
      perfis.forEach(p => {
        const count = allMidiaRecords.filter(r => r.perfil === p).length;
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `@${p} (${count.toLocaleString('pt-BR')} posts)`;
        perfilSelect.appendChild(opt);
      });
    }

    if (temaSelect) {
      temaSelect.innerHTML = `<option value="">Todos os Temas (${temas.length})</option>`;
      temas.forEach(t => {
        const count = allMidiaRecords.filter(r => r.tema_central === t).length;
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = `${t} (${count.toLocaleString('pt-BR')})`;
        temaSelect.appendChild(opt);
      });
    }

    if (sentimentoSelect) {
      sentimentoSelect.innerHTML = '<option value="">Todos os Sentimentos</option>';
      sentimentos.forEach(s => {
        const count = allMidiaRecords.filter(r => r.sentimento_comentarios === s).length;
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = `${s} (${count.toLocaleString('pt-BR')})`;
        sentimentoSelect.appendChild(opt);
      });
    }

    if (tomSelect) {
      tomSelect.innerHTML = '<option value="">Todos os Tons</option>';
      tons.forEach(t => {
        const count = allMidiaRecords.filter(r => r.tom_noticia === t).length;
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = `${t} (${count.toLocaleString('pt-BR')})`;
        tomSelect.appendChild(opt);
      });
    }
  }

  // 3. APLICAÇÃO DE FILTROS COMBINADOS
  function applyMidiaFilters() {
    const perfil = document.getElementById('filter-midia-perfil')?.value || '';
    const tema = document.getElementById('filter-midia-tema')?.value || '';
    const sentimento = document.getElementById('filter-midia-sentimento')?.value || '';
    const tom = document.getElementById('filter-midia-tom')?.value || '';
    const search = (document.getElementById('filter-midia-search')?.value || '').toLowerCase().trim();

    filteredMidiaRecords = allMidiaRecords.filter(r => {
      if (perfil && r.perfil !== perfil) return false;
      if (tema && r.tema_central !== tema) return false;
      if (sentimento && r.sentimento_comentarios !== sentimento) return false;
      if (tom && r.tom_noticia !== tom) return false;
      if (search) {
        // Normalização sem acentos para busca flexível e precisa
        const norm = (str) => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normSearch = norm(search);

        const matchLegenda = norm(r.legenda || r.caption || '').includes(normSearch);
        const matchTema = norm(r.tema_central || '').includes(normSearch);
        const matchSub = norm(r.subtema || '').includes(normSearch);
        const matchEnt = norm(r.entidades_citadas || '').includes(normSearch);
        const matchPessoas = norm(r.pessoas_citadas || '').includes(normSearch);
        const matchCidades = norm(r.cidades_citadas || '').includes(normSearch);
        const matchGatilho = norm(r.gatilho_engajamento || '').includes(normSearch);
        const matchPerfil = norm(r.perfil || '').includes(normSearch);

        if (!matchLegenda && !matchTema && !matchSub && !matchEnt && !matchPessoas && !matchCidades && !matchGatilho && !matchPerfil) {
          return false;
        }
      }
      return true;
    });

    currentMidiaPage = 1;
    renderMidiaDashboard();
  }

  function resetMidiaFilters() {
    const p = document.getElementById('filter-midia-perfil');
    const t = document.getElementById('filter-midia-tema');
    const s = document.getElementById('filter-midia-sentimento');
    const tm = document.getElementById('filter-midia-tom');
    const q = document.getElementById('filter-midia-search');

    if (p) p.value = '';
    if (t) t.value = '';
    if (s) s.value = '';
    if (tm) tm.value = '';
    if (q) q.value = '';

    filteredMidiaRecords = [...allMidiaRecords];
    currentMidiaPage = 1;
    renderMidiaDashboard();
  }

  // 4. RENDERIZAÇÃO DEFENSIVA DO DASHBOARD
  function renderMidiaDashboard() {
    console.log("[MIDIA] Iniciando renderização do Dashboard de Mídia (" + filteredMidiaRecords.length + " posts)...");
    
    // Garantir que os containers de visualização estejam no estado correto
    const loadingState = document.getElementById('midia-loading-state');
    const dashboardContent = document.getElementById('midia-dashboard-content');
    const errorState = document.getElementById('midia-error-state');

    if (loadingState) loadingState.classList.add('hidden');
    if (dashboardContent) dashboardContent.classList.remove('hidden');
    if (errorState) errorState.classList.add('hidden');

    try { renderMidiaKpiCards(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaKpiCards:", e); }
    try { renderMidiaProfileBarChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaProfileBarChart:", e); }
    try { renderMidiaProfileEngagementChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaProfileEngagementChart:", e); }
    try { renderMidiaThemeDonutChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaThemeDonutChart:", e); }
    try { renderMidiaTriggersHorizontalBarChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaTriggersHorizontalBarChart:", e); }
    try { renderMidiaSentimentGauge(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaSentimentGauge:", e); }
    try { renderMidiaSankeyChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaSankeyChart:", e); }
    try { renderMidiaPeopleChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaPeopleChart:", e); }
    try { renderMidiaCitiesChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaCitiesChart:", e); }
    try { renderMidiaWordCloud(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaWordCloud:", e); }
    try { renderMidiaTable(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaTable:", e); }
    
    console.log("[MIDIA] Renderização de todos os gráficos e tabela concluída!");
  }

  function destroyMidiaChart(chartKey, canvas) {
    if (midiaChartInstances[chartKey]) {
      try { midiaChartInstances[chartKey].destroy(); } catch (e) {}
      delete midiaChartInstances[chartKey];
    }
    if (canvas && typeof Chart !== 'undefined' && typeof Chart.getChart === 'function') {
      try {
        const existing = Chart.getChart(canvas);
        if (existing) existing.destroy();
      } catch (e) {}
    }
  }

  // 5. CARDS DE RESUMO (KPIs)
  function renderMidiaKpiCards() {
    const totalPosts = filteredMidiaRecords.length;
    const totalEngajamento = filteredMidiaRecords.reduce((acc, r) => acc + (Number(r.engajamento_total) || 0), 0);
    const totalLikes = filteredMidiaRecords.reduce((acc, r) => acc + (Number(r.likes) || 0), 0);
    const totalComments = filteredMidiaRecords.reduce((acc, r) => acc + (Number(r.comments) || 0), 0);

    // 1. Perfil Mais Ativo (Volume de Posts)
    const profileCounts = {};
    const profileEng = {};
    filteredMidiaRecords.forEach(r => {
      const p = r.perfil || 'Outro';
      profileCounts[p] = (profileCounts[p] || 0) + 1;
      profileEng[p] = (profileEng[p] || 0) + (Number(r.engajamento_total) || 0);
    });
    const sortedProfilesByCount = Object.entries(profileCounts).sort((a, b) => b[1] - a[1]);
    const topProfile = sortedProfilesByCount[0] || ["N/A", 0];
    const topProfileShare = totalPosts > 0 ? ((topProfile[1] / totalPosts) * 100).toFixed(1) : "0";

    // 2. Perfil Mais Engajado (Maior Engajamento Total)
    const sortedProfilesByEng = Object.entries(profileEng).sort((a, b) => b[1] - a[1]);
    const topEngagedProfile = sortedProfilesByEng[0] || ["N/A", 0];
    const topEngagedCount = profileCounts[topEngagedProfile[0]] || 1;
    const topEngagedAvg = (topEngagedProfile[1] / topEngagedCount).toFixed(0);
    const topEngagedShare = totalEngajamento > 0 ? ((topEngagedProfile[1] / totalEngajamento) * 100).toFixed(1) : "0";

    // 3. Tema Central Mais Abordado
    const themeCounts = {};
    filteredMidiaRecords.forEach(r => {
      themeCounts[r.tema_central] = (themeCounts[r.tema_central] || 0) + 1;
    });
    const sortedThemes = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]);
    const topTheme = sortedThemes[0] || ["N/A", 0];
    const topThemeShare = totalPosts > 0 ? ((topTheme[1] / totalPosts) * 100).toFixed(1) : "0";

    const elTotalPosts = document.getElementById('midia-kpi-total-posts');
    const elTotalEngajamento = document.getElementById('midia-kpi-total-engajamento');
    const elTotalEngBreakdown = document.getElementById('midia-kpi-total-engajamento-breakdown');
    const elAvgEngagement = document.getElementById('midia-kpi-avg-engagement');
    const elAvgEngagementDetails = document.getElementById('midia-kpi-avg-engagement-details');
    const elTopProfile = document.getElementById('midia-kpi-top-profile');
    const elTopProfileDetails = document.getElementById('midia-kpi-top-profile-details');
    const elTopEngagedProfile = document.getElementById('midia-kpi-top-engaged-profile');
    const elTopEngagedProfileDetails = document.getElementById('midia-kpi-top-engaged-profile-details');
    const elTopTheme = document.getElementById('midia-kpi-top-theme');
    const elTopThemeDetails = document.getElementById('midia-kpi-top-theme-details');

    const avg = totalPosts > 0 ? (totalEngajamento / totalPosts).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "0,0";

    if (elTotalPosts) elTotalPosts.textContent = totalPosts.toLocaleString('pt-BR');
    if (elTotalEngajamento) elTotalEngajamento.textContent = totalEngajamento.toLocaleString('pt-BR');
    if (elTotalEngBreakdown) {
      elTotalEngBreakdown.textContent = `${totalLikes.toLocaleString('pt-BR')} likes • ${totalComments.toLocaleString('pt-BR')} com`;
    }

    if (elAvgEngagement) elAvgEngagement.textContent = avg;
    if (elAvgEngagementDetails) {
      const avgLikes = totalPosts > 0 ? (totalLikes / totalPosts).toFixed(0) : "0";
      const avgComms = totalPosts > 0 ? (totalComments / totalPosts).toFixed(0) : "0";
      elAvgEngagementDetails.textContent = `~${avgLikes} likes + ${avgComms} com/post`;
    }

    if (elTopProfile) elTopProfile.textContent = `@${topProfile[0]}`;
    if (elTopProfileDetails) elTopProfileDetails.textContent = `${topProfile[1].toLocaleString('pt-BR')} posts (${topProfileShare}%)`;

    if (elTopEngagedProfile) elTopEngagedProfile.textContent = `@${topEngagedProfile[0]}`;
    if (elTopEngagedProfileDetails) elTopEngagedProfileDetails.textContent = `${topEngagedProfile[1].toLocaleString('pt-BR')} interações (${topEngagedShare}%)`;

    if (elTopTheme) elTopTheme.textContent = topTheme[0];
    if (elTopThemeDetails) elTopThemeDetails.textContent = `${topTheme[1].toLocaleString('pt-BR')} posts (${topThemeShare}%)`;

    // Sidebar counts
    const elSidebarCount = document.getElementById('midia-filtered-records-count');
    const elSidebarTotal = document.getElementById('midia-total-base-count');
    if (elSidebarCount) elSidebarCount.textContent = totalPosts.toLocaleString('pt-BR');
    if (elSidebarTotal) elSidebarTotal.textContent = allMidiaRecords.length.toLocaleString('pt-BR');
  }

  // 6. GRÁFICO DE BARRAS VERTICAIS: VOLUME DE POSTAGENS POR PERFIL
  function renderMidiaProfileBarChart() {
    const canvas = document.getElementById('chart-midia-profiles');
    if (!canvas) return;
    destroyMidiaChart('profileBar', canvas);

    const profileData = {};
    const profileLikes = {};
    const profileComments = {};

    filteredMidiaRecords.forEach(r => {
      const p = r.perfil || 'Outro';
      profileData[p] = (profileData[p] || 0) + 1;
      profileLikes[p] = (profileLikes[p] || 0) + (Number(r.likes) || 0);
      profileComments[p] = (profileComments[p] || 0) + (Number(r.comments) || 0);
    });

    const labels = Object.keys(profileData).sort((a, b) => profileData[b] - profileData[a]);
    const postCounts = labels.map(p => profileData[p]);
    const backgroundColors = labels.map(p => getProfileColor(p));

    const ctx = canvas.getContext('2d');
    midiaChartInstances['profileBar'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(l => `@${l}`),
        datasets: [{
          label: 'Total de Postagens',
          data: postCounts,
          backgroundColor: backgroundColors,
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 44,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 25, bottom: 5 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            titleFont: { family: 'Montserrat', size: 12, weight: '700' },
            bodyFont: { family: 'Montserrat', size: 11 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              afterLabel: function (context) {
                const pKey = labels[context.dataIndex];
                const likes = profileLikes[pKey] || 0;
                const comms = profileComments[pKey] || 0;
                const total = likes + comms;
                return [
                  `Engajamento Total: ${total.toLocaleString('pt-BR')}`,
                  `Likes: ${likes.toLocaleString('pt-BR')} | Comentários: ${comms.toLocaleString('pt-BR')}`
                ];
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            offset: 4,
            color: '#0B2545',
            font: { family: 'Montserrat', weight: 'bold', size: 11 },
            formatter: (val) => val.toLocaleString('pt-BR')
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Montserrat', weight: '600', size: 10 },
              color: '#334155',
              maxRotation: 45,
              minRotation: 25
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: {
              font: { family: 'Montserrat', size: 10 },
              color: '#64748B',
              precision: 0
            }
          }
        }
      }
    });
  }

  // 6.2 GRÁFICO DE BARRAS HORIZONTAIS: ENGAJAMENTO TOTAL POR PÁGINA
  function renderMidiaProfileEngagementChart() {
    const canvas = document.getElementById('chart-midia-profile-engagement');
    if (!canvas) return;
    destroyMidiaChart('profileEngagement', canvas);

    const profileEng = {};
    const profileLikes = {};
    const profileComments = {};
    const profileCounts = {};

    filteredMidiaRecords.forEach(r => {
      const p = r.perfil || 'Outro';
      const eng = Number(r.engajamento_total) || 0;
      profileEng[p] = (profileEng[p] || 0) + eng;
      profileLikes[p] = (profileLikes[p] || 0) + (Number(r.likes) || 0);
      profileComments[p] = (profileComments[p] || 0) + (Number(r.comments) || 0);
      profileCounts[p] = (profileCounts[p] || 0) + 1;
    });

    const labels = Object.keys(profileEng).sort((a, b) => profileEng[b] - profileEng[a]);
    const engCounts = labels.map(p => profileEng[p]);
    const backgroundColors = labels.map(p => getProfileColor(p));

    const ctx = canvas.getContext('2d');
    midiaChartInstances['profileEngagement'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(l => `@${l}`),
        datasets: [{
          label: 'Engajamento Total',
          data: engCounts,
          backgroundColor: backgroundColors,
          borderRadius: 8,
          maxBarThickness: 24,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 55 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            titleFont: { family: 'Montserrat', size: 12, weight: '700' },
            bodyFont: { family: 'Montserrat', size: 11 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              afterLabel: function (context) {
                const pKey = labels[context.dataIndex];
                const likes = profileLikes[pKey] || 0;
                const comms = profileComments[pKey] || 0;
                const count = profileCounts[pKey] || 1;
                const avg = (engCounts[context.dataIndex] / count).toFixed(0);
                return [
                  `Curtidas: ${likes.toLocaleString('pt-BR')}`,
                  `Comentários: ${comms.toLocaleString('pt-BR')}`,
                  `Média por Post: ${avg} interações`
                ];
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 4,
            color: '#0B2545',
            font: { family: 'Montserrat', weight: 'bold', size: 10 },
            formatter: (val) => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toLocaleString('pt-BR')
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: { font: { family: 'Montserrat', size: 10 }, color: '#64748B' }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Montserrat', weight: '600', size: 11 }, color: '#1E293B' }
          }
        }
      }
    });
  }

  // 7. GRÁFICO DE ROSCA: DISTRIBUIÇÃO DO TEMA CENTRAL
  function renderMidiaThemeDonutChart() {
    const canvas = document.getElementById('chart-midia-themes');
    if (!canvas) return;
    destroyMidiaChart('themeDonut', canvas);

    const themeMap = {};
    filteredMidiaRecords.forEach(r => {
      const t = r.tema_central || 'Outros';
      themeMap[t] = (themeMap[t] || 0) + 1;
    });

    const sorted = Object.entries(themeMap).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(s => s[0]);
    const dataVals = sorted.map(s => s[1]);
    const total = dataVals.reduce((a, b) => a + b, 0);

    const palette = [
      '#0B2545', '#F43F5E', '#10B981', '#F59E0B',
      '#00B4D8', '#8B5CF6', '#EC4899', '#065F46',
      '#64748B', '#475569'
    ];

    const ctx = canvas.getContext('2d');
    midiaChartInstances['themeDonut'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: palette.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        layout: { padding: 10 },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { family: 'Montserrat', size: 10, weight: '600' },
              color: '#1E293B',
              boxWidth: 10,
              boxHeight: 10,
              padding: 6
            }
          },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            callbacks: {
              label: function (ctx) {
                const val = ctx.raw || 0;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
                return ` ${ctx.label}: ${val.toLocaleString('pt-BR')} posts (${pct}%)`;
              }
            }
          },
          datalabels: {
            color: '#FFFFFF',
            font: { family: 'Montserrat', weight: 'bold', size: 10 },
            formatter: (val) => {
              const pct = total > 0 ? (val / total) * 100 : 0;
              return pct >= 5 ? `${pct.toFixed(0)}%` : '';
            }
          }
        }
      }
    });
  }

  // 8. GRÁFICO DE BARRAS HORIZONTAIS: GATILHOS DE ENGAJAMENTO (POR INTERAÇÕES TOTAIS)
  function renderMidiaTriggersHorizontalBarChart() {
    const canvas = document.getElementById('chart-midia-triggers');
    if (!canvas) return;
    destroyMidiaChart('triggersBar', canvas);

    const triggerCounts = {};
    const triggerEng = {};

    filteredMidiaRecords.forEach(r => {
      const g = r.gatilho_engajamento || 'Outros';
      triggerCounts[g] = (triggerCounts[g] || 0) + 1;
      triggerEng[g] = (triggerEng[g] || 0) + (Number(r.engajamento_total) || 0);
    });

    // Ordenar por volume de engajamento total
    const sorted = Object.entries(triggerEng).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const labels = sorted.map(s => s[0]);
    const dataEng = sorted.map(s => s[1]);
    const totalEngagement = dataEng.reduce((a, b) => a + b, 0);

    const triggerColors = [
      '#00B4D8', '#6366F1', '#10B981', '#F43F5E',
      '#F59E0B', '#EC4899', '#8B5CF6', '#64748B'
    ];

    const ctx = canvas.getContext('2d');
    midiaChartInstances['triggersBar'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total de Engajamento',
          data: dataEng,
          backgroundColor: triggerColors.slice(0, labels.length),
          borderRadius: 8,
          maxBarThickness: 24,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 80, left: 10 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            callbacks: {
              label: function (context) {
                const val = context.raw || 0;
                const pct = totalEngagement > 0 ? ((val / totalEngagement) * 100).toFixed(1) : 0;
                return ` Engajamento Total: ${val.toLocaleString('pt-BR')} interações (${pct}%)`;
              },
              afterLabel: function (context) {
                const g = labels[context.dataIndex];
                const posts = triggerCounts[g] || 0;
                const eng = dataEng[context.dataIndex] || 0;
                const avg = posts > 0 ? (eng / posts).toFixed(0) : 0;
                return [
                  `Volume: ${posts.toLocaleString('pt-BR')} publicações`,
                  `Média: ~${Number(avg).toLocaleString('pt-BR')} interações por post`
                ];
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 6,
            color: '#0B2545',
            font: { family: 'Montserrat', weight: 'bold', size: 10 },
            formatter: (val) => {
              const pct = totalEngagement > 0 ? ((val / totalEngagement) * 100).toFixed(1) : 0;
              if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M (${pct}%)`;
              if (val >= 1000) return `${(val / 1000).toFixed(1)}k (${pct}%)`;
              return `${val} (${pct}%)`;
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: {
              font: { family: 'Montserrat', size: 10 },
              color: '#64748B',
              callback: (v) => {
                if (v >= 1000000) return (v / 1000000) + 'M';
                if (v >= 1000) return (v / 1000) + 'k';
                return v;
              }
            }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Montserrat', weight: '600', size: 11 }, color: '#1E293B' }
          }
        }
      }
    });
  }

  // 9. MEDIDOR E PROPORÇÃO DE SENTIMENTO DOS COMENTÁRIOS
  function renderMidiaSentimentGauge() {
    const total = filteredMidiaRecords.length;
    const sentMap = {
      'Positivo': 0,
      'Neutro': 0,
      'Negativo': 0,
      'Polarizado/Debate quente': 0
    };

    filteredMidiaRecords.forEach(r => {
      const s = r.sentimento_comentarios;
      if (sentMap[s] !== undefined) {
        sentMap[s]++;
      } else {
        sentMap['Neutro']++;
      }
    });

    const pos = sentMap['Positivo'];
    const neu = sentMap['Neutro'];
    const neg = sentMap['Negativo'];
    const pol = sentMap['Polarizado/Debate quente'];

    const posPct = total > 0 ? ((pos / total) * 100).toFixed(1) : "0";
    const neuPct = total > 0 ? ((neu / total) * 100).toFixed(1) : "0";
    const negPct = total > 0 ? ((neg / total) * 100).toFixed(1) : "0";
    const polPct = total > 0 ? ((pol / total) * 100).toFixed(1) : "0";

    const barPos = document.getElementById('sent-bar-positivo');
    const barNeu = document.getElementById('sent-bar-neutro');
    const barNeg = document.getElementById('sent-bar-negativo');
    const barPol = document.getElementById('sent-bar-polarizado');

    if (barPos) { barPos.style.width = `${posPct}%`; barPos.title = `Positivo: ${posPct}% (${pos})`; }
    if (barNeu) { barNeu.style.width = `${neuPct}%`; barNeu.title = `Neutro: ${neuPct}% (${neu})`; }
    if (barNeg) { barNeg.style.width = `${negPct}%`; barNeg.title = `Negativo: ${negPct}% (${neg})`; }
    if (barPol) { barPol.style.width = `${polPct}%`; barPol.title = `Polarizado: ${polPct}% (${pol})`; }

    const txtPos = document.getElementById('sent-txt-positivo');
    const txtNeu = document.getElementById('sent-txt-neutro');
    const txtNeg = document.getElementById('sent-txt-negativo');
    const txtPol = document.getElementById('sent-txt-polarizado');

    if (txtPos) txtPos.textContent = `${pos.toLocaleString('pt-BR')} (${posPct}%)`;
    if (txtNeu) txtNeu.textContent = `${neu.toLocaleString('pt-BR')} (${neuPct}%)`;
    if (txtNeg) txtNeg.textContent = `${neg.toLocaleString('pt-BR')} (${negPct}%)`;
    if (txtPol) txtPol.textContent = `${pol.toLocaleString('pt-BR')} (${polPct}%)`;
  }

  // 10. DIAGRAMA DE SANKEY INTERATIVO: TEMA EDITORIAL -> TOM DA NOTÍCIA
  const THEME_PALETTE = {
    'Segurança Pública': '#0B2545',
    'Cotidiano & Cidade': '#0284C7',
    'Política & Gestão Pública': '#10B981',
    'Educação & Tecnologia': '#F59E0B',
    'Trânsito & Mobilidade': '#00B4D8',
    'Saúde Pública': '#8B5CF6',
    'Economia & Negócios': '#EC4899',
    'Cultura & Entretenimento': '#065F46',
    'Defesa Civil & Clima': '#64748B',
    'Esporte': '#334155'
  };

  const TONE_PALETTE = {
    'Informativo': '#0284C7',
    'Alerta': '#EF4444',
    'Comemorativo': '#10B981',
    'Crítico': '#F59E0B',
    'Descontraído': '#8B5CF6',
    'Institucional': '#0B2545',
    'Sensacionalista': '#F43F5E',
    'Opinativo': '#64748B'
  };

  function renderMidiaSankeyChart() {
    const canvas = document.getElementById('chart-midia-sankey');
    if (!canvas) return;
    destroyMidiaChart('sankeyFlow', canvas);

    const flowMatrix = {};
    const themeTotals = {};
    const toneTotals = {};

    filteredMidiaRecords.forEach(r => {
      const theme = r.tema_central || 'Outro';
      const tone = r.tom_noticia || 'Informativo';
      const eng = Number(r.engajamento_total) || 0;

      const key = `${theme}|||${tone}`;
      if (!flowMatrix[key]) {
        flowMatrix[key] = { from: theme, to: tone, flow: 0, engagement: 0 };
      }
      flowMatrix[key].flow += 1;
      flowMatrix[key].engagement += eng;

      themeTotals[theme] = (themeTotals[theme] || 0) + 1;
      toneTotals[tone] = (toneTotals[tone] || 0) + 1;
    });

    const flowData = Object.values(flowMatrix).filter(f => f.flow > 0);

    if (flowData.length === 0) {
      return;
    }

    // Gerar paleta de cores para cada nó
    const colorForNode = (nodeName) => {
      if (TONE_PALETTE[nodeName]) return TONE_PALETTE[nodeName];
      if (THEME_PALETTE[nodeName]) return THEME_PALETTE[nodeName];
      return '#2070aa';
    };

    const ctx = canvas.getContext('2d');
    midiaChartInstances['sankeyFlow'] = new Chart(ctx, {
      type: 'sankey',
      data: {
        datasets: [{
          data: flowData,
          colorFrom: (c) => colorForNode(c.dataset.data[c.dataIndex].from),
          colorTo: (c) => colorForNode(c.dataset.data[c.dataIndex].to),
          colorMode: 'gradient',
          alpha: 0.55,
          borderWidth: 0,
          nodeWidth: 18,
          nodePadding: 16,
          labels: {
            font: {
              family: 'Montserrat',
              size: 11,
              weight: 'bold'
            },
            color: '#0B2545'
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            padding: 12,
            titleFont: { family: 'Montserrat', size: 12, weight: 'bold' },
            bodyFont: { family: 'Montserrat', size: 11 },
            callbacks: {
              title: function (items) {
                if (!items || items.length === 0) return '';
                const item = items[0];
                const raw = item.raw;
                if (raw && raw.from && raw.to) {
                  return `${raw.from} ➔ Tom: ${raw.to}`;
                }
                return item.label || '';
              },
              label: function (context) {
                const raw = context.raw;
                if (raw && raw.flow !== undefined) {
                  const posts = raw.flow;
                  const eng = raw.engagement || 0;
                  const avg = posts > 0 ? (eng / posts).toFixed(0) : 0;
                  return [
                    `Volume: ${posts.toLocaleString('pt-BR')} publicações`,
                    `Engajamento Total: ${eng.toLocaleString('pt-BR')} interações`,
                    `Média: ~${Number(avg).toLocaleString('pt-BR')} interações por post`
                  ];
                }
                return `Volume: ${context.formattedValue}`;
              }
            }
          }
        }
      }
    });
  }

  // 11. GRÁFICO DE BARRAS: PESSOAS / FIGURAS PÚBLICAS MAIS CITADAS
  function renderMidiaPeopleChart() {
    const canvas = document.getElementById('chart-midia-people');
    if (!canvas) return;
    destroyMidiaChart('peopleBar', canvas);

    const peopleCounts = {};
    const peopleEng = {};

    filteredMidiaRecords.forEach(r => {
      const eng = Number(r.engajamento_total) || 0;
      if (r.pessoas_citadas) {
        const list = String(r.pessoas_citadas).split(',');
        list.forEach(p => {
          const clean = p.trim();
          if (clean) {
            peopleCounts[clean] = (peopleCounts[clean] || 0) + 1;
            peopleEng[clean] = (peopleEng[clean] || 0) + eng;
          }
        });
      }
    });

    const sorted = Object.entries(peopleCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const labels = sorted.map(s => s[0]);
    const dataCounts = sorted.map(s => s[1]);
    const total = dataCounts.reduce((a, b) => a + b, 0);

    const peopleColors = [
      '#0B2545', '#0284C7', '#10B981', '#F59E0B',
      '#8B5CF6', '#F43F5E', '#00B4D8', '#64748B'
    ];

    const ctx = canvas.getContext('2d');
    midiaChartInstances['peopleBar'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Menções em Posts',
          data: dataCounts,
          backgroundColor: peopleColors.slice(0, labels.length),
          borderRadius: 8,
          maxBarThickness: 22,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 80, left: 10 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            callbacks: {
              label: function (context) {
                const val = context.raw || 0;
                const totalBase = filteredMidiaRecords.length;
                const pct = totalBase > 0 ? ((val / totalBase) * 100).toFixed(1) : 0;
                return ` Menções: ${val.toLocaleString('pt-BR')} posts (${pct}% do total)`;
              },
              afterLabel: function (context) {
                const p = labels[context.dataIndex];
                const eng = peopleEng[p] || 0;
                const posts = dataCounts[context.dataIndex] || 1;
                const avg = (eng / posts).toFixed(0);
                return [
                  `Total de Interações: ${eng.toLocaleString('pt-BR')}`,
                  `Média: ~${Number(avg).toLocaleString('pt-BR')} interações por post`
                ];
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 4,
            color: '#0B2545',
            font: { family: 'Montserrat', weight: 'bold', size: 10 },
            formatter: (val) => {
              const totalBase = filteredMidiaRecords.length;
              const pct = totalBase > 0 ? ((val / totalBase) * 100).toFixed(1) : 0;
              return `${val.toLocaleString('pt-BR')} (${pct}%)`;
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: { font: { family: 'Montserrat', size: 10 }, color: '#64748B', precision: 0 }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Montserrat', weight: '600', size: 11 }, color: '#1E293B' }
          }
        }
      }
    });
  }

  // 12. GRÁFICO DE BARRAS: CIDADES / MUNICÍPIOS MAIS CITADOS
  function renderMidiaCitiesChart() {
    const canvas = document.getElementById('chart-midia-cities');
    if (!canvas) return;
    destroyMidiaChart('citiesBar', canvas);

    const cityCounts = {};
    const cityEng = {};

    filteredMidiaRecords.forEach(r => {
      const eng = Number(r.engajamento_total) || 0;
      if (r.cidades_citadas) {
        const list = String(r.cidades_citadas).split(',');
        list.forEach(c => {
          const clean = c.trim();
          if (clean) {
            cityCounts[clean] = (cityCounts[clean] || 0) + 1;
            cityEng[clean] = (cityEng[clean] || 0) + eng;
          }
        });
      }
    });

    const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const labels = sorted.map(s => s[0]);
    const dataCounts = sorted.map(s => s[1]);
    const total = dataCounts.reduce((a, b) => a + b, 0);

    const cityColors = [
      '#00B4D8', '#2070aa', '#10B981', '#F59E0B',
      '#6366F1', '#EC4899', '#8B5CF6', '#64748B'
    ];

    const ctx = canvas.getContext('2d');
    midiaChartInstances['citiesBar'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Menções em Notícias',
          data: dataCounts,
          backgroundColor: cityColors.slice(0, labels.length),
          borderRadius: 8,
          maxBarThickness: 22,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 85, left: 10 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            callbacks: {
              label: function (context) {
                const val = context.raw || 0;
                const totalBase = filteredMidiaRecords.length;
                const pct = totalBase > 0 ? ((val / totalBase) * 100).toFixed(1) : 0;
                return ` Menções: ${val.toLocaleString('pt-BR')} notícias (${pct}% do total)`;
              },
              afterLabel: function (context) {
                const c = labels[context.dataIndex];
                const eng = cityEng[c] || 0;
                const posts = dataCounts[context.dataIndex] || 1;
                const avg = (eng / posts).toFixed(0);
                return [
                  `Total de Interações: ${eng.toLocaleString('pt-BR')}`,
                  `Média: ~${Number(avg).toLocaleString('pt-BR')} interações por post`
                ];
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 4,
            color: '#0B2545',
            font: { family: 'Montserrat', weight: 'bold', size: 10 },
            formatter: (val) => {
              const totalBase = filteredMidiaRecords.length;
              const pct = totalBase > 0 ? ((val / totalBase) * 100).toFixed(1) : 0;
              return `${val.toLocaleString('pt-BR')} (${pct}%)`;
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: { font: { family: 'Montserrat', size: 10 }, color: '#64748B', precision: 0 }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Montserrat', weight: '600', size: 11 }, color: '#1E293B' }
          }
        }
      }
    });
  }

  // 13. NUVEM DE PALAVRAS E TERMOS MAIS CITADOS NAS LEGENDAS
  function renderMidiaWordCloud() {
    const container = document.getElementById('midia-wordcloud-container');
    if (!container) return;

    const termCounts = {};
    const termEngagement = {};
    const termCategory = {};

    filteredMidiaRecords.forEach(r => {
      const eng = Number(r.engajamento_total) || 0;

      // 1. Entidades citadas
      if (r.entidades_citadas) {
        const ents = String(r.entidades_citadas).split(',');
        ents.forEach(e => {
          const clean = e.trim();
          if (clean && clean !== 'nan' && clean !== 'Geral SJC') {
            termCounts[clean] = (termCounts[clean] || 0) + 1;
            termEngagement[clean] = (termEngagement[clean] || 0) + eng;
            termCategory[clean] = 'entidade';
          }
        });
      }

      // 2. Subtemas e palavras-chave editoriais
      if (r.subtema) {
        const parts = String(r.subtema).replace('&', ',').split(',');
        parts.forEach(p => {
          const clean = p.trim();
          if (clean && clean.length > 3) {
            termCounts[clean] = (termCounts[clean] || 0) + 1;
            termEngagement[clean] = (termEngagement[clean] || 0) + eng;
            if (!termCategory[clean]) termCategory[clean] = 'subtema';
          }
        });
      }
    });

    const sortedTerms = Object.entries(termCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 36);

    if (sortedTerms.length === 0) {
      container.innerHTML = '<div class="p-8 text-center text-xs text-slate-400 font-semibold">Nenhum termo encontrado para os filtros atuais.</div>';
      return;
    }

    const maxCount = sortedTerms[0][1];
    const minCount = sortedTerms[sortedTerms.length - 1][1];
    const range = Math.max(1, maxCount - minCount);

    const activeSearch = (document.getElementById('midia-search-input')?.value || '').trim().toLowerCase();

    // Paleta de estilos por intensidade/categoria
    const tagStyles = [
      { bg: 'bg-brand-900 text-white border-brand-950 shadow-md', size: 'text-base sm:text-lg font-black' },
      { bg: 'bg-brand-600 text-white border-brand-700 shadow-sm', size: 'text-sm sm:text-base font-extrabold' },
      { bg: 'bg-accent-cyan/15 text-brand-900 border-accent-cyan/40 hover:bg-accent-cyan hover:text-white', size: 'text-xs sm:text-sm font-bold' },
      { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-500 hover:text-white', size: 'text-xs sm:text-sm font-bold' },
      { bg: 'bg-violet-50 text-violet-900 border-violet-200 hover:bg-violet-600 hover:text-white', size: 'text-xs font-semibold' },
      { bg: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-800 hover:text-white', size: 'text-[11px] font-medium' }
    ];

    container.innerHTML = sortedTerms.map(([term, count], index) => {
      const normalizedScore = (count - minCount) / range;
      let styleIdx = 5;
      if (normalizedScore > 0.75) styleIdx = 0;
      else if (normalizedScore > 0.50) styleIdx = 1;
      else if (normalizedScore > 0.35) styleIdx = 2;
      else if (normalizedScore > 0.20) styleIdx = 3;
      else if (normalizedScore > 0.10) styleIdx = 4;

      const style = tagStyles[styleIdx];
      const isFiltered = activeSearch && term.toLowerCase().includes(activeSearch);
      const totalEng = termEngagement[term] || 0;

      return `
        <button
          type="button"
          onclick="window.filterByWordCloudTerm('${term.replace(/'/g, "\\'")}')"
          title="${term} • ${count.toLocaleString('pt-BR')} posts • ${totalEng.toLocaleString('pt-BR')} interações • Clique para filtrar"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer select-none ${style.bg} ${style.size} ${isFiltered ? 'ring-2 ring-brand-600 ring-offset-1 font-black shadow-lg scale-105' : ''}"
        >
          <span>${term}</span>
          <span class="text-[9px] opacity-75 font-mono">(${count})</span>
        </button>
      `;
    }).join('');
  }

  // Filtrar posts diretamente ao clicar em uma palavra da nuvem
  window.filterByWordCloudTerm = function(term) {
    const searchInput = document.getElementById('midia-search-input');
    if (!searchInput) return;
    if (searchInput.value.trim().toLowerCase() === term.toLowerCase()) {
      searchInput.value = '';
    } else {
      searchInput.value = term;
    }
    currentMidiaPage = 1;
    applyMidiaFilters();
    
    // Rolar suavemente até a tabela de posts
    const tableEl = document.getElementById('midia-table-body');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 12. TABELA INTERATIVA COM PAGINAÇÃO
  function renderMidiaTable() {
    const tbody = document.getElementById('midia-table-body');
    const paginationInfo = document.getElementById('midia-pagination-info');
    const btnPrev = document.getElementById('midia-btn-prev-page');
    const btnNext = document.getElementById('midia-btn-next-page');

    if (!tbody) return;

    // Sorting
    const sorted = [...filteredMidiaRecords].sort((a, b) => {
      let valA = a[midiaSortColumn];
      let valB = b[midiaSortColumn];

      if (midiaSortColumn === 'engajamento_total' || midiaSortColumn === 'likes' || midiaSortColumn === 'comments') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return midiaSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return midiaSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = sorted.length;
    const totalPages = Math.ceil(total / MIDIA_PAGE_SIZE) || 1;
    if (currentMidiaPage > totalPages) currentMidiaPage = totalPages;
    if (currentMidiaPage < 1) currentMidiaPage = 1;

    const startIdx = (currentMidiaPage - 1) * MIDIA_PAGE_SIZE;
    const pageRecords = sorted.slice(startIdx, startIdx + MIDIA_PAGE_SIZE);

    if (paginationInfo) {
      const endIdx = Math.min(startIdx + MIDIA_PAGE_SIZE, total);
      paginationInfo.textContent = `Mostrando ${total > 0 ? startIdx + 1 : 0} a ${endIdx} de ${total.toLocaleString('pt-BR')} posts`;
    }

    if (btnPrev) btnPrev.disabled = (currentMidiaPage <= 1);
    if (btnNext) btnNext.disabled = (currentMidiaPage >= totalPages);

    if (pageRecords.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="p-8 text-center text-xs text-slate-400 font-semibold">
            Nenhuma publicação encontrada para os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = pageRecords.map((r, idx) => {
      const pColor = getProfileColor(r.perfil);
      const sentColor = SENTIMENT_COLORS[r.sentimento_comentarios] || '#64748B';
      const eng = Number(r.engajamento_total) || 0;
      const likes = Number(r.likes) || 0;
      const comms = Number(r.comments) || 0;

      // Format Date
      let formattedDate = r.timestamp_brasilia || r.timestamp_utc || '-';
      if (formattedDate && formattedDate.length >= 16) {
        formattedDate = formattedDate.replace('T', ' ').substring(0, 16);
      }

      const postUrl = r.url_post || `https://www.instagram.com/${r.perfil}/`;
      
      const fotoHtml = r.foto_url ? `
        <a href="${postUrl}" target="_blank" rel="noopener noreferrer" title="Abrir publicação original no Instagram" class="group/thumb relative block w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs hover:shadow-md transition-all mx-auto">
          <img 
            src="${r.foto_url}" 
            alt="Foto do post @${r.perfil}" 
            loading="lazy" 
            class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
            onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-gradient-to-tr from-rose-500/10 to-amber-500/10 text-rose-500 text-sm\\'><i class=\\'fa-brands fa-instagram\\'></i></div>'"
          />
          <div class="absolute inset-0 bg-brand-950/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white text-[10px] transition-opacity">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </div>
        </a>
      ` : `
        <a href="${postUrl}" target="_blank" rel="noopener noreferrer" title="Abrir publicação no Instagram" class="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors mx-auto">
          <i class="fa-brands fa-instagram text-base"></i>
        </a>
      `;

      const safeLegenda = (r.legenda || r.caption || '').replace(/"/g, '&quot;');
      const legendaDisplay = r.legenda || r.caption ? `
        <p class="text-[10px] text-slate-700 leading-snug line-clamp-2 font-normal" title="${safeLegenda}">
          ${r.legenda || r.caption}
        </p>
      ` : `<span class="text-[10px] text-slate-400 italic">-</span>`;

      const fotoCompact = r.foto_url ? `
        <a href="${postUrl}" target="_blank" rel="noopener noreferrer" title="Abrir publicação original" class="group/thumb relative block w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs hover:shadow-md transition-all mx-auto">
          <img 
            src="${r.foto_url}" 
            alt="Foto do post @${r.perfil}" 
            loading="lazy" 
            class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
            onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-100 text-rose-500 text-xs\\'><i class=\\'fa-brands fa-instagram\\'></i></div>'"
          />
        </a>
      ` : `
        <a href="${postUrl}" target="_blank" rel="noopener noreferrer" title="Abrir publicação" class="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors mx-auto">
          <i class="fa-brands fa-instagram text-xs"></i>
        </a>
      `;

      return `
        <tr class="hover:bg-slate-50 transition-colors text-[11px]">
          <!-- 1. Foto Miniatura -->
          <td class="px-3 py-2 text-center">
            ${fotoCompact}
          </td>

          <!-- 2. Perfil -->
          <td class="px-3 py-2 whitespace-nowrap">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${pColor};"></span>
              <span class="font-bold text-slate-900 text-[11px]">@${r.perfil}</span>
            </div>
          </td>

          <!-- 3. Data/Hora -->
          <td class="px-3 py-2 whitespace-nowrap text-slate-500 font-mono text-[10px]">
            ${formattedDate}
          </td>

          <!-- 4. Engajamento -->
          <td class="px-3 py-2 text-right whitespace-nowrap">
            <span class="font-black text-brand-950 block text-xs">${eng.toLocaleString('pt-BR')}</span>
            <span class="text-[9px] text-slate-400 font-medium">${likes.toLocaleString('pt-BR')} l &bull; ${comms.toLocaleString('pt-BR')} c</span>
          </td>

          <!-- 5. Tema & Subtema -->
          <td class="px-3 py-2 max-w-[160px]">
            <span class="px-1.5 py-0.5 rounded bg-brand-50 text-brand-900 font-bold text-[10px] border border-brand-200 inline-block truncate max-w-full">
              ${r.tema_central || 'Geral'}
            </span>
            <p class="text-[10px] text-slate-500 truncate" title="${r.subtema || ''}">
              ${r.subtema || '-'}
            </p>
          </td>

          <!-- 6. Legenda -->
          <td class="px-3 py-2 max-w-[200px]">
            ${legendaDisplay}
          </td>

          <!-- 7. Tom -->
          <td class="px-3 py-2 whitespace-nowrap text-center">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              ${r.tom_noticia || 'Informativo'}
            </span>
          </td>

          <!-- 8. Sentimento -->
          <td class="px-3 py-2 whitespace-nowrap text-center">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold cursor-help" style="color: ${sentColor}; background-color: ${sentColor}15; border: 1px solid ${sentColor}30;" title="${r.comentarios_texto ? 'Amostra de comentários:\n' + r.comentarios_texto.split(' || ').join('\n• ') : 'Sentimento derivado do engajamento e contexto'}">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sentColor};"></span>
              ${r.sentimento_comentarios || 'Neutro'}
            </span>
          </td>

          <!-- 9. Entidades & Link -->
          <td class="px-3 py-2 max-w-[140px]">
            <div class="space-y-0.5">
              <span class="text-[10px] font-semibold text-slate-700 truncate block" title="${r.entidades_citadas || ''}">
                ${r.entidades_citadas || '-'}
              </span>
              <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[10px] font-bold text-brand-600 hover:underline">
                <i class="fa-solid fa-arrow-up-right-from-square text-[8px]"></i> Ver post
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 12. EXPORTAÇÕES (CSV & JSON)
  function exportMidiaCSV() {
    if (filteredMidiaRecords.length === 0) return;
    const headers = ['id', 'perfil', 'timestamp_brasilia', 'likes', 'comments', 'engajamento_total', 'tema_central', 'subtema', 'legenda', 'tom_noticia', 'sentimento_comentarios', 'comentarios_texto', 'gatilho_engajamento', 'pessoas_citadas', 'cidades_citadas', 'entidades_citadas', 'url_post'];
    const rows = filteredMidiaRecords.map(r => headers.map(h => `"${(r[h] || '').toString().replace(/"/g, '""')}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analise_midia_sjc_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportMidiaJSON() {
    if (filteredMidiaRecords.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredMidiaRecords, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `analise_midia_sjc_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 13. MODAL DE COMUNIDADE & COMENTARISTAS
  let communityDataLoaded = false;
  async function loadCommunityModalData() {
    if (typeof window.PRELOADED_COMUNIDADE_DATA !== 'undefined' && window.PRELOADED_COMUNIDADE_DATA) {
      renderCommunityModalContent(window.PRELOADED_COMUNIDADE_DATA);
      communityDataLoaded = true;
      return;
    }
    try {
      const response = await fetch('midia_sjc/comunidade_comentarios_sjc.json?t=' + Date.now());
      if (response.ok) {
        const cData = await response.json();
        renderCommunityModalContent(cData);
        communityDataLoaded = true;
      }
    } catch (err) {
      console.error("[MIDIA] Erro ao carregar comunidade_comentarios_sjc.json:", err);
    }
  }

  function renderCommunityModalContent(cData) {
    const totalSpan = document.getElementById('community-total-commenters');
    const tbody = document.getElementById('community-top-users-body');
    const commentsList = document.getElementById('community-sample-comments-list');

    if (totalSpan && cData.total_unique_commenters) {
      totalSpan.textContent = cData.total_unique_commenters.toLocaleString('pt-BR');
    }

    if (tbody && cData.top_commenters) {
      tbody.innerHTML = cData.top_commenters.map(u => `
        <tr class="hover:bg-slate-50 text-xs">
          <td class="px-4 py-2 font-black text-slate-400">#${u.rank}</td>
          <td class="px-4 py-2 font-bold text-brand-950">@${u.username}</td>
          <td class="px-4 py-2 text-center font-semibold text-slate-700">${u.comments_count}</td>
          <td class="px-4 py-2 text-right font-black text-rose-600">${u.total_likes_received.toLocaleString('pt-BR')}</td>
        </tr>
      `).join('');
    }

    if (commentsList && cData.sample_popular_comments) {
      commentsList.innerHTML = cData.sample_popular_comments.map(c => `
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-brand-900">@${c.ownerUsername} &bull; <span class="text-slate-400 font-normal">em @${c.post_perfil}</span></span>
            <span class="text-[10px] text-rose-500 font-bold flex items-center gap-1"><i class="fa-solid fa-heart text-[8px]"></i> ${c.likesCount}</span>
          </div>
          <p class="text-slate-700 font-medium leading-relaxed italic">"${c.text}"</p>
        </div>
      `).join('');
    }
  }

  window.openCommunityModal = function () {
    const modal = document.getElementById('midia-community-modal');
    if (modal) {
      modal.classList.remove('hidden');
      if (!communityDataLoaded) {
        loadCommunityModalData();
      }
    }
  };

  window.closeCommunityModal = function () {
    const modal = document.getElementById('midia-community-modal');
    if (modal) modal.classList.add('hidden');
  };

  // 14. INICIALIZAÇÃO E EVENT LISTENERS
  function setupMidiaEventListeners() {
    // Filtros
    document.getElementById('filter-midia-perfil')?.addEventListener('change', applyMidiaFilters);
    document.getElementById('filter-midia-tema')?.addEventListener('change', applyMidiaFilters);
    document.getElementById('filter-midia-sentimento')?.addEventListener('change', applyMidiaFilters);
    document.getElementById('filter-midia-tom')?.addEventListener('change', applyMidiaFilters);
    document.getElementById('filter-midia-search')?.addEventListener('input', applyMidiaFilters);

    // Botões
    document.getElementById('btn-refresh-midia')?.addEventListener('click', () => fetchMidiaData());
    document.getElementById('btn-export-midia-csv')?.addEventListener('click', exportMidiaCSV);
    document.getElementById('btn-export-midia-json')?.addEventListener('click', exportMidiaJSON);

    // Paginação
    document.getElementById('midia-btn-prev-page')?.addEventListener('click', () => {
      if (currentMidiaPage > 1) {
        currentMidiaPage--;
        renderMidiaTable();
      }
    });

    document.getElementById('midia-btn-next-page')?.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredMidiaRecords.length / MIDIA_PAGE_SIZE);
      if (currentMidiaPage < totalPages) {
        currentMidiaPage++;
        renderMidiaTable();
      }
    });

    // Resize Handler for Sankey Chart
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.currentMainTab === 'midia') {
          renderMidiaSankeyChart();
        }
      }, 250);
    });
  }

  // Expor funções globalmente
  window.fetchMidiaData = fetchMidiaData;
  window.renderMidiaDashboard = renderMidiaDashboard;
  window.resetMidiaFilters = resetMidiaFilters;

  // Auto-inicializar no DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupMidiaEventListeners();
      fetchMidiaData();
    });
  } else {
    setupMidiaEventListeners();
    fetchMidiaData();
  }

})();
