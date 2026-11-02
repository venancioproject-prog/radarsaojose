# Demografia — revisão independente de 08/10/2026

Parecer: os dez indicadores ativos do registry foram reproduzidos em respostas primárias atuais, sem divergência numérica. Há evidência externa suficiente para submeter três indicadores suspensos e séries à validação independente. Isso ainda não autoriza sua integração. A confiabilidade espacial permanece limitada: as 35 geometrias continuam suspensas para população, ranking e densidade.

## 1. Inventário e situação inicial

Registry: 13 indicadores; dez ativos e três suspensos (`demo_populacao_estimada_2024`, `demo_populacao_estimada_2026`, `demo_taxa_urbanizacao`). Ground truth contém 28 blocos, incluindo pirâmides 2000/2010/2022, histórico, regiões, setores, distritos, cor/raça, religião, alfabetização e campos derivados. A evidência desta rodada cobre todos os dez escalares ativos, três candidatos, histórico censitário e estimativas, pirâmide 2022, espécies de domicílio e tabelas territoriais textuais. Não homologa os demais auxiliares.

Inventário detalhado e antes/depois: `matriz-evidencias.json`. Séries e propostas: `propostas.json`; cobertura: `cobertura-historica.json`. Nada foi alterado no ground truth, registry, controller, package ou app.js.

## 2. Evidências reproduzidas

- SIDRA 4714: população 697054; área censitária 1099.409 km²; densidade 634.03 hab/km². Divisão população/área arredondada reproduz densidade.
- SIDRA 4711/4712:282214 domicílios recenseados,247894 particulares **permanentes** ocupados,695312 moradores nesse universo, média publicada 2.80. A média não usa população total 697054 como numerador.
- SIDRA 9514/9515:335359 homens/361695 mulheres, razão 92.72, envelhecimento 65+/0–14=62.48, idade mediana 36. O índice não usa 60+.
- Pirâmide 2022:21 faixas disjuntas, três sexos(total/homens/mulheres),66 registros. As 63 células das faixas coincidem com a tabela municipal; os totais por sexo e por idade fecham. `c 287/100362` é total; `c 287/0` soma níveis hierárquicos e não representa população municipal. A classificação forma de declaração é `c 286/113635`, não c 12311.
- SIDRA 6579:22 estimativas publicadas 2001–2026.2024=724756;2025=727078;2026=729153. XLSXDOU 2026 confirma 729153 na aba`municípios`,linha 3827,UF 35/código 49904, referência 1ºjulho 2026. O produtoIBGE informa publicaçãoDOU 28 agosto 2026. A antiga narrativa de 729153 como projeção linear não serve mais como metadado: registrar a estimativa oficial recém reproduzida e arquivar a narrativa anterior.
- SIDRA 9923:urbana 688155+rural 8899=697054; taxa derivada 98.7233413767%,98.72% a duas casas. Numerador e denominador pertencem ao mesmo Censo/classificação. Não usar estimativa populacional como denominador.
- SIDRA 202: cinco censos 1970/1980/1991/2000/2010; acrescentar 2022 de 4714, mantendo origem e tipo por ponto. Não fabricar anos intermediários.
- SIDRA 4711 por espécie: partição ocupado permanente 247894 + não ocupado permanente 33978 + improvisado 59 + coletivo 283 =282214. Não ocupado é vago 24667+ocasional 9311. Somar todas as categorias do endpoint duplica níveis.

Hashes, URLs solicitadas, códigos de consulta, datas e respostas HTTP estão no manifest. Erros 400/403/404 também foram preservados, identificados como tentativas, sem uso probatório. PDF cartográfico municipal possui imagem sem texto extraível: sua existência não comprova correspondência geométrica. O caderno técnico de agosto 2025 explicita agregação de setores censitários para setores socioeconômicos, mas não fornece o crosswalk necessário para o nosso arquivo.

## 3. Correções e divergências propostas

|Item|Antes|Depois proposto, sujeito à validação|
|---|---|---|
|Estimativa 2024|null|724756;SIDRA 6579|
|Estimativa 2026|null/narrativa de projeção|729153;estimativaIBGE oficial 1 jul 2026|
|Urbanização|null|98.72%;SIDRA 9923,situaçãoIBGE|
|Pirâmide 2022|17 faixas null|21 faixas nativas ou 17 com 80+ agregado exatamente|
|Histórico|auxiliares suspensos|6 pontos censitários e 22 estimativas, séries distintas|
|Domicíliosnãoocupados|null|33978=24667 vagos+9311 ocasionais|
|Média/ocupados|nome genérico|explicitar particulares permanentes ocupados|
|Mapa/setores|suspenso|continuar suspenso sem crosswalk externo|

A página municipal traz urbana 681842/rural 15212, incompatíveis com SIDRA 9923, embora total coincida. Não reconciliar por substituição artificial. Área municipal 1099.61 sem edição explícita diverge da área censitária 1099.409; preservar a censitária para densidade 2022. Crescimento municipal 2010–2022 publicado 1.65% não corresponde ao cálculo geométrico dos totais 629921→697054:0.8474748065%aoano. Não reproduzir a taxa publicada sem esclarecer definição.

Cor/raçaSIDRA 9605: cinco categorias somam 697023, total 697054; residual 31. Não preencher categoria, distribuir diferença ou normalizar 100%. Manter visual suspenso até nota metodológica/validação específica.

Notas legadas no ground truth ainda contêm números suspensos, comparações 2010 e referências de outras edições. Recomenda-se arquivá-las e reescrever a autoridade ativa com apenas recortes reproduzidos. Todas as evidências antigas permanecem preservadas.

## 4. Cobertura, lacunas e quebras

Censos 1970–2022 são seis observações censitárias, não uma série anual. As estimativas 2001–2026 não incluem 2007/2010/2022/2023 na resposta atual: lacunas devem continuar ausentes/null, e censos devem ser diferenciados por tipo. Valores anuais podem sofrer revisão do IBGE; guardar a edição coletada em 08/10/2026. Mudanças territoriais e revisões de projeções-base impedem assumir crescimento homogêneo sem pesquisa adicional.

Pirâmides 2000 e 2010 não foram reproduzidas nesta rodada: permanecemnull. Escolarização foi auditada pelo eixoEducação, evitando dupla autoridade. Religião amostral, alfabetização, distritos, razões de dependência antigas e rankings territoriais continuam pendentes.

## 5. Oportunidades reais

|Oportunidade|Fonte primária|Condição|
|---|---|---|
|Histórico 1970–2026|SIDRA 202/4714/6579|Integrar observações tipadas; não conectar lacunas como valores observados|
|Pirâmide 2022 completa|SIDRA 9514|Validação independente; filtros por sexo/faixa sem níveis sobrepostos|
|Domicílios por espécie 2022|SIDRA 4711/4712|Partição disjunta; comparações antigas só após reprodução|
|Urbanização 2022|SIDRA 9923|Usar classificaçãoIBGE; documentar diferençaPMSJC|
|Regiões e áreas textuais 2022|PáginaPMSJC|Tabelas segregadas da malha, com atribuição municipal|
|Pirâmides 2000/2010|SIDRA/Censos|Localizar classes comparáveis e reproduzir; ainda sem promoção|
|Mapa 35 geometrias|IBGE malha oficial+LC 612/2018+crosswalkPMSJC|Provar arquivos, geometria, cobertura e códigos; nome similar não basta|
|Cor/raça, religião, alfabetização|SIDRA 9605 e produtos censitários específicos|Esclarecer universos, residual, amostra/observado e método|

## 6. Testes e reprodução

`python -X utf 8 docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia/reproduzir.py` aprovou 137 verificações: hashes, dez escalares contra snapshot, somas por sexo/faixa, comparação 63 célulasPMSJC/IBGE, denominadores e arredondamento, referência/códigoXLSX, partições domiciliares, total das regiões e 39 áreas textuais,35 geometrias preservadas e populações suspensas.

`coletar.py` e complementos registram novas respostas; não os executar sobre este evidence store para preservar a edição auditada. Uma futura coleta deve usar outra pasta/data. `html_tabelas.py` preserva o resultado bruto das tabelas. Campos HTML com textos tachados não são usados como provas numéricas de domicílios/média.

O pesquisador não é seu único validador: dados continuam candidatos. RegressõesVM/Chrome, exportações, filtros e integração cabem aoQA/integrador depois da aprovação metodológica independente.

## 7. Visualizações e limitações

Controller atual mantém fallbacks para históricos/composições demográficas quando há`consolidacaoStatus`; o histórico não rende só porque existem valores. A integração deve reconhecer famílias comprovadas explicitamente e preservar fallback das restantes, sem redesenho. O mapa não pode receber população das tabelas textuais apenas por nome/código aparente. `CD_BAIRRO 3549904018` coexistindo com nome nativo`Setor 15` não prova erro: códigos pertencem a namespaces diferentes; é necessário crosswalk publicado e identificação da geometria externa.

A tabela municipal soma 8 regiões incluindo rural e 39 áreas textuais ao total 697054. Isso não equivale a 35 polígonos; áreas de banhado/rurais e geometrias têm cobertura distinta. Áreas_km² hardcoded das geometrias ainda não foram validadas. Não houve screenshots, deploy, redesign ou alteração dos outros eixos.

## 8. Parecer final para o integrador

Manter dez indicadores comprovados; submeter três suspensos e séries identificadas à validação separada. Preservar as suspensões sem evidência e a quarentena espacial. A base escalar censitária é confiável dentro dos recortes reproduzidos; metadados legados, universos urbanos divergentes e vínculo territorial ainda impedem homologação integral do eixo.
