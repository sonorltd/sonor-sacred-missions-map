const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(''+require('path').join(__dirname,'..','index.html')+'','utf8');
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://x.test/#sacred",beforeParse(w){w.matchMedia=()=>({matches:false});for(const p of [w.HTMLElement.prototype,w.Element.prototype]){Object.defineProperty(p,'clientWidth',{get(){return 600},configurable:true});Object.defineProperty(p,'clientHeight',{get(){return 700},configurable:true})}w.Element.prototype.scrollIntoView=()=>{};w.Element.prototype.setPointerCapture=()=>{};}});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const go=h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'))};
setTimeout(()=>{try{
 console.log('tabs:',[...d.querySelectorAll('.tabs a')].map(a=>a.textContent).join(' | '));
 for(const t of ['ufo','ghosts','cryptids','strange','ritual','mu','paranormal']){go(t);console.log(t.padEnd(10),d.getElementById('count').textContent,'| chips:',[...d.querySelectorAll('#chips .chip')].map(c=>c.textContent.trim().replace(/\s+\d+$/,'')).filter(x=>!/Ley|Hot|All/.test(x)).join(','),'| sub:',d.getElementById('sub').textContent.slice(0,50))}
 go('cryptids');d.getElementById('q').value='wolf';d.getElementById('q').dispatchEvent(new w.Event('input'));console.log('wolf in cryptids:',[...d.querySelectorAll('#list li.row')].map(r=>r.querySelector('.nm,b,strong')?.textContent||r.textContent.slice(0,50)).join(' || '));
 d.getElementById('q').value='';d.getElementById('q').dispatchEvent(new w.Event('input'));
 go('starred');console.log('starred:',d.getElementById('count').textContent,[...d.querySelectorAll('#list li.row')].map(r=>r.textContent.slice(0,40)).join(' || '));
 d.querySelector('#list li.row').click();console.log('card:',d.querySelector('#card h3').textContent,'| star btn:',d.querySelector('#card .mkb.star')?.textContent,'| cases within 10:',d.querySelectorAll('#card .xl').length, [...d.querySelectorAll('#card .xl')].slice(0,3).map(x=>x.textContent).join(' / '));
 d.querySelector('#card .mkb.star').click();go('starred');console.log('after unstar:',d.getElementById('count').textContent);
 go('paranormal');const xs=[...d.querySelectorAll('#list li.row')].find(r=>/Tonmawr/.test(r.textContent));xs.click();console.log('tonmawr parts:',[...d.querySelectorAll('#card .xe')].map(x=>x.textContent).join(','));
 go('strange');const fr=[...d.querySelectorAll('#list li.row')].find(r=>/Witch Peggy/.test(r.textContent))||[...d.querySelectorAll('#list li.row')][0];fr.click();console.log('peggy parts:',d.querySelector('#card h3').textContent,[...d.querySelectorAll('#card .xe')].map(x=>x.textContent).join(','));
 go('paranormal');go('sacred');go('trip');go('sky');
}catch(e){console.log('EXC',e.stack)}console.log('errors',errs);process.exit(0)},2500);
