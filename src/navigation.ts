export type Point={x:number;z:number};
export type Rect={minX:number;maxX:number;minZ:number;maxZ:number};
export const FLOOR:Rect={minX:-8.2,maxX:8.2,minZ:-4.3,maxZ:4.8};
export const contains=(p:Point,r:Rect)=>p.x>r.minX&&p.x<r.maxX&&p.z>r.minZ&&p.z<r.maxZ;
export function segmentBlocked(a:Point,b:Point,r:Rect){
 let lo=0,hi=1;
 for(const [start,end,min,max]of [[a.x,b.x,r.minX,r.maxX],[a.z,b.z,r.minZ,r.maxZ]]){
  const d=end-start;if(Math.abs(d)<1e-8){if(start<=min||start>=max)return false;continue;}
  const u=(min-start)/d,v=(max-start)/d;lo=Math.max(lo,Math.min(u,v));hi=Math.min(hi,Math.max(u,v));if(lo>=hi)return false;
 }
 return hi>0&&lo<1;
}
export function stationObstacles(transfer:boolean):Rect[]{
 const shift=transfer?-10:0;return[
  {minX:2.28+shift,maxX:7.92+shift,minZ:-.62,maxZ:4.02},
  {minX:-1.95,maxX:1.15,minZ:-3.4,maxZ:-2.22},
  {minX:-6.72,maxX:-5.48,minZ:1.1,maxZ:4.1},
  {minX:5.65,maxX:7.55,minZ:-3.3,maxZ:-2.12},
  {minX:-7.65,maxX:-5.55,minZ:-2.55,maxZ:-.57}
 ];
}
export function route(start:Point,goal:Point,obstacles:Rect[]):Point[]{
 const clamp=(p:Point)=>({x:Math.max(FLOOR.minX,Math.min(FLOOR.maxX,p.x)),z:Math.max(FLOOR.minZ,Math.min(FLOOR.maxZ,p.z))});
 const end=clamp(goal);if(obstacles.some(r=>contains(end,r)))return[];
 const points=[clamp(start),end];
 for(const r of obstacles)for(const x of[r.minX-.04,r.maxX+.04])for(const z of[r.minZ-.04,r.maxZ+.04]){const p={x,z};if(x>=FLOOR.minX&&x<=FLOOR.maxX&&z>=FLOOR.minZ&&z<=FLOOR.maxZ&&!obstacles.some(o=>contains(p,o)))points.push(p);}
 const distance=points.map(()=>Infinity),previous=points.map(()=>-1),used=new Set<number>();distance[0]=0;
 for(let k=0;k<points.length;k++){
  let i=-1;for(let n=0;n<points.length;n++)if(!used.has(n)&&(i<0||distance[n]<distance[i]))i=n;
  if(i<0||!Number.isFinite(distance[i]))break;if(i===1)break;used.add(i);
  for(let j=0;j<points.length;j++){if(used.has(j)||obstacles.some(r=>segmentBlocked(points[i],points[j],r)))continue;const d=distance[i]+Math.hypot(points[i].x-points[j].x,points[i].z-points[j].z);if(d<distance[j]){distance[j]=d;previous[j]=i;}}
 }
 if(previous[1]<0)return[];const result:Point[]=[];for(let i=1;i!==0;i=previous[i])result.unshift(points[i]);return result;
}
export function interactionApproach(id:string,p:Point,transfer:boolean):Point{
 if(id.startsWith('vessel-'))return p.z>2?{x:p.x,z:4.4}:{x:transfer?(p.x<-5?-7.98:-1.98):(p.x>5?8.02:2.18),z:p.z};
 if(id==='object'&&transfer)return{x:p.x,z:-3.05};
 if(id==='porter'&&transfer)return p.x<-5.55?{x:-5.3,z:-.8}:{x:p.x,z:-1.65};
 return{x:p.x,z:p.z+.8};
}
export function stepRoute(start:Point,path:readonly Point[],travel:number,obstacles:Rect[]){
 let position={...start};const remaining=path.map(p=>({...p}));let budget=Math.max(0,travel);
 while(remaining.length&&budget>1e-9){
  const target=remaining[0],distance=Math.hypot(target.x-position.x,target.z-position.z);
  if(distance<1e-9){position={...target};remaining.shift();continue;}
  const amount=Math.min(distance,budget),fraction=amount/distance;
  const next=amount===distance?{...target}:{x:position.x+(target.x-position.x)*fraction,z:position.z+(target.z-position.z)*fraction};
  if(obstacles.some(r=>contains(next,r)||segmentBlocked(position,next,r)))break;
  position=next;budget-=amount;if(amount===distance)remaining.shift();else break;
 }
 return{position,remaining};
}
