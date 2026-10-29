import json,subprocess,sys,time
def q(cat):
    s='''SELECT ?title ?item ?coord ?desc WHERE {
SERVICE wikibase:mwapi { bd:serviceParam wikibase:api "Generator" ; wikibase:endpoint "en.wikipedia.org" ; mwapi:generator "categorymembers" ; mwapi:gcmtitle "Category:%s" ; mwapi:gcmlimit "max" ; mwapi:gcmnamespace "0".
 ?title wikibase:apiOutput mwapi:title . ?item wikibase:apiOutputItem mwapi:item . }
OPTIONAL { ?item wdt:P625 ?coord }
OPTIONAL { ?item schema:description ?desc FILTER(lang(?desc)="en") }
}'''%cat
    r=subprocess.run(['./sq.sh',s],capture_output=True,text=True).stdout
    try: return [{k:v['value'] for k,v in b.items()} for b in json.loads(r)['results']['bindings']]
    except Exception: return None
res=json.load(open('cats.json')) if len(sys.argv)>1 and sys.argv[1]=='-a' else {}
cats=[l.strip() for l in open('catlist.txt') if l.strip()]
for c in cats:
    if c in res: continue
    r=q(c); 
    if r is None: print('FAIL',c); continue
    res[c]=r; print(len(r),c); time.sleep(0.5)
json.dump(res,open('cats.json','w'))
