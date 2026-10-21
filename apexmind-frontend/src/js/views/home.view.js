import { bindPropertyCards, propertyCard } from '../components/property-card.js';
import { MUNICIPALITIES, PROPERTY_TYPES, ROUTES } from '../config/constants.js';
import { navigate } from '../router/router.js';
import { getFeaturedProperties } from '../services/properties.service.js';
import { selectOptions } from '../utils/dom.js';
import { formatList } from '../utils/format.js';

export const homeView = {
  title: 'Inicio',

  async render() {
    const featured = await getFeaturedProperties();
    return `
    <header class="hero">
      <div class="container">
        <div class="col-lg-7">
          <h1 class="display-4 fw-bold mb-3">Encuentra el hogar <br><span class="text-gold">de tus sueños</span></h1>
          <p class="lead fw-light mb-0 opacity-75">Explora propiedades exclusivas en ${formatList(MUNICIPALITIES)}.</p>
        </div>
      </div>
    </header>

    <div class="container search-box-container">
      <form class="search-card" id="quick-search">
        <h2 class="h5 fw-bold mb-3"><i class="bi bi-search me-2 text-gold" aria-hidden="true"></i>Búsqueda rápida</h2>
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label small text-muted fw-semibold" for="home-municipality">Municipio</label>
            <select id="home-municipality" name="municipality" class="form-select bg-light">${selectOptions(MUNICIPALITIES, '', 'Todos los municipios')}</select>
          </div>
          <div class="col-md-4">
            <label class="form-label small text-muted fw-semibold" for="home-type">Tipo de inmueble</label>
            <select id="home-type" name="type" class="form-select bg-light">${selectOptions(PROPERTY_TYPES, '', 'Todos los tipos')}</select>
          </div>
          <div class="col-md-4">
            <button type="submit" class="btn btn-gold w-100 py-2"><i class="bi bi-search me-2" aria-hidden="true"></i>Buscar propiedades</button>
          </div>
        </div>
      </form>
    </div>

    <section class="container my-5" aria-labelledby="featured-title">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 fw-bold m-0" id="featured-title">Propiedades destacadas</h2>
        <a class="btn btn-outline-dark btn-sm rounded-pill px-3" href="#${ROUTES.CATALOG}">Ver todo el catálogo <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      </div>
      <div class="row g-4">${featured.map(propertyCard).join('')}</div>
    </section>`;
  },

  mount(root) {
    bindPropertyCards(root);
    root.querySelector('#quick-search').addEventListener('submit', (event) => {
      event.preventDefault();
      navigate(ROUTES.CATALOG, Object.fromEntries(new FormData(event.currentTarget)));
    });
  },
};
