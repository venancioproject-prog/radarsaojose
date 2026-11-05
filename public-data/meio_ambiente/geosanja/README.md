# Atlas ambiental do GeoSanja

Fonte: [GeoSanja — Prefeitura de São José dos Campos](https://geo.sjc.sp.gov.br/).
O manifesto registra o instante de consulta, os identificadores das camadas,
suas descrições oficiais, URLs de exportação e hashes SHA-256 dos arquivos.

## Camadas exibidas

- APAs municipais: componente `apaMunicipal` do mapa de Unidades de Conservação
  do Plano Diretor de 2018 (`geoSJC:anexo_14`, catálogo 56).
- APAs estaduais e federais: `geoInterno:APA_ESTADUAL` (97) e
  `geoInterno:APA_FEDERAL` (98). Seus atributos não identificam individualmente
  as APAs por nome; a interface preserva essa limitação.
- Parques naturais: `geoSJC:pnmAugustoR` (61) e `geoSJC:pnmBanhado` (60).
  A exportação do Augusto Ruschi contém também a zona de amortecimento,
  identificada separadamente por nome e cor na interface.
- Parques urbanos: somente o componente `parquesUrbanos` de `anexo_13` (55).
  O perímetro urbano que acompanha a exportação não é tratado como parque.
  As situações `EXISTENTE` e `PROPOSTO` têm cores e rótulos distintos. São
  situações da base consultada, não comprovação de abertura ou implantação atual.
- Interesse ambiental: componentes `areaNaoOcupacao`,
  `areaControleImpermeabilizacao` e `fragmentosIF2010` de `anexo_12` (54).
  O componente `apaMunicipal` dessa exportação é omitido neste tema, pois tem
  um tema próprio. A vegetação é do Inventário de 2010, não uma medição atual.
- Inundação: `geoInterno:pddmap_so` (93), Etapa 1 do PDDMAP, referência 2021
  no catálogo. Suscetibilidade não significa ocorrência ou alerta em tempo real.
- Limite municipal: `geoSJC:limiteMunicipal` (70), usado como contexto e recorte.

## Tratamento cartográfico

Os ZIPs de origem permanecem em `evidence/`. Alguns anexos do Plano Diretor
contêm ZIPs internos; os componentes são lidos e separados explicitamente.
As geometrias são validadas, recortadas pelo limite municipal na projeção de
origem, simplificadas em cinco metros com preservação de topologia e convertidas
para EPSG:4326. O manifesto identifica o CRS original de cada exportação.
Nenhuma soma de área de proteção ou contagem de APAs é inferida do número de
feições: unidades e fragmentos podem se sobrepor e a base contém multipartes.

O mapa de ruas usa OpenStreetMap; as camadas temáticas são cópias locais dos
arquivos públicos do GeoSanja. O navegador do usuário não precisa se autenticar
no GeoSanja para consultar estas cópias. Nenhum token de sessão é distribuído.

## Reprodução e validação

```powershell
python scripts/build_ambiente_geosanja.py
python scripts/build_ambiente_geosanja.py --reuse-evidence
python scripts/test_ambiente_atlas.py
python scripts/test_ambiente_atlas_browser.py
```

A atualização abre a sessão pública de visitante do portal e usa a mesma
exportação GeoJSON que o portal oferece. Nenhum dado privado é solicitado.
Somente os metadados das camadas públicas escolhidas são preservados. A segunda
forma reconstrói as cópias a partir das evidências locais sem consultar a rede.
Dependências: Selenium/Chrome, Shapely e pyproj.

Os testes conferem hashes, coordenadas, recorte territorial e composição dos
temas, além da troca dos sete temas, identificação por clique, filtros dos
gráficos, manutenção do mapa após redesenho e navegação em celular/desktop.
Os valores dos gráficos existentes permanecem no recorte verificado
`../apresentacao.v2.json`; esta revisão muda sua apresentação, não seus dados.
