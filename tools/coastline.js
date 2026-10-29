const topo=require('topojson-client');
const w=require('./node_modules/world-atlas/countries-10m.json');
const fc=topo.feature(w,w.objects.countries);
const want={'826':'gb','372':'ie','833':'im'};
const lat0=55.2,lon0=-3.4,k=100,c=Math.cos(lat0*Math.PI/180);
const P=(lon,lat)=>[ (lon-lon0)*c*k, -(lat-lat0)*k ];
function simplify(pts,tol){ // radial distance
  const out=[pts[0]];for(const p of pts){const q=out[out.length-1];if(Math.hypot(p[0]-q[0],p[1]-q[1])>=tol)out.push(p);}return out;}
const res={};
for(const f of fc.features){const key=want[f.id];if(!key)continue;
 const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
 let d='';
 for(const poly of polys){const ring=poly[0];
   if(ring.every(([x,y])=>x<-9||x>2.2||y<49.5||y>61)) continue;
   const pts=simplify(ring.map(([x,y])=>P(x,y)),0.35);
   if(pts.length<4)continue;
   d+='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';}
 res[key]=d;}
require('fs').writeFileSync('shapes.json',JSON.stringify(res));
console.log(Object.entries(res).map(([k,v])=>k+':'+v.length).join(' '));
const all=[P(-8.7,60.9),P(1.9,49.8)];console.log(all);
