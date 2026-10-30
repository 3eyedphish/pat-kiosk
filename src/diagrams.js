/* Hand-drawn SVG diagrams for the kiosk. Each builder returns an SVG string.
   Interactive diagrams are drawn once with every state present; the app switches states by toggling
   classes or attributes, so nothing is rebuilt and the page never jumps. */
(function () {
  var uid = 0;
  function P() { uid += 1; return "d" + uid; }

  function defs(p) {
    return '<defs>' +
      '<linearGradient id="' + p + 'm" x1="0" x2="1"><stop offset="0" stop-color="#9aa6b1"/><stop offset=".35" stop-color="#eef2f5"/><stop offset=".6" stop-color="#cfd7de"/><stop offset="1" stop-color="#8d99a5"/></linearGradient>' +
      '<linearGradient id="' + p + 'l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6f6"/><stop offset="1" stop-color="#8fc0e3"/></linearGradient>' +
      '<linearGradient id="' + p + 's" x1="0" x2="1"><stop offset="0" stop-color="#d9f1ff"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#bfe3fb"/></linearGradient>' +
      '<radialGradient id="' + p + 'g"><stop offset="0" stop-color="#7fe0a8" stop-opacity=".95"/><stop offset="1" stop-color="#7fe0a8" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + p + 'w"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + p + 'b"><stop offset="0" stop-color="#8fd0ff" stop-opacity=".9"/><stop offset="1" stop-color="#8fd0ff" stop-opacity="0"/></radialGradient>' +
      '</defs>';
  }
  function liquid(p, y) {
    var w = 'M0 ' + y + ' C 80 ' + (y - 10) + ', 160 ' + (y + 10) + ', 260 ' + y + ' S 440 ' + (y - 10) + ', 520 ' + y + ' V380 H0 Z';
    var parts = '';
    var pts = [[60, y + 60], [120, y + 140], [400, y + 90], [460, y + 170], [90, y + 200], [350, y + 190], [180, y + 110], [430, y + 40]];
    pts.forEach(function (q, i) { parts += '<circle class="particle" style="animation-delay:' + (-i * 0.8) + 's" cx="' + q[0] + '" cy="' + q[1] + '" r="' + (3 + (i % 3)) + '" fill="#ffffff" opacity=".55"/>'; });
    return '<path d="' + w + '" fill="url(#' + p + 'l)"/>' + parts;
  }
  function beam(d, cls) { return '<path class="beam-halo ' + cls + '" d="' + d + '"/><path class="beam ' + cls + '" d="' + d + '"/>'; }
  function label(x, y, text, tx, ty, anchor) {
    var a = anchor || "start";
    return '<path class="leader" d="M' + x + ' ' + y + ' L' + tx + ' ' + ty + '"/><circle cx="' + x + '" cy="' + y + '" r="3" fill="#575756"/>' +
      '<text class="lbl" x="' + (a === "end" ? tx - 6 : tx + 6) + '" y="' + (ty + 5) + '" text-anchor="' + a + '">' + text + '</text>';
  }
  /* Two-line label for longer captions that would run past the edge */
  function label2(x, y, t1, t2, tx, ty, anchor) {
    var a = anchor || "start", lx = a === "end" ? tx - 6 : tx + 6;
    return '<path class="leader" d="M' + x + ' ' + y + ' L' + tx + ' ' + ty + '"/><circle cx="' + x + '" cy="' + y + '" r="3" fill="#575756"/>' +
      '<text class="lbl" x="' + lx + '" y="' + (ty + 5) + '" text-anchor="' + a + '">' + t1 + '</text><text class="lbl" x="' + lx + '" y="' + (ty + 23) + '" text-anchor="' + a + '">' + t2 + '</text>';
  }
  function fiber(x0, w) { x0 = x0 || 226; w = w || 80; return '<rect x="' + x0 + '" y="-6" width="' + w + '" height="50" rx="8" fill="#39434d"/><rect x="' + x0 + '" y="34" width="' + w + '" height="10" fill="#2a323a"/>'; }
  function wrap(p, body, title) { return '<svg viewBox="0 0 520 380" role="img" aria-label="' + title + '">' + defs(p) + body + '</svg>'; }

  var D = {};

  D.transmission = function () {
    var p = P();
    var b = liquid(p, 150) + fiber() +
      '<rect x="215" y="40" width="90" height="170" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="290" y="205" width="15" height="62" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="215" y="262" width="90" height="46" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="222" y="204" width="64" height="6" fill="url(#' + p + 's)" stroke="#8cc7ea"/>' +
      '<rect x="222" y="262" width="64" height="6" fill="url(#' + p + 's)" stroke="#8cc7ea"/>' +
      '<path d="M228 272 L302 272 L302 302 Z" fill="#e8f6ff" stroke="#8cc7ea"/>' +
      '<rect x="226" y="211" width="62" height="50" fill="#ffffff" opacity=".25"/>' +
      beam("M240 0 V286 H297", "in") + beam("M297 286 V0", "out") +
      '<path d="M196 212 V260 M190 212 H202 M190 260 H202" stroke="#0a3a5f" stroke-width="2" fill="none"/>' +
      '<text class="lbl b" x="184" y="232" text-anchor="end">Measuring gap</text><text class="lbl" x="184" y="252" text-anchor="end">= path length</text>' +
      label(286, 207, "Window", 336, 186) + label(282, 290, "Prism turns the light", 336, 330) + label(268, 22, "Optical fibers", 336, 26);
    return wrap(p, b, "Transmission: light crosses the measuring gap once");
  };

  D.transflection = function () {
    var p = P();
    var b = liquid(p, 150) + fiber() +
      '<rect x="215" y="40" width="90" height="160" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="215" y="196" width="12" height="60" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="293" y="196" width="12" height="60" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="215" y="252" width="90" height="44" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="230" y="194" width="60" height="6" fill="url(#' + p + 's)" stroke="#8cc7ea"/>' +
      '<rect x="230" y="250" width="60" height="5" fill="#f4f8fb" stroke="#5e6b77"/>' +
      beam("M250 0 V196 L257 250", "in") + beam("M263 250 L270 196 V0", "out") +
      '<path d="M196 200 V250 M190 200 H202 M190 250 H202" stroke="#0a3a5f" stroke-width="2" fill="none"/>' +
      '<text class="lbl b" x="184" y="222" text-anchor="end">Light crosses</text><text class="lbl" x="184" y="242" text-anchor="end">the gap twice</text>' +
      label(290, 197, "Window", 336, 176) + label(290, 252, "Mirror", 336, 300) + label(268, 22, "Optical fibers", 336, 26);
    return wrap(p, b, "Transflection: light crosses the gap, reflects off a mirror and crosses again");
  };

  D.atr = function () {
    var p = P();
    var glow = function (x, y, d) { return '<circle class="pulse" style="animation-delay:' + d + 's" cx="' + x + '" cy="' + y + '" r="16" fill="url(#' + p + 'g)"/>'; };
    var b = liquid(p, 140) + fiber() +
      '<rect x="215" y="40" width="90" height="176" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<path d="M220 214 L300 214 L275 300 L245 300 Z" fill="url(#' + p + 's)" stroke="#6fb6e3" stroke-width="1.5"/>' +
      glow(226, 258, 0) + glow(260, 306, .5) + glow(294, 258, 1) +
      beam("M232 0 L232.5 257.5 L260 300", "in") + beam("M260 300 L287.5 257.5 L287.5 0", "out") +
      label(276, 236, "Sapphire ATR element", 336, 196) + label(296, 262, "Evanescent field at", 336, 300) +
      '<text class="lbl" x="342" y="325">each of 3 bounces</text>' + label(268, 22, "Optical fibers", 336, 26);
    return wrap(p, b, "ATR: light reflects three times inside a sapphire element touching the medium");
  };

  /* Reflection: illumination down the outer fibers, focused on the sample; diffuse light back up the center */
  D.reflection = function () {
    var p = P();
    var bed = '';
    for (var i = 0; i < 70; i++) {
      var x = (i * 37) % 520, y = 300 + ((i * 53) % 80);
      bed += '<circle cx="' + x + '" cy="' + y + '" r="' + (6 + (i % 4) * 2) + '" fill="' + (i % 3 ? "#d9dfe4" : "#c3ccd4") + '"/>';
    }
    var b = '<rect x="0" y="294" width="520" height="86" fill="#e9edf0"/>' + bed + fiber() +
      '<rect x="215" y="40" width="90" height="120" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="225" y="156" width="70" height="7" fill="url(#' + p + 's)" stroke="#8cc7ea"/>' +
      '<circle cx="260" cy="296" r="24" fill="url(#' + p + 'w)"/>' +
      beam("M232 0 V160 L258 294", "in") + beam("M288 0 V160 L262 294", "in") +
      '<path class="beam out faint" d="M260 294 L196 262"/><path class="beam out faint" d="M260 294 L324 262"/>' +
      '<path class="beam out faint" d="M260 294 L176 284"/><path class="beam out faint" d="M260 294 L344 284"/>' +
      '<path class="beam out faint" d="M260 294 L214 232"/><path class="beam out faint" d="M260 294 L306 232"/>' +
      beam("M260 294 V0", "out") +
      '<path d="M372 163 V292 M366 163 H378 M366 292 H378" stroke="#0a3a5f" stroke-width="2" fill="none"/>' +
      '<text class="lbl b" x="384" y="222">Contact or</text><text class="lbl" x="384" y="242">up to 100 mm</text>' +
      label(232, 100, "Illumination fibers", 150, 92, "end") + label(260, 120, "Collection fiber", 336, 112) +
      label(226, 160, "Window", 150, 150, "end") + label(262, 300, "Diffuse reflection", 150, 330, "end");
    return wrap(p, b, "Reflection: light from the outer fibers is focused on the sample; the center fiber collects the diffusely reflected light");
  };

  /* Fluorescence, Espada geometry: a mirror turns the excitation 90° across the gap, a far mirror sends it
     back for a second pass, the collection fiber sits at 90°, and a bottom mirror returns downward emission */
  D.fluorescence = function () {
    var p = P();
    var mol = [[268, 226], [296, 218], [324, 230], [284, 238], [312, 212]];
    var m = '';
    mol.forEach(function (q, i) { m += '<circle class="pulse" style="animation-delay:' + (i * .35) + 's" cx="' + q[0] + '" cy="' + q[1] + '" r="13" fill="url(#' + p + 'g)"/><circle cx="' + q[0] + '" cy="' + q[1] + '" r="3.5" fill="#2fb36b"/>'; });
    var rays = [[296, 222, 262, 204], [296, 222, 334, 204], [296, 222, 258, 240], [296, 222, 338, 244]].map(function (r) {
      return '<path class="beam green faint" d="M' + r[0] + ' ' + r[1] + ' L' + r[2] + ' ' + r[3] + '"/>';
    }).join('');
    var mirror = function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#f4f8fb" stroke="#5e6b77" stroke-width="1.5"/>'; };
    var b = liquid(p, 120) + fiber(176, 150) +
      '<rect x="170" y="40" width="200" height="156" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="170" y="196" width="66" height="60" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="360" y="196" width="20" height="60" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="170" y="256" width="210" height="46" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<path d="M186 212 L214 240" stroke="#5e6b77" stroke-width="6" stroke-linecap="round"/><path d="M186 212 L214 240" stroke="#f4f8fb" stroke-width="2.5" stroke-linecap="round"/>' +
      '<rect x="234" y="200" width="5" height="52" fill="url(#' + p + 's)" stroke="#8cc7ea"/>' +
      '<rect x="270" y="192" width="60" height="5" fill="url(#' + p + 's)" stroke="#8cc7ea"/>' +
      mirror(355, 200, 5, 52) + mirror(270, 251, 60, 5) +
      beam("M200 0 V226 H352", "in") + '<path class="beam in faint" d="M352 234 H244"/>' + m + rays +
      '<path class="beam green faint" d="M312 232 V248"/>' + beam("M300 250 V0", "green") +
      label(200, 120, "Excitation fiber", 150, 112, "end") + label2(200, 226, "Mirror turns", "the light 90°", 150, 206, "end") +
      label2(262, 246, "Sample in the", "measuring gap", 150, 318, "end") +
      label2(300, 120, "Collection fiber", "at 90°", 392, 104) + label2(358, 214, "Mirror returns", "the light", 392, 190) +
      label2(316, 254, "Bottom mirror", "returns emission", 392, 296);
    return wrap(p, b, "Fluorescence: a mirror turns the excitation across the gap and a second mirror sends it back; emission is collected at a right angle, and a bottom mirror returns downward emission to the fiber");
  };

  /* Raman, direct backscatter: laser and Raman light share one path to and from the sample */
  D.raman = function () {
    var p = P();
    var b = liquid(p, 150) + fiber() +
      '<rect x="215" y="40" width="90" height="160" rx="6" fill="url(#' + p + 'm)" stroke="#7d8893"/>' +
      '<rect x="225" y="196" width="70" height="7" fill="url(#' + p + 's)" stroke="#8cc7ea"/>' +
      '<path d="M238 203 L260 290 L282 203 Z" fill="#8fd0ff" opacity=".22"/>' +
      '<circle cx="260" cy="290" r="26" fill="url(#' + p + 'b)" class="pulse"/>' +
      '<path d="M222 114 L242 134" stroke="#5e6b77" stroke-width="6" stroke-linecap="round"/><path d="M222 114 L242 134" stroke="#f4f8fb" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M250 114 L270 134" stroke="#6fb6e3" stroke-width="6" stroke-linecap="round" opacity=".85"/>' +
      '<rect x="248" y="84" width="24" height="8" rx="1" fill="#2b3640"/>' +
      beam("M232 0 V124 H260 V290", "in") +
      '<path class="beam in faint" d="M260 290 L214 262"/><path class="beam in faint" d="M260 290 L306 262"/><path class="beam in faint" d="M260 290 L200 304"/><path class="beam in faint" d="M260 290 L320 304"/>' +
      beam("M260 290 V0", "out thin") +
      label(232, 64, "Laser", 150, 56, "end") + label2(260, 56, "Raman light to", "the spectrometer", 336, 36) +
      label2(272, 88, "Filter blocks", "the laser line", 336, 96) + label2(268, 130, "Beam splitter", "(dichroic)", 336, 152) +
      label2(260, 236, "Direct backscatter:", "one shared path", 336, 226) + label2(258, 300, "Focused", "measuring spot", 150, 322, "end");
    return wrap(p, b, "Raman: laser light and the Raman signal travel the same path to and from the sample (direct backscatter); a beam splitter and filter separate them");
  };

  /* Multiplexer: all four channels drawn once; the app sets data-ch on the svg */
  D.multiplexer = function () {
    var ys = [70, 160, 250, 340], ports = [158, 192, 226, 260];
    var ch = '';
    ys.forEach(function (y, i) {
      var d = 'M452 ' + ports[i] + ' C 560 ' + ports[i] + ', 600 ' + y + ', 700 ' + y;
      var r = 'M700 ' + (y + 8) + ' C 600 ' + (y + 8) + ', 560 ' + (ports[i] + 8) + ', 452 ' + (ports[i] + 8);
      ch += '<g class="mpc" data-ch="' + i + '"><path class="fib" d="' + d + '"/><g class="act"><path class="beam in" d="' + d + '"/><path class="beam out" d="' + r + '"/></g>' +
        '<g class="mp" data-ch="' + i + '"><rect class="box" x="700" y="' + (y - 26) + '" width="180" height="52" rx="6"/><rect class="led" x="712" y="' + (y - 6) + '" width="46" height="12" rx="6"/>' +
        '<text x="770" y="' + (y + 6) + '" class="lbl pt">Point ' + (i + 1) + '</text></g></g>';
    });
    return '<svg viewBox="0 0 900 420" role="img" aria-label="Multiplexer switching between four measuring points" class="muxsvg" data-ch="0">' +
      '<rect x="14" y="150" width="150" height="120" rx="6" fill="#f2f2f2" stroke="#c9d1d8"/>' +
      '<rect x="44" y="172" width="90" height="56" rx="3" fill="#0a3a5f"/><path d="M52 214 L70 200 L84 208 L100 190 L126 196" stroke="#7fd1ff" stroke-width="3" fill="none"/>' +
      '<text x="89" y="252" text-anchor="middle" class="lbl b">Control room</text>' +
      '<path d="M164 210 H200" stroke="#878787" stroke-width="2" stroke-dasharray="5 5"/>' +
      '<text x="89" y="296" text-anchor="middle" class="lbl s">TCP/IP · fieldbus</text>' +
      '<rect x="200" y="40" width="270" height="340" rx="8" fill="#f4f8fc" stroke="#c9ddef" stroke-width="2"/>' +
      '<text x="214" y="66" class="lbl b">Analyzer cabinet</text>' +
      '<circle cx="262" cy="130" r="22" fill="#ffd34d" stroke="#e3a800"/><circle cx="262" cy="130" r="34" fill="#ffd34d" opacity=".25" class="pulse"/>' +
      '<text x="262" y="182" text-anchor="middle" class="lbl s">Lamp</text>' +
      '<rect x="222" y="236" width="88" height="62" rx="4" fill="#ffffff" stroke="#9aa6b1"/><path d="M232 284 Q 246 250 258 276 T 284 262 T 300 270" stroke="#0072b6" stroke-width="2.5" fill="none"/>' +
      '<text x="266" y="318" text-anchor="middle" class="lbl s">Spectrometer</text>' +
      '<rect x="352" y="130" width="100" height="160" rx="6" fill="#1f2a33"/>' +
      '<circle cx="402" cy="210" r="36" fill="#c5ccd2" stroke="#8d99a5" stroke-width="2"/>' +
      '<g class="dial"><path d="M402 210 L436 210" stroke="#0072b6" stroke-width="6" stroke-linecap="round"/><circle cx="402" cy="210" r="7" fill="#0072b6"/></g>' +
      '<text x="402" y="312" text-anchor="middle" class="lbl s">Multiplexer</text>' +
      ports.map(function (y) { return '<circle cx="452" cy="' + y + '" r="6" fill="#8d99a5"/>'; }).join('') +
      '<path class="beam in" d="M284 130 C 320 130, 330 170, 352 176"/>' +
      '<path class="beam out" d="M352 250 C 335 256, 324 262, 310 266"/>' + ch + '</svg>';
  };
  D.MUX_ANGLES = [-50, -17, 17, 50];

  /* PAT measuring positions: drawn once; the app sets data-sel on the svg */
  D.positions = function () {
    function g(id, inner) { return '<g class="pos" data-pos="' + id + '">' + inner + '</g>'; }
    var chev = '';
    for (var x = 70; x < 860; x += 70) chev += '<path class="flowchev" d="M' + x + ' 92 l10 8 l-10 8" stroke="#ffffff" stroke-width="3" fill="none"/>';
    return '<svg viewBox="0 0 900 400" role="img" aria-label="Offline, atline, online and inline measuring positions" class="possvg" data-sel="offline">' +
      '<rect x="20" y="78" width="860" height="44" rx="22" fill="#e9a36a"/><rect x="20" y="78" width="860" height="14" rx="7" fill="#f2c39c"/>' + chev +
      '<text x="30" y="60" class="lbl b m">Production line</text>' +
      g("offline", '<rect x="10" y="120" width="210" height="270" fill="transparent"/><path d="M110 122 V150" stroke="#9aa6b1" stroke-width="8"/><rect x="102" y="148" width="16" height="10" fill="#0072b6"/>' +
        '<path d="M110 165 C 110 230, 70 250, 70 300" stroke="#878787" stroke-width="2.5" stroke-dasharray="6 6" fill="none"/>' +
        '<rect x="30" y="300" width="150" height="74" rx="4" fill="#f4f8fc" stroke="#c9ddef" stroke-width="2"/><path d="M58 352 L70 328 V316 H82 V328 L94 352 Z" fill="#ffffff" stroke="#0072b6" stroke-width="2"/><text x="104" y="344" class="lbl s">Lab</text>' +
        '<text x="196" y="338" class="lbl b xl">Offline</text><text x="196" y="362" class="lbl m">sample to the lab</text>') +
      g("atline", '<rect x="220" y="120" width="200" height="180" fill="transparent"/><path d="M270 122 V150" stroke="#9aa6b1" stroke-width="8"/><rect x="262" y="148" width="16" height="10" fill="#0072b6"/>' +
        '<path d="M270 162 v14" stroke="#e9a36a" stroke-width="3" stroke-dasharray="3 5" class="drip"/>' +
        '<rect x="236" y="250" width="170" height="10" rx="3" fill="#c9d1d8"/><rect x="262" y="214" width="16" height="36" rx="3" fill="#ffffff" stroke="#878787"/><rect x="264" y="230" width="12" height="18" fill="#e9a36a"/>' +
        '<rect x="312" y="214" width="66" height="36" rx="3" fill="#1f2a33"/><rect x="320" y="222" width="30" height="10" fill="#7fd1ff"/>' +
        '<text x="300" y="186" class="lbl b xl">Atline</text><text x="300" y="206" class="lbl m">next to the line</text>') +
      g("online", '<rect x="440" y="120" width="230" height="170" fill="transparent"/><path d="M480 122 V210 H620 V122" stroke="#e9a36a" stroke-width="14" fill="none" stroke-linejoin="round"/>' +
        '<rect x="530" y="196" width="40" height="28" rx="4" fill="#0072b6"/><path d="M550 224 V250" stroke="#39434d" stroke-width="4"/><rect x="518" y="250" width="64" height="30" rx="3" fill="#1f2a33"/>' +
        '<text x="640" y="222" class="lbl b xl">Online</text><text x="640" y="246" class="lbl m">bypass loop</text>') +
      g("inline", '<rect x="690" y="10" width="200" height="150" fill="transparent"/><rect x="738" y="20" width="16" height="84" rx="4" fill="#9aa6b1"/><rect x="734" y="98" width="24" height="10" rx="3" fill="#0072b6"/><circle cx="746" cy="100" r="16" fill="#7fd1ff" opacity=".45" class="pulse"/>' +
        '<text x="770" y="44" class="lbl b xl">Inline</text><text x="770" y="66" class="lbl m">in the stream</text>') +
      '</svg>';
  };

  /* Case study: before and after drawn together; the app sets data-after on the svg */
  D.beforeAfter = function () {
    var col = '<rect x="60" y="40" width="60" height="230" rx="28" fill="url(#cbm)" stroke="#8d99a5"/><path d="M70 90 H110 M70 130 H110 M70 170 H110 M70 210 H110" stroke="#aab4bd" stroke-width="2"/>' +
      '<path d="M90 40 V20 H300 V150" stroke="#9aa6b1" stroke-width="10" fill="none" stroke-linejoin="round"/>' +
      '<path d="M250 150 H350 V250 Q 350 290 300 290 Q 250 290 250 250 Z" fill="url(#cbm)" stroke="#8d99a5"/>' +
      '<path d="M253 205 H347 V250 Q 347 287 300 287 Q 253 287 253 250 Z" fill="#f6b45a" opacity=".85"/>' +
      '<text x="90" y="300" text-anchor="middle" class="lbl s">Distillation</text><text x="300" y="320" text-anchor="middle" class="lbl s">Collection tank</text>' +
      '<g transform="translate(150 210)"><path d="M0 -26 L23 -13 V13 L0 26 L-23 13 V-13 Z" fill="#ffd400" stroke="#1e2328" stroke-width="2"/><text x="0" y="7" text-anchor="middle" style="font: 700 18px sans-serif" fill="#1e2328">Ex</text></g>';
    var before = '<g class="ba-before"><path d="M300 290 V308" stroke="#9aa6b1" stroke-width="6"/><rect x="292" y="300" width="16" height="8" fill="#0072b6"/>' +
      '<path d="M320 312 C 420 312, 440 250, 520 250" stroke="#878787" stroke-width="2.5" stroke-dasharray="7 7" fill="none" class="march"/>' +
      '<circle cx="470" cy="210" r="10" fill="#0a3a5f"/><path d="M470 222 V258 M470 232 L456 248 M470 232 L486 244 M470 258 L458 284 M470 258 L482 284" stroke="#0a3a5f" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="540" y="200" width="180" height="100" rx="6" fill="#f4f8fc" stroke="#c9ddef" stroke-width="2"/><path d="M574 270 L588 240 V226 H602 V240 L616 270 Z" fill="#fff" stroke="#0072b6" stroke-width="2"/>' +
      '<circle cx="676" cy="246" r="20" fill="#fff" stroke="#c2410c" stroke-width="3"/><path d="M676 246 V232 M676 246 L686 252" stroke="#c2410c" stroke-width="3" stroke-linecap="round"/>' +
      '<text x="630" y="190" text-anchor="middle" class="lbl b">Offline: sample to the lab</text><text x="630" y="328" text-anchor="middle" class="lbl s">Batch waits for the result</text></g>';
    var aft = '<g class="ba-after"><path d="M350 250 H420" stroke="#9aa6b1" stroke-width="8"/><rect x="404" y="238" width="30" height="24" rx="4" fill="#0072b6"/><circle cx="419" cy="250" r="20" fill="#7fd1ff" opacity=".45" class="pulse"/>' +
      '<path d="M434 250 C 490 250, 500 150, 560 150" stroke="#9cc9e8" stroke-width="6" fill="none"/><path class="beam in" d="M434 250 C 490 250, 500 150, 560 150"/>' +
      '<rect x="560" y="110" width="160" height="80" rx="6" fill="#1f2a33"/><rect x="574" y="124" width="132" height="40" fill="#0a3a5f"/><path class="trace" d="M578 154 L600 150 L620 152 L640 140 L660 146 L680 138 L702 142" stroke="#7fd1ff" stroke-width="2.5" fill="none"/>' +
      '<text x="640" y="92" text-anchor="middle" class="lbl b">Online: Excalibur flow cell</text><text x="640" y="214" text-anchor="middle" class="lbl s">Real-time batch release</text>' +
      '<g transform="translate(640 262)"><circle r="22" fill="#2e7d4f"/><path d="M-10 0 L-3 8 L11 -8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>';
    return '<svg viewBox="0 0 760 340" role="img" aria-label="Offline lab sample versus online measurement on the collection tank" class="basvg" data-after="1">' +
      '<defs><linearGradient id="cbm" x1="0" x2="1"><stop offset="0" stop-color="#b8c2cb"/><stop offset=".4" stop-color="#f1f4f6"/><stop offset="1" stop-color="#a8b3bd"/></linearGradient></defs>' +
      col + before + aft + '</svg>';
  };

  D.atex = function () {
    return '<svg viewBox="0 0 760 330" role="img" aria-label="Flow cell in the ATEX area, spectrometer outside it">' +
      '<defs><linearGradient id="axm" x1="0" x2="1"><stop offset="0" stop-color="#b8c2cb"/><stop offset=".4" stop-color="#f1f4f6"/><stop offset="1" stop-color="#a8b3bd"/></linearGradient></defs>' +
      '<rect x="10" y="20" width="450" height="295" rx="6" fill="#fff5f4" stroke="#d64032" stroke-width="3" stroke-dasharray="10 6"/><text x="26" y="300" class="lbl b" fill="#b42318">ATEX area</text>' +
      '<rect x="468" y="10" width="16" height="315" fill="#878787"/>' +
      '<rect x="492" y="20" width="258" height="295" rx="6" fill="#f4f8fc" stroke="#0072b6" stroke-width="3"/><text x="508" y="300" class="lbl b" fill="#0a3a5f">Non-ATEX area</text>' +
      '<rect x="50" y="50" width="56" height="200" rx="26" fill="url(#axm)" stroke="#8d99a5"/><path d="M78 50 V34 H260 V120" stroke="#9aa6b1" stroke-width="9" fill="none"/>' +
      '<path d="M210 120 H310 V220 Q 310 256 260 256 Q 210 256 210 220 Z" fill="url(#axm)" stroke="#8d99a5"/><path d="M213 175 H307 V220 Q 307 253 260 253 Q 213 253 213 220 Z" fill="#f6b45a" opacity=".85"/>' +
      '<path d="M310 220 H380" stroke="#9aa6b1" stroke-width="8"/><rect x="366" y="208" width="30" height="24" rx="4" fill="#0072b6"/>' +
      '<text x="381" y="180" text-anchor="middle" class="lbl s">Excalibur HD</text><text x="381" y="196" text-anchor="middle" class="lbl s">flow cell</text>' +
      '<g transform="translate(150 280)"><path d="M0 -20 L18 -10 V10 L0 20 L-18 10 V-10 Z" fill="#ffd400" stroke="#1e2328" stroke-width="2"/><text x="0" y="6" text-anchor="middle" style="font: 700 14px sans-serif" fill="#1e2328">Ex</text></g>' +
      '<path d="M396 220 C 440 220, 440 150, 476 150 H 560" stroke="#9cc9e8" stroke-width="6" fill="none"/><path class="beam in" d="M396 220 C 440 220, 440 150, 476 150 H 560"/>' +
      '<rect x="560" y="110" width="150" height="76" rx="6" fill="#1f2a33"/><rect x="572" y="122" width="126" height="36" fill="#0a3a5f"/><path class="trace" d="M576 150 L598 146 L618 148 L638 136 L658 142 L678 134 L694 138" stroke="#7fd1ff" stroke-width="2.5" fill="none"/>' +
      '<text x="635" y="208" text-anchor="middle" class="lbl s">Spectrometer</text>' +
      '<text x="520" y="84" class="lbl s">Optical fiber through the wall</text></svg>';
  };

  /* Calibration timeline: points grouped by phase; the app sets data-show = 0, 1 or 2 */
  D.model = function () {
    var seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function diamond(x, y, c) { return '<path d="M' + x.toFixed(1) + ' ' + (y - 6).toFixed(1) + ' l6 6 l-6 6 l-6 -6 Z" fill="' + c + '"/>'; }
    var phases = [
      { x0: 70, x1: 330, n: 30, c: "#1f6fb2", c2: "#2aa65b" },
      { x0: 360, x1: 520, n: 14, c: "#36c26b" },
      { x0: 560, x1: 720, n: 12, c: "#9a8a2a" },
    ];
    var groups = phases.map(function (ph, k) {
      var pts = '';
      for (var i = 0; i < ph.n; i++) {
        var x = ph.x0 + rnd() * (ph.x1 - ph.x0), y = 50 + rnd() * 100;
        pts += diamond(x, y, (k === 0 && i % 3 === 2) ? ph.c2 : ph.c);
      }
      return '<g class="ph ph' + k + '">' + pts + '</g>';
    }).join('');
    var lab = [["Calibration", 70, 330], ["External validation", 360, 520], ["Revalidation", 560, 720]].map(function (l, k) {
      return '<g class="phl phl' + k + '" data-phase="' + k + '"><rect x="' + (l[1] - 6) + '" y="176" width="' + (l[2] - l[1] + 12) + '" height="58" fill="transparent"/>' +
        '<path d="M' + l[1] + ' 186 V196 H' + l[2] + ' V186" stroke="#878787" fill="none"/><text x="' + ((l[1] + l[2]) / 2) + '" y="222" text-anchor="middle" class="lbl b">' + l[0] + '</text></g>';
    }).join('');
    return '<svg viewBox="0 0 760 250" role="img" aria-label="Calibration, external validation and revalidation over time" class="modelsvg" data-show="0">' +
      '<path d="M50 30 V170 H740" stroke="#575756" stroke-width="2" fill="none"/><path d="M732 164 L742 170 L732 176" stroke="#575756" stroke-width="2" fill="none"/>' +
      '<text x="36" y="100" class="lbl s" transform="rotate(-90 36 100)" text-anchor="middle">concentration</text><text x="740" y="160" class="lbl s" text-anchor="end">time</text>' +
      groups + lab + '</svg>';
  };

  /* V-model: drawn once; the app sets data-sel on the svg */
  D.vmodel = function (stages) {
    var yc = [64, 130, 196, 262];
    function xc(side, lvl) { var off = (yc[lvl] - 60) * 1.11; return side === "L" ? 80 + off : 680 - off; }
    var out = '<svg viewBox="0 0 760 380" role="img" aria-label="V-model of qualification" class="vsvg" data-sel="urs">' +
      '<path d="M80 60 L380 330 L680 60" stroke="#c9ddef" stroke-width="40" fill="none" stroke-linejoin="round" stroke-linecap="round"/>';
    stages.forEach(function (s) {
      var x = xc(s.side, s.lvl), y = yc[s.lvl];
      var short = s.name.match(/\(([^)]+)\)/);
      out += '<g class="vst" data-v="' + s.id + '"><rect x="' + (x - 66) + '" y="' + (y - 24) + '" width="132" height="48" rx="24"/>' +
        '<text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" class="lbl w m">' + (short ? short[1] : s.name) + '</text></g>';
    });
    out += '<rect x="300" y="318" width="160" height="48" rx="24" fill="#575756"/><text x="380" y="348" text-anchor="middle" class="lbl w">Implementation</text>';
    out += '<text x="20" y="24" class="lbl m">Specify and design</text><text x="740" y="24" class="lbl m" text-anchor="end">Test and qualify</text>';
    return out + '</svg>';
  };

  /* Portfolio wheel: drawn once; the app toggles .on on the selected segment */
  D.wheel = function (items) {
    var cx = 210, cy = 210, r1 = 92, r2 = 196, n = items.length, out = '';
    function pt(r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
    items.forEach(function (it, i) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / n + 0.015, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / n - 0.015;
      var p0 = pt(r2, a0), p1 = pt(r2, a1), p2 = pt(r1, a1), p3 = pt(r1, a0);
      var d = 'M' + p0 + ' A' + r2 + ' ' + r2 + ' 0 0 1 ' + p1 + ' L' + p2 + ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + p3 + ' Z';
      var am = (a0 + a1) / 2, lp = pt((r1 + r2) / 2, am);
      var words = it.name.split(" "), lines = words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : (words.length === 2 ? words : [it.name]);
      out += '<g class="wseg' + (i % 2 ? ' alt' : '') + '" data-seg="' + i + '"><path d="' + d + '" stroke="#fff" stroke-width="2"/>';
      lines.forEach(function (ln, k) { out += '<text x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + (k - (lines.length - 1) / 2) * 18 + 5).toFixed(1) + '" text-anchor="middle" class="lbl w s">' + ln + '</text>'; });
      out += '</g>';
    });
    out += '<circle cx="210" cy="210" r="86" fill="#ffffff" stroke="#c9ddef" stroke-width="2"/><text x="210" y="222" text-anchor="middle" style="font-size:38px;font-weight:300;fill:#0072b6">PAT</text>';
    return '<svg viewBox="0 0 420 420" role="img" aria-label="Hellma Solutions portfolio">' + out + '</svg>';
  };

  /* ---------- Application charts (schematic, redrawn from the webinar deck) ---------- */
  function gauss(x, mu, s, a) { return a * Math.exp(-0.5 * Math.pow((x - mu) / s, 2)); }
  function chart(o) {
    // o: { x0, x1, xlab, ylab, series:[{name,color,f, w}], ticks:[...], legend:true, h }
    var W = 760, H = o.h || 300, L = 60, R = 34, T = 20, B = 50;
    var iw = W - L - R, ih = H - T - B;
    var ymax = 0;
    o.series.forEach(function (s) { for (var x = o.x0; x <= o.x1; x += (o.x1 - o.x0) / 300) ymax = Math.max(ymax, s.f(x)); });
    ymax *= 1.1;
    function X(x) { return L + (x - o.x0) / (o.x1 - o.x0) * iw; }
    function Y(y) { return T + ih - y / ymax * ih; }
    var paths = o.series.map(function (s, k) {
      var d = '', step = (o.x1 - o.x0) / 300;
      for (var x = o.x0, i = 0; x <= o.x1 + 1e-9; x += step, i++) d += (i ? ' L' : 'M') + X(x).toFixed(1) + ' ' + Y(s.f(x)).toFixed(1);
      return '<path class="draw" style="animation-delay:' + (k * 0.25) + 's" d="' + d + '" stroke="' + s.color + '" stroke-width="' + (s.w || 2.6) + '" fill="none" stroke-linejoin="round"/>';
    }).join('');
    var ticks = (o.ticks || []).map(function (t) { return '<path d="M' + X(t) + ' ' + (T + ih) + ' v6" stroke="#878787"/><text x="' + X(t) + '" y="' + (T + ih + 22) + '" text-anchor="middle" class="lbl s">' + t + '</text>'; }).join('');
    var marks = (o.marks || []).map(function (m) { return '<path d="M' + X(m[0]) + ' ' + T + ' V' + (T + ih) + '" stroke="#c9ddef" stroke-dasharray="4 4"/><text x="' + (X(m[0]) + 6) + '" y="' + (T + 14) + '" class="lbl s">' + m[1] + '</text>'; }).join('');
    var legend = o.legend === false ? '' : o.series.map(function (s, k) { return '<g transform="translate(' + (L + 10 + k * 190) + ' ' + (T + 4) + ')"><rect width="18" height="4" y="6" fill="' + s.color + '"/><text x="26" y="12" class="lbl s">' + s.name + '</text></g>'; }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.title || 'Spectra') + '" class="chartsvg">' +
      '<path d="M' + L + ' ' + T + ' V' + (T + ih) + ' H' + (W - R) + '" stroke="#575756" stroke-width="1.6" fill="none"/>' + marks + ticks + paths + legend +
      '<text x="' + (L + iw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" class="lbl s">' + o.xlab + '</text>' +
      '<text x="18" y="' + (T + ih / 2) + '" text-anchor="middle" class="lbl s" transform="rotate(-90 18 ' + (T + ih / 2) + ')">' + (o.ylab || 'Absorbance') + '</text></svg>';
  }
  D.charts = {
    uvvis: function () {
      return chart({ x0: 200, x1: 320, xlab: "Wavelength (nm)", ticks: [200, 240, 280, 320], title: "Acetone and toluene UV spectra",
        series: [
          { name: "Acetone", color: "#0072b6", f: function (x) { return gauss(x, 272, 22, 1); } },
          { name: "Toluene", color: "#e07b00", f: function (x) { return gauss(x, 210, 9, 1.4) + gauss(x, 254, 3, .45) + gauss(x, 261, 3, .55) + gauss(x, 268, 2.6, .4) + gauss(x, 262, 9, .25); } },
        ] });
    },
    dissolution: function () {
      var s = [];
      for (var k = 1; k <= 6; k++) (function (k) { s.push({ name: k === 1 ? "Early" : (k === 6 ? "Late" : ""), color: "hsl(205," + (40 + k * 8) + "%," + (70 - k * 7) + "%)", w: 2, f: function (x) { return k / 6 * (gauss(x, 232, 14, 1) + gauss(x, 282, 16, .45)); } }); })(k);
      return chart({ x0: 200, x1: 360, xlab: "Wavelength (nm)", ticks: [200, 240, 280, 320, 360], series: s, legend: false, title: "Rising absorbance during drug release" });
    },
    gas: function () {
      return chart({ x0: 1000, x1: 2200, xlab: "Wavelength (nm)", ticks: [1000, 1200, 1400, 1600, 1800, 2000, 2200], title: "Natural gas NIR absorption", legend: false,
        series: [{ name: "Natural gas", color: "#0072b6", f: function (x) { return .3 + gauss(x, 1165, 18, .35) + gauss(x, 1385, 22, .35) + gauss(x, 1640, 10, .95) + gauss(x, 1670, 9, .7) + gauss(x, 1700, 14, 1.1) + gauss(x, 1725, 10, .8) + gauss(x, 1790, 10, .35) + gauss(x, 1810, 8, .3) + gauss(x, 2180, 18, .6); } }] });
    },
    polymer: function () {
      function base(x, a) { return a * (1 - 0.15 * Math.exp(-0.5 * Math.pow((x - 1145) / 8, 2)) + 0.12 * Math.exp(-0.5 * Math.pow((x - 1260) / 60, 2))) * (x < 1380 ? 1 : Math.max(.08, 1 - (x - 1380) / 40)) + (x > 1440 ? a * 0.22 * gauss(x, 1560, 40, 1) : 0); }
      return chart({ x0: 1050, x1: 1650, xlab: "Wavelength (nm)", ticks: [1100, 1200, 1300, 1400, 1500, 1600], ylab: "Signal", title: "Styrene to polystyrene",
        series: [
          { name: "Start", color: "#2f3e9e", f: function (x) { return base(x, 1); } },
          { name: "During", color: "#2e8b57", f: function (x) { return base(x, .66); } },
          { name: "End", color: "#c0392b", f: function (x) { return base(x, .4); } },
        ] });
    },
    polyol: function () {
      var cols = ["#2a9d8f", "#3aa6c4", "#9bbf3b", "#e9c46a", "#7aa6d6"];
      return chart({ x0: 1000, x1: 2200, xlab: "Wavelength (nm)", ticks: [1000, 1200, 1400, 1600, 1800, 2000, 2200], legend: false, title: "Polyol NIR spectra",
        series: cols.map(function (c, k) { return { name: "", color: c, w: 2, f: function (x) { return .15 + gauss(x, 1450, 40, .35 + k * .04) + gauss(x, 1720, 30, .25) + gauss(x, 1940, 40, .8 + k * .12) + gauss(x, 2080, 30, .5) + (x > 2100 ? (x - 2100) / 400 * (1 + k * .2) : 0); } }; }) });
    },
    oil: function () {
      function base(x) { return .1 + gauss(x, 1210, 14, .3) + gauss(x, 1390, 18, .12) + gauss(x, 1725, 14, 1) + gauss(x, 1765, 12, .9) + gauss(x, 2140, 20, .35) + gauss(x, 2310, 18, .4); }
      return chart({ x0: 1100, x1: 2400, xlab: "Wavelength (nm)", ticks: [1200, 1400, 1600, 1800, 2000, 2200, 2400], title: "Coconut oil NIR spectra",
        series: [
          { name: "Pure", color: "#2e8b57", f: base },
          { name: "Contaminated", color: "#e9b200", f: function (x) { return base(x) + gauss(x, 1410, 30, .18) + gauss(x, 1930, 40, .25); } },
          { name: "More contaminated", color: "#c0392b", f: function (x) { return base(x) + gauss(x, 1410, 30, .35) + gauss(x, 1930, 40, .5); } },
        ] });
    },
    fluor: function () {
      return chart({ x0: 250, x1: 600, xlab: "Wavelength (nm)", ticks: [250, 300, 350, 400, 450, 500, 550, 600], ylab: "Intensity", title: "Excitation and emission spectra",
        series: [
          { name: "Excitation", color: "#3b4cc0", f: function (x) { return gauss(x, 360, 22, 1) + gauss(x, 300, 14, .25); } },
          { name: "Emission", color: "#b2186b", f: function (x) { return gauss(x, 440, 30, .92); } },
        ] });
    },
    scheelite: function () {
      return chart({ x0: 360, x1: 650, xlab: "Wavelength (nm)", ticks: [360, 410, 460, 510, 560, 610], ylab: "Intensity", title: "Scheelite fluorescence",
        marks: [[440, "WO₄ ~440"], [540, "MoO₄ ~540"], [570, "Dy³⁺ ~570"]],
        series: [
          { name: "Blue sample", color: "#6b7280", f: function (x) { return gauss(x, 440, 55, .55); } },
          { name: "Yellow sample", color: "#0072b6", f: function (x) { return gauss(x, 540, 50, .8) + gauss(x, 572, 12, .12); } },
          { name: "Both", color: "#7cb342", f: function (x) { return gauss(x, 440, 55, .4) + gauss(x, 540, 50, .78) + gauss(x, 572, 12, .14); } },
        ] });
    },
  };

  /* NIR band positions by functional group (positions read from the band-assignment chart Hellma supplied).
     Rows are tappable: the app sets data-sel on the svg to highlight one group. */
  D.NIR_ROWS = [
    ["H₂O", "Water", "#16a9cf", [[748, 757], [957, 979], [1407, 1445], [1905, 1957], [2243, 2252]]],
    ["ROH", "Alcohols", "#e0453a", [[733, 743], [921, 943], [1410, 1471], [2067, 2086]]],
    ["ArOH", "Phenols", "#a8325e", [[736, 748], [936, 955], [1383, 1412]]],
    ["RCOOH, RCOOR", "Acids, esters", "#e879a6", [[1886, 1895], [1929, 1964]]],
    ["RNH₂, RNHR′", "Amines", "#2349c8", [[786, 812], [805, 821], [1024, 1040], [1490, 1512], [2138, 2202]]],
    ["CONH₂, CONHR", "Amides", "#5a86e6", [[1438, 1462], [1464, 1490], [1917, 1971], [2038, 2150]]],
    ["ArCH", "Aromatic C–H", "#8a5a2b", [[700, 717], [852, 867], [1083, 1100], [1612, 1648]]],
    ["SH", "Thiols", "#d9b400", [[1731, 1752]]],
    ["POH", "P–OH", "#9c6b30", [[1910, 1921]]],
    ["C=O, CHO", "Carbonyl, aldehyde", "#2e9b4f", [[2019, 2048], [2188, 2214]]],
    ["C–C", "Carbon–carbon", "#3a3f45", [[2152, 2200]]],
    ["CH", "Methine", "#a3acb5", [[738, 769], [907, 938], [1176, 1252], [1419, 1457], [1690, 1779], [2276, 2440]]],
    ["CH₂", "Methylene", "#6e7882", [[726, 752], [898, 929], [1152, 1212], [1381, 1433], [1681, 1748], [2252, 2414]]],
    ["CH₃", "Methyl", "#1e2328", [[712, 738], [871, 907], [1121, 1193], [1360, 1400], [1636, 1707], [2202, 2398]]],
  ];
  D.nirBands = function () {
    var L = 340, R = 962, x0 = 700, x1 = 2500, top = 74, rh = 28;
    function X(v) { return L + (v - x0) / (x1 - x0) * (R - L); }
    var rows = D.NIR_ROWS, yAxis = top + rows.length * rh + 6, Hh = yAxis + 56;
    var out = '<svg viewBox="0 0 1000 ' + Hh + '" role="img" aria-label="Approximate NIR band positions by functional group" class="chartsvg nbsvg">';
    for (var g = 700; g <= 2500; g += 100) out += '<path d="M' + X(g).toFixed(1) + ' ' + (top - 6) + ' V' + yAxis + '" stroke="' + (g % 200 === 100 ? '#d6dde3' : '#edf0f2') + '"/>';
    [[1050, 1650, "2nd overtones", 14], [1950, 2500, "Combinations", 14], [700, 1150, "3rd overtones", 42], [1475, 2050, "1st overtones", 42]].forEach(function (r) {
      out += '<rect x="' + X(r[0]).toFixed(1) + '" y="' + r[3] + '" width="' + (X(r[1]) - X(r[0])).toFixed(1) + '" height="20" rx="10" fill="#e4eef7"/>' +
        '<text x="' + ((X(r[0]) + X(r[1])) / 2).toFixed(1) + '" y="' + (r[3] + 15) + '" text-anchor="middle" class="lbl s b">' + r[2] + '</text>';
    });
    rows.forEach(function (r, i) {
      var y = top + i * rh;
      out += '<g class="nbr" data-r="' + i + '"><rect x="0" y="' + y + '" width="1000" height="' + rh + '" fill="transparent"/>' +
        '<text x="10" y="' + (y + 18) + '" class="lbl b">' + r[0] + '</text><text x="' + (L - 10) + '" y="' + (y + 18) + '" text-anchor="end" class="lbl s">' + r[1] + '</text>';
      r[3].forEach(function (b, k) {
        var w = Math.max(5, X(b[1]) - X(b[0]));
        out += '<rect class="grow" style="animation-delay:' + (i * .05 + k * .04).toFixed(2) + 's" x="' + X(b[0]).toFixed(1) + '" y="' + (y + 7) + '" width="' + w.toFixed(1) + '" height="14" rx="3" fill="' + r[2] + '"/>';
      });
      out += '</g>';
    });
    out += '<path d="M' + L + ' ' + yAxis + ' H' + R + '" stroke="#575756" stroke-width="1.5"/>';
    for (var t = 700; t <= 2500; t += 200) out += '<path d="M' + X(t).toFixed(1) + ' ' + yAxis + ' v6" stroke="#575756"/><text x="' + X(t).toFixed(1) + '" y="' + (yAxis + 26) + '" text-anchor="middle" class="lbl s">' + t + '</text>';
    out += '<text x="' + ((L + R) / 2) + '" y="' + (yAxis + 50) + '" text-anchor="middle" class="lbl s">Wavelength (nm)</text>';
    return out + '</svg>';
  };

  /* Raman shifts of natural-gas components (approximate literature values, cm⁻¹) */
  D.ramanGas = function () {
    var W = 760, H = 300, L = 40, R = 30, T = 46, B = 52, x0 = 700, x1 = 3200;
    var iw = W - L - R, ih = H - T - B;
    function X(v) { return L + (v - x0) / (x1 - x0) * iw; }
    function Y(v) { return T + ih - v * ih; }
    var hc = "#0072b6", rm = "#e07b00", ot = "#6e7882";
    var peaks = [[869, .34, hc], [993, .38, hc], [1285, .30, ot], [1388, .44, ot], [1556, .40, rm], [2331, .52, rm], [2611, .26, ot], [2890, .52, hc], [2917, 1, hc], [2954, .62, hc], [3020, .2, hc]];
    var d = '';
    for (var x = x0, i = 0; x <= x1; x += 2, i++) {
      var y = 0; peaks.forEach(function (p) { y += p[1] * Math.exp(-0.5 * Math.pow((x - p[0]) / 7, 2)); });
      d += (i ? ' L' : 'M') + X(x).toFixed(1) + ' ' + Y(Math.min(y, 1.02) * .92).toFixed(1);
    }
    var labels = [[869, "C₃H₈", hc, "end", -4], [993, "C₂H₆", hc, "start", 4], [1336, "CO₂", ot], [1556, "O₂", rm], [2331, "N₂", rm], [2611, "H₂S", ot], [2930, "CH₄ · C₂H₆ · C₃H₈", hc]];
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Approximate Raman shifts of natural-gas components" class="chartsvg">' +
      '<path d="M' + L + ' ' + T + ' V' + (T + ih) + ' H' + (W - R) + '" stroke="#575756" stroke-width="1.6" fill="none"/>' +
      '<path class="draw" d="' + d + '" stroke="#0a3a5f" stroke-width="2.2" fill="none" stroke-linejoin="round"/>';
    labels.forEach(function (l, k) {
      var p = peaks.filter(function (q) { return Math.abs(q[0] - l[0]) < 60; }).reduce(function (a, q) { return q[1] > a ? q[1] : a; }, 0);
      var y = Y(p * .92) - 10;
      out += '<text x="' + (X(l[0]) + (l[4] || 0)).toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + (l[3] || "middle") + '" class="lbl s b" style="fill:' + l[2] + '">' + l[1] + '</text>';
    });
    [1000, 1500, 2000, 2500, 3000].forEach(function (t) { out += '<path d="M' + X(t).toFixed(1) + ' ' + (T + ih) + ' v6" stroke="#878787"/><text x="' + X(t).toFixed(1) + '" y="' + (T + ih + 24) + '" text-anchor="middle" class="lbl s">' + t + '</text>'; });
    out += '<text x="' + (L + iw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" class="lbl s">Raman shift (cm⁻¹)</text>';
    out += '<g transform="translate(' + (L + 14) + ' 18)"><rect width="14" height="4" y="5" fill="' + hc + '"/><text x="20" y="12" class="lbl s">hydrocarbons</text><rect x="150" width="14" height="4" y="5" fill="' + rm + '"/><text x="170" y="12" class="lbl s">Raman only</text><rect x="290" width="14" height="4" y="5" fill="' + ot + '"/><text x="310" y="12" class="lbl s">other</text></g>';
    return out + '</svg>';
  };

  /* Natural gas composition ranges */
  D.ranges = function (items) {
    var L = 272, R = 640, out = '<svg viewBox="0 0 760 ' + (40 + items.length * 40) + '" role="img" aria-label="Natural gas composition ranges" class="chartsvg">';
    function X(v) { return L + v / 100 * (R - L); }
    items.forEach(function (it, i) {
      var y = 20 + i * 40, raman = it[3] === "Raman only";
      out += '<text x="' + (L - 14) + '" y="' + (y + 17) + '" text-anchor="end" class="lbl">' + it[0] + '</text><rect x="' + L + '" y="' + (y + 4) + '" width="' + (R - L) + '" height="18" rx="9" fill="#f2f2f2"/>';
      if (it[1] != null) {
        var w = Math.max(6, X(it[2]) - X(it[1]));
        out += '<rect class="grow" style="animation-delay:' + (i * .08) + 's" x="' + X(it[1]) + '" y="' + (y + 4) + '" width="' + w + '" height="18" rx="9" fill="' + (raman ? "#e07b00" : "#0072b6") + '"/>' +
          '<text x="' + (X(it[1]) + w + 10) + '" y="' + (y + 17) + '" class="lbl s">' + it[1] + '–' + it[2] + ' %' + (it[3] ? '  ·  ' + it[3] : '') + '</text>';
      } else out += '<text x="' + (L + 10) + '" y="' + (y + 17) + '" class="lbl s">' + (it[3] || '') + '</text>';
    });
    [0, 25, 50, 75, 100].forEach(function (t) { out += '<text x="' + X(t) + '" y="' + (32 + items.length * 40) + '" text-anchor="middle" class="lbl s">' + t + ' %</text>'; });
    return out + '</svg>';
  };

  /* Dilution vs ATR: why strongly absorbing samples need a short path */
  D.dilution = function () {
    return '<svg viewBox="0 0 760 270" role="img" aria-label="Transflection needed a million-fold dilution; ATR stays in range" class="chartsvg">' +
      '<text x="20" y="34" class="lbl b">Absorbance</text><rect x="250" y="20" width="160" height="230" fill="#e4eef7"/>' +
      '<text x="330" y="262" text-anchor="middle" class="lbl s">usable</text>' +
      '<text x="20" y="96" class="lbl b">Transflection</text><text x="20" y="116" class="lbl s">1 mm light path</text>' +
      '<rect class="grow" x="250" y="82" width="480" height="26" rx="13" fill="#c0392b"/><text x="740" y="74" text-anchor="end" class="lbl s">far off scale</text>' +
      '<path d="M720 128 C 640 150, 470 150, 400 142" stroke="#c0392b" stroke-width="2.5" fill="none" stroke-dasharray="6 6" class="march"/><path d="M402 136 l-10 6 l10 6" stroke="#c0392b" stroke-width="2.5" fill="none"/>' +
      '<text x="560" y="170" text-anchor="middle" class="lbl b" fill="#c0392b">dilute 1 : 1,000,000</text>' +
      '<text x="20" y="214" class="lbl b">ATR</text><text x="20" y="234" class="lbl s">tiny penetration depth</text>' +
      '<rect class="grow" style="animation-delay:.4s" x="250" y="200" width="120" height="26" rx="13" fill="#2e8b57"/><text x="384" y="218" class="lbl b" fill="#2e8b57">in range</text>' +
      '</svg>';
  };

  window.DIAGRAMS = D;
})();
