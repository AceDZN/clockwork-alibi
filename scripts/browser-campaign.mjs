import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {CASES} from '../src/content.ts';
const {chromium}=await import(process.env.REVIEWER_PLAYWRIGHT_MODULE||'playwright');
const root=process.env.REVIEWER_URL||'http://localhost:4202';
const out=path.resolve(process.env.REVIEWER_OUTPUT_DIR||'work/campaign-browser');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome',timeout:120000,args:['--enable-gpu','--use-gl=angle','--use-angle=metal']});
const context=await browser.newContext({viewport:{width:1600,height:1000},hasTouch:true});context.setDefaultTimeout(30000);
const page=await context.newPage(),errors=[],httpErrors=[],report=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)httpErrors.push({status:r.status(),url:r.url()});});
const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
const step=ms=>page.evaluate(ms=>window.advanceTime(ms),ms);
async function click(s){await page.locator(s).click();await step(1);}
async function close(){if(await page.locator('#done-reading').isVisible())await click('#done-reading');else if(await page.locator('.close-panel').isVisible())await click('.close-panel');}
async function range(t){await page.evaluate(t=>{const el=document.querySelector('#timeline');el.value=String(t);el.dispatchEvent(new Event('input',{bubbles:true}));window.advanceTime(1);},t);}
async function visit(id){
 await close();
 const result=await page.evaluate(id=>{
  window.advanceTime(1);
  const button=document.querySelector(`#hotspots [data-target="${id}"]`);if(!button)throw new Error('Missing world label: '+id);
  // These are the ordinary walk-to controls; stepping remains the same movement
  // and collision code used by the game, batched in one browser call.
  button.click();
  for(let i=0;i<25&&!JSON.parse(window.render_game_to_text()).panel;i++)window.advanceTime(500);
  const s=JSON.parse(window.render_game_to_text());return {panel:s.panel,chapter:s.chapter,player:s.player};
 },id);
 assert.ok(result.panel,`reachable target ${id} in level ${result.chapter}: ${JSON.stringify(result.player)}`);
}
async function read(id,index,activity){
 await visit(id);if((await state()).panel==='questions')await click(`[data-question="${index}"]`);
 assert.equal(await page.locator('.english').getAttribute('dir'),'ltr');
 if(activity){await page.locator('#source-activity').selectOption(activity);await click('#record-activity');}
}
async function trial(){await visit('clock');await page.evaluate(()=>{document.querySelector('#test-at-clock').click();if(JSON.parse(window.render_game_to_text()).mode==='testing')document.querySelector('#skip-test').click();});await step(1);}
async function snap(name){await fs.writeFile(path.join(out,name+'.json'),JSON.stringify(await state(),null,2));await page.screenshot({path:path.join(out,name+'.png'),timeout:120000});}
try{
 await page.goto(root,{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>window.render_game_to_text&&JSON.parse(window.render_game_to_text()).loadedModels.length===2,{},{timeout:120000});
 await click('#level-map');assert.equal(await page.locator('[data-level]').count(),50);assert.equal(await page.locator('[data-level][disabled]').count(),0);
 await snap('map-desktop');await click('[data-level="1"]');
 await click('#settings');await click('#toggle-mute');await close();
 await page.evaluate(()=>{
  const s=()=>JSON.parse(window.render_game_to_text());
  const check=(ok,message)=>{if(!ok)throw new Error(message+' (level '+s().chapter+')');};
  const click=selector=>{const el=document.querySelector(selector);check(el&&el.getClientRects().length&&!el.disabled,'Available UI control '+selector);el.click();window.advanceTime(1);};
  const close=()=>{if(document.querySelector('#done-reading'))click('#done-reading');else if(document.querySelector('.close-panel'))click('.close-panel');};
  const range=t=>{const el=document.querySelector('#timeline');el.value=String(t);el.dispatchEvent(new Event('input',{bubbles:true}));window.advanceTime(1);};
  const choose=(selector,value)=>{const el=document.querySelector(selector);check(el&&[...el.options].some(o=>o.value===value),'Existing choice '+selector);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));};
  const visit=id=>{close();window.advanceTime(1);click(`#hotspots [data-target="${id}"]`);for(let i=0;i<25&&!s().panel;i++)window.advanceTime(500);check(s().panel&&s().selectedTarget===id,'Reachable '+id);};
  const read=(id,index=0)=>{visit(id);if(s().panel==='questions')click(`[data-question="${index}"]`);check(document.querySelector('.english')?.dir==='ltr','LTR reading');const time=s().time;window.advanceTime(100);check(s().time===time,'Reading pauses time');};
  const trial=()=>{visit('clock');click('#test-at-clock');if(s().mode==='testing')click('#skip-test');};
  window.__campaignQA={
   solve(c){
    check(s().chapter===c.id,'Expected level');read('porter');choose('#source-activity',c.activity);click('#record-activity');close();
    for(let q=1;q<(c.accounts?.porter.length??(c.id===4?3:1));q++){read('porter',q);close();}
    read('visitor');if(c.id===2||c.requiresReading){range(c.reading[0]);click('#record-reading-start');range(c.reading[1]);click('#record-reading-end');}close();
    for(const record of c.accounts?.records??[]){read(record.id);close();}
    visit('vessel-'+c.target);click('#mark-vessel');range(c.open);visit('clock');click('#record-moment');close();
    if(c.deductions?.length){click('#notebook');for(const q of c.deductions)choose(`[data-deduction="${q.id}"]`,c.id===50&&q.id==='story'?'option-1':q.answer);}
    return s();
   },
   reconstruct(c){
    close();trial();if(c.id===50){check(!s().validated&&s().panel==='contradiction','Wrong inference must fail');return s();}check(s().validated,'Valid reconstruction');return s();
   },
   correct(){close();click('#notebook');choose('[data-deduction="story"]','option-0');close();trial();check(s().validated,'Corrected reconstruction');},
   change(c){
    if(c.id===26){range(0);visit('clock');check(document.querySelector('#take-key').disabled,'Key unavailable before time');range(c.latchFrom);check(!document.querySelector('#take-key').disabled,'Key reacts to timeline');click('#take-key');check(s().hasKey,'Collected key');visit(c.opening);click('#physical-action');}
    else{if(c.id===50){range(0);visit('object');click('#physical-action');check(!s().world.saved,'Early clamp must fail');}range(c.gust-1);visit('object');click('#physical-action');}check(s().world.saved,'Physical save');return s();
   },
   recover(c){range(c.gust+1);visit('object');click('#physical-action');check(s().mode==='won'&&s().campaign.completed.includes(c.id),'Actual recovery completes level');return {level:c.id,scene:s().scene,sources:s().facts.length,conclusions:c.deductions?.length??0,complete:true};}
  };
 });
 for(const c of CASES){
  await page.evaluate(c=>window.__campaignQA.solve(c),c);if(c.id===50)await snap('level50-conclusions');
  await page.evaluate(c=>window.__campaignQA.reconstruct(c),c);
  if(c.id===50){await snap('level50-wrong-inference');await page.evaluate(()=>window.__campaignQA.correct());}
  await page.evaluate(c=>window.__campaignQA.change(c),c);
  if(c.id%5===1&&c.id>1)await snap('scene-'+String(c.id).padStart(2,'0'));
  const result=await page.evaluate(c=>window.__campaignQA.recover(c),c);report.push(result);console.log('Completed level',c.id);await click('#next-case');
 }
 assert.equal((await state()).mode,'finished');assert.equal((await state()).campaign.completed.length,50);await snap('campaign-complete');
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.render_game_to_text);
 assert.match(await page.locator('#start').innerText(),/50/);await click('#start');assert.equal((await state()).chapter,50);assert.equal((await state()).campaign.completed.length,50);
 await page.setViewportSize({width:390,height:844});await step(1);await page.locator('#level-map').tap();
 assert.equal(await page.locator('[data-level]').count(),50);await page.locator('[data-level="46"]').scrollIntoViewIfNeeded();await snap('map-mobile');await page.locator('[data-level="46"]').tap();await step(1);
 assert.equal((await state()).chapter,46);await page.locator('#guide-action').tap();for(let i=0;i<25&&!(await state()).panel;i++)await step(500);
 await page.locator('[data-question="0"]').tap();await snap('advanced-mobile-account');assert.equal((await state()).panel,'dialogue');
 await page.locator('#source-activity').selectOption('carrying boxes');await page.locator('#record-activity').tap();await page.locator('#done-reading').tap();await step(1);assert.equal((await state()).guidance.id,'second-witness');
 assert.deepEqual(errors,[]);assert.deepEqual(httpErrors,[]);
}catch(error){console.error(error);process.exitCode=1;report.push({failure:String(error.stack)});await snap('failure').catch(()=>{});}
finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify({report,errors,httpErrors},null,2));await browser.close();}
