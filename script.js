let map;
let infoWindow;
let markersList = [];
let lugaresPuntos = [];
let personajeActual = { nombre: 'MARCO O LUCÍA', video: './gallo.mp4' };

// Clave de API provista
const GOOGLE_MAPS_API_KEY = "AIzaSyD7yh3TteD4adDL8pAVXIEGr6RXksDKGLo";

// Límites geográficos: Tambillo a Mitad del Mundo / Mindo a Tumbaco
const MAP_BOUNDS = {
  north: -0.0010,
  south: -0.5500,
  west: -78.7800,
  east: -78.3900
};

window.onload = function() {
  cargarDatosJSON();
  iniciarEstaticaTerminal();
};

// Carga asíncrona de datos desde lugares.json
function cargarDatosJSON() {
  fetch('./lugares.json')
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar lugares.json");
      return response.json();
    })
    .then(data => {
      lugaresPuntos = data;
    })
    .catch(err => console.error("Error leyendo lugares.json:", err));
}

function iniciarEstaticaTerminal() {
  const lineas = [
    "> INITIALIZING CYBER_QUITO_NET...",
    "[OK] Cargando nodos geográficos de Quito...",
    "[OK] Google Maps API conectada.",
    "[OK] Sistema listo."
  ];
  const terminal = document.getElementById('terminalText');
  let l = 0, c = 0;

  function escribir() {
    if (l < lineas.length) {
      if (c < lineas[l].length) {
        terminal.innerHTML += lineas[l].charAt(c);
        c++;
        setTimeout(escribir, 20);
      } else {
        terminal.innerHTML += '\n';
        l++;
        c = 0;
        setTimeout(escribir, 150);
      }
    } else {
      setTimeout(() => {
        document.getElementById('hackerIntro').style.display = 'none';
        document.getElementById('characterModal').classList.remove('hidden');
      }, 500);
    }
  }
  escribir();
}

function seleccionarPersonaje(nombre, videoSrc) {
  personajeActual = { nombre: nombre, video: videoSrc };
  document.getElementById('characterModal').classList.add('hidden');

  const video = document.getElementById('galloVideo');
  video.src = videoSrc;
  video.play().catch(e => console.log(e));

  document.getElementById('status-yellow-text').innerText = `GUÍA SELECCIONADO: ${personajeActual.nombre}`;
  document.getElementById('galloSpeech').innerText = `¡Hola, soy ${personajeActual.nombre}! Vamos a explorar Quito.`;

  cargarGoogleMapsScript();
}

function cargarGoogleMapsScript() {
  if (window.google && window.google.maps) {
    initMap();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function initMap() {
  const quitoCenter = { lat: -0.2300, lng: -78.5100 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: quitoCenter,
    disableDefaultUI: true,
    restriction: {
      latLngBounds: MAP_BOUNDS,
      strictBounds: true
    },
    styles: [
      { elementType: "geometry", stylers: [{ color: "#0b1d3a" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#0b1d3a" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#e2b041" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#15294a" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#a50044" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#050a14" }] }
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
        scale: 8,
        fillColor: "#a50044",
        fillOpacity: 0.95,
        strokeWeight: 2,
        strokeColor: "#e2b041"
      }
    });

    marker.addListener("click", () => {
      seleccionarLugar(lugar, marker);
    });

    markersList.push(marker);
  });
}

function limpiarMarcadores() {
  markersList.forEach(m => m.setMap(null));
  markersList = [];
}

function seleccionarLugar(lugar, marker) {
  let actividadesHTML = "";
  if (lugar.actividades) {
    actividadesHTML = "<ul>" + lugar.actividades.map(a => `<li>${a}</li>`).join('') + "</ul>";
  }

  const contenidoIW = `
    <div style="font-family:'Trebuchet MS', sans-serif; color:#ffffff; padding:4px;">
      <div style="font-weight:bold; color:#e2b041; font-size:14px; margin-bottom:4px;">
        ${lugar.sticker} ${lugar.nombre}
      </div>
      <div style="color:#a50044; font-weight:bold; font-size:11px; margin-bottom:6px;">
        PRECIO: ${lugar.categoria} | ZONA: ${lugar.zona}
      </div>
      <p style="margin-bottom:6px; font-size:12px;">${lugar.descripcion}</p>
      <div style="font-size:11px; color:#e2b041;"><strong>Actividades:</strong></div>
      <div style="font-size:11px; margin-bottom:6px;">${actividadesHTML}</div>
      <div style="font-size:11px; color:#ffffff; background-color:#15294a; padding:6px; border-radius:4px;">
        💡 <strong>Recomendación:</strong> ${lugar.recomendacion}
      </div>
    </div>
  `;

  infoWindow.setContent(contenidoIW);
  infoWindow.open(map, marker);

  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ¡${lugar.nombre}! ${lugar.info}`;
}

function toggleMenu() {
  const menu = document.getElementById('sideMenuModal');
  menu.classList.toggle('hidden');
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
  toggleMenu();
  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: Mostrando ${filtrados.length} lugares para ${categoria}.`;
}
