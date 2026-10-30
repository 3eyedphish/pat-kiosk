import asyncio, re
from playwright.async_api import async_playwright
from PIL import Image
svg = open("src/assets/L1.svg").read()
svg = re.sub(r"<\?xml[^>]*\?>", "", svg); svg = re.sub(r"<metadata.*?</metadata>", "", svg, flags=re.S)
html = f'<html><body style="margin:0;background:#fff;width:1024px;height:1024px;display:grid;place-items:center"><div style="width:800px">{svg.replace("<svg", "<svg style=\'width:100%;height:auto\'", 1)}</div></body></html>'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1024, "height": 1024})
        await pg.set_content(html); await pg.screenshot(path="src/icons/icon-1024.png"); await b.close()
asyncio.run(main())
im = Image.open("src/icons/icon-1024.png").convert("RGB")
for s in (180, 192, 512):
    im.resize((s, s), Image.LANCZOS).save(f"src/icons/icon-{s}.png", optimize=True)
print("icons ok")
