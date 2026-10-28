import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.REVIEWER_PLAYWRIGHT_MODULE||'playwright');
const root=process.env.REVIEWER_URL||'http://localhost:4202';
const out=path.resolve(process.env.REVIEWER_OUTPUT_DIR||'work/host-check');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.env.REVIEWER_CHANNEL||undefined,timeout:120000,args:process.env.REVIEWER_ANGLE?['--enable-gpu','--use-gl=angle',`--use-angle=${process.env.REVIEWER_ANGLE}`]:[]});
const context=await browser.newContext({viewport:{width:1600,height:900}});context.setDefaultTimeout(120000);
const page=await context.newPage(),errors=[],report=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
await page.route('**/__workbook-host-check?level=*',route=>{
 const level=new URL(route.request().url()).searchParams.get('level');
 return route.fulfill({contentType:'text/html',body:`<!doctype html><html><head><title>Workbook bridge check</title><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;display:block}</style></head><body><script>window.hostMessages=[];addEventListener('message',e=>{if(e.origin===location.origin&&e.source===document.querySelector('iframe')?.contentWindow)hostMessages.push(e.data)})</script><iframe src="/index.html?level=${level}"></iframe></body></html>`});
});
let game;
const state=()=>game.evaluate(()=>JSON.parse(window.render_game_to_text()));
const step=ms=>game.evaluate(ms=>window.advanceTime(ms),ms);
async function click(selector){await game.locator(selector).click();await step(1);}
async function follow(id){assert.equal((await state()).guidance.id,id);await click('#guide-action');for(let i=0;i<16&&!(await state()).panel;i++)await step(500);assert.ok((await state()).panel,`reachable ${id}`);}
try{
 for(const level of [1,4,5,6,16,26,36,50]){
  await page.goto(`${root}/__workbook-host-check?level=${level}`,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>window.hostMessages.some(m=>m.type==='level-start'),{},{timeout:120000});
  game=await (await page.locator('iframe').elementHandle()).contentFrame();
  const messages=await page.evaluate(()=>window.hostMessages),s=await state();
  assert.equal(s.chapter,level);assert.equal(s.mode,'explore');assert.equal(s.paused,true);assert.equal(await game.locator('#intro').isVisible(),false);
  assert.ok(s.loadedModels.includes('porter')&&s.loadedModels.includes('bird'));
  if(level===5){assert.equal(s.liveModels.objectKind,'lantern');assert.equal(s.liveModels.object.assets.includes('bird'),false,'late bird asset cannot replace the deep-linked lantern');assert.ok(s.liveModels.object.meshes>0);}
  assert.deepEqual(messages.map(m=>m.type),['ready','level-start']);assert.equal(messages[1].level,level);
  for(const m of messages){assert.equal(m.source,'workbook-game');assert.equal(m.version,1);assert.equal(m.slug,'clockwork-alibi');}
  if(level===4||level===5)await page.screenshot({path:path.join(out,`embedded-case${level}.png`)});
  report.push(`Embedded ?level=${level}: correct paused case, mounted models, one ready followed by one level-start.`);
 }
 await page.goto(`${root}/__workbook-host-check?level=1`,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.hostMessages.some(m=>m.type==='level-start'));
 game=await (await page.locator('iframe').elementHandle()).contentFrame();
 // The bridge contract does not require the host machine's audio output.
 // Use the game's own option before the rescue, rather than hiding errors.
 await click('#settings');await click('#toggle-mute');await click('.close-panel');
 await follow('first-witness');await game.locator('#source-activity').selectOption('carrying boxes');await click('#record-activity');await click('#done-reading');
 await follow('second-witness');await click('#done-reading');await follow('identity');await click('[data-destination="vessel-NOA"]');for(let i=0;i<16&&(await state()).panel!=='vessel';i++)await step(500);await click('#mark-vessel');
 await follow('moment');await game.locator('#timeline').fill('20');await click('#record-moment');await click('#test-at-clock');await game.waitForFunction(()=>JSON.parse(window.render_game_to_text()).mode!=='testing');assert.equal((await state()).validated,true);
 await follow('change');await click('#physical-action');await click('#guide-action');await follow('recover');await click('#physical-action');assert.equal((await state()).mode,'won');
 await page.waitForFunction(()=>window.hostMessages.some(m=>m.type==='level-complete'));
 const completions=await page.evaluate(()=>window.hostMessages.filter(m=>m.type==='level-complete'));assert.equal(completions.length,1);assert.equal(completions[0].level,1);assert.ok(completions[0].durationMs>0);assert.equal('stars' in completions[0],false);assert.equal('score' in completions[0],false);
 await page.screenshot({path:path.join(out,'embedded-complete.png')});await click('#next-case');await page.waitForFunction(()=>window.hostMessages.some(m=>m.type==='level-start'&&m.level===2));
 report.push('Actual embedded case1 English reconstruction and physical recovery emit exactly one completion with duration, then Next starts case2; no invented score/stars.');
 await fs.writeFile(path.join(out,'messages.json'),JSON.stringify(await page.evaluate(()=>window.hostMessages),null,2));
 await page.goto(root,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.render_game_to_text);assert.equal(await page.locator('#intro').isVisible(),true);assert.equal((await page.evaluate(()=>JSON.parse(window.render_game_to_text()))).mode,'intro');report.push('Standalone URL keeps the guided title opening.');
 assert.deepEqual(errors,[]);
}catch(e){report.push(`FAILED: ${e.stack}`);process.exitCode=1;await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify({report,errors},null,2));console.log(JSON.stringify({report,errors},null,2));await browser.close();}
