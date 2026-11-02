# Parecer metodológico independente — 08/10/2026

A integração é metodologicamente aceitável com recortes explícitos, revisão numérica independente e quarentena dos auxiliares não comprovados. Não há homologação integral dos quatro eixos. Foram examinados os quatro relatórios, propostas, decisões de universo e arquivos oficiais coletados por este revisor. Nenhum arquivo compartilhado foi alterado.

## Reprodução externa própria

A captura independente recuperou 14 fontes oficiais HTTP200: catálogos/metas INEP, escolarização IBGE, documento SSP, JSON SSP2024/2025/produtividade, CNES histórico, SMSQ3/2025 e RAG2025, SIDRA9923/metadados, SIDRA6579 e XLSXDOU2026. URLs, data UTC, bytes e SHA256 completos constam em [manifest.json](manifest.json); os originais permanecem em raw/. Os textos PDF extraídos possuem marcadores PAGE para localização.

[validar.py](validar.py) reproduziu 40 verificações: hashes/respostas, contagens e somas dos meses, composição roubo-outros, ocorrência versus vítima, estimativas, urbanização e confirmação XLSX. [testes-independentes.json](testes-independentes.json) preserva resultados e linha nativa XLSX. O script não recaptura nem sobrescreve os brutos. Conferir.py é coletor: futura edição exige diretório novo, preservando esta captura.

## Seis promoções com parecer favorável

|Indicador|Valor|Universo/locator|
|---|---:|---|
|Roubo veículos2024|143|SSP560,grupo6,id37,12meses|
|Furto veículos2024|724|SSP560,grupo6,id22,12meses|
|Prisões2024|2170|SSP560,grupo9,id88,variável administrativa nativa|
|Estimativa2024|724756|SIDRA6579/9324,referência1julho|
|Estimativa2026|729153|SIDRA6579/9324 e XLSXDOU2026,SJC3549904|
|Urbanização2022|98.72%|SIDRA9923:688155/697054; situaçãoIBGE|

Os três dados SSP têm total nativo igual à soma dos12meses. Prisões não significam pessoas únicas, nem1420flagrantes+1111mandados. A estimativa2026 passou a ter comprovação oficial atual: é preciso substituir a narrativa anterior de projeção linear mantendo sua versão arquivada. Urbanização municipal publicada tem outro recorte e diverge; conservar a divergência, sem trocar universos silenciosamente. Toda promoção continua condicionada ao QA separado, às regras de exportação e à aprovação do integrador.

## Decisões por eixo

**Educação.** Aprovar séries INEP por ano/edição/rede/etapa, sem média simples entre redes e sem tratar SAEB como percentual proficiente. Metas2023/2025 permanecemnull. Escolarização99.09%Censo2022 é de residentes6–14 e não matrícula. Censo2025V2 tem quebra de colunas/IFTP; não concatenar por posição. Docentes por etapa e especial/profissional podem se sobrepor. Preservar7316 como Técnica de nível médio, coluna17;7322 profissional total,coluna16, em série distinta. Corrigir denominador142850→163965, nomes e unidades do recorte2023; matrículas não alunos únicos. A inspeção de catálogos e critérios não substitui reextração das741célulasIDEB/quadrosCenso pelo QA.

**Saúde.** Atualizações documentais7.65mortalidade2025,57.95APS2025,41846SIH2025 e5028SIM2024 são aceitáveis com período e fonte municipal explícitos. Os PDFs primários reproduzem sistemas nacionais; não alegar extração direta nacional concluída. Taxas publicadas sem numeradores não são cálculos próprios. Histórico RAG2015–2025 pode integrar mediante mesma variável/residência/versão e preservação de todas as revisões. DengueCVE2019–2025 deve ficar separada da SMSSE1–50, por residência/mês início sintomas, autóctone/importado/notificado distintos. Diferenças não explicadas apenas por semanas finais. Manter9KPIs suspensos. CNES1569inclui88hospitaldia;352complementares têm HABILITADOS e não SUS;225UTIadulto74/75/76 é subset e não total de todasUTI. Esses achados não homologam rótulos antigos. BCG2025 continua parcial com data; APS não ESF; atendimentos SISAB não consultas médicas/pessoas únicas.

**Segurança.** Fonte SSP documenta local de registro atéjun2001 e ocorrência desdejul2001. Suspender quatro contagens canônicas2001 com divergência entre APIs, preservando ambas as edições; a quebra não prova a causa exata. Taxa nativa42.15 pode ser publicada separadamente, populaçãoSEADE e sem denominador invertido ou troca porIBGE. Ocorrências e vítimas2025=29/33nãointercambiáveis. Homicídio doloso por acidente de trânsito é subcategoria da nota, não somar duas vezes; não é toda morte de trânsito. Roubo-outros total inclui carga/banco e exclui veículos. IDs2015semcompetência válida ficamnull;2026sóJan–Ago, placeholdersfuturosnull. CSI2948éacumulado desdeimplantação, não anual2024; DEIC/ranking sem universo completo permanecem suspensos.

**Demografia.** Aprovar pirâmide2022 e espécies domiciliares como séries de categorias disjuntas com total/checks externos. Média domiciliar2.80 é695312moradores/247894permanentesocupados; população697054não é seu numerador. Censos1970–2022 e estimativas2001–2026 devem ser tipados e separados, sem interpolar lacunas. As35geometrias não têm crosswalk externo reproduzido;39áreas textuais e8regiões não validam o vínculo espacial. Namespaces CD_BAIRRO/setor distintos impedem join automático; áreas hardcoded ainda sem prova. Preservar quarentena espacial. Residual31cor/raça não pode ser distribuído artificialmente; pirâmides2000/2010, religião e demais auxiliares não comprovados mantêmnull.

## Integração e limites

A matriz executável [matriz-decisoes.json](matriz-decisoes.json) registra 30 decisões com motivo, recortes e fontes completas para os casos de captura própria. Arquivar metadados legados contraditórios, preservando evidências e histórico; o texto ativo deve acompanhar o valor efetivamente comprovado. Não liberar gates integrais de visualização por validação de um subset. Tornar as novas séries auditadas exportáveis separadamente e corrigir somente labels/denominador, sem redesenho ou alteração de app.js.

Este revisor não executou regressõesVM/Chrome nem homologou sozinho todas as células históricas. O agenteQA fará reextração independente e testes de integração/fallback/exportação. A leitura da fonte original e a adequação metodológica são etapas distintas da comprovação numérica completa. Permanecem limites de extração nacionalDATASUS, CNES/PNI, revisões históricas, documentação de dicionáriosSSP e correspondência territorial. Nenhum screenshot, deploy ou promoção compartilhada foi realizado por este revisor.


## Adendo — atualização de cinco ativos Saúde

A decisão genérica anterior cobria as atualizações. Este adendo explicita cincoIDs e adiciona reprodução própria das páginas24/26 do Q3/2025 e7 do RAG2025, a partir dos PDFs oficiais já preservados/hashados. A matriz agora contém30decisões; são cinco atualizações de competência de ativos, não promoção de suspensos.

|ID|Antes|Depois|Recorte|
|---|---|---|---|
|saude_mortalidade_infantil|8.2/2024|7.65/2025 preliminar|Anual publicado, por mil nascidos vivos; não6.77quadrimestral|
|saude_cobertura_atencao_basica|61.63/2024|57.95/2025|Cobertura populacional estimada APS|
|saude_atencao_basica_cnes_sia|61.63/2024|57.95/2025|Mesmo indicadorAPS, atualizar coerentemente sem dupla agregação|
|saude_internacoes_sih|38738/2024|41846/2025|InternaçõesSUS de residentes, edição consulta13/05/2026|
|saude_causas_mortalidade|4677/2023|5028/2024|ÓbitosSIM residentes;2025ausente|

Parecer favorável apósQA das células/cabeçalhos. Mortalidade2025 continua preliminar/revisável; não trocar status por definitivo. APS estimada não ESF nem cobertura observada; SINASC/SIM e taxas de outra edição não fornecem denominadores intercambiáveis. SIH/SIM estão sujeitos a revisão documental. Preservar valores anteriores nas séries e9KPIsnull. Adendo reproduzível por adendo_saude.py; fontes e hashes nas decisões individuais. Não executar gerar_decisoes.py isoladamente apósesteadendo: ele gera a matriz-base; para reconstrução executar em seguida adendo_saude.py.


## Clarificação final — séries nativas CNES e histórico demográfico

Após oQA separado reproduzir52linhas CNES/seletores SP35,SJC354990,competência202412, o parecer permite registrar cnes_codigos_202412 nas séries auditadas doGT e exportarJSON/CSV. A aprovação se restringe a52códigos discretos nativos com locatortr/código, fonte/hash e nome original da segunda coluna em cada grupo: SUS ou HABILITADOS. Não agrega UTI/total, não calcula nãoSUS, não ativa gráfico/KPI e não altera nenhuma das9suspensões Saúde. É dado nativo limitado, não equivalência com os antigos indicadores. O integrador deve vincular a evidênciaQA concreta na decisão final. A orientação anterior LIMITADO_EVIDENCE_STORE foi substituída na matriz por APROVADO_SERIE_NATIVA_LIMITADA_EXPORTACAO, diante da validação separada.

Demografia: seis censos1970–2022 e22estimativas2001–2026 serão famílias distintas, exportáveis, mantendo fallback visual. Limites territoriais/revisões e mudanças de edição condicionam comparabilidade, especialmente2010–2022; não unir censos e estimativas em tendência contínua, extrapolar1960 ou tratar ausência como observação. Sem critérios territoriais documentados, não atribuir variações automaticamente a crescimento real homogêneo.

Esta clarificação é revisão metodológica de subset aprovado porQA, sem edição de arquivos canônicos. Para reproduzir versões finais da matriz, preservar este arquivo/relatório como decisão assinada por rodada; os geradores anteriores representam etapas anteriores e não devem sobrescrever o parecer final sem reaplicar as clarificações.
