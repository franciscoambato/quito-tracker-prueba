let map;
let infoWindow;
let markersList = [];
let puntoSeleccionado = null;
let personajeActual = { nombre: 'MARCO', video: './gallo.mp4' };

// LÍMITES SOLICITADOS: Tambillo hasta Mitad del Mundo / Mindo hasta Tumbaco
const MAP_BOUNDS = {
  north: -0.0010, // Mitad del Mundo / San Antonio
  south: -0.4100, // Tambillo
  west: -78.7800,  // Mindo
  east: -78.3900   // Tumbaco
};

let lugaresPuntos = [
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Di Pinto (Café & Taller de Arte)",
    "lat": -0.1785,
    "lng": -78.4812,
    "categoria": "HASTA $15 USD",
    "zona": "NORTE",
    "tipo": "Plan Jóvenes 1 / Arte & Café",
    "sticker": "🎨",
    "info": "Kits de pintura y cerámica desde $12.00 USD.",
    "descripcion": "Concepto de café-taller para personalizar cerámica, macetas o lienzos.",
    "recomendacion": "Ideal para ir en pareja o con amigos."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Cafetería Roca Roja",
    "lat": -0.1812,
    "lng": -78.4795,
    "categoria": "HASTA $20 USD",
    "zona": "NORTE",
    "tipo": "Plan Jóvenes 2 / Cerámica & Café",
    "sticker": "🪴",
    "info": "Kits de arcilla y pintura.",
    "descripcion": "Espacio acogedor diseñado para amantes del arte en arcilla y cerámica.",
    "recomendacion": "Muy popular en redes sociales."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "CelebrART (Galería & Gastronomía)",
    "lat": -0.1985,
    "lng": -78.4358,
    "categoria": "HASTA $15 USD",
    "zona": "CUMBAYÁ / NORTE",
    "tipo": "Plan Jóvenes 3 / Arte & Cerveza",
    "sticker": "🍷",
    "info": "Talleres de pintura en vivo.",
    "descripcion": "Centro cultural que combina arte con tapas y cerveza artesanal.",
    "recomendacion": "Revisa su agenda de eventos nocturnos."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo de la Ciudad",
    "lat": -0.2251,
    "lng": -78.5152,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Museo / Historia",
    "sticker": "📜",
    "info": "Adultos: $4.00, Estudiantes: $2.00.",
    "descripcion": "Recorrido sobre la historia de Quito desde la era precolombina.",
    "recomendacion": "Ubicado en el antiguo Hospital San Juan de Dios."
  },
  {
    "etiqueta": "PARQUES",
    "nombre": "Parque La Carolina",
    "lat": -0.1825,
    "lng": -78.4845,
    "categoria": "GRATIS",
    "zona": "NORTE",
    "tipo": "Parque Recreativo",
    "sticker": "🌳",
    "info": "Acceso libre.",
    "descripcion": "El parque urbano más activo en el corazón financiero de Quito.",
    "recomendacion": "Ideal para deporte o paseo familiar."
  },
  {
    "etiqueta": "LUGARES DE HISTORIAS Y LEYENDAS",
    "nombre": "Mitad del Mundo",
    "lat": -0.0022,
    "lng": -78.4558,
    "categoria": "HASTA $10 USD",
    "zona": "NORTE EXTREMO",
    "tipo": "Historia / Latitud 0",
    "sticker": "🌐",
    "info": "Entrada general $5.00 USD.",
    "descripcion": "Monumento ecuatorial histórico en la latitud 0°0'0\".",
    "recomendacion": "Límite norte de la travesía."
  }
];

window.onload = function() {
  cargarMapaScript();
};

function seleccionarPersonaje(nombre, videoSrc) {
  personajeActual = { nombre: nombre, video: videoSrc };
  document.getElementById('characterSelectionModal').classList.add('hidden');
  
  const video = document.getElementById('galloVideo');
  video.src = videoSrc;
  video.play().catch(e => console.log(e));

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
  script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMap`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    console.warn("API de Google Maps no detectada.");
  };
  document.head.appendChild(script);
}

function initMap() {
  const quitoCenter = { lat: -0.2000, lng: -78.4900 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: quitoCenter,
    disableDefaultUI: true,
    restriction: {
      latLngBounds: MAP_BOUNDS,
      strictBounds: true
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
    default: return '#00f0ff';
  }
}

function limpiarMarcadores() {
  markersList.forEach(m => m.setMap(null));
  markersList = [];
}

function seleccionarLugar(lugar, marker) {
  puntoSeleccionado = lugar;
  
  const contenidoIW = `
    <div style="font-family:'Press Start 2P', monospace; font-size:8px; color:#ffffff;">
      <div style="color:#00f0ff; margin-bottom:4px;">${lugar.sticker} ${lugar.nombre}</div>
      <div style="color:#ff007f; margin-bottom:4px;">${lugar.categoria}</div>
      <p style="margin:2px 0;">${lugar.descripcion}</p>
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
