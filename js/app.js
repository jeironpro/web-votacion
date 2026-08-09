/**
 * La Papeleta · punto de entrada.
 * Gestiona el estado, los eventos y el arranque; la pintura de la interfaz
 * vive en modules/render.js y la lógica de dominio en modules/*.js.
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
} from './modules/parties.js';
import { toggleVote } from './modules/votes.js';
import {
  chipOf,
  campaignColorPicker,
  renderRoster,
  renderBallot,
  renderTally,
  renderBureau,
} from './modules/render.js';

const state = loadState();

/* — Referencias al DOM — */
const form = byId('party-form');
const nameInput = byId('party-name');
const nameHelper = byId('party-name-helper');
const swatchesBox = byId('swatches');
const roster = byId('roster');
const partyList = byId('party-list');
const bureau = byId('bureau');
const openBtn = byId('open-sidebar');
const closeBtn = byId('close-sidebar');
const scrim = byId('scrim');
const sidebar = byId('sidebar');

const tallyProjectors = {
  parties: byId('tally-parties'),
  votes: byId('tally-votes'),
  mine: byId('tally-mine'),
};

const bureauProjectors = {
  who: byId('bureau-who'),
  note: byId('bureau-note'),
};

/* — Paleta de campaña (radios convertidos en sellos) + color a elección — */
const DEFAULT_TOKEN = partyRules.palette[0].token;
let customPickerColor = null;

function renderSwatches() {
  clear(swatchesBox);
  partyRules.palette.forEach((color) => {
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
    input.checked = customPickerColor === null && color.token === DEFAULT_TOKEN;
    const swatch = el('span', { className: 'swatch' });
    swatch.style.setProperty('--chip', chipOf(color.token));
    label.append(input, swatch);
    swatchesBox.append(label);
  });

  swatchesBox.append(campaignColorPicker({ value: customPickerColor || '#8a4f7d' }));
}

/* Marca el color elegido libre: recuerda, pinta el trigger y desmarca los sellos. */
function markCustomColor(value) {
  customPickerColor = value;
  const custom = swatchesBox.querySelector('.swatch-custom__trigger');
  if (custom) custom.style.setProperty('--chip', chipOf(value));
  swatchesBox.querySelectorAll('input[name="color"]').forEach((r) => {
    r.checked = false;
  });
}

/* — Pintado completo — */
function renderAll() {
  renderRoster(roster, state.parties);
  renderBallot(partyList, state);
  renderTally(tallyProjectors, state);
  renderBureau(bureau, bureauProjectors, state);
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
  nameHelper.textContent = `Entre 1 y ${partyRules.maxLength} caracteres.`;
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
    ?? DEFAULT_TOKEN;
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

/* — Paleta: selección de sello o color a elección (popup propio) — */
swatchesBox.addEventListener('change', (e) => {
  if (e.target.matches('input[name="color"]')) customPickerColor = null;
});

swatchesBox.addEventListener('click', (e) => {
  const pick = e.target.closest('[data-action="custom-color"]');
  if (!pick) return;
  markCustomColor(pick.dataset.color);
  pick.closest('details').removeAttribute('open');
});

swatchesBox.addEventListener('input', (e) => {
  const pick = e.target.closest('[data-action="custom-color-lib"]');
  if (!pick) return;
  markCustomColor(pick.value);
});

/* — Voto (delegación en la papeleta) — */
partyList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="vote"]');
  if (!btn) return;
  const result = toggleVote(state, btn.dataset.id);
  if (!result) return;
  saveState(state);
  renderAll();
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
nameInput.maxLength = partyRules.maxLength;
renderSwatches();
renderAll();
document.documentElement.dataset.ready = 'true';