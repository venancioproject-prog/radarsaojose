# Confirmações financeiras: fila preparada, ativação pendente

Atualizado em 12/11/2026. Não foram enviados e-mails reais por esta revisão. A migração 023 foi aplicada no Supabase de teste zidlawqyqlysecsweggn e conferida: enabled=false, zero mensagens e acesso negado para visitantes e usuários comuns. Nenhum agendamento foi criado. Produção não foi alterada.

## O que foi implementado

Quando ativada, a fila guarda a referência do pedido confirmado na mesma transação que muda seu estado para pago. Uma transação é um conjunto de gravações que termina inteiro ou é desfeito inteiro: não se perde o pedido de e-mail entre a confirmação e a gravação da fila. Isso não modifica os critérios que aprovam pagamentos nem o valor cobrado. Uma falha de banco nessa transação exige retentativa do evento; uma falha posterior de envio não desfaz o acesso confirmado.

A migração não acrescenta clientes antigos à fila e começa com enabled=false. Reaplicá-la não ativa o envio nem muda essa escolha. Há no máximo uma linha por pedido; confirmar mais uma parcela não gera outro e-mail de compra.

O processador reserva uma mensagem por vez por dois minutos. Só a reserva atual pode concluir o trabalho. Uma execução interrompida pode ser recuperada após esse prazo. As tentativas temporárias aguardam pelo menos cinco minutos e aumentam o intervalo. O limite é de seis tentativas e até vinte horas a partir da primeira tentativa de envio. Depois disso, a mensagem exige revisão humana, conservando o estado financeiro do pedido.

A janela de vinte horas deixa margem dentro das 24 horas de deduplicação documentadas pelo Resend. Deduplicação significa reconhecer uma repetição do mesmo envio. Não é garantia absoluta de entrega única: resposta perdida ou falha depois da aceitação pelo provedor podem deixar o resultado incerto; não reenviar manualmente depois da janela sem conferir o provedor.

O destinatário vem do pedido salvo e confirmado. A chamada do agendador não aceita destinatário, valor, texto ou pedido escolhido pelo visitante. Pedidos já cancelados não são enviados; vigência expirada vai para revisão. O registro conserva contador, datas, reserva, código resumido do resultado e identificador do provedor. Não copia cartão, corpo do e-mail, resposta bruta do provedor ou endereço do cliente para a fila.

## Arquivos

- data/migrations/023_billing_email_outbox.sql: tabelas, disparador transacional e funções protegidas.
- lib/billing-email-queue.js: leitura do pedido e processamento de uma reserva.
- lib/billing-email.js: mensagem e integração existente com Resend.
- api/asaas-webhook.js: modo opt-in e chamada protegida do processador na rota existente.
- tests/billing-email-queue.test.cjs: testes PostgreSQL e serviços simulados.
- tests/payment-events-security.test.cjs: proteção da rota do agendador e preservação da confirmação financeira.

Não foi acrescentada função pública à hospedagem: continua sendo usada a rota existente de webhook. O limite de duração dessa função foi ajustado para 60 segundos; a confirmação financeira não aguarda o processamento da fila no modo novo.

## Configurações necessárias, sem valores secretos

| Configuração | Uso |
|---|---|
| RESEND_API_KEY | Credencial do provedor financeiro, somente no servidor. |
| BILLING_EMAIL_FROM | Remetente explicitamente configurado e autorizado pelo provedor. |
| CRON_SECRET | Segredo separado do webhook, com pelo menos 32 caracteres; nunca publicar ou colocar na URL. |
| BILLING_EMAIL_QUEUE_ENABLED=true | Habilita a integração do servidor com a fila; ausente mantém o caminho anterior. |
| BILLING_EMAIL_DELIVERY_ENABLED=true | Permite ao processador usar o provedor; ausente mantém o processador desligado. |
| billing_email_queue_settings.enabled | Chave única no banco que ativa a criação e reserva das mensagens; começa falsa. |

SMTP do Supabase atende autenticação e não fornece essas configurações ao servidor do Radar. Não copiar a senha do Gmail para o código ou para este documento.

## Ativação em teste, antes de produção

1. Concluído no teste: migração 023 aplicada após conferência de que as tabelas da fila ainda não existiam. Em outro ambiente, conservar a revisão anterior e conferir a estrutura antes de aplicar; não executar toda a sequência novamente sem auditoria.
2. Concluído no teste: fila vazia, chave desativada, proteção por linha ativa e permissões de leitura, mudança da chave e reserva negadas a visitantes/usuários comuns. Nenhuma compra histórica foi incluída.
3. Configurar o remetente e o provedor no servidor do ambiente de teste e planejar o uso de um destinatário de teste autorizado. Esta etapa inclui envio real; não foi executada nesta revisão.
4. Preparar CRON_SECRET no armazenamento de segredos, sem divulgar o valor. Não reutilizar o segredo do Asaas.
5. Publicar BILLING_EMAIL_QUEUE_ENABLED=true com a chave do banco ainda falsa. A integração continua pelo caminho anterior enquanto a chave do banco estiver falsa. Aguardar a conclusão e a saída das execuções da revisão anterior antes da troca.
6. Pausar brevemente a criação de novos testes de pagamento durante a troca. Ativar a chave do banco. Após uma confirmação nova, conferir exatamente uma linha pending na fila. Confirmar novamente o mesmo evento e conferir que a contagem permanece uma.
7. Com autorização para o teste real, ativar BILLING_EMAIL_DELIVERY_ENABLED=true e chamar POST /api/asaas-webhook?emailQueue=1 com Authorization: Bearer seguido do CRON_SECRET. Essa chamada é de servidor, não de navegador. Conferir recebimento, sent_at e identificador no provedor. O indicador sent registra aceitação pelo provedor, não prova que o destinatário abriu ou que a caixa recebeu fora do spam.
8. Testar falha temporária, resposta perdida simulada, cancelamento do pedido e interrupção de reserva em ambiente isolado. Não induzir falhas financeiras na conta real.
9. Só então configurar um agendador autenticado com frequência compatível com o volume e as tentativas. Nenhum cron foi criado aqui. Uma chamada processa uma mensagem; verificar limites/custos da hospedagem. Um agendamento diário pode ultrapassar a janela de retentativa e levar mensagens para revisão.

O novo código, com a migração ausente e o opt-in desligado, preserva a entrega anterior. Com o opt-in ligado, uma falha ao consultar a fila retorna queue_unavailable e não tenta um envio direto incerto. Sem configuração de provedor, o processador não reserva mensagem nem consome tentativa. Pedidos antigos sem linha na fila retornam not_scheduled, sem alegar agendamento nem criar envios retroativos.

## Acompanhamento e retorno

Conferir quantidades por state e mensagens com state=needs_review. A API do processador retorna somente um resumo, sem destinatários. Não há tela administrativa para essa fila ainda; a conferência inicial precisa ser feita por operador autorizado no banco e no provedor.

Para pausar, desligar o agendador e BILLING_EMAIL_DELIVERY_ENABLED. Conservar as linhas da fila para investigação. Não apagar tabelas nem reativar o envio direto antigo enquanto houver confirmações pendentes, pois isso pode duplicar mensagens. Antes de voltar a uma revisão antiga do webhook, conferir as reservas e o histórico do provedor.

Não alterar à mão first_attempt_at, attempts ou uma mensagem sent para forçar reenvio. Resolver o motivo de revisão e conferir o histórico do provedor primeiro. A fila não configura retenção de longo prazo, alerta automático ou atendimento de incidentes; esses procedimentos operacionais permanecem pendentes.

Fonte da janela do provedor: [Resend, idempotência](https://resend.com/blog/engineering-idempotency-keys).

Evidência da implementação: revisão a30a28f publicada no Preview e execução GitHub 43266150127 aprovada, com 63 testes e bateria PostgreSQL local. A rota sem segredo e as tabelas sem sessão foram bloqueadas no ambiente publicado. Isso não comprova recebimento de mensagem real, que continua pendente.

O processador aceita somente POST. GET/HEAD/OPTIONS retornam 405 e não reservam nem enviam mensagens. Não cadastrar um cron GET da Vercel diretamente; usar um agendador capaz de enviar POST com o cabeçalho secreto. Nenhum agendamento foi ativado nesta revisão.
