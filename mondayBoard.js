/**
 * mondayBoard.js
 * Monday.com-style Kanban board for the Radar São José project.
 *
 * Reads/writes: currentPlanState.mondayTasks
 * Public API (exported on window):
 *   initMondayBoard(containerId)
 *   addNewMondayTask(taskData)
 *   updateMondayTask(id, changes)
 *   deleteMondayTask(id)
 *   cycleTaskStatus(id)
 *   cycleTaskPriority(id)
 *   applyMondayRemoteUpdate(tasks)
 *   setMondayFilter(responsible)
 *   setMondayStatusFilter(status)
 */

(function () {
  'use strict';

  /* =========================================================
     CONSTANTS
  ========================================================= */

  const COLUMNS = [
    { id: 'todo',        label: 'Todo',          color: '#6366f1' },
    { id: 'in_progress', label: 'Em Progresso',  color: '#f59e0b' },
    { id: 'done',        label: 'Concluído',      color: '#22c55e' },
  ];

  const STATUS_CYCLE    = ['todo', 'in_progress', 'done'];
  const PRIORITY_CYCLE  = ['critical', 'high', 'medium'];

  const PRIORITY_META = {
    critical: { label: 'Crítico',  bg: 'bg-red-100',    text: 'text-red-700',    ring: 'ring-red-400'    },
    high:     { label: 'Alto',     bg: 'bg-amber-100',  text: 'text-amber-700',  ring: 'ring-amber-400'  },
    medium:   { label: 'Médio',    bg: 'bg-blue-100',   text: 'text-blue-700',   ring: 'ring-blue-400'   },
  };

  const RESPONSIBLE_META = {
    leonardo: { label: 'Leonardo', avatar: 'L', color: '#6366f1' },
    mayumi:   { label: 'Mayumi',   avatar: 'M', color: '#ec4899' },
    ambos:    { label: 'Ambos',    avatar: 'A', color: '#14b8a6' },
  };

  const COLUMN_HEADER_COLORS = {
    todo:        { bg: 'bg-indigo-50',  border: 'border-indigo-400', text: 'text-indigo-700'  },
    in_progress: { bg: 'bg-amber-50',   border: 'border-amber-400',  text: 'text-amber-700'   },
    done:        { bg: 'bg-green-50',   border: 'border-green-400',  text: 'text-green-700'   },
  };

  /* =========================================================
     MODULE STATE
  ========================================================= */

  let _containerId      = null;
  let _filterResponsible = 'all';
  let _filterStatus      = 'all';

  /* =========================================================
     HELPERS
  ========================================================= */

  /** Safe getter for the global task list */
  function _getTasks() {
    if (window.currentPlanState && Array.isArray(window.currentPlanState.mondayTasks)) {
      return window.currentPlanState.mondayTasks;
    }
    // Bootstrap if missing
    if (!window.currentPlanState) window.currentPlanState = {};
    if (!window.currentPlanState.mondayTasks) window.currentPlanState.mondayTasks = [];
    return window.currentPlanState.mondayTasks;
  }

  /** Broadcast change to collaborators */
  function _broadcast() {
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
      PlanRealtimeCollab.broadcastUpdate({ type: 'monday', payload: _getTasks() });
    }
  }

  /** Trigger auto-save */
  function _autoSave() {
    if (typeof window.triggerAutoSave === 'function') {
      triggerAutoSave();
    }
  }

  /** Escape HTML to prevent XSS */
  function _esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Get the next value in a cycle array */
  function _nextInCycle(arr, current) {
    const idx = arr.indexOf(current);
    return arr[(idx + 1) % arr.length];
  }

  /** Build initials / avatar letter from responsible key */
  function _avatarLetter(responsible) {
    const meta = RESPONSIBLE_META[responsible];
    return meta ? meta.avatar : (responsible ? responsible[0].toUpperCase() : '?');
  }

  /** Get container element by stored id */
  function _getContainer() {
    return _containerId ? document.getElementById(_containerId) : null;
  }

  /* =========================================================
     FILTER
  ========================================================= */

  function _applyFilters(tasks) {
    return tasks.filter((t) => {
      const matchResp   = _filterResponsible === 'all' || t.responsible === _filterResponsible;
      const matchStatus = _filterStatus      === 'all' || t.status      === _filterStatus;
      return matchResp && matchStatus;
    });
  }

  /* =========================================================
     RENDER
  ========================================================= */

  /** Master render – rebuilds the whole board UI */
  function _render() {
    const container = _getContainer();
    if (!container) return;
    container.innerHTML = _buildBoardHTML();
    _attachBoardEvents(container);
  }

  /** Build the full board HTML string */
  function _buildBoardHTML() {
    const tasks   = _getTasks();
    const visible = _applyFilters(tasks);

    return `
      <div class="monday-board flex flex-col gap-4 w-full h-full select-none">
        ${_buildFiltersHTML()}
        <div class="monday-columns flex gap-4 overflow-x-auto pb-4 flex-1">
          ${COLUMNS.map((col) => _buildColumnHTML(col, visible)).join('')}
        </div>
      </div>
    `;
  }

  /** Build filter bar HTML */
  function _buildFiltersHTML() {
    const respOptions = [
      { value: 'all',      label: 'Todos Responsáveis' },
      { value: 'leonardo', label: 'Leonardo' },
      { value: 'mayumi',   label: 'Mayumi' },
      { value: 'ambos',    label: 'Ambos' },
    ];
    const statusOptions = [
      { value: 'all',        label: 'Todos os Status' },
      { value: 'todo',       label: 'Todo' },
      { value: 'in_progress',label: 'Em Progresso' },
      { value: 'done',       label: 'Concluído' },
    ];

    const buildSelect = (id, options, current) =>
      `<select id="${id}" class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer">
        ${options.map((o) => `<option value="${_esc(o.value)}" ${o.value === current ? 'selected' : ''}>${_esc(o.label)}</option>`).join('')}
      </select>`;

    return `
      <div class="monday-filters flex flex-wrap items-center gap-3 px-1 pb-2 border-b border-gray-200">
        <span class="text-sm font-semibold text-gray-500 mr-1">🔍 Filtrar:</span>
        ${buildSelect('monday-filter-responsible', respOptions,   _filterResponsible)}
        ${buildSelect('monday-filter-status',      statusOptions, _filterStatus)}
        <button id="monday-filter-clear" class="text-xs text-indigo-500 hover:text-indigo-700 underline ml-2">Limpar filtros</button>
      </div>
    `;
  }

  /** Build a single column HTML */
  function _buildColumnHTML(col, visibleTasks) {
    const colTasks = visibleTasks.filter((t) => t.status === col.id);
    const cc       = COLUMN_HEADER_COLORS[col.id];

    return `
      <div
        class="monday-column flex flex-col rounded-2xl shadow-sm border border-gray-200 bg-gray-50 min-w-[300px] max-w-[340px] flex-1"
        data-column="${_esc(col.id)}"
      >
        <!-- Column header -->
        <div class="column-header flex items-center justify-between px-4 py-3 rounded-t-2xl ${cc.bg} border-b-2 ${cc.border}">
          <div class="flex items-center gap-2">
            <span class="font-bold text-base ${cc.text}">${_esc(col.label)}</span>
            <span class="text-xs font-semibold bg-white bg-opacity-70 px-2 py-0.5 rounded-full ${cc.text} shadow-sm">${colTasks.length}</span>
          </div>
        </div>

        <!-- Card list (drop zone) -->
        <div
          class="monday-card-list flex flex-col gap-3 p-3 flex-1 overflow-y-auto"
          data-drop-column="${_esc(col.id)}"
          style="min-height:80px; max-height: calc(100vh - 260px);"
        >
          ${colTasks.map((t) => _buildCardHTML(t)).join('')}
          ${colTasks.length === 0 ? `<div class="text-xs text-gray-400 text-center mt-4 mb-2 italic">Nenhuma tarefa</div>` : ''}
        </div>

        <!-- Add task button & inline form -->
        <div class="p-3 border-t border-gray-200">
          <button
            class="monday-add-btn w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 transition-colors duration-150"
            data-add-column="${_esc(col.id)}"
          >
            <span class="text-lg leading-none">+</span>
            <span>Adicionar Tarefa</span>
          </button>
          <!-- Inline add form (hidden by default) -->
          <div class="monday-add-form hidden mt-2" data-form-column="${_esc(col.id)}">
            ${_buildInlineFormHTML(col.id)}
          </div>
        </div>
      </div>
    `;
  }

  /** Build a single task card HTML */
  function _buildCardHTML(task) {
    const prMeta   = PRIORITY_META[task.priority] || PRIORITY_META.medium;
    const respMeta = RESPONSIBLE_META[task.responsible] || { avatar: '?', color: '#9ca3af', label: task.responsible };

    const notesId    = `notes-${_esc(task.id)}`;
    const hasNotes   = task.notes && task.notes.trim().length > 0;
    const hasPhase   = task.phase && task.phase.trim().length > 0;
    const hasDueDate = task.due_date && String(task.due_date).trim().length > 0;

    return `
      <div
        class="monday-card bg-white rounded-xl shadow-sm border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow duration-150 group"
        draggable="true"
        data-card-id="${_esc(task.id)}"
      >
        <!-- Title row -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="font-bold text-gray-800 text-sm leading-tight flex-1">${_esc(task.title)}</span>
          <!-- Delete button (visible on hover) -->
          <button
            class="monday-delete-btn opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 text-xs transition-opacity duration-150 shrink-0 mt-0.5"
            data-delete-id="${_esc(task.id)}"
            title="Excluir tarefa"
          >✕</button>
        </div>

        <!-- Priority & status badges -->
        <div class="flex flex-wrap gap-1.5 mb-2">
          <span
            class="monday-priority-badge text-xs font-semibold px-2 py-0.5 rounded-full ring-1 cursor-pointer select-none ${prMeta.bg} ${prMeta.text} ${prMeta.ring}"
            data-cycle-priority="${_esc(task.id)}"
            title="Clique para mudar prioridade"
          >${_esc(prMeta.label)}</span>
          <span
            class="monday-status-badge text-xs font-semibold px-2 py-0.5 rounded-full ring-1 cursor-pointer select-none bg-gray-100 text-gray-600 ring-gray-300"
            data-cycle-status="${_esc(task.id)}"
            title="Clique para mudar status"
          >${_esc(_statusLabel(task.status))}</span>
        </div>

        <!-- Responsible -->
        <div class="flex items-center gap-2 mb-1.5">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style="background-color:${_esc(respMeta.color)};"
            title="${_esc(respMeta.label)}"
          >${_esc(respMeta.avatar)}</div>
          <span class="text-xs text-gray-500">${_esc(respMeta.label)}</span>
        </div>

        <!-- Due date & phase -->
        <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400 mb-1">
          ${hasDueDate ? `<span title="Data de entrega">📅 ${typeof window.formatTaskDueDateDisplay === 'function' ? window.formatTaskDueDateDisplay(task.due_date) : _esc(task.due_date)}</span>` : ''}
          ${hasPhase   ? `<span title="Fase">🏷️ ${_esc(task.phase)}</span>`             : ''}
        </div>

        <!-- Notes (expandable) -->
        ${hasNotes ? `
          <div class="mt-1.5">
            <button
              class="monday-notes-toggle text-xs text-indigo-500 hover:text-indigo-700 underline"
              data-notes-target="${_esc(notesId)}"
            >Ver notas ▾</button>
            <div id="${_esc(notesId)}" class="hidden mt-1 text-xs text-gray-500 bg-gray-50 rounded p-2 border border-gray-100 whitespace-pre-line">${_esc(task.notes)}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /** Build the inline "add task" form HTML */
  function _buildInlineFormHTML(columnId) {
    return `
      <form class="monday-new-task-form flex flex-col gap-2 bg-white border border-indigo-200 rounded-xl p-3 shadow-sm" data-form-col="${_esc(columnId)}">
        <input
          name="title"
          type="text"
          placeholder="Título da tarefa *"
          required
          class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select name="responsible" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="leonardo">Leonardo</option>
          <option value="mayumi">Mayumi</option>
          <option value="ambos">Ambos</option>
        </select>
        <select name="priority" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="medium">Médio</option>
          <option value="high">Alto</option>
          <option value="critical">Crítico</option>
        </select>
        <input
          name="due_date"
          type="text"
          placeholder="Data de entrega (ex: 2026-10-01)"
          class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          name="phase"
          type="text"
          placeholder="Fase (ex: Fase 1)"
          class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          name="notes"
          placeholder="Notas (opcional)"
          rows="2"
          class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        ></textarea>
        <div class="flex gap-2">
          <button type="submit" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg py-1.5 transition-colors duration-150">Adicionar</button>
          <button type="button" class="monday-cancel-form flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg py-1.5 transition-colors duration-150">Cancelar</button>
        </div>
      </form>
    `;
  }

  /** Human-readable label for a status key */
  function _statusLabel(status) {
    const map = { todo: 'Todo', in_progress: 'Em Progresso', done: 'Concluído' };
    return map[status] || status;
  }

  /* =========================================================
     EVENT WIRING
  ========================================================= */

  /** Attach all event listeners after each render */
  function _attachBoardEvents(container) {
    // ── Filter dropdowns ────────────────────────────────────
    const filterResp = container.querySelector('#monday-filter-responsible');
    if (filterResp) {
      filterResp.addEventListener('change', (e) => {
        _filterResponsible = e.target.value;
        _render();
      });
    }

    const filterStatus = container.querySelector('#monday-filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        _filterStatus = e.target.value;
        _render();
      });
    }

    const clearBtn = container.querySelector('#monday-filter-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        _filterResponsible = 'all';
        _filterStatus      = 'all';
        _render();
      });
    }

    // ── Add task buttons ────────────────────────────────────
    container.querySelectorAll('.monday-add-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const colId = btn.dataset.addColumn;
        // Hide all other open forms first
        container.querySelectorAll('.monday-add-form').forEach((f) => f.classList.add('hidden'));
        container.querySelectorAll('.monday-add-btn').forEach((b) => b.classList.remove('hidden'));
        // Show this column's form
        const form = container.querySelector(`.monday-add-form[data-form-column="${colId}"]`);
        if (form) {
          form.classList.remove('hidden');
          btn.classList.add('hidden');
          // Focus first input
          const firstInput = form.querySelector('input, select, textarea');
          if (firstInput) firstInput.focus();
        }
      });
    });

    // ── Cancel form buttons ─────────────────────────────────
    container.querySelectorAll('.monday-cancel-form').forEach((btn) => {
      btn.addEventListener('click', () => {
        const form = btn.closest('.monday-add-form');
        if (form) {
          form.classList.add('hidden');
          const colId  = form.dataset.formColumn;
          const addBtn = container.querySelector(`.monday-add-btn[data-add-column="${colId}"]`);
          if (addBtn) addBtn.classList.remove('hidden');
        }
      });
    });

    // ── New task form submissions ───────────────────────────
    container.querySelectorAll('.monday-new-task-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const colId = form.dataset.formCol;
        const data  = new FormData(form);

        addNewMondayTask({
          title:       data.get('title'),
          responsible: data.get('responsible'),
          priority:    data.get('priority'),
          due_date:    data.get('due_date'),
          phase:       data.get('phase'),
          notes:       data.get('notes'),
          status:      colId,
        });
        // _render() is called inside addNewMondayTask
      });
    });

    // ── Delete buttons ──────────────────────────────────────
    container.querySelectorAll('.monday-delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.deleteId;
        if (id && confirm('Excluir esta tarefa?')) {
          deleteMondayTask(id);
        }
      });
    });

    // ── Priority cycle badges ───────────────────────────────
    container.querySelectorAll('[data-cycle-priority]').forEach((badge) => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleTaskPriority(badge.dataset.cyclePriority);
      });
    });

    // ── Status cycle badges ─────────────────────────────────
    container.querySelectorAll('[data-cycle-status]').forEach((badge) => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleTaskStatus(badge.dataset.cycleStatus);
      });
    });

    // ── Notes toggle ────────────────────────────────────────
    container.querySelectorAll('.monday-notes-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.dataset.notesTarget;
        const target   = document.getElementById(targetId);
        if (target) {
          const hidden = target.classList.toggle('hidden');
          btn.textContent = hidden ? 'Ver notas ▾' : 'Ocultar notas ▴';
        }
      });
    });

    // ── Click card to open edit modal ───────────────────────
    container.querySelectorAll('.monday-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button, [data-cycle-priority], [data-cycle-status], input, select, textarea, a')) {
          return;
        }
        const cardId = card.dataset.cardId;
        if (cardId && typeof window.openEditTaskModal === 'function') {
          window.openEditTaskModal(cardId);
        }
      });
    });

    // ── Drag-and-drop ────────────────────────────────────────
    _attachDragDrop(container);
  }

  /** Wire drag-and-drop listeners */
  function _attachDragDrop(container) {
    let draggedId = null;

    // Drag start – store task id
    container.querySelectorAll('.monday-card').forEach((card) => {
      card.addEventListener('dragstart', (e) => {
        draggedId = card.dataset.cardId;
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('opacity-50', 'ring-2', 'ring-indigo-400');
      });

      card.addEventListener('dragend', () => {
        draggedId = null;
        card.classList.remove('opacity-50', 'ring-2', 'ring-indigo-400');
        // Remove all drop-active highlights
        container.querySelectorAll('.monday-card-list').forEach((zone) => {
          zone.classList.remove('bg-indigo-50', 'ring-2', 'ring-inset', 'ring-indigo-300');
        });
      });
    });

    // Drop zones
    container.querySelectorAll('.monday-card-list').forEach((zone) => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('bg-indigo-50', 'ring-2', 'ring-inset', 'ring-indigo-300');
      });

      zone.addEventListener('dragleave', (e) => {
        // Only remove highlight if truly leaving the zone (not entering a child)
        if (!zone.contains(e.relatedTarget)) {
          zone.classList.remove('bg-indigo-50', 'ring-2', 'ring-inset', 'ring-indigo-300');
        }
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('bg-indigo-50', 'ring-2', 'ring-inset', 'ring-indigo-300');
        const newStatus = zone.dataset.dropColumn;
        if (draggedId && newStatus) {
          updateMondayTask(draggedId, { status: newStatus });
        }
        draggedId = null;
      });
    });
  }

  /* =========================================================
     PUBLIC API
  ========================================================= */

  /**
   * Initialize the Kanban board inside the given container element.
   * @param {string} containerId - ID of the DOM element to render into.
   */
  function initMondayBoard(containerId) {
    _containerId = containerId;
    _render();

    // Subscribe to remote updates
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.on === 'function') {
      PlanRealtimeCollab.on('monday', applyMondayRemoteUpdate);
    }
  }

  /** Find task and index by ID or numeric array index */
  function _findTask(idOrIdx) {
    const tasks = _getTasks();
    if (typeof idOrIdx === 'number' || (!isNaN(idOrIdx) && !String(idOrIdx).startsWith('task-'))) {
      const idx = Number(idOrIdx);
      if (tasks[idx]) return { task: tasks[idx], index: idx };
    }
    const idx = tasks.findIndex((t) => String(t.id) === String(idOrIdx));
    if (idx !== -1) return { task: tasks[idx], index: idx };
    return { task: null, index: -1 };
  }

  /** Notify both Monday Kanban board and Table view of changes */
  function _notifyMutation() {
    _render();
    if (typeof window.renderMondayBoard === 'function') {
      window.renderMondayBoard();
    }
    _broadcast();
    _autoSave();
  }

  /**
   * Add a new task to the board.
   * @param {Object} taskData - Task fields (title required).
   */
  function addNewMondayTask(taskData) {
    const tasks = _getTasks();
    const newTask = {
      id:          'task-' + Date.now(),
      title:       taskData.title       || 'Nova Tarefa',
      responsible: taskData.responsible || 'leonardo',
      priority:    taskData.priority    || 'medium',
      status:      taskData.status      || 'todo',
      due_date:    taskData.due_date    || '',
      phase:       taskData.phase       || '',
      notes:       taskData.notes       || '',
    };
    tasks.push(newTask);
    _notifyMutation();
  }

  /**
   * Update specific fields of an existing task by id or index.
   * @param {string|number} idOrIdx - Task ID or index.
   * @param {Object} changes - Key/value pairs to merge into the task.
   */
  function updateMondayTask(idOrIdx, changes) {
    const { task } = _findTask(idOrIdx);
    if (!task) return;
    Object.assign(task, changes);
    _notifyMutation();
  }

  /**
   * Remove a task from the board.
   * @param {string|number} idOrIdx - Task ID or index.
   */
  function deleteMondayTask(idOrIdx) {
    const { task, index } = _findTask(idOrIdx);
    if (index === -1) return;
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;
    const tasks = _getTasks();
    tasks.splice(index, 1);
    _notifyMutation();
  }

  /**
   * Cycle the task status: todo → in_progress → done → todo.
   * @param {string|number} idOrIdx - Task ID or index.
   */
  function cycleTaskStatus(idOrIdx) {
    const { task } = _findTask(idOrIdx);
    if (!task) return;
    task.status = _nextInCycle(STATUS_CYCLE, task.status);
    _notifyMutation();
  }

  /**
   * Cycle the task priority: critical → high → medium → critical.
   * @param {string|number} idOrIdx - Task ID or index.
   */
  function cycleTaskPriority(idOrIdx) {
    const { task } = _findTask(idOrIdx);
    if (!task) return;
    task.priority = _nextInCycle(PRIORITY_CYCLE, task.priority);
    _notifyMutation();
  }

  /**
   * Apply a remote update received via PlanRealtimeCollab.
   * Replaces the local task list entirely and re-renders.
   * @param {Array} tasks - Full remote task array.
   */
  function applyMondayRemoteUpdate(tasks) {
    if (!Array.isArray(tasks)) return;
    if (!window.currentPlanState) window.currentPlanState = {};
    window.currentPlanState.mondayTasks = tasks;
    _render();
  }

  /**
   * Set the responsible filter and re-render.
   * @param {string} value - 'all' | 'leonardo' | 'mayumi' | 'ambos'
   */
  function setMondayFilter(value) {
    _filterResponsible = value || 'all';
    _render();
  }

  /**
   * Set the status filter and re-render.
   * @param {string} value - 'all' | 'todo' | 'in_progress' | 'done'
   */
  function setMondayStatusFilter(value) {
    _filterStatus = value || 'all';
    _render();
  }

  /* =========================================================
     EXPORT TO WINDOW
  ========================================================= */

  window.initMondayBoard        = initMondayBoard;
  window.addNewMondayTask       = addNewMondayTask;
  window.updateMondayTask       = updateMondayTask;
  window.deleteMondayTask       = deleteMondayTask;
  window.cycleTaskStatus        = cycleTaskStatus;
  window.cycleTaskPriority      = cycleTaskPriority;
  window.applyMondayRemoteUpdate = applyMondayRemoteUpdate;
  window.setMondayFilter        = setMondayFilter;
  window.setMondayStatusFilter  = setMondayStatusFilter;

})();
