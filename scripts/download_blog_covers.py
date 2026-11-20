"""Baixa capas Pexels selecionadas e gera WebP/miniaturas com crédito no manifesto."""
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import json
from pathlib import Path
import requests
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'docs/blog/capas-banco.json').read_text(encoding='utf-8'))
destination = ROOT / 'web-media/blog'
destination.mkdir(parents=True, exist_ok=True)


def download(item):
    key, photo = item
    filename = destination / f'pexels-{photo["id"]}.webp'
    if not filename.exists() or photo.get('focus'):
        url = f'https://images.pexels.com/photos/{photo["id"]}/pexels-photo-{photo["id"]}.jpeg?auto=compress&cs=tinysrgb&w=1600'
        response = requests.get(url, timeout=(15, 90))
        response.raise_for_status()
        image = ImageOps.exif_transpose(Image.open(BytesIO(response.content))).convert('RGB')
        image = ImageOps.fit(image, (1440, 900), method=Image.Resampling.LANCZOS, centering=tuple(photo.get('focus', [.5, .5])))
        image.save(filename, 'WEBP', quality=84, method=6)
    image = Image.open(filename)
    image.resize((720, 450), Image.Resampling.LANCZOS).save(destination / f'pexels-{photo["id"]}-720.webp', 'WEBP', quality=80, method=6)
    return key, filename


with ThreadPoolExecutor(max_workers=6) as pool:
    downloaded = list(pool.map(download, manifest['photos'].items()))
sheet = Image.new('RGB', (4 * 360, 4 * 250), '#f1f5f9')
draw = ImageDraw.Draw(sheet)
for i, (key, filename) in enumerate(downloaded):
    x, y = (i % 4) * 360, (i // 4) * 250
    sheet.paste(Image.open(filename).resize((350, 219)), (x, y))
    draw.text((x + 8, y + 225), key, fill='#0b2545')
tmp = ROOT / 'tmp/blog-release'
tmp.mkdir(parents=True, exist_ok=True)
sheet.save(tmp / 'capas.jpg')
print(f'{len(downloaded)} capas e versões responsivas prontas.')
