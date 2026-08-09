/**
 * Toast minimal: avisos de error y acciones reversibles (deshacer).
 * El éxito visible es silencioso: aquí solo llegan fallos y deshaceres.
 */

let root = null;
let hideTimer = null;

export function initToast() {
  root = document.getElementById('toast');
}

function hide() {
  clearTimeout(hideTimer);
  if (root) {
    root.hidden = true;
    root.replaceChildren();
  }
}

/**
 * Muestra un aviso.
 * @param {string} message  texto del aviso
 * @param {string} [tone]   'error' (por defecto) o 'info'
 * @param {{label: string, run: Function}|null} [action]  botón extra (deshacer)
 */
export function showToast({ message, tone = 'error', action = null } = {}) {
  if (!root) return;

  root.classList.toggle('toast--error', tone === 'error');
  root.replaceChildren();

  const msg = document.createElement('span');
  msg.className = 'toast__msg';
  msg.textContent = message;
  root.append(msg);

  if (action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast__action';
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      action.run();
      hide();
    });
    root.append(btn);
  }

  root.hidden = false;
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hide, 6000);
}