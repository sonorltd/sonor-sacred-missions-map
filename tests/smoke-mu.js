const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync('/home/claude/smm/index.html','utf8');
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://x.test/#paranormal",beforeParse(w){w.matchMedia=()=>({matches:false});for(const p of [w.HTMLElement.prototype,w.Element.prototype]){Object.defineProperty(p,'clientWidth',{get(){return 600},configurable:true});Object.defineProperty(p,'clientHeight',{get(){return 700},configurable:true})}w.Element.prototype.scrollIntoView=()=>{};w.Element.prototype.setPointerCapture=()=>{};}});
const w=dom.window,d=w.document;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{
 console.log('count',d.getElementById('count').textContent);
 for(const n of ['Haven Fort Hotel: Rose','Dodleston','Heol Fanog']){
  const row=[...d.querySelectorAll('li.row')].find(li=>li.textContent.includes(n)); if(!row){console.log('missing',n);continue}
  row.click(); const c=d.querySelector('#card');
  console.log('==',n,'| MU:',[...c.querySelectorAll('.srcs.mu > li > a')].map(a=>a.textContent).join(' ; '));
  console.log('   ex:',(c.querySelector('.mu-ex')||{}).textContent?.slice(0,160));
 }
 console.log('errors',errs);
},500);
