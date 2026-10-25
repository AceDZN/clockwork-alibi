import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CASES, evidenceFor } from '../src/content.ts';
import { checkReconstruction, interventionWorks, worldAt, type Hypothesis } from '../src/simulation.ts';

// Independent authored oracle: do not construct the expected answers from CASES.
const expected: { id: number; open: number; gust: number; depart: number; actor: string; vessel: string; latch: number; kind: 'latch-window'|'latch-door'; reading: [number, number] }[] = [
  {id:1,open:20,gust:22,depart:40,actor:'carrying boxes',vessel:'NOA',latch:17,kind:'latch-window',reading:[15,35]},
  {id:2,open:26,gust:28,depart:46,actor:'carrying boxes',vessel:'AVI',latch:22,kind:'latch-window',reading:[14,34]},
  {id:3,open:25,gust:27,depart:42,actor:'carrying boxes',vessel:'NOA',latch:21,kind:'latch-window',reading:[15,36]},
  {id:4,open:31,gust:33,depart:48,actor:'carrying boxes',vessel:'STAGE',latch:27,kind:'latch-window',reading:[16,38]},
  {id:5,open:13,gust:16,depart:34,actor:'moving the ladder',vessel:'CANVAS',latch:11,kind:'latch-door',reading:[8,24]},
];
const hypothesis = (e: typeof expected[number]): Hypothesis => ({eventTime:e.open,activity:e.actor,readingStart:e.reading[0],readingEnd:e.reading[1],vessel:e.vessel});
const collectedFacts = (id:number) => [...evidenceFor(CASES[id-1], 'porter'), ...evidenceFor(CASES[id-1], 'visitor')].map(e=>e.id);

for (const e of expected) {
  test(`independent case ${e.id}: authored evidence and replay produce the expected outcome`, () => {
    const c=CASES[e.id-1];
    assert.equal(checkReconstruction(c,hypothesis(e),collectedFacts(e.id)).ok,true);
    assert.equal(worldAt(c,e.gust-0.001).object,'shelf');
    assert.equal(worldAt(c,e.gust).object,'hidden-in-vessel');
    assert.equal(worldAt(c,e.gust).vessel,e.vessel);
    assert.equal(worldAt(c,e.depart-0.001).object,'hidden-in-vessel');
    assert.equal(worldAt(c,e.depart).object,'departed');
    assert.equal(worldAt(c,59,[{kind:e.kind,time:e.latch}]).object,'shelf');
    assert.equal(worldAt(c,59,[{kind:'secure',time:e.gust-0.001}]).object,'secured');
  });
  test(`independent case ${e.id}: a guessed physical save does not supply missing comprehension`, () => {
    const c=CASES[e.id-1], h=hypothesis(e);
    assert.equal(worldAt(c,59,[{kind:'secure',time:1}]).saved,true);
    assert.equal(checkReconstruction(c,h,[]).kind,'missing');
    assert.equal(checkReconstruction(c,h,['visitor-account']).kind,'missing');
    assert.equal(checkReconstruction(c,h,collectedFacts(e.id).filter(f=>f!=='visitor-account')).kind,'missing');
  });
  test(`independent case ${e.id}: an intervention has no retroactive effect`, () => {
    const c=CASES[e.id-1];
    assert.equal(worldAt(c,e.latch-0.001,[{kind:e.kind,time:e.latch}]).saved,false);
    assert.equal(worldAt(c,e.latch,[{kind:e.kind,time:e.latch}]).saved,true);
    assert.equal(worldAt(c,59,[{kind:'secure',time:e.gust}]).object,'departed');
  });
}

test('first case distinguishes ongoing carrying from the visitor’s completed/ongoing account',()=>{
  const c=CASES[0], facts=collectedFacts(1), h=hypothesis(expected[0]);
  assert.equal(checkReconstruction(c,{...h,activity:'reading'},facts).kind,'activity');
  assert.equal(checkReconstruction(c,{...h,eventTime:30},facts).kind,'time');
  assert.equal(worldAt(c,19.999).opened,false);
  assert.equal(worldAt(c,20).opened,true);
  assert.equal(worldAt(c,20).carrying,true);
  assert.equal(worldAt(c,29.999).carrying,true);
  assert.equal(worldAt(c,30).carrying,false);
  assert.match(evidenceFor(c,'visitor')[0].text,/reading, not carrying boxes/);
});

test('while requires two activities at the bell; sequence and arbitrary overlap are insufficient',()=>{
  const c=CASES[1], facts=collectedFacts(2), h=hypothesis(expected[1]);
  assert.equal(worldAt(c,24).carrying,true);
  assert.equal(worldAt(c,24).reading,true);
  assert.equal(checkReconstruction(c,{...h,readingStart:28,readingEnd:34},facts).kind,'overlap');
  assert.equal(checkReconstruction(c,{...h,readingStart:14,readingEnd:24},facts).kind,'overlap');
  assert.equal(checkReconstruction(c,{...h,readingStart:14,readingEnd:33},facts).kind,'overlap');
});

test('same-colour suitcases still need owner identity and before/after order',()=>{
  const c=CASES[2], h=hypothesis(expected[2]), facts=collectedFacts(3);
  assert.equal(c.vessels[0].color,c.vessels[1].color);
  assert.equal(checkReconstruction(c,{...h,vessel:'AVI'},facts).kind,'identity');
  assert.equal(checkReconstruction(c,{...h,eventTime:18},facts).kind,'time');
  assert.match(evidenceFor(c,'porter')[0].text,/Avi closed.*before Noa opened/);
  assert.match(evidenceFor(c,'visitor')[0].text,/fell after Noa opened/);
  assert.ok((c.vessels.find(v=>v.id==='AVI')!.closeAt!) < c.vessels.find(v=>v.id==='NOA')!.openAt);
  assert.ok(c.vessels.find(v=>v.id==='NOA')!.openAt < 27);
});

test('questions reveal different facts, with did + find and meaningful irregular found',()=>{
  const c=CASES[3], answers=evidenceFor(c,'porter'), h=hypothesis(expected[3]);
  assert.equal(new Set(answers.map(a=>a.question)).size,3);
  assert.match(answers.find(a=>a.id==='porter-carry')!.question!,/^What were you carrying/);
  assert.match(answers.find(a=>a.id==='porter-key')!.question!,/^What did you find /);
  assert.doesNotMatch(answers.map(a=>a.question).join(' '),/did you found/);
  assert.match(answers.find(a=>a.id==='porter-key')!.text,/I found a brass key at 00:24.*beside the clock/);
  assert.match(answers.find(a=>a.id==='porter-window')!.text,/musician.*00:31/);
  assert.equal(checkReconstruction(c,h,['porter-carry','visitor-account']).kind,'missing');
  assert.equal(checkReconstruction(c,h,['porter-window','visitor-account']).ok,true);
});

test('transfer changes nouns, timing, route and identity; the memorized first solution fails',()=>{
  const c=CASES[4], facts=collectedFacts(5);
  assert.equal(c.transfer,true);
  assert.equal(c.hint,'');
  assert.match(evidenceFor(c,'porter')[0].text,/moving the ladder.*side door/);
  assert.match(evidenceFor(c,'visitor')[0].text,/side door at 00:13.*lantern.*CANVAS.*before.*00:18/);
  assert.equal(checkReconstruction(c,hypothesis(expected[0]),facts).ok,false);
  assert.equal(checkReconstruction(c,{...hypothesis(expected[4]),vessel:'STAGE'},facts).kind,'identity');
  assert.equal(interventionWorks(c,{kind:'latch-window',time:17}),false);
  assert.equal(interventionWorks(c,{kind:'latch-door',time:20}),false);
  assert.equal(interventionWorks(c,{kind:'secure',time:20}),false);
  assert.equal(interventionWorks(c,{kind:'latch-door',time:11}),true);
});
