import sys,json
exec(open('geo.py').read().split('out=[]')[0])
for s in sys.argv[1:]:
    print('##',s)
    for c in (q(s) or [])[:5]: print('  ',round(c[0],5),round(c[1],5),c[2][:80],c[4])
