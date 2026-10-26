import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {assertMounted,assertRigDynamics} from './model-checks.mjs';
const {chromium}=await import(process.env.REVIEWER_PLAYWRIGHT_MODULE||'playwright');
const out=path.resolve(process.env.REVIEWER_OUTPUT_DIR||'work/browser-integrated');await fs.mkdir(out,{recursive:true});
const launch={headless:true,args:process.env.REVIEWER_ANGLE?['--enable-gpu','--use-gl=angle',`--use-angle=${process.env.REVIEWER_ANGLE}`]:[]};
if(process.env.REVIEWER_CHANNEL)launch.channel=process.env.REVIEWER_CHANNEL;
if(process.env.REVIEWER_BROWSER_PATH)launch.executablePath=process.env.REVIEWER_BROWSER_PATH;
const started=Date.now(),browser=await chromium.launch(launch),context=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,hasTouch:true}),page=await context.newPage();
const errors=[],report=[],navigation=[],httpErrors=[],diagnosticRecoveries=[];let mobile=false;
page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
const step=ms=>page.evaluate(ms=>window.advanceTime(ms),ms);
async function click(sel){const el=page.locator(sel);if(mobile){await el.waitFor({state:'visible',timeout:10000});if(sel==='#interact-near'){const node=await el.elementHandle();await page.waitForTimeout(250);assert.equal(await node.evaluate(n=>n.isConnected&&n===document.querySelector('#interact-near')),true,'near action retains node identity across HUD updates');}await el.tap({timeout:10000});}else if(sel==='#start')await el.click();else await el.dispatchEvent('click');}
async function close(){if(await page.locator('#done-reading').isVisible())await click('#done-reading');else if(await page.locator('.close-panel').isVisible())await click('.close-panel');}
async function range(v){await page.locator('#timeline').evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},v);await step(1);}
function outsideBay(s){const shift=s.chapter===5?-10:0,p=s.player;assert.ok(!(p.x>2.5+shift&&p.x<7.7+shift&&p.z>-.4&&p.z<3.8),'player never walks inside private roof footprint');}
async function visit(id){
 await close();console.log('VISIT',id);const begin=Date.now();await click(`#hotspots [data-target="${id}"]`);let walked=0;
 for(;walked<8000;){const s=await state();if(s.panel)break;await step(500);walked+=500;outsideBay(await state());}
 let s=await state();
 // Diagnostic-only real keyboard workaround lets later chapters be reviewed while
 // retaining the observed blocker. Strict default never recovers automatically.
 for(let recovery=0;!s.panel&&process.env.REVIEWER_NAV_RECOVERY==='1'&&recovery<4;recovery++){
  const northeast=(s.chapter===3&&s.player.x>7.8&&Math.abs(s.player.z)<.8)||(s.chapter===5&&Math.abs(s.player.x+2.08)<.15&&Math.abs(s.player.z+.62)<.15);
  const southwest=s.chapter===4&&Math.abs(s.player.x-2.28)<.15&&s.player.z>3.8;
  const northwest=(s.chapter===4&&Math.abs(s.player.x-2.28)<.15&&Math.abs(s.player.z+.62)<.15)||(s.chapter===5&&Math.abs(s.player.x+7.65)<.15&&Math.abs(s.player.z+2.55)<.15);
  if(!(northeast||southwest||northwest))break;
  const keys=northeast?['ArrowRight','ArrowUp']:southwest?['ArrowLeft','ArrowDown']:['ArrowLeft','ArrowUp'];
  diagnosticRecoveries.push({chapter:s.chapter,target:id,blockedPlayer:s.player,reason:'early corner waypoint consumption',ordinaryKeys:keys});
  await page.locator('#world').focus();for(const key of keys){await page.keyboard.down(key);await step(200);await page.keyboard.up(key);}await click(`#hotspots [data-target="${id}"]`);
  for(let extra=0;extra<8000;extra+=500){s=await state();if(s.panel)break;await step(500);walked+=500;outsideBay(await state());}s=await state();
 }
 assert.ok(s.panel,`target ${id} reachable within8 simulated walking seconds; player=${JSON.stringify(s.player)}`);assert.equal(s.selectedTarget,id);navigation.push({chapter:s.chapter,target:id,simulatedMs:walked,wallMs:Date.now()-begin,player:s.player});
}
async function snap(name){const s=await state();assertMounted(s);await fs.writeFile(path.join(out,name+'.json'),JSON.stringify(s,null,2));await page.screenshot({path:path.join(out,name+'.png'),timeout:120000,animations:'disabled'});}
async function read(w,{question,activity,snapshot}={}){
 await visit(w);if(question!==undefined)await click(`[data-question="${question}"]`);await page.locator('#done-reading').waitFor();assert.equal(await page.locator('.english').getAttribute('dir'),'ltr');const t=(await state()).world.time;await step(1000);assert.equal((await state()).world.time,t,'reading pauses clock');
 if(snapshot){await page.locator('#panel').evaluate(el=>el.scrollTop=0);await snap(snapshot);}
 if(activity){await page.locator('#source-activity').selectOption(activity);await click('#record-activity');assert.equal((await state()).hypothesis.activity,activity);}
 if(question===1)assert.equal(await page.locator('#record-activity').count(),0,'completed found-key account does not imply ongoing activity');await close();
}
async function mark(id){await visit('vessel-'+id);await click('#mark-vessel');assert.equal((await state()).hypothesis.vessel,id);}
async function moment(t,where='window'){await range(t);await visit(where);await click('#record-moment');assert.equal((await state()).hypothesis.eventTime,t,'recorded candidate does not auto-correct');await close();}
async function trialStart(){await visit('clock');await page.locator('#test-at-clock').evaluate(el=>{el.click();const p=document.querySelector('#play');if(!JSON.parse(window.render_game_to_text()).paused)p.click();});const s=await state();assert.equal(s.mode,'testing');assert.equal(s.paused,true);assert.match(await page.locator('#mode-label').innerText(),/המקורית/);}
async function playBurst(ms){return page.evaluate(ms=>{const p=document.querySelector('#play');if(JSON.parse(window.render_game_to_text()).paused)p.click();window.advanceTime(ms);if(!JSON.parse(window.render_game_to_text()).paused)p.click();return JSON.parse(window.render_game_to_text());},ms);}
async function skip(){await click('#skip-test');await step(1);}
async function checkSuccess(){await trialStart();await playBurst(4000);assert.equal((await state()).validated,true);assert.equal((await state()).mode,'replay');}
async function physical(id,t,{touch=false}={}){await range(t);await visit(id);await close();if(touch){assert.ok(mobile);await click('#interact-near');}else await page.keyboard.press('e');await step(1);assert.equal((await state()).selectedTarget,id);}
async function recover(t,opts){await physical('object',t,opts);assert.equal((await state()).mode,'won');assert.equal((await state()).recovered,true);assertMounted(await state());}
async function next(){await click('#next-case');await step(1);assertMounted(await state());}
async function viewport(w,h){mobile=w<650;await page.setViewportSize({width:w,height:h});await step(1);}
async function readingBounds(a,b){await visit('visitor');await range(a);await click('#record-reading-start');await range(b);await click('#record-reading-end');await close();const s=await state();assert.equal(s.hypothesis.readingStart,a);assert.equal(s.hypothesis.readingEnd,b);}
function clipState(s,carrying,playerMoving=false){const c=s.liveModels.clips.find(c=>c.role==='porter'),p=s.liveModels.clips.find(c=>c.role==='player');assert.equal(c.name,'carry');assert.equal(p.name,'walk');for(const v of[c,p])assert.equal(v.idleName,'idle');assert.equal(c.weight,carrying?1:0);assert.equal(c.idleWeight,carrying?0:1);assert.equal(p.weight,playerMoving?1:0);assert.equal(p.idleWeight,playerMoving?0:1);}
try{
 await page.goto(process.env.REVIEWER_URL||'http://localhost:5202',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>{const s=window.render_game_to_text&&JSON.parse(window.render_game_to_text());return s?.modelAnimations?.porter?.includes('carry')&&s?.modelAnimations?.porter?.includes('idle')&&s?.liveModels?.object?.assets?.includes('bird');},{},{timeout:120000,polling:1000});
 await click('#start');await range(10);assertMounted(await state());clipState(await state(),true);const dynamic=await assertRigDynamics(page);for(const s of dynamic.movingSamples)clipState(s,true,true);await fs.writeFile(path.join(out,'rig-dynamics.json'),JSON.stringify(dynamic,null,2));await range(35);clipState(await state(),false);report.push('Actual carry/walk/idle weights, changing carry pose, deterministic scrub and independent player rig passed.');
 await click('#settings');await click('#restart-case');await step(1);assertMounted(await state());await range(20);await snap('01-final-target-state');await range(10);
 // Consequential wrong stamp, then a genuine UI restart preserves exposure.
 await read('porter',{activity:'carrying boxes'});await read('visitor');await mark('NOA');await moment(31);await trialStart();const pausedAt=(await state()).world.time;await step(500);assert.equal((await state()).world.time,pausedAt);await page.keyboard.press('Space');assert.equal((await state()).paused,false);await page.keyboard.press('Space');assert.equal((await state()).paused,true);await skip();assert.equal((await state()).panel,'contradiction');assert.equal((await state()).unaided,false);await snap('02-wrong-stamp');await close();await click('#settings');await click('#restart-case');await step(1);assert.equal((await state()).facts.length,0);assert.equal((await state()).unaided,false);assert.equal((await state()).previousExposure.attempted,true);assertMounted(await state());report.push('Wrong recorded31 remains31, consumes an attempt; pause/Space and Skip work; restart preserves assisted exposure and models.');
 // Case1, world record and physical-first counterfactual replay, real touch actions.
 await read('porter',{activity:'carrying boxes'});await read('visitor');await mark('NOA');await moment(20);await click('#replay');await range(17);await visit('window');await close();await viewport(390,844);await click('#interact-near');await step(1);assert.equal((await state()).world.saved,true);assert.equal((await state()).interventions.at(-1).kind,'latch-window');await snap('03-mobile-latch');await viewport(1600,900);await range(20);await trialStart();assert.equal((await state()).world.saved,false);assert.equal((await state()).interventions.length,1);await playBurst(2500);assert.equal((await state()).world.gust,true);assert.equal((await state()).world.saved,false);await snap('04-original-history');await playBurst(1500);assert.equal((await state()).validated,true);assert.equal((await state()).world.saved,true);await range(23);await visit('object');await close();await viewport(390,844);await click('#interact-near');await step(1);assert.equal((await state()).mode,'won');assert.equal((await state()).unaided,false);assertMounted(await state());await snap('05-mobile-win');report.push('Case1 world route passed without notebook editing; touch latch/recovery work and original trial restores stored intervention.');
 await next();await read('porter',{activity:'carrying boxes',snapshot:'06-mobile-account'});await click('#notebook');assert.equal(await page.locator('#detailed-edit').evaluate(el=>el.open),false);await snap('07-mobile-quote-recap');await close();await viewport(1600,900);
 // Case2, wrong sequence then corrected overlap; alternate securing route.
 await readingBounds(28,34);await mark('AVI');await moment(26);await trialStart();await playBurst(500);assert.equal((await state()).world.carrying,true);assert.equal((await state()).world.reading,true);await snap('08-overlap-trial');await skip();assert.equal((await state()).panel,'contradiction');await snap('09-overlap-contradiction');await click('#retry-world');await readingBounds(14,34);await checkSuccess();await physical('object',10);assert.equal((await state()).world.object,'secured');await recover(29);await snap('10-case2-win');report.push('Case2 world-recorded reading28–34 fails; corrected14–34 and alternate securing recover successfully.');
 // Case3, same-colour wrong identity is consequential and editable.
 await next();await read('porter',{activity:'carrying boxes'});await read('visitor');await mark('AVI');await moment(25);await trialStart();await skip();assert.equal((await state()).panel,'contradiction');await click('#retry-world');await mark('NOA');await checkSuccess();await physical('window',21);assert.equal((await state()).world.saved,true);await recover(28);report.push('Case3 rejects wrong AVI identity despite same colour, then NOA/latch/recovery wins.');
 // Case4, all three useful questions and actual key pickup route.
 await next();await read('porter',{question:0,activity:'carrying boxes'});await read('porter',{question:1});await read('porter',{question:2});await read('visitor');await mark('STAGE');await moment(31);await checkSuccess();await range(24);await visit('clock');assert.equal(await page.locator('#take-key').isEnabled(),true);await click('#take-key');assert.equal((await state()).hasKey,true);await physical('window',27);assert.equal((await state()).world.saved,true);await recover(34);await snap('11-case4-win');report.push('Case4 distinct questions, found-key event, physical key/latch and recovery passed; models persist across bird chapters.');
 // Changed transfer, first attempt without solution hint; safe north object approach.
 await next();assert.equal(await page.locator('#hint').isDisabled(),true);assert.equal((await state()).liveModels.objectKind,'lantern');assert.equal((await state()).liveModels.object.assets.includes('bird'),false);await read('porter',{activity:'moving the ladder'});await visit('visitor');assert.match(await page.locator('#panel h2').innerText(),/עובדת התחנה/);await snap('12-transfer-account');await close();await mark('CANVAS');await moment(13,'door');await checkSuccess();await physical('door',11);assert.equal((await state()).interventions.at(-1).kind,'latch-door');await recover(17);assert.equal((await state()).hints,0);assert.equal((await state()).retries,0);assert.equal((await state()).unaided,true);await snap('13-transfer-win');report.push('Transfer uses distinct attendant, changed CANVAS/door13/ladder, navigable object approach and lantern only; first attempt/no solution hint passed.');
 await next();assert.equal((await state()).mode,'finished');await click('#play-again');await step(1);assert.equal((await state()).chapter,1);assertMounted(await state());assert.equal((await state()).unaided,false);assert.equal((await state()).previousExposure.completed,true);await snap('14-bird-restored');report.push('Finite finish and PlayAgain restore mounted bird, preserve rigs/props, and keep repeated completion assisted.');
 assert.equal(errors.length,0,'no console/page errors');
}catch(e){report.push(`FAILED: ${e.stack}`);process.exitCode=1;await snap('failure').catch(()=>{});}
finally{const summary={report,errors,httpErrors,navigation,diagnosticRecoveries,wallSeconds:(Date.now()-started)/1000,viewport:'1600×900 and390×844',channel:process.env.REVIEWER_CHANNEL||'bundled chromium',angle:process.env.REVIEWER_ANGLE||'default'};await fs.writeFile(path.join(out,'report.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));await browser.close();}
