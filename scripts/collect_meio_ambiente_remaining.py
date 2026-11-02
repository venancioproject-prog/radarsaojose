from collect_meio_ambiente_p3 import *
import re,html
if __name__=='__main__':
    for year in list(range(1995,2010))+[2018,2019,2020,2021]:
        s=(RAW/f'snis-ano-{year}.html').read_text(encoding='utf8');a=s.find('id="parent-fieldname-text"');s=s[a:]
        urls=re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>',s,re.S)
        candidates=[html.unescape(u) for u,t in urls if u.lower().endswith('.zip') and 'gov.br' in u and any(x in (u+' '+t).lower() for x in ['planilha','tabelas']) and 'atestado' not in (u+t).lower()]
        for i,u in enumerate(dict.fromkeys(candidates)):fetch(f'snis-planilhas-{year}-{i}.zip',u)
    fetch('snis-regionais-2014-0.zip',next(l['url'] for l in read(LOG) if l['name']=='snis-regionais-2014-0.zip'))
    # Glossários/metadados efetivamente ligados pelas páginas de resultados.
    for file in ['sinisa-resultados.html','sinisa-2025.html']:
        s=(RAW/file).read_text(encoding='utf8')
        for u in dict.fromkeys(re.findall(r'https[^"<>\s]+',s)):
            if u.endswith('.pdf') and 'indicador' in u.lower() and ('gloss' in u.lower() or 'INDICADORES_SINISA' in u):fetch('metodo-'+u.rsplit('/',1)[-1],u)
            if file=='sinisa-resultados.html' and u.endswith('.zip') and 'resid' in u.lower():fetch('sinisa-residuos-2023.zip',u)
