/** Diálogo de confirmación (reemplaza confirm()). Devuelve una promesa: true si se confirmó. */
export function confirmDialog({ title, message, confirmLabel = 'Confirmar' }) {
  const el = document.getElementById('confirm-modal');
  const confirmButton = el.querySelector('[data-slot="confirm"]');
  el.querySelector('[data-slot="title"]').textContent = title;
  el.querySelector('[data-slot="message"]').textContent = message;
  confirmButton.textContent = confirmLabel;

  const modal = window.bootstrap.Modal.getOrCreateInstance(el);
  return new Promise((resolve) => {
    const listeners = new AbortController();
    let confirmed = false;
    confirmButton.addEventListener('click', () => { confirmed = true; modal.hide(); }, { signal: listeners.signal });
    el.addEventListener('hidden.bs.modal', () => { listeners.abort(); resolve(confirmed); }, { once: true });
    modal.show();
  });
}
