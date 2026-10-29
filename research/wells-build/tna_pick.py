import json,re,sys
p=json.load(open('/home/claude/geo/research/tna_posts.json'))
for k in sys.argv[1:]:
    for u,v in p.items():
        if u.rstrip('/').endswith('/'+k):
            t=v['text']
            g=re.search(r'(?:Grid[- ]?Reference|OS Reference|OS Rid Reference)\s*[–—:-]?\s*([A-Z]{1,2}\s?[\d\s]{2,14}\d)',t)
            body=re.sub(r'.*?Archaeology (&|and) History','',t,count=1)
            body=re.split(r'References\s*:|References and Acknowledgements|Acknowledgements',body)[0]
            print(f"## {k} | {v['title']} | {g.group(1).strip() if g else 'NOGRID'}\n{body[:900]}\n")
