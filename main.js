(function () {
  "use strict";

  var EMAIL = "bethelkonate2023@gmail.com";
  var WHATSAPP = "2250758792721";

  function $(id) { return document.getElementById(id); }
  function enc(s) { return encodeURIComponent(s); }
  try { document.documentElement.lang = "fr"; } catch (e) {}
  $("year").textContent = String(new Date().getFullYear());

  /* ---------- Toast et copie ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1900);
  }
  function fallbackCopy(text, ok) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta); ta.select();
    var done = false;
    try { done = document.execCommand("copy"); } catch (e) { done = false; }
    ta.parentNode.removeChild(ta);
    if (done) { ok(); } else { toast("Sélectionnez le texte pour le copier"); }
  }
  function copyText(text) {
    var ok = function () { toast("Copié"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { fallbackCopy(text, ok); });
    } else { fallbackCopy(text, ok); }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-copy]") : null;
    if (b) { copyText(b.getAttribute("data-copy")); }
  });

  /* ---------- Thème clair / sombre ---------- */
  (function () {
    var root = document.documentElement, btn = $("theme-btn");
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    function stored() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
    function save(v) { try { localStorage.setItem("theme", v); } catch (e) {} }
    function effective() {
      var a = root.getAttribute("data-theme");
      if (a === "dark" || a === "light") { return a; }
      return mq && mq.matches ? "dark" : "light";
    }
    function sync() {
      var t = effective();
      btn.setAttribute("data-mode", t);
      btn.setAttribute("aria-label", t === "dark" ? "Passer au thème clair" : "Passer au thème sombre");
    }
    var s = stored();
    if (s === "dark" || s === "light") { root.setAttribute("data-theme", s); }
    sync();
    btn.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.classList.add("theme-anim");
      root.setAttribute("data-theme", next);
      save(next); sync();
      setTimeout(function () { root.classList.remove("theme-anim"); }, 450);
    });
    if (mq && mq.addEventListener) { mq.addEventListener("change", sync); }
    if (window.MutationObserver) {
      new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    }
  })();

  /* ---------- Menu mobile et section active ---------- */
  (function () {
    var nav = $("nav"), mb = $("menu-btn");
    function close() { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); mb.setAttribute("aria-label", "Ouvrir le menu"); }
    mb.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      mb.setAttribute("aria-expanded", open ? "true" : "false");
      mb.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { close(); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); } });

    if (!("IntersectionObserver" in window)) { return; }
    var links = nav.querySelectorAll("a");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        for (var i = 0; i < links.length; i++) {
          links[i].removeAttribute("aria-current");
          if (links[i].getAttribute("href") === "#" + en.target.id) { links[i].setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["profil", "parcours", "competences", "projet", "certifications", "contact"].forEach(function (id) {
      var el = $(id); if (el) { io.observe(el); }
    });
  })();

  /* ---------- Survol : halo qui suit le curseur et portrait incliné (souris seulement) ---------- */
  (function () {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) { return; }

    function followPointer(zone) {
      var frame = 0, x = 0, y = 0;
      zone.addEventListener("pointermove", function (e) {
        var r = zone.getBoundingClientRect();
        x = e.clientX - r.left; y = e.clientY - r.top;
        if (frame) { return; }
        frame = requestAnimationFrame(function () {
          frame = 0;
          zone.style.setProperty("--mx", x.toFixed(0) + "px");
          zone.style.setProperty("--my", y.toFixed(0) + "px");
        });
      });
    }
    var zones = document.querySelectorAll(".hero, .sec-dark");
    for (var i = 0; i < zones.length; i++) { followPointer(zones[i]); }

    var box = document.querySelector(".portrait"), arch = document.querySelector(".arch");
    if (box && arch) {
      var tick = 0, px = 0, py = 0;
      box.addEventListener("pointermove", function (e) {
        var r = box.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
        if (tick) { return; }
        tick = requestAnimationFrame(function () {
          tick = 0;
          arch.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
          arch.style.setProperty("--rx", (-py * 8).toFixed(2) + "deg");
        });
      });
      box.addEventListener("pointerleave", function () {
        cancelAnimationFrame(tick); tick = 0;
        arch.style.setProperty("--rx", "0deg");
        arch.style.setProperty("--ry", "0deg");
      });
    }
  })();

  /* ---------- Certificats : liste déroulante horizontale, filtre et aperçu ---------- */
  (function () {
    var box = $("cert-dd"), toggle = $("cert-toggle"), menu = $("cert-menu");
    var label = $("cert-toggle-label"), count = $("cert-count"), grid = $("cert-grid");
    if (!box || !toggle || !menu || !label || !count || !grid) { return; }
    var items = Array.prototype.slice.call(menu.querySelectorAll(".dropdown-item"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".cert"));

    function isOpen() { return box.classList.contains("open"); }
    function setOpen(open) {
      box.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    function clearPreview() {
      grid.removeAttribute("data-preview");
      cards.forEach(function (c) { c.classList.remove("is-preview"); });
    }
    function preview(item) {
      var f = item.getAttribute("data-filter"), target = null;
      if (f !== "all") {
        cards.forEach(function (c) { if (c.getAttribute("data-id") === f && !c.hidden) { target = c; } });
      }
      clearPreview();
      if (!target) { return; }
      grid.setAttribute("data-preview", "1");
      target.classList.add("is-preview");
    }
    function choose(item) {
      var f = item.getAttribute("data-filter"), shown = 0;
      items.forEach(function (it) {
        var on = it === item;
        it.classList.toggle("active", on);
        it.setAttribute("aria-selected", on ? "true" : "false");
      });
      cards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-id") === f;
        c.hidden = !show;
        c.classList.remove("enter");
        if (show) { shown++; void c.offsetWidth; c.classList.add("enter"); }
      });
      label.textContent = f === "all" ? "Tous les certificats" : item.textContent;
      count.textContent = shown + (shown > 1 ? " certificats" : " certificat");
      clearPreview();
      setOpen(false);
      toggle.focus();
    }

    toggle.addEventListener("click", function () { setOpen(!isOpen()); });
    document.addEventListener("click", function (e) { if (isOpen() && !box.contains(e.target)) { setOpen(false); } });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { setOpen(false); toggle.focus(); }
    });
    items.forEach(function (it, i) {
      it.addEventListener("click", function () { choose(it); });
      it.addEventListener("mouseenter", function () { preview(it); });
      it.addEventListener("focus", function () { preview(it); });
      it.addEventListener("mouseleave", clearPreview);
      it.addEventListener("blur", clearPreview);
      it.addEventListener("keydown", function (e) {
        var k = e.key, next = -1;
        if (k === "ArrowRight" || k === "ArrowDown") { next = (i + 1) % items.length; }
        else if (k === "ArrowLeft" || k === "ArrowUp") { next = (i - 1 + items.length) % items.length; }
        else if (k === "Home") { next = 0; }
        else if (k === "End") { next = items.length - 1; }
        if (next >= 0) { e.preventDefault(); items[next].focus(); }
      });
    });
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && !isOpen()) {
        e.preventDefault(); setOpen(true);
        var active = menu.querySelector(".dropdown-item.active") || items[0];
        setTimeout(function () { active.focus(); }, 40);
      }
    });

    /* Halo qui suit le curseur sur les cartes (souris seulement) */
    if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
      cards.forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          var r = c.getBoundingClientRect();
          c.style.setProperty("--px", (e.clientX - r.left).toFixed(0) + "px");
          c.style.setProperty("--py", (e.clientY - r.top).toFixed(0) + "px");
        });
      });
    }
  })();

  /* ---------- Formulaire ---------- */
  (function () {
    var form = $("contact-form"), done = $("done");
    var fields = {
      nom: { el: $("f-nom"), err: $("e-nom"), msg: "Indiquez votre nom." },
      email: { el: $("f-email"), err: $("e-email"), msg: "Indiquez une adresse e-mail valide, par exemple nom@exemple.com." },
      sujet: { el: $("f-sujet"), err: $("e-sujet"), msg: "Indiquez le sujet de votre message." },
      message: { el: $("f-message"), err: $("e-message"), msg: "Écrivez votre message (10 caractères minimum)." }
    };
    var fullText = "";

    function valid(key, v) {
      if (key === "email") { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
      if (key === "message") { return v.length >= 10; }
      return v.length > 0;
    }
    function setError(key, bad) {
      var f = fields[key];
      f.err.textContent = bad ? f.msg : "";
      if (bad) { f.el.setAttribute("aria-invalid", "true"); } else { f.el.removeAttribute("aria-invalid"); }
    }
    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener("input", function () {
        if (fields[key].el.getAttribute("aria-invalid") === "true" && valid(key, fields[key].el.value.trim())) { setError(key, false); }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var first = null, vals = {};
      Object.keys(fields).forEach(function (key) {
        var v = fields[key].el.value.trim(); vals[key] = v;
        var bad = !valid(key, v);
        setError(key, bad);
        if (bad && !first) { first = fields[key].el; }
      });
      if (first) { first.focus(); return; }

      fullText = "Objet : " + vals.sujet + "\n\n" + vals.message + "\n\n" + vals.nom + "\n" + vals.email;
      $("done-preview").textContent = fullText;
      $("done-wa").href = "https://wa.me/" + WHATSAPP + "?text=" + enc(fullText);
      $("done-mail").href = "mailto:" + EMAIL + "?subject=" + enc(vals.sujet) + "&body=" + enc(vals.message + "\n\n" + vals.nom + "\n" + vals.email);

      form.hidden = true; done.hidden = false; done.focus();
    });

    $("done-copy").addEventListener("click", function () { copyText(fullText); });
    $("done-edit").addEventListener("click", function () {
      done.hidden = true; form.hidden = false; fields.message.el.focus();
    });
  })();
})();
