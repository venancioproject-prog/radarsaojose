# Plano de lançamento — 19/11/2026

## Estado e percentuais

Base: ANDAMENTO_FINALIZACAO_RADAR.md, rodada de 12/11. Não foram repetidos os testes remotos nesta atualização. Percentuais são estimativas de organização, não horas, capacidade, segurança ou probabilidade de entrega.

| Frente histórica | Concluído | Restante |
|---|---:|---:|
| Cadastro, login e recuperação | 90% | 10% |
| Administradores e autenticador | 75% | 25% |
| CRM | 85% | 15% |
| Pagamentos Asaas | 90% | 10% |
| Acessos e convidados | 85% | 15% |
| Termos e privacidade da pesquisa | 90% | 10% |
| Conteúdo pago real | 50% | 50% |
| Retirada de Eleições 2026 | 75% | 25% |
| E-mails e identidade visual | 90% | 10% |
| Preparação e publicação oficial | 45% | 55% |
| Média simples histórica | 77,5% | 22,5% |

Novas frentes explícitas: desempenho/capacidade, viabilidade da hospedagem sem mensalidade e fechamento jurídico/fiscal. Sem percentual individual aferido. Faixa provisória de planejamento comunicada: 20–30% restante; recalibrar após diagnóstico. Não somar frentes arbitrariamente à média nem aumentar conclusão por produzir documentação.

## Ordem de execução

1. [ ] Consolidar a candidata: comparar main, mudanças locais e codex/radar-integracao; preservar código, conteúdo e aparência aprovados. Registrar o que entra e o que precisa de revisão antes de integrar.
2. [ ] Diagnosticar recursos e hospedagem sem mensalidade: confirmar recurso excedido, ciclo e restrição real do Supabase; conferir aviso/plano Vercel; avaliar compatibilidade e consumo de uma alternativa comercial gratuita antes de migrar. Não criar conta/projeto como forma de zerar consumo.
3. [ ] Validar acessos reais: cadastro e Google, confirmação, recuperação, Leonardo/May com MFA, CRM em duas contas/abas e salvamento do plano administrativo.
4. [ ] Homologar pesquisa/Report/Mídia reais em ambiente protegido. Identificar coleta original; preparar aplicação da 024 no banco correto, com gráficos preservados e leitura individual bloqueada. Não aplicar agora.
5. [ ] Implementar otimizações aprovadas: cache interno autorizado, agregações, índices/paginação e redução de consultas periódicas. Testar correção, isolamento e invalidação.
6. [ ] Validar planos/convidados e pagamentos no Sandbox: confirmação automática, recusa/nova tentativa, pendência, interrupção, duplicação, estorno e contestação.
7. [ ] Aprovar conteúdo e interface finais: Report, blog, landing/ofertas, retirada de Eleições e navegação móvel dos dados públicos. Finanças suspensa; Consultor/Oráculo fora do lançamento.
8. [ ] Configurar/testar e-mails de autenticação e financeiros; fila financeira continua desligada até sequência operacional validada.
9. [ ] Fechar jurídico/fiscal com advogada e contador, alinhando documentos e fluxos reais. Pode avançar em paralelo a partir de agora.
10. [ ] Medir capacidade da candidata em ambiente isolado: concorrência gradual, p50/p95, erros, consultas por interação, tráfego e memória. Definir carga-alvo com o titular; mocks medem apenas o aplicativo, não capacidade do Supabase real. Nenhum teste de carga remoto nesta etapa.
11. [ ] Fechar pendências de segurança/produção, backup e restauração, alertas, responsáveis, variáveis e plano de retorno.
12. [ ] Publicar após aprovação da candidata/configuração; validar domínio, pagamento real controlado autorizado e acompanhar operação.

## Duas frentes sem conflito

- IA deste chat: comparação das versões e plano de integração; coordena a lista e revisa o relatório de desempenho antes de mudanças compartilhadas.
- Outra IA: diagnóstico de desempenho/consumo em leitura, com relatório separado. Prompt: PROMPT_IA_DESEMPENHO_2026-11-19.md. A análise pode acontecer em paralelo aos itens 1–4; implementação depende da candidata e do relatório revisado.
- Não editar os mesmos fontes em paralelo. Uma etapa posterior de implementação deve ter arquivos/branch e escopo combinados.

## Conferência local já executada em 19/11

- Pasta principal: main em 4a4063a, com alterações anteriores preservadas.
- Worktree integrado: codex/radar-integracao em f23889d, limpo no momento da leitura; último código validado documentado f34d104.
- Comparação local de branches: main é ancestral da integrada, com 101 commits exclusivos da integrada. Não houve fetch; isso não descreve necessariamente o remoto atual.
- Entre 33 arquivos rastreados modificados na pasta principal, comparação UTF-8 normalizando CRLF: 4 iguais à integrada, 28 diferentes, 1 ausente no mesmo caminho (api/oraculo.js, reorganizado como api/_oraculo.js). Arquivos novos não entram nessa contagem. Igualdade textual não comprova funcionamento.
- Os quatro iguais: api/consultor.js, formulario-radar.html, market-intelligence-controller.js e report-presentation.js.
- Diferenças críticas para revisar primeiro: app.html/app.js, checkout/modal/webhook, lib/billing-store.js, APIs da pesquisa, CRM, login, vercel.json e regras de distribuição.
- Não houve merge, mudança de código do produto, banco, deploy, cobrança ou envio de e-mail.

## Execução adicional em 19/11 — candidata isolada e consumo

- Criada branch local codex/lancamento-20261119 em worktrees/radar-lancamento, ao lado da integrada. A outra IA mantém a referência de leitura original. Main e Preview não foram alterados.
- Reexecutados os 68 testes em codex/radar-integracao f23889d: 68 aprovados, zero falhas/ignorados. São testes locais/simulados; não medem capacidade ou produção.
- Auditoria offline na candidata: 45 páginas, 14 bibliotecas e 59 referências de script verificadas. Sem consulta online de vulnerabilidades nesta execução.
- A bateria financeira adicional inicialmente falhou antes de iniciar por caminho de dependência local inexistente em LOCALAPPDATA. Corrigido somente o localizador do runner para também usar o cache do aplicativo, como as outras suítes já fazem. Commit local 5b822cc. A bateria financeira passou após a correção, sem --sandbox, sem tráfego remoto e sem pendências reportadas.
- Fetch de origin realizado. As 15 revisões exclusivas de origin/main desde o ancestral comum alteravam somente vagas_sjc.json. Incorporadas na candidata por merge local; nenhum push/deploy. A comparação das alterações da pasta principal continua pendente de revisão detalhada, sem descarte de arquivos.
- Arquivos novos locais de código/SQL/HTML/CSS: 9 iguais à integrada, 10 diferentes e 1 somente local (emails-auth/verificacao-duas-etapas.html). Esse modelo antigo não é o aviso real de MFA, conforme documentação anterior.
- Print Vercel: Deployment Storage 7,2/10 GB (72%); CDN Requests 24 mil/1 milhão (2,4%); Function Invocations 7,6 mil/1 milhão (0,76%); Fast Data Transfer 1,05/100 GB (1,05%). Nenhuma das cotas exibidas estava esgotada. Não limpar publicações automaticamente: conservar rollback.
- Print Supabase: Egress 5,45/5 GB (109%); Database size 219/500 MB (43,8%); File storage 0,04/1 GB (4%); usuários ativos 13/50 mil. O excesso identificado é tráfego, não tamanho do banco. A imagem não identifica qual projeto gerou esse tráfego nem a data de renovação.
- Projetos radar-pagamentos-teste e venancioproject-prog aparecem pausados; RADAR SÃO JOSÉ aparece ativo. Não foi feita reativação, exclusão, migração ou contratação. O aviso de grace period, por si só, não comprova o estado de cada API.
- Próximo diagnóstico depende de Usage/Egress detalhado por projeto e data de renovação. Outra IA deve considerar esses números na análise; não rodar carga remota para investigar.
- Merge local concluído em 388cc68. JSON de vagas validado e comparado com origin/main 986026b: conteúdo idêntico após normalizar CRLF, também igualdade dos objetos JSON. Worktree da candidata limpo após o merge. Comparação desde f23889d: somente o runner financeiro e vagas_sjc.json foram alterados até este registro.
- Referências de scripts/estilos: 263 referências locais em 45 páginas examinadas; seis apontam à rota dinâmica /api/asaas-checkout?browserConfig=1 (existente), e as demais possuem arquivo local. Não é teste de navegador nem prova de que cada arquivo entra no deploy; a homologação de distribuição permanece aberta.
- Não alterar o percentual histórico nesta etapa: a candidata isolada está preparada, mas a revisão final dos ajustes locais, integração do conteúdo e homologação autenticada não foram concluídas.

### Participação do Leonardo nesta fase

- Agora: encaminhar o prompt à outra IA com acesso ao repositório e depois trazer o relatório; fornecer telas Usage do Supabase e aviso Vercel sem segredos.
- Depois: entrar com autenticador, coordenar validação com May, aprovar conteúdo, informar sistema original da pesquisa e decisões comerciais/jurídicas.
- Lançamento: aprovar ambiente/candidata e pagamento real controlado. Não compartilhar senha ou código do autenticador no chat.
