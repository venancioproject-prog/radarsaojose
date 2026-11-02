from pathlib import Path
import json
from pypdf import PdfReader
P=Path(__file__).parent
m=json.loads((P/'manifest.json').read_text(encoding='utf-8')); refs={Path(x['file']).name:x for x in m}
s=PdfReader(P/'raw/sms2025.pdf');r=PdfReader(P/'raw/rag2025.pdf')
p24=s.pages[23].extract_text();p26=s.pages[25].extract_text();p7=r.pages[6].extract_text()
assert 'Resultado 2025' in p24 and '57,95 57,95' in p24
assert 'Resultado 2025' in p26 and '6,77 7,65' in p26 and '8,2' in p26
assert '38.738\n41.846' in p7 and '4.677\n5.028' in p7
specs=[('saude_mortalidade_infantil',8.2,2024,7.65,2025,'sms2025.pdf',26,'Taxa publicada anual por mil nascidos vivos; resultado2025 preliminar/revisável, não3ºquadrimestre6.77. Numeradores/denominadores não publicados: não inventar/recalcular.'),('saude_cobertura_atencao_basica',61.63,2024,57.95,2025,'sms2025.pdf',24,'Cobertura populacional estimada APS, não ESF; colunaResultado2025, não pessoa observada. Dado2024últimoMSabril, edição2025documental distinta.'),('saude_atencao_basica_cnes_sia',61.63,2024,57.95,2025,'sms2025.pdf',24,'Mesmo indicadorAPS duplicado nos doisIDs. Atualizar ambos coerentemente; não criar duas medidas independentes nem agregar.'),('saude_internacoes_sih',38738,2024,41846,2025,'rag2025.pdf','6–7','Internações SUS de residentes/anoSIH, consulta13/05/2026, revisável. Não todasAIHs, não atendimento em hospitaisSJC.'),('saude_causas_mortalidade',4677,2023,5028,2024,'rag2025.pdf',7,'Óbitos residentesSIM por anoóbito, consulta13/05/2026.2025não disponível; não atualizar para2025nem inferir causa/pessoa.')]
d=json.loads((P/'matriz-decisoes.json').read_text(encoding='utf-8'))
d['decisions']=[x for x in d['decisions'] if x.get('key') not in [a[0] for a in specs]]
for key,b,by,a,ay,f,page,note in specs:
 d['decisions'].append(dict(axis='saude',key=key,status='APROVADO_ATUALIZACAO_ATIVO_APOS_QA',before=dict(value=b,competencia=by),after=dict(value=a,competencia=ay),source=refs[f],locator=dict(page=page,column='Resultado2025' if f=='sms2025.pdf' else str(ay)),reason=note+' Preservar ano anterior na série, rótulos/unidades e histórico. Nove suspensões mantidas.',independent_numerical_qa_required=True,promotion_of_suspended=False,own_reproduction='adendo_saude.py'))
d['active_health_period_updates']=5
(P/'matriz-decisoes.json').write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
report=(P/'relatorio.md').read_text(encoding='utf-8').replace('registra 25 decisões','registra 30 decisões')
if '## Adendo — atualização de cinco ativos Saúde' not in report:
 report+='''\n\n## Adendo — atualização de cinco ativos Saúde\n\nA decisão genérica anterior cobria as atualizações. Este adendo explicita cincoIDs e adiciona reprodução própria das páginas24/26 do Q3/2025 e7 do RAG2025, a partir dos PDFs oficiais já preservados/hashados. A matriz agora contém30decisões; são cinco atualizações de competência de ativos, não promoção de suspensos.\n\n|ID|Antes|Depois|Recorte|\n|---|---|---|---|\n|saude_mortalidade_infantil|8.2/2024|7.65/2025 preliminar|Anual publicado, por mil nascidos vivos; não6.77quadrimestral|\n|saude_cobertura_atencao_basica|61.63/2024|57.95/2025|Cobertura populacional estimada APS|\n|saude_atencao_basica_cnes_sia|61.63/2024|57.95/2025|Mesmo indicadorAPS, atualizar coerentemente sem dupla agregação|\n|saude_internacoes_sih|38738/2024|41846/2025|InternaçõesSUS de residentes, edição consulta13/05/2026|\n|saude_causas_mortalidade|4677/2023|5028/2024|ÓbitosSIM residentes;2025ausente|\n\nParecer favorável apósQA das células/cabeçalhos. Mortalidade2025 continua preliminar/revisável; não trocar status por definitivo. APS estimada não ESF nem cobertura observada; SINASC/SIM e taxas de outra edição não fornecem denominadores intercambiáveis. SIH/SIM estão sujeitos a revisão documental. Preservar valores anteriores nas séries e9KPIsnull. Adendo reproduzível por adendo_saude.py; fontes e hashes nas decisões individuais. Não executar gerar_decisoes.py isoladamente apósesteadendo: ele gera a matriz-base; para reconstrução executar em seguida adendo_saude.py.\n'''
(P/'relatorio.md').write_text(report,encoding='utf-8')
print('5 atualizações explícitas; 4 verificações de páginas primárias aprovadas')
