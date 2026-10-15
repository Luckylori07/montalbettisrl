/* Pagina marchi: elenco dei 23 marchi del catalogo, filtro per iniziale e ricerca. */
(function () {
  "use strict";

  var DATA = window.MB_DATA;
  var grid = document.getElementById("brand-list");
  if (!DATA || !grid) return;

  var norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var demoCount = {};
  DATA.products.forEach(function (p) { if (p.brand) demoCount[p.brand] = (demoCount[p.brand] || 0) + 1; });

  var brands = DATA.brands.slice().sort(function (a, b) { return a.name.localeCompare(b.name, "it"); });
  var state = { letter: "", q: "" };

  var qEl = document.getElementById("brand-q");
  var lettersEl = document.getElementById("letters");
  var countEl = document.getElementById("brand-count");
  var emptyEl = document.getElementById("brand-empty");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* iniziali presenti */
  var initials = [];
  brands.forEach(function (b) {
    var l = b.name.charAt(0).toUpperCase();
    if (initials.indexOf(l) === -1) initials.push(l);
  });
  function letterBtn(label, value) {
    var b = el("button", "", label);
    b.type = "button";
    b.setAttribute("aria-pressed", String(state.letter === value));
    b.dataset.letter = value;
    return b;
  }
  function renderLetters() {
    lettersEl.textContent = "";
    lettersEl.appendChild(letterBtn("Tutti", ""));
    initials.forEach(function (l) { lettersEl.appendChild(letterBtn(l, l)); });
  }

  function render() {
    var list = brands.filter(function (b) {
      if (state.letter && b.name.charAt(0).toUpperCase() !== state.letter) return false;
      if (state.q && norm(b.name).indexOf(norm(state.q)) === -1) return false;
      return true;
    });
    grid.textContent = "";
    list.forEach(function (b) {
      var li = el("li");
      var card = el("article", "brand-tile-wrap");
      card.id = b.slug;
      var logo = el("div", "brand-logo");
      var img = document.createElement("img");
      img.src = b.logo; img.alt = "Logo " + b.name; img.loading = "lazy"; img.width = b.w; img.height = b.h;
      logo.appendChild(img);
      card.appendChild(logo);
      var meta = el("div", "brand-meta");
      meta.appendChild(el("b", "", b.name));
      meta.appendChild(el("span", "", b.count + (b.count === 1 ? " articolo" : " articoli")));
      card.appendChild(meta);
      var links = el("div", "links");
      if (demoCount[b.slug]) {
        var demo = el("a", "", "Vedi i prodotti (" + demoCount[b.slug] + ")");
        demo.href = "catalogo.html?brand=" + b.slug;
        links.appendChild(demo);
      } else {
        var ask = el("a", "", "Richiedi informazioni");
        ask.href = "mailto:info@montalbettisrl.com?subject=" + encodeURIComponent("Informazioni sul marchio " + b.name);
        links.appendChild(ask);
      }
      card.appendChild(links);
      li.appendChild(card);
      grid.appendChild(li);
    });
    countEl.textContent = list.length === 1 ? "1 marchio" : list.length + " marchi";
    grid.hidden = list.length === 0;
    emptyEl.hidden = list.length !== 0;
  }

  lettersEl.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    state.letter = b.dataset.letter;
    [].forEach.call(lettersEl.children, function (c) { c.setAttribute("aria-pressed", String(c.dataset.letter === state.letter)); });
    render();
  });
  qEl.addEventListener("input", function () { state.q = qEl.value.trim(); render(); });
  document.getElementById("brand-form").addEventListener("submit", function (e) { e.preventDefault(); });
  document.getElementById("brand-reset").addEventListener("click", function () {
    state = { letter: "", q: "" };
    qEl.value = "";
    renderLetters();
    render();
  });

  renderLetters();
  render();
})();
