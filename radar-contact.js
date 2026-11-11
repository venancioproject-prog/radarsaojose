(function (root) {
  "use strict";

  function normalizePhone(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (!/^\+?[\d\s().-]+$/.test(raw)) return null;
    const digits = raw.replace(/\D/g, "");
    if (/^(\d)\1+$/.test(digits)) return null;
    if (raw.startsWith("+")) {
      return /^[1-9]\d{7,14}$/.test(digits) ? "+" + digits : null;
    }
    if (digits.length === 10 || digits.length === 11) return "+55" + digits;
    if (/^55\d{10,11}$/.test(digits)) return "+" + digits;
    return null;
  }

  const profiles = Object.freeze({
    empresario: "Empresário(a)", gestor: "Diretor(a) / Gestor(a)", marketing: "Marketing",
    agencia: "Agência / Publicidade", investidor: "Investidor(a)", imobiliario: "Setor imobiliário",
    consultor: "Consultoria", inteligencia: "Pesquisa / Inteligência", setor_publico: "Setor público",
    comunicacao: "Comunicação / Imprensa", professor: "Professor(a)", estudante: "Estudante", outros: "Outros"
  });
  const contact = Object.freeze({ normalizePhone, profiles });
  if (typeof module === "object" && module.exports) module.exports = contact;
  else root.radarContact = contact;
})(typeof window === "undefined" ? globalThis : window);
