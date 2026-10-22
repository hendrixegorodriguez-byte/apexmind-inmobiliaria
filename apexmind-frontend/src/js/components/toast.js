import { escapeHtml } from '../utils/dom.js';

const ICONS = {
  success: 'bi-check-circle-fill',
  info: 'bi-info-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  danger: 'bi-exclamation-octagon-fill',
};

/** Notificación no bloqueante (reemplaza alert()). variant: success | info | warning | danger */
export function showToast(message, variant = 'success') {
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${variant} border-0`;
  el.setAttribute('role', variant === 'danger' ? 'alert' : 'status');
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body"><i class="bi ${ICONS[variant]} me-2"></i>${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>`;
  document.getElementById('toast-container').append(el);
  el.addEventListener('hidden.bs.toast', () => el.remove());
  new window.bootstrap.Toast(el, { delay: 3500 }).show();
}
