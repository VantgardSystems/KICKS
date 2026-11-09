/* =====================================================================
   Solenna · Calculadora de ahorro — MOTOR DE CÁLCULO (determinista, sin IA)
   Funciones puras: mismas entradas → mismos resultados. Expuesto como
   window.SolennaCalc. Fórmulas y supuestos explicados en PLAN-TECNICO.md.
   ===================================================================== */
(function () {
  "use strict";

  // Producción orientativa (kWh por kWp al año, placas a 30° orientadas al sur)
  // y coordenadas de la capital. Respaldo cuando PVGIS no responde.
  var PROVINCIAS = [
    ["A Coruña", 43.362, -8.411, 1150, ["coruna", "a coruna", "la coruna"]],
    ["Álava", 42.846, -2.672, 1200, ["alava", "araba"]],
    ["Albacete", 38.994, -1.858, 1600],
    ["Alicante", 38.345, -0.481, 1600, ["alicante", "alacant"]],
    ["Almería", 36.834, -2.464, 1650],
    ["Asturias", 43.361, -5.849, 1100, ["asturias", "oviedo"]],
    ["Ávila", 40.656, -4.681, 1550],
    ["Badajoz", 38.879, -6.970, 1650],
    ["Barcelona", 41.385, 2.173, 1450],
    ["Bizkaia", 43.263, -2.935, 1100, ["bizkaia", "vizcaya", "bilbao"]],
    ["Burgos", 42.344, -3.697, 1400],
    ["Cáceres", 39.475, -6.372, 1650],
    ["Cádiz", 36.527, -6.288, 1700],
    ["Cantabria", 43.462, -3.810, 1150, ["cantabria", "santander"]],
    ["Castellón", 39.986, -0.051, 1550, ["castellon", "castello"]],
    ["Ceuta", 35.889, -5.321, 1650],
    ["Ciudad Real", 38.986, -3.927, 1650],
    ["Córdoba", 37.888, -4.779, 1700],
    ["Cuenca", 40.070, -2.137, 1550],
    ["Gipuzkoa", 43.318, -1.981, 1100, ["gipuzkoa", "guipuzcoa", "donostia", "san sebastian"]],
    ["Girona", 41.979, 2.821, 1450, ["girona", "gerona"]],
    ["Granada", 37.177, -3.599, 1700],
    ["Guadalajara", 40.633, -3.166, 1550],
    ["Huelva", 37.261, -6.945, 1700],
    ["Huesca", 42.136, -0.409, 1500],
    ["Illes Balears", 39.570, 2.650, 1550, ["balears", "baleares", "mallorca", "menorca", "ibiza", "eivissa"]],
    ["Jaén", 37.779, -3.785, 1650],
    ["La Rioja", 42.462, -2.445, 1400, ["rioja", "logrono"]],
    ["Las Palmas", 28.124, -15.430, 1750, ["las palmas", "gran canaria", "lanzarote", "fuerteventura"]],
    ["León", 42.599, -5.567, 1450],
    ["Lleida", 41.617, 0.620, 1500, ["lleida", "lerida"]],
    ["Lugo", 43.012, -7.556, 1200],
    ["Madrid", 40.417, -3.704, 1600],
    ["Málaga", 36.721, -4.421, 1700],
    ["Melilla", 35.292, -2.938, 1700],
    ["Murcia", 37.992, -1.131, 1700],
    ["Navarra", 42.812, -1.645, 1350, ["navarra", "nafarroa", "pamplona"]],
    ["Ourense", 42.336, -7.864, 1350, ["ourense", "orense"]],
    ["Palencia", 42.010, -4.533, 1450],
    ["Pontevedra", 42.431, -8.644, 1300, ["pontevedra", "vigo"]],
    ["Salamanca", 40.970, -5.663, 1550],
    ["Santa Cruz de Tenerife", 28.464, -16.251, 1700, ["tenerife", "santa cruz de tenerife", "la palma", "la gomera", "el hierro"]],
    ["Segovia", 40.948, -4.118, 1550],
    ["Sevilla", 37.389, -5.984, 1700],
    ["Soria", 41.764, -2.465, 1500],
    ["Tarragona", 41.119, 1.245, 1500],
    ["Teruel", 40.344, -1.106, 1550],
    ["Toledo", 39.863, -4.027, 1650],
    ["Valencia", 39.470, -0.376, 1550, ["valencia"]],
    ["Valladolid", 41.652, -4.724, 1500],
    ["Zamora", 41.503, -5.745, 1500],
    ["Zaragoza", 41.649, -0.889, 1500]
  ].map(function (p) {
    return { nombre: p[0], lat: p[1], lon: p[2], rendimiento: p[3], alias: p[4] || [normaliza(p[0])] };
  });

  function normaliza(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }

  function buscaProvincia(texto) {
    var t = normaliza(texto);
    if (!t) return null;
    for (var i = 0; i < PROVINCIAS.length; i++) {
      var p = PROVINCIAS[i];
      for (var j = 0; j < p.alias.length; j++) {
        if (t === p.alias[j] || t.indexOf(p.alias[j]) > -1) return p;
      }
    }
    return null;
  }

  function provinciaMasCercana(lat, lon) {
    var best = null, bestD = Infinity;
    PROVINCIAS.forEach(function (p) {
      var d = Math.pow(p.lat - lat, 2) + Math.pow((p.lon - lon) * Math.cos(lat * Math.PI / 180), 2);
      if (d < bestD) { bestD = d; best = p; }
    });
    return best;
  }

  // Respaldo de producción si PVGIS falla: capital más cercana a las coordenadas
  // (más fiable que el texto, que a veces trae la comunidad autónoma); si no hay, por nombre
  function rendimientoRespaldo(lat, lon, provinciaTexto) {
    var p = (isFinite(lat) && isFinite(lon) && lat !== null && lon !== null) ? provinciaMasCercana(lat, lon) : buscaProvincia(provinciaTexto);
    return p ? { rendimiento: p.rendimiento, fuente: "tabla", provincia: p.nombre } : { rendimiento: 1500, fuente: "media", provincia: null };
  }

  // Área real de un polígono sobre la esfera terrestre (m²), puntos [{lat, lng}]
  function areaGeodesica(puntos) {
    if (!puntos || puntos.length < 3) return 0;
    var R = 6378137, rad = Math.PI / 180, total = 0;
    for (var i = 0; i < puntos.length; i++) {
      var p1 = puntos[i], p2 = puntos[(i + 1) % puntos.length];
      total += (p2.lng - p1.lng) * rad * (2 + Math.sin(p1.lat * rad) + Math.sin(p2.lat * rad));
    }
    return Math.abs(total * R * R / 2);
  }

  // ¿Se cruzan los lados del polígono?
  function seCruza(puntos) {
    var n = puntos.length;
    if (n < 4) return false;
    function cruz(a, b, c) { return (b.lng - a.lng) * (c.lat - a.lat) - (b.lat - a.lat) * (c.lng - a.lng); }
    function corta(a, b, c, d) {
      var d1 = cruz(c, d, a), d2 = cruz(c, d, b), d3 = cruz(a, b, c), d4 = cruz(a, b, d);
      return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
    }
    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue;
        if (corta(puntos[i], puntos[(i + 1) % n], puntos[j], puntos[(j + 1) % n])) return true;
      }
    }
    return false;
  }

  function num(v) { v = Number(v); return isFinite(v) && v > 0 ? v : null; }

  /* Cálculo principal.
     e = { gastoMensual, consumoMensual?, consumoAnual?, precioKwh?, fijoMensual?, areaM2, rendimiento } */
  function calcula(e, S) {
    S = S || (window.__SOLENNA_CALC__ || {}).supuestos;
    var gasto = num(e.gastoMensual);
    var area = num(e.areaM2);
    var rend = num(e.rendimiento) || 1500;
    if (!gasto || !area) return null;

    var precio = num(e.precioKwh) || S.precioKwhDefecto;
    precio = Math.min(Math.max(precio, 0.08), 0.45);
    var fijo = num(e.fijoMensual) || Math.min(S.fijoMensualDefecto, gasto * 0.5);
    fijo = Math.min(fijo, gasto * 0.8);

    var consumoMes = num(e.consumoMensual) || Math.max(50, (gasto - fijo) / precio);
    var consumoAno = num(e.consumoAnual) || consumoMes * 12;
    var facturaAno = gasto * 12;

    // Potencia: limitada por el tejado y por lo que la casa consume
    var kwpTejado = area / S.m2PorKwp;
    var kwpNecesario = consumoAno / rend;
    var placasTejado = Math.floor(kwpTejado * 1000 / S.wpPanel);
    var placas = Math.round(Math.min(kwpTejado, kwpNecesario, S.maxKwp) * 1000 / S.wpPanel);
    if (placasTejado >= S.minPlacas) placas = Math.max(S.minPlacas, placas);
    placas = Math.max(1, Math.min(placas, Math.max(1, placasTejado)));
    var kwp = placas * S.wpPanel / 1000;
    var limitadoPorTejado = kwpTejado < kwpNecesario * 0.6;

    // Energía
    var produccion = kwp * rend;
    var autoconsumo = Math.min(produccion * S.autoconsumo, consumoAno * S.maxAutoconsumoSobreConsumo);
    var excedente = Math.max(0, produccion - autoconsumo);
    var energiaRestanteEur = Math.max(0, consumoAno - autoconsumo) * precio;
    var compensacion = Math.min(excedente * S.precioCompensacion, energiaRestanteEur);

    var ahorroAno = autoconsumo * precio + compensacion;
    ahorroAno = Math.min(ahorroAno, Math.max(0, facturaAno - fijo * 12)); // el término fijo no se ahorra
    var cobertura = facturaAno > 0 ? ahorroAno / facturaAno : 0;

    // Inversión y retorno
    var coste = S.costeBaseEur + kwp * S.costeKwpEur;
    var acumulado = 0, payback = null, serie = [], sinPlacas = 0, conPlacas = coste, co2 = 0;
    for (var y = 1; y <= S.anos; y++) {
      var subida = Math.pow(1 + S.subidaLuzAnual, y - 1);
      var ahorroY = ahorroAno * subida * Math.pow(1 - S.degradacionAnual, y - 1);
      var previo = acumulado;
      acumulado += ahorroY;
      if (payback === null && acumulado >= coste) payback = (y - 1) + (coste - previo) / ahorroY;
      sinPlacas += facturaAno * subida;
      conPlacas += facturaAno * subida - ahorroY;
      co2 += produccion * Math.pow(1 - S.degradacionAnual, y - 1) * S.co2KgPorKwh;
      serie.push({ ano: y, sinPlacas: sinPlacas, conPlacas: conPlacas, ahorroAcumulado: acumulado - coste });
    }

    var r = S.financiacionTin / 12, n = S.financiacionMeses;
    var cuota = r > 0 ? coste * r / (1 - Math.pow(1 + r, -n)) : coste / n;

    return {
      entradas: { gastoMensual: gasto, consumoMensual: consumoMes, consumoAnual: consumoAno, precioKwh: precio, fijoMensual: fijo, areaM2: area, rendimiento: rend },
      kwpTejado: kwpTejado, kwp: kwp, placas: placas, limitadoPorTejado: limitadoPorTejado,
      produccionAnual: produccion, autoconsumo: autoconsumo, excedente: excedente,
      ahorroAnual: ahorroAno, ahorroMensual: ahorroAno / 12,
      facturaAnual: facturaAno, facturaMensualCon: Math.max(0, gasto - ahorroAno / 12),
      cobertura: cobertura,
      coste: coste,
      payback: payback,
      ahorro25Bruto: acumulado, ahorro25Neto: acumulado - coste,
      co2AnualKg: produccion * S.co2KgPorKwh, co2TotalKg: co2,
      cuotaMensual: cuota, coberturaCuota: cuota > 0 ? (ahorroAno / 12) / cuota : 0,
      serie: serie
    };
  }

  window.SolennaCalc = {
    PROVINCIAS: PROVINCIAS,
    buscaProvincia: buscaProvincia,
    provinciaMasCercana: provinciaMasCercana,
    rendimientoRespaldo: rendimientoRespaldo,
    areaGeodesica: areaGeodesica,
    seCruza: seCruza,
    calcula: calcula
  };
})();
