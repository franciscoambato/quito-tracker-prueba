let map;
let infoWindow;
let markersList = [];
let puntoSeleccionado = null;
let personajeActual = { nombre: 'MARCO', video: './gallo.mp4' };

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
    "descripcion": "Concepto de café-taller súper viral en redes enfocado en liberar el estrés. Puedes tomar café o bebidas frías mientras personalizas cerámica, macetas, lienzos, gorras o bolsas de tela.",
    "actividades": ["Pintar macetas y piezas de cerámica", "Personalizar tote bags o lienzos", "Disfrutar de café y postres gourmet"],
    "recomendacion": "Ideal para ir en pareja o con amigos. Reserva con tiempo o ve temprano los fines de semana."
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
    "info": "Kits de arcilla y pintura desde $15.00 hasta $25.00 USD.",
    "descripcion": "Un espacio con estética acogedora diseñado para amantes del arte en arcilla y la cerámica. Ofrecen kits completos con pinceles y pinturas acrílicas para moldear y pintar macetas, tazas o espejos.",
    "actividades": ["Moldear arcilla desde cero", "Pintar macetas, tazas y espejos de mesa", "Armar pulseras con charms mientras tomas café"],
    "recomendacion": "Su kit de regalo con pieza de cerámica es uno de los planes más populares entre jóvenes en TikTok e Instagram."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "CelebrART (Galería & Gastronomía)",
    "lat": -0.1985,
    "lng": -78.4358,
    "categoria": "HASTA $15 USD",
    "zona": "CUMBAYÁ / NORTE",
    "tipo": "Plan Jóvenes 3 / Arte & Cerveza Artesanal",
    "sticker": "🍷",
    "info": "Actividades y consumo desde $10.00 USD.",
    "descripcion": "Centro cultural y galería en Cumbayá que combina exposiciones de arte de jóvenes artistas con talleres de pintura en vivo, tapas españolas y cerveza artesanal.",
    "actividades": ["Pintar cerámica en barra o mesa", "Probar tapas y cerveza artesanal", "Recorrer las salas de exposiciones de arte emergente"],
    "recomendacion": "Revisa su agenda cultural mensual ya que organizan eventos de pintura nocturna con vino."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Café Taller Tamayo",
    "lat": -0.2035,
    "lng": -78.4890,
    "categoria": "HASTA $15 USD",
    "zona": "NORTE (La Mariscal)",
    "tipo": "Plan Jóvenes 4 / Pintura por Números",
    "sticker": "🖼️",
    "info": "Kits y talleres desde $15.00 USD (Bajo cita previa).",
    "descripcion": "Espacio pet-friendly perfecto para quienes quieren pintar cuadros sin experiencia previa. Te entregan lienzos guiados por números, copas de cristal para decorar o telas preparadas.",
    "actividades": ["Pintar lienzos por números guiados", "Decorar copas de vidrio", "Ir acompañado de tu mascota"],
    "recomendacion": "Atienden bajo reserva previa, ideal para cumpleaños o citas tranquilas."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Ochoymedio (Cine Independiente & Café)",
    "lat": -0.2082,
    "lng": -78.4860,
    "categoria": "HASTA $10 USD",
    "zona": "NORTE (La Floresta)",
    "tipo": "Plan Jóvenes 5 / Cine & Cultura Indie",
    "sticker": "🎬",
    "info": "Entradas al cine desde $5.00 USD. Café y snacks desde $3.00 USD.",
    "descripcion": "El epicentro de la cultura urbana e indie de Quito en el barrio creativo La Floresta. Proyectan cine independiente y cuentan con un café al aire libre con ambiente cultural.",
    "actividades": ["Ver películas de autor e independientes", "Tomar café o cerveza artesanal en el patio", "Ver conversatorios y ferias de arte local"],
    "recomendacion": "Camina por el barrio La Floresta antes de tu función para tomar fotos de sus murales de arte urbano."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Librería y Cafetería Rayuela",
    "lat": -0.1982,
    "lng": -78.4810,
    "categoria": "HASTA $10 USD",
    "zona": "NORTE",
    "tipo": "Plan Jóvenes 6 / Café & Lectura Aesthetic",
    "sticker": "📚",
    "info": "Consumos en cafetería desde $3.50 USD.",
    "descripcion": "Librería independiente con espacio de cafetería integrada. Muy frecuentada por estudiantes universitarios y creadores de contenido por sus rincocitos tranquilos de lectura.",
    "actividades": ["Leer novelas o cómics mientras tomas café de especialidad", "Probar repostería artesanal", "Asistir a clubes de lectura y lanzamientos"],
    "recomendacion": "Excelente opción si buscas un lugar silencioso para trabajar con tu laptop o leer con luz natural."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Kao Board Game Café",
    "lat": -0.1820,
    "lng": -78.4835,
    "categoria": "HASTA $10 USD",
    "zona": "NORTE",
    "tipo": "Plan Jóvenes 7 / Juegos de Mesa",
    "sticker": "🎲",
    "info": "Acceso a la ludoteca + consumo promedio: $6.00 a $10.00 USD.",
    "descripcion": "Cafetería temática con una enorme colección de más de 300 juegos de mesa modernos. Hay explicadores que te enseñan a jugar las dinámicas que elijas mientras cenas o tomas café.",
    "actividades": ["Jugar juegos de estrategia, rol o fiesta con amigos", "Probar hamburguesas, malteadas y milkshakes"],
    "recomendacion": "Perfecto para grupos de 4 o más amigos. Ve durante la tarde noche."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Bottega de Arte & Café Centro Histórico",
    "lat": -0.2225,
    "lng": -78.5135,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Plan Jóvenes 8 / Café & Arte Colonial",
    "sticker": "☕",
    "info": "Café y postres desde $3.00 USD.",
    "descripcion": "Cafetería ubicada dentro de una casa colonial restaurada en el Centro Histórico. Es tendencia en TikTok gracias a sus balcones con vista a los tejados antiguos y sus talleres esporádicos de dibujo.",
    "actividades": ["Pintar acuarelas en la terraza con vista al centro", "Tomar fotos aesthetic en sus patios coloniales", "Probar café de origen ecuatoriano"],
    "recomendacion": "Pide una mesa en los balcones superiores para la mejor vista fotográfica."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Isvelio Jardín Bar (Noche Temática & Cócteles)",
    "lat": -0.2015,
    "lng": -78.4885,
    "categoria": "HASTA $15 USD",
    "zona": "NORTE (La Mariscal)",
    "tipo": "Plan Jóvenes 9 / Jardín Coctelería",
    "sticker": "🍹",
    "info": "Cócteles y entradas desde $6.00 USD.",
    "descripcion": "Un jardín secreto en medio de la ciudad iluminado con guirnaldas de luces. Popular entre jóvenes por sus noches temáticas, música indie, ambiente relajado y cócteles de autor.",
    "actividades": ["Tomar cócteles artesanales en mesas de jardín", "Escuchar DJs locales o bandas acústicas", "Tomar fotos en sus rincones iluminados"],
    "recomendacion": "El ambiente se pone mejor a partir de las 19:00 de jueves a sábado."
  },
  {
    "etiqueta": "PLANES DESTACADOS PARA JÓVENES",
    "nombre": "Naya Café Matcha & Specialty",
    "lat": -0.1765,
    "lng": -78.4790,
    "categoria": "HASTA $10 USD",
    "zona": "NORTE",
    "tipo": "Plan Jóvenes 10 / Matcha & Brunch Aesthetic",
    "sticker": "🍵",
    "info": "Bebidas y brunch desde $4.00 a $9.00 USD.",
    "descripcion": "Cafetería especializada en bebidas a base de matcha de grado ceremonial y café de especialidad. Su decoración minimalista en tonos neutros la convierte en uno de los puntos más grabados por creadores de contenido.",
    "actividades": ["Probar variaciones gourmet de Matcha Latte", "Disfrutar de tostadas de aguacate o repostería japonesa", "Grabar contenido aesthetic para redes"],
    "recomendacion": "Prueba sus bebidas de temporada y sus postres de matcha o taro."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo de la Ciudad",
    "lat": -0.2251,
    "lng": -78.5152,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Museo 1 / Historia",
    "sticker": "📜",
    "info": "Adultos: $4.00, Estudiantes: $2.00, Niños y Tercera edad: $2.00.",
    "descripcion": "Ubicado en el antiguo Hospital San Juan de Dios, ofrece un recorrido interactivo sobre la historia de Quito desde la era precolombina.",
    "actividades": ["Recorrer maquetas de la vida cotidiana en distintas épocas", "Visitar los patios coloniales"],
    "recomendacion": "Un espacio indispensable para entender la evolución sociocultural de Quito."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo Nacional del Ecuador (MUNA)",
    "lat": -0.2115,
    "lng": -78.4983,
    "categoria": "GRATIS",
    "zona": "CENTRO",
    "tipo": "Museo 2 / Historia",
    "sticker": "🏺",
    "info": "Acceso libre para todo público.",
    "descripcion": "Alberga la colección arqueológica, de oro precolombino y de arte colonial/moderno más importante del país dentro de la Casa de la Cultura.",
    "actividades": ["Ver la Sala del Oro precolombino", "Apreciar arte colonial e identidades diversas de Ecuador"],
    "recomendacion": "Llevar identificación para ingresar de forma fluida."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo Casa de Sucre",
    "lat": -0.2230,
    "lng": -78.5132,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Museo 3 / Historia",
    "sticker": "⚔️",
    "info": "Adultos: $1.50, Niños/Estudiantes: $0.50.",
    "descripcion": "Residencia histórica del Mariscal Antonio José de Sucre y su esposa, conservada con mobiliario y objetos militares del siglo XIX.",
    "actividades": ["Observar uniformes y mapas de batallas independentistas", "Visitar habitaciones coloniales conservadas"],
    "recomendacion": "Aprovecha la guía dentro del museo para conocer detalles de la vida de los próceres."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo Alberto Mena Caamaño (Museo de Cera)",
    "lat": -0.2208,
    "lng": -78.5126,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Museo 4 / Cera e Historia",
    "sticker": "🕯️",
    "info": "Adultos: $1.50, Estudiantes: $0.75, Niños: $0.50.",
    "descripcion": "Representa con figuras de cera tamaño real escenas históricas impactantes como la masacre de los patriotas del 2 de agosto de 1810.",
    "actividades": ["Ver la escena en cera basada en la pintura de César Villacrés", "Explorar el Centro Cultural Metropolitano"],
    "recomendacion": "Excelente opción para entender de forma visual las narraciones patrias."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo de Cera e Historia Convento de San Francisco",
    "lat": -0.2218,
    "lng": -78.5158,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Museo 5 / Arte Religioso",
    "sticker": "🧱",
    "info": "Adultos: $3.00, Estudiantes: $1.50.",
    "descripcion": "El complejo religioso más grande de América Latina, con salas de exposición barroca y la emblemática arquitectura franciscana.",
    "actividades": ["Admirar arte religioso colonial", "Subir a la torre del campanario y visitar catacumbas"],
    "recomendacion": "Visita el coro alto para una vista panorámica del interior de la iglesia."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo Yaku Parque del Agua",
    "lat": -0.2255,
    "lng": -78.5195,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Museo 6 / Ciencia e Interactivo",
    "sticker": "💧",
    "info": "Adultos: $4.00, Estudiantes: $2.00, Niños: $2.00.",
    "descripcion": "Museo interactivo ubicado en las laderas del Pichincha enfocado en la física, biología y conservación del agua.",
    "actividades": ["Juegos con pompas de agua gigantes", "Recorrer el sendero ecológico y mirador hacia el Centro Histórico"],
    "recomendacion": "Llevar ropa de cambio para los niños ya que se pueden mojar en las zonas lúdicas."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo Interactivo de Ciencia (MIC)",
    "lat": -0.2415,
    "lng": -78.5130,
    "categoria": "HASTA $10 USD",
    "zona": "SUR",
    "tipo": "Museo 7 / Ciencia",
    "sticker": "🔬",
    "info": "Adultos: $4.00, Estudiantes: $2.00, Niños: $2.00.",
    "descripcion": "Ubicado en la antigua fábrica textil Chimbacalle en el sur, promueve la ciencia y la tecnología a través del juego y experimentos.",
    "actividades": ["Visitar la sala Guaguas para niños pequeños", "Conocer la historia textil e industrial de Quito"],
    "recomendacion": "Ideal para viajes familiares en el sector Sur."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Capilla del Hombre y Museo Guayasamín",
    "lat": -0.1808,
    "lng": -78.4715,
    "categoria": "HASTA $10 USD",
    "zona": "NORTE",
    "tipo": "Museo 8 / Arte",
    "sticker": "🎨",
    "info": "General: $10.00. Estudiantes/Tercera Edad: $5.00.",
    "descripcion": "Espacio diseñado por el artista Oswaldo Guayasamín dedicado a la historia del ser humano en América Latina y su sufrimiento.",
    "actividades": ["Observar murales monumentales", "Visitar la Casa-Museo donde vivió Guayasamín"],
    "recomendacion": "Ubicado en el barrio Bellavista con una excelente vista del norte de la ciudad."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo Etnohistórico del Artesanado Mindalae",
    "lat": -0.2023,
    "lng": -78.4902,
    "categoria": "HASTA $10 USD",
    "zona": "NORTE",
    "tipo": "Museo 9 / Etnografía",
    "sticker": "🪅",
    "info": "Adultos: $3.00, Niños/Tercera edad: $1.50.",
    "descripcion": "Museo de 5 pisos en la zona de La Mariscal dedicado a la exhibición de la rica diversidad artesanal e indígena del Ecuador.",
    "actividades": ["Conocer textiles, cerámica y mitología solar de los pueblos originarios"],
    "recomendacion": "Cerca del sector turístico de La Mariscal."
  },
  {
    "etiqueta": "MUSEOS",
    "nombre": "Museo Numismático del Banco Central",
    "lat": -0.2205,
    "lng": -78.5129,
    "categoria": "HASTA $10 USD",
    "zona": "CENTRO",
    "tipo": "Museo 10 / Historia Monetaria",
    "sticker": "🪙",
    "info": "Adultos: $2.00, Estudiantes/Niños: $1.00.",
    "descripcion": "Exhibe la historia de la moneda en Ecuador desde el trueque precolombino hasta el Sucre y la Dolarización.",
    "actividades": ["Ver las antiguas prensas y acuñadoras de monedas", "Aprender sobre la transición al dólar"],
    "recomendacion": "Ubicado en el antiguo edificio del Banco Central frente a la Compañía de Jesús."
  },
  {
    "etiqueta": "PARQUES",
    "nombre": "Parque La Carolina",
    "lat": -0.1825,
    "lng": -78.4845,
    "categoria": "GRATIS",
    "zona": "NORTE",
    "tipo": "Parque 1 / Recreativo",
    "sticker": "🌳",
    "info": "Acceso libre para todo público.",
    "descripcion": "El parque urbano más activo en el corazón financiero de Quito, ideal para deporte y paseo familiar.",
    "actividades": ["Pasear en barca por la laguna", "Hacer skate o atletismo", "Visitar el Jardín Botánico (de pago)"],
    "recomendacion": "Cerca de centros comerciales y la línea del Metro de Quito."
  },
  {
    "etiqueta": "PARQUES",
    "nombre": "Parque Metropolitano Guanguiltagua",
    "lat": -0.1712,
    "lng": -78.4610,
    "categoria": "GRATIS",
    "zona": "NORTE",
    "tipo": "Parque 2 / Naturaleza",
    "sticker": "🌲",
    "info": "Acceso libre para todo público.",
    "descripcion": "Con 557 hectáreas, es uno de los parques urbanos más grandes de Sudamérica, rodeado de bosques de eucalipto.",
    "actividades": ["Ciclismo de montaña", "Pícnic en zonas con parrillas", "Miradores hacia los valles orientales de Quito"],
    "recomendacion": "Llevar protector solar y calzado adecuado para caminata silvestre."
  }
];

window.onload = function() {
  iniciarTerminal();
};

function iniciarTerminal() {
  const lineas = [
    "[OK] Carga de módulos principales completada.",
    "[OK] Escaneando nodos culturales de Quito...",
    "[OK] Conectando servicio de navegación en tiempo real...",
    "[READY] Red CyberQuito en línea."
  ];
  const terminal = document.getElementById('hackerTerminal');
  let lineIndex = 0;
  let charIndex = 0;

  function escribir() {
    if (lineIndex < lineas.length) {
      if (charIndex < lineas[lineIndex].length) {
        terminal.innerHTML += lineas[lineIndex].charAt(charIndex);
        charIndex++;
        setTimeout(escribir, 15);
      } else {
        terminal.innerHTML += '\n';
        lineIndex++;
        charIndex = 0;
        setTimeout(escribir, 150);
      }
    } else {
      setTimeout(mostrarSeleccionPersonaje, 400);
    }
  }
  escribir();
}

function mostrarSeleccionPersonaje() {
  const hackerIntro = document.getElementById('hackerIntro');
  hackerIntro.classList.add('fade-out');
  setTimeout(() => {
    hackerIntro.style.display = 'none';
    document.getElementById('characterSelectionModal').classList.remove('hidden');
  }, 500);
}

function seleccionarPersonaje(nombre, videoSrc) {
  personajeActual = {
    nombre: nombre.toUpperCase(),
    video: videoSrc
  };

  document.getElementById('characterSelectionModal').classList.add('hidden');
  
  const galloVideo = document.getElementById('galloVideo');
  galloVideo.src = videoSrc;
  galloVideo.play().catch(e => console.log('Autoplay prevenido:', e));

  document.getElementById('galloSpeech').innerText = `💬 ¡HOLA, SOY ${personajeActual.nombre}! VAMOS A EXPLORAR QUITO JUNTOS.`;

  cargarMapaScript();
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
    console.warn("No se pudo cargar la API de Google Maps con la clave por defecto.");
    iniciarRadar();
  };
  document.head.appendChild(script);
}

function initMap() {
  const quitoCenter = { lat: -0.2000, lng: -78.4900 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: quitoCenter,
    disableDefaultUI: true,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#1a0b2e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1a0b2e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#00f0ff" }] },
      { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#ff007f" }] },
      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#00f0ff" }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0d2818" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#2d0a4e" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#ff007f" }] },
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#002b36" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#00f0ff" }] }
    ]
  });

  infoWindow = new google.maps.InfoWindow();

  renderizarMarcadores(lugaresPuntos);
  iniciarRadar();
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
    <div style="font-family:'Press Start 2P', monospace; font-size:9px; color:#ffffff;">
      <div style="color:#00f0ff; font-weight:bold; margin-bottom:6px;">${lugar.sticker} ${lugar.nombre}</div>
      <div style="color:#ff007f; margin-bottom:6px;">🪙 PRECIO: ${lugar.categoria} | 📍 ZONA: ${lugar.zona}</div>
      <p style="margin:4px 0;">${lugar.descripcion}</p>
      <div style="color:#ffea00; margin-top:6px;">💡 ${lugar.recomendacion}</div>
    </div>
  `;

  infoWindow.setContent(contenidoIW);
  infoWindow.open(map, marker);

  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: ¡${lugar.nombre}! ${lugar.info}`;
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
  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: MOSTRANDO ${filtrados.length} LUGARES PARA '${categoria}'.`;
}

function vistaAmplia() {
  if (map) {
    map.setZoom(10);
    map.setCenter({ lat: -0.2000, lng: -78.4900 });
  }
}

function vistaQuito() {
  if (map) {
    map.setZoom(13);
    map.setCenter({ lat: -0.2200, lng: -78.5120 });
  }
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
  document.getElementById('galloSpeech').innerText = `${personajeActual.nombre}: SELECCIONA UN PUNTO EN EL MAPA PARA RECORRER.`;
}

function iniciarRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let angle = 0;

  function draw() {
    ctx.fillStyle = 'rgba(26, 11, 46, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 2;

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 2;
    ctx.stroke();

    angle += 0.05;
    requestAnimationFrame(draw);
  }
  draw();
}