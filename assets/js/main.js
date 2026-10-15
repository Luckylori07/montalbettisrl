/* Montalbetti S.r.l. - proposta di sito (DEMO Tramontis)
   Comportamenti comuni: menu mobile, header, rivelazione allo scroll, hero, quadrante. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var mqMobile = window.matchMedia("(max-width: 920px)");

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    document.body.classList.toggle("nav-lock", open && mqMobile.matches);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    (mqMobile.addEventListener ? mqMobile.addEventListener.bind(mqMobile, "change") : mqMobile.addListener.bind(mqMobile))(function () {
      setNav(false);
    });
  }

  /* ---------- Header: ombra quando si scorre ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Rivelazione allo scroll ---------- */
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Hero: leggera profondita sull'immagine ---------- */
  var heroImg = document.querySelector(".hero-bg img");
  if (heroImg && !reduceMotion) {
    var hero = heroImg.closest(".hero");
    var ticking = false;
    var update = function () {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      if (rect.bottom < 0) return;
      var y = Math.min(Math.max(-rect.top, 0), rect.height);
      heroImg.style.transform = "translate3d(0," + (y * 0.12).toFixed(1) + "px,0)";
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ---------- Quadrante: 24 tacche, una per marchio ---------- */
  var gauge = document.querySelector(".gauge");
  if (gauge) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { gauge.classList.add("is-live"); });
    });
  }
})();
