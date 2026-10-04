/**
 * Base de Dados Estruturada — Radar SJC Memória Viva
 * Plataforma Historiográfica & Atlas Verificável de São José dos Campos (SP)
 * Recorte: Primeiras Ocupações até 2026.
 * Marco Institucional Oficial: 27 de julho de 1767 (Elevação a Vila) — 259 anos em 2026.
 */

window.HISTORIA_SJC_DATA = {
  metadados: {
    titulo: "Radar SJC Memória Viva",
    marcoInstitucionalAno: 1767,
    marcoInstitucionalData: "1767-07-27",
    anoBase: 2026,
    idadeInstitucional: 259,
    versao: "3.0.0",
    dataAtualizacao: "2026-09-16"
  },

  eras: [
    {
      id: "colonial",
      nome: "Era Colonial & Aldeamento",
      periodo: "1564 – 1863",
      minAno: 1500,
      maxAno: 1863,
      icone: "fa-landmark-dome",
      cor: "amber",
      bgGradient: "from-amber-900/90 to-amber-950",
      bordaCor: "border-amber-600/40",
      resumo: "Das origens indígenas dos Guaianazes no Rio Comprido à ereção da Vila em 1767."
    },
    {
      id: "sanatorial",
      nome: "Era Sanatorial & Expansão",
      periodo: "1864 – 1945",
      minAno: 1864,
      maxAno: 1945,
      icone: "fa-hospital",
      cor: "rose",
      bgGradient: "from-rose-950 to-slate-950",
      bordaCor: "border-rose-600/40",
      resumo: "Elevação a cidade, ferrovia, Tecelagem Parahyba e a referência médica contra a tuberculose."
    },
    {
      id: "tecnologica",
      nome: "Era Aeroespacial & Tecnológica",
      periodo: "1946 – 2000",
      minAno: 1946,
      maxAno: 2000,
      icone: "fa-rocket",
      cor: "cyan",
      bgGradient: "from-cyan-950 to-slate-950",
      bordaCor: "border-cyan-600/40",
      resumo: "Criação do CTA, campus do ITA por Niemeyer, Dutra, Embraer, INPE e satélite SCD-1."
    },
    {
      id: "contemporanea",
      nome: "Era Cidade Inteligente & Futuro",
      periodo: "2001 – 2026",
      minAno: 2001,
      maxAno: 2026,
      icone: "fa-network-wired",
      cor: "teal",
      bgGradient: "from-teal-950 to-slate-950",
      bordaCor: "border-teal-600/40",
      resumo: "Parque Tecnológico, preservação do Banhado, 1ª Cidade Inteligente ABNT/ISO e FLACMA."
    }
  ],

  epocas: [
    { id: "all", nome: "Todas as Épocas (Século XVI – 2026)" },
    { id: "colonial", nome: "Período Indígena, Colonial & Elevação a Vila (até 1863)", minAno: 1500, maxAno: 1863 },
    { id: "sanatorial", nome: "Elevação a Cidade & Fase Sanatorial (1864 – 1945)", minAno: 1864, maxAno: 1945 },
    { id: "tecnologica", nome: "Era Tecnológica & Polo Aeroespacial (1946 – 2000)", minAno: 1946, maxAno: 2000 },
    { id: "contemporanea", nome: "Século XXI & Cidade Inteligente (2001 – 2026)", minAno: 2001, maxAno: 2026 }
  ],

  eixos: [
    { id: "all", nome: "Todos os Eixos Temáticos", icon: "fa-cubes" },
    { id: "fundacao", nome: "Fundação, Política & Cidadania", icon: "fa-landmark" },
    { id: "saude", nome: "Saúde, Medicina & Sanatórios", icon: "fa-notes-medical" },
    { id: "ciencia", nome: "Educação, Ciência & Polo Aeroespacial", icon: "fa-plane-departure" },
    { id: "cultura", nome: "Cultura, Patrimônio & Memória Social", icon: "fa-masks-theater" },
    { id: "ambiente", nome: "Meio Ambiente, Território & Planejamento Urbano", icon: "fa-leaf" },
    { id: "trabalho", nome: "Trabalho, Indústria & Ferrovia", icon: "fa-industry" }
  ],

  evidencias: [
    { 
      id: "all", 
      nome: "Todos os Níveis de Evidência",
      descricao: "Exibe todos os registros independentemente do nível de validação."
    },
    { 
      id: "documentado", 
      nome: "Documentado (Fonte Primária / Oficial)", 
      cor: "emerald",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
      icon: "fa-circle-check",
      descricao: "Fato com ato normativo, lei, decreto ou documento primário de arquivo público devidamente identificado."
    },
    { 
      id: "corroborado", 
      nome: "Corroborado (Fontes Institucionais / Secundárias)", 
      cor: "blue",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-300",
      icon: "fa-circle-dot",
      descricao: "Fato com duas ou mais fontes secundárias concordantes ou publicação de instituição de memória de referência."
    },
    { 
      id: "em_investigacao", 
      nome: "Em Investigação (Em Qualificação)", 
      cor: "amber",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
      icon: "fa-magnifying-glass",
      descricao: "Fato relevante na tradição ou literatura, com fontes primárias ainda em processo de localização ou qualificação."
    },
    { 
      id: "em_disputa", 
      nome: "Em Disputa (Conflito de Versões)", 
      cor: "rose",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-300",
      icon: "fa-scale-unbalanced",
      descricao: "Fontes confiáveis apresentam divergências de datas, autoria ou marcos, preservadas transparentemente."
    }
  ],

  marcosAnosDestaque: [1767, 1864, 1871, 1877, 1924, 1935, 1950, 1969, 1993, 2006, 2022, 2026],

  eventos: [
    {
      id: "ev-1564",
      ano: 1564,
      eraId: "colonial",
      dataExata: "Final do século XVI (cerca de 1564)",
      precisao: "aproximada",
      evidencia: "em_disputa",
      eixo: "fundacao",
      titulo: "Primeiro Aldeamento Indígena do Rio Comprido",
      citacao: "«Terras habitadas por Guaianazes e fazenda jesuítica de gado ao sul do município.»",
      resumo: "Primeiro núcleo populacional associado ao território municipal, reunindo indígenas Guaianazes e atividade pecuária colonial sob coordenação jesuítica às margens do Rio Comprido.",
      detalhes: "A historiografia tradicional por vezes cita 1564, mas não há ato primário de fundação localizado. A Prefeitura adota 'final do século XVI' e a Câmara/Pró-Memória situa a formação inicial entre 1600 e 1650. Não deve ser tratado como data oficial de aniversário da cidade.",
      local: "Margens do Rio Comprido / Região Sul de SJC",
      lat: -23.2380,
      lng: -45.8920,
      ontemHoje: {
        ontem: "Aldeamento de palha e pastagens de gado jesuítico às margens do rio.",
        hoje: "Bairros urbanizados da Zona Sul e rodovias de integração regional."
      },
      instituicoesEnvolvidas: ["Companhia de Jesus (Jesuítas)", "Aldeamentos Coloniais"],
      pessoasEnvolvidas: ["Indígenas Guaianazes", "Padres Jesuítas"],
      fontes: [
        { nome: "Prefeitura de SJC — São José em Dados (História)", tipo: "Institucional", url: "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/" },
        { nome: "Câmara Municipal de SJC — Pró-Memória", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" },
        { nome: "IBGE — Histórico Municipal de São José dos Campos", tipo: "Oficial Federal", url: "https://biblioteca.ibge.gov.br/biblioteca-catalogo.html?id=33048&view=detalhes" }
      ],
      destaque: true
    },
    {
      id: "ev-1611",
      ano: 1611,
      eraId: "colonial",
      dataExata: "1611-09-10",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "fundacao",
      titulo: "Regulamentação Real dos Aldeamentos Indígenas",
      citacao: "«Lei régia disciplinando a administração e a liberdade tutelar dos povos originários no Brasil.»",
      resumo: "Promulgação de lei régia portuguesa regulamentando a administração dos aldeamentos indígenas no Brasil Colonial, impactando a relação de tutela e a dispersão territorial dos povos originários no Vale do Paraíba.",
      detalhes: "A aplicação da legislação causou tensões locais entre colonos e religiosos, levando à expulsão temporária dos jesuítas e à reorganização das terras comunais indígenas.",
      local: "Território da Capitania de São Paulo / Vale do Paraíba",
      lat: -23.1850,
      lng: -45.8900,
      ontemHoje: {
        ontem: "Aldeamento rústico com terras coletivas de cultivo.",
        hoje: "Área central e bacia de preservação do Rio Paraíba do Sul."
      },
      instituicoesEnvolvidas: ["Coroa Portuguesa", "Missões Jesuíticas"],
      pessoasEnvolvidas: ["Indígenas Aldeados", "Administradores Coloniais"],
      fontes: [
        { nome: "Pró-Memória / Acervo Histórico da Câmara de SJC", tipo: "Arquivo Histórico", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" },
        { nome: "Histórico e Formação Administrativa — IBGE", tipo: "Oficial Federal", url: "https://biblioteca.ibge.gov.br/biblioteca-catalogo.html?id=33048&view=detalhes" }
      ],
      destaque: false
    },
    {
      id: "ev-1650",
      ano: 1650,
      eraId: "colonial",
      dataExata: "1650",
      precisao: "ano",
      evidencia: "corroborado",
      eixo: "fundacao",
      titulo: "Concessão da Sesmaria Colonial e Primeira Capela",
      citacao: "«Atribuição jurídica de sesmaria registrando as primeiras capelas e fazendas do planalto.»",
      resumo: "Concessão de sesmaria a Ângelo Siqueira Afonso, Antônia Pedrosa de Moraes e Francisco João Leme, com estabelecimento de fazenda de gado e capela religiosa no território.",
      detalhes: "Constitui uma das primeiras titulações jurídicas de sesmaria cartorialmente referenciadas no território do atual município.",
      local: "Área Rural Colonial do Vale do Paraíba",
      lat: -23.1920,
      lng: -45.9000,
      ontemHoje: {
        ontem: "Fazenda de sesmaria com pequena ermida católica.",
        hoje: "Expansão residencial e comercial do quadrante central."
      },
      instituicoesEnvolvidas: ["Capitania de São Paulo", "Igreja Católica Colonial"],
      pessoasEnvolvidas: ["Ângelo Siqueira Afonso", "Antônia Pedrosa de Moraes", "Francisco João Leme"],
      fontes: [
        { nome: "Câmara Municipal de São José dos Campos — Pró-Memória", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" }
      ],
      destaque: false
    },
    {
      id: "ev-1680",
      ano: 1680,
      eraId: "colonial",
      dataExata: "Final do século XVII (cerca de 1680)",
      precisao: "aproximada",
      evidencia: "corroborado",
      eixo: "fundacao",
      titulo: "Transferência do Núcleo Urbano para a Colina Central",
      citacao: "«O Irmão Manoel de Leão guia a população para o alto da colina debruçada sobre o Banhado.»",
      resumo: "Deslocamento gradual da antiga aldeia para a colina alta com vista para o Rio Paraíba do Sul e para o Banhado, local definitivo onde foi construída a Igreja Matriz e se desenvolveu o centro histórico.",
      detalhes: "A tradição e estudos do Pró-Memória associam a liderança do jesuíta Irmão Manoel de Leão a essa transferência estratégica de sítio urbano em busca de melhor salubridade e proteção contra cheias fluviais.",
      local: "Colina Central (Praça Padre João / Matriz)",
      lat: -23.1818,
      lng: -45.8864,
      ontemHoje: {
        ontem: "Colina estratégica de terra batida com vista para a várzea do Paraíba.",
        hoje: "Praça Padre João Guimarães e Igreja Matriz de São José dos Campos."
      },
      instituicoesEnvolvidas: ["Companhia de Jesus", "Aldeamento de São José"],
      pessoasEnvolvidas: ["Irmão Manoel de Leão", "Famílias Indígenas e Mestiças"],
      fontes: [
        { nome: "Histórico Oficial de SJC — Prefeitura de São José dos Campos", tipo: "Institucional", url: "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/" },
        { nome: "Pró-Memória da Câmara Municipal de SJC", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" }
      ],
      destaque: true
    },
    {
      id: "ev-1692",
      ano: 1692,
      eraId: "colonial",
      dataExata: "1692 – 1696",
      precisao: "intervalo",
      evidencia: "corroborado",
      eixo: "fundacao",
      titulo: "Consolidação da Denominação 'Residência de São José'",
      citacao: "«A paróquia e o arraial passam a ser identificados sob o padroado de São José.»",
      resumo: "O povoamento passa a ser designado nos relatórios eclesiásticos e administrativos como 'Residência de São José' (anteriormente chamada 'Residência do Paraíba do Sul').",
      detalhes: "Fixa o patrono São José na toponímia da localidade, antecedendo em quase um século sua ereção a município autônomo.",
      local: "Núcleo Urbano Central",
      lat: -23.1825,
      lng: -45.8870,
      ontemHoje: {
        ontem: "Arraial com capela dedicada ao patriarca São José.",
        hoje: "Centro histórico de serviços e patrimônio preservado."
      },
      instituicoesEnvolvidas: ["Bispado e Província Jesuítica"],
      pessoasEnvolvidas: ["Clero Local", "Moradores da Residência"],
      fontes: [
        { nome: "Pró-Memória / Acervo Paroquial da Matriz", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" }
      ],
      destaque: false
    },
    {
      id: "ev-1767",
      ano: 1767,
      eraId: "colonial",
      dataExata: "1767-07-27",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "fundacao",
      titulo: "Ereção da Vila de São José do Paraíba (Marco Oficial de Emancipação)",
      citacao: "«Lavrou-se o Auto de Ereção com pelourinho, vereadores e juízes ordinários no dia 27 de julho.»",
      resumo: "Por ordem do governador D. Luís Antônio de Sousa Botelho Mourão (Morgado de Mateus), o ouvidor-geral Dr. Salvador Pereira da Silva lavrou o Auto de Ereção da Vila de São José do Paraíba, com instalação do pelourinho e da primeira Câmara Municipal.",
      detalhes: "Este é o marco institucional oficial e legal de aniversário do município. Em 27 de julho de 2026, São José dos Campos comemora 259 anos de fundação institucional como vila político-administrativa autônoma (e 260 anos em 2027).",
      local: "Largo da Matriz / Centro Histórico",
      lat: -23.1815,
      lng: -45.8860,
      ontemHoje: {
        ontem: "Pelourinho de madeira erguido em praça pública simbolizando a autoridade da nova Vila.",
        hoje: "Coração cívico e histórico do município de São José dos Campos."
      },
      instituicoesEnvolvidas: ["Governo da Capitania de São Paulo", "Câmara Municipal de São José do Paraíba"],
      pessoasEnvolvidas: ["Salvador Pereira da Silva (Ouvidor)", "Morgado de Mateus (Governador)", "Primeiros Vereadores e Juízes Ordinários"],
      fontes: [
        { nome: "Auto de Ereção da Vila (27/07/1767) — Arquivo do Estado / Pró-Memória", tipo: "Documento Primário Oficial", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" },
        { nome: "Histórico Municipal de São José dos Campos — IBGE", tipo: "Oficial Federal", url: "https://biblioteca.ibge.gov.br/biblioteca-catalogo.html?id=33048&view=detalhes" },
        { nome: "Prefeitura de São José dos Campos — História da Cidade", tipo: "Institucional", url: "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/" }
      ],
      destaque: true
    },
    {
      id: "ev-1828",
      ano: 1828,
      eraId: "colonial",
      dataExata: "1828",
      precisao: "ano",
      evidencia: "corroborado",
      eixo: "ciencia",
      titulo: "Criação da Primeira Escola Pública de Primeiras Letras",
      citacao: "«Início da instrução pública oficial custeada pela Província no centro da Vila.»",
      resumo: "Instalação da primeira aula pública oficial de primeiras letras para o sexo masculino, inaugurando o sistema de instrução pública mantido pela Província e Município.",
      detalhes: "Documentado nas atas legislativas provinciais e nos livros de despesas públicas da Câmara Municipal.",
      local: "Área Central da Vila",
      lat: -23.1830,
      lng: -45.8850,
      ontemHoje: {
        ontem: "Sala de aula em casa colonial de taipa com primeiras carteiras de madeira.",
        hoje: "Rede escolar pública municipal e estadual com centenas de unidades de ensino."
      },
      instituicoesEnvolvidas: ["Governo da Província de São Paulo", "Câmara Municipal"],
      pessoasEnvolvidas: ["Primeiros Mestres-Escolares"],
      fontes: [
        { nome: "Acervo Histórico Escolar / Pró-Memória da Câmara", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" }
      ],
      destaque: false
    },
    {
      id: "ev-1864",
      ano: 1864,
      eraId: "sanatorial",
      dataExata: "1864-04-22",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "fundacao",
      titulo: "Elevação da Vila à Categoria de Cidade (Lei Provincial nº 27)",
      citacao: "«A Lei Provincial nº 27 concede a São José o predicamento de Cidade.»",
      resumo: "A Lei Provincial Paulista nº 27 elevou a então Vila de São José do Paraíba à categoria político-administrativa de Cidade, reconhecendo seu crescimento demográfico, comercial e agrícola.",
      detalhes: "A economia municipal era impulsionada pela cultura do café e pelas lavouras de algodão no Vale do Paraíba, destacando-se regionalmente na Assembleia Provincial.",
      local: "Paço Municipal e Largo da Matriz",
      lat: -23.1819,
      lng: -45.8865,
      ontemHoje: {
        ontem: "Sede de Vila com ruas de paralelepípedo incipiente e comércio cafeeiro.",
        hoje: "Metrópole polo do Vale do Paraíba com mais de 730 mil habitantes."
      },
      instituicoesEnvolvidas: ["Assembleia Legislativa da Província de São Paulo (ALESP)", "Câmara Municipal"],
      pessoasEnvolvidas: ["Deputados Provinciais", "Lideranças Cívicas Locais"],
      fontes: [
        { nome: "Lei Provincial nº 27 de 22/04/1864 — Acervo da ALESP", tipo: "Lei / Ato Normativo Primário", url: "https://www.al.sp.gov.br/norma/126938" },
        { nome: "IBGE — Histórico e Formação Administrativa de SJC", tipo: "Oficial Federal", url: "https://biblioteca.ibge.gov.br/biblioteca-catalogo.html?id=33048&view=detalhes" }
      ],
      destaque: true
    },
    {
      id: "ev-1871",
      ano: 1871,
      eraId: "sanatorial",
      dataExata: "1871",
      precisao: "ano",
      evidencia: "documentado",
      eixo: "fundacao",
      titulo: "Adoção Oficial do Nome 'São José dos Campos' (Lei nº 47)",
      citacao: "«Fixação definitiva da denominação que consagra o planalto dos campos joseenses.»",
      resumo: "A Lei Provincial nº 47 de 1871 estabeleceu em caráter definitivo a denominação oficial do município como 'São José dos Campos'. Em 1872, o primeiro Censo Geral do Império recenseou 12.998 habitantes no município.",
      detalhes: "O nome consagra a geografia dos campos abertos e cerrados que caracterizavam a formação do planalto joseense.",
      local: "São José dos Campos",
      lat: -23.1820,
      lng: -45.8860,
      ontemHoje: {
        ontem: "Município do Império com 12.998 habitantes (1.245 pessoas escravizadas).",
        hoje: "Cidade cosmopolita e um dos maiores PIBs industriais do Brasil."
      },
      instituicoesEnvolvidas: ["Assembleia Provincial de São Paulo", "Diretoria Geral de Estatística do Império"],
      pessoasEnvolvidas: ["População Joseense do Século XIX"],
      fontes: [
        { nome: "Lei Provincial nº 47/1871 — Acervo Histórico ALESP", tipo: "Ato Normativo Primário", url: "https://www.al.sp.gov.br/" },
        { nome: "Recenseamento do Império do Brasil de 1872 — IBGE", tipo: "Censo Demográfico Oficial", url: "https://biblioteca.ibge.gov.br/" }
      ],
      destaque: true
    },
    {
      id: "ev-1877",
      ano: 1877,
      eraId: "sanatorial",
      dataExata: "1877",
      precisao: "ano",
      evidencia: "documentado",
      eixo: "trabalho",
      titulo: "Chegada dos Trilhos da Estrada de Ferro Central do Brasil",
      citacao: "«O apito da locomotiva a vapor conecta São José às capitais do Rio de Janeiro e São Paulo.»",
      resumo: "Inauguração da Estação Ferroviária e chegada dos trilhos da Estrada de Ferro Central do Brasil (ramal de São Paulo), integrando a cidade aos eixos logísticos e comerciais da capital paulista e do Rio de Janeiro.",
      detalhes: "A ferrovia transformou o transporte de mercadorias (café e produtos rurais) e de passageiros, acelerando o intercâmbio regional e o desenvolvimento urbano ao redor da estação.",
      local: "Estação Ferroviária Central / Av. Sebastião Gualberto",
      lat: -23.1762,
      lng: -45.8820,
      ontemHoje: {
        ontem: "Pátio ferroviário com vagões de café, correio imperial e passageiros.",
        hoje: "Complexo viário e patrimônio histórico tombado do transporte ferroviário."
      },
      instituicoesEnvolvidas: ["Estrada de Ferro Central do Brasil / Governo Imperial"],
      pessoasEnvolvidas: ["Engenheiros Ferroviários", "Trabalhadores da Estrada de Ferro"],
      fontes: [
        { nome: "Acervo de Estações Ferroviárias do Brasil / Pró-Memória", tipo: "Arquivo Histórico", url: "https://www.camarasjc.sp.gov.br/promemoria/" }
      ],
      destaque: true
    },
    {
      id: "ev-1910",
      ano: 1910,
      eraId: "sanatorial",
      dataExata: "1910",
      precisao: "ano",
      evidencia: "corroborado",
      eixo: "ciencia",
      titulo: "Inauguração do Grupo Escolar Olímpio Catão",
      citacao: "«Monumento arquitetônico da instrução pública da Primeira República na Praça Afonso Pena.»",
      resumo: "Construção do emblemático Grupo Escolar Olímpio Catão na região central, projetado no padrão arquitetônico escolar paulista da Primeira República.",
      detalhes: "Marco formador de várias gerações de cidadãos e tombado pelo patrimônio histórico cultural pelo Conselho Municipal de Preservação do Patrimônio Histórico (COMPHAC).",
      local: "Praça Afonso Pena / Centro",
      lat: -23.1856,
      lng: -45.8858,
      ontemHoje: {
        ontem: "Imponente edifício escolar com fachada neoclássica e sino de aulas.",
        hoje: "Prédio histórico tombado pelo patrimônio cultural no coração comercial."
      },
      instituicoesEnvolvidas: ["Secretaria da Instrução Pública do Estado de SP", "Prefeitura de SJC"],
      pessoasEnvolvidas: ["Professores Pioneiros", "Olímpio Catão (Homenageado)"],
      fontes: [
        { nome: "COMPHAC / Fundação Cultural Cassiano Ricardo (FCCR)", tipo: "Patrimônio Histórico", url: "https://fccr.sp.gov.br/" },
        { nome: "Pró-Memória da Câmara Municipal", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" }
      ],
      destaque: false
    },
    {
      id: "ev-1923",
      ano: 1923,
      eraId: "sanatorial",
      dataExata: "1923",
      precisao: "ano",
      evidencia: "corroborado",
      eixo: "cultura",
      titulo: "Inauguração do Mercado Municipal de São José dos Campos",
      citacao: "«O Mercadão surge como ponto de encontro dos tropeiros, caipiras e feirantes do Vale.»",
      resumo: "Abertura do Mercado Municipal ('Mercadão') no coração da cidade, consolidando-se como epicentro do comércio hortifrutigranjeiro, especiarias e produtos tradicionais do Vale e da Serra da Mantiqueira.",
      detalhes: "Ponto de encontro da cultura caipira e da sociabilidade urbana que segue em pleno funcionamento há mais de um século.",
      local: "Rua Siqueira Campos / Centro Histórico",
      lat: -23.1835,
      lng: -45.8845,
      ontemHoje: {
        ontem: "Bancas de madeira com verduras frescas trazidas no lombo de mulas e trens.",
        hoje: "Mercado Municipal centenário vibrante com culinária típica e artesanato."
      },
      instituicoesEnvolvidas: ["Prefeitura Municipal de SJC", "Comerciantes e Produtores Rurais"],
      pessoasEnvolvidas: ["Feirantes, Tropeiros e Famílias Tradicionais"],
      fontes: [
        { nome: "Prefeitura de São José dos Campos — Patrimônio e Memória", tipo: "Institucional", url: "https://www.sjc.sp.gov.br/" },
        { nome: "Fundação Cultural Cassiano Ricardo", tipo: "Cultural", url: "https://fccr.sp.gov.br/" }
      ],
      destaque: false
    },
    {
      id: "ev-1924",
      ano: 1924,
      eraId: "sanatorial",
      dataExata: "1924-04-27",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "saude",
      titulo: "Inauguração do Sanatório Vicentina Aranha (Início da Fase Sanatorial)",
      citacao: "«O maior complexo hospitalar para tratamento da tuberculose da América Latina abre suas portas.»",
      resumo: "Inauguração solene do Sanatório Vicentina Aranha pela Santa Casa de Misericórdia de São Paulo, tornando-se o maior centro de tratamento antituberculoso da América Latina e consolidando a vocação da cidade como polo de saúde.",
      detalhes: "A excelência de seu clima e topografia atraiu médicos ilustres, pesquisadores e milhares de pacientes do país inteiro, reconfigurando a arquitetura, o saneamento e a demografia de São José dos Campos.",
      local: "Bairro Vila Adyana / Parque Vicentina Aranha",
      lat: -23.1970,
      lng: -45.8950,
      ontemHoje: {
        ontem: "Complexo sanatorial fechado de repouso e cura em meio a bosques de eucaliptos.",
        hoje: "Parque Vicentina Aranha: patrimônio tombado, polo de cultura, arte e lazer verde."
      },
      instituicoesEnvolvidas: ["Santa Casa de Misericórdia de São Paulo", "Governo do Estado de São Paulo", "FCCR"],
      pessoasEnvolvidas: ["Dona Vicentina de Queiroz Aranha (Patrona)", "Dr. Affonso Tarantino", "Dr. Nelson D'Ávila"],
      fontes: [
        { nome: "Parque Vicentina Aranha — Acervo Histórico & Tombamento", tipo: "Patrimônio Tombado (CONDEPHAAT / COMPHAC)", url: "https://www.pqvicentinaaranha.org.br/" },
        { nome: "Prefeitura de SJC — Dossiê Fase Sanatorial", tipo: "Institucional", url: "https://www.sjc.sp.gov.br/" },
        { nome: "IBGE — Histórico Municipal de SJC", tipo: "Oficial Federal", url: "https://biblioteca.ibge.gov.br/biblioteca-catalogo.html?id=33048&view=detalhes" }
      ],
      destaque: true
    },
    {
      id: "ev-1925",
      ano: 1925,
      eraId: "sanatorial",
      dataExata: "1925 – 1926",
      precisao: "intervalo",
      evidencia: "corroborado",
      eixo: "trabalho",
      titulo: "Instalação da Companhia Tecelagem Parahyba",
      citacao: "«A icônica fábrica dos cobertores Parahyba molda a vida operária de Santana.»",
      resumo: "Início das operações da Companhia Tecelagem Parahyba no bairro de Santana, fundada pelo empresário Olivo Gomes. A fábrica tornou-se ícone nacional na produção de cobertores e moldou a vida comunitária operária da zona norte.",
      detalhes: "O complexo integrou fábrica, vilas operárias, escola e centro médico. Posteriormente, a residência da família Olivo Gomes e seus jardins foram projetados pelo renomado paisagista Roberto Burle Marx.",
      local: "Bairro de Santana / Zona Norte",
      lat: -23.1670,
      lng: -45.8940,
      ontemHoje: {
        ontem: "Fábrica têxtil com teares ruidosos e vilas de operários da tecelagem.",
        hoje: "Parque da Cidade Roberto Burle Marx e sede da Fundação Cultural Cassiano Ricardo."
      },
      instituicoesEnvolvidas: ["Companhia Tecelagem Parahyba", "Sindicato dos Têxteis"],
      pessoasEnvolvidas: ["Olivo Gomes (Fundador)", "Famílias de Operários Têxteis"],
      fontes: [
        { nome: "Acervo Histórico da Tecelagem Parahyba / Parque da Cidade", tipo: "Arquivo Histórico", url: "https://fccr.sp.gov.br/" },
        { nome: "Pró-Memória da Câmara Municipal de SJC", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/" }
      ],
      destaque: true
    },
    {
      id: "ev-1932",
      ano: 1932,
      eraId: "sanatorial",
      dataExata: "1932",
      precisao: "ano",
      evidencia: "documentado",
      eixo: "fundacao",
      titulo: "Revolução Constitucionalista de 1932 e o Mártir Euclides Miragaia",
      citacao: "«O jovem estudante de São José tomba em 23 de maio e grava a letra M no MMDC.»",
      resumo: "Intensa mobilização da comunidade joseense na Revolução Constitucionalista de 1932. O estudante joseense Euclides Miragaia tombou em combate na capital paulista em 23 de maio de 1932, tornando-se a letra 'M' do movimento cívico M.M.D.C.",
      detalhes: "Miragaia é homenageado no obelisco do Ibirapuera e empresta seu nome a ruas, praças e escolas de São José dos Campos.",
      local: "São José dos Campos e Frente Paulista de 32",
      lat: -23.1870,
      lng: -45.8880,
      ontemHoje: {
        ontem: "Comitês de voluntários e alistamento de jovens joseenses para as trincheiras.",
        hoje: "Monumentos cívicos e avenidas consagradas à memória dos constitucionalistas."
      },
      instituicoesEnvolvidas: ["Sociedade Veteranos de 32 (MMDC)", "Câmara Municipal"],
      pessoasEnvolvidas: ["Euclides Miragaia", "Mário Martins de Almeida", "Antônio Américo Camargo de Andrade", "Dráusio Marcondes de Sousa"],
      fontes: [
        { nome: "Acervo Histórico MMDC / Sociedade Veteranos de 32", tipo: "Arquivo Cívico Oficial", url: "https://www.camarasjc.sp.gov.br/promemoria/" },
        { nome: "Pró-Memória da Câmara de SJC", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" }
      ],
      destaque: true
    },
    {
      id: "ev-1935",
      ano: 1935,
      eraId: "sanatorial",
      dataExata: "1935-12-16",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "saude",
      titulo: "Criação da Estância Climatérica e Hidromineral (Lei Estadual nº 2.484)",
      citacao: "«A Lei nº 2.484 cria o regime sanitário com prefeitos médicos nomeados pelo Governador.»",
      resumo: "A Lei Estadual nº 2.484/1935 oficializou São José dos Campos como Estância Climatérica e Hidromineral, estabelecendo regime administrativo especial com Prefeitos Sanitaristas nomeados diretamente pelo Governador do Estado.",
      detalhes: "O regime sanatorial com recursos vinculados impulsionou obras de macro-drenagem, calçamento, hospitais e redes de saneamento, vigorando até a redemocratização e retomada de eleições diretas em 1958.",
      local: "Território Municipal de São José dos Campos",
      lat: -23.1900,
      lng: -45.8900,
      ontemHoje: {
        ontem: "Estância com decretos sanitários rígidos e expansão de pensões e clínicas.",
        hoje: "Cidade com infraestrutura urbana saneada que serviu de base para a era industrial."
      },
      instituicoesEnvolvidas: ["Governo do Estado de São Paulo", "Departamento das Estâncias Hidrominerais"],
      pessoasEnvolvidas: ["Dr. Francisco José Longo", "Dr. Pedro Popini Mascarenhas", "Dr. Jorge Zarur"],
      fontes: [
        { nome: "Lei Estadual nº 2.484 de 16/12/1935 — ALESP", tipo: "Lei / Ato Normativo Primário", url: "https://www.al.sp.gov.br/norma/133036" },
        { nome: "Histórico Administrativo de SJC — IBGE", tipo: "Oficial Federal", url: "https://biblioteca.ibge.gov.br/biblioteca-catalogo.html?id=33048&view=detalhes" }
      ],
      destaque: true
    },
    {
      id: "ev-1947",
      ano: 1947,
      eraId: "tecnologica",
      dataExata: "1947",
      precisao: "ano",
      evidencia: "documentado",
      eixo: "ciencia",
      titulo: "Doação das Áreas Municipais para Implantação do CTA",
      citacao: "«A gestão Jorge Zarur doa os terrenos do aeroporto para a aviação do futuro.»",
      resumo: "Sob liderança do prefeito Dr. Jorge Zarur e comissão cívica, o município aprovou a desapropriação e doação de vasta área de terras ao Ministério da Aeronáutica para a construção do Centro Técnico de Aeronáutica (CTA).",
      detalhes: "Decisão pioneira que garantiu a vitória da candidatura joseense frente a outras cidades paulistas e fluminenses, mudando para sempre o destino industrial e acadêmico da cidade.",
      local: "Campus DCTA (Bairro São Judas Tadeu)",
      lat: -23.2120,
      lng: -45.8750,
      ontemHoje: {
        ontem: "Campos de pastagens rurais conhecidos como 'Campos das Putas'.",
        hoje: "Maior complexo científico-militar aeroespacial do Hemisfério Sul (DCTA)."
      },
      instituicoesEnvolvidas: ["Prefeitura Municipal de SJC", "Ministério da Aeronáutica / COCTA"],
      pessoasEnvolvidas: ["Dr. Jorge Zarur (Prefeito)", "Marechal Casimiro Montenegro Filho"],
      fontes: [
        { nome: "Acervo Histórico DCTA / ITA — Histórico da Construção", tipo: "Institucional Militar/Acadêmico", url: "http://www.ita.br/aconstruo" },
        { nome: "Pró-Memória da Câmara Municipal de SJC", tipo: "Arquivo Institucional", url: "https://www.camarasjc.sp.gov.br/promemoria/" }
      ],
      destaque: false
    },
    {
      id: "ev-1950",
      ano: 1950,
      eraId: "tecnologica",
      dataExata: "1950-01-16",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ciencia",
      titulo: "Criação do ITA e Implantação do Campus Projetado por Niemeyer",
      citacao: "«O Decreto nº 27.695 instala o ITA sob as curvas modernistas de Oscar Niemeyer.»",
      resumo: "O Decreto Federal nº 27.695 oficializou a instalação do Instituto Tecnológico de Aeronáutica (ITA) em São José dos Campos. O campus do CTA/ITA foi projetado pelo arquiteto Oscar Niemeyer sob o comando do Marechal Casimiro Montenegro Filho.",
      detalhes: "O ITA revolucionou a engenharia aeronáutica nacional e o ensino superior no país, trazendo professores renomados do MIT (EUA) e da Europa e formando os quadros fundadores da Embraer, INPE e da indústria de alta tecnologia brasileira.",
      local: "Campus DCTA / ITA",
      lat: -23.2085,
      lng: -45.8710,
      ontemHoje: {
        ontem: "Obras pioneiras em concreto armado projetadas por Niemeyer e consultores do MIT.",
        hoje: "Instituto Tecnológico de Aeronáutica (ITA), referência mundial em engenharia."
      },
      instituicoesEnvolvidas: ["Instituto Tecnológico de Aeronáutica (ITA)", "DCTA / Força Aérea Brasileira", "Ministério da Aeronáutica"],
      pessoasEnvolvidas: ["Marechal Casimiro Montenegro Filho", "Oscar Niemeyer (Arquiteto)", "Richard Smith (Consultor MIT)"],
      fontes: [
        { nome: "Decreto Federal nº 27.695 de 16/01/1950 — Presidência da República", tipo: "Decreto Federal Primário", url: "http://www.planalto.gov.br/" },
        { nome: "História da Construção do ITA — Portal Oficial do ITA", tipo: "Institucional Acadêmico", url: "http://www.ita.br/aconstruo" },
        { nome: "Tombamento do Complexo Arquitetônico Niemeyer no DCTA — IPHAN", tipo: "Patrimônio Nacional", url: "http://portal.iphan.gov.br/" }
      ],
      destaque: true
    },
    {
      id: "ev-1951",
      ano: 1951,
      eraId: "tecnologica",
      dataExata: "1951-01-19",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "trabalho",
      titulo: "Inauguração da Rodovia Presidente Dutra (BR-116)",
      citacao: "«O asfalto da Dutra abre o corredor industrial entre São Paulo e Rio de Janeiro.»",
      resumo: "Abertura oficial da Rodovia Presidente Dutra, conectando por pista pavimentada as duas maiores metrópoles do país (São Paulo e Rio de Janeiro) e cortando São José dos Campos.",
      detalhes: "A rodovia foi o principal indutor do ciclo de atração de gigantes multinacionais (Johnson & Johnson em 1952, Philips, Ericsson, General Motors em 1959, Monsanto e Rhodia), transformando SJC em polo manufatureiro de classe mundial.",
      local: "Eixo da BR-116 / Trecho Urbano de SJC",
      lat: -23.2100,
      lng: -45.8900,
      ontemHoje: {
        ontem: "Pista simples de asfalto recém-inaugurada pelo Presidente Dutra.",
        hoje: "Corredor rodoviário de alta densidade logística e parque industrial multinacional."
      },
      instituicoesEnvolvidas: ["Departamento Nacional de Estradas de Rodagem (DNER)", "Governo Federal"],
      pessoasEnvolvidas: ["Presidente Eurico Gaspar Dutra", "Trabalhadores da Construção Rodoviária"],
      fontes: [
        { nome: "Acervo Histórico DNIT / Ministério dos Transportes", tipo: "Oficial Federal", url: "https://www.gov.br/dnit/" },
        { nome: "IBGE — Perfil Econômico e Rodoviário de SJC", tipo: "Oficial Federal", url: "https://biblioteca.ibge.gov.br/biblioteca-catalogo.html?id=33048&view=detalhes" }
      ],
      destaque: true
    },
    {
      id: "ev-1961",
      ano: 1961,
      eraId: "tecnologica",
      dataExata: "1961-08-03",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ciencia",
      titulo: "Criação do GOCNAE — Embrião das Atividades Espaciais Brasileiras",
      citacao: "«Dr. Fernando de Mendonça assume o desafio de colocar o Brasil na corrida espacial.»",
      resumo: "O Decreto Presidencial nº 51.133 criou o Grupo de Organização da Comissão Nacional de Atividades Espaciais (GOCNAE), embrião do Programa Espacial Brasileiro, sediado em São José dos Campos sob direção científica do Dr. Fernando de Mendonça.",
      detalhes: "O GOCNAE iniciou as pesquisas em radioastronomia, física da ionosfera e recepção de imagens meteorológicas de satélites no país, originando posteriormente o INPE.",
      local: "Sede de Pesquisas Espaciais / Jardim da Granja",
      lat: -23.2080,
      lng: -45.8600,
      ontemHoje: {
        ontem: "Laboratório modesto com antenas de radiofrequência e poucos cientistas.",
        hoje: "Complexo do INPE com laboratórios espaciais de ponta e monitoramento global."
      },
      instituicoesEnvolvidas: ["GOCNAE / Presidência da República / CNPq", "CTA"],
      pessoasEnvolvidas: ["Dr. Fernando de Mendonça (Diretor Científico)", "Cientistas e Engenheiros Pioneiros"],
      fontes: [
        { nome: "História Institucional do INPE — Portal do Governo Federal", tipo: "Oficial Federal Institucional", url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/historia" },
        { nome: "Decreto Presidencial nº 51.133 de 03/08/1961", tipo: "Decreto Federal Primário", url: "http://www.planalto.gov.br/" }
      ],
      destaque: true
    },
    {
      id: "ev-1969",
      ano: 1969,
      eraId: "tecnologica",
      dataExata: "1969-08-19",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ciencia",
      titulo: "Fundação da EMBRAER (Empresa Brasileira de Aeronáutica)",
      citacao: "«Nasce a fabricante do Bandeirante que transformaria o Brasil em potência aeronáutica.»",
      resumo: "O Decreto-Lei nº 770 autorizou a criação da Embraer como sociedade de economia mista sediada em São José dos Campos, capitaneada pelo engenheiro do ITA Ozires Silva e pela equipe que projetou e construiu o bimotor Bandeirante (IPD-6504 / EMB-110).",
      detalhes: "A fundação da Embraer consolidou a sinergia entre academia (ITA), pesquisa militar (CTA) e manufatura industrial, transformando São José dos Campos na 3ª maior fabricante de jatos comerciais e de defesa do planeta.",
      local: "Complexo Industrial Embraer / Av. Brig. Faria Lima",
      lat: -23.2195,
      lng: -45.8620,
      ontemHoje: {
        ontem: "Hangar experimental para fabricar em série o bimotor Bandeirante.",
        hoje: "Planta aeroespacial de alta tecnologia que fabrica jatos E-Jets, KC-390 e eVTOLs."
      },
      instituicoesEnvolvidas: ["EMBRAER", "Ministério da Aeronáutica", "CTA / ITA"],
      pessoasEnvolvidas: ["Ozires Silva", "Max Holste (Projetista)", "Equipe de Engenheiros do CTA/ITA"],
      fontes: [
        { nome: "Decreto-Lei nº 770 de 19/08/1969 — Presidência da República", tipo: "Ato Normativo Primário Federal", url: "http://www.planalto.gov.br/" },
        { nome: "Portal Histórico Institucional Embraer — Criação em 1969", tipo: "Institucional Primário Empresarial", url: "https://www.embraer.com/media-center/pt/?mediatype=NEWS&detail=13369" }
      ],
      destaque: true
    },
    {
      id: "ev-1971",
      ano: 1971,
      eraId: "tecnologica",
      dataExata: "1971-04-22",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ciencia",
      titulo: "Oficialização do INPE (Instituto Nacional de Pesquisas Espaciais)",
      citacao: "«O Decreto nº 68.532 oficializa o INPE como órgão permanente da ciência espacial.»",
      resumo: "Criação definitiva do Instituto Nacional de Pesquisas Espaciais (INPE) vinculado ao CNPq (Decreto nº 68.532), sucedendo o GOCNAE e fixando seu campus nacional de laboratórios e integração em SJC.",
      detalhes: "O INPE consolidou o Laboratório de Integração e Testes (LIT), previsão de tempo e clima (CPTEC), sensoriamento remoto da Amazônia e projeto de satélites científicos próprios.",
      local: "Campus Sede INPE / Av. dos Astronautas",
      lat: -23.2075,
      lng: -45.8610,
      ontemHoje: {
        ontem: "Instalação definitiva da sede de pesquisas espaciais com cientistas de renome.",
        hoje: "Campus do INPE com rastreio de satélites, meteorologia de supercomputador e dados climáticos."
      },
      instituicoesEnvolvidas: ["INPE", "Ministério da Ciência e Tecnologia / CNPq"],
      pessoasEnvolvidas: ["Dr. Fernando de Mendonça", "Corpo de Pesquisadores Espaciais"],
      fontes: [
        { nome: "Histórico 50 Anos do INPE — Portal Oficial do INPE", tipo: "Institucional Federal", url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/historia" },
        { nome: "Decreto nº 68.532 de 22/04/1971", tipo: "Decreto Federal", url: "http://www.planalto.gov.br/" }
      ],
      destaque: false
    },
    {
      id: "ev-1982",
      ano: 1982,
      eraId: "tecnologica",
      dataExata: "1982-06-03",
      precisao: "dia",
      evidencia: "corroborado",
      eixo: "ambiente",
      titulo: "Criação da APA Mananciais do Rio Paraíba do Sul",
      citacao: "«Proteção federal para as águas que abastecem mais de 15 milhões de brasileiros.»",
      resumo: "Decreto Federal nº 87.561 instituiu a Área de Proteção Ambiental (APA) para preservar os recursos hídricos, a mata ciliar e os mananciais estratégicos que abastecem o Vale e a bacia do Rio Paraíba do Sul.",
      detalhes: "Instituiu diretrizes ambientais que orientaram a disciplina do zoneamento industrial e habitacional da cidade nas décadas seguintes.",
      local: "Bacia do Rio Paraíba do Sul em SJC",
      lat: -23.1700,
      lng: -45.8800,
      ontemHoje: {
        ontem: "Margens fluviais sob pressão de ocupação desordenada e despejo de efluentes.",
        hoje: "Corredor ecológico protegido e fiscalizado com monitoramento ambiental."
      },
      instituicoesEnvolvidas: ["Governo Federal / Instituto Brasileiro do Meio Ambiente (IBAMA)", "Secretaria de Meio Ambiente"],
      pessoasEnvolvidas: ["Ambientalistas e Técnicos de Planejamento"],
      fontes: [
        { nome: "Decreto Federal nº 87.561/1982 — Presidência da República", tipo: "Legislação Federal", url: "http://www.planalto.gov.br/" }
      ],
      destaque: false
    },
    {
      id: "ev-1992",
      ano: 1992,
      eraId: "tecnologica",
      dataExata: "1992",
      precisao: "ano",
      evidencia: "corroborado",
      eixo: "ciencia",
      titulo: "Transformação da FVE na Universidade do Vale do Paraíba (UNIVAP)",
      citacao: "«A tradicional Fundação Valeparaibana de Ensino ganha status pleno de Universidade.»",
      resumo: "A Fundação Valeparaibana de Ensino (FVE, criada em 1963) é reconhecida e credenciada pelo Ministério da Educação com status pleno de Universidade (UNIVAP), expandindo cursos superiores e pesquisas regionais.",
      detalhes: "A UNIVAP abrigou centros pioneiros de pós-graduação e o Centro de Estudos Históricos do Vale do Paraíba (CEHVAP), polo de resgate documental regional.",
      local: "Campus Urbanova / SJC",
      lat: -23.2110,
      lng: -45.9520,
      ontemHoje: {
        ontem: "Faculdades isoladas de direito e engenharia no centro e zona oeste.",
        hoje: "Campus Universitário integrado com hospital veterinário, parque tecnológico e CEHVAP."
      },
      instituicoesEnvolvidas: ["Universidade do Vale do Paraíba (UNIVAP)", "Conselho Nacional de Educação / MEC"],
      pessoasEnvolvidas: ["Corpo Docente e Reitoria da UNIVAP"],
      fontes: [
        { nome: "Portal Institucional UNIVAP — Memória Institucional", tipo: "Institucional de Ensino Superior", url: "https://www.univap.br/" }
      ],
      destaque: false
    },
    {
      id: "ev-1993",
      ano: 1993,
      eraId: "tecnologica",
      dataExata: "1993-02-09",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ciencia",
      titulo: "Lançamento do Satélite SCD-1 (Primeiro Satélite Desenvolvido no Brasil)",
      citacao: "«O SCD-1 parte para o espaço e bate recordes de longevidade orbital por mais de 30 anos.»",
      resumo: "O INPE lançou em órbita o Satélite de Coleta de Dados SCD-1, primeiro satélite integralmente projetado, construído, testado no LIT e operado pelo Brasil a partir do Centro de Rastreio de SJC.",
      detalhes: "O SCD-1 segue em operação há mais de 30 anos, superando em dezenas de vezes a sua vida útil projetada e se tornando um dos satélites mais longevos da história da astronáutica mundial.",
      local: "Laboratório LIT/INPE e Centro de Rastreio",
      lat: -23.2070,
      lng: -45.8605,
      ontemHoje: {
        ontem: "Satélite de 115 kg construído por cientistas brasileiros no LIT de São José.",
        hoje: "Ícone mundial de engenharia aeroespacial com mais de 30 anos ininterruptos em órbita."
      },
      instituicoesEnvolvidas: ["INPE", "Ministério da Ciência e Tecnologia", "Missão Espacial Completa Brasileira (MECB)"],
      pessoasEnvolvidas: ["Engenheiros e Físicos Espaciais do INPE"],
      fontes: [
        { nome: "Portal INPE — Missão do Satélite de Coleta de Dados SCD-1", tipo: "Institucional Primário", url: "https://www.gov.br/inpe/pt-br/assuntos/ultimas-noticias/satelite-brasileiro-scd-1-completa-30-anos-em-orbita" }
      ],
      destaque: true
    },
    {
      id: "ev-1996",
      ano: 1996,
      eraId: "tecnologica",
      dataExata: "1996-07-27",
      precisao: "dia",
      evidencia: "corroborado",
      eixo: "ambiente",
      titulo: "Inauguração do Parque da Cidade Roberto Burle Marx",
      citacao: "«Os jardins históricos de Burle Marx abrem seus portões como o maior parque público urbano.»",
      resumo: "Inauguração pública do Parque da Cidade nos jardins históricos da antiga Tecelagem Parahyba, com projeto paisagístico assinado pelo mestre Roberto Burle Marx e palacetes preservados.",
      detalhes: "Com quase 1 milhão de metros quadrados, o parque foi tombado pelo COMPHAC e abriga a sede da Fundação Cultural Cassiano Ricardo, combinando lazer ambiental e memória arquitetônica.",
      local: "Parque da Cidade / Santana",
      lat: -23.1675,
      lng: -45.8955,
      ontemHoje: {
        ontem: "Residência privada e jardins exclusivos da família Olivo Gomes.",
        hoje: "Parque público ecológico com palmeiras imperiais, lagos e polo cultural (FCCR)."
      },
      instituicoesEnvolvidas: ["Prefeitura Municipal de SJC", "Fundação Cultural Cassiano Ricardo (FCCR)", "COMPHAC"],
      pessoasEnvolvidas: ["Roberto Burle Marx (Paisagista)", "Olivo Gomes", "Comunidade Joseense"],
      fontes: [
        { nome: "Prefeitura de SJC — Parques Municipais e Áreas Verdes", tipo: "Institucional", url: "https://www.sjc.sp.gov.br/" },
        { nome: "FCCR — Patrimônio Histórico Tombado de SJC", tipo: "Patrimonial", url: "https://fccr.sp.gov.br/" }
      ],
      destaque: true
    },
    {
      id: "ev-2006",
      ano: 2006,
      eraId: "contemporanea",
      dataExata: "2006-12-06",
      precisao: "dia",
      evidencia: "corroborado",
      eixo: "ciencia",
      titulo: "Criação do Parque Tecnológico de São José dos Campos",
      citacao: "«O primeiro parque tecnológico do Estado integra universidades, centros de P&D e startups.»",
      resumo: "Instituído o Parque Tecnológico de São José dos Campos (PqTec), pioneiro no Estado de São Paulo, integrando empresas de base tecnológica, incubadoras, centros de P&D e universidades como UNIFESP, UNESP e FATEC.",
      detalhes: "Ambiente de inovação aberto voltado aos setores aeroespacial, defesa, tecnologia da informação, energia, saúde e cibersegurança.",
      local: "Parque Tecnológico / Distrito de Eugênio de Melo",
      lat: -23.1550,
      lng: -45.7920,
      ontemHoje: {
        ontem: "Área de expansão às margens da Dutra próxima ao distrito histórico de Eugênio de Melo.",
        hoje: "Maior ecossistema de inovação e tecnologia do Estado com centenas de empresas residentes."
      },
      instituicoesEnvolvidas: ["Associação Parque Tecnológico de SJC (APTSJC)", "Prefeitura de SJC", "Governo do Estado de São Paulo"],
      pessoasEnvolvidas: ["Pesquisadores, Empreendedores e Gestores Públicos"],
      fontes: [
        { nome: "Portal Oficial do Parque Tecnológico de São José dos Campos", tipo: "Institucional", url: "https://pqtec.org.br/" },
        { nome: "Secretaria de Inovação e Desenvolvimento Econômico de SJC", tipo: "Governamental", url: "https://www.sjc.sp.gov.br/" }
      ],
      destaque: true
    },
    {
      id: "ev-2012",
      ano: 2012,
      eraId: "contemporanea",
      dataExata: "2012-06-28",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ambiente",
      titulo: "Criação do Parque Natural Municipal do Banhado (Lei nº 8.756)",
      citacao: "«A Lei nº 8.756 protege a grande ferradura verde e ecológica que emoldura o pôr do sol de SJC.»",
      resumo: "A Lei Municipal nº 8.756 instituiu a Unidade de Conservação Integral do Parque Natural Municipal do Banhado, protegendo 1,5 milhão de metros quadrados do anfiteatro geológico e ecológico símbolo visual da cidade.",
      detalhes: "O Banhado é o cartão-postal ecológico de São José dos Campos, exercendo papel vital na regulação hídrica, microclima e abrigo de avifauna e fauna nativa da várzea do Paraíba.",
      local: "Orla do Banhado / Centro & Urbanova",
      lat: -23.1875,
      lng: -45.8920,
      ontemHoje: {
        ontem: "Várzea fluvial e área de transição ambiental sob disputa e ocupação informal.",
        hoje: "Unidade de Conservação Integral com mirante contemplativo na Av. Anchieta."
      },
      instituicoesEnvolvidas: ["Prefeitura Municipal de SJC", "Câmara Municipal", "Conselho de Meio Ambiente (COMAM)"],
      pessoasEnvolvidas: ["Movimentos Ambientalistas", "Comunidade Local"],
      fontes: [
        { nome: "Lei Municipal nº 8.756 de 28/06/2012 — LeisMunicipais / Câmara de SJC", tipo: "Lei Municipal Primária", url: "https://leismunicipais.com.br/a/sp/s/sao-jose-dos-campos/lei-ordinaria/2012/875/8756/lei-ordinaria-n-8756-2012" }
      ],
      destaque: true
    },
    {
      id: "ev-2018",
      ano: 2018,
      eraId: "contemporanea",
      dataExata: "2018-11-30",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ambiente",
      titulo: "Aprovação do Plano Diretor de Desenvolvimento Integrado (PDDI)",
      citacao: "«Diretrizes urbanas sustentáveis planejando a cidade conectada para as próximas décadas.»",
      resumo: "Promulgação da Lei Complementar Municipal nº 612/2018, instituindo o novo Plano Diretor de Desenvolvimento Integrado (PDDI) com diretrizes para os próximos 10 anos de zoneamento e mobilidade sustentável.",
      detalhes: "Focado no conceito de Cidade Compacta e Conectada, incentivando transporte limpo, adensamento ao longo de corredores e proteção estrita de bacias de mananciais.",
      local: "Paço Municipal / Território Integrado",
      lat: -23.1820,
      lng: -45.8860,
      ontemHoje: {
        ontem: "Planos diretores anteriores focados em zoneamentos setoriais.",
        hoje: "Instrumento moderno de planejamento com mobilidade limpa e preservação de nascentes."
      },
      instituicoesEnvolvidas: ["Prefeitura Municipal de SJC", "Câmara Municipal de SJC"],
      pessoasEnvolvidas: ["Urbanistas, Sociedade Civil e Gestores Municipais"],
      fontes: [
        { nome: "Lei Complementar Municipal nº 612 de 30/11/2018 — Câmara Municipal de SJC", tipo: "Lei Complementar Primária", url: "https://www.camarasjc.sp.gov.br/" }
      ],
      destaque: false
    },
    {
      id: "ev-2022",
      ano: 2022,
      eraId: "contemporanea",
      dataExata: "2022-03-16",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "ciencia",
      titulo: "Primeira Cidade Brasileira Certificada como Inteligente (ABNT / ISO)",
      citacao: "«São José atinge certificação máxima ABNT/ISO em 276 indicadores de sustentabilidade e IA.»",
      resumo: "São José dos Campos obteve a certificação oficial da Associação Brasileira de Normas Técnicas (ABNT) como Cidade Inteligente, Sustentável e Resiliente nas normas técnicas NBR ISO 37120, NBR ISO 37122 e NBR ISO 37123, auditada em 276 indicadores internacionais.",
      detalhes: "A certificação internacional reflete políticas públicas estruturadas como a Linha Verde (frota de ônibus 100% elétricos do tipo VLP), o Centro de Segurança e Inteligência (CSI com videomonitoramento por IA), a modernização integral da iluminação para LED e serviços municipais desmaterializados em plataforma digital.",
      local: "Centro de Segurança e Inteligência (CSI) / Linha Verde",
      lat: -23.2180,
      lng: -45.8910,
      ontemHoje: {
        ontem: "Gestão municipal analógica com serviços presenciais e iluminação tradicional.",
        hoje: "1ª Cidade Inteligente certificada: VLPs elétricos, CSI com IA e 100% LED."
      },
      instituicoesEnvolvidas: ["Prefeitura de SJC", "Associação Brasileira de Normas Técnicas (ABNT)", "World Council on City Data (WCCD)"],
      pessoasEnvolvidas: ["Gestores do Parque Tecnológico e Equipe Técnica Municipal"],
      fontes: [
        { nome: "Prefeitura de SJC — Certificação ABNT de Cidade Inteligente", tipo: "Institucional Primário", url: "https://www.sjc.sp.gov.br/noticias/2022/marco/16/sao-jose-e-certificada-a-primeira-cidade-inteligente-do-brasil/" },
        { nome: "ABNT — Certificação de Cidades Inteligentes e Sustentáveis (ISO 37120)", tipo: "Órgão Normativo Nacional", url: "https://abnt.org.br/certificacao/smartcities/" }
      ],
      destaque: true
    },
    {
      id: "ev-2026",
      ano: 2026,
      eraId: "contemporanea",
      dataExata: "2026-06-16",
      precisao: "dia",
      evidencia: "documentado",
      eixo: "fundacao",
      titulo: "Liderança da Rede Latino-Americana de Cidades Inteligentes (FLACMA)",
      citacao: "«São José dos Campos exporta seu modelo de tecnologia pública para toda a América Latina.»",
      resumo: "São José dos Campos foi escolhida para liderar a Rede Latino-Americana de Cidades Inteligentes no âmbito da Federação Latino-Americana de Cidades, Municípios e Associações de Governos Locais (FLACMA), transferindo metodologia de governança baseada em indicadores e tecnologias públicas.",
      detalhes: "A escolha reflete a consolidação da trajetória joseense que une 259 anos de fundação institucional à vanguarda de governança digital e sustentabilidade urbana na América Latina.",
      local: "São José dos Campos / Âmbito Latino-Americano",
      lat: -23.1815,
      lng: -45.8860,
      ontemHoje: {
        ontem: "Aldeia jesuítica erguida há 259 anos em 1767.",
        hoje: "Líder e modelo de tecnologia e gestão pública para municípios da América Latina."
      },
      instituicoesEnvolvidas: ["Prefeitura de São José dos Campos", "Federação Latino-Americana de Municípios (FLACMA)"],
      pessoasEnvolvidas: ["Lideranças Municipalistas da América Latina e Caribe"],
      fontes: [
        { nome: "Prefeitura de SJC — São José lidera rede de cidades inteligentes da América Latina (16/06/2026)", tipo: "Notícia Institucional Oficial", url: "https://www.sjc.sp.gov.br/noticias/2026/junho/16/sao-jose-leva-modelo-de-cidade-inteligente-a-america-latina/" }
      ],
      destaque: true
    }
  ],

  personalidades: [
    {
      id: "per-ozires",
      nome: "Ozires Silva",
      cargo: "Fundador da Embraer & Engenheiro do ITA",
      periodo: "1931 – presente",
      descricao: "Oficial da Aeronáutica e engenheiro formado na turma do ITA. Liderou a equipe técnica do CTA que concebeu o bimotor Bandeirante e chefiou a fundação e presidência da Embraer a partir de 1969, alçando o Brasil à liderança na aviação regional mundial.",
      tag: "Aviação & Indústria",
      cor: "cyan"
    },
    {
      id: "per-montenegro",
      nome: "Marechal Casimiro Montenegro Filho",
      cargo: "Idealizador e Patrono do CTA e do ITA",
      periodo: "1904 – 2000",
      descricao: "Pioneiro do Correio Aéreo Nacional e líder militar visionário. Concebeu a criação do Centro Técnico de Aeronáutica e do ITA em São José dos Campos na década de 1940, trazendo docentes e arquitetos de prestígio global como Oscar Niemeyer para moldar a capital aeroespacial do Brasil.",
      tag: "Ciência & Educação",
      cor: "indigo"
    },
    {
      id: "per-mendonca",
      nome: "Dr. Fernando de Mendonça",
      cargo: "Primeiro Diretor e Fundador do INPE",
      periodo: "1924 – presente",
      descricao: "Cientista e engenheiro eletrônico, doutor pela Universidade de Stanford. Foi encarregado em 1961 da direção do GOCNAE e da fundação do INPE em São José dos Campos, estruturando as primeiras missões espaciais, meteorológicas e de sensoriamento remoto brasileiras.",
      tag: "Pesquisa Espacial",
      cor: "blue"
    },
    {
      id: "per-cassiano",
      nome: "Cassiano Ricardo",
      cargo: "Poeta Modernista, Jornalista e Imortal da ABL",
      periodo: "1895 – 1974",
      descricao: "Nascido em São José dos Campos, é uma das maiores vozes da literatura modernista e da poesia concreta do Brasil. Patrono da Fundação Cultural e da Biblioteca Pública Municipal que levam seu nome.",
      tag: "Literatura & Poesia",
      cor: "rose"
    },
    {
      id: "per-vicentina",
      nome: "Dona Vicentina de Queiroz Aranha",
      cargo: "Patrona Filantrópica do Sanatório",
      periodo: "1863 – 1916",
      descricao: "Filantropa cuja expressiva doação testamentária à Santa Casa viabilizou a aquisição do sítio e construção do monumental Sanatório Vicentina Aranha em 1924, inaugurando o ciclo de referência médica da cidade.",
      tag: "Saúde & Filantropia",
      cor: "purple"
    },
    {
      id: "per-zemira",
      nome: "Mestre Zé Mira",
      cargo: "Mestre Tropeiro & Guardião da Cultura Popular",
      periodo: "1942 – 2021",
      descricao: "Mestre da cultura popular caipira, fundador da Orquestra de Viola Caipira de São José dos Campos e incansável guardião das tradições das Folias de Reis, Moçambique e causos do Vale do Paraíba.",
      tag: "Cultura Tradicional",
      cor: "amber"
    },
    {
      id: "per-miragaia",
      nome: "Euclides Miragaia",
      cargo: "Mártir Constitucionalista de 1932 (M.M.D.C.)",
      periodo: "1911 – 1932",
      descricao: "Estudante e comerciário joseense que perdeu a vida em 23 de maio de 1932 defendendo a causa constitucionalista paulista, tornando-se a letra 'M' que batizou o histórico movimento M.M.D.C.",
      tag: "Memória Cívica",
      cor: "purple"
    },
    {
      id: "per-tarantino",
      nome: "Dr. Affonso Berardinelli Tarantino",
      cargo: "Médico Pneumologista Pioneiro",
      periodo: "1916 – 2012",
      descricao: "Pneumologista e autor do célebre tratado 'Doenças Pulmonares'. Dedicou décadas ao tratamento de doentes no Vicentina Aranha, deixando registros fundamentais de história oral sobre a fase sanatorial.",
      tag: "Medicina & História Oral",
      cor: "emerald"
    }
  ],

  prefeitos: [
    { periodo: "1798 – 1805", nome: "Tomé Alves Alvarenga", cargo: "Alcaide / Primeiro da Série Compilada", acesso: "Nomeação Colonial", situacao: "DOCUMENTADO (Série Histórica Compilada)" },
    { periodo: "1806 – 1817", nome: "Joaquim Antônio Cabral", cargo: "Titular do Executivo Local", acesso: "Designação Provincial", situacao: "CORROBORADO (Fontes Secundárias)" },
    { periodo: "1834 – 1838", nome: "Manoel Joaquim de Andrade", cargo: "Prefeito Imperial (Lei Provincial de 1834)", acesso: "Nomeação Provincial", situacao: "CORROBORADO" },
    { periodo: "1839 – 1888", nome: "Lacuna Documental Nominal", cargo: "Período com ausência de atos primários preservados", acesso: "A apurar nas atas da Câmara", situacao: "EM INVESTIGAÇÃO / LACUNA HISTÓRICA" },
    { periodo: "1890 – 1893", nome: "Francisco Oliveira Lima", cargo: "Conselheiro Intendente Municipal", acesso: "Intendência Republicana", situacao: "DOCUMENTADO" },
    { periodo: "1918 – 1930", nome: "João Alves da Silva Cursino", cargo: "Prefeito Municipal", acesso: "Eleição Indireta / Câmara", situacao: "DOCUMENTADO" },
    { periodo: "1930", nome: "Rui Rodrigues Dória, Antônio Cerdeira e Austin Tibiriçá", cargo: "Junta Governativa Provisória", acesso: "Revolução de 1930", situacao: "DOCUMENTADO" },
    { periodo: "1938 – 1941", nome: "Dr. Francisco José Longo", cargo: "Prefeito Sanitarista", acesso: "Nomeado pelo Governador (Regime de Estância)", situacao: "DOCUMENTADO" },
    { periodo: "1942 – 1947", nome: "Dr. Pedro Popini Mascarenhas", cargo: "Prefeito Sanitarista", acesso: "Nomeado pelo Governador", situacao: "DOCUMENTADO" },
    { periodo: "1947", nome: "Dr. Jorge Zarur", cargo: "Prefeito Sanitarista (Articulou a doação ao CTA)", acesso: "Nomeado", situacao: "DOCUMENTADO" },
    { periodo: "1958 – 1962", nome: "Elmano Ferreira Veloso", cargo: "Prefeito Municipal Eleito", acesso: "Eleição Direta (Fim da tutela sanatorial)", situacao: "DOCUMENTADO" },
    { periodo: "1970 – 1975", nome: "Sérgio Sobral de Oliveira", cargo: "Prefeito Municipal Nomeado", acesso: "Nomeado (Regime de Segurança Nacional)", situacao: "DOCUMENTADO" },
    { periodo: "1978 – 1982", nome: "Joaquim Vicente Ferreira Bevilacqua", cargo: "Prefeito Municipal", acesso: "Eleição Direta", situacao: "DOCUMENTADO" },
    { periodo: "1983 – 1986", nome: "Robson Riedel Marinho", cargo: "Prefeito Municipal", acesso: "Eleição Direta", situacao: "DOCUMENTADO" },
    { periodo: "1993 – 1996", nome: "Angela Guadagnin", cargo: "Prefeita Municipal", acesso: "Primeira Mulher Eleita Prefeita", situacao: "DOCUMENTADO" },
    { periodo: "1997 – 2004", nome: "Emanuel Fernandes", cargo: "Prefeito Municipal (2 Mandatos)", acesso: "Eleição e Reeleição Direta", situacao: "DOCUMENTADO" },
    { periodo: "2005 – 2012", nome: "Eduardo Cury", cargo: "Prefeito Municipal (2 Mandatos)", acesso: "Eleição e Reeleição Direta", situacao: "DOCUMENTADO" },
    { periodo: "2013 – 2016", nome: "Carlinhos Almeida (Carlos José de Almeida)", cargo: "Prefeito Municipal", acesso: "Eleição Direta", situacao: "DOCUMENTADO" },
    { periodo: "2017 – 2022", nome: "Felicio Ramuth", cargo: "Prefeito Municipal (Reeleito em 2020 / Renunciou em 2022)", acesso: "Eleição e Reeleição Direta", situacao: "DOCUMENTADO" },
    { periodo: "2022 – 2028", nome: "Anderson Farias Ferreira", cargo: "Prefeito Municipal (Reeleito para mandato 2025–2028)", acesso: "Vice em Exercício (2022) / Eleição Direta (2024)", situacao: "DOCUMENTADO" }
  ],

  regioes: [
    {
      id: "sul",
      nome: "Zona Sul",
      badgeCor: "bg-amber-500",
      bgClass: "bg-amber-50 border-amber-200 text-amber-900",
      icone: "fa-people-roof",
      resumo: "A região mais populosa do município, fruto da grande expansão habitacional e industrial pós-1970.",
      historia: "Originada a partir de loteamentos em antigas fazendas de café e pecuária, desenvolveu-se ao longo da bacia do Rio Comprido e Córrego Senhor Menino. Hoje concentra expressivo comércio popular e forte identidade comunitária.",
      principaisBairros: ["Jardim Satélite", "Bosque dos Eucaliptos", "Campo dos Alemães", "Parque Industrial", "Jardim Morumbi", "Jardim Oriente"],
      marcos: ["Centro da Juventude (Pavilhão Altivo)", "Avenida Andrômeda", "Vale Sul Shopping", "Bacia do Rio Comprido"],
      svgPath: "M 180 280 Q 230 250 280 270 L 290 350 Q 220 380 160 330 Z",
      center: { x: 230, y: 310 }
    },
    {
      id: "oeste",
      nome: "Zona Oeste",
      badgeCor: "bg-cyan-500",
      bgClass: "bg-cyan-50 border-cyan-200 text-cyan-900",
      icone: "fa-building",
      resumo: "Polo de alta renda, centros empresariais, condomínios horizontais e expansão planejada.",
      historia: "Até meados dos anos 1980, era ocupada pela imensa Fazenda Aquarius e propriedades rurais ao longo da margem oeste do Rio Paraíba. O Plano Diretor estruturou a expansão com bairros fechados, boulevards e o polo tecnológico e universitário do Urbanova.",
      principaisBairros: ["Jardim Aquarius", "Urbanova", "Jardim das Colinas", "Jardim Esplanada", "Vila Ema Oeste"],
      marcos: ["Arco da Inovação", "Praça Ulisses Guimarães (Aquarius)", "Ponte Estaiada / Rio Paraíba", "Campus Univap Urbanova"],
      svgPath: "M 80 180 Q 150 160 200 200 L 190 270 Q 130 260 70 220 Z",
      center: { x: 140, y: 220 }
    },
    {
      id: "leste",
      nome: "Zona Leste",
      badgeCor: "bg-blue-600",
      bgClass: "bg-blue-50 border-blue-200 text-blue-900",
      icone: "fa-microchip",
      resumo: "Eixo industrial, inovação de ponta, conexão com o Vale Histórico e Rodovia Presidente Dutra.",
      historia: "Marcada pela instalação da Estrada de Ferro Central do Brasil e a estação de Eugênio de Melo em 1877. A partir dos anos 1950, com a Rodovia Dutra, consolidou-se como polo de grandes indústrias (GM, Ericsson, Monsanto) e, mais recentemente, o Parque Tecnológico.",
      principaisBairros: ["Eugênio de Melo", "Jardim Vista Verde", "Parque Tecnológico", "Novo Horizonte", "Jardim Santa Inês", "Galo Branco"],
      marcos: ["Parque Tecnológico de SJC", "Estação Ferroviária de Eugênio de Melo (1877)", "Eixo Rodovia Presidente Dutra", "FATEC SJC"],
      svgPath: "M 280 160 Q 360 130 450 150 L 430 250 Q 340 240 280 210 Z",
      center: { x: 360, y: 190 }
    },
    {
      id: "norte",
      nome: "Zona Norte",
      badgeCor: "bg-emerald-600",
      bgClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icone: "fa-industry",
      resumo: "Berço colonial, tradição têxtil, patrimônio histórico e meandros do Rio Paraíba do Sul.",
      historia: "Primeiro núcleo colonial com a Ponte dos Jesuítas e o Porto das Canoas. Nos anos 1920, sediou o império da Tecelagem Parahyba e suas vilas operárias. Preserva rica herança cultural, festas religiosas e o Parque da Cidade projetado por Burle Marx.",
      principaisBairros: ["Santana", "Altos de Santana", "Buquirinha", "Vila Paiva", "Vila Dirce", "Teleférico"],
      marcos: ["Parque da Cidade (Antiga Tecelagem Parahyba)", "Ponte dos Jesuítas", "Igreja Matriz de Santana", "Mirante do Buquirinha"],
      svgPath: "M 160 90 Q 250 80 320 110 L 290 170 Q 210 160 170 140 Z",
      center: { x: 240, y: 125 }
    },
    {
      id: "centro",
      nome: "Centro & Região Central",
      badgeCor: "bg-purple-600",
      bgClass: "bg-purple-50 border-purple-200 text-purple-900",
      icone: "fa-landmark",
      resumo: "Colina histórica original de 1767, Banhado, sanitários históricos e centro administrativo.",
      historia: "Erigida na colina estratégica debruçada sobre o Banhado em 1767. No início do século XX, transformou-se com a fase sanatorial e os suntuosos pavilhões do Sanatório Vicentina Aranha e Olivo Gomes. É o coração financeiro, cívico e de serviços da cidade.",
      principaisBairros: ["Centro Histórico", "Vila Ema", "Vila Adyana", "Jardim São Dimas", "Jardim Maringá", "Jardim Santa Luzia"],
      marcos: ["Colina do Banhado", "Igreja Matriz de São José (1680/1934)", "Parque Vicentina Aranha (1924)", "Praça Afonso Pena"],
      svgPath: "M 200 170 Q 250 170 270 190 L 260 230 Q 210 220 190 200 Z",
      center: { x: 235, y: 195 }
    },
    {
      id: "sudeste",
      nome: "Zona Sudeste",
      badgeCor: "bg-rose-500",
      bgClass: "bg-rose-50 border-rose-200 text-rose-900",
      icone: "fa-plane-departure",
      resumo: "Polo aeroespacial internacional, Aeroporto, DCTA, Embraer e expansão do Putim.",
      historia: "Impulsionada a partir de 1947 com a doação das terras para a instalação do Centro Técnico de Aeronáutica (CTA) e o Instituto Tecnológico de Aeronáutica (ITA). Nos anos 1970, recebeu a sede da EMBRAER na Avenida Faria Lima e bairros de forte crescimento habitacional no Putim.",
      principaisBairros: ["Putim", "Jardim Santa Júlia", "São Judas Tadeu", "Jardim da Granja", "Vila Industrial Leste"],
      marcos: ["Campus do DCTA / ITA (Niemeyer)", "Complexo EMBRAER Faria Lima", "Aeroporto Internacional de SJC", "Rodovia dos Tamoios"],
      svgPath: "M 270 230 Q 340 230 380 270 L 340 350 Q 270 330 260 270 Z",
      center: { x: 315, y: 280 }
    },
    {
      id: "sfx",
      nome: "São Francisco Xavier",
      badgeCor: "bg-emerald-700",
      bgClass: "bg-emerald-50 border-emerald-300 text-emerald-950",
      icone: "fa-tree",
      resumo: "Distrito serrano na Mantiqueira, tropeirismo, turismo ecológico e Área de Proteção Ambiental.",
      historia: "Surgiu no século XIX como pouso de tropeiros vindos de Minas Gerais em direção ao litoral. Elevado a distrito em 1892, preserva matas nativas de altitude, gastronomia da serra, artesanato e riquíssima cultura caipira.",
      principaisBairros: ["Vila de São Francisco", "Lavras", "Santa Bárbara", "Remédios", "Ronco do Bugio"],
      marcos: ["Serra da Mantiqueira", "Pedra de São Francisco", "Igreja de São Francisco de Assis", "APA Federal da Bacia do Paraíba"],
      svgPath: "M 80 40 Q 140 20 200 40 L 170 100 Q 110 90 70 60 Z",
      center: { x: 130, y: 65 }
    }
  ],

  bairros: [
  {
    "id": "bairro-sfx-vila",
    "nome": "São Francisco Xavier (Vila Central)",
    "regiaoId": "sfx",
    "regiaoNome": "São Francisco Xavier",
    "periodo": "1892 (Elevação a Distrito)",
    "origemNome": "Homenagem a São Francisco Xavier, padroeiro dos tropeiros e viajantes que cruzavam a Mantiqueira.",
    "historia": "Surgido como ponto de pouso de tropas na rota comercial entre o Sul de Minas Gerais e o Vale do Paraíba. Tornou-se distrito de paz em 1892 pela Lei Estadual nº 69.",
    "curiosidade": "Preserva a Igreja de São Francisco de 1898 e é Área de Proteção Ambiental (APA Estadual).",
    "fonte": "FCCR / Pró-Memória SJC",
    "fonteUrl": "https://fccr.sp.gov.br/"
  },
  {
    "id": "bairro-sfx-santa-barbara",
    "nome": "Santa Bárbara (SFX)",
    "regiaoId": "sfx",
    "regiaoNome": "São Francisco Xavier",
    "periodo": "Século XIX",
    "origemNome": "Invocação a Santa Bárbara, protetora contra raios e tempestades nas escarpas da serra.",
    "historia": "Núcleo rural histórico ao longo dos afluentes do Rio do Peixe, caracterizado por pequenas propriedades agropecuárias, alambiques artesanais e mata atlântica de altitude.",
    "curiosidade": "Abriga nascentes preservadas e trilhas ecológicas que conectam à crista da Serra da Mantiqueira.",
    "fonte": "Pró-Memória Câmara SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-sfx-lavras",
    "nome": "Lavras (SFX)",
    "regiaoId": "sfx",
    "regiaoNome": "São Francisco Xavier",
    "periodo": "Século XVIII / XIX",
    "origemNome": "Referência às antigas lavras (garimpos e faisqueiras de ouro) exploradas no curso alto dos ribeirões serranos.",
    "historia": "Povoamento tradicional de montanha ligado aos ciclos de exploração mineral e posterior cultivo de milho, feijão e pecuária leiteira de altitude.",
    "curiosidade": "Famoso pelas cachoeiras das Lavras e pequenos produtores de queijos artesanais.",
    "fonte": "História Oral & Acervo FCCR",
    "fonteUrl": "https://fccr.sp.gov.br/"
  },
  {
    "id": "bairro-sfx-remedios",
    "nome": "Remédios (SFX)",
    "regiaoId": "sfx",
    "regiaoNome": "São Francisco Xavier",
    "periodo": "Século XIX",
    "origemNome": "Homenagem a Nossa Senhora dos Remédios, devoção mariana dos primeiros sitiantes do vale serrano.",
    "historia": "Comunidade rural encravada na divisa serrana com Joanópolis e Minas Gerais, polo de artesanato em madeira e turismo rural regenerativo.",
    "curiosidade": "Mantém celebrações tradicionais de Folia de Reis e festas comunitárias centenárias.",
    "fonte": "Pró-Memória Univap",
    "fonteUrl": "https://www.univap.br/"
  },
{
    "id": "bairro-santana",
    "nome": "Santana",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Século XIX; bairro formado antes da industrialização dos anos 1920",
    "origemNome": "Santana tem o nome de sua padroeira, Sant’Ana. A cronologia do Pró-Memória de São José dos Campos, acervo mantido pela Câmara, Fundação Cultural Cassiano Ricardo e Univap, registra o início da construção da igreja em 1869, por moradores da margem do Paraíba.",
    "historia": "O bairro já existia quando as cerâmicas e a Tecelagem Parahyba chegaram, nos anos 1920. As fábricas atraíram trabalhadores e mudaram a rotina de Santana. A tecelagem também construiu moradias, escola e uma cooperativa de alimentos para seus empregados.",
    "curiosidade": "A origem religiosa e a história operária convivem no mesmo bairro. A igreja e os antigos espaços industriais ajudam a reconhecer essas duas camadas de Santana.",
    "fonte": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia. Pró-Memória, [s.d.]",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/",
    "fontePagina": "",
    "fichaHistoria": [
        {
            "titulo": "A igreja de Sant’Ana",
            "texto": "A cronologia relaciona a formação do bairro à construção da igreja e à devoção à padroeira. O ano de 1869 marca o início da obra registrado nesse documento."
        },
        {
            "titulo": "A vida em torno da fábrica",
            "texto": "As historiadoras Maria Aparecida Papali, Valéria Zanetti e Maria José Acedo del Olmo descrevem Santana como o primeiro bairro industrial da cidade. Mulheres e crianças também trabalhavam nas fábricas. Moradia e serviços oferecidos pela tecelagem atendiam os empregados, enquanto ampliavam o controle da empresa sobre sua vida fora do trabalho."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia. Pró-Memória, [s.d.].",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/",
            "trecho": "Entrada de 1869: igreja, formação do bairro e padroeira."
        },
        {
            "referencia": "PAPALI, Maria Aparecida; ZANETTI, Valéria; OLMO, Maria José Acedo del. São José dos Campos e sua história. Pró-Memória, [s.d.].",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/",
            "trecho": "Parágrafos sobre a primeira industrialização, Santana e o trabalho nas fábricas."
        }
    ],
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-altos-santana",
    "nome": "Altos de Santana",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Década de 1980",
    "origemNome": "O nome faz referência a Santana e aos “altos” do terreno. O estudo sobre a formação do bairro não registra quem escolheu essa denominação.",
    "historia": "Altos de Santana foi loteado nos anos 1980, em terras da antiga Fazenda Boa Vista, ao lado do Telespark.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "O bairro visto de cima",
            "texto": "O trabalho de Gabriel Henrique dos Santos Ferreira traz uma fotografia aérea de 1985. Nela, é possível observar o desenho do loteamento nos primeiros anos de sua formação. A imagem está na página 95 do estudo."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "95",
            "paginaPdf": 95,
            "trecho": "Texto sobre a Fazenda Boa Vista e fotografia aérea do Jardim Altos de Santana em 1985 (figura 56)."
        }
    ],
    "fontePagina": "95",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-alto-da-ponte",
    "nome": "Alto da Ponte",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Registrado na década de 1920",
    "origemNome": "“Alto da Ponte” reúne referências ao relevo e a uma travessia. O nome já aparece na relação de bairros dos anos 1920; esse registro não explica a escolha da denominação.",
    "historia": "Alto da Ponte aparece entre os núcleos antigos da região. A urbanização avançou com loteamentos abertos do outro lado do Rio Paraíba, ao norte de Santana.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "Caminhos da região",
            "texto": "Em 2018, a Prefeitura registrou a integração da linha de ônibus do Sertãozinho com outras linhas no Alto da Ponte, na Rua Audemo Veneziani. O bairro é uma referência de acesso para quem se desloca entre essas localidades."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "39",
            "paginaPdf": 39,
            "trecho": "Tabela 3: registro de Alto da Ponte entre os bairros da década de 1920."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Linhas alimentadoras melhoram o transporte coletivo nos bairros. São José dos Campos, 14 set. 2018.",
            "url": "https://www.sjc.sp.gov.br/noticias/2018/setembro/14/linhas-alimentadoras-melhoram-o-transporte-coletivo-nos-bairros/",
            "trecho": "Trecho sobre a linha Sertãozinho–Alto da Ponte."
        }
    ],
    "fontePagina": "39",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-vila-paiva",
    "nome": "Vila Paiva",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "1981 — loteamento",
    "origemNome": "Vila Paiva está registrada com esse nome no estudo da urbanização da cidade. A possível homenagem a uma família Paiva ainda não tem identificação na fonte.",
    "historia": "O loteamento foi aberto em 1981, perto de Altos de Santana e Telespark.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "A abertura do loteamento",
            "texto": "O estudo de Gabriel Henrique dos Santos Ferreira situa Vila Paiva na expansão da Zona Norte dos anos 1980. A data de 1981 se refere ao loteamento, quando a área foi dividida em lotes; ela não informa quando chegaram os primeiros moradores."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "102–103",
            "paginaPdf": 102,
            "trecho": "Trecho que data o loteamento da Vila Paiva em 1981 e situa o bairro na expansão da Zona Norte."
        }
    ],
    "fontePagina": "102–103",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-telespark",
    "nome": "Telespark",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "1959 — loteamento",
    "origemNome": "A denominação registrada é Jardim Telespark. A fonte que data o loteamento não informa de onde veio a palavra Telespark.",
    "historia": "O Jardim Telespark foi loteado em 1959, na região do Alto da Ponte, em uma área até então rural.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "De área rural a loteamento",
            "texto": "A pesquisa da Univap inclui o Telespark entre os loteamentos que ampliaram a ocupação ao norte do Rio Paraíba. O bairro surgiu nessa expansão, depois da abertura de Vila Veneziani e Vila Cândida."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "68",
            "paginaPdf": 68,
            "trecho": "Trecho sobre o loteamento do Jardim Telespark em 1959."
        }
    ],
    "fontePagina": "68",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-vila-nova-sao-jose",
    "nome": "Vila Nova São José",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Loteamento registrado no cadastro municipal",
    "origemNome": "Vila Nova São José é o nome que aparece na planta municipal do loteamento. O documento não informa o motivo da escolha.",
    "historia": "A planta reúne o traçado das ruas e a divisão dos terrenos da Vila Nova São José. É o registro cadastral do bairro disponível no acervo municipal de loteamentos.",
    "curiosidade": "",
    "fonte": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Vila Nova São José: planta de loteamento. São José dos Campos, [s.d.].",
    "fonteUrl": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/nova_sao_jose_vl.pdf",
    "fichaHistoria": [
        {
            "titulo": "A planta do bairro",
            "texto": "A referência abaixo abre a planta original, em uma única página. Ela permite consultar a organização dos lotes. O documento não traz uma data segura de formação nem um relato sobre os primeiros moradores."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Vila Nova São José: planta de loteamento. São José dos Campos, [s.d.].",
            "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/nova_sao_jose_vl.pdf",
            "pagina": "1",
            "paginaPdf": 1,
            "trecho": "Planta cadastral: confirma a denominação e o desenho dos lotes; não identifica a pessoa homenageada."
        }
    ],
    "fontePagina": "1",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-vila-cristina",
    "nome": "Vila Cristina",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "1987 — loteamento",
    "origemNome": "O nome Vila Cristina aparece na planta do loteamento. A identidade da Cristina homenageada não é informada nesse documento nem no estudo consultado.",
    "historia": "Vila Cristina foi loteada em 1987, perto de Santana.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "Um loteamento perto de Santana",
            "texto": "A pesquisa da Univap registra a abertura de Vila Cristina durante a expansão dos anos 1980. A planta municipal, também disponível abaixo, mostra a divisão dos terrenos do bairro."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "102–103",
            "paginaPdf": 102,
            "trecho": "Trecho sobre o loteamento de Vila Cristina em 1987."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Vila Cristina: planta de loteamento. São José dos Campos, [s.d.].",
            "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/cristina_vl.pdf",
            "pagina": "1",
            "paginaPdf": 1,
            "trecho": "Planta cadastral: confirma a denominação e o desenho dos lotes; não identifica a pessoa homenageada."
        }
    ],
    "fontePagina": "102–103",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-vila-dirce",
    "nome": "Vila Dirce",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Bairro citado em estudo sobre a urbanização",
    "origemNome": "Vila Dirce já aparece com esse nome no estudo sobre o crescimento da cidade. A fonte não identifica quem foi Dirce.",
    "historia": "O bairro abriga o mirante José Rosa de Morais, de onde se avista grande parte de São José dos Campos. O espaço fica perto do Parque Alberto Simões.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "O mirante",
            "texto": "Em 2023, a Prefeitura anunciou a revitalização do deck, dos bancos e da área de lazer do mirante. A notícia informa que o acesso ao local é feito a pé."
        },
        {
            "titulo": "Uma área avaliada para moradias",
            "texto": "O estudo da urbanização cita Vila Dirce entre os locais avaliados para o empreendimento que se instalou em Cidade Vista Verde. O terreno foi descartado por causa do relevo."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "88",
            "paginaPdf": 88,
            "trecho": "Trecho sobre a avaliação de terrenos para o empreendimento Cidade Vista Verde."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Mirante da Vila Dirce é opção turística neste feriado em São José. São José dos Campos, 7 jun. 2023.",
            "url": "https://www.sjc.sp.gov.br/noticias/2023/junho/07/mirante-da-vila-dirce-e-opcao-turistica-neste-feriado-em-sao-jose/",
            "trecho": "Localização e descrição do mirante José Rosa de Morais."
        }
    ],
    "fontePagina": "88",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-jardim-guimaraes",
    "nome": "Jardim Guimarães",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "1981 — loteamento",
    "origemNome": "Jardim Guimarães é o nome registrado no estudo sobre os loteamentos da cidade. A fonte não esclarece se Guimarães se refere a uma família ou a um lugar.",
    "historia": "O bairro foi loteado em 1981, perto de Altos de Santana e Telespark. Na Praça da Bica, uma nascente faz parte da história da comunidade.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "A água da Praça da Bica",
            "texto": "Em 2019, a Prefeitura anunciou a revitalização da nascente com apoio do Rotary Club Oeste. A notícia dizia que a mina d’água fazia parte da comunidade havia cerca de 50 anos. A obra incluiu melhorias no acesso, no corrimão e na iluminação, além do plantio de árvores nativas."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "102–103",
            "paginaPdf": 102,
            "trecho": "Trecho que data o loteamento em 1981."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Nascente do Jardim Guimarães recebe revitalização com apoio do Rotary. São José dos Campos, 27 fev. 2019.",
            "url": "https://www.sjc.sp.gov.br/noticias/2019/fevereiro/27/nascente-do-jardim-guimaraes-recebe-revitalizacao-com-apoio-do-rotary/",
            "trecho": "Revitalização da nascente localizada no bairro."
        }
    ],
    "fontePagina": "102–103",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-buquirinha-1",
    "nome": "Buquirinha I",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Nome regional registrado na década de 1920",
    "origemNome": "Buquirinha é um nome antigo da região, presente em registros dos anos 1920. Buquirinha I conserva essa denominação e acrescenta o numeral. A lista antiga não explica a origem da palavra.",
    "historia": "Buquirinha I integra o conjunto de comunidades atendidas pela Estratégia Saúde da Família do Buquirinha desde a ampliação anunciada em 2011.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "Saúde perto de casa",
            "texto": "A notícia de 2011 descreve um atendimento voltado também a moradores distantes das unidades de saúde, pessoas acamadas e famílias sem condições de transporte. Buquirinha I aparece na relação ao lado de outras comunidades da região."
        },
        {
            "titulo": "O nome antigo e o bairro atual",
            "texto": "A relação histórica traz apenas “Buquirinha”, sem numeração. Esse registro comprova a antiguidade do nome regional, mas não estabelece a data de criação do Buquirinha I."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "39",
            "paginaPdf": 39,
            "trecho": "Tabela 3: registro histórico de Buquirinha, sem numeração."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
            "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
            "trecho": "Relação dos bairros atendidos, com Buquirinha I, Buquirinha II e Mirante apresentados separadamente."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura; IPPLAN. Avaliação de áreas de risco do município de São José dos Campos: relatório completo do Plano Municipal de Redução de Risco, fases I e II. São José dos Campos, [s.d.].",
            "url": "https://www.sjc.sp.gov.br/media/xqcpxfrh/pmrr_final_i_e_ii.pdf",
            "pagina": "13",
            "paginaPdf": 13,
            "trecho": "Tabela de datas de mapeamento de 2016; distingue Buquirinha I, Mirante do Buquirinha e Buquirinha II / Pedra D’Água I."
        }
    ],
    "fontePagina": "39",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-buquirinha-2",
    "nome": "Buquirinha II",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Núcleos identificados em documentos municipais",
    "origemNome": "Buquirinha II leva o nome antigo da região, acrescido do numeral. Os documentos municipais o identificam separadamente do Mirante do Buquirinha.",
    "historia": "Buquirinha II aparece na relação de comunidades atendidas pela Estratégia Saúde da Família em 2011. No levantamento municipal de 2016, a área foi registrada como “Buquirinha II / Pedra D’Água I”.",
    "curiosidade": "",
    "fonte": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
    "fonteUrl": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
    "fichaHistoria": [
        {
            "titulo": "O bairro nos registros municipais",
            "texto": "A Prefeitura inclui Buquirinha II na área de atendimento de saúde do Buquirinha. O Plano Municipal de Redução de Risco registra um levantamento no local em 4 de outubro de 2016. Essa data é a da visita técnica, não a da fundação do bairro."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
            "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
            "trecho": "Relação dos bairros atendidos, com Buquirinha I, Buquirinha II e Mirante apresentados separadamente."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura; IPPLAN. Avaliação de áreas de risco do município de São José dos Campos: relatório completo do Plano Municipal de Redução de Risco, fases I e II. São José dos Campos, [s.d.].",
            "url": "https://www.sjc.sp.gov.br/media/xqcpxfrh/pmrr_final_i_e_ii.pdf",
            "pagina": "13",
            "paginaPdf": 13,
            "trecho": "Tabela de datas de mapeamento de 2016; distingue Buquirinha I, Mirante do Buquirinha e Buquirinha II / Pedra D’Água I."
        }
    ],
    "fontePagina": "",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-mirante-buquirinha",
    "nome": "Mirante do Buquirinha",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Núcleos identificados em documentos municipais",
    "origemNome": "Mirante do Buquirinha conserva o nome regional Buquirinha. A Prefeitura o registra como uma comunidade própria, separada de Buquirinha I e II.",
    "historia": "O Rio Buquira faz parte do cotidiano do Mirante. Em março de 2024, o transbordamento do rio alagou o bairro, segundo a Prefeitura.",
    "curiosidade": "",
    "fonte": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
    "fonteUrl": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
    "fichaHistoria": [
        {
            "titulo": "O rio e as moradias",
            "texto": "A notícia sobre as chuvas de março de 2024 cita o Mirante do Buquirinha entre os bairros atingidos, junto de Taquari e Costinha. O Mirante também aparece separadamente na relação de atendimento de saúde de 2011 e no levantamento municipal de áreas de risco de 2016."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
            "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
            "trecho": "Relação dos bairros atendidos, com Buquirinha I, Buquirinha II e Mirante apresentados separadamente."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura; IPPLAN. Avaliação de áreas de risco do município de São José dos Campos: relatório completo do Plano Municipal de Redução de Risco, fases I e II. São José dos Campos, [s.d.].",
            "url": "https://www.sjc.sp.gov.br/media/xqcpxfrh/pmrr_final_i_e_ii.pdf",
            "pagina": "13",
            "paginaPdf": 13,
            "trecho": "Tabela de datas de mapeamento de 2016; distingue Buquirinha I, Mirante do Buquirinha e Buquirinha II / Pedra D’Água I."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. São Francisco Xavier recebe manutenção e libera estradas. São José dos Campos, 7 mar. 2024.",
            "url": "https://www.sjc.sp.gov.br/noticias/2024/marco/07/sao-francisco-xavier-recebe-manutencao-e-libera-estradas/",
            "trecho": "Transbordamento do Rio Buquira e intervenções nas estradas, incluindo Pouso Frio."
        }
    ],
    "fontePagina": "",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-freitas",
    "nome": "Bairro dos Freitas",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Registrado na década de 1920",
    "origemNome": "O nome Freitas já aparece na lista de bairros dos anos 1920. A forma “Bairro dos Freitas” sugere uma referência familiar, mas o registro não identifica as pessoas que deram nome ao lugar.",
    "historia": "Freitas está entre os bairros antigos registrados no município. Em 2011, a Prefeitura o incluiu na área atendida pelas equipes de saúde do Buquirinha.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "Atendimento na região",
            "texto": "A ampliação da Estratégia Saúde da Família levou atendimento a comunidades mais afastadas das unidades de saúde. O Bairro dos Freitas aparece na mesma relação que Água Soca, Taquari e Costinha."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "39",
            "paginaPdf": 39,
            "trecho": "Tabela 3: entrada Freitas na relação da década de 1920."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
            "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
            "trecho": "Relação dos bairros atendidos, com Buquirinha I, Buquirinha II e Mirante apresentados separadamente."
        }
    ],
    "fontePagina": "39",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-costinha",
    "nome": "Costinha",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Comunidade identificada em registros municipais",
    "origemNome": "Costinha é a denominação usada nos registros municipais. A origem do nome não está explicada nas fontes reunidas aqui.",
    "historia": "Uma homenagem local lembra Joel Pinto de Araújo, que trabalhou na Tecelagem Parahyba, distribuiu leite na região e participou do futebol amador.",
    "curiosidade": "",
    "fonte": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Joel Araújo é rua no Costinha. São José dos Campos, 6 dez. 2013.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/noticias/2373/joel-araujo-e-rua-no-costinha",
    "fichaHistoria": [
        {
            "titulo": "A homenagem a Joel",
            "texto": "Em dezembro de 2013, a Câmara noticiou a aprovação de uma proposta para dar o nome de Joel Pinto de Araújo à praça no fim da travessa Hercílio Rodrigues. Ele foi diretor do Frigorífico FC e morreu em 2008. O título da notícia fala em rua; o corpo do texto identifica uma praça."
        },
        {
            "titulo": "O Rio Buquira",
            "texto": "Costinha foi um dos bairros atingidos pelo transbordamento do Rio Buquira em março de 2024, segundo a Prefeitura."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Joel Araújo é rua no Costinha. São José dos Campos, 6 dez. 2013.",
            "url": "https://www.camarasjc.sp.gov.br/noticias/2373/joel-araujo-e-rua-no-costinha",
            "trecho": "Corpo da notícia: proposta de denominação de praça e trajetória do homenageado."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. São Francisco Xavier recebe manutenção e libera estradas. São José dos Campos, 7 mar. 2024.",
            "url": "https://www.sjc.sp.gov.br/noticias/2024/marco/07/sao-francisco-xavier-recebe-manutencao-e-libera-estradas/",
            "trecho": "Transbordamento do Rio Buquira e intervenções nas estradas, incluindo Pouso Frio."
        }
    ],
    "fontePagina": "",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-bonsucesso",
    "nome": "Bonsucesso",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Registrado na década de 1920",
    "origemNome": "A lista de bairros dos anos 1920 registra “Bom Sucesso”. A comunidade tem uma capela dedicada a Nossa Senhora do Bonsucesso. A fonte não esclarece se a devoção deu nome ao lugar ou se o bairro já se chamava assim.",
    "historia": "Bonsucesso aparece nos registros antigos do município e é identificado pela Prefeitura como uma comunidade da área rural da região norte.",
    "curiosidade": "",
    "fonte": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
    "fichaHistoria": [
        {
            "titulo": "Um encontro na capela",
            "texto": "Em maio de 2018, moradores se reuniram no salão paroquial da Capela Nossa Senhora do Bonsucesso para discutir o Plano Diretor. Mais de 60 pessoas participaram do encontro, segundo a notícia municipal."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "39",
            "paginaPdf": 39,
            "trecho": "Tabela 3: entrada Bom Sucesso."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Moradores discutem Plano Diretor no Novo Horizonte e Bonsucesso. São José dos Campos, 12 maio 2018.",
            "url": "https://www.sjc.sp.gov.br/noticias/2018/maio/12/moradores-discutem-plano-diretor-no-novo-horizonte-e-bonsucesso/",
            "trecho": "Localização rural do bairro e encontro no salão da Capela Nossa Senhora do Bonsucesso."
        }
    ],
    "fontePagina": "39",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-turvo",
    "nome": "Turvo",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Registrado na década de 1920",
    "origemNome": "Turvo é um nome da região registrado desde a década de 1920. A antiga Usina do Turvo também o recebeu. As fontes reunidas aqui não explicam a origem da denominação.",
    "historia": "A Usina do Turvo participou do início do abastecimento elétrico da cidade. Ela foi desativada depois que a Light adquiriu a empresa, em 1928.",
    "curiosidade": "",
    "fonte": "SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. Usina do Turvo. Estudo Patrimônio Perdido: o passado em ruínas (FCCR, 2004). São José dos Campos, [s.d.].",
    "fonteUrl": "https://www.sjcantigamente.com.br/usina-do-turvo/",
    "fichaHistoria": [
        {
            "titulo": "A casa de força",
            "texto": "O estudo da Fundação Cultural Cassiano Ricardo reúne imagens da usina em 1922 e das ruínas em 2003, no bairro do Turvo, na Estrada do Bom Sucesso. O texto foi publicado no site São José dos Campos Antigamente, com os créditos dos pesquisadores e do Departamento de Patrimônio Histórico da Fundação."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. Usina do Turvo. Estudo Patrimônio Perdido: o passado em ruínas (FCCR, 2004). São José dos Campos, [s.d.].",
            "url": "https://www.sjcantigamente.com.br/usina-do-turvo/",
            "trecho": "Reprodução identificada do estudo do Departamento de Patrimônio Histórico da FCCR."
        },
        {
            "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2024.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
            "pagina": "39",
            "paginaPdf": 39,
            "trecho": "Tabela 3: entrada Turvo."
        }
    ],
    "fontePagina": "",
    "contextoFonte": "O Pró-Memória de São José dos Campos é um núcleo de pesquisa e um acervo público de história da cidade, resultado da parceria entre a Câmara Municipal, a Fundação Cultural Cassiano Ricardo e a Univap, por meio de sua mantenedora, a Fundação Valeparaibana de Ensino.",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-pouso-frio",
    "nome": "Pouso Frio",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Localidade e estrada registradas pelo município",
    "origemNome": "O nome Pouso Frio permanece na denominação da estrada que atende a localidade. As fontes consultadas não confirmam a história de que ali havia uma parada de tropeiros.",
    "historia": "Pouso Frio aparece nos registros de manutenção das estradas de São Francisco Xavier. Em março de 2024, a Prefeitura retirou barreiras da via após chuvas que provocaram deslizamentos na região.",
    "curiosidade": "",
    "fonte": "SÃO JOSÉ DOS CAMPOS. Prefeitura. São Francisco Xavier recebe manutenção e libera estradas. São José dos Campos, 7 mar. 2024.",
    "fonteUrl": "https://www.sjc.sp.gov.br/noticias/2024/marco/07/sao-francisco-xavier-recebe-manutencao-e-libera-estradas/",
    "fichaHistoria": [
        {
            "titulo": "A estrada do Pouso Frio",
            "texto": "A notícia municipal relaciona a estrada às vias desobstruídas em São Francisco Xavier. Ela documenta o trabalho de acesso à localidade após as chuvas. A referência territorial é o distrito de São Francisco Xavier."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. São Francisco Xavier recebe manutenção e libera estradas. São José dos Campos, 7 mar. 2024.",
            "url": "https://www.sjc.sp.gov.br/noticias/2024/marco/07/sao-francisco-xavier-recebe-manutencao-e-libera-estradas/",
            "trecho": "Transbordamento do Rio Buquira e intervenções nas estradas, incluindo Pouso Frio."
        }
    ],
    "fontePagina": "",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-aguas-canindu",
    "nome": "Águas do Canindu",
    "regiaoId": "norte",
    "regiaoNome": "Zona Norte",
    "periodo": "Regularização documentada desde 2022",
    "origemNome": "A Prefeitura usa a denominação Águas de Canindu. As notícias sobre o bairro não explicam a origem de Canindu.",
    "historia": "A regularização dos terrenos faz parte da história recente do bairro. Em 2022, a Prefeitura anunciou visitas às casas e cadastramento de moradores em parte da comunidade, em parceria com o programa estadual Cidade Legal.",
    "curiosidade": "",
    "fonte": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Regularização do Águas de Canindu entra em nova etapa. São José dos Campos, 8 fev. 2022.",
    "fonteUrl": "https://www.sjc.sp.gov.br/noticias/2022/fevereiro/08/regularizacao-do-aguas-de-canindu-entra-em-nova-etapa/",
    "fichaHistoria": [
        {
            "titulo": "O processo de regularização",
            "texto": "Em fevereiro de 2026, a Prefeitura anunciou um ponto de apoio para moradores de Águas de Canindu e Chácaras Havaí. A notícia previa levantamento dos lotes e estudos ambientais antes da titulação. O processo ainda estava em andamento na ocasião."
        }
    ],
    "fontesRevisadas": [
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Regularização do Águas de Canindu entra em nova etapa. São José dos Campos, 8 fev. 2022.",
            "url": "https://www.sjc.sp.gov.br/noticias/2022/fevereiro/08/regularizacao-do-aguas-de-canindu-entra-em-nova-etapa/",
            "trecho": "Regularização parcial e visitas domiciliares."
        },
        {
            "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Ponto de apoio tira dúvidas sobre regularização no Canindu e Havaí. São José dos Campos, 6 fev. 2026.",
            "url": "https://www.sjc.sp.gov.br/noticias/2026/fevereiro/06/ponto-de-apoio-tira-duvidas-sobre-regularizacao-no-canindu-e-havai/",
            "trecho": "Ponto de atendimento e próximas etapas anunciadas, sem afirmar titulação concluída."
        }
    ],
    "fontePagina": "",
    "tituloOrigem": "Sobre o nome"
},
  {
    "id": "bairro-satelite",
    "nome": "Jardim Satélite",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1960 / 1970",
    "origemNome": "Inspirado na corrida espacial e na vocação aeroespacial da cidade; ruas batizadas com nomes de astros e constelações.",
    "historia": "Antiga fazenda de gado leiteiro que foi loteada nos anos 60. A instalação da fábrica da São Paulo Alpargatas em 1960 acelerou a chegada de milhares de trabalhadores.",
    "curiosidade": "Possui as avenidas Andrômeda, Cassiopeia e Perseu, constituindo o maior centro comercial a céu aberto da Zona Sul.",
    "fonte": "Pró-Memória SJC / SJC Antigamente",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-floradas-sao-jose",
    "nome": "Floradas de São José",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1980 / 1990",
    "origemNome": "Alusão à arborização florida planejada no paisagismo dos canteiros e praças.",
    "historia": "Bairro residencial planejado contíguo ao Jardim Satélite, com condomínios de médio e alto padrão e ampla rede de comércio.",
    "curiosidade": "Abriga o Vale Sul Shopping (antigo Shopping Colavep), um dos maiores polos comerciais da Região Metropolitana do Vale.",
    "fonte": "Associação Comercial de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-bosque-eucaliptos",
    "nome": "Bosque dos Eucaliptos",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1970",
    "origemNome": "Referência às grandes plantações de eucalipto cultivadas para celulose antes da urbanização.",
    "historia": "Loteado nos anos 70 para acolher técnicos e metalúrgicos das indústrias da Via Dutra, tornou-se um dos bairros mais arborizados e com vida própria da Zona Sul.",
    "curiosidade": "A Avenida Salinas e a Praça Floripes Bicudo são centros vibrantes de feiras livres e esportes ao ar livre.",
    "fonte": "Pró-Memória Câmara SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-parque-industrial",
    "nome": "Parque Industrial",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1960",
    "origemNome": "Planejado inicialmente para abrigar indústrias leves ao longo da Dutra, consolidou-se como bairro estritamente residencial.",
    "historia": "Um dos bairros mais tradicionais e valorizados da Zona Sul, com praças largas, o Hospital Regional e o complexo da Johnson & Johnson no entorno.",
    "curiosidade": "A Praça Dom Pedro II no centro do bairro é ponto de encontro tradicional de famílias e eventos culturais.",
    "fonte": "SJC Antigamente",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-jardim-oriente",
    "nome": "Jardim Oriente",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1958",
    "origemNome": "Homenagem aos imigrantes japoneses e à fundação da fábrica da Kanebo do Brasil (fiação e tecelagem nipônica).",
    "historia": "Glebas rurais loteadas pelo pioneiro Torataro Takitani para acolher as famílias operárias da Kanebo e de outras manufaturas.",
    "curiosidade": "Sede do Shopping Jardim Oriente, construído nas instalações restauradas da antiga fábrica Kanebo.",
    "fonte": "Diocese de SJC / Acervo Histórico Kanebo",
    "fonteUrl": "https://www.diocese-sjc.org.br/"
  },
  {
    "id": "bairro-jardim-america",
    "nome": "Jardim América",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1938 / 1960",
    "origemNome": "Denominado originalmente de Colônia Paraíso e mais tarde renomeado em homenagem ao continente americano.",
    "historia": "Bairro estratégico que faz a ligação entre o Centro e a Zona Sul. Nos anos 1970 recebeu o famoso Pavilhão de Eventos, hoje o Centro da Juventude.",
    "curiosidade": "O Centro da Juventude com projeto arquitetônico moderno e pista de skate é um dos maiores pontos de lazer municipal.",
    "fonte": "Prefeitura de SJC / Pró-Memória",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-portugal",
    "nome": "Jardim Portugal",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1970",
    "origemNome": "Homenagem à comunidade de imigrantes e descendentes portugueses estabelecidos em São José dos Campos.",
    "historia": "Loteamento residencial de casas térreas e sobrados com ruas batizadas em homenagem a cidades lusitanas como Coimbra, Lisboa e Porto.",
    "curiosidade": "Vizinho ao Bosque dos Eucaliptos e Parque Industrial, é um dos bairros mais silenciosos da região.",
    "fonte": "Câmara Municipal SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/"
  },
  {
    "id": "bairro-31-de-marco",
    "nome": "Conjunto Residencial 31 de Março",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1968 / 1970",
    "origemNome": "Data de fundação institucional do núcleo habitacional financiado pelo BNH (Banco Nacional da Habitação).",
    "historia": "Primeiro grande conjunto habitacional planejado da Zona Sul, construído para atender à demanda de moradia popular para operários industriais.",
    "curiosidade": "Possui praças centrais, centro comunitário ativo e ruas com forte arborização consolidada.",
    "fonte": "Acervo Cohab / BNH",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-cruzeiro-do-sul",
    "nome": "Jardim Cruzeiro do Sul",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1970",
    "origemNome": "Alusão à constelação símbolo do Hemisfério Sul, em consonância com a toponímia astronômica da região.",
    "historia": "Loteamento popular contíguo ao Jardim Satélite, caracterizado por comércio de proximidade e forte identidade comunitária.",
    "curiosidade": "Integra o polo de prestadores de serviços automotivos e reformas da Zona Sul.",
    "fonte": "Secretaria de Urbanismo SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-palmeiras-sao-jose",
    "nome": "Palmeiras de São José",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1980",
    "origemNome": "Presença de palmeiras imperiais e jerivás plantados no projeto urbanístico inicial.",
    "historia": "Bairro residencial planejado vizinho ao Parque Industrial, com fácil acesso ao Anel Viário e à Via Dutra.",
    "curiosidade": "Bairro com traçado viário organizado em bolsões residenciais com baixo fluxo de veículos pesados.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-estoril",
    "nome": "Jardim Estoril",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1970",
    "origemNome": "Nome inspirado na famosa estância balnear portuguesa de Estoril.",
    "historia": "Loteamento de padrão intermediário entre o Bosque dos Eucaliptos e o Jardim Oriente, com escolas e praças de vizinhança.",
    "curiosidade": "Concentra clínicas odontológicas, academias e escolas infantis tradicionais da Zona Sul.",
    "fonte": "Câmara Municipal SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-madureira",
    "nome": "Jardim Madureira",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1970",
    "origemNome": "Homenagem aos antigos proprietários de chácaras de cultivo de café e pecuária.",
    "historia": "Pequeno enclave residencial calmo situado entre as grandes avenidas da Zona Sul.",
    "curiosidade": "Preserva características de vila familiar onde vizinhos residem há várias gerações.",
    "fonte": "Prefeitura — relação oficial de bairros da Casa do Idoso Norte",
    "fonteUrl": "https://siteprefeitura.sjc.gov.br/transicao/SASC/ANEXO%203%20-%20Diretoria%20Administrativa/Editais%20de%20Chamamento/EC%202017/EC%2009%202017%20casa%20idoso%20norte.pdf"
  },
  {
    "id": "bairro-campo-dos-alemaes",
    "nome": "Campo dos Alemães",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1906 / 1984",
    "origemNome": "Em 1906 a Companhia de Extração Tanífera Alemã estocava materiais e árvores de acácia na área ao longo da ferrovia.",
    "historia": "Na década de 1980 tornou-se o maior loteamento de habitação de interesse social da cidade. É hoje um polo de juventude, cultura hip-hop e arte urbana reconhecido nacionalmente.",
    "curiosidade": "O Parque Ribeirão Vermelho no bairro é um dos mais modernos complexos públicos de lazer e piscinas de São José dos Campos.",
    "fonte": "Pró-Memória Univap / FCCR",
    "fonteUrl": "https://www.univap.br/"
  },
  {
    "id": "bairro-dom-pedro-1",
    "nome": "Conjunto Habitacional Dom Pedro I",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1982",
    "origemNome": "Homenagem ao primeiro Imperador do Brasil e artífice da Independência de 1822.",
    "historia": "Conjunto construído pela CDHU/Prefeitura para famílias de trabalhadores industriais e prestadores de serviços da Zona Sul.",
    "curiosidade": "Famoso pelo intenso comércio de calçadas, padarias e feiras comunitárias.",
    "fonte": "CDHU / Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-dom-pedro-2",
    "nome": "Conjunto Habitacional Dom Pedro II",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1986",
    "origemNome": "Homenagem a Dom Pedro II, monarca que incentivou as ferrovias e a ciência no Vale do Paraíba.",
    "historia": "Segunda etapa do complexo habitacional do Dom Pedro, ampliou a malha viária e as escolas estaduais da região.",
    "curiosidade": "Possui forte tradição em futebol de várzea e projetos esportivos de base.",
    "fonte": "Secretaria de Habitação SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-parque-interlagos",
    "nome": "Parque Interlagos",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1985 (22 de Setembro)",
    "origemNome": "Presença de lagoas naturais formadas na bacia do Rio Comprido (Fazenda Aymoré).",
    "historia": "Inaugurado oficialmente em 22 de setembro de 1985 nas terras da antiga Fazenda Aymoré. Inicialmente planejado como loteamento fechado, consolidou-se como bairro popular.",
    "curiosidade": "A Lagoa Ayrton Senna da Silva no coração do bairro é um cartão-postal de lazer, pesca e caminhadas da comunidade.",
    "fonte": "Acervo Histórico SJC / Wikipedia",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-cidade-morumbi",
    "nome": "Cidade Morumbi",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1980",
    "origemNome": "Origem tupi mbyra-mbi (colina verdejante / morro redondo).",
    "historia": "Um dos bairros mais populosos e dinâmicos de São José dos Campos, estruturado ao longo da antiga Estrada Velha Rio-São Paulo.",
    "curiosidade": "Abriga um exemplar centenário da árvore Guapuruvu tombado por lei como patrimônio histórico e ambiental municipal.",
    "fonte": "Conselho Municipal de Preservação (COMPHAC)",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-colonial",
    "nome": "Jardim Colonial",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1980",
    "origemNome": "Referência estilística ao período colonial brasileiro e ao traçado das vilas históricas.",
    "historia": "Bairro comercialmente muito forte na Zona Sul, famoso por atrair milhares de pessoas de toda a região metropolitana para compras de produtos populares.",
    "curiosidade": "Sede da tradicionalíssima Feira do Colonial aos domingos, uma das maiores feiras de rua do Vale do Paraíba.",
    "fonte": "Prefeitura — Decreto Municipal nº 18.812/2021",
    "fonteUrl": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/2021/DE_2021_00018812.pdf"
  },
  {
    "id": "bairro-jardim-imperial",
    "nome": "Jardim Imperial",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1990",
    "origemNome": "Denominação que remete ao período do Império do Brasil, vizinho ao Colonial e Dom Pedro.",
    "historia": "Expansão imobiliária que atendeu à crescente classe trabalhadora da Zona Sul nos anos 90 com comércio diversificado.",
    "curiosidade": "Ponto de confluência de novas linhas de transporte coletivo e ciclovias integradas.",
    "fonte": "Secretaria de Transportes SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-bosque-dos-ipes",
    "nome": "Bosque dos Ipês",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "1998",
    "origemNome": "Planejamento ambiental com plantio maciço de ipês-amarelos e ipês-roxos em suas alamedas.",
    "historia": "Loteado no final dos anos 1990 com foco em famílias jovens e condomínios de sobrados contemporâneos.",
    "curiosidade": "A florada anual dos ipês no inverno transforma as ruas do bairro em atração visual.",
    "fonte": "MHK Construtora / Prefeitura SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-parque-uniao",
    "nome": "Parque União",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1980",
    "origemNome": "Simboliza a união das famílias fundadoras e da associação de moradores na conquista de asfalto e água tratada.",
    "historia": "Núcleo de ocupação popular autoconstruída com sólidas redes de cooperação comunitária.",
    "curiosidade": "Mantém uma das mais antigas associações comunitárias ativas da Zona Sul.",
    "fonte": "Pró-Memória Univap",
    "fonteUrl": "https://www.univap.br/"
  },
  {
    "id": "bairro-pinheirinho-palmares",
    "nome": "Pinheirinho dos Palmares",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "2016",
    "origemNome": "Homenagem à luta por moradia das famílias do antigo Pinheirinho e ao Quilombo dos Palmares.",
    "historia": "Bairro planejado inaugurado em dezembro de 2016 com 1.461 unidades habitacionais do programa Minha Casa Minha Vida no extremo sul da cidade.",
    "curiosidade": "Conjunto modelo com escolas de tempo integral, UBS e áreas de preservação ambiental no entorno.",
    "fonte": "Ministério das Cidades / Prefeitura SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-torrao-de-ouro",
    "nome": "Torrão de Ouro",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1970",
    "origemNome": "Alusão à fertilidade do solo argiloso e avermelhado das antigas fazendas de café.",
    "historia": "Área de transição rural-urbana na bacia do Rio Comprido que se consolidou com chácaras e pequenas residências familiares.",
    "curiosidade": "Próximo à divisa com Jacareí e rodeado por áreas verdes de preservação.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-chacaras-reunidas",
    "nome": "Chácaras Reunidas",
    "regiaoId": "sul",
    "regiaoNome": "Zona Sul",
    "periodo": "Anos 1950 / 1970",
    "origemNome": "Unificação de dezenas de pequenas chácaras agrícolas situadas entre a Via Dutra e a antiga ferrovia.",
    "historia": "Transformou-se no maior polo de pequenas e médias indústrias metalmecânicas, usinagem e logística de São José dos Campos.",
    "curiosidade": "Concentra mais de 500 empresas fornecedoras da cadeia aeroespacial, automotiva e de serviços pesados.",
    "fonte": "CIESM / Associação Comercial de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-eugenio-melo",
    "nome": "Eugênio de Melo (Distrito)",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "1877 (Inauguração da Estação Ferroviária)",
    "origemNome": "Homenagem ao engenheiro militar Eugênio Adriano Pereira da Cunha e Mello, diretor da Estrada de Ferro Central do Brasil.",
    "historia": "Originalmente chamada Vila de Nossa Senhora dos Cafezais. Desenvolveu-se no ciclo do café ao redor da estação férrea de 1877. Elevado a Distrito em 1934.",
    "curiosidade": "Sede do Parque Tecnológico de São José dos Campos e da histórica Casa de Cultura Rancho do Tropeiro.",
    "fonte": "Pró-Memória Câmara SJC / FCCR",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-galo-branco",
    "nome": "Galo Branco",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Século XIX / Anos 1960",
    "origemNome": "Antiga venda e pouso de tropeiros cujo símbolo era um cata-vento em formato de galo branco de lata.",
    "historia": "Ponto de travessia do café e de tropeiros na divisa com Caçapava, tornou-se grande polo residencial operário com a chegada da General Motors nos anos 50.",
    "curiosidade": "Conserva tradição centenária de festas juninas e celebrações tropeiras.",
    "fonte": "FCCR / História Oral",
    "fonteUrl": "https://fccr.sp.gov.br/"
  },
  {
    "id": "bairro-vista-verde",
    "nome": "Cidade Vista Verde",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "1970",
    "origemNome": "Referência à vista panorâmica e ao traçado urbanístico de Cidade-Jardim repleto de praças verdes.",
    "historia": "Planejado e construído nos anos 70 para abrigar engenheiros e técnicos qualificados da Refinaria Henrique Lage (Revap) e da General Motors.",
    "curiosidade": "Projetado com ruas sem saída (cul-de-sac) que convergem para praças circulares ajardinadas.",
    "fonte": "Acervo Petrobras / SJC Antigamente",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-novo-horizonte",
    "nome": "Parque Novo Horizonte",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "1978 (24 de Setembro)",
    "origemNome": "Idealizado pelo líder sindical Pedro Rocha (Sintricom) como um novo horizonte de moradia digna para os operários da construção civil.",
    "historia": "Inaugurado em 24 de setembro de 1978 na antiga Fazenda Santa Emília com cerca de 500 lotes. É o coração pulsante e cultural da Zona Leste.",
    "curiosidade": "Todas as suas ruas têm nomes de profissões (ex: Rua dos Pedreiros, Rua dos Eletricistas) e celebra a famosa Festa do Trabalhador todo 1º de Maio.",
    "fonte": "Sintricom / Wikipedia / Câmara SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/"
  },
  {
    "id": "bairro-santa-herminia",
    "nome": "Santa Hermínia",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1980",
    "origemNome": "Homenagem a Hermínia, matriarca da família proprietária da fazenda que originou o loteamento.",
    "historia": "Bairro popular que se expandiu paralelamente ao Novo Horizonte e Jardim Mariana na Zona Leste.",
    "curiosidade": "Forte presença de pequenas padarias, serralherias e iniciativas comunitárias de bairro.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-mariana",
    "nome": "Jardim Mariana I & II",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1980",
    "origemNome": "Denominação em homenagem a Mariana, figura benfeitora das primeiras famílias moradoras da gleba.",
    "historia": "Loteamento residencial de trabalhadores que atuam no Parque Tecnológico, GM e indústrias automotivas.",
    "curiosidade": "Conectado diretamente pela Avenida Tancredo Neves e corredor viário da Zona Leste.",
    "fonte": "Secretaria de Urbanismo SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-sao-judas-tadeu",
    "nome": "São Judas Tadeu",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1960",
    "origemNome": "Invocação ao Santo das Causas Impossíveis, padroeiro da capela comunitária erguida pelos moradores.",
    "historia": "Situado entre a Avenida Pedro Friggi e o campus do DCTA, acolheu operários e militares na expansão dos anos 60.",
    "curiosidade": "A Paróquia São Judas Tadeu é centro de grandes peregrinações anuais em 28 de outubro.",
    "fonte": "Diocese de SJC",
    "fonteUrl": "https://www.diocese-sjc.org.br/"
  },
  {
    "id": "bairro-jardim-cerejeiras",
    "nome": "Jardim Cerejeiras",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1980",
    "origemNome": "Extensão do conceito floral do Novo Horizonte com ruas batizadas em homenagem a datas comemorativas das profissões.",
    "historia": "Desenvolveu-se em continuidade física com o Parque Novo Horizonte, formando um dos maiores eixos residenciais da cidade.",
    "curiosidade": "Diferente do Novo Horizonte que tem nomes de profissões, o Cerejeiras traz os dias das profissões (ex: Rua Dia do Professor).",
    "fonte": "Pró-Memória Univap",
    "fonteUrl": "https://www.univap.br/"
  },
  {
    "id": "bairro-vila-tatetuba",
    "nome": "Vila Tatetuba",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "1953 (19 de Abril)",
    "origemNome": "Origem tupi taitetu-yba (lugar dos caititus / porcos-do-mato) e antiga olaria colonial.",
    "historia": "Loteado oficialmente em 19 de abril de 1953 com o impulso da construção da Via Dutra. Na região foram encontradas urnas funerárias indígenas pré-coloniais.",
    "curiosidade": "Sede da tradicional Sociedade Amigos de Bairro e polo histórico de indústrias cerâmicas.",
    "fonte": "Diego Del Passo / Pró-Memória SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-vila-tesouro",
    "nome": "Vila Tesouro",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1950",
    "origemNome": "Lenda popular transmitida por antigos tropeiros sobre moedas de ouro enterradas na rota colonial.",
    "historia": "Loteado no auge da industrialização da Zona Leste para acolher operários e migrantes de várias partes do Brasil.",
    "curiosidade": "Sede de projetos culturais da FCCR e espaço de preservação da memória operária da cidade.",
    "fonte": "FCCR / Fundação Cultural Cassiano Ricardo",
    "fonteUrl": "https://fccr.sp.gov.br/"
  },
  {
    "id": "bairro-vila-industrial",
    "nome": "Vila Industrial",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "1920 / 1950",
    "origemNome": "Vocação fabril pioneira da cidade, abrigando fábricas de louça, tecidos e oficinas da Estrada de Ferro.",
    "historia": "Coração histórico da classe operária de São José dos Campos. Tornou-se sede do Hospital Municipal, do Tiro de Guerra e do lendário Estádio Martins Pereira.",
    "curiosidade": "Abriga o Estádio Martins Pereira (1970), templo do futebol joseense onde jogou a Águia do Vale (São José EC).",
    "fonte": "Pró-Memória SJC / SJC Antigamente",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-santa-ines",
    "nome": "Jardim Santa Inês I & II",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1980",
    "origemNome": "Invocação a Santa Inês, padroeira da capela comunitária erguida nos primeiros anos de ocupação.",
    "historia": "Bairro no extremo leste que cresceu com a chegada de trabalhadores de serviços e do Parque Tecnológico.",
    "curiosidade": "Possui forte identidade de vizinhança e praça com pista de caminhada e academia ao ar livre.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-coqueiro",
    "nome": "Jardim Coqueiro",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1970",
    "origemNome": "Presença de coqueiros e palmeiras na antiga propriedade rural desmembrada.",
    "historia": "Pequeno loteamento residencial da Zona Leste vizinho à Vila Tesouro e Tatetuba.",
    "curiosidade": "Conhecido por suas oficinas mecânicas especializadas e comércio de peças.",
    "fonte": "Secretaria de Planejamento Urbano",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-motorama",
    "nome": "Jardim Motorama",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1970",
    "origemNome": "Inspirado na era do automobilismo e na proximidade com a Via Dutra e a fábrica da GM.",
    "historia": "Bairro residencial planejado com praças arborizadas, escolas municipais e fácil acesso à Avenida Pedro Friggi.",
    "curiosidade": "A Praça Matriz do Motorama é famosa pelos quiosques gastronômicos e encontros de carros clássicos.",
    "fonte": "Câmara Municipal SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-diamante",
    "nome": "Jardim Diamante",
    "regiaoId": "leste",
    "regiaoNome": "Zona Leste",
    "periodo": "Anos 1980",
    "origemNome": "Toponímia alusiva a pedras preciosas, conferindo padrão de valorização ao loteamento.",
    "historia": "Bairro residencial calmo situado entre o Vista Verde e o Motorama.",
    "curiosidade": "Possui bolsões exclusivamente residenciais com praças bem cuidadas pelos próprios moradores.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-granja",
    "nome": "Jardim da Granja",
    "regiaoId": "sudeste",
    "regiaoNome": "Zona Sudeste",
    "periodo": "1975",
    "origemNome": "Antigas granjas avícolas que ocupavam a região (Granja Itambi foi a última a resistir).",
    "historia": "Povoado nos anos 70 para atender engenheiros e técnicos da EMBRAER, INPE e CTA estabelecidos na Avenida dos Astronautas.",
    "curiosidade": "Bairro com comércio gastronômico muito tradicional e proximidade imediata com o Aeroporto Internacional.",
    "fonte": "Pró-Memória Univap / Embraer",
    "fonteUrl": "https://www.univap.br/"
  },
  {
    "id": "bairro-jardim-uira",
    "nome": "Jardim Uirá",
    "regiaoId": "sudeste",
    "regiaoNome": "Zona Sudeste",
    "periodo": "Anos 1980",
    "origemNome": "Origem no tupi guyra/uira (pássaro / o que voa), simbolizando a vocação aeronáutica local.",
    "historia": "Bairro residencial nobre da Região Sudeste, vizinho ao complexo aeroespacial e amplamente arborizado.",
    "curiosidade": "Abriga o tradicional Restaurante Trairão e residências de oficiais e pesquisadores do ITA/DCTA.",
    "fonte": "SJC Antigamente",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-dcta-acacias",
    "nome": "DCTA / Vila das Acácias",
    "regiaoId": "sudeste",
    "regiaoNome": "Zona Sudeste",
    "periodo": "1950",
    "origemNome": "Departamento de Ciência e Tecnologia Aeroespacial e vilas militares planejadas com acácias floridas.",
    "historia": "Campus do DCTA/ITA projetado pelo arquiteto Oscar Niemeyer sob coordenação do Marechal Casimiro Montenegro Filho a partir de 1950.",
    "curiosidade": "Complexo tombado pelo IPHAN como patrimônio arquitetônico e berço da engenharia aeronáutica e espacial brasileira.",
    "fonte": "IPHAN / Acervo Histórico DCTA/ITA",
    "fonteUrl": "http://www.ita.br/"
  },
  {
    "id": "bairro-putim",
    "nome": "Putim",
    "regiaoId": "sudeste",
    "regiaoNome": "Zona Sudeste",
    "periodo": "Século XIX / Anos 1970",
    "origemNome": "Origem toponímica na histórica Fazenda do Putim e na bacia do Córrego Putim-Alambari.",
    "historia": "Antigo entreposto rural de ligação com a Serra do Mar e Litoral Norte. Tornou-se um dos principais eixos de expansão habitacional com a Rodovia dos Tamoios.",
    "curiosidade": "Portal de acesso para o Aeroporto Internacional de SJC e conexão direta com Caraguatatuba e São Sebastião.",
    "fonte": "Pró-Memória Câmara SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-residencial-flamboyant",
    "nome": "Residencial Flamboyant",
    "regiaoId": "sudeste",
    "regiaoNome": "Zona Sudeste",
    "periodo": "Anos 1990 / 2000",
    "origemNome": "Alamedas planejadas com flamboyants de flores vermelhas exuberantes.",
    "historia": "Área que passou por rápida verticalização residencial moderna ao lado da Avenida dos Astronautas e do INPE.",
    "curiosidade": "Bairro preferido por engenheiros recém-formados e pesquisadores do polo espacial.",
    "fonte": "Secretaria de Urbanismo SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-santa-julia",
    "nome": "Jardim Santa Júlia",
    "regiaoId": "sudeste",
    "regiaoNome": "Zona Sudeste",
    "periodo": "Anos 1990",
    "origemNome": "Homenagem a Santa Júlia e à família proprietária da antiga fazenda desmembrada.",
    "historia": "Bairro residencial em expressivo crescimento na Região Sudeste, contíguo à Via Cambuí e Tamoios.",
    "curiosidade": "Beneficiado diretamente pela abertura da Via Cambuí, conectando a Zona Sudeste à Zona Leste em poucos minutos.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-aquarius",
    "nome": "Jardim Aquarius",
    "regiaoId": "oeste",
    "regiaoNome": "Zona Oeste",
    "periodo": "Anos 1990",
    "origemNome": "Herança da antiga Fazenda Aquarius, grande haras e propriedade agropecuária que ocupava toda a colina oeste.",
    "historia": "Planejado no final do século XX como novo centro financeiro, corporativo e residencial de alto padrão. Concentra os edifícios mais modernos da cidade.",
    "curiosidade": "A Praça Ulisses Guimarães no centro do bairro é o principal ponto de caminhada, eventos ao ar livre e gastronomia de food trucks.",
    "fonte": "Pró-Memória SJC / Prefeitura SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-urbanova",
    "nome": "Urbanova (Alphaville / Paratehy)",
    "regiaoId": "oeste",
    "regiaoNome": "Zona Oeste",
    "periodo": "1980 / 1990",
    "origemNome": "Acrônimo de Urbanização Nova, plano de ocupação de baixa densidade respeitando os relevos e o Rio Paraíba.",
    "historia": "Antigas fazendas leiteiras transformadas no maior polo de condomínios fechados horizontais, haras e sede do campus principal da Universidade do Vale do Paraíba (Univap).",
    "curiosidade": "Cercado pelos meandros do Rio Paraíba e Parque Ribeirão Vermelho, com o imponente Arco da Inovação em sua rota de acesso.",
    "fonte": "Univap / Pró-Memória",
    "fonteUrl": "https://www.univap.br/"
  },
  {
    "id": "bairro-esplanada",
    "nome": "Jardim Esplanada",
    "regiaoId": "oeste",
    "regiaoNome": "Zona Oeste",
    "periodo": "Anos 1970",
    "origemNome": "Topografia em platô (esplanada) debruçada sobre o Rio Paraíba e o Banhado.",
    "historia": "Bairro tradicional nobre de casas amplas, praças centenárias, colégios de excelência e polo médico contíguo ao Parque Vicentina Aranha.",
    "curiosidade": "Abriga o histórico Shopping Esplanada, um dos pioneiros centros comerciais de bairro de São José dos Campos.",
    "fonte": "SJC Antigamente / COMPHAC",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-colinas",
    "nome": "Jardim das Colinas",
    "regiaoId": "oeste",
    "regiaoNome": "Zona Oeste",
    "periodo": "Anos 1980",
    "origemNome": "Relevo ondulado suave com vista panorâmica para o Vale do Paraíba.",
    "historia": "Loteamento fechado de altíssimo padrão que impulsionou a criação do Colinas Shopping e hotéis executivos internacionais.",
    "curiosidade": "Sede do Colinas Shopping e do Teatro Colinas, importante polo cultural e gastronômico da cidade.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-industrias",
    "nome": "Jardim das Indústrias",
    "regiaoId": "oeste",
    "regiaoNome": "Zona Oeste",
    "periodo": "1960",
    "origemNome": "Desmembramento da Fazenda Paraíso e proximidade com o complexo da Johnson & Johnson na Dutra.",
    "historia": "Lançado em 1960. Apesar do nome industrial, transformou-se em bairro predominantemente residencial, muito arborizado e valorizado na Zona Oeste.",
    "curiosidade": "Sua praça central com pista de cooper e parquinho infantil é uma das mais frequentadas da cidade.",
    "fonte": "Pró-Memória Univap",
    "fonteUrl": "https://www.univap.br/"
  },
  {
    "id": "bairro-centro-historico",
    "nome": "Centro Histórico (Rua 15 / Praça Afonso Pena)",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "1767 (Marco Zero Oficial)",
    "origemNome": "Núcleo original da fundação da Vila de São José do Paraíba pelo Ouvidor Afonso Botelho.",
    "historia": "Colina histórica onde se ergueram a primeira Câmara, o Pelourinho e a Igreja Matriz. Tornou-se o coração bancário, cívico e de comércio tradicional de rua.",
    "curiosidade": "A Praça Afonso Pena era o antigo Largo da Matriz e a Rua 15 de Novembro foi o centro econômico do ciclo cafeeiro.",
    "fonte": "Pró-Memória Câmara SJC / FCCR",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-vila-ema",
    "nome": "Vila Ema",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "1920 / 1930",
    "origemNome": "Homenagem a Dona Ema, matriarca da família proprietária das primeiras pensões sanatoriais.",
    "historia": "Bairro nobre que abrigava residências de médicos sanitaristas e pensionatos da fase da tuberculose. Tornou-se o principal corredor gastronômico de alta gastronomia e bistrôs da cidade.",
    "curiosidade": "Preserva chalés e casarões da década de 1930 integrados a restaurantes de culinária internacional contemporânea.",
    "fonte": "COMPHAC / FCCR",
    "fonteUrl": "https://fccr.sp.gov.br/"
  },
  {
    "id": "bairro-vila-adyana",
    "nome": "Vila Adyana",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "1924",
    "origemNome": "Homenagem a Dona Adyana, da família que loteou o entorno do Sanatório Vicentina Aranha.",
    "historia": "Bairro símbolo da fase sanatorial, acolhendo o suntuoso Parque Vicentina Aranha e mais tarde o Parque Santos Dumont. É o principal polo médico e de advocacia da cidade.",
    "curiosidade": "Abriga dois dos maiores parques urbanos municipais: o Vicentina Aranha e o Santos Dumont (com réplica do 14-Bis).",
    "fonte": "Pró-Memória SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-vila-betania",
    "nome": "Vila Betânia",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "Anos 1950",
    "origemNome": "Inspiração bíblica em Betânia (lugar de acolhimento e repouso).",
    "historia": "Bairro residencial central que se transformou em complexo hospitalar de referência (Hospital Santos Dumont, Policlin, AME).",
    "curiosidade": "Localização estratégica entre o Parque Santos Dumont e a Avenida Nelson D Ávila.",
    "fonte": "Prefeitura de SJC",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  },
  {
    "id": "bairro-sao-dimas",
    "nome": "Jardim São Dimas",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "1940",
    "origemNome": "Construção da capela dedicada a São Dimas. No século XVIII o local era conhecido como Largo do Lava-Pés dos tropeiros.",
    "historia": "Antigo ponto de parada de viajantes que lavavam os pés no Córrego da Cavinha. Tornou-se polo universitário com a instalação da Faculdade de Odontologia da UNESP nos anos 50.",
    "curiosidade": "A Catedral de São Dimas com seus vitrais monumentais é sede da Diocese de São José dos Campos.",
    "fonte": "Diocese de SJC / Unesp / Pró-Memória",
    "fonteUrl": "https://www.diocese-sjc.org.br/"
  },
  {
    "id": "bairro-monte-castelo",
    "nome": "Monte Castelo",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "1945",
    "origemNome": "Homenagem aos pracinhas brasileiros da Força Expedicionária Brasileira (FEB) na Batalha de Monte Castello (Itália, 1945).",
    "historia": "Loteado no término da Segunda Guerra Mundial em homenagem aos heróis joseenses da FEB. Bairro tradicional que abriga escolas técnicas e o CenterVale Shopping no entorno.",
    "curiosidade": "Possui ruas com nomes de generais e heróis militares da campanha brasileira na Segunda Guerra.",
    "fonte": "Associação dos Veteranos da FEB / Pró-Memória SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/promemoria/"
  },
  {
    "id": "bairro-vila-maria",
    "nome": "Vila Maria",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "Anos 1930",
    "origemNome": "Homenagem a Maria, proprietária de antigas chácaras da baixada central.",
    "historia": "Bairro tradicional de operários e comerciantes que trabalhavam nas fábricas do centro e na ferrovia.",
    "curiosidade": "Preserva padarias históricas, bares tradicionais e ambiente de vizinhança acolhedora.",
    "fonte": "SJC Antigamente",
    "fonteUrl": "https://sjcantigamente.com.br/"
  },
  {
    "id": "bairro-jardim-paulista",
    "nome": "Jardim Paulista",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "Anos 1950",
    "origemNome": "Homenagem ao Estado e ao povo paulista.",
    "historia": "Bairro residencial e comercial consolidado que conecta o Centro à Zona Leste e à Rodoviária Nova (Terminal Rodoviário Frederico Ozanam).",
    "curiosidade": "Suas ruas homenageiam bandeirantes e personagens da história colonial de São Paulo.",
    "fonte": "Câmara Municipal SJC",
    "fonteUrl": "https://www.camarasjc.sp.gov.br/"
  },
  {
    "id": "bairro-jardim-augusta",
    "nome": "Jardim Augusta",
    "regiaoId": "centro",
    "regiaoNome": "Região Central",
    "periodo": "Anos 1960",
    "origemNome": "Homenagem a Dona Augusta, pioneira das primeiras chácaras do entorno.",
    "historia": "Bairro que abriga o CenterVale Shopping (inaugurado em 1987), a sede da TV Vanguarda (afiliada Globo) e hotéis executivos.",
    "curiosidade": "Polo comercial de grande fluxo diário e conexão com o Anel Viário e Rodovia Presidente Dutra.",
    "fonte": "Prefeitura de SJC / CenterVale",
    "fonteUrl": "https://www.sjc.sp.gov.br/"
  }
]
};
