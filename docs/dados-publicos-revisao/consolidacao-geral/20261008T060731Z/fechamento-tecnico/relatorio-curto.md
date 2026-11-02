# Fechamento técnico — consolidação de 08/10/2026

**Resultado: nove suites VM PASS e quatro cenários Chrome PASS; dados e suspensões preservados. Sem homologação definitiva.** O relatório anterior permanece íntegro; este documento encerra sua pendência técnica P0.

| Ponto | Causa | Alteração e comprovação |
|---|---|---|
| P0 | Teste acessava Chart.data de ar/fatalidades suspensos. O stub DOM também omitia parentNode. | Corrigido o stub; null/zero testados em INPE, CAGED e frota renderizáveis. Acrescentadas assertivas obrigatórias de ausência de Chart e presença de fallback para ambos os suspensos. Os oito cenários P0 passaram, preservando 404, JSON inválido, versão antiga, mistura, offline, concorrência e CSV. |
| 42 TOTAL/MÉDIA | Parser antigo perdeu colunas vazias; overrides só estavam aplicados no estado já consolidado, sem proteção no builder. | Builder reaplica as 42 suspensões por ID/competência/fonte e rejeita overrides incompatíveis. Reativação artificial em cópia isolada + duas regenerações retornaram exatamente ao package original. Nenhum dado ativo foi promovido. |
| Fingerprint | Era necessário confirmar a identidade após regeneração e carregamento real. | Package/inline/GT/registry iguais; fingerprint recalculado do payload completo; versão dos exports e inline no Chrome coincidente nos quatro cenários. Hashes individuais dos componentes estão em regeneracao-fingerprint.json. Registry/GT não possuem o mesmo SHA de arquivo entre si: integram o único fingerprint do payload. |
| Carga duplicada | Loader baixava um JSON aceito somente se integralmente igual ao inline já carregado. | Caminho padrão utiliza o inline canônico e não solicita o JSON. Verificação remota continua opt-in por window.RADAR_HUB_VERIFY_ONLINE_PACKAGE=true, com validação integral e fallback. Testes negativos continuam exercitando esse caminho; não foram removidos. |
| Inicialização | Remover o fetch revelou uma corrida de scripts na fixture: Finanças ainda não havia carregado. | Loader aguarda DOMContentLoaded quando necessário. Harness espera Chart e ambos os módulos visuais; teste VM comprova que não há commit/fetch antes do evento. Os 12 gráficos de Finanças voltaram a ser verificados no Chrome. |

## Testes e medição

- **Regeneração:** 42 IDs reativados só na cópia isolada; 2 builds idempotentes produziram exatamente o package original. Valores e status suspensos restaurados; bruto forense preservado.
- **Filtros/exportações:** JSON/CSV conferidos por ID, coluna valor vazia e status suspenso, incluindo setembro/novembro; seis combinações de filtros, quatro modos de carga VM. Bilhetagem não tem filtro/gráfico próprio: testados filtros existentes e recortes exportáveis por família/mês.
- **Regressões:** P0, Economia runtime/visual, Finanças runtime/visual, Meio Ambiente, Mobilidade, Saúde e teste dos oito eixos: **9/9 PASS**. Demografia/Segurança/Educação também verificadas no Chrome. Fontes externas não reextraídas: dados/brutos não mudaram.
- **Chrome:** online, offline após assets, móvel limitado e verificação remota offline: PASS. 122 indicadores, 34 null, competências completas, 42 IDs suspensos após filtros, oito eixos com gráficos/fallbacks e sem exceções JS. [Resultados](testes-chrome-real.json).
- **Rede padrão:** zero solicitações ao package JSON. Controller+package na rodada anterior: 45,118,037 bytes; agora: 22,677,827 bytes, servidor local sem compressão. Inline continua sendo a cópia única carregada; JSON permanece artefato de reprodução/diagnóstico.
- **Móvel emulado:** 56.11s → 33.01s. Inclui verificações e não é benchmark controlado de produção; ResourceTiming comprova a transferência eliminada.

Fingerprint preservado: `sha256:9f20f59a93862a89eb7b96c0969fce22cccb435e8a7e657a822edf7253f55969`.

## Arquivos e reprodução

Alterados controller, builder, P0 e configuração de verificação remota nos harnesses de regressão; adicionados três scripts de fechamento e um teste específico. Relação/hash: [arquivos-finais.json](arquivos-finais.json). Dados/registry/GT e app.js preservados byte a byte em relação ao início deste fechamento. `.gitignore` exclui cópia isolada, perfis e exportações pesadas e permite os novos scripts. Sem commit/push/deploy, screenshots ou redesenho.

```powershell
python -X utf8 scripts/fechamento_tecnico.py
python -X utf8 scripts/fechamento_chrome.py
python -X utf8 scripts/fechamento_relatorio.py
```

Resultados gravados somente neste fechamento. Não executar aplicadores antigos nesta verificação. A primeira tentativa de CSV excedeu 120s por repetir exports grandes: agora lê o export integral uma vez e verifica os 42 IDs em cada filtro/carga. A [primeira verificação Chrome](chrome-primeira-verificacao-review.json) registrou a corrida de Finanças; corrigida a sincronização de módulos e conclusão da renderização.

## Pendências

Chrome usa fixture do módulo, sem app.js/login/Supabase. Offline pressupõe assets disponíveis; não prova primeira visita offline. Móvel emulado, sem aparelho físico ou compressão/cache de produção medidos. Atualizações exigem regeneração/entrega conjunta do controller; verificação remota opt-in transfere o JSON intencionalmente. Pendências metodológicas e suspensões anteriores permanecem. **Parar para revisão humana.**
