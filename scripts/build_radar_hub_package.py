"""Gera pacote atômico e fallback idêntico. Não valida fontes oficiais."""
import json, hashlib, re, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'data/radar_hub'
def read(n): return json.loads((BASE/n).read_text(encoding='utf-8-sig'))
def canonical(v): return json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':'))

def apply_mobilidade_reconciliation(gt, overlay):
    """Reaplica as suspensões por ID, mesmo se um extrator legado restaurar TOTAL/MÉDIA."""
    rows=gt['eixos']['mobilidade']['series_auditadas']['transporte_bilhetagem']
    overrides=overlay['overrides'];ids=[r['evidence_id'] for r in overrides]
    if len(ids)!=42 or len(set(ids))!=42:raise ValueError('Reconciliação exige 42 IDs únicos')
    index={r['evidence_id']:r for r in rows}
    if len(index)!=len(rows):raise ValueError('Bilhetagem com IDs duplicados')
    for correction in overrides:
        row=index.get(correction['evidence_id'])
        if row is None or row['period']!=correction['period'] or row['source_metadata_id']!=correction['source_metadata_id']:
            raise ValueError('Recorte incompatível com reconciliação: '+correction['evidence_id'])
        if correction['value'] is not None or correction['status']!='SUSPENSO_ERRO_COLUNA':
            raise ValueError('Override não pode promover valor suspenso')
        for field in ['value','normalized_value','display_value']:row[field]=None
        row['status']=correction['status']
    return gt

def write_atomic(path, text):
    temp=path.with_name(path.name+'.generated.tmp')
    temp.write_text(text,encoding='utf8')
    try:temp.replace(path)
    except PermissionError:
        source=str(temp).replace("'","''");target=str(path).replace("'","''")
        subprocess.run(['powershell','-NoProfile','-Command',f"Copy-Item -LiteralPath '{source}' -Destination '{target}' -Force -ErrorAction Stop"],check=True)
def build():
    gt=read('sjc_open_data_ground_truth.json');previous=canonical(gt)
    overlay=BASE/'mobilidade_reconciliation_20261008.json'
    if (BASE/'consolidacao_status.json').exists() and not overlay.is_file():raise ValueError('Reconciliação da bilhetagem obrigatória nesta versão')
    if overlay.is_file():apply_mobilidade_reconciliation(gt,read(overlay.name))
    if canonical(gt)!=previous:write_atomic(BASE/'sjc_open_data_ground_truth.json',json.dumps(gt,ensure_ascii=False,indent=2)+'\n')
    payload = {'groundTruth':gt, 'metadataRegistry':read('sjc_metadata_registry.json'),
               'benchmark':read('sjc_benchmark_multicidades.json'), 'historicalAudit':read('audit_report.json'),
               'consistency':read('radar_hub_consistency.json')}
    # Auditoria restrita a Economia; não promove a auditoria histórica global.
    if (BASE/'economia_audit_bindings.json').exists():
        payload['economiaAudit']=read('economia_audit_bindings.json')
    if (BASE/'financas_audit_bindings.json').exists():
        payload['financasAudit']=read('financas_audit_bindings.json')
    if (BASE/'meio_ambiente_audit_bindings.json').exists():
        payload['meioAmbienteAudit']=read('meio_ambiente_audit_bindings.json')
    if (BASE/'mobilidade_audit_bindings.json').exists():
        payload['mobilidadeAudit']=read('mobilidade_audit_bindings.json')
    if (BASE/'consolidacao_status.json').exists():
        payload['consolidacaoStatus']=read('consolidacao_status.json')
    # Evidence stores completos continuam disponíveis por eixo; não duplicar no carregamento.
    fingerprint = hashlib.sha256(canonical(payload).encode()).hexdigest()
    package = {'schema_version':1,'dataset_version':'sha256:'+fingerprint,
               'source_registry_version':payload['metadataRegistry'].get('registry_version'),
               'audit_status':'AUDITORIA_NAO_CARREGADA', 'auditReport':None,
               'audit_note':'Relatório histórico sem vínculo verificável com esta versão; não é auditoria atual.', **payload}
    write_atomic(BASE/'radar_hub_package.json',json.dumps(package,ensure_ascii=False,separators=(',',':'))+'\n')
    controller=ROOT/'radar_hub_controller.js'
    code=controller.read_text(encoding='utf-8')
    declaration='const RADAR_HUB_PACKAGE = '+json.dumps(package,ensure_ascii=False,separators=(',',':'))+';'
    if '/* RADAR_HUB_PACKAGE_START */' in code:
        code=re.sub(r'/\* RADAR_HUB_PACKAGE_START \*/.*?/\* RADAR_HUB_PACKAGE_END \*/',lambda m:'/* RADAR_HUB_PACKAGE_START */\n'+declaration+'\n/* RADAR_HUB_PACKAGE_END */',code,flags=re.S)
    else:
        start=code.index('const RADAR_HUB_GROUND_TRUTH = ')
        end=code.index('(function()',start)
        code=code[:start]+'/* RADAR_HUB_PACKAGE_START */\n'+declaration+'\n/* RADAR_HUB_PACKAGE_END */\n\n'+code[end:]
    write_atomic(controller,code)
    print(package['dataset_version'])
    return package
if __name__=='__main__':build()
