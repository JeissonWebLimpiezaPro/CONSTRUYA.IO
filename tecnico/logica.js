// Variables globales
let usuarioActual = null;

// Navegación
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar la página
    await mostrarSeccion('dashboard');
    await actualizarDashboard();
    await cargarServicios();
    inicializarCalendario();
    cargarMensajes();
    actualizarFinanzas();
    await cargarPerfil();

    // Event listeners para navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const seccion = e.target.closest('.nav-link').dataset.seccion;
            mostrarSeccion(seccion);
        });
    });

    // Event listener para cerrar sesión
    document.querySelector('.logout-btn').addEventListener('click', cerrarSesion);
});

// Funciones de navegación
async function mostrarSeccion(idSeccion) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('activo'));
    document.querySelectorAll('.bottom-nav-link').forEach(link => link.classList.remove('activo'));
    
    event.currentTarget.classList.add('activo');

    document.querySelectorAll('.seccion').forEach(seccion => seccion.classList.remove('activa'));
    document.getElementById(idSeccion).classList.add('activa');
}

// Toggle del menú móvil
function toggleMenu() {
    const navContainer = document.querySelector('.nav-container');
    const menuToggle = document.querySelector('.menu-toggle');
    const isExpanded = navContainer.classList.contains('activo');

    navContainer.classList.toggle('activo');
    menuToggle.setAttribute('aria-expanded', !isExpanded);

    const icon = menuToggle.querySelector('i');
    if (isExpanded) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        menuToggle.setAttribute('aria-label', 'Cerrar menú');
    }
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navContainer = document.querySelector('.nav-container');
        const menuToggle = document.querySelector('.menu-toggle');

        if (window.innerWidth <= 768) {
            navContainer.classList.remove('activo');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menú');

            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (event) => {
    const navContainer = document.querySelector('.nav-container');
    const menuToggle = document.querySelector('.menu-toggle');

    if (!navContainer.contains(event.target) && !menuToggle.contains(event.target) && navContainer.classList.contains('activo')) {
        navContainer.classList.remove('activo');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');

        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Manejo del menú inferior
function mostrarMenuInferior() {
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav && window.innerWidth <= 768) {
        bottomNav.classList.add('visible');
    }
}

function ocultarMenuInferior() {
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
        bottomNav.classList.remove('visible');
    }
}

// Agregar listener para el cambio de tamaño de ventana
window.addEventListener('resize', function() {
    const bottomNav = document.getElementById('bottomNav');
    if (window.innerWidth > 768) {
        ocultarMenuInferior();
    } else {
        mostrarMenuInferior();
    }
});

// Función de cierre de sesión
function logout() {
    window.location.href = '../index.html';
}

// Inicializar el menú inferior en móvil
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        mostrarMenuInferior();
    }
});

// Dashboard
async function actualizarDashboard() {
    try {
        // Actualizar estadísticas
        document.querySelector('.servicios-pendientes .card-valor').textContent = '12';
        document.querySelector('.servicios-hoy .card-valor').textContent = '3';
        document.querySelector('.ganancias-mes .card-valor').textContent = '$5,200';
        document.querySelector('.calificacion .card-valor').textContent = '4.8';

        // Cargar servicios recientes
        const serviciosRecientes = [
            { id: 1, cliente: 'María García', servicio: 'Reparación de tubería', fecha: '2024-03-20', estado: 'Pendiente' },
            { id: 2, cliente: 'Carlos López', servicio: 'Instalación de grifo', fecha: '2024-03-19', estado: 'Completado' },
            { id: 3, cliente: 'Ana Martínez', servicio: 'Mantenimiento general', fecha: '2024-03-18', estado: 'En progreso' }
        ];

        const serviciosLista = document.querySelector('.servicios-recientes-lista');
        serviciosLista.innerHTML = serviciosRecientes.map(servicio => `
            <div class="servicio-item">
                <div class="servicio-info">
                    <h4>${servicio.cliente}</h4>
                    <p>${servicio.servicio}</p>
                    <span class="fecha">${formatearFecha(servicio.fecha)}</span>
                </div>
                <span class="estado ${servicio.estado.toLowerCase()}">${servicio.estado}</span>
            </div>
        `).join('');

        // Cargar próximos servicios
        const proximosServicios = [
            { id: 4, cliente: 'Roberto Sánchez', servicio: 'Revisión de calefacción', fecha: '2024-03-21', hora: '10:00' },
            { id: 5, cliente: 'Laura Torres', servicio: 'Instalación de sanitario', fecha: '2024-03-21', hora: '14:00' }
        ];

        const proximosLista = document.querySelector('.proximos-servicios-lista');
        proximosLista.innerHTML = proximosServicios.map(servicio => `
            <div class="servicio-item">
                <div class="servicio-info">
                    <h4>${servicio.cliente}</h4>
                    <p>${servicio.servicio}</p>
                    <span class="fecha">${formatearFecha(servicio.fecha)} - ${servicio.hora}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al actualizar dashboard:', error);
        mostrarNotificacion('Error al actualizar dashboard', 'error');
    }
}

// Función para cargar el usuario actual
async function cargarUsuarioActual() {
    try {
        // TODO: Reemplazar con llamada al backend
        // const response = await fetch('/api/tecnico/perfil');
        // usuarioActual = await response.json();
        
        // Por ahora, usamos datos de ejemplo
        usuarioActual = {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan@ejemplo.com',
            imagen: 'img/avatar.jpg',
            especialidad: 'Plomería',
            calificacion: 4.8,
            serviciosCompletados: 156,
            ganancias: 25000
        };
        
        actualizarInfoUsuario();
    } catch (error) {
        console.error('Error al cargar usuario:', error);
        mostrarNotificacion('Error al cargar perfil', 'error');
    }
}

// Función para actualizar la información del usuario en la UI
function actualizarInfoUsuario() {
    if (!usuarioActual) return;
    
    document.querySelector('.perfil-nombre').textContent = usuarioActual.nombre;
    document.querySelector('.perfil-email').textContent = usuarioActual.email;
    document.querySelector('.perfil-imagen').src = usuarioActual.imagen;
    
    // Actualizar estadísticas
    document.querySelector('.servicios-completados .estadistica-valor').textContent = usuarioActual.serviciosCompletados;
    document.querySelector('.calificacion-promedio .estadistica-valor').textContent = usuarioActual.calificacion;
    document.querySelector('.ganancias-totales .estadistica-valor').textContent = `$${usuarioActual.ganancias}`;
}

// Función para cargar servicios
async function cargarServicios() {
    const serviciosLista = document.getElementById('servicios-lista');
    const solicitudes = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    
    // Ordenar por fecha de creación (más recientes primero)
    solicitudes.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    
    serviciosLista.innerHTML = solicitudes.map(solicitud => `
        <div class="servicio-item ${solicitud.estado.toLowerCase()}" data-id="${solicitud.id}">
            <div class="servicio-header">
                <h3>${solicitud.servicio}</h3>
                <span class="servicio-estado ${solicitud.estado.toLowerCase()}">${solicitud.estado}</span>
            </div>
            <div class="servicio-info">
                <p><i class="fas fa-user"></i> Cliente: ${solicitud.cliente}</p>
                <p><i class="fas fa-calendar"></i> Fecha: ${new Date(solicitud.fecha).toLocaleDateString()}</p>
                <p><i class="fas fa-map-marker-alt"></i> Ubicación: ${solicitud.ubicacion}</p>
                <p><i class="fas fa-clipboard-list"></i> Descripción: ${solicitud.descripcion}</p>
            </div>
            ${solicitud.imagenes && solicitud.imagenes.length > 0 ? `
                <div class="servicio-archivos">
                    <h4><i class="fas fa-images"></i> Imágenes</h4>
                    <div class="archivos-grid">
                        ${solicitud.imagenes.map(imagen => `
                            <div class="archivo-item">
                                <img src="${imagen.url}" alt="Imagen del servicio">
                                <p class="archivo-descripcion">${imagen.descripcion || 'Sin descripción'}</p>
                                <button class="btn-ver" onclick="verArchivo('${imagen.url}', 'imagen')">
                                    <i class="fas fa-expand"></i> Ver
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${solicitud.videos && solicitud.videos.length > 0 ? `
                <div class="servicio-archivos">
                    <h4><i class="fas fa-video"></i> Videos</h4>
                    <div class="archivos-grid">
                        ${solicitud.videos.map(video => `
                            <div class="archivo-item">
                                <video src="${video.url}" controls>
                                    Tu navegador no soporta el elemento video.
                                </video>
                                <p class="archivo-descripcion">${video.descripcion || 'Sin descripción'}</p>
                                <button class="btn-ver" onclick="verArchivo('${video.url}', 'video')">
                                    <i class="fas fa-expand"></i> Ver
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            <div class="servicio-acciones">
                <button class="btn-detalles" onclick="verDetallesServicio('${solicitud.id}')">
                    <i class="fas fa-eye"></i> Ver detalles
                </button>
                <button class="btn-estado" onclick="actualizarEstadoServicio('${solicitud.id}')">
                    <i class="fas fa-sync"></i> Actualizar estado
                </button>
            </div>
        </div>
    `).join('');

    // Actualizar contador de servicios pendientes
    const serviciosPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
    document.getElementById('serviciosPendientes').textContent = serviciosPendientes;
}

function filtrarServicios() {
    const filtro = document.getElementById('filtroEstado').value;
    const servicios = document.querySelectorAll('.servicio-item');
    
    servicios.forEach(servicio => {
        const estado = servicio.querySelector('.estado').textContent.toLowerCase();
        if (filtro === 'todos' || estado === filtro) {
            servicio.style.display = 'flex';
        } else {
            servicio.style.display = 'none';
        }
    });
}

function ordenarServicios() {
    const serviciosLista = document.querySelector('.servicios-lista');
    const servicios = Array.from(serviciosLista.children);
    
    servicios.sort((a, b) => {
        const fechaA = new Date(a.querySelector('.fecha').textContent);
        const fechaB = new Date(b.querySelector('.fecha').textContent);
        return fechaB - fechaA;
    });
    
    servicios.forEach(servicio => serviciosLista.appendChild(servicio));
}

function verDetallesServicio(id) {
    const solicitud = JSON.parse(localStorage.getItem('solicitudes') || '[]')
        .find(s => s.id === id);
    
    if (!solicitud) return;

    const modal = document.getElementById('modalDetalles');
    const contenido = modal.querySelector('.modal-contenido');
    
    contenido.innerHTML = `
        <div class="modal-header">
            <h2>Detalles del Servicio #${solicitud.id}</h2>
            <button class="btn-cerrar" onclick="cerrarModalDetalles()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="detalles-info">
                <div class="info-grupo">
                    <h3>Información del Cliente</h3>
                    <p><i class="fas fa-user"></i> ${solicitud.cliente}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${solicitud.ubicacion}</p>
                </div>
                
                <div class="info-grupo">
                    <h3>Detalles del Servicio</h3>
                    <p><i class="fas fa-tools"></i> ${solicitud.servicio}</p>
                    <p><i class="fas fa-calendar"></i> ${new Date(solicitud.fecha).toLocaleDateString()}</p>
                    <p><i class="fas fa-clipboard-list"></i> ${solicitud.descripcion}</p>
                    <p><i class="fas fa-info-circle"></i> Estado: <span class="estado ${solicitud.estado.toLowerCase()}">${solicitud.estado}</span></p>
                </div>

                ${solicitud.imagenes && solicitud.imagenes.length > 0 ? `
                    <div class="info-grupo">
                        <h3><i class="fas fa-images"></i> Imágenes</h3>
                        <div class="archivos-grid">
                            ${solicitud.imagenes.map(imagen => `
                                <div class="archivo-item">
                                    <img src="${imagen.url}" alt="Imagen del servicio">
                                    <p class="archivo-descripcion">${imagen.descripcion || 'Sin descripción'}</p>
                                    <button class="btn-ver" onclick="verArchivo('${imagen.url}', 'imagen')">
                                        <i class="fas fa-expand"></i> Ver en pantalla completa
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${solicitud.videos && solicitud.videos.length > 0 ? `
                    <div class="info-grupo">
                        <h3><i class="fas fa-video"></i> Videos</h3>
                        <div class="archivos-grid">
                            ${solicitud.videos.map(video => `
                                <div class="archivo-item">
                                    <video src="${video.url}" controls>
                                        Tu navegador no soporta el elemento video.
                                    </video>
                                    <p class="archivo-descripcion">${video.descripcion || 'Sin descripción'}</p>
                                    <button class="btn-ver" onclick="verArchivo('${video.url}', 'video')">
                                        <i class="fas fa-expand"></i> Ver en pantalla completa
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-secundario" onclick="cerrarModalDetalles()">Cerrar</button>
            <button class="btn-primario" onclick="actualizarEstadoServicio('${solicitud.id}')">
                <i class="fas fa-sync"></i> Actualizar Estado
            </button>
        </div>
    `;
    
    modal.classList.add('activo');
}

function verArchivo(url, tipo) {
    const modal = document.createElement('div');
    modal.className = 'modal-archivo';
    modal.innerHTML = `
        <div class="modal-archivo-contenido">
            <button class="btn-cerrar" onclick="this.closest('.modal-archivo').remove()">
                <i class="fas fa-times"></i>
            </button>
            ${tipo === 'imagen' 
                ? `<img src="${url}" alt="Vista completa">`
                : `<video src="${url}" controls autoplay></video>`
            }
        </div>
    `;
    document.body.appendChild(modal);
}

// Función para actualizar el estado de un servicio
async function actualizarEstadoServicio(id) {
    try {
        const solicitudes = JSON.parse(localStorage.getItem('solicitudes') || '[]');
        const solicitud = solicitudes.find(s => s.id === id);
        
        if (solicitud) {
            // Simular actualización de estado
            const estados = ['Pendiente', 'En progreso', 'Completado'];
            const estadoActual = estados.indexOf(solicitud.estado);
            const nuevoEstado = estados[(estadoActual + 1) % estados.length];
            
            // TODO: Reemplazar con llamada al backend
            // const response = await fetch(`/api/tecnico/servicios/${id}/estado`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ estado: nuevoEstado })
            // });
            // const data = await response.json();
            
            solicitud.estado = nuevoEstado;
            localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
            
            // Actualizar UI
            cargarServicios();
            mostrarNotificacion('Estado actualizado', `El servicio #${id} ahora está ${nuevoEstado.toLowerCase()}`, 'exito');
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        mostrarNotificacion('Error al actualizar estado', 'error');
    }
}

// Calendario
function inicializarCalendario() {
    const fecha = new Date();
    const mes = fecha.getMonth();
    const año = fecha.getFullYear();

    actualizarCalendario(mes, año);

    // Event listeners para controles del calendario
    document.querySelector('.btn-mes-anterior').addEventListener('click', () => {
        fecha.setMonth(fecha.getMonth() - 1);
        actualizarCalendario(fecha.getMonth(), fecha.getFullYear());
    });

    document.querySelector('.btn-mes-siguiente').addEventListener('click', () => {
        fecha.setMonth(fecha.getMonth() + 1);
        actualizarCalendario(fecha.getMonth(), fecha.getFullYear());
    });
}

function actualizarCalendario(mes, año) {
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    document.querySelector('.mes-actual').textContent = `${nombresMeses[mes]} ${año}`;

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicio = primerDia.getDay();

    const calendarioGrid = document.querySelector('.calendario-grid');
    calendarioGrid.innerHTML = '';

    // Agregar días de la semana
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    diasSemana.forEach(dia => {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia-semana';
        diaElement.textContent = dia;
        calendarioGrid.appendChild(diaElement);
    });

    // Agregar días del mes
    for (let i = 0; i < diaInicio; i++) {
        const diaVacio = document.createElement('div');
        diaVacio.className = 'dia-vacio';
        calendarioGrid.appendChild(diaVacio);
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia';
        diaElement.textContent = dia;

        // Agregar eventos si existen
        const eventos = obtenerEventosDia(dia, mes, año);
        if (eventos.length > 0) {
            const eventosContainer = document.createElement('div');
            eventosContainer.className = 'eventos-dia';
            eventos.forEach(evento => {
                const eventoElement = document.createElement('div');
                eventoElement.className = 'evento';
                eventoElement.textContent = evento.titulo;
                eventosContainer.appendChild(eventoElement);
            });
            diaElement.appendChild(eventosContainer);
        }

        calendarioGrid.appendChild(diaElement);
    }
}

function obtenerEventosDia(dia, mes, año) {
    // Aquí iría la lógica para obtener los eventos del día
    return [
        { titulo: 'Reparación tubería', hora: '10:00' },
        { titulo: 'Instalación grifo', hora: '14:00' }
    ];
}

// Mensajes
function cargarMensajes() {
    const conversaciones = [
        { id: 1, nombre: 'María García', ultimoMensaje: '¿A qué hora llegas?', hora: '10:30', noLeidos: 2 },
        { id: 2, nombre: 'Carlos López', ultimoMensaje: 'Gracias por el servicio', hora: 'Ayer', noLeidos: 0 },
        { id: 3, nombre: 'Ana Martínez', ultimoMensaje: 'Necesito una cotización', hora: 'Lunes', noLeidos: 1 }
    ];

    const conversacionesLista = document.querySelector('.conversaciones-lista');
    conversacionesLista.innerHTML = conversaciones.map(conversacion => `
        <div class="conversacion-item" onclick="seleccionarConversacion(${conversacion.id})">
            <div class="conversacion-info">
                <h4>${conversacion.nombre}</h4>
                <p>${conversacion.ultimoMensaje}</p>
            </div>
            <div class="conversacion-meta">
                <span class="hora">${conversacion.hora}</span>
                ${conversacion.noLeidos > 0 ? `<span class="no-leidos">${conversacion.noLeidos}</span>` : ''}
            </div>
        </div>
    `).join('');

    // Event listener para búsqueda
    document.querySelector('.buscar-chat input').addEventListener('input', filtrarConversaciones);
}

function filtrarConversaciones(e) {
    const busqueda = e.target.value.toLowerCase();
    document.querySelectorAll('.conversacion-item').forEach(item => {
        const nombre = item.querySelector('h4').textContent.toLowerCase();
        item.style.display = nombre.includes(busqueda) ? 'flex' : 'none';
    });
}

function seleccionarConversacion(id) {
    // Aquí iría la lógica para cargar la conversación seleccionada
    mostrarNotificacion('Conversación cargada', 'info');
}

// Finanzas
function actualizarFinanzas() {
    // Actualizar resumen
    document.querySelector('.ganancias-totales .valor').textContent = '$25,000';
    document.querySelector('.servicios-mes .valor').textContent = '24';
    document.querySelector('.promedio-servicio .valor').textContent = '$1,042';
    document.querySelector('.clientes-nuevos .valor').textContent = '8';

    // Cargar historial de pagos
    const pagos = [
        { id: 1, cliente: 'María García', servicio: 'Reparación de tubería', fecha: '2024-03-20', monto: 150 },
        { id: 2, cliente: 'Carlos López', servicio: 'Instalación de grifo', fecha: '2024-03-19', monto: 200 },
        { id: 3, cliente: 'Ana Martínez', servicio: 'Mantenimiento general', fecha: '2024-03-18', monto: 300 }
    ];

    const pagosLista = document.querySelector('.pagos-lista');
    pagosLista.innerHTML = pagos.map(pago => `
        <div class="pago-item">
            <div class="pago-info">
                <h4>${pago.cliente}</h4>
                <p>${pago.servicio}</p>
                <span class="fecha">${formatearFecha(pago.fecha)}</span>
            </div>
            <div class="pago-monto">
                $${pago.monto}
            </div>
        </div>
    `).join('');

    // Event listener para filtro de período
    document.querySelector('.filtro-periodo').addEventListener('change', filtrarPagos);
}

function filtrarPagos() {
    const periodo = document.querySelector('.filtro-periodo').value;
    // Aquí iría la lógica para filtrar los pagos según el período
    mostrarNotificacion('Pagos filtrados', 'info');
}

// Perfil
async function cargarPerfil() {
    try {
        // Cargar información del perfil
        document.querySelector('.perfil-nombre').textContent = usuarioActual.nombre;
        document.querySelector('.perfil-email').textContent = usuarioActual.email;
        document.querySelector('.perfil-imagen').src = usuarioActual.imagen;

        // Cargar estadísticas
        document.querySelector('.servicios-completados .estadistica-valor').textContent = usuarioActual.serviciosCompletados;
        document.querySelector('.calificacion-promedio .estadistica-valor').textContent = usuarioActual.calificacion;
        document.querySelector('.ganancias-totales .estadistica-valor').textContent = `$${usuarioActual.ganancias}`;

        // Event listeners para formulario
        document.querySelector('.form-perfil').addEventListener('submit', actualizarPerfil);
        document.querySelector('.cambiar-imagen').addEventListener('click', mostrarModalImagen);
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        mostrarNotificacion('Error al cargar perfil', 'error');
    }
}

function actualizarPerfil(e) {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    mostrarNotificacion('Perfil actualizado correctamente', 'exito');
}

function mostrarModalImagen() {
    const modal = document.querySelector('.modal-imagen');
    modal.classList.add('activo');

    // Event listeners para el modal
    document.querySelector('.btn-cerrar').addEventListener('click', () => {
        modal.classList.remove('activo');
    });

    document.querySelector('.btn-subir').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector('.vista-previa img').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    document.querySelector('.btn-guardar-imagen').addEventListener('click', () => {
        // Aquí iría la lógica para guardar la imagen
        mostrarNotificacion('Imagen actualizada correctamente', 'exito');
        modal.classList.remove('activo');
    });
}

// Utilidades
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'exito' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
    `;

    document.getElementById('contenedorNotificaciones').appendChild(notificacion);

    // Activar animación
    setTimeout(() => {
        notificacion.classList.add('activa');
    }, 100);

    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('activa');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    // Cargar usuario actual
    await cargarUsuarioActual();
    
    // Cargar servicios
    await cargarServicios();
    
    // Inicializar el menú inferior en móvil
    if (window.innerWidth <= 768) {
        mostrarMenuInferior();
    }
    
    // Actualizar el dashboard
    await actualizarDashboard();
}); 