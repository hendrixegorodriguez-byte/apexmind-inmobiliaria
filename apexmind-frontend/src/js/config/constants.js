/** Configuración y constantes globales. Única fuente de verdad: evita "strings mágicos" repetidos. */

export const APP_CONFIG = {
  BRAND: 'APEXMIND',
  // true = datos y login simulados en el navegador. Poner en false al conectar un backend real.
  USE_MOCK_API: true,
};

export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  FAVORITES: '/favorites',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
};

export const ACCESS = { PUBLIC: 'public', AUTH: 'auth', ADMIN: 'admin' };
export const ROLES = { ADMIN: 'admin', CLIENT: 'client' };

export const PROPERTY_STATUS = { AVAILABLE: 'available', SOLD: 'sold' };
export const STATUS_LABELS = { available: 'Disponible', sold: 'Vendido' };

export const MUNICIPALITIES = ['Silvania', 'Fusagasugá', 'Melgar', 'Anapoima', 'La Mesa'];
export const PROPERTY_TYPES = ['Casa campestre', 'Apartamento', 'Finca'];

export const STORAGE_KEYS = {
  PROPERTIES: 'apexmind:properties',
  FAVORITES: 'apexmind:favorites',
  SESSION: 'apexmind:session',
};

export const EVENTS = {
  SESSION_CHANGED: 'apexmind:session-changed',
  ROUTE_CHANGED: 'apexmind:route-changed',
};
