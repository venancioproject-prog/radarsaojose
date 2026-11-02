# Fonte canônica e resolução de versões

Bruto oficial (URL, edição, hash) → evidence ID/célula/recorte → ground truth e registry reconciliados → `build_radar_hub_package.py` → package e fallback inline com o mesmo fingerprint.

O registry declara unidade, competência, fonte, status e aviso; o ground truth mantém séries e recortes. Não são fontes externas independentes. O package transporta as duas representações já conferidas, não escolhe a mais recente pelo mtime. `consolidacao_status.json` declara `homologated:false` e aponta para relatório/journal/store vigente.

`consolidacao_evidence_2026-10-08.json` vincula indicadores atuais às fontes. P1–P4 conservam seus stores históricos. Para os 42 evidence IDs de bilhetagem, `mobilidade_reconciliation_20261008.json` prevalece explicitamente sobre o store P4 imutável; os valores ativos são null. `raw_value_from_failed_extraction` é registro forense do erro, não valor realizado. Auditorias posteriores em conflito são acervo histórico, não uma segunda fonte ativa.

Nacionais de Censo/IDEB não são carregados pela interface. O novo package não duplica resumos internos de evidências demográficas/educacionais pouco documentados; os originais continuam no snapshot e acervo. Brutos, SHA e locators permanecem acessíveis em manifests/store. A ausência do relatório global de auditoria não autoriza status global confirmado.

Mapa: camada municipal e geometria continuam preservadas. Não há crosswalk validado para população/setor; mapa quantitativo permanece em fallback. Benchmarks multicidades são acervo e têm renderização suspensa até comprovação compatível por cidade; não foram usados para homologação.
