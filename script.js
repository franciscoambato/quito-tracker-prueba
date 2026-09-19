let map;
let infoWindow;
let markersList = [];
let personajeActual = { nombre: 'MARCO O LUCÍA', video: './gallo.mp4' };

const GOOGLE_MAPS_API_KEY = "AIzaSyD7yh3TteD4adDL8pAVXIEGr6RXksDKGLo";

const MAP_BOUNDS = {
  north: -0.0010,
  south: -0.5500,
  west: -78.7800,
  east: -78.3900
};

// Datos integrados directamente para evitar errores de fetch/CORS en GitHub Pages
const lugaresPuntos = [
  {
    "etiqueta": "CENTRO HISTÓRICO",
    "nombre": "Teatro Nacional Sucre",
    "lat": -0.2185,
    "lng": -78.5083,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Cultura y Arte",
    "sticker": "🎭",
    "info": "Eventos y obras desde $5.00 a $15.00 USD. Recorridos exteriores libres.",
    "descripcion": "El teatro neoclásico más emblemático de la ciudad, epicentro de conciertos, obras teatrales y festivales culturales de Quito.",
    "actividades": ["Asistir a funciones de teatro y ópera", "Fotografiar la fachada neoclásica en la Plaza del Teatro", "Tomar café en sus terrazas cercanas"],
    "recomendacion": "Revisa la cartelera cultural semanal antes de ir."
  },
  {
    "etiqueta": "CENTRO HISTÓRICO",
    "nombre": "Calle Galápagos y Sector San Blas",
    "lat": -0.2162,
    "lng": -78.5058,
    "categoria": "GRATIS",
    "zona": "CENTRO",
    "tipo": "Arquitectura y Paseo",
    "sticker": "🏘️",
    "info": "Acceso libre.",
    "descripcion": "Considerada la entrada tradicional al Centro Histórico. Lleno de arquitectura republicana, barberías antiguas, pasajes coloridos y cafeterías tradicionales.",
    "actividades": ["Caminar por pasajes coloniales", "Probar pan tradicional de horno de leña", "Fotografiar murales de arte urbano"],
    "recomendacion": "Recórrelo a pie conectando con la Plaza de San Blas."
  },
  {
    "etiqueta": "CENTRO HISTÓRICO",
    "nombre": "Palacio de Carondelet",
    "lat": -0.2205,
    "lng": -78.5125,
    "categoria": "GRATIS",
    "zona": "CENTRO",
    "tipo": "Patrimonio Político",
    "sticker": "🏛️",
    "info": "Acceso libre previa reserva con documento de identidad.",
    "descripcion": "Sede de la Presidencia de la República. Alberga salas históricas, regalos de estado e historias diplomáticas del país.",
    "actividades": ["Recorrido guiado por los salones presidenciales", "Conocer la colección de regalos presidenciales", "Mirador hacia la Plaza Grande"],
    "recomendacion": "Obligatorio presentar cédula o pasaporte físico en el ingreso."
  },
  {
    "etiqueta": "CENTRO HISTÓRICO",
    "nombre": "Plaza y Convento de San Agustín",
    "lat": -0.2210,
    "lng": -78.5102,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Historia y Arte Barroco",
    "sticker": "⛪",
    "info": "Ingreso al museo: $2.00 USD.",
    "descripcion": "Lugar histórico donde se firmó el Acta de la Independencia en 1809. Posee una pinacoteca impresionante de Miguel de Santiago.",
    "actividades": ["Visitar la Sala Capitular de la Independencia", "Admirar lienzos barrocos del siglo XVII", "Pasear por el patio de los naranjos"],
    "recomendacion": "Pide la visita guiada para acceder a la Sala Capitular."
  },
  {
    "etiqueta": "CENTRO HISTÓRICO",
    "nombre": "Plaza e Iglesia de Santa Clara",
    "lat": -0.2242,
    "lng": -78.5165,
    "categoria": "GRATIS",
    "zona": "CENTRO",
    "tipo": "Misterio y Tradición",
    "sticker": "🕊️",
    "info": "Acceso libre a la plaza y templo exterior.",
    "descripcion": "Tranquila plaza rodeada por el Convento de Santa Clara, famosa por su mercado gastronómico cercano y ambiente patrimonial tradicional.",
    "actividades": ["Visitar el Mercado de Santa Clara", "Probar hornado tradicional y jugos naturales", "Admirar la arquitectura de monasterio de clausura"],
    "recomendacion": "Punto ideal para almorzar comida típica de mercado."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Estación de Trenes de Chimbacalle",
    "lat": -0.2385,
    "lng": -78.5138,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Patrimonio Ferroviario",
    "sticker": "🚂",
    "info": "Entrada libre al complejo exterior y plazoleta.",
    "descripcion": "La icónica estación construida a inicios del siglo XX durante el gobierno de Eloy Alfaro que unió la Costa con la Sierra ecuatoriana.",
    "actividades": ["Fotografiar locomotoras históricas a vapor", "Aprender sobre la ingeniería ferroviaria andina", "Visitar el museo del tren"],
    "recomendacion": "Se conecta caminando con el Museo Interactivo de Ciencia (MIC)."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Villa Flora (Sector Gastronómico y Comercial)",
    "lat": -0.2462,
    "lng": -78.5198,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Vida Urbana y Comida",
    "sticker": "🌭",
    "info": "Platos tradicionales desde $3.00 hasta $8.00 USD.",
    "descripcion": "Uno de los barrios más tradicionales, activos y emblemáticos del sur. Famoso por su zona de comida rápida local, cafeterías y plazas tradicionales.",
    "actividades": ["Probar la famosa gastronomía urbana del sur", "Caminar por el Redondel de la Villa Flora", "Paseo de compras tradicionales"],
    "recomendacion": "Visítalo por la tarde para degustar morocho caliente, empanadas y tripa mishqui."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Cima de la Libertad y Templo de la Patria",
    "lat": -0.2285,
    "lng": -78.5285,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Historia Militar y Mirador",
    "sticker": "🎖️",
    "info": "Adultos: $1.00 USD. Estudiantes y niños: $0.25 USD.",
    "descripcion": "Ubicado en las faldas del Pichincha donde se libró la Batalla de Pichincha en 1822. Ofrece un museo de armas y el mejor mirador del sur-centro.",
    "actividades": ["Visitar la tumba del soldado desconocido", "Observar la maqueta militar de la batalla de 1822", "Mirador elevado hacia todo Quito"],
    "recomendacion": "Subir en taxi y solicitar al conductor que te espere para el retorno."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Parque Ecológico Solanda",
    "lat": -0.2682,
    "lng": -78.5350,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Recreación Urbana",
    "sticker": "🏃",
    "info": "Acceso libre.",
    "descripcion": "Ubicado en el populoso sector de Solanda, es un punto neurálgico de deporte, integración familiar y gastronomía popular.",
    "actividades": ["Trotes por pistas recreativas", "Probar los platillos de la 'Calle de la J'", "Deporte al aire libre"],
    "recomendacion": "Por las noches la cercana 'Calle J' se transforma en un centro culinario muy concurrido."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Convento y Templo de San Bartolo",
    "lat": -0.2580,
    "lng": -78.5270,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Patrimonio Comunitario",
    "sticker": "⛪",
    "info": "Acceso libre.",
    "descripcion": "Sector histórico del sur que creció alrededor de antiguos obrajes e iglesias comunitarias. Conserva su estilo de barrio tradicional.",
    "actividades": ["Caminatas por la plaza barrial", "Fotografiar la arquitectura religiosa tradicional del sur", "Mercados comunitarios"],
    "recomendacion": "Conéctalo con tu ruta gastronómica por el sur."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Quicentro Sur y Plaza de la Salud",
    "lat": -0.2835,
    "lng": -78.5442,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Ocio y Compras",
    "sticker": "🛍️",
    "info": "Acceso libre al centro comercial.",
    "descripcion": "El centro de entretenimiento y comercial más grande del sur de la ciudad, con salas de cine, restaurantes y plazoletas abiertas.",
    "actividades": ["Ir al cine", "Patinar o ir a zonas de juegos mecánicos", "Comer en su amplia plaza gastronómica"],
    "recomendacion": "Ideal si buscas un plan bajo techo o de compras en la zona sur."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Parque Lineal Machángara Sur",
    "lat": -0.2720,
    "lng": -78.5312,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Naturaleza Urbana",
    "sticker": "🌿",
    "info": "Acceso libre.",
    "descripcion": "Área verde de recuperación ambiental a lo largo del tramo sur del río Machángara, equipada con canchas y senderos para caminata.",
    "actividades": ["Caminatas ecológicas urbanas", "Paseo de mascotas", "Estar al aire libre en familia"],
    "recomendacion": "Usar durante el día y el fin de semana."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Plaza Comercial y Gastronómica Chillogallo",
    "lat": -0.2915,
    "lng": -78.5580,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Historia y Gastronomía",
    "sticker": "🍗",
    "info": "Platos populares desde $2.50 a $6.00 USD.",
    "descripcion": "Chillogallo es una de las parroquias históricas más antiguas del sur. Aquí descansó el ejército libertador antes de la Batalla de Pichincha.",
    "actividades": ["Visitar la iglesia parroquial histórica", "Probar el famoso caldo de 30 o la fritada sureña", "Conocer el Museo Mariscal Sucre de Chillogallo"],
    "recomendacion": "Visita el Museo Casa de Sucre en Chillogallo para ver los dormitorios donde acampó el ejército patriota."
  },
  {
    "etiqueta": "SALIENDO DEL SUR / PERIFERIA",
    "nombre": "Reserva Ecológica Pasochoa",
    "lat": -0.4520,
    "lng": -78.4810,
    "categoria": "HASTA $10 USD",
    "zona": "SALIDA SUR",
    "tipo": "Senderismo y Bosque Andino",
    "sticker": "🥾",
    "info": "Entrada libre al parque nacional. Transporte o guías adicionales $5.00 - $10.00 USD.",
    "descripcion": "Ubicado en la salida sur (vía Tambillo/Amaguaña). Un caldera volcánica extinta que protege uno de los últimos bosques húmedos andinos de la hoya de Quito.",
    "actividades": ["Senderismo de montaña entre alisos y orquídeas", "Avistamiento de aves (colibríes y cóndores)", "Fotografía de naturaleza"],
    "recomendacion": "Ir equipado con botas de montaña y chaqueta impermeable."
  },
  {
    "etiqueta": "SALIENDO DEL SUR / PERIFERIA",
    "nombre": "Volcán e Ilaló (Vertiente Sur / La Merced)",
    "lat": -0.3012,
    "lng": -78.4185,
    "categoria": "GRATIS",
    "zona": "SALIDA SUR-VALLE",
    "tipo": "Aventura y Naturaleza",
    "sticker": "⛰️",
    "info": "Acceso libre a los senderos.",
    "descripcion": "Antiguo volcán extinto ubicado a la salida sureste. Famoso por sus rutas de ascenso rápido con vistas panorámicas increíbles de los valles y volcanes.",
    "actividades": ["Caminata hacia la Cruz del Ilaló", "Ciclismo de montaña en descenso", "Ver el amanecer sobre el Valle de los Chillos"],
    "recomendacion": "Empieza el ascenso a las 6:00 AM para evitar el calor del mediodía."
  },
  {
    "etiqueta": "SALIENDO DEL SUR / PERIFERIA",
    "nombre": "Termas de El Tingo",
    "lat": -0.3115,
    "lng": -78.4485,
    "categoria": "HASTA $10 USD",
    "zona": "SALIDA SUR-VALLE",
    "tipo": "Termalismo y Relax",
    "sticker": "🏊",
    "info": "Entrada general: $3.00 USD. Niños y tercera edad: $1.00 USD.",
    "descripcion": "Balneario de aguas termales volcánicas de origen volcánico con propiedades minerales ubicado bajando por el suroriente hacia el Valle de los Chillos.",
    "actividades": ["Bañarse en piscinas termales curativas", "Probar los hornados y chorrijos de El Tingo", "Paseo familiar"],
    "recomendacion": "Llevar gorro de baño obligatorio para el ingreso a las piscinas."
  },
  {
    "etiqueta": "SALIENDO DEL SUR / PERIFERIA",
    "nombre": "Tambillo y Estación de Tren Histórica",
    "lat": -0.4125,
    "lng": -78.5312,
    "categoria": "GRATIS",
    "zona": "SALIDA SUR (MEJÍA)",
    "tipo": "Pueblo Tradicional",
    "sticker": "🌽",
    "info": "Acceso libre.",
    "descripcion": "La primera parroquia rural saliendo de Quito hacia el sur por la Panamericana. Punto tradicional de paso con arquitectura de pueblo andino y gastronomía local.",
    "actividades": ["Probar quesos de hoja y bizcochos tradicionales", "Visitar la plaza central de Tambillo", "Fotografiar la antigua vía del tren"],
    "recomendacion": "Parada perfecta para desayunar saliendo hacia el volcán Cotopaxi."
  },
  {
    "etiqueta": "SALIENDO DEL SUR / PERIFERIA",
    "nombre": "Cascadas de Cóndor Machay (Rumipamba)",
    "lat": -0.4350,
    "lng": -78.4215,
    "categoria": "HASTA $10 USD",
    "zona": "SALIDA SUR (RUMIÑAHUI)",
    "tipo": "Senderismo y Cascadas",
    "sticker": "🌊",
    "info": "Entrada comunitaria: $2.00 USD.",
    "descripcion": "Caminata ecológica rodeando el río Pita que te lleva hasta una imponente cascada de más de 80 metros de altura rodeada de vegetación nativa.",
    "actividades": ["Caminar por puentes colgantes de madera", "Llegar a la base de la impresionante cascada", "Pícnic junto al río Pita"],
    "recomendacion": "El trayecto de caminata toma aprox. 1 hora y media por sentido; lleva zapatos con buen agarre."
  },
  {
    "etiqueta": "SALIENDO DEL SUR / PERIFERIA",
    "nombre": "Machachi y Parque Central de los Chagras",
    "lat": -0.5102,
    "lng": -78.5680,
    "categoria": "GRATIS",
    "zona": "SALIDA SUR (MACHACHI)",
    "tipo": "Cultura Chagra y Volcanes",
    "sticker": "🤠",
    "info": "Acceso libre al centro urbano.",
    "descripcion": "El corazón de la cultura chacarera (vaqueros de los Andes). Machachi es el punto de partida hacia la Avenida de los Volcanes al sur de Quito.",
    "actividades": ["Conocer la cultura e indumentaria del Chagra", "Probar helados de paila y yogur artesanal de la zona", "Vista hacia los volcanes Cotopaxi, Rumiñahui y Corazón"],
    "recomendacion": "Visítalo un domingo de mercado para ver la vestimenta tradicional de ponchos y zamarros."
  },
  {
    "etiqueta": "SALIENDO DEL SUR / PERIFERIA",
    "nombre": "Fuentes de Agua Güitig (Tesalia)",
    "lat": -0.5285,
    "lng": -78.5510,
    "categoria": "HASTA $10 USD",
    "zona": "SALIDA SUR (MACHACHI)",
    "tipo": "Naturaleza y Vertientes",
    "sticker": "🍾",
    "info": "Tours guiados desde $3.00 a $5.00 USD.",
    "descripcion": "Las vertientes naturales de agua mineral con gas natural originadas en el deshielo de los volcanes Cotopaxi e Ilinizas en Machachi.",
    "actividades": ["Probar agua mineral con gas directamente de la fuente natural", "Pasear por los jardines del vertedero Tesalia", "Conocer el proceso de embotellado histórico"],
    "recomendacion": "Requiere consulta previa para visitas a las instalaciones de las fuentes."
  }
];

window.onload = function() {
  iniciarEstaticaTerminal();
};

function iniciarEstaticaTerminal() {
  const lineas = [
    "> INITIALIZING CYBER_QUITO_NET...",
    "[OK] Cargando nodos geográficos de Quito...",
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
  
  // Si la API Key de Google falla en GitHub Pages, usa Leaflet automáticamente sin dejar la pantalla negra
  script.onerror = () => {
    inicializarMapaLeafletFallback();
  };

  document.head.appendChild(script);
}

function initMap() {
  try {
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
  } catch (e) {
    inicializarMapaLeafletFallback();
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

  if (map && map.getBounds) {
    renderizarMarcadores(filtrados);
  } else if (window.leafMap) {
    renderizarLeaflet(filtrados);
  }

  toggleMenu();
  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: Mostrando ${filtrados.length} lugares para ${categoria}.`;
}

// Respaldo de Mapa en caso de que Google restringa la Key en GitHub Pages
function inicializarMapaLeafletFallback() {
  const bounds = L.latLngBounds([-0.5500, -78.7800], [-0.0010, -78.3900]);
  window.leafMap = L.map('map', {
    center: [-0.2300, -78.5100],
    zoom: 12,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(window.leafMap);

  window.leafMarkers = L.layerGroup().addTo(window.leafMap);
  renderizarLeaflet(lugaresPuntos);
}

function renderizarLeaflet(puntos) {
  if (!window.leafMarkers) return;
  window.leafMarkers.clearLayers();

  puntos.forEach(lugar => {
    const marker = L.circleMarker([lugar.lat, lugar.lng], {
      radius: 8,
      fillColor: '#a50044',
      color: '#e2b041',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.95
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
        <div style="font-size: 11px; background-color: #15294a; padding: 6px; border-radius: 4px;">
          💡 <strong>Recomendación:</strong> ${lugar.recomendacion}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    marker.on('click', () => {
      document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ¡${lugar.nombre}! ${lugar.info}`;
    });

    window.leafMarkers.addLayer(marker);
  });
}
