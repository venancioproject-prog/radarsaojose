# Radar São José — revisão independente dos quatro eixos

Fechamento de 08/10/2026. **Integração técnica concluída e aprovada com limites; revisão humana final pendente.** Não constitui homologação geral dos oito eixos. Não houve deploy, screenshot ou redesenho; app.js e dados de P1–P4 permaneceram iguais à base desta fase.

Base recebida: `sha256:9f20f59a93862a89eb7b96c0969fce22cccb435e8a7e657a822edf7253f55969`.

Versão final: `sha256:7e9547065b7f4f0a284f654c8756d21c1c3433226947d5fcf1d8b88e42f17046`. Package, inline do controller, registry, ground truth, derivação do hash e versão carregada no Chrome concordam. O pacote mantém auditoria histórica sem autoridade e homologação geral falsa.

## Resultado por eixo

|Eixo|Indicadores atuais|Séries/células exportadas|Parecer e entrega|
|---|---|---|---|
|Educação|7 com valor /2 null|1940|[Resultado integrado](educacao/resultado-integrado.md)|
|Saúde|8 com valor /9 null|179|[Resultado integrado](saude/resultado-integrado.md)|
|Segurança Pública|6 com valor /3 null|7287|[Resultado integrado](seguranca/resultado-integrado.md)|
|Demografia|13 com valor /0 null|110|[Resultado integrado](demografia/resultado-integrado.md)|

São 9.516 observações/células com recortes distintos, inclusive nulls; não 9.516 indicadores independentes. O registry continua com 122 IDs únicos; valores null passaram de 34 para 28 devido a seis promoções externamente reproduzidas e validadas por agentes distintos.

## Problemas, causas e correções

|Problema|Causa reproduzida|Correção aplicada|
|---|---|---|
|Educação: percentuais por rede 114, 779%|Divisor fixo 142.850, contra total 2023 de 163.965|Total do mesmo recorte e guarda para ausência/denominador inválido; soma 100%|
|Matrículas confundidas com pessoas/recortes|Tooltips “estudantes”, especial “inclusiva”, médio “regular”, profissional genérico|Matrículas 2023, comuns+exclusivas, médio inclui integrado; técnica 7316 distinta profissional total 7322|
|Escolarização atribuída à PNAD/INEP|Metadata e tooltip legados|IBGE/Censo 2022, residentes 6–14; 99, 09%; sem inferir contagens|
|Saúde com competências antigas|Valores escalares não acompanhavam resultados anuais já publicados|Mortalidade 7, 65 prelim 2025; APS 57, 95/2025 dois IDs; SIH 41.846/2025; SIM 5.028/2024. Anos anteriores preservados|
|Metadados de fonte contraditórios|raw_file/trecho_bruto ainda citavam valores antigos sem prova|Autoridade ativa sincronizada com evidência/hash/competência; registros antigos arquivados|
|Dengue com universos incompatíveis|CVE por residência/início dos sintomas confundido com SMS SE 1–50|Séries separadas, edição e revisão identificadas; nenhum total substituído silenciosamente|
|CNES com total/SUS/UTI incompatível|Hospital-dia, complementares e HABILITADOS tratados como mesmo universo|52 códigos discretos limitados/export; nove KPIs de Saúde continuam null; nenhum agregado novo|
|Segurança 2001|Anual e mensal divergem em quatro contagens; mudança territorial em julho 2001|Contagens anuais conflitantes null, ambas edições arquivadas, taxa nativa SSP/SEADE separada; meses distinguem registro/ocorrência|
|Ocorrências, vítimas e prisões|Naturezas distintas eram tratadas como intercambiáveis|2025: 29 ocorrências/33 vítimas. Promovidos 2024: 143 roubos de veículos, 724 furtos de veículos, 2170 prisões nativas; sem pessoas únicas|
|Demografia 2026 rotulada projeção|Narrativa anterior sem prova da estimativa|Estimativa oficial IBGE 729.153; 2024=724.756. SIDRA e XLSX 2026 reproduzidos|
|Urbanização divergente|Classificação IBGE 688.155 urbanos versus municipal 681.842|98, 72% calculada na classificação IBGE/mesmo denominador 697.054; divergência municipal preservada|
|35 polígonos versus tabelas locais|Ausência de crosswalk/geometria versionada; 39 áreas textuais não equivalem automaticamente|Geometrias e hashes preservados; população/ranking/densidade continuam suspensos|
|Afirmações estáticas em tela|Cartões não dependiam dos auxiliares null|Alfabetização/indígenas/comunidades/quilombolas em verificação; retirada afirmação 1º ranking/homologação sem prova|
|Diagnóstico local ainda anunciava números antigos|Consistency era diagnóstico da versão anterior|Divergências históricas arquivadas; 48 comparações registry/evidência da mesma competência aprovadas|

## Cobertura histórica e lacunas

|Eixo/família|Cobertura integrada|Lacunas/quebras|
|---|---|---|
|Educação: IDEB, rendimento e SAEB|11 ciclos 2005–2025, Pública/Municipal/Estadual, AI/AF; 741 células|Metas primeiro ciclo 2007–2021; metas 2023/2025 ausentes. IDEB, nota SAEB e percentuais não equivalentes.|
|Educação: Censo Escolar: matrículas/redes/docentes/estabelecimentos/turmas|2023–2025; totais 163965/161959/156378, quatro redes|2025 V2 alterou colunas; profissional/especial sobrepõem etapas. Docentes por etapa não são somáveis; estabelecimentos seguem definição da sinopse.|
|Educação: Distorção idade-série e rendimento|2025, 32 recortes, 1136 células, redes/localização/etapas explícitas|Não preencher anos anteriores nem combinar Total/Pública/componentes.|
|Saúde: SINASC, SIH e SIM por residência|SINASC 2015–2024, SIH 2015–2025, SIM 2015–2024; 31 observações selecionadas|RAG SMS reproduz DATASUS; extração nacional direta não concluída.85 observações de edições preservadas; três revisões SIH documentadas.|
|Saúde: Dengue CVE por residência/início dos sintomas|2019–2025, sete totais e 84 meses|CVE 98256/5554 não substitui SMS 98163/5529 SE 1–50. Não atribuir diferença somente às semanas finais.|
|Saúde: CNES por código nativo|52 linhas, competência 12/2024, somente série discreta limitada/export|HABILITADOS ≠ SUS. Hospital-dia/complementares/subtipos têm universos distintos. Nove KPIs de Saúde continuam null.|
|Segurança Pública: Ocorrências e vítimas SSP|545 recortes anuais/parciais e 6540 células mensais 2001–2026; 25 anos completos por categorias disponíveis|Quatro contagens 2001 conflitantes suspensas; mudança registro→ocorrência julho 2001. Dois registros 2015 sem competência rejeitados; 2026 jan–ago somente.|
|Segurança Pública: Taxas SSP e produtividade|189 taxas 1999–2025 de sete famílias e 13 categorias produtividade 2024|Taxas nativas SEADE/veículos, não recalculadas com IBGE atual. Prisões 2170 não pessoas únicas. CSI/DEIC/ranking continuam suspensos.|
|Demografia: Censos e estimativas|Seis censos 1970–2022 e 22 estimativas 2001–2026, famílias separadas|Estimativas ausentes 2007/2010/2022/2023 não preenchidas. Comparabilidade territorial e revisões precisam de contexto.|
|Demografia: Idade, sexo, situação e domicílios|21 faixas com homens, mulheres e total 2022; situação urbana/rural e 13 categorias domiciliares|Cor/raça residual 31 pendente; não completar categorias. Classificação IBGE diverge municipal; não associar tabelas aos 35 polígonos.|


## Oportunidades reais

|Eixo|Oportunidade|Fonte e validação necessária|
|---|---|---|
|Educação|Sinopses anteriores a 2023 e indicadores de fluxo de outras edições|INEP / Sinopses Estatísticas e Indicadores Educacionais: Baixar cada edição, conferir mudanças de colunas, rede/etapa, notas, territorialidade e sinais de ausência antes de integrar.|
|Educação|Infraestrutura, estabelecimentos, docentes e modalidades por escola|INEP / Censo Escolar e microdados oficiais: Validar situação da escola, município da escola versus residência e deduplicação de docentes; não inferir aluno único de matrícula.|
|Saúde|Dados nacionais SIM/SINASC/SIH e anos anteriores dos RAG|DATASUS / TabNet / arquivos DBC; RAG 2016–2018 já capturados: Reproduzir residência e versão; extrair PDFs antigos/OCR auditado; não anunciar extração nacional que sofreu timeout.|
|Saúde|CNES mensal por estabelecimento/status e vacinação com denominadores|MS / CNES / PNI / e-Gestor: Definir hospital-dia/complementares/UTI/SUS e situação cadastral; preservar estimativas APS e versões PNI.|
|Segurança Pública|Produtividade de outros anos, SPVida e BOs|SSP-SP / APIs e plano de dados abertos: Reproduzir dicionário histórico, retificações, vítima/ocorrência, deduplicação de BOs; não agregar instituições.|
|Segurança Pública|Resolver 2001, ranking e esclarecimento|SSP-SP / FundaçãoSEADE / DEIC: Obter edição oficial reconciliada, população/frota, universo completo de municípios e coorte/denominador DEIC.|
|Demografia|Correspondência dos 35 polígonos e 39 áreas textuais municipais|Prefeitura / GeoSanja / legislação / IBGE malhas: Obter camada original/versionada e crosswalk explícito; validar chaves, geometria e agregação de setores censitários. Não usar semelhança de nomes.|
|Demografia|Cor/raça, alfabetização, indígenas, favelas, quilombolas e censos antigos|IBGE / SIDRA / produtos temáticos do Censo: Reproduzir classificações e universos próprios, residual 31, denominadores e séries por edição; nenhum preenchimento artificial.|


## Evidências e reprodução

Quatro pesquisadores trabalharam em pastas separadas; um metodólogo independente e um QA distinto reproduziram as propostas. O integrador foi o único escritor do GT/registry/controller/package. Com três slots além do integrador, os pesquisadores e validadores trabalharam em rodadas; não houve escrita concorrente nos arquivos compartilhados.

Fontes originais, arquivos, hashes, datas, competências e locators: manifests de[Educação](educacao/manifest.json),[Saúde](saude/manifest.json),[Segurança](seguranca/manifest.json),[Demografia](demografia/manifest.json) e[fontes integradas](manifest-fontes-integradas.json). Os brutos nacionais grandes permanecem locais, fora do carregamento e do índice Git; alguns brutos pequenos e o snapshot inicial são preservados no índice. Manifests permitem verificar os bytes e refazer captura, mas URLs mutáveis podem mudar: nova coleta deve usar outra pasta/edição, sem sobrescrever esta rodada. Não houve nova transferência de todos os arquivos nacionais peloQA; os ZIPs primários preservados foram reextraídos por parser XML próprio e hashes conferidos.

Reprodução não destrutiva a partir da raiz:

```powershell
python -X utf8 scripts/revisao_quatro_eixos_integridade.py
python -X utf8 scripts/revisao_quatro_eixos_qa_evidencias.py
python -X utf8 scripts/revisao_quatro_eixos_qa_cnes.py
python -X utf8 scripts/revisao_quatro_eixos_qa_refresh.py
python -X utf8 scripts/revisao_quatro_eixos_qa_integracao.py
python -X utf8 scripts/revisao_quatro_eixos_qa_regressoes.py
python -X utf8 scripts/revisao_quatro_eixos_qa_chrome.py
```

Os validadores escrevem relatórios somente nesta pasta. A integração é operação única vinculada ao snapshot e aos hashes aprovados; não executar integrar/controller novamente sobre a versão final. Para reconstruí-la, usar workspace isolado com o snapshot inicial, propostas/manifests e validações, depois executar aprovar→integrar→controller→builder. Nenhum extrator deve restaurar valores sem reaplicar a reconciliação dos 42 IDs deP4.

## Testes e limites práticos

QA: 3.229 checks primários independentes, 213 CNES, 4 refresh e 27.515 transcrição/locators. São conjuntos sobrepostos, não indicadores distintos. Metodologia: 30 decisões, 14 fontes recapturadas, 40 checks e adendos. Integridade: 19.256 checks; 9.516 registros e 57 arquivos-fonte usados na integração.

**10/10 suítes VM e 4/4 cenários Chrome aprovados**, cobrindo os oito eixos, exportJSON/CSV online/offline, fontes/hash/unidade/competência/status/null/zero, filtros, fallback e duas regenerações adversariais dos 42 valores de bilhetagem. [Relatório QA](qa/relatorio-qa.md),[VM](qa/regressoes.json),[Chrome](qa/testes-chrome-real.json),[fingerprint/reprodução](qa/regeneracao-fingerprint.json),[integridade](integridade-final.json).

Chrome: desktop online 6, 04 s, offline após assets 4, 92 s, viewport móvel 1 MiB/s+100 ms 40, 02 s, verificação remota offline 4, 89 s. A primeira falha foi do harness: proxy `chart.options` avaliavaformatter como scriptable; leitura corrigida para `chart.config.options`, sem mudança do produto. [Falha inicial preservada](qa/testes-chrome-primeiro-harness.json).

PackageJSON: 26.282.088 bytes (base 22.440.492; aumento 3.841.596). Controller cominline: 26.520.931 bytes. O carregamento padrão continua com uma única cópia inline; verificação remota é opcional e fallback idêntico. Esses tempos usamHTTP local sem compressão, não benchmark de produção. O pacote continua pesado para rede/dispositivo modestos; fracionamento ou compactação é oportunidade posterior, sem deploy nesta fase.

Chrome foi fixture real do módulo, sem app.js/login; não éE2 E da aplicação completa. Offline após assets não comprova primeiro acesso offline/PWA. Viewport emulado não substitui aparelho físico. Não houve screenshots. Novos históricos estão nos dados/exportações; gráficos sob quarentena permanecemfallback até vínculo completo, mesmo quando parte da família já está comprovada.

## Pendências e decisão final

Manter: duasmetasEducação, nove KPIs de Saúde, CSI/DEIC/ranking, quatrocontagens anuais 2001 emconflito e 35 polígonossem vínculo populacional. No total do registry dos oito eixos permanecem 28 null; ausências emséries são adicionais e não equivalem a zero. Cor/raça, alfabetização, universos indígenas/comunidades/quilombolas e pirâmides antigas precisam de dados específicos. Fonte primária municipal não substitui extração nacional DATASUS; a correspondência territorial ainda precisa decamada/crosswalk comprovados.

[Antes/depois completo](antes-depois-indicadores.json),[cobertura histórica](cobertura-historica-consolidada.json),[oportunidades](matriz-oportunidades.json),[decisões técnicas](decisoes-integracao.json),[arquivos alterados](arquivos-alterados.md).

**Parado para revisão humana.** Não iniciado redesenho definitivo, novo eixo, deploy ou promoção adicional.
