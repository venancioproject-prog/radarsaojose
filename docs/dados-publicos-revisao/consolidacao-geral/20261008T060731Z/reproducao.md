# Reprodução e verificação

Executar no diretório do repositório. Python 3.12; requests, python-calamine, openpyxl, xlrd e pypdf; websocket-client para Chrome CDP. Node para suites VM; Chrome instalado para navegador. Versões desta execução: requests 2.34.2, python-calamine 0.8.2, openpyxl 3.1.5, xlrd 2.0.2, pypdf 6.18.0, websocket-client 1.9.0. Coletas usam curl/TLS padrão; nenhum certificado foi desativado. Algumas fontes INEP foram recuperadas por HTTP oficial após falha HTTPS; hash e URL de catálogo HTTPS permanecem registrados.

Verificar entrega, sem reconciliar de novo:

```powershell
python -X utf8 scripts/consolidacao_integridade.py
python -X utf8 scripts/consolidacao_fontes_tests.py
python -X utf8 scripts/consolidacao_external_tests.py
$env:RADAR_TEST_PHASE='nova-verificacao'
python -X utf8 scripts/consolidacao_runtime_tests.py
python -X utf8 scripts/consolidacao_browser_test.py
```

Arquivos fonte necessários estão em `fontes-externas/manifest.json`, `manifest-evidence-stores.json` e `inventario.json`. O ZIP AI 2025 fica em `data/radar_hub/educacao_raw_2026-10-08/ideb-iniciais2025.zip`; demais novos nacionais na rodada. Não mudar nome/coluna/edição sem nova auditoria. Verificar SHA antes de extrair. O recorte municipal contém raw_value, célula, sheet, rede, etapa e unidade. SIDRA sexo exige `/c287/100362`, não `/c287/0`.

Pipeline de migração usado nesta operação, para estudo a partir do snapshot inicial numa cópia isolada:

1. `consolidacao_snapshot.py` antes de qualquer mutação; `consolidacao_diagnostico.py`.
2. Coletores `consolidacao_fontes.py`, `consolidacao_sidra.py`, catálogos Educação e downloads oficiais registrados. Alguns downloads/complementos foram feitos via curl diretamente e têm manifest; não alegar que um único coletor baixa tudo.
3. `consolidacao_educacao_extract.py`, `consolidacao_censo_extract.py`.
4. `consolidacao_reconciliar.py`, `consolidacao_quarentena.py`, `consolidacao_runtime_patch.py`, `consolidacao_evidence_overlay.py`.
5. `generate_geo_bundle.py`, `build_radar_hub_package.py` e verificações acima.

Não aplicar automaticamente snapshots antigos sobre o workspace atual. Scripts de migração registram antes/depois; para uma nova auditoria, criar uma nova rodada isolada e conferir dependências. Todos selecionam o diretório `20*` mais recente: não executar auditorias concorrentes. A reexecução de coletores pode atualizar respostas na nova rodada; igualdade de hash é requisito da reprodução histórica, não pressuposto.

`saude_documental_20261002.py` é cálculo em memória com modelo preservado e layout derivado do PDF oficial, sem escrita do GT. Os arquivos `.before` são modelos legados, não evidências primárias. `consolidacao_preservar_saude.py` é migração histórica que depende do temporário inventariado; não é necessário para verificar a entrega pois cálculo/modelos já estão preservados. Layout pode ser reextraído do PDF com pdftotext -layout; comparar conteúdo/totais/versão.

Aplicadores antigos de P1–P4 foram mantidos por rastreabilidade; alguns repõem snapshots de outros eixos. Não executá-los cegamente no estado consolidado. Os testes externos recortam somente os blocos de reprodução primária. O browser cria fixture e perfil temporário próprios, sem screenshots, login ou deploy.
