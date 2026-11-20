"""Baixa fontes públicas citadas e registra evidências locais para revisão humana."""
from concurrent.futures import ThreadPoolExecutor
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import requests
import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'tmp/blog-factcheck'


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1
        if tag in ('p', 'div', 'tr', 'h1', 'h2', 'h3', 'li', 'br'):
            self.parts.append('\n')

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)
        if tag in ('td', 'th'):
            self.parts.append(' | ')

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def fetch(item):
    url, slugs = item
    key = hashlib.sha256(url.encode()).hexdigest()[:16]
    record = dict(url=url, articles=slugs, key=key)
    try:
        r = requests.get(url, timeout=(10, 35), headers={'User-Agent': 'Mozilla/5.0 (compatible; editorial-source-check/1.0)'})
        record.update(status=r.status_code, final_url=r.url, content_type=r.headers.get('Content-Type', ''))
        if r.status_code != 200:
            return record
        if r.content.startswith(b'%PDF'):
            (DEST / (key + '.pdf')).write_bytes(r.content)
            doc = fitz.open(stream=r.content, filetype='pdf')
            content = '\n'.join(f'\n=== PAGE {i+1} ===\n' + page.get_text() for i, page in enumerate(doc))
            record['pages'] = len(doc)
        else:
            if 'json' in record['content_type']:
                content = r.text
            else:
                r.encoding = r.apparent_encoding
                parser = Text()
                parser.feed(r.text)
                content = '\n'.join(line.strip() for line in ''.join(parser.parts).splitlines() if line.strip())
        (DEST / (key + '.txt')).write_text(content, encoding='utf-8')
        record['chars'] = len(content)
    except Exception as e:
        record['error'] = str(e)[:250]
    return record


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    package = json.loads((ROOT / 'radar-sao-jose-30-artigos.json').read_text(encoding='utf-8'))
    urls = {}
    for article in package['articles']:
        # Captura apenas destinos de links Markdown, inclusive links cujo rótulo é uma URL.
        for url in dict.fromkeys(re.findall(r'\]\((https?://[^\s)]+)\)', article['article_markdown'])):
            urls.setdefault(url, []).append(article['slug'])
    with ThreadPoolExecutor(max_workers=8) as pool:
        records = list(pool.map(fetch, urls.items()))
    (DEST / 'index.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(dict(total=len(records), downloaded=sum(r.get('status') == 200 for r in records),
                          failed=[dict(url=r['url'], status=r.get('status'), error=r.get('error')) for r in records if r.get('status') != 200]), ensure_ascii=True))


if __name__ == '__main__':
    main()
