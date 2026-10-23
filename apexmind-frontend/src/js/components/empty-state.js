import { escapeHtml } from '../utils/dom.js';

/** Mensaje amigable cuando una lista no tiene resultados. `action` es HTML ya confiable (botón/enlace). */
export const emptyState = ({ icon, title, text, action = '' }) => `
  <div class="col-12">
    <div class="text-center py-5">
      <i class="bi ${icon} display-4 text-muted" aria-hidden="true"></i>
      <h2 class="h5 mt-3">${escapeHtml(title)}</h2>
      <p class="text-muted">${escapeHtml(text)}</p>
      ${action}
    </div>
  </div>`;
