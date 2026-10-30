# Changelog

## v1.5.0 — 2026-10-30
- **Connections on every card** (UFO & paranormal, MU, Ritual and Sinclair): *Part of* chips for the archive entities a case belongs to (waves, themes, places, people — e.g. Pendle witches, Hellfire Clubs, the 1963 black-magic scare, British big cats, time slips), *Related cases* from the archive's case-to-case links, *Same Mysterious Universe episode* (every other place that episode covers), and *Nearby cases within 5 mi* across reports and Sinclair. Every entry is clickable.
- **Entity filter**: click a *Part of* chip to show only that entity's cases on every report tab, with a banner holding its summary and its Mysterious Universe episodes (with the episode excerpt). "Show everything again" clears it; Clear filters does too.
- **Hotspots v2**: smooth kernel-density heat (2-mile grid, 4-mile Gaussian) instead of 6-mile squares; clusters found from density peaks (cases within 6 mi, at least 3); top 10 listed with category mix, year span, MU episode count, leys through it and sacred sites inside. Clicking a hotspot opens a card listing every case by category (clickable) plus the sacred sites inside, and fits the map. New **All layers** chip combines UFO, ritual and Sinclair reports in one heat map.
- **Referencing**: sources numbered with a kind badge (podcast / news / official & archive / book / research site / Wikipedia / web), plus an *Evidence* line summarising source kinds, MU episodes and strong-evidence tags (police, military, pilot, radar, official files, photo, video, physical traces, multiple witnesses).
- **Category tabs**: "UFO & paranormal" is split into **UFO** (lights, craft, close encounters) · **Ghosts** (ghosts, poltergeists) · **Cryptids** · **Strange** (time slips, other), then Ritual · MU, with **Everything** (all reports) as the last tab. Groups come from the archive (`arc_categories` kind `case-group`, synced to `data/cat_groups.json` by `tools/export_xlinks.py`); old `#paranormal` links open Everything.
- **★ Starred tab**: everything you've starred (sacred sites, Sinclair, reports) on one map, nearest first. Llyn Brianne is starred by default (`data/default_stars.json`); unstarring it sticks.
- **Sacred site cards** list the cases within 10 mi (clickable).
- **Llyn Brianne, deeper**: no MU episode or published report names it; site text now covers the 1973 opening, the Nant y Bryniau name, drowned Fanog farm, Soar-y-Mynydd clay and the dark-sky status. New *Upper Tywi & Llyn Brianne* place group links the 14 cases within 12 mi. Five Welsh wolf-like cases added (Wolfman of Merionethshire, Tonmawr bipedal dog, Amman Valley "wolfman" (explained), Craig-y-Don/Penrhyn Bay grey animal 2004, Denbigh–Wrexham road beast 1790), all under *Werewolves, dogmen & wolf-like humanoids*. Research in `research/brianne_deeper.json`.
- Cross-links come from the Missions Archive: `tools/export_xlinks.py` writes `data/xlinks.json` (entities, case→entity, case↔case, entity→episodes), baked in as `__XLINKS__` by the build.

## v1.4.0 — 2026-10-29
- **Mysterious Universe, fully researched**: all 1,307 episodes read (titles, show notes and every show-notes link title; thin early notes checked on the episode pages) — 142 places now carry their MU episodes (52 existing cases + 90 new places MU covered, e.g. Gef the talking mongoose, Stocksbridge bypass, the Hexham Heads, Llanilar debris, Stonehenge, Avebury, Morgawr, Woolpit, the Green Stone, the Fife incident). Bare episode titles now carry a topic ("19.05 · The Welsh Triangle"); link-only matches are labelled "named in the show-notes links".
- **Ritual tab, in depth**: 36 sites rewritten with fuller accounts, resolutions and extra sources, 13 estimated pins checked; 57 new sites (19 in Wales — Dyserth, Llanasa, Penley, Caerwys, the Wern Wen curse beam, Gloddaeth Hall, the Conwy-area 1987–91 cases, the Swansea Devil; Chester's Gallows Hill, Wildboarclough, Samlesbury, Wigan; Scottish witch sites; Irish Hellfire Clubs; Gardner, Dion Fortune and Crowley sites). Grouped as Witch trials & executions · Witchcraft & folk magic · Black magic, desecrations & ritual finds · Curses & cursing wells · Hellfire Clubs, Crowley & occult orders · Modern witchcraft & Wicca.

## v1.3.0 — 2026-10-29
- **MU tab**: every place with a Mysterious Universe episode, on its own teal "MU" marker; group by episode to see every place an episode covers; each card shows the episodes and the case-only show notes.
- **Ritual tab**: the 49 occult & ritual sites plus anything tagged satanic / black magic / occult / desecration / witchcraft / witch trial, grouped into Black magic & desecrations, Hellfire Clubs & Crowley, Witchcraft & witch trials, Other. Ritual sites leave the UFO & paranormal tab. The ritual marker is now a filled crimson disc with a pentagram.
- "Paul Sinclair" tab renamed **Sinclair**.
- Fix: list, chip and card icons were clipped to a quarter (the `<use>` box started at the centre); they now show in full.

## v1.2.0 — 2026-10-29
- **Sharper filters** on the Paul Sinclair and UFO & paranormal tabs: area (county / town, with counts), sources (on Mysterious Universe, several sources, single source, unconfirmed leads, personal accounts), tags grouped into Witnesses / Evidence / What was seen / Occult & folklore / Setting / Visiting with a collapsible panel and an Any / All switch. Tag groups come from `data/tag_groups.json` (same groups as the archive's `arc_tags.grp`).
- **New category: Occult & ritual sites** (pentagram marker) with 49 places — black-magic church desecrations (Clophill 1963, the North Wales churches 1987–91), Hellfire Club sites, Crowley's Boleskine, witch-trial places in Wales and Lancashire, ritual finds on Cannock Chase, Dartmoor and the New Forest. Coordinates checked against OpenStreetMap.
- Love Street, Chester logged as an unconfirmed lead.

## v1.1.0 — 2026-10-29
- **Mysterious Universe on report cards**: a matched report shows the MU episodes that cover it, each with only the part of the show notes about that case (and the show-notes links that name it), from the new Missions Archive.
- **Reports**: 35 around Llyn Brianne / the upper Tywi, Tregaron, Strata Florida and Nanteos; 36 from the 1977 Dyfed (Welsh) Triangle wave — Haven Fort Hotel and Stack Rocks, Ripperston Farm, Herbrandston, Milford Haven — with the MU "Welsh Triangle" episode attached; Heol Fanog; the Dodleston messages write-up expanded.

## v1.0.0 — 2026-10-29
First release as a proper STUDIO repo (`sonor-sacred-missions-map`, GitHub Pages) with the live copy on claude.ai.
- **Repo**: `src/` + `data/` + `research/` + `tools/build.py` → `index.html` (Pages) and `dist/artifact.html` (claude.ai live copy).
- **Sky tab**: solstices, equinoxes, cross-quarter fire festivals (Welsh names), full moons (named), new moons, meteor showers, the next 12 months; this weekend's moon and Mold sunrise/sunset; sites aligned to the sun and moon with next dates and solstice rays drawn on the map; astronomical alignments listed.
- **Visit log**: notes and photos on any place (photos in the artifact's asset store); visit log list on the Road trip tab.
- **Hotspots**: heat layer and top-8 clusters on the Paul Sinclair and UFO & paranormal tabs, with ley lines through each cluster named.
- **Alignment finder**: "Check an alignment" (tap 3+ places → best-fit line, widest miss, length, bearing, verdict) and "Find alignments through here" on every site card (lines with 3+ other places within 250 m, 40 mi radius).
- **Holy wells**: 482 added (244 Welsh from Coflein; 238 across England, Scotland, Ireland and the Isle of Man), plus Llyn Brianne and Twm Siôn Cati's Cave.
- **Paul Sinclair**: every report re-read; category, exact place, coordinates, summary and tags refined; report links fixed (all now `truthproof.uk/Reports2/`).
- **Reports**: Wirral / Merseyside / Chester reports added; 69 pins corrected against OpenStreetMap (55 sites, 14 reports).

## v0.5.0 — 2026-10-28
Road trip planner, star / to visit / visited marks synced per person, merged multi-source reports, full-map default view, leys-only and ley toggles, 25 minor ley lines in their own colours.

## v0.4.0 — 2026-10-28
364 sourced UFO / cryptid / paranormal reports, tags, filter bar (region, distance, era, near a ley line, sort) on every tab.

## v0.3.0 — 2026-10-28
Tabs: Sacred sites, Paul Sinclair (293 Truth Proof reports), UFO & paranormal collection (saved in the artifact database). Yorkshire and east coast sites.

## v0.2.0 — 2026-10-28
Caves, hill forts, ley lines (Belinus Line from *The Spine of Albion*, St Michael Line, Old Sarum ley, Arbor Low–Caernarfon).

## v0.1.0 — 2026-10-28
First map: holy wells, waterfalls, standing stones, folklore places and springs, starting in North Wales.
