# Saúde — Revisão independente de 08/10/2026

Parecer: o núcleo numérico comprovado pode continuar, com limitações explícitas. Foram reproduzidos 8 indicadores ativos entre 17 registros; os 9 suspensos continuam sem autorização de promoção. O pesquisador não alterou ground truth, registry, controller, package ou app.js. A extração nacional direta de SIM/SINASC/SIH não foi obtida nesta rodada: a comprovação consiste nos documentos primários públicos da SMS que reproduzem esses sistemas, e não nos JSONs redigidos pelas IAs anteriores.

## Inventário e reprodução

[inventario.json](inventario.json) preserva os 17 registros e todo o eixo Saúde recebido. [matriz-evidencias.md](matriz-evidencias.md) e [matriz-evidencias.json](matriz-evidencias.json) classificam cada indicador com fonte, hash, locator, período e limitação. [manifest.json](manifest.json) documenta downloads diretos oficiais e tentativas malsucedidas. PDFs, HTMLs e CSVs são preservados em raw/. Os hashes dos PDFs republicados nesta rodada conferem com os documentos usados na consolidação.

As fontes SMS conferidas são RAG 2019–2025 e prestações de contas do terceiro quadrimestre de 2024/2025. Foram adquiridos também RAG 2016–2018, mas não houve extração quantitativa desses três arquivos; sua mera presença não comprova novos anos. Nenhum arquivo antigo foi sobrescrito.

SINASC 2024: 7.463 nascidos vivos por residência da mãe. SIH 2024: 38.738 internações SUS por residência do paciente, e não produção dos hospitais localizados em SJC nem total de todas as AIHs. SIM 2023/2024: 4.677/5.028 óbitos por residência. Foram recalculados os sete capítulos destacados, o restante dos capítulos, percentuais e os oito principais grupos de internações de 2023 e 2024 contra as tabelas integrais do RAG 2025.

Mortalidade infantil: SMS publica 2024 = 8,2 e 2025 = 7,65 por mil nascidos vivos (Q3/2025, p.26). O mesmo documento tem resultados quadrimestrais 9,66 e 6,77: não devem substituir os resultados anuais. A meta 9 é referência municipal de 2022. A publicação não fornece os numeradores e denominadores dessas taxas; nenhum deles pode ser inferido por multiplicação de outra edição do SINASC. A taxa 2023 = 10 está impressa no Q3/2024, p.24. Contagens antigas 66/8.048 e 61/7.974 continuam sem comprovação.

APS: 61,63% em 2024 refere-se ao último dado MS de abril/2024; 57,95% consta como resultado 2025 (Q3/2025, p.24). Trata-se de cobertura populacional estimada APS, não cobertura ESF isolada. No RAG 2025, 40 centros de saúde/UBS da rede pública/prestadora SUS são 39 de gestão municipal e 1 estadual, não 40 UBS municipais. Atendimentos individuais SISAB 978.233 em 2024 e 1.285.049 em 2025 não se restringem a consultas médicas nem representam pessoas únicas.

Vacinas: Q3/2025 p.27 discrimina penta D3, pneumo D2, pólio D3 e SCR D1; valores 2024 e 2025 conferem. O indicador municipal de proporção das quatro vacinas com meta atingida não equivale a cada cobertura individual. BCG 60,93%/91,67% é publicação de 23/12/2025, com 2025 parcial. Hepatite B e rotavírus permanecem null; denominadores não foram publicados nessas tabelas. Portaria GM/MS 6.878/2025 preservada em raw/pni-portaria2025.html confirma o indicador das quatro vacinas com cobertura ≥95%. Meta BCG90 é parâmetro PNI, sustentado pelo Guia de Vigilância 2021 encontrado no portal oficial, mas seu PDF nacional não foi incorporado aos brutos desta rodada; não se confunde com meta municipal das quatro vacinas.

## Correções necessárias e antes/depois propostos

[propostas.json](propostas.json) contém propostas, nenhuma aplicada pelo pesquisador.

1. Arquivar raw_file e trecho_bruto legados do registry fora da cadeia ativa, preservando seu histórico. Apesar da evidencia atual correta, esses campos ainda anunciam mortalidade com contagens inventadas, dengue anual 98.219/média1.876, SIH54.709 e números CNES suspensos. Quem exporta ou consulta esses campos pode reintroduzir os erros.
2. Corrigir unidade SIH de “internações (AIHs)” para “internações SUS de residentes”, nome “APS e cobertura ESF” para “cobertura populacional estimada APS” e source_system genérico para sistema/edição efetivamente comprovados. Separar a competência do valor escalar de anos citados na nota contextual.
3. Após segunda validação, atualizar competências de indicadores já confirmados: mortalidade8,2/2024→7,65/2025; APS61,63/2024→57,95/2025 nos dois registros; SIH38.738/2024→41.846/2025; SIM4.677/2023→5.028/2024. Preservar os anos anteriores nas séries. Não atualizar BCG anual com resultado parcial sem identificação clara.
4. Ampliar séries documentais e criar série CVE por residência separada do balanço municipal. Não completar vazios dos recortes de parto/idade materna/CNES.

## Cobertura histórica comprovável

|Família|Canônica inicial|Proposta reproduzida|Lacunas/versões|
|---|---|---|---|
|SINASC residentes mãe|2021–2024|2015–2024:10anos|2025 ausente na tabela; parto e idade materna não extraídos|
|SIH residentes|2021–2024|2015–2025:11anos|Não total de AIHs/atendimento em SJC; três revisões datadas|
|SIM residentes total|2023–2024 destacados|2015–2024:10anos|2025 ausente; causas não agrupadas por diagnóstico individual|
|Mortalidade infantil SMS|2023–2025|Mesmos três anos|Taxas publicadas; cálculo externo sem numeradores/denominadores|
|Dengue balanço SMS|2010–2018; SE1–50/2024–2025|Preservar universo municipal|A notícia não explicita residência/importação; não unir automaticamente ao CVE|
|Dengue CVE residentes|Ausente|2019–2025:7anos e84meses|Autóctones/importados separados; edição fixa e revisável|
|Vacinação|2024–2025|Reprodução parcial existente|BCG2025 parcial; HepB/rotavírus null; denominadores não publicados|
|CNES|Suspenso12/2024|Tabela municipal nativa recuperada|Universo não equivale ao KPI antigo; manter suspensão enquanto não redefinido|

[historicos-rag-todas-edicoes.json](historicos-rag-todas-edicoes.json) preserva85observações de sete edições. [historicos-rag-proposta.json](historicos-rag-proposta.json) contém31observações selecionadas. [quebras-revisoes-rag.json](quebras-revisoes-rag.json) preserva as revisões SIH2020:30.894→30.895;2023:37.007→37.008;2024:38.737→38.738. A escolha exige mesmo universo e variável, consulta documental posterior claramente identificada e preservação de todas as versões; não média/interpolação. Não basta escolher o arquivo mais novo.

CVE-SP fornece CSVs de casos notificados e confirmados por município de residência e mês do início dos sintomas. A seleção usa a coluna MUNICÍPIO/MUN-RES, não a coluna GVE que também contém “São José dos Campos”. Totais confirmados autóctones+importados:2019=671;2020=451;2021=619;2022=1.698;2023=1.048;2024=98.256;2025=5.554. As três medidas mensais foram somadas separadamente e conferidas com suas três colunas TOTAL. [dengue-cve-extracao.json](dengue-cve-extracao.json) registra84meses, localização da célula, arquivo/membro/hash e notas de atualização. 2024 edição16/01/2025;2025 edição20/02/2026. A diferença frente a SMS98.163/5.529 (SE1–50) não pode ser atribuída só às semanas finais: as datas de revisão e universos também diferem.

## CNES: descoberta e decisão

A consulta histórica original respondeu HTTP200 com filtros selecionados SP35/SJC354990/competência202412. [cnes-extracao.json](cnes-extracao.json) contém52códigos originais, locators e cabeçalhos.

Sem complementares:1.569 leitos existentes, incluindo88 hospital-dia. Complementares:352 existentes. Não anunciar1.569 como internação convencional nem1.921 como total antigo “hospitalares” sem definir a inclusão de hospital-dia e cuidados intermediários. A coluna complementar se chama HABILITADOS, enquanto os demais grupos usam SUS. Não somar habilitados aos leitos SUS e não tratar existentes menos habilitados como leitos privados/não-SUS.

Candidatos exatos: UTI adulto tiposI/II/III (74/75/76)=225 existentes; pediátricaII/III (78/79)=23; neonatalI/II/III (80/81/82)=59. São agregações por códigos especificados, que excluemUTI-Q83, coronarianas85/86 e cuidados intermediários92/95. A equivalência com o rótulo do KPI suspenso depende de definição/validação independente. Antigos valores240/42/58/846/1.894 não foram comprovados. Manter os indicadores CNES suspensos neste pacote; pode registrar as linhas reproduzidas no evidence store como candidatos de universo explícito.

RAG2025 p.10 contém155 estabelecimentos públicos ou prestadores SUS de12/2025; não universo completo do CNES, não825 nem528 e não necessariamente unidades em funcionamento sem situação cadastral comprovada.

## Visualizações, testes e pendências

A inspeção das funções existentes identifica nove famílias de gráficos: leitos, mortalidade infantil, vacinas, causas, nascidos, dengue, internações, APS e produção. Leitos/produção devem conservar fallback; parto/vacinas sem comprovação precisam null sem preenchimento. O gráfico dengue marca2024(SE1–50); qualquer nova série CVE deve ter rótulo/universo separado, evitando transformar a notícia parcial em total anual. APS tem comentário legado “ESF”; títulos e unidade de consultas devem ser revisados contra a definição SISAB. Uma correção textual não é redesenho.

[reproduzir_ativos.py](reproduzir_ativos.py) passou101checks de produção: valores atuais, percentuais/topCID, taxas publicadas, preservação de denominadores null, suspensões e hashes primários. [extrair_historicos.py](extrair_historicos.py) verifica pelo menos20capítulos por tabela e somas contra TOTAL impresso; [extrair_cve.py](extrair_cve.py) verifica12meses em três medidas para cada ano. [extrair_cnes.py](extrair_cnes.py) confirma filtros e códigos. Esses checks não substituem o validador independente solicitado, que deverá reextrair os PDFs por parser próprio e exercer filtros/exportações no runtime. As regressões gerais são responsabilidade do integrador.

Reprodução local: executar extrair_historicos.py, extrair_cve.py, extrair_cnes.py e reproduzir_ativos.py com python -X utf8, a partir da raiz do repositório. Os scripts coletar*.py consultam URLs originais e não sobrescrevem arquivos já existentes; para nova coleta usar outra rodada e preservar a manifest anterior. pypdf é necessário. Tentativa de download das notas SIH/TabNet terminou timeout HTTP000; a definição AIHs também foi consultada na publicação oficial via navegador web, mas o bruto não foi recuperado. Isso não invalida os números de internações explicitamente impressos no RAG, e impede alegar extração direta nacional concluída.

Oportunidades reais: SINASC/SIM/SIH direto TabNet/DBC por residência e versão, incluindo vias de parto/idade materna; séries mais antigas RAG2016–2018 com extração ou OCR auditado; CNES por estabelecimento/status e competência mensal; vacinação por residência e faixa etária usando denominadores/versão do PNI; extensão CVE anterior a2019 com diferenças de residência/autóctones explicitadas. Nenhuma inferência territorial nem fechamento artificial foi realizado.
