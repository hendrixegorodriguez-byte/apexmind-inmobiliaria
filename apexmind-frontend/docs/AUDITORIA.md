# Auditoría del proyecto original

Gravedad: **Crítico** = la página no funciona o es vulnerable · **Alto** = falla visible o riesgo real · **Medio** = deuda técnica que duele al crecer.

## 1. Errores que rompían la aplicación

| # | Gravedad | Problema | Consecuencia | Solución aplicada |
|---|---|---|---|---|
| 1 | Crítico | `index.html` tenía contenido **después de `</html>`**: un segundo bloque con el home, más secciones repetidas y scripts repetidos. | HTML inválido; cada navegador lo "arregla" a su manera. | Un único documento válido. |
| 2 | Crítico | **IDs duplicados** (`vista-inicio`, `vista-catalogo`, …): el primero era un placeholder vacío y el real estaba abajo. | `getElementById` devuelve el primero (vacío): `navegarA('inicio')` mostraba una página en blanco. | Una sola vista activa dentro de `<main id="app">`. |
| 3 | Crítico | Bootstrap JS y los 6 scripts propios se cargaban **3 veces**. | `state.js` repetido lanza `Identifier 'propiedades' has already been declared` (por usar `let` global); Bootstrap duplicado registra manejadores dos o tres veces (el menú móvil se abre y se cierra al instante). | Cada script se carga una vez. |
| 4 | Crítico | `main.js` tenía el mismo `DOMContentLoaded` **repetido dentro del archivo**, y el archivo se cargaba 3 veces. | `renderizarCatalogo()` se ejecutaba hasta 6 veces al abrir la página. | Un solo `main.js` que arranca la app una vez. |
| 5 | Crítico | Las vistas catálogo, favoritos, login y dashboard estaban **vacías**, pero el JS buscaba `contenedorCatalogo`, `tablaDashboard`, `statTotal`, `loginEmail`… | `ejecutarLogin` lanzaba `TypeError` (`null.value`); `renderizarDashboard` habría fallado igual. | Las 5 vistas están implementadas. |
| 6 | Crítico | Funciones llamadas desde el HTML que **no existían**: `buscarDesdeHome`, `abrirModalEdicion`; nunca se llenaba `contenedorDestacadasHome`. | Botón "Buscar" y botón "Editar" sin efecto. | Búsqueda rápida, edición/creación con modal y destacadas funcionando. |

## 2. Seguridad

| # | Gravedad | Problema | Solución |
|---|---|---|---|
| 7 | Crítico | **Correo y contraseña del administrador escritos en `auth.js`** (`"123456"`). Cualquiera los ve con "Ver código fuente". | Eliminados. Hoy hay cuentas demo claramente marcadas en `data/users.mock.js`; en producción la validación **debe** ser en el servidor. **Cambia esa contraseña y ese correo si se usaron en otro sitio.** |
| 8 | Crítico | El `else` del login iniciaba sesión como "cliente" con **cualquier** dato. | Credenciales inválidas ahora se rechazan con mensaje. |
| 9 | Crítico | El rol se decidía en el navegador y el panel solo se ocultaba con `display:none`. Basta `navegarA('dashboard')` en la consola para entrar. | Guard de acceso en el router (mejora la UX). La seguridad real exige validar rol y permisos en el backend. |
| 10 | Alto | **XSS**: todo se insertaba con `innerHTML` sin escapar (`${item.titulo}`). Al permitir crear inmuebles, un título con `<img onerror=…>` ejecutaría código en el navegador de cada visitante. | `escapeHtml()` en todo dato dinámico. |
| 11 | Medio | CDN sin `integrity` (SRI). | Pendiente: añadir SRI o alojar Bootstrap en el propio sitio. No lo puse a ciegas porque un hash incorrecto bloquea la librería. |
| 12 | Medio | Sesión sin persistencia ni expiración. | Sesión en `localStorage` (demo). Con backend: cookie `HttpOnly` o token con expiración. |

## 3. Lógica y datos

| # | Gravedad | Problema | Solución |
|---|---|---|---|
| 13 | Alto | Estado y etiqueta mezclados en `badge`, con mayúsculas inconsistentes: los datos decían `"Disponible"` pero el código comparaba con `'VENDIDO'`. Un inmueble vendido escrito `"Vendido"` jamás se marcaba como vendido. | Campo `status` con valores fijos (`available`/`sold`) y etiquetas aparte. |
| 14 | Alto | Precio y área como **texto** (`"$ 450.000.000 COP"`, `"280 m²"`). No se puede filtrar por rango, ordenar ni sumar. | `price` y `area` numéricos; se formatean con `Intl.NumberFormat` al mostrar. |
| 15 | Alto | El corazón de favoritos **siempre se veía lleno** y no cambiaba al tocarlo; los favoritos se perdían al recargar. | Estado visual real, `aria-pressed`, persistencia y vista de favoritos. |
| 16 | Medio | Al eliminar un inmueble sus ids quedaban en `favoritos` (huérfanos), y se reiniciaban los filtros del catálogo. | `deleteProperty` limpia el favorito; los filtros persisten (y viven en la URL). |
| 17 | Medio | Variables globales mutables (`let propiedades`, `favoritos`, `usuarioActual`) accesibles y reasignables desde cualquier archivo. | Módulos ES: cada dato vive en su servicio y solo se cambia por sus funciones. |
| 18 | Medio | Riesgo de ids repetidos al crear inmuebles (típico `length + 1`). | `max(id) + 1`. |

## 4. Interacción y accesibilidad

- `alert()` / `confirm()` bloquean la página y se ven poco profesionales → toasts y modal de confirmación de Bootstrap.
- La navegación eran `<button onclick>`: sin botón "atrás", sin recarga en la misma vista, sin enlaces compartibles, sin clic derecho → "abrir en pestaña nueva". Ahora son enlaces reales (`#/catalog?municipality=Melgar`).
- `box-shadow: none` en el foco del input quitaba el indicador de foco; no había `:focus-visible` → ahora hay foco visible y "Saltar al contenido".
- Texto blanco sobre dorado (`#C5A059`) tiene contraste ~2.4:1 (mínimo AA: 4.5:1) → texto oscuro sobre dorado.
- El HTML usaba `text-warning`/`btn-warning` (amarillo de Bootstrap) aunque definías un dorado propio: la marca no coincidía → `.btn-gold` / `.text-gold` con tus variables.
- El menú móvil no se cerraba al navegar; las tarjetas no mostraban habitaciones/baños/área aunque existían los datos; no había estados vacíos.

## 5. Rendimiento y calidad de código

- `transition: all` → solo se animan `transform`, `box-shadow`, `color`.
- Imágenes sin `width/height` (saltos de diseño) ni `loading="lazy"`; ahora con ambos y una imagen de respaldo si falla la URL.
- Scripts sin `defer`; ahora `defer` + `type="module"`. Se añadieron `preconnect` a los CDN.
- Un solo `styles.css` con todo mezclado y `!important` para pelear con Bootstrap → CSS dividido por responsabilidad, sin `!important` salvo utilidades.
- Estilos inline (`style="…"`) y `onclick` inline → clases CSS y delegación de eventos (también necesario para una CSP estricta).
- Archivos con saltos de línea CRLF mezclados → `.editorconfig` (LF, UTF-8).
- Nombres mezclados (`navegarA`, `property-card`, `btn-fav`, `activa` vs `active`) → una convención.

## 6. Riesgos a futuro si no se hubiera corregido

1. **Cada función nueva en el espacio global puede pisar a otra** (ya pasó con los `let` duplicados). Con módulos ES eso deja de ser posible.
2. **Al conectar el backend habría que reescribir casi todo**, porque los datos y la lógica estaban pegados al HTML. Ahora solo cambian dos servicios.
3. **Seguridad de roles:** sin validación en el servidor, cualquier usuario podría ver o modificar datos de administración.
4. **Precios como texto** bloquean futuras funciones (filtro por rango, orden, estadísticas, SEO con datos estructurados).
5. **XSS almacenado** en cuanto un formulario público (contacto, comentarios, publicar inmueble) guarde texto de usuarios.
6. Sin rutas con URL: no se puede compartir un enlace a un inmueble ni medir visitas por página.
7. Sin tests ni linter: los errores 3–6 se habrían detectado en segundos con ESLint.

## 7. Tabla de renombres

**Archivos**

| Antes | Ahora |
|---|---|
| `public/index.html` | `src/index.html` |
| `public/css/styles.css` | `src/css/base/{variables,global}.css`, `layout/navbar.css`, `components/{buttons,property-card}.css`, `views/{home,auth,dashboard}.css` |
| `js/state.js` | `js/data/properties.mock.js`, `js/services/favorites.service.js`, sesión en `js/services/auth.service.js` |
| `js/navigation.js` | `js/router/router.js` + `js/router/routes.js` |
| `js/auth.js` | `js/services/auth.service.js`, `js/views/login.view.js`, `js/components/navbar.js` |
| `js/catalog.js` | `js/views/catalog.view.js`, `js/components/property-card.js` |
| `js/dashboard.js` | `js/views/dashboard.view.js` |
| `js/main.js` | `js/main.js` (punto de entrada único) |

**Funciones y variables**

| Antes | Ahora |
|---|---|
| `navegarA` | `navigate` |
| `renderizarCatalogo` / `renderizarDashboard` | `catalogView.render` / `dashboardView.render` |
| `toggleFavorito` | `toggleFavorite` |
| `ejecutarLogin` / `cerrarSesion` | `login` (+ `loginView.mount`) / `logout` |
| `actualizarNavegacionUsuario` | `renderSession` (en `navbar.js`) |
| `eliminarPropiedad` | `deleteProperty` |
| `propiedades` / `favoritos` / `usuarioActual` | `properties` / `favorites` / `session` |

**Campos de datos**

| Antes | Ahora |
|---|---|
| `titulo`, `municipio`, `tipo` | `title`, `municipality`, `type` |
| `precio` (`"$ 450.000.000 COP"`) | `price` (`450000000`) |
| `habitaciones`, `banos`, `area` (`"280 m²"`) | `bedrooms`, `bathrooms`, `area` (`280`) |
| `badge` (`"Disponible"`/`"VENDIDO"`) | `status` (`available`/`sold`) |
| `img` | `image` |

**CSS e ids**

| Antes | Ahora |
|---|---|
| `--gold-accent`, `--bg-dark` | `--color-gold`, `--color-bg-dark` |
| `.navbar-custom`, `.nav-link-btn` | `.site-navbar`, `.nav-link-custom` |
| `.badge-status`, `.btn-fav` | `.property-card__badge`, `.property-card__fav` |
| `.vendido`, `.active` / `.activa` | `.is-sold`, `.is-active` |
| `.vista-app` / `vista-*` | eliminado (una sola vista dentro de `#app`) |
| `contenedorBotonesNav`, `itemNavPanelAgente`, `navbarNav` | `nav-auth`, `nav-admin-item`, `main-nav` |

## 8. Siguientes pasos recomendados

1. Backend real con autenticación (cookie `HttpOnly` o JWT con expiración) y validación de roles.
2. Vite como servidor y empaquetador (minificación, hash de archivos para caché) cuando el proyecto crezca.
3. ESLint + Prettier, y pruebas con Vitest para los servicios.
4. SRI o Bootstrap local; imágenes propias optimizadas (WebP/AVIF) en lugar de Unsplash en producción.
5. Página de detalle de inmueble (`#/property/3`), formulario de contacto y filtros por precio/habitaciones (ya posibles porque los datos son numéricos).
