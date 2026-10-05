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
        "id": "P01",
        "nome": "Ozires Silva",
        "categoria": "Aviação & Indústria",
        "periodo": "1931 – presente",
        "subtitulo": "Co-fundador da Embraer e Engenheiro do ITA",
        "naturalDeSJC": false,
        "texto": "Oficial da Aeronáutica e engenheiro formado na turma de 1962 do ITA, liderou no CTA a equipe que desenvolveu o avião Bandeirante. Em 1969, chefiou a fundação da Embraer e assumiu sua primeira presidência, consolidando a presença brasileira no mercado internacional da aviação regional. Nascido em Bauru, sua trajetória técnica estabeleceu as bases operacionais e tecnológicas da indústria aeroespacial em São José dos Campos (INCAER, 2014; SILVA, [s.d.]).",
        "citacoes": [
            "(INCAER, 2014; SILVA, [s.d.])"
        ],
        "referencias": [
            "INCAER. Instituto Histórico-Cultural da Aeronáutica. Construção aeronáutica no Brasil. Rio de Janeiro: INCAER, 2014. Disponível em: https://www2.fab.mil.br/incaer/images/eventgallery/instituto/Opusculos/Textos/opusculo_construcao_aeronautica.pdf. Acesso em: 5 out. 2026.",
            "SILVA, Ozires. In: WIKIPÉDIA: a enciclopédia livre. [San Francisco: Wikimedia Foundation, s.d.]. Disponível em: https://en.wikipedia.org/wiki/Ozires_Silva. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em Bauru (SP) em 8 jan. 1931 (naturalDeSJC: false).",
            "Confirmada formatura no ITA em 1962 e liderança do projeto IPD-6504 (Bandeirante).",
            "A expressão promocional 'alçando o Brasil à liderança na aviação regional mundial' foi atenuada para dado factual: 'consolidando a presença brasileira no mercado internacional da aviação regional'.",
            "Presidência da Embraer de 1969 a 1986 e retorno entre 1991 e 1995 confirmados em fontes históricas da Aeronáutica e Embraer."
        ],
        "pendencias": [],
        "cor": "cyan",
        "cargo": "Co-fundador da Embraer e Engenheiro do ITA",
        "descricao": "Oficial da Aeronáutica e engenheiro formado na turma de 1962 do ITA, liderou no CTA a equipe que desenvolveu o avião Bandeirante. Em 1969, chefiou a fundação da Embraer e assumiu sua primeira presidência, consolidando a presença brasileira no mercado internacional da aviação regional. Nascido em Bauru, sua trajetória técnica estabeleceu as bases operacionais e tecnológicas da indústria aeroespacial em São José dos Campos (INCAER, 2014; SILVA, [s.d.]).",
        "tag": "Aviação & Indústria"
    },
    {
        "id": "P02",
        "nome": "Marechal Casimiro Montenegro Filho",
        "categoria": "Ciência & Educação",
        "periodo": "1904 – 2000",
        "subtitulo": "Idealizador do CTA e do ITA",
        "naturalDeSJC": false,
        "texto": "Pioneiro do Correio Aéreo Militar nos anos 1930, concebeu o projeto de formação e pesquisa técnica da Aeronáutica. Na década de 1940, liderou a implantação do Centro Técnico de Aeronáutica e do ITA em São José dos Campos, estruturando o Plano Smith e contratando docentes do exterior. Convidou o arquiteto Oscar Niemeyer para projetar os edifícios do campus, consolidando a cidade como polo tecnológico nacional (BRASIL, 1950; CASIMIRO..., [s.d.]; ITA, [s.d.]).",
        "citacoes": [
            "(BRASIL, 1950; CASIMIRO..., [s.d.]; ITA, [s.d.])"
        ],
        "referencias": [
            "BRASIL. Decreto nº 27.695, de 16 de janeiro de 1950. Cria o Instituto Tecnológico de Aeronáutica. Coleção de Leis do Brasil, Rio de Janeiro, v. 1, p. 74, 1950. Disponível em: http://www.aeitaonline.com.br/wiki/index.php?title=Hist%C3%B3ria_do_ITA_1941_a_1950. Acesso em: 5 out. 2026.",
            "CASIMIRO Montenegro Filho. In: WIKIPÉDIA: a enciclopédia livre. [San Francisco: Wikimedia Foundation, s.d.]. Disponível em: https://en.wikipedia.org/wiki/Casimiro_Montenegro_Filho. Acesso em: 5 out. 2026.",
            "ITA. Instituto Tecnológico de Aeronáutica. Concepção e história institucional. São José dos Campos: AEITA, [s.d.]. Disponível em: https://wikita.aeita.com.br/wiki/ITA. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 14 resolvido: Marechal-do-Ar foi posto honorífico final concedido pelo Congresso Nacional; na época da criação do CTA/ITA era Coronel e posteriormente Brigadeiro. Texto usa 'Marechal' no nome formal e contextualiza a patente nos anos 1940.",
            "Confirmado nascimento em Fortaleza (CE) em 1904 e falecimento em Petrópolis (RJ) em 2000 (naturalDeSJC: false).",
            "Confirmada participação no voo pioneiro do Correio Aéreo Militar em 1931 e concepção do CTA e ITA.",
            "Confirmada contratação dos projetos arquitetônicos de Oscar Niemeyer para o campus do CTA/ITA."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Idealizador do CTA e do ITA",
        "descricao": "Pioneiro do Correio Aéreo Militar nos anos 1930, concebeu o projeto de formação e pesquisa técnica da Aeronáutica. Na década de 1940, liderou a implantação do Centro Técnico de Aeronáutica e do ITA em São José dos Campos, estruturando o Plano Smith e contratando docentes do exterior. Convidou o arquiteto Oscar Niemeyer para projetar os edifícios do campus, consolidando a cidade como polo tecnológico nacional (BRASIL, 1950; CASIMIRO..., [s.d.]; ITA, [s.d.]).",
        "tag": "Ciência & Educação"
    },
    {
        "id": "P03",
        "nome": "Dr. Fernando de Mendonça",
        "categoria": "Pesquisa Espacial",
        "periodo": "1924 – presente",
        "subtitulo": "Primeiro Diretor-Geral e Fundador do INPE",
        "naturalDeSJC": false,
        "texto": "Engenheiro eletrônico formado pelo ITA em 1958 e doutor em radiociências pela Universidade Stanford, liderou os primeiros passos do programa espacial do país. Em 1961, assumiu a direção científica do grupo embrionário que organizou as atividades espaciais em São José dos Campos. Com a criação oficial do Instituto Nacional de Pesquisas Espaciais em 1971, tornou-se seu primeiro diretor-geral, estruturando pesquisas pioneiras em satélites e sensoriamento remoto (INPE, 2015; ITAEX, 2024).",
        "citacoes": [
            "(INPE, 2015; ITAEX, 2024)"
        ],
        "referencias": [
            "INPE. Instituto Nacional de Pesquisas Espaciais. Galeria de Diretores e História Institucional. São José dos Campos: INPE, 2015. Disponível em: http://www.inpe.br/noticias/noticia.php?Cod_Noticia=3899. Acesso em: 5 out. 2026.",
            "ITAEX. Associação dos Ex-Alunos do ITA. Homenagens e trajetória: Fernando de Mendonça. São José dos Campos: ITAEX, 2024. Disponível em: https://itaex.org.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 2 resolvido: Aldo da Rosa chefiou a organização inicial da CNAE em 1961, enquanto Mendonça exerceu a direção científica do GOCNAE e tornou-se formalmente o primeiro Diretor-Geral do INPE de 1971 a 1976.",
            "Confirmado nascimento em Guarabira (PB) em 1924 (naturalDeSJC: false).",
            "Formação no ITA em 1958 com menção summa cum laude e PhD em Stanford confirmados por fontes institucionais."
        ],
        "pendencias": [],
        "cor": "blue",
        "cargo": "Primeiro Diretor-Geral e Fundador do INPE",
        "descricao": "Engenheiro eletrônico formado pelo ITA em 1958 e doutor em radiociências pela Universidade Stanford, liderou os primeiros passos do programa espacial do país. Em 1961, assumiu a direção científica do grupo embrionário que organizou as atividades espaciais em São José dos Campos. Com a criação oficial do Instituto Nacional de Pesquisas Espaciais em 1971, tornou-se seu primeiro diretor-geral, estruturando pesquisas pioneiras em satélites e sensoriamento remoto (INPE, 2015; ITAEX, 2024).",
        "tag": "Pesquisa Espacial"
    },
    {
        "id": "P04",
        "nome": "Cassiano Ricardo",
        "categoria": "Literatura & Poesia",
        "periodo": "1895 – 1974",
        "subtitulo": "Poeta Modernista, Jornalista e Membro da ABL",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, integrou a primeira geração do modernismo brasileiro e ocupou a Cadeira 27 da Academia Brasileira de Letras. Nos anos 1960, renovou sua linguagem poética dialogando com a vanguarda e a poesia concreta. Patrono da Fundação Cultural e da Biblioteca Pública Municipal, permanece como a principal referência literária da cidade natal (ACADEMIA BRASILEIRA DE LETRAS, [s.d.]; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "citacoes": [
            "(ACADEMIA BRASILEIRA DE LETRAS, [s.d.]; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a)"
        ],
        "referencias": [
            "ACADEMIA BRASILEIRA DE LETRAS. Cassiano Ricardo: biografia e bibliografia. Rio de Janeiro: ABL, [s.d.]. Disponível em: https://www.academia.org.br/academicos/cassiano-ricardo/biografia. Acesso em: 5 out. 2026.",
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Personalidades brasileiras e internacionais em São José dos Campos. São José dos Campos: Câmara Municipal, 5 maio 2021a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/05/05/personalidades-brasileiras-e-internacionais-em-sao-jose-dos-campos/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 13 resolvido: Cassiano participou do modernismo de 1922 e, no fim da carreira (anos 1960), incorporou elementos da Poesia Concreta e do Poema-Práxis em obras como 'Jerusalém'. Enquadramento ajustado com precisão histórica.",
            "Confirmado nascimento em São José dos Campos em 26 jul. 1895 e falecimento no Rio de Janeiro em 14 jan. 1974 (naturalDeSJC: true).",
            "Único joseense a integrar o quadro da ABL."
        ],
        "pendencias": [],
        "cor": "purple",
        "cargo": "Poeta Modernista, Jornalista e Membro da ABL",
        "descricao": "Nascido em São José dos Campos, integrou a primeira geração do modernismo brasileiro e ocupou a Cadeira 27 da Academia Brasileira de Letras. Nos anos 1960, renovou sua linguagem poética dialogando com a vanguarda e a poesia concreta. Patrono da Fundação Cultural e da Biblioteca Pública Municipal, permanece como a principal referência literária da cidade natal (ACADEMIA BRASILEIRA DE LETRAS, [s.d.]; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "tag": "Literatura & Poesia"
    },
    {
        "id": "P05",
        "nome": "Dona Vicentina de Queiroz Aranha",
        "categoria": "Saúde & Filantropia",
        "periodo": "1863 – 1916",
        "subtitulo": "Patrona Filantrópica do Sanatório",
        "naturalDeSJC": false,
        "texto": "Esposa do senador Olavo Egydio de Sousa Aranha, liderou em São Paulo a campanha de arrecadação de fundos para tratamento de tuberculosos desvalidos. A mobilização permitiu à Santa Casa de Misericórdia adquirir o sítio em São José dos Campos em março de 1914. Após sua morte em 1916, a instituição foi inaugurada em 1924 com o nome de Sanatório Vicentina Aranha em sua homenagem (AFONSO, 2012; ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014).",
        "citacoes": [
            "(AFONSO, 2012; ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014)"
        ],
        "referencias": [
            "AFONSO, Carlos. Parque Vicentina Aranha: patrimônio histórico e ambiental. São José dos Campos: Fundação Cultural Cassiano Ricardo, 2012. Disponível em: https://www.parquevicentinaaranha.org.br/historia. Acesso em: 5 out. 2026.",
            "ASSOCIAÇÃO PAULISTA DE MEDICINA. O sanatório de São José dos Campos e a tuberculose no Brasil. Revista da APM, São Paulo, n. 650, p. 18-22, out. 2014. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 1 resolvido: texto-base corrigido para afastar 'doação testamentária'. A Santa Casa adquiriu as terras em março de 1914 enquanto ela ainda vivia, fruto de sua campanha filantrópica.",
            "Confirmado falecimento em 1916 e inauguração solene do Sanatório em 1924.",
            "Nascida em São Paulo (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Patrona Filantrópica do Sanatório",
        "descricao": "Esposa do senador Olavo Egydio de Sousa Aranha, liderou em São Paulo a campanha de arrecadação de fundos para tratamento de tuberculosos desvalidos. A mobilização permitiu à Santa Casa de Misericórdia adquirir o sítio em São José dos Campos em março de 1914. Após sua morte em 1916, a instituição foi inaugurada em 1924 com o nome de Sanatório Vicentina Aranha em sua homenagem (AFONSO, 2012; ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014).",
        "tag": "Saúde & Filantropia"
    },
    {
        "id": "P06",
        "nome": "Mestre Zé Mira",
        "categoria": "Cultura Tradicional",
        "periodo": "1924 – 2008",
        "subtitulo": "Mestre Tropeiro e Guardião da Cultura Popular",
        "naturalDeSJC": false,
        "texto": "Nascido José Alves de Mira, trabalhou como tropeiro, agricultor e construtor antes de se firmar como guardião da música raiz no Vale do Paraíba. Em São José dos Campos, liderou grupos de Folia de Reis, Folia do Divino e Moçambique, transmitindo saberes da tradição caipira. Fundou a Casa de Cultura Caipira Zé Mira em 2004, preservando acervos instrumentais e rodas de viola até sua morte (MUSEU DA PESSOA, 2008; SÃO JOSÉ DOS CAMPOS, 2024a).",
        "citacoes": [
            "(MUSEU DA PESSOA, 2008; SÃO JOSÉ DOS CAMPOS, 2024a)"
        ],
        "referencias": [
            "MUSEU DA PESSOA. Uma vida na roça e na viola: depoimento de José Alves de Mira (Mestre Zé Mira). São Paulo: Museu da Pessoa, 2008. Disponível em: https://museudapessoa.org. Acesso em: 5 out. 2026.",
            "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Casa de Cultura Caipira Zé Mira: patrimônio vivo do Vale. São José dos Campos: FCCR, 2024a. Disponível em: https://www.sjc.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Datas corrigidas de 1942 – 2021 para 1924 – 2008 segundo registro biográfico do Museu da Pessoa e do Cadastro Nacional de Museus.",
            "Nascido em Cristina (MG) e radicado em São José dos Campos (naturalDeSJC: false).",
            "Confirmada criação da Casa de Cultura Caipira Zé Mira em 2004 e liderança na Folia de Reis e Moçambique."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Mestre Tropeiro e Guardião da Cultura Popular",
        "descricao": "Nascido José Alves de Mira, trabalhou como tropeiro, agricultor e construtor antes de se firmar como guardião da música raiz no Vale do Paraíba. Em São José dos Campos, liderou grupos de Folia de Reis, Folia do Divino e Moçambique, transmitindo saberes da tradição caipira. Fundou a Casa de Cultura Caipira Zé Mira em 2004, preservando acervos instrumentais e rodas de viola até sua morte (MUSEU DA PESSOA, 2008; SÃO JOSÉ DOS CAMPOS, 2024a).",
        "tag": "Cultura Tradicional"
    },
    {
        "id": "P07",
        "nome": "Euclides Bueno Miragaia",
        "categoria": "Memória Cívica",
        "periodo": "1911 – 1932",
        "subtitulo": "Mártir Constitucionalista de 1932 (M.M.D.C.)",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, atuava como estudante e comerciário na capital paulista durante a crise política da Era Vargas. Em 23 de maio de 1932, foi baleado fatalmente durante manifestação popular contra o governo provisório federal no centro de São Paulo. Sua morte, ao lado de três companheiros, deu origem à sigla revolucionária M.M.D.C., tornando-o mártir cívico e patrono escolar joseense (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SÃO PAULO, 2013a).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SÃO PAULO, 2013a)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: tradicionais ruas do Centro: Rua Euclides Miragaia. São José dos Campos, 13 ago. 2024a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-tradicionais-ruas-do-centro-ruas-sebastiao-humel-e-siqueira-campos/. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Euclides Bueno Miragaia. São José dos Campos: Secretaria da Educação do Estado de São Paulo, 2013a. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 21 abr. 1911 e falecimento em São Paulo em 23 maio 1932 (naturalDeSJC: true).",
            "Ajustada a frase 'a letra M': Miragaia integra o quarteto fundador do M.M.D.C. (Martins, Miragaia, Dráusio e Camargo).",
            "Confirmada atuação como comerciário e estudante."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Mártir Constitucionalista de 1932 (M.M.D.C.)",
        "descricao": "Nascido em São José dos Campos, atuava como estudante e comerciário na capital paulista durante a crise política da Era Vargas. Em 23 de maio de 1932, foi baleado fatalmente durante manifestação popular contra o governo provisório federal no centro de São Paulo. Sua morte, ao lado de três companheiros, deu origem à sigla revolucionária M.M.D.C., tornando-o mártir cívico e patrono escolar joseense (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SÃO PAULO, 2013a).",
        "tag": "Memória Cívica"
    },
    {
        "id": "P08",
        "nome": "Dr. Affonso Berardinelli Tarantino",
        "categoria": "Medicina & Ensino",
        "periodo": "1915 – 2014",
        "subtitulo": "Pneumologista e Autor de Tratado Médico",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, iniciou sua carreira médica chefiando o Dispensário Marcos Arruda em 1941 e o Sanatório Ruy Dória em 1942. Especializou-se no tratamento da tuberculose e construiu respeitada carreira acadêmica no Rio de Janeiro como professor titular de pneumologia. Ingressou na Academia Nacional de Medicina e escreveu o livro Doenças Pulmonares, principal tratado didático da especialidade no país (ACADEMIA NACIONAL DE MEDICINA, 2014; TARANTINO, 2008).",
        "citacoes": [
            "(ACADEMIA NACIONAL DE MEDICINA, 2014; TARANTINO, 2008)"
        ],
        "referencias": [
            "ACADEMIA NACIONAL DE MEDICINA. Biografia dos Membros Titulares: Affonso Berardinelli Tarantino. Rio de Janeiro: ANM, 2014. Disponível em: https://anm.org.br. Acesso em: 5 out. 2026.",
            "TARANTINO, Affonso Berardinelli. Doenças pulmonares. 6. ed. Rio de Janeiro: Guanabara Koogan, 2008."
        ],
        "notas_verificacao": [
            "Datas corrigidas de 1916 – 2012 para 1915 – 2014 conforme registro oficial da Academia Nacional de Medicina (31 jul. 1915 – 2014).",
            "Confirmado nascimento em São José dos Campos (naturalDeSJC: true). Filho da farmacêutica Genésia Berardinelli Tarantino (P31).",
            "Atuação em SJC documentada: chefe do Dispensário Marcos Arruda (1941) e Sanatório Ruy Dória (1942).",
            "Diferenciado de seu irmão Aníbal Tarantino (farmacêutico nascido em 1912)."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Pneumologista e Autor de Tratado Médico",
        "descricao": "Nascido em São José dos Campos, iniciou sua carreira médica chefiando o Dispensário Marcos Arruda em 1941 e o Sanatório Ruy Dória em 1942. Especializou-se no tratamento da tuberculose e construiu respeitada carreira acadêmica no Rio de Janeiro como professor titular de pneumologia. Ingressou na Academia Nacional de Medicina e escreveu o livro Doenças Pulmonares, principal tratado didático da especialidade no país (ACADEMIA NACIONAL DE MEDICINA, 2014; TARANTINO, 2008).",
        "tag": "Medicina & Ensino"
    },
    {
        "id": "P09",
        "nome": "José de Araújo Coimbra",
        "categoria": "Fundação & Governo",
        "periodo": "século XVIII",
        "subtitulo": "Capitão-mor de Jacareí e Impulsionador da Vila",
        "naturalDeSJC": false,
        "texto": "Após a expulsão dos jesuítas em 1759, liderou o assentamento de moradores junto aos indígenas no antigo aldeamento. Como capitão-mor de Jacareí, impulsionou a comunidade até sua elevação a vila em 27 de julho de 1767, sob o nome de São José do Paraíba. A tradição local atribui sua morte posterior a disputas territoriais violentas entre povoados vizinhos (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024b; COIMBRA, 2021).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024b; COIMBRA, 2021)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: a fundação da Vila e os primeiros caminhos coloniais. São José dos Campos, 2024b. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/07/23/projeto-ruas-a-fundacao-da-vila-sao-jose-praca-padre-joao-e-rua-quinze-de-novembro/. Acesso em: 5 out. 2026.",
            "COIMBRA, José de Araújo. In: MEMÓRIA Joseense: história e cronologia. São José dos Campos, 2021. Disponível em: https://sjc.com.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 7 resolvido: expulsão dos jesuítas data de 1759 (decreto pombalino). Elevação a vila ocorreu em 27 de julho de 1767 pelo ouvidor Salvador Pereira da Silva.",
            "A circunstância da morte violenta por moradores de Jacareí decorre da tradição historiográfica local, sendo expressamente identificada como tradição oral no texto.",
            "Autoridade de Jacareí (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Capitão-mor de Jacareí e Impulsionador da Vila",
        "descricao": "Após a expulsão dos jesuítas em 1759, liderou o assentamento de moradores junto aos indígenas no antigo aldeamento. Como capitão-mor de Jacareí, impulsionou a comunidade até sua elevação a vila em 27 de julho de 1767, sob o nome de São José do Paraíba. A tradição local atribui sua morte posterior a disputas territoriais violentas entre povoados vizinhos (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024b; COIMBRA, 2021).",
        "tag": "Fundação & Governo"
    },
    {
        "id": "P10",
        "nome": "Francisco dos Anjos Gaia",
        "categoria": "Imprensa & Música",
        "periodo": "1872 – 1933",
        "subtitulo": "Jornalista, Músico e Fundador do Jornal Yetim",
        "naturalDeSJC": null,
        "texto": "Músico e jornalista de sólida formação humanística, lecionava latim em 1872 no colégio pioneiro da Rua São José. Em 1885, fundou o impresso Yetim, um dos primeiros jornais da imprensa joseense, além de ministrar aulas de piano na cidade. Aperfeiçoou seus estudos no Conservatório Musical de Milão em 1914 e seu nome identifica tradicional logradouro central (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024c; MEON, 2022).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024c; MEON, 2022)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Rua Maestro Francisco Gaia. São José dos Campos, 2024c. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/20/projeto-ruas-tradicionais-ruas-do-centro-rua-rubiao-junior-e-maestro-francisco-gaia/. Acesso em: 5 out. 2026.",
            "MEON. Memória: o pioneirismo da imprensa em São José dos Campos. São José dos Campos, 15 maio 2022. Disponível em: https://www.meon.com.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 3 resolvido: o período 1872 – 1933 demarca o arco de atividade documental de Gaia na cidade (lecionava latim já em 1872 e teve rua oficializada pela Lei nº 590/1958), não havendo datas de nascimento e morte confirmadas com precisão arquivística.",
            "Yetim (1885) qualificado como 'um dos primeiros jornais', visto que o pioneiro impresso local foi o 'Jovem América' (1877).",
            "Naturalidade não confirmada nos autos (naturalDeSJC: null)."
        ],
        "pendencias": [
            "Local e ano exatos de nascimento e óbito permanecem sem certidão localizada."
        ],
        "cor": "purple",
        "cargo": "Jornalista, Músico e Fundador do Jornal Yetim",
        "descricao": "Músico e jornalista de sólida formação humanística, lecionava latim em 1872 no colégio pioneiro da Rua São José. Em 1885, fundou o impresso Yetim, um dos primeiros jornais da imprensa joseense, além de ministrar aulas de piano na cidade. Aperfeiçoou seus estudos no Conservatório Musical de Milão em 1914 e seu nome identifica tradicional logradouro central (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024c; MEON, 2022).",
        "tag": "Imprensa & Música"
    },
    {
        "id": "P11",
        "nome": "Henrique Jorge Guedes",
        "categoria": "Política & Engenharia",
        "periodo": "1887 – 1973",
        "subtitulo": "Engenheiro, Prefeito de São Paulo e Deputado Federal",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, diplomou-se pela Escola Politécnica e dedicou-se à engenharia sanitária e ao ensino técnico superior. Exerceu o cargo de prefeito da capital paulista entre 1931 e 1932, modernizando serviços essenciais de infraestrutura urbana. Eleito deputado federal por São Paulo, integrou a bancada constituinte e atuou no Congresso Nacional entre 1935 e 1937 (BRASIL, [s.d.]; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "citacoes": [
            "(BRASIL, [s.d.]; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a)"
        ],
        "referencias": [
            "BRASIL. Congresso Nacional. Câmara dos Deputados. Biografia do Deputado Federal Henrique Jorge Guedes. Brasília, DF, [s.d.]. Disponível em: https://www.camara.leg.br. Acesso em: 5 out. 2026.",
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Personalidades brasileiras e internacionais em São José dos Campos. São José dos Campos: Câmara Municipal, 5 maio 2021a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/05/05/personalidades-brasileiras-e-internacionais-em-sao-jose-dos-campos/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 1887 e falecimento em São Paulo em 1973 (naturalDeSJC: true).",
            "Prefeito de São Paulo de 1931 a 1932 e deputado federal de 1935 a 1937 confirmados no acervo da Câmara dos Deputados e do CPDOC/FGV."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Engenheiro, Prefeito de São Paulo e Deputado Federal",
        "descricao": "Nascido em São José dos Campos, diplomou-se pela Escola Politécnica e dedicou-se à engenharia sanitária e ao ensino técnico superior. Exerceu o cargo de prefeito da capital paulista entre 1931 e 1932, modernizando serviços essenciais de infraestrutura urbana. Eleito deputado federal por São Paulo, integrou a bancada constituinte e atuou no Congresso Nacional entre 1935 e 1937 (BRASIL, [s.d.]; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "tag": "Política & Engenharia"
    },
    {
        "id": "P12",
        "nome": "Prof. Mário Guimarães Ferri",
        "categoria": "Ciência & Ecologia",
        "periodo": "1918 – 1985",
        "subtitulo": "Pioneiro da Ecologia Brasileira e Catedrático da USP",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, graduou-se em história natural pela Universidade de São Paulo e conquistou a cátedra de botânica em 1955. Suas pesquisas desvendaram o funcionamento hídrico das plantas do cerrado, estabelecendo métodos pioneiros na ecologia vegetal brasileira. Diretor do Instituto de Biociências da USP, publicou compêndios adotados em âmbito nacional e recebeu o Prêmio Jabuti de Ciências (FAPESP, 1985; UNIVERSIDADE DE SÃO PAULO, 1985).",
        "citacoes": [
            "(FAPESP, 1985; UNIVERSIDADE DE SÃO PAULO, 1985)"
        ],
        "referencias": [
            "FAPESP. Fundação de Amparo à Pesquisa do Estado de São Paulo. Mário Guimarães Ferri: o botânico pioneiro do cerrado. Revista Pesquisa FAPESP, São Paulo, n. 25, 1985. Disponível em: https://revistapesquisa.fapesp.br. Acesso em: 5 out. 2026.",
            "UNIVERSIDADE DE SÃO PAULO. Instituto de Biociências. Memória docente: Professor Mário Guimarães Ferri. São Paulo: USP, 1985. Disponível em: https://revistas.usp.br/eav/en/article/download/9707/11279/0. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 7 jul. 1918 e falecimento em São Paulo em 1985 (naturalDeSJC: true).",
            "Cátedra na USP em 1955 e Prêmio Jabuti confirmados."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Pioneiro da Ecologia Brasileira e Catedrático da USP",
        "descricao": "Nascido em São José dos Campos, graduou-se em história natural pela Universidade de São Paulo e conquistou a cátedra de botânica em 1955. Suas pesquisas desvendaram o funcionamento hídrico das plantas do cerrado, estabelecendo métodos pioneiros na ecologia vegetal brasileira. Diretor do Instituto de Biociências da USP, publicou compêndios adotados em âmbito nacional e recebeu o Prêmio Jabuti de Ciências (FAPESP, 1985; UNIVERSIDADE DE SÃO PAULO, 1985).",
        "tag": "Ciência & Ecologia"
    },
    {
        "id": "P13",
        "nome": "Paulo Setúbal",
        "categoria": "Literatura & Sanatórios",
        "periodo": "1893 – 1937",
        "subtitulo": "Escritor e Poeta da Fase Sanatorial",
        "naturalDeSJC": false,
        "texto": "Romancista histórico e membro da Academia Brasileira de Letras, buscou em São José dos Campos refúgio climático para o tratamento da tuberculose. Residiu na cidade durante os anos 1930, período em que redigiu páginas memorialísticas sobre o cotidiano dos enfermos internados nos sanatórios locais. Sua passagem inspirou reflexões no livro Confiteor e documentou a atmosfera sanitária que transformava o município em centro médico paulista (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a; SETÚBAL, 1937).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a; SETÚBAL, 1937)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Personalidades brasileiras e internacionais em São José dos Campos. São José dos Campos: Câmara Municipal, 5 maio 2021a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/05/05/personalidades-brasileiras-e-internacionais-em-sao-jose-dos-campos/. Acesso em: 5 out. 2026.",
            "SETÚBAL, Paulo. Confiteor. São Paulo: Companhia Editora Nacional, 1937."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em Tatuí (SP) em 1893 e morte em São Paulo em 1937 (naturalDeSJC: false).",
            "Tratamento em São José dos Campos documentado entre 1930 e 1936, com produção literária correspondente."
        ],
        "pendencias": [],
        "cor": "purple",
        "cargo": "Escritor e Poeta da Fase Sanatorial",
        "descricao": "Romancista histórico e membro da Academia Brasileira de Letras, buscou em São José dos Campos refúgio climático para o tratamento da tuberculose. Residiu na cidade durante os anos 1930, período em que redigiu páginas memorialísticas sobre o cotidiano dos enfermos internados nos sanatórios locais. Sua passagem inspirou reflexões no livro Confiteor e documentou a atmosfera sanitária que transformava o município em centro médico paulista (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a; SETÚBAL, 1937).",
        "tag": "Literatura & Sanatórios"
    },
    {
        "id": "P14",
        "nome": "Padre Rodolfo Komorek",
        "categoria": "Fé & Memória",
        "periodo": "1890 – 1949",
        "subtitulo": "Venerável Padre Santo dos Sanatórios",
        "naturalDeSJC": false,
        "texto": "Sacerdote salesiano polonês, desembarcou no Brasil em 1924 e mudou-se para São José dos Campos na década de 1940 para tratar a tuberculose. Durante a internação, prestou assistência espiritual e amparo caritativo aos doentes internados no Sanatório Vicentina Aranha. Reconhecido como venerável pela Igreja Católica em 1995, seu antigo quarto foi preservado como memorial permanente no parque histórico (SALESIANOS, 2024; VATICANO, 1995).",
        "citacoes": [
            "(SALESIANOS, 2024; VATICANO, 1995)"
        ],
        "referencias": [
            "SALESIANOS. Inspetoria Salesiana de São Paulo. Padre Rodolfo Komorek: legado e processo canônico. São Paulo, 2024. Disponível em: https://padrerodolfokomorek.salesianossp.org.br/. Acesso em: 5 out. 2026.",
            "VATICANO. Congregação para as Causas dos Santos. Decreto sobre as virtudes heroicas do Servo de Deus Rodolfo Komorek. Roma: Santa Sé, 1995. Disponível em: https://noticias.cancaonova.com/igreja/sao-jose-dos-campos-parque-tera-memorial-do-padre-rodolfo-komorek/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 4 resolvido: datas restritas aos anos 1890 – 1949, neutralizando divergências de dias e meses entre fontes europeias e brasileiras.",
            "Venerável decretado em 1995 pelo Papa João Paulo II.",
            "Memorial instalado no Parque Vicentina Aranha.",
            "Nascido em Bielsko, Polônia (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "amber",
        "cargo": "Venerável Padre Santo dos Sanatórios",
        "descricao": "Sacerdote salesiano polonês, desembarcou no Brasil em 1924 e mudou-se para São José dos Campos na década de 1940 para tratar a tuberculose. Durante a internação, prestou assistência espiritual e amparo caritativo aos doentes internados no Sanatório Vicentina Aranha. Reconhecido como venerável pela Igreja Católica em 1995, seu antigo quarto foi preservado como memorial permanente no parque histórico (SALESIANOS, 2024; VATICANO, 1995).",
        "tag": "Fé & Memória"
    },
    {
        "id": "P15",
        "nome": "Nilton Rennó",
        "categoria": "Ciência Planetária",
        "periodo": "1986 – presente",
        "subtitulo": "Cientista da NASA e Pesquisador Espacial",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, graduou-se em engenharia na Unicamp, realizou mestrado no INPE e obteve o doutorado em ciências atmosféricas pelo MIT. Tornou-se professor catedrático na Universidade de Michigan e pesquisador em missões espaciais da NASA ao planeta Marte. Liderou equipes científicas nas operações das sondas Phoenix e Curiosity, comprovando fenômenos associados à água marciana (FAPESP, 2009; RENNO, 2021).",
        "citacoes": [
            "(FAPESP, 2009; RENNO, 2021)"
        ],
        "referencias": [
            "FAPESP. Fundação de Amparo à Pesquisa do Estado de São Paulo. Degelo em Marte: cientista brasileiro estuda atmosfera marciana. Revista Pesquisa FAPESP, São Paulo, 2009. Disponível em: https://revistapesquisa.fapesp.br/degelo-em-marte/. Acesso em: 5 out. 2026.",
            "RENNO, Nilton de Oliveira. Curriculum vitae: academic appointments and space missions. Ann Arbor: University of Michigan, 2021. Disponível em: https://clasp.engin.umich.edu/wp-content/uploads/sites/6/2021/06/Nilton-Renno.pdf. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 11 resolvido: período mantido como 1986 – presente (arco da formação internacional e atividade como pesquisador).",
            "Confirmado nascimento em São José dos Campos (naturalDeSJC: true).",
            "Doutorado no MIT concluído em 1992 (com início nos Estados Unidos a partir de 1986)."
        ],
        "pendencias": [],
        "cor": "blue",
        "cargo": "Cientista da NASA e Pesquisador Espacial",
        "descricao": "Nascido em São José dos Campos, graduou-se em engenharia na Unicamp, realizou mestrado no INPE e obteve o doutorado em ciências atmosféricas pelo MIT. Tornou-se professor catedrático na Universidade de Michigan e pesquisador em missões espaciais da NASA ao planeta Marte. Liderou equipes científicas nas operações das sondas Phoenix e Curiosity, comprovando fenômenos associados à água marciana (FAPESP, 2009; RENNO, 2021).",
        "tag": "Ciência Planetária"
    },
    {
        "id": "P16",
        "nome": "José Maria Fidelis",
        "categoria": "Esporte",
        "periodo": "1944 – 2012",
        "subtitulo": "Lateral do Vasco e da Seleção na Copa de 1966",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, iniciou a carreira profissional no futebol paulista antes de se destacar no Bangu e no Vasco da Gama. Pela sua precisão tática como lateral-direito, foi convocado para a Copa do Mundo de 1966, na Inglaterra, defendendo o Brasil contra Portugal. Após encerrar a trajetória nos gramados, dedicou-se à função de treinador em agremiações esportivas do país (CBF, 2015; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "citacoes": [
            "(CBF, 2015; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a)"
        ],
        "referencias": [
            "CBF. Confederação Brasileira de Futebol. Memória da Seleção: José Maria Fidelis, lateral da Copa de 1966. Rio de Janeiro: CBF, 2015. Disponível em: https://www.cbf.com.br. Acesso em: 5 out. 2026.",
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Personalidades brasileiras e internacionais em São José dos Campos. São José dos Campos: Câmara Municipal, 5 maio 2021a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/05/05/personalidades-brasileiras-e-internacionais-em-sao-jose-dos-campos/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 13 mar. 1944 e morte na mesma cidade em 28 nov. 2012 (naturalDeSJC: true).",
            "Participação na Copa do Mundo de 1966 (partida Brasil x Portugal) confirmada em registros oficiais da CBF e FIFA."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Lateral do Vasco e da Seleção na Copa de 1966",
        "descricao": "Nascido em São José dos Campos, iniciou a carreira profissional no futebol paulista antes de se destacar no Bangu e no Vasco da Gama. Pela sua precisão tática como lateral-direito, foi convocado para a Copa do Mundo de 1966, na Inglaterra, defendendo o Brasil contra Portugal. Após encerrar a trajetória nos gramados, dedicou-se à função de treinador em agremiações esportivas do país (CBF, 2015; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "tag": "Esporte"
    },
    {
        "id": "P17",
        "nome": "Casemiro",
        "categoria": "Esporte",
        "periodo": "1992 – presente",
        "subtitulo": "Meio-campista da Seleção Brasileira",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, Carlos Henrique Casimiro iniciou sua formação em escolinhas locais antes de se profissionalizar no São Paulo. Consolidou trajetória vitoriosa em clubes internacionais e foi titular da Seleção Brasileira nas Copas do Mundo de 2018 e 2022. Mantém laços estreitos com sua terra natal por meio do fomento a projetos esportivos comunitários (CBF, 2022; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "citacoes": [
            "(CBF, 2022; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a)"
        ],
        "referencias": [
            "CBF. Confederação Brasileira de Futebol. Perfil dos atletas convocados: Carlos Henrique Casimiro. Rio de Janeiro: CBF, 2022. Disponível em: https://www.cbf.com.br. Acesso em: 5 out. 2026.",
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Personalidades brasileiras e internacionais em São José dos Campos. São José dos Campos: Câmara Municipal, 5 maio 2021a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/05/05/personalidades-brasileiras-e-internacionais-em-sao-jose-dos-campos/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 23 fev. 1992 (naturalDeSJC: true).",
            "Participação nas Copas de 2018 (Rússia) e 2022 (Catar) confirmada.",
            "Evitada menção a clube empregador atual para manter a perenidade enciclopédica do texto."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Meio-campista da Seleção Brasileira",
        "descricao": "Nascido em São José dos Campos, Carlos Henrique Casimiro iniciou sua formação em escolinhas locais antes de se profissionalizar no São Paulo. Consolidou trajetória vitoriosa em clubes internacionais e foi titular da Seleção Brasileira nas Copas do Mundo de 2018 e 2022. Mantém laços estreitos com sua terra natal por meio do fomento a projetos esportivos comunitários (CBF, 2022; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2021a).",
        "tag": "Esporte"
    },
    {
        "id": "P18",
        "nome": "Richard Harbert Smith",
        "categoria": "Educação & Ciência",
        "periodo": "1946 – 1951",
        "subtitulo": "Primeiro Reitor do ITA e Autor do Plano Smith",
        "naturalDeSJC": false,
        "texto": "Professor norte-americano e ex-chefe do Departamento de Aeronáutica do MIT, foi convidado pelo governo brasileiro para projetar o ensino aeroespacial nacional. Elaborou o abrangente Plano Smith, definindo os currículos e as instalações experimentais do futuro Centro Técnico de Aeronáutica. Assumiu o primeiro reitorado do ITA entre 1946 e 1951, fixando elevados padrões de dedicação integral docente em São José dos Campos (ITA, [s.d.]; SMITH, [s.d.]).",
        "citacoes": [
            "(ITA, [s.d.]; SMITH, [s.d.])"
        ],
        "referencias": [
            "ITA. Instituto Tecnológico de Aeronáutica. Richard Harbert Smith e a fundação pedagógica. São José dos Campos: AEITA, [s.d.]. Disponível em: https://wikita.aeita.com.br/wiki/Richard_Harbert_Smith. Acesso em: 5 out. 2026.",
            "SMITH, Richard Harbert. In: WIKIPÉDIA: a enciclopédia livre. [San Francisco: Wikimedia Foundation, s.d.]. Disponível em: https://en.wikipedia.org/wiki/Richard_Harbert_Smith. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "O período 1946 – 1951 representa seu mandato à frente da instalação do ITA e sua reitoria pioneira.",
            "Nascido em Dillsboro (Indiana, EUA) em 1894 (naturalDeSJC: false).",
            "Autoria do Plano Smith e liderança acadêmica inicial confirmadas."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Primeiro Reitor do ITA e Autor do Plano Smith",
        "descricao": "Professor norte-americano e ex-chefe do Departamento de Aeronáutica do MIT, foi convidado pelo governo brasileiro para projetar o ensino aeroespacial nacional. Elaborou o abrangente Plano Smith, definindo os currículos e as instalações experimentais do futuro Centro Técnico de Aeronáutica. Assumiu o primeiro reitorado do ITA entre 1946 e 1951, fixando elevados padrões de dedicação integral docente em São José dos Campos (ITA, [s.d.]; SMITH, [s.d.]).",
        "tag": "Educação & Ciência"
    },
    {
        "id": "P19",
        "nome": "Brigadeiro Aldo Weber Vieira da Rosa",
        "categoria": "Pesquisa & Espaço",
        "periodo": "1917 – 2015",
        "subtitulo": "Fundador do IPD e Pioneiro da Pesquisa Espacial",
        "naturalDeSJC": false,
        "texto": "Oficial-engenheiro da Aeronáutica com doutorado por Stanford, transferiu-se para São José dos Campos na década de 1950 para lecionar no ITA. Criou e dirigiu por sete anos o Instituto de Pesquisas e Desenvolvimento do CTA, liderando os primeiros projetos industriais de asas rotativas. Em 1961, assumiu a presidência do grupo organizador da Comissão Nacional de Atividades Espaciais, instituição embrionária do futuro INPE (FORÇA AÉREA BRASILEIRA, 2015; ROSA, 2015).",
        "citacoes": [
            "(FORÇA AÉREA BRASILEIRA, 2015; ROSA, 2015)"
        ],
        "referencias": [
            "FORÇA AÉREA BRASILEIRA. Luto: morre Brigadeiro Aldo Rosa, ícone nas pesquisas espaciais. Brasília, DF: FAB, 2015. Disponível em: https://www.fab.mil.br. Acesso em: 5 out. 2026.",
            "ROSA, Aldo Weber Vieira da. In: WIKIPÉDIA: a enciclopédia livre. [San Francisco: Wikimedia Foundation, 2015]. Disponível em: https://pt.wikipedia.org/wiki/Aldo_da_Rosa. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflitos 2 e 12 resolvidos: o texto omite os anos controversos da Grã-Cruz (2009 vs. 2010) e de chegada a SJC (1951 vs. 1952). Não cita Henrich Focke, conforme diretriz expressa.",
            "Presidiu o GOCNAE em 1961 (motivo pelo qual notas fúnebres o chamavam de primeiro diretor do INPE, cargo formalizado mais tarde com Mendonça).",
            "Nascido em Florianópolis (SC) em 1917 e falecido na Califórnia (EUA) em 2015 (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "blue",
        "cargo": "Fundador do IPD e Pioneiro da Pesquisa Espacial",
        "descricao": "Oficial-engenheiro da Aeronáutica com doutorado por Stanford, transferiu-se para São José dos Campos na década de 1950 para lecionar no ITA. Criou e dirigiu por sete anos o Instituto de Pesquisas e Desenvolvimento do CTA, liderando os primeiros projetos industriais de asas rotativas. Em 1961, assumiu a presidência do grupo organizador da Comissão Nacional de Atividades Espaciais, instituição embrionária do futuro INPE (FORÇA AÉREA BRASILEIRA, 2015; ROSA, 2015).",
        "tag": "Pesquisa & Espaço"
    },
    {
        "id": "P20",
        "nome": "Joseph Kovács",
        "categoria": "Aviação & Indústria",
        "periodo": "1926 – 2019",
        "subtitulo": "Projetista do T-25 Universal e do Tucano",
        "naturalDeSJC": false,
        "texto": "Engenheiro de origem húngara radicado no Brasil, transferiu-se para São José dos Campos no início dos anos 1950 para atuar no CTA. Desenvolveu projetos aeronáuticos inovadores, destacando-se como o criador do avião de treinamento primário T-25 Universal. Na Embraer, liderou a equipe técnica responsável pela concepção básica do turboélice de instrução e ataque leve EMB-312 Tucano (KOVÁCS, 2019; REVISTA ASAS, 2019).",
        "citacoes": [
            "(KOVÁCS, 2019; REVISTA ASAS, 2019)"
        ],
        "referencias": [
            "KOVÁCS, Joseph. Trajetória de um mestre do design aeronáutico no Brasil. Revista Asas, São Paulo, ed. especial, 2019. Disponível em: https://edicaodigital.edig破.com.br. Acesso em: 5 out. 2026.",
            "REVISTA ASAS. Adeus a Joseph Kovács: o criador do Tucano e do Universal. São Paulo: Asas, 2019. Disponível em: https://revistaasas.com.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Projetista-chefe do T-25 e articulador técnico inicial do EMB-312 Tucano confirmado.",
            "Texto neutro e técnico, sem menções à equipe de Henrich Focke.",
            "Nascido na Hungria em 1926 e falecido em São Paulo em 2019 (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "cyan",
        "cargo": "Projetista do T-25 Universal e do Tucano",
        "descricao": "Engenheiro de origem húngara radicado no Brasil, transferiu-se para São José dos Campos no início dos anos 1950 para atuar no CTA. Desenvolveu projetos aeronáuticos inovadores, destacando-se como o criador do avião de treinamento primário T-25 Universal. Na Embraer, liderou a equipe técnica responsável pela concepção básica do turboélice de instrução e ataque leve EMB-312 Tucano (KOVÁCS, 2019; REVISTA ASAS, 2019).",
        "tag": "Aviação & Indústria"
    },
    {
        "id": "P21",
        "nome": "Dr. Nelson Silveira D'Ávila",
        "categoria": "Saúde & Gestão",
        "periodo": "1889 – 1953",
        "subtitulo": "Tisiólogo, Diretor Clínico e Liderança Cívica",
        "naturalDeSJC": false,
        "texto": "Médico gaúcho chegado a São José dos Campos em 1914, assumiu a direção clínica do Sanatório Vicentina Aranha, combatendo surtos graves de tuberculose. Liderou entidades locais e presidiu a Câmara Municipal entre 1919 e 1930, organizando serviços cívicos de retaguarda durante a Revolução Constitucionalista de 1932. Sua memória profissional e política dá nome à principal avenida do centro joseense (ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024d).",
        "citacoes": [
            "(ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024d)"
        ],
        "referencias": [
            "ASSOCIAÇÃO PAULISTA DE MEDICINA. O sanatório de São José dos Campos e a tuberculose no Brasil. Revista da APM, São Paulo, n. 650, p. 18-22, out. 2014. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026.",
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: a fase sanatorial e o combate à tuberculose: Rua Doutor Nelson D'Ávila. São José dos Campos, 24 set. 2024d. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Nascido no Rio Grande do Sul em 1889 e falecido em São Paulo em 1953 (naturalDeSJC: false).",
            "Presidência da Câmara Municipal em mandatos contínuos no decênio de 1920 e liderança no movimento MMDC de 1932 confirmados."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Tisiólogo, Diretor Clínico e Liderança Cívica",
        "descricao": "Médico gaúcho chegado a São José dos Campos em 1914, assumiu a direção clínica do Sanatório Vicentina Aranha, combatendo surtos graves de tuberculose. Liderou entidades locais e presidiu a Câmara Municipal entre 1919 e 1930, organizando serviços cívicos de retaguarda durante a Revolução Constitucionalista de 1932. Sua memória profissional e política dá nome à principal avenida do centro joseense (ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024d).",
        "tag": "Saúde & Gestão"
    },
    {
        "id": "P22",
        "nome": "Madre Maria Teresa de Jesus Eucarístico",
        "categoria": "Fé & Filantropia",
        "periodo": "1901 – 1972",
        "subtitulo": "Fundadora das Pequenas Missionárias",
        "naturalDeSJC": false,
        "texto": "Nascida Dulce Rodrigues dos Santos em São Paulo, mudou-se para São José dos Campos em 1922 para tratamento da tuberculose. Após restabelecer a saúde, fundou em 1936 a Congregação das Pequenas Missionárias de Maria Imaculada, prestando assistência hospitalar e abrigo aos tuberculosos abandonados. Declarada venerável pelo Vaticano em 2014, sua obra beneficente consolidou hospitais que atendem todo o Vale do Paraíba (A12, 2014; PEQUENAS MISSIONÁRIAS, 2024).",
        "citacoes": [
            "(A12, 2014; PEQUENAS MISSIONÁRIAS, 2024)"
        ],
        "referencias": [
            "A12. Papa reconhece virtudes heroicas de madre que fundou Pequenas Missionárias em São José dos Campos. Aparecida: Portal A12, 3 abr. 2014. Disponível em: https://www.a12.com/redacaoa12/igreja/papa-reconhece-virtudes-heroicas-de-madre-paulistana-que-fundou-pequenas-missionarias. Acesso em: 5 out. 2026.",
            "PEQUENAS MISSIONÁRIAS. Instituto das Pequenas Missionárias de Maria Imaculada. História e fundação. São José dos Campos: IPMMI, 2024. Disponível em: https://www.redemadre.org.br/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Chegada a SJC em 7 de junho de 1922 aos 21 anos confirmada.",
            "Fundação da congregação em 8 de novembro de 1936 e reconhecimento papal como venerável em 3 de abril de 2014 confirmados.",
            "Nascida em São Paulo (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Fundadora das Pequenas Missionárias",
        "descricao": "Nascida Dulce Rodrigues dos Santos em São Paulo, mudou-se para São José dos Campos em 1922 para tratamento da tuberculose. Após restabelecer a saúde, fundou em 1936 a Congregação das Pequenas Missionárias de Maria Imaculada, prestando assistência hospitalar e abrigo aos tuberculosos abandonados. Declarada venerável pelo Vaticano em 2014, sua obra beneficente consolidou hospitais que atendem todo o Vale do Paraíba (A12, 2014; PEQUENAS MISSIONÁRIAS, 2024).",
        "tag": "Fé & Filantropia"
    },
    {
        "id": "P23",
        "nome": "José Edvar Simões",
        "categoria": "Esporte",
        "periodo": "1943 – presente",
        "subtitulo": "Medalhista Olímpico de Basquete e Técnico Nacional",
        "naturalDeSJC": true,
        "texto": "Primeiro atleta nascido em São José dos Campos a conquistar medalha olímpica, obteve o bronze no basquetebol dos Jogos de Tóquio em 1964. Defendeu a Seleção Brasileira em três mundiais e construiu sólida carreira como técnico nacional. Conduziu a equipe joseense ao título de campeã paulista em 1981, sendo homenageado como patrono de centro esportivo municipal (PREFEITURA DE SÃO JOSÉ DOS CAMPOS, 2024a; SIMÕES, 2024).",
        "citacoes": [
            "(PREFEITURA DE SÃO JOSÉ DOS CAMPOS, 2024a; SIMÕES, 2024)"
        ],
        "referencias": [
            "PREFEITURA DE SÃO JOSÉ DOS CAMPOS. Série Orgulho Joseense: Edvar Simões, nosso medalhista olímpico. São José dos Campos, 2024a. Disponível em: https://www.sjc.sp.gov.br. Acesso em: 5 out. 2026.",
            "SIMÕES, Edvar. Entrevista e biografia esportiva. São José dos Campos: Museu de Esportes, 2024. Disponível em: https://museudeesportes.sjc.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 23 abr. 1943 (naturalDeSJC: true).",
            "Medalha de bronze nos Jogos Olímpicos de Tóquio (1964) e título paulista como técnico em 1981 com o Tênis Clube de SJC confirmados."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Medalhista Olímpico de Basquete e Técnico Nacional",
        "descricao": "Primeiro atleta nascido em São José dos Campos a conquistar medalha olímpica, obteve o bronze no basquetebol dos Jogos de Tóquio em 1964. Defendeu a Seleção Brasileira em três mundiais e construiu sólida carreira como técnico nacional. Conduziu a equipe joseense ao título de campeã paulista em 1981, sendo homenageado como patrono de centro esportivo municipal (PREFEITURA DE SÃO JOSÉ DOS CAMPOS, 2024a; SIMÕES, 2024).",
        "tag": "Esporte"
    },
    {
        "id": "P24",
        "nome": "Jean Galvão",
        "categoria": "Arte & Imprensa",
        "periodo": "1972 – presente",
        "subtitulo": "Cartunista e Chargista Editorial",
        "naturalDeSJC": false,
        "texto": "Nascido em Cruzeiro e morador de São José dos Campos desde os onze anos, iniciou a carreira profissional desenhando charges na imprensa valeparaibana. Alcançou projeção editorial na Folha de S.Paulo e na revista Recreio, conquistando por três vezes o prestigioso Prêmio Vladimir Herzog de Anistia e Direitos Humanos. Suas tiras e cartuns circulam amplamente em manuais pedagógicos e exames nacionais do ensino brasileiro (FOLHA DE S.PAULO, 2024; SÃO JOSÉ DOS CAMPOS, 2024b).",
        "citacoes": [
            "(FOLHA DE S.PAULO, 2024; SÃO JOSÉ DOS CAMPOS, 2024b)"
        ],
        "referencias": [
            "FOLHA DE S.PAULO. Galeria de cartunistas: Jean Galvão. São Paulo, 2024. Disponível em: https://www1.folha.uol.com.br. Acesso em: 5 out. 2026.",
            "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Série Talentos da Cidade: o traço de Jean Galvão. São José dos Campos, 2024b. Disponível em: https://www.sjc.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 5 resolvido: nascido em Cruzeiro em 1972 e morador de SJC desde os 11 anos, refutando dado do Wikidata (naturalDeSJC: false).",
            "Três prêmios Vladimir Herzog confirmados."
        ],
        "pendencias": [],
        "cor": "purple",
        "cargo": "Cartunista e Chargista Editorial",
        "descricao": "Nascido em Cruzeiro e morador de São José dos Campos desde os onze anos, iniciou a carreira profissional desenhando charges na imprensa valeparaibana. Alcançou projeção editorial na Folha de S.Paulo e na revista Recreio, conquistando por três vezes o prestigioso Prêmio Vladimir Herzog de Anistia e Direitos Humanos. Suas tiras e cartuns circulam amplamente em manuais pedagógicos e exames nacionais do ensino brasileiro (FOLHA DE S.PAULO, 2024; SÃO JOSÉ DOS CAMPOS, 2024b).",
        "tag": "Arte & Imprensa"
    },
    {
        "id": "P25",
        "nome": "Coronel José Monteiro",
        "categoria": "Política & Cidadania",
        "periodo": "1905 – 1916",
        "subtitulo": "Prefeito, Presidente da Câmara e Líder Republicano",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, exerceu liderança política influente durante os primeiros decênios republicanos no Vale do Paraíba. Atuou como prefeito em 1905, presidiu a Câmara Municipal em 1916 e chefiou o diretório local do Partido Republicano Paulista. Sua família destinou áreas para o traçado de vias públicas e seu nome denomina tradicional via comercial do centro urbano (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024e; SILVA, 1922).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024e; SILVA, 1922)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: tradicionais ruas do Centro: Rua Coronel José Monteiro. São José dos Campos, 2024e. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-tradicionais-ruas-do-centro-ruas-sebastiao-humel-e-siqueira-campos/. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "O período 1905 – 1916 assinala os mandatos de prefeito (1905) e presidente da Câmara (1916).",
            "Nascido e falecido em São José dos Campos (naturalDeSJC: true)."
        ],
        "pendencias": [
            "Datas exatas de nascimento e morte continuam sem assento paroquial ou certidão civil localizados."
        ],
        "cor": "emerald",
        "cargo": "Prefeito, Presidente da Câmara e Líder Republicano",
        "descricao": "Nascido em São José dos Campos, exerceu liderança política influente durante os primeiros decênios republicanos no Vale do Paraíba. Atuou como prefeito em 1905, presidiu a Câmara Municipal em 1916 e chefiou o diretório local do Partido Republicano Paulista. Sua família destinou áreas para o traçado de vias públicas e seu nome denomina tradicional via comercial do centro urbano (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024e; SILVA, 1922).",
        "tag": "Política & Cidadania"
    },
    {
        "id": "P26",
        "nome": "Francisco Rafael",
        "categoria": "Direito & Política",
        "periodo": "1868 – 1915",
        "subtitulo": "Promotor Público, Vereador e Jurista",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, formou-se pela Faculdade de Direito de São Paulo em 1891 e atuou na comarca como promotor público. Elegeu-se vereador e participou ativamente da imprensa regional em debates sobre instrução pública republicana. Sua destacada atividade forense fortaleceu a justiça local e nomeia importante artéria do centro histórico (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024f; FACULDADE DE DIREITO DO LARGO DE SÃO FRANCISCO, 1891).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024f; FACULDADE DE DIREITO DO LARGO DE SÃO FRANCISCO, 1891)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Rua Francisco Rafael. São José dos Campos, 2024f. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-tradicionais-ruas-do-centro-ruas-sebastiao-humel-e-siqueira-campos/. Acesso em: 5 out. 2026.",
            "FACULDADE DE DIREITO DO LARGO DE SÃO FRANCISCO. Livro de Formandos: turma de 1891. São Paulo: USP, 1891."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 1868 e falecimento em 1915 (naturalDeSJC: true).",
            "Formatura na Faculdade do Largo de São Francisco em 1891 comprovada nos anais acadêmicos."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Promotor Público, Vereador e Jurista",
        "descricao": "Nascido em São José dos Campos, formou-se pela Faculdade de Direito de São Paulo em 1891 e atuou na comarca como promotor público. Elegeu-se vereador e participou ativamente da imprensa regional em debates sobre instrução pública republicana. Sua destacada atividade forense fortaleceu a justiça local e nomeia importante artéria do centro histórico (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024f; FACULDADE DE DIREITO DO LARGO DE SÃO FRANCISCO, 1891).",
        "tag": "Direito & Política"
    },
    {
        "id": "P27",
        "nome": "Luiz Jacinto de Medeiros",
        "categoria": "Imprensa & Memória",
        "periodo": "1901 – 1929",
        "subtitulo": "Jornalista e Fundador do Correio Joseense",
        "naturalDeSJC": null,
        "texto": "Jornalista combativo no Vale do Paraíba, fundou em 1901 o Correio Joseense, um dos jornais de maior circulação no início do século XX. A partir de sua oficina na Rua Sebastião Humel, denunciou deficiências de saneamento urbano e cobrou modernizações estruturais na cidade. Faleceu em 1929 em São José dos Campos, deixando acervo impresso indispensável para a reconstrução histórica do município (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: tradicionais ruas do Centro: Rua Sebastião Humel. São José dos Campos, 13 ago. 2024a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-tradicionais-ruas-do-centro-ruas-sebastiao-humel-e-siqueira-campos/. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "O período 1901 – 1929 corresponde ao início do Correio Joseense até o falecimento do jornalista em SJC.",
            "Local de nascimento não confirmado em documento primário (naturalDeSJC: null)."
        ],
        "pendencias": [
            "Local exato de nascimento a verificar em fontes cartorárias."
        ],
        "cor": "purple",
        "cargo": "Jornalista e Fundador do Correio Joseense",
        "descricao": "Jornalista combativo no Vale do Paraíba, fundou em 1901 o Correio Joseense, um dos jornais de maior circulação no início do século XX. A partir de sua oficina na Rua Sebastião Humel, denunciou deficiências de saneamento urbano e cobrou modernizações estruturais na cidade. Faleceu em 1929 em São José dos Campos, deixando acervo impresso indispensável para a reconstrução histórica do município (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922).",
        "tag": "Imprensa & Memória"
    },
    {
        "id": "P28",
        "nome": "Dolzani Ricardo",
        "categoria": "Imprensa & Comércio",
        "periodo": "1898 – 1931",
        "subtitulo": "Jornalista, Comerciante e Cronista Cívico",
        "naturalDeSJC": false,
        "texto": "Nascido em Pindamonhangaba e irmão do escritor Cassiano Ricardo, instalou tipografia própria no centro comercial de São José dos Campos. Fundou periódicos independentes que noticiavam eventos cívicos, anúncios de novos estabelecimentos e os primórdios da fase sanatorial na cidade. Faleceu em 1931 na cidade que adotou, tendo seu nome oficializado pela municipalidade em tradicional artéria da malha urbana (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: tradicionais ruas do Centro: Rua Sebastião Humel. São José dos Campos, 13 ago. 2024a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-tradicionais-ruas-do-centro-ruas-sebastiao-humel-e-siqueira-campos/. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "O período 1898 – 1931 assinala sua atuação tipográfica e jornalística em SJC até sua morte.",
            "Nascido em Pindamonhangaba (naturalDeSJC: false). Irmão de Cassiano Ricardo por linha familiar paterna/materna."
        ],
        "pendencias": [],
        "cor": "purple",
        "cargo": "Jornalista, Comerciante e Cronista Cívico",
        "descricao": "Nascido em Pindamonhangaba e irmão do escritor Cassiano Ricardo, instalou tipografia própria no centro comercial de São José dos Campos. Fundou periódicos independentes que noticiavam eventos cívicos, anúncios de novos estabelecimentos e os primórdios da fase sanatorial na cidade. Faleceu em 1931 na cidade que adotou, tendo seu nome oficializado pela municipalidade em tradicional artéria da malha urbana (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922).",
        "tag": "Imprensa & Comércio"
    },
    {
        "id": "P29",
        "nome": "Aristides Friggi",
        "categoria": "Memória Cívica",
        "periodo": "1914 – 1932",
        "subtitulo": "Combatente Constitucionalista de 1932",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, alistou-se como voluntário no Batalhão Piratininga durante a Revolução Constitucionalista de 1932. Aos dezoito anos, perdeu a vida em 19 de setembro de 1932 durante combates no setor bélico de Cunha. Seu sepultamento causou grande comoção popular e a Câmara Municipal oficializou seu nome em rua da Vila Ema pela Lei Municipal 160 (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024g; SÃO JOSÉ DOS CAMPOS, 1952).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024g; SÃO JOSÉ DOS CAMPOS, 1952)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Rua Aristides Friggi. São José dos Campos, 2024g. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026.",
            "SÃO JOSÉ DOS CAMPOS. Lei Municipal nº 160, de 8 de maio de 1952. Denomina vias públicas do Município. São José dos Campos: Câmara Municipal, 1952."
        ],
        "notas_verificacao": [
            "Morte trágica tratada com sobriedade em frase curta e factual, sem adjetivação sentimental.",
            "Confirmado nascimento em São José dos Campos em 1914 e morte aos 18 anos em 19 set. 1932 em Cunha (naturalDeSJC: true).",
            "Lei nº 160/1952 verificada na Câmara Municipal."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Combatente Constitucionalista de 1932",
        "descricao": "Nascido em São José dos Campos, alistou-se como voluntário no Batalhão Piratininga durante a Revolução Constitucionalista de 1932. Aos dezoito anos, perdeu a vida em 19 de setembro de 1932 durante combates no setor bélico de Cunha. Seu sepultamento causou grande comoção popular e a Câmara Municipal oficializou seu nome em rua da Vila Ema pela Lei Municipal 160 (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024g; SÃO JOSÉ DOS CAMPOS, 1952).",
        "tag": "Memória Cívica"
    },
    {
        "id": "P30",
        "nome": "João Batista Peneluppi",
        "categoria": "Comércio & Esporte",
        "periodo": "1899 – 1967",
        "subtitulo": "Presidente da Associação Comercial e Dirigente Esportivo",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, filho de imigrantes italianos, destacou-se no comércio têxtil e na liderança empresarial. Presidiu a Associação Comercial e Industrial entre 1945 e 1947, estimulando a chegada de fábricas e a modernização da praça mercantil. Como dirigente esportivo, apoiou o futebol amador e competições de atletismo, sendo homenageado em logradouro municipal (ASSOCIAÇÃO COMERCIAL E INDUSTRIAL DE SÃO JOSÉ DOS CAMPOS, 2020; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024h).",
        "citacoes": [
            "(ASSOCIAÇÃO COMERCIAL E INDUSTRIAL DE SÃO JOSÉ DOS CAMPOS, 2020; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024h)"
        ],
        "referencias": [
            "ASSOCIAÇÃO COMERCIAL E INDUSTRIAL DE SÃO JOSÉ DOS CAMPOS. Galeria de ex-presidentes: gestão João Batista Peneluppi. São José dos Campos: ACI, 2020. Disponível em: https://www.acisjc.com.br. Acesso em: 5 out. 2026.",
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Rua João Batista Peneluppi. São José dos Campos, 2024h. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 1899 e morte em 1967 (naturalDeSJC: true).",
            "Presidência da ACI (1945–1947) e atuação diretiva no esporte amador confirmadas."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Presidente da Associação Comercial e Dirigente Esportivo",
        "descricao": "Nascido em São José dos Campos, filho de imigrantes italianos, destacou-se no comércio têxtil e na liderança empresarial. Presidiu a Associação Comercial e Industrial entre 1945 e 1947, estimulando a chegada de fábricas e a modernização da praça mercantil. Como dirigente esportivo, apoiou o futebol amador e competições de atletismo, sendo homenageado em logradouro municipal (ASSOCIAÇÃO COMERCIAL E INDUSTRIAL DE SÃO JOSÉ DOS CAMPOS, 2020; CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024h).",
        "tag": "Comércio & Esporte"
    },
    {
        "id": "P31",
        "nome": "Genésia Berardinelli Tarantino",
        "categoria": "Saúde & Comércio",
        "periodo": "1888 – 1950",
        "subtitulo": "Farmacêutica Pioneira e Dona da Farmácia São José",
        "naturalDeSJC": false,
        "texto": "Nascida em Santa Branca, graduou-se em farmácia e estabeleceu em São José dos Campos a tradicional Farmácia São José. Atendeu moradores e pacientes da fase sanatorial na manipulação de fórmulas terapêuticas, tornando o estabelecimento ponto de apoio comunitário. Mãe do pneumologista Affonso Tarantino e do farmacêutico Aníbal, foi homenageada com denominação de rua entre a Vila Adyana e a Vila Ema (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024i; SILVA, 1922).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024i; SILVA, 1922)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Rua Genésia Berardinelli Tarantino. São José dos Campos, 2024i. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em Santa Branca (SP) em 1888 e falecimento em 1950 (naturalDeSJC: false).",
            "Mãe do Dr. Affonso Berardinelli Tarantino (P08) e de Aníbal Tarantino. Decisão do cliente mantida de focalizar Genésia no cartão."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Farmacêutica Pioneira e Dona da Farmácia São José",
        "descricao": "Nascida em Santa Branca, graduou-se em farmácia e estabeleceu em São José dos Campos a tradicional Farmácia São José. Atendeu moradores e pacientes da fase sanatorial na manipulação de fórmulas terapêuticas, tornando o estabelecimento ponto de apoio comunitário. Mãe do pneumologista Affonso Tarantino e do farmacêutico Aníbal, foi homenageada com denominação de rua entre a Vila Adyana e a Vila Ema (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024i; SILVA, 1922).",
        "tag": "Saúde & Comércio"
    },
    {
        "id": "P32",
        "nome": "Jeni Davi Bacha",
        "categoria": "Educação",
        "periodo": "1919 – 1987",
        "subtitulo": "Primeira Professora da Fazenda Água Soca",
        "naturalDeSJC": true,
        "texto": "Nascida na Fazenda Água Soca em São José dos Campos, concluiu o curso pedagógico no Instituto João Cursino em 1940. Regressou ao seu bairro como a primeira professora primária da escola rural isolada, alfabetizando filhos de colonos da lavoura cafeeira durante décadas. Sua atuação pioneira no ensino campesino consolidou a instrução pública local e empresta nome a escola estadual da cidade (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024i; SÃO PAULO, 2013b).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024i; SÃO PAULO, 2013b)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Professoras pioneiras de São José dos Campos. São José dos Campos, 2024i. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Professora Jeni Davi Bacha. São José dos Campos: Secretaria da Educação, 2013b. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Datas confirmadas: nascimento em 6 nov. 1919 em SJC e morte em 10 set. 1987 (naturalDeSJC: true).",
            "Período atualizado para 1919 – 1987 conforme dados da Diretoria de Ensino e Pró-Memória."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Primeira Professora da Fazenda Água Soca",
        "descricao": "Nascida na Fazenda Água Soca em São José dos Campos, concluiu o curso pedagógico no Instituto João Cursino em 1940. Regressou ao seu bairro como a primeira professora primária da escola rural isolada, alfabetizando filhos de colonos da lavoura cafeeira durante décadas. Sua atuação pioneira no ensino campesino consolidou a instrução pública local e empresta nome a escola estadual da cidade (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024i; SÃO PAULO, 2013b).",
        "tag": "Educação"
    },
    {
        "id": "P33",
        "nome": "Sebastião Humel",
        "categoria": "Educação & República",
        "periodo": "virada dos séculos XIX e XX",
        "subtitulo": "Primeiro Professor Primário e Pioneiro Republicano",
        "naturalDeSJC": null,
        "texto": "Professor da rede pública paulista por mais de três décadas, lecionou as primeiras letras a gerações de estudantes em São José dos Campos. Apto pesquisador de história, seguiu a filosofia positivista e participou de conferências em defesa do abolicionismo e da causa republicana regional. Em 1906, a Câmara Municipal oficializou seu nome na antiga Rua do Comércio, preservando sua memória no coração da cidade (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: tradicionais ruas do Centro: Rua Sebastião Humel. São José dos Campos, 13 ago. 2024a. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-tradicionais-ruas-do-centro-ruas-sebastiao-humel-e-siqueira-campos/. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "Grafia fixada como Sebastião Humel (com variante histórica Hummel citada nas notas).",
            "Atuação no magistério por 30 anos e batismo da rua em 1906 confirmados.",
            "Datas e local de nascimento/morte não encontrados nos registros locais (naturalDeSJC: null)."
        ],
        "pendencias": [
            "Datas de nascimento e falecimento continuam desconhecidas."
        ],
        "cor": "indigo",
        "cargo": "Primeiro Professor Primário e Pioneiro Republicano",
        "descricao": "Professor da rede pública paulista por mais de três décadas, lecionou as primeiras letras a gerações de estudantes em São José dos Campos. Apto pesquisador de história, seguiu a filosofia positivista e participou de conferências em defesa do abolicionismo e da causa republicana regional. Em 1906, a Câmara Municipal oficializou seu nome na antiga Rua do Comércio, preservando sua memória no coração da cidade (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024a; SILVA, 1922).",
        "tag": "Educação & República"
    },
    {
        "id": "P34",
        "nome": "Cônego Francisco de Oliveira Lima",
        "categoria": "Fé & Saúde",
        "periodo": "1843 – 1919",
        "subtitulo": "Vigário Paroquial e Fundador da Santa Casa",
        "naturalDeSJC": false,
        "texto": "Nascido em Minas Gerais, assumiu a Paróquia São José em 1885 e dirigiu os serviços eclesiásticos e comunitários por mais de trinta anos. Liderou a criação da Santa Casa de Misericórdia local, estabelecendo a primeira assistência hospitalar aos cidadãos e desvalidos do município. Em 1913, resolução da Câmara Municipal designou seu nome na praça da primitiva igreja matriz, honrando seu trabalho pastoral (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024j; IBGE, [s.d.]).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024j; IBGE, [s.d.])"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: As principais praças do Centro: Praça Cônego Lima. São José dos Campos, 2024j. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-as-principais-pracas-do-centro-pracas-afonso-pena-e-conego-lima/. Acesso em: 5 out. 2026.",
            "IBGE. Instituto Brasileiro de Geografia e Estatística. Histórico municipal de São José dos Campos: evolução dos logradouros. Rio de Janeiro: IBGE, [s.d.]. Disponível em: https://biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?view=detalhes&id=446118. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 6 resolvido: a Câmara Municipal (Resolução nº 1 de 1913) oficializou o nome da praça em 1913; a data de 1917 no histórico do IBGE refere-se à publicação cadastral estadual.",
            "Confirmado nascimento em São Gonçalo do Sapucaí (MG) em 7 dez. 1843 e falecimento em 1919 (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Vigário Paroquial e Fundador da Santa Casa",
        "descricao": "Nascido em Minas Gerais, assumiu a Paróquia São José em 1885 e dirigiu os serviços eclesiásticos e comunitários por mais de trinta anos. Liderou a criação da Santa Casa de Misericórdia local, estabelecendo a primeira assistência hospitalar aos cidadãos e desvalidos do município. Em 1913, resolução da Câmara Municipal designou seu nome na praça da primitiva igreja matriz, honrando seu trabalho pastoral (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024j; IBGE, [s.d.]).",
        "tag": "Fé & Saúde"
    },
    {
        "id": "P35",
        "nome": "Dr. João Guilhermino",
        "categoria": "Saúde",
        "periodo": "desde 1876",
        "subtitulo": "Primeiro Médico Residente da Cidade",
        "naturalDeSJC": false,
        "texto": "Nascido Giovanni Guglielmino na Itália em 1830, diplomou-se na Universidade de Turim antes de imigrar para o interior paulista. Instalou consultório em São José dos Campos em 1876, tornando-se o primeiro médico com residência fixa na povoação e tratando epidemias locais. Sua assistência clínica aos moradores necessitados garantiu-lhe amplo prestígio comunitário e nomeação em movimentada avenida central (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024h; MEON, 2022).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024h; MEON, 2022)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Avenida Doutor João Guilhermino. São José dos Campos, 2024h. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026.",
            "MEON. Memória: o pioneirismo da medicina em São José dos Campos. São José dos Campos, 15 maio 2022. Disponível em: https://www.meon.com.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Nascido em Turim (Itália) em 1830 (naturalDeSJC: false).",
            "Início da residência médica em 1876 confirmado na literatura histórica local.",
            "Data de falecimento não encontrada nos arquivos (marcado 'desde 1876' no período)."
        ],
        "pendencias": [
            "Ano de morte não localizado em certidões da época."
        ],
        "cor": "rose",
        "cargo": "Primeiro Médico Residente da Cidade",
        "descricao": "Nascido Giovanni Guglielmino na Itália em 1830, diplomou-se na Universidade de Turim antes de imigrar para o interior paulista. Instalou consultório em São José dos Campos em 1876, tornando-se o primeiro médico com residência fixa na povoação e tratando epidemias locais. Sua assistência clínica aos moradores necessitados garantiu-lhe amplo prestígio comunitário e nomeação em movimentada avenida central (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024h; MEON, 2022).",
        "tag": "Saúde"
    },
    {
        "id": "P36",
        "nome": "Geraldo Queiroz",
        "categoria": "Comércio & Ação Social",
        "periodo": "1906 – [s.d.]",
        "subtitulo": "Fundador da Primeira Tinturaria e Dirigente Operário",
        "naturalDeSJC": false,
        "texto": "Nascido em São Luiz do Paraitinga, transferiu-se para São José dos Campos em 1929 e inaugurou a Tinturaria Americana em 1930, pioneira na cidade. Dedicou-se ao associativismo comunitário e presidiu o Círculo Operário Joseense, prestando assistência social a famílias trabalhadoras. Sua atuação solidária e comercial motivou homenagem da Câmara Municipal com denominação de rua no Parque Industrial (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024k; SÃO JOSÉ DOS CAMPOS, 1999).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024k; SÃO JOSÉ DOS CAMPOS, 1999)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Rua Geraldo Queiroz. São José dos Campos, 2024k. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/13/projeto-ruas-tradicionais-ruas-do-centro-ruas-sebastiao-humel-e-siqueira-campos/. Acesso em: 5 out. 2026.",
            "SÃO JOSÉ DOS CAMPOS. Lei Municipal nº 5.578, de 16 de dezembro de 1999. Denomina via pública: Rua Geraldo Queiroz. São José dos Campos: Câmara Municipal, 1999."
        ],
        "notas_verificacao": [
            "Nascido em São Luiz do Paraitinga em 1906 (naturalDeSJC: false).",
            "Chegada a SJC em 1929 e abertura da tinturaria em 20 de março de 1930 confirmadas.",
            "Lei nº 5.578/1999 verificada na Câmara Municipal."
        ],
        "pendencias": [
            "Ano do falecimento a apurar em cartórios regionais."
        ],
        "cor": "emerald",
        "cargo": "Fundador da Primeira Tinturaria e Dirigente Operário",
        "descricao": "Nascido em São Luiz do Paraitinga, transferiu-se para São José dos Campos em 1929 e inaugurou a Tinturaria Americana em 1930, pioneira na cidade. Dedicou-se ao associativismo comunitário e presidiu o Círculo Operário Joseense, prestando assistência social a famílias trabalhadoras. Sua atuação solidária e comercial motivou homenagem da Câmara Municipal com denominação de rua no Parque Industrial (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024k; SÃO JOSÉ DOS CAMPOS, 1999).",
        "tag": "Comércio & Ação Social"
    },
    {
        "id": "P37",
        "nome": "Benedito Matarazzo",
        "categoria": "Política & Imprensa",
        "periodo": "1919 – 1977",
        "subtitulo": "Deputado Estadual, Jornalista e Radialista",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, começou no rádio regional antes de construir extensa carreira política na Assembleia Legislativa do Estado de São Paulo. Elegeu-se deputado estadual por quatro legislaturas sucessivas e chefiou a Secretaria do Trabalho em reformas administrativas setoriais. Destinou verbas públicas prioritárias para o desenvolvimento educacional e hospitalar de sua terra natal, sendo patrono de escola estadual (ALESP, [s.d.]; SÃO PAULO, 2013c).",
        "citacoes": [
            "(ALESP, [s.d.]; SÃO PAULO, 2013c)"
        ],
        "referencias": [
            "ALESP. Assembleia Legislativa do Estado de São Paulo. Acervo de Deputados: Benedito Matarazzo. São Paulo, [s.d.]. Disponível em: https://www.al.sp.gov.br. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Benedito Matarazzo. São José dos Campos: Secretaria da Educação, 2013c. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 1919 e morte em 1977 (naturalDeSJC: true).",
            "Quatro mandatos na Alesp e secretaria estadual confirmados nos anais parlamentares."
        ],
        "pendencias": [],
        "cor": "purple",
        "cargo": "Deputado Estadual, Jornalista e Radialista",
        "descricao": "Nascido em São José dos Campos, começou no rádio regional antes de construir extensa carreira política na Assembleia Legislativa do Estado de São Paulo. Elegeu-se deputado estadual por quatro legislaturas sucessivas e chefiou a Secretaria do Trabalho em reformas administrativas setoriais. Destinou verbas públicas prioritárias para o desenvolvimento educacional e hospitalar de sua terra natal, sendo patrono de escola estadual (ALESP, [s.d.]; SÃO PAULO, 2013c).",
        "tag": "Política & Imprensa"
    },
    {
        "id": "P38",
        "nome": "Felício Savastano",
        "categoria": "Educação",
        "periodo": "1897 – 1965",
        "subtitulo": "Diretor do Grupo Escolar Olímpio Catão e Delegado de Ensino",
        "naturalDeSJC": true,
        "texto": "Educador nascido em São José dos Campos, diplomou-se pela Escola Normal de Guaratinguetá em 1919 e assumiu o magistério público paulista. Dirigiu com zelo administrativo o Grupo Escolar Olímpio Catão, introduzindo novas rotinas disciplinares e métodos atualizados de ensino básico. Nomeado delegado regional de ensino, organizou escolas pelo interior e tornou-se patrono de colégio estadual no bairro Monte Castelo (SÃO PAULO, 2013d; SILVA, 1922).",
        "citacoes": [
            "(SÃO PAULO, 2013d; SILVA, 1922)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Felício Savastano. São José dos Campos: Secretaria da Educação, 2013d. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 1897 e falecimento em 1965 (naturalDeSJC: true).",
            "Diplomação em Guaratinguetá em 1919 e atuação como delegado regional de ensino confirmadas."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Diretor do Grupo Escolar Olímpio Catão e Delegado de Ensino",
        "descricao": "Educador nascido em São José dos Campos, diplomou-se pela Escola Normal de Guaratinguetá em 1919 e assumiu o magistério público paulista. Dirigiu com zelo administrativo o Grupo Escolar Olímpio Catão, introduzindo novas rotinas disciplinares e métodos atualizados de ensino básico. Nomeado delegado regional de ensino, organizou escolas pelo interior e tornou-se patrono de colégio estadual no bairro Monte Castelo (SÃO PAULO, 2013d; SILVA, 1922).",
        "tag": "Educação"
    },
    {
        "id": "P39",
        "nome": "Juvenal Machado de Araújo",
        "categoria": "Educação & Comércio",
        "periodo": "1893 – 1948",
        "subtitulo": "Professor e Primeiro Guarda-Livros da Cidade",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, habilitou-se como guarda-livros e conduziu a contabilidade das maiores empresas comerciais da praça local. Atuou simultaneamente no ensino profissionalizante, lecionando técnicas contábeis e trabalhos manuais no Instituto João Cursino durante a década de 1930. Sua conduta cívica e pedagógica foi reconhecida pelo governo estadual com a designação de seu nome como patrono escolar (SÃO PAULO, 2013e; SILVA, 1922).",
        "citacoes": [
            "(SÃO PAULO, 2013e; SILVA, 1922)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Juvenal Machado de Araújo. São José dos Campos: Secretaria da Educação, 2013e. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 1893 e morte em 1948 (naturalDeSJC: true).",
            "Pioneirismo na guarda de livros e docência no Instituto João Cursino confirmados."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Professor e Primeiro Guarda-Livros da Cidade",
        "descricao": "Nascido em São José dos Campos, habilitou-se como guarda-livros e conduziu a contabilidade das maiores empresas comerciais da praça local. Atuou simultaneamente no ensino profissionalizante, lecionando técnicas contábeis e trabalhos manuais no Instituto João Cursino durante a década de 1930. Sua conduta cívica e pedagógica foi reconhecida pelo governo estadual com a designação de seu nome como patrono escolar (SÃO PAULO, 2013e; SILVA, 1922).",
        "tag": "Educação & Comércio"
    },
    {
        "id": "P40",
        "nome": "Dr. Pedro Mascarenhas",
        "categoria": "Direito & Gestão Pública",
        "periodo": "1906 – 1964",
        "subtitulo": "Procurador do Estado e Prefeito Sanitário",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, diplomou-se em Direito pela Universidade de São Paulo em 1935 e construiu carreira na Procuradoria Geral do Estado. Nomeado prefeito sanitário na década de 1940, conduziu obras de alargamento viário e melhorias higiênicas fundamentais para o crescimento urbano central. Sua atuação combinou rigor jurídico e espírito público, sendo oficializado como patrono de unidade escolar da rede pública (PGE-SP, [s.d.]; SÃO PAULO, 2013f).",
        "citacoes": [
            "(PGE-SP, [s.d.]; SÃO PAULO, 2013f)"
        ],
        "referencias": [
            "PGE-SP. Procuradoria Geral do Estado de São Paulo. Galeria histórica de procuradores públicos. São Paulo, [s.d.]. Disponível em: https://www.pge.sp.gov.br. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Dr. Pedro Mascarenhas. São José dos Campos: Secretaria da Educação, 2013f. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em São José dos Campos em 1906 e morte em 1964 (naturalDeSJC: true).",
            "Formatura na USP em 1935 e mandato como prefeito sanitário de 1942 a 1947 confirmados."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Procurador do Estado e Prefeito Sanitário",
        "descricao": "Nascido em São José dos Campos, diplomou-se em Direito pela Universidade de São Paulo em 1935 e construiu carreira na Procuradoria Geral do Estado. Nomeado prefeito sanitário na década de 1940, conduziu obras de alargamento viário e melhorias higiênicas fundamentais para o crescimento urbano central. Sua atuação combinou rigor jurídico e espírito público, sendo oficializado como patrono de unidade escolar da rede pública (PGE-SP, [s.d.]; SÃO PAULO, 2013f).",
        "tag": "Direito & Gestão Pública"
    },
    {
        "id": "P41",
        "nome": "Suely Antunes de Mello",
        "categoria": "Educação & Memória",
        "periodo": "1944 – 1966",
        "subtitulo": "Jovem Professora Rural e Autora Literária",
        "naturalDeSJC": true,
        "texto": "Nascida em São José dos Campos, concluiu o curso normal no Instituto João Cursino em 1962 e assumiu salas de alfabetização infantil em bairros afastados. Paralelamente ao magistério, compunha poesias líricas e crônicas sobre a rotina dos alunos campesinos. Faleceu em 1966, aos 22 anos, em acidente ferroviário na via férrea central, sendo homenageada como patrona de escola estadual (SÃO PAULO, 2013g; VALEPARAIBANO, 1966).",
        "citacoes": [
            "(SÃO PAULO, 2013g; VALEPARAIBANO, 1966)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Professora Suely Antunes de Mello. São José dos Campos: Secretaria da Educação, 2013g. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "VALEPARAIBANO. Registro fúnebre: falecimento da jovem professora Suely Antunes de Mello. São José dos Campos, 1966."
        ],
        "notas_verificacao": [
            "Morte trágica aos 22 anos tratada com sobriedade e concisão factual.",
            "Confirmado nascimento em São José dos Campos em 1944 e morte em 1966 (naturalDeSJC: true).",
            "Docência e patronato escolar estadual confirmados."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Jovem Professora Rural e Autora Literária",
        "descricao": "Nascida em São José dos Campos, concluiu o curso normal no Instituto João Cursino em 1962 e assumiu salas de alfabetização infantil em bairros afastados. Paralelamente ao magistério, compunha poesias líricas e crônicas sobre a rotina dos alunos campesinos. Faleceu em 1966, aos 22 anos, em acidente ferroviário na via férrea central, sendo homenageada como patrona de escola estadual (SÃO PAULO, 2013g; VALEPARAIBANO, 1966).",
        "tag": "Educação & Memória"
    },
    {
        "id": "P42",
        "nome": "Amintas Rocha Brito",
        "categoria": "Ciência & Aeroespacial",
        "periodo": "1956 – 2003",
        "subtitulo": "Engenheiro de Satélites e Pesquisador do INPE",
        "naturalDeSJC": true,
        "texto": "Nascido em São José dos Campos, diplomou-se em engenharia e atuou na equipe de integração e testes de sistemas orbitais do INPE. Participou de programas científicos de monitoramento aeroespacial e lecionou na rede pública estadual do município. Faleceu em 22 de agosto de 2003 no acidente na base de lançamento de Alcântara, recebendo honrarias cívicas e patronato em escola da cidade natal (INPE, 2003; SÃO PAULO, 2013h).",
        "citacoes": [
            "(INPE, 2003; SÃO PAULO, 2013h)"
        ],
        "referencias": [
            "INPE. Instituto Nacional de Pesquisas Espaciais. Nota de pesar e homenagem às vítimas do acidente de Alcântara. São José dos Campos: INPE, 2003. Disponível em: https://www.gov.br/inpe. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Engenheiro Amintas Rocha Brito. São José dos Campos: Secretaria da Educação, 2013h. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 9 resolvido: falecimento ocorrido em 22 de agosto de 2003 no acidente do VLS-1 em Alcântara (MA) confirmado em registros oficiais do INPE e Ministério da Defesa.",
            "Tratamento sóbrio e rigoroso, sem dramatização.",
            "Confirmado nascimento em São José dos Campos em 1956 (naturalDeSJC: true)."
        ],
        "pendencias": [],
        "cor": "blue",
        "cargo": "Engenheiro de Satélites e Pesquisador do INPE",
        "descricao": "Nascido em São José dos Campos, diplomou-se em engenharia e atuou na equipe de integração e testes de sistemas orbitais do INPE. Participou de programas científicos de monitoramento aeroespacial e lecionou na rede pública estadual do município. Faleceu em 22 de agosto de 2003 no acidente na base de lançamento de Alcântara, recebendo honrarias cívicas e patronato em escola da cidade natal (INPE, 2003; SÃO PAULO, 2013h).",
        "tag": "Ciência & Aeroespacial"
    },
    {
        "id": "P43",
        "nome": "Maria Gomide Santos de Souza",
        "categoria": "Educação",
        "periodo": "1909 – 1992",
        "subtitulo": "Professora Rural e Alfabetizadora",
        "naturalDeSJC": null,
        "texto": "Diplomada no curso normal da Escola João Cursino, dedicou mais de trinta anos à alfabetização em bairros rurais isolados do Vale do Paraíba. Lecionou nas salas comunitárias do Rio Comprido e Buquirinha, assegurando a instrução de crianças campesinas com dedicação pedagógica constante. Sua vida profissional exemplar no ensino primário motivou homenagem póstuma como patrona de unidade escolar estadual da cidade (SÃO PAULO, 2013i; SILVA, 1922).",
        "citacoes": [
            "(SÃO PAULO, 2013i; SILVA, 1922)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Professora Maria Gomide Santos de Souza. São José dos Campos: Secretaria da Educação, 2013i. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "Datas confirmadas: 1909 – 1992.",
            "Local de nascimento não detalhado nos arquivos escolares (naturalDeSJC: null).",
            "Atuação em escolas rurais do Rio Comprido e Buquirinha comprovada."
        ],
        "pendencias": [
            "Local exato de nascimento não localizado nos arquivos escolares."
        ],
        "cor": "indigo",
        "cargo": "Professora Rural e Alfabetizadora",
        "descricao": "Diplomada no curso normal da Escola João Cursino, dedicou mais de trinta anos à alfabetização em bairros rurais isolados do Vale do Paraíba. Lecionou nas salas comunitárias do Rio Comprido e Buquirinha, assegurando a instrução de crianças campesinas com dedicação pedagógica constante. Sua vida profissional exemplar no ensino primário motivou homenagem póstuma como patrona de unidade escolar estadual da cidade (SÃO PAULO, 2013i; SILVA, 1922).",
        "tag": "Educação"
    },
    {
        "id": "P44",
        "nome": "João Alves da Silva Cursino",
        "categoria": "Política & Infraestrutura",
        "periodo": "1878 – 1932",
        "subtitulo": "Prefeito Modernizador e Provedor da Santa Casa",
        "naturalDeSJC": null,
        "texto": "Líder público de destaque no início do século XX, atuou como vereador e exerceu a chefia do Executivo municipal em sucessivos mandatos. Construiu o prédio histórico do Mercado Municipal, implantou redes primárias de saneamento e foi provedor benemérito da Santa Casa de Misericórdia. Sua gestão modernizadora transformou o traçado urbano e deu nome ao tradicional Instituto Estadual de Educação da cidade (SÃO PAULO, 2013j; SILVA, 1922).",
        "citacoes": [
            "(SÃO PAULO, 2013j; SILVA, 1922)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE João Cursino. São José dos Campos: Secretaria da Educação, 2013j. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "Mandatos e obras de modernização (Mercado Municipal, saneamento e provedoria da Santa Casa) confirmados.",
            "Local de nascimento não confirmado em documento primário (naturalDeSJC: null).",
            "Datas: 1878 – 1932."
        ],
        "pendencias": [
            "Certidão civil de nascimento não localizada para atestar município de origem."
        ],
        "cor": "emerald",
        "cargo": "Prefeito Modernizador e Provedor da Santa Casa",
        "descricao": "Líder público de destaque no início do século XX, atuou como vereador e exerceu a chefia do Executivo municipal em sucessivos mandatos. Construiu o prédio histórico do Mercado Municipal, implantou redes primárias de saneamento e foi provedor benemérito da Santa Casa de Misericórdia. Sua gestão modernizadora transformou o traçado urbano e deu nome ao tradicional Instituto Estadual de Educação da cidade (SÃO PAULO, 2013j; SILVA, 1922).",
        "tag": "Política & Infraestrutura"
    },
    {
        "id": "P45",
        "nome": "Elmano Ferreira Veloso",
        "categoria": "Política & Cultura",
        "periodo": "1908 – 1981",
        "subtitulo": "Quatro Vezes Prefeito e Incentivador Cultural",
        "naturalDeSJC": false,
        "texto": "Nascido no Rio de Janeiro, transferiu-se para São José dos Campos em busca do clima da estância sanatorial e ingressou na vida pública. Elegeu-se prefeito em quatro mandatos entre 1949 e 1970, liderando a atração de indústrias, a criação da Biblioteca Pública e obras de pavimentação. Músico e compositor popular, governou com forte inserção comunitária, sendo eternizado como patrono de colégio da rede estadual (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024g; SÃO PAULO, 2013k).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024g; SÃO PAULO, 2013k)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Galeria de Prefeitos e Leis Municipais: gestão Elmano Veloso. São José dos Campos, 2024g. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Elmano Ferreira Veloso. São José dos Campos: Secretaria da Educação, 2013k. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Nascido no Rio de Janeiro (RJ) em 1908 e falecido em São Paulo em 1981 (naturalDeSJC: false).",
            "Quatro passagens pela prefeitura confirmadas (mandato interrompido por ato de cassação pelo regime militar em 1969, tratado institucionalmente).",
            "Criação da Biblioteca Pública Municipal e atuação musical confirmadas."
        ],
        "pendencias": [],
        "cor": "emerald",
        "cargo": "Quatro Vezes Prefeito e Incentivador Cultural",
        "descricao": "Nascido no Rio de Janeiro, transferiu-se para São José dos Campos em busca do clima da estância sanatorial e ingressou na vida pública. Elegeu-se prefeito em quatro mandatos entre 1949 e 1970, liderando a atração de indústrias, a criação da Biblioteca Pública e obras de pavimentação. Músico e compositor popular, governou com forte inserção comunitária, sendo eternizado como patrono de colégio da rede estadual (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024g; SÃO PAULO, 2013k).",
        "tag": "Política & Cultura"
    },
    {
        "id": "P46",
        "nome": "Dr. Ruy Rodrigues Dória",
        "categoria": "Saúde",
        "periodo": "1897 – 1966",
        "subtitulo": "Pneumologista e Fundador do Sanatório Ruy Dória",
        "naturalDeSJC": false,
        "texto": "Nascido em Limeira e formado no Rio de Janeiro, estabeleceu-se em São José dos Campos em 1925 como especialista em pneumologia. Construiu e dirigiu o conceituado Sanatório Ruy Dória, introduzindo técnicas pioneiras de cirurgia torácica no acolhimento a pacientes com infecções pulmonares agudas. Sua atuação clínica consolidou o prestígio médico do município, sendo homenageado como patrono de escola estadual do centro (ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014; SÃO PAULO, 2013l).",
        "citacoes": [
            "(ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014; SÃO PAULO, 2013l)"
        ],
        "referencias": [
            "ASSOCIAÇÃO PAULISTA DE MEDICINA. O sanatório de São José dos Campos e a tuberculose no Brasil. Revista da APM, São Paulo, n. 650, p. 18-22, out. 2014. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/09/24/projeto-ruas-a-fase-sanatorial-e-o-combate-a-tuberculose-rua-doutor-nelson-davila/. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Dr. Ruy Rodrigues Dória. São José dos Campos: Secretaria da Educação, 2013l. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em Limeira (SP) em 1897 e morte em 1966 (naturalDeSJC: false).",
            "Fundação do Sanatório Ruy Dória e primazia em cirurgias torácicas verificadas."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Pneumologista e Fundador do Sanatório Ruy Dória",
        "descricao": "Nascido em Limeira e formado no Rio de Janeiro, estabeleceu-se em São José dos Campos em 1925 como especialista em pneumologia. Construiu e dirigiu o conceituado Sanatório Ruy Dória, introduzindo técnicas pioneiras de cirurgia torácica no acolhimento a pacientes com infecções pulmonares agudas. Sua atuação clínica consolidou o prestígio médico do município, sendo homenageado como patrono de escola estadual do centro (ASSOCIAÇÃO PAULISTA DE MEDICINA, 2014; SÃO PAULO, 2013l).",
        "tag": "Saúde"
    },
    {
        "id": "P47",
        "nome": "Dr. Mário Nunes Galvão",
        "categoria": "Saúde & Política",
        "periodo": "1853 – 1925",
        "subtitulo": "Médico Sanitarista e Legislador Municipal",
        "naturalDeSJC": false,
        "texto": "Nascido em Ouro Preto e formado em Medicina no Rio de Janeiro em 1878, chefiou postos de saúde pública antes de clinicar em São José dos Campos. Eleito vereador na Primeira República, articulou campanhas higiênicas e organizou enfermarias de isolamento profilático durante epidemias de varíola. Sua liderança comunitária uniu ciência e assistência pública, inspirando a denominação oficial de escola estadual no município (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024l; SÃO PAULO, 2013m).",
        "citacoes": [
            "(CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024l; SÃO PAULO, 2013m)"
        ],
        "referencias": [
            "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Rua Doutor Mário Galvão. São José dos Campos, 2024l. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/08/06/projeto-ruas-sao-jose-dos-campos-e-suas-epidemias-rua-doutor-mario-galvao/. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Dr. Mário Nunes Galvão. São José dos Campos: Secretaria da Educação, 2013m. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em Ouro Preto (MG) em 1853 e falecimento em 1925 (naturalDeSJC: false).",
            "Formatura em 1878 no Rio de Janeiro e mandato legislativo em SJC comprovados."
        ],
        "pendencias": [],
        "cor": "rose",
        "cargo": "Médico Sanitarista e Legislador Municipal",
        "descricao": "Nascido em Ouro Preto e formado em Medicina no Rio de Janeiro em 1878, chefiou postos de saúde pública antes de clinicar em São José dos Campos. Eleito vereador na Primeira República, articulou campanhas higiênicas e organizou enfermarias de isolamento profilático durante epidemias de varíola. Sua liderança comunitária uniu ciência e assistência pública, inspirando a denominação oficial de escola estadual no município (CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS, 2024l; SÃO PAULO, 2013m).",
        "tag": "Saúde & Política"
    },
    {
        "id": "P48",
        "nome": "Francisco Pereira da Silva (Chico Triste)",
        "categoria": "Imprensa & Folclore",
        "periodo": "1918 – 1981",
        "subtitulo": "Fundador do Valeparaibano e Folclorista",
        "naturalDeSJC": false,
        "texto": "Jornalista nascido em Sergipe e estabelecido no Vale do Paraíba, fundou em 1952 o diário Valeparaibano, veículo líder da imprensa regional por décadas. Sob o pseudônimo Chico Triste, recolheu tradições populares, causos e modinhas campesinas em pesquisas etnográficas de expressivo valor documental. Sua obra escrita resguardou a memória folclórica valeparaibana, sendo oficializado como patrono de colégio público da rede estadual (SÃO PAULO, 2013n; VALEPARAIBANO, 1981).",
        "citacoes": [
            "(SÃO PAULO, 2013n; VALEPARAIBANO, 1981)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Francisco Pereira da Silva (Chico Triste). São José dos Campos: Secretaria da Educação, 2013n. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "VALEPARAIBANO. Edição histórica: a trajetória de Chico Triste na imprensa regional. São José dos Campos, 1981."
        ],
        "notas_verificacao": [
            "Nascido em Sergipe em 1918 e falecido em São José dos Campos em 1981 (naturalDeSJC: false).",
            "Fundação do jornal Valeparaibano em 1952 e relevância dos estudos folclóricos sob o pseudônimo Chico Triste confirmadas."
        ],
        "pendencias": [],
        "cor": "purple",
        "cargo": "Fundador do Valeparaibano e Folclorista",
        "descricao": "Jornalista nascido em Sergipe e estabelecido no Vale do Paraíba, fundou em 1952 o diário Valeparaibano, veículo líder da imprensa regional por décadas. Sob o pseudônimo Chico Triste, recolheu tradições populares, causos e modinhas campesinas em pesquisas etnográficas de expressivo valor documental. Sua obra escrita resguardou a memória folclórica valeparaibana, sendo oficializado como patrono de colégio público da rede estadual (SÃO PAULO, 2013n; VALEPARAIBANO, 1981).",
        "tag": "Imprensa & Folclore"
    },
    {
        "id": "P49",
        "nome": "Domingos de Macedo Custódio",
        "categoria": "Educação & Letras",
        "periodo": "1913 – 1986",
        "subtitulo": "Professor de Língua Portuguesa e Pioneiro Universitário",
        "naturalDeSJC": false,
        "texto": "Mineiro radicado em São José dos Campos a partir de 1938 para tratamento sanatorial, dedicou 26 anos ao ensino de português no Instituto João Cursino. Participou da implantação das primeiras faculdades da cidade na década de 1950, lecionando filologia e formando gerações de intelectuais regionais. Sua dedicação às letras clássicas e ao magistério público foi perpetuada como patrono de escola estadual no Jardim Maringá (SÃO PAULO, 2013o; UNIVAP, 2014).",
        "citacoes": [
            "(SÃO PAULO, 2013o; UNIVAP, 2014)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Professor Domingos de Macedo Custódio. São José dos Campos: Secretaria da Educação, 2013o. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "UNIVAP. Universidade do Vale do Paraíba. Memória do ensino superior em São José dos Campos. São José dos Campos: Editora Univap, 2014. Disponível em: https://www.univap.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Confirmado nascimento em Conquista (MG) em 1913 e falecimento em São José dos Campos em 1986 (naturalDeSJC: false).",
            "Atuação por 26 anos no João Cursino e pioneirismo no ensino superior confirmado."
        ],
        "pendencias": [],
        "cor": "indigo",
        "cargo": "Professor de Língua Portuguesa e Pioneiro Universitário",
        "descricao": "Mineiro radicado em São José dos Campos a partir de 1938 para tratamento sanatorial, dedicou 26 anos ao ensino de português no Instituto João Cursino. Participou da implantação das primeiras faculdades da cidade na década de 1950, lecionando filologia e formando gerações de intelectuais regionais. Sua dedicação às letras clássicas e ao magistério público foi perpetuada como patrono de escola estadual no Jardim Maringá (SÃO PAULO, 2013o; UNIVAP, 2014).",
        "tag": "Educação & Letras"
    },
    {
        "id": "P50",
        "nome": "Major Aviador José Mariotto Ferreira",
        "categoria": "Aviação",
        "periodo": "1929 – 1968",
        "subtitulo": "Piloto de Testes do Projeto Bandeirante",
        "naturalDeSJC": false,
        "texto": "Oficial aviador e piloto de ensaios do Centro Técnico de Aeronáutica, integrou a equipe encarregada dos testes operacionais do protótipo Bandeirante. Em 22 de outubro de 1968, realizou o primeiro voo panorâmico de demonstração da aeronave sobre o município de São José dos Campos. Faleceu em dezembro do mesmo ano em acidente aéreo durante missão de treinamento, sendo homenageado como patrono de escola estadual (INCAER, 2014; SÃO PAULO, 2013p).",
        "citacoes": [
            "(INCAER, 2014; SÃO PAULO, 2013p)"
        ],
        "referencias": [
            "INCAER. Instituto Histórico-Cultural da Aeronáutica. Construção aeronáutica no Brasil. Rio de Janeiro: INCAER, 2014. Disponível em: https://www2.fab.mil.br/incaer/images/eventgallery/instituto/Opusculos/Textos/opusculo_construcao_aeronautica.pdf. Acesso em: 5 out. 2026.",
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Major Aviador José Mariotto Ferreira. São José dos Campos: Secretaria da Educação, 2013p. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026."
        ],
        "notas_verificacao": [
            "Conflito 8 resolvido: em 22 de outubro de 1968 realizou-se o voo panorâmico oficial de apresentação aos joseenses; o voo oficial de ensaio do protótipo no CTA data de 26 de outubro de 1968. A distinção foi mantida com rigor.",
            "Morte trágica em dezembro de 1968 tratada com sobriedade factual.",
            "Nascido em São Paulo em 1929 (naturalDeSJC: false)."
        ],
        "pendencias": [],
        "cor": "cyan",
        "cargo": "Piloto de Testes do Projeto Bandeirante",
        "descricao": "Oficial aviador e piloto de ensaios do Centro Técnico de Aeronáutica, integrou a equipe encarregada dos testes operacionais do protótipo Bandeirante. Em 22 de outubro de 1968, realizou o primeiro voo panorâmico de demonstração da aeronave sobre o município de São José dos Campos. Faleceu em dezembro do mesmo ano em acidente aéreo durante missão de treinamento, sendo homenageado como patrono de escola estadual (INCAER, 2014; SÃO PAULO, 2013p).",
        "tag": "Aviação"
    },
    {
        "id": "P51",
        "nome": "Olímpio Catão",
        "categoria": "Educação & Cultura",
        "periodo": "até 1908",
        "subtitulo": "Inspetor Escolar, Jornalista e Dramaturgo",
        "naturalDeSJC": false,
        "texto": "Nascido em Lorena e formado na primeira turma da Escola Normal da Capital em 1876, assumiu a direção escolar em São José dos Campos a partir de 1888. Atuou como inspetor de ensino e articulista de imprensa, fundando grêmios cívicos e difundindo métodos de modernização da instrução primária. Faleceu em 1908, emprestando seu nome ao histórico Primeiro Grupo Escolar erguido na Praça Afonso Pena (SÃO PAULO, 2013q; SILVA, 1922).",
        "citacoes": [
            "(SÃO PAULO, 2013q; SILVA, 1922)"
        ],
        "referencias": [
            "SÃO PAULO (Estado). Diretoria de Ensino de São José dos Campos. Patronos das Escolas Estaduais: EE Olímpio Catão. São José dos Campos: Secretaria da Educação, 2013q. Disponível em: https://desaojosedoscampos.educacao.sp.gov.br. Acesso em: 5 out. 2026.",
            "SILVA, Alfredo. Almanaque histórico e comercial de São José dos Campos. São Paulo: Tipografia Brasil, 1922."
        ],
        "notas_verificacao": [
            "Conflito 10 resolvido: período mantido como 'até 1908' em razão da divergência sobre o ano de nascimento (1848 vs. 1849) entre registros escolares da época.",
            "Nascido em Lorena (SP) e falecido em 1908 em São José dos Campos (naturalDeSJC: false).",
            "Primeiro Grupo Escolar da cidade na Praça Afonso Pena batizado em sua homenagem."
        ],
        "pendencias": [
            "Ano de nascimento controverso nos arquivos (1848 ou 1849)."
        ],
        "cor": "indigo",
        "cargo": "Inspetor Escolar, Jornalista e Dramaturgo",
        "descricao": "Nascido em Lorena e formado na primeira turma da Escola Normal da Capital em 1876, assumiu a direção escolar em São José dos Campos a partir de 1888. Atuou como inspetor de ensino e articulista de imprensa, fundando grêmios cívicos e difundindo métodos de modernização da instrução primária. Faleceu em 1908, emprestando seu nome ao histórico Primeiro Grupo Escolar erguido na Praça Afonso Pena (SÃO PAULO, 2013q; SILVA, 1922).",
        "tag": "Educação & Cultura"
    }
],
prefeitos: [
    {
        "id": "pref-1",
        "periodo": "1798 (alegação)",
        "nome": "Tomé Alves Alvarenga",
        "cargo": "A matéria histórica de 1978 o chama de primeiro alcaide, não prefeito.",
        "marcos": "Nenhum feito localizado.",
        "situacaoDocumental": "Não confirmado como mandato. A fonte secundária afirma nomeação em 1798, mas não apresenta ato, cota arquivística ou prova para o intervalo 1798–1805.",
        "bloco": "ate-1941",
        "categoria": "Alegação / Não Confirmado",
        "refIds": [
            6
        ],
        "referenciasDetalhadas": [
            {
                "id": 6,
                "fullText": "VALEPARAIBANO. [A história de São José dos Campos: parte 2]. São José dos Campos, 27 jul. 1978. Reprodução digital em: SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. A história de São José pt. 2 (1978 ). Página web, sem paginação. Disponível em: https://www.sjcantigamente.com.br/a-historia-de-sao-jose-pt-2-1978/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjcantigamente.com.br/a-historia-de-sao-jose-pt-2-1978/"
            }
        ],
        "eraId": "imperio",
        "eraNome": "Império & Primeiras Intendências (1798–1889)",
        "eraCor": "amber"
    },
    {
        "id": "pref-2",
        "periodo": "1806–1817 (alegação)",
        "nome": "Joaquim Antônio Cabral",
        "cargo": "Cargo não confirmado; não há base consultada que o identifique como prefeito.",
        "marcos": "Nenhum feito localizado.",
        "situacaoDocumental": "Não confirmado. O intervalo antecede a criação provincial do emprego de prefeito, em 1835. Nome, função e datas permanecem sem comprovação.",
        "bloco": "ate-1941",
        "categoria": "Alegação / Não Confirmado",
        "refIds": [
            1,
            2
        ],
        "referenciasDetalhadas": [
            {
                "id": 1,
                "fullText": "SÃO PAULO (Província). Lei n. 18, de 11 de abril de 1835. Repositório de Legislação da Assembleia Legislativa do Estado de São Paulo. Arts. 1º–2º e 4º. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html. Acesso em: 5 out. 2026.",
                "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html"
            },
            {
                "id": 2,
                "fullText": "SÃO PAULO (Província ). Lei n. 4, de 29 de janeiro de 1838. Repositório de Legislação da Assembleia Legislativa do Estado de São Paulo. Arts. 1º–2º. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1838/lei-4-29.01.1838.html. Acesso em: 5 out. 2026.",
                "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1838/lei-4-29.01.1838.html"
            }
        ],
        "eraId": "imperio",
        "eraNome": "Império & Primeiras Intendências (1798–1889)",
        "eraCor": "amber"
    },
    {
        "id": "pref-3",
        "periodo": "1835 (exercício comprovado em nov. e dez.)",
        "nome": "Manoel Joaquim de Andrade",
        "cargo": "Prefeito municipal do período imperial, provido por nomeação governamental nos termos da Lei provincial nº 18, de 11 abr. 1835; não era prefeito eleito no sentido republicano atual.",
        "marcos": "Em ata de 2 nov. 1835, pediu terreno para um potreiro e acomodação de animais. A ata documenta o requerimento, não o deferimento ou a execução. A ata de 12 dez. volta a identificá-lo como prefeito.",
        "situacaoDocumental": "Exercício confirmado em duas atas transcritas pela Câmara. A cronologia institucional informa nomeação após setembro de 1835; o dia exato e o mandato contínuo até 1838 não estão demonstrados. A tabela original erra ao atribuir a criação do cargo a 1834.",
        "bloco": "ate-1941",
        "categoria": "Eleito",
        "refIds": [
            1,
            3,
            4,
            5
        ],
        "referenciasDetalhadas": [
            {
                "id": 1,
                "fullText": "SÃO PAULO (Província). Lei n. 18, de 11 de abril de 1835. Repositório de Legislação da Assembleia Legislativa do Estado de São Paulo. Arts. 1º–2º e 4º. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html. Acesso em: 5 out. 2026.",
                "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html"
            },
            {
                "id": 3,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Transcrição da ata da Câmara Municipal de São José dos Campos – 2 de novembro de 1835. Pró-Memória. São José dos Campos, 2024. PDF, pp. 26–27. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-2.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-2.pdf"
            },
            {
                "id": 4,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Transcrição da ata da Câmara Municipal de São José dos Campos – 12 de dezembro de 1835. Pró-Memória. São José dos Campos, 2024. PDF, pp. 29–31, em especial p. 31. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-4.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-4.pdf"
            },
            {
                "id": 5,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia – Pró-Memória. São José dos Campos, [s.d.]. Página web, sem paginação. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/"
            }
        ],
        "eraId": "imperio",
        "eraNome": "Império & Primeiras Intendências (1798–1889)",
        "eraCor": "amber"
    },
    {
        "id": "pref-4",
        "periodo": "1838–1888",
        "nome": "Sem série contínua de prefeitos comprovada",
        "cargo": "A Lei provincial nº 4, de 29 jan. 1838, revogou a lei de 1835 que criara o emprego de prefeito e devolveu as atribuições às autoridades anteriores.",
        "marcos": "Não é possível atribuir feitos a “prefeitos” nesse intervalo sem identificar antes a autoridade e o cargo histórico correto.",
        "situacaoDocumental": "Não tratar como lacuna de mandatos de prefeito moderno. A extinção legal do emprego está documentada; isso não significa ausência de administração municipal.",
        "bloco": "ate-1941",
        "categoria": "Alegação / Não Confirmado",
        "refIds": [
            1,
            2
        ],
        "referenciasDetalhadas": [
            {
                "id": 1,
                "fullText": "SÃO PAULO (Província). Lei n. 18, de 11 de abril de 1835. Repositório de Legislação da Assembleia Legislativa do Estado de São Paulo. Arts. 1º–2º e 4º. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html. Acesso em: 5 out. 2026.",
                "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html"
            },
            {
                "id": 2,
                "fullText": "SÃO PAULO (Província ). Lei n. 4, de 29 de janeiro de 1838. Repositório de Legislação da Assembleia Legislativa do Estado de São Paulo. Arts. 1º–2º. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1838/lei-4-29.01.1838.html. Acesso em: 5 out. 2026.",
                "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1838/lei-4-29.01.1838.html"
            }
        ],
        "eraId": "imperio",
        "eraNome": "Império & Primeiras Intendências (1798–1889)",
        "eraCor": "amber"
    },
    {
        "id": "pref-5",
        "periodo": "10 fev. 1890; 1890–1891 conforme compilação",
        "nome": "Francisco Alves Fagundes",
        "cargo": "Presidente do Conselho de Intendência constituído em 10 fev. 1890. A compilação consultada não identifica o ato individual de escolha.",
        "marcos": "O marco verificável é a formação do conselho republicano de intendência e sua presidência por Fagundes.",
        "situacaoDocumental": "Presidência documentada por compilação institucional, mas não há feito individual localizado nem comprovação, nessa fonte, do mecanismo de acesso. A compilação está nas pp. 10–16 do PDF.",
        "bloco": "ate-1941",
        "categoria": "Conselho / Junta",
        "refIds": [
            8
        ],
        "referenciasDetalhadas": [
            {
                "id": 8,
                "fullText": "ELIAS, Pedro. Vereadores de São José dos Campos. São José dos Campos: Câmara Municipal de São José dos Campos, [s.d.]. PDF, pp. 10–16. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf"
            }
        ],
        "eraId": "republica-velha",
        "eraNome": "República Velha & Conselhos (1890–1930)",
        "eraCor": "purple"
    },
    {
        "id": "pref-6",
        "periodo": "1890",
        "nome": "Cônego Francisco de Oliveira Lima",
        "cargo": "Membro do Conselho de Intendência, não identificado como presidente na fonte institucional consultada.",
        "marcos": "Nenhum feito individual localizado.",
        "situacaoDocumental": "A alegação original de que chefiou a intendência até 1893 não foi confirmada. A lista o inclui como membro do Conselho em 1890.",
        "bloco": "ate-1941",
        "categoria": "Conselho / Junta",
        "refIds": [
            8
        ],
        "referenciasDetalhadas": [
            {
                "id": 8,
                "fullText": "ELIAS, Pedro. Vereadores de São José dos Campos. São José dos Campos: Câmara Municipal de São José dos Campos, [s.d.]. PDF, pp. 10–16. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf"
            }
        ],
        "eraId": "republica-velha",
        "eraNome": "República Velha & Conselhos (1890–1930)",
        "eraCor": "purple"
    },
    {
        "id": "pref-7",
        "periodo": "1893–1916 (períodos de presidência do Conselho)",
        "nome": "Antônio Clemente de Moraes; Cláudio Pinto Machado; Benedito Fernandes César Leite; Bertolino Leite Machado; José Monteiro Ferreira",
        "cargo": "Presidentes do Conselho nos períodos listados: Antônio Clemente (1893–1895); Cláudio Pinto e Benedito Fernandes (1896–1898, sem datas individuais de alternância); Bertolino Leite (1899–1901); Cláudio Pinto (1902–1904); José Monteiro (1905–1907, 1908–1910, 1911–1913 e 1914–1916).",
        "marcos": "A evidência localizada registra presidências do Conselho, não realizações individuais.",
        "situacaoDocumental": "Não converter automaticamente presidência do Conselho em mandato de prefeito. Fonte: compilação institucional de vereadores/conselhos, PDF pp. 10–16. A sucessão executiva para todo esse período permanece incompleta.",
        "bloco": "ate-1941",
        "categoria": "Conselho / Junta",
        "refIds": [
            8
        ],
        "referenciasDetalhadas": [
            {
                "id": 8,
                "fullText": "ELIAS, Pedro. Vereadores de São José dos Campos. São José dos Campos: Câmara Municipal de São José dos Campos, [s.d.]. PDF, pp. 10–16. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf"
            }
        ],
        "eraId": "republica-velha",
        "eraNome": "República Velha & Conselhos (1890–1930)",
        "eraCor": "purple"
    },
    {
        "id": "pref-8",
        "periodo": "1908–1910 (com divergências sobre início); 1913–1916; 1919–1930",
        "nome": "João Alves da Silva Cursino",
        "cargo": "Prefeito nos períodos indicados por estudos/compilações. Também aparece como presidente do Conselho no ciclo 1917–1919. A forma de acesso não ficou comprovada nos documentos citados para todos os períodos.",
        "marcos": "Estudos atribuem à sua administração a instalação do Segundo Grupo Escolar, da Escola Normal e do Teatro Municipal, e incentivos municipais a fábricas. O Mercado Municipal foi construído entre 1921 e 1923, durante sua gestão. Um Almanaque de 1922 também lhe atribui obras escolares e ampliação do mercado, mas tem tom laudatório.",
        "situacaoDocumental": "Mandatos com divergência cronológica: há relatos que iniciam o primeiro período em 1906; a dissertação consultada indica 1908–1910. O trecho 1913–1916 consta em cronologia/estudo local; 1919–1930 tem suporte institucional e acadêmico. Lei municipal assinada por Cursino em fev. 1919 confirma que era prefeito naquela data (PDF p. 1). [8–12]",
        "bloco": "ate-1941",
        "categoria": "Conselho / Junta",
        "refIds": [
            8,
            9,
            10,
            11,
            12
        ],
        "referenciasDetalhadas": [
            {
                "id": 8,
                "fullText": "ELIAS, Pedro. Vereadores de São José dos Campos. São José dos Campos: Câmara Municipal de São José dos Campos, [s.d.]. PDF, pp. 10–16. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf"
            },
            {
                "id": 9,
                "fullText": "ROQUE, Zuleika Stefânia Sabino. Educação e cotidiano escolar em São José dos Campos (1889–1930 ). 2007. Dissertação (Mestrado em História Social) – Pontifícia Universidade Católica de São Paulo, São Paulo, 2007. PDF, pp. 32 e 104–105. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2015/07/Educa%C3%A7%C3%A3o-e-cotidiano-Escolar-em-S%C3%A3o-Jos%C3%A9-dos-Campos-1889-1930.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2015/07/Educa%C3%A7%C3%A3o-e-cotidiano-Escolar-em-S%C3%A3o-Jos%C3%A9-dos-Campos-1889-1930.pdf"
            },
            {
                "id": 10,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 94, de 15 de fevereiro de 1919. Registro da legislação municipal. São José dos Campos, 1919. PDF, p. 1. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1919/LE191900000094.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1919/LE191900000094.pdf"
            },
            {
                "id": 11,
                "fullText": "HISTÓRICO da cidade: São José dos Campos. Migalhas, Dr. Pintassilgo, [s.d.]. Seção “Mercado Municipal”, sem paginação. Disponível em: https://www.migalhas.com.br/drpintassilgo/27232/sao-jose-dos-campos/historico-da-cidade. Acesso em: 5 out. 2026.",
                "url": "https://www.migalhas.com.br/drpintassilgo/27232/sao-jose-dos-campos/historico-da-cidade"
            },
            {
                "id": 12,
                "fullText": "SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. Coronel João Alves da Silva Cursino. [Transcrição do Almanach de 1922]. Página web, sem paginação. Disponível em: https://www.sjcantigamente.com.br/coronel-joao-alves-da-silva-cursino/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjcantigamente.com.br/coronel-joao-alves-da-silva-cursino/"
            }
        ],
        "eraId": "republica-velha",
        "eraNome": "República Velha & Conselhos (1890–1930)",
        "eraCor": "purple"
    },
    {
        "id": "pref-9",
        "periodo": "1917–1930 (presidências do Conselho)",
        "nome": "Felisbino Pinto da Cunha; Nelson Silveira D’Ávila; José Ricardo Leite",
        "cargo": "A compilação institucional registra Felisbino e Nelson no ciclo 1917–1919; Nelson e José Ricardo em 1920–1922; Nelson nos ciclos 1923–1925, 1926–1928 e 1929–1930.",
        "marcos": "Nenhum feito individual localizado; a fonte documenta presidências do Conselho.",
        "situacaoDocumental": "Não confundir presidência da Câmara/Conselho com prefeitura. Relação institucional nas pp. 10–16 do PDF.",
        "bloco": "ate-1941",
        "categoria": "Outros",
        "refIds": [
            8
        ],
        "referenciasDetalhadas": [
            {
                "id": 8,
                "fullText": "ELIAS, Pedro. Vereadores de São José dos Campos. São José dos Campos: Câmara Municipal de São José dos Campos, [s.d.]. PDF, pp. 10–16. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf"
            }
        ],
        "eraId": "republica-velha",
        "eraNome": "República Velha & Conselhos (1890–1930)",
        "eraCor": "purple"
    },
    {
        "id": "pref-10",
        "periodo": "1930",
        "nome": "Junta Governativa: Rui Rodrigues Dória, Austin Tibiriçá e Arnaldo dos Santos Cerdeira",
        "cargo": "Junta que substituiu o prefeito no contexto da mudança política de 1930.",
        "marcos": "O estudo institucional relata a substituição do prefeito por comissão e a mudança de arranjo administrativo.",
        "situacaoDocumental": "Junta documentada em estudo institucional, mas há divergência de nome: a tabela original dizia “Antônio Cerdeira”; a fonte consultada registra “Arnaldo Cerdeira”. [13, p. 49]",
        "bloco": "ate-1941",
        "categoria": "Conselho / Junta",
        "refIds": [
            13
        ],
        "referenciasDetalhadas": [
            {
                "id": 13,
                "fullText": "ZANETTI, Valéria (org. ). Fase sanatorial de São José dos Campos: espaço e doença. São José dos Campos: Universidade do Vale do Paraíba, 2010. (São José dos Campos: História e Cidade, v. 4). PDF, pp. impressas 48–49 e 99. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf"
            }
        ],
        "eraId": "republica-velha",
        "eraNome": "República Velha & Conselhos (1890–1930)",
        "eraCor": "purple"
    },
    {
        "id": "pref-11",
        "periodo": "1931",
        "nome": "Rui Rodrigues Dória",
        "cargo": "Prefeito nomeado, segundo quadro institucional.",
        "marcos": "A nomeação marca a recomposição da administração municipal após 1930.",
        "situacaoDocumental": "Nome e ano registrados no quadro administrativo institucional; não foi localizada realização individual específica. [13, p. 49]",
        "bloco": "ate-1941",
        "categoria": "Nomeado",
        "refIds": [
            13
        ],
        "referenciasDetalhadas": [
            {
                "id": 13,
                "fullText": "ZANETTI, Valéria (org. ). Fase sanatorial de São José dos Campos: espaço e doença. São José dos Campos: Universidade do Vale do Paraíba, 2010. (São José dos Campos: História e Cidade, v. 4). PDF, pp. impressas 48–49 e 99. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-12",
        "periodo": "1932–1933",
        "nome": "José Domingues de Vasconcelos",
        "cargo": "Prefeito nomeado, segundo quadro institucional.",
        "marcos": "Nenhum feito individual comprovado nas fontes consultadas.",
        "situacaoDocumental": "Período e nome registrados em quadro institucional. [13, p. 49]",
        "bloco": "ate-1941",
        "categoria": "Nomeado",
        "refIds": [
            13
        ],
        "referenciasDetalhadas": [
            {
                "id": 13,
                "fullText": "ZANETTI, Valéria (org. ). Fase sanatorial de São José dos Campos: espaço e doença. São José dos Campos: Universidade do Vale do Paraíba, 2010. (São José dos Campos: História e Cidade, v. 4). PDF, pp. impressas 48–49 e 99. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-13",
        "periodo": "1933–1934",
        "nome": "Rodolfo dos Santos Mascarenhas",
        "cargo": "Prefeito nomeado, segundo quadro institucional.",
        "marcos": "Pesquisa acadêmica informa que, em 28 mar. 1934, ele abriu o Livro 838 do Arquivo Público Municipal para registro dos próprios municipais.",
        "situacaoDocumental": "Mandato indicado em fonte institucional; marco administrativo citado por dissertação, que identifica o livro de arquivo, mas não é o fac-símile do registro. [9, p. 32; 13, p. 49]",
        "bloco": "ate-1941",
        "categoria": "Nomeado",
        "refIds": [
            9,
            13
        ],
        "referenciasDetalhadas": [
            {
                "id": 9,
                "fullText": "ROQUE, Zuleika Stefânia Sabino. Educação e cotidiano escolar em São José dos Campos (1889–1930 ). 2007. Dissertação (Mestrado em História Social) – Pontifícia Universidade Católica de São Paulo, São Paulo, 2007. PDF, pp. 32 e 104–105. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2015/07/Educa%C3%A7%C3%A3o-e-cotidiano-Escolar-em-S%C3%A3o-Jos%C3%A9-dos-Campos-1889-1930.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2015/07/Educa%C3%A7%C3%A3o-e-cotidiano-Escolar-em-S%C3%A3o-Jos%C3%A9-dos-Campos-1889-1930.pdf"
            },
            {
                "id": 13,
                "fullText": "ZANETTI, Valéria (org. ). Fase sanatorial de São José dos Campos: espaço e doença. São José dos Campos: Universidade do Vale do Paraíba, 2010. (São José dos Campos: História e Cidade, v. 4). PDF, pp. impressas 48–49 e 99. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-14",
        "periodo": "1935–1937",
        "nome": "Leovigildo Trindade",
        "cargo": "Prefeito Sanitário nomeado pelo Governo do Estado, no regime da estância.",
        "marcos": "O Decreto estadual nº 7.007, de 12 mar. 1935, criou a Estância Climática e instituiu a nomeação estadual do prefeito. É marco legal do período, mas não deve ser apresentado como obra pessoal de Trindade.",
        "situacaoDocumental": "Nome e período registrados; regra de nomeação e criação da estância documentadas em estudo institucional. [13, pp. 48–49; 14]",
        "bloco": "ate-1941",
        "categoria": "Nomeado",
        "refIds": [
            13,
            14
        ],
        "referenciasDetalhadas": [
            {
                "id": 13,
                "fullText": "ZANETTI, Valéria (org. ). Fase sanatorial de São José dos Campos: espaço e doença. São José dos Campos: Universidade do Vale do Paraíba, 2010. (São José dos Campos: História e Cidade, v. 4). PDF, pp. impressas 48–49 e 99. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf"
            },
            {
                "id": 14,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Página web, seção “Estância Climática” e “Eletividade de Prefeito”, sem paginação. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-15",
        "periodo": "1937",
        "nome": "Edgard (também grafado Edgar) Melo Matos de Castro",
        "cargo": "Prefeito Sanitário nomeado, segundo o quadro institucional.",
        "marcos": "Correspondência de 25 set. 1937, reproduzida em estudo institucional, saiu do Gabinete do Prefeito e está assinada por “Edgar Melo de Castro”.",
        "situacaoDocumental": "Cargo em 1937 documentado; grafia do nome varia entre o quadro e a correspondência. Não foi localizado feito administrativo pessoal além do registro documental. [13, pp. 49, 99]",
        "bloco": "ate-1941",
        "categoria": "Nomeado",
        "refIds": [
            13,
            99
        ],
        "referenciasDetalhadas": [
            {
                "id": 13,
                "fullText": "ZANETTI, Valéria (org. ). Fase sanatorial de São José dos Campos: espaço e doença. São José dos Campos: Universidade do Vale do Paraíba, 2010. (São José dos Campos: História e Cidade, v. 4). PDF, pp. impressas 48–49 e 99. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-16",
        "periodo": "1938–1941 (início em junho de 1938 indicado por estudo; dias exatos não confirmados)",
        "nome": "Francisco José Longo",
        "cargo": "Prefeito Sanitário, nomeado pelo Governo do Estado; não eleito. Em ato de 27 fev. 1939, a denominação aparece como “Prefeito Sanitário da Estância Hidromineral e Climatérica de São José dos Campos”.",
        "marcos": "Banhado/Rua São José: Ato municipal nº 17/1938 iniciou desapropriações; Atos nº 40 e 44, de 1939, ampliaram o processo para abrir o passeio e a vista do Banhado. Estudos descrevem demolições e interpretam a intervenção no contexto higienista e autoritário, com consequências sociais — portanto, não é adequado narrá-la apenas como melhoria consensual. [15, pp. 127–129; 16, pp. 168–169] Abastecimento: uma dissertação registra rede de distribuição de água potável em plano de obras; a documentação recuperada não autoriza afirmar que toda a rede de água e esgoto foi implantada por Longo. [17, p. 73] Avenida Dr. Adhemar de Barros: fonte da Câmara registra abertura em 1941 e inauguração em 11 maio pelo interventor Adhemar de Barros; não comprova autoria pessoal exclusiva de Longo.",
        "situacaoDocumental": "Prefeito sanitário e intervalo por anos corroborados. Início em junho de 1938 aparece em dissertação; dia de posse e saída não localizados. A página da Câmara atribui à gestão a biblioteca pública e ampla infraestrutura de água/esgoto, mas sem ato ou referência — essas alegações ficam fora dos feitos confirmados.",
        "bloco": "ate-1941",
        "categoria": "Eleito",
        "refIds": [
            15,
            16,
            17
        ],
        "referenciasDetalhadas": [
            {
                "id": 15,
                "fullText": "LESSA, Simone Narciso. A construção do Pólo Regional do Vale do Paraíba: planejamento regional e ordenamento territorial de São José dos Campos. In: ZANETTI, Valéria (org. ). Os Campos da Cidade: São José Revisitada. São Paulo: Intergraf, 2008. p. 117–148, especialmente pp. 127–129. (Série São José dos Campos: História e Cidade, v. 1). Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-I-Os-Campos-da-Cidade-S%C3%A3o-Jos%C3%A9-Revisitada.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-I-Os-Campos-da-Cidade-S%C3%A3o-Jos%C3%A9-Revisitada.pdf"
            },
            {
                "id": 16,
                "fullText": "SILVA, Douglas Almeida; VIANNA, Paula Vilhena Carnevale; ZANETTI, Valéria Regina. Planejamento urbano, agentes e representações: criação do Banhado, cartão postal de São José dos Campos. Ambiente & Sociedade, São Paulo, v. 20, n. 2, p. 159–184, abr./jun. 2017. DOI: https://doi.org/10.1590/1809-4422ASOC307R1V2022017. PDF consultado, pp. impressas 168–169 e 181. Disponível em: https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?format=pdf&lang=pt. Acesso em: 5 out. 2026.",
                "url": "https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?format=pdf&lang=pt"
            },
            {
                "id": 17,
                "fullText": "COSTA, Paulo Eduardo Oliveira. Legislação urbanística e crescimento urbano em São José dos Campos. 2007. Dissertação (Mestrado em Arquitetura e Urbanismo ) – Faculdade de Arquitetura e Urbanismo, Universidade de São Paulo, São Paulo, 2007. PDF, pp. impressas 28 e 73. Disponível em: https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf. Acesso em: 5 out. 2026.",
                "url": "https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-17",
        "periodo": "1942–1947 (anos)",
        "nome": "Pedro Popini Mascarenhas",
        "cargo": "Prefeito sanitário nomeado, não eleito.",
        "marcos": "Pesquisa atribui intensificação de desapropriações, em maioria para retificar vias centrais; não prova conclusão de cada obra. [19, 21–22]",
        "situacaoDocumental": "Dias de posse/saída não comprovados.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            19,
            21,
            22
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 22,
                "fullText": "COSTA, Paulo Eduardo Oliveira. Legislação urbanística e crescimento urbano em São José dos Campos. 2007. Dissertação (Mestrado em Arquitetura e Urbanismo ) – Faculdade de Arquitetura e Urbanismo, Universidade de São Paulo, São Paulo, 2007. Disponível em: https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf. Acesso em: 5 out. 2026.",
                "url": "https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-18",
        "periodo": "1947 (alegação)",
        "nome": "Otávio Del Nero",
        "cargo": "Exercício e forma de acesso não confirmados.",
        "marcos": "Nenhum fato individual verificável.",
        "situacaoDocumental": "Só aparece em lista secundária; sem ato de investidura.",
        "bloco": "1942-2026",
        "categoria": "Alegação / Não Confirmado",
        "refIds": [
            19,
            21
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-19",
        "periodo": "1947 (ano)",
        "nome": "Paulino Blair",
        "cargo": "Classificado como nomeado em um relatório e interino em outra lista.",
        "marcos": "Nenhum marco individual comprovado.",
        "situacaoDocumental": "Sem ato que resolva a divergência; não há prova de vice-prefeitura em exercício.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            19,
            21
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-20",
        "periodo": "1º jul. 1947 (única data comprovada)",
        "nome": "Jorge Zarur",
        "cargo": "Prefeito sanitário nomeado.",
        "marcos": "Disponibilizou ao Ministério da Aeronáutica terrenos para início das obras do CTA; não prova iniciativa municipal de construção.",
        "situacaoDocumental": "Outra lista o situa em 1950, sem ato que confirme segunda passagem.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            19,
            21,
            30,
            31
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 30,
                "fullText": "INSTITUTO TECNOLÓGICO DE AERONÁUTICA. A construção. [s.d.]. Disponível em: http://www.ita.br/aconstruo. Acesso em: 5 out. 2026.",
                "url": "http://www.ita.br/aconstruo"
            },
            {
                "id": 31,
                "fullText": "LISTA de prefeitos de São José dos Campos. In: WIKIPÉDIA: a enciclopédia livre. [s.d.]. Usada apenas como índice de alegações divergentes, não como comprovação primária. Disponível em: https://pt.wikipedia.org/wiki/ListadeprefeitosdeS%C3%A3oJos%C3%A9dos_Campos. Acesso em: 5 out. 2026.",
                "url": "https://pt.wikipedia.org/wiki/ListadeprefeitosdeS%C3%A3oJos%C3%A9dos_Campos"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-21",
        "periodo": "1947–1949 (anos)",
        "nome": "Antenor Nascimento Filho",
        "cargo": "Prefeito sanitário nomeado.",
        "marcos": "Lei nº 16/1947, assinada por ele, abriu crédito de Cr$ 2.699 para depósito judicial de diferença de avaliação de terreno desapropriado em Eugênio de Melo.",
        "situacaoDocumental": "Dias de posse/saída não localizados; crédito não prova outros resultados.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            23
        ],
        "referenciasDetalhadas": [
            {
                "id": 23,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 16, de 31 de dezembro de 1947 [abre crédito especial para diferença de avaliação judicial de terreno desapropriado em Eugênio de Melo]. Legislação municipal, 1947. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1947/LE194700000016.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1947/LE194700000016.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-22",
        "periodo": "1949 (atribuição anual)",
        "nome": "José Vieira de Macedo",
        "cargo": "Quadro o lista como prefeito sanitário e “Presidente da Câmara”.",
        "marcos": "Nenhum marco individual verificável.",
        "situacaoDocumental": "Sem ato de investidura/exercício; presidir a Câmara não prova chefia da Prefeitura.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            19,
            21
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-23",
        "periodo": "17 fev. 1949–1950 (fim só anual)",
        "nome": "Elmano Ferreira Veloso (1ª passagem)",
        "cargo": "Prefeito sanitário nomeado.",
        "marcos": "Lei nº 38/1949 autorizou aforamento de 90 mil m² municipais à Rhodosá de Rayon; não comprova início da fábrica.",
        "situacaoDocumental": "Dia final não comprovado.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            24
        ],
        "referenciasDetalhadas": [
            {
                "id": 24,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 38, de 10 de março de 1949 [autoriza aforamento de terreno municipal à Companhia Rhodosá de Rayon S.A.]. Legislação municipal, 1949. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1949/LE194900000038.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1949/LE194900000038.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-24",
        "periodo": "1950 (ano)",
        "nome": "Tertuliano Delfim Júnior",
        "cargo": "Prefeito sanitário nomeado, segundo o quadro retrospectivo.",
        "marcos": "Costa atribui-lhe a criação legal do Departamento da Casa Popular pela Lei nº 108/1951, com sistema mutualista de moradia. [19, 21–22, 25]",
        "situacaoDocumental": "Lei sem assinatura nominal legível; quadro só o situa em 1950. Não prova mandato até 1951 nem construção de casas.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            19,
            21,
            22,
            25
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 22,
                "fullText": "COSTA, Paulo Eduardo Oliveira. Legislação urbanística e crescimento urbano em São José dos Campos. 2007. Dissertação (Mestrado em Arquitetura e Urbanismo ) – Faculdade de Arquitetura e Urbanismo, Universidade de São Paulo, São Paulo, 2007. Disponível em: https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf. Acesso em: 5 out. 2026.",
                "url": "https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf"
            },
            {
                "id": 25,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 108, de 9 de abril de 1951 [cria o Departamento da Casa Popular]. Legislação municipal, 1951. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1951/LE195100000108.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1951/LE195100000108.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-25",
        "periodo": "1950 (alegação de 2ª passagem)",
        "nome": "Jorge Zarur",
        "cargo": "Exercício e acesso não comprovados.",
        "marcos": "Nenhum fato específico verificável. [21, 30–31]",
        "situacaoDocumental": "Sem ato de investidura; segunda gestão não confirmada.",
        "bloco": "1942-2026",
        "categoria": "Alegação / Não Confirmado",
        "refIds": [
            21,
            30,
            31
        ],
        "referenciasDetalhadas": [
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 30,
                "fullText": "INSTITUTO TECNOLÓGICO DE AERONÁUTICA. A construção. [s.d.]. Disponível em: http://www.ita.br/aconstruo. Acesso em: 5 out. 2026.",
                "url": "http://www.ita.br/aconstruo"
            },
            {
                "id": 31,
                "fullText": "LISTA de prefeitos de São José dos Campos. In: WIKIPÉDIA: a enciclopédia livre. [s.d.]. Usada apenas como índice de alegações divergentes, não como comprovação primária. Disponível em: https://pt.wikipedia.org/wiki/ListadeprefeitosdeS%C3%A3oJos%C3%A9dos_Campos. Acesso em: 5 out. 2026.",
                "url": "https://pt.wikipedia.org/wiki/ListadeprefeitosdeS%C3%A3oJos%C3%A9dos_Campos"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-26",
        "periodo": "1951 (ano)",
        "nome": "Pedro Sinisgalli",
        "cargo": "Quadro o classifica como nomeado; outra lista, como interino.",
        "marcos": "Nenhum marco individual verificável.",
        "situacaoDocumental": "Sem ato primário; não há prova de vice-prefeitura em exercício.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            19,
            21
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-27",
        "periodo": "1951–1954 (anos)",
        "nome": "Benoit de Almeida Victoretti",
        "cargo": "Prefeito sanitário nomeado.",
        "marcos": "Lei nº 281/1954 adotou o Código de Obras, regulando construções, demolições, ruas e loteamentos. [19, 21–22, 26]",
        "situacaoDocumental": "Costa imprime nº 381; original municipal é nº 281. Grafia do sobrenome varia (Victorelli/Vitoretti).",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            19,
            21,
            22,
            26
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 22,
                "fullText": "COSTA, Paulo Eduardo Oliveira. Legislação urbanística e crescimento urbano em São José dos Campos. 2007. Dissertação (Mestrado em Arquitetura e Urbanismo ) – Faculdade de Arquitetura e Urbanismo, Universidade de São Paulo, São Paulo, 2007. Disponível em: https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf. Acesso em: 5 out. 2026.",
                "url": "https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf"
            },
            {
                "id": 26,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 281, de 11 de janeiro de 1954 [adota o Código de Obras municipal]. Legislação municipal, 1954. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000281.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000281.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-28",
        "periodo": "1954–1957 (anos)",
        "nome": "Orlando Campos",
        "cargo": "Prefeito sanitário nomeado.",
        "marcos": "Lei nº 301/1954, sancionada por Orlando, abriu crédito para reforma de prédio em Santana do Paraíba e instalação de posto de arrecadação. [19, 27–28]",
        "situacaoDocumental": "Crédito não prova conclusão da reforma/instalação.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            19,
            27,
            28
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 27,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 301, de 21 de agosto de 1954 [abre crédito para reforma do prédio municipal em Santana do Paraíba e instalação de posto de arrecadação]. Legislação municipal, 1954. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000301.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000301.pdf"
            },
            {
                "id": 28,
                "fullText": "GUIMARÃES, Antônio Carlos Machado. Cidade e memória: a construção de um lugar e sua importância no espaço urbano: um breve estudo sobre o crescimento de São José dos Campos na década de 1950 e a criação da Faculdade de Direito. Arquitextos, São Paulo, ano 18, n. 209.03, out. 2017. Disponível em: https://vitruvius.com.br/revistas/read/arquitextos/18.209/6747. Acesso em: 5 out. 2026.",
                "url": "https://vitruvius.com.br/revistas/read/arquitextos/18.209/6747"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-29",
        "periodo": "24 fev. 1955–11 abr. 1958",
        "nome": "Elmano Ferreira Veloso (2ª passagem)",
        "cargo": "Prefeito sanitário nomeado.",
        "marcos": "Lei nº 346/1955, sancionada por ele, exigiu fixação legal e revisão periódica dos perímetros de zonas/bairros; decreto de jan. 1958 o identifica como prefeito.",
        "situacaoDocumental": "Sucessão por Donato em 11 abr. 1958 segundo Costa; ato de início e execução de revisões não localizados.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            26,
            29,
            32
        ],
        "referenciasDetalhadas": [
            {
                "id": 26,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 281, de 11 de janeiro de 1954 [adota o Código de Obras municipal]. Legislação municipal, 1954. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000281.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000281.pdf"
            },
            {
                "id": 29,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 346, de 19 de abril de 1955 [altera o art. 165 da Lei nº 281/1954 sobre fixação e revisão periódica dos perímetros das zonas e bairros]. Legislação municipal, 1955. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1955/LE195500000346.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1955/LE195500000346.pdf"
            },
            {
                "id": 32,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 222, de 16 de janeiro de 1958 [concede pensão a dependentes de funcionário municipal falecido]. Legislação municipal, 1958. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000222.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000222.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-30",
        "periodo": "Desde 11 abr. 1958 (saída incerta)",
        "nome": "Donato Mascarenhas Filho",
        "cargo": "Prefeito sanitário nomeado; último período de nomeação.",
        "marcos": "Decreto nº 246/1958 comprova exercício e criou Comissão do Plano Diretor, orientada pelo CEPEU/USP. [20–21, 33]",
        "situacaoDocumental": "Dia de saída não localizado; comissão não prova plano/obras executados.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            20,
            21,
            33
        ],
        "referenciasDetalhadas": [
            {
                "id": 20,
                "fullText": "PREFEITURA DE SÃO JOSÉ DOS CAMPOS. História. São José em Dados. [s.d.]. Disponível em: https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 33,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 246, de 10 de setembro de 1958 [cria a Comissão do Plano Diretor do Município]. Legislação municipal, 1958. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000246.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000246.pdf"
            }
        ],
        "eraId": "sanatorial",
        "eraNome": "Estância Sanatorial & Prefeitos Nomeados (1931–1958)",
        "eraCor": "rose"
    },
    {
        "id": "pref-31",
        "periodo": "1959–1962 (datas divergentes)",
        "nome": "Elmano Ferreira Veloso (mandato eletivo)",
        "cargo": "Prefeito eleito por voto direto, segundo cronologia consultada.",
        "marcos": "Lei nº 605/1959 regulou instalação de iluminação em loteamentos aprovados, a pedido e a expensas dos interessados; não prova instalação. [19, 34–35]",
        "situacaoDocumental": "UNESP indica 1959–1962; estudo de 2001, 1958–1961. Donato ainda exercia em set. 1958; TSE não forneceu resultado municipal legível.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            19,
            34,
            35
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 34,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 605, de 9 de abril de 1959. Legislação municipal, 1959. Disponível em: https://www.sjc.sp.gov.br/legislacao/Leis/1959/605.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/legislacao/Leis/1959/605.pdf"
            },
            {
                "id": 35,
                "fullText": "INSTITUTO DE CIÊNCIA E TECNOLOGIA DE SÃO JOSÉ DOS CAMPOS. Elmano Ferreira Veloso – 4 vezes Prefeito Sanitário e Municipal de São José dos Campos-SP – Seresteiro – Benfeitor da FFOSJC, o atual ICT-UNESP. UNESP, [s.d.]. Disponível em: https://www.ict.unesp.br/#!/sobre-o-ict/institucional/historia/biografias/elmano-veloso/. Acesso em: 5 out. 2026.",
                "url": "https://www.ict.unesp.br/#!/sobre-o-ict/institucional/historia/biografias/elmano-veloso/"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-32",
        "periodo": "1962–1966 (dias incertos)",
        "nome": "José Marcondes Pereira",
        "cargo": "Referido como eleito; sem evidência de exercício como vice.",
        "marcos": "Pediu proposta de Programa Administrativo ao CEPEU (1962). Lei nº 1.097/1964 abriu crédito para demolir posto de Santana e construir edifício de serviços; ato de 6 jul. 1966 confirma exercício. [19, 21, 37–38]",
        "situacaoDocumental": "TSE não validou resultado individual. Proposta/crédito não provam execução; último dia não localizado.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            19,
            21,
            37,
            38
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 37,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 1.097, de 21 de agosto de 1964. Legislação municipal, 1964. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1964/LE196400001097.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1964/LE196400001097.pdf"
            },
            {
                "id": 38,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 865, de 6 de julho de 1966. Legislação municipal, 1966. Disponível em: https://www.sjc.sp.gov.br/legislacao/Decretos/1966/865.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/1966/865.pdf"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-33",
        "periodo": "1966 (interinidade; dias incertos)",
        "nome": "José Ferze Tau",
        "cargo": "Presidente da Câmara que assumiu; não vice eleito nem nomeado estadual.",
        "marcos": "Lei nº 1.300/1966, assinada por ele como prefeito, autorizou doação de terreno no Motorama para Grupo Escolar.",
        "situacaoDocumental": "Ato confirma exercício; fonte local relata sucessão após saída de Marcondes. Datas e construção não comprovadas.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            52,
            93
        ],
        "referenciasDetalhadas": [
            {
                "id": 52,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 1.300, de 29 de novembro de 1966. Legislação municipal, 1966. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1966/LE196600001300.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1966/LE196600001300.pdf"
            },
            {
                "id": 93,
                "fullText": "COSTA, Luiz Paulo. Tau, o vereador emérito. São José dos Campos Antigamente, [s.d.]. Disponível em: https://www.sjcantigamente.com.br/tau-o-vereador-emerito/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjcantigamente.com.br/tau-o-vereador-emerito/"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-34",
        "periodo": "1966–1970 (transição divergente)",
        "nome": "Elmano Ferreira Veloso (mandato eletivo)",
        "cargo": "Prefeito eleito.",
        "marcos": "Decreto nº 1.153/1968 criou Museu da Imagem e do Som. Estudo relata eventos culturais de 1969 ligados ao Conselho/agentes locais, não apenas ao prefeito. [19, 21, 36, 39–40]",
        "situacaoDocumental": "Decreto de 1967 confirma exercício; Câmara dá nomeação sucessora em 31 jan. 1970, Costa informa posse em 4 fev. Criação não prova funcionamento integral.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            19,
            21,
            36,
            39,
            40
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 21,
                "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
            },
            {
                "id": 36,
                "fullText": "RODRIGUES, Mariza; SILVA, Carmo Antonio da; COSTA, Luiz Augusto. Entre cultura e atos cívicos: política cultural em São José dos Campos (1966–1970 ). 2001. Relatório final de Trabalho de Graduação (História) – Faculdade de Educação, Universidade do Vale do Paraíba, São José dos Campos, 2001. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/06/00_tcc-entre-cultura-e-atos-civicos-politica-cultural-em-sao-jose-dos-campos-1.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/06/00_tcc-entre-cultura-e-atos-civicos-politica-cultural-em-sao-jose-dos-campos-1.pdf"
            },
            {
                "id": 39,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 970, de 27 de março de 1967. Legislação municipal, 1967. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1967/DE196700000970.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1967/DE196700000970.pdf"
            },
            {
                "id": 40,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 1.153, de 24 de outubro de 1968 [cria o Museu da Imagem e do Som e dá outras providências]. Legislação municipal, 1968. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1968/DE196800001153.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1968/DE196800001153.pdf"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-35",
        "periodo": "1970–1975 (saída incerta)",
        "nome": "Sérgio Sobral de Oliveira",
        "cargo": "Nomeado pelo governador; não eleito nem vice em exercício.",
        "marcos": "Decreto nº 1.276/1970 congelou créditos; Leis nº 1.606 e 1.623/1971 estabeleceram zoneamento e II PDDI; Lei nº 1.682/1973 autorizou a URBAM.",
        "situacaoDocumental": "Nomeação/posse: 31 jan. ou 4 fev. 1970 nas fontes. Fundação da URBAM registrada em 10 out. 1973, mas atos e planos não provam obras. Conselho Cultural teria sido encerrado em 1970; ato original não localizado.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            19,
            41,
            44,
            45
        ],
        "referenciasDetalhadas": [
            {
                "id": 19,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
            },
            {
                "id": 41,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 1.276, de 6 de fevereiro de 1970. Legislação municipal, 1970. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1970/DE197000001276.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1970/DE197000001276.pdf"
            },
            {
                "id": 44,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 1.682, de 10 de outubro de 1973. Autoriza a constituição de uma Sociedade de Urbanização e dá outras providências na forma que especifica. Legislação municipal. Disponível em: https://www.sjc.sp.gov.br/legislacao/leis/1973/1682.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/legislacao/leis/1973/1682.pdf"
            },
            {
                "id": 45,
                "fullText": "URBANIZADORA MUNICIPAL S/A (URBAM ). Sobre a Urbam. [s.d.]. Disponível em: https://urbam.com.br/pagina/urbam. Acesso em: 5 out. 2026.",
                "url": "https://urbam.com.br/pagina/urbam"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-36",
        "periodo": "1975–1978 (dias incertos)",
        "nome": "Ednardo José de Paula Santos",
        "cargo": "Nomeado em 1975; não se estende automaticamente o status após revogação da estância em 1977.",
        "marcos": "Câmara atribui à gestão planejamento/abertura de vias, rodoviária e Novo Horizonte; associa projeto/construção do Paço, inaugurado em 1979 sob Bevilacqua.",
        "situacaoDocumental": "Atribuições retrospectivas sem contratos/entregas consultados. Lei estadual nº 1.402/1977 encerrou condição de estância; cronologia da Câmara é defasada.",
        "bloco": "1942-2026",
        "categoria": "Nomeado",
        "refIds": [
            43,
            46,
            50
        ],
        "referenciasDetalhadas": [
            {
                "id": 43,
                "fullText": "SÃO PAULO (Estado ). Lei nº 1.402, de 5 de outubro de 1977. Exclui da condição de estância hidromineral o Município de São José dos Campos. Assembleia Legislativa do Estado de São Paulo. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1977/lei-1402-05.10.1977.html. Acesso em: 5 out. 2026.",
                "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1977/lei-1402-05.10.1977.html"
            },
            {
                "id": 46,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Ednardo recebe título de Cidadão Joseense nesta sexta. Notícias, 23 out. 2015. Disponível em: https://www.camarasjc.sp.gov.br/noticias/4732/ednardo-recebe-titulo-de-cidadao-joseense-nesta-sexta. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/noticias/4732/ednardo-recebe-titulo-de-cidadao-joseense-nesta-sexta"
            },
            {
                "id": 50,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Inauguração do Paço Municipal – fotógrafo: Miura (21-12-1979 ). Pró-Memória, 3 out. 2017. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2017/10/03/inauguracao-do-paco-municipal-fotografo-miura-1979-12-21-lf359/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2017/10/03/inauguracao-do-paco-municipal-fotografo-miura-1979-12-21-lf359/"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-37",
        "periodo": "Eleito em 15 nov. 1978; mandato desde 1979 até renúncia em 1982",
        "nome": "Joaquim Vicente Ferreira Bevilacqua (1º mandato)",
        "cargo": "Prefeito eleito, primeiro após mudança do estatuto político.",
        "marcos": "Paço inaugurado em 21 dez. 1979; Lei nº 2.263/1980 regulou parcelamento, uso e ocupação do solo. Renunciou em 1982 junto com o vice. [47–50]",
        "situacaoDocumental": "Dias de posse/renúncia não localizados; lei não prova execução urbanística.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            47,
            48,
            49,
            50
        ],
        "referenciasDetalhadas": [
            {
                "id": 47,
                "fullText": "TRIBUNAL REGIONAL ELEITORAL DE SÃO PAULO. Eleições de 1975 a 1979. [s.d.]. Disponível em: https://www.tre-sp.jus.br/eleicoes/eleicoes-anteriores/eleicoes-1964-1992/eleicoes-de-1975-a-1979. Acesso em: 5 out. 2026.",
                "url": "https://www.tre-sp.jus.br/eleicoes/eleicoes-anteriores/eleicoes-1964-1992/eleicoes-de-1975-a-1979"
            },
            {
                "id": 48,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Ex-prefeito de São José é homenageado pela Câmara em sessão solene. Notícias, 24 abr. 2019. Disponível em: https://www.camarasjc.sp.gov.br/noticias/6581/ex-prefeito-de-sao-jose-e-homenageado-pela-camara-em-sessao-solene. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/noticias/6581/ex-prefeito-de-sao-jose-e-homenageado-pela-camara-em-sessao-solene"
            },
            {
                "id": 49,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 2.263, de 4 de janeiro de 1980. Dispõe sobre o parcelamento, uso e ocupação do solo do Município e dá outras providências. Legislação municipal. Disponível em: https://www.sjc.sp.gov.br/legislacao/Leis/1980/2263.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/legislacao/Leis/1980/2263.pdf"
            },
            {
                "id": 50,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Inauguração do Paço Municipal – fotógrafo: Miura (21-12-1979 ). Pró-Memória, 3 out. 2017. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2017/10/03/inauguracao-do-paco-municipal-fotografo-miura-1979-12-21-lf359/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/2017/10/03/inauguracao-do-paco-municipal-fotografo-miura-1979-12-21-lf359/"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-38",
        "periodo": "1982–1983 (nove meses; dias incertos)",
        "nome": "José Luiz Carvalho de Almeida",
        "cargo": "Presidente da Câmara que sucedeu prefeito e vice renunciantes; sucessão institucional.",
        "marcos": "Exercício e circunstância da sucessão documentados.",
        "situacaoDocumental": "Sem marco de obra/política individual verificado.",
        "bloco": "1942-2026",
        "categoria": "Sucessão / Interino",
        "refIds": [
            48,
            51
        ],
        "referenciasDetalhadas": [
            {
                "id": 48,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Ex-prefeito de São José é homenageado pela Câmara em sessão solene. Notícias, 24 abr. 2019. Disponível em: https://www.camarasjc.sp.gov.br/noticias/6581/ex-prefeito-de-sao-jose-e-homenageado-pela-camara-em-sessao-solene. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/noticias/6581/ex-prefeito-de-sao-jose-e-homenageado-pela-camara-em-sessao-solene"
            },
            {
                "id": 51,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Ex-vereador recebe título de Cidadão Joseense: José Luiz Carvalho de Almeida. Notícias, 30 ago. 2010. Disponível em: https://www.camarasjc.sp.gov.br/noticias/815/ex-vereador-recebe-titulo-de-cidadao-joseense. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/noticias/815/ex-vereador-recebe-titulo-de-cidadao-joseense"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-39",
        "periodo": "1983–1986 (no recorte, 1983–1984)",
        "nome": "Robson Riedel Marinho",
        "cargo": "Prefeito eleito em 1982.",
        "marcos": "Mais alterações da Lei de Uso do Solo ocorreram na gestão completa. Lei nº 3.050/1985 autorizou Fundação Cultural; escritura de 1986 não pode ser atribuída com segurança a Robson ou sucessor. [22, 53–54, 56–57]",
        "situacaoDocumental": "Estudo abrange 1983–1986, sem separar anos do recorte nem comprovar obra física.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            22,
            53,
            54,
            56,
            57
        ],
        "referenciasDetalhadas": [
            {
                "id": 22,
                "fullText": "COSTA, Paulo Eduardo Oliveira. Legislação urbanística e crescimento urbano em São José dos Campos. 2007. Dissertação (Mestrado em Arquitetura e Urbanismo ) – Faculdade de Arquitetura e Urbanismo, Universidade de São Paulo, São Paulo, 2007. Disponível em: https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf. Acesso em: 5 out. 2026.",
                "url": "https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf"
            },
            {
                "id": 53,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Atas da Câmara Municipal de São José dos Campos: fevereiro a maio de 1983. Pró-Memória, arquivo digital em PDF. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/02/atas-da-camara-municipal-de-sjc-fev-a-mai-1983_compressed.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/02/atas-da-camara-municipal-de-sjc-fev-a-mai-1983_compressed.pdf"
            },
            {
                "id": 54,
                "fullText": "TRIBUNAL DE CONTAS DO ESTADO DE SÃO PAULO. Currículo vitae: Robson Riedel Marinho. [s.d.]. Disponível em: https://www.tce.sp.gov.br/sites/default/files/portal/robson_marinho.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.tce.sp.gov.br/sites/default/files/portal/robson_marinho.pdf"
            },
            {
                "id": 56,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 3.050, de 14 de novembro de 1985. Autoriza o Poder Executivo a criar a Fundação Cultural de São José dos Campos e dá outras providências. São José dos Campos: Prefeitura Municipal, 1985. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1985/LE198500003050.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1985/LE198500003050.pdf"
            },
            {
                "id": 57,
                "fullText": "GALVÃO, Luiza Irene Gozzo. Da cultura rural à Fundação Cultural: um estudo sobre cultura e políticas culturais na vida urbana de São José dos Campos no século XX. 2004. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2004. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-40",
        "periodo": "1986 (breve gestão; dias incertos)",
        "nome": "Hélio Augusto de Souza",
        "cargo": "Vice-prefeito eleito que assumiu por sucessão.",
        "marcos": "Galvão registra sucessão e falecimento poucos meses depois; sem marco administrativo individual verificado.",
        "situacaoDocumental": "Dias de exercício não localizados.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            57
        ],
        "referenciasDetalhadas": [
            {
                "id": 57,
                "fullText": "GALVÃO, Luiza Irene Gozzo. Da cultura rural à Fundação Cultural: um estudo sobre cultura e políticas culturais na vida urbana de São José dos Campos no século XX. 2004. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2004. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-41",
        "periodo": "1986–1988 (dias incertos)",
        "nome": "Antônio José Mendes Faria",
        "cargo": "Presidente da Câmara que assumiu após morte de Hélio; não interventor.",
        "marcos": "Lei nº 3.227/1987 autorizou FUNDHAS; como prefeito, assinou Decreto nº 6.151/1987, que nomeou Rua Francisco Ricci. [57–59]",
        "situacaoDocumental": "Autorização não prova instalação/resultados; datas de sucessão incertas.",
        "bloco": "1942-2026",
        "categoria": "Sucessão / Interino",
        "refIds": [
            57,
            58,
            59
        ],
        "referenciasDetalhadas": [
            {
                "id": 57,
                "fullText": "GALVÃO, Luiza Irene Gozzo. Da cultura rural à Fundação Cultural: um estudo sobre cultura e políticas culturais na vida urbana de São José dos Campos no século XX. 2004. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2004. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf"
            },
            {
                "id": 58,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 3.227, de 28 de abril de 1987. Autoriza o Poder Executivo a criar a Fundação de Atendimento à Criança e ao Adolescente Prof. Hélio Augusto de Souza – FUNDHAS. São José dos Campos: Prefeitura Municipal, 1987. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1987/LE198700003227.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1987/LE198700003227.pdf"
            },
            {
                "id": 59,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Rua Francisco Ricci (Vila Gaianazes ). São José dos Campos, [s.d.]. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/tag/projeto-ruas/page/3/. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/tag/projeto-ruas/page/3/"
            }
        ],
        "eraId": "democratizacao",
        "eraNome": "Autonomia Política & Expansão Industrial (1959–1988)",
        "eraCor": "blue"
    },
    {
        "id": "pref-42",
        "periodo": "1º jan. 1989–2 abr. 1990",
        "nome": "Joaquim Vicente Ferreira Bevilacqua (2º mandato)",
        "cargo": "Eleito em 1988.",
        "marcos": "Decreto nº 6.638/1989 remanejou NCz$ 20.500 para estagiários e Esporte/Lazer. [57, 60–61]",
        "situacaoDocumental": "Crédito não prova serviços entregues; renunciou em 2 abr. 1990, sucedido pelo vice.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            57,
            60,
            61
        ],
        "referenciasDetalhadas": [
            {
                "id": 57,
                "fullText": "GALVÃO, Luiza Irene Gozzo. Da cultura rural à Fundação Cultural: um estudo sobre cultura e políticas culturais na vida urbana de São José dos Campos no século XX. 2004. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2004. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf"
            },
            {
                "id": 60,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 6.638, de 15 de março de 1989. Dispõe sobre abertura de crédito adicional no valor de NCz$ 20.500,00. São José dos Campos: Prefeitura Municipal, 1989. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1989/DE198900006638.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1989/DE198900006638.pdf"
            },
            {
                "id": 61,
                "fullText": "RAMOS, Ilka. Políticas públicas e a estruturação de um programa para o combate à violência doméstica: caminhos do Programa Aquarela, São José dos Campos. 2015. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2015. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Pol%C3%ADticas-P%C3%BAblicas-e-a-Estrutura%C3%A7%C3%A3o-de-um-Programa-para-o-Combate-%C3%A0-Viol%C3%AAncia-Dom%C3%A9stica-Caminhos-do-Programa-Aquarela-S%C3%A3o-Jos%C3%A9-dos-Campos.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Pol%C3%ADticas-P%C3%BAblicas-e-a-Estrutura%C3%A7%C3%A3o-de-um-Programa-para-o-Combate-%C3%A0-Viol%C3%AAncia-Dom%C3%A9stica-Caminhos-do-Programa-Aquarela-S%C3%A3o-Jos%C3%A9-dos-Campos.pdf"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-43",
        "periodo": "2 abr. 1990–31 dez. 1992",
        "nome": "Pedro Yves Simão",
        "cargo": "Vice eleito em 1988; sucedeu Bevilacqua.",
        "marcos": "Decreto nº 7.379/1991 abriu crédito de Cr$ 60 milhões para reforma do Mercado Municipal. [61–64]",
        "situacaoDocumental": "Crédito não prova conclusão da reforma.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            61,
            62,
            63,
            64
        ],
        "referenciasDetalhadas": [
            {
                "id": 61,
                "fullText": "RAMOS, Ilka. Políticas públicas e a estruturação de um programa para o combate à violência doméstica: caminhos do Programa Aquarela, São José dos Campos. 2015. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2015. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Pol%C3%ADticas-P%C3%BAblicas-e-a-Estrutura%C3%A7%C3%A3o-de-um-Programa-para-o-Combate-%C3%A0-Viol%C3%AAncia-Dom%C3%A9stica-Caminhos-do-Programa-Aquarela-S%C3%A3o-Jos%C3%A9-dos-Campos.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Pol%C3%ADticas-P%C3%BAblicas-e-a-Estrutura%C3%A7%C3%A3o-de-um-Programa-para-o-Combate-%C3%A0-Viol%C3%AAncia-Dom%C3%A9stica-Caminhos-do-Programa-Aquarela-S%C3%A3o-Jos%C3%A9-dos-Campos.pdf"
            },
            {
                "id": 62,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 15.681, de 2013 [declara luto oficial pelo falecimento do ex-prefeito Pedro Yves Simão]. São José dos Campos: Prefeitura Municipal, 2013. Disponível em: https://www.sjc.sp.gov.br/legislacao/Decretos/2013/15681.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/2013/15681.pdf"
            },
            {
                "id": 63,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 7.379, de 2 de setembro de 1991 [dispõe sobre abertura de crédito especial para reforma do Mercado Municipal]. São José dos Campos: Prefeitura Municipal, 1991. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1991/DE199100007379.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1991/DE199100007379.pdf"
            },
            {
                "id": 64,
                "fullText": "G1 VALE DO PARAÍBA E REGIÃO. Morre Pedro Yves Simão, ex-prefeito de São José dos Campos. 29 nov. 2013. Disponível em: https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2013/11/morre-pedro-yves-simao-ex-prefeito-de-sao-jose-dos-campos.html. Acesso em: 5 out. 2026.",
                "url": "https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2013/11/morre-pedro-yves-simao-ex-prefeito-de-sao-jose-dos-campos.html"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-44",
        "periodo": "1º jan. 1993–31 dez. 1996",
        "nome": "Ângela Moraes Guadagnin",
        "cargo": "Eleita em 1992.",
        "marcos": "Estudo relata capacitação em favelas, mutirões habitacionais e cooperativas de serviços de bairro. [57, 65–66]",
        "situacaoDocumental": "Evidência qualitativa, sem escala/conclusão de obras; estudo aponta falta de dados oficiais. Resultado municipal do TSE não recuperado.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            57,
            65,
            66
        ],
        "referenciasDetalhadas": [
            {
                "id": 57,
                "fullText": "GALVÃO, Luiza Irene Gozzo. Da cultura rural à Fundação Cultural: um estudo sobre cultura e políticas culturais na vida urbana de São José dos Campos no século XX. 2004. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2004. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf. Acesso em: 5 out. 2026.",
                "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf"
            },
            {
                "id": 65,
                "fullText": "SILVA, Diva Dias da. Desigualdade social no Brasil: a questão habitacional em São José dos Campos – SP. 2008. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2008. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/0000024d.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/0000024d.pdf"
            },
            {
                "id": 66,
                "fullText": "ALVES, Vangivaldo da Silva. Cultura pela liberdade: páginas de uma ação cultural (São José dos Campos, 1993 a 1998 ). 2000. Relatório final de trabalho de graduação – Faculdade de Educação, Universidade do Vale do Paraíba, São José dos Campos, 2000. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2023/05/2000-cultura-pela-liberdade-paginas-de-uma-acao-cultura.pdf. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2023/05/2000-cultura-pela-liberdade-paginas-de-uma-acao-cultura.pdf"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-45",
        "periodo": "1º jan. 1997–31 dez. 2000",
        "nome": "Emanuel Fernandes (1º mandato)",
        "cargo": "Eleito em 1996.",
        "marcos": "Lei nº 5.126/1997, assinada por Emanuel, autorizou R$ 80 mil para subvencionar entidades desportivas.",
        "situacaoDocumental": "Reportagem contemporânea identifica vitória; autorização não prova repasse/gasto. Interinidades breves não pesquisadas integralmente.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            68,
            71
        ],
        "referenciasDetalhadas": [
            {
                "id": 68,
                "fullText": "FOLHA DE S.PAULO. Emanuel recebe 46 mil votos. Folha de S.Paulo, São Paulo, 16 nov. 1996. Caderno Especial. Disponível em: https://www1.folha.uol.com.br/fsp/1996/11/16/caderno_especial/23.html. Acesso em: 5 out. 2026.",
                "url": "https://www1.folha.uol.com.br/fsp/1996/11/16/caderno_especial/23.html"
            },
            {
                "id": 71,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 5.126, de 10 de novembro de 1997 [dispõe sobre abertura de crédito especial no valor de R$ 80.000,00]. São José dos Campos: Prefeitura Municipal, 1997. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1997/LE199700005126.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1997/LE199700005126.pdf"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-46",
        "periodo": "1º jan. 2001–31 dez. 2004",
        "nome": "Emanuel Fernandes (2º mandato)",
        "cargo": "Reeleito em 2000.",
        "marcos": "LC nº 272/2003 dispôs sobre ISSQN.",
        "situacaoDocumental": "Término segue ciclo quadrienal; cópia não permite atribuir assinatura pessoal nem resultado arrecadatório.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            69,
            72
        ],
        "referenciasDetalhadas": [
            {
                "id": 69,
                "fullText": "MENDONÇA, Eliane. Nova Câmara garante maioria a Emanuel. Folha Vale, São Paulo, 3 out. 2000. Eleições 2000. Disponível em: https://www1.folha.uol.com.br/fsp/vale/vl0310200001.htm. Acesso em: 5 out. 2026.",
                "url": "https://www1.folha.uol.com.br/fsp/vale/vl0310200001.htm"
            },
            {
                "id": 72,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei Complementar nº 272/03, de 18 de dezembro de 2003 [dispõe sobre o Imposto Sobre Serviços de Qualquer Natureza – ISSQN]. São José dos Campos: Prefeitura Municipal, 2003. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2003/LC200300000272.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2003/LC200300000272.pdf"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-47",
        "periodo": "1º jan. 2005–31 dez. 2008",
        "nome": "Eduardo Pedrosa Cury (1º mandato)",
        "cargo": "Eleito em 2004, 1º turno.",
        "marcos": "LC nº 306/2006 instituiu PDDI e traz assinatura de Cury; estudo descreve diretrizes viárias e propostas para o Banhado. [70, 73–74]",
        "situacaoDocumental": "Plano/propostas não provam execução, parque ou remoções.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            70,
            73,
            74
        ],
        "referenciasDetalhadas": [
            {
                "id": 70,
                "fullText": "SÃO JOSÉ DOS CAMPOS elege tucano Eduardo Cury no 1º turno. Folha Online, 4 out. 2004. Disponível em: https://www1.folha.uol.com.br/folha/brasil/ult96u64697.shtml. Acesso em: 5 out. 2026.",
                "url": "https://www1.folha.uol.com.br/folha/brasil/ult96u64697.shtml"
            },
            {
                "id": 73,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei Complementar nº 306, de 17 de novembro de 2006 [institui o Plano Diretor de Desenvolvimento Integrado]. São José dos Campos: Prefeitura Municipal, 2006. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2006/LC200600000306.pdf. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2006/LC200600000306.pdf"
            },
            {
                "id": 74,
                "fullText": "ALMEIDA SILVA, Douglas; VIANNA, Paula Vilhena Carnevale; ZANETTI, Valéria Regina. Urban planning, agents and representations: creation of the Banhado, São José dos Campos landmark. Ambiente & Sociedade, São Paulo, v. 20, n. 2, 2017. Disponível em: https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?lang=pt. Acesso em: 5 out. 2026.",
                "url": "https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?lang=pt"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-48",
        "periodo": "1º jan. 2009–31 dez. 2012",
        "nome": "Eduardo Pedrosa Cury (2º mandato)",
        "cargo": "Eleito em 2008.",
        "marcos": "Lei nº 8.195/2010 criou o Parque Natural Municipal Augusto Ruschi.",
        "situacaoDocumental": "Criação legal não prova infraestrutura concluída; período quadrienal.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            75,
            77
        ],
        "referenciasDetalhadas": [
            {
                "id": 75,
                "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2008, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2008&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
                "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2008&cargo=11&mun=354990"
            },
            {
                "id": 77,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 8.195, de 17 de setembro de 2010 [cria o Parque Natural Municipal Augusto Ruschi – PNMAR]. São José dos Campos, 2010. Disponível em: https://siteprefeitura.sjc.sp.gov.br/media/166098/lei-8195-2010-cria-o-pnmar-27-9-21.pdf. Acesso em: 5 out. 2026.",
                "url": "https://siteprefeitura.sjc.sp.gov.br/media/166098/lei-8195-2010-cria-o-pnmar-27-9-21.pdf"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-49",
        "periodo": "1º jan. 2013–31 dez. 2016",
        "nome": "Carlos José de Almeida (Carlinhos Almeida)",
        "cargo": "Eleito em 2012; posse em 1º jan. 2013.",
        "marcos": "Prefeitura inaugurou em 23 maio 2015 o Instituto Materno-Infantil Helena Ferreira (14 salas; capacidade divulgada de 325 crianças) e reportou cerca de 5 mil vagas abertas desde 2013.",
        "situacaoDocumental": "Dados de vagas são da Prefeitura, sem auditoria independente consultada.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            78,
            79,
            80
        ],
        "referenciasDetalhadas": [
            {
                "id": 78,
                "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2012, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2012&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
                "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2012&cargo=11&mun=354990"
            },
            {
                "id": 79,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cerimônia de posse no dia 1º de janeiro. São José dos Campos, 27 dez. 2012. Disponível em: https://www.camarasjc.sp.gov.br/noticias/934/cerimonia-de-posse-no-dia-1-de-janeiro. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/noticias/934/cerimonia-de-posse-no-dia-1-de-janeiro"
            },
            {
                "id": 80,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Comunidade do Jardim Jussara comemora nova escola infantil. São José dos Campos, 23 maio 2015. Disponível em: https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=20585. Acesso em: 5 out. 2026.",
                "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=20585"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-50",
        "periodo": "1º jan. 2017–31 dez. 2020",
        "nome": "Felicio Ramuth (1º mandato)",
        "cargo": "Eleito em 2016.",
        "marcos": "Prefeitura liberou Arco da Inovação em abr. 2020; Hospital de Retaguarda começou a funcionar em jul. 2020 com 40 leitos. [81, 83–84]",
        "situacaoDocumental": "Abertura/funcionamento documentados; notícia registra custo e fontes de financiamento, sem avaliação independente.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            81,
            83,
            84
        ],
        "referenciasDetalhadas": [
            {
                "id": 81,
                "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2016, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2016&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
                "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2016&cargo=11&mun=354990"
            },
            {
                "id": 83,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Prefeitura de São José libera o tráfego no Arco da Inovação. São José dos Campos, 24 abr. 2020. Disponível em: https://www.sjc.sp.gov.br/noticias/2020/abril/24/prefeitura-de-sao-jose-libera-o-trafego-no-arco-da-inovacao/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/noticias/2020/abril/24/prefeitura-de-sao-jose-libera-o-trafego-no-arco-da-inovacao/"
            },
            {
                "id": 84,
                "fullText": "G1 VALE DO PARAÍBA E REGIÃO. São José inaugura hospital de retaguarda para atender pacientes com Covid-19. G1, 8 jul. 2020. Disponível em: https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2020/07/08/hospital-de-retaguarda-comeca-a-funcionar-em-sao-jose-dos-campos.ghtml. Acesso em: 5 out. 2026.",
                "url": "https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2020/07/08/hospital-de-retaguarda-comeca-a-funcionar-em-sao-jose-dos-campos.ghtml"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-51",
        "periodo": "1º jan. 2021–31 mar. 2022",
        "nome": "Felicio Ramuth (2º mandato, parcial)",
        "cargo": "Reeleito em 2020; renunciou em 31 mar. 2022.",
        "marcos": "Vacinação municipal contra Covid-19 começou em 20 jan. 2021 com profissionais de saúde.",
        "situacaoDocumental": "Câmara confirma sucessão no dia seguinte; vacinação não atribuída exclusivamente ao prefeito.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            85,
            86,
            87
        ],
        "referenciasDetalhadas": [
            {
                "id": 85,
                "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2020, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2020&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
                "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2020&cargo=11&mun=354990"
            },
            {
                "id": 86,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Felicio Ramuth é empossado prefeito para o segundo mandato. São José dos Campos, 1 jan. 2021. Disponível em: https://www.sjc.sp.gov.br/noticias/2021/janeiro/01/felicio-ramuth-e-empossado-prefeito-para-o-segundo-mandato/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/noticias/2021/janeiro/01/felicio-ramuth-e-empossado-prefeito-para-o-segundo-mandato/"
            },
            {
                "id": 87,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Profissionais de saúde recebem primeiras doses da vacina. São José dos Campos, 20 jan. 2021. Disponível em: https://www.sjc.sp.gov.br/noticias/2021/janeiro/20/profissionais-de-saude-recebem-primeiras-doses-da-vacina/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/noticias/2021/janeiro/20/profissionais-de-saude-recebem-primeiras-doses-da-vacina/"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-52",
        "periodo": "1º abr. 2022–31 dez. 2024",
        "nome": "Anderson Farias Ferreira (sucessor)",
        "cargo": "Vice eleito em 2020, assumiu após renúncia; não eleito prefeito em 2020.",
        "marcos": "Primeira etapa da Linha Verde entrou em operação em 2022: 14,5 km, 13 estações, 12 VLPs elétricos. [88–89]",
        "situacaoDocumental": "Registro municipal não prova que projeto inteiro tenha sido concebido/executado sob Anderson.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            88,
            89
        ],
        "referenciasDetalhadas": [
            {
                "id": 88,
                "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Anderson Farias assume cargo de prefeito em cerimônia na Câmara. São José dos Campos, 1 abr. 2022. Disponível em: https://www.camarasjc.sp.gov.br/noticias/7773/anderson-farias-assume-cargo-de-prefeito-em-cerimonia-na-camara. Acesso em: 5 out. 2026.",
                "url": "https://www.camarasjc.sp.gov.br/noticias/7773/anderson-farias-assume-cargo-de-prefeito-em-cerimonia-na-camara"
            },
            {
                "id": 89,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Linha Verde e frota elétrica inovam transporte coletivo em São José. São José dos Campos, 28 dez. 2022. Disponível em: https://www.sjc.sp.gov.br/noticias/2022/dezembro/28/linha-verde-e-frota-eletrica-inovam-transporte-coletivo-em-sao-jose/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/noticias/2022/dezembro/28/linha-verde-e-frota-eletrica-inovam-transporte-coletivo-em-sao-jose/"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    },
    {
        "id": "pref-53",
        "periodo": "1º jan. 2025–5 out. 2026 (mandato até 2028)",
        "nome": "Anderson Farias Ferreira",
        "cargo": "Eleito prefeito diretamente no 2º turno de 2024; empossado em 2025.",
        "marcos": "Posse registra Secretaria de Gestão Habitacional e titular, sem ato instituidor localizado. Em jul. 2026, Prefeitura informou mais de 5,75 milhões de embarques na Linha Verde e alta de 51% na média diária (2023–2025). [90–92]",
        "situacaoDocumental": "Prefeitura o chamou de reeleito; em 2020 fora eleito vice e assumira em 2022. Indicadores não provam autoria pessoal nem expansão concluída.",
        "bloco": "1942-2026",
        "categoria": "Eleito",
        "refIds": [
            90,
            91,
            92
        ],
        "referenciasDetalhadas": [
            {
                "id": 90,
                "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2024, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2024&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
                "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2024&cargo=11&mun=354990"
            },
            {
                "id": 91,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Anderson Farias é empossado prefeito para o segundo mandato. São José dos Campos, 2 jan. 2025. Disponível em: https://www.sjc.sp.gov.br/noticias/2025/janeiro/02/anderson-farias-e-empossado-prefeito-para-o-segundo-mandato/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/noticias/2025/janeiro/02/anderson-farias-e-empossado-prefeito-para-o-segundo-mandato/"
            },
            {
                "id": 92,
                "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Linha Verde passa de 5,7 milhões de embarques em São José. São José dos Campos, 24 jul. 2026. Disponível em: https://www.sjc.sp.gov.br/noticias/2026/julho/24/linha-verde-passa-de-5-7-milhoes-de-embarques-em-sao-jose/. Acesso em: 5 out. 2026.",
                "url": "https://www.sjc.sp.gov.br/noticias/2026/julho/24/linha-verde-passa-de-5-7-milhoes-de-embarques-em-sao-jose/"
            }
        ],
        "eraId": "tecnologica",
        "eraNome": "Polo Tecnológico & Metrópole Contemporânea (1989–2026)",
        "eraCor": "cyan"
    }
],

  prefeitosDossie: {
    "titulo": "Prefeitos, intendentes e autoridades municipais de São José dos Campos — evidências até 2026",
    "escopoBloco1": "Material recuperado da pesquisa documental primária e institucional até 1941. 'Confirmado' significa que o resultado aponta documento ou fonte específica; nem todo documento primário foi diretamente consultado em fac-símile. As incertezas são mantidas explícitas.",
    "escopoBloco2": "Recorte apurado até 5 out. 2026. Ordem pelo primeiro ano/marco conhecido; anos sem dias de posse não permitem ordenar episódios dentro do mesmo ano. Até a eletividade local, iniciada em 25 out. 1958, prefeitos eram nomeados pelo Governo do Estado. [19–20]",
    "correcoesTabelaInicial": [
        "A alegação de “prefeito” em 1798 ou 1806–1817 não se sustenta: a lei provincial que instituiu o emprego de prefeito nas vilas paulistas é de 1835. Para Tomé Alves Alvarenga, só foi encontrada uma afirmação secundária de que teria sido alcaide em 1798; o período até 1805 não foi comprovado. Para Joaquim Antônio Cabral, não foi localizada comprovação de nome, cargo ou datas.",
        "A Lei provincial nº 18 é de 11 de abril de 1835, não de 1834. Manoel Joaquim de Andrade aparece como prefeito em atas de novembro e dezembro de 1835. A Lei provincial nº 4, de 29 de janeiro de 1838, revogou o emprego criado em 1835. Assim, 1839–1888 não deve ser apresentado simplesmente como uma lacuna de prefeitos.",
        "A linha “Francisco Oliveira Lima, 1890–1893” confunde a participação dele como membro do Conselho de Intendência em 1890 com chefia do Executivo, algo que a fonte consultada não comprova. A mesma compilação aponta Francisco Alves Fagundes como presidente do Conselho.",
        "A lista de presidentes dos Conselhos municipais não equivale automaticamente a uma lista de prefeitos. Nomes como José Monteiro Ferreira e Nelson Silveira D’Ávila aparecem como presidentes de Conselho na compilação institucional; é necessário encontrar atos ou fontes próprias para atribuir-lhes chefia executiva.",
        "“João Alves da Silva Cursino, 1918–1930” precisa ser desdobrado e qualificado: as fontes consultadas indicam períodos anteriores com divergências, uma presidência de Conselho em 1917–1919 e exercício comprovado como prefeito em fevereiro de 1919. O mandato até 1930 é apoiado por estudo institucional/acadêmico.",
        "A Junta de 1930 aparece com “Arnaldo Cerdeira” em fonte institucional, enquanto a tabela recebida traz “Antônio Cerdeira”. Manter a divergência visível até conferência em fonte primária.",
        "No período sanatorial, não atribuir a cada prefeito todas as obras previstas no decreto ou nos planos de governo. Distinguir norma, plano, ato executado e interpretação historiográfica."
    ],
    "lacunasBloco1": [
        "Este primeiro bloco mantém o recorte documental original até 1941. A sucessão executiva de 1890–1930 continua parcialmente incompleta, porque a principal lista institucional recuperada registra muitos presidentes de Conselho e não permite identificá-los automaticamente como prefeitos. A continuação cronológica, de 1942 a 2026, aparece na seção seguinte; portanto, o limite de 1941 aplica-se apenas a este bloco, não ao documento consolidado."
    ],
    "lacunasBloco2": [
        "Para 1942–1957, quadro sucessório retrospectivo sem dias exatos; divergências sobre Otávio Del Nero, Jorge Zarur, Paulino Blair e Pedro Sinisgalli. Sem atos primários para algumas investiduras; José Vieira segue qualificado. Lei da Casa Popular sem assinatura legível; Costa atribui criação a Tertuliano, embora o quadro só o situe em 1950. Costa imprime Lei 381 para o Código de Obras, mas documento é Lei 281. [19, 21–22, 25–26, 31]",
        "Elmano aparece como eleito em 1959–1962 ou 1958–1961; resultado individual de Marcondes não validado no TSE. Transição de 1970 diverge entre 31 jan. e 4 fev.; Câmara também diverge de fontes quanto à perda de autonomia/nomeações. Suspensão do Conselho Cultural sob Sobral sem ato original localizado. [19–22, 35–36, 39, 42]",
        "Dias exatos de transições de Sérgio, Ednardo, Bevilacqua (1º mandato) e José Luiz não recuperados. Lei de 1977 e eleição de 1978 documentam mudança de regime. Atribuições retrospectivas, planos, créditos e autorizações não comprovam execução; estudos urbanísticos por mandato inteiro não isolam anos parciais. [19, 43, 46–53]",
        "De 1985–1996, faltam datas diárias de sucessões breves; não se identificou interventor estadual. TSE não forneceu resultado municipal legível em 1992. De 1997–2008, eleições identificadas por reportagens, sem varredura integral de licenças/substituições. [42, 54–74]",
        "De 2009–2026 não se identificou interventor; substituição documentada é o vice Anderson em 1º abr. 2022. Seade identifica TSE/TRE como fontes, mas extração textual oficial não revelou resultados legíveis. Notícias municipais podem ser promocionais; faltam atos integrais de posse/renúncia, ato da Secretaria Habitacional e comprovação de expansão total da Linha Verde. [75–92]"
    ],
    "referencias": [
        {
            "id": 1,
            "fullText": "SÃO PAULO (Província). Lei n. 18, de 11 de abril de 1835. Repositório de Legislação da Assembleia Legislativa do Estado de São Paulo. Arts. 1º–2º e 4º. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html. Acesso em: 5 out. 2026.",
            "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1835/lei-18-11.04.1835.html"
        },
        {
            "id": 2,
            "fullText": "SÃO PAULO (Província ). Lei n. 4, de 29 de janeiro de 1838. Repositório de Legislação da Assembleia Legislativa do Estado de São Paulo. Arts. 1º–2º. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1838/lei-4-29.01.1838.html. Acesso em: 5 out. 2026.",
            "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1838/lei-4-29.01.1838.html"
        },
        {
            "id": 3,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Transcrição da ata da Câmara Municipal de São José dos Campos – 2 de novembro de 1835. Pró-Memória. São José dos Campos, 2024. PDF, pp. 26–27. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-2.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-2.pdf"
        },
        {
            "id": 4,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Transcrição da ata da Câmara Municipal de São José dos Campos – 12 de dezembro de 1835. Pró-Memória. São José dos Campos, 2024. PDF, pp. 29–31, em especial p. 31. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-4.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/06/transcricao-4.pdf"
        },
        {
            "id": 5,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia – Pró-Memória. São José dos Campos, [s.d.]. Página web, sem paginação. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/"
        },
        {
            "id": 6,
            "fullText": "VALEPARAIBANO. [A história de São José dos Campos: parte 2]. São José dos Campos, 27 jul. 1978. Reprodução digital em: SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. A história de São José pt. 2 (1978 ). Página web, sem paginação. Disponível em: https://www.sjcantigamente.com.br/a-historia-de-sao-jose-pt-2-1978/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjcantigamente.com.br/a-historia-de-sao-jose-pt-2-1978/"
        },
        {
            "id": 7,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Conheça a Câmara. São José dos Campos, [s.d.]. Página web, sem paginação. Disponível em: https://www.camarasjc.sp.gov.br/a-camara/conheca-a-camara.php. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/a-camara/conheca-a-camara.php"
        },
        {
            "id": 8,
            "fullText": "ELIAS, Pedro. Vereadores de São José dos Campos. São José dos Campos: Câmara Municipal de São José dos Campos, [s.d.]. PDF, pp. 10–16. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/03/Vereadores-de-Sao-Jose-dos-Campos.pdf"
        },
        {
            "id": 9,
            "fullText": "ROQUE, Zuleika Stefânia Sabino. Educação e cotidiano escolar em São José dos Campos (1889–1930 ). 2007. Dissertação (Mestrado em História Social) – Pontifícia Universidade Católica de São Paulo, São Paulo, 2007. PDF, pp. 32 e 104–105. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2015/07/Educa%C3%A7%C3%A3o-e-cotidiano-Escolar-em-S%C3%A3o-Jos%C3%A9-dos-Campos-1889-1930.pdf. Acesso em: 5 out. 2026.",
            "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2015/07/Educa%C3%A7%C3%A3o-e-cotidiano-Escolar-em-S%C3%A3o-Jos%C3%A9-dos-Campos-1889-1930.pdf"
        },
        {
            "id": 10,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 94, de 15 de fevereiro de 1919. Registro da legislação municipal. São José dos Campos, 1919. PDF, p. 1. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1919/LE191900000094.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1919/LE191900000094.pdf"
        },
        {
            "id": 11,
            "fullText": "HISTÓRICO da cidade: São José dos Campos. Migalhas, Dr. Pintassilgo, [s.d.]. Seção “Mercado Municipal”, sem paginação. Disponível em: https://www.migalhas.com.br/drpintassilgo/27232/sao-jose-dos-campos/historico-da-cidade. Acesso em: 5 out. 2026.",
            "url": "https://www.migalhas.com.br/drpintassilgo/27232/sao-jose-dos-campos/historico-da-cidade"
        },
        {
            "id": 12,
            "fullText": "SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. Coronel João Alves da Silva Cursino. [Transcrição do Almanach de 1922]. Página web, sem paginação. Disponível em: https://www.sjcantigamente.com.br/coronel-joao-alves-da-silva-cursino/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjcantigamente.com.br/coronel-joao-alves-da-silva-cursino/"
        },
        {
            "id": 13,
            "fullText": "ZANETTI, Valéria (org. ). Fase sanatorial de São José dos Campos: espaço e doença. São José dos Campos: Universidade do Vale do Paraíba, 2010. (São José dos Campos: História e Cidade, v. 4). PDF, pp. impressas 48–49 e 99. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf. Acesso em: 5 out. 2026.",
            "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-IV-Fase-Sanatorial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Espa%C3%A7o-e-Doen%C3%A7a-.pdf"
        },
        {
            "id": 14,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Página web, seção “Estância Climática” e “Eletividade de Prefeito”, sem paginação. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
        },
        {
            "id": 15,
            "fullText": "LESSA, Simone Narciso. A construção do Pólo Regional do Vale do Paraíba: planejamento regional e ordenamento territorial de São José dos Campos. In: ZANETTI, Valéria (org. ). Os Campos da Cidade: São José Revisitada. São Paulo: Intergraf, 2008. p. 117–148, especialmente pp. 127–129. (Série São José dos Campos: História e Cidade, v. 1). Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-I-Os-Campos-da-Cidade-S%C3%A3o-Jos%C3%A9-Revisitada.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-I-Os-Campos-da-Cidade-S%C3%A3o-Jos%C3%A9-Revisitada.pdf"
        },
        {
            "id": 16,
            "fullText": "SILVA, Douglas Almeida; VIANNA, Paula Vilhena Carnevale; ZANETTI, Valéria Regina. Planejamento urbano, agentes e representações: criação do Banhado, cartão postal de São José dos Campos. Ambiente & Sociedade, São Paulo, v. 20, n. 2, p. 159–184, abr./jun. 2017. DOI: https://doi.org/10.1590/1809-4422ASOC307R1V2022017. PDF consultado, pp. impressas 168–169 e 181. Disponível em: https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?format=pdf&lang=pt. Acesso em: 5 out. 2026.",
            "url": "https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?format=pdf&lang=pt"
        },
        {
            "id": 17,
            "fullText": "COSTA, Paulo Eduardo Oliveira. Legislação urbanística e crescimento urbano em São José dos Campos. 2007. Dissertação (Mestrado em Arquitetura e Urbanismo ) – Faculdade de Arquitetura e Urbanismo, Universidade de São Paulo, São Paulo, 2007. PDF, pp. impressas 28 e 73. Disponível em: https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf. Acesso em: 5 out. 2026.",
            "url": "https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf"
        },
        {
            "id": 18,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: Avenidas Engenheiro Francisco José Longo e Doutor Adhemar de Barros. São José dos Campos, 3 dez. 2024. Página web, sem paginação. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2024/12/03/projeto-ruas-avenidas-engenheiro-francisco-jose-longo-e-doutor-adhemar-de-barros/. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/2024/12/03/projeto-ruas-avenidas-engenheiro-francisco-jose-longo-e-doutor-adhemar-de-barros/"
        },
        {
            "id": 19,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. História de São José dos Campos-SP: até 1977. Pró-Memória, 5 jun. 2021. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/2021/06/05/historia-de-sao-jose-dos-campos-sp-ate-1977/"
        },
        {
            "id": 20,
            "fullText": "PREFEITURA DE SÃO JOSÉ DOS CAMPOS. História. São José em Dados. [s.d.]. Disponível em: https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/"
        },
        {
            "id": 21,
            "fullText": "SILVA, Natanael Francis. Fase sanatorial de São José dos Campos: um estudo sobre as pensões e sanatórios. 2020. Relatório final (Licenciatura em História ) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba, São José dos Campos, 2020. p. 48. Quadro da administração municipal, que cita Lessa (2001) como fonte. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2021/06/Fase-Sanatorial-de-Sa%CC%83o-Jose%CC%81-dos-Campos-1.pdf"
        },
        {
            "id": 22,
            "fullText": "COSTA, Paulo Eduardo Oliveira. Legislação urbanística e crescimento urbano em São José dos Campos. 2007. Dissertação (Mestrado em Arquitetura e Urbanismo ) – Faculdade de Arquitetura e Urbanismo, Universidade de São Paulo, São Paulo, 2007. Disponível em: https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf. Acesso em: 5 out. 2026.",
            "url": "https://teses.usp.br/teses/disponiveis/16/16133/tde-28052010-092006/publico/MonografiaMestradoFAUSEMIFINAL_2.pdf"
        },
        {
            "id": 23,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 16, de 31 de dezembro de 1947 [abre crédito especial para diferença de avaliação judicial de terreno desapropriado em Eugênio de Melo]. Legislação municipal, 1947. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1947/LE194700000016.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1947/LE194700000016.pdf"
        },
        {
            "id": 24,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 38, de 10 de março de 1949 [autoriza aforamento de terreno municipal à Companhia Rhodosá de Rayon S.A.]. Legislação municipal, 1949. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1949/LE194900000038.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1949/LE194900000038.pdf"
        },
        {
            "id": 25,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 108, de 9 de abril de 1951 [cria o Departamento da Casa Popular]. Legislação municipal, 1951. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1951/LE195100000108.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1951/LE195100000108.pdf"
        },
        {
            "id": 26,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 281, de 11 de janeiro de 1954 [adota o Código de Obras municipal]. Legislação municipal, 1954. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000281.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000281.pdf"
        },
        {
            "id": 27,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 301, de 21 de agosto de 1954 [abre crédito para reforma do prédio municipal em Santana do Paraíba e instalação de posto de arrecadação]. Legislação municipal, 1954. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000301.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1954/LE195400000301.pdf"
        },
        {
            "id": 28,
            "fullText": "GUIMARÃES, Antônio Carlos Machado. Cidade e memória: a construção de um lugar e sua importância no espaço urbano: um breve estudo sobre o crescimento de São José dos Campos na década de 1950 e a criação da Faculdade de Direito. Arquitextos, São Paulo, ano 18, n. 209.03, out. 2017. Disponível em: https://vitruvius.com.br/revistas/read/arquitextos/18.209/6747. Acesso em: 5 out. 2026.",
            "url": "https://vitruvius.com.br/revistas/read/arquitextos/18.209/6747"
        },
        {
            "id": 29,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 346, de 19 de abril de 1955 [altera o art. 165 da Lei nº 281/1954 sobre fixação e revisão periódica dos perímetros das zonas e bairros]. Legislação municipal, 1955. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1955/LE195500000346.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1955/LE195500000346.pdf"
        },
        {
            "id": 30,
            "fullText": "INSTITUTO TECNOLÓGICO DE AERONÁUTICA. A construção. [s.d.]. Disponível em: http://www.ita.br/aconstruo. Acesso em: 5 out. 2026.",
            "url": "http://www.ita.br/aconstruo"
        },
        {
            "id": 31,
            "fullText": "LISTA de prefeitos de São José dos Campos. In: WIKIPÉDIA: a enciclopédia livre. [s.d.]. Usada apenas como índice de alegações divergentes, não como comprovação primária. Disponível em: https://pt.wikipedia.org/wiki/ListadeprefeitosdeS%C3%A3oJos%C3%A9dos_Campos. Acesso em: 5 out. 2026.",
            "url": "https://pt.wikipedia.org/wiki/ListadeprefeitosdeS%C3%A3oJos%C3%A9dos_Campos"
        },
        {
            "id": 32,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 222, de 16 de janeiro de 1958 [concede pensão a dependentes de funcionário municipal falecido]. Legislação municipal, 1958. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000222.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000222.pdf"
        },
        {
            "id": 33,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 246, de 10 de setembro de 1958 [cria a Comissão do Plano Diretor do Município]. Legislação municipal, 1958. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000246.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1958/DE195800000246.pdf"
        },
        {
            "id": 34,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 605, de 9 de abril de 1959. Legislação municipal, 1959. Disponível em: https://www.sjc.sp.gov.br/legislacao/Leis/1959/605.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/legislacao/Leis/1959/605.pdf"
        },
        {
            "id": 35,
            "fullText": "INSTITUTO DE CIÊNCIA E TECNOLOGIA DE SÃO JOSÉ DOS CAMPOS. Elmano Ferreira Veloso – 4 vezes Prefeito Sanitário e Municipal de São José dos Campos-SP – Seresteiro – Benfeitor da FFOSJC, o atual ICT-UNESP. UNESP, [s.d.]. Disponível em: https://www.ict.unesp.br/#!/sobre-o-ict/institucional/historia/biografias/elmano-veloso/. Acesso em: 5 out. 2026.",
            "url": "https://www.ict.unesp.br/#!/sobre-o-ict/institucional/historia/biografias/elmano-veloso/"
        },
        {
            "id": 36,
            "fullText": "RODRIGUES, Mariza; SILVA, Carmo Antonio da; COSTA, Luiz Augusto. Entre cultura e atos cívicos: política cultural em São José dos Campos (1966–1970 ). 2001. Relatório final de Trabalho de Graduação (História) – Faculdade de Educação, Universidade do Vale do Paraíba, São José dos Campos, 2001. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/06/00_tcc-entre-cultura-e-atos-civicos-politica-cultural-em-sao-jose-dos-campos-1.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/06/00_tcc-entre-cultura-e-atos-civicos-politica-cultural-em-sao-jose-dos-campos-1.pdf"
        },
        {
            "id": 37,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 1.097, de 21 de agosto de 1964. Legislação municipal, 1964. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1964/LE196400001097.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1964/LE196400001097.pdf"
        },
        {
            "id": 38,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 865, de 6 de julho de 1966. Legislação municipal, 1966. Disponível em: https://www.sjc.sp.gov.br/legislacao/Decretos/1966/865.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/1966/865.pdf"
        },
        {
            "id": 39,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 970, de 27 de março de 1967. Legislação municipal, 1967. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1967/DE196700000970.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1967/DE196700000970.pdf"
        },
        {
            "id": 40,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 1.153, de 24 de outubro de 1968 [cria o Museu da Imagem e do Som e dá outras providências]. Legislação municipal, 1968. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1968/DE196800001153.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1968/DE196800001153.pdf"
        },
        {
            "id": 41,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 1.276, de 6 de fevereiro de 1970. Legislação municipal, 1970. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1970/DE197000001276.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1970/DE197000001276.pdf"
        },
        {
            "id": 42,
            "fullText": "TRIBUNAL SUPERIOR ELEITORAL. Eleições anteriores: candidatos eleitos – período de 1945–1990. [s.d.]. Disponível em: https://www.tse.jus.br/eleicoes/eleicoes-anteriores. Acesso em: 5 out. 2026.",
            "url": "https://www.tse.jus.br/eleicoes/eleicoes-anteriores"
        },
        {
            "id": 43,
            "fullText": "SÃO PAULO (Estado ). Lei nº 1.402, de 5 de outubro de 1977. Exclui da condição de estância hidromineral o Município de São José dos Campos. Assembleia Legislativa do Estado de São Paulo. Disponível em: https://www.al.sp.gov.br/repositorio/legislacao/lei/1977/lei-1402-05.10.1977.html. Acesso em: 5 out. 2026.",
            "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1977/lei-1402-05.10.1977.html"
        },
        {
            "id": 44,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 1.682, de 10 de outubro de 1973. Autoriza a constituição de uma Sociedade de Urbanização e dá outras providências na forma que especifica. Legislação municipal. Disponível em: https://www.sjc.sp.gov.br/legislacao/leis/1973/1682.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/legislacao/leis/1973/1682.pdf"
        },
        {
            "id": 45,
            "fullText": "URBANIZADORA MUNICIPAL S/A (URBAM ). Sobre a Urbam. [s.d.]. Disponível em: https://urbam.com.br/pagina/urbam. Acesso em: 5 out. 2026.",
            "url": "https://urbam.com.br/pagina/urbam"
        },
        {
            "id": 46,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Ednardo recebe título de Cidadão Joseense nesta sexta. Notícias, 23 out. 2015. Disponível em: https://www.camarasjc.sp.gov.br/noticias/4732/ednardo-recebe-titulo-de-cidadao-joseense-nesta-sexta. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/noticias/4732/ednardo-recebe-titulo-de-cidadao-joseense-nesta-sexta"
        },
        {
            "id": 47,
            "fullText": "TRIBUNAL REGIONAL ELEITORAL DE SÃO PAULO. Eleições de 1975 a 1979. [s.d.]. Disponível em: https://www.tre-sp.jus.br/eleicoes/eleicoes-anteriores/eleicoes-1964-1992/eleicoes-de-1975-a-1979. Acesso em: 5 out. 2026.",
            "url": "https://www.tre-sp.jus.br/eleicoes/eleicoes-anteriores/eleicoes-1964-1992/eleicoes-de-1975-a-1979"
        },
        {
            "id": 48,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Ex-prefeito de São José é homenageado pela Câmara em sessão solene. Notícias, 24 abr. 2019. Disponível em: https://www.camarasjc.sp.gov.br/noticias/6581/ex-prefeito-de-sao-jose-e-homenageado-pela-camara-em-sessao-solene. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/noticias/6581/ex-prefeito-de-sao-jose-e-homenageado-pela-camara-em-sessao-solene"
        },
        {
            "id": 49,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 2.263, de 4 de janeiro de 1980. Dispõe sobre o parcelamento, uso e ocupação do solo do Município e dá outras providências. Legislação municipal. Disponível em: https://www.sjc.sp.gov.br/legislacao/Leis/1980/2263.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/legislacao/Leis/1980/2263.pdf"
        },
        {
            "id": 50,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Inauguração do Paço Municipal – fotógrafo: Miura (21-12-1979 ). Pró-Memória, 3 out. 2017. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/2017/10/03/inauguracao-do-paco-municipal-fotografo-miura-1979-12-21-lf359/. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/2017/10/03/inauguracao-do-paco-municipal-fotografo-miura-1979-12-21-lf359/"
        },
        {
            "id": 51,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Ex-vereador recebe título de Cidadão Joseense: José Luiz Carvalho de Almeida. Notícias, 30 ago. 2010. Disponível em: https://www.camarasjc.sp.gov.br/noticias/815/ex-vereador-recebe-titulo-de-cidadao-joseense. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/noticias/815/ex-vereador-recebe-titulo-de-cidadao-joseense"
        },
        {
            "id": 52,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 1.300, de 29 de novembro de 1966. Legislação municipal, 1966. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1966/LE196600001300.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1966/LE196600001300.pdf"
        },
        {
            "id": 53,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Atas da Câmara Municipal de São José dos Campos: fevereiro a maio de 1983. Pró-Memória, arquivo digital em PDF. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/02/atas-da-camara-municipal-de-sjc-fev-a-mai-1983_compressed.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/02/atas-da-camara-municipal-de-sjc-fev-a-mai-1983_compressed.pdf"
        },
        {
            "id": 54,
            "fullText": "TRIBUNAL DE CONTAS DO ESTADO DE SÃO PAULO. Currículo vitae: Robson Riedel Marinho. [s.d.]. Disponível em: https://www.tce.sp.gov.br/sites/default/files/portal/robson_marinho.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.tce.sp.gov.br/sites/default/files/portal/robson_marinho.pdf"
        },
        {
            "id": 55,
            "fullText": "ASSEMBLEIA LEGISLATIVA DO ESTADO DE SÃO PAULO. Robson Marinho: biografia. São Paulo, [s.d.]. Disponível em: https://www.al.sp.gov.br/deputado/?matricula=299522. Acesso em: 5 out. 2026.",
            "url": "https://www.al.sp.gov.br/deputado/?matricula=299522"
        },
        {
            "id": 56,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 3.050, de 14 de novembro de 1985. Autoriza o Poder Executivo a criar a Fundação Cultural de São José dos Campos e dá outras providências. São José dos Campos: Prefeitura Municipal, 1985. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1985/LE198500003050.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1985/LE198500003050.pdf"
        },
        {
            "id": 57,
            "fullText": "GALVÃO, Luiza Irene Gozzo. Da cultura rural à Fundação Cultural: um estudo sobre cultura e políticas culturais na vida urbana de São José dos Campos no século XX. 2004. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2004. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf. Acesso em: 5 out. 2026.",
            "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Da-Cultura-Rural-%C3%A0-Funda%C3%A7%C3%A3o-Cultural.-Um-Estudo-sobre-Cultura-e-Pol%C3%ADticas-Culturais-na-Vida-Urbana-de-S%C3%A3o-Jos%C3%A9-dos-Campos-no-S%C3%A9culo-XX.pdf"
        },
        {
            "id": 58,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 3.227, de 28 de abril de 1987. Autoriza o Poder Executivo a criar a Fundação de Atendimento à Criança e ao Adolescente Prof. Hélio Augusto de Souza – FUNDHAS. São José dos Campos: Prefeitura Municipal, 1987. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1987/LE198700003227.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1987/LE198700003227.pdf"
        },
        {
            "id": 59,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Rua Francisco Ricci (Vila Gaianazes ). São José dos Campos, [s.d.]. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/tag/projeto-ruas/page/3/. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/tag/projeto-ruas/page/3/"
        },
        {
            "id": 60,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 6.638, de 15 de março de 1989. Dispõe sobre abertura de crédito adicional no valor de NCz$ 20.500,00. São José dos Campos: Prefeitura Municipal, 1989. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1989/DE198900006638.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1989/DE198900006638.pdf"
        },
        {
            "id": 61,
            "fullText": "RAMOS, Ilka. Políticas públicas e a estruturação de um programa para o combate à violência doméstica: caminhos do Programa Aquarela, São José dos Campos. 2015. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2015. Disponível em: http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Pol%C3%ADticas-P%C3%BAblicas-e-a-Estrutura%C3%A7%C3%A3o-de-um-Programa-para-o-Combate-%C3%A0-Viol%C3%AAncia-Dom%C3%A9stica-Caminhos-do-Programa-Aquarela-S%C3%A3o-Jos%C3%A9-dos-Campos.pdf. Acesso em: 5 out. 2026.",
            "url": "http://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/03/Pol%C3%ADticas-P%C3%BAblicas-e-a-Estrutura%C3%A7%C3%A3o-de-um-Programa-para-o-Combate-%C3%A0-Viol%C3%AAncia-Dom%C3%A9stica-Caminhos-do-Programa-Aquarela-S%C3%A3o-Jos%C3%A9-dos-Campos.pdf"
        },
        {
            "id": 62,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 15.681, de 2013 [declara luto oficial pelo falecimento do ex-prefeito Pedro Yves Simão]. São José dos Campos: Prefeitura Municipal, 2013. Disponível em: https://www.sjc.sp.gov.br/legislacao/Decretos/2013/15681.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/2013/15681.pdf"
        },
        {
            "id": 63,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Decreto nº 7.379, de 2 de setembro de 1991 [dispõe sobre abertura de crédito especial para reforma do Mercado Municipal]. São José dos Campos: Prefeitura Municipal, 1991. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1991/DE199100007379.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1991/DE199100007379.pdf"
        },
        {
            "id": 64,
            "fullText": "G1 VALE DO PARAÍBA E REGIÃO. Morre Pedro Yves Simão, ex-prefeito de São José dos Campos. 29 nov. 2013. Disponível em: https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2013/11/morre-pedro-yves-simao-ex-prefeito-de-sao-jose-dos-campos.html. Acesso em: 5 out. 2026.",
            "url": "https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2013/11/morre-pedro-yves-simao-ex-prefeito-de-sao-jose-dos-campos.html"
        },
        {
            "id": 65,
            "fullText": "SILVA, Diva Dias da. Desigualdade social no Brasil: a questão habitacional em São José dos Campos – SP. 2008. Dissertação (Mestrado em Planejamento Urbano e Regional ) – Instituto de Pesquisa e Desenvolvimento, Universidade do Vale do Paraíba, São José dos Campos, 2008. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/0000024d.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/0000024d.pdf"
        },
        {
            "id": 66,
            "fullText": "ALVES, Vangivaldo da Silva. Cultura pela liberdade: páginas de uma ação cultural (São José dos Campos, 1993 a 1998 ). 2000. Relatório final de trabalho de graduação – Faculdade de Educação, Universidade do Vale do Paraíba, São José dos Campos, 2000. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2023/05/2000-cultura-pela-liberdade-paginas-de-uma-acao-cultura.pdf. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2023/05/2000-cultura-pela-liberdade-paginas-de-uma-acao-cultura.pdf"
        },
        {
            "id": 67,
            "fullText": "BRASIL. Constituição (1988 ). Constituição da República Federativa do Brasil. Brasília, DF: Presidência da República, 1988. Art. 29, II–III. Disponível em: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm. Acesso em: 5 out. 2026.",
            "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
        },
        {
            "id": 68,
            "fullText": "FOLHA DE S.PAULO. Emanuel recebe 46 mil votos. Folha de S.Paulo, São Paulo, 16 nov. 1996. Caderno Especial. Disponível em: https://www1.folha.uol.com.br/fsp/1996/11/16/caderno_especial/23.html. Acesso em: 5 out. 2026.",
            "url": "https://www1.folha.uol.com.br/fsp/1996/11/16/caderno_especial/23.html"
        },
        {
            "id": 69,
            "fullText": "MENDONÇA, Eliane. Nova Câmara garante maioria a Emanuel. Folha Vale, São Paulo, 3 out. 2000. Eleições 2000. Disponível em: https://www1.folha.uol.com.br/fsp/vale/vl0310200001.htm. Acesso em: 5 out. 2026.",
            "url": "https://www1.folha.uol.com.br/fsp/vale/vl0310200001.htm"
        },
        {
            "id": 70,
            "fullText": "SÃO JOSÉ DOS CAMPOS elege tucano Eduardo Cury no 1º turno. Folha Online, 4 out. 2004. Disponível em: https://www1.folha.uol.com.br/folha/brasil/ult96u64697.shtml. Acesso em: 5 out. 2026.",
            "url": "https://www1.folha.uol.com.br/folha/brasil/ult96u64697.shtml"
        },
        {
            "id": 71,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 5.126, de 10 de novembro de 1997 [dispõe sobre abertura de crédito especial no valor de R$ 80.000,00]. São José dos Campos: Prefeitura Municipal, 1997. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1997/LE199700005126.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1997/LE199700005126.pdf"
        },
        {
            "id": 72,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei Complementar nº 272/03, de 18 de dezembro de 2003 [dispõe sobre o Imposto Sobre Serviços de Qualquer Natureza – ISSQN]. São José dos Campos: Prefeitura Municipal, 2003. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2003/LC200300000272.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2003/LC200300000272.pdf"
        },
        {
            "id": 73,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei Complementar nº 306, de 17 de novembro de 2006 [institui o Plano Diretor de Desenvolvimento Integrado]. São José dos Campos: Prefeitura Municipal, 2006. Disponível em: https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2006/LC200600000306.pdf. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/2006/LC200600000306.pdf"
        },
        {
            "id": 74,
            "fullText": "ALMEIDA SILVA, Douglas; VIANNA, Paula Vilhena Carnevale; ZANETTI, Valéria Regina. Urban planning, agents and representations: creation of the Banhado, São José dos Campos landmark. Ambiente & Sociedade, São Paulo, v. 20, n. 2, 2017. Disponível em: https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?lang=pt. Acesso em: 5 out. 2026.",
            "url": "https://www.scielo.br/j/asoc/a/Sq4KTyG5M936VRnbr3cdG3b/?lang=pt"
        },
        {
            "id": 75,
            "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2008, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2008&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
            "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2008&cargo=11&mun=354990"
        },
        {
            "id": 76,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Prefeito. São José dos Campos, [s.d.]. Disponível em: https://www.sjc.sp.gov.br/servicos/gabinete/prefeito/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/servicos/gabinete/prefeito/"
        },
        {
            "id": 77,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Lei nº 8.195, de 17 de setembro de 2010 [cria o Parque Natural Municipal Augusto Ruschi – PNMAR]. São José dos Campos, 2010. Disponível em: https://siteprefeitura.sjc.sp.gov.br/media/166098/lei-8195-2010-cria-o-pnmar-27-9-21.pdf. Acesso em: 5 out. 2026.",
            "url": "https://siteprefeitura.sjc.sp.gov.br/media/166098/lei-8195-2010-cria-o-pnmar-27-9-21.pdf"
        },
        {
            "id": 78,
            "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2012, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2012&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
            "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2012&cargo=11&mun=354990"
        },
        {
            "id": 79,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cerimônia de posse no dia 1º de janeiro. São José dos Campos, 27 dez. 2012. Disponível em: https://www.camarasjc.sp.gov.br/noticias/934/cerimonia-de-posse-no-dia-1-de-janeiro. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/noticias/934/cerimonia-de-posse-no-dia-1-de-janeiro"
        },
        {
            "id": 80,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Comunidade do Jardim Jussara comemora nova escola infantil. São José dos Campos, 23 maio 2015. Disponível em: https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=20585. Acesso em: 5 out. 2026.",
            "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=20585"
        },
        {
            "id": 81,
            "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2016, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2016&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
            "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2016&cargo=11&mun=354990"
        },
        {
            "id": 82,
            "fullText": "PORTAL R3. Felício Ramuth toma posse como prefeito de São José dos Campos. São José dos Campos, 1 jan. 2017. Disponível em: https://www.portalr3.com.br/2017/01/01/felicio-ramuth-toma-posse-como-prefeito-de-sao-jose-dos-campos. Acesso em: 5 out. 2026.",
            "url": "https://www.portalr3.com.br/2017/01/01/felicio-ramuth-toma-posse-como-prefeito-de-sao-jose-dos-campos"
        },
        {
            "id": 83,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Prefeitura de São José libera o tráfego no Arco da Inovação. São José dos Campos, 24 abr. 2020. Disponível em: https://www.sjc.sp.gov.br/noticias/2020/abril/24/prefeitura-de-sao-jose-libera-o-trafego-no-arco-da-inovacao/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/noticias/2020/abril/24/prefeitura-de-sao-jose-libera-o-trafego-no-arco-da-inovacao/"
        },
        {
            "id": 84,
            "fullText": "G1 VALE DO PARAÍBA E REGIÃO. São José inaugura hospital de retaguarda para atender pacientes com Covid-19. G1, 8 jul. 2020. Disponível em: https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2020/07/08/hospital-de-retaguarda-comeca-a-funcionar-em-sao-jose-dos-campos.ghtml. Acesso em: 5 out. 2026.",
            "url": "https://g1.globo.com/sp/vale-do-paraiba-regiao/noticia/2020/07/08/hospital-de-retaguarda-comeca-a-funcionar-em-sao-jose-dos-campos.ghtml"
        },
        {
            "id": 85,
            "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2020, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2020&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
            "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2020&cargo=11&mun=354990"
        },
        {
            "id": 86,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Felicio Ramuth é empossado prefeito para o segundo mandato. São José dos Campos, 1 jan. 2021. Disponível em: https://www.sjc.sp.gov.br/noticias/2021/janeiro/01/felicio-ramuth-e-empossado-prefeito-para-o-segundo-mandato/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/noticias/2021/janeiro/01/felicio-ramuth-e-empossado-prefeito-para-o-segundo-mandato/"
        },
        {
            "id": 87,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Profissionais de saúde recebem primeiras doses da vacina. São José dos Campos, 20 jan. 2021. Disponível em: https://www.sjc.sp.gov.br/noticias/2021/janeiro/20/profissionais-de-saude-recebem-primeiras-doses-da-vacina/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/noticias/2021/janeiro/20/profissionais-de-saude-recebem-primeiras-doses-da-vacina/"
        },
        {
            "id": 88,
            "fullText": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Anderson Farias assume cargo de prefeito em cerimônia na Câmara. São José dos Campos, 1 abr. 2022. Disponível em: https://www.camarasjc.sp.gov.br/noticias/7773/anderson-farias-assume-cargo-de-prefeito-em-cerimonia-na-camara. Acesso em: 5 out. 2026.",
            "url": "https://www.camarasjc.sp.gov.br/noticias/7773/anderson-farias-assume-cargo-de-prefeito-em-cerimonia-na-camara"
        },
        {
            "id": 89,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Linha Verde e frota elétrica inovam transporte coletivo em São José. São José dos Campos, 28 dez. 2022. Disponível em: https://www.sjc.sp.gov.br/noticias/2022/dezembro/28/linha-verde-e-frota-eletrica-inovam-transporte-coletivo-em-sao-jose/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/noticias/2022/dezembro/28/linha-verde-e-frota-eletrica-inovam-transporte-coletivo-em-sao-jose/"
        },
        {
            "id": 90,
            "fullText": "FUNDAÇÃO SISTEMA ESTADUAL DE ANÁLISE DE DADOS (SEADE ). Resultados de eleições: Eleição 2024, Prefeito(a), São José dos Campos. São Paulo: Seade, [s.d.]. Disponível em: https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2024&cargo=11&mun=354990. Acesso em: 5 out. 2026.",
            "url": "https://produtos.seade.gov.br/produtos/eleicoes/candidatos/index.php?page=ele_det&bjs=1&ano=2024&cargo=11&mun=354990"
        },
        {
            "id": 91,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Anderson Farias é empossado prefeito para o segundo mandato. São José dos Campos, 2 jan. 2025. Disponível em: https://www.sjc.sp.gov.br/noticias/2025/janeiro/02/anderson-farias-e-empossado-prefeito-para-o-segundo-mandato/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/noticias/2025/janeiro/02/anderson-farias-e-empossado-prefeito-para-o-segundo-mandato/"
        },
        {
            "id": 92,
            "fullText": "SÃO JOSÉ DOS CAMPOS (Município ). Linha Verde passa de 5,7 milhões de embarques em São José. São José dos Campos, 24 jul. 2026. Disponível em: https://www.sjc.sp.gov.br/noticias/2026/julho/24/linha-verde-passa-de-5-7-milhoes-de-embarques-em-sao-jose/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjc.sp.gov.br/noticias/2026/julho/24/linha-verde-passa-de-5-7-milhoes-de-embarques-em-sao-jose/"
        },
        {
            "id": 93,
            "fullText": "COSTA, Luiz Paulo. Tau, o vereador emérito. São José dos Campos Antigamente, [s.d.]. Disponível em: https://www.sjcantigamente.com.br/tau-o-vereador-emerito/. Acesso em: 5 out. 2026.",
            "url": "https://www.sjcantigamente.com.br/tau-o-vereador-emerito/"
        }
    ]
},

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
      "periodo": "Povoado anterior a 1892; distrito criado em 16 de agosto de 1892",
      "origemNome": "O nome é uma referência ao santo São Francisco Xavier. O histórico reunido pelo São José dos Campos Antigamente atribui a primeira capela à devoção de Luciano José das Neves, da Fazenda Rio do Peixe. A lei de 1892 confirma que o povoado já usava essa denominação; a versão sobre a capela é apresentada como memória histórica do acervo.",
      "historia": "São Francisco Xavier se formou numa passagem de tropeiros entre o sul de Minas e São José dos Campos. A leitura técnica do Plano de Gestão Distrital descreve essa ligação comercial, que ajudou a reunir casas e serviços na serra. Em 16 de agosto de 1892, a Lei Estadual nº 59 criou o distrito de paz. A lei já chama o lugar de bairro de São Francisco Xavier: o povoado existia antes da criação administrativa.\n\nO acervo São José dos Campos Antigamente guarda fotografias da praça, da escola e da farmácia, com imagens de Nelson Oliveira e de famílias do distrito. Seu histórico relaciona a primeira capela à devoção de Luciano José das Neves. A vila também aparece na pesquisa de Zilda Regina de Souza, da Unitau: o grupo de mulheres do centro produzia livros bordados e organizava encontros e atividades culturais.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O pouso dos tropeiros que virou distrito",
      "fontesRevisadas": [
        {
          "referencia": "SÃO PAULO (Estado). Lei nº 59, de 16 de agosto de 1892. Cria um distrito de paz no bairro de São Francisco Xavier, marcando-lhe as divisas. São Paulo, 1892.",
          "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1892/lei-59-16.08.1892.html",
          "nota": "Artigo 1º: criação do distrito de paz em 16 de agosto de 1892, no bairro já chamado São Francisco Xavier.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Secretaria de Urbanismo e Sustentabilidade. Plano de Gestão Distrital de São Francisco Xavier: leitura técnica. São José dos Campos, 2025.",
          "url": "https://www.sjc.sp.gov.br/media/xzjmjb4r/pgd-sfx_leitura-t%C3%A9cnica_2025.pdf",
          "nota": "Origem ligada à passagem e ao pouso dos tropeiros e criação do distrito.",
          "acesso": "4 out. 2026.",
          "pagina": "15 do PDF",
          "paginaPdf": 15
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. A história de São Francisco Xavier. São José dos Campos, [s. d.].",
          "url": "https://www.sjcantigamente.com.br/a-historia-de-sao-francisco-xavier/",
          "nota": "Memória sobre Luciano José das Neves e a capela; fotografias da praça, escola, farmácia e famílias, incluindo o acervo de Nelson Oliveira.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SOUZA, Zilda Regina de. Desenvolvimento humano: café e afeto nas construções identitárias dos “Grupos de Mulheres” de São Francisco Xavier. 2012. Dissertação (Mestrado em Desenvolvimento Humano) — Universidade de Taubaté, Taubaté, 2012.",
          "url": "https://mpemdh.unitau.br/wp-content/uploads/2010/dissertacoes/zilda_regina_souza2.pdf",
          "nota": "Grupo do centro: encontros, atividades culturais e lançamento do segundo livro bordado. Fotos e observações da pesquisa de 2011–2012.",
          "acesso": "4 out. 2026.",
          "pagina": "89 do PDF (p. 88 da obra)",
          "paginaPdf": 89
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-sfx-santa-barbara",
      "nome": "Santa Bárbara (SFX)",
      "regiaoId": "sfx",
      "regiaoNome": "São Francisco Xavier",
      "periodo": "Comunidade rural; organização de mulheres documentada em 2012",
      "origemNome": "Santa Bárbara é um nome de devoção católica. A pesquisa da Unitau documenta uma igreja com essa invocação na comunidade. Essa presença dá contexto à denominação do bairro, mas não permite datar sua escolha nem atribuí-la especificamente à proteção contra tempestades.",
      "historia": "Uma antiga escola rural de Santa Bárbara ganhou outro uso depois do encerramento das aulas. Na pesquisa de 2012, Zilda Regina de Souza, da Unitau, encontrou ali um grupo de mulheres que se reunia para fazer artesanato. As participantes contaram que os encontros haviam começado numa instalação da igreja católica de Santa Bárbara, por iniciativa da Secretaria de Saúde, e depois passaram para a escola. Algumas tinham estudado naquele mesmo prédio.\n\nChegar aos encontros nem sempre era simples: as casas ficavam espalhadas e algumas mulheres caminhavam quilômetros. Durante a pesquisa, o local estava sem energia, e elas trabalhavam perto da janela para aproveitar a luz. As estradas e pontes seguem importantes para essa região rural. Uma notícia municipal de 2019 registra a reforma de uma ponte na primeira travessa da Estrada do Bugre, no bairro Santa Bárbara.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "A escola que continuou reunindo a comunidade",
      "fontesRevisadas": [
        {
          "referencia": "SOUZA, Zilda Regina de. Desenvolvimento humano: café e afeto nas construções identitárias dos “Grupos de Mulheres” de São Francisco Xavier. 2012. Dissertação (Mestrado em Desenvolvimento Humano) — Universidade de Taubaté, Taubaté, 2012.",
          "url": "https://mpemdh.unitau.br/wp-content/uploads/2010/dissertacoes/zilda_regina_souza2.pdf",
          "nota": "Grupo iniciado na igreja católica Santa Bárbara e transferido para antiga escola rural; relatos sobre deslocamento e trabalho perto da janela por falta de energia.",
          "acesso": "4 out. 2026.",
          "pagina": "99–100 do PDF (p. 98–99 da obra)",
          "paginaPdf": 99
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Prefeitura reforma pontes do distrito de São Francisco Xavier. São José dos Campos, 19 set. 2019.",
          "url": "https://www.sjc.sp.gov.br/noticias/2019/setembro/19/prefeitura-reforma-pontes-do-distrito-de-sao-francisco-xavier/",
          "nota": "Ponte na primeira travessa da Estrada do Bugre, no bairro Santa Bárbara. Não utilizada como prova de fundação.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-sfx-lavras",
      "nome": "Lavras (SFX)",
      "regiaoId": "sfx",
      "regiaoNome": "São Francisco Xavier",
      "periodo": "Nome presente nas divisas do distrito em 1892",
      "origemNome": "A dissertação registra uma explicação dos próprios moradores: Lavras teria esse nome porque se dizia que havia ouro na região. Essa é uma memória oral publicada na pesquisa, não uma comprovação de minas ou de um ciclo de exploração mineral. A palavra “lavras” combina com essa versão, e seu uso local já está documentado em 1892.",
      "historia": "Lavras já aparece na Lei Estadual nº 59, de 1892, que descreve as divisas de São Francisco Xavier pelas águas do Rio do Peixe, da Fartura e de Lavras. O registro mostra que o nome é antigo, mas não estabelece uma data de fundação da comunidade.\n\nMais de um século depois, a dissertação de Zilda Regina de Souza, da Unitau, acompanha a atuação dos moradores. A antiga escola rural foi revitalizada e passou a abrigar atividades da Associação de Moradores de Lavras, a ALavras. A pesquisa registra iniciativas de alfabetização de adultos, biblioteca e participação no conselho gestor da área de proteção ambiental. As mulheres também produziam artesanato em casa: jogos da velha e cinco-marias eram vendidos no comércio do distrito para complementar a renda.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um nome antigo e a escola transformada em associação",
      "fontesRevisadas": [
        {
          "referencia": "SÃO PAULO (Estado). Lei nº 59, de 16 de agosto de 1892. Cria um distrito de paz no bairro de São Francisco Xavier, marcando-lhe as divisas. São Paulo, 1892.",
          "url": "https://www.al.sp.gov.br/repositorio/legislacao/lei/1892/lei-59-16.08.1892.html",
          "nota": "Artigo 2º: Lavras aparece na descrição das águas e divisas do distrito em 1892.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SOUZA, Zilda Regina de. Desenvolvimento humano: café e afeto nas construções identitárias dos “Grupos de Mulheres” de São Francisco Xavier. 2012. Dissertação (Mestrado em Desenvolvimento Humano) — Universidade de Taubaté, Taubaté, 2012.",
          "url": "https://mpemdh.unitau.br/wp-content/uploads/2010/dissertacoes/zilda_regina_souza2.pdf",
          "nota": "Revitalização da antiga escola, biblioteca, alfabetização e conselho gestor; explicação do nome atribuída aos moradores. Página seguinte: artesanato e jogos produzidos nas casas.",
          "acesso": "4 out. 2026.",
          "pagina": "97–98 do PDF (p. 96–97 da obra)",
          "paginaPdf": 97
        },
        {
          "referencia": "SOUZA, Zilda Regina de. Desenvolvimento humano: café e afeto nas construções identitárias dos “Grupos de Mulheres” de São Francisco Xavier. 2012. Dissertação (Mestrado em Desenvolvimento Humano) — Universidade de Taubaté, Taubaté, 2012.",
          "url": "https://mpemdh.unitau.br/wp-content/uploads/2010/dissertacoes/zilda_regina_souza2.pdf",
          "nota": "Participação da associação no conselho gestor da APA, segundo as pessoas ouvidas pela pesquisadora.",
          "acesso": "4 out. 2026.",
          "pagina": "117 do PDF (p. 116 da obra)",
          "paginaPdf": 117
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-sfx-remedios",
      "nome": "Remédios (SFX)",
      "regiaoId": "sfx",
      "regiaoNome": "São Francisco Xavier",
      "periodo": "Comunidade rural; tradições e associação documentadas nos anos 2000",
      "origemNome": "O nome encontra uma referência local na capela de Nossa Senhora dos Remédios, onde acontece a Carpição. A associação com essa devoção é sustentada pela presença da igreja e pela tradição registrada. As fontes reunidas não fixam a data em que o bairro passou a se chamar Remédios.",
      "historia": "No bairro dos Remédios, a capela de Nossa Senhora dos Remédios reúne uma tradição conhecida como Carpição. Em agosto de 2012, Chico Abelha registrou os devotos levando terra até o pé da cruz, perto da entrada da capela, para cumprir promessas. Entre as pessoas que ouviu estava dona Virgínia, que contou ter se mudado para perto da igreja para acompanhar as celebrações. Seu relato faz parte da memória publicada pelo pesquisador.\n\nO bairro também organizou um grupo de artesãs. A dissertação de Zilda Regina de Souza, da Unitau, registra sua transformação em associação em junho de 2008. Durante a pesquisa, as mulheres se reuniam numa antiga escola rural, ao redor de uma mesa, com máquina de costura e teares. Produziam colchas de fuxico, tapetes e outras peças, buscando renda e apoio para o trabalho coletivo.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "A capela, a carpição e as mulheres do artesanato",
      "fontesRevisadas": [
        {
          "referencia": "ABELHA, Chico. Carpição. Chicoabelha’s Blog, 19 ago. 2012.",
          "url": "https://chicoabelha.wordpress.com/2012/08/19/carpicao/",
          "nota": "Registro presencial na capela de Nossa Senhora dos Remédios e depoimento de dona Virgínia. As promessas são descritas como crença dos participantes, sem afirmar efeitos de cura.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SOUZA, Zilda Regina de. Desenvolvimento humano: café e afeto nas construções identitárias dos “Grupos de Mulheres” de São Francisco Xavier. 2012. Dissertação (Mestrado em Desenvolvimento Humano) — Universidade de Taubaté, Taubaté, 2012.",
          "url": "https://mpemdh.unitau.br/wp-content/uploads/2010/dissertacoes/zilda_regina_souza2.pdf",
          "nota": "Associação de artesãos em 23 de junho de 2008; produção de artesanato e uso da escola rural desativada.",
          "acesso": "4 out. 2026.",
          "pagina": "92–93 do PDF (p. 91–92 da obra)",
          "paginaPdf": 92
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
{
      "id": "bairro-santana",
      "nome": "Santana",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Igreja de Sant’Ana desde 1869; expansão industrial nos anos 1920",
      "origemNome": "Santana vem de Sant’Ana, a santa à qual os moradores dedicaram a igreja iniciada em 1869. Essa relação entre a igreja e o nome do bairro está registrada na cronologia do Pró-Memória da Câmara Municipal.",
      "historia": "Em 1869, moradores das margens do Paraíba começaram a construir uma igreja dedicada a Sant’Ana. A cronologia do Pró-Memória, projeto da Câmara Municipal de São José dos Campos, relaciona esse momento à adoção do nome Santana pelo bairro. A igreja ajuda a entender como aquela comunidade se organizava, antes da chegada das grandes fábricas.\n\nNos anos 1920, cerâmicas e tecelagens mudaram a vida local. A pesquisa das historiadoras Maria Aparecida Papali, Valéria Zanetti e Maria José Acedo del Olmo descreve a presença de mulheres e crianças no trabalho industrial e a criação de vila operária, escola e cooperativa pela tecelagem. Moradia e trabalho passaram a ficar próximos, e a influência da fábrica se estendia à vida fora do expediente.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fontePagina": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Câmara Municipal. Pró-Memória: cronologia de São José dos Campos. São José dos Campos, [s. d.].",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/",
          "nota": "Verbete de 1869: construção da igreja de Sant’Ana e adoção do nome pelo bairro.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "PAPALI, Maria Aparecida; ZANETTI, Valéria; OLMO, Maria José Acedo del. São José dos Campos e sua história. São José dos Campos: Câmara Municipal, Pró-Memória, [s. d.].",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/",
          "nota": "Passagens sobre a industrialização dos anos 1920, a tecelagem e a organização da vida operária.",
          "acesso": "4 out. 2026."
        }
      ],
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Um bairro à beira do Paraíba",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2"
    },
  {
      "id": "bairro-altos-santana",
      "nome": "Altos de Santana",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Formação do loteamento na década de 1980",
      "origemNome": "O nome aproxima o loteamento de Santana. A palavra “Altos” sugere uma referência ao relevo, mas o estudo consultado não informa quem escolheu a denominação nem apresenta seu ato de criação.",
      "historia": "Altos de Santana começou a tomar forma nos anos 1980, em terras que haviam pertencido à Fazenda Boa Vista, perto do Telespark. O estudo de Gabriel Henrique dos Santos Ferreira, da Universidade do Vale do Paraíba, acompanha essa transformação e traz uma fotografia aérea do bairro em 1985. A abertura do loteamento fazia parte da expansão das moradias ao norte do Paraíba.\n\nA história da comunidade também aparece nos registros da Paróquia Nossa Senhora de Fátima: uma fotografia mostra sua primeira festa em 1989, e outra registra a igreja matriz em construção em 1996. A instalação da paróquia ocorreu em 30 de julho de 2006. Esses registros ajudam a acompanhar a formação de um lugar de encontro entre os moradores, depois da abertura das ruas.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Texto sobre a antiga Fazenda Boa Vista e figura 56, fotografia aérea de Altos de Santana em 1985.",
          "acesso": "4 out. 2026.",
          "pagina": "95 do PDF",
          "paginaPdf": 95
        },
        {
          "referencia": "PARÓQUIA NOSSA SENHORA DE FÁTIMA. Nossa história. São José dos Campos, [s. d.].",
          "url": "https://pnsenhoradefatima.org.br/historia/",
          "nota": "Legendas das fotografias de 1989 e 1996; registro da instalação da paróquia em 30 de julho de 2006.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Da Fazenda Boa Vista às novas ruas",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2"
    },
  {
      "id": "bairro-alto-da-ponte",
      "nome": "Alto da Ponte",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Bairro registrado na década de 1920; paróquia criada em 1964",
      "origemNome": "“Alto da Ponte” sugere uma referência à posição do bairro em relação a uma ponte. O relato de 1964 menciona a ponte velha, mas não identifica quando o nome surgiu nem comprova qual ponte lhe deu origem.",
      "historia": "Alto da Ponte aparece entre os bairros da década de 1920 no levantamento de Gabriel Henrique dos Santos Ferreira, da Universidade do Vale do Paraíba. A tabela mostra que o nome já fazia parte da cidade naquele período; ela não informa uma data exata de fundação.\n\nUm episódio de 1964 dá uma imagem da vida comunitária. Em 23 de fevereiro, a comunidade de São Benedito tornou-se paróquia, separada de Santana. Segundo a revista histórica da Diocese de São José dos Campos, os moradores aguardaram o primeiro pároco junto à ponte velha e seguiram em cortejo até a capela. A ponte era um ponto de encontro naquele dia, e a igreja reunia a comunidade do bairro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Tabela 3: bairros de São José dos Campos na década de 1920. A inclusão na tabela não equivale a uma data de fundação.",
          "acesso": "4 out. 2026.",
          "pagina": "39 do PDF",
          "paginaPdf": 39
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia São Benedito — Alto da Ponte. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 52.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "Criação da paróquia em 23 de fevereiro de 1964 e cortejo entre a ponte velha e a capela.",
          "acesso": "4 out. 2026.",
          "pagina": "52 do PDF",
          "paginaPdf": 52
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Entre a ponte e a capela",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2"
    },
  {
      "id": "bairro-vila-paiva",
      "nome": "Vila Paiva",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Comunidade registrada em 1977; documentação do loteamento em 1981",
      "origemNome": "Paiva é um sobrenome, mas as fontes consultadas não identificam a pessoa ou a família que teria dado nome à vila. A planta registra Adelina Delgado Motta como proprietária; isso, por si só, não explica a escolha de “Paiva”.",
      "historia": "A história da Vila Paiva já aparece em 1977, quando os moradores construíram um barracão de madeira, coberto com telhas de amianto, para reuniões e missas. A revista da Diocese de São José dos Campos registra o apoio do padre Antônio Aparecido Alves e a participação do grupo de jovens JUVIPA.\n\nEm 1990, Maria Delgado doou um terreno para a igreja, com a condição de que o padroeiro fosse São José Operário. A paróquia foi instalada em 4 de outubro de 1998. Já a planta do loteamento cita o processo 40634/81 e identifica Adelina Delgado Motta como proprietária. Os registros mostram etapas diferentes da história: a organização dos moradores, a documentação das ruas e a construção de um espaço religioso.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia São José Operário — Vila Paiva. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 57.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "Barracão de 1977, doação de Maria Delgado em 1990 e instalação da paróquia em 1998.",
          "acesso": "4 out. 2026.",
          "pagina": "57 do PDF",
          "paginaPdf": 57
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Loteamento Vila Paiva: planta. São José dos Campos, [s. d.]. 1 planta. Processo 40634/81.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/paiva_vila_loteamento.pdf",
          "nota": "Quadro de identificação: proprietária Adelina Delgado Motta e número do processo. O número do processo não informa, sozinho, o dia de aprovação.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Uma comunidade antes da planta do loteamento",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2"
    },
  {
      "id": "bairro-telespark",
      "nome": "Telespark",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Loteamento registrado em 1959",
      "origemNome": "Telespark também era o nome da fábrica de rádios do pai de Fanny Feigenson, lembrada por ela em entrevista ao Museu da Pessoa. O nome da fábrica e a presença da empresa Feigenson na planta sugerem uma ligação com a denominação do bairro. As fontes não apresentam o ato que confirmou essa escolha.",
      "historia": "O Jardim Telespark é registrado em 1959 no estudo de Gabriel Henrique dos Santos Ferreira, da Universidade do Vale do Paraíba. Surgiu na expansão dos loteamentos da região do Alto da Ponte, depois da Vila Veneziani e da Vila Cândida. A planta de regularização identifica a empresa Feigenson S.A. Indústria e Comércio como proprietária do empreendimento.\n\nA formação da comunidade aparece também na história da igreja Nossa Senhora Auxiliadora, construída no Telespark na década de 1980. Fotografias e relatos preservados pela Paróquia Nossa Senhora de Fátima acompanham essa construção e as celebrações dos moradores.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Passagem sobre a expansão urbana do Alto da Ponte: Jardim Telespark em 1959.",
          "acesso": "4 out. 2026.",
          "pagina": "68 do PDF",
          "paginaPdf": 68
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Telespark: planta de regularização do loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/jardim-telespark.pdf",
          "nota": "Quadro de identificação: bairro Alto da Ponte e proprietária Feigenson S.A. Indústria e Comércio.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "FEIGENSON, Fanny. “Eu tenho a tragédia dentro de mim”. Entrevista a Rosana Miziara e Sofia Tapajós. São Paulo: Museu da Pessoa, 12 nov. 2022.",
          "url": "https://museudapessoa.org/historia-de-vida/-eu-tenho-a-trag-dia-dentro-de-mim-/",
          "nota": "Transcrição, a partir de 51min54s: lembranças sobre a fábrica Telespark. A página reúne texto e vídeo; não afirma que a fábrica funcionava neste bairro.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "PARÓQUIA NOSSA SENHORA DE FÁTIMA. Nossa história. São José dos Campos, [s. d.].",
          "url": "https://pnsenhoradefatima.org.br/historia/",
          "nota": "Histórico e fotografias da igreja Nossa Senhora Auxiliadora, no Telespark, construída nos anos 1980.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Novas moradias ao norte do Paraíba",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2"
    },
  {
      "id": "bairro-vila-nova-sao-jose",
      "nome": "Vila Nova São José",
      "regiaoId": "centro",
      "regiaoNome": "Região Central",
      "periodo": "Loteamento registrado em planta municipal",
      "origemNome": "“Vila Nova São José” reúne a ideia de uma nova vila e o nome da cidade. Essa é uma leitura da denominação registrada na planta; o documento não conta quem a escolheu nem em que circunstância.",
      "historia": "A Vila Nova São José fica na região central da cidade, como a Prefeitura a identifica em suas notícias. Na planta municipal, o ribeirão Lavapés acompanha um dos limites do loteamento. As quadras aparecem entre a Avenida Sebastião Gualberto e a Avenida 23 de Maio, com ruas chamadas Minas Gerais, São Paulo, Paraná e Santa Catarina. O desenho mostra como os terrenos foram divididos para formar a vila.\n\nEsse traçado voltou a aparecer em uma decisão municipal de 2024. O Decreto nº 19.623 declarou de utilidade pública uma área na Rua São Pedro para o projeto de alargamento e requalificação da Avenida Engenheiro Sebastião Gualberto. O documento registra a intenção de melhorar a via, sem comprovar, por si só, que a obra foi executada.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Vila Nova São José: planta de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/nova_sao_jose_vl.pdf",
          "nota": "Traçado das quadras, nomes das ruas e limite junto ao ribeirão Lavapés.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Decreto nº 19.623, de 15 de maio de 2024. Declara de utilidade pública para fins de desapropriação área de terreno constituída de benfeitorias e dá outras providências. São José dos Campos, 2024.",
          "url": "https://servicos.sjc.sp.gov.br/Legislacao/compilada/31188",
          "nota": "Artigo 1º: imóvel na Rua São Pedro e finalidade de alargamento e requalificação da Avenida Engenheiro Sebastião Gualberto. Versão em texto do decreto.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Operação Casa Limpa desta semana será na sexta-feira. São José dos Campos, 18 jun. 2025.",
          "url": "https://www.sjc.sp.gov.br/noticias/2025/junho/18/operacao-casa-limpa-desta-semana-sera-na-sexta-feira/",
          "nota": "Seção “Bairros”: Vila Nova São José na lista da região central. Esta referência fundamenta a correção do filtro regional.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "As ruas da Vila Nova São José",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3",
      "contextoFonte": ""
    },
  {
      "id": "bairro-vila-cristina",
      "nome": "Vila Cristina",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Bairro existente nos anos 1960; regularização registrada em 1986",
      "origemNome": "Cristina é um nome próprio, mas nem o artigo nem a planta identificam uma homenageada. A planta confirma a denominação Vila Cristina; atribuí-la a uma pessoa específica exigiria outro registro.",
      "historia": "Vila Cristina já existia nos anos 1960. Um artigo de Alberto da Silva Ramos, José de Toledo Piza e Euclides Fróes, publicado na Revista de Saúde Pública em 1970, descreve o bairro durante as cheias de 1967. A vila ficava em terreno elevado, mas a água cobria seu acesso. Sem rede de água e esgoto naquele período, os moradores enfrentavam dificuldades que motivaram a pesquisa.\n\nA planta municipal traz uma etapa posterior: foi desenhada em 2 de dezembro de 1983 e registra o deferimento da regularização em 3 de setembro de 1986. Por isso, a data da regularização não deve ser confundida com o começo do bairro. A pesquisa dos anos 1960 já documentava a presença de seus moradores.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "RAMOS, Alberto da Silva; PIZA, José de Toledo; FRÓES, Euclides. A importância das inundações na expansão da esquistossomose mansoni. Revista de Saúde Pública, São Paulo, v. 4, n. 1, p. 1–5, jun. 1970. DOI: 10.1590/S0034-89101970000100001.",
          "url": "https://www.scielo.br/j/rsp/a/xXjpCH6ZhrvTMNyFnwB3rXk/?lang=pt",
          "nota": "Seções Introdução e Discussão: condições de Vila Cristina e cheia do Paraíba em fevereiro de 1967. A descrição se refere àquela época.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Vila Cristina: planta. São José dos Campos, 2 dez. 1983. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/cristina_vl.pdf",
          "nota": "Quadro inferior: data da planta; anotação de regularização pelo processo 84/86, deferido em 3 de setembro de 1986.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Uma vila junto ao Paraíba",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2"
    },
  {
      "id": "bairro-vila-dirce",
      "nome": "Vila Dirce",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Capela construída em 1966; planta de regularização de 1978",
      "origemNome": "Dirce é um nome próprio, mas a planta e o histórico da comunidade não explicam sua escolha. Eles documentam o nome do bairro, sem identificar uma possível homenageada.",
      "historia": "A comunidade da Vila Dirce começou a construir sua capela de São Sebastião em 1966, segundo o histórico da Paróquia Nossa Senhora de Fátima. Em 1987, teve início uma nova construção para ampliar o espaço. Entre essas duas datas, uma planta de regularização, desenhada em 12 de abril de 1978, registrou o traçado do loteamento e suas ruas.\n\nO bairro também abriga o Mirante José Rosa de Morais. Em notícia de 2023, a Prefeitura descreveu sua reforma e a vista panorâmica para a cidade, perto do Parque Alberto Simões. A capela e o mirante são referências de épocas diferentes da Vila Dirce: um lugar de convivência religiosa e um ponto de onde se observa a paisagem da cidade.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "PARÓQUIA NOSSA SENHORA DE FÁTIMA. Nossa história. São José dos Campos, [s. d.].",
          "url": "https://pnsenhoradefatima.org.br/historia/",
          "nota": "Histórico da capela de São Sebastião, na Vila Dirce: construção em 1966 e ampliação em 1987.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Vila Dirce: planta de regularização. São José dos Campos, 12 abr. 1978. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/dirce_vl.pdf",
          "nota": "Quadro inferior: título do projeto e data de elaboração. A data da planta não equivale à fundação do bairro.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Mirante da Vila Dirce é opção turística neste feriado em São José. São José dos Campos, 7 jun. 2023. Atualizado em 20 ago. 2024.",
          "url": "https://www.sjc.sp.gov.br/noticias/2023/junho/07/mirante-da-vila-dirce-e-opcao-turistica-neste-feriado-em-sao-jose/",
          "nota": "Descrição do Mirante José Rosa de Morais, da reforma e da paisagem visível do local.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Da capela ao mirante",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2"
    },
  {
      "id": "bairro-jardim-guimaraes",
      "nome": "Jardim Guimarães",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Loteamento registrado em 1981",
      "origemNome": "A planta lista José Guimarães Claro e Lydia Guimarães Prianti entre os proprietários. A presença do sobrenome dá uma base para relacionar o nome do bairro a eles. É uma inferência apoiada no documento, que não traz uma justificativa explícita para a escolha.",
      "historia": "Jardim Guimarães foi loteado em 1981, segundo o estudo de Gabriel Henrique dos Santos Ferreira, da Universidade do Vale do Paraíba. Ficava perto de Altos de Santana e Telespark, na expansão das moradias da Zona Norte. A planta do empreendimento lista seus proprietários e reserva áreas para lazer e equipamentos públicos, além das quadras residenciais.\n\nUma referência conhecida pelos moradores é a Praça da Bica, na Rua Maria Francisca dos Santos. Em 2019, a Prefeitura anunciou a revitalização da nascente com apoio do Rotary Club Oeste. A notícia dizia que a mina d’água fazia parte da comunidade havia cerca de 50 anos. A intervenção incluiu melhorias na rampa, no corrimão e na iluminação, com participação prevista de alunos das escolas da região no plantio de árvores.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Passagem que registra Jardim Guimarães em 1981 e sua proximidade de Altos de Santana e Telespark.",
          "acesso": "4 out. 2026.",
          "pagina": "102–103 do PDF",
          "paginaPdf": 102
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Guimarães: projeto de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/guimaraes_jd.pdf",
          "nota": "Quadro inferior direito: José Guimarães Claro e Lydia Guimarães Prianti entre os proprietários. Desenho das áreas de lazer e da área institucional.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Nascente do Jardim Guimarães recebe revitalização com apoio do Rotary. São José dos Campos, 27 fev. 2019.",
          "url": "https://www.sjc.sp.gov.br/noticias/2019/fevereiro/27/nascente-do-jardim-guimaraes-recebe-revitalizacao-com-apoio-do-rotary/",
          "nota": "Localização da Praça da Bica, memória da nascente e obras anunciadas para fevereiro de 2019.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "O loteamento e a Praça da Bica",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3"
    },
  {
      "id": "bairro-buquirinha-1",
      "nome": "Buquirinha I",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Nome regional registrado nos anos 1920; comunidade estudada em 2018",
      "origemNome": "Buquirinha I conserva um nome antigo da região e acrescenta o numeral para distinguir o núcleo. A lista dos anos 1920 traz apenas “Buquirinha”; as fontes consultadas não explicam a origem da palavra nem quando a numeração foi adotada.",
      "historia": "Buquirinha já aparece entre os nomes de bairros da década de 1920 no levantamento de Gabriel Henrique dos Santos Ferreira, da Universidade do Vale do Paraíba. O registro é anterior à divisão em Buquirinha I e II e não estabelece quando cada núcleo se formou.\n\nUma pesquisa feita em 2018 nos dois bairros ouviu 12 moradoras. Jane Zandomenico e Denise Martin registraram casas que começaram com um ou dois cômodos e foram ampliadas com ajuda de familiares, amigos e vizinhos. As entrevistadas relatavam investimento na casa quando sobrava dinheiro e vontade de permanecer perto da família. Esses relatos publicados em 2022 contam experiências de algumas moradoras, sem representar todas as famílias do Buquirinha I.\n\nEm 2017, o bairro entrou na ampliação da coleta seletiva anunciada pela Prefeitura, junto com outras comunidades do norte.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Tabela 3: Buquirinha entre os bairros da década de 1920, sem numeração.",
          "acesso": "4 out. 2026.",
          "pagina": "39 do PDF",
          "paginaPdf": 39
        },
        {
          "referencia": "ZANDOMENICO, Jane; MARTIN, Denise. Percepção de risco de moradoras em áreas sujeitas a escorregamentos de encostas. Saúde e Sociedade, São Paulo, v. 31, n. 4, e210541pt, 2022. DOI: 10.1590/S0104-12902022210541pt.",
          "url": "https://www.scielo.br/j/sausoc/a/bgRJpnSy9TMxgRc7Fm5GJnL/?format=pdf&ilang=pt_BR&lang=pt",
          "nota": "Pesquisa de campo em 2018: autoconstrução, participação de familiares e melhorias das casas. O artigo preserva a identidade das entrevistadas e não informa em qual dos dois bairros cada uma residia.",
          "acesso": "4 out. 2026.",
          "pagina": "4–7 do PDF",
          "paginaPdf": 6
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Coleta seletiva chega a mais 50 bairros e agrada a população. São José dos Campos, 7 dez. 2017.",
          "url": "https://www.sjc.sp.gov.br/noticias/2017/dezembro/07-quinta/coleta-seletiva-chega-a-mais-50-bairros-e-agrada-a-populacao/",
          "nota": "Relação dos bairros do norte incluídos no serviço: Buquirinha I aparece separadamente do Buquirinha II.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Casas construídas aos poucos",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3"
    },
  {
      "id": "bairro-buquirinha-2",
      "nome": "Buquirinha II",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Comunidade documentada em 2011; regularização anunciada em 2025",
      "origemNome": "O numeral II distingue esse núcleo do Buquirinha I e do Mirante, citados separadamente nas notícias municipais. A denominação mantém o nome regional Buquirinha, mas os documentos reunidos aqui não explicam sua origem.",
      "historia": "Em fevereiro de 2016, José Manassés Monteiro contou à Prefeitura que morava no Buquirinha II havia mais de 15 anos. Ele e Eliana Regina dos Santos foram acompanhar a assinatura do contrato para pavimentar o corredor de ônibus da Estrada do Florindo. A reportagem registra a espera pelo asfalto e as dificuldades com poeira, barro e buracos. O contrato previa melhorias para a ligação do Buquirinha II com localidades vizinhas.\n\nEm 2025, moradores foram chamados a apresentar documentos para a regularização dos terrenos. O perímetro anunciado incluía a Avenida Ubiratan Mendes e as ruas Antônio Pereira Toledo, Tereza Machado Lima e Antônio de Assis Dias. Era uma etapa de coleta e análise de documentos; a notícia não afirmava que todos os títulos já estavam entregues.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Buquirinha II vai ter corredor de ônibus de 4,3 km asfaltado. São José dos Campos, 20 fev. 2016.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=23553",
          "nota": "Assinatura do contrato e depoimentos de José Manassés Monteiro e Maria Benedita de Souza sobre as condições da via. A notícia anuncia a obra, não comprova sua conclusão.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Regularização no Buquirinha II segue com coleta de documentos. São José dos Campos, 7 maio 2025.",
          "url": "https://www.sjc.sp.gov.br/noticias/2025/maio/07/regularizacao-no-buquirinha-ii-segue-com-coleta-de-documentos/",
          "nota": "Perímetro do núcleo e etapas da regularização. Página atualizada em 8 de julho de 2025.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
          "nota": "Relação de localidades: Buquirinha I, Buquirinha II e Mirante apresentados separadamente.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "A espera pelo asfalto e pelo registro da casa",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3",
      "contextoFonte": ""
    },
  {
      "id": "bairro-mirante-buquirinha",
      "nome": "Mirante do Buquirinha",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Loteamento citado em decreto de 1999",
      "origemNome": "A denominação liga o loteamento à região do Buquirinha. “Mirante” sugere um ponto de observação, mas o decreto de 1999 não explica a escolha do nome nem identifica seu autor.",
      "historia": "Em 1999, o Mirante do Buquirinha já era citado em um decreto municipal. O documento tratava de uma passagem para a Sabesp acessar o reservatório que abastecia o loteamento. É um registro concreto de sua infraestrutura, embora não informe quando chegaram os primeiros moradores.\n\nEm 2011, o Mirante foi incluído no atendimento de uma equipe de Saúde da Família instalada no Buquirinha. A notícia municipal distingue o Mirante do Buquirinha 1 e do Buquirinha 2. Em março de 2024, outra reportagem da Prefeitura registrou alagamentos ligados à cheia do rio Buquira no Mirante e em localidades vizinhas. Esses documentos ajudam a entender os serviços e as condições de vida nessa parte da cidade.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Decreto nº 9.795, de 26 de outubro de 1999. Declara de utilidade pública imóvel para instituição de servidão de passagem. São José dos Campos, 1999.",
          "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/1999/9795.pdf",
          "nota": "Artigo 1º: acesso da Sabesp ao reservatório de abastecimento do loteamento Mirante do Buquirinha.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Estratégia Saúde da Família começa no Buquirinha. São José dos Campos, 29 set. 2011.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=10599",
          "nota": "Lista das localidades atendidas, incluindo o Mirante. Os números de famílias na reportagem se referem à área total de atendimento, não apenas ao bairro.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. São Francisco Xavier recebe manutenção e libera estradas. São José dos Campos, 7 mar. 2024.",
          "url": "https://www.sjc.sp.gov.br/noticias/2024/marco/07/sao-francisco-xavier-recebe-manutencao-e-libera-estradas/",
          "nota": "Passagem sobre a cheia do rio Buquira na Zona Norte, com menção ao Mirante do Buquirinha.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Água, atendimento e vida na região do Buquirinha",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2",
      "contextoFonte": ""
    },
  {
      "id": "bairro-freitas",
      "nome": "Bairro dos Freitas",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Nome registrado nos anos 1920; expansão das moradias a partir dos anos 1960",
      "origemNome": "A forma “Bairro dos Freitas” sugere uma referência a uma família. O nome já constava nos registros dos anos 1920, mas as fontes consultadas não identificam as pessoas que o originaram. O depoimento de Wilma documenta seu uso em uma área mais ampla, sem explicar a escolha inicial.",
      "historia": "Freitas aparece na relação de bairros da década de 1920 apresentada por Gabriel Henrique dos Santos Ferreira, da Universidade do Vale do Paraíba. Décadas depois, a área passou por mudanças no uso da terra. Na dissertação de Gercina Maria dos Santos, de 2007, antigas fazendas foram divididas em chácaras, e parte delas voltou a ser repartida entre parentes ou vendida, dando lugar a pequenos loteamentos.\n\nA pesquisadora ouviu Wilma da Silva Carvalho de Oliveira em dezembro de 2005. Segundo esse depoimento, o lugar hoje chamado Mirante do Buquirinha e o Bairro dos Freitas eram conhecidos como um só bairro: Freitas. É uma memória identificada no estudo. A TV Câmara também registrou lembranças locais no programa Histórias do Meu Bairro; uma apresentação da série, publicada em 2022, menciona as olarias que existiam na região.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Tabela 3: entrada Freitas entre os bairros da década de 1920.",
          "acesso": "4 out. 2026.",
          "pagina": "39 do PDF",
          "paginaPdf": 39
        },
        {
          "referencia": "SANTOS, Gercina Maria dos. A ocupação do espaço e a questão sócio ambiental na bacia hidrográfica do Córrego dos Freitas — São José dos Campos — S. P. 2007. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2007.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/04/A-Ocupa%C3%A7%C3%A3o-do-Espa%C3%A7o-e-a-Quest%C3%A3o-S%C3%B3cio-Ambiental-na-Bacia-Hidrogr%C3%A1fica-do-C%C3%B3rrego-dos-Freitas-S%C3%A3o-Jos%C3%A9-dos-Campos-S.P..pdf",
          "nota": "Descrição do desmembramento das terras; nota 14 identifica Wilma da Silva Carvalho de Oliveira e entrevista em dezembro de 2005.",
          "acesso": "4 out. 2026.",
          "pagina": "46 do PDF (p. 32 da obra)",
          "paginaPdf": 46
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Câmara Municipal. Conheça diferentes partes da cidade com o programa “Histórias do meu bairro”. São José dos Campos, 29 jul. 2022.",
          "url": "https://www.camarasjc.sp.gov.br/noticias/7892/conheca-diferentes-partes-da-cidade-com-o-programa-historias-do-meu-bairro",
          "nota": "Apresentação do episódio dos Freitas: memória das antigas olarias. A série reúne depoimentos de moradores; este link abre a apresentação institucional.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "De fazendas e chácaras a novas moradias",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3"
    },
  {
      "id": "bairro-costinha",
      "nome": "Costinha",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Comunidade documentada em homenagens e na regularização dos terrenos",
      "origemNome": "“Costinha” pode funcionar como sobrenome ou apelido, mas essa possibilidade não identifica quem teria dado nome ao bairro. Os documentos consultados confirmam a denominação sem explicar sua escolha; a homenagem a Joel é à praça, não a origem do nome Costinha.",
      "historia": "A memória do Costinha aparece na trajetória de Joel Pinto de Araújo. Ele trabalhou na Tecelagem Parahyba, distribuiu leite em bairros da região por quase dez anos e foi diretor do Frigorífico FC, equipe do futebol amador. Em 2013, a Câmara aprovou um projeto para dar seu nome à praça no fim da Travessa Hercílio Rodrigues, no Costinha. Joel havia morrido em dezembro de 2008.\n\nA documentação das moradias também marcou a vida do bairro. Em março de 2024, oito famílias do Costinha receberam títulos de regularização fundiária. A reportagem municipal ouviu Maria Aparecida Sellari e Rosemary Aparecida de Andrade, que comemoraram a entrega depois de anos de espera. O registro das casas aparece, assim, acompanhado das pessoas que viveram esse processo.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Câmara Municipal. Joel Araújo é rua no Costinha. São José dos Campos, 6 dez. 2013.",
          "url": "https://www.camarasjc.sp.gov.br/noticias/2373/joel-araujo-e-rua-no-costinha",
          "nota": "O corpo da notícia identifica uma proposta de denominação de praça, apesar de o título mencionar rua. Descreve a trajetória de Joel Pinto de Araújo.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Vila Leila e Costinha recebem títulos de regularização fundiária. São José dos Campos, 14 mar. 2024.",
          "url": "https://www.sjc.sp.gov.br/noticias/2024/marco/14/vila-leila-e-costinha-recebem-titulos-de-regularizacao-fundiaria/",
          "nota": "Oito títulos entregues a famílias do Costinha e relatos das moradoras. Não significa que todo o bairro tenha sido regularizado.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Trabalho, futebol e a espera pelos documentos",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3",
      "contextoFonte": ""
    },
  {
      "id": "bairro-bonsucesso",
      "nome": "Bonsucesso",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Nome registrado na década de 1920",
      "origemNome": "A capela é dedicada a Nossa Senhora do Bonsucesso, e o bairro aparece em uma lista antiga como “Bom Sucesso”. A devoção é uma possível referência para o nome, mas as fontes não esclarecem se ela nomeou o bairro ou se a capela recebeu a denominação do lugar.",
      "historia": "“Bom Sucesso” está na relação de bairros dos anos 1920 apresentada por Gabriel Henrique dos Santos Ferreira, da Universidade do Vale do Paraíba. A Prefeitura identifica Bonsucesso como uma comunidade da área rural da Zona Norte. Seu salão paroquial, junto à Capela Nossa Senhora do Bonsucesso, também serve como espaço para discutir assuntos da região.\n\nEm 12 de maio de 2018, mais de 60 pessoas se reuniram ali para o fórum do Plano Diretor. Havia moradores de loteamentos próximos e agricultores. Entre os pedidos estavam a regularização dos terrenos, melhorias no transporte e a volta dos conserveiros, trabalhadores encarregados da manutenção das estradas rurais. A reunião mostra preocupações de quem dependia desses caminhos para circular entre as comunidades.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Tabela 3: Bom Sucesso entre os bairros da década de 1920.",
          "acesso": "4 out. 2026.",
          "pagina": "39 do PDF",
          "paginaPdf": 39
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Moradores discutem Plano Diretor no Novo Horizonte e Bonsucesso. São José dos Campos, 12 maio 2018.",
          "url": "https://www.sjc.sp.gov.br/noticias/2018/maio/12/moradores-discutem-plano-diretor-no-novo-horizonte-e-bonsucesso/",
          "nota": "Localização rural, encontro na Capela Nossa Senhora do Bonsucesso e pedidos dos participantes. Não se confunde esta capela com a matriz de Monteiro Lobato ou a comunidade de Capuava.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "A comunidade rural e sua capela",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3"
    },
  {
      "id": "bairro-turvo",
      "nome": "Turvo",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Região ligada ao início da eletrificação, no começo do século XX",
      "origemNome": "Turvo já aparece como nome de bairro na relação dos anos 1920. A palavra pode descrever água com pouca transparência, mas essa leitura não comprova sua origem local. A usina recebeu o mesmo nome; as fontes não informam qual denominação veio primeiro.",
      "historia": "Turvo tem uma ligação com a chegada da energia elétrica a São José dos Campos. Um estudo da Fundação Cultural Cassiano Ricardo, realizado em 2004, relaciona a antiga usina à primeira fase da eletrificação, no início do século XX. O serviço de iluminação foi inaugurado na cidade em janeiro de 1910, com bandas de música e participação da população. Fotografias de 1922 mostram a casa de força e seu interior.\n\nEm 1928, a Light comprou a empresa responsável pelo fornecimento e desativou a Usina do Turvo, conectando a cidade à sua rede. O estudo traz também uma fotografia das ruínas em 2003, no bairro do Turvo, na Estrada do Bom Sucesso. A construção perdeu sua função, mas ficou documentada como parte da história da energia na cidade.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "FUNDAÇÃO CULTURAL CASSIANO RICARDO. Departamento de Patrimônio Histórico. Usina do Turvo. In: Patrimônio perdido: o passado em ruínas. São José dos Campos, 2004. Reprodução em: São José dos Campos Antigamente, [s. d.].",
          "url": "https://www.sjcantigamente.com.br/usina-do-turvo/",
          "nota": "Reprodução com identificação da FCCR e da equipe de pesquisa. Histórico de 1910–1928 e fotografias de 1922 e 2003. A data de construção da usina é apresentada como provável no estudo.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Tabela 3: Turvo entre os bairros da década de 1920.",
          "acesso": "4 out. 2026.",
          "pagina": "39 do PDF",
          "paginaPdf": 39
        }
      ],
      "fontePagina": "",
      "contextoFonte": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "A usina que ajudou a iluminar a cidade",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3"
    },
  {
      "id": "bairro-pouso-frio",
      "nome": "Pouso Frio",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Estrada documentada em 1981, em São Francisco Xavier",
      "origemNome": "“Pouso Frio” sugere um lugar de parada associado ao frio. É uma interpretação das palavras: os documentos consultados não descrevem uma antiga parada de tropeiros nem explicam quem escolheu o nome.",
      "historia": "A Estrada Municipal Pouso Frio aparece em um decreto de 1981 que previa a preservação da cachoeira de São Francisco Xavier e a implantação de equipamentos de lazer. O documento descreve terras junto à estrada, incluindo uma área com um paiol de alvenaria. O nome já identificava um caminho da região rural do distrito.\n\nPouso Frio também aparece na pesquisa comunitária preparada para a revisão do Plano Diretor de 2016, entre as localidades de residência dos participantes. Em março de 2024, a Prefeitura registrou a desobstrução da estrada após as chuvas. Esses registros, separados por décadas, mostram a permanência do nome e a importância do acesso para a comunidade.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Decreto nº 3.609, de 20 de fevereiro de 1981. Declara de utilidade pública áreas para preservação da cachoeira de São Francisco Xavier e implantação de equipamentos de lazer, recreação e turismo. São José dos Campos, 1981.",
          "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1981/DE_1981_00003609.pdf",
          "nota": "Artigo 1º, na página 1; imóveis junto à Estrada Municipal Pouso Frio, nas páginas 3–5. A menção ao paiol está na página 5. O decreto registra uma finalidade, não comprova a execução das obras.",
          "acesso": "4 out. 2026.",
          "pagina": "1 e 3–5 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "PLANO Diretor 2016 — São José dos Campos — São Francisco Xavier: pesquisa comunidade. São Francisco Xavier, 2016.",
          "url": "https://www.sjc.sp.gov.br/media/eeijtafl/leitura-comunit%C3%A1ria-_atus_2016.pdf",
          "nota": "Gráfico “Bairro”: Pouso Frio entre as localidades dos participantes. Os números representam respostas à pesquisa, não a população de cada bairro.",
          "acesso": "4 out. 2026.",
          "pagina": "6 do PDF",
          "paginaPdf": 6
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. São Francisco Xavier recebe manutenção e libera estradas. São José dos Campos, 7 mar. 2024.",
          "url": "https://www.sjc.sp.gov.br/noticias/2024/marco/07/sao-francisco-xavier-recebe-manutencao-e-libera-estradas/",
          "nota": "Trecho sobre as estradas do distrito de São Francisco Xavier desobstruídas após as chuvas, incluindo Pouso Frio.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Um nome antigo nas estradas de São Francisco Xavier",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote2",
      "contextoFonte": ""
    },
  {
      "id": "bairro-aguas-canindu",
      "nome": "Águas do Canindu",
      "regiaoId": "norte",
      "regiaoNome": "Zona Norte",
      "periodo": "Comunidade estudada em 2017; etapas de regularização em 2022 e 2026",
      "origemNome": "Canindu também é o nome de uma fonte descrita pelo jornalista Romeu Garcia nos anos 1970, na Vila Cândida. Essa referência à água ajuda a interpretar “Águas de Canindu” como uma possível ligação com a fonte. O recorte não explica a escolha do nome do loteamento, por isso a relação permanece uma inferência.",
      "historia": "Águas de Canindu aparece entre os loteamentos da Zona Norte na dissertação de Maria de Fátima Moura Gomes, da Universidade do Vale do Paraíba, publicada em 2017. A pesquisa analisou o processo de regularização das moradias e reuniu informações sobre infraestrutura e reconhecimento dos loteamentos pelo município.\n\nEm 2022, a Prefeitura anunciou visitas às casas de parte do bairro para cadastrar os moradores e localizar os imóveis na planta, em parceria com o programa estadual Cidade Legal. Em fevereiro de 2026, foi divulgado um ponto de apoio para Águas de Canindu e Chácaras Havaí. A notícia previa levantamento dos lotes, estudos ambientais e outras etapas antes da titulação. Eram passos para documentar as moradias existentes; não uma data de fundação do bairro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "fichaHistoria": [],
      "fontesRevisadas": [
        {
          "referencia": "GOMES, Maria de Fátima Moura. Avaliação do processo de regularização fundiária no município de São José dos Campos — SP. 2017. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2017.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/08/00002e81.pdf",
          "nota": "Tabela 6, bloco Norte: Águas de Canindu. O quadro inclui um loteamento homônimo no bloco Leste, que não foi usado como descrição deste bairro.",
          "acesso": "4 out. 2026.",
          "pagina": "81 do PDF",
          "paginaPdf": 81
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Regularização do Águas de Canindu entra em nova etapa. São José dos Campos, 8 fev. 2022.",
          "url": "https://www.sjc.sp.gov.br/noticias/2022/fevereiro/08/regularizacao-do-aguas-de-canindu-entra-em-nova-etapa/",
          "nota": "Anúncio de visitas domiciliares e cadastramento em parte do núcleo, com o programa Cidade Legal.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Ponto de apoio tira dúvidas sobre regularização no Canindu e Havaí. São José dos Campos, 6 fev. 2026.",
          "url": "https://www.sjc.sp.gov.br/noticias/2026/fevereiro/06/ponto-de-apoio-tira-duvidas-sobre-regularizacao-no-canindu-e-havai/",
          "nota": "Etapas previstas antes da titulação. A estimativa de famílias inclui os dois núcleos, não apenas Canindu.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "GARCIA, Romeu. A fonte Canindu. [S. l.: s. n.], [197-]. Reprodução em: São José dos Campos Antigamente, [s. d.].",
          "url": "https://www.sjcantigamente.com.br/a-fonte-canindu/",
          "nota": "Texto atribuído a Romeu Garcia e à década de 1970 pelo acervo; o jornal original não foi identificado. Descreve a fonte na Vila Cândida, sem comprovar que ela deu nome ao loteamento.",
          "acesso": "4 out. 2026."
        }
      ],
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome",
      "tituloHistoria": "Da ocupação dos terrenos ao registro das moradias",
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "norte-2026-10-04-lote3",
      "contextoFonte": ""
    },
  {
      "id": "bairro-satelite",
      "nome": "Jardim Satélite",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Formação nos anos 1960; expansão habitacional nos anos 1970",
      "origemNome": "José Manoel Alvares Rodrigues, diretor técnico da Companhia Satélite de Terrenos, explicou aos autores do estudo de 1997 que o nome veio das viagens espaciais comentadas naquele período. A denominação inicial, Satélite Industrial, acompanhava um projeto de reunir indústrias e residências.",
      "historia": "Antes das avenidas e do comércio, havia terras da família Bonádio e da fábrica de louças Santo Eugênio. No trabalho de História de 1997 da Univap, Maria Cardoso e Valdelice Cardoso lembram um começo sem água encanada ou energia: buscavam água na portaria da Alpargatas, que estava se instalando. A fábrica começou a ser construída em 1959 e entrou em produção no ano seguinte.\n\nNos anos 1970, as casas financiadas pelo Banco Nacional da Habitação ampliaram o bairro. Os moradores passaram a distinguir o Satélite Novo, com as casas do conjunto, do Satélite Velho, mais próximo da Dutra, onde muitas famílias haviam construído suas próprias moradias. O comércio também se expandiu. Em uma pesquisa de Geografia publicada em 2006, a Avenida Andrômeda já era estudada como um corredor de lojas e serviços que atendia a região sul.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As casas que cresceram perto da Alpargatas",
      "fontesRevisadas": [
        {
          "referencia": "COUTO, José Luis Nunes; VITOR, Luciana Alves; AMBRÓSIO, Maria Aparecida. História do bairro do Jardim Satélite. 1997. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 1997.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2023/05/1997-historia-do-bairro-do-jardim-satelite.pdf",
          "nota": "Memórias de Maria e Valdelice Cardoso; depoimento do engenheiro da loteadora sobre o nome; construção da Alpargatas e distinção entre Satélite Velho e Novo.",
          "acesso": "4 out. 2026.",
          "pagina": "16–20 do PDF (p. 10–14 da obra)",
          "paginaPdf": 17
        },
        {
          "referencia": "SANTOS, Ed Carlos dos; ABREU, Roberto. As características do corredor comercial do bairro Jardim Satélite, São José dos Campos. In: ENCONTRO LATINO AMERICANO DE INICIAÇÃO CIENTÍFICA, 10., 2006, São José dos Campos. Anais [...]. São José dos Campos: Universidade do Vale do Paraíba, 2006. p. 1834–1837.",
          "url": "https://www.inicepg.univap.br/cd/INIC_2006/inic/inic/05/INIC0000187ok.pdf",
          "nota": "Estudo de campo sobre a Avenida Andrômeda e a expansão comercial. O retrato econômico é de 2006.",
          "acesso": "4 out. 2026.",
          "pagina": "1–3 do PDF (p. 1834–1836 dos anais)",
          "paginaPdf": 2
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-floradas-sao-jose",
      "nome": "Floradas de São José",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento aprovado em 1992",
      "origemNome": "“Floradas” remete ao florescimento, e “São José” ao nome da cidade. Essa leitura combina com as áreas verdes previstas na planta, mas o projeto não atribui o nome a uma espécie de árvore nem explica quem o escolheu.",
      "historia": "Floradas de São José tem uma ligação documentada com a São Paulo Alpargatas. A planta de parcelamento identifica a empresa como proprietária e situa o empreendimento na Avenida Andrômeda, no antigo bairro do Serimbura. O desenho reserva áreas institucionais e espaços de lazer entre as quadras, com ruas ligando as avenidas Andrômeda e Cidade Jardim.\n\nA relação municipal de loteamentos aprovados registra Floradas de São José em 1992, na região do Jardim Satélite. Nos anos seguintes, as ruas numeradas ganharam nomes. A Lei nº 4.897, de 11 de julho de 1996, chamou a antiga Rua 6 de Rua da Alegria, nome que também aparece na planta.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um loteamento em terras da Alpargatas",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Floradas de São José: planta de parcelamento e arruamento. São José dos Campos, [s. d.]. 1 planta. Folha 01/6.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/floradas_de_sao_jose_jd.pdf",
          "nota": "Quadro de identificação: proprietária São Paulo Alpargatas S/A e localização no Serimbura. Áreas verdes, áreas institucionais e Rua da Alegria no desenho.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Loteamentos aprovados: relação atualizada em 17 de setembro de 2024. São José dos Campos, 2024.",
          "url": "https://siteprefeitura.sjc.sp.gov.br/media/293012/2024_09_17_tabela-de-loteamentos-aprovados-1.pdf",
          "nota": "Bloco dos loteamentos aprovados e registrados de 1990 a 2000: Floradas de São José, ano de aprovação 1992. Trata-se da aprovação, não da data de chegada dos primeiros moradores.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Lei nº 4.897, de 11 de julho de 1996. Denomina a Rua 6, no Loteamento Floradas de São José, no Bairro Serimbura, de Rua da Alegria. São José dos Campos, 1996.",
          "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Leis/1996/LE_1996_00004897.pdf",
          "nota": "Artigo 1º: denominação da antiga Rua 6.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-bosque-eucaliptos",
      "nome": "Bosque dos Eucaliptos",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Projeto protocolado em 1974; comercialização nos anos 1970",
      "origemNome": "O nome vem de uma faixa de eucaliptos com mais de 70 metros de largura que separava o novo loteamento da área já urbanizada. Limiro descreve essa relação na dissertação de 2006, disponível no Pró-Memória, projeto da Câmara Municipal de São José dos Campos.",
      "historia": "O projeto do Bosque dos Eucaliptos já estava protocolado na Prefeitura em dezembro de 1974. A dissertação de Lucia de Almeida Terra Limiro, da Univap, acompanha o empreendimento da Companhia Satélite de Terrenos e seus anúncios nos jornais de 1977. Os lotes eram vendidos com a promessa de água, esgoto e ruas preparadas para receber as casas. O plano divulgado em 1975 previa quadras com ruas internas sem saída, ligadas a áreas verdes, embora nem tudo tenha sido construído como anunciado.\n\nDécadas depois, moradores da Rua José Bento de Moura deram outro uso a uma dessas áreas de convivência. Pediram autorização à Prefeitura e criaram uma horta comunitária na área verde José Sanches Rodrigues. Em fevereiro de 2020, uma reportagem registrou os mutirões e a participação da agrônoma Cintia Galvão Sales, uma das idealizadoras, junto com famílias e crianças do bairro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "A faixa de eucaliptos e as ruas sem saída",
      "fontesRevisadas": [
        {
          "referencia": "LIMIRO, Lucia de Almeida Terra. Modos de vida da cidade pequena na cidade grande e análise das práticas do planejamento urbano municipal de São José dos Campos: um estudo de caso no Bosque dos Eucaliptos. 2006. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2006.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/08/Modos-de-Vida-da-Cidade-Pequena-na-Cidade-Grande-e-An%C3%A1lise-das-Pr%C3%A1ticas-do-Planejamento-Urbano-Municipal-de-S%C3%A3o-Jos%C3%A9-dos-Campos-Um-Estudo-de-Caso-no-Bosque-dos-Eucaliptos.pdf",
          "nota": "Projeto protocolado em 1974; desenho previsto para as quadras; seção 10.5, que explica o nome pela faixa de eucaliptos e examina os anúncios de 1977.",
          "acesso": "4 out. 2026.",
          "pagina": "137–142 do PDF (p. 125–130 da obra)",
          "paginaPdf": 142
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Comunidade do Bosque e Prefeitura implantam horta. São José dos Campos, 17 fev. 2020.",
          "url": "https://www.sjc.sp.gov.br/noticias/2020/fevereiro/17/comunidade-do-bosque-e-prefeitura-implantam-horta/",
          "nota": "Mutirões na área verde José Sanches Rodrigues, solicitação dos moradores e relato de Cintia Galvão Sales.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-parque-industrial",
      "nome": "Parque Industrial",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento iniciado em 1956; chegada da Eaton em 1957",
      "origemNome": "O nome corresponde à proposta do loteamento e ao nome da empresa que o lançou: Companhia Parque Industrial de São José dos Campos. O estudo da Univap descreve o projeto como industrial e residencial desde o início.",
      "historia": "O Parque Industrial começou a ser loteado em 1956 para reunir atividades industriais e moradias, segundo a pesquisa de Gabriel Henrique dos Santos Ferreira, da Univap. Sebastião Henrique da Cunha Pontes conduziu o empreendimento por meio da Companhia Parque Industrial de São José dos Campos. Em 1957, a Eaton, fabricante de válvulas para motores, instalou-se ali.\n\nA formação do bairro também aparece nas lembranças da comunidade religiosa. A revista histórica da Diocese de São José dos Campos conta que moradores frequentavam uma gruta de Nossa Senhora de Lourdes à beira da Dutra. A primeira capela começou a ser construída em fevereiro de 1969 e foi concluída no primeiro semestre de 1970. Com o aumento da população, a comunidade tornou-se paróquia em 7 de abril de 1976.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Fábricas e casas no mesmo projeto",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Loteamento a partir de 1956, empreendedor Sebastião Henrique da Cunha Pontes, chegada da Eaton e anúncio de lançamento da companhia.",
          "acesso": "4 out. 2026.",
          "pagina": "60–61 do PDF",
          "paginaPdf": 60
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia Nossa Senhora de Lourdes. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 43.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "Gruta junto à Dutra, construção da capela em 1969–1970 e criação da paróquia em 7 de abril de 1976.",
          "acesso": "4 out. 2026.",
          "pagina": "43 do PDF",
          "paginaPdf": 43
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-oriente",
      "nome": "Jardim Oriente",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Formação ligada à imigração japonesa nos anos 1950",
      "origemNome": "A ligação com o Japão ajuda a entender “Oriente”: o bairro se formou com famílias japonesas e recebeu ruas com nomes de cidades e províncias daquele país. É uma interpretação apoiada nessa história local; as fontes reunidas não apresentam um ato explicando a escolha da denominação.",
      "historia": "A chegada de famílias japonesas e o loteamento de terras de Torataro Takitani fazem parte da formação do Jardim Oriente. O histórico publicado pela Diocese situa os primeiros imigrantes da comunidade entre 1950 e 1955. O estudo de Gabriel Henrique dos Santos Ferreira, da Univap, relaciona a expansão do bairro à Kanebo, cuja construção começou em 1956, perto da Estrada Velha Rio-São Paulo.\n\nNas ruas, essa presença aparece em nomes como Hiroshima, Saga e Tóquio. A vida comunitária se organizou também dentro das casas: em 1976, começaram encontros de oração na Rua Saitama; em 1978, uma missa foi celebrada na casa de Aparecida dos Prazeres, na Rua Osaka. A primeira capela de Nossa Senhora de Fátima foi inaugurada em maio de 1989, e o histórico registra a introdução de uma missa em japonês em 1996.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Uma vizinhança de famílias japonesas",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Terras de Torataro Takitani, construção da Kanebo a partir de 1956 e nomes japoneses nas vias do bairro.",
          "acesso": "4 out. 2026.",
          "pagina": "60 do PDF",
          "paginaPdf": 60
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. A Paróquia do Jardim Oriente. São José dos Campos, 21 dez. 2012.",
          "url": "https://diocese-sjc.org.br/a-paroquia-do-jardim-oriente/",
          "nota": "Histórico da comunidade: imigração nos anos 1950, encontros nas ruas Saitama e Osaka, capela inaugurada em 1989 e missa em japonês a partir de 1996.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-america",
      "nome": "Jardim América",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Formação no loteamento da Colônia Paraíso, nos anos 1950",
      "origemNome": "América remete ao continente e combina com os nomes de países americanos que aparecem na planta, como Peru, Colômbia, Chile e Paraguai. O mapa permite reconhecer esse conjunto de referências geográficas, mas não registra quem decidiu o nome do bairro.",
      "historia": "Jardim América nasceu no parcelamento da Colônia Paraíso, propriedade de Torataro Takitani. O estudo de Gabriel Henrique dos Santos Ferreira, da Univap, apresenta o bairro junto com Jardim Paraíso e Jardim Oriente na expansão dos anos 1950, perto da Kanebo.\n\nA planta municipal preserva outra mudança: ruas que antes se chamavam Peru, Colômbia e Paraguai aparecem associadas aos nomes Rosário, Maracaíbo e Arequipa. Mais tarde, o bairro recebeu o Centro da Juventude, na Rua Aurora Pinto da Cunha. Sua inauguração, em 24 de novembro de 2012, reuniu famílias para oficinas de grafite, atividades esportivas e apresentações musicais.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Da Colônia Paraíso ao Centro da Juventude",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Jardim América entre os loteamentos formados na propriedade Colônia Paraíso, junto de Jardim Paraíso e Jardim Oriente.",
          "acesso": "4 out. 2026.",
          "pagina": "60 do PDF",
          "paginaPdf": 60
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim América: planta. São José dos Campos, [s. d.]. 1 planta. Folha 1.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/america_jd_fl01.pdf",
          "nota": "Nomes antigos e posteriores das vias: Peru/Rosário, Colômbia/Maracaíbo e Paraguai/Arequipa, entre outros.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Centro da Juventude já está aberto ao público. São José dos Campos, 26 nov. 2012.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=12703",
          "nota": "Inauguração em 24 de novembro de 2012, atividades realizadas e endereço no Jardim América.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-portugal",
      "nome": "Jardim Portugal",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Primeira gleba aprovada em 1959",
      "origemNome": "Portugal remete ao país europeu. A Rua dos Portugueses, identificada na planta, reforça essa associação. O conjunto de nomes sugere uma referência portuguesa; a origem da escolha e seu autor não aparecem no documento.",
      "historia": "A primeira gleba do Jardim Portugal foi aprovada em 9 de maio de 1959. A informação está na própria planta municipal, numa cópia preparada em 1982. O desenho guarda duas épocas das ruas: os números usados no projeto e os nomes que passaram a identificar os endereços. A Praça José Benedito Monteiro ocupa uma quadra no meio do loteamento.\n\nA dissertação de Gilberto Alves da Cunha, da Univap, situa o Portugal entre os bairros que surgiram longe da área urbana mais contínua, durante a expansão dos anos 1950. O intervalo entre esses loteamentos e o centro ajuda a entender por que a cidade cresceu com bairros separados por terrenos ainda não ocupados. A planta permite reconhecer como essa nova vizinhança foi organizada, com quadras residenciais e uma praça central.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As ruas numeradas e a praça do Portugal",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Portugal: primeira gleba. São José dos Campos, 1982. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/portugal_jd.pdf",
          "nota": "Quadro de identificação: aprovação em 9 de maio de 1959, processo 1.371/59; reprodução de 14 de outubro de 1982. Praça José Benedito Monteiro e Rua dos Portugueses no desenho.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Expansão descontínua dos loteamentos Colonial, Imperial e Portugal; Portugal em 1959.",
          "acesso": "4 out. 2026.",
          "pagina": "40 do PDF (p. 37 da obra)",
          "paginaPdf": 40
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-31-de-marco",
      "nome": "Conjunto Residencial 31 de Março",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Conjunto da cooperativa documentado em janeiro de 1979",
      "origemNome": "O conjunto conserva o nome da cooperativa que aparece no decreto de 1979. O Jornal do Metalúrgico, do sindicato local, associa a denominação a 31 de março de 1964, data do golpe militar. Essa explicação é atribuída à publicação; o decreto das ruas não conta por que a cooperativa adotou o nome.",
      "historia": "Em 30 de janeiro de 1979, o Decreto nº 2.821 oficializou os nomes de ruas do Conjunto Residencial da Cooperativa Habitacional 31 de Março, no Parque Industrial. Vias numeradas passaram a se chamar Antenor da Silva Maia, Umei Kanno e Luiz Monteiro Pinto, entre outras. O documento mostra que o conjunto já existia como referência naquele momento, embora não informe quando as primeiras famílias chegaram.\n\nUma reivindicação dos moradores aparece em outro registro, de fevereiro de 2016. A Prefeitura entregou a Praça Kátia Fernandes Karatanasov, entre a Rua João de Paula Cabral e a Avenida George Eastman, com pista de caminhada, quadra e brinquedos. A reportagem descreve a obra como atendimento a um pedido antigo da comunidade e explica a homenagem à jovem educadora que deu nome ao espaço.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As ruas de um conjunto habitacional",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Decreto nº 2.821, de 30 de janeiro de 1979. Dispõe sobre oficialização e denominação de via pública. São José dos Campos, 1979.",
          "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/1979/2821.pdf",
          "nota": "Artigo 1º: conjunto da Cooperativa Habitacional 31 de Março e nomes das antigas vias numeradas.",
          "acesso": "4 out. 2026.",
          "pagina": "1–2 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. População recebe praça totalmente revitalizada no 31 de Março. São José dos Campos, 13 fev. 2016.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=23500",
          "nota": "Entrega da Praça Kátia Fernandes Karatanasov, reivindicação dos moradores e homenagem à educadora.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SINDICATO DOS METALÚRGICOS DE SÃO JOSÉ DOS CAMPOS E REGIÃO. Golpe militar: 61 anos depois, vítimas lutam por reparação. Jornal do Metalúrgico, São José dos Campos, ano 42, n. 1443, 2ª semana de abr. 2025. p. 4.",
          "url": "https://www.sindmetalsjc.org.br/arquivo/jornais/c9e5398c4dc374350437.pdf",
          "nota": "Subseção “Herança sombria”: associação do nome do bairro à data do golpe de 1964. É a interpretação expressa pelo jornal sindical; não é um ato de denominação.",
          "acesso": "4 out. 2026.",
          "pagina": "4 do PDF",
          "paginaPdf": 4
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-cruzeiro-do-sul",
      "nome": "Jardim Cruzeiro do Sul",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento aprovado em 1991",
      "origemNome": "Cruzeiro do Sul é o nome de uma constelação. A planta e o decreto registram essa denominação para o bairro. A associação astronômica é clara no nome, embora os documentos não expliquem por que ele foi escolhido.",
      "historia": "O Jardim Cruzeiro do Sul foi aprovado em 1991, com 933 lotes, segundo a relação municipal de loteamentos. A planta identifica a MHK Incorporação e Construção como proprietária e mostra a ligação com o Jardim Colonial, pela Rua Arco Verde. Entre as quadras, o projeto reserva uma área institucional e espaços de lazer.\n\nEm novembro de 1995, um decreto definiu as regras de ocupação do bairro. Além das moradias, o documento estabeleceu corredores de comércio e serviços em vias determinadas, incluindo as avenidas então chamadas de 1 e 2. Essa divisão ajuda a entender a organização prevista para o Cruzeiro do Sul: casas nas quadras e atividades comerciais concentradas em alguns caminhos do loteamento.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um loteamento junto ao Jardim Colonial",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Loteamentos aprovados: relação atualizada em 17 de setembro de 2024. São José dos Campos, 2024.",
          "url": "https://siteprefeitura.sjc.sp.gov.br/media/293012/2024_09_17_tabela-de-loteamentos-aprovados-1.pdf",
          "nota": "Jardim Cruzeiro do Sul: aprovação em 1991, 933 lotes e localização no Jardim Colonial.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Cruzeiro do Sul: planta de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/cruzeiro_do_sul_jd.pdf",
          "nota": "Proprietária MHK Incorporação e Construção; ligação com o Colonial e áreas institucionais e de lazer.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Decreto nº 8.874, de 14 de novembro de 1995. Estabelece o zoneamento do loteamento Jardim Cruzeiro do Sul. São José dos Campos, 1995.",
          "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/1995/DE_1995_00008874.pdf",
          "nota": "Zoneamento residencial e corredores de comércio e serviços em vias especificadas.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-palmeiras-sao-jose",
      "nome": "Palmeiras de São José",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento de 1957",
      "origemNome": "O nome combina uma referência às palmeiras com o nome da cidade. A planta confirma a denominação do loteamento, mas não identifica uma espécie ou um antigo palmeiral que tenha motivado a escolha.",
      "historia": "Palmeiras de São José aparece entre os loteamentos de 1957 na pesquisa de Gabriel Henrique dos Santos Ferreira, da Univap, disponível no Pró-Memória, projeto da Câmara Municipal de São José dos Campos. A planta identifica a Urbanizadora Cinelândia como responsável pelo empreendimento. O mapa de localização mostra sua proximidade com a Dutra e o Parque Industrial.\n\nNos anos 1980, o bairro também recebeu a primeira sede do Centro de Tradições Gaúchas Saudades da Querência. O acervo São José dos Campos Antigamente reúne fotografias da construção e da inauguração, além de lembranças de seus participantes. O histórico situa em 1987 a permissão de uso do terreno no Palmeiras. A entidade mudaria depois de endereço; essa passagem faz parte da memória do bairro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O bairro e a primeira sede dos gaúchos",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Palmeiras de São José entre os loteamentos de 1957.",
          "acesso": "4 out. 2026.",
          "pagina": "61 do PDF",
          "paginaPdf": 61
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Palmeiras de São José: planta de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/palmeiras_de_sao_jose_jd.pdf",
          "nota": "Identificação da Urbanizadora Cinelândia e localização junto à Dutra e ao Parque Industrial.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "RIBEIRO, Wagner. Construção e inauguração do Centro de Tradições Gaúchas Saudades da Querência. São José dos Campos Antigamente, [s. d.].",
          "url": "https://www.sjcantigamente.com.br/construcao-e-inauguracao-do-centro-de-tradicoes-gauchas-saudades-da-querencia/",
          "nota": "Fotografias e memória da primeira sede no Palmeiras, com referência à permissão de uso de 1987. Trata-se do histórico da antiga sede, não do endereço atual.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-estoril",
      "nome": "Jardim Estoril",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Formação no início dos anos 1980",
      "origemNome": "Estoril coincide com o nome de uma localidade portuguesa. Essa é uma associação possível da denominação, mas não uma homenagem comprovada. A planta confirma o nome do bairro e a empresa responsável pelo projeto; não explica o motivo da escolha.",
      "historia": "O Jardim Estoril foi projetado pela Companhia Satélite de Terrenos. Na planta municipal, as quadras se distribuem entre as avenidas Cidade Jardim e Elmano Ferreira de Veloso, com uma área verde central identificada como Praça Rubens Castilho. O desenho situa o bairro perto do Bosque dos Eucaliptos, da Quinta das Flores e do Jardim Madureira.\n\nAs pesquisas da Univap colocam sua formação no início dos anos 1980. Gabriel Ferreira relaciona o loteamento a 1980; a relação estudada por Gilberto Cunha traz 1982, ano também presente nos carimbos da planta. Por isso, o período indicado aqui abrange esses registros. A diferença pode corresponder a etapas do empreendimento e não deve ser transformada numa data única de fundação.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As quadras ao redor da praça",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Estoril relacionado à expansão dos loteamentos a partir de 1980.",
          "acesso": "4 out. 2026.",
          "pagina": "103 do PDF",
          "paginaPdf": 103
        },
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Relação de loteamentos dos anos 1980: Estoril em 1982. Comparada ao registro de 1980 em Ferreira e aos carimbos de 1982 na planta.",
          "pagina": "42 do PDF (p. 39 da obra)",
          "paginaPdf": 42,
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Estoril: planta de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/estoril_jd.pdf",
          "nota": "Companhia Satélite de Terrenos; localização e Praça Rubens Castilho. Carimbos de 1982 no documento.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-madureira",
      "nome": "Jardim Madureira",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento registrado na pesquisa em 1958; projeto de regularização em 1980",
      "origemNome": "Madureira já era o nome do loteamento na relação de 1958. Uma referência a um sobrenome é possível, mas os documentos consultados não identificam a pessoa homenageada nem uma família ligada à escolha.",
      "historia": "O Jardim Madureira já aparece em 1958 na relação de loteamentos examinada por Gilberto Alves da Cunha, em sua dissertação da Univap. A data é anterior ao projeto de regularização guardado pela Prefeitura, preparado em 20 de novembro de 1980. Esse segundo documento não marca o nascimento do bairro: trata da organização de um loteamento que já existia.\n\nA planta mostra um conjunto pequeno de quadras, junto ao Jardim Portugal. Também preserva a numeração das ruas ao lado dos nomes: a Rua 1 aparece como Esmeralda Rondon, a Rua 2 como Werner da Costa Coelho e a Rua 3 como Maria Ribeiro Martins. Esses registros permitem acompanhar a mudança entre o desenho inicial e os endereços reconhecidos no bairro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um bairro anterior à sua regularização",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Tabela de loteamentos aprovados nos anos 1950: Jardim Madureira em 1958.",
          "acesso": "4 out. 2026.",
          "pagina": "60 do PDF (p. 57 da obra)",
          "paginaPdf": 60
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Projeto de regularização do Jardim Madureira. São José dos Campos, 1980. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/madureira_jd.pdf",
          "nota": "Data de 20 de novembro de 1980 no quadro; ruas numeradas e denominadas; proximidade com o Portugal.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-campo-dos-alemaes",
      "nome": "Campo dos Alemães",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Nome antigo da região; formação do loteamento habitacional nos anos 1980",
      "origemNome": "A crônica de Siqueira relaciona “Campo dos Alemães” à companhia e aos alemães que exploravam o cultivo de acácias na antiga área. O estudo da Univap descreve a adoção desse nome histórico pelo loteamento habitacional dos anos 1980.",
      "historia": "O nome Campo dos Alemães é anterior ao bairro residencial. Na crônica de Jairo Cesar Siqueira, publicada em 1987, ele identifica uma extensa área onde uma companhia alemã cultivava acácias para extrair tanino das cascas. O autor descreve terras que iam de Tatetuba ao Rio Comprido. Esse antigo campo era muito maior que o loteamento hoje conhecido pelo nome.\n\nA formação das moradias pertence a outra etapa. O estudo de Gabriel Henrique dos Santos Ferreira, da Univap, relaciona o loteamento dos anos 1980 à transferência de famílias que viviam nas margens do Ribeirão Vidoca. Parte da área recebeu o conjunto depois chamado Elmano Ferreira Veloso, com pequenas casas que os moradores ampliaram. A pesquisa distingue esse conjunto do restante do Campo dos Alemães e acompanha a expansão habitacional nas proximidades.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um nome antigo para uma nova área de moradias",
      "fontesRevisadas": [
        {
          "referencia": "SIQUEIRA, Jairo Cesar. O Campo dos Alemães. Perfil Mulher, São José dos Campos, jul. 1987. Reprodução em: São José dos Campos Antigamente, [s. d.].",
          "url": "https://www.sjcantigamente.com.br/o-campo-dos-alemaes/",
          "nota": "Crônica assinada com identificação do jornal e data. Companhia tanífera, cultivo de acácias e extensão do antigo campo, diferente do limite do bairro atual.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Transferência de famílias do Vidoca, planejamento nos anos 1980, loteamento em 1987 e distinção do conjunto Elmano Ferreira Veloso.",
          "acesso": "4 out. 2026.",
          "pagina": "99–100 do PDF",
          "paginaPdf": 99
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-dom-pedro-1",
      "nome": "Conjunto Habitacional Dom Pedro I",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Projeto habitacional; loteamento relacionado a 1991",
      "origemNome": "A denominação traz o nome de Dom Pedro I, primeiro imperador do Brasil. Ela identifica este conjunto e o distingue do Dom Pedro II, vizinho. A planta registra essa homenagem no nome, sem apresentar a decisão que justificou a escolha.",
      "historia": "O Conjunto Habitacional Dom Pedro I foi planejado pela Urbam, a Urbanizadora Municipal, no âmbito do Plano de Ação Imediata para Habitação Popular. A planta situa o projeto na Colônia Paraíso e separa lotes residenciais, espaços comerciais, áreas institucionais e de lazer. O estudo de urbanização de Gabriel Ferreira, da Univap, relaciona o loteamento a 1991, junto ao Dom Pedro II e a outros conjuntos da região.\n\nUma parte da vida do bairro aparece numa reportagem municipal de abril de 2021 sobre a Praça Maria Alves dos Santos. A moradora Hellen Rosa Pinto contou que levava o filho ao parquinho desde que ele tinha dois anos. O relato, publicado com seu nome, mostra o uso cotidiano de uma área de convivência por quem cresceu ou criou os filhos no conjunto.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As casas do conjunto e a praça dos moradores",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Conjunto Habitacional Dom Pedro I: projeto PAIH. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/pedro_i_d_conj_habitacional.pdf",
          "nota": "Urbam, Plano de Ação Imediata para Habitação Popular e localização na Colônia Paraíso; divisão dos usos do terreno.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Dom Pedro I e Dom Pedro II entre os loteamentos de 1991.",
          "acesso": "4 out. 2026.",
          "pagina": "100 do PDF",
          "paginaPdf": 100
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Programa Minha Praça de Volta chega a mais bairros da cidade. São José dos Campos, 12 abr. 2021.",
          "url": "https://www.sjc.sp.gov.br/noticias/2021/abril/12/programa-minha-praca-de-volta-chega-a-mais-bairros-da-cidade/",
          "nota": "Praça Maria Alves dos Santos no Dom Pedro I e depoimento identificado de Hellen Rosa Pinto.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-dom-pedro-2",
      "nome": "Conjunto Habitacional Dom Pedro II",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Projeto de dezembro de 1990; loteamento relacionado a 1991",
      "origemNome": "Dom Pedro II foi o segundo imperador do Brasil. Seu nome identifica este conjunto habitacional, enquanto o conjunto vizinho leva o de Dom Pedro I. Essa correspondência é clara na denominação, mas as plantas não documentam a discussão que levou à escolha dos dois nomes.",
      "historia": "A planta do Conjunto Habitacional Dom Pedro II foi preparada em dezembro de 1990 e identifica a CDHU entre os responsáveis pelo projeto. O quadro técnico prevê duas fases, com 1.536 unidades na primeira e 234 na segunda. Esses números descrevem o planejamento habitacional; não são uma contagem das casas ou dos moradores de hoje. A pesquisa de Gabriel Ferreira, da Univap, relaciona o loteamento a 1991.\n\nA proximidade com o Campo dos Alemães também aparece na história das áreas de lazer. Em março de 2017, a Prefeitura noticiou a reforma de uma praça entre os dois bairros, perto de uma nascente do Senhorinha. A costureira Francisca Irismar Cavalcante Rodrigues, moradora da região, comentou na reportagem sua expectativa de voltar a aproveitar o espaço com mais conforto.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um projeto de habitação popular em duas fases",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Conjunto Habitacional Dom Pedro II: projeto urbanístico, folha URB 01/08. São José dos Campos, 1990. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/pedro_ii_d_fl01_08.pdf",
          "nota": "Projeto de dezembro de 1990; identificação da CDHU e previsão de 1.536 e 234 unidades nas duas fases. A folha original 01/08 corresponde à página 1 deste PDF.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Loteamentos Dom Pedro I e Dom Pedro II relacionados a 1991.",
          "acesso": "4 out. 2026.",
          "pagina": "100 do PDF",
          "paginaPdf": 100
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Programa Minha Praça de Volta beneficia zona sul. São José dos Campos, 21 mar. 2017.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=26485",
          "nota": "Praça entre Dom Pedro II e Campo dos Alemães, junto à nascente do Senhorinha; depoimento de Francisca. A reforma estava em andamento na data da notícia.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-parque-interlagos",
      "nome": "Parque Interlagos",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento registrado em 1985",
      "origemNome": "“Interlagos” sugere uma referência à água e combina com a presença do lago que marca a paisagem local. A planta confirma a denominação, e a Prefeitura documenta o lago; essas fontes não esclarecem se ele motivou o nome desde o lançamento do empreendimento.",
      "historia": "Parque Interlagos aparece no estudo de urbanização de Gabriel Henrique dos Santos Ferreira, da Univap, entre os loteamentos de 1985 que ampliaram as moradias perto da Rodovia dos Tamoios. A planta geral identifica o empreendimento dentro do loteamento Jardim Torrão de Ouro. Nela, as ruas acompanham o contorno das quadras.\n\nO lago do Parque Ayrton Senna da Silva tornou-se uma referência de lazer no bairro. Em setembro de 2019, a Prefeitura anunciou ali uma edição do Conexão Juventude, com música e atividades para as famílias. Uma reportagem municipal de maio de 2025 descreve a pista de caminhada, a academia ao ar livre e a quadra ao redor do lago. Naquela data, um deck estava em construção, com acesso pela Rua Rogério Monteiro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As ruas e o lago do Interlagos",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Parque Interlagos entre os loteamentos de 1985 próximos à Rodovia dos Tamoios.",
          "acesso": "4 out. 2026.",
          "pagina": "103 do PDF",
          "paginaPdf": 103
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Parque Interlagos: planta geral. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/interlagos_pq_geral.pdf",
          "nota": "Quadro superior direito: Parque Interlagos e localização no loteamento Jardim Torrão de Ouro. Traçado geral do loteamento.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Interlagos recebe o Conexão Juventude neste domingo. São José dos Campos, 12 set. 2019.",
          "url": "https://www.sjc.sp.gov.br/noticias/2019/setembro/12/interlagos-recebe-o-conexao-juventude-neste-domingo/",
          "nota": "Programação no Parque Ayrton Senna da Silva, no bairro Parque Interlagos.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Prefeitura realiza manutenção e melhorias no Parque Interlagos. São José dos Campos, 8 maio 2025.",
          "url": "https://www.sjc.sp.gov.br/noticias/2025/maio/08/prefeitura-realiza-manutencao-e-melhorias-no-parque-interlagos/",
          "nota": "Descrição do lago, dos equipamentos e da construção do deck em maio de 2025. O anúncio não foi tratado como confirmação de entrega.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-cidade-morumbi",
      "nome": "Cidade Morumbi",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Planta de 1962; relatos de ocupação a partir de 1979",
      "origemNome": "O estudo registra o uso de “Cidade Morumbi” e “Jardim Morumbi”, mas não explica a escolha da palavra. A planta municipal também traz a denominação Cidade Morumbi. Esses documentos preservam o nome, mas não identificam quem o escolheu ou o que pretendia homenagear.",
      "historia": "Uma planta municipal datada de março de 1962 já registra o loteamento Cidade Morumbi. Um estudo de História e Geografia da Univap, publicado em 2014, reuniu fotografias e depoimentos sobre a ocupação do bairro nas décadas seguintes. Nos relatos apresentados, Benedito Oliveira, conhecido como Bentinho, aparece ligado ao loteamento das terras em 1979. Lotes de 300 metros quadrados eram frequentemente divididos entre dois compradores, formando terrenos de 150 metros quadrados. Muitos dos recém-chegados procuravam trabalho nas indústrias e uma maneira de sair do aluguel.\n\nAs primeiras casas começavam com poucos cômodos. Segundo os depoimentos reunidos no artigo, vizinhos se ajudavam em mutirões e recorriam a poços enquanto faltava infraestrutura. As ruas eram numeradas; depois receberam nomes de moradores. O estudo situa a chegada do asfalto e da rede de esgoto em 1988 e explica que Cidade Morumbi e Jardim Morumbi eram denominações usadas em partes da mesma região.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Lotes divididos e casas feitas em mutirão",
      "fontesRevisadas": [
        {
          "referencia": "SANCHES, Maiara; EDSON, Geraldo; COSTA, Sandra; ZANETTI, Valéria. História do Jardim Morumbi em São José dos Campos (1979 a 2014). In: ENCONTRO LATINO AMERICANO DE INICIAÇÃO CIENTÍFICA, 18., 2014, São José dos Campos. Anais [...]. São José dos Campos: Universidade do Vale do Paraíba, 2014. p. 1–5.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/08/Hist%C3%B3ria-do-Jardim-Morumbi-em-S%C3%A3o-Jos%C3%A9-dos-Campos.pdf",
          "nota": "Seção Resultados: loteamento, divisão de lotes e autoconstrução, com depoimentos identificados nas referências. O resumo menciona 1962, enquanto a introdução e os resultados trabalham com 1979; não foi fixada uma data única de fundação.",
          "acesso": "4 out. 2026.",
          "pagina": "2 do PDF",
          "paginaPdf": 2
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Cidade Morumbi: planta. São José dos Campos, mar. 1962. 1 planta. Folha 1.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/morumbi_cid_fl01.pdf",
          "nota": "Quadro de identificação: loteamento Cidade Morumbi e data março de 1962. A denominação já aparece antes dos relatos de ocupação a partir de 1979.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote1",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-colonial",
      "nome": "Jardim Colonial",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento de 1958",
      "origemNome": "Colonial remete ao período colonial e já identifica o loteamento nos estudos de sua formação. Essa associação histórica é uma leitura do nome; as fontes reunidas não explicam a escolha nem a relacionam à arquitetura das casas.",
      "historia": "O Jardim Colonial foi loteado em 1958, numa área que ainda ficava afastada do tecido urbano mais contínuo. Gabriel Ferreira, da Univap, situa o bairro no extremo sul da cidade daquele período. Uma planta posterior, de retificação, mostra as muitas quadras residenciais e a ligação com o Jardim Imperial. O documento é de 1980 e representa uma etapa de revisão do loteamento, não sua fundação.\n\nA feira de domingo tornou-se parte importante da vida local. Na dissertação de 2010, Sueli Pereira Lacerda estudou a convivência entre a feira livre e o comércio dos ambulantes nas vias Ângelo Belmiro Pintus e José Ribeiro Bastos. Em uma reportagem de junho de 2026, o feirante Antônio Vicente contou que trabalha no Colonial desde 1985, acompanhado na banca pela mulher, Maria Lúcia, e pelo filho, Rodolfo.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Das ruas do loteamento à feira de domingo",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Jardim Colonial loteado em 1958 e localização afastada da urbanização contínua.",
          "acesso": "4 out. 2026.",
          "pagina": "68 do PDF",
          "paginaPdf": 68
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Projeto para retificação do Jardim Colonial. São José dos Campos, 1980. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/colonial_jd.pdf",
          "nota": "Quadro de identificação datado de 7 de fevereiro de 1980; quadras residenciais e limites com o Jardim Imperial.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "LACERDA, Sueli Pereira. Entre tabuleiros, barracas e megafones: Mega Feira no Jardim Colonial de São José dos Campos (SP), um retrato da informalidade urbana. 2010. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2010.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/04/Entre-Tabuleiros-Barracas-e-Megafones-Mega-Feira-no-Jardim-Colonial-de-S%C3%A3o-Jos%C3%A9-dos-Campos-SP-Um-Retrato-da-Informalidade-Urbana.pdf",
          "nota": "Pesquisa de campo sobre a feira livre e os ambulantes; localização e organização do comércio.",
          "acesso": "4 out. 2026.",
          "pagina": "53–55 do PDF",
          "paginaPdf": 53
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Prefeitura legaliza mais de 840 feirantes do Colonial e Barganha. São José dos Campos, 28 jun. 2026.",
          "url": "https://www.sjc.sp.gov.br/noticias/2026/junho/28/prefeitura-legaliza-mais-de-840-feirantes-do-colonial-e-barganha/",
          "nota": "Depoimento de Antônio Vicente sobre sua atuação desde 1985 e trabalho com Maria Lúcia e Rodolfo. O total do título reúne duas feiras, não apenas a do Colonial.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-imperial",
      "nome": "Jardim Imperial",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento do final dos anos 1950",
      "origemNome": "A palavra Imperial se refere a império. No bairro, essa leitura ganha contexto nas ruas com nomes de monarcas, registradas na planta. O conjunto sugere um tema histórico para a denominação, sem permitir afirmar quem o propôs ou qual episódio teria motivado a escolha.",
      "historia": "O Jardim Imperial surgiu no final dos anos 1950, na mesma expansão urbana que levou os loteamentos para além da área mais ocupada da cidade. A dissertação de Gilberto Alves da Cunha, da Univap, estuda sua formação junto à do Colonial e do Portugal. Na planta municipal, Imperial e Colonial aparecem como vizinhos, e as ruas guardam referências como Dom João VI, Dom Pedro I e Dom Pedro II.\n\nOs dois bairros também compartilharam uma associação de moradores. Em setembro de 1985, um decreto concedeu à Sociedade Amigos de Bairro do Jardim Imperial e Colonial a permissão de usar uma área municipal no Colonial para construir sua sede. O registro confirma a organização conjunta das comunidades e o projeto de um espaço próprio para a entidade; não comprova, sozinho, a conclusão da obra.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O Imperial e a organização dos bairros vizinhos",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Imperial e Colonial na expansão descontínua dos anos 1950. O texto traz 1958; a tabela na página 60 do PDF traz 1959 para o Imperial. Foi adotado o período, sem fixar uma fundação.",
          "acesso": "4 out. 2026.",
          "pagina": "40 do PDF (p. 37 da obra)",
          "paginaPdf": 40
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Imperial: planta de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/imperial_jd.pdf",
          "nota": "Ruas Dom João VI, Dom Pedro I e Dom Pedro II; proximidade com o Colonial.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Decreto nº 5.191, de 13 de setembro de 1985. Permite o uso de área de domínio público municipal pela Sociedade Amigos de Bairro do Jardim Imperial e Colonial. São José dos Campos, 1985.",
          "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/1985/5191.pdf",
          "nota": "Entidade dos dois bairros; área no Colonial; artigo 2º destina o terreno à construção da sede própria.",
          "acesso": "4 out. 2026.",
          "pagina": "1–2 do PDF",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-bosque-dos-ipes",
      "nome": "Bosque dos Ipês",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento aprovado em 1997",
      "origemNome": "Ipês são árvores conhecidas por suas floradas. O nome do residencial evoca essa paisagem, e o projeto documenta a reserva de áreas verdes. Isso não basta para afirmar que um bosque de ipês ocupava originalmente o terreno ou que uma determinada espécie deu origem à denominação.",
      "historia": "O Residencial Bosque dos Ipês foi aprovado em 1997, com 1.120 lotes, segundo a relação municipal. Em maio de 1999, um decreto registrava que as obras de infraestrutura ainda estavam em andamento. O documento descreve lotes com área média de 300 metros quadrados e áreas verdes acima do mínimo exigido na legislação. São informações do projeto e de sua implantação, não uma descrição de todas as casas atuais.\n\nA escola também passou a guardar histórias do bairro. Em outubro de 2025, os alunos da Emei Professor José Sodero Bitencourt participaram de um acampamento no espaço escolar. A reportagem municipal conta que a ideia veio das próprias crianças: queriam montar barracas e passar uma noite com os colegas. As famílias participaram da preparação da atividade.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O projeto das casas e as histórias da escola",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Loteamentos aprovados: relação atualizada em 17 de setembro de 2024. São José dos Campos, 2024.",
          "url": "https://siteprefeitura.sjc.sp.gov.br/media/293012/2024_09_17_tabela-de-loteamentos-aprovados-1.pdf",
          "nota": "Residencial Bosque dos Ipês: aprovação em 1997, 1.120 lotes.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Decreto nº 9.701, de 27 de maio de 1999. Estabelece o zoneamento do loteamento Residencial Bosque dos Ipês. São José dos Campos, 1999.",
          "url": "https://www.sjc.sp.gov.br/legislacao/Decretos/1999/9701.pdf",
          "nota": "Situação das obras em 1999, quantidade de lotes, área média e áreas verdes.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Acampamento na escola realiza sonhos de alunos. São José dos Campos, 14 out. 2025.",
          "url": "https://www.sjc.sp.gov.br/noticias/2025/outubro/14/acampamento-na-escola-realiza-sonhos-de-alunos/",
          "nota": "Acampamento na Emei Professor José Sodero Bitencourt e participação das crianças e famílias.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-parque-uniao",
      "nome": "Parque União",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Loteamento aprovado em 1990",
      "origemNome": "União sugere uma ideia de convivência e é a denominação registrada na planta e na aprovação do parque residencial. O significado da palavra é uma interpretação possível; os documentos não explicam a escolha do nome.",
      "historia": "O Parque Residencial União foi aprovado em 1990, com 1.495 lotes, segundo a relação de loteamentos da Prefeitura. A pesquisa de Gabriel Henrique dos Santos Ferreira, da Univap, situa sua implantação entre o Cidade Morumbi e o Campo dos Alemães. O bairro faz parte da expansão residencial da região sul no começo daquela década.\n\nA planta municipal ainda identifica a área como Colônia Paraíso, denominação territorial usada antes de vários dos bairros atuais. No desenho, quadras compridas se distribuem ao redor de espaços reservados para usos institucionais e áreas verdes. A Rua Gisele Martins aparece no limite do loteamento. Esses registros ajudam a localizar o União no crescimento da região e a reconhecer o traçado previsto para suas ruas.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As quadras entre o Morumbi e o Campo dos Alemães",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Loteamentos aprovados: relação atualizada em 17 de setembro de 2024. São José dos Campos, 2024.",
          "url": "https://siteprefeitura.sjc.sp.gov.br/media/293012/2024_09_17_tabela-de-loteamentos-aprovados-1.pdf",
          "nota": "Parque Residencial União: aprovação em 1990, 1.495 lotes.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Loteamento de 1990 entre Cidade Morumbi e Campo dos Alemães.",
          "acesso": "4 out. 2026.",
          "pagina": "103 do PDF",
          "paginaPdf": 103
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Parque Residencial União: planta de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/uniao_pq_resid.pdf",
          "nota": "Localização na Colônia Paraíso; disposição das quadras, áreas institucionais e verdes; Rua Gisele Martins.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-pinheirinho-palmares",
      "nome": "Pinheirinho dos Palmares",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Reassentamento e entrega das casas em 2016",
      "origemNome": "Pinheirinho conserva a referência à comunidade de onde vieram muitas das famílias. Palmares remete ao nome associado historicamente à resistência negra. A ligação do reassentamento com o antigo Pinheirinho está documentada; a interpretação de Palmares como símbolo de resistência não equivale a um ato oficial explicando a escolha.",
      "historia": "A história do Pinheirinho dos Palmares começa com a desocupação do antigo Pinheirinho, na zona sul, em janeiro de 2012. As famílias passaram por anos de espera até a entrega das casas do novo residencial, em dezembro de 2016. O novo bairro fica na zona sudeste: não ocupa o mesmo terreno da antiga comunidade.\n\nEm outubro de 2016, uma reportagem municipal acompanhou as visitas das famílias às casas e informou que o empreendimento atenderia 1.461 famílias. No ano seguinte, um relato da Diocese descreveu o início da comunidade religiosa Santa Teresa de Calcutá, vinculada à Paróquia Santa Luzia, do Putim. Sem uma igreja pronta, os primeiros encontros aconteciam num bar cedido para as celebrações. São registros de como os moradores começaram a organizar a vida no novo endereço.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Do antigo Pinheirinho às casas na Zona Sudeste",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Famílias visitam casa e aprovam o novo Pinheirinho dos Palmares. São José dos Campos, 20 out. 2016.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=25863",
          "nota": "Visitas às casas, previsão de atendimento a 1.461 famílias e localização do novo empreendimento.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Pinheirinho: o início de uma nova história. São José dos Campos, 15 maio 2017.",
          "url": "https://diocese-sjc.org.br/pinheirinho-o-inicio-de-uma-nova-historia/",
          "nota": "Desocupação de janeiro de 2012, entrega de chaves em dezembro de 2016 e início da comunidade Santa Teresa de Calcutá.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. População: setores socioeconômicos e regiões. São José dos Campos, [s. d.].",
          "url": "https://www.sjc.sp.gov.br/servicos/governanca/populacao/",
          "nota": "Pinheirinho dos Palmares no setor 29.09, região sudeste. Usada para corrigir a região do card, sem alterar a memória da antiga ocupação na zona sul.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-torrao-de-ouro",
      "nome": "Torrão de Ouro",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Expansão habitacional registrada em 1985",
      "origemNome": "Torrão de Ouro sugere uma terra considerada valiosa. Essa leitura da expressão é possível, mas não constitui um relato de sua origem. A pesquisa documenta o nome dos núcleos habitacionais; o motivo da escolha permanece sem uma explicação direta nas fontes.",
      "historia": "Torrão de Ouro aparece na pesquisa de urbanização de Gabriel Henrique dos Santos Ferreira, da Univap, entre os loteamentos de 1985 próximos à Rodovia dos Tamoios. O estudo relaciona essa expansão habitacional ao destino de famílias retiradas da área conhecida como Linha Velha. Essa formação precisa ser distinguida das regularizações posteriores dos diferentes núcleos que usam o nome Torrão de Ouro.\n\nA busca pelo documento da casa ainda aparece em relatos recentes. Em maio de 2024, uma reportagem da Prefeitura registrou a entrega de títulos a moradores do Torrão de Ouro e da Capuava. Marcos Malaquias dos Santos, da Travessa dos Coqueiros, contou que havia comprado o terreno, pago e construído, mas ainda precisava da documentação. Juliana Aparecida Frederighi Ribeiro relatou uma espera de mais de vinte anos.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As moradias e a longa busca pelo documento da casa",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Torrão de Ouro entre os loteamentos de 1985 e relação com famílias removidas da Linha Velha.",
          "acesso": "4 out. 2026.",
          "pagina": "103 do PDF",
          "paginaPdf": 103
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Torrão de Ouro e Capuava recebem títulos de regularização. São José dos Campos, 9 maio 2024.",
          "url": "https://www.sjc.sp.gov.br/noticias/2024/maio/09/torrao-de-ouro-e-capuava-recebem-titulos-de-regularizacao/",
          "nota": "Depoimentos identificados de Marcos Malaquias dos Santos e Juliana Aparecida Frederighi Ribeiro. A entrega abrange dois núcleos; não foi usada como data de fundação do bairro.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-chacaras-reunidas",
      "nome": "Chácaras Reunidas",
      "regiaoId": "sul",
      "regiaoNome": "Zona Sul",
      "periodo": "Expansão junto à Dutra; associação empresarial criada em 1993",
      "origemNome": "Chácaras Reunidas remete a um conjunto de chácaras e é o nome registrado na planta do loteamento. Os lotes grandes dão contexto à denominação. O documento, porém, não identifica quais propriedades anteriores teriam sido reunidas.",
      "historia": "A planta das Chácaras Reunidas mostra lotes grandes e identifica como proprietário o doutor Francisco L. Quartim Barbosa. O mapa situa o loteamento junto à Rodovia Presidente Dutra. Na pesquisa de Gabriel Ferreira, da Univap, essa localização aparece ligada à instalação de indústrias entre Jacareí e o Parque Industrial.\n\nA história publicada pela Assecre conta que as tentativas de ocupação residencial deram lugar a pequenas e médias empresas. A associação empresarial foi criada em 1993, em parceria com a Sociedade Amigos de Bairro, para buscar melhorias na infraestrutura. Esse relato da própria entidade ajuda a entender a mudança de uso do lugar e os interesses compartilhados por empresas, trabalhadores e moradores, sem reduzir o bairro apenas às fábricas.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Das chácaras ao bairro de pequenas indústrias",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Chácaras Reunidas: planta de loteamento. São José dos Campos, [s. d.]. 1 planta.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/chacaras_reunidas.pdf",
          "nota": "Denominação do empreendimento, proprietário identificado como Dr. Francisco L. Quartim Barbosa, lotes e localização junto à Dutra.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Chácaras Reunidas no crescimento industrial junto à Dutra, entre Jacareí e o Parque Industrial.",
          "acesso": "4 out. 2026.",
          "pagina": "74 do PDF",
          "paginaPdf": 74
        },
        {
          "referencia": "ASSOCIAÇÃO DOS EMPRESÁRIOS DO CHÁCARAS REUNIDAS. Nossa história. São José dos Campos: Assecre, [s. d.].",
          "url": "https://www.assecre.org.br/nossa-historia/",
          "nota": "Histórico institucional: mudança de ocupação, criação da associação em 1993 e parceria com a Sociedade Amigos de Bairro. A narrativa foi atribuída à própria entidade.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sul-2026-10-04-lote2",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-eugenio-melo",
      "nome": "Eugênio de Melo (Distrito)",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Estação ferroviária em 1877; distrito criado em 1934",
      "origemNome": "O nome homenageia Eugênio de Melo, construtor e ex-diretor da Estrada de Ferro Dom Pedro II, como registra o Jornal do Consumidor, publicado pela Prefeitura. A homenagem ferroviária substituiu a antiga denominação ligada aos cafezais.",
      "historia": "Antes de ser Eugênio de Melo, o povoado era conhecido como Vila de Nossa Senhora dos Cafezais. O café explica esse primeiro nome e também a importância da ferrovia: a estação, inaugurada em 1877, ajudava a levar a produção da região para outros mercados. Em 31 de agosto de 1934, a vila foi oficialmente transformada em distrito de São José dos Campos.\n\nA paisagem mudou com a indústria. A pesquisa de Gabriel Ferreira, da Univap, registra a instalação da Hitachi em 1972 e da Engesa e da Ericsson em 1973. As antigas lavouras passaram a dividir espaço com fábricas e novos bairros. A memória rural continuou presente na cultura local: a Casa de Cultura Rancho do Tropeiro recebeu o nome de Ernesto Villela, trabalhador rural, contador de histórias e mestre de calango, uma forma de canto com versos improvisados.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O café, a estação e a chegada das fábricas",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Programação especial no aniversário de Eugênio de Melo. São José dos Campos, 20 ago. 2015.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=21643",
          "nota": "Denominação Nossa Senhora dos Cafezais, estação em 1877 e criação do distrito em 31/08/1934.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Distrito de Eugênio de Melo comemora 126 anos de existência com muita festa. Jornal do Consumidor, São José dos Campos, n. 515, 23–29 ago. 2003, p. 3.",
          "url": "https://servicos.sjc.sp.gov.br/governo/jconsumidorflip/downloads/JConsu_515.pdf",
          "nota": "Homenagem a Eugênio de Melo, construtor e ex-diretor da Estrada de Ferro Dom Pedro II; café e ferrovia.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Instalação da Hitachi em 1972 e da Engesa e Ericsson em 1973, no distrito.",
          "acesso": "4 out. 2026.",
          "pagina": "83 do PDF",
          "paginaPdf": 83
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Casa de Cultura Rancho do Tropeiro tem programação especial. São José dos Campos, 10 ago. 2017.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=27697",
          "nota": "Ernesto Villela: trabalhador rural, contador de histórias e mestre de calango; patrono da casa de cultura.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-galo-branco",
      "nome": "Galo Branco",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Venda de lotes relatada em 1982; aprovação registrada em 1995",
      "origemNome": "Segundo Madalena Fernandes Gil, o dono da antiga fazenda, Antônio Benedito Machado Florence, colecionava imagens e estátuas de galos brancos e deu esse nome à propriedade. O bairro herdou a denominação. É uma memória publicada e atribuída a Madalena, não um decreto que explique a escolha.",
      "historia": "O Residencial Galo Branco nasceu nas terras da fazenda de mesmo nome, perto da divisa com Caçapava. Madalena Fernandes Gil, que comprou um lote ali em 1983, conta que as vendas começaram em 15 de novembro de 1982. Seu relato foi publicado pela Nova Freitas, antiga Possidônio & Filhos, imobiliária que participou do loteamento. A lembrança coincide com o início do bairro em 1982 registrado na pesquisa de Gabriel Ferreira, da Univap.\n\nA história da ocupação e a documentação do loteamento têm datas diferentes. A tabela municipal registra a aprovação do Galo Branco em 1995, com 2.059 lotes. A memória da fazenda também aparece na história religiosa: a Diocese registra uma capela de São Benedito construída nos anos 1950 e a atuação do cônego Gouvêa na organização da comunidade. A paróquia foi instalada em 2009.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "A fazenda que virou endereço de muitas famílias",
      "fontesRevisadas": [
        {
          "referencia": "NOVA FREITAS IMÓVEIS. O nascimento do bairro Residencial Galo Branco. In: Mercado. São José dos Campos, [s. d.].",
          "url": "https://www.novafreitas.com.br/pagina/mercado-4",
          "nota": "Reprodução do relato de Madalena Fernandes Gil, da página Resgatando a História do Galo Branco — SJC: primeiras vendas em 1982, compra em 1983 e origem do nome da fazenda. História oral publicada, com narradora identificada.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Residencial Galo Branco situado nas terras da antiga fazenda, com loteamento indicado em 1982.",
          "acesso": "4 out. 2026.",
          "pagina": "101 do PDF",
          "paginaPdf": 101
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Tabela de loteamentos aprovados. São José dos Campos, 17 set. 2024.",
          "url": "https://www.sjc.sp.gov.br/media/35fk2ujz/2024_09_17_tabela-de-loteamentos-aprovados-1.pdf",
          "nota": "Galo Branco: aprovação em 1995 e 2.059 lotes. Essa data administrativa é distinta do início das vendas e da ocupação relatado em 1982.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia São Benedito. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 52.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "Capela de São Benedito na fazenda nos anos 1950, atuação do cônego Gouvêa e instalação da paróquia em 17/05/2009.",
          "acesso": "4 out. 2026.",
          "pagina": "52 do PDF",
          "paginaPdf": 52
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-vista-verde",
      "nome": "Cidade Vista Verde",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Planejamento em 1972; primeiras casas entregues em 1973",
      "origemNome": "Vista Verde combina com a proposta de um bairro arborizado, com jardins diante das casas. Essa associação é uma leitura do nome e do projeto descrito nas fontes. A Saviver e o estudo da Univap documentam o planejamento, mas não identificam quem escolheu a denominação.",
      "historia": "O Vista Verde começou a ser construído em 1972, numa área da antiga Fazenda Santa Fé. A Ibecasa, ligada ao grupo americano IBEC, vendia casas prontas e financiadas para uma cidade que recebia trabalhadores de novas indústrias. Um artigo da Univap encontrou no jornal Agora, de janeiro de 1974, o perfil dos primeiros compradores: muitos eram engenheiros e técnicos da General Motors, do CTA e da Embraer.\n\nA Sociedade Amigos da Cidade Vista Verde, a Saviver, guarda outra parte dessa história. Segundo a associação, as chaves das primeiras cem casas foram entregues em 20 de março de 1973. Depois vieram o centro comercial e o clube. As casas com jardins e a proposta de frentes sem muros davam ao bairro um aspecto diferente. Enquanto as obras avançavam, os moradores se reuniam na pequena capela de madeira da Rua Colômbia para organizar a construção da igreja.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um bairro planejado para quem chegava às indústrias",
      "fontesRevisadas": [
        {
          "referencia": "RIBEIRO, Jéssica Marques; DUARTE, Pedro Henrique de Oliveira. Cidade Vista Verde: um bairro planejado em São José dos Campos, SP. In: ENCONTRO LATINO AMERICANO DE INICIAÇÃO CIENTÍFICA, 16., 2012, São José dos Campos. Anais [...]. São José dos Campos: Univap, 2012.",
          "url": "https://www.inicepg.univap.br/cd/INIC_2012/anais/arquivos/RE_0883_0513_01.pdf",
          "nota": "Planejamento em 1972, antiga Fazenda Santa Fé, Ibecasa e perfil dos compradores divulgado no jornal Agora de 09/01/1974. O artigo também menciona inauguração em 1974; não confundir com a primeira entrega de chaves em 1973.",
          "acesso": "4 out. 2026.",
          "pagina": "1–3 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SOCIEDADE AMIGOS DA CIDADE VISTA VERDE. Resumo da história do bairro Vista Verde: 43 anos. São José dos Campos, 20 mar. 2016.",
          "url": "https://www.saviver.org/o-bairro/",
          "nota": "História publicada pela associação: primeiras cem casas em 20/03/1973, clube, comércio e reuniões na capela da Rua Colômbia.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Padrão das casas, frentes sem muros e arborização no projeto do Cidade Vista Verde.",
          "acesso": "4 out. 2026.",
          "pagina": "89 do PDF",
          "paginaPdf": 89
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-novo-horizonte",
      "nome": "Parque Novo Horizonte",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Inaugurado em 24 de setembro de 1978",
      "origemNome": "Novo Horizonte é o nome dado ao loteamento de 1978. A expressão pode ser entendida como a expectativa de uma nova vida para as famílias que buscavam casa própria. É uma interpretação do nome à luz da história do projeto; os registros consultados não atribuem a escolha a uma pessoa.",
      "historia": "Em 24 de setembro de 1978, uma missa ao ar livre marcou a inauguração do Parque Novo Horizonte. O bairro ocupava terras da antiga Fazenda Santa Emília. Seu projeto previa quinhentas casas para trabalhadores da construção civil que não possuíam imóvel, inscritos no Plano Mutirão do sindicato da categoria. A proposta era permitir que essas famílias tivessem sua própria moradia.\n\nEssa origem aparece nas ruas dos Pedreiros, dos Carpinteiros e dos Eletricistas, já desenhadas na planta municipal. A Praça Primeiro de Maio leva a data do Dia do Trabalhador. O padre Gustavo Munhoz, em artigo publicado pela Diocese, conta que as missas campais nessa data se tornaram uma tradição da comunidade. Também registra a primeira capela, construída onde depois ficou a UPA, e o início da igreja na praça central. Em dezembro de 1990, a comunidade passou a ser a Paróquia Coração Eucarístico de Jesus.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O bairro construído para os trabalhadores",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Antiga Fazenda Santa Emília; a descrição do Plano Mutirão e das quinhentas casas continua na página 90.",
          "acesso": "4 out. 2026.",
          "pagina": "89 do PDF",
          "paginaPdf": 89
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Plano Mutirão do sindicato, quinhentas casas destinadas a trabalhadores sem imóvel e criação do bairro em setembro de 1978.",
          "acesso": "4 out. 2026.",
          "pagina": "90 do PDF",
          "paginaPdf": 90
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Parque Novo Horizonte: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/novo_horizonte_pq_fl01.pdf",
          "nota": "Nomes das profissões nas vias e Praça Primeiro de Maio; planta do arruamento.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SOUSA, Gustavo Munhoz de. Paróquia Coração Eucarístico de Jesus completa 30 anos de história. São José dos Campos: Diocese de São José dos Campos, 15 dez. 2020.",
          "url": "https://diocese-sjc.org.br/paroquia-coracao-eucaristico-de-jesus-completa-30-anos-de-historia/",
          "nota": "Inauguração do bairro em 24/09/1978, missas campais do Dia do Trabalhador, primeira capela e criação da paróquia em 15/12/1990.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-santa-herminia",
      "nome": "Santa Hermínia",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Capela antiga; registro do loteamento em 2014",
      "origemNome": "Santa Hermínia já aparece como denominação na planta de regularização do bairro. A capela antiga é dedicada a São Benedito. As fontes não relacionam o nome do loteamento a essa devoção nem identificam uma Hermínia homenageada; por isso, essa hipótese de homenagem permanece sem confirmação.",
      "historia": "A história da região onde fica o Santa Hermínia começou antes das ruas do loteamento. Em artigo de 2020, o padre Gustavo Munhoz registra uma capela de São Benedito ali com cerca de cem anos de existência. Era uma das comunidades atendidas pela paróquia de Eugênio de Melo, num tempo em que as distâncias entre as capelas rurais dificultavam o trabalho do padre.\n\nA formação do bairro residencial trouxe outra necessidade: regularizar os terrenos e conseguir infraestrutura. Em outubro de 2014, a Prefeitura informou que o registro do loteamento havia sido emitido e que preparava a documentação individual para 867 famílias. As obras incluíam esgoto, drenagem e pavimentação. Na notícia, a moradora Rosilene Bezerra Gomes da Silva contou que o barro às vezes a obrigava a voltar para casa e trocar de roupa antes de levar os filhos à escola. É um retrato do que a chegada do asfalto significava naquele momento.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "A capela antiga e a conquista das ruas asfaltadas",
      "fontesRevisadas": [
        {
          "referencia": "SOUSA, Gustavo Munhoz de. Paróquia Coração Eucarístico de Jesus completa 30 anos de história. São José dos Campos: Diocese de São José dos Campos, 15 dez. 2020.",
          "url": "https://diocese-sjc.org.br/paroquia-coracao-eucaristico-de-jesus-completa-30-anos-de-historia/",
          "nota": "Capela São Benedito no atual Santa Hermínia, com idade aproximada de cem anos em 2020. Não é uma data de fundação do bairro residencial.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Regularização do bairro Santa Hermínia: processo entra em sua fase final. São José dos Campos, 16 out. 2014.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=18572",
          "nota": "Registro definitivo do loteamento, documentação de 867 famílias, obras e depoimento identificado de Rosilene Bezerra Gomes da Silva. A reportagem anuncia etapas seguintes, não a entrega de todos os títulos.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Santa Hermínia: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/santa-herminia.pdf",
          "nota": "Projeto municipal de regularização fundiária, com localização no Bairro Mato Dentro e denominação Santa Hermínia.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF (folha 1/1 da planta)",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-mariana",
      "nome": "Jardim Mariana I & II",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Mariana I aprovado em 1997; Mariana II em 1999",
      "origemNome": "Mariana já aparece no projeto da primeira etapa, de 1996, e foi mantido no loteamento seguinte. É um nome pessoal feminino, mas a planta não identifica uma pessoa homenageada. Os documentos permitem acompanhar sua adoção nas duas etapas, sem esclarecer a razão da escolha.",
      "historia": "O Jardim Mariana se formou em duas etapas no fim dos anos 1990. A tabela da Prefeitura registra o Residencial Jardim Mariana em 1997, com 514 lotes, e o Jardim Mariana II em 1999, com 743. A planta da primeira etapa é de 1996 e situa o empreendimento junto à Estrada Municipal do Cajuru. O desenho mostra os terrenos destinados às casas, as novas ruas e as áreas reservadas para equipamentos públicos e espaços verdes.\n\nA segunda etapa ampliou essa ocupação. Sua planta identifica Toru Sanefuji como proprietário e indica uma área entre Cajuru, Mato Dentro, Faxinal e Ressaca. Mais adiante, a relação com os espaços de lazer aparece no livro do Ecomuseu dos Campos de São José: o Parque Alambari abrange o Campos de São José e o Mariana II, ajudando a proteger o córrego. Em setembro de 2025, a Prefeitura anunciou para o Jardim Mariana um novo parque esportivo, com quadras, brinquedos e pista de caminhada.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Dois loteamentos junto à Estrada do Cajuru",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Tabela de loteamentos aprovados. São José dos Campos, 17 set. 2024.",
          "url": "https://www.sjc.sp.gov.br/media/35fk2ujz/2024_09_17_tabela-de-loteamentos-aprovados-1.pdf",
          "nota": "Residencial Jardim Mariana: 1997, 514 lotes. Jardim Mariana II: 1999, 743 lotes. Localização indicada no Cajuru.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Mariana: planta de loteamento. São José dos Campos, 1996.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/mariana_jd.pdf",
          "nota": "Planta datada de 1996, junto à Estrada Municipal do Cajuru; áreas verdes e institucional. Data do desenho distinta da aprovação de 1997.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF (folha 1/7 da planta)",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Mariana II: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/jardim-mariana-2.pdf",
          "nota": "Proprietário Toru Sanefuji; localização nos bairros Cajuru, Mato Dentro, Faxinal e Ressaca.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF (folha 2/6 da planta)",
          "paginaPdf": 1
        },
        {
          "referencia": "SANTOS, Maria Siqueira (coord.). Ecomuseu dos Campos de São José: entre memórias e perspectivas. São José dos Campos: Centro de Estudos da Cultura Popular, 2020.",
          "url": "https://ecomuseu.org.br/wp-content/uploads/2025/05/02-LIVRO_-ECOMUSEU-CSJ-ENTRE-MEMORIAS-E-PERSPECTIVAS.pdf",
          "nota": "Legenda do mapa do Campos de São José: Parque Alambari abrangendo também o Jardim Mariana II e protegendo o córrego.",
          "acesso": "4 out. 2026.",
          "pagina": "21 do PDF (p. 19 da obra)",
          "paginaPdf": 21
        },
        {
          "referencia": "LEMES, Lucas. Prefeitura anuncia construção de parque no Jardim Mariana. São José dos Campos: Prefeitura Municipal, 15 set. 2025.",
          "url": "https://www.sjc.sp.gov.br/noticias/2025/setembro/15/prefeitura-anuncia-construcao-de-parque-no-jardim-mariana/",
          "nota": "Anúncio de parque esportivo em 2025, com quadras, brinquedos e pista de caminhada; a fonte apresenta o projeto e o cronograma previsto.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-sao-judas-tadeu",
      "nome": "São Judas Tadeu",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Projeto e aprovação registrados em 1980",
      "origemNome": "São Judas Tadeu é uma referência ao santo católico, e a denominação já consta no projeto de 1980. A planta não explica a escolha. O Santuário São Judas Tadeu fica no Jardim Paulista; sua história não deve ser confundida com a formação deste bairro da Zona Sudeste.",
      "historia": "O Jardim São Judas Tadeu pertence à Zona Sudeste. Sua planta, datada de 11 de janeiro de 1980, situa o empreendimento no antigo bairro da Pernambucana e identifica a empresa D.F. Comércio Empreendimentos e Participações Ltda. como proprietária. O projeto desenha uma sequência de quadras residenciais, avenidas e áreas reservadas para lazer. A dissertação de Gilberto Alves da Cunha, da Univap, inclui o São Judas Tadeu entre os loteamentos aprovados naquele ano.\n\nA Avenida São Nicolau aparece como uma das referências do traçado. Décadas depois, a vida do bairro também pode ser acompanhada pelos registros da escola municipal Artur Aparecido da Rosa. Em agosto de 2026, uma reportagem da Prefeitura sobre melhorias na unidade registrou a visita de familiares do patrono, incluindo sua neta, que estudava ali. A notícia confirma a localização do bairro na região sudeste e mostra a ligação entre a escola e as famílias da comunidade.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O loteamento nas antigas terras da Pernambucana",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim São Judas Tadeu: planta de loteamento. São José dos Campos, 1980.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/judas_tadeu_jd_sao.pdf",
          "nota": "Projeto de 11/01/1980; localização no bairro Pernambucana, proprietária D.F. Comércio Empreendimentos e Participações Ltda., Avenida São Nicolau e áreas de lazer.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "São Judas Tadeu entre os loteamentos aprovados em 1980.",
          "acesso": "4 out. 2026.",
          "pagina": "43 do PDF (p. 40 da obra)",
          "paginaPdf": 43
        },
        {
          "referencia": "NIQUIRILO, Fernanda. Emei do São Judas recebe selo de Educação 5.0. São José dos Campos: Prefeitura Municipal, 22 ago. 2026.",
          "url": "https://sjc.sp.gov.br/noticias/2026/agosto/22/emei-do-sao-judas-recebe-selo-de-educacao-50/",
          "nota": "Emei Artur Aparecido da Rosa, visita dos familiares do patrono e identificação explícita do Jardim São Judas Tadeu como bairro da região sudeste.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia São Judas Tadeu — Santuário. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 51.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "História do santuário no Jardim Paulista. Fonte usada para distinguir a instituição religiosa do bairro, sem atribuir a ela a origem do loteamento.",
          "acesso": "4 out. 2026.",
          "pagina": "51 do PDF",
          "paginaPdf": 51
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-cerejeiras",
      "nome": "Jardim Cerejeiras",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Planta aprovada em março de 1982",
      "origemNome": "A denominação Jardim das Cerejeiras já está escrita na planta de 1982 e remete à árvore. O documento não diz se havia cerejeiras no terreno ou se o nome foi escolhido por outra razão. A identificação de Kohei Wakamatsu como proprietário não basta para afirmar uma homenagem à imigração japonesa.",
      "historia": "O Jardim das Cerejeiras foi projetado numa área que a planta municipal chama de bairro do Bairrinho. Kohei Wakamatsu aparece como proprietário, e o carimbo registra a aprovação do desenho em março de 1982. O empreendimento previa 812 lotes em 37 quadras, além de áreas para lazer e equipamentos públicos. Era mais uma parte da expansão residencial da Zona Leste no início dos anos 1980.\n\nAs ruas do projeto eram identificadas por números. Com o bairro ocupado, outros espaços passaram a servir de ponto de encontro. Em 12 de março de 2021, a comunidade ganhou uma feira livre na Avenida Oito de Dezembro, inicialmente com treze barracas. A reportagem da Prefeitura registra o entusiasmo dos feirantes com o novo local de trabalho durante a pandemia. A feira reuniu alimentos e serviços, de frutas e pastéis ao conserto de panelas, atendendo também os bairros próximos.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As quadras do Bairrinho e a feira da comunidade",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim das Cerejeiras: planta de loteamento. São José dos Campos, 1982.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/cerejeiras_jd.pdf",
          "nota": "Leitura visual: proprietário Kohei Wakamatsu; bairro do Bairrinho; 812 lotes, 37 quadras; carimbo de aprovação em 04/03/1982. Ruas numeradas, áreas institucional e de lazer.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF (folha 01 da planta)",
          "paginaPdf": 1
        },
        {
          "referencia": "SOUZA, Cláudio. Moradores da região leste ganham mais uma feira livre. São José dos Campos: Prefeitura Municipal, 12 mar. 2021.",
          "url": "https://www.sjc.sp.gov.br/noticias/2021/marco/12/moradores-da-regiao-leste-ganham-mais-uma-feira-livre/",
          "nota": "Início da feira no Jardim das Cerejeiras em 12/03/2021, Avenida Oito de Dezembro, treze barracas e serviços. A página foi atualizada em 2024; o fato narrado é de 2021.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-vila-tatetuba",
      "nome": "Vila Tatetuba",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Nome rural nos anos 1920; loteamento nos anos 1950",
      "origemNome": "O loteamento conservou Tatetuba, nome que já identificava a região rural antes de suas ruas serem abertas. A documentação permite acompanhar essa permanência desde os anos 1920. O significado da palavra, porém, não é estabelecido pelos registros históricos reunidos aqui.",
      "historia": "Tatetuba já era nome de uma região rural de São José dos Campos nos anos 1920. A vila residencial se formou depois, com a abertura de loteamentos perto da nova Via Dutra. A dissertação de Gilberto Alves da Cunha registra a aprovação da Vila Tatetuba em 1954. Na planta municipal, Ernesto Lourenço e Luciano Lourenço aparecem como proprietários do loteamento.\n\nUma reportagem do Portal Aqui Vale, publicada em 2023 a partir da memória reunida no blog Vila Tatetuba, situa o lançamento em 19 de abril de 1953. As duas datas se referem a registros diferentes: lançamento e aprovação. A reportagem lembra os caminhos de terra, a falta de água encanada e a distância até o ônibus nos primeiros anos. Há uma história anterior à vila no mesmo território: o livro São José dos Campos: de Aldeia a Cidade registra uma urna funerária com ossos humanos encontrada no Tatetuba em 1946.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Uma vila nova numa região de nome antigo",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Tabela dos bairros da década de 1920: Tatetuba entre as denominações rurais anteriores à vila residencial.",
          "acesso": "4 out. 2026.",
          "pagina": "39 do PDF",
          "paginaPdf": 39
        },
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Vila Tatetuba: aprovação em 1954. Data administrativa distinta do lançamento em 1953 narrado na memória publicada.",
          "acesso": "4 out. 2026.",
          "pagina": "61 do PDF (p. 58 da obra)",
          "paginaPdf": 61
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Vila Tatetuba: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/tatetuba_vl.pdf",
          "nota": "Proprietários Ernesto Lourenço e Luciano Lourenço; denominação do loteamento e arruamento.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "PORTAL AQUI VALE. 19 de abril: 70 anos da Vila Tatetuba. São José dos Campos, 19 abr. 2023.",
          "url": "https://portalaquivale.com.br/19-de-abril-70-anos-da-vila-tatetuba",
          "nota": "Memória do blog Vila Tatetuba, reproduzida na reportagem: lançamento em 19/04/1953, caminhos de terra, falta de água encanada e distância até o ônibus.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "PAPALI, Maria Aparecida (org.). São José dos Campos: de Aldeia a Cidade. São Paulo: Intergraf, 2010. (São José dos Campos: História e Cidade, v. 3).",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-III-S%C3%A3o-Jos%C3%A9-dos-Campos-de-Aldeia-a-cidade.pdf",
          "nota": "Nota 9: urna funerária encontrada no bairro Tatetuba em 1946. Não estabelece a etimologia do bairro nem permite datar a ocupação indígena pelo ano do achado.",
          "acesso": "4 out. 2026.",
          "pagina": "169 do PDF (p. 169 da obra, nota 9)",
          "paginaPdf": 169
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-vila-tesouro",
      "nome": "Vila Tesouro",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Loteamento aprovado em 1954; segunda gleba em 1955",
      "origemNome": "A planta registra Vila do Tesouro, forma que permanece no nome mais curto, Vila Tesouro. A denominação já existia no projeto do loteamento. O documento mostra onde ela foi usada, mas não explica a escolha da palavra “tesouro” nem a relaciona a uma descoberta no terreno.",
      "historia": "A Vila Tesouro entrou no mapa dos loteamentos aprovados em 1954; uma segunda gleba foi registrada no ano seguinte. A planta dessa gleba usa a denominação Vila do Tesouro e situa o empreendimento na região de Tatetuba. O bairro se formou no período em que São José ampliava suas áreas residenciais e recebia novas indústrias.\n\nAlgumas histórias locais ficaram nos nomes das ruas. O Pró-Memória, projeto de pesquisa histórica da Câmara Municipal de São José dos Campos, explica que Joaquim Bagunhá Maldos trabalhou no combate à febre amarela e à malária nos anos 1930. A Rua Célio Santos lembra um dirigente sindical do comércio. A cultura também ganhou endereço na vila: a Casa de Cultura Chico Triste homenageia o folclorista, jornalista e professor Francisco da Silva. Desde 2005, a semana dedicada a ele reúne atividades gratuitas em junho.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As ruas da vila e as histórias que elas guardam",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Vila Tesouro aprovada em 1954 e Gleba B em 1955.",
          "acesso": "4 out. 2026.",
          "pagina": "61 do PDF (p. 58 da obra)",
          "paginaPdf": 61
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Vila do Tesouro — Gleba B: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/tesouro_vl.pdf",
          "nota": "Planta da segunda gleba, denominada Vila do Tesouro, com localização na região de Tatetuba.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Projeto Ruas: ruas da Vila Tesouro. São José dos Campos, 31 dez. 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/2024/12/31/projeto-ruas-ruas-da-vila-tesouro/",
          "nota": "Joaquim Bagunhá Maldos: atuação no Posto de Higiene; Célio Santos: direção sindical. Denominações das ruas em 1968.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "AQUINO, Bianca de. Vila Tesouro recebe exposição de artes visuais e capoeira angola. São José dos Campos: Prefeitura Municipal; Fundação Cultural Cassiano Ricardo, 2 jun. 2022.",
          "url": "https://www.sjc.sp.gov.br/noticias/2022/junho/02/vila-tesouro-recebe-exposicao-de-artes-visuais-e-capoeira-angola/",
          "nota": "Casa de Cultura Chico Triste, trajetória de Francisco da Silva e Semana Chico Triste existente desde 2005. Data do fato em 2022; atualização da página em 2024.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-vila-industrial",
      "nome": "Vila Industrial",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Loteamento aprovado em 1954",
      "origemNome": "Industrial faz referência às fábricas e ao trabalho industrial, atividades presentes no entorno e na época de formação do bairro. A planta já registra essa denominação e identifica Vila Industrial Limitada como proprietária do empreendimento. A associação com as fábricas é uma leitura do nome e do contexto histórico; a escolha não é explicada no desenho.",
      "historia": "A Vila Industrial foi aprovada em 1954, na mesma década em que a cidade recebia a Via Dutra e grandes fábricas. O loteamento faz parte da expansão residencial da Zona Leste daquele período. A planta da primeira e da segunda gleba identifica a empresa Vila Industrial Limitada como proprietária. O desenho reúne as quadras de moradia, as ruas e os terrenos destinados às praças. Essas áreas residenciais acompanhavam a mudança de uma cidade que passava a oferecer mais empregos nas fábricas.\n\nA ocupação cresceu e ganhou novas formas de habitação. A pesquisa de Gabriel Ferreira, da Univap, registra o conjunto Integração, com mais de 992 apartamentos, construído em terreno que havia pertencido à Prefeitura. A organização comunitária também deixou marcos: em março de 1971 foi criada a Paróquia São Sebastião, que atendia a Vila Industrial e bairros vizinhos. Em 1979, sua atuação social passou a contar com a Obra Social Padre Bonafé.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Moradia numa cidade que passava a viver das fábricas",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Vila Industrial entre os loteamentos aprovados em 1954.",
          "acesso": "4 out. 2026.",
          "pagina": "60 do PDF (p. 57 da obra)",
          "paginaPdf": 60
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Vila Industrial — 1ª e 2ª glebas: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/industrial_vl.pdf",
          "nota": "Planta da primeira e segunda glebas, propriedade de Vila Industrial Limitada; quadras, praças e arruamento.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Conjunto Integração na região da Vila Industrial, com mais de 992 apartamentos em antigo terreno municipal.",
          "acesso": "4 out. 2026.",
          "pagina": "101 do PDF",
          "paginaPdf": 101
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia São Sebastião. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 58.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "Criação em 21/03/1971 e formação da Obra Social Padre Bonafé em 1979.",
          "acesso": "4 out. 2026.",
          "pagina": "58 do PDF",
          "paginaPdf": 58
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-santa-ines",
      "nome": "Jardim Santa Inês I & II",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Santa Inês II aprovado em 1980; Santa Inês I em 1981",
      "origemNome": "Santa Inês é uma referência à santa católica e já identifica os loteamentos dos anos 1980. A paróquia adotou o mesmo nome décadas depois. Os registros consultados não explicam quem escolheu a denominação do bairro nem permitem atribuir essa escolha à criação da paróquia, ocorrida em 2010.",
      "historia": "O Santa Inês se formou no início dos anos 1980, quando novos loteamentos ampliavam a ocupação da Zona Leste. Na dissertação de Gilberto Alves da Cunha, a aprovação do Santa Inês II aparece em 1980 e a do Santa Inês I em 1981. Os números distinguem duas partes da formação do bairro, sem indicar que a primeira tenha necessariamente sido aprovada antes da segunda.\n\nA história religiosa da comunidade também começa nessa década, ainda ligada à Paróquia Imaculada Conceição, de Eugênio de Melo. Depois, ela passou a ser atendida pela Paróquia São Vicente de Paulo. Em 3 de outubro de 2010, a Diocese criou a Paróquia Santa Inês. Sua revista comemorativa registra o trabalho dos moradores na construção da igreja e a atuação da obra social. As datas dos loteamentos e da paróquia mostram etapas distintas da história: primeiro as novas áreas de moradia, depois a consolidação de uma comunidade com organização própria.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Dois loteamentos e uma comunidade que cresceu junto",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Santa Inês I: aprovação em 1981; Santa Inês II: 1980. Fonte com datas administrativas individualizadas.",
          "acesso": "4 out. 2026.",
          "pagina": "43 do PDF (p. 40 da obra)",
          "paginaPdf": 43
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia Santa Inês. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 48.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "Comunidade organizada desde os anos 1980, vinculada antes a outras paróquias; instalação em 03/10/2010 e atuação da obra social.",
          "acesso": "4 out. 2026.",
          "pagina": "48 do PDF",
          "paginaPdf": 48
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Lei Orçamentária Anual 2025: dados consolidados das demandas e respostas das audiências públicas. São José dos Campos, 2024.",
          "url": "https://www.sjc.sp.gov.br/media/ju0ia21b/relatorio-consolidado-audiencias-loa-2025.pdf",
          "nota": "Resposta nº 102 da Secretaria de Gestão Habitacional e Obras: Santa Inês I, II e III aprovados e regularizados, no levantamento de 2024.",
          "acesso": "4 out. 2026.",
          "pagina": "20 do PDF (resposta 102)",
          "paginaPdf": 20
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-coqueiro",
      "nome": "Jardim Coqueiro",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Reconhecido como ZEIS em 2010; pavimentação concluída em 2014",
      "origemNome": "Coqueiro, no singular, é a forma usada nas notícias e respostas da Prefeitura. A planta de regularização traz Jardim dos Coqueiros. As duas denominações fazem referência à árvore, mas o projeto não explica se o nome veio de coqueiros existentes ali. Sua escolha não deve ser atribuída ao paisagismo sem esse registro.",
      "historia": "O Jardim Coqueiro se formou na região do Capão Grosso, na Zona Leste. A planta municipal de regularização usa a denominação Jardim dos Coqueiros e mostra as ruas numeradas e os terrenos ocupados. O bairro aparece entre as Zonas Especiais de Interesse Social do município em 2010, áreas reconhecidas pela legislação para receber tratamento próprio na política de habitação e regularização.\n\nEm maio de 2014, a Prefeitura anunciou a conclusão do asfalto e da drenagem nas ruas de 1 a 10. Foram 1.287 metros de vias, uma mudança importante no acesso às casas e na circulação pelo bairro. Dez anos depois, nas respostas às audiências públicas do orçamento de 2025, a Secretaria de Gestão Habitacional e Obras informou que o Jardim Coqueiro já estava regularizado. Esses registros permitem acompanhar a passagem de uma ocupação com necessidades de infraestrutura para um bairro reconhecido formalmente.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As ruas numeradas e o caminho da regularização",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim dos Coqueiros: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/coqueiros_jd_dos.pdf",
          "nota": "Projeto de regularização fundiária localizado no Capão Grosso; denominação, ruas numeradas e ocupação dos terrenos.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF (folha 1/3 da planta)",
          "paginaPdf": 1
        },
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Jardim Coqueiro na lista das Zonas Especiais de Interesse Social do mapa de 06/08/2010. A lista continua na página seguinte.",
          "acesso": "4 out. 2026.",
          "pagina": "122 do PDF (p. 117 da obra)",
          "paginaPdf": 122
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Prefeitura conclui obras de melhoria viária e drenagem no Jardim Coqueiro. São José dos Campos, 12 maio 2014.",
          "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=16939",
          "nota": "Região leste; pavimentação e drenagem concluídas nas ruas de 1 a 10, extensão total de 1.287 metros.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Lei Orçamentária Anual 2025: dados consolidados das demandas e respostas das audiências públicas. São José dos Campos, 2024.",
          "url": "https://www.sjc.sp.gov.br/media/ju0ia21b/relatorio-consolidado-audiencias-loa-2025.pdf",
          "nota": "Resposta nº 102: Secretaria de Gestão Habitacional e Obras informa que Jardim Coqueiro já se encontrava regularizado em 2024.",
          "acesso": "4 out. 2026.",
          "pagina": "20 do PDF (resposta 102)",
          "paginaPdf": 20
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-motorama",
      "nome": "Jardim Motorama",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Loteamento aprovado em 1959",
      "origemNome": "Motorama é o nome registrado na planta do loteamento. A palavra lembra motores e o universo dos automóveis, associação compatível com o contexto industrial da região. É uma interpretação, não uma homenagem comprovada à General Motors: os documentos reunidos não atribuem a escolha à fábrica.",
      "historia": "O Jardim Motorama já estava entre os loteamentos aprovados em 1959. Sua formação acompanha a expansão residencial da Zona Leste na década de 1950. A planta municipal ajuda a entender o lugar escolhido: de um lado, a Estrada Velha Rio–São Paulo; do outro, a Rodovia Presidente Dutra. Entre as duas vias foram desenhadas as quadras residenciais e ruas com nomes de flores, como Rosas, Lírios e Violetas.\n\nO bairro nasceu durante a expansão industrial de São José, quando terrenos próximos às rodovias recebiam novos usos e moradores. A história de suas ligações com o entorno continuou depois de ocupado. Em julho de 2025, a Prefeitura registrou o asfaltamento de uma travessa de setenta metros entre o Motorama e o São Vicente. Na reportagem, Mário Ferreira, morador da Rua das Jasmins havia onze anos, falou sobre a melhoria do acesso e do cuidado com aquele espaço.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Entre a estrada antiga e a nova rodovia",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Jardim Motorama entre os loteamentos aprovados em 1959.",
          "acesso": "4 out. 2026.",
          "pagina": "60 do PDF (p. 57 da obra)",
          "paginaPdf": 60
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Motorama: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/motorama_jd.pdf",
          "nota": "Localização entre Estrada Velha Rio–São Paulo e Rodovia Presidente Dutra; ruas das Rosas, dos Lírios e das Violetas. Leitura visual da planta.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Moradores aprovam melhorias em vias da região leste. São José dos Campos, 11 jul. 2025.",
          "url": "https://www.sjc.sp.gov.br/noticias/2025/julho/11/moradores-aprovam-melhorias-em-vias-da-regiao-leste/",
          "nota": "Travessa de setenta metros ligando Motorama e São Vicente, asfaltada em 11/07/2025; depoimento de Mário Ferreira, da Rua das Jasmins.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-diamante",
      "nome": "Jardim Diamante",
      "regiaoId": "leste",
      "regiaoNome": "Zona Leste",
      "periodo": "Aprovação registrada em 1959; arruamento em planta de 1967",
      "origemNome": "Diamante era o sobrenome de Jacob e Henrique, proprietários identificados na planta, e também o nome da antiga fazenda, segundo o Ecomuseu. O bairro conservou essa denominação. A ligação entre a família, a propriedade rural e o nome aparece tanto no documento quanto na pesquisa com moradores.",
      "historia": "O Jardim Diamante surgiu das terras da Fazenda Diamante. A planta municipal identifica Jacob Diamante, Henrique Diamante e Roberto Augusto Tavares como proprietários. Há mais de uma etapa nessa formação: a dissertação de Gilberto Alves da Cunha registra aprovação em 1959, enquanto a planta disponível tem anotação de 1967. O livro do Ecomuseu reúne lembranças da divisão da fazenda e da chegada dos primeiros moradores entre essas décadas.\n\nJocélia Martins, nascida ali quando o lugar ainda era fazenda, recorda as roças de seus familiares. Depois da venda da propriedade, seu pai foi trabalhar na General Motors. Outros moradores lembram as caminhadas até o Jardim Paulista para pegar ônibus e as viagens de charrete. O Alambari fazia parte do lazer: havia banho de rio e partidas de futebol nas margens. São memórias publicadas pelo Ecomuseu, com os moradores identificados, que ajudam a contar como as famílias viveram a mudança da fazenda para o bairro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "A fazenda, as primeiras casas e os banhos de rio",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Diamante: planta de loteamento. São José dos Campos, 1967.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/diamante_jd.pdf",
          "nota": "Planta do loteamento no bairro Tatetuba: proprietários Jacob Diamante, Henrique Diamante e Roberto Augusto Tavares; anotação de fevereiro de 1967. Não tratada como data única de início do bairro.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Jardim Diamante: aprovação em 1959. Distinta da anotação de 1967 na planta consultada.",
          "acesso": "4 out. 2026.",
          "pagina": "60 do PDF (p. 57 da obra)",
          "paginaPdf": 60
        },
        {
          "referencia": "SANTOS, Maria Siqueira (coord.). Ecomuseu dos Campos de São José: entre memórias e perspectivas. São José dos Campos: Centro de Estudos da Cultura Popular, 2020.",
          "url": "https://ecomuseu.org.br/wp-content/uploads/2025/05/02-LIVRO_-ECOMUSEU-CSJ-ENTRE-MEMORIAS-E-PERSPECTIVAS.pdf",
          "nota": "História da Fazenda Diamante e das primeiras famílias; depoimentos de José Tavares de Menezes, Osmar Domingos da Silva e Jocélia Martins. As páginas 53 e 57 apresentam etapas e datas aproximadas distintas.",
          "acesso": "4 out. 2026.",
          "pagina": "55–62 do PDF (p. 53–60 da obra)",
          "paginaPdf": 55
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "leste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-granja",
      "nome": "Jardim da Granja",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Loteamento de 1962; comunidade organizada desde os anos 1960",
      "origemNome": "No blog Morar em São José dos Campos, um autor identificado como Souza, que conta ter vivido cerca de trinta anos no bairro, atribui o nome às antigas granjas da região e cita a Granja Itambi. É uma explicação publicada por um morador em 2010. A planta municipal confirma a denominação Jardim da Granja, mas não descreve a escolha do nome.",
      "historia": "Júpiter, Netuno, Saturno e Órion: esses nomes já aparecem na planta do Jardim da Granja, junto à Avenida dos Astronautas e ao terreno do CTA. O documento identifica Jorge da Cunha Bueno como proprietário. O estudo de Gabriel Ferreira, da Univap, situa o loteamento em 1962 e relaciona seu crescimento à chegada de empresas aeronáuticas aos arredores do CTA e do ITA. A Granja fazia parte dessa mudança de uma cidade que passava a reunir fábricas, laboratórios e novos moradores.\n\nA vida comunitária também começou cedo. A Diocese de São José dos Campos registra a formação da comunidade Santa Rita de Cássia em 1964 e sua instalação como paróquia em 1973. Décadas depois, em 2024, o Ecomuseu dos Campos de São José iniciou uma pesquisa no bairro, reunindo conversas com moradores, fotografias e registros pessoais para contar essa história pelas experiências de quem viveu ali.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As ruas do céu e a vida ao lado do CTA",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Loteamento em 1962 e instalação de empresas aeronáuticas nos arredores do CTA e do ITA.",
          "acesso": "4 out. 2026.",
          "pagina": "71 do PDF",
          "paginaPdf": 71
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim da Granja: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/granja_jd_da.pdf",
          "nota": "Jorge da Cunha Bueno identificado como proprietário; Avenida dos Astronautas, limite do CTA e nomes de planetas e constelações. Leitura visual da planta digitalizada.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SOUZA. Jardim da Granja / Jd. Uirá. Morar em São José dos Campos, 12 maio 2010.",
          "url": "https://moraremsjc.blogspot.com/2010/05/jardim-da-granja-jd-uira.html",
          "nota": "O autor declara ter vivido cerca de trinta anos no bairro e relaciona seu nome às granjas. Relato pessoal publicado, sem identificação completa do autor; não tratado como ato oficial de denominação.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "DIOCESE DE SÃO JOSÉ DOS CAMPOS. Paróquia Santa Rita de Cássia. In: Revista comemorativa do quarentenário da Diocese de São José dos Campos. São José dos Campos: Diocese de São José dos Campos, 2021. p. 49.",
          "url": "https://diocese-sjc.org.br/wp-content/uploads/2021/11/Revista-do-Quarentenario-da-Diocese-de-Sao-Jose-dos-Campos-Digital.pdf",
          "nota": "Comunidade criada em 1964, nos arredores do Jardim da Granja, e paróquia instalada em 1973.",
          "acesso": "4 out. 2026.",
          "pagina": "49 do PDF",
          "paginaPdf": 49
        },
        {
          "referencia": "ECOMUSEU DOS CAMPOS DE SÃO JOSÉ. Ecomuseu registra história dos bairros das zonas leste e sudeste de São José dos Campos. São José dos Campos, 13 ago. 2024.",
          "url": "https://ecomuseusjc.blogspot.com/2024/08/ecomuseu-registra-historia-dos-bairros.html",
          "nota": "Pesquisa com moradores da Granja: visitas, fotografias, mapas e memórias para compor um novo livro sobre os bairros.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sudeste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-jardim-uira",
      "nome": "Jardim Uirá",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Loteamento aprovado em 25 de abril de 1975",
      "origemNome": "Uirá é uma palavra de origem tupi que significa ave ou pássaro, conforme o Dicio. A denominação combina com os nomes de aves inscritos nas ruas da planta. Essa relação ajuda a entender o nome do bairro; a ideia de que ele foi escolhido como símbolo da aviação não aparece nos documentos consultados.",
      "historia": "O Jardim Uirá foi aprovado em 25 de abril de 1975. A data está no carimbo da planta municipal, que desenha 608 lotes, áreas livres e espaços para recreação e equipamentos. Naquele desenho, o bairro ficava perto do Jardim da Granja e do CTA, com acesso pela Avenida Brigadeiro Faria Lima e pela antiga estrada do Jambeiro. As ruas receberam nomes como Saíras, Macucos, Mutuns, Siriemas e Canindés.\n\nCom o tempo, a memória de pessoas também passou a ocupar esses caminhos. Em outubro de 2014, a Câmara aprovou um projeto para dar à viela entre a Avenida das Saíras e a Rua dos Macucos o nome de Marlene Francisca de Souza Ribeiro. Professora de escolas municipais e estaduais, ela havia se aposentado na Escola Marechal Rondon em 2011. A notícia registra essa homenagem a uma educadora que morou e trabalhou em São José.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um bairro desenhado com nomes de aves",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Uirá: planta de loteamento. São José dos Campos, 1975.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/uira_jd.pdf",
          "nota": "Carimbo de aprovação em 25/04/1975, processo 20.225/74; conferência em 8/10/1982. Quadro com 608 lotes, áreas livres e nomes de aves nas vias. Não confundir a conferência de 1982 com a aprovação.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Câmara Municipal. Viela do Uirá receberá nome de professora. São José dos Campos, 17 out. 2014.",
          "url": "https://www.camarasjc.sp.gov.br/noticias/3605/viela-do-uira-recebera-nome-de-professora",
          "nota": "Aprovação do projeto em 16/10/2014; biografia de Marlene Francisca de Souza Ribeiro e localização da viela. A notícia não informa a sanção da lei.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "DICIO. Uirá. In: Dicionário Online de Português. [S. l.]: 7Graus, [s. d.].",
          "url": "https://www.dicio.com.br/uira/",
          "nota": "Sentido linguístico de uirá: ave ou pássaro, de origem tupi. Não comprova, sozinho, a intenção do loteador.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sudeste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-dcta-acacias",
      "nome": "DCTA / Vila das Acácias",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Construção do CTA a partir de 1947; ITA instalado em 1950",
      "origemNome": "DCTA significa Departamento de Ciência e Tecnologia Aeroespacial, denominação que consta na estrutura da Aeronáutica aprovada em 2009. CTA é o nome histórico pelo qual o campus ficou conhecido. Vila das Acácias aparece no endereço institucional do ITA; embora faça referência a árvores, a origem dessa escolha não é explicada nas fontes reunidas.",
      "historia": "A Vila das Acácias faz parte da história do campus onde se instalaram o CTA e o ITA. Em julho de 1947, a Prefeitura disponibilizou os terrenos para iniciar as obras. Oscar Niemeyer foi chamado para projetar os prédios, e o ITA se estabeleceu ali em 1950. O histórico publicado pelo instituto conta que os primeiros professores vieram de diferentes países, incluindo Estados Unidos e Alemanha, para formar engenheiros e trabalhar com professores brasileiros.\n\nO campus também precisava de moradias. O bloco H17, projetado por Niemeyer, reúne casas geminadas com jardins e varandas; uma dessas unidades foi reformada pelo Projeto Habitas, com conclusão em fevereiro de 2021. Os estudantes tinham sua própria experiência de convivência no alojamento H8. O Centro Acadêmico Santos Dumont, criado em 1950, participou de sua organização e manteve atividades culturais, como teatro, música e cinema, ao longo de sua história.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Uma escola, laboratórios e casas para uma nova comunidade",
      "fontesRevisadas": [
        {
          "referencia": "INSTITUTO TECNOLÓGICO DE AERONÁUTICA. Construção. São José dos Campos, 11 nov. 2019.",
          "url": "https://pgfis.ita.br/pt/post/construcao",
          "nota": "Terrenos disponibilizados em 1º/07/1947, projeto de Oscar Niemeyer, instalação do ITA em 1950 e professores estrangeiros. Endereço institucional na Vila das Acácias.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "INSTITUTO TECNOLÓGICO DE AERONÁUTICA. Projeto Habitas. São José dos Campos, [s. d.].",
          "url": "https://habitas.ita.br/index.html#content6-i",
          "nota": "Descrição das casas geminadas do bloco H17, projetado por Niemeyer, e da reforma concluída em fevereiro de 2021. Link para a seção Casa Niemeyer.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "CENTRO ACADÊMICO SANTOS DUMONT. Nossa história. São José dos Campos, [s. d.].",
          "url": "https://www.casd.ita.br/sobre-nos/nossa-historia/",
          "nota": "Criação do centro acadêmico em 1950, organização do alojamento H8 e atividades culturais em sua trajetória.",
          "acesso": "4 out. 2026."
        },
        {
          "referencia": "BRASIL. Decreto nº 6.834, de 30 de abril de 2009. Aprova a Estrutura Regimental e o Quadro Demonstrativo dos Cargos em Comissão e das Funções Gratificadas do Comando da Aeronáutica, do Ministério da Defesa, e dá outras providências. Brasília, DF, 2009.",
          "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/decreto/d6834.htm",
          "nota": "Anexo I, art. 4º, IV, g, e art. 21: denominação Departamento de Ciência e Tecnologia Aeroespacial. Usado como documento histórico de 2009; decreto posteriormente revogado.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sudeste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-putim",
      "nome": "Putim",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Bairro rural documentado na década de 1920; urbanização posterior",
      "origemNome": "Putim já era usado como nome de bairro nos registros dos anos 1920 e permaneceu na descrição de áreas que depois receberam novos loteamentos. Os documentos permitem acompanhar essa continuidade, mas não explicar o significado da palavra. A história da “panela” se refere à antiga capela Santa Cruz da Panela, não à origem do nome Putim.",
      "historia": "O Putim já aparecia entre os bairros rurais de São José dos Campos na década de 1920. A pesquisa de Gabriel Ferreira, da Univap, reúne essa denominação a partir do almanaque municipal de 1922 e dos registros de impostos sobre cafeeiros de 1926 e 1927. O nome pertence, portanto, a uma São José anterior aos loteamentos residenciais e ao crescimento da indústria aeronáutica. Em 1999, uma lei municipal ainda descrevia terrenos entre o Uirá e o Flamboyant como parte dos antigos bairros da Ressaca e do Putim.\n\nHá também uma história guardada no solo. O livro São José dos Campos: de Aldeia a Cidade registra o encontro de uma urna funerária com ossos humanos no Putim, em maio de 2004. Segundo os moradores citados na obra, uma antiga capela próxima se chamava Santa Cruz da Panela porque outra urna havia sido encontrada ali e entendida como uma panela. O achado e a lembrança da capela aparecem juntos no estudo sobre a presença indígena na cidade.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O bairro antigo e a memória encontrada no chão",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Tabela 3: Putim entre os bairros da década de 1920, com base no almanaque de 1922 e nos registros municipais de 1926 e 1927.",
          "acesso": "4 out. 2026.",
          "pagina": "39 do PDF",
          "paginaPdf": 39
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Lei Complementar nº 189, de 9 de agosto de 1999. Altera a classificação urbanística da área descrita em anexo de Zona de Transição Industrial para Zona Mista Três. São José dos Campos, 1999.",
          "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/1999/LC_1999_00000189.pdf",
          "nota": "Anexo: área entre Jardim Uirá, Parque Residencial Flamboyant e Córrego Cambuí, situada nos antigos bairros Ressaca e Putim. Documento histórico, posteriormente revogado.",
          "acesso": "4 out. 2026.",
          "pagina": "3 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "PAPALI, Maria Aparecida (org.). São José dos Campos: de Aldeia a Cidade. São Paulo: Intergraf, 2010. (São José dos Campos: História e Cidade, v. 3).",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2018/07/Volume-III-S%C3%A3o-Jos%C3%A9-dos-Campos-de-Aldeia-a-cidade.pdf",
          "nota": "Capítulo sobre representações do indígena, nota 11: urna funerária encontrada no Putim em maio de 2004 e memória dos moradores sobre a capela Santa Cruz da Panela. A nota cita pesquisa de Antonio Carlos Oliveira da Silva, de 2004. Não estabelece a idade do achado nem a origem do nome Putim.",
          "acesso": "4 out. 2026.",
          "pagina": "169 do PDF (p. 169 da obra, nota 11)",
          "paginaPdf": 169
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sudeste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-residencial-flamboyant",
      "nome": "Residencial Flamboyant",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Aprovação indicada em 1982; planta municipal conferida em 1985",
      "origemNome": "Flamboyant é o nome de uma árvore conhecida pela floração de cores vivas. Em francês, a palavra significa “flamejante”, como explica uma publicação da Embrapa. A denominação do loteamento faz essa associação com a árvore; a planta não informa se a escolha veio de exemplares existentes no terreno ou de uma proposta de paisagismo.",
      "historia": "O Flamboyant já fazia parte da expansão urbana dos anos 1980. A dissertação de Gilberto Alves da Cunha, da Univap, inclui o bairro entre os loteamentos aprovados em 1982. A planta preservada pela Prefeitura, conferida em 1985, usa o nome Parque Residencial Flamboyant e situa o empreendimento no bairro do Putim. Vega Química S.A. aparece como proprietária da área.\n\nO desenho mostra como se pretendia organizar o novo bairro: quadras de moradia, ruas e avenidas, áreas verdes e um terreno reservado para escola. As curvas de nível acompanham as diferenças de altura do terreno. A ocupação residencial se encaixou numa região que também reunia instalações industriais. Em 1999, o Flamboyant e o Jardim Uirá já eram referências para descrever os limites de uma gleba perto do Córrego Cambuí. Esses documentos ajudam a acompanhar a divisão das antigas áreas em bairros com nomes e traçados próprios.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um loteamento nas antigas terras do Putim",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Relação dos loteamentos aprovados nos anos 1980: Flamboyant (1982).",
          "acesso": "4 out. 2026.",
          "pagina": "42 do PDF (p. 39 da obra)",
          "paginaPdf": 42
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Parque Residencial Flamboyant: planta de loteamento. São José dos Campos, [s. d.].",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/flamboyant_pq_resid.pdf",
          "nota": "Planta geral, folha 02/11: propriedade de Vega Química S.A., localização no bairro do Putim, quadras, áreas verdes e terreno para escola. Conferida em 07/11/1985; digitalização de uma única folha do conjunto.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF (folha 02/11 da planta)",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Lei Complementar nº 189, de 9 de agosto de 1999. Altera a classificação urbanística da área descrita em anexo de Zona de Transição Industrial para Zona Mista Três. São José dos Campos, 1999.",
          "url": "https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/LeisComplementares/1999/LC_1999_00000189.pdf",
          "nota": "Flamboyant e Uirá citados na descrição de uma gleba dos antigos bairros Ressaca e Putim, próxima ao Córrego Cambuí. Lei usada como registro histórico de localização.",
          "acesso": "4 out. 2026.",
          "pagina": "3–4 do PDF",
          "paginaPdf": 3
        },
        {
          "referencia": "CEZAR, Eliana. A beleza do Flamboyant em vários pontos da Embrapa. Informações Gerenciais da Unidade, Campo Grande: Embrapa Gado de Corte, 19 out. 2006.",
          "url": "https://cloud.cnpgc.embrapa.br/wp-content/igu/noticias/noticias331.htm",
          "nota": "Nome da árvore e significado francês de flamboyant. Não utilizada para afirmar que houve plantio da espécie no loteamento joseense.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sudeste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-santa-julia",
      "nome": "Jardim Santa Júlia",
      "regiaoId": "sudeste",
      "regiaoNome": "Zona Sudeste",
      "periodo": "Planta de 2004; aprovação registrada em 2005",
      "origemNome": "Santa Júlia já é a denominação do projeto de loteamento de 2004. O nome tem a forma de uma referência religiosa, mas a planta não identifica uma santa ou pessoa homenageada. Ropsime e Plínio Milani aparecem como proprietários; esse registro, por si só, não comprova uma homenagem a alguém da família.",
      "historia": "O Jardim Santa Júlia foi desenhado numa área identificada na planta como Ressaca, Putim ou Pernambucana, junto à Avenida José Ignácio Bicudo. O projeto, datado de fevereiro de 2004, traz os nomes dos proprietários Ropsime Keutenedjian Milani e Plínio Milani. A relação municipal de loteamentos aprovados registra 2005 como ano de aprovação e informa 2.338 lotes. O documento permite situar o bairro na expansão residencial dos anos 2000.\n\nO lago já aparece no desenho do loteamento, cercado por áreas verdes. Em março de 2021, a Prefeitura anunciou a restauração florestal da área destinada ao Parque Santa Júlia, com plantio de mudas nativas do Cerrado para proteger as nascentes que alimentam o lago. A notícia também descreve a construção de mirante, passeios, playground e ciclovia. A história do bairro passou a incluir, assim, a transformação de uma área junto à água em espaço de lazer e preservação.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O loteamento, o lago e a formação do parque",
      "fontesRevisadas": [
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Jardim Santa Júlia: planta de loteamento. São José dos Campos, 2004.",
          "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/santa_julia_jd.pdf",
          "nota": "Planta de arruamento e parcelamento datada de 04/02/2004, processo 75.590-5/00; proprietários, localização nas áreas Ressaca/Putim/Pernambucana, lago e áreas verdes.",
          "acesso": "4 out. 2026.",
          "pagina": "1 do PDF (folha 01/01 da planta)",
          "paginaPdf": 1
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Tabela de loteamentos aprovados. São José dos Campos, 17 set. 2024.",
          "url": "https://www.sjc.sp.gov.br/media/35fk2ujz/2024_09_17_tabela-de-loteamentos-aprovados-1.pdf",
          "nota": "Jardim Santa Júlia: aprovação em 2005, 2.338 lotes, Avenida José Ignácio Bicudo — Putim. O ano de 2005 é da aprovação, enquanto 2004 é a data do projeto.",
          "acesso": "4 out. 2026.",
          "pagina": "2 do PDF",
          "paginaPdf": 2
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura Municipal. Parque Santa Júlia recebe restauração florestal. São José dos Campos, 18 mar. 2021.",
          "url": "https://www.sjc.sp.gov.br/noticias/2021/marco/18/parque-santa-julia-recebe-restauracao-florestal/",
          "nota": "Anúncio de restauração com mudas nativas do Cerrado, proteção das nascentes e obras de lazer. Publicação de março de 2021, com atualização da página em 2024.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "sudeste-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-aquarius",
      "nome": "Jardim Aquarius",
      "regiaoId": "oeste",
      "regiaoNome": "Zona Oeste",
      "periodo": "Loteamento a partir de 1984; verticalização nas décadas seguintes",
      "origemNome": "Aquarius corresponde ao nome latino de Aquário, usado para uma constelação e um signo do zodíaco. Essa associação explica o sentido da palavra, mas não identifica quem a escolheu. As fontes reunidas situam o bairro no antigo terreno destinado à Ford; não confirmam a versão de uma Fazenda Aquarius que teria dado origem ao nome.",
      "historia": "Antes do Aquarius, aquela área havia sido destinada à instalação da Ford em São José dos Campos. A fábrica acabou indo para Taubaté. Segundo a pesquisa de Gabriel Ferreira, da Univap, o terreno foi vendido à Construtora Serramar, do grupo Serveng, e deu lugar ao loteamento Jardim Aquarius a partir de 1984. A abertura da Avenida Cassiano Ricardo, no final dos anos 1970, já havia melhorado a ligação da área com o centro.\n\nA paisagem mudaria bastante com a construção dos prédios. No artigo sobre o Aquarius publicado no Boletim Campineiro de Geografia, Gustavo Palma de Andrade estuda como as regras de zoneamento e o mercado imobiliário participaram dessa transformação. Seu trabalho descreve a intensificação da verticalização após a virada do século e os conflitos em torno do uso do espaço do bairro.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O terreno da fábrica que virou um bairro",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Terreno destinado à Ford, decisão de instalar a fábrica em Taubaté e abertura da Avenida Cassiano Ricardo.",
          "acesso": "4 out. 2026.",
          "pagina": "85 do PDF",
          "paginaPdf": 85
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Venda à Serramar/Serveng e início do loteamento em 1984. A legenda da fotografia na página seguinte menciona 1983; o texto principal trabalha com 1984.",
          "acesso": "4 out. 2026.",
          "pagina": "98 do PDF",
          "paginaPdf": 98
        },
        {
          "referencia": "ANDRADE, Gustavo Palma de. Verticalização no município de São José dos Campos (SP): o caso do Jardim Aquarius. Boletim Campineiro de Geografia, Campinas, v. 10, n. 2, p. 461–478, 2020.",
          "url": "https://www.publicacoes.agb.org.br/boletim-campineiro/article/download/2788/2141",
          "nota": "Resumo e introdução: verticalização do Aquarius, zoneamento e disputas pelo espaço. O artigo descreve a intensificação da construção de edifícios após a virada do século.",
          "acesso": "4 out. 2026.",
          "pagina": "1–2 do PDF (p. 461–462 do artigo)",
          "paginaPdf": 1
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-urbanova",
      "nome": "Urbanova (Alphaville / Paratehy)",
      "regiaoId": "oeste",
      "regiaoNome": "Zona Oeste",
      "periodo": "Projeto divulgado nos anos 1970; loteamentos a partir de 1983",
      "origemNome": "Urbanova sugere a junção de “urbano” e “nova”, uma leitura coerente com a proposta de uma nova área urbana. O estudo documenta o projeto e seu nome, mas não apresenta uma declaração do autor da denominação. Alphaville e Colinas do Paratehy são empreendimentos da região, não nomes anteriores de todo o Urbanova.",
      "historia": "O Urbanova nasceu de um projeto que pretendia criar uma nova área urbana além do Rio Paraíba do Sul. A pesquisa de Gabriel Ferreira, da Univap, recupera uma notícia de 1975 sobre o empreendimento e registra o início dos loteamentos em 1983. As primeiras etapas receberam os nomes Urbanova I, II, III e IV. Naquele começo, havia poucas casas e uma cancela controlava a entrada pela ponte de acesso.\n\nA instalação do campus da Univap, inaugurado em 1995, mudou o movimento da região. O estudo reúne relatos e notícias sobre as dificuldades dos estudantes: eram poucos ônibus, faltavam telefones públicos e havia trechos sem iluminação. A circulação de alunos e a necessidade de acesso ajudaram a ampliar a infraestrutura. O bairro cresceu junto com a universidade e com os novos loteamentos residenciais.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "A nova cidade e a chegada da universidade",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Controle inicial de acesso, etapas do empreendimento e loteamento iniciado em 1983.",
          "acesso": "4 out. 2026.",
          "pagina": "97–98 do PDF",
          "paginaPdf": 97
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Instalação da Univap, inauguração do campus em 1995 e dificuldades de acesso dos estudantes registradas nas pesquisas e notícias.",
          "acesso": "4 out. 2026.",
          "pagina": "109–111 do PDF",
          "paginaPdf": 109
        },
        {
          "referencia": "SÃO JOSÉ DOS CAMPOS. Câmara Municipal. Loteamento Colinas do Paratehy tem vias renomeadas. São José dos Campos, 2014.",
          "url": "https://www.camarasjc.sp.gov.br/noticias/3498/loteamento-colinas-do-paratehy-tem-vias-renomeadas",
          "nota": "A notícia situa Colinas do Paratehy no bairro Urbanova; não foi tratado como sinônimo de toda a região.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-esplanada",
      "nome": "Jardim Esplanada",
      "regiaoId": "oeste",
      "regiaoNome": "Zona Oeste",
      "periodo": "Loteamento documentado em 1957",
      "origemNome": "Esplanada significa uma área ampla e relativamente plana. É uma leitura possível da denominação, mas o relevo sozinho não comprova o motivo da escolha. O nome já consta na relação histórica de loteamentos; as fontes consultadas não registram uma homenagem nem a decisão de quem o propôs.",
      "historia": "O Jardim Esplanada já aparece em 1957 na relação de loteamentos estudada por Gilberto Alves da Cunha, da Univap. Sua história acompanha o crescimento da cidade antes da expansão dos bairros mais recentes a oeste. As moradias e os serviços foram ocupando essa área perto da Vila Ema e do Jardim Nova América.\n\nEm 1959, a Escola Técnica Everardo Passos, a ETEP, instalou-se no bairro. Gabriel Ferreira relaciona a escola à necessidade de formar trabalhadores para as indústrias que chegavam a São José. A fotografia aérea reproduzida na pesquisa mostra o prédio no loteamento ainda em formação. Nos anos 1970, os novos bairros ao redor ampliaram essa parte da cidade, incluindo o Jardim Apolo em terrenos que haviam pertencido ao Sanatório Vicentina Aranha.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "Um bairro ligado à formação técnica da cidade",
      "fontesRevisadas": [
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Relação de loteamentos da década de 1950: Jardim Esplanada em 1957.",
          "acesso": "4 out. 2026.",
          "pagina": "60 do PDF (p. 57 da obra)",
          "paginaPdf": 60
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "ETEP criada em 1959 no Jardim Esplanada e fotografia aérea com sua localização.",
          "acesso": "4 out. 2026.",
          "pagina": "63–64 do PDF",
          "paginaPdf": 63
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Expansão dos arredores do Esplanada e implantação do Jardim Apolo em gleba do antigo sanatório.",
          "acesso": "4 out. 2026.",
          "pagina": "85 do PDF",
          "paginaPdf": 85
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-colinas",
      "nome": "Jardim das Colinas",
      "regiaoId": "oeste",
      "regiaoNome": "Zona Oeste",
      "periodo": "Loteamento e expansão na década de 1970",
      "origemNome": "Colinas faz referência a elevações de terreno. A associação com o relevo é uma interpretação do nome, não uma justificativa formal encontrada nos documentos. O mesmo nome passou a identificar o shopping e outros empreendimentos da região.",
      "historia": "As obras do Jardim das Colinas aparecem em uma fotografia da década de 1970 reproduzida no estudo de Gabriel Ferreira, da Univap, disponível no Pró-Memória, projeto da Câmara Municipal de São José dos Campos. A pesquisa liga o empreendimento à atuação de Ronald Levinsohn e Rodman Rockefeller, perto do Jardim Esplanada e do Córrego Vidoca. A dissertação de Gilberto Cunha relaciona o loteamento a 1975.\n\nO shopping chegou mais tarde. Segundo o histórico publicado pelo próprio Colinas Shopping, a inauguração ocorreu em maio de 1997. O cinema passou a atrair visitantes de outras partes da cidade, e o Teatro Colinas abriu as portas em 2009. A história do bairro e a do centro comercial se cruzam, mas as datas dos dois empreendimentos não devem ser confundidas.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "O loteamento veio antes do shopping",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Empreendedores e localização do loteamento; fotografia das obras na década de 1970 na página 86.",
          "acesso": "4 out. 2026.",
          "pagina": "85–86 do PDF",
          "paginaPdf": 85
        },
        {
          "referencia": "CUNHA, Gilberto Alves da. Dispersão e fragmentação do crescimento urbano: relação entre a legislação urbanística e produção do espaço urbano de São José dos Campos 1950/2015. 2018. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2018.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2022/07/00003a2c.pdf",
          "nota": "Loteamento Jardim das Colinas relacionado a 1975.",
          "acesso": "4 out. 2026.",
          "pagina": "41 do PDF (p. 38 da obra)",
          "paginaPdf": 41
        },
        {
          "referencia": "COLINAS SHOPPING. Sobre: a história do Colinas Shopping. São José dos Campos, [s. d.].",
          "url": "https://colinasshopping.com.br/shopping/sobre",
          "nota": "Histórico institucional: shopping em maio de 1997 e teatro em 2009. Sua cronologia menciona um lançamento residencial em 1993; esse marco empresarial não foi usado para apagar os registros de loteamento dos anos 1970.",
          "acesso": "4 out. 2026."
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
  {
      "id": "bairro-industrias",
      "nome": "Jardim das Indústrias",
      "regiaoId": "oeste",
      "regiaoNome": "Zona Oeste",
      "periodo": "Expansão nos anos 1950; loteamento aprovado nos anos 1960",
      "origemNome": "A denominação acompanha a formação do bairro ao redor de uma indústria, a Johnson & Johnson, descrita no estudo da Univap. “Das Indústrias” faz sentido nesse contexto de trabalho e urbanização, embora o bairro também tenha sido ocupado por moradias. A pesquisa não identifica um ato específico de escolha do nome.",
      "historia": "O Jardim das Indústrias nasceu em terras desmembradas da Fazenda Paraíso, de Carlos Marcondes. A pesquisa de Gabriel Henrique dos Santos Ferreira, da Univap, conta que um dos primeiros terrenos vendidos abrigou o Bar da Gruta, que atendia trabalhadores da rodovia. Uma área maior foi adquirida pela Johnson & Johnson, instalada em São José em 1954.\n\nA fábrica e a Dutra ajudaram a orientar a formação do bairro, cujo loteamento foi aprovado nos anos 1960. Naquele período, a Estrada Imperial e a rodovia eram as principais ligações com o núcleo urbano. A antiga estrada receberia o nome de Avenida Cassiano Ricardo em 1978. O crescimento das moradias ao redor da indústria fez do bairro um dos primeiros pontos da expansão que formaria a região oeste.",
      "curiosidade": "",
      "fonte": "",
      "fonteUrl": "",
      "tituloHistoria": "As terras da fazenda e os trabalhadores da Dutra",
      "fontesRevisadas": [
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Johnson & Johnson instalada em 1954 e implantação do Jardim das Indústrias ao redor do complexo, com aprovação do loteamento nos anos 1960.",
          "acesso": "4 out. 2026.",
          "pagina": "58 do PDF",
          "paginaPdf": 58
        },
        {
          "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
          "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
          "nota": "Fazenda Paraíso, Carlos Marcondes, Bar da Gruta, acesso pela Dutra e Estrada Imperial; nota 27 sobre a Avenida Cassiano Ricardo em 1978.",
          "acesso": "4 out. 2026.",
          "pagina": "59 do PDF",
          "paginaPdf": 59
        }
      ],
      "layoutHistoria": "editorial-v1",
      "loteRevisao": "oeste-sfx-2026-10-04",
      "fichaHistoria": [],
      "contextoFonte": "",
      "fontePagina": "",
      "tituloOrigem": "Sobre o nome"
    },
{
  "id": "bairro-centro-historico",
  "nome": "Centro Histórico (Rua 15 / Praça Afonso Pena)",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Aldeamento anterior a 1767; vila desde 1767",
  "origemNome": "“Centro Histórico” descreve essa parte antiga da cidade. Seus lugares guardam nomes de épocas diferentes: a Rua Quinze lembra uma data nacional; o largo de São Benedito conserva a referência à igreja.",
  "historia": "O Centro cresceu em torno do antigo aldeamento, na região da Matriz. Em 27 de julho de 1767, a aldeia foi elevada a vila. Ali se concentraram casas, comércio e a administração local.\n\nUma de suas vias principais era a Rua Direita. Em 1897, ela passou a se chamar Quinze de Novembro, em referência à Proclamação da República. A mudança sobreviveu à revisão dos nomes de ruas feita em 1913.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "As ruas que guardam o começo da cidade",
  "fichaHistoria": [
    {
      "titulo": "Um prédio, muitos usos",
        "texto": "Na Rua Quinze de Novembro, o prédio da Biblioteca Municipal Cassiano Ricardo já abrigou cinema, teatro, salão de baile, Prefeitura e Câmara. Na Praça Afonso Pena, o Espaço Mário Covas ocupa um prédio de 1926 que recebeu a Escola Livre para Formação de Professores e a Câmara Municipal."
    }
  ],
  "fontesRevisadas": [
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Aniversário de São José marca data em que povoado se tornou vila em 1767. São José dos Campos, 2018.",
      "url": "https://www.camarasjc.sp.gov.br/noticias/6272/aniversario-de-sao-jose-marca-data-em-que-povoado-se-tornou-vila-em-1767",
      "nota": "Texto da equipe do Pró-Memória, acervo histórico da Câmara, sobre o aldeamento e a elevação a vila.",
      "acesso": "4 out. 2026."
    },
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Data da Proclamação da República denomina ruas de São José e distritos. São José dos Campos, 14 nov. 2019.",
      "url": "https://www.camarasjc.sp.gov.br/noticias/6881/data-da-proclamacao-da-republica-denomina-ruas-de-sao-jose-e-distritos",
      "nota": "Seção História da Rua Quinze, no Centro: nomes de 1897 e 1913 e usos do prédio da biblioteca.",
      "acesso": "4 out. 2026."
    },
    {
        "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Espaço Mario Covas e Igreja de São Benedito passam por reformas. São José dos Campos, 7 abr. 2015.",
      "url": "https://servicos.sjc.sp.gov.br/arquivonoticias/noticia.aspx?noticia_id=20133",
      "nota": "Histórico do prédio da Praça Afonso Pena e da Igreja de São Benedito.",
      "acesso": "4 out. 2026."
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-vila-ema",
  "nome": "Vila Ema",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Loteamento anterior a 1953",
  "origemNome": "O nome é associado a Ema Lindemberg, responsável pelo antigo loteamento. O registro do Projeto Ruas identifica essa ligação com as terras que deram origem ao bairro.",
  "historia": "Antes de ser endereço de restaurantes e prédios, Vila Ema era um loteamento feito por Ema Lindemberg. O Projeto Ruas, do acervo Pró-Memória da Câmara, registra que a Lei nº 216, de 12 de fevereiro de 1953, incorporou o bairro à zona residencial da cidade.\n\nA vida religiosa também deixou marcas ali. Quando a Paróquia São Dimas foi criada, em 1951, funcionou provisoriamente na Capela do Menino Jesus de Praga, na Vila Ema. Os primeiros fiéis partiram dali em procissão até o terreno do futuro templo.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "O loteamento de Ema",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Projeto Ruas – Vila Ema e adjacências. São José dos Campos: Pró-Memória, 3 out. 2022.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/2022/10/03/projeto-ruas-vila-ema-e-adjacencias/",
      "nota": "Parágrafo inicial: loteamento de Ema Lindemberg e Lei nº 216/1953.",
      "acesso": "4 out. 2026."
    },
    {
      "referencia": "CATEDRAL DE SÃO DIMAS. História da Catedral. São José dos Campos: Catedral de São Dimas, [s.d.].",
      "url": "https://www.catedralsaodimas.org.br/a-catedral/historia/",
      "nota": "Primeiros parágrafos: criação da paróquia em 1951 e sede provisória na Vila Ema.",
      "acesso": "4 out. 2026."
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-vila-adyana",
  "nome": "Vila Adyana",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Projeto aprovado em 7 de dezembro de 1948",
  "origemNome": "O documento registra a mudança de Vila Gaby para Vila Ady Anna, mas não explica quem teria sido homenageado. Ele identifica Vicente de Barros Netto, Fernando D’Olne Soares Barros e Ruby D’Olne Soares Barros como proprietários.",
  "historia": "A planta municipal traz uma pista que o nome atual esconde: “Vila Ady Anna”, antiga Vila Gaby. O carimbo registra a aprovação do projeto em 7 de dezembro de 1948. No desenho já aparecem a Rua Santa Clara e as avenidas Ademar de Barros e Nove de Julho.\n\nA pesquisa de Luciane de Menezes Siqueira situa Vila Adyana entre os loteamentos próximos ao Centro destinados a moradores de renda média. A abertura desses bairros acompanhou a redução da área reservada aos sanatórios e sua transformação em espaço residencial.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "Antes de Adyana, Vila Gaby",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Vila Ady Anna: planta do loteamento. São José dos Campos: Prefeitura, [s.d.]. 1 mapa.",
      "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/adyanna_vl.pdf",
      "nota": "Cabeçalho: antiga Vila Gaby e proprietários. Carimbo inferior direito: aprovação em 07-12-1948.",
      "acesso": "4 out. 2026.",
      "pagina": "1 do PDF",
      "paginaPdf": 1
    },
    {
      "referencia": "SIQUEIRA, Luciane de Menezes. Um setor urbano em transformação: a região oeste de São José dos Campos – SP. 2007. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2007.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/07/Um-Setor-Urbano-em-Transforma%C3%A7%C3%A3o-A-Regi%C3%A3o-Oeste-de-S%C3%A3o-Jos%C3%A9-dos-Campos-SP.pdf",
      "nota": "Passagem sobre Vila Adyana e Jardim São Dimas e a transformação de áreas sanatoriais em loteamentos residenciais.",
      "acesso": "4 out. 2026.",
      "pagina": "96 do PDF",
      "paginaPdf": 96
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-vila-betania",
  "nome": "Vila Betânia",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Formação residencial nos anos 1960",
  "origemNome": "Betânia pode ser lido como uma referência ao lugar bíblico de mesmo nome. É uma interpretação da denominação; a planta consultada registra o bairro, mas não explica a escolha.",
  "historia": "Vila Betânia se formou em terras ligadas a Paulus Aulus Pompeia, professor do ITA. A planta municipal identifica Pompeia e João Augusto de Matos Pimenta como proprietários e mostra os lotes distribuídos junto à Avenida Tívoli.\n\nEssa avenida nasceu de uma doação de terreno à Prefeitura, registrada na Lei nº 721, de 1960. O Projeto Ruas, do acervo Pró-Memória da Câmara, explica que Tívoli é o nome de uma cidade italiana. Na mesma planta, uma área já aparece destinada ao Hospital Central de São José dos Campos.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "As terras de um professor do ITA",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Vila Betânia: planta do loteamento. São José dos Campos: Prefeitura, [s.d.]. 1 mapa.",
      "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/betania_vl.pdf",
      "nota": "Cabeçalho com os proprietários, Avenida Tívoli e área identificada como Hospital Central.",
      "acesso": "4 out. 2026.",
      "pagina": "1 do PDF",
      "paginaPdf": 1
    },
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Projeto Ruas – Ruas da Vila Betânia. São José dos Campos: Pró-Memória, 17 jun. 2025.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/2025/06/17/projeto-ruas-ruas-da-vila-betania/",
      "nota": "Seção Avenida Tivoli: doação do terreno, Lei nº 721/1960 e trajetória de Paulus Aulus Pompeia.",
      "acesso": "4 out. 2026."
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-sao-dimas",
  "nome": "Jardim São Dimas",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Expansão residencial em meados do século XX",
  "origemNome": "O nome remete a São Dimas, padroeiro escolhido para a paróquia por Dom Francisco Borja do Amaral. A história publicada pela própria Catedral documenta essa escolha e a construção dos templos.",
  "historia": "O Jardim São Dimas começou como uma chácara, segundo os relatos reunidos pelo programa Histórias do Meu Bairro, da TV Câmara. A pesquisa de Luciane de Menezes Siqueira o situa na expansão residencial próxima ao Centro, em áreas antes reservadas à atividade sanatorial.\n\nA paróquia foi criada em 18 de janeiro de 1951. Enquanto o templo era construído, as celebrações aconteciam na Vila Ema. A matriz provisória abriu em 1953; o novo santuário teve inauguração oficial em 1981, ano em que a igreja se tornou catedral.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "Da chácara às ruas de São Dimas",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Programa da TV Câmara mostra a conexão afetiva dos moradores com a região onde vivem. São José dos Campos, 6 jan. 2023.",
      "url": "https://www.camarasjc.sp.gov.br/noticias/8038/programa-da-tv-camara-mostra-a-conexao-afetiva-dos-moradores-com-a-regiao-onde-vivem",
      "nota": "Apresentação do programa Histórias do Meu Bairro, baseado em lembranças de moradores. As passagens sobre Jardim Paulista, São Dimas e Vila Maria estão no corpo da notícia.",
      "acesso": "4 out. 2026."
    },
    {
      "referencia": "SIQUEIRA, Luciane de Menezes. Um setor urbano em transformação: a região oeste de São José dos Campos – SP. 2007. Dissertação (Mestrado em Planejamento Urbano e Regional) — Universidade do Vale do Paraíba, São José dos Campos, 2007.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2019/07/Um-Setor-Urbano-em-Transforma%C3%A7%C3%A3o-A-Regi%C3%A3o-Oeste-de-S%C3%A3o-Jos%C3%A9-dos-Campos-SP.pdf",
      "nota": "Passagem sobre Vila Adyana e Jardim São Dimas e a transformação de áreas sanatoriais em loteamentos residenciais.",
      "acesso": "4 out. 2026.",
      "pagina": "96 do PDF",
      "paginaPdf": 96
    },
    {
      "referencia": "CATEDRAL DE SÃO DIMAS. História da Catedral. São José dos Campos: Catedral de São Dimas, [s.d.].",
      "url": "https://www.catedralsaodimas.org.br/a-catedral/historia/",
      "nota": "Escolha do padroeiro e datas de criação da paróquia e dos templos.",
      "acesso": "4 out. 2026."
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-monte-castelo",
  "nome": "Monte Castelo",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Ruas documentadas desde 1950",
  "origemNome": "O nome sugere uma referência a Monte Castello, associado à campanha brasileira na Segunda Guerra. Essa relação é uma hipótese; as fontes do bairro consultadas documentam suas ruas e ocupação, sem explicar o ato de batismo.",
  "historia": "Monte Castelo cresceu perto do Jardim Paulista e do córrego Lavapés. Suas ruas já aparecem em leis dos anos 1950: Henrique Dias e Guararapes foram denominadas em 1950; Maestro Francisco Gaia, em 1958. O Projeto Ruas, do acervo Pró-Memória da Câmara, reúne esses registros.\n\nAs lembranças do bairro também estão nas fotografias. Uma coleção publicada pelo São José dos Campos Antigamente mostra Carlinhos Carambola e João Batista Cândido na Rua Vinte e Sete de Julho, em 1976, além do bar de Dona Durvalina e Chico. São registros de moradores, futebol e comércio de vizinhança.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "O bairro nas ruas e nas fotografias",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
      "nota": "Parágrafo sobre Monte Castelo e bairros próximos do Jardim Paulista e do córrego Lavapés.",
      "acesso": "4 out. 2026.",
      "pagina": "68 do PDF",
      "paginaPdf": 68
    },
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Projeto Ruas – Ruas do Monte Castelo. São José dos Campos: Pró-Memória, 21 jan. 2025.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/2025/01/21/projeto-ruas-ruas-do-monte-castelo/",
      "nota": "Seções Henrique Dias, Guararapes e Maestro Francisco Gaia: leis de 1950 e 1958.",
      "acesso": "4 out. 2026."
    },
    {
      "referencia": "SÃO JOSÉ DOS CAMPOS ANTIGAMENTE. Bairro Monte Castelo – Década de 1970. São José dos Campos, [s.d.].",
      "url": "https://www.sjcantigamente.com.br/bairro-monte-castelo-decada-de-1970/",
      "nota": "Fotografias e legendas sobre moradores na Rua Vinte e Sete de Julho em 1976 e o bar de Dona Durvalina.",
      "acesso": "4 out. 2026."
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-vila-maria",
  "nome": "Vila Maria",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Formação nos anos 1930; loteamento citado em 1945",
  "origemNome": "Vila Maria é o nome pelo qual essa ocupação próxima à ferrovia se consolidou. As fontes encontradas ligam suas terras à família Domingues de Vasconcelos, mas não identificam qual Maria teria dado nome ao bairro.",
    "historia": "A mudança da linha ferroviária ajudou a formar a Vila Maria. Segundo os relatos reunidos pela TV Câmara, a fazenda da família Domingues de Vasconcelos foi loteada na década de 1930 para a passagem do novo traçado. Já o estudo de Gabriel Ferreira situa o loteamento em 1945, perto da estação. As fontes apresentam datas diferentes para essa formação.\n\nA memória do bairro aparece também nos nomes das ruas. Mário Galvão, que dá nome a uma avenida, foi médico em São José e vereador entre 1911 e 1913. O Projeto Ruas, do acervo Pró-Memória da Câmara, reúne sua trajetória e as de outros homenageados.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "A ferrovia abriu caminho para o bairro",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Programa da TV Câmara mostra a conexão afetiva dos moradores com a região onde vivem. São José dos Campos, 6 jan. 2023.",
      "url": "https://www.camarasjc.sp.gov.br/noticias/8038/programa-da-tv-camara-mostra-a-conexao-afetiva-dos-moradores-com-a-regiao-onde-vivem",
      "nota": "Apresentação do programa Histórias do Meu Bairro, baseado em lembranças de moradores. As passagens sobre Jardim Paulista, São Dimas e Vila Maria estão no corpo da notícia.",
      "acesso": "4 out. 2026."
    },
    {
      "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
      "nota": "Parágrafo que registra Vila Maria próxima à estação ferroviária, em 1945.",
      "acesso": "4 out. 2026.",
      "pagina": "55 do PDF",
      "paginaPdf": 55
    },
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Projeto Ruas – Ruas da Vila Maria: Avenida Dr. Mário Galvão, Rua Dr. Aleixo Mascarenhas e Rua Serafim Dias Machado. São José dos Campos: Pró-Memória, 12 nov. 2024.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/2024/11/12/projeto-ruas-ruas-da-vila-maria-avenida-dr-mario-galvao-rua-dr-aleixo-mascarenhas-e-rua-serafim-dias-machado/",
      "nota": "Seção Avenida Doutor Mário Galvão: atuação médica e mandato como vereador.",
      "acesso": "4 out. 2026."
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-jardim-paulista",
  "nome": "Jardim Paulista",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Loteamento citado em 1948",
  "origemNome": "“Paulista” remete a São Paulo e a seus habitantes. Essa leitura do nome não esclarece quem o escolheu. O registro histórico mais específico encontrado liga o loteamento de 1948 ao antigo Bairro do Régio.",
  "historia": "O Jardim Paulista foi loteado em 1948, na região antes conhecida como Bairro do Régio. Nas lembranças reunidas pela TV Câmara, a área ainda era um pasto de gado até os anos 1950, e o asfalto chegou cerca de duas décadas depois.\n\nO estádio Martins Pereira e a rodoviária passaram a fazer parte dessa paisagem. O estudo de Gabriel Ferreira descreve como o terminal rodoviário trouxe outra função ao bairro: receber viagens intermunicipais e interestaduais e dividir essa demanda com o terminal do Centro.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "Do pasto ao estádio e à rodoviária",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
      "nota": "Parágrafo sobre Jardim Paulista, Bairro do Régio e loteamento em 1948.",
      "acesso": "4 out. 2026.",
      "pagina": "55 do PDF",
      "paginaPdf": 55
    },
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Programa da TV Câmara mostra a conexão afetiva dos moradores com a região onde vivem. São José dos Campos, 6 jan. 2023.",
      "url": "https://www.camarasjc.sp.gov.br/noticias/8038/programa-da-tv-camara-mostra-a-conexao-afetiva-dos-moradores-com-a-regiao-onde-vivem",
      "nota": "Apresentação do programa Histórias do Meu Bairro, baseado em lembranças de moradores. As passagens sobre Jardim Paulista, São Dimas e Vila Maria estão no corpo da notícia.",
      "acesso": "4 out. 2026."
    },
    {
      "referencia": "FERREIRA, Gabriel Henrique dos Santos. O processo histórico de urbanização de São José dos Campos entre 1940 e 2000. 2024. Trabalho de Graduação (História) — Universidade do Vale do Paraíba, São José dos Campos, 2024.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf",
      "nota": "Passagem sobre o Terminal Rodoviário no Jardim Paulista e a reorganização das viagens intermunicipais e interestaduais.",
      "acesso": "4 out. 2026.",
      "pagina": "92 do PDF",
      "paginaPdf": 92
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
},
{
  "id": "bairro-jardim-augusta",
  "nome": "Jardim Augusta",
  "regiaoId": "centro",
  "regiaoNome": "Região Central",
  "periodo": "Projeto aprovado em 16 de agosto de 1955",
    "origemNome": "Augusta já consta na planta aprovada em 1955. O documento permite localizar o nome no tempo, mas não identifica quem o escolheu ou uma pessoa homenageada.",
  "historia": "A planta do Jardim Augusta registra a aprovação em 16 de agosto de 1955. Roma, Lisboa, Haia, Berna e outras cidades deram nome às ruas; Berlim, Londres e Paris aparecem nas praças. As fotografias de Maria Abigail Arruda Miguel, publicadas pelo Pró-Memória, acervo histórico da Câmara, mostram a Praça Berlim nos anos 1970 e em abril de 1981.\n\nO comércio também conta essa história. O jornalista Xandu Alves registra que José Fernandez Marful, o Pepe, estava no endereço do Jardim Augusta desde 1976. Quando se despediu do balcão em 2022, havia passado 46 anos atendendo ali.",
  "curiosidade": "",
  "fonte": "",
  "fonteUrl": "",
  "tituloHistoria": "Ruas de cidades e histórias de balcão",
  "fichaHistoria": [],
  "fontesRevisadas": [
    {
      "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Jardim Augusta: planta do loteamento. São José dos Campos: Prefeitura, [s.d.]. 1 mapa.",
      "url": "https://servicos.sjc.sp.gov.br/Mapas_de_loteamentos/Arquivos/augusta_jd.pdf",
      "nota": "Carimbo inferior direito: aprovação em 16-08-55. Ruas e praças com nomes de cidades.",
      "acesso": "4 out. 2026.",
      "pagina": "1 do PDF",
      "paginaPdf": 1
    },
    {
      "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Projeto Ruas – O Jardim Augusta nos anos 1980. São José dos Campos: Pró-Memória, 11 fev. 2025.",
      "url": "https://www.camarasjc.sp.gov.br/promemoria/2025/02/11/projeto-ruas-o-jardim-augusta-nos-anos-1980/",
      "nota": "Fotografias do acervo de Maria Abigail Arruda Miguel, com legendas da Praça Berlim nos anos 1970 e em abril de 1981.",
      "acesso": "4 out. 2026."
    },
    {
      "referencia": "ALVES, Xandu. Após 46 anos no Jardim Augusta, Pepe se despede do bar que leva seu nome em São José. OVALE, São José dos Campos, 2 ago. 2022.",
      "url": "https://sampi.net.br/ovale/noticias/754842/ovale/2022/08/apos-46-anos-no-jardim-augusta-pepe-se-despede-do-bar-que-leva-seu-nome-em-s-o-jose",
      "nota": "Parágrafo sobre a permanência no endereço do Jardim Augusta desde 1976. A compra de um bar em 1967 se refere a uma etapa anterior.",
      "acesso": "4 out. 2026."
    }
  ],
  "loteRevisao": "centro-2026-10-04",
  "tituloOrigem": "Sobre o nome",
  "contextoFonte": ""
}
]
};
