# OpoGVA · Auxiliar administrativo C2-01

Aplicación web estática para estudiar la convocatoria 70/26, turno libre, de la Generalitat Valenciana.

## Uso

Abre `index.html` en el navegador. No requiere instalación. El avance se guarda en el almacenamiento local del navegador y del dispositivo; no se sincroniza con otros equipos.

## Incluye

- Los 24 temas del Anexo IV, agrupados en parte general y especial.
- Enlaces al DOGV y a normas publicadas por BOE, EUR-Lex o DOGV.
- Dos preguntas de práctica por tema (48 en total), con corrección y explicación.
- Exámenes previos de 2018, 2021, 2022 y 2023, con respuestas de los JSON archivados y acceso al PDF original.
- Temario completo de los 24 temas, desplegado dentro de la app a partir de los apuntes de `OPOSICIONES/AUX ADM GVA/TEMARIO`.
- Seguimiento local de temas estudiados, preguntas respondidas y fallos pendientes.
- Repaso de fallos y diseño adaptable a móvil y escritorio.

Las preguntas de práctica son material didáctico, no preguntas oficiales. Los cuestionarios de años anteriores se muestran aparte y corresponden a convocatorias anteriores; conviene contrastar las normas con el programa vigente. El temario de la web de Vence se presenta como Premium; la app muestra los archivos que ya están guardados en la carpeta local.

## Fuentes de convocatoria

- [Orden 9/2026, convocatoria 70/26, DOGV núm. 10331 (PDF)](https://dogv.gva.es/datos/2026/03/27/pdf/2026_8071_es.pdf)
- [Ficha oficial de la convocatoria en la Sede GVA](https://sede.gva.es/es/detall-ocupacio-publica?id_emp=110135)

## Publicar en GitHub Pages

El repositorio incluye un flujo de GitHub Actions que publica la aplicación al hacer push a la rama `main`:

1. Sube el proyecto a GitHub y confirma que la rama principal se llama `main`.
2. En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como origen de publicación.
3. Cuando termine el flujo **Publicar OpoGVA en GitHub Pages** en la pestaña **Actions**, usa la URL que muestra **Settings → Pages** para abrir la app desde cualquier dispositivo.

El flujo publica la app, sus temas y los cuatro PDF enlazados; no copia el resto de los archivos locales al sitio. Si el repositorio es público, el sitio y su contenido también serán accesibles públicamente.

El progreso se guarda en el almacenamiento local del navegador. Se conserva en cada dispositivo, pero no se sincroniza entre ellos.