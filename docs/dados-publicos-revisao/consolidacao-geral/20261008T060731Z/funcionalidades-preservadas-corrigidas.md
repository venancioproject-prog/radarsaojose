# Funcionalidades preservadas e corrigidas

Preservados: navegação dos oito eixos; canvases/funções existentes; séries comprovadas P1/P2/P3; exportação JSON/CSV com BOM, escaping, competência, unidade, fonte e status; filtros e módulos visuais de Economia/Finanças; stores e relatórios anteriores; geometrias; dados de frota/ANAC e séries históricas válidas; suspensões P3/P4.

Corrigidos: cartões hardcoded passam a usar registry; rede/etapa e metas do IDEB; matriz real de matrículas por rede; escolarização não mistura com fluxos estimados; taxa de homicídio aceita chave nativa e não produz NaN; gráfico rotulado por ocorrências; suspensões de gráficos demográficos/segurança/benchmark sem prova; erro de parentNode em fallback; exportação prioriza a competência completa em todos os eixos, sem perder recortes parciais; status indevidamente promovidos; bilhetagem com colunas perdidas; igualdade package/inline; write atômico com alternativa nativa para OneDrive; nulidade nas composições sem prova.

Não foi feito redesenho. Exibir fallback onde faltam dados é correção de integridade, não remoção da função. Qualidade de usabilidade de P1.1/P2.1 ainda precisa de revisão específica. Funções não executadas, embora preservadas, não recebem certificado funcional. `dependencias.json` relaciona scripts, fetches, funções e canvases do estado inicial.
