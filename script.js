let map;
let infoWindow;
let markersList = [];
let puntoSeleccionado = null;
let personajeActual = { nombre: 'MARCO', video: './gallo.mp4' };
let lugaresPuntos = []; // Se llena desde el JSON

// LÍMITES AMPLIADOS DE TAMBILLO/COTOPAXI A MITAD DEL MUNDO
const MAP_BOUNDS = {
  north: -0.0010,
  south: -0.8000,
  west: -78.7800,
  east: -78.3900
};

window.onload = function() {
  cargarLugaresJSON();
};

// Carga asíncrona de los datos desde el archivo lugares.json
function cargarLugaresJSON() {
  fetch('./lugares.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo lugares.json');
      }
      return response.json();
    })
    .then(data => {
      lugaresPuntos = data;
      cargarMapaScript();
    })
    .catch(error => {
      console.error('Error cargando los lugares:', error);
      cargarMapaScript(); // Inicia el mapa aun si hay fallos
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
  script.onerror = () => {
    console.warn("API de Google Maps no detectada o sin clave.");
  };
  document.head.appendChild(script);
}

function initMap() {
  const quitoCenter = { lat: -0.2800, lng: -78.5100 };

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

// Ventana de Información con Estilo Blaugrana y Tipografía Clara
function seleccionarLugar(lugar, marker) {
  puntoSeleccionado = lugar;
  
  const actividadesHTML = lugar.actividades && lugar.actividades.length > 0 
    ? `<div style="margin-top:6px; padding-top:6px; border-top: 1px solid rgba(255,255,255,0.2);">
        <strong style="color: #ffcc00; font-size: 11px;">Actividades:</strong>
        <ul style="margin: 4px 0 0 14px; padding: 0; color: #ffffff; font-size: 11px;">
          ${lugar.actividades.map(act => `<li>${act}</li>`).join('')}
        </ul>
       </div>`
    : '';

  const contenidoIW = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #800020 100%);
      color: #ffffff;
      padding: 12px;
      border-radius: 8px;
      border: 2px solid #a51c30;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      max-width: 260px;
    ">
      <div style="font-size: 14px; font-weight: bold; color: #ffcc00; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
        <span>${lugar.sticker}</span>
        <span>${lugar.nombre}</span>
      </div>
      
      <div style="display: flex; gap: 6px; margin-bottom: 8px; font-size: 10px;">
        <span style="background-color: #a51c30; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
          ${lugar.categoria}
        </span>
        <span style="background-color: #003366; color: #ffcc00; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
          ${lugar.zona}
        </span>
      </div>

      <p style="margin: 0 0 6px 0; color: #f0f4f8;">
        ${lugar.descripcion}
      </p>

      ${actividadesHTML}

      ${lugar.recomendacion ? `
        <div style="margin-top: 6px; background-color: rgba(128, 0, 32, 0.4); padding: 6px; border-left: 3px solid #ffcc00; border-radius: 2px; font-size: 10px; color: #e0e6ed;">
          💡 <strong>Tip:</strong> ${lugar.recomendacion}
        </div>
      ` : ''}
    </div>
  `;

  infoWindow.setContent(contenidoIW);
  infoWindow.open(map, marker);

  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ${lugar.nombre}`;
  document.getElementById('extraBlueSpace').classList.remove('hidden');
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

function trazarRuta(modo) {
  if (!puntoSeleccionado) return;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${puntoSeleccionado.lat},${puntoSeleccionado.lng}&travelmode=${modo}`;
  window.open(url, '_blank');
}

function limpiarRuta() {
  if (infoWindow) infoWindow.close();
  document.getElementById('extraBlueSpace').classList.add('hidden');
  puntoSeleccionado = null;
}
