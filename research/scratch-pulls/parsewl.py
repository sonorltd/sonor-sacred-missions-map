import re,html,glob,json
out=[]
def txt(x): return ' '.join(html.unescape(re.sub(r'<[^>]+>',' ',re.sub(r'(?s)<style.*?</style>','',x))).split())
for f in glob.glob('wl_*.html'):
    s=open(f).read()
    if len(s)<100000: continue
    can=re.search(r'<link rel="canonical" href="([^"]+)"',s).group(1)
    for tb in re.findall(r'(?s)<table class="[^"]*wikitable.*?</table>',s):
        hdr=[txt(h) for h in re.findall(r'(?s)<th scope="col"[^>]*>(.*?)</th>',tb)]
        if 'Name' not in hdr: continue
        for row in re.findall(r'(?s)<tr[^>]*>(.*?)</tr>',tb)[1:]:
            tds=re.findall(r'(?s)<td[^>]*>(.*?)</td>',row)
            if len(tds)<len(hdr)-1: continue
            d=dict(zip(hdr[1:],tds))
            name=txt(d.get('Name',''))
            m=re.search(r'"1":\{"wt":"(-?[\d.]+)"\},"2":\{"wt":"(-?[\d.]+)"',d.get('Location',''))
            gr=re.search(r'\b(S[HJ]|SN|SO)\d{6,10}\b',txt(d.get('Location','')))
            cadw='Cadw' in d.get('Name','')
            out.append(dict(page=can,name=name,type=txt(d.get('Site type','')),community=txt(d.get('Community','')),lat=float(m[1]) if m else None,lon=float(m[2]) if m else None,grid=gr.group(0) if gr else None,details=txt(d.get('Details','')),period=txt(d.get('Period','')),sam=txt(d.get('SAM No & Refs','')).split()[0] if txt(d.get('SAM No & Refs','')) else '',cadw=cadw))
json.dump(out,open('wl.json','w'),indent=0)
import collections
print(len(out)); print(collections.Counter(o['page'].split('/')[-1] for o in out))
print(collections.Counter(o['type'] for o in out).most_common(60))
# second pass: name links
out2=[]
for f in glob.glob('wl_*.html'):
    s=open(f).read()
    if len(s)<100000: continue
    can=re.search(r'<link rel="canonical" href="([^"]+)"',s).group(1)
    for tb in re.findall(r'(?s)<table class="[^"]*wikitable.*?</table>',s):
        hdr=[txt(h) for h in re.findall(r'(?s)<th scope="col"[^>]*>(.*?)</th>',tb)]
        if 'Name' not in hdr: continue
        for row in re.findall(r'(?s)<tr[^>]*>(.*?)</tr>',tb)[1:]:
            tds=re.findall(r'(?s)<td[^>]*>(.*?)</td>',row)
            if len(tds)<len(hdr)-1: continue
            d=dict(zip(hdr[1:],tds))
            links=re.findall(r'href="https://en.wikipedia.org/wiki/([^"#]+)" title="([^"]+)"',d.get('Name',''))
            links=[l for l in links if l[0]!='Cadw']
            out2.append([txt(d['Name']),links])
json.dump(out2,open('wl_links.json','w'))
