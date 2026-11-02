# Desempenho: medido e estimado

| Artefato | Antes (bytes disco) | Depois (bytes disco) | Gzip6 depois (simulação) |
|---|---|---|---|
| data/radar_hub/radar_hub_package.json | 35842381 | 22440492 | 1368862 |
| radar_hub_controller.js | 22545803 | 22676945 | 1412601 |
| app.html | 977226 | 978450 | 152374 |

Package antes: 35.842.381 bytes. Depois: 22,440,492 bytes. Compactação JSON reduz cerca de 37.4% em disco; não é alegação de igual redução na rede. Controller ainda inclui fallback grande; no servidor local sem compressão, controller e package transferidos juntos continuam somando cerca de 45 MB. Gzip é estimativa local, não configuração comprovada de produção.

- Chrome desktop-online: 3.16s; heap após init 103406761 bytes; rede limitada a 1 MiB/s e 100 ms no cenário móvel.
- Chrome desktop-offline: 3.17s; heap após init 102153621 bytes; rede limitada a 1 MiB/s e 100 ms no cenário móvel.
- Chrome mobile-limitada: 56.11s; heap após init 83479577 bytes; rede limitada a 1 MiB/s e 100 ms no cenário móvel.

JSON parse medido em Python (3 repetições), não benchmark do parse JavaScript isolado: [0.20444270000007236, 0.2116262000054121, 0.22019819999695756]. Chrome mede tempo do cenário e ResourceTiming, sem separar parse/GC de renderização.

Otimizações implementadas: JSON compacto, remoção de duplicação de resumos internos mantendo acervo, comparação profunda sem duas serializações gigantes e hash de planilha calculado uma vez por fonte. Gráficos continuam criados por eixo. Mapas quantitativos sem evidência não são renderizados. Lazy loading de payload por eixo, cache persistente e alteração da estratégia inline são propostas futuras que mudam arquitetura e exigem autorização. Desempenho móvel continua ressalva; emulação não dispositivo físico.
