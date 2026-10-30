import os, asyncio, sys, json
from playwright.async_api import async_playwright
FILE = "file:///home/claude/kiosk/dist/hellma-pat-kiosk.html"
ROUTES = sys.argv[1].split(",")
W, H = int(sys.argv[2]), int(sys.argv[3])
TAG = sys.argv[4]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("PW_CHROMIUM") or None)
        ctx = await b.new_context(viewport={"width": W, "height": H}, device_scale_factor=1, has_touch=True)
        pg = await ctx.new_page()
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
        await pg.goto(FILE)
        await pg.wait_for_timeout(600)
        for r in ROUTES:
            if r == "attract":
                pass
            elif r == "staff":
                await pg.evaluate("KIOSK_APP.openStaff()")
            else:
                await pg.evaluate(f"KIOSK_APP.go({json.dumps(r)})")
            await pg.wait_for_timeout(900)
            ov = await pg.evaluate("(()=>{const v=document.getElementById('view');const pgEl=v&&v.firstChild;return {vw: window.innerWidth, sw: document.documentElement.scrollWidth, vsw: v? v.scrollWidth:0, vcw: v? v.clientWidth:0, h: v? v.scrollHeight:0}})()")
            name = f"/home/claude/kiosk/shots/{TAG}_{r.replace('/','-')}.png"
            await pg.screenshot(path=name)
            print(r, ov)
        print("ERRORS:", errs)
        await b.close()
asyncio.run(main())
