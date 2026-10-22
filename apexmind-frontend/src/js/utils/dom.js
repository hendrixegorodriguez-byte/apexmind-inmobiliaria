const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa texto antes de insertarlo con innerHTML (previene XSS). */
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);

/** Delegación de eventos: un solo listener en el contenedor en vez de uno por elemento o un onclick inline. */
export function delegate(root, eventName, selector, handler) {
  root.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && root.contains(target)) handler(event, target);
  });
}

/** Genera <option> a partir de una lista. `placeholder` crea la opción vacía ("Todos..."). */
export function selectOptions(items, selected = '', placeholder = '') {
  const first = placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : '';
  return first + items
    .map((item) => `<option value="${escapeHtml(item)}"${item === selected ? ' selected' : ''}>${escapeHtml(item)}</option>`)
    .join('');
}
