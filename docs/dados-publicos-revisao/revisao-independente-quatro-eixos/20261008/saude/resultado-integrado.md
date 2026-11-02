# Saúde — resultado integrado de 08/10/2026

Confiabilidade documental boa no núcleo SMS/RAG e CVE reproduzido; limitada para microdados nacionais, denominadores de taxas e equivalência dos KPIs CNES. Mortalidade 2025 permanece preliminar. Revisão humana final pendente; não é homologação geral.

## 1. Inventário

17 indicadores no registry, 8 com valor e 9 null. 179 observações/células na exportação histórica, inclusive ausências e recortes sobrepostos: não são indicadores independentes nem valores somáveis. O inventário inicial completo e as definições estão no[relatório do pesquisador](relatorio.md).

## 2. Evidências reproduzidas

Consulte[manifest das fontes](manifest.json),[matriz metodológica](../metodologia/matriz-decisoes.json),[QA primário independente](../qa/validacao-evidencias.json) e[QA de todos os locators integrados](../qa/validacao-integracao-proposta.json). Fonte/URL/hash/arquivo/competência/unidade/locator e recortes acompanham cada registro em `series_auditadas` + `series_metadata`. Saúde tem adendos específicos[CNES](../qa/validacao-cnes.json) e[competências atualizadas](../qa/validacao-refresh-saude.json).

## 3. Antes/depois aplicado

|Indicador|Antes: valor/competência|Depois: valor/competência|Status atual|
|---|---|---|---|
|`saude_mortalidade_infantil`|8.2 / 2024; 2025: 7, 65|7.65 / 2025 (preliminar)|DISPONIVEL_COM_LIMITACAO|
|`saude_leitos_hospitalares_total`|null / 12/2024|null / 12/2024|SUSPENSO|
|`saude_leitos_sus`|null / 12/2024|null / 12/2024|SUSPENSO|
|`saude_leitos_nao_sus`|null / 12/2024|null / 12/2024|SUSPENSO|
|`saude_taxa_leitos_mil_hab`|null / 12/2024|null / 12/2024|SUSPENSO|
|`saude_leitos_uti_adulto`|null / 12/2024|null / 12/2024|SUSPENSO|
|`saude_leitos_uti_pediatrica`|null / 12/2024|null / 12/2024|SUSPENSO|
|`saude_estabelecimentos_total`|null / 12/2024|null / 12/2024|SUSPENSO|
|`saude_cobertura_atencao_basica`|61.63 / 2024 (último dado MS: abril)|57.95 / 2025|CONFIRMADO_FONTE_OFICIAL|
|`saude_nascidos_vivos_sinasc`|7463 / 2024|7463 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`saude_cobertura_vacinal_bcg`|60.93 / 2024; parcial 2025: 91, 67%|60.93 / 2024; parcial 2025: 91, 67%|CONFIRMADO_FONTE_OFICIAL|
|`saude_dengue_sinan`|98163 / 2024, SE 1–50 (parcial)|98163 / 2024, SE 1–50 (parcial)|CONFIRMADO_FONTE_OFICIAL|
|`saude_internacoes_sih`|38738 / 2024|41846 / 2025|CONFIRMADO_FONTE_OFICIAL|
|`saude_atencao_basica_cnes_sia`|61.63 / 2024 (último dado MS: abril)|57.95 / 2025|CONFIRMADO_FONTE_OFICIAL|
|`saude_procedimentos_sia_sih`|null / 2024|null / 2024|SUSPENSO|
|`saude_causas_mortalidade`|4677 / 2023; 2024: 5.028|5028 / 2024|CONFIRMADO_FONTE_OFICIAL|
|`saude_cobertura_vacinal`|null / 2024|null / 2024|SUSPENSO|

Metadados legados anteriores foram[arquivados](../metadados-legados-preservados.json), preservando provas e divergências. O arquivo[antes-depois-indicadores.json](../antes-depois-indicadores.json) mantém os registros completos.

## 4. Cobertura, lacunas e quebras

|Família|Antes|Cobertura integrada|Lacunas/quebras|
|---|---|---|---|
|SINASC, SIH e SIM por residência|SINASC/SIH 2021–2024; SIM 2023–2024|SINASC 2015–2024, SIH 2015–2025, SIM 2015–2024; 31 observações selecionadas|RAG SMS reproduz DATASUS; extração nacional direta não concluída.85 observações de edições preservadas; três revisões SIH documentadas.|
|Dengue CVE por residência/início dos sintomas|Ausente; boletinsSMS de outro universo|2019–2025, sete totais e 84 meses|CVE 98256/5554 não substitui SMS 98163/5529 SE 1–50. Não atribuir diferença somente às semanas finais.|
|CNES por código nativo|KPIs suspensos|52 linhas, competência 12/2024, somente série discreta limitada/export|HABILITADOS ≠ SUS. Hospital-dia/complementares/subtipos têm universos distintos. Nove KPIs de Saúde continuam null.|


## 5. Oportunidades de ampliação

|Oportunidade real|Fonte primária|Procedimento necessário|
|---|---|---|
|Dados nacionais SIM/SINASC/SIH e anos anteriores dos RAG|DATASUS / TabNet / arquivos DBC; RAG 2016–2018 já capturados|Reproduzir residência e versão; extrair PDFs antigos/OCR auditado; não anunciar extração nacional que sofreu timeout.|
|CNES mensal por estabelecimento/status e vacinação com denominadores|MS / CNES / PNI / e-Gestor|Definir hospital-dia/complementares/UTI/SUS e situação cadastral; preservar estimativas APS e versões PNI.|


## 6. Testes e regressão

10/10 suítes VM e 4/4 cenários Chrome aprovados. Os oito eixos, exportações JSON/CSV online/offline, filtros, fontes, hashes, unidades, competências e null/zero foram exercidos. P1–P4 e app.js preservados; 42 valores incorretos da bilhetagem não reapareceram em duas regenerações adversariais. [Relatório QA](../qa/relatorio-qa.md) e[integridade final](../integridade-final.json).

## 7. Pendências e limites

As limitações da tabela acima permanecem. Novas séries comprovadas estão na exportação; gates de gráficos sem vínculo completo não foram levantados. Chrome usou fixture do módulo, sem app.js/login; offline após assets não comprova primeiro acesso offline; viewport móvel não equivale a aparelho físico. Nenhum screenshot, deploy ou redesenho. Brutos grandes permanecem locais e descritos por manifests/hash; não são carregados no payload.

## 8. Parecer

Confiabilidade documental boa no núcleo SMS/RAG e CVE reproduzido; limitada para microdados nacionais, denominadores de taxas e equivalência dos KPIs CNES. Mortalidade 2025 permanece preliminar. Versão integrada `sha256:7e9547065b7f4f0a284f654c8756d21c1c3433226947d5fcf1d8b88e42f17046`. A próxima etapa depende de revisão humana; nenhum redesenho ou novo eixo iniciado.
