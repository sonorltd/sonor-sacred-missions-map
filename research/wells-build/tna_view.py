import json,re,sys
p=json.load(open('/home/claude/geo/research/tna_posts.json'))
order=[u for u,t in json.load(open('/home/claude/geo/research/tna_all.json'))]
a,b=int(sys.argv[1]),int(sys.argv[2])
items=[(u,p[u]) for u in order if u in p][a:b]
for i,(u,v) in enumerate(items,a):
    t=v['text']
    g=re.search(r'Grid Reference\s*[–—:-]?\s*([A-Z]{1,2}\s?[\d\s]{4,14}\d)',t)
    body=re.sub(r'.*?Archaeology (&|and) History','',t,count=1)
    body=re.split(r'References\s*:|References and Acknowledgements|Acknowledgements',body)[0]
    print(f"#{i} {v['title']} || {g.group(1).strip() if g else 'NOGRID: '+t[:120]} || {u}\n   {body[:1000]}\n")
