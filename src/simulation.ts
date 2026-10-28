import { type Case, type Interval } from './content';
export const inside = (t:number, span:Interval) => t>=span[0] && t<span[1];
export type Hypothesis = {eventTime:number;activity:string;readingStart:number;readingEnd:number;vessel:string;deductions?:Record<string,string>};
export type Intervention = {kind:'latch-window'|'latch-door'|'secure';time:number};
export type Check = {ok:boolean;kind:'missing'|'activity'|'time'|'overlap'|'identity'|'deduction'|'success';message:string;fact?:string;deduction?:string};
export function checkReconstruction(c:Case,h:Hypothesis,facts:readonly string[]):Check {
  if(!facts.some(f=>f.startsWith('porter-'))||!facts.includes('visitor-account')) return {ok:false,kind:'missing',message:'חסרה נקודת מבט עצמאית: חפשו גם את העד/ה בחדר האחר.'};
  if(c.id===4 && !facts.includes('porter-window')) return {ok:false,kind:'missing',message:'העדות עדיין אינה קובעת מי פתח ומתי. איזו שאלה תחשוף את הפרט החסר?'};
  const missing=c.accounts&&[...c.accounts.porter,...c.accounts.visitor,...c.accounts.records].find(e=>!facts.includes(e.id));
  if(missing)return {ok:false,kind:'missing',message:'חסר מקור בחקירה. קראו גם את התשובות והרישומים הנוספים לפני הבדיקה.',fact:missing.id};
  if(h.activity!==c.activity) return {ok:false,kind:'activity',message:'הפעילות שסומנה אינה הפעילות בעדות. חזרו למילים שמתארות מה היה בעיצומו.',fact:'porter-account'};
  if(h.eventTime!==c.open || !inside(h.eventTime,c.carrying)) return {ok:false,kind:'time',message:'האירוע שסומן אינו מתאים לזמן בעדויות. הפעילות המתמשכת היא טווח, והפתיחה היא רגע אחד.',fact:c.id===4?'porter-window':'visitor-account'};
  if((c.id===2||c.requiresReading) && (!(h.readingStart<h.readingEnd)||h.readingStart!==c.reading[0] || h.readingEnd!==c.reading[1])) return {ok:false,kind:'overlap',message:'טווח הקריאה שסומן אינו תואם לעדות. בדקו את ההתחלה והסיום בנפרד; זמן חופף אינו סדר של אחת ואז השנייה.',fact:'visitor-account'};
  if(h.vessel!==c.target) return {ok:false,kind:'identity',message:c.accounts?.records.length?'התווית אינה תואמת לתיבה שהייתה פתוחה בזמן הרוח. השוו את הפנקס לעדות; צבע או מיקום לבדם אינם מספיקים.':'החפץ ממשיך עם כלי אחר. בדקו את השם בעדות; צבע או מיקום לבדם אינם מספיקים.',fact:c.accounts?.records.length?'ledger-account':'visitor-account'};
  for(const q of c.deductions??[])if(h.deductions?.[q.id]!==q.answer)return {ok:false,kind:'deduction',message:'אחת המסקנות עדיין אינה נתמכת בטקסט. חזרו למקור ובדקו מה נאמר ומה רק הוסק.',fact:q.fact,deduction:q.id};
  return {ok:true,kind:'success',message:'שתי נקודות המבט מתחברות. עכשיו אפשר לבדוק שינוי פיזי בלולאה.'};
}
export function interventionWorks(c:Case,i:Intervention):boolean {
  if(i.kind==='secure') return i.time>=(c.secureFrom??0) && i.time<c.gust;
  return i.kind===`latch-${c.opening}` && i.time>=c.latchFrom && i.time<c.open;
}
export function worldAt(c:Case,time:number,interventions:readonly Intervention[]=[]) {
  const saved = interventions.some(i=>i.time<=time && interventionWorks(c,i));
  const secured = interventions.some(i=>i.time<=time && i.kind==='secure' && interventionWorks(c,i));
  const latched = interventions.some(i=>i.time<=time && i.kind===`latch-${c.opening}` && interventionWorks(c,i));
  return { time, carrying:inside(time,c.carrying),reading:inside(time,c.reading),opened:time>=c.open&&!latched,
    gust:time>=c.gust&&!saved,object:secured?'secured':time<c.gust||saved?'shelf':time<c.depart?'hidden-in-vessel':'departed',
    vessel:time>=c.gust&&!saved?c.target:null,departed:time>=c.depart,latched,saved };
}
export function newHypothesis(c:Case):Hypothesis { return {eventTime:30,activity:'reading',readingStart:30,readingEnd:48,vessel:''}; }
