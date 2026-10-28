import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SCENES,OBJECT_NAMES,type Case } from './content';
import { route,stationObstacles,contains,FLOOR,interactionApproach,stepRoute } from './navigation';
import { worldAt, type Intervention } from './simulation';
export type Target = {id:string;label:string;position:THREE.Vector3;mesh:THREE.Object3D};
const C={teal:0x164c52,tealLight:0x347677,brass:0xb58b4d,ivory:0xf0dfb6,stone:0x263c4c,wood:0x453a32,dark:0x112833};
export class Station {
  scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(37,1,0.1,110); renderer:THREE.WebGLRenderer;
  root=new THREE.Group(); actors=new THREE.Group(); player=new THREE.Group(); porter=new THREE.Group(); visitor=new THREE.Group(); musician=new THREE.Group();
  targets:Target[]=[]; ray=new THREE.Raycaster(); floor=new THREE.Plane(new THREE.Vector3(0,1,0),0); pointer=new THREE.Vector2();
  case!:Case; bird=new THREE.Group(); windowLeaf=new THREE.Group(); doorLeaf=new THREE.Group(); vesselGroups=new Map<string,THREE.Group>();
  marker=new THREE.Group(); trails=new THREE.Group(); clockHand=new THREE.Group(); gears:THREE.Object3D[]=[]; carryLeft=new THREE.Group();carryRight=new THREE.Group();windowBolt?:THREE.Mesh;doorBolt?:THREE.Mesh;readingBook=new THREE.Group(); carriedBoxes=new THREE.Group(); carriedLadder=new THREE.Group(); transferPedestal=new THREE.Group(); wind=new THREE.Group(); hiddenCanopy=new THREE.Group(); curtain=new THREE.Group();
  playerDestination:THREE.Vector3|null=null;private waypoints:THREE.Vector3[]=[]; loadedModels:string[]=[]; modelClips:Record<string,string[]>={}; mixers:{mixer:THREE.AnimationMixer;role:string;walk:THREE.AnimationAction;idle?:THREE.AnimationAction}[]=[]; birdPrefab:THREE.Object3D|null=null; modelDetails:Record<string,{path:string;skins:number;clips:string[]}>={}; elapsed=0; reduced=false;
  materials=new Map<string,THREE.MeshStandardMaterial>();
  scenery=new THREE.Group();
  constructor(canvas:HTMLCanvasElement){
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
    const pmrem=new THREE.PMREMGenerator(this.renderer);const environment=new RoomEnvironment();this.scene.environment=pmrem.fromScene(environment,.04).texture;this.scene.environmentIntensity=.4;environment.dispose();pmrem.dispose();
    this.scene.background=new THREE.Color(0x0d202c);this.scene.fog=new THREE.FogExp2(0x0d202c,0.018);
    this.scene.add(this.root,this.actors,this.trails,this.marker,this.scenery);this.camera.position.set(11.5,11.3,16);this.camera.lookAt(0,1,-.5);
    this.scene.add(new THREE.HemisphereLight(0x99bcb7,0x101b25,1.1));
    const sun=new THREE.DirectionalLight(0xffd99a,3);sun.position.set(8,11,-6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.normalBias=.035;this.scene.add(sun);
    const fill=new THREE.DirectionalLight(0x8dc1dc,.8);fill.position.set(7,9,12);this.scene.add(fill);
    this.buildStation();this.mergeStaticArchitecture();
    this.automaton(this.player,0x354e65); this.player.position.set(-4,0,3);this.actors.add(this.player);
    this.automaton(this.porter,0x267779);this.automaton(this.visitor,0x967b51);this.automaton(this.musician,0x343c50);this.actors.add(this.porter,this.visitor,this.musician);
    const ring=new THREE.Mesh(new THREE.RingGeometry(.34,.39,48),new THREE.MeshBasicMaterial({color:0xe3bc74,transparent:true,opacity:.7,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.025;this.marker.add(ring);this.marker.visible=false;
    this.scene.add(this.bird,this.windowLeaf,this.doorLeaf,this.hiddenCanopy,this.curtain,this.wind);
    for(const g of [this.carryLeft,this.carryRight]){this.box(g,0,-.26,0,.42,.42,.4,0x92744d);for(const x of[-.15,.15])this.box(g,x,-.02,0,.035,.12,.035,C.brass);this.box(g,0,.04,0,.33,.025,.035,C.brass);this.carriedBoxes.add(g);}this.porter.add(this.carriedBoxes,this.carriedLadder);
    this.box(this.readingBook,0,.92,.32,.32,.045,.22,0xc9b68d);this.box(this.readingBook,0,.91,.32,.35,.03,.25,C.teal);this.visitor.add(this.readingBook);
    for(const x of[-.35,.35])this.box(this.carriedLadder,x,1,.4,.07,2,.07,C.brass);for(let y=.2;y<2;y+=.28)this.box(this.carriedLadder,0,y,.4,.7,.05,.06,C.wood);
    this.box(this.transferPedestal,-6.2,.6,-2.7,.85,1.2,.65,C.teal);this.scene.add(this.transferPedestal);
    for(let i=0;i<14;i++){const streak=new THREE.Mesh(new THREE.SphereGeometry(.025,5,4),new THREE.MeshBasicMaterial({color:0xd2e5c3,transparent:true,opacity:.6}));streak.scale.set(1,1,8);this.wind.add(streak);}
  }
  mat(color:number|string,metal=.2,rough=.65){const key=`${color}-${metal}-${rough}`;if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,metalness:metal,roughness:metal>.5?.35:rough}));return this.materials.get(key)!;}
  box(parent:THREE.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:number|string,metal=.2){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.mat(color,metal));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  cyl(parent:THREE.Object3D,x:number,y:number,z:number,r:number,h:number,color:number|string,r2=r){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r2,h,20),this.mat(color,.65));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  sphere(parent:THREE.Object3D,x:number,y:number,z:number,r:number,color:number|string){const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),this.mat(color,.55));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
  text(parent:THREE.Object3D,text:string,x:number,y:number,z:number,w:number,h:number,color='#e5cf9b',bg='#132d39'){
    const cv=document.createElement('canvas');cv.width=768;cv.height=192;const ctx=cv.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,768,192);ctx.strokeStyle=color;ctx.lineWidth=6;ctx.strokeRect(12,12,744,168);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='54px Georgia';ctx.fillText(text,384,101,720);
    const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,roughness:.8}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  pillar(x:number,z:number){const g=new THREE.Group();g.position.set(x,0,z);this.box(g,0,.14,0,.65,.28,.65,C.stone);this.cyl(g,0,1.9,0,.14,3.4,C.teal);this.box(g,0,.42,0,.4,.2,.4,C.brass);this.box(g,0,3.5,0,.5,.2,.5,C.brass);this.box(g,0,3.72,0,.65,.22,.65,C.teal);for(let a=0;a<4;a++){const arm=this.box(g,Math.cos(a*Math.PI/2)*.32,3.3,Math.sin(a*Math.PI/2)*.32,.1,1,.12,C.teal);arm.rotation.z=a%2===0?Math.PI/4:-Math.PI/4;}
    this.root.add(g);return g;
  }
  bench(x:number,z:number,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;this.box(g,0,.55,0,2.6,.18,.7,C.wood);this.box(g,0,1,-.31,2.6,.75,.13,C.teal);for(const k of[-1,1]){this.box(g,k,.27,0,.13,.55,.55,C.brass);this.box(g,k*1.25,.83,0,.08,.45,.7,C.brass);}for(let i=0;i<5;i++)this.box(g,-1+i*.5,1.02,-.23,.03,.6,.03,C.brass);this.root.add(g);}
  gear(x:number,y:number,z:number,r:number){const g=new THREE.Group();g.position.set(x,y,z);const disk=this.cyl(g,0,0,0,r,.12,C.brass);disk.rotation.x=Math.PI/2;const hub=this.cyl(g,0,0,.1,r*.22,.32,C.teal);hub.rotation.x=Math.PI/2;for(let a=0;a<16;a++){const tooth=this.box(g,Math.sin(a*Math.PI/8)*r,Math.cos(a*Math.PI/8)*r,0,r*.15,r*.22,.16,C.brass);tooth.rotation.z=-a*Math.PI/8;}this.root.add(g);this.gears.push(g);return g;}
  lamp(x:number,z:number){this.cyl(this.root,x,3.1,z,.018,1.2,C.brass);this.sphere(this.root,x,2.5,z,.14,0xffd998);const globe=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),new THREE.MeshStandardMaterial({color:0xffdf99,emissive:0xffbd55,emissiveIntensity:2,roughness:.2}));globe.position.set(x,2.5,z);this.root.add(globe);}
  buildStation(){
    this.box(this.root,0,-.5,0,17.8,.9,11.4,C.stone);this.box(this.root,0,-.95,0,18.3,.12,11.9,C.brass);
    for(let x=-8;x<=8;x++)for(let z=-5;z<=4;z++){this.box(this.root,x,.005,z,.98,.06,.98,(x+z)%2===0?0x2b434b:0x243a45);}
    for(const x of[-7.8,-2.5,2.5,7.8]){this.box(this.root,x,.05,0,.045,.02,10.5,C.brass);}
    // Deep back walls, overhead iron beams and short cutaway room dividers.
    this.box(this.root,0,1.75,-5.05,17.5,3.5,.3,C.stone);this.box(this.root,0,.5,-4.8,17,.8,.15,C.teal);
    this.box(this.root,-8.55,1,-.5,.3,2,9,C.stone);
    for(const x of[-2.6,2.6]){this.box(this.root,x,.65,-3.5,.22,1.3,2.8,C.teal);this.pillar(x,-2.1);this.box(this.root,x,3.65,-3.6,.3,.22,2.8,C.teal);}
    for(const x of[-7.8,-2.6,2.6,7.8]){this.pillar(x,-4.7);this.pillar(x,3.8);}
    this.box(this.root,0,3.85,-4.7,16.4,.3,.35,C.teal);this.box(this.root,0,3.85,3.8,16.4,.2,.25,C.teal);
    this.box(this.root,0,3.65,-4.45,16.5,.045,.045,C.brass);
    for(const x of[-6,-.6,4.5])this.lamp(x,-2.2);
    this.bench(-.4,-2.8);this.bench(-6.1,2.6,Math.PI/2);
    this.text(this.root,'MERIDIAN  •  STATION',-4.8,2.7,-4.86,4,.78);
    this.text(this.root,'WAITING ROOM',.1,2.9,-4.86,3.2,.6);
    this.text(this.root,'LUGGAGE  →',5.2,3,-4.86,2.7,.6);
    // Window alcove and shelf; side door moves to a different side in the transfer.
    this.box(this.root,5.2,1.8,-4.79,1.5,2.6,.1,0xd19b58);this.box(this.root,5.2,1.8,-4.65,1.28,2.4,.08,0xedd09a);
    for(const x of[4.45,5.95])this.box(this.root,x,1.8,-4.4,.12,2.8,.2,C.brass);
    this.box(this.root,5.2,3.2,-4.4,1.7,.15,.24,C.teal);this.box(this.root,5.2,.43,-4.4,1.8,.16,.5,C.brass);
    const windowLight=new THREE.PointLight(0xffb452,18,8,2);windowLight.position.set(5.2,2,-3.9);this.root.add(windowLight);
    const beam=new THREE.Mesh(new THREE.PlaneGeometry(1.5,5.8),new THREE.MeshBasicMaterial({color:0xe5b362,transparent:true,opacity:.12,depthWrite:false}));beam.rotation.x=-Math.PI/2;beam.rotation.z=.3;beam.position.set(4.4,.05,-1.2);this.root.add(beam);
    this.windowLeaf.position.set(4.5,1.8,-4.3);this.box(this.windowLeaf,.7,0,0,1.4,2.45,.07,C.teal);this.box(this.windowLeaf,.7,0,.05,1.15,2.2,.035,0xc0aa71);
    for(let i=0;i<3;i++)this.box(this.windowLeaf,.7,-.8+i*.8,.1,1.2,.035,.035,C.brass);this.box(this.windowLeaf,.7,0,.11,.035,2.1,.03,C.brass);this.windowBolt=this.box(this.windowLeaf,.7,0,.18,.65,.08,.1,C.brass);
    this.box(this.root,6.6,1.1,-2.7,1.5,.14,.7,C.wood);this.box(this.root,6,0.5,-2.7,.12,1,.5,C.brass);this.box(this.root,7.2,.5,-2.7,.12,1,.5,C.brass);
    this.doorLeaf.position.set(-7.8,1.2,-4.65);this.box(this.doorLeaf,.7,0,0,1.35,2.4,.13,C.teal);this.text(this.doorLeaf,'SIDE',.7,.3,.08,.9,.4);this.doorBolt=this.box(this.doorLeaf,.7,-.25,.18,.65,.08,.1,C.brass);
    // Clock tower, dial and visible machinery.
    this.box(this.root,8.3,2.8,-2.6,.6,5.5,.7,C.teal);this.box(this.root,8.3,5.6,-2.6,2.4,.2,1.1,C.teal);
    const clockCanvas=document.createElement('canvas');clockCanvas.width=512;clockCanvas.height=512;const ctx=clockCanvas.getContext('2d')!;ctx.fillStyle='#e5d5ae';ctx.beginPath();ctx.arc(256,256,250,0,7);ctx.fill();ctx.strokeStyle='#3a3932';ctx.lineWidth=14;ctx.stroke();ctx.font='38px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';for(let i=1;i<=12;i++){const a=i*Math.PI/6;ctx.fillStyle='#333a3b';ctx.fillText(['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'][i%12],256+Math.sin(a)*195,256-Math.cos(a)*195);}const tex=new THREE.CanvasTexture(clockCanvas);tex.colorSpace=THREE.SRGBColorSpace;
    const dial=new THREE.Mesh(new THREE.CircleGeometry(1.32,64),new THREE.MeshStandardMaterial({map:tex}));dial.position.set(8.3,4.1,-1.9);this.root.add(dial);this.clockHand.position.copy(dial.position);this.clockHand.position.z+=.03;this.box(this.clockHand,0,.48,0,.065,1,.035,0x25333a);this.root.add(this.clockHand);
    this.gear(7.95,1.8,-1.9,.72);this.gear(8.7,.75,-1.9,.55);this.gear(7.5,.55,-1.9,.4);
    // Tracks and a little train behind the station; no collision-critical mesh details.
    for(const z of[-6.4,-7.6])this.box(this.root,0,-.1,z,26,.1,.08,C.brass);for(let x=-13;x<14;x++)this.box(this.root,x,-.2,-7,.22,.1,2.2,C.wood);
    this.box(this.root,-4,.95,-8,12,1.9,2.2,0x173947);this.box(this.root,-4,2,-8,12.3,.35,2.4,0x142c3b);
    for(let i=0;i<10;i++){this.box(this.root,-9+i*1.1,1.15,-6.87,.7,1,.035,0xb59156);this.box(this.root,-9+i*1.1,1.15,-6.84,.6,.85,.03,0x79643d);}
    for(const x of[-8,-1]){const w=this.cyl(this.root,x,0,-7.1,.5,.3,C.dark);w.rotation.x=Math.PI/2;}
    // Crates, planter and an opaque luggage canopy hide the offscreen destination.
    for(let i=0;i<4;i++){const x=-7.1+(i%2)*.75,z=-2+Math.floor(i/2)*.75;this.box(this.root,x,.42,z,.65,.8,.65,0x775b3a);this.box(this.root,x,.42,z+.34,.06,.8,.04,C.brass);}
    this.cyl(this.root,-1.8,.35,2.7,.35,.7,0x846246,.28);for(let i=0;i<9;i++){const leaf=this.sphere(this.root,-1.8+Math.sin(i*2)*.25,.9+Math.cos(i)*.2,2.7+Math.cos(i*2)*.25,.22,0x2b6157);leaf.scale.set(.4,1.8,.7);leaf.rotation.z=i*.7;}
    this.box(this.hiddenCanopy,5.1,1.35,1.7,5.2,.12,4.2,C.teal);this.text(this.hiddenCanopy,'LUGGAGE · PRIVATE',4.7,1.15,3.84,3.2,.3);
    this.box(this.curtain,0,0,0,2.5,2.5,.12,0x6e4b41);this.curtain.position.set(6.8,1.4,-.2);this.curtain.visible=false;
  }
  mergeStaticArchitecture(){
    this.root.updateMatrixWorld(true);const groups=new Map<THREE.Material,{geometries:THREE.BufferGeometry[];meshes:THREE.Mesh[]}>();
    const dynamic=new Set<THREE.Object3D>([this.clockHand,...this.gears]);
    this.root.traverse(o=>{if(!(o instanceof THREE.Mesh)||Array.isArray(o.material))return;let p:THREE.Object3D|null=o;while(p){if(dynamic.has(p))return;p=p.parent;}const row=groups.get(o.material)??{geometries:[],meshes:[]};row.geometries.push(o.geometry.clone().applyMatrix4(o.matrixWorld));row.meshes.push(o);groups.set(o.material,row);});
    for(const [material,row]of groups){if(row.meshes.length<2)continue;const geometry=mergeGeometries(row.geometries,false);if(!geometry)continue;const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;row.meshes.forEach(m=>m.removeFromParent());this.root.add(mesh);}
  }
  automaton(g:THREE.Group,color:number){
    this.cyl(g,0,.83,0,.2,.5,color,.25);this.box(g,0,.92,0,.43,.3,.29,color);this.sphere(g,0,1.28,0,.19,C.ivory);this.cyl(g,0,1.46,0,.23,.08,color);
    this.box(g,0,1.26,.17,.23,.07,.04,C.dark);for(const x of[-.07,.07])this.sphere(g,x,1.28,.2,.025,0xf0ba59);
    for(const side of[-1,1]){const arm=new THREE.Group();arm.position.set(side*.3,1,0);this.cyl(arm,0,-.19,0,.05,.38,C.brass);this.sphere(arm,0,-.41,0,.07,C.brass);g.add(arm);arm.name=side===1?'rightArm':'leftArm';const leg=new THREE.Group();leg.position.set(side*.13,.6,0);this.cyl(leg,0,-.2,0,.065,.4,C.brass);this.box(leg,0,-.43,.06,.18,.12,.28,color);g.add(leg);leg.name=side===1?'rightLeg':'leftLeg';}
  }
  async loadAsset(path:string,parent:THREE.Group,size:number,key:string){
    const gltf=await new GLTFLoader().loadAsync(import.meta.env.BASE_URL+path);
    const fit=new THREE.Group();fit.userData.assetKey=key;fit.add(gltf.scene);fit.updateMatrixWorld(true);
    const raw=new THREE.Box3().setFromObject(fit),extent=raw.getSize(new THREE.Vector3());
    fit.scale.setScalar(size/Math.max(extent.x,extent.y,extent.z));fit.updateMatrixWorld(true);
    const fitted=new THREE.Box3().setFromObject(fit),center=fitted.getCenter(new THREE.Vector3());
    fit.position.set(-center.x,-fitted.min.y,-center.z);
    let skins=0;fit.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}if(o instanceof THREE.SkinnedMesh)skins++;});
    const clips=gltf.animations.map(clip=>{
      const clean=clip.clone();if(/Clockwork Alibi porter/i.test(clean.name))clean.name='carry';
      for(const track of clean.tracks)if(/(?:hips|pelvis|root|armature).*\.position$/i.test(track.name)){
        const v=track.values;for(let i=0;i<v.length;i+=3){v[i]=v[0];v[i+2]=v[2];}
      }
      return clean;
    });
    // A lesson may open the lantern case before the bird download finishes.
    // Cache that prefab without replacing the current case's lantern.
    if(key!=='bird'||this.case.object==='bird'){parent.clear();parent.add(fit);}
    if(key==='porter'){
      parent.add(this.carriedBoxes,this.carriedLadder);
      this.player.clear();const playerModel=cloneSkeleton(fit);this.player.add(playerModel);
      const ring=new THREE.Mesh(new THREE.RingGeometry(.28,.34,32),new THREE.MeshBasicMaterial({color:C.ivory,side:THREE.DoubleSide,transparent:true,opacity:.8}));ring.rotation.x=-Math.PI/2;ring.position.y=.025;this.player.add(ring);
      this.attachClips(playerModel,clips,'player');
    }
    if(key==='bird')this.birdPrefab=fit.clone(true);
    this.attachClips(fit,clips,key);this.loadedModels=[...new Set([...this.loadedModels,key])];
    this.modelClips[key]=clips.map(c=>c.name);this.modelDetails[key]={path,skins,clips:clips.map(c=>c.name)};
    this.renderer.shadowMap.needsUpdate=true;
  }
  attachClips(root:THREE.Object3D,clips:THREE.AnimationClip[],role:string){
    this.mixers=this.mixers.filter(m=>m.role!==role);if(!clips.length)return;
    const mixer=new THREE.AnimationMixer(root),walking=(role==='porter'?clips.find(c=>c.name==='carry'):clips.find(c=>c.name==='walk'))??clips.find(c=>/walk|carry|run/i.test(c.name))??clips[0];
    const walk=mixer.clipAction(walking);walk.play();const idleClip=clips.find(c=>/idle/i.test(c.name));
    const idle=idleClip?mixer.clipAction(idleClip):undefined;if(idle)idle.play();this.mixers.push({mixer,role,walk,idle});
  }
  modelState(){
    const inspect=(root:THREE.Object3D)=>{
      let meshes=0,skins=0;const bones:{name:string;q:number[]}[]=[];const assets:string[]=[];
      root.traverse(o=>{if(o instanceof THREE.Mesh)meshes++;if(o instanceof THREE.SkinnedMesh)skins++;if(o instanceof THREE.Bone&&bones.length<10&&/hip|pelvis|arm|leg|knee|spine|thigh/i.test(o.name))bones.push({name:o.name,q:o.quaternion.toArray().map(v=>+v.toFixed(5))});if(o.userData.assetKey)assets.push(o.userData.assetKey);});
      return {meshes,skins,bones,assets};
    };
    let porterSkin:THREE.SkinnedMesh|undefined,playerSkin:THREE.SkinnedMesh|undefined;
    this.porter.traverse(o=>{if(o instanceof THREE.SkinnedMesh)porterSkin??=o;});this.player.traverse(o=>{if(o instanceof THREE.SkinnedMesh)playerSkin??=o;});
    return {porter:inspect(this.porter),player:inspect(this.player),object:inspect(this.bird),objectKind:this.case.object,
      independentSkeletons:!!porterSkin&&!!playerSkin&&porterSkin.skeleton!==playerSkin.skeleton,
      propsAttached:this.carriedBoxes.parent===this.porter&&this.carriedLadder.parent===this.porter,
      clips:this.mixers.map(m=>({role:m.role,name:m.walk.getClip().name,time:+m.mixer.time.toFixed(4),weight:m.walk.getEffectiveWeight(),idleName:m.idle?.getClip().name??null,idleWeight:m.idle?.getEffectiveWeight()??0}))};
  }
  configure(c:Case){
    this.renderer.shadowMap.needsUpdate=true;this.case=c;this.player.position.set(c.opening==='door'?-1:-4,0,3);this.playerDestination=null;this.bird.clear();this.vesselGroups.forEach(g=>this.scene.remove(g));this.vesselGroups.clear();this.targets=[];
    const b=this.bird;if(c.object==='bird'&&this.birdPrefab){b.add(this.birdPrefab.clone(true));}else if(c.object==='bird'){const body=this.sphere(b,0,.16,0,.17,C.brass);body.scale.set(1,1,1.5);this.sphere(b,0,.35,.13,.11,C.ivory);const beak=this.cyl(b,0,.33,.28,.04,.14,C.brass,0);beak.rotation.x=Math.PI/2;for(const side of[-1,1]){const wing=this.box(b,side*.17,.2,-.02,.26,.05,.3,C.brass);wing.rotation.z=side*.4;}}
    else if(c.object==='vase'){this.cyl(b,0,.15,0,.18,.3,0x96b8bb,.1);this.cyl(b,0,.37,0,.09,.2,0xbfd0ce,.14);}
    else if(c.object==='compass'){const disk=this.cyl(b,0,.08,0,.24,.12,C.brass);this.box(b,0,.15,0,.035,.025,.35,0xb45143);disk.rotation.z=.12;}
    else if(c.object==='parcel'){this.box(b,0,.18,0,.45,.32,.32,0xc4a57c);this.box(b,0,.35,0,.06,.02,.34,C.brass);}
    else if(c.object==='violin'){const body=this.sphere(b,0,.1,0,.17,0x9d6339);body.scale.set(.7,.5,1.3);this.box(b,0,.12,.28,.06,.06,.4,C.wood);this.box(b,0,.16,.08,.025,.015,.56,C.ivory);}
    else if(c.object==='trophy'){this.cyl(b,0,.08,0,.2,.1,C.teal);this.cyl(b,0,.25,0,.045,.3,C.brass);this.cyl(b,0,.47,0,.23,.2,C.brass,.08);}
    else if(c.object==='seed'){const pod=this.sphere(b,0,.15,0,.18,0x9db876);pod.scale.set(.7,1,.7);this.box(b,0,.16,.14,.02,.25,.02,C.brass);}
    else{this.cyl(b,0,.25,0,.16,.45,C.brass);this.sphere(b,0,.25,0,.13,0xffd88b);this.cyl(b,0,.5,0,.2,.06,C.teal);}
    for(const v of c.vessels){const g=new THREE.Group();g.position.set(v.x,0,v.z);this.box(g,0,.3,0,1.1,.5,.75,v.color);for(const x of[-.4,.4])this.box(g,x,.31,.4,.06,.48,.035,C.brass);const lid=new THREE.Group();lid.name='lid';lid.position.set(0,.53,-.36);this.box(lid,0,0,.37,1.1,.08,.75,v.color);g.add(lid);const label=this.text(g,v.label,0,.34,.391,.6,.2,'#eee1bd','#254452');label.name='label';this.scene.add(g);this.vesselGroups.set(v.id,g);this.targets.push({id:`vessel-${v.id}`,label:`${c.id>=4?'עגלה':'מזוודה'} · ${v.label}`,position:g.position.clone(),mesh:g});}
    const target=(id:string,label:string,pos:THREE.Vector3,mesh:THREE.Object3D)=>this.targets.push({id,label,position:pos,mesh});
    target('porter',c.actorName??(c.actor==='painter'?'הציירת':'הסבל'),new THREE.Vector3(-5,0,-1),this.porter);target('visitor',c.observerName??(c.observer==='attendant'?'עובדת התחנה':'העדה בחדר ההמתנה'),new THREE.Vector3(.3,0,-2),this.visitor);
    target('window','תריס החצר',new THREE.Vector3(5.2,0,-3.5),this.windowLeaf);target('door','דלת הצד',new THREE.Vector3(-7,0,-3.5),this.doorLeaf);
    target('object',OBJECT_NAMES[c.object],new THREE.Vector3(c.opening==='door'?-6.2:6.5,0,-2.7),this.bird);target('clock','שעון התחנה',new THREE.Vector3(7.8,0,-1.5),this.clockHand);
    this.visitor.position.set(.3,0,-2);this.musician.position.set(c.opening==='door'?-6.8:5.2,0,-3.4);this.trails.clear();this.hiddenCanopy.position.x=c.opening==='door'?-10:0;this.transferPedestal.visible=c.opening==='door';
    this.configureScenery(c);
    const trailMaterial=new THREE.MeshBasicMaterial({color:0xc4d3bc,transparent:true,opacity:.15,depthWrite:false});for(let i=0;i<6;i++){const ghost=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.8,10),trailMaterial);ghost.position.set(-6.5+i*.7,.65,-.8);this.trails.add(ghost);}
  }
  configureScenery(c:Case){
    this.scenery.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const m=o.material;if(!Array.isArray(m)&&'map' in m&&m.map instanceof THREE.Texture){m.map.dispose();m.dispose();}}});this.scenery.clear();
    const theme=SCENES[c.scene??0],g=this.scenery;
    this.scene.background=new THREE.Color(theme.sky);if(this.scene.fog instanceof THREE.FogExp2)this.scene.fog.color.set(theme.sky);
    if(c.scene){
      this.text(g,theme.en,-4.8,2.7,-4.55,4,.78,'#eee0bc',theme.sky);
      this.text(g,c.englishTitle,.1,2.9,-4.55,3.2,.6,'#eee0bc',theme.sky);
      // Set dressing stays along the walls, outside the navigation lanes.
      if(theme.prop==='garden')for(const x of[-6,-4,0,1.3]){
        this.cyl(g,x,.8,-4,.28,.55,0x8c6545);for(let k=0;k<5;k++){const leaf=this.sphere(g,x+Math.sin(k*2)*.2,1.3+k*.08,-4,.23,0x568766);leaf.scale.set(.6,1.8,.6);}
      }
      if(theme.prop==='gallery')for(const [i,x]of [-6,-4,0,1.4].entries()){
        this.box(g,x,1.9,-4.5,1.2,1.35,.1,C.brass);this.box(g,x,1.9,-4.4,1,1.15,.03,i%2?0x4e667f:0x945e6f);const art=this.sphere(g,x,1.9,-4.32,.32,0xceb78d);art.scale.z=.1;
      }
      if(theme.prop==='harbour')for(const x of[-6,-4,0,1.4]){this.cyl(g,x,.65,-4,.45,1.25,0x715743);for(const y of[.2,1])this.cyl(g,x,y,-4,.47,.08,C.brass);}
      if(theme.prop==='observatory')for(const x of[-5,0]){this.cyl(g,x,.7,-3.7,.05,1.4,C.brass);const tube=this.cyl(g,x,1.5,-3.7,.2,1.6,0x798baf);tube.rotation.z=.8;this.sphere(g,x+.5,2,-3.7,.25,C.brass);}
      if(theme.prop==='archive')for(const x of[-6,-4,0,1.5]){this.box(g,x,1.3,-4.2,1.2,2.6,.5,C.wood);for(let y=.4;y<2.5;y+=.55){this.box(g,x,y,-3.9,1.18,.06,.6,C.brass);for(let k=0;k<5;k++)this.box(g,x-.45+k*.2,y+.2,-3.9,.14,.35,.35,k%2?0x6d8977:0xa18a69);}}
      if(theme.prop==='theatre'){this.box(g,0,.12,-3.9,4,.24,1.1,0x654455);for(const x of[-1.8,1.8])this.box(g,x,1.7,-4.4,.65,3,.2,0x7e3c52);for(const x of[-5,0]){this.cyl(g,x,1,-3.5,.035,2,C.brass);this.box(g,x,1.5,-3.5,.65,.5,.05,C.dark);}}
      if(theme.prop==='workshop')for(const x of[-5,0]){this.box(g,x,.9,-3.8,1.7,.12,.7,C.wood);for(const side of[-.7,.7])this.box(g,x+side,.45,-3.8,.1,.9,.5,C.brass);for(let i=0;i<4;i++)this.cyl(g,x-.5+i*.3,1.05,-3.8,.13,.12,i%2?0x8da99c:C.brass);}
      if(theme.prop==='weather')for(const x of[-5,0]){this.cyl(g,x,1.2,-4,.06,2.4,C.brass);this.box(g,x,2.3,-4,1.6,.08,.08,0xaac4cb);for(const side of[-.7,.7])this.sphere(g,x+side,2.3,-4,.18,0x799da9);this.cyl(g,x,.4,-4,.35,.1,C.teal);}
      if(theme.prop==='vault')for(const x of[-5,0])for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.55+i*.25,.04,8,32),this.mat(C.brass,.7));ring.position.set(x,1.8,-4);ring.rotation.y=i*.4;g.add(ring);}
    }
    for(const [i,e]of (c.accounts?.records??[]).entries()){
      const desk=new THREE.Group();desk.position.set(.8+i,0,2);
      this.box(desk,0,.65,0,.55,.08,.45,C.wood);this.box(desk,0,.3,0,.08,.6,.08,C.brass);this.box(desk,0,.71,0,.4,.025,.3,C.ivory);g.add(desk);
      this.targets.push({id:e.id,label:e.id==='ledger-account'?'פנקס התיבות':'יומן השילוח',position:desk.position.clone(),mesh:desk});
    }
  }
  pick(clientX:number,clientY:number){const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects(this.targets.map(t=>t.mesh),true);if(hits.length){let obj:THREE.Object3D|null=hits[0].object;while(obj){const t=this.targets.find(t=>t.mesh===obj);if(t)return{target:t,point:t.position.clone()};obj=obj.parent;}}const point=new THREE.Vector3();return this.ray.ray.intersectPlane(this.floor,point)?{point,target:null}:null;}
  approach(t:Target){const p=interactionApproach(t.id,t.position,(this.case.opening==='door'));return new THREE.Vector3(p.x,0,p.z);}
  moveTo(p:THREE.Vector3){
    this.waypoints=route(this.player.position,p,stationObstacles((this.case.opening==='door'))).map(v=>new THREE.Vector3(v.x,0,v.z));
    this.playerDestination=this.waypoints.at(-1)?.clone()??null;this.marker.position.copy(this.playerDestination??this.player.position);this.marker.visible=!!this.playerDestination;
  }
  update(dt:number,time:number,interventions:Intervention[],keys:Set<string>,canMove:boolean,render=true){
    this.elapsed+=dt;const c=this.case;if(!c)return;const world=worldAt(c,time,interventions);let movement=new THREE.Vector3();
    if(canMove){
      if(keys.has('KeyW')||keys.has('ArrowUp'))movement.z-=1;if(keys.has('KeyS')||keys.has('ArrowDown'))movement.z+=1;
      if(keys.has('KeyA')||keys.has('ArrowLeft'))movement.x-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))movement.x+=1;
      const obstacles=stationObstacles(c.opening==='door');
      if(movement.lengthSq()){
        this.playerDestination=null;this.waypoints=[];movement.normalize();
        const next=this.player.position.clone().addScaledVector(movement,dt*4);
        if(!obstacles.some(r=>contains(next,r)))this.player.position.copy(next);
      }else if(this.playerDestination){
        const before=this.player.position.clone(),step=stepRoute(this.player.position,this.waypoints,dt*4,obstacles);
        this.player.position.set(step.position.x,0,step.position.z);this.waypoints=step.remaining.map(p=>new THREE.Vector3(p.x,0,p.z));
        movement.subVectors(this.player.position,before);if(movement.lengthSq())movement.normalize();
        if(!this.waypoints.length){this.playerDestination=null;this.marker.visible=false;}
      }
      this.player.position.x=THREE.MathUtils.clamp(this.player.position.x,FLOOR.minX,FLOOR.maxX);this.player.position.z=THREE.MathUtils.clamp(this.player.position.z,FLOOR.minZ,FLOOR.maxZ);
      if(movement.lengthSq())this.player.rotation.y=Math.atan2(movement.x,movement.z);
    }
    const animate=(g:THREE.Group,walk:boolean,phase:number)=>{for(const [name,sgn]of[['rightLeg',1],['leftLeg',-1],['rightArm',-1],['leftArm',1]]as const){const part=g.getObjectByName(name);if(part)part.rotation.x=walk&&!this.reduced?Math.sin(phase)*.4*sgn:0;}};
    if(!this.loadedModels.includes('porter'))animate(this.player,movement.lengthSq()>0,this.elapsed*9);
    const progress=THREE.MathUtils.clamp((time-c.carrying[0])/(c.carrying[1]-c.carrying[0]),0,1);this.porter.position.set(-6.5+progress*4.3,0,-.8);if(!this.loadedModels.includes('porter'))animate(this.porter,world.carrying,time*8);this.porter.rotation.y=Math.PI/2;this.targets.find(t=>t.id==='porter')!.position.copy(this.porter.position);
    this.windowLeaf.rotation.y=world.opened&&c.opening==='window'?-1.2:0;this.doorLeaf.rotation.y=world.opened&&c.opening==='door'?-1.2:0;
    this.hiddenCanopy.visible=true;this.trails.visible=!this.reduced&&this.player.position.x<-1&&time>=c.carrying[0];
    this.trails.children.forEach((ghost,i)=>{const fraction=i/Math.max(1,this.trails.children.length-1);ghost.position.x=-6.5+fraction*4.3;ghost.visible=time>=c.carrying[0]+fraction*(c.carrying[1]-c.carrying[0]);});
    this.bird.visible=world.object==='shelf'||world.object==='secured'||(world.gust&&time<c.gust+.7);this.bird.position.set(c.opening==='door'?-6.2:6.6,1.28,-2.7);this.bird.rotation.y=this.reduced?0:Math.sin(time*2)*.15;
    if(world.gust&&time<c.gust+.7){const u=(time-c.gust)/.7;this.bird.position.x-=u*.8;this.bird.position.z+=u*1.5;this.bird.position.y+=Math.sin(u*Math.PI)*.35;}
    this.carriedBoxes.visible=c.actor==='porter';this.carriedBoxes.position.y=0;this.readingBook.visible=world.reading;this.carriedLadder.visible=c.actor==='painter';
    this.wind.visible=world.gust&&time<c.gust+2&&!this.reduced;this.wind.children.forEach((o,i)=>{const u=(time*1.5+i/14)%1;o.position.set((c.opening==='door'?-7:5.3)+(i%3)*.25,1.2+(i%4)*.2,-3.9+u*4);});
    this.curtain.visible=c.opening==='door'&&time>=c.gust+2;this.curtain.position.x=c.opening==='door'?-5.9:6.8;
    for(const v of c.vessels){const g=this.vesselGroups.get(v.id)!;g.position.x=v.x+(world.departed?(time-c.depart)*.45:0);g.getObjectByName('lid')!.rotation.x=time>=v.openAt&&(!v.closeAt||time<v.closeAt)?-1.35:0;this.targets.find(t=>t.id===`vessel-${v.id}`)!.position.copy(g.position);}
    this.clockHand.rotation.z=-time*Math.PI/30;this.gears.forEach((g,i)=>g.rotation.z=(i%2?-1:1)*time*.12);
    if(this.renderer.domElement.clientWidth<650){const focus=new THREE.Vector3(this.player.position.x*.7,.5,this.player.position.z*.4);this.camera.position.copy(focus).add(new THREE.Vector3(12,16,19));this.camera.lookAt(focus);}
    this.mixers.forEach(({mixer,role,walk,idle})=>{
      const walking=role==='player'?movement.lengthSq()>0:world.carrying;
      walk.setEffectiveWeight(walking||!idle?1:0);if(idle)idle.setEffectiveWeight(walking?0:1);
      mixer.setTime(this.reduced?0:walking?(role==='player'?this.elapsed:Math.max(0,time-c.carrying[0])):idle?time:0);
    });
    this.porter.updateMatrixWorld(true);
    for(const [prop,name,side]of [[this.carryLeft,'mixamorigLeftHand',-1],[this.carryRight,'mixamorigRightHand',1]]as const){
      const hand=this.porter.getObjectByName(name);if(world.carrying&&hand){prop.position.copy(this.porter.worldToLocal(hand.getWorldPosition(new THREE.Vector3())));}else prop.position.set(side*.34,.48,.25);
    }
    if(this.windowBolt)this.windowBolt.visible=world.latched&&c.opening==='window';if(this.doorBolt)this.doorBolt.visible=world.latched&&c.opening==='door';
    if(render)this.renderer.render(this.scene,this.camera);
  }
  resize(w:number,h:number){this.renderer.setSize(w,h,false);this.renderer.shadowMap.needsUpdate=true;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.camera.position.set(11.5,11.3,16);if(w/h<1.15)this.camera.position.multiplyScalar(1.22);this.camera.lookAt(0,1,-.5);}
  screen(p:THREE.Vector3){const v=p.clone().add(new THREE.Vector3(0,1.6,0)).project(this.camera);const r=this.renderer.domElement.getBoundingClientRect();return{x:(v.x+1)/2*r.width,y:(-v.y+1)/2*r.height};}
}
