# Radar São José — consolidação técnica para revisão humana

Data: 08/10/2026. Município IBGE 3549904. Versão ativa: `sha256:9f20f59a93862a89eb7b96c0969fce22cccb435e8a7e657a822edf7253f55969`. **Integração técnica entregue; homologação dos dados não realizada.** Os oito eixos navegam no módulo isolado testado. Nenhum PASS transforma ausência em zero ou indicador suspenso em confirmado.

A revisão encontrou melhorias concretas além dos cortes de 2023/2024: IDEB até 2025 em 11 ciclos, 165 tabelas do Censo Escolar 2023, série SSP 2001–2025 e preservação das séries longas P1–P4. Persistem lacunas por família que estão na matriz de oportunidades; não foram completadas por interpolação.

## Resultado principal

- Package, ground truth, registry e fallback agora têm payload coerente e fingerprint verificável. Foram restaurados os bindings/status de P1–P4 contra promoções indevidas posteriores.
- Bilhetagem: 42 valores de total/média haviam virado meses futuros; foram suspensos, com store histórico intacto e override explícito. Óbitos/perfil/motorização seguem suspensos. P4 não recebeu homologação.
- Educação: total 2023 corrigido para 163.965 matrículas, redes e etapas separadas. IDEB público 2025 6,9/5,7; escolarização 99,09% é residentes 6–14 anos, Censo 2022, não matrícula. Metas somente nos ciclos publicados até 2021.
- Saúde: restaurados totais documentais SINASC/SIH, taxas SMS e dengue com período parcial; CNES sem extração municipal compatível permanece suspenso. Segurança: ocorrências e vítimas separadas. Demografia: 10 KPIs SIDRA conferidos; composição/setores sem crosswalk ficam sem valor quantitativo.
- Economia, Finanças e Meio Ambiente: valores/GT comprovados anteriores preservados. PIB nominal, fases da despesa e quebras metodológicas explicitados. Resultados orçamentários 2023 e 2024 continuam déficits no conceito reconciliado, não superávit alegado em auditoria global posterior.
- Package caiu de 35.842.381 para 22440492 bytes em disco (cerca de 37.4%). Carregamento duplicado package+inline ainda pesa; compressão de produção não foi medida.

## Entregáveis

1. Diagnóstico inicial: [consistência](consistencia-inicial.json), [matriz inicial](matriz-inicial.json), status/diff/branches/commits.
2. Inventário: [trabalhos](inventario-trabalhos.md), [4.278 arquivos com hashes](inventario.json), snapshot selecionado e seu manifest.
3. [Matriz dos oito eixos](matriz-consolidacao.md) e JSON com sete critérios separados.
4. [Divergências e decisões](divergencias.md).
5. [Antes/depois dos 122 indicadores](antes-depois-indicadores.md), JSON, journal de reconciliação e quarentena auxiliar.
6. [Arquitetura canônica e regras de resolução](arquitetura-canonica.md).
7. Package e fallback coerentes: resultado de integridade e versão acima.
8. [Reprodução](reproducao.md), scripts selecionados no Git e `versionamento.json`.
9. [Testes](testes.md), resultados/logs externos, VM e Chrome.
10. [Desempenho](desempenho.md), bytes de disco, gzip estimado e ResourceTiming real local.
11. [Funcionalidades preservadas](funcionalidades-preservadas-corrigidas.md).
12. Correções funcionais no mesmo documento, sem redesenho.
13. [Pendências metodológicas](pendencias-metodologicas.md).
14. [Arquivos alterados](arquivos-alterados.md), com hashes antes/depois.
15. Este relatório e [cobertura histórica](matriz-cobertura-historica.md), [oportunidades](matriz-oportunidades.md), evidence stores e manifests de brutos.

## Validação e limites do aceite

Integridade PASS: 1136 verificações e 931 arquivos anteriores preservados. Fontes novas PASS: 3476 verificações; P1–P3 reprodução externa PASS. Node VM: 7/8 suites, com falha legada P0 explicitada. Chrome real: três cenários PASS. Offline significa fallback após bibliotecas carregadas, não instalação offline inicial. Móvel é viewport emulado, não telefone físico. O teste não executou `app.js`/login completo. Mapas sem agregação comprovada ficaram em fallback; sua geometria preservada não é homologação cartográfica.

`app.js` preservado byte a byte; auditorias/brutos anteriores não sobrescritos; sem exclusão de funcionalidades, screenshots ou deploy. Arquivos Git preexistentes modificados foram conservados. Stores pesados/nacionais permanecem fora do carregamento inicial e são recuperáveis por arquivos locais/manifests e SHA; disponibilidade futura de uma URL não é garantida.

O aceite solicitado agora é revisão humana desta versão, inclusive indicadores suspensos, limitações de teste, cobertura e performance. A operação termina aqui. Não iniciar P5.1, novas funcionalidades, redesenho ou deploy sem autorização.
