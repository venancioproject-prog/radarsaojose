AGENTE 4 — Motor único UMD/CommonJS em lib/pricing.js; preços anuais confirmados e Pix 10% numa constante.
Cotação em centavos com BigInt, datas explícitas UTC, arredondamento final e vencimento preservado.
Parcelado substitui parcelas restantes; mês 4 retorna 8 parcelas Report de R$489,90.
Testes: tests/pricing.test.cjs, node --test; casos Pix, primeiro/último dia, duplo upgrade, Mídia, arredondamento.
PENDÊNCIAS: backend deve verificar versão/consumo atomicamente; módulo puro não impede replay sozinho.
PENDÊNCIAS: troca de modalidade e parcelamento já quitado bloqueados até conciliação de obrigações.
PENDÊNCIAS: quoteUpgrade.amountCents é diferença; installments contém NOVAS parcelas substitutas, não cobrança extra.
