# Revisão do diagnóstico paralelo e primeira correção

Data: 19/11/2026. Relatório de entrada: C:/Users/leose/RadarParalelo/2026-11-19/RELATORIO_DESEMPENHO.md, referência radar-integracao f23889d. Implementação somente na candidata codex/lancamento-20261119, worktrees/radar-lancamento.

## Conclusões confirmadas

- Há leitura completa/paginada da pesquisa no servidor sem TTL no caminho store.db, e cálculo por interação. Prévia sintética não mede esse consumo em produção.
- O polling administrativo chama a leitura do plano em intervalos de 4,5 segundos, sem condição de visibilidade ou exclusão de consultas sobrepostas na referência.
- Os agentes http.Agent/https.Agent criados no pool não são repassados ao fetch. Isso não significa que o fetch nativo abra sempre um socket novo: seu transporte padrão possui gerenciamento próprio. Não introduzir outro dispatcher sem medição.
- O controle de concorrência e o cache são locais à instância; a função de normalização PostgreSQL não tem chamador encontrado.
- CRM percorre a base e cruza informações antes de paginar. Alterar isso exige preservar busca global e indicadores completos.

## Correções e limites do relatório

- api/_authorization.js e lib/billing-store.js passam cacheTtlMs: 3000 na autenticação; api/consultor.js passa 300000, embora Consultor esteja fora do lançamento. Não afirmar que apenas posts tem TTL, nem atribuir 99% das consultas sem contagem real.
- midia_dashboard.js:onSwitchToMidiaTab reutiliza allMidiaRecords quando já carregado. Não baixa novamente em toda simples alternância de abas na mesma sessão. O carregamento inicial completo e recargas da página continuam merecendo análise.
- A deduplicação vale durante a mesma leitura em andamento, não somente para chamadas no mesmo milissegundo.
- 19.200 disparos/dia é cálculo teórico para timer rodando sem interrupção por 24h. Browsers podem limitar timers em segundo plano; isso não é medição do tráfego do titular.
- Não estão comprovadas a causa exata dos 5,441 GB do projeto principal, a redução de mais de 90%, os volumes de bytes por dia nem capacidade estável no Free. Estimativas não se tornam garantias.
- no-store da resposta HTTP protege conteúdo entregue; não obriga nova leitura ao Supabase se existir cache interno autorizado. Evitar simplesmente habilitar cache global para todas as rotas de billing: pagamentos e revogação exigem dados atuais.

## Primeira correção implementada

business-plan-controller.js: polling pula a consulta quando document.hidden está ativo, quando #tab-plan não existe ou está oculto, e quando uma leitura anterior ainda está em andamento. O intervalo visível permanece 4,5 segundos. Salvamento e APIs de autorização não foram alterados. Uma leitura já iniciada pode terminar; não há cancelamento de escrita.

Ao voltar à seção visível, o próximo tick elegível retoma a leitura; o fluxo existente de abrir o plano também é preservado. Não foi criado canal público nem cache de conteúdo privado no navegador.

## Validação

- node --check business-plan-controller.js passou.
- node --test tests/browser-dependencies.test.cjs: seis testes aprovados. Inclui preservação de sincronização/aplicação remota e novo cenário de página oculta, seção oculta/ausente, consulta lenta, reinicialização do timer e recuperação após erro.
- git diff --check passou.
- Não foi executada carga remota nem repetida a bateria completa após esta mudança pequena. A referência anterior teve 68 testes aprovados na mesma data; não somar execuções como medição de capacidade.
- Sem push, deploy ou alteração de banco. Economia real depende de publicar a versão aprovada e medir; esta mudança local ainda não reduz o consumo do site oficial.

## Sequência recomendada

1. Homologar o polling com Leonardo/May na candidata antes da publicação autorizada.
2. Projetar cache interno da pesquisa com escopo de configuração/versão, TTL explícito, deduplicação, limite de memória e invalidação; autenticação/plano antes de toda resposta. Preservar proteção de grupos e cálculos.
3. Medir tamanho/frequência das leituras do projeto principal antes de mudar transporte, CRM ou cache de conteúdo pago no navegador.
