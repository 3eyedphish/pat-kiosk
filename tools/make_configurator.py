#!/usr/bin/env python3
"""Build src/configurator.js from Hellma's FOS_Configurations.xlsx.

    python3 tools/make_configurator.py path/to/FOS_Configurations.xlsx

What it takes from the workbook
- Models: only those marked green on the "Übersicht" sheet (configurator-ready) AND listed in MODELS below.
- Options per model from the sheets "P Process Probes", "C Cells" and "F Flange Cells" (see fos_extract.py for the
  marking rules: S/V count, '-', '?' and 'E' do not, orange/red cells do not).
- Each model's base configuration (column K of "Übersicht") is the starting point and its options are always offered.
- Temperature, pressure and ATEX limits per option.
Never taken: prices, internal comments, delivery times.

Visitor-facing wording lives in LABELS (plain US English). An option without a label uses the workbook text.
Combination rules from the workbook's restriction column are written out by hand in RULES."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fos_extract import extract

# Workbook model column -> kiosk model. img = asset ID, product = kiosk product page, sub = one-line description
MODELS = {
    "probe": [
        ("A", "Excalibur XP 12", "excalibur", "transmission", "P1", "excalibur-xp", "12 mm (1/2 in) diameter"),
        ("B", "Excalibur XP 20", "excalibur", "transmission", "P1", "excalibur-xp", "20 mm (3/4 in) diameter"),
        ("C", "Excalibur XP 25", "excalibur", "transmission", "P1", "excalibur-xp", "25 mm (1 in) diameter"),
        ("E", "Excalibur HY 25", "excalibur", "transmission", "P18", "excalibur-hy", "Hygienic, 3-A certified, 25 mm diameter"),
        ("F", "Excalibur HD FPT 25", "excalibur", "transmission", "P2", "excalibur-hd", "Heavy duty, welded metal seals, 25 mm diameter"),
        ("G", "Excalibur HD FPT 26", "excalibur", "transmission", "P2", "excalibur-hd", "Heavy duty, welded metal seals, 1.02 in (26 mm) diameter"),
        ("Q", "Falcata XP 6", "falcata", "transflection", "P6", "falcata-xp", "6 mm (1/4 in) diameter"),
        ("R", "Falcata XP 12", "falcata", "transflection", "P6", "falcata-xp", "12 mm (1/2 in) diameter"),
        ("AC", "Katana XP 6", "katana", "atr", "P7", "katana-xp", "6 mm (1/4 in) diameter"),
        ("AD", "Katana XP 12", "katana", "atr", "P7", "katana-xp", "12 mm (1/2 in) diameter"),
        ("U", "Gladius XP 12", "gladius", "reflection", "P9", "gladius-xp", "12 mm (1/2 in) diameter"),
        ("W", "Gladius XP 25", "gladius", "reflection", "P9", "gladius-xp", "25 mm (1 in) diameter"),
        ("AA", "Gladius HD Beam FDR", "gladius", "reflection", "P8", "gladius-fdr", "Contact-free diffuse reflection, 30 mm (1.25 in) diameter"),
    ],
    "cell": [
        ("A", "Excalibur HD FCP", "excalibur", "transmission", "P3", "excalibur-fcp", "Inline flow cell, welded metal seals"),
        ("D", "Excalibur HD FET", "excalibur", "transmission", "P4", "excalibur-fet", "Compact block flow cell, welded metal seals"),
        ("G", "Excalibur FFV", "excalibur", "transmission", "P5", "excalibur-ffv", "Flow cell with fixed or variable path length"),
    ],
    "flange": [
        ("A", "Excalibur HD Flange", "excalibur", "transmission", "svg:transmission", None, "Flow cell that mounts between two pipe flanges"),
    ],
}
WB_NAME = {"Excalibur HY 25": "Excalibur HY 25 (Hygienic 3-A)", "Gladius HD Beam FDR": "Gladius Beam FDR", "Excalibur HD FCP": "Excalibur HD FCP Cell",
           "Excalibur HD FET": "Excalibur HD FET Cell", "Excalibur FFV": "Excalibur Lab FFV Cell"}

# Option groups shown, in order: (sheet kind, code position, code length, key, title)
GROUPS = {
    "probe": [(8, 1, "range", "Spectral range"), (4, 1, "path", "Path length"), (5, 1, "window", "Window material"), (6, 1, "body", "Body material"),
              (7, 1, "seal", "Window seal"), (10, 1, "process", "Process connection"), (12, 1, "pressure", "Pressure rating"),
              (13, 3, "depth", "Immersion depth"), (9, 1, "optic", "Optical connection"), (11, 1, "fiber", "Fiber or light guide"), (16, 1, "extra", "Additional functions")],
    "cell": [(9, 1, "range", "Spectral range"), (10, 3, "path", "Path length"), (4, 1, "cellbody", "Cell body"), (7, 1, "body", "Body material"),
             (8, 1, "window", "Window material"), (5, 1, "seal", "Window seal"), (6, 1, "seal2", "Cell-to-optics seal"), (3, 1, "optics", "Optics"),
             (14, 1, "process", "Process connection"), (15, 1, "pressure", "Pressure rating"), (13, 1, "optic", "Optical connection"),
             (16, 1, "base", "Mounting"), (17, 1, "extra", "Additional functions")],
    "flange": [(8, 1, "range", "Spectral range"), (4, 1, "path", "Path length"), (10, 1, "process", "Fits pipe flange"), (11, 3, "bore", "Inner diameter"),
               (15, 1, "pressure", "Pressure rating"), (5, 1, "window", "Window material"), (6, 1, "body", "Body material"), (7, 1, "seal", "Window seal"),
               (3, 1, "flangebody", "Cell body"), (9, 1, "optic", "Optical connection"), (14, 1, "fiber", "Fiber or light guide"), (16, 1, "purge", "Purging"),
               (17, 1, "extra", "Additional functions")],
}
# Display order above; the code position (first number) places each choice in the configuration code.
AUTO = {("flange", 11)}  # set by another choice; shown in the summary, not as a step

# Options left out on purpose: (kind, pos, code): reason
SKIP = {
    ("probe", 12, "E"): "300 bar: the kiosk rates welded metal seals 250 bar* (confirmed decision)",
    ("cell", 4, "X"): "single finger without body is a spare part",
    ("cell", 5, "0"): "cell body only is a spare part", ("cell", 8, "0"): "spare part", ("cell", 9, "0"): "spare part",
    ("cell", 10, "000"): "single finger only", ("cell", 13, "Z"): "cell body only", ("cell", 14, "A"): "single finger only",
    ("cell", 17, "C"): "workbook: only with cell body A, which the FFV does not offer",
    ("flange", 11, "063"): "ASME 2.5 in flange is not offered for this cell",
}

L = {}
def lab(kind, pos, code, label, detail=None):
    L[(kind, pos, code)] = (label, detail)

for k in ("probe", "flange"):
    for c, v in [("K", "Contact"), ("G", "0.5 mm"), ("A", "1 mm"), ("B", "2 mm"), ("H", "3 mm"), ("I", "4 mm"), ("C", "5 mm"), ("D", "10 mm"), ("E", "20 mm"), ("V", "Variable")]:
        lab(k, 4, c, v)
lab("probe", 4, "F", "Set of path length tips", "1, 2, 5, 10 and 20 mm · O-ring sealed probes only")
for k, p in (("probe", 5), ("flange", 5), ("cell", 8)):
    lab(k, p, "Q", "Quartz glass"); lab(k, p, "S", "Sapphire"); lab(k, p, "F", "SF-5 glass")
for k, p in (("probe", 6), ("flange", 6), ("cell", 7)):
    lab(k, p, "E", "Stainless steel 1.4571 (316Ti)"); lab(k, p, "S", "Stainless steel 1.4435/1.4404 (316L)")
    lab(k, p, "P", "Stainless steel 316L, electropolished"); lab(k, p, "H", "Hastelloy C-22 (2.4602)")
    lab(k, p, "D", "Hastelloy C-276 (2.4819)"); lab(k, p, "T", "Titanium Grade 2"); lab(k, p, "A", "Aluminum")
lab("probe", 7, "E", "EPDM O-ring"); lab("probe", 7, "X", "Kalrez 4079 O-ring")
lab("probe", 7, "K", "Kalrez 6221 O-ring", "FDA, 3-A, USP, JP"); lab("probe", 7, "W", "Kalrez 6230 O-ring", "FDA, 3-A, USP")
lab("probe", 7, "Z", "Kalrez 6375 O-ring"); lab("probe", 7, "Q", "Kalrez 6380 O-ring"); lab("probe", 7, "Y", "Kalrez 7075 O-ring", "Not autoclavable")
lab("probe", 7, "B", "Brazed (Ag, Cu, Ti)", "Titanium body and sapphire window · Vacuum-rated")
lab("probe", 7, "A", "Soft soldered (Au, Sn)", "Vacuum-rated")
for k, p in (("probe", 7), ("cell", 5), ("flange", 7)):
    lab(k, p, "G", "Welded metal seal, gold-coated C-ring", "Vacuum-rated")
lab("probe", 7, "F", "Welded metal seal, PTFE-coated C-ring", "Vacuum-rated"); lab("probe", 7, "H", "Welded metal seal, platinum-coated C-ring", "Vacuum-rated")
lab("probe", 7, "I", "Epoxy glued")
lab("cell", 5, "Z", "Kalrez 6375"); lab("cell", 6, "Z", "Kalrez 6375"); lab("cell", 6, "T", "Welded"); lab("cell", 6, "S", "Swagelok fitting")
for k, p in (("probe", 8), ("cell", 9), ("flange", 8)):
    lab(k, p, "N", "NIR"); lab(k, p, "V", "VIS"); lab(k, p, "U", "UV-Vis"); lab(k, p, "D", "UV")
lab("flange", 8, "U", "UV-Vis, low solarization")
for c, rng, f in [("H", "NIR", "7×200 µm / 1×600 µm"), ("J", "NIR", "7×400 µm / 1×600 µm"), ("K", "NIR", "7×600 µm / 7×600 µm"),
                  ("M", "UV-Vis", "7×200 µm / 1×600 µm"), ("O", "UV-Vis", "7×400 µm / 1×600 µm"), ("P", "UV-Vis", "7×600 µm / 7×600 µm")]:
    lab("probe", 8, c, rng + ", " + f + " fibers", "NA 0.22")
lab("probe", 8, "R", "NIR, bundle of 78 fibers")
lab("probe", 9, "G", "2 m fiber cable, stainless steel sleeve, F-SMA plug")
lab("probe", 9, "A", "F-SMA sockets, ATEX PMA housing (NW 23)")
lab("probe", 9, "E", "2 m fiber cables, PE coated, 2 F-SMA plugs, PMA housing (NW 23)")
lab("probe", 9, "B", "2 m fiber cables, stainless steel sleeve, 2 F-SMA plugs, ATEX PMA housing (NW 23)")
lab("probe", 9, "P", "2 m fiber cables, stainless steel sleeve, 2 FC/PC plugs, ATEX PMA housing (NW 23)")
lab("probe", 9, "H", "F-SMA sockets, hygienic connector for 1 in hose")
lab("probe", 9, "C", "F-SMA sockets, NEMA 4 conduit housing (3/4 in NPT female)")
lab("probe", 9, "O", "FC/PC sockets, NEMA 4 conduit housing (3/4 in NPT female)")
lab("probe", 9, "N", "FC/PC sockets, 4-port NEMA 4 conduit housing (3/4 in NPT female)")
lab("probe", 9, "I", "F-SMA sockets, 1 in NPT male thread")
lab("probe", 9, "D", "FC/PC sockets, 1 in NPT male thread")
lab("probe", 9, "F", "FC/PC sockets, ATEX PMA housing (NW 23)")
lab("probe", 10, "A", "No flange")
for c, v in [("B", "DN 25 PN 40"), ("L", "DN 40 PN 40"), ("G", "DN 50 PN 16"), ("C", "DN 50 PN 40"), ("P", "DN 80 PN 16"), ("D", "DN 80 PN 40")]:
    lab("probe", 10, c, "EN 1092-1 flange " + v)
for c, v in [("E", "NPS 1 Class 150"), ("F", "NPS 1.5 Class 150"), ("H", "NPS 2 Class 150"), ("M", "NPS 1 Class 300"), ("N", "NPS 1.5 Class 300"), ("O", "NPS 2 Class 300")]:
    lab("probe", 10, c, "ASME B16.5 flange " + v + " RF")
lab("probe", 10, "I", "JIS B 2220 flange 10K 20A"); lab("probe", 10, "J", "GOST 12815-80 flange DN 25, 4 MPa")
lab("probe", 10, "K", "Ingold fitting"); lab("probe", 10, "Q", "PG 13.5 thread"); lab("probe", 10, "V", "Varivent type N")
lab("probe", 10, "T", "Clamp fitting DIN 32676, DN 50 (2 in)")
lab("probe", 10, "Y", "Flange to your specification", "Up to 200 mm diameter and 24 mm thick")
lab("probe", 10, "Z", "Your own blind flange, with material certificate", "Up to 200 mm diameter and 24 mm thick")
for k, p in (("probe", 11), ("flange", 14)):
    lab(k, p, "S", "Standard glass fiber"); lab(k, p, "H", "High-temperature glass fiber"); lab(k, p, "L", "Light guide")
PRESS = {
    "A": ("Up to 10 bar", "200 °C: 7.5 bar · 300 °C: 6.5 bar"),
    "M": ("Up to 16 bar", "Class 150 · 200 °C: 11 bar · 300 °C: 10 bar · 400 °C: 6.5 bar"),
    "N": ("Up to 20 bar", None),
    "P": ("Up to 30 bar", None),
    "L": ("Up to 40 bar", "Class 300 · 200 °C: 31 bar · 300 °C: 27 bar · 400 °C: 25 bar"),
    "H": ("Up to 100 bar", "200 °C: 79 bar · 300 °C: 69 bar"),
    "K": ("Up to 160 bar", "200 °C: 125 bar · 300 °C: 105 bar"),
    "I": ("Up to 200 bar", "Class 1500 · 100 °C: 195 bar · 200 °C: 165 bar · 300 °C: 150 bar · 400 °C: 140 bar"),
    "D": ("Up to 250 bar*", "200 °C: 195 bar · 300 °C: 160 bar · 400 °C: 140 bar"),
    "Z": ("Atmospheric pressure", None),
}
for c, (a, b) in PRESS.items():
    lab("probe", 12, c, a, b); lab("cell", 15, c, a, b)
lab("flange", 15, "M", "Up to 16 bar", "Class 150 · 200 °C: 11 bar · 300 °C: 10 bar · 400 °C: 6.5 bar")
lab("flange", 15, "L", "Up to 40 bar", "Class 300 · 200 °C: 29.2 bar · 300 °C: 26.1 bar · 400 °C: 24.2 bar")
lab("probe", 16, "N", "None"); lab("probe", 16, "Y", "Internal purging of the probe body")
lab("probe", 16, "I", "Internal purging, delivered filled with nitrogen")
lab("probe", 16, "G", "Filled with inert gas (N2, 4 bar)")
lab("probe", 16, "F", "External flushing of the measuring area"); lab("probe", 16, "B", "Internal purging and external flushing")
lab("probe", 16, "H", "Internal purging and steam jacket"); lab("probe", 16, "D", "Steam jacket")
lab("cell", 3, "W", "Optics built into the cell body"); lab("cell", 3, "C", "Collimator fingers with windows")
lab("cell", 4, "A", "Block with built-in windows, welded process connections"); lab("cell", 4, "C", "Welded process connections")
lab("cell", 4, "D", "Screwed-in process connections"); lab("cell", 4, "S", "Swagelok cross, 3/4 in"); lab("cell", 4, "T", "Two Swagelok tees, 3/4 in")
for c, v in [("U50", "0.5 mm"), ("001", "1 mm"), ("002", "2 mm"), ("003", "3 mm"), ("004", "4 mm"), ("005", "5 mm"), ("008", "8 mm"), ("010", "10 mm"), ("012", "12 mm"),
             ("M01", "100 mm"), ("M02", "200 mm"), ("M05", "500 mm"), ("M10", "1000 mm"), ("M15", "1500 mm"), ("M20", "2000 mm")]:
    lab("cell", 10, c, v)
lab("cell", 10, "V00", "Variable", "Preset to 5 ± 0.05 mm")
lab("cell", 13, "C", "F-SMA sockets, conduit connection (3/4 in NPT male)"); lab("cell", 13, "P", "FC/PC sockets, conduit connection (3/4 in NPT male)")
lab("cell", 13, "N", "F-SMA sockets, conduit connection (1 in NPT male)"); lab("cell", 13, "D", "FC/PC sockets, conduit connection (1 in NPT male)")
for c, v in [("D", "1/4 in"), ("O", "3/8 in"), ("F", "1/2 in"), ("G", "3/4 in")]:
    lab("cell", 14, c, v + " Swagelok")
lab("cell", 16, "X", "No base"); lab("cell", 16, "A", "Base plate")
lab("cell", 17, "N", "None"); lab("cell", 17, "G", "Filled with inert gas (N2)")
lab("cell", 17, "S", "Prepared for a cartridge heater and thermocouple", "Heater and thermocouple ordered separately")
lab("flange", 3, "B", "45 mm flange body with cooling fins")
lab("flange", 9, "I", "F-SMA sockets, ATEX PMA housing (NW 17)")
lab("flange", 9, "K", "2 m fiber cable, stainless steel sleeve, F-SMA plug, ATEX PMA housing (NW 17)")
for c, v in [("L", "EN 1092-1 DN 40 PN 40"), ("C", "EN 1092-1 DN 50 PN 40"), ("D", "EN 1092-1 DN 80 PN 40"), ("F", "ASME B16.5 NPS 1.5 Class 150"),
             ("N", "ASME B16.5 NPS 1.5 Class 300"), ("H", "ASME B16.5 NPS 2 Class 150"), ("O", "ASME B16.5 NPS 2 Class 300")]:
    lab("flange", 10, c, v)
for c, v in [("041", "40.9 mm"), ("050", "49.5 mm"), ("053", "52.5 mm"), ("062", "61.5 mm"), ("094", "94.0 mm")]:
    lab("flange", 11, c, v)
lab("flange", 16, "N", "None"); lab("flange", 17, "N", "None")

# Combination rules, from the workbook's restriction notes. if (pos in codes) then need (pos in codes). m = only for these models.
def R(kind, ifp, ifc, needp, needc, models=None):
    return dict(kind=kind, i=[ifp, list(ifc)], n=[needp, list(needc)], m=models)
ORING = ["E", "X", "K", "W", "Z", "Q", "Y"]
RULES = [
    R("probe", 7, "B", 5, "S"),                      # brazed: sapphire only
    R("probe", 7, "B", 6, "T"),                      # brazed: titanium body
    R("probe", 6, "T", 7, "B"),                      # titanium: brazed only
    R("probe", 4, "F", 7, ORING),                    # tip set: O-ring sealed only
    R("probe", 5, "Q", 7, ORING + ["G", "F", "H", "I"]),  # quartz: not brazed or soldered
    R("probe", 11, "H", 7, "B", ["falcata-xp-6", "falcata-xp-12"]),   # Falcata high-temperature fiber: brazed only
    R("probe", 9, "A", 8, "HJGMOT", ["gladius-xp-12", "gladius-xp-25"]),
    R("probe", 12, "H", 7, "AB", ["gladius-xp-12", "gladius-xp-25"]),
    R("cell", 4, "C", 10, ["005", "010"]),
    R("cell", 4, "S", 10, ["002"]),
    R("cell", 4, "T", 10, ["M01", "M02", "M05", "M10", "M15", "M20"]),
    R("flange", 10, "L", 11, ["050"]), R("flange", 10, "C", 11, ["062"]), R("flange", 10, "D", 11, ["094"]),
    R("flange", 10, "FN", 11, ["041"]), R("flange", 10, "HO", 11, ["053"]),
]

def clean(s):
    return re.sub(r"\s+", " ", s.replace(" ", " ")).strip()

def main(path, out):
    over, data = extract(path)
    models, groups, rules = [], {}, []
    for kind, lst in MODELS.items():
        sheet = data[kind]
        col_of = {name: col for col, name in sheet["models"].items()}
        for col, name, fam, pr, img, prod, sub in lst:
            ov = over[WB_NAME.get(name, name)]
            models.append(dict(id=re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-"), kind="probe" if kind == "probe" else "cell", sheet=kind, col=col, name=name, family=fam, principle=pr,
                               img=img, product=prod, sub=sub, base=ov["base"], t=[ov["tmin"], ov["tmax"]], p=[ov["pmin"], ov["pmax"]], atex=ov["atex"]))
        glist = []
        for pos, ln, key, title in GROUPS[kind]:
            g = dict(pos=pos, len=ln, key=key, title=title, options=[])
            if (kind, pos) in AUTO: g["auto"] = True
            if key == "depth":
                g["depth"] = True
                for d in sheet["depth"]:
                    ms = [n for c, n in sheet["models"].items() if c in d["marks"]]
                    mine = [m["id"] for m in models if m["sheet"] == kind and m["col"] in d["marks"]]
                    if not mine or d["row"] == 219: continue  # row 219: label says with flange, rule says no flange
                    txt = d["en"]
                    nums = [int(x) for x in re.findall(r"(\d+) mm", txt)]
                    lo, hi = (nums[0], nums[1]) if "to" in txt else (nums[0], nums[0])
                    flange = True if "with flange" in txt else False if "no flange" in txt else None
                    o = dict(c="d%d" % d["row"], min=lo, max=hi, flange=flange, m=mine)
                    if "+ optical path" in txt: o["plusPath"] = True
                    g["options"].append(o)
            else:
                for o in sheet["groups"].get(pos, []):
                    if (kind, pos, o["code"]) in SKIP: continue
                    mine = [m["id"] for m in models if m["sheet"] == kind and m["col"] in o["marks"]]
                    for m in models:  # the base configuration is always offered
                        if m["sheet"] == kind and m["base"][pos - 1:pos - 1 + ln] == o["code"] and m["id"] not in mine:
                            mine.append(m["id"])
                    if not mine: continue
                    label, detail = L.get((kind, pos, o["code"]), (clean(o["en"]), None))
                    opt = dict(c=o["code"], l=label)
                    if detail: opt["d"] = detail
                    pmax = o["pmax"]
                    if key == "pressure" and pmax is None:
                        mm = re.search(r"(\d+) bar", label); pmax = int(mm.group(1)) if mm else None
                    if key == "pressure" and o["code"] == "Z": pmax = 0
                    lim = {}
                    if o["tmin"] is not None: lim["t0"] = o["tmin"]
                    if o["tmax"] is not None: lim["t1"] = o["tmax"]
                    if o["pmin"] is not None: lim["p0"] = o["pmin"]
                    if pmax is not None: lim["p1"] = pmax
                    if lim: opt["lim"] = lim
                    if o["atex"] is not None and int(o["atex"]) in (2, 9): opt["atex"] = int(o["atex"])
                    opt["m"] = mine
                    if key == "pressure" and o["code"] == "D" and kind == "probe": opt["foot"] = "weld"
                    g["options"].append(opt)
            if g["options"]: glist.append(g)
        groups[kind] = glist
    for r in RULES:
        rules.append({k: v for k, v in dict(sheet=r["kind"], i=r["i"], n=r["n"], m=r["m"]).items() if v is not None})
    # Depth vs. flange: ranges "no flange" need process connection A, "with flange" need anything else
    for g in groups["probe"]:
        if g.get("depth"):
            proc = [x for x in groups["probe"] if x["key"] == "process"][0]
            others = [o["c"] for o in proc["options"] if o["c"] != "A"]
            nf = [o["c"] for o in g["options"] if o["flange"] is False]
            wf = [o["c"] for o in g["options"] if o["flange"] is True]
            rules.append(dict(sheet="probe", i=[13, nf], n=[10, ["A"]]))
            rules.append(dict(sheet="probe", i=[13, wf], n=[10, others]))
    # Pressure rating vs. process connection: a flange rated below the chosen pressure does not fit
    for kind, ppos, cpos in (("probe", 12, 10), ("flange", 15, 10)):
        gp = [g for g in groups[kind] if g["pos"] == ppos][0]; gc = [g for g in groups[kind] if g["pos"] == cpos][0]
        for o in gp["options"]:
            P = (o.get("lim") or {}).get("p1")
            if not P: continue
            # "no flange" always fits; a customer flange (no rating in the workbook) only up to the standard 40 bar
            ok = [c["c"] for c in gc["options"] if c["c"] == "A" and kind == "probe" or
                  ((c.get("lim") or {}).get("p1") is None and P <= 40) or (c.get("lim") or {}).get("p1", -1) >= P - 0.5]
            if len(ok) < len(gc["options"]):
                rules.append(dict(sheet=kind, i=[ppos, [o["c"]]], n=[cpos, ok]))
    # Check: every base code must be buildable from the offered options
    for m in models:
        for g in groups[m["sheet"]]:
            if g.get("depth"): continue
            code = m["base"][g["pos"] - 1:g["pos"] - 1 + g["len"]]
            if not any(o["c"] == code and m["id"] in o["m"] for o in g["options"]):
                print("WARNING base code of %s: %s not offered in %s" % (m["name"], code, g["title"]))
    js = ("/* Probe and flow cell configurator data. GENERATED by tools/make_configurator.py from Hellma's\n"
          " * FOS_Configurations.xlsx; do not edit by hand. Re-run the script when the workbook changes. No prices. */\n"
          "window.KIOSK_CONFIG = " + json.dumps(dict(source=os.path.basename(path), models=models, groups=groups, rules=rules), ensure_ascii=False, separators=(",", ":")) + ";\n")
    open(out, "w", encoding="utf-8").write(js)
    print("wrote %s: %d models, %d option groups, %d rules, %.0f KB" % (out, len(models), sum(len(v) for v in groups.values()), len(rules), len(js) / 1024))

if __name__ == "__main__":
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    main(sys.argv[1], os.path.join(here, "src", "configurator.js"))
