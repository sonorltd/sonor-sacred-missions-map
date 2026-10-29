import json,re,unicodedata
exec(open('joba.py').read())
def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    s=re.sub(r"\(.*?\)","",s); s=re.sub(r"[^a-z0-9 ]"," ",s)
    s=re.sub(r"\b(the|burial chamber|chamber|stone circle|standing stones?|hillfort|hill fort|camp|falls|cave|well)\b"," ",s)
    return ' '.join(s.split())
src=open('/home/claude/geo/sites.js').read()
ex=re.findall(r'^\["([^"]+)"',src,re.M)
exn=[(e,norm(e.split(',')[0])) for e in ex]
bad=[]
for r in R:
    n=norm(r['name'].split(',')[0])
    for e,en in exn:
        if en and (en==n or (len(en)>5 and en in n) or (len(n)>5 and n in en)):
            bad.append((r['name'],e))
print('CONFLICTS',bad)
cats={"stone","fort","cave","falls","lore","spring"}
names=set(); out=[]
for r in R:
    assert len(r['name'])<=60,r['name']; assert r['cat'] in cats
    assert 52.3<r['lat']<55.1 and -4.8<r['lon']<-1.5,(r['name'],r['lat'],r['lon'])
    assert r['url'].startswith('http'); k=norm(r['name'])
    assert k not in names,r['name']; names.add(k)
    out.append(r)
# coordinate duplicates
from itertools import combinations
for x,y in combinations(out,2):
    if abs(x['lat']-y['lat'])<0.0008 and abs(x['lon']-y['lon'])<0.0012: print('NEAR',x['name'],'|',y['name'])
json.dump(out,open('/home/claude/geo/research/sites_more.json','w'),indent=1,ensure_ascii=False)
print(len(out))
