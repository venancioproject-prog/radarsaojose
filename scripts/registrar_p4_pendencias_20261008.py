from educacao_p5_core import *
P4=ROOT/'docs/dados-publicos-revisao/p4-mobilidade'
gt=read(BASE/'sjc_open_data_ground_truth.json');mob=gt['eixos']['mobilidade'];meta=mob.get('series_metadata',{})
rows=[{**meta.get(r.get('source_metadata_id'),{}),**r} for r in mob.get('series_auditadas',{}).get('transporte_bilhetagem',[])]
future=[r for r in rows if r['period']>='2026-09'];bad=[r for r in future if r.get('value') is not None];strict_future=[r for r in bad if r['period']>'2026-10']
tracked=set(subprocess.check_output(['git','ls-files'],cwd=ROOT,encoding='utf8').splitlines());scripts=sorted(set(ROOT.glob('scripts/*mobilidade*'))|{ROOT/'scripts/build_radar_hub_package.py',ROOT/'scripts/meio_ambiente_workbooks.py',ROOT/'scripts/inspect_anac_csv.py'})
inventory=[]
for p in scripts:
 if not p.is_file():continue
 rel=str(p.relative_to(ROOT)).replace('\\','/');ignored=subprocess.run(['git','check-ignore','-v','--',rel],cwd=ROOT,capture_output=True,text=True)
 inventory.append({'path':rel,'sha256':sha(p),'tracked':rel in tracked,'ignore_rule':ignored.stdout.strip() or None})
result={'date':DATE,'acceptance':'ACEITA_PARA_CONTINUIDADE_COM_RESSALVAS','definitively_homologated':False,'suspensions_preserved':True,'bilhetagem_future_cells':len(future),'future_non_null':len(bad),'scripts':inventory,'package_bytes':(BASE/'radar_hub_package.json').stat().st_size,'pending':['Confirmar null e corte de competência na UI e exportação para futuros períodos.','Não somar natureza/grupo/direção ANAC indevidamente; sem registro não prova zero.','Testes posteriores em navegador real, dispositivos móveis e conexões lentas.','Versionar ou definir distribuição reproduzível dos scripts essenciais ignorados/não rastreados, sem commit nesta etapa.']}
save(P4/'pendencias-continuidade-2026-10-08.json',result)
result.update(assessment='PENDENCIA_CRITICA_CORTE_TEMPORAL',non_null_after_august=[{k:r.get(k) for k in ['evidence_id','period','value','category','operator_group','raw_reference','locator']} for r in bad],non_null_strictly_future=len(strict_future));save(P4/'pendencias-continuidade-2026-10-08.json',result)
text=f'''# P4 — Encerramento provisório e pendências para continuidade

Registro de 8 de outubro de 2026. A P4 foi aceita para continuidade com ressalvas. Isso não equivale à homologação definitiva. As suspensões de motorização, óbitos e perfil de vítimas permanecem preservadas. Nenhum dado de Mobilidade foi alterado neste registro.

1. **Competências futuras da bilhetagem — pendência crítica encontrada.** Inspeção do ground truth atual: {len(future)} células de setembro–dezembro de 2026; {len(bad)} valores preenchidos após o corte de agosto, incluindo {len(strict_future)} atribuídos a novembro, futuro em 2026-10-08. Portanto, NÃO é possível declarar que todas permanecem null. O JSON adjacente registra IDs, valores e localizadores. Conferir posições de colunas, totais/médias e competência original do PDF antes de corrigir; pode haver deslocamento de colunas. Não foram alterados valores de Mobilidade nesta etapa. A revisão anterior em VM não substitui essa verificação nem o teste posterior em navegador, filtros e exportações. Ano parcial não pode ser apresentado como realizado completo.
2. **Recortes da ANAC.** Manter partida/chegada, natureza e grupo de voo separados. Não somar um agregado aos seus componentes, confundir etapas com pessoas únicas ou tratar ausência de linha como zero. Continuam necessárias revisões das agregações e da interpretação em futuras visualizações; não ampliar o universo para toda aviação geral sem prova.
3. **Desempenho e navegador real.** Pacote atual: {result['package_bytes']:,} bytes. Referência P4: aproximadamente 36 MB. Registrar testes posteriores em navegador real, dispositivos móveis, memória limitada e conexões lentas, incluindo carga inicial, fallback, filtros e exportação. Tais testes não foram executados nesta etapa e não serão substituídos por screenshots.
4. **Versionamento da reprodução.** Há {sum(not s['tracked'] for s in inventory)} de {len(inventory)} scripts/dependências relacionados que não estão rastreados pelo Git. O JSON adjacente identifica cada arquivo, SHA256, status e regra de ignore. Estar no disco não equivale a estar versionado. A regra *.py ignora scripts essenciais; exceções existentes são insuficientes. Definir versionamento e disponibilização dos brutos/manifests antes de afirmar reprodução a partir de checkout limpo. Não foi alterado .gitignore nem realizado commit.

O diagnóstico é uma verificação documental do estado encontrado em 2026-10-08. Não resolve definitivamente as pendências. Próxima etapa autorizada: P5 Educação. P4.1 e revisão visual continuam dependentes de novo pedido humano.
'''
(P4/'pendencias-continuidade-2026-10-08.md').write_text(text,encoding='utf8')
report=P4/'relatorio-final.md';s=report.read_text(encoding='utf8');marker='## Aceitação provisória para continuidade — 2026-10-08'
if marker not in s:report.write_text(s+'\n\n'+marker+'\n\nA P4 foi aceita com ressalvas, sem homologação definitiva. Ver [pendências formais](pendencias-continuidade-2026-10-08.md) e o inventário de scripts no JSON adjacente. Indicadores suspensos permanecem suspensos.\n',encoding='utf8')
print('P4 pendências registradas:',len(future),'células futuras;',len(bad),'não null;',sum(not s['tracked'] for s in inventory),'scripts não versionados.')
