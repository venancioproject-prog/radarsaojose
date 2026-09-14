/**
 * Radar São José - Módulo Radar DNA & Mesa Autêntica de Tarô
 * 60 Cartas Reais e Fidedignas de Tarô com Movimento Físico na Mesa
 * Header Padronizado 100% Idêntico às Outras Abas do Sistema
 */

(function () {
  const PERSONAS_SJC_DATA = [
  {
    "id": 1,
    "nome_completo": "Maria do Carmo Paes",
    "idade": 54,
    "genero_etnia": "Mulher Negra",
    "profissao": "Escrevente Judiciária do Fórum Central",
    "bairro": "Vila Ema",
    "localizacao": "Vila Ema, São José dos Campos",
    "regiao": "Centro",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro próprio",
    "historia_resumida": "Trabalha há mais de vinte anos no fórum central e construiu sua vida em torno da rotina estável de São José. Gosta de caminhar pelas ruas arborizadas da Vila Ema e valoriza atendimentos que prezam pelo olho no olho e pela palavra dada.",
    "dor_principal": "Mudanças bruscas no trânsito do centro e obras viárias que alteram suas rotas históricas de deslocamento diário.",
    "habitos": {
      "alimentacao": "Padarias tradicionais, almoço em restaurantes por quilo consolidados e feira livre de domingo.",
      "consumo": "Comércio de rua tradicional, lojas físicas onde conhece o dono há anos e compras estritamente planejadas.",
      "vestuario": "Alfaiataria clássica, tons neutros sóbrios e sapatos confortáveis para o expediente no tribunal.",
      "aversoes": "Atendimento automatizado por robôs de IA e estabelecimentos comerciais barulhentos.",
      "paixoes": "Caminhadas matinais no Parque Vicentina Aranha, jardinagem no quintal e café coado com as amigas de infância."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Padaria Nove de Julho",
      "Mercado Municipal de SJC"
    ],
    "veiculos_midia": [
      {
        "nome": "Rede Vanguarda (Globo)",
        "handle": "redevanguarda"
      },
      {
        "nome": "CBN Vale",
        "handle": "cbnvale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      },
      {
        "nome": "Parque Vicentina Aranha",
        "handle": "parquevicentina"
      }
    ],
    "estilo_consumo_tag": "Tradicional & Fidelidade",
    "foto": "data_personas/imagens_personagens/personagem_1_maria_do_carmo_paes.jpg"
  },
  {
    "id": 2,
    "nome_completo": "Roberto Alvarenga",
    "idade": 46,
    "genero_etnia": "Homem Branco",
    "profissao": "Diretor de Operações de Multinacional Tecnológica",
    "bairro": "Vila Adyana",
    "localizacao": "Vila Adyana, São José dos Campos",
    "regiao": "Centro",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Híbrido",
    "historia_resumida": "Paulistano radicado em SJC há doze anos em busca de segurança e blindagem para os filhos. Pratica ciclismo de estrada na Via Norte/Urbanova nas manhãs de sábado e comanda operações globais a partir do seu home office inteligente.",
    "dor_principal": "Gargalos severos no acesso à Ponte Estaiada nos horários de pico e falta de voos executivos diretos no aeroporto regional.",
    "habitos": {
      "alimentacao": "Empórios gourmets, carnes nobres de cortes especiais para churrasco e cartas de vinhos importados.",
      "consumo": "Assinaturas premium internacionais, tecnologia de automação residencial e serviços de concierge.",
      "vestuario": "Techwear executivo de marcas internacionais, camisas de linho italiano e relógio esportivo de alta precisão.",
      "aversoes": "Sensação de insegurança pública, prestadores de serviços amadores e filas de espera em restaurantes.",
      "paixoes": "Ciclismo de alta performance na estrada, enologia internacional e viagens de esqui com a família."
    },
    "lugares_frequenta_sjc": [
      "Colinas Shopping",
      "Empório da Vila Ema",
      "Thermas do Vale / Alphaville Club"
    ],
    "veiculos_midia": [
      {
        "nome": "Valor Econômico",
        "handle": "valoreconomico"
      },
      {
        "nome": "Life Informa Aquarius",
        "handle": "lifeinforma"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Lucas Sanseverino (Imóveis)",
        "handle": "lucassanseverino"
      },
      {
        "nome": "Pellegrini Wine",
        "handle": "pellegriniwine"
      }
    ],
    "estilo_consumo_tag": "Premium & Exclusividade",
    "foto": "data_personas/imagens_personagens/personagem_2_gilberto_alcantara_santos.jpg"
  },
  {
    "id": 3,
    "nome_completo": "Larissa Aparecida Souza",
    "idade": 24,
    "genero_etnia": "Mulher Parda",
    "profissao": "Trancista & Especialista em Alongamento de Unhas",
    "bairro": "Centro Histórico",
    "localizacao": "Centro Histórico, São José dos Campos",
    "regiao": "Centro",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Ônibus e Moto própria",
    "historia_resumida": "Começou atendendo a domicílio na zona sul e hoje possui seu próprio espaço montado na garagem de casa. Usa o Instagram e o WhatsApp com maestria para preencher a agenda semanal e reinveste todo lucro em cursos de aperfeiçoamento.",
    "dor_principal": "Oscilação brusca no faturamento na segunda quinzena do mês e a demora nas linhas alimentadoras de ônibus da zona sul.",
    "habitos": {
      "alimentacao": "Lanches rápidos prensados, delivery pelo iFood aos fins de semana e copos generosos de açaí com as clientes.",
      "consumo": "Insumos de beleza no atacado no centro da cidade e compras frequentes de roupas na Shein e Shopee.",
      "vestuario": "Moda jovem urbana, conjuntinhos streetwear confortáveis e unhas de gel impecavelmente decoradas.",
      "aversoes": "Clientes que desmarcam em cima da hora sem aviso e desvalorização do trabalho manual de estética.",
      "paixoes": "Gravar reels de transformação no TikTok, ouvir pagode no Spotify e passear no Shopping Jardim Oriente."
    },
    "lugares_frequenta_sjc": [
      "Shopping Jardim Oriente",
      "Feira da Av. Andrômeda",
      "Praça do Campo dos Alemães"
    ],
    "veiculos_midia": [
      {
        "nome": "Notícias SJC no Insta",
        "handle": "noticias_sjc"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Juliana Nails SJC",
        "handle": "juliananails_sjc"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Ágil & Digital Popular",
    "foto": "data_personas/imagens_personagens/personagem_3_kenji_takahashi.jpg"
  },
  {
    "id": 4,
    "nome_completo": "Dr. Gustavo Meirelles",
    "idade": 51,
    "genero_etnia": "Homem Branco",
    "profissao": "Cirurgião Ortopedista & Sócio de Clínica Médica",
    "bairro": "Jardim São Dimas",
    "localizacao": "Jardim São Dimas, São José dos Campos",
    "regiao": "Centro",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Sedan Executivo Alemão",
    "historia_resumida": "Formado em medicina de excelência, atende nos principais hospitais privados da cidade e mantém consultório conceituado na Vila Adyana. Vive no Esplanada pela proximidade com os colégios dos filhos e pela vizinhança tranquila.",
    "dor_principal": "Falta crônica de vagas de estacionamento rotativo para pacientes nas imediações do polo médico da Vila Adyana.",
    "habitos": {
      "alimentacao": "Culinária mediterrânea equilibrada, jantares em bistrôs autorais na Vila Ema e café espresso de grãos arábica.",
      "consumo": "Equipamentos cirúrgicos importados de última geração e investimentos estruturados em fundos imobiliários.",
      "vestuario": "Costume sob medida para congressos médicos e jaleco de alta alfaiataria hospitalar.",
      "aversoes": "Atrasos em reuniões de junta médica e fornecedores que não cumprem rigorosamente prazos contratuais.",
      "paixoes": "Partidas de tênis no Clube de Campo Santa Rita, corridas no Vicentina Aranha e leitura de biografias históricas."
    },
    "lugares_frequenta_sjc": [
      "Hospital Vivalle",
      "Parque Vicentina Aranha",
      "Clube de Campo Santa Rita"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Saúde Vale",
        "handle": "saudevalerevista"
      },
      {
        "nome": "CBN Vale",
        "handle": "cbnvale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Dr. Barakat",
        "handle": "doutorbarakat"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Prestígio & Tradição Médica",
    "foto": "data_personas/imagens_personagens/personagem_4_helena_ribeiro_de_camargo.jpg"
  },
  {
    "id": 5,
    "nome_completo": "Tiago Ramos",
    "idade": 29,
    "genero_etnia": "Homem Branco",
    "profissao": "Engenheiro de Inteligência Artificial & Tech Lead",
    "bairro": "Jardim Apolo",
    "localizacao": "Jardim Apolo, São José dos Campos",
    "regiao": "Centro",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Carro elétrico e patinete elétrico",
    "historia_resumida": "Trabalha remotamente para uma startup do Vale do Silício a partir do seu apartamento no Aquarius. É cliente assíduo de cafeterias de cafés especiais e valoriza a mobilidade urbana sustentável.",
    "dor_principal": "Carência de espaços de coworking com infraestrutura de alta velocidade 24h e pouca vida noturna cosmopolita na cidade.",
    "habitos": {
      "alimentacao": "Cafés especiais extraídos em V60, bowls funcionais nutritivos e culinária asiática artesanal.",
      "consumo": "Hardware de ponta importado, periféricos ergonômicos e compras automatizadas na Amazon Prime.",
      "vestuario": "Camisetas básicas pretas de algodão pima peruano, calças chino e tênis minimalistas ecológicos.",
      "aversoes": "Processos burocráticos analógicos em papel e lojas que ainda não aceitam pagamentos por aproximação/NFC.",
      "paixoes": "Desenvolvimento de projetos open-source, trilhas de mountain bike na serra e degustação de cafés premiados."
    },
    "lugares_frequenta_sjc": [
      "Praça Ulisses Guimarães",
      "Cafeteria Torra Fresca Aquarius",
      "Parque Ribeirão Vermelho"
    ],
    "veiculos_midia": [
      {
        "nome": "TechCrunch",
        "handle": "techcrunch"
      },
      {
        "nome": "Podcast Startups SJC",
        "handle": "startups_sjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Filipe Deschamps",
        "handle": "filipedeschamps"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "estilo_consumo_tag": "Tech Global & Conectado",
    "foto": "data_personas/imagens_personagens/personagem_5_osvaldo_martins_ferraz.jpg"
  },
  {
    "id": 6,
    "nome_completo": "Dona Maria do Carmo Prado",
    "idade": 68,
    "genero_etnia": "Mulher Branca",
    "profissao": "Feirante & Doceira Tradicional Aposentada",
    "bairro": "Jardim Maringá",
    "localizacao": "Jardim Maringá, São José dos Campos",
    "regiao": "Centro",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Caminhada e Ônibus municipal",
    "historia_resumida": "Nasceu e cresceu em Santana, filha de tecelões da antiga Tecelagem Parahyba. Conhece cada família do bairro e ainda produz doces caseiros de abóbora e figo por encomenda para clientes fiéis.",
    "dor_principal": "Sensação de esquecimento da memória histórica e cultural da zona norte em contraste com as áreas nobres da cidade.",
    "habitos": {
      "alimentacao": "Comida caipira no fogão de ferro, verduras fresquinhas da feira de Santana e bolo de fubá cremoso à tarde.",
      "consumo": "Mercadinho de secos e molhados da esquina, quitanda local e farmácia onde mantém conta anotada no caderno.",
      "vestuario": "Vestidos florais rodados confortáveis, cardigãs de tricô feitos à mão e sapatos ortopédicos acolchoados.",
      "aversoes": "Totens eletrônicos impessoais em agências bancárias e atendentes jovens sem paciência com idosos.",
      "paixoes": "Participação no coral da Paróquia de Santana, cultivar orquídeas no alpendre e narrar causos antigos para os netos."
    },
    "lugares_frequenta_sjc": [
      "Parque da Cidade (Burle Marx)",
      "Igreja Matriz de Santana",
      "Feira Livre de Santana"
    ],
    "veiculos_midia": [
      {
        "nome": "Rede Vanguarda (Jornal Regional)",
        "handle": "redevanguarda"
      },
      {
        "nome": "Rádio Nativa FM",
        "handle": "nativafmsjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Memória Joseense",
        "handle": "memoria_joseense"
      },
      {
        "nome": "Padre da Paróquia Santana",
        "handle": "paroquiasantanasjc"
      }
    ],
    "estilo_consumo_tag": "Memória Afetiva & Raízes",
    "foto": "data_personas/imagens_personagens/personagem_6_claudete_aparecida_da_silva.jpg"
  },
  {
    "id": 7,
    "nome_completo": "Benedito 'Seu Dito' Alvarenga",
    "idade": 62,
    "genero_etnia": "Homem Pardo",
    "profissao": "Produtor de Queijo Artesanal da Mantiqueira",
    "bairro": "Vila Betânia",
    "localizacao": "Vila Betânia, São José dos Campos",
    "regiao": "Centro",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Picape antiga 4x4",
    "historia_resumida": "Guardião das tradições do distrito de SFX, produz queijo curado premiado em sua propriedade familiar. Recebe turistas e chefs renomados de SJC e SP que sobem a serra em busca de ingredientes autênticos.",
    "dor_principal": "Superlotação desordenada do vilarejo nos feriados de inverno e a instabilidade da rede elétrica rural que afeta as ordenhas.",
    "habitos": {
      "alimentacao": "Queijo curado na tábua, café passado no coador de pano com água de mina e galinha caipira com quiabo.",
      "consumo": "Arame farpado, ferramentas e ração em cooperativas agropecuárias e compras mensais de atacado na cidade.",
      "vestuario": "Botina campeira de couro legítimo, calça jeans grossa de lida e chapéu de palha de aba larga.",
      "aversoes": "Turistas barulhentos que jogam lixo nas trilhas ecológicas e desrespeitam o silêncio sagrado da serra.",
      "paixoes": "Tocar moda de viola caipira no entardecer, cavalgar pelas cristas da serra e contemplar a Pedra de São Francisco."
    },
    "lugares_frequenta_sjc": [
      "Vila de São Francisco Xavier",
      "Mirante da Pedra de São Francisco",
      "Mercado da Cidade de SJC"
    ],
    "veiculos_midia": [
      {
        "nome": "Jornal de SFX",
        "handle": "sfx_noticias"
      },
      {
        "nome": "Globo Rural / Vanguarda",
        "handle": "redevanguarda"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Rota Gastronômica da Mantiqueira",
        "handle": "rotamantiqueira"
      },
      {
        "nome": "Explore SFX",
        "handle": "exploresfx"
      }
    ],
    "estilo_consumo_tag": "Sustentabilidade & Raiz Serrana",
    "foto": "data_personas/imagens_personagens/personagem_7_reinaldo_mendes_trindade.jpg"
  },
  {
    "id": 8,
    "nome_completo": "Dra. Camila Rocha Meireles",
    "idade": 38,
    "genero_etnia": "Mulher Branca",
    "profissao": "Dermatologista & Gestora de Clínica Estética",
    "bairro": "Jardim Paulista",
    "localizacao": "Jardim Paulista, São José dos Campos",
    "regiao": "Centro",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Compacto Blindado",
    "historia_resumida": "Manteve sua clínica na Vila Adyana pela elegância histórica do bairro. Conecta tratamentos de alta tecnologia a um atendimento acolhedor e humanizado para famílias tradicionais e executivas da região.",
    "dor_principal": "Dificuldade em recrutar e reter profissionais de enfermagem estética altamente capacitados na região do Vale.",
    "habitos": {
      "alimentacao": "Menu funcional e orgânico, sucos verdes detox prensados e saladas gourmet com azeites trufados.",
      "consumo": "Aparelhos de ultrassom microfocado importados, cosméticos dermatológicos de alta performance e viagens a congressos.",
      "vestuario": "Blazers de corte impecável em alfaiataria off-white e sapatilhas de couro nobre.",
      "aversoes": "Procedimentos estéticos padronizados sem respaldo científico e falta de ética profissional de concorrentes.",
      "paixoes": "Sessões matinais de pilates, finais de semana ensolarados em Ilhabela e colecionismo de arte contemporânea brasileira."
    },
    "lugares_frequenta_sjc": [
      "Parque Santos Dumont",
      "Restaurantes da Av. Adhemar de Barros",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "Vogue Brasil",
        "handle": "voguebrasil"
      },
      {
        "nome": "Revista Metrópole SJC",
        "handle": "revistametropolesjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Dermatologia & Estética Brasil",
        "handle": "sbd_dermato"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Sofisticação & Autocuidado",
    "foto": "data_personas/imagens_personagens/personagem_8_geraldo_magela_de_souza.jpg"
  },
  {
    "id": 9,
    "nome_completo": "Wagner Santos",
    "idade": 41,
    "genero_etnia": "Homem Negro",
    "profissao": "Técnico Mecatrônico Sênior de Linha Automotiva",
    "bairro": "Jardim Augusta",
    "localizacao": "Jardim Augusta, São José dos Campos",
    "regiao": "Centro",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Fretado da montadora e carro próprio nos fins de semana",
    "historia_resumida": "Formado pelo SENAI, atua na indústria há quase duas décadas. Mora perto da Dutra pelo acesso rápido e valoriza a solidez das conquistas da sua família: casa própria quitada e filhos estudando em boas escolas.",
    "dor_principal": "Oscilações imprevisíveis no mercado fabril automotivo e os aumentos abusivos nas mensalidades de convênio médico.",
    "habitos": {
      "alimentacao": "Churrasco de contrafilé no quintal de casa com os colegas de turno, pastel de feira e cerveja pilsen gelada.",
      "consumo": "Materiais de construção para ampliações na residência e compras em grandes atacarejos às margens da Dutra.",
      "vestuario": "Macacão técnico antichamas nos dias úteis e bermuda jeans com camisa polo esportiva nos fins de semana.",
      "aversoes": "Cursos rápidos de internet que prometem enriquecimento fácil e eletrodomésticos com obsolescência programada.",
      "paixoes": "Peladas de futebol society nas quadras da zona sul, mexer no motor do seu carro antigo e pescaria no Rio Paraíba."
    },
    "lugares_frequenta_sjc": [
      "Vale Sul Shopping",
      "Feira da Praça do Pq. Industrial",
      "Assaí Atacadista da Dutra"
    ],
    "veiculos_midia": [
      {
        "nome": "Band Vale Notícias",
        "handle": "bandvaletv"
      },
      {
        "nome": "Rádio Stereo Vale",
        "handle": "stereovale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Mecânica Descomplicada",
        "handle": "mecanicadescomplicada"
      },
      {
        "nome": "São José Esporte Clube",
        "handle": "saojoseec_oficial"
      }
    ],
    "estilo_consumo_tag": "Pragmático & Familiar",
    "foto": "data_personas/imagens_personagens/personagem_9_beatriz_prado_antunes.jpg"
  },
  {
    "id": 10,
    "nome_completo": "Gabriel Marcondes de Oliveira",
    "idade": 23,
    "genero_etnia": "Homem Pardo",
    "profissao": "Desenvolvedor Full Stack Júnior no Parque Tecnológico",
    "bairro": "Jardim Jussara",
    "localizacao": "Jardim Jussara, São José dos Campos",
    "regiao": "Centro",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Moto 160cc e Transporte por aplicativo",
    "historia_resumida": "Estudou na FATEC e conseguiu seu primeiro contrato tech no Parque Tecnológico de SJC. É a ponte entre a tradição operária de Eugênio de Melo e a nova economia digital que transforma a zona leste.",
    "dor_principal": "Falta crônica de ciclovias seguras conectando o distrito de Eugênio de Melo aos polos tecnológicos da cidade.",
    "habitos": {
      "alimentacao": "Marmitas congeladas fitness durante a semana, rodízio de pizza aos sábados e energéticos nas madrugadas de código.",
      "consumo": "Teclados mecânicos RGB, cursos avançados de backend em plataformas online e calçados casuais esportivos.",
      "vestuario": "Moletons com capuz estampados com referências geeks, calças cargo pretas e tênis skate.",
      "aversoes": "Chefias autoritárias que exigem presença física desnecessária e empresas que não incentivam inovação.",
      "paixoes": "Participação em maratonas de programação (hackathons), jogos online cooperativos e manobras na pista de skate do Parque da Cidade."
    },
    "lugares_frequenta_sjc": [
      "Parque Tecnológico de SJC (PqTec)",
      "CenterVale Shopping",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      {
        "nome": "Manual do Dev",
        "handle": "manualdodev"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Rocketseat",
        "handle": "rocketseat_oficial"
      },
      {
        "nome": "Alura Online",
        "handle": "aluraonline"
      }
    ],
    "estilo_consumo_tag": "Aspiracional Tech",
    "foto": "data_personas/imagens_personagens/personagem_10_rodolfo_guimaraes_villela.jpg"
  },
  {
    "id": 11,
    "nome_completo": "Valéria Fontes",
    "idade": 42,
    "genero_etnia": "Mulher Branca",
    "profissao": "Arquiteta de Interiores & Cenógrafa Comercial",
    "bairro": "Jardim Aquarius",
    "localizacao": "Jardim Aquarius, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Carro elétrico compacto",
    "historia_resumida": "Especialista em projetos comerciais biofílicos e residenciais de alto padrão no Colinas e Aquarius. Busca constantemente inspirações nas feiras de design de Milão e São Paulo para aplicar em imóveis da região.",
    "dor_principal": "Falta de lojas locais com mobiliário assinado e demora no fornecimento de mármores e pedras nobres.",
    "habitos": {
      "alimentacao": "Pratos à base de peixes frescos, risotos artesanais e degustação de espumantes nacionais premiados.",
      "consumo": "Peças de design autoral, luminárias de artistas brasileiros e softwares 3D de renderização imersiva.",
      "vestuario": "Roupas assimétricas de linho cru, óculos de armação geométrica marcante e sapatos de design exclusivo.",
      "aversoes": "Ambientes saturados de plástico sem personalidade e empreiteiros descompromissados com o acabamento fino.",
      "paixoes": "Visitar bienais de arquitetura, restaurar móveis modernistas garimpados e cuidar de sua coleção de samambaias raras."
    },
    "lugares_frequenta_sjc": [
      "Colinas Shopping",
      "Showrooms de Design na Av. São João",
      "Parque Vicentina Aranha"
    ],
    "veiculos_midia": [
      {
        "nome": "Casa Vogue",
        "handle": "casavoguebrasil"
      },
      {
        "nome": "Revista Visual Vale",
        "handle": "visualvalerevista"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Mauricio Arruda",
        "handle": "mauricioarruda"
      },
      {
        "nome": "Arquitetura SJC",
        "handle": "arquiteturasjc"
      }
    ],
    "estilo_consumo_tag": "Design & Estética Autoral",
    "foto": "data_personas/imagens_personagens/personagem_11_valdir_de_oliveira_santos.jpg"
  },
  {
    "id": 12,
    "nome_completo": "Kenji Takahashi",
    "idade": 36,
    "genero_etnia": "Homem Asiático",
    "profissao": "Pesquisador Sênior em Satélites do INPE",
    "bairro": "Urbanova",
    "localizacao": "Urbanova, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Bicicleta elétrica e Carro sedan",
    "historia_resumida": "Doutor em engenharia aeroespacial, trabalha no desenvolvimento de cargas úteis para satélites de monitoramento ambiental no INPE. Mora no Jardim das Indústrias pela tranquilidade e rápido acesso à rodovia.",
    "dor_principal": "Burocracia excessiva na importação de componentes ópticos e sensores de alta precisão para pesquisa científica.",
    "habitos": {
      "alimentacao": "Autêntica culinária japonesa tradicional (ramen e izakaya), chás verdes matcha e frutas da estação.",
      "consumo": "Livros acadêmicos importados, ferramentas de telescópio amador e instrumentos musicais acústicos.",
      "vestuario": "Camisas xadrez discretas, calças jeans escuras duráveis e tênis de caminhada impermeáveis.",
      "aversoes": "Desinformação científica nas redes sociais e reuniões longas sem pauta prévia definida.",
      "paixoes": "Astrofotografia noturna nas montanhas de SFX, tocar violão clássico e marcenaria de precisão nos dias livres."
    },
    "lugares_frequenta_sjc": [
      "Campus do INPE",
      "Praça das Indústrias",
      "Restaurante Japonês Tradicional no Centro"
    ],
    "veiculos_midia": [
      {
        "nome": "Nature Scientific",
        "handle": "nature"
      },
      {
        "nome": "Jornal do INPE",
        "handle": "inpe_oficial"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Sérgio Sacani (Space Today)",
        "handle": "spacetoday1"
      },
      {
        "nome": "Ciência Todo Dia",
        "handle": "pedroloos"
      }
    ],
    "estilo_consumo_tag": "Científico & Racional",
    "foto": "data_personas/imagens_personagens/personagem_12_keiko_yamashita_sato.jpg"
  },
  {
    "id": 13,
    "nome_completo": "Claudete Aparecida da Silva",
    "idade": 59,
    "genero_etnia": "Mulher Negra",
    "profissao": "Costureira Especialista em Reformas & Alta Costura",
    "bairro": "Jardim das Colinas",
    "localizacao": "Jardim das Colinas, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Ônibus e Caminhada",
    "historia_resumida": "Costura desde os quinze anos e construiu uma reputação impecável na zona norte pelo capricho nos ajustes de vestidos de noiva e ternos. Atende clientes de toda a cidade que sobem a ponte buscando seu corte cirúrgico.",
    "dor_principal": "Dores crônicas na coluna pelas longas jornadas na máquina de costura e o aumento contínuo no preço dos tecidos e zíperes.",
    "habitos": {
      "alimentacao": "Arroz, feijão fresquinho, couve refogada na hora e suco natural de maracujá para relaxar à noite.",
      "consumo": "Armarinhos e retrosarias tradicionais no centro de SJC e manutenção preventiva em suas máquinas industriais.",
      "vestuario": "Roupas confortáveis confeccionadas por ela mesma com tecidos florais e aventais com bolsos utilitários.",
      "aversoes": "Roupas descartáveis de fast-fashion com costuras frágeis e clientes que pedem fiado sem intimidade.",
      "paixoes": "Participar das novenas da comunidade do Alto da Ponte, ensinar corte e costura para meninas do bairro e ouvir rádio AM."
    },
    "lugares_frequenta_sjc": [
      "Centro Comunitário do Alto da Ponte",
      "Armarinhos da Rua 15 no Centro",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      {
        "nome": "Rádio Aparecida",
        "handle": "radioaparecida"
      },
      {
        "nome": "TV Vanguarda",
        "handle": "redevanguarda"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Dicas de Costura Brasil",
        "handle": "costuracriativa"
      },
      {
        "nome": "Vozes da Zona Norte SJC",
        "handle": "zn_sjc"
      }
    ],
    "estilo_consumo_tag": "Artesanal & Essencial",
    "foto": "data_personas/imagens_personagens/personagem_13_rosana_aparecida_de_lima.jpg"
  },
  {
    "id": 14,
    "nome_completo": "Heloísa Castilho",
    "idade": 33,
    "genero_etnia": "Mulher Parda",
    "profissao": "Gestora de Tráfego Pago & Marketing Digital",
    "bairro": "Jardim Esplanada",
    "localizacao": "Jardim Esplanada, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro hatch automático",
    "historia_resumida": "Gerencia campanhas de performance para lançamentos imobiliários e franquias da região do Vale do Paraíba. Divide sua rotina entre cafés com clientes e a gestão de equipes remotas de copywriters e designers.",
    "dor_principal": "Mudanças constantes nos algoritmos de anúncios da Meta/Google que desestabilizam o custo por lead dos clientes.",
    "habitos": {
      "alimentacao": "Smoothies energéticos com whey protein, pães de fermentação natural e almoços em bistrôs charmosos.",
      "consumo": "Softwares de automação de marketing em dólar, cursos de mentoria executiva e acessórios de ergonomia.",
      "vestuario": "Estilo smart casual elegante, blazers coloridos estruturados e bolsas de couro legítimo de marcas locais.",
      "aversoes": "Clientes retrógrados que não compreendem a importância do funil de vendas digital e relatórios vagos.",
      "paixoes": "Prática de beach tennis nas quadras do Urbanova, viagens de praia nos feriados e podcasts de negócios."
    },
    "lugares_frequenta_sjc": [
      "Colinas Shopping",
      "Arena de Beach Tennis Urbanova",
      "Cafeteria da Av. Anchieta"
    ],
    "veiculos_midia": [
      {
        "nome": "Meio & Mensagem",
        "handle": "meioemensagem"
      },
      {
        "nome": "StartSe Negócios",
        "handle": "startse"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Pedro Sobral",
        "handle": "pedrosobral"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "estilo_consumo_tag": "Performance & Inovação",
    "foto": "data_personas/imagens_personagens/personagem_14_eduardo_henrique_de_barros.jpg"
  },
  {
    "id": 15,
    "nome_completo": "Lucas Henrique Silva",
    "idade": 27,
    "genero_etnia": "Homem Pardo",
    "profissao": "Chef & Proprietário de Hamburgueria Artesanal",
    "bairro": "Jardim Alvorada",
    "localizacao": "Jardim Alvorada, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Carro utilitário e moto",
    "historia_resumida": "Transformou sua paixão por carnes em uma hamburgueria que é referência de delivery na zona sul. Valoriza o blend artesanal moído diariamente e a agilidade nas entregas pelo WhatsApp e iFood.",
    "dor_principal": "As altas taxas cobradas pelos aplicativos de entrega e os custos crescentes do queijo cheddar e do carvão especial.",
    "habitos": {
      "alimentacao": "Degustação contínua de hambúrgueres autorais, porções de batata rústica com páprica e refrigerantes artesanais.",
      "consumo": "Insumos gastronômicos em distribuidoras especializadas e embalagens térmicas sustentáveis de papel kraft.",
      "vestuario": "Camisetas pretas estampadas com sua marca, dólmã de sarja moderna e bonés aba reta.",
      "aversoes": "Entregadores terceirizados que derrubam os pedidos no transporte e avaliações injustas em plataformas online.",
      "paixoes": "Estudar técnicas de defumação texana no pit smoker, assistir a reality shows de gastronomia e jogar futebol com amigos."
    },
    "lugares_frequenta_sjc": [
      "Avenida Bacabal",
      "Atacadão da Zona Sul",
      "Shopping Jardim Oriente"
    ],
    "veiculos_midia": [
      {
        "nome": "FoodBiz Brasil",
        "handle": "foodbizbrasil"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Netão Bom Beef",
        "handle": "netaobombeef"
      },
      {
        "nome": "Guia de Bares SJC",
        "handle": "guiadebaressjc"
      }
    ],
    "estilo_consumo_tag": "Gastronomia & Corre Comercial",
    "foto": "data_personas/imagens_personagens/personagem_15_vanessa_cristina_moreira.jpg"
  },
  {
    "id": 16,
    "nome_completo": "Osvaldo Martins Ferraz",
    "idade": 64,
    "genero_etnia": "Homem Branco",
    "profissao": "Mestre de Obras da Construção Civil",
    "bairro": "Jardim das Indústrias",
    "localizacao": "Jardim das Indústrias, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Picape utilitária média",
    "historia_resumida": "Construiu dezenas de casas e edifícios em SJC ao longo de quarenta anos de canteiro de obras. Conhece os tipos de solo e as particularidades estruturais de cada morro e vale da cidade.",
    "dor_principal": "Escassez de jovens interessados em aprender a profissão de pedreiro e carpinteiro com rigor técnico.",
    "habitos": {
      "alimentacao": "Marmita reforçada com feijão tropeiro e bife na chapa, café forte com açúcar e paçoca na sobremesa.",
      "consumo": "Ferramentas profissionais de alta durabilidade em lojas tradicionais de ferragens e peças automotivas originais.",
      "vestuario": "Camisas de manga longa de algodão grosso para proteção solar, calça jeans pesada e botas de segurança com bico de aço.",
      "aversoes": "Projetos de engenharia desenhados no computador que não consideram as dificuldades práticas da obra real.",
      "paixoes": "Pescar no Rio Paraíba do Sul nas tardes de domingo, ouvir modas de viola e cuidar dos seus pássaros no quintal."
    },
    "lugares_frequenta_sjc": [
      "Lojas de Ferragens do Centro",
      "Parque da Cidade",
      "Feira da Vila Nova São José"
    ],
    "veiculos_midia": [
      {
        "nome": "Jornal O Vale",
        "handle": "jornalovale"
      },
      {
        "nome": "Rádio Nativa FM",
        "handle": "nativafmsjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Dicas de Obra do Mestre",
        "handle": "obramestre"
      },
      {
        "nome": "Memória de SJC",
        "handle": "memoriasjc"
      }
    ],
    "estilo_consumo_tag": "Experiência Prática & Raiz",
    "foto": "data_personas/imagens_personagens/personagem_16_danielle_ramos_ferreira.jpg"
  },
  {
    "id": 17,
    "nome_completo": "Larissa 'Lari' Santos Neves",
    "idade": 26,
    "genero_etnia": "Mulher Negra",
    "profissao": "Barista & Consultora de Cafés Especiais",
    "bairro": "Vale dos Pinheiros",
    "localizacao": "Vale dos Pinheiros, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Bicicleta urbana e Metrô/Ônibus",
    "historia_resumida": "Formada em gastronomia e certificada pela SCA, atua no treinamento de equipes de cafeterias premiadas em SJC. Tem paixão por desmistificar as notas sensoriais de microlotes do interior paulista e mineiro.",
    "dor_principal": "A persistência da cultura do café extra-forte carbonizado que impede muitas pessoas de valorizarem grãos especiais.",
    "habitos": {
      "alimentacao": "Torradas artesanais de sourdough com avocado, ovos pochê e infusões botânicas com especiarias.",
      "consumo": "Métodos manuais de extração (Aeropress, Chemex), filtros japoneses e livros técnicos de microbiologia do café.",
      "vestuario": "Aventais de sarja com tiras de couro marrom, calças de veludo cotelê e meias estampadas divertidas.",
      "aversoes": "Cafés comerciais servidos em copos plásticos finos e açúcar adicionado sem consentimento na xícara.",
      "paixoes": "Visitar fazendas produtoras no Sul de Minas e na Serra da Mantiqueira, garimpar xícaras de cerâmica e fotografia analógica."
    },
    "lugares_frequenta_sjc": [
      "Cafeterias da Vila Ema e Betânia",
      "Parque Vicentina Aranha",
      "Sesc São José dos Campos"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Espresso",
        "handle": "revistaespresso"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Boram Um (World Barista Champion)",
        "handle": "boramum"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Sensorial & Artesanal Nobre",
    "foto": "data_personas/imagens_personagens/personagem_17_thiago_alcantara_bispo.jpg"
  },
  {
    "id": 18,
    "nome_completo": "Carlos Eduardo 'Cadu' Peixoto",
    "idade": 35,
    "genero_etnia": "Homem Branco",
    "profissao": "Engenheiro de Estruturas Aeronáuticas da Embraer",
    "bairro": "Jardim Aquarius II",
    "localizacao": "Jardim Aquarius, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Sedan Híbrido",
    "historia_resumida": "Formado pelo ITA, trabalha no cálculo estrutural de compósitos de fuselagem para a nova geração de jatos comerciais. Vive dentro do complexo aeronáutico pela segurança e pela sinergia com a comunidade de engenharia.",
    "dor_principal": "Restrições orçamentárias em projetos estratégicos de inovação e a alta competitividade de headhunters internacionais.",
    "habitos": {
      "alimentacao": "Pratos ricos em proteínas magras, gastronomia contemporânea nos finais de semana e vinhos chilenos da uva Carménère.",
      "consumo": "Drones com câmera 4K, relógios analógicos com cronógrafo de aviação e assinaturas de periódicos científicos aeroespaciais.",
      "vestuario": "Camisas polo azul-marinho de algodão mercerizado, calças chino cáqui e jaquetas corta-vento de aviação.",
      "aversoes": "Cortes de investimentos na educação científica de base e falta de visão de longo prazo em políticas industriais.",
      "paixoes": "Pilotar aeromodelos com os colegas no DCTA, velejar na Represa de Igaratá e leitura de ficção científica clássica."
    },
    "lugares_frequenta_sjc": [
      "Clube dos Oficiais do DCTA",
      "Memorial Aeroespacial Brasileiro (MAB)",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "Aviation Week",
        "handle": "aviationweek"
      },
      {
        "nome": "Revista Asas",
        "handle": "revistaasas"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Lito Sousa (Aviões e Músicas)",
        "handle": "avioesemusicas"
      },
      {
        "nome": "ITA Oficial",
        "handle": "ita_oficial"
      }
    ],
    "estilo_consumo_tag": "Tecnológico & Aeroespacial",
    "foto": "data_personas/imagens_personagens/personagem_18_renata_sayuri_matsuda.jpg"
  },
  {
    "id": 19,
    "nome_completo": "Aline Moreira Siqueira",
    "idade": 31,
    "genero_etnia": "Mulher Parda",
    "profissao": "Personal Trainer & Coach de Treinamento Funcional",
    "bairro": "Urbanova (Reserva do Paratehy)",
    "localizacao": "Urbanova, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro hatch esportivo",
    "historia_resumida": "Atende executivos e mulheres na zona sul com foco em emagrecimento saudável e reabilitação postural. Montou seu estúdio funcional privativo próximo à Av. Andrômeda e tem lista de espera para horários nobres.",
    "dor_principal": "Alunos que desistem nos primeiros meses por buscarem resultados imediatos milagrosos sem disciplina.",
    "habitos": {
      "alimentacao": "Refeições equilibradas pesadas na balança, suplementação vitamínica personalizada e água de coco fresca.",
      "consumo": "Equipamentos de treinamento funcional de borracha vulcanizada, smartbands e calçados específicos de Cross Training.",
      "vestuario": "Conjuntos fitness de alta compressão sem costura, jaquetas corta-vento leves e viseiras de corrida.",
      "aversoes": "Fórmulas mágicas de emagrecimento sem base científica e academias desorganizadas com aparelhos quebrados.",
      "paixoes": "Participar de meias maratonas de rua em SJC, treinar nas escadarias do Parque da Cidade e cozinhar receitas fit."
    },
    "lugares_frequenta_sjc": [
      "Avenida Andrômeda",
      "Vale Sul Shopping",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Runner's Brasil",
        "handle": "runnersbrasil"
      },
      {
        "nome": "Explore SJC Esportes",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Coach Carol Borba",
        "handle": "carolborba1"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Fitness & Saúde Ativa",
    "foto": "data_personas/imagens_personagens/personagem_19_roberto_junqueira_siqueira.jpg"
  },
  {
    "id": 20,
    "nome_completo": "Renato Guimarães Prado",
    "idade": 48,
    "genero_etnia": "Homem Branco",
    "profissao": "Gerente Geral de Concessionária de Veículos Premium",
    "bairro": "Jardim Golfe",
    "localizacao": "Jardim Golfe, São José dos Campos",
    "regiao": "Oeste",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Sedan Alemão da Concessionária",
    "historia_resumida": "Comanda uma das concessionárias mais rentáveis do eixo da Dutra, negociando veículos importados para empresários e pecuaristas do Vale. Vive no Floradas de São José pela segurança e sofisticação das praças.",
    "dor_principal": "Atrasos na entrega de veículos zero km devido à crise global na cadeia de semicondutores e fretes marítimos.",
    "habitos": {
      "alimentacao": "Almoços de negócios em churrascarias de alto padrão, grelhados nobres e cervejas artesanais do estilo IPA.",
      "consumo": "Acessórios automotivos homologados de fábrica, relógios de marcas suíças e investimentos em imóveis comerciais.",
      "vestuario": "Ternos italianos sem gravata, camisas sociais sob medida e sapatos de couro legítimo com solado duplo.",
      "aversoes": "Vendedores despreparados que não conhecem a ficha técnica do produto e promessas comerciais não honradas.",
      "paixoes": "Participar de track days em autódromos aos sábados, churrasco gourmet para amigos e assistir à Fórmula 1 aos domingos."
    },
    "lugares_frequenta_sjc": [
      "Vale Sul Shopping",
      "Praça das Floradas de São José",
      "Restaurantes Nobres da Dutra"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Quatro Rodas",
        "handle": "quatrorodas"
      },
      {
        "nome": "AutoEsporte Globo",
        "handle": "autoesporte"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Acelerados (Rubens Barrichello)",
        "handle": "acelerados"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Automotivo & Alto Padrão",
    "foto": "data_personas/imagens_personagens/personagem_20_camila_albuquerque_de_moura.jpg"
  },
  {
    "id": 21,
    "nome_completo": "Beatriz 'Bia' Mendonça",
    "idade": 22,
    "genero_etnia": "Mulher Branca",
    "profissao": "Estudante de Odontologia na UNESP & Criadora Digital",
    "bairro": "Jardim Satélite",
    "localizacao": "Jardim Satélite, São José dos Campos",
    "regiao": "Sul",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Caminhada e Ônibus universitário",
    "historia_resumida": "Veio do interior de Minas para estudar na prestigiada Faculdade de Odontologia da UNESP em São José. Compartilha sua rotina de estudos clínicos no TikTok e Instagram, acumulando milhares de seguidores.",
    "dor_principal": "O custo altíssimo dos kits de instrumentos odontológicos exigidos pela faculdade a cada novo semestre letivo.",
    "habitos": {
      "alimentacao": "Marmitas congeladas da mãe, café gelado em copos térmicos entre as aulas e açaí com granola na Praça São Dimas.",
      "consumo": "Materiais odontológicos profissionais em dentais do centro, maquiagem cruelty-free e livros técnicos de anatomia.",
      "vestuario": "Scrubs cirúrgicos coloridos estilizados na faculdade e roupas casuais jovens confortáveis nos finais de semana.",
      "aversoes": "Professores autoritários sem empatia pedagógica e clínicas que utilizam materiais de baixa qualidade.",
      "paixoes": "Criar vídeos educativos de saúde bucal para jovens, passear pelas feirinhas de artesanato e piqueniques no Vicentina."
    },
    "lugares_frequenta_sjc": [
      "Campus da UNESP São Dimas",
      "Praça Monsenhor Ascânio Brandão",
      "Parque Vicentina Aranha"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista CROSP Notícias",
        "handle": "crosp_oficial"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Dra. Dentista no Insta",
        "handle": "dentistando"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Universitária & Criativa",
    "foto": "data_personas/imagens_personagens/personagem_21_tatiane_souza_ribeiro.jpg"
  },
  {
    "id": 22,
    "nome_completo": "Sebastião 'Tião' Ribeiro",
    "idade": 66,
    "genero_etnia": "Homem Pardo",
    "profissao": "Operador de Caminhão Pipa & Manutenção de Estradas Rurais",
    "bairro": "Floradas de São José",
    "localizacao": "Floradas de São José, São José dos Campos",
    "regiao": "Sul",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Caminhão de trabalho e moto antiga",
    "historia_resumida": "Conhece cada curva, ponte de madeira e mata-burro da zona norte rural de SJC. Presta serviços de abastecimento de água potável em chácaras e patrolamento de estradas vicinais há quase quatro décadas.",
    "dor_principal": "A precariedade da iluminação pública nas estradas rurais e o descaso de motoristas da cidade que andam em alta velocidade nas vias de terra.",
    "habitos": {
      "alimentacao": "Arroz com feijão gordo, torresmo crocante, farinha de milho caipira e café bem doce passado na hora.",
      "consumo": "Peças de reposição para motores diesel em oficinas locais e calçados resistentes para trabalho pesado.",
      "vestuario": "Camisa xadrez de flanela, calça jeans surrada pelo trabalho e chapéu de feltro tradicional.",
      "aversoes": "Gente arrogante da cidade grande que desdenha do modo de vida e da sabedoria simples do homem do campo.",
      "paixoes": "Participar de cavalgadas tropeiras no Bairro dos Freitas, cuidar da sua horta de couve e ouvir modão sertanejo no rádio de pilha."
    },
    "lugares_frequenta_sjc": [
      "Igreja de Santo Expedito no Bairro dos Freitas",
      "Mercado da Zona Norte",
      "Posto de Combustíveis SP-50"
    ],
    "veiculos_midia": [
      {
        "nome": "Rádio Piratininga",
        "handle": "radiopiratiningasjc"
      },
      {
        "nome": "TV Canção Nova",
        "handle": "cancaonova"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Cultura Caipira Raiz",
        "handle": "culturacaipira"
      },
      {
        "nome": "Voz do Campo SJC",
        "handle": "vozesdocampo"
      }
    ],
    "estilo_consumo_tag": "Trabalho Pesado & Tradição Rural",
    "foto": "data_personas/imagens_personagens/personagem_22_gustavo_henrique_assis.jpg"
  },
  {
    "id": 23,
    "nome_completo": "Priscila Alencar",
    "idade": 39,
    "genero_etnia": "Mulher Negra",
    "profissao": "Proprietária de Esmalteria & Spa dos Pés",
    "bairro": "Bosque dos Eucaliptos",
    "localizacao": "Bosque dos Eucaliptos, São José dos Campos",
    "regiao": "Sul",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro próprio popular",
    "historia_resumida": "Construiu um dos salões de beleza mais movimentados da região do Colonial. Emprega quatro profissionais do próprio bairro e é conhecida pela inovação nos tratamentos de podologia e unhas decoradas.",
    "dor_principal": "Dificuldade de obter linhas de microcrédito bancário acessíveis para modernizar as poltronas e autoclaves do salão.",
    "habitos": {
      "alimentacao": "Marmita caseira caprichada levada para o salão, lanches rápidos entre atendimentos e refrigerante diet.",
      "consumo": "Esmaltes hipoalergênicos profissionais no atacado, cosméticos para os pés e compras na feira dominical do Colonial.",
      "vestuario": "Macacões pretos elegantes com detalhes dourados e calçados ortopédicos estilosos para aguentar o dia em pé.",
      "aversoes": "Fornecedores que atrasam a entrega de insumos essenciais e fofocas no ambiente de trabalho.",
      "paixoes": "Participar da feira de domingo do Colonial com a família, assistir séries de suspense e cantar no coral da igreja."
    },
    "lugares_frequenta_sjc": [
      "Galeria Imperial do Colonial",
      "Supermercado Nagumo Colonial",
      "Shopping Jardim Oriente"
    ],
    "veiculos_midia": [
      {
        "nome": "Portal Meon Vale",
        "handle": "meonjornal"
      },
      {
        "nome": "Notícias SJC",
        "handle": "noticias_sjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Mulheres Empreendedoras do Vale",
        "handle": "mulheresdovale"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Beleza & Liderança Local",
    "foto": "data_personas/imagens_personagens/personagem_23_nayara_cristina_dos_santos.jpg"
  },
  {
    "id": 24,
    "nome_completo": "Felipe 'Lipe' Nogueira",
    "idade": 25,
    "genero_etnia": "Homem Branco",
    "profissao": "Instalador Técnico de Energia Solar Fotovoltaica",
    "bairro": "Parque Industrial",
    "localizacao": "Parque Industrial, São José dos Campos",
    "regiao": "Sul",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Furgão utilitário com escada no teto",
    "historia_resumida": "Aproveitou o crescimento dos condomínios em SJC para se especializar na instalação de painéis solares em telhados residenciais e comerciais. Trabalha duro nos telhados debaixo de sol para expandir sua microempresa.",
    "dor_principal": "A demora das concessionárias de energia elétrica para homologar e ativar os inversores solares dos clientes.",
    "habitos": {
      "alimentacao": "Almoço comercial de farto buffet livre, isotônicos durante as instalações e pizza com a namorada no domingo.",
      "consumo": "Cabos solares de alta condutividade, ferramentas elétricas profissionais de impacto e equipamentos de proteção em altura (EPI).",
      "vestuario": "Camisas térmicas com proteção UV de manga longa, calças reforçadas de ripstop e botas com sola antiderrapante.",
      "aversoes": "Instaladores amadores que fazem ligações elétricas perigosas sem seguir as normas da ABNT.",
      "paixoes": "Aprender sobre novas tecnologias de baterias de lítio, andar de kart aos sábados e churrasco com os amigos de infância."
    },
    "lugares_frequenta_sjc": [
      "Lojas de Elétrica e Construção da Zona Leste",
      "Parque Santos Dumont",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "Canal Solar Brasil",
        "handle": "canalsolar"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Engenharia na Prática",
        "handle": "engenhariaprática"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Técnico Solar & Autonomia",
    "foto": "data_personas/imagens_personagens/personagem_24_alexandre_de_siqueira_prado.jpg"
  },
  {
    "id": 25,
    "nome_completo": "Juliana 'Ju' Vasconcellos",
    "idade": 44,
    "genero_etnia": "Mulher Branca",
    "profissao": "Corretora de Imóveis Especialista em Condomínios Fechados",
    "bairro": "Jardim Oriente",
    "localizacao": "Jardim Oriente, São José dos Campos",
    "regiao": "Sul",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Sedan Híbrido de Luxo",
    "historia_resumida": "Uma das corretoras mais requisitadas para negociações de mansões e terrenos no Urbanova e Jardim do Golfe. Tem uma rede de relacionamentos sólida entre empresários e médicos do Vale do Paraíba.",
    "dor_principal": "A lentidão nos cartórios de registro de imóveis e clientes indecisos que desistem na assinatura final da escritura.",
    "habitos": {
      "alimentacao": "Café espresso com grãos gourmet, carpaccios finos em restaurantes italianos e almoços de networking na Vila Ema.",
      "consumo": "Produções fotográficas profissionais com drone para seus imóveis, marketing imobiliário digital e roupas de grife.",
      "vestuario": "Tailleurs sob medida em tons neutros, joias discretas de ouro e saltos altos clássicos.",
      "aversoes": "Corretores que não têm postura ética no mercado e imóveis com documentação fundiária irregular.",
      "paixoes": "Viajar para praias paradisíacas no Nordeste, ioga ao ar livre nas manhãs de sábado e arquitetura de luxo."
    },
    "lugares_frequenta_sjc": [
      "Restaurantes da Vila Ema",
      "Colinas Shopping",
      "Praça Ulisses Guimarães no Aquarius"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Imobiliária do Vale",
        "handle": "imoveisvale"
      },
      {
        "nome": "Valor Econômico",
        "handle": "valoreconomico"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Lucas Sanseverino",
        "handle": "lucassanseverino"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Alto Padrão & Network",
    "foto": "data_personas/imagens_personagens/personagem_25_beatriz_helena_fontes.jpg"
  },
  {
    "id": 26,
    "nome_completo": "Marcio Souza e Silva",
    "idade": 50,
    "genero_etnia": "Homem Pardo",
    "profissao": "Operador de Torno CNC & Usinagem Mecânica de Precisão",
    "bairro": "Jardim América",
    "localizacao": "Jardim América, São José dos Campos",
    "regiao": "Sul",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Carro próprio e ônibus",
    "historia_resumida": "Mora e trabalha no polo industrial das Chácaras Reunidas, programando tornos e centros de usinagem que fornecem peças sob medida para os setores aeroespacial e petroquímico.",
    "dor_principal": "A falta de renovação de maquinário nas pequenas oficinas locais em virtude das altas taxas de juros para financiamento industrial.",
    "habitos": {
      "alimentacao": "Comida de restaurante caseiro no polo industrial, marmita reforçada e café preto com bolacha no intervalo da fábrica.",
      "consumo": "Ferramentas de medição micrométrica (paquímetros digitais, micrômetros) e melhorias na oficina.",
      "vestuario": "Camisa polo industrial com o bolso frontal para caneta e óculos de proteção graduados.",
      "aversoes": "Engenheiros recém-formados que ignoram a experiência prática dos torneiros mecânicos veteranos.",
      "paixoes": "Restaurar motores de motocicletas clássicas nos finais de semana e passar tardes de domingo em família."
    },
    "lugares_frequenta_sjc": [
      "Polo Industrial das Chácaras Reunidas",
      "Vale Sul Shopping",
      "Mercado Municipal de SJC"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Usinagem Brasil",
        "handle": "usinagembrasil"
      },
      {
        "nome": "TV Vanguarda",
        "handle": "redevanguarda"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Torneiros do Brasil",
        "handle": "torneiromecanico"
      },
      {
        "nome": "Mecânica Descomplicada",
        "handle": "mecanicadescomplicada"
      }
    ],
    "estilo_consumo_tag": "Industrial & Precisão",
    "foto": "data_personas/imagens_personagens/personagem_26_luciana_barbosa_coimbra.jpg"
  },
  {
    "id": 27,
    "nome_completo": "Tatiane 'Tati' Camargo",
    "idade": 34,
    "genero_etnia": "Mulher Parda",
    "profissao": "Nutricionista Clínica Funcional & Esportiva",
    "bairro": "Jardim Portugal",
    "localizacao": "Jardim Portugal, São José dos Campos",
    "regiao": "Sul",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro hatch moderno",
    "historia_resumida": "Mantém consultório na Vila Ema atendendo atletas amadores e pessoas que buscam longevidade através de dietas limpas e individualizadas. Tem forte presença digital produzindo conteúdos de receitas funcionais.",
    "dor_principal": "O bombardeio de dietas da moda perigosas promovidas por influenciadores leigos nas redes sociais.",
    "habitos": {
      "alimentacao": "Superalimentos, sementes de chia e linhaça dourada, kombuchas artesanais e vegetais orgânicos da feira de SJC.",
      "consumo": "Artigos de bioimpedância de precisão, suplementos importados com laudo de pureza e cursos de nutrigenômica.",
      "vestuario": "Roupas casuais refinadas em tecidos sustentáveis e jaleco estilizado em linho verde-oliva.",
      "aversoes": "Alimentos ultraprocessados com excesso de corantes artificiais e clientes que não seguem o plano alimentar proposto.",
      "paixoes": "Corridas no Parque Vicentina Aranha aos domingos pela manhã, cozinhar pratos funcionais e yoga ao ar livre."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Empórios Naturais da Vila Ema",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Nutrição Brasil",
        "handle": "nutricaobrasil"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Luciano Bruno",
        "handle": "lucianobrunocs"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Saúde Integrativa & Equilíbrio",
    "foto": "data_personas/imagens_personagens/personagem_27_hiroshi_nakamura_filho.jpg"
  },
  {
    "id": 28,
    "nome_completo": "Rodrigo 'Digão' Barbosa",
    "idade": 30,
    "genero_etnia": "Homem Negro",
    "profissao": "Eletricista Predial & Residencial Certificado",
    "bairro": "Campo dos Alemães",
    "localizacao": "Campo dos Alemães, São José dos Campos",
    "regiao": "Sul",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Moto com baú de ferramentas",
    "historia_resumida": "Atende chamados de emergência elétrica em residências e comércios de toda a zona sul. Conquistou sua clientela pela pontualidade, honestidade nos orçamentos e trabalho dentro das normas de segurança.",
    "dor_principal": "Clientes que contratam curiosos desqualificados e depois o chamam para consertar instalações em curto-circuito perigosas.",
    "habitos": {
      "alimentacao": "Almoço comercial nos bairros onde está trabalhando, lanches de rua no fim de tarde e refrigerante bem gelado.",
      "consumo": "Alicates amperímetros de marca renomada, disjuntores de qualidade e fios de cobre normatizados.",
      "vestuario": "Camiseta pólo com logotipo da sua empresa, calça jeans reforçada e botinas com isolamento elétrico de 1000V.",
      "aversoes": "Materiais elétricos falsificados vendidos em depósitos clandestinos e calotes de clientes desonestos.",
      "paixoes": "Aprender sobre automação residencial inteligente (Alexa), jogar videogame nas horas vagas e churrasco em família."
    },
    "lugares_frequenta_sjc": [
      "Lojas de Materiais Elétricos da Zona Sul",
      "Shopping Jardim Oriente",
      "Praça do Dom Pedro I"
    ],
    "veiculos_midia": [
      {
        "nome": "Mundo da Elétrica",
        "handle": "mundodaeletrica"
      },
      {
        "nome": "Notícias SJC",
        "handle": "noticias_sjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Engehall Elétrica",
        "handle": "engehall_eletrica"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Técnico Prático & Confiança",
    "foto": "data_personas/imagens_personagens/personagem_28_vinicius_gabriel_de_oliveira.jpg"
  },
  {
    "id": 29,
    "nome_completo": "Vera Lúcia Bittencourt",
    "idade": 61,
    "genero_etnia": "Mulher Branca",
    "profissao": "Professora de Língua Portuguesa Aposentada",
    "bairro": "Conjunto Dom Pedro I & II",
    "localizacao": "Conjunto Habitacional Dom Pedro, São José dos Campos",
    "regiao": "Sul",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Caminhada e Carro próprio",
    "historia_resumida": "Lecionou durante mais de três décadas em colégios estaduais tradicionais de SJC. Conhecida por sua erudição e carinho com gerações de alunos, hoje dedica seu tempo a clubes de leitura e eventos culturais.",
    "dor_principal": "A perda progressiva do hábito da leitura profunda entre os jovens e a decadência de livrarias físicas na cidade.",
    "habitos": {
      "alimentacao": "Café com leite e torradas pela manhã, sopas caseiras leves à noite e frutas frescas da quitanda do Monte Castelo.",
      "consumo": "Livros clássicos e contemporâneos em sebos e livrarias, peças de teatro e assinaturas de jornais impressos.",
      "vestuario": "Cardigãs elegantes de lã, echarpes coloridas de seda e sapatos clássicos de bico arredondado.",
      "aversoes": "Erros grosseiros de concordância em comunicações oficiais e poluição sonora perto de sua casa.",
      "paixoes": "Participar de saraus literários no Parque Vicentina Aranha, escrever crônicas sobre a história de SJC e cuidar de suas violetas."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Teatro Municipal de SJC",
      "Livrarias do CenterVale Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "Jornal O Vale",
        "handle": "jornalovale"
      },
      {
        "nome": "TV Cultura",
        "handle": "tvcultura"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Clube de Leitura Vale",
        "handle": "clubedeleituravale"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Cultural & Intelectual Clássica",
    "foto": "data_personas/imagens_personagens/personagem_29_patricia_monte_negro_da_silva.jpg"
  },
  {
    "id": 30,
    "nome_completo": "André Luiz Fonseca",
    "idade": 45,
    "genero_etnia": "Homem Branco",
    "profissao": "Consultor Financeiro & Gestor de Patrimônio Familiar",
    "bairro": "Parque Interlagos",
    "localizacao": "Parque Interlagos, São José dos Campos",
    "regiao": "Sul",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Premium Importado",
    "historia_resumida": "Atende famílias de alta renda e herdeiros de empresas tradicionais do Vale, auxiliando na alocação global de ativos e planejamento sucessório. Vive no Colinas pela proximidade aos clubes e centros empresariais.",
    "dor_principal": "A instabilidade fiscal e tributária do país que dificulta o planejamento financeiro de longo prazo para as empresas.",
    "habitos": {
      "alimentacao": "Cortes nobres de carne angus, queijos finos europeus e vinhos estruturados da região de Bordeaux.",
      "consumo": "Terminais Bloomberg de dados financeiros, viagens de férias ao exterior e itens de alta relojoaria.",
      "vestuario": "Costumes de alfaiataria fina sem gravata, camisas de algodão egípcio e sapatos Oxford artesanais.",
      "aversoes": "Especulações financeiras irresponsáveis e promessas de retornos exorbitantes sem fundamentos sólidos.",
      "paixoes": "Jogar golfe nos fins de semana, leitura sobre geopolítica internacional e colecionismo de moedas históricas."
    },
    "lugares_frequenta_sjc": [
      "Clube de Campo Santa Rita",
      "Colinas Shopping",
      "Restaurantes da Vila Ema"
    ],
    "veiculos_midia": [
      {
        "nome": "Bloomberg Línea Brasil",
        "handle": "bloomberglinea"
      },
      {
        "nome": "InfoMoney",
        "handle": "infomoney"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Tiago Reis (Suno)",
        "handle": "tiagoreis"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Mercado Financeiro & Patrimônio",
    "foto": "data_personas/imagens_personagens/personagem_30_fernando_de_almeida_prado.jpg"
  },
  {
    "id": 31,
    "nome_completo": "Natália 'Nati' Dornelles",
    "idade": 28,
    "genero_etnia": "Mulher Branca",
    "profissao": "Designer de UX/UI para Startups Globais",
    "bairro": "Cidade Vista Verde",
    "localizacao": "Cidade Vista Verde, São José dos Campos",
    "regiao": "Leste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Patinete elétrico e Carro por aplicativo",
    "historia_resumida": "Trabalha para uma empresa de tecnologia da Europa remotamente de seu estúdio no Aquarius. É apaixonada por tipografia, acessibilidade digital e interfaces centradas nas reais necessidades dos usuários.",
    "dor_principal": "A escassez de eventos presenciais de design de produto e tecnologia fora da capital paulista.",
    "habitos": {
      "alimentacao": "Matcha lattes cremosos, toasts com cogumelos salteados e refeições vegetarianas leves.",
      "consumo": "Monitores 4K calibrados para design, cadernos Moleskine e assinaturas de plataformas de tipografia.",
      "vestuario": "Camisetas de algodão orgânico oversized, calças retas de sarja bege e tênis sustentáveis brancos.",
      "aversoes": "Aplicativos com interfaces confusas cheias de propagandas invasivas e reuniões sem objetivo claro.",
      "paixoes": "Ilustração vetorial autoral, passeios com seu cão na Praça Ulisses Guimarães e cerâmica manual."
    },
    "lugares_frequenta_sjc": [
      "Praça Ulisses Guimarães",
      "Cafeterias do Aquarius",
      "Parque Ribeirão Vermelho"
    ],
    "veiculos_midia": [
      {
        "nome": "Design Brasil",
        "handle": "designbrasil"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Ux Collective Brasil",
        "handle": "uxdesign"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Design & Criatividade Digital",
    "foto": "data_personas/imagens_personagens/personagem_31_yala_tamires_da_silva.jpg"
  },
  {
    "id": 32,
    "nome_completo": "Cláudio Roberto Toledo",
    "idade": 53,
    "genero_etnia": "Homem Pardo",
    "profissao": "Líder Comunitário & Motorista de Transporte Coletivo",
    "bairro": "Eugênio de Melo (Distrito)",
    "localizacao": "Eugênio de Melo, São José dos Campos",
    "regiao": "Leste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Ônibus e Bicicleta",
    "historia_resumida": "Dirige ônibus nas linhas da zona leste há mais de vinte anos e atua como voz ativa da associação de moradores do Novo Horizonte, lutando por melhorias nas praças esportivas e postos de saúde.",
    "dor_principal": "Superlotação nos horários de pico e a falta de segurança em pontos de ônibus mal iluminados da periferia leste.",
    "habitos": {
      "alimentacao": "Prato feito caprichado com bife acebolado, café forte no ponto final da linha e feijão com farinha no almoço.",
      "consumo": "Compras no comércio popular do bairro, farmácia comunitária e materiais para reformas no centro comunitário.",
      "vestuario": "Uniforme de motorista sempre bem passado e bermuda com camiseta de time de futebol nos fins de semana.",
      "aversoes": "Políticos que só aparecem na zona leste em época de eleição e motoristas imprudentes no trânsito.",
      "paixoes": "Organizar campeonatos de futebol de várzea no bairro, churrasco com a vizinhança e ouvir samba de raiz."
    },
    "lugares_frequenta_sjc": [
      "Praça de Esportes do Novo Horizonte",
      "Mercado da Zona Leste",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      {
        "nome": "Jornal da Zona Leste SJC",
        "handle": "zl_noticias"
      },
      {
        "nome": "TV Vanguarda",
        "handle": "redevanguarda"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Voz Comunitária SJC",
        "handle": "comunidade_sjc"
      },
      {
        "nome": "São José EC",
        "handle": "saojoseec_oficial"
      }
    ],
    "estilo_consumo_tag": "Comunitário & Voz do Povo",
    "foto": "data_personas/imagens_personagens/personagem_32_caio_felipe_dos_santos_neves.jpg"
  },
  {
    "id": 33,
    "nome_completo": "Fernanda 'Fê' Albuquerque",
    "idade": 37,
    "genero_etnia": "Mulher Branca",
    "profissao": "Bióloga & Coordenadora de Licenciamento Ambiental",
    "bairro": "Galo Branco",
    "localizacao": "Galo Branco, São José dos Campos",
    "regiao": "Leste",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Compacto Híbrido",
    "historia_resumida": "Coordena estudos de impacto ambiental e reflorestamento para grandes empreendimentos imobiliários e industriais no Vale do Paraíba. Defende o crescimento urbano sustentável e a preservação dos mananciais.",
    "dor_principal": "A pressão política para flexibilização de áreas de preservação permanente (APP) e o desmatamento ilegal nas bordas da cidade.",
    "habitos": {
      "alimentacao": "Alimentos orgânicos certificados, queijos artesanais da serra e jantares intimistas em bistrôs da Vila Ema.",
      "consumo": "Equipamentos de GPS georreferenciado de alta precisão, cosméticos veganos e livros de ecologia florestal.",
      "vestuario": "Roupas em tecidos naturais de algodão cru e linho, botas confortáveis para campo e acessórios sustentáveis.",
      "aversoes": "Descarte inadequado de entulhos em áreas verdes urbanas e empresas que praticam greenwashing.",
      "paixoes": "Trilhas de observação de aves (birdwatching) na Serra da Mantiqueira, fotografar a flora nativa e jardinagem ecológica."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Áreas de Preservação do Banhado",
      "Vila Ema"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista O Eco",
        "handle": "oeco_oficial"
      },
      {
        "nome": "CBN Vale",
        "handle": "cbnvale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "SOS Mata Atlântica",
        "handle": "sosmataatlantica"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Sustentabilidade & Meio Ambiente",
    "foto": "data_personas/imagens_personagens/personagem_33_karen_naomi_fujimoto.jpg"
  },
  {
    "id": 34,
    "nome_completo": "Lucas 'LK' Kuntz",
    "idade": 24,
    "genero_etnia": "Homem Asiático",
    "profissao": "Analista de Segurança da Informação & Hacker Ético",
    "bairro": "Parque Novo Horizonte",
    "localizacao": "Parque Novo Horizonte, São José dos Campos",
    "regiao": "Leste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Moto esportiva e Carro",
    "historia_resumida": "Atua na defesa cibernética e testes de intrusão para instituições financeiras e indústrias aeroespaciais do Vale. É focado em criptografia, privacidade de dados e segurança de redes.",
    "dor_principal": "A vulnerabilidade generalizada de pequenas e médias empresas locais a ataques de ransomware.",
    "habitos": {
      "alimentacao": "Lanches práticos, delivery asiático noturno e café expresso duplo sem açúcar durante os plantões.",
      "consumo": "Hardware de segurança física (YubiKeys), servidores domésticos e periféricos de computador de alta fidelidade.",
      "vestuario": "Camisetas pretas básicas de algodão, calças jeans escuras e tênis skate duráveis.",
      "aversoes": "Sistemas corporativos com senhas fracas e falta de investimento em cultura de privacidade de dados.",
      "paixoes": "Competições globais de Capture The Flag (CTF), pilotar sua moto nas curvas da SP-50 e tecnologia cripto."
    },
    "lugares_frequenta_sjc": [
      "Praça das Indústrias",
      "Parque Tecnológico de SJC",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "The Hacker News",
        "handle": "thehackernews"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Gabriel Pato",
        "handle": "gabrielpato"
      },
      {
        "nome": "Filipe Deschamps",
        "handle": "filipedeschamps"
      }
    ],
    "estilo_consumo_tag": "Cibersegurança & Tech",
    "foto": "data_personas/imagens_personagens/personagem_34_rodrigo_paiva_kuhlmann.jpg"
  },
  {
    "id": 35,
    "nome_completo": "Rosana Maria de Jesus",
    "idade": 57,
    "genero_etnia": "Mulher Negra",
    "profissao": "Cozinheira Chefe de Restaurante Tradicional por Quilo",
    "bairro": "Jardim Santa Inês I & II",
    "localizacao": "Jardim Santa Inês, São José dos Campos",
    "regiao": "Leste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Caminhada e Ônibus",
    "historia_resumida": "Comanda a cozinha de um dos restaurantes executivos mais antigos do centro de SJC, alimentando centenas de bancários e comerciantes todos os dias com seu tempero caipira inconfundível.",
    "dor_principal": "O encarecimento excessivo do óleo vegetal, do gás de cozinha e das carnes de primeira no comércio atacadista.",
    "habitos": {
      "alimentacao": "Comida de panela caseira bem temperada com alho e cebola fresca, feijão carioquinha e doce de abóbora caseiro.",
      "consumo": "Panelas industriais de ferro e alumínio grosso, temperos a granel no Mercado Municipal e compras de mês.",
      "vestuario": "Turbantes coloridos de algodão, jaleco branco higiênico e sapatos de segurança emborrachados fechados.",
      "aversoes": "Desperdício de alimentos em buffets e restaurantes que utilizam temperos químicos industrializados artificiais.",
      "paixoes": "Reunir filhos e netos em volta da mesa farta no domingo, cuidar das suas plantas de quintal e ouvir samba antigo."
    },
    "lugares_frequenta_sjc": [
      "Mercado Municipal de SJC",
      "Igreja Matriz de São José",
      "Praça Afonso Pena"
    ],
    "veiculos_midia": [
      {
        "nome": "TV Vanguarda",
        "handle": "redevanguarda"
      },
      {
        "nome": "Rádio Nativa FM",
        "handle": "nativafmsjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Receitas de Vó Caipira",
        "handle": "receitasdevo"
      },
      {
        "nome": "Memória Joseense",
        "handle": "memoria_joseense"
      }
    ],
    "estilo_consumo_tag": "Gastronomia Tradicional & Afeto",
    "foto": "data_personas/imagens_personagens/personagem_35_sylvia_regina_castilho.jpg"
  },
  {
    "id": 36,
    "nome_completo": "Vinícius 'Vini' Castanho",
    "idade": 32,
    "genero_etnia": "Homem Pardo",
    "profissao": "Especialista em Detalhamento Automotivo e Vitrificação",
    "bairro": "Jardim Mariana I & II",
    "localizacao": "Jardim Mariana, São José dos Campos",
    "regiao": "Leste",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro esportivo rebaixado legalizado",
    "historia_resumida": "Montou uma estética automotiva de alto padrão próxima ao Shopping Oriente, atendendo donos de carros de luxo e entusiastas de veículos esportivos que exigem polimento técnico espelhado.",
    "dor_principal": "A poeira excessiva de obras vizinhas que prejudica os processos de cura de vitrificadores cerâmicos na oficina.",
    "habitos": {
      "alimentacao": "Hambúrguer artesanal aos fins de semana, almoço em restaurantes self-service rápidos e energéticos gelados.",
      "consumo": "Compostos polidores alemães, boinas de lã e microfibras especiais de alta densidade para acabamento.",
      "vestuario": "Camisetas pretas de marcas de car care, bermudas cargo pretas e tênis esportivos confortáveis.",
      "aversoes": "Lava-rápidos automáticos de rolo que riscam a pintura dos veículos e clientes que usam produtos abrasivos caseiros.",
      "paixoes": "Encontros de carros antigos e modificados no estacionamento de shoppings, cuidar do brilho do próprio carro e automobilismo."
    },
    "lugares_frequenta_sjc": [
      "Shopping Jardim Oriente",
      "Av. Andrômeda",
      "Vale Sul Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Car Care Brasil",
        "handle": "carcarebrasil"
      },
      {
        "nome": "Notícias SJC",
        "handle": "noticias_sjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Polimento Técnico Brasil",
        "handle": "detailerbrasil"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Automotivo Estético & Empreendedor",
    "foto": "data_personas/imagens_personagens/personagem_36_danilo_viana_de_alencar.jpg"
  },
  {
    "id": 37,
    "nome_completo": "Mariana 'Mari' Godoy",
    "idade": 29,
    "genero_etnia": "Mulher Branca",
    "profissao": "Fotógrafa Especialista em Ensaios de Família e Gastronomia",
    "bairro": "Vila Tatetuba",
    "localizacao": "Vila Tatetuba, São José dos Campos",
    "regiao": "Leste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro compacto e caminhada",
    "historia_resumida": "Fotografa ensaios de gestantes e crianças no Parque Vicentina Aranha e produz o catálogo visual dos principais restaurantes gourmets da cidade com luz natural e sensibilidade estética.",
    "dor_principal": "A desvalorização do trabalho autoral fotográfico por clientes que acham que câmeras de celular substituem um olhar profissional.",
    "habitos": {
      "alimentacao": "Pães de queijo artesanais, cafés filtrados em cafeterias da Adyana e tortas de frutas vermelhas.",
      "consumo": "Lentes prime de alta abertura (f/1.4), cartões de memória de alta velocidade e álbuns encadernados artesanais.",
      "vestuario": "Vestidos fluidos em tons terrosos, chapéus de feltro discretos e botas de camurça macias.",
      "aversoes": "Ensaios fotográficos engessados e clientes que exigem edições artificiais exageradas em Photoshop.",
      "paixoes": "Passeios matinais fotografando a arquitetura histórica do Vicentina Aranha, viajar para a serra e cinema de arte."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Parque Santos Dumont",
      "Bistrôs da Vila Adyana"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Fotografe Melhor",
        "handle": "fotografemelhor"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Fotografia Autoral Brasil",
        "handle": "fotografiaautoral"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Visual & Fotografia Sensível",
    "foto": "data_personas/imagens_personagens/personagem_37_larissa_meireles_prado.jpg"
  },
  {
    "id": 38,
    "nome_completo": "Edson 'Edinho' Ferreira",
    "idade": 47,
    "genero_etnia": "Homem Negro",
    "profissao": "Soldador Industrial Especialista TIG e Caldeiraria",
    "bairro": "Jardim Motorama",
    "localizacao": "Jardim Motorama, São José dos Campos",
    "regiao": "Leste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Moto e Fretado da fábrica",
    "historia_resumida": "Metalúrgico altamente qualificado em solda TIG para tubulações de alta pressão e estruturas aeroespaciais. Reside no Galo Branco há mais de vinte anos e tem orgulho da tradição trabalhadora da sua família.",
    "dor_principal": "Falta de investimentos em cursos de requalificação tecnológica gratuita para veteranos da indústria local.",
    "habitos": {
      "alimentacao": "Comida farta de refeitório fabril, churrasco com linguiça artesanal aos sábados e cerveja bem gelada.",
      "consumo": "Máscaras de solda com escurecimento automático de última geração e ferramentas manuais resistentes.",
      "vestuario": "Jaquetas de couro de soldador na fábrica e camisa polo com bermuda jeans nos dias de descanso.",
      "aversoes": "Falta de rigor nas normas de segurança do trabalho e atrasos de pagamento de fornecedores terceirizados.",
      "paixoes": "Tocar pandeiro em rodas de samba no Galo Branco, consertar coisas em casa e torcer pelo São José EC."
    },
    "lugares_frequenta_sjc": [
      "Comércio do Galo Branco",
      "Estádio Martins Pereira",
      "Parque Novo Horizonte"
    ],
    "veiculos_midia": [
      {
        "nome": "Jornal dos Metalúrgicos SJC",
        "handle": "sindicatometalurgicossjc"
      },
      {
        "nome": "TV Vanguarda",
        "handle": "redevanguarda"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Soldagem & Indústria",
        "handle": "soldagembrasil"
      },
      {
        "nome": "São José Esporte Clube",
        "handle": "saojoseec_oficial"
      }
    ],
    "estilo_consumo_tag": "Técnico Metalúrgico & Raiz",
    "foto": "data_personas/imagens_personagens/personagem_38_jamila_nogueira_santos.jpg"
  },
  {
    "id": 39,
    "nome_completo": "Carla Cristina Zanin",
    "idade": 43,
    "genero_etnia": "Mulher Branca",
    "profissao": "Cirurgiã Dentista Especialista em Implantodontia",
    "bairro": "Vila Tesouro",
    "localizacao": "Vila Tesouro, São José dos Campos",
    "regiao": "Leste",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Premium",
    "historia_resumida": "Referência em cirurgia guiada por computador e implantes dentários com consultório na Vila Adyana. Mora no Esplanada e preza pela discrição, elegância e rigor cirúrgico.",
    "dor_principal": "A proliferação de franquias odontológicas populares de baixo custo que desvalorizam a complexidade cirúrgica.",
    "habitos": {
      "alimentacao": "Gastronomia contemporânea, vinhos brancos da uva Sauvignon Blanc e cafés espressos de torra média.",
      "consumo": "Scanners intraorais 3D, congressos internacionais de implantodontia e artigos de decoração refinados.",
      "vestuario": "Alfaiataria impecável de cortes retos em cores neutras e joias clássicas de pérolas.",
      "aversoes": "Profissionais da saúde que priorizam o lucro em detrimento da saúde e segurança do paciente.",
      "paixoes": "Natação matinal no clube, viagens culturais pela Europa e colecionismo de cerâmica fina."
    },
    "lugares_frequenta_sjc": [
      "Clube de Campo Santa Rita",
      "Colinas Shopping",
      "Restaurantes da Av. São João"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Odonto Magazine",
        "handle": "odontomagazine"
      },
      {
        "nome": "CBN Vale",
        "handle": "cbnvale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Implantodontia Avançada Brasil",
        "handle": "implantodontiabrasil"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Excelência Cirúrgica & Tradição",
    "foto": "data_personas/imagens_personagens/personagem_39_thais_regina_cavalcante.jpg"
  },
  {
    "id": 40,
    "nome_completo": "Matheus 'Math' Lourenço",
    "idade": 21,
    "genero_etnia": "Homem Pardo",
    "profissao": "Barbeiro Especialista em Cortes Freestyle & Navalha",
    "bairro": "Vila Industrial",
    "localizacao": "Vila Industrial, São José dos Campos",
    "regiao": "Leste",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Moto 160cc",
    "historia_resumida": "Começou cortando cabelo dos amigos na calçada e hoje é dono de uma barbearia concorrida no Dom Pedro II. Cria desenhos freestyle na navalha e atrai jovens de toda a zona sul para mudar o visual.",
    "dor_principal": "O aumento no preço das lâminas descartáveis e máquinas de corte sem fio importadas.",
    "habitos": {
      "alimentacao": "Açaí turbinado com leite condensado, lanches de rua com batata frita e refrigerante gelado.",
      "consumo": "Máquinas de corte profissionais de precisão (Wahl/Babyliss), pomadas modeladoras e tênis de marca.",
      "vestuario": "Camisetas de time de basquete americano (NBA), bermudas jeans e correntes de prata.",
      "aversoes": "Clientes que chegam atrasados sem avisar e pessoas que desvalorizam a arte da barbearia de periferia.",
      "paixoes": "Batalhas de rima e hip-hop na zona sul, gravar vídeos de transformação de cortes e andar de moto."
    },
    "lugares_frequenta_sjc": [
      "Praça do Dom Pedro II",
      "Shopping Jardim Oriente",
      "Pista de Skate do Satélite"
    ],
    "veiculos_midia": [
      {
        "nome": "Barber Shop Brasil",
        "handle": "barbershopbrasil"
      },
      {
        "nome": "Notícias SJC",
        "handle": "noticias_sjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Willy Morales",
        "handle": "willymorales"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Estilo Urbano & Freestyle",
    "foto": "data_personas/imagens_personagens/personagem_40_osvaldo_henrique_castelo.jpg"
  },
  {
    "id": 41,
    "nome_completo": "Elza Aparecida Bueno",
    "idade": 65,
    "genero_etnia": "Mulher Parda",
    "profissao": "Feirante Produtora de Hortaliças Orgânicas",
    "bairro": "Santana",
    "localizacao": "Santana, São José dos Campos",
    "regiao": "Norte",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Kombi utilitária e Caminhada",
    "historia_resumida": "Acorda às quatro da manhã para colher alfaces, couves e cheiro-verde sem agrotóxicos em sua horta familiar na Costinha para vender nas feiras da zona norte e centro de SJC.",
    "dor_principal": "Perdas na lavoura causadas por geadas repentinas no inverno ou tempestades de granizo na serra.",
    "habitos": {
      "alimentacao": "Verduras fresquinhas refogadas na banha de porco, angu de milho verde e café com leite da roça.",
      "consumo": "Sementes orgânicas certificadas, adubo natural e lonas para estufas agrícolas.",
      "vestuario": "Camisas de manga comprida para o sol, chapéu de palha com lenço e botas de borracha de cano alto.",
      "aversoes": "Agrotóxicos pesados que contaminam a terra e atravessadores que querem pagar pouco na produção rural.",
      "paixoes": "Cuidar de suas mudas na estufa, ir à missa de domingo no Bairro dos Freitas e reunir a família para o almoço caipira."
    },
    "lugares_frequenta_sjc": [
      "Feira Livre de Santana",
      "Igreja da Costinha",
      "Mercado Municipal de SJC"
    ],
    "veiculos_midia": [
      {
        "nome": "Globo Rural Vanguarda",
        "handle": "redevanguarda"
      },
      {
        "nome": "Rádio Piratininga",
        "handle": "radiopiratiningasjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Agricultura Orgânica Brasil",
        "handle": "organicosbrasil"
      },
      {
        "nome": "Voz do Campo SJC",
        "handle": "vozesdocampo"
      }
    ],
    "estilo_consumo_tag": "Orgânico & Agricultura Familiar",
    "foto": "data_personas/imagens_personagens/personagem_41_mayara_silva_de_oliveira.jpg"
  },
  {
    "id": 42,
    "nome_completo": "Rafael 'Rafa' Brandão",
    "idade": 38,
    "genero_etnia": "Homem Branco",
    "profissao": "Gerente de Supply Chain & Logística da Dutra",
    "bairro": "Altos de Santana",
    "localizacao": "Altos de Santana, São José dos Campos",
    "regiao": "Norte",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Carro sedan executivo",
    "historia_resumida": "Coordena a frota e a distribuição de um dos maiores centros de logística instalados ao longo da Rodovia Presidente Dutra. Vive no Vista Verde pela arborização exuberante e fácil acesso às vias rápidas.",
    "dor_principal": "Interrupções no fluxo logístico causadas por acidentes na Dutra nos horários de entrega de carga expressa.",
    "habitos": {
      "alimentacao": "Grelhados com legumes no almoço, massas artesanais com molhos encorpados e cervejas artesanais locais.",
      "consumo": "Softwares de rastreamento e telemetria logística, equipamentos eletrônicos para home office e livros de gestão.",
      "vestuario": "Camisas sociais sem gravata em tecidos tecnológicos antimanchas e calças chino elegantes.",
      "aversoes": "Atrasos em relatórios operacionais e transportadoras que não cumprem os padrões de segurança de carga.",
      "paixoes": "Correr pelas alamedas arborizadas do Vista Verde, andar de caiaque na represa e churrasco de fim de semana."
    },
    "lugares_frequenta_sjc": [
      "Praças da Cidade Vista Verde",
      "CenterVale Shopping",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      {
        "nome": "Mundo Logística",
        "handle": "mundologistica"
      },
      {
        "nome": "CBN Vale",
        "handle": "cbnvale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Logística na Prática",
        "handle": "logisticabr"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Logística & Gestão Estratégica",
    "foto": "data_personas/imagens_personagens/personagem_42_lucas_kaua_dos_santos.jpg"
  },
  {
    "id": 43,
    "nome_completo": "Sabrina Satoe Mori",
    "idade": 30,
    "genero_etnia": "Mulher Asiática",
    "profissao": "Desenvolvedora Mobile iOS/Swift",
    "bairro": "Alto da Ponte",
    "localizacao": "Alto da Ponte, São José dos Campos",
    "regiao": "Norte",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Bicicleta e Transporte por aplicativo",
    "historia_resumida": "Cria aplicativos para o ecossistema Apple em uma empresa de tecnologia financeira. Escolheu morar na Vila Maria pela atmosfera charmosa e proximidade das padarias clássicas e do centro histórico.",
    "dor_principal": "A instabilidade nas diretrizes de aprovação de aplicativos na App Store que atrasa lançamentos comerciais.",
    "habitos": {
      "alimentacao": "Culinária fusion asiática, chás de jasmim orgânicos e pães de fermentação lenta com queijo branco.",
      "consumo": "Dispositivos Apple de última geração para testes, cadeiras ergonômicas certificadas e fones com cancelamento de ruído.",
      "vestuario": "Cardigãs minimalistas em tons pastéis, calças de alfaiataria confortáveis e tênis slip-on.",
      "aversoes": "Sistemas corporativos legados lentos e falta de acessibilidade para usuários com deficiência visual em apps.",
      "paixoes": "Desenhar ilustrações no iPad, fotografar detalhes arquitetônicos da Vila Maria e passeios de bicicleta no Vicentina."
    },
    "lugares_frequenta_sjc": [
      "Padarias tradicionais da Vila Maria",
      "Parque Vicentina Aranha",
      "Sesc São José dos Campos"
    ],
    "veiculos_midia": [
      {
        "nome": "MacMagazine Brasil",
        "handle": "macmagazine"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Filipe Deschamps",
        "handle": "filipedeschamps"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Mobile Tech & Estilo Minimalista",
    "foto": "data_personas/imagens_personagens/personagem_43_kenji_takahashi.jpg"
  },
  {
    "id": 44,
    "nome_completo": "Geraldo 'Seu Geraldo' Dias",
    "idade": 69,
    "genero_etnia": "Homem Branco",
    "profissao": "Mecânico Especialista em Motores Diesel & Bombas Injetoras",
    "bairro": "Buquirinha I & II",
    "localizacao": "Buquirinha, São José dos Campos",
    "regiao": "Norte",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Picape antiga e Caminhada",
    "historia_resumida": "Mantém sua oficina de beira de estrada no Buquirinha há quarenta e cinco anos, socorrendo caminhoneiros, produtores rurais e ônibus que sobem para a serra de Monteiro Lobato e Campos do Jordão.",
    "dor_principal": "A complexidade da eletrônica embarcada nos motores modernos que exige scanners caros com assinaturas anuais abusivas.",
    "habitos": {
      "alimentacao": "Marmita de ferro com arroz, feijão e carne de panela, café coado na hora e paçoca caipira.",
      "consumo": "Chaves mecânicas forjadas em cromo-vanádio, peças de reposição diesel originais e óleos lubrificantes de qualidade.",
      "vestuario": "Macacão azul escuro de mecânico com manchas de graxa e boné de marca de caminhão.",
      "aversoes": "Mecânicos desonestos que cobram por peças que não trocaram e ferramentas de baixa qualidade que quebram no torque.",
      "paixoes": "Restaurar tratores agrícolas antigos no galpão, conversar com os viajantes da SP-50 e ouvir modão no rádio."
    },
    "lugares_frequenta_sjc": [
      "Comércio do Buquirinha",
      "Posto da SP-50",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista O Carreteiro",
        "handle": "ocarreteiro"
      },
      {
        "nome": "Rádio Nativa FM",
        "handle": "nativafmsjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Mecânica Pesada Brasil",
        "handle": "mecanicadiesel"
      },
      {
        "nome": "Voz do Campo SJC",
        "handle": "vozesdocampo"
      }
    ],
    "estilo_consumo_tag": "Mecânica Pesada & Sabedoria de Estrada",
    "foto": "data_personas/imagens_personagens/personagem_44_clara_meirelles_castroviejo.jpg"
  },
  {
    "id": 45,
    "nome_completo": "Patrícia 'Pati' Lemes",
    "idade": 40,
    "genero_etnia": "Mulher Parda",
    "profissao": "Organizadora Profissional de Ambientes (Personal Organizer)",
    "bairro": "Vila Paiva",
    "localizacao": "Vila Paiva, São José dos Campos",
    "regiao": "Norte",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro próprio espaçoso",
    "historia_resumida": "Transforma casas caóticas em lares harmoniosos e funcionais em condomínios da zona sul e oeste. Ensina técnicas de desapego e organização que economizam tempo e trazem paz mental para famílias ocupadas.",
    "dor_principal": "Clientes que voltam a acumular objetos desnecessários semanas após a conclusão do projeto de organização.",
    "habitos": {
      "alimentacao": "Marmitas congeladas saudáveis e etiquetadas, saladas com sementes e sucos naturais prensados a frio.",
      "consumo": "Caixas organizadoras de acrílico transparente, rotuladores eletrônicos térmicos e cabides padronizados de veludo.",
      "vestuario": "Camisas polo brancas com seu logotipo bordado, calças confortáveis com elastano e tênis slip-on acolchoados.",
      "aversoes": "Acumulação compulsiva de caixas vazias e pessoas que não valorizam a metodologia profissional de organização.",
      "paixoes": "Passeios na Av. Ouro Fino no Bosque dos Eucaliptos, ler livros sobre minimalismo e reformas criativas de móveis."
    },
    "lugares_frequenta_sjc": [
      "Avenida Ouro Fino no Bosque",
      "Vale Sul Shopping",
      "Leroy Merlin do Satélite"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Casa & Organização",
        "handle": "casaeorganizacao"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Micaela Góes (Santa Ajuda)",
        "handle": "micaelagoes"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "estilo_consumo_tag": "Organização & Harmonia Prática",
    "foto": "data_personas/imagens_personagens/personagem_45_leonardo_vianna_martins.jpg"
  },
  {
    "id": 46,
    "nome_completo": "Henrique 'Rique' Faria",
    "idade": 26,
    "genero_etnia": "Homem Negro",
    "profissao": "Técnico de Instalação e Fusão de Fibra Óptica",
    "bairro": "Telespark",
    "localizacao": "Telespark, São José dos Campos",
    "regiao": "Norte",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Carro utilitário com escada e moto",
    "historia_resumida": "Trabalha subindo em postes e instalando internet de ultravelocidade em bairros da zona leste e áreas rurais de SJC. Tem agilidade cirúrgica na fusão de cabos ópticos e atendimento direto aos clientes.",
    "dor_principal": "Fios cortados por caminhões com excesso de altura e roubo frequente de cabos de telecomunicações nas madrugadas.",
    "habitos": {
      "alimentacao": "Marmitex de frango com quiabo nos restaurantes da ZL, salgados assados nos postos e refrigerante no intervalo.",
      "consumo": "Máquinas de fusão de fibra óptica portáteis, canetas laser de teste óptico e calçados com isolamento térmico.",
      "vestuario": "Uniforme com faixas refletivas de alta visibilidade, capacete com jugular de segurança e óculos de proteção UV.",
      "aversoes": "Clientes impacientes que culpam o instalador por instabilidades globais de servidores de internet.",
      "paixoes": "Participar de torneios de videogame de futebol aos fins de semana, empinar pipa com o filho no campinho e churrasco."
    },
    "lugares_frequenta_sjc": [
      "Comércio do Santa Inês e Hermínia",
      "Shopping CenterVale",
      "Parque Novo Horizonte"
    ],
    "veiculos_midia": [
      {
        "nome": "Telecom Brasil Notícias",
        "handle": "telecombrasil"
      },
      {
        "nome": "Notícias SJC",
        "handle": "noticias_sjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Mundo das Telecomunicações",
        "handle": "telecom_pro"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Conectividade & Trabalho Técnico",
    "foto": "data_personas/imagens_personagens/personagem_46_sergio_murilo_de_santana.jpg"
  },
  {
    "id": 47,
    "nome_completo": "Mônica D'Ávila",
    "idade": 52,
    "genero_etnia": "Mulher Branca",
    "profissao": "Psicóloga Clínica Especialista em Terapia Cognitivo-Comportamental",
    "bairro": "Bairro dos Freitas",
    "localizacao": "Bairro dos Freitas, São José dos Campos",
    "regiao": "Norte",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Compacto",
    "historia_resumida": "Atende executivos e jovens universitários com foco no manejo de ansiedade, estresse corporativo e desenvolvimento emocional. Mantém consultório com isolamento acústico refinado no Esplanada.",
    "dor_principal": "O aumento expressivo de crises de burnout entre jovens profissionais do polo tecnológico de SJC.",
    "habitos": {
      "alimentacao": "Chás aromáticos calmantes de camomila e melissa, refeições mediterrâneas leves e pães de nozes artesanais.",
      "consumo": "Livros de neurociência e psicologia comportamental, poltronas ergonômicas de veludo e viagens de retiro espiritual.",
      "vestuario": "Camisas de seda pura em tons suaves de azul e lavanda, calças pantalona elegantes e sapatilhas confortáveis.",
      "aversoes": "Psicólogos que quebram o sigilo profissional ou fazem diagnósticos superficiais sensacionalistas na internet.",
      "paixoes": "Caminhadas reflexivas no Parque Vicentina Aranha, prática de meditação mindfulness e jardinagem aromática."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Colinas Shopping",
      "Bistrôs da Vila Ema"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Mente & Cérebro",
        "handle": "mentecerebro"
      },
      {
        "nome": "CBN Vale",
        "handle": "cbnvale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Rossandro Klinjey",
        "handle": "rossandroklinjey"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Saúde Mental & Reflexão Nobre",
    "foto": "data_personas/imagens_personagens/personagem_47_erika_sayuri_yamashita.jpg"
  },
  {
    "id": 48,
    "nome_completo": "Jair Messias da Silva",
    "idade": 58,
    "genero_etnia": "Homem Pardo",
    "profissao": "Pedreiro Especialista em Acabamentos e Porcelanatos",
    "bairro": "Bonsucesso",
    "localizacao": "Bonsucesso, São José dos Campos",
    "regiao": "Norte",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Ônibus e Bicicleta",
    "historia_resumida": "Assentador de pisos e porcelanatos de grande formato com mais de trinta anos de experiência em reformas na cidade. É meticuloso no nivelamento a laser e no corte fino de meia-esquadria.",
    "dor_principal": "A distância e o tempo excessivo gasto no trajeto de ônibus do extremo sul até as obras nos condomínios da zona oeste.",
    "habitos": {
      "alimentacao": "Marmita reforçada com arroz, feijão, farofa e carne assada, café com biscoito na obra e suco de caju.",
      "consumo": "Niveladores de piso de alta precisão, discos de corte diamantados para porcelanato e ferramentas elétricas.",
      "vestuario": "Camisas polo de algodão resistentes, calças jeans grossas de trabalho e botas com solado de borracha.",
      "aversoes": "Contratantes que atrasam o pagamento do serviço combinado na entrega da obra e pisos com defeito de fábrica empenados.",
      "paixoes": "Cuidar dos seus netos no fim de semana, pescar na represa com os amigos do Pinheirinho e assistir jogos de futebol."
    },
    "lugares_frequenta_sjc": [
      "Comércio do Pinheirinho dos Palmares",
      "Mercado da Zona Sul",
      "Shopping Jardim Oriente"
    ],
    "veiculos_midia": [
      {
        "nome": "TV Vanguarda",
        "handle": "redevanguarda"
      },
      {
        "nome": "Rádio Nativa FM",
        "handle": "nativafmsjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "O Pulo do Gato na Construção",
        "handle": "opulodogatonaconstrucao"
      },
      {
        "nome": "Voz do Povo SJC",
        "handle": "vozesdopovo"
      }
    ],
    "estilo_consumo_tag": "Construção Fina & Trabalho Honesto",
    "foto": "data_personas/imagens_personagens/personagem_48_valeria_das_gracas_jesus.jpg"
  },
  {
    "id": 49,
    "nome_completo": "Camila 'Cami' Valente",
    "idade": 33,
    "genero_etnia": "Mulher Branca",
    "profissao": "Farmacêutica Bioquímica & Gestora de Farmácia de Manipulação",
    "bairro": "São Francisco Xavier (Centro)",
    "localizacao": "São Francisco Xavier, São José dos Campos",
    "regiao": "Norte",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro próprio",
    "historia_resumida": "Dirige o laboratório de manipulação magistral de fórmulas personalizadas para médicos endocrinologistas e dermatologistas da região central de SJC. Preza pela rastreabilidade e pureza das matérias-primas.",
    "dor_principal": "A demora nos processos de liberação aduaneira de princípios ativos e fitoquímicos importados na Anvisa.",
    "habitos": {
      "alimentacao": "Shakes proteicos funcionais, saladas de grãos com azeite extravirgem e cafés espressos curtos.",
      "consumo": "Balanças analíticas de alta precisão, softwares de controle magistral e cosméticos com fórmulas limpas.",
      "vestuario": "Jalecos brancos estilizados com bordado impecável e calçados hospitalares anatômicos acolchoados.",
      "aversoes": "Farmácias que adulteram fórmulas ou utilizam matérias-primas com laudos de pureza duvidosos.",
      "paixoes": "Participar de congressos de farmacologia personalizada, aulas de dança de salão e piqueniques no Santos Dumont."
    },
    "lugares_frequenta_sjc": [
      "Parque Santos Dumont",
      "Polo Hospitalar da Vila Betânia",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Pharmacia Brasileira",
        "handle": "cff_oficial"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Farmácia Magistral Brasil",
        "handle": "farmaciamagistral"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Bioquímica & Fórmulas Personalizadas",
    "foto": "data_personas/imagens_personagens/personagem_49_cristiano_ricardo_fonseca.jpg"
  },
  {
    "id": 50,
    "nome_completo": "Diego 'Dih' Santos",
    "idade": 28,
    "genero_etnia": "Homem Negro",
    "profissao": "Entregador Autônomo Líder de Logística de Aplicativos",
    "bairro": "São Francisco Xavier (Santa Bárbara)",
    "localizacao": "São Francisco Xavier, São José dos Campos",
    "regiao": "Norte",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Moto 160cc flex",
    "historia_resumida": "Conhece cada viela, ladeira e condomínio de SJC na palma da mão. Atua como líder de equipe de entregadores expressos, organizando rotas otimizadas para restaurantes e e-commerce na cidade.",
    "dor_principal": "O asfalto esburacado em vias secundárias que desgasta as suspensões da moto e os riscos de acidentes com motoristas distraídos no celular.",
    "habitos": {
      "alimentacao": "Marmita rápida nos pontos de apoio de entregadores, lanches no capricho e suco de laranja bem gelado.",
      "consumo": "Pneus de moto de alta aderência, baús impermeáveis reforçados, jaquetas térmicas e suportes de celular antivibração.",
      "vestuario": "Jaqueta de motoqueiro com proteções nos ombros e cotovelos, luvas reforçadas e capacete fechado com viseira espelhada.",
      "aversoes": "Condomínios fechados que tratam entregadores com desrespeito ou exigem caminhadas longas a pé no sol.",
      "paixoes": "Participar de passeios de motociclistas pelas curvas da serra no fim de semana, churrasco com a família e futebol society."
    },
    "lugares_frequenta_sjc": [
      "Pontos de Encontro de Motociclistas na ZS",
      "Shopping Jardim Oriente",
      "Parque Interlagos"
    ],
    "veiculos_midia": [
      {
        "nome": "Duas Rodas Notícias",
        "handle": "duasrodas"
      },
      {
        "nome": "Notícias SJC",
        "handle": "noticias_sjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Motofilmador SJC",
        "handle": "motoboy_sjc"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Agilidade em Duas Rodas & Corre",
    "foto": "data_personas/imagens_personagens/personagem_50_marlene_aparecida_schmidt.jpg"
  },
  {
    "id": 51,
    "nome_completo": "Sílvia Helena de Castro",
    "idade": 49,
    "genero_etnia": "Mulher Branca",
    "profissao": "Professora de Balé Clássico & Dança Infantil",
    "bairro": "Região do Putim",
    "localizacao": "Putim, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro próprio",
    "historia_resumida": "Dirige uma tradicional escola de dança e balé clássico na Vila Ema, tendo formado centenas de bailarinas da cidade para exames internacionais da Royal Academy of Dance.",
    "dor_principal": "A escassez de teatros municipais com infraestrutura adequada de coxias e piso flutuante para grandes espetáculos de dança na cidade.",
    "habitos": {
      "alimentacao": "Frutas frescas, iogurtes naturais com mel puro, chás calmantes e pratos leves de massa fresca italiana.",
      "consumo": "Sapatilhas de ponta importadas, figurinos de tule nobre e sistemas de som acústico profissional para estúdio.",
      "vestuario": "Collants de lycra elegantes com saias de chiffon, polainas de lã macias e sapatilhas de meia-ponta.",
      "aversoes": "Falta de disciplina nos ensaios gerais e estabelecimentos que colocam música comercial excessivamente alta.",
      "paixoes": "Assistir a transmissões de espetáculos do Bolshoi e do Royal Ballet, passear no Vicentina Aranha e cuidar de suas orquídeas."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Teatro Municipal de SJC",
      "Cafeterias da Vila Ema"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Dança Brasil",
        "handle": "dancabrasil"
      },
      {
        "nome": "CBN Vale",
        "handle": "cbnvale"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Royal Academy Brasil",
        "handle": "royalacademy"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Arte Clássica & Disciplina",
    "foto": "data_personas/imagens_personagens/personagem_51_claudinei_ribeiro_da_silva.jpg"
  },
  {
    "id": 52,
    "nome_completo": "Alexandre 'Xande' Pires",
    "idade": 46,
    "genero_etnia": "Homem Pardo",
    "profissao": "Empresário do Setor de Blindagem e Acessórios Automotivos",
    "bairro": "São Judas Tadeu",
    "localizacao": "São Judas Tadeu, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Blindado Nível III-A",
    "historia_resumida": "Proprietário de uma empresa especializada em blindagem automotiva e vidros balísticos que atende executivos e políticos do Vale e da capital. Vive no Urbanova e valoriza privacidade e proteção familiar.",
    "dor_principal": "A complexidade da burocracia documental do Exército Brasileiro para homologação de novas tecnologias de blindagem balística leve.",
    "habitos": {
      "alimentacao": "Carnes nobres maturadas no dry aged, cervejas artesanais premium e almoços executivos no Colinas.",
      "consumo": "Vidros balísticos curvos de alta transparência óptica, aramidas de proteção e tecnologia de monitoramento residencial.",
      "vestuario": "Camisas polo de algodão egípcio preto, calças jeans confortáveis e relógio esportivo de titânio.",
      "aversoes": "Prestadores de serviços que não respeitam normas rígidas de segurança e sigilo de clientes.",
      "paixoes": "Praticar tiro esportivo em clube homologado, pilotar barcos na represa e passeios de quadriciclo na serra."
    },
    "lugares_frequenta_sjc": [
      "Colinas Shopping",
      "Clube de Tiro do Vale",
      "Restaurantes da Vila Ema"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Segurança & Defesa",
        "handle": "segurancabrasil"
      },
      {
        "nome": "Valor Econômico",
        "handle": "valoreconomico"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Blindagem Brasil",
        "handle": "blindagem_pro"
      },
      {
        "nome": "Lucas Sanseverino",
        "handle": "lucassanseverino"
      }
    ],
    "estilo_consumo_tag": "Segurança & Tecnologia Balística",
    "foto": "data_personas/imagens_personagens/personagem_52_sheila_maria_de_santana.jpg"
  },
  {
    "id": 53,
    "nome_completo": "Débora 'Deby' Antunes",
    "idade": 25,
    "genero_etnia": "Mulher Parda",
    "profissao": "Atendente de Clínica Veterinária & Tosadora Especialista",
    "bairro": "Santa Júlia",
    "localizacao": "Santa Júlia, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Moto própria e Ônibus",
    "historia_resumida": "Apaixonada por animais, especializou-se em tosa higiênica e banhos relaxantes para cães e gatos em uma das clínicas mais movimentadas do Jardim Satélite. Tem um talento especial para acalmar pets estressados.",
    "dor_principal": "Tutores irresponsáveis que abandonam animais idosos ou negligenciam os tratamentos veterinários prescritos.",
    "habitos": {
      "alimentacao": "Lanches vegetarianos práticos, sucos de frutas da estação e comida caseira no almoço com a equipe do pet shop.",
      "consumo": "Tesouras japonesas de tosa de precisão, lâminas profissionais, xampus hipoalergênicos e acessórios pet fofos.",
      "vestuario": "Camisetas pretas impermeáveis que não grudam pelos, calças legging confortáveis e tênis leves antiderrapantes.",
      "aversoes": "Maus-tratos a animais e pessoas que compram bichos por modismo sem pensar no compromisso de longo prazo.",
      "paixoes": "Trabalhar como voluntária em feirinhas de adoção de animais em SJC, passear com seus cães resgatados e gravar vídeos pet."
    },
    "lugares_frequenta_sjc": [
      "Avenida Andrômeda",
      "Vale Sul Shopping",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Pet Care Brasil",
        "handle": "petcarebrasil"
      },
      {
        "nome": "Explore SJC Pets",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Alexandre Rossi (Dr. Pet)",
        "handle": "drpet"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Cuidado Animal & Afeto",
    "foto": "data_personas/imagens_personagens/personagem_53_marcio_jose_da_rocha.jpg"
  },
  {
    "id": 54,
    "nome_completo": "Mauro 'Seu Mauro' Quintanilha",
    "idade": 63,
    "genero_etnia": "Homem Branco",
    "profissao": "Tapeceiro Artesanal de Veículos e Estofados Antigos",
    "bairro": "Residencial Flamboyant",
    "localizacao": "Residencial Flamboyant, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Carro antigo restaurado e Caminhada",
    "historia_resumida": "Herdeiro da tradição de tapeçaria automotiva em Santana, restaura interiores de carros clássicos, bancos de couro e poltronas de época com costura dupla manual perfeita.",
    "dor_principal": "A dificuldade em encontrar couros bovinos legítimos tingidos no padrão original dos anos 70 e espumas de alta densidade duráveis.",
    "habitos": {
      "alimentacao": "Comida de boteco tradicional, torresmo sequinho com limão, arroz com tutu de feijão e café fresco passado na hora.",
      "consumo": "Couros legítimos de curtumes selecionados, linhas de náilon de alta tenacidade e ferramentas manuais de tapeceiro.",
      "vestuario": "Aventais grossos de lona pesada sobre a roupa, camisas jeans duráveis e calçados confortáveis para trabalho em pé.",
      "aversoes": "Materiais sintéticos plásticos que esfarelam com o calor do sol e clientes que exigem pressa em restaurações artísticas.",
      "paixoes": "Participar de encontros de carros clássicos no Parque da Cidade, ouvir sambas antigos no rádio e contar histórias de Santana."
    },
    "lugares_frequenta_sjc": [
      "Parque da Cidade",
      "Feira de Santana",
      "Oficinas Tradicionais da Zona Norte"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Classic Motors",
        "handle": "classicmotors"
      },
      {
        "nome": "Rádio Nativa FM",
        "handle": "nativafmsjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Restauração Brasil",
        "handle": "restauracaoclassicos"
      },
      {
        "nome": "Memória Joseense",
        "handle": "memoria_joseense"
      }
    ],
    "estilo_consumo_tag": "Restauração & Tradição Manual",
    "foto": "data_personas/imagens_personagens/personagem_54_renata_silveira_camargo.jpg"
  },
  {
    "id": 55,
    "nome_completo": "Renata 'Re' Schimidt",
    "idade": 36,
    "genero_etnia": "Mulher Branca",
    "profissao": "Engenheira de Telecomunicações & Redes de Alta Velocidade",
    "bairro": "Vila Nova São José",
    "localizacao": "Vila Nova São José, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "Carro SUV Híbrido",
    "historia_resumida": "Planeja e executa a infraestrutura de antenas 5G e data centers de missão crítica para polos industriais e condomínios inteligentes do Vale. Vive no Aquarius pela conectividade e estilo de vida moderno.",
    "dor_principal": "A demora nos processos de licenciamento municipal para instalação de novas antenas de telecomunicação urbana.",
    "habitos": {
      "alimentacao": "Pratos equilibrados da culinária mediterrânea, café expresso gourmet e smoothies funcionais com sementes.",
      "consumo": "Equipamentos de análise de espectro de radiofrequência, gadgets tecnológicos inteligentes e viagens internacionais.",
      "vestuario": "Tailleur executivo contemporâneo em cores sóbrias, camisas de seda e sapatos scarpin confortáveis.",
      "aversoes": "Negacionismo tecnológico, teorias da conspiração sobre redes sem fio e fornecedores que não cumprem SLA.",
      "paixoes": "Praticar corrida de rua na Praça Ulisses Guimarães, leitura sobre inteligência artificial e degustação de vinhos brancos."
    },
    "lugares_frequenta_sjc": [
      "Praça Ulisses Guimarães",
      "Colinas Shopping",
      "Restaurantes da Av. São João"
    ],
    "veiculos_midia": [
      {
        "nome": "Tele.Síntese Notícias",
        "handle": "telesintese"
      },
      {
        "nome": "Valor Econômico",
        "handle": "valoreconomico"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Telecom na Prática",
        "handle": "telecompractice"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Telecomunicações & Modernidade",
    "foto": "data_personas/imagens_personagens/personagem_55_walter_egidio_guimaraes.jpg"
  },
  {
    "id": 56,
    "nome_completo": "Bruno 'Brunão' Marins",
    "idade": 34,
    "genero_etnia": "Homem Negro",
    "profissao": "Pitmaster & Proprietário de Defumados e Carnes Artesanais",
    "bairro": "Jardim Santa Luzia",
    "localizacao": "Jardim Santa Luzia, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "Empreendedorismo Intuitivo",
    "faixa_renda": "Classe C1",
    "meio_transporte_principal": "Picape utilitária",
    "historia_resumida": "Especialista em churrasco americano e defumação lenta com lenhas frutíferas (macieira e laranjeira). Montou seu negócio de charcutaria e brisket artesanal no Bosque dos Ipês e faz eventos em toda a região.",
    "dor_principal": "A alta oscilação nos preços dos cortes de carne bovina angus de primeira linha e o custo do frete de lenhas especiais.",
    "habitos": {
      "alimentacao": "Costelinha suína ao molho barbecue autoral, brisket defumado por doze horas, picles artesanais e cerveja gelada.",
      "consumo": "Pit smokers industriais de fluxo reverso, termômetros sem fio de alta precisão e facas artesanais de aço damasco.",
      "vestuario": "Aventais pesados de couro legítimo, camisetas pretas estampadas com sua marca e bonés de aba curva.",
      "aversoes": "Carnes ressecadas mal preparadas e pessoas que colocam água no carvão do churrasco.",
      "paixoes": "Participar de festivais de churrasco e barbecue pelo Brasil, criar novos molhos artesanais e ouvir rock clássico."
    },
    "lugares_frequenta_sjc": [
      "Praças do Bosque dos Ipês",
      "Shopping Jardim Oriente",
      "Feiras Gastronômicas de SJC"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Barbecue Brasil",
        "handle": "bbqbrasil"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Netão Bom Beef",
        "handle": "netaobombeef"
      },
      {
        "nome": "Guia Gastronômico Vale",
        "handle": "gastronomiavale"
      }
    ],
    "estilo_consumo_tag": "Barbecue Artesanal & Fumaça Nobre",
    "foto": "data_personas/imagens_personagens/personagem_56_wanderson_clayton_de_souza.jpg"
  },
  {
    "id": 57,
    "nome_completo": "Lúcia Helena Guimarães",
    "idade": 56,
    "genero_etnia": "Mulher Branca",
    "profissao": "Assistente Social de Centro de Referência Municipal",
    "bairro": "Bairro dos Marmelos",
    "localizacao": "Bairro dos Marmelos, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Caminhada e Ônibus",
    "historia_resumida": "Dedica sua carreira ao atendimento de famílias em situação de vulnerabilidade e idosos nos programas sociais da prefeitura. Mora no calçadão do centro e conhece todas as nuances e contrastes da cidade.",
    "dor_principal": "A burocracia excessiva nos encaminhamentos de saúde pública e a escassez de vagas em abrigos de acolhimento social.",
    "habitos": {
      "alimentacao": "Comida simples e saudável, café com pão na chapa nas padarias históricas do calçadão e sopas nutritivas à noite.",
      "consumo": "Livros de ciências sociais e direitos humanos em sebos do centro, produtos de higiene para doação e calçados confortáveis.",
      "vestuario": "Calças de tecido maleável confortáveis, blusas de algodão estampadas discretas e bolsas grandes utilitárias.",
      "aversoes": "Aporofobia, preconceito contra populações periféricas e desperdício de verbas públicas destinadas à assistência social.",
      "paixoes": "Participar de projetos voluntários de distribuição de alimentos, passear pelas praças do centro e ouvir música popular brasileira."
    },
    "lugares_frequenta_sjc": [
      "Praça Afonso Pena",
      "Calçadão da Rua 15 de Novembro",
      "Mercado Municipal de SJC"
    ],
    "veiculos_midia": [
      {
        "nome": "TV Vanguarda",
        "handle": "redevanguarda"
      },
      {
        "nome": "Portal G1 Vale",
        "handle": "g1valeparaiba"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Padre Júlio Lancellotti",
        "handle": "padrejulio.lancellotti"
      },
      {
        "nome": "Carlos Abranches",
        "handle": "carlosabranchesoficial"
      }
    ],
    "estilo_consumo_tag": "Humanitário & Assistência Social",
    "foto": "data_personas/imagens_personagens/personagem_57_rosana_cassia_dos_santos.jpg"
  },
  {
    "id": 58,
    "nome_completo": "Guilherme 'Gui' Esteves",
    "idade": 31,
    "genero_etnia": "Homem Branco",
    "profissao": "Executivo de Vendas de Software Corporativo (SaaS)",
    "bairro": "Chácaras Reunidas",
    "localizacao": "Chácaras Reunidas, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "A Cidade Prometida",
    "faixa_renda": "Classe A",
    "meio_transporte_principal": "SUV Premium Alemão",
    "historia_resumida": "Negocia contratos milionários de softwares de gestão empresarial para indústrias e redes varejistas em todo o Brasil. Vive no Urbanova em busca de qualidade de vida, esportes e segurança.",
    "dor_principal": "Ciclos longos e imprevisíveis de fechamento de contratos corporativos durante períodos de instabilidade econômica.",
    "habitos": {
      "alimentacao": "Pratos à base de salmão grelhado, jantares em restaurantes premiados da Vila Ema e cafés espressos de cápsula.",
      "consumo": "Gadgets da Apple de última geração, trajes esportivos de marcas premium e assinaturas de plataformas de negócios.",
      "vestuario": "Camisas polo de marcas renomadas, calças de corte slim e tênis esportivos casuais de couro legítimo.",
      "aversoes": "Reuniões comerciais desestruturadas sem tomada de decisão e promessas de entrega não cumpridas.",
      "paixoes": "Jogar futevôlei nas quadras do Urbanova, passear de lancha na represa nos fins de semana e viajar para o exterior."
    },
    "lugares_frequenta_sjc": [
      "Colinas Shopping",
      "Quadras de Areia do Urbanova",
      "Restaurantes da Vila Ema"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Exame",
        "handle": "exame"
      },
      {
        "nome": "Valor Econômico",
        "handle": "valoreconomico"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Thiago Nigro (Primo Rico)",
        "handle": "thiago.nigro"
      },
      {
        "nome": "Lucas Sanseverino",
        "handle": "lucassanseverino"
      }
    ],
    "estilo_consumo_tag": "Corporativo & Vendas de Alta Renda",
    "foto": "data_personas/imagens_personagens/personagem_58_hideo_kazuo_matsui.jpg"
  },
  {
    "id": 59,
    "nome_completo": "Talita 'Tali' Rezende",
    "idade": 27,
    "genero_etnia": "Mulher Parda",
    "profissao": "Produtora Cultural & Gestora de Festivais de Música e Arte",
    "bairro": "Jardim Santo Onofre",
    "localizacao": "Jardim Santo Onofre, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "A Tribo Global",
    "faixa_renda": "Classe B",
    "meio_transporte_principal": "Carro compacto e Bicicleta",
    "historia_resumida": "Organiza feiras de arte independente, festivais de jazz e mostras de cinema ao ar livre no Parque Vicentina Aranha e espaços alternativos de SJC, conectando artistas locais ao público jovem.",
    "dor_principal": "A escassez de editais municipais de fomento à cultura independente e o excesso de burocracia para uso de espaços públicos.",
    "habitos": {
      "alimentacao": "Petiscos vegetarianos criativos, chás naturais aromatizados com gengibre e cervejas artesanais de microcervejarias do Vale.",
      "consumo": "Equipamentos de iluminação cênica portátil, cartazes em serigrafia autoral e livros de produção cultural.",
      "vestuario": "Roupas vintage garimpadas em brechós conceituais, jaquetas jeans customizadas e botas de cano curto.",
      "aversoes": "Censura artística, falta de pontualidade em montagens de palco e preconceito contra manifestações culturais populares.",
      "paixoes": "Descobrir novos músicos e bandas autorais do Vale, frequentar mostras no Sesc e viajar para bienais de arte."
    },
    "lugares_frequenta_sjc": [
      "Parque Vicentina Aranha",
      "Sesc São José dos Campos",
      "Bares Culturais da Vila Ema"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Bravo Cultural",
        "handle": "bravocultura"
      },
      {
        "nome": "Explore SJC",
        "handle": "exploresjc"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Cultura em SP",
        "handle": "culturasp"
      },
      {
        "nome": "Fica a Dica SJC",
        "handle": "ficaadicasjc"
      }
    ],
    "estilo_consumo_tag": "Cultura Independente & Vanguarda",
    "foto": "data_personas/imagens_personagens/personagem_59_vanessa_beatriz_rossi.jpg"
  },
  {
    "id": 60,
    "nome_completo": "Antônio Carlos 'Tonho' Viana",
    "idade": 60,
    "genero_etnia": "Homem Pardo",
    "profissao": "Apicultor & Produtor de Mel Silvestre da Serra da Mantiqueira",
    "bairro": "Recanto dos Eucaliptos",
    "localizacao": "Putim / Recanto dos Eucaliptos, São José dos Campos",
    "regiao": "Sudeste",
    "movimento": "Geografia da Inércia",
    "faixa_renda": "Classe C2",
    "meio_transporte_principal": "Caminhonete 4x4 e Cavalo",
    "historia_resumida": "Cuida de mais de duzentas colmeias de abelhas nativas sem ferrão (Jataí, Mandaçaia) e abelhas melíferas nas matas preservadas de São Francisco Xavier, produzindo um dos méis mais premiados do Vale.",
    "dor_principal": "O uso clandestino de defensivos agrícolas em lavouras vizinhas que intoxica e dizima enxames de abelhas nativas.",
    "habitos": {
      "alimentacao": "Mel silvestre puro no café da manhã, queijo da serra com broa de fubá e comida caipira feita no fogão a lenha.",
      "consumo": "Macacões de apicultor com tela especial, centrífugas extratoras de mel em aço inox e embalagens de vidro esterilizadas.",
      "vestuario": "Camisas de algodão grosso de manga comprida, calças de lida reforçadas, botinas de couro e chapéu de palha.",
      "aversoes": "Méis adulterados com xarope de açúcar vendidos em feiras clandestinas e desmatamento de florestas nativas.",
      "paixoes": "Observar a dança das abelhas nas floradas da serra, tocar viola caipira no alpendre e prosear com os vizinhos de SFX."
    },
    "lugares_frequenta_sjc": [
      "Vila de São Francisco Xavier",
      "Trilhas das Lavras",
      "Mercado da Cidade de SJC"
    ],
    "veiculos_midia": [
      {
        "nome": "Revista Apicultura Brasil",
        "handle": "apiculturabrasil"
      },
      {
        "nome": "Jornal de SFX",
        "handle": "sfx_noticias"
      }
    ],
    "influenciadores_seguidos": [
      {
        "nome": "Abelhas Nativas Brasil",
        "handle": "abelhasnativas"
      },
      {
        "nome": "Explore SFX",
        "handle": "exploresfx"
      }
    ],
    "estilo_consumo_tag": "Apicultura Sustentável & Serra",
    "foto": "data_personas/imagens_personagens/personagem_60_agostinho_celso_pires.jpg"
  }
];

  let currentActiveTab = 'oracle'; // 'oracle' ou 'dossier'
  let oracleScreenState = 'welcome'; // 'welcome' ou 'game'
  let currentOracleStep = 1; // 1..5 = Perguntas Diretas
  let readingPhase = 'idle'; // 'idle', 'shuffling', 'dealing', 'analyzing', 'revealed'
  let analysisProgressText = 'Iniciando leitura...';

  // Mascote Capivara: Imagens de Alta Resolução em data_personas/capivara/
  const MASCOT_IMAGES = {
    welcome: 'data_personas/capivara/01_boas_vindas.png',
    curious: 'data_personas/capivara/02_curiosa.png',
    thinking: 'data_personas/capivara/03_pensativa.png',
    surprised: 'data_personas/capivara/04_surpresa.png',
    celebration: 'data_personas/capivara/05_celebracao.png'
  };

  let currentMascotState = 'welcome';
  let temporarySpeechTimeout = null;

    const MASCOT_MESSAGES = {
    welcome: 'Olá! Eu sou a Kapy, sua assessora de inteligência de mercado em São José dos Campos. Vou cruzar seus dados com as 60 personas reais da cidade!',
    curious: 'Excelente escolha! Esse perfil traz características marcantes do comportamento de consumo em SJC.',
    thinking: 'Estou cruzando afinidades territoriais, hábitos de mobilidade e a Pesquisa Radar 2026...',
    surprised: 'Uma combinação muito potente! As cartas revelam conexões estratégicas para o seu negócio!',
    celebration: 'Eureca! Suas 3 cartas sagradas foram reveladas. Vamos ao veredito estratégico!'
  };

  let oracleAnswers = {
    q1_proposta: '',
    q2_ticket: '',
    q3_regiao: '',
    q4_canal: '',
    q5_texto_livre: ''
  };

  let currentDossierFilter = {
    search: '',
    regiao: '',
    movimento: '',
    consumo: ''
  };

  let oracleResultCards = null;

  const STOPWORDS = new Set([
    'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'ate', 'até', 'com', 'como', 'da', 'das',
    'de', 'dela', 'delas', 'dele', 'deles', 'do', 'dos', 'e', 'ela', 'elas', 'ele', 'eles', 'em', 'entre', 'era', 'eram',
    'essa', 'essas', 'esse', 'esses', 'esta', 'estas', 'este', 'estes', 'eu', 'foi', 'fomos', 'foram', 'ha', 'há', 'isso',
    'isto', 'ja', 'já', 'lhe', 'lhes', 'mais', 'mas', 'me', 'mesmo', 'meu', 'meus', 'minha', 'minhas', 'muito', 'na',
    'nao', 'não', 'nas', 'nem', 'no', 'nos', 'nós', 'nossa', 'nossas', 'nosso', 'nossos', 'num', 'numa', 'o', 'os', 'ou',
    'para', 'pela', 'pelas', 'pelo', 'pelos', 'por', 'qual', 'quando', 'que', 'quem', 'se', 'sem', 'ser', 'seu', 'seus',
    'so', 'só', 'sua', 'suas', 'tambem', 'também', 'te', 'tem', 'temos', 'tenho', 'ter', 'teu', 'teus', 'tu', 'tua',
    'tuas', 'um', 'uma', 'umas', 'uns', 'voce', 'você', 'voces', 'vocês', 'quero', 'vendo', 'busco', 'preciso', 'cliente', 'clientes'
  ]);

  function normalizeText(txt) {
    if (!txt) return '';
    return txt
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .trim();
  }

  function extractTokens(txt) {
    const norm = normalizeText(txt);
    return norm.split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
  }

  function setMascotState(state, customSpeech = null, temporaryDuration = 0) {
    currentMascotState = state;
    const imgEl = document.getElementById('capivara-mascot-img');
    const speechEl = document.getElementById('capivara-speech-text');

    if (imgEl && MASCOT_IMAGES[state]) {
      imgEl.classList.add('is-changing');
      setTimeout(() => {
        imgEl.src = MASCOT_IMAGES[state];
        imgEl.className = `capivara-mascot-img capivara-anim-${state}`;
        imgEl.classList.remove('is-changing');
      }, 150);
    }

    if (speechEl) {
      const text = customSpeech || MASCOT_MESSAGES[state] || MASCOT_MESSAGES.welcome;
      speechEl.innerText = text;
    }

    if (temporaryDuration > 0) {
      if (temporarySpeechTimeout) clearTimeout(temporarySpeechTimeout);
      temporarySpeechTimeout = setTimeout(() => {
        setMascotState('welcome');
      }, temporaryDuration);
    }
  }

  const CAPIVARA_TIPS = [
    'Dica da Capivara: No Aquarius e Colinas, o joseense valoriza tecnologia rápida e conveniência sem atrito!',
    'Dica da Capivara: Na Vila Ema e Adyana, a curadoria de estética, ambiente autoral e café especial vencem o preço baixo!',
    'Dica da Capivara: Na Zona Sul (Satélite e Bosque), atendimento ágil no WhatsApp e falar direto com o dono fecham negócio na hora!',
    'Dica da Capivara: Em Santana e Zona Norte, a tradição, o boca a boca familiar e a palavra dada são sagrados!',
    'Dica da Capivara: No Urbanova e Esplanada, prestígio, alto padrão e tranquilidade para a família mandam na decisão.'
  ];

  function triggerCapivaraInteraction() {
    const states = ['curious', 'surprised', 'thinking'];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const randomTip = CAPIVARA_TIPS[Math.floor(Math.random() * CAPIVARA_TIPS.length)];
    setMascotState(randomState, randomTip, 4500);
  }

  // ----------------------------------------------------
  // MOTOR DE LEITURA & TARÔ AUTÊNTICO (60 CARTAS REAIS)
  // ----------------------------------------------------
  async function calculateAuthenticTarotSpread(answers) {
    try {
      const response = await fetch('/api/oraculo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answers,
          personasData: PERSONAS_SJC_DATA
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && (data.primary_persona_id || data.primary)) {
          const primId = data.primary_persona_id || (data.primary && data.primary.id) || 1;
          const multId = data.multiplier_persona_id || (data.multiplier && data.multiplier.id) || 2;
          const shadId = data.shadow_persona_id || (data.shadow && data.shadow.id) || 3;

          data.primary = PERSONAS_SJC_DATA.find(p => p.id === primId) || PERSONAS_SJC_DATA[0];
          data.multiplier = PERSONAS_SJC_DATA.find(p => p.id === multId) || PERSONAS_SJC_DATA[1];
          data.shadow = PERSONAS_SJC_DATA.find(p => p.id === shadId) || PERSONAS_SJC_DATA[2];

          data.primaryScore = 94;
          data.multiplierScore = 88;
          data.shadowScore = 72;

          // Assegura que o título e a primeira frase resumam o prompt da ideia
          const summary = summarizeIdeaPrompt(answers.q5_texto_livre, answers);
          if (!data.titulo_leitura || data.titulo_leitura.includes('quro') || data.titulo_leitura.endsWith('...')) {
            data.titulo_leitura = summary.title;
          }
          if (data.veredito_ideia) {
            let fala = data.veredito_ideia.conversa_franca_kapy || data.diagnostico_executivo || '';
            if (fala && !fala.startsWith('A sua proposta') && !fala.startsWith('O seu objetivo') && !fala.startsWith('Você busca')) {
              data.veredito_ideia.conversa_franca_kapy = `${summary.leadSentence} ${fala}`;
            }
          }

          return data;
        }
      }
    } catch (e) {
      console.warn('API /api/oraculo indisponível, usando motor analítico avançado de contingência:', e);
    }

    return calculateOracleMatchesFallback(answers);
  }

  function summarizeIdeaPrompt(rawText, answers = {}) {
    const regiaoNomes = {
      centro: "Região Central (Vila Ema, Adyana e São Dimas)",
      sul: "Região Sul (Jardim Satélite, Floradas e Bosque)",
      leste: "Região Leste (Vista Verde e Eugênio de Melo)",
      oeste: "Região Oeste (Aquarius, Urbanova e Colinas)",
      norte: "Região Norte (Santana e Altos de Santana)",
      sudeste: "Região Sudeste (Putim e São Judas Tadeu)"
    };
    const targetReg = (answers.q3_regiao || '').toLowerCase();
    const regiao = regiaoNomes[targetReg] || "São José dos Campos";

    if (!rawText || !rawText.trim()) {
      const propMap = {
        inovacao: "desenvolver uma solução tecnológica ou inovadora",
        luxo: "estruturar um serviço exclusivo de alto padrão",
        tradicao: "consolidar um negócio tradicional com atendimento de confiança",
        agilidade: "lançar um serviço rápido e descomplicado do dia a dia"
      };
      const prop = propMap[answers.q1_proposta] || "desenvolver um novo projeto comercial";
      return {
        title: `Diagnóstico Estratégico: Posicionamento na ${regiao.split('(')[0].trim()}`,
        leadSentence: `O seu objetivo é ${prop} com foco prioritário na ${regiao}.`
      };
    }

    let clean = rawText.trim().replace(/\s+/g, ' ');
    let intent = clean.replace(/^(eu\s+)?(quro|quero|gostaria de|pretendo|desejo|estou querendo|minha ideia é|planejo)\s+/i, '');
    intent = intent.replace(/\bminhas\b/gi, 'suas')
                   .replace(/\bmeus\b/gi, 'seus')
                   .replace(/\bminha\b/gi, 'sua')
                   .replace(/\bmeu\b/gi, 'seu');
    intent = intent.charAt(0).toUpperCase() + intent.slice(1);
    intent = intent.replace(/[.!?]+$/, '');

    let titleSubject = intent.length > 52 ? intent.slice(0, 50).replace(/\s+\S*$/, '') + '...' : intent;
    let title = `Diagnóstico Estratégico: ${titleSubject}`;

    let leadSentence = `A sua proposta é ${intent.charAt(0).toLowerCase() + intent.slice(1)} com atuação na ${regiao}.`;

    return { title, leadSentence };
  }

  function calculateOracleMatchesFallback(answers) {
    const movMap = {
      'inovacao': 'Tribo Global',
      'luxo': 'Cidade Prometida',
      'tradicao': 'Geografia da Inércia',
      'agilidade': 'Empreendedorismo Intuitivo'
    };

    const targetMov = movMap[answers.q1_proposta] || 'Tribo Global';
    const targetRegiao = (answers.q3_regiao || '').toLowerCase();
    const targetTicket = answers.q2_ticket || '';
    const userTokens = extractTokens(answers.q5_texto_livre || '');

    const scoredPersonas = PERSONAS_SJC_DATA.map(p => {
      let score = 50;

      // Dimensão 1: Proposta / Movimento (+20 pts)
      if (targetMov && p.movimento && p.movimento.toLowerCase().includes(targetMov.toLowerCase())) {
        score += 20;
      }

      // Dimensão 2: Território & Região em SJC (+20 pts)
      const pRegiao = (p.regiao || '').toLowerCase();
      if (targetRegiao && pRegiao.includes(targetRegiao)) {
        score += 20;
      }

      // Dimensão 3: Ticket / Estilo de Vida (+10 pts)
      const renda = (p.faixa_renda || '').toLowerCase();
      if (targetTicket === 'alto' && (renda.includes('classe a') || renda.includes('classe b'))) {
        score += 10;
      } else if (targetTicket === 'economico' && (renda.includes('classe c') || renda.includes('classe d'))) {
        score += 10;
      } else if (targetTicket === 'experiencia' || targetTicket === 'custo_beneficio') {
        score += 8;
      }

      // Dimensão 4: Canal & Influência (+5 pts)
      if (answers.q4_canal === 'instagram' && p.influenciadores_seguidos && p.influenciadores_seguidos.length > 0) {
        score += 5;
      } else if (answers.q4_canal === 'eventos' && p.lugares_frequenta_sjc && p.lugares_frequenta_sjc.length > 0) {
        score += 5;
      } else {
        score += 3;
      }

      // Dimensão 5: Correspondência de Palavras-Chave do Desafio Livre (+15 pts)
      if (userTokens.length > 0) {
        const pool = normalizeText(`${p.nome_completo} ${p.profissao} ${p.bairro} ${p.dor_principal} ${p.historia_resumida} ${p.habitos?.alimentacao || ''} ${p.habitos?.consumo || ''}`);
        let matches = 0;
        userTokens.forEach(t => {
          if (pool.includes(t)) matches++;
        });
        score += Math.min(15, matches * 4);
      }

      // Dimensão 6: Alinhamento Estrito de Nicho e Gênero (+35 pts)
      const fullText = normalizeText(answers.q5_texto_livre || '');
      const isMaleNiche = /\b(masculin[oa]s?|homem|homens|barbearia|cueca|barba|terno|cavalheiro|pai|pais)\b/.test(fullText);
      const isFemaleNiche = /\b(feminin[oa]s?|mulher|mulheres|maquiagem|unha|unhas|manicure|estetica facial|depilacao|lingerie|vestido|mae|maes|gravida|gestante)\b/.test(fullText);
      const personaGenero = (p.genero_etnia || '').toLowerCase();
      const isPersonaMale = personaGenero.startsWith('homem');
      const isPersonaFemale = personaGenero.startsWith('mulher');

      if (isMaleNiche) {
        if (isPersonaMale) score += 35;
        else if (isPersonaFemale) score -= 40; // Penaliza severamente para nunca indicar mulher como comprador principal de nicho exclusivamente masculino
      } else if (isFemaleNiche) {
        if (isPersonaFemale) score += 35;
        else if (isPersonaMale) score -= 40;
      }

      const variance = (p.id % 4) + 1;
      const finalScore = Math.min(98, Math.max(30, score + variance));

      return {
        persona: p,
        score: finalScore
      };
    }).sort((a, b) => b.score - a.score);

    const primary = scoredPersonas[0].persona;
    // Multiplicador: prefere perfil ativo na rede e compatível com o nicho
    const multiplier = (scoredPersonas.slice(1).find(x => x.persona.influenciadores_seguidos?.length > 0 || (x.persona.faixa_renda || '').includes('Classe A')) || scoredPersonas[1]).persona;
    // Sombra / Ponto Cego: persona com fricção de inércia ou contraponto crítico
    const shadow = (scoredPersonas.slice().reverse().find(x => x.persona.id !== primary.id && x.persona.id !== multiplier.id && ((x.persona.movimento || '').includes('Geografia da Inércia') || x.persona.idade > 45)) || scoredPersonas[scoredPersonas.length - 1]).persona;

    const regiaoNomes = {
      centro: "Região Centro (Vila Ema, Adyana e São Dimas)",
      sul: "Região Sul (Jardim Satélite, Floradas e Bosque)",
      leste: "Região Leste (Vista Verde, Eugênio de Melo e Novo Horizonte)",
      oeste: "Região Oeste (Aquarius, Urbanova e Colinas)",
      norte: "Região Norte (Santana e Altos de Santana)",
      sudeste: "Região Sudeste (Região do Putim e São Judas Tadeu)"
    };

    const canalNomes = {
      instagram: "Instagram & Reels Autoral",
      whatsapp: "WhatsApp Direto e Rápido",
      google: "Google Maps & SEO Local",
      eventos: "Parcerias, Eventos e Boca a Boca"
    };

    // Resumo inteligente do prompt da ideia
    const summary = summarizeIdeaPrompt(answers.q5_texto_livre, answers);

    return {
      primary_persona_id: primary.id,
      multiplier_persona_id: multiplier.id,
      shadow_persona_id: shadow.id,
      primary: primary,
      multiplier: multiplier,
      shadow: shadow,
      primaryScore: scoredPersonas[0].score,
      multiplierScore: Math.min(scoredPersonas[0].score - 5, 88),
      shadowScore: 71,
      titulo_leitura: summary.title,
      nivel_confianca: "alto",
      hipoteses_criticas: [
        `Forte aderência no público qualificado de ${primary.bairro} que busca alternativas com atendimento autoral em SJC.`,
        `Multiplicação comunitária rápida através do círculo de influência de ${multiplier.nome_completo}.`
      ],
      veredito_ideia: {
        status: "analise_contextual",
        rotulo: "DIAGNÓSTICO CONTEXTUAL • SÃO JOSÉ DOS CAMPOS 2026",
        conversa_franca_kapy: `${summary.leadSentence} Analisando a sua proposta à luz dos microdados de São José dos Campos, o seu modelo toca em demandas concretas da cidade, mas enfrenta atritos comportamentais específicos da praça. O morador da ${regiaoNomes[targetRegiao] || 'região prioritária'} possui capacidade de consumo, porém opera com forte apego à conveniência e rigorosa exigência de credibilidade. Quando uma proposta soa genérica ou puramente digital, a adesão inicial costuma ser tímida. Por outro lado, soluções que demonstram presença territorial tangível, pontualidade técnica e recomendação de pares conseguem romper a inércia dos condomínios. A decisão de avançar depende de como você equaliza a sua proposta com as 3 forças mapeadas a seguir nas cartas:`,
        tese_de_posicionamento: `Construir diferenciação através de ancoragem técnica local, conveniência de acesso e validação em círculos de confiança do território.`
      },
      bloco_persona_central: {
        fala_kapy: (() => {
          const isM = (primary.genero_etnia || '').toLowerCase().startsWith('homem');
          const pron = isM ? 'Ele' : 'Ela';
          const dele = isM ? 'dele' : 'dela';
          return `Ao analisar a sua proposta sob a perspectiva da demanda direta em São José dos Campos, o perfil de maior aderência inicial é **${primary.nome_completo}**. ${pron} vivencia a rotina de ${primary.bairro}, enfrenta os desafios de mobilidade entre os anéis viários e bairros centrais, e valoriza soluções consistentes que entreguem conveniência real sem a necessidade de buscar referências fora da cidade. Quando a sua proposta comunica com clareza a resolução dessa necessidade pelo canal ${canalNomes[answers.q4_canal] || 'escolhido'}, o processo de consideração e fechamento ganha tração imediata.`;
        })(),
        job_to_be_done: "Resolver sua necessidade com excelência comprovada, economizando tempo e evitando a frustração de deslocamentos desnecessários.",
        mensagem_conquista: `Solução estruturada para o perfil de ${primary.bairro}: qualidade técnica, conveniência local e respeito ao seu tempo.`,
        como_vencer_objecao: "Apresentar prova social consistente de SJC, clareza cirúrgica nos prazos e contato consultivo direto e ágil."
      },
      bloco_alavanca: {
        fala_kapy: (() => {
          const isM = (multiplier.genero_etnia || '').toLowerCase().startsWith('homem');
          const pron = isM ? 'Ele' : 'Ela';
          const dele = isM ? 'dele' : 'dela';
          return `Em São José dos Campos, a decisão de compra é fortemente modulada pela validação entre pares e reputação comunitária. **${multiplier.nome_completo}** representa o perfil catalisador para destravar o seu boca a boca qualificado. ${pron} possui trânsito ativo e respeitabilidade no circuito de ${multiplier.bairro}. A aproximação estratégica com este perfil não visa uma venda pontual, mas sim a construção de uma relação de valor mútuo cujo endosso espontâneo reverbera em toda a sua rede de contatos.`;
        })(),
        mecanismo_influencia: "Indicação pessoal em círculos profissionais e grupos comunitários locais, onde sua palavra possui alto peso de validação.",
        estrategia_parceria: `Propor uma ação piloto de relacionamento ou co-branding no circuito de ${multiplier.bairro}, oferecendo uma condição especial para sua rede de contatos.`,
        risco_ativacao: "Tornar a parceria meramente transacional; é fundamental que a persona realmente experimente e aprove a entrega."
      },
      bloco_ponto_cego: {
        fala_kapy: `A terceira carta destaca uma reflexão fundamental sobre a **Geografia da Inércia** em São José dos Campos. O consumidor joseense frequentemente reconhece a qualidade de uma novidade, porém tende a permanecer nas opções tradicionais por receio de risco ou atrito operacional. Campanhas com apelos puramente digitais ou tom forasteiro tendem a gerar distanciamento. A superação sustentável dessa barreira exige ancoragem local tangível, transparência nas garantias e respeito à dinâmica cultural da praça.`,
        armadilha_local: "A tradicional cautela joseense diante de novidades apressadas ou abordagens que desconsiderem os hábitos dos bairros e o trânsito viário.",
        o_que_nunca_fazer: "Adotar tom genérico ou impor processos de atendimento excessivamente robotizados sem acolhimento consultivo.",
        acao_blindagem: "Demonstrar ancoragem e referências sólidas em SJC, apresentar garantias claras e manter canais ágeis de relacionamento."
      },
      bloco_plano_ataque: {
        fala_kapy: "Sob a ótica de alocação prudente de recursos e esforço comercial em São José dos Campos, a trajetória recomendada para validação progressiva compreende os seguintes passos:",
        primeiro_passo_7_dias: `Rodar um teste tático de 7 dias com uma oferta piloto focada nos moradores de ${primary.bairro}, mensurando a taxa de retorno imediato.`,
        passos_taticos: [
          {
            prioridade: 1,
            acao: "Lançamento da mensagem de conquista com foco na dor de " + primary.nome_completo,
            publico: primary.nome_completo + " e moradores de perfil similar em " + primary.bairro,
            canal_ou_territorio: canalNomes[answers.q4_canal] || "Canal Prioritário",
            mensagem_ou_oferta: "Condição inaugural com atendimento personalizado e validação assistida",
            objetivo: "Conquistar os primeiros clientes promotores orgânicos",
            indicador_inicial: "Taxa de resposta e conversão no primeiro contato"
          },
          {
            prioridade: 2,
            acao: "Ativação da Alavanca Multiplicadora através de " + multiplier.nome_completo,
            publico: "Rede profissional e comunidade de influência de " + multiplier.bairro,
            canal_ou_territorio: "Networking regional e eventos locais",
            mensagem_ou_oferta: "Apresentação da solução com foco em valor compartilhado para a comunidade",
            objetivo: "Gerar o efeito de recomendação boca a boca qualificada",
            indicador_inicial: "Novos contatos que chegam citando a indicação"
          },
          {
            prioridade: 3,
            acao: "Blindagem operacional contra o ponto cego identificado",
            publico: "Clientes em fase de consideração com perfil conservador",
            canal_ou_territorio: "Pontos de contato comerciais e suporte em SJC",
            mensagem_ou_oferta: "Garantias explícitas de entrega e atendimento consultivo direto",
            objetivo: "Eliminar a barreira de desconfiança e acelerar a decisão",
            indicador_inicial: "Redução do tempo médio entre o primeiro contato e o fechamento"
          }
        ]
      },
      diagnostico_executivo: `A proposta possui alta aderência com as tensões reprimidas de São José dos Campos, em especial na ${regiaoNomes[targetRegiao] || 'região central'}. O joseense deste estrato valoriza conveniência sem atrito, padrão superior e atendimento que transmita segurança imediata. Ao utilizar ${canalNomes[answers.q4_canal] || 'o canal prioritário'}, o negócio quebra a inércia dos condomínios fechados e ativa a decisão por recomendação.`,
      tese_de_posicionamento: `Posicionar como a referência autoral e confiável da cidade que entrega padrão de capital com o acolhimento e a agilidade que o morador de SJC exige.`,
      analise_persona_central: {
        nome_persona: primary.nome_completo,
        motivo_aderencia: `${primary.nome_completo} vive a rotina de ${primary.bairro} e sente diretamente a dor de ${primary.dor_principal || 'falta de soluções sob medida em SJC'}, sendo a compradora natural para validar a proposta nos primeiros 30 dias.`,
        job_to_be_done: "Resolver sua necessidade com excelência comprovada, economizando tempo e evitando a frustração de deslocamentos para fora da cidade.",
        mensagem_de_conquista: `Criado para quem vive ${primary.bairro}: excelência técnica, conveniência absoluta e respeito ao seu tempo.`,
        estrategia_abordagem: `Abordagem focada em transparência e demonstração de valor prático no canal ${canalNomes[answers.q4_canal] || 'escolhido'}, com resposta rápida e sem automações robóticas.`,
        objecao_provavel: "Receio de pagar por uma promessa que não se sustente na prática ou que gere atrito no atendimento.",
        resposta_a_objecao: "Apresentar prova social consistente, clareza cirúrgica nos prazos e contato humanizado direto com quem decide."
      },
      analise_alavanca: {
        nome_persona: multiplier.nome_completo,
        papel_multiplicador: `${multiplier.nome_completo} possui circulação ativa e alto capital relacional em SJC, funcionando como o vetor ideal para expandir a recomendação do negócio.`,
        mecanismo_de_influencia: "Indicação pessoal em círculos profissionais e grupos comunitários locais, onde sua palavra possui alto peso de validação.",
        mensagem_de_ativacao: "Convite para acesso exclusivo ou degustação em primeira mão da solução desenhada para a cidade.",
        acao_parceria: `Propor uma ação piloto de relacionamento ou co-branding no circuito de ${multiplier.bairro}, oferecendo uma condição especial para sua rede de contatos.`,
        risco_da_ativacao: "Tornar a parceria meramente transacional; é fundamental que a persona realmente experimente e aprove a entrega."
      },
      alerta_ponto_cego: {
        nome_persona: shadow.nome_completo,
        armadilha_local: "A tradicional desconfiança joseense com novidades apressadas ou marcas que ignoram as particularidades culturais dos bairros e o tráfego viário.",
        sinal_de_alerta: "Muitos cliques ou visualizações no canal digital, mas baixa conversão em visitas e fechamentos reais.",
        acao_blindagem: "Reforçar a presença de ancoragem física em SJC, destacar garantias claras e respeitar o ritmo de maturação de confiança da praça.",
        o_que_nao_fazer: "Usar tom arrogante de fora da cidade ou impor atendimento 100% automatizado sem opção de suporte humano caloroso."
      },
      plano_de_ataque_sjc: [
        {
          prioridade: 1,
          acao: "Lançamento da mensagem de conquista com foco na dor de " + primary.nome_completo,
          publico: primary.nome_completo + " e moradores de perfil similar em " + primary.bairro,
          canal_ou_territorio: canalNomes[answers.q4_canal] || "Canal Prioritário",
          mensagem_ou_oferta: "Condição inaugural com atendimento personalizado e validação assistida",
          objetivo: "Conquistar os primeiros clientes promotores orgânicos",
          indicador_inicial: "Taxa de resposta e conversão no primeiro contato"
        },
        {
          prioridade: 2,
          acao: "Ativação da Alavanca Multiplicadora através de " + multiplier.nome_completo,
          publico: "Rede profissional e comunidade de influência de " + multiplier.bairro,
          canal_ou_territorio: "Networking regional e eventos locais",
          mensagem_ou_oferta: "Apresentação da solução com foco em valor compartilhado para a comunidade",
          objetivo: "Gerar o efeito de recomendação boca a boca qualificada",
          indicador_inicial: "Novos contatos que chegam citando a indicação"
        },
        {
          prioridade: 3,
          acao: "Blindagem operacional contra o ponto cego identificado",
          publico: "Clientes em fase de consideração com perfil conservador",
          canal_ou_territorio: "Pontos de contato comerciais e suporte em SJC",
          mensagem_ou_oferta: "Garantias explícitas de entrega e atendimento consultivo direto",
          objetivo: "Eliminar a barreira de desconfiança e acelerar a decisão",
          indicador_inicial: "Redução do tempo médio entre o primeiro contato e o fechamento"
        }
      ],
      veredito_final: {
        recomendacao: "avancar",
        justificativa: "A proposta preenche uma lacuna viva de valor na cidade e possui público com poder de compra e disposição reprimida para consumir.",
        primeiro_experimento: `Rodar um teste tático de 7 dias com uma oferta piloto focada nos moradores de ${primary.bairro}, mensurando a taxa de retorno imediato.`
      }
    };
  }

  // ----------------------------------------------------
  // INICIALIZAÇÃO E MONTAGEM PRINCIPAL DA ABA RADAR DNA
  // ----------------------------------------------------
  function initRadarDnaModule() {
    const view = document.getElementById('personas-view');
    if (!view) return;

    const existingContainer = document.getElementById('oracle-view-container');
    if (existingContainer) {
      if (currentActiveTab === 'oracle') {
        renderOracleView();
      } else {
        renderDossierView();
      }
      updateSidebarDiagnosis();
      return;
    }

    let style = document.getElementById('personas-module-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'personas-module-styles';
      document.head.appendChild(style);
    }

    style.innerHTML = `
      /* ESTILOS DA MASCOTE CAPIVARA ORÁCULO — PALCO COM FLUTUAÇÃO */
      .capivara-mascot-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0;
      }

      .capivara-mascot-img {
        display: block;
        width: 100%;
        max-width: 100%;
        height: auto;
        object-fit: contain;
        object-position: center bottom;
        cursor: pointer;
        filter: drop-shadow(0 14px 22px rgba(131, 24, 67, 0.22));
        animation: capivaraFloat 3s ease-in-out infinite !important;
        will-change: transform, filter;
        transition: opacity 0.2s ease, filter 0.3s ease;
      }

      .capivara-mascot-img:hover {
        filter: drop-shadow(0 20px 28px rgba(219, 39, 119, 0.40));
      }

      .capivara-mascot-img.is-changing {
        opacity: 0.25;
        transform: translateY(4px) scale(0.98);
      }

      @keyframes kapyHeadFloat {
        0%, 100% {
          transform: translateY(0px) rotate(-1deg);
        }
        50% {
          transform: translateY(-8px) rotate(1.5deg);
        }
      }

      @keyframes capivaraFloat {
        0%, 100% {
          transform: translateY(0px) rotate(-0.6deg);
          filter: drop-shadow(0 14px 20px rgba(131, 24, 67, 0.20));
        }
        50% {
          transform: translateY(-16px) rotate(0.8deg);
          filter: drop-shadow(0 24px 30px rgba(219, 39, 119, 0.35));
        }
      }

      @keyframes capivaraThinkFloat {
        0%, 100% {
          transform: translateY(0px) rotate(-1deg);
          filter: drop-shadow(0 14px 20px rgba(147, 51, 234, 0.22));
        }
        40% {
          transform: translateY(-12px) rotate(1.2deg);
          filter: drop-shadow(0 22px 26px rgba(147, 51, 234, 0.38));
        }
        70% {
          transform: translateY(-5px) rotate(-0.6deg);
        }
      }

      @keyframes capivaraSurpriseFloat {
        0%, 100% {
          transform: translateY(0px) scale(1) rotate(0deg);
        }
        40% {
          transform: translateY(-18px) scale(1.03) rotate(-1.5deg);
          filter: drop-shadow(0 26px 32px rgba(236, 72, 153, 0.42));
        }
        70% {
          transform: translateY(-8px) scale(1.01) rotate(1deg);
        }
      }

      @keyframes capivaraCelebrateFloat {
        0%, 100% {
          transform: translateY(0px) scale(1) rotate(-1deg);
          filter: drop-shadow(0 14px 20px rgba(234, 179, 8, 0.35));
        }
        50% {
          transform: translateY(-20px) scale(1.04) rotate(1.5deg);
          filter: drop-shadow(0 28px 36px rgba(234, 179, 8, 0.60));
        }
      }

      .capivara-anim-welcome { animation: capivaraFloat 3s ease-in-out infinite !important; }
      .capivara-anim-curious { animation: capivaraFloat 3s ease-in-out infinite !important; }
      .capivara-anim-thinking { animation: capivaraThinkFloat 2.8s ease-in-out infinite !important; }
      .capivara-anim-surprised { animation: capivaraSurpriseFloat 2s ease-in-out infinite !important; }
      .capivara-anim-celebration { animation: capivaraCelebrateFloat 1.4s ease-in-out infinite !important; }

      @keyframes optionCardStaggerIn {
        0% {
          opacity: 0;
          transform: translateY(18px) scale(0.96);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .oracle-option-card {
        animation: optionCardStaggerIn 0.45s cubic-bezier(0.25, 1, 0.5, 1) both;
      }

      .oracle-card-delay-1 { animation-delay: 0.08s; }
      .oracle-card-delay-2 { animation-delay: 0.18s; }
      .oracle-card-delay-3 { animation-delay: 0.28s; }
      .oracle-card-delay-4 { animation-delay: 0.38s; }

      /* ESTILOS PREMIUM COLEÇÃO POKÉMON TCG - ORÁCULO RDR */
      .pokemon-card {
        width: 100%;
        min-height: auto;
        position: relative;
        border-radius: 22px;
        padding: 16px;
        box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.08);
        transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 12px;
        box-sizing: border-box;
      }
      .pokemon-card:hover {
        transform: translateY(-6px) scale(1.015);
        box-shadow: 0 22px 40px -10px rgba(0, 0, 0, 0.22), 0 0 25px rgba(255, 255, 255, 0.7);
      }

      .card-bg-verde {
        background: linear-gradient(150deg, #f0fdf4 0%, #dcfce7 45%, #bbf7d0 100%);
        border: 3px solid #16a34a;
      }
      .card-bg-roxo {
        background: linear-gradient(150deg, #faf5ff 0%, #f3e8ff 45%, #e9d5ff 100%);
        border: 3px solid #9333ea;
      }
      .card-bg-azul {
        background: linear-gradient(150deg, #f0f9ff 0%, #e0f2fe 45%, #bae6fd 100%);
        border: 3px solid #0284c7;
      }
      .card-bg-dourado {
        background: linear-gradient(150deg, #fffbeb 0%, #fef3c7 45%, #fde68a 100%);
        border: 3px solid #d97706;
      }

      .pokemon-art-window {
        position: relative;
        width: 100%;
        height: 190px;
        border-radius: 14px;
        overflow: hidden;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        background: #ffffff;
      }

      .pokemon-sub-bar {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(6px);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        font-size: 11px;
        font-weight: 800;
        color: #0f172a;
        padding: 6px 10px;
        text-align: center;
        margin-top: 6px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
        line-height: 1.35;
      }

      .pokemon-attacks-box {
        background: #ffffff;
        border-radius: 14px;
        padding: 10px 12px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .pokemon-footer-box {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(6px);
        border-radius: 14px;
        padding: 10px 12px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      }

      .pokemon-flavor-text {
        font-size: 11px;
        font-style: italic;
        color: #1e293b;
        line-height: 1.45;
        margin-bottom: 6px;
      }

      /* -------------------------------------------------------------
         FLIP 3D DA CARTA NO ORÁCULO COM VERSO VERMELHO & FRENTE DOSSIÊ
      ------------------------------------------------------------- */
      .oracle-flip-card-wrapper {
        perspective: 1400px;
        width: 100%;
        max-width: 375px;
        margin: 0 auto;
        cursor: pointer;
      }

      .oracle-flip-card-inner {
        position: relative;
        width: 100%;
        transform-style: preserve-3d;
        transition: transform 0.9s cubic-bezier(0.34, 1.25, 0.64, 1);
        transform: rotateY(0deg);
      }

      .oracle-flip-card-wrapper.is-revealed .oracle-flip-card-inner {
        transform: rotateY(180deg);
      }

      .oracle-flip-card-front {
        width: 100%;
        transform: rotateY(180deg);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .oracle-flip-card-back {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        transform: rotateY(0deg);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.35);
        border: 3px solid #831843;
        background: #500724;
        z-index: 2;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .oracle-flip-card-wrapper:hover .oracle-flip-card-back {
        box-shadow: 0 22px 42px -6px rgba(219, 39, 119, 0.45);
      }

      .oracle-flip-card-back img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* -------------------------------------------------------------
         COREOGRAFIA 3D REAL DAS CARTAS — CORTE, CASCATA RIFFLE, LAVAGEM E LEQUE
      ------------------------------------------------------------- */
      .table-3d-stage {
        perspective: 1400px;
        perspective-origin: 50% 50%;
        transform-style: preserve-3d;
      }

      .choreography-card {
        position: absolute;
        width: 88px;
        height: 138px;
        border-radius: 12px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border: 1.5px solid rgba(255, 255, 255, 0.95);
        pointer-events: none;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
        transition: box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      }

      .card-texture-sheen {
        position: absolute;
        inset: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%, rgba(0,0,0,0.25) 100%);
        pointer-events: none;
      }

      /* 1 & 2. CORTE (CUT / SPLIT): Separação Suave das Pilhas */
      @keyframes cutPileLeft {
        0% { transform: translate3d(0, 0, 0) rotate(0deg); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
        100% { transform: translate3d(-105px, -15px, 30px) rotate(-16deg); box-shadow: 0 20px 30px rgba(0,0,0,0.4); }
      }

      @keyframes cutPileRight {
        0% { transform: translate3d(0, 0, 0) rotate(0deg); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
        100% { transform: translate3d(105px, -15px, 45px) rotate(16deg); box-shadow: 0 24px 35px rgba(0,0,0,0.45); }
      }

      /* 3. RIFFLE & CASCATA: Desfolhamento Rápido Alternado */
      @keyframes riffleCardLeft {
        0% { transform: translate3d(-100px, -20px, 40px) rotate(-16deg) scale(1.04); opacity: 0; box-shadow: 0 20px 30px rgba(0,0,0,0.35); }
        30% { opacity: 1; transform: translate3d(-40px, -45px, 60px) rotate(-8deg) scale(1.08); box-shadow: 0 30px 45px rgba(0,0,0,0.45); }
        75% { transform: translate3d(0px, -4px, 15px) rotate(1.5deg) scale(0.99); box-shadow: 0 10px 18px rgba(0,0,0,0.3); }
        100% { transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1); opacity: 1; box-shadow: 0 4px 8px rgba(0,0,0,0.25); }
      }

      @keyframes riffleCardRight {
        0% { transform: translate3d(100px, -20px, 40px) rotate(16deg) scale(1.04); opacity: 0; box-shadow: 0 20px 30px rgba(0,0,0,0.35); }
        30% { opacity: 1; transform: translate3d(40px, -45px, 60px) rotate(8deg) scale(1.08); box-shadow: 0 30px 45px rgba(0,0,0,0.45); }
        75% { transform: translate3d(0px, -4px, 15px) rotate(-1.5deg) scale(0.99); box-shadow: 0 10px 18px rgba(0,0,0,0.3); }
        100% { transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1); opacity: 1; box-shadow: 0 4px 8px rgba(0,0,0,0.25); }
      }

      /* 4A. LAVAGEM CIRCULAR NA MESA (WASH) */
      @keyframes tableWashOrbit1 {
        0% { transform: translate3d(0, 0, 0) rotate(0deg); }
        25% { transform: translate3d(-90px, -35px, 10px) rotate(-35deg); }
        50% { transform: translate3d(80px, 30px, 15px) rotate(45deg); }
        75% { transform: translate3d(-60px, 35px, 8px) rotate(-20deg); }
        100% { transform: translate3d(0, 0, 0) rotate(0deg); }
      }

      @keyframes tableWashOrbit2 {
        0% { transform: translate3d(0, 0, 0) rotate(0deg); }
        25% { transform: translate3d(95px, 25px, 12px) rotate(40deg); }
        50% { transform: translate3d(-75px, -30px, 18px) rotate(-40deg); }
        75% { transform: translate3d(60px, -25px, 6px) rotate(25deg); }
        100% { transform: translate3d(0, 0, 0) rotate(0deg); }
      }

      /* 4B. ABERTURA EM LEQUE PERFEITO (FAN DEPLOY) */
      @keyframes fanDeploy {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(0.9); opacity: 0.7; }
        100% { transform: var(--fan-transform); opacity: 1; box-shadow: 0 12px 20px rgba(0,0,0,0.35); }
      }

      .anim-cut-left { animation: cutPileLeft 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
      .anim-cut-right { animation: cutPileRight 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
      .anim-fan-leaf { animation: fanDeploy 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

      @keyframes dealToSlot1 {
        0% { transform: translate3d(-240px, -140px, 100px) rotate(-35deg) scale(0.4); opacity: 0; }
        65% { transform: translate3d(15px, -10px, 30px) rotate(8deg) scale(1.05); opacity: 1; }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 1; }
      }
      @keyframes dealToSlot2 {
        0% { transform: translate3d(0px, -190px, 120px) rotate(-20deg) scale(0.4); opacity: 0; }
        65% { transform: translate3d(0px, -10px, 30px) rotate(-4deg) scale(1.05); opacity: 1; }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 1; }
      }
      @keyframes dealToSlot3 {
        0% { transform: translate3d(240px, -140px, 100px) rotate(35deg) scale(0.4); opacity: 0; }
        65% { transform: translate3d(-15px, -10px, 30px) rotate(-8deg) scale(1.05); opacity: 1; }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 1; }
      }

      .anim-deal-1 { animation: dealToSlot1 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      .anim-deal-2 { animation: dealToSlot2 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards; }
      .anim-deal-3 { animation: dealToSlot3 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards; }
    `;

    view.innerHTML = `
      <!-- Header Padronizado do Oráculo RDR -->
      <header class="w-full !mt-0 relative overflow-hidden bg-[#500724] backdrop-blur-md border-b border-pink-900/40 text-white shadow-xs min-h-[175px] md:min-h-[200px] py-6 sm:py-7 flex items-center px-4 sm:px-6 lg:px-8">
        <div class="absolute inset-0 z-0 opacity-15 bg-cover bg-center mix-blend-luminosity" style="background-image: url('fotos_radar/photo_1.jpg');"></div>
        <div class="absolute inset-0 z-0 bg-gradient-to-r from-[#500724] via-[#831843] to-[#500724]"></div>
        
        <div class="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 h-full">
          <div class="flex items-center gap-7 sm:gap-8">
            <img src="fotos_radar/radar_logo_pure_white.png" alt="Radar São José" class="h-11 sm:h-12 object-contain shrink-0 drop-shadow-sm" />
            
            <div class="space-y-1.5">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-pink-500/25 text-pink-200 border border-pink-400/40">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> ORÁCULO RDR
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/10">
                  60 Personas de SJC • 20 Dados Auditados
                </span>
              </div>
              
              <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Oráculo RDR <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-100">• Inteligência & Personas SJC</span>
              </h1>
              
              <p class="text-xs sm:text-sm text-pink-100/90 font-medium max-w-2xl leading-relaxed">
                Mapeamento qualitativo e quantitativo. Cruzamento entre bairros, movimentos culturais, mídias locais e dores da população joseense.
              </p>
            </div>
          </div>

          <!-- Seletor de Modo -->
          <div class="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md self-start lg:self-center shrink-0">
            <button type="button" 
              id="tab-btn-oracle" 
              onclick="window.switchRadarDnaTab('oracle')"
              class="px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer bg-white text-pink-950 shadow-md transform scale-[1.02]"
            >
              <i class="fa-solid fa-wand-magic-sparkles text-pink-600"></i>
              <span>Oráculo & Leitura</span>
            </button>
            <button type="button" 
              id="tab-btn-dossier" 
              onclick="window.switchRadarDnaTab('dossier')"
              class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10"
            >
              <i class="fa-solid fa-address-book"></i>
              <span>Dossiê Completo (60)</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Conteúdo das Abas -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="oracle-view-container"></div>
        <div id="dossier-view-container" class="hidden"></div>
      </div>
    `;

    renderOracleView();
  }

  function switchRadarDnaTab(tab) {
    currentActiveTab = tab;
    const oracleContainer = document.getElementById('oracle-view-container');
    const dossierContainer = document.getElementById('dossier-view-container');
    const btnOracle = document.getElementById('tab-btn-oracle');
    const btnDossier = document.getElementById('tab-btn-dossier');

    if (tab === 'oracle') {
      if (oracleContainer) oracleContainer.classList.remove('hidden');
      if (dossierContainer) dossierContainer.classList.add('hidden');
      
      if (btnOracle) {
        btnOracle.className = 'px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer bg-white text-pink-950 shadow-md transform scale-[1.02]';
      }
      if (btnDossier) {
        btnDossier.className = 'px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10';
      }
      renderOracleView();
    } else {
      if (oracleContainer) oracleContainer.classList.add('hidden');
      if (dossierContainer) dossierContainer.classList.remove('hidden');

      if (btnOracle) {
        btnOracle.className = 'px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10';
      }
      if (btnDossier) {
        btnDossier.className = 'px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer bg-white text-pink-950 shadow-md transform scale-[1.02]';
      }
      renderDossierView();
    }
  }

      function renderOracleWelcomeScreen() {
    return `
      <div class="space-y-6 animate-in fade-in duration-400">
        
        <!-- Grid Principal da Tela Inicial -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <!-- LADO ESQUERDO: METODOLOGIA & PESQUISA RADAR 2026 (7 Colunas) -->
          <div class="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            
            <div class="space-y-4">
              <!-- Selos de Inteligência -->
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-800 border border-pink-200">
                  <i class="fa-solid fa-sparkles text-pink-600"></i> Metodologia Radar São José 2026
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <i class="fa-solid fa-database text-slate-500"></i> Big Data + Pesquisa Primária
                </span>
              </div>

              <!-- Título & Subtítulo -->
              <div class="space-y-2">
                <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Como nascem as 60 Personas de São José dos Campos?
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed font-medium">
                  Não são arquétipos genéricos. As 60 personas representam uma síntese viva e fidedigna da população joseense, desenvolvida a partir de um cruzamento rigoroso de inteligência de mercado:
                </p>
              </div>

              <!-- 3 Pilares Metodológicos -->
              <div class="grid grid-cols-1 gap-3.5 pt-1">
                
                <!-- Pilar 1: Pesquisa Radar 2026 -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-pink-300 transition-all flex items-start gap-3.5">
                  <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center shrink-0 text-base">
                    <i class="fa-solid fa-clipboard-check"></i>
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-black text-slate-900">1. Pesquisa Radar São José 2026</h4>
                    <p class="text-[12px] text-slate-600 leading-snug">
                      Entrevistas e questionários de campo cobrindo todas as macro-regiões de SJC, mapeando dores reais de consumo, mobilidade, renda e prioridades familiares.
                    </p>
                  </div>
                </div>

                <!-- Pilar 2: Big Data Municipal & Mídia Local -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all flex items-start gap-3.5">
                  <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 text-base">
                    <i class="fa-solid fa-chart-network"></i>
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-black text-slate-900">2. Big Data da Plataforma & Mídia Local</h4>
                    <p class="text-[12px] text-slate-600 leading-snug">
                      Dados demográficos do IBGE cruzados com mais de 7.500 postagens e reportagens monitoradas na imprensa regional (Rede Vanguarda, O Vale, CBN Vale e portais de bairro).
                    </p>
                  </div>
                </div>

                <!-- Pilar 3: 4 Movimentos Socioculturais -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex items-start gap-3.5">
                  <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0 text-base">
                    <i class="fa-solid fa-compass-drafting"></i>
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-black text-slate-900">3. Quatro Movimentos Socioculturais</h4>
                    <p class="text-[12px] text-slate-600 leading-snug">
                      Classificação psicográfica dos estilos de vida da cidade: <em>A Tribo Global</em>, <em>A Cidade Prometida</em>, <em>Geografia da Inércia</em> e <em>Empreendedorismo Intuitivo</em>.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <!-- Rodapé Metodológico -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span class="flex items-center gap-1.5"><i class="fa-solid fa-shield-check text-emerald-600"></i> 60 Personas com 20 Requisitos Auditados</span>
              <span class="text-slate-400">Radar SJC Analytics</span>
            </div>

          </div>

          <!-- LADO DIREITO: CALL TO ACTION - JOGAR ORÁCULO (Card Branco com Rostinho Flutuante da Kapy) -->
          <div class="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            
            <div class="space-y-5">
              
              <!-- Topo: Selo + Rostinho da Kapy Flutuando Sorrindo -->
              <div class="flex items-center justify-between gap-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-xs font-black text-pink-700">
                  <i class="fa-solid fa-wand-magic-sparkles text-pink-500"></i> Experiência Interativa
                </span>

                <!-- Rostinho da Kapy Flutuando e Sorrindo -->
                <div class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  <div class="absolute inset-0 bg-pink-100 rounded-full blur-xs opacity-60"></div>
                  <img 
                    src="data_personas/capivara/kapy_avatar_smile.png" 
                    alt="Rostinho da Kapy Sorrindo" 
                    class="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-20 drop-shadow-md cursor-pointer transition-transform hover:scale-110 pointer-events-auto"
                    style="animation: kapyHeadFloat 3.2s ease-in-out infinite; pointer-events: auto;"
                    title="Olá! Sou a Kapy, assessora de inteligência!"
                    onclick="window.startOracleGame(event)"
                  />
                </div>
              </div>

              <!-- Chamada Principal -->
              <div class="space-y-2">
                <h4 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Toda ideia deixa pistas.<br />
                  <span class="text-pink-600">A Kapy sabe onde procurar.</span>
                </h4>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Conte para a Kapy o que você quer criar, vender ou transformar. Em cinco perguntas, ela vai cruzar sua ideia com os sinais de comportamento de São José e mostrar quais pessoas importam para o seu próximo passo.
                </p>
              </div>

              <!-- Resultado: Três Respostas Estratégicas -->
              <div class="space-y-2.5 pt-1">
                <span class="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Você recebe três respostas:
                </span>
                <div class="flex items-center gap-2.5 text-xs text-slate-800 font-bold">
                  <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                  <span>Quem pode comprar;</span>
                </div>
                <div class="flex items-center gap-2.5 text-xs text-slate-800 font-bold">
                  <i class="fa-solid fa-circle-check text-purple-600 text-sm"></i>
                  <span>Quem pode indicar;</span>
                </div>
                <div class="flex items-center gap-2.5 text-xs text-slate-800 font-bold">
                  <i class="fa-solid fa-circle-check text-amber-600 text-sm"></i>
                  <span>O que você ainda não percebeu.</span>
                </div>
              </div>

            </div>

            <!-- Botões de Ação no Rodapé -->
            <div class="pt-6 space-y-3 relative z-20 pointer-events-auto">
              <button 
                type="button"
                id="btn-start-oracle-reading"
                onclick="window.startOracleGame(event)" 
                style="position: relative; z-index: 20; pointer-events: auto;"
                class="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-xl shadow-pink-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer select-none"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-base"></i>
                <span>DEIXAR A KAPY LER MINHA IDEIA</span>
              </button>

              <div class="text-center space-y-1 pt-1">
                <p class="text-[11px] text-slate-600 font-bold">
                  Uma leitura rápida, local e estratégica. Sem respostas genéricas.
                </p>
                <p class="text-[10px] text-slate-400 font-medium">
                  Pesquisa local, 60 personas e inteligência comportamental aplicada ao seu negócio.
                </p>
              </div>

              <button 
                type="button"
                onclick="window.switchToDossierTab(event)" 
                style="position: relative; z-index: 20; pointer-events: auto;"
                class="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <i class="fa-solid fa-cards-blank text-slate-500"></i>
                <span>Quero Explorar o Baralho Completo (60 Personas)</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    `;
  }

  function renderOracleView() {
    const container = document.getElementById('oracle-view-container');
    if (!container) return;

    updateSidebarDiagnosis();

    // Se estiver na tela de boas-vindas metodológica
    if (oracleScreenState === 'welcome') {
      container.innerHTML = renderOracleWelcomeScreen();
      return;
    }

    // Se estiver na fase de resultados revelados com cartas
    if (readingPhase === 'revealed' && oracleResultCards) {
      container.innerHTML = renderRevealedResultsHtml(oracleResultCards);
      setTimeout(initOracleCardFlipObserver, 120);
      return;
    }

    // Modo Jogo: Palco da Kapy (Lado Esquerdo, Transparente, sem card de fundo) + Mesa de Perguntas (Lado Direito)
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start animate-in fade-in duration-300">
        
        <!-- PALCO DA KAPY (Lado Esquerdo - 4 Colunas, Sem fundo, Flutuante) -->
        <div class="lg:col-span-4 flex flex-col items-center text-center relative pt-1 pb-2">
          
          <!-- Selo Superior com Identidade da Kapy -->
          <div class="w-full flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/80">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-pink-100 text-pink-800 border border-pink-200">
              <i class="fa-solid fa-wand-magic-sparkles text-pink-600"></i> Kapy • Assessora
            </span>
            <span class="text-xs font-black text-purple-900 bg-purple-100/80 px-2.5 py-1 rounded-lg border border-purple-200">
              ${readingPhase === 'idle' ? `Etapa ${currentOracleStep}/5` : 'Análise Ativa'}
            </span>
          </div>

          <!-- Imagem da Kapy Flutuante (Transparente, Sem Card de Fundo, 5 Expressões Reativas) -->
          <div class="capivara-mascot-wrapper -mt-1 sm:-mt-2" onclick="window.triggerCapivaraInteraction()">
            <img 
              id="capivara-mascot-img" 
              src="${MASCOT_IMAGES[currentMascotState] || MASCOT_IMAGES.welcome}" 
              alt="Kapy • Assessora de Inteligência & Oráculo SJC" 
              class="capivara-mascot-img capivara-anim-${currentMascotState}"
              title="Clique na Kapy para ouvir um conselho estratégico de São José dos Campos!"
            />
          </div>

          <!-- Rodapé de Controle do Palco -->
          <div class="w-full pt-3 mt-1 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-bold z-10">
            <button type="button" onclick="window.returnToOracleWelcome()" class="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer text-[11px] transition-colors">
              <i class="fa-solid fa-arrow-left"></i> Voltar à Metodologia
            </button>
            <button type="button" onclick="window.triggerCapivaraInteraction()" class="text-pink-700 hover:text-pink-900 flex items-center gap-1 cursor-pointer text-[11px] transition-colors">
              <i class="fa-solid fa-lightbulb"></i> Dica da Kapy
            </button>
          </div>

        </div>

        <!-- PAINEL DE PERGUNTAS E MESA SAGRADA (Lado Direito - 8 Colunas) -->
        <div class="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between min-h-[480px]">
          ${readingPhase !== 'idle' ? renderTableAnimationPhase() : getOracleStepContent()}
        </div>

      </div>
    `;

    triggerOracleTypewriterForCurrentStep();
  }

  function triggerTypewriter(elementId, text, speed = 16) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

    function triggerOracleTypewriterForCurrentStep() {
    const texts = {
      1: "Olá! Sou a Kapy, sua assessora de inteligência. Como sua ideia, negócio ou projeto se posiciona em São José dos Campos?",
      2: "Qual é o perfil do público que você quer atrair ou engajar?",
      3: "Qual região de São José dos Campos concentra seu maior foco de atuação?",
      4: "Por qual canal você mais conversa e se conecta com as pessoas?",
      5: "Qual desafio ou objetivo você deseja que o Baralho de São José revele para você agora?"
    };

    const targetText = texts[currentOracleStep];
    if (targetText) {
      setTimeout(() => {
        triggerTypewriter('capivara-speech-text', targetText, 14);
      }, 50);
    }
  }

  function getOracleStepContent() {
    if (currentOracleStep === 1) {
      return `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="relative bg-white border-2 border-pink-300 shadow-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6">
            <div class="hidden lg:block absolute -left-3.5 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-pink-300"></div>
            <div class="hidden lg:block absolute -left-[11px] top-[33px] w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-r-[13px] border-r-white z-10"></div>
            
            <h3 class="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug min-h-[32px]">
              "<span id="capivara-speech-text"></span>"
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div onclick="window.selectOracleStepChoice('q1_proposta', 'inovacao', 2)" class="oracle-option-card oracle-card-delay-1 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q1_proposta === 'inovacao' ? 'bg-purple-50 border-purple-500 shadow-sm ring-2 ring-purple-500/20' : 'bg-white border-slate-200 hover:border-purple-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-globe"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Inovação, Cultura & Vanguarda</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Design, café especial, tecnologia e autenticidade.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q1_proposta', 'luxo', 2)" class="oracle-option-card oracle-card-delay-2 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q1_proposta === 'luxo' ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-crown"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Alto Padrão & Internacional</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Exclusividade, condomínios fechados e prestígio.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q1_proposta', 'tradicao', 2)" class="oracle-option-card oracle-card-delay-3 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q1_proposta === 'tradicao' ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-landmark"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Tradição & Confiança Familiar</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Raízes de bairro, fidelidade e palavra dada.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q1_proposta', 'agilidade', 2)" class="oracle-option-card oracle-card-delay-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q1_proposta === 'agilidade' ? 'bg-cyan-50 border-cyan-500 shadow-sm ring-2 ring-cyan-500/20' : 'bg-white border-slate-200 hover:border-cyan-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-lightbulb"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Agilidade & Vida Real dos Bairros</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Resolução prática no WhatsApp e bom preço.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (currentOracleStep === 2) {
      return `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="relative bg-white border-2 border-pink-300 shadow-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6">
            <div class="hidden lg:block absolute -left-3.5 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-pink-300"></div>
            <div class="hidden lg:block absolute -left-[11px] top-[33px] w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-r-[13px] border-r-white z-10"></div>
            
            <h3 class="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug min-h-[32px]">
              "<span id="capivara-speech-text"></span>"
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div onclick="window.selectOracleStepChoice('q2_ticket', 'alto', 3)" class="oracle-option-card oracle-card-delay-1 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q2_ticket === 'alto' ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-gem"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Alto Padrão & Exclusividade</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Público de alta renda, sofisticado, exigente e seleto.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q2_ticket', 'experiencia', 3)" class="oracle-option-card oracle-card-delay-2 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q2_ticket === 'experiencia' ? 'bg-purple-50 border-purple-500 shadow-sm ring-2 ring-purple-500/20' : 'bg-white border-slate-200 hover:border-purple-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-mug-hot"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Experiência, Cultura & Estilo</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Valoriza autenticidade, vivências, significado e comunidade.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q2_ticket', 'custo_beneficio', 3)" class="oracle-option-card oracle-card-delay-3 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q2_ticket === 'custo_beneficio' ? 'bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-scale-balanced"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Pragmático & Custo-Benefício</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Busca solidez, confiança, utilidade e clareza de resultados.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q2_ticket', 'economico', 3)" class="oracle-option-card oracle-card-delay-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q2_ticket === 'economico' ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-tags"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Popular, Prático & Acessível</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Linguagem simples, agilidade no WhatsApp e fácil acesso.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (currentOracleStep === 3) {
      return `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="relative bg-white border-2 border-pink-300 shadow-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6">
            <div class="hidden lg:block absolute -left-3.5 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-pink-300"></div>
            <div class="hidden lg:block absolute -left-[11px] top-[33px] w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-r-[13px] border-r-white z-10"></div>
            
            <h3 class="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug min-h-[32px]">
              "<span id="capivara-speech-text"></span>"
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div onclick="window.selectOracleStepChoice('q3_regiao', 'centro', 4)" class="oracle-option-card oracle-card-delay-1 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q3_regiao === 'centro' ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-city"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Região Centro</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Vila Ema, Vila Adyana, Centro Histórico, São Dimas e Apolo.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q3_regiao', 'sul', 4)" class="oracle-option-card oracle-card-delay-2 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q3_regiao === 'sul' ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-shop"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Região Sul</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Jardim Satélite, Floradas, Bosque dos Eucaliptos e Parque Industrial.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q3_regiao', 'leste', 4)" class="oracle-option-card oracle-card-delay-3 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q3_regiao === 'leste' ? 'bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-industry"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Região Leste</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Vista Verde, Eugênio de Melo, Galo Branco e Novo Horizonte.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q3_regiao', 'oeste', 4)" class="oracle-option-card oracle-card-delay-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q3_regiao === 'oeste' ? 'bg-pink-50 border-pink-500 shadow-sm ring-2 ring-pink-500/20' : 'bg-white border-slate-200 hover:border-pink-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-tree-city"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Região Oeste</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Jardim Aquarius, Urbanova, Jardim das Colinas e Esplanada.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q3_regiao', 'norte', 4)" class="oracle-option-card oracle-card-delay-5 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q3_regiao === 'norte' ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20' : 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-mountain-sun"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Região Norte</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Santana, Altos de Santana, Alto da Ponte e Buquirinha.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q3_regiao', 'sudeste', 4)" class="oracle-option-card oracle-card-delay-6 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q3_regiao === 'sudeste' ? 'bg-violet-50 border-violet-500 shadow-sm ring-2 ring-violet-500/20' : 'bg-white border-slate-200 hover:border-violet-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 border border-violet-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-plane-departure"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Região Sudeste</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Região do Putim, São Judas Tadeu, Flamboyant e Chácaras Reunidas.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (currentOracleStep === 4) {
      return `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="relative bg-white border-2 border-pink-300 shadow-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6">
            <div class="hidden lg:block absolute -left-3.5 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-pink-300"></div>
            <div class="hidden lg:block absolute -left-[11px] top-[33px] w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-r-[13px] border-r-white z-10"></div>
            
            <h3 class="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug min-h-[32px]">
              "<span id="capivara-speech-text"></span>"
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div onclick="window.selectOracleStepChoice('q4_canal', 'instagram', 5)" class="oracle-option-card oracle-card-delay-1 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q4_canal === 'instagram' ? 'bg-pink-50 border-pink-500 shadow-sm ring-2 ring-pink-500/20' : 'bg-white border-slate-200 hover:border-pink-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-brands fa-instagram"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Instagram & Reels Autoral</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Estética visual, bastidores e influenciadores de SJC.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q4_canal', 'whatsapp', 5)" class="oracle-option-card oracle-card-delay-2 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q4_canal === 'whatsapp' ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-brands fa-whatsapp"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">WhatsApp & Contato Direto</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Atendimento ágil, catálogo prático e tirar dúvidas na hora.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q4_canal', 'google', 5)" class="oracle-option-card oracle-card-delay-3 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q4_canal === 'google' ? 'bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-magnifying-glass"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Google, Tráfego Pago & SEO</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Busca no Google Maps, anúncios locais e avaliações.</p>
              </div>
            </div>

            <div onclick="window.selectOracleStepChoice('q4_canal', 'eventos', 5)" class="oracle-option-card oracle-card-delay-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] flex items-start gap-3.5 ${oracleAnswers.q4_canal === 'eventos' ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'}">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 text-lg"><i class="fa-solid fa-users"></i></div>
              <div class="space-y-0.5 min-w-0">
                <h4 class="text-xs font-black text-slate-900">Boca a Boca, Parcerias & Eventos</h4>
                <p class="text-[11px] text-slate-600 leading-snug">Networking local, feiras, Vicentina Aranha e indicação.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (currentOracleStep === 5) {
      return `
        <div class="space-y-4 animate-in fade-in duration-300">
          <div class="relative bg-white border-2 border-pink-300 shadow-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6">
            <div class="hidden lg:block absolute -left-3.5 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-pink-300"></div>
            <div class="hidden lg:block absolute -left-[11px] top-[33px] w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-r-[13px] border-r-white z-10"></div>
            
            <h3 class="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug min-h-[32px]">
              "<span id="capivara-speech-text"></span>"
            </h3>
          </div>

          <div class="space-y-3">
            <textarea
              id="oracle-open-textarea"
              rows="3"
              placeholder="Ex: Quero abrir uma cafeteria autoral no Aquarius, lançar um aplicativo de saúde para famílias na Zona Sul, ou promover um projeto cultural em Santana..."
              oninput="window.updateOracleOpenText(this.value)"
              class="w-full p-4 text-xs sm:text-sm bg-slate-50 border-2 border-slate-200 rounded-2xl font-medium text-slate-900 focus:outline-hidden focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all resize-none shadow-inner"
            >${oracleAnswers.q5_texto_livre || ''}</textarea>

            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Sugestões Rápidas:</span>
              <button type="button" onclick="window.setOracleQuickPrompt('Como posicionar um serviço de alto padrão e ganhar a confiança do público mais exigente de SJC?')" class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-100 text-slate-700 hover:text-pink-800 transition-colors cursor-pointer border border-slate-200">
                ⭐ Alto Padrão & Confiança
              </button>
              <button type="button" onclick="window.setOracleQuickPrompt('Qual a melhor abordagem comercial no WhatsApp para converter rápido nos bairros de SJC?')" class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer border border-slate-200">
                💬 Vendas no WhatsApp & Bairros
              </button>
              <button type="button" onclick="window.setOracleQuickPrompt('Como expandir um negócio local pelas redes sociais com apoio de influenciadores da cidade?')" class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 transition-colors cursor-pointer border border-slate-200">
                📱 Redes Sociais & Influenciadores
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button type="button" onclick="window.setOracleStep(4)" class="px-5 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer">
              ← Voltar
            </button>
            <button type="button" onclick="window.startAuthenticTarotReadingSequence()" class="px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 cursor-pointer">
              <i class="fa-solid fa-wand-magic-sparkles text-base"></i>
              <span>CONSULTAR O ORÁCULO DE SJC</span>
            </button>
          </div>
        </div>
      `;
    }

    return '';
  }

  let choreoSubPhase = 'cut_and_riffle'; // 'cut_and_riffle', 'wash', 'fan'

  function renderTableAnimationPhase() {
    const bgImg = 'fotos_radar/card_back_red.png';

    return `
      <div class="w-full flex flex-col items-center justify-center min-h-[460px] text-center space-y-6 py-6">
        
        <!-- PALCO 3D DA COREOGRAFIA DE EMBARALHAMENTO REAL -->
        <div class="table-3d-stage relative w-full h-64 flex items-center justify-center overflow-visible">
          
          ${readingPhase === 'shuffling' ? `
            
            <!-- ESTÁGIO 1: CORTE & CASCATA RIFFLE -->
            ${choreoSubPhase === 'cut_and_riffle' ? `
              <div class="relative w-full max-w-md h-56 flex items-center justify-center">
                
                <!-- Pilha Esquerda (Corte) -->
                <div class="absolute left-6 sm:left-12 w-24 h-36 rounded-xl anim-cut-left flex items-center justify-center" style="transform-style: preserve-3d;">
                  ${Array.from({ length: 8 }).map((_, i) => `
                    <div class="choreography-card" style="transform: translate3d(${-i*0.5}px, ${-i*0.6}px, ${i*1.6}px); background-image: url('${bgImg}');">
                      <div class="card-texture-sheen"></div>
                    </div>
                  `).join('')}
                </div>

                <!-- Cascata Riffle Alternada no Centro -->
                <div class="relative w-28 h-44 flex items-center justify-center">
                  ${Array.from({ length: 14 }).map((_, i) => {
                    const isLeft = i % 2 === 0;
                    const animName = isLeft ? 'riffleCardLeft' : 'riffleCardRight';
                    const delay = (i * 0.07).toFixed(2);
                    return `
                      <div class="choreography-card" style="animation: ${animName} 1.1s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s infinite; background-image: url('${bgImg}');">
                        <div class="card-texture-sheen"></div>
                      </div>
                    `;
                  }).join('')}
                  <div class="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-600 animate-ping"></div>
                </div>

                <!-- Pilha Direita (Corte) -->
                <div class="absolute right-6 sm:right-12 w-24 h-36 rounded-xl anim-cut-right flex items-center justify-center" style="transform-style: preserve-3d;">
                  ${Array.from({ length: 8 }).map((_, i) => `
                    <div class="choreography-card" style="transform: translate3d(${i*0.5}px, ${-i*0.6}px, ${i*1.6}px); background-image: url('${bgImg}');">
                      <div class="card-texture-sheen"></div>
                    </div>
                  `).join('')}
                </div>

              </div>
            ` : ''}

            <!-- ESTÁGIO 2: LAVAGEM CIRCULAR NA MESA (WASH) -->
            ${choreoSubPhase === 'wash' ? `
              <div class="relative w-full max-w-md h-56 flex items-center justify-center">
                ${Array.from({ length: 16 }).map((_, i) => {
                  const anim = i % 2 === 0 ? 'tableWashOrbit1' : 'tableWashOrbit2';
                  const delay = (i * 0.06).toFixed(2);
                  const initRot = ((i * 22) - 160).toFixed(0);
                  return `
                    <div class="choreography-card" style="animation: ${anim} 1.2s ease-in-out ${delay}s infinite; transform: rotate(${initRot}deg); background-image: url('${bgImg}');">
                      <div class="card-texture-sheen"></div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}

            <!-- ESTÁGIO 3: ABERTURA EM LEQUE PERFEITO (FAN SPREAD) -->
            ${choreoSubPhase === 'fan' ? `
              <div class="relative w-full max-w-lg h-56 flex items-end justify-center pb-6">
                ${Array.from({ length: 21 }).map((_, i) => {
                  const total = 21;
                  const normalized = (i - (total - 1) / 2) / ((total - 1) / 2); // -1.0 a +1.0
                  const angle = (normalized * 46).toFixed(1);
                  const tx = (normalized * 140).toFixed(1);
                  const ty = (Math.abs(normalized) * 20).toFixed(1);
                  const tz = (i * 1.6).toFixed(1);
                  const delay = (i * 0.03).toFixed(2);
                  return `
                    <div 
                      class="choreography-card anim-fan-leaf" 
                      style="--fan-transform: translate3d(${tx}px, ${ty}px, ${tz}px) rotate(${angle}deg); animation-delay: ${delay}s; background-image: url('${bgImg}'); transform-origin: 50% 120%;"
                    >
                      <div class="card-texture-sheen"></div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}

          ` : `
            <!-- ESTÁGIO 4: SACANDO AS 3 CARTAS EM 3D PARA OS ALTARES -->
            <div class="grid grid-cols-3 gap-3 sm:gap-5 w-full max-w-md">
              
              <!-- SLOT I: PERSONA CENTRAL -->
              <div class="relative w-24 sm:w-28 h-36 sm:h-44 rounded-2xl anim-deal-1 shadow-xl flex flex-col items-center justify-between p-2.5 text-white border-2 border-emerald-400 bg-cover bg-center overflow-hidden" style="background-image: url('${bgImg}');">
                <div class="card-texture-sheen"></div>
                <span class="relative z-10 text-[9px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-emerald-300 border border-emerald-400/40">SLOT I</span>
                <i class="relative z-10 fa-solid fa-crown text-2xl text-emerald-300 drop-shadow-md animate-pulse"></i>
                <span class="relative z-10 text-[8px] font-extrabold bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-white border border-white/20">Persona Central</span>
              </div>

              <!-- SLOT II: ALAVANCA MULTIPLICADORA -->
              <div class="relative w-24 sm:w-28 h-36 sm:h-44 rounded-2xl anim-deal-2 shadow-xl flex flex-col items-center justify-between p-2.5 text-white border-2 border-purple-400 bg-cover bg-center overflow-hidden" style="background-image: url('${bgImg}');">
                <div class="card-texture-sheen"></div>
                <span class="relative z-10 text-[9px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-purple-300 border border-purple-400/40">SLOT II</span>
                <i class="relative z-10 fa-solid fa-bolt text-2xl text-purple-300 drop-shadow-md animate-pulse"></i>
                <span class="relative z-10 text-[8px] font-extrabold bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-white border border-white/20">Alavanca</span>
              </div>

              <!-- SLOT III: PONTO CEGO -->
              <div class="relative w-24 sm:w-28 h-36 sm:h-44 rounded-2xl anim-deal-3 shadow-xl flex flex-col items-center justify-between p-2.5 text-white border-2 border-amber-400 bg-cover bg-center overflow-hidden" style="background-image: url('${bgImg}');">
                <div class="card-texture-sheen"></div>
                <span class="relative z-10 text-[9px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-amber-300 border border-amber-400/40">SLOT III</span>
                <i class="relative z-10 fa-solid fa-triangle-exclamation text-2xl text-amber-300 drop-shadow-md animate-pulse"></i>
                <span class="relative z-10 text-[8px] font-extrabold bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-white border border-white/20">Ponto Cego</span>
              </div>

            </div>
          `}

        </div>

        <!-- Mensagem de Progresso e Inteligência -->
        <div class="space-y-2 max-w-md">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-900 text-xs font-black border border-pink-200 shadow-2xs">
            <i class="fa-solid fa-wand-magic-sparkles text-pink-600 animate-spin"></i>
            <span>${analysisProgressText}</span>
          </div>
          <p class="text-xs text-slate-500 font-semibold">
            Cruzando os 477 respondentes, bairros e os 4 movimentos de São José dos Campos...
          </p>
        </div>

        <!-- Barra de Progresso Fluida -->
        <div class="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div class="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full transition-all duration-500 w-4/5 animate-pulse"></div>
        </div>

      </div>
    `;
  }

  async function startAuthenticTarotReadingSequence() {
    readingPhase = 'shuffling';
    choreoSubPhase = 'cut_and_riffle';
    analysisProgressText = '1/4 • Cortando as 60 cartas e executando a cascata Riffle...';
    setMascotState('thinking', 'Embaralhando o baralho de São José... Concentre-se na sua proposta!');
    renderOracleView();

    // Dispara a chamada de IA em paralelo para que a resposta fique pronta enquanto as cartas dançam
    const aiPromise = calculateAuthenticTarotSpread(oracleAnswers);

    // Passo 2: O Deslize na Mesa (Wash / Circular Spread)
    setTimeout(() => {
      choreoSubPhase = 'wash';
      analysisProgressText = '2/4 • Deslizando e misturando as personas na mesa...';
      renderOracleView();

      // Passo 3: Abertura em Leque Perfeito (Fan Spread)
      setTimeout(() => {
        choreoSubPhase = 'fan';
        analysisProgressText = '3/4 • Abrindo o leque de 60 cartas para o corte sagrado...';
        setMascotState('curious', 'Abrindo o leque das 60 personas de São José...');
        renderOracleView();

        // Passo 4: Sacando as 3 Cartas para os Altares
        setTimeout(() => {
          readingPhase = 'dealing';
          analysisProgressText = '4/4 • Sacando a Persona Central, Alavanca e Ponto Cego...';
          setMascotState('surprised', 'As 3 cartas do seu caminho estratégico foram sacadas!');
          renderOracleView();

          setTimeout(async () => {
            readingPhase = 'analyzing';
            analysisProgressText = 'Oráculo sintetizando o veredito e plano de ataque territorial...';
            renderOracleView();

            try {
              const results = await aiPromise;
              oracleResultCards = results;
            } catch (err) {
              oracleResultCards = calculateOracleMatchesFallback(oracleAnswers);
            }

            setTimeout(() => {
              readingPhase = 'revealed';
              setMascotState('celebration', 'Leitura concluída! Suas cartas revelam o caminho exato em SJC.');
              renderOracleView();
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }, 1200);

          }, 1300);

        }, 1200);

      }, 1200);

    }, 1100);
  }

  function renderRevealedResultsHtml(r) {
    const veredito = r.veredito_ideia || {};
    const central = r.analise_persona_central || {};
    const alavanca = r.analise_alavanca || {};
    const pontoCego = r.alerta_ponto_cego || {};
    const blocoCentral = r.bloco_persona_central || {};
    const blocoAlavanca = r.bloco_alavanca || {};
    const blocoPontoCego = r.bloco_ponto_cego || {};
    const blocoPlano = r.bloco_plano_ataque || {};
    const plano = (blocoPlano.passos_taticos && blocoPlano.passos_taticos.length > 0) 
      ? blocoPlano.passos_taticos 
      : (Array.isArray(r.plano_de_ataque_sjc) ? r.plano_de_ataque_sjc : []);

    // Diagnóstico contextual sóbrio e analítico
    const rotuloVeredito = veredito.rotulo || "DIAGNÓSTICO CONTEXTUAL • SÃO JOSÉ DOS CAMPOS 2026";
    const conversaFrancaKapy = veredito.conversa_franca_kapy || r.diagnostico_executivo || r.vereditoOraculo || '';
    const tesePosicionamento = veredito.tese_de_posicionamento || r.tese_de_posicionamento || '';

    // Textos dos Blocos
    const falaCentral = blocoCentral.fala_kapy || central.motivo_aderencia || `Esta persona é quem sente a dor imediata no seu dia a dia em ${r.primary?.bairro || 'SJC'} e possui renda e rotina para validar a sua oferta nos primeiros 30 dias.`;
    const jobCentral = blocoCentral.job_to_be_done || central.job_to_be_done || '';
    const msgCentral = blocoCentral.mensagem_conquista || central.mensagem_de_conquista || '';
    const objCentral = blocoCentral.como_vencer_objecao || central.resposta_a_objecao || '';

    const falaAlavanca = blocoAlavanca.fala_kapy || alavanca.papel_multiplicador || `Em São José dos Campos, ninguém compra nada de primeira sem conferir quem já aprovou antes. Esta persona tem capital relacional para destravar a sua autoridade.`;
    const mecAlavanca = blocoAlavanca.mecanismo_influencia || alavanca.mecanismo_de_influencia || '';
    const parcAlavanca = blocoAlavanca.estrategia_parceria || alavanca.acao_parceria || '';
    const riscAlavanca = blocoAlavanca.risco_ativacao || alavanca.risco_da_ativacao || '';

    const falaPontoCego = blocoPontoCego.fala_kapy || pontoCego.armadilha_local || `Fique muito atento à barreira cultural e comportamental de São José: promessas genéricas ou canais automatizados ativam a desconfiança imediata do joseense.`;
    const armadilhaPontoCego = blocoPontoCego.armadilha_local || pontoCego.armadilha_local || '';
    const nuncaPontoCego = blocoPontoCego.o_que_nunca_fazer || pontoCego.o_que_nao_fazer || '';
    const blindPontoCego = blocoPontoCego.acao_blindagem || pontoCego.acao_blindagem || '';

    const falaPlano = blocoPlano.fala_kapy || 'Sob a ótica de alocação de esforço e recursos em São José dos Campos, a rota mais prudente de validação progressiva compreende os seguintes passos:';
    const primeiroExp = blocoPlano.primeiro_passo_7_dias || r.veredito_final?.primeiro_experimento || 'Rodar teste tático de 7 dias com oferta direta e mensuração da taxa de conversão local.';

    return `
      <div class="space-y-10 animate-in fade-in duration-500">
        
        <!-- ========================================== -->
        <!-- TOPO: DIAGNÓSTICO CONTEXTUAL DA KAPY       -->
        <!-- ========================================== -->
        <div class="bg-white text-slate-900 p-6 sm:p-9 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
          
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div class="flex items-center gap-4">
              <div class="relative shrink-0">
                <img src="data_personas/capivara/01_boas_vindas.png" alt="Kapy" class="w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-sm" />
                <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[9px] text-slate-950 font-black shadow-xs" title="Online">✓</span>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-pink-900 border border-pink-200 shadow-xs">
                    <i class="fa-solid fa-compass text-pink-600"></i> ${rotuloVeredito}
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Radar SJC 2026 • 477 Respondentes & 60 Personas
                  </span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  ${r.titulo_leitura || r.tituloLeitura || 'Diagnóstico Estratégico de São José dos Campos'}
                </h2>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button type="button" onclick="window.resetOracleReading()" class="px-5 py-3 bg-slate-900 hover:bg-pink-900 text-white font-black text-xs rounded-2xl shadow-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-rotate-left"></i>
                <span>Nova Consulta</span>
              </button>
              <button type="button" onclick="window.switchRadarDnaTab('dossier')" class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-address-book"></i>
                <span>Ver 60 Personas</span>
              </button>
            </div>
          </div>

          <!-- ANÁLISE CONTEXTUAL DA KAPY -->
          <div class="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-pink-700">
              <i class="fa-solid fa-comments text-pink-600"></i> Análise Estratégica da Kapy:
            </div>
            <p class="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
              ${conversaFrancaKapy}
            </p>
          </div>

          <!-- TESE DE POSICIONAMENTO EM DESTAQUE -->
          ${tesePosicionamento ? `
            <div class="bg-gradient-to-r from-pink-50/80 to-purple-50/80 p-4 sm:p-5 rounded-2xl border border-pink-200 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 text-lg border border-pink-200">
                <i class="fa-solid fa-bullseye-arrow"></i>
              </div>
              <div class="space-y-0.5 min-w-0">
                <span class="text-[10px] font-black uppercase tracking-wider text-pink-800">Tese Central de Posicionamento para Vencer em SJC</span>
                <p class="text-sm sm:text-base font-black text-slate-900 leading-snug">"${tesePosicionamento}"</p>
              </div>
            </div>
          ` : ''}

        </div>


        <!-- ========================================================================= -->
        <!-- BLOCO 1: A PERSONA CENTRAL (Texto Conversacional + Carta I Emparelhada)   -->
        <!-- ========================================================================= -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2.5">
              <span class="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-300">
                <i class="fa-solid fa-crown text-emerald-700 mr-1.5"></i> Bloco 1 • O Cliente Real
              </span>
              <span class="text-xs font-bold text-slate-500">Quem realmente paga a sua conta na cidade</span>
            </div>
            <span class="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              Carta I • A Persona Central
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            <!-- Coluna de Conversa da Kapy (7 colunas) -->
            <div class="lg:col-span-7 flex flex-col justify-start space-y-4">
              
              <!-- Balão da Kapy -->
              <div class="bg-gradient-to-br from-emerald-50/70 to-slate-50 p-5 sm:p-6 rounded-2xl border border-emerald-200 shadow-xs relative">
                <div class="flex items-center gap-3 mb-3 pb-3 border-b border-emerald-100">
                  <img src="data_personas/capivara/01_boas_vindas.png" alt="Kapy" class="w-12 h-12 object-contain filter drop-shadow-sm" />
                  <div>
                    <div class="text-xs font-black text-slate-900">Kapy conversa olho no olho com você:</div>
                    <div class="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Demanda Direta & Perfil Prioritário</div>
                  </div>
                </div>
                <p class="text-sm text-slate-800 leading-relaxed font-medium">
                  ${falaCentral}
                </p>
              </div>

              <!-- Cartões Táticos da Persona Central -->
              <div class="space-y-3">
                ${jobCentral ? `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                    <strong class="text-emerald-900 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-bullseye text-emerald-600"></i> Job-to-be-Done (O que precisa resolver na rotina):
                    </strong>
                    <p class="text-slate-700 leading-snug pl-4">${jobCentral}</p>
                  </div>
                ` : ''}

                ${msgCentral ? `
                  <div class="p-3.5 rounded-xl bg-pink-50/70 border border-pink-200 text-xs text-slate-800">
                    <strong class="text-pink-900 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-comment-dots text-pink-600"></i> Mensagem de Conquista para a Praça:
                    </strong>
                    <p class="text-pink-950 font-bold italic leading-snug pl-4">"${msgCentral}"</p>
                  </div>
                ` : ''}

                ${objCentral ? `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong class="text-slate-900 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-shield-halved text-slate-600"></i> Como Vencer a Objeção Imediata:
                    </strong>
                    <p class="text-slate-600 leading-snug pl-4">${objCentral}</p>
                  </div>
                ` : ''}
              </div>

            </div>

            <!-- Coluna da Carta ao Lado (5 colunas) -->
            <div class="lg:col-span-5 flex flex-col justify-center">
              ${renderPersonaCardResult(r.primary, 'CARTA I • A PERSONA CENTRAL', '👑 DEMANDA PRIORITÁRIA', 'emerald')}
            </div>

          </div>
        </div>


        <!-- ========================================================================= -->
        <!-- BLOCO 2: A ALAVANCA (Carta II Emparelhada + Texto Conversacional)        -->
        <!-- ========================================================================= -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2.5">
              <span class="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-950 border border-purple-300">
                <i class="fa-solid fa-bolt text-purple-700 mr-1.5"></i> Bloco 2 • O Efeito Rede
              </span>
              <span class="text-xs font-bold text-slate-500">Quem abre as portas e destrava o boca a boca local</span>
            </div>
            <span class="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
              Carta II • A Alavanca Multiplicadora
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            <!-- Coluna da Carta ao Lado (5 colunas) - à esquerda no desktop -->
            <div class="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
              ${renderPersonaCardResult(r.multiplier, 'CARTA II • A ALAVANCA', '🚀 MULTIPLICADOR & PROVA', 'purple')}
            </div>

            <!-- Coluna de Conversa da Kapy (7 colunas) - à direita no desktop -->
            <div class="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-start space-y-4">
              
              <!-- Balão da Kapy -->
              <div class="bg-gradient-to-br from-purple-50/70 to-slate-50 p-5 sm:p-6 rounded-2xl border border-purple-200 shadow-xs relative">
                <div class="flex items-center gap-3 mb-3 pb-3 border-b border-purple-100">
                  <img src="data_personas/capivara/02_curiosa.png" alt="Kapy" class="w-12 h-12 object-contain filter drop-shadow-sm" />
                  <div>
                    <div class="text-xs font-black text-slate-900">Kapy explica a ponte de influência em SJC:</div>
                    <div class="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider">Como Quebrar a Bolha Comunitária</div>
                  </div>
                </div>
                <p class="text-sm text-slate-800 leading-relaxed font-medium">
                  ${falaAlavanca}
                </p>
              </div>

              <!-- Cartões Táticos da Alavanca -->
              <div class="space-y-3">
                ${mecAlavanca ? `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                    <strong class="text-purple-900 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-share-nodes text-purple-600"></i> Mecanismo de Influência Real:
                    </strong>
                    <p class="text-slate-700 leading-snug pl-4">${mecAlavanca}</p>
                  </div>
                ` : ''}

                ${parcAlavanca ? `
                  <div class="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-slate-800">
                    <strong class="text-purple-950 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-handshake text-purple-700"></i> Ação de Parceria Estratégica:
                    </strong>
                    <p class="text-purple-950 font-bold leading-snug pl-4">${parcAlavanca}</p>
                  </div>
                ` : ''}

                ${riscAlavanca ? `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong class="text-rose-900 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-triangle-exclamation text-rose-500"></i> O que pode queimar a parceria:
                    </strong>
                    <p class="text-slate-600 leading-snug pl-4">${riscAlavanca}</p>
                  </div>
                ` : ''}
              </div>

            </div>

          </div>
        </div>


        <!-- ========================================================================= -->
        <!-- BLOCO 3: O PONTO CEGO (Texto Conversacional + Carta III Emparelhada)      -->
        <!-- ========================================================================= -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2.5">
              <span class="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
                <i class="fa-solid fa-triangle-exclamation text-amber-700 mr-1.5"></i> Bloco 3 • O Alerta Vermelho
              </span>
              <span class="text-xs font-bold text-slate-500">A barreira comportamental crítica de validação em SJC</span>
            </div>
            <span class="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
              Carta III • O Ponto Cego
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            <!-- Coluna de Conversa da Kapy (7 colunas) -->
            <div class="lg:col-span-7 flex flex-col justify-start space-y-4">
              
              <!-- Balão da Kapy -->
              <div class="bg-gradient-to-br from-amber-50/70 to-slate-50 p-5 sm:p-6 rounded-2xl border border-amber-200 shadow-xs relative">
                <div class="flex items-center gap-3 mb-3 pb-3 border-b border-amber-100">
                  <img src="data_personas/capivara/03_pensativa.png" alt="Kapy" class="w-12 h-12 object-contain filter drop-shadow-sm" />
                  <div>
                    <div class="text-xs font-black text-slate-900">Kapy alerta com toda a franqueza:</div>
                    <div class="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">A Barreira Que Você Não Pode Ignorar</div>
                  </div>
                </div>
                <p class="text-sm text-slate-800 leading-relaxed font-medium">
                  ${falaPontoCego}
                </p>
              </div>

              <!-- Cartões Táticos do Ponto Cego -->
              <div class="space-y-3">
                ${armadilhaPontoCego ? `
                  <div class="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-800">
                    <strong class="text-amber-950 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-land-mine-on text-amber-600"></i> A Armadilha Local de SJC:
                    </strong>
                    <p class="text-amber-950 font-medium leading-snug pl-4">${armadilhaPontoCego}</p>
                  </div>
                ` : ''}

                ${nuncaPontoCego ? `
                  <div class="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950">
                    <strong class="text-rose-700 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-ban text-rose-600"></i> O que NUNCA fazer na Cidade:
                    </strong>
                    <p class="text-rose-950 font-bold leading-snug pl-4">${nuncaPontoCego}</p>
                  </div>
                ` : ''}

                ${blindPontoCego ? `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong class="text-slate-900 flex items-center gap-1.5 mb-1 text-[11px] font-black uppercase tracking-wider">
                      <i class="fa-solid fa-shield text-slate-600"></i> Ação Prática de Blindagem:
                    </strong>
                    <p class="text-slate-700 leading-snug pl-4">${blindPontoCego}</p>
                  </div>
                ` : ''}
              </div>

            </div>

            <!-- Coluna da Carta ao Lado (5 colunas) -->
            <div class="lg:col-span-5 flex flex-col justify-center">
              ${renderPersonaCardResult(r.shadow, 'CARTA III • O PONTO CEGO', '⚠️ RISCO & BARREIRA LOCAL', 'amber')}
            </div>

          </div>
        </div>


        <!-- ========================================================================= -->
        <!-- BLOCO 4: PLANO ESTRATÉGICO DE VALIDAÇÃO LOCAL                             -->
        <!-- ========================================================================= -->
        <div class="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-slate-200">
          
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-slate-100 pb-5">
            <div class="space-y-1.5 max-w-2xl">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                <i class="fa-solid fa-compass"></i> Bloco 4 • O Movimento Inteligente
              </span>
              <h4 class="text-xl sm:text-2xl font-black text-slate-900">Alocação Estratégica & Validação Local</h4>
              <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">${falaPlano}</p>
            </div>

            <div class="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl shrink-0 max-w-sm w-full md:w-auto shadow-sm">
              <div class="text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-stopwatch text-amber-600"></i> Experimento dos Próximos 7 Dias
              </div>
              <p class="text-xs text-slate-800 font-semibold leading-snug">
                ${primeiroExp}
              </p>
            </div>
          </div>

          <!-- Passos Táticos em Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${plano.map(p => `
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span class="w-7 h-7 rounded-xl bg-pink-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      ${p.prioridade || 1}
                    </span>
                    <span class="text-[10px] font-extrabold text-pink-700 uppercase tracking-wider bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-200">
                      ${p.canal_ou_territorio || p.canal || 'SJC'}
                    </span>
                  </div>
                  <h5 class="text-xs font-black text-slate-900 leading-snug">${p.acao}</h5>
                  <p class="text-[11px] text-slate-600 font-medium"><strong>Público:</strong> <span class="text-slate-800">${p.publico}</span></p>
                  <p class="text-[11px] text-pink-900 bg-pink-50/60 p-2.5 rounded-xl border border-pink-100">
                    <strong class="text-pink-950">Oferta / Mensagem:</strong> "${p.mensagem_ou_oferta || p.mensagem_oferta || p.mensagem || ''}"
                  </p>
                </div>

                <div class="pt-3 border-t border-slate-200/80 space-y-1 text-[11px]">
                  <div class="text-emerald-700 font-bold"><strong>Objetivo:</strong> ${p.objetivo}</div>
                  <div class="text-slate-500 font-medium"><strong>Indicador:</strong> ${p.indicador_inicial || p.indicador || 'Validação direta'}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Rodapé de Ações Finais -->
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div class="text-xs text-slate-500 flex items-center gap-2">
              <i class="fa-solid fa-shield-check text-emerald-600"></i>
              <span>Diagnóstico validado pelo cruzamento da pesquisa N=477 e as 60 Personas de SJC.</span>
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button type="button" onclick="window.resetOracleReading()" class="flex-1 sm:flex-none px-5 py-3 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-rotate-left"></i>
                <span>Executar Nova Consulta</span>
              </button>
              <button type="button" onclick="window.switchRadarDnaTab('dossier')" class="flex-1 sm:flex-none px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-address-book text-slate-600"></i>
                <span>Ver Dossiê das 60 Personas</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  function renderPersonaCardResult(p, slotTitle, slotBadge, colorTheme, meta = {}) {
    if (!p) return '';
    const formattedId = String(p.id).padStart(2, '0');
    const hab = p.habitos || {};

    const themes = {
      emerald: {
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
      },
      purple: {
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
      },
      amber: {
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
      }
    };

    const t = themes[colorTheme] || themes.emerald;

    return `
      <div class="oracle-flip-card-wrapper" data-oracle-flip="true" onclick="this.classList.toggle('is-revealed')">
        <div class="oracle-flip-card-inner">
          
          <!-- VERSO DA CARTA: INICIALMENTE VISÍVEL COM O FUNDO VERMELHO -->
          <div class="oracle-flip-card-back">
            <img 
              src="fotos_radar/card_back_red.png" 
              onerror="this.src='fotos_radar/card_back_red.jpg'" 
              alt="Verso Oficial da Carta" 
              class="w-full h-full object-cover" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none"></div>

            <!-- Header do Verso -->
            <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
              <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-black/80 text-pink-200 border border-pink-500/50 backdrop-blur-md shadow-md">
                ${slotTitle}
              </span>
              <span class="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs shadow-md border border-pink-300/40">
                <i class="fa-solid fa-sparkles"></i>
              </span>
            </div>

            <!-- Centro com Selo Tático -->
            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <div class="w-16 h-16 rounded-2xl bg-black/50 border border-pink-400/40 backdrop-blur-md flex items-center justify-center mb-3 shadow-2xl">
                <i class="fa-solid fa-layer-group text-2xl text-pink-300"></i>
              </div>
              <span class="text-xs font-black text-pink-100 uppercase tracking-widest drop-shadow-md">${slotBadge}</span>
              <span class="text-[11px] text-pink-200/80 font-medium mt-1">Radar São José dos Campos</span>
            </div>

            <!-- Rodapé do Verso -->
            <div class="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-black/85 text-pink-100 border border-pink-400/40 backdrop-blur-md shadow-lg">
                <i class="fa-solid fa-arrow-down text-pink-400 animate-bounce"></i> Role a página para desvirar
              </span>
            </div>
          </div>

          <!-- FRENTE DA CARTA: IDÊNTICA AO DOSSIÊ COMPLETO -->
          <div class="oracle-flip-card-front">
            
            <!-- Tag do Slot no topo da frente -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-xs">${slotTitle}</span>
              <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${t.badgeBg} shadow-xs">${slotBadge}</span>
            </div>

            <div class="pokemon-card card-bg-dourado">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h3 class="font-black text-slate-900 text-base leading-tight">${p.nome_completo}</h3>
                  <span class="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Nº ${formattedId}</span>
                </div>

                <div class="pokemon-art-window">
                  <img 
                    src="${p.foto || 'data_personas/imagens_personagens/personagem_' + p.id + '.jpg'}" 
                    alt="${p.nome_completo}" 
                    class="w-full h-full object-cover object-top" 
                  />
                  <div class="absolute bottom-2 right-2 flex items-center gap-1">
                    <span class="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-black text-white shadow-md">
                      💰 ${p.faixa_renda}
                    </span>
                  </div>
                </div>

                <div class="pokemon-sub-bar">
                  📍 <strong>${p.bairro}</strong> (${p.regiao}) • 🎂 <strong>${p.idade} anos</strong> • 💼 <strong>${p.profissao}</strong>
                </div>
              </div>

              <div class="pokemon-attacks-box space-y-2">
                <div class="flex items-start gap-1.5 min-w-0">
                  <span class="text-sm shrink-0">🛍️</span>
                  <div class="min-w-0">
                    <span class="font-black text-slate-900 block leading-tight text-xs">Hábito de Consumo:</span>
                    <span class="text-[11px] text-slate-700 font-medium leading-snug">${hab.consumo || p.estiloConsumo || 'Consumo Local em SJC'}</span>
                  </div>
                </div>

                <div class="flex items-start gap-1.5 min-w-0 border-t border-slate-100 pt-1.5">
                  <span class="text-sm shrink-0">💔</span>
                  <div class="min-w-0">
                    <span class="font-black text-slate-900 block leading-tight text-xs">Maior Dor:</span>
                    <span class="text-[11px] text-red-700 font-bold leading-snug">${p.dor_principal || 'Tempo e Logística'}</span>
                  </div>
                </div>
              </div>

              <div class="pokemon-footer-box space-y-1.5">
                <p class="pokemon-flavor-text">
                  📖 "${p.historia || p.historia_resumida || ''}"
                </p>
                <div class="flex items-center justify-between text-[10px] font-bold text-slate-700 pt-1 border-t border-slate-200">
                  <span>✨ ORÁCULO RDR • SJC</span>
                  <span class="font-black text-slate-950 bg-white px-2 py-0.5 rounded border border-slate-300">Nº ${formattedId}/0060 ◆</span>
                </div>
              </div>

              <button type="button" 
                onclick="event.stopPropagation(); window.openPersonaModal(${p.id})" 
                class="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-pink-900 text-white transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-address-card"></i>
                <span>Ver Dossiê Completo</span>
              </button>

            </div>

          </div>

        </div>
      </div>
    `;
  }

  function initOracleCardFlipObserver() {
    const cards = document.querySelectorAll('.oracle-flip-card-wrapper');
    if (!cards || !cards.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-revealed');
            }, 300);
          }
        });
      }, {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px'
      });

      cards.forEach(c => observer.observe(c));
    } else {
      cards.forEach(c => c.classList.add('is-revealed'));
    }
  }

  // ----------------------------------------------------
  // DOSSIÊ COMPLETO (60 PERSONAS)
  // ----------------------------------------------------
  function renderDossierView() {
    const container = document.getElementById('dossier-view-container');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        
        <div class="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="relative w-full md:w-80">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              type="text" 
              id="filter-persona-search-dossier" 
              placeholder="Buscar por nome, profissão, bairro..."
              class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              oninput="window.updateDossierSearch(this.value)"
            />
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select id="filter-persona-regiao-dossier" class="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700" onchange="window.updateDossierFilter('regiao', this.value)">
              <option value="">Todas as Regiões</option>
              <option value="Centro">Região Central</option>
              <option value="Sul">Região Sul</option>
              <option value="Leste">Região Leste</option>
              <option value="Oeste">Região Oeste</option>
              <option value="Norte">Região Norte</option>
              <option value="Sudeste">Região Sudeste</option>
            </select>

            <button type="button" onclick="window.resetDossierFilters()" class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5">
              <i class="fa-solid fa-rotate-left text-[11px]"></i> Limpar
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span id="dossier-count-display" class="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
            Mostrando 60 de 60 Personas de São José dos Campos
          </span>
          <span class="text-xs font-bold text-pink-700">60 Personas Auditadas</span>
        </div>

        <div id="dossier-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
      </div>
    `;

    renderDossierGrid();
    updateSidebarDiagnosis();
  }

  function updateDossierSearch(val) {
    currentDossierFilter.search = val;
    renderDossierGrid();
  }

  function updateDossierFilter(key, val) {
    currentDossierFilter[key] = val;
    renderDossierGrid();
  }

  function resetDossierFilters() {
    currentDossierFilter = { search: '', regiao: '', movimento: '', consumo: '' };
    const sInput = document.getElementById('filter-persona-search-dossier');
    const mReg = document.getElementById('filter-persona-regiao-dossier');
    if (sInput) sInput.value = '';
    if (mReg) mReg.value = '';
    renderDossierGrid();
  }

  function renderDossierGrid() {
    const grid = document.getElementById('dossier-cards-grid');
    const countDisplay = document.getElementById('dossier-count-display');
    if (!grid) return;

    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const sVal = norm(currentDossierFilter.search);
    const regVal = norm(currentDossierFilter.regiao);

    const filtered = PERSONAS_SJC_DATA.filter(p => {
      if (sVal) {
        const searchPool = norm(`${p.nome_completo} ${p.profissao} ${p.bairro} ${p.regiao} ${p.dor_principal}`);
        if (!searchPool.includes(sVal)) return false;
      }
      if (regVal) {
        if (!norm(p.regiao).includes(regVal)) return false;
      }
      return true;
    });

    if (countDisplay) {
      countDisplay.innerText = `Mostrando ${filtered.length} de 60 Personas de São José dos Campos`;
    }
    const sidebarCount = document.getElementById('personas-sidebar-count');
    if (sidebarCount) {
      sidebarCount.innerText = filtered.length;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <i class="fa-solid fa-users-slash text-4xl text-slate-300"></i>
          <h4 class="text-base font-bold text-slate-700">Nenhuma persona encontrada com esses filtros</h4>
          <p class="text-xs text-slate-500">Tente ajustar a busca ou limpar os filtros regionais.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const formattedId = String(p.id).padStart(2, '0');
      const hab = p.habitos || {};

      return `
        <div class="pokemon-card card-bg-dourado" onclick="window.openPersonaModal(${p.id})">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-slate-900 text-base leading-tight">${p.nome_completo}</h3>
              <span class="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Nº ${formattedId}</span>
            </div>

            <div class="pokemon-art-window">
              <img 
                src="${p.foto || 'data_personas/imagens_personagens/personagem_' + p.id + '.jpg'}" 
                alt="${p.nome_completo}" 
                class="w-full h-full object-cover object-top"
              />
              <div class="absolute bottom-2 right-2 flex items-center gap-1">
                <span class="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-black text-white shadow-md">
                  💰 ${p.faixa_renda}
                </span>
              </div>
            </div>

            <div class="pokemon-sub-bar">
              📍 <strong>${p.bairro}</strong> (${p.regiao}) • 🎂 <strong>${p.idade} anos</strong> • 💼 <strong>${p.profissao}</strong>
            </div>
          </div>

          <div class="pokemon-attacks-box space-y-2">
            <div class="flex items-start gap-1.5 min-w-0">
              <span class="text-sm shrink-0">🛍️</span>
              <div class="min-w-0">
                <span class="font-black text-slate-900 block leading-tight text-xs">Hábito de Consumo:</span>
                <span class="text-[11px] text-slate-700 font-medium leading-snug">${hab.consumo || p.estiloConsumo || 'Consumo Local em SJC'}</span>
              </div>
            </div>

            <div class="flex items-start gap-1.5 min-w-0 border-t border-slate-100 pt-1.5">
              <span class="text-sm shrink-0">💔</span>
              <div class="min-w-0">
                <span class="font-black text-slate-900 block leading-tight text-xs">Maior Dor:</span>
                <span class="text-[11px] text-red-700 font-bold leading-snug">${p.dor_principal || 'Tempo e Logística'}</span>
              </div>
            </div>
          </div>

          <div class="pokemon-footer-box space-y-1.5">
            <p class="pokemon-flavor-text">
              📖 "${p.historia || p.historia_resumida || ''}"
            </p>
            <div class="flex items-center justify-between text-[10px] font-bold text-slate-700 pt-1 border-t border-slate-200">
              <span>✨ ORÁCULO RDR • SJC</span>
              <span class="font-black text-slate-950 bg-white px-2 py-0.5 rounded border border-slate-300">Nº ${formattedId}/0060 ◆</span>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  // MODAL DE DETALHES
  function openPersonaModal(id) {
    const p = PERSONAS_SJC_DATA.find(x => x.id === id);
    if (!p) return;

    let modal = document.getElementById('persona-modal');
    if (!modal) return;

    const hab = p.habitos || {};
    const midias = (p.veiculos_midia || []).map(m => `<span class="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">${m.nome || m}</span>`).join('') || '<span class="text-xs text-slate-500">Mídias regionais do Vale</span>';
    const influenciadores = (p.influenciadores_seguidos || []).map(inf => `<span class="px-2.5 py-1 bg-pink-50 border border-pink-200 rounded-lg text-xs font-bold text-pink-900">@${inf.handle || inf.nome || inf}</span>`).join('') || '<span class="text-xs text-slate-500">Criadores locais de SJC</span>';

    const avatarEl = document.getElementById('modal-persona-avatar');
    if (avatarEl) {
      avatarEl.innerHTML = `<img src="${p.foto || 'data_personas/imagens_personagens/personagem_' + p.id + '.jpg'}" class="w-full h-full object-cover rounded-2xl" />`;
    }

    const nameEl = document.getElementById('modal-persona-name');
    if (nameEl) nameEl.innerText = p.nome_completo;

    const movEl = document.getElementById('modal-persona-movimento');
    if (movEl) movEl.innerText = p.movimento;

    const titleEl = document.getElementById('modal-persona-title');
    if (titleEl) titleEl.innerText = `${p.profissao} • ${p.idade} anos • ${p.faixa_renda}`;

    const locEl = document.getElementById('modal-persona-location');
    if (locEl) locEl.innerHTML = `<i class="fa-solid fa-location-dot text-pink-400 mr-1"></i> ${p.bairro} (${p.regiao})`;

    const fraseEl = document.getElementById('modal-persona-frase');
    if (fraseEl) fraseEl.innerText = `"${p.historia || p.historia_resumida || ''}"`;

    const dorEl = document.getElementById('modal-persona-dor');
    if (dorEl) dorEl.innerText = p.dor_principal;

    const habListEl = document.getElementById('modal-persona-habitos');
    if (habListEl) {
      habListEl.innerHTML = `
        <li class="text-xs text-slate-700"><strong>Alimentação:</strong> ${hab.alimentacao || 'Restaurantes e feiras de SJC'}</li>
        <li class="text-xs text-slate-700"><strong>Consumo:</strong> ${hab.consumo || 'Comércio de bairro e shoppings'}</li>
        <li class="text-xs text-slate-700"><strong>Vestuário:</strong> ${hab.vestuario || 'Confortável e funcional'}</li>
        <li class="text-xs text-slate-700"><strong>Paixões:</strong> ${hab.paixoes || 'Parques e passeios em família'}</li>
      `;
    }

    const infListEl = document.getElementById('modal-persona-influenciadores');
    if (infListEl) {
      infListEl.innerHTML = `
        <div class="space-y-2 w-full">
          <div>
            <span class="text-[11px] font-black text-slate-600 block mb-1">Veículos de Mídia:</span>
            <div class="flex flex-wrap gap-1.5">${midias}</div>
          </div>
          <div>
            <span class="text-[11px] font-black text-slate-600 block mb-1">Influenciadores Seguidos:</span>
            <div class="flex flex-wrap gap-1.5">${influenciadores}</div>
          </div>
        </div>
      `;
    }

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closePersonaModal() {
    const modal = document.getElementById('persona-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  function setOracleStep(step) {
    currentOracleStep = step;
    renderOracleView();
  }

  function updateSidebarDiagnosis() {
    const sidebar = document.getElementById('sidebar-personas-filters-container');
    if (!sidebar) return;

    if (currentActiveTab === 'oracle') {
      // Cálculo de afunilamento em tempo real
      let activeCount = 60;
      const targetReg = (oracleAnswers.q3_regiao || '').toLowerCase();
      const targetTicket = oracleAnswers.q2_ticket || '';

      if (readingPhase === 'revealed') {
        activeCount = 3;
      } else if (targetReg || targetTicket) {
        const matches = PERSONAS_SJC_DATA.filter(p => {
          let ok = true;
          if (targetReg && !((p.regiao || '').toLowerCase().includes(targetReg) || (p.bairro || '').toLowerCase().includes(targetReg))) {
            ok = false;
          }
          return ok;
        });
        activeCount = Math.max(8, matches.length);
      }

      const q1Labels = { inovacao: "Inovação & Vanguarda", luxo: "Alto Padrão", tradicao: "Tradição", agilidade: "Agilidade & WhatsApp" };
      const q2Labels = { alto: "Alto Padrão", experiencia: "Experiência & Cultura", custo_beneficio: "Custo-Benefício", economico: "Popular" };
      const q3Labels = {
        centro: "Região Centro",
        sul: "Região Sul",
        leste: "Região Leste",
        oeste: "Região Oeste",
        norte: "Região Norte",
        sudeste: "Região Sudeste"
      };
      const q4Labels = { instagram: "Instagram", whatsapp: "WhatsApp", google: "Google / SEO", eventos: "Parcerias & Eventos" };

      sidebar.innerHTML = `
        <div class="space-y-4">
          <!-- CARD DE AFUNILAMENTO -->
          <div class="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200/80 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                <i class="fa-solid fa-radar fa-spin-pulse"></i> Radar Ativo
              </span>
              <span class="text-[10px] font-bold text-slate-500">Etapa ${readingPhase === 'revealed' ? 'Final' : currentOracleStep + '/5'}</span>
            </div>
            <div class="flex items-baseline gap-1.5 mt-1.5">
              <span class="text-2xl font-black text-slate-900">${activeCount}</span>
              <span class="text-xs font-bold text-slate-600">personas no radar</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-gradient-to-r from-pink-500 to-purple-600 h-1.5 rounded-full transition-all duration-500" style="width: ${readingPhase === 'revealed' ? '100%' : (currentOracleStep * 20) + '%'}"></div>
            </div>
          </div>

          <!-- RESUMO DA SESSÃO ATUAL -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-600 block border-b border-slate-100 pb-1.5">
              Dossiê da sua Consulta:
            </span>

            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-bold">Proposta:</span>
                <span class="font-extrabold text-pink-700">${q1Labels[oracleAnswers.q1_proposta] || 'Pendente'}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-bold">Ticket:</span>
                <span class="font-extrabold text-purple-700">${q2Labels[oracleAnswers.q2_ticket] || 'Pendente'}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-bold">Região:</span>
                <span class="font-extrabold text-emerald-700">${q3Labels[oracleAnswers.q3_regiao] || 'Pendente'}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-bold">Canal:</span>
                <span class="font-extrabold text-blue-700">${q4Labels[oracleAnswers.q4_canal] || 'Pendente'}</span>
              </div>
            </div>

            ${oracleAnswers.q5_texto_livre ? `
              <div class="pt-2 border-t border-slate-100">
                <span class="text-[10px] font-bold text-slate-500 block">Desafio Registrado:</span>
                <p class="text-[11px] text-slate-800 font-semibold italic truncate">"${oracleAnswers.q5_texto_livre}"</p>
              </div>
            ` : ''}

            <button type="button" onclick="window.resetOracleReading()" class="w-full py-2 bg-slate-100 hover:bg-pink-100 text-slate-700 hover:text-pink-900 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2">
              <i class="fa-solid fa-rotate-left text-[10px]"></i> Reiniciar Consulta
            </button>
          </div>
        </div>
      `;
    } else {
      // Modo Dossiê: Filtros de Catálogo
      sidebar.innerHTML = `
        <div class="space-y-4">
          <div class="bg-violet-50/80 rounded-2xl p-3.5 border border-violet-100 shadow-2xs">
            <p class="text-[10px] font-black uppercase tracking-wider text-violet-900">Catálogo de SJC</p>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span id="personas-sidebar-count" class="text-xl font-black text-brand-900">60</span>
              <span class="text-xs font-semibold text-slate-500">de 60 cartas auditadas</span>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Buscar Persona</label>
              <input type="text" id="sidebar-filter-search" placeholder="Nome, bairro, profissão..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-pink-500" oninput="window.updateDossierSearch(this.value)" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Filtrar por Região</label>
              <select id="sidebar-filter-regiao" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-pink-500" onchange="window.updateDossierFilter('regiao', this.value)">
                <option value="">Todas as Regiões</option>
                <option value="Centro">Região Central</option>
                <option value="Sul">Região Sul</option>
                <option value="Leste">Região Leste</option>
                <option value="Oeste">Região Oeste</option>
                <option value="Norte">Região Norte</option>
                <option value="Sudeste">Região Sudeste</option>
              </select>
            </div>

            <button type="button" onclick="window.resetPersonasFilters()" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2">
              <i class="fa-solid fa-rotate-left"></i> Limpar Filtros
            </button>
          </div>
        </div>
      `;
    }
  }

  function selectOracleStepChoice(key, val, nextStep) {
    oracleAnswers[key] = val;
    
    // Expressões reativas da Kapy a cada etapa
    if (nextStep === 2) setMascotState('curious');
    else if (nextStep === 3) setMascotState('thinking');
    else if (nextStep === 4) setMascotState('curious');
    else if (nextStep === 5) setMascotState('surprised');

    if (nextStep) currentOracleStep = nextStep;
    renderOracleView();
  }

  function updateOracleOpenText(val) {
    oracleAnswers.q5_texto_livre = val;
    updateSidebarDiagnosis();
  }

  function setOracleQuickPrompt(text) {
    oracleAnswers.q5_texto_livre = text;
    const textarea = document.getElementById('oracle-open-textarea');
    if (textarea) textarea.value = text;
    updateSidebarDiagnosis();
  }

  function resetOracleReading() {
    oracleResultCards = null;
    readingPhase = 'idle';
    currentOracleStep = 1;
    oracleScreenState = 'game';
    setMascotState('welcome');
    renderOracleView();
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  // Exportações Globais
  window.startOracleGame = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    oracleScreenState = 'game';
    currentOracleStep = 1;
    setMascotState('welcome');
    readingPhase = 'idle';
    renderOracleView();
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  window.returnToOracleWelcome = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    oracleScreenState = 'welcome';
    readingPhase = 'idle';
    setMascotState('welcome');
    renderOracleView();
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  window.switchToDossierTab = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    switchRadarDnaTab('dossier');
  };

  window.resetPersonasFilters = function() {
    resetDossierFilters();
  };

  window.exploreDeckDirectly = function() {
    switchRadarDnaTab('dossier');
    const dossierEl = document.getElementById('dossier-view-container');
    if (dossierEl) {
      dossierEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.initRadarDnaModule = initRadarDnaModule;
  window.triggerCapivaraInteraction = triggerCapivaraInteraction;
  window.setMascotState = setMascotState;
  window.renderPersonasModule = initRadarDnaModule;
  window.switchRadarDnaTab = switchRadarDnaTab;
  window.setOracleStep = setOracleStep;
  window.selectOracleStepChoice = selectOracleStepChoice;
  window.updateOracleOpenText = updateOracleOpenText;
  window.setOracleQuickPrompt = setOracleQuickPrompt;
  window.startAuthenticTarotReadingSequence = startAuthenticTarotReadingSequence;
  window.resetOracleReading = resetOracleReading;
  window.updateDossierSearch = updateDossierSearch;
  window.updateDossierFilter = updateDossierFilter;
  window.resetDossierFilters = resetDossierFilters;
  window.openPersonaModal = openPersonaModal;
  window.closePersonaModal = closePersonaModal;

  document.addEventListener('DOMContentLoaded', () => {
    initRadarDnaModule();

    const modal = document.getElementById('persona-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closePersonaModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePersonaModal();
    });
  });
})();
