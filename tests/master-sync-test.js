const {chromium}=require('playwright');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///home/user/marcom-crm/Konex.html');await sleep(400);await p.click('[data-lk-role=admin]');
await p.fill('#lkPw','adminpass1');if(await p.locator('#lkPw2').count())await p.fill('#lkPw2','adminpass1');await p.click('#lockBtn');await p.waitForSelector('#lock',{state:'hidden',timeout:60000});
await sleep(4000);const f=p.frames().find(x=>x!==p.mainFrame());
await f.evaluate(()=>{const o=window.mmbSyncApply;window.mmbSyncApply=async e=>{window.__ev=(window.__ev||[]).concat(e.map(x=>JSON.stringify(x).slice(0,220)));return o(e)}});await f.evaluate(async()=>{await ACT.demo()});await sleep(1500);
await f.evaluate(()=>{allSheetIds().forEach(id=>{if(!S.maps[id].ignore)confirmSheet(id)});changed()});await sleep(500);
await f.evaluate(()=>ACT.publish());await sleep(3500);
const snap=()=>p.evaluate(()=>({people:PEOPLE.length,cos:COMPANIES.length,evs:EVSTATS.length,cmos:CMOS.length,dups:DUPS.length,codups:CODUPS.length}));
console.log('after 1st publish',await snap());
const edit=async(type,id,vals)=>{await p.evaluate(([t,i])=>{closeDrawer();openFiche(t,i)},[type,id]);await sleep(300);await p.click('#dEdit');await sleep(300);for(const[k,v]of Object.entries(vals))await p.fill('#f_'+k,v);await p.click('#fSave');await sleep(600)};
// cibles
const T=await p.evaluate(()=>{const ps=PEOPLE.filter(x=>!x.internal&&x.rows.some(r=>!r.manual)&&x.nReg);const cos=COMPANIES.filter(c=>c.people.length&&!c.refOnly);
  return{p1:ps[0].id,p1n:ps[0].full,p2:ps[1].id,p3:ps[2].id,p4:ps[3].id,p5:ps[4].id,p5n:ps[4].full,p6:ps[5].id,co1:cos[0].id,co1n:cos[0].name,ev1:EVSTATS[0].e.id,ev1n:EVSTATS[0].e.name,ev2:EVSTATS[1].e.id,ev3:EVSTATS[2].e.id,ev2n:EVSTATS[1].e.name,cmo1:CMOS[0]&&CMOS[0].id,cmo2:CMOS[1]&&CMOS[1].id}});
console.log('targets',JSON.stringify(T));
await edit('person',T.p1,{prenom:'Zelda',nom:'Konexrename',poste:'Directrice Trésorerie',phone:'+32 470 00 00 00'});
const p1id=await p.evaluate(()=>(PEOPLE.find(x=>x.nom==='Konexrename')||{}).id);
await edit('person',T.p2,{societe:'Nouvelle Société SA'});
await edit('company',T.co1,{name:'Renommée Konex SA',sector:'Énergie'});
await edit('event',T.ev1,{name:'Événement renommé Konex',lieu:'Namur'});
await p.evaluate(T=>{closeDrawer();const a=PMAP[T.p3];PMETA[T.p3]={...(PMETA[T.p3]||{}),vip:true,pp:'press'};
  CMETA[T.co1]={...(CMETA[T.co1]||{}),cmos:['Claire Martin']};NOTES[T.p4]=[{id:'n1',text:'Note Konex test',date:new Date().toISOString(),author:'Test'}];saveVault();rebuild();
  mergeInto(T.p6,T.p5);mergeEv(T.ev3,T.ev2);if(T.cmo1&&T.cmo2)mergeCmo(T.cmo2,T.cmo1);},T);await sleep(800);
const st1=await p.evaluate(T=>({p1:PEOPLE.filter(x=>x.nom==='Konexrename').map(x=>[x.full,x.poste,x.phone]),p2:(PEOPLE.find(x=>x.id===T.p2)||{}).societe,co:COMPANIES.filter(c=>c.name==='Renommée Konex SA').map(c=>[c.sector,c.people.length]),
  ev:EVSTATS.filter(s=>s.e.name==='Événement renommé Konex').map(s=>[s.e.lieu,s.ins]),vip:(PMAP[T.p3]||{}).vip,pp:(PMETA[T.p3]||{}).pp,note:(NOTES[T.p4]||[]).length,m:!PMAP[T.p6],evm:!EMAP[T.ev3]&&EMAP[T.ev2].ins,cmo:T.cmo2?!CMOMAP[T.cmo2]:null}),T);
console.log('KONEX AFTER EDITS',JSON.stringify(st1),JSON.stringify(await snap()));
await sleep(2500);
console.log('EVTS',(await f.evaluate(()=>window.__ev||[])).join('\n'));console.log('SYNCQ',await p.evaluate(()=>SYNCQ.map(e=>e.k+(e.tries?'*'+e.tries:'')).join(',')));
await f.evaluate(()=>ACT.publish());await sleep(4000);
const st2=await p.evaluate(T=>({p1:PEOPLE.filter(x=>x.nom==='Konexrename').map(x=>[x.full,x.poste,x.phone]),p1old:PEOPLE.filter(x=>x.full===T.p1n).length,p2:(PEOPLE.find(x=>x.id===T.p2)||{societe:'GONE'}).societe,co:COMPANIES.filter(c=>c.name==='Renommée Konex SA').map(c=>[c.sector,c.people.length]),coOld:COMPANIES.filter(c=>c.name===T.co1n).length,
  ev:EVSTATS.filter(s=>s.e.name==='Événement renommé Konex').map(s=>[s.e.lieu,s.ins]),evOld:EVSTATS.filter(s=>s.e.name===T.ev1n).length,vip:(PMAP[T.p3]||{}).vip,pp:(PMETA[T.p3]||{}).pp,note:(NOTES[T.p4]||[]).length,m:!PMAP[T.p6],evm:!EMAP[T.ev3]&&EMAP[T.ev2]&&EMAP[T.ev2].ins,cmo:T.cmo2?!CMOMAP[T.cmo2]:null}),T);
console.log('KONEX AFTER PUBLISH',JSON.stringify(st2),JSON.stringify(await snap()));
const MF=await f.evaluate(()=>{const r=masterFlat();const h=r[0]||[];const ip=h.indexOf('Presse / Partenaire'),ic=h.indexOf('Pilot CMO');return{has:ip>=0,hasCmo:ic>=0,ref:!!(C.ref&&C.ref.rows.length),vals:r.slice(1).filter(x=>x[ip]).map(x=>x[1]+' '+x[2]+':'+x[ip])}});console.log('MASTER',JSON.stringify(MF));
console.log('konex rows pp',await p.evaluate(T=>[(PMAP[T.p3].rows||[]).map(r=>r.pp).join(','),ppOf(PMAP[T.p3])],T));
const snapA=await p.evaluate(()=>JSON.stringify([PMETA,CMETA,EVMETA,Object.keys(NOTES).sort(),PEOPLE.length,EVSTATS.map(s=>s.e.id+s.ins).sort()]));
await f.evaluate(()=>ACT.publish());await sleep(3500);
const snapB=await p.evaluate(()=>JSON.stringify([PMETA,CMETA,EVMETA,Object.keys(NOTES).sort(),PEOPLE.length,EVSTATS.map(s=>s.e.id+s.ins).sort()]));
console.log('cos',await p.evaluate(()=>JSON.stringify([COMPANIES.map(c=>c.id+'='+c.name),CMETA])));console.log('co cmos kept',await p.evaluate(()=>{const c=COMPANIES.find(x=>x.name==='Renommée Konex SA');return c&&[CMETA[c.id].cmos,coCmoNames(c),(CMOMAP[c.pilotCmoId]||{}).name]}));console.log('2nd publish stable:',snapA===snapB);if(snapA!==snapB){console.log(snapA);console.log(snapB)}
console.log('builder log src',await f.evaluate(()=>S.log.filter(e=>e.src).map(e=>e.t+':'+e.label.slice(0,70))));
console.log('ERR',errs.slice(0,8));await b.close()})();
