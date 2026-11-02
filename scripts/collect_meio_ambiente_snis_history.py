from collect_meio_ambiente_p3 import *
import re,html
if __name__=='__main__':
    for year in range(1995,2022):
        p=fetch(f'snis-ano-{year}.html',f'https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/snis/diagnosticos-anteriores-do-snis/agua-e-esgotos-1/{year}')
        if not p:continue
        s=p.read_text(encoding='utf8',errors='replace')
        anchors=re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>',s,re.S)
        candidates=[html.unescape(u) for u,t in anchors if ('regiona' in (u+' '+t).lower()) and any(v in u.lower() for v in ['.zip','.xls']) and any(v in (u+' '+t).lower() for v in ['completa','completas'])]
        for i,u in enumerate(dict.fromkeys(candidates)):fetch(f'snis-regionais-{year}-{i}'+('.zip' if '.zip' in u.lower() else '.xls'),u)
    fetch('cetesb-o3-layer233.json','https://datageo.ambiente.sp.gov.br/arcgis/rest/services/Datageo/DADOS_QUALAR/MapServer/233/query?where=1%3D1&outFields=*&f=pjson')
