"""Publica uma edição estática do blog em um checkout isolado, sem acesso ao banco."""
import argparse
from datetime import date
from html import escape
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--target', required=True)
parser.add_argument('--origin', default='https://radarsaojose.vercel.app')
args = parser.parse_args()
TARGET = Path(args.target).resolve()
ORIGIN = args.origin.rstrip('/')
EDITION = '2026-11-20'
package = json.loads((ROOT / 'radar-sao-jose-30-artigos.json').read_text(encoding='utf-8'))
articles = package['articles']
covers = json.loads((ROOT / 'docs/blog/capas-banco.json').read_text(encoding='utf-8'))
assert set(covers['articles']) == {a['slug'] for a in articles}
templates = ROOT / 'docs/blog/templates'
templates.mkdir(parents=True, exist_ok=True)
for name in ['blog.html','editoria.html','artigo.html']:
    if not (templates / name).exists():
        shutil.copy2(ROOT / name, templates / name)


def json_script(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')


def url(article):
    return '/artigos/' + article['slug'] + '.html'


def category(article):
    c = article['cluster'].lower()
    if any(x in c for x in ['popula', 'demogra', 'migra', 'habit']): return 'Demografia & População', 'cidade'
    if any(x in c for x in ['econom', 'empreg', 'trabalh', 'indús']): return 'Economia & Empregos', 'emprego'
    if any(x in c for x in ['morad', 'urban', 'aluguel', 'imobil']): return 'Imobiliário & Moradia', 'moradia'
    if any(x in c for x in ['ciênc', 'inov', 'tecnol', 'ita']): return 'Inovação & Tecnologia', 'tecnologia'
    if any(x in c for x in ['mobil', 'transp', 'dutra']): return 'Mobilidade & Infraestrutura', 'mobilidade'
    return 'Saúde, Ambiente & Cidade', 'cidade'


def root_links(html):
    return re.sub(r'(href|src)="(?!https?:|/|#|mailto:|tel:|data:)([^"]+)"', lambda m: m[1] + '="/' + m[2] + '"', html)


def card(a):
    p = posts_by_slug[a['slug']]
    return f'''<article class="article-card flex flex-col justify-between group border-b border-slate-200/80 pb-6" data-category="{p['category_slug']}"><a href="{url(a)}"><img src="{p['thumbnail_url']}" alt="{escape(p['seo_metadata']['cover_image_alt'])}" width="720" height="450" loading="lazy" decoding="async" class="w-full aspect-[16/9] object-cover rounded-xl mb-4"><span class="text-xs font-bold text-cyan-700">{escape(p['category'])}</span><h3 class="font-serif text-lg font-bold text-slate-900 leading-snug mt-2 mb-3">{escape(a['title'])}</h3><p class="text-sm text-slate-600 leading-relaxed">{escape(a['meta_description'])}</p></a><p class="mt-4 text-xs text-slate-500">Radar São José · {p['seo_metadata']['read_time']}</p></article>'''


def replace_inner(html, tag, id, text):
    opening = re.search(rf'<{tag}\b[^>]*\bid="{id}"[^>]*>', html)
    assert opening, id
    depth = 1
    for token in re.finditer(rf'</?{tag}\b[^>]*>', html[opening.end():]):
        depth += -1 if token[0].startswith('</') else 1
        if depth == 0:
            return html[:opening.end()] + text + html[opening.end()+token.start():]
    raise ValueError('Elemento sem fechamento: '+id)


posts = []
for i, a in enumerate(articles):
    photo = covers['photos'][covers['articles'][a['slug']]]
    image = f'/web-media/blog/pexels-{photo["id"]}.webp'
    thumbnail = image.replace('.webp', '-720.webp')
    assert (ROOT / image.lstrip('/')).exists(), image
    cat, cat_slug = category(a)
    related = [b for b in articles if b['slug'] != a['slug'] and category(b)[0] == cat][:3]
    related += [b for b in articles if b['slug'] != a['slug'] and b not in related][:max(0, 3-len(related))]
    a['internal_links'] = [url(b) for b in related]
    a['geo_summary'] = a['answer_first']
    a['cover_image_url'] = image
    a['published_at'] = EDITION
    a['updated_at'] = EDITION
    citations = list(dict.fromkeys(re.findall(r'\]\((https?://[^\s)]+)\)', a['article_markdown'])))
    metadata = dict(seo_title=a['seo_title'], meta_description=a['meta_description'],
                    bluf_summary=a['answer_first'], geo_summary=a['geo_summary'],
                    canonical_url=ORIGIN+url(a), read_time=f'{max(3, math.ceil(len(a["article_markdown"].split())/210))} min de leitura',
                    cover_image_alt=photo['alt'], cover_image_caption=photo['caption'],
                    cover_image_credit=photo['author']+' / Pexels', cover_image_source=photo['source'],
                    cover_image_license=covers['license'], citations=citations, faq=[])
    a['seo_metadata'] = metadata
    posts.append(dict(id='editorial-'+a['slug'], title=a['title'], slug=a['slug'], excerpt=a['excerpt'],
                      cover_image_url=image, thumbnail_url=thumbnail, category=cat, category_slug=cat_slug,
                      author_name='Radar São José', author_role='Jornalismo e inteligência de dados',
                      published_at=EDITION, created_at=EDITION, updated_at=EDITION, status='published',
                      tags=[cat, 'São José dos Campos'], views_count=0, is_featured=i==0, seo_metadata=metadata))
posts_by_slug = {p['slug']: p for p in posts}

out = TARGET / 'artigos'
out.mkdir(parents=True, exist_ok=True)
for a in articles:
    p = posts_by_slug[a['slug']]
    meta = p['seo_metadata']
    body = root_links(a['article_html'])
    # O bloco de assinatura é visível e separado das fontes no próprio conteúdo.
    if 'Assine o plano Report' in body:
        body = re.sub(r'(<h2>[^<]+</h2>\n<p>[^\n]+</p>\n<p><a href="/index.html#planos">Assine o plano Report.*?</p>)', r'<section class="report-callout">\1</section>', body, flags=re.S)
    toc = []
    def heading(match):
        index = len(toc)+1
        text = re.sub('<[^>]+>', '', match[1])
        toc.append(f'<li><a href="#topico-{index}">{text}</a></li>')
        return f'<h2 id="topico-{index}">{match[1]}</h2>'
    body = re.sub(r'<h2>(.*?)</h2>', heading, body)
    related = [next(b for b in articles if url(b) == link) for link in a['internal_links']]
    related_html = ''.join(f'<li><a href="{url(b)}">{escape(b["title"])}</a></li>' for b in related)
    side = ''.join(f'<a class="sidebar-card" href="{url(b)}"><img src="{posts_by_slug[b["slug"]]["thumbnail_url"]}" alt="{escape(posts_by_slug[b["slug"]]["seo_metadata"]["cover_image_alt"])}" width="720" height="450" loading="lazy"><strong>{escape(b["title"])}</strong><small>{escape(posts_by_slug[b["slug"]]["category"])}</small></a>' for b in related)
    schema = {'@context':'https://schema.org','@graph':[
        {'@type':'BlogPosting','@id':ORIGIN+url(a)+'#article','url':ORIGIN+url(a),
         'mainEntityOfPage':ORIGIN+url(a),'headline':a['title'],'description':a['meta_description'],
         'image':{'@type':'ImageObject','url':ORIGIN+p['cover_image_url'],'width':1440,'height':900,
                  'creditText':meta['cover_image_credit'],'license':meta['cover_image_license'],'acquireLicensePage':meta['cover_image_source']},
         'datePublished':EDITION,'dateModified':EDITION,'inLanguage':'pt-BR','articleSection':p['category'],
         'author':{'@type':'Organization','name':'Radar São José','url':ORIGIN+'/'},
         'publisher':{'@type':'Organization','name':'Radar São José','url':ORIGIN+'/',
                      'logo':{'@type':'ImageObject','url':ORIGIN+'/fotos_radar/logo.png'}},
         'about':{'@type':'City','name':'São José dos Campos','address':{'@type':'PostalAddress','addressRegion':'SP','addressCountry':'BR'}},
         'citation':meta['citations'],'wordCount':len(a['article_markdown'].split()),
         'isAccessibleForFree':True},
        {'@type':'BreadcrumbList','itemListElement':[
            {'@type':'ListItem','position':1,'name':'Radar São José','item':ORIGIN+'/'},
            {'@type':'ListItem','position':2,'name':'Blog','item':ORIGIN+'/blog.html'},
            {'@type':'ListItem','position':3,'name':a['title'],'item':ORIGIN+url(a)}]}]}
    html = f'''<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(a['seo_title'])} | Radar São José</title>
<meta name="description" content="{escape(a['meta_description'])}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{ORIGIN+url(a)}"><link rel="icon" href="/favicon.ico">
<meta property="og:locale" content="pt_BR"><meta property="og:type" content="article"><meta property="og:site_name" content="Radar São José">
<meta property="og:title" content="{escape(a['seo_title'])}"><meta property="og:description" content="{escape(a['meta_description'])}"><meta property="og:url" content="{ORIGIN+url(a)}">
<meta property="og:image" content="{ORIGIN+p['cover_image_url']}"><meta property="og:image:alt" content="{escape(meta['cover_image_alt'])}"><meta property="og:image:width" content="1440"><meta property="og:image:height" content="900">
<meta property="article:published_time" content="{EDITION}"><meta property="article:modified_time" content="{EDITION}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{escape(a['seo_title'])}"><meta name="twitter:description" content="{escape(a['meta_description'])}"><meta name="twitter:image" content="{ORIGIN+p['cover_image_url']}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/blog-article.css?v=20261120"><script src="/blog-article.js?v=20261120" defer></script>
<script type="application/ld+json">{json_script(schema)}</script></head>
<body><a class="skip" href="#conteudo">Ir para o artigo</a><header class="site-header"><div class="navbar"><a class="brand" href="/" aria-label="Radar São José, página inicial"><img src="/fotos_radar/logobranco_radar.png" alt="Radar São José" width="160" height="42"></a><nav aria-label="Navegação principal"><a class="desktop" href="/index.html#solucoes">Soluções</a><a class="desktop" href="/index.html#metodologia">Metodologia</a><a href="/blog.html">Blog</a><a href="/index.html#planos">Planos</a><a class="account" href="/app.html">Criar conta grátis</a></nav></div></header>
<main class="page" id="conteudo"><nav class="breadcrumb" aria-label="Caminho da página"><a href="/">Radar São José</a><span aria-hidden="true">/</span><a href="/blog.html">Blog</a><span aria-hidden="true">/</span><a href="/editoria.html?cat={p['category_slug']}">{escape(p['category'])}</a></nav>
<div class="article-grid"><article class="story"><span class="eyebrow">{escape(p['category'])}</span><h1>{escape(a['title'])}</h1><p class="subtitle">{escape(a['excerpt'])}</p>
<div class="byline"><strong>Radar São José</strong><span>Atualizado em <time datetime="{EDITION}">20 de novembro de 2026</time></span><span>{meta['read_time']}</span><button type="button" class="share" data-copy-article>Copiar link</button></div>
<figure><img src="{p['cover_image_url']}" srcset="{p['thumbnail_url']} 720w, {p['cover_image_url']} 1440w" sizes="(max-width:560px) calc(100vw - 64px), (max-width:900px) calc(100vw - 120px), 738px" alt="{escape(meta['cover_image_alt'])}" width="1440" height="900" fetchpriority="high"><figcaption>{escape(meta['cover_image_caption'])} Foto: <a href="{meta['cover_image_source']}" rel="noopener noreferrer">{escape(meta['cover_image_credit'])}</a> · <a href="{meta['cover_image_license']}" rel="noopener noreferrer">Licença</a></figcaption></figure>
<details class="toc"><summary>Neste artigo</summary><ol>{''.join(toc)}</ol></details><div class="article-body">{body}</div>
<section class="related" aria-label="Artigos relacionados"><h2>Continue a leitura</h2><ul>{related_html}</ul></section></article>
<aside class="sidebar" aria-label="Leituras relacionadas"><h2>Mais sobre o tema</h2>{side}<p><a href="/blog.html">Ver todos os artigos →</a></p></aside></div></main>
<footer class="site-footer"><strong>Radar São José</strong><br>Dados, comportamento e inteligência sobre São José dos Campos.<br><a href="/blog.html">Blog</a> · <a href="/index.html#planos">Conheça os planos</a> · <a href="/index.html#metodologia">Metodologia</a></footer></body></html>'''
    (out / (a['slug']+'.html')).write_text(html, encoding='utf-8')

# Artefato de listagem: apenas metadados, sem transferir os corpos dos 30 artigos.
(TARGET / 'blog-editorial.js').write_text('window.RADAR_EDITORIAL_POSTS = '+json_script(posts)+';\n', encoding='utf-8')
for filename in ['blog-article.css','blog-article.js']:
    shutil.copy2(ROOT / filename, TARGET / filename)
shutil.copytree(ROOT / 'web-media/blog', TARGET / 'web-media/blog', dirs_exist_ok=True)

for filename in ['blog.html','editoria.html']:
    html = (templates / filename).read_text(encoding='utf-8')
    html = html.replace('</head>', '<script src="/blog-editorial.js?v=20261120"></script>\n</head>')
    html = html.replace('https://radarsaojose.com.br', ORIGIN)
    html = html.replace('fotos_radar/LEONARDO.jpeg', 'fotos_radar/logo.png')
    html = html.replace("function formatPortalDate(isoStr) {", "function formatPortalDate(isoStr) {\n      if (/^\\d{4}-\\d{2}-\\d{2}$/.test(String(isoStr))) return isoStr.split('-').reverse().join('/');")
    html = html.replace('Mais lidas em SJC', 'Leituras em destaque').replace('MAIS LIDAS EM SJC', 'LEITURAS EM DESTAQUE').replace('Top leituras', 'Seleção editorial').replace('TOP LEITURAS', 'SELEÇÃO EDITORIAL')
    html = html.replace('return `artigo.html?slug=${encodeURIComponent(slug)}`;', 'return `/artigos/${encodeURIComponent(slug)}.html`;')
    if filename == 'blog.html':
        start = html.index('      let posts = [];', html.index('async function fetchAndRenderPortalPosts()'))
        end = html.index('      if (Array.isArray(posts) && posts.length > 0)', start)
        html = html[:start] + '      const posts = window.RADAR_EDITORIAL_POSTS.slice();\n\n' + html[end:]
        html = html.replace('if (cachedData) {', 'if (cachedData && !window.RADAR_EDITORIAL_POSTS) {')
        # Conteúdo inicial rastreável, mantido pela listagem interativa na hidratação.
        html = replace_inner(html, 'div', 'articlesGrid', '\n'+ '\n'.join(card(a) for a in articles)+'\n')
        html = replace_inner(html, 'span', 'articleCount', '30')
        hero = articles[0]; hp = posts[0]
        html = replace_inner(html, 'a', 'heroTitleLink', escape(hero['title']))
        html = replace_inner(html, 'p', 'heroSubtitle', escape(hero['excerpt']))
        html = replace_inner(html, 'span', 'heroDate', '20 de novembro de 2026')
        html = replace_inner(html, 'span', 'heroReadingTime', hp['seo_metadata']['read_time'])
        html = replace_inner(html, 'div', 'heroImageSkeleton', '')
        html = re.sub(r'(<div[^>]*id="heroImageSkeleton"[^>]*class=")', r'\1hidden ', html)
        html = re.sub(r'(<img[^>]*id="heroImage"[^>]*src=")[^"]*', lambda m:m[1]+hp['cover_image_url'], html)
        html = re.sub(r'(<img[^>]*id="heroImage"[^>]*class=")hidden ', r'\1', html)
        for id in ['heroTitleLink','heroImageLink','heroCtaBtn']:
            html = re.sub(r'(<a[^>]*id="'+id+r'"[^>]*href=")[^"]*', lambda m:m[1]+url(hero), html)
    else:
        start = html.index('      let allPosts = [];', html.index('async function loadEditoriaPage()'))
        end = html.index('      // 6. Filtrar', start)
        html = html[:start] + '      const allPosts = window.RADAR_EDITORIAL_POSTS.slice();\n\n' + html[end:]
    (TARGET / filename).write_text(html, encoding='utf-8')

# Entradas antigas e aliases convergem para uma só URL pública por artigo.
entry = (templates / 'artigo.html').read_text(encoding='utf-8')
entry = entry.replace('</head>', '''<script src="/blog-editorial.js?v=20261120"></script>
<script>(function(){const s=new URLSearchParams(location.search).get('slug');if(s&&window.RADAR_EDITORIAL_POSTS.some(p=>p.slug===s))location.replace('/artigos/'+encodeURIComponent(s)+'.html'+location.hash);})();</script></head>''')
shutil.copy2(ROOT / 'radar-safe-content.js', TARGET / 'radar-safe-content.js')
(TARGET / 'artigo.html').write_text(entry, encoding='utf-8')
config = json.loads((TARGET / 'vercel.json').read_text(encoding='utf-8'))
config['rewrites'] = [r for r in config.get('rewrites', []) if not r['source'].startswith(('/artigos/','/artigo/'))]
config['redirects'] = [r for r in config.get('redirects', []) if not r.get('source','').startswith(('/artigos/','/artigo/')) and r.get('source') != '/artigo.html']
config['redirects'].extend([
    dict(source='/artigos/:slug([^/.]+)', destination='/artigos/:slug.html', permanent=True),
    dict(source='/artigo/:slug([^/.]+)', destination='/artigos/:slug.html', permanent=True)])
for a in articles:
    config['redirects'].append(dict(source='/artigo.html',has=[dict(type='query',key='slug',value=a['slug'])],destination=url(a),permanent=True))
(TARGET / 'vercel.json').write_text(json.dumps(config, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

# Metadados enriquecidos também ficam disponíveis no fallback já existente da API.
(TARGET / 'radar-sao-jose-30-artigos.json').write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
api = (TARGET / 'api/posts.js').read_text(encoding='utf-8')
api = api.replace("excerpt: art.meta_description || art.answer_first,", "excerpt: art.excerpt || art.meta_description || art.answer_first,")
api = api.replace("content: art.article_markdown || '',", "content: art.article_html || art.article_markdown || '',")
api = api.replace("cover_image_url: 'fotos_radar/foto_' + ((idx % 6) + 1) + '.jpg',", "cover_image_url: art.cover_image_url || 'web-media/capa_sjc_skyline-e75d8e49a056.webp',")
api = re.sub(r'faq: art.faq \|\| \[\].*', 'faq: art.faq || [], ...(art.seo_metadata || {})', api)
for field in ['published_at','created_at','updated_at']:
    api = api.replace(field+': new Date(Date.now() - idx * 86400000).toISOString(),', field+': art.'+('published_at' if field=='created_at' else field)+" || '2026-11-20',")
api = api.replace("author_name: 'Leonardo Venâncio',", "author_name: 'Radar São José',", 1)
api = api.replace("author_role: 'Head de Inteligência & Dados',", "author_role: 'Jornalismo e inteligência de dados',", 1)
api = api.replace('views_count: 1200 + (30 - idx) * 95,', 'views_count: 0,', 1)
(TARGET / 'api/posts.js').write_text(api, encoding='utf-8')

# Importação opcional no CMS: somente os 30 registros conhecidos, sem alterar permissões.
def literal(text):
    return "'" + text.replace("'", "''") + "'"
sql = ['-- Edição editorial revisada. Aplicação no banco não é necessária para as páginas estáticas.', 'BEGIN;']
for a in articles:
    values = dict(title=a['title'], excerpt=a['excerpt'], content=a['article_html'], cover_image_url=a['cover_image_url'])
    sql.append('UPDATE public.blog_posts SET ' + ', '.join(k+' = '+literal(v) for k,v in values.items())
               + ', seo_metadata = COALESCE(seo_metadata, \'{}\'::jsonb) || '+literal(json.dumps(a['seo_metadata'],ensure_ascii=False))
               + '::jsonb WHERE slug = '+literal(a['slug'])+';')
sql.append('COMMIT;')
(TARGET / 'supabase_blog_artigos_revisados.sql').write_text('\n\n'.join(sql)+'\n',encoding='utf-8')

ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
sitemap = ET.Element(ns+'urlset')
for path in ['/', '/blog.html'] + [url(a) for a in articles]:
    item = ET.SubElement(sitemap, ns+'url')
    ET.SubElement(item, ns+'loc').text=ORIGIN+path
    ET.SubElement(item, ns+'lastmod').text=EDITION
ET.indent(sitemap)
(TARGET / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n'+ET.tostring(sitemap,encoding='unicode')+'\n',encoding='utf-8')
robots = (TARGET / 'robots.txt').read_text(encoding='utf-8')
robots = re.sub(r'Sitemap:.*', 'Sitemap: '+ORIGIN+'/sitemap.xml', robots)
(TARGET / 'robots.txt').write_text(robots, encoding='utf-8')
print(f'30 páginas estáticas, catálogo, capas e SEO gerados em {TARGET}.')
