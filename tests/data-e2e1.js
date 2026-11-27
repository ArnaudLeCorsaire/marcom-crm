// Passe complète sur la chaîne de données, avec un jeu de données fictif (gen/files)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const DIR=process.env.DIR||path.join(__dirname,'test-data/files');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1400,height:900},acceptDownloads:true});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+' '+m.text().slice(0,200))});p.on('dialog',d=>{errs.push('DIALOG '+d.message().slice(0,120));d.accept()});
await p.goto('file:///home/user/marcom-crm/Konex.html');await sleep(400);await p.click('[data-lk-role=admin]');
await p.fill('#lkPw','adminpass1');if(await p.locator('#lkPw2').count())await p.fill('#lkPw2','adminpass1');await p.click('#lockBtn');await p.waitForSelector('#lock',{state:'hidden',timeout:60000});await sleep(3000);
await p.evaluate(()=>{window.__pub=0;const H=window.MARCOM_HOST,o=H.publishMaster;H.publishMaster=async a=>{window.__pub++;const t=Date.now();const r=await o(a);window.__pubT=(window.__pubT||[]).concat(Date.now()-t);return r}});
await p.evaluate(()=>goView('builder'));await sleep(2500);
const f=p.frames().find(x=>x!==p.mainFrame());
// dépôt de tous les fichiers en une fois (comme un utilisateur)
const files=fs.readdirSync(DIR).map(x=>path.join(DIR,x));
const t0=Date.now();
await f.locator('#fileIn').setInputFiles(files.map(x=>({name:path.basename(x),mimeType:/csv$/.test(x)?'text/csv':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:fs.readFileSync(x)})));
// confirmations éventuelles dans l'outil
let last=-1,stable=0;for(let i=0;i<400;i++){await sleep(500);const nf=await f.evaluate(()=>S.files.length+(S.ref?1:0));if(nf===last&&!(await f.locator('.busy:not([hidden]), #busy:not([hidden])').count()))stable++;else stable=0;last=nf;if(stable>=6)break;const m=await f.locator('#modal:not([hidden]) #mOk').count();if(m){errs.push('MODAL '+(await f.locator('#modal').innerText()).slice(0,200).replace(/\n/g,' '));await f.click('#modal #mOk')}}
await sleep(1500);
console.log('import ms',Date.now()-t0,'files',await f.evaluate(()=>S.files.length+(S.ref?1:0)),'of',files.length);
const B=await f.evaluate(()=>{mmbFresh();const st={};allSheetIds().forEach(id=>{const s=mapState(id);st[s]=(st[s]||0)+1});
  const inv=allSheetIds().filter(id=>mapState(id)==='invalid').map(id=>S.sheets[id].name+' ('+(S.files.find(f=>f.sheetIds.includes(id))||{}).name+'): '+mapIssues(id).join(' / '));
  const ctl=Object.fromEntries(Object.entries(C.K).map(([k,v])=>[k,v.length]).filter(([,n])=>n));
  return{files:S.files.length,ref:S.ref&&S.ref.rows.length,sheets:st,invalid:inv,persons:C.persons.length,events:C.evList.filter(e=>!e.excluded).length,ctl}});
console.log('BUILDER',JSON.stringify(B,null,1));
await sleep(4000);
const K=await p.evaluate(()=>({pubs:__pub,pubT:window.__pubT,people:PEOPLE.length,int:PEOPLE.filter(x=>x.internal).length,cos:COMPANIES.length,refCos:COMPANIES.filter(c=>c.ref).length,evs:EVSTATS.length,cmos:CMOS.length,regs:EVSTATS.reduce((n,s)=>n+s.ins,0),pres:EVSTATS.reduce((n,s)=>n+s.pres,0),ref:REFDATA&&REFDATA.rows.length,dups:DUPS.length,codups:CODUPS.length,swaps:SWAPS.length,typos:TYPOS.length}));
console.log('KONEX',JSON.stringify(K));
// comparaison par événement : builder (statuts autres que « non invité ») vs Konex
console.log('EVENTS',JSON.stringify(await f.evaluate(()=>C.evList.map(e=>e.name+' | '+e.date+' | '+(e.excluded?'EXCL':'')))));
const MF=await f.evaluate(()=>{const r=masterFlat(),h=r[0],out={};h.forEach((x,i)=>{const m=String(x).match(/^(.*\S)\s+(E\d+)$/);if(m&&/^(Evenement|Événement|Event)$/i.test(m[1].normalize('NFD').replace(/[\u0300-\u036f]/g,''))){}});
  const blocks={};h.forEach((x,i)=>{const m=String(x).match(/^(.*\S)\s+(E\d+)$/);if(!m)return;const b=blocks[m[2]]=blocks[m[2]]||{};const k=m[1].toLowerCase();if(/^(evenement|événement|event)$/.test(k))b.ev=i;else if(/^(présence|presence|attendance|statut|status)$/.test(k))b.st=i;else if(k==='date')b.d=i});
  const lbl={};S.statuses.forEach(s=>lbl[s.label]=s);
  Object.values(blocks).forEach(b=>{r.slice(1).forEach(row=>{const st=String(row[b.st]||''),ev=String(row[b.ev]||'');if(!ev)return;const k=ev+'|'+String(row[b.d]||'');const o=out[k]=out[k]||{inv:0,pres:0,labels:{}};const s=lbl[st];if(s&&s.stage===0)return;if(!st||st==='Non inscrit')return;o.inv++;o.labels[st]=(o.labels[st]||0)+1;if(s&&presId(s.id))o.pres++})});return{hdr:h.slice(0,14),blocks:Object.keys(blocks).length,out}});
console.log('MASTER HDR',JSON.stringify(MF.hdr),'blocks',MF.blocks);
Object.entries(MF.out).slice(0,40).forEach(([k,o])=>{});
fs.writeFileSync(path.join(__dirname,'test-data/e2e_master.json'),JSON.stringify(MF.out,null,1));
const cmpE=await f.evaluate(()=>C.evList.filter(e=>!e.excluded).map(e=>{let inv=0,pres=0;C.persons.forEach(p=>{const s=personStatus(p,e);if(s.id&&s.id!=='none'){inv++;if(presId(s.id))pres++}else if(s.raw){inv++}});return{name:e.name,date:e.date,inv,pres}}));
const kE=await p.evaluate(()=>EVSTATS.map(s=>({name:s.e.name,date:s.e.date,inv:s.ins,pres:s.pres,id:s.e.id})));
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let diffs=0;cmpE.forEach(e=>{const k=kE.filter(x=>norm(x.name)===norm(e.name)&&(!e.date||String(x.date||'').slice(0,10)===String(e.date).slice(0,10)));if(k.length!==1||k[0].inv!==e.inv||k[0].pres!==e.pres){diffs++;if(diffs<15)console.log('DIFF',JSON.stringify(e),'→',JSON.stringify(k))}});
console.log('events compared',cmpE.length,'konex',kE.length,'diffs',diffs);
fs.writeFileSync(path.join(__dirname,'test-data/e2e_state.json'),JSON.stringify({B,K,cmpE,kE},null,1));
console.log('ERRORS',errs.length);errs.slice(0,25).forEach(e=>console.log('  ',e));
if(process.env.KEEP){global.__p=p;global.__f=f}else await b.close()})();
