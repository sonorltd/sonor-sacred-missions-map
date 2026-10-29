const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync('/home/claude/smm/index.html','utf8');
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://x.test/#paranormal",beforeParse(w){w.matchMedia=()=>({matches:false});for(const p of [w.HTMLElement.prototype,w.Element.prototype]){Object.defineProperty(p,'clientWidth',{get(){return 600},configurable:true});Object.defineProperty(p,'clientHeight',{get(){return 700},configurable:true})}w.Element.prototype.scrollIntoView=()=>{};w.Element.prototype.setPointerCapture=()=>{};}});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const ch=(id,v)=>{const s=d.getElementById(id);s.value=v;s.dispatchEvent(new w.Event('change'))};
setTimeout(()=>{
 console.log('start',d.getElementById('count').textContent, '| areas', d.getElementById('f-area').options.length, '| src opts', d.getElementById('f-src').options.length);
 ch('f-src','mu');console.log('MU only:',d.getElementById('count').textContent);ch('f-src','');
 ch('f-area','Pembrokeshire');console.log('Pembrokeshire:',d.getElementById('count').textContent);ch('f-area','');
 d.getElementById('tg-open').click();console.log('tag groups:',[...d.querySelectorAll('.taggroup .tgl')].map(x=>x.textContent).join(', '));
 const tg=[...d.querySelectorAll('.taggroup .tg')];tg.find(b=>b.textContent.startsWith('police')).click();
 [...d.querySelectorAll('.taggroup .tg')].find(b=>b.textContent.startsWith('photo')).click();console.log('police OR photo:',d.getElementById('count').textContent);
 [...d.querySelectorAll('.seg button')].find(b=>b.dataset.m==='all').click();console.log('police AND photo:',d.getElementById('count').textContent);
 d.getElementById('f-clear').click();
 const chips=[...d.querySelectorAll('#chips .chip')].map(c=>c.textContent.trim());console.log('chips:',chips.join(' | '));
 w.location.hash='sinclair';w.dispatchEvent(new w.HashChangeEvent('hashchange'));
 console.log('sinclair',d.getElementById('count').textContent,'| areas',d.getElementById('f-area').options.length,'| tag head',!!d.getElementById('tg-open'));
 console.log('errors',errs);
},600);
