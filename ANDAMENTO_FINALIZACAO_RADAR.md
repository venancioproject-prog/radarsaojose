# Andamento da finalização do Radar São José

Atualizado em 12/11/2026.

Estimativa de organização: cerca de 80% concluído e 20% restante. A média simples das áreas abaixo é 77,5%, expressa em uma faixa aproximada de 5 pontos. Servem para organizar o trabalho e não representam prazo, probabilidade de falha ou certificação de segurança.

## Ambiente de referência

- Branch de publicação de teste: codex/radar-integracao.
- Código de referência desta rodada: f34d104. Inclui dependências fixadas, CSP, DOMPurify, correção da leitura individual da pesquisa e fechamento do canal público do plano. A fila financeira permanece desativada.
- Preview integrado: https://radarsaojose-git-codex-radar-integracao-tagma.vercel.app/
- Supabase de teste: zidlawqyqlysecsweggn.
- As publicações 1b97a46, 38d3de9 e f47e07b passaram na Vercel e no GitHub. A conferência final de f34d104 está registrada ao fim.
- O login publicado contém o campo de telefone e o CRM publicado contém esta revisão.
- A publicação oficial depende de integração e validações próprias de produção.

## Concluído nesta rodada

- [x] Corrigir o cadastro por e-mail que usava uma variável de telefone inexistente.
- [x] Adicionar telefone opcional com validação, incluindo números internacionais.
- [x] Coletar telefone no primeiro acesso usado por contas Google.
- [x] Corrigir o bloco de programação do CRM que estava interrompido.
- [x] Retirar código e formulários antigos que misturavam cache local, clientes de demonstração e dados comerciais presumidos.
- [x] Exibir nomes, e-mails, perfis e anotações como texto seguro.
- [x] Exigir segundo fator na proteção administrativa do servidor usada pelo CRM, posts, uploads e blocos.
- [x] Ler o aceite registrado na tabela protegida de termos.
- [x] Calcular acesso pela assinatura vigente e pelas licenças de convidados Mídia.
- [x] Fazer busca e filtros sobre a base completa antes da paginação.
- [x] Calcular indicadores globais e separar administradores e convidados dos totais comerciais.
- [x] Exibir falhas de consulta em vez de transformar silenciosamente clientes em gratuitos.
- [x] Preparar acompanhamento comercial com etapa, anotação, próximo contato e histórico no banco.
- [x] Proteger contra duas pessoas sobrescreverem a mesma ficha.
- [x] Avisar quando o envio de recuperação de senha atingir o limite.
- [x] Ajustar o CRM em janelas estreitas.
- [x] Publicar a revisão no Preview e conferir bloqueio de consultas anônimas.

O telefone foi escolhido como opcional. Ele fica disponível para contato sobre a conta e não representa autorização automática para campanhas.

## Evidências

- A bateria chegou a 68 testes automatizados; conferir a execução final registrada abaixo.
- A bateria financeira adicional em PostgreSQL descartável também passou.
- A sequência existente de migrações e a nova 022 foram testadas localmente.
- A 022 foi aplicada duas vezes no teste local para conferir reaplicação.
- Administrador sem segundo fator e usuário comum não leem as novas tabelas.
- Histórico, revisão e rejeição de gravação desatualizada foram testados.
- Cadastro por e-mail e primeiro acesso Google foram testados com serviços simulados. Falta reteste completo com contas reais.
- No navegador local foram conferidos lista, nome com apóstrofo, texto contendo HTML, abertura da ficha e reabertura de anotação.
- No Preview publicado, consultas e tentativa de salvamento anônimas retornaram HTTP 401.

Comando da bateria principal:

    node --test tests/*.test.cjs

O teste financeiro adicional depende do PGlite já instalado em LocalCache/Local/RadarSaoJose/tools/pglite-0.5.15. Não usar a opção --sandbox sem combinar um novo teste com o Leonardo.

## Etapa que depende do Supabase

- [x] Aplicar data/migrations/022_crm_account_followups.sql no Supabase de teste.
- [x] Validar gravação, histórico, revisão concorrente e bloqueio sem segundo fator diretamente no banco remoto, com reversão dos dados temporários.
- [ ] Entrar como administrador com autenticador no Preview.
- [ ] Salvar anotação e próxima data de contato.
- [ ] Atualizar a página e conferir persistência.
- [ ] Conferir a anotação em outro navegador ou na conta da segunda administradora.
- [ ] Tentar alterar a mesma ficha em duas abas e confirmar o aviso de versão antiga.

A migração cria duas tabelas para acompanhamento e histórico. A escrita ocorre pelo servidor com administrador verificado e segundo fator. Ela não concede planos ou altera pagamentos.

A estrutura está disponível no Supabase de teste. O teste transacional remoto passou e os dados temporários foram revertidos. A conferência visual autenticada de salvar/reabrir a ficha no Preview ainda precisa acontecer. A consulta remota também confirmou que is_crm_admin exige aal2 e is_admin delega a essa função; não reaplicar 014/021 por suposição.

## Configurações remotas conferidas nesta rodada

- [x] Site URL corrigida para a raiz do Preview integrado, retirando o destino antigo de primeiro acesso.
- [x] Quatro retornos exatos autorizados: primeiro-acesso.html?confirmacao=1, recuperar-senha.html?modo=redefinir, app.html e login.html. Sem curingas.
- [x] Senha mínima de 9 caracteres com maiúscula, minúscula, número e símbolo no Supabase e nas telas. A minúscula acompanha o preset disponível no provedor.
- [x] Troca segura de senha ativada; a exigência de senha atual permanece desligada para não impedir recuperação.
- [x] Avisos de senha alterada, autenticador adicionado e removido ativados em português.
- [x] Modelos de confirmação e recuperação atualizados. O link de recuperação aponta diretamente para a tela correta, usando TokenHash.
- [x] Logo PNG original transparente carregou no Preview do e-mail, com largura natural confirmada de 1164 pixels no modo escuro.

Os cinco modelos estão em emails-auth nesta branch. As imagens públicas da marca ficam no bucket radar-email-assets do Supabase de teste, com limite de 1 MB e PNG; não foram criadas permissões públicas de escrita. Na produção, preparar destino estável equivalente: os e-mails não devem depender de um projeto de teste que possa ser pausado. O modelo antigo verificacao-duas-etapas.html não é o aviso real de MFA do Supabase e não foi aplicado.

Falta conferir um novo e-mail recebido após estas últimas mudanças. O modo escuro depende do suporte de cada leitor; não há garantia de entrega fora do spam. A interface mostra aviso de limite de uso da organização Supabase, que precisa ser resolvido antes do lançamento; não foi contratado plano pago. A proteção contra senhas vazadas exige plano Pro e não foi ativada.

GET e PUT compartilham /api/crm-accounts. O acompanhamento é tratado em lib/crm-followups.js para manter a quantidade de funções dentro da estrutura aceita pela hospedagem. A primeira publicação adicionou uma função separada e foi recusada. A estrutura com a rota compartilhada foi publicada com sucesso.

## Tabela atual

| Área | Concluído | Restante | Pendência principal |
|---|---:|---:|---|
| Cadastro, login e recuperação | 90% | 10% | Reteste real por e-mail e Google após configurações |
| Administradores e autenticador | 75% | 25% | May e testes finais de acesso |
| CRM do Radar | 85% | 15% | Validar salvamento visual com duas contas |
| Pagamentos Asaas | 90% | 10% | Recusa e nova tentativa reais, reteste final |
| Bloqueios e acessos por plano | 85% | 15% | Teste real de convidados e publicação |
| Termos e privacidade da pesquisa | 90% | 10% | Auditoria final das políticas e conteúdo real |
| Conteúdo real pago | 50% | 50% | Pacote do Report preparado; falta integração protegida e aprovação dos conteúdos reais |
| Retirada de Eleições 2026 | 75% | 25% | Código ativo rastreado conferido sem o módulo; falta integrar a retirada na versão oficial |
| E-mails e identidade visual | 90% | 10% | Configurar provedor, ativar e validar recebimento financeiro e destino das imagens |
| Preparação e publicação oficial | 45% | 55% | Matriz e roteiro operacional preparados; backup, configuração e validações oficiais pendentes |

## Próximos passos

1. [x] Aplicar 022 no teste e validar proteção e persistência no banco.
2. [ ] Validar o CRM visualmente com Leonardo e May, após confirmação e autenticador próprios de May.
3. [ ] Fazer um cadastro real gratuito por e-mail e outro pelo Google.
4. [ ] Homologar os 477 registros agregados e os capítulos reais em ambiente protegido.
5. [ ] Completar pagamentos pendentes, recusas, estorno e liberação automática.
6. [ ] Concluir a retirada de Eleições na versão de lançamento.
7. [ ] Conferir recebimento dos novos modelos e logo em leitores de e-mail reais.
8. [ ] Preparar integração para produção, cópia de segurança e plano de retorno.

## Cuidados para continuidade

- O checkout principal em OneDrive contém alterações locais anteriores. A branch integrada é a fonte desta rodada.
- Comparar commits antes de integrar.
- As branches fix/seguranca-main, fix/seguranca-main-limpa e fix/seguranca-main-limpa2 têm falhas de checkout identificadas na revisão. Usam paymentMethod antes da declaração. A última também usa effEnv fora do escopo no webhook.
- SECURITY_REVIEW_2026-11-09.md contém afirmações históricas que precisam ser corrigidas, especialmente sobre exigência de segundo fator no servidor e estado das tabelas remotas.
- Ativação do autenticador na conta não comprova aplicação de todas as regras do banco.
- Consultor e oráculo ficam fora do escopo atual de lançamento.

## Conferência adicional de acessos em 12/11

- [x] Reproduzir antes da correção: titular de Dash/Report com convite Mídia era classificado somente pelo plano próprio, inclusive na API de mídia e no CRM.
- [x] Usar a mesma seleção de acesso efetivo no CRM e nos serviços: convite Mídia vigente prevalece sobre Dash/Report; Mídia próprio prevalece no empate.
- [x] Preservar a assinatura comprada. Remover ou vencer o convite devolve o acesso ao plano próprio vigente, sem alterar pagamentos.
- [x] Manter compradores nos indicadores comerciais quando também usam convite; convidados sem compra continuam separados.
- [x] Exigir Mídia próprio vigente e datas válidas para gerenciar vagas. Um convite não concede gestão da equipe.
- [x] Testar convite revogado, vencido, início futuro, estado de estorno e datas inválidas; manter o conteúdo bloqueado quando não há direito vigente.
- [x] Conferir o CRM publicado sem sessão: redireciona ao login.
- [x] Conferir consultas anônimas diretas no banco de teste, sem exibir dados: profiles retornou zero linhas; fichas, histórico, termos, assinaturas e pedidos retornaram HTTP 401.
- [x] Rodar novamente os 40 testes e a bateria financeira local, sem tráfego financeiro real.

A conferência anônima não substitui a validação com duas contas autenticadas. O navegador disponível não tem sessão administrativa do Radar; não criar senha, contornar o autenticador ou marcar esse teste como concluído. A retirada de Eleições não tem arquivos/rótulos ativos encontrados no código rastreado desta branch; ainda falta comprovar a integração na versão oficial, preservando as referências históricas legítimas sobre eleições municipais na seção História.

## Segunda rodada autônoma de 12/11

- [x] Conferir o webhook (notificação do Asaas ao Radar) com serviços simulados: token incorreto, corpo muito grande em bytes UTF-8, cobrança desconhecida, referência de outro pedido, valor divergente, pagamento não confirmado, comunicação indisponível, estorno e contestação do cartão.
- [x] Confirmar que essas falhas não chamam a ativação nem enviam e-mail de compra. Eventos duplicados não disparam nova confirmação por e-mail.
- [x] Corrigir o e-mail financeiro que chamava boleto de cartão, escapar texto inserido no HTML e usar nome neutro para plano desconhecido.
- [x] Exigir remetente financeiro explícito, sem inventar endereço de domínio. Usar chave estável por pedido/destinatário no Resend, que deduplica por até 24 horas; isso não substitui fila persistente.
- [x] Proteger também .env.production, .env.preview, .env.test e outras variações no Git, mantendo modelos .example.
- [x] Conferir o histórico Git completo disponível (repositório não raso), sem imprimir valores: nenhum caminho .env* encontrado fora dos modelos .example.
- [x] Conferir HTTP 404 no Preview para .env, .env.local, .git/config, migração 022, dados_pesquisa_477.json, fontes privadas do Report, app_recovered.html e modelo de recuperação.
- [x] Preparar checagem GitHub Actions com credencial somente de leitura, ações fixadas por revisão e PGlite 0.5.15 instalado sem scripts em máquina temporária. Ela não usa segredos de produção nem executa pagamentos remotos.

Limitação identificada naquela rodada: o SMTP do Supabase atende autenticação, enquanto o módulo financeiro implementava Resend e ainda não tinha fila persistente, apesar de um comentário antigo dizer que havia. A fila foi implementada depois e seu estado atual está na seção final. O provedor financeiro e a entrega real continuam sem comprovação; não marcar e-mails financeiros como entregues.

Fontes consultadas: https://docs.asaas.com/docs/webhook-para-cobrancas e https://resend.com/blog/engineering-idempotency-keys . O Asaas também possui eventos de captura recusada/análise de risco; o código atual não concede plano para eles. Ainda falta validar a experiência de nova tentativa após recusa com o checkout hospedado, sem duplicar cobrança.

## Preparação da versão oficial

O origin/main foi atualizado e comparado em leitura nesta rodada. Desde o ancestral comum com a branch integrada, as alterações próprias de main são as atualizações automáticas de vagas_sjc.json. A comparação entre as duas versões tinha 248 arquivos diferentes (incluindo imagens de prévia e código de segurança); quantidade de arquivos não mede risco. Nunca copiar só app.html para publicar: as APIs, os scripts, as migrações e as imagens correspondentes precisam acompanhar a mesma revisão.

Ordem de lançamento e retorno:

1. [ ] Identificar a revisão candidata exata e registrar a revisão anterior do Vercel. Conservar alterações locais anteriores no OneDrive.
2. [ ] Fazer cópia de segurança do banco oficial e conferir restauração em ambiente separado antes de aplicar migrações. Não executar 010..022 cegamente: há CREATE TABLE não reaplicável; comparar estrutura e permissões reais primeiro.
3. [ ] Validar conteúdo privado real: respostas da pesquisa, linhas de mídia e report_private_documents/radar-2026. O Preview usa conteúdo sintético de propósito quando VERCEL_ENV=preview; aprovar conteúdo real em ambiente protegido sem depender desse comportamento de demonstração.
4. [ ] Separar Supabase e Asaas oficiais dos de teste, conferir somente presença/destino das variáveis sem divulgar valores e preparar URLs de retorno e webhook oficiais. Não copiar token ou URL de teste por engano.
5. [ ] Preparar remetente e imagens dos e-mails em destino definitivo; o bucket atual de logos pertence ao projeto de teste. Decidir a configuração financeira e a estratégia de reenvio que ainda faltam.
6. [ ] Exigir sucesso da revisão automática no processo de integração. O arquivo do workflow sozinho não configura proteção da branch nem impede o Vercel de publicar um push.
7. [ ] Confirmar as contas administrativas, o autenticador, o acesso por plano e o fluxo final completo. Resolver a cota excedida da organização Supabase antes da abertura ao público.
8. [ ] Publicar a revisão candidata e conferir cadastro, recuperação, CRM, conteúdo real e liberação após pagamento. Cópia de código aprovada não valida configuração remota.
9. [ ] Se houver falha, retornar o Vercel à revisão anterior compatível. Não apagar/reverter tabelas nem eventos financeiros automaticamente: preservar as cobranças e conferir compatibilidade com o banco antes de qualquer retorno.

Resultado remoto comprovado: execução 43154044891 do workflow Revisão automática de segurança concluiu com sucesso em c3d1a69. Os testes de acesso/faturamento e a bateria PostgreSQL passaram no Linux temporário do GitHub. O Preview dessa revisão também foi publicado com sucesso. A revisão decdf95 integrou as vagas mais recentes do origin/main; o conflito desse único arquivo foi resolvido preservando integralmente vagas_sjc.json do origin/main, sem substituir código funcional.

Execução: https://github.com/venancioproject-prog/radarsaojose/actions/runs/43154044891

No fechamento anterior, o percentual era aproximadamente 73%: testes e rotina automática avançaram, mas conteúdo real, operação e configuração de produção continuaram abertos. A área de e-mails foi reajustada para explicitar o envio financeiro ainda não comprovado.

## Pacote do Report e configuração segura do servidor

- [x] Comparar o pacote privado antigo com os blocos esperados na aplicação: faltavam 15 dos 143 blocos e o script do mapa era incompatível. Esse pacote antigo não deve ser importado.
- [x] Preparar os 143 blocos da origem Git 9de76ef45924f6fadfea118fe7381a3fa2054e8a em pacote privado novo, preservando cartões internos, atributos, ordem do índice e o script permitido.
- [x] Testar importação e leitura no PostgreSQL descartável: o HTML voltou idêntico, incluindo caracteres em português. A consulta anônima foi bloqueada. Nenhum banco remoto foi alterado.
- [x] Conferir as 82 referências locais de mídia do pacote: todas existem no checkout e todas responderam HTTP 200 no Preview na repetição concluída. A primeira tentativa sofreu tempos limite; isso não foi classificado como imagem ausente.
- [x] Adicionar ferramenta offline que recusa gravar conteúdo pago dentro de uma pasta Git e não sobrescreve pacote anterior. A ferramenta não envia arquivos nem aplica SQL.
- [x] Remover endereços/chaves públicos de produção usados como reserva em api/posts.js, api/upload.js e api/business-plan.js. Configuração ausente/inválida agora impede a consulta; o cálculo em memória permanece independente.
- [x] Suportar chaves publicáveis e secretas modernas sem tratá-las como token de sessão, preservando suporte às chaves antigas.
- [x] Preparar relatório atual REVISAO_SEGURANCA_ATUAL_2026-11-12.md, com as 17 áreas, evidências, correções de interpretações históricas e pendências. A conferência completa ASVS Nível 1 permanece aberta.

Pacote local, fora do repositório:

    C:/Users/leose/AppData/Local/Packages/OpenAI.Codex_2p2nqsd0c76g0/LocalCache/Local/RadarSaoJose/private-release/report-2026-11-12/

Contém manifest.json, report-chapters.html e report-import.sql. O HTML tem 1.079.719 bytes e SHA-256 4be5a4512be8cf831652127cd0bc7b45bec085095aed5946fd903d4f7d5d5516. Não publicar essa pasta. O SQL substitui o registro radar-2026 se já existir: antes de aplicar, aprovar o conteúdo e conservar cópia do registro anterior. Não executar como tentativa de resolver o Preview de demonstração, que é intencional.

A ferramenta versionada é scripts/prepare-private-report.cjs. O pacote traz conteúdo real já rastreado na origem oficial, mas ainda não foi aprovado visual/editorialmente nem integrado ao banco oficial. Pesquisa quantitativa e mídia reais continuam pendentes. O frontend publicado não foi redesenhado nesta rodada.

Validação remota da revisão f6b11fb: Vercel informou publicação concluída e a execução GitHub 43157824121 terminou com sucesso, incluindo a bateria PostgreSQL. No Preview, /api/posts respondeu HTTP 200, /api/business-plan sem sessão respondeu HTTP 401 e os endereços da ferramenta e do pacote privado responderam HTTP 404.

Execução: https://github.com/venancioproject-prog/radarsaojose/actions/runs/43157824121

No fechamento anterior, o envio financeiro ainda dependia da implementação de fila. A seção seguinte registra essa implementação; cron, remetente e entrega real continuam pendentes.

## Fila financeira preparada e protegida

- [x] Implementar a migração 023: referência única por pedido, criação transacional ao confirmar pagamento e nenhum reenvio retroativo de compras antigas.
- [x] Reservar uma mensagem por vez, com prazo e identificação da reserva; uma execução antiga não conclui o trabalho assumido por outra.
- [x] Preparar recuperação após interrupção, intervalos de espera e limites de seis tentativas/20 horas. Depois disso, exigir revisão para não repetir um envio incerto fora da janela do provedor.
- [x] Separar erros temporários de erros permanentes e ignorar pedidos já cancelados. Não modificar o pagamento ao registrar falha de entrega.
- [x] Usar somente destinatário do pedido confirmado e guardar apenas estado/códigos resumidos na fila, sem duplicar dados do cartão ou destinatário.
- [x] Preparar processador autenticado por CRON_SECRET em POST /api/asaas-webhook?emailQueue=1, sem criar uma nova função pública na Vercel.
- [x] Proteger a ativação por duas flags do servidor e chave no banco, todas desligadas por padrão. Sem provedor configurado, não reservar mensagem nem consumir tentativa.
- [x] Testar atomicidade, permissões, reserva perdida, retentativa, esgotamento e autenticação do agendador em PostgreSQL descartável e serviços simulados.
- [x] Aplicar somente a migração 023 no Supabase de teste, após conferir que a estrutura não existia. Confirmar fila vazia, envios desligados, proteção por linha ativa e ausência de permissões para conta comum/visitante.
- [ ] Configurar provedor e remetente financeiro, validar entrega a destinatário autorizado e só depois ativar agendador compatível com os limites da hospedagem.

Procedimento: FILA_EMAILS_FINANCEIROS.md. A estrutura remota está preparada, mas não há fila ativa, cron, credencial nova, cobrança alterada ou e-mail real enviado por esta revisão. A troca para o modo novo precisa seguir a sequência documentada, conservando a chave do banco desligada até o servidor correto estar publicado.

Evidência remota: execução GitHub 43266150127 concluída com sucesso e publicação Vercel confirmada para a30a28f. A rota do processador sem segredo respondeu HTTP 401; o GET comum do webhook respondeu HTTP 405. As tabelas billing_email_outbox e billing_email_queue_settings negaram consulta anônima com HTTP 401. A migração e o documento operacional não são servidos pelo site (HTTP 404).

Execução: https://github.com/venancioproject-prog/radarsaojose/actions/runs/43266150127

## Fechamento da rodada: navegador, pesquisa e plano administrativo

- [x] Fixar 14 arquivos de 13 bibliotecas diretas, com integridade SHA-384 e licenças dos arquivos locais.
- [x] Remover html2pdf.js vulnerável e sem uso; exportação continua pela impressão do navegador.
- [x] Restringir scripts pela CSP e testar bloqueio de script inesperado, origem não autorizada e eval; botões existentes preservados. Eventos antigos em atributos ainda precisam de migração própria.
- [x] Acrescentar DOMPurify na limpeza de artigos e HTML salvo do plano, conservando tabelas editáveis e botões. Falha da biblioteca bloqueia o conteúdo recebido.
- [x] Fechar o canal público antigo do plano de negócios; sincronização autenticada automática pelo servidor permanece a cada 4,5 segundos. A presença instantânea fica suspensa até autorização privada comprovada.
- [x] Encontrar a reabertura da leitura de respostas individuais pela migração 017; preparar/testar a 024, bloqueando também todas as contas pagas e admin no navegador.
- [x] Confirmar que essas tabelas de pesquisa não estão no banco TESTE; o Preview usa dados sintéticos. Não aplicar nem abrir dados do banco oficial nesta etapa.
- [x] Exigir POST para processar e-mails, rejeitando GET/HEAD sem envio ou reserva.
- [x] Conferir os 70 IDs do Nível 1 do ASVS, com situação individual em MATRIZ_ASVS_N1.md. Inventário completo não significa aprovação dos requisitos.
- [x] Documentar o receptor original da pesquisa como ainda não identificado, distinguindo-o do formulário antigo do CRM: PESQUISA_ORIGEM_E_PRIVACIDADE.md.
- [x] Preparar roteiro de atualizações, alertas, incidente, retorno e restauração: OPERACAO_SEGURANCA_RADAR.md. Alertas e backup real ainda não foram ativados/comprovados.
- [x] Conferir o Preview por 17 checagens HTTP sem login/gravação: cabeçalhos, bibliotecas, páginas, arquivos privados e APIs anônimas.
- [x] Abrir artigo publicado com a proteção nova e testar a pergunta expansível: conteúdo carregou e botão funcionou, sem erro de script.
- [ ] Retestar plano administrativo com as duas contas e conferir alterações sem a colaboração antiga.
- [ ] Aplicar a 024 no banco com os dados reais e conferir gráficos + bloqueio direto na integração de lançamento.

### O que depende de participação, credenciais ou decisão do titular

1. **Entradas reais:** Leonardo com autenticador e May com e-mail confirmado/autenticador; salvar/reabrir CRM, teste em duas abas, conta Google e saída em computador compartilhado. Não criar senha nem contornar o segundo fator.
2. **Conteúdo real:** aprovar Report/pesquisa/mídia e integrar no banco correto. O blog também contém artigos de teste e textos com tarefas de apuração; revisar editorialmente antes de lançar, sem apagar conteúdo por adivinhação.
3. **Pesquisa original:** fornecer o sistema/link de coleta para conferir envio, responsáveis, consentimento e retenção. Saber qual tabela é lida não identifica o coletor.
4. **E-mails financeiros:** definir/remeter provedor e remetente, permitir um envio de teste e ativar fila/agendador seguindo o roteiro. Nada foi enviado nesta rodada.
5. **Infraestrutura oficial:** resolver cota Supabase, designar operação/alertas, comprovar backup e restauração, conferir variáveis e promover a versão correta. Produção não foi publicada nesta rodada.
6. **Conformidade restante:** decidir divergência da composição obrigatória de senha com ASVS 6.2.5; conferir proteção contra senhas conhecidas, revogação/limpeza de sessões e parâmetros dos provedores. Não declarar 100% de segurança.

O restante não equivale a prazo em meses nem a uma quantidade linear de código. Esta rodada resolveu riscos que a contagem antiga não detalhava; os percentuais permanecem estimativas de acompanhamento.

### Evidência final publicada

Código f34d104f25510b60b1ac9411b58eb61eaccc5f32: Vercel success e GitHub Actions 43275229158 success. A bateria tem 68 testes, além da bateria financeira PostgreSQL e da consulta OSV dos 13 pacotes diretos. A checagem pública posterior passou nos 17 pontos. O cadastro foi recarregado no navegador e não apresentou erros de script. A versão oficial/main não foi publicada nem substituída.

Execução: https://github.com/venancioproject-prog/radarsaojose/actions/runs/43275229158

Evidências locais fora do Git: cadastro-final-publicado-2026-11-12.png, tabelas-protegidas-validadas-2026-11-12.png e checagem-preview-final-2026-11-12.json, na pasta de visualizações desta conversa.
