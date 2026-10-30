#!/usr/bin/env python3
"""Build the Hellma PAT kiosk.

  python3 build.py   writes three versions into dist/:
    web/                       Home Screen web app for the iPad: upload this folder to any https static host
                               (Netlify, GitHub Pages, Cloudflare Pages). Works offline after the first open.
    hellma-pat-kiosk-web.zip   the same folder, zipped
    hellma-pat-kiosk.html      one self-contained file (for kiosk browsers that load local files)
    artifact.html              the same app as a page fragment, for the online preview

Images: src/assets/<ID>.<jpg|png|webp|svg>. IDs match the image request list. If several files share an ID,
the most recently modified one wins, so you can drop in a replacement without deleting the old file.
"""
import base64, datetime, hashlib, json, os, re, shutil, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
DIST = os.path.join(ROOT, "dist")
MIME = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif"}
APP_NAME, SHORT_NAME = "Hellma Process Analytics", "Hellma PAT"


def read(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return f.read()


def pick_assets():
    best = {}
    for fn in os.listdir(os.path.join(SRC, "assets")):
        stem, ext = os.path.splitext(fn)
        if ext.lower() not in MIME:
            continue
        p = os.path.join(SRC, "assets", fn)
        if stem not in best or os.path.getmtime(p) > os.path.getmtime(best[stem]):
            best[stem] = p
    return best


def logo_svg(path):
    s = open(path, encoding="utf-8").read()
    s = re.sub(r"<\?xml[^>]*\?>", "", s)
    s = re.sub(r"<metadata.*?</metadata>", "", s, flags=re.S)
    return s.strip()


def safe_js(s):
    return s.replace("</script", "<\\/script")


def build():
    os.makedirs(DIST, exist_ok=True)
    assets = pick_assets()
    built = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    css, content, diagrams, app = read("styles.css"), read("content.js"), read("diagrams.js"), read("app.js")
    logo = logo_svg(assets["L1"])

    def page(asset_map, mode, extra_boot=None, extra_head=""):
        boot = {"KIOSK_ASSETS": asset_map, "KIOSK_LOGO_SVG": logo, "KIOSK_BUILT": built}
        boot.update(extra_boot or {})
        boot_js = "".join("window.%s=%s;\n" % (k, json.dumps(v).replace("</", "<\\/")) for k, v in boot.items())
        scripts = "".join("<script>\n" + safe_js(x) + "\n</script>\n" for x in (boot_js, content, diagrams, app))
        if mode == "fragment":
            return "<title>Hellma PAT Kiosk</title>\n<style>\n" + css + "\n</style>\n<div id=\"app\"></div>\n" + scripts
        head = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
                '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n'
                '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
                '<meta name="apple-mobile-web-app-title" content="' + SHORT_NAME + '">\n'
                '<meta name="apple-mobile-web-app-status-bar-style" content="default">\n<meta name="theme-color" content="#ffffff">\n'
                '<meta name="format-detection" content="telephone=no, email=no, address=no, date=no">\n' + extra_head +
                '<title>' + APP_NAME + '</title>\n<style>\n' + css + '\n</style>\n</head>\n<body>\n<div id="app"></div>\n')
        return head + scripts + "</body>\n</html>\n"

    # 1) Single self-contained file and the preview fragment
    inline = {}
    for k, p in assets.items():
        with open(p, "rb") as f:
            inline[k] = "data:" + MIME[os.path.splitext(p)[1].lower()] + ";base64," + base64.b64encode(f.read()).decode()
    full = page(inline, "full")
    open(os.path.join(DIST, "hellma-pat-kiosk.html"), "w", encoding="utf-8").write(full)
    open(os.path.join(DIST, "artifact.html"), "w", encoding="utf-8").write(page(inline, "fragment"))
    print("dist/hellma-pat-kiosk.html  %.1f MB" % (len(full) / 1e6))

    # 2) Home Screen web app folder
    web = os.path.join(DIST, "web")
    shutil.rmtree(web, ignore_errors=True)
    os.makedirs(os.path.join(web, "assets")); os.makedirs(os.path.join(web, "icons"))
    rel, files = {}, []
    for k, p in sorted(assets.items()):
        name = k + os.path.splitext(p)[1].lower()
        shutil.copy(p, os.path.join(web, "assets", name)); rel[k] = "assets/" + name; files.append("./assets/" + name)
    for s in (180, 192, 512):
        shutil.copy(os.path.join(SRC, "icons", "icon-%d.png" % s), os.path.join(web, "icons", "icon-%d.png" % s))
        files.append("./icons/icon-%d.png" % s)
    manifest = {
        "name": APP_NAME, "short_name": SHORT_NAME, "start_url": "./", "scope": "./", "display": "standalone",
        "orientation": "any", "background_color": "#ffffff", "theme_color": "#ffffff",
        "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
                  {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}],
    }
    open(os.path.join(web, "manifest.webmanifest"), "w").write(json.dumps(manifest, indent=1))
    files += ["./", "./index.html", "./manifest.webmanifest"]
    # Cache name changes whenever any content changes, which triggers an update on the iPad.
    h = hashlib.sha1()
    for part in (css, content, diagrams, app):
        h.update(part.encode())
    for k in sorted(assets):
        h.update(k.encode()); h.update(str(os.path.getsize(assets[k])).encode()); h.update(str(int(os.path.getmtime(assets[k]))).encode())
    cache = "hellma-kiosk-" + h.hexdigest()[:10]
    head_extra = ('<link rel="manifest" href="manifest.webmanifest">\n'
                  '<link rel="apple-touch-icon" href="icons/icon-180.png">\n')
    index = page(rel, "full", {"KIOSK_PWA": True, "KIOSK_CACHE": cache, "KIOSK_PRECACHE_COUNT": len(files)}, head_extra)
    open(os.path.join(web, "index.html"), "w", encoding="utf-8").write(index)
    sw = """/* Offline cache for the Hellma kiosk. Generated by build.py; do not edit. */
const CACHE = %s;
const FILES = %s;
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("hellma-kiosk-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === "navigate") { const home = await c.match("./index.html"); if (home) return home; }
    return fetch(req);
  }));
});
""" % (json.dumps(cache), json.dumps(files, indent=1))
    open(os.path.join(web, "sw.js"), "w").write(sw)
    zpath = os.path.join(DIST, "hellma-pat-kiosk-web.zip")
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for base, _, fns in os.walk(web):
            for fn in fns:
                full_p = os.path.join(base, fn)
                z.write(full_p, os.path.join("hellma-pat-kiosk-web", os.path.relpath(full_p, web)))
    print("dist/web/ (%d files cached for offline, cache %s), zip %.1f MB" % (len(files), cache, os.path.getsize(zpath) / 1e6))


if __name__ == "__main__":
    build()
