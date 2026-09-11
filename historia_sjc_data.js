/**
 * Base de Dados Estruturada — História de São José dos Campos (SP)
 * Extraída e curada a partir do Dossiê Histórico Oficial (historia_sjc)
 * Recorte: Século XVI até 17 de junho de 2026.
 */

window.HISTORIA_SJC_DATA = {
  epocas: [
    { id: "all", nome: "Todas as Épocas (1564 – 2026)" },
    { id: "colonial", nome: "Período Colonial & Elevação a Vila (1564 – 1863)", minAno: 1500, maxAno: 1863 },
    { id: "sanatorial", nome: "Elevação a Cidade & Fase Sanatorial (1864 – 1945)", minAno: 1864, maxAno: 1945 },
    { id: "tecnologica", nome: "Era Tecnológica & Aeroespacial (1946 – 2000)", minAno: 1946, maxAno: 2000 },
    { id: "contemporanea", nome: "Século XXI & Cidade Inteligente (2001 – 2026)", minAno: 2001, maxAno: 2026 }
  ],

  eixos: [
    { id: "all", nome: "Todos os Eixos Temáticos", icon: "fa-cubes" },
    { id: "fundacao", nome: "Fundação & Política", icon: "fa-landmark" },
    { id: "saude", nome: "Saúde & Sanatórios", icon: "fa-notes-medical" },
    { id: "ciencia", nome: "Educação, Ciência & Aviação", icon: "fa-plane-departure" },
    { id: "cultura", nome: "Cultura & Patrimônio", icon: "fa-masks-theater" },
    { id: "ambiente", nome: "Meio Ambiente & Urbano", icon: "fa-leaf" },
    { id: "trabalho", nome: "Trabalho & Memória Social", icon: "fa-industry" }
  ],

  confianca: [
    { id: "all", nome: "Todos os Níveis de Confiança" },
    { id: "CONFIRMADO", nome: "CONFIRMADO (Fonte Oficial/Normativa)" },
    { id: "CONFIRMADO — fonte secundária", nome: "CONFIRMADO (Fonte Secundária)" },
    { id: "HIPÓTESE", nome: "HIPÓTESE / Tradição Oral" },
    { id: "CONFLITO", nome: "CONFLITO / Divergência de Fontes" },
    { id: "LACUNA", nome: "LACUNA / A Verificar" }
  ],

  marcosAnosDestaque: [1767, 1864, 1924, 1935, 1950, 1969, 1996, 2006, 2022, 2026],

  eventos: [
    {
      id: "ev-1564",
      ano: 1564,
      periodo: "Segunda metade do século XVI (provavelmente 1564)",
      situacao: "HIPÓTESE / CONFLITO",
      eixo: "fundacao",
      titulo: "Primeiro Aldeamento Indígena (Aldeia de São José do Rio Comprido)",
      resumo: "Primeiro núcleo populacional associado ao atual município, ligado à Aldeia de São José do Rio Comprido, com indígenas Guaianazes e fazenda jesuítica de gado. A Prefeitura menciona 'final do século XVI'; a Câmara/Pró-Memória também apresenta a faixa 1600–1650.",
      detalhes: "Não há ato primário localizado que confirme o ano exato de 1564. Trata-se de uma hipótese historiográfica fundada em relatórios jesuíticos posteriores.",
      fontes: "Pró-Memória / Prefeitura de São José dos Campos",
      destaque: true,
      badgeColor: "amber"
    },
    {
      id: "ev-1611",
      ano: 1611,
      periodo: "10/09/1611",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Regulamentação dos Aldeamentos Indígenas",
      resumo: "Lei portuguesa regulamentou os aldeamentos indígenas no Brasil colonial; a narrativa municipal registra a expulsão temporária dos jesuítas e a dispersão dos aldeãos. O núcleo posteriormente deslocou-se para a planície onde hoje está a Igreja Matriz.",
      detalhes: "Esse marco normativo influenciou a reorganização dos territórios indígenas no Vale do Paraíba.",
      fontes: "Pró-Memória / Arquivo Histórico",
      destaque: false,
      badgeColor: "blue"
    },
    {
      id: "ev-1650",
      ano: 1650,
      periodo: "1650",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Atribuição da Sesmaria Colonial",
      resumo: "Concessão de sesmaria atribuída a Ângelo Siqueira Afonso, Antônia Pedrosa de Moraes e Francisco João Leme, com o estabelecimento de capela e fazenda na região.",
      detalhes: "Primeira delimitação jurídica de terras no território do atual município registrada em certidões coloniais.",
      fontes: "Pró-Memória SJC",
      destaque: false,
      badgeColor: "blue"
    },
    {
      id: "ev-1692",
      ano: 1692,
      periodo: "1692 – 1696",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Denominação 'Residência de São José'",
      resumo: "O núcleo passa a constar oficialmente nas atas jesuíticas como 'Residência do Paraíba do Sul' e posteriormente 'Residência de São José', consolidando a denominação colonial da localidade.",
      detalhes: "Registros paroquiais e administrativos confirmam a estabilização do nome de São José.",
      fontes: "Pró-Memória / Acervo Paroquial",
      destaque: false,
      badgeColor: "blue"
    },
    {
      id: "ev-1767",
      ano: 1767,
      periodo: "27/07/1767",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Ereção da Vila de São José do Paraíba (Emancipação)",
      resumo: "Por ordem do governador Morgado de Mateus, o ouvidor Salvador Pereira da Silva lavrou o auto de ereção da Vila de São José do Paraíba, com pelourinho, instalação da Câmara Municipal, juízes e vereadores. 27/07 é o marco oficial comemorado da emancipação político-administrativa.",
      detalhes: "A data de 27 de julho é celebrada anualmente como o aniversário de fundação da Vila e emancipação da cidade.",
      fontes: "Auto de Ereção da Vila / Pró-Memória / Câmara Municipal",
      destaque: true,
      badgeColor: "emerald"
    },
    {
      id: "ev-1828",
      ano: 1828,
      periodo: "1828",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Criação da Primeira Escola Pública Municipal",
      resumo: "Instituição da primeira escola pública de primeiras letras no município, marcando o início da rede de ensino público oficial em São José dos Campos.",
      detalhes: "Documentado nas atas da província e livros de despesas públicas.",
      fontes: "Câmara Municipal / Acervo Escolar",
      destaque: false,
      badgeColor: "indigo"
    },
    {
      id: "ev-1864",
      ano: 1864,
      periodo: "22/04/1864",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Elevação da Vila à Categoria de Cidade",
      resumo: "A Lei Provincial nº 27 elevou a antiga Vila de São José do Paraíba à categoria de Cidade de São José dos Campos.",
      detalhes: "O crescimento da produção agrícola de algodão e café impulsionou a transformação administrativa e urbana.",
      fontes: "Lei Provincial nº 27 / ALESP",
      destaque: true,
      badgeColor: "emerald"
    },
    {
      id: "ev-1871",
      ano: 1871,
      periodo: "1871 – 1877",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Denominação Oficial & Chegada da Estrada de Ferro",
      resumo: "A Lei Provincial nº 47 adotou o nome definitivo 'São José dos Campos'. Em 1872 criou-se a Comarca (com 12.998 habitantes, dos quais 1.245 escravizados). Em 1877 chegou o primeiro comboio da Estrada de Ferro Central do Brasil vindo de Jacareí.",
      detalhes: "A ferrovia conectou São José dos Campos aos grandes centros econômicos do Rio de Janeiro e São Paulo.",
      fontes: "ALESP / IBGE / Pró-Memória",
      destaque: true,
      badgeColor: "purple"
    },
    {
      id: "ev-1910",
      ano: 1910,
      periodo: "1910",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Inauguração da Escola Olímpio Catão",
      resumo: "Construção do tradicional Grupo Escolar Olímpio Catão na região central, um marco arquitetônico e educacional do Estado de São Paulo na cidade.",
      detalhes: "Edifício tombado pelo patrimônio histórico e símbolo da instrução pública na primeira metade do século XX.",
      fontes: "Pró-Memória / COMPHAC",
      destaque: false,
      badgeColor: "indigo"
    },
    {
      id: "ev-1923",
      ano: 1923,
      periodo: "1923",
      situacao: "CONFIRMADO",
      eixo: "cultura",
      titulo: "Inauguração do Mercado Municipal de São José dos Campos",
      resumo: "Abertura do Mercado Municipal no centro da cidade, tornando-se o coração do comércio popular, hortifrutigranjeiros e produtos típicos da região do Vale do Paraíba.",
      detalhes: "Local histórico de convivência comunitária preservado até os dias atuais.",
      fontes: "Prefeitura de SJC / Pró-Memória",
      destaque: false,
      badgeColor: "rose"
    },
    {
      id: "ev-1924",
      ano: 1924,
      periodo: "27/04/1924",
      situacao: "CONFIRMADO",
      eixo: "saude",
      titulo: "Inauguração do Sanatório Vicentina Aranha (Início da Fase Sanatorial)",
      resumo: "Abertura do Sanatório Vicentina Aranha, um dos maiores complexos para tratamento da tuberculose da América Latina. Marca a consolidação de SJC como Estância Climática de referência médica nacional.",
      detalhes: "O clima seco e montanhoso atraiu milhares de doentes de todo o Brasil, transformando a demografia, a arquitetura e os serviços de saúde da cidade.",
      fontes: "Fundação Cultural Cassiano Ricardo / Parque Vicentina Aranha",
      destaque: true,
      badgeColor: "rose"
    },
    {
      id: "ev-1925",
      ano: 1925,
      periodo: "1925 – 1926",
      situacao: "CONFIRMADO",
      eixo: "trabalho",
      titulo: "Instalação da Tecelagem Parahyba",
      resumo: "Início da construção e operação da Tecelagem Parahyba, que se tornaria uma das maiores indústrias têxteis do país, famosa mundialmente pela produção dos cobertores Parahyba.",
      detalhes: "O complexo industrial e habitacional marcou a história operária e o desenvolvimento do bairro de Santana.",
      fontes: "Pró-Memória / Acervo Tecelagem Parahyba",
      destaque: true,
      badgeColor: "amber"
    },
    {
      id: "ev-1932",
      ano: 1932,
      periodo: "1932",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Revolução Constitucionalista & Morte de Euclides Miragaia",
      resumo: "Participação joseense na Revolução Constitucionalista de 1932. O estudante joseense Euclides Miragaia foi morto em combate, tornando-se uma das quatro letras da sigla M.M.D.C. (símbolo do movimento paulista).",
      detalhes: "Miragaia é homenageado em praças e avenidas como símbolo histórico da juventude e da autonomia constitucionalista.",
      fontes: "Pró-Memória / Acervo MMDC",
      destaque: true,
      badgeColor: "purple"
    },
    {
      id: "ev-1935",
      ano: 1935,
      periodo: "12/03/1935 – 16/12/1935",
      situacao: "CONFIRMADO",
      eixo: "saude",
      titulo: "Classificação Oficial como Estância Climática e Hidromineral",
      resumo: "São José dos Campos é oficialmente declarada Estância Climática (12/03) e Hidromineral (16/12/1935) pelo Estado de São Paulo. A Lei nº 2.484 established a nomeação direta dos prefeitos pelo Governador do Estado durante a fase sanitária.",
      detalhes: "Esse estatuto especial de saúde durou até a redemocratização e retomada eleitoral em 1958.",
      fontes: "Lei Estadual nº 2.484/1935 / ALESP",
      destaque: false,
      badgeColor: "blue"
    },
    {
      id: "ev-1947",
      ano: 1947,
      periodo: "1946 – 1947",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Doação de Terrenos para a Instalação do CTA",
      resumo: "Criação da Comissão Organizadora do Centro Técnico de Aeronáutica (COCTA). Sob gestão do prefeito Jorge Zarur, o município viabilizou a doação das áreas para a instalação do complexo aeronáutico militar e de ensino.",
      detalhes: "Passo decisivo para a escolha de São José dos Campos como a capital da aviação brasileira.",
      fontes: "Histórico DCTA / ITA / Prefeitura de SJC",
      destaque: true,
      badgeColor: "cyan"
    },
    {
      id: "ev-1950",
      ano: 1950,
      periodo: "16/01/1950",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Criação e Transferência do ITA (Instituto Tecnológico de Aeronáutica)",
      resumo: "Criado pelo Decreto Federal nº 27.695 sob a liderança do Marechal Casimiro Montenegro Filho, o Instituto Tecnológico de Aeronáutica (ITA) é transferido para São José dos Campos. O campus foi desenhado pelo arquiteto Oscar Niemeyer.",
      detalhes: "O ITA tornou-se o mais prestigiado centro de formação de engenheiros aeronáuticos e de ponta do Brasil.",
      fontes: "Acervo Institucional ITA / DCTA",
      destaque: true,
      badgeColor: "cyan"
    },
    {
      id: "ev-1951",
      ano: 1951,
      periodo: "1951",
      situacao: "CONFIRMADO",
      eixo: "ambiente",
      titulo: "Inauguração da Rodovia Presidente Dutra (BR-116)",
      resumo: "Abertura oficial da Rodovia Presidente Dutra conectando São Paulo ao Rio de Janeiro e cortando São José dos Campos. A rodovia acelerou a atração de multinacionais químicas, automobilísticas e farmacêuticas.",
      detalhes: "Decisiva para o ciclo de industrialização acelerada (Johnson & Johnson em 1952, General Motors em 1959, Rhodia em 1946).",
      fontes: "DNIT / IBGE / Pró-Memória",
      destaque: true,
      badgeColor: "amber"
    },
    {
      id: "ev-1961",
      ano: 1961,
      periodo: "03/08/1961 – 1971",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Criação do INPE (Instituto Nacional de Pesquisas Espaciais)",
      resumo: "Criação do Grupo de Organização da Comissão Nacional de Atividades Espaciais (GOCNAE), berço do Instituto Nacional de Pesquisas Espaciais (INPE), oficializado sob direção do cientista Dr. Fernando de Mendonça em 1971.",
      detalhes: "Transformou São José dos Campos no polo nacional de pesquisas espaciais, meteorologia avançada, dados de queimadas e sensoriamento remoto.",
      fontes: "Linha do Tempo INPE 50 Anos",
      destaque: true,
      badgeColor: "cyan"
    },
    {
      id: "ev-1969",
      ano: 1969,
      periodo: "19/08/1969",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Fundação da EMBRAER (Empresa Brasileira de Aeronáutica)",
      resumo: "Decreto presidencial autorizou a criação da Embraer em São José dos Campos sob a liderança do engenheiro do ITA Ozires Silva, para fabricar em série o avião Bandeirante (EMB-110).",
      detalhes: "A Embraer tornou-se uma das maiores fabricantes de jatos comerciais e de defesa do planeta, consolidando a cidade como a Capital Aeroespacial do Brasil.",
      fontes: "Acervo Embraer / DCTA / Pró-Memória",
      destaque: true,
      badgeColor: "cyan"
    },
    {
      id: "ev-1982",
      ano: 1982,
      periodo: "1982",
      situacao: "CONFIRMADO",
      eixo: "ambiente",
      titulo: "Criação da APA Mananciais do Rio Paraíba do Sul",
      resumo: "Decreto Federal nº 87.561 instituiu a Área de Proteção Ambiental (APA) para preservar os recursos hídricos, a vegetação nativa e as bacias receptoras da região do Vale do Paraíba.",
      detalhes: "Marco divisor de águas para a sustentabilidade e o zoneamento ambiental do município.",
      fontes: "Legislação Ambiental Federal / SEAB",
      destaque: false,
      badgeColor: "emerald"
    },
    {
      id: "ev-1992",
      ano: 1992,
      periodo: "1992",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Transformação da FVE na UNIVAP (Universidade do Vale do Paraíba)",
      resumo: "A Fundação Valeparaibana de Ensino (FVE) atinge o status pleno de Universidade, consolidando a UNIVAP como grande centro formador de ensino superior e pesquisa tecnológica na região.",
      detalhes: "Crucial para a expansão de programas acadêmicos e repositórios históricos regionais como o CEHVAP.",
      fontes: "Repositório UNIVAP",
      destaque: false,
      badgeColor: "indigo"
    },
    {
      id: "ev-1993",
      ano: 1993,
      periodo: "09/02/1993",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Lançamento do SCD-1 (Primeiro Satélite Brasileiro)",
      resumo: "O INPE lança o Satélite de Coleta de Dados SCD-1, primeiro satélite desenvolvido e operado integralmente pelo Brasil, projetado por cientistas e engenheiros joseenses.",
      detalhes: "O SCD-1 permanece em operação até hoje, batendo recordes mundiais de longevidade orbital.",
      fontes: "INPE / Ministério da Ciência e Tecnologia",
      destaque: true,
      badgeColor: "cyan"
    },
    {
      id: "ev-1996",
      ano: 1996,
      periodo: "27/07/1996",
      situacao: "CONFIRMADO",
      eixo: "ambiente",
      titulo: "Inauguração do Parque da Cidade Roberto Burle Marx",
      resumo: "Inauguração do Parque da Cidade nos jardins da antiga Tecelagem Parahyba, com projeto paisagístico concebido por Roberto Burle Marx, abrigando palacetes históricos e vasta área verde.",
      detalhes: "Tombado pelo COMPHAC, é o maior parque público urbano de lazer e contemplação de São José dos Campos.",
      fontes: "Prefeitura de SJC / COMPHAC",
      destaque: true,
      badgeColor: "emerald"
    },
    {
      id: "ev-2006",
      ano: 2006,
      periodo: "2006 – 2009",
      situacao: "CONFIRMADO",
      eixo: "ciencia",
      titulo: "Criação do Parque Tecnológico de São José dos Campos",
      resumo: "Instituído o Parque Tecnológico de SJC, o primeiro do Estado de São Paulo, reunindo empresas de tecnologia, universidades (UNESP, UNIFESP, FATEC, ITA), centros de P&D e incubadoras de inovação.",
      detalhes: "Referência nacional em fomento à biotecnologia, TIC, cibersegurança e manufatura aeroespacial avançada.",
      fontes: "Associação Parque Tecnológico SJC",
      destaque: true,
      badgeColor: "cyan"
    },
    {
      id: "ev-2012",
      ano: 2012,
      periodo: "28/06/2012",
      situacao: "CONFIRMADO",
      eixo: "ambiente",
      titulo: "Criação do Parque Natural Municipal do Banhado",
      resumo: "A Lei nº 8.756 oficializou a criação do Parque Natural Municipal do Banhado, protegendo uma área de mais de 1,5 milhão de metros quadrados do ecossistema e do anfiteatro natural símbolo da cidade.",
      detalhes: "O Banhado é o maior cartão-postal ecológico e paisagístico do centro de São José dos Campos.",
      fontes: "Lei Municipal nº 8.756/2012",
      destaque: true,
      badgeColor: "emerald"
    },
    {
      id: "ev-2018",
      ano: 2018,
      periodo: "30/11/2018",
      situacao: "CONFIRMADO",
      eixo: "ambiente",
      titulo: "Aprovação do Novo Plano Diretor (PDDI - Lei nº 612)",
      resumo: "Promulgação da Lei Complementar nº 612/2018 que instituiu o Plano Diretor de Desenvolvimento Integrado (PDDI), orientando o crescimento sustentável, mobilidade e zoneamento urbano até 2030.",
      detalhes: "Foco em mobilidade limpa, adensamento vertical consciente e preservação de unidades de conservação.",
      fontes: "Câmara Municipal / Prefeitura de SJC",
      destaque: false,
      badgeColor: "blue"
    },
    {
      id: "ev-2022",
      ano: 2022,
      periodo: "Março de 2022",
      situacao: "CONFIRMADO COM AUTODECLARAÇÃO A CONFERIR",
      eixo: "ciencia",
      titulo: "Primeira Cidade Inteligente Certificada do Brasil (ABNT/ISO)",
      resumo: "São José dos Campos recebe a certificação de Cidade Inteligente, Resiliente e Sustentável conforme as normas ISO 37120, ISO 37122 e ISO 37125, concedida pela ABNT.",
      detalhes: "Destaca projetos de frota 100% elétrica no transporte coletivo (Linha Verde), videomonitoramento por IA (CSI) e iluminação pública de LED.",
      fontes: "Prefeitura de SJC / ABNT",
      destaque: true,
      badgeColor: "purple"
    },
    {
      id: "ev-2026",
      ano: 2026,
      periodo: "16/06/2026",
      situacao: "CONFIRMADO",
      eixo: "fundacao",
      titulo: "Liderança da Rede Latino-Americana de Cidades Inteligentes (FLACMA)",
      resumo: "São José dos Campos assume a presidência/liderança executiva da Rede Latino-Americana de Cidades Inteligentes vinculada à FLACMA, compartilhando seu modelo tecnológico de gestão com municípios da América Latina.",
      detalhes: "Marco final do recorte factual documentado no dossiê de memórias municipais.",
      fontes: "Portal da Prefeitura Municipal de SJC (Notícia 16/06/2026)",
      destaque: true,
      badgeColor: "emerald"
    }
  ],

  personalidades: [
    {
      nome: "Ozires Silva",
      cargo: "Fundador da Embraer & Engenheiro do ITA",
      descricao: "Engenheiro aeronáutico formado pelo ITA, liderou a criação da Embraer em 1969 e a produção industrial do Bandeirante, tornando SJC o polo de aviação comercial do hemisfério sul.",
      tag: "Aviação & Indústria",
      cor: "cyan"
    },
    {
      nome: "Marechal Casimiro Montenegro Filho",
      cargo: "Idealizador do CTA e do ITA",
      descricao: "Militar e visionário que concebeu a criação do Centro Técnico de Aeronáutica (CTA) e do Instituto Tecnológico de Aeronáutica (ITA), atraindo cérebros mundiais para São José.",
      tag: "Ciência & Ensino",
      cor: "indigo"
    },
    {
      nome: "Dr. Fernando de Mendonça",
      cargo: "Primeiro Diretor e Fundador do INPE",
      descricao: "Cientista que liderou o desenvolvimento das atividades espaciais no Brasil a partir de 1961, consolidando o INPE em São José dos Campos.",
      tag: "Pesquisa Espacial",
      cor: "blue"
    },
    {
      nome: "Cassiano Ricardo",
      cargo: "Poeta, Jornalista e Imortal da ABL",
      descricao: "Nascido em São José dos Campos em 1895, é um dos mais renomados poetas do Modernismo brasileiro e patrono da Biblioteca Pública Municipal.",
      tag: "Literatura & Poesia",
      cor: "rose"
    },
    {
      nome: "Vicentina de Queiroz Aranha",
      cargo: "Patrona Filantrópica do Sanatório",
      descricao: "Filantropa cuja dedicação deu nome ao Sanatório Vicentina Aranha em 1924, símbolo de acolhimento e tratamento de saúde na fase sanatorial.",
      tag: "Saúde & Filantropia",
      cor: "purple"
    },
    {
      nome: "Zé Mira",
      cargo: "Mestre Tropeiro e Guardião da Cultura Popular",
      descricao: "Liderança tradicional que preservou e divulgou a Folia de Reis, Jongo, Congada e a Orquestra de Viola Caipira no Vale do Paraíba.",
      tag: "Cultura Popular",
      cor: "amber"
    },
    {
      nome: "Euclides Miragaia",
      cargo: "Herói Constitucionalista de 1932 (M.M.D.C.)",
      descricao: "Jovem estudante joseense que tombou em combate na Revolução de 1932, tornando-se o 'M' do épico movimento paulista M.M.D.C.",
      tag: "Memória Cívica",
      cor: "purple"
    },
    {
      nome: "Affonso Berardinelli Tarantino",
      cargo: "Médico Pneumologista Pioneiro",
      descricao: "Pneumologista que dedicou sua vida ao tratamento dos enfermos do Sanatório Vicentina Aranha, deixando valioso acervo de história oral.",
      tag: "Medicina",
      cor: "emerald"
    }
  ],

  prefeitos: [
    { periodo: "1798 – 1805", nome: "Tomé Alves Alvarenga", cargo: "Primeiro Prefeito/Alcaide da Série", acesso: "Nomeado / Alcaide", situacao: "CONFIRMADO (Série Compilada)" },
    { periodo: "1806 – 1817", nome: "Joaquim Antônio Cabral", cargo: "Titular", acesso: "Não localizada", situacao: "CONFIRMADO — fonte secundária" },
    { periodo: "1834 – 1838", nome: "Manoel Joaquim de Andrade", cargo: "Titular", acesso: "Não localizada", situacao: "CONFIRMADO — fonte secundária" },
    { periodo: "1839 – 1888", nome: "Lacuna Documental Nominal", cargo: "Período com falta de atos primários", acesso: "A verificar nas Atas da Câmara", situacao: "LACUNA DOCUMENTAL" },
    { periodo: "1890 – 1893", nome: "Francisco Oliveira Lima", cargo: "Conselheiro Intendência", acesso: "Intendente", situacao: "CONFIRMADO" },
    { periodo: "1918 – 1930", nome: "João Alves da Silva Cursino", cargo: "Titular", acesso: "Eleito / Intendente", situacao: "CONFIRMADO" },
    { periodo: "1930", nome: "Rui Rodrigues Dória, Antônio Cerdeira e Austin Tibiriça", cargo: "Junta Governativa", acesso: "Governo Colegiado", situacao: "CONFIRMADO" },
    { periodo: "1938 – 1941", nome: "Francisco José Longo", cargo: "Prefeito Sanitário", acesso: "Nomeado pelo Governador", situacao: "CONFIRMADO (Estância)" },
    { periodo: "1942 – 1947", nome: "Pedro Popini Mascarenhas", cargo: "Prefeito Sanitário", acesso: "Nomeado", situacao: "CONFIRMADO" },
    { periodo: "1947", nome: "Jorge Zarur", cargo: "Prefeito Sanitário", acesso: "Nomeado (Doou áreas do CTA)", situacao: "CONFIRMADO" },
    { periodo: "1958 – 1962", nome: "Elmano Ferreira Veloso", cargo: "Prefeito Eleito", acesso: "Eleito (Retomada Autonomia)", situacao: "CONFIRMADO" },
    { periodo: "1970 – 1975", nome: "Sérgio Sobral de Oliveira", cargo: "Prefeito Nomeado", acesso: "Nomeado (Regime Estância)", situacao: "CONFIRMADO" },
    { periodo: "1978 – 1982", nome: "Joaquim Vicente Ferreira Bevilacqua", cargo: "Prefeito Eleito", acesso: "Eleição Direta", situacao: "CONFIRMADO" },
    { periodo: "1983 – 1986", nome: "Robson Riedel Marinho", cargo: "Prefeito Eleito", acesso: "Eleição Direta", situacao: "CONFIRMADO" },
    { periodo: "1993 – 1996", nome: "Angela Guadagnin", cargo: "Prefeita Eleita", acesso: "Primeira Mulher Eleita", situacao: "CONFIRMADO" },
    { periodo: "1997 – 2004", nome: "Emanuel Fernandes", cargo: "Prefeito Eleito (2 Mandatos)", acesso: "Eleito / Reeleito", situacao: "CONFIRMADO" },
    { periodo: "2005 – 2012", nome: "Eduardo Cury", cargo: "Prefeito Eleito (2 Mandatos)", acesso: "Eleito / Reeleito", situacao: "CONFIRMADO" },
    { periodo: "2013 – 2016", nome: "Carlinhos Almeida (Carlos José de Almeida)", cargo: "Prefeito Eleito", acesso: "Eleição Direta", situacao: "CONFIRMADO" },
    { periodo: "2017 – 2022", nome: "Felicio Ramuth", cargo: "Prefeito Eleito (Renunciou em 2022)", acesso: "Eleito / Reeleito", situacao: "CONFIRMADO" },
    { periodo: "2022 – 2028", nome: "Anderson Farias Ferreira", cargo: "Prefeito Reeleito", acesso: "Vice em Exercício / Eleito 2024", situacao: "CONFIRMADO (Exercício)" }
  ]
};
