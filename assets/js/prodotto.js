/* Dettaglio prodotto: una sola pagina, il prodotto arriva da ?id=<identificativo>. */
(function () {
  "use strict";

  var DATA = window.MB_DATA;
  var root = document.getElementById("product-root");
  if (!DATA || !root) return;

  var CAT = {
    componenti: "Componenti",
    gomme: "Gomme e camere d'aria",
    accessori: "Accessori",
    utensili: "Utensili e attrezzatura da officina",
    pulizia: "Pulizia e manutenzione",
    reggicicli: "Reggicicli e carrelli"
  };
  var brands = {};
  DATA.brands.forEach(function (b) { brands[b.slug] = b; });

  var id = new URLSearchParams(window.location.search).get("id") || "";
  var p = DATA.products.filter(function (x) { return x.id === id; })[0];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var ICON = function (name, cls) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "i " + (cls || ""));
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    var u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttribute("href", "#i-" + name);
    s.appendChild(u);
    return s;
  };

  root.textContent = "";

  if (!p) {
    document.title = "Prodotto non trovato - Montalbetti S.r.l. (demo)";
    var box = el("div", "empty");
    box.appendChild(ICON("search"));
    box.querySelector("svg").setAttribute("style", "width:64px;height:64px");
    box.appendChild(el("h1", "", "Prodotto non trovato"));
    box.appendChild(el("p", "", id
      ? "Non esiste nessun prodotto con l'identificativo “" + id.slice(0, 60) + "” nel catalogo dimostrativo. Il link potrebbe essere errato o il prodotto non far parte del campione."
      : "Manca l'identificativo del prodotto. Torna al catalogo e scegli una scheda."));
    var a = el("a", "btn btn-accent", "Torna al catalogo");
    a.href = "catalogo.html";
    box.appendChild(a);
    root.appendChild(box);
    var bc = document.getElementById("bc-current");
    if (bc) bc.textContent = "Prodotto non trovato";
    return;
  }

  document.title = p.name + " - Montalbetti S.r.l. (demo)";
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", p.name + ": scheda di esempio del catalogo Montalbetti S.r.l. (demo).");
  var bcEl = document.getElementById("bc-current");
  if (bcEl) bcEl.textContent = p.name;

  var b = p.brand ? brands[p.brand] : null;

  var wrap = el("div", "pd");

  var media = el("div", "pd-media");
  var img = document.createElement("img");
  img.src = p.img; img.alt = p.name; img.width = 720; img.height = 720;
  media.appendChild(img);
  wrap.appendChild(media);

  var info = el("div", "pd-info");
  var tags = el("div", "pd-tags");
  tags.appendChild(el("span", "chip", CAT[p.cat]));
  if (p.tipo) tags.appendChild(el("span", "chip", p.tipo));
  if (p.nuovo) tags.appendChild(el("span", "chip chip-new", "Novità"));
  info.appendChild(tags);
  info.appendChild(el("h1", "", p.name));

  var spec = el("dl", "spec");
  var row = function (k, v, href) {
    var d = el("div");
    d.appendChild(el("dt", "", k));
    var dd = el("dd");
    if (href) {
      var a = el("a", "", v);
      a.href = href;
      dd.appendChild(a);
    } else dd.textContent = v;
    d.appendChild(dd);
    spec.appendChild(d);
  };
  row("Categoria", CAT[p.cat], "catalogo.html?cat=" + p.cat);
  if (b) row("Marchio", b.name, "catalogo.html?brand=" + b.slug);
  if (p.code) row("Codice articolo", p.code);
  info.appendChild(spec);

  if (p.desc && p.desc.length) {
    info.appendChild(el("h2", "h3", "Caratteristiche"));
    var ul = el("ul", "pd-desc");
    ul.style.marginTop = "12px";
    p.desc.forEach(function (line) { ul.appendChild(el("li", "", line)); });
    info.appendChild(ul);
  }

  var actions = el("div", "pd-actions");
  var subject = "Richiesta informazioni: " + p.name + (p.code ? " (" + p.code + ")" : "");
  var body = "Buongiorno,\n\nvorrei ricevere informazioni sul prodotto:\n" + p.name + (p.code ? "\nCodice: " + p.code : "") + "\n\nGrazie.";
  var ask = el("a", "btn btn-accent");
  ask.href = "mailto:info@montalbettisrl.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  ask.appendChild(document.createTextNode("Richiedi prezzo e disponibilità"));
  ask.appendChild(ICON("mail"));
  actions.appendChild(ask);
  info.appendChild(actions);

  var note = el("div", "price-note");
  note.appendChild(ICON("lock"));
  var np = el("p");
  np.innerHTML = "<b>Prezzi riservati ai clienti registrati.</b> Per prezzo e disponibilità di questo articolo scrivi a Montalbetti o <a href=\"contatti.html\">richiedi l'accesso</a>.";
  note.appendChild(np);
  info.appendChild(note);
  wrap.appendChild(info);
  root.appendChild(wrap);

  /* Prodotti correlati: stessa categoria */
  var related = DATA.products.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
  var rel = document.getElementById("related");
  if (rel && related.length) {
    var grid = rel.querySelector(".product-grid");
    related.forEach(function (r) {
      var li = el("li");
      var art = el("article", "product-card");
      var pimg = el("div", "pimg");
      var im = document.createElement("img");
      im.src = r.img; im.alt = r.name; im.width = 720; im.height = 720; im.loading = "lazy";
      pimg.appendChild(im);
      art.appendChild(pimg);
      var bd = el("div", "pbody");
      var h = el("h3");
      var a = el("a", "", r.name);
      a.href = "prodotto.html?id=" + encodeURIComponent(r.id);
      h.appendChild(a);
      bd.appendChild(h);
      bd.appendChild(el("p", "pfoot", r.tipo));
      art.appendChild(bd);
      li.appendChild(art);
      grid.appendChild(li);
    });
    rel.hidden = false;
  }
})();
