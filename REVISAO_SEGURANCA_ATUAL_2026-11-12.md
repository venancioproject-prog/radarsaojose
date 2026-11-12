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

3. **MÉDIA, corrigida no Preview — scripts de terceiros variáveis.** As 45 páginas públicas são conferidas por scripts/audit-browser-dependencies.cjs. Tailwind 3.4.17 foi preservado em vendor, com os mesmos bytes do CDN anterior e sua licença; Supabase foi fixado em 2.119.0, também idêntico ao alias anterior. As 56 referências usam verificação SHA-384. A consulta OSV das 12 versões diretas restantes não retornou alertas conhecidos; isso não cobre todas as dependências internas nem vulnerabilidades desconhecidas. O Tailwind ainda compila estilos no navegador, sem otimização de compilação para produção.

4. **MÉDIA, reduzida no Preview — política do navegador parcial.** vercel.json passa a permitir scripts locais, caminhos externos fixos e resumos SHA-256 dos trechos aprovados. Bloqueia eval e scripts embutidos inesperados. Uma página local controlada comprovou os bloqueios e o funcionamento de botões existentes; nenhuma conta ou pagamento real foi criado. Atributos antigos como onclick permanecem explicitamente permitidos por script-src-attr e precisam de migração própria; a CSP não é proteção completa contra toda injeção. scripts/build-browser-csp.cjs deve ser executado quando os trechos embutidos mudarem; o teste acusa política desatualizada.

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
| 9. Comunicação protegida | Parcial | HTTPS e cabeçalhos configurados; Scripts fixados e CSP restritiva testada; eventos antigos em atributos ainda permitidos. |
| 10. Acompanhamento e alertas | Pendente | Histórico de fichas/eventos existe; alertas e rotina de incidentes não foram comprovados. |
| 11. Testes de proteção | Parcial | Bateria automatizada e PostgreSQL descartável; avaliação final de produção pendente. |
| 12. Cópias e recuperação | Pendente | Não há restauração comprovada do banco oficial nesta revisão. |
| 13. Bibliotecas externas | Parcial | Ações fixadas; 13 arquivos de 12 pacotes diretos com versão e integridade, auditoria OSV automática. |
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

## Rodada de dependências e navegador

- 67 testes locais aprovados, incluindo bloqueios da política e preservação da exportação por impressão.
- Removido html2pdf.js 0.10.1 de admin-crm.html: pacote não usado com alerta alto [CVE-2026-22787](https://github.com/advisories/GHSA-w8x4-x68c-m6fc). Não foi demonstrada exploração no Radar. A função atual chama window.print e foi preservada.
- Mantidas cores, campos e regras de cadastro. Medições locais de fontes/cores/alturas conferidas; a diferença de largura observada na comparação entre abas foi afetada pelo tamanho real de cada viewport e não foi tratada como prova de regressão.
- Cópia salva de WordPress Landing page.html e seus arquivos deixam de ser publicados; o código foi conservado no Git.
- Conferência de integridade: [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity). Limite do compilador no navegador: [Tailwind](https://v3.tailwindcss.com/docs/installation/play-cdn).

## Respostas individuais da pesquisa: correção adicional

**ALTA, corrigida na migração preparada; banco real ainda pendente.** data/migrations/017_paid_data_rls.sql:72 concedia SELECT a authenticated e a política liberava linhas individuais a assinantes. Isso contornava a privacidade dos gráficos agregados; o teste anterior aceitava explicitamente a leitura de uma linha pela conta Report. A 024_private_survey_responses.sql retira leitura da tabela e de cada coluna para visitantes e sessões de navegador, incluindo administradores. Mantém service_role para cálculos no servidor e não modifica INSERT da coleta desconhecida. A sequência local testou Grátis, Dash, Report, Mídia e Admin com segundo fator: todos rejeitados, servidor permitido, reaplicação sem erro. As tabelas respostas_pesquisa e respostas radar não foram encontradas no catálogo do banco TESTE; não há estrutura a alterar nele. Não consultar nem aplicar no banco oficial sem a etapa de lançamento. O Preview continua usando a base sintética, e as rotas agregadas continuam passando.

**BAIXA, corrigida — processador por método de leitura.** api/asaas-webhook.js:204 aceitava GET para reservar/enviar um e-mail da fila. A fila está desativada, e a chamada já exigia segredo separado. Agora só POST pode processar; GET/HEAD/OPTIONS retornam 405 sem tocar no processador. Documentação de ativação atualizada; nenhum cron foi configurado.
