import { ACCESS, EVENTS, ROUTES } from '../config/constants.js';
import { isAdmin, isAuthenticated } from '../services/auth.service.js';
import { showToast } from '../components/toast.js';

/*
 * Router por hash (#/catalog?municipality=Melgar). Sin servidor especial, soporta botón "atrás",
 * recarga y enlaces compartibles. Cada vista se renderiza en un contenedor NUEVO, así los listeners
 * de la vista anterior desaparecen con él (no se acumulan).
 */

const ACCESS_CHECKS = {
  [ACCESS.PUBLIC]: () => true,
  [ACCESS.AUTH]: isAuthenticated,
  [ACCESS.ADMIN]: isAdmin,
};

let outlet;
let table;
let cleanup = null;
let renderToken = 0;

export function buildHash(path, query = {}) {
  const params = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== '' && v != null));
  const qs = params.toString();
  return `#${path}${qs ? `?${qs}` : ''}`;
}

export function navigate(path, query) {
  location.hash = buildHash(path, query);
}

function parseHash() {
  const [path, qs = ''] = (location.hash.slice(1) || ROUTES.HOME).split('?');
  return { path: path || ROUTES.HOME, query: Object.fromEntries(new URLSearchParams(qs)) };
}

async function resolve() {
  const { path, query } = parseHash();
  const route = table[path];

  if (!route) return navigate(ROUTES.HOME);
  if (!ACCESS_CHECKS[route.access]()) {
    showToast('Necesitas iniciar sesión con una cuenta autorizada.', 'warning');
    return navigate(ROUTES.LOGIN);
  }

  const token = ++renderToken;
  const section = document.createElement('div');
  section.className = 'view';
  section.innerHTML = await route.view.render({ query });
  if (token !== renderToken) return; // llegó otra navegación mientras cargaba: descartar

  cleanup?.();
  outlet.replaceChildren(section);
  cleanup = route.view.mount?.(section, { query }) ?? null;

  document.title = `${route.view.title} · APEXMIND Inmobiliaria`;
  window.scrollTo(0, 0);
  outlet.focus({ preventScroll: true }); // accesibilidad: lectores de pantalla anuncian el cambio
  document.dispatchEvent(new CustomEvent(EVENTS.ROUTE_CHANGED, { detail: { path } }));
}

export function startRouter(outletElement, routeTable) {
  outlet = outletElement;
  table = routeTable;
  window.addEventListener('hashchange', resolve);
  // Si la sesión cambia y la ruta actual deja de estar permitida (p. ej. cerrar sesión en el panel), re-evaluar.
  document.addEventListener(EVENTS.SESSION_CHANGED, () => {
    const route = table[parseHash().path];
    if (route && !ACCESS_CHECKS[route.access]()) resolve();
  });
  resolve();
}
