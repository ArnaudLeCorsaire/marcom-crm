// Scénario de vie : dépôt, décisions, saisies Konex, verrouillage, nouvelle version d'un fichier, ajout / retrait de fichier
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const DIR=process.env.DIR||path.join(__dirname,'test-data/files');
const buf=x=>({name:path.basename(x),mimeType:/csv$/.test(x)?'text/csv':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:fs.readFileSync(x)});
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1400,height:900}});const p=await ctx.newPage();
const errs=[];const hook=pg=>{pg.on('pageerror',e=>errs.push('PAGE '+e.message));pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+' '+m.text().slice(0,200))});pg.on('dialog',d=>{errs.push('DIALOG '+d.message().slice(0,120));d.accept()})};hook(p);
const login=async()=>{await p.goto('file:///home/user/marcom-crm/Konex.html');await sleep(600);await p.click('[data-lk-role=admin]');await p.fill('#lkPw','adminpass1');if(await p.locator('#lkPw2').count())await p.fill('#lkPw2','adminpass1');await p.click('#lockBtn');await p.waitForSelector('#lock',{state:'hidden',timeout:90000});await sleep(4500)};
const F=()=>p.frames().find(x=>x!==p.mainFrame());
const settle=async(ms=3500)=>{const f=F();let last='',st=0;for(let i=0;i<200;i++){await sleep(500);const s=await f.evaluate(()=>S.files.length+'|'+(S.ref?1:0)+'|'+S.log.length+'|'+(S.pubHash||'')).catch(()=>'');const busy=await f.locator('#busy:not([hidden]), .busy:not([hidden])').count();if(s===last&&!busy)st++;else st=0;last=s;if(st>=Math.ceil(ms/500))break}};
const modalOk=async()=>{const f=F();for(let i=0;i<10;i++){if(await f.locator('#modal:not([hidden]) #mOk').count()){errs.push('MODAL '+(await f.locator('#modal').innerText()).slice(0,160).replace(/\n/g,' '));await f.click('#modal #mOk');await sleep(400)}else break}};
const K=()=>p.evaluate(()=>({people:PEOPLE.length,evs:EVSTATS.length,regs:EVSTATS.reduce((n,s)=>n+s.ins,0),pres:EVSTATS.reduce((n,s)=>n+s.pres,0),cos:COMPANIES.length,cmos:CMOS.length,ref:REFDATA&&REFDATA.rows.length,src:SOURCES.length}));
const step=async(l)=>console.log(('['+l+']').padEnd(34),JSON.stringify(await K()),'pubs',await p.evaluate(()=>window.__pub||0));
await login();await p.evaluate(()=>{window.__pub=0;const H=window.MARCOM_HOST,o=H.publishMaster;H.publishMaster=async a=>{window.__pub++;return o(a)}});
await p.evaluate(()=>goView('builder'));await sleep(2000);
const files=fs.readdirSync(DIR).filter(x=>!/^31 /.test(x)).map(x=>path.join(DIR,x));
await F().locator('#fileIn').setInputFiles(files.map(buf));await sleep(1500);await modalOk();await settle();await sleep(2500);
await step('1. dépôt');
// 2. décisions en lot dans l'outil (comme un admin pressé) + statut inconnu « Oui » → Présent
const dec=await F().evaluate(async()=>{mmbFresh();const out={};const ok=async fn=>{const pr=modal;modal=async()=>true;try{await fn()}finally{modal=pr}};
  out.dupesStrong=C.K.dupes.filter(i=>i.strength==='strong').length;await ok(()=>ACT.bulkDupes());
  out.swaps=C.K.swap.filter(i=>i.kind==='caps').length;await ok(()=>ACT.bulkSwap());
  out.cos=C.K.companies.filter(i=>i.strength==='strong').length;await ok(()=>ACT.bulkCompanies());
  const st=statusById('present');st.aliases=[...(st.aliases||[]),'oui','x'];const ab=statusById('absent');ab.aliases=[...(ab.aliases||[]),'non'];changed();
  return out});
await settle();await sleep(2500);console.log('decisions',JSON.stringify(dec));await step('2. décisions en lot');
// 3. saisies dans Konex
const T=await p.evaluate(()=>{const ps=PEOPLE.filter(x=>!x.internal&&x.email&&x.nReg>1);const p1=ps[0],p2=ps[1],p3=ps[2];const co=COMPANIES.find(c=>c.people.length>3&&!c.refOnly);
  PMETA[p1.id]={...(PMETA[p1.id]||{}),phone:'+32 499 11 22 33',pp:'press'};PMETA[p2.id]={...(PMETA[p2.id]||{}),poste:'Directeur Konex'};
  NOTES[p3.id]=[{id:'n1',text:'note test',date:new Date().toISOString(),author:'T'}];CMETA[co.id]={...(CMETA[co.id]||{}),sector:'Secteur Konex',name:co.name+' Renamed'};
  saveVault();rebuild();return{p1:p1.id,p2:p2.id,p3:p3.id,co:co.id,coName:co.name+' Renamed',p2name:p2.full}});
await sleep(4000);await step('3. saisies Konex');
const chk=()=>p.evaluate(T=>({phone:(PMAP[T.p1]||{}).phone,pp:ppOf(PMAP[T.p1]),poste:(PMAP[T.p2]||{}).poste,note:(NOTES[T.p3]||[]).length,co:(COMPANIES.find(c=>c.name===T.coName)||{}).sector}),T);
console.log('   konex edits',JSON.stringify(await chk()));
// 4. verrouillage / réouverture
await p.evaluate(()=>lockApp(false));await sleep(1500);await login();await step('4. après réouverture');console.log('   konex edits',JSON.stringify(await chk()));
await p.evaluate(()=>{window.__pub=0;const H=window.MARCOM_HOST,o=H.publishMaster;H.publishMaster=async a=>{window.__pub++;return o(a)}});
console.log('   builder state',JSON.stringify(await F().evaluate(()=>({files:S.files.length,log:S.log.length,ref:!!S.ref,pubHash:!!S.pubHash}))));
// 5. nouvelle version d'un fichier (statuts mis à jour + 5 nouveaux invités) — remplacement
await p.evaluate(()=>goView('builder'));await sleep(1500);
const v2=path.join(__dirname,'test-data/v2');fs.mkdirSync(v2,{recursive:true});
const {execSync}=require('child_process');
execSync(`python3 -c "
import openpyxl,glob,os
src=[f for f in glob.glob('${DIR}/*.xlsx') if os.path.basename(f).startswith('02 ')][0]
wb=openpyxl.load_workbook(src);ws=wb.active
for r in ws.iter_rows(min_row=2):
    if r[4].value in ('Inscrit','Registered','confirmé'): r[4].value='Présent'
for i in range(5): ws.append(['Neu'+str(i),'Gast'+str(i),'neu.gast'+str(i)+'@newco.be','NewCo SA','CFO','Présent','Marc ROSSI'])
wb.save('${v2}/'+os.path.basename(src))
"`);
const v2f=fs.readdirSync(v2).map(x=>path.join(v2,x));
await F().locator('#fileIn').setInputFiles(v2f.map(buf));await sleep(1200);await modalOk();await settle();await sleep(2500);await step('5. nouvelle version fichier 02');
console.log('   konex edits',JSON.stringify(await chk()),'newco',await p.evaluate(()=>PEOPLE.filter(x=>/newco/.test(x.email)).length));
// 6. ajout d'un nouveau fichier (événement 31)
const f31=fs.readdirSync(DIR).filter(x=>/^31 /.test(x)).map(x=>path.join(DIR,x));
await F().locator('#fileIn').setInputFiles(f31.map(buf));await sleep(1200);await modalOk();await settle();await sleep(2500);await step('6. ajout fichier 31');
// 7. retrait d'un fichier
const rm=await F().evaluate(()=>{const f=S.files.find(x=>/^04 /.test(x.name));return f&&f.id});
if(rm){await F().evaluate(id=>{const el=document.createElement('button');el.dataset.fid=id;el.dataset.act='removeFile';document.body.appendChild(el);el.click();el.remove()},rm);await sleep(600);await modalOk();await settle();await sleep(2500)}
await step('7. retrait fichier 04');console.log('   event 04 in konex',await p.evaluate(()=>EVSTATS.filter(s=>/afterwork/i.test(s.e.name)&&/2023-05-18/.test(s.e.date||'')).length));
console.log('   konex edits',JSON.stringify(await chk()));
// 8. cohérence finale outil ↔ Konex
const fin=await F().evaluate(()=>{mmbFresh();return{persons:C.persons.length,events:C.evList.filter(e=>!e.excluded).length}});console.log('   builder',JSON.stringify(fin));
console.log('ERRORS',errs.length);[...new Set(errs)].slice(0,30).forEach(e=>console.log('  ',e));await b.close()})();
