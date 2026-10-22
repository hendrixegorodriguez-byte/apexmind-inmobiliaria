# APEXMIND · Frontend

Sitio web de APEXMIND Inmobiliaria. JavaScript vanilla con módulos ES y Bootstrap 5, sin paso de build.

## Cómo ejecutarlo

Los módulos ES **no funcionan abriendo `index.html` con doble clic** (el navegador bloquea `file://`). Usa un servidor local:

```bash
npm start                      # abre http://localhost:5173
# o, sin Node:
python -m http.server 5173 --directory src
```

Cuentas de demostración: `admin@apexmind.test` / `admin123` y `cliente@apexmind.test` / `cliente123`.

## Estructura

```
apexmind-frontend/
├── docs/AUDITORIA.md          Errores encontrados, riesgos futuros y tabla de renombres
└── src/                       Lo que se publica en el servidor web
    ├── index.html             Documento único (sin duplicados)
    ├── css/
    │   ├── base/              variables (design tokens) y estilos globales
    │   ├── layout/            estructura de página (navbar)
    │   ├── components/        piezas reutilizables (botones, tarjeta de propiedad)
    │   └── views/             estilos propios de cada pantalla
    └── js/
        ├── main.js            Punto de entrada
        ├── config/            Constantes y configuración
        ├── data/              Datos simulados (se eliminan al tener backend)
        ├── services/          Lógica y acceso a datos: auth, propiedades, favoritos, storage
        ├── router/            Rutas, control de acceso y navegación
        ├── components/        UI reutilizable: navbar, tarjeta, toast, confirmación
        ├── views/             Una pantalla = un archivo (render + mount)
        └── utils/             Funciones puras: escapar HTML, formatos
```

Regla de dependencias: `views → components → services → data/config`. Las capas de abajo nunca importan de las de arriba.

## Convenciones

- Archivos en `kebab-case`; sufijo que indica el rol (`*.service.js`, `*.view.js`, `*.mock.js`).
- Código (variables, funciones, clases CSS en BEM) en inglés; textos visibles al usuario en español.
- Nada de `onclick` en el HTML: los eventos se registran en JS con delegación.
- Todo dato dinámico que entre por `innerHTML` pasa por `escapeHtml()`.

## Para conectar un backend real

1. Reescribir `services/properties.service.js` y `services/auth.service.js` con `fetch` (las firmas ya son `async`).
2. Poner `USE_MOCK_API: false` en `config/constants.js` y borrar `data/users.mock.js`.
3. Validar el rol **en el servidor**: el guard del router solo mejora la experiencia, no es seguridad.
