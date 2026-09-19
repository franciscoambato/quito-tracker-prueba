// Configuración global del mapa
const API_KEY_GMAPS = "AIzaSyD7yh3TteD4adDL8pAVXIEGr6RXksDKGLo";
let mapa_ref = null;
let capa_puntos = null;
let google_markers = [];
let info_pop = null;

let lugares_quito = [];
let guia_activa = { nombre: 'MARCO', clip: './gallo.mp4' };

const BOUNDS_QUITO = {
  north: -0.0010, south: -0.5500,
  west: -78.7800, east: -78.3900
};

// Carga inicial
window.addEventListener('DOMContentLoaded', () => {
  obtenerLugares();
  efectoTerminal();
});

function obtenerLugares() {
  fetch('./lugares.json')
    .then(res => res.json())
    .then(data => { lugares_quito = data; })
    .catch(() => { console.warn('JSON local no cargado, usando buffer.'); });
}

function efectoTerminal() {
  const lineas = [
    "> INICIALIZANDO QUITO_TRACKER...",
    "[OK] Nodos geográficos listos.",
    "[OK] Conectando servicio de mapas..."
  ];
  let ix = 0, ch = 0;
  const term = document.getElementById('terminalText');

  const timer = setInterval(() => {
    if (ix < lineas.length) {
      if (ch < lineas[ix].length) {
        term.innerHTML += lineas[ix][ch++];
      } else {
        term.innerHTML += '\n';
        ix++; ch = 0;
      }
    } else {
      clearInterval(timer);
      setTimeout(() => {
        document.getElementById('hackerIntro').style.display = 'none';
        document.getElementById('characterModal').classList.remove('hidden');
      }, 350);
    }
  }, 25);
}

function setGuia(nombre, clip) {
  guia_activa = { nombre, clip };
  document.getElementById('characterModal').classList.add('hidden');

  const vid = document.getElementById('galloVideo');
  vid.src = clip;
  vid.play().catch(()=>{});

  document.getElementById('status-yellow-text').innerText = `GUÍA: ${nombre}`;
  document.getElementById('galloSpeech').innerText = `¡Hola! Soy ${nombre}. Vamos a recorrer Quito.`;

  inicializarVisor();
}

function inicializarVisor() {
  if (window.google && window.google.maps) {
    cargarGmaps();
    return;
  }

  const tag = document.createElement('script');
  tag.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_GMAPS}&callback=cargarGmaps`;
  tag.async = true;
  tag.onerror = () => fallbackLeaflet();
  document.head.appendChild(tag);
}

function cargarGmaps() {
  try {
    mapa_ref = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: { lat: -0.2300, lng: -78.5100 },
      disableDefaultUI: true,
      restriction: { latLngBounds: BOUNDS_QUITO, strictBounds: true },
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0b1d3a" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0b1d3a" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#e2b041" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#15294a" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#a50044" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#050a14" }] }
      ]
    });

    info_pop = new google.maps.InfoWindow();
    dibujarPuntosGoogle(lugares_quito);
  } catch (e) {
    fallbackLeaflet();
  }
}

function dibujarPuntosGoogle(lista) {
  google_markers.forEach(m => m.setMap(null));
  google_markers = [];

  lista.forEach(item => {
    const m = new google.maps.Marker({
      position: { lat: item.lat, lng: item.lng },
      map: mapa_ref,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8, fillColor: "#a50044", fillOpacity: 0.95,
        strokeWeight: 2, strokeColor: "#e2b041"
      }
    });

    m.addListener("click", () => {
      let act = item.actividades ? `<ul>${item.actividades.map(a => `<li>${a}</li>`).join('')}</ul>` : '';
      info_pop.setContent(`
        <div style="color:#fff; font-family:sans-serif; padding:4px;">
          <b style="color:#e2b041; font-size:14px;">${item.sticker} ${item.nombre}</b><br>
          <small style="color:#a50044;"><b>${item.categoria}</b> | ${item.zona}</small>
          <p style="margin:6px 0; font-size:12px;">${item.descripcion}</p>
          ${act}
          <div style="background:#15294a; padding:6px; margin-top:6px; border-radius:4px; font-size:11px;">
            💡 ${item.recomendacion}
          </div>
        </div>
      `);
      info_pop.open(mapa_ref, m);
      document.getElementById('galloSpeech').innerText = `${guia_activa.nombre}: ${item.nombre} - ${item.info}`;
    });

    google_markers.push(m);
  });
}

function fallbackLeaflet() {
  const b = L.latLngBounds([-0.5500, -78.7800], [-0.0010, -78.3900]);
  const leafMap = L.map('map', { center: [-0.2300, -78.5100], zoom: 12, maxBounds: b });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(leafMap);
  capa_puntos = L.layerGroup().addTo(leafMap);

  renderLeaflet(lugares_quito);
}

function renderLeaflet(lista) {
  if (!capa_puntos) return;
  capa_puntos.clearLayers();

  lista.forEach(item => {
    const p = L.circleMarker([item.lat, item.lng], {
      radius: 8, fillColor: '#a50044', color: '#e2b041', weight: 2, fillOpacity: 0.9
    });

    p.bindPopup(`<b>${item.sticker} ${item.nombre}</b><br>${item.descripcion}`);
    p.on('click', () => {
      document.getElementById('galloSpeech').innerText = `${guia_activa.nombre}: ${item.nombre}`;
    });
    capa_puntos.addLayer(p);
  });
}

function abrirMenu() {
  document.getElementById('sideMenuModal').classList.toggle('hidden');
}

function filtrar(cat) {
  let res = lugares_quito;
  if (cat === 'GRATIS') res = lugares_quito.filter(x => x.categoria === 'GRATIS');
  else if (cat === 'PAID') res = lugares_quito.filter(x => x.categoria !== 'GRATIS');
  else if (cat !== 'TODOS') res = lugares_quito.filter(x => x.etiqueta === cat);

  if (mapa_ref && mapa_ref.getBounds) dibujarPuntosGoogle(res);
  else renderLeaflet(res);

  abrirMenu();
  document.getElementById('galloSpeech').innerText = `${guia_activa.nombre}: ${res.length} resultados para ${cat}.`;
}
