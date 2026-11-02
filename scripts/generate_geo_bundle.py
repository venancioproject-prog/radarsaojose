import json

with open('data/radar_hub/sjc_setores_socioeconomicos_geo.json', 'r', encoding='utf-8') as f:
    setores = json.load(f)

with open('data/radar_hub/sjc_regioes_geo.json', 'r', encoding='utf-8') as f:
    regioes = json.load(f)

bundle_content = f"window.SJC_SETORES_GEOJSON = {json.dumps(setores, ensure_ascii=False)};\nwindow.SJC_REGIOES_GEOJSON = {json.dumps(regioes, ensure_ascii=False)};\n"

with open('data/radar_hub/sjc_setores_geo_bundle.js', 'w', encoding='utf-8') as f:
    f.write(bundle_content)

print("Generated data/radar_hub/sjc_setores_geo_bundle.js successfully!")
