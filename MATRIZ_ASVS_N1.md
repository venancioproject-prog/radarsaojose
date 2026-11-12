# Conferência ASVS 5.0.0 — Nível 1

Atualizada em 12/11/2026. **70 requisitos do Nível 1 identificados na fonte oficial; isto não significa 70 aprovações.** Cada linha registra evidência limitada, desvio ou trabalho pendente. Produção não foi certificada. “Evidência local” cobre o cenário revisado, sem declarar toda a aplicação conforme.

Fonte: [release oficial v5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0), arquivo 5.0/docs_en/OWASP_Application_Security_Verification_Standard_5.0.0_en.flat.json. SHA-256 da cópia consultada: 8201b20eec2908c3380ac600c91c8ba746346fbb808859366abb232027532311. Foram selecionadas somente linhas L=1. Os rótulos abaixo são resumos em português, não tradução oficial. Atribuição: OWASP ASVS, licença CC BY-SA 4.0; estes resumos derivados mantêm essa licença.

## Como interpretar

- Fornecedor: depende de Google, Supabase ou hospedagem; usar um serviço conhecido não basta para dar aprovação.
- Sem uso encontrado: aplicabilidade provisória, limitada ao código revisado.
- Decisão do usuário: divergência explícita preservada; precisa ser decidida antes de prometer conformidade integral.
- Preview: evidência de teste publicado, sem aprovação de produção.

Contagem por situação: Parcial: 20; Sem uso encontrado: 2; Pendente: 7; Evidência local: 18; Fornecedor: 15; Preview: 3; Teste configurado: 2; Confirmado pelo usuário: 1; Decisão do usuário: 1; Documentado: 1. Essa contagem não gera percentual de segurança.

| ID oficial | O que conferir | Situação | Evidência ou próximo trabalho |
|---|---|---|---|
| v5.0.0-1.2.1 | Saída segura de texto e HTML | Parcial | CRM usa textContent e e-mails escapam campos; radar-safe-content.js reconstrói artigos. Falta revisão de todos os pontos de HTML do plano de negócios. |
| v5.0.0-1.2.2 | URLs construídas com dados externos | Parcial | Filtros do CRM e pesquisa usam encodeURIComponent; radar-safe-content.js restringe protocolos. Falta inventário completo de URLs. |
| v5.0.0-1.2.3 | Dados inseridos em JavaScript e JSON | Parcial | Configuração pública serializada como JSON; trechos embutidos aprovados por hash. Falta revisão de todos os geradores de conteúdo. |
| v5.0.0-1.2.4 | Consultas protegidas contra injeção | Parcial | SQL do CRM parametrizado; chamadas REST codificam filtros. Faltam todas as funções e consultas legadas. |
| v5.0.0-1.2.5 | Comandos do sistema | Sem uso encontrado | As APIs revisadas não executam shell. Ferramentas locais de manutenção não estão publicadas. Manter verificação ao adicionar APIs. |
| v5.0.0-1.3.1 | Limpeza de HTML do editor | Evidência local | DOMPurify 3.4.17 com versão e integridade foi acrescentado antes da reconstrução restritiva do DOM. Teste no navegador preservou conteúdo editorial e removeu scripts/atributos/URLs perigosos; falha da biblioteca bloqueia conteúdo. |
| v5.0.0-1.3.2 | Evitar execução dinâmica de texto | Parcial | CSP bloqueia eval no navegador e teste confirmou. Falta varredura completa de bibliotecas internas e rotas legadas. |
| v5.0.0-1.5.1 | Leitores de XML protegidos | Sem uso encontrado | Não foi encontrado parser de XML nas APIs ativas revisadas. Formatos aceitos de upload são imagens. |
| v5.0.0-2.1.1 | Regras documentadas de entrada | Parcial | Regras de telefone, senha, CRM, dinheiro e upload estão no código/testes; falta catálogo único de todos os campos. |
| v5.0.0-2.2.1 | Valores e limites permitidos | Evidência local | Testes rejeitam preços, planos, documentos, filtros e campos comerciais controlados pelo cliente; não representa toda a produção. |
| v5.0.0-2.2.2 | Validação no servidor | Evidência local | Checkout, CRM e pesquisa validam decisões no servidor; testes tentam burlar o navegador. |
| v5.0.0-2.3.1 | Ordem válida das operações | Evidência local | Termos imutáveis, pedidos vinculados e confirmação consultada no Asaas; testes impedem saltar pagamento e repetir ativação. |
| v5.0.0-3.2.1 | Resposta interpretada no contexto correto | Parcial | nosniff e tipos de resposta configurados; upload restringe assinatura de imagem. Falta verificar todos os arquivos no Storage oficial. |
| v5.0.0-3.2.2 | Texto exibido como texto | Evidência local | CRM exibe nomes e notas com textContent; teste inclui HTML e apóstrofo. Não certifica todo o site. |
| v5.0.0-3.3.1 | Atributos de cookies seguros | Fornecedor | Sessão principal usa Supabase no navegador; falta inventário real de cookies do domínio e integrações antes de concluir aplicabilidade. |
| v5.0.0-3.4.1 | HSTS de pelo menos um ano | Preview | vercel.json configura max-age=31536000; conferência HTTP automatizada no Preview. Produção ainda pendente. |
| v5.0.0-3.4.2 | CORS e respostas sensíveis | Parcial | Há rotas com origem ampla e token explícito; falta decidir origens legítimas e demonstrar ausência de exposição em cada resposta. |
| v5.0.0-3.5.1 | Proteção contra pedidos forjados | Parcial | APIs administrativas exigem Bearer em cabeçalho; não usam autenticação automática por cookie. Falta revisão de todas as operações sensíveis. |
| v5.0.0-3.5.2 | Proteção por requisição preliminar | Parcial | Não se assume CORS como autorização; cabeçalho Bearer necessário. Conferir combinações de método e Content-Type em todas as rotas. |
| v5.0.0-3.5.3 | Métodos corretos para alterações | Parcial | Fila financeira corrigida para POST e GET/HEAD bloqueados; salvamento CRM por PUT. Falta inventário de demais rotas. |
| v5.0.0-4.1.1 | Tipo e codificação de conteúdo | Parcial | JSON, scripts e páginas têm tipos próprios nos caminhos testados. Falta bater todos os endpoints e respostas de erro publicados. |
| v5.0.0-4.4.1 | WebSocket com TLS | Fornecedor | SDK e plataforma podem usar WSS; falta observar conexões reais autenticadas. Não marcar como aprovado pela ausência de teste. |
| v5.0.0-5.2.1 | Limite de tamanho de arquivos | Evidência local | api/upload.js limita base64 e bytes a 10 MiB; limite real do gateway/hospedagem pode ser menor e precisa de teste. |
| v5.0.0-5.2.2 | Formato real de upload | Parcial | Upload confere MIME e assinaturas PNG/JPEG/GIF/WebP; falta teste de conteúdo malformado e decodificação completa das imagens. |
| v5.0.0-5.3.1 | Upload sem execução de código | Parcial | API não aceita SVG/HTML como imagem e armazena em Storage; políticas do bucket oficial ainda precisam de conferência. |
| v5.0.0-5.3.2 | Caminhos de arquivos protegidos | Evidência local | Pasta validada e nome gerado com bytes aleatórios; filename não vira caminho arbitrário. Revisar demais operações de arquivo. |
| v5.0.0-6.1.1 | Documentação de defesa do login | Pendente | Supabase limita autenticação, mas falta registrar valores, responsabilidade e resposta a abuso sem bloquear vítimas. |
| v5.0.0-6.2.1 | Tamanho mínimo de senha | Teste configurado | Nove caracteres no banco de teste e telas; atende mínimo oito deste requisito, sem equivaler à recomendação de quinze. |
| v5.0.0-6.2.2 | Pessoa consegue trocar senha | Confirmado pelo usuário | Leonardo confirmou recuperação e troca funcionando; falta reteste depois da integração final e em produção. |
| v5.0.0-6.2.3 | Senha atual para troca normal | Pendente | Recuperação por e-mail é fluxo distinto e não deve exigir senha esquecida. Troca normal com senha atual precisa de conferência própria. |
| v5.0.0-6.2.4 | Bloqueio de senhas conhecidas | Pendente | Filtro local de sequências não comprova lista mínima de 3000. Proteção de senhas vazadas do Supabase exige configuração/plano disponível. |
| v5.0.0-6.2.5 | Sem composição obrigatória | Decisão do usuário | Política solicitada exige maiúscula, minúscula, número e símbolo; diverge deste requisito do ASVS. Não alterar silenciosamente nem marcar aprovado. |
| v5.0.0-6.2.6 | Campo de senha mascarado | Evidência local | Login e recuperação usam type=password e controle para mostrar a senha; manter ambos os estados acessíveis. |
| v5.0.0-6.2.7 | Colar e usar gerenciador | Evidência local | Sem bloqueio de colagem; autocomplete new-password/current-password presente nos formulários revisados. |
| v5.0.0-6.2.8 | Senha sem transformação | Evidência local | Valores de senha são enviados sem trim ou mudança de caixa nos fluxos revisados; regras validam sem alterar. |
| v5.0.0-6.3.1 | Defesa contra tentativas automatizadas | Fornecedor | Limites de Auth existem no provedor; falta teste controlado e valores oficiais. Limite de checkout em memória não substitui defesa distribuída. |
| v5.0.0-6.3.2 | Ausência de contas padrão | Parcial | Contas administrativas foram definidas por ID; falta auditoria final completa de Auth e metadados no ambiente oficial. |
| v5.0.0-6.4.1 | Segredos temporários seguros | Fornecedor | Links e códigos são gerados pelo Supabase; falta documentar validade e comprovar uso único/configuração real. |
| v5.0.0-6.4.2 | Sem perguntas secretas | Evidência local | Não encontradas perguntas de recuperação ou dicas de senha. Perfil profissional não é usado para recuperar acesso. |
| v5.0.0-7.2.1 | Sessão verificada no servidor | Evidência local | APIs consultam /auth/v1/user com o Bearer exato; testes rejeitam identidade forjada e ausência de segundo fator. |
| v5.0.0-7.2.2 | Sessões dinâmicas | Evidência local | Chave pública da aplicação não substitui sessão; APIs exigem token do usuário emitido pelo Auth. |
| v5.0.0-7.2.3 | Aleatoriedade de sessão por referência | Fornecedor | Tokens são emitidos pelo Supabase; comprovar formato e configuração. Não há gerador próprio de sessão no Radar. |
| v5.0.0-7.2.4 | Renovação ao autenticar | Fornecedor | SDK administra sessão; falta teste de reautenticação, rotação e invalidação do token anterior em duas sessões reais. |
| v5.0.0-7.4.1 | Invalidação após sair | Pendente | Código chama signOut; JWT já emitido pode continuar válido até expirar. Comprovar revogação e janela efetiva nas APIs. |
| v5.0.0-7.4.2 | Invalidação ao excluir conta | Pendente | Falta testar desativação/exclusão e todas as sessões/tokens remanescentes, sem excluir contas reais nesta revisão. |
| v5.0.0-8.1.1 | Regras documentadas de permissão | Evidência local | Grátis/Dash/Report/Mídia, convidados e admin com MFA descritos em testes e documentação de andamento. |
| v5.0.0-8.2.1 | Permissão por função | Evidência local | CRM exige admin com segundo fator; pesquisa/report/mídia verificam plano no servidor. Reteste com May ainda pendente. |
| v5.0.0-8.2.2 | Permissão por registro | Evidência local | Fichas e pedidos vinculados a usuários; migração 024 bloqueia leitura individual de pesquisa a todas as sessões de navegador. |
| v5.0.0-8.3.1 | Autorização no servidor | Evidência local | Blur é apenas apresentação; APIs e banco negam dados sem direito. Produção ainda depende das mesmas migrações e configuração. |
| v5.0.0-9.1.1 | Integridade de tokens | Fornecedor | Radar delega validação do token exato a /auth/v1/user antes de usar identidade/MFA; falta comprovar parâmetros criptográficos do provedor. |
| v5.0.0-9.1.2 | Algoritmos de token permitidos | Fornecedor | Não há verificador JWT próprio para autenticar; revisar configuração e metadados de assinatura no projeto oficial. |
| v5.0.0-9.1.3 | Chaves de emissor confiável | Evidência local | Destino Auth vem da configuração do servidor; não de jku/jwk enviados pelo usuário. Não certifica a configuração oficial ainda não conferida. |
| v5.0.0-9.2.1 | Validade temporal do token | Fornecedor | Auth valida sessão; falta teste explícito de token expirado/antes da validade com o provedor real. |
| v5.0.0-10.4.1 | Retornos OAuth exatos | Teste configurado | Quatro URLs exatas no Supabase TESTE; Google Cloud e ambiente oficial precisam de conferência conjunta. |
| v5.0.0-10.4.2 | Código OAuth de uso único | Fornecedor | Emissor OAuth é Google/Supabase, não o Radar; obter evidência de configuração e fluxo real sem reimplementar o provedor. |
| v5.0.0-10.4.3 | Vida curta do código OAuth | Fornecedor | Prazo é controlado pelo emissor; falta comprovação do fluxo e configuração utilizados pelo login Google. |
| v5.0.0-10.4.4 | Fluxos OAuth necessários | Pendente | createClient usa padrão do SDK em partes do site; falta revisar migração consistente para PKCE sem quebrar recuperação/Google. Login por senha do serviço Auth precisa de análise de aplicabilidade. |
| v5.0.0-10.4.5 | Proteção de refresh token | Fornecedor | Rotação/reutilização controladas pelo Supabase; falta testar replay e verificar parâmetros reais de sessão. |
| v5.0.0-11.3.1 | Sem modos criptográficos fracos | Fornecedor | Radar não implementa cifra de dados sensíveis nos caminhos revisados; armazenamento e emissão de tokens dependem dos provedores. |
| v5.0.0-11.3.2 | Cifras aprovadas | Fornecedor | Falta evidência das configurações de dados em repouso e integrações; não inferir aprovação por usar HTTPS. |
| v5.0.0-11.4.1 | Resumos criptográficos aprovados | Parcial | Integridade usa SHA-256/SHA-384 e idempotência usa algoritmos adequados nos caminhos revisados; falta inventário de usos criptográficos legados. |
| v5.0.0-12.1.1 | TLS moderno | Fornecedor | HTTPS presente; falta teste específico das versões/cifras de todos os domínios oficiais e provedores. |
| v5.0.0-12.2.1 | HTTPS nas integrações | Parcial | Destinos configurados e SDK usam HTTPS; localhost é teste local. Falta inventário completo e configuração de produção. |
| v5.0.0-12.2.2 | Certificados públicos válidos | Preview | Preview abre sem alerta de certificado; falta confirmar domínio oficial e todos os serviços externos no lançamento. |
| v5.0.0-13.4.1 | Git inacessível pela web | Preview | .vercelignore exclui .git; sondagem HTTP verifica .git/HEAD e arquivos restritos. Replicar no domínio oficial. |
| v5.0.0-14.2.1 | Segredos fora da URL | Parcial | APIs usam cabeçalhos; modelos usam TokenHash em links de uso único, que precisam de análise específica, expiração e limpeza da URL. Não registrar links completos em logs. |
| v5.0.0-14.3.1 | Limpeza de dados ao encerrar sessão | Pendente | signOut não comprova limpeza de todo DOM/cache/notas em outra aba. Testar computador compartilhado e sessão encerrada. |
| v5.0.0-15.1.1 | Prazo de atualização documentado | Documentado | Runbook desta rodada define triagem e prazos por gravidade; responsável operacional ainda precisa ser designado. |
| v5.0.0-15.2.1 | Componentes dentro dos prazos | Parcial | html2pdf vulnerável e não usado removido; 12 pacotes diretos consultados no OSV sem alertas. Dependências internas e serviços não estão certificados. |
| v5.0.0-15.3.1 | Somente campos necessários | Parcial | CRM seleciona campos e pesquisa retorna agregados; 024 fecha acesso bruto. Falta revisar todas as respostas legadas e dados reais. |

## Decisões que não podem ser ocultadas

1. A composição de senha solicitada diverge do requisito 6.2.5. Não retirar regras sem alinhar com Leonardo.
2. A prevenção de senhas conhecidas e a invalidação de sessões ainda exigem trabalho/provedor; autenticação funcionando não fecha esses itens.
3. A limpeza dos artigos recebeu DOMPurify e teste de preservação; falta o reteste editorial completo com conteúdo publicado real.
4. Os 70 requisitos são a conferência final e não substituem os achados dos outros três guias, a privacidade da pesquisa ou o teste de restauração.
