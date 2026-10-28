import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CASES,SCENES,evidenceFor} from '../src/content.ts';
import {checkReconstruction,interventionWorks,worldAt} from '../src/simulation.ts';
import {readProgress,completeLevel} from '../src/progress.ts';

test('fifty distinct stories form ten ordered chapters with no grade configuration',()=>{
 assert.equal(CASES.length,50);assert.equal(SCENES.length,10);
 assert.equal(new Set(CASES.map(c=>c.englishTitle)).size,50);
 assert.deepEqual(CASES.map(c=>c.id),Array.from({length:50},(_,i)=>i+1));
 assert.ok(CASES.every(c=>!('grade' in c)));
 for(let chapter=1;chapter<10;chapter++){
  const levels=CASES.slice(chapter*5,chapter*5+5);
  assert.equal(new Set(levels.map(c=>c.scene)).size,1);
  assert.ok(levels.every(c=>c.tier===chapter+1));
 }
 assert.equal(CASES[5].deductions?.length,1);assert.equal(CASES[15].deductions?.length,2);
 assert.equal(CASES[30].deductions?.length,3);assert.equal(CASES[49].deductions?.length,4);
 assert.equal(CASES[49].vessels.length,4);assert.equal(CASES[49].accounts?.records.length,2);
});
// Independent spot oracle, deliberately not computed from level fields.
const expected=[
 {id:6,open:23,gust:25,vessel:'FERN',activity:'carrying boxes',reading:[16,30]},
 {id:16,open:29,gust:31,vessel:'SAIL',activity:'carrying boxes',reading:[22,36]},
 {id:26,open:35,gust:37,vessel:'INDEX',activity:'carrying boxes',reading:[28,42]},
 {id:36,open:20,gust:22,vessel:'GEAR',activity:'carrying boxes',reading:[13,27]},
 {id:50,open:33,gust:35,vessel:'NOON',activity:'carrying boxes',reading:[26,40]}
];
for(const e of expected)test('independent campaign solution and constraints: level '+e.id,()=>{
 const c=CASES[e.id-1],facts=[...evidenceFor(c,'porter'),...evidenceFor(c,'visitor'),...(c.accounts?.records??[])].map(e=>e.id);
 const h={eventTime:e.open,activity:e.activity,readingStart:e.reading[0],readingEnd:e.reading[1],vessel:e.vessel,deductions:Object.fromEntries((c.deductions??[]).map(q=>[q.id,'option-0']))};
 assert.equal(c.open,e.open);assert.equal(c.gust,e.gust);
 assert.equal(checkReconstruction(c,h,facts).ok,true);
 assert.equal(checkReconstruction(c,{...h,deductions:{...h.deductions,story:'option-1'}},facts).kind,'deduction');
 assert.equal(checkReconstruction(c,{...h,deductions:{}},facts).ok,false);
 assert.equal(checkReconstruction(c,{...h,eventTime:e.open+1},facts).kind,'time');
 assert.equal(worldAt(c,e.gust).vessel,e.vessel);
 if(c.accounts?.records.length)assert.equal(checkReconstruction(c,h,facts.filter(f=>f!=='ledger-account')).kind,'missing');
 if(c.secureFrom){assert.equal(interventionWorks(c,{kind:'secure',time:c.secureFrom-1}),false);assert.equal(interventionWorks(c,{kind:'secure',time:c.secureFrom}),true);}
});
test('container register unambiguously identifies exactly one open case at each later gust',()=>{
 for(const c of CASES.slice(15)){
  assert.deepEqual(c.vessels.filter(v=>v.openAt<=c.gust&&(v.closeAt===undefined||v.closeAt>c.gust)).map(v=>v.id),[c.target]);
  for(const q of c.deductions??[]){
   assert.equal(q.choices.filter(a=>a.id===q.answer).length,1);
   assert.equal(new Set(q.choices.map(a=>a.text)).size,q.choices.length);
  }
 }
});
test('completion is deduplicated, survives reload, and resumes at the next level',()=>{
 let p=readProgress(null,50);p=completeLevel(p,5,50);p=completeLevel(p,5,50);
 assert.deepEqual(p,{current:6,completed:[5]});
 assert.deepEqual(readProgress(JSON.stringify(p),50),p);
 assert.deepEqual(completeLevel(p,50,50),{current:50,completed:[5,50]});
 assert.deepEqual(readProgress('{"current":999,"completed":[0,1,1,50,51,"2"]}',50),{current:1,completed:[1,50]});
 assert.deepEqual(readProgress('broken',50),{current:1,completed:[]});
});
