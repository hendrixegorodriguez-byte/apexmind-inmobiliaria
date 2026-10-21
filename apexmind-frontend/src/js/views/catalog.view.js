import { emptyState } from '../components/empty-state.js';
import { bindPropertyCards, propertyCard } from '../components/property-card.js';
import { MUNICIPALITIES, PROPERTY_TYPES, ROUTES } from '../config/constants.js';
import { buildHash } from '../router/router.js';
import { listProperties } from '../services/properties.service.js';
import { selectOptions } from '../utils/dom.js';

const pickFilters = ({ municipality = '', type = '' } = {}) => ({
  municipality: MUNICIPALITIES.includes(municipality) ? municipality : '',
  type: PROPERTY_TYPES.includes(type) ? type : '',
});

const countLabel = (n) => `${n} ${n === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;

const gridContent = (list) =>
  list.length
    ? list.map(propertyCard).join('')
    : emptyState({
        icon: 'bi-search',
        title: 'Sin resultados',
        text: 'No hay propiedades con esos filtros. Prueba con otro municipio o tipo.',
        action: '<button type="button" class="btn btn-outline-dark btn-sm" data-action="clear-filters">Limpiar filtros</button>',
      });

export const catalogView = {
  title: 'Catálogo',

  async render({ query }) {
    const filters = pickFilters(query);
    const list = await listProperties(filters);
    return `
    <div class="container py-5">
      <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 class="h3 fw-bold mb-1">Catálogo de propiedades</h1>
          <p class="text-muted mb-0" id="results-count" aria-live="polite">${countLabel(list.length)}</p>
        </div>
        <form class="row g-2" id="catalog-filters">
          <div class="col-auto">
            <label class="visually-hidden" for="filter-municipality">Municipio</label>
            <select id="filter-municipality" name="municipality" class="form-select">${selectOptions(MUNICIPALITIES, filters.municipality, 'Todos los municipios')}</select>
          </div>
          <div class="col-auto">
            <label class="visually-hidden" for="filter-type">Tipo de inmueble</label>
            <select id="filter-type" name="type" class="form-select">${selectOptions(PROPERTY_TYPES, filters.type, 'Todos los tipos')}</select>
          </div>
        </form>
      </div>
      <div class="row g-4" id="catalog-grid">${gridContent(list)}</div>
    </div>`;
  },

  mount(root) {
    const form = root.querySelector('#catalog-filters');
    const grid = root.querySelector('#catalog-grid');
    const counter = root.querySelector('#results-count');
    bindPropertyCards(root);

    // Filtra en vivo, sin recargar la vista, y deja la URL compartible sin disparar un nuevo render.
    const applyFilters = async () => {
      const filters = pickFilters(Object.fromEntries(new FormData(form)));
      history.replaceState(null, '', buildHash(ROUTES.CATALOG, filters));
      const list = await listProperties(filters);
      grid.innerHTML = gridContent(list);
      counter.textContent = countLabel(list.length);
    };

    form.addEventListener('change', applyFilters);
    root.addEventListener('click', (event) => {
      if (!event.target.closest('[data-action="clear-filters"]')) return;
      form.reset();
      form.querySelectorAll('select').forEach((select) => { select.value = ''; });
      applyFilters();
    });
  },
};
