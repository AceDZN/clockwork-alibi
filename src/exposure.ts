export type Exposure = {attempted:boolean;hinted:boolean;completed:boolean};
export type ExposureLedger = Record<number,Exposure>;
export function firstDecision(ledger:ExposureLedger,chapter:number):boolean {
  const e=ledger[chapter];return !e||(!e.attempted&&!e.hinted&&!e.completed);
}
export function recordExposure(ledger:ExposureLedger,chapter:number,action:'attempt'|'hint'|'complete'):ExposureLedger {
  const old=ledger[chapter]??{attempted:false,hinted:false,completed:false};
  return {...ledger,[chapter]:{attempted:old.attempted||action==='attempt',hinted:old.hinted||action==='hint',completed:old.completed||action==='complete'}};
}
