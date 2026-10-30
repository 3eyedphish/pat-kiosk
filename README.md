# Hellma PAT kiosk

Touch kiosk for an unattended iPad at process shows. Runs in Safari as a Home Screen web app, offline after the first open.

## Put it online (once, free)
Upload the `hellma-pat-kiosk-web` folder (unzipped `dist/hellma-pat-kiosk-web.zip`) to any free https static host:
- **Netlify:** sign in to a free account, open app.netlify.com/drop and drag the folder onto the page. Sites dropped
  without an account are deleted after about an hour.
- **GitHub Pages** (free for public repositories) or **Cloudflare Pages** work the same way.

The address can stay unlisted. Leads are never sent to the host; they stay on the iPad.

## Install on the iPad
1. Open the address in Safari, tap Share > **Add to Home Screen**, keep **Open as Web App** on, tap Add.
2. Open **Hellma PAT** from the Home Screen while on Wi-Fi. Open the staff panel and wait until
   *Offline* reads **Ready offline**. From then on it runs with no internet.
3. Settings > Accessibility > **Guided Access**: turn on, set a passcode, and under Display Auto-Lock choose Never.
   Open the kiosk, triple-click the top button, tap Start. Triple-click again and enter the passcode to exit.
4. Keep the iPad plugged in and turn on a Focus (Do Not Disturb) so notifications don't pop up.

## Staff panel
- Tap the Hellma logo in the top bar 5 times within 3 seconds, then enter the PIN (default `4815`). Change it before the show.
- Export leads at the end of each day: **Share CSV** (Mail, AirDrop, Save to Files), **Copy CSV** or **Show as text**.
- Leads stay on the iPad until you hold **Delete all leads** for 3 seconds.
- **Highlight values to confirm** outlines every value still flagged for review and lists them all.
- **Check for update** pulls a new version after you re-upload the folder. With Wi-Fi on, the kiosk also checks every
  30 minutes and switches over at the next start-over.

## Visitor flow
Attract screen → Home → topics. After 90 s without a touch (adjustable) a 15 s countdown appears, then the kiosk clears
the form and returns to the attract screen. After a request is sent it returns to the attract screen after 12 s.

## Editing
- All visitor-facing text and specs: `src/content.js`. A value written `{ v: "...", check: "note" }` is shown normally and
  listed in review mode until the note is resolved; then replace it with a plain string.
- New product line: add it to `lines`, `families`, `products` and a tile in `home.groups`. Product and catalog pages are
  generated from the data.
- New application: add a story to `applications.stories` and list its id under the matching `applications.fields` entry
  and `applications.techniques` entry. A new industry is one more entry in `applications.fields`.
- Footnotes such as the welded-seal pressure note live in `footnotes`; anything with `foot: "weld"` shows it.
- Images: `src/assets/<ID>.<jpg|png|webp|svg>`. IDs match the image request list (P1 = Excalibur XP, D2 = its drawing, etc.).
  Drop in a better file with the same ID; the newest file per ID wins.
- Rebuild: `python3 build.py`, then upload the new `dist/web` folder to the same site.
