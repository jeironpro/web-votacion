/**
 * Dominio de partidos: paleta de campaña, validación y alta/baja.
 * La lista de votos pertenece al dominio de votos (votes.js).
 */
import { uid } from '../utils/id.js';

const PALETTE = Object.freeze([
  { token: '--party-rojo', name: 'Rojo' },
  { token: '--party-verde', name: 'Verde' },
  { token: '--party-azul', name: 'Azul' },
  { token: '--party-ambar', name: 'Ámbar' },
  { token: '--party-violeta', name: 'Violeta' },
  { token: '--party-cian', name: 'Cian' },
  { token: '--party-rosa', name: 'Rosa' },
  { token: '--party-naranja', name: 'Naranja' },
  { token: '--party-verdemar', name: 'Verde mar' },
  { token: '--party-vino', name: 'Rojo vino' },
]);

const MAX_NAME_LENGTH = 40;

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function normalizeName(name) {
  return name.replace(/\s+/g, ' ').trim();
}

function isDuplicate(state, name) {
  const wanted = name.toLocaleLowerCase('es');
  return state.parties.some(
    (p) => p.name.toLocaleLowerCase('es') === wanted,
  );
}

function isPaletteToken(token) {
  return PALETTE.some((c) => c.token === token);
}

/** Un color es válido si es de la paleta o un hex (#rgb / #rrggbb). */
function isColor(value) {
  return typeof value === 'string' && (isPaletteToken(value) || HEX_RE.test(value));
}

/** Normaliza un color a token de paleta o a hex de 6 dígitos en minúsculas. */
export function normalizeColor(value) {
  if (!isColor(value)) return null;
  if (isPaletteToken(value)) return value;
  const hex = value.toLowerCase();
  return hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
}

/** Valida los datos de un partido nuevo. Devuelve { error } o { name, color }. */
export function validatePartyInput(state, { name, color }) {
  const cleaned = normalizeName(name);
  if (!cleaned) {
    return { error: 'Escribe un nombre para el partido.' };
  }
  if (cleaned.length > MAX_NAME_LENGTH) {
    return { error: `El nombre no puede pasar de ${MAX_NAME_LENGTH} caracteres.` };
  }
  const normalizedColor = normalizeColor(color);
  if (!normalizedColor) {
    return { error: 'Elige un color de campaña válido.' };
  }
  if (isDuplicate(state, cleaned)) {
    return { error: 'Ese partido ya está inscrito.' };
  }
  return { name: cleaned, color: normalizedColor };
}

/** Añade un partido al estado y lo devuelve. No valida (usa validateParty antes). */
export function addParty(state, { name, color }) {
  const party = { id: uid(), name, color, votes: 0 };
  state.parties.push(party);
  return party;
}

/** Retira un partido del estado y lo devuelve (para poder deshacerlo). */
export function removeParty(state, id) {
  const index = state.parties.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const [removed] = state.parties.splice(index, 1);
  if (state.voteId === id) state.voteId = null;
  return removed;
}

/** Cambia el color de campaña de un partido ya inscrito. */
export function changePartyColor(state, id, value) {
  const color = normalizeColor(value);
  if (!color) return null;
  const party = state.parties.find((p) => p.id === id);
  if (!party) return null;
  party.color = color;
  return party;
}

export function hasDuplicate(state, name) {
  return isDuplicate(state, normalizeName(name));
}

export const partyRules = {
  maxLength: MAX_NAME_LENGTH,
  palette: PALETTE,
};