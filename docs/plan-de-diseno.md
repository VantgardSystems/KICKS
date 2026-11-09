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

## Versión 3: sistema de diseño premium (por fases)

### Fase 1: sistema de diseño
- **Paleta oscura** con verdes brillantes, verde claro, azules oscuros y texto blanco. Todos los colores, espacios, radios y sombras son tokens en `:root` de `assets/css/ecowatt.css`.
- **Regla 60-30-10** medida en capturas: 60 % lienzo oscuro, 30 % superficies y texto claro, 10 % acento verde (solo botones, enlaces, foco e íconos clave).
- **Escala de espacios de 8 px** (4 px solo para detalles finos) y ancho máximo de 1200 px.

### Fase 2: tipografía
- **Dos familias de una misma superfamilia** (Google Fonts):
  - Red Hat Display para títulos y cifras: geométrica, seria y con carácter.
  - Red Hat Text para el texto: es la versión de la familia dibujada para leerse en tamaños chicos.
  Adobe Fonts no se usó: el conector necesita autorización y una licencia de Adobe del cliente.
- **Tres grosores en todo el sitio:** 400 para texto, 500 para navegación y etiquetas, 600 para títulos, botones y cifras. Ya no hay 700 ni 800.
- **Escala de tercera menor (×1.2) sobre 16 px**, en tokens `--t-*`:

  | Token | Celular → escritorio | Uso |
  |---|---|---|
  | `--t-meta` | 12 px | avisos legales, chips, ejes de gráfica |
  | `--t-sec` | 14 px | texto de apoyo, ayudas, errores |
  | `--t-cuerpo` | 16 px | párrafos, campos, botones |
  | `--t-h4` | 18 px | títulos de tarjeta chica, preguntas frecuentes |
  | `--t-entrada` | 18 → 20 px | párrafo de entrada de cada sección |
  | `--t-h3` | 20 → 24 px | H3 |
  | `--t-cifra` | 24 → 32 px | cifras y tarjetas grandes |
  | `--t-h2` | 32 → 48 px | H2 |
  | `--t-h1` | 36 → 76 px | título del hero |

  En el hero, el H1 también se limita por la altura de la pantalla: mide 61 px en 1280×800 y 76 px en pantallas grandes.
- **Interlineado:**
  - Baja conforme sube el tamaño: H1 1.1, H2 1.15, H3 1.25.
  - Texto 1.6, apoyo 1.5, meta 1.4.
  - Botones y etiquetas de una línea: 1.2.
  - Ningún interlineado baja de 1.1.
- **Largo de línea:**
  - `--ancho-texto: 33em` deja unos 70 caracteres por línea. Lo más largo que se midió fueron 65 caracteres en la página principal y 72 en el aviso de privacidad.
  - Se mide en `em`, no en `ch`, porque en Red Hat Text la letra media es más angosta que el "0", y 68ch daba 80 caracteres.
- **Ajuste de texto:**
  - Los títulos usan `text-wrap: balance`.
  - Los párrafos usan `text-wrap: pretty`, para no dejar una palabra sola en la última línea.
- **Botones y campos** heredan la fuente de la página (`font: inherit`). Antes algunos caían en Arial.

### Fase 3: hero
- **Composición:**
  - En escritorio, el texto va a la izquierda en una columna de 420 a 560 px. A la derecha va una ventana redondeada con la casa, que llena todo el alto del hero y sale por el borde derecho de la pantalla.
  - En celular el orden es: texto y botones, la ventana con el interruptor, y abajo los datos. El H1 y los dos botones caben en la primera pantalla, y la ventana completa queda arriba de la barra fija.
- **Titular:**
  - Se queda "Paga el mínimo de luz con paneles solares en León", porque habla del ahorro y lleva la ciudad para el SEO local.
  - En escritorio mide `min(--t-h1, ancho de columna / 8.3, 9.5vh)`, así cae en tres líneas parejas: 62 px en 1280 y 67 px en 1440.
- **Subtítulo** de una línea: "Diseñamos, instalamos y monitoreamos tu sistema solar."
- **Botones:**
  - "Cotiza tu sistema gratis": WhatsApp con mensaje prellenado.
  - "Calcula tu ahorro": lleva a la calculadora.
- **Tres datos de confianza:**
  - 40+ años en instalaciones eléctricas (dato real).
  - `[000]` sistemas instalados y `[4.9]` de 5 en Google, marcados EDITAR.
  - Sustituyen a la franja de cuatro tarjetas que había debajo del hero, que los repetía.
- **Animación:**
  - Se conserva la de día y noche con niebla WebGL, ahora dentro de la ventana. La casa, el porche y la niebla se miden contra la ventana, no contra la pantalla.
  - La casa (16:9) se apoya abajo y su ancho es `max(107cqw, 172cqh)`, así el techo queda a un tercio de altura en cualquier proporción.
  - El interruptor va arriba, sobre el cielo, en celular y tableta, y abajo, sobre la niebla, en escritorio.
- **Entrada:** una sola secuencia al cargar, de 400 ms (título, subtítulo, botones, datos y ventana). Se desactiva con "reducir movimiento".
- **Cabecera:**
  - Ahora es sólida y oscura en toda la página, y lleva solo el logo inverso.
  - El botón flotante de WhatsApp y el asistente se esconden mientras el hero está en pantalla, porque tapaban el interruptor. Sin JavaScript siempre se ven.
- **AnimatedWebs no se usó:** su catálogo pide iniciar sesión. El hero se hizo con la guía de `frontend-design`.

### Fase 5: secciones y componentes
- **Orden nuevo**, el que pidió el cliente:
  1. Hero.
  2. Barra de confianza: logos de marcas y certificaciones, marcados EDITAR.
  3. Ventajas.
  4. Cómo funciona.
  5. Calculadora.
  6. Testimonios de ejemplo.
  7. Garantía y formas de pago.
  8. Preguntas frecuentes.
  9. Contacto.
  10. Pie.
  
  Quedan 9 secciones; antes había 13. La página bajó de 23,700 a 12,600 px de alto en celular y mide 7,900 px en escritorio.
- **Nada real se perdió:**
  - Soluciones pasó a tres fotos en Ventajas.
  - La deducción del 100 % y la DAC pasaron a ser ventajas.
  - Los proyectos quedaron como lista de nombres en Opiniones.
  - Las 8 ciudades siguen en Preguntas y en el pie.
  - Salió "Quiénes somos"; ver README.
- **Componentes distintos para no caer en "todo son tarjetas iguales":**
  - Las ventajas van sin caja, con una línea arriba y un ícono suelto del mismo sprite.
  - Cómo funciona es una línea de tiempo numerada (sí es una secuencia): vertical en celular y horizontal en escritorio.
  - Garantía y pagos son dos paneles con filas, como una ficha técnica.
  - Los lugares instalados son una lista de pastillas.
- **Sin etiquetas sobre los títulos:** se quitaron en toda la página y en el aviso de privacidad, porque eran adorno de plantilla.
- **Formulario corto** (skills forms y labels):
  - Lleva tres campos con etiqueta visible (nombre, teléfono o WhatsApp, y pago al bimestre) y la casilla del aviso. Tipo y ciudad van ocultos.
  - Valida al salir de cada campo y limpia el error en cuanto vuelves a él. El error ocupa el lugar de la ayuda.
  - Al enviar con errores enfoca el primero y el mensaje sigue visible. El botón nunca se deshabilita antes de tiempo.
  - El monto solo se pasa desde la calculadora si la persona lo escribió ahí.
- **Botones con verbo primero** (skill verbs): "Cotiza tu sistema gratis", "Agenda tu visita por WhatsApp", "Lee las reseñas en Google", "Pide tu cotización gratis", "Llama" y "Cotiza gratis" en la barra de celular. No queda ningún "Enviar", "OK" ni "Más info".
- **AnimatedWebs** pide iniciar sesión y el instalador de ui-ux-pro-max estaba bloqueado. Se siguió su lista de revisión a mano: contraste, foco, 44 px, reducir movimiento, sin emojis como íconos.

### Fase 6: animaciones
- **Tokens:**
  - Transiciones de 100, 150, 200 y 300 ms; 400 ms solo para contar cifras.
  - Entrada con ease-out y salida con ease-in.
  - Desfase de 30 ms entre los elementos de un grupo, con un máximo de 90 ms.
  - Solo se animan `transform` y `opacity`.
- **Excepción documentada:** la animación de día y noche del hero (240 ms para hundirse y 820 ms para subir), que el cliente pidió y aprobó.
- **Qué se mueve:**
  - **Entrada del hero**: una sola secuencia de 300 ms.
  - **Aparición al hacer scroll:** 12 px y 300 ms.
  - **Línea de tiempo de "Cómo funciona":** la línea entre pasos se dibuja cuando cada paso aparece.
  - **Botones:** suben 2 px al pasar el mouse y se hunden un poco al presionarlos (100 ms).
  - **Preguntas frecuentes:** la pregunta cambia de color al pasar el mouse.
  - **Menú de celular y ventana del aviso:** entran con un desplazamiento de 8 px.
  - **Recibo de la calculadora:** cuenta hacia abajo en 400 ms; antes eran 1.3 s.
- **Contador de cifras** (`data-cifra`):
  - "40+" cuenta de 0 a 40 en 400 ms cuando aparece. Los lectores de pantalla leen siempre el valor final.
  - Los placeholders `[000]` y `[4.9]` no cuentan hasta que se pone el dato real con `data-cifra` (admite `data-decimales`, `data-prefijo` y `data-sufijo`).
- **Reducir movimiento:**
  - No hay desplazamientos ni conteos: las cifras salen completas y el hero cambia al instante.
  - Además del reinicio global, los botones no se mueven al pasar el mouse.
