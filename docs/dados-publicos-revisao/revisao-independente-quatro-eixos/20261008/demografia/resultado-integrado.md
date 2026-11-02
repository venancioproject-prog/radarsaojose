# Demografia — resultado integrado de 08/10/2026

Confiabilidade alta nos recortes municipais IBGE reproduzidos. Vínculos dos 35 polígonos, distribuições temáticas e comparabilidade histórica incompleta permanecem limitados/suspensos. Revisão humana final pendente; não é homologação geral.

## 1. Inventário

13 indicadores no registry, 13 com valor e 0 null. 110 observações/células na exportação histórica, inclusive ausências e recortes sobrepostos: não são indicadores independentes nem valores somáveis. O inventário inicial completo e as definições estão no[relatório do pesquisador](relatorio.md).

## 2. Evidências reproduzidas

Consulte[manifest das fontes](manifest.json),[matriz metodológica](../metodologia/matriz-decisoes.json),[QA primário independente](../qa/validacao-evidencias.json) e[QA de todos os locators integrados](../qa/validacao-integracao-proposta.json). Fonte/URL/hash/arquivo/competência/unidade/locator e recortes acompanham cada registro em `series_auditadas` + `series_metadata`. Saúde tem adendos específicos[CNES](../qa/validacao-cnes.json) e[competências atualizadas](../qa/validacao-refresh-saude.json).

## 3. Antes/depois aplicado

|Indicador|Antes: valor/competência|Depois: valor/competência|Status atual|
|---|---|---|---|
|`demo_populacao_censo`|697054.0 / 2022|697054.0 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_populacao_estimada_2024`|null / 2024|724756 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`demo_populacao_estimada_2026`|null / 2026|729153 / 2026|CONFIRMADO_FONTE_OFICIAL|
|`demo_domicilios_total`|282214.0 / 2022|282214.0 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_domicilios_ocupados`|247894.0 / 2022|247894.0 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_media_moradores`|2.8 / 2022|2.8 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_area_territorial`|1099.409 / 2022|1099.409 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_densidade_demografica`|634.03 / 2022|634.03 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_taxa_urbanizacao`|null / 2022|98.72 / 2022|CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS|
|`demo_populacao_mulheres`|361695.0 / 2022|361695.0 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_populacao_homens`|335359.0 / 2022|335359.0 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_razao_sexo`|92.72 / 2022|92.72 / 2022|CONFIRMADO_FONTE_OFICIAL|
|`demo_indice_envelhecimento_2022`|62.48 / 2022|62.48 / 2022|CONFIRMADO_FONTE_OFICIAL|

Metadados legados anteriores foram[arquivados](../metadados-legados-preservados.json), preservando provas e divergências. O arquivo[antes-depois-indicadores.json](../antes-depois-indicadores.json) mantém os registros completos.

## 4. Cobertura, lacunas e quebras

|Família|Antes|Cobertura integrada|Lacunas/quebras|
|---|---|---|---|
|Censos e estimativas|Censo 2022; estimativas suspensas|Seis censos 1970–2022 e 22 estimativas 2001–2026, famílias separadas|Estimativas ausentes 2007/2010/2022/2023 não preenchidas. Comparabilidade territorial e revisões precisam de contexto.|
|Idade, sexo, situação e domicílios|Pirâmide suspensa; totais municipais|21 faixas com homens, mulheres e total 2022; situação urbana/rural e 13 categorias domiciliares|Cor/raça residual 31 pendente; não completar categorias. Classificação IBGE diverge municipal; não associar tabelas aos 35 polígonos.|


## 5. Oportunidades de ampliação

|Oportunidade real|Fonte primária|Procedimento necessário|
|---|---|---|
|Correspondência dos 35 polígonos e 39 áreas textuais municipais|Prefeitura / GeoSanja / legislação / IBGE malhas|Obter camada original/versionada e crosswalk explícito; validar chaves, geometria e agregação de setores censitários. Não usar semelhança de nomes.|
|Cor/raça, alfabetização, indígenas, favelas, quilombolas e censos antigos|IBGE / SIDRA / produtos temáticos do Censo|Reproduzir classificações e universos próprios, residual 31, denominadores e séries por edição; nenhum preenchimento artificial.|


## 6. Testes e regressão

10/10 suítes VM e 4/4 cenários Chrome aprovados. Os oito eixos, exportações JSON/CSV online/offline, filtros, fontes, hashes, unidades, competências e null/zero foram exercidos. P1–P4 e app.js preservados; 42 valores incorretos da bilhetagem não reapareceram em duas regenerações adversariais. [Relatório QA](../qa/relatorio-qa.md) e[integridade final](../integridade-final.json).

## 7. Pendências e limites

As limitações da tabela acima permanecem. Novas séries comprovadas estão na exportação; gates de gráficos sem vínculo completo não foram levantados. Chrome usou fixture do módulo, sem app.js/login; offline após assets não comprova primeiro acesso offline; viewport móvel não equivale a aparelho físico. Nenhum screenshot, deploy ou redesenho. Brutos grandes permanecem locais e descritos por manifests/hash; não são carregados no payload.

## 8. Parecer

Confiabilidade alta nos recortes municipais IBGE reproduzidos. Vínculos dos 35 polígonos, distribuições temáticas e comparabilidade histórica incompleta permanecem limitados/suspensos. Versão integrada `sha256:7e9547065b7f4f0a284f654c8756d21c1c3433226947d5fcf1d8b88e42f17046`. A próxima etapa depende de revisão humana; nenhum redesenho ou novo eixo iniciado.
