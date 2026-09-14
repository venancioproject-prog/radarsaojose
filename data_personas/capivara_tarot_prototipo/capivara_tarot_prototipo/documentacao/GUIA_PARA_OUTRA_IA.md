# Guia de continuidade — Capivara Oráculo

## Contexto do projeto
A personagem é uma capivara ilustrada com turbante e roupa rosa, detalhes dourados e uma estética simpática/mística. Ela será a guia de um jogo de tarot sobre personas de São José dos Campos. O fluxo tem cinco perguntas e um resultado final.

## Estado atual
Existe um protótipo HTML em `../index.html` que demonstra três estados de movimento usando CSS: espera, pensamento e celebração. A imagem original está em `../referencia/capivara_original.webp`. Uma versão vertical preparada para vídeo está em `../referencia/capivara_referencia_9x16.webp`.

## Entregáveis desejados
Produzir clipes curtos em MP4, preferencialmente também versões WebM ou Animated WebP quando houver suporte:

- `01_loop_espera`: respiração, piscada, leve flutuação; loop de 4–6 s.
- `02_pensativa`: olhar para cima, pequeno aceno de cabeça, respiração; 4–6 s.
- `03_celebracao`: sorriso, pequeno pulo e postura alegre; 4–6 s.
- `04_transicao_pergunta`: mudança curta e suave entre perguntas; 2–3 s.
- `05_resultado_persona`: reação de revelação/celebração; 4–6 s.

## Regras de consistência
Preservar identidade, rosto, mãos, turbante rosa, roupa rosa, detalhes dourados, proporções e estilo desenhado. Manter câmera fixa e personagem inteira visível. Não inserir texto, cartas ou objetos novos sem uma decisão de direção de arte. O tom deve ser acolhedor, inteligente, mágico e inclusivo, nunca assustador.

## Integração sugerida
O site deve trocar o estado da mascote conforme os eventos:

```js
const mascotStates = {
  idle: '01_loop_espera.mp4',
  question: '02_pensativa.mp4',
  transition: '04_transicao_pergunta.mp4',
  result: '05_resultado_persona.mp4'
};
```

Durante cada uma das cinco perguntas, usar `question` como padrão. Ao clicar em uma resposta, tocar `transition` e retornar a `question`. Ao exibir o resultado, usar `result`.

## Prompt-base para geração de vídeo
Use a imagem `capivara_referencia_9x16.webp` como referência. “Preserve exatamente a identidade visual da capivara, o turbante rosa, a roupa rosa, os detalhes dourados, o rosto, as proporções e o estilo de ilustração. Câmera fixa, personagem inteira visível, movimento suave e polido para um site de jogo de tarot acolhedor. Não adicionar texto, diálogo, objetos ou mudança de estilo.”

Acrescentar ao prompt-base apenas o comportamento do estado desejado. Evitar trocar de modelo entre clipes sem necessidade. Validar tecnicamente os arquivos com `ffprobe` e oferecer fallback estático para conexões lentas.

## Limitação encontrada neste protótipo
A geração de vídeo por IA retornou bloqueio de acesso do plano atual. Nenhum MP4 foi criado nesta tentativa. Para gerar os clipes, usar uma conta/plano com acesso à geração de vídeo ou uma ferramenta externa autorizada, sempre mantendo a referência e os prompts acima.

## Próximo passo recomendado
Gerar primeiro `01_loop_espera` e `03_celebracao`, testar no layout real do site e só depois produzir as demais variações. Isso permite validar identidade, proporção, peso do arquivo e sensação de movimento antes de fechar o pacote completo.
