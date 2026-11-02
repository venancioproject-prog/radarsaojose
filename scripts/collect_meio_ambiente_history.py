from collect_meio_ambiente_p3 import *
import re
if __name__=='__main__':
    index=(RAW/'inpe-sp-files.html').read_text();files=re.findall(r'href="(focos_br_sp_ref_\d{4}\.zip)"',index)
    for name in files:fetch('inpe-'+name,'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/EstadosBr_sat_ref/SP/'+name)
    for p in range(6):fetch(f'cetesb-pol-{p}.json',f'https://arcgis.cetesb.sp.gov.br/server/rest/services/QUALAR/CETESB_QUALAR/MapServer/{p}/query?where=Nome%20LIKE%20%27%25Jos%25%27&outFields=*&outSR=4326&f=pjson')
