# Descargar los temas en MP3

## Primero: instalar Python correctamente

En este equipo, `py` no está instalado y `python` apunta al Python integrado en Inkscape, que no incluye `pip` ni permite crear un entorno virtual. Por eso los comandos anteriores fallan.

Instala Python para Windows desde [python.org/downloads](https://www.python.org/downloads/) o la Microsoft Store. La documentación oficial explica el [Python Install Manager para Windows](https://docs.python.org/3/using/windows.html). Después de instalarlo, cierra y vuelve a abrir PowerShell.

Comprueba que funciona:

```powershell
py --version
py -m pip --version
```

Ambos comandos deben mostrar una versión de Python/pip. No uses el `python.exe` que está dentro de la carpeta de Inkscape.

## Generar los audios

Si ves el indicador `>>>`, estas dentro de Python. Escribe `exit()` y pulsa Enter para volver a PowerShell; los comandos siguientes se escriben en PowerShell, donde veras un indicador parecido a `PS C:\...>` .

Desde la carpeta principal del proyecto, ejecuta:

```powershell
python -m pip --version
python -m pip install -r scripts/requirements-audio.txt
python scripts/generate_topic_mp3.py
```

La generación requiere conexion a Internet. Los archivos se guardan en `assets/audio/tema-01.mp3` hasta `tema-24.mp3`, y se actualiza `assets/audio/manifest.json`.

Para generar solo un tema:

```powershell
python scripts/generate_topic_mp3.py --tema 1
```

También puedes cambiar la voz o la velocidad:

```powershell
python scripts/generate_topic_mp3.py --tema 1 --voz es-ES-AlvaroNeural --velocidad=-10%
```

### Temas AGE (1–28)

Para generar los audios de los bloques I y II del temario de AUX ADM AGE, usa el generador independiente:

```powershell
python scripts/generate_age_topic_mp3.py
```

Los archivos se guardan como `assets/audio/age-tema-01.mp3` hasta `age-tema-28.mp3` y se actualiza `assets/audio/age-manifest.json`. Para generar un tema concreto:

```powershell
python scripts/generate_age_topic_mp3.py --tema 1
```

También admite `--voz` y `--velocidad`, igual que el generador de GVA. La lectura en voz alta de AGE funciona en el navegador sin MP3; la descarga solo aparece para los temas cuyo audio se haya generado. El tema 26 usa la ficha local de Access porque BLOQUE II no contiene su apunte completo.

## Publicarlos en GitHub Pages

Sube a GitHub los MP3 generados y su manifiesto correspondiente (`manifest.json` para GVA o `age-manifest.json` para AGE). GitHub Pages publica la carpeta `assets`; al desplegar los archivos, se activarán los botones de descarga de esos temas.

Los audios largos pueden ocupar bastante espacio. Puedes generarlos por tema y publicar solo los que quieras tener disponibles.
