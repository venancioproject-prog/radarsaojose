"""Registra a decisão técnica do integrador, não a homologação humana final."""
from pathlib import Path
import json,hashlib,datetime
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
qa=load(OUT/'qa/validacao-evidencias.json');method=load(OUT/'metodologia/matriz-decisoes.json')
assert qa['status']=='PASS' and qa['checks_count']>=3229
assert len(method['decisions'])==30 and method['promotion_count']==6
ad=[ 'qa/validacao-cnes.json','qa/validacao-refresh-saude.json','qa/validacao-integracao-proposta.json']
for p in ad:assert load(OUT/p)['status']=='PASS',p
obj={'decision_date':'2026-10-08','utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
     'qa_approved':True,'methodology_approved':True,'human_review_pending':True,
     'qa_sha256':sha(OUT/'qa/validacao-evidencias.json'),'methodology_sha256':sha(OUT/'metodologia/matriz-decisoes.json'),
     'additional_validations':{p:sha(OUT/p) for p in ad},
     'proposed_gt_sha256':sha(OUT/'integracao-proposta-ground-truth.json'),'proposed_registry_sha256':sha(OUT/'integracao-proposta-registry.json'),
     'promotions':{'demo_populacao_estimada_2024':724756,'demo_populacao_estimada_2026':729153,'demo_taxa_urbanizacao':98.72,
                   'seg_roubos_veiculos_2024':143,'seg_furtos_veiculos_2024':724,'seg_produtividade_prisoes':2170},
     'active_updates':{'saude_mortalidade_infantil':{'value':7.65,'year':2025,'preliminary':True},'saude_cobertura_atencao_basica':{'value':57.95,'year':2025},
         'saude_atencao_basica_cnes_sia':{'value':57.95,'year':2025},'saude_internacoes_sih':{'value':41846,'year':2025},'saude_causas_mortalidade':{'value':5028,'year':2024}},
     'constraints':['Nove KPIs Saúde continuam null; CNES52códigos só como série discreta limitada/export.',
        'Quatro contagens anuais2001 em conflito suspensas; taxa nativa SSP/SEADE separada e meses2001 distinguem registro/ocorrência.',
        '35 geometrias sem associação populacional comprovada; mapa, ranking e densidades suspensos.',
        'Metas IDEB2023 null; técnica7316 distinta profissional total7322; competências2023 não substituídas por2025.',
        'CVE separado SMS SE1–50; censos separados estimativas; sem interpolação ou preenchimento de lacunas.',
        'Gates gráficos incompletos preservados; correções pontuais de texto/denominador; sem redesign.',
        'P1–P4, app.js e fontes brutas preservados; sem deploy ou screenshots.'],
     'historical_authority':'Campos antigos e divergências preservados em arquivos de histórico; retirados da autoridade ativa.',
     'limitations':'QA independente não rebaixou todos os arquivos nacionais novamente; verificou os brutos primários preservados e hashes. Chrome em fixture não comprova login/aplicação completa.'}
(OUT/'decisoes-integracao.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
names=['app.js','data/radar_hub/sjc_setores_socioeconomicos_geo.json','data/radar_hub/sjc_setores_geo_bundle.js','data/radar_hub/sjc_regioes_geo.json',
       'data/radar_hub/economia_audit_bindings.json','data/radar_hub/financas_audit_bindings.json','data/radar_hub/meio_ambiente_audit_bindings.json','data/radar_hub/mobilidade_audit_bindings.json','data/radar_hub/mobilidade_reconciliation_20261008.json']
protected={'captured_before_integration':True,'files':[{'file':n,'sha256':sha(ROOT/n),'bytes':(ROOT/n).stat().st_size} for n in names]}
(OUT/'protecao-antes-integracao.json').write_text(json.dumps(protected,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Decisão técnica registrada; revisão humana final pendente.')
