/**
 * Pintura de la interfaz: padrón, papeleta y escrutinio.
 * Las plantillas reciben la raíz y el estado; nada se guarda aquí.
 */
import { el, clear } from '../utils/dom.js';
import { partyRules, normalizeColor } from './parties.js';

/* — Colores de campaña como --chip: variable de paleta o hex directo — */
function isHex(value) {
  return typeof value === 'string' && value.startsWith('#');
}

export function chipOf(color) {
  return isHex(color) ? color : `var(${color})`;
}

function defaultHex(color) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? normalizeColor(color) : '#666666';
}

function partyChip(token) {
  const node = el('span', { className: 'party__chip' });
  node.style.setProperty('--chip', chipOf(token));
  return node;
}

/* — Selector de color de campaña para un partido ya inscrito — */
function colorPicker(id, color) {
  return campaignColorPicker({ id, value: color, action: 'repaint', customAction: 'repaint-custom' });
}

/* — Selector de color a elección (padrón y alta de partidos): popup propio
   anclado al contenedor posicionado (el sidebar), centrado en él. — */
export function campaignColorPicker({ id, value, action = 'custom-color', customAction = 'custom-color-lib' }) {
  const details = el('details', { className: 'roster-color swatch-custom' });
  const trigger = el('summary', { className: 'roster-color__trigger swatch-custom__trigger' });
  trigger.style.setProperty('--chip', chipOf(value));
  trigger.setAttribute('aria-label', 'Elegir color');
  const swatches = el('span', { className: 'roster-color__swatches' });
  for (const c of partyRules.palette) {
    const swatch = el('button', {
      className: c.token === value ? 'roster-color__swatch is-active' : 'roster-color__swatch',
      attrs: { type: 'button', 'aria-label': c.name, title: c.name },
    });
    swatch.style.setProperty('--chip', chipOf(c.token));
    swatch.dataset.action = action;
    swatch.dataset.id = id ?? '';
    swatch.dataset.color = c.token;
    swatches.append(swatch);
  }

  const picker = el('input', {
    className: 'roster-color__picker',
    attrs: { type: 'color', 'aria-label': 'Color libre', value: defaultHex(value) },
  });
  picker.dataset.action = customAction;
  picker.dataset.id = id ?? '';
  swatches.append(picker);

  details.append(trigger, swatches);
  return details;
}

/* — Padrón (listado de inscritos) — */
export function renderRoster(root, parties) {
  clear(root);
  if (parties.length === 0) {
    root.append(el('li', { className: 'roster__empty', text: 'El padrón está vacío.' }));
    return;
  }

  for (const p of parties) {
    const del = el('button', {
      className: 'roster__delete',
      attrs: { type: 'button', 'aria-label': `Retirar ${p.name} del padrón` },
      text: '×',
    });
    del.dataset.id = p.id;

    root.append(
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

/* — Cálculos del escrutinio — */
function totalVotes(parties) {
  return parties.reduce((acc, p) => acc + p.votes, 0);
}

/** Devuelve el id del líder único, o null si no hay total o si hay empate. */
function leaderId(parties) {
  const max = Math.max(0, ...parties.map((p) => p.votes));
  if (max === 0) return null;
  const leaders = parties.filter((p) => p.votes === max);
  return leaders.length === 1 ? leaders[0].id : null;
}

/* — Papeleta: ranking vivo con barras y botón de voto — */
export function renderBallot(root, state) {
  clear(root);
  if (state.parties.length === 0) {
    root.append(
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

  const total = totalVotes(state.parties);
  const lead = leaderId(state.parties);
  const sorted = [...state.parties].sort(
    (a, b) => b.votes - a.votes || a.name.localeCompare(b.name, 'es'),
  );

  for (const [index, p] of sorted.entries()) {
    const isLeader = p.id === lead;
    const rank = el('span', {
      className: 'party__rank tabular',
      text: String(index + 1).padStart(2, '0'),
    });

    const namegroupChildren = [partyChip(p.color), el('h3', { className: 'party__name', text: p.name })];
    if (isLeader) {
      namegroupChildren.push(el('span', { className: 'party__lead', text: 'Va en cabeza' }));
    }
    const namegroup = el('div', { className: 'party__namegroup', children: namegroupChildren });

    const tally = el('span', {
      className: 'party__tally tabular',
      children: [
        el('span', { className: 'party__count', text: String(p.votes) }),
        el('span', { className: 'party__unit', text: ` ${p.votes === 1 ? 'voto' : 'votos'}${total ? ` · ${Math.round((p.votes / total) * 100)}%` : ''}` }),
      ],
    });

    const voteBtn = el('button', {
      className: `btn btn--ghost btn--compact party__vote${p.id === state.voteId ? ' is-voted' : ''}`,
      attrs: {
        type: 'button',
        'aria-pressed': p.id === state.voteId,
      },
      text: p.id === state.voteId ? 'Tu voto' : 'Votar',
    });
    voteBtn.dataset.action = 'vote';
    voteBtn.dataset.id = p.id;
    const act = el('div', { className: 'party__act', children: [voteBtn] });

    const bar = el('div', { className: 'party__bar' });
    const fill = el('span', { className: 'party__bar-fill' });
    fill.style.setProperty('--pct', String(total ? p.votes / total : 0));
    bar.append(fill);

    root.append(
      el('article', {
        className: isLeader ? 'party party--leader' : 'party',
        children: [rank, namegroup, tally, act, bar],
      }),
    );
  }
}

/* — Resumen del escrutinio — */
export function renderTally(projectors, state) {
  const total = totalVotes(state.parties);
  projectors.parties.textContent = String(state.parties.length);
  projectors.votes.textContent = String(total);
  const voted = state.parties.find((p) => p.id === state.voteId);
  projectors.mine.textContent = voted ? voted.name : '—';
}

/* — Cabecera de la mesa: quién va en cabeza — */
export function renderBureau(root, projectors, state) {
  const total = totalVotes(state.parties);
  const lead = leaderId(state.parties);
  if (total === 0 || !lead) {
    root.hidden = true;
    return;
  }

  const leader = state.parties.find((p) => p.id === lead);
  projectors.who.textContent = leader.name;
  projectors.note.textContent = `${leader.votes} ${leader.votes === 1 ? 'voto' : 'votos'} hasta ahora.`;
  root.hidden = false;
}