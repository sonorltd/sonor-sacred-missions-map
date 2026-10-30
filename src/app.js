__SITES__
__SINCLAIR__
const LEYS_EXTRA=__LEYS_EXTRA__;
const SITES_X=__SITES_X__;
const SINC_X=__SINC_X__;
const CATS={well:"Holy wells",falls:"Waterfalls",stone:"Stones & circles",lore:"Folklore places",spring:"Springs & spas",cave:"Caves",fort:"Hill forts"};
const PCATS={lights:"Lights & orbs",craft:"Craft & objects",encounter:"Close encounters",ghost:"Ghosts & figures",poltergeist:"Poltergeists",cryptid:"Cryptids & big cats",timeslip:"Time slips & missing time",ritual:"Occult & ritual sites",other:"Other phenomena"};
const LKINDS={major:"Major lines",ley:"Ley alignments",energy:"Energy lines",astro:"Astronomical"};
const LKCOL={major:0,ley:2,energy:6,astro:10};
const REGS={nw:"North Wales",wa:"Mid & South Wales",nwe:"North West England",yne:"Yorkshire & North East",mid:"Midlands",east:"East of England",sw:"South West England",se:"London & South East",sc:"Scotland",ie:"Ireland",im:"Isle of Man"};
const HOME={lat:53.1667,lon:-3.1417,label:"Home (Mold)"};
const lat0=55.2,lon0=-3.4,K=100,C=Math.cos(lat0*Math.PI/180);
const P=(lat,lon)=>[(lon-lon0)*C*K,-(lat-lat0)*K];
const UNP=(x,y)=>[lat0-y/K,lon0+x/(C*K)];
const rad=d=>d*Math.PI/180;
const miles=(a,b,c,d)=>{const x=Math.sin(rad(c-a)/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad(d-b)/2)**2;return 2*3958.8*Math.asin(Math.sqrt(x));};
const UPM=K/69;
const ROAD=1.3, MPH=38;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dirURL=(la,lo)=>`https://www.google.com/maps/dir/?api=1&destination=${la},${lo}`;
function segDist(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1];const l=dx*dx+dy*dy;let k=l?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l:0;k=Math.max(0,Math.min(1,k));return Math.hypot(p[0]-a[0]-k*dx,p[1]-a[1]-k*dy)}
const pathDist=(p,pts)=>{let m=Infinity;for(let i=1;i<pts.length;i++)m=Math.min(m,segDist(p,pts[i-1],pts[i]));return m};
const WB=[[51.35,-2.65],[51.8,-2.7],[52.0,-3.05],[52.4,-3.0],[52.8,-3.05],[52.95,-2.75],[53.15,-2.92],[53.45,-3.05]];
function walesBorder(lat){for(let i=1;i<WB.length;i++)if(lat<=WB[i][0]){const [a,b]=[WB[i-1],WB[i]];return a[1]+(b[1]-a[1])*(lat-a[0])/(b[0]-a[0])}return -3.05}
function regionOf(lat,lon){
  if(lat>54.0&&lat<54.45&&lon>-4.85&&lon<-4.3)return"im";
  if(lon<-5.4&&lat<55.4&&lat>51.3)return"ie";
  if(lat>55.8||(lat>54.95&&lon<-2.65)||(lat>55.3&&lon<-2.0))return"sc";
  if(lat>51.35&&lat<53.45&&lon<walesBorder(lat))return lat>=52.55?"nw":"wa";
  if(lat>=54.45)return lon<-2.5?"nwe":"yne";
  if(lat>=53.3&&lon>=-2.15)return(lon>-0.9&&lat<53.6)?"east":"yne";
  if(lat>=53.05&&lon<-2.15)return"nwe";
  if(lat>=51.65&&lon>-0.6)return"east";
  if(lat>=52.0)return"mid";
  return lon<-2.0?"sw":"se";
}
const yearOf=d=>{const m=String(d||"").match(/(1[0-9]{3}|20[0-9]{2})/);return m?+m[1]:null};
const eraOf=d=>{const y=yearOf(d);if(y==null)return"undated";if(y<1900)return"pre1900";return String(Math.floor(y/10)*10)};
const ERAS=["2020","2010","2000","1990","1980","1970","1960","1950","1940","1930","1920","1910","1900","pre1900","undated"];
const eraLabel=e=>e==="pre1900"?"Before 1900":e==="undated"?"Undated / ongoing":e+"s";
const today=()=>new Date().toISOString().slice(0,10);

// ---------- data ----------
const slugify=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const _seenKeys=new Set();
const sites=[...SITES,...SITES_X].map((s,i)=>{let key="s:"+slugify(s[0]);if(_seenKeys.has(key))key+="-"+i;_seenKeys.add(key);return{id:i,key,name:s[0],cat:s[1],lat:s[3],lon:s[4],desc:s[5],src:s[6]||null,mi:miles(HOME.lat,HOME.lon,s[3],s[4]),xy:P(s[3],s[4]),reg:regionOf(s[3],s[4])}});
const MAJOR_COL={belinus:0,michael:1,sarum:4,arbor:3};
const allLeys=[...LEYS.map(l=>({...l,kind:"major",col:MAJOR_COL[l.id]??0})),...LEYS_EXTRA.map((l,i)=>({...l,col:[2,5,6,8,9,10,11,7,3,4,1][i%11]}))];
const leys=allLeys.filter(l=>l.stops&&l.stops.length>=2).map(l=>{const axis=l.axis||null;const ends=axis||[[l.stops[0][1],l.stops[0][2]],[l.stops[l.stops.length-1][1],l.stops[l.stops.length-1][2]]];const a=P(...ends[0]),b=P(...ends[1]);const path=l.stops.map(s=>P(s[1],s[2]));return{...l,hasAxis:!!axis,a,b,path,mi:pathDist(P(HOME.lat,HOME.lon),path)/UPM}});
const leyOf=id=>leys.find(l=>l.id===id);
const leysNear=xy=>leys.filter(l=>pathDist(xy,l.path)/UPM<=3);
sites.forEach(s=>{s.leyIds=leysNear(s.xy).map(l=>l.id)});
leys.forEach(l=>{l.near=sites.filter(s=>pathDist(s.xy,l.path)/UPM<=3)});
const nearSacred=(lat,lon)=>sites.map(s=>({s,d:miles(lat,lon,s.lat,s.lon)})).filter(o=>o.d<=3).sort((a,b)=>a.d-b.d).slice(0,3);
const sinc=SINCLAIR.map(r0=>{const x=SINC_X[r0[0]];const r=x?[r0[0],r0[1],x.place||r0[2],r0[3],x.cat||r0[4],x.lat??r0[5],x.lon??r0[6],x.approx?1:0,r0[8]]:r0;const xy=P(r[5],r[6]);return{n:r[0],key:"p:"+r[0],date:r[1],place:r[2],title:r[3],cat:r[4],lat:r[5],lon:r[6],approx:!!r[7],url:r[8],summary:x&&x.summary||"",tags:x&&x.tags||[],xy,mi:miles(HOME.lat,HOME.lon,r[5],r[6]),reg:regionOf(r[5],r[6]),era:eraOf(r[1]),area:r0[2],leyIds:leysNear(xy).map(l=>l.id)}});
const sincById=new Map(sinc.map(r=>[r.n,r]));
// cross-links baked from the Missions Archive (tools/export_xlinks.py → data/xlinks.json)
const XL=__XLINKS__;XL.entities=XL.entities||{};XL.ce=XL.ce||{};XL.cc=XL.cc||{};XL.ee=XL.ee||{};
const caseIdOf=o=>o.n!=null?"sinclair-"+o.n:o.id;
const entsOf=o=>XL.ce[caseIdOf(o)]||[];
const objByCase=id=>{if(String(id).startsWith("sinclair-"))return sincById.get(+String(id).slice(9));return reports.find(r=>r.id===id)};
const kindOf=o=>o.n!=null?"sinc":"rep";
const entCount=e=>Object.values(XL.ce).filter(v=>v.includes(e)).length;
function normReport(id,v){const lat=+v.lat,lon=+v.lon;const xy=P(lat,lon);const tags=Array.isArray(v.tags)?[...new Set(v.tags.map(t=>String(t).toLowerCase().trim()).filter(Boolean))].slice(0,24):[];
  const okUrl=u=>/^https?:\/\//.test(String(u||""))?String(u):"";
  let sources=Array.isArray(v.sources)&&v.sources.length?v.sources.map(s=>({name:String(s&&s.name||""),url:okUrl(s&&s.url)})):[{name:String(v.source||""),url:okUrl(v.url)}];
  sources=sources.filter((s,i,a)=>(s.name||s.url)&&a.findIndex(x=>(x.url&&x.url===s.url)||(!x.url&&!s.url&&x.name===s.name))===i);
  return{id,key:"r:"+id,title:String(v.title||"Untitled"),cat:PCATS[v.cat]?v.cat:"other",date:String(v.date||""),place:String(v.place||""),desc:String(v.desc||""),source:sources[0]?.name||"",url:sources[0]?.url||"",sources,tags,mu:Array.isArray(v.mu)?v.mu.filter(m=>m&&okUrl(m.url)).map(m=>({show:String(m.show||"Mysterious Universe"),no:String(m.no||""),title:String(m.title||""),topic:String(m.topic||""),evidence:String(m.evidence||""),url:okUrl(m.url),date:String(m.date||""),plus:!!m.plus,excerpt:String(m.excerpt||"")})):[],lat,lon,xy,mi:miles(HOME.lat,HOME.lon,lat,lon),reg:regionOf(lat,lon),era:eraOf(v.date),area:areaOf(v.place),lead:/lead|unconfirmed/i.test(String(v.status||""))||(Array.isArray(v.tags)&&v.tags.includes("unconfirmed")),personal:v.by==="bryn"||/personal account/i.test(String(v.source||"")),leyIds:leysNear(xy).map(l=>l.id)}}

// ---------- marks: star / to visit / visited (saved per person) ----------
let marks={m:{},trips:[]}; let marksRef=null, marksTimer=null;
const LS="smm-marks";
try{const v=JSON.parse(localStorage.getItem(LS)||"null");if(v&&v.m)marks=v}catch(e){}
const mk_=k=>marks.m[k]||{};
const isStar=k=>!!mk_(k).s, isTodo=k=>!!mk_(k).t, isVis=k=>!!mk_(k).v;
let assetsApi=null;
function setNote(k,txt){const cur={...mk_(k)};if(txt)cur.n=txt.slice(0,4000);else delete cur.n;if(Object.keys(cur).length)marks.m[k]=cur;else delete marks.m[k];saveMarks()}
function visitBlock(k,again){const d=document.createElement("div");d.className="visit";const m=mk_(k);const ph=Array.isArray(m.ph)?m.ph:[];
  d.innerHTML=`<label class="meta" for="vn">Your notes</label><textarea id="vn" maxlength="4000" placeholder="What you found, access, conditions, what to try next time…">${esc(m.n||"")}</textarea>
   <div class="photos">${ph.map(id=>`<figure><a href="/_blob/${esc(id)}" target="_blank" rel="noopener"><img src="/_blob/${esc(id)}" alt="Visit photo" loading="lazy"></a><button type="button" class="phx" data-id="${esc(id)}" aria-label="Remove photo">×</button></figure>`).join("")}
   ${assetsApi?`<label class="btn phadd">+ Photo<input type="file" accept="image/*" multiple hidden></label>`:""}</div><div class="meta vmsg"></div>`;
  let t=null;d.querySelector("textarea").addEventListener("input",e=>{clearTimeout(t);const v=e.target.value;t=setTimeout(()=>{setNote(k,v.trim());d.querySelector(".vmsg").textContent="Saved"},600)});
  const fi=d.querySelector('input[type=file]');if(fi)fi.onchange=async()=>{const msg=d.querySelector(".vmsg");const files=[...fi.files].slice(0,6);
    for(const f of files){if(f.size>20*1024*1024){msg.textContent=f.name+" is over 20 MB, so it was skipped.";continue}
      msg.textContent="Uploading "+f.name+"…";try{const r=await assetsApi.upload(f);const cur={...mk_(k)};cur.ph=[...(cur.ph||[]),r.id].slice(-12);marks.m[k]=cur;saveMarks()}catch(e){msg.textContent="Couldn't upload "+f.name+". Try a smaller image."}}
    again()};
  d.querySelectorAll(".phx").forEach(b=>b.onclick=async()=>{if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="✓";return}const id=b.dataset.id;const cur={...mk_(k)};cur.ph=(cur.ph||[]).filter(x=>x!==id);marks.m[k]=cur;saveMarks();try{await assetsApi?.delete(id)}catch(e){}again()});
  return d}
function setMark(k,field,val){const cur={...mk_(k)};if(val)cur[field]=val;else delete cur[field];if(field==="v"&&val)delete cur.t;if(field==="t"&&val)delete cur.v;
  if(Object.keys(cur).length)marks.m[k]=cur;else delete marks.m[k];saveMarks()}
function saveMarks(){try{localStorage.setItem(LS,JSON.stringify(marks))}catch(e){}
  if(!marksRef)return;clearTimeout(marksTimer);marksTimer=setTimeout(async()=>{try{await marksRef.set({m:marks.m,trips:marks.trips,updated:Date.now()})}catch(e){}},700)}
const passStatus=k=>!F.status||(F.status==="star"&&isStar(k))||(F.status==="todo"&&isTodo(k))||(F.status==="vis"&&isVis(k))||(F.status==="notvis"&&!isVis(k));
function flagsHTML(k){const a=[];if(isStar(k))a.push('<span class="fs" title="Starred">★</span>');if(isTodo(k))a.push('<span class="ft" title="To visit">◷</span>');if(isVis(k))a.push('<span class="fv" title="Visited">✓</span>');return a.length?`<span class="flags">${a.join(" ")}</span> `:""}
function markClasses(u,k){u.classList.toggle("starred",isStar(k));u.classList.toggle("todo",isTodo(k));u.classList.toggle("visited",isVis(k))}
function marksBar(k,rerender){const d=document.createElement("div");d.className="marks";
  const v=mk_(k).v;
  d.innerHTML=`<button class="mkb star" aria-pressed="${isStar(k)}">${isStar(k)?"★ Starred":"☆ Star"}</button><button class="mkb todo" aria-pressed="${isTodo(k)}">To visit</button><button class="mkb vis" aria-pressed="${isVis(k)}">${v?"✓ Visited "+(typeof v==="string"?v.split("-").reverse().join("/"):""):"Visited"}</button><button class="mkb" data-trip="1">${inTrip(k)?"✓ In trip":"+ Add to trip"}</button>`;
  const [bs,bt,bv,bx]=d.querySelectorAll("button");
  bs.onclick=()=>{setMark(k,"s",isStar(k)?0:1);rerender()};
  bt.onclick=()=>{setMark(k,"t",isTodo(k)?0:1);rerender()};
  bv.onclick=()=>{setMark(k,"v",isVis(k)?0:today());rerender()};
  bx.onclick=()=>{toggleTrip(k);rerender()};
  return d}

// ---------- unified items (for the trip planner) ----------
function itemOf(k){const [t,id]=[k.slice(0,1),k.slice(2)];
  if(t==="s"){const s=sites.find(x=>x.key===k);return s&&{key:k,name:s.name,lat:s.lat,lon:s.lon,xy:s.xy,sym:"s-"+s.cat,sub:CATS[s.cat],open:()=>{location.hash="sacred";setTimeout(()=>select({kind:"site",id:s.id},true),0)}}}
  if(t==="p"){const r=sincById.get(+id);return r&&{key:k,name:r.title+" · "+r.place,lat:r.lat,lon:r.lon,xy:r.xy,sym:"s-p-"+r.cat,sub:"Sinclair #"+r.n,open:()=>{location.hash="sinclair";setTimeout(()=>select({kind:"sinc",id:r.n},true),0)}}}
  if(t==="r"){const r=reports.find(x=>x.id===id);return r&&{key:k,name:r.title,lat:r.lat,lon:r.lon,xy:r.xy,sym:"s-p-"+r.cat,sub:PCATS[r.cat]+" · "+r.place,open:()=>{location.hash=viewOf(r);setTimeout(()=>select({kind:"rep",id:r.id},true),0)}}}
  return null}
const allKeys=()=>[...sites.map(s=>s.key),...reports.map(r=>r.key),...sinc.filter(r=>!r.approx).map(r=>r.key)];

// ---------- state ----------
let tab="sacred";
const F={reg:"",dist:0,era:"",area:"",src:"",ent:"",hotAll:false,tagMode:"any",tagsOpen:false,nearLey:false,status:"",tags:new Set(),sort:{sacred:"group",sinclair:"group",paranormal:"group"},showLeysOther:false};
const st={
  sacred:{on:new Set(Object.keys(CATS)),kinds:new Set(Object.keys(LKINDS)),leysOnly:false,q:""},
  sinclair:{on:new Set(Object.keys(PCATS)),q:"",sacredNear:false},
  paranormal:{on:new Set(Object.keys(PCATS)),q:"",withSinc:false},
  mu:{on:new Set(Object.keys(PCATS)),q:"",withSinc:false},
  ritual:{on:new Set(Object.keys(PCATS)),q:"",withSinc:false},
  trip:{q:""},
  sky:{q:""}
};
let sel=null;
let reports=[]; let db=null, user=null, canWrite=false, myId=null; let dbState="loading";
let picking=null, pinU=null, formOpen=false, editing=null, formDraft=null;
const trip={start:{...HOME},stops:[],round:true,pool:new Set(["todo","star"]),radius:50,max:8,skipVis:true,name:""};
const inTrip=k=>trip.stops.includes(k);
function toggleTrip(k){const i=trip.stops.indexOf(k);if(i>=0)trip.stops.splice(i,1);else trip.stops.push(k)}
const visibleLeys=()=>leys.filter(l=>st.sacred.kinds.has(l.kind));
const leysShown=()=>tab==="sacred"||F.showLeysOther;
const passCommon=o=>(!F.reg||o.reg===F.reg)&&(!F.dist||o.mi<=F.dist)&&(!F.nearLey||o.leyIds.some(id=>visibleLeys().some(l=>l.id===id)))&&passStatus(o.key);
const passEra=o=>(!F.era||o.era===F.era)&&(!F.area||o.area===F.area)&&passSrc(o)&&(!F.ent||entsOf(o).includes(F.ent));
const passSrc=o=>!F.src||!o.sources||(F.src==="mu"?(o.mu||[]).length>0:F.src==="multi"?(o.sources||[]).length>1:F.src==="lead"?!!o.lead:F.src==="personal"?!!o.personal:F.src==="single"?(o.sources||[]).length<=1:true);
const passTags=o=>!F.tags.size||(F.tagMode==="all"?[...F.tags].every(t=>o.tags.includes(t)):o.tags.some(t=>F.tags.has(t)));

// ---------- map ----------
const svg=document.getElementById("map"), NS="http://www.w3.org/2000/svg";
const VIEWS={all:[-300,-575,600,1120],nw:[-56,-275,130,95],wa:[-150,-290,240,370],en:[-215,-230,420,560],yk:[95,30,140,150],sc:[-225,-580,380,540]};
let vb=[...VIEWS.all];
const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};
const g=document.getElementById("grat");
for(let la=50;la<=60;la++){const a=P(la,-11),b=P(la,3);el("line",{class:"graticule",x1:a[0],y1:a[1],x2:b[0],y2:b[1]},g)}
for(let lo=-8;lo<=2;lo+=2){const a=P(49,lo),b=P(61,lo);el("line",{class:"graticule",x1:a[0],y1:a[1],x2:b[0],y2:b[1]},g)}
const L=document.getElementById("labels");
[["CYMRU",52.45,-3.85],["ENGLAND",52.6,-1.2],["SCOTLAND",57.0,-4.2],["IRISH SEA",53.8,-4.9],["NORTH SEA",55.2,1.0]].forEach(([t,la,lo])=>{const p=P(la,lo);const e=el("text",{class:"reglabel","text-anchor":"middle",x:p[0],y:p[1]},L);e.textContent=t});

const LG=document.getElementById("leys");
leys.forEach(l=>{const gg=el("g",{class:"leyg",style:`--c:var(--l${l.col})`},LG);l.g=gg;
  if(l.hasAxis&&l.stops.length>2)el("line",{class:"leyaxis",x1:l.a[0],y1:l.a[1],x2:l.b[0],y2:l.b[1]},gg);
  const pts=l.path.map(p=>p.join(",")).join(" ");
  l.line=el("polyline",{class:"leyline",points:pts},gg);
  const hit=el("polyline",{class:"leyhit",points:pts},gg);
  hit.addEventListener("click",e=>{e.stopPropagation();if(!moved&&!picking)select({kind:"ley",id:l.id},false)});
  l.su=l.stops.map(s=>{const u=el("use",{href:"#s-ley",class:"leystop"},gg);u._p=P(s[1],s[2]);el("title",{},u).textContent=s[0]+" · "+l.name;
    u.addEventListener("click",e=>{e.stopPropagation();if(!moved&&!picking)select({kind:"ley",id:l.id},false)});return u});
  let mi=Math.floor(l.path.length/2);const A=l.path[Math.max(0,mi-1)],B=l.path[Math.min(l.path.length-1,mi)];
  const mid=l.path.length>2?[(A[0]+B[0])/2,(A[1]+B[1])/2]:[(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2];
  let ang=Math.atan2(B[1]-A[1],B[0]-A[0])*180/Math.PI;if(ang>90)ang-=180;if(ang<-90)ang+=180;
  l.tag=el("text",{class:"leytag","text-anchor":"middle",transform:`translate(${mid[0]},${mid[1]}) rotate(${ang})`,dy:"-0.5em"},gg);l.tag.textContent=l.name;});

const RG=el("g",{id:"route"},document.getElementById("world"));document.getElementById("world").insertBefore(RG,document.getElementById("marks"));
const M=document.getElementById("marks");
const hp=P(HOME.lat,HOME.lon); const homeU=el("use",{href:"#s-home"},M); el("title",{},homeU).textContent="Home (Mold)";
let markers=[]; let numLabels=[];
function mk(sym,xy,title,onClick,extra={}){const u=el("use",{href:"#"+sym,class:"mk"},M);el("title",{},u).textContent=title;
  if(extra.key&&align.mode&&align.keys.includes(extra.key))u.classList.add("tripstop");
  u.addEventListener("click",e=>{e.stopPropagation();if(moved||picking)return;if(align.mode&&extra.key){const i=align.keys.indexOf(extra.key);if(i>=0)align.keys.splice(i,1);else align.keys.push(extra.key);render();return}onClick()});return{u,xy,...extra}}

function pxPerUnit(){return svg.clientWidth/vb[2]}
function placeMarkers(){
  const u=1/pxPerUnit(); const sz=(window.innerWidth<600?20:18)*u;
  const groups=new Map();
  markers.forEach(m=>{const k=m.xy[0].toFixed(2)+","+m.xy[1].toFixed(2);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(m)});
  groups.forEach(arr=>arr.forEach((m,i)=>{let ox=0,oy=0;if(i>0){const a=i*2.4,r=sz*0.55*Math.sqrt(i);ox=Math.cos(a)*r;oy=Math.sin(a)*r}
    const z=m.sel?sz*1.45:sz*(m.small?0.8:1);m.u.setAttribute("x",m.xy[0]+ox-z/2);m.u.setAttribute("y",m.xy[1]+oy-z/2);m.u.setAttribute("width",z);m.u.setAttribute("height",z);m._c=[m.xy[0]+ox,m.xy[1]+oy]}));
  numLabels.forEach(n=>{const z=sz*0.62;const c=n.m._c||n.m.xy;n.bg.setAttribute("cx",c[0]+z*0.75);n.bg.setAttribute("cy",c[1]-z*0.75);n.bg.setAttribute("r",z*0.55);n.t.setAttribute("x",c[0]+z*0.75);n.t.setAttribute("y",c[1]-z*0.75);n.t.setAttribute("font-size",z*0.75)});
  leys.forEach(l=>{const z=sz*0.62;l.su.forEach(s=>{s.setAttribute("x",s._p[0]-z/2);s.setAttribute("y",s._p[1]-z/2);s.setAttribute("width",z);s.setAttribute("height",z)});l.tag.setAttribute("font-size",12*u)});
  homeU.setAttribute("x",hp[0]-sz/2);homeU.setAttribute("y",hp[1]-sz/2);homeU.setAttribute("width",sz);homeU.setAttribute("height",sz);
  if(pinU){const z=sz*1.4;pinU.setAttribute("x",pinU._p[0]-z/2);pinU.setAttribute("y",pinU._p[1]-z);pinU.setAttribute("width",z);pinU.setAttribute("height",z)}
  L.querySelectorAll("text").forEach(t=>t.setAttribute("font-size",13*u));
  const target=80*u/UPM; const opts=[1,2,5,10,20,25,50,100,200];
  const m=opts.reduce((a,b)=>Math.abs(b-target)<Math.abs(a-target)?b:a);
  document.getElementById("scale").innerHTML=m+" miles<i style=\"width:"+(m*UPM*pxPerUnit()).toFixed(0)+"px\"></i>";
}
function applyVB(){
  const ar=svg.clientHeight/svg.clientWidth||1; const cx=vb[0]+vb[2]/2, cy=vb[1]+vb[3]/2;
  let w=vb[2],h=vb[3]; if(h/w>ar) w=h/ar; else h=w*ar; vb=[cx-w/2,cy-h/2,w,h];
  svg.setAttribute("viewBox",vb.join(" ")); placeMarkers();
}
let anim=null;
function goTo(target,ms=450){cancelAnimationFrame(anim);const from=[...vb];const t0=performance.now();
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)ms=0;
  const step=now=>{const k=ms?Math.min(1,(now-t0)/ms):1;const e=1-Math.pow(1-k,3);vb=from.map((v,i)=>v+(target[i]-v)*e);applyVB();if(k<1)anim=requestAnimationFrame(step)};anim=requestAnimationFrame(step)}
function zoomAt(f,cx,cy){const w=Math.min(1400,Math.max(8,vb[2]*f));f=w/vb[2];vb=[cx-(cx-vb[0])*f,cy-(cy-vb[1])*f,vb[2]*f,vb[3]*f];applyVB();setReg(null)}
function toSvg(x,y){const r=svg.getBoundingClientRect();return[vb[0]+(x-r.left)/r.width*vb[2],vb[1]+(y-r.top)/r.height*vb[3]]}
function scrollToMap(){if(window.innerWidth<=860)document.querySelector(".mapbox").scrollIntoView({behavior:"smooth",block:"start"})}
function flyTo(xy,w=60){w=Math.min(vb[2],w);const ar=svg.clientHeight/svg.clientWidth;goTo([xy[0]-w/2,xy[1]-w*ar*0.4,w,w*ar]);setReg(null);scrollToMap()}
function fitPoints(pts){if(!pts.length)return;let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;pts.forEach(p=>{x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])});
  const pad=Math.max(12,(x1-x0)*0.12,(y1-y0)*0.12);let w=Math.max(x1-x0+pad*2,40),h=Math.max(y1-y0+pad*2,40);const ar=svg.clientHeight/svg.clientWidth;if(h/w>ar)w=h/ar;else h=w*ar;
  goTo([(x0+x1)/2-w/2,(y0+y1)/2-h/2,w,h]);setReg(null)}

const ptrs=new Map(); let moved=false, pinch0=null;
svg.addEventListener("pointerdown",e=>{svg.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);moved=false;if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0={d:Math.hypot(a[0]-b[0],a[1]-b[1])}}});
svg.addEventListener("pointermove",e=>{if(!ptrs.has(e.pointerId))return;const prev=ptrs.get(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===1){const dx=e.clientX-prev[0],dy=e.clientY-prev[1];if(Math.abs(dx)+Math.abs(dy)>1){moved=true;svg.classList.add("drag")}const u=vb[2]/svg.clientWidth;vb[0]-=dx*u;vb[1]-=dy*u;applyVB();setReg(null)}
  else if(ptrs.size===2&&pinch0){moved=true;const [a,b]=[...ptrs.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);const c=toSvg((a[0]+b[0])/2,(a[1]+b[1])/2);zoomAt(pinch0.d/d,c[0],c[1]);pinch0.d=d}});
const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=null;svg.classList.remove("drag")};
svg.addEventListener("pointerup",up);svg.addEventListener("pointercancel",up);
svg.addEventListener("click",e=>{if(moved)return;
  if(picking){const p=toSvg(e.clientX,e.clientY);const [la,lo]=UNP(p[0],p[1]);const fn=picking;stopPick();fn(+la.toFixed(5),+lo.toFixed(5));return}
  if(!e.target.closest(".mk"))closeCard()});
svg.addEventListener("wheel",e=>{e.preventDefault();const c=toSvg(e.clientX,e.clientY);zoomAt(Math.exp(e.deltaY*0.0015),c[0],c[1])},{passive:false});
document.getElementById("zin").onclick=()=>zoomAt(0.66,vb[0]+vb[2]/2,vb[1]+vb[3]/2);
document.getElementById("zout").onclick=()=>zoomAt(1.5,vb[0]+vb[2]/2,vb[1]+vb[3]/2);
const regBox=document.getElementById("reg"); const regBtns={};
[["all","All"],["nw","N Wales"],["wa","Wales"],["en","England"],["yk","Yorkshire"],["sc","Scotland"]].forEach(([k,t])=>{const b=document.createElement("button");b.textContent=t;b.onclick=()=>{setReg(k);goTo(VIEWS[k])};regBox.appendChild(b);regBtns[k]=b});
function setReg(k){for(const r in regBtns)regBtns[r].setAttribute("aria-pressed",String(r===k))}

// ---------- shared UI ----------
const icon=(sym,style="")=>`<svg viewBox="-10 -10 20 20" aria-hidden="true" ${style}><use href="#${sym}" x="-10" y="-10" width="20" height="20"/></svg>`;
const smallIcon=sym=>icon(sym,'style="width:14px;height:14px;vertical-align:-2px"');
const leyIcon=l=>icon("s-leyicon",`style="color:var(--l${l.col})"`);
const $=id=>document.getElementById(id);
function chip(html,pressed,onClick){const b=document.createElement("button");b.className="chip";b.setAttribute("aria-pressed",String(pressed));b.innerHTML=html;b.onclick=onClick;$("chips").appendChild(b);return b}
function chipsFor(defs,counts,set,iconFn){const box=$("chips");box.innerHTML="";
  for(const c in defs)chip(iconFn(c)+esc(defs[c])+" <b>"+(counts[c]||0)+"</b>",set.has(c),()=>{set.has(c)?set.delete(c):set.add(c);render()})}
function leyChip(){chip(icon("s-leyicon",`style="color:var(--l0)"`)+"Ley lines <b>"+leys.length+"</b>",F.showLeysOther,()=>{F.showLeysOther=!F.showLeysOther;render()})}
function row(iconHTML,name,mi,desc,isSel,onClick,cls="",key){const li=document.createElement("li");li.className="row"+(isSel?" sel":"")+cls;li.tabIndex=0;
  li.innerHTML=iconHTML+`<span class="nm"></span><span class="mi"></span><span class="ds"></span>`;
  const nm=li.querySelector(".nm");nm.innerHTML=key?flagsHTML(key):"";nm.appendChild(document.createTextNode(name));li.querySelector(".mi").textContent=mi;li.querySelector(".ds").textContent=desc;
  li.onclick=onClick;li.onkeydown=e=>{if(e.key==="Enter")onClick()};return li}
function section(title,items){if(!items.length)return;const list=$("list");const h=document.createElement("h2");h.textContent=title+" · "+items.length;list.appendChild(h);const ol=document.createElement("ol");items.forEach(i=>ol.appendChild(i));list.appendChild(ol)}
function groupBy(arr,keyFn,order){const m=new Map();arr.forEach(x=>{const k=keyFn(x);if(!m.has(k))m.set(k,[]);m.get(k).push(x)});return order?order.filter(k=>m.has(k)).map(k=>[k,m.get(k)]):[...m.entries()]}
function sortItems(arr,mode){const a=[...arr];if(mode==="near")a.sort((x,y)=>x.mi-y.mi);else if(mode==="new")a.sort((x,y)=>(yearOf(y.date)??-1e9)-(yearOf(x.date)??-1e9)||String(y.date).localeCompare(String(x.date)));else if(mode==="old")a.sort((x,y)=>(yearOf(x.date)??1e9)-(yearOf(y.date)??1e9));else if(mode==="az")a.sort((x,y)=>String(x.title||x.name).localeCompare(String(y.title||y.name)));return a}
const isSel=(kind,id)=>!!sel&&sel.kind===kind&&sel.id===id;
function closeCard(){$("card").hidden=true;if(sel){sel=null;render()}}
function card(html){const c=$("card");c.innerHTML=`<button class="x" aria-label="Close">×</button>`+html;c.hidden=false;c.querySelector(".x").onclick=closeCard;return c}
function addMarks(c,k,again){const slot=c.querySelector(".mslot");if(!slot)return;const wrap=document.createElement("div");wrap.appendChild(marksBar(k,()=>{render();again()}));if(isVis(k)||mk_(k).n||(mk_(k).ph||[]).length)wrap.appendChild(visitBlock(k,again));else{const b=document.createElement("button");b.className="linkbtn";b.type="button";b.textContent="Add notes or photos";b.onclick=()=>{b.replaceWith(visitBlock(k,again))};wrap.appendChild(b)}slot.replaceWith(wrap)}
const nearHTML=(lat,lon,leyIds)=>{const n=nearSacred(lat,lon);const ls=(leyIds||[]).map(leyOf).filter(Boolean);
  return(n.length||ls.length)?`<div>${ls.map(l=>`<span class="tag"><span class="sw" style="--c:var(--l${l.col})"></span> Within 3 mi of the ${esc(l.name)}</span>`).join("")}${n.map(o=>`<span class="tag">${Math.max(0.1,o.d).toFixed(1)} mi from ${esc(o.s.name)}</span>`).join("")}</div>`:""};
const tagLabel=t=>t.replace(/-/g," ");
const TAG_GROUPS=__TAG_GROUPS__;const TAG_GROUP_OF={};Object.entries(TAG_GROUPS).forEach(([g,ts])=>ts.forEach(t=>TAG_GROUP_OF[t]=g));
const areaOf=p=>{const parts=String(p||"").split(",").map(x=>x.replace(/\(.*?\)/g,"").replace(/^\s*(near|nr\.?|off|above|below)\s+/i,"").trim()).filter(Boolean);return parts.length?parts[parts.length-1]:""};

// ---------- filter bar ----------
const fReg=$("f-reg"),fDist=$("f-dist"),fEra=$("f-era"),fSort=$("f-sort"),fLey=$("f-ley");
const fStatus=document.createElement("select");fStatus.id="f-status";fStatus.setAttribute("aria-label","Status");
fStatus.innerHTML=`<option value="">Any status</option><option value="star">★ Starred</option><option value="todo">To visit</option><option value="vis">Visited</option><option value="notvis">Not visited</option>`;
fDist.after(fStatus);
const fArea=document.createElement("select");fArea.id="f-area";fArea.setAttribute("aria-label","Area");fEra.after(fArea);
const fSrc=document.createElement("select");fSrc.id="f-src";fSrc.setAttribute("aria-label","Sources");fArea.after(fSrc);
fSrc.innerHTML=`<option value="">Any source</option><option value="mu">On Mysterious Universe</option><option value="multi">Several sources</option><option value="single">Single source</option><option value="lead">Unconfirmed leads</option><option value="personal">Personal accounts</option>`;
fArea.onchange=()=>{F.area=fArea.value;render();fitToShown()};fSrc.onchange=()=>{F.src=fSrc.value;render()};
fReg.innerHTML=`<option value="">All regions</option>`+Object.entries(REGS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
fReg.onchange=()=>{F.reg=fReg.value;render();fitToShown()};
fDist.onchange=()=>{F.dist=+fDist.value;render();fitToShown()};
fStatus.onchange=()=>{F.status=fStatus.value;render()};
fEra.onchange=()=>{F.era=fEra.value;render()};
fSort.onchange=()=>{F.sort[tab]=fSort.value;render()};
fLey.onchange=()=>{F.nearLey=fLey.checked;render()};
$("f-clear").onclick=()=>{F.reg="";F.dist=0;F.era="";F.area="";F.src="";F.ent="";F.tagMode="any";F.status="";F.nearLey=false;F.tags.clear();st[tab].q="";$("q").value="";
  if(tab==="sacred"){st.sacred.on=new Set(Object.keys(CATS));st.sacred.kinds=new Set(Object.keys(LKINDS));st.sacred.leysOnly=false}else if(st[tab].on)st[tab].on=new Set(Object.keys(PCATS));render()};
function fitToShown(){const pts=markers.filter(m=>!m.overlay).map(m=>m.xy);if(F.reg||F.dist||F.area)fitPoints(F.dist?[...pts,hp]:pts)}
function syncFilterBar(pool){
  $("filters").hidden=tab==="trip"||tab==="sky";$("tools").hidden=tab==="trip"||tab==="sky";
  fReg.value=F.reg;fDist.value=String(F.dist);fStatus.value=F.status;fLey.checked=F.nearLey;
  [fReg,fDist,fStatus].forEach(s=>s.classList.toggle("on",!!s.value&&s.value!=="0"));
  fEra.hidden=tab==="sacred";
  if(tab!=="sacred"){const have=new Set(pool.map(o=>o.era));fEra.innerHTML=`<option value="">Any era</option>`+ERAS.filter(e=>have.has(e)).map(e=>`<option value="${e}">${eraLabel(e)}</option>`).join("");fEra.value=F.era;fEra.classList.toggle("on",!!F.era)}
  fArea.hidden=tab==="sacred";fSrc.hidden=!["paranormal","mu","ritual"].includes(tab);
  if(tab!=="sacred"){const ac={};pool.forEach(o=>{if(o.area)ac[o.area]=(ac[o.area]||0)+1});const areas=Object.entries(ac).filter(([a,n])=>n>=2||a===F.area).sort((a,b)=>a[0].localeCompare(b[0]));
    fArea.innerHTML=`<option value="">Any area (${areas.length})</option>`+areas.map(([a,n])=>`<option value="${esc(a)}">${esc(a)} (${n})</option>`).join("");fArea.value=F.area;fArea.classList.toggle("on",!!F.area)}
  fSrc.value=F.src;fSrc.classList.toggle("on",!!F.src);
  const sorts=tab==="sacred"?[["group","Group by region"],["near","Nearest first"],["az","A–Z"]]:[["group",tab==="sinclair"?"Group by place":tab==="mu"?"Group by episode":tab==="ritual"?"Group by kind":"Group by type"],["new","Newest first"],["old","Oldest first"],["near","Nearest first"],["az","A–Z"]];
  fSort.innerHTML=sorts.map(([k,v])=>`<option value="${k}">${v}</option>`).join("");fSort.value=F.sort[tab]||"group";
}
function renderTagRow(pool){const box=$("tagrow");box.innerHTML="";if(!["paranormal","sinclair","mu","ritual"].includes(tab))return;
  const counts={};pool.forEach(r=>(r.tags||[]).forEach(t=>counts[t]=(counts[t]||0)+1));
  [...F.tags].forEach(t=>{if(!counts[t])F.tags.delete(t)});
  if(!Object.keys(counts).length)return;
  const head=document.createElement("div");head.className="taghead";
  head.innerHTML=`<button type="button" class="linkbtn" id="tg-open" aria-expanded="${F.tagsOpen}">${F.tagsOpen?"▾":"▸"} Tags${F.tags.size?` · <b>${F.tags.size} on</b>`:""}</button>`+(F.tags.size>1?`<span class="seg"><button type="button" data-m="any" aria-pressed="${F.tagMode==="any"}">Any</button><button type="button" data-m="all" aria-pressed="${F.tagMode==="all"}">All</button></span>`:"")+(F.tags.size?`<button type="button" class="linkbtn" id="tg-clear">clear tags</button>`:"")
    +(!F.tagsOpen&&F.tags.size?[...F.tags].map(t=>`<button type="button" class="tg" aria-pressed="true" data-t="${esc(t)}">${esc(tagLabel(t))} ×</button>`).join(""):"");
  box.appendChild(head);
  head.querySelector("#tg-open").onclick=()=>{F.tagsOpen=!F.tagsOpen;render()};
  head.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>{F.tagMode=b.dataset.m;render()});
  head.querySelectorAll(".tg").forEach(b=>b.onclick=()=>{F.tags.delete(b.dataset.t);render()});
  if(head.querySelector("#tg-clear"))head.querySelector("#tg-clear").onclick=()=>{F.tags.clear();render()};
  if(!F.tagsOpen)return;
  const groups={};Object.keys(counts).forEach(t=>{const g=TAG_GROUP_OF[t]||"Other";(groups[g]||=[]).push(t)});
  [...Object.keys(TAG_GROUPS),"Other"].filter(g=>groups[g]).forEach(g=>{const row=document.createElement("div");row.className="taggroup";row.innerHTML=`<div class="tgl">${esc(g)}</div>`;
    groups[g].sort((a,b)=>counts[b]-counts[a]||a.localeCompare(b)).forEach(t=>{const b=document.createElement("button");b.type="button";b.className="tg";b.setAttribute("aria-pressed",String(F.tags.has(t)));
      b.innerHTML=esc(tagLabel(t))+" <b>"+counts[t]+"</b>";b.onclick=()=>{F.tags.has(t)?F.tags.delete(t):F.tags.add(t);render()};row.appendChild(b)});box.appendChild(row)});
}
function setCount(n,total,noun){$("count").textContent=n===total?`${total} ${noun}`:`Showing ${n} of ${total} ${noun}`}
function drawLeys(dimAll){
  const show=leysShown();LG.style.display=show?"":"none";if(!show)return;
  const q=tab==="sacred"?st.sacred.q:"";
  const vis=visibleLeys().filter(l=>(!F.reg||l.stops.some(s=>regionOf(s[1],s[2])===F.reg))&&(!F.dist||l.mi<=F.dist)&&(!q||(l.name+" "+l.desc+" "+l.stops.map(s=>s[0]).join(" ")).toLowerCase().includes(q)));
  const ids=new Set(vis.map(l=>l.id));
  leys.forEach(l=>{l.g.style.display=ids.has(l.id)?"":"none";l.line.classList.toggle("sel",isSel("ley",l.id));l.g.classList.toggle("dim",(!!sel&&sel.kind==="ley"&&sel.id!==l.id)||!!dimAll)});
  return vis}

// ---------- tabs ----------
const TABS={
 sacred:{sub:"Holy wells, waterfalls, stones, caves, hill forts, folklore places and ley lines across Wales, England, Scotland and beyond, measured from home in Flintshire.",
   note:"Distances are straight-line miles from Mold. Regions are worked out from each pin's position, so places right on a border can land either side. Some wells sit on private land or open only on set days. Ley lines are proposed alignments traced by researchers and dowsers, not archaeological fact: each joins the places its author names, and the long major lines show a faint dotted straight axis. Stars, to-visit and visited marks are saved to your account."},
 sinclair:{sub:"Sightings and experiences collected by Bridlington researcher Paul Sinclair on his Truth Proof site, most of them around Bempton, Flamborough and the Wolds.",
   note:"Pins sit at the place named in each report. Where a report names only an area (East Yorks, West Yorkshire) or a place name that could mean more than one town, the pin is approximate and marked “area only”. Ten reports from outside Britain and Ireland aren't mapped. Categories are assigned from each report's title."},
 paranormal:{sub:"__PARA_SUB__",
   note:"Gathered from press reports, official files, Wikipedia and research sites. Where several sources cover the same case they're merged into one report with every source listed. Reports are claims as reported; the “explained” tag marks cases with an official or likely explanation."},
 mu:{sub:"Places covered on the Mysterious Universe podcast — each pin opens the case with the episodes and only the part of the show notes about it.",
   note:"Episodes are matched to cases from their show notes in the Missions Archive; generic subject episodes (Loch Ness, Cannock Chase…) sit with the place rather than every sighting. Group by episode to see every place an episode covers."},
 ritual:{sub:"Satanic, black-magic and occult ritual sites, Hellfire Clubs, Crowley's haunts and the witch-trial places — as reported, with sources.",
   note:"Includes everything in the Occult & ritual category plus any report tagged satanic, black magic, occult, desecration, witchcraft or witch trial. Reports are claims as reported; some desecrations were never solved and some were later put down to vandals or hoaxers."},
 sky:{sub:"Solstices, equinoxes, fire festivals, moon phases and meteor showers, with the sites built to catch the sun and moon and when to be there.",
   note:"Dates are calculated in the page and are good to within a day; sunrise and sunset times assume a flat horizon, so hills will shift them a few minutes. Dashed rays on the map show this year's solstice sunrise or sunset direction from each aligned site (gold for midsummer, blue for midwinter)."},
 trip:{sub:"Plan a day out. Pick a start point, choose what to include, and the planner orders the stops into the shortest loop it can find.",
   note:"Distances are straight-line; drive times assume roads run about 30% longer than the crow flies at an average of 38 mph, so treat them as rough. Google Maps takes up to 9 stops per link, so longer trips open in parts. Saved trips are kept with your marks."}
};
let started=false;
function setTab(t){if(!TABS[t])t="sacred";const changed=t!==tab||!started;tab=t;sel=null;$("card").hidden=true;formOpen=false;editing=null;stopPick();clearPin();
  for(const k in TABS)$("t-"+k).setAttribute("aria-current",k===t?"page":"false");
  $("sub").textContent=TABS[t].sub;$("note").textContent=TABS[t].note;$("q").value=st[t].q||"";
  render();
  if(changed){if(t==="trip"&&trip.stops.length)fitTrip();else{goTo(VIEWS.all,started?450:0);setReg("all")}}started=true}
window.addEventListener("hashchange",()=>setTab(location.hash.slice(1)));
$("q").addEventListener("input",e=>{st[tab].q=e.target.value.trim().toLowerCase();render()});

function render(){
  M.querySelectorAll(".mk").forEach(n=>n.remove());numLabels.forEach(n=>{n.bg.remove();n.t.remove()});numLabels=[];RG.innerHTML="";HG.innerHTML="";markers=[];$("list").innerHTML="";$("count").textContent="";
  ({sacred:renderSacred,sinclair:renderSinclair,paranormal:renderParanormal,mu:renderParanormal,ritual:renderParanormal,sky:renderSky,trip:renderTrip})[tab]();drawAlign();
  if(pinU)M.appendChild(pinU);
  const s=markers.find(m=>m.sel);if(s)M.appendChild(s.u);
  if(!$("list").children.length&&tab!=="trip"&&tab!=="sky")$("list").innerHTML='<p class="meta">Nothing matches. Loosen a filter or press Clear filters.</p>';
  applyVB();
}

// ----- Sacred -----
function renderSacred(){const S=st.sacred;
  $("intro").innerHTML="";$("formbox").innerHTML="";
  const q=S.q;
  const base=sites.filter(s=>passCommon(s)&&(!q||(s.name+" "+s.desc).toLowerCase().includes(q)));
  const counts={};base.forEach(s=>counts[s.cat]=(counts[s.cat]||0)+1);
  $("chips").innerHTML="";
  chip(icon("s-leyicon",`style="color:var(--l0)"`)+"Leys only",S.leysOnly,()=>{S.leysOnly=!S.leysOnly;render()});
  if(!S.leysOnly)for(const c in CATS)chip(icon("s-"+c)+esc(CATS[c])+" <b>"+(counts[c]||0)+"</b>",S.on.has(c),()=>{S.on.has(c)?S.on.delete(c):S.on.add(c);render()});
  const lk={};leys.forEach(l=>lk[l.kind]=(lk[l.kind]||0)+1);
  for(const k in LKINDS){if(!lk[k])continue;chip(icon("s-leyicon",`style="color:var(--l${LKCOL[k]})"`)+esc(LKINDS[k])+" <b>"+lk[k]+"</b>",S.kinds.has(k),()=>{S.kinds.has(k)?S.kinds.delete(k):S.kinds.add(k);render()})}
  $("opt1").innerHTML="";
  syncFilterBar(sites);renderTagRow([]);
  const shown=S.leysOnly?[]:base.filter(s=>S.on.has(s.cat));
  if(align.mode)$("intro").appendChild(alignPanel());
  else{const b=document.createElement("button");b.className="btn";b.type="button";b.textContent="Check an alignment";b.style.marginBottom="10px";b.onclick=()=>{align.mode=true;align.keys=[];closeCard();render()};$("intro").appendChild(b)}
  shown.forEach(s=>{const m=mk("s-"+s.cat,s.xy,s.name,()=>select({kind:"site",id:s.id},false),{key:s.key});m.sel=isSel("site",s.id);m.u.classList.toggle("sel",m.sel);markClasses(m.u,s.key);markers.push(m)});
  const vis=drawLeys()||[];
  setCount(S.leysOnly?vis.length:shown.length,S.leysOnly?leys.length:sites.length,S.leysOnly?"ley lines":"places");
  section("Ley lines",[...vis].sort((a,b)=>a.mi-b.mi).map(l=>row(leyIcon(l),l.name,Math.round(l.mi)+" mi",`${LKINDS[l.kind]} · ${l.stops.length} points · ${l.near.length} map sites within 3 mi · ${l.who||""}`,isSel("ley",l.id),()=>select({kind:"ley",id:l.id},true))));
  if(S.leysOnly)return;
  const mkRow=s=>row(icon("s-"+s.cat),s.name,Math.round(s.mi)+" mi",s.desc,isSel("site",s.id),()=>select({kind:"site",id:s.id},true),isVis(s.key)?" visited":"",s.key);
  if(F.sort.sacred==="group")groupBy(shown,s=>s.reg,Object.keys(REGS)).forEach(([r,arr])=>section(REGS[r],arr.sort((a,b)=>a.mi-b.mi).map(mkRow)));
  else section(F.sort.sacred==="near"?"Nearest first":"A–Z",sortItems(shown,F.sort.sacred).map(mkRow));
}
function siteCard(s){
  const sincNear=sinc.filter(r=>!r.approx&&miles(r.lat,r.lon,s.lat,s.lon)<=3).length;
  const repNear=reports.filter(r=>miles(r.lat,r.lon,s.lat,s.lon)<=3).length;
  const ls=s.leyIds.map(leyOf);
  const c=card(`<div class="meta">${smallIcon("s-"+s.cat)} ${CATS[s.cat]} · ${REGS[s.reg]} · ${Math.round(s.mi)} mi from Mold</div><h3>${esc(s.name)}</h3>
  ${ls.map(l=>`<span class="tag"><span class="sw" style="--c:var(--l${l.col})"></span> On the ${esc(l.name)}</span>`).join("")}${sincNear?`<span class="tag">${sincNear} Sinclair report${sincNear>1?"s":""} within 3 mi</span>`:""}${repNear?`<span class="tag">${repNear} paranormal report${repNear>1?"s":""} within 3 mi</span>`:""}<p>${esc(s.desc)}</p>
  <div class="mslot"></div>
  <div class="acts" style="margin-top:8px"><a class="btn primary" target="_blank" rel="noopener" href="${dirURL(s.lat,s.lon)}">Directions</a>
  <a class="btn" target="_blank" rel="noopener" href="https://explore.osmaps.com/?lat=${s.lat}&lon=${s.lon}&zoom=15">OS Map</a>${s.src?`<a class="btn" target="_blank" rel="noopener" href="${esc(s.src)}">Source</a>`:""}<span class="meta">${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}</span></div>`);
  const fb=document.createElement("button");fb.className="btn";fb.type="button";fb.textContent=align.found&&align.found.anchor===s?"Alignments shown":"Find alignments through here";fb.style.marginTop="8px";
  fb.onclick=()=>{align.found={anchor:s,lines:findThrough(s)};siteCard(s);drawAlign()};c.appendChild(fb);
  if(align.found&&align.found.anchor===s){const r=document.createElement("div");r.style.marginTop="8px";
    r.innerHTML=align.found.lines.length?`<div class="meta">${align.found.lines.length} line${align.found.lines.length>1?"s":""} through here with 3+ other places within 250 m (search radius 40 mi):</div><ul class="stops">${align.found.lines.map((f,i)=>`<li><span><span class="sw" style="--c:var(--l${[4,8,10,5,6][i]})"></span> ${f.pts.length} places · ${Math.round(f.brg)}° · ${f.len.toFixed(1)} km · widest miss ${Math.round(f.maxDev)} m</span></li><li class="meta" style="border:0">${f.pts.slice(1).map(p=>esc(p.name)).join(", ")}</li>`).join("")}</ul>`:`<div class="meta">No lines through here with 3 or more other places within 250 m.</div>`;
    c.appendChild(r)}
  addMarks(c,s.key,()=>siteCard(s))}
function leyCard(l){
  const sincN=sinc.filter(r=>!r.approx&&pathDist(r.xy,l.path)/UPM<=3).length, repN=reports.filter(r=>pathDist(r.xy,l.path)/UPM<=3).length;
  const c=card(`<div class="meta">${icon("s-leyicon",'style="width:14px;height:14px;vertical-align:-2px;color:var(--l'+l.col+')"')} ${LKINDS[l.kind]} · ${esc(l.who||"")} · nearest point ${Math.round(l.mi)} mi from Mold</div><h3>${esc(l.name)}</h3><p>${esc(l.desc)}</p>
   ${sincN||repN?`<div>${sincN?`<span class="tag">${sincN} Sinclair report${sincN>1?"s":""} within 3 mi</span>`:""}${repN?`<span class="tag">${repN} paranormal report${repN>1?"s":""} within 3 mi</span>`:""}</div>`:""}
   <div class="meta">Points named on the line (tap for directions)</div><ul class="stops">${l.stops.map(s=>`<li><a target="_blank" rel="noopener" href="${dirURL(s[1],s[2])}">${esc(s[0])}</a><span class="meta">${Math.round(miles(HOME.lat,HOME.lon,s[1],s[2]))} mi</span></li>`).join("")}</ul>
   ${l.near.length?`<div class="meta">Sites on this map within 3 miles: <span id="near"></span></div>`:""}${l.url?`<div class="meta" style="margin-top:8px"><a target="_blank" rel="noopener" href="${esc(l.url)}" style="color:var(--ink)">Source</a></div>`:""}`);
  const n=c.querySelector("#near");if(n)l.near.forEach((s,i)=>{const a=document.createElement("a");a.href="#sacred";a.textContent=s.name;a.style.color="var(--ink)";a.onclick=e=>{e.preventDefault();if(tab!=="sacred"){location.hash="sacred";setTimeout(()=>select({kind:"site",id:s.id},true),0)}else select({kind:"site",id:s.id},true)};n.appendChild(a);if(i<l.near.length-1)n.appendChild(document.createTextNode(", "))})}

// ----- Sinclair -----
function renderSinclair(){const S=st.sinclair;
  $("intro").innerHTML=entBanner()+`<p class="intro">${sinc.length} reports mapped from the <a href="https://truthproof.uk/Reports2/ForumReports2.html" target="_blank" rel="noopener">Truth Proof reports database</a>. Where one place has several reports, the pins fan out around it.</p>`;$("formbox").innerHTML="";
  const q=S.q;const base=sinc.filter(r=>passCommon(r)&&passEra(r)&&(!q||(r.place+" "+r.title+" "+r.date).toLowerCase().includes(q)));
  const tagged=base.filter(passTags);
  const counts={};tagged.forEach(r=>counts[r.cat]=(counts[r.cat]||0)+1);chipsFor(PCATS,counts,S.on,c=>icon("s-p-"+c));leyChip();hotChip();
  $("opt1").innerHTML=`<input type="checkbox" id="sn" ${S.sacredNear?"checked":""}> Show sacred sites`;$("sn").onchange=e=>{S.sacredNear=e.target.checked;render()};
  wireBanner();syncFilterBar(sinc);renderTagRow(base.filter(r=>S.on.has(r.cat)));drawLeys();
  if(S.sacredNear)sites.forEach(s=>{const m=mk("s-"+s.cat,s.xy,s.name,()=>{location.hash="sacred";setTimeout(()=>select({kind:"site",id:s.id},true),0)},{small:true,overlay:true});m.u.style.opacity=".55";markers.push(m)});
  const rs=tagged.filter(r=>S.on.has(r.cat));setCount(rs.length,sinc.length,"reports");hotSection(drawHot(rs.filter(r=>!r.approx)));
  rs.forEach(r=>{const m=mk("s-p-"+r.cat,r.xy,`#${r.n} ${r.title} · ${r.place} ${r.date}`,()=>select({kind:"sinc",id:r.n},false));m.sel=isSel("sinc",r.n);m.u.classList.toggle("sel",m.sel);markClasses(m.u,r.key);markers.push(m)});
  const mkRow=r=>row(icon("s-p-"+r.cat),r.title,r.date,`#${r.n} · ${r.place} · ${PCATS[r.cat]}${r.approx?" · area only":""}`,isSel("sinc",r.n),()=>select({kind:"sinc",id:r.n},true),isVis(r.key)?" visited":"",r.key);
  if(F.sort.sinclair==="group")groupBy(rs,r=>r.place).sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0])).forEach(([pl,arr])=>section(pl,sortItems(arr,"new").map(mkRow)));
  else section(fSort.selectedOptions[0]?.textContent||"Reports",sortItems(rs,F.sort.sinclair).map(mkRow));
}
function sincCard(r){const c=card(`<div class="meta">${smallIcon("s-p-"+r.cat)} ${PCATS[r.cat]} · Truth Proof report #${r.n} · ${REGS[r.reg]}</div><h3>${esc(r.title)}</h3>
  <p><b>${esc(r.place)}</b> · ${esc(r.date)}${r.approx?" · pin marks the general area only":""}${r.summary?"<br>"+esc(r.summary):""}</p>${r.tags.length?`<div class="tagsel" style="margin-bottom:8px">${r.tags.map(t=>`<span class="tg">${esc(tagLabel(t))}</span>`).join("")}</div>`:""}${nearHTML(r.lat,r.lon,r.leyIds)}
  <div class="mslot"></div>
  <div class="acts" style="margin-top:8px"><a class="btn primary" target="_blank" rel="noopener" href="${r.url}">Read the report</a><a class="btn" target="_blank" rel="noopener" href="${dirURL(r.lat,r.lon)}">Directions</a></div>`);
  const cn=document.createElement("div");cn.innerHTML=connHTML(r);c.querySelector(".acts").before(cn);wireConn(c);
  addMarks(c,r.key,()=>sincCard(r))}

// ----- UFO & paranormal / MU / Ritual (one renderer, three views) -----
const RITUAL_TAGS=new Set(["satanic","black-magic","occult","desecration","witchcraft","witch-trial","hellfire-club","crowley","necromancy","cursing","magic-circle"]);
const isRitual=r=>r.cat==="ritual"||r.tags.some(t=>RITUAL_TAGS.has(t));
const inView=(r,v)=>v==="mu"?r.mu.length>0:v==="ritual"?isRitual(r):r.cat!=="ritual";
const viewOf=r=>r.cat==="ritual"?"ritual":"paranormal";
const PVIEW=()=>["paranormal","mu","ritual"].includes(tab)?tab:"paranormal";
function renderParanormal(){const V=PVIEW(),S=st[V];
  const intro=$("intro");intro.innerHTML=entBanner();wireBanner();
  if(V==="paranormal"&&dbState==="ready"&&canWrite&&!formOpen){const bar=document.createElement("div");bar.className="acts";bar.style.marginBottom="12px";const b=document.createElement("button");b.className="btn primary";b.textContent="Add a report";b.onclick=()=>openForm(null);bar.appendChild(b);intro.appendChild(bar)}
  renderForm();
  const q=S.q;
  const base=reports.filter(r=>inView(r,V)&&passCommon(r)&&passEra(r)&&(!q||[r.title,r.place,r.desc,r.date,r.sources.map(s=>s.name).join(" "),r.tags.join(" "),r.mu.map(m=>m.title).join(" ")].join(" ").toLowerCase().includes(q)));
  const tagged=base.filter(passTags);
  const counts={};tagged.forEach(r=>counts[r.cat]=(counts[r.cat]||0)+1);const vc=Object.fromEntries(Object.entries(PCATS).filter(([k])=>counts[k]));if(V==="ritual")$("chips").innerHTML="";else chipsFor(vc,counts,S.on,c=>icon("s-p-"+c));leyChip();hotChip();
  $("opt1").innerHTML=`<input type="checkbox" id="ws" ${S.withSinc?"checked":""}> Overlay Sinclair reports`;$("ws").onchange=e=>{S.withSinc=e.target.checked;render()};
  syncFilterBar(reports);renderTagRow(base.filter(r=>S.on.has(r.cat)));drawLeys();
  if(S.withSinc)sinc.filter(r=>S.on.has(r.cat)&&passCommon(r)&&passEra(r)).forEach(r=>{const m=mk("s-p-"+r.cat,r.xy,`Sinclair #${r.n} ${r.title}`,()=>select({kind:"sinc",id:r.n},false),{small:true,overlay:true});m.u.style.opacity=".45";markers.push(m)});
  if(V==="mu"){const eps=new Set();tagged.forEach(r=>r.mu.forEach(m=>eps.add(m.url)));$("intro").insertAdjacentHTML("beforeend",`<p class="intro">${smallIcon("s-mu")} ${tagged.length} places covered across ${eps.size} Mysterious Universe episodes.</p>`)}
  if(dbState!=="ready"){$("list").innerHTML=`<div class="empty">${dbState==="loading"?"Loading reports…":dbState==="none"?"Saved reports aren't available in this view. Open the map while signed in to claude.ai to see and add them.":"Couldn't load reports right now. Try reopening the page."}</div>`;return}
  if(!reports.length){$("list").innerHTML=`<div class="empty">No reports yet. ${canWrite?"Use <b>Add a report</b> to log the first case.":"Reports added by the owner will show up here."}</div>`;return}
  const rs=tagged.filter(r=>V==="ritual"||S.on.has(r.cat));const vt=reports.filter(r=>inView(r,V)).length;setCount(rs.length,vt,V==="ritual"?"sites":V==="mu"?"places":"reports");hotSection(drawHot(rs));
  rs.forEach(r=>{const m=mk(V==="mu"?"s-mu":"s-p-"+r.cat,r.xy,`${r.title} · ${r.place}`,()=>select({kind:"rep",id:r.id},false));m.sel=isSel("rep",r.id);m.u.classList.toggle("sel",m.sel);markClasses(m.u,r.key);markers.push(m)});
  const mkRow=r=>row(icon(V==="mu"?"s-mu":"s-p-"+r.cat),r.title,r.date||"",`${r.place}${r.sources.length>1?" · "+r.sources.length+" sources":""}${r.tags.length?" · "+r.tags.map(tagLabel).join(", "):""}`,isSel("rep",r.id),()=>select({kind:"rep",id:r.id},true),isVis(r.key)?" visited":"",r.key);
  const srt=F.sort[V]||"group";
  if(srt==="group"&&V==="mu"){const byEp=new Map();rs.forEach(r=>r.mu.forEach(m=>{if(!byEp.has(m.url))byEp.set(m.url,{m,rs:[]});byEp.get(m.url).rs.push(r)}));[...byEp.values()].sort((a,b)=>String(b.m.date).localeCompare(String(a.m.date))).forEach(({m,rs:arr})=>section(`${muName(m)}${m.date?" · "+m.date.slice(0,4):""}`,sortItems(arr,"new").map(mkRow)))}
  else if(srt==="group"&&V==="ritual"){const g=r=>r.tags.includes("wicca")?"Modern witchcraft & Wicca":r.tags.includes("witch-trial")?"Witch trials & executions":r.tags.includes("hellfire-club")||r.tags.includes("crowley")?"Hellfire Clubs, Crowley & occult orders":r.tags.includes("desecration")||r.tags.includes("satanic")||r.tags.includes("black-magic")||r.tags.includes("animal-remains")?"Black magic, desecrations & ritual finds":r.tags.includes("cursing")?"Curses & cursing wells":r.tags.includes("witchcraft")?"Witchcraft & folk magic":"Other occult & ritual";groupBy(rs,g).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([k,arr])=>section(k,sortItems(arr,"new").map(mkRow)))}
  else if(srt==="group")for(const c in PCATS)section(PCATS[c],sortItems(rs.filter(r=>r.cat===c),"new").map(mkRow));
  else section(fSort.selectedOptions[0]?.textContent||"Reports",sortItems(rs,srt).map(mkRow));
}
const muName=m=>{const no=(m.no||(m.title.match(/^\s*([\d.]+)/)||[])[1]||"");const t=m.title.replace(/^\s*[\d.]+\s*[-–]\s*MU (Plus\+? )?Podcast\s*[-–]?\s*/i,"").trim();const name=m.topic||t;return (no?no+" · ":"")+(name||"Mysterious Universe")+(/plus/i.test(m.title)?"":"")};
function muHTML(mu){if(!mu||!mu.length)return"";
  return `<div class="meta">Mysterious Universe · ${mu.length} episode${mu.length>1?"s":""}</div><ul class="srcs mu">${mu.map(m=>{const ex=m.excerpt.split("\n").map(x=>x.startsWith("Show-notes links: ")?`<span class="mu-links">Show-notes links: ${x.slice(18).split(" · ").map(l=>{const i=l.lastIndexOf(" — ");const u=i>0?l.slice(i+3):"";const t=i>0?l.slice(0,i):l;return /^https?:\/\//.test(u)?`<a target="_blank" rel="noopener" href="${esc(u)}">${esc(t)}</a>`:esc(l)}).join(" · ")}</span>`:esc(x)).join("<br>");
    return `<li><a target="_blank" rel="noopener" href="${esc(m.url)}" title="${esc(m.title)}">${esc(muName(m))}</a>${m.plus?' <span class="mu-plus">Plus+</span>':""}${m.date?` <span class="mu-date">${esc(m.date)}</span>`:""}${m.evidence==="link-title"?' <span class="mu-date">· named in the show-notes links</span>':""}${ex?`<details><summary>Show notes on this case</summary><p class="mu-ex">${ex}</p></details>`:""}</li>`}).join("")}</ul>`}
function srcKind(s){const n=(s.name+" "+s.url).toLowerCase();
  if(/mysterious universe|podcast|megaphone|spotify|apple\.com\/.*podcast/.test(n))return["podcast","Podcast"];
  if(/wikipedia\.org/.test(n))return["wiki","Wikipedia"];
  if(/nationalarchives|gov\.uk|gov\.wales|coflein|historicengland|britishlistedbuildings|canmore|archives?\.|council|parliament|hansard|airprox/.test(n))return["official","Official / archive"];
  if(/\bbook\b|isbn|amazon\.|gutenberg|archive\.org\/details|books\.google/.test(n))return["book","Book / archive"];
  if(/bbc\.|dailypost|walesonline|guardian|telegraph|mirror\.|express\.|independent\.|chronicle|herald|gazette|observer|echo|news|times|metro\.|mail\.|post\.co|journal|cambrian|leader|advertiser|star\./.test(n))return["news","News"];
  if(/paranormaldatabase|truthproof|ufo|haunted|ghost|mysterious|cryptid|forteana|fortean/.test(n))return["research","Research site"];
  return["web","Web"]}
function evidenceHTML(o){const ss=o.sources||[];const k={};ss.forEach(s=>{const [id,l]=srcKind(s);k[l]=(k[l]||0)+1});
  const bits=[];if(ss.length)bits.push(`${ss.length} source${ss.length>1?"s":""}${Object.keys(k).length?" ("+Object.entries(k).map(([l,n])=>n+" "+l.toLowerCase()).join(", ")+")":""}`);
  if((o.mu||[]).length)bits.push(`${o.mu.length} Mysterious Universe episode${o.mu.length>1?"s":""}`);
  const strong=["police","military","pilot","radar","official-files","photo","video","physical-traces","multiple-witnesses"].filter(t=>(o.tags||[]).includes(t));
  if(strong.length)bits.push(strong.map(tagLabel).join(", "));
  if((o.tags||[]).includes("explained"))bits.push("has an explanation");
  return bits.length?`<p class="evid"><b>Evidence</b> · ${esc(bits.join(" · "))}</p>`:""}
function sourcesHTML(ss){if(!ss.length)return"";return `<div class="meta">${ss.length>1?ss.length+" sources":"Source"}</div><ol class="srcs num">${ss.map(s=>{const [id,l]=srcKind(s);return `<li><span class="sk sk-${id}" title="${esc(l)}">${esc(l)}</span> ${s.url?`<a target="_blank" rel="noopener" href="${esc(s.url)}">${esc(s.name||s.url.replace(/^https?:\/\/(www\.)?/,"").split("/")[0])}</a>`:esc(s.name)}</li>`}).join("")}</ol>`}
let _epIdx=null;function epIndex(){if(_epIdx&&_epIdx.n===reports.length)return _epIdx.m;const m=new Map();reports.forEach(r=>(r.mu||[]).forEach(e=>{if(!m.has(e.url))m.set(e.url,[]);m.get(e.url).push(r)}));_epIdx={n:reports.length,m};return m}
function xlBtn(o,extra=""){const cat=o.cat||"other";return `<button type="button" class="xl" data-k="${kindOf(o)}" data-i="${esc(o.n!=null?o.n:o.id)}">${smallIcon("s-p-"+cat)} ${esc(o.n!=null?o.title+" · "+o.place:o.title)}${extra?` <span class="xd">${esc(extra)}</span>`:""}</button>`}
function connHTML(o){const out=[];const me=caseIdOf(o);
  const es=entsOf(o);if(es.length)out.push(`<div class="xg"><div class="xh">Part of</div>${es.map(e=>{const E=XL.entities[e]||{n:e};return `<button type="button" class="xe" data-e="${esc(e)}" title="${esc(E.s||"")}">${esc(E.n)} <b>${entCount(e)}</b></button>`}).join("")}</div>`);
  const rel=(XL.cc[me]||[]).map(([id,lab])=>{const x=objByCase(id);return x?xlBtn(x,lab):""}).filter(Boolean);if(rel.length)out.push(`<div class="xg"><div class="xh">Related cases</div>${rel.join("")}</div>`);
  if((o.mu||[]).length){const idx=epIndex();const seen=new Set([me]);const same=[];(o.mu||[]).forEach(e=>(idx.get(e.url)||[]).forEach(r=>{if(!seen.has(r.id)){seen.add(r.id);same.push([r,muName(e)])}}));
    if(same.length)out.push(`<div class="xg"><div class="xh">Same Mysterious Universe episode</div>${same.slice(0,10).map(([r,ep])=>xlBtn(r,ep)).join("")}</div>`)}
  const pool=[...reports,...sinc.filter(x=>!x.approx)];const near=pool.filter(x=>x!==o&&caseIdOf(x)!==me).map(x=>[x,miles(o.lat,o.lon,x.lat,x.lon)]).filter(([x,d])=>d<=5).sort((a,b)=>a[1]-b[1]).slice(0,8);
  if(near.length)out.push(`<div class="xg"><div class="xh">Nearby cases (within 5 mi)</div>${near.map(([x,d])=>xlBtn(x,Math.max(0.1,d).toFixed(1)+" mi"+(x.date?" · "+String(x.date).slice(0,4):""))).join("")}</div>`);
  return out.length?`<div class="conn"><div class="meta">Connections</div>${out.join("")}</div>`:""}
const XTABS=["paranormal","mu","ritual","sinclair"];
function wireConn(c){c.querySelectorAll(".xl").forEach(b=>b.onclick=()=>{const k=b.dataset.k,i=k==="sinc"?+b.dataset.i:b.dataset.i;
    if(!XTABS.includes(tab)){location.hash=k==="sinc"?"sinclair":"paranormal";setTimeout(()=>select({kind:k,id:i},true),0)}else select({kind:k,id:i},true)});
  c.querySelectorAll(".xe").forEach(b=>b.onclick=()=>{F.ent=b.dataset.e;sel=null;$("card").hidden=true;const go=()=>{render();fitToEnt()};if(!XTABS.includes(tab)){location.hash="paranormal";setTimeout(go,0)}else go()})}
function fitToEnt(){if(!F.ent)return;const pts=Object.entries(XL.ce).filter(([k,v])=>v.includes(F.ent)).map(([k])=>objByCase(k)).filter(Boolean).map(o=>o.xy);if(pts.length)fitPoints(pts)}
function entBanner(){if(!F.ent)return"";const E=XL.entities[F.ent]||{n:F.ent};const eps=XL.ee[F.ent]||[];
  return `<div class="entban"><div><b>${esc(E.n)}</b> · ${entCount(F.ent)} linked cases${E.s?`<br><span class="xd">${esc(E.s)}</span>`:""}</div>${eps.length?`<details><summary>${eps.length} Mysterious Universe episode${eps.length>1?"s":""} on this</summary><ul class="srcs mu">${eps.map(m=>`<li><a target="_blank" rel="noopener" href="${esc(m.u)}">${esc(muName({no:m.no,title:m.t,topic:m.topic}))}</a>${m.d?` <span class="mu-date">${esc(m.d)}</span>`:""}${m.x?`<p class="mu-ex">${esc(m.x)}</p>`:""}</li>`).join("")}</ul></details>`:""}<button type="button" class="linkbtn" id="ent-x">Show everything again ✕</button></div>`}
function wireBanner(){const b=$("ent-x");if(b)b.onclick=()=>{F.ent="";render()}}
function repCard(r){const c=card(`<div class="meta">${smallIcon("s-p-"+r.cat)} ${esc(PCATS[r.cat])} · ${esc(r.date||"date unknown")} · ${REGS[r.reg]}</div><h3>${esc(r.title)}</h3>
  <p><b>${esc(r.place)}</b>${r.desc?" · "+esc(r.desc):""}</p>
  ${r.tags.length?`<div class="tagsel" style="margin-bottom:8px">${r.tags.map(t=>`<button class="tg" type="button" data-t="${esc(t)}" aria-pressed="${F.tags.has(t)}">${esc(tagLabel(t))}</button>`).join("")}</div>`:""}
  ${nearHTML(r.lat,r.lon,r.leyIds)}
  ${evidenceHTML(r)}
  ${sourcesHTML(r.sources)}
  ${muHTML(r.mu)}
  ${connHTML(r)}
  <div class="mslot"></div>
  <div class="acts" style="margin-top:8px"><a class="btn" target="_blank" rel="noopener" href="${dirURL(r.lat,r.lon)}">Directions</a>${canWrite?`<button class="btn" id="ed">Edit</button><button class="btn danger" id="del">Delete</button>`:""}</div>`);
  addMarks(c,r.key,()=>repCard(r));wireConn(c);
  c.querySelectorAll(".tagsel .tg").forEach(b=>b.onclick=()=>{const t=b.dataset.t;F.tags.has(t)?F.tags.delete(t):F.tags.add(t);sel=null;$("card").hidden=true;render()});
  if(canWrite){c.querySelector("#ed").onclick=()=>openForm(r);
    const d=c.querySelector("#del");d.onclick=async()=>{if(d.dataset.arm!=="1"){d.dataset.arm="1";d.textContent="Tap again to delete";return}
      d.disabled=true;try{await db.doc("reports/"+r.id).delete();closeCard()}catch(e){d.disabled=false;d.textContent="Couldn't delete, try again"}}}}

const TAG_VOCAB=["multiple-witnesses","single-witness","police","military","pilot","radar","photo","video","official-files","physical-traces","missing-time","entity","wave","big-cat","black-dog","lake-monster","sea-serpent","wild-man","winged","livestock-kills","castle","house","church","inn","road","battlefield","prison","grey-lady","white-lady","monk","soldier","child","apparition","voices","objects-moved","investigated","open-to-visit","coast","sea","lake","moor","mountain","forest","rural","urban","explained"];
function openForm(r){formOpen=true;editing=r;formDraft=r?{title:r.title,cat:r.cat,date:r.date,place:r.place,desc:r.desc,source:r.source,url:r.url,extra:r.sources.slice(1),lat:r.lat,lon:r.lon,tags:new Set(r.tags)}:{title:"",cat:"lights",date:"",place:"",desc:"",source:"",url:"",extra:[],lat:null,lon:null,tags:new Set()};
  $("card").hidden=true;sel=null;render();if(formDraft.lat!=null)setPin(formDraft.lat,formDraft.lon);$("formbox").scrollIntoView({behavior:"smooth",block:"nearest"})}
function renderForm(){const box=$("formbox");if(!formOpen){box.innerHTML="";return}
  const f=formDraft;const vocab=[...new Set([...TAG_VOCAB,...reports.flatMap(r=>r.tags),...f.tags])];
  box.innerHTML=`<form class="add" id="addf" novalidate>
   <label>Title<input id="f-title" maxlength="120" value="${esc(f.title)}" placeholder="e.g. Orange orbs over Moel Famau"></label>
   <div class="two"><label>Category<select id="f-cat">${Object.entries(PCATS).map(([k,v])=>`<option value="${k}" ${k===f.cat?"selected":""}>${esc(v)}</option>`).join("")}</select></label>
   <label>Date<input id="f-date" maxlength="20" value="${esc(f.date)}" placeholder="2026/10/28 or 1974"></label></div>
   <label>Place<input id="f-place" maxlength="80" value="${esc(f.place)}" placeholder="Town, landmark or area"></label>
   <div class="two"><label>Latitude<input id="f-lat" inputmode="decimal" value="${f.lat??""}" placeholder="53.1667"></label><label>Longitude<input id="f-lon" inputmode="decimal" value="${f.lon??""}" placeholder="-3.1417"></label></div>
   <div class="acts"><button type="button" class="btn" id="f-pick">Pick on map</button><span class="meta">or paste “lat, long” from Google Maps into Latitude</span></div>
   <label>What happened<textarea id="f-desc" maxlength="2000">${esc(f.desc)}</textarea></label>
   <div class="two"><label>Source or witness<input id="f-src" maxlength="100" value="${esc(f.source)}" placeholder="Book, website, person"></label><label>Link<input id="f-url" maxlength="300" value="${esc(f.url)}" placeholder="https://…"></label></div>
   ${f.extra.length?`<div class="meta">Also sourced from: ${f.extra.map(s=>esc(s.name||s.url)).join(", ")} (kept)</div>`:""}
   <div><div class="meta" style="margin-bottom:6px">Tags</div><div class="tagsel" id="f-tags">${vocab.map(t=>`<button type="button" class="tg" data-t="${esc(t)}" aria-pressed="${f.tags.has(t)}">${esc(tagLabel(t))}</button>`).join("")}</div>
   <div class="acts" style="margin-top:6px"><input id="f-newtag" maxlength="30" placeholder="New tag" style="max-width:180px"><button type="button" class="btn" id="f-addtag">Add tag</button></div></div>
   <div class="err" id="f-err" hidden></div>
   <div class="acts"><button class="btn primary" type="submit" id="f-save">${editing?"Save changes":"Save report"}</button><button class="btn" type="button" id="f-cancel">Cancel</button></div></form>`;
  const sync=()=>{f.title=$("f-title").value;f.cat=$("f-cat").value;f.date=$("f-date").value;f.place=$("f-place").value;f.desc=$("f-desc").value;f.source=$("f-src").value;f.url=$("f-url").value;
    const la=parseFloat($("f-lat").value),lo=parseFloat($("f-lon").value);f.lat=isFinite(la)?la:null;f.lon=isFinite(lo)?lo:null};
  box.querySelectorAll("input,select,textarea").forEach(i=>i.addEventListener("input",()=>{sync();if((i.id==="f-lat"||i.id==="f-lon")&&f.lat!=null&&f.lon!=null)setPin(f.lat,f.lon)}));
  box.querySelectorAll("#f-tags .tg").forEach(b=>b.onclick=()=>{const t=b.dataset.t;f.tags.has(t)?f.tags.delete(t):f.tags.add(t);b.setAttribute("aria-pressed",String(f.tags.has(t)))});
  $("f-addtag").onclick=()=>{sync();const t=$("f-newtag").value.toLowerCase().trim().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");if(t){f.tags.add(t);renderForm()}};
  $("f-lat").addEventListener("paste",e=>{const t=e.clipboardData?e.clipboardData.getData("text"):"";const m=t.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);if(m){e.preventDefault();setPin(+m[1],+m[2])}});
  $("f-pick").onclick=()=>{sync();startPick("Tap the map where it happened",(la,lo)=>setPin(la,lo))};
  $("f-cancel").onclick=()=>{formOpen=false;editing=null;clearPin();render()};
  $("addf").onsubmit=async e=>{e.preventDefault();sync();const err=$("f-err");
    const bad=!f.title.trim()?"Give the report a title.":(f.lat==null||f.lon==null||Math.abs(f.lat)>90||Math.abs(f.lon)>180)?"Set a location: pick it on the map or enter latitude and longitude.":(f.url.trim()&&!/^https?:\/\//.test(f.url.trim()))?"Links need to start with http:// or https://":"";
    if(bad){err.textContent=bad;err.hidden=false;return}
    const sources=[{name:f.source.trim(),url:f.url.trim()},...f.extra].filter(s=>s.name||s.url);
    const body={title:f.title.trim(),cat:f.cat,date:f.date.trim(),place:f.place.trim(),desc:f.desc.trim(),source:f.source.trim(),url:f.url.trim(),sources,tags:[...f.tags],lat:+f.lat.toFixed(5),lon:+f.lon.toFixed(5),updated:Date.now()};
    const btn=$("f-save");btn.disabled=true;btn.textContent="Saving…";
    try{ if(editing){await db.doc("reports/"+editing.id).update(body)} else {body.created=Date.now();if(myId)body.by=myId;await db.collection("reports").add(body)}
      formOpen=false;editing=null;clearPin();render();
    }catch(x){btn.disabled=false;btn.textContent=editing?"Save changes":"Save report";err.textContent=x&&x.code==="quota_exceeded"?"The collection is full. Delete some old reports to make room.":"Couldn't save. Check your connection and try again.";err.hidden=false}};
}
function startPick(msg,fn){picking=fn;svg.classList.add("picking");$("pickbar").hidden=false;$("pickbar").querySelector("span").textContent=msg;scrollToMap()}
function stopPick(){picking=null;svg.classList.remove("picking");$("pickbar").hidden=true}
$("pickcancel").onclick=e=>{e.stopPropagation();stopPick()};
function setPin(la,lo){if(formDraft&&formOpen){formDraft.lat=la;formDraft.lon=lo}
  if(!pinU)pinU=el("use",{href:"#s-pin"},M);pinU._p=P(la,lo);M.appendChild(pinU);placeMarkers();
  const a=$("f-lat"),b=$("f-lon");if(a&&document.activeElement!==a)a.value=la;if(b&&document.activeElement!==b)b.value=lo}
function clearPin(){if(pinU){pinU.remove();pinU=null}}

// ----- Road trip -----
function legMiles(a,b){return miles(a.lat,a.lon,b.lat,b.lon)}
function tourLen(start,pts,round){let d=0,prev=start;pts.forEach(p=>{d+=legMiles(prev,p);prev=p});if(round&&pts.length)d+=legMiles(prev,start);return d}
function optimise(start,pts,round){ // nearest neighbour then 2-opt
  let rest=[...pts],out=[],cur=start;while(rest.length){let bi=0,bd=Infinity;rest.forEach((p,i)=>{const d=legMiles(cur,p);if(d<bd){bd=d;bi=i}});cur=rest.splice(bi,1)[0];out.push(cur)}
  let improved=true,guard=0;while(improved&&guard++<60){improved=false;for(let i=0;i<out.length-1;i++)for(let j=i+1;j<out.length;j++){const cand=[...out.slice(0,i),...out.slice(i,j+1).reverse(),...out.slice(j+1)];if(tourLen(start,cand,round)+1e-9<tourLen(start,out,round)){out=cand;improved=true}}}
  return out}
function autoPlan(){
  const pool=new Set();
  const keys=allKeys();
  keys.forEach(k=>{if(trip.pool.has("todo")&&isTodo(k))pool.add(k);if(trip.pool.has("star")&&isStar(k))pool.add(k)});
  if(trip.pool.has("sites"))sites.filter(s=>st.sacred.on.has(s.cat)).forEach(s=>pool.add(s.key));
  if(trip.pool.has("reports"))reports.filter(r=>st.paranormal.on.has(r.cat)).forEach(r=>pool.add(r.key));
  if(trip.pool.has("sinclair"))sinc.filter(r=>!r.approx).forEach(r=>pool.add(r.key));
  let cand=[...pool].map(itemOf).filter(Boolean).filter(it=>(!trip.skipVis||!isVis(it.key))&&legMiles(trip.start,it)<=trip.radius);
  // prefer marked items, then nearest
  cand.forEach(it=>{it._score=legMiles(trip.start,it)*(isStar(it.key)?0.55:1)*(isTodo(it.key)?0.55:1)});
  cand.sort((a,b)=>a._score-b._score);
  const chosen=[];cand.forEach(it=>{if(chosen.length<trip.max&&!chosen.some(c=>legMiles(c,it)<0.15))chosen.push(it)});
  trip.stops=optimise(trip.start,chosen,trip.round).map(i=>i.key);
  return cand.length}
function fitTrip(){const its=trip.stops.map(itemOf).filter(Boolean);fitPoints([P(trip.start.lat,trip.start.lon),...its.map(i=>i.xy)]);scrollToMap()}
function gmapsLinks(){const its=trip.stops.map(itemOf).filter(Boolean);if(!its.length)return[];
  const pts=[trip.start,...its,...(trip.round?[trip.start]:[])];const links=[];
  for(let i=0;i<pts.length-1;i+=10){const seg=pts.slice(i,i+11);if(seg.length<2)break;const o=seg[0],d=seg[seg.length-1],w=seg.slice(1,-1);
    links.push(`https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${o.lat},${o.lon}&destination=${d.lat},${d.lon}${w.length?"&waypoints="+w.map(p=>p.lat+","+p.lon).join("%7C"):""}`)}
  return links}
const fmtTime=m=>{const h=Math.floor(m/60),mm=Math.round(m%60);return h?`${h}h ${mm}m`:`${mm}m`};
function renderTrip(){
  $("chips").innerHTML="";leyChip();$("tagrow").innerHTML="";$("opt1").innerHTML="";syncFilterBar([]);drawLeys(true);
  const marked=allKeys().filter(k=>isStar(k)||isTodo(k)).length;
  $("intro").innerHTML="";$("formbox").innerHTML="";
  const box=document.createElement("div");box.className="trip";
  const poolOpt=[["todo","To visit"],["star","Starred"],["sites","Sacred sites"],["reports","Paranormal reports"],["sinclair","Sinclair reports"]];
  box.innerHTML=`<div class="row2"><label>Start <select id="t-start"><option value="home">Home (Mold)</option><option value="pin">${trip.start.label&&trip.start.label!==HOME.label?esc(trip.start.label):"Pick on map…"}</option></select></label>
     <button class="btn" id="t-pickstart" type="button">Pick start on map</button></div>
   <div><div class="meta" style="margin-bottom:6px">Include</div><div class="tagsel">${poolOpt.map(([k,v])=>`<button type="button" class="tg" data-p="${k}" aria-pressed="${trip.pool.has(k)}">${v}</button>`).join("")}</div></div>
   <div class="row2"><label>Within <select id="t-rad">${[10,25,50,75,100,150,250].map(n=>`<option value="${n}" ${n===trip.radius?"selected":""}>${n} mi</option>`).join("")}</select></label>
     <label>Up to <select id="t-max">${[3,4,5,6,8,10,12,15,20].map(n=>`<option value="${n}" ${n===trip.max?"selected":""}>${n} stops</option>`).join("")}</select></label>
     <label><input type="checkbox" id="t-round" ${trip.round?"checked":""}> Back to start</label>
     <label><input type="checkbox" id="t-skip" ${trip.skipVis?"checked":""}> Skip visited</label></div>
   <div class="acts"><button class="btn primary" id="t-plan" type="button">Plan trip</button><button class="btn" id="t-opt" type="button" ${trip.stops.length<2?"disabled":""}>Optimise order</button><button class="btn" id="t-clear" type="button" ${trip.stops.length?"":"disabled"}>Clear</button></div>
   <div class="meta" id="t-msg">${marked?`${marked} places starred or marked to visit.`:"Tip: star places or mark them To visit on the other tabs, or use + Add to trip on any card."}</div>`;
  $("intro").appendChild(box);
  $("t-start").value=(trip.start.label===HOME.label)?"home":"pin";
  $("t-start").onchange=e=>{if(e.target.value==="home"){trip.start={...HOME};render()}else startPick("Tap the map to set the start",(la,lo)=>{trip.start={lat:la,lon:lo,label:`Map point ${la.toFixed(3)}, ${lo.toFixed(3)}`};render()})};
  $("t-pickstart").onclick=()=>startPick("Tap the map to set the start",(la,lo)=>{trip.start={lat:la,lon:lo,label:`Map point ${la.toFixed(3)}, ${lo.toFixed(3)}`};render()});
  box.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{const k=b.dataset.p;trip.pool.has(k)?trip.pool.delete(k):trip.pool.add(k);b.setAttribute("aria-pressed",String(trip.pool.has(k)))});
  $("t-rad").onchange=e=>trip.radius=+e.target.value;$("t-max").onchange=e=>trip.max=+e.target.value;
  $("t-round").onchange=e=>{trip.round=e.target.checked;render()};$("t-skip").onchange=e=>trip.skipVis=e.target.checked;
  $("t-plan").onclick=()=>{const n=autoPlan();render();if(!trip.stops.length)$("t-msg").textContent=n?"Nothing new within range.":"Nothing to plan from. Star some places, mark them To visit, or include sacred sites or reports.";else fitTrip()};
  $("t-opt").onclick=()=>{trip.stops=optimise(trip.start,trip.stops.map(itemOf).filter(Boolean),trip.round).map(i=>i.key);render();fitTrip()};
  $("t-clear").onclick=()=>{trip.stops=[];render()};
  // map: start + stops + route
  const sp=P(trip.start.lat,trip.start.lon);
  if(trip.start.label!==HOME.label){if(!pinU)pinU=el("use",{href:"#s-pin"},M);pinU._p=sp}else clearPin();
  const its=trip.stops.map(itemOf).filter(Boolean);
  if(its.length){const pts=[sp,...its.map(i=>i.xy)];el("polyline",{class:"routeline",points:pts.map(p=>p.join(",")).join(" ")},RG);if(trip.round)el("line",{class:"routeline routeret",x1:pts[pts.length-1][0],y1:pts[pts.length-1][1],x2:sp[0],y2:sp[1]},RG)}
  its.forEach((it,i)=>{const m=mk(it.sym,it.xy,`${i+1}. ${it.name}`,()=>it.open());m.u.classList.add("tripstop");markClasses(m.u,it.key);markers.push(m);
    const bg=el("circle",{class:"stopbg"},M),t=el("text",{class:"stopnum"},M);t.textContent=i+1;numLabels.push({m,bg,t})});
  // summary + list
  const list=$("list");
  if(!its.length){list.innerHTML=`<div class="empty">No stops yet. Press <b>Plan trip</b>, or add places with <b>+ Add to trip</b> from any card.</div>`;}
  else{
    let total=0,prev=trip.start;const legs=its.map(it=>{const d=legMiles(prev,it);total+=d;prev=it;return d});const back=trip.round?legMiles(prev,trip.start):0;total+=back;
    const road=total*ROAD,mins=road/MPH*60;
    const sum=document.createElement("div");sum.className="tripsum";sum.innerHTML=`<span><b>${its.length}</b> stops</span><span><b>${Math.round(road)}</b> mi by road (est.)</span><span><b>${fmtTime(mins)}</b> driving (est.)</span>`;
    list.appendChild(sum);
    const h=document.createElement("h2");h.textContent="From "+trip.start.label;list.appendChild(h);
    const ol=document.createElement("ol");
    its.forEach((it,i)=>{const li=document.createElement("li");li.className="stop";
      li.innerHTML=`<span class="n">${i+1}</span><span class="nm"></span><span class="ctl"><button aria-label="Move up" ${i?"":"disabled"}>↑</button><button aria-label="Move down" ${i<its.length-1?"":"disabled"}>↓</button><button aria-label="Remove">×</button></span><span class="ds"></span>`;
      const nm=li.querySelector(".nm");nm.innerHTML=flagsHTML(it.key)+icon(it.sym,'style="width:14px;height:14px;vertical-align:-2px"')+" ";nm.appendChild(document.createTextNode(it.name));nm.onclick=()=>it.open();
      li.querySelector(".ds").textContent=`${it.sub} · ${(legs[i]*ROAD).toFixed(1)} mi from ${i?"previous stop":"start"} (≈${fmtTime(legs[i]*ROAD/MPH*60)})`;
      const [bu,bd,bx]=li.querySelectorAll(".ctl button");
      bu.onclick=()=>{const a=trip.stops;[a[i-1],a[i]]=[a[i],a[i-1]];render()};bd.onclick=()=>{const a=trip.stops;[a[i+1],a[i]]=[a[i],a[i+1]];render()};bx.onclick=()=>{trip.stops.splice(i,1);render()};
      ol.appendChild(li)});
    if(trip.round){const li=document.createElement("li");li.className="stop";li.innerHTML=`<span class="n" style="background:var(--muted)">↩</span><span class="nm">Back to start</span><span></span><span class="ds">${(back*ROAD).toFixed(1)} mi (≈${fmtTime(back*ROAD/MPH*60)})</span>`;ol.appendChild(li)}
    list.appendChild(ol);
    const acts=document.createElement("div");acts.className="acts";acts.style.margin="12px 0";
    gmapsLinks().forEach((u,i,a)=>{const x=document.createElement("a");x.className="btn"+(i?"":" primary");x.target="_blank";x.rel="noopener";x.href=u;x.textContent=a.length>1?`Google Maps part ${i+1}`:"Open in Google Maps";acts.appendChild(x)});
    const mv=document.createElement("button");mv.className="btn";mv.textContent="Mark all visited";mv.onclick=()=>{its.forEach(it=>setMark(it.key,"v",today()));render()};acts.appendChild(mv);
    list.appendChild(acts);
    const save=document.createElement("div");save.className="acts";save.innerHTML=`<input type="text" id="t-name" maxlength="60" placeholder="Name this trip" value="${esc(trip.name)}" style="font:inherit;font-size:14px;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--panel);color:var(--ink);min-width:0;flex:1 1 160px"><button class="btn" id="t-save" type="button">Save trip</button>`;
    list.appendChild(save);
    $("t-save").onclick=()=>{const name=$("t-name").value.trim()||`Trip ${new Date().toLocaleDateString("en-GB")}`;trip.name=name;
      const rec={name,start:trip.start,stops:[...trip.stops],round:trip.round,saved:Date.now()};const i=marks.trips.findIndex(t=>t.name===name);if(i>=0)marks.trips[i]=rec;else marks.trips.unshift(rec);marks.trips=marks.trips.slice(0,30);saveMarks();render()};
  }
  if(marks.trips.length){const h=document.createElement("h2");h.textContent="Saved trips · "+marks.trips.length;list.appendChild(h);const ol=document.createElement("ol");
    marks.trips.forEach((t,i)=>{const li=document.createElement("li");li.className="stop";li.innerHTML=`<span class="n" style="background:var(--l3)">${i+1}</span><span class="nm"></span><span class="ctl"><button aria-label="Delete saved trip">×</button></span><span class="ds"></span>`;
      li.querySelector(".nm").textContent=t.name;li.querySelector(".ds").textContent=`${t.stops.length} stops from ${t.start.label} · saved ${new Date(t.saved).toLocaleDateString("en-GB")}`;
      li.querySelector(".nm").onclick=()=>{trip.start=t.start;trip.stops=[...t.stops];trip.round=t.round;trip.name=t.name;render();fitTrip()};
      const del=li.querySelector(".ctl button");del.onclick=()=>{if(del.dataset.arm!=="1"){del.dataset.arm="1";del.textContent="✓";del.setAttribute("aria-label","Tap again to delete");return}marks.trips.splice(i,1);saveMarks();render()};
      ol.appendChild(li)});list.appendChild(ol)}
  const log=Object.entries(marks.m).filter(([k,v])=>v.v||v.n||(v.ph||[]).length).map(([k,v])=>({k,v,it:itemOf(k)})).filter(x=>x.it).sort((a,b)=>String(b.v.v||"").localeCompare(String(a.v.v||"")));
  if(log.length){const h=document.createElement("h2");h.textContent="Visit log · "+log.length;list.appendChild(h);const ol=document.createElement("ol");
    log.forEach(x=>{const li=document.createElement("li");li.className="stop";li.innerHTML=`<span class="n" style="background:var(--l2)">${x.v.v?"✓":"✎"}</span><span class="nm"></span><span class="meta">${typeof x.v.v==="string"?x.v.v.split("-").reverse().join("/"):""}</span><span class="ds"></span>`;
      const nm=li.querySelector(".nm");nm.textContent=x.it.name;nm.onclick=()=>x.it.open();li.querySelector(".ds").textContent=[x.it.sub,(x.v.ph||[]).length?(x.v.ph.length+" photo"+(x.v.ph.length>1?"s":"")):"",x.v.n?x.v.n.slice(0,140):""].filter(Boolean).join(" · ");ol.appendChild(li)});list.appendChild(ol)}
}

// ---------- hotspots ----------
const HG=el("g",{id:"hot"},document.getElementById("world"));document.getElementById("world").insertBefore(HG,document.getElementById("leys"));
const HOT_MI=6,HOT_CELL=2,HOT_SIG=4;
const CSHORT={lights:"lights",craft:"craft",encounter:"encounters",ghost:"ghosts",poltergeist:"poltergeists",cryptid:"cryptids",timeslip:"time slips",other:"other",ritual:"occult"};
// Kernel density on a 2-mile grid (Gaussian, sigma 4 mi); clusters = local density peaks, members = cases within 6 mi of the peak.
function hotspots(items){const cs=HOT_CELL*UPM,sig=HOT_SIG*UPM,R=Math.ceil(3*HOT_SIG/HOT_CELL);const D=new Map();
  items.forEach(o=>{const ci=Math.floor(o.xy[0]/cs),cj=Math.floor(o.xy[1]/cs);for(let di=-R;di<=R;di++)for(let dj=-R;dj<=R;dj++){const x=(ci+di+.5)*cs-o.xy[0],y=(cj+dj+.5)*cs-o.xy[1];const w=Math.exp(-(x*x+y*y)/(2*sig*sig));if(w<0.02)continue;const k=(ci+di)+","+(cj+dj);D.set(k,(D.get(k)||0)+w)}});
  const cells=[...D.entries()].map(([k,w])=>{const [i,j]=k.split(",").map(Number);return{i,j,w,cx:(i+.5)*cs,cy:(j+.5)*cs}});
  const peaks=cells.filter(c=>{if(c.w<1.6)return false;for(let di=-1;di<=1;di++)for(let dj=-1;dj<=1;dj++){if(!di&&!dj)continue;const n=D.get((c.i+di)+","+(c.j+dj));if(n&&n>c.w)return false}return true}).sort((a,b)=>b.w-a.w);
  const used=new Set(),rad=HOT_MI*UPM,clusters=[];
  peaks.forEach(p=>{const mem=items.filter(o=>!used.has(o)&&Math.hypot(o.xy[0]-p.cx,o.xy[1]-p.cy)<=rad);if(mem.length<3)return;mem.forEach(o=>used.add(o));clusters.push({...p,items:mem})});
  return{cells,clusters}}
function drawHot(items){HG.innerHTML="";if(!F.hot)return[];
  if(F.hotAll){const all=[...reports.filter(r=>passCommon(r)&&passEra(r)),...sinc.filter(r=>!r.approx&&passCommon(r)&&passEra(r))];items=all}
  const {cells,clusters}=hotspots(items);const cs=HOT_CELL*UPM;const max=Math.max(1,...cells.map(c=>c.w));
  if(!document.getElementById("hotblur")){const svg=HG.ownerSVGElement;const df=el("defs",{},svg);const f=el("filter",{id:"hotblur",x:"-20%",y:"-20%",width:"140%",height:"140%"},df);el("feGaussianBlur",{stdDeviation:(cs*0.9).toFixed(2)},f)}
  const HB=el("g",{filter:"url(#hotblur)"},HG);
  cells.forEach(c=>{if(c.w<max*0.06||c.w<0.5)return;el("rect",{x:c.i*cs,y:c.j*cs,width:cs,height:cs,fill:"var(--danger)","fill-opacity":(0.06+0.6*Math.pow(c.w/max,0.7)).toFixed(3),stroke:"none"},HB)});
  clusters.slice(0,10).forEach((h,n)=>{el("circle",{cx:h.cx,cy:h.cy,r:HOT_MI*UPM,fill:"none",stroke:"var(--danger)","stroke-width":1,"stroke-dasharray":"3 3",opacity:.55,"vector-effect":"non-scaling-stroke"},HG)});
  return clusters.slice(0,10)}
function hotLabel(h){const c={};h.items.forEach(o=>{const n=(o.area||areaOf(o.place)||o.place||"").trim();if(n)c[n]=(c[n]||0)+1});return(Object.entries(c).sort((a,b)=>b[1]-a[1])[0]||["This"])[0]}
function hotStats(h){const cats={};h.items.forEach(o=>cats[o.cat]=(cats[o.cat]||0)+1);const ys=h.items.map(o=>yearOf(o.date)).filter(y=>y!=null).sort((a,b)=>a-b);
  const mu=new Set();h.items.forEach(o=>(o.mu||[]).forEach(m=>mu.add(m.url)));const sincN=h.items.filter(o=>o.n!=null).length;const [la,lo]=UNP(h.cx,h.cy);
  const lz=leysNear([h.cx,h.cy]).map(l=>l.name);const ss=sites.filter(x=>miles(la,lo,x.lat,x.lon)<=HOT_MI);
  return{cats,span:ys.length?(ys[0]===ys[ys.length-1]?String(ys[0]):ys[0]+"–"+ys[ys.length-1]):"",mu:mu.size,sincN,lz,ss,la,lo}}
function hotSection(top){if(!top.length)return;
  section(F.hotAll?"Hotspots · all layers":"Hotspots",top.map(h=>{const st=hotStats(h);const cats=Object.entries(st.cats).sort((a,b)=>b[1]-a[1]).map(([c,n])=>n+" "+(CSHORT[c]||c)).join(", ");
    const desc=[cats,st.span,st.mu?st.mu+" MU episode"+(st.mu>1?"s":""):"",st.sincN&&F.hotAll?st.sincN+" Sinclair":"",st.lz.length?"on the "+st.lz.join(", "):"",st.ss.length?st.ss.length+" sacred site"+(st.ss.length>1?"s":""):""].filter(Boolean).join(" · ");
    return row(`<svg viewBox="-10 -10 20 20" aria-hidden="true"><rect x="-8" y="-8" width="16" height="16" rx="2" fill="var(--danger)" opacity=".6"/></svg>`,hotLabel(h)+" hotspot",h.items.length+" cases",desc,false,()=>{hotCard(h);fitPoints(h.items.map(o=>o.xy));scrollToMap()})}))}
function hotCard(h){const st=hotStats(h);const g=groupBy(h.items,o=>o.cat);
  const c=card(`<div class="meta">Hotspot · ${h.items.length} cases within ${HOT_MI} mi${st.span?" · "+esc(st.span):""}</div><h3>${esc(hotLabel(h))} hotspot</h3>
   <p class="evid">${Object.entries(st.cats).sort((a,b)=>b[1]-a[1]).map(([c2,n])=>`${smallIcon("s-p-"+c2)} ${n} ${esc(PCATS[c2]||c2)}`).join(" · ")}${st.mu?` · ${st.mu} Mysterious Universe episode${st.mu>1?"s":""}`:""}</p>
   ${st.lz.length?`<p>${st.lz.map(n=>`<span class="tag">On the ${esc(n)}</span>`).join("")}</p>`:""}
   <div class="conn">${g.sort((a,b)=>b[1].length-a[1].length).map(([cat,arr])=>`<div class="xg"><div class="xh">${esc(PCATS[cat]||cat)} · ${arr.length}</div>${sortItems(arr,"new").map(o=>xlBtn(o,(o.date?String(o.date).slice(0,4):"")+(o.n!=null?" · Sinclair":""))).join("")}</div>`).join("")}
   ${st.ss.length?`<div class="xg"><div class="xh">Sacred sites in the hotspot · ${st.ss.length}</div>${st.ss.slice(0,12).map(x=>`<button type="button" class="xs" data-s="${x.id}">${smallIcon("s-"+x.cat)} ${esc(x.name)}</button>`).join("")}</div>`:""}</div>`);
  wireConn(c);c.querySelectorAll(".xs").forEach(b=>b.onclick=()=>{location.hash="sacred";setTimeout(()=>select({kind:"site",id:+b.dataset.s},true),0)})}
function hotChip(){chip(`<svg viewBox="-10 -10 20 20" aria-hidden="true"><rect x="-8" y="-8" width="16" height="16" rx="2" fill="var(--danger)" opacity=".6"/></svg>Hotspots`,!!F.hot,()=>{F.hot=!F.hot;render()});
  if(F.hot)chip(`<svg viewBox="-10 -10 20 20" aria-hidden="true"><circle r="8" fill="none" stroke="var(--danger)" stroke-dasharray="3 2" stroke-width="2"/></svg>All layers`,!!F.hotAll,()=>{F.hotAll=!F.hotAll;render()})}

// ---------- alignment finder ----------
const AG=el("g",{id:"align"},document.getElementById("world"));document.getElementById("world").insertBefore(AG,document.getElementById("marks"));
const align={mode:false,keys:[],found:null};
const toKm=(o,ref)=>[(o.lon-ref.lon)*111.32*Math.cos(rad(ref.lat)),(o.lat-ref.lat)*110.57];
const fromKm=(x,y,ref)=>[ref.lat+y/110.57,ref.lon+x/(111.32*Math.cos(rad(ref.lat)))];
function fitLine(pts){const ref={lat:pts.reduce((a,p)=>a+p.lat,0)/pts.length,lon:pts.reduce((a,p)=>a+p.lon,0)/pts.length};
  const xy=pts.map(p=>toKm(p,ref));let sxx=0,syy=0,sxy=0;xy.forEach(([x,y])=>{sxx+=x*x;syy+=y*y;sxy+=x*y});
  const th=0.5*Math.atan2(2*sxy,sxx-syy);const ux=Math.cos(th),uy=Math.sin(th);
  const proj=xy.map(([x,y])=>x*ux+y*uy),dev=xy.map(([x,y])=>Math.abs(-x*uy+y*ux));
  const t0=Math.min(...proj),t1=Math.max(...proj);let brg=(90-th*180/Math.PI+360)%180;
  return{ref,ux,uy,t0,t1,maxDev:Math.max(...dev)*1000,len:t1-t0,brg,ends:[fromKm(ux*t0,uy*t0,ref),fromKm(ux*t1,uy*t1,ref)]}}
function verdict(m){return m<=100?["Tight alignment","var(--l2)"]:m<=300?["Loose alignment","var(--l0)"]:["Not aligned","var(--danger)"]}
function findThrough(anchor){const TOL=0.25,R=40;const pool=sites.filter(s=>s!==anchor&&miles(anchor.lat,anchor.lon,s.lat,s.lon)<=R);
  const xy=new Map(pool.map(s=>[s,toKm(s,anchor)]));const lines=[];
  pool.forEach(b=>{const [bx,by]=xy.get(b);const L=Math.hypot(bx,by);if(L<0.5)return;const ux=bx/L,uy=by/L;
    const on=pool.filter(c=>{if(c===b)return false;const [cx,cy]=xy.get(c);return Math.abs(-cx*uy+cy*ux)<=TOL&&Math.hypot(cx,cy)>0.3});
    if(on.length>=2){const brg=(Math.atan2(ux,uy)*180/Math.PI+360)%180;lines.push({brg,members:[b,...on]})}});
  const uniq=[];lines.sort((a,b)=>b.members.length-a.members.length).forEach(l=>{if(!uniq.some(u=>Math.abs(((u.brg-l.brg+90+180)%180)-90)<1.2))uniq.push(l)});
  return uniq.slice(0,5).map(l=>{const pts=[anchor,...new Set(l.members)];return{...fitLine(pts),pts}})}
function drawAlign(){AG.innerHTML="";
  const draw=(f,col,w)=>{const a=P(...f.ends[0]),b=P(...f.ends[1]);const dx=b[0]-a[0],dy=b[1]-a[1];el("line",{x1:a[0]-dx*.15,y1:a[1]-dy*.15,x2:b[0]+dx*.15,y2:b[1]+dy*.15,stroke:col,"stroke-width":w,"vector-effect":"non-scaling-stroke","stroke-dasharray":"2 4","stroke-linecap":"round"},AG)};
  if(align.mode&&align.keys.length>=2){const f=fitLine(align.keys.map(itemOf).filter(Boolean));draw(f,verdict(f.maxDev)[1],3)}
  if(align.found&&sel&&sel.kind==="site"&&sel.id===align.found.anchor.id)align.found.lines.forEach((f,i)=>draw(f,`var(--l${[4,8,10,5,6][i]})`,2.5))}
function alignPanel(){const box=document.createElement("div");box.className="trip";
  const its=align.keys.map(itemOf).filter(Boolean);let res="";
  if(its.length>=3){const f=fitLine(its);const [v,c]=verdict(f.maxDev);res=`<div class="tripsum"><span><b style="color:${c}">${v}</b></span><span><b>${Math.round(f.maxDev)} m</b> widest miss</span><span><b>${f.len.toFixed(1)} km</b> long</span><span><b>${Math.round(f.brg)}°</b> bearing</span></div>`}
  box.innerHTML=`<div><b>Check an alignment</b><div class="meta">Tap 3 or more places on the map. Selected: ${its.length}</div></div>${res}
   ${its.length?`<ol class="stops">${its.map(i=>`<li><span>${esc(i.name)}</span><span class="meta">${esc(i.sub)}</span></li>`).join("")}</ol>`:""}
   <div class="meta">Within 100 m counts as tight, within 300 m as loose. With hundreds of places on the map, chance alignments are common, so the tighter and longer the line, the more it means.</div>
   <div class="acts"><button class="btn" id="al-clear" type="button" ${its.length?"":"disabled"}>Clear</button><button class="btn primary" id="al-done" type="button">Done</button></div>`;
  box.querySelector("#al-clear").onclick=()=>{align.keys=[];render()};box.querySelector("#al-done").onclick=()=>{align.mode=false;align.keys=[];render()};
  return box}

// ---------- sky calendar ----------
const J=d=>d.getTime()/86400000+2440587.5, fromJ=j=>new Date((j-2440587.5)*86400000);
function seasons(y){const Y=(y-2000)/1000;return{
  mar:2451623.80984+365242.37404*Y+0.05169*Y*Y-0.00411*Y**3-0.00057*Y**4,
  jun:2451716.56767+365241.62603*Y+0.00325*Y*Y+0.00888*Y**3-0.00030*Y**4,
  sep:2451810.21715+365242.01767*Y-0.11575*Y*Y+0.00337*Y**3+0.00078*Y**4,
  dec:2451900.05952+365242.74049*Y-0.06223*Y*Y-0.00823*Y**3+0.00032*Y**4}}
function sunTimes(date,lat,lon){const n=Math.ceil(J(new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),12)))-2451545.0+0.0008);
  const Js=n-lon/360,M=(357.5291+0.98560028*Js)%360,Mr=rad(M),Cc=1.9148*Math.sin(Mr)+0.02*Math.sin(2*Mr)+0.0003*Math.sin(3*Mr);
  const lam=rad((M+Cc+180+102.9372)%360),Jt=2451545+Js+0.0053*Math.sin(Mr)-0.0069*Math.sin(2*lam);
  const sd=Math.sin(lam)*Math.sin(rad(23.4397)),cd=Math.cos(Math.asin(sd)),h=rad(-0.833);
  const cw=(Math.sin(h)-Math.sin(rad(lat))*sd)/(Math.cos(rad(lat))*cd);if(Math.abs(cw)>1)return null;
  const w=Math.acos(cw)*180/Math.PI;const cA=(sd-Math.sin(rad(lat))*Math.sin(h))/(Math.cos(rad(lat))*Math.cos(h));const A=Math.acos(Math.max(-1,Math.min(1,cA)))*180/Math.PI;
  return{rise:fromJ(Jt-w/360),set:fromJ(Jt+w/360),riseAz:A,setAz:360-A}}
const SYN=29.530588853,NEW0=2451550.09766;
const moonAge=d=>((J(d)-NEW0)%SYN+SYN)%SYN;
const moonIllum=d=>(1-Math.cos(2*Math.PI*moonAge(d)/SYN))/2;
function moonPhaseName(d){const a=moonAge(d)/SYN;return a<.03||a>.97?"New moon":a<.22?"Waxing crescent":a<.28?"First quarter":a<.47?"Waxing gibbous":a<.53?"Full moon":a<.72?"Waning gibbous":a<.78?"Last quarter":"Waning crescent"}
const MOON_NAMES=["Wolf","Snow","Worm","Pink","Flower","Strawberry","Buck","Sturgeon","Harvest","Hunter's","Beaver","Cold"];
const fmtD=d=>d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric",timeZone:"Europe/London"});
const fmtT=d=>d?d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/London"}):"–";
const ALIGNED=[
 {site:"Bryn Celli Ddu",ev:"jun",what:"sunrise",note:"Sunlight runs down the passage and lights the inner chamber at midsummer sunrise. Cadw sometimes opens it early on the solstice."},
 {site:"Stonehenge",ev:"jun",what:"sunrise",note:"The sun rises near the Heel Stone. English Heritage runs managed open access at dawn."},
 {site:"Stonehenge",ev:"dec",what:"sunset",note:"The main axis faces midwinter sunset. Open access is at the winter solstice sunrise."},
 {site:"Maeshowe",ev:"dec",what:"sunset",note:"For a few weeks either side of midwinter the setting sun shines down the passage onto the back wall. Book ahead."},
 {site:"Clava Cairns",ev:"dec",what:"sunset",note:"The passage cairns face the midwinter sunset."},
 {site:"Long Meg and Her Daughters",ev:"dec",what:"sunset",note:"Long Meg stands roughly towards midwinter sunset as seen from the circle."},
 {site:"The Cloud",ev:"jun",what:"sunset",note:"Around midsummer, from Leek churchyard, the sun sets behind The Cloud, reappears, then sets again (the double sunset)."},
 {site:"Callanish Stones",ev:"lunar",what:"moonset",note:"At the major lunar standstill the moon skims the southern hills and sets among the stones. The last peak was 2024–25; the next is around 2043."}];
const alignedSites=()=>ALIGNED.map(a=>({...a,s:sites.find(x=>x.name===a.site)})).filter(a=>a.s);
function skyEvents(from,days){const to=new Date(from.getTime()+days*864e5),ev=[];
  for(let y=from.getUTCFullYear();y<=to.getUTCFullYear();y++){const s=seasons(y);
    [["mar","Spring equinox","Alban Eilir / Gŵyl Ganol y Gwanwyn"],["jun","Summer solstice","Alban Hefin / Gŵyl Ganol Haf"],["sep","Autumn equinox","Alban Elfed / Gŵyl Ganol yr Hydref"],["dec","Winter solstice","Alban Arthan / Gŵyl Ganol Gaeaf"]]
      .forEach(([k,n,w])=>ev.push({d:fromJ(s[k]),kind:"sun",key:k,name:n,sub:w}));
    [[1,1,"Imbolc","Gŵyl Fair y Canhwyllau"],[4,1,"Beltane","Calan Mai"],[7,1,"Lughnasadh","Calan Awst"],[9,31,"Samhain","Calan Gaeaf"]].forEach(([m,dd,n,w])=>ev.push({d:new Date(Date.UTC(y,m,dd,12)),kind:"fire",name:n,sub:w+" (cross-quarter day)"}));
    [[0,3,"Quadrantids"],[3,22,"Lyrids"],[4,6,"Eta Aquariids"],[7,12,"Perseids"],[9,21,"Orionids"],[10,17,"Leonids"],[11,14,"Geminids"]].forEach(([m,dd,n])=>ev.push({d:new Date(Date.UTC(y,m,dd,22)),kind:"meteor",name:n+" meteor shower",sub:"Peak night (approx.)"}))}
  let k=Math.floor((J(from)-NEW0)/SYN)-1;
  for(;;k++){const nm=fromJ(NEW0+k*SYN),fm=fromJ(NEW0+(k+0.5)*SYN);if(nm>to)break;
    ev.push({d:nm,kind:"new",name:"New moon",sub:"Darkest skies of the month: best for sky-watching"});
    const mo=new Date(fm).getUTCMonth();const sep=seasons(fm.getUTCFullYear()).sep;const harvest=Math.abs(J(fm)-sep)<15;
    ev.push({d:fm,kind:"full",name:(harvest?"Harvest":MOON_NAMES[mo])+" Moon (full)",sub:"Full moon"})}
  return ev.filter(e=>e.d>=new Date(from.getTime()-864e5/2)&&e.d<=to).sort((a,b)=>a.d-b.d)}
const daysTo=d=>Math.round((d-new Date())/864e5);
function drawSky(){const g=RG;alignedSites().forEach(a=>{if(a.ev==="lunar")return;const y=new Date().getUTCFullYear();const s=seasons(y);const when=fromJ(s[a.ev]);const t=sunTimes(when,a.s.lat,a.s.lon);if(!t)return;
  const az=a.what==="sunrise"?t.riseAz:t.setAz;const d=20;const la=a.s.lat+d*Math.cos(rad(az))/69,lo=a.s.lon+d*Math.sin(rad(az))/(69*Math.cos(rad(a.s.lat)));
  const p0=a.s.xy,p1=P(la,lo);el("line",{x1:p0[0],y1:p0[1],x2:p1[0],y2:p1[1],stroke:a.ev==="jun"?"var(--l0)":"var(--l3)","stroke-width":2.5,"vector-effect":"non-scaling-stroke","stroke-dasharray":"8 4"},g)})}
function renderSky(){
  $("chips").innerHTML="";$("tagrow").innerHTML="";$("opt1").innerHTML="";syncFilterBar([]);
  const saveKinds=new Set(st.sacred.kinds);st.sacred.kinds=new Set(["astro","major"]);const old=F.showLeysOther;F.showLeysOther=true;drawLeys();F.showLeysOther=old;st.sacred.kinds=saveKinds;
  drawSky();
  const now=new Date();const as=alignedSites();
  as.forEach(a=>{const m=mk("s-"+a.s.cat,a.s.xy,a.s.name,()=>select({kind:"site",id:a.s.id},false),{key:a.s.key});markClasses(m.u,a.s.key);markers.push(m)});
  // this weekend
  const sat=new Date(now);sat.setDate(now.getDate()+((6-now.getDay()+7)%7));const sun=new Date(sat);sun.setDate(sat.getDate()+1);
  const ill=Math.round(moonIllum(sat)*100),st0=sunTimes(sat,HOME.lat,HOME.lon);
  const wk=skyEvents(new Date(sat.getTime()-2*864e5),4).filter(e=>e.kind!=="new"&&e.kind!=="full");
  const box=document.createElement("div");box.className="trip";
  box.innerHTML=`<div><b>This weekend</b> <span class="meta">${fmtD(sat)} – ${fmtD(sun)}</span></div>
   <div class="tripsum"><span><b>${moonPhaseName(sat)}</b> ${ill}% lit</span><span>Sunrise <b>${fmtT(st0?.rise)}</b></span><span>Sunset <b>${fmtT(st0?.set)}</b></span></div>
   <div class="meta">${ill<=25?"Dark skies this weekend: good for sky-watching, light reports and the meteor showers.":ill>=85?"A bright moon this weekend: good for night walks to the stones, poor for faint lights.":"A part-lit moon this weekend."}${wk.length?" Also on: "+wk.map(e=>esc(e.name)).join(", ")+".":""} Times are for Mold.</div>`;
  $("intro").innerHTML="";$("formbox").innerHTML="";$("intro").appendChild(box);
  // aligned sites
  section("Sites aligned to the sun and moon",as.map(a=>{let when="",d=null;if(a.ev!=="lunar"){const y=now.getUTCFullYear();d=fromJ(seasons(y)[a.ev]);if(d<now)d=fromJ(seasons(y+1)[a.ev]);const t=sunTimes(d,a.s.lat,a.s.lon);when=`${fmtD(d)} · ${a.what} ${fmtT(a.what==="sunrise"?t?.rise:t?.set)} · in ${daysTo(d)} days`}else when="Next major lunar standstill around 2043";
    return row(icon("s-"+a.s.cat),a.s.name+" · "+(a.ev==="jun"?"midsummer ":a.ev==="dec"?"midwinter ":"")+a.what,"",when+" · "+a.note,isSel("site",a.s.id),()=>select({kind:"site",id:a.s.id},true),"",a.s.key)}));
  const astro=leys.filter(l=>l.kind==="astro");
  section("Astronomical alignments",astro.map(l=>row(leyIcon(l),l.name,Math.round(l.mi)+" mi",l.desc,isSel("ley",l.id),()=>select({kind:"ley",id:l.id},true))));
  // calendar
  const ev=skyEvents(now,370);const sym={sun:"☀",fire:"✦",meteor:"☄",new:"●",full:"○"};
  const list=$("list");const h=document.createElement("h2");h.textContent="The next twelve months · "+ev.length;list.appendChild(h);const ol=document.createElement("ol");
  ev.forEach(e=>{const li=document.createElement("li");li.className="stop";const dd=daysTo(e.d);
    const sites_=e.kind==="sun"?as.filter(a=>a.ev===e.key):[];const t=e.kind==="sun"?sunTimes(e.d,HOME.lat,HOME.lon):null;
    li.innerHTML=`<span class="n" style="background:${e.kind==="sun"?"var(--l0)":e.kind==="fire"?"var(--l6)":e.kind==="meteor"?"var(--l3)":"var(--muted)"}">${sym[e.kind]}</span><span class="nm"></span><span class="meta">${dd<=0?"today":dd===1?"tomorrow":"in "+dd+" days"}</span><span class="ds"></span>`;
    li.querySelector(".nm").textContent=e.name;
    li.querySelector(".ds").textContent=`${fmtD(e.d)} · ${e.sub}${t?` · Mold sunrise ${fmtT(t.rise)}, sunset ${fmtT(t.set)}`:""}${sites_.length?" · Go to: "+sites_.map(a=>a.s.name).join(", "):""}`;
    if(sites_.length){li.querySelector(".nm").style.cursor="pointer";li.querySelector(".nm").onclick=()=>fitPoints(sites_.map(a=>a.s.xy))}
    ol.appendChild(li)});list.appendChild(ol);
  $("count").textContent="";
}

// ---------- selection ----------
function select(s,fly){sel=s;render();
  if(s.kind==="site"){const x=sites[s.id];siteCard(x);if(fly)flyTo(x.xy,140)}
  else if(s.kind==="ley"){const l=leyOf(s.id);leyCard(l);if(fly){fitPoints(l.path);scrollToMap()}}
  else if(s.kind==="sinc"){const r=sincById.get(s.id);sincCard(r);if(fly)flyTo(r.xy,30)}
  else if(s.kind==="rep"){const r=reports.find(x=>x.id===s.id);if(r){repCard(r);if(fly)flyTo(r.xy,60)}}}

window.addEventListener("resize",applyVB);
setTab(location.hash.slice(1)||"sacred");

__COLLECTION__
