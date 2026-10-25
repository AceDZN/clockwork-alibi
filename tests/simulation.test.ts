import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CASES,evidenceFor} from '../src/content.ts';
import {checkReconstruction,inside,interventionWorks,worldAt} from '../src/simulation.ts';
for (const c of CASES) {
 test(`case ${c.id}: physical intervention changes an otherwise lost object`,()=>{
  assert.equal(worldAt(c,59).object,'departed');
  assert.equal(worldAt(c,59,[{kind:`latch-${c.opening}`,time:c.latchFrom}]).object,'shelf');
  assert.equal(worldAt(c,59,[{kind:'secure',time:c.gust-0.01}]).object,'secured');
  assert.equal(worldAt(c,59,[{kind:'secure',time:c.gust}]).object,'departed');
 });
 test(`case ${c.id}: two viewpoints and correct temporal identity required`,()=>{
  const h={eventTime:c.open,activity:c.activity,readingStart:c.reading[0],readingEnd:c.reading[1],vessel:c.target};
  const facts=[...evidenceFor(c,'porter'),...evidenceFor(c,'visitor')].map(e=>e.id);
  assert.equal(checkReconstruction(c,h,facts).ok,true);
  assert.equal(checkReconstruction(c,h,facts.filter(x=>x!=='visitor-account')).ok,false);
  assert.equal(checkReconstruction(c,h,['visitor-account']).ok,false);
  assert.equal(checkReconstruction(c,{...h,vessel:c.vessels.find(v=>v.id!==c.target)!.id},facts).ok,false);
  assert.equal(checkReconstruction(c,{...h,eventTime:c.carrying[1]},facts).ok,false);
  assert.ok(evidenceFor(c,'visitor')[0].text.includes(c.target==='NOA'?'Noa':c.target==='AVI'?'Avi':c.target));
 });
}
test('overlap is not sequence and interval end is excluded',()=>{
 const c=CASES[1]; const facts=['porter-account','visitor-account'];
 assert.equal(checkReconstruction(c,{eventTime:26,activity:c.activity,readingStart:28,readingEnd:34,vessel:c.target},facts).kind,'overlap');
 assert.equal(inside(30,[10,30]),false); assert.equal(inside(20,[10,30]),true);
});
test('changed transfer rejects old shutter/time and accepts changed side door',()=>{
 const c=CASES[4]; assert.equal(interventionWorks(c,{kind:'latch-window',time:19}),false);
 assert.equal(interventionWorks(c,{kind:'latch-door',time:20}),false);
 assert.equal(interventionWorks(c,{kind:'latch-door',time:11}),true);
});
