import { PROPERTY_STATUS, STORAGE_KEYS } from '../config/constants.js';
import { SEED_PROPERTIES } from '../data/properties.mock.js';
import { removeFavorite } from './favorites.service.js';
import { storage } from './storage.service.js';

/*
 * Capa de datos. Hoy simula una API con localStorage; las funciones ya son async,
 * así que migrar a fetch('/api/properties') solo obliga a cambiar ESTE archivo.
 */

let cache = null;
const load = () => (cache ??= storage.get(STORAGE_KEYS.PROPERTIES, SEED_PROPERTIES));
const save = (list) => {
  cache = list;
  storage.set(STORAGE_KEYS.PROPERTIES, list);
};

export async function listProperties({ municipality = '', type = '', status = '' } = {}) {
  return load().filter(
    (p) =>
      (!municipality || p.municipality === municipality) &&
      (!type || p.type === type) &&
      (!status || p.status === status),
  );
}

export async function getFeaturedProperties(limit = 3) {
  return load().filter((p) => p.status === PROPERTY_STATUS.AVAILABLE).slice(0, limit);
}

export async function getProperty(id) {
  return load().find((p) => p.id === Number(id)) ?? null;
}

/** Crea (sin id) o actualiza (con id). El id nuevo es max+1, nunca la longitud del arreglo. */
export async function saveProperty(data) {
  const list = load();
  if (data.id) {
    save(list.map((p) => (p.id === data.id ? { ...p, ...data } : p)));
    return data;
  }
  const created = { ...data, id: Math.max(0, ...list.map((p) => p.id)) + 1 };
  save([...list, created]);
  return created;
}

export async function deleteProperty(id) {
  save(load().filter((p) => p.id !== id));
  removeFavorite(id); // evita favoritos "huérfanos" que apuntan a un inmueble inexistente
}
