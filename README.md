# Sacred Missions Map

A personal map of places to go and things to look into across Wales, England, Scotland, Ireland and the Isle of Man: holy wells, waterfalls, standing stones and circles, caves, hill forts, folklore places and springs; ley lines from the Belinus Line to minor alignments; Paul Sinclair's Truth Proof reports; and a tagged, sourced collection of UFO, cryptid and paranormal reports. Plus a sky calendar, an alignment finder and a road-trip planner.

- **Live copy (with saved marks, notes, photos and the growing collection):** https://claude.ai/artifact/UdQ8Sz9WCEbDXTWLCPPwxT
- **Public mirror:** https://apps.sonor.co.uk/sonor-sacred-missions-map/

## Build

```bash
python3 tools/build.py    # writes index.html (Pages) and dist/artifact.html (claude.ai copy)
```

Everything is in `data/` (places, leys, reports) and `src/` (page + app). Research pulls with their sources are in `research/`. See `CLAUDE.md` for the data model and conventions.

Ley lines are proposed alignments traced by researchers and dowsers, not archaeological fact. Reports are claims as reported, each linked to its source.
