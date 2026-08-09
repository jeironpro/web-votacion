/**
 * Dominio de votos: un voto único por persona, modificable.
 * El contador de cada partido refleja los votos en curso.
 */

/**
 * Vota por un partido o retira el voto si ya se votó a ese partido.
 * Al cambiar de partido, el voto anterior se descuenta.
 * Devuelve un objeto descriptivo o null si el partido no existe.
 */
export function toggleVote(state, partyId) {
  const party = state.parties.find((p) => p.id === partyId);
  if (!party) return null;

  if (state.voteId === partyId) {
    party.votes = Math.max(0, party.votes - 1);
    state.voteId = null;
    return { action: 'unvote', party };
  }

  const previous = state.parties.find((p) => p.id === state.voteId);
  if (previous) {
    previous.votes = Math.max(0, previous.votes - 1);
  }

  party.votes += 1;
  state.voteId = partyId;
  return { action: previous ? 'move' : 'vote', party };
}