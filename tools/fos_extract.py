"""Read FOS_Configurations.xlsx (Hellma configuration master) and return the configurator-ready models and options.
Only models marked green (configurator-ready) are read. An option counts for a model when its cell is marked
(S = standard, V = variant, or a model code) and is not '-', '?' or 'E' and not coloured orange/red
('can be built but not in the configurator' / 'cannot be built')."""
import openpyxl, warnings, re
warnings.filterwarnings("ignore")

GREEN, ORANGE, RED = "C6EFCE", "FFEB9C", "FFC7CE"

def fill(c):
    f = c.fill
    if f is None or f.fill_type is None: return ""
    col = f.fgColor
    return col.rgb[-6:] if col.type == "rgb" else ""

def num(v):
    if v is None or v == "": return None
    if isinstance(v, (int, float)): return v
    m = re.match(r"\s*(-?\d+(?:[.,]\d+)?)", str(v))
    return float(m.group(1).replace(",", ".")) if m else None

def ok_mark(mk):
    """S = standard, V = variant, W/WS as marked in the workbook, or another model's code (E2, F2, K2 ...) = offered.
    Anything else ('-', '?', 'E', 'EH', notes) = not offered in the configurator."""
    return mk in ("S", "V", "W", "WS") or re.fullmatch(r"[A-Z]\d", mk) is not None

SHEETS = {
    "probe": dict(sheet="P Process Probes", models=["A","B","C","E","F","G","Q","R","U","W","AA","AC","AD"],
        pos=[("AK",4,1),("AL",5,1),("AM",6,1),("AN",7,1),("AO",8,1),("AP",9,1),("AQ",10,1),("AR",11,1),("AS",12,1),("AW",16,1)],
        depth=(196,222), en="BD", de="BF", t=("BG","BH"), p=("BI","BJ"), atex="BK", r0=39, r1=239),
    "cell": dict(sheet="C Cells", models=["A","D","G"],
        pos=[("O",3,1),("Q",4,1),("R",5,1),("S",6,1),("T",7,1),("U",8,1),("V",9,1),(("W","X","Y"),10,3),("AA",13,1),("AB",14,1),("AC",15,1),("AD",16,1),("AE",17,1)],
        en="AL", de="AN", t=("AO","AP"), p=("AQ","AR"), atex="AS", r0=24, r1=179),
    "flange": dict(sheet="F Flange Cells", models=["A"],
        pos=[("J",3,1),("K",4,1),("L",5,1),("M",6,1),("N",7,1),("O",8,1),("P",9,1),("Q",10,1),(("R","S","T"),11,3),("U",14,1),("V",15,1),("W",16,1),("X",17,1)],
        en="AE", de="AG", t=("AH","AI"), p=("AJ","AK"), atex="AL", r0=10, r1=122),
}

def extract(path):
    wb = openpyxl.load_workbook(path)
    ov = wb["Übersicht"]
    over = {}
    for r in range(3, 82):
        name = ov["I%d" % r].value
        if name and fill(ov["I%d" % r]) == GREEN:
            over[str(name).strip()] = dict(base=str(ov["K%d" % r].value or "").strip(), tmin=num(ov["AD%d" % r].value), tmax=num(ov["AE%d" % r].value),
                                           pmin=num(ov["AF%d" % r].value), pmax=num(ov["AG%d" % r].value), atex=ov["Y%d" % r].value)
    out = {}
    for kind, cfg in SHEETS.items():
        ws = wb[cfg["sheet"]]
        models = {}
        for m in cfg["models"]:
            models[m] = str(ws[m + "2"].value).strip()
        groups = {}
        for r in range(cfg["r0"], cfg["r1"] + 1):
            en = ws[cfg["en"] + str(r)].value
            if en is None: continue
            rowfill = fill(ws[cfg["en"] + str(r)])
            for col, pos, ln in cfg["pos"]:
                if isinstance(col, tuple):
                    vals = [ws[c + str(r)].value for c in col]
                    if any(v in (None, "") for v in vals): continue
                    code = "".join(str(v) for v in vals)
                else:
                    v = ws[col + str(r)].value
                    if v in (None, "") or str(v).startswith("="): continue
                    code = str(v).strip()
                if len(code) != ln: continue
                marks = {}
                for m in cfg["models"]:
                    c = ws[m + str(r)]
                    mk = str(c.value if c.value is not None else "").strip()
                    if not ok_mark(mk): continue
                    if fill(c) in (ORANGE, RED) or rowfill in (ORANGE, RED): continue
                    marks[m] = "S" if mk in ("S", "WS") else "V"
                # an unmarked option is still returned: a model's base configuration may use it
                groups.setdefault(pos, []).append(dict(row=r, code=code, en=str(en).strip(), de=str(ws[cfg["de"] + str(r)].value or "").strip(),
                    tmin=num(ws[cfg["t"][0] + str(r)].value), tmax=num(ws[cfg["t"][1] + str(r)].value),
                    pmin=num(ws[cfg["p"][0] + str(r)].value), pmax=num(ws[cfg["p"][1] + str(r)].value),
                    atex=num(ws[cfg["atex"] + str(r)].value), marks=marks))
                break
        depth = []
        if cfg.get("depth"):
            for r in range(cfg["depth"][0], cfg["depth"][1] + 1):
                en = ws[cfg["en"] + str(r)].value
                if en is None: continue
                marks = {}
                for m in cfg["models"]:
                    c = ws[m + str(r)]; mk = str(c.value if c.value is not None else "").strip()
                    if not ok_mark(mk) or fill(c) in (ORANGE, RED): continue
                    marks[m] = "S" if mk == "S" else "V"
                depth.append(dict(row=r, en=str(en).strip(), marks=marks, rule=str(ws["BV%d" % r].value or "").strip()))
        out[kind] = dict(models=models, groups=groups, depth=depth)
    return over, out

if __name__ == "__main__":
    import sys, json
    over, out = extract(sys.argv[1])
    print(json.dumps(over, indent=0, ensure_ascii=False)[:3000])
    for kind, d in out.items():
        print("#####", kind, d["models"])
        for pos, opts in sorted(d["groups"].items()):
            print("== pos", pos)
            for o in opts:
                if o["marks"]: print("  %s | %s | %s | T%s..%s p%s..%s atex%s | %s" % (o["code"], o["en"][:100], o["de"][:60], o["tmin"], o["tmax"], o["pmin"], o["pmax"], o["atex"], " ".join(k+":"+v for k,v in o["marks"].items())))
        for dd in d["depth"]:
            if dd["marks"]: print("  DEPTH r%d %s | %s | %s" % (dd["row"], dd["en"], dd["rule"], dd["marks"]))
