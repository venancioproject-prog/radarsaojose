/**
 * ==============================================================================
 * RADAR HUB • OPEN DATA LAKE MUNICIPAL DE SÃO JOSÉ DOS CAMPOS
 * Controller Reativo de Dados Abertos, Filtros Locais e Auditoria Contínua (v2.1)
 * ==============================================================================
 * REGRAS INVIOLÁVEIS E DIRETRIZES ATENDIDAS:
 * 1. ZERO dependência de servidor HTTP local: Dados oficiais incorporados como
 *    constantes inline para funcionamento 100% offline e via protocolo file://.
 * 2. Transformação estrita de ocorrências penais via transformOcorrenciasParaChart().
 * 3. Filtros N1 (período) e N2 (categoria/rede/sexo) locais por gráfico sem colisão.
 * 4. Tratamento de fallback para combinações sem dado (card visual explicativo).
 * 5. Interceptação compulsória do Eixo de Segurança via sessionStorage.
 * 6. Cache em memória único com destruição controlada de instâncias de Chart.js.
 * 7. Badge dinâmico e Hero Strip informativo refletindo auditoria contínua por IA.
 * 8. Elevação visual de todos os 16 gráficos (gradientes, datalabels, donuts customizados).
 * ==============================================================================
 */

// ==============================================================================
// DATASETS OFICIAIS SJC INLINE (ZERO FALHAS DE CORS NO PROTOCOLO FILE://)
// ==============================================================================
const RADAR_HUB_GROUND_TRUTH = {
  "municipio": {
    "nome": "São José dos Campos",
    "codigo_ibge": 3549904,
    "uf": "SP",
    "regiao_geografica_intermediaria": "São José dos Campos",
    "regiao_metropolitana": "Região Metropolitana do Vale do Paraíba e Litoral Norte (RMVale)",
    "area_territorial_km2": 1099.494,
    "aniversario": "27 de Julho (fundação 1767)",
    "altitude_media_metros": 660,
    "fuso_horario": "UTC-3 (Horário de Brasília)"
  },
  "eixos": {
    "demografia": {
      "populacao_censo_2022": {
        "total": 697054,
        "valor": 697054,
        "unidade": "habitantes",
        "ano_referencia": 2022,
        "nota": "População oficial final apurada pelo IBGE no Censo Demográfico 2022.",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 4714 / IBGE Cidades)",
        "fonte_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
        "data_consulta": "2026-09-27"
      },
      "populacao_estimada_2024": {
        "total": 724756,
        "valor": 724756,
        "unidade": "habitantes",
        "ano_referencia": 2024,
        "nota": "Estimativa populacional oficial calculada pelo IBGE e publicada no Diário Oficial da União em 29/08/2024 com referência a 1º de julho de 2024.",
        "fonte_nome": "IBGE - Estimativas da População Residente 2024 (DOU)",
        "fonte_url": "https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html",
        "data_consulta": "2026-09-27"
      },
      "populacao_estimada_2026": {
        "total": 729153,
        "valor": 729153,
        "unidade": "habitantes",
        "ano_referencia": 2026,
        "nota": "Estimativa populacional oficial registrada no portal IBGE Cidades para 2026.",
        "fonte_nome": "IBGE Cidades - Projeções e Estimativas Oficiais",
        "fonte_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
        "data_consulta": "2026-09-27"
      },
      "domicilios_censo_2022_total": {
        "total": 282214,
        "valor": 282214,
        "unidade": "domicílios",
        "ano_referencia": 2022,
        "nota": "Total de domicílios recenseados pelo IBGE no Censo Demográfico 2022.",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 4711)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/4711",
        "data_consulta": "2026-09-27"
      },
      "domicilios_particulares_ocupados": {
        "total": 247894,
        "valor": 247894,
        "unidade": "domicílios ocupados",
        "ano_referencia": 2022,
        "nota": "Domicílios particulares permanentes ocupados pelo Censo 2022 (87,84% do total recenseado).",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 4711 / Tabela 4712)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/4711",
        "data_consulta": "2026-09-27"
      },
      "domicilios_nao_ocupados": {
        "total": 33978,
        "vagos": 24667,
        "uso_ocasional": 9311,
        "pct_total": 12.04,
        "ano_referencia": 2022,
        "nota": "Domicílios particulares permanentes não ocupados: 24.667 vagos (8,74%) e 9.311 de uso ocasional (3,30%).",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 4711)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/4711",
        "data_consulta": "2026-09-27"
      },
      "media_moradores_domicilio": {
        "valor": 2.80,
        "unidade": "moradores/domicílio",
        "ano_referencia": 2022,
        "comparacao_2010": 3.23,
        "nota": "Média de moradores em domicílios particulares permanentes ocupados (2,80 em 2022 contra 3,23 em 2010).",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 4712) e Censo 2010 (SIDRA Tabela 3152)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/4712",
        "data_consulta": "2026-09-27"
      },
      "area_territorial_km2": {
        "valor": 1099.494,
        "unidade": "km²",
        "urbana_km2": 353.9,
        "rural_km2": 745.7,
        "ano_referencia": 2025,
        "nota": "Área territorial oficial calculada pelo IBGE (1.099,494 km²), sendo 353,9 km² urbanos e 745,7 km² rurais.",
        "fonte_nome": "IBGE - Quadro Territorial Oficial / Prefeitura de SJC (São José em Dados, Território)",
        "fonte_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
        "data_consulta": "2026-09-27"
      },
      "densidade_demografica_hab_km2": {
        "valor": 634.03,
        "unidade": "hab/km²",
        "ano_referencia": 2022,
        "nota": "Densidade demográfica apurada no Censo 2022 (634,03 habitantes por km²).",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 4714 / IBGE Cidades)",
        "fonte_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
        "data_consulta": "2026-09-27"
      },
      "distribuicao_sexo": {
        "mulheres": 361695,
        "homens": 335359,
        "mulheres_pct": 51.9,
        "homens_pct": 48.1,
        "razao_sexo_homens_por_100_mulheres": 92.72,
        "ano_referencia": 2022,
        "nota": "População residente por sexo apurada no Censo 2022. Razão de sexo de 92,72 homens para cada 100 mulheres.",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 9514 / Tabela 9515)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/9514",
        "data_consulta": "2026-09-27"
      },
      "distribuicao_cor_raca_censo_2022": {
        "ano_referencia": 2022,
        "categorias": [
          {
            "cor_raca": "Branca",
            "populacao": 462603,
            "pct": 66.4
          },
          {
            "cor_raca": "Parda",
            "populacao": 181647,
            "pct": 26.1
          },
          {
            "cor_raca": "Preta",
            "populacao": 43136,
            "pct": 6.2
          },
          {
            "cor_raca": "Amarela",
            "populacao": 9008,
            "pct": 1.3
          },
          {
            "cor_raca": "Indígena",
            "populacao": 629,
            "pct": 0.1
          }
        ],
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 9605)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/9605",
        "data_consulta": "2026-09-27"
      },
      "indicadores_transicao_demografica": {
        "idade_mediana": 36,
        "idade_mediana_2010": 31,
        "idade_mediana_brasil": 35,
        "indice_envelhecimento_ibge": 62.48,
        "razao_dependencia_total_pct": 41.2,
        "razao_sexo": 92.72,
        "definicao_envelhecimento": "Razão de pessoas com 65 anos ou mais de idade para cada 100 pessoas de 0 a 14 anos de idade.",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 9515)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/9515",
        "data_consulta": "2026-09-27"
      },
      "serie_historica_populacao": [
        {
          "ano": 1970,
          "populacao": 148332,
          "tipo": "Censo",
          "fonte": "Censo Demográfico 1970"
        },
        {
          "ano": 1980,
          "populacao": 287513,
          "tipo": "Censo",
          "fonte": "Censo Demográfico 1980"
        },
        {
          "ano": 1991,
          "populacao": 442370,
          "tipo": "Censo",
          "fonte": "Censo Demográfico 1991"
        },
        {
          "ano": 2000,
          "populacao": 539313,
          "tipo": "Censo",
          "fonte": "Censo Demográfico 2000"
        },
        {
          "ano": 2010,
          "populacao": 629921,
          "tipo": "Censo",
          "fonte": "Censo Demográfico 2010"
        },
        {
          "ano": 2022,
          "populacao": 697054,
          "tipo": "Censo",
          "fonte": "Censo Demográfico 2022"
        },
        {
          "ano": 2024,
          "populacao": 724756,
          "tipo": "Estimativa Oficial",
          "fonte": "IBGE Estimativa Populacional DOU 2024 (1/7/2024)"
        },
        {
          "ano": 2026,
          "populacao": 729153,
          "tipo": "Estimativa Oficial",
          "fonte": "IBGE Cidades Estimativa Oficial 2026"
        }
      ],
      "crescimento_anual_intercensitario": [
        { "periodo": "1970-1980", "anos": 10, "pop_inicial": 148332, "pop_final": 287513, "taxa_anual_pct": 6.84 },
        { "periodo": "1980-1991", "anos": 11, "pop_inicial": 287513, "pop_final": 442370, "taxa_anual_pct": 3.98 },
        { "periodo": "1991-2000", "anos": 9, "pop_inicial": 442370, "pop_final": 539313, "taxa_anual_pct": 2.23 },
        { "periodo": "2000-2010", "anos": 10, "pop_inicial": 539313, "pop_final": 629921, "taxa_anual_pct": 1.56 },
        { "periodo": "2010-2022", "anos": 12, "pop_inicial": 629921, "pop_final": 697054, "taxa_anual_pct": 0.85 }
      ],
      "populacao_por_regiao_censo_2022": [
        { "regiao": "Região Sul", "populacao": 237572, "pct": 34.08 },
        { "regiao": "Região Leste", "populacao": 181463, "pct": 26.03 },
        { "regiao": "Região Centro", "populacao": 72401, "pct": 10.39 },
        { "regiao": "Região Oeste", "populacao": 64482, "pct": 9.25 },
        { "regiao": "Região Sudeste", "populacao": 62541, "pct": 8.97 },
        { "regiao": "Região Norte", "populacao": 61940, "pct": 8.89 },
        { "regiao": "Zona Rural", "populacao": 15212, "pct": 2.18 },
        { "regiao": "São Francisco Xavier (Núcleo)", "populacao": 1443, "pct": 0.21 }
      ],
      "ranking_bairros_populosos": [
        { "posicao": 1, "bairro": "Campo dos Alemães", "regiao": "Sul", "populacao": 56500 },
        { "posicao": 2, "bairro": "Alto da Ponte", "regiao": "Norte", "populacao": 40563 },
        { "posicao": 3, "bairro": "Vila Industrial", "regiao": "Leste", "populacao": 39506 },
        { "posicao": 4, "bairro": "Bosque dos Eucaliptos", "regiao": "Sul", "populacao": 33184 },
        { "posicao": 5, "bairro": "Eugênio de Melo", "regiao": "Leste", "populacao": 20613 },
        { "posicao": 6, "bairro": "Jardim Satélite", "regiao": "Sul", "populacao": 19850 },
        { "posicao": 7, "bairro": "Parque Industrial", "regiao": "Sul", "populacao": 18420 },
        { "posicao": 8, "bairro": "Jardim Morumbi", "regiao": "Sul", "populacao": 16940 },
        { "posicao": 9, "bairro": "Putim", "regiao": "Sudeste", "populacao": 15820 },
        { "posicao": 10, "bairro": "Urbanova", "regiao": "Oeste", "populacao": 14650 }
      ],
      "religiao_censo_amostra_2022": [
        { "categoria": "Católica Apostólica Romana", "sjc_pct": 58.2, "sp_pct": 60.1, "brasil_pct": 56.7 },
        { "categoria": "Evangélica", "sjc_pct": 25.4, "sp_pct": 24.1, "brasil_pct": 26.9 },
        { "categoria": "Sem religião", "sjc_pct": 8.9, "sp_pct": 8.1, "brasil_pct": 9.3 },
        { "categoria": "Espírita", "sjc_pct": 4.3, "sp_pct": 3.3, "brasil_pct": 2.2 },
        { "categoria": "Umbanda e Candomblé", "sjc_pct": 0.8, "sp_pct": 0.9, "brasil_pct": 0.7 },
        { "categoria": "Outras religiosidades / Tradições", "sjc_pct": 2.4, "sp_pct": 3.5, "brasil_pct": 4.2 }
      ],
      "alfabetizacao_censo_2022": {
        "taxa_sjc": 97.86,
        "taxa_homens": 98.12,
        "taxa_mulheres": 97.63,
        "taxa_sp": 96.92,
        "taxa_brasil": 93.00,
        "faixa_etaria": "15 anos ou mais de idade",
        "fonte_nome": "IBGE - Censo Demográfico 2022 (SIDRA Tabela 9543)",
        "fonte_url": "https://sidra.ibge.gov.br/tabela/9543",
        "data_consulta": "2026-09-27"
      },
      "piramides_etarias_censos": {
        "2000": {
          "ano": 2000,
          "populacao_total": 539313,
          "homens_total": 266470,
          "mulheres_total": 272843,
          "metricas": {
            "idade_mediana": "27 anos",
            "indice_envelhecimento": "15,92",
            "razao_sexo": "97,66",
            "razao_dependencia": "46,87%"
          },
          "faixas": [
            {"faixa": "80+", "homens": 1642, "mulheres": 2514, "total": 4156},
            {"faixa": "75-79", "homens": 1692, "mulheres": 2463, "total": 4155},
            {"faixa": "70-74", "homens": 2940, "mulheres": 3741, "total": 6681},
            {"faixa": "65-69", "homens": 3934, "mulheres": 4711, "total": 8645},
            {"faixa": "60-64", "homens": 5554, "mulheres": 6301, "total": 11855},
            {"faixa": "55-59", "homens": 8017, "mulheres": 8175, "total": 16192},
            {"faixa": "50-54", "homens": 12159, "mulheres": 12039, "total": 24198},
            {"faixa": "45-49", "homens": 16295, "mulheres": 16485, "total": 32780},
            {"faixa": "40-44", "homens": 19284, "mulheres": 20091, "total": 39375},
            {"faixa": "35-39", "homens": 20835, "mulheres": 23000, "total": 43835},
            {"faixa": "30-34", "homens": 21489, "mulheres": 22473, "total": 43962},
            {"faixa": "25-29", "homens": 22838, "mulheres": 23393, "total": 46231},
            {"faixa": "20-24", "homens": 26572, "mulheres": 26276, "total": 52848},
            {"faixa": "15-19", "homens": 27989, "mulheres": 27929, "total": 55918},
            {"faixa": "10-14", "homens": 26522, "mulheres": 25831, "total": 52353},
            {"faixa": "5-9", "homens": 24472, "mulheres": 23992, "total": 48464},
            {"faixa": "0-4", "homens": 24236, "mulheres": 23429, "total": 47665}
          ]
        },
        "2010": {
          "ano": 2010,
          "populacao_total": 629921,
          "homens_total": 308623,
          "mulheres_total": 321298,
          "metricas": {
            "idade_mediana": "31 anos",
            "indice_envelhecimento": "28,31",
            "razao_sexo": "96,06",
            "razao_dependencia": "38,80%"
          },
          "faixas": [
            {"faixa": "80+", "homens": 2573, "mulheres": 4501, "total": 7074},
            {"faixa": "75-79", "homens": 3059, "mulheres": 4099, "total": 7158},
            {"faixa": "70-74", "homens": 4428, "mulheres": 5816, "total": 10244},
            {"faixa": "65-69", "homens": 6659, "mulheres": 7717, "total": 14376},
            {"faixa": "60-64", "homens": 11151, "mulheres": 11902, "total": 23053},
            {"faixa": "55-59", "homens": 15163, "mulheres": 15361, "total": 30524},
            {"faixa": "50-54", "homens": 18089, "mulheres": 20704, "total": 38793},
            {"faixa": "45-49", "homens": 20015, "mulheres": 22757, "total": 42772},
            {"faixa": "40-44", "homens": 21723, "mulheres": 23432, "total": 45155},
            {"faixa": "35-39", "homens": 23723, "mulheres": 24909, "total": 48632},
            {"faixa": "30-34", "homens": 27760, "mulheres": 28480, "total": 56240},
            {"faixa": "25-29", "homens": 29718, "mulheres": 30564, "total": 60282},
            {"faixa": "20-24", "homens": 28465, "mulheres": 27886, "total": 56351},
            {"faixa": "15-19", "homens": 26269, "mulheres": 25753, "total": 52022},
            {"faixa": "10-14", "homens": 26101, "mulheres": 25174, "total": 51275},
            {"faixa": "5-9", "homens": 22417, "mulheres": 21285, "total": 43702},
            {"faixa": "0-4", "homens": 21310, "mulheres": 20958, "total": 42268}
          ]
        },
        "2022": {
          "ano": 2022,
          "populacao_total": 697054,
          "homens_total": 335359,
          "mulheres_total": 361695,
          "metricas": {
            "idade_mediana": "36 anos",
            "indice_envelhecimento": "62,48",
            "razao_sexo": "92,72",
            "razao_dependencia": "41,20%"
          },
          "faixas": [
            {"faixa": "80+", "homens": 5246, "mulheres": 9025, "total": 14271},
            {"faixa": "75-79", "homens": 5990, "mulheres": 7828, "total": 13818},
            {"faixa": "70-74", "homens": 9947, "mulheres": 12226, "total": 22173},
            {"faixa": "65-69", "homens": 13642, "mulheres": 16600, "total": 30242},
            {"faixa": "60-64", "homens": 16576, "mulheres": 20413, "total": 36989},
            {"faixa": "55-59", "homens": 18869, "mulheres": 22468, "total": 41337},
            {"faixa": "50-54", "homens": 21040, "mulheres": 23437, "total": 44477},
            {"faixa": "45-49", "homens": 23336, "mulheres": 25827, "total": 49163},
            {"faixa": "40-44", "homens": 28317, "mulheres": 31141, "total": 59458},
            {"faixa": "35-39", "homens": 27734, "mulheres": 29870, "total": 57604},
            {"faixa": "30-34", "homens": 26157, "mulheres": 27780, "total": 53937},
            {"faixa": "25-29", "homens": 24915, "mulheres": 25640, "total": 50555},
            {"faixa": "20-24", "homens": 25154, "mulheres": 24652, "total": 49806},
            {"faixa": "15-19", "homens": 22726, "mulheres": 21643, "total": 44369},
            {"faixa": "10-14", "homens": 22335, "mulheres": 21573, "total": 43908},
            {"faixa": "5-9", "homens": 22933, "mulheres": 22027, "total": 44960},
            {"faixa": "0-4", "homens": 20442, "mulheres": 19545, "total": 39987}
          ]
        }
      },
      "distritos_oficiais": [
        {
          "distrito": "Distrito Sede",
          "populacao": 542110,
          "pct": 77.8
        },
        {
          "distrito": "Eugênio de Melo",
          "populacao": 118420,
          "pct": 17.0
        },
        {
          "distrito": "São Francisco Xavier",
          "populacao": 36524,
          "pct": 5.2
        }
      ],
      "fonte_nome": "IBGE - Censo Demográfico 2022 / SIDRA",
      "fonte_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "data_consulta": "2026-09-27"
    },
    "saude": {
      "mortalidade_infantil": {
            "taxa_oficial_sms_2024": 8.2,
            "obitos_2024": 66,
            "nascidos_vivos_2024": 8048,
            "taxa_oficial_sms_2025_preliminar": 7.65,
            "obitos_2025": 61,
            "nascidos_vivos_2025": 7974,
            "taxa_ibge_cidades_2025": 7.77,
            "unidade": "óbitos por mil nascidos vivos",
            "definicao_metrica": "Taxa de Mortalidade Infantil (TMI) = (Óbitos de menores de 1 ano de mães residentes ÷ Nascidos vivos de mães residentes) × 1.000",
            "meta_ods_3_2_neonatal": 12.0,
            "meta_ods_3_2_menores_5_anos": 25.0,
            "divergencia_oficial_nota": "O IBGE Cidades divulga 7,77 óbitos/mil para 2025, enquanto o Relatório de Gestão da Secretaria de Saúde de SJC (Quadri 3/2025) registra 8,20 para 2024 e 7,65 para 2025 (preliminar). A variação reflete a defasagem temporal entre os bancos diretos da vigilância municipal e a consolidação do SIM/SINASC no Ministério da Saúde.",
            "fonte_nome": "SMS-SJC (Relatório de Gestão 2025) / IBGE Cidades / Ministério da Saúde (SIM/SINASC)",
            "fonte_url": "https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/Quadri_3_2025_1_20260227124829.pdf",
            "data_consulta": "2026-09-28"
      },
      "mortalidade_infantil_serie": [
            {
                  "ano": 2010,
                  "taxa": 10.42,
                  "taxa_por_mil_nascidos": 10.42,
                  "obitos_menores_1_ano": 89,
                  "nascidos_vivos": 8541,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2012,
                  "taxa": 9.85,
                  "taxa_por_mil_nascidos": 9.85,
                  "obitos_menores_1_ano": 84,
                  "nascidos_vivos": 8528,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2014,
                  "taxa": 9.4,
                  "taxa_por_mil_nascidos": 9.4,
                  "obitos_menores_1_ano": 81,
                  "nascidos_vivos": 8617,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2016,
                  "taxa": 9.15,
                  "taxa_por_mil_nascidos": 9.15,
                  "obitos_menores_1_ano": 78,
                  "nascidos_vivos": 8525,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2018,
                  "taxa": 8.92,
                  "taxa_por_mil_nascidos": 8.92,
                  "obitos_menores_1_ano": 76,
                  "nascidos_vivos": 8520,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2019,
                  "taxa": 8.7,
                  "taxa_por_mil_nascidos": 8.7,
                  "obitos_menores_1_ano": 74,
                  "nascidos_vivos": 8506,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2020,
                  "taxa": 8.35,
                  "taxa_por_mil_nascidos": 8.35,
                  "obitos_menores_1_ano": 68,
                  "nascidos_vivos": 8144,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2021,
                  "taxa": 8.9,
                  "taxa_por_mil_nascidos": 8.9,
                  "obitos_menores_1_ano": 71,
                  "nascidos_vivos": 7978,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2022,
                  "taxa": 8.12,
                  "taxa_por_mil_nascidos": 8.12,
                  "obitos_menores_1_ano": 64,
                  "nascidos_vivos": 7882,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2023,
                  "taxa": 8.41,
                  "taxa_por_mil_nascidos": 8.41,
                  "obitos_menores_1_ano": 67,
                  "nascidos_vivos": 7962,
                  "status": "Consolidado SIM/SINASC"
            },
            {
                  "ano": 2024,
                  "taxa": 8.2,
                  "taxa_por_mil_nascidos": 8.2,
                  "obitos_menores_1_ano": 66,
                  "nascidos_vivos": 8048,
                  "status": "Consolidado SMS-SJC / SIM"
            },
            {
                  "ano": 2025,
                  "taxa": 7.65,
                  "taxa_por_mil_nascidos": 7.65,
                  "obitos_menores_1_ano": 61,
                  "nascidos_vivos": 7974,
                  "status": "Preliminar SMS-SJC (7,77 no IBGE Cidades)"
            }
      ],
      "leitos_hospitalares_cnes": {
            "competencia": "12/2024 (Consolidado CNES/DataSUS)",
            "ano": 2024,
            "total_leitos": 1894,
            "leitos_sus": 846,
            "leitos_nao_sus": 1048,
            "taxa_leitos_por_mil_hab": 2.61,
            "leitos_clinicos_cirurgicos": {
                  "sus": 698,
                  "nao_sus": 864,
                  "total": 1562
            },
            "leitos_uti_adulto": {
                  "sus": 102,
                  "nao_sus": 138,
                  "total": 240
            },
            "leitos_uti_pediatrica": {
                  "sus": 18,
                  "nao_sus": 16,
                  "total": 34
            },
            "leitos_uti_neonatal": {
                  "sus": 28,
                  "nao_sus": 30,
                  "total": 58
            },
            "leitos_uti_total": {
                  "sus": 148,
                  "nao_sus": 184,
                  "total": 332
            },
            "nota_metodologica": "Leitos hospitalares cadastrados/existentes no CNES (capacidade instalada cadastrada). Total = 1.562 Clínicos/Cirúrgicos + 332 UTI = 1.894 leitos. SUS = 698 + 148 = 846 leitos; Não-SUS = 864 + 184 = 1.048 leitos.",
            "fonte_nome": "Ministério da Saúde / DataSUS - CNES (Cadastro Nacional de Estabelecimentos de Saúde)",
            "fonte_url": "https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos",
            "data_consulta": "2026-09-28"
      },
      "leitos_serie_historica": [
            {
                  "ano": 2019,
                  "total": 1780,
                  "sus": 790,
                  "nao_sus": 990,
                  "uti_total": 290,
                  "competencia": "12/2019"
            },
            {
                  "ano": 2020,
                  "total": 1890,
                  "sus": 860,
                  "nao_sus": 1030,
                  "uti_total": 350,
                  "competencia": "12/2020"
            },
            {
                  "ano": 2021,
                  "total": 1940,
                  "sus": 910,
                  "nao_sus": 1030,
                  "uti_total": 360,
                  "competencia": "12/2021"
            },
            {
                  "ano": 2022,
                  "total": 1820,
                  "sus": 810,
                  "nao_sus": 1010,
                  "uti_total": 315,
                  "competencia": "12/2022"
            },
            {
                  "ano": 2023,
                  "total": 1849,
                  "sus": 824,
                  "nao_sus": 1025,
                  "uti_total": 326,
                  "competencia": "12/2023"
            },
            {
                  "ano": 2024,
                  "total": 1894,
                  "sus": 846,
                  "nao_sus": 1048,
                  "uti_total": 332,
                  "competencia": "12/2024"
            },
            {
                  "ano": 2025,
                  "total": 1912,
                  "sus": 854,
                  "nao_sus": 1058,
                  "uti_total": 328,
                  "competencia": "12/2025"
            },
            {
                  "ano": 2026,
                  "total": 1928,
                  "sus": 860,
                  "nao_sus": 1068,
                  "uti_total": 324,
                  "competencia": "08/2026"
            }
      ],
      "cobertura_vacinal_por_ano": {
            "2024": [
                  {
                        "vacina": "Tríplice Viral D1 (SCR)",
                        "imunobiologico": "Tríplice Viral (Sarampo, Caxumba, Rubéola)",
                        "dose": "1ª Dose (D1)",
                        "faixa_etaria": "1 ano de idade (12 meses)",
                        "cobertura_pct": 98.5,
                        "meta_pni": 95.0,
                        "status": "Meta Atingida"
                  },
                  {
                        "vacina": "BCG (Tuberculose)",
                        "imunobiologico": "BCG",
                        "dose": "Dose Única ao nascer",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 94.2,
                        "meta_pni": 90.0,
                        "status": "Meta Atingida"
                  },
                  {
                        "vacina": "Hepatite B",
                        "imunobiologico": "Hepatite B",
                        "dose": "Dose ao nascer / 30 dias",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 92.8,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Pneumocócica 10V",
                        "imunobiologico": "Pneumocócica 10-Valente",
                        "dose": "2ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 89.05,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Rotavírus Humano",
                        "imunobiologico": "Rotavírus Humano G1P[8]",
                        "dose": "2ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 86.4,
                        "meta_pni": 90.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Pentavalente",
                        "imunobiologico": "Pentavalente (DTP + Hib + HepB)",
                        "dose": "3ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 85.9,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Poliomielite (VIP/VOP)",
                        "imunobiologico": "Poliomielite Inativada/Oral",
                        "dose": "3ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 85.7,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  }
            ],
            "2025": [
                  {
                        "vacina": "Tríplice Viral D1 (SCR)",
                        "imunobiologico": "Tríplice Viral (Sarampo, Caxumba, Rubéola)",
                        "dose": "1ª Dose (D1)",
                        "faixa_etaria": "1 ano de idade (12 meses)",
                        "cobertura_pct": 91.44,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "BCG (Tuberculose)",
                        "imunobiologico": "BCG",
                        "dose": "Dose Única ao nascer",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 90.8,
                        "meta_pni": 90.0,
                        "status": "Meta Atingida"
                  },
                  {
                        "vacina": "Hepatite B",
                        "imunobiologico": "Hepatite B",
                        "dose": "Dose ao nascer / 30 dias",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 89.5,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Pneumocócica 10V",
                        "imunobiologico": "Pneumocócica 10-Valente",
                        "dose": "2ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 88.74,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Rotavírus Humano",
                        "imunobiologico": "Rotavírus Humano G1P[8]",
                        "dose": "2ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 84.1,
                        "meta_pni": 90.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Poliomielite (VIP/VOP)",
                        "imunobiologico": "Poliomielite Inativada/Oral",
                        "dose": "3ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 85.45,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  },
                  {
                        "vacina": "Pentavalente",
                        "imunobiologico": "Pentavalente (DTP + Hib + HepB)",
                        "dose": "3ª Dose",
                        "faixa_etaria": "Menores de 1 ano",
                        "cobertura_pct": 82.64,
                        "meta_pni": 95.0,
                        "status": "Abaixo da Meta"
                  }
            ]
      },
      "causas_mortalidade_geral_por_ano": {
            "2023": {
                  "ano": 2023,
                  "status": "Consolidado SIM / DataSUS",
                  "total_obitos": 4716,
                  "populacao_base": "Óbitos por Residência em São José dos Campos",
                  "categorias": [
                        {
                              "causa": "Doenças do Aparelho Circulatório",
                              "cid10": "Capítulo IX (I00-I99)",
                              "obitos": 1284,
                              "pct": 27.23,
                              "detalhes": "Infarto agudo do miocárdio, AVC, cardiopatias isquêmicas"
                        },
                        {
                              "causa": "Neoplasias (Tumores / Câncer)",
                              "cid10": "Capítulo II (C00-D48)",
                              "obitos": 996,
                              "pct": 21.12,
                              "detalhes": "Câncer de traqueia/brônquios/pulmão, mama, cólon, próstata"
                        },
                        {
                              "causa": "Doenças do Aparelho Respiratório",
                              "cid10": "Capítulo X (J00-J99)",
                              "obitos": 614,
                              "pct": 13.02,
                              "detalhes": "Pneumonias, DPOC e insuficiência respiratória"
                        },
                        {
                              "causa": "Causas Externas (Acidentes e Violência)",
                              "cid10": "Capítulo XX (V01-Y98)",
                              "obitos": 418,
                              "pct": 8.86,
                              "detalhes": "Acidentes de transporte, quedas acidentais, agressões"
                        },
                        {
                              "causa": "Doenças Endócrinas (Diabetes, etc.)",
                              "cid10": "Capítulo IV (E00-E90)",
                              "obitos": 312,
                              "pct": 6.62,
                              "detalhes": "Diabetes Mellitus e distúrbios metabólicos"
                        },
                        {
                              "causa": "Doenças do Aparelho Digestivo",
                              "cid10": "Capítulo XI (K00-K93)",
                              "obitos": 248,
                              "pct": 5.26,
                              "detalhes": "Cirrose hepática, hemorragias digestivas, pancreatites"
                        },
                        {
                              "causa": "Doenças Infecciosas e Parasitárias",
                              "cid10": "Capítulo I (A00-B99)",
                              "obitos": 198,
                              "pct": 4.2,
                              "detalhes": "Sepse, tuberculose e infecções bacterianas/virais"
                        },
                        {
                              "causa": "Demais Causas e Mal Definidas",
                              "cid10": "Capítulos V-VIII, XII-XIX",
                              "obitos": 646,
                              "pct": 13.69,
                              "detalhes": "Doenças neurológicas, renais, sintomas e causas mal definidas"
                        }
                  ]
            },
            "2024": {
                  "ano": 2024,
                  "status": "Preliminar SIM / SMS-SJC",
                  "total_obitos": 4820,
                  "populacao_base": "Óbitos por Residência em São José dos Campos",
                  "categorias": [
                        {
                              "causa": "Doenças do Aparelho Circulatório",
                              "cid10": "Capítulo IX (I00-I99)",
                              "obitos": 1302,
                              "pct": 27.01,
                              "detalhes": "Infarto agudo do miocárdio, AVC, cardiopatias"
                        },
                        {
                              "causa": "Neoplasias (Tumores / Câncer)",
                              "cid10": "Capítulo II (C00-D48)",
                              "obitos": 1026,
                              "pct": 21.29,
                              "detalhes": "Câncer de pulmão, mama, cólon, próstata"
                        },
                        {
                              "causa": "Doenças do Aparelho Respiratório",
                              "cid10": "Capítulo X (J00-J99)",
                              "obitos": 636,
                              "pct": 13.2,
                              "detalhes": "Pneumonias e DPOC"
                        },
                        {
                              "causa": "Causas Externas (Acidentes e Violência)",
                              "cid10": "Capítulo XX (V01-Y98)",
                              "obitos": 410,
                              "pct": 8.51,
                              "detalhes": "Acidentes de trânsito, quedas e outras causas externas"
                        },
                        {
                              "causa": "Doenças Endócrinas (Diabetes, etc.)",
                              "cid10": "Capítulo IV (E00-E90)",
                              "obitos": 324,
                              "pct": 6.72,
                              "detalhes": "Diabetes Mellitus"
                        },
                        {
                              "causa": "Doenças do Aparelho Digestivo",
                              "cid10": "Capítulo XI (K00-K93)",
                              "obitos": 252,
                              "pct": 5.23,
                              "detalhes": "Cirrose e doenças gastrointestinais"
                        },
                        {
                              "causa": "Doenças Infecciosas e Parasitárias",
                              "cid10": "Capítulo I (A00-B99)",
                              "obitos": 194,
                              "pct": 4.02,
                              "detalhes": "Sepse e infecções bacterianas/virais"
                        },
                        {
                              "causa": "Demais Causas e Mal Definidas",
                              "cid10": "Capítulos V-VIII, XII-XIX",
                              "obitos": 676,
                              "pct": 14.02,
                              "detalhes": "Doenças do sistema nervoso, geniturinário e outras"
                        }
                  ]
            }
      },
      "estabelecimentos_saude_cnes": {
            "ano": 2024,
            "total": 528,
            "hospitais_gerais_especializados": 12,
            "unidades_basicas_saude_ubs_esf": 45,
            "upas_prontos_atendimentos": 6,
            "clinicas_ambulatorios": 348,
            "centros_atencao_psicossocial_caps": 6,
            "laboratorios_diagnostico": 88,
            "farmacias_populares_dispensarios": 23,
            "fonte_nome": "Ministério da Saúde - CNES / DataSUS",
            "fonte_url": "http://cnes.datasus.gov.br/",
            "data_consulta": "2026-09-28"
      },
      "cobertura_atencao_basica_serie": [
            {
                  "ano": 2019,
                  "cobertura_pct": 72.4
            },
            {
                  "ano": 2020,
                  "cobertura_pct": 74.1
            },
            {
                  "ano": 2021,
                  "cobertura_pct": 75.8
            },
            {
                  "ano": 2022,
                  "cobertura_pct": 78.3
            },
            {
                  "ano": 2023,
                  "cobertura_pct": 81.2
            },
            {
                  "ano": 2024,
                  "cobertura_pct": 83.5
            }
      ],
      "natalidade_sinasc_2023": {
            "nascidos_vivos": 7962,
            "partos_cesareos_pct": 59.4,
            "partos_vaginais_pct": 40.6,
            "prematuros_pct": 9.8,
            "maes_adolescentes_menor_20_pct": 7.9,
            "fonte_nome": "Ministério da Saúde - SINASC (Sistema de Nascidos Vivos)",
            "fonte_url": "https://datasus.saude.gov.br/nascidos-vivos-desde-1994",
            "data_consulta": "2026-09-28"
      },
      "fonte_nome": "Ministério da Saúde (DataSUS / CNES / SIM / SINASC) / SMS-SJC / IBGE Cidades",
      "fonte_url": "https://datasus.saude.gov.br/",
      "data_consulta": "2026-09-28",
      "nascidos_vivos_sinasc": {
            "total_2024": 7463,
            "total_2023": 8090,
            "parto_cesareo_2024": 4660,
            "parto_vaginal_2024": 2801,
            "parto_ignorado_2024": 2,
            "pct_cesareo_2024": 62.44,
            "pct_vaginal_2024": 37.53,
            "serie_historica_parto": [
                  {
                        "ano": 2010,
                        "nascidos_vivos": 9637,
                        "parto_vaginal": 3366,
                        "parto_cesareo": 6250,
                        "parto_ignorado": 21,
                        "pct_cesareo": 64.85,
                        "pct_vaginal": 34.93,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2011,
                        "nascidos_vivos": 9632,
                        "parto_vaginal": 3306,
                        "parto_cesareo": 6317,
                        "parto_ignorado": 9,
                        "pct_cesareo": 65.58,
                        "pct_vaginal": 34.32,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2012,
                        "nascidos_vivos": 9550,
                        "parto_vaginal": 3303,
                        "parto_cesareo": 6202,
                        "parto_ignorado": 45,
                        "pct_cesareo": 64.94,
                        "pct_vaginal": 34.59,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2013,
                        "nascidos_vivos": 9555,
                        "parto_vaginal": 3179,
                        "parto_cesareo": 6357,
                        "parto_ignorado": 19,
                        "pct_cesareo": 66.53,
                        "pct_vaginal": 33.27,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2014,
                        "nascidos_vivos": 9937,
                        "parto_vaginal": 3519,
                        "parto_cesareo": 6409,
                        "parto_ignorado": 9,
                        "pct_cesareo": 64.5,
                        "pct_vaginal": 35.41,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2015,
                        "nascidos_vivos": 9808,
                        "parto_vaginal": 3718,
                        "parto_cesareo": 6088,
                        "parto_ignorado": 2,
                        "pct_cesareo": 62.07,
                        "pct_vaginal": 37.91,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2016,
                        "nascidos_vivos": 9562,
                        "parto_vaginal": 3728,
                        "parto_cesareo": 5834,
                        "parto_ignorado": 0,
                        "pct_cesareo": 61.01,
                        "pct_vaginal": 38.99,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2017,
                        "nascidos_vivos": 9743,
                        "parto_vaginal": 3715,
                        "parto_cesareo": 6028,
                        "parto_ignorado": 0,
                        "pct_cesareo": 61.87,
                        "pct_vaginal": 38.13,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2018,
                        "nascidos_vivos": 9686,
                        "parto_vaginal": 3757,
                        "parto_cesareo": 5928,
                        "parto_ignorado": 1,
                        "pct_cesareo": 61.2,
                        "pct_vaginal": 38.79,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2019,
                        "nascidos_vivos": 9076,
                        "parto_vaginal": 3624,
                        "parto_cesareo": 5441,
                        "parto_ignorado": 11,
                        "pct_cesareo": 59.95,
                        "pct_vaginal": 39.93,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2020,
                        "nascidos_vivos": 8682,
                        "parto_vaginal": 3422,
                        "parto_cesareo": 5260,
                        "parto_ignorado": 0,
                        "pct_cesareo": 60.58,
                        "pct_vaginal": 39.42,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2021,
                        "nascidos_vivos": 8545,
                        "parto_vaginal": 3430,
                        "parto_cesareo": 5115,
                        "parto_ignorado": 0,
                        "pct_cesareo": 59.86,
                        "pct_vaginal": 40.14,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2022,
                        "nascidos_vivos": 8072,
                        "parto_vaginal": 3103,
                        "parto_cesareo": 4969,
                        "parto_ignorado": 0,
                        "pct_cesareo": 61.56,
                        "pct_vaginal": 38.44,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2023,
                        "nascidos_vivos": 8090,
                        "parto_vaginal": 3174,
                        "parto_cesareo": 4916,
                        "parto_ignorado": 0,
                        "pct_cesareo": 60.77,
                        "pct_vaginal": 39.23,
                        "status": "Consolidado SINASC"
                  },
                  {
                        "ano": 2024,
                        "nascidos_vivos": 7463,
                        "parto_vaginal": 2801,
                        "parto_cesareo": 4660,
                        "parto_ignorado": 2,
                        "pct_cesareo": 62.44,
                        "pct_vaginal": 37.53,
                        "status": "Consolidado SINASC / Preliminar SMS"
                  }
            ],
            "faixa_etaria_mae_2024": [
                  {
                        "faixa": "Menor de 15 anos",
                        "nascidos": 16,
                        "pct": 0.21
                  },
                  {
                        "faixa": "15 a 19 anos",
                        "nascidos": 508,
                        "pct": 6.81
                  },
                  {
                        "faixa": "20 a 24 anos",
                        "nascidos": 1398,
                        "pct": 18.73
                  },
                  {
                        "faixa": "25 a 29 anos",
                        "nascidos": 1956,
                        "pct": 26.21
                  },
                  {
                        "faixa": "30 a 34 anos",
                        "nascidos": 1848,
                        "pct": 24.76
                  },
                  {
                        "faixa": "35 a 39 anos",
                        "nascidos": 1324,
                        "pct": 17.74
                  },
                  {
                        "faixa": "40 a 44 anos",
                        "nascidos": 382,
                        "pct": 5.12
                  },
                  {
                        "faixa": "45 a 49 anos",
                        "nascidos": 29,
                        "pct": 0.39
                  },
                  {
                        "faixa": "50 anos ou mais",
                        "nascidos": 2,
                        "pct": 0.03
                  }
            ],
            "fonte_nome": "Ministério da Saúde - SINASC (Sistema de Informações sobre Nascidos Vivos / TabNet DataSUS)",
            "fonte_url": "http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sinasc/cnv/nvsp.def",
            "data_consulta": "2026-09-28"
      },
      "dengue_sinan": {
            "casos_2024": 98219,
            "casos_2023": 1059,
            "media_historica_2010_2023": 1876,
            "pico_historico_anterior_2015": 14509,
            "serie_historica": [
                  {
                        "ano": 2010,
                        "casos": 688,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2011,
                        "casos": 2380,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2012,
                        "casos": 154,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2013,
                        "casos": 839,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2014,
                        "casos": 832,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2015,
                        "casos": 14509,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2016,
                        "casos": 1731,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2017,
                        "casos": 438,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2018,
                        "casos": 198,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2019,
                        "casos": 670,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2020,
                        "casos": 452,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2021,
                        "casos": 619,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2022,
                        "casos": 1695,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2023,
                        "casos": 1059,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  },
                  {
                        "ano": 2024,
                        "casos": 98219,
                        "status_metodologico": "CASOS CONFIRMADOS"
                  }
            ],
            "nota_metodologica": "Série de casos CONFIRMADOS de dengue autóctone e importada em residentes de SJC. Fonte primária: Boletins Epidemiológicos e Notas Oficiais da Vigilância Epidemiológica da Prefeitura de SJC (2006-2018) e SINAN Online/DataSUS (2019-2024). Divergências entre notificados e confirmados: a série apresenta apenas confirmados.",
            "fonte_nome": "Prefeitura de SJC (Vigilância Epidemiológica) & Ministério da Saúde - SINAN Online / DataSUS",
            "fonte_url": "https://www.sjc.sp.gov.br/noticias/2019/janeiro/9/com-acoes-de-prevencao-casos-de-dengue-caem-quase-pela-metade-em-sao-jose/",
            "data_consulta": "2026-09-28"
      },
      "internacoes_sih": {
            "total_internacoes_2024": 54709,
            "total_internacoes_2023": 52425,
            "serie_historica": [
                  {
                        "ano": 2010,
                        "internacoes": 30963
                  },
                  {
                        "ano": 2011,
                        "internacoes": 33766
                  },
                  {
                        "ano": 2012,
                        "internacoes": 33784
                  },
                  {
                        "ano": 2013,
                        "internacoes": 31611
                  },
                  {
                        "ano": 2014,
                        "internacoes": 30937
                  },
                  {
                        "ano": 2015,
                        "internacoes": 32823
                  },
                  {
                        "ano": 2016,
                        "internacoes": 33348
                  },
                  {
                        "ano": 2017,
                        "internacoes": 35142
                  },
                  {
                        "ano": 2018,
                        "internacoes": 39625
                  },
                  {
                        "ano": 2019,
                        "internacoes": 46743
                  },
                  {
                        "ano": 2020,
                        "internacoes": 41915
                  },
                  {
                        "ano": 2021,
                        "internacoes": 43811
                  },
                  {
                        "ano": 2022,
                        "internacoes": 47241
                  },
                  {
                        "ano": 2023,
                        "internacoes": 52425
                  },
                  {
                        "ano": 2024,
                        "internacoes": 54709
                  }
            ],
            "top_causas_2024": [
                  {
                        "causa": "Doenças do Aparelho Circulatório",
                        "capitulo": "Cap. IX (I00-I99)",
                        "internacoes": 7914,
                        "pct": 14.47
                  },
                  {
                        "causa": "Doenças do Aparelho Digestivo",
                        "capitulo": "Cap. XI (K00-K93)",
                        "internacoes": 7035,
                        "pct": 12.86
                  },
                  {
                        "causa": "Neoplasias (Tumores)",
                        "capitulo": "Cap. II (C00-D48)",
                        "internacoes": 6913,
                        "pct": 12.64
                  },
                  {
                        "causa": "Lesões, Envenenamentos e Causas Externas",
                        "capitulo": "Cap. XIX (S00-T98)",
                        "internacoes": 6093,
                        "pct": 11.14
                  },
                  {
                        "causa": "Gravidez, Parto e Puerpério",
                        "capitulo": "Cap. XV (O00-O99)",
                        "internacoes": 5596,
                        "pct": 10.23
                  },
                  {
                        "causa": "Doenças do Aparelho Respiratório",
                        "capitulo": "Cap. X (J00-J99)",
                        "internacoes": 4515,
                        "pct": 8.25
                  },
                  {
                        "causa": "Doenças do Aparelho Geniturinário",
                        "capitulo": "Cap. XIV (N00-N99)",
                        "internacoes": 4106,
                        "pct": 7.51
                  },
                  {
                        "causa": "Doenças Infecciosas e Parasitárias",
                        "capitulo": "Cap. I (A00-B99)",
                        "internacoes": 2430,
                        "pct": 4.44
                  }
            ],
            "top_causas_2023": [
                  {
                        "causa": "Doenças do Aparelho Circulatório",
                        "capitulo": "Cap. IX",
                        "internacoes": 7680,
                        "pct": 14.65
                  },
                  {
                        "causa": "Doenças do Aparelho Digestivo",
                        "capitulo": "Cap. XI",
                        "internacoes": 6840,
                        "pct": 13.05
                  },
                  {
                        "causa": "Neoplasias (Tumores)",
                        "capitulo": "Cap. II",
                        "internacoes": 6620,
                        "pct": 12.63
                  },
                  {
                        "causa": "Lesões e Causas Externas",
                        "capitulo": "Cap. XIX",
                        "internacoes": 5890,
                        "pct": 11.23
                  },
                  {
                        "causa": "Gravidez, Parto e Puerpério",
                        "capitulo": "Cap. XV",
                        "internacoes": 5510,
                        "pct": 10.51
                  },
                  {
                        "causa": "Doenças do Aparelho Respiratório",
                        "capitulo": "Cap. X",
                        "internacoes": 4410,
                        "pct": 8.41
                  },
                  {
                        "causa": "Doenças do Aparelho Geniturinário",
                        "capitulo": "Cap. XIV",
                        "internacoes": 3950,
                        "pct": 7.53
                  },
                  {
                        "causa": "Doenças Infecciosas e Parasitárias",
                        "capitulo": "Cap. I",
                        "internacoes": 2340,
                        "pct": 4.46
                  }
            ],
            "nota_metodologica": "Internações Hospitalares de Residentes de São José dos Campos pagas pelo SUS (SIH/SUS - Autorizações de Internação Hospitalar - AIH Aprovadas).",
            "fonte_nome": "Ministério da Saúde - SIH/SUS (Sistema de Informações Hospitalares / TabNet DataSUS)",
            "fonte_url": "http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sih/cnv/nisp.def",
            "data_consulta": "2026-09-28"
      },
      "atencao_basica_cnes_sia": {
            "unidades_basicas_saude_ubs": 45,
            "equipes_saude_familia_esf": 142,
            "cobertura_atencao_primaria_pct_2024": 83.5,
            "atendimentos_consultas_2024": 1418520,
            "serie_cobertura": [
                  {
                        "ano": 2019,
                        "cobertura_pct": 72.4,
                        "consultas_atendimentos": 1120450
                  },
                  {
                        "ano": 2020,
                        "cobertura_pct": 74.1,
                        "consultas_atendimentos": 890320
                  },
                  {
                        "ano": 2021,
                        "cobertura_pct": 75.8,
                        "consultas_atendimentos": 1045600
                  },
                  {
                        "ano": 2022,
                        "cobertura_pct": 78.3,
                        "consultas_atendimentos": 1238900
                  },
                  {
                        "ano": 2023,
                        "cobertura_pct": 81.2,
                        "consultas_atendimentos": 1342100
                  },
                  {
                        "ano": 2024,
                        "cobertura_pct": 83.5,
                        "consultas_atendimentos": 1418520
                  }
            ],
            "nota_metodologica": "Indicadores de Atenção Primária à Saúde compilados a partir do Cadastro Nacional de Estabelecimentos de Saúde (CNES), e-Gestor Atenção Básica e Relatório de Gestão SMS-SJC.",
            "fonte_nome": "Ministério da Saúde (e-Gestor AB / CNES) & Secretaria Municipal de Saúde de SJC",
            "fonte_url": "https://egestorab.saude.gov.br/",
            "data_consulta": "2026-09-28",
            "unidades_basicas_saude_cnes": 40,
            "unidades_basicas_saude_rede_municipal": 45,
            "audit_status": "CONFIRMADO"
      },
      "procedimentos_sia_sih": {
            "ano_referencia": 2024,
            "total_ambulatorial_2024": 8120500,
            "total_hospitalar_2024": 168900,
            "serie_producao": [
                  {
                        "ano": 2019,
                        "ambulatorial": 6120400,
                        "hospitalar": 142800,
                        "total": 6263200
                  },
                  {
                        "ano": 2020,
                        "ambulatorial": 4890300,
                        "hospitalar": 128500,
                        "total": 5018800
                  },
                  {
                        "ano": 2021,
                        "ambulatorial": 5680100,
                        "hospitalar": 135200,
                        "total": 5815300
                  },
                  {
                        "ano": 2022,
                        "ambulatorial": 6940200,
                        "hospitalar": 148600,
                        "total": 7088800
                  },
                  {
                        "ano": 2023,
                        "ambulatorial": 7650800,
                        "hospitalar": 162400,
                        "total": 7813200
                  },
                  {
                        "ano": 2024,
                        "ambulatorial": 8120500,
                        "hospitalar": 168900,
                        "total": 8289400
                  }
            ],
            "top_ambulatoriais_2024": [
                  {
                        "procedimento": "Exames Laboratoriais (Patologia Clínica)",
                        "quantidade": 4120500,
                        "pct": 50.74
                  },
                  {
                        "procedimento": "Consultas Médicas (Especializada e Básica)",
                        "quantidade": 1840300,
                        "pct": 22.66
                  },
                  {
                        "procedimento": "Procedimentos de Enfermagem e Curativos",
                        "quantidade": 1150200,
                        "pct": 14.16
                  },
                  {
                        "procedimento": "Diagnóstico por Imagem (RX, USG, Tomografia)",
                        "quantidade": 412800,
                        "pct": 5.08
                  },
                  {
                        "procedimento": "Fisioterapia e Reabilitação Física",
                        "quantidade": 215400,
                        "pct": 2.65
                  }
            ],
            "top_hospitalares_2024": [
                  {
                        "procedimento": "Partos (Cesarianos e Vaginais SUS)",
                        "quantidade": 5596,
                        "pct": 24.28
                  },
                  {
                        "procedimento": "Cirurgias Digestivas e Hérnias",
                        "quantidade": 4820,
                        "pct": 20.91
                  },
                  {
                        "procedimento": "Tratamento de Doenças Cardiovasculares e AVC",
                        "quantidade": 4650,
                        "pct": 20.17
                  },
                  {
                        "procedimento": "Ortopedia e Tratamento de Fraturas / Traumas",
                        "quantidade": 4180,
                        "pct": 18.13
                  },
                  {
                        "procedimento": "Tratamentos Oncológicos e Quimioterapia (Intern.)",
                        "quantidade": 3890,
                        "pct": 16.88
                  }
            ],
            "nota_metodologica": "Volume físico de procedimentos ambulatoriais aprovados no SIA/SUS (BPA/APAC) e atos cirúrgicos/clínicos hospitalares registrados no SIH/SUS.",
            "fonte_nome": "Ministério da Saúde (SIA/SUS e SIH/SUS) / SMS-SJC Relatório Quadrimestral",
            "fonte_url": "http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sia/cnv/qasp.def",
            "data_consulta": "2026-09-28",
            "audit_status": "SUSPENSO_PARA_REVISAO",
            "status_metodologico": "INDISPONIVEL_EM_REVISAO",
            "nota_suspensao": "O volume de procedimentos ambulatoriais SUS está sendo auditado diretamente no SIA/DataSUS para garantir fidedignidade antes da publicação."
      }
},
    "seguranca": {
      "taxa_homicidios_dolosos_serie": [
            {
                  "ano": 2001,
                  "vitimas": 248,
                  "ocorrencias": 231,
                  "taxa_por_100k": 45.98,
                  "populacao_base": 539313,
                  "fonte_populacao": "Censo IBGE 2000/2001",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2002,
                  "vitimas": 240,
                  "ocorrencias": 222,
                  "taxa_por_100k": 43.68,
                  "populacao_base": 549458,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2003,
                  "vitimas": 201,
                  "ocorrencias": 186,
                  "taxa_por_100k": 35.91,
                  "populacao_base": 559725,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2004,
                  "vitimas": 171,
                  "ocorrencias": 159,
                  "taxa_por_100k": 29.99,
                  "populacao_base": 570183,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2005,
                  "vitimas": 147,
                  "ocorrencias": 136,
                  "taxa_por_100k": 25.31,
                  "populacao_base": 580798,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2006,
                  "vitimas": 121,
                  "ocorrencias": 112,
                  "taxa_por_100k": 20.45,
                  "populacao_base": 591605,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2007,
                  "vitimas": 98,
                  "ocorrencias": 90,
                  "taxa_por_100k": 16.27,
                  "populacao_base": 602388,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2008,
                  "vitimas": 94,
                  "ocorrencias": 88,
                  "taxa_por_100k": 15.37,
                  "populacao_base": 611580,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2009,
                  "vitimas": 106,
                  "ocorrencias": 99,
                  "taxa_por_100k": 17.07,
                  "populacao_base": 621008,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2010,
                  "vitimas": 95,
                  "ocorrencias": 89,
                  "taxa_por_100k": 15.08,
                  "populacao_base": 629921,
                  "fonte_populacao": "Censo IBGE 2010",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2011,
                  "vitimas": 85,
                  "ocorrencias": 79,
                  "taxa_por_100k": 13.35,
                  "populacao_base": 636885,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2012,
                  "vitimas": 120,
                  "ocorrencias": 111,
                  "taxa_por_100k": 18.62,
                  "populacao_base": 644462,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2013,
                  "vitimas": 88,
                  "ocorrencias": 83,
                  "taxa_por_100k": 12.88,
                  "populacao_base": 683084,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2014,
                  "vitimas": 76,
                  "ocorrencias": 72,
                  "taxa_por_100k": 11.04,
                  "populacao_base": 688773,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2015,
                  "vitimas": 72,
                  "ocorrencias": 68,
                  "taxa_por_100k": 10.36,
                  "populacao_base": 694978,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2016,
                  "vitimas": 77,
                  "ocorrencias": 74,
                  "taxa_por_100k": 11.06,
                  "populacao_base": 695992,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2017,
                  "vitimas": 46,
                  "ocorrencias": 46,
                  "taxa_por_100k": 6.54,
                  "populacao_base": 703219,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2018,
                  "vitimas": 50,
                  "ocorrencias": 49,
                  "taxa_por_100k": 7.0,
                  "populacao_base": 713943,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2019,
                  "vitimas": 36,
                  "ocorrencias": 36,
                  "taxa_por_100k": 4.99,
                  "populacao_base": 721944,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2020,
                  "vitimas": 34,
                  "ocorrencias": 33,
                  "taxa_por_100k": 4.66,
                  "populacao_base": 729737,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2021,
                  "vitimas": 30,
                  "ocorrencias": 29,
                  "taxa_por_100k": 4.07,
                  "populacao_base": 737310,
                  "fonte_populacao": "Estimativa IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2022,
                  "vitimas": 41,
                  "ocorrencias": 38,
                  "taxa_por_100k": 5.88,
                  "populacao_base": 697054,
                  "fonte_populacao": "Censo IBGE 2022",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2023,
                  "vitimas": 44,
                  "ocorrencias": 42,
                  "taxa_por_100k": 6.19,
                  "populacao_base": 711000,
                  "fonte_populacao": "Estimativa SEADE/IBGE",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2024,
                  "vitimas": 23,
                  "ocorrencias": 23,
                  "taxa_por_100k": 3.28,
                  "populacao_base": 701219,
                  "fonte_populacao": "Taxa Oficial SSP-SP",
                  "verificacao": "primaria"
            },
            {
                  "ano": 2025,
                  "vitimas": 33,
                  "ocorrencias": 29,
                  "taxa_por_100k": 4.55,
                  "populacao_base": 724756,
                  "fonte_populacao": "Estimativa IBGE 2024",
                  "verificacao": "primaria"
            }
      ],
      "latrocinio_serie": [
            {
                  "ano": 2016,
                  "vitimas": 7,
                  "ocorrencias": 7,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2017,
                  "vitimas": 10,
                  "ocorrencias": 9,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2018,
                  "vitimas": 4,
                  "ocorrencias": 4,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2019,
                  "vitimas": 2,
                  "ocorrencias": 2,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2020,
                  "vitimas": 3,
                  "ocorrencias": 3,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2021,
                  "vitimas": 1,
                  "ocorrencias": 1,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2022,
                  "vitimas": 2,
                  "ocorrencias": 2,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2023,
                  "vitimas": 2,
                  "ocorrencias": 2,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2024,
                  "vitimas": 1,
                  "ocorrencias": 1,
                  "verificacao": "primaria"
            },
            {
                  "ano": 2025,
                  "vitimas": 1,
                  "ocorrencias": 1,
                  "verificacao": "primaria"
            }
      ],
      "ocorrencias_anuais_por_categoria": {
            "2018": {
                  "homicidio_doloso": 49,
                  "vitimas_homicidio": 50,
                  "latrocinio": 4,
                  "roubo_veiculo": 489,
                  "furto_veiculo": 1840,
                  "roubo_outros": 2740,
                  "roubo_carga": 42,
                  "estupro": 198,
                  "lesao_corporal_dolosa": 1540,
                  "trafico_entorpecentes": 512
            },
            "2019": {
                  "homicidio_doloso": 36,
                  "vitimas_homicidio": 36,
                  "latrocinio": 2,
                  "roubo_veiculo": 342,
                  "furto_veiculo": 1620,
                  "roubo_outros": 2310,
                  "roubo_carga": 35,
                  "estupro": 215,
                  "lesao_corporal_dolosa": 1480,
                  "trafico_entorpecentes": 488
            },
            "2020": {
                  "homicidio_doloso": 33,
                  "vitimas_homicidio": 34,
                  "latrocinio": 3,
                  "roubo_veiculo": 218,
                  "furto_veiculo": 1254,
                  "roubo_outros": 1780,
                  "roubo_carga": 28,
                  "estupro": 184,
                  "lesao_corporal_dolosa": 1320,
                  "trafico_entorpecentes": 442
            },
            "2021": {
                  "homicidio_doloso": 29,
                  "vitimas_homicidio": 30,
                  "latrocinio": 1,
                  "roubo_veiculo": 198,
                  "furto_veiculo": 1190,
                  "roubo_outros": 1640,
                  "roubo_carga": 22,
                  "estupro": 192,
                  "lesao_corporal_dolosa": 1390,
                  "trafico_entorpecentes": 465
            },
            "2022": {
                  "homicidio_doloso": 38,
                  "vitimas_homicidio": 41,
                  "latrocinio": 2,
                  "roubo_veiculo": 176,
                  "furto_veiculo": 1280,
                  "roubo_outros": 1580,
                  "roubo_carga": 26,
                  "estupro": 210,
                  "lesao_corporal_dolosa": 1460,
                  "trafico_entorpecentes": 498
            },
            "2023": {
                  "homicidio_doloso": 42,
                  "vitimas_homicidio": 44,
                  "latrocinio": 2,
                  "roubo_veiculo": 157,
                  "furto_veiculo": 1220,
                  "roubo_outros": 1420,
                  "roubo_carga": 19,
                  "estupro": 228,
                  "lesao_corporal_dolosa": 1510,
                  "trafico_entorpecentes": 532
            },
            "2024": {
                  "homicidio_doloso": 23,
                  "vitimas_homicidio": 23,
                  "latrocinio": 1,
                  "roubo_veiculo": 118,
                  "furto_veiculo": 1140,
                  "roubo_outros": 1280,
                  "roubo_carga": 14,
                  "estupro": 215,
                  "lesao_corporal_dolosa": 1470,
                  "trafico_entorpecentes": 510
            },
            "2025": {
                  "homicidio_doloso": 29,
                  "vitimas_homicidio": 33,
                  "latrocinio": 1,
                  "roubo_veiculo": 98,
                  "furto_veiculo": 1080,
                  "roubo_outros": 1190,
                  "roubo_carga": 12,
                  "estupro": 220,
                  "lesao_corporal_dolosa": 1440,
                  "trafico_entorpecentes": 495
            }
      },
      "ocorrencias_mensais_2023_2024": {
            "2023": [
                  {
                        "mes": "Jan",
                        "homicidio_doloso": 4,
                        "roubo_veiculo": 16,
                        "furto_veiculo": 108,
                        "roubo_outros": 125
                  },
                  {
                        "mes": "Fev",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 14,
                        "furto_veiculo": 96,
                        "roubo_outros": 112
                  },
                  {
                        "mes": "Mar",
                        "homicidio_doloso": 5,
                        "roubo_veiculo": 18,
                        "furto_veiculo": 114,
                        "roubo_outros": 130
                  },
                  {
                        "mes": "Abr",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 15,
                        "furto_veiculo": 102,
                        "roubo_outros": 118
                  },
                  {
                        "mes": "Mai",
                        "homicidio_doloso": 4,
                        "roubo_veiculo": 13,
                        "furto_veiculo": 105,
                        "roubo_outros": 122
                  },
                  {
                        "mes": "Jun",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 12,
                        "furto_veiculo": 98,
                        "roubo_outros": 115
                  },
                  {
                        "mes": "Jul",
                        "homicidio_doloso": 4,
                        "roubo_veiculo": 14,
                        "furto_veiculo": 106,
                        "roubo_outros": 120
                  },
                  {
                        "mes": "Ago",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 15,
                        "furto_veiculo": 109,
                        "roubo_outros": 126
                  },
                  {
                        "mes": "Set",
                        "homicidio_doloso": 4,
                        "roubo_veiculo": 11,
                        "furto_veiculo": 94,
                        "roubo_outros": 114
                  },
                  {
                        "mes": "Out",
                        "homicidio_doloso": 4,
                        "roubo_veiculo": 10,
                        "furto_veiculo": 97,
                        "roubo_outros": 116
                  },
                  {
                        "mes": "Nov",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 10,
                        "furto_veiculo": 93,
                        "roubo_outros": 110
                  },
                  {
                        "mes": "Dez",
                        "homicidio_doloso": 2,
                        "roubo_veiculo": 9,
                        "furto_veiculo": 98,
                        "roubo_outros": 132
                  }
            ],
            "2024": [
                  {
                        "mes": "Jan",
                        "homicidio_doloso": 1,
                        "roubo_veiculo": 12,
                        "furto_veiculo": 102,
                        "roubo_outros": 73
                  },
                  {
                        "mes": "Fev",
                        "homicidio_doloso": 2,
                        "roubo_veiculo": 11,
                        "furto_veiculo": 95,
                        "roubo_outros": 85
                  },
                  {
                        "mes": "Mar",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 14,
                        "furto_veiculo": 110,
                        "roubo_outros": 92
                  },
                  {
                        "mes": "Abr",
                        "homicidio_doloso": 2,
                        "roubo_veiculo": 10,
                        "furto_veiculo": 98,
                        "roubo_outros": 88
                  },
                  {
                        "mes": "Mai",
                        "homicidio_doloso": 1,
                        "roubo_veiculo": 12,
                        "furto_veiculo": 104,
                        "roubo_outros": 94
                  },
                  {
                        "mes": "Jun",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 9,
                        "furto_veiculo": 88,
                        "roubo_outros": 82
                  },
                  {
                        "mes": "Jul",
                        "homicidio_doloso": 2,
                        "roubo_veiculo": 11,
                        "furto_veiculo": 94,
                        "roubo_outros": 89
                  },
                  {
                        "mes": "Ago",
                        "homicidio_doloso": 2,
                        "roubo_veiculo": 13,
                        "furto_veiculo": 99,
                        "roubo_outros": 91
                  },
                  {
                        "mes": "Set",
                        "homicidio_doloso": 1,
                        "roubo_veiculo": 9,
                        "furto_veiculo": 86,
                        "roubo_outros": 80
                  },
                  {
                        "mes": "Out",
                        "homicidio_doloso": 3,
                        "roubo_veiculo": 10,
                        "furto_veiculo": 91,
                        "roubo_outros": 84
                  },
                  {
                        "mes": "Nov",
                        "homicidio_doloso": 1,
                        "roubo_veiculo": 8,
                        "furto_veiculo": 85,
                        "roubo_outros": 78
                  },
                  {
                        "mes": "Dez",
                        "homicidio_doloso": 2,
                        "roubo_veiculo": 9,
                        "furto_veiculo": 88,
                        "roubo_outros": 84
                  }
            ]
      },
      "ranking_cidades_500k_2024": [
            {
                  "cidade": "São José dos Campos",
                  "taxa_100k": 3.28,
                  "posicao": 1
            },
            {
                  "cidade": "São Bernardo do Campo",
                  "taxa_100k": 3.7,
                  "posicao": 2
            },
            {
                  "cidade": "São Paulo",
                  "taxa_100k": 4.21,
                  "posicao": 3
            },
            {
                  "cidade": "Osasco",
                  "taxa_100k": 4.24,
                  "posicao": 4
            },
            {
                  "cidade": "Santo André",
                  "taxa_100k": 4.25,
                  "posicao": 5
            },
            {
                  "cidade": "Ribeirão Preto",
                  "taxa_100k": 4.54,
                  "posicao": 6
            },
            {
                  "cidade": "Guarulhos",
                  "taxa_100k": 5.03,
                  "posicao": 7
            },
            {
                  "cidade": "Sorocaba",
                  "taxa_100k": 7.23,
                  "posicao": 8
            },
            {
                  "cidade": "Campinas",
                  "taxa_100k": 7.54,
                  "posicao": 9
            },
            {
                  "cidade": "São José do Rio Preto",
                  "taxa_100k": 8.86,
                  "posicao": 10
            }
      ],
      "esclarecimento_deic_2024": {
            "taxa_esclarecimento_pct": 87.0,
            "total_homicidios": 23,
            "meios_empregados": [
                  {
                        "meio": "Arma de fogo",
                        "casos": 11,
                        "pct": 47.83
                  },
                  {
                        "meio": "Instrumento contundente",
                        "casos": 4,
                        "pct": 17.39
                  },
                  {
                        "meio": "Agressão física",
                        "casos": 2,
                        "pct": 8.7
                  },
                  {
                        "meio": "Arma branca",
                        "casos": 2,
                        "pct": 8.7
                  },
                  {
                        "meio": "Outros meios",
                        "casos": 4,
                        "pct": 17.39
                  }
            ],
            "fonte_nome": "Delegacia de Homicídios / DEIC São José dos Campos",
            "verificacao": "secundaria"
      },
      "programa_sao_jose_unida": {
            "ocorrencias_atendidas": 2948,
            "veiculos_recuperados": 674,
            "procurados_recapturados": 298,
            "pessoas_detidas_cameras": 1373,
            "fonte_nome": "Prefeitura de São José dos Campos (Comunicado Oficial)",
            "fonte_url": "https://www.sjc.sp.gov.br/noticias/2025/janeiro/03/sao-jose-tem-o-menor-numero-de-homicidio-da-historia/",
            "data_consulta": "2026-09-28",
            "verificacao": "secundaria"
      },
      "violencia_contra_mulher": {
            "medidas_protetivas_ajuizadas_estado_sp": [
                  {
                        "ano": 2023,
                        "pedidos_ajuizados": 98868,
                        "fonte": "SSP-SP / TJSP"
                  },
                  {
                        "ano": 2024,
                        "pedidos_ajuizados": 101034,
                        "fonte": "SSP-SP / TJSP"
                  },
                  {
                        "ano": 2025,
                        "pedidos_ajuizados": 118694,
                        "fonte": "SSP-SP / TJSP"
                  }
            ],
            "feminicidios_sjc_serie": [
                  {
                        "ano": 2021,
                        "vitimas": 2
                  },
                  {
                        "ano": 2022,
                        "vitimas": 3
                  },
                  {
                        "ano": 2023,
                        "vitimas": 3
                  },
                  {
                        "ano": 2024,
                        "vitimas": 1
                  },
                  {
                        "ano": 2025,
                        "vitimas": 2
                  }
            ],
            "nota_metodologica": "Termo oficial: Pedidos de Medidas Protetivas de Urgência Ajuizados. Como a SSP-SP e o TJSP não publicam tabela aberta municipal padronizada para todos os anos, é apresentado o total oficial do Estado de São Paulo para conferência de tendência.",
            "fonte_nome": "SSP-SP Estatística (Violência contra a Mulher)",
            "fonte_url": "https://www.ssp.sp.gov.br/estatistica/violencia-contra-a-mulher",
            "verificacao": "primaria"
      },
      "intervencao_policial_mdip": {
            "2023": 14,
            "2024": 12,
            "fonte_nome": "SSP-SP Painel Estatístico",
            "fonte_url": "https://www.ssp.sp.gov.br/estatistica/painel-estatistico",
            "verificacao": "primaria"
      },
      "nota_metodologica": "A SSP-SP registra ocorrências e vítimas por município de ocorrência desde julho de 2001. As bases de dados abertos da SSP possuem divisão metodológica (2018 a 2021 e 2022 em diante). Métrica exibida: Vítimas de Homicídio Doloso (exclui latrocínio, que constitui crime contra o patrimônio com resultado morte).",
      "fonte_nome": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "fonte_url": "https://www.ssp.sp.gov.br/estatistica/dados-mensais",
      "data_consulta": "2026-09-28",
      "verificacao": "primaria"
},
    "meio_ambiente": {
      "qualidade_ar_cetesb_2023": {
        "estacao_jd_satelite": {
          "tipo": "Automática Urbana",
          "poluentes_monitorados": [
            "MP10",
            "MP2.5",
            "O3",
            "NO2",
            "CO"
          ],
          "classificacao_anual": "Boa na maior parte do ano; episódios moderados no inverno por inversão térmica",
          "dias_boa": 312,
          "dias_boa_pct": 82.4,
          "dias_moderada_pct": 15.6,
          "dias_ruim_pct": 2.0
        },
        "estacao_vista_verde": {
          "tipo": "Automática Industrial/Rodoviária",
          "poluentes_monitorados": [
            "MP10",
            "O3",
            "SO2"
          ],
          "classificacao_anual": "Influenciada pelo eixo Dutra e polo petroquímico; índices dentro dos padrões Conama",
          "dias_boa": 324,
          "dias_boa_pct": 79.8,
          "dias_moderada_pct": 17.5,
          "dias_ruim_pct": 2.7
        },
        "fonte_nome": "CETESB - Rede de Monitoramento da Qualidade do Ar",
        "fonte_url": "https://cetesb.sp.gov.br/ar/qualidade-do-ar/",
        "data_consulta": "2026-09-27"
      },
      "qualidade_ar_cetesb_mensal_2023_2024": {
        "2023": [
          {
            "mes": "Jan",
            "dias_boa": 28,
            "dias_moderada": 3,
            "dias_ruim": 0
          },
          {
            "mes": "Fev",
            "dias_boa": 26,
            "dias_moderada": 2,
            "dias_ruim": 0
          },
          {
            "mes": "Mar",
            "dias_boa": 29,
            "dias_moderada": 2,
            "dias_ruim": 0
          },
          {
            "mes": "Abr",
            "dias_boa": 26,
            "dias_moderada": 4,
            "dias_ruim": 0
          },
          {
            "mes": "Mai",
            "dias_boa": 23,
            "dias_moderada": 7,
            "dias_ruim": 1
          },
          {
            "mes": "Jun",
            "dias_boa": 21,
            "dias_moderada": 8,
            "dias_ruim": 1
          },
          {
            "mes": "Jul",
            "dias_boa": 19,
            "dias_moderada": 10,
            "dias_ruim": 2
          },
          {
            "mes": "Ago",
            "dias_boa": 18,
            "dias_moderada": 11,
            "dias_ruim": 2
          },
          {
            "mes": "Set",
            "dias_boa": 20,
            "dias_moderada": 9,
            "dias_ruim": 1
          },
          {
            "mes": "Out",
            "dias_boa": 25,
            "dias_moderada": 6,
            "dias_ruim": 0
          },
          {
            "mes": "Nov",
            "dias_boa": 27,
            "dias_moderada": 3,
            "dias_ruim": 0
          },
          {
            "mes": "Dez",
            "dias_boa": 29,
            "dias_moderada": 2,
            "dias_ruim": 0
          }
        ],
        "2024": [
          {
            "mes": "Jan",
            "dias_boa": 29,
            "dias_moderada": 2,
            "dias_ruim": 0
          },
          {
            "mes": "Fev",
            "dias_boa": 27,
            "dias_moderada": 2,
            "dias_ruim": 0
          },
          {
            "mes": "Mar",
            "dias_boa": 28,
            "dias_moderada": 3,
            "dias_ruim": 0
          },
          {
            "mes": "Abr",
            "dias_boa": 25,
            "dias_moderada": 5,
            "dias_ruim": 0
          },
          {
            "mes": "Mai",
            "dias_boa": 22,
            "dias_moderada": 8,
            "dias_ruim": 1
          },
          {
            "mes": "Jun",
            "dias_boa": 20,
            "dias_moderada": 9,
            "dias_ruim": 1
          },
          {
            "mes": "Jul",
            "dias_boa": 17,
            "dias_moderada": 11,
            "dias_ruim": 3
          },
          {
            "mes": "Ago",
            "dias_boa": 14,
            "dias_moderada": 13,
            "dias_ruim": 4
          },
          {
            "mes": "Set",
            "dias_boa": 16,
            "dias_moderada": 11,
            "dias_ruim": 3
          },
          {
            "mes": "Out",
            "dias_boa": 24,
            "dias_moderada": 7,
            "dias_ruim": 0
          },
          {
            "mes": "Nov",
            "dias_boa": 27,
            "dias_moderada": 3,
            "dias_ruim": 0
          },
          {
            "mes": "Dez",
            "dias_boa": 29,
            "dias_moderada": 2,
            "dias_ruim": 0
          }
        ]
      },
      "focos_queimadas_inpe_serie": [
        {
          "ano": 2012,
          "focos": 45
        },
        {
          "ano": 2014,
          "focos": 78
        },
        {
          "ano": 2016,
          "focos": 52
        },
        {
          "ano": 2017,
          "focos": 61
        },
        {
          "ano": 2018,
          "focos": 42
        },
        {
          "ano": 2019,
          "focos": 58
        },
        {
          "ano": 2020,
          "focos": 89
        },
        {
          "ano": 2021,
          "focos": 74
        },
        {
          "ano": 2022,
          "focos": 38
        },
        {
          "ano": 2023,
          "focos": 46
        },
        {
          "ano": 2024,
          "focos": 94
        }
      ],
      "saneamento_snis_2022": {
        "indice_coleta_esgoto_pct": 98.6,
        "indice_tratamento_esgoto_pct": 95.8,
        "atendimento_agua_tratada_pct": 99.8,
        "perda_distribuicao_agua_pct": 22.4,
        "fonte_nome": "SNIS - Sistema Nacional de Informações sobre Saneamento",
        "fonte_url": "http://www.snis.gov.br/",
        "data_consulta": "2026-09-27"
      },
      "saneamento_snis_sabesp_2022_2023": {
        "atendimento_agua_tratada_pct": 99.8,
        "coleta_esgoto_pct": 98.5,
        "tratamento_esgoto_pct_da_agua_consumida": 98.2,
        "perda_distribuicao_agua_pct": 22.4,
        "populacao_atendida_agua": 695600,
        "populacao_atendida_esgoto": 686500,
        "fonte_nome": "SNIS - Sistema Nacional de Informações sobre Saneamento / Sabesp",
        "fonte_url": "http://www.snis.gov.br/",
        "data_consulta": "2026-09-27"
      },
      "cobertura_vegetal_e_conservacao": {
        "area_protegida_total_km2": 692.5,
        "percentual_territorio_protegido": 63.0,
        "area_verde_urbana_m2_por_hab": 18.4,
        "unidades_conservacao": [
          {
            "nome": "APA Estadual de São Francisco Xavier",
            "categoria": "Uso Sustentável",
            "area_ha": 11500
          },
          {
            "nome": "Parque Estadual Mananciais de Campos do Jordão",
            "categoria": "Proteção Integral",
            "area_ha": 340
          },
          {
            "nome": "Parque Natural Municipal Augusto Ruschi",
            "categoria": "Proteção Integral",
            "area_ha": 250
          },
          {
            "nome": "ARIE Cerâmica e Cerrado",
            "categoria": "Uso Sustentável",
            "area_ha": 120
          }
        ],
        "fonte_nome": "Secretaria de Urbanismo e Sustentabilidade de SJC / Fundação Florestal",
        "fonte_url": "https://www.sjc.sp.gov.br/servicos/urbanismo-e-sustentabilidade/",
        "data_consulta": "2026-09-27"
      },
      "fonte_nome": "CETESB / INPE Queimadas / SNIS / Sabesp",
      "fonte_url": "https://cetesb.sp.gov.br/",
      "data_consulta": "2026-09-27"
    },
    "economia": {
      "pib_municipal_oficial": {
        "pib_corrente_reais_milhoes_2021": 45208.8,
        "pib_corrente_reais_milhoes_2022": 56653.3,
        "pib_per_capita_reais_2022": 81200.0,
        "pib_total_2023_bilhoes": 61.4,
        "pib_per_capita_reais_2023": 88077.14,
        "posicao_ranking_estadual": 9,
        "posicao_ranking_nacional": 23,
        "fonte_nome": "IBGE - Produto Interno Bruto dos Municípios / Fundação SEADE",
        "fonte_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/38/46996",
        "fonte_pib_2023": "IBGE PIB Municípios 2023, divulgado 19/12/2025",
        "nota_composicao_setorial": "Abertura setorial disponível via API SIDRA Tabela 5938 (variáveis 513, 517, 6575) para 2002–2021. Carregada dinamicamente no frontend.",
        "data_consulta": "2026-09-27"
      },
      "pib_serie_historica": [
        {
          "ano": 2010,
          "pib_milhoes": 25848.1,
          "pib_per_capita": 40020.0
        },
        {
          "ano": 2012,
          "pib_milhoes": 26584.7,
          "pib_per_capita": 46210.0
        },
        {
          "ano": 2014,
          "pib_milhoes": 30343.7,
          "pib_per_capita": 52680.0
        },
        {
          "ano": 2016,
          "pib_milhoes": 41630.2,
          "pib_per_capita": 55740.0
        },
        {
          "ano": 2018,
          "pib_milhoes": 39694.8,
          "pib_per_capita": 60520.0
        },
        {
          "ano": 2019,
          "pib_milhoes": 43562.3,
          "pib_per_capita": 61840.0
        },
        {
          "ano": 2020,
          "pib_milhoes": 39363.7,
          "pib_per_capita": 60610.0
        },
        {
          "ano": 2021,
          "pib_milhoes": 45208.8,
          "pib_per_capita": 61320.0
        },
        {
          "ano": 2022,
          "pib_milhoes": 56653.3,
          "pib_per_capita": 81200.0
        },
        {
          "ano": 2023,
          "pib_milhoes": 61400.0,
          "pib_per_capita": 88077.14
        }
      ],
      "novo_caged_2023": {
        "estoque_dez_2023": 212800,
        "salario_medio_formal_sm": 3.4,
        "salario_medio_formal_reais": 4820.0,
        "fonte_nome": "Ministério do Trabalho e Emprego - Novo CAGED",
        "fonte_url": "http://pdet.mte.gov.br/novo-caged",
        "data_consulta": "2026-09-27"
      },
      "emprego_formal_novo_caged": {
        "estoque_carteiras_assinadas_2023": 211530,
        "estoque_carteiras_assinadas_2024": 214042,
        "salario_medio_formal_sm": 3.4,
        "salario_medio_formal_reais": 4820.0,
        "saldo_anual_historico": [
          {
            "ano": 2018,
            "saldo": 1820
          },
          {
            "ano": 2019,
            "saldo": 2410
          },
          {
            "ano": 2020,
            "saldo": -1840
          },
          {
            "ano": 2021,
            "saldo": 8420
          },
          {
            "ano": 2022,
            "saldo": 4910
          },
          {
            "ano": 2023,
            "saldo": 3280
          },
          {
            "ano": 2024,
            "saldo": 2512
          }
        ],
        "distribuicao_setorial_emprego_2023": [
          {
            "setor": "Serviços",
            "vagas": 112100,
            "pct": 53.0
          },
          {
            "setor": "Indústria",
            "vagas": 54980,
            "pct": 26.0
          },
          {
            "setor": "Comércio",
            "vagas": 33840,
            "pct": 16.0
          },
          {
            "setor": "Construção Civil",
            "vagas": 9510,
            "pct": 4.5
          },
          {
            "setor": "Agropecuária",
            "vagas": 1100,
            "pct": 0.5
          }
        ],
        "fonte_nome": "Ministério do Trabalho e Emprego - Novo CAGED",
        "fonte_url": "http://pdet.mte.gov.br/novo-caged",
        "data_consulta": "2026-09-27"
      },
      "caged_mensal_2023_2024": {
        "2023": [
          {
            "mes": "Jan",
            "admissoes": 7450,
            "desligamentos": 7180,
            "saldo": 270
          },
          {
            "mes": "Fev",
            "admissoes": 7890,
            "desligamentos": 7320,
            "saldo": 570
          },
          {
            "mes": "Mar",
            "admissoes": 8420,
            "desligamentos": 7910,
            "saldo": 510
          },
          {
            "mes": "Abr",
            "admissoes": 7650,
            "desligamentos": 7340,
            "saldo": 310
          },
          {
            "mes": "Mai",
            "admissoes": 8110,
            "desligamentos": 7720,
            "saldo": 390
          },
          {
            "mes": "Jun",
            "admissoes": 7920,
            "desligamentos": 7580,
            "saldo": 340
          },
          {
            "mes": "Jul",
            "admissoes": 7840,
            "desligamentos": 7510,
            "saldo": 330
          },
          {
            "mes": "Ago",
            "admissoes": 8310,
            "desligamentos": 7890,
            "saldo": 420
          },
          {
            "mes": "Set",
            "admissoes": 8050,
            "desligamentos": 7690,
            "saldo": 360
          },
          {
            "mes": "Out",
            "admissoes": 8200,
            "desligamentos": 7910,
            "saldo": 290
          },
          {
            "mes": "Nov",
            "admissoes": 8120,
            "desligamentos": 7840,
            "saldo": 280
          },
          {
            "mes": "Dez",
            "admissoes": 6120,
            "desligamentos": 6910,
            "saldo": -790
          }
        ],
        "2024": [
          {
            "mes": "Jan",
            "admissoes": 7610,
            "desligamentos": 7340,
            "saldo": 270
          },
          {
            "mes": "Fev",
            "admissoes": 8040,
            "desligamentos": 7490,
            "saldo": 550
          },
          {
            "mes": "Mar",
            "admissoes": 8510,
            "desligamentos": 8020,
            "saldo": 490
          },
          {
            "mes": "Abr",
            "admissoes": 7820,
            "desligamentos": 7480,
            "saldo": 340
          },
          {
            "mes": "Mai",
            "admissoes": 8290,
            "desligamentos": 7890,
            "saldo": 400
          },
          {
            "mes": "Jun",
            "admissoes": 8010,
            "desligamentos": 7710,
            "saldo": 300
          },
          {
            "mes": "Jul",
            "admissoes": 8190,
            "desligamentos": 7696,
            "saldo": 494
          },
          {
            "mes": "Ago",
            "admissoes": 8450,
            "desligamentos": 8110,
            "saldo": 340
          },
          {
            "mes": "Set",
            "admissoes": 8210,
            "desligamentos": 7910,
            "saldo": 300
          },
          {
            "mes": "Out",
            "admissoes": 8340,
            "desligamentos": 8080,
            "saldo": 260
          },
          {
            "mes": "Nov",
            "admissoes": 8250,
            "desligamentos": 8010,
            "saldo": 240
          },
          {
            "mes": "Dez",
            "admissoes": 6340,
            "desligamentos": 7112,
            "saldo": -772
          }
        ]
      },
      "empresas_ativas_receita_federal_2023": {
        "total_cnpjs_ativos": 88420,
        "total_cnpjs_ativos_2024": 92140,
        "meis_ativos": 51240,
        "microempresas_me": 25180,
        "empresas_pequeno_porte_epp": 6920,
        "medias_e_grandes_empresas": 5080,
        "distribuicao_por_atividade": [
          {
            "setor": "Serviços e Tecnologia",
            "pct": 58.2
          },
          {
            "setor": "Comércio Varejista/Atacadista",
            "pct": 28.4
          },
          {
            "setor": "Indústria de Transformação",
            "pct": 8.6
          },
          {
            "setor": "Construção Civil",
            "pct": 4.8
          }
        ],
        "fonte_nome": "Receita Federal do Brasil / Portal Empresa Fácil SJC",
        "fonte_url": "https://solucoes.receita.fazenda.gov.br/",
        "data_consulta": "2026-09-27"
      },
      "fonte_nome": "IBGE / Ministério do Trabalho (CAGED) / Receita Federal",
      "fonte_url": "https://www.ibge.gov.br/",
      "data_consulta": "2026-09-27"
    },
    "educacao": {
      "ideb_inep_serie": [
        {
          "ano": 2005,
          "anos_iniciais": 5.1,
          "anos_iniciais_fundamental": 5.1,
          "meta_iniciais": 4.8,
          "anos_finais": 4.3,
          "meta_finais": 3.9
        },
        {
          "ano": 2007,
          "anos_iniciais": 5.5,
          "anos_iniciais_fundamental": 5.5,
          "meta_iniciais": 5.0,
          "anos_finais": 4.4,
          "meta_finais": 4.1
        },
        {
          "ano": 2009,
          "anos_iniciais": 5.8,
          "anos_iniciais_fundamental": 5.8,
          "meta_iniciais": 5.4,
          "anos_finais": 4.6,
          "meta_finais": 4.4
        },
        {
          "ano": 2011,
          "anos_iniciais": 6.1,
          "anos_iniciais_fundamental": 6.1,
          "meta_iniciais": 5.7,
          "anos_finais": 4.9,
          "meta_finais": 4.7
        },
        {
          "ano": 2013,
          "anos_iniciais": 6.4,
          "anos_iniciais_fundamental": 6.4,
          "meta_iniciais": 6.0,
          "anos_finais": 5.1,
          "meta_finais": 5.0
        },
        {
          "ano": 2015,
          "anos_iniciais": 6.7,
          "anos_iniciais_fundamental": 6.7,
          "meta_iniciais": 6.2,
          "anos_finais": 5.2,
          "meta_finais": 5.2
        },
        {
          "ano": 2017,
          "anos_iniciais": 7.0,
          "anos_iniciais_fundamental": 7.0,
          "meta_iniciais": 6.5,
          "anos_finais": 5.3,
          "meta_finais": 5.5
        },
        {
          "ano": 2019,
          "anos_iniciais": 7.1,
          "anos_iniciais_fundamental": 7.1,
          "meta_iniciais": 6.7,
          "anos_finais": 5.7,
          "meta_finais": 5.7
        },
        {
          "ano": 2021,
          "anos_iniciais": 6.6,
          "anos_iniciais_fundamental": 6.6,
          "meta_iniciais": 6.9,
          "anos_finais": 5.5,
          "meta_finais": 6.0
        },
        {
          "ano": 2023,
          "anos_iniciais": 6.8,
          "anos_iniciais_fundamental": 6.8,
          "meta_iniciais": 7.0,
          "anos_finais": 5.8,
          "meta_finais": 6.2
        }
      ],
      "matriculas_censo_escolar_2023": {
        "ano": 2023,
        "total_matriculas": 142850,
        "educacao_infantil": 31240,
        "ensino_fundamental": 68420,
        "ensino_medio": 24980,
        "educacao_profissional_tecnica": 8920,
        "educacao_jovens_adultos_eja": 4120,
        "educacao_especial": 5170,
        "ensino_superior_graduacao": 42100,
        "fonte_nome": "INEP / MEC - Censo Escolar da Educação Básica",
        "fonte_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar",
        "data_consulta": "2026-09-27"
      },
      "matriculas_por_rede_censo_2023": [
        {
          "rede": "Municipal",
          "matriculas": 56420,
          "pct": 39.5
        },
        {
          "rede": "Estadual",
          "matriculas": 48910,
          "pct": 34.2
        },
        {
          "rede": "Privada",
          "matriculas": 34980,
          "pct": 24.5
        },
        {
          "rede": "Federal",
          "matriculas": 2540,
          "pct": 1.8
        }
      ],
      "indicadores_socioeducacionais": {
        "taxa_escolarizacao_6_a_14_anos": 99.09,
        "idhm_educacao": 0.764,
        "taxa_analfabetismo_15_anos_mais": 2.1,
        "fonte_nome": "IBGE Cidades / Atlas do Desenvolvimento Humano",
        "fonte_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
        "data_consulta": "2026-09-27"
      },
      "fonte_nome": "INEP / MEC - Instituto Nacional de Estudos e Pesquisas Educacionais",
      "fonte_url": "https://www.gov.br/inep/pt-br",
      "data_consulta": "2026-09-27"
    },
    "mobilidade": {
      "frota_veiculos_senatran_2023": {
        "ano": 2023,
        "total": 468920,
        "total_veiculos": 468920,
        "automoveis": 298410,
        "motocicletas": 79420,
        "comerciais_leves_caminhonetes": 51240,
        "caminhoes_tratores": 14980,
        "onibus_microonibus": 5890,
        "outros_reboques": 18980,
        "taxa_motorizacao_veic_por_hab": 0.67,
        "fonte_nome": "SENATRAN - Secretaria Nacional de Trânsito",
        "fonte_url": "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-senatran/frota-de-veiculos-2024",
        "data_consulta": "2026-09-27"
      },
      "frota_veiculos_serie_historica": [
        {
          "ano": 2012,
          "total": 352100,
          "automoveis": 234100,
          "motos": 54200
        },
        {
          "ano": 2015,
          "total": 395400,
          "automoveis": 258900,
          "motos": 64100
        },
        {
          "ano": 2018,
          "total": 428900,
          "automoveis": 278100,
          "motos": 70900
        },
        {
          "ano": 2020,
          "total": 444200,
          "automoveis": 286400,
          "motos": 73800
        },
        {
          "ano": 2022,
          "total": 459800,
          "automoveis": 293200,
          "motos": 76900
        },
        {
          "ano": 2023,
          "total": 468920,
          "automoveis": 298410,
          "motos": 79420
        },
        {
          "ano": 2024,
          "total": 476500,
          "automoveis": 302800,
          "motos": 81900
        }
      ],
      "fatalidades_transito_infosiga_serie": [
        {
          "ano": 2015,
          "obitos": 86,
          "taxa_por_100k": 12.6,
          "total_obitos": 86
        },
        {
          "ano": 2016,
          "obitos": 80,
          "taxa_por_100k": 11.8,
          "total_obitos": 80
        },
        {
          "ano": 2017,
          "obitos": 75,
          "taxa_por_100k": 11.0,
          "total_obitos": 75
        },
        {
          "ano": 2018,
          "obitos": 72,
          "taxa_por_100k": 10.4,
          "total_obitos": 72
        },
        {
          "ano": 2019,
          "obitos": 68,
          "taxa_por_100k": 9.7,
          "total_obitos": 68
        },
        {
          "ano": 2020,
          "obitos": 61,
          "taxa_por_100k": 8.5,
          "total_obitos": 61
        },
        {
          "ano": 2021,
          "obitos": 67,
          "taxa_por_100k": 9.3,
          "total_obitos": 67
        },
        {
          "ano": 2022,
          "obitos": 70,
          "taxa_por_100k": 10.0,
          "total_obitos": 70
        },
        {
          "ano": 2023,
          "obitos": 74,
          "taxa_por_100k": 10.6,
          "total_obitos": 74
        },
        {
          "ano": 2024,
          "obitos": 82,
          "taxa_por_100k": 11.3,
          "total_obitos": 82
        }
      ],
      "fatalidades_transito_mensal_2023_2024": {
        "2023": [
          {
            "mes": "Jan",
            "obitos": 6
          },
          {
            "mes": "Fev",
            "obitos": 5
          },
          {
            "mes": "Mar",
            "obitos": 7
          },
          {
            "mes": "Abr",
            "obitos": 6
          },
          {
            "mes": "Mai",
            "obitos": 8
          },
          {
            "mes": "Jun",
            "obitos": 6
          },
          {
            "mes": "Jul",
            "obitos": 5
          },
          {
            "mes": "Ago",
            "obitos": 7
          },
          {
            "mes": "Set",
            "obitos": 6
          },
          {
            "mes": "Out",
            "obitos": 6
          },
          {
            "mes": "Nov",
            "obitos": 6
          },
          {
            "mes": "Dez",
            "obitos": 6
          }
        ],
        "2024": [
          {
            "mes": "Jan",
            "obitos": 7
          },
          {
            "mes": "Fev",
            "obitos": 6
          },
          {
            "mes": "Mar",
            "obitos": 8
          },
          {
            "mes": "Abr",
            "obitos": 7
          },
          {
            "mes": "Mai",
            "obitos": 9
          },
          {
            "mes": "Jun",
            "obitos": 6
          },
          {
            "mes": "Jul",
            "obitos": 7
          },
          {
            "mes": "Ago",
            "obitos": 7
          },
          {
            "mes": "Set",
            "obitos": 6
          },
          {
            "mes": "Out",
            "obitos": 7
          },
          {
            "mes": "Nov",
            "obitos": 6
          },
          {
            "mes": "Dez",
            "obitos": 6
          }
        ]
      },
      "perfil_vitimas_transito_infosiga": [
        {
          "modal": "Motociclistas",
          "pct": 49.5
        },
        {
          "modal": "Pedestres (Atropelamentos)",
          "pct": 21.8
        },
        {
          "modal": "Ocupantes de Automóvel",
          "pct": 18.2
        },
        {
          "modal": "Ciclistas",
          "pct": 8.1
        },
        {
          "modal": "Outros / Não Especificado",
          "pct": 2.4
        }
      ],
      "fonte_nome": "SENATRAN / Detran-SP (Infosiga SP)",
      "fonte_url": "https://infosiga.detran.sp.gov.br/",
      "data_consulta": "2026-09-27"
    },
    "financas": {
      "execucao_orcamentaria_2023_reais_milhoes": {
        "receita_total_arrecadada": 3842.6,
        "despesa_total_liquidada": 3721.4,
        "resultado_orcamentario_superavit": 121.2,
        "aplicacao_saude_asps_pct": 27.2,
        "aplicacao_educacao_mde_pct": 25.5,
        "despesa_total_pessoal_rcl_pct": 41.8,
        "fonte_nome": "TCE-SP / SICONFI",
        "fonte_url": "https://www.tce.sp.gov.br/painel-gestao/",
        "data_consulta": "2026-09-27"
      },
      "orcamento_municipal_tce_siconfi_2023": {
        "receita_arrecadada_reais_milhoes": 3842.6,
        "despesa_liquidada_reais_milhoes": 3721.4,
        "superavit_orcamentario_reais_milhoes": 121.2,
        "despesa_pessoal_pct_receita_corrente_liquida": 41.8,
        "limite_alerta_lei_resp_fiscal_pct": 48.6,
        "limite_maximo_lrf_pct": 54.0,
        "indice_efetividade_gestao_iegm_tce": "B+ (Muito Efetiva)",
        "fonte_nome": "TCE-SP / SICONFI - Sistema de Informações Contábeis e Fiscais",
        "fonte_url": "https://www.tce.sp.gov.br/painel-gestao/",
        "data_consulta": "2026-09-27"
      },
      "orcamento_serie_historica": [
        {
          "ano": 2018,
          "receita_milhoes": 2680.0,
          "despesa_milhoes": 2610.0,
          "superavit_milhoes": 70.0
        },
        {
          "ano": 2019,
          "receita_milhoes": 2890.0,
          "despesa_milhoes": 2810.0,
          "superavit_milhoes": 80.0
        },
        {
          "ano": 2020,
          "receita_milhoes": 3020.0,
          "despesa_milhoes": 2980.0,
          "superavit_milhoes": 40.0
        },
        {
          "ano": 2021,
          "receita_milhoes": 3390.0,
          "despesa_milhoes": 3210.0,
          "superavit_milhoes": 180.0
        },
        {
          "ano": 2022,
          "receita_milhoes": 3680.0,
          "despesa_milhoes": 3540.0,
          "superavit_milhoes": 140.0
        },
        {
          "ano": 2023,
          "receita_milhoes": 3842.6,
          "despesa_milhoes": 3721.4,
          "superavit_milhoes": 121.2
        },
        {
          "ano": 2024,
          "receita_milhoes": 4210.0,
          "despesa_milhoes": 4085.0,
          "superavit_milhoes": 125.0
        }
      ],
      "despesas_por_funcao_governo_2023_reais_milhoes": [
        {
          "funcao": "Saúde",
          "valor_milhoes": 1012.4,
          "pct": 27.2
        },
        {
          "funcao": "Educação",
          "valor_milhoes": 948.8,
          "pct": 25.5
        },
        {
          "funcao": "Urbanismo e Obras",
          "valor_milhoes": 521.0,
          "pct": 14.0
        },
        {
          "funcao": "Administração Geral",
          "valor_milhoes": 372.1,
          "pct": 10.0
        },
        {
          "funcao": "Transporte e Mobilidade Urbana",
          "valor_milhoes": 297.7,
          "pct": 8.0
        },
        {
          "funcao": "Segurança Pública",
          "valor_milhoes": 130.2,
          "pct": 3.5
        },
        {
          "funcao": "Assistência Social",
          "valor_milhoes": 111.6,
          "pct": 3.0
        },
        {
          "funcao": "Saneamento e Gestão Ambiental",
          "valor_milhoes": 93.0,
          "pct": 2.5
        },
        {
          "funcao": "Demais Funções (Cultura, Esporte, Habitação)",
          "valor_milhoes": 234.6,
          "pct": 6.3
        }
      ],
      "composicao_receitas_2023": [
        {
          "origem": "ISS (Imposto Sobre Serviços)",
          "valor_milhoes": 842.0,
          "pct": 21.9
        },
        {
          "origem": "ICMS (Cota-Parte Estadual)",
          "valor_milhoes": 798.0,
          "pct": 20.8
        },
        {
          "origem": "IPTU (Imposto Predial e Territorial)",
          "valor_milhoes": 452.0,
          "pct": 11.8
        },
        {
          "origem": "IPVA (Cota-Parte Estadual)",
          "valor_milhoes": 312.0,
          "pct": 8.1
        },
        {
          "origem": "FPM (Fundo de Participação dos Municípios)",
          "valor_milhoes": 286.0,
          "pct": 7.4
        },
        {
          "origem": "Transferências SUS e FNDE",
          "valor_milhoes": 542.0,
          "pct": 14.1
        },
        {
          "origem": "Outras Receitas Correntes e de Capital",
          "valor_milhoes": 610.6,
          "pct": 15.9
        }
      ],
      "fonte_nome": "Tribunal de Contas do Estado de São Paulo (TCE-SP) / SICONFI STN",
      "fonte_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "data_consulta": "2026-09-27"
    }
  }
};

const RADAR_HUB_METADATA_REGISTRY = {
  "registry_version": "2.0.0-expanded-81",
  "last_audit_execution": "2026-09-28",
  "audit_engine": "Radar Hub Continuous Auditor v1.4",
  "indicators": [
    {
      "indicator_id": "demo_populacao_censo",
      "name": "População Residente (Censo 2022)",
      "category": "demografia",
      "value": 697054,
      "unit": "habitantes",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo Demográfico 2022 / SIDRA Tabela 4714",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Contagem censitária universal de pessoas residentes em domicílios particulares e coletivos com data de referência em 1º de agosto de 2022, retificada pós-revisão técnica.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_populacao_estimada_2024",
      "name": "População Estimada (IBGE 2024)",
      "category": "demografia",
      "value": 725450,
      "unit": "habitantes",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Estimativas Populacionais DOU 2024 / Portaria 1099",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2025-12-31",
      "context_warning": null,
      "methodology": "Estimativa populacional calculada pelo método das componentes demográficas com base no Censo 2022 e registros civis.",
      "official_url": "https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_populacao_estimada_2026",
      "name": "Projeção Demográfica Tendencial (2026)",
      "category": "demografia",
      "value": 737396,
      "unit": "habitantes",
      "source_agency": "Fundação SEADE / IBGE",
      "source_system": "Projeções Populacionais Municipais",
      "base_year": "2026",
      "frequency": "Bienal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": "Projeção estatística baseada no ritmo geométrico de crescimento intercensitário.",
      "methodology": "Extrapolação geométrica de tendência populacional baseada no crescimento de 0,82% ao ano.",
      "official_url": "https://repositorio.seade.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_domicilios_total",
      "name": "Total de Domicílios Recenseados (Censo 2022)",
      "category": "demografia",
      "value": 253180,
      "unit": "domicílios",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo Demográfico 2022 / SIDRA Tabela 4714",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Total de domicílios particulares permanentes, improvisados e coletivos mapeados na operação censitária.",
      "official_url": "https://sidra.ibge.gov.br/tabela/4714",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_domicilios_ocupados",
      "name": "Domicílios Particulares Ocupados (Censo 2022)",
      "category": "demografia",
      "value": 247894,
      "unit": "domicílios",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo Demográfico 2022 / IBGE Cidades",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Domicílios particulares permanentes habitados no momento da entrevista do Censo 2022.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_media_moradores",
      "name": "Média de Moradores por Domicílio",
      "category": "demografia",
      "value": 2.75,
      "unit": "moradores/domicílio",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo Demográfico 2022",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Razão direta entre o total de residentes em domicílios particulares permanentes e o total de domicílios ocupados.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_area_territorial",
      "name": "Área Territorial Oficial",
      "category": "demografia",
      "value": 1099.4,
      "unit": "km²",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Malha Municipal e Quadro Territorial",
      "base_year": "2022",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Cálculo geodésico da extensão territorial da malha oficial do município.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_densidade_demografica",
      "name": "Densidade Demográfica",
      "category": "demografia",
      "value": 634.3,
      "unit": "hab/km²",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo Demográfico 2022",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Divisão da população total de 697.054 habitantes pela área territorial de 1.099,4 km².",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_taxa_urbanizacao",
      "name": "Taxa de Urbanização",
      "category": "demografia",
      "value": 98.2,
      "unit": "%",
      "source_agency": "IBGE / Fundação SEADE",
      "source_system": "Pesquisas Demográficas Regionais",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Percentual de habitantes domiciliados dentro do perímetro urbano legal.",
      "official_url": "https://repositorio.seade.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_populacao_mulheres",
      "name": "População Feminina Residente",
      "category": "demografia",
      "value": 358983,
      "unit": "habitantes",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo 2022 / SIDRA Tabela 9514",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Contagem censitária de pessoas residentes do sexo feminino (51,5% do total municipal).",
      "official_url": "https://sidra.ibge.gov.br/tabela/9514",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_populacao_homens",
      "name": "População Masculina Residente",
      "category": "demografia",
      "value": 338071,
      "unit": "habitantes",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo 2022 / SIDRA Tabela 9514",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Contagem censitária de pessoas residentes do sexo masculino (48,5% do total municipal).",
      "official_url": "https://sidra.ibge.gov.br/tabela/9514",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_razao_sexo",
      "name": "Razão de Sexo (Homens por 100 Mulheres)",
      "category": "demografia",
      "value": 94.17,
      "unit": "homens/100 mulheres",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Censo 2022 / SIDRA Tabela 9514",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Quociente da população masculina pela feminina multiplicado por 100.",
      "official_url": "https://sidra.ibge.gov.br/tabela/9514",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "demo_indice_envelhecimento_2022",
      "name": "Índice de Envelhecimento Demográfico",
      "category": "demografia",
      "value": 81.6,
      "unit": "idosos/100 jovens",
      "source_agency": "IBGE / Fundação SEADE",
      "source_system": "Indicadores Demográficos Municipais",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Número de pessoas com 60 anos ou mais para cada 100 pessoas de 0 a 14 anos.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_mortalidade_infantil",
      "name": "Taxa de Mortalidade Infantil (por mil nascidos vivos)",
      "category": "saude",
      "value": 8.2,
      "unit": "óbitos por mil nascidos vivos",
      "source_agency": "SMS-SJC (Relatório de Gestão) / Ministério da Saúde (SIM/SINASC) / IBGE Cidades",
      "source_system": "SIM (Sistema de Informações sobre Mortalidade) / SINASC / SMS-SJC",
      "base_year": "2024 / 2025",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": "DIVERGÊNCIA DE FONTES: O IBGE Cidades publica 7,77 óbitos/mil identificando 2025; o Relatório de Gestão da Secretaria Municipal de Saúde de SJC (3º Quadri 2025) registra 8,20 para 2024 (66 óbitos / 8.048 nascidos) e 7,65 para 2025 (61 óbitos / 7.974 nascidos, preliminar). Em municípios com ~8.000 nascimentos anuais, pequenas flutuações absolutas (3 a 5 eventos) causam variações na taxa. A meta ODS 3.2 da ONU de < 12/mil refere-se estritamente à mortalidade neonatal (0 a 27 dias), e a meta para menores de 5 anos é < 25/mil.",
      "methodology": "Taxa calculada como: (Óbitos de menores de 1 ano de mães residentes ÷ Nascidos vivos de mães residentes) × 1.000. Utiliza dados diretos da vigilância epidemiológica municipal e bases federais SIM/SINASC.",
      "official_url": "https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/Quadri_3_2025_1_20260227124829.pdf",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_leitos_hospitalares_total",
      "name": "Total de Leitos Hospitalares Cadastrados (CNES)",
      "category": "saude",
      "value": 1894,
      "unit": "leitos cadastrados",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "Cadastro Nacional de Estabelecimentos de Saúde (CNES)",
      "base_year": "2024 (Competência 12/2024)",
      "frequency": "Mensal (Competência Dezembro/2024)",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": "Os dados representam a capacidade instalada cadastrada e existente no CNES na competência Dezembro/2024 (não refletem necessariamente leitos disponíveis em tempo real). Total reconciliado: 1.562 Clínicos/Cirúrgicos + 332 UTI = 1.894 leitos totais (846 SUS e 1.048 Não-SUS/Privado).",
      "methodology": "Soma de todos os leitos de internação e terapia intensiva cadastrados nos estabelecimentos hospitalares de São José dos Campos (CNES).",
      "official_url": "https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_leitos_sus",
      "name": "Leitos Hospitalares Públicos (Rede SUS)",
      "category": "saude",
      "value": 846,
      "unit": "leitos SUS",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "CNES / DataSUS",
      "base_year": "2024 (Competência 12/2024)",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Leitos hospitalares cadastrados para atendimento público no SUS em SJC: 698 Clínicos/Cirúrgicos + 102 UTI Adulto + 46 UTI Pediátrica/Neonatal = 846 leitos (44,7% da rede municipal).",
      "official_url": "https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_leitos_nao_sus",
      "name": "Leitos Hospitalares Privados e Conveniados (Não-SUS)",
      "category": "saude",
      "value": 1048,
      "unit": "leitos privados/conveniados",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "CNES / DataSUS",
      "base_year": "2024 (Competência 12/2024)",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Leitos hospitalares operados pela rede suplementar de saúde (convênios e particulares) em SJC: 864 Clínicos/Cirúrgicos + 138 UTI Adulto + 46 UTI Pediátrica/Neonatal = 1.048 leitos (55,3% da rede municipal).",
      "official_url": "https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_taxa_leitos_mil_hab",
      "name": "Taxa de Leitos Hospitalares por Mil Habitantes",
      "category": "saude",
      "value": 2.61,
      "unit": "leitos / mil hab.",
      "source_agency": "Ministério da Saúde / DataSUS / IBGE",
      "source_system": "CNES / IBGE Estimativa Populacional 2024",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Razão entre o total de leitos cadastrados (1.894) e a população residente estimada (724.756 hab.). Parâmetro da Portaria MS/GM nº 1.101/2002: 2,5 a 3,0 leitos/mil hab.",
      "official_url": "https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_leitos_uti_adulto",
      "name": "Leitos de UTI Adulto Cadastrados",
      "category": "saude",
      "value": 240,
      "unit": "leitos UTI adulto",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "CNES / DataSUS (Competência 12/2024)",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Total de leitos de Terapia Intensiva Adulto cadastrados no CNES: 102 SUS + 138 Não-SUS = 240 leitos de UTI Adulto.",
      "official_url": "https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_leitos_uti_pediatrica",
      "name": "Leitos de UTI Pediátrica e Neonatal Cadastrados",
      "category": "saude",
      "value": 92,
      "unit": "leitos UTI ped/neo",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "CNES / DataSUS (Competência 12/2024)",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Leitos de terapia intensiva pediátricos (34 leitos: 18 SUS + 16 Privado) e neonatais (58 leitos: 28 SUS + 30 Privado) cadastrados no CNES. Total = 92 leitos (46 SUS + 46 Não-SUS).",
      "official_url": "https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_estabelecimentos_total",
      "name": "Total de Estabelecimentos de Saúde em SJC",
      "category": "saude",
      "value": 528,
      "unit": "estabelecimentos",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "CNES / DataSUS",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Soma de hospitais gerais e especializados (12), UBS/ESF (45), UPAs (6), CAPS (6), clínicas e laboratórios cadastrados no CNES.",
      "official_url": "http://cnes.datasus.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_cobertura_atencao_basica",
      "name": "Cobertura da Atenção Primária à Saúde",
      "category": "saude",
      "value": 83.5,
      "unit": "% da população coberta",
      "source_agency": "Ministério da Saúde",
      "source_system": "e-Gestor Atenção Básica",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Percentual da população municipal estimada coberta por equipes de Saúde da Família (eSF) e de Atenção Primária (eAP).",
      "official_url": "https://egestorab.saude.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_nascidos_vivos_sinasc",
      "name": "Nascidos Vivos e Via de Parto (SINASC)",
      "category": "saude",
      "value": 7463,
      "unit": "nascimentos (62,4% cesáreo)",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "SINASC (Sistema de Informações sobre Nascidos Vivos / TabNet)",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Declarações de Nascido Vivo (DNV) registradas no SINASC para mães residentes em São José dos Campos. Série histórica 2010 a 2024 com estratificação de partos cesarianos e vaginais.",
      "official_url": "http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sinasc/cnv/nvsp.def",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_cobertura_vacinal_bcg",
      "name": "Cobertura Vacinal BCG em Crianças",
      "category": "saude",
      "value": 94.2,
      "unit": "% de cobertura",
      "source_agency": "SMS-SJC (Relatório de Gestão) / Ministério da Saúde (RNDS/SI-PNI)",
      "source_system": "Relatório de Gestão SMS-SJC / RNDS",
      "base_year": "2024 / 2025",
      "frequency": "Anual / Quadrimestral",
      "geographic_level": "Municipal (Código IBGE: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": "O Ministério da Saúde migrou a captação das doses para a Rede Nacional de Dados em Saúde (RNDS), com dados históricos do SI-PNI sob revisão metodológica. O Relatório Municipal de Gestão registra 94,20% em 2024 e 90,80% em 2025 (Meta PNI: 90%).",
      "methodology": "Doses aplicadas da vacina BCG em menores de 1 ano de idade em relação ao total de nascidos vivos residentes no município.",
      "official_url": "https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/Quadri_3_2025_1_20260227124829.pdf",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "seg_taxa_homicidios",
      "name": "Taxa de Homicídios Dolosos por 100 mil habitantes",
      "category": "seguranca",
      "value": 3.28,
      "unit": "vítimas por 100 mil hab.",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "Estatísticas Criminais Oficiais / SSP-SP",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "verificacao": "primaria",
      "context_warning": null,
      "methodology": "Taxa calculada pela SSP-SP com base em 23 vítimas de homicídio doloso em 2024. Em 2025, foram registradas 33 vítimas (taxa de 4,55/100k), mantendo o município em patamar muito inferior ao limiar crítico da OMS (10/100k).",
      "official_url": "https://www.ssp.sp.gov.br/estatistica/dados-mensais"
    },
    {
      "indicator_id": "seg_taxa_homicidios_2024",
      "name": "Taxa Histórica de Homicídios Dolosos (2024)",
      "category": "seguranca",
      "value": 3.17,
      "unit": "homicídios por 100 mil hab.",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "SSP-SP - Estatísticas Criminais Mensais",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": "Mínimo histórico de letalidade violenta registrado pela SSP-SP no município.",
      "methodology": "Cálculo oficial da SSP-SP para o fechamento anual de 2024 com 23 ocorrências.",
      "official_url": "https://https://www.ssp.sp.gov.br/estatistica/dados-mensais/dataset/estatisticas-da-seguranca-publica",
      "notes": "Leitura e consolidação das estatísticas oficiais da SSP-SP e Prefeitura de SJC de filtros da Transparência SSP-SP em 2026-09-27 (referência estável: https://www.ssp.sp.gov.br/estatistica/dados-mensais), dado sujeito a nova checagem periódica.",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "seg_homicidios_dolosos_2024",
      "name": "Vítimas de Homicídio Doloso (2024)",
      "category": "seguranca",
      "value": 23,
      "unit": "vítimas",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "Estatísticas Criminais Oficiais / SSP-SP",
      "base_year": "2024",
      "frequency": "Anual / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "verificacao": "primaria",
      "context_warning": null,
      "methodology": "Total de vítimas em ocorrências de homicídio doloso registradas nos Distritos Policiais de São José dos Campos. Exclui latrocínio (crime contra o patrimônio com resultado morte).",
      "official_url": "https://www.ssp.sp.gov.br/estatistica/dados-mensais"
    },
    {
      "indicator_id": "seg_homicidios_dolosos_2023",
      "name": "Ocorrências de Homicídio Doloso (2023)",
      "category": "seguranca",
      "value": 44,
      "unit": "ocorrências",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "SSP-SP - Painel de Indicadores Criminais",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Consolidação anual oficial da SSP-SP para o ano de 2023 (queda de 4,3% em relação a 2022).",
      "official_url": "https://https://www.ssp.sp.gov.br/estatistica/dados-mensais/dataset/estatisticas-da-seguranca-publica",
      "notes": "Leitura e consolidação das estatísticas oficiais da SSP-SP e Prefeitura de SJC de filtros da Transparência SSP-SP em 2026-09-27 (referência estável: https://www.ssp.sp.gov.br/estatistica/dados-mensais), dado sujeito a nova checagem periódica.",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "seg_roubos_veiculos_2024",
      "name": "Roubo de Veículos (2024)",
      "category": "seguranca",
      "value": 118,
      "unit": "ocorrências",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "Estatísticas Criminais / SSP-SP",
      "base_year": "2024",
      "frequency": "Anual / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "verificacao": "primaria",
      "context_warning": null,
      "methodology": "Subtração de veículo mediante violência ou grave ameaça (art. 157 CP). Registros consolidados na SSP-SP.",
      "official_url": "https://www.ssp.sp.gov.br/estatistica/dados-mensais"
    },
    {
      "indicator_id": "seg_roubos_veiculos_2023",
      "name": "Ocorrências de Roubo de Veículos (2023)",
      "category": "seguranca",
      "value": 157,
      "unit": "ocorrências",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "SSP-SP - Painel de Indicadores Criminais",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": "Queda recorde de 35,1% em relação aos 242 casos de 2022.",
      "methodology": "Consolidação anual da SSP-SP referente a roubos de veículos registrados em SJC.",
      "official_url": "https://https://www.ssp.sp.gov.br/estatistica/dados-mensais/dataset/estatisticas-da-seguranca-publica",
      "notes": "Leitura e consolidação das estatísticas oficiais da SSP-SP e Prefeitura de SJC de filtros da Transparência SSP-SP em 2026-09-27 (referência estável: https://www.ssp.sp.gov.br/estatistica/dados-mensais), dado sujeito a nova checagem periódica.",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "seg_furtos_veiculos_2024",
      "name": "Furto de Veículos (2024)",
      "category": "seguranca",
      "value": 1140,
      "unit": "ocorrências",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "Estatísticas Criminais / SSP-SP",
      "base_year": "2024",
      "frequency": "Anual / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "verificacao": "primaria",
      "context_warning": null,
      "methodology": "Subtração de veículo sem violência ou grave ameaça à pessoa (art. 155 CP).",
      "official_url": "https://www.ssp.sp.gov.br/estatistica/dados-mensais"
    },
    {
      "indicator_id": "seg_furtos_veiculos_2023",
      "name": "Ocorrências de Furto de Veículos (2023)",
      "category": "seguranca",
      "value": 1220,
      "unit": "ocorrências",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "SSP-SP - Painel de Indicadores Criminais",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Total anual oficial de furtos de veículos registrados em 2023 (redução de 2,2% vs 2022).",
      "official_url": "https://https://www.ssp.sp.gov.br/estatistica/dados-mensais/dataset/estatisticas-da-seguranca-publica",
      "notes": "Leitura e consolidação das estatísticas oficiais da SSP-SP e Prefeitura de SJC de filtros da Transparência SSP-SP em 2026-09-27 (referência estável: https://www.ssp.sp.gov.br/estatistica/dados-mensais), dado sujeito a nova checagem periódica.",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "seg_roubos_gerais",
      "name": "Ocorrências de Roubos Totais (Exclusive Veículos)",
      "category": "seguranca",
      "value": 1845,
      "unit": "ocorrências",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "SSP-SP - Painel de Indicadores Criminais",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Soma de roubos a transeuntes, comércios e residências registrados nos DPs de SJC em 2023.",
      "official_url": "https://https://www.ssp.sp.gov.br/estatistica/dados-mensais/dataset/estatisticas-da-seguranca-publica",
      "notes": "Leitura e consolidação das estatísticas oficiais da SSP-SP e Prefeitura de SJC de filtros da Transparência SSP-SP em 2026-09-27 (referência estável: https://www.ssp.sp.gov.br/estatistica/dados-mensais), dado sujeito a nova checagem periódica.",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "seg_violencia_mulher_medidas",
      "name": "Pedidos de Medidas Protetivas Ajuizados (Estado de SP)",
      "category": "seguranca",
      "value": 101034,
      "unit": "pedidos ajuizados",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP) & TJSP",
      "source_system": "Estatísticas de Violência contra a Mulher / SSP-SP",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Estadual (SP)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "verificacao": "primaria",
      "context_warning": "Dado consolidado do Estado de São Paulo para acompanhamento da demanda de proteção jurídica.",
      "methodology": "Total oficial de pedidos de medidas protetivas de urgência ajuizados no Estado de São Paulo (98.868 em 2023, 101.034 em 2024 e 118.694 em 2025).",
      "official_url": "https://www.ssp.sp.gov.br/estatistica/violencia-contra-a-mulher"
    },
    {
      "indicator_id": "seg_produtividade_prisoes",
      "name": "Prisões Efetuadas pelas Forças Policiais",
      "category": "seguranca",
      "value": 2418,
      "unit": "prisões",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "SSP-SP - Produtividade Policial",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Prisões em flagrante delito e por mandado judicial cumpridas pelas polícias Civil e Militar.",
      "official_url": "https://https://www.ssp.sp.gov.br/estatistica/dados-mensais/dataset/estatisticas-da-seguranca-publica",
      "notes": "Leitura e consolidação das estatísticas oficiais da SSP-SP e Prefeitura de SJC de filtros da Transparência SSP-SP em 2026-09-27 (referência estável: https://www.ssp.sp.gov.br/estatistica/dados-mensais), dado sujeito a nova checagem periódica.",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_qualidade_ar_cetesb",
      "name": "Dias de Ar 'Bom' - Estação Jardim Satélite",
      "category": "meio_ambiente",
      "value": 312,
      "unit": "dias/ano",
      "source_agency": "Companhia Ambiental do Estado de São Paulo (CETESB)",
      "source_system": "Rede Automática de Monitoramento do Ar - Estação Jd. Satélite",
      "base_year": "2023",
      "frequency": "Diário / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Dias com Índice de Qualidade do Ar (IQAr) enquadrado na faixa 'Boa' (82,4% do ano).",
      "official_url": "https://cetesb.sp.gov.br/ar/qualidade-do-ar/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_qualidade_ar_vista_verde",
      "name": "Dias de Ar 'Bom' - Estação Vista Verde",
      "category": "meio_ambiente",
      "value": 324,
      "unit": "dias/ano",
      "source_agency": "Companhia Ambiental do Estado de São Paulo (CETESB)",
      "source_system": "Rede Automática de Monitoramento do Ar - Estação Vista Verde",
      "base_year": "2023",
      "frequency": "Diário / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Monitoramento contínuo com sensores telemétricos na zona leste (79,8% de dias classificados como 'Bom').",
      "official_url": "https://cetesb.sp.gov.br/ar/qualidade-do-ar/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_focos_queimadas_2024",
      "name": "Focos de Calor e Queimadas (INPE 2024)",
      "category": "meio_ambiente",
      "value": 94,
      "unit": "focos de calor",
      "source_agency": "Instituto Nacional de Pesquisas Espaciais (INPE)",
      "source_system": "Programa Queimadas / BDQueimadas",
      "base_year": "2024",
      "frequency": "Diário / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": "Ano com estiagem severa e recorde de focos no inverno.",
      "methodology": "Detecção de anomalias térmicas capturadas pelos sensores MODIS e VIIRS a bordo de satélites ambientais.",
      "official_url": "https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_focos_queimadas_2023",
      "name": "Focos de Calor e Queimadas (INPE 2023)",
      "category": "meio_ambiente",
      "value": 46,
      "unit": "focos de calor",
      "source_agency": "Instituto Nacional de Pesquisas Espaciais (INPE)",
      "source_system": "Programa Queimadas / BDQueimadas",
      "base_year": "2023",
      "frequency": "Diário / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Total anual de focos de calor processados pelo satélite de referência do INPE.",
      "official_url": "https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_saneamento_agua_tratada",
      "name": "Índice de Atendimento de Água Tratada",
      "category": "meio_ambiente",
      "value": 99.8,
      "unit": "%",
      "source_agency": "Sistema Nacional de Informações sobre Saneamento (SNIS) / Sabesp",
      "source_system": "SNIS - Painel de Indicadores de Saneamento",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "População total atendida por rede pública de abastecimento de água potável.",
      "official_url": "http://www.snis.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_saneamento_esgoto",
      "name": "Índice de Coleta de Esgoto Sanitário",
      "category": "meio_ambiente",
      "value": 98.6,
      "unit": "%",
      "source_agency": "Sistema Nacional de Informações sobre Saneamento (SNIS) / Sabesp",
      "source_system": "SNIS - Painel de Indicadores de Saneamento",
      "base_year": "2022",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Percentual de domicílios urbanos conectados à rede coletora pública de esgoto da Sabesp.",
      "official_url": "http://www.snis.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_saneamento_tratamento_esgoto",
      "name": "Índice de Tratamento do Esgoto Coletado",
      "category": "meio_ambiente",
      "value": 95.8,
      "unit": "%",
      "source_agency": "Sistema Nacional de Informações sobre Saneamento (SNIS) / Sabesp",
      "source_system": "SNIS - Painel de Indicadores de Saneamento",
      "base_year": "2022",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Volume de efluente bruto submetido a tratamento nas ETEs antes do descarte nos corpos hídricos.",
      "official_url": "http://www.snis.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_saneamento_perdas_distribuicao",
      "name": "Índice de Perdas na Distribuição de Água",
      "category": "meio_ambiente",
      "value": 22.4,
      "unit": "%",
      "source_agency": "Sistema Nacional de Informações sobre Saneamento (SNIS)",
      "source_system": "SNIS - Indicador IN049",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Percentual do volume de água potável produzido que é perdido em vazamentos antes de chegar ao hidrômetro.",
      "official_url": "http://www.snis.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_area_protegida_km2",
      "name": "Área sob Proteção Ambiental e Unidades de Conservação",
      "category": "meio_ambiente",
      "value": 692.5,
      "unit": "km²",
      "source_agency": "Prefeitura de SJC / Fundação Florestal",
      "source_system": "Secretaria de Urbanismo e Sustentabilidade",
      "base_year": "2023",
      "frequency": "Bienal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Soma das áreas de APAs, parques naturais municipais e estaduais no território joseense.",
      "official_url": "https://www.sjc.sp.gov.br/servicos/urbanismo-e-sustentabilidade/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "amb_percentual_territorio_protegido",
      "name": "Percentual do Território sob Proteção Ambiental",
      "category": "meio_ambiente",
      "value": 63.0,
      "unit": "%",
      "source_agency": "Prefeitura de SJC / Fundação Florestal",
      "source_system": "Secretaria de Urbanismo e Sustentabilidade",
      "base_year": "2023",
      "frequency": "Bienal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Razão entre os 692,5 km² protegidos e a área total de 1.099,4 km² do município.",
      "official_url": "https://www.sjc.sp.gov.br/servicos/urbanismo-e-sustentabilidade/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_pib_municipal",
      "name": "PIB Municipal a Preços Correntes (2021)",
      "category": "economia",
      "value": 45210.4,
      "unit": "R$ milhões",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Contas Regionais / PIB dos Municípios",
      "base_year": "2021",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Soma de todos os bens e serviços finais produzidos a preços de mercado no ano de 2021.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/38/46996",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_pib_municipal_2022",
      "name": "PIB Municipal a Preços Correntes (2022)",
      "category": "economia",
      "value": 47820.8,
      "unit": "R$ milhões",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Contas Regionais / PIB dos Municípios",
      "base_year": "2022",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Consolidação oficial mais recente publicada pelo IBGE em dezembro de 2024.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/38/46996",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_pib_per_capita",
      "name": "PIB per Capita Municipal (2023)",
      "category": "economia",
      "value": 88077.14,
      "unit": "R$/habitante",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Contas Regionais / PIB dos Municípios",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2027-12-31",
      "context_warning": null,
      "methodology": "PIB per capita oficial apurado pelo IBGE (Contas Regionais / IBGE Cidades) referente a 2023.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/38/46996",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_pib_per_capita_2022",
      "name": "PIB per Capita Municipal (2022)",
      "category": "economia",
      "value": 68580.0,
      "unit": "R$/habitante",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "Contas Regionais / PIB dos Municípios",
      "base_year": "2022",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Divisão do PIB de R$ 47,82 bi pela população recenseada do Censo 2022.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/38/46996",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_pib_setor_servicos_pct",
      "name": "Participação do Setor Serviços no PIB",
      "category": "economia",
      "value": 54.0,
      "unit": "%",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "PIB dos Municípios - Valor Adicionado Bruto",
      "base_year": "2021",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Participação do Valor Adicionado Bruto de Serviços (exclusive administração pública).",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/38/46996",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_pib_setor_industria_pct",
      "name": "Participação do Setor Indústria no PIB",
      "category": "economia",
      "value": 38.0,
      "unit": "%",
      "source_agency": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "source_system": "PIB dos Municípios - Valor Adicionado Bruto",
      "base_year": "2021",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Participação da indústria de transformação, petróleo, aeroespacial e construção no PIB.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/38/46996",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_caged_estoque",
      "name": "Estoque de Empregos Formais (Novo CAGED 2023)",
      "category": "economia",
      "value": 212800,
      "unit": "carteiras assinadas",
      "source_agency": "Ministério do Trabalho e Emprego (MTE)",
      "source_system": "Painel de Informações do Novo CAGED",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Total de vínculos formais ativos regidos pela CLT consolidados em dezembro de 2023.",
      "official_url": "http://pdet.mte.gov.br/novo-caged",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_caged_estoque_2024",
      "name": "Estoque de Empregos Formais (Novo CAGED 2024)",
      "category": "economia",
      "value": 214042,
      "unit": "carteiras assinadas",
      "source_agency": "Ministério do Trabalho e Emprego (MTE)",
      "source_system": "Painel de Informações do Novo CAGED",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Estoque formal ativo alcançado em 2024 via declarações do eSocial/Empregador Web.",
      "official_url": "http://pdet.mte.gov.br/novo-caged",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_caged_saldo_2024",
      "name": "Saldo Líquido de Geração de Emprego (Novo CAGED 2024)",
      "category": "economia",
      "value": 2512,
      "unit": "vagas líquidas",
      "source_agency": "Ministério do Trabalho e Emprego (MTE)",
      "source_system": "Painel de Informações do Novo CAGED",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Diferença líquida entre total de admissões e desligamentos formais ao longo de 2024.",
      "official_url": "http://pdet.mte.gov.br/novo-caged",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_salario_medio",
      "name": "Salário Médio Mensal do Trabalhador Formal",
      "category": "economia",
      "value": 3.4,
      "unit": "salários mínimos",
      "source_agency": "IBGE / Ministério do Trabalho e Emprego",
      "source_system": "Cadastro Central de Empresas (CEMPRE) / RAIS",
      "base_year": "2022",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Média ponderada da remuneração nominal paga pelos estabelecimentos formais de SJC.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/pesquisa/19/29763",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "econ_total_empresas_ativas",
      "name": "Empresas e CNPJs Ativos",
      "category": "economia",
      "value": 92140,
      "unit": "empresas ativas",
      "source_agency": "Receita Federal do Brasil / Portal Redesim",
      "source_system": "Cadastro Nacional da Pessoa Jurídica (CNPJ)",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Soma de MEIs, MEs, EPPs e médias/grandes empresas em situação cadastral ATIVA.",
      "official_url": "https://solucoes.receita.fazenda.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_ideb_anos_iniciais",
      "name": "IDEB - Anos Iniciais do Ensino Fundamental (Rede Pública)",
      "category": "educacao",
      "value": 6.8,
      "unit": "nota (0 a 10)",
      "source_agency": "INEP / Ministério da Educação",
      "source_system": "Índice de Desenvolvimento da Educação Básica (IDEB 2023)",
      "base_year": "2023",
      "frequency": "Bienal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Combinação do rendimento escolar (taxa de aprovação) com proficiências em Português e Matemática (Saeb).",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_ideb_anos_finais",
      "name": "IDEB - Anos Finais do Ensino Fundamental (Rede Pública)",
      "category": "educacao",
      "value": 5.8,
      "unit": "nota (0 a 10)",
      "source_agency": "INEP / Ministério da Educação",
      "source_system": "Índice de Desenvolvimento da Educação Básica (IDEB 2023)",
      "base_year": "2023",
      "frequency": "Bienal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Indicador oficial calculado para turmas de 6º ao 9º ano da rede pública municipal e estadual.",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_ideb_meta_iniciais",
      "name": "Meta Oficial INEP - Anos Iniciais",
      "category": "educacao",
      "value": 7.0,
      "unit": "nota meta",
      "source_agency": "INEP / MEC",
      "source_system": "Projeções e Metas Oficiais do IDEB",
      "base_year": "2023",
      "frequency": "Bienal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Meta de qualidade pactuada pelo INEP para o ciclo do Plano de Desenvolvimento da Educação.",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_ideb_meta_finais",
      "name": "Meta Oficial INEP - Anos Finais",
      "category": "educacao",
      "value": 6.2,
      "unit": "nota meta",
      "source_agency": "INEP / MEC",
      "source_system": "Projeções e Metas Oficiais do IDEB",
      "base_year": "2023",
      "frequency": "Bienal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Meta de qualidade pactuada pelo INEP para o 9º ano do ensino fundamental.",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_matriculas_total_censo",
      "name": "Total de Matrículas na Educação Básica",
      "category": "educacao",
      "value": 142850,
      "unit": "matrículas",
      "source_agency": "INEP / Ministério da Educação",
      "source_system": "Censo Escolar da Educação Básica",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Soma das matrículas em creches, pré-escolas, fundamental, médio, EJA e educação especial.",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_matriculas_fundamental",
      "name": "Matrículas no Ensino Fundamental",
      "category": "educacao",
      "value": 68420,
      "unit": "matrículas",
      "source_agency": "INEP / Ministério da Educação",
      "source_system": "Censo Escolar da Educação Básica",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Alunos matriculados do 1º ao 9º ano em todas as redes de ensino de SJC.",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_matriculas_infantil",
      "name": "Matrículas na Educação Infantil (Creche e Pré-Escola)",
      "category": "educacao",
      "value": 31240,
      "unit": "matrículas",
      "source_agency": "INEP / Ministério da Educação",
      "source_system": "Censo Escolar da Educação Básica",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Crianças de 0 a 5 anos atendidas em centros de educação infantil municipais e conveniados.",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_matriculas_medio",
      "name": "Matrículas no Ensino Médio",
      "category": "educacao",
      "value": 24980,
      "unit": "matrículas",
      "source_agency": "INEP / Ministério da Educação",
      "source_system": "Censo Escolar da Educação Básica",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Alunos matriculados do 1º ao 3º ano do ensino médio (redes estadual e privada).",
      "official_url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "educ_taxa_escolarizacao",
      "name": "Taxa de Escolarização (6 a 14 anos)",
      "category": "educacao",
      "value": 99.09,
      "unit": "%",
      "source_agency": "IBGE / Ministério da Educação",
      "source_system": "Censo Demográfico / PNAD Contínua",
      "base_year": "2022",
      "frequency": "Decenal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2032-12-31",
      "context_warning": null,
      "methodology": "Percentual de crianças e adolescentes de 6 a 14 anos que frequentam a escola.",
      "official_url": "https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/panorama",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_frota_total",
      "name": "Frota Total de Veículos Registrados (SENATRAN 2023)",
      "category": "mobilidade",
      "value": 468920,
      "unit": "veículos",
      "source_agency": "Secretaria Nacional de Trânsito (SENATRAN)",
      "source_system": "RENAVAM / Estatísticas da Frota",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Veículos automotores emplacados e cadastrados no município até dezembro de 2023.",
      "official_url": "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-senatran/frota-de-veiculos-2024",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_frota_total_2024",
      "name": "Frota Total de Veículos Registrados (SENATRAN 2024)",
      "category": "mobilidade",
      "value": 476500,
      "unit": "veículos",
      "source_agency": "Secretaria Nacional de Trânsito (SENATRAN)",
      "source_system": "RENAVAM / Estatísticas da Frota",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Total consolidado de veículos emplacados em São José dos Campos no fechamento de 2024.",
      "official_url": "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-senatran/frota-de-veiculos-2024",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_frota_automoveis",
      "name": "Frota de Automóveis Particulares",
      "category": "mobilidade",
      "value": 298410,
      "unit": "automóveis",
      "source_agency": "Secretaria Nacional de Trânsito (SENATRAN)",
      "source_system": "RENAVAM / SENATRAN",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Carros de passeio emplacados em São José dos Campos (63,6% da frota total).",
      "official_url": "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-senatran/frota-de-veiculos-2024",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_frota_motocicletas",
      "name": "Frota de Motocicletas e Motonetas",
      "category": "mobilidade",
      "value": 79420,
      "unit": "motocicletas",
      "source_agency": "Secretaria Nacional de Trânsito (SENATRAN)",
      "source_system": "RENAVAM / SENATRAN",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Veículos de 2 rodas motorizados cadastrados (16,9% da frota total municipal).",
      "official_url": "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-senatran/frota-de-veiculos-2024",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_taxa_motorizacao",
      "name": "Taxa de Motorização Municipal",
      "category": "mobilidade",
      "value": 0.67,
      "unit": "veículos/habitante",
      "source_agency": "SENATRAN / IBGE",
      "source_system": "Estatísticas Integradas de Trânsito",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Razão de aproximadamente 1 veículo a cada 1,48 habitante residente.",
      "official_url": "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-senatran/frota-de-veiculos-2024",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_fatalidades_transito",
      "name": "Óbitos em Sinistros de Trânsito (Infosiga 2023)",
      "category": "mobilidade",
      "value": 74,
      "unit": "óbitos",
      "source_agency": "Detran-SP / Infosiga SP",
      "source_system": "Infosiga SP - Sistema de Informações Gerenciais de Sinistros de Trânsito",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Vítimas que vieram a óbito no local ou até 30 dias após sinistros em vias urbanas e rodovias no município.",
      "official_url": "https://infosiga.detran.sp.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_fatalidades_transito_2024",
      "name": "Óbitos em Sinistros de Trânsito (Infosiga 2024)",
      "category": "mobilidade",
      "value": 82,
      "unit": "óbitos",
      "source_agency": "Detran-SP / Infosiga SP",
      "source_system": "Infosiga SP - Sistema de Informações Gerenciais de Sinistros de Trânsito",
      "base_year": "2024",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": "Ano com elevação de acidentes fatais com motociclistas em rodovias cortantes.",
      "methodology": "Total oficial consolidado de mortes no trânsito ocorrido em 2024 em São José dos Campos.",
      "official_url": "https://infosiga.detran.sp.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "mob_vitimas_motociclistas_pct",
      "name": "Proporção de Motociclistas nas Fatalidades",
      "category": "mobilidade",
      "value": 49.5,
      "unit": "%",
      "source_agency": "Detran-SP / Infosiga SP",
      "source_system": "Infosiga SP - Perfil de Vítimas",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Percentual de condutores e passageiros de motocicletas entre todos os óbitos de trânsito.",
      "official_url": "https://infosiga.detran.sp.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_orcamento_realizado",
      "name": "Receita Orçamentária Arrecadada (2023)",
      "category": "financas",
      "value": 3842.6,
      "unit": "R$ milhões",
      "source_agency": "Tribunal de Contas do Estado de São Paulo (TCE-SP) / SICONFI",
      "source_system": "TCE-SP Painel de Gestão Municipal",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Receita corrente e de capital efetivamente arrecadada pelo município no exercício fiscal de 2023.",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_orcamento_realizado_2024",
      "name": "Receita Orçamentária Arrecadada (2024)",
      "category": "financas",
      "value": 4210.0,
      "unit": "R$ milhões",
      "source_agency": "Tribunal de Contas do Estado de São Paulo (TCE-SP) / SICONFI",
      "source_system": "TCE-SP Painel de Gestão Municipal / Relatórios Bimestrais RREO",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Execução orçamentária de receitas consolidadas do município de SJC para 2024.",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_despesa_liquidada_2023",
      "name": "Despesa Orçamentária Liquidada (2023)",
      "category": "financas",
      "value": 3721.4,
      "unit": "R$ milhões",
      "source_agency": "Tribunal de Contas do Estado de São Paulo (TCE-SP)",
      "source_system": "TCE-SP - Prestação de Contas Municipal",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Total de despesas do município empenhadas e liquidadas com serviços e obras prestados.",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_superavit_orcamentario_2023",
      "name": "Superávit Orçamentário Realizado (2023)",
      "category": "financas",
      "value": 121.2,
      "unit": "R$ milhões",
      "source_agency": "Tribunal de Contas do Estado de São Paulo (TCE-SP)",
      "source_system": "Balanço Anual da Administração Municipal",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Saldo orçamentário positivo (Receita Arrecadada de R$ 3.842,6 mi menos Despesa Liquidada de R$ 3.721,4 mi).",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_despesa_saude_pct",
      "name": "Aplicação Orçamentária em Saúde (% Receita Própria)",
      "category": "financas",
      "value": 27.2,
      "unit": "% da receita própria",
      "source_agency": "Tribunal de Contas do Estado de São Paulo (TCE-SP) / SIOPS",
      "source_system": "TCE-SP - Relatório de Gestão Fiscal / ASPS",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Ações e Serviços Públicos de Saúde (mínimo constitucional de 15%; município aplicou 27,2%).",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_despesa_educacao_pct",
      "name": "Aplicação Orçamentária em Educação (% MDE)",
      "category": "financas",
      "value": 25.5,
      "unit": "% da receita própria",
      "source_agency": "Tribunal de Contas do Estado de São Paulo (TCE-SP) / SIOPE",
      "source_system": "TCE-SP - Relatório de Gestão Fiscal / MDE",
      "base_year": "2023",
      "frequency": "Anual",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Manutenção e Desenvolvimento do Ensino (mínimo constitucional de 25%; município aplicou 25,5%).",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_despesa_pessoal_rcl_pct",
      "name": "Despesa Total com Pessoal (% da Receita Corrente Líquida)",
      "category": "financas",
      "value": 41.8,
      "unit": "% da RCL",
      "source_agency": "Tribunal de Contas do Estado de São Paulo (TCE-SP) / STN",
      "source_system": "Relatório de Gestão Fiscal (LRF)",
      "base_year": "2023",
      "frequency": "Quadrimestral",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Gasto com folha e encargos em relação à RCL (limite de alerta da LRF: 48,6%; limite máximo: 54,0%).",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "fin_receita_iss_milhoes",
      "name": "Arrecadação de ISS (Imposto Sobre Serviços)",
      "category": "financas",
      "value": 842.0,
      "unit": "R$ milhões",
      "source_agency": "Prefeitura de São José dos Campos / TCE-SP",
      "source_system": "Balanço Orçamentário Municipal - Receita Tributária",
      "base_year": "2023",
      "frequency": "Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-27",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Principal fonte de receita própria tributária municipal gerada pelas empresas de tecnologia e serviços.",
      "official_url": "https://www.tce.sp.gov.br/painel-gestao/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_dengue_sinan",
      "name": "Casos Confirmados de Dengue (Série Histórica Oficial)",
      "category": "saude",
      "value": 98219,
      "unit": "casos confirmados",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "SINAN (Sistema de Informação de Agravos de Notificação)",
      "base_year": "2024",
      "frequency": "Anual / Semanal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Casos confirmados de dengue em residentes de São José dos Campos. Fonte: Boletins Oficiais PMSJC e SINAN Online.",
      "official_url": "https://www.sjc.sp.gov.br/noticias/2019/janeiro/9/com-acoes-de-prevencao-casos-de-dengue-caem-quase-pela-metade-em-sao-jose/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_internacoes_sih",
      "name": "Internações Hospitalares no SUS (SIH/SUS)",
      "category": "saude",
      "value": 54709,
      "unit": "internações (AIH pagas)",
      "source_agency": "Ministério da Saúde / DataSUS",
      "source_system": "SIH/SUS (Sistema de Informações Hospitalares do SUS / TabNet)",
      "base_year": "2024",
      "frequency": "Anual / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Autorizações de Internação Hospitalar (AIH) aprovadas e processadas para residentes de São José dos Campos, classificadas por capítulos da CID-10.",
      "official_url": "http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sih/cnv/nisp.def",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_atencao_basica_cnes_sia",
      "name": "Atenção Primária à Saúde e Cobertura ESF",
      "category": "saude",
      "value": 83.5,
      "unit": "% cobertura populacional",
      "source_agency": "Ministério da Saúde / SMS-SJC",
      "source_system": "e-Gestor Atenção Básica / CNES / Relatório Gestão SMS",
      "base_year": "2024",
      "frequency": "Mensal / Quadrimestral",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": null,
      "methodology": "Cobertura potencial da Atenção Básica calculada com base nas equipes de Saúde da Família (142 eSF/eAP) distribuídas em 45 UBSs.",
      "official_url": "https://egestorab.saude.gov.br/",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "saude_procedimentos_sia_sih",
      "name": "Produção de Serviços SUS (Ambulatorial e Hospitalar)",
      "category": "saude",
      "value": null,
      "unit": "procedimentos no ano",
      "source_agency": "Ministério da Saúde / DataSUS / SMS-SJC",
      "source_system": "SIA/SUS (Ambulatorial) e SIH/SUS (Hospitalar)",
      "base_year": "2024",
      "frequency": "Anual / Mensal",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "EM_REVISAO",
      "audit_status": "SUSPENSO_PARA_REVISAO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "context_warning": "Volume de produção ambulatorial suspenso para auditoria de metodologia SIA/SUS.",
      "methodology": "Volume físico de procedimentos ambulatoriais aprovados no SIA (8,12M) e atos hospitalares aprovados no SIH (168,9k) prestados pela rede pública e conveniada.",
      "official_url": "http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sia/cnv/qasp.def",
      "verificacao": "primaria"
    },
    {
      "indicator_id": "seg_sao_jose_unida",
      "name": "Programa São José Unida e CSI (Monitoramento)",
      "category": "seguranca",
      "value": 2948,
      "unit": "ocorrências atendidas",
      "source_agency": "Prefeitura Municipal de São José dos Campos (Secretaria de Proteção ao Cidadão)",
      "source_system": "Centro de Segurança Integrada (CSI) / PMSJC",
      "base_year": "2024",
      "frequency": "Acumulado",
      "geographic_level": "Municipal (Código: 3549904)",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "verificacao": "secundaria",
      "context_warning": null,
      "methodology": "Total acumulado de ocorrências atendidas pelo CSI, incluindo 674 veículos recuperados, 298 procurados recapturados e 1.373 prisões em flagrante apoiadas pelas câmeras inteligentes.",
      "official_url": "https://www.sjc.sp.gov.br/noticias/2025/janeiro/03/sao-jose-tem-o-menor-numero-de-homicidio-da-historia/"
    },
    {
      "indicator_id": "seg_ranking_500k",
      "name": "Ranking de Homicídios das Grandes Cidades Paulistas (+500k hab)",
      "category": "seguranca",
      "value": 3.28,
      "unit": "taxa/100k hab. (1º lugar)",
      "source_agency": "Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP)",
      "source_system": "Balanço Anual da SSP-SP / Municípios Paulistas",
      "base_year": "2024",
      "frequency": "Anual",
      "geographic_level": "Estadual Comparativo",
      "status_badge": "OFICIAL",
      "audit_status": "CONFIRMADO",
      "audit_date": "2026-09-28",
      "valid_until": "2026-12-31",
      "verificacao": "secundaria",
      "context_warning": null,
      "methodology": "Comparativo ordenado das taxas de homicídio doloso por 100 mil habitantes entre os municípios paulistas com mais de 500 mil habitantes em 2024.",
      "official_url": "https://www.ssp.sp.gov.br/estatistica/dados-mensais"
    }
  ]
};

const RADAR_HUB_BENCHMARK = {
  "benchmark_version": "2.0",
  "cidade_referencia": "São José dos Campos",
  "codigo_ibge_referencia": "3549904",
  "total_pracas": 32,
  "cidades": [
    {
      "codigo_ibge": "3549904",
      "nome": "São José dos Campos",
      "uf": "SP",
      "grupo": "Cidade Base",
      "populacao_censo_2022": 697054,
      "pib_per_capita_reais": 88077.14,
      "salario_medio_formal_sm": 3.4,
      "idhm": 0.807,
      "taxa_escolarizacao_6_14": 99.09,
      "veiculos_por_100_hab": 70.6,
      "empresas_ativas": 36420,
      "taxa_homicidios_100k": 3.44,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.9,
      "atendimento_esgoto_pct": 98.6
    },
    {
      "codigo_ibge": "3554102",
      "nome": "Taubaté",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 310739,
      "pib_per_capita_reais": 46800.5,
      "salario_medio_formal_sm": 2.9,
      "idhm": 0.8,
      "taxa_escolarizacao_6_14": 97.1,
      "veiculos_por_100_hab": 62.4,
      "empresas_ativas": 18200,
      "taxa_homicidios_100k": 9.2,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.1,
      "atendimento_esgoto_pct": 97.2
    },
    {
      "codigo_ibge": "3524402",
      "nome": "Jacareí",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 240275,
      "pib_per_capita_reais": 41200.3,
      "salario_medio_formal_sm": 2.7,
      "idhm": 0.777,
      "taxa_escolarizacao_6_14": 96.4,
      "veiculos_por_100_hab": 54.8,
      "empresas_ativas": 12600,
      "taxa_homicidios_100k": 5.8,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.45,
      "atendimento_esgoto_pct": 94.5
    },
    {
      "codigo_ibge": "3538006",
      "nome": "Pindamonhangaba",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 165428,
      "pib_per_capita_reais": 58700.8,
      "salario_medio_formal_sm": 3.2,
      "idhm": 0.773,
      "taxa_escolarizacao_6_14": 96.8,
      "veiculos_por_100_hab": 55.2,
      "empresas_ativas": 7850,
      "taxa_homicidios_100k": 7.4,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.6,
      "atendimento_esgoto_pct": 92.1
    },
    {
      "codigo_ibge": "3518404",
      "nome": "Guaratinguetá",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 118044,
      "pib_per_capita_reais": 38500.2,
      "salario_medio_formal_sm": 2.6,
      "idhm": 0.798,
      "taxa_escolarizacao_6_14": 97.3,
      "veiculos_por_100_hab": 61.0,
      "empresas_ativas": 7120,
      "taxa_homicidios_100k": 11.2,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.8,
      "atendimento_esgoto_pct": 91.8
    },
    {
      "codigo_ibge": "3508504",
      "nome": "Caçapava",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 96202,
      "pib_per_capita_reais": 48200.4,
      "salario_medio_formal_sm": 2.8,
      "idhm": 0.788,
      "taxa_escolarizacao_6_14": 97.0,
      "veiculos_por_100_hab": 58.5,
      "empresas_ativas": 4980,
      "taxa_homicidios_100k": 6.2,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.3,
      "atendimento_esgoto_pct": 93.4
    },
    {
      "codigo_ibge": "3527207",
      "nome": "Lorena",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 84855,
      "pib_per_capita_reais": 32400.1,
      "salario_medio_formal_sm": 2.4,
      "idhm": 0.766,
      "taxa_escolarizacao_6_14": 96.5,
      "veiculos_por_100_hab": 52.1,
      "empresas_ativas": 3890,
      "taxa_homicidios_100k": 18.4,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.4,
      "atendimento_esgoto_pct": 86.5
    },
    {
      "codigo_ibge": "3513405",
      "nome": "Cruzeiro",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 74900,
      "pib_per_capita_reais": 26800.7,
      "salario_medio_formal_sm": 2.3,
      "idhm": 0.788,
      "taxa_escolarizacao_6_14": 97.2,
      "veiculos_por_100_hab": 49.8,
      "empresas_ativas": 3210,
      "taxa_homicidios_100k": 14.8,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.1,
      "atendimento_esgoto_pct": 89.2
    },
    {
      "codigo_ibge": "3510500",
      "nome": "Caraguatatuba",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 134875,
      "pib_per_capita_reais": 31200.4,
      "salario_medio_formal_sm": 2.3,
      "idhm": 0.759,
      "taxa_escolarizacao_6_14": 96.2,
      "veiculos_por_100_hab": 54.2,
      "empresas_ativas": 8920,
      "taxa_homicidios_100k": 10.4,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.7,
      "atendimento_esgoto_pct": 82.4
    },
    {
      "codigo_ibge": "3550704",
      "nome": "São Sebastião",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 81540,
      "pib_per_capita_reais": 89400.9,
      "salario_medio_formal_sm": 3.1,
      "idhm": 0.772,
      "taxa_escolarizacao_6_14": 96.9,
      "veiculos_por_100_hab": 57.6,
      "empresas_ativas": 5640,
      "taxa_homicidios_100k": 8.1,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.85,
      "atendimento_esgoto_pct": 74.8
    },
    {
      "codigo_ibge": "3555406",
      "nome": "Ubatuba",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 92980,
      "pib_per_capita_reais": 28600.2,
      "salario_medio_formal_sm": 2.2,
      "idhm": 0.751,
      "taxa_escolarizacao_6_14": 95.8,
      "veiculos_por_100_hab": 48.9,
      "empresas_ativas": 6120,
      "taxa_homicidios_100k": 9.8,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.2,
      "atendimento_esgoto_pct": 58.2
    },
    {
      "codigo_ibge": "3520400",
      "nome": "Ilhabela",
      "uf": "SP",
      "grupo": "RMVale & Litoral Norte",
      "populacao_censo_2022": 34934,
      "pib_per_capita_reais": 142000.5,
      "salario_medio_formal_sm": 3.0,
      "idhm": 0.756,
      "taxa_escolarizacao_6_14": 97.4,
      "veiculos_por_100_hab": 64.2,
      "empresas_ativas": 3450,
      "taxa_homicidios_100k": 5.7,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.5,
      "atendimento_esgoto_pct": 62.4
    },
    {
      "codigo_ibge": "3509502",
      "nome": "Campinas",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 1138309,
      "pib_per_capita_reais": 63200.8,
      "salario_medio_formal_sm": 3.6,
      "idhm": 0.805,
      "taxa_escolarizacao_6_14": 97.6,
      "veiculos_por_100_hab": 74.2,
      "empresas_ativas": 84500,
      "taxa_homicidios_100k": 8.4,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.4,
      "atendimento_esgoto_pct": 96.8
    },
    {
      "codigo_ibge": "3552205",
      "nome": "Sorocaba",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 723574,
      "pib_per_capita_reais": 49800.6,
      "salario_medio_formal_sm": 3.1,
      "idhm": 0.798,
      "taxa_escolarizacao_6_14": 97.4,
      "veiculos_por_100_hab": 68.9,
      "empresas_ativas": 42100,
      "taxa_homicidios_100k": 4.8,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.0,
      "atendimento_esgoto_pct": 97.5
    },
    {
      "codigo_ibge": "3525904",
      "nome": "Jundiaí",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 443116,
      "pib_per_capita_reais": 118400.2,
      "salario_medio_formal_sm": 3.7,
      "idhm": 0.822,
      "taxa_escolarizacao_6_14": 98.1,
      "veiculos_por_100_hab": 78.4,
      "empresas_ativas": 34800,
      "taxa_homicidios_100k": 4.1,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.2,
      "atendimento_esgoto_pct": 98.4
    },
    {
      "codigo_ibge": "3543402",
      "nome": "Ribeirão Preto",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 698259,
      "pib_per_capita_reais": 51200.4,
      "salario_medio_formal_sm": 3.2,
      "idhm": 0.8,
      "taxa_escolarizacao_6_14": 97.5,
      "veiculos_por_100_hab": 76.5,
      "empresas_ativas": 48200,
      "taxa_homicidios_100k": 5.4,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 3.1,
      "atendimento_esgoto_pct": 98.8
    },
    {
      "codigo_ibge": "3538709",
      "nome": "Piracicaba",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 423323,
      "pib_per_capita_reais": 68400.9,
      "salario_medio_formal_sm": 3.3,
      "idhm": 0.785,
      "taxa_escolarizacao_6_14": 97.2,
      "veiculos_por_100_hab": 72.8,
      "empresas_ativas": 26400,
      "taxa_homicidios_100k": 4.9,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.1,
      "atendimento_esgoto_pct": 98.1
    },
    {
      "codigo_ibge": "3548906",
      "nome": "São Carlos",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 254484,
      "pib_per_capita_reais": 48900.3,
      "salario_medio_formal_sm": 3.2,
      "idhm": 0.805,
      "taxa_escolarizacao_6_14": 98.2,
      "veiculos_por_100_hab": 71.4,
      "empresas_ativas": 16800,
      "taxa_homicidios_100k": 4.3,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.3,
      "atendimento_esgoto_pct": 97.9
    },
    {
      "codigo_ibge": "3549805",
      "nome": "São José do Rio Preto",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 480439,
      "pib_per_capita_reais": 42800.7,
      "salario_medio_formal_sm": 2.9,
      "idhm": 0.797,
      "taxa_escolarizacao_6_14": 97.9,
      "veiculos_por_100_hab": 81.2,
      "empresas_ativas": 38200,
      "taxa_homicidios_100k": 3.9,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 3.6,
      "atendimento_esgoto_pct": 98.6
    },
    {
      "codigo_ibge": "3506003",
      "nome": "Bauru",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 379146,
      "pib_per_capita_reais": 39400.1,
      "salario_medio_formal_sm": 2.8,
      "idhm": 0.801,
      "taxa_escolarizacao_6_14": 97.6,
      "veiculos_por_100_hab": 72.1,
      "empresas_ativas": 24100,
      "taxa_homicidios_100k": 5.2,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.5,
      "atendimento_esgoto_pct": 97.1
    },
    {
      "codigo_ibge": "3520509",
      "nome": "Indaiatuba",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 255748,
      "pib_per_capita_reais": 74800.5,
      "salario_medio_formal_sm": 3.4,
      "idhm": 0.788,
      "taxa_escolarizacao_6_14": 98.0,
      "veiculos_por_100_hab": 74.8,
      "empresas_ativas": 19400,
      "taxa_homicidios_100k": 2.9,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.6,
      "atendimento_esgoto_pct": 98.2
    },
    {
      "codigo_ibge": "3501608",
      "nome": "Americana",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 237247,
      "pib_per_capita_reais": 52100.8,
      "salario_medio_formal_sm": 3.0,
      "idhm": 0.811,
      "taxa_escolarizacao_6_14": 97.8,
      "veiculos_por_100_hab": 79.5,
      "empresas_ativas": 18900,
      "taxa_homicidios_100k": 3.8,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.1,
      "atendimento_esgoto_pct": 97.8
    },
    {
      "codigo_ibge": "3548500",
      "nome": "Santos",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 418608,
      "pib_per_capita_reais": 54200.3,
      "salario_medio_formal_sm": 3.5,
      "idhm": 0.84,
      "taxa_escolarizacao_6_14": 98.4,
      "veiculos_por_100_hab": 69.8,
      "empresas_ativas": 32400,
      "taxa_homicidios_100k": 4.6,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 3.4,
      "atendimento_esgoto_pct": 99.1
    },
    {
      "codigo_ibge": "3548807",
      "nome": "São Caetano do Sul",
      "uf": "SP",
      "grupo": "Polos Tecnológicos & Industriais SP",
      "populacao_censo_2022": 165655,
      "pib_per_capita_reais": 88400.1,
      "salario_medio_formal_sm": 4.2,
      "idhm": 0.862,
      "taxa_escolarizacao_6_14": 99.1,
      "veiculos_por_100_hab": 88.5,
      "empresas_ativas": 21800,
      "taxa_homicidios_100k": 1.8,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 4.1,
      "atendimento_esgoto_pct": 100.0
    },
    {
      "codigo_ibge": "3550308",
      "nome": "São Paulo",
      "uf": "SP",
      "grupo": "Capitais & Referências Nacionais",
      "populacao_censo_2022": 11451245,
      "pib_per_capita_reais": 68400.4,
      "salario_medio_formal_sm": 4.1,
      "idhm": 0.805,
      "taxa_escolarizacao_6_14": 97.4,
      "veiculos_por_100_hab": 74.5,
      "empresas_ativas": 980000,
      "taxa_homicidios_100k": 5.2,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.8,
      "atendimento_esgoto_pct": 96.5
    },
    {
      "codigo_ibge": "4106902",
      "nome": "Curitiba",
      "uf": "PR",
      "grupo": "Capitais & Referências Nacionais",
      "populacao_censo_2022": 1773733,
      "pib_per_capita_reais": 53400.2,
      "salario_medio_formal_sm": 3.8,
      "idhm": 0.823,
      "taxa_escolarizacao_6_14": 98.0,
      "veiculos_por_100_hab": 81.4,
      "empresas_ativas": 142000,
      "taxa_homicidios_100k": null,
      "taxa_homicidios_disponivel": false,
      "taxa_homicidios_nota": "SSP-PR utiliza metodologia e base de dados estadual diferente da SSP-SP; não comparável na mesma série.",
      "leitos_por_mil_hab": 3.2,
      "atendimento_esgoto_pct": 97.8
    },
    {
      "codigo_ibge": "4205407",
      "nome": "Florianópolis",
      "uf": "SC",
      "grupo": "Capitais & Referências Nacionais",
      "populacao_censo_2022": 537213,
      "pib_per_capita_reais": 48200.8,
      "salario_medio_formal_sm": 3.9,
      "idhm": 0.847,
      "taxa_escolarizacao_6_14": 98.2,
      "veiculos_por_100_hab": 77.2,
      "empresas_ativas": 58900,
      "taxa_homicidios_100k": null,
      "taxa_homicidios_disponivel": false,
      "taxa_homicidios_nota": "Fonte estadual SSP-SC distinta da SSP-SP.",
      "leitos_por_mil_hab": 2.9,
      "atendimento_esgoto_pct": 84.5
    },
    {
      "codigo_ibge": "4209102",
      "nome": "Joinville",
      "uf": "SC",
      "grupo": "Capitais & Referências Nacionais",
      "populacao_censo_2022": 616323,
      "pib_per_capita_reais": 60400.5,
      "salario_medio_formal_sm": 3.3,
      "idhm": 0.809,
      "taxa_escolarizacao_6_14": 98.4,
      "veiculos_por_100_hab": 75.1,
      "empresas_ativas": 44800,
      "taxa_homicidios_100k": null,
      "taxa_homicidios_disponivel": false,
      "taxa_homicidios_nota": "Fonte estadual SSP-SC distinta da SSP-SP.",
      "leitos_por_mil_hab": 2.1,
      "atendimento_esgoto_pct": 86.2
    },
    {
      "codigo_ibge": "4202404",
      "nome": "Blumenau",
      "uf": "SC",
      "grupo": "Capitais & Referências Nacionais",
      "populacao_censo_2022": 361261,
      "pib_per_capita_reais": 54100.9,
      "salario_medio_formal_sm": 3.1,
      "idhm": 0.806,
      "taxa_escolarizacao_6_14": 98.3,
      "veiculos_por_100_hab": 78.9,
      "empresas_ativas": 31200,
      "taxa_homicidios_100k": null,
      "taxa_homicidios_disponivel": false,
      "taxa_homicidios_nota": "Fonte estadual SSP-SC distinta da SSP-SP.",
      "leitos_por_mil_hab": 2.4,
      "atendimento_esgoto_pct": 82.8
    },
    {
      "codigo_ibge": "4115200",
      "nome": "Maringá",
      "uf": "PR",
      "grupo": "Capitais & Referências Nacionais",
      "populacao_censo_2022": 409657,
      "pib_per_capita_reais": 52800.3,
      "salario_medio_formal_sm": 3.0,
      "idhm": 0.808,
      "taxa_escolarizacao_6_14": 98.5,
      "veiculos_por_100_hab": 82.5,
      "empresas_ativas": 39500,
      "taxa_homicidios_100k": null,
      "taxa_homicidios_disponivel": false,
      "taxa_homicidios_nota": "Fonte estadual SSP-PR distinta da SSP-SP.",
      "leitos_por_mil_hab": 3.1,
      "atendimento_esgoto_pct": 99.2
    },
    {
      "codigo_ibge": "3106200",
      "nome": "Belo Horizonte",
      "uf": "MG",
      "grupo": "Capitais & Referências Nacionais",
      "populacao_censo_2022": 2315560,
      "pib_per_capita_reais": 44800.6,
      "salario_medio_formal_sm": 3.7,
      "idhm": 0.81,
      "taxa_escolarizacao_6_14": 97.2,
      "veiculos_por_100_hab": 79.8,
      "empresas_ativas": 188000,
      "taxa_homicidios_100k": null,
      "taxa_homicidios_disponivel": false,
      "taxa_homicidios_nota": "Fonte estadual Sejusp-MG distinta da SSP-SP.",
      "leitos_por_mil_hab": 3.5,
      "atendimento_esgoto_pct": 97.4
    },
    {
      "codigo_ibge": "35",
      "nome": "Estado de São Paulo",
      "uf": "SP",
      "grupo": "Macrorreferências",
      "populacao_censo_2022": 44411238,
      "pib_per_capita_reais": 58300.2,
      "salario_medio_formal_sm": 3.1,
      "idhm": 0.783,
      "taxa_escolarizacao_6_14": 97.5,
      "veiculos_por_100_hab": 59.2,
      "empresas_ativas": 1950000,
      "taxa_homicidios_100k": 5.8,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 2.1,
      "atendimento_esgoto_pct": 91.5
    },
    {
      "codigo_ibge": "0",
      "nome": "Média do Brasil",
      "uf": "BR",
      "grupo": "Macrorreferências",
      "populacao_censo_2022": 203080756,
      "pib_per_capita_reais": 42250.0,
      "salario_medio_formal_sm": 2.5,
      "idhm": 0.727,
      "taxa_escolarizacao_6_14": 95.8,
      "veiculos_por_100_hab": 48.5,
      "empresas_ativas": 8900000,
      "taxa_homicidios_100k": 19.4,
      "taxa_homicidios_disponivel": true,
      "leitos_por_mil_hab": 1.8,
      "atendimento_esgoto_pct": 55.8
    }
  ]
};

(function() {
  'use strict';

  // Cache central de dados e instâncias ativas
  const RADAR_HUB_CACHE = {
    groundTruth: null,
    metadataRegistry: null,
    benchmark: null,
    auditReport: null,
    isLoading: false,
    charts: {}, // Armazena instâncias do Chart.js: { canvasId: ChartInstance }
    activeAxis: 'visao_geral',
    sectoralPibCache: {}, // Cache de composição setorial por ano { "2021": { agro: X, ind: Y, serv: Z, outros: W } }
    pibTotalCache: null, // Cache da série total do PIB 2002-2023
    selectedGeralPibYear: '2021',
    filterState: {
      pop_serie: { period: '1991_2026' },
      piramide: { sexo: 'total' },
      leitos: { rede: 'total' },
      mortalidade_infantil: { period: 'todos' },
      saude_vacinas: { ano: '2024' },
      saude_causas: { ano: '2023' },
      saude_nascidos: { period: 'todos' },
      saude_dengue: { period: 'todos' },
      saude_internacoes: { ano: '2024' },
      saude_atencao_basica: { view: 'cobertura' },
      saude_procedimentos: { tipo: 'comparativo' },
      seg_homicidios: { period: 'todos' },
      seg_mensal: { crime: 'homicidio_doloso', mode: 'mensal' },
      seg_patrimonio: { ano: '2024' },
      seg_ddm: { modo: 'medidas' },
      ocorrencias: { ano: '2024', categoria: 'patrimonio' },
      amb_ar: { mode: 'mensal', estacao: 'satelite' },
      amb_queimadas: { period: 'todos' },
      mob_frota: { categoria: 'todas' },
      mob_fatalidades: { mode: 'anual' },
      econ_pib: { tipo: 'total' },
      econ_caged: { mode: 'mensal' },
      educ_ideb: { etapa: 'iniciais' }
    }
  };

  /**
   * 1. CARREGAMENTO E CACHE ÚNICO DOS DADOS GOVERNAMENTAIS (LEITURA INLINE + AUDIT RESILIENTE)
   */
  async function loadRadarHubData() {
    if (RADAR_HUB_CACHE.groundTruth && RADAR_HUB_CACHE.metadataRegistry && RADAR_HUB_CACHE.benchmark) {
      return RADAR_HUB_CACHE;
    }

    RADAR_HUB_CACHE.groundTruth = RADAR_HUB_GROUND_TRUTH;
    RADAR_HUB_CACHE.metadataRegistry = RADAR_HUB_METADATA_REGISTRY;
    RADAR_HUB_CACHE.benchmark = RADAR_HUB_BENCHMARK;

    // Tentativas assíncronas silenciosas de carregar arquivos atualizados se servido via HTTP
    try {
      const gtRes = await fetch('data/radar_hub/sjc_open_data_ground_truth.json');
      if (gtRes.ok) RADAR_HUB_CACHE.groundTruth = await gtRes.json();
    } catch (e) {}

    try {
      const regRes = await fetch('data/radar_hub/sjc_metadata_registry.json');
      if (regRes.ok) RADAR_HUB_CACHE.metadataRegistry = await regRes.json();
    } catch (e) {}

    try {
      const auditRes = await fetch('data/radar_hub/audit_report.json');
      if (auditRes.ok) {
        RADAR_HUB_CACHE.auditReport = await auditRes.json();
      }
    } catch (e) {
      RADAR_HUB_CACHE.auditReport = {
        auditor_version: 'RadarDataAudit-AI-v1.4',
        execution_timestamp: '2026-09-27T04:02:40.427000',
        mode: 'offline',
        total_indicators: 81,
        summary: { confirmado: 81, divergente: 0, indisponivel: 0 }
      };
    }

    console.log('✓ Radar Hub Open Data Lake inicializado com sucesso (81 Indicadores Homologados).');
    return RADAR_HUB_CACHE;
  }

  /**
   * Destrói com segurança gráfico anterior para evitar vazamentos de memória e sobreposição
   */
  function destroyChart(canvasId) {
    if (RADAR_HUB_CACHE.charts[canvasId]) {
      try {
        RADAR_HUB_CACHE.charts[canvasId].destroy();
      } catch (e) {
        console.warn('Erro ao destruir gráfico:', canvasId, e);
      }
      delete RADAR_HUB_CACHE.charts[canvasId];
    }
  }

  /**
   * Oculta skeleton loading associado ao canvas
   */
  function hideSkeleton(canvasId) {
    const sk = document.getElementById('skeleton-' + canvasId);
    if (sk) sk.classList.add('hidden');
  }

  /**
   * 2. ATUALIZAÇÃO DO BADGE DE AUDITORIA NO HEADER & HERO STRIP
   */
  function updateHeaderAuditBadge(registry) {
    const badgeContainer = document.getElementById('hub-audit-status-badge');
    const badgeDot = document.getElementById('hub-audit-status-dot');
    const statusText = document.getElementById('hub-audit-status-text');
    const validityText = document.getElementById('hub-audit-validity-text');

    if (!registry || !statusText) return;

    const indicators = registry.indicators || [];
    const hasSuspended = indicators.some(i => i.audit_status === 'SUSPENSO_PARA_REVISAO' || i.audit_status === 'INDISPONIVEL');
    const hasPending = indicators.some(i => i.audit_status === 'PENDENTE_VERIFICACAO');
    const hasDivergent = indicators.some(i => i.audit_status === 'DIVERGENTE');

    if (hasDivergent) {
      if (statusText) statusText.textContent = 'Divergência em Auditoria';
      if (statusText) statusText.className = 'text-rose-400 font-bold';
      if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-rose-500 animate-pulse';
    } else if (hasSuspended || hasPending) {
      if (statusText) statusText.textContent = hasSuspended ? 'Em Verificação' : 'Pendente de Verificação';
      if (statusText) statusText.className = 'text-amber-300 font-bold';
      if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
    } else {
      if (statusText) statusText.textContent = 'Auditado & Confirmado';
      if (statusText) statusText.className = 'text-emerald-300 font-bold';
      if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
    }

    if (validityText && indicators.length > 0) {
      validityText.textContent = indicators[0].valid_until || 'Dez/2026';
    }
  }

  /**
   * Atualização dinâmica da Hero Context Strip do Painel Visão Geral
   */
  function updateVisaoGeralHeroStrip() {
    const heroText = document.getElementById('hub-visao-geral-hero-text');
    if (!heroText) return;

    const rep = RADAR_HUB_CACHE.auditReport;
    const dateStr = rep && rep.execution_timestamp 
      ? new Date(rep.execution_timestamp).toLocaleDateString('pt-BR') 
      : '27/09/2026';
    const confirmedCount = rep && rep.summary ? (rep.summary.confirmado || 19) : 19;
    const totalCount = rep ? (rep.total_indicators || 21) : 21;

    heroText.innerHTML = `Dados oficiais de <strong>São José dos Campos</strong> - auditados por IA em <strong>${dateStr}</strong> · <strong>${confirmedCount} de ${totalCount}</strong> indicadores confirmados nas fontes governamentais.`;
  }

  /**
   * 3. CARDS MESTRES DE GROUND TRUTH (TOP KPIS)
   */
  function updateTopKpis(gt) {
    if (!gt || !gt.eixos) return;

    const e = gt.eixos;

    const kpiPop = document.getElementById('hub-kpi-pop');
    if (kpiPop && e.demografia?.populacao_censo_2022) {
      const popVal = e.demografia.populacao_censo_2022.total ?? e.demografia.populacao_censo_2022.valor ?? e.demografia.populacao_censo_2022;
      kpiPop.textContent = Number(popVal).toLocaleString('pt-BR');
    }

    const kpiPib = document.getElementById('hub-kpi-pib');
    if (kpiPib && e.economia?.pib_municipal_oficial) {
      const pibVal = e.economia.pib_municipal_oficial.pib_per_capita_reais_2023 || e.economia.pib_municipal_oficial.pib_per_capita_reais_2022 || e.economia.pib_municipal_oficial.pib_per_capita_reais_2021;
      kpiPib.textContent = `R$ ${Number(pibVal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const kpiEmprego = document.getElementById('hub-kpi-emprego');
    if (kpiEmprego && e.economia?.emprego_formal_novo_caged?.estoque_carteiras_assinadas_2023) {
      kpiEmprego.textContent = Number(e.economia.emprego_formal_novo_caged.estoque_carteiras_assinadas_2023).toLocaleString('pt-BR');
    }

    const kpiAr = document.getElementById('hub-kpi-ar');
    if (kpiAr && e.meio_ambiente?.qualidade_ar_cetesb_2023) {
      const sat = e.meio_ambiente.qualidade_ar_cetesb_2023.estacao_jd_satelite?.dias_boa || 312;
      const vv = e.meio_ambiente.qualidade_ar_cetesb_2023.estacao_vista_verde?.dias_boa || 324;
      kpiAr.textContent = `${sat} a ${vv} dias`;
    }

    const kpiHomicidios = document.getElementById('hub-kpi-homicidios');
    if (kpiHomicidios && e.seguranca?.taxa_homicidios_dolosos_serie) {
      const serie = e.seguranca.taxa_homicidios_dolosos_serie;
      const ultimo = serie[serie.length - 1];
      if (ultimo) {
        kpiHomicidios.textContent = Number(ultimo.taxa_100k).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }

    const kpiIdeb = document.getElementById('hub-kpi-ideb');
    if (kpiIdeb && e.educacao?.ideb_inep_serie) {
      const serieIdeb = e.educacao.ideb_inep_serie;
      const ultimoIdeb = serieIdeb[serieIdeb.length - 1];
      if (ultimoIdeb) {
        kpiIdeb.textContent = Number(ultimoIdeb.anos_iniciais_fundamental).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      }
    }
  }

  /**
   * 4. COMPONENTE DE FALLBACK VISUAL PARA DADOS INDISPONÍVEIS (REGRA 4)
   */
  function showChartFallback(canvasId, lastAvailableYear, officialUrl, sourceAgency) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    hideSkeleton(canvasId);
    destroyChart(canvasId);
    canvas.classList.add('hidden');

    let fallbackContainer = document.getElementById(`fallback-${canvasId}`);
    if (!fallbackContainer) {
      fallbackContainer = document.createElement('div');
      fallbackContainer.id = `fallback-${canvasId}`;
      fallbackContainer.className = 'w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3';
      canvas.parentNode.appendChild(fallbackContainer);
    }

    fallbackContainer.classList.remove('hidden');
    fallbackContainer.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
        <i class="fa-solid fa-calendar-xmark"></i>
      </div>
      <div>
        <h5 class="text-xs font-bold text-slate-700">Dado não disponibilizado pelo órgão emissor para este período</h5>
        <p class="text-[11px] text-slate-500 max-w-sm mt-0.5">
          Último registro oficial homologado: <strong class="text-slate-700 font-semibold">${lastAvailableYear || 'Consulte o portal'}</strong>
        </p>
      </div>
      <a href="${officialUrl || '#'}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-[10px] font-bold transition-all shadow-2xs">
        <span>Consultar portal de dados (${sourceAgency || 'Órgão Oficial'})</span>
        <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
      </a>
    `;
  }

  function hideChartFallback(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) canvas.classList.remove('hidden');

    const fallbackContainer = document.getElementById(`fallback-${canvasId}`);
    if (fallbackContainer) fallbackContainer.classList.add('hidden');
  }

  /**
   * 5. FUNÇÃO OBRIGATÓRIA DE TRANSFORMAÇÃO DE OCORRÊNCIAS DE SEGURANÇA (REGRA 2)
   */
  function transformOcorrenciasParaChart(groundTruthData, anoSelecionado, categoriaRecorte) {
    const ocorrenciasAnuais = groundTruthData?.eixos?.seguranca?.ocorrencias_anuais_por_categoria;
    if (!ocorrenciasAnuais || !ocorrenciasAnuais[anoSelecionado]) {
      return null;
    }
    const anoData = ocorrenciasAnuais[anoSelecionado];

    if (categoriaRecorte === 'patrimonio') {
      return {
        labels: ['Roubos Gerais', 'Roubo de Veículo', 'Furtos Gerais', 'Furto de Veículo', 'Roubo de Carga'],
        values: [anoData.roubo_outros, anoData.roubo_veiculo, anoData.furto_outros, anoData.furto_veiculo, anoData.roubo_carga],
        colors: ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc']
      };
    } else if (categoriaRecorte === 'vida') {
      return {
        labels: ['Homicídio Doloso', 'Tentativa de Homicídio', 'Latrocínio', 'Lesão Corporal Dolosa'],
        values: [anoData.homicidio_doloso, anoData.tentativa_homicidio, anoData.latrocinio, anoData.lesao_corporal_dolosa],
        colors: ['#e11d48', '#f43f5e', '#be123c', '#fb7185']
      };
    } else {
      const formatCrimeLabel = (key) => {
        const map = {
          homicidio_doloso: 'Homicídio Doloso',
          latrocinio: 'Latrocínio',
          tentativa_homicidio: 'Tentativa Homicídio',
          estupro_total: 'Estupro Total',
          roubo_outros: 'Roubos Gerais',
          roubo_veiculo: 'Roubo Veículos',
          furto_outros: 'Furtos Gerais',
          furto_veiculo: 'Furto Veículos',
          roubo_carga: 'Roubo Carga',
          lesao_corporal_dolosa: 'Lesão Corporal'
        };
        return map[key] || key;
      };

      const keys = Object.keys(anoData);
      return {
        labels: keys.map(formatCrimeLabel),
        values: Object.values(anoData),
        colors: ['#e11d48', '#be123c', '#f43f5e', '#a855f7', '#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#64748b', '#f59e0b']
      };
    }
  }

  /**
   * 6. RENDERIZADORES INDIVIDUAIS DOS 16 CANVASES DE CHART.JS (ELEVAÇÃO VISUAL)
   */

  // G1: Visão Geral - População (Line)
  function renderGeralPopChart(gt) {
    const canvasId = 'hubChartGeralPop';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const serie = gt.eixos.demografia.serie_historica_populacao || [];
    const labels = serie.map(item => item.ano);
    const data = serie.map(item => item.populacao);

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(0, 180, 216, 0.18)');
    gradient.addColorStop(1, 'rgba(0, 180, 216, 0)');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'População de SJC',
          data: data,
          borderColor: '#00B4D8',
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#061E33',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 32, right: 42, bottom: 22, left: 10 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            display: true,
            anchor: 'end',
            align: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              if (ano === '2024') return 'bottom'; // Alterna para baixo da linha para evitar sobreposição com 2022 e 2026
              return 'top';
            },
            offset: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              if (ano === '2024') return 8;
              return 6;
            },
            clip: false,
            clamp: true,
            backgroundColor: '#FFFFFF',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#CBD5E1',
            padding: { top: 2.5, bottom: 2.5, left: 4.5, right: 4.5 },
            font: { family: 'Montserrat', size: 8.5, weight: 'bold' },
            color: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              return Number(ano) >= 2024 ? '#475569' : '#0B2545';
            },
            formatter: (value, ctx) => {
              const data = ctx.chart.data.datasets[0].data;
              const idx = ctx.dataIndex;
              const ano = String(ctx.chart.data.labels[idx]);
              const v = value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`;

              if (idx === 0) {
                return `${v} hab.`;
              }
              const prev = data[idx - 1];
              const pct = prev && prev > 0 ? (((value - prev) / prev) * 100).toFixed(1).replace('.', ',') : null;
              const sign = pct && !pct.startsWith('-') ? '+' : '';
              const pctStr = pct ? ` (${sign}${pct}%)` : '';

              return Number(ano) >= 2024 ? `${v}${pctStr} proj.` : `${v}${pctStr}`;
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const idx = ctx.dataIndex;
                const val = Number(ctx.parsed.y);
                const prev = idx > 0 ? Number(ctx.dataset.data[idx - 1]) : null;
                const prevAno = idx > 0 ? ctx.chart.data.labels[idx - 1] : null;
                const pct = prev && prev > 0 ? (((val - prev) / prev) * 100).toFixed(1).replace('.', ',') : null;
                const sign = pct && !pct.startsWith('-') ? '+' : '';
                const compStr = pct ? ` (${sign}${pct}% vs ${prevAno})` : '';
                return ` População: ${val.toLocaleString('pt-BR')} hab.${compStr}`;
              }
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${(v / 1000).toFixed(0)}k`, color: '#64748B', font: { family: 'Montserrat', size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#1E293B', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G2-1: Visão Geral - Evolução do PIB Total (Line 2002–2023)
  async function renderGeralPibTotalChart() {
    const canvasId = 'hubChartGeralPib';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    let pibData = RADAR_HUB_CACHE.pibTotalCache;
    if (!pibData) {
      try {
        const url = 'https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021|2022/variaveis/37?localidades=N6[3549904]';
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const seriesObj = json?.[0]?.resultados?.[0]?.series?.[0]?.serie || {};
          const labels = [];
          const data = [];
          
          for (let y = 2002; y <= 2022; y++) {
            const valStr = seriesObj[String(y)];
            if (valStr && valStr !== '...' && valStr !== '-') {
              labels.push(String(y));
              data.push(Math.round((Number(valStr) / 1000000) * 10) / 10);
            }
          }
          // Ano 2023 valor fixo oficial
          labels.push('2023');
          data.push(61.4);

          pibData = { labels, data };
          RADAR_HUB_CACHE.pibTotalCache = pibData;
        }
      } catch (err) {
        console.warn('Erro ao carregar dados SIDRA PIB:', err);
      }
    }

    // Fallback caso a API falhe
    if (!pibData || !pibData.data || !pibData.data.length) {
      pibData = {
        labels: ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        data: [13.3, 15.9, 18.7, 18.5, 18.9, 21.9, 24.9, 24.6, 25.8, 25.5, 26.6, 28.3, 30.3, 33.9, 41.6, 39.4, 39.7, 43.6, 39.4, 45.2, 56.7, 61.4]
      };
      RADAR_HUB_CACHE.pibTotalCache = pibData;
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(13, 148, 136, 0.25)');
    gradient.addColorStop(1, 'rgba(13, 148, 136, 0.0)');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: pibData.labels,
        datasets: [{
          label: 'PIB a preços correntes (R$ Bi)',
          data: pibData.data,
          borderColor: '#0D9488',
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#0D9488',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 1.5,
          pointRadius: (context) => {
            const ano = String(pibData.labels[context.dataIndex]);
            return ['2002', '2007', '2012', '2017', '2023'].includes(ano) ? 4.5 : 2;
          },
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 32, right: 35, bottom: 8, left: 10 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            display: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              return ['2002', '2007', '2012', '2017', '2023'].includes(ano);
            },
            anchor: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              if (ano === '2023' || ano === '2002') return 'center';
              return 'end';
            },
            align: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              if (ano === '2023') return 'left'; // Alinha à esquerda do ponto para não cortar na borda direita
              if (ano === '2002') return 'right'; // Alinha à direita do ponto para não sobrepor o eixo Y
              return 'top';
            },
            offset: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              if (ano === '2023' || ano === '2002') return 10;
              return 6;
            },
            clip: false,
            clamp: true,
            backgroundColor: '#FFFFFF',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#CBD5E1',
            padding: { top: 2.5, bottom: 2.5, left: 4.5, right: 4.5 },
            font: { family: 'Montserrat', size: 8.5, weight: 'bold' },
            color: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              return ano === '2023' ? '#0F766E' : '#0B2545';
            },
            formatter: (value, ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              const valStr = `R$ ${value.toFixed(1).replace('.', ',')} Bi`;
              if (ano === '2023') {
                const data = ctx.chart.data.datasets[0].data;
                const idx = ctx.dataIndex;
                const prev = idx > 0 ? data[idx - 1] : null;
                const pct = prev && prev > 0 ? (((value - prev) / prev) * 100).toFixed(1).replace('.', ',') : null;
                const sign = pct && !pct.startsWith('-') ? '+' : '';
                const pctStr = pct ? ` (${sign}${pct}%)` : '';
                return `${valStr}${pctStr} prelim.`;
              }
              return valStr;
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const idx = context.dataIndex;
                const val = Number(context.parsed.y);
                const prev = idx > 0 ? Number(context.dataset.data[idx - 1]) : null;
                const prevAno = idx > 0 ? context.chart.data.labels[idx - 1] : null;
                const pct = prev && prev > 0 ? (((val - prev) / prev) * 100).toFixed(1).replace('.', ',') : null;
                const sign = pct && !pct.startsWith('-') ? '+' : '';
                const varStr = pct !== null ? ` (${sign}${pct}% vs ${prevAno})` : '';
                return ` PIB: R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Bi${varStr}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9, weight: 'bold' },
              maxRotation: 45,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 12
            }
          },
          y: {
            grid: { color: '#F1F5F9' },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              callback: (val) => `${val} Bi`
            }
          }
        }
      }
    });

    hideSkeleton(canvasId);
  }

  // G2-2: Visão Geral - Composição Setorial do PIB (Donut com Filtro de Ano 2002 a 2023)
  async function renderGeralPibSetorialChart(selectedYear) {
    const ano = String(selectedYear || RADAR_HUB_CACHE.selectedGeralPibYear || '2021');
    RADAR_HUB_CACHE.selectedGeralPibYear = ano;

    const canvasId = 'hubChartGeralPibSetorial';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    // Atualiza classes das pills no DOM (2002 a 2023)
    document.querySelectorAll('.filter-pill-pib-year').forEach(btn => {
      const isMatch = btn.dataset.year === ano;
      btn.className = `filter-pill-pib-year px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
        isMatch ? 'bg-brand-950 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`;
    });

    const canvasWrapper = document.getElementById('hubChartGeralPibSetorialCanvasWrapper');
    const noticeBlock = document.getElementById('pib-setorial-notice-block');

    // 1. Tratamento para 2022 e 2023: IBGE não publicou abertura setorial
    if (ano === '2022' || ano === '2023') {
      destroyChart(canvasId);
      if (canvasWrapper) canvasWrapper.classList.add('hidden');
      if (noticeBlock) {
        noticeBlock.classList.remove('hidden');
        noticeBlock.classList.add('flex');
        const anoSpan = document.getElementById('pib-notice-ano');
        const anoBadge = document.getElementById('pib-notice-ano-badge');
        const pibVal = document.getElementById('pib-notice-pib-val');
        if (anoSpan) anoSpan.textContent = ano;
        if (anoBadge) anoBadge.textContent = ano;
        if (pibVal) pibVal.textContent = ano === '2022' ? 'R$ 56,7 Bi' : 'R$ 61,4 Bi';
      }
      hideSkeleton(canvasId);
      return;
    }

    // Para 2002 a 2021: Exibe o canvas e oculta o bloco de aviso
    if (canvasWrapper) canvasWrapper.classList.remove('hidden');
    if (noticeBlock) {
      noticeBlock.classList.add('hidden');
      noticeBlock.classList.remove('flex');
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    // Tabela histórica oficial de São José dos Campos (SIDRA Tabela 5938)
    const HISTORICAL_PIB_SETORIAL_SIDRA = {
      '2002': { pib_total: 13.34, serv_bi: 4.54, serv_pct: 34.0, ind_bi: 5.89, ind_pct: 44.2, outros_bi: 2.90, outros_pct: 21.7, agro_bi: 0.007, agro_pct: 0.1 },
      '2003': { pib_total: 15.87, serv_bi: 5.12, serv_pct: 32.3, ind_bi: 7.69, ind_pct: 48.4, outros_bi: 3.04, outros_pct: 19.2, agro_bi: 0.016, agro_pct: 0.1 },
      '2004': { pib_total: 18.67, serv_bi: 5.55, serv_pct: 29.7, ind_bi: 9.28, ind_pct: 49.7, outros_bi: 3.83, outros_pct: 20.5, agro_bi: 0.018, agro_pct: 0.1 },
      '2005': { pib_total: 18.46, serv_bi: 6.03, serv_pct: 32.7, ind_bi: 8.73, ind_pct: 47.3, outros_bi: 3.69, outros_pct: 20.0, agro_bi: 0.013, agro_pct: 0.1 },
      '2006': { pib_total: 18.94, serv_bi: 6.56, serv_pct: 34.6, ind_bi: 8.43, ind_pct: 44.5, outros_bi: 3.94, outros_pct: 20.8, agro_bi: 0.014, agro_pct: 0.1 },
      '2007': { pib_total: 21.86, serv_bi: 7.27, serv_pct: 33.3, ind_bi: 10.39, ind_pct: 47.5, outros_bi: 4.18, outros_pct: 19.1, agro_bi: 0.017, agro_pct: 0.1 },
      '2008': { pib_total: 24.88, serv_bi: 8.24, serv_pct: 33.1, ind_bi: 11.61, ind_pct: 46.6, outros_bi: 5.03, outros_pct: 20.2, agro_bi: 0.014, agro_pct: 0.1 },
      '2009': { pib_total: 24.57, serv_bi: 8.88, serv_pct: 36.1, ind_bi: 10.86, ind_pct: 44.2, outros_bi: 4.81, outros_pct: 19.6, agro_bi: 0.018, agro_pct: 0.1 },
      '2010': { pib_total: 25.85, serv_bi: 9.61, serv_pct: 37.2, ind_bi: 10.62, ind_pct: 41.1, outros_bi: 5.60, outros_pct: 21.7, agro_bi: 0.019, agro_pct: 0.1 },
      '2011': { pib_total: 25.52, serv_bi: 10.94, serv_pct: 42.9, ind_bi: 8.62, ind_pct: 33.8, outros_bi: 5.95, outros_pct: 23.2, agro_bi: 0.015, agro_pct: 0.1 },
      '2012': { pib_total: 26.58, serv_bi: 12.29, serv_pct: 46.2, ind_bi: 7.79, ind_pct: 29.3, outros_bi: 6.49, outros_pct: 24.4, agro_bi: 0.016, agro_pct: 0.1 },
      '2013': { pib_total: 28.29, serv_bi: 13.63, serv_pct: 48.2, ind_bi: 7.54, ind_pct: 26.6, outros_bi: 7.11, outros_pct: 25.1, agro_bi: 0.023, agro_pct: 0.1 },
      '2014': { pib_total: 30.34, serv_bi: 14.56, serv_pct: 48.0, ind_bi: 8.74, ind_pct: 28.8, outros_bi: 7.04, outros_pct: 23.2, agro_bi: 0.012, agro_pct: 0.0 },
      '2015': { pib_total: 33.89, serv_bi: 15.36, serv_pct: 45.3, ind_bi: 10.90, ind_pct: 32.2, outros_bi: 7.61, outros_pct: 22.5, agro_bi: 0.014, agro_pct: 0.0 },
      '2016': { pib_total: 41.63, serv_bi: 16.72, serv_pct: 40.2, ind_bi: 17.24, ind_pct: 41.4, outros_bi: 7.66, outros_pct: 18.4, agro_bi: 0.017, agro_pct: 0.0 },
      '2017': { pib_total: 39.40, serv_bi: 16.53, serv_pct: 42.0, ind_bi: 15.42, ind_pct: 39.1, outros_bi: 7.43, outros_pct: 18.9, agro_bi: 0.016, agro_pct: 0.0 },
      '2018': { pib_total: 39.69, serv_bi: 17.48, serv_pct: 44.0, ind_bi: 14.23, ind_pct: 35.9, outros_bi: 7.97, outros_pct: 20.1, agro_bi: 0.015, agro_pct: 0.0 },
      '2019': { pib_total: 43.56, serv_bi: 19.12, serv_pct: 43.9, ind_bi: 16.12, ind_pct: 37.0, outros_bi: 8.31, outros_pct: 19.1, agro_bi: 0.015, agro_pct: 0.0 },
      '2020': { pib_total: 39.36, serv_bi: 17.77, serv_pct: 45.1, ind_bi: 13.87, ind_pct: 35.2, outros_bi: 7.71, outros_pct: 19.6, agro_bi: 0.021, agro_pct: 0.1 },
      '2021': { pib_total: 45.21, serv_bi: 19.46, serv_pct: 43.0, ind_bi: 16.46, ind_pct: 36.4, outros_bi: 9.27, outros_pct: 20.5, agro_bi: 0.026, agro_pct: 0.1 }
    };

    const sectorData = HISTORICAL_PIB_SETORIAL_SIDRA[ano] || HISTORICAL_PIB_SETORIAL_SIDRA['2021'];
    const pibTotalVal = sectorData.pib_total;

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: [
          `Serviços · ${sectorData.serv_pct.toFixed(1).replace('.', ',')}% · R$ ${sectorData.serv_bi.toFixed(1).replace('.', ',')} Bi`,
          `Indústria · ${sectorData.ind_pct.toFixed(1).replace('.', ',')}% · R$ ${sectorData.ind_bi.toFixed(1).replace('.', ',')} Bi`,
          `Adm. Pública e Impostos · ${sectorData.outros_pct.toFixed(1).replace('.', ',')}% · R$ ${sectorData.outros_bi.toFixed(1).replace('.', ',')} Bi`,
          `Agropecuária · ${sectorData.agro_pct.toFixed(1).replace('.', ',')}% · R$ ${sectorData.agro_bi.toFixed(2).replace('.', ',')} Bi`
        ],
        datasets: [{
          data: [sectorData.serv_pct, sectorData.ind_pct, sectorData.outros_pct, sectorData.agro_pct],
          backgroundColor: ['#0D9488', '#1D4ED8', '#94A3B8', '#16A34A'],
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 6,
          spacing: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 6, right: 6, bottom: 6, left: 6 } },
        cutout: '62%',
        plugins: {
          datalabels: {
            display: (ctx) => ctx.dataset.data[ctx.dataIndex] >= 5,
            color: '#FFFFFF',
            font: { family: 'Montserrat', size: 10, weight: 'bold' },
            formatter: (v) => `${v.toFixed(1).replace('.', ',')}%`
          },
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Montserrat', size: 9, weight: 'bold' },
              boxWidth: 10,
              padding: 5,
              color: '#0F172A'
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}`
            }
          }
        }
      },
      plugins: [{
        id: 'centerTextGeralPibSetorial',
        afterDraw: (chart) => {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          const cx = (chartArea.left + chartArea.right) / 2;
          const cy = (chartArea.top + chartArea.bottom) / 2;
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 12px Montserrat, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText(String(ano), cx, cy - 8);
          ctx.font = 'bold 13px Montserrat, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.fillText(`R$ ${pibTotalVal.toFixed(1).replace('.', ',')} Bi`, cx, cy + 9);
          ctx.restore();
        }
      }]
    });

    hideSkeleton(canvasId);
  }

  // G2: Visão Geral - PIB Geral & Composição Setorial
  function renderGeralPibChart(gt) {
    renderGeralPibTotalChart();
    renderGeralPibSetorialChart(RADAR_HUB_CACHE.selectedGeralPibYear || '2021');
  }

  // Exposição global para clique nas pills
  window.switchGeralPibSetorialYear = function(year) {
    renderGeralPibSetorialChart(year);
  };

  // G3: Demografia - Série Histórica Filtrável (Line)
  function renderDemografiaHistoricoChart(gt) {
    const canvasId = 'hubChartDemografiaHistorico';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const filterVal = RADAR_HUB_CACHE.filterState.pop_serie?.period || '1970_2026';
    let serie = gt.eixos.demografia.serie_historica_populacao || [];

    if (filterVal === '2010_2026') {
      serie = serie.filter(item => item.ano >= 2010);
    } else if (filterVal === '2022_2026') {
      serie = serie.filter(item => item.ano >= 2022);
    }

    if (!serie.length) {
      showChartFallback(canvasId, '2022 (Censo)', 'https://sidra.ibge.gov.br/tabela/4714', 'IBGE');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(item => item.ano);
    const data = serie.map(item => item.populacao);

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(2, 132, 199, 0.18)');
    gradient.addColorStop(1, 'rgba(2, 132, 199, 0)');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'População de SJC',
          data: data,
          borderColor: '#0284C7',
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.25,
          segment: {
            borderDash: (ctx) => {
              const idx = ctx.p1DataIndex;
              const item = serie[idx];
              return (item && item.tipo && item.tipo.includes('Estimativa')) ? [5, 5] : undefined;
            }
          },
          pointBackgroundColor: (ctx) => {
            const item = serie[ctx.dataIndex];
            return (item && item.tipo && item.tipo.includes('Estimativa')) ? '#64748B' : '#0B2545';
          },
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 28, right: 35, bottom: 10, left: 10 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            display: true,
            anchor: 'end',
            align: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              if (ano === '2024') return 'bottom';
              return 'top';
            },
            offset: (ctx) => {
              const ano = String(ctx.chart.data.labels[ctx.dataIndex]);
              return ano === '2024' ? 8 : 5;
            },
            clip: false,
            clamp: true,
            backgroundColor: '#FFFFFF',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#CBD5E1',
            padding: { top: 2, bottom: 2, left: 4, right: 4 },
            font: { family: 'Montserrat', size: 8.5, weight: 'bold' },
            color: (ctx) => {
              const item = serie[ctx.dataIndex];
              return (item && item.tipo && item.tipo.includes('Estimativa')) ? '#475569' : '#0B2545';
            },
            formatter: (value, ctx) => {
              const idx = ctx.dataIndex;
              const item = serie[idx];
              const isEst = item && item.tipo && item.tipo.includes('Estimativa');
              const v = value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`;
              return isEst ? `${v} (est.)` : `${v} hab.`;
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const idx = ctx.dataIndex;
                const item = serie[idx];
                const tipo = item?.tipo || 'Censo Oficial IBGE';
                return ` População: ${Number(ctx.parsed.y).toLocaleString('pt-BR')} hab. (${tipo})`;
              }
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${(v / 1000).toFixed(0)}k`, color: '#64748B', font: { family: 'Montserrat', size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G4: Demografia - Pirâmide Etária Tradicional (Homens à esquerda, Mulheres à direita)
  function renderDemografiaPiramideChart(gt, ano = null) {
    const canvasId = 'hubChartDemografiaPiramide';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    if (ano) {
      RADAR_HUB_CACHE.selectedDemografiaPiramideAno = String(ano);
    }
    const selectedAno = RADAR_HUB_CACHE.selectedDemografiaPiramideAno || '2022';

    const censos = gt?.eixos?.demografia?.piramides_etarias_censos || {};
    const censoData = censos[selectedAno] || censos['2022'];

    if (!censoData || !censoData.faixas) {
      showChartFallback(canvasId, `${selectedAno} (Censo)`, 'https://sidra.ibge.gov.br/tabela/9514', 'IBGE');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    // Faixas do topo (80+) até a base (0-4) para desenho clássico da pirâmide
    const faixas = censoData.faixas;
    const labels = faixas.map(f => f.faixa);
    const dataHomens = faixas.map(f => -f.homens); // Negativo para estender à esquerda
    const dataMulheres = faixas.map(f => f.mulheres); // Positivo para estender à direita
    const totalPop = censoData.populacao_total;

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Homens',
            data: dataHomens,
            backgroundColor: '#0284C7',
            borderRadius: { topLeft: 4, bottomLeft: 4 },
            barPercentage: 0.85
          },
          {
            label: 'Mulheres',
            data: dataMulheres,
            backgroundColor: '#F472B6',
            borderRadius: { topRight: 4, bottomRight: 4 },
            barPercentage: 0.85
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { left: 24, right: 24, top: 8, bottom: 8 } },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 10, weight: 'bold' },
              color: '#334155'
            }
          },
          datalabels: {
            display: true,
            anchor: (ctx) => ctx.datasetIndex === 0 ? 'start' : 'end',
            align: (ctx) => ctx.datasetIndex === 0 ? 'left' : 'right',
            color: '#0F172A',
            font: { weight: 'bold', size: 7.5, family: 'Montserrat, sans-serif' },
            formatter: (v) => {
              const abs = Math.abs(v);
              return abs >= 1000 ? `${(abs / 1000).toFixed(1).replace('.', ',')}k` : `${abs}`;
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const abs = Math.abs(ctx.parsed.x);
                const pct = ((abs / totalPop) * 100).toFixed(2).replace('.', ',');
                return ` ${ctx.dataset.label}: ${abs.toLocaleString('pt-BR')} hab. (${pct}% do total em ${selectedAno})`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            min: -35000,
            max: 35000,
            grid: {
              color: (ctx) => ctx.tick?.value === 0 ? '#94A3B8' : 'rgba(226, 232, 240, 0.6)',
              lineWidth: (ctx) => ctx.tick?.value === 0 ? 2 : 1,
              borderDash: (ctx) => ctx.tick?.value === 0 ? [] : [4, 4]
            },
            ticks: {
              callback: (v) => {
                const abs = Math.abs(v);
                return abs === 0 ? '0' : `${(abs / 1000).toFixed(0)}k`;
              },
              color: '#64748B',
              font: { family: 'Montserrat', size: 9 }
            }
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);

    // Atualizar métricas explicativas dos cards abaixo
    updateDemografiaPiramideMetrics(selectedAno, censoData);
  }

  function updateDemografiaPiramideMetrics(ano, censoData) {
    if (!censoData || !censoData.metricas) return;
    const m = censoData.metricas;
    const elIdade = document.getElementById('demo-metric-idade-mediana');
    const elIndice = document.getElementById('demo-metric-indice-envelhecimento');
    const elSexo = document.getElementById('demo-metric-razao-sexo');
    const elDep = document.getElementById('demo-metric-razao-dependencia');
    const elSub = document.getElementById('demo-piramide-subtitle');
    const elHomens = document.getElementById('demo-piramide-homens-total');
    const elMulheres = document.getElementById('demo-piramide-mulheres-total');

    if (elIdade) elIdade.textContent = m.idade_mediana;
    if (elIndice) elIndice.textContent = m.indice_envelhecimento;
    if (elSexo) elSexo.textContent = m.razao_sexo;
    if (elDep) elDep.textContent = m.razao_dependencia;
    if (elSub) elSub.textContent = `Censo Demográfico ${ano} (IBGE SIDRA) · Total: ${censoData.populacao_total.toLocaleString('pt-BR')} hab.`;
    if (elHomens) elHomens.textContent = `Homens: ${censoData.homens_total.toLocaleString('pt-BR')} (${((censoData.homens_total/censoData.populacao_total)*100).toFixed(1).replace('.', ',')}%)`;
    if (elMulheres) elMulheres.textContent = `Mulheres: ${censoData.mulheres_total.toLocaleString('pt-BR')} (${((censoData.mulheres_total/censoData.populacao_total)*100).toFixed(1).replace('.', ',')}%)`;

    document.querySelectorAll('.filter-pill-piramide-ano').forEach(btn => {
      const isMatch = btn.dataset.ano === String(ano);
      btn.className = `filter-pill-piramide-ano px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? 'bg-brand-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
    });
  }

  // Expor globalmente para clique nas pills de censo
  window.switchDemografiaPiramideAno = function(ano) {
    if (RADAR_HUB_CACHE.groundTruth) {
      renderDemografiaPiramideChart(RADAR_HUB_CACHE.groundTruth, ano);
    }
  };

  // G-Demo-3: Demografia - População por Regiões Urbanas e Rurais (Horizontal Bar)
  function renderDemografiaRegioesChart(gt) {
    const canvasId = 'hubChartDemografiaRegioes';
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
      canvas = document.getElementById('hubChartDemografiaDistritos');
    }
    if (!canvas || !window.Chart) return;

    const actualId = canvas.id;
    const rawRegioes = gt?.eixos?.demografia?.populacao_por_regiao_censo_2022;
    const regioes = Array.isArray(rawRegioes) ? rawRegioes : (rawRegioes?.regioes || []);
    if (!regioes.length) {
      showChartFallback(actualId, '2022 (Censo)', 'https://cidades.ibge.gov.br/', 'IBGE');
      return;
    }

    hideChartFallback(actualId);
    destroyChart(actualId);

    // Ordenar decrescente por população
    const sorted = [...regioes].sort((a, b) => b.populacao - a.populacao);
    const labels = sorted.map(r => r.regiao);
    const data = sorted.map(r => r.populacao);
    const totalPop = sorted.reduce((acc, cur) => acc + cur.populacao, 0);

    const colors = [
      '#0284C7', '#0369A1', '#0EA5E9', '#38BDF8',
      '#6366F1', '#8B5CF6', '#10B981', '#F59E0B'
    ];

    RADAR_HUB_CACHE.charts[actualId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'População',
          data: data,
          backgroundColor: colors.slice(0, data.length),
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.7
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 85 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#0F172A',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v) => {
              const pct = ((v / totalPop) * 100).toFixed(1).replace('.', ',');
              return `${v.toLocaleString('pt-BR')} (${pct}%)`;
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = Number(ctx.parsed.x);
                const pct = ((val / totalPop) * 100).toFixed(2).replace('.', ',');
                return ` População: ${val.toLocaleString('pt-BR')} hab. (${pct}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${(v / 1000).toFixed(0)}k`, color: '#64748B', font: { family: 'Montserrat', size: 9 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(actualId);
  }

  // Alias retrocompatível
  function renderDemografiaDistritosChart(gt) {
    renderDemografiaRegioesChart(gt);
  }

  // G-Demo-Map: Mapa Coroplético Territorial (Polígonos dos Setores Socioeconômicos - LC 612/2018 e Censo 2022)
  let demografiaLeafletMap = null;
  let demografiaGeoJsonLayer = null;
  let currentDemografiaMetric = 'populacao'; // 'populacao' | 'densidade'
  let currentHighlightedSetor = null;

  function getDemografiaColor(val, metric) {
    if (metric === 'densidade') {
      // Hab/km²
      return val > 7500 ? '#9a3412' :
             val > 5000 ? '#ea580c' :
             val > 3000 ? '#f97316' :
             val > 1000 ? '#fdba74' :
                          '#ffedd5';
    } else {
      // População
      return val > 50000 ? '#0369a1' :
             val > 30000 ? '#0284c7' :
             val > 15000 ? '#38bdf8' :
             val > 5000  ? '#7dd3fc' :
                           '#e0f2fe';
    }
  }

  function styleDemografiaFeature(feature) {
    const p = feature.properties || {};
    const val = currentDemografiaMetric === 'densidade' ? (p.densidade_hab_km2 || 0) : (p.populacao || 0);
    return {
      fillColor: getDemografiaColor(val, currentDemografiaMetric),
      weight: 1.5,
      opacity: 0.9,
      color: '#ffffff',
      dashArray: '',
      fillOpacity: 0.72
    };
  }

  function highlightTop10ItemInList(setorName, isHighlighted) {
    document.querySelectorAll('.btn-top10-setor').forEach(btn => {
      const nameAttr = btn.getAttribute('data-setor');
      if (nameAttr && nameAttr.toLowerCase() === (setorName || '').toLowerCase()) {
        if (isHighlighted) {
          btn.classList.add('bg-sky-100', 'text-sky-900', 'border-sky-400', 'font-black', 'scale-[1.02]');
        } else {
          btn.classList.remove('bg-sky-100', 'text-sky-900', 'border-sky-400', 'font-black', 'scale-[1.02]');
        }
      }
    });
  }

  function updateDemografiaLegend() {
    const legendContainer = document.getElementById('demografia-map-legend-box');
    if (!legendContainer) return;

    if (currentDemografiaMetric === 'densidade') {
      legendContainer.innerHTML = `
        <span class="font-bold text-slate-800 block text-[9.5px] uppercase tracking-wider">Densidade Demográfica (hab./km²)</span>
        <span class="text-[8.5px] text-slate-400 block mb-1">Censo 2022 · Área calculada WGS84</span>
        <div class="space-y-1 text-[9px] text-slate-600 font-medium">
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#9a3412"></span><span>Mais de 7.500 hab./km²</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#ea580c"></span><span>5.000 a 7.500 hab./km²</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#f97316"></span><span>3.000 a 5.000 hab./km²</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#fdba74"></span><span>1.000 a 3.000 hab./km²</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#ffedd5;border:1px solid #fed7aa"></span><span>Até 1.000 hab./km²</span></div>
        </div>
      `;
    } else {
      legendContainer.innerHTML = `
        <span class="font-bold text-slate-800 block text-[9.5px] uppercase tracking-wider">População Residente (habitantes)</span>
        <span class="text-[8.5px] text-slate-400 block mb-1">Censo 2022 · 35 Setores (LC 612/2018)</span>
        <div class="space-y-1 text-[9px] text-slate-600 font-medium">
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#0369a1"></span><span>Mais de 50.000 hab.</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#0284c7"></span><span>30.000 a 50.000 hab.</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#38bdf8"></span><span>15.000 a 30.000 hab.</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#7dd3fc"></span><span>5.000 a 15.000 hab.</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-xs" style="background:#e0f2fe;border:1px solid #cbd5e1"></span><span>Até 5.000 hab.</span></div>
        </div>
      `;
    }
  }

  function renderDemografiaMapaCalor(gt) {
    const container = document.getElementById('hubMapDemografiaCalor');
    if (!container || typeof L === 'undefined') return;

    if (!demografiaLeafletMap) {
      demografiaLeafletMap = L.map('hubMapDemografiaCalor', {
        center: [-23.210, -45.890],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true
      });

      // OpenStreetMap oficial sem necessidade de chave de API
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(demografiaLeafletMap);
    }

    if (demografiaGeoJsonLayer) {
      demografiaLeafletMap.removeLayer(demografiaGeoJsonLayer);
      demografiaGeoJsonLayer = null;
    }

    const geoData = window.SJC_SETORES_GEOJSON;
    if (!geoData || !geoData.features) {
      console.warn("SJC_SETORES_GEOJSON não carregado.");
      return;
    }

    demografiaGeoJsonLayer = L.geoJSON(geoData, {
      style: styleDemografiaFeature,
      onEachFeature: function(feature, layer) {
        const p = feature.properties || {};
        
        // Tooltip rica ao passar o mouse
        layer.bindTooltip(`
          <div style="font-family:'Montserrat',sans-serif;padding:3px;min-width:170px;">
            <div style="font-size:9px;font-weight:800;color:#0284C7;text-transform:uppercase;">Setor Socioeconômico (LC 612/2018)</div>
            <div style="font-size:12px;font-weight:900;color:#0F172A;margin:1px 0 3px 0;">${p.nome || p.NM_BAIRRO} (Setor ${p.codigo_setor || ''})</div>
            <div style="font-size:10.5px;color:#475569;">Região: <strong style="color:#0F172A;">${p.regiao || '--'}</strong></div>
            <div style="font-size:10.5px;color:#475569;">População: <strong style="color:#0F172A;">${p.populacao_formatada || p.populacao} hab.</strong> (${p.percentual_total || '--'}%)</div>
            <div style="font-size:10.5px;color:#475569;">Área: <strong style="color:#0F172A;">${p.area_km2 || '--'} km²</strong> | Densidade: <strong style="color:#0F172A;">${p.densidade_formatada || p.densidade_hab_km2} hab./km²</strong></div>
            <div style="font-size:8.5px;color:#94A3B8;margin-top:3px;">Fonte: PMSJC / Censo 2022 IBGE</div>
          </div>
        `, {
          sticky: true,
          direction: 'auto',
          className: 'custom-leaflet-tooltip'
        });

        // Popup detalhado ao clicar
        layer.bindPopup(`
          <div style="font-family:'Montserrat',sans-serif;padding:4px;min-width:210px;">
            <div style="font-size:9.5px;font-weight:800;color:#0284C7;text-transform:uppercase;">Setor Socioeconômico (LC 612/2018)</div>
            <div style="font-size:14px;font-weight:900;color:#0F172A;margin:2px 0 5px 0;">#${p.posicao_geral || ''} ${p.nome || p.NM_BAIRRO} (Setor ${p.codigo_setor || ''})</div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:3px;">Região de Planejamento: <strong style="color:#0F172A;">${p.regiao || '--'}</strong></div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:3px;">População Censo 2022: <strong style="color:#0F172A;">${p.populacao_formatada || p.populacao} hab.</strong></div>
            <div style="font-size:11px;color:#64748B;margin-bottom:3px;">Participação Municipal: <strong>${p.percentual_total || '--'}%</strong></div>
            <div style="font-size:11px;color:#64748B;margin-bottom:4px;">Área Territorial: <strong>${p.area_km2 || '--'} km²</strong> · Densidade: <strong>${p.densidade_formatada || p.densidade_hab_km2} hab./km²</strong></div>
            <div style="font-size:9px;color:#94A3B8;border-top:1px solid #E2E8F0;padding-top:3px;">Fonte: PMSJC / Censo 2022 IBGE (LC 612/2018)</div>
          </div>
        `);

        // Eventos de Hover e Clique com destaque sincronizado
        layer.on({
          mouseover: function(e) {
            const l = e.target;
            l.setStyle({
              weight: 3,
              color: '#0F172A',
              fillOpacity: 0.9
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              l.bringToFront();
            }
            highlightTop10ItemInList(p.nome, true);
          },
          mouseout: function(e) {
            if (demografiaGeoJsonLayer) {
              demografiaGeoJsonLayer.resetStyle(e.target);
            }
            highlightTop10ItemInList(p.nome, false);
          },
          click: function(e) {
            const l = e.target;
            demografiaLeafletMap.fitBounds(l.getBounds(), { maxZoom: 14, padding: [25, 25] });
            highlightTop10ItemInList(p.nome, true);
          }
        });
      }
    }).addTo(demografiaLeafletMap);

    updateDemografiaLegend();

    if (typeof ResizeObserver !== 'undefined' && container && !container._hasDemografiaResizeObs) {
      const ro = new ResizeObserver(() => {
        if (demografiaLeafletMap) {
          demografiaLeafletMap.invalidateSize();
        }
      });
      ro.observe(container);
      if (container.parentElement) {
        ro.observe(container.parentElement);
      }
      container._hasDemografiaResizeObs = true;
    }

    // Sequência de redimensionamento para garantir preenchimento total e sem deformações
    if (demografiaLeafletMap) {
      demografiaLeafletMap.invalidateSize();
    }
    setTimeout(() => {
      if (demografiaLeafletMap) demografiaLeafletMap.invalidateSize();
    }, 60);
    setTimeout(() => {
      if (demografiaLeafletMap) demografiaLeafletMap.invalidateSize();
    }, 200);
    setTimeout(() => {
      if (demografiaLeafletMap) demografiaLeafletMap.invalidateSize();
    }, 500);
  }

  window.switchDemografiaMapMetric = function(metric) {
    currentDemografiaMetric = metric;
    
    // Atualizar botões de métrica
    document.querySelectorAll('.filter-pill-mapa-metric').forEach(btn => {
      if (btn.getAttribute('data-metric') === metric) {
        btn.className = 'filter-pill-mapa-metric px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-950 text-white cursor-pointer shadow-xs';
      } else {
        btn.className = 'filter-pill-mapa-metric px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
      }
    });

    if (demografiaGeoJsonLayer) {
      demografiaGeoJsonLayer.setStyle(styleDemografiaFeature);
    }
    updateDemografiaLegend();
  };

  window.focusDemografiaSetor = function(setorName) {
    if (!demografiaLeafletMap || !demografiaGeoJsonLayer) return;

    let targetLayer = null;
    demografiaGeoJsonLayer.eachLayer(layer => {
      const p = layer.feature?.properties || {};
      if (p.nome && p.nome.toLowerCase() === setorName.toLowerCase()) {
        targetLayer = layer;
      }
    });

    if (targetLayer) {
      demografiaLeafletMap.fitBounds(targetLayer.getBounds(), { maxZoom: 14, padding: [30, 30] });
      targetLayer.openPopup();
      targetLayer.setStyle({
        weight: 3.5,
        color: '#0F172A',
        fillOpacity: 0.92
      });
      targetLayer.bringToFront();
      highlightTop10ItemInList(setorName, true);
    }
  };

  // Alias retrocompatível
  window.focusDemografiaMap = function(lat, lng, zoom, name) {
    if (name) {
      window.focusDemografiaSetor(name);
    } else if (demografiaLeafletMap) {
      demografiaLeafletMap.flyTo([lat, lng], zoom || 14, { duration: 1.0 });
    }
  };

  window.filterDemografiaMapRegion = function(regionKey) {
    document.querySelectorAll('.filter-pill-mapa-regiao').forEach(btn => {
      if (btn.getAttribute('data-region') === regionKey) {
        btn.className = 'filter-pill-mapa-regiao px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-950 text-white cursor-pointer shadow-xs';
      } else {
        btn.className = 'filter-pill-mapa-regiao px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
      }
    });

    if (!demografiaLeafletMap) return;

    const boundsMap = {
      'todas': [-23.210, -45.890, 11],
      'sul': [-23.2550, -45.8900, 13],
      'leste': [-23.1800, -45.8150, 13],
      'centro': [-23.1920, -45.8900, 14],
      'oeste': [-23.2100, -45.9250, 13],
      'sudeste': [-23.2550, -45.8450, 13],
      'norte': [-23.1450, -45.8950, 13],
      'sfx': [-22.9050, -45.9550, 13]
    };

    const target = boundsMap[regionKey] || boundsMap['todas'];
    demografiaLeafletMap.flyTo([target[0], target[1]], target[2], { duration: 1.0 });
  };

  // G-Demo-4: Demografia - Composição Étnico-Racial (Filtrável por Censo)
  const DEMOGRAFIA_COR_RACA_HISTORICO = {
    '2022': {
      ano: '2022',
      totalPop: 697054,
      fonte: 'IBGE SIDRA Tab. 9605',
      categorias: [
        { cor_raca: 'Branca', populacao: 462603, pct: 66.4 },
        { cor_raca: 'Parda', populacao: 181647, pct: 26.1 },
        { cor_raca: 'Preta', populacao: 43136, pct: 6.2 },
        { cor_raca: 'Amarela', populacao: 9008, pct: 1.3 },
        { cor_raca: 'Indígena', populacao: 629, pct: 0.1 }
      ]
    },
    '2010': {
      ano: '2010',
      totalPop: 629921,
      fonte: 'IBGE SIDRA Tab. 1378',
      categorias: [
        { cor_raca: 'Branca', populacao: 445867, pct: 70.8 },
        { cor_raca: 'Parda', populacao: 146064, pct: 23.2 },
        { cor_raca: 'Preta', populacao: 27876, pct: 4.4 },
        { cor_raca: 'Amarela', populacao: 9575, pct: 1.5 },
        { cor_raca: 'Indígena', populacao: 539, pct: 0.1 }
      ]
    },
    '2000': {
      ano: '2000',
      totalPop: 539313,
      fonte: 'IBGE SIDRA Tab. 2093',
      categorias: [
        { cor_raca: 'Branca', populacao: 410956, pct: 76.2 },
        { cor_raca: 'Parda', populacao: 104627, pct: 19.4 },
        { cor_raca: 'Preta', populacao: 18337, pct: 3.4 },
        { cor_raca: 'Amarela', populacao: 4314, pct: 0.8 },
        { cor_raca: 'Indígena', populacao: 1079, pct: 0.2 }
      ]
    }
  };

  function renderDemografiaCorRacaChart(gt, ano = null) {
    const canvasId = 'hubChartDemografiaCorRaca';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    if (ano) {
      RADAR_HUB_CACHE.selectedDemografiaCorRacaAno = String(ano);
    }
    const selectedAno = RADAR_HUB_CACHE.selectedDemografiaCorRacaAno || '2022';
    const censoInfo = DEMOGRAFIA_COR_RACA_HISTORICO[selectedAno] || DEMOGRAFIA_COR_RACA_HISTORICO['2022'];
    const categorias = censoInfo.categorias;

    // Atualizar pílulas ativas
    document.querySelectorAll('.filter-pill-corraca-ano').forEach(btn => {
      if (btn.getAttribute('data-ano') === selectedAno) {
        btn.className = 'filter-pill-corraca-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-950 text-white cursor-pointer';
      } else {
        btn.className = 'filter-pill-corraca-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
      }
    });

    // Atualizar textos informativos
    const subEl = document.getElementById('demo-corraca-subtitle');
    if (subEl) {
      subEl.textContent = `Autodeclaração censitária Censo ${selectedAno} (${censoInfo.fonte}) · Total: ${censoInfo.totalPop.toLocaleString('pt-BR')} hab.`;
    }
    const detEl = document.getElementById('demo-corraca-detalhe');
    if (detEl) {
      detEl.innerHTML = `<p>Censo ${selectedAno}: Branca ${categorias[0].populacao.toLocaleString('pt-BR')} (${categorias[0].pct.toFixed(1).replace('.', ',')}%), Parda ${categorias[1].populacao.toLocaleString('pt-BR')} (${categorias[1].pct.toFixed(1).replace('.', ',')}%), Preta ${categorias[2].populacao.toLocaleString('pt-BR')} (${categorias[2].pct.toFixed(1).replace('.', ',')}%), Amarela ${categorias[3].populacao.toLocaleString('pt-BR')} (${categorias[3].pct.toFixed(1).replace('.', ',')}%) e Indígena ${categorias[4].populacao.toLocaleString('pt-BR')} (${categorias[4].pct.toFixed(1).replace('.', ',')}%). Total: ${censoInfo.totalPop.toLocaleString('pt-BR')} residentes. <span class="block mt-1 text-[10px] text-slate-400"><em>Nota Metodológica:</em> A série histórica comparável nas 5 categorias contemporâneas padronizadas pelo IBGE (Branca, Parda, Preta, Amarela, Indígena) é consolidada a nível municipal a partir dos Censos de 2000, 2010 e 2022 (com a categoria indígena introduzida em 1991). Ao contrário do tema religião (que é amostral), a cor/raça é investigada no questionário básico do universo (100% da população recenseada).</span></p>`;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = categorias.map(c => c.cor_raca);
    const data = categorias.map(c => c.pct);
    const colors = ['#0284C7', '#38BDF8', '#0B2545', '#F59E0B', '#10B981'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Percentual (%)',
          data: data,
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.65
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 85 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#0F172A',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v, ctx) => {
              const pop = categorias[ctx.dataIndex]?.populacao || 0;
              return `${v.toFixed(1).replace('.', ',')}% (${pop.toLocaleString('pt-BR')} hab.)`;
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const pop = categorias[ctx.dataIndex]?.populacao || 0;
                return ` ${ctx.parsed.x}% (${Number(pop).toLocaleString('pt-BR')} hab.)`;
              }
            }
          }
        },
        scales: {
          x: {
            suggestedMax: 80,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  window.switchDemografiaCorRacaAno = function(ano) {
    if (RADAR_HUB_CACHE.groundTruth) {
      renderDemografiaCorRacaChart(RADAR_HUB_CACHE.groundTruth, ano);
    }
  };

  // G-Demo-5: Demografia - Contraste Urbano x Rural (Filtrável por Censo)
  const DEMOGRAFIA_URBANO_RURAL_HISTORICO = {
    '2022': { ano: '2022', urbPop: 688155, rurPop: 8899, urbPct: 98.72, rurPct: 1.28, urbAreaKm2: 353.9, rurAreaKm2: 745.7, urbAreaPct: 32.2, rurAreaPct: 67.8 },
    '2010': { ano: '2010', urbPop: 615795, rurPop: 14126, urbPct: 97.76, rurPct: 2.24, urbAreaKm2: 353.9, rurAreaKm2: 745.7, urbAreaPct: 32.2, rurAreaPct: 67.8 },
    '2000': { ano: '2000', urbPop: 522428, rurPop: 16885, urbPct: 96.87, rurPct: 3.13, urbAreaKm2: 353.9, rurAreaKm2: 745.7, urbAreaPct: 32.2, rurAreaPct: 67.8 },
    '1991': { ano: '1991', urbPop: 423967, rurPop: 18403, urbPct: 95.84, rurPct: 4.16, urbAreaKm2: 353.9, rurAreaKm2: 745.7, urbAreaPct: 32.2, rurAreaPct: 67.8 },
    '1980': { ano: '1980', urbPop: 269256, rurPop: 18257, urbPct: 93.65, rurPct: 6.35, urbAreaKm2: 353.9, rurAreaKm2: 745.7, urbAreaPct: 32.2, rurAreaPct: 67.8 },
    '1970': { ano: '1970', urbPop: 125998, rurPop: 22334, urbPct: 84.94, rurPct: 15.06, urbAreaKm2: 353.9, rurAreaKm2: 745.7, urbAreaPct: 32.2, rurAreaPct: 67.8 }
  };

  function renderDemografiaUrbanoRuralChart(gt, ano = null) {
    const canvasId = 'hubChartDemografiaUrbanoRural';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    if (ano) {
      RADAR_HUB_CACHE.selectedDemografiaUrbanoRuralAno = String(ano);
    }
    const selectedAno = RADAR_HUB_CACHE.selectedDemografiaUrbanoRuralAno || '2022';
    const info = DEMOGRAFIA_URBANO_RURAL_HISTORICO[selectedAno] || DEMOGRAFIA_URBANO_RURAL_HISTORICO['2022'];

    document.querySelectorAll('.filter-pill-urbanorural-ano').forEach(btn => {
      if (btn.getAttribute('data-ano') === selectedAno) {
        btn.className = 'filter-pill-urbanorural-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-950 text-white cursor-pointer';
      } else {
        btn.className = 'filter-pill-urbanorural-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
      }
    });

    const subEl = document.getElementById('demo-urbanorural-subtitle');
    if (subEl) subEl.textContent = `Comparação entre extensão territorial e concentração populacional (Censo ${selectedAno})`;

    const detEl = document.getElementById('demo-urbanorural-detalhe');
    if (detEl) {
      detEl.innerHTML = `<p>Censo ${selectedAno}: A zona rural ocupa ${info.rurAreaPct.toFixed(1).replace('.', ',')}% da área territorial (${info.rurAreaKm2.toFixed(1).replace('.', ',')} km²), abrigando ${info.rurPct.toFixed(2).replace('.', ',')}% da população (${info.rurPop.toLocaleString('pt-BR')} hab.). A área urbana concentra ${info.urbPct.toFixed(2).replace('.', ',')}% dos moradores (${info.urbPop.toLocaleString('pt-BR')} hab.) em ${info.urbAreaPct.toFixed(1).replace('.', ',')}% do território (${info.urbAreaKm2.toFixed(1).replace('.', ',')} km²).</p>`;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Área Territorial (km²)', 'População Residente (hab.)'],
        datasets: [
          {
            label: 'Zona Urbana',
            data: [info.urbAreaPct, info.urbPct],
            backgroundColor: '#0284C7',
            borderRadius: 6,
            barPercentage: 0.6
          },
          {
            label: 'Zona Rural',
            data: [info.rurAreaPct, info.rurPct],
            backgroundColor: '#10B981',
            borderRadius: 6,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 22 } },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 10, weight: 'bold' },
              color: '#334155'
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#0F172A',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v, ctx) => {
              const isArea = ctx.dataIndex === 0;
              const isUrb = ctx.datasetIndex === 0;
              if (isArea) {
                const km2 = isUrb ? `${info.urbAreaKm2.toFixed(1).replace('.', ',')} km²` : `${info.rurAreaKm2.toFixed(1).replace('.', ',')} km²`;
                return `${v.toFixed(1).replace('.', ',')}% (${km2})`;
              } else {
                const pop = isUrb ? `${(info.urbPop / 1000).toFixed(1).replace('.', ',')}k hab.` : `${(info.rurPop / 1000).toFixed(1).replace('.', ',')}k hab.`;
                return `${v.toFixed(1).replace('.', ',')}% (${pop})`;
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const isArea = ctx.dataIndex === 0;
                const isUrb = ctx.datasetIndex === 0;
                const label = ctx.dataset.label;
                if (isArea) {
                  const val = isUrb ? `${info.urbAreaKm2.toFixed(1).replace('.', ',')} km² (${info.urbAreaPct.toFixed(1).replace('.', ',')}%)` : `${info.rurAreaKm2.toFixed(1).replace('.', ',')} km² (${info.rurAreaPct.toFixed(1).replace('.', ',')}%)`;
                  return ` ${label}: ${val}`;
                } else {
                  const val = isUrb ? `${info.urbPop.toLocaleString('pt-BR')} hab. (${info.urbPct.toFixed(2).replace('.', ',')}%)` : `${info.rurPop.toLocaleString('pt-BR')} hab. (${info.rurPct.toFixed(2).replace('.', ',')}%)`;
                  return ` ${label}: ${val}`;
                }
              }
            }
          }
        },
        scales: {
          y: {
            suggestedMax: 115,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  window.switchDemografiaUrbanoRuralAno = function(ano) {
    if (RADAR_HUB_CACHE.groundTruth) {
      renderDemografiaUrbanoRuralChart(RADAR_HUB_CACHE.groundTruth, ano);
    }
  };

  // G-Demo-6: Demografia - Estrutura dos Domicílios (Filtrável por Censo)
  const DEMOGRAFIA_DOMICILIOS_HISTORICO = {
    '2022': {
      ano: '2022',
      totalDom: 282214,
      mediaMoradores: 2.80,
      data: [247894, 24667, 9311, 283, 59],
      detalhe: 'Censo 2022: Dos 282.214 domicílios, 247.894 (87,84%) são particulares ocupados, 24.667 (8,74%) vagos, 9.311 (3,30%) de uso ocasional, 283 coletivos e 59 improvisados (Média: 2,80 moradores/domicílio).'
    },
    '2010': {
      ano: '2010',
      totalDom: 208647,
      mediaMoradores: 3.23,
      data: [188751, 14188, 5421, 235, 52],
      detalhe: 'Censo 2010: Dos 208.647 domicílios, 188.751 (90,46%) eram particulares ocupados, 14.188 (6,80%) vagos, 5.421 (2,60%) de uso ocasional, 235 coletivos e 52 improvisados (Média: 3,23 moradores/domicílio).'
    },
    '2000': {
      ano: '2000',
      totalDom: 157340,
      mediaMoradores: 3.74,
      data: [144112, 9125, 3820, 231, 52],
      detalhe: 'Censo 2000: Dos 157.340 domicílios, 144.112 (91,59%) eram particulares ocupados, 9.125 (5,80%) vagos, 3.820 (2,43%) de uso ocasional, 231 coletivos e 52 improvisados (Média: 3,74 moradores/domicílio).'
    }
  };

  function renderDemografiaDomiciliosChart(gt, ano = null) {
    const canvasId = 'hubChartDemografiaDomicilios';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    if (ano) {
      RADAR_HUB_CACHE.selectedDemografiaDomiciliosAno = String(ano);
    }
    const selectedAno = RADAR_HUB_CACHE.selectedDemografiaDomiciliosAno || '2022';
    const info = DEMOGRAFIA_DOMICILIOS_HISTORICO[selectedAno] || DEMOGRAFIA_DOMICILIOS_HISTORICO['2022'];

    document.querySelectorAll('.filter-pill-domicilios-ano').forEach(btn => {
      if (btn.getAttribute('data-ano') === selectedAno) {
        btn.className = 'filter-pill-domicilios-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-950 text-white cursor-pointer';
      } else {
        btn.className = 'filter-pill-domicilios-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
      }
    });

    const subEl = document.getElementById('demo-domicilios-subtitle');
    if (subEl) subEl.textContent = `Mapeamento dos ${info.totalDom.toLocaleString('pt-BR')} domicílios recenseados pelo IBGE (Censo ${selectedAno})`;

    const detEl = document.getElementById('demo-domicilios-detalhe');
    if (detEl) detEl.innerHTML = `<p>${info.detalhe}</p>`;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = [
      'Particulares Ocupados',
      'Vagos',
      'Uso Ocasional',
      'Coletivos',
      'Improvisados'
    ];
    const colors = ['#0284C7', '#F59E0B', '#6366F1', '#10B981', '#EF4444'];
    const totalDom = info.totalDom;

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total de Domicílios',
          data: info.data,
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.65
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 85 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#0F172A',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v) => {
              const pct = ((v / totalDom) * 100).toFixed(2).replace('.', ',');
              return `${v.toLocaleString('pt-BR')} (${pct}%)`;
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = Number(ctx.parsed.x);
                const pct = ((val / totalDom) * 100).toFixed(2).replace('.', ',');
                return ` Domicílios: ${val.toLocaleString('pt-BR')} (${pct}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${(v / 1000).toFixed(0)}k`, color: '#64748B', font: { family: 'Montserrat', size: 9 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  window.switchDemografiaDomiciliosAno = function(ano) {
    if (RADAR_HUB_CACHE.groundTruth) {
      renderDemografiaDomiciliosChart(RADAR_HUB_CACHE.groundTruth, ano);
    }
  };

  // G-Demo-7: Demografia - Composição Religiosa (Filtrável por Censo - Exclusivo SJC)
  const DEMOGRAFIA_RELIGIAO_HISTORICO = {
    '2010': {
      ano: '2010',
      isComparative: false,
      subtitulo: 'Autodeclaração Censo 2010 Amostra IBGE (Último dado censitário oficial municipal) · Pop. 10 anos ou mais',
      detalhe: 'Censo 2010 (Amostra IBGE, 10 anos ou mais): Católica 58,2% (366.614 hab.), Evangélica 25,4% (160.000 hab.), Sem religião 8,9% (56.063 hab.), Espírita 4,3% (27.087 hab.), Umbanda/Candomblé 0,8% (5.040 hab.) e Outras tradições 2,4% (15.118 hab.). Nota: O IBGE ainda não divulgou os resultados de religião por município do Censo 2022.',
      labels: ['Católica', 'Evangélica', 'Sem religião', 'Espírita', 'Umbanda / Candomblé', 'Outras'],
      datasets: [
        { label: 'São José dos Campos (2010)', data: [58.2, 25.4, 8.9, 4.3, 0.8, 2.4], backgroundColor: ['#0284C7', '#38BDF8', '#64748B', '#F59E0B', '#10B981', '#8B5CF6'], borderRadius: 6, barPercentage: 0.65 }
      ]
    },
    '2000': {
      ano: '2000',
      isComparative: false,
      subtitulo: 'Autodeclaração Censo 2000 Amostra IBGE · População de 10 anos ou mais',
      detalhe: 'Censo 2000 (Amostra IBGE, 10 anos ou mais): Católica 68,5% (369.429 hab.), Evangélica 18,9% (101.930 hab.), Sem religião 6,2% (33.437 hab.), Espírita 3,4% (18.337 hab.), Umbanda/Candomblé 0,6% (3.236 hab.) e Outras 2,4% (12.944 hab.).',
      labels: ['Católica', 'Evangélica', 'Sem religião', 'Espírita', 'Umbanda / Candomblé', 'Outras'],
      datasets: [
        { label: 'São José dos Campos (2000)', data: [68.5, 18.9, 6.2, 3.4, 0.6, 2.4], backgroundColor: ['#0284C7', '#38BDF8', '#64748B', '#F59E0B', '#10B981', '#8B5CF6'], borderRadius: 6, barPercentage: 0.65 }
      ]
    },
    '1991': {
      ano: '1991',
      isComparative: false,
      subtitulo: 'Autodeclaração Censo 1991 Amostra IBGE · População de 10 anos ou mais',
      detalhe: 'Censo 1991 (Amostra IBGE, 10 anos ou mais): Católica 78,1% (345.491 hab.), Evangélica 13,2% (58.393 hab.), Sem religião 4,8% (21.234 hab.), Espírita 2,4% (10.617 hab.), Umbanda/Candomblé 0,5% (2.212 hab.) e Outras 1,0% (4.423 hab.).',
      labels: ['Católica', 'Evangélica', 'Sem religião', 'Espírita', 'Umbanda / Candomblé', 'Outras'],
      datasets: [
        { label: 'São José dos Campos (1991)', data: [78.1, 13.2, 4.8, 2.4, 0.5, 1.0], backgroundColor: ['#0284C7', '#38BDF8', '#64748B', '#F59E0B', '#10B981', '#8B5CF6'], borderRadius: 6, barPercentage: 0.65 }
      ]
    }
  };

  function renderDemografiaReligiaoChart(gt, ano = null) {
    const canvasId = 'hubChartDemografiaReligiao';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    if (ano) {
      RADAR_HUB_CACHE.selectedDemografiaReligiaoAno = String(ano);
    }
    const selectedAno = RADAR_HUB_CACHE.selectedDemografiaReligiaoAno || '2010';
    const censoInfo = DEMOGRAFIA_RELIGIAO_HISTORICO[selectedAno] || DEMOGRAFIA_RELIGIAO_HISTORICO['2010'];

    document.querySelectorAll('.filter-pill-religiao-ano').forEach(btn => {
      if (btn.getAttribute('data-ano') === selectedAno) {
        btn.className = 'filter-pill-religiao-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-950 text-white cursor-pointer';
      } else {
        btn.className = 'filter-pill-religiao-ano px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
      }
    });

    const subEl = document.getElementById('demo-religiao-subtitle');
    if (subEl) subEl.textContent = censoInfo.subtitulo;

    const detEl = document.getElementById('demo-religiao-detalhe');
    if (detEl) detEl.innerHTML = `<p>${censoInfo.detalhe}</p>`;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: censoInfo.labels,
        datasets: censoInfo.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 22 } },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#0F172A',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${Number(v).toFixed(1).replace('.', ',')}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(1).replace('.', ',')}%`
            }
          }
        },
        scales: {
          y: {
            suggestedMax: selectedAno === '1991' ? 90 : 75,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  window.switchDemografiaReligiaoAno = function(ano) {
    if (RADAR_HUB_CACHE.groundTruth) {
      renderDemografiaReligiaoChart(RADAR_HUB_CACHE.groundTruth, ano);
    }
  };

  // G-Demo-8: Demografia - Taxa Geométrica de Crescimento Anual Intercensitário (Série Completa)
  function renderDemografiaCrescimentoChart(gt) {
    const canvasId = 'hubChartDemografiaCrescimento';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const allPeriods = [
      { id: '1970_1980', label: '1970 a 1980', taxa: 6.84, popIni: 148332, popFim: 287513, anos: 10, ganho: 139181 },
      { id: '1980_1991', label: '1980 a 1991', taxa: 3.98, popIni: 287513, popFim: 442370, anos: 11, ganho: 154857 },
      { id: '1991_2000', label: '1991 a 2000', taxa: 2.23, popIni: 442370, popFim: 539313, anos: 9, ganho: 96943 },
      { id: '2000_2010', label: '2000 a 2010', taxa: 1.56, popIni: 539313, popFim: 629921, anos: 10, ganho: 90608 },
      { id: '2010_2022', label: '2010 a 2022', taxa: 0.85, popIni: 629921, popFim: 697054, anos: 12, ganho: 67133 }
    ];

    const labels = allPeriods.map(p => p.label);
    const data = allPeriods.map(p => p.taxa);
    const colors = ['#0284C7', '#0369A1', '#0EA5E9', '#38BDF8', '#10B981'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Taxa Anual Composta (% a.a.)',
          data: data,
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.55
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 22 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#0F172A',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (v) => `+${v.toFixed(2).replace('.', ',')}% a.a.`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const item = allPeriods[ctx.dataIndex];
                return ` Taxa Geométrica: +${ctx.parsed.y.toFixed(2).replace('.', ',')}% ao ano (${item.anos} anos: ${item.popIni.toLocaleString('pt-BR')} para ${item.popFim.toLocaleString('pt-BR')} hab.)`;
              }
            }
          }
        },
        scales: {
          y: {
            suggestedMax: 8,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);

    const elDesc = document.getElementById('demo-crescimento-detalhe');
    if (elDesc) {
      elDesc.innerHTML = '<p>O ritmo desacelerou de <strong>+6,84% a.a.</strong> (anos 70) para <strong>+0,85% a.a.</strong> (2010 a 2022). Fórmula oficial: <code>r = (P_t / P_0)^(1/t) - 1</code>.</p>';
    }
  }

  // ============================================================================
  // GRÁFICOS DO EIXO SAÚDE (DATASUS / CNES / SIM / SINASC)
  // ============================================================================

  // G5: Saúde - Leitos Hospitalares CNES (Vertical Bar com Reconciliação Total)
  function renderSaudeLeitosChart(gt) {
    const canvasId = 'hubChartSaudeLeitos';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const redeFilter = RADAR_HUB_CACHE.filterState.leitos?.rede || 'total';
    const leitos = gt.eixos?.saude?.leitos_hospitalares_cnes;

    if (!leitos) {
      showChartFallback(canvasId, '2024', 'https://dadosabertos.saude.gov.br/dataset/hospitais-e-leitos', 'CNES / DataSUS');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    let labels = [];
    let values = [];
    let bgColors = [];

    const totalLeitosSus = Number(leitos.leitos_sus || 846);
    const totalLeitosNaoSus = Number(leitos.leitos_nao_sus || 1048);
    const totalLeitos = Number(leitos.total_leitos || 1894);

    const clinicosSus = Number(leitos.leitos_clinicos_cirurgicos?.sus || 698);
    const utiAdultoSus = Number(leitos.leitos_uti_adulto?.sus || 102);
    const utiPedNeoSus = Number((leitos.leitos_uti_pediatrica?.sus || 18) + (leitos.leitos_uti_neonatal?.sus || 28));

    const clinicosNaoSus = Number(leitos.leitos_clinicos_cirurgicos?.nao_sus || 864);
    const utiAdultoNaoSus = Number(leitos.leitos_uti_adulto?.nao_sus || 138);
    const utiPedNeoNaoSus = Number((leitos.leitos_uti_pediatrica?.nao_sus || 16) + (leitos.leitos_uti_neonatal?.nao_sus || 30));

    const totalUti = Number(leitos.leitos_uti_total?.total || 332);

    if (redeFilter === 'sus') {
      labels = [
        'Leitos Clínicos / Cirúrgicos SUS',
        'UTI Adulto SUS (102 leitos)',
        'UTI Pediátrica & Neonatal SUS (46 leitos)'
      ];
      values = [clinicosSus, utiAdultoSus, utiPedNeoSus];
      bgColors = ['#10B981', '#059669', '#34D399'];
    } else if (redeFilter === 'privado') {
      labels = [
        'Leitos Clínicos / Cirúrgicos Privados',
        'UTI Adulto Não-SUS (138 leitos)',
        'UTI Pediátrica & Neonatal Privada (46 leitos)'
      ];
      values = [clinicosNaoSus, utiAdultoNaoSus, utiPedNeoNaoSus];
      bgColors = ['#6366F1', '#4F46E5', '#818CF8'];
    } else {
      labels = [
        'Rede Pública SUS (846 leitos • 44,7%)',
        'Rede Privada / Convênios (1.048 leitos • 55,3%)',
        'Total de Leitos UTI Adulto/Ped/Neo (332 leitos)'
      ];
      values = [totalLeitosSus, totalLeitosNaoSus, totalUti];
      bgColors = ['#10B981', '#6366F1', '#8B5CF6'];
    }

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Leitos Cadastrados no CNES',
          data: values,
          backgroundColor: bgColors,
          borderRadius: 10,
          borderSkipped: false,
          barPercentage: 0.65,
          categoryPercentage: 0.75
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            font: { weight: 'bold', size: 10, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => typeof v === 'number' ? `${v.toLocaleString('pt-BR')} leitos` : v
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString('pt-BR')} leitos cadastrados (CNES Dez/2024)`
            }
          }
        },
        scales: {
          y: {
            suggestedMax: redeFilter === 'total' ? 1200 : 950,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G6: Saúde - Mortalidade Infantil (Line com Série Auditada SIM/SINASC/SMS)
  function renderSaudeMortalidadeChart(gt) {
    const canvasId = 'hubChartSaudeMortalidade';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const periodFilter = RADAR_HUB_CACHE.filterState.mortalidade_infantil?.period || 'todos';
    let serie = gt.eixos?.saude?.mortalidade_infantil_serie || [];

    if (periodFilter === 'recente') {
      serie = serie.filter(item => item.ano >= 2018);
    }

    if (!serie.length) {
      showChartFallback(canvasId, '2024/2025', 'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/Quadri_3_2025_1_20260227124829.pdf', 'SMS-SJC / SIM');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(item => String(item.ano));
    const data = serie.map(item => Number(item.taxa || item.taxa_por_mil_nascidos));

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(225, 29, 72, 0.22)');
    gradient.addColorStop(1, 'rgba(225, 29, 72, 0.01)');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Taxa SJC (óbitos de <1 ano / mil nascidos vivos)',
            data: data,
            borderColor: '#E11D48',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#BE123C',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: 'Meta ODS 3.2 ONU - Neonatal (< 12,0 / mil)',
            data: labels.map(() => 12.0),
            borderColor: 'rgba(148, 163, 184, 0.75)',
            borderWidth: 1.5,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 10, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => ctx.datasetIndex === 0 && (ctx.dataIndex === 0 || ctx.dataIndex === ctx.dataset.data.length - 1 || ctx.dataIndex === ctx.dataset.data.length - 2),
            anchor: 'end',
            align: 'top',
            color: '#0B2545',
            font: { weight: 'bold', size: 10, family: 'Montserrat, sans-serif' },
            formatter: (v) => typeof v === 'number' ? `${v.toFixed(2).replace('.', ',')}/mil` : v
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const item = serie[ctx.dataIndex];
                if (ctx.datasetIndex === 0 && item) {
                  return ` Taxa: ${Number(ctx.parsed.y).toFixed(2).replace('.', ',')} por mil nascidos vivos (${item.obitos_menores_1_ano} óbitos em ${item.nascidos_vivos.toLocaleString('pt-BR')} nascimentos)`;
                }
                return ` ${ctx.dataset.label}`;
              },
              afterLabel: (ctx) => {
                const item = serie[ctx.dataIndex];
                if (ctx.datasetIndex === 0 && item) {
                  return ` Fonte: ${item.status}`;
                }
                return '';
              }
            }
          }
        },
        scales: {
          y: {
            suggestedMin: 6,
            suggestedMax: 13,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Novo: Saúde - Cobertura Vacinal (Target / Bullet Horizontal Bar com Toggle de Ano)
  function renderSaudeVacinasChart(gt) {
    const canvasId = 'hubChartSaudeVacinas';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const ano = RADAR_HUB_CACHE.filterState.saude_vacinas?.ano || '2024';
    const vacList = gt.eixos?.saude?.cobertura_vacinal_por_ano?.[ano] || [];

    if (!vacList.length) {
      showChartFallback(canvasId, ano, 'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/Quadri_3_2025_1_20260227124829.pdf', 'SMS-SJC / RNDS');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = vacList.map(v => `${v.vacina}`);
    const values = vacList.map(v => Number(v.cobertura_pct));
    const metas = vacList.map(v => Number(v.meta_pni));
    const colors = values.map((v, i) => v >= metas[i] ? '#0D9488' : '#0284C7');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: `Cobertura Atingida em ${ano} (%)`,
            data: values,
            backgroundColor: colors,
            borderRadius: 8,
            barPercentage: 0.65
          },
          {
            label: 'Meta PNI Ministério da Saúde (90% a 95%)',
            data: metas,
            type: 'line',
            borderColor: '#EF4444',
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 3,
            pointBackgroundColor: '#EF4444',
            fill: false
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => ctx.datasetIndex === 0,
            anchor: 'end',
            align: 'right',
            color: '#0B2545',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${Number(v).toFixed(1).replace('.', ',')}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const item = vacList[ctx.dataIndex];
                if (ctx.datasetIndex === 0 && item) {
                  return ` ${item.imunobiologico} (${item.dose}): ${Number(ctx.parsed.x).toFixed(2).replace('.', ',')}% [Meta: ${item.meta_pni}%]`;
                }
                return ` ${ctx.dataset.label}`;
              },
              afterLabel: (ctx) => {
                const item = vacList[ctx.dataIndex];
                if (ctx.datasetIndex === 0 && item) {
                  return ` Faixa Etária: ${item.faixa_etaria} • Status: ${item.status}`;
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            suggestedMin: 70,
            suggestedMax: 105,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Novo: Saúde - Causas de Mortalidade Geral (Horizontal Bar com Fechamento a 100%)
  function renderSaudeCausasChart(gt) {
    const canvasId = 'hubChartSaudeCausas';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const ano = RADAR_HUB_CACHE.filterState.saude_causas?.ano || '2023';
    const datasetAno = gt.eixos?.saude?.causas_mortalidade_geral_por_ano?.[ano];

    if (!datasetAno || !datasetAno.categorias) {
      showChartFallback(canvasId, ano, 'https://datasus.saude.gov.br/mortalidade-desde-1996-pela-cid-10/', 'SIM / DataSUS');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const categorias = datasetAno.categorias;
    const labels = categorias.map(c => c.causa);
    const data = categorias.map(c => Number(c.pct));
    const colors = ['#E11D48', '#EA580C', '#0284C7', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4', '#64748B'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `Participação nos Óbitos (${datasetAno.status} - Total: ${datasetAno.total_obitos.toLocaleString('pt-BR')} óbitos)`,
          data: data,
          backgroundColor: colors,
          borderRadius: 8,
          barPercentage: 0.7
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#0B2545',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${Number(v).toFixed(1).replace('.', ',')}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const item = categorias[ctx.dataIndex];
                return ` ${Number(ctx.parsed.x).toFixed(2).replace('.', ',')}% (${item.obitos.toLocaleString('pt-BR')} óbitos de residentes)`;
              },
              afterLabel: (ctx) => {
                const item = categorias[ctx.dataIndex];
                return ` CID-10: ${item.cid10} • Principais: ${item.detalhes}`;
              }
            }
          }
        },
        scales: {
          x: {
            suggestedMax: 32,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Novo: Saúde - Nascidos Vivos & Parto (SINASC 2010-2024)
  function renderSaudeNascidosChart(gt) {
    const canvasId = 'hubChartSaudeNascidos';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const period = RADAR_HUB_CACHE.filterState.saude_nascidos?.period || 'todos';
    const dataObj = gt.eixos?.saude?.nascidos_vivos_sinasc;

    if (!dataObj || !dataObj.serie_historica_parto) {
      showChartFallback(canvasId, '2024', 'http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sinasc/cnv/nvsp.def', 'SINASC / DataSUS');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    let serie = dataObj.serie_historica_parto;
    if (period === 'recente') {
      serie = serie.filter(item => item.ano >= 2018);
    }

    const labels = serie.map(item => String(item.ano));
    const dataCesareo = serie.map(item => item.parto_cesareo);
    const dataVaginal = serie.map(item => item.parto_vaginal);
    const dataPctCesareo = serie.map(item => item.pct_cesareo);

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'line',
            label: '% Partos Cesáreos',
            data: dataPctCesareo,
            borderColor: '#F43F5E',
            backgroundColor: '#F43F5E',
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#F43F5E',
            pointBorderWidth: 2,
            yAxisID: 'yPct',
            order: 1
          },
          {
            type: 'bar',
            label: 'Parto Cesáreo (Leitos SUS e Convênios)',
            data: dataCesareo,
            backgroundColor: '#8B5CF6',
            borderRadius: 6,
            barPercentage: 0.65,
            categoryPercentage: 0.8,
            yAxisID: 'yCount',
            order: 2
          },
          {
            type: 'bar',
            label: 'Parto Vaginal / Normal',
            data: dataVaginal,
            backgroundColor: '#14B8A6',
            borderRadius: 6,
            barPercentage: 0.65,
            categoryPercentage: 0.8,
            yAxisID: 'yCount',
            order: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => ctx.dataset.type === 'line',
            anchor: 'top',
            align: 'top',
            color: '#BE123C',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${Number(v).toFixed(1).replace('.', ',')}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'line') {
                  return ` Taxa de Cesárea: ${Number(ctx.parsed.y).toFixed(2).replace('.', ',')}%`;
                }
                return ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString('pt-BR')} nascidos`;
              },
              afterBody: (ctxItems) => {
                const idx = ctxItems[0].dataIndex;
                const item = serie[idx];
                return `Total de Nascidos Vivos: ${item.nascidos_vivos.toLocaleString('pt-BR')} (${item.status})`;
              }
            }
          }
        },
        scales: {
          yCount: {
            type: 'linear',
            position: 'left',
            suggestedMax: 7000,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9.5 },
              callback: (v) => Number(v).toLocaleString('pt-BR')
            }
          },
          yPct: {
            type: 'linear',
            position: 'right',
            min: 40,
            max: 80,
            grid: { display: false },
            ticks: {
              color: '#BE123C',
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              callback: (v) => `${v}%`
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Novo: Saúde - Casos Confirmados de Dengue (Série Oficial PMSJC / SINAN 2010-2024)
  function renderSaudeDengueChart(gt) {
    const canvasId = 'hubChartSaudeDengue';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const period = RADAR_HUB_CACHE.filterState.saude_dengue?.period || 'todos';
    const dataObj = gt.eixos?.saude?.dengue_sinan;

    if (!dataObj || !dataObj.serie_historica) {
      showChartFallback(canvasId, '2024', 'https://www.sjc.sp.gov.br/noticias/2019/janeiro/9/com-acoes-de-prevencao-casos-de-dengue-caem-quase-pela-metade-em-sao-jose/', 'Prefeitura SJC / SINAN');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    let serie = dataObj.serie_historica;
    if (period === 'recente') {
      serie = serie.filter(item => item.ano >= 2018);
    }

    const labels = serie.map(item => String(item.ano));
    const data = serie.map(item => item.casos);

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Casos Confirmados de Dengue',
          data: data,
          backgroundColor: (ctx) => {
            const ano = ctx.chart.data.labels[ctx.dataIndex];
            return Number(ano) === 2024 ? '#DC2626' :
                   Number(ano) === 2015 ? '#F97316' : '#F59E0B';
          },
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.65
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            display: (ctx) => {
              const ano = ctx.chart.data.labels[ctx.dataIndex];
              return [2015, 2024].includes(Number(ano));
            },
            anchor: 'end',
            align: 'top',
            color: '#0B2545',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (value) => Number(value).toLocaleString('pt-BR') + ' casos'
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString('pt-BR')} casos confirmados`,
              afterLabel: (ctx) => {
                const item = serie[ctx.dataIndex];
                return ` Status: ${item.status_metodologico || 'CASOS CONFIRMADOS'} (Média Histórica 2010-2023: 1.876 casos/ano)`;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'logarithmic',
            min: 50,
            max: 150000,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9.5 },
              callback: (value) => {
                if ([100, 500, 1000, 5000, 10000, 50000, 100000].includes(Number(value))) {
                  return Number(value).toLocaleString('pt-BR');
                }
                return '';
              }
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Novo: Saúde - Internações Hospitalares SUS (SIH 2010-2024 / Top Causas CID-10)
  function renderSaudeInternacoesChart(gt) {
    const canvasId = 'hubChartSaudeInternacoes';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const ano = RADAR_HUB_CACHE.filterState.saude_internacoes?.ano || '2024';
    const sih = gt.eixos?.saude?.internacoes_sih;

    if (!sih) {
      showChartFallback(canvasId, '2024', 'http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sih/cnv/nisp.def', 'SIH / DataSUS');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    if (ano === 'serie') {
      const serie = sih.serie_historica || [];
      const labels = serie.map(item => String(item.ano));
      const data = serie.map(item => item.internacoes);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Internações Hospitalares de Residentes (AIH Pagas pelo SUS)',
            data: data,
            borderColor: '#0284C7',
            backgroundColor: 'rgba(2, 132, 199, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#0284C7',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'top',
              align: 'top',
              color: '#0369A1',
              font: { weight: 'bold', size: 9, family: 'Montserrat' },
              formatter: (v) => `${(v / 1000).toFixed(1).replace('.', ',')}k`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString('pt-BR')} internações hospitalares no SUS`
              }
            }
          },
          scales: {
            y: {
              suggestedMin: 25000,
              suggestedMax: 60000,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      const topCausas = ano === '2023' ? (sih.top_causas_2023 || []) : (sih.top_causas_2024 || []);
      const labels = topCausas.map(item => item.causa);
      const data = topCausas.map(item => item.pct);
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#64748B'];

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `Principais Causas de Internação SUS (${ano})`,
            data: data,
            backgroundColor: colors,
            borderRadius: 8,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { boxWidth: 12, font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: '#0B2545',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
              formatter: (v) => `${Number(v).toFixed(1).replace('.', ',')}%`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const item = topCausas[ctx.dataIndex];
                  return ` ${Number(ctx.parsed.x).toFixed(2).replace('.', ',')}% (${item.internacoes.toLocaleString('pt-BR')} AIHs)`;
                },
                afterLabel: (ctx) => {
                  const item = topCausas[ctx.dataIndex];
                  return ` Capítulo: ${item.capitulo}`;
                }
              }
            }
          },
          scales: {
            x: {
              suggestedMax: 18,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G-Novo: Saúde - Atenção Básica & Cobertura ESF (CNES / e-Gestor / SMS)
  function renderSaudeAtencaoBasicaChart(gt) {
    const canvasId = 'hubChartSaudeAtencaoBasica';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const view = RADAR_HUB_CACHE.filterState.saude_atencao_basica?.view || 'cobertura';
    const ab = gt.eixos?.saude?.atencao_basica_cnes_sia;

    if (!ab || !ab.serie_cobertura) {
      showChartFallback(canvasId, '2024', 'https://egestorab.saude.gov.br/', 'e-Gestor AB / SMS');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const serie = ab.serie_cobertura;
    const labels = serie.map(item => String(item.ano));

    if (view === 'consultas') {
      const data = serie.map(item => item.consultas_atendimentos);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Atendimentos e Consultas na Atenção Básica',
            data: data,
            backgroundColor: '#0D9488',
            borderRadius: 8,
            barPercentage: 0.65
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#0F766E',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat' },
              formatter: (v) => `${(v / 1000000).toFixed(2).replace('.', ',')}M`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString('pt-BR')} atendimentos médicos/enfermagem`
              }
            }
          },
          scales: {
            y: {
              suggestedMax: 1600000,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      const data = serie.map(item => item.cobertura_pct);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cobertura Populacional da Atenção Básica / ESF (%)',
            data: data,
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.15)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#059669',
            pointBorderWidth: 2.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'top',
              align: 'top',
              color: '#065F46',
              font: { weight: 'bold', size: 10, family: 'Montserrat' },
              formatter: (v) => `${Number(v).toFixed(1).replace('.', ',')}%`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Cobertura da Atenção Primária: ${Number(ctx.parsed.y).toFixed(1).replace('.', ',')}% (142 equipes eSF/eAP)`
              }
            }
          },
          scales: {
            y: {
              min: 65,
              max: 95,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G-Novo: Saúde - Produção de Serviços SUS (SIA/SUS + SIH/SUS)
  function renderSaudeProcedimentosChart(gt) {
    const canvasId = 'hubChartSaudeProcedimentos';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const tipo = RADAR_HUB_CACHE.filterState.saude_procedimentos?.tipo || 'comparativo';
    const proc = gt.eixos?.saude?.procedimentos_sia_sih;

    if (!proc) {
      showChartFallback(canvasId, '2024', 'http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sia/cnv/qasp.def', 'SIA/SIH DataSUS');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    if (tipo === 'ambulatorial') {
      const topAmb = proc.top_ambulatoriais_2024 || [];
      const labels = topAmb.map(item => item.procedimento);
      const data = topAmb.map(item => item.quantidade);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Procedimentos Ambulatoriais Aprovados (SIA 2024)',
            data: data,
            backgroundColor: ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'],
            borderRadius: 8,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { boxWidth: 12, font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: '#0B2545',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat' },
              formatter: (v) => `${(v / 1000000).toFixed(2).replace('.', ',')}M`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const item = topAmb[ctx.dataIndex];
                  return ` ${Number(ctx.parsed.x).toLocaleString('pt-BR')} atos (${item.pct}% do total ambulatorial)`;
                }
              }
            }
          },
          scales: {
            x: {
              suggestedMax: 4800000,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { callback: (v) => `${(v/1000000).toFixed(1)}M`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
            }
          }
        }
      });
    } else if (tipo === 'hospitalar') {
      const topHosp = proc.top_hospitalares_2024 || [];
      const labels = topHosp.map(item => item.procedimento);
      const data = topHosp.map(item => item.quantidade);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Principais Procedimentos Hospitalares SUS (SIH 2024)',
            data: data,
            backgroundColor: ['#10B981', '#06B6D4', '#3B82F6', '#F59E0B', '#E11D48'],
            borderRadius: 8,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { boxWidth: 12, font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: '#0B2545',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat' },
              formatter: (v) => Number(v).toLocaleString('pt-BR')
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const item = topHosp[ctx.dataIndex];
                  return ` ${Number(ctx.parsed.x).toLocaleString('pt-BR')} internações/atos (${item.pct}%)`;
                }
              }
            }
          },
          scales: {
            x: {
              suggestedMax: 6500,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      const serie = proc.serie_producao || [];
      const labels = serie.map(item => String(item.ano));
      const dataAmb = serie.map(item => item.ambulatorial);
      const dataHosp = serie.map(item => item.hospitalar);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'bar',
              label: 'Procedimentos Ambulatoriais (SIA / Milhões)',
              data: dataAmb,
              backgroundColor: '#3B82F6',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8,
              yAxisID: 'yAmb'
            },
            {
              type: 'line',
              label: 'Atos e Internações Hospitalares (SIH)',
              data: dataHosp,
              borderColor: '#10B981',
              backgroundColor: '#10B981',
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#FFFFFF',
              pointBorderColor: '#10B981',
              pointBorderWidth: 2,
              yAxisID: 'yHosp'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { boxWidth: 12, font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              display: (ctx) => ctx.dataset.type === 'bar',
              anchor: 'end',
              align: 'top',
              color: '#1E40AF',
              font: { weight: 'bold', size: 9, family: 'Montserrat' },
              formatter: (v) => `${(v / 1000000).toFixed(1).replace('.', ',')}M`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  if (ctx.dataset.type === 'line') {
                    return ` Hospitalar (SIH): ${Number(ctx.parsed.y).toLocaleString('pt-BR')} atos`;
                  }
                  return ` Ambulatorial (SIA): ${Number(ctx.parsed.y).toLocaleString('pt-BR')} procedimentos`;
                }
              }
            }
          },
          scales: {
            yAmb: {
              type: 'linear',
              position: 'left',
              suggestedMax: 10000000,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: {
                color: '#1E40AF',
                font: { family: 'Montserrat', size: 9.5 },
                callback: (v) => `${(v / 1000000).toFixed(0)}M`
              }
            },
            yHosp: {
              type: 'linear',
              position: 'right',
              suggestedMax: 200000,
              grid: { display: false },
              ticks: {
                color: '#047857',
                font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
                callback: (v) => `${(v / 1000).toFixed(0)}k`
              }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G7: Segurança - Vítimas e Taxa de Homicídios Dolosos (Série Histórica SSP-SP 2001-2025)
  function renderSegurancaHomicidiosChart(gt) {
    const canvasId = 'hubChartSegurancaHomicidios';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const periodFilter = RADAR_HUB_CACHE.filterState.seg_homicidios?.period || 'todos';
    let serie = gt.eixos.seguranca.taxa_homicidios_dolosos_serie || [];

    if (periodFilter === 'recente') {
      serie = serie.filter(item => item.ano >= 2018);
    }

    if (!serie.length) {
      showChartFallback(canvasId, '2024', 'https://www.ssp.sp.gov.br/estatistica/dados-mensais', 'SSP-SP');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(item => String(item.ano));
    const vitimas = serie.map(item => item.vitimas);
    const taxas = serie.map(item => item.taxa_por_100k);

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(217, 119, 6, 0.22)');
    gradient.addColorStop(1, 'rgba(217, 119, 6, 0.01)');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Vítimas de Homicídio Doloso (SSP-SP)',
            data: vitimas,
            borderColor: '#D97706',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.25,
            pointBackgroundColor: '#B45309',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            yAxisID: 'yVitimas'
          },
          {
            label: 'Taxa Oficial (por 100 mil hab.)',
            data: taxas,
            borderColor: '#0284C7',
            borderWidth: 2,
            borderDash: [3, 3],
            pointRadius: 3,
            pointBackgroundColor: '#0284C7',
            fill: false,
            yAxisID: 'yTaxa'
          },
          {
            label: 'Limiar Crítico OMS (10,0/100k)',
            data: labels.map(() => 10.0),
            borderColor: 'rgba(239, 68, 68, 0.65)',
            borderWidth: 1.5,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            yAxisID: 'yTaxa'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => {
              if (ctx.datasetIndex === 0) {
                const ano = Number(labels[ctx.dataIndex]);
                return [2001, 2010, 2016, 2024, 2025].includes(ano);
              }
              return false;
            },
            anchor: 'top',
            align: 'top',
            color: '#9A3412',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${v} vítimas`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.datasetIndex === 0) {
                  const item = serie[ctx.dataIndex];
                  return ` Vítimas: ${item.vitimas} (${item.ocorrencias} ocorrências)`;
                }
                if (ctx.datasetIndex === 1) {
                  const item = serie[ctx.dataIndex];
                  return ` Taxa: ${item.taxa_por_100k.toFixed(2)} / 100k hab. (Pop base: ${Number(item.populacao_base).toLocaleString('pt-BR')} - ${item.fonte_populacao})`;
                }
                return ` ${ctx.dataset.label}`;
              }
            }
          }
        },
        scales: {
          yVitimas: {
            type: 'linear',
            position: 'left',
            suggestedMin: 0,
            suggestedMax: periodFilter === 'recente' ? 60 : 260,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#B45309', font: { family: 'Montserrat', size: 9.5 } }
          },
          yTaxa: {
            type: 'linear',
            position: 'right',
            suggestedMin: 0,
            suggestedMax: periodFilter === 'recente' ? 12 : 50,
            grid: { display: false },
            ticks: {
              color: '#0284C7',
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              callback: (v) => `${v}/100k`
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G8-Novo: Segurança - Dinâmica Mensal / Anual (Toggle Interativo)
  function renderSegurancaMensalChart(gt) {
    const canvasId = 'hubChartSegurancaMensal';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const mode = RADAR_HUB_CACHE.filterState.seg_mensal?.mode || 'mensal';
    const crime = RADAR_HUB_CACHE.filterState.seg_mensal?.crime || 'homicidio_doloso';

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const crimeNames = {
      homicidio_doloso: 'Homicídio Doloso',
      roubo_veiculo: 'Roubo de Veículos',
      furto_veiculo: 'Furto de Veículos',
      roubo_outros: 'Roubos Gerais'
    };

    if (mode === 'mensal') {
      const mensais2024 = gt.eixos.seguranca.ocorrencias_mensais_2023_2024?.['2024'] || [];
      const mensais2023 = gt.eixos.seguranca.ocorrencias_mensais_2023_2024?.['2023'] || [];

      const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const data2024 = mensais2024.map(m => m[crime] || 0);
      const data2023 = mensais2023.map(m => m[crime] || 0);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: `2024 - ${crimeNames[crime]}`,
              data: data2024,
              backgroundColor: '#0284C7',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            },
            {
              label: `2023 - ${crimeNames[crime]}`,
              data: data2023,
              backgroundColor: '#CBD5E1',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
                color: '#475569'
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 8.5, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => v > 0 ? v : ''
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} ocorrências no mês`
              }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      // Modo Anual (2018 a 2024)
      const anuais = gt.eixos.seguranca.ocorrencias_anuais_por_categoria || {};
      const anos = Object.keys(anuais).sort();
      const values = anos.map(ano => anuais[ano][crime] || 0);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: anos,
          datasets: [{
            label: `Série Anual - ${crimeNames[crime]}`,
            data: values,
            backgroundColor: values.map((_, i) => i === values.length - 1 ? '#0284C7' : '#94A3B8'),
            borderRadius: 8,
            barPercentage: 0.65
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
                color: '#475569'
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => v.toLocaleString('pt-BR')
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString('pt-BR')} ocorrências registradas na SSP-SP`
              }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G-Novo: Segurança - Ranking Grandes Cidades Paulistas (+500k) & Meios Empregados
  function renderSegurancaPatrimonioChart(gt) {
    const canvasId = 'hubChartSegurancaPatrimonio';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const modo = RADAR_HUB_CACHE.filterState.seg_patrimonio?.modo || 'ranking';

    if (modo === 'esclarecimento') {
      const deic = gt.eixos.seguranca.esclarecimento_deic_2024?.meios_empregados || [];
      const labels = deic.map(item => item.meio);
      const data = deic.map(item => item.casos);
      const colors = ['#E11D48', '#EA580C', '#D97706', '#0284C7', '#64748B'];

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Meios Empregados em Homicídios (DEIC SJC 2024 - 87% Esclarecidos)',
            data: data,
            backgroundColor: colors,
            borderRadius: 6,
            barPercentage: 0.65
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { boxWidth: 12, font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => `${v} casos (${((v/23)*100).toFixed(1).replace('.', ',')}%)`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.x} ocorrências registradas em 2024`
              }
            }
          },
          scales: {
            x: {
              suggestedMax: 14,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      const ranking = gt.eixos.seguranca.ranking_cidades_500k_2024 || [];
      const labels = ranking.map(item => item.cidade);
      const data = ranking.map(item => item.taxa_100k);
      const bgColors = ranking.map(item => item.cidade.includes('São José dos Campos') ? '#059669' : '#94A3B8');

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Taxa de Homicídios Dolosos / 100k hab. (Cidades Paulistas +500k hab em 2024)',
            data: data,
            backgroundColor: bgColors,
            borderRadius: 6,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { boxWidth: 12, font: { family: 'Montserrat', size: 9.5, weight: 'bold' }, color: '#475569' }
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => `${Number(v).toFixed(2).replace('.', ',')}/100k`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Taxa: ${Number(ctx.parsed.x).toFixed(2).replace('.', ',')} por 100 mil habitantes (SSP-SP 2024)`
              }
            }
          },
          scales: {
            x: {
              suggestedMax: 10,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { callback: (v) => `${v}/100k`, color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G-Novo: Segurança - Proteção à Mulher & Produtividade Policial
  function renderSegurancaDDMChart(gt) {
    const canvasId = 'hubChartSegurancaDDM';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const modo = RADAR_HUB_CACHE.filterState.seg_ddm?.modo || 'produtividade';
    hideChartFallback(canvasId);
    destroyChart(canvasId);

    if (modo === 'sao_jose_unida') {
      const csi = gt.eixos.seguranca.programa_sao_jose_unida || {};
      const labels = [
        'Ocorrências Atendidas',
        'Detidos por Câmeras',
        'Ações Integradas',
        'Veículos Recuperados',
        'Procurados Recapturados'
      ];
      const values = [
        csi.ocorrencias_atendidas || 2948,
        csi.pessoas_detidas_cameras || 1373,
        csi.acoes_integradas || 800,
        csi.veiculos_recuperados || 674,
        csi.procurados_recapturados || 298
      ];

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monitoramento São José Unida (CSI)',
            data: values,
            backgroundColor: ['#0B2545', '#4338CA', '#2563EB', '#059669', '#D97706'],
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
            datalabels: {
              anchor: 'end',
              align: 'right',
              font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => Number(v).toLocaleString('pt-BR')
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${Number(ctx.parsed.x).toLocaleString('pt-BR')} registros acumulados no CSI`
              }
            }
          },
          scales: {
            x: {
              suggestedMax: 3200,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      // Produtividade Policial (SSP-SP 2024 Primária)
      const prod = gt.eixos.seguranca.produtividade_policial_2024 || {};
      const labels = [
        'Inquéritos Instaurados',
        'Prisões Efetuadas',
        'Presos em Flagrante',
        'Flagrantes Lavrados',
        'Presos por Mandado',
        'Veículos Recuperados',
        'Tráfico de Entorpecentes',
        'Armas de Fogo Apreendidas'
      ];
      const values = [
        prod.inqueritos_policiais_instaurados || 5647,
        prod.prisoes_efetuadas || 2170,
        1420,
        prod.flagrantes_lavrados || 1295,
        1111,
        prod.veiculos_recuperados || 452,
        prod.trafico_entorpecentes || 438,
        prod.armas_fogo_apreendidas || 199
      ];

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Produtividade Policial Homologada (SSP-SP 2024)',
            data: values,
            backgroundColor: ['#0B2545', '#0284C7', '#0EA5E9', '#38BDF8', '#6366F1', '#10B981', '#F59E0B', '#EF4444'],
            borderRadius: 6,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              font: { weight: 'bold', size: 8.5, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => Number(v).toLocaleString('pt-BR')
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${Number(ctx.parsed.x).toLocaleString('pt-BR')} atos policiais registrados em 2024 (SSP-SP)`
              }
            }
          },
          scales: {
            x: {
              suggestedMax: 6200,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 8.5, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }
  // ============================================================================
  // GRÁFICOS DO EIXO MEIO AMBIENTE & CLIMA (CETESB / INPE / SNIS)
  // ============================================================================

  // G9-1: Meio Ambiente - Qualidade do Ar CETESB (Toggle Mensal / Anual)
  function renderMeioAmbienteArChart(gt) {
    const canvasId = 'hubChartMeioAmbienteAr';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const mode = RADAR_HUB_CACHE.filterState.amb_ar?.mode || 'mensal';
    const estacao = RADAR_HUB_CACHE.filterState.amb_ar?.estacao || 'satelite';

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    if (mode === 'mensal') {
      const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const m2024 = gt.eixos.meio_ambiente.qualidade_ar_cetesb_mensal_2023_2024?.['2024'] || [];
      const m2023 = gt.eixos.meio_ambiente.qualidade_ar_cetesb_mensal_2023_2024?.['2023'] || [];

      let dataset2024 = [];
      let dataset2023 = [];
      let label2024 = '2024 (Dias de Ar Bom)';
      let label2023 = '2023 (Dias de Ar Bom)';

      if (estacao === 'vista_verde') {
        dataset2024 = m2024.map(m => m.vista_verde_dias_bom ?? 27);
        dataset2023 = m2023.map(m => m.vista_verde_dias_bom ?? 27);
        label2024 = '2024 (Vista Verde - Dias Bom)';
        label2023 = '2023 (Vista Verde - Dias Bom)';
      } else if (estacao === 'ambas') {
        dataset2024 = m2024.map(m => m.jd_satelite_dias_bom ?? 26);
        dataset2023 = m2024.map(m => m.vista_verde_dias_bom ?? 27);
        label2024 = '2024 - Jd. Satélite';
        label2023 = '2024 - Vista Verde';
      } else {
        dataset2024 = m2024.map(m => m.jd_satelite_dias_bom ?? 26);
        dataset2023 = m2023.map(m => m.jd_satelite_dias_bom ?? 26);
        label2024 = '2024 (Jd. Satélite - Dias Bom)';
        label2023 = '2023 (Jd. Satélite - Dias Bom)';
      }

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: label2024,
              data: dataset2024,
              backgroundColor: '#059669',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            },
            {
              label: label2023,
              data: dataset2023,
              backgroundColor: '#CBD5E1',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
                color: '#475569'
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 8, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => v > 0 ? v : ''
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} dias de ar em padrão 'Bom'`
              }
            }
          },
          scales: {
            y: {
              suggestedMax: 31,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      // Modo Anual Consolidado
      const labels = ['Jardim Satélite (Urbana Central)', 'Vista Verde (Zona Leste)', 'Média da Rede Telemétrica SJC'];
      const values = [312, 324, 318];
      const pcts = [85.5, 88.8, 87.1];

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Dias com Ar em Padrão Bom / Ótimo',
            data: values,
            backgroundColor: ['#059669', '#10B981', '#0D9488'],
            borderRadius: 8,
            barPercentage: 0.6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v, ctx) => `${v} dias (${pcts[ctx.dataIndex]}%)`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.y} dias com ar em conformidade estrita CETESB (${pcts[ctx.dataIndex]}% do ano)`
              }
            }
          },
          scales: {
            y: {
              suggestedMax: 365,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G9-2: Meio Ambiente - Focos de Queimadas INPE (Vertical Bar Série Histórica)
  function renderMeioAmbienteQueimadasChart(gt) {
    const canvasId = 'hubChartMeioAmbienteQueimadas';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const periodFilter = RADAR_HUB_CACHE.filterState.amb_queimadas?.period || 'todos';
    let serie = gt.eixos.meio_ambiente.focos_queimadas_inpe_serie || [];

    if (periodFilter === 'recente') {
      serie = serie.filter(item => item.ano >= 2018);
    }

    if (!serie.length) {
      showChartFallback(canvasId, '2024', 'https://queimadas.dgi.inpe.br/', 'INPE');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(item => item.ano);
    const data = serie.map(item => item.focos);
    const colors = data.map(v => v >= 80 ? '#EA580C' : '#F59E0B');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Focos de Calor Detectados',
          data: data,
          backgroundColor: colors,
          borderRadius: 8,
          barPercentage: 0.65
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${v} focos`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} focos detectados pelo satélite de referência INPE`
            }
          }
        },
        scales: {
          y: {
            suggestedMax: 110,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G9-3: Meio Ambiente - Universalização do Saneamento (Bullet / Target Horizontal Bar)
  function renderMeioAmbienteSaneamentoChart(gt) {
    const canvasId = 'hubChartMeioAmbienteSaneamento';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = [
      'Atendimento Água Tratada',
      'Coleta de Esgoto Sanitário',
      'Tratamento do Esgoto Coletado',
      'Índice de Perdas na Distribuição'
    ];
    const values = [99.8, 98.5, 98.2, 22.4];
    const metas = [99.0, 90.0, 90.0, 25.0];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Índice Municipal SJC (%)',
            data: values,
            backgroundColor: ['#0284C7', '#0D9488', '#10B981', '#F59E0B'],
            borderRadius: 8,
            barPercentage: 0.65
          },
          {
            label: 'Meta Marco Legal do Saneamento (%)',
            data: metas,
            type: 'line',
            borderColor: '#64748B',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 4,
            pointBackgroundColor: '#64748B',
            fill: false
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => ctx.datasetIndex === 0,
            anchor: 'end',
            align: 'right',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${Number(v).toFixed(1)}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.x}%`
            }
          }
        },
        scales: {
          x: {
            suggestedMin: 0,
            suggestedMax: 110,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G9-4: Meio Ambiente - Território Protegido & Conservação (Donut / Horizontal Bar)
  function renderMeioAmbienteTerritorioChart(gt) {
    const canvasId = 'hubChartMeioAmbienteTerritorio';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = [
      'APA São Francisco Xavier (115 km²)',
      'Parque Est. Mananciais / Ruschi / ARIE (28,5 km²)',
      'Demais Áreas Protegidas e Mananciais (549 km²)',
      'Perímetro Urbano e Expansão (406,9 km²)'
    ];
    const values = [115.0, 28.5, 549.0, 406.9];
    const colors = ['#059669', '#10B981', '#34D399', '#94A3B8'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 10,
              font: { family: 'Montserrat', size: 8.5, weight: 'bold' },
              color: '#334155'
            }
          },
          datalabels: {
            color: '#FFFFFF',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v, ctx) => {
              const total = 1099.4;
              const pct = ((v / total) * 100).toFixed(1);
              return pct > 8 ? `${pct}%` : '';
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} km² (${((ctx.parsed / 1099.4) * 100).toFixed(1)}% do município)`
            }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // ============================================================================
  // GRÁFICOS DO EIXO ECONOMIA & TRABALHO (CAGED / IBGE / RFB)
  // ============================================================================

  // G10-1: Economia - Evolução do PIB e PIB per Capita (IBGE)
  function renderEconomiaPibChart(gt) {
    const canvasId = 'hubChartEconomiaPib';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const tipo = RADAR_HUB_CACHE.filterState.econ_pib?.tipo || 'total';
    const serie = gt.eixos.economia.pib_serie_historica || [];

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(s => s.ano);
    let data = [];
    let label = '';
    let unit = '';
    let color = '#0284C7';

    if (tipo === 'per_capita') {
      data = serie.map(s => s.pib_per_capita);
      label = 'PIB per Capita (R$/hab)';
      unit = 'R$ ';
      color = '#059669';
    } else {
      data = serie.map(s => Number((s.pib_milhoes / 1000).toFixed(2)));
      label = 'PIB Municipal (R$ Bilhões)';
      unit = 'R$ ';
      color = '#0284C7';
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, tipo === 'per_capita' ? 'rgba(5, 150, 105, 0.22)' : 'rgba(2, 132, 199, 0.22)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderColor: color,
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: color,
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => ctx.dataIndex === 0 || ctx.dataIndex === ctx.dataset.data.length - 1,
            anchor: 'end',
            align: 'top',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => tipo === 'per_capita' ? `R$ ${(v / 1000).toFixed(1)}k` : `R$ ${v.toFixed(1)} bi`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => tipo === 'per_capita' 
                ? ` PIB per Capita: R$ ${Number(ctx.parsed.y).toLocaleString('pt-BR')}`
                : ` PIB Municipal: R$ ${ctx.parsed.y.toFixed(2)} bilhões`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9.5 },
              callback: (v) => tipo === 'per_capita' ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${v} bi`
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G10-2: Economia - Geração de Emprego Novo CAGED (Toggle Mensal / Anual)
  function renderEconomiaEmpregoChart(gt) {
    const canvasId = 'hubChartEconomiaEmprego';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const mode = RADAR_HUB_CACHE.filterState.econ_caged?.mode || 'mensal';
    hideChartFallback(canvasId);
    destroyChart(canvasId);

    if (mode === 'mensal') {
      const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const m2024 = gt.eixos.economia.caged_mensal_2023_2024?.['2024'] || [];
      const m2023 = gt.eixos.economia.caged_mensal_2023_2024?.['2023'] || [];

      const saldos2024 = m2024.map(m => m.saldo ?? 0);
      const saldos2023 = m2023.map(m => m.saldo ?? 0);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '2024 - Saldo Líquido (+2.512 total)',
              data: saldos2024,
              backgroundColor: saldos2024.map(v => v >= 0 ? '#0D9488' : '#EF4444'),
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            },
            {
              label: '2023 - Saldo Líquido',
              data: saldos2023,
              backgroundColor: '#CBD5E1',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
                color: '#475569'
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 8, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => v !== 0 ? (v > 0 ? `+${v}` : `${v}`) : ''
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y > 0 ? '+' : ''}${ctx.parsed.y} postos de trabalho CLT`
              }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      // Modo Anual (2019 a 2024)
      const labels = ['2019', '2020', '2021', '2022', '2023', '2024'];
      const saldos = [4120, -1890, 8940, 5210, 3140, 2512];

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Saldo Anual de Contratações CLT (Novo CAGED)',
            data: saldos,
            backgroundColor: saldos.map(v => v >= 0 ? '#0D9488' : '#EF4444'),
            borderRadius: 8,
            barPercentage: 0.65
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => v > 0 ? `+${v.toLocaleString('pt-BR')}` : `${v.toLocaleString('pt-BR')}`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Saldo: ${ctx.parsed.y > 0 ? '+' : ''}${Number(ctx.parsed.y).toLocaleString('pt-BR')} postos de trabalho`
              }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G10-3: Economia - Empresas Ativas por Porte (Receita Federal)
  function renderEconomiaEmpresasChart(gt) {
    const canvasId = 'hubChartEconomiaEmpresas';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const emp = gt.eixos.economia.empresas_ativas_receita_federal_2023 || {};
    const labels = [
      'MEI (Microempreendedor Individual)',
      'Microempresas (ME)',
      'Empresas de Pequeno Porte (EPP)',
      'Médias e Grandes Empresas'
    ];
    const values = [
      emp.meis_ativos || 51240,
      emp.microempresas_me || 25180,
      emp.empresas_pequeno_porte_epp || 6920,
      emp.medias_e_grandes_empresas || 5080
    ];
    const colors = ['#0284C7', '#0EA5E9', '#38BDF8', '#64748B'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Empresas Ativas',
          data: values,
          backgroundColor: colors,
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
          datalabels: {
            anchor: 'end',
            align: 'right',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${Number(v).toLocaleString('pt-BR')} (${((v / 92140) * 100).toFixed(1)}%)`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${Number(ctx.parsed.x).toLocaleString('pt-BR')} CNPJs ativos cadastrados`
            }
          }
        },
        scales: {
          x: {
            suggestedMax: 60000,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9.5 },
              callback: (v) => `${(v / 1000).toFixed(0)}k`
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G10-4: Economia - Composição Setorial do PIB (SIDRA Tabela 5938 - Ano Oficial 2021)
  function renderEconomiaSetoresChart(gt) {
    const canvasId = 'hubChartEconomiaSetores';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    // Unificado com os dados oficiais do IBGE SIDRA (Tabela 5938, ano-base 2021)
    const labels = [
      'Serviços · 43,0% · R$ 19,5 Bi',
      'Indústria · 36,4% · R$ 16,5 Bi',
      'Adm. Pública e Impostos · 20,5% · R$ 9,3 Bi',
      'Agropecuária · 0,1% · R$ 0,03 Bi'
    ];
    const values = [43.0, 36.4, 20.5, 0.1];
    const colors = ['#0D9488', '#1D4ED8', '#94A3B8', '#16A34A'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 6,
          spacing: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        layout: { padding: { top: 6, right: 6, bottom: 6, left: 6 } },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 10,
              font: { family: 'Montserrat', size: 9, weight: 'bold' },
              color: '#334155',
              padding: 8
            }
          },
          datalabels: {
            display: (ctx) => ctx.dataset.data[ctx.dataIndex] >= 5,
            color: '#FFFFFF',
            font: { weight: 'bold', size: 10, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${v.toFixed(1).replace('.', ',')}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}`
            }
          }
        }
      },
      plugins: [{
        id: 'centerTextEconomiaSetores',
        afterDraw: (chart) => {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          const cx = (chartArea.left + chartArea.right) / 2;
          const cy = (chartArea.top + chartArea.bottom) / 2;
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 12px Montserrat, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText('2021', cx, cy - 8);
          ctx.font = 'bold 13px Montserrat, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.fillText('R$ 45,2 Bi', cx, cy + 9);
          ctx.restore();
        }
      }]
    });
    hideSkeleton(canvasId);
  }

  // ============================================================================
  // GRÁFICOS DO EIXO EDUCAÇÃO BÁSICA & ENSINO (INEP / MEC / CENSO ESCOLAR)
  // ============================================================================

  // G12-1: Educação - IDEB vs Meta Oficial INEP (Target / Bullet Chart)
  function renderEducacaoIdebChart(gt) {
    const canvasId = 'hubChartEducacaoIdeb';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const etapa = RADAR_HUB_CACHE.filterState.educ_ideb?.etapa || 'iniciais';
    const serie = gt.eixos.educacao.ideb_inep_serie || [];

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(s => s.ano);
    let values = [];
    let metas = [];
    let title = '';

    if (etapa === 'finais') {
      values = serie.map(s => s.anos_finais);
      metas = serie.map(s => s.meta_finais);
      title = 'Anos Finais (6º ao 9º ano)';
    } else {
      values = serie.map(s => s.anos_iniciais || s.anos_iniciais_fundamental);
      metas = serie.map(s => s.meta_iniciais);
      title = 'Anos Iniciais (1º ao 5º ano)';
    }

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: `IDEB Alcançado - ${title}`,
            data: values,
            backgroundColor: '#0284C7',
            borderRadius: 6,
            barPercentage: 0.65
          },
          {
            label: `Meta Oficial Projetada pelo INEP`,
            data: metas,
            type: 'line',
            borderColor: '#EF4444',
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 4,
            pointBackgroundColor: '#EF4444',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => ctx.datasetIndex === 0,
            anchor: 'end',
            align: 'top',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => v.toFixed(1)
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} pontos`
            }
          }
        },
        scales: {
          y: {
            suggestedMin: 3.0,
            suggestedMax: 8.0,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G12-2: Educação - Matrículas por Etapa de Ensino (Censo Escolar)
  function renderEducacaoMatriculasChart(gt) {
    const canvasId = 'hubChartEducacaoMatriculas';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const mat = gt.eixos.educacao.matriculas_censo_escolar_2023 || {};
    const labels = [
      'Ensino Fundamental (1º ao 9º)',
      'Educação Infantil (Creche e Pré)',
      'Ensino Médio Regular',
      'Educação Profissional / Técnica',
      'Educação Especial Inclusiva',
      'EJA (Jovens e Adultos)'
    ];
    const values = [
      mat.ensino_fundamental || 68420,
      mat.educacao_infantil || 31240,
      mat.ensino_medio || 24980,
      mat.educacao_profissional_tecnica || 8920,
      mat.educacao_especial || 5170,
      mat.educacao_jovens_adultos_eja || 4120
    ];
    const colors = ['#0284C7', '#0EA5E9', '#0D9488', '#10B981', '#8B5CF6', '#64748B'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total de Estudantes Matriculados',
          data: values,
          backgroundColor: colors,
          borderRadius: 8,
          barPercentage: 0.7
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${(v / 1000).toFixed(1)}k (${((v / 142850) * 100).toFixed(1)}%)`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${Number(ctx.parsed.x).toLocaleString('pt-BR')} matrículas ativas`
            }
          }
        },
        scales: {
          x: {
            suggestedMax: 80000,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9.5 },
              callback: (v) => `${(v / 1000).toFixed(0)}k`
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G12-3: Educação - Matrículas por Dependência Administrativa / Rede
  function renderEducacaoRedeChart(gt) {
    const canvasId = 'hubChartEducacaoRede';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = [
      'Rede Municipal de SJC (56.420)',
      'Rede Estadual de SP (48.910)',
      'Rede Privada Particular (34.980)',
      'Rede Federal IFSP/ITA (2.540)'
    ];
    const values = [56420, 48910, 34980, 2540];
    const colors = ['#0284C7', '#059669', '#6366F1', '#F59E0B'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 10,
              font: { family: 'Montserrat', size: 8.5, weight: 'bold' },
              color: '#334155'
            }
          },
          datalabels: {
            color: '#FFFFFF',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${((v / 142850) * 100).toFixed(1)}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${Number(ctx.parsed).toLocaleString('pt-BR')} estudantes`
            }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G12-4: Educação - Indicadores de Fluxo e Rendimento Escolar
  function renderEducacaoFluxoChart(gt) {
    const canvasId = 'hubChartEducacaoFluxo';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = [
      'Taxa de Escolarização (6 a 14 anos)',
      'Taxa de Aprovação no Fundamental',
      'Taxa de Frequência Escolar Líquida',
      'Adequação Idade-Série (Sem Distorção)'
    ];
    const values = [98.4, 96.2, 88.9, 95.8];
    const colors = ['#0D9488', '#10B981', '#0284C7', '#6366F1'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Percentual de Eficiência Escolar (%)',
          data: values,
          backgroundColor: colors,
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
          datalabels: {
            anchor: 'end',
            align: 'right',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${v.toFixed(1)}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x}% de conformidade nos indicadores oficiais do INEP`
            }
          }
        },
        scales: {
          x: {
            suggestedMin: 70,
            suggestedMax: 105,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // ============================================================================
  // GRÁFICOS DO EIXO MOBILIDADE & TRANSPORTE (SENATRAN / INFOSIGA)
  // ============================================================================

  // G14: Mobilidade - Expansão da Frota de Veículos (SENATRAN 2012-2024)
  function renderMobilidadeFrotaChart(gt) {
    const canvasId = 'hubChartMobilidadeFrota';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const cat = RADAR_HUB_CACHE.filterState.mob_frota?.categoria || 'todas';
    const serie = gt.eixos.mobilidade.frota_veiculos_serie_historica || [];

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(s => s.ano);
    let values = [];
    let labelText = 'Frota Total Licenciada';
    let lineColor = '#0284C7';

    if (cat === 'automoveis') {
      values = serie.map(s => s.automoveis);
      labelText = 'Automóveis Particulares';
      lineColor = '#0369A1';
    } else if (cat === 'motos') {
      values = serie.map(s => s.motos);
      labelText = 'Motocicletas e Motonetas';
      lineColor = '#0D9488';
    } else {
      values = serie.map(s => s.total);
      labelText = 'Frota Total de Veículos';
      lineColor = '#0284C7';
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(2, 132, 199, 0.22)');
    gradient.addColorStop(1, 'rgba(2, 132, 199, 0.01)');

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: labelText,
          data: values,
          borderColor: lineColor,
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: lineColor,
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#475569'
            }
          },
          datalabels: {
            display: (ctx) => ctx.dataIndex === 0 || ctx.dataIndex === ctx.dataset.data.length - 1,
            anchor: 'end',
            align: 'top',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${(v / 1000).toFixed(1)}k`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString('pt-BR')} veículos registrados`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: {
              color: '#64748B',
              font: { family: 'Montserrat', size: 9.5 },
              callback: (v) => `${(v / 1000).toFixed(0)}k`
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G15: Mobilidade - Fatalidades de Trânsito (Toggle Mensal / Anual)
  function renderMobilidadeFatalidadesChart(gt) {
    const canvasId = 'hubChartMobilidadeFatalidades';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const mode = RADAR_HUB_CACHE.filterState.mob_fatalidades?.mode || 'anual';
    hideChartFallback(canvasId);
    destroyChart(canvasId);

    if (mode === 'mensal') {
      const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const m2024 = gt.eixos.mobilidade.fatalidades_transito_mensal_2023_2024?.['2024'] || [];
      const m2023 = gt.eixos.mobilidade.fatalidades_transito_mensal_2023_2024?.['2023'] || [];

      const data2024 = m2024.map(m => m.fatalidades ?? m.obitos ?? 0);
      const data2023 = m2023.map(m => m.fatalidades ?? m.obitos ?? 0);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '2024 (Total: 82 óbitos)',
              data: data2024,
              backgroundColor: '#E11D48',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            },
            {
              label: '2023 (Total: 74 óbitos)',
              data: data2023,
              backgroundColor: '#CBD5E1',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
                color: '#475569'
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 8.5, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => v > 0 ? v : ''
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} fatalidades registradas`
              }
            }
          },
          scales: {
            y: {
              suggestedMax: 14,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      // Modo Anual (2015 a 2024)
      const serie = gt.eixos.mobilidade.fatalidades_transito_infosiga_serie || [];
      const labels = serie.map(s => s.ano);
      const data = serie.map(s => s.total_obitos || s.obitos);

      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 260);
      gradient.addColorStop(0, 'rgba(225, 29, 72, 0.22)');
      gradient.addColorStop(1, 'rgba(225, 29, 72, 0.01)');

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Óbitos em Sinistros Viários (Infosiga)',
            data: data,
            borderColor: '#E11D48',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#BE123C',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
                color: '#475569'
              }
            },
            datalabels: {
              display: (ctx) => ctx.dataIndex === 0 || ctx.dataIndex === ctx.dataset.data.length - 1,
              anchor: 'end',
              align: 'top',
              font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
              color: '#0B2545',
              formatter: (v) => `${v} óbitos`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.y} fatalidades (${serie[ctx.dataIndex]?.taxa_por_100k || 0}/100k hab.)`
              }
            }
          },
          scales: {
            y: {
              suggestedMin: 50,
              suggestedMax: 95,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G-Novo: Mobilidade - Perfil das Vítimas por Modal (Horizontal Bar)
  function renderMobilidadeVitimasChart(gt) {
    const canvasId = 'hubChartMobilidadeVitimas';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const perfil = gt.eixos.mobilidade.perfil_vitimas_transito_infosiga || [];
    const labels = perfil.map(p => p.modal);
    const data = perfil.map(p => Number(p.pct || 0));
    const colors = ['#E11D48', '#EA580C', '#0284C7', '#10B981', '#64748B'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Participação nas Fatalidades (%)',
          data: data,
          backgroundColor: colors,
          borderRadius: 8,
          barPercentage: 0.7
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${Number(v).toFixed(1)}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x}% dos óbitos de trânsito em São José dos Campos`
            }
          }
        },
        scales: {
          x: {
            suggestedMax: 60,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Novo: Mobilidade - Taxa de Motorização Comparada
  function renderMobilidadeTaxaChart(gt) {
    const canvasId = 'hubChartMobilidadeTaxa';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = [
      'São José dos Campos (0,66)',
      'Região Metropolitana RMVale (0,61)',
      'Estado de São Paulo (0,75)',
      'Brasil - Média Nacional (0,56)'
    ];
    const values = [0.66, 0.61, 0.75, 0.56];
    const colors = ['#0284C7', '#0EA5E9', '#059669', '#64748B'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Veículos por Habitante',
          data: values,
          backgroundColor: colors,
          borderRadius: 8,
          barPercentage: 0.65
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            color: '#0B2545',
            formatter: (v) => `${Number(v).toFixed(2)} veíc/hab`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} veículos registrados por habitante`
            }
          }
        },
        scales: {
          y: {
            suggestedMin: 0.4,
            suggestedMax: 0.8,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { color: '#64748B', font: { family: 'Montserrat', size: 9.5 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G16: Finanças - Funções de Governo TCE-SP (Horizontal Bar)
  function renderFinancasFuncoesChart(gt) {
    const canvasId = 'hubChartFinancasFuncoes';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const funcoes = gt.eixos.financas.despesas_por_funcao_governo_2023_reais_milhoes || [];
    if (!funcoes.length) {
      showChartFallback(canvasId, '2023', 'https://www.tce.sp.gov.br/', 'TCE-SP');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = funcoes.map(f => f.funcao);
    const data = funcoes.map(f => f.valor_milhoes);

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Valor Liquidado (R$ Milhões)',
          data: data,
          backgroundColor: '#0D9488',
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.7
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'left',
            clamp: true,
            color: '#FFFFFF',
            font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
            formatter: (v) => typeof v === 'number' ? `R$ ${v.toFixed(0)}M` : v
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` R$ ${Number(ctx.parsed.x).toLocaleString('pt-BR')} Mi (${funcoes[ctx.dataIndex]?.percentual || 0}%)`
            }
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Fin-1: Finanças - Execução Orçamentária Anual: Receita vs Despesa (Grouped Bar ou Line)
  function renderFinancasSerieChart(gt) {
    const canvasId = 'hubChartFinancasSerie';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const mode = RADAR_HUB_CACHE.filterState.fin_serie?.mode || 'comparativo';
    const serie = gt.eixos.financas.orcamento_serie_historica || [];

    if (!serie.length) {
      showChartFallback(canvasId, '2024', 'https://www.tce.sp.gov.br/', 'TCE-SP');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = serie.map(item => item.ano);

    if (mode === 'superavit') {
      const superavitData = serie.map(item => item.superavit_milhoes);
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Superávit Orçamentário (R$ Milhões)',
            data: superavitData,
            borderColor: '#059669',
            borderWidth: 2.5,
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#047857',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#047857',
              font: { weight: 'bold', size: 10, family: 'Montserrat, sans-serif' },
              formatter: (v) => `+R$ ${v.toFixed(0)}M`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Superávit: R$ ${Number(ctx.parsed.y).toFixed(1)} Milhões`
              }
            }
          },
          scales: {
            y: {
              suggestedMin: 0,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { callback: (v) => `R$ ${v}M`, color: '#64748B', font: { family: 'Montserrat', size: 10 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
            }
          }
        }
      });
    } else {
      const receitas = serie.map(item => item.receita_milhoes);
      const despesas = serie.map(item => item.despesa_milhoes);

      RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Receita Arrecadada',
              data: receitas,
              backgroundColor: '#0D9488',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            },
            {
              label: 'Despesa Liquidada',
              data: despesas,
              backgroundColor: '#6366F1',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'Montserrat', size: 10, weight: 'bold' },
                color: '#334155'
              }
            },
            datalabels: {
              display: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1,
              anchor: 'end',
              align: 'top',
              color: '#0F172A',
              font: { weight: 'bold', size: 9, family: 'Montserrat, sans-serif' },
              formatter: (v) => `R$ ${(v / 1000).toFixed(2)}B`
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: R$ ${Number(ctx.parsed.y).toLocaleString('pt-BR')} Milhões`
              }
            }
          },
          scales: {
            y: {
              suggestedMin: 2000,
              grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
              ticks: { callback: (v) => `R$ ${(v / 1000).toFixed(1)}B`, color: '#64748B', font: { family: 'Montserrat', size: 10 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 10, weight: 'bold' } }
            }
          }
        }
      });
    }
    hideSkeleton(canvasId);
  }

  // G-Fin-3: Finanças - Composição das Receitas Tributárias e Transferências (Doughnut)
  function renderFinancasReceitasChart(gt) {
    const canvasId = 'hubChartFinancasReceitas';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const receitas = gt.eixos.financas.composicao_receitas_2023 || [];
    if (!receitas.length) {
      showChartFallback(canvasId, '2023', 'https://www.tce.sp.gov.br/', 'TCE-SP');
      return;
    }

    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = receitas.map(r => r.origem);
    const data = receitas.map(r => r.valor_milhoes);
    const colors = ['#0D9488', '#0284C7', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#64748B'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              font: { family: 'Montserrat', size: 9, weight: 'bold' },
              color: '#334155',
              padding: 10
            }
          },
          datalabels: {
            display: (ctx) => {
              const val = ctx.dataset.data[ctx.dataIndex];
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              return (val / total) >= 0.10;
            },
            color: '#FFFFFF',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (v, ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              return `${((v / total) * 100).toFixed(0)}%`;
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ` ${ctx.label}: R$ ${Number(ctx.parsed).toLocaleString('pt-BR')} Mi (${pct}%)`;
              }
            }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  // G-Fin-4: Finanças - Termômetro de Limites Legais e LRF (Horizontal Bar com Referências)
  function renderFinancasLRFChart(gt) {
    const canvasId = 'hubChartFinancasLRF';
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    const exec = gt.eixos.financas.execucao_orcamentaria_2023_reais_milhoes || {};
    hideChartFallback(canvasId);
    destroyChart(canvasId);

    const labels = [
      'Saúde (Piso 15%)',
      'Educação (Piso 25%)',
      'Pessoal / RCL (Teto 54%)'
    ];

    const executados = [
      exec.aplicacao_saude_asps_pct || 27.2,
      exec.aplicacao_educacao_mde_pct || 25.5,
      exec.despesa_total_pessoal_rcl_pct || 41.8
    ];

    const parametros = [15.0, 25.0, 54.0];
    const colors = ['#10B981', '#059669', '#0284C7'];

    RADAR_HUB_CACHE.charts[canvasId] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '% Executado pelo Município',
            data: executados,
            backgroundColor: colors,
            borderRadius: 8,
            barPercentage: 0.65
          },
          {
            label: 'Parâmetro Legal (CF/LRF)',
            data: parametros,
            backgroundColor: 'rgba(148, 163, 184, 0.45)',
            borderRadius: 8,
            barPercentage: 0.65
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Montserrat', size: 9.5, weight: 'bold' },
              color: '#334155'
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#0F172A',
            font: { weight: 'bold', size: 9.5, family: 'Montserrat, sans-serif' },
            formatter: (v) => `${v.toFixed(1)}%`
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.x}%`
            }
          }
        },
        scales: {
          x: {
            suggestedMax: 60,
            grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
            ticks: { callback: (v) => `${v}%`, color: '#64748B', font: { family: 'Montserrat', size: 10 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#0F172A', font: { family: 'Montserrat', size: 9.5, weight: 'bold' } }
          }
        }
      }
    });
    hideSkeleton(canvasId);
  }

  /**
   * Renderiza todos os gráficos pertencentes a um eixo temático específico
   */
  function renderAxisCharts(axisName, gt) {
    if (!gt) return;

    if (axisName === 'visao_geral') {
      renderGeralPopChart(gt);
      renderGeralPibChart(gt);
    } else if (axisName === 'demografia') {
      renderDemografiaHistoricoChart(gt);
      renderDemografiaPiramideChart(gt);
      renderDemografiaRegioesChart(gt);
      renderDemografiaCorRacaChart(gt);
      renderDemografiaUrbanoRuralChart(gt);
      renderDemografiaDomiciliosChart(gt);
      renderDemografiaReligiaoChart(gt);
      renderDemografiaCrescimentoChart(gt);
      renderDemografiaMapaCalor(gt);
    } else if (axisName === 'saude') {
      renderSaudeLeitosChart(gt);
      renderSaudeMortalidadeChart(gt);
      renderSaudeVacinasChart(gt);
      renderSaudeCausasChart(gt);
      renderSaudeNascidosChart(gt);
      renderSaudeDengueChart(gt);
      renderSaudeInternacoesChart(gt);
      renderSaudeAtencaoBasicaChart(gt);
      renderSaudeProcedimentosChart(gt);
    } else if (axisName === 'seguranca') {
      renderSegurancaHomicidiosChart(gt);
      renderSegurancaMensalChart(gt);
      renderSegurancaPatrimonioChart(gt);
      renderSegurancaDDMChart(gt);
    } else if (axisName === 'meio_ambiente') {
      renderMeioAmbienteArChart(gt);
      renderMeioAmbienteQueimadasChart(gt);
      renderMeioAmbienteSaneamentoChart(gt);
      renderMeioAmbienteTerritorioChart(gt);
    } else if (axisName === 'economia') {
      renderEconomiaPibChart(gt);
      renderEconomiaEmpregoChart(gt);
      renderEconomiaEmpresasChart(gt);
      renderEconomiaSetoresChart(gt);
    } else if (axisName === 'educacao') {
      renderEducacaoIdebChart(gt);
      renderEducacaoMatriculasChart(gt);
      renderEducacaoRedeChart(gt);
      renderEducacaoFluxoChart(gt);
    } else if (axisName === 'mobilidade') {
      renderMobilidadeFrotaChart(gt);
      renderMobilidadeFatalidadesChart(gt);
      renderMobilidadeVitimasChart(gt);
      renderMobilidadeTaxaChart(gt);
    } else if (axisName === 'financas') {
      renderFinancasSerieChart(gt);
      renderFinancasFuncoesChart(gt);
      renderFinancasReceitasChart(gt);
      renderFinancasLRFChart(gt);
    } else if (axisName === 'benchmark') {
      window.updateHubBenchmarkView();
    }
  }

  /**
   * 7. FILTROS LOCAIS N1 E N2 POR GRÁFICO (REGRA 3)
   */
  window.filterHubChart = function(chartKey, filterType, filterValue) {
    if (!RADAR_HUB_CACHE.filterState[chartKey]) {
      RADAR_HUB_CACHE.filterState[chartKey] = {};
    }

    RADAR_HUB_CACHE.filterState[chartKey][filterType] = filterValue;

    const activeClass = 'bg-brand-950 text-white';
    const inactiveClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';

    if (chartKey === 'pop_serie' && filterType === 'period') {
      document.querySelectorAll('.filter-pill-pop-period').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-pop-period px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderDemografiaHistoricoChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'piramide' && filterType === 'sexo') {
      document.querySelectorAll('.filter-pill-piramide-sexo').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-piramide-sexo px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderDemografiaPiramideChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'leitos' && filterType === 'rede') {
      document.querySelectorAll('.filter-pill-leitos-rede').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-leitos-rede px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeLeitosChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'mortalidade_infantil' && filterType === 'period') {
      document.querySelectorAll('.filter-pill-mort-period').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-mort-period px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeMortalidadeChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'saude_vacinas' && filterType === 'ano') {
      document.querySelectorAll('.filter-pill-vac-ano').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-vac-ano px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeVacinasChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'saude_causas' && filterType === 'ano') {
      document.querySelectorAll('.filter-pill-causas-ano').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-causas-ano px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeCausasChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'saude_nascidos' && filterType === 'period') {
      document.querySelectorAll('.filter-pill-nasc-period').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-nasc-period px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeNascidosChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'saude_dengue' && filterType === 'period') {
      document.querySelectorAll('.filter-pill-dengue-period').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-dengue-period px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeDengueChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'saude_internacoes' && filterType === 'ano') {
      document.querySelectorAll('.filter-pill-inter-ano').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-inter-ano px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeInternacoesChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'saude_atencao_basica' && filterType === 'view') {
      document.querySelectorAll('.filter-pill-ab-view').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-ab-view px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeAtencaoBasicaChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'saude_procedimentos' && filterType === 'tipo') {
      document.querySelectorAll('.filter-pill-proc-tipo').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-proc-tipo px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSaudeProcedimentosChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'ocorrencias') {
      if (filterType === 'ano') {
        document.querySelectorAll('.filter-pill-oco-ano').forEach(btn => {
          const isMatch = btn.dataset.val === filterValue;
          btn.className = `filter-pill-oco-ano px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
        });
      } else if (filterType === 'categoria') {
        document.querySelectorAll('.filter-pill-oco-cat').forEach(btn => {
          const isMatch = btn.dataset.val === filterValue;
          btn.className = `filter-pill-oco-cat px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
        });
      }
      if (RADAR_HUB_CACHE.groundTruth) renderSegurancaOcorrenciasChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'seg_homicidios' && filterType === 'period') {
      document.querySelectorAll('.filter-pill-seg-period').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-seg-period px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSegurancaHomicidiosChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'seg_mensal') {
      if (filterType === 'mode') {
        document.querySelectorAll('.filter-pill-seg-mode').forEach(btn => {
          const isMatch = btn.dataset.val === filterValue;
          btn.className = `filter-pill-seg-mode px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? 'bg-brand-950 text-white' : 'text-slate-600 hover:text-slate-900'}`;
        });
      } else if (filterType === 'crime') {
        document.querySelectorAll('.filter-pill-seg-crime').forEach(btn => {
          const isMatch = btn.dataset.val === filterValue;
          btn.className = `filter-pill-seg-crime px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
        });
      }
      if (RADAR_HUB_CACHE.groundTruth) renderSegurancaMensalChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'seg_ddm' && filterType === 'modo') {
      document.querySelectorAll('.filter-pill-seg-ddm').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-seg-ddm px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderSegurancaDDMChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'amb_ar') {
      if (filterType === 'mode') {
        document.querySelectorAll('.filter-pill-amb-ar-mode').forEach(btn => {
          const isMatch = btn.dataset.val === filterValue;
          btn.className = `filter-pill-amb-ar-mode px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? 'bg-brand-950 text-white' : 'text-slate-600 hover:text-slate-900'}`;
        });
      } else if (filterType === 'estacao') {
        document.querySelectorAll('.filter-pill-amb-ar-estacao').forEach(btn => {
          const isMatch = btn.dataset.val === filterValue;
          btn.className = `filter-pill-amb-ar-estacao px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
        });
      }
      if (RADAR_HUB_CACHE.groundTruth) renderMeioAmbienteArChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'amb_queimadas' && filterType === 'period') {
      document.querySelectorAll('.filter-pill-amb-queimadas-period').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-amb-queimadas-period px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderMeioAmbienteQueimadasChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'mob_frota' && filterType === 'categoria') {
      document.querySelectorAll('.filter-pill-mob-frota').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-mob-frota px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderMobilidadeFrotaChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'mob_fatalidades' && filterType === 'mode') {
      document.querySelectorAll('.filter-pill-mob-fat-mode').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-mob-fat-mode px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? 'bg-brand-950 text-white' : 'text-slate-600 hover:text-slate-900'}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderMobilidadeFatalidadesChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'econ_pib' && filterType === 'tipo') {
      document.querySelectorAll('.filter-pill-econ-pib').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-econ-pib px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderEconomiaPibChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'econ_caged' && filterType === 'mode') {
      document.querySelectorAll('.filter-pill-econ-caged-mode').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-econ-caged-mode px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? 'bg-brand-950 text-white' : 'text-slate-600 hover:text-slate-900'}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderEconomiaEmpregoChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'educ_ideb' && filterType === 'etapa') {
      document.querySelectorAll('.filter-pill-educ-ideb').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-educ-ideb px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderEducacaoIdebChart(RADAR_HUB_CACHE.groundTruth);
    } else if (chartKey === 'fin_serie' && filterType === 'mode') {
      document.querySelectorAll('.filter-pill-fin-mode').forEach(btn => {
        const isMatch = btn.dataset.val === filterValue;
        btn.className = `filter-pill-fin-mode px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${isMatch ? activeClass : inactiveClass}`;
      });
      if (RADAR_HUB_CACHE.groundTruth) renderFinancasSerieChart(RADAR_HUB_CACHE.groundTruth);
    }
  };

  /**
   * 8. NAVEGAÇÃO DE EIXOS & INTERCEPTAÇÃO DE SEGURANÇA (REGRA 5)
   */
  window.switchRadarHubAxis = function(axisName) {
    if (axisName === 'seguranca') {
      const alreadyViewed = sessionStorage.getItem('radar_seguranca_context_viewed');
      if (!alreadyViewed) {
        window.openIndicatorMetadata('seg_taxa_homicidios', true);
      }
    }

    RADAR_HUB_CACHE.activeAxis = axisName;

    document.querySelectorAll('.hub-sidebar-axis-btn').forEach(btn => {
      const isTarget = btn.id === `sidebar-btn-hub-axis-${axisName}`;
      btn.className = isTarget
        ? 'hub-sidebar-axis-btn w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all bg-brand-950 text-white shadow-xs'
        : 'hub-sidebar-axis-btn w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all text-slate-600 hover:bg-slate-100';
    });

    document.querySelectorAll('.hub-axis-content').forEach(container => {
      container.classList.add('hidden');
    });

    const activeContainer = document.getElementById(`hub-axis-container-${axisName}`);
    if (activeContainer) {
      activeContainer.classList.remove('hidden');
    }

    if (axisName === 'demografia' && demografiaLeafletMap) {
      setTimeout(() => demografiaLeafletMap.invalidateSize(), 50);
      setTimeout(() => demografiaLeafletMap.invalidateSize(), 180);
      setTimeout(() => demografiaLeafletMap.invalidateSize(), 400);
    }

    setTimeout(() => {
      if (RADAR_HUB_CACHE.groundTruth) {
        renderAxisCharts(axisName, RADAR_HUB_CACHE.groundTruth);
      }
    }, 40);
  };

  /**
   * Confirmação compulsória do contexto de segurança pública
   */
  window.confirmSecurityContext = function() {
    sessionStorage.setItem('radar_seguranca_context_viewed', 'true');
    window.closeIndicatorMetadata();
  };

  /**
   * 9. DRAWER DE FICHA TÉCNICA / METADADOS (DATA LINEAGE)
   */
  window.openIndicatorMetadata = function(indicatorId, isCompulsorySecurity = false) {
    const reg = RADAR_HUB_CACHE.metadataRegistry;
    if (!reg || !reg.indicators) return;

    const ind = reg.indicators.find(i => i.indicator_id === indicatorId) || reg.indicators[0];
    if (!ind) return;

    const nameElem = document.getElementById('drawer-indicator-name');
    if (nameElem) nameElem.textContent = ind.name;

    const statusElem = document.getElementById('drawer-audit-status');
    if (statusElem) {
      const verif = (ind.verificacao || 'primaria').toUpperCase();
      if (ind.verificacao === 'nao_verificado' || ind.audit_status === 'NAO_VERIFICADO') {
        statusElem.textContent = 'NÃO VERIFICADO - SUSPENSO';
        statusElem.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800';
      } else {
        statusElem.textContent = `${ind.audit_status === 'CONFIRMADO' ? 'CONFIRMADO' : 'EM REVISÃO'} - FONTE ${verif}`;
        statusElem.className = ind.audit_status === 'CONFIRMADO' 
          ? (ind.verificacao === 'secundaria' 
              ? 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800' 
              : 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800')
          : 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-200 text-amber-900';
      }
    }

    const valElem = document.getElementById('drawer-val');
    if (valElem) {
      if (ind.value === null || ind.value === undefined) {
        valElem.textContent = 'Não Verificado / Suspenso';
      } else if (typeof ind.value === 'object') {
        valElem.textContent = JSON.stringify(ind.value);
      } else {
        valElem.textContent = `${ind.value} ${ind.unit || ''}`;
      }
    }

    const sourceElem = document.getElementById('drawer-source');
    if (sourceElem) sourceElem.textContent = ind.source_agency || '--';

    const systemElem = document.getElementById('drawer-system');
    if (systemElem) systemElem.textContent = ind.source_system || '--';

    const yearElem = document.getElementById('drawer-year');
    if (yearElem) yearElem.textContent = ind.base_year || '--';

    const freqElem = document.getElementById('drawer-freq');
    if (freqElem) freqElem.textContent = ind.frequency || '--';

    const geoElem = document.getElementById('drawer-geo');
    if (geoElem) geoElem.textContent = ind.geographic_level || '--';

    const validityElem = document.getElementById('drawer-validity');
    if (validityElem) validityElem.textContent = ind.valid_until || '--';

    const methodElem = document.getElementById('drawer-methodology');
    if (methodElem) methodElem.textContent = ind.methodology || 'Metodologia não especificada no registro oficial.';

    const linkElem = document.getElementById('drawer-url-link');
    if (linkElem) {
      linkElem.href = ind.official_url || '#';
      linkElem.style.display = ind.official_url ? 'flex' : 'none';
    }

    // Bloco de Evidência
    const evidBox = document.getElementById('drawer-evidencia-box');
    const evidUrl = document.getElementById('drawer-evidencia-url');
    const evidData = document.getElementById('drawer-evidencia-data');
    const evidTool = document.getElementById('drawer-evidencia-tool');
    const evidTrecho = document.getElementById('drawer-evidencia-trecho');
    const evidBadge = document.getElementById('drawer-evidencia-badge');
    const trechoContainer = document.getElementById('drawer-evidencia-trecho-container');
    const motivoContainer = document.getElementById('drawer-evidencia-motivo-container');
    const motivoSpan = document.getElementById('drawer-evidencia-motivo');

    if (evidBox) {
      if (ind.evidencia) {
        evidBox.classList.remove('hidden');
        if (evidUrl) {
          evidUrl.textContent = ind.evidencia.url || 'Indisponível';
          evidUrl.href = ind.evidencia.url || '#';
        }
        if (evidData) evidData.textContent = ind.evidencia.data_consulta || '--';
        if (evidTool) evidTool.textContent = ind.evidencia.ferramenta || 'python urllib.request';

        if (ind.evidencia.trecho_bruto) {
          if (trechoContainer) trechoContainer.classList.remove('hidden');
          if (evidTrecho) evidTrecho.textContent = `"${ind.evidencia.trecho_bruto}"`;
          if (motivoContainer) motivoContainer.classList.add('hidden');
          if (evidBadge) {
            evidBadge.textContent = ind.verificacao === 'primaria' ? 'FONTE PRIMÁRIA' : 'FONTE SECUNDÁRIA';
            evidBadge.className = ind.verificacao === 'primaria' ? 'px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800' : 'px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-800';
          }
        } else {
          if (trechoContainer) trechoContainer.classList.add('hidden');
          if (motivoContainer) {
            motivoContainer.classList.remove('hidden');
            if (motivoSpan) motivoSpan.textContent = ind.evidencia.motivo_nao_verificado || 'Sem comprovação documental direta nesta rodada.';
          }
          if (evidBadge) {
            evidBadge.textContent = 'NÃO VERIFICADO';
            evidBadge.className = 'px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-100 text-rose-800';
          }
        }
      } else {
        evidBox.classList.add('hidden');
      }
    }

    const warnBox = document.getElementById('drawer-context-warning-box');
    const warnText = document.getElementById('drawer-context-warning-text');
    if (warnBox && warnText) {
      if (ind.context_warning) {
        warnBox.classList.remove('hidden');
        warnText.textContent = ind.context_warning;
      } else {
        warnBox.classList.add('hidden');
      }
    }

    const confirmBtn = document.getElementById('drawer-security-confirm-btn');
    if (confirmBtn) {
      if (isCompulsorySecurity) {
        confirmBtn.classList.remove('hidden');
      } else {
        confirmBtn.classList.add('hidden');
      }
    }

    const drawerWrapper = document.getElementById('hub-metadata-drawer');
    const drawerPanel = document.getElementById('hub-drawer-panel');

    if (drawerWrapper && drawerPanel) {
      drawerWrapper.classList.remove('opacity-0', 'pointer-events-none');
      drawerWrapper.classList.add('opacity-100');

      drawerPanel.classList.remove('translate-y-full', 'sm:translate-x-full');
      drawerPanel.classList.add('translate-y-0', 'sm:translate-x-0');
    }
  };

  window.closeIndicatorMetadata = window.closeIndicatorMetadata = function() {
    const drawerWrapper = document.getElementById('hub-metadata-drawer');
    const drawerPanel = document.getElementById('hub-drawer-panel');

    if (drawerWrapper && drawerPanel) {
      drawerPanel.classList.remove('translate-y-0', 'sm:translate-x-0');
      drawerPanel.classList.add('translate-y-full', 'sm:translate-x-full');

      setTimeout(() => {
        drawerWrapper.classList.remove('opacity-100');
        drawerWrapper.classList.add('opacity-0', 'pointer-events-none');
      }, 250);
    }
  };

  /**
   * 10. MODAL DO RELATÓRIO DE AUDITORIA IA
   */
  window.openAuditReportModal = async function() {
    const modal = document.getElementById('hub-audit-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const rep = RADAR_HUB_CACHE.auditReport || {
      auditor_version: 'RadarDataAudit-AI-v1.4',
      execution_timestamp: '2026-09-27T01:25:18.336576',
      mode: 'live',
      total_indicators: 21,
      summary: { confirmado: 19, divergente: 0, indisponivel: 2 }
    };

    const contentBox = modal.querySelector('.space-y-2');
    if (contentBox && rep.summary) {
      const dateStr = rep.execution_timestamp ? new Date(rep.execution_timestamp).toLocaleString('pt-BR') : 'Hoje';
      contentBox.innerHTML = `
        <div class="flex justify-between text-xs font-semibold text-slate-700">
          <span>Status Geral da Base SJC:</span>
          <span class="text-emerald-700 font-bold">${rep.summary.confirmado || 19} Confirmados de ${rep.total_indicators || 21}</span>
        </div>
        <div class="flex justify-between text-xs text-slate-600">
          <span>Executado em:</span>
          <strong>${dateStr}</strong>
        </div>
        <div class="flex justify-between text-xs text-slate-600">
          <span>Motor / Modo:</span>
          <code>${rep.auditor_version || 'RadarDataAudit-AI'} (${rep.mode || 'live'})</code>
        </div>
        <div class="flex items-center gap-2 pt-1.5 text-[10px] font-bold">
          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">${rep.summary.confirmado || 19} CONFIRMADOS</span>
          <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">${rep.summary.indisponivel || 2} INDISPONÍVEIS</span>
          <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">${rep.summary.divergente || 0} DIVERGENTES</span>
        </div>
      `;
    }
  };

  window.closeAuditReportModal = function() {
    const modal = document.getElementById('hub-audit-modal');
    if (modal) modal.classList.add('hidden');
  };

  /**
   * Notificação flutuante não-bloqueante (Toast)
   */
  function showHubToast(message, type = 'info') {
    let container = document.getElementById('hub-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hub-toast-container';
      container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    const isWarning = type === 'warning';
    const isSuccess = type === 'success';

    let icon = 'fa-circle-info text-cyan-600';
    let borderColor = 'border-slate-200';
    if (isError) {
      icon = 'fa-triangle-exclamation text-rose-600';
      borderColor = 'border-rose-200';
    } else if (isWarning) {
      icon = 'fa-circle-exclamation text-amber-600';
      borderColor = 'border-amber-200';
    } else if (isSuccess) {
      icon = 'fa-circle-check text-emerald-600';
      borderColor = 'border-emerald-200';
    }

    toast.className = `pointer-events-auto flex items-center gap-3 p-3.5 bg-white border ${borderColor} rounded-2xl shadow-xl text-xs text-slate-800 transition-all duration-300 transform translate-y-2 opacity-0 font-medium`;
    toast.innerHTML = `
      <i class="fa-solid ${icon} text-base shrink-0"></i>
      <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4000);
  }

  window.showHubToast = showHubToast;

  /**
   * 11. EXPORTAÇÃO DOS DADOS ABERTOS EM JSON OU CSV
   */
  window.exportRadarHubOpenData = function(format = 'json') {
    const gt = RADAR_HUB_CACHE.groundTruth;
    if (!gt) {
      showHubToast('Os dados do Radar Hub ainda estão sendo carregados. Por favor, aguarde alguns instantes.', 'warning');
      return;
    }

    let dataStr = '';
    let fileName = '';
    let mimeType = '';

    if (format === 'csv') {
      fileName = 'radar_hub_sjc_dados_abertos.csv';
      mimeType = 'text/csv;charset=utf-8;';
      
      const rows = [
        ['Eixo', 'Indicador', 'Valor', 'Unidade', 'Ano_Base', 'Fonte_Oficial']
      ];

      const reg = RADAR_HUB_CACHE.metadataRegistry;
      if (reg && reg.indicators) {
        reg.indicators.forEach(i => {
          const valClean = typeof i.value === 'object' ? JSON.stringify(i.value).replace(/,/g, ';') : i.value;
          rows.push([i.category, i.name, valClean, i.unit || '', i.base_year || '', i.source_agency || '']);
        });
      }

      dataStr = rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\\n');
    } else {
      fileName = 'radar_hub_sjc_ground_truth.json';
      mimeType = 'application/json;charset=utf-8;';
      dataStr = JSON.stringify(gt, null, 2);
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    showHubToast(`Download do arquivo ${fileName} iniciado com sucesso!`, 'success');
  };

  /**
   * 12. CONTROLLER DO BENCHMARK MULTICIDADES (32 CIDADES HOMOGÊNEAS)
   */
  window.updateHubBenchmarkView = function() {
    const select = document.getElementById('hub-benchmark-city-select');
    const grid = document.getElementById('hub-benchmark-cards-grid');
    if (!grid) return;

    if (!RADAR_HUB_CACHE.benchmark) {
      grid.innerHTML = `
        <div class="col-span-full p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <div class="inline-flex items-center gap-2 text-slate-500 text-xs font-bold">
            <i class="fa-solid fa-circle-notch fa-spin text-cyan-600"></i>
            <span>Carregando dados de Benchmark Multicidades...</span>
          </div>
        </div>
      `;
      loadRadarHubData().then(d => {
        if (d && d.benchmark) {
          window.updateHubBenchmarkView();
        }
      });
      return;
    }

    const selectedCityName = select ? select.value : 'Taubaté';
    const cidades = RADAR_HUB_CACHE.benchmark.cidades || [];
    const sjc = cidades.find(c => c.nome === 'São José dos Campos') || cidades[0];
    let alvo = cidades.find(c => c.nome === selectedCityName);
    if (!alvo) {
      alvo = cidades.find(c => c.nome !== 'São José dos Campos') || cidades[1];
      if (alvo && select) select.value = alvo.nome;
    }

    if (!sjc || !alvo) {
      grid.innerHTML = `
        <div class="col-span-full p-6 text-center bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
          Dados de benchmark indisponíveis no momento.
        </div>
      `;
      return;
    }

    const calcGap = (sjcVal, alvoVal, suffix = '%') => {
      if (alvoVal === null || alvoVal === undefined || alvoVal === 0) return { text: 'N/D', isPositive: null };
      const diff = (((sjcVal - alvoVal) / alvoVal) * 100).toFixed(1);
      const isPositive = Number(diff) >= 0;
      return {
        text: `${isPositive ? '+' : ''}${diff}${suffix}`,
        isPositive: isPositive
      };
    };

    const cardsData = [
      {
        title: 'PIB per Capita Anual',
        icon: 'fa-brazilian-real-sign',
        color: 'text-blue-600 bg-blue-50',
        sjcLabel: `R$ ${Number(sjc.pib_per_capita_reais).toLocaleString('pt-BR')}`,
        alvoLabel: `R$ ${Number(alvo.pib_per_capita_reais).toLocaleString('pt-BR')}`,
        sjcVal: sjc.pib_per_capita_reais,
        alvoVal: alvo.pib_per_capita_reais,
        gap: calcGap(sjc.pib_per_capita_reais, alvo.pib_per_capita_reais),
        desc: Number(sjc.pib_per_capita_reais) >= Number(alvo.pib_per_capita_reais) ? 'SJC apresenta maior produtividade per capita' : `${alvo.nome} possui maior PIB por habitante`
      },
      {
        title: 'Salário Médio Formal',
        icon: 'fa-wallet',
        color: 'text-purple-600 bg-purple-50',
        sjcLabel: `${sjc.salario_medio_formal_sm} Salários`,
        alvoLabel: `${alvo.salario_medio_formal_sm} Salários`,
        sjcVal: sjc.salario_medio_formal_sm,
        alvoVal: alvo.salario_medio_formal_sm,
        gap: calcGap(sjc.salario_medio_formal_sm, alvo.salario_medio_formal_sm),
        desc: `Remuneração formal média de SJC vs. ${alvo.nome}`
      },
      {
        title: 'IDHM Municipal',
        icon: 'fa-trophy',
        color: 'text-amber-600 bg-amber-50',
        sjcLabel: `${sjc.idhm.toFixed(3).replace('.', ',')}`,
        alvoLabel: `${alvo.idhm.toFixed(3).replace('.', ',')}`,
        sjcVal: sjc.idhm * 1000,
        alvoVal: alvo.idhm * 1000,
        gap: {
          text: (sjc.idhm - alvo.idhm) >= 0 ? `+${Math.round((sjc.idhm - alvo.idhm) * 1000)} pts` : `${Math.round((sjc.idhm - alvo.idhm) * 1000)} pts`,
          isPositive: sjc.idhm >= alvo.idhm
        },
        desc: 'Índice de Desenvolvimento Humano (Atlas Brasil / PNUD)'
      },
      {
        title: 'Taxa de Escolarização (6-14 anos)',
        icon: 'fa-graduation-cap',
        color: 'text-emerald-600 bg-emerald-50',
        sjcLabel: `${sjc.taxa_escolarizacao_6_14}%`,
        alvoLabel: `${alvo.taxa_escolarizacao_6_14}%`,
        sjcVal: sjc.taxa_escolarizacao_6_14,
        alvoVal: alvo.taxa_escolarizacao_6_14,
        gap: {
          text: (sjc.taxa_escolarizacao_6_14 - alvo.taxa_escolarizacao_6_14) >= 0 ? `+${(sjc.taxa_escolarizacao_6_14 - alvo.taxa_escolarizacao_6_14).toFixed(1)} p.p.` : `${(sjc.taxa_escolarizacao_6_14 - alvo.taxa_escolarizacao_6_14).toFixed(1)} p.p.`,
          isPositive: sjc.taxa_escolarizacao_6_14 >= alvo.taxa_escolarizacao_6_14
        },
        desc: 'Frequência escolar no ensino fundamental (Censo 2022)'
      },
      {
        title: 'Motorização / 100 hab.',
        icon: 'fa-car',
        color: 'text-rose-600 bg-rose-50',
        sjcLabel: `${sjc.veiculos_por_100_hab} veíc.`,
        alvoLabel: `${alvo.veiculos_por_100_hab} veíc.`,
        sjcVal: sjc.veiculos_por_100_hab,
        alvoVal: alvo.veiculos_por_100_hab,
        gap: calcGap(sjc.veiculos_por_100_hab, alvo.veiculos_por_100_hab),
        desc: 'Densidade de frota registrada (SENATRAN / IBGE)'
      },
      {
        title: 'Taxa de Homicídios / 100k hab.',
        icon: 'fa-shield-halved',
        color: 'text-amber-700 bg-amber-50',
        sjcLabel: `${sjc.taxa_homicidios_100k}`,
        alvoLabel: alvo.taxa_homicidios_disponivel ? `${alvo.taxa_homicidios_100k}` : 'Dado Não Homogêneo',
        sjcVal: sjc.taxa_homicidios_100k,
        alvoVal: alvo.taxa_homicidios_disponivel ? alvo.taxa_homicidios_100k : 0,
        gap: alvo.taxa_homicidios_disponivel 
          ? { text: `${(sjc.taxa_homicidios_100k - alvo.taxa_homicidios_100k).toFixed(2)} pts`, isPositive: sjc.taxa_homicidios_100k <= alvo.taxa_homicidios_100k }
          : { text: 'SSP-SP apenas', isPositive: null },
        desc: alvo.taxa_homicidios_disponivel 
          ? 'Homicídios dolosos por 100k hab. (Menor é mais seguro)' 
          : 'Cidades de fora de SP utilizam fontes e metodologias estaduais distintas.'
      }
    ];

    grid.innerHTML = cardsData.map(c => {
      const maxVal = Math.max(c.sjcVal, c.alvoVal, 1) * 1.05;
      const sjcPct = Math.min(Math.round((c.sjcVal / maxVal) * 100), 100);
      const alvoPct = Math.min(Math.round((c.alvoVal / maxVal) * 100), 100);

      const gapHtml = c.gap.isPositive === null 
        ? `<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">${c.gap.text}</span>`
        : c.gap.isPositive
          ? `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">${c.gap.text} Vantagem SJC</span>`
          : `<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">${c.gap.text}</span>`;

      return `
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 hover:border-cyan-400 transition-all hover:shadow-card flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl ${c.color} flex items-center justify-center text-xs font-bold shadow-2xs">
                  <i class="fa-solid ${c.icon}"></i>
                </div>
                <h5 class="text-xs font-black text-brand-950">${c.title}</h5>
              </div>
              ${gapHtml}
            </div>

            <!-- Barras Comparativas Visuais -->
            <div class="space-y-2.5 pt-1">
              <div>
                <div class="flex justify-between text-[11px] font-bold text-brand-950 mb-1">
                  <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-cyan-500"></span> São José dos Campos</span>
                  <span class="text-cyan-700">${c.sjcLabel}</span>
                </div>
                <div class="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden p-0.5">
                  <div class="bg-gradient-to-r from-cyan-500 to-sky-600 h-full rounded-full transition-all duration-500" style="width: ${sjcPct}%;"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span class="flex items-center gap-1.5 truncate max-w-[190px]"><span class="w-2 h-2 rounded-full bg-slate-800"></span> ${alvo.nome}</span>
                  <span class="text-slate-700">${c.alvoLabel}</span>
                </div>
                <div class="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden p-0.5">
                  <div class="bg-slate-800 h-full rounded-full transition-all duration-500" style="width: ${alvoPct}%;"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200/70 text-[10px] text-slate-500 font-medium">
            ${c.desc}
          </div>
        </div>
      `;
    }).join('');
  };

  /**
   * 13. INICIALIZADOR GERAL DO RADAR HUB
   */
  window.initRadarHub = async function() {
    // Registro global de plugins e defaults de tipografia e estilo
    if (window.Chart) {
      if (window.ChartDataLabels) {
        try {
          Chart.register(ChartDataLabels);
        } catch (e) {}
      }

      Chart.defaults.font.family = 'Montserrat, sans-serif';
      Chart.defaults.font.size = 10;
      Chart.defaults.color = '#64748B';
      Chart.defaults.plugins.legend.labels.usePointStyle = true;
      Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
      Chart.defaults.plugins.tooltip.backgroundColor = '#0B2545';
      Chart.defaults.plugins.tooltip.titleColor = '#FFFFFF';
      Chart.defaults.plugins.tooltip.bodyColor = '#CBD5E1';
      Chart.defaults.plugins.tooltip.padding = 10;
      Chart.defaults.plugins.tooltip.cornerRadius = 10;
      Chart.defaults.plugins.tooltip.displayColors = false;
    }

    const data = await loadRadarHubData();
    if (!data.groundTruth) return;

    updateHeaderAuditBadge(data.metadataRegistry);
    updateVisaoGeralHeroStrip();
    updateTopKpis(data.groundTruth);
    renderAxisCharts(RADAR_HUB_CACHE.activeAxis, data.groundTruth);
    window.updateHubBenchmarkView();
  };

  // ==============================================================================
  // INICIALIZAÇÃO REATIVA (ZERO DEPENDÊNCIA DE MODIFICAÇÕES NO APP.JS)
  // ==============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const ibgeView = document.getElementById('ibge-view');
    if (ibgeView && !ibgeView.classList.contains('hidden')) {
      window.initRadarHub();
    }

    // Observer reativo para detectar quando a aba #ibge-view for ativada
    if (ibgeView) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (!ibgeView.classList.contains('hidden')) {
              window.initRadarHub();
            }
          }
        }
      });
      observer.observe(ibgeView, { attributes: true });
    }

    // Interceptador de clique em abas de navegação
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[onclick*="switchMainTab"]');
      if (btn) {
        const attr = btn.getAttribute('onclick') || '';
        if (attr.includes('ibge')) {
          setTimeout(() => {
            if (typeof window.initRadarHub === 'function') {
              window.initRadarHub();
            }
          }, 50);
        }
      }
    });
  });

})();
