# Cache privado da pesquisa — implementação local

Data: 19/11/2026. Branch: codex/lancamento-20261119, worktrees/radar-lancamento. Sem push/deploy, tráfego ao Supabase ou aplicação de migração nesta etapa.

## Comportamento

- lib/survey-data.js reutiliza snapshots da base somente no servidor. Prévia sintética continua independente e não lê o banco real.
- Cada snapshot bem-sucedido e não vazio vale cinco minutos a partir do fim da carga. Expirado, uma nova carga é obrigatória; falhas não retornam conteúdo antigo nem páginas incompletas.
- Leituras concorrentes da mesma projeção/configuração compartilham a carga em andamento. Cada consumidor recebe uma cópia JSON separada para impedir que um cálculo altere outro.
- A configuração é identificada por hash SHA-256 de destino, credencial privilegiada, ambiente e versão da pesquisa. Mudança de configuração/versão invalida as entradas. Segredos não são gravados nem exibidos.
- Duas projeções possíveis (completa e reduzida), no máximo 8 MiB de JSON retido por projeção, total de até 16 MiB de snapshots serializados por instância. Isso não limita o total de memória durante carga, cópias, cálculos ou requisições concorrentes.
- Respostas grandes continuam funcionando sem serem retidas. Resultados vazios e falhas não ficam em cache. A leitura paginada existente não mudou.
- Sessão, plano, assinaturas, convites e respostas HTTP autorizadas não são armazenados neste cache. As rotas mantêm a verificação de acesso antes de ler a base e mantêm Cache-Control: no-store.
- Sem cache compartilhado entre instâncias da hospedagem: uma instância nova precisa carregar a base. O ganho real depende de reutilização de instâncias e do padrão de acesso.

## Manutenção e atualização de dados

- RADAR_SURVEY_CACHE_ENABLED=false desativa e limpa os snapshots quando a próxima leitura ocorre; as consultas seguem pelo caminho original. Ao reativar, uma nova carga será necessária.
- RADAR_SURVEY_DATA_VERSION é um identificador do servidor: altere após corrigir/substituir a pesquisa e publique a configuração atualizada. Não colocar esse controle em query string ou permitir que usuários alterem o valor.
- Na manutenção de dados reais, planejar primeiro a desativação na hospedagem, aplicar a alteração autorizada, atualizar a versão e reativar após validação. Não foram realizadas essas ações nesta entrega.
- Sem invalidação por versão/reinício, alterações na pesquisa podem levar até cinco minutos para aparecer em uma instância. Cadastros, pagamentos e revogação de planos não dependem desse prazo: suas regras não foram colocadas no cache de pesquisa.
- Entradas expiradas deixam de ser utilizadas e são removidas na próxima leitura, troca de configuração ou desligamento. Não há persistência em disco e não se promete eliminação física da RAM pelo TTL.

## Testes executados

- Bateria completa node --test com todos os arquivos tests/*.test.cjs: 75 aprovados, zero falhas/ignorados, incluindo os seis novos cenários do cache e o teste novo do polling anterior.
- Testes focados iniciais: cache + pesquisa, 12 aprovados antes do caso adicional de paginação. Sintaxe dos dois módulos validada; git diff --check passou.
- Cenários novos: carga simultânea, cópias independentes, expiração e falha sem fallback antigo; projeções e configurações isoladas; conclusão de carga antiga após invalidação; limite de tamanho/vazio/falhas; controle de sessão/plano com cache aquecido; versão/destino/credenciais; desativação/reinício do cache; Preview sem banco real; erro na segunda página seguido de recarga completa de 501 linhas sintéticas.
- Exemplo simulado de três requisições (duas ao painel e uma ao Report): uma leitura da pesquisa e três verificações de autenticação/entitlement. Isso não é medição de bytes reais nem teste de capacidade do Supabase.
- Testes anteriores de privacidade por grupos, proibição de respostas individuais, plano necessário, capítulos privados, CRM e pagamentos continuaram aprovados.

## Pendências

Homologação autenticada/visual com contas autorizadas; integração da otimização do blog quando revisada; medição de tráfego e capacidade da candidata em ambiente apropriado. A implementação local não reduz o consumo do site oficial até ser publicada pela etapa de lançamento aprovada.
