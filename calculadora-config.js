/* =====================================================================
   Solenna · Calculadora de ahorro — AJUSTES EDITABLES
   Cambia aquí precios, supuestos y la oferta sin tocar el resto del código.
   Todas las cifras son ORIENTATIVAS (España, vivienda unifamiliar).
   ===================================================================== */
(function () {
  window.__SOLENNA_CALC__ = {
    version: "20261026",

    // Web principal: el botón "Pedir estudio gratis" lleva a mainUrl + contactHash
    mainUrl: "index.html",
    contactHash: "#contacto",

    // Oferta de la semana (debe ser una promoción REAL de la empresa)
    oferta: {
      activa: true,
      descuentoEur: 300,          // "Si contratas esta semana, descuento de X €"
      plazasSemana: 6             // instalaciones disponibles esta semana (texto de escasez)
    },

    // Supuestos del cálculo (ver PLAN-TECNICO.md)
    supuestos: {
      precioKwhDefecto: 0.18,     // €/kWh efectivo con impuestos si la factura no lo da
      fijoMensualDefecto: 18,     // €/mes de término de potencia + alquiler contador, con impuestos
      factorImpuestos: 1.27,      // impuesto eléctrico (5,11 %) + IVA (21 %) aprox.
      m2PorKwp: 5.5,              // m² de tejado por kWp instalado
      wpPanel: 450,               // potencia de cada placa (W)
      maxKwp: 15,                 // tope residencial
      minPlacas: 4,
      autoconsumo: 0.45,          // % de la producción que se consume al momento (sin batería)
      maxAutoconsumoSobreConsumo: 0.7,
      precioCompensacion: 0.06,   // €/kWh que se descuenta por excedentes (compensación simplificada)
      costeBaseEur: 1000,         // inversor, legalización y tramitación (IVA incl.)
      costeKwpEur: 1150,          // € por kWp instalado (IVA incl.)
      subidaLuzAnual: 0.02,       // subida anual del precio de la luz
      degradacionAnual: 0.005,    // pérdida anual de rendimiento de las placas
      anos: 25,
      co2KgPorKwh: 0.12,          // emisiones evitadas por kWh (mix eléctrico español aprox.)
      financiacionTin: 0.069,     // interés anual de la financiación de referencia
      financiacionMeses: 120,
      areaMinimaM2: 10            // m² mínimos para continuar
    }
  };
})();
