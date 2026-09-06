# Radar São José - Dashboard Analítico

Painel moderno, minimalista e responsivo integrado ao **Supabase** e renderizado com **Tailwind CSS** e **Chart.js**, otimizado para deploy instantâneo na **Vercel**.

---

## 📁 Estrutura de Arquivos

```text
radarsaojose/
├── fotos radar/        <-- Cole aqui os arquivos de imagem da sua logo (ex: logo.png)
│   └── logo.png
├── index.html          <-- Interface com Montserrat, Tailwind e layout responsivo
├── app.js              <-- Lógica do Supabase Auth, queries e gráficos Chart.js
├── vercel.json         <-- Configuração de cabeçalhos e SPA para a Vercel
└── README.md           <-- Documentação do projeto
```

---

## ⚙️ Configuração das Chaves do Supabase

No arquivo [`app.js`](./app.js), configure as seguintes variáveis no topo do arquivo com as credenciais do seu projeto Supabase:

```javascript
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA-ANON-KEY-AQUI";
```

### Onde encontrar no Supabase:
1. Acesse seu painel no [Supabase Dashboard](https://app.supabase.com).
2. Vá em **Project Settings** > **API**.
3. Copie a **Project URL** e a **anon public Key**.

---

## 🗄️ Estrutura Esperada da Tabela (`respostas_pesquisa`)

O dashboard está preparado para ler de forma flexível as colunas da sua tabela `respostas_pesquisa`:
- `bairro` ou `regiao` ou `cidade` (Texto)
- `avaliacao` ou `satisfacao` ou `resposta` (Texto/Numérico)
- `created_at` (Timestamp/Data)

---

## 🚀 Deploy na Vercel

1. Faça o commit e push para o repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: setup dashboard and supabase auth"
   git push origin main
   ```
2. Acesse a [Vercel](https://vercel.com) e importe o repositório `radarsaojose`.
3. O deploy será concluído instantaneamente (projeto estático pronto para CDN).
