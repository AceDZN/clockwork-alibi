import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CASES} from '../src/content.ts';
import {emptyRecords,nextStep} from '../src/guidance.ts';

const ready=()=>({facts:['porter-account','visitor-account'],recorded:{activity:true,moment:true,vessel:true,readingStart:true,readingEnd:true},validated:false,mode:'explore',saved:false,afterGust:false});
test('opening asks for one reachable witness, then a deliberate activity choice',()=>{
  const s={...ready(),facts:[] as string[],recorded:emptyRecords()};
  assert.equal(nextStep(CASES[0],s).target,'porter');
  s.facts.push('porter-account');assert.equal(nextStep(CASES[0],s).id,'activity');
  s.recorded.activity=true;assert.equal(nextStep(CASES[0],s).target,'visitor');
});
test('reading a witness does not silently count as saving every clue',()=>{
  const s={...ready(),recorded:{...emptyRecords(),activity:true}};
  assert.equal(nextStep(CASES[0],s).id,'identity');s.recorded.vessel=true;
  assert.equal(nextStep(CASES[0],s).id,'moment');s.recorded.moment=true;
  assert.equal(nextStep(CASES[0],s).id,'test');
});
test('guide offers a trial without revealing whether saved choices are correct',()=>{
  for(const c of CASES){const s=ready();if(c.id===4)s.facts.push('porter-window');const step=nextStep(c,s);assert.equal(step.id,'test');assert.equal(step.target,'clock');assert.equal(JSON.stringify(step).includes(c.target),false);assert.doesNotMatch(step.detail,/00:\d/);}
});
test('the overlapping-activity case requires both deliberately marked bounds',()=>{
  const s=ready();s.recorded.readingStart=false;s.recorded.readingEnd=false;
  assert.equal(nextStep(CASES[1],s).id,'reading');s.recorded.readingStart=true;
  assert.equal(nextStep(CASES[1],s).id,'reading');s.recorded.readingEnd=true;
  assert.equal(nextStep(CASES[1],s).id,'test');
});
test('question case points back for the missing opening account',()=>{
  const s=ready();assert.equal(nextStep(CASES[3],s).id,'question');
  s.facts.push('porter-window');assert.equal(nextStep(CASES[3],s).id,'test');
});
test('physical rescue requires change, observable outcome and a separate collection',()=>{
  const s={...ready(),validated:true,mode:'replay'};
  assert.equal(nextStep(CASES[0],s).id,'change');s.saved=true;
  assert.equal(nextStep(CASES[0],s).id,'outcome');s.afterGust=true;
  assert.equal(nextStep(CASES[0],s).id,'recover');
});
test('transfer guidance supplies procedure without choosing an intervention or solution',()=>{
  const step=nextStep(CASES[4],{...ready(),validated:true,mode:'replay'});
  assert.equal(step.action,'changes');assert.equal(step.target,undefined);
  assert.doesNotMatch(JSON.stringify(step),/CANVAS|00:|לקבע|לנעול/);
});
test('fresh case records do not reuse the completed tutorial choices',()=>{
  const first=emptyRecords();first.moment=true;assert.equal(emptyRecords().moment,false);
});
