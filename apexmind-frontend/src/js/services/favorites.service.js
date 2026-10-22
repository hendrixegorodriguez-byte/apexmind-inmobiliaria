import { STORAGE_KEYS } from '../config/constants.js';
import { storage } from './storage.service.js';

let ids = null;
const load = () => (ids ??= new Set(storage.get(STORAGE_KEYS.FAVORITES, [])));
const persist = () => storage.set(STORAGE_KEYS.FAVORITES, [...load()]);

export const isFavorite = (id) => load().has(id);

/** Alterna el favorito y devuelve true si quedó marcado. */
export function toggleFavorite(id) {
  const set = load();
  const wasFavorite = set.delete(id);
  if (!wasFavorite) set.add(id);
  persist();
  return !wasFavorite;
}

export function removeFavorite(id) {
  if (load().delete(id)) persist();
}
