/**
 * Persistencia del estado de la votación en localStorage.
 * El estado es: { version, parties: [{ id, name, color, votes }], voteId }
 */
const STORAGE_KEY = 'lapapeleta:estado:v1';
const STATE_VERSION = 1;

function defaultState() {
  return {
    version: STATE_VERSION,
    parties: [],
    voteId: null,
  };
}

function isSane(state) {
  if (!state || typeof state !== 'object') return false;
  if (state.version !== STATE_VERSION) return false;
  if (!Array.isArray(state.parties)) return false;
  return true;
}

/** Carga el estado guardado; si no existe o está corrupto, devuelve uno nuevo. */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const state = JSON.parse(raw);
    return isSane(state) ? state : defaultState();
  } catch {
    return defaultState();
  }
}

/** Clona el estado para no compartir referencias con la respuesta de carga. */
export function cloneState(state) {
  return {
    version: STATE_VERSION,
    parties: state.parties.map((p) => ({ ...p })),
    voteId: state.voteId,
  };
}

/** Guarda el estado completo. Los errores se tratan en silencio: los datos son
 * locales y cada recarga conserva el último estado íntegro. */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible o lleno: nada que hacer */
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStorageKey() {
  return STORAGE_KEY;
}