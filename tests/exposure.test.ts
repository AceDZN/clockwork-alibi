import {test} from 'node:test';
import assert from 'node:assert/strict';
import {firstDecision,recordExposure,type ExposureLedger} from '../src/exposure.ts';
import {CASES,evidenceFor} from '../src/content.ts';
test('a wrong attempt cannot become first unaided after restart or storage round trip',()=>{
 let saved:ExposureLedger={};assert.equal(firstDecision(saved,1),true);
 saved=recordExposure(saved,1,'attempt');saved=JSON.parse(JSON.stringify(saved));
 assert.equal(firstDecision(saved,1),false);assert.equal(firstDecision(saved,2),true);
});
test('hints and prior completions persist independently across replays',()=>{
 const hinted=recordExposure({},2,'hint');assert.equal(firstDecision(hinted,2),false);
 const completed=recordExposure(hinted,5,'complete');assert.equal(firstDecision(completed,5),false);
 const retried=recordExposure(completed,5,'attempt');assert.equal(retried[5].completed,true);assert.equal(retried[2].hinted,true);
});
test('transfer observer and opening visitor have distinct stable identities',()=>{
 const c=CASES[4];assert.equal(c.observer,'attendant');assert.equal(c.opener,'visitor');
 assert.equal(evidenceFor(c,'visitor')[0].speaker,'The attendant');
 assert.match(evidenceFor(c,'visitor')[0].text,/The visitor opened the side door/);
});
