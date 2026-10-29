#!/usr/bin/env python3
"""Build the Sacred Missions Map.

Outputs
  index.html          GitHub Pages copy: self-contained, reports baked from data/reports.json,
                      marks (star / to visit / visited / notes) kept in the browser only.
  dist/artifact.html  The claude.ai artifact copy: reports, marks and photos live in the
                      artifact's own database (db + user + assets capabilities).

Run from the repo root:  python3 tools/build.py
Dependency-free (standard library only), so it runs on the Mac as-is.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
read = lambda *a: open(P(*a), encoding="utf-8").read()
load = lambda *a, d=None: json.load(open(P(*a), encoding="utf-8")) if os.path.exists(P(*a)) else d

VERSION = re.search(r"^## v(\d+\.\d+\.\d+)", read("CHANGELOG.md"), re.M).group(1)

DB = r'''(async()=>{
  try{
    db=await claude.use("db");
    if(!db){dbState="none";if(tab==="paranormal")render();return}
    user=await claude.use("user");
    if(user){try{myId=await user.id()}catch(e){}let w=null;try{w=await user.can("data.write")}catch(e){}canWrite=w!==false}else canWrite=true;
    try{assetsApi=await claude.use("assets")}catch(e){assetsApi=null}
    if(myId){try{marksRef=db.collection("data/users/"+myId).doc("marks");const snap=await marksRef.get();
      if(snap.exists){const v=snap.data()||{};const rm=v.m&&typeof v.m==="object"?v.m:{};marks.m={...marks.m,...rm};
        const tr=Array.isArray(v.trips)?v.trips:[];const names=new Set(tr.map(t=>t.name));marks.trips=[...tr,...marks.trips.filter(t=>!names.has(t.name))].slice(0,30)}
      saveMarks();render()}catch(e){marksRef=null}}
    db.collection("reports").onSnapshot(snap=>{
      reports=snap.docs.map(d=>normReport(d.id,d.data()||{})).filter(r=>isFinite(r.lat)&&isFinite(r.lon));
      dbState="ready";
      if(!formOpen)render();
      if(sel&&sel.kind==="rep"){const r=reports.find(x=>x.id===sel.id);if(r)repCard(r);else closeCard()}
    },()=>{dbState="error";if(tab==="paranormal")render()});
  }catch(e){dbState="none";if(tab==="paranormal")render()}
})();'''

def baked():
    reps = load("data", "reports.json", d=[])
    return ("const BAKED=" + json.dumps(reps, ensure_ascii=False) +
            ';\nreports=BAKED.map(v=>normReport(v.id,v)).filter(r=>isFinite(r.lat)&&isFinite(r.lon));'
            'dbState="ready";canWrite=false;if(tab==="paranormal")render();')

def main():
    shapes = load("data", "shapes.json")
    tpl = read("src", "template.html")
    app = (read("src", "app.js")
           .replace("__SITES__", read("data", "sites.js"))
           .replace("__SINCLAIR__", read("data", "sinclair.js"))
           .replace("__LEYS_EXTRA__", json.dumps(load("data", "leys_extra.json", d=[]), ensure_ascii=False))
           .replace("__SITES_X__", json.dumps(load("data", "sites_x.json", d=[]), ensure_ascii=False))
           .replace("__SINC_X__", json.dumps(load("data", "sinc_x.json", d={}), ensure_ascii=False)))
    for mode in ("artifact", "pages"):
        s = app
        if mode == "artifact":
            s = s.replace("__COLLECTION__", DB).replace("__PARA_SUB__",
                "Your growing collection of UFO, cryptid and paranormal reports from across Britain and Ireland. Add cases as you find them; they're saved with the map.")
        else:
            s = s.replace("__COLLECTION__", baked()).replace("__PARA_SUB__",
                "UFO, cryptid and paranormal reports from across Britain and Ireland, each linked to its sources.")
        s = f'const APP_VERSION = "{VERSION}";\n' + s  # read by generate-manifest.sh (code version)
        h = (tpl.replace("__SCRIPT__", s).replace("__GB__", shapes["gb"]).replace("__IE__", shapes["ie"])
                .replace("__IM__", shapes["im"]).replace("__VERSION__", VERSION))
        if mode == "pages":
            h = h.replace("*{box-sizing:border-box}", "*{box-sizing:border-box}\nbody{margin:0}\n[hidden]{display:none!important}\n"
                          ":root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}", 1)
            h = ('<!doctype html><html lang="en-GB" data-theme="missions"><head><meta charset="utf-8">'
                 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
                 + h.replace('<div class="wrap">', '</head><body>\n<div class="wrap">', 1) + "\n</body></html>\n")
            out = P("index.html")
        else:
            out = P("dist", "artifact.html")
        open(out, "w", encoding="utf-8").write(h)
        print(f"{mode:8} v{VERSION}  {len(h)//1024} KB  -> {os.path.relpath(out, ROOT)}")

if __name__ == "__main__":
    main()
