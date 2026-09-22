# Documentação e Especificação Completa dos Módulos de IA: Consultor Estratégico & Oráculo RDR (Fase 2)

Este documento preserva integralmente a arquitetura, prompts, endpoints, regras de negócio e interfaces desenvolvidas para as ferramentas de Inteligência Artificial do **Radar São José dos Campos**, desacopladas da Fase 1 para lançamento no roadmap de evolução (Fase 2).

---

## 1. Módulo: Consultor IA (Estratégia & Diagnóstico McKinsey)

### 1.1 Objetivo do Módulo
O **Consultor IA** funciona como um conselheiro executivo sênior (nível sócio McKinsey / Bain) especialista no ecossistema econômico, demográfico e imobiliário de São José dos Campos. Ele cruza a ideia/projeto submetida pelo usuário com a base de dados real do Radar (Censo 2022, pesquisa de 477 respondentes, zoneamento e vetores de sinergia).

### 1.2 Endpoint Serverless: `/api/consultor.js`
* **Provedor LLM:** Groq Cloud API (`GROQ_API_KEY`)
* **Modelos Compatíveis:**
  * `qwen/qwen3.6-27b` (Padrão de alta precisão)
  * `llama-3.3-70b-versatile`
  * `deepseek-r1-distill-llama-70b`
* **System Prompt & Framework Analítico:**
  * Estrutura de análise em 6 dimensões:
    1. **Sumário Executivo & Tese de Viabilidade**
    2. **Validação Demográfica & Perfil de Renda por Região (Urbanova, Aquarius, Satélite, Centro, Leste)**
    3. **Barreiras de Entrada, Concorrência & Zoneamento**
    4. **Comportamento do Consumidor SJC (Dados da Pesquisa)**
    5. **Matriz de Riscos & Plano de Ação em 30-60-90 Dias**
    6. **Recomendação Final Go / No-Go**

### 1.3 Payload de Entrada & Saída
```json
// Request POST /api/consultor
{
  "query": "Quero abrir uma padaria artesanal e cafeteria premium no bairro Urbanova",
  "history": [],
  "userContext": {
    "bairro": "Urbanova",
    "segmento": "Gastronomia / Varejo",
    "investimento": "R$ 200 mil a R$ 500 mil"
  }
}

// Response
{
  "success": true,
  "reply": "## DIAGNÓSTICO EXECUTIVO MCKINSEY...",
  "model": "qwen/qwen3.6-27b",
  "generatedAt": "2026-09-22T20:00:00.000Z"
}
```

---

## 2. Módulo: Oráculo RDR (60 Personas & Arquétipos Comportamentais)

### 2.1 Objetivo do Módulo
O **Oráculo RDR** simula entrevistas em profundidade e grupos focais com 60 personas hiper-realistas baseadas nos clusters demográficos e psicográficos de São José dos Campos (ex: Engenheiro da Embraer, Estudante do ITA, Comerciante do Centro, Mãe de família da Zona Sul, Empreendedora do Aquarius).

### 2.2 Endpoint Serverless: `/api/oraculo.js`
* **Arquétipos e Variáveis Comportamentais:**
  * 60 Perfis com Nome, Idade, Bairro, Profissão, Renda Familiar, Hábitos de Consumo, Meios de Transporte, Redes Sociais e Preferências Políticas/Culturais.
* **Modos de Interação:**
  * `Entrevista 1 a 1`: Conversa simulada com persona específica.
  * `Focus Group`: Resposta consolidada de 5 a 10 personas representativas de diferentes regiões sobre um novo produto/serviço.

---

## 3. Guia de Reativação na Fase 2

Para reativar os módulos no frontend:
1. No arquivo `app.html`, descomentar/exibir os botões:
   - `#btn-nav-consultor` (Consultor IA)
   - `#btn-nav-personas` (Oráculo RDR)
2. No arquivo `app.js`, descomentar os listeners de inicialização:
   - `initConsultorModule()`
   - `initPersonasModule()`
3. Assegurar que a variável `GROQ_API_KEY` esteja preenchida na Vercel.
