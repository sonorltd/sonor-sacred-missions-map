import json,sys,re
p=json.load(open('/home/claude/geo/research/tna_posts.json'))
key=sys.argv[1]; words=sys.argv[2:]
for u,v in p.items():
    if key in u:
        t=v['text']
        for w in words:
            for m in re.finditer(w,t,re.I):
                print(f"[{w}] ...{t[max(0,m.start()-200):m.end()+200]}...")
