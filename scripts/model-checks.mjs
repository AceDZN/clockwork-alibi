import assert from 'node:assert/strict';

export function poseOf(s,role='porter'){
  const bones=s.liveModels?.[role]?.bones??[];
  assert.ok(bones.length>=2,`${role} exposes actual rig bones`);
  return JSON.stringify(bones);
}
export function assertMounted(s,{bird=s.chapter<5}={}){
  const live=s.liveModels;assert.ok(live,'live scene model state available');
  for(const role of ['porter','player']){
    assert.ok(live[role].meshes>0,`${role} has scene meshes`);
    assert.ok(live[role].skins>0,`${role} has actual skinned meshes`);
    assert.ok(live[role].assets.includes('porter'),`${role} imported body remains mounted`);
    poseOf(s,role);
    assert.ok(live.clips.some(c=>c.role===role&&c.name),`${role} owns an animation mixer/clip`);
  }
  assert.equal(live.independentSkeletons,true,'player and porter do not share a skeleton');
  assert.equal(live.propsAttached,true,'boxes and ladder remain on actor group');
  assert.equal(live.objectKind,bird?'bird':'lantern');
  assert.ok(live.object.meshes>0,'chapter object has actual meshes');
  assert.equal(live.object.assets.includes('bird'),bird,'bird asset persists only in bird chapters');
}
export async function assertRigDynamics(page){
  const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  const seek=async offset=>{
    await page.locator('#timeline').evaluate(el=>{el.value='11';el.dispatchEvent(new Event('input',{bubbles:true}));});
    return page.evaluate(ms=>{
      const play=document.querySelector('#play');play.click();window.advanceTime(ms);play.click();
      return JSON.parse(window.render_game_to_text());
    },offset);
  };
  const a=await seek(137), b=await seek(431), c=await seek(733), repeat=await seek(137);
  for(const s of [a,b,c,repeat])assertMounted(s);
  assert.ok(new Set([poseOf(a),poseOf(b),poseOf(c)]).size>1,'actual porter bones change through carrying phase');
  assert.equal(poseOf(a),poseOf(repeat),'scrubbing back reproduces the exact porter pose');
  assert.equal(a.targets.find(t=>t.id==='porter').x,repeat.targets.find(t=>t.id==='porter').x,'authored actor path is deterministic');
  for(const s of [a,b,c]){
    const authored=-6.5+(s.world.time-10)/20*4.3;
    assert.ok(Math.abs(s.targets.find(t=>t.id==='porter').x-authored)<.061,'porter target follows authoritative case1 carrying path');
  }
  const frozen=await state();await page.locator('#world').focus();await page.keyboard.down('ArrowRight');
  const moved=[];
  try{for(const ms of [137,211,293])moved.push(await page.evaluate(ms=>{window.advanceTime(ms);return JSON.parse(window.render_game_to_text());},ms));}
  finally{await page.keyboard.up('ArrowRight');}
  for(const s of moved){assert.equal(s.world.time,frozen.world.time,'clock remains paused while player walks');assert.equal(poseOf(s),poseOf(frozen),'player mixer never changes porter pose');}
  assert.ok(moved.at(-1).player.x>frozen.player.x+.3,'normal keyboard movement occurred');
  assert.ok(moved.some(s=>poseOf(s,'player')!==poseOf(frozen,'player')),'player rig animates independently while walking');
  return {samples:[a,b,c,repeat],movingSamples:moved};
}
