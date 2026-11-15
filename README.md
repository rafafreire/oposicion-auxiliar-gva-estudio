# OpoGVA · Auxiliar administrativo C2-01

Aplicación web estática para estudiar varias oposiciones administrativas e informáticas. Incluye la convocatoria 70/26 de la Generalitat Valenciana, cuerpos de la Administración General del Estado y el Ayuntamiento de València.

## Uso

Abre `index.html` en el navegador. No requiere instalación. El avance se guarda en el almacenamiento local del navegador y del dispositivo; no se sincroniza con otros equipos.

## Incluye

- Selector entre las oposiciones GVA, AGE, Ayuntamiento de València y Gestión de Sistemas e Informática AGE, con progreso separado para cada una.
- Los 24 temas del Anexo IV de GVA, agrupados en parte general y especial.
- Temario AGE para los 28 temas, con visor de lectura y apuntes locales de los bloques I y II.
- Programa oficial GSI AGE de ingreso libre (OEP 2025), con 57 temas en cuatro bloques, doce cuestionarios históricos en JSON y plantillas INAP de 2008, 2011, 2013, 2018, 2019, 2022 y 2024.
- Temario del Ayuntamiento de València con 21 temas completos en los bloques I y II.
- Enlaces al DOGV, al BOP de València y a normas publicadas por BOE o EUR-Lex.
- En GVA, dos preguntas de práctica por tema (48 en total), con corrección y explicación.
- Exámenes GVA de 2018, 2021, 2022 y 2023, diez cuestionarios AGE de 2008 a 2025 y un banco de 208 preguntas de Auxiliar Administrativo de València, con acceso a los PDF.
- Temario completo de los 24 temas, desplegado dentro de la app a partir de los apuntes de `OPOSICIONES/AUX ADM GVA/TEMARIO`.
- Seguimiento local de temas estudiados, autoevaluación, preguntas respondidas y fallos pendientes.
- Lectura de temas GVA, AGE y València en ventanas independientes, con barra de progreso, velocidad ajustable y duración estimada; descarga de MP3 donde hay audios generados.
- Repaso de fallos y diseño adaptable a móvil y escritorio.
- Lectura en voz alta de las preguntas y sus opciones mediante la voz del navegador.

Las preguntas de práctica son material didáctico, no preguntas oficiales. Los cuestionarios de años anteriores se muestran aparte y corresponden a convocatorias anteriores; conviene contrastar las normas con el programa vigente. El programa oficial AGE se enlaza desde el BOE. El visor usa los apuntes de los bloques I y II; el tema 26 conserva la ficha de repaso al no haber un archivo completo de Access en BLOQUE II. El archivo TEMA 24 de ese bloque duplica el contenido del tema 23, así que Word y Excel se asocian a sus apuntes por el título interno. La carpeta ADMIN AGE corresponde a otro cuerpo. El temario GVA muestra los archivos locales completos.

## Fuentes de convocatoria

- [Orden 9/2026, convocatoria 70/26, DOGV núm. 10331 (PDF)](https://dogv.gva.es/datos/2026/03/27/pdf/2026_8071_es.pdf)
- [Ficha oficial de la convocatoria en la Sede GVA](https://sede.gva.es/es/detall-ocupacio-publica?id_emp=110135)
- [Convocatoria AGE 2025 en el BOE (Anexo I)](https://boe.es/buscar/doc.php?id=BOE-A-2025-26262)
- [GSI AGE · ingreso libre, convocatoria 2025 (INAP)](https://sede.inap.gob.es/es/procedimientos-y-servicios/seleccion/procesos-selectivos-de-cuerpos-y-escalas-generales/cuerpo-de-gestion-de-sistemas-e-informatica-de-la-administracion-del-estado-ingreso-libre-convocatoria-2025)
- [GSI AGE · ingreso libre, OEP 2021–2024 (INAP)](https://sede.inap.gob.es/es/procedimientos-y-servicios/seleccion/procesos-selectivos-de-cuerpos-y-escalas-generales/cuerpo-de-gestion-de-sistemas-e-informatica-de-la-administracion-del-estado/cgseiae-ingreso-libre-oferta-de-empleo-publico-2021-2024)

## Publicar en GitHub Pages

El repositorio incluye un flujo de GitHub Actions que publica la aplicación al hacer push a la rama `main`:

1. Sube el proyecto a GitHub y confirma que la rama principal se llama `main`.
2. En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como origen de publicación.
3. Cuando termine el flujo **Publicar OpoGVA en GitHub Pages** en la pestaña **Actions**, usa la URL que muestra **Settings → Pages** para abrir la app desde cualquier dispositivo.

El flujo publica las pantallas, los datos integrados, los PDF de exámenes necesarios y los apuntes de AGE, GSI AGE y València. Los MP3 son opcionales: consulta [GENERAR_AUDIO_MP3.md](./GENERAR_AUDIO_MP3.md) para generarlos. Si el repositorio es público, el sitio y su contenido también serán accesibles públicamente.

El progreso se guarda en el almacenamiento local del navegador. Se conserva en cada dispositivo, pero no se sincroniza entre ellos.