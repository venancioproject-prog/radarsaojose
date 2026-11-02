# Oportunidades para a próxima revisão

Sim, há melhorias úteis além de cortes de 2023/2024. Priorizar séries e denominadores comprováveis antes de acrescentar cartões. As oportunidades abaixo são trabalho futuro, não dados já incorporados.

| Prioridade | Eixo | Oportunidade | Fonte primária | Condição |
|---|---|---|---|---|
| Alta | Educação | Censo 2024/2025 e séries 1995–2025; matrículas, docentes, estabelecimentos, turmas e infraestrutura | INEP sinopses; arquivos municipais e notas de cada edição | Extrair por rede/etapa, guardar denominadores e quebras. 2023 já extraído em 165 tabelas. |
| Alta | Educação | Rendimento, abandono, reprovação, distorção idade-série, infantil e ensino médio | INEP indicadores educacionais, SAEB e resultados por etapa | Catálogos localizados; séries não homologadas nesta consolidação. Não usar proficiência como percentual. |
| Alta | Demografia | Relacionar polígonos municipais e setores censitários | IBGE malha + camada oficial municipal e chave de agregação | Comprovar origem, recobrimento, população de referência e regra de interseção antes de ativar mapa. |
| Alta | Saúde | CNES completo e séries SINASC/SIM/SIH com versões de extração | DATASUS/CNES e TabNet, SMS | Separar SUS/não-SUS, residência/ocorrência, AIH/internação e taxas SMS; preservar versão. |
| Alta | Segurança | Vítimas, furtos/roubos de veículos e séries mensais | SSP tabelas mensais primárias | Endpoint agregado mostra zeros incompatíveis com FRV; conferir definição antes de usar. |
| Alta | Mobilidade | Reprodução do parser tabular com meses vazios | PDF de bilhetagem municipal | 42 overrides ativos. Refazer parser preservando coluna, testar agosto/setembro e não alterar arquivo histórico. |
| Alta | Mobilidade | ANAC: recortes e ausências | ANAC arquivos e dicionários de dados | Somente comparar mesmo universo; ausência não significa aeroporto sem movimento. |
| Alta | Desempenho | Carregamento de dados por eixo e cache validado | Package/loader atual | Proposta exige autorização de arquitetura; não implementada. Exportação deve manter todos os eixos e evidências. |
| Média | Economia/Finanças | Simplificação de P1.1/P2.1 e leitura de períodos | Dados já comprovados | Avaliar usabilidade numa etapa visual autorizada; sem redesenho nesta operação. |
| Média | Meio Ambiente | Mais histórico de estações e séries comparáveis | CETESB/SNIS/SINISA/INPE | Qualidade do ar anual não nasce de um snapshot. Não unir indicadores de conceitos distintos. |

Catálogos: [INEP sinopses](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas), [indicadores educacionais](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais), [IDEB](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/resultados). Metas: [ciclos 2007–2021](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/metas).
