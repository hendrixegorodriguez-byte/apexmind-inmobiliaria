import { PROPERTY_STATUS, STATUS_LABELS } from '../config/constants.js';
import { isFavorite, toggleFavorite } from '../services/favorites.service.js';
import { delegate, escapeHtml } from '../utils/dom.js';
import { formatArea, formatPrice } from '../utils/format.js';
import { showToast } from './toast.js';

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="440"><rect width="100%" height="100%" fill="#e2e8f0"/></svg>',
)}`;

/** HTML de una tarjeta (columna incluida). Todo dato dinámico pasa por escapeHtml. */
export function propertyCard(property) {
  const sold = property.status === PROPERTY_STATUS.SOLD;
  const favorite = isFavorite(property.id);
  const title = escapeHtml(property.title);
  return `
  <div class="col-md-6 col-lg-4">
    <article class="property-card${sold ? ' is-sold' : ''}">
      <div class="property-card__media">
        <span class="property-card__badge${sold ? ' is-sold' : ''}">${STATUS_LABELS[property.status]}</span>
        <button type="button" class="property-card__fav${favorite ? ' is-active' : ''}"
                data-action="toggle-favorite" data-id="${property.id}" aria-pressed="${favorite}"
                aria-label="Favorito: ${title}">
          <i class="bi ${favorite ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i>
        </button>
        <img src="${escapeHtml(property.image)}" alt="${title}" width="800" height="440" loading="lazy">
      </div>
      <div class="property-card__body">
        <h3 class="property-card__title text-truncate">${title}</h3>
        <p class="text-muted small mb-2"><i class="bi bi-geo-alt" aria-hidden="true"></i> ${escapeHtml(property.municipality)} · ${escapeHtml(property.type)}</p>
        <ul class="property-card__specs list-unstyled">
          <li><i class="bi bi-door-closed" aria-hidden="true"></i> ${property.bedrooms} hab.</li>
          <li><i class="bi bi-droplet" aria-hidden="true"></i> ${property.bathrooms} baños</li>
          <li><i class="bi bi-rulers" aria-hidden="true"></i> ${formatArea(property.area)}</li>
        </ul>
        <p class="property-card__price">${formatPrice(property.price)}</p>
      </div>
    </article>
  </div>`;
}

/**
 * Activa las interacciones de las tarjetas dentro de `root` (favorito + imagen de respaldo).
 * `onFavoriteChange(id, isNowFavorite, button)` permite a cada vista reaccionar.
 */
export function bindPropertyCards(root, { onFavoriteChange } = {}) {
  delegate(root, 'click', '[data-action="toggle-favorite"]', (_event, button) => {
    const id = Number(button.dataset.id);
    const added = toggleFavorite(id);
    button.classList.toggle('is-active', added);
    button.setAttribute('aria-pressed', String(added));
    button.firstElementChild.className = `bi ${added ? 'bi-heart-fill' : 'bi-heart'}`;
    showToast(added ? 'Añadido a favoritos' : 'Eliminado de favoritos', added ? 'success' : 'info');
    onFavoriteChange?.(id, added, button);
  });

  // 'error' no burbujea: se captura en la fase de captura.
  root.addEventListener('error', (event) => {
    const img = event.target;
    if (img.matches?.('.property-card__media img') && img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
  }, true);
}
