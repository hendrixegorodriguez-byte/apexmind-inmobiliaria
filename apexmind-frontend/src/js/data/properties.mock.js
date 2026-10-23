/** Datos de ejemplo. Se reemplazan por una llamada a la API cuando exista el backend. */
export const SEED_PROPERTIES = [
  {
    id: 1,
    title: 'Casa Campestre Quinta Real',
    municipality: 'Silvania',
    type: 'Casa campestre',
    price: 450000000, // número (COP): permite filtrar y ordenar; se formatea solo al mostrar
    bedrooms: 4,
    bathrooms: 3,
    area: 280, // m²
    status: 'available',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Apartamento de Lujo Centro',
    municipality: 'Fusagasugá',
    type: 'Apartamento',
    price: 230000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
];
