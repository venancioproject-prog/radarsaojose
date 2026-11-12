# Operação de segurança antes do lançamento

Atualizado em 12/11/2026. Roteiro preparado; alertas, responsáveis e recuperação de produção ainda precisam de execução e aprovação operacional. Não há certificação nem monitoramento ativo implícito neste documento.

## A cada publicação

1. Confirmar branch e commit do Preview. O endereço codex/radar-integracao usa o banco TESTE; o site oficial não deve receber segredos/configuração desse ambiente.
2. Aguardar a ação de segurança do GitHub aprovada e a Vercel em sucesso. O workflow consulta alertas públicos dos pacotes diretos; indisponibilidade da consulta falha visivelmente.
3. Executar `node scripts/check-preview-release.cjs`. O comando só faz GET no Preview integrado, sem login, dados pessoais, cobrança ou gravação. Confere páginas, cabeçalhos, integridade de arquivos locais, arquivos restritos e negação de acesso anônimo.
4. Fazer teste visual autenticado com administrador e conta paga: CRM, gráficos, Report/Mídia e saída da conta. A checagem anônima não substitui esse teste.
5. Ao mudar scripts embutidos, executar `node scripts/build-browser-csp.cjs` e revisar o diff antes de publicar. Não liberar unsafe-eval/unsafe-inline para esconder um erro.
6. Arquivar evidências sem chaves, tokens, respostas da pesquisa ou dados de cartão.

## Atualizações de bibliotecas

Prazos propostos, a confirmar com o responsável operacional:

| Situação | Triagem | Objetivo de correção ou contenção |
|---|---|---|
| Exploração confirmada ou falha crítica aplicável | Imediata | Conter imediatamente; corrigir em até 24 horas quando tecnicamente possível |
| Alta aplicável | Até 1 dia útil | Até 7 dias; antecipar se houver exposição pública |
| Média aplicável | Até 5 dias úteis | Até 30 dias |
| Baixa aplicável | Até 10 dias úteis | Até 90 dias |

Revisar aplicabilidade com versão, caminho de uso e exposição. Registrar responsável e prazo. Componentes sem uso devem ser removidos. Atualizações precisam de integridade, licença, teste e publicação verificada. Sem revisão de dependências internas, a consulta dos pacotes diretos permanece cobertura parcial.

## Alertas que faltam ativar

- Falha no GitHub Actions e publicação recusada na Vercel: escolher destinatários e confirmar recebimento de um alerta de teste.
- Asaas: entregas de webhook com erro e diferença entre pagamento confirmado e plano ativo. Não liberar plano por comprovante enviado pelo cliente.
- Fila financeira: estados needs_review, atraso e repetição de falhas, sem registrar endereço pessoal ou segredo em logs. Seguir FILA_EMAILS_FINANCEIROS.md; a fila continua desativada.
- Supabase: uso/cota, erros Auth, armazenamento, banco indisponível e falhas de backup. O aviso de cota exibido na organização ainda precisa de resolução pelo titular.

Não foram contratados serviços, cadastrados destinatários ou ativadas mensagens nesta rodada.

## Cópia de segurança e restauração

Antes de produção, o titular precisa definir plano, retenção e responsável. A cópia deve incluir banco, papéis/permissões, arquivos privados do Storage e configurações indispensáveis. Guardar segredos em cofre próprio; não colocar dumps ou chaves no Git.

O teste exigido é restaurar em projeto isolado e conferir contas sem alterar senhas, políticas, termos imutáveis, pedidos/assinaturas, notas do CRM e conteúdo privado. Conferir que visitantes e contas comuns continuam bloqueados. Um arquivo exportado sem restauração não comprova recuperação. Testes em PostgreSQL descartável já existem, mas não substituem a restauração de uma cópia real.

## Se houver incidente

1. Registrar horário, ambiente, sintomas e responsável, sem copiar segredos para o chat.
2. Conter o recurso afetado, conservando evidências. Não apagar banco ou logs para fazer o erro desaparecer.
3. Se houve vazamento de chave, revogar/rotacionar a chave no provedor e atualizar somente os ambientes afetados. Mudanças de credenciais e permissões exigem o titular.
4. Corrigir a causa e testar a tentativa que demonstrou a falha, incluindo acesso negado.
5. Restaurar/publicar somente a versão e configuração validadas. Reavaliar pagamentos recebidos durante a interrupção para não cobrar nem ativar em duplicidade.
6. O responsável avalia comunicações e obrigações de privacidade com orientação apropriada.

## Retorno de versão

Escolher um commit conhecido e validado e criar uma nova publicação de Preview antes de promover produção. Retornar somente arquivos de interface não desfaz migrações nem pagamentos. Migrações 022–024 não devem ser apagadas para tentar reverter o visual; planejar uma correção compatível. Em especial, não reabrir leitura de respostas individuais para resolver gráfico quebrado.
