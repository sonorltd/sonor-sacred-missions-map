# STUDIO - Sacred Missions Map (v1.5.0)

> Repo: `sonor-sacred-missions-map` · Pages: https://sonorltd.github.io/sonor-sacred-missions-map/ · Live (claude.ai artifact, with saved data): https://claude.ai/artifact/UdQ8Sz9WCEbDXTWLCPPwxT
> Type: side-project, island-ok. Personal exploration project under STUDIO, created 2026-10-28. **Not Sonor Smart Homes work**: no Sonor customer data, no Sonor branding.

Bryn's map of places to visit and things to look into: holy wells, waterfalls, standing stones and circles, caves, hill forts, folklore places, springs, ley lines (major lines incl. the Belinus Line / *Spine of Albion*, plus minor leys, energy lines and astronomical alignments), Paul Sinclair's Truth Proof reports, and a growing, tagged UFO / cryptid / paranormal collection. Measured from home in Mold (Flintshire).

## Two builds, one source

| Build | File | Data | Used for |
|---|---|---|---|
| **Artifact** | `dist/artifact.html` | Reports, marks, notes, photos and trips live in the artifact's own database (capabilities `db`, `user`, `assets`) | The live map Bryn uses and shares (claude.ai link). Republish this file to the same artifact URL. |
| **Pages** | `index.html` | Reports baked from `data/reports.json` (snapshot); marks kept in the browser only | Public mirror on GitHub Pages. Read-only collection. |

Build both: `python3 tools/build.py` (standard library only, runs on the Mac).

## Layout

```
src/template.html   page shell, styles, SVG symbols (one theme: OS-antiquity map, light + dark)
src/app.js          all app logic; placeholders __SITES__ __SINCLAIR__ __LEYS_EXTRA__ __SITES_X__ __SINC_X__ __COLLECTION__ __PARA_SUB__ filled by the build
data/sites.js       SITES (hand-curated places) + LEYS (the four major lines)
data/sites_x.json   extra places from research (holy wells, NW sites): [name, cat, region, lat, lon, desc, sourceUrl]
data/leys_extra.json minor / energy / astronomical alignments with ordered stops
data/sinclair.js    SINCLAIR rows from the Truth Proof index; data/sinc_x.json = per-report refinements (category, place, coords, summary, tags) from reading each page
data/reports.json   snapshot of the artifact's `reports` collection for the public Pages build. Personal accounts (`by: "bryn"` or source "Personal account…") are left out of it and stay only in the private live copy.
data/sites_manual.json  places added by hand on request (e.g. Llyn Brianne) — merged into sites_x.json by the data step
data/shapes.json    simplified coastlines (GB, IE, IoM), made by tools/coastline.js from world-atlas
research/           raw research pulls (every record has its source URL)
research/raw/       every raw pull from the build sessions (Wikipedia, TNA, Wikidata, Sinclair source pages)
tools/              build + data scripts
```

## Missions Archive (master)
Cases, sources, Mysterious Universe episodes and cross-links now live in **STUDIO - Missions Archive** (Sonor Supabase `arc_*`). This map is a consumer: matched MU episodes are written onto the artifact `reports` docs as `mu: [{show,no,title,url,date,plus,excerpt}]` (excerpt = only the part about that case) and into `data/reports.json` for Pages. The artifact sandbox cannot fetch, so Claude runs the sync on request. Cross-links: `python3 tools/export_xlinks.py` (anon key from the synced `sonor-db.js`) → `data/xlinks.json` (entities, case→entity, case↔case, entity→MU episodes), baked as `__XLINKS__`; re-run it after archive link changes, then `tools/build.py` and republish.

## Data model (artifact database)

- `reports/{id}` — one per incident: `title, cat (lights|craft|encounter|ghost|poltergeist|cryptid|timeslip|other), date, place, lat, lon, desc, source, url, sources[{name,url}], tags[], created, updated, by?`. Duplicates from several sources are merged into one doc with every source in `sources`.
- `data/users/{uid}/marks` — per person: `m{ key: {s:1 star, t:1 to-visit, v:"YYYY-MM-DD" visited, n:"notes", ph:[assetId…]} }, trips[{name,start,stops[],round,saved}]`. Keys: `s:<site-slug>`, `p:<sinclair no>`, `r:<report id>`.
- Photos: artifact asset store (`assets` capability, editors only); shown from `/_blob/<id>`.

## Tabs
Tabs: Sacred sites · Sinclair · UFO · Ghosts · Cryptids · Strange (one per category group from `data/cat_groups.json`, synced from the archive's `arc_categories` kind `case-group`) · Ritual (occult & ritual sites) · MU (places with Mysterious Universe episodes, own MU marker) · ★ Starred (everything starred; `data/default_stars.json` stars Llyn Brianne by default) · Sky · Road trip · Everything (all reports; old `#paranormal` links land here).
Every report card (UFO & paranormal, MU, Ritual, Sinclair) has **Connections** — *Part of* archive entities (click = filter every report tab to that entity, banner with its MU episodes), *Related cases*, *Same MU episode*, *Nearby within 5 mi* — numbered sources with kind badges and an *Evidence* line. **Hotspots**: kernel-density heat (2-mi grid, 4-mi Gaussian), top-10 peak clusters with a hotspot card; *All layers* combines UFO, ritual and Sinclair.
Sacred sites (leys-only toggle, ley-kind chips, alignment checker, "find alignments through here") · Paul Sinclair (hotspots) · UFO & paranormal (tags, hotspots, add/edit) · Sky (solstices, equinoxes, fire festivals, moon phases, meteor showers, aligned sites + solstice rays, this weekend) · Road trip (planner, Google Maps hand-off, saved trips, visit log). Filters on every tab: region, distance from home, status (star / to visit / visited), era, near a ley line, sort.

## Spine version + compliance
- **Spine version:** n/a — exempt, same isolation class as the other `STUDIO - *` side-projects (`workspace-apps.tsv`: `type=side-project, isolation=island-ok`). Not a Sonor browser app: no sonor-db.js, no shared header, no sonor-kit; its data lives in the claude.ai artifact's own database, not Supabase.
- If it ever needs Sonor-family data, it goes through Supabase tables with a `studio_` prefix (Studio Hub's family), never a new island.

## Shared seams consumed
- None from the Sonor family on purpose (personal project). Coastlines from the public `world-atlas` package (`tools/coastline.js`).

## Upstream / downstream data flows
- **In:** research pulls (`research/*.json`, every record with its source URL) → `data/` via the data step; the artifact's `reports` collection (written by Bryn in the app, or by Claude on request — no scheduled task, by choice 2026-10-29).
- **Out:** `dist/artifact.html` → republished to the claude.ai artifact; `index.html` → GitHub Pages; `data/reports.json` snapshot of the collection for Pages.

## Feature timeline
See `CHANGELOG.md` (v0.1.0 → v1.0.0, 2026-10-28/29).

## App-specific rules
- Every research record keeps its source URL; no invented places or reports.
- Personal accounts never go into the public snapshot or Pages build.
- Reports are de-duplicated by incident: extra sources are appended to `sources`, not added as new reports.

## Brand overrides
Own palette (OS antiquity map): IM Fell English / IM Fell English SC + Alegreya Sans, sage-paper light theme and dark theme. Deviates from GRAPHITE-FIRST on purpose: personal side-project, not a Sonor staff app. Borders stay muted grey-green, never white.

## Limits (artifact sandbox)
No external fetch, map tiles or geolocation in the artifact, so trip times are straight-line estimates (×1.3 road factor, 38 mph) and there's no "near me". Sky dates are computed in-page (good to about a day).

## Refreshing `data/reports.json`
Ask Claude: "snapshot the Sacred Missions reports into the repo" (ArtifactData list on `reports` → write `data/reports.json` → `python3 tools/build.py`).
