/* Modulo contatti senza backend: valida i campi e prepara un'email precompilata (mailto:).
   Non invia nulla e non mostra mai conferme di invio. */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var TO = "info@montalbettisrl.com";

  var rules = {
    nome: function (v) { return v.trim().length >= 2 ? "" : "Inserisci il tuo nome."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Inserisci un indirizzo email valido, ad esempio nome@azienda.it."; },
    messaggio: function (v) { return v.trim().length >= 10 ? "" : "Scrivi un messaggio di almeno 10 caratteri."; },
    privacy: function (v, el) { return el.checked ? "" : "Conferma di aver letto l'informativa sulla privacy."; }
  };

  function setError(field, msg) {
    var wrap = field.closest(".field");
    var err = wrap.querySelector(".error");
    wrap.classList.toggle("invalid", !!msg);
    if (msg) {
      err.textContent = msg;
      field.setAttribute("aria-invalid", "true");
    } else {
      err.textContent = "";
      field.removeAttribute("aria-invalid");
    }
  }
  function check(name) {
    var f = form.elements[name];
    var msg = rules[name](f.value || "", f);
    setError(f, msg);
    return !msg;
  }

  Object.keys(rules).forEach(function (n) {
    var f = form.elements[n];
    f.addEventListener("blur", function () { if (f.value || f.type === "checkbox") check(n); });
    f.addEventListener("input", function () { if (f.closest(".field").classList.contains("invalid")) check(n); });
    f.addEventListener("change", function () { if (f.closest(".field").classList.contains("invalid")) check(n); });
  });

  function show(kind, html) {
    status.hidden = false;
    status.className = "form-status " + kind;
    status.innerHTML = html;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (n) {
      if (!check(n) && !firstBad) firstBad = form.elements[n];
    });
    if (firstBad) {
      show("error", "<b>Controlla i campi evidenziati.</b> Il messaggio non è stato preparato.");
      firstBad.focus();
      return;
    }
    var v = function (n) { return (form.elements[n].value || "").trim(); };
    var subject = v("oggetto") + (v("azienda") ? " - " + v("azienda") : "");
    var lines = [
      v("messaggio"), "",
      "---",
      "Nome: " + v("nome"),
      v("azienda") ? "Azienda: " + v("azienda") : "",
      "Email: " + v("email"),
      v("telefono") ? "Telefono: " + v("telefono") : ""
    ].filter(function (l, i, a) { return !(l === "" && a[i - 1] === ""); });
    var href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\r\n"));
    show("info",
      "<b>Email preparata, non ancora inviata.</b> Abbiamo aperto il tuo programma di posta con il messaggio già compilato: " +
      "per inviarlo premi “Invia” lì. Se non si è aperto nulla, <a href=\"" + href.replace(/"/g, "&quot;") + "\">usa questo link</a> " +
      "oppure scrivi direttamente a <a href=\"mailto:" + TO + "\">" + TO + "</a>.");
    window.location.href = href;
  });
})();
