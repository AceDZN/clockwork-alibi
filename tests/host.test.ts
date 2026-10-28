import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allowedParentOrigin,parseLevelParam} from '../src/host.ts';

test('each published level deep link selects the corresponding case without unlocking others',()=>{
  for(let n=1;n<=50;n++)assert.equal(parseLevelParam(`?level=${n}`,50),n-1);
});
test('absent and malformed deep links preserve the normal opening',()=>{
  for(const search of ['', '?level=', '?level=0', '?level=51', '?level=-1', '?level=1.5', '?level=3abc', '?level=Infinity', '?level=%203'])assert.equal(parseLevelParam(search,50),null,search);
});
test('bridge accepts Workbook and local hosts with an explicit origin',()=>{
  for(const origin of ['https://english-games.workbook.co.il','https://www.workbook.co.il','https://workbook.co.il','http://localhost:4202','http://127.0.0.1:4017'])assert.equal(allowedParentOrigin(origin,'http://localhost:4202'),origin);
});
test('bridge permits the same Vercel preview while rejecting unrelated parents',()=>{
  const preview='https://acedzn-workbook-english-games-example-acedzns-projects.vercel.app';
  assert.equal(allowedParentOrigin(preview,preview),preview);
  for(const origin of ['https://unrelated.vercel.app','https://workbook.co.il.evil.example','https://evilworkbook.co.il','http://english-games.workbook.co.il','https://english-games.workbook.co.il/path','null','*'])assert.equal(allowedParentOrigin(origin,preview),null,origin);
});
