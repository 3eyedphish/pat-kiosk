/* Hellma PAT kiosk app. Vanilla JS, no network, no external links. */
(function () {
  "use strict";
  var C = window.KIOSK;
  var ASSETS = window.KIOSK_ASSETS || {};
  var DG = window.DIAGRAMS;
  var app = document.getElementById("app");

  /* ---------------- Utilities ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  /* Text that may carry a review note: { v, check } */
  /* Keep a number with its unit on one line: 400 °C, 250 bar, 2300 nm */
  function nb(s) { return String(s).replace(/(\d) (°C|°F|bar|psi|mm|nm|µm|%)/g, "$1\u00a0$2"); }
  function T(v) {
    if (v && typeof v === "object") return '<span class="chk" data-note="' + esc(v.check) + '">' + nb(esc(v.v)) + "</span>";
    return nb(esc(v));
  }
  function plain(v) { return v && typeof v === "object" ? v.v : v; }
  function note(check) { return check ? '<div class="chk-note">' + esc(check) + "</div>" : ""; }
  var PLACEHOLDER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f2f2f2"/><text x="200" y="158" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#878787">Image coming</text></svg>');
  function src(id) { return ASSETS[id] || PLACEHOLDER; }
  var PHOTO = /^(K|A|I|C|W)\d|^S\d\d|^(P12|P17b|R1|R8)$/;
  function isPhoto(id) { return PHOTO.test(id); }
  function stage(id, cls, alt) {
    if (!id) return '<div class="stage ' + (cls || "") + '"></div>';
    /* "svg:<diagram>" stands in for a product photo that hasn't arrived yet */
    if (id.indexOf("svg:") === 0) return '<div class="stage svgstage ' + (cls || "") + '">' + DG[id.slice(4)]() + "</div>";
    if (isPhoto(id)) return '<div class="stage photo ' + (cls || "") + '"><img src="' + src(id) + '" alt="' + esc(alt || "") + '" draggable="false"></div>';
    return '<div class="stage ' + (cls || "") + '"><img class="prod" src="' + src(id) + '" alt="' + esc(alt || "") + '" draggable="false"><span class="spark"></span><span class="lowres-note">Image ' + esc(id) + "</span></div>";
  }
  function img(id, alt, cls) { return '<img ' + (cls ? 'class="' + cls + '" ' : "") + 'src="' + src(id) + '" alt="' + esc(alt || "") + '" draggable="false">'; }
  var I = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };
  function brandLogo(key, h) {
    var b = C.brands[key]; if (!b) return "";
    return '<img src="' + src(b.logo) + '" alt="' + esc(b.name) + '" style="height:' + (h || 1.6) + 'rem;width:auto" draggable="false">';
  }
  function toast(msg, ms) {
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; app.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 3200);
  }
  function fmtT(n) { return n + " °C"; }
  function fmtP(n) { return n > 0 ? n + " bar" : "Atm."; }
  var RANGE_LABEL = { uvvis: "UV-Vis", vis: "VIS", nir: "NIR" };

  /* ---------------- Settings and storage ---------------- */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { } },
  };
  var settings = Object.assign({ pin: C.settings.defaultPin, idle: C.settings.idleSeconds, event: "", review: false, motion: "always" }, LS.get("hk.settings", {}));
  function saveSettings() { return LS.set("hk.settings", settings); }

  /* ---------------- Home Screen web app support ---------------- */
  var PWA = { reg: null, updateReady: false };
  function standalone() { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; }
  function initPwa() {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
    if (!window.KIOSK_PWA || !("serviceWorker" in navigator) || !window.isSecureContext) return;
    var had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", function () { if (had) PWA.updateReady = true; had = true; });
    navigator.serviceWorker.register("sw.js").then(function (reg) {
      PWA.reg = reg;
      /* A kiosk page never navigates, so look for a new version every 30 minutes while online.
         A new version installs in the background and takes over at the next start-over. */
      setInterval(function () { if (navigator.onLine) reg.update().catch(function () { }); }, 30 * 60 * 1000);
    }).catch(function () { });
  }
  function offlineStatus() {
    if (!window.KIOSK_PWA) return Promise.resolve("Single-file version, works offline as is");
    if (!("caches" in window) || !window.isSecureContext) return Promise.resolve("Not available: open the kiosk from its https address");
    return caches.open(window.KIOSK_CACHE).then(function (c) { return c.keys(); }).then(function (keys) {
      var n = keys.length, need = window.KIOSK_PRECACHE_COUNT || 0;
      return n >= need ? "Ready offline (" + n + " files saved on this iPad)" : "Still saving for offline: " + n + " of " + need + " files. Keep Wi-Fi on.";
    }).catch(function () { return "Unknown"; });
  }
  function storageStatus() {
    if (!navigator.storage || !navigator.storage.persisted) return Promise.resolve("Standard");
    return navigator.storage.persisted().then(function (p) { return p ? "Protected from automatic clean-up" : "Standard (export leads daily)"; }, function () { return "Standard"; });
  }
  var CAN_SHARE_FILES = false;
  try { CAN_SHARE_FILES = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File(["x"], "t.csv", { type: "text/csv" })] })); } catch (e) { }

  var Store = {
    db: null, ok: false,
    init: function () {
      return new Promise(function (res) {
        try {
          if (!window.indexedDB) return res();
          var rq = indexedDB.open("hellma-kiosk", 1);
          rq.onupgradeneeded = function () { rq.result.createObjectStore("leads", { keyPath: "id" }); };
          rq.onsuccess = function () { Store.db = rq.result; Store.ok = true; res(); };
          rq.onerror = function () { res(); };
          setTimeout(res, 1500);
        } catch (e) { res(); }
      });
    },
    add: function (lead) {
      var mirror = LS.get("hk.leads", []); mirror.push(lead); var lsOk = LS.set("hk.leads", mirror);
      return new Promise(function (res) {
        if (!Store.db) return res(lsOk);
        try {
          var tx = Store.db.transaction("leads", "readwrite"); tx.objectStore("leads").put(lead);
          tx.oncomplete = function () { res(true); }; tx.onerror = function () { res(lsOk); };
        } catch (e) { res(lsOk); }
      });
    },
    all: function () {
      var byId = {};
      LS.get("hk.leads", []).forEach(function (l) { byId[l.id] = l; });
      return new Promise(function (res) {
        if (!Store.db) return res(byId);
        try {
          var rq = Store.db.transaction("leads", "readonly").objectStore("leads").getAll();
          rq.onsuccess = function () { (rq.result || []).forEach(function (l) { byId[l.id] = l; }); res(byId); };
          rq.onerror = function () { res(byId); };
        } catch (e) { res(byId); }
      }).then(function (m) { return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return b.ts - a.ts; }); });
    },
    clear: function () {
      LS.del("hk.leads");
      return new Promise(function (res) {
        if (!Store.db) return res();
        try { var tx = Store.db.transaction("leads", "readwrite"); tx.objectStore("leads").clear(); tx.oncomplete = res; tx.onerror = res; } catch (e) { res(); }
      });
    },
  };

  /* ---------------- Session state ---------------- */
  var S;
  function freshSession() {
    S = {
      stack: [], viewed: [], form: null,
      finder: { principle: "any", format: "any", range: "any", temp: 0, pres: 0 },
      mux: { ch: 0, auto: true },
    };
  }
  freshSession();

  /* ---------------- Shell ---------------- */
  var LOGO = (window.KIOSK_LOGO_SVG || "").replace("<svg", '<svg class="logo" role="img" aria-label="Hellma"');
  app.innerHTML =
    '<div class="shell" id="shell" hidden>' +
    '<header class="topbar">' +
    '<button class="navbtn" id="btn-back" type="button">' + I.back + "Back</button>" +
    '<button class="navbtn" id="btn-home" type="button">' + I.home + "Home</button>" +
    '<div class="crumb" id="crumb"></div>' +
    '<button class="logo-btn" id="logo-btn" type="button" aria-label="Hellma">' + LOGO + "</button>" +
    "</header>" +
    '<main class="view" id="view"></main>' +
    '<button class="cta" id="cta" type="button">' + I.mail + "Request information</button>" +
    "</div>" +
    '<div class="attract" id="attract"></div>' +
    '<div class="overlay idle" id="idle" hidden></div>' +
    '<div class="overlay" id="pin" hidden></div>' +
    '<div class="overlay staff" id="staff" hidden></div>' +
    '<div class="overlay lightbox" id="lightbox" hidden></div>';
  var view = $("#view"), shell = $("#shell"), attractEl = $("#attract");

  /* ---------------- Router ---------------- */
  var current = null;
  function go(route, opts) {
    opts = opts || {};
    if (route === "attract") return showAttract();
    hideAttract();
    if (opts.replace && S.stack.length) S.stack[S.stack.length - 1] = route;
    else if (route === "home") S.stack = ["home"];
    else S.stack.push(route);
    render(route, opts);
  }
  function back() {
    if (S.stack.length > 1) S.stack.pop();
    render(S.stack[S.stack.length - 1] || "home", {});
  }
  function render(route, opts) {
    var parts = route.split("/");
    var fn = SCREENS[parts[0]] || SCREENS.home;
    var keep = opts.keepScroll ? view.scrollTop : 0;
    var out = fn(parts[1], parts[2]);
    current = route;
    view.innerHTML = '<div class="page">' + out.html + "</div>";
    if (opts.keepScroll) { var pg = view.firstChild; pg.style.animation = "none"; }
    view.scrollTop = keep;
    $("#crumb").innerHTML = out.crumb ? out.crumb : "";
    $("#btn-back").hidden = route === "home";
    $("#btn-home").hidden = route === "home";
    $("#cta").hidden = !!out.noCta;
    if (out.init) out.init(view.firstChild);
  }
  function crumb(a, b) { return b ? esc(a) + " · <b>" + esc(b) + "</b>" : "<b>" + esc(a) + "</b>"; }

  /* ---------------- Attract ---------------- */
  var attractTimer = null, attractIdx = 0;
  function buildAttract() {
    var slides = C.attract.map(function (s, i) {
      return '<div class="slide' + (i === 0 ? " on" : "") + '"><img src="' + src(s.img) + '" alt="" style="object-position:' + (s.pos || "50% 50%") + '" draggable="false"></div>';
    }).join("");
    attractEl.innerHTML = slides + '<div class="shade"></div>' +
      '<div class="logo-plate">' + LOGO + "</div>" +
      '<div class="copy"><div class="card" id="attract-card"></div>' +
      '<div class="touch"><span class="ring"></span>Touch to explore</div></div>' +
      '<div class="dots">' + C.attract.map(function (_, i) { return "<i" + (i === 0 ? ' class="on"' : "") + "></i>"; }).join("") + "</div>";
    setAttractCopy(0);
  }
  function setAttractCopy(i) {
    var s = C.attract[i];
    $("#attract-card").innerHTML = '<div class="eyebrow">' + esc(s.eyebrow) + "</div><h1>" + nb(esc(s.title)) + "</h1><p>" + nb(esc(s.sub)) + "</p>" +
      (s.foot && C.footnotes[s.foot] ? '<p class="foot">' + esc(C.footnotes[s.foot]) + "</p>" : "");
  }
  function nextSlide() {
    var sl = $$(".slide", attractEl), dots = $$(".dots i", attractEl);
    sl[attractIdx].classList.remove("on"); dots[attractIdx].classList.remove("on");
    attractIdx = (attractIdx + 1) % sl.length;
    sl[attractIdx].classList.add("on"); dots[attractIdx].classList.add("on");
    setAttractCopy(attractIdx);
  }
  function showAttract() {
    if (PWA.updateReady) { location.reload(); return; }
    closeOverlays();
    freshSession();
    shell.hidden = true; attractEl.hidden = false;
    clearInterval(attractTimer);
    attractTimer = setInterval(nextSlide, (C.settings.attractSlideSeconds || 8) * 1000);
    current = "attract";
  }
  function hideAttract() {
    if (attractEl.hidden) return;
    clearInterval(attractTimer); attractEl.hidden = true; shell.hidden = false;
  }
  attractEl.addEventListener("click", function () { go("home"); });

  /* ---------------- Shared blocks ---------------- */
  function pageHead(eyebrow, title, lead, brand) {
    return '<header class="pagehead">' + (brand ? '<div class="brandline">' + brandLogo(brand, 1.5) + "</div>" : "") +
      '<div class="eyebrow">' + esc(eyebrow) + '</div><h1 class="h1">' + esc(title) + "</h1>" + (lead ? '<p class="lead">' + lead + "</p>" : "") + "</header>";
  }
  function banner(eyebrow, title, lead) {
    return '<header class="banner"><div class="eyebrow">' + esc(eyebrow) + '</div><h1 class="h1">' + esc(title) + "</h1>" + (lead ? '<p class="lead">' + lead + "</p>" : "") + "</header>";
  }
  function bullets(arr, cls) { return '<ul class="bul ' + (cls || "") + '">' + arr.map(function (x) { return "<li>" + T(x) + "</li>"; }).join("") + "</ul>"; }
  function figure(id, alt) {
    return '<div class="figure">' + img(id, alt) + '<button class="zoom" type="button" data-zoom="' + id + '" data-cap="' + esc(alt || "") + '" aria-label="Enlarge">' + I.zoom + "</button></div>";
  }
  function productOf(id) { return C.products[id]; }
  function principleOf(p) { return C.principles[C.families[p.family].principle]; }
  function pcard(id) {
    var p = productOf(id), f = p.filter, pr = principleOf(p);
    var tw = Math.max(4, Math.min(100, Math.round(f.maxT / 400 * 100))), pw = Math.max(3, Math.min(100, Math.round(f.maxP / 250 * 100)));
    var pn = f.brazed ? "Highest ratings with brazed seals" : f.custom ? "Custom built" : "";
    var req = S.finder;
    return '<button class="pcard" type="button" data-go="product/' + id + '">' + stage(p.img, "", p.name) +
      '<div class="body"><div class="nm"><b>' + esc(p.name) + "</b><span>" + esc(p.type) + "</span></div>" +
      '<div class="row" style="gap:.35rem"><span class="tag">' + esc(pr.name) + "</span>" + (f.custom ? '<span class="tag">Custom</span>' : "") + f.ranges.map(function (r) { return '<span class="tag">' + RANGE_LABEL[r] + "</span>"; }).join("") + "</div>" +
      (f.maxT == null ? '<span class="pnote">Temperature and pressure ratings on request</span>' : '<div class="meter"><span>Temp.</span><span class="bar"><i style="width:' + tw + '%"></i>' + (req.temp ? '<u style="left:' + Math.round(req.temp / 400 * 100) + '%"></u>' : "") + '</span><span class="v">' + fmtT(f.maxT) + "</span></div>" +
      '<div class="meter"><span>Pressure</span><span class="bar"><i style="width:' + pw + '%"></i>' + (req.pres ? '<u style="left:' + Math.round(req.pres / 250 * 100) + '%"></u>' : "") + '</span><span class="v">' + fmtP(f.maxP) + (f.pStar ? "*" : "") + "</span></div>" +
      (pn ? '<span class="pnote">' + pn + "</span>" : "")) + "</div></button>";
  }
  function mini(o) {
    var vis = o.svg ? '<div class="stage svgthumb">' + o.svg + "</div>" : stage(o.img, "", o.title);
    return '<button class="mini" type="button" data-go="' + o.route + '">' + vis + '<div><b>' + esc(o.title) + "</b><span>" + esc(o.sub || "") + "</span></div></button>";
  }
  function relItem(key) {
    if (C.products[key]) { var p = C.products[key]; return { route: "product/" + key, img: p.img, title: p.name, sub: p.type }; }
    if (key.indexOf("principle:") === 0) {
      var pk = key.slice(10), pp = C.principles[pk]; if (!pp) return null;
      var pf = C.families[pp.family], first = pf && pf.products[0];
      return { route: "principles/" + pk, img: first ? C.products[first].img : null, svg: first ? null : DG[pk](), title: pp.name + " principle", sub: pf ? pf.name + " probes" : "Measurement principle" };
    }
    if (key.indexOf("line:") === 0) { var ln = C.lines[key.slice(5)]; return ln ? { route: "line/" + key.slice(5), img: "P2", title: ln.name, sub: "All probes and flow cells" } : null; }
    if (key.indexOf("sensor:") === 0) { var s = C.solutions.sensors.filter(function (x) { return x.id === key.slice(7); })[0]; return { route: "solutions/sensors", img: s.img, title: s.name + " sensor", sub: "Hellma Solutions" }; }
    var map = {
      case: { route: "case", img: "K2b", title: "Case study", sub: "Water in solvents" },
      retractables: { route: "retractables", img: "R4", title: "Retractable housings", sub: "Ceramat and Sensogate" },
      multiplexers: { route: "multiplexers", img: "P10", title: "FMX multiplexer", sub: "Up to 16 points, one spectrometer" },
      custom: { route: "solutions/custom", img: "K3", title: "Custom development", sub: "Hellma Solutions" },
      solutions: { route: "solutions", img: "K3", title: "Hellma Solutions", sub: "Feasibility, models, integration" },
      prm: { route: "retractables/prm", img: "P12", title: "Probe Retraction Mechanism", sub: "For Excalibur HD" },
      finder: { route: "finder", img: "P2", title: "Probe finder", sub: "Match a probe to your process" },
    };
    return map[key];
  }
  function allProcessProducts() {
    var out = [];
    C.lines["process-interfaces"].families.forEach(function (f) { out = out.concat(C.families[f].products); });
    return out;
  }
  function tabs(items, sel, base) {
    return '<div class="tabs" role="tablist">' + items.map(function (t) {
      return '<button class="tab" type="button" role="tab" aria-selected="' + (t[0] === sel) + '" data-tab="' + base + "/" + t[0] + '">' + esc(t[1]) + "</button>";
    }).join("") + "</div>";
  }

  /* ---------------- Screens ---------------- */
  var SCREENS = {};
  /* Keep the reader where they are while a diagram changes state */
  function steady(fn) {
    var top = view.scrollTop;
    fn();
    if (view.scrollTop !== top) view.scrollTop = top;
    requestAnimationFrame(function () { if (view.scrollTop !== top) view.scrollTop = top; });
  }
  function foot(key) { return key && C.footnotes[key] ? '<p class="foot">' + esc(C.footnotes[key]) + "</p>" : ""; }
  function arrowSm() { return I.arrow.replace("<svg", '<svg style="width:1rem;height:1rem"'); }

  SCREENS.home = function () {
    var h = C.home;
    var hero = '<button class="hero-tile" type="button" data-go="' + h.hero.route + '">' + stage(h.hero.img, "", h.hero.title) +
      '<div class="txt"><div class="eyebrow" style="color:rgba(255,255,255,.8)">Probe finder</div><h2>' + esc(h.hero.title) + "</h2><p>" + esc(h.hero.sub) + '</p><span class="go">Start ' + I.arrow.replace("<svg", '<svg style="width:1.2rem;height:1.2rem"') + "</span></div></button>";
    var groups = h.groups.map(function (g) {
      var head = g.brand ? brandLogo(g.brand, 1.35) + '<span class="t">' + esc(g.title) + "</span>" : '<span class="t">' + esc(g.title) + "</span>";
      var tiles = g.tiles.map(function (t) {
        var vis = t.svg ? '<div class="stage">' + DG.transmission() + "</div>" : stage(t.img, "", t.title);
        return '<button class="tile" type="button" data-go="' + t.route + '">' + vis + '<div class="t"><b>' + esc(t.title) + "</b><span>" + esc(t.sub) + "</span></div></button>";
      }).join("");
      return '<section><div class="group-h">' + head + '</div><div class="tiles">' + tiles + "</div></section>";
    }).join("");
    return {
      crumb: "",
      html: '<div class="home-head">' + pageHead(h.eyebrow, h.title, esc(h.sub)) + "</div>" +
        '<div class="home-grid">' + hero + '<div class="groups">' + groups + "</div></div>",
    };
  };

  SCREENS.line = function (id) {
    var L = C.lines[id];
    var fams = L.families.map(function (fid) {
      var f = C.families[fid], pr = C.principles[f.principle];
      var body = f.products.length ? '<div class="results">' + f.products.map(pcard).join("") + "</div>"
        : '<div class="empty"><p>' + esc(f.empty) + '</p><button class="btn primary" type="button" data-req="' + fid + '">' + I.mail + "Request information</button></div>";
      return '<section style="display:grid;gap:.9rem"><div class="row" style="justify-content:space-between"><div style="display:grid;gap:.3rem"><h2 class="h2">' + esc(f.name) + '</h2><p class="muted">' + esc(f.desc) + "</p>" + foot(f.foot) + "</div>" +
        '<button class="linkish" type="button" data-go="principles/' + f.principle + '">How ' + esc(pr.name.toLowerCase()) + " works " + arrowSm() + "</button></div>" + note(f.check) + body + "</section>";
    }).join("");
    return {
      crumb: crumb(L.name),
      html: pageHead(C.brands[L.brand].name, L.name, esc(L.intro), L.brand) +
        '<div class="row"><button class="btn primary" type="button" data-go="finder">Filter with the probe finder ' + I.arrow + "</button></div>" + fams,
    };
  };

  var TEMP_OPTS = [[0, "Any"], [100, "100 °C", "212 °F"], [150, "150 °C", "302 °F"], [250, "250 °C", "482 °F"], [300, "300 °C", "572 °F"], [400, "400 °C", "752 °F"]];
  var PRES_OPTS = [[0, "Any"], [10, "10 bar", "145 psi"], [30, "30 bar", "435 psi"], [100, "100 bar", "1450 psi"], [250, "250 bar", "3626 psi"]];
  SCREENS.finder = function () {
    function chips(key, opts) {
      return '<div class="row">' + opts.map(function (o) {
        return '<button class="chip" type="button" data-f="' + key + '" data-val="' + o[0] + '" aria-pressed="' + (String(S.finder[key]) === String(o[0])) + '">' + esc(o[1]) + (o[2] ? ' <span class="sub">' + esc(o[2]) + "</span>" : "") + "</button>";
      }).join("") + "</div>";
    }
    var pOpts = [["any", "Any"]].concat(["transmission", "transflection", "atr", "reflection"].map(function (k) { return [k, C.principles[k].name]; }));
    var filters = '<aside class="filters">' +
      '<div class="fgroup"><div class="lab">Measurement principle</div>' + chips("principle", pOpts) +
      '<button class="linkish small" type="button" data-go="principles">Not sure? See how each principle works</button></div>' +
      '<div class="fgroup"><div class="lab">Installation</div>' + chips("format", [["any", "Any"], ["probe", "Probe in a vessel or pipe"], ["flow", "Flow cell"]]) + "</div>" +
      '<div class="fgroup"><div class="lab">Spectral range</div>' + chips("range", [["any", "Any"], ["uvvis", "UV-Vis"], ["nir", "NIR"]]) + "</div>" +
      '<div class="fgroup"><div class="lab">Process temperature up to</div>' + chips("temp", TEMP_OPTS) + "</div>" +
      '<div class="fgroup"><div class="lab">Process pressure up to</div>' + chips("pres", PRES_OPTS) + "</div>" +
      '<button class="btn" type="button" id="f-reset">Clear all filters</button></aside>';
    return {
      crumb: crumb("Probe finder"),
      html: pageHead("Probe finder", "Find your probe", "Tell us about your process. Probes and flow cells that can't handle it drop out.", "analytics") +
        '<div class="finder">' + filters + '<section style="display:grid;gap:1rem"><div class="results-head"><h2 class="h2" id="f-count"></h2><span class="muted small">Ratings are the highest per model; some need brazed seals.</span></div><div id="f-results"></div>' + foot("weld") + "</section></div>",
      init: function (root) {
        function apply() {
          var f = S.finder;
          var all = allProcessProducts();
          var hit = all.filter(function (id) {
            var p = C.products[id], q = p.filter;
            if (f.principle !== "any" && C.families[p.family].principle !== f.principle) return false;
            if (f.format !== "any" && q.format.indexOf(f.format) < 0) return false;
            if (f.range !== "any" && q.ranges.indexOf(f.range) < 0 && !(f.range === "uvvis" && q.ranges.indexOf("vis") >= 0)) return false;
            if (f.temp && q.maxT < f.temp) return false;
            if (f.pres && q.maxP < f.pres) return false;
            return true;
          });
          $("#f-count", root).textContent = hit.length === all.length ? "All " + all.length + " probes and flow cells" : hit.length + " of " + all.length + " match";
          $("#f-results", root).innerHTML = hit.length ? '<div class="results">' + hit.map(pcard).join("") + "</div>" :
            '<div class="empty"><h3 class="h3">No standard model covers all of that.</h3><p>Hellma Solutions develops custom process interfaces. Tell us about your process and a specialist will follow up.</p>' +
            '<div class="row"><button class="btn primary" type="button" data-req="custom">' + I.mail + 'Ask about a custom solution</button><button class="btn" type="button" id="f-reset2">Clear filters</button></div></div>';
          var r2 = $("#f-reset2", root); if (r2) r2.onclick = reset;
        }
        function reset() { S.finder = { principle: "any", format: "any", range: "any", temp: 0, pres: 0 }; $$(".chip[data-f]", root).forEach(function (c) { c.setAttribute("aria-pressed", String(S.finder[c.dataset.f]) === c.dataset.val); }); apply(); }
        $$(".chip[data-f]", root).forEach(function (c) {
          c.addEventListener("click", function () {
            var k = c.dataset.f, v = c.dataset.val;
            S.finder[k] = (k === "temp" || k === "pres") ? Number(v) : v;
            $$('.chip[data-f="' + k + '"]', root).forEach(function (o) { o.setAttribute("aria-pressed", o === c); });
            steady(apply);
          });
        });
        $("#f-reset", root).onclick = reset;
        apply();
      },
    };
  };

  SCREENS.product = function (id) {
    var p = productOf(id), fam = C.families[p.family], pr = C.principles[fam.principle], f = p.filter;
    if (S.viewed.indexOf(p.name) < 0) S.viewed.push(p.name);
    var views = [["photo", p.img]].concat(p.img2 ? [["photo2", p.img2]] : []).concat(p.drawing ? [["drawing", p.drawing]] : []);
    var thumbs = views.length < 2 ? "" : '<div class="thumbs">' + views.map(function (v, i) { return '<button type="button" data-view="' + v[0] + '" data-id="' + v[1] + '" aria-pressed="' + (i === 0) + '">' + img(v[1], "") + "</button>"; }).join("") + "</div>";
    var specs = '<table class="specs"><tbody>' + p.specs.map(function (r) { return "<tr><th>" + esc(r[0]) + "</th><td>" + T(r[1]) + "</td></tr>"; }).join("") + "</tbody></table>";
    var fits = (p.fits || []).map(relItem).map(mini).join("");
    var tNote = f.brazed ? "with brazed seals" : "", pNote = f.brazed ? "with brazed seals" : (f.custom ? "custom built" : "");
    var spectral = f.ranges.length ? f.ranges.map(function (r) { return RANGE_LABEL[r]; }).join(" · ") : "Ask us";
    return {
      crumb: crumb(fam.name, p.name),
      html: '<div class="product"><div class="gallery"><div id="pstage">' + stage(p.img, "", p.name) + "</div>" + thumbs +
        (p.drawing ? '<span class="zoomhint">' + I.zoom.replace("<svg", '<svg style="width:1rem;height:1rem"') + "Tap the drawing to enlarge it</span>" : "") + "</div>" +
        '<div class="pinfo"><div class="row" style="gap:.5rem"><span class="eyebrow">' + esc(fam.name) + " · " + esc(pr.name) + "</span></div>" +
        '<h1 class="h1">' + esc(p.name) + '</h1><div class="row" style="gap:.4rem"><span class="tag solid">' + esc(p.type) + "</span>" + (p.badge ? '<span class="tag">' + esc(p.badge) + "</span>" : "") + "</div>" +
        '<p class="lead">' + esc(p.summary) + "</p>" + note(p.check) +
        '<div class="ratings"><div class="rating"><span class="k">Max. temperature</span><span class="n">' + (f.maxT == null ? '<span style="font-size:1.2rem">Ask us</span>' : f.maxT + "<small>°C</small>") + "</span>" + (tNote ? '<span class="nt">' + tNote + "</span>" : "") + "</div>" +
        '<div class="rating"><span class="k">Max. pressure</span><span class="n">' + (f.maxP == null ? '<span style="font-size:1.2rem">Ask us</span>' : f.maxP ? f.maxP + "<small>bar" + (f.pStar ? "*" : "") + "</small>" : "Atm.") + "</span>" + (pNote ? '<span class="nt">' + pNote + "</span>" : "") + "</div>" +
        '<div class="rating"><span class="k">Spectral range</span><span class="n" style="font-size:1.2rem">' + spectral + "</span></div></div>" +
        specs + foot(p.foot) +
        '<div class="row"><button class="btn primary" type="button" data-req="' + p.family + '">' + I.mail + "Request information</button>" +
        '<button class="btn" type="button" data-go="principles/' + fam.principle + '">How ' + esc(pr.name.toLowerCase()) + " works</button></div>" +
        (fits ? '<div style="display:grid;gap:.6rem"><div class="eyebrow">Works with</div><div class="minis">' + fits + "</div></div>" : "") +
        "</div></div>",
      init: function (root) {
        $$(".thumbs button", root).forEach(function (b) {
          b.addEventListener("click", function () {
            $$(".thumbs button", root).forEach(function (o) { o.setAttribute("aria-pressed", o === b); });
            var v = b.dataset.view, aid = b.dataset.id;
            steady(function () {
              $("#pstage", root).innerHTML = v === "drawing" ? '<div class="stage" style="background:#fff" data-zoom="' + aid + '" data-cap="' + esc(p.name + " drawing") + '">' + img(aid, p.name + " drawing", "prod") + "</div>" : stage(aid, "", p.name);
            });
          });
        });
      },
    };
  };

  SCREENS.principles = function (sel) {
    var keys = Object.keys(C.principles); sel = sel || "transmission";
    var pr = C.principles[sel], fam = C.families[pr.family];
    var prods = fam.products.map(function (id) { var p = C.products[id]; return mini({ route: "product/" + id, img: p.img, title: p.name, sub: p.type }); }).join("");
    return {
      crumb: crumb("Measurement principles", pr.name),
      html: pageHead("Measurement principles", "How the light meets your sample", "Every Hellma probe sends light into the process and returns it to the spectrometer. What differs is the path the light takes.", "analytics") +
        tabs(keys.map(function (k) { return [k, C.principles[k].name]; }), sel, "principles") +
        '<div class="principle"><div class="diagram">' + DG[sel]() + "</div>" +
        '<div style="display:grid;gap:1.1rem;align-content:start"><div><div class="eyebrow">' + esc(fam.name) + " probes</div>" + '<h2 class="h2" style="margin-top:.3rem">' + esc(pr.long || pr.name) + "</h2></div>" +
        '<div style="display:grid;gap:.5rem"><div class="eyebrow" style="color:var(--grey-7)">How it works</div>' + bullets(pr.how) + "</div>" +
        '<div style="display:grid;gap:.5rem"><div class="eyebrow" style="color:var(--grey-7)">Advantages</div>' + bullets(pr.plus, "plus") + "</div>" + note(pr.check) +
        (prods ? '<div class="minis">' + prods + "</div>" : '<div class="empty"><p>' + esc(fam.empty || "") + '</p><button class="btn primary" type="button" data-req="' + pr.family + '">' + I.mail + "Request information</button></div>") +
        "</div></div>",
    };
  };

  SCREENS.sealing = function () {
    var s = C.sealing, w = s.welded;
    var opts = s.options.map(function (o) {
      return '<div class="panel"><h2 class="h3">' + esc(o.name) + '</h2><div style="display:grid;grid-template-columns:minmax(0,7rem) minmax(0,1fr);gap:1rem;align-items:start">' +
        '<div class="figure" style="padding:.4rem">' + img(o.img, o.name) + '<button class="zoom" type="button" data-zoom="' + o.img + '" data-cap="' + esc(o.name) + '" aria-label="Enlarge">' + I.zoom + "</button></div>" +
        '<div style="display:grid;gap:.8rem">' + bullets(o.plus, "plus") + bullets(o.minus, "minus") + "</div></div></div>";
    }).join("");
    var used = w.used.map(function (id) { var p = C.products[id]; return mini({ route: "product/" + id, img: p.img, title: p.name, sub: p.type }); }).join("");
    return {
      crumb: crumb("Sealing technology"),
      html: pageHead("Sealing technology", "The seal decides how hard a probe can work", esc(s.intro), "analytics") +
        '<div class="cols2">' + opts + "</div>" +
        '<section class="panel sky" style="gap:1.2rem"><div class="row" style="justify-content:space-between;align-items:end"><div><div class="eyebrow">Hellma Excalibur HD</div><h2 class="h2" style="margin-top:.2rem">' + esc(w.name) + "</h2></div>" +
        '<div class="row" style="gap:2rem">' + w.stats.map(function (x) { return '<div class="stat"><span class="l">' + esc(x.l) + '</span><span class="n">' + esc(x.n) + "<small>" + esc(x.u) + "</small></span></div>"; }).join("") + "</div></div>" + foot(w.foot) +
        '<div class="cols2">' + figure(w.exploded, "Welded metal seal, exploded view") + figure(w.section, "Welded metal seal, section") + "</div>" +
        '<div class="cols2"><div style="display:grid;gap:.5rem"><div class="eyebrow" style="color:var(--grey-7)">Parts</div>' + bullets(w.parts) + '</div><div style="display:grid;gap:.5rem"><div class="eyebrow" style="color:var(--grey-7)">Advantages</div>' + bullets(w.plus, "plus") + "</div></div>" +
        '<div style="display:grid;gap:.6rem"><div class="eyebrow" style="color:var(--grey-7)">Used in</div><div class="minis">' + used + "</div></div></section>",
    };
  };

  SCREENS.retractables = function (sel) {
    var R = C.retractables; sel = sel || "ceramat";
    var isPrm = sel === "prm";
    var m = R.models.filter(function (x) { return x.id === sel; })[0] || R.models[0];
    var model = '<div class="cols2" style="align-items:start"><div style="display:grid;gap:.6rem">' + '<div class="figure" style="min-height:20rem">' + img(m.img, m.name) + '<button class="zoom" type="button" data-zoom="' + m.img + '" data-cap="' + esc(m.name) + '">' + I.zoom + "</button></div>" +
      '<div class="row">' + m.more.map(function (id) { return '<button type="button" class="figure" style="width:8rem;height:6rem;padding:.3rem" data-zoom="' + id + '" data-cap="' + esc(m.name) + '">' + img(id, "") + "</button>"; }).join("") + "</div></div>" +
      '<div style="display:grid;gap:1rem;align-content:start"><h2 class="h2">' + esc(m.name) + "</h2>" + bullets(m.points) + "</div></div>";
    var prm = R.prm;
    var prmBlock = '<div class="cols2" style="align-items:start"><div style="display:grid;gap:.8rem">' + '<div class="figure" style="padding:0;overflow:hidden">' + img(prm.img, prm.title) + '<button class="zoom" type="button" data-zoom="' + prm.img + '" data-cap="' + esc(prm.title) + '">' + I.zoom + "</button></div>" + bullets(prm.points) +
      '<div class="minis">' + mini(relItem("excalibur-hd")) + "</div></div>" + figure(prm.drawing, "PRM installed on a reaction vessel") + "</div>";
    return {
      crumb: crumb("Retractable housings", isPrm ? "PRM" : (sel === "cyclone" ? "Cyclone cleaning" : m.name)),
      html: pageHead("Retractable housings", "Clean, calibrate and swap probes while the process runs", esc(R.intro)) +
        '<div class="cols2"><div class="panel"><h2 class="h3">' + esc(R.why.title) + "</h2>" + bullets(R.why.points) + "</div>" +
        '<div class="panel sky"><div class="row" style="justify-content:space-between"><h2 class="h3">' + esc(R.knick.title) + "</h2>" + brandLogo("knick", 2.4) + "</div>" + bullets(R.knick.points) + "</div></div>" +
        tabs([["ceramat", "Ceramat"], ["sensogate", "Sensogate"], ["cyclone", "Cyclone cleaning"], ["prm", "PRM for Excalibur HD"]], sel, "retractables") +
        (sel === "cyclone" ? '<div class="cols2" style="align-items:start"><div style="display:grid;gap:1rem"><h2 class="h2">' + esc(R.cyclone.title) + '</h2><p class="lead">' + esc(R.cyclone.text) + "</p></div>" +
          '<div class="cols2">' + R.cyclone.imgs.map(function (id) { return figure(id, R.cyclone.title); }).join("") + "</div></div>" :
          isPrm ? prmBlock : model + '<div class="panel"><h2 class="h3">Both Ceramat and Sensogate</h2>' + bullets(R.both) + "</div>") +
        (isPrm ? "" : '<p class="credit">' + brandLogo("knick", 1) + esc(R.knick.credit) + "</p>"),
    };
  };

  var muxTimer = null;
  SCREENS.multiplexers = function () {
    var M = C.multiplexers;
    return {
      crumb: crumb("Multiplexers"),
      html: pageHead("Multiplexers", "One spectrometer, many measuring points", esc(M.intro), "analytics") +
        '<section class="panel" style="gap:1rem"><div class="diagram" id="mux">' + DG.multiplexer() + "</div>" +
        '<div class="row" style="justify-content:space-between"><div class="row" id="mux-ch">' + [0, 1, 2, 3].map(function (i) { return '<button class="chip" type="button" data-ch="' + i + '" aria-pressed="' + (S.mux.ch === i) + '">Point ' + (i + 1) + "</button>"; }).join("") +
        '<button class="chip" type="button" id="mux-auto" aria-pressed="' + S.mux.auto + '">Auto-cycle</button></div><p class="muted small" style="max-width:34rem">' + esc(M.fmx.double) + "</p></div></section>" +
        '<div class="cols3">' + M.setup.map(function (s) { return '<div class="panel"><h2 class="h3">' + esc(s.k) + "</h2><p>" + esc(s.t) + "</p></div>"; }).join("") + "</div>" +
        '<section class="panel sky" style="gap:1.1rem"><h2 class="h2">' + esc(M.fmx.name) + "</h2>" +
        '<div class="cols3">' + M.fmx.imgs.map(function (id) { return '<div class="stage" style="aspect-ratio:4/3" data-zoom="' + id + '" data-cap="FMX multiplexer">' + img(id, "FMX multiplexer", "prod") + "</div>"; }).join("") + "</div>" +
        '<div class="cols2"><div style="display:grid;gap:.5rem"><div class="eyebrow" style="color:var(--grey-7)">Connections</div>' + bullets(M.fmx.parts) + "</div>" +
        '<div style="display:grid;gap:.8rem;align-content:start"><p>' + esc(M.fmx.double) + '</p><div class="row"><button class="btn primary" type="button" data-req="multiplexers">' + I.mail + "Request information</button></div></div></div></section>",
      init: function (root) {
        var svg = $("#mux svg", root), dial = $(".dial", svg);
        function set(ch) {
          S.mux.ch = ch;
          steady(function () {
            $$(".mpc", svg).forEach(function (g) { g.classList.toggle("on", Number(g.dataset.ch) === ch); });
            dial.style.transform = "rotate(" + DG.MUX_ANGLES[ch] + "deg)";
            $$("#mux-ch .chip[data-ch]", root).forEach(function (b) { b.setAttribute("aria-pressed", Number(b.dataset.ch) === ch); });
          });
        }
        function auto(on) {
          S.mux.auto = on; $("#mux-auto", root).setAttribute("aria-pressed", on);
          clearInterval(muxTimer); if (on) muxTimer = setInterval(function () { if (!root.isConnected) return clearInterval(muxTimer); set((S.mux.ch + 1) % 4); }, 2600);
        }
        $$("#mux-ch .chip[data-ch]", root).forEach(function (b) { b.onclick = function () { auto(false); set(Number(b.dataset.ch)); }; });
        svg.addEventListener("click", function (e) { var g = e.target.closest(".mp"); if (g) { auto(false); set(Number(g.dataset.ch)); } });
        $("#mux-auto", root).onclick = function () { auto(!S.mux.auto); };
        set(S.mux.ch); auto(S.mux.auto);
      },
    };
  };

  SCREENS.solutions = function (sel) {
    var X = C.solutions; sel = sel || "overview";
    var body = "";
    if (sel === "overview") {
      body = '<p class="lead">' + esc(X.intro) + '</p><div class="hexes">' + X.benefits.map(function (b) { return '<div class="hex">' + esc(b) + "</div>"; }).join("") + "</div>" +
        '<div class="row"><button class="btn primary" type="button" data-go="applications/cases">See the case studies ' + I.arrow + "</button></div>";
    } else if (sel === "sensors") {
      body = '<p class="lead">Spectroscopy sensors that combine a miniature spectrometer with a Hellma probe, ready for system integrators.</p><div class="cols3">' + X.sensors.map(function (s) {
        return '<div class="panel" style="padding:0;overflow:hidden">' + '<div style="aspect-ratio:4/3">' + stage(s.img, "", s.name) + '</div><div style="padding:0 1.2rem 1.2rem;display:grid;gap:.6rem"><h2 class="h2">' + esc(s.name) + "</h2><p>" + esc(s.text) + '</p><button class="btn" type="button" data-req="sensors">' + I.mail + "Request information</button></div></div>";
      }).join("") + "</div>";
    } else if (sel === "custom") {
      var cu = X.custom;
      body = '<div class="cols2" style="align-items:start"><div style="display:grid;gap:1rem"><h2 class="h2">' + esc(cu.q) + "</h2>" + cu.ways.map(function (w) { return '<div class="panel"><h3 class="h3">' + esc(w.name) + "</h3><p>" + esc(w.text) + "</p></div>"; }).join("") + "</div>" +
        '<div style="display:grid;gap:.8rem"><div style="aspect-ratio:4/3">' + stage(cu.img, "", "Dedicated system") + '</div><p class="muted small">A dedicated system developed for a specific application.</p></div></div>' +
        '<div style="display:grid;gap:.6rem"><div class="eyebrow" style="color:var(--grey-7)">Project phases</div><div class="road" style="grid-template-columns:repeat(5,minmax(0,1fr))">' + cu.phases.map(function (ph, i) { return '<div class="panel" style="text-align:center;padding:.9rem .5rem"><span class="n num" style="color:var(--blue)">' + (i + 1) + "</span><b style=\"font-weight:500\">" + esc(ph) + "</b></div>"; }).join("") + "</div></div>" +
        '<div class="row"><button class="btn primary" type="button" data-req="custom">' + I.mail + "Talk to us about a custom solution</button></div>";
    } else if (sel === "services") {
      body = '<div class="cols2" style="align-items:center"><div class="diagram" id="wheel" style="max-width:30rem;justify-self:center;width:100%">' + DG.wheel(X.portfolio) + "</div>" +
        '<div class="panel" id="wheel-detail" style="min-height:12rem"></div></div>' + note(X.portfolioCheck);
    } else if (sel === "roadmap") {
      var steps = [{ id: null, name: "Start: analytical need", img: "W2" }].concat(C.caseStudy.steps.filter(function (s) { return s.id !== "vmodel"; }));
      body = '<p class="lead">Every PAT project follows the same road. Tap a step to see it in the water-in-solvents case study.</p><div class="road">' + steps.map(function (s, i) {
        return '<button type="button" ' + (s.id ? 'data-go="case/' + s.id + '"' : 'data-go="case"') + '><span class="ph">' + img(s.img, "") + '</span><span class="n">STEP ' + (i + 1) + "</span><b>" + esc(s.name) + "</b></button>";
      }).join("") + "</div>";
    }
    return {
      crumb: crumb("Hellma Solutions"),
      html: pageHead("Hellma Solutions", "PAT from first question to service", null, "solutions") +
        tabs([["overview", "Overview"], ["sensors", "Sensors"], ["custom", "Custom development"], ["services", "Services"], ["roadmap", "Roadmap"]], sel, "solutions") + body,
      init: function (root) {
        var w = $("#wheel", root);
        if (!w) return;
        function show(i) {
          steady(function () {
            $$(".wseg", w).forEach(function (g) { g.classList.toggle("on", Number(g.dataset.seg) === i); });
            var it = X.portfolio[i];
            $("#wheel-detail", root).innerHTML = '<div class="eyebrow">Hellma Solutions portfolio</div><h2 class="h2">' + esc(it.name) + '</h2><p class="lead">' + esc(it.text) + '</p><div class="row"><button class="btn primary" type="button" data-req="services">' + I.mail + "Request information</button></div>";
          });
        }
        w.addEventListener("click", function (e) { var g = e.target.closest(".wseg"); if (g) show(Number(g.dataset.seg)); });
        show(0);
      },
    };
  };

  SCREENS.pat = function (sel) {
    var X = C.pat; sel = sel || "what";
    var body = "";
    if (sel === "what") {
      body = '<p class="lead">' + esc(X.what) + "</p>" +
        '<div class="principle pos-layout"><div class="diagram" id="pos">' + DG.positions() + '</div><div class="panel" id="pos-detail"></div></div>' +
        '<div class="row" id="pos-btns">' + X.positions.map(function (p) { return '<button class="chip" type="button" data-pos="' + p.id + '">' + esc(p.name) + "</button>"; }).join("") + "</div>" + note(X.positionsCheck);
    } else if (sel === "why") {
      body = '<div class="cols3">' + X.why.map(function (w) { return '<div class="panel"><h2 class="h3">' + esc(w.name) + "</h2><p>" + esc(w.text) + "</p></div>"; }).join("") + "</div>";
    } else {
      body = '<div class="cols3">' + X.challenges.map(function (w) { return '<div class="panel"><h2 class="h3">' + esc(w.name) + "</h2><p>" + esc(w.text) + "</p></div>"; }).join("") + "</div>" +
        '<div class="panel sky"><h2 class="h3">Hellma Solutions helps with each of these</h2><p>Feasibility studies, chemometric service and integration support take the risk out of a PAT project.</p><div class="row"><button class="btn primary" type="button" data-go="solutions">Explore Hellma Solutions ' + I.arrow + "</button></div></div>";
    }
    return {
      crumb: crumb("What is PAT?"),
      html: pageHead("Process Analytical Technology", "What is PAT?", null) +
        tabs([["what", "Where to measure"], ["why", "Why it matters"], ["challenges", "Challenges"]], sel, "pat") + body,
      init: function (root) {
        var d = $("#pos", root); if (!d) return;
        var svg = $("svg", d);
        function show(id) {
          steady(function () {
            $$(".pos", svg).forEach(function (g) { g.classList.toggle("sel", g.dataset.pos === id); g.classList.toggle("dim", g.dataset.pos !== id); });
            var p = X.positions.filter(function (x) { return x.id === id; })[0];
            var meter = '<div class="speed"><span class="small muted">Speed of result</span><span class="bars">' + [1, 2, 3, 4].map(function (k) { return "<i" + (k <= p.speed ? ' class="on"' : "") + "></i>"; }).join("") + '</span><b>' + esc(p.speedLabel) + "</b></div>";
            $("#pos-detail", root).innerHTML = '<div class="eyebrow">Measuring position</div><h2 class="h2">' + esc(p.name) + "</h2><p>" + esc(p.text) + "</p>" + meter;
            $$("#pos-btns .chip", root).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.pos === id); });
          });
        }
        svg.addEventListener("click", function (e) { var g = e.target.closest(".pos"); if (g) show(g.dataset.pos); });
        $$("#pos-btns .chip", root).forEach(function (b) { b.onclick = function () { show(b.dataset.pos); }; });
        show(X.positions[0].id);
      },
    };
  };

  SCREENS.case = function (sel) {
    var X = C.caseStudy, steps = X.steps; sel = sel || steps[0].id;
    var idx = steps.findIndex(function (s) { return s.id === sel; }); if (idx < 0) idx = 0;
    var s = steps[idx];
    var list = '<nav class="steps" aria-label="Project steps">' + steps.map(function (st) {
      return '<button type="button" data-tab="case/' + st.id + '"' + (st.id === s.id ? ' aria-current="step"' : "") + '><span class="ph">' + img(st.img, "") + "</span><span>" + esc(st.name) + "</span></button>";
    }).join("") + "</nav>";
    var b = '<div><div class="eyebrow">Step ' + (idx + 1) + " of " + steps.length + " · " + esc(s.name) + '</div><h2 class="h2" style="margin-top:.3rem">' + esc(s.title) + "</h2></div>";
    if (s.text) b += '<p class="lead">' + esc(s.text) + "</p>";
    if (s.kind === "beforeafter") {
      b += '<div class="seg" role="group"><button type="button" data-ba="0" aria-pressed="false">Before: offline</button><button type="button" data-ba="1" aria-pressed="true">After: online</button></div><div class="diagram" id="ba">' + DG.beforeAfter() + "</div>";
    }
    if (s.kind === "atex") b += '<div class="diagram">' + DG.atex() + "</div>";
    if (s.kind === "model") b += '<div class="diagram" id="model">' + DG.model() + '</div><div class="cols3" id="phases">' + s.phases.map(function (p, k) { return '<button type="button" class="panel phase" data-phase="' + k + '" aria-pressed="' + (k === 0) + '"><span class="eyebrow">Phase ' + (k + 1) + '</span><h3 class="h3">' + esc(p.name) + "</h3><p>" + esc(p.text) + "</p></button>"; }).join("") + "</div>";
    if (s.kind === "chips") b += '<div class="row">' + s.chips.map(function (c) { return '<span class="pill">' + esc(c) + "</span>"; }).join("") + "</div>";
    if (s.kind === "vmodel") b += '<div class="diagram" id="vm">' + DG.vmodel(X.vmodel) + '</div><div class="panel" id="vm-detail"></div>' + note(X.vmodelCheck);
    if (s.fig) b += '<figure class="chartfig sfig" style="max-width:40rem">' + figure(s.fig.img, s.fig.cap) + "<figcaption>" + esc(s.fig.cap) + "</figcaption></figure>";
    if (s.points) b += bullets(s.points);
    if (s.cols) b += '<div class="cols2">' + s.cols.map(function (c) {
      return '<div class="panel">' + (c.img ? '<div style="aspect-ratio:16/9">' + stage(c.img, "", c.h) + "</div>" : "") + '<h3 class="h3">' + esc(c.h) + "</h3>" + bullets(c.points) +
        (c.product ? '<button class="linkish" type="button" data-go="product/' + c.product + '">View the flow cell ' + arrowSm() + "</button>" : "") + "</div>";
    }).join("") + "</div>";
    if (s.note) b += '<div class="panel sky"><p><b style="font-weight:500">' + esc(s.note) + "</b></p></div>";
    b += '<div class="pager">' + (idx > 0 ? '<button class="btn" type="button" data-tab="case/' + steps[idx - 1].id + '">' + I.back + esc(steps[idx - 1].name) + "</button>" : "") +
      (idx < steps.length - 1 ? '<button class="btn primary" type="button" data-tab="case/' + steps[idx + 1].id + '">' + esc(steps[idx + 1].name) + I.arrow + "</button>" : '<button class="btn primary" type="button" data-req="services">' + I.mail + "Talk to us about your project</button>") + "</div>";
    return {
      crumb: crumb("Case study", s.name),
      html: pageHead("Case study · Hellma Solutions", X.title, esc(X.sub), "solutions") +
        (X.results ? '<div class="results-band"><span class="eyebrow">Results</span>' + X.results.map(function (r) { return '<div class="stat"><span class="n">' + esc(r.n) + '</span><span class="l">' + esc(r.l) + "</span></div>"; }).join("") + "</div>" : "") +
        '<div class="case">' + list + '<div class="stepbody">' + b + "</div></div>",
      init: function (root) {
        var ba = $("#ba svg", root);
        $$("[data-ba]", root).forEach(function (btn) {
          btn.onclick = function () { steady(function () { $$("[data-ba]", root).forEach(function (o) { o.setAttribute("aria-pressed", o === btn); }); ba.setAttribute("data-after", btn.dataset.ba); }); };
        });
        var model = $("#model svg", root);
        if (model) {
          var phase = function (k) {
            steady(function () {
              model.setAttribute("data-show", String(k));
              $$("#phases .phase", root).forEach(function (b) { b.setAttribute("aria-pressed", Number(b.dataset.phase) === k); });
            });
          };
          $$("#phases .phase", root).forEach(function (b) { b.onclick = function () { phase(Number(b.dataset.phase)); }; });
          model.addEventListener("click", function (e) { var g = e.target.closest(".phl"); if (g) phase(Number(g.dataset.phase)); });
          phase(0);
        }
        var vm = $("#vm svg", root);
        if (vm) {
          var show = function (id) {
            steady(function () {
              $$(".vst", vm).forEach(function (g) { g.classList.toggle("on", g.dataset.v === id); });
              var st = X.vmodel.filter(function (v) { return v.id === id; })[0];
              $("#vm-detail", root).innerHTML = '<h3 class="h3">' + esc(st.name) + "</h3><p>" + esc(st.text) + "</p>";
            });
          };
          vm.addEventListener("click", function (e) { var g = e.target.closest(".vst"); if (g) show(g.dataset.v); });
          show("urs");
        }
      },
    };
  };

  /* ---------------- Applications ---------------- */
  var A = C.applications;
  function fieldOf(id) { return A.fields.filter(function (f) { return f.id === id; })[0]; }
  function fieldVisual(f) {
    if (f.img) return img(f.img, "");
    return '<span class="gfx gfx-' + f.graphic + '"></span>';
  }
  function techOf(s) { return A.techniques[s.technique] || { name: "Process spectroscopy" }; }
  function storyCard(id) {
    var s = A.stories[id], t = techOf(s);
    var th = s.img ? '<span class="sthumb">' + (isPhoto(s.img) ? img(s.img, "") : stage(s.img, "", s.title)) + "</span>" : "";
    return '<button class="scard' + (th ? " has-img" : "") + '" type="button" data-go="app/' + id + '">' + th + '<span class="sc-body"><span class="row" style="gap:.3rem"><span class="tag">' + esc(t.name) + "</span>" + (s.isCase ? '<span class="tag">Case study</span>' : "") + "</span><b>" + esc(s.title) + "</b><span>" + esc(s.short) + '</span><span class="go">Read ' + arrowSm() + "</span></span></button>";
  }
  function caseCard(c) {
    return '<button class="ccard" type="button" data-go="' + c.route + '">' + stage(c.img, "", c.title) + '<div class="t"><span class="eyebrow">Case study</span><b>' + esc(c.title) + "</b><span>" + esc(c.sub) + "</span></div></button>";
  }
  SCREENS.applications = function (sel) {
    sel = sel || "industries";
    var body = "";
    if (sel === "industries") {
      body = '<div class="ind-grid">' + A.fields.map(function (f) {
        var n = (f.stories || []).length + (f.cases || []).length;
        return '<button class="ind" type="button" data-go="industry/' + f.id + '">' + fieldVisual(f) + "<span>" + esc(f.name) + (n ? '<small>' + n + (n === 1 ? " example" : " examples") + "</small>" : "") + "</span></button>";
      }).join("") + "</div>";
    } else if (sel === "techniques") {
      body = '<div class="cols3">' + Object.keys(A.techniques).map(function (k) {
        var t = A.techniques[k];
        return '<button class="panel tcard" type="button" data-go="technique/' + k + '"><span class="eyebrow">' + esc(t.long) + '</span><h2 class="h2">' + esc(t.name) + "</h2><p>" + esc(plain(t.points[0])) + '</p><span class="muted small">' + t.stories.length + " application" + (t.stories.length === 1 ? "" : "s") + '</span><span class="linkish">Explore ' + arrowSm() + "</span></button>";
      }).join("") + "</div>";
    } else {
      body = '<div class="cols2">' + A.cases.map(caseCard).join("") + "</div>";
    }
    return {
      crumb: crumb("Applications", { industries: "By industry", techniques: "By technique", cases: "Case studies" }[sel]),
      html: pageHead("Applications", "Where Hellma probes measure", esc(A.intro)) +
        tabs([["industries", "By industry"], ["techniques", "By technique"], ["cases", "Case studies"]], sel, "applications") + body + note(A.relatedCheck),
    };
  };
  SCREENS.industries = function () { return SCREENS.applications("industries"); };

  SCREENS.industry = function (id) {
    var f = fieldOf(id);
    var stories = (f.stories || []).map(storyCard).join("");
    var cases = (f.cases || []).map(function (cid) { return caseCard(A.cases.filter(function (c) { return c.id === cid; })[0]); }).join("");
    var rel = (f.related || []).map(relItem).filter(Boolean).map(mini).join("");
    return {
      crumb: crumb("Applications", f.name),
      html: '<section class="ind-hero"><div class="ph">' + fieldVisual(f) + '</div><div style="display:grid;gap:.7rem;align-content:center"><div class="eyebrow">Industry</div><h1 class="h1">' + esc(f.name) + '</h1><p class="lead">' + T(f.text) + "</p></div></section>" +
        (stories ? '<section style="display:grid;gap:.8rem"><h2 class="h2">Examples</h2><div class="scards">' + stories + "</div></section>" : "") +
        (cases ? '<section style="display:grid;gap:.8rem"><h2 class="h2">' + ((f.cases || []).length > 1 ? "Case studies" : "Case study") + '</h2><div class="cols2">' + cases + "</div></section>" : "") +
        (rel ? '<section style="display:grid;gap:.8rem"><h2 class="h2">Probes to look at</h2><div class="minis">' + rel + "</div></section>" : "") +
        (!stories && !cases ? '<div class="empty"><p>Tell us about your process and our application team will suggest a setup.</p><button class="btn primary" type="button" data-req="applications">' + I.mail + "Discuss your application</button></div>" :
          '<div class="row"><button class="btn primary" type="button" data-req="applications">' + I.mail + "Discuss your application</button></div>"),
    };
  };

  function techChart(key) {
    if (key === "nirbands") return DG.nirBands();
    if (key === "ramangas") return DG.ramanGas();
    return DG.charts[key] ? DG.charts[key]() : "";
  }
  SCREENS.technique = function (id) {
    var t = A.techniques[id];
    var ex = t.example ? '<section class="panel sky" style="gap:1rem"><h2 class="h2">' + esc(t.example.title) + '</h2><div class="cols2" style="align-items:center"><p>' + esc(t.example.text) + '</p><div class="diagram">' + techChart(t.example.chart) + "</div></div></section>" : "";
    return {
      crumb: crumb("Applications", t.name),
      html: pageHead(t.long, t.name, null) +
        (t.wide ? bullets(t.points) + '<figure class="chartfig"><div class="diagram" id="techchart">' + techChart(t.chart) + '</div><figcaption>' + T(t.chartNote) + "</figcaption></figure>"
          : '<div class="cols2" style="align-items:start"><div style="display:grid;gap:1rem">' + bullets(t.points) + "</div>" +
          '<figure class="chartfig"><div class="diagram" id="techchart">' + techChart(t.chart) + '</div><figcaption>' + T(t.chartNote) + "</figcaption></figure></div>") + ex +
        '<section style="display:grid;gap:.8rem"><h2 class="h2">Applications</h2><div class="scards">' + t.stories.map(storyCard).join("") + "</div></section>",
      init: function (root) {
        var nb = $("#techchart .nbsvg", root); if (!nb) return;
        nb.addEventListener("click", function (e) {
          var g = e.target.closest(".nbr"); if (!g) return;
          steady(function () {
            var same = nb.getAttribute("data-sel") === g.dataset.r;
            $$(".nbr", nb).forEach(function (o) { o.classList.toggle("on", !same && o === g); });
            if (same) nb.removeAttribute("data-sel"); else nb.setAttribute("data-sel", g.dataset.r);
          });
        });
      },
    };
  };

  function labToRgb(L, a, b) {
    var fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
    function f(t) { return t * t * t > 0.008856 ? t * t * t : (t - 16 / 116) / 7.787; }
    var X = 0.95047 * f(fx), Y = 1.0 * f(fy), Z = 1.08883 * f(fz);
    var r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, bl = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    function gm(c) { c = c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c; return Math.round(Math.max(0, Math.min(1, c)) * 255); }
    return "rgb(" + gm(r) + "," + gm(g) + "," + gm(bl) + ")";
  }
  SCREENS.app = function (id) {
    var s = A.stories[id], t = techOf(s);
    var techTags = (s.techniques || (s.technique ? [s.technique] : [])).map(function (k) { return '<span class="tag solid">' + esc(A.techniques[k].name) + "</span>"; }).join("") || '<span class="tag solid">' + esc(t.name) + "</span>";
    var fields = s.fields.map(function (fid) { var f = fieldOf(fid); return '<button class="tag" type="button" data-go="industry/' + fid + '">' + esc(f.name) + "</button>"; }).join("");
    var blocks = s.blocks.map(function (bl) { return '<div class="sblock"><h3 class="h3">' + esc(bl.h) + "</h3><p>" + nb(esc(bl.t)) + "</p></div>"; }).join("");
    var params = s.params ? '<div class="params">' + s.params.map(function (p) { return "<div><b>" + esc(p[0]) + "</b>" + (p[1] ? "<span>" + esc(p[1]) + "</span>" : "") + "</div>"; }).join("") + "</div>" : "";
    var quote = s.quote ? '<blockquote class="squote"><p>“' + esc(s.quote.t) + '”</p><cite>' + esc(s.quote.who) + "</cite></blockquote>" : "";
    var visual = "";
    if (s.chart === "lab") {
      visual = '<div class="labx" id="labx"><div class="swatch" id="lab-sw"></div><div class="sliders">' +
        [["L", "L*", 0, 100, 60, "dark", "light"], ["a", "a*", -80, 80, 20, "green", "red"], ["b", "b*", -80, 80, -40, "blue", "yellow"]].map(function (r) {
          return '<label class="sl"><span class="k">' + r[1] + '</span><input type="range" id="lab-' + r[0] + '" min="' + r[2] + '" max="' + r[3] + '" value="' + r[4] + '" step="1"><span class="ends"><i>' + r[5] + "</i><i>" + r[6] + '</i></span><output id="lab-' + r[0] + 'o"></output></label>';
        }).join("") + "</div></div>";
    } else if (s.chart === "dilution") visual = '<div class="diagram">' + DG.dilution() + "</div>";
    else if (s.chart) visual = '<figure class="chartfig"><div class="diagram">' + DG.charts[s.chart]() + "</div>" + (s.chartNote ? "<figcaption>" + esc(s.chartNote) + "</figcaption>" : "") + "</figure>";
    (s.charts || []).forEach(function (c) { visual += '<figure class="chartfig"><div class="diagram">' + techChart(c.key) + "</div><figcaption>" + esc(c.note) + "</figcaption></figure>"; });
    var figs = (s.figs || []).map(function (f) { return '<figure class="chartfig sfig">' + figure(f.img, f.cap) + "<figcaption>" + esc(f.cap) + "</figcaption></figure>"; }).join("");
    var ranges = s.ranges ? '<figure class="chartfig"><div class="diagram">' + DG.ranges(s.ranges) + "</div><figcaption>Characteristic mixture. O₂ and N₂ are only visible to Raman.</figcaption></figure>" : "";
    var tables = (s.tables || []).map(function (tb) {
      return '<div class="tablewrap2"><table class="datatable"><caption>' + esc(tb.caption) + '</caption><thead><tr><th></th><th>Color</th><th>L*</th><th>±</th><th>a*</th><th>±</th><th>b*</th><th>±</th></tr></thead><tbody>' +
        tb.rows.map(function (r) { return "<tr><th>" + esc(r[0]) + '</th><td><i class="sw" style="background:' + labToRgb(r[1], r[3], r[5]) + '"></i></td>' + [1, 2, 3, 4, 5, 6].map(function (k) { return "<td>" + r[k].toFixed(2) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table>" + note(tb.check) + "</div>";
    }).join("");
    var measured = s.measured ? '<div style="display:grid;gap:.5rem"><div class="eyebrow" style="color:var(--grey-7)">What is measured</div><div class="row" style="gap:.4rem">' + s.measured.map(function (m) { return '<span class="pill">' + esc(m) + "</span>"; }).join("") + "</div></div>" : "";
    var rel = s.related.map(relItem).filter(Boolean).map(mini).join("");
    var hero = s.img && s.hero !== false && isPhoto(s.img) ? '<div class="shero">' + img(s.img, s.title) + "</div>" : "";
    var side = visual + figs + (s.blocks.length ? ranges : "");
    return {
      crumb: crumb(s.isCase ? "Case study" : "Applications", s.title.split(":")[0]),
      html: '<header class="pagehead"><div class="row" style="gap:.4rem">' + techTags + fields + (s.isCase ? '<span class="tag">Case study</span>' : "") + (s.customer ? '<span class="tag">Customer: ' + esc(s.customer) + "</span>" : "") + '</div><h1 class="h1">' + esc(s.title) + '</h1><p class="lead">' + nb(esc(s.lead)) + "</p></header>" + hero +
        '<div class="story' + (side ? "" : " solo") + '"><div class="sbody">' + blocks + quote + params + measured + (s.blocks.length ? "" : ranges) + note(s.check) + foot(s.foot) + "</div>" + (side ? '<div class="svis">' + side + "</div>" : "") + "</div>" + tables +
        (s.credit ? '<p class="credit">' + esc(s.credit) + "</p>" : "") +
        (rel ? '<section style="display:grid;gap:.8rem"><h2 class="h2">' + (s.isCase ? "Probes in this story" : "Probes and principles to look at") + '</h2><div class="minis">' + rel + "</div></section>" : "") +
        '<div class="row"><button class="btn primary" type="button" data-req="applications">' + I.mail + "Discuss a similar application</button>" +
        (A.techniques[s.technique] ? '<button class="btn" type="button" data-go="technique/' + s.technique + '">More ' + esc(t.name) + " applications</button>" : '<button class="btn" type="button" data-go="applications">All applications</button>') + "</div>",
      init: function (root) {
        var lx = $("#labx", root); if (!lx) return;
        function upd() {
          var L = +$("#lab-L", lx).value, a = +$("#lab-a", lx).value, b = +$("#lab-b", lx).value;
          $("#lab-sw", lx).style.background = labToRgb(L, a, b);
          $("#lab-Lo", lx).textContent = L; $("#lab-ao", lx).textContent = a; $("#lab-bo", lx).textContent = b;
        }
        $$("input", lx).forEach(function (i) { i.addEventListener("input", upd); });
        upd();
      },
    };
  };

  SCREENS.about = function () {
    var X = C.about;
    return {
      crumb: crumb("About Hellma"),
      html: banner("About Hellma", "Molecular spectroscopy, in the lab and in the process", esc(X.promise)) + note(X.check) +
        '<section style="display:grid;gap:.8rem"><div class="eyebrow">Hellma worldwide</div><div class="stats">' + X.group.map(function (s) { return '<div class="stat"><span class="n">' + esc(s.n) + '</span><span class="l">' + esc(s.l) + "</span></div>"; }).join("") + "</div></section>" +
        '<section style="display:grid;gap:.8rem"><div class="eyebrow">From raw material to complete solution</div><div class="chain">' + X.chain.map(function (c) { return '<div><div class="ph">' + (isPhoto(c.img) ? img(c.img, c.name) : stage(c.img, "", c.name)) + '</div><b style="font-weight:500">' + esc(c.name) + "</b></div>"; }).join("") + "</div></section>" +
        '<div class="cols2" style="align-items:start"><section class="panel"><div class="eyebrow">Production sites</div><div class="sites">' + X.sites.map(function (s) { return "<div><b>" + esc(s.place) + '</b><span class="muted small">' + esc(s.co) + " · " + esc(s.area) + "</span></div>"; }).join("") + "</div></section>" +
        '<section class="panel sky"><div class="eyebrow">Hellma USA</div><div class="row" style="gap:2rem">' + X.usa.map(function (s) { return '<div class="stat"><span class="n" style="font-size:2rem">' + esc(s.n) + '</span><span class="l">' + esc(s.l) + "</span></div>"; }).join("") + "</div>" +
        '<div class="eyebrow" style="color:var(--grey-7)">Sales subsidiaries</div><div class="row" style="gap:.4rem">' + X.subsidiaries.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div></section></div>",
    };
  };

  /* ---------------- Lead form ---------------- */
  var FIELDS = [
    ["first", "First name", true, "given-name"], ["last", "Last name", true, "family-name"],
    ["company", "Company", true, "organization"], ["title", "Job title", false, "organization-title"],
    ["email", "Email", true, "email"], ["phone", "Phone", false, "tel"],
    ["loc", "City, state or country", false, "address-level1"],
  ];
  function contextInterests() {
    var set = {};
    var fam = {};
    Object.keys(C.products).forEach(function (k) { fam[C.products[k].name] = C.products[k].family; });
    S.viewed.forEach(function (n) { if (fam[n]) set[fam[n]] = 1; });
    var r = current || "";
    if (r.indexOf("retractables") === 0) set.retractables = 1;
    if (r.indexOf("multiplexers") === 0) set.multiplexers = 1;
    if (r.indexOf("solutions/sensors") === 0) set.sensors = 1;
    if (r.indexOf("solutions/custom") === 0) set.custom = 1;
    if (r.indexOf("case") === 0 || r.indexOf("solutions/services") === 0) set.services = 1;
    if (r.indexOf("product/") === 0) set[C.products[r.split("/")[1]].family] = 1;
    if (r.indexOf("principles/raman") === 0) set.tidus = 1;
    if (r.indexOf("principles/fluorescence") === 0) set.espada = 1;
    if (/^(applications|app\/|industry\/|technique\/)/.test(r)) set.applications = 1;
    return Object.keys(set);
  }
  function openForm(extra) {
    if (!S.form) S.form = { v: {}, interests: [], requests: [], consent: false };
    var add = contextInterests().concat(extra ? [extra] : []);
    add.forEach(function (k) { if (S.form.interests.indexOf(k) < 0) S.form.interests.push(k); });
    go("contact");
  }
  SCREENS.contact = function () {
    if (!S.form) S.form = { v: {}, interests: contextInterests(), requests: [], consent: false };
    var F = S.form, L = C.leadForm, ct = C.contact;
    var fields = FIELDS.map(function (f) {
      return '<div class="field' + (f[0] === "loc" ? " full" : "") + '" data-field="' + f[0] + '"><label for="f-' + f[0] + '">' + esc(f[1]) + (f[2] ? " <b>*</b>" : "") + "</label>" +
        '<input id="f-' + f[0] + '" name="' + f[0] + '" type="' + (f[0] === "email" ? "email" : f[0] === "phone" ? "tel" : "text") + '" autocomplete="off" autocorrect="off" spellcheck="false" ' + (f[0] === "email" ? 'autocapitalize="off" inputmode="email"' : 'autocapitalize="words"') + ' value="' + esc(F.v[f[0]] || "") + '"><span class="msg"></span></div>';
    }).join("");
    var ints = '<div class="field full"><span class="lab">I\'m interested in</span><div class="row" style="gap:.45rem">' + L.interests.map(function (i) { return '<button class="chip" type="button" data-int="' + i.id + '" aria-pressed="' + (F.interests.indexOf(i.id) >= 0) + '">' + esc(i.label) + "</button>"; }).join("") + "</div></div>";
    var reqs = '<div class="field full"><span class="lab">What would help?</span><div class="row" style="gap:.45rem">' + L.requests.map(function (r) { return '<button class="chip" type="button" data-rq="' + esc(r) + '" aria-pressed="' + (F.requests.indexOf(r) >= 0) + '">' + esc(r) + "</button>"; }).join("") + "</div></div>";
    return {
      crumb: crumb("Request information"), noCta: true,
      html: pageHead("Hellma USA", L.title, esc(L.sub)) +
        '<form class="form" id="lead" novalidate autocomplete="off">' + fields + ints + reqs +
        '<div class="field full"><label for="f-msg">Tell us about your process (optional)</label><textarea id="f-msg" name="msg" placeholder="Medium, temperature, pressure, what you want to measure">' + esc(F.v.msg || "") + "</textarea></div>" +
        '<div class="field full"><button class="check" type="button" id="f-consent" role="checkbox" aria-checked="' + F.consent + '"><span class="box">' + I.check + "</span><span>" + esc(L.consent) + '<br><span class="muted small">' + esc(L.privacy) + '</span></span></button><span class="msg" id="consent-msg"></span></div>' +
        '<div class="field full"><div class="row"><button class="btn primary" type="submit" style="min-width:14rem">' + I.mail + 'Send request</button><span class="muted small">* Required</span></div></div></form>' +
        '<section class="panel sky" style="max-width:34rem"><div class="eyebrow">Your contact at Hellma USA</div><h2 class="h3">' + esc(ct.name) + '</h2><p class="muted">' + esc(ct.role) + "</p><p>" + esc(ct.phone) + "<br>" + esc(ct.email) + "<br>" + esc(ct.web) + "</p>" + note(ct.check) + "</section>",
      init: function (root) {
        var form = $("#lead", root);
        $$("input, textarea", form).forEach(function (el) {
          el.addEventListener("input", function () { F.v[el.name] = el.value; var fd = el.closest(".field"); fd.classList.remove("err"); var m = $(".msg", fd); if (m) m.textContent = ""; });
          el.addEventListener("focus", function () { setTimeout(function () { el.scrollIntoView({ block: "center", behavior: "smooth" }); }, 300); });
        });
        $$("[data-int]", form).forEach(function (b) { b.onclick = function () { var k = b.dataset.int, i = F.interests.indexOf(k); if (i >= 0) F.interests.splice(i, 1); else F.interests.push(k); b.setAttribute("aria-pressed", i < 0); }; });
        $$("[data-rq]", form).forEach(function (b) { b.onclick = function () { var k = b.dataset.rq, i = F.requests.indexOf(k); if (i >= 0) F.requests.splice(i, 1); else F.requests.push(k); b.setAttribute("aria-pressed", i < 0); }; });
        var cons = $("#f-consent", form);
        cons.onclick = function () { F.consent = !F.consent; cons.setAttribute("aria-checked", F.consent); cons.classList.remove("err"); $("#consent-msg", form).textContent = ""; };
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var bad = null;
          FIELDS.forEach(function (f) {
            var el = $("#f-" + f[0], form), v = (el.value || "").trim(), fd = el.closest(".field"), msg = "";
            if (f[2] && !v) msg = f[1] + " is required.";
            else if (f[0] === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = "Check the email address. It needs an @ and a domain, like name@company.com.";
            if (msg) { fd.classList.add("err"); $(".msg", fd).textContent = msg; if (!bad) bad = el; }
          });
          if (!F.consent) { cons.classList.add("err"); $("#consent-msg", form).textContent = "Please tick the box so our team may contact you."; if (!bad) bad = cons; }
          if (bad) { bad.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
          var v = {}; FIELDS.forEach(function (f) { v[f[0]] = ($("#f-" + f[0], form).value || "").trim(); });
          var lead = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), ts: Date.now(), event: settings.event || "",
            first: v.first, last: v.last, company: v.company, title: v.title, email: v.email, phone: v.phone, location: v.loc,
            interests: F.interests.map(function (k) { var o = C.leadForm.interests.filter(function (i) { return i.id === k; })[0]; return o ? o.label : k; }),
            requests: F.requests.slice(), message: ($("#f-msg", form).value || "").trim(), consent: true, viewed: S.viewed.slice(),
          };
          Store.add(lead).then(function (ok) {
            if (!ok) toast("This request could not be saved on the device. Please tell a member of staff.", 6000);
            var first = lead.first; S.form = null; go("thanks/" + encodeURIComponent(first), { replace: true });
          });
        });
      },
    };
  };
  var thanksTimer = null;
  SCREENS.thanks = function (name) {
    return {
      crumb: crumb("Request sent"), noCta: true,
      html: '<div class="thanks"><div class="inner"><div class="mark">' + I.check + '</div><h1 class="h1">Thank you, ' + esc(decodeURIComponent(name || "")) + '.</h1><p class="lead">Your request is saved. Our team will be in touch after the show.</p>' +
        '<div class="row" style="justify-content:center"><button class="btn primary" type="button" id="done">Done</button><button class="btn" type="button" data-go="home">Keep exploring</button></div></div></div>',
      init: function (root) {
        clearTimeout(thanksTimer);
        thanksTimer = setTimeout(function () { if (current && current.indexOf("thanks") === 0) go("attract"); }, 12000);
        $("#done", root).onclick = function () { clearTimeout(thanksTimer); go("attract"); };
      },
    };
  };

  /* ---------------- Global taps ---------------- */
  app.addEventListener("click", function (e) {
    var t = e.target;
    if (document.body.classList.contains("review")) {
      var chk = t.closest(".chk"); if (chk) { toast("To confirm: " + chk.dataset.note, 6000); }
    }
    var z = t.closest("[data-zoom]"); if (z) { lightbox(z.dataset.zoom, z.dataset.cap); return; }
    var g = t.closest("[data-go]"); if (g) { go(g.dataset.go); return; }
    var tb = t.closest("[data-tab]"); if (tb) { go(tb.dataset.tab, { replace: true, keepScroll: true }); return; }
    var r = t.closest("[data-req]"); if (r) { openForm(r.dataset.req); return; }
  });
  $("#btn-back").onclick = back;
  $("#btn-home").onclick = function () { go("home"); };
  $("#cta").onclick = function () { openForm(); };

  /* ---------------- Lightbox ---------------- */
  var lb = $("#lightbox");
  function lightbox(id, cap) {
    lb.innerHTML = '<div class="bar"><span>' + esc(cap || "") + '</span><div class="row"><button class="btn" type="button" id="lb-zoom">' + I.zoom + 'Zoom</button><button class="btn" type="button" id="lb-close">' + I.close + "Close</button></div></div>" +
      '<div class="scroller">' + img(id, cap || "") + "</div>";
    lb.hidden = false; lb.classList.remove("zoomed");
    $("#lb-close").onclick = function () { lb.hidden = true; };
    $("#lb-zoom").onclick = function () { lb.classList.toggle("zoomed"); };
    $("img", lb).onclick = function () { lb.classList.toggle("zoomed"); };
  }

  /* ---------------- Idle reset ---------------- */
  var lastTouch = Date.now(), idleOn = false, idleTick = null;
  var idleEl = $("#idle");
  function touched() { lastTouch = Date.now(); if (idleOn) hideIdle(); }
  ["pointerdown", "touchstart", "keydown", "input", "wheel"].forEach(function (ev) { document.addEventListener(ev, touched, { capture: true, passive: true }); });
  view.addEventListener("scroll", touched, { passive: true });
  function hideIdle() { idleOn = false; idleEl.hidden = true; clearInterval(idleTick); }
  function showIdle() {
    idleOn = true; idleEl.hidden = false;
    var left = C.settings.warnSeconds, total = left, R = 44, L = 2 * Math.PI * R;
    function draw() {
      idleEl.innerHTML = '<div class="sheet"><div class="countdown"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="' + R + '" fill="none" stroke="#e4eef7" stroke-width="8"/><circle cx="50" cy="50" r="' + R + '" fill="none" stroke="#0072b6" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + L + '" stroke-dashoffset="' + (L * (1 - left / total)) + '"/></svg><b>' + left + "</b></div>" +
        '<h2 class="h2">Still exploring?</h2><p class="muted">The kiosk will start over for the next visitor, and anything you typed will be cleared.</p><button class="btn primary" type="button">Keep exploring</button></div>';
    }
    draw();
    idleTick = setInterval(function () {
      left -= 1;
      if (left <= 0) { hideIdle(); go("attract"); return; }
      draw();
    }, 1000);
  }
  setInterval(function () {
    if (current === "attract" || idleOn || !$("#staff").hidden || !$("#pin").hidden) return;
    if (Date.now() - lastTouch > settings.idle * 1000) showIdle();
  }, 1000);
  function closeOverlays() { hideIdle(); lb.hidden = true; $("#pin").hidden = true; $("#staff").hidden = true; clearInterval(muxTimer); clearTimeout(thanksTimer); }

  /* ---------------- Staff access: 5 taps on the logo, then PIN ---------------- */
  var taps = [];
  $("#logo-btn").addEventListener("click", function () {
    var now = Date.now(); taps = taps.filter(function (t) { return now - t < 3000; }); taps.push(now);
    if (taps.length >= 5) { taps = []; openPin(); return; }
    /* A single tap goes home; the next taps of a staff sequence land on the home screen and do nothing else */
    if (current !== "home" && current !== "attract") go("home");
  });
  function openPin() {
    var pin = $("#pin"), entered = "";
    function draw(err) {
      pin.innerHTML = '<div class="sheet' + (err ? " shake" : "") + '" style="width:min(100%,24rem);justify-items:center;text-align:center"><h2 class="h2">Staff access</h2><p class="muted small">Enter the 4-digit PIN.</p>' +
        '<div class="pindots">' + [0, 1, 2, 3].map(function (i) { return "<i" + (i < entered.length ? ' class="on"' : "") + "></i>"; }).join("") + "</div>" +
        '<div class="pinpad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "×"].map(function (k) { return k === "" ? "<span></span>" : '<button type="button" data-k="' + k + '">' + k + "</button>"; }).join("") + "</div>" +
        '<button class="btn" type="button" id="pin-cancel">Cancel</button></div>';
      $$("[data-k]", pin).forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k;
          if (k === "×") entered = entered.slice(0, -1); else if (entered.length < 4) entered += k;
          if (entered.length === 4) {
            if (entered === String(settings.pin)) { pin.hidden = true; openStaff(); return; }
            entered = ""; draw(true); return;
          }
          draw();
        };
      });
      $("#pin-cancel", pin).onclick = function () { pin.hidden = true; };
    }
    pin.hidden = false; draw();
  }

  function csvOf(leads) {
    var cols = ["Date", "Time", "Event", "First name", "Last name", "Company", "Job title", "Email", "Phone", "Location", "Interested in", "Requests", "Message", "Products viewed", "Consent"];
    function q(v) { v = String(v == null ? "" : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    var rows = leads.slice().sort(function (a, b) { return a.ts - b.ts; }).map(function (l) {
      var d = new Date(l.ts);
      var date = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      var time = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
      return [date, time, l.event, l.first, l.last, l.company, l.title, l.email, l.phone, l.location, (l.interests || []).join("; "), (l.requests || []).join("; "), l.message, (l.viewed || []).join("; "), l.consent ? "Yes" : "No"].map(q).join(",");
    });
    return "﻿" + cols.join(",") + "\n" + rows.join("\n") + "\n";
  }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta);
      ta.focus(); ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) { }
      ta.remove(); return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  }
  function collectChecks() {
    var out = [];
    (function walk(o, path) {
      if (!o || typeof o !== "object") return;
      if (typeof o.check === "string") out.push({ path: path, note: o.check, v: o.v });
      Object.keys(o).forEach(function (k) {
        if (k === "check") return;
        if (/Check$/.test(k) && typeof o[k] === "string") out.push({ path: path + " › " + k.replace(/Check$/, ""), note: o[k] });
        walk(o[k], path ? path + " › " + k : k);
      });
    })(C, "");
    return out;
  }

  function openStaff() {
    var st = $("#staff");
    Store.all().then(function (leads) {
      var rows = leads.map(function (l) {
        var d = new Date(l.ts);
        return "<tr><td>" + d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + "</td><td>" + esc(l.first + " " + l.last) + "</td><td>" + esc(l.company) + "</td><td>" + esc(l.email) + "</td><td>" + esc((l.interests || []).join(", ")) + "</td><td>" + esc((l.requests || []).join(", ")) + "</td></tr>";
      }).join("");
      var checks = collectChecks();
      st.innerHTML = '<div class="sheet">' +
        '<div class="row" style="justify-content:space-between"><div><div class="eyebrow">Staff only</div><h1 class="h1" style="font-size:2rem">Kiosk settings and leads</h1></div><button class="btn" type="button" id="st-close">' + I.close + "Close</button></div>" +
        '<div class="cols3"><div class="stat"><span class="n">' + leads.length + '</span><span class="l">Leads stored on this iPad</span></div>' +
        '<div class="stat"><span class="n" style="font-size:1.4rem">' + (leads[0] ? new Date(leads[0].ts).toLocaleString() : "None yet") + '</span><span class="l">Latest lead</span></div>' +
        '<div class="stat"><span class="n" style="font-size:1.4rem">' + (Store.ok ? "IndexedDB + backup" : "Backup storage only") + '</span><span class="l">Storage</span></div></div>' +
        '<section class="panel"><h2 class="h3">Export leads</h2><p class="muted small">Export at the end of each day. Leads stay on this iPad until you delete them.</p>' +
        '<div class="row">' + (CAN_SHARE_FILES ? '<button class="btn primary" type="button" id="st-share">Share CSV (Mail, AirDrop, Files)</button>' : "") + '<button class="btn' + (CAN_SHARE_FILES ? "" : " primary") + '" type="button" id="st-dl">Download CSV</button><button class="btn" type="button" id="st-copy">Copy CSV</button><button class="btn" type="button" id="st-show">Show as text</button>' +
        '<button class="btn hold" type="button" id="st-del"><i></i>Hold 3 s to delete all leads</button></div><textarea id="st-text" hidden readonly></textarea>' +
        '<div class="tablewrap"><table><thead><tr><th>When</th><th>Name</th><th>Company</th><th>Email</th><th>Interested in</th><th>Requests</th></tr></thead><tbody>' + (rows || '<tr><td colspan="6" class="muted">No leads yet.</td></tr>') + "</tbody></table></div></section>" +
        '<section class="panel"><h2 class="h3">Settings</h2><div class="cols2">' +
        '<label class="field"><span class="lab">Event name (saved with each lead)</span><input type="text" id="st-event" value="' + esc(settings.event) + '" placeholder="e.g. IFPAC 2027"></label>' +
        '<label class="field"><span class="lab">Start over after no touch for</span><select id="st-idle">' + [60, 90, 120, 180, 300].map(function (s) { return '<option value="' + s + '"' + (s === settings.idle ? " selected" : "") + ">" + s + " seconds</option>"; }).join("") + "</select></label>" +
        '<label class="field"><span class="lab">New 4-digit PIN</span><input type="text" id="st-pin" inputmode="numeric" maxlength="4" placeholder="Leave empty to keep the current PIN"></label>' +
        '<div class="field"><span class="lab">Review mode</span><button class="check" type="button" id="st-review" role="checkbox" aria-checked="' + settings.review + '"><span class="box">' + I.check + "</span><span>Highlight values to confirm (" + checks.length + ")</span></button></div>" +
        '<div class="field"><span class="lab">Animation</span><button class="check" type="button" id="st-motion" role="checkbox" aria-checked="' + (settings.motion === "always") + '"><span class="box">' + I.check + "</span><span>Animate diagrams even when the iPad's Reduce Motion is on</span></button></div>" +
        '</div><div class="row"><button class="btn primary" type="button" id="st-save">Save settings</button><button class="btn" type="button" id="st-attract">Start attract screen</button></div></section>' +
        '<section class="panel"><h2 class="h3">This iPad</h2><div class="cols3">' +
        '<div class="stat"><span class="l">Opened as</span><span class="n" style="font-size:1.15rem">' + (standalone() ? "Home Screen app" : "Browser tab") + "</span></div>" +
        '<div class="stat"><span class="l">Offline</span><span class="n" style="font-size:1.15rem" id="st-offline">Checking…</span></div>' +
        '<div class="stat"><span class="l">Lead storage</span><span class="n" style="font-size:1.15rem" id="st-persist">Checking…</span></div></div>' +
        (window.KIOSK_PWA ? '<div class="row"><button class="btn" type="button" id="st-update">Check for update</button><span class="muted small">Updates also install on their own when the iPad is online, at the next start-over.</span></div>' : "") + "</section>" +
        '<section class="panel"><h2 class="h3">Open questions in the content (' + checks.length + ')</h2><p class="muted small">These values are shown on the kiosk but still need confirming. With review mode on they are outlined in orange; tap one to read its note.</p>' +
        '<div class="tablewrap" style="max-height:none"><table><tbody>' + checks.map(function (c) { return '<tr><td style="width:30%">' + esc(c.path.replace(/^(\w+) › /, "$1 › ")) + "</td><td>" + (c.v ? "<b style=\"font-weight:500\">" + esc(c.v) + "</b><br>" : "") + esc(c.note) + "</td></tr>"; }).join("") + "</tbody></table></div></section>" +
        '<p class="muted small">' + esc(C.meta.title) + " kiosk · version " + esc(C.meta.version) + " · built " + esc(window.KIOSK_BUILT || "") + "</p></div>";
      st.hidden = false;
      offlineStatus().then(function (t) { var e = $("#st-offline", st); if (e) e.textContent = t; });
      storageStatus().then(function (t) { var e = $("#st-persist", st); if (e) e.textContent = t; });
      var upd = $("#st-update", st);
      if (upd) upd.onclick = function () {
        if (!PWA.reg) { toast("Updates work when the kiosk is opened from its web address."); return; }
        toast("Checking for an update…");
        if (PWA.updateReady) { toast("Update installed. Restarting…"); setTimeout(function () { location.reload(); }, 800); return; }
        var t0 = Date.now();
        PWA.reg.update().then(function () {
          if (PWA.reg.installing || PWA.reg.waiting) toast("Downloading the update. The kiosk restarts when it's ready.", 8000);
          var poll = setInterval(function () {
            if (PWA.updateReady) { clearInterval(poll); toast("Update installed. Restarting…"); setTimeout(function () { location.reload(); }, 800); return; }
            if (!(PWA.reg.installing || PWA.reg.waiting) && Date.now() - t0 > 5000) { clearInterval(poll); toast("This is the latest version."); }
          }, 300);
        }, function () { toast("Couldn't reach the server. Check the Wi-Fi and try again."); });
      };
      var sh = $("#st-share", st);
      if (sh) sh.onclick = function () {
        var name = "hellma-leads-" + new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-") + ".csv";
        var file = new File([csvOf(leads)], name, { type: "text/csv" });
        navigator.share({ files: [file], title: "Hellma kiosk leads" }).catch(function (e) { if (e && e.name !== "AbortError") toast("Sharing didn't work here. Use Copy CSV instead."); });
      };
      $("#st-close", st).onclick = function () { st.hidden = true; };
      $("#st-attract", st).onclick = function () { st.hidden = true; go("attract"); };
      $("#st-motion", st).onclick = function () { var b = $("#st-motion", st), on = b.getAttribute("aria-checked") !== "true"; b.setAttribute("aria-checked", on); settings.motion = on ? "always" : "system"; saveSettings(); document.body.classList.toggle("motion-always", on); };
      $("#st-review", st).onclick = function () { var b = $("#st-review", st), on = b.getAttribute("aria-checked") !== "true"; b.setAttribute("aria-checked", on); settings.review = on; saveSettings(); document.body.classList.toggle("review", on); };
      $("#st-save", st).onclick = function () {
        settings.event = $("#st-event", st).value.trim(); settings.idle = Number($("#st-idle", st).value);
        var np = $("#st-pin", st).value.trim();
        if (np && !/^\d{4}$/.test(np)) { toast("The PIN must be exactly 4 digits."); return; }
        if (np) settings.pin = np;
        var ok = saveSettings(); toast(np ? "Settings saved. New PIN is active." : "Settings saved.");
      };
      $("#st-dl", st).onclick = function () {
        var csv = csvOf(leads), name = "hellma-leads-" + new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-") + ".csv";
        try {
          var blob = new Blob([csv], { type: "text/csv;charset=utf-8" }), url = URL.createObjectURL(blob);
          var a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          toast("Download started. If nothing happens, use Copy CSV or Show as text.", 5000);
        } catch (e) { toast("Download isn't available here. Use Copy CSV or Show as text.", 5000); }
      };
      $("#st-copy", st).onclick = function () { copyText(csvOf(leads)).then(function (ok) { toast(ok ? "Copied " + leads.length + " leads. Paste into Mail, Notes or Excel." : "Copy was blocked here. Use Show as text, then select all and copy."); }); };
      $("#st-show", st).onclick = function () { var ta = $("#st-text", st); ta.hidden = !ta.hidden; ta.value = csvOf(leads); if (!ta.hidden) { ta.focus(); ta.select(); } };
      var del = $("#st-del", st), holdT = null, holdStart = 0;
      function holdEnd() { clearInterval(holdT); $("i", del).style.width = "0"; }
      del.addEventListener("pointerdown", function () {
        holdStart = Date.now(); clearInterval(holdT);
        holdT = setInterval(function () {
          var p = Math.min(1, (Date.now() - holdStart) / 3000); $("i", del).style.width = (p * 100) + "%";
          if (p >= 1) { holdEnd(); Store.clear().then(function () { toast("All leads deleted from this iPad."); openStaff(); }); }
        }, 50);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { del.addEventListener(ev, holdEnd); });
    });
  }

  /* ---------------- Kiosk hardening ---------------- */
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });
  document.addEventListener("dblclick", function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener("touchmove", function (e) { if (e.touches && e.touches.length > 1 && !e.target.closest("#lightbox")) e.preventDefault(); }, { passive: false });
  document.addEventListener("dragstart", function (e) { e.preventDefault(); });
  document.addEventListener("click", function (e) { var a = e.target.closest("a[href]"); if (a) e.preventDefault(); }, true);
  window.addEventListener("submit", function (e) { e.preventDefault(); }, true);

  /* ---------------- Start ---------------- */
  document.body.classList.toggle("review", !!settings.review);
  /* A kiosk iPad's Reduce Motion setting belongs to the device, not the visitor, so diagrams animate unless staff choose otherwise */
  document.body.classList.toggle("motion-always", settings.motion !== "system");
  buildAttract();
  initPwa();
  Store.init().then(function () { });
  var start = (location.hash || "").replace(/^#/, "");
  if (start && /^[a-z]/.test(start) && SCREENS[start.split("/")[0]]) go(start.replace(/~/g, "/")); else showAttract();
  window.KIOSK_APP = { go: go, store: Store, settings: settings, openStaff: openStaff };
})();
