// Test d’Arno : node tests/arno-test.js (jeu principal) ou C=./arno-corpus-2.js node tests/arno-test.js (formulations nouvelles). EN=1 pour l’outil en anglais.
// Prérequis : Playwright + Chromium. Le test crée un espace administrateur local (mot de passe de test « adminpass1 ») dans un navigateur vierge.
const {chromium}=require('playwright');const sleep=ms=>new Promise(r=>setTimeout(r,ms));const C=require(process.env.C||'./arno-corpus.js');
(async()=>{const b=await chromium.launch();const p=await b.newPage();p.on('dialog',d=>d.accept());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'..','Konex.html')+'');await sleep(2500);await p.click('[data-lk-role=admin]');await p.fill('#lkPw','adminpass1');if(await p.locator('#lkPw2').count())await p.fill('#lkPw2','adminpass1');await p.click('#lockBtn');await p.waitForSelector('#lock',{state:'hidden',timeout:60000});await sleep(500);
if(process.env.EN)await p.evaluate(()=>{document.querySelector('[data-lang=en]').click()});
await p.evaluate(()=>{setLS('me-name','Marie Test');const P=plNew({name:'Forum Clients 2027',date:'2027-05-12',lieu:'Bruxelles',type:'Conférence'},[]);saveVault();rebuild()});
const res=await p.evaluate(C=>C.map(([q,re])=>{ARNO.last=null;ARNO.expect=null;let o;const t0=performance.now();try{o=arnoBrain(q)}catch(e){return[q,false,'CRASH '+e.message,0]}
  const txt=o.filter(Boolean).map(m=>String(m.html).replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim()+(m.chips?' ['+m.chips.map(c=>c[0]).join('|')+']':'')).join(' ¦ ');
  return[q,new RegExp(re.source,re.flags).test(txt),txt.slice(0,200),Math.round(performance.now()-t0)]}),C.map(([q,re])=>[q,{source:re.source,flags:re.flags}]));
let ok=0;res.forEach(([q,g,txt,ms])=>{if(g)ok++;if(!g||process.env.V)console.log((g?'OK ':'KO ')+'| '+q+' ('+ms+' ms)\n     → '+txt)});
console.log(`\nSCORE ${ok}/${res.length} = ${Math.round(100*ok/res.length)} %`,'ERR',errs);await b.close()})();
