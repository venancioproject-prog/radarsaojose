/**
 * Radar São José - Módulo Integrado de Inteligência & Personas SJC
 * 1. Oráculo RDR & Kapy (Mapeamento Interativo com IA & 3 Cartas Sagradas)
 * 2. Dossiê Completo das 60 Personas de SJC (Tilt 3D, Flip 500ms, Multi-select Filters)
 */

(function () {
  const PERSONAS_SJC_DATA = [
  {
    "id": 1,
    "nome_completo": "Maria do Carmo Paes",
    "idade": 54,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Escrevente Judiciária do Fórum",
    "bairro": "Vila Ema",
    "regiao": "Centro",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Carro hatch próprio e caminhada diária",
    "historia_resumida": "Trabalha há mais de vinte anos no fórum e construiu sua rotina em torno da estabilidade de São José. Caminha pelas alamedas arborizadas da Vila Ema e preza por relações de confiança e olho no olho.",
    "dor_da_cidade": "Gargalos viários no horário de pico na Av. São João e obras no anel viário que alteram suas rotas rotineiras.",
    "dor_pessoal": "Medo paralisante da aposentadoria iminente e do vazio existencial de perder a relevância no tribunal onde dedicou toda a vida adulta.",
    "tensao_dramatica": "Tem pavor absoluto de parecer ultrapassada profissionalmente, mas esconde que não consegue operar os novos softwares jurídicos de IA sem pedir socorro aos estagiários.",
    "bordao": "Papel assinado e olho no olho valem mais do que qualquer tecnologia.",
    "habitos": {
      "alimentacao": "Padarias tradicionais, almoço em restaurantes por quilo consolidados e feira livre de domingo.",
      "consumo": "Comércio de rua tradicional, lojas físicas onde conhece o dono há anos e compras estritamente planejadas.",
      "vestuario": "Alfaiataria clássica, tons neutros sóbrios e sapatos confortáveis para o expediente no tribunal.",
      "aversoes": "Atendimento automatizado por robôs de IA e estabelecimentos comerciais barulhentos.",
      "paixoes": "Caminhadas matinais no Parque Vicentina Aranha, jardinagem no quintal e café coado com as amigas de infância."
    },
    "lugares_frequenta": [
      "Parque Vicentina Aranha",
      "Padaria Nove de Julho",
      "Mercado Municipal de SJC"
    ],
    "veiculos_midia": [
      "Rede Vanguarda (Globo) (@redevanguarda)",
      "CBN Vale (@cbnvale)"
    ],
    "influenciadores_seguidos": [
      "Carlos Abranches (@carlosabranchesoficial)",
      "Parque Vicentina Aranha (@parquevicentina)"
    ],
    "estilo_consumo_tag": "Tradicional & Fidelidade",
    "foto": "data_personas/imagens_personagens/personagem_1_maria_do_carmo_paes.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_1_maria_do_carmo_paes.jpg"
  },
  {
    "id": 2,
    "nome_completo": "Marcelo Albuquerque",
    "idade": 46,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Diretor de Operações de Multinacional Tecnológica",
    "bairro": "Vila Adyana",
    "regiao": "Centro",
    "movimento_cultural": "A Cidade Prometida",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "SUV Híbrido e Bicicleta de estrada",
    "historia_resumida": "Paulistano radicado em SJC há doze anos em busca de segurança para a família. Pratica ciclismo na Via Norte e comanda operações corporativas globais a partir do seu escritório em casa.",
    "dor_da_cidade": "Lentidão no acesso à Ponte Estaiada no rush e carência de voos executivos diretos no aeroporto regional.",
    "dor_pessoal": "Sensação constante de impostor corporativo e burnout crônico por tentar sustentar um padrão de vida astronômico para a família.",
    "tensao_dramatica": "Sustenta um padrão de vida que já não cabe no salário e não consegue dizer isso em voz alta — nem para a esposa, nem para si mesmo. Calcula mentalmente quanto tempo a família aguentaria se a diretoria fosse transferida.",
    "bordao": "No fim do trimestre, planilha não aceita desculpa nem poesia.",
    "habitos": {
      "alimentacao": "Empórios gourmets, carnes nobres de cortes especiais para churrasco e cartas de vinhos importados.",
      "consumo": "Assinaturas premium internacionais, tecnologia de automação residencial e serviços de concierge.",
      "vestuario": "Techwear executivo de marcas internacionais, camisas de linho italiano e relógio esportivo de alta precisão.",
      "aversoes": "Sensação de insegurança pública, prestadores de serviços amadores e filas de espera em restaurantes.",
      "paixoes": "Ciclismo de alta performance na estrada, enologia internacional e viagens de esqui com a família."
    },
    "lugares_frequenta": [
      "Colinas Shopping",
      "Empório da Vila Ema",
      "Thermas do Vale / Alphaville Club"
    ],
    "veiculos_midia": [
      "Valor Econômico (@valoreconomico)",
      "Life Informa (@lifeinforma)"
    ],
    "influenciadores_seguidos": [
      "Lucas Sanseverino (@lucassanseverino)",
      "Pellegrini Wine (@pellegriniwine)"
    ],
    "estilo_consumo_tag": "Premium & Exclusividade",
    "foto": "data_personas/imagens_personagens/personagem_2_marcelo_albuquerque.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_2_marcelo_albuquerque.jpg"
  },
  {
    "id": 3,
    "nome_completo": "Larissa Aparecida Souza",
    "idade": 24,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Trancista & Especialista em Alongamento de Unhas",
    "bairro": "Campo dos Alemães",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Ônibus municipal e Moto 160cc própria",
    "historia_resumida": "Começou atendendo a domicílio na zona sul e estruturou seu próprio espaço na garagem de casa. Usa o Instagram com maestria para fechar a agenda semanal e reinveste o lucro em cursos.",
    "dor_da_cidade": "Oscilação de clientes na segunda quinzena do mês e a demora das linhas de ônibus alimentadoras na zona sul.",
    "dor_pessoal": "O desespero sufocante de carregar sozinha o sustento financeiro e os remédios da mãe doente, sentindo que aos 24 anos não teve juventude nem tempo para sonhar com a própria vida.",
    "tensao_dramatica": "Ostenta roupas da moda e faturamento alto nos reels do Instagram, mas já estourou três cartões de crédito e deve juros no cheque especial.",
    "bordao": "Quem tem medo do corre não conquista o brilho.",
    "habitos": {
      "alimentacao": "Lanches rápidos prensados, delivery pelo iFood aos fins de semana e copos generosos de açaí com as clientes.",
      "consumo": "Insumos de beleza no atacado no centro da cidade e compras frequentes de roupas na Shein e Shopee.",
      "vestuario": "Moda jovem urbana, conjuntinhos streetwear confortáveis e unhas de gel impecavelmente decoradas.",
      "aversoes": "Clientes que desmarcam em cima da hora sem aviso e desvalorização do trabalho manual de estética.",
      "paixoes": "Gravar reels de transformação no TikTok, ouvir pagode no Spotify e passear no Shopping Jardim Oriente."
    },
    "lugares_frequenta": [
      "Shopping Jardim Oriente",
      "Feira da Av. Andrômeda",
      "Praça do Campo dos Alemães"
    ],
    "veiculos_midia": [
      "Notícias SJC no Insta (@noticias_sjc)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Juliana Nails SJC (@juliananails_sjc)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Ágil & Digital Popular",
    "foto": "data_personas/imagens_personagens/personagem_3_larissa_aparecida_souza.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_3_larissa_aparecida_souza.jpg"
  },
  {
    "id": 4,
    "nome_completo": "Dr. Gustavo Meirelles",
    "idade": 51,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Cirurgião Ortopedista & Sócio de Clínica Médica",
    "bairro": "Jardim Esplanada",
    "regiao": "Oeste",
    "movimento_cultural": "A Cidade Prometida",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "Sedan Executivo Alemão e Caminhada matinal",
    "historia_resumida": "Médico conceituado com consultório na Vila Adyana e atuação nos hospitais privados da cidade. Escolheu o Esplanada pela proximidade das escolas tradicionais e parques.",
    "dor_da_cidade": "Falta crônica de vagas de estacionamento rotativo para pacientes nas imediações do polo médico da Vila Adyana.",
    "dor_pessoal": "Distanciamento afetivo irreparável dos filhos adolescentes, que o enxergam apenas como um provedor ausente sempre no plantão.",
    "tensao_dramatica": "Depois de cirurgias longas, passa mais tempo do que admitiria olhando as próprias mãos. Nunca falou disso com ninguém do hospital, porque não sabe se é cansaço ou se é o começo do fim da sua melhor fase.",
    "bordao": "Com articulação e osso não se brinca: ou você acerta no milímetro ou o paciente não anda.",
    "habitos": {
      "alimentacao": "Culinária mediterrânea equilibrada, jantares em bistrôs autorais na Vila Ema e café espresso de grãos arábica.",
      "consumo": "Equipamentos cirúrgicos importados de última geração e investimentos estruturados em fundos imobiliários.",
      "vestuario": "Costume sob medida para congressos médicos e jaleco de alta alfaiataria hospitalar.",
      "aversoes": "Atrasos em reuniões de junta médica e fornecedores que não cumprem rigorosamente prazos contratuais.",
      "paixoes": "Partidas de tênis no Clube de Campo Santa Rita, corridas no Vicentina Aranha e leitura de biografias históricas."
    },
    "lugares_frequenta": [
      "Hospital Vivalle",
      "Parque Vicentina Aranha",
      "Clube de Campo Santa Rita"
    ],
    "veiculos_midia": [
      "Revista Saúde Vale (@saudevalerevista)",
      "CBN Vale (@cbnvale)"
    ],
    "influenciadores_seguidos": [
      "Dr. Barakat (@doutorbarakat)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Prestígio & Tradição Médica",
    "foto": "data_personas/imagens_personagens/personagem_4_dr_gustavo_meirelles.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_4_dr_gustavo_meirelles.jpg"
  },
  {
    "id": 5,
    "nome_completo": "Tiago Ramos",
    "idade": 29,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Tech Lead & Engenheiro de Inteligência Artificial",
    "bairro": "Jardim Aquarius",
    "regiao": "Oeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "Carro elétrico compacto e Patinete elétrico próprio",
    "historia_resumida": "Atua remotamente para empresas internacionais a partir do seu apartamento no Aquarius. É apreciador de cafés especiais e adepto da micromobilidade elétrica pelas ciclovias do bairro.",
    "dor_da_cidade": "Carência de cafés e espaços de coworking abertos até tarde e pouca vida noturna diversificada na cidade.",
    "dor_pessoal": "Isolamento social agudo e sensação de que a vida real está passando rápido enquanto vive hiperconectado trabalhando para a gringa.",
    "tensao_dramatica": "Lidera reuniões técnicas com dezenas de pessoas sem piscar, mas evita convites presenciais com desculpas de agenda. Já recusou três palestras que teriam mudado sua carreira.",
    "bordao": "Se você passa mais de dez minutos clicando na mesma coisa todo dia, você tá perdendo a vida pro computador.",
    "habitos": {
      "alimentacao": "Cafés especiais extraídos em V60, bowls funcionais nutritivos e culinária asiática artesanal.",
      "consumo": "Hardware de ponta importado, periféricos ergonômicos e compras automatizadas na Amazon Prime.",
      "vestuario": "Camisetas básicas pretas de algodão pima peruano, calças chino e tênis minimalistas ecológicos.",
      "aversoes": "Processos burocráticos analógicos em papel e lojas que ainda não aceitam pagamentos por aproximação/NFC.",
      "paixoes": "Desenvolvimento de projetos open-source, trilhas de mountain bike na serra e degustação de cafés premiados."
    },
    "lugares_frequenta": [
      "Praça Ulisses Guimarães",
      "Cafeteria Torra Fresca Aquarius",
      "Parque Ribeirão Vermelho"
    ],
    "veiculos_midia": [
      "TechCrunch (@techcrunch)",
      "Podcast Startups SJC (@startups_sjc)"
    ],
    "influenciadores_seguidos": [
      "Filipe Deschamps (@filipedeschamps)",
      "Explore SJC (@exploresjc)"
    ],
    "estilo_consumo_tag": "Tech Global & Conectado",
    "foto": "data_personas/imagens_personagens/personagem_5_tiago_ramos.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_5_tiago_ramos.jpg"
  },
  {
    "id": 6,
    "nome_completo": "Dona Dirce de Lourdes Prado",
    "idade": 68,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Feirante & Doceira Tradicional Aposentada",
    "bairro": "Santana",
    "regiao": "Norte",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Caminhada diária e Ônibus municipal",
    "historia_resumida": "Filha de tecelões da antiga Tecelagem Parahyba, mora em Santana desde a infância. Produz compotas caseiras de abóbora e figo por encomenda e conhece todas as famílias do bairro.",
    "dor_da_cidade": "Sensação de esquecimento da memória histórica e cultural da zona norte em contraste com as áreas nobres da cidade.",
    "dor_pessoal": "Solidão pungente de ver a casa vazia e o temor de perder a lucidez antes de ver os netos encaminhados na vida.",
    "tensao_dramatica": "Guarda em uma lata de biscoito economias em dinheiro vivo por desconfiança cega do sistema bancário e digital.",
    "bordao": "Quem não honra a raiz esquece o gosto da própria história.",
    "habitos": {
      "alimentacao": "Comida caipira no fogão de ferro, verduras fresquinhas da feira de Santana e bolo de fubá cremoso à tarde.",
      "consumo": "Mercadinho de secos e molhados da esquina, quitanda local e farmácia onde mantém conta anotada no caderno.",
      "vestuario": "Vestidos florais rodados confortáveis, cardigãs de tricô feitos à mão e sapatos ortopédicos acolchoados.",
      "aversoes": "Totens eletrônicos impessoais em agências bancárias e atendentes jovens sem paciência com idosos.",
      "paixoes": "Participação no coral da Paróquia de Santana, cultivar orquídeas no alpendre e narrar causos antigos para os netos."
    },
    "lugares_frequenta": [
      "Parque da Cidade (Burle Marx)",
      "Igreja Matriz de Santana",
      "Feira Livre de Santana"
    ],
    "veiculos_midia": [
      "Rede Vanguarda (@redevanguarda)",
      "Rádio Nativa FM (@nativafmsjc)"
    ],
    "influenciadores_seguidos": [
      "Memória Joseense (@memoria_joseense)",
      "Padre da Paróquia Santana (@paroquiasantanasjc)"
    ],
    "estilo_consumo_tag": "Memória Afetiva & Raízes",
    "foto": "data_personas/imagens_personagens/personagem_6_dona_dirce_de_lourdes_prado.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_6_dona_dirce_de_lourdes_prado.jpg"
  },
  {
    "id": 7,
    "nome_completo": "Benedito 'Seu Dito' Alvarenga",
    "idade": 62,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Produtor de Queijo Artesanal da Mantiqueira",
    "bairro": "São Francisco Xavier",
    "regiao": "Norte",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Picape antiga 4x4 a diesel",
    "historia_resumida": "Produz queijo artesanal curado premiado em propriedade familiar em SFX. Recebe visitantes e chefs renomados que sobem a serra em busca de produtos genuínos da Mantiqueira.",
    "dor_da_cidade": "Superlotação do vilarejo nos finais de semana de inverno e instabilidade na rede elétrica rural que compromete as ordenhas.",
    "dor_pessoal": "A angústia de ver os filhos fascinados pela vida urbana de São Paulo e o peso de saber que a tradição centenária de queijo artesanal da sua família vai morrer com ele na serra.",
    "tensao_dramatica": "Reclama publicamente dos turistas paulistanos que invadem a serra, mas depende financeiramente das compras extravagantes que eles fazem aos sábados.",
    "bordao": "Tempo e paciência curam o queijo, a terra e o coração do homem.",
    "habitos": {
      "alimentacao": "Queijo curado na tábua, café passado no coador de pano com água de mina e galinha caipira com quiabo.",
      "consumo": "Arame farpado, ferramentas e ração em cooperativas agropecuárias e compras mensais de atacado na cidade.",
      "vestuario": "Botina campeira de couro legítimo, calça jeans grossa de lida e chapéu de palha de aba larga.",
      "aversoes": "Turistas barulhentos que jogam lixo nas trilhas ecológicas e desrespeitam o silêncio sagrado da serra.",
      "paixoes": "Tocar moda de viola caipira no entardecer, cavalgar pelas cristas da serra e contemplar a Pedra de São Francisco."
    },
    "lugares_frequenta": [
      "Vila de São Francisco Xavier",
      "Mirante da Pedra de São Francisco",
      "Mercado da Cidade de SJC"
    ],
    "veiculos_midia": [
      "Jornal de SFX (@sfx_noticias)",
      "Globo Rural / Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Rota Gastronômica da Mantiqueira (@rotamantiqueira)",
      "Explore SFX (@exploresfx)"
    ],
    "estilo_consumo_tag": "Sustentabilidade & Raiz Serrana",
    "foto": "data_personas/imagens_personagens/personagem_7_benedito_seu_dito_alvarenga.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_7_benedito_seu_dito_alvarenga.jpg"
  },
  {
    "id": 8,
    "nome_completo": "Dra. Letícia Rocha Figueiredo",
    "idade": 38,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Dermatologista & Gestora de Clínica Estética",
    "bairro": "Vila Adyana",
    "regiao": "Centro",
    "movimento_cultural": "A Cidade Prometida",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "SUV Compacto Blindado e Caminhada",
    "historia_resumida": "Comanda clínica estética integrada na Vila Adyana pela elegância histórica do bairro. Conecta lasers de ponta a um acolhimento intimista para pacientes da região.",
    "dor_da_cidade": "Dificuldade para atrair e reter técnicas de enfermagem estética com especialização avançada no Vale.",
    "dor_pessoal": "Cobrança estética implacável sobre sua própria imagem e o pavor obsessivo do envelhecimento enquanto vende perfeição aos outros.",
    "tensao_dramatica": "Submete-se a procedimentos estéticos invasivos periódicos em clínicas de São Paulo para que ninguém em São José saiba que ela fez intervenções.",
    "bordao": "Elegância não grita; a excelência se reconhece nos mínimos detalhes.",
    "habitos": {
      "alimentacao": "Menu funcional e orgânico, sucos verdes detox prensados e saladas gourmet com azeites trufados.",
      "consumo": "Aparelhos de ultrassom microfocado importados, cosméticos dermatológicos de alta performance e viagens a congressos.",
      "vestuario": "Blazers de corte impecável em alfaiataria off-white e sapatilhas de couro nobre.",
      "aversoes": "Procedimentos estéticos padronizados sem respaldo científico e falta de ética profissional de concorrentes.",
      "paixoes": "Sessões matinais de pilates, finais de semana ensolarados em Ilhabela e colecionismo de arte contemporânea brasileira."
    },
    "lugares_frequenta": [
      "Parque Santos Dumont",
      "Restaurantes da Av. Adhemar de Barros",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      "Vogue Brasil (@voguebrasil)",
      "Life Informa (@lifeinforma)"
    ],
    "influenciadores_seguidos": [
      "Dermatologia & Estética Brasil (@sbd_dermato)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Sofisticação & Autocuidado",
    "foto": "data_personas/imagens_personagens/personagem_8_dra_leticia_rocha_figueiredo.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_8_dra_leticia_rocha_figueiredo.jpg"
  },
  {
    "id": 9,
    "nome_completo": "Wagner Santos",
    "idade": 41,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Técnico Mecatrônico Sênior de Linha Automotiva",
    "bairro": "Jardim Augusta",
    "regiao": "Centro",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Fretado da montadora e Carro popular nos fins de semana",
    "historia_resumida": "Técnico industrial formado pelo SENAI, atua na cadeia automotiva da Dutra há quase duas décadas. Valoriza a estabilidade da casa própria e os estudos dos filhos.",
    "dor_da_cidade": "Oscilações nos turnos fabris com paradas de linha e reajustes pesados nas mensalidades do plano de saúde familiar.",
    "dor_pessoal": "Ansiedade constante de que a automação robótica avançada da montadora torne sua especialidade técnica descartável antes de se aposentar.",
    "tensao_dramatica": "Fica acordado fazendo contas de quanto faltaria para quitar a casa se conseguisse qualquer renda extra. Já começou e abandonou quatro planos diferentes, e não conta nenhum deles para a esposa.",
    "bordao": "Chão de fábrica ensina o que nenhuma teoria de escritório consegue explicar.",
    "habitos": {
      "alimentacao": "Churrasco de contrafilé no quintal de casa com os colegas de turno, pastel de feira e cerveja pilsen gelada.",
      "consumo": "Materiais de construção para ampliações na residência e compras em grandes atacarejos às margens da Dutra.",
      "vestuario": "Macacão técnico antichamas nos dias úteis e bermuda jeans com camisa polo esportiva nos fins de semana.",
      "aversoes": "Cursos rápidos de internet que prometem enriquecimento fácil e eletrodomésticos com obsolescência programada.",
      "paixoes": "Peladas de futebol society nas quadras da zona sul, mexer no motor do seu carro antigo e pescaria no Rio Paraíba."
    },
    "lugares_frequenta": [
      "Vale Sul Shopping",
      "Feira da Praça do Pq. Industrial",
      "Assaí Atacadista da Dutra"
    ],
    "veiculos_midia": [
      "Band Vale Notícias (@bandvaletv)",
      "Rádio Stereo Vale (@stereovale)"
    ],
    "influenciadores_seguidos": [
      "Mecânica Descomplicada (@mecanicadescomplicada)",
      "São José Esporte Clube (@saojoseec_oficial)"
    ],
    "estilo_consumo_tag": "Pragmático & Familiar",
    "foto": "data_personas/imagens_personagens/personagem_9_wagner_santos.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_9_wagner_santos.jpg"
  },
  {
    "id": 10,
    "nome_completo": "Gabriel Marcondes de Oliveira",
    "idade": 23,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Desenvolvedor Full Stack Júnior no Parque Tecnológico",
    "bairro": "Eugênio de Melo",
    "regiao": "Leste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Moto 160cc e Ônibus com integração",
    "historia_resumida": "Formado pela FATEC, atua em equipe ágil no Parque Tecnológico. Faz a ponte entre as origens fabris de Eugênio de Melo e o novo ecossistema digital da zona leste.",
    "dor_da_cidade": "Falta de ciclovias seguras conectando Eugênio de Melo ao PqTec e intervalos longos nas linhas de ônibus.",
    "dor_pessoal": "Culpa constante por ganhar mais que os pais juntos e a pressão esmagadora de ter que ser o 'salvador da família'.",
    "tensao_dramatica": "Copia blocos inteiros de código gerados por inteligência artificial sem entender a lógica profunda e tem pavor de ser desmascarado em code review.",
    "bordao": "Da periferia pro servidor: o código não mente.",
    "habitos": {
      "alimentacao": "Marmitas congeladas fitness durante a semana, rodízio de pizza aos sábados e energéticos nas madrugadas de código.",
      "consumo": "Teclados mecânicos RGB, cursos avançados de backend em plataformas online e calçados casuais esportivos.",
      "vestuario": "Moletons com capuz estampados com referências geeks, calças cargo pretas e tênis skate.",
      "aversoes": "Chefias autoritárias que exigem presença física desnecessária e empresas que não incentivam inovação.",
      "paixoes": "Participação em maratonas de programação (hackathons), jogos online cooperativos e manobras na pista de skate do Parque da Cidade."
    },
    "lugares_frequenta": [
      "Parque Tecnológico de SJC (PqTec)",
      "CenterVale Shopping",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      "Manual do Dev (@manualdodev)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Rocketseat (@rocketseat_oficial)",
      "Jonas Almeida (@jonas_almeida)"
    ],
    "estilo_consumo_tag": "Aspiracional Tech",
    "foto": "data_personas/imagens_personagens/personagem_10_gabriel_marcondes_de_oliveira.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_10_gabriel_marcondes_de_oliveira.jpg"
  },
  {
    "id": 11,
    "nome_completo": "Valéria Fontes",
    "idade": 42,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Arquiteta de Interiores & Cenógrafa Comercial",
    "bairro": "Jardim Aquarius",
    "regiao": "Oeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "Carro elétrico e Caminhada no bairro",
    "historia_resumida": "Desenvolve projetos comerciais e residenciais biofílicos no Aquarius e Urbanova. Garimpa novidades em feiras de design para criar ambientes acolhedores.",
    "dor_da_cidade": "Escassez de lojas de decoração autoral na cidade e prazos dilatados no fornecimento de mármores nobres.",
    "dor_pessoal": "Sensação de superficialidade existencial em atender caprichos fúteis de novos-ricos enquanto seus projetos conceituais continuam na gaveta.",
    "tensao_dramatica": "Tem fobia secreta de falência e compra roupas de marca de segunda mão em brechós escondidos fingindo tê-las adquirido em Milão.",
    "bordao": "O luxo autêntico está no espaço bem respirado, não no excesso.",
    "habitos": {
      "alimentacao": "Pratos à base de peixes frescos, risotos artesanais e degustação de espumantes nacionais premiados.",
      "consumo": "Peças de design autoral, luminárias de artistas brasileiros e softwares 3D de renderização imersiva.",
      "vestuario": "Roupas assimétricas de linho cru, óculos de armação geométrica marcante e sapatos de design exclusivo.",
      "aversoes": "Ambientes saturados de plástico sem personalidade e empreiteiros descompromissados com o acabamento fino.",
      "paixoes": "Visitar bienais de arquitetura, restaurar móveis modernistas garimpados e cuidar de sua coleção de samambaias raras."
    },
    "lugares_frequenta": [
      "Colinas Shopping",
      "Showrooms da Av. São João",
      "Parque Vicentina Aranha"
    ],
    "veiculos_midia": [
      "Casa Vogue (@casavoguebrasil)",
      "Life Informa (@lifeinforma)"
    ],
    "influenciadores_seguidos": [
      "Mauricio Arruda (@mauricioarruda)",
      "Sanja Dicas (@sanjadicas)"
    ],
    "estilo_consumo_tag": "Design & Estética Autoral",
    "foto": "data_personas/imagens_personagens/personagem_11_valeria_fontes.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_11_valeria_fontes.jpg"
  },
  {
    "id": 12,
    "nome_completo": "Kenji Takahashi",
    "idade": 36,
    "genero": "Homem",
    "raca_cor": "Asiático",
    "profissao": "Pesquisador Sênior em Satélites do INPE",
    "bairro": "Jardim das Indústrias",
    "regiao": "Oeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "Bicicleta elétrica própria e Sedan japonês",
    "historia_resumida": "Físico aeroespacial com doutorado, atua no desenvolvimento de sensores orbitais para monitoramento climático. Reside no Jardim das Indústrias pela calmaria e acesso à rodovia.",
    "dor_da_cidade": "Demora alfandegária e burocracia na importação de componentes ópticos e sensores para pesquisas espaciais.",
    "dor_pessoal": "Frustração profunda com os baixos salários da carreira acadêmica/pública no Brasil em comparação com seus ex-colegas que emigraram para a NASA ou Europa.",
    "tensao_dramatica": "Coleciona secretamente mangás raros e passa noites jogando RPG online sob anonimato total para fugir da rigidez científica.",
    "bordao": "A ciência exige método, não retórica populista.",
    "habitos": {
      "alimentacao": "Autêntica culinária japonesa tradicional (ramen e izakaya), chás verdes matcha e frutas da estação.",
      "consumo": "Livros acadêmicos importados, ferramentas de telescópio amador e instrumentos musicais acústicos.",
      "vestuario": "Camisas xadrez discretas, calças jeans escuras duráveis e tênis de caminhada impermeáveis.",
      "aversoes": "Desinformação científica nas redes sociais e reuniões longas sem pauta prévia definida.",
      "paixoes": "Astrofotografia noturna nas montanhas de SFX, tocar violão clássico e marcenaria de precisão nos dias livres."
    },
    "lugares_frequenta": [
      "Campus do INPE",
      "Praça das Indústrias",
      "Restaurante Tradicional no Centro"
    ],
    "veiculos_midia": [
      "Nature Scientific (@nature)",
      "CBN Vale (@cbnvale)"
    ],
    "influenciadores_seguidos": [
      "Sérgio Sacani (@spacetoday1)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Científico & Racional",
    "foto": "data_personas/imagens_personagens/personagem_12_kenji_takahashi.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_12_kenji_takahashi.jpg"
  },
  {
    "id": 13,
    "nome_completo": "Claudete Aparecida da Silva",
    "idade": 59,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Costureira Especialista em Reformas & Alta Costura",
    "bairro": "Alto da Ponte",
    "regiao": "Norte",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Ônibus municipal e Deslocamento a pé",
    "historia_resumida": "Trabalha com costura há mais de quatro décadas, atendendo noivas e alfaiataria fina. Recebe clientes de várias regiões da cidade que sobem a ponte buscando seu ajuste perfeito.",
    "dor_da_cidade": "Dores lombares causadas por longas horas diante da máquina de costura e a alta nos preços de tecidos e aviamentos.",
    "dor_pessoal": "Tristeza silenciosa de ter dedicado a juventude a criar filhos que raramente atravessam a ponte para visitá-la.",
    "tensao_dramatica": "Guarda em segredo um vestido de noiva suntuoso que costurou para si mesma há 30 anos e nunca teve a chance de usar.",
    "bordao": "Ponto bem dado não desmancha nem com o peso dos anos.",
    "habitos": {
      "alimentacao": "Arroz, feijão fresquinho, couve refogada na hora e suco natural de maracujá para relaxar à noite.",
      "consumo": "Armarinhos e retrosarias tradicionais no centro de SJC e manutenção preventiva em suas máquinas industriais.",
      "vestuario": "Roupas confortáveis confeccionadas por ela mesma com tecidos florais e aventais com bolsos utilitários.",
      "aversoes": "Roupas descartáveis de fast-fashion com costuras frágeis e clientes que pedem fiado sem intimidade.",
      "paixoes": "Participar das novenas da comunidade do Alto da Ponte, ensinar corte e costura para meninas do bairro e ouvir rádio AM."
    },
    "lugares_frequenta": [
      "Centro Comunitário do Alto da Ponte",
      "Armarinhos da Rua 15 no Centro",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      "Rádio Aparecida (@radioaparecida)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Dicas de Costura Brasil (@costuracriativa)",
      "Explore SJC (@exploresjc)"
    ],
    "estilo_consumo_tag": "Artesanal & Essencial",
    "foto": "data_personas/imagens_personagens/personagem_13_claudete_aparecida_da_silva.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "dor_pessoal_despatologizada"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_13_claudete_aparecida_da_silva.jpg"
  },
  {
    "id": 14,
    "nome_completo": "Heloísa Castilho",
    "idade": 33,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Gestora de Tráfego Pago & Marketing Digital",
    "bairro": "Jardim Esplanada",
    "regiao": "Oeste",
    "movimento_cultural": "A Cidade Prometida",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Carro hatch turbo e Uber",
    "historia_resumida": "Conduz campanhas de mídia de performance para redes de varejo e imobiliárias de médio e grande porte. Divide seu tempo entre visitas a clientes e gestão remota.",
    "dor_da_cidade": "Variações bruscas no custo por aquisição (CPA) causadas por mudanças repentinas nas plataformas de anúncios.",
    "dor_pessoal": "Incapacidade crônica de desconectar a mente do trabalho, arruinando qualquer possibilidade de relacionamento amoroso estável.",
    "tensao_dramatica": "Finge para as clientes que tem uma equipe gigante de analistas, mas na verdade opera tudo sozinha na mesa da sala até às 3h da manhã.",
    "bordao": "Não adianta botar mil reais de anúncio se o cliente clica, entra no WhatsApp e ninguém responde direito.",
    "habitos": {
      "alimentacao": "Smoothies energéticos com whey protein, pães de fermentação natural e almoços em bistrôs charmosos.",
      "consumo": "Softwares de automação de marketing em dólar, cursos de mentoria executiva e acessórios de ergonomia.",
      "vestuario": "Estilo smart casual elegante, blazers coloridos estruturados e bolsas de couro legítimo de marcas locais.",
      "aversoes": "Clientes retrógrados que não compreendem a importância do funil de vendas digital e relatórios vagos.",
      "paixoes": "Prática de beach tennis nas quadras do Urbanova, viagens de praia nos feriados e podcasts de negócios."
    },
    "lugares_frequenta": [
      "Colinas Shopping",
      "Arena de Beach Tennis Urbanova",
      "Cafeteria da Av. Anchieta"
    ],
    "veiculos_midia": [
      "Meon Jornal (@meonjornal)",
      "Life Informa (@lifeinforma)"
    ],
    "influenciadores_seguidos": [
      "Pedro Sobral (@pedrosobral)",
      "Sanja Dicas (@sanjadicas)"
    ],
    "estilo_consumo_tag": "Performance & Inovação",
    "foto": "data_personas/imagens_personagens/personagem_14_heloisa_castilho.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_14_heloisa_castilho.jpg"
  },
  {
    "id": 15,
    "nome_completo": "Wellington 'Well' Prates",
    "idade": 27,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Chef & Proprietário de Hamburgueria Artesanal",
    "bairro": "Parque Industrial",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Utilitário furgão e Moto própria",
    "historia_resumida": "Criou uma hamburgueria de delivery forte na zona sul, focada em carnes defumadas e smash burgers. Cuida pessoalmente das compras e da logística de entrega rápida.",
    "dor_da_cidade": "Comissões elevadas retidas pelas plataformas de delivery e a escalada de preços de queijos e insumos nobres.",
    "dor_pessoal": "Medo asfixiante de falir o negócio próprio e a vergonha de ter que voltar a trabalhar como auxiliar de cozinha subordinado.",
    "tensao_dramatica": "O 'molho secreto' premiado da sua hamburgueria tem como base uma maionese industrial comum comprada no atacado misturada com condimentos.",
    "bordao": "Hambúrguer de verdade tem fumaça, crosta e respeito pelo cliente.",
    "habitos": {
      "alimentacao": "Degustação contínua de hambúrgueres autorais, porções de batata rústica com páprica e refrigerantes artesanais.",
      "consumo": "Insumos gastronômicos em distribuidoras especializadas e embalagens térmicas sustentáveis de papel kraft.",
      "vestuario": "Camisetas pretas estampadas com sua marca, dólmã de sarja moderna e bonés aba reta.",
      "aversoes": "Entregadores terceirizados que derrubam os pedidos no transporte e avaliações injustas em plataformas online.",
      "paixoes": "Estudar técnicas de defumação texana no pit smoker, assistir a reality shows de gastronomia e jogar futebol com amigos."
    },
    "lugares_frequenta": [
      "Avenida Bacabal",
      "Atacadão da Zona Sul",
      "Shopping Jardim Oriente"
    ],
    "veiculos_midia": [
      "Diário de SJC (@diariodesjc)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "influenciadores_seguidos": [
      "Netão Bom Beef (@netaobombeef)",
      "Bora Comer SJC (@boracomersjc)"
    ],
    "estilo_consumo_tag": "Gastronomia & Corre Comercial",
    "foto": "data_personas/imagens_personagens/personagem_15_wellington_well_prates.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_15_wellington_well_prates.jpg"
  },
  {
    "id": 16,
    "nome_completo": "Osvaldo Martins Ferraz",
    "idade": 64,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Mestre de Obras da Construção Civil",
    "bairro": "Jardim das Indústrias",
    "regiao": "Oeste",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Picape média a diesel",
    "historia_resumida": "Comanda equipes em obras residenciais e comerciais em SJC há quarenta anos. Conhece a topografia de cada colina e loteamento da cidade.",
    "dor_da_cidade": "Falta de jovens dedicados a aprender carpintaria e alvenaria estrutural com esmero técnico e responsabilidade.",
    "dor_pessoal": "O medo de perder o respeito dos pedreiros mais jovens e a sensação de inutilidade ao ver mestres práticos sendo substituídos por softwares e engenheiros que nunca pegaram numa colher de alvenaria.",
    "tensao_dramatica": "Pede para a filha ler e responder os orçamentos que chegam por mensagem. Disfarça dizendo que está com a vista ruim, mas o que o incomoda de verdade é depender de alguém para uma coisa que todo mundo mais novo faz sozinho.",
    "bordao": "Na alvenaria não adianta enganar: se estiver fora de prumo, a parede cai.",
    "habitos": {
      "alimentacao": "Marmita reforçada com feijão tropeiro e bife na chapa, café forte com açúcar e paçoca na sobremesa.",
      "consumo": "Ferramentas profissionais de alta durabilidade em lojas tradicionais de ferragens e peças automotivas originais.",
      "vestuario": "Camisas de manga longa de algodão grosso para proteção solar, calça jeans pesada e botas de segurança com bico de aço.",
      "aversoes": "Projetos de engenharia desenhados no computador que não consideram as dificuldades práticas da obra real.",
      "paixoes": "Pescar no Rio Paraíba do Sul nas tardes de domingo, ouvir modas de viola e cuidar dos seus pássaros no quintal."
    },
    "lugares_frequenta": [
      "Lojas de Ferragens do Centro",
      "Parque da Cidade",
      "Feira da Vila Nova São José"
    ],
    "veiculos_midia": [
      "Jornal O Vale (@jornalovale)",
      "Rádio Nativa FM (@nativafmsjc)"
    ],
    "influenciadores_seguidos": [
      "Dicas de Obra do Mestre (@obramestre)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Experiência Prática & Raiz",
    "foto": "data_personas/imagens_personagens/personagem_16_osvaldo_martins_ferraz.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_16_osvaldo_martins_ferraz.jpg"
  },
  {
    "id": 17,
    "nome_completo": "Nayara 'Nai' Santos Neves",
    "idade": 26,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Barista & Consultora de Cafés Especiais",
    "bairro": "Vila Ema",
    "regiao": "Centro",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Bicicleta urbana vintage e Ônibus municipal",
    "historia_resumida": "Formada em gastronomia e barista profissional, treina equipes de cafeterias em SJC e ensina a apreciar microlotes da Mantiqueira sem açúcar.",
    "dor_da_cidade": "Prevalência da cultura do café torrado escuro carbonizado que bloqueia a valorização da produção regional.",
    "dor_pessoal": "Sensação sufocante de não pertencer a nenhum lugar: considerada 'esnobe demais' na periferia onde nasceu e 'alternativa demais' na elite da Vila Ema.",
    "tensao_dramatica": "Quando está exausta de madrugada em casa, toma café solúvel instantâneo com açúcar branco para desespero de seu purismo gastronômico.",
    "bordao": "Café especial não precisa de açúcar; precisa de paladar desperto.",
    "habitos": {
      "alimentacao": "Torradas artesanais de sourdough com avocado, ovos pochê e infusões botânicas com especiarias.",
      "consumo": "Métodos manuais de extração (Aeropress, Chemex), filtros japoneses e livros técnicos de microbiologia do café.",
      "vestuario": "Aventais de sarja com tiras de couro marrom, calças de veludo cotelê e meias estampadas divertidas.",
      "aversoes": "Cafés comerciais servidos em copos plásticos finos e açúcar adicionado sem consentimento na xícara.",
      "paixoes": "Visitar fazendas produtoras no Sul de Minas e na Serra da Mantiqueira, garimpar xícaras de cerâmica e fotografia analógica."
    },
    "lugares_frequenta": [
      "Cafeterias da Vila Ema e Betânia",
      "Parque Vicentina Aranha",
      "Sesc São José dos Campos"
    ],
    "veiculos_midia": [
      "Revista Espresso (@revistaespresso)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Boram Um (@boramum)",
      "Sanja Dicas (@sanjadicas)"
    ],
    "estilo_consumo_tag": "Sensorial & Artesanal Nobre",
    "foto": "data_personas/imagens_personagens/personagem_17_nayara_nai_santos_neves.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_17_nayara_nai_santos_neves.jpg"
  },
  {
    "id": 18,
    "nome_completo": "Carlos Eduardo 'Cadu' Peixoto",
    "idade": 35,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Engenheiro de Estruturas Aeronáuticas da Embraer",
    "bairro": "DCTA",
    "regiao": "Sudeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "Sedan Híbrido e Patinete elétrico no campus",
    "historia_resumida": "Formado pelo ITA, trabalha em compósitos avançados para fuselagens de aviões comerciais. Mora no complexo aeroespacial e valoriza a convivência técnica e científica.",
    "dor_da_cidade": "Incertezas no orçamento de projetos aeroespaciais de longo prazo e assédio de empresas do exterior.",
    "dor_pessoal": "Obsessão maníaca por controle e perfeccionismo que o torna incapaz de tolerar erros mínimos em si mesmo e nos colegas.",
    "tensao_dramatica": "Tem pavor de turbulência e não contou isso a nenhum colega em quinze anos projetando fuselagem. Escolhe voos mais longos só para evitar as rotas que sabe que balançam.",
    "bordao": "Lá em cima, a dez mil metros de altura, nenhum parafuso pode ter dúvida se aguenta o tranco.",
    "habitos": {
      "alimentacao": "Pratos ricos em proteínas magras, gastronomia contemporânea nos finais de semana e vinhos chilenos da uva Carménère.",
      "consumo": "Drones com câmera 4K, relógios analógicos com cronógrafo de aviação e assinaturas de periódicos científicos aeroespaciais.",
      "vestuario": "Camisas polo azul-marinho de algodão mercerizado, calças chino cáqui e jaquetas corta-vento de aviação.",
      "aversoes": "Cortes de investimentos na educação científica de base e falta de visão de longo prazo em políticas industriais.",
      "paixoes": "Pilotar aeromodelos com os colegas no DCTA, velejar na Represa de Igaratá e leitura de ficção científica clássica."
    },
    "lugares_frequenta": [
      "Clube dos Oficiais do DCTA",
      "MAB (Memorial Aeroespacial)",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      "Aviation Week (@aviationweek)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Lito Sousa (@avioesemusicas)",
      "ITA Oficial (@ita_oficial)"
    ],
    "estilo_consumo_tag": "Tecnológico & Aeroespacial",
    "foto": "data_personas/imagens_personagens/personagem_18_carlos_eduardo_cadu_peixoto.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_18_carlos_eduardo_cadu_peixoto.jpg"
  },
  {
    "id": 19,
    "nome_completo": "Aline Moreira Siqueira",
    "idade": 31,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Personal Trainer & Coach de Treinamento Funcional",
    "bairro": "Jardim Satélite",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Carro hatch econômico e Moto scooter",
    "historia_resumida": "Treinadora física com estúdio perto da Av. Andrômeda, focada em condicionamento funcional e saúde postural de mulheres da zona sul.",
    "dor_da_cidade": "Desistência precoce de alunas que procuram emagrecimento rápido sem regularidade e disciplina aos treinos.",
    "dor_pessoal": "Sustenta o próprio corpo como principal argumento de venda do negócio e não tem um só dia de folga dessa vitrine.",
    "tensao_dramatica": "Vende disciplina o dia inteiro e chega em casa sem nenhuma sobrando para si mesma. Tem dias em que o próprio corpo, que é sua vitrine de trabalho, é a última coisa que ela quer olhar no espelho.",
    "bordao": "A preguiça você deixa na porta; aqui dentro é consistência que paga o espelho.",
    "habitos": {
      "alimentacao": "Refeições equilibradas pesadas na balança, suplementação vitamínica personalizada e água de coco fresca.",
      "consumo": "Equipamentos de treinamento funcional de borracha vulcanizada, smartbands e calçados específicos de Cross Training.",
      "vestuario": "Conjuntos fitness de alta compressão sem costura, jaquetas corta-vento leves e viseiras de corrida.",
      "aversoes": "Fórmulas mágicas de emagrecimento sem base científica e academias desorganizadas com aparelhos quebrados.",
      "paixoes": "Participar de meias maratonas de rua em SJC, treinar nas escadarias do Parque da Cidade e cozinhar receitas fit."
    },
    "lugares_frequenta": [
      "Pista de Caminhada da Av. Andrômeda",
      "Vale Sul Shopping",
      "Praça do Centenário"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Carol Borba (@carolborba1)",
      "Jonas Almeida (@jonas_almeida)"
    ],
    "estilo_consumo_tag": "Fitness & Saúde Ativa",
    "foto": "data_personas/imagens_personagens/personagem_19_aline_moreira_siqueira.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica",
        "dor_pessoal_despatologizada"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_19_aline_moreira_siqueira.jpg"
  },
  {
    "id": 20,
    "nome_completo": "Renato Guimarães Prado",
    "idade": 48,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Gerente Geral de Concessionária de Veículos",
    "bairro": "Floradas de São José",
    "regiao": "Sul",
    "movimento_cultural": "A Cidade Prometida",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Sedan executivo da concessionária",
    "historia_resumida": "Gerencia vendas de veículos seminovos e novos no polo da Dutra, negociando com moradores e frotistas da região metropolitana do Vale.",
    "dor_da_cidade": "Oscilações nas taxas de juros automotivas que travam o crédito bancário de potenciais compradores.",
    "dor_pessoal": "Terror paralisante de perder o status social e o cargo executivo em um mercado que demite homens de meia-idade sem cerimônia.",
    "tensao_dramatica": "Deve condomínio há meses no prédio de luxo onde mora para sustentar a aparência que o cargo exige. Sabe que o carro da empresa é a única coisa nova na vida dele.",
    "bordao": "O cliente entra procurando motor, mas compra o brilho da pintura e o cheirinho de novo no painel.",
    "habitos": {
      "alimentacao": "Almoços de negócios em churrascarias de alto padrão, grelhados nobres e cervejas artesanais do estilo IPA.",
      "consumo": "Acessórios automotivos homologados de fábrica, relógios de marcas suíças e investimentos em imóveis comerciais.",
      "vestuario": "Ternos italianos sem gravata, camisas sociais sob medida e sapatos de couro legítimo com solado duplo.",
      "aversoes": "Vendedores despreparados que não conhecem a ficha técnica do produto e promessas comerciais não honradas.",
      "paixoes": "Participar de track days em autódromos aos sábados, churrasco gourmet para amigos e assistir à Fórmula 1 aos domingos."
    },
    "lugares_frequenta": [
      "Vale Sul Shopping",
      "Praça das Floradas",
      "Restaurantes da Av. Cidade Jardim"
    ],
    "veiculos_midia": [
      "AutoEsporte Globo (@autoesporte)",
      "CBN Vale (@cbnvale)"
    ],
    "influenciadores_seguidos": [
      "Acelerados (@acelerados)",
      "Beto Oliver (@betooliver)"
    ],
    "estilo_consumo_tag": "Automotivo & Negócios",
    "foto": "data_personas/imagens_personagens/personagem_20_renato_guimaraes_prado.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_20_renato_guimaraes_prado.jpg"
  },
  {
    "id": 21,
    "nome_completo": "Beatriz 'Bia' Mendonça",
    "idade": 22,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Estudante de Odontologia na UNESP",
    "bairro": "Jardim São Dimas",
    "regiao": "Centro",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Caminhada a pé e Ônibus intermunicipal",
    "historia_resumida": "Estudante de odontologia, divide apartamento no São Dimas pela facilidade de caminhar até a faculdade e compartilha rotinas de estudos nas redes.",
    "dor_da_cidade": "Custo muito alto das listas de materiais e instrumentais odontológicos cobrados em cada semestre da graduação.",
    "dor_pessoal": "Insegurança paralisante sobre sua vocação real e a vergonha de estar endividando os pais do interior para bancar os instrumentais da faculdade.",
    "tensao_dramatica": "Tem fobia profunda de agulhas e sangue, passando mal em segredo no banheiro após os primeiros procedimentos práticos na clínica universitária.",
    "bordao": "Um sorriso alinhado abre portas que nenhum diploma consegue abrir.",
    "habitos": {
      "alimentacao": "Marmitas congeladas da mãe, café gelado em copos térmicos entre as aulas e açaí com granola na Praça São Dimas.",
      "consumo": "Materiais odontológicos profissionais em dentais do centro, maquiagem cruelty-free e livros técnicos de anatomia.",
      "vestuario": "Scrubs cirúrgicos coloridos estilizados na faculdade e roupas casuais jovens confortáveis nos finais de semana.",
      "aversoes": "Professores autoritários sem empatia pedagógica e clínicas que utilizam materiais de baixa qualidade.",
      "paixoes": "Criar vídeos educativos de saúde bucal para jovens, passear pelas feirinhas de artesanato e piqueniques no Vicentina."
    },
    "lugares_frequenta": [
      "Campus da UNESP",
      "Praça Monsenhor Ascânio Brandão",
      "Parque Vicentina Aranha"
    ],
    "veiculos_midia": [
      "G1 Vale do Paraíba (@g1valeparaiba)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Universitária & Criativa",
    "foto": "data_personas/imagens_personagens/personagem_21_beatriz_bia_mendonca.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_21_beatriz_bia_mendonca.jpg"
  },
  {
    "id": 22,
    "nome_completo": "Sebastião 'Tião' Ribeiro",
    "idade": 66,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Operador de Caminhão Pipa & Vias Rurais",
    "bairro": "Bairro dos Freitas",
    "regiao": "Norte",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe D",
    "meio_transporte_principal": "Caminhão pipa de serviço e Moto 125cc antiga",
    "historia_resumida": "Realiza serviços de entrega de água potável em propriedades rurais e nivelamento de estradas de terra na zona norte há mais de 35 anos.",
    "dor_da_cidade": "Poeira excessiva nos períodos de seca prolongada e falta de conservação das pontes de madeira vicinais.",
    "dor_pessoal": "A solidão asfixiante da casa vazia após o falecimento da esposa e a sensação de ser um fantasma do passado numa zona norte que se urbaniza depressa demais.",
    "tensao_dramatica": "Guarda um ressentimento silencioso dos novos sitiantes ricos que cercaram as nascentes antigas, mas finge subserviência para não perder os bicos de manutenção.",
    "bordao": "Água e respeito não se nega a nenhuma alma viva.",
    "habitos": {
      "alimentacao": "Arroz com feijão gordo, torresmo crocante, farinha de milho caipira e café bem doce passado na hora.",
      "consumo": "Peças de reposição para motores diesel em oficinas locais e calçados resistentes para trabalho pesado.",
      "vestuario": "Camisa xadrez de flanela, calça jeans surrada pelo trabalho e chapéu de feltro tradicional.",
      "aversoes": "Gente arrogante da cidade grande que desdenha do modo de vida e da sabedoria simples do homem do campo.",
      "paixoes": "Participar de cavalgadas tropeiras no Bairro dos Freitas, cuidar da sua horta de couve e ouvir modão sertanejo no rádio de pilha."
    },
    "lugares_frequenta": [
      "Santo Expedito no Bairro dos Freitas",
      "Bar do Ponto na SP-50",
      "Mercado Municipal"
    ],
    "veiculos_midia": [
      "Rádio Nativa FM (@nativafmsjc)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Voz do Campo SJC (@vozesdocampo)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Trabalho Pesado & Tradição Rural",
    "foto": "data_personas/imagens_personagens/personagem_22_sebastiao_tiao_ribeiro.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_22_sebastiao_tiao_ribeiro.jpg"
  },
  {
    "id": 23,
    "nome_completo": "Priscila Alencar",
    "idade": 39,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Manicure & Proprietária de Esmalteria de Bairro",
    "bairro": "Jardim Colonial",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Ônibus municipal e Carro popular financiado",
    "historia_resumida": "Montou salão de estética e unhas na avenida principal do Jardim Colonial, gerando emprego para duas vizinhas do próprio bairro.",
    "dor_da_cidade": "Alta de aluguel comercial e atrasos na entrega de insumos cosméticos comprados em distribuidoras.",
    "dor_pessoal": "Sobrecarga mental como mãe solo de dois pré-adolescentes e o medo de adoecer e não ter quem coloque comida na mesa.",
    "tensao_dramatica": "Sabe todos os segredos comprometedores das famílias ricas da região sul através das conversas de salão, mas teme retaliação se falar demais.",
    "bordao": "No meu salão a mulher entra cansada e sai pronta pra governar o mundo.",
    "habitos": {
      "alimentacao": "Marmita caseira caprichada levada para o salão, lanches rápidos entre atendimentos e refrigerante diet.",
      "consumo": "Esmaltes hipoalergênicos profissionais no atacado, cosméticos para os pés e compras na feira dominical do Colonial.",
      "vestuario": "Macacões pretos elegantes com detalhes dourados e calçados ortopédicos estilosos para aguentar o dia em pé.",
      "aversoes": "Fornecedores que atrasam a entrega de insumos essenciais e fofocas no ambiente de trabalho.",
      "paixoes": "Participar da feira de domingo do Colonial com a família, assistir séries de suspense e cantar no coral da igreja."
    },
    "lugares_frequenta": [
      "Comércio do Jardim Colonial",
      "Supermercado Nagumo",
      "Shopping Jardim Oriente"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "Portal Meon (@meonjornal)"
    ],
    "influenciadores_seguidos": [
      "Juliana Nails SJC (@juliananails_sjc)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Beleza & Liderança Local",
    "foto": "data_personas/imagens_personagens/personagem_23_priscila_alencar.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_23_priscila_alencar.jpg"
  },
  {
    "id": 24,
    "nome_completo": "Douglas 'Dodô' Nogueira",
    "idade": 25,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Instalador de Painéis Solares & Eletricista",
    "bairro": "Bosque dos Eucaliptos",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Picape utilitária leve com bagageiro de escada",
    "historia_resumida": "Executa montagem de sistemas fotovoltaicos em residências e pequenos galpões na região sul e leste da cidade.",
    "dor_da_cidade": "Atrasos burocráticos na vistoria e liberação de medidores bidirecionais pela concessionária de energia.",
    "dor_pessoal": "Pavor de altura e vertigem que precisa engolir todos os dias ao subir nos telhados sob pena de perder o sustento.",
    "tensao_dramatica": "Levou um susto sério numa instalação e não contou para ninguém, com medo de perder contrato. Desde então sobe em todo telhado com um nó no estômago que aprendeu a esconder atrás de conversa fiada.",
    "bordao": "Energia limpa no teto e dinheiro honesto no bolso.",
    "habitos": {
      "alimentacao": "Almoço comercial de farto buffet livre, isotônicos durante as instalações e pizza com a namorada no domingo.",
      "consumo": "Cabos solares de alta condutividade, ferramentas elétricas profissionais de impacto e equipamentos de proteção em altura (EPI).",
      "vestuario": "Camisas térmicas com proteção UV de manga longa, calças reforçadas de ripstop e botas com sola antiderrapante.",
      "aversoes": "Instaladores amadores que fazem ligações elétricas perigosas sem seguir as normas da ABNT.",
      "paixoes": "Aprender sobre novas tecnologias de baterias de lítio, andar de kart aos sábados e churrasco com os amigos de infância."
    },
    "lugares_frequenta": [
      "Avenida Ouro Fino",
      "Shopping Jardim Oriente",
      "Vale Sul Shopping"
    ],
    "veiculos_midia": [
      "Diário de SJC (@diariodesjc)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Netão Bom Beef (@netaobombeef)",
      "Bora Comer SJC (@boracomersjc)"
    ],
    "estilo_consumo_tag": "Técnico Solar & Autonomia",
    "foto": "data_personas/imagens_personagens/personagem_24_douglas_dodo_nogueira.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_24_douglas_dodo_nogueira.jpg"
  },
  {
    "id": 25,
    "nome_completo": "Wesley Nascimento",
    "idade": 21,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Entregador de Aplicativo em Duas Rodas",
    "bairro": "Conjunto Dom Pedro I",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe D",
    "meio_transporte_principal": "Moto 160cc financiada",
    "historia_resumida": "Roda mais de 100 km por dia entregando refeições do almoço à madrugada em todas as regiões da cidade com seu baú térmico.",
    "dor_da_cidade": "Motoristas imprudentes no trânsito, tarifa baixa paga pelos aplicativos e desvalorização da categoria.",
    "dor_pessoal": "Terror de sofrer um acidente grave no trânsito e deixar a moto apreendida por parcelas atrasadas, ficando sem fonte de renda.",
    "tensao_dramatica": "Sonha em ser produtor de funk e MC, gravando rimas escondido no banheiro dos postos de gasolina nos intervalos de entregas.",
    "bordao": "O asfalto é duro, mas a minha fé é blindada.",
    "habitos": {
      "alimentacao": "Marmita rápida nos pontos de apoio de entregadores, lanches no capricho e suco de laranja bem gelado.",
      "consumo": "Pneus de moto de alta aderência, baús impermeáveis reforçados, jaquetas térmicas e suportes de celular antivibração.",
      "vestuario": "Jaqueta de motoqueiro com proteções nos ombros e cotovelos, luvas reforçadas e capacete fechado com viseira espelhada.",
      "aversoes": "Condomínios fechados que tratam entregadores com desrespeito ou exigem caminhadas longas a pé no sol.",
      "paixoes": "Participar de passeios de motociclistas pelas curvas da serra no fim de semana, churrasco com a família e futebol society."
    },
    "lugares_frequenta": [
      "Postos da Av. Bacabal",
      "Shopping Jardim Oriente",
      "Praça do Dom Pedro I"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "012 News (@012news)"
    ],
    "influenciadores_seguidos": [
      "MC Paiva (@mcpaiva)",
      "Trolando SJC (@trollandosaojose)"
    ],
    "estilo_consumo_tag": "Corre Urbano & Juventude",
    "foto": "data_personas/imagens_personagens/personagem_25_wesley_nascimento.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_25_wesley_nascimento.jpg"
  },
  {
    "id": 26,
    "nome_completo": "Marcio Souza e Silva",
    "idade": 50,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Operador de Torno Mecânico & Usinagem",
    "bairro": "Chácaras Reunidas",
    "regiao": "Sul",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Ônibus da linha industrial e Moto antiga",
    "historia_resumida": "Atua na ferramentaria de peças técnicas para indústrias automotivas e aeroespaciais sediadas nas Chácaras Reunidas.",
    "dor_da_cidade": "Falta de incentivo a cursos técnicos de torno convencional para a juventude que só busca o digital.",
    "dor_pessoal": "O ressentimento silencioso de ver o saber artesanal de três décadas ser reduzido a um botão de torno CNC, sentindo que sua inteligência com o metal perdeu o valor para a nova indústria.",
    "tensao_dramatica": "Ensinou a usar o torno metade dos engenheiros que hoje passam por ele sem cumprimentar. Guarda uma lista mental de erros de projeto que ele previu e ninguém quis ouvir — e a satisfação amarga de estar certo em todos.",
    "bordao": "Um décimo de milímetro separa a perfeição do refugo total.",
    "habitos": {
      "alimentacao": "Comida de restaurante caseiro no polo industrial, marmita reforçada e café preto com bolacha no intervalo da fábrica.",
      "consumo": "Ferramentas de medição micrométrica (paquímetros digitais, micrômetros) e melhorias na oficina.",
      "vestuario": "Camisa polo industrial com o bolso frontal para caneta e óculos de proteção graduados.",
      "aversoes": "Engenheiros recém-formados que ignoram a experiência prática dos torneiros mecânicos veteranos.",
      "paixoes": "Restaurar motores de motocicletas clássicas nos finais de semana e passar tardes de domingo em família."
    },
    "lugares_frequenta": [
      "Polo Industrial das Chácaras Reunidas",
      "Vale Sul Shopping",
      "Mercado Municipal de SJC"
    ],
    "veiculos_midia": [
      "Rádio Band Vale (@bandvaletv)",
      "Rádio Nativa FM (@nativafmsjc)"
    ],
    "influenciadores_seguidos": [
      "Mecânica Descomplicada (@mecanicadescomplicada)",
      "São José EC (@saojoseec_oficial)"
    ],
    "estilo_consumo_tag": "Industrial & Precisão",
    "foto": "data_personas/imagens_personagens/personagem_26_marcio_souza_e_silva.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_26_marcio_souza_e_silva.jpg"
  },
  {
    "id": 27,
    "nome_completo": "Tatiane 'Tati' Camargo",
    "idade": 34,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Nutricionista Clínica e Atendimento Domiciliar",
    "bairro": "Jardim Satélite",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Carro hatch econômico e Deslocamento a pé",
    "historia_resumida": "Atende famílias e idosos na zona sul orientando alimentação saudável para controle de glicemia e hipertensão.",
    "dor_da_cidade": "Preços elevados de alimentos frescos e mitos alimentares sem embasamento propagados em redes sociais.",
    "dor_pessoal": "Frustração de ter que vender 'emagrecimento milagroso' nas redes sociais para pagar as contas, traindo sua crença em nutrição comportamental.",
    "tensao_dramatica": "Julga com profundo desprezo os hábitos alimentares de suas amigas em jantares sociais, fingindo naturalidade enquanto calcula mentalmente as calorias de cada prato na mesa.",
    "bordao": "Comida de verdade nutre a célula e acalma a alma.",
    "habitos": {
      "alimentacao": "Superalimentos, sementes de chia e linhaça dourada, kombuchas artesanais e vegetais orgânicos da feira de SJC.",
      "consumo": "Artigos de bioimpedância de precisão, suplementos importados com laudo de pureza e cursos de nutrigenômica.",
      "vestuario": "Roupas casuais refinadas em tecidos sustentáveis e jaleco estilizado em linho verde-oliva.",
      "aversoes": "Alimentos ultraprocessados com excesso de corantes artificiais e clientes que não seguem o plano alimentar proposto.",
      "paixoes": "Corridas no Parque Vicentina Aranha aos domingos pela manhã, cozinhar pratos funcionais e yoga ao ar livre."
    },
    "lugares_frequenta": [
      "Feira Livre do Jardim Satélite",
      "Vale Sul Shopping",
      "Parque Ribeirão Vermelho"
    ],
    "veiculos_midia": [
      "Portal G1 Vale (@g1valeparaiba)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Saúde Integrativa & Equilíbrio",
    "foto": "data_personas/imagens_personagens/personagem_27_tatiane_tati_camargo.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_27_tatiane_tati_camargo.jpg"
  },
  {
    "id": 28,
    "nome_completo": "Rodrigo 'Digão' Barbosa",
    "idade": 30,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Eletricista Instalador Predial e Residencial",
    "bairro": "Campo dos Alemães",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Moto com caixa lateral de ferramentas",
    "historia_resumida": "Faz manutenções elétricas residenciais na zona sul, atendendo chamados pelo WhatsApp com rapidez e preço justo.",
    "dor_da_cidade": "Clientes que improvisam fiações clandestinas perigosas e tentam negociar valores abaixo do custo de segurança.",
    "dor_pessoal": "Insegurança financeira crônica: semanas com muito dinheiro no bolso seguidas por semanas sem nenhum chamado de emergência.",
    "tensao_dramatica": "Tem pavor de cobras e aranhas em forros de telhado, já tendo pulado de uma laje e quebrado ferramentas por causa de um rato.",
    "bordao": "Com eletricidade você só erra uma vez; faça certo de primeira.",
    "habitos": {
      "alimentacao": "Almoço comercial nos bairros onde está trabalhando, lanches de rua no fim de tarde e refrigerante bem gelado.",
      "consumo": "Alicates amperímetros de marca renomada, disjuntores de qualidade e fios de cobre normatizados.",
      "vestuario": "Camiseta pólo com logotipo da sua empresa, calça jeans reforçada e botinas com isolamento elétrico de 1000V.",
      "aversoes": "Materiais elétricos falsificados vendidos em depósitos clandestinos e calotes de clientes desonestos.",
      "paixoes": "Aprender sobre automação residencial inteligente (Alexa), jogar videogame nas horas vagas e churrasco em família."
    },
    "lugares_frequenta": [
      "Depósitos de construção da Zona Sul",
      "Shopping Jardim Oriente",
      "Praça do Campo dos Alemães"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "TV Thathi (@tvthathi)"
    ],
    "influenciadores_seguidos": [
      "Trolando SJC (@trollandosaojose)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Técnico Prático & Confiança",
    "foto": "data_personas/imagens_personagens/personagem_28_rodrigo_digao_barbosa.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_28_rodrigo_digao_barbosa.jpg"
  },
  {
    "id": 29,
    "nome_completo": "Vera Lúcia Bittencourt",
    "idade": 61,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Professora de Educação Básica Aposentada",
    "bairro": "Monte Castelo",
    "regiao": "Centro",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Ônibus municipal e Caminhada",
    "historia_resumida": "Dedicou 32 anos ao ensino fundamental na rede pública de São José. Hoje participa de grupos de leitura e caminhadas matinais.",
    "dor_da_cidade": "Fechamento de livrarias físicas de rua e a proliferação de calçadas esburacadas que dificultam caminhar no centro.",
    "dor_pessoal": "Sensação lancinante de irrelevância social após sair da sala de aula e o afastamento dos parentes jovens viciados em telas.",
    "tensao_dramatica": "É viciada em compras por catálogos de TV e telemarketing, acumulando caixas lacradas de utensílios inúteis no quarto de hóspedes.",
    "bordao": "A educação é a única revolução que não derrama sangue.",
    "habitos": {
      "alimentacao": "Café com leite e torradas pela manhã, sopas caseiras leves à noite e frutas frescas da quitanda do Monte Castelo.",
      "consumo": "Livros clássicos e contemporâneos em sebos e livrarias, peças de teatro e assinaturas de jornais impressos.",
      "vestuario": "Cardigãs elegantes de lã, echarpes coloridas de seda e sapatos clássicos de bico arredondado.",
      "aversoes": "Erros grosseiros de concordância em comunicações oficiais e poluição sonora perto de sua casa.",
      "paixoes": "Participar de saraus literários no Parque Vicentina Aranha, escrever crônicas sobre a história de SJC e cuidar de suas violetas."
    },
    "lugares_frequenta": [
      "Parque Vicentina Aranha",
      "Biblioteca Pública Cassiano Ricardo",
      "Calçadão da Rua 15"
    ],
    "veiculos_midia": [
      "Jornal O Vale (@jornalovale)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Carlos Abranches (@carlosabranchesoficial)",
      "Memória Joseense (@memoria_joseense)"
    ],
    "estilo_consumo_tag": "Cultural & Intelectual Clássica",
    "foto": "data_personas/imagens_personagens/personagem_29_vera_lucia_bittencourt.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_29_vera_lucia_bittencourt.jpg"
  },
  {
    "id": 30,
    "nome_completo": "Neusa de Oliveira",
    "idade": 56,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Diarista em Casas de Família",
    "bairro": "Vila Tatetuba",
    "regiao": "Leste",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe D",
    "meio_transporte_principal": "Ônibus municipal com baldeação e Caminhada",
    "historia_resumida": "Trabalha como diarista há quase trinta anos em condomínios da zona oeste. Conhece os endereços da cidade de ponta a ponta.",
    "dor_da_cidade": "Medo da violência nos pontos de ônibus escuros na volta para casa e o cansaço das viagens longas de transporte público.",
    "dor_pessoal": "Dores articulares severas nas mãos pela água sanitária e o medo de não conseguir se aposentar pelas regras do INSS.",
    "tensao_dramatica": "Guarda fotos antigas de uma época em que sonhava em ser técnica de enfermagem e sente uma pontada de rancor toda vez que vê os filhos das patroas reclamando de barriga cheia da faculdade.",
    "bordao": "Minha faxina é caprichada porque trabalho para Deus, não pros homens.",
    "habitos": {
      "alimentacao": "Arroz com feijão caseiro, café passado com açúcar refinado e pão francês com margarina.",
      "consumo": "Produtos de limpeza no atacarejo, compras de supermercado para o mês e farmácia popular.",
      "vestuario": "Roupas confortáveis de algodão, calça legging escura e tênis acolchoado para aguentar o expediente.",
      "aversoes": "Patrões que atrasam o pagamento da diária e desrespeito nos coletivos lotados.",
      "paixoes": "Reunir os netos no domingo para almoço, cuidar das samambaias no quintal e ouvir rádio evangélica à noite."
    },
    "lugares_frequenta": [
      "Ponto Central da Av. São José",
      "Feira do Tatetuba",
      "Igreja de São Benedito"
    ],
    "veiculos_midia": [
      "Rádio Aparecida (@radioaparecida)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Padre Júlio Lancellotti (@padrejulio.lancellotti)",
      "Notícias SJC (@noticias_sjc)"
    ],
    "estilo_consumo_tag": "Batalhadora & Cuidado Familiar",
    "foto": "data_personas/imagens_personagens/personagem_30_neusa_de_oliveira.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_30_neusa_de_oliveira.jpg"
  },
  {
    "id": 31,
    "nome_completo": "Natália 'Nati' Dornelles",
    "idade": 28,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Designer de UX/UI para Startups Globais",
    "bairro": "Jardim Aquarius",
    "regiao": "Oeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Patinete elétrico próprio e Carro hatch",
    "historia_resumida": "Trabalha para empresas de tecnologia no exterior a partir do Aquarius. Valoriza cafés com internet rápida e eventos digitais.",
    "dor_da_cidade": "Falta de eventos de design e inovação fora da capital paulista e pouca oferta de arte independente.",
    "dor_pessoal": "Crise de identidade crônica por trabalhar criando designs persuasivos para prender a atenção de usuários em apps que considera nocivos.",
    "tensao_dramatica": "Projeta telas desenhadas para prender atenção e não consegue passar vinte minutos longe das próprias métricas. Sabe exatamente qual gatilho está usando nela, e mesmo assim funciona.",
    "bordao": "Se o design precisa de explicação, ele falhou.",
    "habitos": {
      "alimentacao": "Matcha lattes cremosos, toasts com cogumelos salteados e refeições vegetarianas leves.",
      "consumo": "Monitores 4K calibrados para design, cadernos Moleskine e assinaturas de plataformas de tipografia.",
      "vestuario": "Camisetas de algodão orgânico oversized, calças retas de sarja bege e tênis sustentáveis brancos.",
      "aversoes": "Aplicativos com interfaces confusas cheias de propagandas invasivas e reuniões sem objetivo claro.",
      "paixoes": "Ilustração vetorial autoral, passeios com seu cão na Praça Ulisses Guimarães e cerâmica manual."
    },
    "lugares_frequenta": [
      "Praça Ulisses Guimarães",
      "Cafeterias do Aquarius",
      "Parque Ribeirão Vermelho"
    ],
    "veiculos_midia": [
      "Life Informa (@lifeinforma)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Design & Criatividade Digital",
    "foto": "data_personas/imagens_personagens/personagem_31_natalia_nati_dornelles.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "estereotipo_residual_corrigido"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_31_natalia_nati_dornelles.jpg"
  },
  {
    "id": 32,
    "nome_completo": "Cláudio Aparecido Toledo",
    "idade": 53,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Motorista de Linha Urbana & Líder Comunitário",
    "bairro": "Parque Novo Horizonte",
    "regiao": "Leste",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Ônibus municipal e Bicicleta própria",
    "historia_resumida": "Dirige coletivos na zona leste há 22 anos e atua na associação de moradores do Novo Horizonte, cobrando asfalto e segurança nos pontos.",
    "dor_da_cidade": "Intervalos demorados entre linhas alimentadoras nos fins de semana e pontos de ônibus escuros.",
    "dor_pessoal": "A sensação sufocante de ser invisível para a cidade que transporta todo dia, engolindo desaforos no trânsito enquanto carrega a culpa de ser um pai ausente pelo cansaço extremo das escalas.",
    "tensao_dramatica": "Já chegou ao ponto final pensando em não voltar mais. Fica sentado no ônibus vazio uns minutos antes de descer, todo dia, e ninguém nunca perguntou o motivo.",
    "bordao": "Na catraca ou no bairro, ninguém passa por cima de quem trabalha.",
    "habitos": {
      "alimentacao": "Prato feito caprichado com bife acebolado, café forte no ponto final da linha e feijão com farinha no almoço.",
      "consumo": "Compras no comércio popular do bairro, farmácia comunitária e materiais para reformas no centro comunitário.",
      "vestuario": "Uniforme de motorista sempre bem passado e bermuda com camiseta de time de futebol nos fins de semana.",
      "aversoes": "Políticos que só aparecem na zona leste em época de eleição e motoristas imprudentes no trânsito.",
      "paixoes": "Organizar campeonatos de futebol de várzea no bairro, churrasco com a vizinhança e ouvir samba de raiz."
    },
    "lugares_frequenta": [
      "Praça de Esportes do Novo Horizonte",
      "Mercado da Zona Leste",
      "Parque da Cidade"
    ],
    "veiculos_midia": [
      "TV Vanguarda (@redevanguarda)",
      "Rádio Nativa FM (@nativafmsjc)"
    ],
    "influenciadores_seguidos": [
      "Carlos Abranches (@carlosabranchesoficial)",
      "São José EC (@saojoseec_oficial)"
    ],
    "estilo_consumo_tag": "Comunitário & Voz do Povo",
    "foto": "data_personas/imagens_personagens/personagem_32_claudio_aparecido_toledo.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_32_claudio_aparecido_toledo.jpg"
  },
  {
    "id": 33,
    "nome_completo": "Elaine Mendes",
    "idade": 34,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Professora Concursada do Ensino Fundamental",
    "bairro": "Jardim Colonial",
    "regiao": "Sul",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Ônibus municipal e Uber eventual",
    "historia_resumida": "Professora da rede municipal, vive no Colonial e vivencia o contraste entre a propaganda tech da cidade e a realidade de infraestrutura dos bairros.",
    "dor_da_cidade": "Custo de vida elevado em aluguel e alimentação na cidade sem reajuste salarial compatível.",
    "dor_pessoal": "Desgaste de voz que não cede e a impotência diária de ver criança com fome na sala sem ter como resolver.",
    "tensao_dramatica": "Cansaço de voz que já virou rotina e a certeza de que metade da turma vai embora com fome. Gasta do próprio bolso em lanche e não conta isso na escola para não virar assunto.",
    "bordao": "Educação em São José não precisa de tablet; precisa de comida no prato e respeito ao professor.",
    "habitos": {
      "alimentacao": "Comida caseira simples e nutritiva, cafezinho coado na sala dos professores e marmita com arroz e feijão.",
      "consumo": "Livros didáticos e literários em sebos, materiais escolares criativos e compras no comércio do bairro.",
      "vestuario": "Roupas práticas e confortáveis em algodão, calça jeans e tênis macios para dar aula em pé.",
      "aversoes": "Falta de estrutura nas escolas periféricas e retórica oficial que ignora as dificuldades da sala de aula.",
      "paixoes": "Projetos de leitura com crianças, passeios em feiras livres e música popular brasileira."
    },
    "lugares_frequenta": [
      "Supermercado Nagumo Colonial",
      "Feira Livre do Jardim Colonial",
      "Shopping Jardim Oriente"
    ],
    "veiculos_midia": [
      "G1 Vale do Paraíba (@g1valeparaiba)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Carlos Abranches (@carlosabranchesoficial)",
      "Padre Júlio Lancellotti (@padrejulio.lancellotti)"
    ],
    "estilo_consumo_tag": "Educação Pública & Consciência",
    "foto": "data_personas/imagens_personagens/personagem_33_elaine_mendes.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica",
        "dor_pessoal_despatologizada"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_33_elaine_mendes.jpg"
  },
  {
    "id": 34,
    "nome_completo": "Danilo 'DK' Kuntz",
    "idade": 24,
    "genero": "Homem",
    "raca_cor": "Asiático",
    "profissao": "Analista de Suporte de TI no Parque Tecnológico",
    "bairro": "Eugênio de Melo",
    "regiao": "Leste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Moto 150cc e Carona compartilhada",
    "historia_resumida": "Atua no suporte de infraestrutura e redes para empresas incubadas no Parque Tecnológico. Mora em Eugênio de Melo e estuda certificações à noite.",
    "dor_da_cidade": "Trânsito pesado na Dutra no trevo de Eugênio de Melo no fim da tarde e falta de ciclovias seguras.",
    "dor_pessoal": "Timidez patológica que impede qualquer aproximação afetiva e o medo de passar a juventude inteira confinado num quarto escuro.",
    "tensao_dramatica": "Descobriu uma falha grave de segurança na firma anterior, reportou pelos canais certos e foi tratado como problema em vez de solução. Saiu de lá com a sensação de que fazer a coisa certa custa caro.",
    "bordao": "Não existe sistema 100% seguro; o elo fraco é sempre o humano.",
    "habitos": {
      "alimentacao": "Lanches práticos, delivery asiático noturno e café expresso duplo sem açúcar durante os plantões.",
      "consumo": "Hardware de segurança física (YubiKeys), servidores domésticos e periféricos de computador de alta fidelidade.",
      "vestuario": "Camisetas pretas básicas de algodão, calças jeans escuras e tênis skate duráveis.",
      "aversoes": "Sistemas corporativos com senhas fracas e falta de investimento em cultura de privacidade de dados.",
      "paixoes": "Competições globais de Capture The Flag (CTF), pilotar sua moto nas curvas da SP-50 e tecnologia cripto."
    },
    "lugares_frequenta": [
      "Parque Tecnológico de SJC (PqTec)",
      "CenterVale Shopping",
      "Lan house e jogos online"
    ],
    "veiculos_midia": [
      "TechCrunch (@techcrunch)",
      "Notícias SJC (@noticias_sjc)"
    ],
    "influenciadores_seguidos": [
      "Rocketseat (@rocketseat_oficial)",
      "Explore SJC (@exploresjc)"
    ],
    "estilo_consumo_tag": "Cibersegurança & Tech",
    "foto": "data_personas/imagens_personagens/personagem_34_danilo_dk_kuntz.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_34_danilo_dk_kuntz.jpg"
  },
  {
    "id": 35,
    "nome_completo": "Rosana Maria de Jesus",
    "idade": 57,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Cozinheira e Merendeira de Escola Pública",
    "bairro": "Jardim Santa Inês I",
    "regiao": "Leste",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe D",
    "meio_transporte_principal": "Ônibus municipal e Caminhada",
    "historia_resumida": "Cozinha para centenas de estudantes na escola do Santa Inês com carinho caipira há quase duas décadas. É muito querida pela comunidade escolar.",
    "dor_da_cidade": "Preço alto dos alimentos básicos no mercado e a falta de medicamentos de uso contínuo nos postos de saúde.",
    "dor_pessoal": "O desgaste emocional de ver diariamente a vulnerabilidade e o desamparo das crianças na fila da merenda, sentindo-se impotente diante da miséria que ultrapassa os muros da escola.",
    "tensao_dramatica": "Emprestou o nome para um parente e passou meses recebendo cobrança que não era dela. Resolveu sozinha, sem contar para o marido, e até hoje não sabe se foi orgulho ou vergonha.",
    "bordao": "Tempero de mãe e panela cheia confortam qualquer coração miúdo.",
    "habitos": {
      "alimentacao": "Comida de panela bem temperada, feijão fresquinho, couve refogada e café com biscoito de polvilho.",
      "consumo": "Alimentos básicos em atacarejo, produtos de limpeza para casa e farmácia popular.",
      "vestuario": "Vestidos de malha confortáveis, avental branco no trabalho e sapatos fechados acolchoados.",
      "aversoes": "Desperdício de comida e descaso de atendentes públicos com pessoas simples.",
      "paixoes": "Fazer almoço de domingo para os netos, cultivar hortelã no quintal e louvores na igreja."
    },
    "lugares_frequenta": [
      "Comércio do Santa Inês",
      "Mercado Municipal de SJC",
      "Igreja Evangélica da ZL"
    ],
    "veiculos_midia": [
      "Rádio Nativa FM (@nativafmsjc)",
      "TV Thathi (@tvthathi)"
    ],
    "influenciadores_seguidos": [
      "Notícias SJC (@noticias_sjc)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "estilo_consumo_tag": "Gastronomia Tradicional & Afeto",
    "foto": "data_personas/imagens_personagens/personagem_35_rosana_maria_de_jesus.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_35_rosana_maria_de_jesus.jpg"
  },
  {
    "id": 36,
    "nome_completo": "Vinícius 'Vini' Castanho",
    "idade": 32,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Especialista em Estética Automotiva e Polimento",
    "bairro": "Jardim Oriente",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Carro hatch esportivo e Moto 160cc",
    "historia_resumida": "Montou espaço de lavagem técnica e polimento no Jardim Oriente, atendendo donos de carros e motos com zelo e dedicação artesanal.",
    "dor_da_cidade": "Alta no custo de produtos químicos importados para vitrificação e oscilação nas semanas chuvosas.",
    "dor_pessoal": "Inalação crônica de solventes e compostos químicos que causam enxaquecas constantes e a cobrança da esposa por mais tempo em casa.",
    "tensao_dramatica": "Já riscou acidentalmente o capô de um carro importado de luxo de um cliente e passou a noite inteira polindo em desespero para disfarçar.",
    "bordao": "Carro limpo é reflexo da alma do dono.",
    "habitos": {
      "alimentacao": "Hambúrguer artesanal aos fins de semana, almoço em restaurantes self-service rápidos e energéticos gelados.",
      "consumo": "Compostos polidores alemães, boinas de lã e microfibras especiais de alta densidade para acabamento.",
      "vestuario": "Camisetas pretas de marcas de car care, bermudas cargo pretas e tênis esportivos confortáveis.",
      "aversoes": "Lava-rápidos automáticos de rolo que riscam a pintura dos veículos e clientes que usam produtos abrasivos caseiros.",
      "paixoes": "Encontros de carros antigos e modificados no estacionamento de shoppings, cuidar do brilho do próprio carro e automobilismo."
    },
    "lugares_frequenta": [
      "Shopping Jardim Oriente",
      "Av. Bacabal",
      "Vale Sul Shopping"
    ],
    "veiculos_midia": [
      "Diário de SJC (@diariodesjc)",
      "Notícias SJC (@noticias_sjc)"
    ],
    "influenciadores_seguidos": [
      "Netão Bom Beef (@netaobombeef)",
      "Mecânica Descomplicada (@mecanicadescomplicada)"
    ],
    "estilo_consumo_tag": "Automotivo Estético & Corre",
    "foto": "data_personas/imagens_personagens/personagem_36_vinicius_vini_castanho.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_36_vinicius_vini_castanho.jpg"
  },
  {
    "id": 37,
    "nome_completo": "Mariana 'Mari' Godoy",
    "idade": 29,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Fotógrafa de Ensaios Familiares e Cafés",
    "bairro": "Jardim das Indústrias",
    "regiao": "Oeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Carro compacto e Caminhada",
    "historia_resumida": "Fotografa ensaios externos de gestantes e crianças nos parques de SJC e produz fotos de pratos para bistrôs e confeitarias autorais.",
    "dor_da_cidade": "Clientes que desvalorizam o trabalho fotográfico autoral e pedem descontos excessivos.",
    "dor_pessoal": "Ansiedade profunda quanto à estabilidade financeira e a autocobrança implacável de que suas fotos nunca são artísticas o bastante.",
    "tensao_dramatica": "Usa perfis fakes nas redes sociais para espionar os preços e estratégias das concorrentes de fotografia de São José.",
    "bordao": "A beleza está no instante espontâneo que a pressa não vê.",
    "habitos": {
      "alimentacao": "Pães de queijo artesanais, cafés filtrados em cafeterias da Adyana e tortas de frutas vermelhas.",
      "consumo": "Lentes prime de alta abertura (f/1.4), cartões de memória de alta velocidade e álbuns encadernados artesanais.",
      "vestuario": "Vestidos fluidos em tons terrosos, chapéus de feltro discretos e botas de camurça macias.",
      "aversoes": "Ensaios fotográficos engessados e clientes que exigem edições artificiais exageradas em Photoshop.",
      "paixoes": "Passeios matinais fotografando a arquitetura histórica do Vicentina Aranha, viajar para a serra e cinema de arte."
    },
    "lugares_frequenta": [
      "Parque Vicentina Aranha",
      "Parque Santos Dumont",
      "Cafeterias da Vila Adyana"
    ],
    "veiculos_midia": [
      "Explore SJC (@exploresjc)",
      "Meon Jornal (@meonjornal)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Visual & Fotografia Sensível",
    "foto": "data_personas/imagens_personagens/personagem_37_mariana_mari_godoy.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_37_mariana_mari_godoy.jpg"
  },
  {
    "id": 38,
    "nome_completo": "Edson 'Edinho' Ferreira",
    "idade": 47,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Soldador Industrial TIG em Linha Pesada",
    "bairro": "Conjunto Residencial Galo Branco",
    "regiao": "Leste",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Fretado da fábrica e Moto 125cc aos fins de semana",
    "historia_resumida": "Metalúrgico experiente em soldagem de tubulações e estruturas na zona leste. Trabalha há 22 anos na indústria e joga futebol aos domingos.",
    "dor_da_cidade": "Insegurança sobre estabilidade em terceirizadas e desgaste físico pelas jornadas em calor intenso.",
    "dor_pessoal": "A angústia constante de viver sob contratos temporários de terceirizadas na Dutra, sem estabilidade para sonhar com o futuro do filho e refém do medo de ser descartado a qualquer corte de turno.",
    "tensao_dramatica": "Guarda mágoa profunda de ter sido rejeitado em um concurso público no passado por não ter tido dinheiro para pagar a taxa de inscrição.",
    "bordao": "Solda boa não aceita pressa; tem que ter pulso firme e calma na alma.",
    "habitos": {
      "alimentacao": "Comida farta de refeitório fabril, churrasco com linguiça artesanal aos sábados e cerveja bem gelada.",
      "consumo": "Máscaras de solda com escurecimento automático de última geração e ferramentas manuais resistentes.",
      "vestuario": "Jaquetas de couro de soldador na fábrica e camisa polo com bermuda jeans nos dias de descanso.",
      "aversoes": "Falta de rigor nas normas de segurança do trabalho e atrasos de pagamento de fornecedores terceirizados.",
      "paixoes": "Tocar pandeiro em rodas de samba no Galo Branco, consertar coisas em casa e torcer pelo São José EC."
    },
    "lugares_frequenta": [
      "Campo do Galo Branco",
      "Comércio de Eugênio de Melo",
      "Estádio Martins Pereira"
    ],
    "veiculos_midia": [
      "TV Vanguarda (@redevanguarda)",
      "Rádio Stereo Vale (@stereovale)"
    ],
    "influenciadores_seguidos": [
      "São José EC (@saojoseec_oficial)",
      "Notícias SJC (@noticias_sjc)"
    ],
    "estilo_consumo_tag": "Técnico Metalúrgico & Raiz",
    "foto": "data_personas/imagens_personagens/personagem_38_edson_edinho_ferreira.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_38_edson_edinho_ferreira.jpg"
  },
  {
    "id": 39,
    "nome_completo": "Yasmin Ferreira",
    "idade": 18,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Estudante de Ciências Sociais & Operadora de Caixa",
    "bairro": "Jardim Santa Inês III",
    "regiao": "Leste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Ônibus municipal e Caminhada",
    "historia_resumida": "Primeira da família no ensino superior, trabalha durante o dia em mercado e estuda à noite. Questiona a concentração de lazer no eixo nobre.",
    "dor_da_cidade": "Falta de ônibus noturno seguro na volta da aula e ingressos caros em eventos culturais da cidade.",
    "dor_pessoal": "Exaustão lancinante de conciliar jornada de 8 horas em pé no caixa de mercado com estudos universitários puxados à noite.",
    "tensao_dramatica": "Morre de vergonha de levar colegas da faculdade em sua casa humilde no Santa Inês III, inventando desculpas para nunca recebê-los.",
    "bordao": "A periferia tem voz, tem cultura e não vai se calar na vitrine dos outros.",
    "habitos": {
      "alimentacao": "Marmitas rápidas, açaí no copo com leite condensado e salgados assados na faculdade.",
      "consumo": "Livros acadêmicos em formato digital, recargas de internet móvel e roupas casuais básicas.",
      "vestuario": "Calças jeans largas, ecobags de lona estampadas e tênis confortáveis para andar a pé.",
      "aversoes": "Preconceito social em estabelecimentos de alto padrão e elitismo acadêmico.",
      "paixoes": "Escrever poesias em saraus, rodas de rima e participar de manifestações estudantis."
    },
    "lugares_frequenta": [
      "Ponto do Calçadão",
      "Shopping Jardim Oriente",
      "Batalhas de Rima de SJC"
    ],
    "veiculos_midia": [
      "TikTok",
      "Notícias SJC no Insta (@noticias_sjc)"
    ],
    "influenciadores_seguidos": [
      "MC Paiva (@mcpaiva)",
      "Explore SJC (@exploresjc)"
    ],
    "estilo_consumo_tag": "Jovem Periférica & Conectada",
    "foto": "data_personas/imagens_personagens/personagem_39_yasmin_ferreira.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real",
        "classe_ajustada"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_39_yasmin_ferreira.jpg"
  },
  {
    "id": 40,
    "nome_completo": "Matheus 'Math' Lourenço",
    "idade": 21,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Barbeiro & Criador de Conteúdo de Barbearia",
    "bairro": "Conjunto Dom Pedro II",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Moto 160cc financiada",
    "historia_resumida": "Especialista em corte fade e pigmentação, atrai jovens de toda a zona sul para a barbearia do bairro e grava transformações no Instagram.",
    "dor_da_cidade": "Preço elevado de máquinas e lâminas de precisão e instabilidade de faturamento nos dias frios e chuvosos.",
    "dor_pessoal": "A pressão de ser o primeiro da turma a ter renda própria e o medo de que um mês ruim de agenda coloque tudo a perder.",
    "tensao_dramatica": "Copia descaradamente tutoriais e cortes de barbeiros de Londres e Nova York, jurando para os clientes que são criações autorais suas.",
    "bordao": "Na navalha não tem espaço para vacilo: régua máxima sempre.",
    "habitos": {
      "alimentacao": "Açaí turbinado com leite condensado, lanches de rua com batata frita e refrigerante gelado.",
      "consumo": "Máquinas de corte profissionais de precisão (Wahl/Babyliss), pomadas modeladoras e tênis de marca.",
      "vestuario": "Camisetas de time de basquete americano (NBA), bermudas jeans e correntes de prata.",
      "aversoes": "Clientes que chegam atrasados sem avisar e pessoas que desvalorizam a arte da barbearia de periferia.",
      "paixoes": "Batalhas de rima e hip-hop na zona sul, gravar vídeos de transformação de cortes e andar de moto."
    },
    "lugares_frequenta": [
      "Praça do Dom Pedro II",
      "Shopping Jardim Oriente",
      "Pista de Skate do Satélite"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "TV Band Vale (@bandvaletv)"
    ],
    "influenciadores_seguidos": [
      "MC Paiva (@mcpaiva)",
      "Biel Grau (@bielgrau)"
    ],
    "estilo_consumo_tag": "Estilo Urbano & Freestyle",
    "foto": "data_personas/imagens_personagens/personagem_40_matheus_math_lourenco.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "estereotipo_residual_corrigido"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_40_matheus_math_lourenco.jpg"
  },
  {
    "id": 41,
    "nome_completo": "Elza Aparecida Bueno",
    "idade": 65,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Produtora de Alfaces e Hortaliças da Roça",
    "bairro": "Santana",
    "regiao": "Norte",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Kombi de entrega de feira e Caminhada",
    "historia_resumida": "Acorda de madrugada para colher cheiro-verde, alfaces e legumes frescos na sua horta familiar e abastecer a feira livre de Santana e do Mercado.",
    "dor_da_cidade": "Perdas na colheita durante períodos de tempestades fortes e falta de compradores regulares de atacado.",
    "dor_pessoal": "O temor sufocante de ver a terra onde nasceu ser cercada por condomínios fechados e a angústia de envelhecer sabendo que ninguém vai continuar cultivando a horta da família.",
    "tensao_dramatica": "Evita ir ao posto de saúde porque a fila come o dia inteiro e o dia inteiro é a horta. Trata o que dá para tratar em casa e adia o resto, fingindo para os filhos que já foi ao médico.",
    "bordao": "A terra só devolve o que a gente planta com suor e respeito.",
    "habitos": {
      "alimentacao": "Verduras fresquinhas refogadas na banha de porco, angu de milho verde e café com leite da roça.",
      "consumo": "Sementes orgânicas certificadas, adubo natural e lonas para estufas agrícolas.",
      "vestuario": "Camisas de manga comprida para o sol, chapéu de palha com lenço e botas de borracha de cano alto.",
      "aversoes": "Agrotóxicos pesados que contaminam a terra e atravessadores que querem pagar pouco na produção rural.",
      "paixoes": "Cuidar de suas mudas na estufa, ir à missa de domingo no Bairro dos Freitas e reunir a família para o almoço caipira."
    },
    "lugares_frequenta": [
      "Feira Livre de Santana",
      "Igreja Matriz de Santana",
      "Mercado Municipal"
    ],
    "veiculos_midia": [
      "Rádio Nativa FM (@nativafmsjc)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Memória Joseense (@memoria_joseense)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Orgânico & Agricultura Familiar",
    "foto": "data_personas/imagens_personagens/personagem_41_elza_aparecida_bueno.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_41_elza_aparecida_bueno.jpg"
  },
  {
    "id": 42,
    "nome_completo": "Rafael 'Rafa' Brandão",
    "idade": 38,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Coordenador de Expedição e Frota na Dutra",
    "bairro": "Cidade Vista Verde",
    "regiao": "Leste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Carro sedan próprio e Linha Verde",
    "historia_resumida": "Supervisiona centros de distribuição e frotas de carga no polo logístico da Dutra. Mora no Vista Verde e gosta das praças com árvores centenárias.",
    "dor_da_cidade": "Lentidão e acidentes constantes na Dutra que impactam as janelas de entrega de mercadorias.",
    "dor_pessoal": "Estresse contínuo de plantões 24h por telefone monitorando cargas e a perda de momentos preciosos do crescimento da filha pequena.",
    "tensao_dramatica": "Assume uma postura durona e infalível com os motoristas terceirizados, mas tem crises de choro trancado no carro no estacionamento da empresa pela pressão de metas desumanas.",
    "bordao": "Se a fábrica não parou e o caminhão chegou no horário, ninguém me dá parabéns; mas se atrasar dez minutos, o telefone não para de tocar.",
    "habitos": {
      "alimentacao": "Grelhados com legumes no almoço, massas artesanais com molhos encorpados e cervejas artesanais locais.",
      "consumo": "Softwares de rastreamento e telemetria logística, equipamentos eletrônicos para home office e livros de gestão.",
      "vestuario": "Camisas sociais sem gravata em tecidos tecnológicos antimanchas e calças chino elegantes.",
      "aversoes": "Atrasos em relatórios operacionais e transportadoras que não cumprem os padrões de segurança de carga.",
      "paixoes": "Correr pelas alamedas arborizadas do Vista Verde, andar de caiaque na represa e churrasco de fim de semana."
    },
    "lugares_frequenta": [
      "Praças da Cidade Vista Verde",
      "CenterVale Shopping",
      "Restaurantes do Centro"
    ],
    "veiculos_midia": [
      "CBN Vale (@cbnvale)",
      "Diário de SJC (@diariodesjc)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Logística & Gestão Estratégica",
    "foto": "data_personas/imagens_personagens/personagem_42_rafael_rafa_brandao.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_42_rafael_rafa_brandao.jpg"
  },
  {
    "id": 43,
    "nome_completo": "Sabrina Satoe Mori",
    "idade": 30,
    "genero": "Mulher",
    "raca_cor": "Asiática",
    "profissao": "Analista de Sistemas e Programadora Mobile",
    "bairro": "Vila Industrial",
    "regiao": "Leste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Bicicleta própria e Linha Verde (BRT elétrico)",
    "historia_resumida": "Desenvolve códigos para aplicativos financeiros trabalhando parte em home office e parte em escritório tech. Aprecia arquitetura fabril histórica.",
    "dor_da_cidade": "Custo crescente de moradia e escassez de opções de gastronomia asiática autêntica fora do eixo nobre.",
    "dor_pessoal": "Pressão familiar conservadora tradicional para se casar e ter filhos, contrastando com sua ambição profissional independente.",
    "tensao_dramatica": "Tem um perfil anônimo na internet onde publica resenhas ácidas e bem-humoradas detonando a mediocridade da cena cultural do Vale.",
    "bordao": "Aplicativo bom é o que até minha vó consegue usar sem travar e sem me ligar no domingo.",
    "habitos": {
      "alimentacao": "Culinária fusion asiática, chás de jasmim orgânicos e pães de fermentação lenta com queijo branco.",
      "consumo": "Dispositivos Apple de última geração para testes, cadeiras ergonômicas certificadas e fones com cancelamento de ruído.",
      "vestuario": "Cardigãs minimalistas em tons pastéis, calças de alfaiataria confortáveis e tênis slip-on.",
      "aversoes": "Sistemas corporativos legados lentos e falta de acessibilidade para usuários com deficiência visual em apps.",
      "paixoes": "Desenhar ilustrações no iPad, fotografar detalhes arquitetônicos da Vila Maria e passeios de bicicleta no Vicentina."
    },
    "lugares_frequenta": [
      "Parque da Cidade",
      "Vila Industrial",
      "CenterVale Shopping"
    ],
    "veiculos_midia": [
      "Explore SJC (@exploresjc)",
      "Meon Jornal (@meonjornal)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Mobile Tech & Estilo Minimalista",
    "foto": "data_personas/imagens_personagens/personagem_43_sabrina_satoe_mori.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_43_sabrina_satoe_mori.jpg"
  },
  {
    "id": 44,
    "nome_completo": "Geraldo 'Seu Geraldo' Dias",
    "idade": 69,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Mecânico Tradicional de Motores a Diesel",
    "bairro": "Jardim Morumbi",
    "regiao": "Sul",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Picape antiga a diesel e Caminhada no bairro",
    "historia_resumida": "Mecânico veterano que socorre veículos a diesel, picapes e vans escolares no Morumbi há mais de 35 anos. Trabalha com chaves manuais e ouvido atento.",
    "dor_da_cidade": "Dificuldade para obter peças de reposição confiáveis sem preços superfaturados em autopeças.",
    "dor_pessoal": "A humilhação secreta de não entender os diagnósticos eletrônicos via scanner dos caminhões novos, sentindo que seu ouvido treinado por 40 anos virou peça de museu para os motoristas jovens.",
    "tensao_dramatica": "Guarda em uma gaveta trancada da oficina notas promissórias e cheques sem fundos de 'amigos' que nunca pagaram seus consertos.",
    "bordao": "Motor a diesel não mente: ou você escuta o barulho ou fica na beira da estrada.",
    "habitos": {
      "alimentacao": "Marmita de ferro com arroz, feijão e carne de panela, café coado na hora e paçoca caipira.",
      "consumo": "Chaves mecânicas forjadas em cromo-vanádio, peças de reposição diesel originais e óleos lubrificantes de qualidade.",
      "vestuario": "Macacão azul escuro de mecânico com manchas de graxa e boné de marca de caminhão.",
      "aversoes": "Mecânicos desonestos que cobram por peças que não trocaram e ferramentas de baixa qualidade que quebram no torque.",
      "paixoes": "Restaurar tratores agrícolas antigos no galpão, conversar com os viajantes da SP-50 e ouvir modão no rádio."
    },
    "lugares_frequenta": [
      "Oficinas do Morumbi",
      "Av. Andrômeda",
      "Supermercado Shibata da Zona Sul"
    ],
    "veiculos_midia": [
      "Rádio Nativa FM (@nativafmsjc)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Mecânica Descomplicada (@mecanicadescomplicada)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Mecânica Pesada & Sabedoria",
    "foto": "data_personas/imagens_personagens/personagem_44_geraldo_seu_geraldo_dias.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_44_geraldo_seu_geraldo_dias.jpg"
  },
  {
    "id": 45,
    "nome_completo": "Patrícia 'Pati' Lemes",
    "idade": 40,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Personal Organizer Residencial e Comercial",
    "bairro": "Bosque dos Eucaliptos",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Carro hatch espaçoso e Ônibus eventual",
    "historia_resumida": "Organiza armários, despensas e arquivos de escritórios na zona sul e centro. Ensina técnicas de categorização que economizam tempo.",
    "dor_da_cidade": "Clientes que cancelam sessões em cima da hora e a dificuldade de encontrar caixas organizadoras a preço acessível.",
    "dor_pessoal": "Sensação sufocante de que sua própria vida pessoal e financeira é caótica, em total contradição com a organização impecável que vende.",
    "tensao_dramatica": "Seu próprio guarda-roupa em casa é uma bagunça caótica que ela esconde trancando a porta do quarto quando recebe visitas.",
    "bordao": "Organização não é sobre dobrar roupas; é sobre devolver a paz para a sua mente.",
    "habitos": {
      "alimentacao": "Marmitas congeladas saudáveis e etiquetadas, saladas com sementes e sucos naturais prensados a frio.",
      "consumo": "Caixas organizadoras de acrílico transparente, rotuladores eletrônicos térmicos e cabides padronizados de veludo.",
      "vestuario": "Camisas polo brancas com seu logotipo bordado, calças confortáveis com elastano e tênis slip-on acolchoados.",
      "aversoes": "Acumulação compulsiva de caixas vazias e pessoas que não valorizam a metodologia profissional de organização.",
      "paixoes": "Passeios na Av. Ouro Fino no Bosque dos Eucaliptos, ler livros sobre minimalismo e reformas criativas de móveis."
    },
    "lugares_frequenta": [
      "Avenida Ouro Fino",
      "Vale Sul Shopping",
      "Leroy Merlin do Satélite"
    ],
    "veiculos_midia": [
      "Fica a Dica SJC (@ficaadicasjc)",
      "Notícias SJC (@noticias_sjc)"
    ],
    "influenciadores_seguidos": [
      "Jonas Almeida (@jonas_almeida)",
      "Kelly Maria (@kellymariaoficial)"
    ],
    "estilo_consumo_tag": "Organização & Praticidade",
    "foto": "data_personas/imagens_personagens/personagem_45_patricia_pati_lemes.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_45_patricia_pati_lemes.jpg"
  },
  {
    "id": 46,
    "nome_completo": "Henrique 'Rique' Faria",
    "idade": 26,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Técnico de Fusão e Reparo de Fibra Óptica",
    "bairro": "Jardim Santa Inês II",
    "regiao": "Leste",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Utilitário da operadora e Moto 150cc",
    "historia_resumida": "Sobe em escadas e postes para restabelecer cabos rompidos de telecomunicações em bairros da zona leste e sudeste com destreza.",
    "dor_da_cidade": "Fiação emaranhada que oferece perigo e cobrança por metas diárias pesadas de restabelecimento.",
    "dor_pessoal": "Medo constante de acidentes elétricos em postes e a cobrança da noiva para comprar um apartamento próprio na zona leste.",
    "tensao_dramatica": "Diz à noiva que está guardando mais do que guarda. Parte do dinheiro vai para as noites com os colegas da firma, e a conta desse desencontro ele vai ter que prestar uma hora.",
    "bordao": "A cidade não para porque a gente garante a conexão no poste.",
    "habitos": {
      "alimentacao": "Marmitex de frango com quiabo nos restaurantes da ZL, salgados assados nos postos e refrigerante no intervalo.",
      "consumo": "Máquinas de fusão de fibra óptica portáteis, canetas laser de teste óptico e calçados com isolamento térmico.",
      "vestuario": "Uniforme com faixas refletivas de alta visibilidade, capacete com jugular de segurança e óculos de proteção UV.",
      "aversoes": "Clientes impacientes que culpam o instalador por instabilidades globais de servidores de internet.",
      "paixoes": "Participar de torneios de videogame de futebol aos fins de semana, empinar pipa com o filho no campinho e churrasco."
    },
    "lugares_frequenta": [
      "Comércio do Santa Inês",
      "Shopping CenterVale",
      "Praça de Lazer do Novo Horizonte"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "TV Thathi (@tvthathi)"
    ],
    "influenciadores_seguidos": [
      "MC Paiva (@mcpaiva)",
      "Trolando SJC (@trollandosaojose)"
    ],
    "estilo_consumo_tag": "Conectividade & Trabalho Técnico",
    "foto": "data_personas/imagens_personagens/personagem_46_henrique_rique_faria.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_46_henrique_rique_faria.jpg"
  },
  {
    "id": 47,
    "nome_completo": "Marlene Cristina de Souza",
    "idade": 43,
    "genero": "Mulher",
    "raca_cor": "Negra",
    "profissao": "Garçonete Freelancer em Eventos e Buffets",
    "bairro": "Jardim São Judas Tadeu",
    "regiao": "Sudeste",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe D",
    "meio_transporte_principal": "Ônibus municipal noturno e Racha de Uber",
    "historia_resumida": "Trabalha em festas de casamento e corporativas servindo clientes na alta sociedade. Conhece o cotidiano duro de quem volta para casa na madrugada.",
    "dor_da_cidade": "Falta de segurança nas paradas de ônibus vazias à noite e preconceito social velado em salões nobres.",
    "dor_pessoal": "A sensação de humilhação ao circular como uma sombra invisível entre banquetes milionários na Vila Ema e voltar de madrugada para um bairro sem iluminação, sem saber se a diária vai fechar o aluguel.",
    "tensao_dramatica": "Serve banquete a noite inteira e volta de madrugada num ponto sem luz. Guarda, dos bufês onde trabalha, as histórias que conta para os filhos no dia seguinte — nunca a humilhação.",
    "bordao": "A gente serve o banquete dos outros de cabeça erguida, sem dever nada pra ninguém.",
    "habitos": {
      "alimentacao": "Café com pão na chapa de manhã, lanches rápidos durante eventos e refeição caseira em família.",
      "consumo": "Sapatos pretos ortopédicos resistentes para eventos, meias de compressão e compras em atacados populares.",
      "vestuario": "Camisa social preta, calça social escura e avental impecável para eventos.",
      "aversoes": "Clientes esnobes em eventos e falta de consideração dos organizadores com transporte de retorno.",
      "paixoes": "Cantar na igreja de São Judas, passear com os filhos no parque aos domingos e ouvir pagode."
    },
    "lugares_frequenta": [
      "Praça do São Judas",
      "Ponto Central de Ônibus",
      "Mercado Municipal"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Padre Júlio Lancellotti (@padrejulio.lancellotti)",
      "Kelly Maria (@kellymariaoficial)"
    ],
    "estilo_consumo_tag": "Resistência & Trabalho Noturno",
    "foto": "data_personas/imagens_personagens/personagem_47_marlene_cristina_de_souza.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_47_marlene_cristina_de_souza.jpg"
  },
  {
    "id": 48,
    "nome_completo": "Jair Messias da Silva",
    "idade": 58,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Pedreiro Especialista em Alvenaria e Pisos",
    "bairro": "Parque Interlagos",
    "regiao": "Sul",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Ônibus municipal e Bicicleta cargueira",
    "historia_resumida": "Assentador de pisos e construtor com mais de 30 anos de ofício em obras na zona sul e leste. Preza pelo prumo certo e acabamento limpo.",
    "dor_da_cidade": "Atrasos na entrega de areia e cimento nas obras e a distância das linhas de transporte público.",
    "dor_pessoal": "A vergonha de não conseguir dar aos filhos o padrão de vida das casas de alto padrão que ele mesmo ergue tijolo por tijolo com as próprias mãos no Urbanova.",
    "tensao_dramatica": "Assina contrato confiando no aperto de mão porque os termos jurídicos passam longe do que ele aprendeu. Já perdeu dinheiro assim duas vezes e continua achando que pedir para alguém explicar seria pior.",
    "bordao": "Piso assentado no prumo é o espelho da honra do pedreiro.",
    "habitos": {
      "alimentacao": "Marmita reforçada com arroz, feijão, farofa e carne assada, café com biscoito na obra e suco de caju.",
      "consumo": "Niveladores de piso de alta precisão, discos de corte diamantados para porcelanato e ferramentas elétricas.",
      "vestuario": "Camisas polo de algodão resistentes, calças jeans grossas de trabalho e botas com solado de borracha.",
      "aversoes": "Contratantes que atrasam o pagamento do serviço combinado na entrega da obra e pisos com defeito de fábrica empenados.",
      "paixoes": "Cuidar dos seus netos no fim de semana, pescar na represa com os amigos do Pinheirinho e assistir jogos de futebol."
    },
    "lugares_frequenta": [
      "Praça do Interlagos",
      "Depósitos da Zona Sul",
      "Shopping Jardim Oriente"
    ],
    "veiculos_midia": [
      "Rádio Nativa FM (@nativafmsjc)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Dicas de Obra do Mestre (@obramestre)",
      "São José EC (@saojoseec_oficial)"
    ],
    "estilo_consumo_tag": "Construção & Trabalho Honesto",
    "foto": "data_personas/imagens_personagens/personagem_48_jair_messias_da_silva.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_48_jair_messias_da_silva.jpg"
  },
  {
    "id": 49,
    "nome_completo": "Camila 'Cami' Valente",
    "idade": 33,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Farmacêutica em Drogaria Hospitalar",
    "bairro": "Jardim das Indústrias",
    "regiao": "Oeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe B",
    "meio_transporte_principal": "Carro hatch flex e Caminhada",
    "historia_resumida": "Responsável pela dispensação técnica de remédios em drogaria perto do anel viário, conferindo receitas e tirando dúvidas de clientes sobre remédios.",
    "dor_da_cidade": "Sobrecarga de jornadas em fins de semana alternados e pressão comercial constante.",
    "dor_pessoal": "Exaustão de absorver a dor de pacientes graves todos os dias e nenhum espaço na agenda para cuidar da própria cabeça.",
    "tensao_dramatica": "Atende o balcão ouvindo a pior notícia da vida de estranhos e vai para casa sem ter com quem dividir nenhuma delas. Sabe exatamente o que recomendaria a si mesma, e não faz.",
    "bordao": "Remédio cura o corpo, mas o acolhimento humano cura o desespero.",
    "habitos": {
      "alimentacao": "Shakes proteicos funcionais, saladas de grãos com azeite extravirgem e cafés espressos curtos.",
      "consumo": "Balanças analíticas de alta precisão, softwares de controle magistral e cosméticos com fórmulas limpas.",
      "vestuario": "Jalecos brancos estilizados com bordado impecável e calçados hospitalares anatômicos acolchoados.",
      "aversoes": "Farmácias que adulteram fórmulas ou utilizam matérias-primas com laudos de pureza duvidosos.",
      "paixoes": "Participar de congressos de farmacologia personalizada, aulas de dança de salão e piqueniques no Santos Dumont."
    },
    "lugares_frequenta": [
      "Praça das Indústrias",
      "CenterVale Shopping",
      "Parque Santos Dumont"
    ],
    "veiculos_midia": [
      "Meon Jornal (@meonjornal)",
      "Explore SJC (@exploresjc)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Farmacêutica & Saúde Prática",
    "foto": "data_personas/imagens_personagens/personagem_49_camila_cami_valente.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica",
        "dor_pessoal_despatologizada"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_49_camila_cami_valente.jpg"
  },
  {
    "id": 50,
    "nome_completo": "Diego 'Dih' Santos",
    "idade": 28,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Motorista de Aplicativo & Entregador Expresso",
    "bairro": "Parque Interlagos",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Carro hatch alugado e Moto 160cc",
    "historia_resumida": "Faz corridas e fretes rápidos de e-commerce e alimentos por toda a cidade, operando celular no suporte e conhecendo cada atalho.",
    "dor_da_cidade": "Preço do combustível que não para de subir e a demora para embarcar passageiros em condomínios fechados.",
    "dor_pessoal": "Sensação de estar preso numa roda-viva sem futuro profissional, trabalhando 14 horas por dia apenas para pagar o aluguel do carro e a gasolina.",
    "tensao_dramatica": "Finge para a namorada que é dono do carro em que roda, morrendo de vergonha de admitir que o veículo é alugado.",
    "bordao": "No volante não tem mimimi: cada quilômetro rodado é um passo mais perto da minha vitória.",
    "habitos": {
      "alimentacao": "Marmita térmica no banco do passageiro, salgados de estufa nos postos de GNV e garrafas de café térmico para os turnos da madrugada.",
      "consumo": "Pneus aro 14 resistentes para asfalto acidentado, planos de dados 5G ilimitados, suportes magnéticos de celular para painel e lavagem rápida semanal.",
      "vestuario": "Camisetas polo escuras confortáveis, bermudas jeans leves nos dias quentes e tênis macio para suportar horas nos pedais.",
      "aversoes": "Passageiros que batem a porta do carro com força, cancelamentos após deslocamento longo e taxas abusivas de aluguel da locadora de veículos.",
      "paixoes": "Ouvir podcasts de histórias reais e pagode nas madrugadas ao volante, cuidar da sua moto nos dias de folga e reunir os amigos para jogar truco."
    },
    "lugares_frequenta": [
      "Postos de GNV da Av. Cidade Jardim",
      "Shopping Jardim Oriente",
      "Parque Interlagos"
    ],
    "veiculos_midia": [
      "Notícias SJC (@noticias_sjc)",
      "012 News (@012news)"
    ],
    "influenciadores_seguidos": [
      "Trolando SJC (@trollandosaojose)",
      "Beto Oliver (@betooliver)"
    ],
    "estilo_consumo_tag": "Agilidade no Trânsito & Autonomia",
    "foto": "data_personas/imagens_personagens/personagem_50_diego_dih_santos.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_50_diego_dih_santos.jpg"
  },
  {
    "id": 51,
    "nome_completo": "Waldir 'Seu Waldir' Fagundes",
    "idade": 52,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Dono de Lanchonete e Café de Balcão",
    "bairro": "Jardim Satélite",
    "regiao": "Sul",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Carro utilitário e Caminhada matinal",
    "historia_resumida": "Comanda lanchonete de sucos e salgados na Av. Andrômeda há mais de duas décadas, atendendo bancários, lojistas e famílias do bairro.",
    "dor_da_cidade": "Concorrência predatória de grandes franquias de fast-food e a alta contínua nas contas de energia elétrica comercial.",
    "dor_pessoal": "Terror de ver a lanchonete familiar falir e não ter como pagar a faculdade de medicina da filha que é seu maior orgulho.",
    "tensao_dramatica": "Tem pavor de admitir que a lanchonete está perdendo clientela jovem para as cafeterias gourmet da Vila Ema e passa madrugadas conferindo o saldo bancário em pânico silencioso.",
    "bordao": "Café quente no bule e acolhimento sincero seguram qualquer cliente fiel.",
    "habitos": {
      "alimentacao": "Salgados tradicionais assados na hora, café expresso simples e almoço rápido no balcão da lanchonete.",
      "consumo": "Fritadeiras elétricas profissionais, embalagens térmicas e compras em atacadistas da zona sul.",
      "vestuario": "Camisa polo branca, calça de sarja resistente e calçado confortável para horas de pé.",
      "aversoes": "Fornecedores que entregam produtos fora da data de validade e desonestidade de concorrentes.",
      "paixoes": "Conversar com clientes fiéis no balcão, passeios no Parque da Cidade e assistir jogos de futebol."
    },
    "lugares_frequenta": [
      "Avenida Andrômeda",
      "Praça do Centenário",
      "Vale Sul Shopping"
    ],
    "veiculos_midia": [
      "Jornal O Vale (@jornalovale)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Carlos Abranches (@carlosabranchesoficial)",
      "Jonas Almeida (@jonas_almeida)"
    ],
    "estilo_consumo_tag": "Comércio Raiz & Tradicional",
    "foto": "data_personas/imagens_personagens/personagem_51_waldir_seu_waldir_fagundes.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_51_waldir_seu_waldir_fagundes.jpg"
  },
  {
    "id": 52,
    "nome_completo": "Alexandre 'Xande' Pires",
    "idade": 46,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Eletricista de Manutenção Predial e Bombas",
    "bairro": "Putim",
    "regiao": "Sudeste",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Moto própria e Furgão de ferramentas",
    "historia_resumida": "Faz reparos elétricos em condomínios e pequenos comércios do Putim e região sudeste, com atendimento rápido via WhatsApp.",
    "dor_da_cidade": "Clientes que tentam fazer reparos por conta própria e pioram o curto-circuito antes de chamar o profissional.",
    "dor_pessoal": "O pânico de envelhecer sem nenhuma previdência ou patrimônio após duas décadas trabalhando de sol a sol, refém da incerteza de depender da caridade familiar se um dia sofrer uma queda de escada.",
    "tensao_dramatica": "Investiu em ferramentas boas apostando em contratos que ainda não fechou, e agora corre atrás do prejuízo sem contar para a esposa. Duas décadas de trabalho e nenhuma previdência é o que tira seu sono.",
    "bordao": "Água na caixa e luz no teto: se depender de mim, ninguém fica no escuro.",
    "habitos": {
      "alimentacao": "Marmitex com bife a cavalo e mandioca frita, refrigerante de tubaína em lata e café coado no balcão das lojas de ferragens.",
      "consumo": "Multímetros digitais industriais de alta precisão, bombas submersas de reposição, chaves isoladas 1000V e fitas autofusão de alta performance.",
      "vestuario": "Calças jeans grossas com bolsos utilitários para ferramentas, camisetas de algodão pesadas e botinas de segurança com biqueira de composite.",
      "aversoes": "'Curiosos' que fazem gambiarras elétricas e tentam culpar o eletricista anterior, além de fios finos de alumínio cobreado de má qualidade.",
      "paixoes": "Pescaria de barranco nas lagoas do Putim, ouvir moda sertaneja raiz na caminhonete e consertar motores elétricos na oficina de casa."
    },
    "lugares_frequenta": [
      "Lojas de Ferragens do Putim",
      "Shopping CenterVale",
      "Paróquia do Putim"
    ],
    "veiculos_midia": [
      "Rádio Stereo Vale (@stereovale)",
      "TV Thathi (@tvthathi)"
    ],
    "influenciadores_seguidos": [
      "Mecânica Descomplicada (@mecanicadescomplicada)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Manutenção & Resolução Prática",
    "foto": "data_personas/imagens_personagens/personagem_52_alexandre_xande_pires.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_52_alexandre_xande_pires.jpg"
  },
  {
    "id": 53,
    "nome_completo": "Débora 'Deby' Antunes",
    "idade": 25,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Banhista e Tosadora em Pet Shop de Bairro",
    "bairro": "Jardim Satélite",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Linha Verde (BRT elétrico) e Bicicleta própria",
    "historia_resumida": "Cuida com carinho da tosa e bem-estar de cães e gatos em pet shop familiar na zona sul. Apoia causas de resgate animal no bairro.",
    "dor_da_cidade": "Tutores que não cuidam da vacinação e deixam animais cheios de carrapatos sem tratamento preventivo.",
    "dor_pessoal": "A frustração de dedicar todo o seu afeto aos animais dos outros enquanto se sente incapaz de estruturar a própria independência financeira para sair da casa dos pais na periferia.",
    "tensao_dramatica": "Trata melhor os cachorros dos outros do que qualquer pessoa já tratou ela. Sorri para o cliente arrogante e passa o resto do dia ensaiando mentalmente a resposta que nunca vai dar.",
    "bordao": "Bicho não fala, mas sente quem cuida com o coração.",
    "habitos": {
      "alimentacao": "Lanches vegetarianos práticos, sucos de frutas da estação e comida caseira no almoço com a equipe do pet shop.",
      "consumo": "Tesouras japonesas de tosa de precisão, lâminas profissionais, xampus hipoalergênicos e acessórios pet fofos.",
      "vestuario": "Camisetas pretas impermeáveis que não grudam pelos, calças legging confortáveis e tênis leves antiderrapantes.",
      "aversoes": "Maus-tratos a animais e pessoas que compram bichos por modismo sem pensar no compromisso de longo prazo.",
      "paixoes": "Trabalhar como voluntária em feirinhas de adoção de animais em SJC, passear com seus cães resgatados e gravar vídeos pet."
    },
    "lugares_frequenta": [
      "Avenida Andrômeda",
      "Vale Sul Shopping",
      "Praça de Lazer do Satélite"
    ],
    "veiculos_midia": [
      "Explore SJC (@exploresjc)",
      "Notícias SJC (@noticias_sjc)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Cuidado Animal & Afeto",
    "foto": "data_personas/imagens_personagens/personagem_53_debora_deby_antunes.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_53_debora_deby_antunes.jpg"
  },
  {
    "id": 54,
    "nome_completo": "Mauro 'Seu Mauro' Quintanilha",
    "idade": 63,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Tapeceiro Artesanal de Veículos e Sofás",
    "bairro": "Santana",
    "regiao": "Norte",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Carro popular antigo e Caminhada",
    "historia_resumida": "Artesão do couro e da costura pesada em oficina tradicional de Santana, recuperando bancos e sofás que duram décadas.",
    "dor_da_cidade": "Escassez de jovens com paciência para aprender o ofício e a invasão de produtos descartáveis de courino sintético.",
    "dor_pessoal": "A amargura de presenciar a morte do seu ofício artesanal e a sensação de esquecimento ao ver que a cidade trocou a durabilidade do couro legítimo pelo consumo descartável da internet.",
    "tensao_dramatica": "Guarda pedaços de couro nobre há 40 anos para fazer um jogo de estofamento perfeito que sonha em construir, mas nunca acha tempo.",
    "bordao": "A máquina faz rápido, mas a mão do mestre faz pra durar uma vida inteira.",
    "habitos": {
      "alimentacao": "Comida de boteco tradicional, torresmo sequinho com limão, arroz com tutu de feijão e café fresco passado na hora.",
      "consumo": "Couros legítimos de curtumes selecionados, linhas de náilon de alta tenacidade e ferramentas manuais de tapeceiro.",
      "vestuario": "Aventais grossos de lona pesada sobre a roupa, camisas jeans duráveis e calçados confortáveis para trabalho em pé.",
      "aversoes": "Materiais sintéticos plásticos que esfarelam com o calor do sol e clientes que exigem pressa em restaurações artísticas.",
      "paixoes": "Participar de encontros de carros clássicos no Parque da Cidade, ouvir sambas antigos no rádio e contar histórias de Santana."
    },
    "lugares_frequenta": [
      "Parque da Cidade",
      "Feira de Santana",
      "Oficinas Tradicionais do Bairro"
    ],
    "veiculos_midia": [
      "Rádio Nativa FM (@nativafmsjc)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Memória Joseense (@memoria_joseense)",
      "Carlos Abranches (@carlosabranchesoficial)"
    ],
    "estilo_consumo_tag": "Restauração & Ofício Tradicional",
    "foto": "data_personas/imagens_personagens/personagem_54_mauro_seu_mauro_quintanilha.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_54_mauro_seu_mauro_quintanilha.jpg"
  },
  {
    "id": 55,
    "nome_completo": "Renata Vasconcelos",
    "idade": 36,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Engenheira de Infraestrutura de Redes Ópticas",
    "bairro": "Jardim Aquarius",
    "regiao": "Oeste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "SUV Híbrido e Patinete elétrico",
    "historia_resumida": "Projeta anéis de fibra e estações rádio-base de alta performance para o setor industrial e centros de pesquisa de SJC.",
    "dor_da_cidade": "Excesso de entraves em licenças ambientais e patrimoniais para passagem de dutos de telecomunicações subterrâneos.",
    "dor_pessoal": "Machismo estrutural velado no setor de engenharia de telecomunicações, tendo que provar sua competência técnica em dobro todos os dias.",
    "tensao_dramatica": "Entra em toda reunião de diretoria sabendo que vai ter que provar duas vezes o que qualquer colega prova uma. O corpo cobra o preço antes de cada apresentação, e ela chega dez minutos mais cedo só para se recompor sozinha.",
    "bordao": "A cidade só percebe o trabalho da engenharia quando a internet cai e o mundo inteiro para.",
    "habitos": {
      "alimentacao": "Pratos equilibrados da culinária mediterrânea, café expresso gourmet e smoothies funcionais com sementes.",
      "consumo": "Equipamentos de análise de espectro de radiofrequência, gadgets tecnológicos inteligentes e viagens internacionais.",
      "vestuario": "Tailleur executivo contemporâneo em cores sóbrias, camisas de seda e sapatos scarpin confortáveis.",
      "aversoes": "Negacionismo tecnológico, teorias da conspiração sobre redes sem fio e fornecedores que não cumprem SLA.",
      "paixoes": "Praticar corrida de rua na Praça Ulisses Guimarães, leitura sobre inteligência artificial e degustação de vinhos brancos."
    },
    "lugares_frequenta": [
      "Praça Ulisses Guimarães",
      "Colinas Shopping",
      "Restaurantes da Av. São João"
    ],
    "veiculos_midia": [
      "Life Informa (@lifeinforma)",
      "Valor Econômico (@valoreconomico)"
    ],
    "influenciadores_seguidos": [
      "Carlos Abranches (@carlosabranchesoficial)",
      "Sanja Dicas (@sanjadicas)"
    ],
    "estilo_consumo_tag": "Telecomunicações & Inovação",
    "foto": "data_personas/imagens_personagens/personagem_55_renata_vasconcelos.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "nome_substituido_para_desacoplar_de_informante_real",
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_55_renata_vasconcelos.jpg"
  },
  {
    "id": 56,
    "nome_completo": "Bruno 'Brunão' Marins",
    "idade": 34,
    "genero": "Homem",
    "raca_cor": "Negro",
    "profissao": "Mestre Charcuteiro & Produtor de Defumados",
    "bairro": "Bosque dos Ipês",
    "regiao": "Sul",
    "movimento_cultural": "Empreendedorismo Intuitivo",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Picape utilitária média a diesel",
    "historia_resumida": "Fabrica linguiças artesanais e costelas defumadas em pit smoker no Bosque dos Ipês, fornecendo para eventos e feirinhas gastronômicas.",
    "dor_da_cidade": "Alta nos custos de carnes selecionadas e embalagens a vácuo para distribuição.",
    "dor_pessoal": "Exaustão física de trabalhar sob calor intenso de fornos e defumadores na madrugada e a incompreensão da família sobre seu estilo de vida rústico.",
    "tensao_dramatica": "Em festas de família onde não pode opinar, come escondido linguiça industrializada comum com pão francês sentindo uma culpa infantil.",
    "bordao": "Fumaça boa não engana o paladar: sabor artesanal exige tempo e lenha nobre.",
    "habitos": {
      "alimentacao": "Costelinha suína ao molho barbecue autoral, brisket defumado por doze horas, picles artesanais e cerveja gelada.",
      "consumo": "Pit smokers industriais de fluxo reverso, termômetros sem fio de alta precisão e facas artesanais de aço damasco.",
      "vestuario": "Aventais pesados de couro legítimo, camisetas pretas estampadas com sua marca e bonés de aba curva.",
      "aversoes": "Carnes ressecadas mal preparadas e pessoas que colocam água no carvão do churrasco.",
      "paixoes": "Participar de festivais de churrasco e barbecue pelo Brasil, criar novos molhos artesanais e ouvir rock clássico."
    },
    "lugares_frequenta": [
      "Praças do Bosque dos Ipês",
      "Shopping Jardim Oriente",
      "Feiras Gastronômicas de SJC"
    ],
    "veiculos_midia": [
      "Diário de SJC (@diariodesjc)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "influenciadores_seguidos": [
      "Netão Bom Beef (@netaobombeef)",
      "Bora Comer SJC (@boracomersjc)"
    ],
    "estilo_consumo_tag": "Barbecue Artesanal & Fumaça Nobre",
    "foto": "data_personas/imagens_personagens/personagem_56_bruno_brunao_marins.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_56_bruno_brunao_marins.jpg"
  },
  {
    "id": 57,
    "nome_completo": "Lúcia Helena Guimarães",
    "idade": 56,
    "genero": "Mulher",
    "raca_cor": "Branca",
    "profissao": "Assistente Social da Rede de Proteção Básica",
    "bairro": "Jardim Satélite",
    "regiao": "Sul",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Ônibus municipal e Linha Verde",
    "historia_resumida": "Atua em programas de segurança alimentar e apoio a famílias em extrema pobreza, articulando vagas em creches e postos de trabalho.",
    "dor_da_cidade": "Demora na fila de espera para exames de saúde especializados no SUS e desamparo de famílias sem teto.",
    "dor_pessoal": "O peso de testemunhar miséria e violência doméstica em série, e o medo de que a blindagem necessária para aguentar isso já tenha virado permanente.",
    "tensao_dramatica": "Aprendeu a não chorar no atendimento porque chorar não resolve fila nenhuma. O que a assusta é perceber que essa couraça, que ela construiu para trabalhar, começou a ir junto para casa.",
    "bordao": "Direito social não é esmola; é dignidade garantida pela Constituição.",
    "habitos": {
      "alimentacao": "Comida simples e saudável, café com pão na chapa nas padarias do bairro e sopas nutritivas à noite.",
      "consumo": "Livros de ciências sociais e direitos humanos em sebos, itens de higiene para doação e calçados confortáveis.",
      "vestuario": "Calças de tecido maleável confortáveis, blusas de algodão estampadas discretas e bolsas grandes utilitárias.",
      "aversoes": "Aporofobia, preconceito contra populações periféricas e desperdício de verbas públicas destinadas à assistência social.",
      "paixoes": "Participar de projetos voluntários de distribuição de alimentos, passear pelas praças do bairro e ouvir MPB."
    },
    "lugares_frequenta": [
      "Centro Comunitário da Zona Sul",
      "Mercado Municipal de SJC",
      "Vale Sul Shopping"
    ],
    "veiculos_midia": [
      "Portal G1 Vale (@g1valeparaiba)",
      "TV Vanguarda (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Carlos Abranches (@carlosabranchesoficial)",
      "Padre Júlio Lancellotti (@padrejulio.lancellotti)"
    ],
    "estilo_consumo_tag": "Humanitário & Assistência Social",
    "foto": "data_personas/imagens_personagens/personagem_57_lucia_helena_guimaraes.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica",
        "dor_pessoal_despatologizada"
      ]
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_57_lucia_helena_guimaraes.jpg"
  },
  {
    "id": 58,
    "nome_completo": "Guilherme 'Gui' Esteves",
    "idade": 31,
    "genero": "Homem",
    "raca_cor": "Pardo",
    "profissao": "Executivo de Contas Corporativas de Tecnologia",
    "bairro": "Urbanova",
    "regiao": "Oeste",
    "movimento_cultural": "A Cidade Prometida",
    "faixa_renda_narrativa": "Classe A",
    "meio_transporte_principal": "SUV Premium Alemão e Bicicleta de montanha",
    "historia_resumida": "Atende indústrias e holdings fechando contratos de automação de dados e segurança digital. Mora no Urbanova pelo contato com a natureza.",
    "dor_da_cidade": "Dificuldade de atrair parceiros estratégicos de grandes capitais que ainda veem o interior com visão provinciana.",
    "dor_pessoal": "Terror paralisante de não bater a meta trimestral e a dependência psicológica da validação constante em redes sociais corporativas.",
    "tensao_dramatica": "Financiou 100% da compra do carro de luxo alemão e das roupas de grife, vivendo no limite do endividamento para manter o networking na alta sociedade.",
    "bordao": "Reunião boa não é a que tem elogio, é a que termina com o diretor da fábrica pedindo o contrato pra assinar.",
    "habitos": {
      "alimentacao": "Pratos à base de salmão grelhado, jantares em restaurantes premiados da Vila Ema e cafés espressos de cápsula.",
      "consumo": "Gadgets da Apple de última geração, trajes esportivos de marcas premium e assinaturas de plataformas de negócios.",
      "vestuario": "Camisas polo de marcas renomadas, calças de corte slim e tênis esportivos casuais de couro legítimo.",
      "aversoes": "Reuniões comerciais desestruturadas sem tomada de decisão e promessas de entrega não cumpridas.",
      "paixoes": "Jogar futevôlei nas quadras do Urbanova, passear de lancha na represa nos fins de semana e viajar para o exterior."
    },
    "lugares_frequenta": [
      "Colinas Shopping",
      "Quadras de Areia do Urbanova",
      "Restaurantes da Vila Ema"
    ],
    "veiculos_midia": [
      "Valor Econômico (@valoreconomico)",
      "Life Informa (@lifeinforma)"
    ],
    "influenciadores_seguidos": [
      "Lucas Sanseverino (@lucassanseverino)",
      "Thiago Nigro (@thiago.nigro)"
    ],
    "estilo_consumo_tag": "Corporativo & Vendas de Alta Renda",
    "foto": "data_personas/imagens_personagens/personagem_58_guilherme_gui_esteves.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_58_guilherme_gui_esteves.jpg"
  },
  {
    "id": 59,
    "nome_completo": "Talita 'Tali' Rezende",
    "idade": 27,
    "genero": "Mulher",
    "raca_cor": "Parda",
    "profissao": "Coordenadora de Projetos de Artes Visuais",
    "bairro": "Vila Industrial",
    "regiao": "Leste",
    "movimento_cultural": "A Tribo Global",
    "faixa_renda_narrativa": "Classe C1",
    "meio_transporte_principal": "Bicicleta própria e Ônibus municipal",
    "historia_resumida": "Conecta grafiteiros, serigrafistas e músicos independentes para ocupações culturais em galpões industriais e praças de SJC.",
    "dor_da_cidade": "Pouco espaço e investimento público para manifestações artísticas contemporâneas e juventude periférica.",
    "dor_pessoal": "Precarização financeira crônica de viver de editais culturais incertos e a cobrança constante dos pais para prestar concurso público tradicional.",
    "tensao_dramatica": "Quando os editais atrasam, aceita fazer bicos de design de panfletos bregas para lojas populares de colchões para pagar o aluguel.",
    "bordao": "A arte que não incomoda o poder não é arte, é decoração de vitrine.",
    "habitos": {
      "alimentacao": "Petiscos vegetarianos criativos, chás naturais aromatizados com gengibre e cervejas artesanais do Vale.",
      "consumo": "Equipamentos de iluminação cênica portátil, cartazes em serigrafia autoral e livros de produção cultural.",
      "vestuario": "Roupas vintage garimpadas em brechós conceituais, jaquetas jeans customizadas e botas de cano curto.",
      "aversoes": "Censura artística, falta de pontualidade em montagens de palco e preconceito contra manifestações populares.",
      "paixoes": "Descobrir novos músicos e artistas plásticos do Vale, frequentar mostras no Sesc e cinema autoral."
    },
    "lugares_frequenta": [
      "Galpões da Vila Industrial",
      "Parque Vicentina Aranha",
      "Sesc SJC"
    ],
    "veiculos_midia": [
      "Explore SJC (@exploresjc)",
      "Meon Jornal (@meonjornal)"
    ],
    "influenciadores_seguidos": [
      "Sanja Dicas (@sanjadicas)",
      "Fica a Dica SJC (@ficaadicasjc)"
    ],
    "estilo_consumo_tag": "Cultura Independente & Vanguarda",
    "foto": "data_personas/imagens_personagens/personagem_59_talita_tali_rezende.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": []
    },
    "imagem_status": [
      "pendente_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_59_talita_tali_rezende.jpg"
  },
  {
    "id": 60,
    "nome_completo": "Antônio Carlos 'Tonho' Viana",
    "idade": 60,
    "genero": "Homem",
    "raca_cor": "Branco",
    "profissao": "Apicultor e Produtor de Mel Silvestre da Serra",
    "bairro": "São Francisco Xavier",
    "regiao": "Norte",
    "movimento_cultural": "Geografia da Inércia",
    "faixa_renda_narrativa": "Classe C2",
    "meio_transporte_principal": "Picape 4x4 e Cavalo de lida",
    "historia_resumida": "Mantém colmeias de abelhas nativas nas matas preservadas de SFX, produzindo mel puro e conscientizando produtores rurais vizinhos.",
    "dor_da_cidade": "Pulverização indiscriminada de defensivos em propriedades vizinhas que intoxica abelhas polinizadoras nativas.",
    "dor_pessoal": "Pesar constante ao ver as matas nativas sendo loteadas clandestinamente e a preocupação com o futuro da saúde da esposa idosa.",
    "tensao_dramatica": "Desconfia de médico e de exame, e resolve tudo com o que a serra dá. A esposa insiste, ele desconversa — e sabe que está adiando uma conversa que uma hora vai ter que ter.",
    "bordao": "Se a abelha sumir da serra, o homem não dura cinco anos na terra.",
    "habitos": {
      "alimentacao": "Mel silvestre puro no café da manhã, queijo da serra com broa de fubá e comida caipira feita no fogão a lenha.",
      "consumo": "Macacões de apicultor com tela especial, centrífugas extratoras de mel em aço inox e embalagens de vidro esterilizadas.",
      "vestuario": "Camisas de algodão grosso de manga comprida, calças de lida reforçadas, botinas de couro e chapéu de palha.",
      "aversoes": "Méis adulterados com xarope de açúcar vendidos em feiras clandestinas e desmatamento de florestas nativas.",
      "paixoes": "Observar a dança das abelhas nas floradas da serra, tocar viola caipira no alpendre e prosear com os vizinhos de SFX."
    },
    "lugares_frequenta": [
      "Vila de São Francisco Xavier",
      "Mirante da Pedra de São Francisco",
      "Feira de SFX"
    ],
    "veiculos_midia": [
      "Jornal de SFX (@sfx_noticias)",
      "Globo Rural (@redevanguarda)"
    ],
    "influenciadores_seguidos": [
      "Explore SFX (@exploresfx)",
      "Rota Gastronômica da Mantiqueira (@rotamantiqueira)"
    ],
    "estilo_consumo_tag": "Apicultura Sustentável & Serra",
    "foto": "data_personas/imagens_personagens/personagem_60_antonio_carlos_tonho_viana.jpg",
    "procedencia": {
      "camada": "composicao_ficcional_ancorada_em_pesquisa",
      "com_lastro_na_pesquisa": [
        "regiao",
        "faixa_renda_narrativa",
        "movimento_cultural",
        "meio_transporte_principal",
        "veiculos_midia",
        "influenciadores_seguidos",
        "dor_da_cidade"
      ],
      "elaboracao_ficcional": [
        "nome_completo",
        "idade",
        "genero",
        "raca_cor",
        "profissao",
        "historia_resumida",
        "dor_pessoal",
        "tensao_dramatica",
        "bordao",
        "habitos"
      ],
      "individuo_real_identificavel": false,
      "revisoes_aplicadas": [
        "identidade_redistribuida_para_quebrar_correlacao_raca_renda",
        "tensao_reescrita_sem_atribuicao_moral_criminal_ou_clinica"
      ]
    },
    "imagem_status": [
      "ok_8k"
    ],
    "imagem_url": "data_personas/imagens_personagens/personagem_60_antonio_carlos_tonho_viana.jpg"
  }
];
  window.PERSONAS_SJC_DATA = PERSONAS_SJC_DATA;

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


  // ================================================================
  // DOSSIÊ COMPLETO DAS 60 PERSONAS (BRIEFING OFICIAL COM 3D TILT & FLIP)
  // ================================================================

  const MOVIMENTO_COLORS = {
    'Geografia da Inércia': '#8B6914',
    'A Cidade Prometida': '#1A3A6B',
    'Mundo Globalizado': '#0E7E6E',
    'A Tribo Global': '#0E7E6E',
    'Consumo Intuitivo': '#C45200',
    'Empreendedorismo Intuitivo': '#C45200'
  };

  const MOVIMENTO_TOKENS = {
    'Geografia da Inércia': { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300', color: '#8B6914' },
    'A Cidade Prometida': { bg: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-300', color: '#1A3A6B' },
    'Mundo Globalizado': { bg: 'bg-teal-100', text: 'text-teal-900', border: 'border-teal-300', color: '#0E7E6E' },
    'A Tribo Global': { bg: 'bg-teal-100', text: 'text-teal-900', border: 'border-teal-300', color: '#0E7E6E' },
    'Consumo Intuitivo': { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-300', color: '#C45200' },
    'Empreendedorismo Intuitivo': { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-300', color: '#C45200' }
  };

  function getMovimentoColor(mov) {
    return MOVIMENTO_COLORS[mov] || '#8B6914';
  }

  function getMovimentoToken(mov) {
    return MOVIMENTO_TOKENS[mov] || { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', color: '#64748B' };
  }

  function deveUsarPlaceholder(persona) {
    if (!persona) return true;
    if (persona.imagem_status && persona.imagem_status.includes('ok')) {
      return false;
    }
    const idsAfetados = [4, 8, 11, 15, 22, 24, 25, 30, 32, 33, 35, 37, 39, 41, 47, 51, 53, 55, 58, 60];
    if (idsAfetados.includes(persona.id)) {
      return true;
    }
    return false;
  }

  let dossierFilters = {
    search: '',
    regiao: [],
    movimento: [],
    renda: [],
    faixaEtaria: [],
    genero: [],
    tag: []
  };

  let highlightedPersonaIds = new Set();

  function parseUrlParamsToFilters() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('search')) dossierFilters.search = params.get('search');
      if (params.get('regiao')) dossierFilters.regiao = params.get('regiao').split(',').filter(Boolean);
      if (params.get('movimento')) dossierFilters.movimento = params.get('movimento').split(',').filter(Boolean);
      if (params.get('renda')) dossierFilters.renda = params.get('renda').split(',').filter(Boolean);
      if (params.get('etaria')) dossierFilters.faixaEtaria = params.get('etaria').split(',').filter(Boolean);
      if (params.get('genero')) dossierFilters.genero = params.get('genero').split(',').filter(Boolean);
      if (params.get('tag')) dossierFilters.tag = params.get('tag').split(',').filter(Boolean);
    } catch (e) {}
  }

  function syncFiltersToUrl() {
    try {
      const params = new URLSearchParams();
      if (dossierFilters.search) params.set('search', dossierFilters.search);
      if (dossierFilters.regiao.length) params.set('regiao', dossierFilters.regiao.join(','));
      if (dossierFilters.movimento.length) params.set('movimento', dossierFilters.movimento.join(','));
      if (dossierFilters.renda.length) params.set('renda', dossierFilters.renda.join(','));
      if (dossierFilters.faixaEtaria.length) params.set('etaria', dossierFilters.faixaEtaria.join(','));
      if (dossierFilters.genero.length) params.set('genero', dossierFilters.genero.join(','));
      if (dossierFilters.tag.length) params.set('tag', dossierFilters.tag.join(','));

      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + (window.location.hash || '#personas');
      window.history.replaceState(null, '', newUrl);
    } catch (e) {}
  }

  function renderDossierView() {
    const container = document.getElementById('dossier-view-container');
    if (!container) return;

    parseUrlParamsToFilters();

    const regioes = ['Sul', 'Norte', 'Leste', 'Oeste', 'Centro', 'Sudeste'];
    const movimentos = ['Geografia da Inércia', 'A Cidade Prometida', 'Mundo Globalizado', 'Consumo Intuitivo'];
    const faixasEtarias = [
      { label: 'Até 25 anos', val: '0-25' },
      { label: '26 a 40 anos', val: '26-40' },
      { label: '41 a 60 anos', val: '41-60' },
      { label: '60+ anos', val: '60+' }
    ];
    const faixasRenda = ['Classe A', 'Classe B', 'Classe C1', 'Classe C2', 'Classe D/E'];
    const generos = ['Homem', 'Mulher'];

    const tagsSet = new Set();
    PERSONAS_SJC_DATA.forEach(p => {
      if (p.estilo_consumo_tag) tagsSet.add(p.estilo_consumo_tag);
    });
    const tags = Array.from(tagsSet).sort();

    container.innerHTML = `
      <div class="space-y-8 animate-in fade-in duration-300">
        
        <!-- Header do Dossiê -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
                  <i class="fa-solid fa-database"></i> Dossiê 60 Personas
                </span>
                <span id="dossier-count-badge" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-900">
                  Exibindo 60 de 60
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
                Censo Comportamental das 60 Personas de SJC
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Passe o cursor sobre os cards para o efeito 3D Tilt e ver o bordão. Clique no card para girar e ver os 5 hábitos, ou clique no botão para abrir o dossiê detalhado.
              </p>
            </div>

            <!-- Busca Rápida -->
            <div class="relative w-full md:w-80">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text" 
                id="dossier-search-input"
                placeholder="Buscar por nome, bairro, profissão..." 
                value="${dossierFilters.search}"
                class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all"
                oninput="window.handleDossierSearch(this.value)"
              />
            </div>
          </div>

          <!-- Grupos de Filtros Multi-Seleção -->
          <div class="space-y-4 pt-4 border-t border-slate-100 text-xs">
            
            <!-- Região -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] w-20">Região:</span>
              <div class="flex flex-wrap gap-1.5">
                ${regioes.map(r => `
                  <button type="button" 
                    onclick="window.toggleDossierFilter('regiao', '${r}')"
                    data-filter-group="regiao"
                    data-filter-val="${r}"
                    class="filter-pill px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${dossierFilters.regiao.includes(r) ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                  >
                    ${r}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Movimento Cultural -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] w-20">Movimento:</span>
              <div class="flex flex-wrap gap-1.5">
                ${movimentos.map(m => {
                  const token = getMovimentoToken(m);
                  const isSelected = dossierFilters.movimento.includes(m);
                  return `
                    <button type="button" 
                      onclick="window.toggleDossierFilter('movimento', '${m}')"
                      data-filter-group="movimento"
                      data-filter-val="${m}"
                      class="filter-pill px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected ? 'text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                      style="${isSelected ? `background-color: ${token.color};` : ''}"
                    >
                      ${m}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Faixa Etária -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] w-20">Idade:</span>
              <div class="flex flex-wrap gap-1.5">
                ${faixasEtarias.map(fe => `
                  <button type="button" 
                    onclick="window.toggleDossierFilter('faixaEtaria', '${fe.val}')"
                    data-filter-group="faixaEtaria"
                    data-filter-val="${fe.val}"
                    class="filter-pill px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${dossierFilters.faixaEtaria.includes(fe.val) ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                  >
                    ${fe.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Faixa de Renda -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] w-20">Renda:</span>
              <div class="flex flex-wrap gap-1.5">
                ${faixasRenda.map(fr => `
                  <button type="button" 
                    onclick="window.toggleDossierFilter('renda', '${fr}')"
                    data-filter-group="renda"
                    data-filter-val="${fr}"
                    class="filter-pill px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${dossierFilters.renda.includes(fr) ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                  >
                    ${fr}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Gênero -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] w-20">Gênero:</span>
              <div class="flex flex-wrap gap-1.5">
                ${generos.map(g => `
                  <button type="button" 
                    onclick="window.toggleDossierFilter('genero', '${g}')"
                    data-filter-group="genero"
                    data-filter-val="${g}"
                    class="filter-pill px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${dossierFilters.genero.includes(g) ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                  >
                    ${g}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Botão Limpar Filtros -->
            <div class="pt-2 flex items-center justify-between">
              <button type="button" 
                onclick="window.clearAllDossierFilters()"
                class="text-xs font-bold text-pink-600 hover:text-pink-700 underline cursor-pointer flex items-center gap-1.5"
              >
                <i class="fa-solid fa-filter-circle-xmark"></i> Limpar todos os filtros
              </button>
              <span class="text-[11px] text-slate-400">Clique nas cartas para virar frente/verso</span>
            </div>

          </div>
        </div>

        <!-- Grid das 60 Personas com FLIP e 3D Tilt -->
        <div id="dossier-cards-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
      </div>
    `;

    renderDossierCardsWithFlip();
  }

  function filterPersonas() {
    return PERSONAS_SJC_DATA.filter(p => {
      if (dossierFilters.search) {
        const q = dossierFilters.search.toLowerCase();
        const matchName = (p.nome_completo || '').toLowerCase().includes(q);
        const matchProf = (p.profissao || '').toLowerCase().includes(q);
        const matchBairro = (p.bairro || '').toLowerCase().includes(q);
        const matchMov = (p.movimento_cultural || '').toLowerCase().includes(q);
        const matchTag = (p.estilo_consumo_tag || '').toLowerCase().includes(q);
        if (!matchName && !matchProf && !matchBairro && !matchMov && !matchTag) return false;
      }

      if (dossierFilters.regiao.length > 0) {
        if (!dossierFilters.regiao.includes(p.regiao)) return false;
      }

      if (dossierFilters.movimento.length > 0) {
        if (!dossierFilters.movimento.includes(p.movimento_cultural)) return false;
      }

      if (dossierFilters.renda.length > 0) {
        if (!dossierFilters.renda.includes(p.faixa_renda_narrativa)) return false;
      }

      if (dossierFilters.faixaEtaria.length > 0) {
        const idade = p.idade;
        const matchAge = dossierFilters.faixaEtaria.some(fe => {
          if (fe === '0-25') return idade <= 25;
          if (fe === '26-40') return idade >= 26 && idade <= 40;
          if (fe === '41-60') return idade >= 41 && idade <= 60;
          if (fe === '60+') return idade > 60;
          return false;
        });
        if (!matchAge) return false;
      }

      if (dossierFilters.genero.length > 0) {
        if (!dossierFilters.genero.includes(p.genero)) return false;
      }

      if (dossierFilters.tag.length > 0) {
        if (!dossierFilters.tag.includes(p.estilo_consumo_tag)) return false;
      }

      return true;
    });
  }

  function renderDossierCardsWithFlip() {
    const grid = document.getElementById('dossier-cards-grid');
    const countBadge = document.getElementById('dossier-count-badge');
    if (!grid) return;

    const firstPositions = new Map();
    grid.querySelectorAll('.persona-card-wrapper').forEach(el => {
      const id = el.getAttribute('data-persona-id');
      if (id) {
        firstPositions.set(id, el.getBoundingClientRect());
      }
    });

    const filtered = filterPersonas();
    if (countBadge) {
      countBadge.textContent = `Exibindo ${filtered.length} de ${PERSONAS_SJC_DATA.length}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            <i class="fa-solid fa-users-slash"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800">Nenhuma persona encontrada</h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            Tente ajustar os filtros de região, movimento ou busca por texto para encontrar as personas correspondentes.
          </p>
          <button type="button" onclick="window.clearAllDossierFilters()" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer">
            Limpar todos os filtros
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => renderSinglePersona3x4Card(p)).join('');

    grid.querySelectorAll('.persona-card-wrapper').forEach(el => {
      const id = el.getAttribute('data-persona-id');
      const first = firstPositions.get(id);
      if (first) {
        const last = el.getBoundingClientRect();
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        if (deltaX !== 0 || deltaY !== 0) {
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          el.style.transition = 'none';
          requestAnimationFrame(() => {
            el.style.transition = 'transform 300ms cubic-bezier(0.2, 0, 0, 1)';
            el.style.transform = '';
          });
        }
      }
    });

    init3DTiltAndFlip();
  }

  function renderSinglePersona3x4Card(p) {
    const isSelected = highlightedPersonaIds.has(p.id);
    const isDimmed = highlightedPersonaIds.size > 0 && !isSelected;
    const movColor = getMovimentoColor(p.movimento_cultural);
    const usePlaceholder = deveUsarPlaceholder(p);
    const initialLetter = (p.nome_completo || 'P').charAt(0).toUpperCase();

    const h = p.habitos || {};
    const habitAlim = h.alimentacao || 'Padarias tradicionais e feiras locais.';
    const habitCons = h.consumo || 'Comércio de bairro planejado.';
    const habitVest = h.vestuario || 'Estilo urbano casual.';
    const habitAver = h.aversoes || 'Atendimento desumanizado.';
    const habitPaix = h.paixoes || 'Momentos em família e ar livre.';

    return `
      <div 
        class="persona-card-wrapper relative w-full select-none ${isSelected ? 'persona--selected ring-4 ring-pink-500 rounded-2xl shadow-xl' : ''} ${isDimmed ? 'persona--dimmed opacity-40 grayscale-75 scale-95' : ''} transition-all duration-300"
        data-persona-id="${p.id}"
        style="perspective: 1000px;"
      >
        <!-- Card 3:4 Container com Flipping -->
        <div 
          class="persona-flipper relative w-full rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden border border-slate-200/80 bg-white"
          style="aspect-ratio: 3 / 4; transform-style: preserve-3d;"
          onclick="window.handlePersonaCardClick(event, ${p.id})"
        >
          
          <!-- ==================== FRENTE DO CARD (3:4) ==================== -->
          <div 
            class="persona-card-front absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden bg-slate-900 text-white"
            style="backface-visibility: hidden; transform: rotateY(0deg);"
          >
            <!-- Imagem / Placeholder -->
            <div class="absolute inset-0 w-full h-full z-0 overflow-hidden">
              ${!usePlaceholder ? `
                <img 
                  src="${p.foto || p.imagem_url}" 
                  alt="${p.nome_completo}"
                  class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onerror="this.parentElement.innerHTML = '<div class=\\'w-full h-full flex items-center justify-center font-black text-6xl text-white\\' style=\\'background-color: ${movColor};\\' >${initialLetter}</div>';"
                />
              ` : `
                <div class="w-full h-full flex flex-col items-center justify-center font-black text-white p-6 relative overflow-hidden" style="background-color: ${movColor};">
                  <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <span class="text-7xl font-black tracking-tighter drop-shadow-md">${initialLetter}</span>
                  <span class="text-[11px] font-extrabold uppercase tracking-widest text-white/80 mt-2">${p.movimento_cultural}</span>
                </div>
              `}

              <div class="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none"></div>
              <div class="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none"></div>
            </div>

            <!-- Topo da Frente: ID Badge & Tag de Renda -->
            <div class="relative z-10 p-3.5 flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-md border border-white/20">
                #${String(p.id).padStart(2, '0')}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
                ${p.faixa_renda_narrativa || p.faixa_renda}
              </span>
            </div>

            <!-- Base da Frente: Overlay com Bordão + Info -->
            <div class="relative z-10 p-4 space-y-1">
              <div class="persona-bordao-overlay transition-all duration-300 transform translate-y-2 opacity-0 text-[11px] font-bold italic text-pink-200 bg-black/70 backdrop-blur-sm p-2 rounded-xl border border-white/10 mb-1 leading-snug">
                "${p.bordao || p.frase_sintese || 'São José dos Campos é o meu lugar.'}"
              </div>

              <div class="space-y-0.5">
                <h3 class="text-base font-black text-white tracking-tight leading-tight drop-shadow-sm line-clamp-1">
                  ${p.nome_completo}
                </h3>
                <p class="text-[13px] font-semibold text-slate-200 line-clamp-1">
                  ${p.idade} anos • ${p.profissao}
                </p>
                <p class="text-[12px] font-medium text-slate-300 flex items-center gap-1 line-clamp-1">
                  <i class="fa-solid fa-location-dot text-pink-400 text-[10px]"></i>
                  ${p.bairro} (${p.regiao})
                </p>
              </div>
            </div>

            <!-- Faixa Inferior de Movimento Cultural (28px) -->
            <div 
              class="relative z-10 h-7 px-3.5 flex items-center justify-between text-[11px] font-black text-white shrink-0"
              style="background-color: ${movColor};"
            >
              <span class="truncate uppercase tracking-wider text-[10px]">${p.movimento_cultural}</span>
              <i class="fa-solid fa-rotate text-[10px] opacity-80" title="Clique para virar"></i>
            </div>
          </div>


          <!-- ==================== VERSO DO CARD (3:4) ==================== -->
          <div 
            class="persona-card-back absolute inset-0 w-full h-full bg-slate-900 text-slate-100 flex flex-col justify-between p-4 overflow-hidden"
            style="backface-visibility: hidden; transform: rotateY(180deg);"
          >
            <!-- Header do Verso -->
            <div class="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black text-white">#${p.id} ${p.nome_completo.split(' ')[0]}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">${p.regiao}</span>
                </div>
                <p class="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">${p.profissao}</p>
              </div>
              <button 
                type="button" 
                onclick="event.stopPropagation(); window.openPersonaModal(${p.id})"
                class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-pink-600 hover:bg-pink-700 text-white transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>Dossiê</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </button>
            </div>

            <!-- Scroll Interno dos 5 Hábitos Canônicos -->
            <div class="flex-1 overflow-y-auto custom-card-scroll py-2.5 space-y-2.5 text-[11px] pr-1">
              
              <div class="space-y-0.5 bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                <span class="text-[9px] font-black uppercase tracking-wider text-pink-400 block">Perfil & História</span>
                <p class="text-slate-300 leading-snug font-medium text-[11px]">${p.historia_resumida}</p>
              </div>

              <div class="space-y-1 bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                <span class="text-[9px] font-black uppercase tracking-wider text-amber-400 block">Dores & Tensões</span>
                <p class="text-slate-300 leading-snug font-medium text-[10px]">
                  <strong class="text-slate-100">Cidade:</strong> ${p.dor_da_cidade || p.dor_principal || 'Trânsito e mobilidade regional.'}
                </p>
                <p class="text-slate-300 leading-snug font-medium text-[10px]">
                  <strong class="text-slate-100">Pessoal:</strong> ${p.dor_pessoal || 'Equilíbrio financeiro e segurança.'}
                </p>
              </div>

              <div class="space-y-1 bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                <span class="text-[9px] font-black uppercase tracking-wider text-teal-400 block">5 Hábitos Canônicos</span>
                
                <div class="space-y-1 text-[10px]">
                  <p class="text-slate-300"><strong class="text-slate-100">• Alimentação:</strong> ${habitAlim}</p>
                  <p class="text-slate-300"><strong class="text-slate-100">• Consumo:</strong> ${habitCons}</p>
                  <p class="text-slate-300"><strong class="text-slate-100">• Vestuário:</strong> ${habitVest}</p>
                  <p class="text-slate-300"><strong class="text-slate-100">• Aversões:</strong> ${habitAver}</p>
                  <p class="text-slate-300"><strong class="text-slate-100">• Paixões:</strong> ${habitPaix}</p>
                </div>
              </div>

            </div>

            <!-- Rodapé do Verso -->
            <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
              <span class="truncate max-w-[170px] font-semibold text-slate-300">${p.estilo_consumo_tag || 'Consumo Geral'}</span>
              <span class="text-[9px] text-pink-400 font-bold">Clique p/ virar <i class="fa-solid fa-rotate-left ml-0.5"></i></span>
            </div>

          </div>

        </div>
      </div>
    `;
  }

  function init3DTiltAndFlip() {
    const wrappers = document.querySelectorAll('.persona-card-wrapper');
    wrappers.forEach(wrapper => {
      const flipper = wrapper.querySelector('.persona-flipper');
      const bordao = wrapper.querySelector('.persona-bordao-overlay');

      wrapper.addEventListener('mousemove', (e) => {
        if (wrapper.classList.contains('is-flipped')) return;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;

        flipper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        if (bordao) {
          bordao.style.opacity = '1';
          bordao.style.transform = 'translateY(0)';
        }
      });

      wrapper.addEventListener('mouseleave', () => {
        if (wrapper.classList.contains('is-flipped')) {
          flipper.style.transform = 'perspective(1000px) rotateY(180deg)';
        } else {
          flipper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
        if (bordao) {
          bordao.style.opacity = '0';
          bordao.style.transform = 'translateY(8px)';
        }
      });
    });
  }

  window.handlePersonaCardClick = function(e, id) {
    if (e.target.closest('button') || e.target.closest('a')) return;
    const wrapper = document.querySelector(`.persona-card-wrapper[data-persona-id="${id}"]`);
    if (!wrapper) return;
    const flipper = wrapper.querySelector('.persona-flipper');
    if (!flipper) return;

    wrapper.classList.toggle('is-flipped');
    if (wrapper.classList.contains('is-flipped')) {
      flipper.style.transform = 'perspective(1000px) rotateY(180deg)';
    } else {
      flipper.style.transform = 'perspective(1000px) rotateY(0deg)';
    }
  };

  window.toggleDossierFilter = function(group, val) {
    if (!dossierFilters[group]) dossierFilters[group] = [];
    const idx = dossierFilters[group].indexOf(val);
    if (idx === -1) {
      dossierFilters[group].push(val);
    } else {
      dossierFilters[group].splice(idx, 1);
    }
    syncFiltersToUrl();
    renderDossierView();
  };

  window.handleDossierSearch = function(val) {
    dossierFilters.search = val.trim();
    syncFiltersToUrl();
    renderDossierCardsWithFlip();
  };

  window.clearAllDossierFilters = function() {
    dossierFilters = {
      search: '',
      regiao: [],
      movimento: [],
      renda: [],
      faixaEtaria: [],
      genero: [],
      tag: []
    };
    const searchInput = document.getElementById('dossier-search-input');
    if (searchInput) searchInput.value = '';
    syncFiltersToUrl();
    renderDossierView();
  };

  window.updateDossierSearch = window.handleDossierSearch;
  window.updateDossierFilter = window.toggleDossierFilter;
  window.resetDossierFilters = window.clearAllDossierFilters;

  window.highlightPersonas = function(ids) {
    highlightedPersonaIds = new Set(ids);
    renderDossierCardsWithFlip();
  };

  window.clearHighlight = function() {
    highlightedPersonaIds.clear();
    renderDossierCardsWithFlip();
  };

  function openPersonaModal(id) {
    const persona = PERSONAS_SJC_DATA.find(p => p.id === id);
    if (!persona) return;

    const modal = document.getElementById('persona-modal');
    if (!modal) return;

    const avatar = document.getElementById('modal-persona-avatar');
    const name = document.getElementById('modal-persona-name');
    const movimento = document.getElementById('modal-persona-movimento');
    const title = document.getElementById('modal-persona-title');
    const location = document.getElementById('modal-persona-location');
    const frase = document.getElementById('modal-persona-frase');
    const dor = document.getElementById('modal-persona-dor');
    const habitos = document.getElementById('modal-persona-habitos');
    const influenciadores = document.getElementById('modal-persona-influenciadores');

    const movColor = getMovimentoColor(persona.movimento_cultural);
    const usePlaceholder = deveUsarPlaceholder(persona);

    if (avatar) {
      if (!usePlaceholder) {
        avatar.innerHTML = `<img src="${persona.foto || persona.imagem_url}" alt="${persona.nome_completo}" class="w-full h-full object-cover rounded-2xl" />`;
        avatar.style.backgroundColor = 'transparent';
      } else {
        avatar.innerHTML = persona.nome_completo.charAt(0);
        avatar.style.backgroundColor = movColor;
      }
    }

    if (name) name.textContent = persona.nome_completo;
    if (movimento) {
      movimento.textContent = persona.movimento_cultural;
      movimento.style.borderColor = movColor;
      movimento.style.color = movColor;
      movimento.style.backgroundColor = '#F8FAFC';
    }
    if (title) title.textContent = `${persona.idade} anos • ${persona.profissao} • ${persona.faixa_renda_narrativa || persona.faixa_renda}`;
    if (location) location.innerHTML = `<i class="fa-solid fa-location-dot mr-1"></i> ${persona.bairro} (${persona.regiao}) • Transporte: ${persona.meio_transporte_principal}`;
    if (frase) frase.textContent = persona.bordao || persona.frase_sintese || 'Sem bordão registrado.';
    if (dor) {
      dor.innerHTML = `
        <div class="space-y-2">
          <p><strong class="text-slate-800">História:</strong> ${persona.historia_resumida}</p>
          <p><strong class="text-slate-800">Dor da Cidade:</strong> ${persona.dor_da_cidade || persona.dor_principal}</p>
          <p><strong class="text-slate-800">Dor Pessoal:</strong> ${persona.dor_pessoal || 'Manutenção da estabilidade e renda.'}</p>
          <p><strong class="text-slate-800">Tensão Dramática:</strong> ${persona.tensao_dramatica || 'Busca por validação e futuro melhor.'}</p>
        </div>
      `;
    }

    if (habitos) {
      const h = persona.habitos || {};
      habitos.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-1">🍽️ Alimentação</span>
            <p class="text-slate-600">${h.alimentacao || '-'}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-1">🛍️ Consumo</span>
            <p class="text-slate-600">${h.consumo || '-'}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-1">👔 Vestuário</span>
            <p class="text-slate-600">${h.vestuario || '-'}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-900 block mb-1">🚫 Aversões</span>
            <p class="text-slate-600">${h.aversoes || '-'}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
            <span class="font-bold text-slate-900 block mb-1">❤️ Paixões</span>
            <p class="text-slate-600">${h.paixoes || '-'}</p>
          </div>
        </div>
      `;
    }

    if (influenciadores) {
      const midias = (persona.veiculos_midia || []).map(m => typeof m === 'object' ? m.nome : m).join(', ');
      const influs = (persona.influenciadores_seguidos || []).map(i => typeof i === 'object' ? i.nome : i).join(', ');
      const lugares = (persona.lugares_frequenta || persona.lugares_frequenta_sjc || []).join(', ');
      influenciadores.innerHTML = `
        <div class="space-y-2 text-xs">
          <p><strong class="text-slate-800">Lugares que frequenta:</strong> ${lugares || '-'}</p>
          <p><strong class="text-slate-800">Mídias Locais:</strong> ${midias || '-'}</p>
          <p><strong class="text-slate-800">Influenciadores:</strong> ${influs || '-'}</p>
        </div>
      `;
    }

    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closePersonaModal() {
    const modal = document.getElementById('persona-modal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
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



  // ==========================================
  // EXPORTAÇÕES GLOBAIS E INICIALIZAÇÃO
  // ==========================================

  window.resetPersonasFilters = function() {
    clearAllDossierFilters();
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
  window.openPersonaModal = openPersonaModal;
  window.closePersonaModal = closePersonaModal;
  window.renderDossierView = renderDossierView;
  window.renderOracleView = renderOracleView;
  window.startOracleGame = function(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    oracleScreenState = 'game';
    currentOracleStep = 1;
    renderOracleView();
  };

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

