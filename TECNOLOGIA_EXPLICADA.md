# Cómo está hecha OpoGVA

Esta guía explica con palabras sencillas qué tecnologías utiliza la aplicación y qué ocurre cuando la abres.

## En pocas palabras

OpoGVA es una página web estática. Permite elegir entre Auxiliar Administrativo GVA y Auxiliar Administrativo AGE. Está hecha con **HTML, CSS y JavaScript**, los tres lenguajes básicos de las páginas web. No necesita instalarse y, por ahora, no tiene una base de datos ni un servidor propio.

## ¿Qué hace cada tecnología?

- **HTML** organiza el contenido: las pantallas, los botones, los menús, las preguntas y los temas. El archivo principal es `index.html`.
- **CSS** controla el aspecto: colores, tamaños, distribución de los elementos y adaptación a pantallas pequeñas o grandes. Está en `css/styles.css`.
- **JavaScript** da vida a la página: cambia de pantalla, carga preguntas, corrige respuestas, actualiza el progreso y abre los temas. La lógica principal está en `js/app.js`.

No se ha usado un programa adicional como React ni hace falta compilar la aplicación antes de publicarla.

## ¿Dónde están los temas y las preguntas?

- `js/data.js` contiene los datos generales de los temas y sus fuentes.
- `js/materials/tema-01.js` a `tema-24.js` contienen los apuntes de cada tema preparados para que la aplicación pueda mostrarlos.
- `js/past-exams.js` contiene las preguntas importadas de los exámenes GVA.
- `js/age-exams.js` contiene los cuestionarios AGE importados desde sus JSON; solo algunos incluyen respuestas correctas.
- `age.html` y `js/age-app.js` forman la sección AGE. Su índice temático enlaza al programa oficial porque no hay apuntes completos en la carpeta AUX ADM AGE.
- La carpeta `OPOSICIONES` conserva los materiales locales. Al publicar, el flujo de GitHub Pages copia a la web solo los archivos que necesita la aplicación y los PDF enlazados.

## ¿Dónde se guarda mi progreso?

El progreso se guarda en el almacenamiento local del navegador, una pequeña zona privada que el navegador reserva para una página web. Así se recuerdan los temas marcados, las valoraciones, las respuestas y los fallos aunque cierres la página.

Ese almacenamiento está en **ese navegador y ese dispositivo**. Por ejemplo, los datos guardados en el ordenador no aparecen automáticamente en el móvil. Para sincronizarlos haría falta añadir un servicio con cuentas de usuario y una base de datos.

## ¿Qué es GitHub Pages?

GitHub Pages es un servicio que publica los archivos de una página web desde un repositorio de GitHub. En este proyecto, el archivo `.github/workflows/pages.yml` automatiza la publicación:

1. Subes cambios a la rama `main` del repositorio.
2. GitHub Actions prepara los archivos necesarios para la web.
3. GitHub Pages publica el resultado y proporciona una dirección web.

Después de activar GitHub Pages en **Settings → Pages** y elegir **GitHub Actions**, cada nuevo cambio subido a `main` vuelve a publicarse automáticamente. La dirección se consulta en esa misma pantalla de configuración.

## Escuchar un tema

La lectura en voz alta utiliza la función de síntesis de voz que ofrece el navegador y el dispositivo. Por eso la voz y su sonido pueden cambiar entre ordenadores y móviles. La velocidad y la duración que muestra la aplicación son orientativas; el tiempo real depende de la voz disponible.

## ¿Necesita internet?

Necesitas internet para abrir la web publicada y descargar sus archivos. Una vez cargada, las pantallas y los datos incluidos en la aplicación se procesan en el navegador. Los enlaces a fuentes oficiales y a los PDF también necesitan conexión para abrirse.

## Visibilidad del contenido

Si el repositorio de GitHub es público, cualquiera podrá ver tanto el sitio publicado como los archivos guardados en ese repositorio. La web también debe entregar al navegador los apuntes y preguntas que muestra; por eso no se consideran contenido privado.
