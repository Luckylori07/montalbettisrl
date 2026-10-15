/* Catalogo demo: ricerca, filtri per categoria e marchio, ordinamento.
   Lavora solo sui dati locali di assets/js/data.js (campione del catalogo pubblico). */
(function () {
  "use strict";

  var DATA = window.MB_DATA;
  if (!DATA) return;

  var CATS = [
    { key: "componenti", label: "Componenti" },
    { key: "gomme", label: "Gomme e camere d'aria" },
    { key: "accessori", label: "Accessori" },
    { key: "utensili", label: "Utensili e attrezzatura da officina" },
    { key: "pulizia", label: "Pulizia e manutenzione" },
    { key: "reggicicli", label: "Reggicicli e carrelli" }
  ];
  var SORTS = [
    { key: "az", label: "Nome (A-Z)" },
    { key: "za", label: "Nome (Z-A)" },
    { key: "marchio", label: "Marchio" },
    { key: "categoria", label: "Categoria" },
    { key: "novita", label: "Novità in evidenza" }
  ];

  var catLabel = {};
  CATS.forEach(function (c) { catLabel[c.key] = c.label; });
  var brandByslug = {};
  DATA.brands.forEach(function (b) { brandByslug[b.slug] = b; });

  var norm = function (s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };

  DATA.products.forEach(function (p) {
    p._hay = norm([
      p.name, p.tipo, catLabel[p.cat], p.code,
      p.brand && brandByslug[p.brand] ? brandByslug[p.brand].name : "",
      p.desc.join(" ")
    ].join(" "));
    p._name = norm(p.name);
  });

  var els = {
    q: document.getElementById("q"),
    sort: document.getElementById("sort"),
    cats: document.getElementById("filter-cats"),
    brands: document.getElementById("filter-brands"),
    grid: document.getElementById("results"),
    count: document.getElementById("results-count"),
    live: document.getElementById("results-live"),
    active: document.getElementById("active-filters"),
    empty: document.getElementById("empty"),
    emptyReset: document.getElementById("empty-reset"),
    reset: document.getElementById("reset"),
    panel: document.getElementById("filters"),
    openBtn: document.getElementById("filters-open"),
    closeBtns: document.querySelectorAll("[data-filters-close]"),
    scrim: document.getElementById("scrim"),
    form: document.getElementById("search-form")
  };

  var state = { q: "", cat: [], brand: [], sort: "az" };

  /* ---------- URL <-> stato ---------- */
  function readUrl() {
    var u = new URLSearchParams(window.location.search);
    state.q = (u.get("q") || "").slice(0, 80);
    state.cat = (u.get("cat") || "").split(",").filter(function (k) { return catLabel[k]; });
    state.brand = (u.get("brand") || "").split(",").filter(function (k) { return brandByslug[k]; });
    var s = u.get("sort");
    state.sort = SORTS.some(function (x) { return x.key === s; }) ? s : "az";
  }
  function writeUrl() {
    var u = new URLSearchParams();
    if (state.q) u.set("q", state.q);
    if (state.cat.length) u.set("cat", state.cat.join(","));
    if (state.brand.length) u.set("brand", state.brand.join(","));
    if (state.sort !== "az") u.set("sort", state.sort);
    var qs = u.toString();
    try {
      history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
    } catch (e) { /* ambienti senza History API: nessun problema */ }
  }

  /* ---------- Filtro ---------- */
  function matches(p, skip) {
    if (skip !== "q" && state.q) {
      var tokens = norm(state.q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < tokens.length; i++) if (p._hay.indexOf(tokens[i]) === -1) return false;
    }
    if (skip !== "cat" && state.cat.length && state.cat.indexOf(p.cat) === -1) return false;
    if (skip !== "brand" && state.brand.length && state.brand.indexOf(p.brand) === -1) return false;
    return true;
  }

  function sorted(list) {
    var arr = list.slice();
    var byName = function (a, b) { return a._name.localeCompare(b._name, "it", { numeric: true }); };
    var bn = function (p) { return p.brand && brandByslug[p.brand] ? brandByslug[p.brand].name.toLowerCase() : "~"; };
    switch (state.sort) {
      case "za": arr.sort(function (a, b) { return byName(b, a); }); break;
      case "marchio": arr.sort(function (a, b) { return bn(a).localeCompare(bn(b), "it") || byName(a, b); }); break;
      case "categoria": arr.sort(function (a, b) {
        return CATS.findIndex(function (c) { return c.key === a.cat; }) - CATS.findIndex(function (c) { return c.key === b.cat; }) || byName(a, b);
      }); break;
      case "novita": arr.sort(function (a, b) { return (b.nuovo ? 1 : 0) - (a.nuovo ? 1 : 0) || byName(a, b); }); break;
      default: arr.sort(byName);
    }
    return arr;
  }

  /* ---------- Rendering ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function buildCheck(type, name, value, label, n, checked) {
    var l = el("label", "check");
    var i = document.createElement("input");
    i.type = type; i.name = name; i.value = value; i.checked = checked;
    l.appendChild(i);
    l.appendChild(el("span", "", label));
    l.appendChild(el("span", "n", String(n)));
    return l;
  }

  function renderFilters() {
    els.cats.textContent = "";
    CATS.forEach(function (c) {
      var n = DATA.products.filter(function (p) { return p.cat === c.key && matches(p, "cat"); }).length;
      els.cats.appendChild(buildCheck("checkbox", "cat", c.key, c.label, n, state.cat.indexOf(c.key) !== -1));
    });
    els.brands.textContent = "";
    DATA.brands.forEach(function (b) {
      var all = DATA.products.filter(function (p) { return p.brand === b.slug; });
      if (!all.length) return;
      var n = all.filter(function (p) { return matches(p, "brand"); }).length;
      els.brands.appendChild(buildCheck("checkbox", "brand", b.slug, b.name, n, state.brand.indexOf(b.slug) !== -1));
    });
  }

  function productCard(p, n) {
    var li = el("li");
    var art = el("article", "product-card enter");
    art.style.setProperty("--n", n);
    if (p.nuovo) art.appendChild(el("span", "chip chip-new", "Novità"));
    var pimg = el("div", "pimg");
    var img = document.createElement("img");
    img.src = p.img; img.alt = p.name; img.width = 720; img.height = 720; img.loading = "lazy"; img.decoding = "async";
    pimg.appendChild(img);
    art.appendChild(pimg);
    var body = el("div", "pbody");
    var meta = el("div", "pmeta");
    var b = p.brand && brandByslug[p.brand];
    meta.appendChild(el("span", "chip", b ? b.name : catLabel[p.cat]));
    meta.appendChild(el("span", "", p.tipo));
    body.appendChild(meta);
    var h = el("h2");
    var a = el("a", "", p.name);
    a.href = "prodotto.html?id=" + encodeURIComponent(p.id);
    h.appendChild(a);
    body.appendChild(h);
    body.appendChild(el("p", "pfoot", catLabel[p.cat]));
    art.appendChild(body);
    li.appendChild(art);
    return li;
  }

  function renderActive() {
    els.active.textContent = "";
    var add = function (label, onRemove, aria) {
      var s = el("span", "pill");
      s.appendChild(document.createTextNode(label));
      var b = el("button");
      b.type = "button";
      b.setAttribute("aria-label", aria);
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
      b.addEventListener("click", onRemove);
      s.appendChild(b);
      els.active.appendChild(s);
    };
    if (state.q) add("Ricerca: " + state.q, function () { state.q = ""; els.q.value = ""; refresh(true); }, "Rimuovi la ricerca");
    state.cat.forEach(function (k) {
      add(catLabel[k], function () { state.cat = state.cat.filter(function (x) { return x !== k; }); refresh(true); }, "Rimuovi il filtro " + catLabel[k]);
    });
    state.brand.forEach(function (k) {
      add(brandByslug[k].name, function () { state.brand = state.brand.filter(function (x) { return x !== k; }); refresh(true); }, "Rimuovi il filtro " + brandByslug[k].name);
    });
  }

  function refresh(rebuildFilters) {
    var list = sorted(DATA.products.filter(function (p) { return matches(p); }));
    els.grid.textContent = "";
    var frag = document.createDocumentFragment();
    list.forEach(function (p, i) { frag.appendChild(productCard(p, i)); });
    els.grid.appendChild(frag);
    els.grid.hidden = list.length === 0;
    els.empty.hidden = list.length !== 0;
    var msg = list.length === 1 ? "1 prodotto" : list.length + " prodotti";
    els.count.textContent = msg + " su " + DATA.products.length + " nella demo";
    els.live.textContent = list.length === 0 ? "Nessun risultato." : msg + " trovati.";
    var any = state.q || state.cat.length || state.brand.length;
    els.reset.hidden = !any;
    renderActive();
    if (rebuildFilters) renderFilters();
    writeUrl();
  }

  /* ---------- Eventi ---------- */
  function syncFromChecks() {
    state.cat = [].map.call(els.cats.querySelectorAll("input:checked"), function (i) { return i.value; });
    state.brand = [].map.call(els.brands.querySelectorAll("input:checked"), function (i) { return i.value; });
  }
  function onFilterChange() {
    var focused = document.activeElement;
    var key = focused && focused.name === "cat" ? ["cat", focused.value] : focused && focused.name === "brand" ? ["brand", focused.value] : null;
    syncFromChecks();
    refresh(true);
    if (key) {
      var again = (key[0] === "cat" ? els.cats : els.brands).querySelector('input[value="' + key[1] + '"]');
      if (again) again.focus();
    }
  }
  els.cats.addEventListener("change", onFilterChange);
  els.brands.addEventListener("change", onFilterChange);

  var timer;
  els.q.addEventListener("input", function () {
    state.q = els.q.value.trim();
    clearTimeout(timer);
    timer = setTimeout(function () { refresh(true); }, 120);
  });
  els.form.addEventListener("submit", function (e) {
    e.preventDefault();
    state.q = els.q.value.trim();
    refresh(true);
  });

  SORTS.forEach(function (s) {
    var o = document.createElement("option");
    o.value = s.key; o.textContent = s.label;
    els.sort.appendChild(o);
  });
  els.sort.addEventListener("change", function () { state.sort = els.sort.value; refresh(false); });

  function resetAll() {
    state.q = ""; state.cat = []; state.brand = []; state.sort = "az";
    els.q.value = ""; els.sort.value = "az";
    refresh(true);
    els.q.focus();
  }
  els.reset.addEventListener("click", resetAll);
  els.emptyReset.addEventListener("click", resetAll);

  /* ---------- Pannello filtri su mobile ---------- */
  var lastFocus = null;
  function setPanel(open) {
    els.panel.classList.toggle("is-open", open);
    els.scrim.classList.toggle("is-on", open);
    els.openBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("filters-lock", open);
    if (open) {
      lastFocus = document.activeElement;
      var first = els.panel.querySelector("button, input");
      if (first) first.focus();
    } else if (lastFocus) {
      lastFocus.focus();
      lastFocus = null;
    }
  }
  els.openBtn.addEventListener("click", function () { setPanel(true); });
  [].forEach.call(els.closeBtns, function (b) { b.addEventListener("click", function () { setPanel(false); }); });
  els.scrim.addEventListener("click", function () { setPanel(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && els.panel.classList.contains("is-open")) setPanel(false);
  });
  window.matchMedia("(min-width: 961px)").addEventListener
    ? window.matchMedia("(min-width: 961px)").addEventListener("change", function (m) { if (m.matches) setPanel(false); })
    : null;

  /* ---------- Avvio ---------- */
  readUrl();
  els.q.value = state.q;
  els.sort.value = state.sort;
  renderFilters();
  refresh(false);
})();
