# UTZLINE Manufacture ITP — installable app

**Current version: v10** (its own independent version line, separate from
Site Measure/Viewer's and from Install ITP's — bump this line, and add a
dated entry below, every time a new build ships. See
`next-version-notes.md` in the project for the full per-version changelog
if a gap ever needs filling in.)

**v10 (2026-09-24):** joinery-status.json v2 — Andrew, verbatim, on the coming scale: "we will have 30 people using this app in different stages, all coming back to the same database... needs to be foolproof and nevel lose data. some of this will be done via dropbox upload after the fact." The shared `joinery-status.json` used to be one JSON array file, rewritten whole on every save — safe with a couple of writers, but risky with up to 15 people across five apps, some syncing in late via Dropbox: two people's saves could silently clobber each other. Replaced with one small immutable event file per status change, filed under `Project Saves/Joinery Status/<Level> - <Room> - <Code>/` — two writers can never collide, and a late Dropbox sync can never overwrite a newer save regardless of arrival order. The old file is migrated automatically and losslessly (once, idempotently) the first time any app in the family opens a project after this update, and left in place afterward, untouched. Every existing display/render call site, and this app's own machined-precondition gate on sign-off (v9 above), is completely unchanged — still the same `{status, updatedAt, updatedBy, history[]}` shape, just folded from events instead of read off a shared array. `service-worker.js` cache bumped to `utzline-manufacture-itp-cache-v10`. `run_manufacture_itp_machined_gate.js`, `run_manufacture_itp_no_answer_gating_and_photos.js` and `run_manufacture_itp_status_signoff.js` all updated to seed/read the new event files instead of the old shared array; full suite re-run clean.

**v9 (2026-09-23):** Andrew, verbatim: *"Manufacture status needs to be split up into 2 parts. We need a machined and a manufactured tab. All traceable by user name. Machined to have its own app. Called machine schedule. This is where the machinist can mark off a joinery item as complete. It will add their name and date time to the system."* The shared `joinery-status.json` pipeline gains a new stage, **"machined"** (rank 3, between "in_manufacture" and "manufactured" — which, along with "delivered"/"installed", all shift up one rank). This app never writes "machined" itself — that's set exclusively by the new sibling app, **UTZLINE Machine Schedule** — but it now reads it as a real, user-facing **precondition on its own sign-off**: the checklist can't be signed off as "manufactured" until the item has already reached "machined". Blocked right at the sign action itself (the signature pads' `onStroke` handlers revert the exact stroke that would otherwise complete both signatures, and the checklist rows' tri-state buttons show the same message if fixing the last row flagged "No" is what would complete it instead), with a clear on-screen message pointing the operator at the Machine Schedule app, plus a defense-in-depth re-check inside `syncJoineryStatusFromChecklist` itself so even the pre-existing-signed-checklist backfill-on-open path can't slip past it. A small "⚙️ Not yet marked Machined" banner on the checklist screen gives an early heads-up — no other new UI, per Andrew's own "otherwise stay as-is" for this app. `syncInManufactureOnOpen`/the "in_manufacture" write on every checklist open are unchanged. New test `run_manufacture_itp_machined_gate.js` (`pdftest-projects/`) covers both the block and the success-once-machined path through the real checklist screen; `run_manufacture_itp_no_answer_gating_and_photos.js` and `run_manufacture_itp_status_signoff.js` both updated to seed a "machined" record ahead of their own sign-off flows. `service-worker.js` cache bumped to `utzline-manufacture-itp-cache-v9`.

**v8 (2026-09-23):** Andrew, verbatim, on the exported PDF's photos: "change it from a3 to a4 portrait. All collated nicely per page. All to be date and time stamped with users name also." The trailing photo pages (previously one or more A3 landscape pages, 3 columns × 2 rows) are now **A4 portrait**, 2 columns × 3 rows — same 6-per-page count, reflowed for the narrower shape, matching this document's own page size for the first time. Each photo now shows a **date/time + uploader-name caption** underneath it, from a new `addedBy` field stamped onto the photo record the moment it's added (whoever's signed in on this device, via the identity system already shipped in v7 above) alongside its existing `addedAt`. A photo added before this release has no `addedBy` and simply shows its date/time alone, never a blank or "undefined" name. `run_manufacture_itp_no_answer_gating_and_photos.js` (`pdftest-projects/`) updated the same way as Install ITP's own equivalent test — spies on jsPDF's `addPage` calls (wrapping the constructor itself, since `addPage` lives only on each constructed instance in this jsPDF build, not on `.API` or `.prototype`) to confirm the export now calls `addPage("a4","portrait")` for the photo grid and never `"a3"`. `service-worker.js` cache bumped to `utzline-manufacture-itp-cache-v8`.

**v7 (2026-09-23):** Andrew, verbatim: *"implement the username as per
the delivery itp throughout the entire system, but instead of it opening
a popup, the button is the selector, when you pick a name it opens a
numberpad to input the pin (4 digit pin)."* Replaces the old "Set your
name" button + single freeform-text prompt (no PIN at all) with the
shared name+PIN identity pattern ported verbatim from Delivery ITP's own
reference implementation: the Projects-screen `identitySelector`
`<select>` **is** the button — its own native dropdown lists every known
name plus "+ Add a new name…" — and picking a name immediately opens an
on-screen numberpad (never a text field) to enter/verify its 4-digit
PIN. Adding a brand-new name still types the name as plain text, then
chooses and confirms a PIN via two numberpad rounds, then ticks which
apps to list it in ("show me in", `ManufactureITP` pre-checked). Reads
and writes the same shared `<Projects folder>/utzline-users.csv`
registry every app in the family now uses (see "Where things are saved"
below) — a name added from any UTZLINE app shows up in all of them. The
underlying per-device `utzline-identity` IndexedDB mechanism
(`getDeviceUserName`/`setDeviceUserName`) is unchanged; only what
triggers it on this screen changed.

**v4–v6 (2026-09-23):** three small releases updating this app's own
level-list exclusion to also skip the new `itp-delivery` folder (UTZLINE
Delivery ITP's own project-wide data folder), so it's never mistaken for
a Level anywhere in this app. No other functional change in v4–v6 — see
`next-version-notes.md` for the exact detail of each.

**v3 (2026-09-23):** mirrors Install ITP v10. Checklist sign-off now auto-advances the shared `joinery-status.json` record (project root, works in both flat and legacy projects) to "manufactured" the moment both signoff fields are filled in, forward-only, with backfill for a checklist signed off before this existed. The shared status badge (📏/📦/🏆) now renders on this app's own Level Plan markers too, alongside the existing per-item ✓/✕ indicator. Also adds a read-only "View job note" button to the checklist screen, listing PDFs Site Measure/Viewer have attached to that joinery item.

**v2 (2026-09-22):** flat-project support, mirroring Install ITP v9 — a project created by UTZLINE Projects v9+ (no real Level/Room folders; Project Saves/Floor Plans/ + joinery-items.json instead) now works here too. Levels/Rooms are read from those files, the joinery-item list is built from joinery-items.json ("+ New Joinery Item" is hidden -- only UTZLINE Projects creates items), and this app's flat-project checklist/PDF data lives in `Project Saves/UTZLINE ITP/Manufacture ITP/` and `PDF Files/UTZLINE ITP/Manufacture ITP/`. A LEGACY (folder-based) project's behaviour is unchanged. Unlike Install ITP, this app's own `itp-manufacture` folder name is unchanged (it was never ambiguous) -- its own level-list exclusion now additionally excludes Install ITP's renamed `itp-install` folder.

This folder is the self-contained, installable **UTZLINE Manufacture
ITP** app — a fourth app in the same family as **UTZLINE Site Measure**
(the editor), **UTZLINE Viewer** (the read-only browser), and **UTZLINE
ITP**, which is now specifically the **Install ITP** app (the one used
on site once a joinery item is installed). This one is its sibling for
the earlier, factory stage of the same item's life: filling in and
signing off pre-delivery/pre-dispatch quality checklists in the
workshop, before an item ever leaves for site.

Per UTZLINE Data Standard v1 (decision #14), the install-stage and
manufacture-stage checklists are two separate installable apps, not one
app with two modes — they're filled in by different people, in
different places, at different points in an item's life, so keeping
them as separate installs (separate icons, separate home-screen tiles)
matches how they're actually used.

**Forked directly from the Install ITP codebase**, not built from
scratch: same `index.html`-as-the-whole-app structure (~1400 lines,
markup/styles/logic together), same `manifest.json`/`service-worker.js`
installability pattern, same Projects-folder browsing, same shared
device-identity (the name+PIN selector, see "Where things are saved"
below) and signature-pad/PDF-export machinery. What's different is the
checklist content itself (Andrew's
own Metro Joinery **"PRE DELIVERY – CHECKLIST"** template, 17 rows, in
place of the 16-row install checklist), the two sign-off roles
("Joinery Builder" and "Metro Factory / Workshop Supervisor" in place of
"Subcontractor Rep. (Joinery Installer)" and "Metro Site Supervisor"),
the accent colour (purple, to tell it apart from Install ITP's green,
Site Measure's orange, and the Viewer's blue), and — importantly — its
own project-wide data folder, kept fully separate from Install ITP's.

It reads the **same Projects folder** every other app in the family
uses — the same project → level → room folder structure — so nothing
about how a project is organised has to change to start using it. It
never touches a room's own `saves`/`pdfs`/`backup` content; it only
reads a project's `project-meta.json` (written by Site Measure's own
"Project Info" screen, if filled in) to auto-fill the title block, and
it keeps its own checklist data in a project-wide **`itp-manufacture`**
folder it creates alongside the level folders — a sibling of, and never
colliding with, Install ITP's own `itp` folder (see "Where things are
saved" below).

## What it does

1. Choose the Projects folder (same one as the other apps) — the folder
   handle is remembered, same reconnect-after-permission-reset flow as
   the others.
2. Browse Project → Level → Room, same navigation as the Viewer and
   Install ITP.
3. Inside a room, see a simple list of joinery items that already have
   a manufacture checklist started, or start a new one by typing its
   joinery number ("+ New Joinery Item").
4. Fill in the checklist: the title block (Project No./Name/Head
   Contractor/Area-Room/Joinery No.) auto-fills itself; the 17
   pre-delivery quality checks are Yes/No/N/A with a comment field each,
   taken verbatim from Metro Joinery's own "PRE DELIVERY – CHECKLIST"
   paper template; there's a free-text Notes/Comments/Missing Parts box;
   and two sign-off blocks ("Joinery Builder" and "Metro Factory /
   Workshop Supervisor") each with a Name field, a Date field that fills
   itself in with today's date the moment a name is typed (but never
   overwrites a date you've already changed), and a signature pad you
   sign with a finger or stylus.
5. It autosaves a few seconds after any change, and there's an explicit
   Save button too.
6. "Export PDF" renders the whole checklist — including both
   signatures — to a PDF and saves it straight into the project's
   `itp-manufacture` folder. Exporting again later adds a new
   timestamped PDF rather than overwriting the last one, so a history of
   exports for the same item is kept.

## Where things are saved

**Name+PIN identity registry (added v7, 2026-09-23):** `<Projects
folder>/utzline-users.csv` — a single shared file at the **Projects-root
level** (a sibling of every individual Project folder, not inside one).
The SAME file every app in the UTZLINE family reads/writes, so a name
added from any app shows up in all of them. Header row
`Name,PIN,ShowInApps`; picking a name on the Projects screen's
`identitySelector` opens an on-screen numberpad to verify its 4-digit
PIN, or "+ Add a new name…" prompts for a name, a PIN (chosen and
confirmed via two numberpad rounds), and which apps to list it in
(`ManufactureITP` pre-checked here). See Delivery ITP's own README for
the full registry documentation (file format, lost-PIN recovery, etc.)
— this app reads/writes the exact same file with the exact same rules.

**LEGACY (folder-based) project:**

```
<Projects folder>/
  <Project>/
    project-meta.json          <- written by Site Measure, read-only here
    <Level>/...                <- Site Measure's own level folders
    itp-install/               <- Install ITP's own folder (untouched by this app)
    itp-manufacture/           <- this app's own folder, project-wide
      <Level>/
        <Room>/
          <joinery-no>.json            <- this item's saved checklist state
          <joinery-no>_<timestamp>.pdf <- one file per export, never overwritten
```

The `itp-manufacture` folder sits directly under the **project's** own
folder, as a sibling of the level folders and of Install ITP's
`itp-install` folder — not nested inside any one level — so every
joinery item across the whole project ends up under one place, itself
organised by level and room to mirror the plan. **Deliberately kept
separate from Install ITP's own folder** so the two stages' checklists
for the same joinery item never collide or overwrite one another; a
given joinery number can have both a manufacture checklist and an
install checklist at once, each living in its own folder. Site
Measure/Viewer's own level list, UTZLINE Projects' own level list, and
Install ITP's own level list all know to skip folders literally named
`itp`, `itp-install` (Install ITP's folder, old name and new — renamed
2026-09-22), or `itp-manufacture` so none of them ever shows up
mislabeled as if it were a level.

**FLAT project** (created by UTZLINE Projects v9+ — no real Level/Room
folders at all):

```
<Projects folder>/
  <Project>/
    project-meta.json
    joinery-items.json                          <- written by UTZLINE Projects, read-only here
    Project Saves/
      Floor Plans/<Project> - <Level>.json       <- one file per Level (rooms/markers inside)
      UTZLINE ITP/Manufacture ITP/
        <Level> - <Room> - <Joinery Item>.json   <- this item's saved checklist state
    PDF Files/
      UTZLINE ITP/Manufacture ITP/
        <Level> - <Room> - <Joinery Item>_<timestamp>.pdf
```

One shared folder for the whole project (not per-Level/Room) since the
filename itself already carries the full Level/Room/Item key. "+ New
Joinery Item" is hidden for a flat project — only UTZLINE Projects
creates joinery items — but every item it has created shows up here the
moment it exists, even before its checklist has been touched.

## Getting this installed as its own app

**This app lives in its own separate GitHub repository** — not a
subfolder of Site Measure's, the Viewer's, or any sibling app's repo.
Every app in the UTZLINE family (Site Measure, Viewer, Install ITP,
Manufacture ITP, UTZLINE Projects, UTZLINE Scheduler, UTZLINE Delivery
ITP) is its own repo with its own GitHub Pages URL.

1. In this app's own repo, add every file from this bundle at the repo
   **root** (not inside a subfolder) — keep the `icons/` folder
   structure intact. It'll go live at that repo's own GitHub Pages URL.
2. Open that URL once in a normal browser tab while online, so the
   service worker can cache it for offline use.
3. Install it: Chrome/Edge's install icon in the address bar ("Install
   this site as an app"). Because it has its own `manifest.json` (its
   own name and icons — purple, to tell it apart from every sibling
   app's own colour), Chrome and Windows/Android treat it as a wholly
   separate, independently installable app.
4. On a phone or tablet, or on a factory-floor computer — the main way
   this one's meant to be used — "Install this site as an app" is under
   the browser's own menu (Chrome: ⋮ → "Add to Home screen" / "Install
   app").

## Updating this app

Same process every time a new build ships: unzip whatever's shared in
chat, upload the files into this app's own repo root (overwriting
existing ones, keeping `icons/` intact), commit, wait for GitHub Pages
to redeploy, then close and reopen the installed app to pick up the
change. **Bump the "Current version" line at the top of this README
(with a dated changelog entry) and `service-worker.js`'s `CACHE_NAME`
every single time a change ships** — both need to move together, or
installed copies keep serving a stale cached build and this README
stops being a reliable record of what's actually live.

## Things worth knowing

- **A joinery item is just a number you type in**, not a marker placed
  on the plan — there's no on-plan picking in this app. If two people
  type slightly different numbers for what's meant to be the same item
  ("J101" vs "J-101"), they'll end up as two separate checklists;
  agreeing on a numbering convention avoids that (ideally the same
  convention already used in Site Measure and Install ITP for the same
  item).
- **This app's checklist is entirely separate from Install ITP's.** The
  same joinery number will have one checklist under `itp-manufacture`
  (this app, filled in at the factory before dispatch) and a different
  one under `itp` (Install ITP, filled in on site after install) — that
  is by design, not a bug, since they're checking different things at
  different stages.
- **Signing is finger/stylus on the device's own touchscreen** — the
  signature pad is a plain draw area with a "Clear signature" button
  per role; there's no typed-name-as-signature fallback.
- **Project No./Name/Head Contractor only show up if Site Measure's own
  "Project Info" has been filled in for that project.** If it hasn't,
  those title-block fields just show as blank on the checklist and in
  the exported PDF — nothing breaks, but it's worth filling that in
  from Site Measure first for a tidy-looking export.
- **Exported PDFs accumulate.** Re-exporting the same joinery item after
  fixing something adds a new timestamped file rather than replacing
  the old one, so the `itp-manufacture` folder can build up multiple
  PDFs per item over time — that's deliberate (a paper trail of every
  export), not a bug, but worth knowing if you're tidying up the folder
  later.
- **This release does not yet drive the per-item status indicators**
  (the ❌/🔵/🟢/📦/🚚/🏆 pipeline shown in UTZLINE Data Standard v1) —
  filling in and signing off a checklist here doesn't yet flip anything
  visible elsewhere. That wiring, and the separate Progress Viewer app
  that will display it, come later.

## What's in this folder

- `index.html` — the whole app: markup, styles, and logic in one file
- `manifest.json`, `service-worker.js` — what makes this installable
  and offline-capable as its own app
- `icons/` — this app's own purple-accented icon set
- `jspdf.umd.min.js`, `sans.woff2`, `mono.woff2` — bundled library and
  fonts (all local, no CDN) — no SVG/PDF-import libraries are needed
  here since this app never opens an existing PDF or SVG, unlike the
  editor and Viewer
