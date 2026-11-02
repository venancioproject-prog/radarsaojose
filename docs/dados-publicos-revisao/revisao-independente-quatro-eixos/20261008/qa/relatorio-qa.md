# Parecer de QA independente

Aprovado com os limites documentados. Reprodução primária: 3.229 verificações iniciais, 213 de CNES, quatro de atualização Saúde e 27.515 de transcrição/locadores da proposta integrada. Esses conjuntos contêm verificações sobrepostas e não devem ser somados como indicadores únicos.

A suíte final aprovou 10/10 testes VM e quatro cenários Chrome: desktop online (6,04 s), desktop offline após assets (4,92 s), viewport móvel com 1 MiB/s e 100 ms de latência (40,02 s) e verificação remota offline (4,89 s). Os oito eixos renderizaram gráfico ou fallback previsto, sem exceção de runtime do produto.

A exportação contém 1.940 registros Educação, 179 Saúde, 7.287 Segurança e 110 Demografia, total 9.516. JSON e CSV mantiveram IDs únicos, valores, null, unidades, competências, status, fonte e hashes. Registry: 122 indicadores, 28 valores null. O total de matrículas por rede 2023 é 163.965; o formatter retorna 100,0% para esse total. As duas regenerações adversariais repararam os 42 valores de bilhetagem somente numa cópia isolada. Filtros e exportações mantiveram as suspensões.

Fingerprint carregado no Chrome, package, registry e ground truth: `sha256:7e9547065b7f4f0a284f654c8756d21c1c3433226947d5fcf1d8b88e42f17046`. Os objetos GT dos quatro eixos P1–P4 e o hash de app.js foram preservados.

A primeira execução Chrome falhou no próprio harness: acessar uma função datalabels pelo proxy `chart.options` acionava o resolvedor scriptable do Chart.js. O teste passou a acessar `chart.config.options`, a configuração original. Nenhum código do produto foi alterado para essa correção; o primeiro resultado foi preservado em `testes-chrome-primeiro-harness.json`.

Limites: Chrome usa fixture com DOM de app.html e controller real, sem app.js; não é E2E de login. Offline depois dos assets não comprova primeiro acesso offline nem instalação PWA. Viewport emulado não substitui aparelho físico. O tempo móvel é de HTTP local sem compressão, não benchmark de produção. Nove KPIs Saúde e o vínculo territorial dos 35 polígonos permanecem suspensos. CNES somente disponibiliza os 52 códigos e suas colunas nativas, sem homologar os totais anteriormente suspensos. Habilitados complementares não é coluna SUS. SSP2001 preserva conflitos e mudanças de universo; SSP2026 não publica meses posteriores ao oitavo. Não houve screenshots ou deploy.
