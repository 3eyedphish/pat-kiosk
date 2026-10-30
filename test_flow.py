import os, asyncio, json
from playwright.async_api import async_playwright
FILE = "file:///home/claude/kiosk/dist/hellma-pat-kiosk.html"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("PW_CHROMIUM") or None)
        ctx = await b.new_context(viewport={"width": 1180, "height": 820}, has_touch=True)
        pg = await ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        await pg.goto(FILE); await pg.wait_for_timeout(500)
        # attract -> tap -> home
        await pg.click("#attract"); await pg.wait_for_timeout(400)
        print("after tap, home visible:", await pg.is_visible("#shell"))
        # finder: pick ATR + 250 °C
        await pg.click(".hero-tile"); await pg.wait_for_timeout(300)
        await pg.click('.chip[data-f="principle"][data-val="atr"]')
        print("ATR:", await pg.inner_text("#f-count"))
        await pg.click('.chip[data-f="temp"][data-val="300"]')
        print("ATR + 300C:", await pg.inner_text("#f-count"))
        await pg.click('#f-reset'); await pg.click('.chip[data-f="pres"][data-val="250"]')
        print("250 bar:", await pg.inner_text("#f-count"), [await e.inner_text() for e in await pg.query_selector_all(".pcard .nm b")])
        # open product, then request info -> prefilled interest
        await pg.click('.pcard >> nth=0'); await pg.wait_for_timeout(300)
        await pg.click('#cta'); await pg.wait_for_timeout(300)
        pressed = [await e.get_attribute("data-int") for e in await pg.query_selector_all('[data-int][aria-pressed="true"]')]
        print("prefilled interests:", pressed)
        # submit empty -> errors
        await pg.click('button[type=submit]'); await pg.wait_for_timeout(200)
        msgs = [await e.inner_text() for e in await pg.query_selector_all(".field .msg")]
        print("errors shown:", [m for m in msgs if m])
        await pg.fill("#f-first", "Jane"); await pg.fill("#f-last", "Doe"); await pg.fill("#f-company", "Acme Chemicals, Inc.")
        await pg.fill("#f-email", "jane.doe@acme.com"); await pg.fill("#f-msg", 'Water in "IPA", up to 120 °C')
        await pg.click('[data-rq="Quotation"]'); await pg.click("#f-consent")
        await pg.click('button[type=submit]'); await pg.wait_for_timeout(600)
        print("thanks:", await pg.inner_text(".thanks h1"))
        # staff via 5 logo taps + PIN
        await pg.click("#btn-home")
        for i in range(5): await pg.click("#logo-btn")
        await pg.wait_for_timeout(200)
        print("pin visible:", await pg.is_visible("#pin"))
        for k in "1234": await pg.click(f'#pin [data-k="{k}"]')
        await pg.wait_for_timeout(500)
        print("wrong pin -> still pin:", await pg.is_visible("#pin"))
        for k in "4815": await pg.click(f'#pin [data-k="{k}"]')
        await pg.wait_for_timeout(700)
        print("staff visible:", await pg.is_visible("#staff"))
        rows = await pg.query_selector_all("#staff tbody tr")
        print("lead rows:", len(rows), (await rows[0].inner_text()).replace("\t"," | ") if rows else None)
        await pg.click("#st-show"); await pg.wait_for_timeout(200)
        csv = await pg.input_value("#st-text")
        print("CSV:\n" + csv.strip()[:600])
        # set idle to 60 and close
        await pg.select_option("#st-idle", "60"); await pg.click("#st-save"); await pg.click("#st-close")
        # reload: persistence
        await pg.reload(); await pg.wait_for_timeout(600)
        n = await pg.evaluate("KIOSK_APP.store.all().then(a=>a.length)")
        print("leads after reload:", n, "idle setting:", await pg.evaluate("KIOSK_APP.settings.idle"))
        # idle: simulate by moving lastTouch back
        await pg.click("#attract"); await pg.wait_for_timeout(300)
        await pg.evaluate("KIOSK_APP.go('contact')"); await pg.fill("#f-first", "Temp")
        await pg.evaluate("KIOSK_APP.settings.idle = 2"); await pg.wait_for_timeout(3500)
        print("idle overlay:", await pg.is_visible("#idle"))
        await pg.evaluate("KIOSK_APP.settings.idle = 2"); await pg.wait_for_timeout(16000)
        print("back on attract:", await pg.is_visible("#attract"), "shell hidden:", not await pg.is_visible("#shell"))
        await pg.click("#attract"); await pg.evaluate("KIOSK_APP.settings.idle = 600; KIOSK_APP.go('contact')"); await pg.wait_for_timeout(300)
        print("form cleared after reset:", repr(await pg.input_value("#f-first")))
        print("ERRORS:", errs)
        await b.close()
asyncio.run(main())
