import json,importlib.util,glob
ALLOWED_T={"multiple-witnesses","single-witness","photo","video","police","military","missing-time","entity","coast","sea","moor","road","rural","urban","paul-sinclair-witness"}
CATS={"lights","craft","encounter","ghost","poltergeist","cryptid","timeslip","other"}
out=[]
for f in sorted(glob.glob('out/b*.py')):
    ns={}; exec(open(f).read(),ns)
    for n,c,p,la,lo,ap,s,t in ns['E']:
        assert c in CATS,(n,c); assert set(t)<=ALLOWED_T,(n,t)
        out.append({"n":n,"cat":c,"place":p,"lat":round(la,5),"lon":round(lo,5),"approx":ap,"summary":s,"tags":t})
inp=sorted(int(l.split('|')[0]) for l in open('/home/claude/geo/sinclair_raw.txt') if l.strip() and 151<=int(l.split('|')[0])<=306)
got=[o['n'] for o in out]
print(len(inp),len(got),set(inp)-set(got),set(got)-set(inp),len(got)-len(set(got)))
out.sort(key=lambda o:o['n'])
json.dump(out,open('/home/claude/geo/research/sinclair_b.json','w'),indent=1,ensure_ascii=False)
json.load(open('/home/claude/geo/research/sinclair_b.json')); print('valid')
