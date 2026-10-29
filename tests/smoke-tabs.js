const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync('/home/claude/smm/index.html','utf8');
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://x.test/#mu",beforeParse(w){w.matchMedia=()=>({matches:false});for(const p of [w.HTMLElement.prototype,w.Element.prototype]){Object.defineProperty(p,'clientWidth',{get(){return 600},configurable:true});Object.defineProperty(p,'clientHeight',{get(){return 700},configurable:true})}w.Element.prototype.scrollIntoView=()=>{};w.Element.prototype.setPointerCapture=()=>{};}});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const go=h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'))};
setTimeout(()=>{
 console.log('tabs:',[...d.querySelectorAll('.tabs a')].map(a=>a.textContent).join(' | '));
 console.log('MU:',d.getElementById('count').textContent,'| intro:',d.getElementById('intro').textContent.trim(),'| mk use',d.querySelector('#marks .mk use')?.getAttribute('href'));
 console.log('MU sections:',[...d.querySelectorAll('#list h2, #list .sec h3, #list h3')].slice(0,4).map(h=>h.textContent).join(' || '));
 const row=d.querySelector('#list li.row');row&&row.click();console.log('card has MU:',!!d.querySelector('#card .srcs.mu'));
 go('ritual');console.log('Ritual:',d.getElementById('count').textContent,'| sections:',[...d.querySelectorAll('#list h2, #list h3')].map(h=>h.textContent).join(' | '));
 go('paranormal');console.log('Paranormal:',d.getElementById('count').textContent,'| chips:',[...d.querySelectorAll('#chips .chip')].map(c=>c.textContent.trim()).filter(x=>/Occult/.test(x)).length,'occult chip');
 go('sinclair');console.log('Sinclair:',d.getElementById('count').textContent);
 go('trip');go('sky');console.log('errors',errs);
},600);
