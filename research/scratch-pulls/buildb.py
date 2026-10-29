import json,glob,re
exec(open('jobb.py').read())
C={
"Murdered miller at Bidston Windmill":(53.39630,-3.07334),
"Dark disc photographed over Bidston Hill":(53.40119,-3.07385),
"Golden car vanishing into Queensway Tunnel wall":(53.40762,-2.98960),
"John Lennon at the Mendips window":(53.37725,-2.88136),
"Broken-neck man in the Epstein Theatre":(53.40435,-2.98225),
"Flat WWI sergeant on the Birkenhead train":(53.40480,-2.99190),
"Knowsley Hall banshee and phantom cars":(53.43806,-2.83750),
"Huskisson's limping ghost, St James's Cemetery":(53.39717,-2.97192),
"Corpse candles of Bloody Acre, Childwall":(53.39533,-2.88152),
"Lantern Jaw and the pyramid ghost, Rodney Street":(53.40163,-2.97333),
"Flat-capped worker at Cammell Laird":(53.38524,-3.01250),
"Father and son of Leasowe Castle":(53.41850,-3.10801),
"'It must have been Les' at the Royal Court":(53.40746,-2.98115),
"Elizabeth Warburton of Stanley Palace":(53.18951,-2.89570),
"Marching legion under the George and Dragon":(53.19721,-2.89450),
"Apparition snapped at the old Crying Tree, Gateacre":(53.38792,-2.86907),
"Basement presence at Clifton Hall, Birkenhead":(53.38698,-3.02396),
"Vanishing passenger on Halsall Moss":(53.59210,-2.95524),
"Bernie Brown on the Metropolitan Cathedral steps":(53.40472,-2.96889),
"Coal-cellar boy of Calderstones House":(53.38167,-2.89417),
"The St Luke's abduction":(53.40141,-2.97508),
"Childwall man whose family never existed":(53.39724,-2.89705),
"Glaring stranger at the Slaughter House pub":(53.40562,-2.99114),
"Spring-heeled Jack in Everton":(53.41468,-2.97194),
"Screeching Ginny at Garston Dock station":(53.35522,-2.90313),
"Bonneted lady on Woodchurch Road":(53.37625,-3.03935),
"'The Sarge' at the Woolton ambulance centre":(53.37839,-2.87748),
"Aviator Tom Campbell Black at Speke airfield":(53.34769,-2.88065),
"Coal-throwing outbreak, Myers Street":(53.40359,-2.95879),
"Phantom city in the sky over Liverpool":(53.40710,-2.99160),
"Mile-long saucer over Anfield":(53.43083,-2.96083),
"Headless horse on Springwood Avenue":(53.36433,-2.88777),
"Midnight phantom funeral, Knotty Ash":(53.41665,-2.89248),
"Bus driver's vanishing monk, Walton":(53.44635,-2.96680),
"Green lady seen by cadets, Sefton":(53.50440,-2.97120),
"Floating sailor of the Punch Bowl, Sefton":(53.50440,-2.97120),
"Rainhill landing chased by police":(53.41344,-2.76079),
"Stone-throwing on Kirkland Street, St Helens":(53.45425,-2.74542),
"Tiny grey figure photographed, Balker Drive":(53.46126,-2.74487),
"Trick-or-treating monk at Chester Cathedral":(53.19194,-2.89056),
"Starved maid of the Bear and Billet":(53.18630,-2.88964),
"Henrietta at the Blue Bell window":(53.19331,-2.89319),
"Lioness reported at Upton":(53.21161,-2.88567),
"Golden 'leopard cat' shot at, Crewood Hall Farm":(53.28061,-2.65184),
"The Thing of Delamere":(53.22910,-2.67780),
"White lady rising into the trees, Delamere":(53.22900,-2.66700),
"The Dodleston messages":(53.14160,-2.95540),
"Headless woman of Hockenhull":(53.18620,-2.78490),
"Crying princes at Farndon Bridge":(53.08337,-2.87982),
"Old woman drawn by Reginald Easton, Thurstaston":(53.34820,-3.13276),
"Headmaster's ghost at Oldershaw, Wallasey":(53.42296,-3.05002),
"Black lady and dog on Burton Marsh":(53.27715,-3.06630),
"Glowing monks and singing, Norton Priory":(53.34230,-2.67990),
"Fireman Jack of the Old Fire Station":(53.19348,-2.89330),
"Shape-shifting figure from the canal, Chester":(53.19335,-2.88002),
"Vanishing figures on the Bridge of Sighs":(53.19387,-2.89373),
"Headless Royalist of Tudor House":(53.18786,-2.89031),
}
fix={"Fireman Jack of the Old Fire Station":dict(place="Old Fire Station (Chez Jules), Northgate Street, Chester"),
"Green lady seen by cadets, Sefton":dict(place="Fields by St Helen's Church, Sefton"),
"Floating sailor of the Punch Bowl, Sefton":dict(place="Punch Bowl Inn and churchyard, Sefton"),
"The St Luke's abduction":dict(place="Bold Place, behind St Luke's Church, Liverpool"),
"White lady rising into the trees, Delamere":dict(place="Delamere Forest near Delamere Station, Delamere"),
"Coal-cellar boy of Calderstones House":dict(place="Calderstones House, Calderstones Park, Liverpool"),
"The Dodleston messages":dict(place="Meadow Cottage, Dodleston"),
"Shape-shifting figure from the canal, Chester":dict(place="Canal towpath by Griffiths' Steam Mill, Chester"),
}
tags_ok=set(["multiple-witnesses","single-witness","police","military","photo","video","official-files","physical-traces","missing-time","entity","big-cat","black-dog","castle","house","church","inn","road","apparition","objects-moved","coast","sea","rural","urban","explained","open-to-visit","grey-lady","white-lady","monk","soldier","child","voices","investigated"])
cats=set("lights craft encounter ghost poltergeist cryptid timeslip other".split())
# existing titles
ex=set()
for f in glob.glob('/home/claude/geo/load/*.json'):
    ex.add(json.load(open(f))['title'].lower())
out=[]
for x in R:
    if x['title'] not in C: continue
    y={k:x[k] for k in ['title','cat','date','place']}
    y.update(fix.get(x['title'],{}))
    if re.fullmatch(r'\d{3}0s',y['date']): y['date']=''
    y['lat'],y['lon']=C[x['title']]
    y.update(desc=x['desc'],source=x['source'],url=x['url'],tags=x['tags'])
    assert len(y['title'])<=60,y['title']; assert y['cat'] in cats; assert all(t in tags_ok for t in y['tags']),y['tags']
    assert re.fullmatch(r'(\d{4}(/\d{2}(/\d{2})?)?)?',y['date']),y['date']
    assert y['title'].lower() not in ex
    assert 'bold street' not in (y['title']+y['place']).lower()
    out.append(y)
titles=[o['title'] for o in out]; assert len(set(titles))==len(titles)
json.dump(out,open('/home/claude/geo/research/wirral_reports.json','w'),indent=1,ensure_ascii=False)
print(len(out))
