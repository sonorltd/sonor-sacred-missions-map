import json,re,sys
d=json.load(open('/home/claude/geo/research/wp_text.json'))
names=sys.argv[1:] or list(d)
for t in names:
    if t not in d: continue
    v=d[t]; txt=v['text']
    txt=re.sub(r'\.mw-parser-output[^}]*\}','',txt)
    txt=re.sub(r'\[\[.*?\]\]|\{\{.*?\}\}|<span.*?>|</span>|\\"','',txt)
    txt=re.sub(r'class="mw-body-content">','',txt)
    sents=re.split(r'(?<=[.!?])\s+',txt)
    keep=[s for s in sents if re.search(r'\b(well|wells|spring|holy|pilgrim|cure|rag|cloot|pattern|water)\b',s,re.I)]
    print(f"## {t} | {v['coord']}\n"+" ".join(keep)[:1100]+"\n")
