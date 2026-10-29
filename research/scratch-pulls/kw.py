import sys,re,html,glob
def full(title):
    fn='art/'+re.sub(r'[^A-Za-z0-9]+','_',title)[:80]+'.html'
    s=open(fn,errors='ignore').read()
    body=s[s.find('mw-content-text'):]
    ps=re.findall(r'(?s)<(?:p|li)(?: [^>]*)?>(.*?)</(?:p|li)>',body)
    out=[]
    for p in ps:
        p=re.sub(r'(?s)<sup.*?</sup>','',p); p=re.sub(r'(?s)<style.*?</style>','',p)
        out.append(' '.join(html.unescape(re.sub(r'<[^>]+>','',p)).split()))
    return ' '.join(out)
t=sys.argv[1]; kws=sys.argv[2].split('|')
f=full(t)
for s in re.split(r'(?<=[.!?])\s+',f):
    if any(k.lower() in s.lower() for k in kws): print('-',s[:400])
