import json,re
G={"Glasgow":(55.864,-4.252),"Reighton":(54.163,-0.268),"Portaferry":(54.381,-5.548),"Bempton":(54.140,-0.170),"Yatton":(51.386,-2.817),
"West Yorks":(53.75,-1.65,1),"West Yorkshire":(53.75,-1.65,1),"Sheffield":(53.381,-1.470),"Wadworth":(53.464,-1.141),"Brixham":(50.395,-3.513),"West Lothian":(55.90,-3.55,1),
"Birmingham":(52.486,-1.890),"Rochdale":(53.615,-2.155),"Fylingdales":(54.362,-0.670),"Darlington":(54.523,-1.553),"Hayes":(51.512,-0.420),"Hull":(53.744,-0.333),
"Hunmanby":(54.180,-0.320),"Frimley":(51.317,-0.744),"Runton":(52.937,1.270),"Yorkshire Wolds":(54.05,-0.60,1),"Danes Dyke":(54.105,-0.143),"Deddington":(51.982,-1.321),
"Tuxford":(53.231,-0.893),"Hessle":(53.722,-0.432),"Niton":(50.583,-1.286),"Scarborough":(54.283,-0.400),"Hornsea":(53.910,-0.167),"South East London":(51.45,-0.03,1),
"Driffield":(54.005,-0.442),"Porthcurno":(50.043,-5.656),"Leeds":(53.800,-1.549),"Huddersfield":(53.646,-1.785),"Knebworth":(51.866,-0.188),"Wexford":(52.336,-6.463),
"Stamford Bridge":(53.990,-0.913),"Gainsborough":(53.398,-0.774),"Bodmin":(50.470,-4.718),"Upnor":(51.407,0.527),"Sleaford":(52.999,-0.410),"English Channel":(50.35,-1.0,1),
"Winchester":(51.063,-1.308),"Hednesford":(52.711,-2.000),"Kilnwick":(53.950,-0.522),"Sandringham":(52.829,0.513),"Chesterfield":(53.235,-1.421),"Rawcliffe":(53.689,-0.965,1),
"Lincoln":(53.230,-0.540),"Whitehaven":(54.549,-3.587),"Rotherham":(53.430,-1.357),"Bradford":(53.795,-1.759),"East Riding":(53.85,-0.45,1),"Newcastle":(54.978,-1.618),
"East Yorks":(53.9,-0.45,1),"Harrogate":(53.992,-1.541),"York":(53.959,-1.082),"Dundee":(56.462,-2.971),"Wharram le Street":(54.080,-0.692),"Doncaster":(53.523,-1.133),
"Middlesbrough":(54.574,-1.235),"Mortehoe":(51.184,-4.206),"Wetwang":(54.017,-0.576),"Filey":(54.210,-0.289),"Rendlesham":(52.090,1.430),"Ashford":(51.146,0.875),
"Halifax":(53.725,-1.863),"Warminster":(51.205,-2.181),"Bridlington":(54.084,-0.192),"Weaverthorpe":(54.124,-0.512),"Letchworth":(51.979,-0.229),"Hole of Horcum":(54.333,-0.684),
"Rosslyn":(55.855,-3.160),"New Forest":(50.87,-1.60,1),"Bracknell":(51.414,-0.751),"Cardiff":(51.481,-3.179),"Oxenhope":(53.811,-1.954),"Preston":(53.763,-2.703),
"Lickey Hills":(52.376,-2.000),"Sandsend":(54.502,-0.669),"London":(51.507,-0.128,1),"Littleborough":(53.644,-2.096),"Eyemouth":(55.870,-2.090),"Penistone":(53.525,-1.629),
"Holmfirth":(53.570,-1.787),"Seahouses":(55.581,-1.654),"North Landing":(54.130,-0.103),"Redcar":(54.616,-1.069),"Upper Halling":(51.357,0.432),"East Kilbride":(55.764,-4.177),
"Fimber":(54.038,-0.640),"Swansea":(51.621,-3.944),"Sandbach":(53.144,-2.362),"Bolton":(53.578,-2.429),"Exeter":(50.718,-3.534),"Fraisthorpe":(54.042,-0.218),
"Shrewsbury":(52.707,-2.754),"South Shields":(54.999,-1.433),"Cannock":(52.690,-2.031),"Norton Canes":(52.669,-1.965),"Whitby":(54.486,-0.615),"Shildon":(54.628,-1.651),
"Selby":(53.784,-1.068),"Blackheath":(51.465,0.008),"Cayton Bay":(54.244,-0.367),"Skirlington":(53.948,-0.193),"Watford":(51.656,-0.396),"Great Bentley":(51.851,1.064),
"Skipsea":(53.978,-0.217),"Manchester":(53.480,-2.242),"Kelk":(54.012,-0.316),"Lewisham":(51.461,-0.012),"Thirsk":(54.232,-1.343),"Ormsary":(55.903,-5.616),
"Portsmouth":(50.819,-1.088),"East Yorkshire Wolds":(54.0,-0.6,1),"Flamborough":(54.117,-0.123),"Sledmere":(54.071,-0.578),"Burton Pidsea":(53.766,-0.105),
"Pickering":(54.247,-0.776),"Lund":(53.910,-0.533),"Tetney":(53.496,-0.019),"Saltburn":(54.583,-0.973),"Wilberfoss":(53.950,-0.889),"Middleton on the Wolds":(53.921,-0.554),
"Royston":(53.603,-1.444,1),"Oxford":(51.752,-1.258),"Tibthorpe":(53.993,-0.528),"Caldbeck":(54.750,-3.050),"Eastnor Castle":(52.031,-2.380),"Northumberland":(55.25,-1.95,1),
"Cayton":(54.236,-0.378),"Northampton":(52.237,-0.894),"Malton":(54.136,-0.797),"Dungannon":(54.503,-6.767),"Speeton":(54.157,-0.239),"Bythorn":(52.373,-0.426),
"Billinge":(53.495,-2.712),"Hemingbrough":(53.769,-0.973),"Paull":(53.719,-0.231),"Poole":(50.715,-1.987),"Borough Green":(51.291,0.307),"Oldham":(53.541,-2.112),
"Humber Bridge":(53.715,-0.450),"Ganton":(54.183,-0.495),"Hook":(53.712,-0.877,1),"Shaw":(53.577,-2.094),"Glenferness":(57.47,-3.83),"Olton":(52.437,-1.807),
"Aldborough":(54.090,-1.381),"Upholland":(53.541,-2.721),"Tewkesbury":(51.992,-2.157),"Hutton Cranswick":(53.953,-0.437),"Farnborough":(51.293,-0.754),
"Brighton":(50.822,-0.137),"Kendal":(54.328,-2.746),"Hunmanby Gap":(54.169,-0.268),"Nafferton":(54.016,-0.391),"Whatton":(52.947,-0.892),"Aldershot":(51.248,-0.763),
"Malton–Sledmere road":(54.105,-0.690),"Acklam":(54.548,-1.257,1),"Tunstall":(53.769,-0.016),"Holderness":(53.80,-0.10,1),"Scalby":(54.297,-0.445),"Scawthorpe":(53.548,-1.152),
"Bournemouth":(50.720,-1.880),"South Yorkshire":(53.47,-1.30,1),"RAF Scampton":(53.307,-0.551),"Aston":(52.502,-1.884,1),"Brierley Hill":(52.481,-2.121),"Enfield":(51.652,-0.081),
"Buckton":(54.137,-0.205),"Swinemoor":(53.851,-0.415),"Ripon / Leeming":(54.20,-1.55,1),"Truro":(50.263,-5.051),"Jackson's Bay":(54.351,-0.443),"Northam":(51.040,-4.215),
"Bessingby":(54.075,-0.218),"Denbighshire moors":(53.05,-3.35,1),"Staxton":(54.200,-0.432),"Wroot":(53.508,-0.890),"Wardle":(53.648,-2.135),"Wilsthorpe":(54.066,-0.215),
"Ulrome":(53.988,-0.229),"Stainton Dale":(54.344,-0.474),"Crantock":(50.401,-5.112),"Bridlington Bay":(54.07,-0.15),"Flixton":(54.198,-0.381),"M62 near Hull":(53.73,-0.55,1),
"Flamborough Head":(54.116,-0.082),"Ganstead":(53.786,-0.256)}
def cat(t):
  s=t.lower()
  for c,pat in [("timeslip",r"time loss|missing time|time slip|out-of-body|blackout"),("poltergeist",r"poltergeist"),("encounter",r"beings|implant|green being|landing|two women|crash on the roof"),
   ("cryptid",r"cat|feline|cryptid|dogman|creature|animal|lynx|werewolf|wings|eyes|grunting"),("ghost",r"ghost|figure|apparition|shadow|doppel|festivities|visitor|forms|green man|hand"),
   ("craft",r"ufo|disc|triangle|tic-tac|cigar|craft|object|oval|rectangle|silver|ovoid|dot|ball in|shape|funnel|oblong|black ball|blob"),("lights",r"light|orb|glow|flash|sphere|rings|beam|balls")]:
    if re.search(pat,s): return c
  return "other"
out=[];miss=[]
for line in open('sinclair_raw.txt'):
  n,d,p,t=line.strip().split('|')
  g=G.get(p)
  if not g: miss.append(p);continue
  n=int(n);url=("https://truthproof.uk/Reports2/reprt%d.html"%n) if n>=34 else ("https://www.truthproof.uk/reports/reprt%d.html"%n)
  out.append([n,d,p,t,cat(t),g[0],g[1],1 if len(g)>2 else 0,url])
print(len(out),'missing',miss)
from collections import Counter;print(Counter(o[4] for o in out))
open('sinclair.js','w').write('const SINCLAIR='+json.dumps(out,ensure_ascii=False)+';\n')
