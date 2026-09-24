# Documentação Oficial: Plano de Negócios SEBRAE & Gestão Ágil (Monday.com)
## Radar São José • Inteligência Territorial B2B
**Versão:** 2026.2-executive  
**Liderança Executiva:** Leonardo Venâncio (CEO & Dados) & Mayumi Nagano (Sócia & Conteúdo)

---

## 1. Visão Geral do Sistema

O módulo de **Plano de Negócios** do **Radar São José** foi construído dentro do painel administrativo corporativo (`admin-crm.html`), unindo a metodologia consagrada do **SEBRAE** com a dinâmica econômica de empresas **SaaS (Software as a Service)** e prestação de serviços de inteligência territorial.

Todos os dados padrões pré-carregados na plataforma têm como fonte de verdade o **Documento-Base Oficial do Radar São José (Setembro/2026)**:
- **Modelo de Receita Principal:** Radar São José | Licença Anual de **R$ 12.000 / 12 meses** (equivalente a R$ 1.000/mês).
- **Camada Gratuita:** Radar Aberto (descoberta, demonstração e nutrição de funil).
- **Serviços Complementares:** Inteligência Aplicada (projetos de contexto corporativo), Pesquisa Personalizada (coleta primária de lacunas de dados) e Patrocínio Editorial do Blog.
- **Governança:** Separação progressiva do ativo empresarial em relação à estrutura do Studio 8.

---

## 2. Componentes e Funcionalidades Principais

### 2.1 Barra de Navegação Rápida com Botões de Salto Direto (Quick-Jump)
Uma barra superior fixa permite que os sócios saltem instantaneamente para qualquer seção do planejamento com um clique suave e destaque visual:
- ⚡ **Quadro Monday (Leonardo & Mayumi)**
- 📌 **1. Sumário Executivo**
- 🎯 **2. Análise de Mercado**
- 📢 **3. Plano de Marketing**
- ⚙️ **4. Plano Operacional**
- 💰 **5. Financeiro Cirúrgico**
- 🎛️ **6. Simulador de Cenários**
- 🛡️ **7. Matriz SWOT**
- 📋 **8. Avaliação Final**

---

### 2.2 Plataforma Integrada Estilo Monday.com (Leonardo & Mayumi)
Espaço dedicado para planejamento e acompanhamento ágil da execução do negócio:
- **Identificação Visual por Avatares:** Fotos oficiais de Leonardo (`fotos_radar/LEONARDO.jpeg`) e Mayumi (`fotos_radar/mayumi.jpg`).
- **Filtros Rápidos:** Visualização de *Todas as Tarefas*, *Apenas Leonardo* ou *Apenas Mayumi*.
- **Filtro por Status:** *Todos*, *A Fazer*, *Em Andamento*, *Concluído* ou *Travado*.
- **Barras de Progresso Dinâmicas:**
  - Progresso Geral do Plano (% concluído).
  - Progresso de Leonardo Venâncio (Foco: Produto, Plataforma SaaS, Comercial B2B, Integrações).
  - Progresso de Mayumi Nagano (Foco: Inteligência das 722 entrevistas, Análise das Personas, Blog e Ativação de 2h).
- **Interatividade Total:** Clique nas pílulas de status para alternar entre *A Fazer* $\to$ *Em Andamento* $\to$ *Concluído* $\to$ *Travado*. Botões para adicionar novas tarefas e excluir tarefas existentes.

---

### 2.3 Edição Universal e Irrestrita (100% Editável)
Absolutamente todos os campos do plano podem ser editados diretamente na tela:
- Inputs de texto, números, percentuais e textareas com auto-salvamento e sincronização.
- Tabelas dinâmicas com botões para adicionar e remover linhas:
  - **Sócios Fundadores** (com dados cadastrais, atribuições e bio).
  - **Capital Social** (com soma em tempo real e alerta visual: verde se soma 100% ou vermelho piscante se diferente de 100%).
  - **Matriz de Concorrentes** (Qualidade, Preço, Canal, Suporte).
  - **Fornecedores** (Serviços, Preços, Prazos).
  - **Produtos & Preços** (Ticket e Estratégia de Monetização).
  - **Quadro de Pessoal** (Cargo, Qualificação, Qtd, Responsável).
  - **Investimentos Fixos (Capex)** e **Pré-Operacionais**.
  - **Matriz SWOT** (4 quadrantes com tags de impacto).
- **Botão de Segurança:** Possibilidade de restaurar o padrão do Documento-Base com 1 clique a qualquer momento.

---

### 2.4 Modelagem Financeira Cirúrgica
O motor financeiro implementado em `api/business-plan.js` e `business-plan-controller.js` calcula automaticamente:

1. **Demonstrativo do Resultado do Exercício (DRE):**
   $$\text{Receita Bruta} = \text{SaaS Recorrente} + \text{Inteligência Aplicada} + \text{Pesquisa} + \text{Blog}$$
   $$\text{Receita Líquida} = \text{Receita Bruta} - \text{Tributos Simples Nacional}$$
   $$\text{Margem de Contribuição} = \text{Receita Líquida} - (\text{COGS SaaS} + \text{Comissões 20\%} + \text{Gateway Asaas 3,2\%} + \text{Custos Diretos})$$
   $$\text{EBITDA} = \text{Margem de Contribuição} - \text{Custos Fixos Operacionais (Mão de Obra + Opex)}$$
   $$\text{Lucro Líquido} = \text{EBITDA} - \text{Depreciação Contábil}$$

2. **Indicadores de Viabilidade SEBRAE:**
   - **Ponto de Equilíbrio (PE em R$):**
     $$\text{PE (R\$)} = \frac{\text{Custos Fixos Anuais}}{\text{Índice da Margem de Contribuição}}$$
   - **Ponto de Equilíbrio em Assinantes (Contratos de R$ 12.000):**
     $$\text{PE (Clientes)} = \frac{\text{Custos Fixos Anuais}}{\text{Margem de Contribuição Unitária do Contrato}}$$
   - **Lucratividade (%):**
     $$\text{Lucratividade} = \left(\frac{\text{Lucro Líquido}}{\text{Receita Bruta}}\right) \times 100$$
   - **Rentabilidade ROI (%):**
     $$\text{Rentabilidade} = \left(\frac{\text{Lucro Líquido Anual}}{\text{Investimento Total}}\right) \times 100$$
   - **Payback Simples (Meses):**
     $$\text{Payback} = \frac{\text{Investimento Total}}{\text{Lucro Líquido Mensal}}$$
   - **Capital de Giro & Caixa Mínimo:**
     $$\text{Ciclo Financeiro} = \text{PMRV} - \text{PMPC} + 30\text{ dias}$$
     $$\text{NLCG} = \text{Custo Diário da Operação} \times \text{Ciclo Financeiro}$$
     $$\text{Reserva de Segurança} = \text{Custos Fixos Mensais} \times 3\text{ meses}$$

3. **Gráficos Visuais com Chart.js:**
   - Gráfico de Rosca: Composição do DRE (Fixos vs Variáveis vs Impostos vs Lucro).
   - Gráfico de Linha: Curva de Ponto de Equilíbrio e Cruzamento de Receitas vs Custos Totais.

---

### 2.5 Simulador de Cenários Interativo com Sliders
Permite aos fundadores simular cenários em reuniões de alinhamento com sliders em tempo real:
- **Sliders:** Novos Assinantes (5 a 80), Preço do Radar (R$ 8.000 a R$ 22.000), Projetos de Inteligência Aplicada (0 a 20) e Variação de Custos Fixos (-30% a +50%).
- **Cenário Pessimista:** Crescimento modesto, preço com desconto, menor volume de serviços extras e custos inflacionados.
- **Cenário Provável (Base Oficial):** Meta sustentável do negócio com 20 licenças anuais (R$ 240k SaaS) + serviços corporativos.
- **Cenário Otimista:** Aceleração comercial, alta adesão de construtoras e grandes redes em SJC, múltiplos projetos de pesquisa personalizada.
- **Gráfico Comparativo Chart.js:** Barras agrupadas comparando Receita, Custos e Lucro Líquido dos três cenários.

---

### 2.6 Exportação Executiva em PDF (Padrão SEBRAE)
O botão **"Exportar PDF Sebrae"** utiliza a biblioteca `html2pdf.js` para compilar todo o plano em um documento A4 de alta definição com:
- Capa institucional e identidade visual do Radar São José.
- Tabelas financeiras formatadas sem quebra indesejada de páginas.
- DRE detalhado, indicadores de viabilidade e matriz SWOT.
- Quadro de tarefas com status de Leonardo e Mayumi.

---

## 3. Instruções de Instalação e Banco de Dados

### 3.1 Aplicando a Migração no Supabase
Execute o script [`data/migrations/001_business_plan_sebrae.sql`](file:///c:/Users/leose/OneDrive/Documentos/GitHub/radarsaojose/data/migrations/001_business_plan_sebrae.sql) no **SQL Editor** do seu painel do Supabase:
```sql
-- Cria as tabelas business_plans, plan_tasks, plan_partners,
-- plan_financial_projections, plan_swot_items com RLS e seed oficial.
```

### 3.2 Executando os Testes Automatizados
Para auditar a precisão de todas as equações financeiras e validações de capital social:
```bash
node tests/business-plan-financial.test.js
```
Saída esperada:
```
🧪 Iniciando Testes Unitários: Motor Financeiro SEBRAE / SaaS Radar São José...
  ✅ [PASS] Cálculo de Receita Bruta, Deduções e Margem de Contribuição
  ✅ [PASS] Cálculo de Ponto de Equilíbrio (R$ e Clientes) e Lucratividade
  ✅ [PASS] Cálculo de Payback e Rentabilidade (ROI)
  ✅ [PASS] Simulação de Cenários de Sensibilidade
  ✅ [PASS] Validação estrita de 100% no Capital Social

=========================================================
Testes Concluídos: 5 Aprovados | 0 Falhas
=========================================================
```

---

## 4. Estrutura de Arquivos

| Arquivo | Função |
| :--- | :--- |
| `admin-crm.html` | Interface do painel administrativo com aba `#tab-plan`, barra de salto rápido, quadro Monday e tabelas |
| `business-plan-controller.js` | Controlador de estado, renderização reativa, gráficos Chart.js e exportação PDF |
| `api/business-plan.js` | Endpoint Serverless Vercel com motor de cálculo financeiro e integração com Supabase |
| `data/migrations/001_business_plan_sebrae.sql` | Script SQL com schema relacional, RLS e dados de seed do Documento-Base |
| `tests/business-plan-financial.test.js` | Suíte de testes unitários automatizados |
| `DOCUMENTACAO_PLANO_DE_NEGOCIOS.md` | Este manual completo de arquitetura e operação |
