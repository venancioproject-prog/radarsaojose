# Segurança Pública — revisão independente de 08/10/2026

Parecer: confiabilidade parcial, com boa reprodução do núcleo SSP e duas classes de pendência: conflitos de edição/universo e indicadores administrativos sem metodologia suficiente. Nenhum dado compartilhado foi alterado por este pesquisador. Propostas dependem da validação independente do QA e do metodólogo.

## Inventário e evidências

O registry possui nove indicadores. `inventario-registry.json` preserva cada registro completo; `inventario-ground-truth.json` preserva as séries, estruturas e metadados ativos. O evidence store antigo de 06/10 permanece intacto e não foi usado como prova externa autossuficiente. A revisão recapturou as fontes originais: catálogo de municípios, dados anuais, taxas, 26 consultas mensais 2001–2026, produtividade2024, documentação oficial, notícia e ata CSI. O JS publicado do próprio portal permitiu identificar os parâmetros reais do endpoint mensal.

Todos os arquivos capturados têm URL original, data UTC, tamanho e SHA256 em `manifest.json`. `evidencias-reproduzidas.json` contém 545 registros criminais, seus valores mensais, total nativo, ID do delito, competência, filtro municipal e locator. Dois registros2015 foram rejeitados por ausência de competência publicada. `taxas-evidencias.json` contém 189 observações nativas de sete famílias1999–2025; ausência '-' permanece null. Não recalculamos taxas com denominador inferido.

| Indicador ativo | Antes | Evidência externa | Proposta / limite |
|---|---:|---|---|
| Homicídios2024 |23 ocorrências|Mensal id38 total23; anual homicidio23|Manter23; não chamar vítimas sem trocar variável |
| Taxa homicídios2024 |3,28/100 mil habitantes|TaxaDelito campo homicidios3,28|Manter taxa publicada; denominador exato pendente |
| Roubo de veículos2024 |null suspenso|Mensal id37 total143, soma12meses143|Candidato143 somente após QA+metodólogo |
| Furto de veículos2024 |null suspenso|Mensal id22 total724, soma12meses724|Candidato724 somente após QA+metodólogo |
| Total roubo-outros2024 |965|Mensal id30 total965 =959 id133 +6 carga id46 +0 banco id49|Manter965; corrigir texto que diz excluir carga |
| Prisões2024 |null suspenso|Produtividade grupo9 id88 total2170; soma12meses2170|Candidato2170 com rótulo nativo, sem assumir pessoas únicas |
| CSI2024 |null suspenso|Notícia03jan2025 reproduz2948 atendimentos acumulados desde implantação|Manter suspensão anual2024; possibilidade de indicador acumulado separado |
| Ranking cidades>500mil |null suspenso|Não reproduzido universo completo/denominador/ordenamento|Manter suspensão |
| Esclarecimento DEIC2024 |null suspenso|Sem numerador/coorte/denominador primário|Manter suspensão; ata2025 com90% não comprova87%2024 |

Os locators dos candidatos estão em `antes-depois-proposto.json`; esta matriz não integra nem promove valores.

## Filtros, universos e cálculos

Município560 é São José dos Campos no catálogo oficial. O filtro reproduzido é `tipoGrupo=MUNICÍPIO&idGrupo=560&grupoDelito=6`; produtividade usa grupo9. São recortes de município, não uma delegacia isolada, todo o DEINTER1 ou DEIC. O parâmetro municipal e o nome foram confirmados independentemente no JSON e no JS oficial. O código SSP560 não deve ser confundido com o código IBGE3549904.

Homicídio doloso id38 e vítimas id41 são universos diferentes. Em2025 são29 ocorrências e33 vítimas; em2024 coincidem em23. Não há igualdade geral nem conversão automática. A nota(2) oficial inclui homicídio doloso por acidente de trânsito em id38; id72 é subcategoria e não deve ser somado novamente. A nota(3) tem a mesma regra para vítimas id41/id73. Latrocínio id52 e suas vítimas id53 são categorias próprias. Não misturar homicídio com todas as mortes violentas intencionais ou mortalidade SIM.

O PDA2025, páginas20–22, explicita que total roubo-outros é soma de roubo-outros, carga e banco; veículos ficam separados. As taxas de furtos/roubos veiculares são por100mil veículos, enquanto FRVHabitantes usa habitantes. População residente usada pela SSP é Fundação SEADE. Não substituir pela população IBGE atual; não inverter uma taxa arredondada para obter denominador pretensamente exato.

Produtividade publica2170 prisões,1420 infratores presos em flagrante e1111 por mandado. Esses dois últimos somam2531 e não reproduzem2170. Preservar os indicadores nativos separados, sem somar categorias administrativas ou assumir pessoas únicas. CSI, SSP e DEIC medem atividades/coortes diferentes; não agregar resultados de operações interinstitucionais sem comprovar sobreposição.

## Divergências e quebras

Quatro conflitos entre endpoints primários ocorrem em2001: homicídios anual231 versus mensal229; roubos2935 versus2910; furtos4606 versus4528; FRV3112 versus3079. Os demais anos2002–2025 conciliam para homicídios, total roubo-outros, furto-outros e FRV. Ambas as respostas foram preservadas. Não escolher a edição recente por conveniência. Recomenda-se suspender os pontos de contagem2001 conflitantes nas séries canônicas até decidir a edição/universo, mantendo cada edição no histórico; a taxa nativa publicada42,15 merece tratamento separado, sem recalcular com229 nem248 vítimas.

Há quebra territorial expressa na documentação: atéjunho2001 os delitos eram contados por local de registro; a partir de julho2001, por local de ocorrência. Isso impede tratar2001 como ano territorialmente homogêneo. A quebra coincide com a divergência, mas não comprova por si a causa exata do conflito de endpoints.

Em2015 IDs132(estupro) e133(roubo-outros) apresentam `publicado=0`, total13/316 e valores emnovembro. Essas células não possuem cobertura mensal comprovada: valores normalizados permanecem null e totais são mantidos apenas como raw rejeitado. Não usar os zeros anteriores como ausências de crime. O dicionário de categorias muda:2011 não contém todas as categorias hoje disponíveis; ausência de ID não equivale a zero. Nos anos iniciais, rótulos totais continuam utilizáveis como publicados, sem reconstruir retrospectivamente subcategorias novas.

No endpoint anual agregado, `furtoVeiculo` e `rouboVeiculo` são zero emtodos2001–2025 apesar de FRV positivo e dos números mensais específicos. Esses zeros não são prova de ausência. Em2026 todas as categorias têm `publicado=8`: extrair apenas janeiro–agosto, preservar setembro–dezembro como null, apesar dos zeros do raw. Oito meses publicados não tornam o ano encerrado.

Metadados legados contraditórios continuam no registry: taxa2001 citada44,79 versus raw42,15; homicídios usam source_system mensal e URL anual; `trecho_bruto` dos roubos exclui carga indevidamente; suspensos trazem textos com números antigos e fórmulas afirmativas. Propõe-se mover esses campos para histórico de revisão, substituir `raw_file` ativo pelo mesmo locator/hash de `evidencia`, atualizar data somente quando revisada e não deixar textos legados funcionar como prova. Preservar o arquivo original, sem apagá-lo.

## Cobertura histórica e oportunidades

| Família | Comprovação atual | Lacunas / oportunidade |
|---|---|---|
| Contagens anuais agregadas |2001–2025;25anos|2001 conflita;2002–2025 conciliam com mensal |
| Mensais e vítimas |2001–2025;300meses por categorias históricas disponíveis|Categorias surgem/mudam;2015 dois IDs rejeitados; anexar seletivamente séries comprovadas |
| Taxas publicadas |1999–2025;27anos e sete famílias|Taxas veiculares1999–2000 '-' null; metodologia pré2001 Res150/95 vs160/01 |
|2026 parcial |Jan–ago,8meses|Set–dez null; atualizar quando competência oficial publicada |
| Produtividade municipal |2024;12meses,13categorias|Endpoint permite outros anos; coletar/reproduzir antes de ampliar, não presumir disponibilidade igual |
| CSI |Notícia03jan2025: acumulado desde implantação; ata11dez2025 também acumulada|Não são anuais2024; levantar datas-base comparáveis e definição de atendimento |
| DEIC esclarecimento |Não reproduzido2024|Obter anuário/relatório original, coorte de inquéritos e autoriaidentificada; percentual de notícia insuficiente |
| Ranking |Não reproduzido|Exige lista completa de municípios, população de referência, taxa/filtro uniforme e empates |

SSP disponibiliza também SPVida e bases de BO. São oportunidades reais de validar vítimas, feminicídio, local e revisões, mas não foram fundidas nesta etapa: um BO, sua complementação, vítima e natureza retificada não são observações aditivas. Primeiro reproduzir regras de deduplicação e natureza jurídica. A API atual informa publicações passíveis de retificação antes do Diário Oficial; arquivar edição e data é obrigatório.

## Visualizações existentes

O controller atual tem um gráfico de homicídios e três fallbacks explícitos em segurança (mensal, patrimônio e CSI). Não redesenhamos nem removemos componentes. A série homicídios exibe ocorrências, não vítimas. As séries prontas e validadas poderão alimentar as estruturas existentes depois da revisão independente; não levantar gates genéricos automaticamente porque alguns registros foram comprovados. O ponto2001 conflitante deve ser tratado também na exportação, mesmo se estiver fora do intervalo visual. Não foram geradas screenshots nem testes Chrome deste pesquisador; QA integrado deve conferir os gates, tooltips, filtros, zeros publicados, nulls e exportações.

## Testes e reprodução

Executar da raiz: `python -X utf8 docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/seguranca/reproduzir.py`.

Resultado:1169 verificações aprovadas: hashes de todos os brutos capturados, identidade560, somas dos meses publicados, totais por delito/ano, comparação dos dois endpoints, separação vítimas/ocorrências, veículos143/724, composição965, regra parcial2026 e produtividade nativa. Os quatro conflitos2001 e os dois registros2015 rejeitados são diagnósticos explícitos, não resultados arbitrariamente ajustados para passar.545 registros criminais foram inspecionados;543 têm competência publicada válida e dois permaneceram null.189 taxas nativas estão documentadas, inclusive ausências. Não foi alteradoapp.js, registry, ground truth, controller, package ou outro eixo.

`coletar.py`, `coletar_historico.py` e `fontes_adicionais.py` documentam a captura. Não os executar sobre esta edição congelada: para nova captura, copiar scripts para um novo diretório de competência/auditoria e comparar hashes; endpoints mutáveis não garantem mesmos bytes no futuro. O script reproduzir verifica a edição preservada e escreve somente relatórios próprios neste diretório. Regressões VM e Chrome dos oito eixos ficam sob QA/integrador, após integração segura.

Pendências restantes: validação externa independente dos candidatos, resolução pontual2001, população/frota exatas por edição SEADE, classificação/dicionário e mudanças históricas de categorias, DEIC e ranking, normalização dos metadados legados e testes dos novos dados nos componentes existentes. Parecer não equivale a homologação de todo o eixo.
