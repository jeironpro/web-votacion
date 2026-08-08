/**
 * Utilidades seguras de DOM. Toda creación de nodos usa estos helpers;
 * nunca se inyecta HTML como texto (sin innerHTML).
 */

/** Crea un elemento con clase, atributos, texto y/o hijos. El texto se
 * asigna con textContent para que el contenido sea siempre visible. */
export function el(tag, { className, attrs, text, children } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  }
  if (text != null) node.textContent = text;
  if (children) node.append(...children);
  return node;
}

/** Busca un elemento por su id, con error temprano si no existe. */
export function byId(id) {
  const node = document.getElementById(id);
  if (!node) {
    throw new Error(`Elemento con id "${id}" no encontrado`);
  }
  return node;
}

export function clear(node) {
  node.replaceChildren();
}