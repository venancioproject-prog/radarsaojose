# Andamento da finalização do Radar São José

Atualizado em 12/11/2026.

Estimativa atual de aproximadamente 70% concluído e 30% restante. As estimativas por área abaixo têm média simples de 70%. Servem para organizar o trabalho e não representam prazo, probabilidade de falha ou certificação de segurança.

## Ambiente de referência

- Branch de publicação de teste: codex/radar-integracao.
- Base funcional publicada: 85a6e0f; esta atualização acrescenta alinhamento de senhas e modelos de e-mail versionados.
- Preview integrado: https://radarsaojose-git-codex-radar-integracao-tagma.vercel.app/
- Supabase de teste: zidlawqyqlysecsweggn.
- A integração GitHub/Vercel confirmou a publicação do commit 6125e11.
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

- 38 testes automatizados passaram com zero falhas.
- A bateria financeira adicional em PostgreSQL descartável também passou.
- A sequência existente de migrações e a nova 022 foram testadas localmente.
- A 022 foi aplicada duas vezes no teste local para conferir reaplicação.
- Administrador sem segundo fator e usuário comum não leem as novas tabelas.
- Histórico, revisão e rejeição de gravação desatualizada foram testados.
- Cadastro por e-mail e primeiro acesso Google foram testados com serviços simulados. Falta reteste completo com contas reais.
- No navegador local foram conferidos lista, nome com apóstrofo, texto contendo HTML, abertura da ficha e reabertura de anotação.
- No Preview publicado, consultas e tentativa de salvamento anônimas retornaram HTTP 401.

Comando da bateria principal:

    node --test tests/billing-browser-security.test.cjs tests/pricing.test.cjs tests/survey-preview.test.cjs tests/integration-security.test.cjs tests/crm-security.test.cjs

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
| CRM do Radar | 80% | 20% | Validar salvamento visual com duas contas |
| Pagamentos Asaas | 85% | 15% | Casos de falha e reteste final |
| Bloqueios e acessos por plano | 75% | 25% | Contas e vigências finais, convidados e publicação |
| Termos e privacidade da pesquisa | 90% | 10% | Auditoria final das políticas e conteúdo real |
| Conteúdo real pago | 35% | 65% | Homologar gráficos e capítulos reais |
| Retirada de Eleições 2026 | 50% | 50% | Concluir dependências e levar a retirada à versão oficial |
| E-mails e identidade visual | 90% | 10% | Recebimento real e destino definitivo das imagens |
| Preparação e publicação oficial | 30% | 70% | Integração, cópia de segurança e validações |

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
