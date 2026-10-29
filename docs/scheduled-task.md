# Weekly auto-update: scheduled task (ready to switch on)

**Status:** not yet created. The session that built v1.0.0 was blocked from creating scheduled tasks, so the definition is parked here.

| Field | Value |
|---|---|
| Task ID / name | `sacred-missions-weekly-reports` |
| Cadence | weekly, Sunday 19:57 UTC — cron `57 19 * * 0` |
| Runtime | cloud (preflight-scopes **Bucket G**, no Mac needed) |
| Model | Opus (`claude-opus-4-6`): set with `update_trigger(model=…)` straight after creating it |
| Notifications | push on finish; email to office@ only on failure / partial |
| Run record | `scheduled_task_runs` row (Supabase `ysmvklstkzodlocttspy`) |

To switch it on, ask Claude: "create the sacred-missions-weekly-reports scheduled task from docs/scheduled-task.md". Then add a row to the root CLAUDE.md chain table and the postflight tier table (tier `cloud`).

## Prompt

```
# sacred-missions-weekly-reports — add new UFO, cryptid and paranormal reports to the Sacred Missions Map

Runs weekly (Sunday 19:57 UTC). Cloud task (preflight-scopes Bucket G): no Mac, no workspace, no git. The thin-prompt preflight/postflight does NOT apply. The run record is a scheduled_task_runs row; email only on failure or anomaly.

Owner: Bryn (STUDIO side-project "STUDIO - Sacred Missions Map", repo sonorltd/sonor-sacred-missions-map). Personal project: never touch Sonor customer data.

## Data model (inline: this task can't read the repo)
- Store: the published artifact https://claude.ai/artifact/UdQ8Sz9WCEbDXTWLCPPwxT, read and written with the ArtifactData tool (load it via ToolSearch "select:ArtifactData"). Collection `reports`, one document per incident.
- Document fields: title (≤60 chars), cat (lights | craft | encounter | ghost | poltergeist | cryptid | timeslip | other), date ("YYYY", "YYYY/MM" or "YYYY/MM/DD"), place ("Landmark, Town, County"), lat, lon (5 dp, at the named place), desc (1–3 factual sentences in your own words, including any official explanation), source and url (first source), sources ([{name,url}, …] — every source), tags (from: multiple-witnesses, single-witness, police, military, pilot, radar, photo, video, official-files, physical-traces, missing-time, entity, wave, big-cat, black-dog, lake-monster, sea-serpent, wild-man, winged, livestock-kills, castle, house, church, inn, road, battlefield, prison, grey-lady, white-lady, monk, soldier, child, apparition, voices, objects-moved, investigated, open-to-visit, coast, sea, lake, moor, mountain, forest, rural, urban, explained), created and updated (epoch ms), by: "weekly-task".
- doc_id: kebab-case title (≤40 chars) plus "-YYYY" when the year is known.

## Task
1. Read every existing document: ArtifactData list on `reports`, limit 1000, paging with the cursor.
2. Search the web for reports first published in the last 10 days: UFOs / strange lights, big cats and other cryptids, ghosts, poltergeists, time slips in the UK, Ireland and the Isle of Man. Priority: North Wales, Cheshire, Wirral/Merseyside, Lancashire, Yorkshire coast, then everywhere else. Sources: North Wales Live / Daily Post, the Leader, Cheshire Live, Liverpool Echo, Wirral Globe, Yorkshire Post, Hull Daily Mail, Bridlington Free Press, BBC regional, The Scotsman, Irish Times. Fetch every page used. Never invent a report or URL.
3. Skip Paul Sinclair's Truth Proof reports (own tab, built from the repo); just list any new report numbers at https://truthproof.uk/Reports2/ForumReports2.html in the run summary.
4. De-duplicate: same incident (same category, within ~1.5 km, same year/overlapping dates, or obviously the same story) → append the new source to `sources` and merge tags with ArtifactData update + if_version. Otherwise create with set. At most 25 new documents per run, one ArtifactData batch where possible.
5. Record the run (execute_sql on ysmvklstkzodlocttspy): insert into scheduled_task_runs (task_id, ran_at, outcome, summary, metadata) values ('sacred-missions-weekly-reports', now(), '<success|partial|failure>', '<one line: N new, M merged, top places>', '<{"new":[ids],"merged":[ids],"truthproof_new":[…]}>').
6. Only on partial or failure: POST https://ysmvklstkzodlocttspy.supabase.co/functions/v1/send-email (header apikey = anon key from get_publishable_keys) with {to:"office@sonor.co.uk", subject:"[Sonor] sacred-missions-weekly-reports — FAILED: <reason>" (or "— PARTIAL: <reason>"), html:"<short explanation + next step>"}. No email on clean success.
```
