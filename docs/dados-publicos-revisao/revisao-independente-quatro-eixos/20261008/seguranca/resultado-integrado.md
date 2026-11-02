# Segurança Pública — resultado integrado de 08/10/2026

Confiabilidade boa nos recortes SSP de 2002–2025 que conciliam; limitada para 2001, categorias sem competência e universos CSI/DEIC/ranking. Taxas publicadas preservam denominador nativo. Revisão humana final pendente; não é homologação geral.

## 1. Inventário

9 indicadores no registry, 6 com valor e 3 null. 7287 observações/células na exportação histórica, inclusive ausências e recortes sobrepostos: não são indicadores independentes nem valores somáveis. O inventário inicial completo e as definições estão no[relatório do pesquisador](relatorio.md).

## 2. Evidências reproduzidas

Consulte[manifest das fontes](manifest.json),[matriz metodológica](../metodologia/matriz-decisoes.json),[QA primário independente](../qa/validacao-evidencias.json) e[QA de todos os locators integrados](../qa/validacao-integracao-proposta.json). Fonte/URL/hash/arquivo/competência/unidade/locator e recortes acompanham cada registro em `series_auditadas` + `series_metadata`. Saúde tem adendos específicos[CNES](../qa/validacao-cnes.json) e[competências atualizadas](../qa/validacao-refresh-saude.json).

## 3. Antes/depois aplicado

|Indicador|Antes: valor/competência|Depois: valor/competência|Status atual|
|---|---|---|---|
|`seg_homicidios_dolosos_2024`|23 / 2024|23 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`seg_taxa_homicidios`|3.28 / 2024|3.28 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`seg_roubos_veiculos_2024`|null / 2024|143 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`seg_furtos_veiculos_2024`|null / 2024|724 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`seg_roubos_gerais`|965 / 2024|965 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`seg_produtividade_prisoes`|null / 2024|2170 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`seg_sao_jose_unida`|null / 2024|null / 2024|SUSPENSO|
|`seg_ranking_500k`|null / 2024|null / 2024|SUSPENSO|
|`seg_esclarecimento_deic`|null / 2024|null / 2024|SUSPENSO|

Metadados legados anteriores foram[arquivados](../metadados-legados-preservados.json), preservando provas e divergências. O arquivo[antes-depois-indicadores.json](../antes-depois-indicadores.json) mantém os registros completos.

## 4. Cobertura, lacunas e quebras

|Família|Antes|Cobertura integrada|Lacunas/quebras|
|---|---|---|---|
|Ocorrências e vítimas SSP|Anual 2001–2025; recortes mensais suspensos|545 recortes anuais/parciais e 6540 células mensais 2001–2026; 25 anos completos por categorias disponíveis|Quatro contagens 2001 conflitantes suspensas; mudança registro→ocorrência julho 2001. Dois registros 2015 sem competência rejeitados; 2026 jan–ago somente.|
|Taxas SSP e produtividade|Taxa homicídios e produtividade sem vínculo suficiente|189 taxas 1999–2025 de sete famílias e 13 categorias produtividade 2024|Taxas nativas SEADE/veículos, não recalculadas com IBGE atual. Prisões 2170 não pessoas únicas. CSI/DEIC/ranking continuam suspensos.|


## 5. Oportunidades de ampliação

|Oportunidade real|Fonte primária|Procedimento necessário|
|---|---|---|
|Produtividade de outros anos, SPVida e BOs|SSP-SP / APIs e plano de dados abertos|Reproduzir dicionário histórico, retificações, vítima/ocorrência, deduplicação de BOs; não agregar instituições.|
|Resolver 2001, ranking e esclarecimento|SSP-SP / FundaçãoSEADE / DEIC|Obter edição oficial reconciliada, população/frota, universo completo de municípios e coorte/denominador DEIC.|


## 6. Testes e regressão

10/10 suítes VM e 4/4 cenários Chrome aprovados. Os oito eixos, exportações JSON/CSV online/offline, filtros, fontes, hashes, unidades, competências e null/zero foram exercidos. P1–P4 e app.js preservados; 42 valores incorretos da bilhetagem não reapareceram em duas regenerações adversariais. [Relatório QA](../qa/relatorio-qa.md) e[integridade final](../integridade-final.json).

## 7. Pendências e limites

As limitações da tabela acima permanecem. Novas séries comprovadas estão na exportação; gates de gráficos sem vínculo completo não foram levantados. Chrome usou fixture do módulo, sem app.js/login; offline após assets não comprova primeiro acesso offline; viewport móvel não equivale a aparelho físico. Nenhum screenshot, deploy ou redesenho. Brutos grandes permanecem locais e descritos por manifests/hash; não são carregados no payload.

## 8. Parecer

Confiabilidade boa nos recortes SSP de 2002–2025 que conciliam; limitada para 2001, categorias sem competência e universos CSI/DEIC/ranking. Taxas publicadas preservam denominador nativo. Versão integrada `sha256:7e9547065b7f4f0a284f654c8756d21c1c3433226947d5fcf1d8b88e42f17046`. A próxima etapa depende de revisão humana; nenhum redesenho ou novo eixo iniciado.
