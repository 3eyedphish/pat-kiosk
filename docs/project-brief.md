# Hellma PAT kiosk: project brief

Status as of October 14, 2026 · Version 0.6 (application notes) · Owner: Evan Friedmann, Hellma USA

## What it is
A touch kiosk that potential customers use on their own on an unattended iPad at process trade shows. It presents Hellma's PAT (process analytical technology) line: Hellma Analytics process probes and flow cells, plus Hellma Solutions services. It captures leads on the iPad.

Hard requirements: works fully offline · English only · no external links · leads stay on the iPad until staff export them · resets to an attract screen when idle · built so other product lines (cuvettes, microplates, reference materials) and application areas can be added later.

## Where things live
- **Live kiosk:** https://3eyedphish.github.io/pat-kiosk/ (GitHub Pages, free)
- **Repository:** github.com/3eyedphish/pat-kiosk (public). The `main` branch holds only the built web app. Claude has push access through the Claude GitHub App.
- **Source code:** not in the repository yet. A copy is in `hellma-pat-kiosk-source-0.6.zip`. Keep it until the source has a permanent home.
- **Preview:** a private Claude artifact ("Hellma kiosk preview") shows the same build in a browser.
- **Source documents:**
  - 20250428_HellmaUSA_PAT.pptx (product and Solutions deck)
  - HellmaUSA_2025_Applications_for_CPACT_webinar.pptx
  - Info sheet 661.920 (polymer extruder probe)
  - Espada fluorescence geometry graphic and the NIR band-assignment chart (sent in chat)
  - The Application Notes folder: OneDrive › Hellma Documents › Marketing Info › Application Notes

## How it is built
- A vanilla JavaScript single-page app with no framework.
  - `src/content.js` holds every word and spec shown to visitors.
  - `src/app.js` holds the screens, lead form, staff panel and offline support.
  - `src/diagrams.js` holds the animated SVG diagrams and charts.
  - `src/styles.css` holds the styles.
  - `src/assets/<ID>.jpg|png|svg` holds the images: P = products, D = drawings, S = story photos, F = story figures, I/K/A/W/C/R = photos.
- A value written as `{ v: "text", check: "note" }` shows normally to visitors, and staff can list it in review mode until it is confirmed.
- `python3 build.py` produces three things:
  - `dist/web/`, the installable web app with an offline cache (about 7 MB, 145 files)
  - `dist/hellma-pat-kiosk.html`, a single-file version
  - `dist/artifact.html`, the preview page

## How to publish an update
1. Edit the source and bump `meta.version` in `content.js`.
2. Run `python3 build.py`, then test at iPad landscape (1180×820) and portrait (820×1180).
3. Replace the contents of the repo's `main` branch with `dist/web/` (keep README.md), commit and push.
4. GitHub Pages republishes in about a minute. Its cache can lag for up to about 10 minutes.
5. On the iPad, open the staff panel and tap **Check for update**. The bottom line of the staff panel shows the version.

## Running it at a show
- **Install:** open the address in Safari → Share → Add to Home Screen → open it once on Wi-Fi. Wait until the staff panel says "Ready offline (145 files…)".
- **Lock the iPad to the kiosk:** use Guided Access (Settings → Accessibility), with Auto-Lock off, the iPad plugged in, and Focus on.
- **Staff panel:** tap the logo 5 times, then enter the PIN. The default PIN is 4815; change it before a show.
  - A single tap on the logo goes home.
  - The panel has Share CSV, Copy CSV, Show as text, a 3-second hold to delete all leads, idle time, event name, review mode and "Animate diagrams even when Reduce Motion is on" (on by default).
- **Idle reset:** after 90 s without a touch, a 15 s countdown appears, then the attract screen returns and the form clears.
- **Lead fields:** first name, last name, company, title, email, phone, location (one free-text field), interests, requests, message, consent, products viewed, event and timestamp. Leads are kept on the iPad in IndexedDB with a localStorage mirror.

## Content decisions Evan has confirmed
- **Welded metal seals** (Excalibur HD and FCP) are rated "250 bar*". Footnote: "*Higher pressures are possible but cannot be certified because of testing limitations." FET is 200 bar with no asterisk.
- **FCP:** −30 to 300 °C (−22 to 570 °F). **FET:** −30 to 400 °C (−22 to 750 °F). The deck had the Fahrenheit values swapped.
- **Excalibur standard rating:** up to 250 bar. The polymer extruder probes are custom-built, up to 750 bar and 300 °C.
- **Falcata, Katana and Gladius XP pages** show both the O-ring and the brazed ratings, and the probe finder uses the brazed maximum. The brazed Gladius is the XP.
- **Gladius FDR:** spectral range in nm, working distance 25–100 mm. Gladius XP: contact or 2 mm.
- **Excalibur HY 25 (3-A):** VIS–NIR 400–2300 nm, 1 mm path, 16 bar, photo P18. Specs come from hellma.com.
- **Espada geometry:**
  - a mirror turns the excitation light 90°
  - a far mirror gives a second pass
  - emission is collected at 90°
  - a bottom mirror returns the downward emission
- **Raman diagram:** direct backscatter, with excitation and collection on the same path.
- **Cosmetics** was removed as an industry.
- **Paint tables** were confirmed, credited "Measured in cooperation with Mettler Toledo".
- **Water-in-solvents case study** wording: "FDA certified materials possible".
- **The contact shown on the form** is confirmed.
- **The NIR band chart** is built from the band-assignment chart Evan supplied.
- **Probe picks per application:**
  - Dissolution: Falcata
  - Biotech: Excalibur HY
  - Natural gas: FCP, HD and Tidus Flex Gas, plus the transmission and Raman principles
  - Paint: Katana ATR
  - Dairy: Excalibur HY
  - Water: Excalibur XP, FCP and Espada
  - Polyols and oleochemicals: Excalibur HD, because the application notes use the HD FPT

## What's in Applications (v0.6)
- **11 industries:** pharmaceutical, biotechnology, chemistry, oil/gas/petrochemistry, polymers, paints & coatings, food, dairy, beverages, agriculture, water.
- **4 techniques:** UV-Vis, NIR/MIR, Raman, fluorescence.
- **31 stories.**
- **7 case studies:** water in solvents, Sartorius single-use flow cell, Versalis EPS, IOI Oleo, Schwarzwaldmilch, AkzoNobel BPA-free coatings, precious-metals refining.
- **Not used yet:** the 14 lab application notes (TrayCell, microvolume DNA/protein, spectrophotometer validation). They wait for a lab product line.

## Open review flags
- Excalibur HY temperature: 140 °C shown. hellma.com gives 150 °C at the optical connection and 140 °C for the DIN 32676 connection.
- Asterisks with no footnote on Kalrez 6375 (slides 18, 25, 28) and EPDM (slide 32).
- Espada, Tidus Lumio and Tidus Flex Gas cards: no temperature, pressure or dimension specs. Espada and Tidus Lumio also have no photo.
- Is HORIBA's probe 661.057-UV part of the Espada family?
- Bruker filter-dryer story: the note names no Hellma probe, so the Gladius XP is linked as a suggestion.
- Wording written for the kiosk, not taken from the deck:
  - the PAT measuring-position definitions
  - the FAT/SAT definitions in the V-model
  - the summaries of the Solutions portfolio
- Unanswered: should the welded-seal footnote also say the seals were tested to 400 bar?
- Several low-resolution images are still to be replaced. The image request list has the IDs.

## Backlog and options offered
1. **Salesforce leads.**
   - Option 1: CSV export plus the Data Import Wizard into a show campaign. Works now.
   - Option 2: Web-to-Lead with an offline send queue. Needs the generated Web-to-Lead HTML and each show's Campaign ID.
   - Option 3: an integration through a connector service such as Zapier, Make or Power Automate, protected by a secret key entered on the iPad.
   - If leads are sent automatically, the form's privacy line must change.
2. A "Salesforce CSV" button that writes Salesforce field names, Lead Source and Campaign ID.
3. Product cards for the Excalibur HD FPT and the HD Flange; the application notes have their photos.
4. A lab section (TrayCell plus reference materials) built from the 14 lab notes.
5. Store the source code in the repository (for example a separate branch) so any future session can rebuild.
6. Change the default PIN before the first show.
