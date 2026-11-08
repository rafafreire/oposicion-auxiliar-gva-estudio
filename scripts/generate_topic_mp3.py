#!/usr/bin/env python3
"""Generate downloadable Spanish MP3s from the local GVA topic Markdown files."""

from __future__ import annotations

import argparse
import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TEMARIO_ROOT = PROJECT_ROOT / "OPOSICIONES" / "AUX ADM GVA" / "TEMARIO"
AUDIO_DIR = PROJECT_ROOT / "assets" / "audio"


def topic_path(number: int) -> Path:
    section = "PARTE GENERAL" if number <= 10 else "PARTE ESPECIFICA"
    return TEMARIO_ROOT / section / f"TEMA {number:02}.md"


def markdown_to_speech(markdown: str) -> str:
    """Remove Markdown/UI markup while retaining the readable study text."""
    text = re.sub(r"(?m)^\[\[EXAM-REF:.*?\]\]\s*$", "", markdown)
    text = re.sub(r"\[\[HIGHLIGHT\]\](.*?)\[\[/HIGHLIGHT\]\]", r"\1", text, flags=re.S)
    text = re.sub(r"(?s)<!--.*?-->", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\((?:https?://|#)[^)]+\)", r"\1", text)
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"(?m)^\s*\|[-|: ]+\|\s*$", "", text)
    text = re.sub(
        r"(?m)^\s*\|(.+?)\|\s*$",
        lambda match: ". ".join(cell.strip() for cell in match.group(1).split("|") if cell.strip()),
        text,
    )
    text = re.sub(r"(?m)^\s*#{1,6}\s*", "", text)
    text = re.sub(r"(?m)^\s*(?:[-*+] |\d+[.)] )", "", text)
    text = re.sub(r"(?m)^\s*>\s?", "", text)
    text = re.sub(r"(?m)^\s*[-—_=]{3,}\s*$", "", text)
    text = re.sub(r"\*\*|__|~~|`{1,3}", "", text)
    text = re.sub(r"(?m)^\s*\[[ xX]\]\s*", "", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def update_manifest() -> None:
    available = sorted(
        int(match.group(1))
        for path in AUDIO_DIR.glob("tema-*.mp3")
        if (match := re.fullmatch(r"tema-(\d{2})\.mp3", path.name))
    )
    manifest = {
        "available": available,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    (AUDIO_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


async def generate(number: int, voice: str, rate: str) -> None:
    try:
        import edge_tts
    except ImportError as error:
        raise SystemExit("Falta edge-tts. Instálalo con: py -m pip install -r scripts/requirements-audio.txt") from error

    source = topic_path(number)
    if not source.is_file():
        raise SystemExit(f"No se encuentra el archivo del Tema {number:02}: {source}")

    speech_text = markdown_to_speech(source.read_text(encoding="utf-8-sig"))
    if not speech_text:
        raise SystemExit(f"El Tema {number:02} no contiene texto para convertir.")

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    destination = AUDIO_DIR / f"tema-{number:02}.mp3"
    print(f"Generando Tema {number:02} ({len(speech_text.split())} palabras)...")
    await edge_tts.Communicate(speech_text, voice=voice, rate=rate).save(str(destination))
    update_manifest()
    print(f"Guardado: {destination.relative_to(PROJECT_ROOT)} ({destination.stat().st_size:,} bytes)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera audios MP3 de los temas de Auxiliar Administrativo GVA.")
    parser.add_argument("--tema", type=int, help="Genera solo un tema, del 1 al 24. Por defecto genera todos.")
    parser.add_argument("--voz", default="es-ES-ElviraNeural", help="Voz de Edge TTS (por defecto: es-ES-ElviraNeural).")
    parser.add_argument("--velocidad", default="+0%", help="Velocidad de voz, por ejemplo +10%% o -10%%.")
    args = parser.parse_args()

    numbers = [args.tema] if args.tema is not None else list(range(1, 25))
    if any(number < 1 or number > 24 for number in numbers):
        parser.error("--tema debe estar entre 1 y 24")

    async def run_all() -> None:
        for number in numbers:
            await generate(number, args.voz, args.velocidad)

    asyncio.run(run_all())


if __name__ == "__main__":
    main()
