import json,subprocess,time,urllib.parse,os,sys
cache=json.load(open('geocache.json')) if os.path.exists('geocache.json') else {}
def gc(q):
    if q in cache: return cache[q]
    u="https://nominatim.openstreetmap.org/search?format=json&limit=3&countrycodes=gb&q="+urllib.parse.quote(q)
    r=subprocess.run(['curl','-sS','-m','30','-A','SonorGeoResearch/1.0 (office@sonor.co.uk)',u],capture_output=True,text=True).stdout
    time.sleep(1.1)
    try: res=json.loads(r)
    except: res=[]
    cache[q]=[(x['lat'],x['lon'],x['display_name'][:110],x.get('class'),x.get('type')) for x in res]
    json.dump(cache,open('geocache.json','w'))
    return cache[q]
if __name__=='__main__':
    exec(open(sys.argv[1]).read())
    for x in R:
        r=gc(x['geo']); print(x['title'][:45],'|',x['geo'],'=>',r[:1] if r else 'NONE')
