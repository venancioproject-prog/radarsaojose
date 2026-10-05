// Creates the dated, machine-readable claim inventory used by the historical audit.
// Run from the repository root: node scripts/inventariar_historia.cjs
const fs = require("node:fs");
const vm = require("node:vm");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync("historia_sjc_data.js", "utf8"), context);
const data = context.window.HISTORIA_SJC_DATA;
const moduleSource = fs.readFileSync("historia_module.js", "utf8");
const fontesStart = moduleSource.indexOf("  const FONTES_HISTORIA =");
const fontesEnd = moduleSource.indexOf("  // =========================================================================", fontesStart);
const fontesCode = (fontesStart >= 0 && fontesEnd > fontesStart) ? moduleSource.slice(fontesStart, fontesEnd) : "";

function extractStatic(name, nextName) {
  const start = moduleSource.indexOf("  const " + name + " =");
  const end = nextName
    ? moduleSource.indexOf("  const " + nextName + " =", start)
    : moduleSource.indexOf("\n  function renderHistoriaDashboard", start);
  if (start < 0 || end < 0) throw new Error("Static content block not found: " + name);
  const isolated = { window: {} };
  vm.runInNewContext(fontesCode + "\n" + moduleSource.slice(start, end) + "\nglobalThis.auditValue = " + name + ";", isolated);
  return JSON.parse(JSON.stringify(isolated.auditValue));
}
const cycles = extractStatic("CICLOS_EDITORIAIS", "PATRIMONIOS_EDITORIAIS");
const heritage = extractStatic("PATRIMONIOS_EDITORIAIS", "QUIZ_QUESTIONS");
const quiz = extractStatic("QUIZ_QUESTIONS", "quizState");
const demographic = extractStatic("DEMOGRAFIA_SJC_DATA", null);
const sourceSpecificity = (rawUrl) => {
  if (!rawUrl) return "missing";
  try {
    const parsed = new URL(rawUrl);
    const path = parsed.pathname.replace(/\/+$/, "");
    if (!path || path === "/promemoria") return "homepage_or_broad_index";
    return "specific_or_topic_page_still_requires_claim_check";
  } catch {
    return "invalid_url";
  }
};
const notes = {
  "ev-1564": "Disputed. Prefeitura says late 16th c.; Pró-Memória chronology places the aldeamento in 1600–1650. Not a documented foundation date.",
  "ev-1611": "Generic references do not substantiate local effects attributed to the 1611 law; find the norm and evidence of its local application.",
  "ev-1650": "The broad source does not identify the sesmaria record or the asserted cartorial evidence; verify the primary document.",
  "ev-1680": "Pró-Memória supports a transfer around 1680. The stated reasons (salubrity/flood protection) require separate evidence.",
  "ev-1692": "Pró-Memória chronology assigns 1692 to Residência do Paraíba do Sul and 1696 to Residência de São José; title conflates them.",
  "ev-1767": "Institutionally supported. Link the specific Auto de Ereção rather than a general archive landing page.",
  "ev-1828": "Pró-Memória chronology supports a first public school; identify the specific school record and teacher source.",
  "ev-1864": "Link the identified provincial law. Its claimed demographic/economic rationale needs another source.",
  "ev-1871": "ALESP identifies Law 47 on 2 April 1871; current data links only to the homepage. Find the law text.",
  "ev-1877": "Separate completed track (1876) from first passenger train/inauguration (1877); municipality gives 28 August for Eugênio de Melo station.",
  "ev-1924": "Replace institution homepages with specific historical/tombamento records; substantiate superlatives and patient/city impact claims.",
  "ev-1947": "Find the specific municipal act documenting who donated which land and on what date.",
  "ev-1950": "Separate ITA creation, first classes, move to SJC and campus design; identify the exact IPHAN protection record.",
  "ev-1961": "INPE supports GOCNAE in 1961; do not conflate its creation with the later creation of INPE.",
  "ev-1971": "INPE identifies its creation by decree on 22 April 1971; link the specific decree.",
  "ev-1982": "Plan­alto homepage is not evidence of an APA; identify the creating act, jurisdiction and precise polygon.",
  "ev-1992": "Univap homepage is broad; find the institutional/MEC record establishing the date and transition.",
  "ev-1993": "INPE says SCD-1 was developed by INPE and launched in Florida. Qualify ‘100% Brazilian’.",
  "ev-2012": "A commercial legislation mirror is listed; prefer the official municipal gazette/law and confirm the protected area name and boundary.",
  "ev-2018": "Link the actual municipal law, approval/sanction date and official plan document.",
  "ev-2022": "Check certification scope/version, certifier and comparison set behind ‘first in Brazil’; avoid ‘maximum certification’.",
  "ev-2026": "Municipal news supports the announcement. Confirm official FLACMA role/dates against the network’s record."
};
const direct = (source) => ({ ...source, linkSpecificity: sourceSpecificity(source.url) });
const unverified = "needs_claim_level_verification";
const entries = (items, project) => ({
  reviewStatus: unverified,
  reviewInstructions: project,
  items
});
const registry = {
  metadata: {
    createdAt: "2026-10-02",
    scope: ["historia_sjc_data.js", "historia_module.js", "historical sections in app.html"],
    purpose: "Dated source and claim inventory. Current evidence labels do not amount to independent verification.",
    visitorRule: "Every published factual claim needs a nearby, readable link to the specific source that supports it."
  },
  inventory: {
    eventCount: data.eventos.length,
    eventCitationCount: data.eventos.reduce((n, event) => n + (event.fontes || []).length, 0),
    homepageOrBroadEventCitationCount: data.eventos.reduce((n, event) => n + (event.fontes || []).filter(source => sourceSpecificity(source.url) === "homepage_or_broad_index").length, 0),
    neighborhoodCount: data.bairros.length,
    personalityCount: data.personalidades.length,
    mayorCount: data.prefeitos.length,
    regionCount: data.regioes.length,
    duplicatedCoordinatePairs: [["ev-1767", "ev-2026"], ["ev-1871", "ev-2018"]],
    populationConflicts: [
      "1872 local series: 12,430; Pró-Memória transcription: 12,998.",
      "1767 local series: 2,150; Pró-Memória lists 364 people across 94 homes in 1766.",
      "Local 2026 series: 750,000; IBGE profile surfaced 729,153 estimated for 2026 and 697,054 at the 2022 census."
    ]
  },
  events: data.eventos.map(event => ({
    id: event.id,
    claim: {
      year: event.ano, title: event.titulo, date: event.dataExata, precision: event.precisao,
      summary: event.resumo, details: event.detalhes, place: event.local,
      coordinates: { latitude: event.lat, longitude: event.lng }, evidenceLabel: event.evidencia
    },
    currentSources: (event.fontes || []).map(direct),
    reviewStatus: unverified,
    auditNotes: notes[event.id] || "Check every date, actor, location, causal statement and qualifier against the cited record, not only its title or URL."
  })),
  neighborhoods: entries(data.bairros.map(item => ({
    id: item.id,
    claim: { name: item.nome, region: item.regiaoNome, period: item.periodo, nameOrigin: item.origemNome, history: item.historia, curiosity: item.curiosidade },
    currentSource: { title: item.fonte, url: item.fonteUrl, linkSpecificity: sourceSpecificity(item.fonteUrl) },
    reviewStatus: "needs_neighborhood_specific_source"
  })), "Check the exact neighborhood and each separate toponym, date and history claim. A filled source field or general institutional homepage is not verification."),
  personalities: entries(data.personalidades.map(item => ({
    id: item.id, claim: { name: item.nome, role: item.cargo, dates: item.periodo, description: item.descricao },
    currentSources: [], reviewStatus: "missing_claim_level_citations"
  })), "Add a specific biography, institution or archive reference for dates, education, roles and actions."),
  mayors: entries(data.prefeitos.map(item => ({
    claim: { dates: item.periodo, name: item.nome, accessMethod: item.formaAcesso || item.acesso, storedStatus: item.situacaoDocumental || item.situacao },
    currentSources: [], reviewStatus: "missing_claim_level_citations",
    auditNotes: (Number.parseInt(item.periodo, 10) < 1834 ? "This term predates the 1834 creation of the municipal prefect office described in the Pró-Memória chronology; verify whether this person held a different Câmara role." : "No source supports this person’s term, name or accession method; verify from municipal acts and election records.")
  })), "Verify every period, name, form of accession and status against municipal acts and election records; preserve documented gaps."),
  regions: entries(data.regioes.map(item => ({
    id: item.id,
    claim: { name: item.nome, summary: item.resumo, history: item.historia, neighborhoods: item.principaisBairros, landmarks: item.marcos },
    currentSources: [],
    geometry: { svgPath: item.svgPath, center: item.center, status: "schematic drawing; no published geographic boundary cited" },
    reviewStatus: "missing_claim_level_citations"
  })), "Add sources and an explicit distinction between official geographic boundaries and illustrative regions."),
  fixedInterfaceCopy: {
    sourceLocation: "app.html:13937–14415",
    reviewStatus: unverified,
    claims: [
      { text: "The atlas presents 31 milestones with audited primary sources.", auditNote: "Static count; 24 of 56 event-source URLs point to homepages/broad indexes. Other links still need claim-by-claim review, and several claim groups have no record-level references. Do not promise this until citations are audited and exposed." },
      { text: "The 1767 modal says historians and primary sources converge that no founding act from 1564 exists.", auditNote: "This is a universal claim unsupported by the inventory; identified institutional accounts differ on chronology. Cite the accounts and describe the documentary gap without implying unanimity." },
      { text: "The 1767 modal lists official documents and laws.", auditNote: "Items are named but not linked for the reader. Add direct archive/legal-document URLs next to the list." },
      { text: "The hero calls 1767 the city’s institutional emancipation.", auditNote: "Check terminology against the Auto de Ereção and explain the specific status change it records." }
    ]
  },
  imageRightsRule: {
    reviewStatus: "license_must_be_checked_per_item",
    archiveNotice: { title: "Pró-Memória reproduction notice", url: "https://www.camarasjc.sp.gov.br/promemoria/", note: "The site's footer permits reproduction of content from its site when author and source are credited. Check that each third-party digitized image/document is covered by the notice and record its item-specific author/source." },
    legalReference: { title: "Brazilian Copyright Law 9,610/1998, Article 29", url: "https://www.planalto.gov.br/ccivil_03/leis/l9610.htm", note: "Protected-work reproduction generally requires prior express authorization, subject to statutory exceptions." },
    requiredPerMediaItem: ["creator", "collection", "catalogRecordId", "permanentItemUrl", "licenseOrPermission", "requiredCredit", "derivativeOrCropPermission"]
  },
  editorialGroups: [
    { id: "cycles", title: "Five historical cycle narratives", items: cycles.map(({imagem,badgeColor,accentBorder,...item}) => ({...item,currentSources:[],reviewStatus:unverified})), reviewStatus: unverified, notes: "Audit sentence-level causal claims, quotations, superlatives and unsourced narrative additions." },
    { id: "heritage", title: "Heritage places and visitor details", items: heritage.map(({imagem,badgeClass,...item}) => ({...item,currentSources:[],reviewStatus:unverified})), reviewStatus: unverified, notes: "Check dates, architects, area sizes, heritage designations, address, hours, access and media rights. No image-specific authorship/license metadata was found in these records." },
    { id: "quiz", title: "Quiz questions, answer keys and explanations", items: quiz.map(({opcoes,...item}) => ({...item,correctAnswer:opcoes.find(option => option.correta)?.texto,currentSources:[],reviewStatus:unverified})), reviewStatus: unverified, notes: "Link evidence at answer reveal; validate each answer and explanation; remove unsupported toponymy and superlatives." },
    { id: "population", title: "Historical and current population series", items: demographic.crescimento.map(item => ({...item,currentSources:[],reviewStatus:unverified})), reviewStatus: unverified, notes: "Rebuild from IBGE census/estimate tables; label reference year and municipal versus urban-seat geography." },
    { id: "migration", title: "Migration origin, motive and cultural outcome narratives", items: demographic.fluxosMigratorios.map(item => ({...item,currentSources:[],reviewStatus:unverified})), reviewStatus: unverified, notes: "No source accompanies these claims; require census data or specific historical research." },
    { id: "quotes", title: "Quotation-marked copy and superlatives", itemCount: null, reviewStatus: unverified, notes: "Identify actual quotation authors; define and substantiate claims such as first, largest, unique, 100%, capital, leader and martyr." }
  ],
  verifiedStartingSources: [
    { title: "Pró-Memória chronology", url: "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/", supports: "Institutional chronology; includes 1692/1696 distinction, 1872 population, school, railway, 1877 train." },
    { title: "Pró-Memória history", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/", supports: "Institutional account of the Indigenous aldeamento, colonial period, sanatorium and industrialization." },
    { title: "Pró-Memória, urbanization and industrialization study", url: "https://www.camarasjc.sp.gov.br/promemoria/2023/10/31/artigo-uma-analise-do-crescimento-urbano-de-sao-jose-dos-campos-por-meio-do-desenvolvimento-industrial-1950-a-1970/", supports: "Research using municipal acts and subdivision maps." },
    { title: "Pró-Memória, História e Cidade volume V", url: "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2015/06/Volume-V.pdf", supports: "Secondary work with urban growth maps for 1953, 1962 and 1973." },
    { title: "IBGE municipal profile", url: "https://www.ibge.gov.br/cidades-e-estados/sp/sao-jose-dos-campos.html", supports: "Census and population estimate fields with distinct reference years." },
    { title: "IBGE population estimates", url: "https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativasde-populacao.html", supports: "Official municipal estimate tables." },
    { title: "ALESP law index", url: "https://al.sp.gov.br/alesp/legislacao-temas/?data1=+&data2=&idTema=964&idTipoNorma=9", supports: "Identifies State Law 47 on 2 April 1871; follow through to the full legal text." },
    { title: "INPE history", url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/historia", supports: "GOCNAE in 1961, INPE in 1971 and SCD-1 in 1993, launched in Florida." },
    { title: "INPE legal basis", url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/base-juridica", supports: "Specific 1961 and 1971 decrees." }
  ]
};
fs.writeFileSync("docs/historia-auditoria/inventario.json", JSON.stringify(registry, null, 2) + "\n", "utf8");
console.log(JSON.stringify(registry.inventory));
