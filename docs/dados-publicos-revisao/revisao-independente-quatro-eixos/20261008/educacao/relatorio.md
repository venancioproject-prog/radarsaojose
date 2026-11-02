# Revisão independente — Educação — 08/10/2026

**Parecer do pesquisador: dados centrais reproduzidos, com correções de apresentação necessárias e ampliação primária viável. Não é homologação.** O pesquisador não escreveu ground truth, registry, controller, package ou app.js. As propostas precisam da validação independente de QA/metodologia antes da integração.

## Inventário e reprodução

O registry tem 9 indicadores:7 com valor e 2 metas 2023 suspensas. Os sete valores conferidos são IDEB 2025 PúblicaAI 6,9/AF 5,7; matrículas 2023 total 163.965, EF 85.827, infantil 39.020, médio 28.966; escolarização 6–14 Censo 2022 de 99,09%. Mantêm-se os null das metas 2023, ensino superior, IDHM Educação e analfabetismo sem prova nesta revisão.

Os arquivos canônicos contêm três linhas IDEB distintas — Pública, Municipal, Estadual — em 11 edições bienais 2005–2025, duas etapas. Foram reproduzidas 741 células do XLSX nacional original:66 IDEB,66 notas médias padronizadas,66 índices de rendimento,132 proficiências SAEB,363 taxas de aprovação e 48 metas. Cada célula retém rede, etapa, ano, variável nativa, arquivo, SHA 256, membro XLSX/hash, aba, linha e coluna. Notas SAEB não são percentual de alunos proficientes. Municipal 2025 é 6,9/6,0; Estadual 6,9/5,4; Pública 6,9/5,7. Não se calcula Pública pela média de Municipal/Estadual.

Também se reproduziu IDEB=N×P nas 66 observações, considerando os intervalos de arredondamento: N/Ppublicadoscom 2 decimais e IDEBcom 1. A reprodução não pretende recalcular os pesos de todas as escolas ou o tratamento da participação a partir de microdados ausentes. A fonte permanece o resultado agregado publicado pelo INEP. Metas do primeiro ciclo 2007–2021; não preencher 2023/2025.

No Censo 2023, os 165 recortes municipais anteriores foram conferidos contra o XLSX e hashes originais. Total por rede: Federal 714, Estadual 45.808, Municipal 68.550, Privada 48.893. Somam 163.965; percentuais do GT são corretos. Rede/localização/etapa são universos distintos: não adicionar linhaPública à soma das dependências, nem linhasTotal+Urbana+Rural.

A API original IBGE 60045 foi consultada novamente:2022=99,09 e 2010=97,4; anos intermediários e 2023/2024 null. Fonte nativa identifica CensoDemográfico 2010/2022. Esta é a escolarização da população residente 6–14, distinta de matrícula por município da escola. Numerador e denominador absolutos de 2022 não estão nessa resposta; não foram inferidos da porcentagem.

## Problemas encontrados e propostas

| Problema | Antes | Proposta após reprodução |
|---|---|---|
| Percentuais de dois gráficos | Divisor hardcoded 142.850 apesar do total 163.965 | Usar total do mesmo recorte 2023, com guarda explícita de ausência/total inválido |
| Percentuais por rede | Soma 114,779% | Soma 100%; valores absolutos preservados |
| Pessoas vs matrículas | Tooltip“estudantes”; subtítulo“alunado” | Matrículas 2023; não alunos únicos |
| Educação especial |“Inclusiva”,5425 | Totalcomuns+exclusivas:5251+174=5425 |
| Ensino médio |“Regular”,28966 | Inclui integrado:27783 propedêutico+1183 técnico integrado |
| Situação temporal |“matrículas ativas” | Matrículas do Censo 2023; não status ativo em 2026 |
| Fonte da escolarização | Registry“Censo/PNAD”; gráfico“conformidade INEP” | IBGE/Censo 2022; manter demais barrasnull |
| Ficha por rede | Abre indicadorEF | Abrir indicador total de todasetapas |

Em barras por categoria, especial/profissional têm sobreposições; percentuais sobre total são incidências, não uma partição que deva fechar100. Não alterar desenhos, cores, canvases ou a seleção existente de etapa do IDEB. O detalhamento de patches está em `propostas.json`.

## Ampliação comprovada

Foram obtidas as edições originais Censo 2024 e Censo 2025 V 2, esta última revisada emjulho/2026 no catálogo oficial. Estão fora do payload. Extraídos 165 recortes municipais 2024 e 259 recortes 2025, com notas completas e locators. A edição 2025 alterou a estrutura de colunas de ensino médio/IFTP/educação profissional e categorias das escolas privadas: offsets 2023 foram rejeitados por uma invariância que falhou, e o mapeamento foi corrigido para a ediçãoV 2. Esta quebra está documentada; não concatenar colunas pela posição.

| Ano/edição | Matrículas total | Infantil | Fundamental | Médio | Docentes | Estabelecimentos | Turmas |
|---|---:|---:|---:|---:|---:|---:|---:|
|2023|163965|39020|85827|28966|7808|391|6795|
|2024|161959|37842|86063|29225|7707|388|6760|
|2025 V 2|156378|35690|86101|26349|7704|390|6700|

Docentes são o total publicado no município, não soma dos docentes por etapa: a mesma pessoa pode atuar em mais deumaetapa/rede/município. Estabelecimentos são os incluídos na tabela do Censo da Educação Básica; todasredes, não apenas públicas. Não reinterpretar 391 como quantidade de estabelecimentos atualmente em funcionamento em 2026 sem os critérios cadastrais da edição. Turmas são outra unidade; nenhuma dessas contagens é matrícula ou aluno.

Redes 2024: Federal 748, Estadual 43808, Municipal 68027, Privada 49376. Redes 2025: Federal 675, Estadual 39369, Municipal 66547, Privada 49787. Conferidas soma das redes, urbano+rural, creche+pré, AI+AF e comuns+exclusivas. Preservar o recorte 2023 atual; propor série nova com ano/edição/locators, não substituir conteúdo de uma chave chamada 2023 por 2025.

Obtidos dois arquivos oficiais municipais 2025 — taxas de rendimento e distorção idade-série — com 32 linhas de recorte e 1136 células. Localização e dependência nativas preservadas. No recorteTotal/Total: aprovaçãoEF 99,5%, reprovação 0,4%, abandono 0,1%; distorçãoEF 2,0%, AI 1,1%, AF 3,1%, médio 6,3%. Zeros publicados continuam zeros;“--”vira null. Nada foi convertido para“adequação”por 100−distorção nem aplicado às barras antigas de outroano/universo.

## Evidências e testes

- `inventario.json`:9indicadores e todas séries/campos GTantes da integração.
- `matriz-evidencias.json`:741células IDEB e reprodução das165tabelas2023; testes por indicador/hash/locator.
- `testes.json`:1633checagens aprovadas, incluindo o recorte de novas tabelas; são testes do pesquisador, não substituem a revisão independente.
- `testes-calculo-ideb.json`:66produtos N×P compatíveis com precisão publicada.
- `testes-ampliacao.json`:32recortes/1136células e fechamento das taxas dentro de0,2p.p. de arredondamento; invariantes Censo.
- `censo2024-recorte.json`, `censo2025-recorte.json`: recortes completos externos ao payload.
- `ampliacao-censo2023-2025.json`, `indicadores2025-reproduzidos.json`: propostas estruturadas com unidades e proveniência.
- `propostas.json`: before/after documental, patches de controller/HTML e dados propostos. Nada aplicado pelo pesquisador.

Os regressões VM/Chrome de integração dos oito eixos cabem ao integrador/QA e não foram declaradas aprovadas aqui. Nenhum screenshot foi gerado.

## Cobertura, lacunas e oportunidades

IDEB está completo para os 11 ciclos publicados 2005–2025 nos três recortes municipais disponíveis; não fabricar rede federal ou privada municipal IDEB ausente nesses arquivos. Censo passa a ter 3 edições reproduzíveis 2023–2025; taxas de rendimento/distorção têm 2025 reproduzido nesta proposta. Escolarização tem dois cortes censitários 2010/2022, não uma série anual.

Oportunidade real: ampliar Censo 1995–2022 e as taxas de rendimento/distorção em anos anteriores mediante os arquivos anuais do catálogo, homologando cada mudança de layout/definição. Infraestrutura, docentes por formação/vínculo, turmas e educação especial já têm recortes municipais nos 165/259 quadros extraídos; antes de novos KPIs, analisar os critérios e relações de sobreposição. SAEB detalhado exige edição/participação/universo próprios; não inferir alunos proficientes de proficiência média ou IDEB. Ensino superior exige Censo da Educação Superior separado.

Limitações: arquivos nacionais grandes;2025 ZIP 232.142.480 bytes,2024 ZIP 145.089.739 bytes. Download HTTPS 2025 sofreu reset; recuperação via HTTPdo hostoficial foi explicitamente registrada, sem desativar TLS. Hash garante identidade futura do arquivo preservado, não autenticidade independente do transporte. Métodos detalhados de arredondamento dos agregados INEP, numeradores/denominadores absolutos da escolarização e composição das políticas de aprovação não foram reconstruídos por microdados. Mudança 2025 deIFTPnão pode ser tratada como crescimento técnico homogêneo sem harmonização documentada.

Reprodução local: executar `python -X utf8 .../educacao/reproduzir.py`, depois `ampliacao.py` e `calculos_ideb.py`, a partir da raiz. Requerpython-calamine; lêbrutospreservados e escreve apenas esta pasta. Não executa deploy, não promove suspensos. Para uma nova consulta temporal, criar outra pasta e manter estes hashes/edições.

Fontes primárias: [IDEB resultados](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/resultados), [metas](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/metas), [sinopses Censo](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas/educacao-basica), [rendimento2025](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais/taxas-de-rendimento-escolar/2025), [distorção2025](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais/taxas-de-distorcao-idade-serie/2025), [IBGE60045](https://servicodados.ibge.gov.br/api/v1/pesquisas/10058/indicadores/60045?localidade=354990). URLs originais de cada ZIP e hashes constam nos manifests.
