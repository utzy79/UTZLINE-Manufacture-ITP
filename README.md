# UTZLINE Manufacture ITP — installable app

**Current version: v3** (its own independent version line, separate from
Site Measure/Viewer's and from Install ITP's — bump this line every time
a new build ships.)

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
device-identity ("Set your name") and signature-pad/PDF-export
machinery. What's different is the checklist content itself (Andrew's
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

Same pattern as the Viewer and Install ITP: a subfolder of the same
GitHub Pages site the rest of the family already lives on, so all the
apps install as separate, independent apps from one repo:

1. In the `UTZLINE-Site-Measure` repo, add everything from this folder
   under a
   [`manufacture-itp/`](https://github.com/utzy79/UTZLINE-Site-Measure/tree/main/manufacture-itp)
   subfolder — so it ends up live at
   [`https://utzy79.github.io/UTZLINE-Site-Measure/manufacture-itp/`](https://utzy79.github.io/UTZLINE-Site-Measure/manufacture-itp/).
   Keep the `icons/` folder structure intact.
2. Open that URL once in a normal browser tab while online, so the
   service worker can cache it for offline use.
3. Install it: Chrome/Edge's install icon in the address bar ("Install
   this site as an app") while on the `manufacture-itp/` URL
   specifically. Because it has its own `manifest.json` (its own name
   and icons — purple, to tell it apart from Install ITP's green, Site
   Measure's orange, and the Viewer's blue), Chrome and Windows/Android
   treat it as a wholly separate, independently installable app.
4. On a phone or tablet, or on a factory-floor computer — the main way
   this one's meant to be used — "Install this site as an app" is under
   the browser's own menu (Chrome: ⋮ → "Add to Home screen" / "Install
   app").

## Updating this app

Same process as the other apps: unzip whatever's shared in chat, upload
the files into this app's own `manufacture-itp/` folder in the repo
(overwriting existing ones, keeping `icons/` intact), commit, wait for
GitHub Pages to redeploy, then close and reopen the installed app to
pick up the change. Bump `service-worker.js`'s `CACHE_NAME` (and the
version note at the top of that file) with every change that ships,
same convention as the other apps, so installed copies actually pick up
the update instead of serving a stale cached copy forever.

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
