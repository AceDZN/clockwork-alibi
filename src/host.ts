// Workbook games player contract: standalone play remains independent.
export type HostMessage =
  | {type:'ready'}
  | {type:'level-start';level:number}
  | {type:'level-complete';level:number;durationMs:number}
  | {type:'error';message:string};

const PARENT_ORIGIN=/^(https:\/\/([a-z0-9-]+\.)*workbook\.co\.il|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/;

export function parseLevelParam(search:string,count:number):number|null {
  const raw=new URLSearchParams(search).get('level');
  if(raw===null||!/^\d+$/.test(raw))return null;
  const n=Number(raw);return n>=1&&n<=count?n-1:null;
}

export function allowedParentOrigin(origin:string,ownOrigin:string):string|null {
  // Preview builds serve the iframe through their own same-origin rewrite.
  const preview=origin===ownOrigin&&/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
  return PARENT_ORIGIN.test(origin)||preview?origin:null;
}

let slug='',target:string|null=null;
export function initHost(gameSlug:string){
  slug=gameSlug;if(window.parent===window)return;
  let origin=window.location.ancestorOrigins?.[0]??'';
  if(!origin&&document.referrer){try{origin=new URL(document.referrer).origin;}catch{}}
  target=allowedParentOrigin(origin,window.location.origin);
  if(target)window.addEventListener('error',()=>postToHost({type:'error',message:'Clockwork Alibi could not continue. Reload the game to try again.'}));
}
export function postToHost(message:HostMessage){
  if(target)window.parent.postMessage({source:'workbook-game',version:1,slug,...message},target);
}
