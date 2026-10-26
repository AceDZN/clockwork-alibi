import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const publicRoot=fileURLToPath(new URL('../public/',import.meta.url));
const manifest=JSON.parse(readFileSync(resolve(publicRoot,'models/asset-status.json'),'utf8'));
function registeredGLB(role:'porter'|'bird'){
  const route=manifest.runtime?.[role];
  assert.equal(typeof route,'string',`${role} runtime asset is registered`);
  const path=resolve(publicRoot,route);
  assert.ok(path.startsWith(publicRoot.endsWith(sep)?publicRoot:publicRoot+sep),'runtime model stays inside public');
  const bytes=readFileSync(path);
  assert.equal(bytes.readUInt32LE(0),0x46546c67,'real glTF binary magic');
  assert.equal(bytes.readUInt32LE(4),2,'glTF binary version2');
  assert.equal(bytes.readUInt32LE(8),bytes.length,'declared file length matches actual bytes');
  assert.equal(bytes.readUInt32LE(16),0x4e4f534a,'first chunk contains JSON');
  const gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString('utf8'));
  assert.ok(gltf.meshes?.some((m:any)=>m.primitives?.some((p:any)=>p.attributes?.POSITION!==undefined)),`${role} contains actual geometry`);
  for(const resource of [...gltf.buffers??[],...gltf.images??[]]){
    const uri=resource.uri;if(!uri||uri.startsWith('data:'))continue;
    assert.ok(!/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(uri),'no remote runtime model/texture dependency');
    assert.ok(existsSync(resolve(dirname(path),decodeURIComponent(uri))),'referenced local resource exists');
  }
  return gltf;
}

test('runtime porter is a bound skeletal asset with multi-joint animation, not the unrigged base',()=>{
  const gltf=registeredGLB('porter');
  const joints=new Set<number>((gltf.skins??[]).flatMap((s:any)=>s.joints??[]));
  assert.ok(joints.size>=8,'a full-body skeleton contains multiple limb joints');
  for(const joint of joints)assert.ok(gltf.nodes[joint],'skin joint references an actual node');
  const bound=(gltf.nodes??[]).filter((n:any)=>n.skin!==undefined&&n.mesh!==undefined);
  assert.ok(bound.length>0,'skin is bound to a rendered mesh');
  assert.ok(bound.some((n:any)=>gltf.meshes[n.mesh].primitives.some((p:any)=>p.attributes.JOINTS_0!==undefined&&p.attributes.WEIGHTS_0!==undefined)),'mesh has joint indices and weights');
  const clips=gltf.animations??[];
  assert.ok(clips.some((a:any)=>a.name==='walk'),'player walking clip survives export');
  assert.ok(clips.some((a:any)=>a.name==='idle'),'stationary clip survives export');
  assert.ok(clips.some((a:any)=>a.name!=='walk'&&a.name!=='idle'),'dedicated authored carrying clip survives export');
  for(const clip of clips)assert.ok(new Set(clip.channels.filter((c:any)=>joints.has(c.target?.node)&&['rotation','translation'].includes(c.target?.path)).map((c:any)=>c.target.node)).size>=4,`${clip.name} animates multiple body joints`);
});

test('runtime clockwork bird is real local geometry with available resources',()=>{
  registeredGLB('bird');
});
