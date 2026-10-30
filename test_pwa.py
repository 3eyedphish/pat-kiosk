import os, asyncio, json
from playwright.async_api import async_playwright
URL = "http://localhost:8765/"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("PW_CHROMIUM") or None)
        ctx = await b.new_context(viewport={"width": 1180, "height": 820}, has_touch=True, service_workers="allow")
        pg = await ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        await pg.goto(URL); await pg.wait_for_timeout(500)
        await pg.evaluate("navigator.serviceWorker.ready")
        for i in range(30):
            n = await pg.evaluate("caches.open(window.KIOSK_CACHE).then(c=>c.keys()).then(k=>k.length)")
            need = await pg.evaluate("window.KIOSK_PRECACHE_COUNT")
            if n >= need: break
            await pg.wait_for_timeout(300)
        print("cached", n, "of", need, "cache", await pg.evaluate("window.KIOSK_CACHE"))
        await pg.reload(); await pg.wait_for_timeout(500)
        print("controlled by SW:", await pg.evaluate("!!navigator.serviceWorker.controller"))
        await ctx.set_offline(True)
        await pg.reload(); await pg.wait_for_timeout(800)
        print("offline reload, attract visible:", await pg.is_visible("#attract"))
        await pg.click("#attract"); await pg.wait_for_timeout(300)
        await pg.evaluate("KIOSK_APP.go('product/excalibur-hd')"); await pg.wait_for_timeout(500)
        w = await pg.evaluate("document.querySelector('#pstage img').naturalWidth")
        print("offline product image width:", w)
        await pg.evaluate("KIOSK_APP.go('contact')"); await pg.wait_for_timeout(300)
        await pg.fill("#f-first", "Off"); await pg.fill("#f-last", "Line"); await pg.fill("#f-company", "NoNet Corp"); await pg.fill("#f-email", "off@line.com")
        await pg.click("#f-consent"); await pg.click("button[type=submit]"); await pg.wait_for_timeout(500)
        await pg.reload(); await pg.wait_for_timeout(800)
        print("leads after offline reload:", await pg.evaluate("KIOSK_APP.store.all().then(a=>a.map(l=>l.company))"))
        await pg.evaluate("KIOSK_APP.openStaff()"); await pg.wait_for_timeout(1200)
        print("staff offline status:", await pg.inner_text("#st-offline"), "| storage:", await pg.inner_text("#st-persist"), "| update btn:", await pg.is_visible("#st-update"))
        await pg.screenshot(path="shots/pwa_staff.png")
        print("ERRORS:", [e for e in errs if "net::ERR_INTERNET_DISCONNECTED" not in e])
        await b.close()
asyncio.run(main())
