#!/usr/bin/env python3
"""Export cross-links from the Missions Archive (Sonor Supabase arc_* tables) into data/xlinks.json,
which tools/build.py bakes into both builds. Run before building whenever the archive's links change.
The anon key is read from the workspace sonor-db.js (nothing hard-coded)."""
import json, os, re, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cands = [os.path.join(ROOT, "..", "sonor-db.js"), os.path.join(ROOT, "..", "STUDIO - Missions Archive", "sonor-db.js"), "/home/claude/arcapp/sonor-db.js"]
db = open(next(p for p in cands if os.path.exists(p))).read()
URL = re.search(r"SONOR_SUPABASE_URL\s*=\s*'([^']+)'", db).group(1); KEY = re.search(r"SONOR_SUPABASE_ANON\s*=\s*'([^']+)'", db).group(1)
def get(path):
    out, off = [], 0
    while True:
        r = urllib.request.Request(f"{URL}/rest/v1/{path}&limit=1000&offset={off}", headers={"apikey": KEY, "Authorization": "Bearer " + KEY})
        page = json.load(urllib.request.urlopen(r, timeout=60)); out += page; off += 1000
        if len(page) < 1000: return out
rels = {r["key"]: r for r in get("arc_relations?select=key,label,inverse_label")}
ents = {e["id"]: {"n": e["name"], "k": e["kind"], "s": (e.get("summary") or "")[:240]} for e in get("arc_entities?select=id,name,kind,summary")}
links = get("arc_links?select=a_type,a_id,b_type,b_id,relation,note&confidence=gt.0&or=(a_type.eq.case,b_type.eq.case)")
ce, cc = {}, {}
for l in links:
    if l["a_type"] == "case" and l["b_type"] == "entity": ce.setdefault(l["a_id"], []).append(l["b_id"])
    elif l["b_type"] == "case" and l["a_type"] == "entity": ce.setdefault(l["b_id"], []).append(l["a_id"])
    elif l["a_type"] == "case" and l["b_type"] == "case":
        r = rels.get(l["relation"], {}); lab = (l.get("note") or r.get("label") or l["relation"])
        cc.setdefault(l["a_id"], []).append([l["b_id"], lab]); cc.setdefault(l["b_id"], []).append([l["a_id"], r.get("inverse_label") or lab])
used = {e for v in ce.values() for e in v}
ep = get("arc_links?select=a_id,b_id,excerpt&a_type=eq.entity&b_type=eq.episode&confidence=gt.0")
eps = {e["id"]: e for e in get("arc_episodes?select=id,title,no,url,released,metadata&id=in.(" + ",".join(sorted({x["b_id"] for x in ep})) + ")")} if ep else {}
ee = {}
for x in ep:
    e = eps.get(x["b_id"])
    if e and x["a_id"] in used:
        ee.setdefault(x["a_id"], []).append({"no": e.get("no") or "", "t": e["title"], "topic": (e.get("metadata") or {}).get("topic", ""), "u": e["url"], "d": e.get("released") or "", "x": (x.get("excerpt") or "")[:400]})
for v in ee.values(): v.sort(key=lambda m: m["d"], reverse=True)
out = {"entities": {k: v for k, v in ents.items() if k in used}, "ce": {k: sorted(set(v)) for k, v in ce.items()}, "cc": cc, "ee": ee}
json.dump(out, open(os.path.join(ROOT, "data", "xlinks.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print(f"xlinks: {len(out['entities'])} entities, {len(out['ce'])} cases with entities, {len(cc)} with case links")
