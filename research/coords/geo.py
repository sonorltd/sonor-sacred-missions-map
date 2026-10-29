import json,glob,os,time,math,requests,sys
SP='/tmp/claude-0/-home-claude/84687fd7-aa43-57a2-9317-c3293b4c05e5/scratchpad/gc'
CF=SP+'/cache.json'
cache=json.load(open(CF)) if os.path.exists(CF) else {}
S=requests.Session();S.headers['User-Agent']='SonorGeoCheck/1.0 (office@sonor.co.uk)'
def q(s):
    if s in cache: return cache[s]
    for i in range(3):
        try:
            r=S.get('https://nominatim.openstreetmap.org/search',params={'format':'json','q':s,'limit':8},timeout=20)
            res=[(float(x['lat']),float(x['lon']),x.get('display_name','')[:90],x.get('class'),x.get('type')) for x in r.json()]
            break
        except Exception as e: res=None; time.sleep(3)
    time.sleep(1.1)
    cache[s]=res; json.dump(cache,open(CF,'w'))
    return res
def hav(a,b,c,d):
    R=6371;p=math.radians
    x=math.sin(p(c-a)/2)**2+math.cos(p(a))*math.cos(p(c))*math.sin(p(d-b)/2)**2
    return 2*R*math.asin(math.sqrt(x))
out=[]
items=[]
for f in sorted(glob.glob('/home/claude/geo/load/*.json')):
    d=json.load(open(f)); items.append(('load',os.path.basename(f)[:-5],d['title'],d.get('place',''),d['lat'],d['lon']))
for f in sorted(glob.glob('/home/claude/geo/dbdump/reports/*.json')):
    d=json.load(open(f)); d=d.get('data',d); items.append(('db',os.path.basename(f)[:-5],d['title'],d.get('place',''),d['lat'],d['lon']))
RG={'nw':'Wales','wa':'Wales','en':'England','yk':'Yorkshire','sc':'Scotland'}
for s in json.load(open(SP+'/../sites.json')):
    items.append(('site',s[0],s[1],s[0]+', '+RG[s[2]],s[3],s[4]))
for kind,id,title,place,lat,lon in items:
    queries=[place]
    parts=[p.strip() for p in place.split(',')]
    if len(parts)>2: queries.append(', '.join(parts[1:]))
    if kind=='site': queries.append(parts[0])
    best=None
    for qq in queries:
        res=q(qq) or []
        for r in res:
            dd=hav(lat,lon,r[0],r[1])
            if best is None or dd<best[0]: best=(dd,qq,r)
        if best and best[0]<1.5: break
    out.append(dict(kind=kind,id=id,title=title,place=place,lat=lat,lon=lon,best=best))
    print(kind,id,round(best[0],2) if best else None,flush=True)
json.dump(out,open(SP+'/results.json','w'),indent=0)
