import { EVENTS, ROLES, STORAGE_KEYS } from '../config/constants.js';
import { DEMO_USERS } from '../data/users.mock.js';
import { storage } from './storage.service.js';

let session = storage.get(STORAGE_KEYS.SESSION);

export const getSession = () => session;
export const isAuthenticated = () => session !== null;
export const isAdmin = () => session?.role === ROLES.ADMIN;

function setSession(next) {
  session = next;
  if (next) storage.set(STORAGE_KEYS.SESSION, next);
  else storage.remove(STORAGE_KEYS.SESSION);
  document.dispatchEvent(new CustomEvent(EVENTS.SESSION_CHANGED));
}

/** Rechaza credenciales inválidas (antes cualquier dato iniciaba sesión como "cliente"). */
export async function login(email, password) {
  const user = DEMO_USERS.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
  if (!user) throw new Error('Correo o contraseña incorrectos.');
  const { password: _omit, ...safeUser } = user; // nunca guardar la contraseña en la sesión
  setSession(safeUser);
  return safeUser;
}

export const logout = () => setSession(null);
