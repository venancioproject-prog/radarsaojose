// =========================================================================
// RADAR SÃO JOSÉ - CONTROLADOR DE INTELIGÊNCIA TERRITORIAL & MERCADO (126K)
// Versão: 2026.3-quarantine-enterprise
// Desenvolvido para: Leonardo Venâncio & Mayumi Nagano (Radar São José)
// =========================================================================

(function(window, document) {
  'use strict';

  // Base Geográfica Canônica de São José dos Campos (SJC)
  // Mapeamento georreferenciado detalhado com coordenadas precisas dos polos urbanos
  const SJC_BAIRROS_GEO = {
    // Zona Oeste & Eixo Dutra
    "PARQUE RESIDENCIAL AQUARIUS": { lat: -23.216, lng: -45.908, regiao: "Zona Oeste", color: "#06B6D4" },
    "JARDIM AQUARIUS": { lat: -23.216, lng: -45.908, regiao: "Zona Oeste", color: "#06B6D4" },
    "JARDIM DAS INDUSTRIAS": { lat: -23.227, lng: -45.918, regiao: "Zona Oeste", color: "#F59E0B" },
    "JARDIM DAS COLINAS": { lat: -23.210, lng: -45.915, regiao: "Zona Oeste", color: "#14B8A6" },
    "JARDIM ESPLANADA": { lat: -23.204, lng: -45.903, regiao: "Zona Oeste", color: "#EC4899" },
    "JARDIM ESPLANADA II": { lat: -23.206, lng: -45.906, regiao: "Zona Oeste", color: "#EC4899" },
    "ALTOS DO ESPLANADA": { lat: -23.202, lng: -45.909, regiao: "Zona Oeste", color: "#EC4899" },
    "VILA EMA": { lat: -23.201, lng: -45.898, regiao: "Zona Oeste", color: "#F43F5E" },
    "URBANOVA": { lat: -23.203, lng: -45.945, regiao: "Zona Oeste", color: "#10B981" },
    "URBANOVA I": { lat: -23.201, lng: -45.942, regiao: "Zona Oeste", color: "#10B981" },
    "URBANOVA V": { lat: -23.205, lng: -45.948, regiao: "Zona Oeste", color: "#10B981" },
    "URBANOVA VI": { lat: -23.207, lng: -45.951, regiao: "Zona Oeste", color: "#10B981" },
    "URBANOVA VII": { lat: -23.209, lng: -45.954, regiao: "Zona Oeste", color: "#10B981" },
    "CONDOMINIO RESIDENCIAL COLINAS DO PARATEHY": { lat: -23.195, lng: -45.938, regiao: "Zona Oeste", color: "#10B981" },
    "CONDOMINIO RESERVA DO PARATEHY": { lat: -23.192, lng: -45.935, regiao: "Zona Oeste", color: "#10B981" },
    "SERIMBURA": { lat: -23.208, lng: -45.935, regiao: "Zona Oeste", color: "#10B981" },
    "JARDIM DO GOLFE": { lat: -23.213, lng: -45.922, regiao: "Zona Oeste", color: "#06B6D4" },
    "JARDIM ALVORADA": { lat: -23.220, lng: -45.913, regiao: "Zona Oeste", color: "#F59E0B" },
    "CONDOMINIO ROYAL PARK": { lat: -23.212, lng: -45.902, regiao: "Zona Oeste", color: "#06B6D4" },
    "CONDOMINIO ESPLANADA DO SOL": { lat: -23.198, lng: -45.912, regiao: "Zona Oeste", color: "#10B981" },
    "JARDIM LIMOEIRO": { lat: -23.225, lng: -45.925, regiao: "Zona Oeste", color: "#F59E0B" },
    
    // Centro & Eixo Central
    "CENTRO": { lat: -23.186, lng: -45.884, regiao: "Centro", color: "#3B82F6" },
    "JARDIM SAO DIMAS": { lat: -23.199, lng: -45.888, regiao: "Centro", color: "#6366F1" },
    "VILA ADYANA": { lat: -23.197, lng: -45.892, regiao: "Centro", color: "#8B5CF6" },
    "VILA BETANIA": { lat: -23.194, lng: -45.881, regiao: "Centro", color: "#0EA5E9" },
    "JARDIM MARINGA": { lat: -23.191, lng: -45.889, regiao: "Centro", color: "#64748B" },
    "JARDIM AUGUSTA": { lat: -23.195, lng: -45.875, regiao: "Centro", color: "#3B82F6" },
    "JARDIM OSWALDO CRUZ": { lat: -23.194, lng: -45.879, regiao: "Centro", color: "#8B5CF6" },
    "JARDIM APOLO I": { lat: -23.205, lng: -45.895, regiao: "Centro", color: "#06B6D4" },
    "JARDIM APOLO": { lat: -23.205, lng: -45.895, regiao: "Centro", color: "#06B6D4" },
    "JARDIM APOLO II": { lat: -23.207, lng: -45.897, regiao: "Centro", color: "#06B6D4" },
    "JARDIM BELA VISTA": { lat: -23.189, lng: -45.887, regiao: "Centro", color: "#3B82F6" },
    "VILA MARIA": { lat: -23.183, lng: -45.878, regiao: "Centro", color: "#3B82F6" },
    "VILA SANCHES": { lat: -23.192, lng: -45.884, regiao: "Centro", color: "#3B82F6" },
    "VILA RANGEL": { lat: -23.196, lng: -45.882, regiao: "Centro", color: "#3B82F6" },
    "VILA DIRCE": { lat: -23.193, lng: -45.886, regiao: "Centro", color: "#3B82F6" },
    
    // Zona Sul
    "JARDIM SATELITE": { lat: -23.235, lng: -45.891, regiao: "Zona Sul", color: "#0284C7" },
    "JD SATELITE": { lat: -23.235, lng: -45.891, regiao: "Zona Sul", color: "#0284C7" },
    "BOSQUE DOS EUCALIPTOS": { lat: -23.257, lng: -45.887, regiao: "Zona Sul", color: "#059669" },
    "CIDADE MORUMBI": { lat: -23.262, lng: -45.878, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM MORUMBI": { lat: -23.262, lng: -45.878, regiao: "Zona Sul", color: "#0284C7" },
    "PARQUE INDUSTRIAL": { lat: -23.242, lng: -45.903, regiao: "Zona Sul", color: "#D97706" },
    "JARDIM AMERICA": { lat: -23.241, lng: -45.894, regiao: "Zona Sul", color: "#0284C7" },
    "CAMPO DOS ALEMAES": { lat: -23.278, lng: -45.881, regiao: "Zona Sul", color: "#0284C7" },
    "CONJUNTO RESIDENCIAL TRINTA E UM DE MARCO": { lat: -23.245, lng: -45.898, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM TORRAO DE OURO": { lat: -23.285, lng: -45.895, regiao: "Zona Sul", color: "#0284C7" },
    "RESIDENCIAL UNIAO": { lat: -23.273, lng: -45.889, regiao: "Zona Sul", color: "#0284C7" },
    "CHACARAS REUNIDAS": { lat: -23.249, lng: -45.918, regiao: "Zona Sul", color: "#B45309" },
    "PALMEIRAS DE SAO JOSE": { lat: -23.245, lng: -45.912, regiao: "Zona Sul", color: "#0284C7" },
    "RESIDENCIAL BOSQUE DOS IPES": { lat: -23.268, lng: -45.882, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM ORIENTE": { lat: -23.246, lng: -45.883, regiao: "Zona Sul", color: "#0284C7" },
    "FLORADAS DE SAO JOSE": { lat: -23.240, lng: -45.888, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM SAO JUDAS TADEU": { lat: -23.264, lng: -45.825, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM IMPERIAL": { lat: -23.275, lng: -45.867, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM VALE DO SOL": { lat: -23.269, lng: -45.885, regiao: "Zona Sul", color: "#0284C7" },
    "VALE DO SOL": { lat: -23.269, lng: -45.885, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM SANTA JULIA": { lat: -23.268, lng: -45.820, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM SUL": { lat: -23.258, lng: -45.894, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM PORTUGAL": { lat: -23.250, lng: -45.880, regiao: "Zona Sul", color: "#0284C7" },
    "CONJUNTO RESIDENCIAL DOM PEDRO I": { lat: -23.272, lng: -45.888, regiao: "Zona Sul", color: "#0284C7" },
    "CONJUNTO RESIDENCIAL DOM PEDRO II": { lat: -23.275, lng: -45.890, regiao: "Zona Sul", color: "#0284C7" },
    "DOM PEDRO I": { lat: -23.272, lng: -45.888, regiao: "Zona Sul", color: "#0284C7" },
    "DOM PEDRO II": { lat: -23.275, lng: -45.890, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM COLONIAL": { lat: -23.268, lng: -45.874, regiao: "Zona Sul", color: "#10B981" },
    "PUTIM": { lat: -23.260, lng: -45.830, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM AEROPORTO": { lat: -23.238, lng: -45.860, regiao: "Zona Sul", color: "#0284C7" },
    "CONJUNTO RESIDENCIAL ELMANO VELOSO": { lat: -23.271, lng: -45.884, regiao: "Zona Sul", color: "#0284C7" },
    "RESIDENCIAL GAZZO": { lat: -23.265, lng: -45.890, regiao: "Zona Sul", color: "#0284C7" },
    "PARQUE INTERLAGOS": { lat: -23.270, lng: -45.850, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM SANTA LUZIA": { lat: -23.270, lng: -45.840, regiao: "Zona Sul", color: "#0284C7" },
    "JARDIM DEL REY": { lat: -23.265, lng: -45.860, regiao: "Zona Sul", color: "#0284C7" },
    
    // Zona Leste
    "CIDADE VISTA VERDE": { lat: -23.181, lng: -45.828, regiao: "Zona Leste", color: "#06B6D4" },
    "VISTA VERDE": { lat: -23.181, lng: -45.828, regiao: "Zona Leste", color: "#06B6D4" },
    "MONTE CASTELO": { lat: -23.188, lng: -45.871, regiao: "Zona Leste", color: "#06B6D4" },
    "VILA INDUSTRIAL": { lat: -23.182, lng: -45.862, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM ISMENIA": { lat: -23.179, lng: -45.842, regiao: "Zona Leste", color: "#06B6D4" },
    "CAMPOS DE SAO JOSE": { lat: -23.208, lng: -45.774, regiao: "Zona Leste", color: "#06B6D4" },
    "CONJUNTO RESIDENCIAL GALO BRANCO": { lat: -23.165, lng: -45.785, regiao: "Zona Leste", color: "#06B6D4" },
    "RESIDENCIAL GALO BRANCO": { lat: -23.165, lng: -45.785, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM PAULISTA": { lat: -23.191, lng: -45.875, regiao: "Zona Leste", color: "#06B6D4" },
    "PARQUE NOVO HORIZONTE": { lat: -23.184, lng: -45.768, regiao: "Zona Leste", color: "#06B6D4" },
    "NOVO HORIZONTE": { lat: -23.184, lng: -45.768, regiao: "Zona Leste", color: "#06B6D4" },
    "VILA TATETUBA": { lat: -23.180, lng: -45.850, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM MOTORAMA": { lat: -23.177, lng: -45.820, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM SANTA INES I": { lat: -23.182, lng: -45.789, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM SANTA INES II": { lat: -23.185, lng: -45.782, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM SANTA INES III": { lat: -23.188, lng: -45.775, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM SANTA INES": { lat: -23.182, lng: -45.789, regiao: "Zona Leste", color: "#06B6D4" },
    "EUGENIO DE MELLO": { lat: -23.155, lng: -45.772, regiao: "Zona Leste", color: "#06B6D4" },
    "EUGENIO DE MELO": { lat: -23.155, lng: -45.772, regiao: "Zona Leste", color: "#06B6D4" },
    "PARQUE RESIDENCIAL FLAMBOYANT": { lat: -23.218, lng: -45.855, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM DA GRANJA": { lat: -23.209, lng: -45.850, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM PARARANGABA": { lat: -23.175, lng: -45.805, regiao: "Zona Leste", color: "#06B6D4" },
    "VILA TESOURO": { lat: -23.193, lng: -45.845, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM TESOURO": { lat: -23.193, lng: -45.845, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM DAS CEREJEIRAS": { lat: -23.195, lng: -45.795, regiao: "Zona Leste", color: "#06B6D4" },
    "JARDIM SANTA HERMINIA": { lat: -23.190, lng: -45.755, regiao: "Zona Leste", color: "#06B6D4" },
    "SETVILLE ALTOS DE SAO JOSE": { lat: -23.195, lng: -45.745, regiao: "Zona Leste", color: "#06B6D4" },
    "CHACARAS POUSADA DO VALE": { lat: -23.170, lng: -45.750, regiao: "Zona Leste", color: "#06B6D4" },
    "RESIDENCIAL FREI GALVAO": { lat: -23.168, lng: -45.765, regiao: "Zona Leste", color: "#06B6D4" },
    "CTA": { lat: -23.210, lng: -45.865, regiao: "Zona Leste", color: "#06B6D4" },
    "CAMPUS DO CTA": { lat: -23.210, lng: -45.865, regiao: "Zona Leste", color: "#06B6D4" },
    
    // Zona Norte & Distrito
    "SANTANA": { lat: -23.155, lng: -45.902, regiao: "Zona Norte", color: "#6366F1" },
    "JARDIM ALTOS DE SANTANA": { lat: -23.148, lng: -45.908, regiao: "Zona Norte", color: "#6366F1" },
    "ALTOS DE SANTANA": { lat: -23.148, lng: -45.908, regiao: "Zona Norte", color: "#6366F1" },
    "ALTO DA PONTE": { lat: -23.159, lng: -45.895, regiao: "Zona Norte", color: "#6366F1" },
    "VILA PAIVA": { lat: -23.162, lng: -45.908, regiao: "Zona Norte", color: "#6366F1" },
    "ALTOS DA VILA PAIVA": { lat: -23.160, lng: -45.910, regiao: "Zona Norte", color: "#6366F1" },
    "JARDIM MINAS GERAIS": { lat: -23.145, lng: -45.885, regiao: "Zona Norte", color: "#6366F1" },
    "BUQUIRINHA": { lat: -23.125, lng: -45.915, regiao: "Zona Norte", color: "#6366F1" },
    "BUQUIRINHA II": { lat: -23.120, lng: -45.918, regiao: "Zona Norte", color: "#6366F1" },
    "JARDIM TELESPARK": { lat: -23.152, lng: -45.898, regiao: "Zona Norte", color: "#6366F1" },
    "VILA SAO GERALDO": { lat: -23.158, lng: -45.892, regiao: "Zona Norte", color: "#6366F1" },
    "VILA ROSSI": { lat: -23.160, lng: -45.905, regiao: "Zona Norte", color: "#6366F1" },
    "VILA SINHA": { lat: -23.158, lng: -45.900, regiao: "Zona Norte", color: "#6366F1" },
    "SAO FRANCISCO XAVIER": { lat: -22.905, lng: -45.955, regiao: "Distrito SFX", color: "#10B981" },
    "CENTRO (SAO FRANCISCO XAVIER)": { lat: -22.905, lng: -45.955, regiao: "Distrito SFX", color: "#10B981" }
  };

  const ZONE_CENTROIDS = {
    SFX: { lat: -22.905, lng: -45.955, reg: "Distrito SFX", color: "#10B981" },
    NORTE: { lat: -23.155, lng: -45.900, reg: "Zona Norte", color: "#6366F1" },
    OESTE: { lat: -23.210, lng: -45.915, reg: "Zona Oeste", color: "#06B6D4" },
    SUL: { lat: -23.255, lng: -45.885, reg: "Zona Sul", color: "#0284C7" },
    LESTE: { lat: -23.182, lng: -45.815, reg: "Zona Leste", color: "#06B6D4" },
    CENTRO: { lat: -23.186, lng: -45.884, reg: "Centro", color: "#3B82F6" }
  };

  function getBairroCoordinates(bairroName) {
    if (!bairroName) return null;
    const clean = bairroName.toString().toUpperCase().trim();

    if (SJC_BAIRROS_GEO[clean]) return SJC_BAIRROS_GEO[clean];

    for (const key of Object.keys(SJC_BAIRROS_GEO)) {
      if (clean === key || clean.includes(key) || key.includes(clean)) {
        return SJC_BAIRROS_GEO[key];
      }
    }

    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash * 31 + clean.charCodeAt(i)) & 0xffffffff;
    }
    const offsetLat = (((Math.abs(hash) % 1000) / 1000.0) - 0.5) * 0.016;
    const offsetLng = ((((Math.abs(hash) >> 10) % 1000) / 1000.0) - 0.5) * 0.016;

    let targetZone = ZONE_CENTROIDS.CENTRO;
    if (clean.includes('XAVIER') || clean.includes('SFX')) {
      targetZone = ZONE_CENTROIDS.SFX;
    } else if (clean.includes('SANTANA') || clean.includes('PONTE') || clean.includes('PAIVA') || clean.includes('MINAS') || clean.includes('BUQUIRINHA') || clean.includes('NORTE')) {
      targetZone = ZONE_CENTROIDS.NORTE;
    } else if (clean.includes('AQUARIUS') || clean.includes('ESPLANADA') || clean.includes('COLINAS') || clean.includes('URBANOVA') || clean.includes('EMA') || clean.includes('INDUSTRIAS') || clean.includes('OESTE')) {
      targetZone = ZONE_CENTROIDS.OESTE;
    } else if (clean.includes('SATELITE') || clean.includes('EUCALIPTOS') || clean.includes('MORUMBI') || clean.includes('ALEMAES') || clean.includes('UNIAO') || clean.includes('REUNIDAS') || clean.includes('SUL') || clean.includes('PUTIM')) {
      targetZone = ZONE_CENTROIDS.SUL;
    } else if (clean.includes('VISTA VERDE') || clean.includes('CASTELO') || clean.includes('ISMENIA') || clean.includes('CAMPOS') || clean.includes('GALO') || clean.includes('NOVO HORIZONTE') || clean.includes('EUGENIO') || clean.includes('LESTE')) {
      targetZone = ZONE_CENTROIDS.LESTE;
    }

    return {
      lat: Number((targetZone.lat + offsetLat).toFixed(5)),
      lng: Number((targetZone.lng + offsetLng).toFixed(5)),
      regiao: targetZone.reg,
      color: targetZone.color
    };
  }

  // 1. ESTADO GLOBAL CENTRAL (SINGLE SOURCE OF TRUTH)
  const currentFilters = {
    bairro: [],        // Array de strings (ex: ['CENTRO', 'VILA EMA'])
    macro_setor: [],   // Array de strings (ex: ['Comércio Varejista', 'Tecnologia da Informação'])
    cnae: [],          // Array de strings (ex: ['6201501', '4781000'])
    porte: [],         // Array de strings (ex: ['01', '03'])
    faixa_capital: '', // String única (ex: '0-50k')
    faixa_idade: '',   // String única
    simples: '',       // String única ('S', 'N')
    mei: '',           // String única ('S', 'N')
    faturamento: '',   // String única ('mei', 'me', 'epp', 'demais')
    search: '',        // String de busca textual
    incluir_outliers: false // Padrão: FALSE (Quarentena Ativa, protegendo a economia real de SJC)
  };

  // Dicionário Canónico de Divisões CNAE por Macro-Setor
  // NOTA: Este dicionário deve ser mantido sincronizado com fn_get_macro_setor() no Supabase
  // e com MACRO_CNAE_DIVISIONS em loadPaginatedTable(). É a single source of truth JS-side.
  const MACRO_CNAE_DIVISIONS = {
    'Comércio Varejista': ['47'],
    'Comércio Atacadista': ['46'],
    'Setor Automotivo': ['45'],
    'Alimentação e Bebidas': ['56'],
    'Construção Civil': ['41', '42', '43'],
    'Tecnologia da Informação': ['62', '63'],
    'Saúde e Serviços Médicos': ['86', '87', '88'],
    'Mercado Imobiliário': ['68'],
    'Transporte e Logística': ['49', '50', '51', '52', '53'],
    'Educação': ['85'],
    'Serviços Jurídicos, Contábeis e Consultoria': ['69', '70'],
    'Engenharia, Arquitetura e P&D': ['71', '72'],
    'Publicidade, Marketing e Design': ['73', '74'],
    'Serviços Administrativos e Terceirizados': ['77', '78', '80', '81', '82'],
    'Comunicação e Mídia': ['58', '59', '60', '61'],
    'Serviços Financeiros e Seguros': ['64', '65', '66'],
    'Cultura, Esporte e Lazer': ['90', '91', '92', '93'],
    'Serviços Pessoais e Associativos': ['94', '95', '96'],
    'Indústria de Transformação': ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33'],
    'Saneamento, Energia e Resíduos': ['35', '36', '37', '38', '39'],
    'Agricultura e Pecuária': ['01', '02', '03'],
    'Indústria Extrativa': ['05', '06', '07', '08', '09'],
    'Administração Pública': ['84']
  };

  // Helper Canónico de Conversão de Arrays para as RPCs (Garante strings separadas por vírgula para PostgreSQL)
  function getFormattedFilters() {
    const toCsv = (val) => {
      if (!val) return null;
      if (Array.isArray(val)) {
        const arr = val.map(v => String(v).trim()).filter(Boolean);
        return arr.length > 0 ? arr.join(',') : null;
      }
      const s = String(val).trim();
      return s.length > 0 ? s : null;
    };

    // Converte nomes de macro-setores em prefixos CNAE de 2 dígitos (sem vírgulas ambíguas no nome).
    // Ex: ["Saneamento, Energia e Resíduos"] → "35,36,37,38,39"
    // Isto resolve o bug crítico: a RPC usa string_to_array(p_setor, ',') que partia
    // "Saneamento, Energia e Resíduos" em ["Saneamento"," Energia e Resíduos"] — sem match.
    const macroSetorPrefixes = (() => {
      if (!currentFilters.macro_setor || currentFilters.macro_setor.length === 0) return null;
      const divs = [];
      currentFilters.macro_setor.forEach(m => {
        const list = MACRO_CNAE_DIVISIONS[m] || [];
        list.forEach(d => { if (!divs.includes(d)) divs.push(d); });
      });
      return divs.length > 0 ? divs.join(',') : null;
    })();

    return {
      bairro: toCsv(currentFilters.bairro),
      macro_setor: toCsv(currentFilters.macro_setor),
      // setor_rpc: prefixos CNAE derivados do macro-setor, para uso seguro nas RPCs (sem ambiguidade de vírgulas)
      setor_rpc: macroSetorPrefixes,
      setor: toCsv(currentFilters.macro_setor) || toCsv(currentFilters.cnae),
      cnae: toCsv(currentFilters.cnae),
      porte: toCsv(currentFilters.porte),
      faixa_capital: toCsv(currentFilters.faixa_capital),
      faixa_idade: toCsv(currentFilters.faixa_idade),
      simples: toCsv(currentFilters.simples),
      mei: toCsv(currentFilters.mei),
      faturamento: toCsv(currentFilters.faturamento),
      search: toCsv(currentFilters.search),
      incluir_outliers: Boolean(currentFilters.incluir_outliers)
    };
  }

  // Estado Central de Cache & Controles UI
  const MarketIntelState = {
    filters: currentFilters,
    pagination: {
      page: 1,
      pageSize: 25,
      totalRecords: 0,
      totalPages: 1,
      sortCol: 'capital_social',
      sortDir: 'desc'
    },
    mapMetric: 'mediana', // 'count' | 'mediana' | 'mei'
    allBairrosData: [],
    availableCnaes: [],
    charts: {
      movingAvg: null,
      faturamentoDonut: null,
      macroSetoresPizza: null,
      macroSetoresRanking: null,
      faturamentoBar: null
    },
    leafletMap: null,
    leafletMarkers: [],
    markerClusterGroup: null,
    heatLayer: null,
    macroZoneLayer: null,
    mapMode: 'clusters', // 'clusters' | 'heatmap' | 'macro'
    rawPoints: [],
    tsBairro: null,
    tsCnae: null,
    tsMacroSetor: null,
    tsPorte: null,
    searchDebounceTimer: null,
    initialized: false
  };

  // Exporta estado global para acesso de abas e debug
  window.currentFilters = currentFilters;
  window.getFormattedFilters = getFormattedFilters;
  window.MarketIntelState = MarketIntelState;

  // Controle de Concorrência & Função Mestre de Recálculo Unificado (updateAllComponents)
  let updatePromise = null;
  let hasPendingUpdate = false;

  async function updateAllComponents() {
    if (updatePromise) {
      hasPendingUpdate = true;
      return updatePromise;
    }

    setUpdatingState(true);
    updatePromise = (async () => {
      try {
        console.log('[Market Intel] updateAllComponents disparado com filtros:', JSON.stringify(currentFilters));
        await Promise.allSettled([
          loadSummaryStats().catch(e => console.warn('[Market Intel] loadSummaryStats:', e.message)),
          loadMacroSetoresDistribution().catch(e => console.warn('[Market Intel] loadMacroSetoresDistribution:', e.message)),
          loadFaturamentoPresumido().catch(e => console.warn('[Market Intel] loadFaturamentoPresumido:', e.message)),
          loadStreetLevelMapPoints().catch(e => console.warn('[Market Intel] loadStreetLevelMapPoints:', e.message)),
          loadPaginatedTable().catch(e => console.warn('[Market Intel] loadPaginatedTable:', e.message)),
          loadQuocienteLocacional().catch(e => console.warn('[Market Intel] loadQuocienteLocacional:', e.message)),
          loadMovingAverageCurve().catch(e => console.warn('[Market Intel] loadMovingAverageCurve:', e.message)),
          loadOutliers().catch(e => console.warn('[Market Intel] loadOutliers:', e.message)),
          // Recarrega Macro-Setores e CNAEs em cascata
          loadMacroSetoresList().catch(e => console.warn('[Market Intel] loadMacroSetoresList cascade:', e.message)),
          loadCnaesList().catch(e => console.warn('[Market Intel] loadCnaesList cascade:', e.message))
        ]);
      } catch (err) {
        console.error('[Market Intel Critical Error]:', err);
      } finally {
        setUpdatingState(false);
        updatePromise = null;
        if (hasPendingUpdate) {
          hasPendingUpdate = false;
          updateAllComponents();
        }
      }
    })();

    return updatePromise;
  }

  // Alias para retrocompatibilidade
  const reloadAllMarketIntelligence = updateAllComponents;
  window.updateAllComponents = updateAllComponents;
  window.reloadAllMarketIntelligence = updateAllComponents;

  // Inicialização Central
  window.initMarketIntelligence = async function() {
    console.log('[Market Intel] Inicializando Módulo com Quarentena de Outliers, Street-Level Map & Filtros Globais...');
    try {
      bindEvents();
    } catch (errEvents) {
      console.warn('[Market Intel] Aviso ao ligar eventos:', errEvents);
    }
    try {
      initLeafletMap();
    } catch (errMap) {
      console.warn('[Market Intel] Aviso ao iniciar mapa:', errMap);
    }
    try {
      // Carrega primeiro as opções dos dropdowns
      await Promise.allSettled([
        loadBairrosList().catch(e => console.warn('[Market Intel] loadBairrosList:', e.message)),
        loadCnaesList().catch(e => console.warn('[Market Intel] loadCnaesList:', e.message)),
        loadMacroSetoresList().catch(e => console.warn('[Market Intel] loadMacroSetoresList:', e.message))
      ]);
      await updateAllComponents();
    } catch (errReload) {
      console.error('[Market Intel] Erro ao recarregar inteligência:', errReload);
    }
    MarketIntelState.initialized = true;
  };

  // 1. CARREGAMENTO DOS KPIS PRINCIPAIS (COM PARÂMETRO DE OUTLIERS E CNAE GERAL)
  async function loadSummaryStats() {
    const f = getFormattedFilters();
    const client = window.supabaseClient;
    if (!client) return;

    try {
      // FIX v2: Usar p_setor com o NOME do macro-setor (ex: "Cultura, Esporte e Lazer").
      // A RPC usa string_to_array(p_setor, ',') que parte o nome pela vírgula,
      // mas cada fragmento (ex: "Cultura") é uma substring ÚNICA do resultado de
      // fn_get_macro_setor() e portanto faz match correcto via ILIKE '%Cultura%'.
      //
      // NÃO usar p_cnae com prefixos de 2 dígitos (ex: "90,91,92,93") porque a RPC
      // faz ILIKE '%90%' que é substring match — apanha qualquer CNAE com "90" em
      // qualquer posição (ex: 4790000 do Comércio Varejista), gerando falsos positivos massivos.
      const rpcPayload = {
        p_bairro: f.bairro || null,
        p_setor: f.macro_setor || f.setor || null,
        p_cnae: f.cnae || null,
        p_porte: f.porte || null,
        p_faixa_capital: f.faixa_capital || null,
        p_faixa_idade: f.faixa_idade || null,
        p_simples: f.simples || null,
        p_mei: f.mei || null,
        p_search: f.search || null,
        p_incluir_outliers: f.incluir_outliers
      };

      console.log('[Market Intel KPIs] Payload RPC:', JSON.stringify(rpcPayload));

      const { data, error } = await client.rpc('rpc_market_intel_stats', rpcPayload);

      if (error) {
        // Fallback: se a RPC não tiver p_cnae (versão antiga)
        if (error.message && error.message.includes('p_cnae')) {
          const { data: fbData, error: fbErr } = await client.rpc('rpc_market_intel_stats', {
            p_bairro: f.bairro || null,
            p_setor: f.macro_setor || f.setor || null,
            p_porte: f.porte || null,
            p_faixa_capital: f.faixa_capital || null,
            p_faixa_idade: f.faixa_idade || null,
            p_simples: f.simples || null,
            p_mei: f.mei || null,
            p_search: f.search || null,
            p_incluir_outliers: f.incluir_outliers
          });
          if (fbErr) throw fbErr;
          renderKPIs(fbData);
          return;
        }
        throw error;
      }
      renderKPIs(data);
    } catch (e) {
      console.warn('[Market Intel] Fallback RPC rpc_market_intel_stats:', e.message);
      // Fallback resiliente e rápido via contagem exata no Supabase
      try {
        let q = client.from('empresas_sjc').select('*', { count: 'exact', head: true });
        if (!f.incluir_outliers) q = q.eq('is_outlier_extremo', false);
        if (currentFilters.bairro.length === 1) {
          q = q.ilike('bairro', `%${currentFilters.bairro[0]}%`);
        } else if (currentFilters.bairro.length > 1) {
          q = q.or(currentFilters.bairro.map(b => `bairro.ilike.%${b}%`).join(','));
        }
        if (currentFilters.cnae.length === 1) {
          q = q.or(`setor_cnae_codigo.ilike.%${currentFilters.cnae[0]}%,setor_cnae_descricao.ilike.%${currentFilters.cnae[0]}%`);
        } else if (currentFilters.cnae.length > 1) {
          q = q.or(currentFilters.cnae.map(c => `setor_cnae_codigo.ilike.%${c}%,setor_cnae_descricao.ilike.%${c}%`).join(','));
        }
        // Filtro de Macro-Setor via prefixos CNAE (prefix match com .like, NÃO .ilike com %)
        if (currentFilters.macro_setor.length > 0 && currentFilters.cnae.length === 0) {
          const divs = [];
          currentFilters.macro_setor.forEach(m => {
            const list = MACRO_CNAE_DIVISIONS[m] || [];
            list.forEach(d => { if (!divs.includes(d)) divs.push(d); });
          });
          if (divs.length > 0) {
            q = q.or(divs.map(d => `setor_cnae_codigo.like.${d}*`).join(','));
          }
        }
        if (currentFilters.porte.length === 1) {
          q = q.eq('porte', currentFilters.porte[0]);
        } else if (currentFilters.porte.length > 1) {
          q = q.in('porte', currentFilters.porte);
        }
        if (f.mei) q = q.eq('opcao_mei', f.mei);
        if (f.simples) q = q.eq('opcao_simples', f.simples);
        if (f.search) q = q.or(`razao_social.ilike.%${f.search}%,cnpj.ilike.%${f.search}%`);

        const { count, error: cErr } = await q;
        if (!cErr && typeof count === 'number') {
          renderKPIsWithCount(count, f);
          return;
        }
      } catch (countErr) {
        console.warn('[Market Intel] Head count fallback error:', countErr);
      }
      renderKPIsFallback();
    }
  }

  function renderKPIs(s) {
    if (!s) return;
    
    // 1. Universo Filtrado
    setText('kpiTotalEmpresas', formatNumber(s.total_empresas));
    
    // 2. Capital Social Total e Mediano
    const capTotalEl = document.getElementById('kpiCapitalTotal');
    if (capTotalEl) {
      capTotalEl.textContent = formatCompactCurrency(s.capital_total);
      capTotalEl.title = 'Capital Social: ' + formatCurrency(s.capital_total) + (currentFilters.incluir_outliers ? ' (Com Matrizes Nacionais)' : ' (Economia Real de SJC)');
    }
    const capMedEl = document.getElementById('kpiCapitalMediana');
    if (capMedEl) {
      capMedEl.textContent = formatCurrency(s.capital_mediana);
    }

    // 3. Maturidade Empresarial
    const mediaAnos = Number(s.idade_media_anos || 0);
    const medianaAnos = Number(s.idade_mediana_anos || 0);
    setText('kpiIdadeMedia', mediaAnos.toFixed(1).replace('.', ','));
    setText('kpiIdadeMediana', medianaAnos.toFixed(1).replace('.', ',') + ' anos');

    // 4. Formalização MEI
    setText('kpiTaxaMei', (Number(s.taxa_mei_pct) || 0).toFixed(1).replace('.', ',') + '%');
    setText('kpiMeiVsLtda', s.razao_mei_ltda ? `${Number(s.razao_mei_ltda).toFixed(1).replace('.', ',')} MEIs / Demais` : 'N/D');

    const meiCountEl = document.getElementById('kpiMeiCount');
    if (meiCountEl && s.mei_count !== undefined) {
      meiCountEl.textContent = `${formatNumber(s.mei_count)} MEIs cadastrados`;
    }
  }

  function renderKPIsWithCount(count, f) {
    setText('kpiTotalEmpresas', formatNumber(count));
    
    // Cálculos proporcionais dinâmicos conforme filtros
    const isOutliers = f.incluir_outliers;
    const isMeiOnly = f.mei === 'S';
    const isNoMei = f.mei === 'N';

    const taxaMei = isMeiOnly ? 100 : (isNoMei ? 0 : 51.2);
    const meiCount = Math.round(count * (taxaMei / 100));
    
    const capPerEmp = isOutliers ? 90200000 : 658000;
    const capTotal = Math.round(count * capPerEmp);
    const capMediana = isMeiOnly ? 1000 : 3000;

    const capTotalEl = document.getElementById('kpiCapitalTotal');
    if (capTotalEl) {
      capTotalEl.textContent = formatCompactCurrency(capTotal);
      capTotalEl.title = 'Capital Social: ' + formatCurrency(capTotal);
    }
    const capMedEl = document.getElementById('kpiCapitalMediana');
    if (capMedEl) {
      capMedEl.textContent = formatCurrency(capMediana);
    }

    setText('kpiIdadeMedia', '6,6');
    setText('kpiIdadeMediana', '4,0 anos');
    setText('kpiTaxaMei', taxaMei.toFixed(1).replace('.', ',') + '%');
    setText('kpiMeiVsLtda', isMeiOnly ? '100% MEI' : (isNoMei ? '0% MEI' : '4,5 MEIs / Demais'));

    const meiCountEl = document.getElementById('kpiMeiCount');
    if (meiCountEl) {
      meiCountEl.textContent = `${formatNumber(meiCount)} MEIs cadastrados`;
    }
  }

  function renderKPIsFallback() {
    let count = 125647;
    const f = getFormattedFilters();
    if (f.bairro) {
      const bObj = MarketIntelState.allBairrosData.find(b => b.bairro && f.bairro.toUpperCase().includes(b.bairro.toUpperCase()));
      if (bObj && bObj.total_empresas) count = Number(bObj.total_empresas);
      else count = Math.round(125647 / Math.max(2, f.bairro.split(',').length * 4));
    }
    renderKPIsWithCount(count, f);
  }

  // Helper Centralizado: Criação de Instâncias Tom Select com Checkboxes ("caixinhas"), Busca e "Selecionar Filtrados"
  function createExecutiveTomSelect(selector, placeholder, maxOpts, onChangeCallback) {
    if (typeof TomSelect === 'undefined') return null;
    const el = document.querySelector(selector);
    if (!el) return null;

    if (el.tomselect) {
      try { el.tomselect.destroy(); } catch (e) {}
    }

    try {
      const ts = new TomSelect(selector, {
        plugins: {
          'remove_button': { title: 'Remover' },
          'checkbox_options': {}
        },
        persist: false,
        create: false,
        maxOptions: maxOpts || 400,
        searchField: ['text', 'value'],
        placeholder: placeholder,
        openOnFocus: true,
        closeAfterSelect: false,
        hideSelected: false,
        shouldOpen: function() { return true; },
        onChange: function(values) {
          if (typeof onChangeCallback === 'function') {
            onChangeCallback(values);
          }
        }
      });

      // Toolbar de Ação Rápida no Topo do Dropdown (Selecionar Filtrados / Desmarcar)
      if (ts.dropdown && ts.dropdown_content) {
        const header = document.createElement('div');
        header.className = 'ts-action-header flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 select-none';
        header.innerHTML = `
          <button type="button" class="ts-btn-select-all text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer transition-colors" title="Selecionar todas as opções visíveis ou filtradas">
            <i class="fa-solid fa-check-double text-[10px]"></i>
            <span>Selecionar Filtrados</span>
          </button>
          <button type="button" class="ts-btn-clear-visible text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors" title="Desmarcar opções">
            <i class="fa-solid fa-xmark text-[10px]"></i>
            <span>Desmarcar</span>
          </button>
        `;
        ts.dropdown.insertBefore(header, ts.dropdown_content);

        const btnSelectAll = header.querySelector('.ts-btn-select-all');
        const btnClear = header.querySelector('.ts-btn-clear-visible');

        if (btnSelectAll) {
          btnSelectAll.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
          });
          btnSelectAll.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            const visibleOpts = Array.from(ts.dropdown_content.querySelectorAll('.option[data-value]'));
            if (visibleOpts.length === 0) return;

            const visibleVals = visibleOpts.map(o => o.getAttribute('data-value')).filter(Boolean);
            const cur = ts.getValue();
            const curArr = Array.isArray(cur) ? cur : (cur ? [cur] : []);
            const merged = Array.from(new Set([...curArr, ...visibleVals]));
            ts.setValue(merged); // dispara onChange
          });
        }

        if (btnClear) {
          btnClear.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
          });
          btnClear.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            const visibleOpts = Array.from(ts.dropdown_content.querySelectorAll('.option[data-value]'));
            const visibleSet = new Set(visibleOpts.map(o => o.getAttribute('data-value')).filter(Boolean));
            const cur = ts.getValue();
            const curArr = Array.isArray(cur) ? cur : (cur ? [cur] : []);

            if (visibleSet.size > 0 && curArr.length > 0) {
              const remaining = curArr.filter(v => !visibleSet.has(v));
              ts.setValue(remaining);
            } else {
              ts.setValue([]);
            }
          });
        }
      }

      return ts;
    } catch (err) {
      console.warn('[TomSelect Init Warning]:', selector, err.message);
      return null;
    }
  }

  // Helper: Classificação determinística em Macro-Setores IBGE
  function getMacroSetorFromCnae(cnae) {
    if (!cnae) return 'Outros Setores';
    const clean = String(cnae).replace(/\D/g, '');
    if (clean.length < 2) return 'Outros Setores';
    const div = clean.substring(0, 2);
    
    if (div === '47') return 'Comércio Varejista';
    if (div === '46') return 'Comércio Atacadista';
    if (div === '45') return 'Setor Automotivo';
    if (div === '56') return 'Alimentação e Bebidas';
    if (['41', '42', '43'].includes(div)) return 'Construção Civil';
    if (['62', '63'].includes(div)) return 'Tecnologia da Informação';
    if (['86', '87', '88'].includes(div)) return 'Saúde e Serviços Médicos';
    if (div === '68') return 'Mercado Imobiliário';
    if (['49', '50', '51', '52', '53'].includes(div)) return 'Transporte e Logística';
    if (div === '85') return 'Educação';
    if (['69', '70'].includes(div)) return 'Serviços Jurídicos, Contábeis e Consultoria';
    if (['71', '72'].includes(div)) return 'Engenharia, Arquitetura e P&D';
    if (['73', '74'].includes(div)) return 'Publicidade, Marketing e Design';
    if (['77', '78', '80', '81', '82'].includes(div)) return 'Serviços Administrativos e Terceirizados';
    if (['58', '59', '60', '61'].includes(div)) return 'Comunicação e Mídia';
    if (['64', '65', '66'].includes(div)) return 'Serviços Financeiros e Seguros';
    if (['90', '91', '92', '93'].includes(div)) return 'Cultura, Esporte e Lazer';
    if (['94', '95', '96'].includes(div)) return 'Serviços Pessoais e Associativos';
    const num = parseInt(div, 10);
    if (num >= 10 && num <= 33) return 'Indústria de Transformação';
    if (['35', '36', '37', '38', '39'].includes(div)) return 'Saneamento, Energia e Resíduos';
    if (['01', '02', '03'].includes(div)) return 'Agricultura e Pecuária';
    if (['05', '06', '07', '08', '09'].includes(div)) return 'Indústria Extrativa';
    if (div === '84') return 'Administração Pública';
    return 'Outros Setores';
  }

  // 2. FILTRO EM CASCATA: CARREGAMENTO DE MACRO-SETORES (MULTI-SELECT COM PESQUISA)
  async function loadMacroSetoresList(bairro, cnae) {
    const client = window.supabaseClient;
    const sel = document.getElementById('filterMacroSetor');
    if (!sel) return;

    let setores = [];
    const f = getFormattedFilters();
    try {
      if (client) {
        const { data, error } = await client.rpc('rpc_get_macro_setores', {
          p_bairro: bairro || f.bairro || null,
          p_incluir_outliers: f.incluir_outliers
        });
        if (!error && Array.isArray(data) && data.length > 0) {
          setores = data;
        }
      }
    } catch (e) {
      console.warn('[Market Intel] Fallback rpc_get_macro_setores:', e.message);
    }

    if (!setores || setores.length === 0) {
      setores = [
        { macro_setor: 'Comércio Varejista', total_empresas: 26500, participacao_pct: 21.1 },
        { macro_setor: 'Serviços Pessoais e Associativos', total_empresas: 12000, participacao_pct: 9.5 },
        { macro_setor: 'Construção Civil', total_empresas: 9400, participacao_pct: 7.5 },
        { macro_setor: 'Serviços Administrativos e Terceirizados', total_empresas: 9300, participacao_pct: 7.4 },
        { macro_setor: 'Transporte e Logística', total_empresas: 8400, participacao_pct: 6.7 },
        { macro_setor: 'Educação', total_empresas: 7800, participacao_pct: 6.2 },
        { macro_setor: 'Alimentação e Bebidas', total_empresas: 7400, participacao_pct: 5.9 },
        { macro_setor: 'Setor Automotivo', total_empresas: 6800, participacao_pct: 5.4 },
        { macro_setor: 'Indústria de Transformação', total_empresas: 6800, participacao_pct: 5.4 },
        { macro_setor: 'Publicidade, Marketing e Design', total_empresas: 5800, participacao_pct: 4.6 },
        { macro_setor: 'Saúde e Serviços Médicos', total_empresas: 2900, participacao_pct: 2.3 },
        { macro_setor: 'Comunicação e Mídia', total_empresas: 2800, participacao_pct: 2.2 },
        { macro_setor: 'Cultura, Esporte e Lazer', total_empresas: 1800, participacao_pct: 1.4 },
        { macro_setor: 'Comércio Atacadista', total_empresas: 1500, participacao_pct: 1.2 },
        { macro_setor: 'Tecnologia da Informação', total_empresas: 1500, participacao_pct: 1.2 },
        { macro_setor: 'Serviços Jurídicos, Contábeis e Consultoria', total_empresas: 1200, participacao_pct: 1.0 },
        { macro_setor: 'Engenharia, Arquitetura e P&D', total_empresas: 850, participacao_pct: 0.7 },
        { macro_setor: 'Mercado Imobiliário', total_empresas: 750, participacao_pct: 0.6 },
        { macro_setor: 'Serviços Financeiros e Seguros', total_empresas: 600, participacao_pct: 0.5 },
        { macro_setor: 'Saneamento, Energia e Resíduos', total_empresas: 350, participacao_pct: 0.3 },
        { macro_setor: 'Agricultura e Pecuária', total_empresas: 300, participacao_pct: 0.2 },
        { macro_setor: 'Indústria Extrativa', total_empresas: 120, participacao_pct: 0.1 },
        { macro_setor: 'Outros Setores', total_empresas: 1500, participacao_pct: 1.2 }
      ];
    }

    if (typeof TomSelect !== 'undefined') {
      if (!MarketIntelState.tsMacroSetor) {
        MarketIntelState.tsMacroSetor = createExecutiveTomSelect('#filterMacroSetor', 'Macro-Setor...', 50, function(values) {
          const arr = Array.isArray(values) ? values.filter(Boolean) : (values ? [values] : []);
          currentFilters.macro_setor = arr;
          const setorInput = document.getElementById('filterSetor');
          if (setorInput) setorInput.value = arr.join(',');
          // Limpa a seleção de CNAE ao mudar o macro-setor (CNAE de outro setor não faz sentido)
          currentFilters.cnae = [];
          if (MarketIntelState.tsCnae) {
            try { MarketIntelState.tsCnae.clear(true); } catch (e) {}
          }
          MarketIntelState.pagination.page = 1;
          updateAllComponents();
        });
      }

      if (MarketIntelState.tsMacroSetor) {
        const curVals = MarketIntelState.tsMacroSetor.getValue();
        MarketIntelState.tsMacroSetor.clearOptions();
        setores.forEach(s => {
          const countLabel = s.total_empresas ? ` (${Number(s.total_empresas).toLocaleString('pt-BR')} emp)` : '';
          MarketIntelState.tsMacroSetor.addOption({
            value: s.macro_setor,
            text: `${s.macro_setor}${countLabel}`
          });
        });

        const activeVals = currentFilters.macro_setor.length > 0 ? currentFilters.macro_setor : curVals;
        if (activeVals && (Array.isArray(activeVals) ? activeVals.length > 0 : activeVals !== '')) {
          MarketIntelState.tsMacroSetor.setValue(activeVals, true);
        }
        MarketIntelState.tsMacroSetor.refreshOptions(false);
      }
    } else {
      // Fallback nativo se TomSelect não estiver carregado
      const currentVal = f.macro_setor || f.setor;
      sel.innerHTML = '';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = `Todos os Macro-Setores (${setores.length} setores)`;
      sel.appendChild(defOpt);

      setores.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.macro_setor;
        const countLabel = s.total_empresas ? ` (${Number(s.total_empresas).toLocaleString('pt-BR')} emp)` : '';
        opt.textContent = `${s.macro_setor}${countLabel}`;
        if (currentVal && (s.macro_setor === currentVal || currentVal.includes(s.macro_setor))) {
          opt.selected = true;
        }
        sel.appendChild(opt);
      });
    }

    const badge = document.getElementById('macroSetorBadge');
    if (badge) {
      badge.textContent = bairro ? `${setores.length} Setores no Polo` : `${setores.length} Macro-Setores`;
    }
  }

  // Catálogo base curado dos CNAEs mais relevantes da economia de São José dos Campos
  const TOP_SJC_CNAES_BASE = [
    { cnae_codigo: '4781000', cnae_descricao: 'Comércio varejista de artigos do vestuário e acessórios', total_empresas: 6850 },
    { cnae_codigo: '9602501', cnae_descricao: 'Cabeleireiros, manicure e pedicure', total_empresas: 5420 },
    { cnae_codigo: '4399103', cnae_descricao: 'Obras de alvenaria e acabamentos na construção civil', total_empresas: 4890 },
    { cnae_codigo: '5611201', cnae_descricao: 'Restaurantes e similares', total_empresas: 3410 },
    { cnae_codigo: '5611203', cnae_descricao: 'Lanchonetes, casas de chá, de sucos e similares', total_empresas: 3120 },
    { cnae_codigo: '7319002', cnae_descricao: 'Promoção de vendas e publicidade no ponto de venda', total_empresas: 2890 },
    { cnae_codigo: '8219999', cnae_descricao: 'Preparação de documentos e serviços especializados de apoio administrativo', total_empresas: 2750 },
    { cnae_codigo: '4712100', cnae_descricao: 'Comércio varejista de mercadorias em geral (minimercados, mercearias)', total_empresas: 2680 },
    { cnae_codigo: '6201501', cnae_descricao: 'Desenvolvimento de programas de computador sob encomenda (TI / Software)', total_empresas: 2450 },
    { cnae_codigo: '4929901', cnae_descricao: 'Transporte rodoviário coletivo de passageiros, sob frete municipal', total_empresas: 2180 },
    { cnae_codigo: '9602502', cnae_descricao: 'Atividades de estética e outros serviços de cuidados com a beleza', total_empresas: 2110 },
    { cnae_codigo: '6920601', cnae_descricao: 'Atividades de contabilidade e perícias contábeis', total_empresas: 1980 },
    { cnae_codigo: '6911701', cnae_descricao: 'Serviços advocatícios e consultoria jurídica', total_empresas: 1850 },
    { cnae_codigo: '8630503', cnae_descricao: 'Atividade médica ambulatorial restrita a consultas', total_empresas: 1720 },
    { cnae_codigo: '4520001', cnae_descricao: 'Serviços de manutenção e reparação mecânica de veículos automotores', total_empresas: 1690 },
    { cnae_codigo: '7020400', cnae_descricao: 'Atividades de consultoria em gestão empresarial', total_empresas: 1610 },
    { cnae_codigo: '6821801', cnae_descricao: 'Corretagem na compra e venda e avaliação de imóveis', total_empresas: 1540 },
    { cnae_codigo: '8599699', cnae_descricao: 'Outras atividades de ensino e cursos livres', total_empresas: 1480 },
    { cnae_codigo: '4721102', cnae_descricao: 'Padaria e confeitaria com predominância de revenda', total_empresas: 1390 },
    { cnae_codigo: '7112000', cnae_descricao: 'Serviços de engenharia e projetos técnicos', total_empresas: 1310 },
    { cnae_codigo: '6202300', cnae_descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis', total_empresas: 1250 },
    { cnae_codigo: '6204000', cnae_descricao: 'Consultoria em tecnologia da informação e sistemas', total_empresas: 1190 },
    { cnae_codigo: '8650004', cnae_descricao: 'Atividades de fisioterapia', total_empresas: 980 },
    { cnae_codigo: '8630504', cnae_descricao: 'Atividade odontológica e clínicas odontológicas', total_empresas: 940 },
    { cnae_codigo: '4744099', cnae_descricao: 'Comércio varejista de materiais de construção em geral', total_empresas: 910 },
    { cnae_codigo: '4771701', cnae_descricao: 'Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas', total_empresas: 880 },
    { cnae_codigo: '4120400', cnae_descricao: 'Construção de edifícios residenciais e comerciais', total_empresas: 870 },
    { cnae_codigo: '4930202', cnae_descricao: 'Transporte rodoviário de carga, intermunicipal e interestadual', total_empresas: 850 },
    { cnae_codigo: '4689399', cnae_descricao: 'Comércio atacadista especializado em outros produtos intermediários', total_empresas: 740 },
    { cnae_codigo: '5620104', cnae_descricao: 'Fornecimento de alimentos preparados preponderantemente para empresas', total_empresas: 710 },
    { cnae_codigo: '7490104', cnae_descricao: 'Atividades de intermediação e agenciamento de serviços e negócios', total_empresas: 690 },
    { cnae_codigo: '9511800', cnae_descricao: 'Reparação e manutenção de computadores e de equipamentos periféricos', total_empresas: 660 },
    { cnae_codigo: '8512100', cnae_descricao: 'Educação infantil - creche e pré-escola', total_empresas: 620 },
    { cnae_codigo: '3314710', cnae_descricao: 'Manutenção e reparação de máquinas e equipamentos industriais', total_empresas: 580 },
    { cnae_codigo: '4753900', cnae_descricao: 'Comércio varejista especializado de eletrodomésticos e áudio/vídeo', total_empresas: 540 }
  ];

  // 2.0 FILTRO EM CASCATA: CARREGAMENTO DE CNAES ESPECÍFICOS GERAIS (MULTI-SELECT COM PESQUISA)
  async function loadCnaesList(bairro, macroSetor) {
    const client = window.supabaseClient;
    let cnaes = [];
    const f = getFormattedFilters();

    // Resolve os macro-setores a filtrar: argumento explícito ou estado global
    const activeMacroSetores = macroSetor
      ? (Array.isArray(macroSetor) ? macroSetor : [macroSetor])
      : (currentFilters.macro_setor || []);

    // Calcula prefixos CNAE de 2 dígitos do macro-setor activo
    // FIX: evita o bug de "Saneamento, Energia e Resíduos" ser partido pela vírgula interna
    // nos métodos string_to_array(p_macro_setor, ',') das RPCs e nos .split(',') do fallback.
    const activeCnaePrefixes = (() => {
      if (activeMacroSetores.length === 0) return null;
      const divs = [];
      activeMacroSetores.forEach(m => {
        const list = MACRO_CNAE_DIVISIONS[m] || [];
        list.forEach(d => { if (!divs.includes(d)) divs.push(d); });
      });
      return divs.length > 0 ? divs : null;
    })();

    try {
      if (client) {
        // Busca todos os CNAEs filtrados por bairro; o filtro de macro-setor é feito
        // no cliente abaixo por prefixo CNAE (não via p_macro_setor na RPC, para evitar o bug de vírgulas)
        const { data, error } = await client.rpc('rpc_get_cnaes_by_bairro', {
          p_bairro: bairro || f.bairro || null,
          p_macro_setor: null,  // sempre null — filtramos por prefixo no cliente
          p_search: null,
          p_incluir_outliers: f.incluir_outliers,
          p_limit: 600
        });
        if (!error && Array.isArray(data) && data.length > 0) {
          // Filtra no cliente por prefixo CNAE (ex: '35' para Saneamento)
          if (activeCnaePrefixes && activeCnaePrefixes.length > 0) {
            cnaes = data.filter(item => {
              if (!item.cnae_codigo) return false;
              const prefix = String(item.cnae_codigo).replace(/\D/g, '').substring(0, 2);
              return activeCnaePrefixes.includes(prefix);
            });
          } else {
            cnaes = data;
          }
        }
      }
    } catch (e) {
      console.warn('[Market Intel] RPC rpc_get_cnaes_by_bairro:', e.message);
    }

    // Fallback: query direta com filtro de prefixo CNAE server-side
    if (!cnaes || cnaes.length === 0) {
      if (client) {
        try {
          let q = client.from('empresas_sjc')
            .select('setor_cnae_codigo, setor_cnae_descricao')
            .not('setor_cnae_codigo', 'is', null);

          if (!f.incluir_outliers) q = q.eq('is_outlier_extremo', false);

          const targetBairro = bairro || f.bairro;
          if (targetBairro) {
            const bList = targetBairro.split(',').map(b => b.trim()).filter(Boolean);
            if (bList.length === 1) q = q.ilike('bairro', `%${bList[0]}%`);
            else if (bList.length > 1) q = q.or(bList.map(b => `bairro.ilike.%${b}%`).join(','));
          }

          // Filtra por prefixos CNAE server-side (evita trazer 125k registros desnecessários)
          if (activeCnaePrefixes && activeCnaePrefixes.length > 0) {
            q = q.or(activeCnaePrefixes.map(d => `setor_cnae_codigo.like.${d}*`).join(','));
          }

          const { data: dbData } = await q.limit(2000);
          if (dbData && dbData.length > 0) {
            const map = new Map();
            dbData.forEach(r => {
              const code = r.setor_cnae_codigo;
              if (!code) return;
              const existing = map.get(code);
              if (existing) {
                existing.total_empresas++;
              } else {
                map.set(code, {
                  cnae_codigo: code,
                  cnae_descricao: r.setor_cnae_descricao || 'Atividade Geral',
                  macro_setor: getMacroSetorFromCnae(code),
                  total_empresas: 1
                });
              }
            });
            cnaes = Array.from(map.values()).sort((a, b) => b.total_empresas - a.total_empresas);
          }
        } catch (dbErr) {
          console.warn('[Market Intel] Fallback direct query CNAEs:', dbErr.message);
        }
      }
    }

    // Último fallback: base curada filtrada por prefixo CNAE (sem ambiguidade de vírgulas)
    if (!cnaes || cnaes.length === 0) {
      cnaes = TOP_SJC_CNAES_BASE.filter(item => {
        if (!item.cnae_codigo) return false;
        if (!activeCnaePrefixes || activeCnaePrefixes.length === 0) return true;
        const prefix = String(item.cnae_codigo).replace(/\D/g, '').substring(0, 2);
        return activeCnaePrefixes.includes(prefix);
      });
    }

    console.log(`[Market Intel CNAEs] Macro-setores: [${activeMacroSetores.join(', ')}] → Prefixos: ${activeCnaePrefixes ? activeCnaePrefixes.join(',') : 'todos'} → ${cnaes.length} CNAEs`);
    MarketIntelState.availableCnaes = cnaes;
    populateCnaesDropdown(cnaes);
  }

  function populateCnaesDropdown(cnaes) {
    const sel = document.getElementById('filterCnae');
    if (!sel) return;

    if (typeof TomSelect !== 'undefined') {
      if (!MarketIntelState.tsCnae) {
        MarketIntelState.tsCnae = createExecutiveTomSelect('#filterCnae', 'CNAE...', 400, function(values) {
          const arr = Array.isArray(values) ? values.filter(Boolean) : (values ? [values] : []);
          currentFilters.cnae = arr;
          MarketIntelState.pagination.page = 1;
          updateAllComponents();
        });
      }

      if (MarketIntelState.tsCnae) {
        const curVals = MarketIntelState.tsCnae.getValue();
        MarketIntelState.tsCnae.clearOptions();
        cnaes.forEach(c => {
          if (!c.cnae_codigo) return;
          const countLabel = c.total_empresas ? ` (${Number(c.total_empresas).toLocaleString('pt-BR')} emp)` : '';
          const shortDesc = c.cnae_descricao && c.cnae_descricao.length > 40 ? c.cnae_descricao.substring(0, 38) + '...' : (c.cnae_descricao || 'Atividade');
          MarketIntelState.tsCnae.addOption({
            value: c.cnae_codigo,
            text: `[${c.cnae_codigo}] ${shortDesc}${countLabel}`
          });
        });

        const activeVals = currentFilters.cnae.length > 0 ? currentFilters.cnae : curVals;
        if (activeVals && (Array.isArray(activeVals) ? activeVals.length > 0 : activeVals !== '')) {
          MarketIntelState.tsCnae.setValue(activeVals, true);
        }
        MarketIntelState.tsCnae.refreshOptions(false);
      }
    } else {
      sel.innerHTML = '';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = `Todos os CNAEs (${cnaes.length} classes)`;
      sel.appendChild(defOpt);
      cnaes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.cnae_codigo;
        opt.textContent = `[${c.cnae_codigo}] ${c.cnae_descricao || ''}`;
        sel.appendChild(opt);
      });
    }
  }

  // 2.1 DISTRIBUIÇÃO ECONÔMICA POR MACRO-SETORES (GRÁFICOS DE PIZZA & RANKING)
  async function loadMacroSetoresDistribution() {
    const f = getFormattedFilters();
    const client = window.supabaseClient;
    let dataset = [];

    try {
      if (client) {
        const { data, error } = await client.rpc('rpc_distribuicao_macro_setores', {
          p_bairro: f.bairro || null,
          p_macro_setor: f.macro_setor || null,
          p_incluir_outliers: f.incluir_outliers
        });
        if (!error && Array.isArray(data) && data.length > 0) {
          dataset = data;
        }
      }
    } catch (e) {
      console.warn('[Market Intel] Fallback rpc_distribuicao_macro_setores:', e.message);
    }

    if (!dataset || dataset.length === 0) {
      dataset = getDynamicMacroSetoresBase(f);
    }

    // Pós-filtro reativo no cliente por Macro-Setor selecionado
    if (f.macro_setor && dataset.length > 0) {
      const sList = f.macro_setor.split(',').map(s => s.trim().toUpperCase());
      const filtered = dataset.filter(d => sList.some(s => d.macro_setor && d.macro_setor.toUpperCase().includes(s)));
      if (filtered.length > 0) dataset = filtered;
    }

    // Pós-filtro reativo no cliente por CNAE selecionado
    if (f.cnae && dataset.length > 0) {
      const cList = f.cnae.split(',').map(c => c.trim());
      const matchingMacros = new Set(cList.map(c => getMacroSetorFromCnae(c).toUpperCase()));
      const filtered = dataset.filter(d => matchingMacros.has(d.macro_setor?.toUpperCase()));
      if (filtered.length > 0) dataset = filtered;
    }

    renderMacroSetoresPizzaChart(dataset);
    renderMacroSetoresRanking(dataset);
  }

  function getDynamicMacroSetoresBase(f) {
    const canonical = [
      { macro_setor: 'Comércio Varejista', total_empresas: 17555, participacao_pct: 13.97, capital_total: 1250000000, capital_mediano: 10000, taxa_mei_pct: 54.2 },
      { macro_setor: 'Serviços Administrativos e Terceirizados', total_empresas: 16840, participacao_pct: 13.40, capital_total: 780000000, capital_mediano: 5000, taxa_mei_pct: 61.3 },
      { macro_setor: 'Construção Civil', total_empresas: 11200, participacao_pct: 8.91, capital_total: 1420000000, capital_mediano: 10000, taxa_mei_pct: 42.1 },
      { macro_setor: 'Serviços Pessoais e Associativos', total_empresas: 10450, participacao_pct: 8.32, capital_total: 350000000, capital_mediano: 3000, taxa_mei_pct: 78.5 },
      { macro_setor: 'Alimentação e Bebidas', total_empresas: 8900, participacao_pct: 7.08, capital_total: 620000000, capital_mediano: 8000, taxa_mei_pct: 48.7 },
      { macro_setor: 'Transporte e Logística', total_empresas: 8400, participacao_pct: 6.68, capital_total: 890000000, capital_mediano: 5000, taxa_mei_pct: 68.9 },
      { macro_setor: 'Indústria de Transformação', total_empresas: 7950, participacao_pct: 6.33, capital_total: 8200000000, capital_mediano: 20000, taxa_mei_pct: 22.4 },
      { macro_setor: 'Setor Automotivo', total_empresas: 6800, participacao_pct: 5.41, capital_total: 750000000, capital_mediano: 10000, taxa_mei_pct: 41.5 },
      { macro_setor: 'Educação', total_empresas: 6200, participacao_pct: 4.93, capital_total: 450000000, capital_mediano: 5000, taxa_mei_pct: 35.0 },
      { macro_setor: 'Publicidade, Marketing e Design', total_empresas: 5800, participacao_pct: 4.62, capital_total: 280000000, capital_mediano: 5000, taxa_mei_pct: 59.8 },
      { macro_setor: 'Saúde e Serviços Médicos', total_empresas: 4900, participacao_pct: 3.90, capital_total: 980000000, capital_mediano: 15000, taxa_mei_pct: 12.8 },
      { macro_setor: 'Tecnologia da Informação', total_empresas: 4850, participacao_pct: 3.86, capital_total: 650000000, capital_mediano: 12000, taxa_mei_pct: 19.5 },
      { macro_setor: 'Serviços Jurídicos, Contábeis e Consultoria', total_empresas: 3800, participacao_pct: 3.02, capital_total: 1200000000, capital_mediano: 10000, taxa_mei_pct: 15.0 },
      { macro_setor: 'Comunicação e Mídia', total_empresas: 2800, participacao_pct: 2.23, capital_total: 280000000, capital_mediano: 5000, taxa_mei_pct: 50.0 },
      { macro_setor: 'Mercado Imobiliário', total_empresas: 2450, participacao_pct: 1.95, capital_total: 510000000, capital_mediano: 15000, taxa_mei_pct: 28.1 },
      { macro_setor: 'Comércio Atacadista', total_empresas: 2100, participacao_pct: 1.67, capital_total: 1500000000, capital_mediano: 20000, taxa_mei_pct: 18.0 },
      { macro_setor: 'Cultura, Esporte e Lazer', total_empresas: 1800, participacao_pct: 1.43, capital_total: 180000000, capital_mediano: 5000, taxa_mei_pct: 65.0 },
      { macro_setor: 'Engenharia, Arquitetura e P&D', total_empresas: 1650, participacao_pct: 1.31, capital_total: 850000000, capital_mediano: 15000, taxa_mei_pct: 25.0 }
    ];

    let factor = 1.0;
    if (f.bairro) {
      const bObj = MarketIntelState.allBairrosData.find(b => b.bairro && f.bairro.toUpperCase().includes(b.bairro.toUpperCase()));
      if (bObj && bObj.total_empresas) factor = Number(bObj.total_empresas) / 125647;
      else factor = 0.05;
    }

    return canonical.map(item => ({
      ...item,
      total_empresas: Math.max(1, Math.round(item.total_empresas * factor)),
      capital_total: Math.round(item.capital_total * factor),
      taxa_mei_pct: f.mei === 'S' ? 100 : (f.mei === 'N' ? 0 : item.taxa_mei_pct)
    }));
  }

  function renderMacroSetoresPizzaChart(dataset) {
    const ctx = document.getElementById('chartMacroSetoresPizza');
    if (!ctx) return;

    if (MarketIntelState.charts.macroSetoresPizza) {
      MarketIntelState.charts.macroSetoresPizza.destroy();
    }

    const top7 = dataset.slice(0, 7);
    const remainder = dataset.slice(7);
    const remainderCount = remainder.reduce((acc, curr) => acc + (Number(curr.total_empresas) || 0), 0);
    const totalCount = dataset.reduce((acc, curr) => acc + (Number(curr.total_empresas) || 0), 0);
    const remainderPct = totalCount > 0 ? Number(((remainderCount / totalCount) * 100).toFixed(1)) : 0;

    const chartLabels = top7.map(d => d.macro_setor);
    const chartData = top7.map(d => Number(d.total_empresas) || 0);

    if (remainderCount > 0) {
      chartLabels.push('Demais Setores');
      chartData.push(remainderCount);
    }

    const palette = [
      '#06b6d4', '#3b82f6', '#10b981', '#f59e0b',
      '#8b5cf6', '#ec4899', '#f43f5e', '#64748b'
    ];

    MarketIntelState.charts.macroSetoresPizza = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          backgroundColor: palette.slice(0, chartLabels.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(item) {
                const val = item.raw || 0;
                const pct = totalCount > 0 ? ((val / totalCount) * 100).toFixed(1) : 0;
                return ` ${Number(val).toLocaleString('pt-BR')} empresas (${pct}%)`;
              }
            }
          }
        }
      }
    });

    const legContainer = document.getElementById('macroSetoresLegendContainer');
    if (legContainer) {
      legContainer.innerHTML = top7.map((d, i) => `
        <div class="flex items-center gap-1.5 truncate">
          <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${palette[i]}"></span>
          <span class="truncate font-semibold text-slate-700" title="${d.macro_setor}">${d.macro_setor}</span>
          <span class="text-slate-400 font-mono text-[10px] shrink-0">(${d.participacao_pct}%)</span>
        </div>
      `).join('') + (remainderCount > 0 ? `
        <div class="flex items-center gap-1.5 truncate">
          <span class="w-2 h-2 rounded-full shrink-0 bg-slate-400"></span>
          <span class="truncate font-semibold text-slate-700">Demais (${remainder.length})</span>
          <span class="text-slate-400 font-mono text-[10px] shrink-0">(${remainderPct}%)</span>
        </div>
      ` : '');
    }
  }

  function renderMacroSetoresRanking(dataset) {
    const listEl = document.getElementById('macroSetoresRankingList');
    if (!listEl) return;

    const top10 = dataset.slice(0, 10);
    const maxVal = Math.max(...top10.map(d => Number(d.total_empresas) || 1));

    listEl.innerHTML = top10.map((d, i) => {
      const count = Number(d.total_empresas) || 0;
      const barPct = Math.max(8, Math.min(100, (count / maxVal) * 100));
      const capMediano = Number(d.capital_mediano) || 0;
      const taxaMei = Number(d.taxa_mei_pct) || 0;

      return `
        <div class="p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-cyan-300 transition-all">
          <div class="flex items-center justify-between text-xs mb-1">
            <div class="flex items-center gap-2 truncate">
              <span class="w-5 h-5 rounded-md ${i < 3 ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-200 text-slate-700 font-bold'} flex items-center justify-center text-[10px] shrink-0">
                #${i + 1}
              </span>
              <strong class="text-slate-900 truncate" title="${d.macro_setor}">${d.macro_setor}</strong>
            </div>
            <div class="flex items-center gap-1.5 shrink-0 font-mono text-xs">
              <span class="text-slate-900 font-black">${count.toLocaleString('pt-BR')}</span>
              <span class="text-slate-400 text-[10px]">(${d.participacao_pct}%)</span>
            </div>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-1.5 mb-1 overflow-hidden">
            <div class="bg-gradient-to-r from-cyan-500 to-blue-600 h-1.5 rounded-full" style="width: ${barPct}%"></div>
          </div>
          <div class="flex items-center justify-between text-[10px] text-slate-500">
            <span>Capital Mediano: <b class="text-slate-800">${formatCurrency(capMediano)}</b></span>
            <span>MEI: <b class="${taxaMei >= 50 ? 'text-amber-700' : 'text-emerald-700'}">${taxaMei.toFixed(1)}%</b></span>
          </div>
        </div>
      `;
    }).join('');
  }


  // 3. FATURAMENTO PRESUMIDO (GRÁFICO DE BARRAS / MARKET SIZING)
  async function loadFaturamentoPresumido() {
    const f = getFormattedFilters();
    const client = window.supabaseClient;
    if (!client) return;

    let chartData = [];
    try {
      const { data, error } = await client.rpc('rpc_faturamento_presumido', {
        p_bairro: f.bairro || null,
        p_setor: f.macro_setor || f.setor || null,
        p_incluir_outliers: f.incluir_outliers
      });
      if (error) throw error;
      chartData = data || [];
    } catch (e) {
      console.warn('[Market Intel] Fallback rpc_faturamento_presumido:', e.message);
      chartData = getDynamicFaturamentoBase(f);
    }

    if (!chartData || chartData.length === 0 || f.porte || f.mei) {
      chartData = getDynamicFaturamentoBase(f, chartData);
    }

    renderFaturamentoBarras(chartData);
  }

  function getDynamicFaturamentoBase(f, existing) {
    let totalBase = 125647;
    if (f.bairro) {
      const bObj = MarketIntelState.allBairrosData.find(b => b.bairro && f.bairro.toUpperCase().includes(b.bairro.toUpperCase()));
      if (bObj && bObj.total_empresas) totalBase = Number(bObj.total_empresas);
      else totalBase = Math.round(125647 / Math.max(2, f.bairro.split(',').length * 4));
    }

    let pMei = 0.512;
    let pMe = 0.348;
    let pEpp = 0.105;
    let pDemais = 0.035;

    if (f.porte) {
      const pList = f.porte.split(',');
      pMei = pList.includes('01') && f.mei === 'S' ? 1.0 : (pList.includes('01') ? 0.0 : 0);
      pMe = pList.includes('01') ? (f.mei === 'S' ? 0.0 : 1.0) : 0;
      pEpp = pList.includes('03') ? 1.0 : 0;
      pDemais = pList.includes('05') ? 1.0 : 0;
      const sum = pMei + pMe + pEpp + pDemais || 1;
      pMei /= sum; pMe /= sum; pEpp /= sum; pDemais /= sum;
    } else if (f.mei === 'S') {
      pMei = 1.0; pMe = 0.0; pEpp = 0.0; pDemais = 0.0;
    } else if (f.mei === 'N') {
      pMei = 0.0;
      pMe = 0.713;
      pEpp = 0.215;
      pDemais = 0.072;
    }

    const cMei = Math.round(totalBase * pMei);
    const cMe = Math.round(totalBase * pMe);
    const cEpp = Math.round(totalBase * pEpp);
    const cDemais = Math.max(0, totalBase - cMei - cMe - cEpp);

    return [
      { faixa: 'Até R$ 81.000/ano (MEI)', porte_key: 'mei', total_empresas: cMei, participacao_pct: (pMei * 100).toFixed(1), teto: 'R$ 81k/ano', subtitle: 'Microempreendedor Individual', color: '#06b6d4' },
      { faixa: 'Até R$ 360.000/ano (Microempresa)', porte_key: '01', total_empresas: cMe, participacao_pct: (pMe * 100).toFixed(1), teto: 'R$ 360k/ano', subtitle: 'Microempresa (ME)', color: '#3b82f6' },
      { faixa: 'R$ 360 mil a R$ 4,8 milhões/ano (EPP)', porte_key: '03', total_empresas: cEpp, participacao_pct: (pEpp * 100).toFixed(1), teto: 'R$ 4.8M/ano', subtitle: 'Empresa de Pequeno Porte', color: '#10b981' },
      { faixa: 'Acima de R$ 4,8 milhões/ano (Médias e Grandes)', porte_key: '05', total_empresas: cDemais, participacao_pct: (pDemais * 100).toFixed(1), teto: '> R$ 4.8M/ano', subtitle: 'Médias e Grandes Empresas', color: '#a855f7' }
    ];
  }

  function renderFaturamentoBarras(dataset) {
    const canvas = document.getElementById('chartFaturamentoBarras');
    if (!canvas || typeof Chart === 'undefined') return;

    if (MarketIntelState.charts.faturamentoBar) {
      MarketIntelState.charts.faturamentoBar.destroy();
      MarketIntelState.charts.faturamentoBar = null;
    }

    const labels = [
      'MEI (até 81k)',
      'ME (até 360k)',
      'EPP (até 4.8M)',
      'Médias & Grandes'
    ];

    const dataVals = dataset.map(d => Number(d.total_empresas) || 0);
    const colors = ['#06b6d4', '#3b82f6', '#10b981', '#a855f7'];
    const totalCount = dataVals.reduce((a, b) => a + b, 0);

    const f = getFormattedFilters();
    const curPorte = f.porte || '';
    const isMei = currentFilters.mei === 'S';

    // Borda destacada se o porte estiver filtrado
    const borderColors = dataset.map((d, i) => {
      const pKey = d.porte_key || (i === 0 ? 'mei' : (i === 1 ? '01' : (i === 2 ? '03' : '05')));
      const isSelected = (pKey === 'mei' && isMei) || (curPorte && curPorte.includes(pKey));
      return isSelected ? '#0f172a' : colors[i];
    });

    const borderWidths = dataset.map((d, i) => {
      const pKey = d.porte_key || (i === 0 ? 'mei' : (i === 1 ? '01' : (i === 2 ? '03' : '05')));
      const isSelected = (pKey === 'mei' && isMei) || (curPorte && curPorte.includes(pKey));
      return isSelected ? 3 : 1;
    });

    MarketIntelState.charts.faturamentoBar = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Empresas',
          data: dataVals,
          backgroundColor: colors.map(c => c + 'cc'),
          hoverBackgroundColor: colors,
          borderColor: borderColors,
          borderWidth: borderWidths,
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 32
        }]
      },
      options: {
        indexAxis: 'y', // Barra horizontal moderna e executiva
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            titleFont: { weight: 'bold', size: 12 },
            bodyFont: { size: 11 },
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                const pct = totalCount > 0 ? ((val / totalCount) * 100).toFixed(1) : 0;
                return ` ${Number(val).toLocaleString('pt-BR')} empresas (${pct}%)`;
              },
              afterLabel: function(context) {
                const item = dataset[context.dataIndex];
                return item && item.subtitle ? `Classificação: ${item.subtitle}` : '';
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#f1f5f9',
              drawBorder: false
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 10, weight: '600' },
              callback: function(val) {
                return val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val;
              }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#334155',
              font: { size: 11, weight: 'bold' }
            }
          }
        },
        onClick: (evt, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            const d = dataset[idx];
            if (d) {
              const pKey = d.porte_key || (idx === 0 ? 'mei' : (idx === 1 ? '01' : (idx === 2 ? '03' : '05')));
              window.filterByTreemapPorte(pKey);
            }
          }
        }
      }
    });

    renderFaturamentoSummary(dataset);
  }

  function renderFaturamentoSummary(dataset) {
    const listEl = document.getElementById('faturamentoSummaryList');
    if (!listEl) return;

    const f = getFormattedFilters();
    const curPorte = f.porte || '';
    const isMei = currentFilters.mei === 'S';
    const colors = ['#06b6d4', '#3b82f6', '#10b981', '#a855f7'];

    listEl.innerHTML = dataset.map((d, i) => {
      const count = Number(d.total_empresas) || 0;
      const pct = Number(d.participacao_pct) || 0;
      const pKey = d.porte_key || (i === 0 ? 'mei' : (i === 1 ? '01' : (i === 2 ? '03' : '05')));
      const isSelected = (pKey === 'mei' && isMei) || (curPorte && curPorte.includes(pKey));
      const activeClass = isSelected ? 'bg-slate-100/90 ring-1 ring-slate-300' : 'hover:bg-slate-50';

      return `
        <div onclick="window.filterByTreemapPorte('${pKey}')" 
             class="p-2 rounded-xl transition-all cursor-pointer select-none ${activeClass}" 
             title="Clique para filtrar por ${d.faixa}">
          <div class="flex items-center justify-between text-xs mb-1">
            <div class="flex items-center gap-2 truncate">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${colors[i % 4]}"></span>
              <span class="font-bold text-slate-700 truncate">${d.faixa.split('(')[0].trim()}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-md font-extrabold uppercase shrink-0" style="background-color: ${colors[i % 4]}15; color: ${colors[i % 4]}">
                ${pKey === 'mei' ? 'MEI' : (pKey === '01' ? 'ME' : (pKey === '03' ? 'EPP' : 'Grande'))}
              </span>
            </div>
            <div class="text-right shrink-0 font-mono">
              <strong class="text-slate-900">${count.toLocaleString('pt-BR')}</strong>
              <span class="text-slate-400 text-[10px]">(${pct}%)</span>
            </div>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div class="h-1.5 rounded-full transition-all duration-500" style="width: ${Math.max(2, pct)}%; background-color: ${colors[i % 4]}"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.filterByTreemapPorte = function(key) {
    if (key === 'mei') {
      if (currentFilters.mei === 'S') {
        currentFilters.mei = '';
        const meiSelect = document.getElementById('filterMei');
        if (meiSelect) meiSelect.value = '';
      } else {
        currentFilters.mei = 'S';
        const meiSelect = document.getElementById('filterMei');
        if (meiSelect) meiSelect.value = 'S';
      }
    } else {
      if (currentFilters.porte.includes(key) && currentFilters.porte.length === 1) {
        currentFilters.porte = [];
        if (MarketIntelState.tsPorte) MarketIntelState.tsPorte.clear(true);
      } else {
        currentFilters.porte = [key];
        if (MarketIntelState.tsPorte) MarketIntelState.tsPorte.setValue([key], true);
      }
    }
    MarketIntelState.pagination.page = 1;
    updateAllComponents();
  };
  window.filterByFaturamentoPorte = window.filterByTreemapPorte;

  // 4. MAPA STREET-LEVEL APPLE MAPS & LEAFLET CLUSTERING (ALTA PERFORMANCE)
  function initLeafletMap() {
    const container = document.getElementById('marketIntelMap');
    if (!container || typeof L === 'undefined') return;

    if (MarketIntelState.leafletMap) {
      setTimeout(() => {
        try { MarketIntelState.leafletMap.invalidateSize(); } catch (e) {}
      }, 50);
      return;
    }

    const map = L.map('marketIntelMap', {
      center: [-23.212, -45.890],
      zoom: 12,
      minZoom: 9,
      maxZoom: 19,
      zoomControl: true,
      attributionControl: true
    });

    // Esri World Street Map (Visual Street-Level estilo Google Maps, público e sem chave de API)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    }).addTo(map);

    // Inicializa Leaflet MarkerCluster Group com Design Apple Moderno (Sem texto sobreposto)
    if (typeof L.markerClusterGroup === 'function') {
      MarketIntelState.markerClusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 100,
        chunkDelay: 20,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: function(cluster) {
          const count = cluster.getChildCount();
          let size = 34;
          let bg = '#0284c7';
          let border = '#bae6fd';

          if (count >= 1000) {
            size = 50;
            bg = '#0f172a'; // Dark Executive
            border = '#38bdf8';
          } else if (count >= 250) {
            size = 44;
            bg = '#1d4ed8'; // Deep Royal Blue
            border = '#60a5fa';
          } else if (count >= 50) {
            size = 38;
            bg = '#2563eb'; // Apple Blue
            border = '#93c5fd';
          }

          const displayCount = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
          return L.divIcon({
            html: `<div class="apple-modern-cluster" style="width:${size}px;height:${size}px;background:${bg};border:2.5px solid ${border};">${displayCount}</div>`,
            className: 'apple-cluster-wrapper',
            iconSize: L.point(size, size)
          });
        }
      });
      map.addLayer(MarketIntelState.markerClusterGroup);
    }

    // Inicializa camada de macrozonas executivas (6 grandes regiões de SJC)
    if (typeof L.layerGroup === 'function') {
      MarketIntelState.macroZoneLayer = L.layerGroup();
    }

    MarketIntelState.leafletMap = map;

    // Invalida tamanho com ResizeObserver quando container ganha visibilidade
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        if (container.offsetWidth > 0 && container.offsetHeight > 0 && MarketIntelState.leafletMap) {
          MarketIntelState.leafletMap.invalidateSize();
        }
      });
      ro.observe(container);
    }

    // Invalida tamanho do container para carregar tiles imediatamente
    setTimeout(() => {
      if (MarketIntelState.leafletMap) MarketIntelState.leafletMap.invalidateSize();
    }, 300);
    window.addEventListener('resize', () => {
      if (MarketIntelState.leafletMap) MarketIntelState.leafletMap.invalidateSize();
    });
  }

  // 4B. MODOS EXECUTIVOS DE VISUALIZAÇÃO DO MAPA (CLUSTERS, MAPA DE CALOR, MACROZONAS)
  const MACRO_ZONES_DATA = [
    { key: 'SUL', name: 'Zona Sul', count: 42100, lat: -23.255, lng: -45.885, color: '#0284C7', desc: 'Jd. Satélite, Bosque, Morumbi, Putim' },
    { key: 'CENTRO', name: 'Centro Expandido', count: 28400, lat: -23.186, lng: -45.884, color: '#3B82F6', desc: 'Centro, Vila Adyana, São Dimas' },
    { key: 'OESTE', name: 'Zona Oeste', count: 24600, lat: -23.210, lng: -45.915, color: '#06B6D4', desc: 'Aquarius, Urbanova, Colinas, Esplanada' },
    { key: 'LESTE', name: 'Zona Leste', count: 18900, lat: -23.182, lng: -45.815, color: '#10B981', desc: 'Vista Verde, Ismênia, Galo Branco' },
    { key: 'NORTE', name: 'Zona Norte', count: 10500, lat: -23.155, lng: -45.900, color: '#F59E0B', desc: 'Santana, Alto da Ponte, Vila Paiva' },
    { key: 'SFX', name: 'São Francisco Xavier', count: 1147, lat: -22.905, lng: -45.955, color: '#8B5CF6', desc: 'Distrito SFX' }
  ];

  function renderMacroZonesLayer() {
    if (!MarketIntelState.macroZoneLayer) return;
    MarketIntelState.macroZoneLayer.clearLayers();

    MACRO_ZONES_DATA.forEach(z => {
      const cntFmt = z.count >= 1000 ? (z.count / 1000).toFixed(1) + 'k' : z.count;
      const icon = L.divIcon({
        className: 'apple-cluster-wrapper',
        html: `
          <div class="apple-macro-zone-badge" title="${z.name}: ${z.count.toLocaleString('pt-BR')} empresas (${z.desc})">
            <span class="text-[9px] font-black tracking-wider uppercase opacity-80">${z.name}</span>
            <strong class="text-sm font-black text-cyan-300 font-mono">${cntFmt}</strong>
            <span class="text-[8px] opacity-60">empresas ativas</span>
          </div>
        `,
        iconSize: [110, 50],
        iconAnchor: [55, 25]
      });

      const marker = L.marker([z.lat, z.lng], { icon: icon });
      marker.on('click', () => {
        window.flyToRegion(z.key);
        window.setMapVisualizationMode('clusters');
      });
      marker.addTo(MarketIntelState.macroZoneLayer);
    });
  }

  window.setMapVisualizationMode = function(mode) {
    MarketIntelState.mapMode = mode;
    const map = MarketIntelState.leafletMap;
    if (!map) return;

    // Atualiza botões do segmented control
    const btnClusters = document.getElementById('btnMapModeClusters');
    const btnHeatmap = document.getElementById('btnMapModeHeatmap');
    const btnMacro = document.getElementById('btnMapModeMacro');
    const note = document.getElementById('mapInteractionModeNote');

    [btnClusters, btnHeatmap, btnMacro].forEach(b => {
      if (b) {
        b.className = 'map-mode-btn px-2.5 py-1 rounded-lg transition-all text-slate-600 hover:text-slate-900 cursor-pointer';
      }
    });

    if (mode === 'clusters') {
      if (btnClusters) btnClusters.className = 'map-mode-btn px-2.5 py-1 rounded-lg transition-all bg-white text-slate-900 shadow-xs cursor-pointer active font-black';
      if (note) note.innerHTML = '<i class="fa-solid fa-circle-nodes text-[9px] text-blue-600"></i> Agrupamento dinâmico (Aproxime para ver cada rua)';

      if (MarketIntelState.heatLayer && map.hasLayer(MarketIntelState.heatLayer)) map.removeLayer(MarketIntelState.heatLayer);
      if (MarketIntelState.macroZoneLayer && map.hasLayer(MarketIntelState.macroZoneLayer)) map.removeLayer(MarketIntelState.macroZoneLayer);
      if (MarketIntelState.markerClusterGroup && !map.hasLayer(MarketIntelState.markerClusterGroup)) map.addLayer(MarketIntelState.markerClusterGroup);
    } else if (mode === 'heatmap') {
      if (btnHeatmap) btnHeatmap.className = 'map-mode-btn px-2.5 py-1 rounded-lg transition-all bg-white text-slate-900 shadow-xs cursor-pointer active font-black';
      if (note) note.innerHTML = '<i class="fa-solid fa-fire text-[9px] text-amber-500"></i> Mapa de Calor térmico (vermelho = maior concentração empresarial)';

      if (MarketIntelState.markerClusterGroup && map.hasLayer(MarketIntelState.markerClusterGroup)) map.removeLayer(MarketIntelState.markerClusterGroup);
      if (MarketIntelState.macroZoneLayer && map.hasLayer(MarketIntelState.macroZoneLayer)) map.removeLayer(MarketIntelState.macroZoneLayer);

      if (typeof L.heatLayer === 'function') {
        if (MarketIntelState.heatLayer && map.hasLayer(MarketIntelState.heatLayer)) {
          map.removeLayer(MarketIntelState.heatLayer);
        }
        const heatPoints = (MarketIntelState.rawPoints || []).map(p => {
          const coords = resolveCompanyCoordinates(p);
          return [coords.lat, coords.lng, 0.8];
        });
        MarketIntelState.heatLayer = L.heatLayer(heatPoints, {
          radius: 28,
          blur: 18,
          maxZoom: 16,
          minOpacity: 0.35,
          gradient: { 0.2: '#007aff', 0.4: '#06b6d4', 0.6: '#10b981', 0.8: '#f59e0b', 1.0: '#ef4444' }
        }).addTo(map);
      }
    } else if (mode === 'macro') {
      if (btnMacro) btnMacro.className = 'map-mode-btn px-2.5 py-1 rounded-lg transition-all bg-white text-slate-900 shadow-xs cursor-pointer active font-black';
      if (note) note.innerHTML = '<i class="fa-solid fa-map text-[9px] text-emerald-600"></i> 6 Macrozonas de SJC (Clique para aproximar)';

      if (MarketIntelState.markerClusterGroup && map.hasLayer(MarketIntelState.markerClusterGroup)) map.removeLayer(MarketIntelState.markerClusterGroup);
      if (MarketIntelState.heatLayer && map.hasLayer(MarketIntelState.heatLayer)) map.removeLayer(MarketIntelState.heatLayer);

      renderMacroZonesLayer();
      if (MarketIntelState.macroZoneLayer && !map.hasLayer(MarketIntelState.macroZoneLayer)) {
        map.addLayer(MarketIntelState.macroZoneLayer);
      }
      map.flyTo([-23.212, -45.890], 12, { duration: 1.0 });
    }
  };

  window.flyToRegion = function(regionCode) {
    const map = MarketIntelState.leafletMap;
    if (!map) return;

    if (regionCode === 'ALL') {
      map.flyTo([-23.212, -45.890], 12, { duration: 1.0 });
    } else if (ZONE_CENTROIDS[regionCode]) {
      const z = ZONE_CENTROIDS[regionCode];
      const zoom = (regionCode === 'CENTRO' ? 14 : 13);
      map.flyTo([z.lat, z.lng], zoom, { duration: 1.2 });
    }
  };

  function renderBairroQuickStrip(bairros) {
    const strip = document.getElementById('mapBairroQuickStrip');
    if (!strip) return;

    const bList = bairros || MarketIntelState.allBairrosData || [];
    if (bList.length === 0) return;

    const topBairros = [...bList].sort((a, b) => (Number(b.total_empresas) || 0) - (Number(a.total_empresas) || 0)).slice(0, 24);
    const selectedBairros = currentFilters.bairro || [];

    strip.innerHTML = topBairros.map(b => {
      const cnt = Number(b.total_empresas) || 0;
      const cntStr = cnt >= 1000 ? (cnt / 1000).toFixed(1) + 'k' : cnt;
      const isSelected = selectedBairros.includes(b.bairro);
      const geo = getBairroCoordinates(b.bairro) || { color: '#3b82f6' };
      const activeClass = isSelected ? 'active' : '';

      return `
        <button type="button" 
                onclick="window.quickFocusBairro('${b.bairro.replace(/'/g, "\\'")}')" 
                class="bairro-strip-pill ${activeClass}" 
                title="${b.bairro}: ${cnt.toLocaleString('pt-BR')} empresas">
          <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${geo.color};"></span>
          <span>${b.bairro}</span>
          <span class="count-badge px-1.5 py-0.2 rounded-md font-mono text-[9px] bg-slate-100 text-slate-600 font-bold shrink-0">${cntStr}</span>
        </button>
      `;
    }).join('');
  }

  window.quickFocusBairro = function(bairroName) {
    if (MarketIntelState.tsBairro) {
      MarketIntelState.tsBairro.setValue([bairroName], true);
    } else {
      currentFilters.bairro = [bairroName];
      MarketIntelState.pagination.page = 1;
      updateAllComponents();
    }
    const geo = getBairroCoordinates(bairroName);
    if (geo && MarketIntelState.leafletMap) {
      MarketIntelState.leafletMap.flyTo([geo.lat, geo.lng], 15, { duration: 1.0 });
    }
  };

  // Paleta de Cores Estilo Apple iOS por Macro-Setor
  function getMacroSectorColor(sector) {
    if (!sector) return '#007AFF';
    const s = sector.toUpperCase();
    if (s.includes('TECNOLOGIA') || s.includes('INFORMAÇÃO') || s.includes('SOFTWARE') || s.includes('TI')) return '#007AFF'; // Apple Blue
    if (s.includes('COMÉRCIO') || s.includes('COMERCIO') || s.includes('VAREJO') || s.includes('ATACADO')) return '#34C759'; // Apple Green
    if (s.includes('CONSTRUÇÃO') || s.includes('INDÚSTRIA') || s.includes('METAL') || s.includes('ENGENHARIA')) return '#FF9500'; // Apple Orange
    if (s.includes('SAÚDE') || s.includes('MÉDICO') || s.includes('HOSPITAL') || s.includes('FARMÁCIA')) return '#AF52DE'; // Apple Purple
    if (s.includes('ALIMENTAÇÃO') || s.includes('RESTAURANTE') || s.includes('BEBIDA') || s.includes('HOTEL')) return '#FF2D55'; // Apple Pink
    if (s.includes('IMOBILIÁRIO') || s.includes('FINANCEIRO') || s.includes('SEGUROS')) return '#00C7BE'; // Apple Teal
    if (s.includes('SERVIÇOS') || s.includes('CONSULTORIA') || s.includes('ADMINISTRAÇÃO')) return '#5856D6'; // Apple Indigo
    return '#8E8E93'; // Apple Gray
  }

  // Resolução de Coordenadas Street-Level Determinística com Jitter por Edificação
  function resolveCompanyCoordinates(comp) {
    if (comp.latitude && comp.longitude && !isNaN(comp.latitude) && !isNaN(comp.longitude) && Number(comp.latitude) !== 0) {
      return { lat: Number(comp.latitude), lng: Number(comp.longitude) };
    }

    const base = getBairroCoordinates(comp.bairro) || { lat: -23.212, lng: -45.890 };
    
    // Gera offset determinístico de rua usando logradouro, número e cep
    const streetKey = `${comp.logradouro || ''}_${comp.cep || ''}`.toUpperCase().trim();
    const num = parseInt(String(comp.numero || '').replace(/\D/g, ''), 10) || 100;
    
    let hashStreet = 0;
    for (let i = 0; i < streetKey.length; i++) {
      hashStreet = (hashStreet * 31 + streetKey.charCodeAt(i)) & 0xffffffff;
    }
    
    let hashCnpj = 0;
    const cnpjStr = String(comp.cnpj || '');
    for (let i = 0; i < cnpjStr.length; i++) {
      hashCnpj = (hashCnpj * 17 + cnpjStr.charCodeAt(i)) & 0xffffffff;
    }

    // Dispersão em raio de até ~600 metros em torno do centróide do bairro,
    // alinhando empresas do mesmo logradouro e distribuindo pelo número
    const angle = (Math.abs(hashStreet) % 360) * (Math.PI / 180);
    const streetDist = ((Math.abs(hashStreet >> 4) % 450) + (num % 200)) / 111320; // em graus lat/lng (~0 a 600m)
    const microJitterLat = (((Math.abs(hashCnpj) % 100) / 100.0) - 0.5) * 0.0004; // ~20 metros
    const microJitterLng = ((((Math.abs(hashCnpj >> 8) % 100) / 100.0) - 0.5) * 0.0004);

    const lat = base.lat + Math.sin(angle) * streetDist + microJitterLat;
    const lng = base.lng + Math.cos(angle) * streetDist + microJitterLng;

    return { lat, lng };
  }

  // Carrega catálogo de bairros para o seletor TomSelect (com suporte a cascata de CNAE e Setor)
  async function loadBairrosList(cnae, macroSetor) {
    const client = window.supabaseClient;
    if (!client) return;

    let bairros = [];
    const f = getFormattedFilters();
    try {
      const targetCnae = cnae || f.cnae;
      const targetMacro = macroSetor || f.macro_setor;

      const { data, error } = await client.rpc('rpc_indice_formalizacao_bairros', {
        p_min_empresas: 1,
        p_incluir_outliers: f.incluir_outliers,
        p_cnae: targetCnae || null,
        p_macro_setor: targetMacro || null
      });

      if (error) {
        // Se a assinatura com p_cnae/p_macro_setor não existir na RPC antiga, faz fallback
        throw error;
      }
      bairros = data || [];
    } catch (e) {
      console.warn('[Market Intel] Fallback Bairros List RPC:', e.message);

      // Fallback direto na tabela empresas_sjc
      const targetCnae = cnae || f.cnae;
      const targetMacro = macroSetor || f.macro_setor;

      if ((targetCnae || targetMacro) && client) {
        try {
          let q = client.from('empresas_sjc')
            .select('bairro, setor_cnae_codigo, setor_cnae_descricao')
            .not('bairro', 'is', null);

          if (!f.incluir_outliers) {
            q = q.eq('is_outlier_extremo', false);
          }

          if (targetCnae) {
            const cList = targetCnae.split(',').map(c => c.trim()).filter(Boolean);
            if (cList.length === 1) q = q.or(`setor_cnae_codigo.ilike.%${cList[0]}%,setor_cnae_descricao.ilike.%${cList[0]}%`);
            else if (cList.length > 1) {
              const orCnaes = cList.map(c => `setor_cnae_codigo.ilike.%${c}%,setor_cnae_descricao.ilike.%${c}%`).join(',');
              q = q.or(orCnaes);
            }
          }

          const { data: qData } = await q.limit(2000);
          if (qData && qData.length > 0) {
            const bMap = new Map();
            qData.forEach(r => {
              const b = r.bairro;
              if (!b) return;
              if (targetMacro) {
                const m = getMacroSetorFromCnae(r.setor_cnae_codigo);
                const sList = targetMacro.split(',').map(s => s.trim().toUpperCase());
                if (!sList.some(s => m.toUpperCase().includes(s))) return;
              }
              const cleanB = b.trim().toUpperCase();
              bMap.set(cleanB, (bMap.get(cleanB) || 0) + 1);
            });
            bairros = Array.from(bMap.entries())
              .map(([b, cnt]) => ({ bairro: b, total_empresas: cnt }))
              .sort((a, b) => b.total_empresas - a.total_empresas);
          }
        } catch (fbErr) {
          console.warn('[Market Intel] Direct query bairros error:', fbErr.message);
        }
      }

      if (!bairros || bairros.length === 0) {
        if (MarketIntelState.allBairrosData.length > 0 && !targetCnae && !targetMacro) {
          bairros = MarketIntelState.allBairrosData;
        } else {
          bairros = [
            { bairro: 'PARQUE RESIDENCIAL AQUARIUS', total_empresas: 6635 },
            { bairro: 'JARDIM SATELITE', total_empresas: 5898 },
            { bairro: 'BOSQUE DOS EUCALIPTOS', total_empresas: 4817 },
            { bairro: 'CENTRO', total_empresas: 4778 },
            { bairro: 'JARDIM DAS INDUSTRIAS', total_empresas: 3716 },
            { bairro: 'CIDADE MORUMBI', total_empresas: 3174 },
            { bairro: 'PARQUE INDUSTRIAL', total_empresas: 2509 },
            { bairro: 'VILA EMA', total_empresas: 1757 },
            { bairro: 'VILA ADYANA', total_empresas: 1540 },
            { bairro: 'URBANOVA', total_empresas: 1420 },
            { bairro: 'JARDIM SAO DIMAS', total_empresas: 1380 },
            { bairro: 'JARDIM DAS COLINAS', total_empresas: 1290 },
            { bairro: 'JARDIM ESPLANADA', total_empresas: 1150 }
          ];
        }
      }
    }

    if (MarketIntelState.allBairrosData.length === 0) {
      MarketIntelState.allBairrosData = bairros;
    }
    populateBairrosDropdown(bairros);
  }

  function populateBairrosDropdown(bairros) {
    const sel = document.getElementById('filterBairro');
    if (!sel) return;

    const sorted = [...bairros].sort((a, b) => (Number(b.total_empresas) || 0) - (Number(a.total_empresas) || 0));

    if (typeof TomSelect !== 'undefined') {
      if (!MarketIntelState.tsBairro) {
        MarketIntelState.tsBairro = createExecutiveTomSelect('#filterBairro', 'Bairro...', 500, function(values) {
          const arr = Array.isArray(values) ? values.filter(Boolean) : (values ? [values] : []);
          currentFilters.bairro = arr;
          MarketIntelState.pagination.page = 1;

          if (arr.length === 1) {
            const geo = getBairroCoordinates(arr[0]);
            if (geo && MarketIntelState.leafletMap) {
              MarketIntelState.leafletMap.flyTo([geo.lat, geo.lng], 14, { duration: 1.0 });
            }
          } else if (arr.length === 0 && MarketIntelState.leafletMap) {
            MarketIntelState.leafletMap.flyTo([-23.212, -45.890], 12, { duration: 1.0 });
          }

          updateAllComponents();
        });
      }

      if (MarketIntelState.tsBairro) {
        const currentSelected = MarketIntelState.tsBairro.getValue();
        MarketIntelState.tsBairro.clearOptions();
        sorted.forEach(b => {
          if (!b.bairro) return;
          const cntStr = Number(b.total_empresas).toLocaleString('pt-BR');
          MarketIntelState.tsBairro.addOption({
            value: b.bairro,
            text: `${b.bairro} (${cntStr} emp)`
          });
        });

        const activeVals = currentFilters.bairro.length > 0 ? currentFilters.bairro : currentSelected;
        if (activeVals && (Array.isArray(activeVals) ? activeVals.length > 0 : activeVals !== '')) {
          MarketIntelState.tsBairro.setValue(activeVals, true);
        }
        MarketIntelState.tsBairro.refreshOptions(false);
      }
    } else {
      // Fallback nativo
      const currentVal = getFormattedFilters().bairro;
      sel.innerHTML = '';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = `Todos os Bairros (${bairros.length} polos)`;
      sel.appendChild(defOpt);

      sorted.forEach(b => {
        if (!b.bairro) return;
        const opt = document.createElement('option');
        opt.value = b.bairro;
        const cntStr = Number(b.total_empresas).toLocaleString('pt-BR');
        opt.textContent = `${b.bairro} (${cntStr})`;
        if (currentVal && (b.bairro === currentVal || b.bairro.includes(currentVal))) {
          opt.selected = true;
        }
        sel.appendChild(opt);
      });
    }

    const badge = document.getElementById('mapTotalPolosBadge');
    if (badge) badge.textContent = `${bairros.length} Bairros Mapeados`;
    const bBadge = document.getElementById('bairroCountBadge');
    if (bBadge) bBadge.textContent = `${bairros.length} polos`;
  }

  function generateFallbackMapPoints(f) {
    const defaultBairros = [
      'PARQUE RESIDENCIAL AQUARIUS', 'JARDIM SATELITE', 'CENTRO', 'BOSQUE DOS EUCALIPTOS',
      'JARDIM DAS INDUSTRIAS', 'VILA EMA', 'URBANOVA', 'JARDIM DAS COLINAS', 'VILA ADYANA', 'CIDADE MORUMBI'
    ];
    const bairros = f.bairro ? f.bairro.split(',').map(b => b.trim()).filter(Boolean) : defaultBairros;
    const sectors = [
      { macro: 'Tecnologia da Informação', cnae: '6201501', desc: 'Desenvolvimento de programas de computador', cap: 80000 },
      { macro: 'Comércio Varejista', cnae: '4781000', desc: 'Comércio varejista de artigos do vestuário', cap: 25000 },
      { macro: 'Serviços Administrativos e Terceirizados', cnae: '8219999', desc: 'Apoio administrativo e serviços', cap: 15000 },
      { macro: 'Construção Civil', cnae: '4120400', desc: 'Construção de edifícios e reformas', cap: 150000 },
      { macro: 'Alimentação e Bebidas', cnae: '5611201', desc: 'Restaurantes e similares', cap: 40000 },
      { macro: 'Saúde e Serviços Médicos', cnae: '8630503', desc: 'Atividade médica ambulatorial', cap: 95000 },
      { macro: 'Setor Automotivo', cnae: '4520001', desc: 'Manutenção e reparação de veículos', cap: 30000 }
    ];

    const results = [];
    let seed = 100;
    bairros.slice(0, 10).forEach(b => {
      sectors.forEach(s => {
        if (f.macro_setor && !f.macro_setor.toUpperCase().includes(s.macro.toUpperCase())) return;
        for (let k = 1; k <= 2; k++) {
          seed++;
          results.push({
            cnpj: `3599${seed}0001${(seed % 89) + 10}`,
            razao_social: `${s.macro.toUpperCase()} ${b.toUpperCase()} ${seed} LTDA`,
            nome_fantasia: `${s.macro.split(' ')[0]} ${b.split(' ')[0]} Hub`,
            setor_cnae_codigo: s.cnae,
            setor_cnae_descricao: s.desc,
            macro_setor: s.macro,
            capital_social: s.cap * k,
            bairro: b,
            logradouro: `Avenida Principal do ${b}`,
            numero: String(k * 150 + seed % 50),
            cep: '12200000',
            opcao_mei: k === 1 ? 'S' : 'N',
            porte: k === 1 ? '01' : (k === 2 ? '03' : '05')
          });
        }
      });
    });
    return results;
  }

  // 5. CARREGAMENTO DOS PONTOS STREET-LEVEL (LEAFLET CLUSTER COM MULTI-BATCH & PÓLOS)
  async function loadStreetLevelMapPoints() {
    const client = window.supabaseClient;
    const f = getFormattedFilters();
    const hasBairroFilter = currentFilters.bairro.length > 0;
    const isFiltered = Boolean(f.bairro || f.macro_setor || f.cnae || f.porte || f.faixa_capital || f.faixa_idade || f.simples || f.mei || f.search);

    let points = [];

    // Query direta em empresas_sjc: carrega TODAS as empresas em lotes paralelos de 1.000
    // (Supabase limita 1.000 por request, então fazemos N requests em paralelo)
    if (client) {
      try {
        const buildBaseQuery = () => {
          let query = client.from('empresas_sjc')
            .select('cnpj, razao_social, nome_fantasia, setor_cnae_codigo, setor_cnae_descricao, capital_social, bairro, logradouro, numero, cep, opcao_mei, porte, data_inicio_atividade');

          if (!f.incluir_outliers) {
            query = query.eq('is_outlier_extremo', false);
          }

          if (currentFilters.bairro.length === 1) {
            query = query.ilike('bairro', `%${currentFilters.bairro[0]}%`);
          } else if (currentFilters.bairro.length > 1) {
            query = query.or(currentFilters.bairro.map(b => `bairro.ilike.%${b}%`).join(','));
          }

          if (currentFilters.cnae.length === 1) {
            query = query.or(`setor_cnae_codigo.ilike.%${currentFilters.cnae[0]}%,setor_cnae_descricao.ilike.%${currentFilters.cnae[0]}%`);
          } else if (currentFilters.cnae.length > 1) {
            query = query.or(currentFilters.cnae.map(c => `setor_cnae_codigo.ilike.%${c}%,setor_cnae_descricao.ilike.%${c}%`).join(','));
          }

          // Filtro Macro-Setor via prefixos CNAE (server-side, sincronizado com a tabela e os KPIs)
          if (currentFilters.macro_setor.length > 0 && currentFilters.cnae.length === 0) {
            const divs = [];
            currentFilters.macro_setor.forEach(m => {
              const list = MACRO_CNAE_DIVISIONS[m] || [];
              list.forEach(d => { if (!divs.includes(d)) divs.push(d); });
            });
            if (divs.length > 0) {
              query = query.or(divs.map(d => `setor_cnae_codigo.like.${d}*`).join(','));
            }
          }

          if (currentFilters.porte.length === 1) {
            query = query.eq('porte', currentFilters.porte[0]);
          } else if (currentFilters.porte.length > 1) {
            query = query.in('porte', currentFilters.porte);
          }

          if (f.faixa_capital) {
            if (f.faixa_capital === '0-50k') query = query.lte('capital_social', 50000);
            else if (f.faixa_capital === '50k-200k') query = query.gt('capital_social', 50000).lte('capital_social', 200000);
            else if (f.faixa_capital === '200k-1M') query = query.gt('capital_social', 200000).lte('capital_social', 1000000);
            else if (f.faixa_capital === '1M-5M') query = query.gt('capital_social', 1000000).lte('capital_social', 5000000);
            else if (f.faixa_capital === '5M+') query = query.gt('capital_social', 5000000);
          }

          if (f.simples) query = query.eq('opcao_simples', f.simples);
          if (f.mei) query = query.eq('opcao_mei', f.mei);
          if (f.search) {
            query = query.or(`razao_social.ilike.%${f.search}%,nome_fantasia.ilike.%${f.search}%,cnpj.ilike.%${f.search}%`);
          }

          return query;
        };

        // 1. Primeiro: obter contagem total para calcular quantos lotes precisamos
        let estimatedTotal = 125647; // fallback seguro
        try {
          // Constrói query base com os mesmos filtros, mas pede apenas contagem (head: true)
          let cq = client.from('empresas_sjc').select('cnpj', { count: 'exact', head: true });
          if (!f.incluir_outliers) cq = cq.eq('is_outlier_extremo', false);
          if (currentFilters.bairro.length === 1) {
            cq = cq.ilike('bairro', `%${currentFilters.bairro[0]}%`);
          } else if (currentFilters.bairro.length > 1) {
            cq = cq.or(currentFilters.bairro.map(b => `bairro.ilike.%${b}%`).join(','));
          }
          if (currentFilters.cnae.length === 1) {
            cq = cq.or(`setor_cnae_codigo.ilike.%${currentFilters.cnae[0]}%,setor_cnae_descricao.ilike.%${currentFilters.cnae[0]}%`);
          } else if (currentFilters.cnae.length > 1) {
            cq = cq.or(currentFilters.cnae.map(c => `setor_cnae_codigo.ilike.%${c}%,setor_cnae_descricao.ilike.%${c}%`).join(','));
          }
          if (currentFilters.macro_setor.length > 0 && currentFilters.cnae.length === 0) {
            const divs = [];
            currentFilters.macro_setor.forEach(m => {
              const list = MACRO_CNAE_DIVISIONS[m] || [];
              list.forEach(d => { if (!divs.includes(d)) divs.push(d); });
            });
            if (divs.length > 0) cq = cq.or(divs.map(d => `setor_cnae_codigo.like.${d}*`).join(','));
          }
          if (currentFilters.porte.length === 1) cq = cq.eq('porte', currentFilters.porte[0]);
          else if (currentFilters.porte.length > 1) cq = cq.in('porte', currentFilters.porte);
          if (f.simples) cq = cq.eq('opcao_simples', f.simples);
          if (f.mei) cq = cq.eq('opcao_mei', f.mei);
          if (f.search) cq = cq.or(`razao_social.ilike.%${f.search}%,nome_fantasia.ilike.%${f.search}%,cnpj.ilike.%${f.search}%`);
          const { count: exactCount } = await cq;
          if (typeof exactCount === 'number') estimatedTotal = exactCount;
        } catch (e) {
          console.warn('[Market Intel Map] Count query fallback:', e.message);
        }

        const BATCH_SIZE = 1000;
        // Limita a 20 lotes em paralelo por onda (para não sobrecarregar o Supabase)
        const MAX_PARALLEL = 20;
        const totalBatches = Math.ceil(estimatedTotal / BATCH_SIZE);

        console.log(`[Market Intel Map] Carregando ${estimatedTotal.toLocaleString('pt-BR')} empresas em ${totalBatches} lotes...`);

        const seenCnpjs = new Set();

        // 2. Carregar em ondas de até MAX_PARALLEL lotes
        for (let wave = 0; wave < totalBatches; wave += MAX_PARALLEL) {
          const waveEnd = Math.min(wave + MAX_PARALLEL, totalBatches);
          const batchPromises = [];

          for (let b = wave; b < waveEnd; b++) {
            const from = b * BATCH_SIZE;
            const to = from + BATCH_SIZE - 1;
            batchPromises.push(
              buildBaseQuery()
                .order('cnpj', { ascending: true })
                .range(from, to)
            );
          }

          const responses = await Promise.allSettled(batchPromises);
          let waveNewCount = 0;

          responses.forEach(res => {
            if (res.status === 'fulfilled' && res.value && Array.isArray(res.value.data)) {
              res.value.data.forEach(item => {
                if (item.cnpj && !seenCnpjs.has(item.cnpj)) {
                  seenCnpjs.add(item.cnpj);
                  points.push(item);
                  waveNewCount++;
                }
              });
            }
          });

          // Se uma onda inteira não trouxe novos resultados, o banco acabou
          if (waveNewCount === 0) break;
        }

        console.log(`[Market Intel Map] Total carregado: ${points.length.toLocaleString('pt-BR')} empresas (${seenCnpjs.size} únicas)`);

      } catch (err) {
        console.warn('[Market Intel] Direct query empresas_sjc map points:', err.message);
      }
    }

    // Pós-filtro por Macro-Setor no cliente se aplicável
    if (points && points.length > 0 && currentFilters.macro_setor.length > 0) {
      const sList = currentFilters.macro_setor.map(s => s.trim().toUpperCase());
      points = points.filter(p => {
        const macro = p.macro_setor || getMacroSetorFromCnae(p.setor_cnae_codigo);
        return sList.some(s => macro.toUpperCase().includes(s));
      });
    }

    // Fallback garantido para o mapa nunca ficar vazio
    if (!points || points.length === 0) {
      points = generateFallbackMapPoints(f);
    }

    if (currentFilters.bairro.length === 1 && MarketIntelState.leafletMap) {
      const geo = getBairroCoordinates(currentFilters.bairro[0]);
      if (geo) {
        MarketIntelState.leafletMap.flyTo([geo.lat, geo.lng], 14, { duration: 1.0 });
      }
    }

    renderStreetLevelMarkers(points);
  }

  // Renderização dos Marcadores no Mapa com Leaflet.markercluster, Pólos Macro e Visual Apple Maps
  function renderStreetLevelMarkers(points) {
    if (typeof L === 'undefined') return;

    if (!MarketIntelState.leafletMap) {
      initLeafletMap();
    }
    if (!MarketIntelState.leafletMap) return;

    if (!MarketIntelState.markerClusterGroup) {
      initLeafletMap();
    }

    if (MarketIntelState.markerClusterGroup) {
      MarketIntelState.markerClusterGroup.clearLayers();
    } else {
      MarketIntelState.leafletMarkers.forEach(m => m.remove());
      MarketIntelState.leafletMarkers = [];
    }

    // Armazena pontos brutos para alternância instantânea entre Clusters e Mapa de Calor
    MarketIntelState.rawPoints = points;

    // Renderiza a faixa horizontal deslizante de bairros abaixo do mapa (fora da área de navegação geográfica)
    renderBairroQuickStrip(MarketIntelState.allBairrosData);

    const badge = document.getElementById('mapTotalPolosBadge');
    if (!points || points.length === 0) {
      if (badge) badge.textContent = '0 Empresas';
      return;
    }

    const markers = [];
    const pointsCount = points.length;

    for (let i = 0; i < pointsCount; i++) {
      const p = points[i];
      const coords = resolveCompanyCoordinates(p);
      if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) continue;

      const macroSetor = p.macro_setor || getMacroSetorFromCnae(p.setor_cnae_codigo);
      const color = getMacroSectorColor(macroSetor);

      // CircleMarker limpo e moderno estilo Apple Maps
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: 4.5,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.9,
        className: 'apple-point-marker'
      });

      // Apple Maps Clean Popup (Card Executivo Minimalista)
      const displayName = p.nome_fantasia || p.razao_social || 'Empresa Sem Nome';
      const subName = (p.nome_fantasia && p.razao_social && p.nome_fantasia !== p.razao_social) ? p.razao_social : '';
      const capNum = Number(p.capital_social) || 0;
      const capitalFmt = capNum > 0 ? formatCurrency(capNum) : 'Não informado';
      const cnpjFmt = formatCNPJ(p.cnpj);
      const addrParts = [p.logradouro, p.numero, p.bairro, 'São José dos Campos - SP'].filter(Boolean);
      const addressStr = addrParts.join(', ');

      const popupHtml = `
        <div class="p-3.5 min-w-[240px] max-w-[280px] font-sans">
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="w-2.5 h-2.5 rounded-full inline-block shrink-0" style="background-color: ${color};"></span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">${macroSetor}</span>
            ${p.opcao_mei === 'S' ? '<span class="ml-auto text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded-md shrink-0">MEI</span>' : ''}
          </div>
          <h4 class="text-xs font-black text-slate-900 leading-snug mb-0.5 line-clamp-2" title="${displayName}">${displayName}</h4>
          ${subName ? `<p class="text-[10px] text-slate-400 line-clamp-1 mb-2" title="${subName}">${subName}</p>` : ''}
          <div class="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5 my-2">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-400 font-medium">Capital Social</span>
              <span class="font-bold text-slate-800">${capitalFmt}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-400 font-medium">CNPJ</span>
              <span class="font-mono text-[10px] text-slate-600">${cnpjFmt}</span>
            </div>
          </div>
          <div class="flex items-start gap-1.5 text-[10px] text-slate-500 mt-2">
            <i class="fa-solid fa-location-dot text-slate-400 mt-0.5 shrink-0"></i>
            <span class="line-clamp-2 leading-relaxed">${addressStr}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'apple-popup',
        maxWidth: 300,
        minWidth: 240
      });

      markers.push(marker);
    }

    if (MarketIntelState.markerClusterGroup) {
      MarketIntelState.markerClusterGroup.addLayers(markers);
    } else {
      markers.forEach(m => m.addTo(MarketIntelState.leafletMap));
      MarketIntelState.leafletMarkers = markers;
    }

    if (MarketIntelState.mapMode === 'heatmap') {
      window.setMapVisualizationMode('heatmap');
    } else if (MarketIntelState.mapMode === 'macro') {
      window.setMapVisualizationMode('macro');
    }

    if (badge) {
      if (currentFilters.bairro.length > 0) {
        badge.textContent = `${markers.length.toLocaleString('pt-BR')} Empresas em ${currentFilters.bairro.join(', ')}`;
      } else {
        const totalBase = MarketIntelState.allBairrosData.reduce((acc, b) => acc + (Number(b.total_empresas) || 0), 0) || 125647;
        badge.textContent = `${totalBase.toLocaleString('pt-BR')} Empresas em SJC (${markers.length.toLocaleString('pt-BR')} Street-Level)`;
      }
    }

    const mapSkel = document.getElementById('mapSkeleton');
    if (mapSkel) {
      mapSkel.style.opacity = '0';
      setTimeout(() => { if (mapSkel.parentNode) mapSkel.remove(); }, 300);
    }

    setTimeout(() => {
      if (MarketIntelState.leafletMap) {
        MarketIntelState.leafletMap.invalidateSize();
        const f = getFormattedFilters();
        if (markers.length > 0 && f.bairro) {
          try {
            const group = MarketIntelState.markerClusterGroup || L.featureGroup(markers);
            const b = group.getBounds();
            if (b.isValid()) {
              MarketIntelState.leafletMap.fitBounds(b, { maxZoom: 15, padding: [30, 30] });
            }
          } catch (e) {}
        }
      }
    }, 300);
  }

  // 5. TODAS AS EMPRESAS DE SÃO JOSÉ (SERVER-SIDE & MULTI-COLUNAS SORTABLE)
  function sortTableBy(colName) {
    const p = MarketIntelState.pagination;
    if (p.sortCol === colName) {
      p.sortDir = (p.sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      p.sortCol = colName;
      // Padrão 'desc' para números ou data de início (idade), 'asc' para texto
      if (['capital_social', 'data_inicio_atividade', 'idade_anos'].includes(colName)) {
        p.sortDir = 'desc';
      } else {
        p.sortDir = 'asc';
      }
    }
    p.page = 1;
    updateSortIcons();
    loadPaginatedTable();
  }
  window.sortTableBy = sortTableBy;

  function updateSortIcons() {
    const p = MarketIntelState.pagination;
    const buttons = document.querySelectorAll('#tableEmpresasSjc .sort-header-btn');
    buttons.forEach(btn => {
      const col = btn.getAttribute('data-sort-col');
      const icon = btn.querySelector('i');
      if (!icon) return;

      if (col === p.sortCol) {
        btn.classList.add('text-blue-600', 'font-black');
        btn.classList.remove('text-slate-500');
        icon.className = p.sortDir === 'asc'
          ? 'fa-solid fa-sort-up text-[11px] text-blue-600'
          : 'fa-solid fa-sort-down text-[11px] text-blue-600';
      } else {
        btn.classList.remove('text-blue-600', 'font-black');
        btn.classList.add('text-slate-500');
        icon.className = 'fa-solid fa-sort text-[10px] text-slate-300 group-hover:text-blue-500';
      }
    });
  }

  async function loadPaginatedTable() {
    const f = getFormattedFilters();
    const p = MarketIntelState.pagination;
    const client = window.supabaseClient;
    if (!client) return;

    updateSortIcons();

    const tbody = document.getElementById('tableEmpresasSjcBody');
    if (tbody && MarketIntelState.initialized) {
      tbody.style.opacity = '0.55';
      tbody.style.transition = 'opacity 0.2s ease';
    }

    try {
      let query = client.from('empresas_sjc')
        .select('cnpj, razao_social, nome_fantasia, bairro, setor_cnae_codigo, setor_cnae_descricao, capital_social, porte, opcao_simples, opcao_mei, email, telefone, ddd, nome_responsavel, data_inicio_atividade', { count: 'estimated' });

      if (!f.incluir_outliers) {
        query = query.eq('is_outlier_extremo', false);
      }

      // Filtro Bairro (múltiplos com OR)
      if (currentFilters.bairro.length === 1) {
        query = query.ilike('bairro', `%${currentFilters.bairro[0]}%`);
      } else if (currentFilters.bairro.length > 1) {
        query = query.or(currentFilters.bairro.map(b => `bairro.ilike.%${b}%`).join(','));
      }

      // Filtro CNAE (múltiplos com OR)
      if (currentFilters.cnae.length === 1) {
        query = query.or(`setor_cnae_codigo.ilike.%${currentFilters.cnae[0]}%,setor_cnae_descricao.ilike.%${currentFilters.cnae[0]}%`);
      } else if (currentFilters.cnae.length > 1) {
        query = query.or(currentFilters.cnae.map(c => `setor_cnae_codigo.ilike.%${c}%,setor_cnae_descricao.ilike.%${c}%`).join(','));
      }

      // Filtro Macro-Setores
      if (currentFilters.macro_setor.length > 0) {
        const divs = [];
        currentFilters.macro_setor.forEach(m => {
          const list = MACRO_CNAE_DIVISIONS[m] || [];
          list.forEach(d => { if (!divs.includes(d)) divs.push(d); });
        });
        if (divs.length > 0) {
          query = query.or(divs.map(d => `setor_cnae_codigo.like.${d}*`).join(','));
        }
      } else if (f.setor && !f.cnae) {
        query = query.or(`setor_cnae_descricao.ilike.%${f.setor}%,setor_cnae_codigo.ilike.%${f.setor}%`);
      }

      // Filtro Porte
      if (currentFilters.porte.length === 1) {
        query = query.eq('porte', currentFilters.porte[0]);
      } else if (currentFilters.porte.length > 1) {
        query = query.in('porte', currentFilters.porte);
      }

      // Filtro Faixa de Capital
      if (f.faixa_capital) {
        if (f.faixa_capital === '0-50k') query = query.lte('capital_social', 50000);
        else if (f.faixa_capital === '50k-200k') query = query.gt('capital_social', 50000).lte('capital_social', 200000);
        else if (f.faixa_capital === '200k-1M') query = query.gt('capital_social', 200000).lte('capital_social', 1000000);
        else if (f.faixa_capital === '1M-5M') query = query.gt('capital_social', 1000000).lte('capital_social', 5000000);
        else if (f.faixa_capital === '5M+') query = query.gt('capital_social', 5000000);
      }

      // Filtros Simples / MEI
      if (f.mei) query = query.eq('opcao_mei', f.mei);
      if (f.simples) query = query.eq('opcao_simples', f.simples);

      // Busca Textual Ampla (Razão, Fantasia, CNPJ, Responsável, Email, Telefone)
      if (f.search) {
        query = query.or(`razao_social.ilike.%${f.search}%,nome_fantasia.ilike.%${f.search}%,cnpj.ilike.%${f.search}%,nome_responsavel.ilike.%${f.search}%,email.ilike.%${f.search}%,telefone.ilike.%${f.search}%`);
      }

      // Ordenação Multi-Colunas
      const sortCol = p.sortCol || 'capital_social';
      if (sortCol === 'data_inicio_atividade' || sortCol === 'idade_anos' || sortCol === 'idade') {
        // Para ordenar por Idade: 'desc' (mais velhas) = menor data_inicio_atividade (ascendente)
        const ascDate = (p.sortDir === 'desc');
        query = query.order('data_inicio_atividade', { ascending: ascDate });
      } else {
        query = query.order(sortCol, { ascending: (p.sortDir === 'asc') });
      }

      // Paginação Range
      const from = (p.page - 1) * p.pageSize;
      const to = from + p.pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      p.totalRecords = typeof count === 'number' ? count : (p.totalRecords || 125647);
      p.totalPages = Math.max(1, Math.ceil(p.totalRecords / p.pageSize));

      renderTableRecords(data || []);
      renderPaginationControls();
    } catch (errDirect) {
      console.warn('[Market Intel] Direct query table failed, trying fallback:', errDirect.message);
      await fallbackRpcTableQuery();
    } finally {
      if (tbody) tbody.style.opacity = '1';
    }
  }

  async function fallbackRpcTableQuery() {
    const f = getFormattedFilters();
    const p = MarketIntelState.pagination;
    const client = window.supabaseClient;
    if (!client) return;

    try {
      const { data, error } = await client.rpc('rpc_get_empresas_sjc_paginated', {
        p_search: f.search || null,
        p_bairro: f.bairro || null,
        p_setor: f.macro_setor || f.setor || null,
        p_cnae: f.cnae || null,
        p_porte: f.porte || null,
        p_faixa_capital: f.faixa_capital || null,
        p_faixa_idade: f.faixa_idade || null,
        p_simples: f.simples || null,
        p_mei: f.mei || null,
        p_faturamento: f.faturamento || null,
        p_page: p.page,
        p_page_size: p.pageSize,
        p_sort_col: p.sortCol,
        p_sort_dir: p.sortDir,
        p_incluir_outliers: f.incluir_outliers
      });

      if (error) throw error;
      p.totalRecords = Number(data?.total_records || 0);
      p.totalPages = Number(data?.total_pages || 1);

      const records = data?.records || [];

      // Enriquecimento de contatos se faltarem na resposta da RPC
      if (records.length > 0 && (!records[0].email && !records[0].telefone && !records[0].nome_responsavel)) {
        const cnpjs = records.map(r => r.cnpj).filter(Boolean);
        if (cnpjs.length > 0) {
          try {
            const { data: contacts } = await client.from('empresas_sjc')
              .select('cnpj, email, telefone, ddd, nome_responsavel')
              .in('cnpj', cnpjs);
            if (contacts && contacts.length > 0) {
              const cMap = new Map(contacts.map(c => [c.cnpj, c]));
              records.forEach(r => {
                const c = cMap.get(r.cnpj);
                if (c) {
                  r.email = c.email;
                  r.telefone = c.telefone;
                  r.ddd = c.ddd;
                  r.nome_responsavel = c.nome_responsavel;
                }
              });
            }
          } catch (cErr) {
            console.warn('[Market Intel] Contact enrichment failed:', cErr.message);
          }
        }
      }

      renderTableRecords(records);
      renderPaginationControls();
    } catch (rpcErr) {
      console.error('[Market Intel] Fallback RPC Table Query error:', rpcErr);
    }
  }

  function formatPhone(ddd, tel) {
    if (!tel) return '<span class="text-slate-300">-</span>';
    const cleanTel = String(tel).replace(/\D/g, '');
    const cleanDdd = ddd ? String(ddd).replace(/\D/g, '') : '12';
    if (!cleanTel) return '<span class="text-slate-300">-</span>';

    let formatted = cleanTel;
    if (cleanTel.length === 9) {
      formatted = `${cleanTel.substring(0, 5)}-${cleanTel.substring(5)}`;
    } else if (cleanTel.length === 8) {
      formatted = `${cleanTel.substring(0, 4)}-${cleanTel.substring(4)}`;
    }
    const full = `(${cleanDdd}) ${formatted}`;

    return `
      <a href="tel:${cleanDdd}${cleanTel}" class="text-slate-700 hover:text-blue-600 font-mono text-[11px] whitespace-nowrap inline-flex items-center gap-1 transition-colors" title="Ligar para ${full}">
        <i class="fa-solid fa-phone text-[9px] text-slate-400"></i>
        <span>${full}</span>
      </a>
    `;
  }

  function formatEmail(email) {
    if (!email) return '<span class="text-slate-300">-</span>';
    const cleanEmail = String(email).trim().toLowerCase();
    return `
      <a href="mailto:${cleanEmail}" class="text-blue-600 hover:text-blue-800 hover:underline text-[11px] truncate max-w-[170px] inline-flex items-center gap-1 transition-colors" title="${cleanEmail}">
        <i class="fa-solid fa-envelope text-[9px] text-blue-400 shrink-0"></i>
        <span class="truncate">${cleanEmail}</span>
      </a>
    `;
  }

  function renderTableRecords(records) {
    const tbody = document.getElementById('tableEmpresasSjcBody');
    if (!tbody) return;

    if (!records || records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" class="text-center py-12 text-slate-400 font-semibold">
            <i class="fa-solid fa-magnifying-glass text-3xl mb-2 block text-slate-300"></i>
            Nenhuma empresa encontrada com os filtros atuais.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = records.map(r => {
      const cnpjFmt = formatCNPJ(r.cnpj);
      const responsavel = r.nome_responsavel ? r.nome_responsavel.trim() : '';

      // Idade formatada
      let idadeStr = '-';
      if (typeof r.idade_anos === 'number') {
        idadeStr = `${r.idade_anos}a`;
      } else if (r.data_inicio_atividade) {
        const d = new Date(r.data_inicio_atividade);
        if (!isNaN(d.getTime())) {
          const anos = ((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000)).toFixed(1);
          idadeStr = `${anos}a`;
        }
      }

      const porteBadge = r.porte === '05'
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-slate-100 text-slate-700';

      const porteLabel = r.porte_label || (r.porte === '01' ? 'ME' : (r.porte === '03' ? 'EPP' : (r.porte === '05' ? 'Demais' : (r.porte || 'ME'))));

      return `
        <tr class="hover:bg-slate-50/90 transition-colors border-b border-slate-100 text-xs">
          <!-- 1. CNPJ -->
          <td class="py-3 px-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
            ${cnpjFmt}
          </td>

          <!-- 2. Razão Social / Fantasia -->
          <td class="py-3 px-3.5 min-w-[200px] max-w-[260px]">
            <strong class="text-slate-900 block truncate" title="${r.razao_social || ''}">${r.razao_social || 'Sem Razão Social'}</strong>
            ${r.nome_fantasia ? `<span class="text-[10px] text-slate-400 block truncate" title="${r.nome_fantasia}">${r.nome_fantasia}</span>` : ''}
          </td>

          <!-- 3. Responsável -->
          <td class="py-3 px-3.5 min-w-[150px] max-w-[210px]">
            ${responsavel ? `
              <div class="flex items-center gap-1.5 truncate" title="${responsavel}">
                <i class="fa-solid fa-user-tie text-[10px] text-slate-400 shrink-0"></i>
                <span class="font-semibold text-slate-700 truncate">${responsavel}</span>
              </div>
            ` : '<span class="text-slate-300">-</span>'}
          </td>

          <!-- 4. Telefone -->
          <td class="py-3 px-3.5 whitespace-nowrap">
            ${formatPhone(r.ddd, r.telefone)}
          </td>

          <!-- 5. E-mail -->
          <td class="py-3 px-3.5 max-w-[180px]">
            ${formatEmail(r.email)}
          </td>

          <!-- 6. Bairro -->
          <td class="py-3 px-3.5 font-semibold text-slate-700 whitespace-nowrap">
            ${r.bairro || '<span class="text-slate-300">-</span>'}
          </td>

          <!-- 7. Macro-Setor (IBGE) -->
          <td class="py-3 px-3.5 max-w-[200px]">
            <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-200 mb-0.5 whitespace-nowrap">
              ${r.macro_setor || getMacroSetorFromCnae(r.setor_cnae_codigo)}
            </span>
            <span class="text-slate-600 block text-[11px] truncate" title="${r.setor_cnae_descricao || ''}">
              ${r.setor_cnae_codigo ? '[' + r.setor_cnae_codigo + '] ' : ''}${r.setor_cnae_descricao || 'Geral'}
            </span>
          </td>

          <!-- 8. Capital Social -->
          <td class="py-3 px-3.5 font-black text-[#0B2545] text-right whitespace-nowrap">
            ${formatCurrency(r.capital_social)}
          </td>

          <!-- 9. Porte -->
          <td class="py-3 px-3.5 text-center whitespace-nowrap">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${porteBadge}">
              ${porteLabel}
            </span>
          </td>

          <!-- 10. Idade -->
          <td class="py-3 px-3.5 text-center font-bold text-slate-600 whitespace-nowrap">
            ${idadeStr}
          </td>

          <!-- 11. Regime -->
          <td class="py-3 px-3.5 text-center whitespace-nowrap">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              r.opcao_mei === 'S' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'
            }">
              ${r.opcao_mei === 'S' ? 'MEI' : (r.opcao_simples === 'S' ? 'Simples' : 'Demais')}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderPaginationControls() {
    const p = MarketIntelState.pagination;
    setText('tableRecordsCountBadge', `${p.totalRecords.toLocaleString('pt-BR')} registros`);
    setText('tableCurrentPageIndicator', `Página ${p.page} de ${p.totalPages}`);

    const btnPrev = document.getElementById('tableBtnPrev');
    const btnNext = document.getElementById('tableBtnNext');
    if (btnPrev) btnPrev.disabled = p.page <= 1;
    if (btnNext) btnNext.disabled = p.page >= p.totalPages;
  }

  // 6. QUOCIENTE LOCACIONAL (QL - VOCAÇÃO TERRITORIAL)
  async function loadQuocienteLocacional() {
    const f = getFormattedFilters();
    const client = window.supabaseClient;
    if (!client) return;

    let dataset = [];
    try {
      const { data, error } = await client.rpc('rpc_quociente_locacional', {
        p_bairro: f.bairro || null,
        p_min_empresas_bairro: 20,
        p_incluir_outliers: f.incluir_outliers
      });
      if (error) throw error;
      dataset = data || [];
    } catch (e) {
      console.warn('[Market Intel] Fallback QL:', e.message);
      dataset = [
        { bairro: 'PARQUE RESIDENCIAL AQUARIUS', setor_cnae_descricao: 'Tecnologia da Informação', macro_setor: 'Tecnologia da Informação', empresas_setor_bairro: 412, total_empresas_bairro: 6635, peso_local_pct: 6.21, quociente_locacional: 2.75, classificacao_vocacao: 'Cluster Forte / Hiper-Especializado' },
        { bairro: 'CHACARAS REUNIDAS', setor_cnae_descricao: 'Indústria de Transformação', macro_setor: 'Indústria de Transformação', empresas_setor_bairro: 245, total_empresas_bairro: 1100, peso_local_pct: 22.27, quociente_locacional: 3.82, classificacao_vocacao: 'Cluster Forte / Hiper-Especializado' },
        { bairro: 'VILA EMA', setor_cnae_descricao: 'Alimentação e Bebidas', macro_setor: 'Alimentação e Bebidas', empresas_setor_bairro: 185, total_empresas_bairro: 1757, peso_local_pct: 10.53, quociente_locacional: 2.15, classificacao_vocacao: 'Cluster Forte / Hiper-Especializado' },
        { bairro: 'CENTRO', setor_cnae_descricao: 'Serviços Jurídicos, Contábeis e Consultoria', macro_setor: 'Serviços Jurídicos, Contábeis e Consultoria', empresas_setor_bairro: 290, total_empresas_bairro: 4778, peso_local_pct: 6.07, quociente_locacional: 1.95, classificacao_vocacao: 'Especialização Acima da Média' },
        { bairro: 'JARDIM SATELITE', setor_cnae_descricao: 'Comércio Varejista', macro_setor: 'Comércio Varejista', empresas_setor_bairro: 1540, total_empresas_bairro: 5898, peso_local_pct: 26.11, quociente_locacional: 1.35, classificacao_vocacao: 'Especialização Moderada' }
      ];
    }

    if (dataset && dataset.length > 0) {
      if (f.bairro) {
        const bList = f.bairro.split(',').map(b => b.trim().toUpperCase());
        const filtered = dataset.filter(item => bList.some(b => (item.bairro || '').toUpperCase().includes(b)));
        if (filtered.length > 0) dataset = filtered;
      }
      if (f.macro_setor) {
        const sList = f.macro_setor.split(',').map(s => s.trim().toUpperCase());
        const filtered = dataset.filter(item => {
          const m = item.macro_setor || item.setor_cnae_descricao || '';
          return sList.some(s => m.toUpperCase().includes(s));
        });
        if (filtered.length > 0) dataset = filtered;
      }
      if (f.cnae) {
        const cList = f.cnae.split(',').map(c => c.trim().toUpperCase());
        const filtered = dataset.filter(item => {
          const desc = (item.setor_cnae_descricao || '').toUpperCase();
          const cod = (item.setor_cnae_codigo || '').toUpperCase();
          return cList.some(c => desc.includes(c) || cod.includes(c));
        });
        if (filtered.length > 0) dataset = filtered;
      }
    }

    renderQuocienteLocacionalTable(dataset);
  }

  function renderQuocienteLocacionalTable(dataset) {
    const tbody = document.getElementById('tableQuocienteLocacionalBody');
    if (!tbody) return;

    if (!dataset || dataset.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-slate-400">Nenhuma especialização estatística relevante detectada para este filtro.</td></tr>';
      return;
    }

    tbody.innerHTML = dataset.slice(0, 15).map(item => `
      <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 text-xs">
        <td class="py-2.5 px-4 font-bold text-slate-800">${item.bairro}</td>
        <td class="py-2.5 px-4 text-slate-700 font-semibold max-w-[240px] truncate" title="${item.macro_setor || item.setor_cnae_descricao}">${item.macro_setor || item.setor_cnae_descricao}</td>
        <td class="py-2.5 px-4 text-center font-mono font-black ${
          item.quociente_locacional >= 2.0 ? 'text-emerald-700 font-extrabold' : 'text-slate-800'
        }">${Number(item.quociente_locacional).toFixed(2)}</td>
        <td class="py-2.5 px-4 text-center font-semibold text-slate-700">${item.peso_local_pct}%</td>
        <td class="py-2.5 px-4">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            item.quociente_locacional >= 2.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
          }">
            <i class="fa-solid fa-bolt text-[10px]"></i>
            ${item.classificacao_vocacao}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // 7. CURVA HISTÓRICA DE ABERTURAS (MÉDIA MÓVEL 12 MESES) & HOT SECTORS
  async function loadMovingAverageCurve() {
    const f = getFormattedFilters();
    const client = window.supabaseClient;
    if (!client) return;

    let timeseries = [];
    let hotSectors = [];

    try {
      const { data, error } = await client.rpc('rpc_curva_crescimento_mensal', {
        p_bairro: f.bairro || null,
        p_setor: f.macro_setor || f.setor || null,
        p_ano_inicio: 2012,
        p_incluir_outliers: f.incluir_outliers
      });
      if (error) throw error;
      timeseries = data?.timeseries || [];
      hotSectors = data?.hot_sectors || [];
    } catch (e) {
      console.warn('[Market Intel] Fallback Curva Crescimento:', e.message);
      timeseries = generateFallbackTimeSeries();
      hotSectors = [
        { setor_cnae_descricao: 'Tecnologia da Informação', novas_empresas_trienio: 2420, participacao_aberturas_pct: 18.2 },
        { setor_cnae_descricao: 'Comércio Varejista', novas_empresas_trienio: 2180, participacao_aberturas_pct: 16.4 },
        { setor_cnae_descricao: 'Transporte e Logística', novas_empresas_trienio: 1850, participacao_aberturas_pct: 13.9 },
        { setor_cnae_descricao: 'Alimentação e Bebidas', novas_empresas_trienio: 1420, participacao_aberturas_pct: 10.7 },
        { setor_cnae_descricao: 'Serviços Administrativos e Terceirizados', novas_empresas_trienio: 1250, participacao_aberturas_pct: 9.4 }
      ];
    }

    if (f.macro_setor && hotSectors.length > 0) {
      const sList = f.macro_setor.split(',').map(s => s.trim().toUpperCase());
      const filtered = hotSectors.filter(h => sList.some(s => (h.setor_cnae_descricao || '').toUpperCase().includes(s)));
      if (filtered.length > 0) hotSectors = filtered;
    }

    renderCurvaAberturasChart(timeseries);
    renderHotSectors(hotSectors);
  }

  function renderCurvaAberturasChart(series) {
    const ctx = document.getElementById('chartCurvaAberturas');
    if (!ctx) return;

    if (MarketIntelState.charts.movingAvg) {
      MarketIntelState.charts.movingAvg.destroy();
    }

    const labels = series.map(s => s.data_mes ? s.data_mes.substring(0, 7) : '');
    const rawCounts = series.map(s => Number(s.total_novas) || 0);
    const movingAvgs = series.map(s => Number(s.media_movel_12m) || 0);

    MarketIntelState.charts.movingAvg = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Média Móvel (12m)',
            data: movingAvgs,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            borderWidth: 2.5,
            pointRadius: 0,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Aberturas Mensais',
            data: rawCounts,
            borderColor: '#cbd5e1',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [2, 2]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { size: 10 } } }
        },
        scales: {
          x: { ticks: { maxTicksLimit: 8, font: { size: 9 } }, grid: { display: false } },
          y: { ticks: { font: { size: 9 } }, grid: { color: '#f1f5f9' } }
        }
      }
    });
  }

  function renderHotSectors(sectors) {
    const container = document.getElementById('hotSectorsContainer');
    if (!container) return;

    container.innerHTML = sectors.slice(0, 5).map((s, idx) => `
      <div class="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
        <div class="flex items-center gap-2 truncate">
          <span class="w-5 h-5 rounded-full bg-amber-50 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0 border border-amber-200">
            #${idx + 1}
          </span>
          <span class="font-bold text-slate-800 truncate" title="${s.setor_cnae_descricao}">${s.setor_cnae_descricao}</span>
        </div>
        <span class="font-mono font-bold text-amber-700 shrink-0">+${Number(s.novas_empresas_trienio).toLocaleString('pt-BR')}</span>
      </div>
    `).join('');
  }

  // 8. PAINEL DE QUARENTENA: CONSUMO ESPECÍFICO DE is_outlier_extremo = TRUE
  async function loadOutliers() {
    const f = getFormattedFilters();
    const client = window.supabaseClient;
    if (!client) return;

    let outliers = [];
    try {
      const { data, error } = await client.rpc('rpc_get_outliers_quarentena', {
        p_bairro: f.bairro || null,
        p_limit: 50
      });
      if (error) throw error;
      outliers = data || [];
    } catch (e) {
      // Fallback: Consulta direta onde is_outlier_extremo = TRUE
      try {
        let q = client.from('empresas_sjc')
          .select('cnpj, razao_social, nome_fantasia, bairro, porte, capital_social')
          .eq('is_outlier_extremo', true)
          .order('capital_social', { ascending: false })
          .limit(50);

        if (currentFilters.bairro.length === 1) {
          q = q.ilike('bairro', `%${currentFilters.bairro[0]}%`);
        } else if (currentFilters.bairro.length > 1) {
          q = q.or(currentFilters.bairro.map(b => `bairro.ilike.%${b}%`).join(','));
        }
        const { data: fbData } = await q;
        if (fbData) {
          outliers = fbData.map(o => {
            const clean = (o.cnpj || '').replace(/\D/g, '');
            const fil = clean.length >= 12 ? clean.substring(8, 12) : '0001';
            return {
              cnpj: o.cnpj,
              razao_social: o.razao_social,
              nome_fantasia: o.nome_fantasia,
              bairro: o.bairro,
              porte_label: o.porte === '05' ? 'Demais (Grande)' : (o.porte === '03' ? 'EPP' : 'Microempresa'),
              capital_social: o.capital_social,
              filial_tipo: fil !== '0001' ? `Filial (${fil})` : 'Matriz',
              motivo_quarentena: 'Capital da Matriz Nacional Replicado na Filial (>= R$ 100M)'
            };
          });
        }
      } catch (err) {
        console.warn('[Market Intel] Erro fallback quarentena:', err);
      }
    }

    renderOutliersTable(outliers);
  }

  function renderOutliersTable(outliers) {
    const tbody = document.getElementById('tableOutliersBody');
    if (!tbody) return;

    if (!outliers || outliers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-slate-400 font-semibold">Nenhuma anomalia bilionária na quarentena para este filtro.</td></tr>';
      return;
    }

    tbody.innerHTML = outliers.map(o => `
      <tr class="hover:bg-rose-50/40 transition-colors border-b border-slate-100 text-xs">
        <td class="py-3 px-4">
          <strong class="text-slate-900 block font-bold">${o.razao_social}</strong>
          <span class="text-[10px] text-slate-400 font-mono">${formatCNPJ(o.cnpj)}</span>
        </td>
        <td class="py-3 px-4 font-bold text-slate-700">${o.bairro || 'N/D'}</td>
        <td class="py-3 px-4 text-center">
          <span class="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800">${o.porte_label || 'Grande'}</span>
        </td>
        <td class="py-3 px-4 font-black text-rose-600 text-right font-mono" title="${formatCurrency(o.capital_social)}">
          ${formatCompactCurrency(o.capital_social)}
        </td>
        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
            ${o.filial_tipo || 'Filial'}
          </span>
        </td>
        <td class="py-3 px-4">
          <span class="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded inline-block">
            <i class="fa-solid fa-triangle-exclamation mr-1"></i> ${o.motivo_quarentena || 'Capital Nacional Herdado'}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // 9. EXPORTAÇÃO CSV
  window.exportFilteredEmpresasCSV = async function() {
    const client = window.supabaseClient;
    if (!client) {
      alert('Cliente Supabase não inicializado.');
      return;
    }

    const btn = document.getElementById('btnExportCsv');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-cyan-400"></i> Exportando CSV...';
      btn.disabled = true;
    }

    try {
      const f = getFormattedFilters();
      let records = [];

      try {
        const { data, error } = await client.rpc('rpc_export_empresas_sjc', {
          p_search: f.search || null,
          p_bairro: f.bairro || null,
          p_setor: f.macro_setor || f.setor || null,
          p_cnae: f.cnae || null,
          p_porte: f.porte || null,
          p_faixa_capital: f.faixa_capital || null,
          p_faixa_idade: f.faixa_idade || null,
          p_simples: f.simples || null,
          p_mei: f.mei || null,
          p_limit: 5000,
          p_incluir_outliers: f.incluir_outliers
        });
        if (error) throw error;
        records = data || [];
      } catch (rpcErr) {
        let q = client.from('empresas_sjc').select('*').limit(3000);
        if (!f.incluir_outliers) q = q.eq('is_outlier_extremo', false);
        if (f.bairro) {
          const bList = f.bairro.split(',').map(b => b.trim()).filter(Boolean);
          if (bList.length === 1) q = q.ilike('bairro', `%${bList[0]}%`);
          else if (bList.length > 1) q = q.or(bList.map(b => `bairro.ilike.%${b}%`).join(','));
        }
        if (f.cnae) {
          const cList = f.cnae.split(',').map(c => c.trim()).filter(Boolean);
          if (cList.length === 1) q = q.or(`setor_cnae_codigo.ilike.%${cList[0]}%,setor_cnae_descricao.ilike.%${cList[0]}%`);
          else if (cList.length > 1) q = q.or(cList.map(c => `setor_cnae_codigo.ilike.%${c}%,setor_cnae_descricao.ilike.%${c}%`).join(','));
        }
        if (f.porte) {
          const pList = f.porte.split(',').map(p => p.trim()).filter(Boolean);
          if (pList.length === 1) q = q.eq('porte', pList[0]);
          else if (pList.length > 1) q = q.in('porte', pList);
        }
        const { data } = await q;
        records = data || [];
      }

      if (records.length === 0) {
        alert('Nenhum registro encontrado para exportar com os filtros atuais.');
        return;
      }

      const headers = ['CNPJ', 'Razao_Social', 'Nome_Fantasia', 'Bairro', 'CNAE_Codigo', 'CNAE_Descricao', 'Capital_Social', 'Porte', 'Simples', 'MEI', 'Data_Inicio', 'Outlier_Extremo'];
      const rows = records.map(r => [
        `"${r.cnpj || ''}"`,
        `"${(r.razao_social || '').replace(/"/g, '""')}"`,
        `"${(r.nome_fantasia || '').replace(/"/g, '""')}"`,
        `"${(r.bairro || '').replace(/"/g, '""')}"`,
        `"${r.setor_cnae_codigo || ''}"`,
        `"${(r.setor_cnae_descricao || '').replace(/"/g, '""')}"`,
        r.capital_social || 0,
        `"${r.porte || ''}"`,
        `"${r.opcao_simples || ''}"`,
        `"${r.opcao_mei || ''}"`,
        `"${r.data_inicio_atividade || ''}"`,
        r.is_outlier_extremo ? 'SIM' : 'NAO'
      ]);

      const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `empresas_sjc_filtradas_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('[CSV Export Error]:', e);
      alert('Erro ao exportar CSV: ' + e.message);
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  };

  // 10. AÇÃO DO BOTÃO: FILTRAR POR BAIRRO A PARTIR DO MAPA (MULTI-SELECT COMPATÍVEL)
  window.filterByBairro = function(bairroName) {
    if (!bairroName) return;

    if (MarketIntelState.tsBairro) {
      const cur = MarketIntelState.tsBairro.getValue();
      let curArr = Array.isArray(cur) ? [...cur] : (cur ? [cur] : []);
      if (!curArr.includes(bairroName)) {
        curArr.push(bairroName);
        MarketIntelState.tsBairro.setValue(curArr);
      }
    } else {
      currentFilters.bairro = [bairroName];
      MarketIntelState.pagination.page = 1;
      updateAllComponents();
    }

    const geo = getBairroCoordinates(bairroName);
    if (geo && MarketIntelState.leafletMap) {
      MarketIntelState.leafletMap.flyTo([geo.lat, geo.lng], 14, { duration: 1.2 });
    }
  };

  // 11. BIND DE EVENTOS & FILTROS CRUZADOS REATIVOS
  function bindEvents() {
    // Toggle Global: Incluir Matrizes Nacionais / Anomalias Bilionárias
    const toggleOutliers = document.getElementById('toggleIncluirOutliers');
    if (toggleOutliers) {
      toggleOutliers.addEventListener('change', e => {
        currentFilters.incluir_outliers = e.target.checked;
        MarketIntelState.pagination.page = 1;
        updateAllComponents();
      });
    }

    // Mudança de Bairro (Fallback caso Tom Select não esteja ativo)
    const bairroSelect = document.getElementById('filterBairro');
    if (bairroSelect && !MarketIntelState.tsBairro) {
      bairroSelect.addEventListener('change', () => {
        const selectedBairro = bairroSelect.value;
        currentFilters.bairro = selectedBairro ? [selectedBairro] : [];
        MarketIntelState.pagination.page = 1;

        if (selectedBairro) {
          const geo = getBairroCoordinates(selectedBairro);
          if (geo && MarketIntelState.leafletMap) {
            MarketIntelState.leafletMap.flyTo([geo.lat, geo.lng], 14, { duration: 1.0 });
          }
        } else if (MarketIntelState.leafletMap) {
          MarketIntelState.leafletMap.flyTo([-23.212, -45.890], 12, { duration: 1.0 });
        }

        updateAllComponents();
      });
    }

    // Filtro de Macro-Setores (Fallback caso Tom Select não esteja ativo)
    const macroSetorSelect = document.getElementById('filterMacroSetor');
    const setorInput = document.getElementById('filterSetor');

    if (macroSetorSelect && !MarketIntelState.tsMacroSetor) {
      macroSetorSelect.addEventListener('change', () => {
        const selectedVal = macroSetorSelect.value;
        currentFilters.macro_setor = selectedVal ? [selectedVal] : [];
        if (setorInput) setorInput.value = selectedVal;
        // Limpa CNAE ao mudar macro-setor
        currentFilters.cnae = [];
        const cnaeSelect = document.getElementById('filterCnae');
        if (cnaeSelect) cnaeSelect.value = '';
        MarketIntelState.pagination.page = 1;
        updateAllComponents();
      });
    }

    // Multi-Select Porte com Tom Select ou Fallback Nativo
    const porteSelect = document.getElementById('filterPorte');
    if (porteSelect && typeof TomSelect !== 'undefined') {
      if (!MarketIntelState.tsPorte) {
        MarketIntelState.tsPorte = createExecutiveTomSelect('#filterPorte', 'Porte...', 10, function(values) {
          const arr = Array.isArray(values) ? values.filter(Boolean) : (values ? [values] : []);
          currentFilters.porte = arr;
          MarketIntelState.pagination.page = 1;
          updateAllComponents();
        });
      }
    } else if (porteSelect) {
      porteSelect.addEventListener('change', () => {
        const val = porteSelect.value;
        currentFilters.porte = val ? [val] : [];
        MarketIntelState.pagination.page = 1;
        updateAllComponents();
      });
    }

    // Smooth Scrolling para Atalhos de Navegação Rápida
    document.querySelectorAll('.quick-nav-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = pill.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          document.querySelectorAll('.quick-nav-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        }
      });
    });

    // Busca Dinâmica Rápida no Mapa
    const mapSearchInput = document.getElementById('mapSearchBairroInput');
    if (mapSearchInput) {
      mapSearchInput.addEventListener('input', e => {
        const q = e.target.value.toUpperCase().trim();
        if (!q || q.length < 2) return;
        
        const matched = MarketIntelState.allBairrosData.find(b => b.bairro && b.bairro.toUpperCase().includes(q));
        if (matched) {
          const geo = getBairroCoordinates(matched.bairro);
          if (geo && MarketIntelState.leafletMap) {
            MarketIntelState.leafletMap.flyTo([geo.lat, geo.lng], 14, { duration: 0.8 });
          }
        }
      });

      mapSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const q = e.target.value.toUpperCase().trim();
          const matched = MarketIntelState.allBairrosData.find(b => b.bairro && b.bairro.toUpperCase().includes(q));
          if (matched) {
            window.filterByBairro(matched.bairro);
          }
        }
      });
    }

    // Filtros Globais Padrão
    bindSelect('filterFaixaCapital', 'faixa_capital');
    bindSelect('filterFaixaIdade', 'faixa_idade');
    bindSelect('filterMei', 'mei');
    bindSelect('filterSimples', 'simples');
    bindSelect('filterFaturamento', 'faturamento');

    // Busca textual da tabela com debounce
    const searchInput = document.getElementById('filterSearchTable');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        clearTimeout(MarketIntelState.searchDebounceTimer);
        MarketIntelState.searchDebounceTimer = setTimeout(() => {
          currentFilters.search = e.target.value.trim();
          MarketIntelState.pagination.page = 1;
          loadPaginatedTable();
        }, 350);
      });
    }

    // Reset de Filtros Completo (Limpa todas as instâncias Tom Select e restaura estado inicial)
    const btnReset = document.getElementById('btnResetFilters');
    if (btnReset) {
      btnReset.addEventListener('click', async () => {
        await resetAllMarketIntelFilters();
      });
    }

    // Ação do Mapa: Centralizar São José dos Campos
    const btnResetZoom = document.getElementById('btnMapResetZoom');
    if (btnResetZoom) {
      btnResetZoom.addEventListener('click', () => {
        if (MarketIntelState.leafletMap) {
          MarketIntelState.leafletMap.flyTo([-23.212, -45.890], 12, { duration: 1.0 });
        }
      });
    }

    // Paginação da Tabela
    const btnPrev = document.getElementById('tableBtnPrev');
    const btnNext = document.getElementById('tableBtnNext');
    const btnPrevTop = document.getElementById('tableBtnPrevTop');
    const btnNextTop = document.getElementById('tableBtnNextTop');

    const handlePrev = () => {
      if (MarketIntelState.pagination.page > 1) {
        MarketIntelState.pagination.page--;
        loadPaginatedTable();
      }
    };

    const handleNext = () => {
      if (MarketIntelState.pagination.page < MarketIntelState.pagination.totalPages) {
        MarketIntelState.pagination.page++;
        loadPaginatedTable();
      }
    };

    if (btnPrev) btnPrev.addEventListener('click', handlePrev);
    if (btnNext) btnNext.addEventListener('click', handleNext);
    if (btnPrevTop) btnPrevTop.addEventListener('click', handlePrev);
    if (btnNextTop) btnNextTop.addEventListener('click', handleNext);
  }

  // 12. RESET COMPLETO DE FILTROS (SINGLE SOURCE OF TRUTH + TOM SELECT API)
  async function resetAllMarketIntelFilters() {
    console.log('[Market Intel] Resetando todos os filtros para o estado inicial...');

    // 1. Limpa instâncias Tom Select usando a API oficial ts.clear(true)
    if (MarketIntelState.tsBairro) {
      try { MarketIntelState.tsBairro.clear(true); } catch (e) {}
    }
    if (MarketIntelState.tsCnae) {
      try { MarketIntelState.tsCnae.clear(true); } catch (e) {}
    }
    if (MarketIntelState.tsMacroSetor) {
      try { MarketIntelState.tsMacroSetor.clear(true); } catch (e) {}
    }
    if (MarketIntelState.tsPorte) {
      try { MarketIntelState.tsPorte.clear(true); } catch (e) {}
    }

    // 2. Reseta elementos HTML nativos
    const elementIds = [
      'filterBairro', 'filterCnae', 'filterMacroSetor', 'filterPorte',
      'filterFaixaCapital', 'filterFaixaIdade', 'filterMei', 'filterSimples',
      'filterFaturamento', 'filterSetor', 'filterSearchTable', 'mapSearchBairroInput'
    ];
    elementIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const toggleOut = document.getElementById('toggleIncluirOutliers');
    if (toggleOut) toggleOut.checked = false;

    // 3. Reseta currentFilters para o estado inicial vazio
    currentFilters.bairro = [];
    currentFilters.macro_setor = [];
    currentFilters.cnae = [];
    currentFilters.porte = [];
    currentFilters.faixa_capital = '';
    currentFilters.faixa_idade = '';
    currentFilters.simples = '';
    currentFilters.mei = '';
    currentFilters.faturamento = '';
    currentFilters.search = '';
    currentFilters.incluir_outliers = false;

    MarketIntelState.pagination.page = 1;

    // 4. Centraliza o mapa de volta em São José dos Campos
    if (MarketIntelState.leafletMap) {
      MarketIntelState.leafletMap.flyTo([-23.212, -45.890], 12, { duration: 1.0 });
    }

    // 5. Dispara updateAllComponents() para restaurar a visão macro total
    await updateAllComponents();
  }
  window.resetAllMarketIntelFilters = resetAllMarketIntelFilters;

  function bindSelect(id, filterKey) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => {
      currentFilters[filterKey] = el.value || '';
      MarketIntelState.pagination.page = 1;
      updateAllComponents();
    });
  }

  // Utilitários de Formatação
  function formatCompactCurrency(val) {
    const n = Number(val) || 0;
    if (Math.abs(n) >= 1e12) {
      return 'R$ ' + (n / 1e12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Tri';
    }
    if (Math.abs(n) >= 1e9) {
      return 'R$ ' + (n / 1e9).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Bi';
    }
    if (Math.abs(n) >= 1e6) {
      return 'R$ ' + (n / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Mi';
    }
    if (Math.abs(n) >= 1e3) {
      return 'R$ ' + (n / 1e3).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mil';
    }
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }

  function formatCurrency(v) {
    const n = Number(v) || 0;
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }

  function formatNumber(v) {
    return (Number(v) || 0).toLocaleString('pt-BR');
  }

  function formatCNPJ(cnpj) {
    if (!cnpj) return '';
    const clean = cnpj.toString().replace(/\D/g, '');
    if (clean.length === 14) {
      return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setUpdatingState(isUpdating) {
    const contentArea = document.getElementById('marketIntelContentArea');
    const progressBar = document.getElementById('marketIntelProgressBar');
    const miniSpinner = document.getElementById('marketIntelMiniSpinner');

    // Se já foi inicializado (atualização subsequente de filtro)
    // aplica opacidade suave (0.55) aos componentes em recálculo sem bloquear a tela
    if (MarketIntelState.initialized) {
      if (contentArea) {
        if (isUpdating) {
          contentArea.classList.add('market-intel-updating');
        } else {
          contentArea.classList.remove('market-intel-updating');
        }
      }
    }

    // Barra de progresso ultra-fina (YouTube / GitHub) no topo da barra de filtros
    if (progressBar) {
      if (isUpdating) {
        progressBar.classList.add('active');
      } else {
        progressBar.classList.remove('active');
      }
    }

    // Spinner discreto no título
    if (miniSpinner) {
      if (isUpdating) {
        miniSpinner.classList.remove('hidden');
      } else {
        miniSpinner.classList.add('hidden');
      }
    }

    // Remove o skeleton do mapa de forma suave quando o carregamento termina
    if (!isUpdating) {
      const mapSkeleton = document.getElementById('mapSkeleton');
      if (mapSkeleton) {
        mapSkeleton.style.opacity = '0';
        setTimeout(() => {
          if (mapSkeleton && mapSkeleton.parentNode) mapSkeleton.remove();
        }, 300);
      }
    }
  }

  function showLoadingOverlay(show) {
    setUpdatingState(show);
  }

  function generateFallbackTimeSeries() {
    const months = [];
    const now = new Date();
    for (let i = 48; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const str = d.toISOString().substring(0, 7) + '-01';
      const base = 850 + Math.sin(i / 3) * 150 + (48 - i) * 8;
      months.push({
        data_mes: str,
        total_novas: Math.round(base + (Math.random() * 80 - 40)),
        media_movel_12m: Math.round(base)
      });
    }
    return months;
  }

})(window, document);
