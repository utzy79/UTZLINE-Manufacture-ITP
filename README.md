# UTZLINE Manufacture ITP — installable app

**Current version: v30 (RC 1.0)** (its own independent version line, separate from
Site Measure/Viewer's and from Install ITP's — bump this line, and add a
dated entry below, every time a new build ships. See
`next-version-notes.md` in the project for the full per-version changelog
if a gap ever needs filling in.)

**v30 (2026-10-01) — RC 1.0: Scan QR code — the QR on the Viewer's exported floor plan opens the room / joinery item here.**

- Andrew: *"can that viewer export also generate and apply a qr code on the page, that the delivery itp can scan to open the relevant room / joinery item"* → *"All three ITPs"*. A **📷 Scan QR code** button on the Projects and Levels screens opens the camera; the QR printed on the Viewer's A3 floor plan export opens that item's checklist straight away (the project, level, room and joinery code are in the code). Reads with the browser's own QR detector where it has one (Chrome on Android), otherwise with a small reader kept in the app's folder (`jsqr.min.js`, offline through the service worker). The first scan asks for camera permission.
- The same code opened by a phone's own camera is a link to the Delivery ITP (`?utz=item&p=…&l=…&r=…&j=…`); any of the three ITPs opened with that link goes to the item once its Projects folder is connected.

**v29 (2026-09-30) — RC 1.0: day / night mode, the room in the marker menu, the builder's logo on the level heading and the checklist PDF.**

- **Day / night mode** (Andrew: *"give me day / night mode for all apps"*): a ☀ / ☾ button at the top right of every screen switches between the dark look and a new light one; with nothing chosen the app follows the device's own setting. The choice is kept per device and shared by the UTZLINE apps on it.
- The marker's right-click / long-press menu now shows the **room** as well as the joinery ID (Andrew: *"these menus to show the room number also ... across all apps that have these popups on right click"*).
- **Builder's logo** (set up per builder in UTZLINE Projects) beside the project's level heading and, on every page of the checklist PDF, beside the company logo.

**v28 (2026-09-30) — RC 1.0: sign in on open (tablets and phones), Change folder bottom right.**

- Andrew: *"on next update, when opening the apps, it should as[k] for you to login, currently it just loads to the last user that was logged in, some of these tablets will have multiple users (employees)"*. **On a tablet or phone the app now asks who is using it** -- a full-screen *Who's using this?* list (every name in `utzline-users.csv`, plus *+ Add a new name…*) each time the app is opened, and again when it has been in the background for **10 minutes or more**. Tap your name and enter your 4-digit PIN on the usual numberpad. The name saved on the device is only treated as "the last person" now; if another app on the device signs in as someone else, this one asks again when it comes back to the front. **A PC is unchanged** (it keeps the last user), and the PIN numberpad, the registry and the name stamped on saves are as before.
- Andrew: *"move the change folder to the bottom right of the page, and smaller"*. The **Change folder** control on the project list is now a small button fixed to the bottom-right corner of the screen (its tooltip keeps the full wording, *Use a different Projects folder*) instead of a full-size button / link in the list.

**v27 (2026-09-30) — RC 1.0: records are kept one folder per level — much faster on a tablet; less loaded at start.**

- Andrew: *"how can we speed up schedule loading on the app android"* / *"all are slow"*. Every status, schedule date, cut, solid-surface tick, cutting file and note is still one small file per change (nothing is ever rewritten), but they now go in **one folder per level** — `Project Saves/UTZLINE Events/<record type>/<Level>/`, each file named `<Level> - <Room> - <Code> -- <name> - <time> - <kind>.json` — instead of one folder per joinery item. A schedule now lists a handful of level folders instead of hundreds of item folders; on the tablet each folder costs about a quarter of a second.
- Records a project already has in the old item folders are still read, and both places are shown together (a record found in both counts once). UTZLINE Projects shows **Speed up this project** on a project that still has old folders and moves them — each record copied, checked, then its old copy removed.
- **Update every tablet and PC.** An app older than this one doesn't look in the level folders, so it won't see records written by this one — and only press *Speed up this project* once every device is updated.
- **The PDF tools load when they're first needed** (Andrew: *"Is there anything we can strip out to speed it up. Any bloat"*). jsPDF used to load every time the app opened, about 420 KB of code parsed before anything showed; now it loads the first time a PDF is made (a checklist PDF). Offline it still comes from the app's own copy.
- The plan's status badges now read only that level's folder.


**v26 (2026-09-30) — RC 1.0: "Get ready for offline" is quick on Android.**

- Andrew: *"it has taken 10 minutes to "get ready for site""*. The check opened every file in the ticked jobs one at a time, and on his tablet each open takes about a quarter of a second. On an Android tablet OneSync / Dropsync keep a real copy of every file, so there's nothing to download: it now just checks the ticked jobs and the names & PINs list are on the tablet (a few seconds) and says so. **Open every file (slow)** in that dialog still does the full check. Windows laptops (OneDrive "online-only" files) still get the full check, which downloads what's missing.

**v25 (2026-09-29) — RC 1.0: every checklist save also writes its own change file.**

- **Two tablets can't lose each other's checklist changes any more.** Andrew: *"shouldnt everything run like this. isnt that the ultimate failsafe"*. Every save still writes the item's whole checklist file (so the schedules and Projects read it as before), and **also** a small change file of its own that's never rewritten: `Project Saves/UTZLINE ITP/Manufacture ITP Log/<Level> - <Room> - <Code>/<name> - <date time> - change.json` (a legacy project: a `<Code> log` folder beside the checklist). It holds only what that save changed — the rows, sign-offs, notes and photos that differ from when the item was opened. When two tablets save the same item offline, OneDrive keeps one whole file, but both change files arrive; opening the item puts the other tablet's changes back. For each row, sign-off and field the newest change wins; photos are added and removed one by one.
- An ordinary open reads the whole file plus a list of the item's change files — only ones the whole file hasn't already taken in are read (normally none), so it stays quick on the 4 GB tablets.
- A save that doesn't land now says so ("Couldn't save … — try Save & exit again") and Save & exit stays on the checklist. It used to carry on as if it had saved.
- Two saves of the same file at once are done one after the other.
- **Every tablet needs this version.** A tablet still on an older ITP only writes the whole file, so its changes aren't protected until it's updated.
- "Go to pin" reads Delivery ITP's change files too.

**v24 (2026-09-29) — RC 1.0: the factory for In manufacture, every time; every save retried.**

- **🏭 for a job note too.** Andrew: *"viewer is giving me different icond for in manufacture, some of it if th ehammer and spanner, others is the factory, i want the factory throguhout"*. A job note means In manufacture, but an item whose In manufacture step hadn't landed (the Scheduler's job-note bug, fixed in Scheduler v35) or that predates the rule showed 🛠️ on its marker. It now shows 🏭 like the rest.
- **Every save is retried and checked.** Status events, checklists, the names list, the status indexes and ITP PDFs: each is read back to check its size, and the whole write is tried again 0.5 s and 1.5 s later if it fails. On Windows, a sync client or antivirus holding a brand-new file for a moment used to fail the save and leave a 0-byte file with nothing said.
- **No message says "still syncing?" any more.** It was a guess and usually wrong. Messages now say "couldn't read … just now".

**v23 (2026-09-29) — RC 1.0: Projects on this device.** Andrew: *"the onsite apps need an option fo rthe user to pick the projectas they are working on to minimise the syunc on their device"*.

- **Plan markers 20% smaller.** Andrew: *"on he next projects update, make the indicator dots about 20% smaller (and the icons)"*. Every marker dot on a plan, and the status icon over it, is drawn at 0.8 × its saved size. This matches UTZLINE Projects v42. Nothing saved changes, and tapping a marker still uses the full size.
- **Projects on this device.** The project list has a new bar at the top: **Choose my projects**. Tick the one or two jobs this device is working on. Then:
  - Only those are listed. The rest sit behind **Show the other N projects**, and the app reads nothing from them. On a Windows tablet with OneDrive, an online-only job is never downloaded by this app.
  - **How to sync only these** says exactly what to keep on the device: the files in the main folder itself (names & PINs, logo) and each ticked job. It covers OneDrive on Windows (Always keep on this device / Free up space) and OneSync / Dropsync on Android (sync only those folders).
  - **Get ready for offline** opens every file in the ticked jobs, plus the names & PINs list. Anything online-only is downloaded while there's internet. Anything that won't open is listed. The bar then shows "✓ Ready for offline — checked today 09:15".
  - A ticked job that isn't on the device shows as **not on this device yet**, not just missing.
  - The choice is kept on this device, per main folder, under the same key in every UTZLINE app. Nothing is written to the Projects folder. **Show all projects** in the chooser goes back to the full list.

**v22 (2026-09-29) — RC 1.0.** Andrew: *"ok, now change them all to version RC 1.0. and have that on the logos (small)"*.

- The app is now **RC 1.0** (release candidate 1.0) across the UTZLINE family. A small **RC 1.0** tag sits beside the logo in the header.
- The build number (v22) still counts up underneath, so installed copies pick up each update. It's also what the Windows installer "Setup RC 1.0" contains.

**v21 (2026-09-27):** Hides the **Schedule Backups** folder from the project list. Scheduler v29 now keeps its daily spreadsheet backups in that folder, directly in the main Projects folder (Andrew: *"a schedule backups folder directly in the main folder ... I meant in the main folder. Not the individual projects folder."*). Every app lists every folder in the main folder as a project, so each one now leaves that folder out: `isReservedRootFolderName`, the same one-line rule in every app. Tested across all 11 apps by `pdftest-projects/run_schedule_backups_folder_hidden.js`, which fails on every app's previous build and passes on the new ones.

**v20 (2026-09-27):** "Sub orders" on the checklist screen. Andrew, verbatim: *"ok now we need all joinery summary pages to show the associated orders. with the option to mark them as recieved. the main schedule also needs a mark as received button for orders. on the schedule."* This app's own joinery item page — the checklist screen — is its "joinery summary page"; the main schedule's own "mark as received" button is separate work elsewhere.

**Review fix in the same build (2026-09-27):** the first cut of `setSubOrderReceived` read through the display reader, which treats an unreadable (mid-sync) Orders file as empty, then wrote with `create:true` — one tick at the wrong moment could have wiped every order on the item, or re-created a file someone had just emptied. It's now strict, per the family's "unreadable is not empty" rule: a file/order that's gone writes nothing ("isn't attached to this item any more"); an unreadable file is retried once, then "couldn't read (still syncing?) — nothing was changed"; it never creates anything and writes back through the handle it just read. The Orders filename now uses Sub Orders' own exact sanitizer (120-char cap, `"file"` fallback) instead of this app's (80 chars, `"item"`), so long or blank names find the file Sub Orders actually wrote. New checks in the sub-orders test cover all three failure cases.

- New **"Sub orders"** section on the checklist screen, below Photos: reads UTZLINE Sub Orders' own `Project Saves/UTZLINE Sub Orders/Orders/<Level> - <Room> - <Joinery Item>.json` (the exact filename convention Sub Orders itself writes — confirmed this app's own `sanitizeFileBase` produces byte-identical output to Sub Orders' own copy for any real Level/Room/Joinery Id, so it's reused as-is rather than duplicated), defaulting to an empty list (never an error) when nothing's been attached yet.
- **Categorised** by type: the fixed `steel`/`upholstery`/`timber`/`aluminium` order first, then any custom order type (Sub Orders' own "+ Add new type…", v4) alphabetically, one heading per type showing `o.typeLabel || typeLabels[t] || t` — the label Sub Orders itself snapshotted onto the order, so a custom type's real name shows without this app needing its own copy of Sub Orders' custom-types registry. A coloured chip per order (steel blue / upholstery orange / timber green / aluminium amber, exact hex ported from Sub Orders' own chips — already colour-validated); a custom type gets one neutral, label-forward chip, tokenized to this app's own dark-mode variables, never a guessed-at 5th hue.
- **Openable**: each order resolves its own file from Sub Orders' `Files/` folder (a missing file just hides that one row's Open button, same non-fatal pattern `readSubOrdersForItem` already uses for job notes).
- **Mark as received** (the new part): a checkbox + date per order. Ticking auto-fills today's date if empty and reveals the date field; unticking clears both `received` (false) and `receivedDate` (null); changing the date while ticked re-writes with the new date — identical interaction to Sub Orders' own View Orders list. The write is read-modify-write (`setSubOrderReceived`): always re-reads `Orders/<key>.json` fresh, finds the one matching order **by id**, and rebuilds it via a **shallow copy** (`Object.assign({}, o, {received, receivedDate})`) — never an explicit field allowlist — for the identical reason Sub Orders' own `setOrderReceived` needed the same fix today (v5 there): an allowlist that predated a later field (`typeLabel`) silently drops it forever the first time anyone marks an order received. This app's own writer is built with the shallow-copy shape from the start, so it never needs to be kept in sync with whatever field Sub Orders adds next. Independent of this checklist's own sign-off lock — `setChecklistLocked` now exempts `#subOrdersListEl` the same way it already exempts the photo file input, since receiving a sub order has nothing to do with whether the manufacture checklist itself is signed off.
- Strictly **read-only** in Sub Orders' own `Inbox/` and `Files/` folders — this app never creates, moves, renames or deletes anything there; the only path it ever writes through is `Orders/<key>.json`, and only the `received`/`receivedDate` fields of one existing entry at a time.
- New `run_manufacture_itp_sub_orders.js` (`pdftest-projects/`): the section renders grouped by type with the right chip classes; a custom order type shows its real `typeLabel` (never the raw storage key) under the neutral chip; the empty state for an item with nothing attached; ticking Received writes `received`/`receivedDate` through to the real `Orders/*.json` file while preserving every other field — `typeLabel` included — via the shallow-copy write; unticking clears both fields again; and Sub Orders' own `Inbox/`/`Files/` folders are byte-for-byte untouched before and after. Full suite re-run — **16/16** pass.

`service-worker.js` cache → `utzline-manufacture-itp-cache-v20`.

**v19 (2026-09-27):** Company logo (general note across the family, not scoped to this app). Andrew, verbatim: "change company logo should only be visable in the projects app, in every other app it should load the one chosen in projects." This app's own per-device Insert/Change/Remove logo UI (an independent IndexedDB-backed upload, `COMPANY_LOGO_KEY`) is gone. The Projects screen now shows a READ-ONLY thumbnail sourced from the shared `company-logo.png` file UTZLINE Projects owns, at the Projects root (the same root `utzline-users.csv` already comes from) — via the existing `state.rootHandle`, no write path, no device-local copy any more.

- `loadCompanyLogo()` rewritten identically to Install ITP's v40: reads `company-logo.png` via `state.rootHandle.getFileHandle(...).getFile()`, downscales it through a canvas (`downscaleImageBlob`, renamed from `downscaleImageFile`) to an in-memory `{url, w, h}` — never persisted. Best-effort: an unreadable/missing file just means "no logo," no error, no toast.
- Moved the `loadCompanyLogo()` call from raw boot into `afterRootReady()`, alongside `populateIdentitySelector()`.
- Existing PDF-export logo placement (top-left of every page, aspect-correct via `state.companyLogoW`/`companyLogoH`) is completely unchanged — just now sourced from the shared file instead of local storage.
- New `run_manufacture_itp_company_logo_readonly.js` (in `pdftest-projects`): confirms no Insert/Change/Remove button or file input exists anywhere in the DOM any more; the read-only thumbnail shows/hides correctly with and without a `company-logo.png` at the Projects root; and the exported checklist PDF still embeds the exact same logo image, aspect-correct (a real 300×150 test PNG downscales to exactly 180×90) — verified via the same `window.jspdf.jsPDF.API.addImage` interception technique used for Install ITP's own test (this bundled jsPDF build mixes `API.*` methods onto each new instance at construction time, not onto `.prototype`). This app's own pre-existing "machined" sign-off gate is seeded in the fixture the same way `run_manufacture_itp_auto_export_on_signoff.js` already does. Full suite re-run — **15/15** pass. Identical fix already shipped to Install ITP (v40); still queued for Delivery ITP, plus a brand-new read-only display for Site Measure/Viewer, Machine Schedule, Scheduler, and Solid Surface Schedule — per the standing per-app process note.

`service-worker.js` cache → `utzline-manufacture-itp-cache-v19`.

**v18 (2026-09-26):** "Go to location" zoom feel now matches UTZLINE Projects (a general note across the family, not scoped to this app). Andrew's dictation trail, same day, in order: "goto location needsd to be zoomed in even closer than it is now" → "the itp zoom works well, but needs to be closer again" → "match the other zooms to that" (briefly read as: match everything to the ITP mechanism) → superseded by his final word: "view on plan in projects is actually the perfect zoom level." So the reference is UTZLINE Projects' own feel, not this app's old one. `centrePlanOn` (the single-marker jump behind "Go to location", "Go to pin-drop location", and the marker menu) now sets `planView.scale = Math.max(planView.scale, 1)` — at least native 1:1 pixel scale, ported verbatim from Projects' `openPlanCanvasForLevel` marker-jump branch — replacing the old `fitScale * PLAN_FOCUS_ZOOM` (5x fit-to-screen) multiplier, which zoomed to a different absolute level depending on a level's own image resolution instead of a fixed pixel-for-pixel feel. `PLAN_FOCUS_ZOOM` itself is unchanged and still used as the multi-marker bounding-box zoom cap ("Go to room", a different, unaffected feature) — and this app's own machined-gate stroke logic is untouched too. `run_manufacture_itp_room_list_alpha_and_marker_menu.js` updated (its stale `fitScale*5` assertion replaced with a `>=1` native-scale check); full suite green (12 files).

`service-worker.js` cache → `utzline-manufacture-itp-cache-v18`.

**v17 (2026-09-26):** Two items land together — held from v16 specifically to ship as one consolidated version bump rather than two point releases in a row.

- **Status icon revert** (NEXT_RUN_NOTES item 2, held since the 2026-09-26 icon-sweep round): after a follow-up round of instructions ("revert machined icon to the cog" → "change the hammer to the saw" → "lets revert to the factory icon" for `in_manufacture`, after reviewing a rendered side-by-side), the final end state is a full revert of both statuses to what they were before that round. `joineryStatusIcon` and the plan-marker `joineryDisplayIcon` both updated (`in_manufacture`: 🔨 → 🏭; `machined`: 🪚 → ⚙️); no other status icon changed. The `notMachinedBanner` text ("Not yet marked Machined…") also spelled the old saw icon out literally — updated to "⚙️ Not yet marked Machined…" to match.
- **PIN-gated sign-offs** (NEXT_RUN_NOTES item 12). Andrew, verbatim: "pin entry required for sign offs. stopping anyone from randomly signing off under another users name. (delivery drivers, site managers, factory managers)." Per Andrew's own scoping for this app — "installer wont have a pin, just the site supervisor" (the same "doer" exemption applies to this app's builder role) — the **builder** sign-off stays exactly as it was (free-text name, no PIN). The **Metro Factory / Workshop Supervisor** sign-off's free-text name field is replaced by the shared name+PIN registry's own picker (a `<select>`, same registry the device identity selector already uses): picking a name immediately opens the numberpad to verify that name's own PIN before it's accepted — a wrong PIN shakes and clears for another attempt, Cancel reverts to whatever was last actually committed. Only a correctly-PIN-verified supervisor name is ever recorded on the checklist now. Nothing is removed — `isChecklistSignedOff` still requires BOTH the builder's and the supervisor's own signature, the exported PDF's sign-off block is unchanged (both roles, always), and this app's own machined-gate stroke logic (blocking a completing signature until the item has reached "machined") is completely untouched — it only cares whether a stroke is drawn, not how the name behind it was entered. The supervisor's name select is disabled along with everything else once a checklist locks (signed off). Registry names are read once per session and cached (refreshed at boot/root-pick, invalidated whenever a name is actually added) so this doesn't add a fresh `utzline-users.csv` read to every single checklist open — the PIN itself is still verified against a fresh read every time. Six Playwright test files in `pdftest-projects` updated for the new PIN flow (`run_manufacture_itp_auto_export_on_signoff.js`, `_machined_gate.js`, `_no_answer_gating_and_photos.js`, `_status_signoff.js`, `smoke_manufacture_itp_v1_e2e.js`, `smoke_manufacture_itp_v2_flat_project.js`); full 10-file suite green.

`service-worker.js` cache → `utzline-manufacture-itp-cache-v17`.

**v16 (2026-09-26):** Status icon change — Andrew, verbatim: "change in
manufacture to this 🔨 and machined to this 🪚." `joineryStatusIcon` and
the plan-marker `joineryDisplayIcon` both updated (`in_manufacture`: 🏭 →
🔨; `machined`: ⚙️ → 🪚); no other status icon changed. The
`notMachinedBanner` text ("Not yet marked Machined…") also spelled the old
gear icon out literally — updated to 🪚 to match. `service-worker.js`
cache → `utzline-manufacture-itp-cache-v16`.

**v15 (2026-09-25):** the Install ITP v26–v35 port. Andrew: "ok now rebuild the manufacturer and delivery itps to suit all these updates (relevant to their own itps.)" — everything Install ITP gained today that applies to this app, ported with the same design and the same tests; see Install ITP's own README entries v26–v35 for each item's full rationale (Andrew's tablet numbers, the "fewer calls beats smaller calls" finding, etc.). In this app:

- **Performance (Install ITP rounds 1–5).** Directory-handle cache (`getCachedDir`/`projectDir`, cleared per project, dropped on failure); **item-status index, one file per level** (`Manufacture ITP Index/<Level>.json`; flat: under `Project Saves/UTZLINE ITP/`), keyed `<Room>/<file>`, remembering never-started items as `{missing:true}`, written on every save and self-healed on every open — the Items list is cache-first and parallel with one batched backfill write; the Level Plan's ✓/✕ pass reads that index once and lists a folder only for markers it has never seen; **per-level badge cache** (`<Level> - Badges.json`, 4 h max age, one cancellable listing of Joinery Status for unresolved keys only, patched immediately by this app's own status advances); bounded, cancellable background work (`PLAN_STATUS_CONCURRENCY = 6`, cancelled the moment you leave the plan); **three-state markers** (green ✓ signed off, blue ✕ started, red ✕ not started); **last-known marker snapshot** painted instantly from the device's own IndexedDB with write-through on save; back from a checklist shows the Items list immediately, dimmed, refreshing behind the save; `perfStart` timing log (no UI). New reserved-folder map in the legacy Levels list (`Manufacture ITP Index`, `Project Saves`, `PDF Files`, every `itp-*` folder). **One thing found only here:** the machined gate (`currentItemStatusRank`) and the sign-off sync used `readJoineryStatuses` — listing and folding the *whole project's* Joinery Status folder (hundreds of named lookups on a real job) on every checklist open, every completing stroke and every tap on a signed sheet. They now fold only that one item's own event folder (`readJoineryStatusForItem`); the gate's rule, "read live every time, never cached", is unchanged. Under the Android-like mock (12 rooms / 60 markers / 400 status keys): cold background pass 4.0 s, **warm 0.1 s of file-layer time, three reads, zero folders listed**; warm marker tap 5 named lookups.
- **Save & exit, lock, buttons (v31–v32).** Checklist buttons are **Save & exit · Cancel / return to floor plan · View job note**; Export PDF and Delete this item are gone (the PDF is created by the transition into Signed off, exactly as before). After Save & exit: **Return to room / Return to floor plan / Return to start**. A signed-off checklist (this app's own rule: both signatures, no "No") opens **locked** — banner, every control disabled, button reads **Exit** (no write). The machined-gate block and banner are untouched.
- **Plan / list interaction (v31–v34).** A marker tap, long press or right-click opens the **marker menu: Open ITP · Go to pin-drop location · View job note · Cancel** (no rework here). *Go to pin-drop location* / an item row's *Go to pin* read Delivery ITP's saved `deliveryLocationPin` read-only and centre + pulse the plan on it (this app has no Delivery-locations layer; "No pin drop for … yet (set in Delivery ITP)" otherwise). **Row action buttons**: rooms → Go to location · Open room; items → Go to location · Go to pin · View job note · Open ITP (rows are divs now; tapping the row still opens). Focus zoom ≥ 5× fit. **Opening a level lands on the room list** with a **🗺 Floor plan** button (hidden for a level with no plan). **Rooms list alphabetical** (natural order). **No text selection / no context menu** on the app chrome and the plan (text fields excepted); the plan image is non-draggable. **Photo lightbox** on the checklist gallery thumbnails.
- **v35 addendum.** **One IndexedDB connection per database** (`idbConnP`/`identityConnP`): every read/write used to open a new connection and never close it — with the marker snapshot reading/writing IndexedDB on every plan visit and save that leaked dozens of connections in minutes. **Phone back button** goes back through the app (Checklist → items with the unsaved guard; Items → rooms; Floor plan → rooms; Rooms → levels; Levels → projects); an open dialog, the machined-gate block or the lightbox closes first; the after-save dialog treats back as Return to room; Projects is the base entry so back from there leaves the app as before.

**Deliberately not ported** (Install-ITP-only, per Andrew): the rework tracker and everything about it; the photo requirement for sign-off ("the add photo will be the requirement for the install itp" — this app's `isChecklistSignedOff` is unchanged); the reverted install pin-drop; the ⏱ Timings button; Delivery ITP's future delivery-pin requirement.

Tests: existing `run_manufacture_itp_*` and `smoke_manufacture_itp_*` reworked for the new flows (Save & exit + after-save dialog, marker menu, room-list landing, locked sheet — the "flag a No after sign-off" scenario now flags before the second signature; no Export PDF/Delete buttons, the PDF checked is the sign-off export). New, ported from `pdftest-itp/`: `run_manufacture_itp_item_status_index_cache.js`, `run_manufacture_itp_plan_marker_tap_latency.js`, `run_manufacture_itp_round4_android_like_fs.js`, `run_manufacture_itp_round3_back_and_dir_cache.js`, `run_manufacture_itp_room_list_alpha_and_marker_menu.js`, `run_manufacture_itp_back_button_and_idb_connections.js`. All 14 green. `service-worker.js` cache → `utzline-manufacture-itp-cache-v15`. Also in v15: the device-local marker snapshot key is prefixed with the app name ("Manufacture ITP") — all three ITP apps share the `utzline-itp-kv` IndexedDB on a device, so an un-prefixed key would have painted the Install ITP's last-known marker colours onto this app's plan until the background refresh caught up.

**v14 (2026-09-25):** autosave removed. Same change as Delivery ITP v12 (see its own README for the full writeup) — Andrew, right after the v13 crash fix above: "ok, stop the auto save. we can reimplement it later, just make sure we save on exit with a button." `markDirty()` no longer schedules `flushPendingSave()` on a 900ms debounce timer — it only sets the `dirty` flag now. The explicit **Save** button, the "Save changes before leaving?" dialog, and the `beforeunload` best-effort save already fully covered "save on exit with a button," so nothing else needed building. `flushPendingSave()` itself is unchanged. Tradeoff, accepted deliberately by Andrew as reversible: an edit between saves is now lost if the app is killed before an explicit Save, leave, or tab close — no background timer catches it within ~900ms anymore. `run_manufacture_itp_auto_export_on_signoff.js`, `run_manufacture_itp_machined_gate.js`, and `run_manufacture_itp_status_signoff.js` updated to click Save explicitly instead of waiting past the old debounce; full family-wide suite re-run clean. Same change, same day, in Delivery ITP (v12) and Install ITP (v25). `service-worker.js` cache bumped to `utzline-manufacture-itp-cache-v14`.

**v13 (2026-09-25):** crash fix — "Add photo" no longer hands off to the OS's own camera app. Same fix as Delivery ITP v11 (see its own README for the full root-cause writeup) — Andrew reported the app "crashed when taking a photo" right after v12 shipped, pointing at a fix already made in Site Measure (its own v37, 2026-09-19) for the identical symptom: `capture="environment"` on the file input launches Android's native Camera app as a separate foreground activity, backgrounding the tab; on a memory-constrained onsite tablet Android can and does kill that backgrounded tab, and the File System Access folder permission this app needs isn't persisted across the resulting reload — so the app lands back on "choose your Projects folder" mid-checklist. Ported Site Measure's fix verbatim: "Add photo" now opens a small chooser ("Take photo" — an in-page getUserMedia + `<video>` + canvas capture that never leaves the tab — or "Choose file", the existing OS picker without the forced capture attribute). Every photo still goes through the same downscale-to-JPEG pipeline as before.

**v12 (2026-09-25):** performance fix — auto-export the PDF only on the transition into "Signed off," not on every later edit. Andrew: "app is really slow on mobile onsite even working from local folder on device," investigated first on Delivery ITP (its own v10). Root cause: yesterday's v11 auto-export feature (below) re-ran `exportChecklistPdf()` — the full, synchronous, main-thread jsPDF pipeline, re-embedding every photo already attached to the item — on every single 900ms autosave for as long as the checklist stayed signed off, so any post-signoff tweak (fixing a typo in a comment, adding one more photo) froze the UI while it rebuilt. Live in all three ITP apps (Install, Delivery, this one), all added the same day, so all three got the same fix.

`flushPendingSave()` now tracks a new `state.wasSignedOffLastSave` flag (initialized in `openItem()` from the checklist's own on-disk signed-off state) and only calls `exportChecklistPdf()` when the checklist's signed-off status flips from false to true on this save — a first-time sign-off, or a re-sign-off after being knocked out of it by a "No" answer and fixed again. An edit made while it was *already* signed off no longer triggers a re-export at all; "Export PDF" still refreshes it on demand, exactly as always. This app's own "machined gate" (v9) is completely unaffected — it still blocks the signature strokes themselves before any of this runs. `run_manufacture_itp_auto_export_on_signoff.js` extended with a new step confirming an incidental Notes edit while still signed off produces no additional PDF, alongside the existing signed-off/re-signed-off transition coverage. Full suite re-run clean. `service-worker.js` cache bumped to `utzline-manufacture-itp-cache-v12`.

**v11 (2026-09-24):** auto-export the ITP PDF on sign-off — same feature as Install ITP's own v21 (part of Andrew's Joinery Item page overhaul: "once an itp is saved / completed, it automatically exports the pdf... you can then click on each relative itp here to open it," confirmed to fire "only when it reaches Signed off," not on every save). `flushPendingSave()` now checks the just-saved checklist with a new `isChecklistSignedOff(data)` helper (both `builder`/`supervisor` signatures present, no row flagged "No") right after its existing `syncJoineryStatusFromChecklist` call, and when true, calls the same `exportChecklistPdf()` the manual "Export PDF" button already uses, into the same flat `PDF Files/UTZLINE ITP/Manufacture ITP/` folder/filename convention. A later edit made while still signed off re-exports a fresh, separately-named PDF rather than overwriting the first. Chained off `flushPendingSave()`'s own promise, not fire-and-forget, for the same state-safety reason as Install ITP (`state.currentData`/`state.currentFileHandle` only ever reassign from inside `openItem()`, which itself starts with `flushPendingSave().then(...)`). This app's pre-existing "machined gate" (v9 above) is completely unaffected — it blocks the signature strokes themselves before any of this runs, exactly as before. New regression test `run_manufacture_itp_auto_export_on_signoff.js` (`pdftest-projects/`), seeding a "machined" status event ahead of the sign-off flow to clear that gate, covers the same five steps as Install ITP's equivalent test. `service-worker.js` cache bumped to `utzline-manufacture-itp-cache-v11`. Full suite re-run clean.

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
