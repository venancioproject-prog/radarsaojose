"""Importa o ZIP editorial local; não acessa nem altera o banco.

Requer markdown-it-py. Execute a partir da raiz do repositório.
"""
import hashlib
import json
from pathlib import Path
import re
import zipfile

from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'radar-sao-jose-30-artigos-revisados-individuais.zip'
DATA = ROOT / 'radar-sao-jose-30-artigos.json'


def field(text, label):
    match = re.search(r'\*\*' + label + r':\*\*\s*([^\n]+)', text, re.I)
    return match.group(1).strip() if match else ''


def sql_string(value):
    return "'" + value.replace("'", "''") + "'"


def main():
    package = json.loads(DATA.read_text(encoding='utf-8'))
    by_slug = {article['slug']: article for article in package['articles']}
    edits = json.loads((ROOT / 'docs/blog/titulos-revisados.json').read_text(encoding='utf-8'))
    assert set(edits) == set(by_slug), 'A revisão editorial deve cobrir os 30 slugs.'
    factcheck_path = ROOT / 'docs/blog/checagem-factual.json'
    factcheck = json.loads(factcheck_path.read_text(encoding='utf-8')) if factcheck_path.exists() else {}
    connections_path = ROOT / 'docs/blog/conexoes-report.json'
    connections = json.loads(connections_path.read_text(encoding='utf-8')).get('articles', {}) if connections_path.exists() else {}
    assert set(connections) <= set(by_slug), 'Conexão comercial com slug desconhecido.'
    metrics_path = ROOT / 'docs/blog/indicadores-report.json'
    metrics_package = json.loads(metrics_path.read_text(encoding='utf-8')) if metrics_path.exists() else {}
    metrics = metrics_package.get('metrics', {})

    def interpolate(text):
        return re.sub(r'\{\{(\w+)\.(formatted|valid|numerator)\}\}',
                      lambda match: str(metrics[match[1]][match[2]]), text)
    renderer = MarkdownIt('commonmark', {'html': False})
    statements = ['-- Gerado pelo import_reviewed_blog.py. Não executado automaticamente.',
                  '-- Preserva slugs, imagens e autoria dos registros existentes.', 'BEGIN;']
    review = []
    with zipfile.ZipFile(ARCHIVE) as archive:
        names = sorted(name for name in archive.namelist() if name.endswith('.md'))
        assert len(names) == 30
        seen = set()
        for name in names:
            slug = re.sub(r'^\d+-|\.md$', '', Path(name).name)
            assert slug in by_slug and slug not in seen, name
            seen.add(slug)
            source = archive.read(name).decode('utf-8-sig')
            assert '\ufffd' not in source, name
            original_title = re.match(r'# (.+)', source).group(1).strip()
            subtitle = field(source, 'Linha fina')
            excerpt = field(source, 'Resumo para card')
            assert subtitle and excerpt, name
            title = edits[slug]['title']
            subtitle = edits[slug]['subtitle']
            excerpt = subtitle
            parts = re.split(r'^## (?:SEO[^\n]*|Metadados sugeridos)\s*$', source,
                             maxsplit=1, flags=re.M)
            assert len(parts) == 2, name
            public = parts[0]
            public = re.sub(r'^# .+\n', '', public, count=1)
            public = re.sub(r'^\*\*(?:Linha fina|Resumo para card):\*\*[^\n]*\n', '', public, flags=re.M)
            public = re.sub(r'^## Corpo publicável\s*$', '', public, flags=re.M)
            public = public.strip().rstrip('-').strip()
            for correction in factcheck.get('corrections', []):
                if correction['slug'] == slug:
                    assert correction['old'] in public, correction['reason']
                    public = public.replace(correction['old'], correction['new'])
            public = re.sub(r'<!--.*?-->', '', public, flags=re.S).strip()
            connection = connections.get(slug)
            if connection:
                sections = re.split(r'(?=^## Fontes (?:públicas )?consultadas\s*$)', public, maxsplit=1, flags=re.M)
                assert len(sections) == 2, f'Seção de fontes ausente: {slug}'
                bridge = '\n\n'.join(['## ' + connection['heading'], interpolate(connection['paragraph']), connection['cta']])
                public = sections[0].rstrip() + '\n\n' + bridge + '\n\n' + sections[1]
                public += ('\n\n- Radar São José, pesquisa própria apresentada no Report. Base total: '
                           + str(metrics_package['N']) + ' participantes. Percentuais entre respostas válidas de cada pergunta ou recorte, conforme indicado no texto. '
                           'Resultados descritivos dos participantes, sem extrapolação para toda a população municipal. Edição editorial de 20 de novembro de 2026.')
            assert '## Ficha interna' not in public and '## Pendência' not in public, name
            # A linha fina já aparece no cabeçalho da página do artigo.
            markdown = public
            html = renderer.render(markdown)
            seo = parts[1].split('## Ficha interna')[0]
            seo_title = title
            # Prefere uma frase completa e curta para a descrição de busca.
            first_sentence = re.split(r'(?<=[.!?])\s+', excerpt)[0]
            description = excerpt if len(excerpt) <= 160 else first_sentence
            suggested_slug = field(seo, 'Slug') or slug
            article = by_slug[slug]
            article.update(title=title, excerpt=excerpt, seo_title=seo_title, meta_description=description,
                           answer_first=subtitle, article_markdown=markdown, article_html=html,
                           faq=[], geo_summary='', internal_links=[], sources_to_consult=[],
                           verification_tasks=factcheck.get('pending_by_slug', {}).get(slug, []) if factcheck else ['Conferir fontes e pendências na ficha interna do ZIP antes da publicação.'])
            metadata = dict(seo_title=seo_title, meta_description=description,
                            bluf_summary=subtitle, geo_summary='', faq=[])
            assignments = dict(title=title, excerpt=excerpt, content=html)
            # UPDATE evita criar duplicatas e mantém a configuração editorial do CMS.
            statement = 'UPDATE public.blog_posts SET ' + ', '.join(
                key + ' = ' + sql_string(value) for key, value in assignments.items())
            statement += ', seo_metadata = COALESCE(seo_metadata, \'{}\'::jsonb) || '
            statement += sql_string(json.dumps(metadata, ensure_ascii=False)) + '::jsonb'
            statement += ' WHERE slug = ' + sql_string(slug) + ';'
            statements.append(statement)
            review.append(dict(file=name, slug=slug, suggested_slug=suggested_slug,
                               original_title=original_title, title=title, subtitle=subtitle,
                               report_connection=bool(connection),
                               words=len(markdown.split()), source_links=len(re.findall(r'https?://', public))))
    assert len(seen) == len(by_slug) == 30
    package['package_version'] = '2.0'
    package['editorial_note'] = ('Checagem das afirmações centrais em 20/11/2026; correções e limites em docs/blog/checagem-factual.json. '
                               'Fontes institucionais divergentes identificadas nos textos; revisão não equivale a auditoria de cada frase.'
                               if factcheck else 'Textos do ZIP revisado; revisão estrutural concluída, checagem factual independente pendente.')
    package['source_archive_sha256'] = hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()
    DATA.write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    statements.extend(['COMMIT;', '-- Confira se os 30 slugs existem antes de executar; UPDATE não insere artigos ausentes.'])
    (ROOT / 'supabase_blog_artigos_revisados.sql').write_text('\n\n'.join(statements) + '\n', encoding='utf-8')
    report = dict(total=len(review), title_subtitle_review='complete', factual_review=factcheck.get('status', 'pending'), database_applied=False,
                  report_connections=len(connections),
                  preserved_slugs_with_different_suggestions=[a for a in review if a['slug'] != a['suggested_slug']],
                  articles=review)
    destination = ROOT / 'docs' / 'blog'
    destination.mkdir(parents=True, exist_ok=True)
    (destination / 'importacao-artigos-revisados.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('30 artigos importados localmente; SQL preparado; banco não alterado.')


if __name__ == '__main__':
    main()
