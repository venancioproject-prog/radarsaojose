# Revisão atual: evidências e limites

Data: 12/11/2026. Ambiente de código: codex/radar-integracao. Este documento atualiza a leitura dos relatórios antigos; não certifica produção nem substitui a conferência de todos os requisitos do ASVS.

O cadastro, os pagamentos e o CRM têm testes de proteção e verificações registradas.
O conteúdo completo ainda precisa de integração e aprovação em ambiente protegido.
O pacote privado do Report foi preparado sem modificar o banco remoto.
Configurações de produção, recuperação de cópia de segurança e testes com as duas administradoras continuam pendentes.
O site ainda não deve ser declarado totalmente seguro ou pronto para lançamento.

Evidência anterior: 57 testes passaram localmente e no GitHub (execução 43157824121), com publicação Vercel confirmada para f6b11fb. As 82 referências locais de mídia do pacote do Report responderam HTTP 200 no Preview. O teste de importação do pacote real usou apenas PostgreSQL descartável e preservou integralmente o HTML. A rodada da fila ampliou a bateria para 63 testes aprovados localmente e no GitHub (execução 43266150127), publicou a30a28f e aplicou a estrutura desativada no Supabase de teste, sem enviar mensagens. A rota do processador e as duas tabelas negaram consultas sem autorização.

## Fontes consultadas diretamente

- [vibe-security, checklist original](https://github.com/astoj/vibe-security/blob/main/web-app-security.md): organização das 17 áreas abaixo.
- [OWASP, gestão de segredos](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html): consulta sobre armazenamento e uso de credenciais. A coleção inteira não foi novamente percorrida nesta rodada.
- [Mozilla websec-check](https://github.com/mozilla-services/websec-check): referência histórica para configuração; o repositório está arquivado e não é um verificador atual de aprovação automática.
- [OWASP ASVS](https://github.com/OWASP/ASVS): a versão estável indicada na fonte consultada é 5.0.0. A matriz final de Nível 1, requisito por requisito, segue pendente; leitura do guia e testes existentes não equivalem a essa aprovação.
- [Supabase, tipos de chave](https://supabase.com/docs/guides/getting-started/api-keys): chaves publicáveis/secretas modernas usam apikey; não são o token de sessão do usuário.

## Problemas e ações verificadas

1. **MÉDIA, corrigida no código — destino de banco implícito.** Vibe: configuração e dados sensíveis; OWASP: segredos. `api/posts.js:34`, `api/upload.js:34`, `api/business-plan.js:13` usavam o endereço oficial como reserva quando faltava variável de ambiente. Conforme as outras credenciais presentes, isso podia direcionar uma operação de teste ao projeto errado. O destino fixo foi removido; URL/chave ausentes ou inválidas não iniciam consulta. Testes cobrem falta de configuração e destino explicitamente configurado. A publicação precisa conservar as variáveis corretas.

2. **MÉDIA, compatibilidade corrigida — chaves modernas tratadas como sessão.** `lib/supabase-api-headers.js:4` passou a separar as chaves de aplicação do token do usuário nas rotas de posts, upload e plano de negócios. Chaves modernas seguem somente em apikey; a compatibilidade com a chave antiga foi conservada. A identidade administrativa continua sendo verificada antes da operação. Testes cobrem upload e leitura de artigos com as duas formas; nenhuma credencial real foi usada neles.

3. **MÉDIA, pendente — scripts de terceiros variáveis.** `login.html:24` e `login.html:63`, com ocorrências em `app.html:71` e `app.html:157`, carregam Tailwind sem versão fixa e Supabase com a versão ampla @2. Isso permite que uma publicação externa mude o código executado sem alteração do Radar. Não foi demonstrada adulteração. Preparar uma versão fixa ou arquivos locais verificáveis e testar login, gráficos, mapa e telas antes de substituir. Risco da correção: médio, especialmente no Tailwind em tempo de execução. Conferência: comparar o visual e os fluxos com os arquivos fixados.

4. **MÉDIA, pendente — política do navegador parcial.** `vercel.json:12` tem uma CSP, uma regra que limita recursos do navegador, mas ainda não restringe as origens dos scripts. Os bloqueios atuais de objetos, base e enquadramento são úteis, porém não substituem essa restrição. Não é prova isolada de invasão. Preparar política em modo de observação e depois ajustar scripts locais, externos e trechos embutidos antes de impor bloqueio. Risco de alteração direta: alto para o funcionamento do frontend; por isso não foi imposta uma lista incompleta nesta rodada.

5. **Pendência funcional de lançamento — Report privado antigo incompatível.** `app.js:7768` exige todos os blocos e `app.js:7780` confere o resumo do script do mapa. O arquivo local report-complete-local-20261105.html não tem 15 dos blocos esperados e seu script não corresponde ao permitido. Não usar esse arquivo antigo para preencher o banco. A origem Git 9de76ef contém os 143 blocos e o script esperado; o pacote privado gerado preserva exatamente esses blocos. Conferir editorialmente antes de aplicar. O pacote não foi publicado nem importado remotamente.

6. **Pendência operacional — ativação e entrega financeira real.** A fila foi implementada em `lib/billing-email-queue.js` e na migração 023, com testes de recuperação e limite de retentativas. Sua estrutura foi aplicada ao banco de teste e ficou desativada/vazia, com acesso bloqueado a usuários comuns. A proteção contra repetição do provedor tem duração limitada; a fila interrompe tentativas incertas antes de ultrapassá-la. SMTP de autenticação do Supabase é separado. Configurar remetente/provedor, seguir FILA_EMAILS_FINANCEIROS.md e comprovar recebimento real antes de prometer entrega. Nenhuma mensagem real foi enviada nesta revisão.

## Cobertura das 17 áreas

“Verificado no teste” descreve somente as evidências citadas, não toda a área em produção. “Parcial” mantém trabalho aberto. Não foi encontrado nesta rodada não significa ausência garantida de falhas.

| Área | Situação | Evidência ou pendência |
|---|---|---|
| 1. Identificação e entrada | Parcial | Senhas e recuperação testadas; Google e sessões reais finais pendentes. |
| 2. Proteção das rotas | Verificado no teste | APIs administrativas exigem identidade e autenticador; testes negativos automatizados. |
| 3. Permissões por função | Verificado no teste | Planos, convidados, vigências e administração têm testes; May e produção pendentes. |
| 4. Segredos e dados restritos | Parcial | .env e variações ignorados; histórico e URLs conferidos. Variáveis oficiais ainda precisam de conferência. |
| 5. Mensagens de erro | Parcial | Falhas financeiras e configuração não expõem a resposta privada nos testes; revisar logs operacionais. |
| 6. Dados recebidos | Verificado no teste | Cobranças, campos do CRM, datas e HTML de e-mails têm validações testadas. |
| 7. Permissões do banco | Parcial | Migração 022 e bloqueios do teste conferidos; banco oficial e conteúdo real não aprovados. |
| 8. Hospedagem | Parcial | Preview publicado; cota Supabase e processo de lançamento pendentes. |
| 9. Comunicação protegida | Parcial | HTTPS e cabeçalhos configurados; CSP e scripts externos permanecem abertos. |
| 10. Acompanhamento e alertas | Pendente | Histórico de fichas/eventos existe; alertas e rotina de incidentes não foram comprovados. |
| 11. Testes de proteção | Parcial | Bateria automatizada e PostgreSQL descartável; avaliação final de produção pendente. |
| 12. Cópias e recuperação | Pendente | Não há restauração comprovada do banco oficial nesta revisão. |
| 13. Bibliotecas externas | Parcial | Ações de CI fixadas; dependências do navegador ainda precisam de tratamento. |
| 14. Limites contra abuso | Parcial | Checkout tem limite por memória da instância (`api/asaas-checkout.js:43`); proteção distribuída e do provedor requerem conferência. |
| 15. Privacidade | Parcial | Aceite imutável e limites de grupos testados; retenção, exclusão e uso operacional de contatos pendentes. |
| 16. Resposta a incidentes | Pendente | Roteiro de retorno preparado; responsáveis, alertas e exercício ainda não comprovados. |
| 17. Configuração por código | Parcial | Workflow só lê o repositório e fixa ações; proteção da branch/publicação ainda precisa ser configurada. |

## Correções de interpretação dos relatórios históricos

- Repositório público, por si só, não é uma vulnerabilidade. Segredos e permissões precisam estar protegidos mesmo com código visível. Não tornar o repositório privado como substituto dessas proteções.
- Uma chave publicável do Supabase não é uma senha administrativa. A chave privilegiada é que nunca pode chegar ao navegador ou ao Git.
- Não adicionar preload/includeSubDomains ao HSTS sem conferir domínio e subdomínios. A ausência isolada não demonstra falha explorável.
- CORS amplo não concede, sozinho, acesso administrativo: as rotas usam token e verificação de papel. Mudanças de CORS exigem conferir os endereços legítimos de Preview e produção.
- O fluxo atual de cartão é hospedado no Asaas; o diagnóstico histórico de que o Radar recebe número e código de segurança não descreve esta branch. Os testes atuais rejeitam esses campos antigos.

## Próxima sequência

1. Conservar o pacote privado fora do Git e validar a aparência e o conteúdo completo em ambiente protegido.
2. Revisar e corrigir as dependências externas e a CSP com comparação visual; não mudar as duas coisas indiscriminadamente.
3. Ativar e validar a fila preparada, o remetente, o provedor e o recebimento sem duplicação.
4. Conferir May, duas contas no CRM, convidados e nova tentativa de pagamento real no ambiente de teste.
5. Fechar a matriz ASVS Nível 1, a restauração de backup e as configurações oficiais antes do lançamento.
