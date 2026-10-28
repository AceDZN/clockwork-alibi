export type CampaignProgress={current:number;completed:number[]};
export function readProgress(raw:string|null,count:number):CampaignProgress{
 try{
  const value=JSON.parse(raw??'null');
  if(!value||typeof value!=='object')return {current:1,completed:[]};
  const completed=Array.isArray(value.completed)?[...new Set<number>(value.completed.filter((n:unknown)=>typeof n==='number'&&Number.isInteger(n)&&n>=1&&n<=count))].sort((a,b)=>a-b):[];
  return {current:Number.isInteger(value.current)&&value.current>=1&&value.current<=count?value.current:1,completed};
 }catch{return {current:1,completed:[]};}
}
export function completeLevel(progress:CampaignProgress,level:number,count:number):CampaignProgress{
 return readProgress(JSON.stringify({current:Math.min(count,level+1),completed:[...progress.completed,level]}),count);
}
