import { confirmDialog } from '../components/confirm-dialog.js';
import { showToast } from '../components/toast.js';
import { MUNICIPALITIES, PROPERTY_STATUS, PROPERTY_TYPES, STATUS_LABELS } from '../config/constants.js';
import { deleteProperty, getProperty, listProperties, saveProperty } from '../services/properties.service.js';
import { delegate, escapeHtml, selectOptions } from '../utils/dom.js';
import { formatPrice } from '../utils/format.js';

const FORM_FIELDS = ['title', 'municipality', 'type', 'price', 'bedrooms', 'bathrooms', 'area', 'status', 'image'];

const statsHtml = (list) => {
  const sold = list.filter((p) => p.status === PROPERTY_STATUS.SOLD).length;
  const card = (label, value) => `<div class="col-sm-4"><div class="stat-card"><span class="stat-card__value">${value}</span><span class="stat-card__label">${label}</span></div></div>`;
  return card('Total de inmuebles', list.length) + card('Disponibles', list.length - sold) + card('Vendidos', sold);
};

const rowsHtml = (list) =>
  list.length
    ? list.map((p) => `
      <tr>
        <td><img class="dashboard-thumb" src="${escapeHtml(p.image)}" alt="" width="50" height="40" loading="lazy"></td>
        <th scope="row" class="fw-semibold">${escapeHtml(p.title)}</th>
        <td>${escapeHtml(p.municipality)}</td>
        <td>${escapeHtml(p.type)}</td>
        <td>${formatPrice(p.price)}</td>
        <td><span class="badge ${p.status === PROPERTY_STATUS.SOLD ? 'text-bg-danger' : 'text-bg-success'}">${STATUS_LABELS[p.status]}</span></td>
        <td class="text-end text-nowrap">
          <button type="button" class="btn btn-sm btn-outline-secondary me-1" data-action="edit" data-id="${p.id}" aria-label="Editar ${escapeHtml(p.title)}"><i class="bi bi-pencil" aria-hidden="true"></i></button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${p.id}" aria-label="Eliminar ${escapeHtml(p.title)}"><i class="bi bi-trash" aria-hidden="true"></i></button>
        </td>
      </tr>`).join('')
    : '<tr><td colspan="7" class="text-center text-muted py-4">No hay propiedades registradas.</td></tr>';

const field = (id, label, control, col = 'col-md-6') =>
  `<div class="${col}"><label class="form-label" for="pf-${id}">${label}</label>${control}</div>`;
const input = (id, type, extra = '') => `<input class="form-control" id="pf-${id}" name="${id}" type="${type}" required ${extra}>`;
const select = (id, options) => `<select class="form-select" id="pf-${id}" name="${id}" required>${options}</select>`;

const modalHtml = () => `
  <div class="modal fade" id="property-modal" tabindex="-1" aria-labelledby="property-modal-title" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <form class="modal-content" id="property-form" novalidate>
        <div class="modal-header">
          <h2 class="modal-title h5" id="property-modal-title"></h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body row g-3">
          <input type="hidden" name="id">
          ${field('title', 'Título', input('title', 'text', 'maxlength="80"'), 'col-12')}
          ${field('municipality', 'Municipio', select('municipality', selectOptions(MUNICIPALITIES, '', 'Selecciona…')))}
          ${field('type', 'Tipo', select('type', selectOptions(PROPERTY_TYPES, '', 'Selecciona…')))}
          ${field('price', 'Precio (COP)', input('price', 'number', 'min="1"'), 'col-md-4')}
          ${field('area', 'Área (m²)', input('area', 'number', 'min="1"'), 'col-md-4')}
          ${field('status', 'Estado', select('status', Object.entries(STATUS_LABELS).map(([v, l]) => `<option value="${v}">${l}</option>`).join('')), 'col-md-4')}
          ${field('bedrooms', 'Habitaciones', input('bedrooms', 'number', 'min="0" value="1"'), 'col-md-6')}
          ${field('bathrooms', 'Baños', input('bathrooms', 'number', 'min="0" value="1"'), 'col-md-6')}
          ${field('image', 'URL de la imagen', input('image', 'url', 'placeholder="https://…"'), 'col-12')}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-gold">Guardar</button>
        </div>
      </form>
    </div>
  </div>`;

export const dashboardView = {
  title: 'Panel del agente',

  async render() {
    const list = await listProperties();
    return `
    <div class="container py-5">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 class="h3 fw-bold m-0">Panel del agente</h1>
        <button type="button" class="btn btn-gold" data-action="create"><i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Nueva propiedad</button>
      </div>
      <div class="row g-3 mb-4" id="dashboard-stats">${statsHtml(list)}</div>
      <div class="table-responsive dashboard-table">
        <table class="table align-middle mb-0">
          <caption class="visually-hidden">Propiedades registradas</caption>
          <thead><tr><th scope="col"><span class="visually-hidden">Imagen</span></th><th scope="col">Título</th><th scope="col">Municipio</th><th scope="col">Tipo</th><th scope="col">Precio</th><th scope="col">Estado</th><th scope="col" class="text-end">Acciones</th></tr></thead>
          <tbody id="dashboard-rows">${rowsHtml(list)}</tbody>
        </table>
      </div>
      ${modalHtml()}
    </div>`;
  },

  mount(root) {
    const modalEl = root.querySelector('#property-modal');
    const modal = new window.bootstrap.Modal(modalEl);
    const form = root.querySelector('#property-form');

    const refresh = async () => {
      const list = await listProperties();
      root.querySelector('#dashboard-stats').innerHTML = statsHtml(list);
      root.querySelector('#dashboard-rows').innerHTML = rowsHtml(list);
    };

    const openForm = (property) => {
      form.reset();
      form.classList.remove('was-validated');
      form.elements.id.value = property?.id ?? '';
      if (property) FORM_FIELDS.forEach((name) => { form.elements[name].value = property[name]; });
      modalEl.querySelector('.modal-title').textContent = property ? 'Editar propiedad' : 'Nueva propiedad';
      modal.show();
    };

    delegate(root, 'click', '[data-action]', async (_event, button) => {
      const { action, id } = button.dataset;
      if (action === 'create') return openForm(null);
      if (action === 'edit') return openForm(await getProperty(id));
      if (action === 'delete') {
        const property = await getProperty(id);
        const ok = await confirmDialog({
          title: 'Eliminar propiedad',
          message: `¿Seguro que deseas eliminar "${property.title}"? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
        });
        if (!ok) return;
        await deleteProperty(property.id);
        showToast('Propiedad eliminada', 'info');
        refresh();
      }
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) return;
      const raw = Object.fromEntries(new FormData(form));
      await saveProperty({
        id: raw.id ? Number(raw.id) : undefined,
        title: raw.title.trim(),
        municipality: raw.municipality,
        type: raw.type,
        price: Number(raw.price),
        bedrooms: Number(raw.bedrooms),
        bathrooms: Number(raw.bathrooms),
        area: Number(raw.area),
        status: raw.status,
        image: raw.image.trim(),
      });
      modal.hide();
      showToast(raw.id ? 'Propiedad actualizada' : 'Propiedad creada');
      refresh();
    });

    // Al salir de la vista (p. ej. botón "atrás" con el modal abierto) no deben quedar fondo ni scroll bloqueado.
    return () => {
      modal.dispose();
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    };
  },
};
