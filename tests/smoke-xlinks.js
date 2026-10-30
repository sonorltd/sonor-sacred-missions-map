const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(''+require('path').join(__dirname,'..','index.html')+'','utf8');
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://x.test/#paranormal",beforeParse(w){w.matchMedia=()=>({matches:false});for(const p of [w.HTMLElement.prototype,w.Element.prototype]){Object.defineProperty(p,'clientWidth',{get(){return 600},configurable:true});Object.defineProperty(p,'clientHeight',{get(){return 700},configurable:true})}w.Element.prototype.scrollIntoView=()=>{};w.Element.prototype.setPointerCapture=()=>{};}});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const go=h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'))};
setTimeout(()=>{try{
 const chipBy=t=>[...d.querySelectorAll('#chips .chip')].find(c=>c.textContent.includes(t));
 chipBy('Hotspots').click();
 const hs=[...d.querySelectorAll('#list h2')].map(h=>h.textContent);console.log('sections:',hs.join(' | '));
 console.log('heat cells:',d.querySelectorAll('#hot rect, g rect').length);
 const hrow=[...d.querySelectorAll('#list li.row')].find(r=>/hotspot/.test(r.textContent));console.log('hot row:',hrow&&hrow.textContent.slice(0,200));
 hrow.click();console.log('hot card groups:',[...d.querySelectorAll('#card .xh')].map(x=>x.textContent).join(' | '));
 chipBy('All layers').click();console.log('all layers:',[...d.querySelectorAll('#list h2')].map(h=>h.textContent).filter(x=>/Hot/.test(x)).join(),[...d.querySelectorAll('#list li.row')].filter(r=>/hotspot/.test(r.textContent)).slice(0,3).map(r=>r.textContent.slice(0,120)).join(' || '));
 // card with connections
 const xl=d.querySelector('#card .xl');xl.click();console.log('card:',d.querySelector('#card h3').textContent,'| conn:',[...d.querySelectorAll('#card .xh')].map(x=>x.textContent).join(' | '),'| evid:',d.querySelector('#card .evid')?.textContent,'| sk:',[...d.querySelectorAll('#card .sk')].map(x=>x.textContent).join(','));
 const xe=[...d.querySelectorAll('.xl')].length;
 // find a card with an entity chip
 const rows=[...d.querySelectorAll('#list li.row')].filter(r=>!/hotspot/.test(r.textContent));let got=null;
 for(const r of rows.slice(0,400)){r.click();if(d.querySelector('#card .xe')){got=r;break}}
 console.log('entity card:',d.querySelector('#card h3')?.textContent,[...d.querySelectorAll('#card .xe')].map(x=>x.textContent).join(','));
 const before=d.getElementById('count').textContent;d.querySelector('#card .xe').click();console.log('filter:',before,'->',d.getElementById('count').textContent,'| banner:',d.querySelector('.entban')?.textContent.slice(0,160));
 go('sinclair');console.log('sinclair w/ ent:',d.getElementById('count').textContent);
 d.getElementById('ent-x')?.click();console.log('cleared:',d.getElementById('count').textContent);
 const sr=d.querySelector('#list li.row:not(.x)');[...d.querySelectorAll('#list li.row')].find(r=>!/hotspot/.test(r.textContent)).click();console.log('sinc card conn:',[...d.querySelectorAll('#card .xh')].map(x=>x.textContent).join(' | '));
 go('sacred');go('mu');go('ritual');go('sky');go('trip');
}catch(e){console.log('EXC',e.stack)}console.log('errors',errs);process.exit(0)},2500);
