const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'admin-crm.html');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Injetar <script src="business-plan-controller.js"></script> no <head> após os scripts de Chart.js
if (!content.includes('<script src="business-plan-controller.js"></script>')) {
  content = content.replace(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>\n  <!-- Controlador do Plano de Negócios & Monday.com -->\n  <script src="business-plan-controller.js"></script>'
  );
}

// 2. Remover tag duplicada antes de </body> se houver
content = content.replace('  <script src="business-plan-controller.js"></script>\n</body>', '</body>');

// 3. Remover as funções legadas do plano antigo (DEFAULT_BUSINESS_PLAN_SEBRAE)
const oldStartMarker = '// BUSINESS PLAN SEBRAE & "FOR DUMMIES" - CONTROLLER & DADOS DIDÁTICOS';
const oldEndMarker = 'if (typeof fetchCRMDataFromSupabase === \'function\') {';

const idxStart = content.indexOf(oldStartMarker);
const idxEnd = content.indexOf(oldEndMarker);

if (idxStart !== -1 && idxEnd !== -1) {
  content = content.slice(0, idxStart) + '// [NOVO]: O Plano de Negócios e Monday.com agora são gerenciados exclusivamente por business-plan-controller.js\n\n    ' + content.slice(idxEnd);
  console.log('✅ Bloco legado de funções do Business Plan removido!');
} else {
  console.warn('⚠️ Marcadores antigos não encontrados para remoção.');
}

// 4. No switchTab, acionar loadBusinessPlan() e redimensionar gráficos
if (content.includes("function switchTab(tabId) {")) {
  const switchMarker = "if (tabId === 'plan' && typeof loadBusinessPlan === 'function') {\n        loadBusinessPlan();\n      }\n";
  if (!content.includes("if (tabId === 'plan' && typeof loadBusinessPlan === 'function')")) {
    content = content.replace(
      "// No mobile, recolhe a barra lateral",
      `if (tabId === 'plan' && typeof loadBusinessPlan === 'function') {\n        loadBusinessPlan();\n      }\n      // No mobile, recolhe a barra lateral`
    );
    console.log('✅ Chamada de loadBusinessPlan() adicionada em switchTab!');
  }
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('🎉 Limpeza e integração final do admin-crm.html concluída com sucesso!');
