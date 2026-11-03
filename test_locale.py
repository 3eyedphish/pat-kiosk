import os, asyncio, sys
from playwright.async_api import async_playwright
FILE = "file:///home/claude/kiosk/dist/hellma-pat-kiosk.html"
OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp"
async def run(b, w, h):
    ctx = await b.new_context(viewport={"width": w, "height": h}, has_touch=True)
    pg = await ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto(FILE); await pg.wait_for_timeout(400); await pg.click("#attract")
    await pg.evaluate("KIOSK_APP.go('contact')"); await pg.wait_for_timeout(200)
    print(w, "default consent:", (await pg.inner_text("#f-consent")).splitlines()[0])
    await pg.evaluate("KIOSK_APP.go('home')"); await pg.wait_for_timeout(200)
    for i in range(5): await pg.click("#logo-btn")
    for k in "4815": await pg.click(f'#pin [data-k="{k}"]')
    await pg.wait_for_timeout(500)
    vals = {"territory": "Hellma UK", "name": "Jane Smith", "role": "Sales Engineer", "phone": "+44 1702 000000", "email": "jane.smith@hellma.com", "web": "www.hellma.com", "founded": "", "office": "Southend-on-Sea, UK"}
    for k, v in vals.items(): await pg.fill(f"#st-loc-{k}", v)
    await pg.locator("#st-loc").scroll_into_view_if_needed()
    await pg.screenshot(path=f"{OUT}/staff-loc-{w}x{h}.png")
    await pg.click("#st-loc-save"); await pg.click("#st-close")
    await pg.reload(); await pg.wait_for_timeout(500); await pg.click("#attract")
    await pg.evaluate("KIOSK_APP.go('contact')"); await pg.wait_for_timeout(300)
    print(w, "after reload consent:", (await pg.inner_text("#f-consent")).splitlines()[0])
    print(w, "eyebrow:", await pg.inner_text(".pagehead .eyebrow"))
    card = pg.locator(".panel.sky"); print(w, "card:", (await card.inner_text()).replace("\n", " | "))
    await card.scroll_into_view_if_needed(); await pg.screenshot(path=f"{OUT}/contact-{w}x{h}.png")
    await pg.evaluate("KIOSK_APP.go('about')"); await pg.wait_for_timeout(300)
    print(w, "about panel:", (await pg.locator(".panel.sky").inner_text()).replace("\n", " | ")[:120])
    html = await pg.content(); print(w, "'Hellma USA' left on screen:", "Hellma USA" in await pg.inner_text("#view"))
    # reset
    await pg.evaluate("KIOSK_APP.go('home')")
    for i in range(5): await pg.click("#logo-btn")
    for k in "4815": await pg.click(f'#pin [data-k="{k}"]')
    await pg.wait_for_timeout(400); await pg.click("#st-loc-reset"); await pg.click("#st-close")
    await pg.evaluate("KIOSK_APP.go('contact')"); await pg.wait_for_timeout(200)
    print(w, "after reset card:", (await pg.locator(".panel.sky").inner_text()).replace("\n", " | "))
    sw = await pg.evaluate("document.documentElement.scrollWidth > innerWidth")
    print(w, "horizontal overflow:", sw, "ERRORS:", errs); await ctx.close()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("PW_CHROMIUM") or None)
        await run(b, 1180, 820); await run(b, 820, 1180); await b.close()
asyncio.run(main())
