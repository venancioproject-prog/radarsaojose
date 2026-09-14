# Manual de integração — Capivara Oráculo

## Objetivo
Integrar a mascote do Tarot das Personas de São José dos Campos a uma experiência com cinco perguntas e uma tela de resultado. As imagens devem aparecer sempre sem fundo e funcionar como estados visuais da mesma personagem.

## Arquivos

| Estado | Arquivo | Uso recomendado |
|---|---|---|
| Boas-vindas | `expressoes/01_boas_vindas.png` | Abertura e instrução inicial |
| Curiosa | `expressoes/02_curiosa.png` | Usuário está lendo/respondendo |
| Pensativa | `expressoes/03_pensativa.png` | Após selecionar resposta ou durante interpretação |
| Surpresa | `expressoes/04_surpresa.png` | Resposta inesperada, transição ou feedback intermediário |
| Celebração | `expressoes/05_celebracao.png` | Revelação do resultado final |

Todos os arquivos são PNG RGBA, 1536 × 2304 px, com transparência real. Não aplicar fundo branco, quadriculado ou cor sólida. O quadriculado nunca deve ser interpretado como parte da arte: ele foi removido.

## Fluxo sugerido

1. Exibir `01_boas_vindas.png` na tela inicial.
2. Ao iniciar a primeira pergunta, trocar suavemente para `02_curiosa.png`.
3. Enquanto a pessoa escolhe uma alternativa, manter `02_curiosa.png`.
4. Ao confirmar a resposta, usar `03_pensativa.png` por aproximadamente 800–1200 ms.
5. Entre perguntas, usar `04_surpresa.png` apenas se houver uma transição de feedback; caso contrário, voltar para `02_curiosa.png`.
6. Repetir o fluxo nas cinco perguntas.
7. Ao finalizar o cálculo da persona, trocar para `05_celebracao.png` e mostrar o resultado.

## Exemplo de implementação

```js
const mascotAssets = {
  welcome: '/assets/capivara/01_boas_vindas.png',
  curious: '/assets/capivara/02_curiosa.png',
  thinking: '/assets/capivara/03_pensativa.png',
  surprised: '/assets/capivara/04_surpresa.png',
  celebration: '/assets/capivara/05_celebracao.png'
};

function setMascot(state) {
  const image = document.querySelector('[data-mascot]');
  image.classList.add('is-changing');
  window.setTimeout(() => {
    image.src = mascotAssets[state];
    image.alt = `Capivara Oráculo — estado ${state}`;
    image.classList.remove('is-changing');
  }, 180);
}
```

```css
[data-mascot] {
  display: block;
  width: min(320px, 42vw);
  max-height: 520px;
  object-fit: contain;
  object-position: center bottom;
  filter: drop-shadow(0 14px 18px rgba(90, 39, 70, .18));
  transition: opacity .18s ease, transform .18s ease;
}
[data-mascot].is-changing {
  opacity: .25;
  transform: translateY(6px) scale(.985);
}
```

## Regras importantes

- Pré-carregar as cinco imagens para a troca não piscar no celular.
- Usar `object-fit: contain`; não esticar nem cortar a personagem.
- Manter a mesma área visual para evitar que o layout pule quando os braços mudam de posição.
- Usar `alt` descritivo e não depender exclusivamente da imagem para comunicar texto.
- A experiência precisa continuar funcionando sem a mascote; ela é reforço visual, não o único canal de instrução.
- Em telas pequenas, limitar a largura da mascote e preservar a pergunta como elemento principal.
- Não converter para JPEG, pois JPEG elimina transparência.
- Para animação futura, os PNGs podem ser usados como estados-chave em CSS, Canvas, Lottie ou vídeo; esta pasta não contém vídeos gerados.

## Mapeamento com as cinco perguntas

O componente de pergunta deve receber o índice da pergunta e o estado da interação. Uma convenção simples é:

```js
const questionState = {
  beforeAnswer: 'curious',
  afterAnswer: 'thinking',
  transition: 'surprised',
  finalResult: 'celebration'
};
```

A persona calculada deve ser exibida em texto e componentes acessíveis. A capivara apenas acompanha, reage e cria clima.

## Próximos passos

A próxima IA programadora deve copiar `expressoes/` para o diretório de assets do site, implementar o componente visual, pré-carregar as imagens e conectar `setMascot()` aos eventos de início, seleção, confirmação, avanço e resultado. Depois, deve testar em desktop e celular, inclusive com conexão lenta.
