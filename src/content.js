/* Hellma PAT kiosk content.
 *
 * Everything a visitor reads lives here, separate from the app code.
 * - Images are referenced by asset ID (the same IDs as the image request list). Drop a better file
 *   with the same ID into src/assets and rebuild.
 * - A value written as { v: "text", check: "note" } is shown as "text" and listed in review mode
 *   (staff panel > Highlight values to confirm) so open questions stay visible until they are settled.
 * - To add a product line later (cuvettes, microplates, reference materials), add a line under
 *   `lines`, its families and products, and a tile in `home.groups`. Pages are generated from the data.
 * - Application areas live under `applications`: add a field, a story or a case study there.
 */
window.KIOSK = {
  meta: {
    title: "Hellma Process Analytics",
    version: "0.8.0 (translations)",
    source: "20250428_HellmaUSA_PAT.pptx; HellmaUSA_2025_Applications_for_CPACT_webinar.pptx; 661.920 information sheet",
  },

  settings: {
    defaultPin: "4815",
    idleSeconds: 90,
    warnSeconds: 15,
    attractSlideSeconds: 8,
  },

  footnotes: {
    weld: "*Higher pressures are possible but cannot be certified because of testing limitations.",
  },

  brands: {
    hellma: { name: "Hellma", logo: "L1" },
    analytics: { name: "Hellma Analytics", logo: "L3", tagline: "High precision in spectro-optics" },
    solutions: { name: "Hellma Solutions", logo: "L2", tagline: "For dedicated spectroscopy applications" },
    knick: { name: "Knick", logo: "L5" },
  },

  attract: [
    { img: "K1", pos: "70% 50%", eyebrow: "Process Analytical Technology", title: "Measure inside your process, in real time.", sub: "Immersion probes, flow cells and complete PAT solutions from Hellma." },
    { img: "A3", pos: "50% 40%", eyebrow: "Welded metal seals", title: "Rated up to 400 °C and 250 bar*.", sub: "Excalibur HD probes and flow cells for harsh process conditions.", foot: "weld" },
    { img: "K2", pos: "40% 50%", eyebrow: "Hellma Solutions", title: "From feasibility study to validated method.", sub: "Consulting, sensors, chemometrics, integration and service." },
    { img: "I4", pos: "50% 50%", eyebrow: "Applications", title: "From whiskey barrels to polymer extruders.", sub: "See where Hellma probes measure, industry by industry." },
    { img: "A4", pos: "50% 60%", eyebrow: "Probe finder", title: "Find the right probe for your process.", sub: "Filter by measurement principle, temperature and pressure." },
  ],

  home: {
    eyebrow: "Process Analytical Technology",
    title: "Spectroscopy, right in your process",
    sub: "Tap a topic to explore probes, flow cells and PAT solutions.",
    hero: { route: "finder", img: "P2", title: "Find your probe", sub: "Set your process conditions and see which probes and flow cells fit." },
    groups: [
      {
        brand: "analytics", title: "Process interfaces",
        tiles: [
          { route: "line/process-interfaces", img: "P3", title: "Probes & flow cells", sub: "Every model with full specifications" },
          { route: "principles", svg: "principle", title: "Measurement principles", sub: "How each probe measures, animated" },
          { route: "sealing", img: "S3", title: "Sealing technology", sub: "Why welded metal seals last" },
          { route: "retractables", img: "R4", title: "Retractable housings", sub: "Clean and swap probes while running" },
          { route: "multiplexers", img: "P10", title: "Multiplexers", sub: "One spectrometer, many measuring points" },
        ],
      },
      {
        brand: "solutions", title: "PAT solutions",
        tiles: [
          { route: "solutions", img: "P13", title: "Hellma Solutions", sub: "Sensors, custom systems and services" },
          { route: "applications/cases", img: "K2b", title: "Case studies", sub: "Water in solvents, precious-metals refining" },
        ],
      },
      {
        title: "Learn",
        tiles: [
          { route: "pat", img: "K1", title: "What is PAT?", sub: "Offline, atline, online, inline" },
          { route: "applications", img: "I3", title: "Applications", sub: "Industries, techniques and examples" },
          { route: "about", img: "C1", title: "About Hellma", sub: "Since 1922, family owned" },
        ],
      },
    ],
  },

  /* ---------- Product lines, families, products ---------- */
  lines: {
    "process-interfaces": {
      brand: "analytics",
      name: "Probes & flow cells",
      intro: "Hellma process interfaces bring the light path into the process: immersion probes for vessels and pipes, flow cells for sample streams. Choose by measurement principle first, then by temperature, pressure and materials.",
      families: ["excalibur", "falcata", "katana", "gladius", "polymer", "espada", "tidus"],
    },
    /* Example of a later line:
    "cuvettes": { brand: "analytics", name: "Cuvettes", intro: "...", families: ["macro", "semi-micro"] },
    */
  },

  families: {
    excalibur: { name: "Excalibur", principle: "transmission", desc: "Transmission probes and flow cells. The measuring gap works like the path length of a cuvette. Standard ratings reach 400 °C and 250 bar*, and the HY 25 is 3-A certified for hygienic processes.", foot: "weld", products: ["excalibur-xp", "excalibur-hd", "excalibur-hy", "excalibur-fcp", "excalibur-fet", "excalibur-ffv"] },
    falcata: { name: "Falcata", principle: "transflection", desc: "Transflection probes. Light crosses the sample, reflects off a mirror and crosses it again. Brazed versions reach 300 °C and 300 bar.", products: ["falcata-xp"] },
    katana: { name: "Katana", principle: "atr", desc: "ATR probes with a three-bounce sapphire element, for an extremely short path length. Brazed versions reach 300 °C and 100 bar.", products: ["katana-xp"] },
    gladius: { name: "Gladius", principle: "reflection", desc: "Reflection probes that collect diffusely reflected light, in contact or at a distance. Brazed versions reach 300 °C and 100 bar.", products: ["gladius-fdr", "gladius-xp"] },
    polymer: { name: "Polymer extruder probes", principle: "transmission", desc: "Custom-built probe pairs that thread into standard melt-pressure ports on polymer extruders, for transmission or diffuse reflection. Rated up to 300 °C and 750 bar.", products: ["polymer-probe"] },
    espada: { name: "Espada", principle: "fluorescence", desc: "Fluorescence probes for liquids in the UV/VIS range, with quartz glass optics.", products: ["espada"], empty: "Ask our team for Espada specifications and availability." },
    tidus: { name: "Tidus", principle: "raman", desc: "Raman probes with exchangeable optics and filters, optimized for maximum Raman signal. The Tidus Lumio adds an integrated laser and an ATEX-compliant version.", products: ["tidus-flex-gas", "tidus-lumio"], empty: "Ask our team for Tidus specifications and availability." },
  },

  products: {
    "excalibur-xp": {
      name: "Excalibur XP", type: "Immersion probe", family: "excalibur", line: "process-interfaces",
      img: "P1", drawing: "D2", badge: "Extremely precise",
      summary: "Extremely precise transmission probe for UV-Vis and NIR, sealed with Kalrez O-rings. Installs as an immersion probe or in a flow-through setup.",
      filter: { format: ["probe", "flow"], ranges: ["uvvis", "nir"], maxT: 260, maxP: 40 },
      specs: [
        ["Spectral range", "UV-Vis 210/240–1000 nm · NIR 400–2300 nm"],
        ["Path length", "1, 2, 5, 10 and 20 mm"],
        ["Body material", "Stainless steel 1.4571 (316Ti), Hastelloy C-22"],
        ["Optical material", "Quartz, sapphire"],
        ["Sealing", { v: "Kalrez O-rings (6230, 6375, 6380, 8085)", check: "Slide 18 marks 6375 with an asterisk but gives no footnote." }],
        ["Immersion depth", "100–940 mm, or flow-through setup"],
        ["Temperature", "Up to 260 °C (500 °F)"],
        ["Pressure", "Up to 40 bar (~580 psi)"],
      ],
      fits: ["retractables"],
    },
    "excalibur-hd": {
      name: "Excalibur HD", type: "Immersion probe", family: "excalibur", line: "process-interfaces",
      img: "P2", drawing: "D3", badge: "Heavy duty",
      summary: "Heavy-duty transmission probe with welded metal seals for high temperature, high pressure and aggressive media.",
      filter: { format: ["probe"], ranges: ["uvvis", "nir"], maxT: 400, maxP: 250, pStar: true },
      specs: [
        ["Spectral range", "UV 240–800 nm · VIS 400–2000 nm · NIR 800–2500 nm"],
        ["Path length", "2, 3, 4, 5 and 10 mm"],
        ["Body material", "Stainless steel 1.4435/1.4404 (316L), Hastelloy C-22, Hastelloy C-276"],
        ["Optical material", "Sapphire"],
        ["Sealing", "Welded metal seals"],
        ["Immersion depth", "100–940 mm"],
        ["Temperature", "−30 °C to 400 °C (−22 °F to 750 °F)"],
        ["Pressure", "Up to 250 bar* (~3600 psi)"],
      ],
      foot: "weld",
      fits: ["prm"],
    },
    "excalibur-hy": {
      name: "Excalibur HY 25", type: "Hygienic immersion probe", family: "excalibur", line: "process-interfaces",
      img: "P18", badge: "3-A certified",
      summary: "Hygienic transmission probe for food, dairy and pharmaceutical liquids. Soldered sapphire windows make it maintenance-free, and it can be cleaned in place (CIP and SIP) without interrupting the process.",
      filter: { format: ["probe"], ranges: ["vis", "nir"], maxT: 140, maxP: 16 },
      specs: [
        ["Spectral range", "VIS–NIR 400–2300 nm"],
        ["Path length", "1 mm (±0.025 mm)"],
        ["Body material", "Stainless steel 316L, electropolished"],
        ["Optical material", "Sapphire, soldered in (gold-tin)"],
        ["Process connection", "2-inch sanitary fitting (DN50, DIN 32676)"],
        ["Immersion depth", "38–75 mm · 25 mm diameter"],
        ["Temperature", { v: "Up to 140 °C (284 °F) at the process connection", check: "hellma.com gives 150 °C at the optical connection and 140 °C for the DIN 32676 connection." }],
        ["Pressure", "Up to 16 bar (~230 psi)"],
        ["Hygiene", "3-A certified · CIP and SIP capable · autoclavable with protective cap"],
        ["Applications", "Fat, protein, water and lactose in dairy; other hygienic food and pharma liquids"],
      ],
    },
    espada: {
      name: "Espada", type: "Fluorescence immersion probe", family: "espada", line: "process-interfaces",
      img: "svg:fluorescence", badge: "Quartz glass optics",
      summary: "Fluorescence immersion probe for liquids in the UV and VIS. Mirrors give the excitation light a second pass and send downward emission back to the collection fiber, for a strong signal.",
      check: "From the Hellma optical probes brochure (Espada Lab); no temperature, pressure or dimension specs or photo yet.",
      filter: { format: ["probe"], ranges: ["uvvis"], maxT: null, maxP: null },
      specs: [
        ["Measuring principle", "Fluorescence, collected at 90° with mirrors"],
        ["Wavelength range", "UV, VIS"],
        ["Optical material", "Quartz glass"],
        ["Sample", "Liquids"],
        ["Temperature and pressure", "Ask us"],
      ],
    },
    "tidus-flex-gas": {
      name: "Tidus Flex Gas", type: "Raman process probe", family: "tidus", line: "process-interfaces",
      img: "P19", badge: "For gases",
      summary: "Raman process probe for gas analysis, for example natural gas in pipelines. A special reflector amplifies the Raman signal, so low gas concentrations are measured reliably with the low laser power that explosive gases allow.",
      check: "From the natural gas application note; no temperature, pressure or dimension specs yet.",
      filter: { format: ["probe"], ranges: [], maxT: null, maxP: null },
      specs: [
        ["Measuring principle", "Raman"],
        ["Excitation", "Standard Raman spectrometer with a temperature-stabilized 785 nm laser, connected by optical fiber"],
        ["Hazardous areas", "Probe and spectrometer are separated, which allows ATEX-compliant operation"],
        ["Signal", "Special reflector amplifies the Raman signal for low concentrations"],
        ["Construction", "High-quality materials for high pressure and chemical resistance"],
        ["Tidus Flex family", "Modular design with three measuring heads (quartz or glass optics) for gases, liquids and solids"],
        ["Temperature and pressure", "Ask us"],
      ],
    },
    "tidus-lumio": {
      name: "Tidus Lumio", type: "Raman probe", family: "tidus", line: "process-interfaces",
      img: "svg:raman", badge: "Integrated laser",
      summary: "Raman process probe with its own integrated laser light source. The ATEX-compliant version measures in hazardous areas with an ATEX-capable VIS spectrometer, or with a standard spectrometer outside the zone. A non-ATEX version is also available.",
      check: "From Hellma's Tidus Lumio announcement and the optical probes brochure; no laser, temperature or pressure specs or photo yet.",
      filter: { format: ["probe"], ranges: [], maxT: null, maxP: null },
      specs: [
        ["Measuring principle", "Raman, direct backscatter"],
        ["Light source", "Integrated laser"],
        ["Hazardous areas", "ATEX-compliant version; non-ATEX version available"],
        ["Spectrometer", "Works with almost any Raman spectrometer"],
        ["Process interface", "Several configurations available"],
        ["Optics", "Exchangeable optics and filters"],
        ["Temperature and pressure", "Ask us"],
      ],
    },
    "excalibur-fcp": {
      name: "Excalibur FCP", type: "Flow cell", family: "excalibur", line: "process-interfaces",
      img: "P3", drawing: "D4", badge: "Welded metal seals",
      summary: "Inline flow cell with welded metal seals. Path lengths run from 2 mm up to 2 m for weakly absorbing streams.",
      filter: { format: ["flow"], ranges: ["uvvis", "nir"], maxT: 300, maxP: 250, pStar: true },
      specs: [
        ["Spectral range", "UV 240–800 nm · VIS 400–2000 nm · NIR 800–2500 nm"],
        ["Path length", "2, 5, 10 mm and 100–2000 mm"],
        ["Body material", "Stainless steel 1.4435/1.4404 (316L), Hastelloy C-276"],
        ["Optical material", "Sapphire"],
        ["Sealing", "Welded metal seals"],
        ["Temperature", "−30 °C to 300 °C (−22 °F to 570 °F)"],
        ["Pressure", "Up to 250 bar* (~3600 psi)"],
      ],
      foot: "weld",
    },
    "excalibur-fet": {
      name: "Excalibur FET", type: "Flow cell", family: "excalibur", line: "process-interfaces",
      img: "P4", drawing: "D5", badge: "Welded metal seals",
      summary: "Compact block flow cell with welded metal seals and short path lengths from 0.5 mm.",
      filter: { format: ["flow"], ranges: ["uvvis", "nir"], maxT: 400, maxP: 200 },
      specs: [
        ["Spectral range", "UV 240–800 nm · VIS 400–2000 nm · NIR 800–2500 nm"],
        ["Path length", "0.5, 1, 2, 3, 5 and 10 mm"],
        ["Body material", "Stainless steel 1.4435/1.4404 (316L)"],
        ["Optical material", "Sapphire"],
        ["Sealing", "Welded metal seals"],
        ["Temperature", "−30 °C to 400 °C (−22 °F to 750 °F)"],
        ["Pressure", "Up to 200 bar (~2900 psi)"],
      ],
    },
    "excalibur-ffv": {
      name: "Excalibur FFV", type: "Flow cell", family: "excalibur", line: "process-interfaces",
      img: "P5", drawing: "D6", badge: "Variable path",
      summary: "Flow cell with fixed or variable path length. A thermocouple and heating cartridge are available.",
      filter: { format: ["flow"], ranges: ["uvvis", "nir"], maxT: 180, maxP: 30 },
      specs: [
        ["Spectral range", "UV 240–800 nm · VIS 400–2000 nm · NIR 800–2500 nm"],
        ["Path length", "0.5, 1, 2, 3, 5 and 10 mm, or variable"],
        ["Body material", "Stainless steel 1.4435/1.4404 (316L), Hastelloy C-276 (2.4819)"],
        ["Optical material", "Sapphire"],
        ["Sealing", "Kalrez"],
        ["Temperature", "5 °C to 180 °C (40 °F to 350 °F)"],
        ["Pressure", "Up to 30 bar (~435 psi)"],
        ["Options", "Thermocouple and heating cartridge"],
      ],
    },
    "falcata-xp": {
      name: "Falcata XP", type: "Immersion probe", family: "falcata", line: "process-interfaces",
      img: "P6", drawing: "D7", badge: "Extremely precise",
      summary: "Transflection probe with interchangeable inserts for highly reproducible path lengths. Mini versions come in 6, 4 and 3 mm diameters.",
      filter: { format: ["probe", "flow"], ranges: ["uvvis", "nir"], maxT: 300, maxP: 300, brazed: true },
      specs: [
        ["Spectral range", "UV-Vis 210/240–1000 nm · NIR 400–2300 nm"],
        ["Path length", "1, 2, 5, 10 and 20 mm"],
        ["Body material", "Stainless steel 1.4571 (316Ti), Hastelloy C-22"],
        ["Optical material", "Quartz, sapphire"],
        ["Sealing", { v: "Kalrez O-rings (4079, 6230, 6375) or brazed (hard soldered: Ag, Cu, Ti)", check: "Slide 25 marks 6375 with an asterisk but gives no footnote." }],
        ["Immersion depth", "100–940 mm, or flow-through setup"],
        ["Rating with O-rings", "Up to 260 °C (500 °F) · 40 bar (~580 psi)"],
        ["Rating, brazed", "Up to 300 °C (572 °F) · 300 bar (~4350 psi)"],
      ],
      fits: ["retractables"],
    },
    "katana-xp": {
      name: "Katana XP", type: "Immersion probe", family: "katana", line: "process-interfaces",
      img: "P7", drawing: "D8", badge: "Extremely precise",
      summary: "Three-bounce ATR probe for media that absorb too strongly for a transmission gap.",
      filter: { format: ["probe", "flow"], ranges: ["uvvis", "nir"], maxT: 300, maxP: 100, brazed: true },
      specs: [
        ["Spectral range", "UV-Vis 240–1000 nm · NIR 400–2300 nm"],
        ["Measuring element", "3-bounce attenuated total reflection (ATR)"],
        ["Body material", "Stainless steel 1.4571 (316Ti), Titanium Grade 2"],
        ["Optical material", "Sapphire"],
        ["Sealing", { v: "Kalrez O-rings (4079, 6375) or brazed (hard soldered: Ag, Cu, Ti)", check: "Slide 28 marks 6375 with an asterisk but gives no footnote." }],
        ["Immersion depth", "100–640 mm, or flow-through setup"],
        ["Rating with O-rings", "Up to 260 °C (500 °F) · 40 bar (~580 psi)"],
        ["Rating, brazed", "Up to 300 °C (572 °F) · 100 bar (~1450 psi)"],
      ],
    },
    "gladius-fdr": {
      name: "Gladius FDR", type: "Immersion probe", family: "gladius", line: "process-interfaces",
      img: "P8", drawing: "D9", badge: "Contact-free",
      summary: "Diffuse reflection probe in anodized aluminum. It measures from 25 to 100 mm away, without touching the sample.",
      filter: { format: ["probe"], ranges: ["nir"], maxT: 100, maxP: 0 },
      specs: [
        ["Spectral range", "NIR 400–2300 nm"],
        ["Working distance", "25–100 mm"],
        ["Body material", "Anodized aluminum"],
        ["Optical material", "SF-5"],
        ["Sealing", "Epoxy glue or hard soldered (Ag, Cu, Ti)"],
        ["Immersion depth", "100–640 mm"],
        ["Temperature", "Up to 100 °C (212 °F)"],
        ["Pressure", "Atmospheric"],
      ],
    },
    "gladius-xp": {
      name: "Gladius XP", type: "Probe", family: "gladius", line: "process-interfaces",
      img: "P9", badge: "Extremely precise",
      summary: "Reflection probe in stainless steel, Hastelloy or titanium, measuring in contact or at 2 mm.",
      filter: { format: ["probe"], ranges: ["uvvis", "nir"], maxT: 300, maxP: 100, brazed: true },
      specs: [
        ["Spectral range", "UV-Vis 240–1000 nm · NIR 400–2300 nm"],
        ["Working distance", "Contact or 2 mm"],
        ["Body material", "Stainless steel 1.4435/1.4404 (316L), Hastelloy C-22, Titanium Grade 2"],
        ["Optical material", "Sapphire"],
        ["Sealing", { v: "EPDM, Kalrez O-ring (6221) or brazed (hard soldered: Ag, Cu, Ti)", check: "Slide 32 marks EPDM with an asterisk but gives no footnote." }],
        ["Rating with O-rings", "Up to 120 °C (248 °F) · 16 bar (~230 psi)"],
        ["Rating, brazed", "Up to 300 °C (572 °F) · 100 bar (~1450 psi)"],
      ],
    },
    "polymer-probe": {
      name: "Polymer extruder probe", type: "Custom probe pair", family: "polymer", line: "process-interfaces",
      img: "P17", img2: "P17b", badge: "Fits melt-pressure ports",
      summary: "For in-line measurement in polymer extruders under extreme conditions. The probes have the same dimensions as standard melt-pressure sensors (for example Dynisco), so they thread into existing ports.",
      filter: { format: ["probe"], ranges: [], maxT: 300, maxP: 750, custom: true },
      specs: [
        ["Measuring principle", "Transmission with two opposed heads, or diffuse reflection"],
        ["Path length", "1, 2, 5 or 10 mm, set by head length and bore"],
        ["Barrel material", "Titanium"],
        ["Optical material", "Sapphire"],
        ["Sealing", "Sapphire windows soldered into the barrel"],
        ["Temperature", "Up to 300 °C (572 °F)"],
        ["Pressure", "Up to 750 bar (~10,900 psi), custom built"],
        ["Fits", "Threaded ports for melt-pressure sensors, also in rheometers"],
      ],
    },
  },

  /* ---------- Measurement principles ---------- */
  principles: {
    transmission: {
      name: "Transmission", family: "excalibur",
      how: [
        "Light travels through an optical fiber to a collimator, either in the measuring head or at the back of the probe.",
        "It crosses the measuring gap once and interacts with the medium on the way.",
      ],
      plus: [
        "Comparable to measuring in a cuvette: the measuring gap equals the cuvette's path length.",
        "Low stray light, because the light passes through the sample only once.",
      ],
    },
    transflection: {
      name: "Transflection", family: "falcata",
      how: [
        "Light travels through an optical fiber to the measuring head, is collimated and passes through a window.",
        "It crosses the measuring gap, reflects off a mirror and crosses the medium a second time.",
      ],
      plus: [
        "Interchangeable inserts give highly reproducible, variable path lengths.",
        "Mini-diameter probes: 6, 4 and 3 mm.",
      ],
    },
    atr: {
      name: "ATR", long: "Attenuated total reflection", family: "katana",
      how: [
        "Light travels through the fiber to the ATR prism.",
        "It reflects off the prism surfaces. At each reflection an evanescent field penetrates a tiny distance into the medium, which absorbs specific wavelengths.",
      ],
      plus: ["Extremely short path length, for strongly absorbing liquids and pastes.", "Sealing by brazing is possible."],
    },
    reflection: {
      name: "Reflection", family: "gladius",
      how: [
        "Light travels down the outer fibers of a bundle and is focused onto the sample, in contact or up to 100 mm away.",
        "The sample scatters the light in all directions: diffuse reflection.",
        "The center fiber collects part of that light and carries it to the spectrometer.",
      ],
      plus: ["Hygienic design is possible.", "Sealing by brazing is possible.", "Contact-free measurement."],
    },
    fluorescence: {
      name: "Fluorescence", family: "espada",
      how: [
        "Excitation light travels down one fiber. A mirror turns it 90° so it crosses the measuring gap.",
        "Fluorescent molecules in the sample absorb it and emit light at longer wavelengths, in all directions.",
        "A mirror at the far side of the gap sends the excitation light back for a second pass, which generates more fluorescence.",
        "The collection fiber sits at 90° to the excitation beam. Emission heading away from it hits a mirror at the bottom of the gap and is reflected back up to the fiber.",
      ],
      plus: ["The right-angle geometry keeps excitation light out of the collection path, so the background stays low.", "Two mirrors double the excitation pass and recover downward emission, for more signal.", "Quartz glass optics for the UV/VIS range."],
    },
    raman: {
      name: "Raman", family: "tidus",
      how: [
        "Laser light travels down the probe. A beam splitter turns it onto the optical axis and it is focused on the sample.",
        "Almost all of the scattered light comes back at the laser wavelength. A tiny fraction is shifted by the molecules' vibrations: the Raman signal.",
        "The Raman light returns along the same path (direct backscatter). It passes the beam splitter, and a filter removes what is left of the laser line before the collection fiber.",
      ],
      plus: ["Exchangeable optics and filters.", "Optics optimized for maximum Raman signal.", "A large measuring spot focused on the sample from several centimeters away."],
    },
  },

  /* ---------- Sealing ---------- */
  sealing: {
    intro: "The seal between window and body decides the temperature, pressure and chemicals a probe can handle, and how long it lasts. Hellma offers all three approaches.",
    options: [
      {
        name: "Elastomeric seals (O-rings)", img: "S1",
        plus: ["Allows monolithic measuring heads for higher transmission", "Less expensive"],
        minus: ["Chemically resistant elastomers deform at high temperatures", "Requires regular servicing", "Limited temperature and pressure capability"],
      },
      {
        name: "Gold or silver alloy braze", img: "S2",
        plus: ["High temperature and pressure setups"],
        minus: ["Low-expansion metals are subject to chemical attack", "Chemically resistant brazes use brittle alloys that crack on expansion"],
      },
    ],
    welded: {
      name: "Welded metal seals", exploded: "S3", section: "S4",
      parts: ["Sapphire window", "Gold or PTFE coated Waspaloy C-ring", "Hastelloy sleeve", "Electron-beam weld"],
      stats: [
        { n: "400", u: "°C", l: "Temperature rating up to" },
        { n: "250", u: "bar*", l: "Pressure rating up to" },
      ],
      foot: "weld",
      plus: ["Extreme chemical resistance", "Insensitive to thermal shock", "Virtually indestructible"],
      used: ["excalibur-hd", "excalibur-fcp", "excalibur-fet"],
    },
  },

  /* ---------- Retractables ---------- */
  retractables: {
    intro: "A retractable housing lets process engineers replace, clean or calibrate optical and other inline sensors without interrupting production.",
    why: {
      title: "Why retract a probe?",
      points: [
        "Maintenance is often annual, with a limited time window.",
        "O-ring seals need regular servicing.",
        "Fouling builds up on the window.",
        "New or replacement sensors can be prepared and swapped in.",
      ],
    },
    knick: {
      title: "Retractable housings with Knick",
      points: [
        "Automated cleaning of the spectroscopic system without pulling the probe by hand.",
        "Exchange or remove the probe while the process is running.",
        "Lock-gate sealing.",
        "Works with Excalibur XP and Falcata XP probes.",
      ],
      credit: "Images courtesy of Knick",
    },
    models: [
      {
        id: "ceramat", name: "Ceramat", img: "R4", more: ["R5", "R6"],
        points: [
          "Manual, semi-automated and fully automated versions",
          "Plug-and-play: one central multi-plug carries every connection and check value",
          "Modular: materials, sensor assemblies, media connections and drive",
          "Ceramic chambers with rotational sealing: two ceramic discs, no O-rings",
          "Universal chemical compatibility, high chemical and temperature robustness, extreme hardness, sterilizable",
          "All chambers can be flushed; wetted parts in stainless steel, Hastelloy or titanium",
        ],
      },
      {
        id: "sensogate", name: "Sensogate", img: "R2", more: ["R3"],
        points: [
          "Plug-and-play: one central multi-plug carries every connection and check value",
          "Modular: materials, sensor assemblies, media connections and drive",
          "Hygienic version available",
          "Drive unit comes off without special tools; immersion tube removes with a bayonet coupling; simple O-ring replacement",
          "Double seal between calibration chamber and immersion tube, so process medium and compressed air stay separated",
          "Immersion tube in 1.4571, 1.4435, Hastelloy, PVDF, PVDF HD, PEEK or PEEK HD",
        ],
      },
    ],
    both: ["Sensor is not fixed to the armature", "Cleaning inside the calibration chamber", "New sensor holder clamp keeps the fibers from twisting during movement"],
    cyclone: {
      title: "Cyclone cleaning",
      text: "Traditional rinsing leaves a shadow on the side of the window facing away from the nozzle. Cyclone rinsing routes the cleaning medium tangentially, so it swirls around the whole sensor.",
      imgs: ["R7", "R8", "R9"],
    },
    prm: {
      title: "Probe Retraction Mechanism (PRM) for Excalibur HD",
      img: "P12", drawing: "D10",
      points: ["Heavy-duty bearing structure", "Lead screw or pneumatic actuation", "Optional clean-out chamber"],
      labels: ["Lead screw", "Conax fitting", "Flush chamber", "Ball valve", "Pipe flange", "Solvent fitting", "Reaction vessel"],
    },
  },

  /* ---------- Multiplexers ---------- */
  multiplexers: {
    intro: "A multiplexer connects one spectrometer to several probes or flow cells and switches between them, so one analyzer covers many measuring points.",
    setup: [
      { k: "Factory control room", t: "The process control system (PCS) receives results over TCP/IP or a fieldbus." },
      { k: "Analyzer cabinet", t: "Spectrometer, spectrometer PC and multiplexer sit in a shelter with air conditioning and purging where needed." },
      { k: "Process", t: "Optical fibers run from the multiplexer channels to the probes and flow cells in the plant." },
    ],
    fmx: {
      name: "FMX multiplexer", imgs: ["P10", "P10b", "P11"],
      double: "Double-sided: the light from the lamp and the signal returning from the probe to the detector are switched at the same time.",
      parts: [
        "“Double side” fiber optical connectors",
        "SMA or FC connectors for probes or cells (channels)",
        "Power supply connector",
        "Data interfaces: RS-232, RS-422/485",
      ],
    },
  },

  /* ---------- Hellma Solutions ---------- */
  solutions: {
    intro: "Hellma Solutions provides spectroscopic process analytical technology. Smart sensors and analysis give a detailed view into complex manufacturing processes, for more efficient production across many industries.",
    benefits: ["Better process control", "Higher product quality", "Higher output", "Improved production efficiency", "Less scrap and by-products", "Reduced energy use", "Increased process safety", "Higher process transparency", "Analysis of reaction processes", "Time saving"],
    sensors: [
      { id: "nir-xp", name: "NIR XP", img: "P13", text: "NIR miniature spectrometer combined with a probe for precise measurements, for example in the chemical and pharmaceutical industries, or with a hygienic probe for the food industry." },
      { id: "nir-hd", name: "NIR HD", img: "P14", text: "NIR miniature spectrometer combined with a probe for harsh conditions: chemical resistance, pressure, temperature and optional ATEX. For the chemical and petrochemical industries." },
      { id: "mir-atr", name: "MIR ATR", img: "P15", text: "MIR sensor combined with an ATR probe for dedicated applications with strongly absorbing media, for example in petrochemicals and paints and coatings." },
    ],
    custom: {
      img: "P16",
      q: "How can Hellma Solutions tailor technology to your needs?",
      ways: [
        { name: "Customized solutions", text: "We develop a specific solution and adapt the sensor, instrumentation or software where necessary." },
        { name: "Technology adaption", text: "Starting from existing technology, we develop and adapt every component the application requires." },
      ],
      phases: ["Application analysis", "Quick check", "Consulting", "Solution development", "Integration"],
    },
    portfolio: [
      { name: "PAT consulting", text: "From the analytical need to a plan: which measurement, where in the process, and what it takes to qualify it." },
      { name: "Feasibility studies", text: "Instrument performance is tested in advance with your process samples, including interfering factors and sample handling." },
      { name: "Chemometric service", text: "Calibration models are developed, validated and updated over the life of the method." },
      { name: "Solution integration", text: "Spectrometer, measuring cell, software and plant interfaces are brought together in your process." },
      { name: "Spectroscopy sensors", text: "NIR and MIR sensors that combine a miniature spectrometer with a Hellma probe." },
      { name: "Custom solution development", text: "Dedicated systems developed for a specific application." },
    ],
    portfolioCheck: "Portfolio descriptions are summarized from the roadmap and case-study slides; the portfolio slide itself only names the six services.",
  },

  /* ---------- PAT primer ---------- */
  pat: {
    what: "PAT stands for Process Analytical Technology: the tools and methods manufacturers use to monitor and control production in real time. Instead of checking quality only at the end, PAT checks it throughout production so you can adjust immediately.",
    positions: [
      { id: "offline", name: "Offline", speed: 1, speedLabel: "Hours to days", text: "A sample is taken to a laboratory. Results arrive after the process has moved on." },
      { id: "atline", name: "Atline", speed: 2, speedLabel: "Minutes to hours", text: "A sample is taken and measured on an analyzer next to the line." },
      { id: "online", name: "Online", speed: 3, speedLabel: "Seconds to minutes", text: "Part of the stream is diverted through a bypass, measured automatically and can be returned to the process." },
      { id: "inline", name: "Inline", speed: 4, speedLabel: "Seconds", text: "The probe sits directly in the process stream. Nothing is removed, and results arrive continuously." },
    ],
    positionsCheck: "The deck's diagram shows the four positions without definitions. These follow the usual PAT definitions.",
    why: [
      { name: "Process understanding", text: "Real-time data on critical process parameters (CPPs) and their effect on critical quality attributes (CQAs) shows where problems come from." },
      { name: "Quality control", text: "Deviations are detected early and corrected immediately, reducing errors and rejects." },
      { name: "Lower production costs", text: "Optimized processes use resources better and reduce rework, scrap and waste." },
      { name: "Faster development", text: "Rapid feedback on process and product quality shortens development and time to market." },
      { name: "Continuous production", text: "Real-time monitoring keeps quality consistent and the process running reliably without interruption." },
      { name: "Regulatory compliance", text: "Regulators such as the FDA promote PAT. It helps demonstrate consistently high product quality." },
      { name: "Risk reduction", text: "Variations that threaten quality or safety are caught in real time, reducing the risk of quality issues, recalls and penalties." },
    ],
    challenges: [
      { name: "Interferences", text: "Vibration, temperature swings and dirt can affect the spectroscopic measurement." },
      { name: "Process complexity", text: "Many processes have a large number of variables and interactions." },
      { name: "Choice of method", text: "UV, VIS, NIR, MIR and Raman each suit different measurement tasks." },
      { name: "Cost and investment", text: "Implementing spectroscopic methods in industrial processes can involve considerable cost." },
      { name: "Calibration", text: "Accurate spectra need the right reference data to build a reliable model." },
      { name: "Safety and compliance", text: "Industries such as pharma and food have special safety and compliance requirements." },
    ],
  },

  /* ---------- Case study: step-by-step PAT project ---------- */
  caseStudy: {
    title: "Water in solvents",
    sub: "How a PAT project runs, using a real example: measuring water impurities in a solvent after distillation, in a GMP and ATEX environment.",
    results: [{ n: "≈30 %", l: "less process time for the step" }, { n: "10 %", l: "less energy for the step" }, { n: "3 a day", l: "batches targeted, up from two" }],
    steps: [
      { id: "consulting", name: "Consulting", img: "W1", kind: "beforeafter",
        title: "Start with the analytical need",
        text: "Solvent leaves a distillation process and collects in a tank. Water content must be checked before the batch can be released." },
      { id: "feasibility", name: "Feasibility", img: "W2",
        title: "Test it before you buy it",
        points: [
          "Instrument performance is tested in advance.",
          "Spectroscopy sees the whole matrix (the process sample), not only the analyte.",
          "Interfering factors, matrix effects, sample handling and preparation are investigated.",
          "Suitable chemometric methods are selected.",
          "Outliers can be synthesized if needed and built into the models.",
          "The reference analysis and its overall error strongly influence the accuracy of the spectroscopic method.",
        ] },
      { id: "hardware", name: "Hardware", img: "W5", kind: "hardware",
        title: "Choose spectrometer and measuring cell",
        cols: [
          { h: "Spectrometer", points: ["21 CFR Part 11 software", "Works with the chosen chemometric software", "Connects to higher-level process software that links all PAT analyzers", "Accurate enough to measure the impurity in the process"] },
          { h: "Measuring cell: Excalibur HD flow cell", img: "P3", product: "excalibur-fcp", points: ["ATEX Zone 1", "FDA certified materials possible"] },
        ] },
      { id: "software", name: "Software", img: "W6",
        title: "Connect the data",
        points: ["Spectrometer software runs the chemometric model.", "Higher-level process software links all PAT analyzers.", "Results go to the programmable logic controller (PLC).", "FDA 21 CFR Part 11 compliant."] },
      { id: "interfaces", name: "Data Connection Protocols", img: "W3", kind: "chips",
        title: "Talk to the plant",
        chips: ["Analog 4–20 mA (e.g. Beckhoff)", "Modbus TCP", "PROFIBUS", "PROFINET", "OPC UA"] },
      { id: "integration", name: "Integration", img: "W3", kind: "atex",
        title: "Install across the ATEX boundary",
        text: "The Excalibur HD flow cell sits on the collection tank inside the ATEX area. Optical fibers carry the light to the spectrometer outside it." },
      { id: "model", name: "Model development", img: "W7", kind: "model",
        title: "Build and maintain the calibration",
        text: "Tap each phase to see how the calibration grows over time.",
        fig: { img: "F35", cap: "The real calibration: NIR prediction of water in the solvent against the reference (PLS model)." },
        phases: [
          { name: "Calibration", text: "Method development with internal validation." },
          { name: "External validation", text: "Independent samples confirm the model." },
          { name: "Revalidation", text: "Additional calibration and validation samples test the model over time and update it when needed." },
        ] },
      { id: "training", name: "Training", img: "W4",
        title: "Train the people who run it",
        cols: [
          { h: "Spectrometer software", points: ["Training during implementation of the solution"] },
          { h: "Chemometric software", points: ["In-house training", "Online training"] },
        ] },
      { id: "service", name: "Service", img: "K3",
        title: "Keep it running",
        points: ["Annual spectrometer maintenance", "Chemometric adjustment at different times of the year", "Support with GMP documentation, URS and validation concept"],
        note: "The measuring cell itself is maintenance-free." },
      { id: "vmodel", name: "Qualification", img: "W1", kind: "vmodel",
        title: "Qualify it step by step",
        text: "The V-model pairs each design step on the left with a test on the right. Tap a stage." },
    ],
    vmodel: [
      { id: "urs", name: "User requirement specification (URS)", side: "L", lvl: 0, text: "The user's requirements and wishes are described." },
      { id: "ds", name: "Design specification (DS)", side: "L", lvl: 1, text: "Requirements are translated into functions, then into technical designs and plans." },
      { id: "dq", name: "Design qualification (DQ)", side: "L", lvl: 2, text: "Confirms the design meets every requirement before anything is built or installed, avoiding costly changes later." },
      { id: "fat", name: "Factory acceptance test (FAT)", side: "L", lvl: 3, text: "The system is tested at the factory before shipping." },
      { id: "sat", name: "Site acceptance test (SAT)", side: "R", lvl: 3, text: "The system is tested again after delivery, on site." },
      { id: "iq", name: "Installation qualification (IQ)", side: "R", lvl: 2, text: "Verifies the system is installed correctly and meets the technical specifications." },
      { id: "oq", name: "Operational qualification (OQ)", side: "R", lvl: 1, text: "Tests that the system performs its specified functions correctly in operation." },
      { id: "pq", name: "Performance qualification (PQ)", side: "R", lvl: 0, text: "Checks that the system delivers the required performance under real operating conditions." },
    ],
    vmodelCheck: "FAT and SAT definitions are written for the kiosk; the deck's notes define URS, DS, DQ, IQ, OQ and PQ only.",
  },

  /* ---------- Applications (CPACT webinar 2025, PAT deck, Hellma application notes) ---------- */
  applications: {
    intro: "Metrological solutions using atline, online or inline spectroscopy pay off in many industries. Browse by industry or by technique, or open a case study.",
    fields: [
      { id: "pharma", name: "Pharmaceutical", img: "I1", text: "Follow drug release, drying and purification in real time and release batches under GMP.", stories: ["tablet-dissolution", "spray-drying", "filter-dryer", "purification", "bioprocess"], cases: ["water-solvents"] },
      { id: "biotech", name: "Biotechnology", img: "K2", text: "Follow nutrients and metabolites in the bioreactor, and the product through purification.", stories: ["bioprocess", "single-use-flow-cell"], related: ["excalibur-hy", "excalibur-xp", "retractables"] },
      { id: "chemistry", name: "Chemistry", img: "I3", text: "Follow reactions, purity and composition directly in the line, from polyols and phosgene to precious metals.", stories: ["precious-metals", "polyol", "oleochemicals", "phosgene", "purification", "acrylic-acid", "multipoint", "in-situ-fluorescence"], cases: ["water-solvents"] },
      { id: "petro", name: "Oil, gas & petrochemistry", img: "A9", text: "Measure water in crude oil, sulfur in marine fuel and gas composition under pressure, with ATEX-ready cells and probes.", stories: ["natural-gas", "oil-production", "bunker-fuel", "acrylic-acid"] },
      { id: "polymers", name: "Polymers", img: "I4", text: "Follow polymerization from monomer to polymer, from the reactor to the extruder.", stories: ["polymerization", "pom", "multipoint", "prepolymers", "phosgene", "polyol"], related: ["polymer-probe"] },
      { id: "paint", name: "Paints & coatings", graphic: "paint", text: "Turn spectra into L*a*b* color values, control resin pre-polymers and check BPA-free can coatings.", stories: ["paint-color", "prepolymers", "bpa-free"] },
      { id: "food", name: "Food", graphic: "food", text: "Check oils, fruit content and composition in the line, to hygienic standards.", stories: ["edible-oil", "fruit-yogurt", "dairy", "fruit-sorting", "agriculture-dairy"] },
      { id: "dairy", name: "Dairy", img: "S23", text: "Measure fat, protein, water and lactose from milk intake to recombination, with a 3-A certified probe.", stories: ["dairy", "fruit-yogurt", "agriculture-dairy"] },
      { id: "beverages", name: "Beverages", img: "I2", text: "Follow what the barrel adds while the spirit matures.", stories: ["whiskey"] },
      { id: "agriculture", name: "Agriculture", img: "I5", text: "Measure moisture, protein, starch and ash for precision farming.", stories: ["agriculture-dairy", "fruit-sorting"] },
      { id: "water", name: "Water & wastewater", graphic: "water", text: "Monitor nitrates, sulfates and H₂S, and spot impurities by fluorescence.", stories: ["water"] },
    ],
    techniques: {
      uvvis: {
        name: "UV-Vis", long: "Ultraviolet and visible spectroscopy", chart: "uvvis",
        points: [
          "Useful for molecules with double or triple bonds.",
          "Conjugated double bonds shift absorption toward the visible. That is what makes a solution colored.",
          "Transition metals absorb light very strongly.",
          "Color can be calculated from the spectrum as L*a*b* values.",
          "HPLC-UV and HPLC-DAD are the most common UV-Vis applications overall, mostly in the lab.",
        ],
        chartNote: "Schematic: acetone and toluene, after NIST Chemistry WebBook spectra.",
        stories: ["precious-metals", "paint-color", "tablet-dissolution", "single-use-flow-cell", "purification", "whiskey", "fruit-sorting", "water"],
      },
      nirmir: {
        name: "NIR / MIR", long: "Near- and mid-infrared spectroscopy", chart: "nirbands",
        points: [
          "Vibrational spectra give each molecule a unique fingerprint.",
          "NIR is the more widely used in process.",
          "Overtones and combinations of C–H, O–H and N–H vibrations fall in the NIR.",
        ],
        wide: true,
        chartNote: "Approximate NIR band positions by functional group. Tap a group to highlight its bands.",
        stories: ["natural-gas", "oil-production", "bunker-fuel", "acrylic-acid", "polymerization", "pom", "multipoint", "prepolymers", "bpa-free", "polyol", "oleochemicals", "bioprocess", "spray-drying", "filter-dryer", "edible-oil", "dairy", "agriculture-dairy"],
      },
      raman: {
        name: "Raman", long: "Raman spectroscopy", chart: "ramangas",
        points: [
          "A laser excites the sample. A tiny part of the scattered light is shifted by molecular vibrations, giving each compound a unique fingerprint.",
          "No water signal, which overlays many NIR signals in wet or biochemical processes such as fermentation.",
          "Measures gases that NIR cannot see, such as oxygen and nitrogen.",
          "Several components at once, qualitative and quantitative, with no sample preparation.",
        ],
        chartNote: "Schematic: approximate Raman shifts of natural-gas components.",
        stories: ["natural-gas"],
      },
      fluorescence: {
        name: "Fluorescence", long: "Fluorescence spectroscopy", chart: "fluor",
        points: [
          "A molecule absorbs light at one wavelength (excitation) and emits light at a longer one (emission).",
          "Very sensitive, so traces show up, for example impurities in wastewater.",
        ],
        chartNote: "Schematic excitation and emission spectra.",
        example: {
          title: "A vivid example: scheelite",
          text: "The mineral scheelite (CaWO₄) fluoresces blue, with a maximum near 440 nm from tungstate. Where molybdenum replaces tungsten, a yellow band near 540 nm appears; a shoulder near 570 nm comes from Dy³⁺. Other common impurities are Tb³⁺, Sm³⁺ and Pr³⁺. Not a process application, but it shows how sensitive fluorescence is.",
          chart: "scheelite",
        },
        stories: ["water", "in-situ-fluorescence"],
      },
    },
    cases: [
      { id: "water-solvents", route: "case", img: "K2b", title: "Water in solvents", sub: "A complete PAT project in ten steps. About 30 % less process time." },
      { id: "single-use-flow-cell", route: "app/single-use-flow-cell", img: "S04", title: "Single-use UV flow cell, with Sartorius", sub: "Cast quartz made a precision part cheap enough for single use." },
      { id: "polymerization", route: "app/polymerization", img: "S16", title: "Expandable polystyrene at Versalis", sub: "Inline end point instead of a blocked reactor." },
      { id: "oleochemicals", route: "app/oleochemicals", img: "S13", title: "Oleochemicals at IOI Oleo", sub: "Acid and OH number in the reactor at up to 245 °C." },
      { id: "fruit-yogurt", route: "app/fruit-yogurt", img: "S10", title: "Fruit content at Schwarzwaldmilch", sub: "An inline model replaces the Brix lab check." },
      { id: "bpa-free", route: "app/bpa-free", img: "S20", title: "BPA-free can coatings at AkzoNobel", sub: "Residual monomers tracked in a sticky polymerization." },
      { id: "precious-metals", route: "app/precious-metals", img: "P7", title: "Precious-metals refining", sub: "Why a strongly absorbing process moved from transflection to ATR." },
    ],
    stories: {
      /* ---- Pharmaceutical ---- */
      "tablet-dissolution": {
        title: "Tablet dissolution testing", short: "Automated drug-release tests with immersion probes, without sampling.",
        fields: ["pharma"], technique: "uvvis", img: "S06", hero: false,
        lead: "Dissolution tests show how fast and how completely a tablet releases its active ingredient. Optical immersion probes measure the release directly in the test vessel.",
        blocks: [
          { h: "The task", t: "The pharmacopoeias (EP, USP, JP) prescribe the procedure: six tablets, several test intervals. Manual sampling, filtering and photometry are labor-intensive and prone to error, and new dosage forms keep adding samples." },
          { h: "Measured in the vessel", t: "Probes connected to a spectrometer by optical fibers sit in the paddle stirrer next to the dissolving tablet. As the active ingredient dissolves, its absorption rises until the tablet has fully dissolved and the curve levels off. With several vessels, a multiplexer connects all probes to one spectrometer." },
          { h: "Faster with robotics", t: "A robotic arm can move the probe from vessel to vessel, rinsing and drying it in between, for very short measurement intervals." },
          { h: "Which probe", t: "The Excalibur Lab, with its monolithic quartz measuring head, has proven itself here. For narrow vessels with small lids, the slim Falcata Lab with interchangeable path-length tips fits better." },
          { h: "Why it pays", t: "Unlike HPLC, no filters, tubing or consumables are needed, and rinsing and drying the probe avoids carryover between samples." },
        ],
        figs: [
          { img: "F09", cap: "Absorption spectrum of an active ingredient as it is released into the buffer." },
          { img: "F10", cap: "Absorbance over time: it rises until the tablet has fully dissolved." },
        ],
        measured: ["Active-ingredient concentration", "Release profile"],
        related: ["falcata-xp", "multiplexers", "principle:transmission"],
      },
      "spray-drying": {
        title: "Spray drying: residual moisture in an API", short: "NIR through a sight glass replaces Karl Fischer sampling.",
        fields: ["pharma"], technique: "nirmir", img: "S21",
        lead: "Spray drying turns a solution of active ingredient and excipients into powder, in less than a second per droplet. The residual moisture of that powder has to stay within tight limits.",
        blocks: [
          { h: "Why moisture matters", t: "Too much residual moisture makes the powder clump and hurts flowability, yield and ultimately the drug's performance. Particle size and morphology, which shape the release profile, are set in the same step." },
          { h: "The old way", t: "Karl Fischer titration needs samples taken and analyzed by hand in the lab. By the time a result comes back, the dryer has moved on." },
          { h: "Measured without contact", t: "A Gladius XP 25 reflection probe coupled to an FT-NIR spectrometer looks at the powder through a sight glass. Water content is measured continuously and logged in a GxP-compliant data historian, with regular lab tests as a safety net." },
          { h: "Result", t: "The inline NIR values match the Karl Fischer reference throughout the run, and deviations from the target are caught as they start." },
        ],
        figs: [
          { img: "F37", cap: "The Gladius XP 25 measures the spray-dried powder through a sight glass." },
          { img: "F38", cap: "Water content during spray drying: inline NIR (orange) and Karl Fischer titration (grey)." },
        ],
        measured: ["Residual moisture"],
        related: ["gladius-xp", "principle:reflection"],
      },
      "filter-dryer": {
        title: "Filter dryer end point", short: "Diffuse reflectance NIR shows when the product is dry.",
        fields: ["pharma"], technique: "nirmir",
        lead: "Filter dryers wash and dry pharmaceutical product before blending and tableting. Drying for a fixed time, or stopping to pull a sample, gives no continuous view of the moisture.",
        blocks: [
          { h: "Measured in the bowl", t: "Diffuse reflectance probes sit in measurement ports in the dryer bowl, placed to suit its size, and connect to an FT-NIR spectrometer by optical fibers. The NIR light penetrates 2–3 mm into the product." },
          { h: "Keeping the tip clean", t: "Product can build up on the probe tip, and the probe would then keep measuring the same material. Probes with a software-controlled purge blow the tip clear at regular intervals." },
          { h: "Calibration", t: "Spectra taken during drying are matched to samples analyzed by loss on drying or Karl Fischer titration. A PLS model then reports moisture or solvent content in real time." },
        ],
        credit: "Based on Bruker Optics application note AF 505, Filter Drier Endpoint Analysis using FT-NIR Spectroscopy.",
        check: "Third-party note (Bruker). It does not name a Hellma probe; the Gladius XP is linked as a suggestion.",
        measured: ["Moisture", "Residual solvent"],
        related: ["gladius-xp", "principle:reflection"],
      },
      purification: {
        title: "Purification: end point by a marker", short: "Follow an invisible impurity through one the UV can see.",
        fields: ["pharma", "chemistry"], technique: "uvvis", img: "S18",
        lead: "In a filter-cake wash, an impurity is washed out until the wash solvent falls below a set limit. The impurity that matters can't be seen spectroscopically, only by gas chromatography.",
        blocks: [
          { h: "The problem", t: "Gas chromatography is too slow for a continuous end-point decision, so the wash runs on lab results that arrive late." },
          { h: "A marker that is visible", t: "A second impurity, present in much smaller amounts but visible in the UV, washes out of the filter cake along with it. Following its decrease in the wash solvent tracks the wash online." },
          { h: "Where to measure", t: "Depending on the plant, a transmission probe goes directly into the reactor or a flow cell into a bypass. The compact Excalibur Lab FFV flow cell suits this task." },
          { h: "Result", t: "The state of the wash is known in real time, the end point is found precisely, and close monitoring supports GMP compliance." },
        ],
        figs: [
          { img: "F32", cap: "Filter-cake wash: wash liquor runs through the cake until the impurity is gone." },
          { img: "F33", cap: "Impurity content (dots, by GC) and UV absorbance at 300 nm (line) fall together during the wash." },
        ],
        measured: ["UV marker in the wash solvent", "Wash end point"],
        related: ["excalibur-ffv", "principle:transmission"],
      },

      /* ---- Biotechnology ---- */
      bioprocess: {
        title: "Bioprocesses: nutrients and metabolites", short: "NIR in the bioreactor follows glucose and metabolites in real time.",
        fields: ["biotech", "pharma"], technique: "nirmir", img: "S03",
        lead: "Cell cultures and microbes make biopharmaceuticals, and also amino acids, antibiotics, bioethanol, beer, yeast and organic acids. The living process changes fast, and its variables depend on each other.",
        blocks: [
          { h: "The challenge", t: "Fermentation is often still followed through growth models, turbidity and other indirect measurements that need manual samples. Fast, interdependent reactions call for real-time measurement that does not disturb the cells." },
          { h: "Measured in the bioreactor", t: "An Excalibur XP 20 immersion probe with a 2 mm path length sits in the bioreactor and connects through light guides to an NIR spectrometer. It follows nutrients such as glucose that the cells take up and the metabolites they release. The monolithic sapphire head minimizes carryover and adhesion, and a quick-change fitting makes the probe easy to swap for cleaning." },
          { h: "Hygienic option", t: "Where deposits and biofouling are a risk, the 3-A certified Excalibur HY 25 has a hemispherical head, no dead volume and only smooth, electropolished surfaces, so germs have nowhere to settle." },
          { h: "More insight", t: "The continuous data feed trend models that predict how the reaction will go. Electrical impedance, which counts living cells, complements the spectroscopy." },
        ],
        figs: [{ img: "F03", cap: "An immersion probe measures directly in the bioreactor." }],
        measured: ["Glucose", "Metabolites"],
        related: ["excalibur-xp", "excalibur-hy", "principle:transmission"],
      },
      "single-use-flow-cell": {
        title: "Single-use UV flow cell, with Sartorius", short: "A cast quartz flow cell for the BioPAT® Spectro UV single-use sensor.",
        fields: ["biotech", "pharma"], technique: "uvvis", img: "S04", hero: false, isCase: true, customer: "Sartorius",
        lead: "Sartorius developed a single-use inline sensor that measures biomolecule concentration by UV spectroscopy during chromatographic purification. Its core is a quartz flow cell from Hellma.",
        blocks: [
          { h: "Why single use", t: "Biopharmaceuticals such as monoclonal antibodies are made in single-use bioreactors of up to 2,000 liters and purified in single-use tubing sets. Inline UV sensors watch each purification step without manual samples, so the sensor parts that touch the product have to be disposable too." },
          { h: "The challenge", t: "Existing single-use UV sensors fell short on dead volume, price-performance and ecological footprint. The quartz part needed a 1 mm gap held to within 0.05 mm, parallel windows of high optical quality and a seal to the plastic body around it, at a cost that suits a disposable part." },
          { h: "Quartz cold casting", t: "Hellma's Quartz Cold Casting (QCC) pours a silicon-containing compound into molds at room temperature, cures it and converts it to pure quartz glass. The flow cell comes out monolithic, in one piece, with sealing structures molded in, so many conventional processing steps disappear." },
          { h: "Into series production", t: "The project began with a feasibility study after the Sartorius PAT team saw QCC at ACHEMA. Hellma refines, inspects every gap width, packages and qualifies the cells under the PPAP process, so they go straight into the Sartorius sensor." },
          { h: "The payoff", t: "Every connection size has the same, precisely known optical path length. That lets spectroscopic methods, not just simple photometry, determine concentration, with minimal dead volume and practically no effect on flow." },
        ],
        quote: { t: "As part of the good cooperation with Hellma, we succeeded in jointly iteratively developing an optical sensor core component from the first draft to series production under the highest quality requirements.", who: "Dr. Christian Grimm, Head of Product Development Embedded Hardware, Sartorius Stedim Biotech GmbH" },
        figs: [
          { img: "F06", cap: "The finished single-use flow cell, cast in one piece of quartz glass." },
          { img: "F04", cap: "First 3-D model of the flow cell." },
          { img: "F05", cap: "First cast prototype." },
        ],
        measured: ["Biomolecule concentration", "Impurities during purification"],
        related: ["custom", "principle:transmission"],
      },

      /* ---- Chemistry ---- */
      "precious-metals": {
        title: "Precious-metals refining: from dilution to ATR", short: "Transflection needed a million-fold dilution. ATR did not.",
        fields: ["chemistry"], technique: "uvvis", img: "P7", isCase: true,
        lead: "Transition metals absorb UV-Vis light very strongly. For one refiner, that made a standard measurement almost unworkable until the probe changed.",
        blocks: [
          { h: "The problem", t: "A precious-metals refining company measured with a Falcata transflection probe with a 1 mm light path. The samples absorbed so strongly that they had to be diluted by a factor of one million to bring the absorbance into a usable range." },
          { h: "The fix", t: "They moved to an ATR probe. ATR has an extremely short path length, so strongly absorbing liquids stay in range, and it worked beautifully." },
          { h: "Why metals are hard", t: "Transition metals such as copper, nickel, cobalt, iron, manganese and zinc absorb light very strongly, with bands spread from the UV into the near infrared." },
        ],
        chart: "dilution",
        measured: ["Transition-metal concentration"],
        related: ["falcata-xp", "katana-xp", "principle:atr"],
      },
      polyol: {
        title: "Polyol production", short: "Water, acid number, viscosity and hydroxyl number, measured at 400 °C.",
        fields: ["chemistry", "polymers"], technique: "nirmir", img: "S17",
        lead: "Polyols react with isocyanates to make polyurethanes: rigid and flexible foams, adhesives, coatings and elastomers. Their structure decides the properties of the end product.",
        blocks: [
          { h: "Sensitive chemistry", t: "Polyol synthesis reacts to swings in temperature, pressure and reaction time. Raw-material variations and side reactions show up as color deviations or uneven viscosity, and lab samples come back too late to steer the batch." },
          { h: "A probe for 400 °C", t: "The Excalibur HD FPT probe uses metal seals, a sapphire window and light guides in place of internal optical fibers, so it measures reliably at the 400 °C this process needs. The wear-free seals make it maintenance-free." },
          { h: "From spectra to numbers", t: "Hellma Solutions tests process samples in its application lab, pre-processes the spectra mathematically to remove unrelated variation, and builds a validated chemometric model for each parameter." },
          { h: "More polyols", t: "The term also covers sugar alcohols, made by hydrogenating sugars, where NIR follows the same kinds of parameters." },
        ],
        params: [["Water", "Keeps the reaction under control"], ["Viscosity", "Shapes the processing properties"], ["Acid number", "The share of acidic impurities"], ["Hydroxyl number", "Crucial for the product's reactivity"]],
        figs: [{ img: "F31", cap: "NIR spectra of polyol samples with different parameter values, measured with the Excalibur HD FPT." }],
        measured: ["Water", "Viscosity", "Acid number", "Hydroxyl number"],
        related: ["excalibur-hd", "principle:transmission"],
      },
      oleochemicals: {
        title: "Oleochemicals at IOI Oleo", short: "Acid and OH number in the reactor, at up to 245 °C.",
        fields: ["chemistry"], technique: "nirmir", img: "S13", isCase: true, customer: "IOI Oleo",
        lead: "IOI Oleo in Hamburg makes oleochemical specialties from plant-based raw materials: active ingredients and excipients for pharmaceuticals, emollients for cosmetics and esters for food.",
        blocks: [
          { h: "Natural raw materials vary", t: "Rapeseed, sunflower, soybean and palm oil change with each harvest. Oils and fats also react with oxygen in the air, so the reaction is measured directly in the closed vessel." },
          { h: "Tough conditions", t: "The probes face up to 245 °C, agitator vibration and pressure swings in 24-hour batch operation. Fatty acids, glycerol, propylene glycol, tetra-n-butyl titanate and butanediol must all be monitored to keep contaminants below EU limits." },
          { h: "The setup", t: "Excalibur HD FPT transmission probes sit directly in the reaction vessels and connect over 30–50 m of fiber to one spectrometer through a multiplexer, so acid number and OH number are followed along the whole process chain." },
          { h: "Why the FPT", t: "Hollow light guides instead of glass fibers handle very high and very low temperatures. Gold-coated metal seals and sapphire windows replace elastomers, and a second barrier with a nitrogen charge reduces the risk of leaks, so maintenance intervals get much longer." },
          { h: "Result", t: "Knowing the exact state of the reaction ends batches on time, shortens run times and replaces lab sampling." },
        ],
        figs: [
          { img: "F25", cap: "NIR spectra of coconut oil: pure (green) and contaminated (yellow, red)." },
          { img: "F24", cap: "Probe in the reactor, connected to the spectrometer." },
        ],
        measured: ["Acid number", "OH number", "State of reaction", "Contamination"],
        related: ["excalibur-hd", "multiplexers", "principle:transmission"],
      },
      phosgene: {
        title: "Phosgene for polyurethane", short: "Gas purity checked inline, in a flow cell built for toxic gases.",
        fields: ["chemistry", "polymers"], technique: null, img: "S08", foot: "weld",
        lead: "Phosgene (COCl₂) is a highly toxic gas and a key raw material: it turns amines into the isocyanates TDI and MDI, which react with polyols to make polyurethane.",
        blocks: [
          { h: "Why purity matters", t: "Moisture and other impurities in the gas are very costly in later process steps. Polycarbonate, for example, needs phosgene with at most 250 ppm carbon tetrachloride, or the clear plastic discolors." },
          { h: "Why online", t: "Gas chromatography limits continuous monitoring. Spectroscopic probes and cells measure directly in the gas stream, in real time. Because the gases are toxic and flammable, nothing may leak." },
          { h: "The flow cell", t: "The Excalibur HD FCP, built from standard Swagelok parts, measures in transmission along the pipe axis. Path lengths of up to 2 m reach impurities in the ppt range. The optical fingers are filled with nitrogen: the slight overpressure and a second barrier keep the medium and moisture out." },
          { h: "Built for it", t: "Metal seals and sapphire optics make the stainless-steel cell maintenance-free and good for 250 bar* and 300 °C. It can be used in ATEX zones 1, 2, 21 and 22, inline or atline in a bypass cabinet next to the spectrometer." },
        ],
        figs: [
          { img: "F15", cap: "Measuring interface on the gas line." },
          { img: "F16", cap: "Excalibur HD FCP with standard Swagelok parts, for path lengths up to 2 m." },
        ],
        measured: ["Impurities in the process gas", "Moisture"],
        related: ["excalibur-fcp", "principle:transmission"],
      },
      "acrylic-acid": {
        title: "Acrylic acid: dewatering end point", short: "A brazed titanium Falcata keeps measuring where acrylic acid crystallizes and polymerizes.",
        fields: ["petro", "chemistry"], technique: "nirmir", img: "S02",
        lead: "Acrylic acid and acrylate esters are key monomers for superabsorbent polymers, dispersions, coatings, adhesives and sealants. They are made from propene by two-step gas-phase oxidation.",
        blocks: [
          { h: "Where NIR measures", t: "In the azeotropic distillation column, water is removed with a carrier such as toluene or isobutylbenzene. NIR follows the water content in the liquid phase to find the end point of dehydration, so the acid meets specification for final purification. Tight control improves stability, energy efficiency and throughput." },
          { h: "A hard place to measure", t: "Acrylic acid can crystallize as it cools, and the crystals damage and harden seals. High-purity acid also tends to polymerize spontaneously when temperature or pressure shift, leaving polymer on the optics. Traces of polymer and inhibitor make the liquid slightly turbid." },
          { h: "The probe", t: "The Falcata XP transflection probe gives stable signals in highly absorbent, slightly turbid liquids. Its windows are brazed directly into a titanium housing: no elastomer seals, and no gaps or dead spaces where polymer can build up. It fits Knick Ceramat and SensoGate retractable housings." },
          { h: "Proven", t: "The Falcata XP has been tested under industrial conditions in acrylic acid production at a major European plant." },
        ],
        figs: [{ img: "F02", cap: "NIR measuring points in the acrylic acid process: water removal and final cleaning." }],
        measured: ["Water content", "Dehydration end point"],
        related: ["falcata-xp", "retractables", "principle:transflection"],
      },
      multipoint: {
        title: "Many measuring points, one spectrometer", short: "A multiplexer serves up to 16 points in a multi-stage plant.",
        fields: ["polymers", "chemistry"], technique: "nirmir", img: "S14",
        lead: "Plastics, medicines and foods often come from multi-stage processes with measuring points spread across reactors and lines: polymerization, solvent recovery, additive dosing, fiber spinning.",
        blocks: [
          { h: "The cost problem", t: "A spectrometer at every point drives up investment, and calibrating, running and maintaining many instruments takes much more work." },
          { h: "The solution", t: "The Hellma FMX multiplexer connects up to 16 probes or flow cells to one spectrometer. A high-precision stepper motor moves a retroreflector that couples the light into each channel through collimator lenses. The channels are separated so no light crosses over, and switching takes less than a second." },
          { h: "Easy to extend", t: "The FMX is modular, so channels can be added later up to full capacity. It connects to the process control system over RS232 or RS422 with the supplied software, and switches in both directions as standard." },
          { h: "Payback", t: "Cost per measuring point drops sharply, and a multiplexer can pay for itself from just two measuring points." },
        ],
        figs: [
          { img: "F26", cap: "Three process streams, one spectrometer: the multiplexer replaces the extra instruments." },
          { img: "F27", cap: "Cost per measuring point with and without the FMX multiplexer." },
        ],
        measured: ["Reaction progress at every stage"],
        related: ["multiplexers", "excalibur-xp", "falcata-xp"],
      },
      "in-situ-fluorescence": {
        title: "In situ fluorescence in the reaction vessel", short: "A Hellma fluorescence probe brings the fluorometer to the reaction.",
        fields: ["chemistry"], technique: "fluorescence", img: "S22", hero: false,
        lead: "Pulling samples from a running reaction is slow, can be hazardous, and can change temperature, pressure or volatile content, so the data lag behind and may be off. A fiber-optic fluorescence probe measures in place instead.",
        blocks: [
          { h: "The setup", t: "A Hellma fluorescence probe (661.057-UV) sits in the reaction vessel. Its fiber-optic cables match the F-3000 coupler of a HORIBA Fluorolog-3 fluorometer, so pipetting, mixing, heating, cleaning and the fume hood all drop out." },
          { h: "The example", t: "A pyrene-based nickel complex was titrated with NaOH. Excited at 340 nm, it emits at 375 and 395 nm under acidic conditions. As the pH rises, that fluorescence drops through photoinduced electron transfer, and a broad excimer band appears near 480 nm." },
        ],
        figs: [{ img: "S22", cap: "Hellma fiber-optic fluorescence probe 661.057-UV." }, { img: "F39", cap: "Fluorescence spectra of the nickel complex as the pH rises; excitation at 340 nm. Data: HORIBA Scientific." }],
        credit: "Based on HORIBA Scientific technical note FL-34, Liquid in situ Fluorescence Measurements.",
        check: "Third-party note (HORIBA). Confirm whether probe 661.057-UV belongs to the Espada family.",
        measured: ["Fluorescence intensity", "Reaction progress"],
        related: ["espada", "principle:fluorescence"],
      },

      /* ---- Oil, gas & petrochemistry ---- */
      "natural-gas": {
        title: "Natural gas composition", short: "Raman and NIR resolve the mixture in the pipeline.",
        fields: ["petro"], technique: "raman", techniques: ["raman", "nirmir"], img: "S11",
        lead: "Natural gas is mostly methane and is traded on its energy value. That value depends on the exact mix of hydrocarbons, which varies with where the gas was extracted, so it is analyzed at several points on its way to the customer.",
        blocks: [
          { h: "Why not gas chromatography", t: "GC separates many components and traces, but carrier and calibration gases make it expensive, and the lag between sampling and result means deviations are found late." },
          { h: "Hard conditions", t: "Pipelines run at around 80 bar to raise energy density, so the measurement has to withstand the pressure. Because the gas is explosive, laser power is strictly limited, and detection has to be sensitive enough to work with little of it." },
          { h: "Raman in the pipeline", t: "The Tidus Flex Gas probe connects by optical fibers to a standard Raman spectrometer with a temperature-stabilized 785 nm laser. Keeping the spectrometer away from the probe allows ATEX-compliant operation. A special reflector boosts the Raman signal for low gas concentrations, and the system reports each gas concentration every minute." },
          { h: "Raman and NIR together", t: "Raman tells the hydrocarbons apart even at low concentrations, and it sees oxygen and nitrogen, which NIR cannot. NIR absorption complements it for the hydrocarbons, CO₂ and H₂S. The same Raman approach works for biogas and biomethane before feed-in." },
        ],
        charts: [{ key: "ramangas", note: "Schematic: approximate Raman shifts of natural-gas components." }, { key: "gas", note: "Schematic NIR absorption of natural gas, 1000–2200 nm." }],
        ranges: [["Methane", 70, 90], ["Ethane, propane, butane", 0, 20], ["CO₂", 0, 8], ["H₂S", 0, 5], ["O₂", 0, 0.2, "Raman only"], ["N₂", 0, 0.2, "Raman only"], ["Ar, He, Ne, Xe", null, null, "Trace"]],
        measured: ["Methane", "Ethane, propane, butane", "CO₂", "H₂S", "O₂ and N₂ (Raman)"],
        related: ["excalibur-fcp", "excalibur-hd", "tidus-flex-gas", "principle:transmission", "principle:raman"],
      },
      "oil-production": {
        title: "Water in crude oil", short: "NIR measures the water-in-liquid ratio right at the pipeline.",
        fields: ["petro"], technique: "nirmir", img: "S12",
        lead: "To get the most out of an oil field, producers watch water and gas content continuously. Over-pumping dilutes the stream and lowers the yield; knowing the water content lets them tune pumping so more oil comes up in the same time.",
        blocks: [
          { h: "Why it is difficult", t: "Solids, gas fraction and salinity fluctuate, the oil is viscous and conditions vary widely. Phase-separation methods are often imprecise, lab analysis is slow, and equipment at the pipeline must meet the ATEX directive 2014/34/EU." },
          { h: "How NIR helps", t: "Crude oil and water absorb near-infrared light very differently. The signal comes from the water itself, not the dissolved salts, so water-in-liquid-ratio (WLR) sensors based on an NIR transmission cell work in real time, unaffected by emulsions or salinity, without large phase-separation systems." },
          { h: "Three designs, all metal-sealed", t: "The Excalibur HD Flange cell mounts directly in the main pipeline, and its welded sapphire optics cannot be misadjusted. With CE certification to the Pressure Equipment Directive 2014/68/EU it can go into ATEX zones 1, 2, 21 and 22 and into pressure vessels without acceptance tests. The compact Excalibur HD FCP suits smaller pipes, and the Excalibur HD FPT probe fits an existing flange and adds a second barrier." },
        ],
        figs: [
          { img: "F23", cap: "Excalibur HD Flange measurement cell." },
          { img: "F22", cap: "Crude oil sample." },
        ],
        measured: ["Water-in-liquid ratio (WLR)"],
        related: ["excalibur-fcp", "excalibur-hd", "principle:transmission"],
      },
      "bunker-fuel": {
        title: "Sulfur in marine fuel", short: "Online NIR helps ships stay within sulfur-oxide limits.",
        fields: ["petro"], technique: "nirmir", img: "S05",
        lead: "Most large ships burn bunker fuel, a cheap heavy residue from refining. Its sulfur content becomes sulfur oxides in the exhaust, and much stricter limits for ships have applied since 2020.",
        blocks: [
          { h: "The challenge", t: "The fuel's composition varies from tank to tank and even within a tank, and can change during storage. Sticky particles foul pipes and instruments, and undetected deposits can damage the engine. Occasional manual samples are not precise enough." },
          { h: "Measured in the fuel line", t: "A spectrometer with an Excalibur HD FCP flow cell in the heated fuel supply to the engine measures the fuel's components continuously, so the engine can be controlled and the limits kept at all times." },
          { h: "Built for the engine room", t: "Metal seals make the cell resistant to pressure and temperature, the stainless-steel housing allows use in explosive areas, and sapphire optics resist particle adhesion. The exchangeable center part takes an H-cell for 2–10 mm path lengths or Swagelok T-pieces for 10 cm to 2 m." },
        ],
        figs: [
          { img: "F07", cap: "Example NIR absorption spectrum of heavy fuel oil." },
          { img: "F08", cap: "Excalibur HD FCP with H-cell center part." },
        ],
        measured: ["Sulfur content", "Fuel components"],
        related: ["excalibur-fcp", "principle:transmission"],
      },

      /* ---- Polymers, paints & coatings ---- */
      polymerization: {
        title: "Expandable polystyrene at Versalis", short: "Bead size and conversion followed inline, so the batch ends on time.",
        fields: ["polymers"], technique: "nirmir", img: "S16", hero: false, isCase: true, customer: "Versalis",
        lead: "Versalis makes expandable polystyrene (EPS) beads by suspension polymerization in Mantova, Italy. Two things decide quality and yield: how far the styrene has converted to polymer, and how big the beads have grown.",
        blocks: [
          { h: "The process", t: "In the second reactor, a 1:1 water–styrene mixture is heated to 90 °C and stirred so the monomer forms beads. At 70–75 % conversion the temperature rises to 123 °C and calcium phosphate keeps the beads from sticking. The batch takes four hours; later, pentane and steam expand the beads up to 50 times." },
          { h: "Why the end point matters", t: "Miss it, and the beads clump into a large ball that blocks the reactor outlet, or even the whole plant, and the cleanup costs a six-figure sum. Until now, operators pulled samples and judged bead size against a light beam." },
          { h: "Measured in the reactor", t: "A Gladius XP reflection probe on the side of the reactor measures in contact with the suspension without disturbing its flow. As styrene converts, the transmission falls. The data show when to add dispersant to steer bead growth, and the reaction ends automatically once the beads reach their size. The installation meets ATEX Zone 2 IIB T3." },
          { h: "Result", t: "Up to one hundred polymerization cycles run in the same reactor without cleaning the probe. Ring-shaped illumination fibers keep stray light low, and the hygienic design cleans without disassembly." },
          { h: "Monomer to polymer", t: "Many monomers have a UV signal from their double bonds, and the NIR spectrum follows the conversion. The same approach applies to PMMA, a shatter-resistant alternative to glass, and to PET for beverage and food containers." },
        ],
        figs: [
          { img: "F30", cap: "Spectra during polymerization: start (blue), during (green) and end (red)." },
          { img: "F29", cap: "Gladius XP installed on the reactor at Versalis." },
        ],
        measured: ["Monomer conversion", "Bead size", "Reaction end point"],
        related: ["gladius-xp", "principle:reflection"],
      },
      pom: {
        title: "POM: methanol in real time", short: "NIR replaces a 45-minute GC loop in polyoxymethylene production.",
        fields: ["polymers"], technique: "nirmir", img: "S15",
        lead: "Polyoxymethylene (POM) goes into gear wheels, housings, coffee machines, zippers and toothbrushes. Its production uses several reactants, solvents and additives that must stay within a narrow range.",
        blocks: [
          { h: "The process", t: "Formaldehyde is first converted to trioxane, purified and depolymerized again, then polymerized with an amine catalyst at low temperature. That needs very pure starting material and the complete exclusion of water." },
          { h: "The problem", t: "Methanol was checked by gas chromatography several times a day. With transport to the lab, a result took about 45 minutes while the reaction carried on. A wrong composition can trigger unwanted polymerization, downtime and damage worth millions, at outputs of up to 300 tonnes a day." },
          { h: "The solution", t: "Optical immersion probes and an NIR spectrometer (800–2,500 nm) record the composition every few seconds or minutes, visible directly in the control room. A sieve around the measuring head, in the wake of the flow, steers solid clumps around the optics. Lab GC checks continue at intervals as an extra safeguard." },
        ],
        figs: [{ img: "F28", cap: "Methanol concentration over time, measured by NIR during POM production." }],
        measured: ["Methanol", "Reactant and solvent composition"],
        related: ["principle:transmission", "finder"],
      },
      prepolymers: {
        title: "Pre-polymers for coatings and resins", short: "NCO, residual monomer and moisture in sticky resins, with in-process probe cleaning.",
        fields: ["paint", "polymers"], technique: "nirmir", img: "S01",
        lead: "Polyester and alkyd resins are high-performance binders for paints, coatings and varnishes. The pre-polymers formed during their synthesis need a precisely controlled reactivity.",
        blocks: [
          { h: "What to watch", t: "Within a single batch, both the chemistry and the physical properties of the reaction mass change. NCO content, temperature, viscosity, residual monomer and moisture all need reliable monitoring, and the end point accurate control." },
          { h: "The problem with sticky media", t: "Viscous, adhesive polymer builds up on probe windows, distorts the signal and causes drift, so conventional probes need frequent maintenance." },
          { h: "Probe plus retractable housing", t: "A Falcata XP 12 transflection probe with interchangeable path-length tips measures transparent to slightly turbid media in seconds. Mounted in a Knick Ceramat retractable housing, it moves into a separate chamber for cleaning, reference measurements and calibration. Two ceramic discs seal the chamber from the process, and a cyclonic rinse flows all around the probe." },
          { h: "Result", t: "No process interruption or reactor draining for cleaning, reliable data even with fouling media, and less waste." },
        ],
        figs: [{ img: "F01", cap: "Knick Ceramat: the probe retracts into a chamber for rinsing and referencing while the process runs." }],
        measured: ["NCO content", "Residual monomer", "Moisture", "Viscosity"],
        related: ["falcata-xp", "retractables", "principle:transflection"],
      },
      "bpa-free": {
        title: "BPA-free can coatings at AkzoNobel", short: "Residual monomers tracked in a sticky polymerization, with in-process probe cleaning.",
        fields: ["paint", "food"], technique: "nirmir", img: "S20", isCase: true, customer: "AkzoNobel",
        lead: "AkzoNobel's Accelshield 300 coats the inside of two-piece aluminium beverage cans without bisphenols, styrene or PFAS. Polymerization creates its binder.",
        blocks: [
          { h: "Why it matters", t: "After the European Food Safety Authority's 2023 re-evaluation of bisphenol A, its use in food-contact packaging is banned or restricted in the EU. Only fully converted polymers meet the requirements, so residual monomers such as acrylates and styrenes must be measured during polymerization, continuously and fast." },
          { h: "A sticky medium", t: "The reaction mass is highly viscous and sticky. Polymer can cling to or harden on the window and distort the signal, so the probe has to be cleaned during the process without losing the measurement." },
          { h: "The solution", t: "A Falcata XP transflection probe measures the polymerization status in seconds. It sits in a Knick SensoGate retractable housing: in clean-in-place mode the probe is cleaned, referenced, serviced or removed while the process keeps running." },
          { h: "Result", t: "Deviations are caught and corrected immediately, rejects and material losses fall, and product quality stays consistently high." },
        ],
        figs: [{ img: "F36", cap: "Falcata XP in a Knick SensoGate retractable housing on the reactor." }],
        measured: ["Residual monomers", "Polymerization status"],
        related: ["falcata-xp", "retractables", "principle:transflection"],
      },
      "paint-color": {
        title: "Paint color from the spectrum", short: "L*a*b* values calculated from UV-Vis spectra.",
        fields: ["paint"], technique: "uvvis",
        lead: "A UV-Vis spectrum holds everything needed to calculate a paint's color as L*a*b* values.",
        blocks: [
          { h: "Reading L*a*b*", t: "L* runs from dark (0) to light (100). a* runs from green (negative) to red (positive). b* runs from blue (negative) to yellow (positive). Try it with the sliders." },
          { h: "When TiO₂ takes over", t: "TiO₂, a common white additive, takes over the signal at low dye concentrations. A blue paint with four times less pigment reads almost white: L* rises from 91.0 to 99.6." },
        ],
        chart: "lab",
        tables: [
          { caption: "Paints, measured", rows: [["Blue", 99.59, 0.11, -1.72, 0.28, -1.62, 0.53], ["Red", 97.51, 1.43, 0.32, 0.08, -3.03, 0.36], ["Yellow", 100.00, 1.15, 0.42, 0.20, 0.27, 0.76]] },
          { caption: "Blue, standard vs. 4× less pigment", rows: [["Blue, standard", 91.00, 6.76, -1.02, 0.50, -5.75, 2.62], ["Blue, 4× less pigment", 99.59, 0.11, -1.72, 0.28, -1.62, 0.53]] },
        ],
        credit: "Measured in cooperation with Mettler Toledo",
        measured: ["L* lightness", "a* green–red", "b* blue–yellow", "Pigment level"],
        related: ["katana-xp", "principle:atr"],
      },

      /* ---- Food, dairy, beverages, agriculture, water ---- */
      "edible-oil": {
        title: "Edible oil in chocolate", short: "Iodine value measured inline with a 3-A hygienic probe.",
        fields: ["food"], technique: "nirmir", img: "S07",
        lead: "In chocolate and chocolate-flavored foods, edible oil can replace part of the cocoa butter. Its fatty-acid makeup shapes creaminess, texture, viscosity and shelf life.",
        blocks: [
          { h: "Iodine value", t: "The iodine value tells how many grams of iodine 100 g of fat absorbs, which reflects its unsaturated fatty acids. Oil with a low iodine value is mostly saturated and makes chocolate hard at room temperature; a high value keeps spreads creamy." },
          { h: "Before it reaches the cocoa mass", t: "Lab samples take time and trained staff, and the process runs on while results wait. The equipment must also meet strict hygiene rules and must not affect the product." },
          { h: "The solution", t: "An Excalibur HY 25 (3-A) hygienic immersion probe connects by fiber to a VIS-NIR diode-array spectrometer. The chemometric model uses the whole spectrum, which makes it robust. Samples cluster at iodine values between 30 and 60, and spectra that look like outliers stay in the model because they carry process information." },
          { h: "Result", t: "Real-time values go straight to the process control system, recipes are met, ingredients are used optimally, and the system can be extended to more parameters." },
        ],
        figs: [
          { img: "F12", cap: "NIR spectra of edible oil from a VIS-NIR diode-array spectrometer." },
          { img: "F14", cap: "Calibration: NIR prediction against the reference iodine value." },
          { img: "F13", cap: "Iodine values of the calibration samples." },
        ],
        measured: ["Iodine value"],
        related: ["excalibur-hy", "principle:transmission"],
      },
      dairy: {
        title: "Milk: from intake to recombination", short: "Fat, protein, water and lactose, measured with a 3-A probe.",
        fields: ["dairy", "food"], technique: "nirmir", img: "S09",
        lead: "Raw milk changes with season, region and even from cow to cow. Dairies check it at delivery, separate it into cream and skim milk, and recombine the two to the exact fat content each product needs.",
        blocks: [
          { h: "Hygiene first", t: "In the US, milk processing must meet the 3-A sanitary standards, and Europe's EHEDG guidelines build on them. Instruments in contact with the product must rule out contamination and cross-contamination, and costly ingredients like fat and protein should be dosed precisely." },
          { h: "The solution", t: "Excalibur HY 25 (3-A) hygienic immersion probes coupled to an FT-NIR spectrometer report fat, protein, water and lactose from several key positions to the process control system at short intervals. Deviations are corrected within minutes instead of waiting for the lab." },
          { h: "Why this probe", t: "It can touch the product directly, is 3-A certified, and cleans and sterilizes in place (CIP and SIP) without stopping production. Its precise path length makes results reproducible and methods easy to transfer between probes and measuring points." },
          { h: "Beyond dairy", t: "The same setup measures unsaturated fatty acids, sugar in juices, and vitamins or concentrates in other food and pharmaceutical processes." },
        ],
        figs: [{ img: "F17", cap: "Hygienic probe in a dairy line." }],
        measured: ["Fat", "Protein", "Water", "Lactose"],
        related: ["excalibur-hy", "principle:transmission"],
      },
      "fruit-yogurt": {
        title: "Fruit content at Schwarzwaldmilch", short: "An inline model checks the yogurt-to-fruit ratio before filling.",
        fields: ["dairy", "food"], technique: null, img: "S10", isCase: true, customer: "Schwarzwaldmilch",
        lead: "The Freiburg dairy Schwarzwaldmilch checks every fruit yogurt again after the fruit preparation is added and before filling. The ratio of yogurt to fruit sets the taste, the declared minimum fruit content and the ingredient cost.",
        blocks: [
          { h: "Why it varies", t: "Fruit sugar changes with variety and ripeness, and fruit preparations change in storage. Container changes and pump stops and restarts shift the mixing ratio." },
          { h: "The old way", t: "Random samples were checked in the lab through the Brix value (refractive index). That is slow, and as a measure of fruit content it is unreliable, which can mean waste." },
          { h: "Building the model", t: "Hellma Solutions measured product samples in the Hellma application lab over a longer period and built calibration models for the different fruit yogurts. The models were then run on a spectrometer and brought into the process in several steps." },
          { h: "Measured inline", t: "Because of yogurt's optical properties, a reflectance measurement fits best. A Gladius XP reflection probe, hygienic enough for food production, measures the yogurt in the line. Updating the model over time follows the process in ever more detail." },
        ],
        figs: [
          { img: "F18", cap: "Fruit content over time: the start of production, a system stop and a container change show up at once." },
          { img: "F19", cap: "The installation at Schwarzwaldmilch." },
          { img: "F20", cap: "From lab analysis to calibration model to process control." },
        ],
        measured: ["Yogurt-to-fruit ratio"],
        related: ["gladius-xp", "principle:reflection", "solutions"],
      },
      whiskey: {
        title: "Whiskey maturing in the barrel", short: "Measure what the wood adds, right in the barrel.",
        fields: ["beverages"], technique: "uvvis",
        lead: "Wood dissolving into the spirit adds impurities that show up in the UV-Vis signal.",
        blocks: [{ h: "Measured in place", t: "The concentration of those impurities can be measured directly in the barrel." }],
        measured: ["Impurities from dissolved wood"],
        related: ["principle:transmission", "principle:transflection"],
      },
      "fruit-sorting": {
        title: "Fruit sorting", short: "Light scattered off the fruit reveals what the eye can't see.",
        fields: ["food", "agriculture"], technique: "uvvis",
        lead: "Light scattered off the fruit tells a sorter about its inside as well as its surface.",
        blocks: [{ h: "One scan, five answers", t: "The scattered light determines sugar content, bruising, dryness, acidity and blight." }],
        measured: ["Sugar", "Bruising", "Dryness", "Acidity", "Blight"],
        related: ["gladius-fdr", "principle:reflection"],
      },
      "agriculture-dairy": {
        title: "Agriculture and dairy", short: "Moisture, protein, starch, ash, fats and sugars.",
        fields: ["agriculture", "food", "dairy"], technique: "nirmir",
        lead: "NIR measures the composition of crops and dairy products quickly, without chemicals.",
        blocks: [
          { h: "Precision farming", t: "Moisture, protein, starch and ash." },
          { h: "Dairy", t: "Fats and sugars." },
        ],
        measured: ["Moisture", "Protein", "Starch", "Ash", "Fats", "Sugars"],
        related: ["gladius-fdr", "excalibur-hy"],
      },
      water: {
        title: "Water and wastewater monitoring", short: "Nitrates, sulfates, H₂S and impurities.",
        fields: ["water"], technique: "uvvis", techniques: ["uvvis", "fluorescence"],
        lead: "UV-Vis watches dissolved nitrates, sulfates and H₂S. Fluorescence picks up impurities in wastewater.",
        blocks: [],
        measured: ["Nitrates", "Sulfates", "H₂S", "Impurities (fluorescence)"],
        related: ["excalibur-xp", "excalibur-fcp", "espada", "principle:transmission", "principle:fluorescence"],
      },
    },
  },

  /* ---------- About ---------- */
  about: {
    promise: "Hellma enables you to perform molecular spectroscopy in the laboratory and in the process, efficiently and at the highest level.",
    group: [
      { n: "1922", l: "Founded" },
      { n: "500", l: "Employees" },
      { n: "5", l: "Production sites" },
      { n: "8", l: "Sales subsidiaries" },
      { n: "3rd", l: "Generation family ownership" },
    ],
    sites: [
      { place: "Müllheim, Germany", co: "Hellma GmbH & Co. KG", area: "Analytics and Solutions" },
      { place: "Jena & Eisenach, Germany", co: "Hellma Materials GmbH", area: "Photonics" },
      { place: "Trollhättan, Sweden", co: "Hellma Materials Sweden AB", area: "Photonics" },
      { place: "New Iberia, Louisiana, USA", co: "CVD Ceramics Inc.", area: "Photonics" },
    ],
    subsidiaries: ["Germany", "Benelux", "France", "Italy", "Switzerland", "UK", "Asia", "USA / Canada"],
    chain: [
      { name: "Raw materials", img: "C2" },
      { name: "Components", img: "C3" },
      { name: "Laboratory & process spectroscopy", img: "C4" },
      { name: "Spectroscopy solutions", img: "P13" },
    ],
  },

  /* ---------- Localization ----------
   * Defaults for the subsidiary running the kiosk. Staff can override every value on the iPad
   * (staff panel > Localization); overrides are saved on that device only.
   * {territory} in any text below is replaced with the subsidiary name.
   */
  locale: {
    territory: "Hellma USA",
    founded: "1963",
    office: "Plainview, NY",
  },

  contact: {
    name: "Stacey Carrier",
    role: "Technical Sales Manager",
    phone: "(516) 274-8918",
    email: "stacey.carrier@hellma.com",
    web: "www.hellma.com",
  },

  /* ---------- Lead form ---------- */
  leadForm: {
    title: "Request information",
    sub: "Leave your details and our team will follow up after the show.",
    interests: [
      { id: "excalibur", label: "Excalibur transmission probes & flow cells" },
      { id: "falcata", label: "Falcata transflection probes" },
      { id: "katana", label: "Katana ATR probes" },
      { id: "gladius", label: "Gladius reflection probes" },
      { id: "polymer", label: "Polymer extruder probes" },
      { id: "espada", label: "Espada fluorescence probes" },
      { id: "tidus", label: "Tidus Raman probes" },
      { id: "retractables", label: "Retractable housings" },
      { id: "multiplexers", label: "Multiplexers" },
      { id: "sensors", label: "Spectroscopy sensors (NIR, MIR)" },
      { id: "custom", label: "Custom solution development" },
      { id: "services", label: "PAT consulting, feasibility & chemometrics" },
      { id: "applications", label: "Help with an application" },
    ],
    requests: ["Datasheet", "Quotation", "Call from a specialist", "Feasibility study", "Visit or demo"],
    consent: "{territory} may contact me about this request.",
    privacy: "Your details are stored on this device only until our team collects them after the show.",
  },
};
