let map;
let markersList = [];
let userLocationMarker = null;
let userCoords = null;
let personajeActual = { nombre: 'MARCO', video: './gallo.mp4' };
let lugaresPuntos = [];

const MAP_BOUNDS = {
  north: -0.0010,
  south: -0.8000,
  west: -78.7800,
  east: -78.3900
};

window.onload = function() {
  cargarLugaresJSON();
};

function cargarLugaresJSON() {
  fetch('./lugares.json')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar lugares.json');
      return response.json();
    })
    .then(data => {
      lugaresPuntos = data;
      cargarMapaScript();
    })
    .catch(error => {
      console.error('Error cargando los lugares:', error);
      cargarMapaScript();
    });
}

function seleccionarPersonaje(nombre, videoSrc) {
  personajeActual = { nombre: nombre, video: videoSrc };
  
  // Ocultar modal de selección completamente
  const modal = document.getElementById('characterSelectionModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
  
  const video = document.getElementById('galloVideo');
  if (video) {
    video.src = videoSrc;
    video.play().catch(e => console.log("Autoplay controlado:", e));
  }

  const speech = document.getElementById('galloSpeech');
  if (speech) {
    speech.innerText = `${personajeActual.nombre}: ¡LISTO PARA VIAJAR!`;
  }

  // Refrescar el mapa para asegurar que se renderice correctamente en pantalla
  if (map && window.google && window.google.maps) {
    google.maps.event.trigger(map, 'resize');
  }
}

function toggleFiltros() {
  const menu = document.getElementById('filterMenuModal');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function cargarMapaScript() {
  if (window.google && window.google.maps) {
    initMap();
    return;
  }
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMap&loading=async`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function initMap() {
  const quitoCenter = { lat: -0.2500, lng: -78.5100 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: quitoCenter,
    disableDefaultUI: true,
    restriction: {
      latLngBounds: MAP_BOUNDS,
      strictBounds: false
    },
    styles: [
      { elementType: "geometry", stylers: [{ color: "#1a0b2e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1a0b2e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#00f0ff" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#2d0a4e" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#ff007f" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#002b36" }] }
    ]
  });

  renderizarMarcadores(lugaresPuntos);
  obtenerUbicacionUsuario();
}

// OBTENER Y CREAR EL MARCADOR DE UBICACIÓN
function obtenerUbicacionUsuario() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (userLocationMarker) userLocationMarker.setMap(null);

        userLocationMarker = new google.maps.Marker({
          position: userCoords,
          map: map,
          title: "¡Tu ubicación actual!",
          zIndex: 999,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: "#FF0000",
            fillOpacity: 1,
            strokeWeight: 4,
            strokeColor: "#FFFFFF"
          }
        });

        userLocationMarker.addListener("click", () => {
          mostrarEnFullScreen({
            sticker: "📍",
            nombre: "Tu Ubicación Actual",
            categoria: "GEOLOCALIZACIÓN",
            zona: "AQUÍ EN QUITO",
            descripcion: "Te encuentras actualmente en esta posición dentro del mapa.",
            recomendacion: "Aprovecha este punto para organizar tu ruta hacia los lugares cercanos."
          });
        });
      },
      (error) => {
        console.warn("No se pudo obtener la geolocalización.", error);
      }
    );
  }
}

// BOTÓN "TU UBICACIÓN": CENTRA Y HACE MÁS GRANDE EL CÍRCULO ROJO
function enfocarTuUbicacion() {
  if (!userCoords || !userLocationMarker) {
    alert("Buscando tu ubicación... asegúrate de otorgar los permisos en tu navegador.");
    obtenerUbicacionUsuario();
    return;
  }

  cerrarFullScreen();
  map.setCenter(userCoords);
  map.setZoom(14);

  userLocationMarker.setIcon({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 22,
    fillColor: "#FF0000",
    fillOpacity: 1,
    strokeWeight: 5,
    strokeColor: "#FFEA00"
  });

  const speech = document.getElementById('galloSpeech');
  if (speech) {
    speech.innerText = `${personajeActual.nombre}: ¡AQUÍ ESTÁS TÚ!`;
  }
}

function renderizarMarcadores(puntos) {
  if (!map) return;
  limpiarMarcadores();

  puntos.forEach(lugar => {
    const marker = new google.maps.Marker({
      position: { lat: lugar.lat, lng: lugar.lng },
      map: map,
      title: lugar.nombre,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: obtenerColorPorEtiqueta(lugar.etiqueta),
        fillOpacity: 0.9,
        strokeWeight: 2,
        strokeColor: "#ffffff"
      }
    });

    marker.addListener("click", () => {
      mostrarEnFullScreen(lugar);
    });

    markersList.push(marker);
  });
}

function obtenerColorPorEtiqueta(etiqueta) {
  switch (etiqueta) {
    case 'PLANES DESTACADOS PARA JÓVENES': return '#ffea00';
    case 'MUSEOS': return '#b537f2';
    case 'PARQUES': return '#00ff66';
    case 'LUGARES DE HISTORIAS Y LEYENDAS': return '#ff7700';
    case 'SUR DE QUITO': return '#ff0055';
    case 'AMAGUAÑA Y PERIFERIA SUR': return '#00f0ff';
    case 'MACHACHI Y CANTON MEJÍA': return '#ff00ff';
    case 'RUTA DE LOS VOLCANES Y ALREDEDORES': return '#ff3300';
    default: return '#00f0ff';
  }
}

function limpiarMarcadores() {
  markersList.forEach(m => m.setMap(null));
  markersList = [];
}

// DESPLEGAR INFORMACIÓN A PANTALLA COMPLETA SOBRE EL MAPA
function mostrarEnFullScreen(lugar) {
  const fullScreenModal = document.getElementById('infoFullScreen');
  const fullScreenCard = document.getElementById('fullScreenCard');

  if (!fullScreenModal || !fullScreenCard) return;

  fullScreenCard.innerHTML = `
    <div style="font-size: 22px; font-weight: bold; color: #ffea00; margin-bottom: 12px; border-bottom: 3px solid #00f0ff; padding-bottom: 8px;">
      ${lugar.sticker || '📍'} ${lugar.nombre}
    </div>
    
    <div style="display: flex; gap: 10px; margin-bottom: 16px; font-size: 13px;">
      <span style="background-color: #800020; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-weight: bold;">
        ${lugar.categoria}
      </span>
      <span style="background-color: #0f4471; color: #00f0ff; padding: 6px 12px; border-radius: 6px; font-weight: bold; border: 1px solid #00f0ff;">
        ${lugar.zona}
      </span>
    </div>

    <p style="margin: 0 0 16px 0; color: #f0f4f8; font-size: 16px; line-height: 1.6;">
      ${lugar.descripcion}
    </p>

    ${lugar.info ? `
      <div style="margin-bottom: 14px; font-size: 15px; color: #00f0ff;">
        💵 <strong>Detalle / Precio:</strong> ${lugar.info}
      </div>
    ` : ''}

    ${lugar.recomendacion ? `
      <div style="background-color: rgba(128, 0, 32, 0.5); padding: 12px 16px; border-left: 4px solid #ffea00; border-radius: 6px; font-size: 14px; color: #ffffff; margin-top: 10px;">
        💡 <strong>Recomendación:</strong> ${lugar.recomendacion}
      </div>
    ` : ''}
  `;

  fullScreenModal.classList.remove('hidden');
  fullScreenModal.style.display = 'flex';
  
  const speech = document.getElementById('galloSpeech');
  if (speech) {
    speech.innerText = `${personajeActual.nombre}: ${lugar.nombre}`;
  }
}

function cerrarFullScreen() {
  const fullScreenModal = document.getElementById('infoFullScreen');
  if (fullScreenModal) {
    fullScreenModal.classList.add('hidden');
    fullScreenModal.style.display = 'none';
  }
}

function filtrarLugares(categoria) {
  let filtrados = [];
  if (categoria === 'TODOS') {
    filtrados = lugaresPuntos;
  } else if (categoria === 'GRATIS') {
    filtrados = lugaresPuntos.filter(l => l.categoria === 'GRATIS');
  } else if (categoria === 'PAID') {
    filtrados = lugaresPuntos.filter(l => l.categoria !== 'GRATIS');
  } else {
    filtrados = lugaresPuntos.filter(l => l.etiqueta === categoria);
  }

  renderizarMarcadores(filtrados);
  toggleFiltros();
  cerrarFullScreen();
  
  const speech = document.getElementById('galloSpeech');
  if (speech) {
    speech.innerText = `${personajeActual.nombre}: ${filtrados.length} LUGARES`;
  }
}
