# Descargar los temas en MP3

La aplicación puede ofrecer un MP3 descargable para cada tema. Los audios se generan a partir de los archivos `.md` locales con una voz española de Edge TTS; el contenido conserva las tildes y la ñ.

## Generar los 24 temas

Desde la carpeta del proyecto, ejecuta en PowerShell:

```powershell
py -m pip install -r scripts/requirements-audio.txt
py scripts/generate_topic_mp3.py
```

La generación requiere conexión a Internet. Los archivos se guardarán en `assets/audio/tema-01.mp3` hasta `tema-24.mp3` y se actualizará `assets/audio/manifest.json`.

Para generar solo un tema:

```powershell
py scripts/generate_topic_mp3.py --tema 1
```

También puedes elegir otra voz compatible o ajustar la velocidad:

```powershell
py scripts/generate_topic_mp3.py --tema 1 --voz es-ES-AlvaroNeural --velocidad=-10%
```

## Publicarlos en GitHub Pages

Sube a GitHub los MP3 generados y el manifiesto. La acción de GitHub Pages ya publica la carpeta `assets`; al desplegar los archivos, aparecerá el botón de descarga dentro de cada tema disponible.

Los audios largos pueden ocupar bastante espacio. Puedes generarlos por tema y publicar solo los que quieras tener disponibles.
