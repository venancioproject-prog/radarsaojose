from collect_meio_ambiente_p3 import *
import re,html
def links(file):return [html.unescape(u) for u in re.findall(r'https[^"<>\s]+',(RAW/file).read_text(encoding='utf8'))]
if __name__=='__main__':
    for token,name in [('SINISA_Resultados_Ref2024.zip','sinisa-agua-2024.zip'),('SINISA_ESGOTO_Planilhas_2024.zip','sinisa-esgoto-2024.zip'),('SINISA_RESIDUOS_planilhas_2024.zip','sinisa-residuos-2024.zip')]:fetch(name,next(u for u in links('sinisa-2025.html') if u.endswith(token)))
    for name,url in [
        ('inpe-sp-files.html','https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/EstadosBr_sat_ref/SP/'),
        ('inmet-estacoes-conv.json','https://apitempo.inmet.gov.br/estacoes/M'),
        ('inmet-historicos.html','https://portal.inmet.gov.br/dadoshistoricos'),
        ('snis-diagnosticos.html','https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/snis/produtos-do-snis/diagnosticos-snis'),
        ('sinisa-agua-glossario.pdf','https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/sinisa/resultados-sinisa/INDICADORES_SINISA_ABASTECIMENTO_DE_AGUA_2024_v2.pdf'),
        ('emissoes-municipal.html','https://www.sjc.sp.gov.br/servicos/urbanismo-e-sustentabilidade/mudancas-climaticas/'),
        ('arborizacao-municipal.pdf','https://servicos.sjc.sp.gov.br/downloads/elat667.pdf'),
        ('inpe-faq-official.html','https://www.terrabrasilis.dpi.inpe.br/queimadas/portal/pages/secao_informacoes/faq/index.html'),
        ('cetesb-ar-2024-www.pdf','https://www.cetesb.sp.gov.br/ar/wp-content/uploads/sites/28/2025/06/Relatorio-de-Qualidade-do-Ar-no-Estado-de-Sao-Paulo-2024.pdf'),
        ('cetesb-aguas-2023.pdf','https://cetesb.sp.gov.br/emergencias-quimicas/wp-content/uploads/sites/12/2024/11/RAI-2023-Relatorio-de-Qualidade-de-Aguas-Interiores-2023.pdf'),
        ('ana-estacoes.html','https://www.snirh.gov.br/hidroweb/apresentacao'),
        ('ibge-censo-esgoto.json','https://servicodados.ibge.gov.br/api/v1/pesquisas/10058/indicadores/60030/resultados/3549904'),
        ('ibge-municipio.html','https://www.ibge.gov.br/cidades-e-estados/sp/sao-jose-dos-campos.html'),
    ]:fetch(name,url)
