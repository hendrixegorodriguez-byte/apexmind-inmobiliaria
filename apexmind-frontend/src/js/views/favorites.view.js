import { emptyState } from '../components/empty-state.js';
import { bindPropertyCards, propertyCard } from '../components/property-card.js';
import { ROUTES } from '../config/constants.js';
import { isFavorite } from '../services/favorites.service.js';
import { listProperties } from '../services/properties.service.js';

const emptyFavorites = () =>
  emptyState({
    icon: 'bi-heart',
    title: 'Aún no tienes favoritos',
    text: 'Toca el corazón de una propiedad para guardarla aquí.',
    action: `<a class="btn btn-gold btn-sm" href="#${ROUTES.CATALOG}">Explorar catálogo</a>`,
  });

export const favoritesView = {
  title: 'Mis favoritos',

  async render() {
    const favorites = (await listProperties()).filter((p) => isFavorite(p.id));
    return `
    <div class="container py-5">
      <h1 class="h3 fw-bold mb-4">Mis favoritos</h1>
      <div class="row g-4" id="favorites-grid">${favorites.length ? favorites.map(propertyCard).join('') : emptyFavorites()}</div>
    </div>`;
  },

  mount(root) {
    const grid = root.querySelector('#favorites-grid');
    bindPropertyCards(root, {
      onFavoriteChange: (_id, added, button) => {
        if (added) return;
        button.closest('.col-md-6').remove(); // quita la tarjeta al instante, sin recargar
        if (!grid.querySelector('.property-card')) grid.innerHTML = emptyFavorites();
      },
    });
  },
};
