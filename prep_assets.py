"""One-time export of deck images into kiosk/src/assets, named by the image-request IDs.
Replace any file in src/assets with a better version (same ID, any of .jpg/.png/.webp/.svg) and rebuild."""
import os, shutil
from PIL import Image
M = "/home/claude/unz/ppt/media"
R = "/home/claude/render"
OUT = "/home/claude/kiosk/src/assets"
# id: (source, kind)  kind: cut = product on white, photo = full-bleed photo, line = drawing, logo, icon
MAP = {
 "P1": (f"{M}/image41.gif","cut"), "P2": (f"{M}/image49.png","cut"), "P3": (f"{M}/image143.png","cut"),
 "P4": (f"{M}/image53.png","cut"), "P5": (f"{M}/image55.png","cut"), "P6": (f"{M}/image59.png","cut"),
 "P7": (f"{M}/image62.png","cut"), "P8": (f"{M}/image65.png","cut"), "P9": (f"{M}/image67.jpeg","cut"),
 "P10": (f"{M}/image87.png","cut"), "P10b": (f"{M}/image88.png","cut"), "P11": (f"{M}/image89.png","cut"),
 "P12": (f"{M}/image82.jpeg","photo"), "P13": (f"{M}/image69.png","cut"), "P14": (f"{M}/image70.png","cut"),
 "P15": (f"{M}/image71.png","cut"), "P16": (f"{M}/image72.jpeg","cut"),
 "D2": (f"{M}/image48.png","line"), "D3": (f"{M}/image50.png","line"), "D4": (f"{M}/image52.png","line"),
 "D5": (f"{M}/image54.png","line"), "D6": (f"{M}/image56.png","line"), "D7": (f"{M}/image60.png","line"),
 "D8": (f"{M}/image63.png","line"), "D9": (f"{M}/image66.png","line"), "D10": (f"{R}/prm_schematic.png","line"),
 "S1": (f"{R}/seal_elastomer.png","line"), "S2": (f"{R}/seal_braze.png","line"),
 "S3": (f"{R}/seal_welded_exploded.png","line"), "S4": (f"{R}/seal_welded_section.png","line"),
 "K1": (f"{M}/image36.png","photo"), "K2": (f"{M}/image7.jpeg","photo"), "K2b": (f"{M}/image139.jpeg","photo"),
 "K3": (f"{M}/image74.jpeg","photo"),
 "A1": (f"{M}/image58.jpeg","photo"), "A2": (f"{M}/image40.jpeg","photo"), "A3": (f"{M}/image34.jpg","photo"),
 "A4": (f"{M}/image11.jpeg","photo"), "A5": (f"{M}/image75.png","photo"), "A6": (f"{M}/image76.jpeg","photo"),
 "A7": (f"{M}/image107.png","photo"), "A8": (f"{M}/image61.jpg","photo"), "A9": (f"{M}/image64.jpg","photo"),
 "R1": (f"{M}/image77.jpeg","photo"), "R2": (f"{M}/image108.png","cut"), "R3": (f"{M}/image109.png","cut"),
 "R4": (f"{M}/image110.png","cut"), "R5": (f"{M}/image111.png","cut"), "R6": (f"{M}/image112.png","line"),
 "R7": (f"{M}/image80.jpeg","cut"), "R8": (f"{M}/image81.jpeg","photo"), "R9": (f"{M}/image113.png","line"),
 "I1": (f"{M}/image91.jpeg","photo"), "I2": (f"{M}/image92.jpeg","photo"), "I3": (f"{M}/image93.jpeg","photo"),
 "I4": (f"{M}/image94.jpeg","photo"), "I5": (f"{M}/image95.jpg","photo"), "I6": (f"{M}/image96.jpg","photo"),
 "W1": (f"{M}/image98.png","photo"), "W2": (f"{M}/image99.png","photo"), "W3": (f"{M}/image100.jpeg","photo"),
 "W4": (f"{M}/image101.jpeg","photo"), "W5": (f"{M}/image103.png","photo"), "W6": (f"{M}/image104.png","photo"),
 "W7": (f"{M}/image105.png","photo"),
 "C1": (f"{M}/image12.png","photo"), "C2": (f"{M}/image26.jpeg","photo"), "C3": (f"{M}/image27.jpeg","photo"),
 "C4": (f"{M}/image28.jpeg","photo"),
 "L2": (f"{M}/image68.png","logo"), "L3": (f"{M}/image15.png","logo"), "L5": (f"{M}/image79.png","logo"),
 "L6": (f"{M}/image97.jpeg","logo"), "EX": (f"{M}/image138.png","logo"),
}
for k in os.listdir(OUT): os.remove(os.path.join(OUT,k))
total = 0
for id_, (src, kind) in MAP.items():
    im = Image.open(src)
    has_alpha = im.mode in ("RGBA","LA") or (im.mode == "P" and "transparency" in im.info)
    if kind == "photo":
        im = im.convert("RGB")
        if im.width > 2400: im = im.resize((2400, round(im.height*2400/im.width)), Image.LANCZOS)
        out = f"{OUT}/{id_}.jpg"; im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    elif kind == "cut":
        if has_alpha:
            im = im.convert("RGBA"); bg = Image.new("RGBA", im.size, (255,255,255,255)); bg.alpha_composite(im); im = bg
        im = im.convert("RGB")
        out = f"{OUT}/{id_}.jpg"; im.save(out, "JPEG", quality=88, optimize=True)
    elif kind == "line":
        if has_alpha:
            im = im.convert("RGBA"); bg = Image.new("RGBA", im.size, (255,255,255,255)); bg.alpha_composite(im); im = bg
        im = im.convert("RGB").quantize(colors=64, method=Image.Quantize.MEDIANCUT)
        out = f"{OUT}/{id_}.png"; im.save(out, "PNG", optimize=True)
    else:  # logo keep png
        out = f"{OUT}/{id_}.png"; im.convert("RGBA").save(out, "PNG", optimize=True)
    total += os.path.getsize(out)
shutil.copy("/home/claude/brand/e81306a4-Hellma_Logo.svg", f"{OUT}/L1.svg")
total += os.path.getsize(f"{OUT}/L1.svg")
print("files", len(os.listdir(OUT)), "total KB", total//1024)
for f in sorted(os.listdir(OUT), key=lambda f: -os.path.getsize(os.path.join(OUT,f)))[:8]:
    print(f, os.path.getsize(os.path.join(OUT,f))//1024)
