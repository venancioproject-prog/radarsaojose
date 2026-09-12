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
    'Dividido/Polarizado': '#8B5CF6'
  };

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
      'Descontraï¿½do': 'Descontraído',
      'Descontrado': 'Descontraído',
      'CrÃ­tico': 'Crítico',
      'Crï¿½tico': 'Crítico',
      'Crtico': 'Crítico',
      'PrestaÃ§Ã£o de Contas & Cidadania': 'Prestação de Contas & Cidadania',
      'Debate PolÃ­tico & OpiniÃ£o': 'Debate Político & Opinião',
      'Utilidade PÃºblica & Oportunidade': 'Utilidade Pública & Oportunidade',
      'Torcida & CelebraÃ§Ã£o Local': 'Torcida & Celebração Local',
      'Medo, Luto & comoÃ§Ã£o': 'Medo, Luto & Comoção',
      'IndignaÃ§Ã£o & CobranÃ§a': 'Indignação & Cobrança',
      'Curiosidade & ViralizaÃ§Ã£o': 'Curiosidade & Viralização',
      'Candidato & Cidadania': 'Política & Gestão Pública',
      'Seguridad Pública': 'Segurança Pública',
      'Eduração & Tecnologia': 'Educação & Tecnologia',
      'Medio & Alerta de Segurança': 'Medo & Alerta de Segurança',
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

    // Sanitização de engajamento (o Instagram oculta curtidas em alguns posts retornando -1 da API)
    const rawLikes = Number(clean.likes);
    const rawComments = Number(clean.comments);
    const likes = Math.max(0, isNaN(rawLikes) ? 0 : rawLikes);
    const comments = Math.max(0, isNaN(rawComments) ? 0 : rawComments);
    clean.likes = likes;
    clean.comments = comments;

    const rawEng = Number(clean.engajamento_total);
    const engCalculated = likes + comments;
    clean.engajamento_total = rawEng < 0 ? engCalculated : Math.max(0, isNaN(rawEng) ? engCalculated : rawEng);

    return clean;
  }

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

    showMidiaLoading(false);

    if (data && data.length > 0) {
      allMidiaRecords = data
        .map(sanitizeMidiaRecord)
        .filter(r => {
          const dt = r.timestamp_brasilia || r.timestamp_utc || r.data || '';
          return !dt.startsWith('2023') && !dt.includes('2023-09-25');
        });
      window.allMidiaRecords = allMidiaRecords;
      filteredMidiaRecords = [...allMidiaRecords];
      window.filteredMidiaRecords = filteredMidiaRecords;
        
      const statusBadge = document.getElementById('midia-data-status-badge');
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Base Conectada (${allMidiaRecords.length.toLocaleString('pt-BR')} posts)`;
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
    const dateStartInput = document.getElementById('filter-midia-date-start');
    const dateEndInput = document.getElementById('filter-midia-date-end');

    const perfis = [...new Set(allMidiaRecords.map(r => r.perfil).filter(Boolean))].sort();
    const temas = [...new Set(allMidiaRecords.map(r => r.tema_central).filter(Boolean))].sort();
    const sentimentos = [...new Set(allMidiaRecords.map(r => r.sentimento_comentarios).filter(Boolean))].sort();
    const tons = [...new Set(allMidiaRecords.map(r => r.tom_noticia).filter(Boolean))].sort();

    // Calcular min e max data do dataset
    const dates = allMidiaRecords
      .map(r => (r.timestamp_brasilia || r.timestamp_utc || r.data || '').substring(0, 10))
      .filter(d => d.length === 10)
      .sort();

    if (dates.length > 0) {
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];
      if (dateStartInput) { dateStartInput.min = minDate; dateStartInput.max = maxDate; }
      if (dateEndInput) { dateEndInput.min = minDate; dateEndInput.max = maxDate; }
    }

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
    const dateStart = document.getElementById('filter-midia-date-start')?.value || '';
    const dateEnd = document.getElementById('filter-midia-date-end')?.value || '';
    const searchInput = document.getElementById('filter-midia-search') || document.getElementById('midia-search-input');
    const search = (searchInput?.value || '').toLowerCase().trim();

    filteredMidiaRecords = allMidiaRecords.filter(r => {
      if (perfil && r.perfil !== perfil) return false;
      if (tema && r.tema_central !== tema) return false;
      if (sentimento && r.sentimento_comentarios !== sentimento) return false;
      if (tom && r.tom_noticia !== tom) return false;

      // Filtro por Período de Datas (Data Inicial & Data Final)
      const postDateStr = (r.timestamp_brasilia || r.timestamp_utc || r.data || '').substring(0, 10);
      if (dateStart && postDateStr && postDateStr < dateStart) return false;
      if (dateEnd && postDateStr && postDateStr > dateEnd) return false;

      if (search) {
        // Normalização ultra segura (aceita strings, arrays, números, null/undefined) e remove acentos
        const norm = (val) => {
          if (!val) return '';
          if (Array.isArray(val)) val = val.join(' ');
          return String(val).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };
        const normSearch = norm(search);
        const matchLegenda = norm(r.legenda || r.caption || '').includes(normSearch);

        if (!matchLegenda) {
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
    const ds = document.getElementById('filter-midia-date-start');
    const de = document.getElementById('filter-midia-date-end');
    const q = document.getElementById('filter-midia-search') || document.getElementById('midia-search-input');

    if (p) p.value = '';
    if (t) t.value = '';
    if (s) s.value = '';
    if (tm) tm.value = '';
    if (ds) ds.value = '';
    if (de) de.value = '';
    if (q) q.value = '';

    filteredMidiaRecords = [...allMidiaRecords];
    currentMidiaPage = 1;
    renderMidiaDashboard();
  }

  window.applyMidiaFilters = applyMidiaFilters;
  window.resetMidiaFilters = resetMidiaFilters;

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
    try { renderMidiaThemeEngagementDonutChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaThemeEngagementDonutChart:", e); }
    try { renderMidiaTriggersHorizontalBarChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaTriggersHorizontalBarChart:", e); }
    try { renderMidiaToneHorizontalBarChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaToneHorizontalBarChart:", e); }
    try { renderMidiaSentimentGauge(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaSentimentGauge:", e); }
    try { renderMidiaSentimentByProfileChart(); } catch (e) { console.error("[MIDIA] Erro em renderMidiaSentimentByProfileChart:", e); }
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

  // 7. GRÁFICO DE ROSCA: DISTRIBUIÇÃO DO TEMA CENTRAL (POSTS)
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

    const palette = labels.map(label => THEME_PALETTE[label] || '#64748B');

    const ctx = canvas.getContext('2d');
    midiaChartInstances['themeDonut'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: palette,
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

  // 7B. GRÁFICO DE ROSCA: DISTRIBUIÇÃO DO TEMA CENTRAL POR ENGAJAMENTO
  function renderMidiaThemeEngagementDonutChart() {
    const canvas = document.getElementById('chart-midia-theme-engagement');
    if (!canvas) return;
    destroyMidiaChart('themeEngagementDonut', canvas);

    const themeEngMap = {};
    filteredMidiaRecords.forEach(r => {
      const t = r.tema_central || 'Outros';
      const eng = Number(r.engajamento_total) || 0;
      themeEngMap[t] = (themeEngMap[t] || 0) + eng;
    });

    const sorted = Object.entries(themeEngMap).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(s => s[0]);
    const dataVals = sorted.map(s => s[1]);
    const totalEng = dataVals.reduce((a, b) => a + b, 0);

    const palette = labels.map(label => THEME_PALETTE[label] || '#64748B');

    const ctx = canvas.getContext('2d');
    midiaChartInstances['themeEngagementDonut'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: palette,
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
                const pct = totalEng > 0 ? ((val / totalEng) * 100).toFixed(1) : "0";
                return ` ${ctx.label}: ${val.toLocaleString('pt-BR')} interações (${pct}%)`;
              }
            }
          },
          datalabels: {
            color: '#FFFFFF',
            font: { family: 'Montserrat', weight: 'bold', size: 10 },
            formatter: (val) => {
              const pct = totalEng > 0 ? (val / totalEng) * 100 : 0;
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
          maxBarThickness: 28,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 8, bottom: 4, right: 80, left: 10 } },
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

  // 8B. MAPA DE ÁRVORE (TREEMAP): DISTRIBUIÇÃO POR TOM DA NOTÍCIA
  function renderMidiaToneHorizontalBarChart() {
    const container = document.getElementById('chart-midia-tone-container') || (document.getElementById('chart-midia-tone') ? document.getElementById('chart-midia-tone').parentElement : null);
    if (!container) return;

    const toneCounts = {};
    const toneEng = {};

    filteredMidiaRecords.forEach(r => {
      let tone = r.tom_noticia ? String(r.tom_noticia).trim() : 'Outros';
      tone = fixTextEncoding(tone);
      if (!tone || tone === 'null' || tone === 'undefined') tone = 'Informativo';
      const eng = Number(r.engajamento_total) || 0;
      toneCounts[tone] = (toneCounts[tone] || 0) + 1;
      toneEng[tone] = (toneEng[tone] || 0) + eng;
    });

    const sorted = Object.entries(toneCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return;

    const totalPosts = sorted.reduce((acc, s) => acc + s[1], 0);

    const toneColorsMap = {
      'Informativo': '#0284C7',
      'Alerta': '#F59E0B',
      'Alerta de Segurança': '#EA580C',
      'Medo & Alerta de Segurança': '#EA580C',
      'Comemorativo': '#10B981',
      'Orgulho & Celebração': '#059669',
      'Crítico': '#F43F5E',
      'Indignação & Cobrança': '#E11D48',
      'Indignação & Reclamação': '#E11D48',
      'Descontraído': '#8B5CF6',
      'Humor & Memes': '#A855F7',
      'Opinativo/Editorial': '#6366F1'
    };

    // Construção do Treemap responsivo usando um Grid de Árvore proporcional
    let html = `
      <div class="w-full h-full flex flex-col justify-between gap-2 p-1">
        <div class="grid grid-cols-12 grid-rows-6 gap-2 w-full flex-1 min-h-[340px]">
    `;

    // Atribuição de áreas proporcionais na grade de 12 colunas x 6 linhas para os tons
    // 1º item (Informativo ~71%) -> ocupa col-span-8 row-span-6
    // 2º item (Alerta ~10%) -> ocupa col-span-4 row-span-3
    // 3º item (Comemorativo ~8.6%) -> ocupa col-span-4 row-span-3
    // Restantes -> distribuídos no fluxo
    
    sorted.forEach(([tName, count], idx) => {
      const pct = totalPosts > 0 ? ((count / totalPosts) * 100).toFixed(1) : 0;
      const bg = toneColorsMap[tName] || '#64748B';
      const eng = toneEng[tName] || 0;
      const avg = count > 0 ? Math.round(eng / count) : 0;

      let gridClass = "col-span-4 row-span-2";
      if (idx === 0) {
        gridClass = "col-span-8 row-span-6";
      } else if (idx === 1) {
        gridClass = "col-span-4 row-span-3";
      } else if (idx === 2) {
        gridClass = "col-span-4 row-span-3";
      } else if (idx === 3) {
        gridClass = "col-span-4 row-span-2";
      } else if (idx === 4) {
        gridClass = "col-span-4 row-span-2";
      } else if (idx === 5) {
        gridClass = "col-span-4 row-span-2";
      }

      html += `
        <div class="${gridClass} rounded-2xl p-3.5 flex flex-col justify-between text-white shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5 cursor-pointer relative overflow-hidden group" style="background-color: ${bg}">
          <div class="absolute -right-4 -bottom-4 opacity-10 text-white group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-layer-group text-6xl"></i>
          </div>
          <div class="flex items-start justify-between gap-1 z-10">
            <span class="text-xs font-black uppercase tracking-wider text-white/90 drop-shadow-xs truncate max-w-[80%]" title="${tName}">${tName}</span>
            <span class="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black font-mono">${pct}%</span>
          </div>
          <div class="z-10 mt-2">
            <div class="text-lg sm:text-2xl font-black font-mono tracking-tight text-white leading-none">
              ${count.toLocaleString('pt-BR')} <span class="text-[10px] font-medium font-sans text-white/80 uppercase">posts</span>
            </div>
            <div class="text-[10px] text-white/80 font-semibold mt-1 truncate">
              <i class="fa-solid fa-heart text-[9px] mr-1"></i>${eng.toLocaleString('pt-BR')} interações (~${avg.toLocaleString('pt-BR')}/post)
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // 9. MEDIDOR E PROPORÇÃO DE SENTIMENTO DOS COMENTÁRIOS
  function renderMidiaSentimentGauge() {
    const total = filteredMidiaRecords.length;
    const sentMap = {
      'Positivo': 0,
      'Neutro': 0,
      'Negativo': 0,
      'Dividido/Polarizado': 0
    };

    filteredMidiaRecords.forEach(r => {
      const s = r.sentimento_comentarios;
      if (sentMap[s] !== undefined) {
        sentMap[s]++;
      } else if (s && (s.includes('Polarizado') || s.includes('Dividido'))) {
        sentMap['Dividido/Polarizado']++;
      } else {
        sentMap['Neutro']++;
      }
    });

    const pos = sentMap['Positivo'];
    const neu = sentMap['Neutro'];
    const neg = sentMap['Negativo'];
    const pol = sentMap['Dividido/Polarizado'];

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
    if (barPol) { barPol.style.width = `${polPct}%`; barPol.title = `Dividido/Polarizado: ${polPct}% (${pol})`; }

    const txtPos = document.getElementById('sent-txt-positivo');
    const txtNeu = document.getElementById('sent-txt-neutro');
    const txtNeg = document.getElementById('sent-txt-negativo');
    const txtPol = document.getElementById('sent-txt-polarizado');

    if (txtPos) txtPos.textContent = `${pos.toLocaleString('pt-BR')} (${posPct}%)`;
    if (txtNeu) txtNeu.textContent = `${neu.toLocaleString('pt-BR')} (${neuPct}%)`;
    if (txtNeg) txtNeg.textContent = `${neg.toLocaleString('pt-BR')} (${negPct}%)`;
    if (txtPol) txtPol.textContent = `${pol.toLocaleString('pt-BR')} (${polPct}%)`;
  }

  // Dicionário de Metadados e Logos dos 10 Veículos de Mídia Oficial de SJC
  const MEDIA_VEHICLES_CONFIG = {
    'lifeinforma': { name: 'Life Informa', handle: '@lifeinforma', followers: '285 mil', logo: 'midia_sjc/logos_veiculos/01-lifeinforma.png', color: '#F59E0B' },
    'jornalovale': { name: 'Jornal O VALE', handle: '@jornalovale', followers: '210 mil', logo: 'midia_sjc/logos_veiculos/02-jornalovale.png', color: '#D97706' },
    'aquivaleoficial': { name: 'Aqui Vale', handle: '@aquivaleoficial', followers: '165 mil', logo: 'midia_sjc/logos_veiculos/03-aquivaleoficial.png', color: '#EC4899' },
    'cbnvale': { name: 'CBN Vale', handle: '@cbnvale', followers: '142 mil', logo: 'midia_sjc/logos_veiculos/04-cbnvale.png', color: '#E11D48' },
    'bandvaletv': { name: 'Band Vale TV', handle: '@bandvaletv', followers: '198 mil', logo: 'midia_sjc/logos_veiculos/05-bandvaletv.png', color: '#2563EB' },
    'spriomais': { name: 'SP RIO+', handle: '@spriomais', followers: '115 mil', logo: 'midia_sjc/logos_veiculos/06-spriomais.png', color: '#8B5CF6' },
    'vale360news': { name: 'Vale 360 News', handle: '@vale360news', followers: '98 mil', logo: 'midia_sjc/logos_veiculos/07-vale360news.png', color: '#0D9488' },
    'noticias.sjcampos': { name: 'Notícias SJC', handle: '@noticias.sjcampos', followers: '175 mil', logo: 'midia_sjc/logos_veiculos/08-noticias-sjcampos.png', color: '#10B981' },
    'redevanguarda': { name: 'Rede Vanguarda', handle: '@redevanguarda', followers: '480 mil', logo: 'midia_sjc/logos_veiculos/09-redevanguarda.png', color: '#0284C7' },
    'jovempansjc': { name: 'Jovem Pan SJC', handle: '@jovempansjc', followers: '135 mil', logo: 'midia_sjc/logos_veiculos/10-jovempansjc.png', color: '#EA580C' }
  };

  // Cache de imagens pré-carregadas para o Plugin do Chart.js
  const loadedLogoImages = {};
  Object.entries(MEDIA_VEHICLES_CONFIG).forEach(([key, cfg]) => {
    const img = new Image();
    img.src = cfg.logo;
    loadedLogoImages[key] = img;
  });

  // 9B. GRÁFICO DE BARRAS DE SENTIMENTO POR VEÍCULO DE MÍDIA (FULL-WIDTH)
  function renderMidiaSentimentByProfileChart() {
    const canvas = document.getElementById('chart-midia-sentimento-veiculos');
    if (!canvas) return;
    destroyMidiaChart('sentimentProfile', canvas);

    const profileData = {};

    filteredMidiaRecords.forEach(r => {
      const p = r.perfil || 'Outros';
      if (!profileData[p]) {
        profileData[p] = { Positivo: 0, Neutro: 0, Negativo: 0, 'Dividido/Polarizado': 0, total: 0 };
      }
      const s = r.sentimento_comentarios;
      if (profileData[p][s] !== undefined) {
        profileData[p][s]++;
      } else if (s && (s.includes('Polarizado') || s.includes('Dividido'))) {
        profileData[p]['Dividido/Polarizado']++;
      } else {
        profileData[p]['Neutro']++;
      }
      profileData[p].total++;
    });

    const sortedProfiles = Object.keys(profileData).sort((a, b) => profileData[b].total - profileData[a].total);

    if (sortedProfiles.length === 0) return;

    // 1. Povoamento do Bloco Superior de Mini-Cards em Ordem Alfabética com Logos e Seguidores
    const headerCardsContainer = document.getElementById('midia-sentiment-profiles-header-cards');
    if (headerCardsContainer) {
      headerCardsContainer.innerHTML = '';
      
      // Ordenar veículos em Ordem Alfabética pelo nome de exibição
      const alphabeticalProfiles = Object.keys(MEDIA_VEHICLES_CONFIG).sort((a, b) => {
        const nameA = (MEDIA_VEHICLES_CONFIG[a]?.name || a).toLowerCase();
        const nameB = (MEDIA_VEHICLES_CONFIG[b]?.name || b).toLowerCase();
        return nameA.localeCompare(nameB, 'pt-BR');
      });

      alphabeticalProfiles.forEach(pKey => {
        const cfg = MEDIA_VEHICLES_CONFIG[pKey] || { name: pKey, handle: `@${pKey}`, followers: 'N/A', logo: '', color: '#64748B' };
        const pTot = profileData[pKey]?.total || 0;
        
        // Fundo customizado para destacar logos com tipografia branca/clara
        let logoBgClass = 'bg-slate-100 border-slate-200';
        if (pKey === 'jornalovale') {
          logoBgClass = 'bg-[#0B2545] border-brand-800';
        } else if (pKey === 'spriomais') {
          logoBgClass = 'bg-[#EA580C] border-orange-600';
        }

        // Destaque de escala para logos menores (Jovem Pan SJC & Vale 360 News)
        const imgScaleClass = pKey === 'jovempansjc' ? 'scale-150' : (pKey === 'vale360news' ? 'scale-125' : '');

        const card = document.createElement('div');
        card.className = "bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs transition-transform transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer";
        card.onclick = () => {
          const select = document.getElementById('filter-midia-perfil');
          if (select) {
            select.value = pKey;
            applyMidiaFilters();
          }
        };
        card.innerHTML = `
          <div class="w-11 h-11 rounded-full border-2 ${logoBgClass} p-1 shadow-sm overflow-hidden flex items-center justify-center mb-1.5 shrink-0">
            <img src="${cfg.logo}" alt="${cfg.name}" class="w-full h-full object-contain ${imgScaleClass}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(cfg.name)}&background=random'" />
          </div>
          <span class="text-[11px] font-black text-slate-800 leading-tight truncate w-full" title="${cfg.name}">${cfg.name}</span>
          <span class="text-[10px] font-bold text-slate-400 font-mono">${cfg.handle}</span>
          <div class="mt-1.5 flex flex-col gap-0.5 w-full">
            <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 truncate" title="Seguidores no Instagram">
              <i class="fa-solid fa-users text-[8px] mr-0.5 text-brand-600"></i>${cfg.followers}
            </span>
            <span class="text-[9px] font-bold text-slate-500 font-mono">${pTot.toLocaleString('pt-BR')} posts</span>
          </div>
        `;
        headerCardsContainer.appendChild(card);
      });
    }

    const posData = sortedProfiles.map(p => profileData[p].Positivo);
    const neuData = sortedProfiles.map(p => profileData[p].Neutro);
    const negData = sortedProfiles.map(p => profileData[p].Negativo);
    const polData = sortedProfiles.map(p => profileData[p]['Dividido/Polarizado']);

    // Plugin customizado para desenhar as Logos PNG substituindo inteiramente a legenda escrita do eixo X
    const xAxisLogosPlugin = {
      id: 'xAxisLogosPlugin',
      afterDraw(chart) {
        const { ctx, scales: { x } } = chart;
        if (!x) return;

        sortedProfiles.forEach((pKey, index) => {
          const img = loadedLogoImages[pKey];
          const xPos = x.getPixelForTick(index);
          const yPos = x.bottom + 6;

          if (img && img.complete && img.naturalWidth > 0) {
            // Aumentar tamanho das logos da Jovem Pan SJC e Vale 360 News
            let maxW = 66;
            let maxH = 28;
            if (pKey === 'jovempansjc') {
              maxW = 108;
              maxH = 44;
            } else if (pKey === 'vale360news') {
              maxW = 84;
              maxH = 34;
            }

            let drawW = img.naturalWidth;
            let drawH = img.naturalHeight;
            const scale = Math.min(maxW / drawW, maxH / drawH);
            drawW *= scale;
            drawH *= scale;

            ctx.save();

            // Fundo escuro customizado para destacar logos com escrita branca (Jornal O Vale = Azul, SP RIO+ = Laranja)
            if (pKey === 'jornalovale') {
              ctx.fillStyle = '#0B2545';
              ctx.beginPath();
              ctx.roundRect(xPos - drawW / 2 - 4, yPos + (maxH - drawH) / 2 - 2, drawW + 8, drawH + 4, 4);
              ctx.fill();
            } else if (pKey === 'spriomais') {
              ctx.fillStyle = '#EA580C';
              ctx.beginPath();
              ctx.roundRect(xPos - drawW / 2 - 4, yPos + (maxH - drawH) / 2 - 2, drawW + 8, drawH + 4, 4);
              ctx.fill();
            }

            ctx.drawImage(img, xPos - drawW / 2, yPos + (maxH - drawH) / 2, drawW, drawH);
            ctx.restore();
          }
        });
      }
    };

    const ctx = canvas.getContext('2d');
    midiaChartInstances['sentimentProfile'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedProfiles.map(p => `@${p}`),
        datasets: [
          {
            label: 'Positivo',
            data: posData,
            backgroundColor: '#10B981',
            borderRadius: 6,
            maxBarThickness: 32
          },
          {
            label: 'Neutro',
            data: neuData,
            backgroundColor: '#94A3B8',
            borderRadius: 6,
            maxBarThickness: 32
          },
          {
            label: 'Negativo',
            data: negData,
            backgroundColor: '#F43F5E',
            borderRadius: 6,
            maxBarThickness: 32
          },
          {
            label: 'Dividido/Polarizado',
            data: polData,
            backgroundColor: '#8B5CF6',
            borderRadius: 6,
            maxBarThickness: 32
          }
        ]
      },
      plugins: [xAxisLogosPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 40
          }
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(11, 37, 69, 0.95)',
            padding: 12,
            callbacks: {
              title: (items) => {
                const pKey = sortedProfiles[items[0]?.dataIndex];
                const cfg = MEDIA_VEHICLES_CONFIG[pKey];
                return cfg ? `${cfg.name} (${cfg.handle})` : items[0]?.label || '';
              },
              label: function(context) {
                const pName = sortedProfiles[context.dataIndex];
                const pTot = profileData[pName]?.total || 1;
                const val = context.raw || 0;
                const pct = ((val / pTot) * 100).toFixed(1);
                return ` ${context.dataset.label}: ${val.toLocaleString('pt-BR')} posts (${pct}%)`;
              },
              afterBody: function(items) {
                const pName = sortedProfiles[items[0].dataIndex];
                const pTot = profileData[pName]?.total || 0;
                const cfg = MEDIA_VEHICLES_CONFIG[pName];
                const followersStr = cfg ? ` | ${cfg.followers} seguidores` : '';
                return `\nTotal do Canal: ${pTot.toLocaleString('pt-BR')} publicações${followersStr}`;
              }
            }
          },
          datalabels: {
            color: '#FFFFFF',
            textStrokeColor: 'rgba(11, 37, 69, 0.85)',
            textStrokeWidth: 2.5,
            align: 'right',
            anchor: 'center',
            font: { family: 'Montserrat', weight: '900', size: 10 },
            formatter: (val, ctx) => {
              const pName = sortedProfiles[ctx.dataIndex];
              const pTot = profileData[pName]?.total || 1;
              const pct = Math.round((val / pTot) * 100);
              return val > 0 && pct >= 3 ? `${pct}%` : '';
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: {
              font: { family: 'Montserrat', size: 10 },
              color: '#64748B',
              callback: (v) => v.toLocaleString('pt-BR')
            }
          }
        }
      }
    });
  }

  // 10. DIAGRAMA DE SANKEY INTERATIVO: TEMA EDITORIAL -> GATILHO DE ENGAJAMENTO
  const TRIGGER_PALETTE = {
    'Alerta & Segurança': '#00B4D8',
    'Medo & Alerta de Segurança': '#EA580C',
    'Indignação & Denúncia': '#F43F5E',
    'Indignação & Reclamação': '#E11D48',
    'Orgulho & Celebração': '#10B981',
    'Cotidiano & Serviços': '#F59E0B',
    'Utilidade Pública & Oportunidade': '#0284C7',
    'Humor & Memes': '#8B5CF6',
    'Humor & Entretenimento': '#8B5CF6',
    'Curiosidade & Inovação': '#EC4899',
    'Curiosidade & Viralização': '#EC4899',
    'Debate Político & Opinião': '#6366F1',
    'Debate & Opinião': '#6366F1'
  };

  function renderMidiaSankeyChart() {
    const container = document.getElementById('chart-midia-sankey-container') || (document.getElementById('chart-midia-sankey') ? document.getElementById('chart-midia-sankey').parentElement : null);
    if (!container) return;

    // Assegurar que o canvas exista dentro do container
    if (!document.getElementById('chart-midia-sankey')) {
      container.innerHTML = '<canvas id="chart-midia-sankey"></canvas>';
    }
    const canvas = document.getElementById('chart-midia-sankey');
    if (canvas) destroyMidiaChart('sankeyFlow', canvas);

    const flowMatrix = {};

    filteredMidiaRecords.forEach(r => {
      let theme = r.tema_central ? String(r.tema_central).trim() : 'Outros';
      theme = fixTextEncoding(theme);
      if (!theme) theme = 'Outros';

      let trigger = r.gatilho_engajamento ? String(r.gatilho_engajamento).trim() : 'Utilidade Pública';
      trigger = fixTextEncoding(trigger);
      if (!trigger || trigger === 'null') trigger = 'Utilidade Pública';
      
      const eng = Number(r.engajamento_total) || 0;
      const key = `${theme}|||${trigger}`;

      if (!flowMatrix[key]) {
        flowMatrix[key] = { from: theme, to: trigger, flow: 0, engagement: 0, flowValue: 0 };
      }
      flowMatrix[key].flow += 1;
      flowMatrix[key].flowValue += 1;
      flowMatrix[key].engagement += eng;
    });

    const flowData = Object.values(flowMatrix)
      .filter(f => f.flow > 0)
      .map(f => ({
        from: f.from,
        to: f.to,
        flow: f.flow,
        flowValue: f.flow,
        engagement: f.engagement
      }));

    if (flowData.length === 0) return;

    const colorForNode = (nodeName) => {
      if (!nodeName) return '#2070aa';
      if (TRIGGER_PALETTE[nodeName]) return TRIGGER_PALETTE[nodeName];
      if (THEME_PALETTE[nodeName]) return THEME_PALETTE[nodeName];
      return '#2070aa';
    };

    // Tentar criar com o controller Sankey nativo do Chart.js
    if (typeof Chart !== 'undefined' && typeof Chart.controllers !== 'undefined' && typeof Chart.controllers.sankey !== 'undefined') {
      try {
        const ctx = canvas.getContext('2d');
        midiaChartInstances['sankeyFlow'] = new Chart(ctx, {
          type: 'sankey',
          data: {
            datasets: [{
              data: flowData,
              colorFrom: (c) => {
                const idx = c?.dataIndex;
                const item = flowData[idx];
                return colorForNode(item ? item.from : null);
              },
              colorTo: (c) => {
                const idx = c?.dataIndex;
                const item = flowData[idx];
                return colorForNode(item ? item.to : null);
              },
              colorMode: 'gradient',
              alpha: 0.6,
              borderWidth: 0,
              nodeWidth: 22,
              nodePadding: 18,
              labels: {
                font: { family: 'Montserrat', size: 11, weight: 'bold' },
                color: '#0B2545'
              }
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 20, bottom: 20, left: 25, right: 25 } },
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
                    const raw = item?.raw;
                    if (raw && raw.from && raw.to) {
                      return `${raw.from} ➔ Gatilho: ${raw.to}`;
                    }
                    return item?.label || '';
                  },
                  label: function (context) {
                    const raw = context?.raw;
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
                    return `Volume: ${context?.formattedValue || 0}`;
                  }
                }
              }
            }
          }
        });
        return;
      } catch (err) {
        console.warn("[MIDIA] Falha no Chart.js Sankey, gerando diagrama de fluxo nativo:", err);
      }
    }

    // Se o controller Sankey não estiver registrado na instância do Chart.js, desenhar o Diagrama de Fluxo Sankey real via SVG/Canvas
    const topFlows = flowData.sort((a, b) => b.engagement - a.engagement).slice(0, 15);
    const totalFlowPosts = flowData.reduce((acc, f) => acc + f.flow, 0);

    let html = `
      <div class="w-full h-full flex flex-col bg-white rounded-2xl p-4 border border-slate-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span class="text-xs font-bold text-slate-600">Fluxo Editorial (Tema Central ➔ Gatilho)</span>
          <span class="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black">${topFlows.length} Maiores Fluxos</span>
        </div>
        <div class="flex-1 overflow-y-auto custom-card-scroll space-y-2 pr-1">
    `;

    topFlows.forEach(f => {
      const fromColor = colorForNode(f.from);
      const toColor = colorForNode(f.to);
      const pctPosts = totalFlowPosts > 0 ? ((f.flow / totalFlowPosts) * 100).toFixed(1) : 0;
      const avg = f.flow > 0 ? Math.round(f.engagement / f.flow) : 0;

      html += `
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors">
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <div class="w-3 h-3 rounded-full shrink-0 shadow-xs" style="background-color: ${fromColor}"></div>
            <span class="text-xs font-bold text-slate-800 truncate max-w-[40%]" title="${f.from}">${f.from}</span>
            <div class="flex-1 flex items-center px-2">
              <div class="h-2 rounded-full w-full relative overflow-hidden" style="background: linear-gradient(to right, ${fromColor}, ${toColor})"></div>
            </div>
            <span class="text-xs font-bold text-slate-800 truncate max-w-[40%]" title="${f.to}">${f.to}</span>
            <div class="w-3 h-3 rounded-full shrink-0 shadow-xs" style="background-color: ${toColor}"></div>
          </div>
          <div class="text-right shrink-0">
            <span class="px-2 py-0.5 rounded-md bg-white text-brand-900 text-[11px] font-black font-mono border border-slate-200 shadow-2xs">${f.flow.toLocaleString('pt-BR')} posts (${pctPosts}%)</span>
            <div class="text-[10px] text-slate-500 font-bold mt-0.5">${f.engagement.toLocaleString('pt-BR')} int.</div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  function normalizePersonName(name) {
    if (!name) return '';
    const norm = name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    // Sinônimos do Presidente Lula
    if (norm === 'lula' || norm === 'luiz inacio' || norm === 'luis inacio' || norm === 'luiz inacio lula da silva' || norm === 'luis inacio lula da silva' || norm === 'lula da silva' || norm === 'presidente lula') {
      return 'Lula';
    }
    // Sinônimos do Governador Tarcísio
    if (norm === 'tarcisio' || norm === 'tarcisio de freitas' || norm === 'governador tarcisio' || norm === 'tarcisio freitas') {
      return 'Tarcísio de Freitas';
    }
    // Sinônimos do Prefeito Anderson
    if (norm === 'anderson' || norm === 'anderson farias' || norm === 'prefeito anderson' || norm === 'anderson farias (psd)') {
      return 'Anderson Farias';
    }
    // Sinônimos do Senador Flávio Bolsonaro
    if (norm === 'flavio' || norm === 'flavio bolsonaro' || norm === 'senador flavio bolsonaro') {
      return 'Flávio Bolsonaro';
    }
    // Sinônimos de Jair Bolsonaro
    if (norm === 'jair bolsonaro' || norm === 'ex-presidente bolsonaro' || norm === 'bolsonaro') {
      return 'Jair Bolsonaro';
    }
    // Sinônimos de Fernando Haddad
    if (norm === 'haddad' || norm === 'fernando haddad' || norm === 'ministro haddad') {
      return 'Fernando Haddad';
    }
    
    return name.trim();
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
        const uniquePeopleInPost = new Set();
        list.forEach(p => {
          const normPerson = normalizePersonName(p);
          if (normPerson) {
            uniquePeopleInPost.add(normPerson);
          }
        });

        uniquePeopleInPost.forEach(person => {
          peopleCounts[person] = (peopleCounts[person] || 0) + 1;
          peopleEng[person] = (peopleEng[person] || 0) + eng;
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
          maxBarThickness: 28,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 8, bottom: 4, right: 85, left: 10 } },
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

  // 12. MAPA GEOGRÁFICO REAL & MAPA DE CALOR DAS CIDADES MAIS CITADAS (LEAFLET)
  function renderMidiaCitiesChart() {
    const container = document.getElementById('midia-cities-map-container');
    if (!container) return;

    // Dicionário de Coordenadas Geográficas Reais das Cidades (Vale do Paraíba & SP) com Aliases Canônicos
    const CITIES = {
      'sao_jose': { name: 'São José dos Campos', lat: -23.1896, lng: -45.8841, match: ['sao jose dos campos', 'sao jose', 'sjc'] },
      'taubate': { name: 'Taubaté', lat: -23.0264, lng: -45.5552, match: ['taubate'] },
      'jacarei': { name: 'Jacareí', lat: -23.3053, lng: -45.9658, match: ['jacarei'] },
      'sao_paulo': { name: 'São Paulo', lat: -23.5505, lng: -46.6333, match: ['sao paulo', 'sp'] },
      'caraguatatuba': { name: 'Caraguatatuba', lat: -23.6226, lng: -45.4127, match: ['caraguatatuba', 'caragua'] },
      'pindamonhangaba': { name: 'Pindamonhangaba', lat: -22.9249, lng: -45.4614, match: ['pindamonhangaba', 'pinda'] },
      'cacapava': { name: 'Caçapava', lat: -23.1008, lng: -45.7069, match: ['cacapava'] },
      'ubatuba': { name: 'Ubatuba', lat: -23.4332, lng: -45.0834, match: ['ubatuba'] },
      'guaratingueta': { name: 'Guaratinguetá', lat: -22.8160, lng: -45.1925, match: ['guaratingueta', 'guara'] },
      'aparecida': { name: 'Aparecida', lat: -22.8467, lng: -45.2297, match: ['aparecida'] },
      'sao_sebastiao': { name: 'São Sebastião', lat: -23.7601, lng: -45.4097, match: ['sao sebastiao'] },
      'ilhabela': { name: 'Ilhabela', lat: -23.7781, lng: -45.3582, match: ['ilhabela'] },
      'campos_do_jordao': { name: 'Campos do Jordão', lat: -22.7394, lng: -45.5914, match: ['campos do jordao'] },
      'lorena': { name: 'Lorena', lat: -22.7392, lng: -45.1208, match: ['lorena'] },
      'cruzeiro': { name: 'Cruzeiro', lat: -22.5786, lng: -44.9608, match: ['cruzeiro'] },
      'santa_branca': { name: 'Santa Branca', lat: -23.3970, lng: -45.8842, match: ['santa branca'] },
      'igarata': { name: 'Igaratá', lat: -23.2075, lng: -46.1578, match: ['igaratas', 'igarata', 'igarta'] },
      'monteiro_lobato': { name: 'Monteiro Lobato', lat: -22.9536, lng: -45.8394, match: ['monteiro lobato'] },
      'paraibuna': { name: 'Paraibuna', lat: -23.3853, lng: -45.6617, match: ['paraibuna'] },
      'tremembe': { name: 'Tremembé', lat: -22.9583, lng: -45.5492, match: ['tremembe'] }
    };

    function getCanonicalCity(raw) {
      if (!raw) return null;
      const norm = String(raw).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      for (const [cityId, info] of Object.entries(CITIES)) {
        for (const m of info.match) {
          if (norm === m) return cityId;
        }
      }
      for (const [cityId, info] of Object.entries(CITIES)) {
        for (const m of info.match) {
          if (norm.includes(m)) return cityId;
        }
      }
      return null;
    }

    const cityCounts = {};
    const cityEng = {};
    let totalBase = filteredMidiaRecords.length;

    filteredMidiaRecords.forEach(r => {
      const eng = Number(r.engajamento_total) || 0;
      if (r.cidades_citadas) {
        const list = Array.isArray(r.cidades_citadas) ? r.cidades_citadas : String(r.cidades_citadas).split(',');
        const uniqueCities = new Set();
        list.forEach(c => {
          const cId = getCanonicalCity(c);
          if (cId) uniqueCities.add(cId);
        });
        uniqueCities.forEach(cId => {
          cityCounts[cId] = (cityCounts[cId] || 0) + 1;
          cityEng[cId] = (cityEng[cId] || 0) + eng;
        });
      }
    });

    const entries = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
    const maxCount = entries.length > 0 ? entries[0][1] : 1;

    // Reset limpo do container do Mapa
    if (window.midiaCitiesLeafletMap) {
      try { window.midiaCitiesLeafletMap.remove(); } catch (e) {}
      window.midiaCitiesLeafletMap = null;
    }

    if (typeof L === 'undefined') {
      container.innerHTML = '<div class="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">Biblioteca de mapas Leaflet indisponível.</div>';
      return;
    }

    // Criar Mapa Leaflet focado no Vale do Paraíba & SP
    const map = L.map(container, {
      center: [-23.20, -45.65],
      zoom: 9,
      zoomControl: true,
      scrollWheelZoom: false
    });
    window.midiaCitiesLeafletMap = map;

    // Camada de Tile OpenStreetMap limpa com filtro CSS Preto & Branco (PeB)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    // Aplicar filtro CSS para transformar o fundo do mapa em Preto e Branco (PeB / Monocromático) de alta legibilidade
    const tilePane = map.getPane('tilePane');
    if (tilePane) {
      tilePane.style.filter = 'grayscale(100%) contrast(110%) brightness(95%)';
    }

    // Offset para evitar sobreposição de rótulos próximos
    const OFFSET_MAP = {
      'sao_jose': [0, -10],
      'jacarei': [-30, 20],
      'caçapava': [20, 10],
      'taubate': [0, -15],
      'tremembe': [-25, -20],
      'pindamonhangaba': [30, -10],
      'sao_paulo': [-40, -10],
      'santa_branca': [0, 20]
    };

    // Plotar Círculos de Calor + Rótulos de Porcentagem Canônicos
    entries.forEach(([cId, count]) => {
      const city = CITIES[cId];
      if (!city) return;

      const pctNum = totalBase > 0 ? (count / totalBase) * 100 : 0;
      const pct = pctNum.toFixed(1);
      const intensity = count / maxCount;

      let color = '#0284C7';
      let fillColor = '#38BDF8';
      let badgeStyle = 'background: rgba(15, 23, 42, 0.94); color: #F8FAFC; border: 1px solid rgba(56, 189, 248, 0.7); box-shadow: 0 4px 12px rgba(0,0,0,0.3);';

      if (intensity > 0.4) {
        color = '#E11D48'; // Red/Rose intenso para SJC
        fillColor = '#F43F5E';
        badgeStyle = 'background: rgba(136, 19, 55, 0.96); color: #FFFFFF; border: 1px solid rgba(251, 113, 133, 0.9); box-shadow: 0 4px 16px rgba(225, 29, 72, 0.5); font-weight: 900;';
      } else if (intensity > 0.15) {
        color = '#EA580C'; // Laranja para Taubaté / Jacareí
        fillColor = '#FB923C';
        badgeStyle = 'background: rgba(124, 45, 18, 0.95); color: #FFFFFF; border: 1px solid rgba(251, 146, 60, 0.85); box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);';
      } else if (intensity > 0.05) {
        color = '#059669'; // Verde Esmeralda
        fillColor = '#34D399';
        badgeStyle = 'background: rgba(6, 78, 59, 0.95); color: #FFFFFF; border: 1px solid rgba(52, 211, 153, 0.8);';
      }

      // 1. Círculo de calor proporcional ao volume de posts
      const radius = Math.max(14, Math.min(50, Math.sqrt(count) * 0.82));
      const circle = L.circleMarker([city.lat, city.lng], {
        radius: radius,
        color: color,
        weight: intensity > 0.4 ? 3 : 2,
        opacity: 0.9,
        fillColor: fillColor,
        fillOpacity: 0.35 + (intensity * 0.4)
      }).addTo(map);

      // 2. Rótulo de Dados Permanente e Estilizado
      const offset = OFFSET_MAP[cId] || [0, 0];
      const labelLat = city.lat + (offset[1] * 0.002);
      const labelLng = city.lng + (offset[0] * 0.002);

      const iconHtml = `
        <div style="${badgeStyle}" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] shadow-xl backdrop-blur-md transition-all duration-200 transform hover:scale-110 cursor-pointer whitespace-nowrap">
          <span>${city.name}</span>
          <span style="background: rgba(255,255,255,0.22); color: #FDE047;" class="px-1.5 py-0.2 rounded font-mono text-[10px] font-extrabold">${pct}%</span>
        </div>
      `;

      const divIcon = L.divIcon({
        className: 'city-heat-label-marker',
        html: iconHtml,
        iconSize: [140, 30],
        iconAnchor: [70, 15]
      });

      const labelMarker = L.marker([labelLat, labelLng], { icon: divIcon }).addTo(map);

      const tooltipContent = `
        <div style="font-family: Montserrat, sans-serif;" class="p-2 min-w-[180px]">
          <div class="font-black text-slate-900 text-xs border-b border-slate-100 pb-1 mb-1.5 flex items-center justify-between">
            <span>📍 ${city.name}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-brand-600 text-white font-bold">${pct}%</span>
          </div>
          <div class="text-[11px] text-slate-600 font-semibold leading-relaxed">
            <div>• <strong>${count.toLocaleString('pt-BR')}</strong> publicações (${pct}%)</div>
            <div>• <strong>${(cityEng[cId] || 0).toLocaleString('pt-BR')}</strong> interações totais</div>
            <div class="mt-1.5 text-[10px] text-brand-600 font-bold hover:underline">Clique para filtrar notícias de ${city.name}</div>
          </div>
        </div>
      `;

      circle.bindPopup(tooltipContent);
      labelMarker.on('click', () => {
        circle.openPopup();
        window.filterByCityTerm(city.name);
      });
    });

    setTimeout(() => {
      try { map.invalidateSize(); } catch(e) {}
    }, 250);
  }

  // Hook para filtrar a cidade no campo de busca ao clicar no mapa
  window.filterByCityTerm = function(cityName) {
    const searchInput = document.getElementById('filter-midia-search') || document.getElementById('midia-search-input');
    if (searchInput) {
      searchInput.value = cityName;
      applyMidiaFilters();
      
      setTimeout(() => {
        const tableContainer = document.getElementById('midia-table-container') || document.getElementById('midia-table-body');
        if (tableContainer) {
          tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

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

    const activeSearch = (document.getElementById('filter-midia-search')?.value || document.getElementById('midia-search-input')?.value || '').trim().toLowerCase();

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
    const searchInput = document.getElementById('filter-midia-search') || document.getElementById('midia-search-input');
    if (searchInput) {
      if (searchInput.value.trim().toLowerCase() === term.toLowerCase()) {
        searchInput.value = '';
      } else {
        searchInput.value = term;
      }
    }
    currentMidiaPage = 1;
    applyMidiaFilters();
    
    // Rolar suavemente até a tabela do Explorador de Publicações
    setTimeout(() => {
      const tableContainer = document.getElementById('midia-table-container') || document.getElementById('midia-table-body');
      if (tableContainer) {
        tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Função para alterar a coluna e direção de ordenação da tabela
  window.setMidiaSortColumn = function(col) {
    if (midiaSortColumn === col) {
      midiaSortOrder = midiaSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      midiaSortColumn = col;
      if (col === 'engajamento_total' || col === 'timestamp_brasilia' || col === 'likes' || col === 'comments') {
        midiaSortOrder = 'desc';
      } else {
        midiaSortOrder = 'asc';
      }
    }
    currentMidiaPage = 1;
    renderMidiaTable();
  };

  function updateTableSortIcons() {
    const cols = ['perfil', 'timestamp_brasilia', 'engajamento_total', 'tema_central', 'legenda', 'tom_noticia', 'sentimento_comentarios', 'entidades_citadas'];
    cols.forEach(col => {
      const icon = document.getElementById(`sort-icon-${col}`);
      if (!icon) return;
      if (midiaSortColumn === col) {
        icon.className = `fa-solid ${midiaSortOrder === 'asc' ? 'fa-sort-up text-brand-600' : 'fa-sort-down text-brand-600'} text-[11px]`;
      } else {
        icon.className = 'fa-solid fa-sort text-slate-300 group-hover/th:text-slate-500 transition-colors text-[10px]';
      }
    });
  }

  // 12. TABELA INTERATIVA COM PAGINAÇÃO
  function renderMidiaTable() {
    const tbody = document.getElementById('midia-table-body');
    const paginationInfo = document.getElementById('midia-pagination-info');
    const btnPrev = document.getElementById('midia-btn-prev-page');
    const btnNext = document.getElementById('midia-btn-next-page');

    if (!tbody) return;

    // Atualiza os ícones das colunas
    updateTableSortIcons();

    // Sorting
    const sorted = [...filteredMidiaRecords].sort((a, b) => {
      let valA = a[midiaSortColumn];
      let valB = b[midiaSortColumn];

      if (midiaSortColumn === 'engajamento_total' || midiaSortColumn === 'likes' || midiaSortColumn === 'comments') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (midiaSortColumn === 'timestamp_brasilia') {
        valA = a.timestamp_brasilia || a.timestamp_utc || '';
        valB = b.timestamp_brasilia || b.timestamp_utc || '';
      } else if (Array.isArray(valA) || Array.isArray(valB)) {
        valA = Array.isArray(valA) ? valA.join(', ') : (valA || '');
        valB = Array.isArray(valB) ? valB.join(', ') : (valB || '');
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
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
