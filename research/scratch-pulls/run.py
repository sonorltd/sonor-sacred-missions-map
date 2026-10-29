import json,subprocess,time
cls="Q101659 Q193475 Q744099 Q34038 Q35509 Q1935728 Q585490 Q7321974 Q358316 Q164240 Q1652352 Q2330559 Q2046325 Q34023 Q1426772 Q935773 Q92086 Q2794629 Q1061002 Q1035294 Q373661".split()
out=[]
for c in cls:
    q='''SELECT DISTINCT ?i ?l ?c ?art ?d WHERE {
 ?i wdt:P31 wd:%s .
 SERVICE wikibase:box { ?i wdt:P625 ?c . bd:serviceParam wikibase:cornerSouthWest "Point(-4.8 52.45)"^^geo:wktLiteral . bd:serviceParam wikibase:cornerNorthEast "Point(-1.55 54.95)"^^geo:wktLiteral . }
 OPTIONAL{ ?art schema:about ?i ; schema:isPartOf <https://en.wikipedia.org/> . }
 OPTIONAL{?i rdfs:label ?l FILTER(lang(?l)="en")}
 OPTIONAL{?i schema:description ?d FILTER(lang(?d)="en")}
}'''%c
    r=subprocess.run(['./sq.sh',q],capture_output=True,text=True).stdout
    try: b=json.loads(r)['results']['bindings']
    except Exception: print(c,'FAIL',r[:100]); continue
    for x in b:
        y={k:v['value'] for k,v in x.items()}; y['cls']=c; out.append(y)
    print(c,len(b)); time.sleep(1)
json.dump(out,open('wd_all.json','w'))
