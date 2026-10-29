import subprocess,re,json,html,hashlib,os,time
base={'mers':('https://www.paranormaldatabase.com/merseyside/index.php','https://www.paranormaldatabase.com/merseyside/?pageNum_paradata=%d',4),
 'ches':('https://www.paranormaldatabase.com/cheshire/chesdata.php','https://www.paranormaldatabase.com/cheshire/chesdata.php?pageNum_paradata=%d',8),
 'lpool':('https://www.paranormaldatabase.com/hotspots/liverpool.php','https://www.paranormaldatabase.com/hotspots/liverpool.php?pageNum_paradata=%d',6),
 'chester':('https://www.paranormaldatabase.com/hotspots/chester.php','https://www.paranormaldatabase.com/hotspots/chester.php?pageNum_paradata=%d',6)}
out=[]
for k,(u0,pat,n) in base.items():
    for i in range(0,n+1):
        u=u0 if i==0 else pat%i
        t=subprocess.run(['python3','ft.py',u,'1000000'],capture_output=True,text=True).stdout
        ents=re.split(r'\n(?=[^\n]+\n\s*Location:)',t)
        c=0
        for e in ents:
            m=re.search(r'([^\n]+)\n\s*Location:\s*(.+?)\n\s*Type:\s*(.+?)\n\s*Date / Time:\s*(.+?)\n\s*Further Comments:\s*(.+?)\n\s*Source:.*?ID:\s*#(\d+)',e,re.S)
            if m:
                out.append(dict(src=k,url=u,title=m[1].strip(),loc=m[2].strip(),type=m[3].strip(),date=m[4].strip(),desc=' '.join(m[5].split()),id=m[6])); c+=1
        print(k,i,c)
        if c==0 and i>0: break
json.dump(out,open('pdb.json','w'),indent=0)
print(len(out))
