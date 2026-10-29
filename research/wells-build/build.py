import json,re,sys
sys.path.insert(0,'/home/claude/geo/research/build')
from pyproj import Transformer
from tna_entries import T
from manual import MANUAL
from wp_entries import W
R='/home/claude/geo/research/'
gb=Transformer.from_crs("EPSG:27700","EPSG:4326",always_xy=True)
ie=Transformer.from_crs("EPSG:29903","EPSG:4326",always_xy=True)
L="ABCDEFGHJKLMNOPQRSTUVWXYZ"
def gbgrid(ref):
    ref=ref.upper().replace(" ","")
    m=re.match(r'^([A-Z]{2})(\d+)$',ref)
    if m:
        l1,l2=L.index(m.group(1)[0]),L.index(m.group(1)[1])
        e100=((l1-2)%5)*5+(l2%5); n100=(19-(l1//5)*5)-(l2//5)
        d=m.group(2); h=len(d)//2
        if len(d)%2: raise ValueError(ref)
        e=int(d[:h]) * 10**(5-h) + 10**(5-h)/2 if h<5 else int(d[:h])
        n=int(d[h:]) * 10**(5-h) + 10**(5-h)/2 if h<5 else int(d[h:])
        E=e100*100000+e; N=n100*100000+n
        lon,lat=gb.transform(E,N); return lat,lon,h
    m=re.match(r'^([A-Z])(\d+)$',ref)
    if m:
        l=L.index(m.group(1)); e100=l%5; n100=4-l//5
        d=m.group(2); h=len(d)//2
        e=int(d[:h])*10**(5-h)+(10**(5-h)/2 if h<5 else 0)
        n=int(d[h:])*10**(5-h)+(10**(5-h)/2 if h<5 else 0)
        lon,lat=ie.transform(e100*100000+e,n100*100000+n); return lat,lon,h
    raise ValueError(ref)
out=[];notes=[]
def add(name,cat,lat,lon,desc,src,url,digits=None):
    if digits is not None and digits<=2 and 'approximate' not in desc.lower():
        desc=desc.rstrip('.')+'; location approximate.'
    out.append(dict(name=name[:60],cat=cat,lat=round(lat,5),lon=round(lon,5),desc=desc,source=src,url=url))
# TNA
posts=json.load(open(R+'tna_posts.json'))
for k,(name,cat,desc) in T.items():
    u=[u for u in posts if u.endswith(k) and (u.endswith('/'+k) or k.startswith('/') )]
    u=[x for x in posts if x.rstrip('/').split('/')[-1]==k.rstrip('/')]
    if len(u)!=1: notes.append(('NOPOST',k,u)); continue
    u=u[0]; t=posts[u]['text']
    g=re.search(r'(?:Grid[- ]?Reference|OS Reference|OS Rid Reference|OS Grid-Reference)\s*[–—:-]*\s*([A-Z]{1,2}\s?\d[\d\s]{1,14}\d)',t,re.I)
    if not g: notes.append(('NOGRID',k)); continue
    ref=re.sub(r'\s+',' ',g.group(1)).strip()
    lat,lon,h=gbgrid(ref)
    add(name,cat,lat,lon,desc,'The Northern Antiquarian',u,h)
# manual
for name,cat,loc,desc,src,url in MANUAL:
    if isinstance(loc,str): lat,lon,h=gbgrid(loc)
    else: lat,lon=loc; h=None
    add(name,cat,lat,lon,desc,src,url,h)
# wikipedia
wt=json.load(open(R+'wp_text.json')); wd=json.load(open(R+'wp_wd.json'))
for t,(name,cat,desc,ov) in W.items():
    h=None
    if isinstance(ov,str): lat,lon,h=gbgrid(ov)
    elif ov: lat,lon=ov
    elif wt.get(t,{}).get('coord'): lat,lon=wt[t]['coord']
    elif wd.get(t,{}).get('coord'):
        m=re.match(r'Point\(([-\d.]+) ([-\d.]+)\)',wd[t]['coord']); lon,lat=float(m.group(1)),float(m.group(2))
    else: notes.append(('NOCOORD',t)); continue
    url=wt[t]['url'] if t in wt else 'https://en.wikipedia.org/wiki/'+t.replace(' ','_')
    add(name,cat,lat,lon,desc,'Wikipedia',url,h)
print(len(out)); print(notes)
json.dump(out,open(R+'wells_other_draft.json','w'),indent=1,ensure_ascii=False)
