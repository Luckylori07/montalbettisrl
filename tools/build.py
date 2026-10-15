#!/usr/bin/env python3
"""Genera le pagine HTML statiche a partire da src/pages/*.html.

Banner demo, filigrana, header e footer vivono qui, in un unico punto, e
vengono inseriti identici in tutte le pagine. Uso:  python3 tools/build.py
"""
import math
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "pages"

TRAMONTIS = "https://tramontis.netlify.app/"
SITE = "Montalbetti S.r.l. - Proposta di sito (demo)"

NAV = [
    ("catalogo", "Catalogo", "catalogo.html"),
    ("marchi", "Marchi", "marchi.html"),
    ("azienda", "Azienda", "azienda.html"),
    ("risorse", "Risorse", "risorse.html"),
    ("rivenditori", "Rivenditori", "rivenditori.html"),
    ("contatti", "Contatti", "contatti.html"),
]

MAPS = "https://www.google.com/maps/search/?api=1&query=Via+Roma+57+21020+Daverio+VA+Italia"


SPRITE = """<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
<symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
<symbol id="i-ext" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
<symbol id="i-doc" viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z M14 3v5h5M10 13h6M10 17h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></symbol>
<symbol id="i-store" viewBox="0 0 24 24"><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
<symbol id="i-box" viewBox="0 0 24 24"><path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
<symbol id="i-cal" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
<symbol id="i-wheel" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 3v10M16 19v10M3 16h10M19 16h10M6.8 6.8l7 7M18.2 18.2l7 7M25.2 6.8l-7 7M13.8 18.2l-7 7" stroke="currentColor" stroke-width="1" opacity=".6"/></symbol>
</defs></svg>"""


def icon(name, cls=""):
    c = " ".join(["i", cls]).strip()
    return f'<svg class="{c}" aria-hidden="true" focusable="false"><use href="#i-{name}"/></svg>'


def banner():
    return (
        '<div class="demo-bar" role="note" aria-label="Avviso versione demo">'
        '<p><strong>VERSIONE DEMO</strong> - Proposta di sito non ancora attiva. '
        'Per averla online sul vostro dominio contatta '
        f'<a href="{TRAMONTIS}" target="_blank" rel="noopener noreferrer">Tramontis</a>.</p>'
        "</div>"
    )


def watermark():
    return '<div class="demo-mark" aria-hidden="true"><span>DEMO</span></div>'


def header(active):
    items = []
    for key, label, href in NAV:
        cur = ' aria-current="page"' if key == active else ""
        items.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    return f"""<header class="site-header" id="top">
  <div class="container header-row">
    <a class="logo" href="index.html" aria-label="Montalbetti S.r.l. - Home">
      <span class="logo-mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 3v10M16 19v10M3 16h10M19 16h10M6.8 6.8l7 7M18.2 18.2l7 7M25.2 6.8l-7 7M13.8 18.2l-7 7" stroke="currentColor" stroke-width="1.1" opacity=".55"/></svg></span>
      <span class="logo-text"><b>Montalbetti</b><i>S.r.l.</i></span>
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Navigazione principale">
      <ul>
        {''.join(items)}
      </ul>
      <a class="btn btn-accent btn-sm nav-cta" href="catalogo.html">Esplora il catalogo</a>
    </nav>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Apri il menu">
      <span class="nav-toggle-bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
  </div>
</header>"""


def footer():
    nav = "".join(f'<li><a href="{h}">{l}</a></li>' for _, l, h in NAV)
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="logo logo-light" href="index.html" aria-label="Montalbetti S.r.l. - Home">
          <span class="logo-mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30" focusable="false"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 3v10M16 19v10M3 16h10M19 16h10M6.8 6.8l7 7M18.2 18.2l7 7M25.2 6.8l-7 7M13.8 18.2l-7 7" stroke="currentColor" stroke-width="1.1" opacity=".55"/></svg></span>
          <span class="logo-text"><b>Montalbetti</b><i>S.r.l.</i></span>
        </a>
        <p class="footer-lead">Componenti, ricambi e accessori per biciclette, per rivenditori e officine.</p>
        <address>
          Via Roma, 57<br>21020 Daverio (VA), Italia<br>
          Tel. <a href="tel:+390332285147">0332 285147</a><br>
          <a href="mailto:info@montalbettisrl.com">info@montalbettisrl.com</a><br>
          <a href="{MAPS}" target="_blank" rel="noopener noreferrer">Apri su Google Maps</a>
        </address>
      </div>
      <nav aria-label="Link utili">
        <h2 class="footer-title">Sito</h2>
        <ul class="footer-list">{nav}</ul>
      </nav>
      <nav aria-label="Per i clienti">
        <h2 class="footer-title">Per i clienti</h2>
        <ul class="footer-list">
          <li><a href="contatti.html">Richiedi l'accesso ai prezzi</a></li>
          <li><a href="rivenditori.html">Trova un rivenditore</a></li>
          <li><a href="contatti.html">Richiesta informazioni</a></li>
        </ul>
      </nav>
      <nav aria-label="Note legali">
        <h2 class="footer-title">Informazioni legali</h2>
        <ul class="footer-list">
          <li><a href="privacy.html">Privacy</a></li>
          <li><a href="note-legali.html">Note legali</a></li>
          <li><a href="risorse.html#crediti">Crediti fotografici</a></li>
        </ul>
      </nav>
    </div>
    <div class="footer-base">
      <p>proposta di sito realizzata da <a href="{TRAMONTIS}" target="_blank" rel="noopener noreferrer">Tramontis</a></p>
      <p class="footer-fine">Marchi, loghi e immagini dei prodotti appartengono ai rispettivi titolari. Proposta di sito in versione dimostrativa.</p>
    </div>
  </div>
</footer>"""


def parse(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", raw, re.S)
    if not m:
        sys.exit(f"{path}: front matter mancante")
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, m.group(2)


def crumbs(meta):
    if "crumbs" not in meta:
        return ""
    parts = ['<li><a href="index.html">Home</a></li>']
    items = [c.strip() for c in meta["crumbs"].split(";") if c.strip()]
    for i, c in enumerate(items):
        label, _, href = c.partition("|")
        if i == len(items) - 1:
            parts.append(f'<li aria-current="page">{label}</li>')
        else:
            parts.append(f'<li><a href="{href}">{label}</a></li>')
    return f'<nav class="breadcrumb" aria-label="Percorso di navigazione"><div class="container"><ol>{"".join(parts)}</ol></div></nav>'


def gauge():
    """Quadrante a 23 tacche: una per ogni marchio presente nel catalogo."""
    n, cx, cy, r1, r2 = 23, 100, 100, 78, 92
    ticks = []
    for i in range(n):
        a = math.radians(-225 + i * (270 / (n - 1)))
        x1, y1 = cx + r1 * math.cos(a), cy + r1 * math.sin(a)
        x2, y2 = cx + r2 * math.cos(a), cy + r2 * math.sin(a)
        ticks.append(
            f'<line class="tick" style="--i:{i}" x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}"/>'
        )
    return (
        '<svg class="gauge-svg" viewBox="0 0 200 200" role="img" aria-label="Quadrante: 23 marchi nel catalogo" focusable="false">'
        '<circle class="gauge-ring" cx="100" cy="100" r="64" fill="none"/>'
        f'{"".join(ticks)}'
        '<g class="needle"><line x1="100" y1="100" x2="100" y2="52"/><circle cx="100" cy="100" r="5"/></g>'
        '</svg>'
    )


def render(path):
    meta, body = parse(path)
    body = body.replace("{{GAUGE}}", gauge())
    body = re.sub(r"\{\{icon:([a-z-]+)(?::([\w -]+))?\}\}", lambda m: icon(m.group(1), m.group(2) or ""), body)
    active = meta.get("nav", "")
    title = meta["title"]
    desc = meta["description"]
    bodyclass = meta.get("bodyclass", "")
    scripts = ['<script src="assets/js/main.js" defer></script>']
    for s in meta.get("scripts", "").split(","):
        s = s.strip()
        if s:
            scripts.append(f'<script src="assets/js/{s}.js" defer></script>')
    html = f"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#14171a">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
{meta.get('preload', '')}
<link rel="stylesheet" href="assets/css/style.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="{bodyclass}">
{SPRITE}
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
{banner()}
{header(active)}
{crumbs(meta)}
<main id="contenuto">
{body}
</main>
{footer()}
{watermark()}
{chr(10).join(scripts)}
</body>
</html>
"""
    out = ROOT / meta.get("out", path.name)
    out.write_text(html, encoding="utf-8")
    return out.name


if __name__ == "__main__":
    names = [render(p) for p in sorted(SRC.glob("*.html"))]
    print("Generate:", ", ".join(names))
