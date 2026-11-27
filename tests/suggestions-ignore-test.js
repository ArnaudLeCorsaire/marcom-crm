const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const DIR=require('path').join(__dirname,'test-data/files');const buf=x=>({name:path.basename(x),mimeType:'application/octet-stream',buffer:fs.readFileSync(x)});
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
const login=async()=>{await p.goto('file:///home/user/marcom-crm/Konex.html');await sleep(600);await p.click('[data-lk-role=admin]');await p.fill('#lkPw','adminpass1');if(await p.locator('#lkPw2').count())await p.fill('#lkPw2','adminpass1');await p.click('#lockBtn');await p.waitForSelector('#lock',{state:'hidden',timeout:90000});await sleep(4500)};
await login();const F=()=>p.frames().find(x=>x!==p.mainFrame());await p.evaluate(()=>goView('builder'));await sleep(1500);
await F().locator('#fileIn').setInputFiles(fs.readdirSync(DIR).map(x=>buf(path.join(DIR,x))));await sleep(12000);
const st=()=>p.evaluate(()=>({sugg:SUGG.length,suggItems:SUGG.reduce((n,x)=>n+x.items.length,0),typos:TYPOS.length,caseOnly:TYPOS.filter(x=>x.why.length===1&&x.why[0]==='case').length,fixes:Object.keys(FIXES).length}));
console.log('start',JSON.stringify(await st()));
const sample=await p.evaluate(()=>({t:TYPOS.slice(0,6).map(x=>x.p.full+' → '+x.prenom+' '+x.nom+' ['+x.why+']'),s:SUGG.slice(0,6).map(x=>x.p.full+' : '+x.items.map(i=>i.f+'='+i.v+'('+i.conf+')').join(', '))}));console.log(JSON.stringify(sample,null,1));
// appliquer comme l'utilisateur : bouton « tout corriger » majuscules + appliquer suggestions sûres + chaque suggestion restante
await p.evaluate(()=>{const oc=window.confirm;window.confirm=()=>true;TYPOS.slice().forEach(x=>ignoreFix(x.p.id));SUGG.slice().forEach(x=>x.items.forEach(i=>ignoreSug(x.p.id,i.f)));window.confirm=oc});
await sleep(500);console.log('after apply (konex)',JSON.stringify(await st()));
await sleep(6000);console.log('after sync to builder',JSON.stringify(await st()),'syncq',await p.evaluate(()=>SYNCQ.length));
// mise à jour depuis l'outil (une décision quelconque)
await F().evaluate(()=>{mmbFresh();const it=C.K.companies[0];if(it)logAdd({t:'coDistinct',keys:it.members.map(m=>m.k),label:'t'});changed()});await sleep(7000);
console.log('after builder publish',JSON.stringify(await st()));
console.log(JSON.stringify(await p.evaluate(()=>({t:TYPOS.slice(0,8).map(x=>x.p.full+' → '+x.prenom+' '+x.nom+' ['+x.why+']'),s:SUGG.slice(0,8).map(x=>x.p.full+' : '+x.items.map(i=>i.f+'='+i.v).join(', ')+' | pm='+JSON.stringify(PMETA[x.p.id]||{}))})),null,1));
// réouverture
await p.evaluate(()=>lockApp(false));await sleep(1500);await login();await sleep(3000);console.log('after reopen',JSON.stringify(await st()));
console.log('ERR',errs);await b.close()})();
