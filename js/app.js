/**
 * La Papeleta · punto de entrada.
 * Entrega actual: padrón (alta y baja de partidos) + persistencia local.
 * El escrutinio (votos, barras y ganador) llega en la siguiente entrega.
 */
import { loadState, saveState } from './services/storage.js';
import { el, byId, clear } from './utils/dom.js';
import { initToast, showToast } from './utils/toast.js';
import {
  partyRules,
  validatePartyInput,
  addParty,
  removeParty,
  changePartyColor,
  normalizeColor,
} from './modules/parties.js';

const state = loadState();

/** Devuelve el valor CSS de --chip: variable de paleta o hex directo. */
function chipOf(color) {
  return isHex(color) ? color : `var(${color})`;
}

function isHex(value) {
  return typeof value === 'string' && value.startsWith('#');
}

function defaultHex(color) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? normalizeColor(color) : '#666666';
}

/* — Referencias al DOM — */
const form = byId('party-form');
const nameInput = byId('party-name');
const nameHelper = byId('party-name-helper');
const swatchesBox = byId('swatches');
const roster = byId('roster');
const partyList = byId('party-list');
const tallyParties = byId('tally-parties');
const tallyVotes = byId('tally-votes');
const tallyMine = byId('tally-mine');
const openBtn = byId('open-sidebar');
const closeBtn = byId('close-sidebar');
const scrim = byId('scrim');
const sidebar = byId('sidebar');

/* — Paleta de campaña (radios convertidos en sellos) + picker libre — */
let customPickerColor = null;

function renderSwatches() {
  clear(swatchesBox);
  partyRules.palette.forEach((color, index) => {
    const label = el('label', { className: 'swatch-label' });
    const input = el('input', {
      className: 'swatch-input',
      attrs: {
        type: 'radio',
        name: 'color',
        value: color.token,
        'aria-label': color.name,
      },
    });
    if (index === 0 && customPickerColor === null) input.checked = true;
    const swatch = el('span', { className: 'swatch' });
    swatch.style.setProperty('--chip', chipOf(color.token));
    label.append(input, swatch);
    swatchesBox.append(label);
  });

  const pickerLabel = el('label', { className: 'swatch-label' });
  const picker = el('input', {
    className: 'swatch-input',
    attrs: { type: 'color', name: 'color-custom', 'aria-label': 'Color personalizado' },
  });
  picker.value = customPickerColor || '#8a4f7d';
  const pickerSwatch = el('span', { className: 'swatch' });
  pickerSwatch.style.setProperty('--chip', picker.value);
  pickerLabel.append(picker, pickerSwatch);
  swatchesBox.append(pickerLabel);
}

function partyChip(token) {
  const node = el('span', { className: 'party__chip' });
  node.style.setProperty('--chip', chipOf(token));
  return node;
}

/* — Selector de color de campaña para un partido ya inscrito — */
function colorPicker(id, color) {
  const details = el('details', { className: 'roster-color' });
  const trigger = el('summary', { className: 'roster-color__trigger' });
  trigger.style.setProperty('--chip', chipOf(color));
  trigger.setAttribute('aria-label', 'Cambiar color');
  const swatches = el('span', { className: 'roster-color__swatches' });
  for (const c of partyRules.palette) {
    const swatch = el('button', {
      className: c.token === color ? 'roster-color__swatch is-active' : 'roster-color__swatch',
      attrs: { type: 'button', 'aria-label': c.name, title: c.name },
    });
    swatch.style.setProperty('--chip', chipOf(c.token));
    swatch.dataset.action = 'repaint';
    swatch.dataset.id = id;
    swatch.dataset.color = c.token;
    swatches.append(swatch);
  }

  const picker = el('input', {
    className: 'roster-color__picker',
    attrs: { type: 'color', 'aria-label': 'Color personalizado', value: defaultHex(color) },
  });
  picker.dataset.action = 'repaint-custom';
  picker.dataset.id = id;
  swatches.append(picker);

  details.append(trigger, swatches);
  return details;
}

/* — Patrón (listado de inscritos) — */
function renderRoster() {
  clear(roster);
  if (state.parties.length === 0) {
    roster.append(el('li', { className: 'roster__empty', text: 'El padrón está vacío.' }));
    return;
  }

  for (const p of state.parties) {
    const del = el('button', {
      className: 'roster__delete',
      attrs: { type: 'button', 'aria-label': `Retirar ${p.name} del padrón` },
      text: '×',
    });
    del.dataset.id = p.id;

    roster.append(
      el('li', {
        className: 'roster__item',
        children: [
          colorPicker(p.id, p.color),
          el('span', { className: 'roster__name', text: p.name }),
          el('span', { className: 'roster__votes tabular', text: `${p.votes}` }),
          del,
        ],
      }),
    );
  }
}

/* — Papeleta: presencia de partidos (el escrutinio llega en la próxima entrega) — */
function renderBallot() {
  clear(partyList);
  if (state.parties.length === 0) {
    partyList.append(
      el('div', {
        className: 'ballot__empty',
        children: [
          el('p', { className: 'ballot__empty-title', text: 'Aún no hay partidos en liza.' }),
          el('p', { className: 'ballot__empty-copy', text: 'Inscribe el primero desde el padrón, a la derecha.' }),
        ],
      }),
    );
    return;
  }

  const sorted = [...state.parties].sort((a, b) => a.name.localeCompare(b.name, 'es'));

  for (const [index, p] of sorted.entries()) {
    const rank = el('span', {
      className: 'party__rank tabular',
      text: String(index + 1).padStart(2, '0'),
    });
    const namegroup = el('div', {
      className: 'party__namegroup',
      children: [partyChip(p.color), el('h3', { className: 'party__name', text: p.name })],
    });
    const tally = el('span', {
      className: 'party__tally tabular',
      text: `${p.votes} votos`,
    });
    partyList.append(el('article', { className: 'party', children: [rank, namegroup, tally] }));
  }
}

/* — Resumen del escrutinio — */
function renderTally() {
  const total = state.parties.reduce((acc, p) => acc + p.votes, 0);
  tallyParties.textContent = String(state.parties.length);
  tallyVotes.textContent = String(total);
  const voted = state.parties.find((p) => p.id === state.voteId);
  tallyMine.textContent = voted ? voted.name : '—';
}

function renderAll() {
  renderRoster();
  renderBallot();
  renderTally();
}

/* — Cajón del padrón (móvil) — */
function openSidebar() {
  sidebar.classList.add('is-open');
  document.body.classList.add('body-sidebar-open');
  openBtn.setAttribute('aria-expanded', 'true');
  nameInput.focus();
}

function closeSidebar() {
  sidebar.classList.remove('is-open');
  document.body.classList.remove('body-sidebar-open');
  openBtn.setAttribute('aria-expanded', 'false');
  openBtn.focus();
}

openBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
scrim.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

/* — Alta de partidos — */
function setError(message) {
  nameHelper.textContent = message;
  nameHelper.classList.add('field__helper--error');
  nameInput.setAttribute('aria-invalid', 'true');
}

function clearError() {
  nameHelper.textContent = 'Entre 1 y 40 caracteres.';
  nameHelper.classList.remove('field__helper--error');
  nameInput.removeAttribute('aria-invalid');
}

nameInput.addEventListener('input', () => {
  if (nameInput.hasAttribute('aria-invalid')) clearError();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const color = customPickerColor
    ?? swatchesBox.querySelector('input[name="color"]:checked')?.value
    ?? partyRules.palette[0].token;
  const result = validatePartyInput(state, { name: nameInput.value, color });

  if (result.error) {
    setError(result.error);
    nameInput.focus();
    return;
  }

  clearError();
  addParty(state, { name: result.name, color: result.color });
  saveState(state);
  form.reset();
  customPickerColor = null;
  renderSwatches();
  renderAll();
});

/* — Paleta: al tocar el picker custom se deseleccionan los sellos y viceversa — */
swatchesBox.addEventListener('input', (e) => {
  const target = e.target;
  if (target.matches('input[name="color-custom"]')) {
    customPickerColor = target.value;
    const sync = swatchesBox.querySelector('input[name="color-custom"]').parentElement
      .querySelector('.swatch');
    sync.style.setProperty('--chip', target.value);
    swatchesBox.querySelectorAll('input[name="color"]').forEach((r) => {
      r.checked = false;
    });
    swatchesBox.querySelectorAll('.swatch-input').forEach((i) => i.classList.remove('is-success'));
    target.classList.add('is-success');
  }
});

swatchesBox.addEventListener('change', (e) => {
  if (e.target.matches('input[name="color"]')) {
    customPickerColor = null;
    swatchesBox.querySelectorAll('.swatch-input').forEach((i) => i.classList.remove('is-success'));
    const custom = swatchesBox.querySelector('input[name="color-custom"]');
    if (custom) custom.classList.remove('is-success');
  }
});

/* — Baja de partidos (optimista, con deshacer) y cambio de color — */
roster.addEventListener('click', (e) => {
  const repaint = e.target.closest('[data-action="repaint"]');
  if (repaint) {
    const changed = changePartyColor(state, repaint.dataset.id, repaint.dataset.color);
    if (!changed) return;
    saveState(state);
    renderAll();
    return;
  }

  const btn = e.target.closest('.roster__delete');
  if (!btn) return;
  const removed = removeParty(state, btn.dataset.id);
  if (!removed) return;
  saveState(state);
  renderAll();
  showToast({
    message: `«${removed.name}» retirado del padrón.`,
    tone: 'info',
    action: {
      label: 'Deshacer',
      run: () => {
        state.parties.push(removed);
        saveState(state);
        renderAll();
      },
    },
  });
});

/* — Color personalizado de un partido ya inscrito (input nativo) — */
roster.addEventListener('input', (e) => {
  const target = e.target.closest('.roster-color__picker');
  if (!target) return;
  const changed = changePartyColor(state, target.dataset.id, target.value);
  if (!changed) return;
  saveState(state);
  renderAll();
});

/* — Arranque — */
initToast();
renderSwatches();
renderAll();
document.documentElement.dataset.ready = 'true';