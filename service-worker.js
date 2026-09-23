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
var ICON_VERSION = "v1";
var CACHE_NAME = "utzline-manufacture-itp-cache-v5";

var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json?v=" + ICON_VERSION,
  "./jspdf.umd.min.js",
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
