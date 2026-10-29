import json,subprocess,sys
def coords(titles):
    vals=' '.join('"%s"@en'%t.replace('"','\\"') for t in titles)
    q='''SELECT ?t ?c WHERE { VALUES ?t {%s} ?a schema:name ?t ; schema:isPartOf <https://en.wikipedia.org/> ; schema:about ?i . ?i wdt:P625 ?c }'''%vals
    r=subprocess.run(['./sq.sh',q],capture_output=True,text=True).stdout
    out={}
    for b in json.loads(r)['results']['bindings']:
        c=b['c']['value'].replace('Point(','').replace(')','').split()
        out[b['t']['value']]=(round(float(c[1]),5),round(float(c[0]),5))
    return out
if __name__=='__main__':
    for k,v in coords(sys.argv[1:]).items(): print(k,v)
