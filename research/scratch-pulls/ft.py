import sys,re,html,subprocess,hashlib,os
url=sys.argv[1]; n=int(sys.argv[2]) if len(sys.argv)>2 else 8000
fn='pages/'+hashlib.md5(url.encode()).hexdigest()
if not os.path.exists(fn):
    subprocess.run(['curl','-sSL','-m','40','-A','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36','-o',fn,url])
s=open(fn,errors='ignore').read()
s=re.sub(r'(?is)<(script|style|noscript|svg|header|footer|nav)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?i)<(br|p|div|h\d|li|tr)[^>]*>','\n',s)
t=html.unescape(re.sub(r'<[^>]+>',' ',s))
t=re.sub(r'[ \t\r]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
off=int(sys.argv[3]) if len(sys.argv)>3 else 0
print(t[off:off+n])
