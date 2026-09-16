let map;
let infoWindow;
let markersList = [];
let puntoSeleccionado = null;
let personajeActual = { nombre: 'MARCO', video: './gallo.mp4' };

// LÍMITES SOLICITADOS (Tambillo / Cotopaxi hasta Mitad del Mundo)
const MAP_BOUNDS = {
  north: -0.0010,
  south: -0.8000, // Extendida hacia el sur para incluir Cotopaxi/Mejía correctamente
  west: -78.7800,
  east: -78.3900
};

// Unión completa de todos los lugares (Norte, Centro, Sur y Machachi)
let lugaresPuntos = [
  // PLANES Y MUSEOS INICIALES
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
  },

  // SUR DE QUITO Y PERIFERIA
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Mercado Mayorista de Quito",
    "lat": -0.2785,
    "lng": -78.5390,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Gastronomía Popular y Mercado",
    "sticker": "🍎",
    "info": "Consumos populares desde $2.00 hasta $5.00 USD.",
    "descripcion": "El centro de acopio alimentario más grande de la ciudad. Famoso por su autenticidad y patios de comida.",
    "recomendacion": "Visítalo en la mañana para encontrar la mejor comida fresca."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Plaza Quitumbe y Terminal Terrestre",
    "lat": -0.3015,
    "lng": -78.5498,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Transporte e Historia Moderna",
    "sticker": "🚌",
    "info": "Acceso libre.",
    "descripcion": "Nodo vial moderno del sur conectado con la primera parada del Metro de Quito.",
    "recomendacion": "Punto de inicio si vas hacia Machachi o Cotopaxi."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Bulevar Ajaví / Prensa Sur",
    "lat": -0.2610,
    "lng": -78.5280,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Paseo Urbano",
    "sticker": "👟",
    "info": "Acceso libre.",
    "descripcion": "Zona residencial y comercial muy concurrida del sur con bulevares peatonalizados.",
    "recomendacion": "Ideal para una caminata tranquila."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Iglesia y Plaza de Guamaní",
    "lat": -0.3210,
    "lng": -78.5520,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Tradición Barrial",
    "sticker": "⛪",
    "info": "Acceso libre.",
    "descripcion": "Barrio tradicional del sur con mercados abiertos y ferias de fin de semana.",
    "recomendacion": "Ve los domingos por la mañana."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Parque Caupicho",
    "lat": -0.3120,
    "lng": -78.5380,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Deporte y Recreación",
    "sticker": "⚽",
    "info": "Acceso libre.",
    "descripcion": "Espacio verde recuperado en Caupicho muy frecuentado por familias.",
    "recomendacion": "Excelente para hacer deporte temprano."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Museo Tren de la Libertad / Chimbacalle",
    "lat": -0.2392,
    "lng": -78.5145,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Historia Industrial",
    "sticker": "🎟️",
    "info": "Ingresos desde $2.00 USD.",
    "descripcion": "Estación de Chimbacalle dedicada a la historia del Ferrocarril Trasandino.",
    "recomendacion": "Complementa con la visita al MIC."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Plaza Comercial Camilo Ponce Enríquez",
    "lat": -0.2520,
    "lng": -78.5210,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Comercio Local",
    "sticker": "🏬",
    "info": "Acceso libre.",
    "descripcion": "Punto de encuentro comercial tradicional en la zona de Chimbacalle.",
    "recomendacion": "Muy tranquilo para caminar de paso."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Sector La Magdalena",
    "lat": -0.2380,
    "lng": -78.5250,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Patrimonio Histórico",
    "sticker": "🏛️",
    "info": "Acceso libre.",
    "descripcion": "Antiguo pueblo colonial con su plaza central, casas con tejados e iglesia.",
    "recomendacion": "Descarga en la estación del Metro La Magdalena."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Parque San Martín de Porres",
    "lat": -0.2750,
    "lng": -78.5320,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Recreación Familiar",
    "sticker": "🌳",
    "info": "Acceso libre.",
    "descripcion": "Tranquilo parque barrial con vegetación y áreas infantiles.",
    "recomendacion": "Visítalo para un descanso tranquilo."
  },
  {
    "etiqueta": "SUR DE QUITO",
    "nombre": "Parroquia Rural de Turubamba",
    "lat": -0.3350,
    "lng": -78.5450,
    "categoria": "GRATIS",
    "zona": "SUR",
    "tipo": "Cultura Tradicional",
    "sticker": "🌾",
    "info": "Acceso libre.",
    "descripcion": "Antigua llanura ceremonial precolombina en el límite sur.",
    "recomendacion": "Aprovecha sus ferias agrícolas mañaneras."
  },

  // AMAGUAÑA Y MACHACHI
  {
    "etiqueta": "AMAGUAÑA Y PERIFERIA SUR",
    "nombre": "Parque Central de Amaguaña",
    "lat": -0.3812,
    "lng": -78.5020,
    "categoria": "GRATIS",
    "zona": "PERIFERIA SUR",
    "tipo": "Pueblo Tradicional y Carnaval",
    "sticker": "🎭",
    "info": "Acceso libre.",
    "descripcion": "Valle agrícola célebre por sus fiestas tradicionales de Carnaval.",
    "recomendacion": "Visítalo en Carnaval para ver sus comparsas."
  },
  {
    "etiqueta": "AMAGUAÑA Y PERIFERIA SUR",
    "nombre": "Bosque Protector La Mirlos",
    "lat": -0.3950,
    "lng": -78.4850,
    "categoria": "HASTA $10 USD",
    "zona": "PERIFERIA SUR",
    "tipo": "Ecoturismo",
    "sticker": "🌿",
    "info": "Entrada $3.00 USD aprox.",
    "descripcion": "Área de conservación natural con senderos, arroyos y flora nativa.",
    "recomendacion": "Lleva calzado adecuado para caminata."
  },
  {
    "etiqueta": "AMAGUAÑA Y PERIFERIA SUR",
    "nombre": "Chorrera de Pita (Amaguaña)",
    "lat": -0.4180,
    "lng": -78.4420,
    "categoria": "HASTA $10 USD",
    "zona": "PERIFERIA SUR",
    "tipo": "Naturaleza Salvaje",
    "sticker": "💧",
    "info": "Entradas $3.00 a $5.00 USD.",
    "descripcion": "Tramo alto del río Pita alimentado por los deshielos del Cotopaxi.",
    "recomendacion": "Se recomienda ir en vehículo alto."
  },
  {
    "etiqueta": "MACHACHI Y CANTON MEJÍA",
    "nombre": "Estación del Tren de Machachi (Aloasí)",
    "lat": -0.5210,
    "lng": -78.5810,
    "categoria": "GRATIS",
    "zona": "MACHACHI",
    "tipo": "Patrimonio y Fotografía",
    "sticker": "🚂",
    "info": "Acceso libre.",
    "descripcion": "Estación clásica rodeada de eucaliptos al pie del volcán Corazón.",
    "recomendacion": "Mañanas despejadas para fotos espectaculares."
  },
  {
    "etiqueta": "MACHACHI Y CANTON MEJÍA",
    "nombre": "Santuario Corazón de Jesús (Aloasí)",
    "lat": -0.5250,
    "lng": -78.5880,
    "categoria": "GRATIS",
    "zona": "MACHACHI",
    "tipo": "Mirador Religioso",
    "sticker": "⛪",
    "info": "Acceso libre.",
    "descripcion": "Santuario en colina con vista panorámica a todo el valle de Machachi.",
    "recomendacion": "Sube al atardecer."
  },
  {
    "etiqueta": "MACHACHI Y CANTON MEJÍA",
    "nombre": "Volcán Corazón (Base de Ascenso)",
    "lat": -0.5310,
    "lng": -78.6180,
    "categoria": "GRATIS",
    "zona": "MACHACHI",
    "tipo": "Montañismo",
    "sticker": "🏔️",
    "info": "Acceso libre.",
    "descripcion": "Estratovolcán extinto ideal para aclimatación de senderistas.",
    "recomendacion": "Inicia la caminata antes de las 7:00 AM."
  },
  {
    "etiqueta": "MACHACHI Y CANTON MEJÍA",
    "nombre": "Feria del Queso y Ganado de Machachi",
    "lat": -0.5080,
    "lng": -78.5610,
    "categoria": "GRATIS",
    "zona": "MACHACHI",
    "tipo": "Cultura Chagra",
    "sticker": "🧀",
    "info": "Acceso libre.",
    "descripcion": "Mercado ganadero famoso por sus quesos frescos y mantequilla artesanal.",
    "recomendacion": "Prueba los quesos en hoja de achira."
  },
  {
    "etiqueta": "MACHACHI Y CANTON MEJÍA",
    "nombre": "Parroquia Rural de Alóag",
    "lat": -0.4680,
    "lng": -78.5820,
    "categoria": "GRATIS",
    "zona": "MACHACHI",
    "tipo": "Encrucijada Andina",
    "sticker": "🌲",
    "info": "Acceso libre.",
    "descripcion": "Punto de conexión Panamericana con paraderos gastronómicos de carne asada.",
    "recomendacion": "Parada obligada si viajas a la Costa."
  },
  {
    "etiqueta": "MACHACHI Y CANTON MEJÍA",
    "nombre": "Reserva Natural La Viña (Alóag)",
    "lat": -0.4580,
    "lng": -78.6010,
    "categoria": "HASTA $10 USD",
    "zona": "MACHACHI",
    "tipo": "Naturaleza y Camping",
    "sticker": "🏕️",
    "info": "Ingreso $3.00 USD.",
    "descripcion": "Bosque nativo equipado con espacios para acampar y fogatas.",
    "recomendacion": "Lleva tienda de campaña para frío andino."
  },
  {
    "etiqueta": "MACHACHI Y CANTON MEJÍA",
    "nombre": "Granja Agroecológica de El Chaupi",
    "lat": -0.5820,
    "lng": -78.6250,
    "categoria": "HASTA $10 USD",
    "zona": "MACHACHI",
    "tipo": "Agroturismo",
    "sticker": "🥛",
    "info": "Guiados desde $4.00 USD.",
    "descripcion": "Ofrece experiencias de ordeño manual y convivencia con alpacas.",
    "recomendacion": "Ideal para ir con niños."
  },

  // RUTA DE LOS VOLCANES
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Base de Ascenso a los Ilinizas",
    "lat": -0.6320,
    "lng": -78.6850,
    "categoria": "GRATIS",
    "zona": "ALREDEDORES MACHACHI",
    "tipo": "Alta Montaña",
    "sticker": "🧗",
    "info": "Acceso libre.",
    "descripcion": "Punto de partida hacia los Ilinizas con paisajes de páramo puro.",
    "recomendacion": "Ir con ropa térmica adecuada."
  },
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Termas de San Pedro de Nono (Sur)",
    "lat": -0.4850,
    "lng": -78.5380,
    "categoria": "HASTA $10 USD",
    "zona": "ALREDEDORES MACHACHI",
    "tipo": "Relax Mineral",
    "sticker": "♨️",
    "info": "Entradas desde $4.00 USD.",
    "descripcion": "Vertientes de agua tibia enriquecidas con minerales del Pasochoa.",
    "recomendacion": "Lleva traje de baño y toalla."
  },
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Bosque de Polylepis de Pasochoa",
    "lat": -0.4650,
    "lng": -78.5020,
    "categoria": "HASTA $10 USD",
    "zona": "ALREDEDORES MACHACHI",
    "tipo": "Bosque Mágico",
    "sticker": "🌳",
    "info": "Ingreso $3.00 USD.",
    "descripcion": "Bosque relicto de árboles de papel con musgos y flora nativa.",
    "recomendacion": "Usa calzado antideslizante."
  },
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Hacienda La Ciénega",
    "lat": -0.7650,
    "lng": -78.5850,
    "categoria": "HASTA $10 USD",
    "zona": "ALREDEDORES MACHACHI",
    "tipo": "Patrimonio Colonial",
    "sticker": "🏰",
    "info": "Consumos desde $5.00 USD.",
    "descripcion": "Hacienda del siglo XVII donde se hospedó Alexander von Humboldt.",
    "recomendacion": "Excelente lugar para un café colonial."
  },
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Mirador del Cotopaxi en Tambillo",
    "lat": -0.4280,
    "lng": -78.5150,
    "categoria": "GRATIS",
    "zona": "ALREDEDORES MACHACHI",
    "tipo": "Mirador Fotográfico",
    "sticker": "📸",
    "info": "Acceso libre.",
    "descripcion": "Mirador elevado para contemplar el Cotopaxi despejado.",
    "recomendacion": "Mejor vista entre 6:30 AM y 8:30 AM."
  },
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Parroquia Rural de Uyumbicho",
    "lat": -0.3920,
    "lng": -78.5180,
    "categoria": "GRATIS",
    "zona": "PERIFERIA SUR",
    "tipo": "Pueblo de Paramo",
    "sticker": "🏘️",
    "info": "Acceso libre.",
    "descripcion": "Tranquila parroquia rural rodeada de quebradas y senderos.",
    "recomendacion": "Prueba sus tortillas de tiesto con café de olla."
  },
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Área Recreativa El Boliche",
    "lat": -0.7320,
    "lng": -78.5780,
    "categoria": "GRATIS",
    "zona": "ALREDEDORES MACHACHI",
    "tipo": "Parque Nacional",
    "sticker": "🌲",
    "info": "Acceso libre registrándose.",
    "descripcion": "Bosques densos de pino a más de 3.500 metros sobre el nivel del mar.",
    "recomendacion": "Lleva abrigo pesado."
  },
  {
    "etiqueta": "RUTA DE LOS VOLCANES Y ALREDEDORES",
    "nombre": "Laguna de Limpiopungo",
    "lat": -0.6120,
    "lng": -78.4720,
    "categoria": "GRATIS",
    "zona": "ALREDEDORES MACHACHI",
    "tipo": "Laguna de Paramo",
    "sticker": "🦆",
    "info": "Acceso libre registrándose.",
    "descripcion": "Laguna glaciar a los pies del volcán Rumiñahui y Cotopaxi.",
    "recomendacion": "Ideal para caminatas familiares planas."
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
  // Reemplaza API_KEY con tu clave si es requerida
  script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMap&loading=async`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    console.warn("API de Google Maps no detectada o falló al cargar.");
  };
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

function seleccionarLugar(lugar, marker) {
  puntoSeleccionado = lugar;
  
  const contenidoIW = `
    <div style="font-family:'Press Start 2P', monospace; font-size:8px; color:#ffffff; background:#1a0b2e; padding:6px; border-radius:6px;">
      <div style="color:#00f0ff; margin-bottom:4px;">${lugar.sticker} ${lugar.nombre}</div>
      <div style="color:#ff007f; margin-bottom:4px;">${lugar.categoria}</div>
      <p style="margin:2px 0; color:#dddddd; line-height: 1.2;">${lugar.descripcion}</p>
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
