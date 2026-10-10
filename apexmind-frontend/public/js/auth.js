const propiedadesBase = [
    { 
        id: 1, 
        titulo: "Casa campestre moderna", 
        municipio: "La Mesa", 
        tipo: "Casa campestre", 
        precio: "$850.000.000", 
        hab: 4, 
        area: "250 m²", 
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", 
        fotos: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
        ],
        badge: "Destacada" 
    },
    { 
        id: 2, 
        titulo: "Apartamento acogedor", 
        municipio: "Fusagasugá", 
        tipo: "Apartamento", 
        precio: "$420.000.000", 
        hab: 3, 
        area: "120 m²", 
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", 
        fotos: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
        ],
        badge: "Nueva" 
    },
    { 
        id: 3, 
        titulo: "Casa campestre de lujo", 
        municipio: "Anapoima", 
        tipo: "Casa campestre", 
        precio: "$1.250.000.000", 
        hab: 5, 
        area: "320 m²", 
        img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80", 
        fotos: [
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80"
        ],
        badge: "Destacada" 
    },
    { 
        id: 4, 
        titulo: "Finca cafetera tradicional", 
        municipio: "Silvania", 
        tipo: "Finca", 
        precio: "$980.000.000", 
        hab: 6, 
        area: "500 m²", 
        img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80", 
        fotos: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        ],
        badge: "Oportunidad" 
    }
];

const usuarioPredeterminado = { email: "danimnt345@gmail.com", pass: "123456", nombre: "Daniel Montañez" };

function navegarA(vista) {
    document.querySelectorAll('.vista-app').forEach(el => el.classList.remove('activa'));
    
    if (vista === 'dashboard') {
        let sesion = localStorage.getItem('sesionActiva');
        if (!sesion) {
            navegarA('login');
            return;
        }
        const user = JSON.parse(sesion);
        document.getElementById('textoAgenteActivo').innerText = `Agente activo: ${user.nombre}`;
        renderizarDashboard();
    }

    document.getElementById(`vista-${vista}`).classList.add('activa');
    window.scrollTo(0,0);
}

function actualizarMenuNavbar() {
    const contenedor = document.getElementById('contenedorBotonesNav');
    const sesion = localStorage.getItem('sesionActiva');

    if (sesion) {
        const user = JSON.parse(sesion);
        contenedor.innerHTML = `
            <span class="text-white small me-2"><i class="bi bi-person-circle text-warning me-1"></i>${user.nombre}</span>
            <button onclick="navegarA('dashboard')" class="btn btn-warning btn-sm fw-bold px-3">Panel Agente</button>
            <button onclick="cerrarSesion()" class="btn btn-outline-light btn-sm px-2"><i class="bi bi-box-arrow-right"></i></button>
        `;
    } else {
        contenedor.innerHTML = `
            <button onclick="mostrarFormAuth('login')" class="btn btn-outline-light btn-sm px-3">Iniciar sesión</button>
            <button onclick="mostrarFormAuth('register')" class="btn btn-warning text-dark fw-bold btn-sm px-3">Registrarse</button>
        `;
    }
}

function mostrarFormAuth(tipo) {
    navegarA('login');
    if (tipo === 'register') {
        const triggerEl = document.querySelector('#tab-register');
        bootstrap.Tab.getInstance(triggerEl) ? bootstrap.Tab.getInstance(triggerEl).show() : new bootstrap.Tab(triggerEl).show();
    } else {
        const triggerEl = document.querySelector('#tab-login');
        bootstrap.Tab.getInstance(triggerEl) ? bootstrap.Tab.getInstance(triggerEl).show() : new bootstrap.Tab(triggerEl).show();
    }
}

function obtenerUsuariosGuardados() {
    const usuarios = JSON.parse(localStorage.getItem('usuariosApex')) || [];
    if (usuarios.length === 0) {
        usuarios.push(usuarioPredeterminado);
        localStorage.setItem('usuariosApex', JSON.stringify(usuarios));
    }
    return usuarios;
}

function ejecutarLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const usuarios = obtenerUsuariosGuardados();

    const encontrado = usuarios.find(u => u.email === email && u.pass === pass);

    if (encontrado) {
        localStorage.setItem('sesionActiva', JSON.stringify({ email: encontrado.email, nombre: encontrado.nombre }));
        actualizarMenuNavbar();
        navegarA('dashboard');
    } else {
        alert('Correo o contraseña incorrectos.');
    }
}

function ejecutarRegistro(e) {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value.trim();

    let usuarios = obtenerUsuariosGuardados();

    if (usuarios.some(u => u.email === email)) {
        alert('Este correo electrónico ya se encuentra registrado.');
        return;
    }

    const nuevoUsuario = { email, pass, nombre };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuariosApex', JSON.stringify(usuarios));

    localStorage.setItem('sesionActiva', JSON.stringify({ email, nombre }));
    alert(`¡Registro exitoso! Bienvenido, ${nombre}.`);
    
    actualizarMenuNavbar();
    navegarA('dashboard');
}

function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    actualizarMenuNavbar();
    navegarA('inicio');
}

function obtenerTodasPropiedades() {
    const guardadas = JSON.parse(localStorage.getItem('propiedadesApex')) || [];
    return [...propiedadesBase, ...guardadas];
}

function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('contenedorPropiedades');
    const contador = document.getElementById('contadorResultados');
    if (contador) contador.innerText = `Mostrando ${lista.length} inmuebles`;
    
    if (!contenedor) return;
    contenedor.innerHTML = '';

    lista.forEach(p => {
        contenedor.innerHTML += `
            <div class="col-md-4">
                <div class="property-card">
                    <div class="property-img-wrapper">
                        <span class="badge-status">${p.badge || 'Disponible'}</span>
                        <img src="${p.img}" alt="${p.titulo}">
                    </div>
                    <div class="p-4 d-flex flex-column justify-content-between" style="height: calc(100% - 200px);">
                        <div>
                            <h5 class="fw-bold text-dark mb-1">${p.titulo}</h5>
                            <p class="text-muted small mb-3"><i class="bi bi-geo-alt text-warning me-1"></i>${p.municipio}</p>
                            <div class="bg-light p-3 rounded-3 mb-3">
                                <span class="small text-muted d-block fw-semibold">Precio:</span>
                                <span class="fs-5 fw-bold text-dark">${p.precio}</span>
                            </div>
                        </div>
                        <button onclick="verDetallePropiedad(${p.id})" class="btn btn-outline-dark w-100 rounded-pill fw-semibold py-2">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function filtrarPropiedades() {
    const municipio = document.getElementById('filtroMunicipio').value;
    const tipo = document.getElementById('filtroTipo').value;
    const todas = obtenerTodasPropiedades();

    const filtradas = todas.filter(p => {
        const coincideMunicipio = municipio === "" || p.municipio === municipio;
        const coincideTipo = tipo === "" || p.tipo === tipo;
        return coincideMunicipio && coincideTipo;
    });

    renderizarCatalogo(filtradas);
}

function verDetallePropiedad(id) {
    const todas = obtenerTodasPropiedades();
    const propiedad = todas.find(p => p.id === id);
    if (!propiedad) return;

    document.getElementById('detalleTitulo').innerText = propiedad.titulo;
    document.getElementById('detallePrecio').innerText = propiedad.precio + " COP";
    document.getElementById('detalleUbicacion').innerText = propiedad.municipio;
    document.getElementById('detalleHab').innerText = propiedad.hab;
    document.getElementById('detalleArea').innerText = propiedad.area;
    document.getElementById('detalleTipo').innerText = propiedad.tipo;
    document.getElementById('detalleBadge').innerText = propiedad.badge || 'Disponible';

    const fotos = propiedad.fotos && propiedad.fotos.length > 0 ? propiedad.fotos : [propiedad.img];
    document.getElementById('imgPrincipalDetalle').src = fotos[0];

    const contenedorMiniaturas = document.getElementById('contenedorMiniaturas');
    contenedorMiniaturas.innerHTML = '';
    fotos.forEach((foto, index) => {
        contenedorMiniaturas.innerHTML += `
            <div class="col-4">
                <img src="${foto}" class="thumb-img ${index === 0 ? 'activa' : ''}" onclick="cambiarFotoPrincipal('${foto}', this)">
            </div>
        `;
    });

    const textoWs = encodeURIComponent(`Hola, estoy interesado en la propiedad "${propiedad.titulo}" ubicada en ${propiedad.municipio} con precio ${propiedad.precio}. Me gustaría recibir más información.`);
    document.getElementById('btnWhatsappContact').href = `https://wa.me/573104567890?text=${textoWs}`;

    const modal = new bootstrap.Modal(document.getElementById('modalDetallePropiedad'));
    modal.show();
}

function cambiarFotoPrincipal(url, elementoThumb) {
    document.getElementById('imgPrincipalDetalle').src = url;
    document.querySelectorAll('.thumb-img').forEach(img => img.classList.remove('activa'));
    elementoThumb.classList.add('activa');
}

function guardarNuevoInmueble(e) {
    e.preventDefault();
    const titulo = document.getElementById('addTitulo').value.trim();
    const municipio = document.getElementById('addMunicipio').value;
    const tipo = document.getElementById('addTipo').value;
    const precio = document.getElementById('addPrecio').value.trim();
    const hab = document.getElementById('addHab').value;
    const area = document.getElementById('addArea').value.trim();
    const fileInput = document.getElementById('addFotosInput');

    if (fileInput.files.length === 0) {
        alert('Por favor selecciona al menos una foto.');
        return;
    }

    let fotosURLs = [];
    let procesados = 0;

    Array.from(fileInput.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            fotosURLs.push(event.target.result);
            procesados++;

            if (procesados === fileInput.files.length) {
                const nuevaProp = {
                    id: Date.now(),
                    titulo,
                    municipio,
                    tipo,
                    precio,
                    hab: parseInt(hab),
                    area,
                    img: fotosURLs[0],
                    fotos: fotosURLs,
                    badge: "Nuevo"
                };

                let guardadas = JSON.parse(localStorage.getItem('propiedadesApex')) || [];
                guardadas.push(nuevaProp);
                localStorage.setItem('propiedadesApex', JSON.stringify(guardadas));

                bootstrap.Modal.getInstance(document.getElementById('modalNuevaPropiedad')).hide();
                e.target.reset();
                renderizarDashboard();
                renderizarCatalogo(obtenerTodasPropiedades());
                alert('¡Inmueble publicado con éxito!');
            }
        };
        reader.readAsDataURL(file);
    });
}

function renderizarDashboard() {
    const todas = obtenerTodasPropiedades();
    document.getElementById('statTotal').innerText = todas.length;

    const tbody = document.getElementById('tablaDashboard');
    if (!tbody) return;
    tbody.innerHTML = '';

    todas.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td class="fw-bold">${p.titulo}</td>
                <td>${p.municipio}</td>
                <td>${p.tipo}</td>
                <td>${p.precio}</td>
                <td><span class="badge bg-success bg-opacity-10 text-success px-2 py-1">${p.badge || 'Activo'}</span></td>
            </tr>
        `;
    });
}

// Inicializar la aplicación cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarMenuNavbar();
    renderizarCatalogo(obtenerTodasPropiedades());
});