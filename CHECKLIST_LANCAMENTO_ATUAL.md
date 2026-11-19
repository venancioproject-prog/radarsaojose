# Checklist atual do lançamento

Atualizado em 19/11/2026. Este arquivo resume o estado corrente; relatórios de 05–12/11 e a cronologia do PLANO_LANCAMENTO_2026-11-19.md permanecem como histórico. Não confundir implementação local, Preview e produção.

## Base e preservação

- [x] Preparar candidata isolada codex/lancamento-20261119 em worktrees/radar-lancamento, sem sobrescrever a pasta principal.
- [x] Incorporar as atualizações de vagas de origin/main e a entrega do blog 1cdca3d (integrada como a80e009).
- [x] Conferir os 143 blocos pagos do Report na pasta principal e origin/main contra a candidata/pacote: mesmo SHA-256 4be5a4512be8cf831652127cd0bc7b45bec085095aed5946fd903d4f7d5d5516, 1.079.719 bytes. Isso comprova conteúdo idêntico nesse conjunto, não aprovação visual final.
- [x] Preservar as alterações locais anteriores; nada foi descartado para montar a candidata.
- [ ] Conferir visualmente com o titular a candidata e promover somente depois das etapas abaixo.

## Código e testes desta rodada

- [x] Pausar polling do plano quando página/seção oculta e impedir sobreposição; manter 4,5s quando visível.
- [x] Cache privado da pesquisa por cinco minutos, limitado, com deduplicação, isolamento de configuração, invalidação e autorizações preservadas.
- [x] Listagens públicas do blog sem corpo completo; artigos individuais e edição administrativa completos. Sete testes da outra IA reexecutados e integrados.
- [x] 82 testes integrados aprovados, sem falhas/ignorados, depois da integração do blog e preparação do jurídico.
- [x] Navegação móvel local: sete eixos públicos selecionados a 390×844; sidebar fecha e volta no desktop 1366×768; sem overflow horizontal observado ou erros JS. Segurança exige confirmação contextual existente, preservada. Dados de rede do Supabase simulados/bloqueados; não é homologação das contas/banco reais nem teste em aparelho físico.
- [x] Medição sintética reproduzível em scripts/benchmark-survey-local.cjs, sem rede: 477 linhas, 60 requisições, concorrência 6; leituras da base 60→1, bytes simulados 18.825.120→313.752, verificações de sessão/plano 60 em ambos e zero erros.
- [ ] Medir capacidade com hospedagem e banco reais em ambiente autorizado. O teste sem latência remota teve p95 de 442,39ms sem cache e 512,59ms com cache; não demonstrou aceleração de CPU/tempo nesse cenário. O benefício comprovado ali é redução de transferências, não número de usuários suportados.
- [ ] Avaliar o carregamento inicial do controller de dados públicos (26.534.813 bytes sem compressão), incluindo compressão/cache efetivamente entregues antes de alterar o pacote canônico.

## Decisões do titular já recebidas

- [x] Origem da coleta informada pelo titular como Google Docs. O titular dispensou investigação do formulário original nesta finalização; não pedir novamente nem inventar um novo coletor. Permissões do sistema original não foram auditadas.
- [x] O titular confirmou que o próprio juridico.html é o texto final aprovado. Identificação de minuta, notas editoriais e simulação retiradas; as sete seções de cláusulas preservadas integralmente. Versão 0.2 mantida em coerência com aceite-termos.js/CRM, sem migração ou modificação de aceites existentes. CSP recalculada.
- [ ] Conferir funcionalidades concretas descritas no texto: emissão fiscal, suporte, cancelamento/reembolso e renovação. Aprovação do texto não comprova execução de todas as operações; não reabrir revisão jurídica genérica.

## Infraestrutura e publicação de teste

- [x] Identificar excesso: Supabase Egress sem cache 5,454/5 GB; projeto principal 5,441 GB (99,8%). Banco/arquivos não excedidos. Ciclo termina 27/11/2026.
- [x] Conferir print Vercel: nenhuma cota exibida excedida; maior uso Deployment Storage 72%.
- [ ] Restaurar disponibilidade do Supabase de teste por meio permitido, sem contratação; projeto radar-pagamentos-teste estava pausado. Restrições da organização por cota podem continuar até renovação.
- [ ] Publicar candidata somente em Preview e conferir CI, distribuição, bibliotecas/cabeçalhos e negação de APIs anônimas. Nenhuma promoção automática para produção.
- [ ] Homologar cadastro e Google, confirmação/recuperação, Leonardo/May com MFA, CRM em duas contas/abas, plano administrativo e logout em computador compartilhado.
- [ ] Homologar planos/convidados e sequência Sandbox, confirmação automática, recusa/nova tentativa, pendência, duplicação, estorno e contestação.
- [ ] Aprovar/integrar pesquisa, Report e Mídia reais em ambiente protegido; verificar a 024 no banco correto. Não importar pacote real no Preview sintético por engano.
- [ ] Revisar artigos de teste, landing/ofertas e retirada de Eleições na candidata aprovada. Finanças segue suspensa; Consultor/Oráculo fora do lançamento.
- [ ] Configurar/remetente financeiro e testar fila de e-mails, hoje desativada, e recebimento real dos modelos de autenticação.

## Fechamento oficial

- [ ] Escolher/configurar hospedagem definitiva compatível com orçamento e uso comercial. Nenhuma contratação ou migração de conta autorizada/realizada nesta rodada.
- [ ] Conferir configurações e permissões oficiais, backup/restauração, alertas, responsáveis e plano de retorno.
- [ ] Aprovar candidata/configurações, publicar oficialmente, executar compra real controlada autorizada e acompanhar funcionamento.

## Percentuais

Média histórica de 12/11: 77,5% concluído e 22,5% restante; faixa provisória anterior 20–30% restante. Ainda não há medição revisada que inclua todos os novos trabalhos e homologações. Não aumentar a porcentagem por testes locais ou documentos, nem declarar pronto para grande tráfego sem carga medida.
