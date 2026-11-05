/**
 * =========================================================================
 * RADAR SÃO JOSÉ — MÓDULO ELEIÇÕES 2026 (CONTROLADOR OFICIAL HOMOLOGADO)
 * =========================================================================
 * Arquitetura Integrada dentro do Painel Admin do Radar São José.
 * Versão: 2026.1-homologada
 * 
 * Fontes Oficiais:
 * - Tribunal Superior Eleitoral (TSE) — Boletins de Urna 2026 (SP)
 * - Tribunal Superior Eleitoral (TSE) — Perfil do Eleitorado por Seção 2026
 * - Tribunal Superior Eleitoral (TSE) — Locais de Votação 2026
 * - Prefeitura de São José dos Campos — Plano Diretor (Anexo IV-A)
 * =========================================================================
 */

(function(window, document) {
  'use strict';

  // =========================================================================
  // 1. ESTADO GLOBAL DO MÓDULO ELEIÇÕES 2026
  // =========================================================================
  const State = {
    initialized: false,
    loading: false,

    // Hierarquia Territorial Centralizada
    territorio: {
      regiao: '',        // '' = São José dos Campos (todas)
      bairro: '',        // '' = todos os bairros da região / município
      localId: '',       // '' = todos os locais (ID_LOCAL_TERRITORIAL ex: "127|1015")
      secao: ''          // '' = todas as seções (NR_SECAO)
    },

    // Filtros Eleitorais
    eleicao: {
      cargo: 'Presidente',   // Presidente, Governador, Senador, Deputado Federal, Deputado Estadual
      candidatoId: '',       // NR_VOTAVEL
      partido: '',           // SG_PARTIDO
      basePercentual: 'validos', // 'validos' | 'total'
      detalheCandidatoId: null,  // Candidato ativo no painel de inteligência territorial (bairros/regiões)
      buscaBairroCand: '',      // Busca textual por bairro no detalhamento
      ordemBairroCand: 'votos_desc' // 'votos_desc' | 'pct_desc' | 'nome_asc'
    },

    // Perfil Demográfico
    perfil: {
      dimensao: 'faixa_etaria' // faixa_etaria, genero, escolaridade, estado_civil, raca_cor, identidade_genero
    },

    // Mapa Leaflet
    mapa: {
      metrica: 'abstencao',  // 'abstencao', 'comparecimento', 'aptos', 'candidato'
      leafletMap: null,
      markersGroup: null,
      selectedMarker: null
    },

    // Comparação Territorial (A x B)
    comparacao: {
      territorioA: 'Região:Sul',
      territorioB: 'Região:Centro'
    },

    // Sondagem de Opinião Pública (Pesquisa Radar São José N=477)
    pesquisaRadar: {
      dimensaoRecorte: 'por_regiao', // por_regiao, por_idade, por_genero, por_renda, por_trabalho, por_posicao_politica
      data: null
    },

    // Instâncias Chart.js
    charts: {
      abstencao: null,
      distribuicao: null,
      perfil: null,
      resultados: null,
      pesquisaEspectro: null,
      pesquisaInteresse: null
    },

    // Cache e Armazenamento dos Dados Homologados
    data: {
      kpis: null,
      locais: [],
      bairros: [],
      secoesPorLocal: {},
      votosRegiao: [],
      perfilRegiao: [],
      pesquisaRadar: null,
      // Lazy-loaded data
      votosBairro: null,
      votosLocal: null,
      perfilBairro: null,
      perfilLocal: null,
      porSecaoVotos: null,
      porSecaoPerfil: null
    }
  };

  window.Eleicoes2026State = State;

  // Constantes Oficiais do Pacote Homologado
  const CANONICAL = {
    ELEITORADO_CADASTRADO: 539147,
    APTOS_BU_ESTADUAL: 538797,
    COMPARECIMENTO_BU_ESTADUAL: 437624,
    ABSTENCOES_BU_ESTADUAL: 101173,
    TAXA_ABSTENCAO_PCT: 18.78,
    TAXA_COMPARECIMENTO_PCT: 81.22,
    REGIOES_COUNT: 7,
    BAIRROS_COUNT: 86,
    LOCAIS_COUNT: 144,
    SECOES_CADASTRADAS: 1562,
    SECOES_BU_ESTADUAL: 1561,
    REGIOES: [
      'Centro',
      'Norte',
      'Leste',
      'Sudeste',
      'Sul',
      'Oeste',
      'São Francisco Xavier'
    ],
    REGIAO_COLORS: {
      'Centro': '#3B82F6',
      'Norte': '#10B981',
      'Leste': '#06B6D4',
      'Sudeste': '#F59E0B',
      'Sul': '#6366F1',
      'Oeste': '#8B5CF6',
      'São Francisco Xavier': '#EC4899'
    },
    PARTIDO_COLORS: {
      'PL': '#2255A4',
      'PT': '#CC1414',
      'AVANTE': '#E55812',
      'MISSÃO': '#1E293B',
      'PSD': '#009739',
      'NOVO': '#FF6600',
      'UP': '#6B2D5C',
      'PSTU': '#C8102E',
      'DC': '#003399',
      'PCO': '#B22222',
      'PCB': '#D00000',
      'PRTB': '#008000',
      'REPUBLICANOS': '#0B3B60',
      'UNIÃO': '#0055A5',
      'PSOL': '#FFCC00',
      'MDB': '#00843D',
      'CIDADANIA': '#EE1C25',
      'PP': '#114B82',
      'PSB': '#FFBE00',
      'REDE': '#00A859',
      'PODE': '#0083CA'
    }
  };

  // =========================================================================
  // 2. DATA LOADER EM NÍVEIS (TIERED / LAZY LOADING OTIMIZADO)
  // =========================================================================
  const DataLoader = {
    // Carregamento primário rápido (< 3.8 MB total)
    async loadPrimaryData() {
      showProgressBar(20);
      setLoading(true);

      try {
        const basePath = 'pacote_antigravity_eleicoes_2026';

        const [kpisRes, locaisRes, bairrosRes, secoesRes, votosRegRes, perfilRegRes] = await Promise.all([
          fetch(`${basePath}/kpis.json`).then(r => r.json()),
          fetch(`${basePath}/data/territorios/locais.json`).then(r => r.json()),
          fetch(`${basePath}/data/territorios/bairros.json`).then(r => r.json()),
          fetch(`${basePath}/data/territorios/secoes_por_local.json`).then(r => r.json()).catch(() => ({})),
          fetch(`${basePath}/data/votos/por_regiao.json`).then(r => r.json()),
          fetch(`${basePath}/data/perfil/por_regiao.json`).then(r => r.json())
        ]);

        State.data.kpis = kpisRes;
        State.data.locais = locaisRes;
        State.data.bairros = bairrosRes;
        State.data.secoesPorLocal = secoesRes;
        State.data.votosRegiao = votosRegRes;
        State.data.perfilRegiao = perfilRegRes;

        showProgressBar(80);
        return true;
      } catch (err) {
        console.error('[Eleições 2026] Erro fatal no carregamento de dados primários:', err);
        return false;
      } finally {
        setLoading(false);
        showProgressBar(100);
      }
    },

    // Lazy load para dados por bairro
    async loadBairroData() {
      if (State.data.votosBairro && State.data.perfilBairro) return true;
      setLoading(true);
      showProgressBar(30);
      try {
        const basePath = 'pacote_antigravity_eleicoes_2026';
        const [votosB, perfilB] = await Promise.all([
          State.data.votosBairro ? Promise.resolve(State.data.votosBairro) : fetch(`${basePath}/data/votos/por_bairro.json`).then(r => r.json()),
          State.data.perfilBairro ? Promise.resolve(State.data.perfilBairro) : fetch(`${basePath}/data/perfil/por_bairro.json`).then(r => r.json())
        ]);
        State.data.votosBairro = votosB;
        State.data.perfilBairro = perfilB;
        showProgressBar(100);
        return true;
      } catch (err) {
        console.error('[Eleições 2026] Erro ao carregar dados por bairro:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },

    // Lazy load para dados por local
    async loadLocalData() {
      if (State.data.votosLocal && State.data.perfilLocal) return true;
      setLoading(true);
      showProgressBar(30);
      try {
        const basePath = 'pacote_antigravity_eleicoes_2026';
        const [votosL, perfilL] = await Promise.all([
          State.data.votosLocal ? Promise.resolve(State.data.votosLocal) : fetch(`${basePath}/data/votos/por_local.json`).then(r => r.json()),
          State.data.perfilLocal ? Promise.resolve(State.data.perfilLocal) : fetch(`${basePath}/data/perfil/por_local.json`).then(r => r.json())
        ]);
        State.data.votosLocal = votosL;
        State.data.perfilLocal = perfilL;
        showProgressBar(100);
        return true;
      } catch (err) {
        console.error('[Eleições 2026] Erro ao carregar dados por local:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },

    // Lazy load seções granulares caso o usuário filtre até uma seção
    async loadSecaoData() {
      if (State.data.porSecaoVotos) return true;
      setLoading(true);
      showProgressBar(40);
      try {
        const basePath = 'pacote_antigravity_eleicoes_2026';
        const text = await fetch(`${basePath}/data/votos/por_secao.csv`).then(r => r.text());
        // Parse CSV em linhas
        const lines = text.split('\n');
        const header = lines[0].replace(/\r/g, '').split(';');
        const idLocIdx = header.indexOf('ID_LOCAL_TERRITORIAL');
        const nrSecIdx = header.indexOf('NR_SECAO');
        const cargoIdx = header.indexOf('DS_CARGO_PERGUNTA');
        const tpVotIdx = header.indexOf('CD_TIPO_VOTAVEL');
        const dsTpVotIdx = header.indexOf('DS_TIPO_VOTAVEL');
        const nrVotIdx = header.indexOf('NR_VOTAVEL');
        const nmVotIdx = header.indexOf('NM_VOTAVEL');
        const sgPartIdx = header.indexOf('SG_PARTIDO');
        const qtVotIdx = header.indexOf('QT_VOTOS');
        const dsDestFinalIdx = header.indexOf('DS_DESTINACAO_FINAL');
        const stValidoFinalIdx = header.indexOf('ST_VOTO_VALIDO_FINAL');
        const dsDestTseIdx = header.indexOf('DS_DESTINACAO_TSE');
        const nmCandOficialIdx = header.indexOf('NM_CANDIDATO_OFICIAL');
        const sqCandOficialIdx = header.indexOf('SQ_CANDIDATO_OFICIAL');

        const map = new Map();
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = l.split(';');
          const key = `${cols[idLocIdx]}|${cols[nrSecIdx]}`;
          if (!map.has(key)) map.set(key, []);
          const isValido = cols[stValidoFinalIdx] === 'True' || cols[stValidoFinalIdx] === 'true' || cols[stValidoFinalIdx] === true;
          map.get(key).push({
            cargo: cols[cargoIdx],
            cdTipoVotavel: Number(cols[tpVotIdx]),
            dsTipoVotavel: cols[dsTpVotIdx],
            nrVotavel: Number(cols[nrVotIdx]),
            nmVotavel: cols[nmVotIdx],
            sgPartido: cols[sgPartIdx],
            qtVotos: Number(cols[qtVotIdx]),
            dsDestinacaoFinal: cols[dsDestFinalIdx] || '',
            stVotoValidoFinal: isValido,
            dsDestinacaoTse: cols[dsDestTseIdx] || '',
            nmCandidatoOficial: cols[nmCandOficialIdx] || cols[nmVotIdx],
            sqCandidatoOficial: cols[sqCandOficialIdx] || ''
          });
        }
        State.data.porSecaoVotos = map;
        showProgressBar(100);
        return true;
      } catch (err) {
        console.error('[Eleições 2026] Erro ao carregar seções CSV:', err);
        return false;
      } finally {
        setLoading(false);
      }
    }
  };

  // =========================================================================
  // 3. CÁLCULO E REGRAS METODOLÓGICAS (SISTOT / VOTOS VÁLIDOS, TOTAL BU, UNIVERSOS)
  // =========================================================================
  const Metrics = {
    // Determina se um voto é válido conforme a reconciliação oficial SISTOT/TSE
    isVotoValido(item) {
      if (!item) return false;
      if (typeof item === 'object') {
        if (item.ST_VOTO_VALIDO_FINAL !== undefined) {
          return item.ST_VOTO_VALIDO_FINAL === true || item.ST_VOTO_VALIDO_FINAL === 'True' || item.ST_VOTO_VALIDO_FINAL === 'true';
        }
        if (item.stVotoValidoFinal !== undefined) {
          return item.stVotoValidoFinal === true || item.stVotoValidoFinal === 'True' || item.stVotoValidoFinal === 'true';
        }
        if (item.DS_DESTINACAO_FINAL) {
          return item.DS_DESTINACAO_FINAL === 'VALIDO_NOMINAL' || item.DS_DESTINACAO_FINAL === 'VALIDO_LEGENDA';
        }
        if (item.dsDestinacaoFinal) {
          return item.dsDestinacaoFinal === 'VALIDO_NOMINAL' || item.dsDestinacaoFinal === 'VALIDO_LEGENDA';
        }
      }
      return false;
    },

    // Agrega votos de acordo com o nível territorial selecionado
    async getVotosTerritorio() {
      const { regiao, bairro, localId, secao } = State.territorio;
      const cargo = State.eleicao.cargo;

      // Nível 4: Seção específica
      if (secao && localId) {
        await DataLoader.loadSecaoData();
        const key = `${localId}|${secao}`;
        const raw = State.data.porSecaoVotos ? (State.data.porSecaoVotos.get(key) || []) : [];
        return raw.filter(r => r.cargo === cargo).map(r => ({
          CD_CARGO_PERGUNTA: 0,
          DS_CARGO_PERGUNTA: r.cargo,
          CD_TIPO_VOTAVEL: r.cdTipoVotavel,
          DS_TIPO_VOTAVEL: r.dsTipoVotavel,
          NR_VOTAVEL: r.nrVotavel,
          NM_VOTAVEL: r.nmVotavel,
          SG_PARTIDO: r.sgPartido,
          QT_VOTOS: r.qtVotos,
          DS_DESTINACAO_FINAL: r.dsDestinacaoFinal,
          ST_VOTO_VALIDO_FINAL: r.stVotoValidoFinal,
          DS_DESTINACAO_TSE: r.dsDestinacaoTse,
          NM_CANDIDATO_OFICIAL: r.nmCandidatoOficial,
          SQ_CANDIDATO_OFICIAL: r.sqCandidatoOficial
        }));
      }

      // Nível 3: Local de Votação
      if (localId) {
        await DataLoader.loadLocalData();
        const raw = State.data.votosLocal || [];
        return raw.filter(r => r.ID_LOCAL_TERRITORIAL === localId && r.DS_CARGO_PERGUNTA === cargo);
      }

      // Nível 2: Bairro Analítico
      if (bairro) {
        await DataLoader.loadBairroData();
        const raw = State.data.votosBairro || [];
        return raw.filter(r => r.ID_BAIRRO_TERRITORIAL === bairro && r.DS_CARGO_PERGUNTA === cargo);
      }

      // Nível 1: Região
      if (regiao) {
        const raw = State.data.votosRegiao || [];
        return raw.filter(r => r.REGIAO_SJC === regiao && r.DS_CARGO_PERGUNTA === cargo);
      }

      // Nível 0: Município inteiro (São José dos Campos)
      // Agrega todos os registros das 7 regiões por votável e destinação final oficial
      const raw = State.data.votosRegiao || [];
      const filtered = raw.filter(r => r.DS_CARGO_PERGUNTA === cargo);
      const agg = new Map();

      for (const r of filtered) {
        const dest = r.DS_DESTINACAO_FINAL || '';
        const key = `${r.NR_VOTAVEL}|${r.CD_TIPO_VOTAVEL}|${dest}`;
        if (!agg.has(key)) {
          const isValido = r.ST_VOTO_VALIDO_FINAL === true || r.ST_VOTO_VALIDO_FINAL === 'True' || r.ST_VOTO_VALIDO_FINAL === 'true';
          agg.set(key, {
            CD_CARGO_PERGUNTA: r.CD_CARGO_PERGUNTA,
            DS_CARGO_PERGUNTA: r.DS_CARGO_PERGUNTA,
            CD_TIPO_VOTAVEL: r.CD_TIPO_VOTAVEL,
            DS_TIPO_VOTAVEL: r.DS_TIPO_VOTAVEL,
            NR_VOTAVEL: r.NR_VOTAVEL,
            NM_VOTAVEL: r.NM_VOTAVEL,
            NR_PARTIDO: r.NR_PARTIDO,
            SG_PARTIDO: r.SG_PARTIDO,
            NM_PARTIDO: r.NM_PARTIDO,
            DS_DESTINACAO_FINAL: dest,
            ST_VOTO_VALIDO_FINAL: isValido,
            DS_DESTINACAO_TSE: r.DS_DESTINACAO_TSE,
            NM_CANDIDATO_OFICIAL: r.NM_CANDIDATO_OFICIAL,
            SQ_CANDIDATO_OFICIAL: r.SQ_CANDIDATO_OFICIAL,
            QT_VOTOS: 0
          });
        }
        agg.get(key).QT_VOTOS += (r.QT_VOTOS || 0);
      }
      return Array.from(agg.values());
    },

    // Totaliza apuração com reconciliação oficial SISTOT/TSE (Votos Válidos, Nominais, Legenda, Brancos, Nulos Finais, Técnicos, Sub Judice)
    computeApuracao(votos, cargo) {
      let validosNominais = 0;
      let validosLegenda = 0;
      let brancos = 0;
      let nulosUrna = 0;
      let nulosTecnicos = 0;
      let anuladosSubJudice = 0;
      let anulados = 0;
      let totalBU = 0;

      for (const v of votos) {
        const qtd = v.QT_VOTOS || 0;
        totalBU += qtd;
        const dest = v.DS_DESTINACAO_FINAL || '';
        const isValido = v.ST_VOTO_VALIDO_FINAL === true || v.ST_VOTO_VALIDO_FINAL === 'True' || v.ST_VOTO_VALIDO_FINAL === 'true';

        if (dest === 'VALIDO_NOMINAL' || (isValido && v.CD_TIPO_VOTAVEL === 1)) {
          validosNominais += qtd;
        } else if (dest === 'VALIDO_LEGENDA' || (isValido && v.CD_TIPO_VOTAVEL === 4)) {
          validosLegenda += qtd;
        } else if (dest === 'BRANCO' || v.CD_TIPO_VOTAVEL === 2) {
          brancos += qtd;
        } else if (dest === 'NULO_URNA') {
          nulosUrna += qtd;
        } else if (dest === 'NULO_TECNICO') {
          nulosTecnicos += qtd;
        } else if (dest === 'NULO_FINAL' || v.CD_TIPO_VOTAVEL === 3) {
          nulosUrna += qtd;
        } else if (dest === 'ANULADO_SUB_JUDICE') {
          anuladosSubJudice += qtd;
        } else if (dest === 'ANULADO') {
          anulados += qtd;
        }
      }

      const validos = validosNominais + validosLegenda;
      const nulosFinais = nulosUrna + nulosTecnicos;

      return {
        validosNominais,
        validosLegenda,
        nominais: validosNominais,
        legenda: validosLegenda,
        validos,
        brancos,
        nulosUrna,
        nulosTecnicos,
        nulosFinais,
        nulos: nulosFinais,
        anuladosSubJudice,
        anulados,
        totalBU,
        pctValidos: totalBU > 0 ? (validos / totalBU) * 100 : 0,
        pctBrancos: totalBU > 0 ? (brancos / totalBU) * 100 : 0,
        pctNulosFinais: totalBU > 0 ? (nulosFinais / totalBU) * 100 : 0
      };
    },

    // Retorna os indicadores de comparecimento/abstenção para o território ativo
    getTerritorioStats() {
      const { regiao, bairro, localId, secao } = State.territorio;

      if (localId) {
        const loc = State.data.locais.find(l => l.ID_LOCAL_TERRITORIAL === localId);
        if (loc) {
          return {
            nome: loc.NM_LOCAL_VOTACAO,
            eleitoradoCadastrado: loc.ELEITORADO_CADASTRADO_NO_LOCAL,
            aptos: loc.APTOS_BU_ESTADUAL,
            comparecimento: loc.COMPARECIMENTO_BU_ESTADUAL,
            abstencoes: loc.ABSTENCOES_BU_ESTADUAL,
            taxaAbstencao: loc.TAXA_ABSTENCAO_PCT,
            taxaComparecimento: loc.TAXA_COMPARECIMENTO_PCT,
            qtdLocais: 1,
            qtdSecoes: loc.QTD_SECOES_CADASTRADAS
          };
        }
      }

      if (bairro) {
        const b = State.data.bairros.find(x => x.ID_BAIRRO_TERRITORIAL === bairro);
        if (b) {
          return {
            nome: b.BAIRRO_ANALITICO,
            eleitoradoCadastrado: b.ELEITORADO_CADASTRADO_NO_LOCAL,
            aptos: b.APTOS_BU_ESTADUAL,
            comparecimento: b.COMPARECIMENTO_BU_ESTADUAL,
            abstencoes: b.ABSTENCOES_BU_ESTADUAL,
            taxaAbstencao: b.TAXA_ABSTENCAO_PCT,
            taxaComparecimento: b.TAXA_COMPARECIMENTO_PCT,
            qtdLocais: b.LOCAIS,
            qtdSecoes: State.data.locais.filter(l => l.ID_BAIRRO_TERRITORIAL === bairro).reduce((acc, l) => acc + l.QTD_SECOES_CADASTRADAS, 0)
          };
        }
      }

      if (regiao) {
        const locaisReg = State.data.locais.filter(l => l.REGIAO_SJC === regiao);
        const aptos = locaisReg.reduce((a, l) => a + l.APTOS_BU_ESTADUAL, 0);
        const comp = locaisReg.reduce((a, l) => a + l.COMPARECIMENTO_BU_ESTADUAL, 0);
        const abst = locaisReg.reduce((a, l) => a + l.ABSTENCOES_BU_ESTADUAL, 0);
        const cad = locaisReg.reduce((a, l) => a + l.ELEITORADO_CADASTRADO_NO_LOCAL, 0);
        const secoes = locaisReg.reduce((a, l) => a + l.QTD_SECOES_CADASTRADAS, 0);

        return {
          nome: `Região ${regiao}`,
          eleitoradoCadastrado: cad,
          aptos,
          comparecimento: comp,
          abstencoes: abst,
          taxaAbstencao: aptos > 0 ? (abst / aptos) * 100 : 0,
          taxaComparecimento: aptos > 0 ? (comp / aptos) * 100 : 0,
          qtdLocais: locaisReg.length,
          qtdSecoes: secoes
        };
      }

      // Padrão: Todo o Município
      return {
        nome: 'São José dos Campos',
        eleitoradoCadastrado: CANONICAL.ELEITORADO_CADASTRADO,
        aptos: CANONICAL.APTOS_BU_ESTADUAL,
        comparecimento: CANONICAL.COMPARECIMENTO_BU_ESTADUAL,
        abstencoes: CANONICAL.ABSTENCOES_BU_ESTADUAL,
        taxaAbstencao: CANONICAL.TAXA_ABSTENCAO_PCT,
        taxaComparecimento: CANONICAL.TAXA_COMPARECIMENTO_PCT,
        qtdLocais: CANONICAL.LOCAIS_COUNT,
        qtdSecoes: CANONICAL.SECOES_CADASTRADAS
      };
    },

    // Retorna perfil demográfico do território ativo
    async getPerfilTerritorio() {
      const { regiao, bairro, localId } = State.territorio;
      const dimensao = State.perfil.dimensao;

      if (localId) {
        await DataLoader.loadLocalData();
        const raw = State.data.perfilLocal || [];
        return raw.filter(r => r.ID_LOCAL_TERRITORIAL === localId && r.DIMENSAO === dimensao);
      }

      if (bairro) {
        await DataLoader.loadBairroData();
        const raw = State.data.perfilBairro || [];
        return raw.filter(r => r.ID_BAIRRO_TERRITORIAL === bairro && r.DIMENSAO === dimensao);
      }

      if (regiao) {
        const raw = State.data.perfilRegiao || [];
        return raw.filter(r => r.REGIAO_SJC === regiao && r.DIMENSAO === dimensao);
      }

      // Município inteiro: agregar por categoria
      const raw = State.data.perfilRegiao || [];
      const filtered = raw.filter(r => r.DIMENSAO === dimensao);
      const agg = new Map();

      for (const r of filtered) {
        if (!agg.has(r.CATEGORIA)) {
          agg.set(r.CATEGORIA, {
            DIMENSAO: dimensao,
            CATEGORIA: r.CATEGORIA,
            ELEITORES: 0
          });
        }
        agg.get(r.CATEGORIA).ELEITORES += r.ELEITORES;
      }

      const total = CANONICAL.ELEITORADO_CADASTRADO;
      return Array.from(agg.values()).map(item => ({
        ...item,
        TOTAL_ELEITORES_DIMENSAO_TERRITORIO: total,
        PERCENTUAL: total > 0 ? (item.ELEITORES / total) * 100 : 0
      }));
    }
  };

  // =========================================================================
  // 4. CONTROLADOR DE FILTROS HIERÁRQUICOS EM CASCATA
  // =========================================================================
  const Filters = {
    init() {
      const selRegiao = document.getElementById('filterEleicaoRegiao');
      const selBairro = document.getElementById('filterEleicaoBairro');
      const selLocal = document.getElementById('filterEleicaoLocal');
      const selSecao = document.getElementById('filterEleicaoSecao');
      const selCargo = document.getElementById('filterEleicaoCargo');
      const selCandidato = document.getElementById('filterEleicaoCandidato');
      const inputBusca = document.getElementById('filterEleicaoBusca');
      const btnLimpar = document.getElementById('btnLimparFiltrosEleicoes');
      const selOrdemAbst = document.getElementById('selectOrdemAbstencao');
      const inputBuscaBairrosCand = document.getElementById('inputBuscaBairrosCand');
      const selectOrdemBairrosCand = document.getElementById('selectOrdemBairrosCand');

      if (selRegiao) selRegiao.addEventListener('change', () => this.onRegiaoChange());
      if (selBairro) selBairro.addEventListener('change', () => this.onBairroChange());
      if (selLocal) selLocal.addEventListener('change', () => this.onLocalChange());
      if (selSecao) selSecao.addEventListener('change', () => this.onSecaoChange());
      if (selCargo) selCargo.addEventListener('change', () => this.onCargoChange());
      if (selCandidato) selCandidato.addEventListener('change', () => this.onCandidatoChange());
      if (btnLimpar) btnLimpar.addEventListener('click', () => this.resetFilters());
      if (selOrdemAbst) selOrdemAbst.addEventListener('change', () => renderAbstencaoTable());

      if (inputBuscaBairrosCand) {
        let bDebounce = null;
        inputBuscaBairrosCand.addEventListener('input', (e) => {
          clearTimeout(bDebounce);
          bDebounce = setTimeout(() => {
            State.eleicao.buscaBairroCand = e.target.value.trim().toLowerCase();
            renderTabelaBairrosDetalhamento();
          }, 200);
        });
      }

      if (selectOrdemBairrosCand) {
        selectOrdemBairrosCand.addEventListener('change', (e) => {
          State.eleicao.ordemBairroCand = e.target.value;
          renderTabelaBairrosDetalhamento();
        });
      }

      if (inputBusca) {
        let debounceTimer = null;
        inputBusca.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => this.onBuscaInput(e.target.value.trim()), 300);
        });
      }

      // Popula dropdowns iniciais
      this.populateBairrosDropdown();
      this.populateLocaisDropdown();
      this.populateCandidatosDropdown();
    },

    populateBairrosDropdown() {
      const selBairro = document.getElementById('filterEleicaoBairro');
      if (!selBairro) return;
      const regiao = State.territorio.regiao;

      let bairros = State.data.bairros || [];
      if (regiao) {
        bairros = bairros.filter(b => b.REGIAO_SJC === regiao);
      }
      bairros.sort((a, b) => a.BAIRRO_ANALITICO.localeCompare(b.BAIRRO_ANALITICO));

      selBairro.innerHTML = '<option value="">Todos os Bairros</option>';
      for (const b of bairros) {
        const opt = document.createElement('option');
        opt.value = b.ID_BAIRRO_TERRITORIAL;
        opt.textContent = `${b.BAIRRO_ANALITICO}${!regiao ? ` (${b.REGIAO_SJC})` : ''}`;
        selBairro.appendChild(opt);
      }
      selBairro.value = State.territorio.bairro || '';
    },

    populateLocaisDropdown() {
      const selLocal = document.getElementById('filterEleicaoLocal');
      if (!selLocal) return;
      const { regiao, bairro } = State.territorio;

      let locais = State.data.locais || [];
      if (bairro) {
        locais = locais.filter(l => l.ID_BAIRRO_TERRITORIAL === bairro);
      } else if (regiao) {
        locais = locais.filter(l => l.REGIAO_SJC === regiao);
      }
      locais.sort((a, b) => a.NM_LOCAL_VOTACAO.localeCompare(b.NM_LOCAL_VOTACAO));

      selLocal.innerHTML = '<option value="">Todos os Locais</option>';
      for (const l of locais) {
        const opt = document.createElement('option');
        opt.value = l.ID_LOCAL_TERRITORIAL;
        opt.textContent = `${l.NM_LOCAL_VOTACAO} — ${l.BAIRRO_ANALITICO}`;
        selLocal.appendChild(opt);
      }
      selLocal.value = State.territorio.localId || '';
    },

    populateSecoesDropdown() {
      const selSecao = document.getElementById('filterEleicaoSecao');
      if (!selSecao) return;
      const localId = State.territorio.localId;

      selSecao.innerHTML = '<option value="">Todas as Seções</option>';
      if (localId && State.data.secoesPorLocal && State.data.secoesPorLocal[localId]) {
        const secoes = State.data.secoesPorLocal[localId];
        for (const sec of secoes) {
          const opt = document.createElement('option');
          opt.value = String(sec);
          opt.textContent = `Seção ${sec}`;
          selSecao.appendChild(opt);
        }
      }
      selSecao.value = State.territorio.secao || '';
    },

    async populateCandidatosDropdown() {
      const selCandidato = document.getElementById('filterEleicaoCandidato');
      if (!selCandidato) return;
      const cargo = State.eleicao.cargo;

      // Obtém lista única de candidatos nominais VÁLIDOS (SISTOT) para o cargo selecionado
      const votos = State.data.votosRegiao || [];
      const candMap = new Map();

      for (const v of votos) {
        if (v.DS_CARGO_PERGUNTA === cargo && Metrics.isVotoValido(v) && v.CD_TIPO_VOTAVEL === 1) {
          if (!candMap.has(v.NR_VOTAVEL)) {
            candMap.set(v.NR_VOTAVEL, {
              numero: v.NR_VOTAVEL,
              nome: v.NM_CANDIDATO_OFICIAL || v.NM_VOTAVEL,
              partido: v.SG_PARTIDO,
              totalVotos: 0
            });
          }
          candMap.get(v.NR_VOTAVEL).totalVotos += (v.QT_VOTOS || 0);
        }
      }

      const lista = Array.from(candMap.values()).sort((a, b) => b.totalVotos - a.totalVotos);

      selCandidato.innerHTML = '<option value="">Todos os Candidatos</option>';
      for (const c of lista) {
        const opt = document.createElement('option');
        opt.value = String(c.numero);
        opt.textContent = `${c.numero} - ${c.nome} (${c.partido})`;
        selCandidato.appendChild(opt);
      }
      selCandidato.value = State.eleicao.candidatoId || '';
    },

    // 1. Cascata: Região mudou
    onRegiaoChange() {
      const val = document.getElementById('filterEleicaoRegiao').value;
      State.territorio.regiao = val;
      // Limpa seleções inferiores
      State.territorio.bairro = '';
      State.territorio.localId = '';
      State.territorio.secao = '';

      this.populateBairrosDropdown();
      this.populateLocaisDropdown();
      this.populateSecoesDropdown();
      updateBreadcrumb();
      renderAll();
    },

    // 2. Cascata: Bairro mudou
    onBairroChange() {
      const val = document.getElementById('filterEleicaoBairro').value;
      State.territorio.bairro = val;
      // Se selecionou bairro, sincroniza região pai se não estiver setada
      if (val) {
        const b = State.data.bairros.find(x => x.ID_BAIRRO_TERRITORIAL === val);
        if (b && !State.territorio.regiao) {
          State.territorio.regiao = b.REGIAO_SJC;
          document.getElementById('filterEleicaoRegiao').value = b.REGIAO_SJC;
          this.populateBairrosDropdown();
          document.getElementById('filterEleicaoBairro').value = val;
        }
      }
      // Limpa seleções inferiores
      State.territorio.localId = '';
      State.territorio.secao = '';

      this.populateLocaisDropdown();
      this.populateSecoesDropdown();
      updateBreadcrumb();
      renderAll();
    },

    // 3. Cascata: Local mudou
    onLocalChange() {
      const val = document.getElementById('filterEleicaoLocal').value;
      State.territorio.localId = val;
      // Se selecionou local, sincroniza região e bairro se necessário
      if (val) {
        const loc = State.data.locais.find(l => l.ID_LOCAL_TERRITORIAL === val);
        if (loc) {
          if (State.territorio.regiao !== loc.REGIAO_SJC) {
            State.territorio.regiao = loc.REGIAO_SJC;
            document.getElementById('filterEleicaoRegiao').value = loc.REGIAO_SJC;
            this.populateBairrosDropdown();
          }
          if (State.territorio.bairro !== loc.ID_BAIRRO_TERRITORIAL) {
            State.territorio.bairro = loc.ID_BAIRRO_TERRITORIAL;
            document.getElementById('filterEleicaoBairro').value = loc.ID_BAIRRO_TERRITORIAL;
            this.populateLocaisDropdown();
            document.getElementById('filterEleicaoLocal').value = val;
          }
        }
      }
      State.territorio.secao = '';
      this.populateSecoesDropdown();
      updateBreadcrumb();
      
      // Centraliza mapa no local
      if (val && State.mapa.leafletMap) {
        const loc = State.data.locais.find(l => l.ID_LOCAL_TERRITORIAL === val);
        if (loc && loc.LATITUDE_NUM && loc.LONGITUDE_NUM) {
          State.mapa.leafletMap.flyTo([loc.LATITUDE_NUM, loc.LONGITUDE_NUM], 15, { duration: 0.8 });
        }
      }
      renderAll();
    },

    // 4. Cascata: Seção mudou
    onSecaoChange() {
      const val = document.getElementById('filterEleicaoSecao').value;
      State.territorio.secao = val;
      updateBreadcrumb();
      renderAll();
    },

    // 5. Cargo mudou
    onCargoChange() {
      const val = document.getElementById('filterEleicaoCargo').value;
      State.eleicao.cargo = val;
      State.eleicao.candidatoId = '';
      State.eleicao.partido = '';
      State.eleicao.detalheCandidatoId = null;

      const lblCargo = document.getElementById('lblCargoResultados');
      if (lblCargo) lblCargo.textContent = val;
      const lblCompara = document.getElementById('lblComparaCargo');
      if (lblCompara) lblCompara.textContent = val;

      this.populateCandidatosDropdown();
      renderAll();
    },

    // 6. Candidato mudou
    onCandidatoChange() {
      const val = document.getElementById('filterEleicaoCandidato').value;
      State.eleicao.candidatoId = val;
      renderAll();
    },

    // 7. Busca rápida
    onBuscaInput(query) {
      if (!query) return;
      const q = query.toLowerCase();

      // Procura primeiro por local de votação
      const matchLocal = State.data.locais.find(l =>
        l.NM_LOCAL_VOTACAO.toLowerCase().includes(q) ||
        l.DS_ENDERECO.toLowerCase().includes(q)
      );

      if (matchLocal) {
        State.territorio.regiao = matchLocal.REGIAO_SJC;
        State.territorio.bairro = matchLocal.ID_BAIRRO_TERRITORIAL;
        State.territorio.localId = matchLocal.ID_LOCAL_TERRITORIAL;
        State.territorio.secao = '';

        document.getElementById('filterEleicaoRegiao').value = matchLocal.REGIAO_SJC;
        this.populateBairrosDropdown();
        document.getElementById('filterEleicaoBairro').value = matchLocal.ID_BAIRRO_TERRITORIAL;
        this.populateLocaisDropdown();
        document.getElementById('filterEleicaoLocal').value = matchLocal.ID_LOCAL_TERRITORIAL;
        this.populateSecoesDropdown();
        updateBreadcrumb();
        renderAll();
        return;
      }

      // Procura por bairro analítico
      const matchBairro = State.data.bairros.find(b =>
        b.BAIRRO_ANALITICO.toLowerCase().includes(q)
      );
      if (matchBairro) {
        State.territorio.regiao = matchBairro.REGIAO_SJC;
        State.territorio.bairro = matchBairro.ID_BAIRRO_TERRITORIAL;
        State.territorio.localId = '';
        State.territorio.secao = '';

        document.getElementById('filterEleicaoRegiao').value = matchBairro.REGIAO_SJC;
        this.populateBairrosDropdown();
        document.getElementById('filterEleicaoBairro').value = matchBairro.ID_BAIRRO_TERRITORIAL;
        this.populateLocaisDropdown();
        this.populateSecoesDropdown();
        updateBreadcrumb();
        renderAll();
        return;
      }

      // Procura por candidato no cargo ativo
      const votos = State.data.votosRegiao || [];
      const matchCand = votos.find(v =>
        v.DS_CARGO_PERGUNTA === State.eleicao.cargo &&
        v.CD_TIPO_VOTAVEL === 1 &&
        (v.NM_VOTAVEL.toLowerCase().includes(q) || String(v.NR_VOTAVEL) === q)
      );
      if (matchCand) {
        State.eleicao.candidatoId = String(matchCand.NR_VOTAVEL);
        document.getElementById('filterEleicaoCandidato').value = String(matchCand.NR_VOTAVEL);
        renderAll();
      }
    },

    // 8. Botão Limpar Filtros
    resetFilters() {
      State.territorio.regiao = '';
      State.territorio.bairro = '';
      State.territorio.localId = '';
      State.territorio.secao = '';
      State.eleicao.cargo = 'Presidente';
      State.eleicao.candidatoId = '';
      State.eleicao.partido = '';
      State.eleicao.detalheCandidatoId = null;
      State.eleicao.buscaBairroCand = '';

      document.getElementById('filterEleicaoRegiao').value = '';
      document.getElementById('filterEleicaoCargo').value = 'Presidente';
      const inputBusca = document.getElementById('filterEleicaoBusca');
      if (inputBusca) inputBusca.value = '';
      const inputBuscaBairrosCand = document.getElementById('inputBuscaBairrosCand');
      if (inputBuscaBairrosCand) inputBuscaBairrosCand.value = '';

      this.populateBairrosDropdown();
      this.populateLocaisDropdown();
      this.populateSecoesDropdown();
      this.populateCandidatosDropdown();

      updateBreadcrumb();
      if (State.mapa.leafletMap) {
        State.mapa.leafletMap.setView([-23.205, -45.885], 11);
      }
      renderAll();
    }
  };

  // =========================================================================
  // 5. ATUALIZAÇÃO VISUAL DE CONTEXTO (BREADCRUMB)
  // =========================================================================
  function updateBreadcrumb() {
    const el = document.getElementById('breadcrumbTerritorioText');
    const lblKpi = document.getElementById('labelContextoKpis');
    if (!el) return;

    const { regiao, bairro, localId, secao } = State.territorio;
    let parts = ['São José dos Campos'];

    if (regiao) {
      parts.push(`Região ${regiao}`);
    }
    if (bairro) {
      const b = State.data.bairros.find(x => x.ID_BAIRRO_TERRITORIAL === bairro);
      if (b) parts.push(b.BAIRRO_ANALITICO);
    }
    if (localId) {
      const loc = State.data.locais.find(l => l.ID_LOCAL_TERRITORIAL === localId);
      if (loc) parts.push(loc.NM_LOCAL_VOTACAO);
    }
    if (secao) {
      parts.push(`Seção ${secao}`);
    }

    const text = parts.join(' › ');
    el.textContent = text;
    if (lblKpi) lblKpi.textContent = text;
  }

  // =========================================================================
  // 6. RENDERIZADORES DAS SEÇÕES VISUAIS
  // =========================================================================

  // --- SEÇÃO 1: VISÃO GERAL & KPIS ---
  function renderKPIs() {
    const stats = Metrics.getTerritorioStats();

    const elCad = document.getElementById('kpiEleitoradoCadastrado');
    const elApt = document.getElementById('kpiAptosBU');
    const elComp = document.getElementById('kpiComparecimento');
    const elCompTaxa = document.getElementById('kpiTaxaComparecimento');
    const elAbst = document.getElementById('kpiAbstencoes');
    const elAbstTaxa = document.getElementById('kpiTaxaAbstencao');
    const elLoc = document.getElementById('kpiQtdLocais');
    const elSec = document.getElementById('kpiQtdSecoes');

    if (elCad) elCad.textContent = formatNumber(stats.eleitoradoCadastrado);
    if (elApt) elApt.textContent = formatNumber(stats.aptos);
    if (elComp) elComp.textContent = formatNumber(stats.comparecimento);
    if (elCompTaxa) elCompTaxa.textContent = `${formatPercent(stats.taxaComparecimento)} de participação`;
    if (elAbst) elAbst.textContent = formatNumber(stats.abstencoes);
    if (elAbstTaxa) elAbstTaxa.textContent = `${formatPercent(stats.taxaAbstencao)} de abstenção`;
    if (elLoc) elLoc.textContent = formatNumber(stats.qtdLocais);
    if (elSec) elSec.textContent = `${formatNumber(stats.qtdSecoes)} seções cadastradas`;
  }

  // --- SEÇÃO 2: ABSTENÇÃO REGIONAL ---
  function renderAbstencaoSection() {
    renderAbstencaoChart();
    renderAbstencaoTable();
  }

  function renderAbstencaoChart() {
    const canvas = document.getElementById('chartEleicoesAbstencaoCanvas');
    if (!canvas || !window.Chart) return;

    // Dados oficiais homologados por região
    const dados = [
      { regiao: 'Centro', taxa: 19.83 },
      { regiao: 'Norte', taxa: 18.96 },
      { regiao: 'Leste', taxa: 18.71 },
      { regiao: 'Sudeste', taxa: 19.16 },
      { regiao: 'Sul', taxa: 18.42 },
      { regiao: 'Oeste', taxa: 17.77 },
      { regiao: 'São Francisco Xavier', taxa: 22.67 }
    ];

    const labels = dados.map(d => d.regiao);
    const valores = dados.map(d => d.taxa);
    const cores = labels.map(l => CANONICAL.REGIAO_COLORS[l] || '#3B82F6');

    if (State.charts.abstencao) {
      State.charts.abstencao.destroy();
    }

    const ctx = canvas.getContext('2d');
    State.charts.abstencao = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Taxa de Abstenção (%)',
          data: valores,
          backgroundColor: cores,
          borderRadius: 8,
          barPercentage: 0.65
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => `Abstenção: ${item.raw.toFixed(2)}% (Média municipal: 18,78%)`
            }
          }
        },
        scales: {
          x: {
            min: 15,
            max: 25,
            ticks: {
              callback: (v) => `${v}%`,
              font: { family: 'Inter', size: 10 }
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          y: {
            ticks: { font: { family: 'Inter', size: 11, weight: 'bold' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderAbstencaoTable() {
    const tbody = document.getElementById('tbodyAbstencaoRegioes');
    const selectOrdem = document.getElementById('selectOrdemAbstencao');
    if (!tbody) return;

    // Matriz homologada das 7 regiões
    let regioes = [
      { regiao: 'Centro', locais: 22, aptos: 74286, comp: 59554, abst: 14732, taxaAbst: 19.83, taxaComp: 80.17 },
      { regiao: 'Norte', locais: 21, aptos: 58745, comp: 47607, abst: 11138, taxaAbst: 18.96, taxaComp: 81.04 },
      { regiao: 'Leste', locais: 35, aptos: 133869, comp: 108821, abst: 25048, taxaAbst: 18.71, taxaComp: 81.29 },
      { regiao: 'Sudeste', locais: 14, aptos: 40689, comp: 32891, abst: 7798, taxaAbst: 19.16, taxaComp: 80.84 },
      { regiao: 'Sul', locais: 41, aptos: 187578, comp: 153024, abst: 34554, taxaAbst: 18.42, taxaComp: 81.58 },
      { regiao: 'Oeste', locais: 10, aptos: 40608, comp: 33390, abst: 7218, taxaAbst: 17.77, taxaComp: 82.23 },
      { regiao: 'São Francisco Xavier', locais: 1, aptos: 3022, comp: 2337, abst: 685, taxaAbst: 22.67, taxaComp: 77.33 }
    ];

    const ordem = selectOrdem ? selectOrdem.value : 'taxa_desc';
    if (ordem === 'taxa_desc') regioes.sort((a, b) => b.taxaAbst - a.taxaAbst);
    else if (ordem === 'taxa_asc') regioes.sort((a, b) => a.taxaAbst - b.taxaAbst);
    else if (ordem === 'abst_desc') regioes.sort((a, b) => b.abst - a.abst);
    else if (ordem === 'aptos_desc') regioes.sort((a, b) => b.aptos - a.aptos);
    else if (ordem === 'comp_desc') regioes.sort((a, b) => b.comp - a.comp);

    tbody.innerHTML = '';
    for (const r of regioes) {
      const isSelected = State.territorio.regiao === r.regiao;
      const tr = document.createElement('tr');
      tr.className = `hover:bg-slate-50 transition-colors ${isSelected ? 'bg-cyan-50/60 font-bold' : ''}`;

      const dotColor = CANONICAL.REGIAO_COLORS[r.regiao] || '#3B82F6';

      tr.innerHTML = `
        <td class="px-4 py-3 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${dotColor};"></span>
          <span class="font-bold text-slate-800">${r.regiao}</span>
        </td>
        <td class="px-3 py-3 text-right">${r.locais}</td>
        <td class="px-3 py-3 text-right font-display">${formatNumber(r.aptos)}</td>
        <td class="px-3 py-3 text-right font-display">${formatNumber(r.comp)}</td>
        <td class="px-3 py-3 text-right font-display text-rose-600 font-semibold">${formatNumber(r.abst)}</td>
        <td class="px-4 py-3 text-right font-display font-black text-rose-600">${formatPercent(r.taxaAbst)}</td>
        <td class="px-3 py-3 text-center">
          <button type="button" onclick="window.filtrarRegiao('${r.regiao}')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-cyan-100 hover:text-cyan-900 text-[11px] font-bold text-slate-600 transition-colors cursor-pointer" title="Filtrar dados pela Região ${r.regiao}">
            Filtrar
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  }

  // --- SEÇÃO 3: MAPA LEAFLET ---
  function initMapaLeaflet() {
    const mapContainer = document.getElementById('eleicoesLeafletMap');
    if (!mapContainer || !window.L) return;

    if (State.mapa.leafletMap) {
      State.mapa.leafletMap.invalidateSize();
      return;
    }

    // Coordenadas centrais de São José dos Campos
    const map = L.map('eleicoesLeafletMap', {
      center: [-23.205, -45.885],
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    // Tiles limpos OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Radar São José',
      maxZoom: 18
    }).addTo(map);

    State.mapa.leafletMap = map;
    State.mapa.markersGroup = L.layerGroup().addTo(map);

    renderMapaMarkers();
  }

  async function renderMapaMarkers() {
    if (!State.mapa.leafletMap || !State.mapa.markersGroup) return;

    State.mapa.markersGroup.clearLayers();
    const locais = State.data.locais || [];
    const metrica = State.mapa.metrica;
    const { regiao, bairro } = State.territorio;

    // Atualiza badge de locais visíveis
    let locaisFiltrados = locais;
    if (bairro) {
      locaisFiltrados = locais.filter(l => l.ID_BAIRRO_TERRITORIAL === bairro);
    } else if (regiao) {
      locaisFiltrados = locais.filter(l => l.REGIAO_SJC === regiao);
    }

    const badge = document.getElementById('mapLocaisCountBadge');
    if (badge) badge.textContent = `${locaisFiltrados.length} locais exibidos`;

    // Atualiza legenda
    updateMapLegend(metrica);

    // Se a métrica for votos de candidato, prepara mapa de votos por local
    let votosCandidatoPorLocal = new Map();
    if (metrica === 'candidato' && State.eleicao.candidatoId) {
      await DataLoader.loadLocalData();
      const raw = State.data.votosLocal || [];
      const numCand = Number(State.eleicao.candidatoId);
      for (const r of raw) {
        if (r.NR_VOTAVEL === numCand) {
          votosCandidatoPorLocal.set(r.ID_LOCAL_TERRITORIAL, r.QT_VOTOS);
        }
      }
    }

    for (const loc of locaisFiltrados) {
      if (!loc.LATITUDE_NUM || !loc.LONGITUDE_NUM) continue;

      let cor = '#3B82F6';
      let raio = 7;
      let valorMetricaTexto = '';

      if (metrica === 'abstencao') {
        const taxa = loc.TAXA_ABSTENCAO_PCT || 0;
        valorMetricaTexto = `Abstenção: ${taxa.toFixed(2)}%`;
        if (taxa >= 22) cor = '#E11D48';      // Rose escuro
        else if (taxa >= 19.5) cor = '#F97316'; // Laranja
        else if (taxa >= 18) cor = '#F59E0B';   // Âmbar
        else cor = '#10B981';                   // Esmeralda
        raio = Math.max(6, Math.min(13, taxa / 2));
      } else if (metrica === 'comparecimento') {
        const taxa = loc.TAXA_COMPARECIMENTO_PCT || 0;
        valorMetricaTexto = `Comparecimento: ${taxa.toFixed(2)}%`;
        if (taxa >= 82) cor = '#10B981';
        else if (taxa >= 80) cor = '#06B6D4';
        else cor = '#F59E0B';
        raio = Math.max(6, Math.min(13, (taxa - 70) / 1.5));
      } else if (metrica === 'aptos') {
        const aptos = loc.APTOS_BU_ESTADUAL || 0;
        valorMetricaTexto = `Aptos: ${formatNumber(aptos)}`;
        cor = '#6366F1';
        raio = Math.max(5, Math.min(15, aptos / 500));
      } else if (metrica === 'candidato') {
        const votos = votosCandidatoPorLocal.get(loc.ID_LOCAL_TERRITORIAL) || 0;
        valorMetricaTexto = `Votos do Candidato: ${formatNumber(votos)}`;
        cor = '#8B5CF6';
        raio = Math.max(5, Math.min(16, Math.sqrt(votos) * 1.5));
      }

      const marker = L.circleMarker([loc.LATITUDE_NUM, loc.LONGITUDE_NUM], {
        radius: raio,
        fillColor: cor,
        color: '#FFFFFF',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.8
      });

      // Conteúdo do Popup Estilizado
      const popupHtml = `
        <div class="p-3 max-w-xs text-slate-800" style="font-family: 'Inter', sans-serif;">
          <div class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-700 mb-1">
            <i class="fa-solid fa-school"></i>
            <span>${loc.REGIAO_SJC} • ${loc.BAIRRO_ANALITICO}</span>
          </div>
          <h4 class="text-sm font-black text-slate-900 leading-tight mb-1">${loc.NM_LOCAL_VOTACAO}</h4>
          <p class="text-[11px] text-slate-500 mb-3">${loc.DS_ENDERECO}</p>
          
          <div class="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 mb-3 bg-slate-50/70 p-2 rounded-lg">
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Aptos BU</span>
              <strong class="text-slate-900 font-display">${formatNumber(loc.APTOS_BU_ESTADUAL)}</strong>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Comparecimento</span>
              <strong class="text-emerald-600 font-display">${formatNumber(loc.COMPARECIMENTO_BU_ESTADUAL)} (${loc.TAXA_COMPARECIMENTO_PCT}%)</strong>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Abstenções</span>
              <strong class="text-rose-600 font-display">${formatNumber(loc.ABSTENCOES_BU_ESTADUAL)} (${loc.TAXA_ABSTENCAO_PCT}%)</strong>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Seções</span>
              <strong class="text-slate-900 font-display">${loc.QTD_SECOES_CADASTRADAS} seções</strong>
            </div>
          </div>

          <button type="button" onclick="window.filtrarLocal('${loc.ID_LOCAL_TERRITORIAL}')" class="w-full py-1.5 rounded-lg bg-[#0B2545] hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
            <i class="fa-solid fa-filter text-[10px]"></i>
            <span>Filtrar este Local</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      // Eventos
      marker.on('mouseover', () => {
        const info = document.getElementById('mapInfoBannerText');
        if (info) info.innerHTML = `<strong>${loc.NM_LOCAL_VOTACAO}</strong> (${loc.BAIRRO_ANALITICO}, Região ${loc.REGIAO_SJC}) • ${valorMetricaTexto}`;
      });

      State.mapa.markersGroup.addLayer(marker);
    }
  }

  function updateMapLegend(metrica) {
    const el = document.getElementById('mapLegendContainer');
    if (!el) return;

    if (metrica === 'abstencao') {
      el.innerHTML = `
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> < 18%</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 18% a 19.5%</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 19.5% a 22%</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-600"></span> > 22%</span>
      `;
    } else if (metrica === 'comparecimento') {
      el.innerHTML = `
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> > 82%</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> 80% a 82%</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> < 80%</span>
      `;
    } else if (metrica === 'aptos') {
      el.innerHTML = `
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Círculo proporcional ao eleitorado (aptos)</span>
      `;
    } else if (metrica === 'candidato') {
      el.innerHTML = `
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Círculo proporcional aos votos do candidato</span>
      `;
    }
  }

  // --- SEÇÃO 4: RESULTADOS ELEITORAIS ---
  let currentDetalhamentoCand = null;

  async function renderResultadosSection() {
    const cargo = State.eleicao.cargo;
    const votos = await Metrics.getVotosTerritorio();
    const apuracao = Metrics.computeApuracao(votos, cargo);

    // Atualiza cards de apuração com reconciliação oficial SISTOT
    const cardVal = document.getElementById('cardVotosValidos');
    const cardValPct = document.getElementById('cardVotosValidosPct');
    const cardNom = document.getElementById('cardVotosNominais');
    const cardNomPct = document.getElementById('cardVotosNominaisPct');
    const cardLeg = document.getElementById('cardVotosLegenda');
    const cardLegPct = document.getElementById('cardVotosLegendaPct');
    const cardBN = document.getElementById('cardVotosBrancosNulos');
    const cardBNPct = document.getElementById('cardVotosBrancosNulosPct');
    const cardTot = document.getElementById('cardVotosTotalBU');
    const cardLegWrapper = document.getElementById('cardLegendaWrapper');

    if (cardVal) cardVal.textContent = formatNumber(apuracao.validos);
    if (cardNom) cardNom.textContent = formatNumber(apuracao.validosNominais);
    if (cardLeg) cardLeg.textContent = formatNumber(apuracao.validosLegenda);
    if (cardBN) cardBN.textContent = formatNumber(apuracao.brancos + apuracao.nulosFinais);
    if (cardTot) cardTot.textContent = formatNumber(apuracao.totalBU);

    if (apuracao.totalBU > 0) {
      if (cardValPct) cardValPct.textContent = `${formatPercent(apuracao.pctValidos)} do total emitido`;
      if (cardNomPct) cardNomPct.textContent = `${formatPercent((apuracao.validosNominais / (apuracao.validos || 1)) * 100)} dos válidos`;
      if (cardLegPct) cardLegPct.textContent = `${formatPercent((apuracao.validosLegenda / (apuracao.validos || 1)) * 100)} dos válidos`;
      if (cardBNPct) cardBNPct.textContent = `${formatPercent(((apuracao.brancos + apuracao.nulosFinais) / apuracao.totalBU) * 100)} (${formatNumber(apuracao.brancos)} brancos + ${formatNumber(apuracao.nulosFinais)} nulos)`;
    }

    // Exibe ou oculta card de legenda (apenas para proporcionais)
    if (cardLegWrapper) {
      cardLegWrapper.style.display = ['Deputado Federal', 'Deputado Estadual'].includes(cargo) ? 'block' : 'none';
    }

    // Agrupa e ordena candidatos e votáveis por destinação final oficial
    const candMap = new Map();
    for (const v of votos) {
      const dest = v.DS_DESTINACAO_FINAL || '';
      const isValido = v.ST_VOTO_VALIDO_FINAL === true || v.ST_VOTO_VALIDO_FINAL === 'True' || v.ST_VOTO_VALIDO_FINAL === 'true';
      const key = `${v.NR_VOTAVEL}|${v.CD_TIPO_VOTAVEL}|${dest}`;

      if (!candMap.has(key)) {
        candMap.set(key, {
          numero: v.NR_VOTAVEL,
          nome: v.NM_CANDIDATO_OFICIAL || v.NM_VOTAVEL,
          nomeUrna: v.NM_VOTAVEL,
          partido: v.SG_PARTIDO || 'N/A',
          cdTipoVotavel: v.CD_TIPO_VOTAVEL,
          dsTipoVotavel: v.DS_TIPO_VOTAVEL,
          dsDestinacaoFinal: dest,
          stVotoValidoFinal: isValido,
          votos: 0
        });
      }
      candMap.get(key).votos += (v.QT_VOTOS || 0);
    }

    // Ordenação estrita: Votos Válidos primeiro (decrescente), depois Brancos/Nulos/Técnicos/Sub Judice
    let lista = Array.from(candMap.values()).sort((a, b) => {
      if (a.stVotoValidoFinal && !b.stVotoValidoFinal) return -1;
      if (!a.stVotoValidoFinal && b.stVotoValidoFinal) return 1;
      return b.votos - a.votos;
    });

    // Filtro opcional por partido
    if (State.eleicao.partido) {
      lista = lista.filter(c => c.partido === State.eleicao.partido);
    }

    // Filtro por candidato específico caso haja um selecionado
    if (State.eleicao.candidatoId) {
      const candIdNum = Number(State.eleicao.candidatoId);
      lista = lista.filter(c => c.numero === candIdNum || !c.stVotoValidoFinal);
    }

    const badgeQtd = document.getElementById('badgeQtdCandidatos');
    const validosCount = lista.filter(c => c.stVotoValidoFinal).length;
    if (badgeQtd) badgeQtd.textContent = `${validosCount} válidos (${lista.length} registros)`;

    // 1. Gráfico Horizontal Chart.js dos Candidatos Válidos
    renderResultadosChart(lista, apuracao);

    // 2. Card de Destaque do Líder Válido
    renderResultadosLeaderCard(lista, apuracao);

    // 3. Tabela Geral de Candidatos
    const tbody = document.getElementById('tbodyResultadosCandidatos');
    if (tbody) {
      tbody.innerHTML = '';
      const denominadorValidos = apuracao.validos > 0 ? apuracao.validos : 1;
      const denominadorTotal = apuracao.totalBU > 0 ? apuracao.totalBU : 1;

      let pos = 1;
      for (const item of lista) {
        const tr = document.createElement('tr');
        const isSelected = (State.eleicao.detalheCandidatoId && String(item.numero) === String(State.eleicao.detalheCandidatoId)) ||
                           (State.eleicao.candidatoId && String(item.numero) === State.eleicao.candidatoId);
        tr.className = `hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50/70 font-bold' : ''}`;

        const isValido = item.stVotoValidoFinal;
        const pctValidos = isValido ? ((item.votos / denominadorValidos) * 100) : 0;
        const pctTotal = (item.votos / denominadorTotal) * 100;

        let tipoBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700">Nominal Válido</span>';
        if (item.dsDestinacaoFinal === 'VALIDO_LEGENDA' || (item.stVotoValidoFinal && item.cdTipoVotavel === 4)) {
          tipoBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700">Legenda Válida</span>';
        } else if (item.dsDestinacaoFinal === 'BRANCO' || item.cdTipoVotavel === 2) {
          tipoBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">Branco</span>';
        } else if (item.dsDestinacaoFinal === 'NULO_TECNICO') {
          tipoBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200" title="Voto nominal na urna reclassificado como nulo técnico na totalização oficial SISTOT">Nulo Técnico</span>';
        } else if (item.dsDestinacaoFinal === 'NULO_URNA' || item.cdTipoVotavel === 3) {
          tipoBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700">Nulo Urna</span>';
        } else if (item.dsDestinacaoFinal === 'ANULADO_SUB_JUDICE') {
          tipoBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200" title="Candidatura com recurso judicial pendente no TSE">Sub Judice</span>';
        } else if (item.dsDestinacaoFinal === 'ANULADO') {
          tipoBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">Anulado</span>';
        }

        tr.innerHTML = `
          <td class="px-4 py-3 text-center text-slate-400 font-bold">${isValido && item.cdTipoVotavel === 1 ? pos++ : '-'}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                ${item.partido !== 'N/A' && item.partido !== '#NULO#' ? item.partido.slice(0, 3) : '<i class="fa-solid fa-vote-yea"></i>'}
              </div>
              <div>
                <span class="font-extrabold text-slate-900 block leading-tight">${item.nome}</span>
                <span class="text-[10px] text-slate-400 font-semibold">${item.partido}</span>
              </div>
            </div>
          </td>
          <td class="px-3 py-3 font-display font-semibold text-slate-600">${item.numero}</td>
          <td class="px-3 py-3 font-bold text-slate-700">${item.partido}</td>
          <td class="px-3 py-3">${tipoBadge}</td>
          <td class="px-4 py-3 text-right font-display font-black text-slate-900">${formatNumber(item.votos)}</td>
          <td class="px-4 py-3 text-right font-display font-extrabold ${isValido ? 'text-indigo-600' : 'text-slate-400'}">
            ${isValido ? formatPercent(pctValidos) : '-'}
          </td>
          <td class="px-4 py-3 text-right font-display text-slate-500 font-medium">${formatPercent(pctTotal)}</td>
          <td class="px-4 py-3 text-center">
            ${isValido && item.cdTipoVotavel === 1 ? `
              <button type="button" onclick="event.stopPropagation(); window.selecionarCandidatoDetalhamento('${item.numero}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-900 text-[11px] font-bold text-slate-600 transition-colors cursor-pointer" title="Ver bairros e regiões de ${item.nome}">
                <i class="fa-solid fa-map-location-dot text-[10px] mr-1 text-indigo-600"></i> Bairros & Regiões
              </button>
            ` : '-'}
          </td>
        `;

        if (isValido && item.cdTipoVotavel === 1) {
          tr.onclick = () => window.selecionarCandidatoDetalhamento(item.numero);
        }
        tbody.appendChild(tr);
      }
    }

    // 4. Detalhamento Territorial Dedicado por Presidenciável/Candidato (7 Regiões + Todos os Bairros)
    await renderDetalhamentoTerritorialPresidenciaveis(lista, apuracao);
  }

  function renderResultadosChart(lista, apuracao) {
    const canvas = document.getElementById('chartEleicoesResultadosCanvas');
    if (!canvas || !window.Chart) return;

    // Apenas candidatos válidos nominais entram no gráfico de resultados oficiais
    const nominais = lista.filter(c => c.stVotoValidoFinal && c.cdTipoVotavel === 1).slice(0, 8);
    if (nominais.length === 0) return;

    const labels = nominais.map(c => `${c.nome} (${c.partido})`);
    const valores = nominais.map(c => c.votos);
    const cores = nominais.map(c => CANONICAL.PARTIDO_COLORS[c.partido] || '#3B82F6');

    const totalValidos = apuracao.validos > 0 ? apuracao.validos : 1;

    if (State.charts.resultados) {
      State.charts.resultados.destroy();
    }

    const ctx = canvas.getContext('2d');
    State.charts.resultados = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Votos Válidos Apurados',
          data: valores,
          backgroundColor: cores,
          borderRadius: 6,
          barPercentage: 0.65
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => {
                const cand = nominais[item.dataIndex];
                const pct = ((cand.votos / totalValidos) * 100).toFixed(2).replace('.', ',');
                return ` ${formatNumber(cand.votos)} votos (${pct}% dos votos válidos)`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (v) => formatNumber(v),
              font: { family: 'Inter', size: 10 }
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          y: {
            ticks: {
              font: { family: 'Inter', size: 11, weight: 'bold' }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderResultadosLeaderCard(lista, apuracao) {
    // Líder e concorrente direto obtidos exclusivamente entre os votos válidos
    const nominais = lista.filter(c => c.stVotoValidoFinal && c.cdTipoVotavel === 1);
    if (nominais.length === 0) return;

    const lider = nominais[0];
    const segundo = nominais.length > 1 ? nominais[1] : null;

    const elAvatar = document.getElementById('liderAvatarBox');
    const elNome = document.getElementById('liderNome');
    const elNumPart = document.getElementById('liderNumeroPartido');
    const elVotos = document.getElementById('liderVotos');
    const elPct = document.getElementById('liderPct');
    const elSegundo = document.getElementById('lblSegundoColocado');
    const elDif = document.getElementById('lblDiferencaLider');

    const totalValidos = apuracao.validos > 0 ? apuracao.validos : 1;
    const pctLider = (lider.votos / totalValidos) * 100;

    if (elAvatar) {
      elAvatar.textContent = lider.partido !== 'N/A' ? lider.partido.slice(0, 3) : 'LID';
      elAvatar.style.backgroundColor = CANONICAL.PARTIDO_COLORS[lider.partido] || '#0B2545';
      elAvatar.style.color = '#FFFFFF';
    }
    if (elNome) elNome.textContent = lider.nome;
    if (elNumPart) elNumPart.textContent = `${lider.numero} • ${lider.partido}`;
    if (elVotos) elVotos.textContent = formatNumber(lider.votos);
    if (elPct) elPct.textContent = formatPercent(pctLider);

    if (segundo) {
      const pctSegundo = (segundo.votos / totalValidos) * 100;
      const difVotos = lider.votos - segundo.votos;
      const difPp = pctLider - pctSegundo;
      if (elSegundo) elSegundo.textContent = `${segundo.nome} (${segundo.partido}) — ${formatNumber(segundo.votos)} (${formatPercent(pctSegundo)})`;
      if (elDif) elDif.textContent = `+${formatNumber(difVotos)} votos (${formatPercent(difPp)} p.p.)`;
    } else {
      if (elSegundo) elSegundo.textContent = 'Sem concorrentes diretos apurados';
      if (elDif) elDif.textContent = '-';
    }
  }

  async function renderDetalhamentoTerritorialPresidenciaveis(lista, apuracao) {
    // Apenas candidatos válidos nominais
    const nominais = (lista || []).filter(c => c.stVotoValidoFinal && c.cdTipoVotavel === 1);
    const container = document.getElementById('painelDetalhamentoCandidato');
    const pillsContainer = document.getElementById('pillsPresidenciaveisContainer');
    if (!container || !pillsContainer) return;

    if (nominais.length === 0) {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'block';

    // Determina candidato ativo para o detalhamento
    if (!State.eleicao.detalheCandidatoId || !nominais.some(c => String(c.numero) === String(State.eleicao.detalheCandidatoId))) {
      State.eleicao.detalheCandidatoId = String(nominais[0].numero);
    }

    const candAtivo = nominais.find(c => String(c.numero) === String(State.eleicao.detalheCandidatoId)) || nominais[0];
    currentDetalhamentoCand = candAtivo;

    // Renderiza pills com todos os presidenciáveis / candidatos válidos do cargo
    pillsContainer.innerHTML = '';
    for (const c of nominais) {
      const isActive = String(c.numero) === String(candAtivo.numero);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
        isActive 
          ? 'bg-[#0B2545] text-white shadow-xs' 
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      }`;
      btn.innerHTML = `
        <span class="w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-slate-400'}"></span>
        <span>${c.nome}</span>
        <span class="text-[10px] opacity-75 font-semibold">(${c.partido})</span>
      `;
      btn.onclick = () => window.selecionarCandidatoDetalhamento(c.numero);
      pillsContainer.appendChild(btn);
    }

    // Título e Subtítulo
    const lblNome = document.getElementById('lblDetalhamentoCandidatoNome');
    const lblSub = document.getElementById('lblDetalhamentoCandidatoSub');
    const totalValidos = apuracao ? apuracao.validos : 1;
    const pctMun = totalValidos > 0 ? (candAtivo.votos / totalValidos) * 100 : 0;

    if (lblNome) lblNome.textContent = `Bairros e Regiões de ${candAtivo.nome} (${candAtivo.numero} • ${candAtivo.partido})`;
    if (lblSub) lblSub.textContent = `Total apurado em São José dos Campos: ${formatNumber(candAtivo.votos)} votos (${formatPercent(pctMun)} dos votos válidos)`;

    // 1. Tabela das 7 Regiões para o candidato ativo
    const tbodyRegioes = document.getElementById('tbodyDetalhamentoRegioes');
    if (tbodyRegioes) {
      tbodyRegioes.innerHTML = '';
      const votosReg = State.data.votosRegiao || [];
      const votosCandReg = votosReg.filter(v => v.DS_CARGO_PERGUNTA === State.eleicao.cargo && v.NR_VOTAVEL === candAtivo.numero);
      const totalCandVotos = candAtivo.votos > 0 ? candAtivo.votos : 1;

      let regioesLista = [];
      for (const reg of CANONICAL.REGIOES) {
        const item = votosCandReg.find(v => v.REGIAO_SJC === reg);
        const votos = item ? item.QT_VOTOS : 0;
        const totalValidosReg = item ? (item.TOTAL_VOTOS_VALIDOS_TERRITORIO || item.TOTAL_VOTOS_CARGO_TERRITORIO || 1) : 1;
        const pctCand = (votos / totalCandVotos) * 100;
        const pctNaRegiao = (votos / totalValidosReg) * 100;
        regioesLista.push({ regiao: reg, votos, pctCand, pctNaRegiao });
      }

      // Ordena por votos decrescente
      regioesLista.sort((a, b) => b.votos - a.votos);

      for (const r of regioesLista) {
        const dotColor = CANONICAL.REGIAO_COLORS[r.regiao] || '#3B82F6';
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        tr.innerHTML = `
          <td class="px-3 py-2.5 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${dotColor};"></span>
            <span class="font-bold text-slate-800">${r.regiao}</span>
          </td>
          <td class="px-3 py-2.5 text-right font-display font-black text-slate-900">${formatNumber(r.votos)}</td>
          <td class="px-3 py-2.5 text-right font-display font-semibold text-slate-600">${formatPercent(r.pctCand)}</td>
          <td class="px-3 py-2.5 text-right font-display font-black text-indigo-600">${formatPercent(r.pctNaRegiao)}</td>
        `;
        tbodyRegioes.appendChild(tr);
      }
    }

    // 2. Tabela Completa de Bairros para o candidato ativo
    await renderTabelaBairrosDetalhamento();
  }

  async function renderTabelaBairrosDetalhamento() {
    const tbodyBairros = document.getElementById('tbodyDetalhamentoBairros');
    if (!tbodyBairros || !currentDetalhamentoCand) return;

    await DataLoader.loadBairroData();
    const votosBairro = State.data.votosBairro || [];
    const cargo = State.eleicao.cargo;
    const candIdNum = currentDetalhamentoCand.numero;
    const totalCandVotos = currentDetalhamentoCand.votos > 0 ? currentDetalhamentoCand.votos : 1;

    let candBairros = votosBairro
      .filter(v => v.DS_CARGO_PERGUNTA === cargo && v.NR_VOTAVEL === candIdNum)
      .map(v => {
        const totalValidosBairro = v.TOTAL_VOTOS_VALIDOS_TERRITORIO || v.TOTAL_VOTOS_CARGO_TERRITORIO || 1;
        return {
          bairro: v.BAIRRO_ANALITICO,
          regiao: v.REGIAO_SJC,
          votos: v.QT_VOTOS,
          pctBairro: (v.QT_VOTOS / totalValidosBairro) * 100,
          pctCand: (v.QT_VOTOS / totalCandVotos) * 100
        };
      });

    // Filtro por texto insensível a acentos e maiúsculas
    const busca = normalizeText(State.eleicao.buscaBairroCand || '');
    if (busca) {
      candBairros = candBairros.filter(b => 
        normalizeText(b.bairro).includes(busca) || 
        normalizeText(b.regiao).includes(busca)
      );
    }

    // Ordenação
    const ordem = State.eleicao.ordemBairroCand || 'votos_desc';
    if (ordem === 'votos_desc') {
      candBairros.sort((a, b) => b.votos - a.votos);
    } else if (ordem === 'pct_desc') {
      candBairros.sort((a, b) => b.pctBairro - a.pctBairro);
    } else if (ordem === 'nome_asc') {
      candBairros.sort((a, b) => a.bairro.localeCompare(b.bairro));
    }

    tbodyBairros.innerHTML = '';
    if (candBairros.length === 0) {
      tbodyBairros.innerHTML = `
        <tr>
          <td colspan="6" class="px-4 py-6 text-center text-slate-400 font-medium italic">
            Nenhum bairro encontrado com os filtros atuais.
          </td>
        </tr>
      `;
      return;
    }

    candBairros.forEach((b, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition-colors';
      tr.innerHTML = `
        <td class="px-3 py-2.5 text-center text-slate-400 font-bold">${idx + 1}</td>
        <td class="px-3 py-2.5 font-bold text-slate-800">${b.bairro}</td>
        <td class="px-2 py-2.5 text-[11px] font-semibold text-slate-500">${b.regiao}</td>
        <td class="px-3 py-2.5 text-right font-display font-black text-slate-900">${formatNumber(b.votos)}</td>
        <td class="px-3 py-2.5 text-right font-display font-black text-indigo-600">${formatPercent(b.pctBairro)}</td>
        <td class="px-4 py-2.5">
          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden" title="${formatPercent(b.pctBairro)} dos votos válidos no bairro • ${formatPercent(b.pctCand)} dos votos do candidato">
            <div class="bg-indigo-600 h-full rounded-full" style="width: ${Math.min(100, b.pctBairro * 1.8)}%;"></div>
          </div>
        </td>
      `;
      tbodyBairros.appendChild(tr);
    });
  }

  // --- SEÇÃO 5: DISTRIBUIÇÃO TERRITORIAL DO CANDIDATO ---
  async function renderDistribuicaoCandidatoSection() {
    const wrapper = document.getElementById('wrapperDistribuicaoCandidato');
    const badge = document.getElementById('nomeCandidatoDistribuicaoText');
    const candId = State.eleicao.candidatoId;
    const cargo = State.eleicao.cargo;

    if (!candId) {
      if (badge) badge.textContent = 'Nenhum candidato selecionado. Clique em "Mapear" na tabela acima ou selecione no filtro.';
      // Define o primeiro candidato nominal VÁLIDO do cargo como padrão para exibir
      const votosReg = State.data.votosRegiao || [];
      const firstNominal = votosReg.find(v => v.DS_CARGO_PERGUNTA === cargo && Metrics.isVotoValido(v) && v.CD_TIPO_VOTAVEL === 1);
      if (firstNominal) {
        State.eleicao.candidatoId = String(firstNominal.NR_VOTAVEL);
      } else {
        return;
      }
    }

    const candIdNum = Number(State.eleicao.candidatoId);

    // Busca dados do candidato nas 7 regiões
    const votosReg = State.data.votosRegiao || [];
    const votosCandReg = votosReg.filter(v => v.DS_CARGO_PERGUNTA === cargo && v.NR_VOTAVEL === candIdNum);

    if (votosCandReg.length === 0) return;

    const nomeCand = votosCandReg[0].NM_CANDIDATO_OFICIAL || votosCandReg[0].NM_VOTAVEL;
    const partidoCand = votosCandReg[0].SG_PARTIDO;
    if (badge) badge.textContent = `${candIdNum} - ${nomeCand} (${partidoCand})`;

    // Total de votos no município
    const totalVotosMun = votosCandReg.reduce((a, b) => a + b.QT_VOTOS, 0);
    const apuracaoMun = Metrics.computeApuracao(votosReg.filter(v => v.DS_CARGO_PERGUNTA === cargo), cargo);
    const pctValidosMun = apuracaoMun.validos > 0 ? (totalVotosMun / apuracaoMun.validos) * 100 : 0;

    const elTot = document.getElementById('distVotosTotal');
    const elPctVal = document.getElementById('distVotosPctValidos');
    const elRegForte = document.getElementById('distRegiaoMaisForte');
    const elRegFortePct = document.getElementById('distRegiaoMaisFortePct');
    const elMelhorLoc = document.getElementById('distMelhorLocal');
    const elMelhorLocVotos = document.getElementById('distMelhorLocalVotos');

    if (elTot) elTot.textContent = formatNumber(totalVotosMun);
    if (elPctVal) elPctVal.textContent = formatPercent(pctValidosMun);

    // Região mais forte
    let maiorPctReg = 0;
    let nomeRegForte = '-';
    let listaRegioes = [];

    for (const reg of CANONICAL.REGIOES) {
      const regVote = votosCandReg.find(v => v.REGIAO_SJC === reg);
      const qtd = regVote ? regVote.QT_VOTOS : 0;
      const totalRegValidos = regVote ? (regVote.TOTAL_VOTOS_VALIDOS_TERRITORIO || regVote.TOTAL_VOTOS_CARGO_TERRITORIO || 1) : 1;
      const pct = (qtd / totalRegValidos) * 100;
      listaRegioes.push({ regiao: reg, votos: qtd, pct });

      if (pct > maiorPctReg) {
        maiorPctReg = pct;
        nomeRegForte = reg;
      }
    }

    if (elRegForte) elRegForte.textContent = `Região ${nomeRegForte}`;
    if (elRegFortePct) elRegFortePct.textContent = `${formatPercent(maiorPctReg)} dos votos válidos da região`;

    // Gráfico de distribuição por região
    renderDistribuicaoRegiaoChart(listaRegioes);

    // Top Bairros do Candidato
    await DataLoader.loadBairroData();
    const votosBairro = State.data.votosBairro || [];
    const candBairros = votosBairro
      .filter(v => v.DS_CARGO_PERGUNTA === cargo && v.NR_VOTAVEL === candIdNum)
      .map(v => {
        const totalValidosBairro = v.TOTAL_VOTOS_VALIDOS_TERRITORIO || v.TOTAL_VOTOS_CARGO_TERRITORIO || 1;
        return {
          bairro: v.BAIRRO_ANALITICO,
          regiao: v.REGIAO_SJC,
          votos: v.QT_VOTOS,
          pct: (v.QT_VOTOS / totalValidosBairro) * 100
        };
      })
      .sort((a, b) => b.votos - a.votos);

    const tbodyBairros = document.getElementById('tbodyTopBairrosCandidato');
    if (tbodyBairros) {
      tbodyBairros.innerHTML = '';
      for (const b of candBairros.slice(0, 15)) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        tr.innerHTML = `
          <td class="px-4 py-2.5 font-bold text-slate-800">${b.bairro}</td>
          <td class="px-3 py-2.5 text-slate-500">${b.regiao}</td>
          <td class="px-3 py-2.5 text-right font-display font-black text-slate-900">${formatNumber(b.votos)}</td>
          <td class="px-4 py-2.5 text-right font-display font-bold text-indigo-600">${formatPercent(b.pct)}</td>
          <td class="px-4 py-2.5">
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-indigo-600 h-full rounded-full" style="width: ${Math.min(100, b.pct * 3)}%;"></div>
            </div>
          </td>
        `;
        tbodyBairros.appendChild(tr);
      }
    }

    // Melhor local
    await DataLoader.loadLocalData();
    const votosLocal = State.data.votosLocal || [];
    const candLocais = votosLocal
      .filter(v => v.DS_CARGO_PERGUNTA === cargo && v.NR_VOTAVEL === candIdNum)
      .sort((a, b) => b.QT_VOTOS - a.QT_VOTOS);

    if (candLocais.length > 0) {
      const topLoc = candLocais[0];
      if (elMelhorLoc) {
        elMelhorLoc.textContent = topLoc.NM_LOCAL_VOTACAO;
        elMelhorLoc.title = topLoc.NM_LOCAL_VOTACAO;
      }
      if (elMelhorLocVotos) {
        const pctLocalValidos = topLoc.PCT_SOBRE_VALIDOS_TERRITORIO || ((topLoc.QT_VOTOS / (topLoc.TOTAL_VOTOS_VALIDOS_TERRITORIO || 1)) * 100);
        elMelhorLocVotos.textContent = `${formatNumber(topLoc.QT_VOTOS)} votos (${formatPercent(pctLocalValidos)} dos válidos no local)`;
      }
    }
  }

  function renderDistribuicaoRegiaoChart(listaRegioes) {
    const canvas = document.getElementById('chartDistribuicaoRegiaoCanvas');
    if (!canvas || !window.Chart) return;

    if (State.charts.distribuicao) {
      State.charts.distribuicao.destroy();
    }

    const labels = listaRegioes.map(r => r.regiao);
    const votos = listaRegioes.map(r => r.votos);
    const cores = labels.map(l => CANONICAL.REGIAO_COLORS[l] || '#6366F1');

    const ctx = canvas.getContext('2d');
    State.charts.distribuicao = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: votos,
          backgroundColor: cores,
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, font: { family: 'Inter', size: 10, weight: 'bold' } }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${formatNumber(item.raw)} votos`
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // --- SEÇÃO 6: PERFIL DO ELEITORADO ---
  async function renderPerfilSection() {
    const dados = await Metrics.getPerfilTerritorio();
    const dimensao = State.perfil.dimensao;

    // Atualiza botões ativos
    const dimBotoes = [
      { id: 'btnDimFaixaEtaria', dim: 'faixa_etaria' },
      { id: 'btnDimGenero', dim: 'genero' },
      { id: 'btnDimEscolaridade', dim: 'escolaridade' },
      { id: 'btnDimEstadoCivil', dim: 'estado_civil' },
      { id: 'btnDimRacaCor', dim: 'raca_cor' },
      { id: 'btnDimIdentidadeGenero', dim: 'identidade_genero' }
    ];

    for (const b of dimBotoes) {
      const btn = document.getElementById(b.id);
      if (btn) {
        if (b.dim === dimensao) {
          btn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-xs';
        } else {
          btn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-900';
        }
      }
    }

    // Títulos da Dimensão
    const titulos = {
      faixa_etaria: 'Distribuição por Faixa Etária',
      genero: 'Composição por Gênero',
      escolaridade: 'Grau de Instrução / Escolaridade',
      estado_civil: 'Estado Civil dos Eleitores',
      raca_cor: 'Autodeclaração de Raça / Cor',
      identidade_genero: 'Identidade de Gênero'
    };

    const lblTit = document.getElementById('lblPerfilGraficoTitulo');
    const lblTabTit = document.getElementById('lblPerfilTabelaTitulo');
    if (lblTit) lblTit.textContent = titulos[dimensao] || 'Perfil do Eleitorado';
    if (lblTabTit) lblTabTit.textContent = `Quadro: ${titulos[dimensao] || ''}`;

    // Ordena categorias por número de eleitores decrescente
    dados.sort((a, b) => b.ELEITORES - a.ELEITORES);

    const totalEleitores = dados.reduce((a, b) => a + b.ELEITORES, 0);
    const badgeTot = document.getElementById('lblPerfilTotalEleitoresBadge');
    if (badgeTot) badgeTot.textContent = `${formatNumber(totalEleitores)} eleitores cadastrados`;

    const lblMaior = document.getElementById('lblPerfilMaiorGrupo');
    if (lblMaior && dados.length > 0) {
      lblMaior.textContent = `Maior grupo: ${dados[0].CATEGORIA} (${formatPercent(dados[0].PERCENTUAL)})`;
    }

    // Gráfico de Perfil
    renderPerfilChart(dados);

    // Tabela de Perfil
    const tbody = document.getElementById('tbodyPerfilDetalhado');
    const tfootTot = document.getElementById('tfootPerfilTotalEleitores');
    if (tfootTot) tfootTot.textContent = formatNumber(totalEleitores);

    if (tbody) {
      tbody.innerHTML = '';
      for (const row of dados) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        tr.innerHTML = `
          <td class="px-4 py-3 font-bold text-slate-800">${row.CATEGORIA}</td>
          <td class="px-3 py-3 text-right font-display font-semibold text-slate-900">${formatNumber(row.ELEITORES)}</td>
          <td class="px-4 py-3 text-right font-display font-black text-amber-600">${formatPercent(row.PERCENTUAL)}</td>
          <td class="px-4 py-3">
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full" style="width: ${Math.min(100, row.PERCENTUAL)}%;"></div>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      }
    }
  }

  function renderPerfilChart(dados) {
    const canvas = document.getElementById('chartEleicoesPerfilCanvas');
    if (!canvas || !window.Chart) return;

    if (State.charts.perfil) {
      State.charts.perfil.destroy();
    }

    const labels = dados.map(d => d.CATEGORIA);
    const valores = dados.map(d => d.PERCENTUAL);

    const ctx = canvas.getContext('2d');
    State.charts.perfil = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '% do Eleitorado',
          data: valores,
          backgroundColor: '#F59E0B',
          borderRadius: 6,
          barPercentage: 0.65
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => `Participação: ${item.raw.toFixed(2)}%`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (v) => `${v}%`,
              font: { family: 'Inter', size: 10 }
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          y: {
            ticks: { font: { family: 'Inter', size: 10, weight: 'bold' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  // --- SEÇÃO 7: COMPARAÇÃO TERRITORIAL (A x B) ---
  function populateComparacaoDropdowns() {
    const selA = document.getElementById('selectComparaTerritorioA');
    const selB = document.getElementById('selectComparaTerritorioB');
    if (!selA || !selB) return;

    const options = [];
    options.push({ val: 'Municipio:SJC', label: 'São José dos Campos (Município)' });

    for (const r of CANONICAL.REGIOES) {
      options.push({ val: `Região:${r}`, label: `Região ${r}` });
    }

    const bairros = [...State.data.bairros].sort((a, b) => b.APTOS_BU_ESTADUAL - a.APTOS_BU_ESTADUAL);
    for (const b of bairros.slice(0, 25)) {
      options.push({ val: `Bairro:${b.ID_BAIRRO_TERRITORIAL}`, label: `Bairro: ${b.BAIRRO_ANALITICO} (${b.REGIAO_SJC})` });
    }

    const renderOpts = (selectedVal) => {
      return options.map(o => `<option value="${o.val}" ${o.val === selectedVal ? 'selected' : ''}>${o.label}</option>`).join('');
    };

    selA.innerHTML = renderOpts(State.comparacao.territorioA);
    selB.innerHTML = renderOpts(State.comparacao.territorioB);

    selA.addEventListener('change', (e) => {
      State.comparacao.territorioA = e.target.value;
      renderComparacaoSection();
    });

    selB.addEventListener('change', (e) => {
      State.comparacao.territorioB = e.target.value;
      renderComparacaoSection();
    });
  }

  async function renderComparacaoSection() {
    const { territorioA, territorioB } = State.comparacao;
    const thA = document.getElementById('thComparaNomeA');
    const thB = document.getElementById('thComparaNomeB');
    const tbody = document.getElementById('tbodyComparacaoTerritorial');
    if (!tbody) return;

    const statsA = getStatsForComparacao(territorioA);
    const statsB = getStatsForComparacao(territorioB);

    if (thA) thA.textContent = statsA.nome;
    if (thB) thB.textContent = statsB.nome;

    const rows = [
      {
        metrica: 'Eleitorado Cadastrado (Perfil)',
        valA: formatNumber(statsA.eleitorado),
        valB: formatNumber(statsB.eleitorado),
        dif: formatNumber(statsA.eleitorado - statsB.eleitorado)
      },
      {
        metrica: 'Aptos no BU Estadual',
        valA: formatNumber(statsA.aptos),
        valB: formatNumber(statsB.aptos),
        dif: formatNumber(statsA.aptos - statsB.aptos)
      },
      {
        metrica: 'Comparecimento às Urnas',
        valA: `${formatNumber(statsA.comp)} (${formatPercent(statsA.taxaComp)})`,
        valB: `${formatNumber(statsB.comp)} (${formatPercent(statsB.taxaComp)})`,
        dif: `${formatPercent(statsA.taxaComp - statsB.taxaComp)} p.p.`
      },
      {
        metrica: 'Abstenções no Pleito',
        valA: `${formatNumber(statsA.abst)} (${formatPercent(statsA.taxaAbst)})`,
        valB: `${formatNumber(statsB.abst)} (${formatPercent(statsB.taxaAbst)})`,
        dif: `${formatPercent(statsA.taxaAbst - statsB.taxaAbst)} p.p.`
      },
      {
        metrica: 'Locais de Votação Ativos',
        valA: `${statsA.locais} estabelecimentos`,
        valB: `${statsB.locais} estabelecimentos`,
        dif: `${statsA.locais - statsB.locais}`
      }
    ];

    tbody.innerHTML = '';
    for (const r of rows) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-3 font-bold text-slate-800">${r.metrica}</td>
        <td class="px-4 py-3 text-right font-display font-semibold text-blue-900">${r.valA}</td>
        <td class="px-4 py-3 text-right font-display font-semibold text-emerald-900">${r.valB}</td>
        <td class="px-4 py-3 text-center font-display font-bold text-slate-500">${r.dif}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  function getStatsForComparacao(terrKey) {
    const [tipo, val] = terrKey.split(':');

    if (tipo === 'Municipio') {
      return {
        nome: 'São José dos Campos',
        eleitorado: CANONICAL.ELEITORADO_CADASTRADO,
        aptos: CANONICAL.APTOS_BU_ESTADUAL,
        comp: CANONICAL.COMPARECIMENTO_BU_ESTADUAL,
        abst: CANONICAL.ABSTENCOES_BU_ESTADUAL,
        taxaComp: CANONICAL.TAXA_COMPARECIMENTO_PCT,
        taxaAbst: CANONICAL.TAXA_ABSTENCAO_PCT,
        locais: CANONICAL.LOCAIS_COUNT
      };
    }

    if (tipo === 'Região') {
      const locaisReg = State.data.locais.filter(l => l.REGIAO_SJC === val);
      const aptos = locaisReg.reduce((a, l) => a + l.APTOS_BU_ESTADUAL, 0);
      const comp = locaisReg.reduce((a, l) => a + l.COMPARECIMENTO_BU_ESTADUAL, 0);
      const abst = locaisReg.reduce((a, l) => a + l.ABSTENCOES_BU_ESTADUAL, 0);
      const cad = locaisReg.reduce((a, l) => a + l.ELEITORADO_CADASTRADO_NO_LOCAL, 0);

      return {
        nome: `Região ${val}`,
        eleitorado: cad,
        aptos,
        comp,
        abst,
        taxaComp: aptos > 0 ? (comp / aptos) * 100 : 0,
        taxaAbst: aptos > 0 ? (abst / aptos) * 100 : 0,
        locais: locaisReg.length
      };
    }

    if (tipo === 'Bairro') {
      const b = State.data.bairros.find(x => x.ID_BAIRRO_TERRITORIAL === val);
      if (b) {
        return {
          nome: b.BAIRRO_ANALITICO,
          eleitorado: b.ELEITORADO_CADASTRADO_NO_LOCAL,
          aptos: b.APTOS_BU_ESTADUAL,
          comp: b.COMPARECIMENTO_BU_ESTADUAL,
          abst: b.ABSTENCOES_BU_ESTADUAL,
          taxaComp: b.TAXA_COMPARECIMENTO_PCT,
          taxaAbst: b.TAXA_ABSTENCAO_PCT,
          locais: b.LOCAIS
        };
      }
    }

    return {
      nome: terrKey,
      eleitorado: 0,
      aptos: 0,
      comp: 0,
      abst: 0,
      taxaComp: 0,
      taxaAbst: 0,
      locais: 0
    };
  }

  // =========================================================================
  // 6.5 SONDAGEM DE OPINIÃO PÚBLICA (PESQUISA QUANTITATIVA RADAR SÃO JOSÉ N=477)
  // =========================================================================
  const PESQUISA_RADAR_DATA = {
    total_respondentes: 477,
    p25_interesse_politica: {
      pergunta: "De 1 a 5, o quanto você acompanha o que acontece na política de São José dos Campos?",
      media_geral: 3.03,
      distribuicao: {
        "1": { label: "1 - Quase nada / Muito baixo", qtd: 77, pct: 16.14 },
        "2": { label: "2 - Pouco", qtd: 62, pct: 13.00 },
        "3": { label: "3 - Moderado", qtd: 167, pct: 35.01 },
        "4": { label: "4 - Alto", qtd: 111, pct: 23.27 },
        "5": { label: "5 - Muito alto / Diariamente", qtd: 60, pct: 12.58 }
      }
    },
    p26_posicionamento: {
      pergunta: "Na política, você se sente mais próximo de qual lado?",
      distribuicao: {
        "Direita": { label: "Direita", qtd: 184, pct: 38.57, cor: "#2563EB" },
        "Esquerda": { label: "Esquerda", qtd: 114, pct: 23.90, cor: "#DC2626" },
        "Prefiro não responder": { label: "Não declarado / Indeciso", qtd: 103, pct: 21.59, cor: "#64748B" },
        "Centro": { label: "Centro", qtd: 76, pct: 15.93, cor: "#10B981" }
      }
    },
    cruzamentos: {
      por_regiao: {
        "Sudeste": { total: 32, pct_amostra: 6.71, media_interesse_p25: 3.19, dist_p26: { "Direita": { qtd: 19, pct: 59.38 }, "Esquerda": { qtd: 5, pct: 15.62 }, "Centro": { qtd: 5, pct: 15.62 }, "Prefiro não responder": { qtd: 3, pct: 9.38 } } },
        "Oeste": { total: 76, pct_amostra: 15.93, media_interesse_p25: 3.20, dist_p26: { "Direita": { qtd: 37, pct: 48.68 }, "Esquerda": { qtd: 18, pct: 23.68 }, "Centro": { qtd: 12, pct: 15.79 }, "Prefiro não responder": { qtd: 9, pct: 11.84 } } },
        "Norte": { total: 55, pct_amostra: 11.53, media_interesse_p25: 2.78, dist_p26: { "Direita": { qtd: 24, pct: 43.64 }, "Esquerda": { qtd: 12, pct: 21.82 }, "Prefiro não responder": { qtd: 11, pct: 20.00 }, "Centro": { qtd: 8, pct: 14.55 } } },
        "Sul": { total: 137, pct_amostra: 28.72, media_interesse_p25: 3.00, dist_p26: { "Direita": { qtd: 56, pct: 40.88 }, "Esquerda": { qtd: 33, pct: 24.09 }, "Prefiro não responder": { qtd: 29, pct: 21.17 }, "Centro": { qtd: 19, pct: 13.87 } } },
        "Leste": { total: 99, pct_amostra: 20.75, media_interesse_p25: 2.94, dist_p26: { "Direita": { qtd: 29, pct: 29.29 }, "Esquerda": { qtd: 26, pct: 26.26 }, "Prefiro não responder": { qtd: 24, pct: 24.24 }, "Centro": { qtd: 20, pct: 20.20 } } },
        "Centro": { total: 78, pct_amostra: 16.35, media_interesse_p25: 3.06, dist_p26: { "Prefiro não responder": { qtd: 27, pct: 34.62 }, "Esquerda": { qtd: 20, pct: 25.64 }, "Direita": { qtd: 19, pct: 24.36 }, "Centro": { qtd: 12, pct: 15.38 } } }
      },
      por_idade: {
        "+65 anos": { total: 58, pct_amostra: 12.16, media_interesse_p25: 3.48, dist_p26: { "Direita": { qtd: 37, pct: 63.79 }, "Esquerda": { qtd: 10, pct: 17.24 }, "Prefiro não responder": { qtd: 6, pct: 10.34 }, "Centro": { qtd: 5, pct: 8.62 } } },
        "55 anos a 64 anos": { total: 32, pct_amostra: 6.71, media_interesse_p25: 3.09, dist_p26: { "Direita": { qtd: 15, pct: 46.88 }, "Prefiro não responder": { qtd: 7, pct: 21.88 }, "Centro": { qtd: 5, pct: 15.62 }, "Esquerda": { qtd: 5, pct: 15.62 } } },
        "45 a 54 anos": { total: 80, pct_amostra: 16.77, media_interesse_p25: 3.01, dist_p26: { "Direita": { qtd: 37, pct: 46.25 }, "Prefiro não responder": { qtd: 17, pct: 21.25 }, "Centro": { qtd: 15, pct: 18.75 }, "Esquerda": { qtd: 11, pct: 13.75 } } },
        "18 a 24 anos": { total: 51, pct_amostra: 10.69, media_interesse_p25: 2.80, dist_p26: { "Direita": { qtd: 20, pct: 39.22 }, "Prefiro não responder": { qtd: 15, pct: 29.41 }, "Esquerda": { qtd: 11, pct: 21.57 }, "Centro": { qtd: 5, pct: 9.80 } } },
        "16 a 17 anos": { total: 18, pct_amostra: 3.77, media_interesse_p25: 2.50, dist_p26: { "Direita": { qtd: 7, pct: 38.89 }, "Centro": { qtd: 5, pct: 27.78 }, "Esquerda": { qtd: 4, pct: 22.22 }, "Prefiro não responder": { qtd: 2, pct: 11.11 } } },
        "35 a 44 anos": { total: 102, pct_amostra: 21.38, media_interesse_p25: 3.04, dist_p26: { "Direita": { qtd: 37, pct: 36.27 }, "Esquerda": { qtd: 27, pct: 26.47 }, "Prefiro não responder": { qtd: 24, pct: 23.53 }, "Centro": { qtd: 14, pct: 13.73 } } },
        "25 a 34 anos": { total: 136, pct_amostra: 28.51, media_interesse_p25: 2.89, dist_p26: { "Esquerda": { qtd: 46, pct: 33.82 }, "Prefiro não responder": { qtd: 32, pct: 23.53 }, "Direita": { qtd: 31, pct: 22.79 }, "Centro": { qtd: 27, pct: 19.85 } } }
      },
      por_genero: {
        "Homem Cis": { total: 203, pct_amostra: 42.56, media_interesse_p25: 3.16, dist_p26: { "Direita": { qtd: 95, pct: 46.80 }, "Esquerda": { qtd: 40, pct: 19.70 }, "Centro": { qtd: 37, pct: 18.23 }, "Prefiro não responder": { qtd: 31, pct: 15.27 } } },
        "Mulher Cis": { total: 268, pct_amostra: 56.18, media_interesse_p25: 2.92, dist_p26: { "Direita": { qtd: 87, pct: 32.46 }, "Esquerda": { qtd: 73, pct: 27.24 }, "Prefiro não responder": { qtd: 69, pct: 25.75 }, "Centro": { qtd: 39, pct: 14.55 } } },
        "Outros / Diversos": { total: 6, pct_amostra: 1.26, media_interesse_p25: 3.33, dist_p26: { "Prefiro não responder": { qtd: 3, pct: 50.00 }, "Direita": { qtd: 2, pct: 33.33 }, "Esquerda": { qtd: 1, pct: 16.67 } } }
      },
      por_renda: {
        "Entre R$ 5.601 e R$ 12.000": { total: 155, pct_amostra: 32.49, media_interesse_p25: 3.09, dist_p26: { "Direita": { qtd: 72, pct: 46.45 }, "Esquerda": { qtd: 39, pct: 25.16 }, "Centro": { qtd: 24, pct: 15.48 }, "Prefiro não responder": { qtd: 20, pct: 12.90 } } },
        "Mais de R$ 26.000": { total: 21, pct_amostra: 4.40, media_interesse_p25: 3.38, dist_p26: { "Direita": { qtd: 9, pct: 42.86 }, "Centro": { qtd: 8, pct: 38.10 }, "Prefiro não responder": { qtd: 3, pct: 14.29 }, "Esquerda": { qtd: 1, pct: 4.76 } } },
        "Entre R$ 12.001 e R$ 26.000": { total: 67, pct_amostra: 14.05, media_interesse_p25: 3.25, dist_p26: { "Direita": { qtd: 28, pct: 41.79 }, "Esquerda": { qtd: 20, pct: 29.85 }, "Prefiro não responder": { qtd: 14, pct: 20.90 }, "Centro": { qtd: 5, pct: 7.46 } } },
        "Até R$ 2.800": { total: 73, pct_amostra: 15.30, media_interesse_p25: 2.71, dist_p26: { "Prefiro não responder": { qtd: 26, pct: 35.62 }, "Direita": { qtd: 24, pct: 32.88 }, "Esquerda": { qtd: 14, pct: 19.18 }, "Centro": { qtd: 9, pct: 12.33 } } },
        "Entre R$ 2.801 e R$ 5.600": { total: 161, pct_amostra: 33.75, media_interesse_p25: 2.94, dist_p26: { "Direita": { qtd: 51, pct: 31.68 }, "Prefiro não responder": { qtd: 40, pct: 24.84 }, "Esquerda": { qtd: 40, pct: 24.84 }, "Centro": { qtd: 30, pct: 18.63 } } }
      },
      por_trabalho: {
        "Servidor Público": { total: 45, pct_amostra: 9.43, media_interesse_p25: 3.44, dist_p26: { "Esquerda": { qtd: 17, pct: 37.78 }, "Direita": { qtd: 14, pct: 31.11 }, "Prefiro não responder": { qtd: 8, pct: 17.78 }, "Centro": { qtd: 6, pct: 13.33 } } },
        "Empresário / PJ": { total: 68, pct_amostra: 14.26, media_interesse_p25: 3.32, dist_p26: { "Direita": { qtd: 38, pct: 55.88 }, "Centro": { qtd: 15, pct: 22.06 }, "Prefiro não responder": { qtd: 9, pct: 13.24 }, "Esquerda": { qtd: 6, pct: 8.82 } } },
        "Autônomo / Profissional Liberal": { total: 94, pct_amostra: 19.71, media_interesse_p25: 3.01, dist_p26: { "Direita": { qtd: 36, pct: 38.30 }, "Esquerda": { qtd: 25, pct: 26.60 }, "Prefiro não responder": { qtd: 21, pct: 22.34 }, "Centro": { qtd: 12, pct: 12.77 } } },
        "CLT / Carteira Assinada": { total: 198, pct_amostra: 41.51, media_interesse_p25: 2.87, dist_p26: { "Direita": { qtd: 68, pct: 34.34 }, "Esquerda": { qtd: 52, pct: 26.26 }, "Prefiro não responder": { qtd: 48, pct: 24.24 }, "Centro": { qtd: 30, pct: 15.15 } } },
        "Aposentado / Pensionista": { total: 41, pct_amostra: 8.60, media_interesse_p25: 3.39, dist_p26: { "Direita": { qtd: 23, pct: 56.10 }, "Esquerda": { qtd: 7, pct: 17.07 }, "Prefiro não responder": { qtd: 6, pct: 14.63 }, "Centro": { qtd: 5, pct: 12.20 } } },
        "Estudante": { total: 31, pct_amostra: 6.49, media_interesse_p25: 2.55, dist_p26: { "Esquerda": { qtd: 12, pct: 38.71 }, "Direita": { qtd: 9, pct: 29.03 }, "Centro": { qtd: 6, pct: 19.35 }, "Prefiro não responder": { qtd: 4, pct: 12.90 } } }
      },
      por_posicao_politica: {
        "Direita": { total: 184, pct_amostra: 38.57, media_interesse_p25: 3.18, dist_p26: { "Direita": { qtd: 184, pct: 100.00 }, "Esquerda": { qtd: 0, pct: 0 }, "Centro": { qtd: 0, pct: 0 }, "Prefiro não responder": { qtd: 0, pct: 0 } } },
        "Esquerda": { total: 114, pct_amostra: 23.90, media_interesse_p25: 3.11, dist_p26: { "Direita": { qtd: 0, pct: 0 }, "Esquerda": { qtd: 114, pct: 100.00 }, "Centro": { qtd: 0, pct: 0 }, "Prefiro não responder": { qtd: 0, pct: 0 } } },
        "Centro": { total: 76, pct_amostra: 15.93, media_interesse_p25: 3.03, dist_p26: { "Direita": { qtd: 0, pct: 0 }, "Esquerda": { qtd: 0, pct: 0 }, "Centro": { qtd: 76, pct: 100.00 }, "Prefiro não responder": { qtd: 0, pct: 0 } } },
        "Prefiro não responder": { total: 103, pct_amostra: 21.59, media_interesse_p25: 2.69, dist_p26: { "Direita": { qtd: 0, pct: 0 }, "Esquerda": { qtd: 0, pct: 0 }, "Centro": { qtd: 0, pct: 0 }, "Prefiro não responder": { qtd: 103, pct: 100.00 } } }
      }
    }
  };

  function renderPesquisaRadarSection() {
    renderPesquisaEspectroChart();
    renderPesquisaInteresseChart();
    renderPesquisaRecortesTable();
  }

  function renderPesquisaEspectroChart() {
    const canvas = document.getElementById('chartPesquisaRadarEspectroCanvas');
    if (!canvas || !window.Chart) return;

    if (State.charts.pesquisaEspectro) {
      State.charts.pesquisaEspectro.destroy();
    }

    const labels = ['Direita (38,6%)', 'Esquerda (23,9%)', 'Não declarado (21,6%)', 'Centro (15,9%)'];
    const dataVals = [184, 114, 103, 76];
    const cores = ['#2563EB', '#DC2626', '#64748B', '#10B981'];

    const ctx = canvas.getContext('2d');
    State.charts.pesquisaEspectro = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: dataVals,
          backgroundColor: cores,
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, font: { family: 'Inter', size: 10, weight: 'bold' } }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw} respondentes (${((item.raw / 477) * 100).toFixed(2).replace('.', ',')}%)`
            }
          }
        },
        cutout: '62%'
      }
    });
  }

  function renderPesquisaInteresseChart() {
    const canvas = document.getElementById('chartPesquisaRadarInteresseCanvas');
    if (!canvas || !window.Chart) return;

    if (State.charts.pesquisaInteresse) {
      State.charts.pesquisaInteresse.destroy();
    }

    const labels = ['1 (Muito baixo)', '2 (Baixo)', '3 (Moderado)', '4 (Alto)', '5 (Diariamente)'];
    const dataVals = [77, 62, 167, 111, 60];
    const cores = ['#94A3B8', '#64748B', '#F59E0B', '#10B981', '#059669'];

    const ctx = canvas.getContext('2d');
    State.charts.pesquisaInteresse = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Respondentes (N)',
          data: dataVals,
          backgroundColor: cores,
          borderRadius: 6,
          barPercentage: 0.65
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.raw} respondentes (${((item.raw / 477) * 100).toFixed(2).replace('.', ',')}%)`
            }
          }
        },
        scales: {
          x: {
            ticks: { font: { family: 'Inter', size: 10, weight: 'bold' } },
            grid: { display: false }
          },
          y: {
            ticks: { font: { family: 'Inter', size: 10 } },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          }
        }
      }
    });
  }

  function renderPesquisaRecortesTable() {
    const tbody = document.getElementById('tbodyPesquisaRecortes');
    const thCat = document.getElementById('thPesquisaRecorteCategoria');
    const lblTit = document.getElementById('lblPesquisaRecorteTitulo');
    if (!tbody) return;

    const dim = State.pesquisaRadar.dimensaoRecorte || 'por_regiao';
    const rawGroup = PESQUISA_RADAR_DATA.cruzamentos[dim] || {};

    const titulos = {
      por_regiao: { tit: 'Recorte da Opinião Política por Região de São José dos Campos', col: 'Região' },
      por_idade: { tit: 'Recorte da Opinião Política por Faixa Etária', col: 'Faixa Etária' },
      por_genero: { tit: 'Recorte da Opinião Política por Gênero', col: 'Gênero' },
      por_renda: { tit: 'Recorte da Opinião Política por Faixa de Renda Familiar', col: 'Faixa de Renda' },
      por_trabalho: { tit: 'Recorte da Opinião Política por Regime de Trabalho / Ocupação', col: 'Ocupação / Trabalho' },
      por_posicao_politica: { tit: 'Cruzamento: Grau de Acompanhamento por Espectro Político', col: 'Posição Política' }
    };

    if (lblTit && titulos[dim]) lblTit.textContent = titulos[dim].tit;
    if (thCat && titulos[dim]) thCat.textContent = titulos[dim].col;

    tbody.innerHTML = '';

    const entries = Object.entries(rawGroup);
    // Ordena por maior N de respondentes ou por ordem lógica
    entries.sort((a, b) => b[1].total - a[1].total);

    for (const [cat, info] of entries) {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition-colors';

      const d = info.dist_p26 || {};
      const pctDir = d['Direita'] ? d['Direita'].pct : 0;
      const pctEsq = d['Esquerda'] ? d['Esquerda'].pct : 0;
      const pctCen = d['Centro'] ? d['Centro'].pct : 0;
      const pctNao = d['Prefiro não responder'] ? d['Prefiro não responder'].pct : 0;

      tr.innerHTML = `
        <td class="px-4 py-3 font-bold text-slate-800">${cat}</td>
        <td class="px-3 py-3 text-right font-display font-semibold text-slate-700">${info.total} <small class="text-[10px] text-slate-400">(${info.pct_amostra}%)</small></td>
        <td class="px-3 py-3 text-right font-display font-black text-blue-600">${formatPercent(pctDir)}</td>
        <td class="px-3 py-3 text-right font-display font-black text-rose-600">${formatPercent(pctEsq)}</td>
        <td class="px-3 py-3 text-right font-display font-black text-emerald-600">${formatPercent(pctCen)}</td>
        <td class="px-3 py-3 text-right font-display text-slate-500 font-semibold">${formatPercent(pctNao)}</td>
        <td class="px-3 py-3 text-right font-display font-black text-amber-600">${info.media_interesse_p25.toFixed(2).replace('.', ',')} <small class="text-slate-400 font-normal">/ 5</small></td>
        <td class="px-4 py-3">
          <div class="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden shadow-2xs">
            <div class="bg-blue-600 h-full" style="width: ${pctDir}%;" title="Direita: ${formatPercent(pctDir)}"></div>
            <div class="bg-rose-600 h-full" style="width: ${pctEsq}%;" title="Esquerda: ${formatPercent(pctEsq)}"></div>
            <div class="bg-emerald-500 h-full" style="width: ${pctCen}%;" title="Centro: ${formatPercent(pctCen)}"></div>
            <div class="bg-slate-400 h-full" style="width: ${pctNao}%;" title="Não Declarado: ${formatPercent(pctNao)}"></div>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }
  }

  // =========================================================================
  // 7. RENDERIZADOR MASTER (SINCRO GLOBAL)
  // =========================================================================
  async function renderAll() {
    renderKPIs();
    renderAbstencaoSection();
    renderMapaMarkers();
    await renderResultadosSection();
    await renderDistribuicaoCandidatoSection();
    await renderPerfilSection();
    await renderComparacaoSection();
    renderPesquisaRadarSection();
  }

  // =========================================================================
  // 8. HELPERS PÚBLICOS EXPOSTOS NO WINDOW
  // =========================================================================
  window.filtrarRegiao = function(nomeRegiao) {
    State.territorio.regiao = nomeRegiao;
    State.territorio.bairro = '';
    State.territorio.localId = '';
    State.territorio.secao = '';

    document.getElementById('filterEleicaoRegiao').value = nomeRegiao;
    Filters.populateBairrosDropdown();
    Filters.populateLocaisDropdown();
    Filters.populateSecoesDropdown();
    updateBreadcrumb();
    renderAll();

    // Rola suavemente até o início dos filtros
    const sec = document.getElementById('sec-eleicoes-visao');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  };

  window.filtrarLocal = function(idLocal) {
    Filters.onLocalChange();
    State.territorio.localId = idLocal;
    const selLocal = document.getElementById('filterEleicaoLocal');
    if (selLocal) selLocal.value = idLocal;
    Filters.onLocalChange();

    const sec = document.getElementById('sec-eleicoes-visao');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  };

  window.selecionarCandidatoDetalhamento = async function(numero) {
    State.eleicao.detalheCandidatoId = String(numero);
    const votos = await Metrics.getVotosTerritorio();
    const apuracao = Metrics.computeApuracao(votos, State.eleicao.cargo);

    const candMap = new Map();
    for (const v of votos) {
      const dest = v.DS_DESTINACAO_FINAL || '';
      const isValido = v.ST_VOTO_VALIDO_FINAL === true || v.ST_VOTO_VALIDO_FINAL === 'True' || v.ST_VOTO_VALIDO_FINAL === 'true';
      const key = `${v.NR_VOTAVEL}|${v.CD_TIPO_VOTAVEL}|${dest}`;
      if (!candMap.has(key)) {
        candMap.set(key, {
          numero: v.NR_VOTAVEL,
          nome: v.NM_CANDIDATO_OFICIAL || v.NM_VOTAVEL,
          partido: v.SG_PARTIDO || 'N/A',
          cdTipoVotavel: v.CD_TIPO_VOTAVEL,
          dsTipoVotavel: v.DS_TIPO_VOTAVEL,
          dsDestinacaoFinal: dest,
          stVotoValidoFinal: isValido,
          votos: 0
        });
      }
      candMap.get(key).votos += (v.QT_VOTOS || 0);
    }
    const lista = Array.from(candMap.values()).sort((a, b) => {
      if (a.stVotoValidoFinal && !b.stVotoValidoFinal) return -1;
      if (!a.stVotoValidoFinal && b.stVotoValidoFinal) return 1;
      return b.votos - a.votos;
    });

    await renderDetalhamentoTerritorialPresidenciaveis(lista, apuracao);
  };

  window.focarCandidato = function(numero) {
    State.eleicao.candidatoId = String(numero);
    State.eleicao.detalheCandidatoId = String(numero);
    const selCand = document.getElementById('filterEleicaoCandidato');
    if (selCand) selCand.value = String(numero);
    renderAll();

    const sec = document.getElementById('sec-eleicoes-distribuicao');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  };

  window.setMapaMetrica = function(metrica) {
    State.mapa.metrica = metrica;
    const botoes = [
      { id: 'btnMapMetricAbstencao', m: 'abstencao' },
      { id: 'btnMapMetricComparecimento', m: 'comparecimento' },
      { id: 'btnMapMetricAptos', m: 'aptos' },
      { id: 'btnMapMetricCandidato', m: 'candidato' }
    ];

    for (const b of botoes) {
      const el = document.getElementById(b.id);
      if (el) {
        if (b.m === metrica) {
          el.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-xs';
        } else {
          el.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-900';
        }
      }
    }
    renderMapaMarkers();
  };

  window.setBasePercentual = function(base) {
    State.eleicao.basePercentual = base;
    const btnVal = document.getElementById('btnBaseValidos');
    const btnTot = document.getElementById('btnBaseTotal');
    const thCol = document.getElementById('thPercentualCol');

    if (btnVal && btnTot) {
      if (base === 'validos') {
        btnVal.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-xs';
        btnTot.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-900';
        if (thCol) thCol.textContent = '% Votos Válidos';
      } else {
        btnTot.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-xs';
        btnVal.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-900';
        if (thCol) thCol.textContent = '% Total Apurado no BU';
      }
    }
    renderResultadosSection();
  };

  window.setPerfilDimensao = function(dim) {
    State.perfil.dimensao = dim;
    renderPerfilSection();
  };

  window.setPesquisaRecorteDimensao = function(dim) {
    State.pesquisaRadar.dimensaoRecorte = dim;
    const botoes = [
      { id: 'btnRecorteRegiao', d: 'por_regiao' },
      { id: 'btnRecorteIdade', d: 'por_idade' },
      { id: 'btnRecorteGenero', d: 'por_genero' },
      { id: 'btnRecorteRenda', d: 'por_renda' },
      { id: 'btnRecorteTrabalho', d: 'por_trabalho' },
      { id: 'btnRecortePosicao', d: 'por_posicao_politica' }
    ];

    for (const b of botoes) {
      const el = document.getElementById(b.id);
      if (el) {
        if (b.d === dim) {
          el.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white text-slate-900 shadow-xs';
        } else {
          el.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-900';
        }
      }
    }
    renderPesquisaRecortesTable();
  };

  window.resetMapZoom = function() {
    if (State.mapa.leafletMap) {
      State.mapa.leafletMap.setView([-23.205, -45.885], 12);
    }
  };

  // =========================================================================
  // 9. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
  // =========================================================================
  window.initEleicoes2026 = async function(forceReload = false) {
    if (State.initialized && !forceReload) {
      setTimeout(() => {
        if (State.mapa.leafletMap) State.mapa.leafletMap.invalidateSize();
      }, 200);
      return;
    }

    const ok = await DataLoader.loadPrimaryData();
    if (!ok) {
      console.error('[Eleições 2026] Falha crítica ao inicializar módulo.');
      return;
    }

    Filters.init();
    populateComparacaoDropdowns();
    updateBreadcrumb();

    initMapaLeaflet();
    await renderAll();

    State.initialized = true;
    console.log('[Eleições 2026] Módulo único inicializado com sucesso.');
  };

  // =========================================================================
  // 10. UTILITÁRIOS DE FORMATAÇÃO E UI
  // =========================================================================
  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Number(num).toLocaleString('pt-BR');
  }

  function formatPercent(num) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return `${Number(num).toFixed(2).replace('.', ',')}%`;
  }

  function normalizeText(str) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function setLoading(isLoading) {
    State.loading = isLoading;
    const spinner = document.getElementById('eleicoesLoadingSpinner');
    if (spinner) {
      if (isLoading) spinner.classList.remove('hidden');
      else spinner.classList.add('hidden');
    }
  }

  function showProgressBar(percent) {
    const bar = document.getElementById('eleicoesProgressBar');
    if (!bar) return;
    bar.style.width = `${percent}%`;
    if (percent >= 100) {
      setTimeout(() => {
        bar.style.width = '0%';
      }, 500);
    }
  }

})(window, document);
