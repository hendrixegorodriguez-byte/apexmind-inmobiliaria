import { ACCESS, ROUTES } from '../config/constants.js';
import { catalogView } from '../views/catalog.view.js';
import { dashboardView } from '../views/dashboard.view.js';
import { favoritesView } from '../views/favorites.view.js';
import { homeView } from '../views/home.view.js';
import { loginView } from '../views/login.view.js';

/** Tabla de rutas: ruta -> vista + nivel de acceso requerido. */
export const routes = {
  [ROUTES.HOME]: { view: homeView, access: ACCESS.PUBLIC },
  [ROUTES.CATALOG]: { view: catalogView, access: ACCESS.PUBLIC },
  [ROUTES.FAVORITES]: { view: favoritesView, access: ACCESS.PUBLIC },
  [ROUTES.LOGIN]: { view: loginView, access: ACCESS.PUBLIC },
  [ROUTES.DASHBOARD]: { view: dashboardView, access: ACCESS.ADMIN },
};
