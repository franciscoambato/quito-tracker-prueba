let map;
let markersGroup;
let lugaresPuntos = [];
let personajeActual = { nombre: 'MARCO O LUCÍA', video: './gallo.mp4' };

// Límites geográficos: Tambillo a Mitad del Mundo / Mindo a Tumbaco
const MAP_BOUNDS = L.latLngBounds(
  [-0.5500, -78.7800], // Suroeste (Tambillo / Mindo)
  [-0.0010, -78.3900]  // Noreste (Mitad del Mundo / Tumbaco)
);

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
    .catch(err => console.error("Error Leyendo JSON:", err));
}

function iniciarEstaticaTerminal() {
  const lineas = [
    "> INITIALIZING CYBER_QUITO_NET...",
    "[OK] Cargando nodos geográficos...",
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

  inicializarMapa();
}

function inicializarMapa() {
  if (map) return;

  map = L.map('map', {
    center: [-0.2300, -78.5100],
    zoom: 12,
    maxBounds: MAP_BOUNDS,
    maxBoundsViscosity: 1.0
  });

  // Capa oscura estilo Blaugrana
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);
  renderizarMarcadores(lugaresPuntos);
}

function renderizarMarcadores(puntos) {
  if (!markersGroup) return;
  markersGroup.clearLayers();

  puntos.forEach(lugar => {
    const marker = L.circleMarker([lugar.lat, lugar.lng], {
      radius: 8,
      fillColor: '#a50044',
      color: '#e2b041',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    });

    let actividadesHTML = "";
    if (lugar.actividades) {
      actividadesHTML = "<ul>" + lugar.actividades.map(a => `<li>${a}</li>`).join('') + "</ul>";
    }

    const popupContent = `
      <div style="font-family: 'Trebuchet MS', sans-serif; color: #ffffff;">
        <div style="font-weight: bold; color: #e2b041; font-size: 14px; margin-bottom: 4px;">
          ${lugar.sticker} ${lugar.nombre}
        </div>
        <div style="color: #a50044; font-weight: bold; font-size: 11px; margin-bottom: 6px;">
          PRECIO: ${lugar.categoria} | ZONA: ${lugar.zona}
        </div>
        <p style="margin-bottom: 6px; font-size: 12px;">${lugar.descripcion}</p>
        <div style="font-size: 11px; color: #e2b041;"><strong>Actividades:</strong></div>
        <div style="font-size: 11px; margin-bottom: 6px;">${actividadesHTML}</div>
        <div style="font-size: 11px; background-color: #15294a; padding: 6px; border-radius: 4px; color: #ffffff;">
          💡 <strong>Recomendación:</strong> ${lugar.recomendacion}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('click', () => {
      document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ¡${lugar.nombre}! ${lugar.info}`;
    });

    markersGroup.addLayer(marker);
  });
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
