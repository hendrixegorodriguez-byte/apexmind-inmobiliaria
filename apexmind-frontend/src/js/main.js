import { mountNavbar } from './components/navbar.js';
import { startRouter } from './router/router.js';
import { routes } from './router/routes.js';

// Punto de entrada único: se ejecuta una sola vez (antes se registraba hasta 6 veces por scripts duplicados).
mountNavbar();
startRouter(document.getElementById('app'), routes);
