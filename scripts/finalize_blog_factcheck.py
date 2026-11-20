"""Registra decisões da checagem editorial de 20/11/2026 e patches reproduzíveis."""
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'docs/blog'
articles = json.loads((ROOT / 'radar-sao-jose-30-artigos.json').read_text(encoding='utf-8'))['articles']
by_slug = {a['slug']: a for a in articles}
# As decisões são sempre aplicadas à origem imutável, mesmo após reimportações.
with zipfile.ZipFile(ROOT / 'radar-sao-jose-30-artigos-revisados-individuais.zip') as archive:
    for name in archive.namelist():
        if not name.endswith('.md'):
            continue
        slug = re.sub(r'^\d+-|\.md$', '', Path(name).name)
        source = archive.read(name).decode('utf-8-sig')
        public = re.split(r'^## (?:SEO[^\n]*|Metadados sugeridos)\s*$', source, maxsplit=1, flags=re.M)[0]
        public = re.sub(r'^# .+\n', '', public, count=1)
        public = re.sub(r'^\*\*(?:Linha fina|Resumo para card):\*\*[^\n]*\n', '', public, flags=re.M)
        public = re.sub(r'^## Corpo publicável\s*$', '', public, flags=re.M)
        by_slug[slug]['article_markdown'] = public.strip().rstrip('-').strip()
sources = json.loads((ROOT / 'tmp/blog-factcheck/index.json').read_text(encoding='utf-8'))
corrections = []


def patch(slug, old, new, reason):
    assert old in by_slug[slug]['article_markdown'], (slug, old)
    corrections.append(dict(slug=slug, old=old, new=new, reason=reason))


def paragraph(slug, start):
    return next(p for p in by_slug[slug]['article_markdown'].split('\n\n') if p.startswith(start))


slug = 'cursos-de-tecnologia-sjc'
patch(slug, 'As inscrições ocorreram de 28 de outubro a 18 de novembro de 2026, portanto já estavam encerradas na data desta consulta.',
      'Na consulta de 20 de novembro de 2026, a página oficial informava inscrições abertas até 4 de dezembro de 2026, às 23h59, com pagamento da taxa até 7 de dezembro. O cronograma foi atualizado; confira eventuais novas alterações no portal.',
      'Prazo vigente no portal e errata nº 3 de 18/11/2026; evita informar encerramento incorreto.')

slug = 'por-que-sao-jose-ciencia-tecnologia'
patch(slug, 'Em 1960, foi criado o grupo que deu origem ao instituto nacional de pesquisa espacial.',
      'O Grupo de Organização da Comissão Nacional de Atividades Espaciais (GOCNAE), que deu origem ao INPE, foi criado em 3 de agosto de 1961. [Registro histórico do INPE](https://www.inpe.br/noticias/noticia.php?Cod_Noticia=3350).',
      'A proposta de 1960 foi confundida com a criação do GOCNAE em 1961.')

slug = 'via-dutra-aproxima-ou-divide-sjc'
patch(slug, '**Volume V: Crescimento Urbano e Industrialização em São José dos Campos**, 2018.',
      '**Volume V: Crescimento Urbano e Industrialização em São José dos Campos**, 2010.',
      '2018 é parte do endereço de upload; ficha catalográfica e copyright identificam edição de 2010.')

for slug in ['bairros-sao-jose-dos-campos-servicos', 'onde-estao-hospitais-unidades-sjc']:
    patch(slug, '612, de 30 de dezembro de 2018', '612, de 30 de novembro de 2018',
          'O texto promulgado e o Boletim 2503 confirmam novembro; página explicativa municipal contém erro.')

slug = 'tecnologia-sao-jose-dos-campos'
patch(slug, 'São José dos Campos exportou US$ 4,061 bilhões em bens em 2025. Desse total, US$ 2,95 bilhões foram classificados no grupo de aviões, helicópteros e satélites, aproximadamente 73% das vendas externas do município.',
      'Segundo a divulgação municipal dos dados da Secretaria de Comércio Exterior, São José dos Campos exportou cerca de US$ 4,1 bilhões em bens em 2025. O grupo de aviões, helicópteros e satélites somou US$ 2,95 bilhões, aproximadamente 72% do total informado pela Prefeitura.',
      'A fonte citada publica US$ 4,1 bilhões e 72%; o total mais preciso de US$ 4,061 bilhões não foi reproduzido no Comex Stat interativo.')
patch(slug, 'Somados esses dois grupos, a cadeia aeronáutica responde por cerca de 78% do valor exportado.',
      'Somados, os valores divulgados para esses dois grupos equivalem a cerca de 77% do total arredondado de US$ 4,1 bilhões. É um cálculo com as categorias da publicação, não uma medição completa de toda a cadeia aeronáutica.',
      'Recalcula participação com o mesmo denominador e evita equiparar dois grupos à cadeia inteira.')

slug = 'onde-estao-os-empregos-sao-jose-dos-campos'
patch(slug, 'A atualização mais recente consultada confirma', 'O balanço de janeiro a novembro de 2025 consultado confirma',
      'Evita chamar números de 2025 de atualização mais recente quando já há divulgação de 2026.')
patch(slug, 'O melhor mapa disponível dos empregos formais', 'Um diagnóstico municipal dos empregos formais',
      'A consulta confirma o diagnóstico histórico, mas não demonstra que seja o melhor mapa disponível.')

slug = 'como-moradores-se-deslocam-sjc'
patch(slug, '## O último retrato medido é de 2011', '## O retrato de 2011 reúne viagens de todos os motivos',
      'O Censo 2022 já traz deslocamentos para trabalho; o diferencial da OD é o universo de viagens.')
patch(slug, 'A melhor resposta pública disponível à pergunta sobre como os joseenses se deslocam vem de uma pesquisa com 15 anos:',
      'A Pesquisa Origem e Destino de 2011 oferece um retrato histórico das viagens diárias de todos os motivos, diferente do recorte de trabalho do Censo 2022:',
      'Delimita os universos sem afirmar inexistência de dados posteriores.')

slug = 'acesso-saude-regioes-sjc'
patch(slug, 'O acesso à saúde em São José dos Campos não está resolvido de forma universal na atenção básica: o Plano Municipal de Saúde',
      'O Plano Municipal de Saúde', 'Cobertura potencial inferior a 100% não demonstra quantas pessoas conseguiram atendimento.')
patch(slug, 'p. 36', 'p. 34 (página 35 do PDF)', 'Conferência visual e textual da tabela de metas no plano 2026–2029.')

slug = 'bairros-cresceram-sao-jose-dos-campos'
old = 'Esses recortes não devem ser tratados como bairros urbanos.'
patch(slug, old, old + ' Há uma divergência entre publicações municipais: esta notícia comparativa de 2024 registra 61.780 moradores no Norte e 15.372 na zona rural; a [página de população](https://www.sjc.sp.gov.br/servicos/governanca/populacao/) informa 61.940 e 15.212, respectivamente. Os totais municipais são iguais. A série de crescimento aqui mantém os valores da tabela comparativa, sem interpretar a diferença entre versões como mudança real de residentes.',
      'Explicita divergência de 160 residentes entre duas publicações oficiais.')

slug = 'populacao-sao-jose-dos-campos-crescimento'
patch(slug, 'A estimativa confirma o aumento do total municipal;', 'A estimativa aponta um total municipal maior, sem substituir uma nova contagem censitária;',
      'Estimativa e contagem censitária são operações diferentes.')

slug = 'expansao-urbana-sao-jose-dos-campos-impactos'
patch(slug, 'A área municipal, de 1.099,61 quilômetros quadrados,',
      'A área municipal, de 1.099,494 quilômetros quadrados na base territorial de 2025 do IBGE,',
      'Atualiza área e identifica o ano da base, em lugar do valor arredondado da página municipal.')

slug = 'crescimento-imobiliario-desigualdade-sjc'
old = paragraph(slug, 'Pesquisadores da Universidade do Vale do Paraíba')
patch(slug, old,
      'Pesquisadores da Universidade do Vale do Paraíba analisaram a urbanização e a segregação socioespacial em um estudo de caso do Rio Comprido. O resumo identifica análise documental e trabalho de campo naquele bairro. Trata-se de uma investigação localizada, publicada em fevereiro de 2021 na edição de 2020 dos anais, e não de uma medição atual de todos os bairros. [Reschilian, Silva e Maciel, página editorial e resumo do estudo](https://revistes.upc.edu/index.php/SIIU/article/view/10122)',
      'Texto integral apresentou falha de acesso; restringe a descrição ao resumo e corrige data editorial.')
patch(slug, 'https://revistes.upc.edu/index.php/SIIU/article/view/10122/1739',
      'https://revistes.upc.edu/index.php/SIIU/article/view/10122', 'Usa página editorial acessível em lugar do PDF indisponível nesta consulta.')
patch(slug, 'Anais do XII Seminário Internacional de Investigação em Urbanismo, 2020.',
      'Anais do XII Seminário Internacional de Investigação em Urbanismo, edição 2020; publicação em 2 de fevereiro de 2021.',
      'Distingue ano da edição e data de publicação informada pelo periódico.')

# O cabeçalho da Prefeitura ainda diz 40, mas a própria lista tem 41 nomes + 4 avançadas.
slug = 'bairros-sao-jose-dos-campos-servicos'
old = paragraph(slug, 'A lista atual da Secretaria Municipal de Saúde')
patch(slug, old,
      'A página da Secretaria Municipal de Saúde apresenta uma divergência interna: o texto de abertura fala em 40 UBS, mas a contagem dos nomes na lista principal resulta em 41 registros, além de quatro Unidades Avançadas em seção separada. A relação principal traz quatro nomes na região Central, 12 na Leste, oito na Norte, dois na Oeste, quatro na Sudeste e 11 na Sul. Essa é uma contagem da página consultada em 20 de novembro de 2026, e não confirmação independente de quantas unidades estavam em operação. A lista distribui endereços pelas seis regiões.',
      'Recontagem da lista oficial: 41 registros principais e quatro avançados; total de abertura está inconsistente.')

slug = 'onde-estao-hospitais-unidades-sjc'
patch(slug, 'A página municipal relaciona 40 unidades básicas;',
      'O cabeçalho da página municipal informa 40 UBS, mas sua lista principal contém 41 nomes na consulta de 20 de novembro de 2026;',
      'Evita reproduzir total divergente como contagem confirmada.')
old = paragraph(slug, 'A lista da Prefeitura distribui as 40 UBS assim:')
patch(slug, old,
      'Na consulta de 20 de novembro de 2026, a lista principal da Prefeitura continha quatro nomes na região Central, 12 na Leste, oito na Norte, dois na Oeste, quatro na Sudeste e 11 na Sul: 41 registros ao todo. Outra seção relacionava quatro Unidades Avançadas. O cabeçalho, porém, ainda mencionava 40 UBS. A divergência impede tratar qualquer desses totais como inventário validado de unidades em operação. O artigo informa o conteúdo de cada parte da página e recomenda conferir o serviço específico antes do deslocamento. [1]',
      'Corrige distribuição regional, separa lista e operação e explicita inconsistência na fonte.')
patch(slug, 'e as cinco Unidades Avançadas aparecem', 'e as quatro Unidades Avançadas listadas aparecem',
      'Atualiza quantidade de registros da seção de Unidades Avançadas.')

slug = 'riscos-ambientais-sjc-clima-enchentes-calor'
patch(slug, 'A camada usa imagens Landsat de 2014 a 2025, com pixels de 30 metros, e compara a temperatura de cada ponto com a mediana do próprio município.',
      'A apresentação metodológica do IAU-USP informa que a base usa estimativas de temperatura de superfície derivadas dos satélites Landsat 8 e 9 para analisar contrastes urbanos entre 2014 e 2025. [Apresentação da base pelo IAU-USP](https://www.iau.usp.br/institucional/historico-de-noticias-do-instituto/urbverde-lanca-base-nacional-de-dados-sobre-ilhas-de-calor-urbanas/).',
      'O mapa interativo não expôs metodologia nesta consulta; retira resolução e mediana não reproduzidas e cita apresentação primária acessível.')

slug = 'conexao-ita-inpe-embraer-parque'
patch(slug, paragraph(slug, 'Há também pesquisa desenvolvida com participação industrial.'), '',
      'Retira exemplo de tese cuja notícia do ITA permaneceu inacessível em HTTP e HTTPS; os demais vínculos estão documentados.')
patch(slug, next(line for line in by_slug[slug]['article_markdown'].splitlines() if line.startswith('- Instituto Tecnológico de Aeronáutica (ITA), “ITA aprova')), '',
      'Retira referência do exemplo não revalidado.')

slug = 'quais-setores-mais-contratam-sao-jose-dos-campos'
patch(slug, 'A agenda do Ministério do Trabalho prevê a divulgação da competência de outubro para 30 de novembro, depois da data desta apuração. ',
      '', 'A URL do calendário redirecionou à página inicial; retira previsão futura não reproduzida em fonte primária acessível.')

titles = json.loads((DEST / 'titulos-revisados.json').read_text(encoding='utf-8'))
titles['tecnologia-sao-jose-dos-campos']['subtitle'] = 'Segundo a divulgação municipal, aeronaves, helicópteros e satélites representaram cerca de 72% das exportações da cidade em 2025. O dado retrata a pauta exportadora, sem medir a participação da inovação no PIB.'
titles['onde-estao-hospitais-unidades-sjc']['subtitle'] = 'A rede básica tem endereços nas seis regiões da cidade. A lista oficial apresenta totais divergentes; equipes, cobertura e funções de cada serviço ajudam a entender o acesso à saúde.'
titles['acesso-saude-regioes-sjc']['subtitle'] = 'O Plano Municipal de Saúde registra cobertura estimada de 61,63% em 2024 e meta de 70% em 2029. As fontes consultadas não detalham a cobertura por região.'
(DEST / 'titulos-revisados.json').write_text(json.dumps(titles, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

checks = [
    ('Censo 2010/2022, crescimento regional e envelhecimento; estimativa de 2026 via resultado indexado do IBGE.', ['distribuicao-de-populacao', 'genero-e-idade']),
    ('Percentuais regionais recalculados; divergência Norte/rural explicitada.', ['distribuicao-de-populacao']),
    ('38.852 e 80.504 idosos; 137.245 e 128.855 crianças; recortes regionais.', ['governanca/populacao']),
    ('43.702 pessoas de 5 anos ou mais em migração de data fixa, tabela 10160.', ['10160/n6']),
    ('Acréscimos regionais e limites da interpretação como expansão física; área atualizada.', ['distribuicao-de-populacao', '1_historia']),
    ('FipeZAP outubro/2026: R$ 49,37/m²; tarifa R$ 5,25; 50 m² + 44 viagens = R$ 2.699,50.', ['fipezap-202610', 'dados-operacionais/']),
    ('FipeZAP dezembro/2025: 7,43%, R$ 45,53/m²; amostra jornalística atribuída e limitada.', ['fipezap-202512', 'aluguel-em-sao-jose']),
    ('60,12% no Sul/Leste; 261.364 nas quatro outras regiões do quadro corrente.', ['governanca/populacao', 'distribuicao-de-populacao']),
    ('Polos e equipamentos no diagnóstico histórico; recontagem da lista UBS e data da LC 612 corrigidas.', ['7_regioes', 'unidades-basicas-de-saude-ubs']),
    ('7.744 unidades habitacionais, 4.301 em Leste/Sudeste; cronologias distintas; resumo acadêmico revalidado.', ['9_habitacao', '7_regioes']),
    ('RAIS/2017 no diagnóstico: 187.441 vínculos, 36.718 nos dez maiores; balanço 2025 separado do mapa.', ['consolidacao-dos-dados', 'perfil-do-mundo-do-trabalho']),
    ('112.518/213.124 = 52,8%; notas de abril/junho/julho/agosto/setembro e especialização aeronáutica.', ['2026/maio/28', 'caged-fevereiro', '2026/novembro/04']),
    ('Produção local e mais de 23 mil empregados globais no relatório SEC; cluster de alcance supramunicipal.', ['cluster-aeroespacial', 'centro-historico-historia']),
    ('SIDRA/2021: serviços 50,11%, indústria 42,39%; abertura de empresas 2026; suspensão setorial confirmada no IBGE.', ['5938/n6', 'abertura-de-empresas']),
    ('170.305 até meia hora; total 268.999 e soma de faixas 266.398 mantidos sem redistribuição.', ['10331/periodos', 'atlas_origem']),
    ('Cronologia institucional; GOCNAE corrigido de 1960 para 1961.', ['inpe/pt-br/acesso-a-informacao/institucional/historia', 'centro-historico']),
    ('ITA/Embraer 2001; acordo agricultura espacial 01/09/2026–31/08/2031; exemplo de tese não revalidado retirado.', ['pgfis.ita', 'cooperacoes-nacionais', 'sei___21192']),
    ('Exportações ajustadas aos valores arredondados e categorias da fonte municipal: US$ 4,1 bi e 72%.', ['2026/janeiro/26']),
    ('Subiter/PIPE e caso Dexco; resultados empresariais atribuídos, sem inferir empregos locais.', ['/3958', '108661', 'da-incubacao']),
    ('120 vagas IFSP e taxa R$ 30; prazo corrigido para 04/12/2026; ofertas municipais datadas.', ['tecnicos-2027', 'sjc.ifsp.edu.br/cursos', 'inscricoes/']),
    ('PlanMob: 46,89%, 26,71%, 23,38%, 2,58%; delimitado a OD/2011 de todos os motivos.', ['diagnostico_planmob']),
    ('Inventário histórico de sete passarelas/seis viadutos confirmado; livro corrigido para 2010.', ['diagnostico_planmob', 'Volume-V-Crescimento']),
    ('Censo regional e objetivos de planejamento; ausência de avaliação regional nas fontes não generalizada para inexistência de dados.', ['distribuicao-de-populacao', 'plano-diretor-lei']),
    ('SIDRA/10332: ônibus 31,13%, automóvel 42,86%; universo e variável distinguidos de duração total.', ['10332/periodos', 'bilhetagem.pdf']),
    ('Corredores, acessos e datas institucionais das rodovias; distâncias explicitamente referenciais.', ['localizacao/', 'a-rodovia/a-rodovia', 'memoria_do_transporte']),
    ('Lista UBS inconsistente explicitada; ata COMUS p. 4 visualizada: APS 58,43%, ESF 41,53% em 2025.', ['unidades-basicas-de-saude-ubs', 'ata-ordina', '2026_1_202603']),
    ('Plano p. 34: cobertura 61,63%/2024 e meta 70%/2029; equipes 84→110; página ESF 73 não combinada como mesma base.', ['2026_1_202603', 'estrategia-saude-da-familia']),
    ('Ouvidoria/2025: 797 atendimentos; médias por secretaria 27, 43, 107 e 109 dias.', ['relatorio-2025', 'ouvidoria-da-prefeitura']),
    ('PMRR/2025: 51 áreas, 160 setores, 64 R3 e 96 SM; estudo térmico e metodologia IAU delimitados.', ['atualizacao-do-plano', 'periodicos.unitau']),
    ('Scorecard IPS/2026 inspecionado visualmente: 68,31; dimensões 81,48/77,55/45,90; PIB per capita via IBGE indexado.', ['IPSBrasil2026', 'scorecard'])
]
assert len(checks) == len(articles) == 30
review = []
for a, (result, needles) in zip(articles, checks):
    refs = [dict(url=s['url'], evidence_key=s['key']) for s in sources if any(n in s['url'] for n in needles)]
    review.append(dict(slug=a['slug'], status='central_claims_reviewed', result=result, sources=refs,
                       corrections=sum(c['slug'] == a['slug'] for c in corrections)))

report = dict(date='2026-11-20', timezone='America/Sao_Paulo', status='central_claims_reviewed_with_limits',
              scope='Revisão dos 30 artigos: afirmações centrais, números destacados, títulos, linhas finas, datas, universos estatísticos e referências. Não é auditoria exaustiva de cada frase ou resultado causal.',
              source_check=dict(unique_urls=149, downloaded_http_200=135,
                                note='HTTP 200 não significa validação; mapas interativos, PDFs de imagem e redirecionamentos exigiram tratamento separado. Falhas locais foram confrontadas também com busca web e fontes alternativas.'),
              corrections=corrections, articles=review,
              pending_by_slug={
                  'crescimento-imobiliario-desigualdade-sjc': ['O PDF integral do estudo UPC não foi revalidado; o trecho foi limitado ao resumo editorial acessível.'],
                  'onde-estao-hospitais-unidades-sjc': ['A Prefeitura precisa esclarecer o total operacional de UBS: cabeçalho 40, lista principal 41 nomes e seção avançada com quatro registros. A divergência está explícita no texto.']},
              limitations=['Sem vistoria, entrevistas ou confirmação direta com órgãos.',
                           'Estatísticas de 2011, 2017, 2021 e 2022 permanecem históricas e são identificadas como tais.',
                           'Afirmações de ausência de dados significam ausência nas fontes consultadas; não provam inexistência de outras bases.',
                           'Fontes jornalísticas são tratadas como relatos atribuídos; listas dinâmicas e editais precisam de nova consulta se a publicação ocorrer em outra data.',
                           'Nenhum acesso de escrita ao banco, publicação ou deploy realizado.'],
              additional_sources=[
                  'https://www.inpe.br/noticias/noticia.php?Cod_Noticia=3350',
                  'https://servicos.sjc.sp.gov.br/governo/boletim/boletimPDF/20181201152251cf296ebd-f117-4630-97f9-94089c1b655c.pdf',
                  'https://revistes.upc.edu/index.php/SIIU/article/view/10122',
                  'https://www.iau.usp.br/institucional/historico-de-noticias-do-instituto/urbverde-lanca-base-nacional-de-dados-sobre-ilhas-de-calor-urbanas/',
                  'https://www.ibge.gov.br/comunicados/46995-nota-tecnica-pib-dos-municipios-2.html',
                  'https://www.sec.gov/Archives/edgar/data/1355444/000162828026021824/erj-20251231.htm'])
(DEST / 'checagem-factual.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Registradas {len(corrections)} correções em {len(set(c["slug"] for c in corrections))} artigos e 30 fichas de checagem.')
