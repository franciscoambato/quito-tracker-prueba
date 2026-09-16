let map;
let markersList = [];
let userLocationMarker = null;
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
  document.getElementById('characterSelectionModal').classList.add('hidden');
  
  const video = document.getElementById('galloVideo');
  video.src = videoSrc;
  video.play().catch(e => console.log("Autoplay controlado:", e));

  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ¡LISTO PARA VIAJAR!`;
}

function toggleFiltros() {
  const menu = document.getElementById('filterMenuModal');
  menu.classList.toggle('hidden');
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

// OBTENER Y MARCAR LA UBICACIÓN EN PUNTO ROJO
function obtenerUbicacionUsuario() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (userLocationMarker) userLocationMarker.setMap(null);

        userLocationMarker = new google.maps.Marker({
          position: pos,
          map: map,
          title: "¡Tu ubicación actual!",
          zIndex: 999,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#FF0000",
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#FFFFFF"
          }
        });

        userLocationMarker.addListener("click", () => {
          mostrarEnSidebar({
            sticker: "📍",
            nombre: "Tu Ubicación Actual",
            categoria: "GEOLOCALIZACIÓN",
            zona: "AQUÍ EN QUITO",
            descripcion: "Te encuentras actualmente en estas coordenadas geográficas.",
            recomendacion: "¡Usa este punto para calcular tus recorridos por la ciudad!"
          });
        });
      },
      (error) => {
        console.warn("No se pudo obtener la geolocalización.", error);
      }
    );
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
      mostrarEnSidebar(lugar);
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

// MOSTRAR INFORMACIÓN EN EL PANEL LATERAL DERECHO
function mostrarEnSidebar(lugar) {
  const sidebar = document.getElementById('infoSidebar');
  const sidebarContent = document.getElementById('sidebarContent');

  sidebarContent.innerHTML = `
    <div style="font-size: 16px; font-weight: bold; color: #ffcc00; margin-bottom: 8px; border-bottom: 2px solid #a51c30; padding-bottom: 6px;">
      ${lugar.sticker || '📍'} ${lugar.nombre}
    </div>
    
    <div style="display: flex; gap: 6px; margin-bottom: 10px; font-size: 11px;">
      <span style="background-color: #a51c30; color: #ffffff; padding: 3px 6px; border-radius: 4px; font-weight: bold;">
        ${lugar.categoria}
      </span>
      <span style="background-color: #003366; color: #ffcc00; padding: 3px 6px; border-radius: 4px; font-weight: bold;">
        ${lugar.zona}
      </span>
    </div>

    <p style="margin: 0 0 10px 0; color: #f0f4f8; font-size: 13px; line-height: 1.4;">
      ${lugar.descripcion}
    </p>

    ${lugar.info ? `
      <div style="margin-bottom: 8px; font-size: 12px; color: #00f0ff;">
        💵 <strong>Precio/Info:</strong> ${lugar.info}
      </div>
    ` : ''}

    ${lugar.recomendacion ? `
      <div style="background-color: rgba(128, 0, 32, 0.4); padding: 8px; border-left: 3px solid #ffcc00; border-radius: 4px; font-size: 11px; color: #e0e6ed;">
        💡 <strong>Tip:</strong> ${lugar.recomendacion}
      </div>
    ` : ''}
  `;

  sidebar.classList.remove('hidden');
  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ${lugar.nombre}`;
}

function cerrarSidebar() {
  document.getElementById('infoSidebar').classList.add('hidden');
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
  cerrarSidebar();
  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ${filtrados.length} LUGARES`;
}
