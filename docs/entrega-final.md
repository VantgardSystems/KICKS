# Entrega final: rediseño de ecowatt.mx

La página está en la rama `ccr-c25e2fab-ok54v8`, con un commit por fase. Para verla en tu compu: `python3 -m http.server` y abre `http://localhost:8000`.

## Antes y después, medido en el navegador

| Medida | Fase 0 (antes) | Ahora |
|---|---|---|
| Secciones | 13 | 9, en el orden del brief |
| Alto de la página en celular | 23,717 px | 12,621 px |
| Alto en escritorio | — | 7,865 px |
| Descarga inicial | 1.3 MB (escritorio) | 822 KB |
| Grosores de letra | 5 | 3 (400, 500, 600) |
| Tamaños de letra distintos | 19 a 21 | 8 en celular, 10 en escritorio |
| Textos menores a 12 px | varios de 11 px | 0 |
| H1 del hero | 33 px en celular, 53 px en escritorio | 36 px en celular, 62 a 67 px en escritorio |
| Espaciado fuera de la escala | 60 % | 11 % (el resto es la escala de la foto del hero) |
| Avisos de "Foto real pendiente" | 14 | 0 |
| Botones de WhatsApp | 16 | 13, todos con mensaje prellenado |
| Campos del formulario | 8 (con foto y ciudad) | 3, más la casilla del aviso |
| Pruebas automáticas | 23 | 37: 30 de la página, 3 del interruptor y 4 de las animaciones |

## 1. Cambios por fase

### Fase 0: auditoría
Se midió la página sin cambiar código. Los 10 problemas principales fueron:
1. El hero no vendía.
2. Había placeholders a la vista.
3. Las imágenes no tenían personas reales y mezclaban estilos.
4. Había 7 fondos de sección sin dirección de color.
5. La página era demasiado larga.
6. El formulario era largo y no enviaba a ningún lado.
7. Había 5 grosores de letra y 21 tamaños.
8. El espaciado no seguía una escala.
9. Sobraban el efecto vidrio y los elementos flotantes.
10. Había detalles de accesibilidad.

### Fase 1: sistema de diseño
- Todos los colores, espacios, radios y sombras son tokens en `:root`.
- La paleta es oscura, con verdes brillantes, verde claro, azules oscuros y texto blanco.
- La regla 60-30-10 se midió en capturas: 59-60 % / 37-39 % / 2-3 %.
- El espaciado usa una escala de 8 px y el contenido mide hasta 1200 px de ancho.
- Se quitó el efecto vidrio.

### Fase 2: tipografía
- Red Hat Display para títulos y cifras, y Red Hat Text para el texto (Google Fonts). Adobe Fonts necesita autorización y licencia.
- Tres grosores.
- Escala de tercera menor, de 12 a 76 px.
- El interlineado baja conforme sube el tamaño.
- Las líneas tienen como máximo unos 70 caracteres.

### Fase 3: hero
- **Escritorio:**
  - Texto grande a la izquierda: "Paga el mínimo de luz con paneles solares en León", en tres líneas parejas.
  - Subtítulo de una línea.
  - Botones "Cotiza tu sistema gratis" y "Calcula tu ahorro".
  - Tres datos de confianza: 40+ años y dos marcados EDITAR.
  - A la derecha, una ventana con la casa que sale por el borde de la pantalla.
- **Animación:** se conservó la de día y noche con niebla WebGL, ahora dentro de la ventana.
- **Celular:** texto, luego la casa con el interruptor arriba, y luego los datos. Todo cabe encima de la barra fija.

### Fase 4: imágenes
- **Sin generación:** Kling tenía 0 créditos y Higgsfield, 0.05. Por eso no se generaron imágenes nuevas.
- **Un solo estilo:** se creó `herramientas/estilo-imagen.py`, que da a todas las fotos la misma luz cálida de atardecer con sombras azul petróleo. También sirve para las fotos reales.
- **Ajustes técnicos:** `sizes` corregido en el hero; WebP en dos tamaños, carga diferida, `width` y `height`, y texto alternativo en todas.
- **Prompts listos:** las tres imágenes que faltan tienen su prompt en `docs/imagenes-ia.md`.

### Fase 5: secciones y componentes
- **Orden:** hero, barra de confianza, 4 ventajas, cómo funciona (visita, diseño, instalación, ahorro), calculadora, testimonios de ejemplo, garantía y formas de pago, preguntas, contacto y pie.
- **Formulario corto:** valida al salir del campo, el error reemplaza la ayuda y el foco va al primer error.
- **Botones:** todos empiezan con verbo.
- **Nada real se perdió:** las soluciones, la deducción del 100 %, la DAC, los proyectos y la cobertura se integraron a las secciones nuevas.

### Fase 6: animaciones
- **Duraciones:** 100, 150, 200 y 300 ms; 400 ms solo para contar cifras. La animación de día y noche queda como excepción documentada.
- **Qué se anima:**
  - La entrada del hero y la aparición al hacer scroll.
  - La línea de "Cómo funciona", que se dibuja.
  - Los botones al pasar el mouse y al presionarlos.
  - El menú de celular y el aviso, que entran con un desplazamiento corto.
  - La cifra "40+", que cuenta al aparecer.
- **Reducir movimiento:** con esa opción, nada se mueve.

### Fase 7: responsive y pulido
- **Anchos y accesibilidad:**
  - Sin scroll horizontal de 320 a 1440 px.
  - Controles de 44 px, contraste AA sin fallas y foco visible en todo.
  - El foco no queda debajo de la cabecera ni de la barra de celular.
- **Correcciones de 320 px:** el interruptor y las garantías se acomodaron.
- **Honestidad:** se quitaron promesas sin confirmar ("24/7", "Es gratis") y pastillas decorativas.

## 2. Todo lo que hay que editar

Cada dato aparece en la página entre corchetes o con la etiqueta **EDITAR**, para que se encuentre buscando `EDITAR` o `[` en el código. Al confirmarlo, borra la etiqueta `<span class="ej">EDITAR</span>` que lo acompaña.

### Textos por sección (index.html)
| Sección | Qué editar |
|---|---|
| Hero | `[000]` sistemas instalados; `[4.9]` de 5 en Google. Al poner el dato real, agrega `data-cifra` para que cuente, por ejemplo `data-cifra="4.9" data-decimales="1"` |
| Barra de confianza | 6 logos: `[Marca de paneles]` ×2, `[Marca de inversores]` ×2 y `[Certificación]` ×2. Solo marcas que instalan y certificaciones que tienen |
| Cómo funciona | Instalación en `[X días]`; `[Confirmar: Ecowatt hace por ti el trámite del medidor con CFE.]` |
| Calculadora | Etiqueta "EDITAR fórmula": confirmar los valores de `CONFIG` (tabla de abajo) y poner `datosDeEjemplo: false` |
| Testimonios | Los 3 son ejemplos: texto, `[Nombre del cliente]` / `[Nombre y negocio]`, `[Colonia]` y foto. Cada uno necesita permiso por escrito. Bloque de Google: `[4.9]` y `[000]` reseñas, y confirmar el enlace a la ficha |
| Garantías | `[00] años` para paneles, inversor e instalación; `[Confirmar si es de producto, de rendimiento o ambas.]`; `[Confirmar alcance.]` |
| Formas de pago | `[Confirmar si hay descuento.]`; `[Confirmar institución, plazos y requisitos.]`; `[Confirmar bancos y plazos.]` |
| Preguntas | Precio de `[$00,000]` a `[$00,000]`; retorno entre `[X]` y `[X]` años; dato de granizo y norma; cómo fijan la estructura y cuidan el impermeabilizante; limpieza `[cada X meses]`; si desmontan y reinstalan; instalación `[X días]` y medidor `[X semanas]`; quién hace el trámite ante CFE |
| Contacto | Respuesta en menos de `[24 h]` (en la promesa y en el mensaje de éxito) |
| Pie | `[Días y horario de atención]`; agrégalo también como `openingHoursSpecification` en el JSON-LD |
| Asistente (vista previa) | Es una maqueta. Si conectan un asistente real (por ejemplo con Gemini), reemplacen `#chat-panel` |
| Ventana del aviso | `[Razón social de la empresa]` |

### Aviso de privacidad (aviso-de-privacidad.html)
Es un borrador conforme a la LFPDPPP y lo debe revisar un abogado. Hay que completar:
- `[Razón social de la empresa]` y `[Nombre o área]` a cargo de los datos.
- La fecha de "Última actualización".
- Qué datos de facturación y pago piden, y qué datos pide CFE para el trámite.
- Confirmar las transferencias a CFE y a los fabricantes, y la lista real de proveedores.
- Plazo de respuesta ARCO `[20 días hábiles]` y plazo de conservación `[12 meses]`.
- La nota de cookies, si se agrega analítica.
- La autoridad vigente.
- El horario.

### Calculadora (`CONFIG` en assets/js/ecowatt.js)
| Valor | Qué es |
|---|---|
| `tarifas.casa.precioKwh`, `tarifas.negocio.precioKwh` | Pesos por kWh con IVA |
| `cargoMinimoBimestral` (casa y negocio) | Lo que se sigue pagando a CFE con paneles |
| `pagoBajo` (casa y negocio) | Monto bajo el cual se avisa que el sistema tarda más en pagarse |
| `panel.potenciaW`, `panel.costoInstaladoPorPanel` | Panel que instalan y su costo instalado |
| `rendimientoSistema`, `ciudades[].hsp` | Pérdidas y horas de sol pico por ciudad |
| `formulario.endpoint` | URL que recibe el formulario. Vacía = modo demostración |

### Imágenes
| Imagen | Estado | Dónde va |
|---|---|---|
| Casa con paneles al atardecer | Hecha (IA con el estilo cálido) | Hero |
| Casas, negocios e industrias | Hechas (IA, "Imágenes ilustrativas") | Ventajas |
| Detalle de un panel con reflejos | Falta: prompt listo | Garantía (`secciones/detalle-panel.webp`) |
| Instaladores en un techo | Falta: mejor una foto real del equipo | Cómo funciona (`secciones/instalacion.webp`) |
| Familia en casa con luz cálida | Falta: prompt listo | Ventajas (`secciones/familia.webp`), nunca como testimonio |
| Logos de marcas y certificaciones | Faltan | Barra de confianza |
| Fotos de clientes | Faltan, con permiso | Testimonios |

Toda foto nueva se procesa con `python3 herramientas/estilo-imagen.py foto.jpg assets/img/secciones/nombre --anchos 1200 720 --recorte 4:3`.

## 3. Tres recomendaciones para subir de nivel

1. **Una sesión de fotos y video reales, de medio día.**
   - Qué grabar: una instalación real con la cuadrilla en uniforme de Ecowatt, una casa de cliente a la hora dorada, el detalle de los paneles y un clip vertical de 10 a 15 segundos.
   - Qué cambia: sustituye todas las imágenes de IA y llena los tres espacios pendientes. En un sitio de servicios, ver al equipo real es lo que más sube la confianza. Con `estilo-imagen.py` todo queda con la misma luz que ya tiene la página.
2. **Pruebas que se puedan verificar.**
   - **Casos de estudio:** 3 a 5 casos con su recibo antes y después (con permiso), el número de paneles y el tiempo de instalación. Así los `[000]` del hero se vuelven cifras reales que cuentan solas.
   - **Reseñas y respaldo:** las reseñas de Google conectadas a la ficha real, y los logos de marcas y certificaciones verdaderos.
   - **Dónde:** cada caso puede tener su página (`/proyectos/la-campina/`), que además ayuda al SEO local.
3. **Páginas por ciudad y medición de conversiones.**
   - **Páginas por ciudad:** la estructura ya está lista con `data-ciudad`. Falta crear las 8 páginas con contenido local (colonias, tarifas, proyectos de esa ciudad).
   - **Formulario:** conectar `formulario.endpoint`.
   - **Medición:** medir con una herramienta respetuosa de la privacidad (por ejemplo Plausible) tres eventos: clic en WhatsApp, uso de la calculadora y envío del formulario. Con eso se puede probar qué titular o qué orden de secciones trae más cotizaciones.
   - **Asistente:** si después quieren el asistente con Gemini, ya tiene su lugar en la página.
