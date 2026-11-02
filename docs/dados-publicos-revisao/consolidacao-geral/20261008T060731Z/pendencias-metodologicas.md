# Pendências para revisão humana

1. P4 segue aceita para continuidade, não homologada. Validar parser de bilhetagem em todos os layouts e recortes ANAC; conservar overrides/ausências; dispositivos físicos e primeira carga offline/CDN ainda não testados.
2. Demografia: procedência/escala dos 35 polígonos, crosswalk IBGE, cobertura territorial e classificação; estimativas 2024/2026 e urbanização sem versão primária compatível permanecem suspensas. Não transferir população municipal para cada setor.
3. Saúde: obter CNES completo por competência/universo, numeradores e denominadores compatíveis da mortalidade infantil, vias de parto, vacinação ausente, lacunas dengue 2019–2023 e distinguir semana epidemiológica/ano. Documentos SMS comprovam o que está impresso, não uma extração independente atual do DATASUS.
4. Segurança: vítimas distintas de ocorrências, rubricas veiculares e zeros-placeholder, CSI/DEIC/prisões/ranking sem prova. Não produzir cálculo de taxa com denominador reconstruído a partir de arredondamento.
5. Educação: históricos municipais de matrículas/rendimento/distorção/infraestrutura por rede e etapa ainda não concluídos para todos os anos; Censo 2023 não prova infraestrutura atual. Docentes por etapa podem duplicar pessoas. Escola/estabelecimento/funcionamento e matrícula/aluno são conceitos distintos. IDEB ensino médio/SAEB e residência de alunos precisam fontes próprias.
6. Finanças: resultado orçamentário não é saldo de caixa, superávit financeiro, resultado primário ou nominal. Preservar fases da despesa, total com intra e 2026 parcial. Economia: não estimar componentes PIB ausentes nem juntar universos CEMPRE/CAGED.
7. Meio Ambiente: quebras SNIS/SINISA, população/território/estação e edição do satélite. Snapshots de ar não preenchem médias anuais.
8. Performance: duas cópias volumosas no carregamento, primeira visita offline e custo real em dispositivo móvel/produção. Proposta de dados por eixo ainda exige autorização por alterar arquitetura.
9. P0 legado precisa contrato atualizado para fallbacks suspensos; suites antigas não constituem aceite desta consolidação. Login completo, fichas técnicas clicadas individualmente e endpoints históricos mudando no servidor continuam fora da verificação integral.
10. Arquivos brutos nacionais/ZIP/evidence stores antigos pesados permanecem locais e em manifests; para reprodução em outro clone, recuperá-los com SHA igual. Quando o órgão substituir edição sem arquivo histórico, registrar indisponibilidade; nunca aceitar automaticamente hash novo.

Nenhuma pendência autoriza preencher lacunas. Esta entrega não inicia P5.1, Saúde nova, redesenho ou deploy. Revisão humana é a próxima etapa.
