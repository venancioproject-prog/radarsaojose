from collect_meio_ambiente_p3 import *
import re
if __name__=='__main__':
    urls=re.findall(r'https[^"<>\s]+',(RAW/'snis-diagnosticos.html').read_text(encoding='utf8'))
    for u in urls:
        if any(t in u for t in ['Planilha','planilha','Glossario_Indicadores_AE']):fetch('snis-'+u.rsplit('/',1)[-1],u)
    for layer in range(6):fetch(f'cetesb-pol-valid-{layer}.json',f'https://arcgis.cetesb.sp.gov.br/server/rest/services/QUALAR/CETESB_QUALAR/MapServer/{layer}/query?where=STATNM%20LIKE%20%27%25Jos%25%27&outFields=*&outSR=4326&f=pjson')
    for name,url in [
        ('ibge-metadados.json','https://servicodados.ibge.gov.br/api/v1/pesquisas/10058/indicadores'),
        ('snis-agua-archive.html','https://www.gov.br/cidades/pt-br/assuntos/saneamento/snis/diagnosticos-anteriores-do-snis/agua-e-esgotos-1'),
        ('inmet-taubate-teste.json','https://apitempo.inmet.gov.br/estacao/2025-01-01/2025-12-31/A728'),
        ('vegetacao-2020-metadata.xml','https://datageo.ambiente.sp.gov.br/geoserver/datageo/ows?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=datageo:IndiceCoberturaVegetalNativa2020'),
        ('cetesb-ar-indice.html','https://cetesb.sp.gov.br/ar/indice-de-qualidade-do-ar/'),
    ]:fetch(name,url)
