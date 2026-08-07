/* ═══════════════════════════════════════════════
   SPORTRADE — Interacciones y animaciones
   ═══════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ───── Idioma (ES · EN · ET) ─────
     El HTML viene en español; el diccionario reemplaza los textos marcados
     con data-i18n. La elección se guarda en localStorage. */
  var LANGS = ["es", "en", "et"];
  var dict = window.SPORTRADE_I18N || {};

  function applyLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = "es";
    var table = dict[lang];
    if (!table) return;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = table[el.dataset.i18n];
      if (typeof val === "string") el.innerHTML = val;
    });
    // Marcadores de posición de los campos de formulario
    document.querySelectorAll("[data-ph]").forEach(function (el) {
      var val = table[el.dataset.ph];
      if (typeof val === "string") el.placeholder = val;
    });

    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    try { localStorage.setItem("sportrade-lang", lang); } catch (e) {}

    // El selector de dirección guarda su etiqueta traducida en el campo oculto
    var activeDir = document.querySelector(".dir-btn.active");
    if (activeDir) {
      var hidden = document.getElementById("direccionInput");
      if (hidden) hidden.value = activeDir.textContent.trim();
    }
  }

  var saved = null;
  try { saved = localStorage.getItem("sportrade-lang"); } catch (e) {}
  if (!saved) {
    var nav0 = (navigator.language || "es").slice(0, 2).toLowerCase();
    saved = LANGS.indexOf(nav0) > -1 ? nav0 : "es";
  }
  applyLang(saved);

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLang(btn.dataset.lang); });
  });

  /* ───── Preloader ───── */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("preloader").classList.add("done");
    }, 900);
  });
  // Failsafe por si 'load' tarda demasiado (imágenes remotas lentas)
  setTimeout(function () {
    document.getElementById("preloader").classList.add("done");
  }, 4000);

  /* ───── Ticker de mercado ───── */
  var tickerData = [
    { s: "BTC/USD", v: "$118,240", d: 1.45 },
    { s: "ETH/USD", v: "$4,386", d: 2.12 },
    { s: "USDC/USD", v: "1.0001", d: 0.00 },
    { s: "USDT/USD", v: "0.9998", d: -0.01 },
    { s: "SOL/USD", v: "$212.40", d: 3.08 },
    { s: "USD/COP", v: "4,087.50", d: -0.42 },
    { s: "EUR/USD", v: "1.0864", d: 0.18 },
    { s: "USD/MXN", v: "17.92", d: -0.11 },
    { s: "USDC/COP", v: "4,089.10", d: -0.40 },
    { s: "BTC/COP", v: "483.2M", d: 1.02 },
    { s: "ORO", v: "$2,481/oz", d: 0.27 },
    { s: "S&P 500", v: "6,412.20", d: 0.64 }
  ];
  var track = document.getElementById("tickerTrack");
  var tickerHtml = "";
  // Duplicado para scroll continuo
  for (var r = 0; r < 2; r++) {
    tickerData.forEach(function (t) {
      var cls = t.d >= 0 ? "tick-up" : "tick-down";
      var sign = t.d >= 0 ? "▲" : "▼";
      tickerHtml += "<span>" + t.s + "<b>" + t.v + "</b><span class='" + cls + "'>" + sign + " " + Math.abs(t.d).toFixed(2) + "%</span></span>";
    });
  }
  track.innerHTML = tickerHtml;

  /* ───── Nav: estado scrolled + menú móvil ───── */
  var nav = document.getElementById("nav");
  var ticker = document.querySelector(".market-ticker");
  window.addEventListener("scroll", function () {
    var scrolled = window.scrollY > 40;
    nav.classList.toggle("scrolled", scrolled);
    ticker.classList.toggle("hidden", scrolled);
  }, { passive: true });

  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", function () {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
    nav.classList.toggle("menu-open", navLinks.classList.contains("open"));
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
      nav.classList.remove("menu-open");
    });
  });

  /* ───── Canvas: red de nodos financieros en el hero ───── */
  var canvas = document.getElementById("heroCanvas");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var mouse = { x: -9999, y: -9999 };

  function sizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function initParticles() {
    particles = [];
    var count = Math.min(70, Math.floor(canvas.offsetWidth / 22));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.5
      });
    }
  }
  initParticles();

  canvas.parentElement.parentElement.addEventListener("mousemove", function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function drawParticles() {
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // Atracción sutil al cursor
      var dxm = mouse.x - p.x, dym = mouse.y - p.y;
      var dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 160) { p.x += dxm * 0.004; p.y += dym * 0.004; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201,169,106,0.7)";
      ctx.fill();

      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(201,169,106," + (0.14 * (1 - d / 130)) + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ───── Reveal on scroll ───── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal, .reveal-img").forEach(function (el) { io.observe(el); });

  /* ───── Contadores animados ───── */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    // data-prefix llega HTML-escapado (&lt;) desde el atributo — el DOM ya lo decodifica
    var dur = 1800;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      var val = target * eased;
      // en-US: separador de miles con coma, para que las cifras en USD
      // coincidan con el formato del panel ($394,825) y no se lean como decimales.
      var text = decimals > 0
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString("en-US");
      el.textContent = prefix + text + suffix;
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        el.dataset.counted = "1";
      }
    }
    requestAnimationFrame(frame);
  }
  /* ───── Cifra en vivo: conversiones totales ─────
     Consulta el volumen bruto gestionado desde el panel interno y actualiza
     los contadores marcados con [data-live-total].

     CONFIGURACIÓN: escriba abajo el dominio donde vive el endpoint, sin barra
     final. Ejemplo: "https://panel.sportrade.co"
     Si se deja vacío, el sitio muestra el valor estático de data-count y no
     hace ninguna petición. */
  var PANEL_ORIGIN = "https://guru-master-control.ai.studio";
  var TOTAL_ENDPOINT = "/api/public/fintech/total-income";

  function refreshLiveTotal() {
    if (!PANEL_ORIGIN) return;
    fetch(PANEL_ORIGIN + TOTAL_ENDPOINT, { headers: { "Accept": "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var valor = Number(data.totalIncome);
        if (!isFinite(valor) || valor <= 0) throw new Error("valor inválido");
        document.querySelectorAll("[data-live-total]").forEach(function (el) {
          el.dataset.count = valor;
          // Si el contador ya terminó su animación, refresca el texto en el acto.
          if (el.dataset.counted === "1") {
            el.textContent = (el.dataset.prefix || "") + Math.round(valor).toLocaleString("en-US");
          }
        });
      })
      .catch(function () {
        /* Sin conexión o endpoint caído: se conserva el valor estático. */
      });
  }
  refreshLiveTotal();
  setInterval(refreshLiveTotal, 300000); // refresca cada 5 minutos

  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) { counterIO.observe(el); });

  /* ───── Gráfico de flujo de caja (SVG animado) ───── */
  function buildChart() {
    var svg = document.getElementById("cashChart");
    var W = 640, H = 220, PAD = 14;

    function series(seed, amp, base) {
      var pts = [];
      for (var i = 0; i <= 24; i++) {
        var x = PAD + (i / 24) * (W - PAD * 2);
        var y = base
          - Math.sin(i * 0.55 + seed) * amp * 0.5
          - Math.sin(i * 0.21 + seed * 2) * amp * 0.35
          - i * 1.6
          + (Math.sin(i * 1.7 + seed * 3) * amp * 0.18);
        pts.push([x, Math.max(PAD, Math.min(H - PAD, y))]);
      }
      return pts;
    }
    function toPath(pts) {
      var d = "M" + pts[0][0] + "," + pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        var prev = pts[i - 1], cur = pts[i];
        var cx = (prev[0] + cur[0]) / 2;
        d += " C" + cx + "," + prev[1] + " " + cx + "," + cur[1] + " " + cur[0] + "," + cur[1];
      }
      return d;
    }

    var inPts = series(1.3, 60, 150);
    var outPts = series(4.1, 45, 175);

    var ns = "http://www.w3.org/2000/svg";
    // Rejilla
    for (var g = 1; g < 5; g++) {
      var line = document.createElementNS(ns, "line");
      var y = (H / 5) * g;
      line.setAttribute("x1", PAD); line.setAttribute("x2", W - PAD);
      line.setAttribute("y1", y); line.setAttribute("y2", y);
      line.setAttribute("stroke", "rgba(245,242,234,0.05)");
      svg.appendChild(line);
    }
    // Área bajo la curva de ingresos
    var area = document.createElementNS(ns, "path");
    area.setAttribute("d", toPath(inPts) + " L" + (W - PAD) + "," + (H - PAD) + " L" + PAD + "," + (H - PAD) + " Z");
    area.setAttribute("fill", "rgba(201,169,106,0.08)");
    svg.appendChild(area);

    [[outPts, "rgba(245,242,234,0.3)", 1.4], [inPts, "#C9A96A", 2]].forEach(function (cfg, idx) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", toPath(cfg[0]));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", cfg[1]);
      path.setAttribute("stroke-width", cfg[2]);
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = "stroke-dashoffset 2.4s cubic-bezier(0.22,1,0.36,1) " + (0.3 + idx * 0.25) + "s";
      // Disparar cuando el dashboard sea visible
      chartPaths.push(path);
    });

    // Punto pulsante al final de la línea dorada
    var last = inPts[inPts.length - 1];
    var dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", last[0]); dot.setAttribute("cy", last[1]);
    dot.setAttribute("r", 4); dot.setAttribute("fill", "#E3C88C");
    svg.appendChild(dot);
    var halo = document.createElementNS(ns, "circle");
    halo.setAttribute("cx", last[0]); halo.setAttribute("cy", last[1]);
    halo.setAttribute("r", 4); halo.setAttribute("fill", "none");
    halo.setAttribute("stroke", "#E3C88C");
    halo.innerHTML = "<animate attributeName='r' from='4' to='16' dur='1.8s' repeatCount='indefinite'/><animate attributeName='opacity' from='0.8' to='0' dur='1.8s' repeatCount='indefinite'/>";
    svg.appendChild(halo);
  }
  var chartPaths = [];
  buildChart();

  var dashIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        chartPaths.forEach(function (p) { p.style.strokeDashoffset = "0"; });
        renderRows();
        dashIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  dashIO.observe(document.getElementById("dashboard"));

  /* ───── Filas de transacciones del dashboard ───── */
  var txData = [
    { ini: "GA", who: "Grupo Andino S.A.S.", what: "On-ramp — COP → USDC", amt: "+482,300 USDC", pos: true },
    { ini: "NB", who: "Nubeloop Inc.", what: "Off-ramp — USDT → USD (ACH)", amt: "+$96,150.00 USD", pos: true },
    { ini: "VM", who: "Vermont Media", what: "Bloque OTC — BTC/USD", amt: "+4.20 BTC", pos: true },
    { ini: "TX", who: "Textiles del Pacífico", what: "Pago proveedor — USDC → EUR", amt: "-€164,900.00 EUR", pos: false }
  ];
  function renderRows() {
    var wrap = document.getElementById("dashRows");
    txData.forEach(function (t, i) {
      var row = document.createElement("div");
      row.className = "drow";
      row.style.animationDelay = (0.9 + i * 0.28) + "s";
      row.innerHTML =
        "<span class='avatar'>" + t.ini + "</span>" +
        "<span class='who'><strong>" + t.who + "</strong><span>" + t.what + "</span></span>" +
        "<span class='amount " + (t.pos ? "pos" : "neg") + "'>" + t.amt + "</span>" +
        "<span class='status'>LIQUIDADO</span>";
      wrap.appendChild(row);
    });
  }

  /* ───── KPI con micro-variaciones "en vivo" ───── */
  var kpiBalance = document.getElementById("kpiBalance");
  var balanceBase = 48236900;
  setInterval(function () {
    balanceBase += Math.floor((Math.random() - 0.42) * 18000);
    kpiBalance.textContent = "$" + balanceBase.toLocaleString("en-US");
  }, 2600);

  var kpiBtc = document.getElementById("kpiFx");
  var btcBase = 118240;
  setInterval(function () {
    btcBase += Math.floor((Math.random() - 0.48) * 90);
    kpiBtc.textContent = "$" + btcBase.toLocaleString("en-US");
  }, 3400);

  /* ───── Slider de testimonios ───── */
  var testiTrack = document.getElementById("testiTrack");
  var testiCount = testiTrack.children.length;
  var testiIdx = 0;
  var dotsWrap = document.getElementById("testiDots");
  for (var d = 0; d < testiCount; d++) {
    var dot = document.createElement("i");
    if (d === 0) dot.className = "active";
    (function (idx) {
      dot.addEventListener("click", function () { goTesti(idx); });
    })(d);
    dotsWrap.appendChild(dot);
  }
  function goTesti(i) {
    testiIdx = (i + testiCount) % testiCount;
    testiTrack.style.transform = "translateX(-" + testiIdx * 100 + "%)";
    Array.prototype.forEach.call(dotsWrap.children, function (el, k) {
      el.className = k === testiIdx ? "active" : "";
    });
  }
  document.getElementById("testiPrev").addEventListener("click", function () { goTesti(testiIdx - 1); resetAuto(); });
  document.getElementById("testiNext").addEventListener("click", function () { goTesti(testiIdx + 1); resetAuto(); });
  var autoTesti = setInterval(function () { goTesti(testiIdx + 1); }, 7000);
  function resetAuto() {
    clearInterval(autoTesti);
    autoTesti = setInterval(function () { goTesti(testiIdx + 1); }, 7000);
  }

  /* ───── Tilt sutil en tarjetas de soluciones ───── */
  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var rx = ((e.clientY - rect.top) / rect.height - 0.5) * -3;
      var ry = ((e.clientX - rect.left) / rect.width - 0.5) * 3;
      card.style.transform = "translateY(-8px) perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  /* ───── Selector de dirección de la Conversión Express ───── */
  var dirToggle = document.getElementById("directionToggle");
  if (dirToggle) {
    var dirInput = document.getElementById("direccionInput");
    var montoInput = document.getElementById("montoInput");
    dirToggle.querySelectorAll(".dir-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        dirToggle.querySelectorAll(".dir-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        dirInput.value = btn.textContent.trim();
        montoInput.placeholder = "5,000";
      });
    });
  }

  /* ───── Envío de formularios a info@sportrade.co ─────
     Usa FormSubmit (https://formsubmit.co) — sin backend propio.
     Nota: la PRIMERA vez que se envíe un formulario, FormSubmit manda un
     correo de activación a info@sportrade.co; hay que hacer clic en ese
     enlace una única vez para que los siguientes envíos lleguen normalmente.
     Si el envío falla (sin conexión, bloqueado), se ofrece un mailto: como respaldo. */
  var MAIL_TO = "info@sportrade.co";
  var FORMSUBMIT_URL = "https://formsubmit.co/ajax/" + MAIL_TO;

  function collectFields(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name && el.value) data[el.name] = el.value;
    });
    return data;
  }

  function successHtml(msg) {
    return "<div class='form-success'>" +
      "<div class='check'>✓</div>" +
      "<h3>Solicitud recibida</h3>" +
      "<p>" + msg + "</p>" +
      "</div>";
  }

  function mailtoFallback(subject, data) {
    var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
    return "mailto:" + MAIL_TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function wireForm(formId, subject, successMsg) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type='submit']");
      var data = collectFields(form);
      btn.disabled = true;
      btn.textContent = "Enviando…";

      fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(Object.assign({
          _subject: subject,
          _template: "table",
          _captcha: "false"
        }, data))
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }).then(function (data) {
        // FormSubmit responde 200 incluso cuando NO envía (p. ej. formulario sin
        // activar): la verdad está en el campo `success` del cuerpo, no en el status.
        if (String(data.success) !== "true") throw new Error(data.message || "envío no confirmado");
        form.innerHTML = successHtml(successMsg);
      }).catch(function (error) {
        // La causa exacta queda en consola: FormSubmit exige activar cada URL
        // por separado, y ese caso hay que poder distinguirlo de una caída real.
        if (window.console) console.warn("[Sportrade] Envío no confirmado:", error.message);

        btn.disabled = false;
        btn.innerHTML = "Reintentar <span class='arrow'>→</span>";
        var err = form.querySelector(".form-error");
        if (!err) {
          err = document.createElement("p");
          err.className = "form-error";
          form.appendChild(err);
        }
        err.innerHTML = "No pudimos enviar su solicitud automáticamente. " +
          "<a href='" + mailtoFallback(subject, data) + "'>Haga clic aquí para enviarla desde su correo</a> o escríbanos a " + MAIL_TO + ".";
      });
    });
  }

  wireForm(
    "contactForm",
    "Nueva solicitud de acceso — sportrade.co",
    "Gracias por su interés en Sportrade. Un especialista senior lo contactará el mismo día hábil desde <strong>info@sportrade.co</strong>."
  );
  wireForm(
    "expressForm",
    "Conversión Express — sportrade.co",
    "Su solicitud de conversión fue enviada. En minutos recibirá en su correo los datos de depósito y la coordinación para entregarle sus fondos desde <strong>info@sportrade.co</strong>."
  );
})();
