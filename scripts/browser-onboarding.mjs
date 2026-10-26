import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.REVIEWER_PLAYWRIGHT_MODULE||'playwright');
const out=path.resolve(process.env.REVIEWER_OUTPUT_DIR||'work/onboarding');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,timeout:120000,channel:process.env.REVIEWER_CHANNEL||undefined,args:process.env.REVIEWER_ANGLE?['--enable-gpu','--use-gl=angle',`--use-angle=${process.env.REVIEWER_ANGLE}`]:[]});
const errors=[],report=[];
try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1600,height:900},hasTouch:mobile});context.setDefaultTimeout(120000);const page=await context.newPage();
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  const step=ms=>page.evaluate(ms=>window.advanceTime(ms),ms);
  async function click(selector){const el=page.locator(selector);if(mobile)await el.tap();else await el.click();await step(1);}
  async function snap(name){await page.screenshot({path:path.join(out,`${mobile?'mobile':'desktop'}-${name}.png`),animations:'disabled'});await fs.writeFile(path.join(out,`${mobile?'mobile':'desktop'}-${name}.json`),JSON.stringify(await state(),null,2));}
  async function follow(id){assert.equal((await state()).guidance.id,id);await click('#guide-action');for(let i=0;i<16&&!(await state()).panel;i++)await step(500);assert.ok((await state()).panel,`${id} leads to a reachable interaction`);}
  async function recordMoment(t){await page.locator('#timeline').fill(String(t));await step(1);await click('#record-moment');assert.equal(await page.locator('[data-saved-moment]').innerText(),`00:${String(t).padStart(2,'0')}`,'saved clock summary updates immediately');}
  await page.goto(process.env.REVIEWER_URL||'http://localhost:5202',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.render_game_to_text&&JSON.parse(window.render_game_to_text()).loadedModels.includes('porter'),{},{timeout:120000});
  await snap('intro');assert.equal(await page.locator('#time-tools').isVisible(),false);await click('#start');
  assert.equal((await state()).paused,true);await step(2000);assert.equal((await state()).time,10,'opening clock stays paused');await snap('next-step');
  await click('#guide-help');assert.equal((await state()).panel,'help');await click('#back-to-case');
  await follow('first-witness');assert.equal(await page.locator('#source-activity').inputValue(),'');assert.equal(await page.locator('#record-activity').isDisabled(),true);await snap('account');
  await click('#done-reading');assert.equal((await state()).guidance.id,'activity','reading alone does not complete the task');
  await follow('activity');await page.locator('#source-activity').selectOption('carrying boxes');await click('#record-activity');await click('#done-reading');
  await follow('second-witness');const quote=await page.locator('.english').innerText();assert.match(quote,/00:20/);assert.match(quote,/Noa/);await click('#done-reading');
  await follow('identity');assert.equal(await page.locator('[data-destination]').count(),2,'both labels offered without answer selection');await click('[data-destination="vessel-NOA"]');for(let i=0;i<16&&(await state()).panel!=='vessel';i++)await step(500);await click('#mark-vessel');
  await follow('moment');assert.match(await page.locator('#panel').innerText(),/טרם נשמר/);await recordMoment(31);await snap('clock');
  await click('#test-at-clock');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).mode!=='testing');assert.equal((await state()).panel,'contradiction');assert.equal((await state()).hypothesis.eventTime,31);await click('#retry-world');assert.equal((await state()).guidance.id,'moment','mistake points to the field to revise');
  await follow('moment');await recordMoment(20);await click('#test-at-clock');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).mode!=='testing');assert.equal((await state()).validated,true);assert.equal((await state()).mode,'replay');await snap('change');
  await follow('change');await click('#physical-action');assert.equal((await state()).world.saved,true);assert.equal((await state()).guidance.id,'outcome');await snap('outcome');
  await click('#guide-action');assert.equal((await state()).guidance.id,'recover');assert.equal((await state()).recovered,false,'viewing outcome does not collect the object');
  await follow('recover');await click('#physical-action');assert.equal((await state()).mode,'won');await snap('win');
  await click('#next-case');assert.equal((await state()).chapter,2);assert.equal((await state()).guidance.id,'first-witness');assert.ok(Object.values((await state()).recordedClues).every(v=>!v));
  report.push(`${mobile?'390×844 touch':'1600×900 desktop'}: paused start, help, missed recording, two witnesses, neutral label choice, wrong timestamp/correction, trial, change, outcome, separate recovery and next-case reset passed.`);
  await context.close();
 }
 assert.deepEqual(errors,[]);
}catch(e){report.push(`FAILED: ${e.stack}`);process.exitCode=1;}
finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify({report,errors},null,2));console.log(JSON.stringify({report,errors},null,2));await browser.close();}
