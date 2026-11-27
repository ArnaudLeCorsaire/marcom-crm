// Base partagée : l'admin alimente et publie, un commercial (vue standard) reçoit, modifie ; l'admin récupère et republie
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const DIR=process.env.DIR||path.join(__dirname,'test-data/files');
const buf=x=>({name:path.basename(x),mimeType:'application/octet-stream',buffer:fs.readFileSync(x)});
const FS=new Map();let T=1;
(async()=>{const b=await chromium.launch();
const mk=async()=>{const ctx=await b.newContext({viewport:{width:1400,height:900}});
  await ctx.exposeBinding('mfsGet',(_,p)=>FS.has(p)?FS.get(p):null);await ctx.exposeBinding('mfsSet',(_,p,d)=>{FS.set(p,{data:d,t:T++});return true});
  await ctx.exposeBinding('mfsList',(_,pre)=>[...FS.keys()].filter(k=>k.startsWith(pre)&&!k.slice(pre.length).includes('/')).map(k=>k.slice(pre.length)));
  await ctx.addInitScript({path:path.join(__dirname,'mockfs-shared.js')});const p=await ctx.newPage();return p};
const errs=[];const hook=(pg,l)=>{pg.on('pageerror',e=>errs.push(l+' PAGE '+e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(l+' '+m.text().slice(0,200))});pg.on('dialog',d=>{errs.push(l+' DIALOG '+d.message().slice(0,100));d.accept()})};
const login=async(pg,role,pw)=>{await pg.goto('file:///home/user/marcom-crm/Konex.html');await sleep(600);await pg.click(`[data-lk-role=${role}]`);await pg.fill('#lkPw',pw);if(await pg.locator('#lkPw2').count())await pg.fill('#lkPw2',pw);await pg.click('#lockBtn');await pg.waitForSelector('#lock',{state:'hidden',timeout:90000});await sleep(4000)};
const join=async(pg,create)=>{await pg.evaluate(c=>{shJoin(c)},create);await pg.waitForSelector('#shModal:not([hidden])',{timeout:15000});
  if(await pg.locator('#sh_name').count())await pg.fill('#sh_name',create?'Alice Admin':'Bob Commercial');await pg.fill('#sh_pass','cle-equipe-2026!');if(await pg.locator('#sh_pass2').count())await pg.fill('#sh_pass2','cle-equipe-2026!');
  await pg.click('#shOk');await sleep(5000)};
const K=pg=>pg.evaluate(()=>({people:PEOPLE.length,evs:EVSTATS.length,regs:EVSTATS.reduce((n,s)=>n+s.ins,0),cos:COMPANIES.length,ed:SHCFG&&SHCFG.edN,err:SHARE.err}));
// admin
const A=await mk();hook(A,'ADMIN');await login(A,'admin','adminpass1');
await A.evaluate(()=>goView('builder'));await sleep(1500);const FA=A.frames().find(x=>x!==A.mainFrame());
await FA.locator('#fileIn').setInputFiles(fs.readdirSync(DIR).filter(x=>!/^31 /.test(x)).map(x=>buf(path.join(DIR,x))));await sleep(12000);
await A.evaluate(()=>goView('share'));await join(A,true);console.log('admin after create',JSON.stringify(await K(A)),'files',[...FS.keys()]);
// commercial
const B=await mk();hook(B,'STD');await login(B,'standard','userpass1');await join(B,false);console.log('standard after join',JSON.stringify(await K(B)));
// le commercial modifie
const Tg=await B.evaluate(()=>{const ps=PEOPLE.filter(x=>x.email&&!x.internal);const co=COMPANIES.find(c=>c.people.length>2&&!c.refOnly);const by={};PEOPLE.forEach(x=>{const k=x.pn+' '+x.nn;(by[k]=by[k]||[]).push(x)});const g=Object.values(by).find(l=>l.length>1);const d=g&&{a:g[0],b:g[1]};
  PMETA[ps[0].id]={...(PMETA[ps[0].id]||{}),phone:'+32 470 12 34 56',pp:'partner'};CMETA[co.id]={...(CMETA[co.id]||{}),sector:'Énergie verte',cmos:[CMOS[2].rawName||CMOS[2].name]};
  NOTES[ps[1].id]=[{id:'nB',text:'Rencontré au forum',date:new Date().toISOString(),author:'Bob'}];saveVault();rebuild();
  if(d){const oc=window.confirm;window.confirm=()=>true;mergeInto(d.b.id,d.a.id);window.confirm=oc}
  return{p0:ps[0].id,p1:ps[1].id,co:co.id,cmo:CMOS[2].name,m:d&&[d.b.id,d.a.id]}});
await sleep(3000);console.log('standard edits',JSON.stringify(Tg),'contrib files',[...FS.keys()].filter(k=>/contributions/.test(k)));
// l'admin récupère
await A.evaluate(()=>shSync(true));await sleep(3000);
const chkA=pg=>pg.evaluate(T=>({phone:(PMAP[T.p0]||{}).phone,pp:ppOf(PMAP[T.p0]),sector:(CMAP[T.co]||{}).sector,cmo:CMAP[T.co]&&coCmoNames(CMAP[T.co]),note:(NOTES[T.p1]||[]).length,merged:T.m?!PMAP[T.m[0]]:null}),Tg);
console.log('admin sees',JSON.stringify(await chkA(A)),'journal',await A.evaluate(()=>(SHCFG.contrib||[]).length));
// l'admin dépose un nouveau fichier, Konex se met à jour, puis publie l'édition
await A.evaluate(()=>goView('builder'));await sleep(1000);
await FA.locator('#fileIn').setInputFiles(fs.readdirSync(DIR).filter(x=>/^31 /.test(x)).map(x=>buf(path.join(DIR,x))));await sleep(8000);
console.log('admin after new file',JSON.stringify(await K(A)),JSON.stringify(await chkA(A)));
await A.evaluate(()=>shPublish());await sleep(3000);
// le commercial synchronise
await B.evaluate(()=>shSync(true));await sleep(4000);console.log('standard after admin publish',JSON.stringify(await K(B)),JSON.stringify(await chkA(B)));
// le commercial rouvre Konex
await B.evaluate(()=>lockApp(false));await sleep(1500);await login(B,'standard','userpass1');await sleep(2000);console.log('standard after reopen',JSON.stringify(await K(B)),JSON.stringify(await chkA(B)));
console.log('ERRORS',errs.length);[...new Set(errs)].slice(0,20).forEach(e=>console.log('  ',e));await b.close()})();
