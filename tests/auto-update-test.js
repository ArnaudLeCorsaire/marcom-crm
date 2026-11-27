const {chromium}=require('playwright');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///home/user/marcom-crm/Konex.html');await sleep(400);await p.click('[data-lk-role=admin]');
await p.fill('#lkPw','adminpass1');if(await p.locator('#lkPw2').count())await p.fill('#lkPw2','adminpass1');await p.click('#lockBtn');await p.waitForSelector('#lock',{state:'hidden',timeout:60000});
await sleep(4000);const f=p.frames().find(x=>x!==p.mainFrame());
await p.evaluate(()=>{window.__pub=0;const H=window.MARCOM_HOST,o=H.publishMaster;H.publishMaster=async a=>{window.__pub++;return o(a)}});
const before=await p.evaluate(()=>PEOPLE.length);
await f.evaluate(async()=>{await ACT.demo()});await sleep(5000);
console.log('people before/after demo',before,await p.evaluate(()=>PEOPLE.length),'pubs',await p.evaluate(()=>__pub),'source',await p.evaluate(()=>SOURCES.map(s=>s.name)));
// décision dans le builder
const d=await f.evaluate(()=>{mmbFresh();const x=C.K.dupes[0];logAdd({t:'merge',keys:x.members.map(q=>q.anchor),label:'test'});changed();return x.members.map(q=>q.prenom+' '+q.nom+' '+q.email)});
await sleep(3500);console.log('builder merge',d,'konex people',await p.evaluate(()=>PEOPLE.length),'pubs',await p.evaluate(()=>__pub));
// modification dans Konex : pas d'envoi en retour
const pubs0=await p.evaluate(()=>__pub);
await p.evaluate(()=>{const x=PEOPLE[3];PMETA[x.id]={...(PMETA[x.id]||{}),phone:'+32 1',vip:true};saveVault();rebuild()});await sleep(5000);
console.log('after konex edit pubs delta',await p.evaluate(()=>__pub)-pubs0,'vip kept',await p.evaluate(()=>PEOPLE[3].vip));
// idle : aucun bouclage
const pubs1=await p.evaluate(()=>__pub);await sleep(6000);console.log('idle pubs delta',await p.evaluate(()=>__pub)-pubs1);
await p.evaluate(()=>goView('builder'));await sleep(1500);await f.evaluate(()=>{V.view='master';render()});await sleep(500);
console.log('publish button',await f.locator('[data-act="publish"]').count(),'|',(await f.locator('.publish').innerText()).slice(0,140));
console.log('ERR',errs.slice(0,6));await b.close()})();
