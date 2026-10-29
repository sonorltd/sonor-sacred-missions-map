from pyproj import Transformer
T=Transformer.from_crs(27700,4326,always_xy=True)
L='ABCDEFGHJKLMNOPQRSTUVWXYZ'
def gr(s):
    s=s.replace(' ','').upper(); a,b=s[0],s[1]; d=s[2:]; n=len(d)//2
    i1,i2=L.index(a),L.index(b)
    e100=((i1-2)%5)*5+(i2%5); n100=(19-(i1//5)*5)-(i2//5)
    e=int(d[:n].ljust(5,'0'))+e100*100000; nn=int(d[n:].ljust(5,'0'))+n100*100000
    # centre of square for low precision
    off=10**(5-n)/2 if n<5 else 0
    lon,lat=T.transform(e+off,nn+off); return round(lat,5),round(lon,5)
if __name__=='__main__':
    import sys
    for g in sys.argv[1:]: print(g,gr(g))
