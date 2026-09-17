## Palette — Generador de paletas armónicas

Sitio estático desarrollado con HTML, CSS y JavaScript nativo (vainilla), organizado mediante módulos ES. 
Genera paletas de 6, 8 o 9 colores basadas en armonías cromáticas:
  -Complementaria
  -Análoga 
  -Tríada
  -Complementaria dividida
  -Cuadrada
E incluye funciones de almacenamiento en una biblioteca local, exportación de imágenes y guardado
automático de la paleta actual.

## Iniciar el proyecto

https://jmrbt511.github.io/ProyectoM1_JoseMiguelReyesBetancourt/

## Estructura

index.html
style.css
src/
  main.js               → conecta la interfaz con el estado y los módulos
  state.js              → estado actual (armonía, tamaño, formato, colores)
  palette.js            → coordina harmony.js + random.js
  storage.js            → guardado/carga de la paleta actual (localStorage)
  savedPalettes.js      → biblioteca de paletas guardadas por el usuario (localStorage separado)
  color/
    convert.js          → conversiones HSL ↔ HEX ↔ RGB, contraste de texto
    harmony.js          → definición de armonías (diferencias de tono)
    random.js           → tono base aleatorio + variaciones sistemáticas
  ui/
    render.js           → visualización de muestras, bloqueo, notificación de copia
    savedPanel.js       → visualización de miniaturas en el panel lateral
    clipboard.js        → copia al portapapeles (con alternativa de respaldo)
    export.js           → exportación de imagen (PNG)
  i18n/
    translations.js     → diccionario ES (idioma base) / EN / FR
    i18n.js             → idioma actual, función t(), persistencia de la elección

## Bloqueo de colores

Cada muestra de color tiene un icono de candado (esquina superior derecha). 
Un color bloqueado no se sustituye al generar una nueva combinación solo se regeneran los colores no bloqueados.
(mediante el botón "Generar" o al cambiar la armonía o el tamaño).
El bloqueo afecta al color en sí, no a su coherencia armónica con los nuevos colores generados a su alrededor.

## Biblioteca de paletas guardadas

El botón "Guardar paleta" (en la parte inferior de la pantalla) almacena una instantánea
de la paleta actual —colores, armonía, tamaño y formato— en
`localStorage`, independientemente del guardado automático de la paleta en curso.

Estas paletas aparecen como miniaturas en un panel:
- **En PC (> 720px)**: el panel es una columna fija situada a la izquierda de la
  paleta principal.
- **En pantallas más pequeñas**: el panel está oculto por defecto; un botón
  tipo "hamburguesa" en la esquina superior izquierda lo abre como un panel deslizante sobre el contenido
  (incluye un fondo oscurecido sobre el que se puede hacer clic para cerrarlo,
  así como un botón de cierre y la tecla Esc).

Al hacer clic en una miniatura, esa paleta se carga en el área principal
(restableciendo los bloqueos). Una pequeña "×" en cada miniatura permite
eliminarla de la biblioteca. El estado de "bloqueo" de un color no se
conserva en la biblioteca: solo tiene sentido durante una sesión de
generación, no para una instantánea guardada.

## Idiomas

El sitio se inicia en español por defecto. El inglés y el francés están
disponibles a través del selector "Idioma / Language / Langue" en la barra
superior; la elección se guarda en `localStorage` y se recupera en la
siguiente carga. El panel de paletas guardadas también está traducido.

## Cómo se generan los colores (enfoque adoptado)

1. Se selecciona al azar un tono base, así como una saturación y una
   luminosidad base dentro de rangos visualmente agradables.
2. La armonía elegida proporciona un pequeño número de tonos "puros" (de 2 a 4,
   según la armonía) en torno a esa base.
3. Para obtener 6, 8 o 9 colores, cada tono base se repite con
   variaciones sistemáticas de luminosidad/saturación (alternancia entre
   más claro y más oscuro, con incrementos progresivos), en lugar de
   inventar nuevos tonos ajenos a la armonía.

Cambiar el formato de visualización (HEX/HSL) no regenera la paleta:
únicamente modifica la etiqueta que se muestra para colores ya calculados.
