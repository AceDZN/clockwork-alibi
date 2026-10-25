import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { type Case } from './content';
import { worldAt, type Intervention } from './simulation';
export type Target = {id:string;label:string;position:THREE.Vector3;mesh:THREE.Object3D};
const C={teal:0x164c52,tealLight:0x347677,brass:0xb58b4d,ivory:0xf0dfb6,stone:0x263c4c,wood:0x453a32,dark:0x112833};
export class Station {
  scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(37,1,0.1,110); renderer:THREE.WebGLRenderer;
  root=new THREE.Group(); actors=new THREE.Group(); player=new THREE.Group(); porter=new THREE.Group(); visitor=new THREE.Group(); musician=new THREE.Group();
  targets:Target[]=[]; ray=new THREE.Raycaster(); floor=new THREE.Plane(new THREE.Vector3(0,1,0),0); pointer=new THREE.Vector2();
  case!:Case; bird=new THREE.Group(); windowLeaf=new THREE.Group(); doorLeaf=new THREE.Group(); vesselGroups=new Map<string,THREE.Group>();
  marker=new THREE.Group(); trails=new THREE.Group(); clockHand=new THREE.Group(); gears:THREE.Object3D[]=[]; readingBook=new THREE.Group(); carriedBoxes=new THREE.Group(); carriedLadder=new THREE.Group(); transferPedestal=new THREE.Group(); wind=new THREE.Group(); hiddenCanopy=new THREE.Group(); curtain=new THREE.Group();
  playerDestination:THREE.Vector3|null=null; loadedModels:string[]=[]; modelClips:Record<string,string[]>={}; mixers:THREE.AnimationMixer[]=[]; elapsed=0; reduced=false;
  materials=new Map<string,THREE.MeshStandardMaterial>();
  constructor(canvas:HTMLCanvasElement){
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
    this.scene.background=new THREE.Color(0x0d202c);this.scene.fog=new THREE.FogExp2(0x0d202c,0.018);
    this.scene.add(this.root,this.actors,this.trails,this.marker);this.camera.position.set(13.8,12.8,18);this.camera.lookAt(0,1,-.5);
    this.scene.add(new THREE.HemisphereLight(0xc9e3df,0x1c2234,2));
    const sun=new THREE.DirectionalLight(0xffd99a,4);sun.position.set(8,11,-6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.normalBias=.035;this.scene.add(sun);
    const fill=new THREE.DirectionalLight(0x8dc1dc,1.6);fill.position.set(7,9,12);this.scene.add(fill);
    this.buildStation();this.mergeStaticArchitecture();
    this.automaton(this.player,0x354e65); this.player.position.set(-4,0,3);this.actors.add(this.player);
    this.automaton(this.porter,0x267779);this.automaton(this.visitor,0x967b51);this.automaton(this.musician,0x343c50);this.actors.add(this.porter,this.visitor,this.musician);
    const ring=new THREE.Mesh(new THREE.RingGeometry(.34,.39,48),new THREE.MeshBasicMaterial({color:0xe3bc74,transparent:true,opacity:.7,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.025;this.marker.add(ring);this.marker.visible=false;
    this.scene.add(this.bird,this.windowLeaf,this.doorLeaf,this.hiddenCanopy,this.curtain,this.wind);
    this.box(this.carriedBoxes,0,.85,.42,.5,.45,.48,0x92744d);this.box(this.carriedBoxes,0,1.2,.42,.44,.25,.4,0x92744d);this.porter.add(this.carriedBoxes,this.carriedLadder);
    this.box(this.readingBook,0,.92,.32,.32,.045,.22,0xc9b68d);this.box(this.readingBook,0,.91,.32,.35,.03,.25,C.teal);this.visitor.add(this.readingBook);
    for(const x of[-.35,.35])this.box(this.carriedLadder,x,1,.4,.07,2,.07,C.brass);for(let y=.2;y<2;y+=.28)this.box(this.carriedLadder,0,y,.4,.7,.05,.06,C.wood);
    this.box(this.transferPedestal,-6.2,.6,-2.7,.85,1.2,.65,C.teal);this.scene.add(this.transferPedestal);
    for(let i=0;i<14;i++){const streak=new THREE.Mesh(new THREE.SphereGeometry(.025,5,4),new THREE.MeshBasicMaterial({color:0xd2e5c3,transparent:true,opacity:.6}));streak.scale.set(1,1,8);this.wind.add(streak);}
  }
  mat(color:number|string,metal=.2,rough=.65){const key=`${color}-${metal}-${rough}`;if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough}));return this.materials.get(key)!;}
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
  lamp(x:number,z:number){this.cyl(this.root,x,3.1,z,.018,1.2,C.brass);this.sphere(this.root,x,2.5,z,.14,0xffd998);const globe=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),new THREE.MeshStandardMaterial({color:0xffdf99,emissive:0xffbd55,emissiveIntensity:2,roughness:.2}));globe.position.set(x,2.5,z);this.root.add(globe);const light=new THREE.PointLight(0xffbd66,8,5,2);light.position.set(x,2.4,z);this.root.add(light);}
  buildStation(){
    this.box(this.root,0,-.5,0,17.8,.9,11.4,C.stone);this.box(this.root,0,-.95,0,18.3,.12,11.9,C.brass);
    for(let x=-8;x<=8;x++)for(let z=-5;z<=4;z++){this.box(this.root,x,.005,z,.98,.06,.98,(x+z)%2===0?0x40545b:0x344851);}
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
    for(let i=0;i<3;i++)this.box(this.windowLeaf,.7,-.8+i*.8,.1,1.2,.035,.035,C.brass);this.box(this.windowLeaf,.7,0,.11,.035,2.1,.03,C.brass);
    this.box(this.root,6.6,1.1,-2.7,1.5,.14,.7,C.wood);this.box(this.root,6,0.5,-2.7,.12,1,.5,C.brass);this.box(this.root,7.2,.5,-2.7,.12,1,.5,C.brass);
    this.doorLeaf.position.set(-7.8,1.2,-4.65);this.box(this.doorLeaf,.7,0,0,1.35,2.4,.13,C.teal);this.text(this.doorLeaf,'SIDE',.7,.3,.08,.9,.4);
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
    const loader=new GLTFLoader();try{const gltf=await loader.loadAsync(import.meta.env.BASE_URL+path);const bounds=new THREE.Box3().setFromObject(gltf.scene),extent=bounds.getSize(new THREE.Vector3());const scale=size/Math.max(extent.x,extent.y,extent.z);gltf.scene.scale.setScalar(scale);const b2=new THREE.Box3().setFromObject(gltf.scene);gltf.scene.position.y-=b2.min.y;parent.clear();parent.add(gltf.scene);gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});this.loadedModels.push(key);this.modelClips[key]=gltf.animations.map(c=>c.name);if(gltf.animations.length){const mixer=new THREE.AnimationMixer(gltf.scene);mixer.clipAction(gltf.animations.find(a=>/walk|carry/i.test(a.name))??gltf.animations[0]).play();this.mixers.push(mixer);}}catch(e){console.warn(`Optional asset unavailable: ${path}`,e);}
  }
  configure(c:Case){
    this.renderer.shadowMap.needsUpdate=true;this.case=c;this.player.position.set(-4,0,3);this.playerDestination=null;this.bird.clear();this.vesselGroups.forEach(g=>this.scene.remove(g));this.vesselGroups.clear();this.targets=[];
    const b=this.bird;if(c.object==='bird'){const body=this.sphere(b,0,.16,0,.17,C.brass);body.scale.set(1,1,1.5);this.sphere(b,0,.35,.13,.11,C.ivory);const beak=this.cyl(b,0,.33,.28,.04,.14,C.brass,0);beak.rotation.x=Math.PI/2;for(const side of[-1,1]){const wing=this.box(b,side*.17,.2,-.02,.26,.05,.3,C.brass);wing.rotation.z=side*.4;}}else{this.cyl(b,0,.25,0,.16,.45,C.brass);this.sphere(b,0,.25,0,.13,0xffd88b);this.cyl(b,0,.5,0,.2,.06,C.teal);}
    for(const v of c.vessels){const g=new THREE.Group();g.position.set(v.x,0,v.z);this.box(g,0,.3,0,1.1,.5,.75,v.color);for(const x of[-.4,.4])this.box(g,x,.31,.4,.06,.48,.035,C.brass);const lid=new THREE.Group();lid.name='lid';lid.position.set(0,.53,-.36);this.box(lid,0,0,.37,1.1,.08,.75,v.color);g.add(lid);const label=this.text(g,v.label,0,.34,.391,.6,.2,'#eee1bd','#254452');label.name='label';this.scene.add(g);this.vesselGroups.set(v.id,g);this.targets.push({id:`vessel-${v.id}`,label:`${c.id>=4?'עגלה':'מזוודה'} · ${v.label}`,position:g.position.clone(),mesh:g});}
    const target=(id:string,label:string,pos:THREE.Vector3,mesh:THREE.Object3D)=>this.targets.push({id,label,position:pos,mesh});
    target('porter',c.actor==='painter'?'הציירת':'הסבל',new THREE.Vector3(-5,0,-1),this.porter);target('visitor',c.observer==='attendant'?'עובדת התחנה':'העדה בחדר ההמתנה',new THREE.Vector3(.3,0,-2),this.visitor);
    target('window','תריס החצר',new THREE.Vector3(5.2,0,-3.5),this.windowLeaf);target('door','דלת הצד',new THREE.Vector3(-7,0,-3.5),this.doorLeaf);
    target('object',c.object==='bird'?'ציפור השעון':'פנס הפסטיבל',new THREE.Vector3(c.transfer?-6.2:6.5,0,-2.7),this.bird);target('clock','שעון התחנה',new THREE.Vector3(7.8,0,-1.5),this.clockHand);
    this.visitor.position.set(.3,0,-2);this.musician.position.set(c.id===5?-6.8:5.2,0,-3.4);this.trails.clear();this.hiddenCanopy.position.x=c.transfer?-10:0;this.transferPedestal.visible=c.transfer;
    const trailMaterial=new THREE.MeshBasicMaterial({color:0xc4d3bc,transparent:true,opacity:.15,depthWrite:false});for(let i=0;i<6;i++){const ghost=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.8,10),trailMaterial);ghost.position.set(-6.5+i*.7,.65,-.8);this.trails.add(ghost);}
  }
  pick(clientX:number,clientY:number){const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects(this.targets.map(t=>t.mesh),true);if(hits.length){let obj:THREE.Object3D|null=hits[0].object;while(obj){const t=this.targets.find(t=>t.mesh===obj);if(t)return{target:t,point:t.position.clone()};obj=obj.parent;}}const point=new THREE.Vector3();return this.ray.ray.intersectPlane(this.floor,point)?{point,target:null}:null;}
  moveTo(p:THREE.Vector3){this.playerDestination=new THREE.Vector3(Math.max(-7.8,Math.min(7.5,p.x)),0,Math.max(-4,Math.min(4,p.z)));this.marker.position.copy(this.playerDestination);this.marker.visible=true;}
  update(dt:number,time:number,interventions:Intervention[],keys:Set<string>,canMove:boolean,render=true){
    this.elapsed+=dt;const c=this.case;if(!c)return;const world=worldAt(c,time,interventions);let movement=new THREE.Vector3();
    if(canMove){if(keys.has('KeyW')||keys.has('ArrowUp'))movement.z-=1;if(keys.has('KeyS')||keys.has('ArrowDown'))movement.z+=1;if(keys.has('KeyA')||keys.has('ArrowLeft'))movement.x-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))movement.x+=1;
      if(movement.lengthSq()){this.playerDestination=null;movement.normalize();}else if(this.playerDestination){movement.subVectors(this.playerDestination,this.player.position);if(movement.length()<.12){this.playerDestination=null;this.marker.visible=false;movement.set(0,0,0);}else movement.normalize();}
      if(movement.lengthSq()){this.player.position.addScaledVector(movement,dt*4);this.player.position.x=THREE.MathUtils.clamp(this.player.position.x,-7.8,7.5);this.player.position.z=THREE.MathUtils.clamp(this.player.position.z,-4,4);this.player.rotation.y=Math.atan2(movement.x,movement.z);}
    }
    const animate=(g:THREE.Group,walk:boolean,phase:number)=>{for(const [name,sgn]of[['rightLeg',1],['leftLeg',-1],['rightArm',-1],['leftArm',1]]as const){const part=g.getObjectByName(name);if(part)part.rotation.x=walk&&!this.reduced?Math.sin(phase)*.4*sgn:0;}};
    animate(this.player,movement.lengthSq()>0,this.elapsed*9);
    const progress=THREE.MathUtils.clamp((time-c.carrying[0])/(c.carrying[1]-c.carrying[0]),0,1);this.porter.position.set(-6.5+progress*4.3,0,-.8);animate(this.porter,world.carrying,time*8);this.porter.rotation.y=Math.PI/2;this.targets.find(t=>t.id==='porter')!.position.copy(this.porter.position);
    this.windowLeaf.rotation.y=world.opened&&c.opening==='window'?-1.2:0;this.doorLeaf.rotation.y=world.opened&&c.opening==='door'?-1.2:0;
    this.hiddenCanopy.visible=true;this.trails.visible=!this.reduced&&this.player.position.x<-1&&time>=c.carrying[0];
    this.trails.children.forEach((ghost,i)=>{const fraction=i/Math.max(1,this.trails.children.length-1);ghost.position.x=-6.5+fraction*4.3;ghost.visible=time>=c.carrying[0]+fraction*(c.carrying[1]-c.carrying[0]);});
    this.bird.visible=world.object==='shelf'||world.object==='secured'||(world.gust&&time<c.gust+.7);this.bird.position.set(c.transfer?-6.2:6.6,1.28,-2.7);this.bird.rotation.y=this.reduced?0:Math.sin(time*2)*.15;
    if(world.gust&&time<c.gust+.7){const u=(time-c.gust)/.7;this.bird.position.x-=u*.8;this.bird.position.z+=u*1.5;this.bird.position.y+=Math.sin(u*Math.PI)*.35;}
    this.carriedBoxes.visible=c.actor==='porter';this.carriedBoxes.position.y=world.carrying?0:-.65;this.readingBook.visible=world.reading;this.carriedLadder.visible=c.actor==='painter';
    this.wind.visible=world.gust&&time<c.gust+2&&!this.reduced;this.wind.children.forEach((o,i)=>{const u=(time*1.5+i/14)%1;o.position.set((c.transfer?-7:5.3)+(i%3)*.25,1.2+(i%4)*.2,-3.9+u*4);});
    this.curtain.visible=c.transfer&&time>=c.gust+2;this.curtain.position.x=c.transfer?-5.9:6.8;
    for(const v of c.vessels){const g=this.vesselGroups.get(v.id)!;g.position.x=v.x+(world.departed?(time-c.depart)*.45:0);g.getObjectByName('lid')!.rotation.x=time>=v.openAt&&(!v.closeAt||time<v.closeAt)?-1.35:0;this.targets.find(t=>t.id===`vessel-${v.id}`)!.position.copy(g.position);}
    this.clockHand.rotation.z=-time*Math.PI/30;this.gears.forEach((g,i)=>g.rotation.z=(i%2?-1:1)*time*.12);
    if(this.renderer.domElement.clientWidth<650){const focus=new THREE.Vector3(this.player.position.x*.7,.5,this.player.position.z*.4);this.camera.position.copy(focus).add(new THREE.Vector3(12,16,19));this.camera.lookAt(focus);}
    this.mixers.forEach(m=>m.setTime(time));if(render)this.renderer.render(this.scene,this.camera);
  }
  resize(w:number,h:number){this.renderer.setSize(w,h,false);this.renderer.shadowMap.needsUpdate=true;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.camera.position.set(13.8,12.8,18);if(w/h<1.15)this.camera.position.multiplyScalar(1.22);this.camera.lookAt(0,1,-.5);}
  screen(p:THREE.Vector3){const v=p.clone().add(new THREE.Vector3(0,1.6,0)).project(this.camera);const r=this.renderer.domElement.getBoundingClientRect();return{x:(v.x+1)/2*r.width,y:(-v.y+1)/2*r.height};}
}
