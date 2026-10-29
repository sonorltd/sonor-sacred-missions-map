import sys,subprocess,re,html,json,os,time,urllib.parse
def get(title):
    fn='art/'+re.sub(r'[^A-Za-z0-9]+','_',title)[:80]+'.html'
    if not os.path.exists(fn) or os.path.getsize(fn)<60000:
        u='https://en.wikipedia.org/wiki/'+urllib.parse.quote(title.replace(' ','_'))
        for i in range(3):
            subprocess.run(['curl','-sSL','-m','40','-A','Mozilla/5.0 (research; office@sonor.co.uk)','-o',fn,u]); 
            s=open(fn,errors='ignore').read()
            if 'too many requests' in s.lower()[:3000]: time.sleep(5); continue
            break
        time.sleep(0.8)
    s=open(fn,errors='ignore').read()
    can=re.search(r'<link rel="canonical" href="([^"]+)"',s)
    if not can or 'Wikipedia does not have an article' in s: return None
    g=re.search(r'<span class="geo">\s*(-?[\d.]+);\s*(-?[\d.]+)',s)
    body=s[s.find('mw-content-text'):]
    paras=re.findall(r'(?s)<p(?: [^>]*)?>(.*?)</p>',body)
    t=[]
    for p in paras:
        p=re.sub(r'(?s)<sup.*?</sup>','',p); p=re.sub(r'(?s)<style.*?</style>','',p)
        x=' '.join(html.unescape(re.sub(r'<[^>]+>','',p)).split())
        if len(x)>40: t.append(x)
        if sum(len(y) for y in t)>1400: break
    return dict(title=title,url=urllib.parse.unquote(can.group(1)),lat=float(g[1]) if g else None,lon=float(g[2]) if g else None,text=' '.join(t)[:1600])
if __name__=='__main__':
    res=json.load(open('arts.json')) if os.path.exists('arts.json') else {}
    for t in [l.strip() for l in open(sys.argv[1]) if l.strip()]:
        if t in res and res[t]: continue
        r=get(t); res[t]=r
        print(t,'=>',(r['url'].split('/wiki/')[1],r['lat'],r['lon']) if r else None, flush=True)
    json.dump(res,open('arts.json','w'),indent=0,ensure_ascii=False)
