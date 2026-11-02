from pathlib import Path
import json,html,re
O=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude');t=(O/'raw/cnes-leitos-202412.html').read_text(encoding='latin1');rows=[]
for i,r in enumerate(re.findall(r'<tr\b[^>]*>(.*?)</tr>',t,re.S|re.I)):
 c=[' '.join(html.unescape(re.sub('<[^>]+>',' ',x)).split()) for x in re.findall(r'<td\b[^>]*>(.*?)</td>',r,re.S|re.I)]
 if len(c)==4 and re.fullmatch(r'\d{2}',c[0]) and c[2].isdigit() and c[3].isdigit():rows.append(dict(code=c[0],description=c[1],existing=int(c[2]),second_column=int(c[3]),html_tr_index=i,second_column_label='Habilitados' if c[0] in {'74','75','76','78','79','80','81','82','83','85','86','92','95'} else 'SUS'))
selected=re.findall(r'<option[^>]*selected[^>]*>.*?(?=<option|</select>)',t,re.S|re.I)
assert any('354990' in x and 'CAMPOS' in x for x in selected)
assert any('202412' in x for x in selected)
a={r['code']:r for r in rows};out=dict(selected_options=selected,rows=rows,derived={'existing_including_hospital_day_excluding_complementary':sum(r['existing'] for r in rows if r['second_column_label']=='SUS'),'complementary_existing':sum(r['existing'] for r in rows if r['second_column_label']=='Habilitados'),'uti_adult_codes_74_75_76_existing':sum(a[x]['existing'] for x in ['74','75','76']),'uti_pediatric_codes_78_79_existing':sum(a[x]['existing'] for x in ['78','79']),'uti_neonatal_codes_80_81_82_existing':sum(a[x]['existing'] for x in ['80','81','82'])},note='Coluna complementar habilitados não se denomina SUS; não somar a coluna SUS dos demais grupos. 88 hospital-dia incluídos na soma sem complementar; 1569 não implica leitos de internação convencional.' )
(O/'cnes-extracao.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8');print(out['derived'],len(rows))
