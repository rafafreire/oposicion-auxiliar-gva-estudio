#!/usr/bin/env python3
"""Guarda el texto legible de una página web pública o autorizada en Markdown.

Uso:
    python extraer_pagina_web_md.py URL salida.md

No inicia sesión, no ejecuta JavaScript y no intenta saltarse suscripciones.
"""

from __future__ import annotations

import argparse
import html
import re
import ssl
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


MAX_RESPONSE_BYTES = 20 * 1024 * 1024
TIMEOUT_SECONDS = 30
SKIP_TAGS = {
    "script", "style", "noscript", "svg", "canvas", "iframe", "nav",
    "footer", "aside", "form", "button", "select", "option", "template",
}
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}
BLOCK_TAGS = {
    "address", "article", "blockquote", "div", "dl", "dt", "dd", "main",
    "section", "header", "h1", "h2", "h3", "h4", "h5", "h6", "p", "pre",
    "table", "tr",
}
PAYWALL_MARKERS = (
    "este temario es premium",
    "disponible con premium",
    "contenido premium",
    "suscríbete para continuar",
    "suscribete para continuar",
    "subscribe to continue",
    "subscription required",
)


def system_ssl_context(skip_verification: bool = False) -> ssl.SSLContext:
    """Usa las CA de Python y, en Windows, añade las del almacén del sistema."""
    context = ssl.create_default_context()
    if skip_verification:
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context
    # Algunas distribuciones de Python en Windows no conectan OpenSSL al
    # almacén de certificados de Windows. Añadir sus CA mantiene la validación
    # TLS activa sin aceptar certificados no verificados.
    if sys.platform == "win32" and hasattr(ssl, "enum_certificates"):
        certificates = []
        for certificate, encoding, _trust in ssl.enum_certificates("ROOT"):
            # Los certificados del almacén ROOT de Windows ya son raíces
            # confiables; `trust` puede ser True o una lista de usos concretos.
            if encoding == "x509_asn":
                certificates.append(ssl.DER_cert_to_PEM_cert(certificate))
        if certificates:
            context.load_verify_locations(cadata="".join(certificates))
    return context


class VisibleMarkdownParser(HTMLParser):
    """Conversión sencilla de los elementos visibles más comunes a Markdown."""

    def __init__(self, page_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.page_url = page_url
        self.output: list[str] = []
        self.current: list[str] = []
        self.heading_level = 0
        self.list_depth = 0
        self.skip_stack: list[str] = []
        self.anchor: dict[str, str] | None = None
        self.title_parts: list[str] = []
        self.in_title = False

    def _flush(self) -> None:
        text = re.sub(r"\s+", " ", "".join(self.current)).strip()
        self.current.clear()
        if not text:
            return
        if self.heading_level:
            text = f"{'#' * self.heading_level} {text}"
            self.heading_level = 0
        if not self.output or self.output[-1] != text:
            self.output.append(text)

    @staticmethod
    def _is_hidden(attrs: dict[str, str | None]) -> bool:
        style = (attrs.get("style") or "").replace(" ", "").lower()
        return (
            "hidden" in attrs
            or (attrs.get("aria-hidden") or "").lower() == "true"
            or "display:none" in style
            or "visibility:hidden" in style
        )

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs_list)

        if self.skip_stack:
            if tag not in VOID_TAGS:
                self.skip_stack.append(tag)
            return
        if tag in SKIP_TAGS or self._is_hidden(attrs):
            if tag not in VOID_TAGS:
                self.skip_stack.append(tag)
            return

        if tag == "title":
            self.in_title = True
        if tag in BLOCK_TAGS:
            self._flush()
        if tag in {"ul", "ol"}:
            self._flush()
            self.list_depth += 1
        elif tag == "li":
            self._flush()
            self.current.append("  " * max(0, self.list_depth - 1) + "- ")
        elif tag == "a":
            self._flush()
            href = attrs.get("href") or ""
            self.anchor = {"href": urljoin(self.page_url, href), "text": ""}
        elif tag == "br":
            self._flush()
        elif tag == "hr":
            self._flush()
            self.output.append("---")
        elif tag.startswith("h") and len(tag) == 2 and tag[1].isdigit():
            self.heading_level = min(int(tag[1]), 6)

    def handle_endtag(self, tag: str) -> None:
        if self.skip_stack:
            if tag in self.skip_stack:
                index = len(self.skip_stack) - 1 - self.skip_stack[::-1].index(tag)
                del self.skip_stack[index:]
            return

        if tag == "title":
            self.in_title = False
        if tag == "a" and self.anchor is not None:
            label = re.sub(r"\s+", " ", self.anchor["text"]).strip()
            href = self.anchor["href"]
            if label and href and urlparse(href).scheme in {"http", "https", "mailto"}:
                self.current.append(f"[{label}]({href})")
            elif label:
                self.current.append(label)
            self.anchor = None
        elif tag == "li":
            self._flush()
        elif tag in {"ul", "ol"}:
            self._flush()
            self.list_depth = max(0, self.list_depth - 1)
        elif tag in BLOCK_TAGS:
            self._flush()

    def handle_data(self, data: str) -> None:
        if self.skip_stack:
            return
        if self.in_title:
            self.title_parts.append(data)
        if self.anchor is not None:
            self.anchor["text"] += data
        else:
            self.current.append(data)

    def markdown(self) -> tuple[str, str]:
        self._flush()
        title = re.sub(r"\s+", " ", "".join(self.title_parts)).strip()
        return title, "\n\n".join(self.output).strip()


def download_page(url: str, skip_ssl_verification: bool = False) -> tuple[str, str]:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("La URL debe empezar por http:// o https://")

    request = Request(
        url,
        headers={
            "User-Agent": "OpoGVA-AuthorizedPageToMarkdown/1.0 (personal study use)",
            "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        },
    )
    with urlopen(
        request,
        timeout=TIMEOUT_SECONDS,
        context=system_ssl_context(skip_verification=skip_ssl_verification),
    ) as response:
        content_type = response.headers.get_content_type()
        if content_type not in {"text/html", "application/xhtml+xml"}:
            raise ValueError(f"La URL no devuelve una página HTML (tipo: {content_type}).")
        body = response.read(MAX_RESPONSE_BYTES + 1)
        if len(body) > MAX_RESPONSE_BYTES:
            raise ValueError("La página supera el límite de 20 MB.")
        charset = response.headers.get_content_charset() or "utf-8"
        final_url = response.geturl()

    try:
        source = body.decode(charset, errors="replace")
    except LookupError:
        source = body.decode("utf-8", errors="replace")

    readable_source = html.unescape(re.sub(r"<[^>]*>", " ", source)).lower()
    if any(marker in readable_source for marker in PAYWALL_MARKERS):
        raise PermissionError(
            "La página parece indicar que el contenido requiere Premium o suscripción. "
            "El extractor no guarda ese contenido. Usa páginas propias, públicas o "
            "para las que tengas autorización."
        )

    parser = VisibleMarkdownParser(final_url)
    parser.feed(source)
    title, markdown = parser.markdown()
    if not markdown:
        raise ValueError(
            "No se encontró texto HTML legible. Si la página carga el contenido "
            "mediante JavaScript, este extractor no puede verlo."
        )
    return title or final_url, markdown


def main() -> int:
    cli = argparse.ArgumentParser(
        description=(
            "Guarda como Markdown el texto visible de una página pública o "
            "cuyo uso tengas autorizado. No inicia sesión ni evita suscripciones."
        )
    )
    cli.add_argument("url", help="Dirección http(s) de la página")
    cli.add_argument("archivo_md", type=Path, help="Ruta del archivo .md de salida")
    cli.add_argument(
        "--insecure",
        action="store_true",
        help="Omitir la validación del certificado HTTPS (solo para diagnosticar tu propio sitio)",
    )
    args = cli.parse_args()

    output_path = args.archivo_md
    if output_path.suffix.lower() != ".md":
        output_path = output_path.with_suffix(".md")

    try:
        if args.insecure:
            print(
                "Aviso: se omite la validación del certificado HTTPS para esta descarga.",
                file=sys.stderr,
            )
        title, content = download_page(args.url, skip_ssl_verification=args.insecure)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        document = (
            f"# {title}\n\n"
            f"> Página de origen: {args.url}\n"
            f"> Extraído el {date.today().isoformat()}\n\n"
            f"{content}\n"
        )
        output_path.write_text(document, encoding="utf-8")
    except (HTTPError, URLError, TimeoutError, ValueError, PermissionError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    except OSError as error:
        print(f"No se pudo guardar el archivo: {error}", file=sys.stderr)
        return 1

    print(f"Contenido guardado en: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
