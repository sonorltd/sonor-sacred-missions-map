import json,re,sys
sys.argv=['x'];exec(open('geo.py').read().split('out=[]')[0])
R=json.load(open('results.json'))
def variants(place):
    v=[]
    p0=re.sub(r'\([^)]*\)','',place); p0=re.sub(r'\s+,',',',p0).strip()
    v.append(p0)
    for m in re.findall(r'\(([^)]*)\)',place): v.append(m+', '+place.split(',')[-1])
    p1=re.sub(r'\b[AMB]\d+(\([MT]\))?\b\s*','',p0); p1=re.sub(r'\b(near|north of|south of|east of|west of|nr\.?)\s+','',p1,flags=re.I).strip(' ,')
    v.append(p1)
    parts=[x.strip() for x in p1.split(',') if x.strip()]
    if len(parts)>=2: v.append(parts[0]+', '+parts[-1])
    if len(parts)>=3: v.append(parts[0]+', '+parts[-2])
    v+=parts[:-1] if len(parts)>1 else parts
    out=[];[out.append(x) for x in v if x and x not in out]
    return out[:6]
for r in R:
    b=r['best']
    if b is not None and b[0]<=0.3: continue
    for qq in variants(r['place'] if r['kind']!='site' else r['id']+', '+r['place'].split(', ')[-1]):
        for c in (q(qq) or []):
            dd=hav(r['lat'],r['lon'],c[0],c[1])
            if b is None or dd<b[0]: b=(dd,qq,c)
        if b and b[0]<0.3: break
    r['best']=b
json.dump(R,open('results2.json','w'))
