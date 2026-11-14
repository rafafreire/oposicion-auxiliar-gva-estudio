#!/usr/bin/env python3
"""Generate downloadable Spanish MP3s from the local AGE study materials."""

from __future__ import annotations

import argparse
import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TEMARIO_ROOT = PROJECT_ROOT / "OPOSICIONES" / "AUX ADM AGE" / "TEMARIO"
BLOCK_I_ROOT = TEMARIO_ROOT / "BLOQUE I"
BLOCK_II_ROOT = TEMARIO_ROOT / "BLOQUE II"
AUDIO_DIR = PROJECT_ROOT / "assets" / "audio"
# The Block II folder duplicates TEMA 24; the Access topic is available as a local summary.
BLOCK_II_FILE_NUMBERS = {**{number: number for number in range(17, 24)}, 24: 25, 25: 26, 27: 27, 28: 28}
UI_LINE = re.compile(
    r"^(?:\d+\s+ley(?:es)?|\d+\s+artículos de tu programa|"
    r"\d+\s+artículos? preguntados? en examen oficial|Actualizado a\b|"
    r"¿Quieres verla completa\b|Esta ley$|Todo el tema$|LEY$|Escuchar$|"
    r"Configurar$|Aprovecha el transporte\b|AA$|Hacer test\b.*|🔧.*|"
    r"Elegir cuántas$|Subir$|Examen$|\d+)$"
)


def topic_path(number: int) -> Path:
    if number <= 16:
        return BLOCK_I_ROOT / f"TEMA {number:02}"
    if number == 26:
        return TEMARIO_ROOT / "TEMA 26.md"
    return BLOCK_II_ROOT / f"TEMA {BLOCK_II_FILE_NUMBERS[number]}"


def clean_markdown(line: str) -> str:
    line = re.sub(r"^#{1,6}\s*", "", line)
    line = re.sub(r"^\s*[-*]\s+", "", line)
    line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
    return line.replace("**", "").replace("`", "").strip()


def material_to_speech(source: str) -> str:
    lines = [clean_markdown(line) for line in source.replace("\r", "").split("\n")]
    starts = [
        index for index, line in enumerate(lines)
        if line == "LEY" or re.match(r"^Art\.\s", line, re.IGNORECASE)
    ]
    start = min(starts) if starts else min(2, len(lines))
    result = [line for line in lines[:2] if line]

    for index in range(start, len(lines)):
        line = lines[index]
        if (
            not line
            or UI_LINE.match(line)
            or "Aprovecha el transporte" in line
            or re.match(r"^\d+ de \d+ artículos\b", line)
        ):
            continue
        following = [item for item in lines[index + 1:index + 4] if item]
        if line.endswith(("…", "...")) and any(
            re.match(r"^(?:Título|Capítulo|Sección)\b", item, re.IGNORECASE)
            for item in following
        ):
            continue
        result.append(line)

    return "\n".join(result).strip()


def update_manifest() -> None:
    available = sorted(
        int(match.group(1))
        for path in AUDIO_DIR.glob("age-tema-*.mp3")
        if (match := re.fullmatch(r"age-tema-(\d{2})\.mp3", path.name))
    )
    manifest = {
        "available": available,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    (AUDIO_DIR / "age-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


async def generate(number: int, voice: str, rate: str) -> None:
    try:
        import edge_tts
    except ImportError as error:
        raise SystemExit(
            "Falta edge-tts. Instala las dependencias con "
            "python -m pip install -r scripts/requirements-audio.txt"
        ) from error

    source = topic_path(number)
    if not source.is_file():
        raise SystemExit(f"No se encuentra el archivo del Tema {number:02}: {source}")

    speech_text = material_to_speech(source.read_text(encoding="utf-8-sig"))
    if not speech_text:
        raise SystemExit(f"El Tema {number:02} no contiene texto para convertir.")

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    destination = AUDIO_DIR / f"age-tema-{number:02}.mp3"
    print(f"Generando AGE Tema {number:02} ({len(speech_text.split())} palabras)...")
    await edge_tts.Communicate(speech_text, voice=voice, rate=rate).save(str(destination))
    update_manifest()
    print(f"Guardado: {destination.relative_to(PROJECT_ROOT)} ({destination.stat().st_size:,} bytes)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera audios MP3 de los temas 1–28 de Auxiliar AGE.")
    parser.add_argument("--tema", type=int, help="Genera solo un tema, del 1 al 28. Por defecto genera todos.")
    parser.add_argument("--voz", default="es-ES-ElviraNeural", help="Voz Edge TTS (por defecto: es-ES-ElviraNeural).")
    parser.add_argument("--velocidad", default="+0%", help="Velocidad de voz, por ejemplo +10%% o -10%%.")
    args = parser.parse_args()

    numbers = [args.tema] if args.tema is not None else list(range(1, 29))
    if any(number < 1 or number > 28 for number in numbers):
        parser.error("--tema debe estar entre 1 y 28")

    async def run_all() -> None:
        for number in numbers:
            await generate(number, args.voz, args.velocidad)

    asyncio.run(run_all())


if __name__ == "__main__":
    main()
