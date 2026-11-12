# Pesquisa: origem das respostas e proteção

Conferência de 12/11/2026, branch codex/radar-integracao. Não foram abertas respostas individuais nem acessado o banco de produção.

## O que o código comprova

- `lib/survey-data.js:74` é um **leitor**, não um receptor de respostas. Fora do Preview, consulta `public.respostas_pesquisa` pelo servidor e calcula os gráficos. No Preview, retorna dados sintéticos.
- `api/survey-preview.js` e `api/survey-report.js` entregam resultados autorizados e agregados. Não são endpoints de envio do questionário original.
- `formulario-radar.html:6` hoje redireciona ao primeiro acesso. O arquivo anterior à mudança e7abdbd coletava informações de cadastro/CRM e tentava escrever em `profiles`, `crm_empresas`, `crm_pessoas` e `crm_oportunidades`. Não era prova de coleta da pesquisa com 477 participantes.
- A busca no código ativo não encontrou um envio para `respostas_pesquisa`, Google Forms ou um endpoint de coleta original. Os arquivos de respostas exportadas e leitores existentes não identificam por si só como ocorreu a coleta.
- O catálogo do Supabase TESTE não retornou as relações `respostas_pesquisa` e `respostas radar`. Isso é compatível com o Preview sintético; não comprova a situação da produção.

**Conclusão:** o destino de leitura está identificado, mas o receptor original da pesquisa permanece desconhecido. Para fechar a revisão, falta o link ou sistema usado na coleta original e a conferência de seus acessos, validações, consentimento e exportação. Não inventar um formulário novo nem modificar permissões de gravação sem essa informação.

## Falha encontrada na revisão das migrações

A migração 013 retirava leitura direta, mas a 017 voltava a permitir que assinantes consultassem linhas individuais. O teste antigo aceitava essa leitura para Report. Assim, proteger somente os gráficos não bastava para proteger os participantes.

A migração **024_private_survey_responses.sql** retira SELECT da tabela e de cada coluna para `PUBLIC`, `anon` e `authenticated`. Mantém leitura do servidor privilegiado para os cálculos. Não apaga respostas, altera valores ou modifica INSERT do coletor desconhecido.

Teste em PostgreSQL descartável: Grátis, Dash, Report, Mídia e administrador com segundo fator receberam bloqueio; servidor leu normalmente. Uma permissão antiga por coluna também foi retirada, e a reaplicação passou.

## Checklist de fechamento

- [x] Distinguir formulário antigo do CRM da pesquisa original.
- [x] Identificar tabela e caminho atual de leitura.
- [x] Revisar a sequência de permissões e corrigir a reabertura de leitura individual.
- [x] Preservar gravação e conteúdo da pesquisa.
- [ ] Identificar o serviço/link original de coleta com o responsável.
- [ ] Conferir usuários, integrações e permissões desse serviço.
- [ ] Aplicar a 024 no banco com os dados reais durante a integração autorizada.
- [ ] Testar conta paga: gráficos funcionam e REST direto não fornece linhas individuais.
- [ ] Conferir retenção, anonimização e pedidos de exclusão com o responsável pelos dados.
