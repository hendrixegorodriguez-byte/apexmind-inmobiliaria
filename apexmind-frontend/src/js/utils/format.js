const priceFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const listFormatter = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });

export const formatPrice = (value) => `${priceFormatter.format(value)} COP`;
export const formatArea = (value) => `${value} m²`;
export const formatList = (items) => listFormatter.format(items);
