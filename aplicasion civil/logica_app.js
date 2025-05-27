/****************** FUNCIONALIDAD GENERAL DE PÁGINAS ******************/
function cambiarPagina(idPagina) {
    document.querySelectorAll('.pagina').forEach(pagina => {
      pagina.classList.remove('activa');
    });
    document.getElementById(idPagina).classList.add('activa');
  }
  
  /****************** SELECCIÓN DE TIPO DE USUARIO ******************/
  function seleccionarTipoUsuario(tipo) {
    if (tipo === 'cliente') {
      cambiarPagina('loginCliente');
    } else {
      cambiarPagina('loginTecnico');
    }
  }
  
  /****************** LOGIN CLIENTE ******************/
  document.getElementById("formLoginCliente").addEventListener("submit", function(e) {
    e.preventDefault();
    // Aquí irá la lógica de autenticación cuando implementemos el backend
    cambiarPagina('solicitudServicio');
    mostrarMenuInferior();
  });
  
  /****************** LOGIN TÉCNICO ******************/
  document.getElementById("formLoginTecnico").addEventListener("submit", function(e) {
    e.preventDefault();
    // Aquí irá la lógica de autenticación cuando implementemos el backend
    window.location.href = 'tecnico/index.html';
  });
  
  /****************** REGISTRO CLIENTE ******************/
  document.getElementById("formRegistroCliente").addEventListener("submit", function(e) {
    e.preventDefault();
    const mensaje = document.getElementById("mensajeExitoCliente");
    mensaje.classList.remove("oculto");
  
    setTimeout(() => {
      cambiarPagina('solicitudServicio');
      mostrarMenuInferior();
    }, 2000);
  });
  
  /****************** REGISTRO TÉCNICO ******************/
  document.getElementById("formRegistroTecnico").addEventListener("submit", function(e) {
    e.preventDefault();
    const mensaje = document.getElementById("mensajeExitoTecnico");
    mensaje.classList.remove("oculto");
  
    setTimeout(() => {
      window.location.href = 'tecnico/index.html';
    }, 2000);
  });
  
  /****************** GUARDAR PERFIL ******************/
  document.getElementById('formPerfil').addEventListener("submit", function(e) {
    e.preventDefault();
  
    // Obtener los valores del formulario
    const formData = new FormData(this);
    const datos = Object.fromEntries(formData.entries());

    // Validar los datos
    if (!validarDatosPerfil(datos)) {
      return;
    }

    // Mostrar notificación de éxito
    mostrarExito(
      "Perfil Actualizado",
      "Tus datos han sido guardados correctamente."
    );

    // Actualizar la información mostrada
    actualizarInfoPerfil(datos);

    // Redirigir a la sección de nueva solicitud después de 2 segundos
    setTimeout(() => {
      mostrarSeccion('nueva-solicitud');
    }, 2000);
  });
  
  function validarDatosPerfil(datos) {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
      mostrarError(
        "Error de Validación",
        "Por favor, ingresa un correo electrónico válido."
      );
      return false;
    }

    // Validar teléfono (formato básico)
    const telefonoRegex = /^\d{3}[-]?\d{3}[-]?\d{4}$/;
    if (!telefonoRegex.test(datos.telefono)) {
      mostrarError(
        "Error de Validación",
        "Por favor, ingresa un número de teléfono válido (formato: 123-456-7890)."
      );
      return false;
    }

    return true;
  }

  function actualizarInfoPerfil(datos) {
    // Actualizar el nombre en el perfil
    document.querySelector('.perfil-nombre').textContent = datos.nombre;
    
    // Actualizar el email en el perfil
    document.querySelector('.perfil-email').innerHTML = `
      <i class="fas fa-envelope"></i>
      ${datos.email}
    `;
  }
  
  /****************** CERRAR SESIÓN ******************/
  function logout() {
    cambiarPagina('pantallaInicio');
    ocultarMenuInferior();
  }
  
  /****************** FORMULARIO DE SERVICIO ******************/
  document.getElementById("formServicio").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    // Obtener los valores del formulario
    const formData = new FormData(this);
    const datos = Object.fromEntries(formData.entries());
    
    // Generar ID único para la solicitud
    const numeroSolicitud = Math.floor(10000 + Math.random() * 90000);
    
    // Crear objeto de solicitud
    const solicitud = {
        id: numeroSolicitud,
        cliente: document.getElementById('userName').textContent,
        servicio: document.getElementById('servicioEspecifico').value,
        categoria: datos.categoria,
        ubicacion: datos.ubicacion,
        fecha: datos.fecha,
        descripcion: datos.descripcion,
        estado: 'Pendiente',
        fechaCreacion: new Date().toISOString(),
        imagenes: [], // Aquí se guardarían las imágenes
        videos: [] // Aquí se guardarían los videos
    };

    try {
        // TODO: Reemplazar con llamada al backend
        // const response = await fetch('/api/solicitudes', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(solicitud)
        // });
        // const data = await response.json();

        // Por ahora, simulamos el almacenamiento en localStorage
        const solicitudes = JSON.parse(localStorage.getItem('solicitudes') || '[]');
        solicitudes.push(solicitud);
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));

        // Actualizar la UI
        document.getElementById("numeroSolicitud").textContent = numeroSolicitud;
        const mensaje = document.getElementById("mensajeConfirmacion");
        mensaje.classList.remove("oculto");
        this.style.display = "none";

        // Notificar al técnico (simulado)
        mostrarNotificacion(
            'Nueva solicitud',
            `Se ha recibido una nueva solicitud de servicio #${numeroSolicitud}`,
            'info'
        );
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        mostrarNotificacion(
            'Error',
            'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.',
            'error'
        );
    }
  });
  
  function volverAlPanel() {
    const formServicio = document.getElementById("formServicio");
    const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");
    
    // Restaurar el formulario
    formServicio.style.display = "block";
    formServicio.reset();
    
    // Ocultar el mensaje de confirmación
    mensajeConfirmacion.classList.add("oculto");
    
    // Mostrar notificación de éxito
    mostrarExito(
      "Solicitud Enviada",
      "Tu solicitud ha sido registrada correctamente. Un técnico se pondrá en contacto contigo pronto."
    );
  }
  
  /****************** MOSTRAR SECCIONES Y MENÚ ******************/
  function mostrarSeccion(idSeccion) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('activo'));
    document.querySelectorAll('.bottom-nav-link').forEach(link => link.classList.remove('activo'));
    
    event.currentTarget.classList.add('activo');
  
    document.querySelectorAll('.seccion').forEach(seccion => seccion.classList.remove('activa'));
    document.getElementById(idSeccion).classList.add('activa');

    // Cargar el historial cuando se muestre esa sección
    if (idSeccion === 'historial') {
      cargarHistorial();
    }
    // Cargar el blog cuando se muestre esa sección
    if (idSeccion === 'blog') {
      cargarBlog();
    }
  }
  
  /****************** TOGGLE DEL MENÚ MÓVIL ******************/
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
  
  /****************** FUNCIONALIDAD DE HISTORIAL Y CALIFICACIONES ******************/
  
  function filtrarHistorial() {
    const filtro = document.getElementById('filtroHistorial').value;
    const solicitudes = document.querySelectorAll('.solicitud-item');
    
    solicitudes.forEach(solicitud => {
      switch(filtro) {
        case 'completados':
          solicitud.style.display = solicitud.classList.contains('completada') ? 'block' : 'none';
          break;
        case 'pendientes':
          solicitud.style.display = !solicitud.classList.contains('completada') ? 'block' : 'none';
          break;
        default:
          solicitud.style.display = 'block';
      }
    });
  }
  
  function ordenarHistorial() {
    const lista = document.querySelector('.historial-lista');
    const solicitudes = Array.from(lista.children);
    
    solicitudes.sort((a, b) => {
      const fechaA = new Date(a.querySelector('.solicitud-detalles p').textContent.split(': ')[1]);
      const fechaB = new Date(b.querySelector('.solicitud-detalles p').textContent.split(': ')[1]);
      return fechaB - fechaA;
    });
    
    solicitudes.forEach(solicitud => lista.appendChild(solicitud));
  }
  
  function editarCalificacionHistorial(idSolicitud) {
    // Implementación de la edición de calificación en el historial
  }
  
  function guardarCalificacionHistorial(idSolicitud) {
    // Implementación del guardado de calificación en el historial
  }
  
  // Función para mostrar modal de imagen
  function mostrarModalImagen() {
    const modal = document.getElementById('modalImagen');
    modal.classList.add('activo');
    document.body.style.overflow = 'hidden';
  }
  
  // Función para cerrar modal de imagen
  function cerrarModalImagen() {
    const modal = document.getElementById('modalImagen');
    modal.classList.remove('activo');
    document.body.style.overflow = '';
    // Limpiar el input de archivo
    document.getElementById('imagenPerfil').value = '';
    // Restaurar la vista previa
    document.getElementById('vistaPreviaImagen').src = './img/imagen acerca 1.png';
  }
  
  // Función para previsualizar imagen
  function previsualizarImagen(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const vistaPrevia = document.getElementById('vistaPreviaImagen');
            vistaPrevia.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
  }
  
  // Función para guardar imagen de perfil
  function guardarImagenPerfil(event) {
    event.preventDefault();
    const fileInput = document.getElementById('imagenPerfil');
    const file = fileInput.files[0];
    
    if (!file) {
        mostrarError('Error', 'Por favor selecciona una imagen');
        return;
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
        mostrarError('Error', 'Solo se permiten imágenes en formato JPG, PNG o WEBP');
        return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
        mostrarError('Error', 'La imagen no debe superar los 5MB');
        return;
    }

    // Aquí iría la lógica para subir la imagen al servidor
    // Por ahora, simularemos una subida exitosa
    setTimeout(() => {
        // Actualizar la imagen de perfil en la interfaz
        const perfilImagen = document.querySelector('.perfil-imagen');
        perfilImagen.src = document.getElementById('vistaPreviaImagen').src;
        
        // Mostrar mensaje de éxito
        mostrarExito('Imagen actualizada', 'Tu foto de perfil ha sido actualizada correctamente');
        
        // Cerrar el modal
        cerrarModalImagen();
    }, 1000);
  }
  
  // Función para responder mensaje
  function responderMensaje(idMensaje) {
    const mensaje = document.querySelector(`.mensaje-item[data-id="${idMensaje}"]`);
    if (mensaje) {
      const destinatario = mensaje.querySelector('.mensaje-detalles p:first-child').textContent.split(': ')[1];
      const asunto = mensaje.querySelector('.mensaje-detalles p:nth-child(2)').textContent.split(': ')[1];
      
      // Aquí iría la lógica para abrir el formulario de respuesta
      // Por ahora solo mostraremos un alert con la información
      alert(`Responder a: ${destinatario}\nAsunto: Re: ${asunto}`);
    }
  }
  
  // Función para cambiar el estado de una solicitud
  function cambiarEstadoSolicitud(idSolicitud, nuevoEstado) {
    const solicitudItem = document.querySelector(`.solicitud-item[data-id="${idSolicitud}"]`);
    if (solicitudItem) {
      // Actualizar el estado visual
      const estadoElement = solicitudItem.querySelector('.solicitud-estado');
      estadoElement.textContent = nuevoEstado;
      estadoElement.className = 'solicitud-estado ' + nuevoEstado.toLowerCase();

      // Actualizar la clase del contenedor
      solicitudItem.className = `solicitud-item ${nuevoEstado.toLowerCase()}`;

      // Actualizar los botones de acción
      const accionesDiv = solicitudItem.querySelector('.solicitud-acciones');
      if (nuevoEstado === 'Pendiente') {
        accionesDiv.innerHTML = `
          <button class="btn-detalles" onclick="mostrarDetallesSolicitud('${idSolicitud}')">
            <i class="fas fa-eye"></i> Ver detalles
          </button>
          <button class="btn-cancelar" onclick="cancelarSolicitud('${idSolicitud}')">
            <i class="fas fa-times"></i> Cancelar
          </button>
        `;
      } else if (nuevoEstado === 'Completada') {
        accionesDiv.innerHTML = `
          <button class="btn-detalles" onclick="mostrarDetallesSolicitud('${idSolicitud}')">
            <i class="fas fa-eye"></i> Ver detalles
          </button>
          <button class="btn-calificar" onclick="mostrarFormularioCalificacion(this)">
            <i class="fas fa-star"></i> Calificar
          </button>
        `;
      }
    }
  }
  
  // Funciones para manejar notificaciones
  function mostrarNotificacion(tipo, titulo, mensaje, duracion = 5000) {
    const contenedor = document.getElementById('contenedorNotificaciones');
    const notificacion = document.createElement('div');
    notificacion.className = `modal-notificacion ${tipo}`;
    
    // Iconos según el tipo de notificación
    const iconos = {
        exito: 'fa-check-circle',
        error: 'fa-times-circle',
        advertencia: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    notificacion.innerHTML = `
        <div class="modal-notificacion-icono">
            <i class="fas ${iconos[tipo]}"></i>
        </div>
        <div class="modal-notificacion-contenido">
            <div class="modal-notificacion-titulo">${titulo}</div>
            <div class="modal-notificacion-mensaje">${mensaje}</div>
        </div>
        <button class="modal-notificacion-cerrar" onclick="cerrarNotificacion(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    contenedor.appendChild(notificacion);
    
    // Activar la notificación con un pequeño retraso para la animación
    setTimeout(() => {
        notificacion.classList.add('activo');
    }, 10);

    // Cerrar automáticamente después de la duración especificada
    if (duracion > 0) {
        setTimeout(() => {
            cerrarNotificacion(notificacion.querySelector('.modal-notificacion-cerrar'));
        }, duracion);
    }
  }

  function cerrarNotificacion(boton) {
    const notificacion = boton.closest('.modal-notificacion');
    notificacion.classList.remove('activo');
    
    // Esperar a que termine la animación antes de eliminar el elemento
    setTimeout(() => {
        notificacion.remove();
    }, 300);
  }

  // Funciones de utilidad para mostrar diferentes tipos de notificaciones
  function mostrarExito(titulo, mensaje, duracion = 5000) {
    mostrarNotificacion('exito', titulo, mensaje, duracion);
  }

  function mostrarError(titulo, mensaje, duracion = 5000) {
    mostrarNotificacion('error', titulo, mensaje, duracion);
  }

  function mostrarAdvertencia(titulo, mensaje, duracion = 5000) {
    mostrarNotificacion('advertencia', titulo, mensaje, duracion);
  }

  function mostrarInfo(titulo, mensaje, duracion = 5000) {
    mostrarNotificacion('info', titulo, mensaje, duracion);
  }

  /****************** MANEJO DEL MENÚ INFERIOR ******************/
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
    } else if (document.getElementById('solicitudServicio').classList.contains('activa')) {
      mostrarMenuInferior();
    }
  });
  
  function mostrarDetallesSolicitud(idSolicitud) {
    const solicitud = document.querySelector(`.solicitud-item[data-id="${idSolicitud}"]`);
    const modal = document.getElementById('modalDetalles');
    
    // Obtener los datos de la solicitud
    const numero = solicitud.querySelector('.solicitud-numero').textContent;
    const estado = solicitud.querySelector('.solicitud-estado').textContent;
    const fecha = solicitud.querySelector('.solicitud-detalles p:nth-child(2)').textContent.replace('Fecha: ', '');
    const ubicacion = solicitud.querySelector('.solicitud-detalles p:nth-child(3)').textContent.replace('Ubicación: ', '');
    const tecnico = solicitud.querySelector('.solicitud-detalles p:nth-child(4)').textContent.replace('Técnico: ', '');
    const servicio = solicitud.querySelector('.solicitud-detalles h4').textContent;

    // Simular datos de calificación del técnico (esto vendría del backend)
    const calificacionTecnico = {
      promedio: 4.8,
      totalTrabajos: 10
    };

    // Actualizar el contenido del modal
    document.getElementById('detalleNumero').textContent = numero.replace('#', '');
    document.getElementById('detalleEstado').textContent = estado;
    document.getElementById('detalleEstado').className = `solicitud-estado ${estado.toLowerCase()}`;
    document.getElementById('detalleFecha').textContent = fecha;
    document.getElementById('detalleDireccion').textContent = ubicacion;
    document.getElementById('detalleServicio').textContent = servicio;
    
    // Actualizar la información del técnico con su calificación
    const tecnicoInfo = document.getElementById('detalleTecnico');
    tecnicoInfo.innerHTML = `
      <div class="tecnico-info">
        <span>${tecnico}</span>
        <div class="tecnico-calificacion">
          <i class="fas fa-star"></i>
          <span class="promedio">${calificacionTecnico.promedio}</span>
          <span class="total">(${calificacionTecnico.totalTrabajos} trabajos)</span>
        </div>
      </div>
    `;

    // Cargar archivos (imágenes y videos)
    const imagenesContainer = document.getElementById('detalleImagenes');
    const videosContainer = document.getElementById('detalleVideos');
    
    // Limpiar contenedores
    imagenesContainer.innerHTML = '';
    videosContainer.innerHTML = '';

    // Aquí iría la lógica para obtener los archivos del backend
    // Por ahora, usaremos datos de ejemplo que coinciden con el formulario
    const archivos = {
      imagenes: [
        { 
          url: './img/ejemplo1.jpg', 
          nombre: 'Imagen del lugar o problema',
          tipo: 'image/*',
          requerido: true
        }
      ],
      videos: [
        { 
          url: './videos/ejemplo1.mp4', 
          nombre: 'Video explicativo',
          tipo: 'video/*',
          requerido: false
        }
      ]
    };

    // Cargar imágenes
    if (archivos.imagenes.length > 0) {
      archivos.imagenes.forEach(imagen => {
        const imagenItem = document.createElement('div');
        imagenItem.className = 'archivo-item';
        imagenItem.innerHTML = `
          <img src="${imagen.url}" alt="${imagen.nombre}">
          <div class="archivo-info">
            <i class="fas fa-image"></i>
            <span>${imagen.nombre}</span>
            ${imagen.requerido ? '<span class="requerido">(Requerido)</span>' : ''}
          </div>
          <button class="btn-ver" onclick="verArchivo('${imagen.url}', 'imagen')">
            <i class="fas fa-expand"></i>
            Ver
          </button>
        `;
        imagenesContainer.appendChild(imagenItem);
      });
    } else {
      imagenesContainer.innerHTML = '<p class="no-archivos">No hay imágenes adjuntas</p>';
    }

    // Cargar videos
    if (archivos.videos.length > 0) {
      archivos.videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'archivo-item';
        videoItem.innerHTML = `
          <video src="${video.url}" controls>
            Tu navegador no soporta el elemento video.
          </video>
          <div class="archivo-info">
            <i class="fas fa-video"></i>
            <span>${video.nombre}</span>
            ${video.requerido ? '<span class="requerido">(Requerido)</span>' : ''}
          </div>
          <button class="btn-ver" onclick="verArchivo('${video.url}', 'video')">
            <i class="fas fa-expand"></i>
            Ver
          </button>
        `;
        videosContainer.appendChild(videoItem);
      });
    } else {
      videosContainer.innerHTML = '<p class="no-archivos">No hay videos adjuntos</p>';
    }

    // Mostrar el modal
    modal.classList.remove('oculto');
  }

  // Función para ver archivos en pantalla completa
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

  function cerrarModalDetalles() {
    const modal = document.getElementById('modalDetalles');
    modal.classList.add('oculto');
  }

  function editarCalificacion(idSolicitud) {
    const solicitud = document.querySelector(`.solicitud-item[data-id="${idSolicitud}"]`);
    const calificacionExistente = solicitud.querySelector('.calificacion-existente');
    
    // Crear el formulario de edición
    const formulario = document.createElement('div');
    formulario.className = 'formulario-calificacion';
    formulario.innerHTML = `
      <div class="calificacion-estrellas">
        ${Array(5).fill().map((_, i) => `
          <i class="fas fa-star" data-valor="${i + 1}"></i>
        `).join('')}
      </div>
      <textarea placeholder="Escribe tu comentario...">${calificacionExistente.querySelector('.comentario-calificacion').textContent}</textarea>
      <div class="formulario-acciones">
        <button type="button" class="btn-guardar" onclick="guardarCalificacion('${idSolicitud}', this)">
          <i class="fas fa-save"></i> Guardar
        </button>
        <button type="button" class="btn-cancelar" onclick="cancelarEdicionCalificacion(this)">
          Cancelar
        </button>
      </div>
    `;

    // Reemplazar la calificación existente con el formulario
    calificacionExistente.replaceWith(formulario);

    // Marcar las estrellas actuales
    const estrellasActuales = calificacionExistente.querySelectorAll('.fa-star').length;
    const nuevasEstrellas = formulario.querySelectorAll('.fa-star');
    nuevasEstrellas.forEach((estrella, index) => {
      if (index < estrellasActuales) {
        estrella.classList.add('activa');
      }
    });

    // Agregar eventos a las estrellas
    nuevasEstrellas.forEach(estrella => {
      estrella.addEventListener('click', function() {
        const valor = parseInt(this.dataset.valor);
        nuevasEstrellas.forEach((s, i) => {
          s.classList.toggle('activa', i < valor);
        });
      });
    });
  }

  function guardarCalificacion(idSolicitud, btn) {
    const formulario = btn.closest('.formulario-calificacion');
    const estrellas = formulario.querySelectorAll('.fa-star.activa').length;
    const comentario = formulario.querySelector('textarea').value;

    // Aquí iría la lógica para guardar en el backend
    
    // Actualizar la UI
    const calificacionExistente = document.createElement('div');
    calificacionExistente.className = 'calificacion-existente';
    calificacionExistente.innerHTML = `
      <div class="estrellas">
        ${Array(estrellas).fill().map(() => '<i class="fas fa-star"></i>').join('')}
      </div>
      <p class="comentario-calificacion">${comentario}</p>
    `;

    formulario.replaceWith(calificacionExistente);
    mostrarNotificacion('exito', 'Calificación actualizada', 'Tu calificación ha sido guardada correctamente.');
  }

  function cancelarEdicionCalificacion(btn) {
    const formulario = btn.closest('.formulario-calificacion');
    const solicitud = formulario.closest('.solicitud-item');
    
    // Restaurar la calificación original
    const calificacionExistente = document.createElement('div');
    calificacionExistente.className = 'calificacion-existente';
    calificacionExistente.innerHTML = `
      <div class="estrellas">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>
      <p class="comentario-calificacion">Excelente trabajo, muy profesional y puntual.</p>
    `;

    formulario.replaceWith(calificacionExistente);
  }
  
  // Mapeo de categorías a subservicios
  const subservicios = {
    remodelacion: [
      "Remodelación de Baño",
      "Remodelación de Cocina",
      "Remodelación de Habitación",
      "Remodelación de Sala",
      "Remodelación de Oficina",
      "Remodelación de Local Comercial",
      "Remodelación de Terraza",
      "Remodelación de Jardín",
      "Remodelación de Garaje",
      "Remodelación de Área de Lavado",
      "Remodelación de Escaleras",
      "Remodelación de Fachada",
      "Remodelación de Piscina",
      "Remodelación de Área de BBQ",
      "Remodelación de Área de Estudio"
    ],
    electricidad: [
      "Instalación Eléctrica Nueva",
      "Reparación de Cortocircuito",
      "Instalación de Lámparas",
      "Instalación de Ventilador",
      "Instalación de Aire Acondicionado",
      "Reparación de Enchufes",
      "Instalación de Paneles Solares",
      "Instalación de Sistema de Seguridad",
      "Instalación de Cámaras de Seguridad",
      "Instalación de Intercomunicador",
      "Instalación de Timbre Eléctrico",
      "Reparación de Tablero Eléctrico",
      "Instalación de Toma de Tierra",
      "Instalación de UPS/Respaldo",
      "Instalación de Iluminación LED"
    ],
    pintura: [
      "Pintura de Interior",
      "Pintura de Exterior",
      "Pintura de Fachada",
      "Pintura de Muebles",
      "Pintura de Paredes",
      "Pintura de Techos",
      "Pintura de Piscina",
      "Pintura de Garaje",
      "Pintura de Escaleras",
      "Pintura de Rejas",
      "Pintura de Puertas",
      "Pintura de Ventanas",
      "Pintura de Muros",
      "Pintura de Estructuras Metálicas",
      "Pintura de Pisos"
    ],
    plomeria: [
      "Reparación de Fuga",
      "Instalación de Grifo",
      "Instalación de Ducha",
      "Reparación de Tubería",
      "Instalación de Inodoro",
      "Limpieza de Desagüe",
      "Instalación de Calentador",
      "Instalación de Filtro de Agua",
      "Instalación de Sistema de Riego",
      "Reparación de Bomba de Agua",
      "Instalación de Tanque de Agua",
      "Reparación de Tubería Principal",
      "Instalación de Sistema de Agua Caliente",
      "Instalación de Sistema de Agua Fría",
      "Reparación de Válvulas"
    ],
    limpieza: [
      "Limpieza de Casa",
      "Limpieza de Oficina",
      "Limpieza de Local Comercial",
      "Limpieza Post-Obra",
      "Limpieza de Alfombras",
      "Limpieza de Ventanas",
      "Limpieza de Piscina",
      "Limpieza de Fachada",
      "Limpieza de Techo",
      "Limpieza de Garaje",
      "Limpieza de Jardín",
      "Limpieza de Tanques de Agua",
      "Limpieza de Conductos de Aire",
      "Limpieza de Muebles",
      "Limpieza Profunda de Cocina"
    ],
    carpinteria: [
      "Fabricación de Muebles",
      "Reparación de Muebles",
      "Instalación de Puertas",
      "Instalación de Ventanas",
      "Reparación de Gabinetes",
      "Instalación de Estantes",
      "Fabricación de Clósets",
      "Fabricación de Cocina Integral",
      "Instalación de Molduras",
      "Fabricación de Escaleras",
      "Fabricación de Pergolas",
      "Fabricación de Deck",
      "Fabricación de Muebles de Jardín",
      "Fabricación de Muebles de Oficina",
      "Fabricación de Muebles de Terraza"
    ],
    ventaneria: [
      "Instalación de Ventanas",
      "Reparación de Ventanas",
      "Instalación de Persianas",
      "Instalación de Cortinas",
      "Reparación de Cerraduras",
      "Instalación de Mosquiteros",
      "Instalación de Vidrios Templados",
      "Instalación de Ventanas de Seguridad",
      "Instalación de Ventanas de Aluminio",
      "Instalación de Ventanas de PVC",
      "Instalación de Ventanas de Madera",
      "Instalación de Ventanas de Vidrio Espejo",
      "Instalación de Ventanas de Doble Panel",
      "Instalación de Ventanas de Control Solar",
      "Instalación de Ventanas de Seguridad Antirrobo"
    ]
  };

  // Agregar event listeners para las categorías
  document.querySelectorAll('input[name="categoria"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const categoria = this.value;
      const selectServicio = document.getElementById('servicioEspecifico');
      
      // Limpiar opciones actuales
      selectServicio.innerHTML = '<option value="">Selecciona un tipo de servicio específico</option>';
      
      // Agregar nuevas opciones
      if (subservicios[categoria]) {
        subservicios[categoria].forEach(servicio => {
          const option = document.createElement('option');
          option.value = servicio.toLowerCase().replace(/\s+/g, '-');
          option.textContent = servicio;
          selectServicio.appendChild(option);
        });
      }
    });
  });
  
  function actualizarVisualizacionTecnico(solicitudItem, tecnico, calificacion) {
    const tecnicoElement = solicitudItem.querySelector('.solicitud-detalles p:nth-child(4)');
    tecnicoElement.innerHTML = `
      <i class="fas fa-user"></i>
      <div class="tecnico-info">
        <span>Técnico: ${tecnico}</span>
        ${calificacion ? `
          <div class="tecnico-calificacion">
            <i class="fas fa-star"></i>
            <span class="promedio">${calificacion.promedio}</span>
            <span class="total">(${calificacion.totalTrabajos} trabajos)</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Función para cargar las calificaciones de los técnicos
  function cargarCalificacionesTecnicos() {
    const solicitudes = document.querySelectorAll('.solicitud-item');
    
    solicitudes.forEach(solicitud => {
      const tecnico = solicitud.querySelector('.solicitud-detalles p:nth-child(4)').textContent.replace('Técnico: ', '');
      
      // Simular datos de calificación (esto vendría del backend)
      const calificacion = tecnico !== 'Pendiente' ? {
        promedio: 4.8,
        totalTrabajos: 10
      } : null;
      
      actualizarVisualizacionTecnico(solicitud, tecnico, calificacion);
    });
  }

  // Llamar a la función cuando se carga la página
  document.addEventListener('DOMContentLoaded', cargarCalificacionesTecnicos);
  
  // Variable global para almacenar el ID de la solicitud a cancelar
  let solicitudACancelar = null;

  function cancelarSolicitud(idSolicitud) {
    solicitudACancelar = idSolicitud;
    const modal = document.getElementById('modalConfirmarCancelar');
    modal.classList.add('activo');
  }

  function cerrarModalConfirmacion(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.remove('activo');
    if (idModal === 'modalConfirmarCancelar') {
      solicitudACancelar = null;
    }
  }

  function confirmarCancelacion() {
    if (solicitudACancelar) {
      const solicitud = document.querySelector(`.solicitud-item[data-id="${solicitudACancelar}"]`);
      if (solicitud) {
        // Aquí iría la lógica para cancelar en el backend
        solicitud.remove();
        mostrarNotificacion('exito', 'Solicitud cancelada', 'La solicitud ha sido cancelada correctamente.');
      }
    }
    cerrarModalConfirmacion('modalConfirmarCancelar');
  }
  
  // Datos de ejemplo para el blog
  const articulosBlog = [
    {
      id: 1,
      titulo: "¿Cómo elegir el mejor técnico para tu proyecto?",
      categoria: "Guías",
      fecha: "2024-03-15",
      autor: "Construya",
      imagen: "./img/imagen acerca 1.png",
      resumen: "Aprende a evaluar perfiles de técnicos, revisar calificaciones y hacer las preguntas correctas antes de contratar."
    },
    {
      id: 2,
      titulo: "Negociación efectiva: Consejos para acordar precios justos",
      categoria: "Finanzas",
      fecha: "2024-03-10",
      autor: "Construya",
      imagen: "./img/fondo_comentarios.webp",
      resumen: "Guía práctica para negociar precios y plazos de entrega con los técnicos de manera profesional y efectiva."
    },
    {
      id: 3,
      titulo: "Cómo preparar tu espacio para el servicio técnico",
      categoria: "Preparación",
      fecha: "2024-03-05",
      autor: "Construya",
      imagen: "./img/icono carrusel3d 7.png",
      resumen: "Consejos prácticos para preparar tu hogar o negocio antes de la llegada del técnico."
    },
    {
      id: 4,
      titulo: "Entendiendo el sistema de calificaciones",
      categoria: "Guías",
      fecha: "2024-03-01",
      autor: "Construya",
      imagen: "./img/imagen acerca 1.png",
      resumen: "Todo lo que necesitas saber sobre cómo funciona nuestro sistema de calificaciones y reseñas."
    },
    {
      id: 5,
      titulo: "Seguridad y confianza en la plataforma",
      categoria: "Seguridad",
      fecha: "2024-02-25",
      autor: "Construya",
      imagen: "./img/fondo_comentarios.webp",
      resumen: "Medidas de seguridad implementadas para garantizar la confianza entre clientes y técnicos."
    }
  ];

  // Datos de ejemplo para FAQ
  const faqs = {
    generales: [
      {
        pregunta: "¿Cómo funciona Construya?",
        respuesta: "Construya es una plataforma que conecta a clientes con técnicos certificados. Los clientes publican sus necesidades de servicio, los técnicos revisan las solicitudes y hacen sus propuestas. Una vez que ambas partes llegan a un acuerdo, el técnico realiza el servicio y el cliente puede calificarlo."
      },
      {
        pregunta: "¿Construya interviene en los precios?",
        respuesta: "No, Construya no interviene en la fijación de precios. Los técnicos son independientes y establecen sus propios precios. La plataforma solo facilita la conexión y comunicación entre clientes y técnicos."
      }
    ],
    clientes: [
      {
        pregunta: "¿Cómo puedo confiar en los técnicos?",
        respuesta: "Todos los técnicos en nuestra plataforma son verificados y tienen un sistema de calificaciones basado en las opiniones de clientes anteriores. Puedes revisar sus perfiles, calificaciones y comentarios antes de contratarlos."
      },
      {
        pregunta: "¿Qué pasa si no estoy satisfecho con el servicio?",
        respuesta: "Puedes calificar y comentar sobre el servicio recibido. Si hay algún problema, puedes reportarlo a través de la plataforma. Aunque Construya no interviene en la relación directa entre cliente y técnico, mantenemos un registro de incidencias para garantizar la calidad del servicio."
      }
    ],
    tecnicos: [
      {
        pregunta: "¿Cómo puedo registrarme como técnico?",
        respuesta: "Para registrarte como técnico, necesitas crear una cuenta, proporcionar documentación que acredite tu experiencia y certificaciones, y completar un proceso de verificación. Una vez aprobado, podrás recibir solicitudes de clientes."
      },
      {
        pregunta: "¿Cómo se manejan los pagos?",
        respuesta: "Los pagos se manejan directamente entre el cliente y el técnico. Construya no interviene en las transacciones económicas, solo facilita la conexión inicial entre ambas partes."
      }
    ],
    seguridad: [
      {
        pregunta: "¿Cómo protegen mi información personal?",
        respuesta: "Toda la información personal se maneja con estrictos protocolos de seguridad. Los datos de contacto solo se comparten cuando hay un acuerdo entre cliente y técnico para realizar el servicio."
      },
      {
        pregunta: "¿Qué medidas de seguridad tienen los técnicos?",
        respuesta: "Todos los técnicos verificados tienen un perfil con su información profesional, certificaciones y calificaciones. Sin embargo, siempre recomendamos a los clientes verificar las credenciales y mantener las precauciones necesarias."
      }
    ]
  };

  // Función para cargar el blog
  function cargarBlog() {
    const blogLista = document.querySelector('.blog-lista');
    if (!blogLista) return;

    blogLista.innerHTML = articulosBlog.map(articulo => `
        <article class="articulo-blog">
            <div class="articulo-imagen">
                <img src="${articulo.imagen}" alt="${articulo.titulo}" loading="lazy">
            </div>
            <div class="articulo-contenido">
                <span class="categoria">${articulo.categoria}</span>
                <h3>${articulo.titulo}</h3>
                <div class="articulo-meta">
                    <span><i class="fas fa-user"></i> ${articulo.autor}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(articulo.fecha).toLocaleDateString()}</span>
                </div>
                <p>${articulo.resumen}</p>
                <button class="btn-leer-mas" onclick="leerArticulo(${articulo.id})">
                    Leer más <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </article>
    `).join('');
  }

  // Función para cargar FAQ
  function cargarFAQ() {
    const faqLista = document.querySelector('.faq-lista');
    if (!faqLista) return;

    const iconosCategorias = {
        generales: 'fa-info-circle',
        clientes: 'fa-users',
        tecnicos: 'fa-hard-hat',
        seguridad: 'fa-shield-alt'
    };

    faqLista.innerHTML = Object.entries(faqs).map(([categoria, preguntas]) => `
        <div class="faq-categoria">
            <h3>
                <i class="fas ${iconosCategorias[categoria]}"></i>
                ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </h3>
            ${preguntas.map((faq, index) => `
                <div class="faq-item">
                    <button class="faq-pregunta" onclick="toggleFAQ(this)">
                        ${faq.pregunta}
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="faq-respuesta" id="faq-${categoria}-${index}" style="max-height: 0;">
                        <p>${faq.respuesta}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
  }

  // Función para alternar la visibilidad de las respuestas FAQ
  function toggleFAQ(elemento) {
    const respuesta = elemento.nextElementSibling;
    const icono = elemento.querySelector('i');
    const pregunta = elemento;
    
    // Cerrar otras respuestas abiertas
    const todasLasRespuestas = document.querySelectorAll('.faq-respuesta');
    const todasLasPreguntas = document.querySelectorAll('.faq-pregunta');
    const todosLosIconos = document.querySelectorAll('.faq-pregunta i');
    
    todasLasRespuestas.forEach(resp => {
        if (resp !== respuesta) {
            resp.classList.remove('activo');
            resp.style.maxHeight = '0';
        }
    });
    
    todasLasPreguntas.forEach(preg => {
        if (preg !== pregunta) {
            preg.classList.remove('activo');
        }
    });
    
    todosLosIconos.forEach(ico => {
        if (ico !== icono) {
            ico.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle de la respuesta actual
    respuesta.classList.toggle('activo');
    pregunta.classList.toggle('activo');
    
    if (respuesta.classList.contains('activo')) {
        respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
        icono.style.transform = 'rotate(180deg)';
    } else {
        respuesta.style.maxHeight = '0';
        icono.style.transform = 'rotate(0deg)';
    }
  }

  // Función para leer artículo completo
  function leerArticulo(id) {
    const articulo = articulosBlog.find(a => a.id === id);
    if (!articulo) return;

    // Aquí podrías implementar la lógica para mostrar el artículo completo
    // Por ejemplo, abrir un modal o redirigir a una página específica
    console.log('Leyendo artículo:', articulo.titulo);
  }

  // Inicializar blog y FAQ cuando se cargue la página
  document.addEventListener('DOMContentLoaded', () => {
    cargarBlog();
    cargarFAQ();
  });

  // Funcionalidad del formulario de contacto
  document.addEventListener('DOMContentLoaded', function() {
    const formContacto = document.getElementById('formContacto');
    if (formContacto) {
      formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const formData = new FormData(formContacto);
        const datos = Object.fromEntries(formData.entries());
        
        // Validar los datos
        if (validarFormularioContacto(datos)) {
          // Simular envío (aquí iría la lógica real de envío)
          mostrarNotificacion('Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.', 'exito');
          formContacto.reset();
        }
      });
    }
  });

  function validarFormularioContacto(datos) {
    // Validar nombre
    if (datos.nombre.trim().length < 3) {
      mostrarNotificacion('El nombre debe tener al menos 3 caracteres', 'error');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
      mostrarNotificacion('Por favor, ingresa un email válido', 'error');
      return false;
    }

    // Validar teléfono (si se proporciona)
    if (datos.telefono && !/^\+?[\d\s-]{10,}$/.test(datos.telefono)) {
      mostrarNotificacion('Por favor, ingresa un número de teléfono válido', 'error');
      return false;
    }

    // Validar dirección
    if (datos.direccion.trim().length < 5) {
      mostrarNotificacion('Por favor, ingresa una dirección válida', 'error');
      return false;
    }

    // Validar ciudad
    if (datos.ciudad.trim().length < 2) {
      mostrarNotificacion('Por favor, ingresa una ciudad válida', 'error');
      return false;
    }

    // Validar horario
    if (!datos.horario) {
      mostrarNotificacion('Por favor, selecciona un horario de atención', 'error');
      return false;
    }

    // Validar días
    if (!datos.dias) {
      mostrarNotificacion('Por favor, selecciona los días disponibles', 'error');
      return false;
    }

    // Validar mensaje (opcional)
    if (datos.mensaje && datos.mensaje.trim().length < 10) {
      mostrarNotificacion('El mensaje debe tener al menos 10 caracteres', 'error');
      return false;
    }

    return true;
  }
  
  /****************** GEOLOCALIZACIÓN ******************/
  // Coordenadas de Barrios Unidos, Bogotá
  const UBICACION_BARRIOS_UNIDOS = {
    lat: 4.6426,
    lng: -74.0777,
    zoom: 15
  };

  // Función para inicializar el mapa
  function inicializarMapa() {
    const mapa = document.getElementById('mapaGoogle');
    if (!mapa) return;

    // Actualizar el src del iframe con las coordenadas de Barrios Unidos
    const url = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7547!2d${UBICACION_BARRIOS_UNIDOS.lng}!3d${UBICACION_BARRIOS_UNIDOS.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a2e4c4c4c4c%3A0x4c4c4c4c4c4c4c4c!2sBarrios%20Unidos%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1647043087964!5m2!1ses!2s`;
    mapa.src = url;

    // Actualizar la información de contacto
    actualizarInfoContacto();
  }

  // Función para actualizar la información de contacto
  function actualizarInfoContacto() {
    const ubicacionInfo = document.querySelector('.contacto-card:nth-child(1) p');
    if (ubicacionInfo) {
      ubicacionInfo.innerHTML = 'Barrios Unidos<br>Bogotá, Colombia';
    }
  }

  // Inicializar el mapa cuando se cargue la página
  document.addEventListener('DOMContentLoaded', inicializarMapa);
  
  