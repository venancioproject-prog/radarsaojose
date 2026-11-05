# Benchmark territorial

Rebuilt from direct IBGE/SIDRA extractions. The old multicity values are not used
by the new screen. The old file supplies only the municipal selection and
editorial grouping; current municipality names come from the official response.

## Coverage and reference years

- 31 municipalities, including São José dos Campos; 30 municipal comparisons.
- São Paulo state and Brazil are aggregate references, excluded from the ranking.
- Census population, area and density: table 4714, 2022, variables 93/6318/614.
- Official estimated population: table 6579, 2026, variable 9324.
- Total GDP: table 5938, 2023, variable 37, originally in thousand reais.
- Industrial and services shares: table 5938, 2021. Variables 517 and 6575,
  respectively, divided by variable 498 (total gross value added), multiplied by
  100. Services exclude public administration, defence, public education and
  health, and social security. Shares use the same year and unit throughout.
- The fetched 2023 response has `...` for sector values: these are unavailable,
  never zero. Sector composition therefore uses the available 2021 observations.

The GDP display converts thousand reais to billion reais by dividing by 1,000,000.
Population estimates are not interpreted as census counts or census growth.
Each comparison uses the same reference year for both territories. Differences
for sector shares are percentage points; other differences use the selected
reference as denominator. Neither the signs nor positions imply better outcomes.
The rank is descending within the selected municipal group, with equal values
sharing the same position; it is not a national ranking or a composite score.

`territorial.v1.json` records the actual retrieval timestamp, exact API URLs and
SHA-256 hashes of the preserved, decompressed API responses in `evidence/`.
No old salary, IDHM, schooling, fleet or crime comparison has been reinstated.

## Reproduction

From the repository root:

```powershell
python scripts/build_benchmark_verified.py
python scripts/test_benchmark_verified.py
python scripts/test_benchmark_browser.py
```

The builder requires internet access; evidence validation does not. Browser tests
use Selenium and Chrome against the real local app. They cover all 32 selectable
references, all six ranking metrics, screen widths from 320 to 1440 pixels,
navigation away and back, and retry after an unavailable download.
