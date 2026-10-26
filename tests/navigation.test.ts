import {test}from'node:test';import assert from'node:assert/strict';import{route,segmentBlocked,stationObstacles,contains}from'../src/navigation.ts';
for(const transfer of[false,true])test(`private luggage bay ${transfer?'west':'east'} cannot be crossed`,()=>{
 const obstacles=stationObstacles(transfer),start=transfer?{x:-1,z:3}:{x:-4,z:3},goal=transfer?{x:-7.98,z:.6}:{x:8,z:-1};
 const path=route(start,goal,obstacles);assert.ok(path.length>0);let p=start;for(const q of path){assert.equal(obstacles.some(r=>segmentBlocked(p,q,r)),false);assert.equal(obstacles.some(r=>contains(q,r)),false);p=q;}assert.deepEqual(path.at(-1),goal);
});
test('a floor click inside the private bay does not walk the player under its roof',()=>{assert.deepEqual(route({x:-4,z:3},{x:4,z:1},stationObstacles(false)),[]);});
test('straight unobstructed aisle remains direct and bounded',()=>{assert.deepEqual(route({x:-4,z:0},{x:1,z:0},stationObstacles(false)),[{x:1,z:0}]);});
import{interactionApproach}from'../src/navigation.ts';import{CASES}from'../src/content.ts';
for(const c of CASES)test(`case${c.id}: every intervention/witness/label has a reachable external approach`,()=>{
 const start={x:c.transfer?-1:-4,z:3},obstacles=stationObstacles(c.transfer);
 const targets=[{id:'object',x:c.transfer?-6.2:6.5,z:-2.7},{id:'door',x:-7,z:-3.5},{id:'window',x:5.2,z:-3.5},{id:'clock',x:7.8,z:-1.5},{id:'visitor',x:.3,z:-2},...[-6.5,-4.3,-2.2].map(x=>({id:'porter',x,z:-.8})),...c.vessels.map(v=>({id:'vessel-'+v.id,x:v.x,z:v.z}))];
 for(const t of targets){const goal=interactionApproach(t.id,t,c.transfer);assert.equal(obstacles.some(r=>contains(goal,r)),false,t.id+' goal blocked');assert.ok(route(start,goal,obstacles).length>0,t.id+' unreachable');}
});
import{stepRoute}from'../src/navigation.ts';
for(const transfer of[false,true])test(`stepped ${transfer?'west':'east'} corner route reaches every waypoint without cutting turns`,()=>{
 const obstacles=stationObstacles(transfer),start=transfer?{x:-1,z:3}:{x:7.8,z:-.7},goal=transfer?{x:-6.2,z:-3.05}:{x:5.7,z:4.4};
 let position=start,path=route(start,goal,obstacles);assert.ok(path.length>1);
 for(let i=0;i<1200&&path.length;i++){const result=stepRoute(position,path,4/60,obstacles);assert.equal(obstacles.some(r=>contains(result.position,r)||segmentBlocked(position,result.position,r)),false);position=result.position;path=result.remaining;}
 assert.equal(path.length,0);assert.deepEqual(position,goal);
});
