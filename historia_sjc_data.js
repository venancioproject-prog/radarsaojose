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
      id: "bairro-santana",
      nome: "Santana",
      regiaoId: "norte",
      regiaoNome: "Zona Norte",
      periodo: "Século XVII (c. 1680)",
      origemNome: "Homenagem a Senhora Sant'Ana, padroeira da primeira capela colonial erguida na várzea do Rio Paraíba.",
      historia: "Berço original da colonização joseense após a transferência do aldeamento do Rio Comprido. Tornou-se o centro fabril da cidade nos anos 1920 com a Tecelagem Parahyba.",
      curiosidade: "Abriga o Parque da Cidade com jardins históricos de Burle Marx e a residência Olivo Gomes.",
      icone: "fa-landmark"
    },
    {
      id: "bairro-eugenio-melo",
      nome: "Eugênio de Melo",
      regiaoId: "leste",
      regiaoNome: "Zona Leste",
      periodo: "1877 (Século XIX)",
      origemNome: "Homenagem ao engenheiro militar Eugênio Adriano Pereira da Cunha e Mello, diretor da Estrada de Ferro Central do Brasil.",
      historia: "Desenvolveu-se ao redor da estação ferroviária inaugurada em 1877 para escoamento de café. Mais tarde transformou-se em distrito municipal e sede do Parque Tecnológico.",
      curiosidade: "O prédio da antiga estação ferroviária de tijolos aparentes é patrimônio municipal tombado.",
      icone: "fa-train"
    },
    {
      id: "bairro-aquarius",
      nome: "Jardim Aquarius",
      regiaoId: "oeste",
      regiaoNome: "Zona Oeste",
      periodo: "Anos 1990",
      origemNome: "Nome herdado da antiga 'Fazenda Aquarius', grande propriedade rural e criatório de cavalos que ocupava a região.",
      historia: "Planejado como polo vertical corporativo e residencial de alto padrão no final do século XX, tornou-se o centro financeiro e gastronômico moderno da cidade.",
      curiosidade: "A Praça Ulisses Guimarães no centro do bairro é um dos maiores pontos de convivência ao ar livre de SJC.",
      icone: "fa-building"
    },
    {
      id: "bairro-satelite",
      nome: "Jardim Satélite",
      regiaoId: "sul",
      regiaoNome: "Zona Sul",
      periodo: "Anos 1960 / 1970",
      origemNome: "Inspirado na corrida espacial e na vocação tecnológica da cidade; as ruas foram batizadas com nomes de constelações e astros.",
      historia: "Principal polo comercial da Zona Sul, o bairro nasceu de grandes loteamentos que acolheram os milhares de novos moradores atraídos pelas indústrias da Dutra.",
      curiosidade: "Todas as suas principais vias têm nomes astronômicos: Av. Andrômeda, Av. Cassiopeia, Av. Perseu.",
      icone: "fa-satellite"
    },
    {
      id: "bairro-putim",
      nome: "Putim",
      regiaoId: "sudeste",
      regiaoNome: "Zona Sudeste",
      periodo: "Século XIX / Anos 1970",
      origemNome: "Origem toponímica na antiga 'Fazenda do Putim' e na bacia do Córrego Putim-Alambari.",
      historia: "Área rural histórica de passagem entre o Vale e o Litoral Norte que se urbanizou aceleradamente a partir dos anos 1970 com loteamentos populares e industriais.",
      curiosidade: "É o portal de integração com a Rodovia dos Tamoios e via de acesso aos polos aeroespaciais.",
      icone: "fa-route"
    },
    {
      id: "bairro-urbanova",
      nome: "Urbanova",
      regiaoId: "oeste",
      regiaoNome: "Zona Oeste",
      periodo: "Anos 1980 / 1990",
      origemNome: "Acrônimo de 'Urbanização Nova', plano de ocupação de baixa densidade com respeito aos relevos naturais e ao Rio Paraíba.",
      historia: "Antiga fazenda de gado leiteiro que se transformou no maior polo de condomínios fechados horizontais e campus universitário da cidade.",
      curiosidade: "É cercado por meandros do Rio Paraíba do Sul e possui amplas áreas de preservação permanente.",
      icone: "fa-tree-city"
    },
    {
      id: "bairro-vila-ema",
      nome: "Vila Ema & Vila Adyana",
      regiaoId: "centro",
      regiaoNome: "Região Central",
      periodo: "Anos 1920 / 1930",
      origemNome: "Homenagem a Dona Ema e Adyana, figuras das famílias proprietárias dos loteamentos da fase sanatorial.",
      historia: "Bairros arborizados projetados para receber pensões e residências de médicos e pacientes que buscavam o clima ameno do Sanatório Vicentina Aranha.",
      curiosidade: "Preserva a arquitetura eclética e chalés da época de ouro da estância climatérica.",
      icone: "fa-hospital"
    },
    {
      id: "bairro-bosque-eucaliptos",
      nome: "Bosque dos Eucaliptos",
      regiaoId: "sul",
      regiaoNome: "Zona Sul",
      periodo: "Anos 1970",
      origemNome: "Devido aos densos eucaliptais cultivados na região para suprir lenha e celulose antes do loteamento.",
      historia: "Um dos bairros mais estruturados da Zona Sul, com praças largas, ciclovias e centros comerciais de bairro vibrantes.",
      curiosidade: "A Avenida Salinas e a Praça Floripes Bicudo são o coração esportivo da região.",
      icone: "fa-tree"
    },
    {
      id: "bairro-vista-verde",
      nome: "Jardim Vista Verde",
      regiaoId: "leste",
      regiaoNome: "Zona Leste",
      periodo: "Anos 1970",
      origemNome: "Referência à vista panorâmica da várzea do Rio Paraíba e das matas da Zona Leste.",
      historia: "Planejado como loteamento de padrão unifamiliar para engenheiros e técnicos que trabalhavam na General Motors e nas indústrias da Dutra.",
      curiosidade: "É conhecido pelo traçado sinuoso de suas ruas e praças ajardinadas com espécies nativas.",
      icone: "fa-leaf"
    },
    {
      id: "bairro-sfx-vila",
      nome: "Vila de São Francisco Xavier",
      regiaoId: "sfx",
      regiaoNome: "São Francisco Xavier",
      periodo: "1892 (Distrito)",
      origemNome: "Homenagem a São Francisco Xavier, jesuíta missionário cultuado pelos primeiros povoadores da serra.",
      historia: "Antigo pouso de tropas na rota de tropeiros entre Minas Gerais e o litoral. Manteve suas características bucólicas e tradições rurais vivas.",
      curiosidade: "Fica a mais de 720 metros de altitude e é polo gastronômico e ecoturístico de destaque estadual.",
      icone: "fa-mountain-sun"
    }
  ]
};

