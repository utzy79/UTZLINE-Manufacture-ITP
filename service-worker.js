// UTZLINE Manufacture ITP offline service worker.
//
// This is a SEPARATE, independently-installable app in the same family as
// UTZLINE Site Measure (the editor), UTZLINE Viewer (the read-only
// browser), and UTZLINE ITP -- which, per UTZLINE Data Standard v1's
// 2026-09-21 pipeline clarification, is now specifically the INSTALL-stage
// ITP app. This app is its sibling, the MANUFACTURE-stage one, forked
// directly from the Install ITP codebase (decision #14: the two stages
// become two separate installable apps, matching their two different
// real-world users -- factory manager vs. onsite site manager) with its
// own manifest, own icon (purple, to tell it apart from Install ITP's
// green, Site Measure's orange, and the Viewer's blue), own taskbar/
// Start-menu entry, own cache namespace ("utzline-manufacture-itp-cache-*",
// never sharing a name with any of the other apps even though all of them
// can be installed side by side on the same machine). It reads the SAME
// Projects folder structure (project/level/room, the same reserved
// saves/pdfs/backup convention) and writes its own project-wide
// "itp-manufacture" folder alongside a project's level folders -- a
// sibling of, and never colliding with, Install ITP's own "itp" folder.
// See index.html's own top-of-file comment for the full data-format
// rationale.
//
// Same cache-first app shell strategy as the other apps: a small, fixed
// set of local files, no CDN calls once installed. Bump CACHE_NAME
// whenever index.html or any vendored asset changes, so installed copies
// pick up the update instead of serving stale files forever.
//
// (v1, 2026-09-22: first release. Forked from UTZLINE ITP v7 (now Install
// ITP) with: Andrew's own Metro Joinery "PRE DELIVERY - CHECKLIST" template
// (17 pre-dispatch quality-check rows) replacing the 16-row install
// checklist; sign-off roles relabelled "Joinery Builder" and "Metro
// Factory / Workshop Supervisor" (was "Subcontractor Rep. (Joinery
// Installer)" / "Metro Site Supervisor"); its own project-wide
// "itp-manufacture" data folder, kept fully separate from Install ITP's
// "itp" so the two stages' checklists for the same joinery item never
// collide; a purple icon/accent identity; and the same shared device-
// identity ("Set your name") and PDF export/signature-pad machinery
// carried over unchanged. Site Measure/Viewer's own level list, and
// Install ITP's own level list, were both updated to also exclude
// "itp-manufacture" by name, the same way they already excluded "itp".)
//
// v2, 2026-09-22 (same day): flat-project support, mirroring Install ITP
// v9 -- a project created by UTZLINE Projects v9+ (Project Saves/Floor
// Plans/, joinery-items.json, no real Level/Room folders) now works here
// too: Levels/Rooms read from those files, the joinery-item list built
// from joinery-items.json ("+ New Joinery Item" hidden -- only UTZLINE
// Projects creates items), and this app's own flat-project checklist/PDF
// data lives in Project Saves/UTZLINE ITP/Manufacture ITP/ and PDF Files/
// UTZLINE ITP/Manufacture ITP/. Unlike Install ITP, this app's own
// "itp-manufacture" folder name is unchanged -- it was never ambiguous, so
// there's no rename/migration step here; this app's own level-list
// exclusion now additionally excludes Install ITP's renamed "itp-install"
// folder alongside its existing "itp"/"itp-manufacture" exclusions. A
// LEGACY (folder-based) project's behaviour is otherwise unchanged.

// v3, 2026-09-23: mirrors Install ITP v10. This app's checklist sign-off
// now auto-advances the shared joinery-status.json record (project root,
// a sibling of joinery-items.json, works in both flat and legacy projects)
// forward to "manufactured" the moment both signoff.builder and
// signoff.supervisor are filled in -- on every autosave/explicit save
// (flushPendingSave), and retroactively the next time an already-signed
// checklist from before this existed is opened (openItem). Status is
// forward-only (never demoted by anything, including a later re-open of
// an already-"installed" item). The shared status badge (📏 site measured
// / 📦 manufactured / 🏆 installed) now renders on this app's own Level
// Plan markers too, alongside its existing ✓/✕ checklist-complete
// indicator (a separate, unrelated signal, unchanged). Also adds a "View
// job note" button to the checklist screen, listing whatever PDFs Site
// Measure or the Viewer have attached to this joinery item under its own
// "Project Saves/Job Notes/<key>/" folder (read-only here; this app never
// writes a job note itself). Per Andrew: "we also need on the right click
// menu, a mark as check measured button, this also changes the red dot...
// (manufacture itp signed off)". New regression test
// run_manufacture_itp_status_signoff.js drives a REAL sign-off through
// this app's own checklist screen (actual name fields, actual drawn
// signatures via pointer events on both sig-canvas pads, not a simulated
// call) and confirms this app's own flushPendingSave/openItem wiring
// writes the correct "manufactured" record to disk -- including the
// backfill case, where a checklist signed off before this feature existed
// picks up its status the moment it's next opened with no edit at all.
// Full cross-app regression suite re-run clean afterward.
//
// v4, 2026-09-23 (same day): two more pipeline stages (Andrew, on UTZLINE
// Projects' Joinery Register). Opening this app's own checklist at all --
// signed or not -- now forward-advances the shared status to
// "in_manufacture" (new: a factory worker has started this item); a fully
// signed checklist still advances to "manufactured" exactly as before,
// which UTZLINE Projects' Register now displays as "Ready to dispatch"
// (Andrew confirmed this stage is "already there and comes from the
// manufacture itp being completed" -- only its label changed, not its
// trigger). A third new stage, "delivered", is reserved in the shared rank
// table for a future Delivery ITP app -- this app writes neither it nor
// anything past its own "manufactured". Every forward transition this app
// writes now also appends a {status, at, by} entry to the record's own
// `history` array (attributed to the real device identity when one's set,
// falling back to the app name as before), backfilling one entry for a
// record saved before that field existed -- feeds the Register's own
// status-history hover.
//
// v8, 2026-09-23: Andrew, verbatim, on the exported PDF's photos: "change
// it from a3 to a4 portrait. All collated nicely per page. All to be date
// and time stamped with users name also." The trailing photo-grid page(s)
// (previously A3 landscape, 3x2) are now A4 portrait, 2x3, matching the
// rest of the document's own page size for the first time -- each photo
// now shows a date/time + uploader-name caption underneath it
// (formatPdfImageStamp), sourced from a new `addedBy` field stamped onto a
// photo the moment it's added (deviceUserName at add-time, not
// export-time) alongside its existing `addedAt`. A photo added before this
// release has no addedBy on file and simply shows its date/time alone,
// never a blank or "undefined" name.
//
// v9, 2026-09-23 (same day): Andrew, verbatim: "Manufacture status needs to
// be split up into 2 parts. We need a machined and a manufactured tab. All
// traceable by user name. Machined to have its own app. Called machine
// schedule. This is where the machinist can mark off a joinery item as
// complete. It will add their name and date time to the system." The shared
// joinery-status.json pipeline gains a new stage, "machined" (rank 3,
// between "in_manufacture" and "manufactured", which -- along with
// "delivered"/"installed" -- all shift up one rank to make room). This app
// never writes "machined" itself; that's set exclusively by the new sibling
// app, UTZLINE Machine Schedule, straight into the same shared file. What
// THIS app gets is a new, real, user-facing precondition on its own
// sign-off: the checklist can no longer be signed off as "manufactured"
// until the item has ALREADY reached "machined". Enforced right at the sign
// action itself -- the signature pads' own onStroke handlers block and
// revert the exact stroke that would otherwise complete both signatures
// (and the checklist rows' own tri-state buttons show the same message if
// fixing the last row flagged "No" is what would complete it instead),
// showing a clear on-screen "This item hasn't been marked Machined yet..."
// message pointing at the new app -- plus a defense-in-depth re-check
// inside syncJoineryStatusFromChecklist itself (the only place that ever
// writes "manufactured"), so even the pre-existing-signed-checklist
// backfill path on open can't slip past it. A small, unobtrusive
// "⚙️ Not yet marked Machined" banner shows on the checklist screen itself
// whenever this applies, so an operator isn't surprised only at the moment
// they try to sign -- no other new UI, no new tab/section, per Andrew's own
// "otherwise stay as-is" for this app. syncInManufactureOnOpen and the
// "in_manufacture" write it makes on every checklist open are UNCHANGED.
// New regression test run_manufacture_itp_machined_gate.js covers both the
// block (not yet machined) and the success path (already machined) through
// the real checklist screen; run_manufacture_itp_no_answer_gating_and_
// photos.js and run_manufacture_itp_status_signoff.js both updated to seed
// a "machined" record ahead of their own sign-off flows, an expected
// consequence of this gate rather than a regression.
// v17 (2026-09-26): Two items land together (per the standing "one version
// bump, not a tiny point release" precedent -- the icon fix was code-
// complete and held since v16 specifically to ship with this one).
// (a) Status icon revert (NEXT_RUN_NOTES item 2, held from the 2026-09-26
// icon-sweep round): `joineryStatusIcon`/`joineryDisplayIcon`'s `machined`
// (🪚 → ⚙️) and `in_manufacture` (🔨 → 🏭) cases reverted to what they were
// before that round, and `notMachinedBanner`'s own live text (which spelled
// the old saw icon out literally) updated to match ("⚙️ Not yet marked
// Machined…"). (b) PIN-gated sign-offs (NEXT_RUN_NOTES item 12) -- Andrew,
// verbatim: "pin entry required for sign offs. stopping anyone from
// randomly signing off under another users name." Per Andrew's own scoping
// for this app -- the "doer" role doesn't get a PIN -- the builder sign-off
// stays exactly as it was (free-text name, no PIN). The Metro Factory /
// Workshop Supervisor sign-off's free-text name field is replaced by the
// shared name+PIN registry's own picker (same mechanism as Install ITP v38 /
// Delivery ITP v17): picking a name opens the numberpad, verified against
// that name's own PIN before it's accepted; wrong PIN shakes and clears,
// Cancel/wrong-PIN revert to whatever was last actually committed. Nothing
// is removed -- both signatures are still required to sign off, and the
// machined-gate stroke logic (unique to this app) is untouched. Registry
// names are cached in memory for the same reason as the sibling apps (a
// checklist open/render is a hot path here too). Six Playwright test files
// in pdftest-projects updated for the new PIN flow (run_manufacture_itp_
// auto_export_on_signoff.js, _machined_gate.js, _no_answer_gating_and_
// photos.js, _status_signoff.js, smoke_manufacture_itp_v1_e2e.js,
// smoke_manufacture_itp_v2_flat_project.js); full 10-file suite green.
// v18 (2026-09-26): "Go to location"/"Go to pin" zoom feel now matches
// UTZLINE Projects (general note, not scoped to one app) -- Andrew's own
// final word after a dictation trail: "view on plan in projects is
// actually the perfect zoom level." centrePlanOn's single-marker jump now
// uses Projects' own Math.max(planView.scale, 1) (at least native 1:1
// pixel scale), replacing the old fitScale*5 multiplier, which zoomed to a
// different absolute level depending on a level's own image resolution.
// PLAN_FOCUS_ZOOM is kept as the multi-marker bounding-box zoom CAP (the
// "Go to room" case, a different feature) -- untouched.
// run_manufacture_itp_room_list_alpha_and_marker_menu.js updated (stale
// fitScale*5 assertion replaced with a >=1 native-scale check); full
// 12-file suite green.
// v19 (2026-09-27): company logo (general note, not scoped to one app) --
// Andrew, verbatim: "change company logo should only be visable in the
// projects app, in every other app it should load the one chosen in
// projects." This app's own per-device Insert/Change/Remove logo UI
// (IndexedDB-backed) is gone; the Projects screen now shows a READ-ONLY
// thumbnail sourced from the shared "company-logo.png" file UTZLINE
// Projects owns, at the Projects root (the same root utzline-users.csv
// already comes from) -- no write path, no device-local copy any more.
// Existing PDF-export logo placement (top-left of every page, aspect-
// correct) is unchanged, just now sourced from the shared file instead of
// local storage. Covered by the new
// run_manufacture_itp_company_logo_readonly.js; full suite green (15/15).
// v20 (2026-09-27): "Sub orders" on the checklist screen -- Andrew,
// verbatim: "ok now we need all joinery summary pages to show the
// associated orders. with the option to mark them as recieved. the main
// schedule also needs a mark as received button for orders. on the
// schedule." New section reading UTZLINE Sub Orders' own
// Project Saves/UTZLINE Sub Orders/Orders/<Level> - <Room> - <Joinery
// Item>.json, grouped by type (fixed steel/upholstery/timber/aluminium
// order, then custom types alphabetically, each a coloured chip -- a
// custom type gets one neutral chip, never a guessed-at colour), openable
// (its own file, via Sub Orders' Files/ folder), with a per-order
// "Received" checkbox + date that writes back into that same Orders/
// file -- read-modify-write, one order at a time, rebuilt via a shallow
// copy (never an explicit field allowlist, the exact bug just fixed in
// Sub Orders' own setOrderReceived, v5, same day). Strictly read-only in
// Sub Orders' Inbox/ and Files/ folders. See index.html's own
// readSubOrdersForItem/renderSubOrdersSection comments for the full
// design. New run_manufacture_itp_sub_orders.js; full suite green.
var ICON_VERSION = "v1";
// v21 (2026-09-27): "Schedule Backups" folder hidden from the project list.
// v22 (2026-09-29): RC 1.0 -- the version is shown as RC 1.0, with a small "RC 1.0" tag on the logo.
// v23 (2026-09-29): RC 1.0 -- "Projects on this device": pick the jobs this device works on; sync help; get ready for offline.
// v24 (2026-09-29): RC 1.0 -- 🏭 for a job note too; every save retried + checked; no "still syncing?" guesses.
// v25 (2026-09-29): RC 1.0 -- every checklist save also writes its own change file; opening reads them back (two tablets saving offline both keep their changes).
// v26 (2026-09-30): RC 1.0 -- "Get ready for offline" is a quick check on an Android tablet (the sync app already keeps every file here); "Open every file (slow)" still does the full one.
// v27 (2026-09-30): RC 1.0 -- event layout v2: status / schedule / cut / completion / cutting file / note records are one folder per LEVEL (Project Saves/UTZLINE Events/<branch>/<Level>/); old per-item folders are still read. PDF libraries load on first use.
// v28 (2026-09-30): RC 1.0 -- sign in on open (tablets / phones), change-folder button.
// v29 (2026-09-30): RC 1.0 -- day / night mode, the room in the marker menu, the builder's logo on the level heading and the checklist PDF.
// v30 (2026-10-01): RC 1.0 -- Scan QR code + the item link from the Viewer's floor plan export
// v31 (2026-10-01): RC 1.0 -- Windows' 260-character path limit: shorter record names in the event store (see README)
var CACHE_NAME = "utzline-manufacture-itp-cache-v31";

var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json?v=" + ICON_VERSION,
  "./jspdf.umd.min.js",
  "./jsqr.min.js",
  "./sans.woff2",
  "./mono.woff2",
  "./icons/icon-192.png?v=" + ICON_VERSION,
  "./icons/icon-512.png?v=" + ICON_VERSION,
  "./icons/icon-192-maskable.png?v=" + ICON_VERSION,
  "./icons/icon-512-maskable.png?v=" + ICON_VERSION
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(PRECACHE_URLS);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; })
             .map(function(n){ return caches.delete(n); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event){
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var networkFetch = fetch(event.request).then(function(response){
        if (response && response.status === 200){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){
        return cached;
      });
      // Cache-first for instant offline loads; refresh the cache in the
      // background whenever the network is available.
      return cached || networkFetch;
    })
  );
});
