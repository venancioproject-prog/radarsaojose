(() => {
  'use strict';

  const catalog = `
    <div class="plans-grid">
      <!-- PLANO GRÁTIS -->
      <div class="plan-card">
        <p class="plan-name">Plano Grátis</p>
        <div class="plan-price"><span>Acesso livre</span> R$ 0</div>
        <p class="plan-tagline">Sem cartão e sem compromisso.<br><strong>100% gratuito</strong> para sempre.</p>
        <p class="plan-tagline">História, Banco de Imagens e Dados Públicos no acesso gratuito.</p>
        <ul class="plan-features">
          <li><i class="fas fa-check" aria-hidden="true"></i>Dados Públicos e indicadores de SJC</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>História e linha do tempo da cidade</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>Banco de Imagens em alta resolução</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>Acesso gratuito imediato</li>
        </ul>
        <a href="app.html" class="btn-plan btn-plan-outline">Criar conta gratuita</a>
      </div>

      <!-- PLANO DASH -->
      <div class="plan-card">

        <p class="plan-name">Plano Dash</p>
        <div class="plan-price"><span>12× de</span> R$ 269,90</div>
        <p class="plan-tagline">Sem juros no cartão. Total anual: R$ 3.238,80.<br><strong>R$ 2.914,92 à vista no Pix</strong> (10% de desconto).</p>
        <p class="plan-tagline">Para investigar o público e comparar os recortes da pesquisa.</p>
        <ul class="plan-features">
          <li><i class="fas fa-check" aria-hidden="true"></i><strong>Dashboard da pesquisa quantitativa</strong></li>
          <li><i class="fas fa-check" aria-hidden="true"></i>30 gráficos interativos</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>Filtros por gênero, idade, renda e região</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>Base de 477 moradores</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>Recortes de perfil e comportamento</li>
        </ul>
        <a href="login.html" data-checkout-plan="dash" class="btn-plan btn-plan-outline">Contratar Dash</a>
      </div>
      <div class="plan-card destaque">
        <div class="plan-badge">Recomendado</div>
        <p class="plan-name">Plano Report</p>
        <div class="plan-price"><span>12× de</span> R$ 489,90</div>
        <p class="plan-tagline">Sem juros no cartão. Total anual: R$ 5.878,80.<br><strong>R$ 5.290,92 à vista no Pix</strong> (10% de desconto).</p>
        <p class="plan-tagline">Para levar uma análise mais completa à próxima reunião de decisão.</p>
        <ul class="plan-features">
          <li><i class="fas fa-check" aria-hidden="true"></i>Tudo do plano Dash</li>
          <li><i class="fas fa-check" aria-hidden="true"></i><strong>Relatório da pesquisa</strong></li>
          <li><i class="fas fa-check" aria-hidden="true"></i>10 entrevistas em profundidade</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>Observação de campo: Invasão de Cenários</li>
          <li><i class="fas fa-check" aria-hidden="true"></i>Análises de comportamento e consumo</li>
        </ul>
        <a href="login.html" data-checkout-plan="report" class="btn-plan btn-plan-solid">Contratar Report</a>
      </div>
      <div class="plan-card">

        <p class="plan-name">Plano Mídia</p>
        <div class="plan-price"><span>12× de</span> R$ 1.190,00</div>
        <p class="plan-tagline">Sem juros no cartão. Total anual: R$ 14.280,00.<br><strong>R$ 12.852,00 à vista no Pix</strong> (10% de desconto).</p>
        <p class="plan-tagline">Para equipes que planejam comunicação e precisam acompanhar a cidade.</p>
        <ul class="plan-features">
          <li><i class="fas fa-check" aria-hidden="true"></i>Tudo do plano Report</li>
          <li><i class="fas fa-check" aria-hidden="true"></i><span><strong>Dashboard de inteligência de mídia</strong><span class="plan-feature-detail">Análise das publicações de sites e blogs de notícias locais.</span></span></li>
          <li><i class="fas fa-check" aria-hidden="true"></i><span><strong>Atualização mensal no dia 10</strong><span class="plan-feature-detail">A análise cobre as publicações do mês anterior.</span></span></li>
          <li><i class="fas fa-check" aria-hidden="true"></i><span><strong>Uma apresentação online por ano</strong><span class="plan-feature-detail">Apresentação da pesquisa à sua equipe e orientação para interpretar o dashboard de mídia.</span></span></li>
          <li><i class="fas fa-check" aria-hidden="true"></i><strong>3 acessos individuais: 1 titular e 2 convidados</strong></li>
        </ul>
        <a href="login.html" data-checkout-plan="midia" class="btn-plan btn-plan-outline">Contratar Mídia</a>
      </div>
    </div>
    <p class="plans-note">Os planos pagos têm vigência anual. O valor em 12 parcelas corresponde ao pagamento do período de um ano.</p>
  `;

  window.radarPlanCatalog = catalog;
  document.querySelectorAll('[data-radar-plan-catalog]').forEach(container => {
    container.innerHTML = catalog;
  });
})();
