import json,math
R={ (r['kind'] if r['kind']=='site' else 'rep', r['id']):r for r in json.load(open('results2.json'))}
def hav(a,b,c,d):
    p=math.radians;x=math.sin(p(c-a)/2)**2+math.cos(p(a))*math.cos(p(c))*math.sin(p(d-b)/2)**2
    return 2*6371*math.asin(math.sqrt(x))
rep=[
("a1-darlington-orange-orbs-2008",54.57744,-1.56911,"old point 3 km west of the A1(M); moved onto the motorway north of Darlington (OSM)"),
("barguest-of-trollers-gill-1830",54.05337,-1.89681,"Trollers Gill gorge is at Skyreholme, 3 km SE of old point (OSM)"),
("beast-of-bennachie-lambs-and-prints-pitc-1996",57.31825,-2.46424,"Pitcaple hamlet (OSM)"),
("black-cat-and-eviscerated-ewe-penuwch-2023",52.24548,-4.05803,"Penuwch hamlet (OSM); old point 2.8 km SW"),
("black-feline-crosses-nercwys-road-juncti-2022",53.1375,-3.14819,"Nercwys village (OSM); old point 2.3 km NE"),
("lynx-captured-at-drumguish-2025",57.07069,-3.99015,"Drumguish locality near Kingussie (OSM)"),
("muckie-sonar-contact-lakes-of-killarney-2003",52.0113,-9.5295,"onto Muckross Lake water (OSM); old point on land N of lake"),
("orange-light-seen-from-mynydd-mechell",53.38043,-4.47634,"Mynydd Mechell hamlet (OSM); old point 3 km E"),
("talacre-lighthouse-keeper-raymond",53.35699,-3.32221,"Point of Ayr Lighthouse (OSM)"),
("tusked-creature-in-antrim-bay-lough-neag-1923",54.70877,-6.26412,"Antrim Bay, Lough Neagh (OSM)"),
("pool-parc-stone-throwing-spirit",53.0925,-3.343,"Pool Park mansion is at Efenechtyd (OSM), 3 km S of old point"),
("berwyn-1974",52.88394,-3.38024,"Cadair Berwyn summit area (OSM); old point 1.6 km N"),
("dechmont-1979",55.91113,-3.54703,"Dechmont Law (OSM); old point 2 km SE"),
("owlman-1976",50.10389,-5.09513,"Mawnan church (St Maunanus) where the Owlman was seen above the tower (OSM)"),
]
sites=[
("Ffynnon Fair, Uwchmynydd",52.79209,-4.76116,"OSM spring node Ffynnon Fair"),
("Conwy Falls",53.06523,-3.77869,"OSM waterfall node"),
("Druid's Circle (Meini Hirion)",53.25348,-3.91574,"OSM Meini Hirion archaeological site"),
("Aber Falls (Rhaeadr Fawr)",53.21046,-3.99529,"OSM waterfall node; old point near car park 1.6 km NE"),
("Swallow Falls",53.10283,-3.84572,"OSM waterfall node"),
("Trefriw Wells Spa",53.17079,-3.82924,"spa is 1.5 km N of Trefriw village (OSM)"),
("Moel Ty Uchaf",52.92365,-3.40546,"OSM Moel Ty Uchaf stone circle"),
("Hardraw Force",54.3198,-2.20199,"OSM waterfall node"),
("Thornton Force",54.17284,-2.46887,"OSM waterfall node; old point in Ingleton village"),
("Chalice Well",51.14427,-2.70537,"OSM Chalice Well spring"),
("White Spring",51.14388,-2.70542,"OSM White Spring, Wellhouse Lane"),
("Malvern Holy Well",52.0789,-2.33657,"OSM Holy Well, Malvern Wells"),
("Madron Well",50.13981,-5.57595,"OSM Madron Well archaeological site"),
("Merry Maidens",50.0648,-5.5888,"stone circle beside B3315 (OSM/known position)"),
("Lydford Gorge White Lady",50.63198,-4.12107,"OSM White Lady Waterfall"),
("St Nectan's Glen",50.66481,-4.71608,"OSM St Nectan's Glen entrance by the kieve"),
("Doon Hill, Aberfoyle",56.17113,-4.37653,"OSM Doon Hill (Fairy Knowe)"),
("Fairy Pools, Skye",57.24911,-6.24866,"OSM Fairy Pools"),
("Steall Falls",56.77024,-4.97983,"OSM waterfall node; old point 2.3 km NE in Glen Nevis"),
("Fairy Glen, Skye",57.58335,-6.3274,"OSM Fairy Glen locality near Uig"),
("Great Orme Bronze Age Mines",53.33056,-3.84731,"OSM mines visitor site"),
("Treak Cliff Cavern",53.34506,-1.79717,"OSM cave entrance"),
("White Scar Cave",54.16566,-2.44133,"OSM cave entrance on B6255"),
("Wemyss Caves",56.1609,-3.05934,"OSM Wemyss Caves, East Wemyss"),
("St Ninian's Cave",54.69385,-4.44913,"OSM cave entrance at Physgill; old point 3 km W at sea"),
("Penycloddiau",53.20088,-3.30814,"OSM summit/hillfort; old point 2 km N"),
("Moel Arthur",53.18448,-3.28075,"OSM summit/hillfort"),
("Moel y Gaer, Rhosesmor",53.2126,-3.18295,"OSM Moel y Gaer hillfort"),
("Pen y Gaer, Llanbedr-y-Cennin",53.20618,-3.87321,"OSM Pen-y-gaer hillfort"),
("Caer y Twr",53.31387,-4.67421,"OSM Caer y Twr hillfort"),
("Caer Drewyn",52.98918,-3.36037,"OSM Caer Drewyn hillfort"),
("Garn Boduan",52.92484,-4.5125,"OSM Garn Boduan summit/hillfort"),
("Helsby Hill",53.27344,-2.76323,"OSM Helsby Hill summit"),
("Caer Caradoc",52.55389,-2.772,"OSM Caer Caradoc summit, Church Stretton"),
("British Camp",52.05823,-2.35125,"OSM British Camp hillfort (Herefordshire Beacon)"),
("Hambledon Hill",50.9108,-2.22156,"OSM Hambledon Hill summit"),
("Craig Phadrig",57.4773,-4.26971,"OSM Craig Phadrig hillfort"),
("Tap o' Noth",57.35152,-2.8592,"OSM Tap o' Noth summit fort"),
("Dunino Den",56.28836,-2.74468,"OSM Dunino Den"),
("The Cloud",53.16996,-2.14413,"OSM The Cloud summit"),
("St Catherine's Hill",51.04631,-1.31076,"OSM St Catherine's Hill, Winchester"),
("Swastika Stone",53.9188,-1.85592,"OSM Swastika Stone"),
("Cow and Calf",53.91707,-1.80266,"OSM Cow and Calf rocks"),
("Gormire Lake",54.24217,-1.22957,"OSM Gormire Lake water"),
("Falling Foss",54.41892,-0.63305,"OSM waterfall node"),
("Penshaw Hill",54.88302,-1.48128,"OSM Penshaw Hill (monument)"),
("Duddo Stones",55.68677,-2.11202,"OSM Duddo Five Stones"),
("Hareshaw Linn",55.16293,-2.25029,"OSM waterfall node"),
("Wade's Causeway",54.36924,-0.76021,"OSM Wheeldale Roman Road exposed section"),
("Mallyan Spout",54.39771,-0.73184,"OSM waterfall node W of Goathland"),
("Thomason Foss",54.40824,-0.72792,"OSM waterfall node"),
("Willy Howe",54.13605,-0.37662,"OSM Willy Howe barrow; old point 3 km S"),
("Duggleby Howe",54.09044,-0.6554,"OSM Duggleby Howe barrow"),
("St Cuthbert's Cave",55.61075,-1.90764,"OSM St Cuthbert's Cave entrance"),
("Black Shuck, Blythburgh",52.32115,1.59475,"Holy Trinity Church, Blythburgh (OSM); old point 2.3 km E"),
]
out={'reports':[],'sites':[]}
for id,la,lo,why in rep:
    r=R[('rep',id)]; d=hav(r['lat'],r['lon'],la,lo); assert d>0.3,(id,d)
    out['reports'].append(dict(id=id,lat=la,lon=lo,was=[r['lat'],r['lon']],km_moved=round(d,2),why=why))
for n,la,lo,why in sites:
    r=R[('site',n)]; d=hav(r['lat'],r['lon'],la,lo); assert d>0.3,(n,d)
    out['sites'].append(dict(name=n,lat=la,lon=lo,was=[r['lat'],r['lon']],km_moved=round(d,2),why=why))
json.dump(out,open('/home/claude/geo/research/coord_fixes.json','w'),indent=1,ensure_ascii=False)
print(len(out['reports']),len(out['sites']),len(R))
