const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const DIR=process.env.DIR||path.join(__dirname,'test-data/files');
const buf=x=>({name:path.basename(x),mimeType:/csv$/.test(x)?'text/csv':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:fs.readFileSync(x)});
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1400,height:900},acceptDownloads:true});const p=await ctx.newPage();
const errs=[];const hook=pg=>{pg.on('pageerror',e=>errs.push('PAGE '+e.message));pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+' '+m.text().slice(0,200))});pg.on('dialog',d=>d.accept())};hook(p);
const login=async(pg)=>{await pg.goto('file:///home/user/marcom-crm/Konex.html');await sleep(600);await pg.click('[data-lk-role=admin]');await pg.fill('#lkPw','adminpass1');if(await pg.locator('#lkPw2').count())await pg.fill('#lkPw2','adminpass1');await pg.click('#lockBtn');await pg.waitForSelector('#lock',{state:'hidden',timeout:90000});await sleep(4500)};
await login(p);const F=()=>p.frames().find(x=>x!==p.mainFrame());
await p.evaluate(()=>goView('builder'));await sleep(2000);
await F().locator('#fileIn').setInputFiles(fs.readdirSync(DIR).map(x=>buf(path.join(DIR,x))));await sleep(12000);
const K=()=>p.evaluate(()=>({people:PEOPLE.length,dups:DUPS.length,codups:CODUPS.length,evs:EVSTATS.length,regs:EVSTATS.reduce((n,s)=>n+s.ins,0),pres:EVSTATS.reduce((n,s)=>n+s.pres,0),merges:Object.keys(MERGES).length,ign:Object.keys(IGNORED).length,cm:Object.keys(CMERGES).length}));
console.log('start',JSON.stringify(await K()));
// Konex : fusionne 15 doublons (même e-mail ou même nom même société), ignore 10, fusionne 5 entreprises
const did=await p.evaluate(()=>{const oc=window.confirm;window.confirm=()=>true;let m=0,i=0,c=0;const ds=DUPS.slice();
  for(const d of ds){if(m<15&&(d.reason==='sameEmail'||d.reason==='sameName')&&PMAP[d.a.id]&&PMAP[d.b.id]){mergeInto(d.b.id,d.a.id);m++}else if(i<10&&PMAP[d.a.id]&&PMAP[d.b.id]){ignorePair(d.key);i++}if(m>=15&&i>=10)break}
  for(const d of CODUPS.slice(0,5)){if(CMAP[d.a.id]&&CMAP[d.b.id]){CMERGES[d.b.id]={to:d.a.id,from:d.b.name,into:d.a.name,date:new Date().toISOString()};c++}}saveVault();rebuild();window.confirm=oc;return{m,i,c}});
await sleep(4000);console.log('konex decisions',JSON.stringify(did),JSON.stringify(await K()));
// mise à jour depuis l'outil (une décision quelconque là-bas)
await F().evaluate(()=>{mmbFresh();const it=C.K.companies[0];if(it)logAdd({t:'coDistinct',keys:it.members.map(m=>m.k),label:'t'});changed()});await sleep(6000);
console.log('after builder update',JSON.stringify(await K()));
const log=await F().evaluate(()=>{const c={};S.log.filter(e=>e.src).forEach(e=>c[e.t]=(c[e.t]||0)+1);return c});console.log('builder log from konex',JSON.stringify(log));
// export master file Excel depuis l'outil
await p.evaluate(()=>goView('builder'));await sleep(1500);
await F().evaluate(()=>{V.view='master';render();try{delete window.showSaveFilePicker;delete parent.showSaveFilePicker}catch(_){}});await p.evaluate(()=>{try{delete window.showSaveFilePicker}catch(_){}});await sleep(500);
const b64=await F().evaluate(async()=>{let d=await exportXlsx();if(d instanceof Blob)d=new Uint8Array(await d.arrayBuffer());else if(d instanceof ArrayBuffer)d=new Uint8Array(d);let s='';for(let i=0;i<d.length;i+=32768)s+=String.fromCharCode.apply(null,d.subarray(i,i+32768));return btoa(s)});
let mf=path.join(__dirname,'test-data/master_export.xlsx');fs.writeFileSync(mf,Buffer.from(b64,'base64'));console.log('exported',fs.statSync(mf).size);
const ref=await K();
// Konex vierge : import direct de la master file exportée
const ctx2=await b.newContext({viewport:{width:1400,height:900}});const p2=await ctx2.newPage();hook(p2);await login(p2);
if(mf){const r=await p2.evaluate(async b64=>{const bin=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const file=new File([bin],'Master file.xlsx');await importFiles([file]);return{people:PEOPLE.length,evs:EVSTATS.length,regs:EVSTATS.reduce((n,s)=>n+s.ins,0),pres:EVSTATS.reduce((n,s)=>n+s.pres,0),src:SOURCES.map(s=>s.name)}},fs.readFileSync(mf).toString('base64'));
  console.log('fresh konex from exported master',JSON.stringify(r),'vs builder-fed',JSON.stringify({people:ref.people,evs:ref.evs,regs:ref.regs,pres:ref.pres}))}
console.log('ERRORS',errs.length);[...new Set(errs)].slice(0,20).forEach(e=>console.log('  ',e));await b.close()})();
