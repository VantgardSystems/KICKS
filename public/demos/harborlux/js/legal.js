/* =====================================================================
   PÁGINAS LEGALES — aviso de privacidad y términos y condiciones.
   El texto se arma con los datos de data.js (marca, contacto, legal).
   Es una base sólida para México; el cliente debe revisarla con su abogado.
   ===================================================================== */
(function (HL) {
  'use strict';

  const SITE = window.SITE;
  const M = SITE.marca;
  const C = SITE.contacto;
  const L = SITE.legal || {};
  const e = HL.esc;

  const fecha = (() => {
    if (!L.actualizado) return '';
    const [y, m, d] = L.actualizado.split('-').map(Number);
    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
  })();

  const DOCS = {
    privacidad: {
      titulo: 'Aviso de privacidad',
      intro: e(L.razonSocial) + ' (en adelante, “' + e(M.nombre) + '”) es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su normativa aplicable.',
      secciones: [
        ['Identidad y domicilio del responsable',
          '<p>' + e(L.razonSocial) + ', con RFC ' + e(L.rfc) + ' y domicilio en ' + e(C.direccion) + '. Contacto para temas de privacidad: <a href="mailto:' + e(L.correoPrivacidad) + '">' + e(L.correoPrivacidad) + '</a>.</p>'],
        ['Datos personales que recabamos',
          '<p>Solo los que tú nos proporcionas en los formularios del sitio o en la conversación posterior:</p><ul>' +
          '<li>Identificación y contacto: nombre, teléfono y correo electrónico.</li>' +
          '<li>Datos de tu búsqueda o visita: propiedad de interés, fecha, horario y modalidad (presencial o videollamada).</li>' +
          '<li>Datos del inmueble que quieres vender o rentar: tipo, ubicación aproximada y superficie.</li>' +
          '<li>Datos de tu simulación de crédito, si decides compartirlos para una precalificación.</li></ul>' +
          '<p>No recabamos datos personales sensibles. No solicitamos datos financieros ni patrimoniales por este sitio; si un trámite los requiere, te los pediremos por un medio seguro y con tu consentimiento expreso.</p>'],
        ['Finalidades',
          '<p><strong>Primarias</strong> (necesarias para atender tu solicitud):</p><ul>' +
          '<li>Agendar, confirmar y dar seguimiento a visitas presenciales o por videollamada.</li>' +
          '<li>Enviarte información de las propiedades por las que preguntas.</li>' +
          '<li>Elaborar la opinión de valor o la propuesta de comercialización que solicitas.</li>' +
          '<li>Canalizar tu precalificación hipotecaria con las instituciones que elijas.</li></ul>' +
          '<p><strong>Secundarias</strong> (puedes negarte sin que afecte el servicio): enviarte novedades de inventario y encuestas de calidad. Para oponerte, escríbenos a ' + e(L.correoPrivacidad) + '.</p>'],
        ['Cómo nos llegan tus datos',
          '<p>Los formularios del sitio no guardan tu información en nuestros servidores: al enviarlos se abre WhatsApp o tu programa de correo con el mensaje listo, y tú decides si lo mandas. A partir de ese momento la conversación también está sujeta a las políticas de privacidad de WhatsApp (Meta) o de tu proveedor de correo.</p>'],
        ['Transferencias',
          '<p>Podemos compartir tus datos, solo para las finalidades primarias, con: notarías públicas, instituciones financieras o de vivienda (cuando solicitas una precalificación) y peritos valuadores. No vendemos ni rentamos tus datos. Cualquier otra transferencia que requiera tu consentimiento te la pediremos de forma expresa.</p>'],
        ['Derechos ARCO y revocación del consentimiento',
          '<p>Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su tratamiento (derechos ARCO), así como revocar tu consentimiento o limitar su uso. Envía tu solicitud a <a href="mailto:' + e(L.correoPrivacidad) + '">' + e(L.correoPrivacidad) + '</a> con:</p><ul>' +
          '<li>Tu nombre y un medio para responderte.</li><li>Una copia de tu identificación oficial (o la de tu representante y el documento que lo acredite).</li>' +
          '<li>La descripción clara del derecho que quieres ejercer y de los datos involucrados.</li></ul>' +
          '<p>Te responderemos en un máximo de 20 días hábiles y, si procede, haremos efectiva tu solicitud dentro de los 15 días hábiles siguientes.</p>'],
        ['Almacenamiento en tu navegador y servicios de terceros',
          '<p>El sitio no usa cookies publicitarias ni de rastreo. Guarda en el almacenamiento local de tu navegador (<em>localStorage</em>) tu moneda preferida, las propiedades que guardas para comparar y, si llenaste un formulario, tu nombre y teléfono para no pedírtelos de nuevo. Esa información no sale de tu dispositivo y puedes borrarla desde la configuración de tu navegador.</p>' +
          '<p>Para mostrar el sitio se cargan servicios de terceros que reciben tu dirección IP como parte técnica de la conexión: la tipografía (Google Fonts), los mapas (OpenStreetMap), los videos e imágenes del portal (red de distribución de contenidos) y, si existe, el recorrido virtual 360°.</p>'],
        ['Cambios a este aviso',
          '<p>Publicaremos cualquier cambio en esta misma página e indicaremos la fecha de la última actualización.</p>']
      ]
    },
    terminos: {
      titulo: 'Términos y condiciones',
      intro: 'Al usar este sitio aceptas estos términos. Si no estás de acuerdo con ellos, te pedimos no utilizarlo.',
      secciones: [
        ['Quiénes somos',
          '<p>' + e(M.nombre) + ' es una marca de ' + e(L.razonSocial) + ', con domicilio en ' + e(C.direccion) + '. Contacto: <a href="mailto:' + e(C.email) + '">' + e(C.email) + '</a> · ' + e(C.telefono) + '.</p>'],
        ['Información de las propiedades',
          '<p>Las fichas son informativas y no constituyen una oferta vinculante. Precios, superficies, amenidades, disponibilidad y condiciones pueden cambiar sin previo aviso y se confirman por escrito con tu asesor antes de cualquier operación.</p>' +
          '<p>Las conversiones a dólares son aproximadas, con el tipo de cambio de referencia indicado en el sitio. La plusvalía mostrada es una estimación histórica de la zona y no garantiza rendimientos futuros.</p>'],
        ['Imágenes, planos y recorridos',
          '<p>Las fotografías, renders, planos y recorridos virtuales son ilustrativos. Algunas imágenes pueden ser representaciones digitales o generadas por computadora; los planos muestran medidas aproximadas. Las condiciones físicas del inmueble se verifican en la visita.</p>'],
        ['Calculadora hipotecaria',
          '<p>Los resultados de la calculadora son una simulación con tasa fija y no representan una oferta de crédito. No incluyen seguros, comisiones, avalúo ni otros cargos. La aprobación, la tasa y el monto dependen de cada institución financiera y de tu perfil.</p>'],
        ['Agenda de visitas y comunicación',
          '<p>Agendar una visita por el sitio genera una solicitud que tu asesor confirmará; no es una reservación garantizada. Al enviar un formulario aceptas que te contactemos por WhatsApp, llamada o correo para darle seguimiento, conforme a nuestro <a href="' + e(C.avisoPrivacidad) + '">aviso de privacidad</a>.</p>'],
        ['Propiedad intelectual',
          '<p>La marca, el diseño, los textos, las imágenes y el código del sitio pertenecen a ' + e(L.razonSocial) + ' o a sus licenciantes. No se permite copiarlos ni reproducirlos con fines comerciales sin autorización por escrito.</p>'],
        ['Enlaces y servicios de terceros',
          '<p>El sitio enlaza o integra servicios de terceros (WhatsApp, mapas, visores 360°). No somos responsables de su contenido, disponibilidad ni políticas.</p>'],
        ['Responsabilidad',
          '<p>Procuramos que la información sea exacta y esté actualizada, pero no garantizamos que el sitio esté libre de errores o interrupciones. ' + e(M.nombre) + ' no será responsable por decisiones tomadas únicamente con base en la información del sitio sin la confirmación de un asesor.</p>'],
        ['Ley aplicable y jurisdicción',
          '<p>Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a los tribunales competentes de ' + e(L.jurisdiccion) + ', renunciando a cualquier otro fuero que pudiera corresponderles.</p>']
      ]
    }
  };

  function render() {
    const key = document.body.dataset.doc === 'terminos' ? 'terminos' : 'privacidad';
    const doc = DOCS[key];
    const other = key === 'terminos' ? ['Aviso de privacidad', C.avisoPrivacidad] : ['Términos y condiciones', C.terminos];
    document.title = doc.titulo + ' · ' + M.nombre;

    HL.$('#legal-head').innerHTML =
      '<a class="brand" href="index.html">' + e(M.logoTexto) + '</a>' +
      '<a class="btn btn--ghost btn--sm" href="index.html">' + HL.icon('left') + 'Volver al sitio</a>';

    HL.$('#legal').innerHTML =
      '<p class="eyebrow">' + e(M.nombre) + '</p>' +
      '<h1 class="h2">' + doc.titulo + '</h1>' +
      (fecha ? '<p class="subtle">Última actualización: ' + fecha + '</p>' : '') +
      (L.borrador ? '<p class="legal__draft">' + HL.icon('info') + '<span>Documento base pendiente de revisión legal. Antes de publicar, el cliente debe validarlo con su abogado y completar sus datos.</span></p>' : '') +
      '<p class="lead">' + doc.intro + '</p>' +
      '<nav class="legal__toc" aria-label="Contenido"><ol>' + doc.secciones.map((s, i) => '<li><a href="#s' + (i + 1) + '">' + s[0] + '</a></li>').join('') + '</ol></nav>' +
      doc.secciones.map((s, i) => '<section id="s' + (i + 1) + '"><h2>' + (i + 1) + '. ' + s[0] + '</h2>' + s[1] + '</section>').join('') +
      '<p class="legal__other">Consulta también: <a class="link-arrow" href="' + e(other[1]) + '">' + other[0] + HL.icon('arrow') + '</a></p>';

    HL.$('#legal-foot').innerHTML = '<div class="container footer__legal" style="margin-top:0;border-top:0">' +
      '<span>© ' + new Date().getFullYear() + ' ' + e(M.nombre) + ' · ' + e(L.razonSocial) + '</span>' +
      '<span><a href="' + e(C.avisoPrivacidad) + '">Aviso de privacidad</a> · <a href="' + e(C.terminos) + '">Términos y condiciones</a></span></div>';
  }

  render();
})(window.HL = window.HL || {});
