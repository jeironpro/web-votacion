/** Genera un identificador único por partido. */
export function uid() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ?? `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}