/* Home: marchi in evidenza e novita, dai dati locali. */
(function () {
  "use strict";
  var DATA = window.MB_DATA;
  if (!DATA) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var FEATURED = ["rubena", "ryde", "unior", "sks-germany", "basil", "racktime", "tubus", "ergotec", "stronglight", "sapim", "magped", "widek"];
  var by = {};
  DATA.brands.forEach(function (b) { by[b.slug] = b; });
  var grid = document.getElementById("home-brands");
  if (grid) {
    FEATURED.forEach(function (slug) {
      var b = by[slug];
      if (!b) return;
      var li = el("li");
      var a = el("a", "brand-tile");
      a.href = b.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", b.name + ": pagina ufficiale nel catalogo Montalbetti (si apre in una nuova scheda)");
      var logo = el("span", "brand-logo");
      var img = document.createElement("img");
      img.src = b.logo; img.alt = ""; img.width = b.w; img.height = b.h; img.loading = "lazy";
      logo.appendChild(img);
      a.appendChild(logo);
      var meta = el("span", "brand-meta");
      meta.appendChild(el("b", "", b.name));
      meta.appendChild(el("span", "", b.count + " articoli"));
      a.appendChild(meta);
      li.appendChild(a);
      grid.appendChild(li);
    });
  }

  var rail = document.getElementById("home-new");
  if (rail) {
    DATA.products.filter(function (p) { return p.nuovo; }).forEach(function (p) {
      var li = el("li");
      var art = el("article", "product-card");
      art.appendChild(el("span", "chip chip-new", "Novità"));
      var pimg = el("div", "pimg");
      var img = document.createElement("img");
      img.src = p.img; img.alt = p.name; img.width = 720; img.height = 720; img.loading = "lazy";
      pimg.appendChild(img);
      art.appendChild(pimg);
      var body = el("div", "pbody");
      body.appendChild(el("div", "pmeta", p.tipo));
      var h = el("h3");
      var a = el("a", "", p.name);
      a.href = "prodotto.html?id=" + encodeURIComponent(p.id);
      h.appendChild(a);
      body.appendChild(h);
      art.appendChild(body);
      li.appendChild(art);
      rail.appendChild(li);
    });
  }
})();
