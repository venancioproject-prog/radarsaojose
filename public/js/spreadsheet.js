/**
 * spreadsheet.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-featured collaborative Excel-like spreadsheet component for the
 * Radar São José financial workspace.
 *
 * Public API (exported to window):
 *   window.initSpreadsheet(containerId)          – mount the component
 *   window.applySpreadsheetRemoteUpdate(payload) – apply a remote cell patch
 *
 * Reads / writes: currentPlanState.financialSheet
 *   Each cell is an object: { value, formula, format, bold, align }
 *     value   {string|number} – display / stored value
 *     formula {string}        – raw formula string (not evaluated yet)
 *     format  {string}        – 'currency' | 'percent' | 'text' | ''
 *     bold    {boolean}
 *     align   {string}        – 'left' | 'center' | 'right'
 *
 * Column layout (index 0-15):
 *   A=Categoria/Item  B=Out/26  C=Nov/26  D=Dez/26  E=Jan/27  F=Fev/27
 *   G=Mar/27  H=Abr/27  I=Mai/27  J=Jun/27  K=Jul/27  L=Ago/27
 *   M=Set/27  N=Out/27  O=Nov/27  P=Dez/27
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════
   * CONSTANTS & HELPERS
   * ═══════════════════════════════════════════════════════════════════════════ */

  /** Column letter labels (A-P = 16 columns, index 0-15). */
  const COL_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];

  /** Column header titles shown in row 0. */
  const DEFAULT_HEADERS = [
    'Categoria / Item',
    'Out/26','Nov/26','Dez/26',
    'Jan/27','Fev/27','Mar/27','Abr/27','Mai/27',
    'Jun/27','Jul/27','Ago/27','Set/27','Out/27','Nov/27','Dez/27'
  ];

  /**
   * Total number of columns (including the label column A).
   * @type {number}
   */
  const NUM_COLS = DEFAULT_HEADERS.length; // 16

  /**
   * Total number of data rows (excluding the header row 0).
   * @type {number}
   */
  const NUM_DATA_ROWS = 20;

  /** Creates an empty cell object with safe defaults. */
  function emptyCell(value = '', opts = {}) {
    return {
      value:   value,
      formula: opts.formula  || '',
      format:  opts.format   || '',
      bold:    opts.bold     || false,
      align:   opts.align    || 'left',
    };
  }

  /**
   * Format a numeric value according to the cell's format setting.
   * @param {string|number} value
   * @param {string} format  'currency' | 'percent' | ''
   * @returns {string}
   */
  function formatValue(value, format) {
    const num = parseFloat(String(value).replace(/[^\d.,-]/g, '').replace(',', '.'));
    if (format === 'currency' && !isNaN(num)) {
      return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (format === 'percent' && !isNaN(num)) {
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
    }
    return String(value);
  }

  /**
   * Extract the raw numeric string from a formatted display string.
   * Strips R$, %, dots (thousands), spaces so we can store clean numbers.
   * @param {string} text
   * @returns {string}
   */
  function stripFormatting(text) {
    return text.replace(/R\$\s*/g, '').replace(/%/g, '').replace(/\./g, '').replace(/,/g, '.').trim();
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * DEFAULT SHEET DATA
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Build the default 2-D array (rows × cols) of cell objects.
   * Row 0 = header row, rows 1-20 = financial data.
   *
   * Financial structure:
   *  Row  1 – Receita Bruta
   *  Row  2 – Impostos (Simples Nacional 9.2%)
   *  Row  3 – Receita Líquida
   *  Row  4 – [blank spacer]
   *  Row  5 – Custos Fixos (header)
   *  Row  6 –   Supabase
   *  Row  7 –   Vercel
   *  Row  8 –   Domínio
   *  Row  9 –   E-mail Profissional
   *  Row 10 – [blank spacer]
   *  Row 11 – Pró-labore Sócios (header)
   *  Row 12 –   Leonardo
   *  Row 13 –   Mayumi
   *  Row 14 – [blank spacer]
   *  Row 15 – Total Despesas Operacionais
   *  Row 16 – EBITDA
   *  Row 17 – [blank spacer]
   *  Row 18 – Dívida Acumulada (starts at R$86 000)
   *  Row 19 – [blank spacer]
   *  Row 20 – [reserved / notes]
   *
   * @returns {Array<Array<Object>>}
   */
  function buildDefaultSheet() {
    // Total rows = 1 header row + NUM_DATA_ROWS data rows
    const totalRows = 1 + NUM_DATA_ROWS;
    // Initialise every cell to empty
    const sheet = Array.from({ length: totalRows }, () =>
      Array.from({ length: NUM_COLS }, () => emptyCell())
    );

    /* ── Row 0: column headers ─────────────────────────────────────────── */
    DEFAULT_HEADERS.forEach((h, c) => {
      sheet[0][c] = emptyCell(h, { bold: true, align: c === 0 ? 'left' : 'center' });
    });

    /* ── Helper: fill one data row across all month columns (1-15) ──────── */
    const fillMonths = (row, val, fmt = 'currency') => {
      for (let c = 1; c < NUM_COLS; c++) {
        sheet[row][c] = emptyCell(val, { format: fmt, align: 'right' });
      }
    };

    /* ── Row 1: Receita Bruta ────────────────────────────────────────────── */
    sheet[1][0] = emptyCell('Receita Bruta', { bold: true });
    fillMonths(1, 0);

    /* ── Row 2: Impostos (Simples Nacional 9.2%) ─────────────────────────── */
    sheet[2][0] = emptyCell('Impostos (Simples Nacional 9,2%)', { bold: false });
    fillMonths(2, 0);

    /* ── Row 3: Receita Líquida ──────────────────────────────────────────── */
    sheet[3][0] = emptyCell('Receita Líquida', { bold: true });
    fillMonths(3, 0);

    /* ── Row 4: spacer ───────────────────────────────────────────────────── */
    sheet[4][0] = emptyCell('');

    /* ── Row 5: Custos Fixos header ──────────────────────────────────────── */
    sheet[5][0] = emptyCell('Custos Fixos', { bold: true });

    /* ── Row 6: Supabase ─────────────────────────────────────────────────── */
    sheet[6][0] = emptyCell('  Supabase');
    fillMonths(6, 110);

    /* ── Row 7: Vercel ───────────────────────────────────────────────────── */
    sheet[7][0] = emptyCell('  Vercel');
    fillMonths(7, 110);

    /* ── Row 8: Domínio ──────────────────────────────────────────────────── */
    sheet[8][0] = emptyCell('  Domínio');
    fillMonths(8, 5);

    /* ── Row 9: E-mail Profissional ──────────────────────────────────────── */
    sheet[9][0] = emptyCell('  E-mail Profissional');
    fillMonths(9, 20);

    /* ── Row 10: spacer ──────────────────────────────────────────────────── */
    sheet[10][0] = emptyCell('');

    /* ── Row 11: Pró-labore Sócios header ────────────────────────────────── */
    sheet[11][0] = emptyCell('Pró-labore Sócios', { bold: true });

    /* ── Row 12: Leonardo ────────────────────────────────────────────────── */
    sheet[12][0] = emptyCell('  Leonardo');
    fillMonths(12, 5000);

    /* ── Row 13: Mayumi ──────────────────────────────────────────────────── */
    sheet[13][0] = emptyCell('  Mayumi');
    fillMonths(13, 5000);

    /* ── Row 14: spacer ──────────────────────────────────────────────────── */
    sheet[14][0] = emptyCell('');

    /* ── Row 15: Total Despesas Operacionais ─────────────────────────────── */
    sheet[15][0] = emptyCell('Total Despesas Operacionais', { bold: true });
    // Sum of infra costs + pró-labore per month
    for (let c = 1; c < NUM_COLS; c++) {
      const total = 110 + 110 + 5 + 20 + 5000 + 5000; // 10245
      sheet[15][c] = emptyCell(total, { format: 'currency', align: 'right', bold: true });
    }

    /* ── Row 16: EBITDA ──────────────────────────────────────────────────── */
    sheet[16][0] = emptyCell('EBITDA', { bold: true });
    // EBITDA = Receita Líquida − Total Despesas; starts at 0 − 10245 = −10245
    for (let c = 1; c < NUM_COLS; c++) {
      sheet[16][c] = emptyCell(-10245, { format: 'currency', align: 'right', bold: true });
    }

    /* ── Row 17: spacer ──────────────────────────────────────────────────── */
    sheet[17][0] = emptyCell('');

    /* ── Row 18: Dívida Acumulada ────────────────────────────────────────── */
    sheet[18][0] = emptyCell('Dívida Acumulada', { bold: true });
    let debt = 86000;
    for (let c = 1; c < NUM_COLS; c++) {
      // Each month the deficit of 10245 adds to the debt (assuming no revenue yet)
      sheet[18][c] = emptyCell(debt, { format: 'currency', align: 'right' });
      debt += 10245;
    }

    /* ── Rows 19-20: spacer / notes ──────────────────────────────────────── */
    sheet[19][0] = emptyCell('');
    sheet[20][0] = emptyCell('Notas / Observações');

    return sheet;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * STYLES (injected once into <head>)
   * ═══════════════════════════════════════════════════════════════════════════ */

  const STYLE_ID = 'spreadsheet-js-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* ── Spreadsheet container ─────────────────────────────────────── */
      .ss-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        font-size: 13px;
        color: #1e293b;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        overflow: hidden;
      }

      /* ── Toolbar ───────────────────────────────────────────────────── */
      .ss-toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        background: #ffffff;
        border-bottom: 1px solid #e2e8f0;
        flex-shrink: 0;
        flex-wrap: wrap;
      }
      .ss-toolbar button {
        padding: 4px 8px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #f1f5f9;
        color: #334155;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: background 0.15s, border-color 0.15s;
        white-space: nowrap;
      }
      .ss-toolbar button:hover {
        background: #e2e8f0;
        border-color: #94a3b8;
      }
      .ss-toolbar button.ss-active {
        background: #3b82f6;
        border-color: #2563eb;
        color: #ffffff;
      }
      .ss-toolbar .ss-sep {
        width: 1px;
        height: 22px;
        background: #e2e8f0;
        margin: 0 4px;
      }
      .ss-cell-ref {
        padding: 3px 8px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #f8fafc;
        font-size: 12px;
        color: #64748b;
        min-width: 52px;
        text-align: center;
      }
      .ss-formula-bar {
        flex: 1;
        padding: 3px 8px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #ffffff;
        font-size: 12px;
        color: #1e293b;
        outline: none;
        min-width: 80px;
      }
      .ss-formula-bar:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
      }

      /* ── Scrollable grid area ──────────────────────────────────────── */
      .ss-grid-area {
        flex: 1;
        overflow: auto;
        position: relative;
      }

      /* ── Table ─────────────────────────────────────────────────────── */
      .ss-table {
        border-collapse: collapse;
        table-layout: fixed;
        min-width: 100%;
      }
      .ss-table col.ss-row-num-col {
        width: 42px;
      }
      .ss-table col.ss-col-A {
        width: 220px;
      }
      .ss-table col.ss-col-month {
        width: 105px;
      }

      /* Row number + column header cells */
      .ss-th-row, .ss-th-col {
        position: sticky;
        background: #f1f5f9;
        z-index: 2;
        padding: 4px 6px;
        text-align: center;
        font-weight: 600;
        font-size: 11px;
        color: #64748b;
        border: 1px solid #e2e8f0;
        user-select: none;
        white-space: nowrap;
      }
      .ss-th-row {
        left: 0;
        z-index: 3;
        width: 42px;
      }
      .ss-th-col {
        top: 0;
      }
      .ss-th-corner {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 4;
        background: #e2e8f0;
        border: 1px solid #cbd5e1;
      }

      /* Data cells */
      .ss-cell {
        padding: 4px 6px;
        border: 1px solid #e2e8f0;
        outline: none;
        min-height: 26px;
        white-space: pre;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        cursor: default;
        background: #ffffff;
        transition: background 0.1s;
        position: relative;
      }
      .ss-cell:focus {
        outline: none;
      }
      .ss-cell[contenteditable="true"] {
        white-space: pre-wrap;
        cursor: text;
        background: #fffbeb;
        caret-color: #1e293b;
      }

      /* Selected cell highlight */
      .ss-cell.ss-selected {
        box-shadow: inset 0 0 0 2px #3b82f6;
        z-index: 1;
        background: #eff6ff;
      }

      /* Header row (row 0) styling */
      .ss-header-cell {
        background: #f1f5f9;
        font-weight: 700;
        color: #334155;
      }

      /* Bold modifier */
      .ss-cell.ss-bold {
        font-weight: 700;
      }

      /* Negative value highlight (red) */
      .ss-negative {
        color: #dc2626;
      }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * MODULE STATE (one instance per page)
   * ═══════════════════════════════════════════════════════════════════════════ */

  /** Currently selected cell coordinates. */
  let _selectedRow = -1;
  let _selectedCol = -1;

  /** Reference to the container element. */
  let _container = null;

  /** Cached reference to the formula bar input. */
  let _formulaBar = null;

  /** Cached reference to the cell-reference label. */
  let _cellRefLabel = null;

  /* ═══════════════════════════════════════════════════════════════════════════
   * INIT
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Mount the spreadsheet into `containerId`.
   * Idempotent: calling again replaces existing content.
   *
   * @param {string} containerId – id of the DOM element to mount into
   */
  function initSpreadsheet(containerId) {
    _container = document.getElementById(containerId);
    if (!_container) {
      console.error('[Spreadsheet] Container not found:', containerId);
      return;
    }

    // Inject CSS once
    injectStyles();

    // Ensure currentPlanState exists globally
    if (typeof window.currentPlanState === 'undefined') {
      window.currentPlanState = {};
    }

    // Initialise sheet data if absent or empty
    if (
      !window.currentPlanState.financialSheet ||
      !Array.isArray(window.currentPlanState.financialSheet) ||
      window.currentPlanState.financialSheet.length === 0
    ) {
      window.currentPlanState.financialSheet = buildDefaultSheet();
    }

    // Clear previous content
    _container.innerHTML = '';

    // Build UI
    const wrapper = _buildWrapper();
    _container.appendChild(wrapper);

    // Register realtime listener for remote updates
    _registerRealtimeListener();

    console.info('[Spreadsheet] Initialised in #' + containerId);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * UI BUILDERS
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Build the top-level wrapper div containing toolbar + grid.
   * @returns {HTMLElement}
   */
  function _buildWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ss-wrapper';

    wrapper.appendChild(_buildToolbar());
    wrapper.appendChild(_buildGridArea());

    return wrapper;
  }

  /**
   * Build the toolbar.
   * @returns {HTMLElement}
   */
  function _buildToolbar() {
    const bar = document.createElement('div');
    bar.className = 'ss-toolbar';

    /* Cell reference label */
    _cellRefLabel = document.createElement('span');
    _cellRefLabel.className = 'ss-cell-ref';
    _cellRefLabel.textContent = '';
    bar.appendChild(_cellRefLabel);

    /* Formula / value bar */
    _formulaBar = document.createElement('input');
    _formulaBar.type = 'text';
    _formulaBar.className = 'ss-formula-bar';
    _formulaBar.placeholder = 'Valor ou fórmula…';
    _formulaBar.addEventListener('keydown', _onFormulaBarKeydown);
    _formulaBar.addEventListener('change', _onFormulaBarChange);
    bar.appendChild(_formulaBar);

    /* Separator */
    bar.appendChild(_sep());

    /* ── Formatting buttons ─────────────────────────────────────────── */
    bar.appendChild(_toolBtn('B', 'bold', 'Negrito', () => _applyFormat('bold')));
    bar.appendChild(_sep());

    bar.appendChild(_toolBtn('≡←', 'align-left', 'Alinhar à esquerda', () => _applyFormat('align', 'left')));
    bar.appendChild(_toolBtn('≡', 'align-center', 'Alinhar ao centro', () => _applyFormat('align', 'center')));
    bar.appendChild(_toolBtn('≡→', 'align-right', 'Alinhar à direita', () => _applyFormat('align', 'right')));
    bar.appendChild(_sep());

    bar.appendChild(_toolBtn('R$', 'fmt-currency', 'Formatar como moeda', () => _applyFormat('format', 'currency')));
    bar.appendChild(_toolBtn('%', 'fmt-percent', 'Formatar como percentagem', () => _applyFormat('format', 'percent')));
    bar.appendChild(_toolBtn('Txt', 'fmt-text', 'Formatar como texto', () => _applyFormat('format', 'text')));
    bar.appendChild(_sep());

    /* ── Row / column management ────────────────────────────────────── */
    bar.appendChild(_toolBtn('+ Linha', 'add-row', 'Adicionar linha', _addRow));
    bar.appendChild(_toolBtn('+ Coluna', 'add-col', 'Adicionar coluna', _addColumn));
    bar.appendChild(_toolBtn('✕ Linha', 'del-row', 'Excluir linha selecionada', _deleteRow));

    return bar;
  }

  /**
   * Create a toolbar button.
   * @param {string} label
   * @param {string} dataKey – stored in data-key for later lookup
   * @param {string} title   – tooltip
   * @param {Function} handler
   * @returns {HTMLButtonElement}
   */
  function _toolBtn(label, dataKey, title, handler) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.title = title;
    btn.dataset.key = dataKey;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handler();
    });
    return btn;
  }

  /** Create a visual separator for the toolbar. */
  function _sep() {
    const s = document.createElement('span');
    s.className = 'ss-sep';
    return s;
  }

  /**
   * Build the scrollable grid area containing the table.
   * @returns {HTMLElement}
   */
  function _buildGridArea() {
    const area = document.createElement('div');
    area.className = 'ss-grid-area';
    area.id = 'ss-grid-area';

    area.appendChild(_buildTable());

    return area;
  }

  /**
   * Build the full <table> from currentPlanState.financialSheet.
   * @returns {HTMLTableElement}
   */
  function _buildTable() {
    const sheet = window.currentPlanState.financialSheet;
    const numRows = sheet.length;
    const numCols = sheet[0].length;

    const table = document.createElement('table');
    table.className = 'ss-table';
    table.id = 'ss-table';

    /* ── <colgroup> for fixed column widths ─────────────────────────── */
    const cg = document.createElement('colgroup');
    // Row-number gutter column
    const rowNumCol = document.createElement('col');
    rowNumCol.className = 'ss-row-num-col';
    cg.appendChild(rowNumCol);
    // Data columns
    for (let c = 0; c < numCols; c++) {
      const col = document.createElement('col');
      col.className = c === 0 ? 'ss-col-A' : 'ss-col-month';
      cg.appendChild(col);
    }
    table.appendChild(cg);

    /* ── <thead> with column letter headers ─────────────────────────── */
    const thead = document.createElement('thead');
    const headerTr = document.createElement('tr');

    // Top-left corner cell
    const corner = document.createElement('th');
    corner.className = 'ss-th-corner ss-th-row ss-th-col';
    headerTr.appendChild(corner);

    // One <th> per data column
    for (let c = 0; c < numCols; c++) {
      const th = document.createElement('th');
      th.className = 'ss-th-col';
      th.textContent = COL_LETTERS[c] || String(c);
      headerTr.appendChild(th);
    }
    thead.appendChild(headerTr);
    table.appendChild(thead);

    /* ── <tbody> with data rows ─────────────────────────────────────── */
    const tbody = document.createElement('tbody');

    for (let r = 0; r < numRows; r++) {
      const tr = document.createElement('tr');

      // Row number cell (sticky left)
      const rowNumTd = document.createElement('td');
      rowNumTd.className = 'ss-th-row';
      rowNumTd.textContent = r === 0 ? '' : String(r);
      tr.appendChild(rowNumTd);

      // Data cells
      for (let c = 0; c < numCols; c++) {
        const td = _buildCell(r, c);
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    return table;
  }

  /**
   * Build a single <td> element for cell (r, c).
   * @param {number} r – row index
   * @param {number} c – column index
   * @returns {HTMLTableCellElement}
   */
  function _buildCell(r, c) {
    const sheet = window.currentPlanState.financialSheet;
    const cell = sheet[r][c];

    const td = document.createElement('td');
    td.contentEditable = 'false';
    td.dataset.row = String(r);
    td.dataset.col = String(c);
    td.tabIndex = 0; // allow focus via keyboard

    // Apply CSS classes
    td.className = 'ss-cell';
    if (r === 0) td.classList.add('ss-header-cell');
    if (cell.bold) td.classList.add('ss-bold');

    // Text alignment
    td.style.textAlign = cell.align || 'left';

    // Display value
    const display = formatValue(cell.value, cell.format);
    td.textContent = display;

    // Highlight negative numbers
    const numVal = parseFloat(String(cell.value));
    if (!isNaN(numVal) && numVal < 0) {
      td.classList.add('ss-negative');
    }

    // Attach event listeners
    td.addEventListener('click',    _onCellClick);
    td.addEventListener('dblclick', _onCellDblClick);
    td.addEventListener('blur',     _onCellBlur);
    td.addEventListener('keydown',  _onCellKeydown);

    return td;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * EVENT HANDLERS
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Single-click: select the cell.
   * @param {MouseEvent} e
   */
  function _onCellClick(e) {
    const td = e.currentTarget;
    _selectCell(parseInt(td.dataset.row, 10), parseInt(td.dataset.col, 10));
  }

  /**
   * Double-click: enter edit mode.
   * @param {MouseEvent} e
   */
  function _onCellDblClick(e) {
    const td = e.currentTarget;
    _enterEditMode(td);
  }

  /**
   * Blur: save changes from an editable cell back to the sheet state.
   * @param {FocusEvent} e
   */
  function _onCellBlur(e) {
    const td = e.currentTarget;
    if (td.contentEditable !== 'true') return;
    _saveCell(td);
  }

  /**
   * Keydown inside a cell.
   * – Enter  → confirm edit, move down
   * – Tab    → confirm edit, move right (Shift+Tab: left)
   * – Escape → cancel edit, restore value
   * – F2     → enter edit mode on selected cell
   * – Arrow keys → navigate (when not editing)
   * – Delete/Backspace → clear cell (when not editing)
   * @param {KeyboardEvent} e
   */
  function _onCellKeydown(e) {
    const td = e.currentTarget;
    const editing = td.contentEditable === 'true';
    const r = parseInt(td.dataset.row, 10);
    const c = parseInt(td.dataset.col, 10);

    if (editing) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          _saveCell(td);
          _exitEditMode(td);
          _selectCell(r + 1, c);
          break;
        case 'Tab':
          e.preventDefault();
          _saveCell(td);
          _exitEditMode(td);
          _selectCell(r, e.shiftKey ? c - 1 : c + 1);
          break;
        case 'Escape':
          e.preventDefault();
          _exitEditMode(td, true /* cancel */);
          break;
      }
    } else {
      switch (e.key) {
        case 'Enter':
        case 'F2':
          e.preventDefault();
          _enterEditMode(td);
          break;
        case 'Tab':
          e.preventDefault();
          _selectCell(r, e.shiftKey ? c - 1 : c + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          _selectCell(r - 1, c);
          break;
        case 'ArrowDown':
          e.preventDefault();
          _selectCell(r + 1, c);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          _selectCell(r, c - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          _selectCell(r, c + 1);
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          _clearCell(r, c);
          break;
        default:
          // Printable character → enter edit mode and start fresh
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            _enterEditMode(td, true /* clear first */);
            td.textContent = e.key;
            // Move caret to end
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(td);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
      }
    }
  }

  /**
   * Formula bar keydown: Enter commits the value.
   * @param {KeyboardEvent} e
   */
  function _onFormulaBarKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      _commitFormulaBar();
    }
  }

  /**
   * Formula bar change: commit on blur.
   */
  function _onFormulaBarChange() {
    _commitFormulaBar();
  }

  /** Apply the formula bar's current value to the selected cell. */
  function _commitFormulaBar() {
    if (_selectedRow < 0 || _selectedCol < 0) return;
    const newVal = _formulaBar.value;
    _saveCellValue(_selectedRow, _selectedCol, newVal);
    _refreshCell(_selectedRow, _selectedCol);
    _focusCell(_selectedRow, _selectedCol);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * CELL SELECTION & NAVIGATION
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Select the cell at (r, c), updating visual highlights and formula bar.
   * Out-of-bounds coordinates are clamped to valid range.
   * @param {number} r
   * @param {number} c
   */
  function _selectCell(r, c) {
    const sheet = window.currentPlanState.financialSheet;
    const maxR = sheet.length - 1;
    const maxC = sheet[0].length - 1;

    // Clamp
    r = Math.max(0, Math.min(r, maxR));
    c = Math.max(0, Math.min(c, maxC));

    // Remove previous highlight
    const prev = _getCellElement(_selectedRow, _selectedCol);
    if (prev) prev.classList.remove('ss-selected');

    _selectedRow = r;
    _selectedCol = c;

    // Add new highlight
    const td = _getCellElement(r, c);
    if (td) {
      td.classList.add('ss-selected');
      td.focus({ preventScroll: false });
    }

    // Update formula bar and cell reference label
    const cell = sheet[r][c];
    _cellRefLabel.textContent = (COL_LETTERS[c] || c) + (r === 0 ? '0' : r);
    _formulaBar.value = cell.formula || String(cell.value);

    // Update toolbar button active states
    _refreshToolbarState(cell);
  }

  /**
   * Focus the DOM cell without changing selection.
   * @param {number} r
   * @param {number} c
   */
  function _focusCell(r, c) {
    const td = _getCellElement(r, c);
    if (td) td.focus({ preventScroll: false });
  }

  /**
   * Get the <td> element for (r, c) from the live DOM.
   * @param {number} r
   * @param {number} c
   * @returns {HTMLTableCellElement|null}
   */
  function _getCellElement(r, c) {
    if (r < 0 || c < 0) return null;
    return document.querySelector(`#ss-table td[data-row="${r}"][data-col="${c}"]`);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * EDIT MODE
   * ═══════════════════════════════════════════════════════════════════════════ */

  /** Snapshot of cell text before editing (for Escape cancel). */
  let _editSnapshot = '';

  /**
   * Put the cell into edit mode (contenteditable=true).
   * @param {HTMLTableCellElement} td
   * @param {boolean} [clearFirst=false] – clear content before editing
   */
  function _enterEditMode(td, clearFirst = false) {
    const r = parseInt(td.dataset.row, 10);
    const c = parseInt(td.dataset.col, 10);
    const sheet = window.currentPlanState.financialSheet;
    const cell = sheet[r][c];

    // Show raw value (strip formatting) so user edits the number, not "R$ 1.000,00"
    const rawVal = cell.formula || String(cell.value);
    _editSnapshot = clearFirst ? '' : rawVal;

    td.contentEditable = 'true';
    td.textContent = clearFirst ? '' : rawVal;
    td.focus();

    // Move cursor to end
    try {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(td);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (_) { /* ignore */ }

    // Make sure cell is selected too
    _selectCell(r, c);
  }

  /**
   * Exit edit mode without saving (used by Escape).
   * @param {HTMLTableCellElement} td
   * @param {boolean} [cancel=false] – restore snapshot if true
   */
  function _exitEditMode(td, cancel = false) {
    td.contentEditable = 'false';
    if (cancel) {
      const r = parseInt(td.dataset.row, 10);
      const c = parseInt(td.dataset.col, 10);
      // Restore display value from sheet (not snapshot, to be safe)
      _refreshCell(r, c);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * SAVE / REFRESH
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Read the text content of an editable cell, save to the state, then
   * exit edit mode and re-render the cell with formatting applied.
   * @param {HTMLTableCellElement} td
   */
  function _saveCell(td) {
    const r = parseInt(td.dataset.row, 10);
    const c = parseInt(td.dataset.col, 10);
    const rawText = td.textContent;

    _saveCellValue(r, c, rawText);
    _exitEditMode(td);
    _refreshCell(r, c);
  }

  /**
   * Persist a new value into currentPlanState.financialSheet[r][c],
   * then broadcast a realtime update and trigger auto-save.
   * @param {number} r
   * @param {number} c
   * @param {string|number} rawText
   */
  function _saveCellValue(r, c, rawText) {
    const sheet = window.currentPlanState.financialSheet;
    const cell = sheet[r][c];

    // Determine whether the raw text is a formula
    if (String(rawText).startsWith('=')) {
      cell.formula = rawText;
      // Simple formula evaluation is not in scope; store raw
      cell.value = rawText;
    } else {
      cell.formula = '';
      // Try to parse numeric value (strip formatting characters)
      const stripped = stripFormatting(rawText);
      const num = parseFloat(stripped);
      cell.value = isNaN(num) ? rawText : num;
    }

    /* ── Realtime broadcast ──────────────────────────────────────────── */
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
      PlanRealtimeCollab.broadcastUpdate({
        type: 'spreadsheet',
        payload: { row: r, col: c, value: cell.value, formula: cell.formula }
      });
    }

    /* ── Auto-save hook ──────────────────────────────────────────────── */
    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    }
  }

  /**
   * Re-render a cell from the current state (called after save or remote update).
   * @param {number} r
   * @param {number} c
   */
  function _refreshCell(r, c) {
    const td = _getCellElement(r, c);
    if (!td) return;

    const sheet = window.currentPlanState.financialSheet;
    const cell = sheet[r][c];

    // Reset editable
    td.contentEditable = 'false';

    // Update text
    td.textContent = formatValue(cell.value, cell.format);

    // Sync CSS
    td.classList.toggle('ss-bold', !!cell.bold);
    td.style.textAlign = cell.align || 'left';

    // Negative highlight
    const numVal = parseFloat(String(cell.value));
    td.classList.toggle('ss-negative', !isNaN(numVal) && numVal < 0);

    // Re-apply selection highlight if still selected
    if (r === _selectedRow && c === _selectedCol) {
      td.classList.add('ss-selected');
    }
  }

  /**
   * Clear the content of a cell (set value to '').
   * @param {number} r
   * @param {number} c
   */
  function _clearCell(r, c) {
    _saveCellValue(r, c, '');
    _refreshCell(r, c);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * FORMATTING TOOLBAR ACTIONS
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Apply a formatting change to the currently selected cell.
   * @param {'bold'|'align'|'format'} type
   * @param {string} [value] – for align / format
   */
  function _applyFormat(type, value) {
    if (_selectedRow < 0 || _selectedCol < 0) return;
    const sheet = window.currentPlanState.financialSheet;
    const cell = sheet[_selectedRow][_selectedCol];

    switch (type) {
      case 'bold':
        cell.bold = !cell.bold;
        break;
      case 'align':
        cell.align = value;
        break;
      case 'format':
        cell.format = value === 'text' ? '' : value;
        break;
    }

    _refreshCell(_selectedRow, _selectedCol);
    _refreshToolbarState(cell);

    // Broadcast and auto-save
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
      PlanRealtimeCollab.broadcastUpdate({
        type: 'spreadsheet',
        payload: { row: _selectedRow, col: _selectedCol, cell: { ...cell } }
      });
    }
    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    }
  }

  /**
   * Update toolbar button active states to reflect the selected cell's formatting.
   * @param {Object} cell
   */
  function _refreshToolbarState(cell) {
    if (!_container) return;
    const setActive = (key, active) => {
      const btn = _container.querySelector(`button[data-key="${key}"]`);
      if (btn) btn.classList.toggle('ss-active', !!active);
    };

    setActive('bold', cell.bold);
    setActive('align-left',   cell.align === 'left'   || !cell.align);
    setActive('align-center', cell.align === 'center');
    setActive('align-right',  cell.align === 'right');
    setActive('fmt-currency', cell.format === 'currency');
    setActive('fmt-percent',  cell.format === 'percent');
    setActive('fmt-text',     !cell.format || cell.format === '');
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * ROW / COLUMN MANAGEMENT
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Append a new empty row to the sheet and re-render the table.
   */
  function _addRow() {
    const sheet = window.currentPlanState.financialSheet;
    const numCols = sheet[0].length;
    sheet.push(Array.from({ length: numCols }, () => emptyCell()));
    _rebuildTable();
  }

  /**
   * Append a new empty column to the sheet and re-render the table.
   */
  function _addColumn() {
    const sheet = window.currentPlanState.financialSheet;
    sheet.forEach(row => row.push(emptyCell()));
    _rebuildTable();
  }

  /**
   * Delete the currently selected row (prevents deletion of the header row 0).
   */
  function _deleteRow() {
    if (_selectedRow <= 0) {
      alert('A linha de cabeçalho não pode ser excluída.');
      return;
    }
    const sheet = window.currentPlanState.financialSheet;
    sheet.splice(_selectedRow, 1);
    _selectedRow = Math.min(_selectedRow, sheet.length - 1);
    _rebuildTable();
  }

  /**
   * Tear down and rebuild the entire table DOM from the current sheet state.
   * Preserves the selected cell if possible.
   */
  function _rebuildTable() {
    const area = document.getElementById('ss-grid-area');
    if (!area) return;
    const oldTable = document.getElementById('ss-table');
    if (oldTable) oldTable.remove();
    area.appendChild(_buildTable());

    // Restore selection
    if (_selectedRow >= 0 && _selectedCol >= 0) {
      _selectCell(_selectedRow, _selectedCol);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * REALTIME COLLABORATION
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Register a listener on PlanRealtimeCollab for remote 'spreadsheet' events.
   * Called once during initSpreadsheet().
   */
  function _registerRealtimeListener() {
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.on === 'function') {
      PlanRealtimeCollab.on('spreadsheet', applySpreadsheetRemoteUpdate);
      console.info('[Spreadsheet] Realtime listener registered.');
    } else {
      // PlanRealtimeCollab may not be available yet; retry after a short delay
      setTimeout(() => {
        if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.on === 'function') {
          PlanRealtimeCollab.on('spreadsheet', applySpreadsheetRemoteUpdate);
          console.info('[Spreadsheet] Realtime listener registered (delayed).');
        }
      }, 2000);
    }
  }

  /**
   * Apply an incoming remote update to the local sheet state and re-render
   * the affected cell.
   *
   * Expected payload shapes:
   *   { row, col, value, formula }          – value update
   *   { row, col, cell: { ...cellProps } }  – full cell object patch
   *
   * @param {Object} payload
   */
  function applySpreadsheetRemoteUpdate(payload) {
    if (!payload || typeof payload.row !== 'number' || typeof payload.col !== 'number') return;

    const sheet = window.currentPlanState.financialSheet;
    const { row, col } = payload;

    // Extend sheet dimensions if the remote update references out-of-range cells
    while (sheet.length <= row) {
      sheet.push(Array.from({ length: sheet[0].length }, () => emptyCell()));
    }
    while (sheet[row].length <= col) {
      sheet[row].push(emptyCell());
    }

    const cell = sheet[row][col];

    if (payload.cell && typeof payload.cell === 'object') {
      // Full cell patch
      Object.assign(cell, payload.cell);
    } else {
      // Value-only patch
      if (payload.formula !== undefined) cell.formula = payload.formula;
      if (payload.value   !== undefined) cell.value   = payload.value;
    }

    // Re-render the cell (table rebuild only if dimensions changed)
    _refreshCell(row, col);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * PUBLIC API
   * ═══════════════════════════════════════════════════════════════════════════ */

  window.initSpreadsheet               = initSpreadsheet;
  window.applySpreadsheetRemoteUpdate  = applySpreadsheetRemoteUpdate;

})();
