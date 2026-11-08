# Ecowatt: plan de diseño

## Paleta (sale del logo de Ecowatt)

| Nombre | Hex | Uso |
|---|---|---|
| Azul Ecowatt | `#29319E` | El "watt" del logo. Títulos, enlaces, contornos y foco de teclado. |
| Azul celda | `#1B2170` | El azul profundo de un panel. Solo en la banda de la calculadora y en las siluetas de azoteas. |
| Tinta | `#12173F` | Texto principal y pie de página. Sustituye al negro. |
| Verde eco | `#30B800` | El "eco" del logo. Reservado para acciones: botones de WhatsApp y el sello de ahorro. Siempre con texto en Tinta (6.5:1). |
| Naranja flama | `#FC7014` | La flama del logo: el sol y la energía. Solo en detalles (la barra de consumo del recibo, el deslizador, la línea que tacha el recibo de antes). Nunca como color de texto sobre blanco. |
| Cielo de mediodía | `#EEF2FA` | Fondo de las secciones alternas. Un blanco azulado, como el cielo del Bajío a las 12, no crema. |

Tonos de apoyo para cumplir AA: `#4A5078` (texto secundario, 7.7:1), `#1F7A00` (verde del sello sobre papel, 5.5:1), `#B3261E` (errores).

## Tipografía

Una sola familia, **Archivo**, usada en dos anchos a propósito:

- **Archivo expandido (wdth 106 a 125), pesos 700 a 800.** Para titulares y cifras. Las letras anchas recuerdan las placas metálicas de los inversores y los rótulos de bodega. En los números del recibo usa cifras tabulares, para que los dígitos no bailen mientras bajan.
- **Archivo normal (wdth 100), pesos 400 y 700.** Para el texto, los botones y los formularios. Es una grotesca sobria con números claros, sin ceros tachados, para montos y teléfonos.
- Escala de tercera mayor (1.25): 17 px para el texto, 22, 28, 35 y 44 px en adelante para los títulos. La línea de texto mide 65 caracteres como máximo.
- Usar una sola familia también ahorra una descarga de fuentes y acelera la carga en celular.

> Revisión: la primera versión usaba Atkinson Hyperlegible para el texto. En pantalla, su cero tachado hacía que "$3,500" y "(477) 299 2060" se vieran como código. La cambiamos por Archivo en ancho normal.

## Wireframes

### Hero (móvil primero)

```
┌──────────────────────────────────┐
│ [logo ecowatt]              [☰]  │ menú fijo
├──────────────────────────────────┤
│ Paga el mínimo de luz            │ H1, Archivo ancho
│ con paneles solares              │
│ en León                          │
│                                  │
│ Diseñamos, instalamos y          │ subtítulo
│ monitoreamos sistemas solares    │
│ para casas y negocios en León    │
│ y el Bajío.                      │
│                                  │
│ [ (wa) Cotiza gratis por WhatsApp ] verde, ancho completo
│ [      Calcula tu ahorro         ]  contorno azul
│ ──────────────────────────────── │
│ [4.9] de 5       │ [000]         │ franja de confianza 2×2
│ en Google        │ instalados    │
│ Más de 40        │ 24/7          │
│ años en electr.  │ monitoreo     │
│                                  │
│ ▂▂▆▆▂▂▄▄▂▂▆▆ ◢◢◢ ▂▂▄▄▂▂ (azoteas)│ silueta de techos de León,
└──────────────────────────────────┘ tinacos y paneles a 21°

Escritorio: texto a la izquierda (7/12), foto real a la derecha (5/12).
La franja de confianza pasa a una fila de 4 y la silueta abarca todo el ancho.
```

### Calculadora

```
┌──────────────────────────────────┐ fondo azul celda
│ Calcula cuánto bajaría tu recibo │
│                                  │
│ ¿Para dónde son los paneles?     │
│ [   Casa   ][  Negocio  ]        │
│ ¿Cuánto pagas de luz al bimestre?│
│ [ $  3,500                    ]  │
│ ●━━━━━━○──────────────────────   │ deslizador (perilla naranja)
│ ¿En qué ciudad?                  │
│ [ León                       ▾]  │
│                                  │
│  ┌ Tu recibo de luz   Bimestral ┐│ papel blanco,
│  │ Casa en León                 ││ sombra corta de mediodía
│  │ Sin paneles        $3,500    ││ queda tachado
│  │ Total a pagar con paneles    ││
│  │ $150                         ││ cifra que baja de antes a después
│  │ ▓▓░░░░░░░░░░░░░░░░░░░░░░░░   ││ la barra se encoge
│  │ [Ahorras $3,350 al bimestre] ││ sello verde
│  │ ||| || |||| | ||| ||  |||    ││
│  └╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱┘│ borde dentado de ticket
│ Paneles: 8  │ Ahorro al bimestre │ cifras en tabla 2×2
│ Al año      │ Recuperas en 4 a 5 │
│ Es un estimado. Tu cotización    │
│ exacta la hacemos con tu recibo. │
│ [ (wa) Cotiza este cálculo por WhatsApp ]
└──────────────────────────────────┘

Escritorio: los controles a la izquierda (5/12) y el recibo con las cifras a la derecha (6/12).
```

## Tres principios

1. **El recibo es el protagonista.** Toda la página habla como el recibo de CFE: bimestre, total a pagar, pesos. El único momento animado es el recibo que baja de lo que pagas hoy a lo que pagarías. Todo lo demás se queda quieto.
2. **Luz de mediodía.** Contraste alto, fondos limpios, sin degradados, brillos ni vidrio. La única sombra con carácter es la del recibo: corta y nítida, como la que deja el sol del Bajío a las 12. Cada color del logo tiene un solo trabajo: azul para estructura, verde para actuar y naranja para la energía.
3. **Techos de León, no fotos de catálogo.** El hero termina en una silueta de azoteas con tinacos, tanques de gas y paneles inclinados a 21°, la latitud de León. Cada foto pendiente describe una escena real de Ecowatt. Los datos que faltan se ven como placeholders marcados, no como promesas inventadas.

## Revisión del plan: qué se cambió porque sonaba a "cualquier empresa solar"

| Primera idea | Por qué era genérica | Cambio |
|---|---|---|
| Hero con foto de paneles y cielo azul a todo lo ancho, con un degradado encima | Es el hero de casi todas las solares de México | Titular sobre el recibo, fondo blanco y silueta de azoteas mexicanas (tinacos y tanques de gas) que da paso a la calculadora |
| Paleta de "energía verde": verde hoja, amarillo sol y azul cielo en degradado | Es el código de color de toda la industria | Solo los tres colores del logo, cada uno con un rol estricto. El naranja nunca decora |
| Ícono de sol o rayos de luz junto al titular | Cliché solar | Eliminado. El sol solo aparece como la perilla naranja del deslizador |
| Montserrat o Poppins | Son las fuentes de la mayoría de las solares mexicanas | Una sola familia, Archivo, en dos anchos: expandida con carácter de placa técnica para títulos y normal para leer |
| Resultados de la calculadora en 4 tarjetas con íconos | Es el kit de tarjetas de SaaS | Los resultados se muestran en un recibo que la gente reconoce, más una tabla sobria de 2×2 |
| Contadores animados del tipo "+500 clientes" en el hero | Los números serían inventados y la animación es de plantilla | Franja de confianza estática con placeholders marcados |
| Hojitas, planeta y "energía limpia para el futuro" | Frases vacías | Copy centrado en el bolsillo: recibo, DAC, ahorro y recuperación |
| Botón flotante de WhatsApp y burbuja de chat también en móvil | Se enciman con la barra inferior | En móvil, la barra inferior asume WhatsApp y la burbuja del chat se coloca encima de ella |

## Cambio posterior: hero de día y noche

A pedido del cliente, el hero pasó a ser una escena a pantalla completa. Una casa con paneles se hunde en una niebla generada con WebGL; mientras está escondida cambia de día a noche y vuelve a subir con la otra luz. La técnica se tomó de la referencia "Lumen Roof", adaptada a Ecowatt:

- **Mensaje:** el interruptor explica la medición neta. "De día: tus paneles producen" y "De noche: usas lo que produjiste". El efecto no es solo decoración: cuenta cómo funciona el medidor bidireccional.
- **Inicio:** la página arranca de día, por la luz del Bajío al mediodía. La referencia arrancaba de noche.
- **Titular de un solo color:** la referencia pinta parte del titular en otro tono, y el brief de Ecowatt lo prohíbe.
- **Identidad:** se conservan Archivo, la paleta y el logo, que cambia al logo inverso de noche.
- **Dos momentos llamativos:** ahora hay dos, el hero y el recibo de la calculadora. El resto de la página sigue tranquilo.
- **Cabecera:** es transparente sobre el hero y blanca al bajar.

## Versión 2: rediseño a pedido del cliente

El cliente pidió una interfaz distinta, con más color y animación, y que la página se viera mejor en celular.

- **Paleta azul, verde y amarillo:** azul marino `#0B1D5C`, azul `#1F4FD8`, verde `#22C55E` / `#16A34A` y amarillo `#FFC727`, cada uno con sus tonos claros para fondos.
- **Tipografía:** Sora para los títulos (geométrica, con presencia) y Figtree para el texto (clara y amable).
- **Cinco estilos de botón:**
  - WhatsApp: verde, con el ícono en un círculo blanco y un brillo al pasar.
  - Sol: amarillo, para la calculadora y las acciones destacadas.
  - Contorno: secundario.
  - Vidrio: sobre el hero.
  - Enlace con flecha.
- **Un fondo distinto por sección:**
  - Amarillo: DAC.
  - Azul claro: pasos y nosotros.
  - Azul marino: calculadora y proyectos.
  - Verde claro: opiniones.
  - Amarillo claro: pagos.
  - Degradado azul y verde: formulario.
- **Íconos propios** en trazo de 2 px, tarjetas con sombras suaves y una franja de confianza que flota sobre el hero.
- **Animación:** aparición suave al hacer scroll (300 ms, solo `transform` y `opacity`) y barras que crecen en la gráfica de la DAC. Todo respeta "reducir movimiento".
- **Hero en celular:** la casa va en una banda abajo y el interruptor queda encima de ella, así la animación se ve completa. La niebla de reposo es más baja en celular.
- **Sin JavaScript** (por ejemplo, si un visor lo bloquea), el día y la noche se alternan solos, con los textos ajustados.
- **Imágenes:** generadas con IA (ver `docs/imagenes-ia.md`).
