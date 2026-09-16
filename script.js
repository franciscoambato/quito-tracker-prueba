let map;
let infoWindow;
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

  infoWindow = new google.maps.InfoWindow();
  renderizarMarcadores(lugaresPuntos);
  obtenerUbicacionUsuario();
}

// OBTENER Y MARCAR LA UBICACIÓN DE LA PERSONA EN PUNTO ROJO
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
            fillColor: "#FF0000", // Punto Rojo
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#FFFFFF"
          }
        });

        userLocationMarker.addListener("click", () => {
          infoWindow.setContent(`
            <div style="font-family: Arial, sans-serif; padding: 10px; color: #800020; font-weight: bold; text-align: center;">
              📍 Estás aquí
            </div>
          `);
          infoWindow.open(map, userLocationMarker);
        });
      },
      (error) => {
        console.warn("No se pudo obtener la geolocalización o el permiso fue denegado.", error);
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
      seleccionarLugar(lugar, marker);
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

// TARJETA DE INFORMACIÓN TOTALMENTE LEGIBLE (FONDO CLARO CON ACENTOS BLAUGRANA)
function seleccionarLugar(lugar, marker) {
  const contenidoIW = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      line-height: 1.4;
      background-color: #ffffff;
      color: #1a1a1a;
      padding: 14px;
      border-radius: 8px;
      max-width: 270px;
    ">
      <div style="
        font-size: 15px;
        font-weight: bold;
        color: #800020; /* Color Grana Blaugrana */
        margin-bottom: 6px;
        border-bottom: 2px solid #0d1b2a;
        padding-bottom: 4px;
      ">
        ${lugar.sticker || '📍'} ${lugar.nombre}
      </div>
      
      <div style="margin-bottom: 8px;">
        <span style="background-color: #0d1b2a; color: #ffcc00; padding: 3px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">
          ${lugar.categoria}
        </span>
        <span style="background-color: #800020; color: #ffffff; padding: 3px 6px; border-radius: 4px; font-weight: bold; font-size: 11px; margin-left: 4px;">
          ${lugar.zona}
        </span>
      </div>

      <p style="margin: 6px 0; color: #222222; font-size: 12px; font-weight: 500;">
        ${lugar.descripcion}
      </p>

      ${lugar.recomendacion ? `
        <div style="margin-top: 8px; background-color: #f4f4f9; padding: 6px 8px; border-left: 3px solid #800020; font-size: 11px; color: #333333;">
          <strong>Tip:</strong> ${lugar.recomendacion}
        </div>
      ` : ''}
    </div>
  `;

  infoWindow.setContent(contenidoIW);
  infoWindow.open(map, marker);

  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ${lugar.nombre}`;
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
  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ${filtrados.length} LUGARES`;
}
