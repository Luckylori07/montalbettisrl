# Montalbetti S.r.l. - proposta di sito (DEMO Tramontis)

Restyling dimostrativo del sito https://www.montalbettisrl.com/ (distribuzione di componenti, ricambi e accessori per biciclette, Daverio - VA). **Non è un sito ufficiale e non è approvato dal cliente.** Realizzato da [Tramontis](https://tramontis.netlify.app/).

HTML, CSS e JavaScript vanilla, senza dipendenze né backend: compatibile con GitHub Pages.

## Struttura

```
index.html catalogo.html prodotto.html marchi.html azienda.html
risorse.html rivenditori.html contatti.html privacy.html note-legali.html 404.html
favicon.svg  robots.txt  .nojekyll
assets/css/style.css          stile unico (token, componenti)
assets/js/main.js             menu mobile, header, reveal, hero, quadrante
assets/js/catalogo.js         ricerca, filtri, ordinamento (dati locali)
assets/js/prodotto.js         scheda dinamica da ?id=
assets/js/marchi.js, home.js, contatti.js
assets/js/data.js             dati demo: 23 marchi e 59 prodotti reali
assets/fonts/ assets/img/     font Archivo, immagini + IMAGE_SOURCES.md
src/pages/*.html + tools/build.py   sorgenti delle pagine e generatore
```

Le pagine `.html` in radice sono **generate**: banner demo, filigrana, header e footer sono definiti una volta sola in `tools/build.py`. Dopo ogni modifica a `src/pages/` o a `tools/build.py` esegui `python3 tools/build.py`.

## Eseguire in locale

```
python3 -m http.server 8000   # poi apri http://localhost:8000/
```

## Pubblicare su GitHub Pages

Impostazioni del repository > Pages > "Deploy from a branch" > branch e cartella `/ (root)`. I percorsi sono tutti relativi; `.nojekyll` è già presente. Non è stato eseguito alcun push né alcuna pubblicazione.

## Funzionalità

- Home con hero, famiglie di prodotto, categorie visuali, marchi, risorse per rivenditori, novità, CTA.
- Catalogo: ricerca (senza accenti, più parole), filtri per categoria e marchio con conteggi, ordinamento, stato vuoto, stato nell'URL, pannello filtri su mobile.
- Scheda prodotto dinamica con gestione di id mancante o inesistente; richiesta di prezzo e disponibilità via `mailto:`.
- Marchi con ricerca e filtro per iniziale; pagina rivenditori con richiesta via email; risorse e ultima notizia (l'archivio storico delle comunicazioni 2019-2023 è stato volutamente omesso).
- Banner demo, filigrana "DEMO" (CSS, `pointer-events: none`), attribuzione Tramontis in footer, `prefers-reduced-motion` rispettato.

## Limiti (nessun backend)

- Il catalogo è un **campione di 59 prodotti** del catalogo pubblico, non aggiornato in tempo reale. Nessun prezzo, disponibilità o promozione (sul sito ufficiale i prezzi richiedono il login).
- Il modulo contatti **non invia nulla**: valida e apre un'email precompilata (`mailto:`). Non mostra conferme di invio.
- La ricerca rivenditori non è collegata a un'anagrafica: la pagina porta a una richiesta via email. Da integrare con i dati di Montalbetti.
- Il sito è pensato per sostituire quello attuale: non rimanda al vecchio sito (restano solo i PDF delle informative privacy/cookie in vigore, in `privacy.html`, e una citazione in `note-legali.html`). Accesso ai prezzi, ordini B2B e catalogo completo vanno collegati ai sistemi di Montalbetti in fase di attivazione.
- Nessun carrello, account o checkout.
- La categoria "Abbigliamento" non è stata inclusa: non compare tra le categorie del sito ufficiale.

## Disattivare banner e filigrana (solo con autorizzazione del cliente)

Nel `tools/build.py` togli `{banner()}` e `{watermark()}` dal template in `render()` (e la riga di attribuzione dal footer, se concordato), poi esegui `python3 tools/build.py`.

## Rimuovere `noindex, nofollow` (solo alla pubblicazione ufficiale)

1. In `tools/build.py` elimina la riga `<meta name="robots" content="noindex, nofollow">` e rigenera.
2. Sostituisci `robots.txt` (ora `Disallow: /`) con una versione che consenta la scansione.

Il blocco è stato lasciato attivo.

## Da verificare con Montalbetti prima della consegna

- Dati societari (REA 187652, P.IVA IT 01516830120, capitale sociale 31.200 euro, fax) copiati dal piè di pagina del sito ufficiale.
- Testi di `privacy.html` e `note-legali.html`: bozze tecniche, da far revisionare; fanno fede le informative PDF ufficiali.
- Conteggi di articoli per categoria/marchio (rilevati a ottobre 2026) e frasi sul portale B2B (da una notizia del 2023).
- Logo ufficiale ad alta risoluzione (qui solo wordmark provvisorio).
- Autorizzazione al riuso di foto prodotto e loghi, e alla sede di eventuali immagini aziendali.
- Storia, servizi, numeri aziendali: non inseriti perché non verificabili.
- Notizie: solo l'ultima (21/10/2025) è presentata come attuale; le altre sono archivio storico.

Provenienza e licenze delle immagini: `assets/img/IMAGE_SOURCES.md`.
