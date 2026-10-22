import { EVENTS, ROUTES } from '../config/constants.js';
import { getSession, isAdmin, logout } from '../services/auth.service.js';
import { navigate } from '../router/router.js';
import { escapeHtml } from '../utils/dom.js';
import { showToast } from './toast.js';

/** Barra de navegación: estado de sesión, enlace activo y cierre del menú móvil. */
export function mountNavbar() {
  const authSlot = document.getElementById('nav-auth');
  const adminItem = document.getElementById('nav-admin-item');
  const menu = document.getElementById('main-nav');
  const links = document.querySelectorAll('[data-route]');

  const renderSession = () => {
    const session = getSession();
    adminItem.hidden = !isAdmin();
    authSlot.innerHTML = session
      ? `<span class="text-white small fw-semibold me-2">${escapeHtml(session.name)}</span>
         <button type="button" class="btn btn-outline-light btn-sm" data-action="logout">Salir</button>`
      : `<a class="btn btn-gold btn-sm px-3" href="#${ROUTES.LOGIN}">Ingresar</a>`;
  };

  const highlightActive = (path) => {
    links.forEach((link) => {
      const active = link.dataset.route === path;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (menu.classList.contains('show')) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
  };

  authSlot.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="logout"]')) return;
    navigate(ROUTES.HOME); // primero navegar, así el guard no muestra un aviso al salir del panel
    logout();
    showToast('Sesión cerrada.', 'info');
  });

  document.addEventListener(EVENTS.SESSION_CHANGED, renderSession);
  document.addEventListener(EVENTS.ROUTE_CHANGED, (event) => highlightActive(event.detail.path));
  renderSession();
}
