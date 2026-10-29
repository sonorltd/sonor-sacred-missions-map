import sys,subprocess,re,hashlib
for u in sys.argv[1:]:
    t=subprocess.run(['python3','ft.py',u,'200000'],capture_output=True,text=True).stdout
    raw=open('pages/'+hashlib.md5(u.encode()).hexdigest(),errors='ignore').read()
    d=re.search(r'"datePublished"\s*:\s*"([^"]+)"',raw)
    lines=[l.strip() for l in t.split('\n') if len(l.strip())>60 and 'READ MORE' not in l]
    print('#####',u, d.group(1) if d else '')
    print('\n'.join(lines[:int(sys.argv[0:1] and 22)])[:2600])
