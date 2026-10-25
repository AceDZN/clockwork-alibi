import { type Case, type Interval } from './content';
export const inside = (t:number, span:Interval) => t>=span[0] && t<span[1];
export type Hypothesis = {eventTime:number;activity:string;readingStart:number;readingEnd:number;vessel:string};
export type Intervention = {kind:'latch-window'|'latch-door'|'secure';time:number};
export type Check = {ok:boolean;kind:'missing'|'activity'|'time'|'overlap'|'identity'|'success';message:string;fact?:string};
export function checkReconstruction(c:Case,h:Hypothesis,facts:readonly string[]):Check {
  if(!facts.some(f=>f.startsWith('porter-'))||!facts.includes('visitor-account')) return {ok:false,kind:'missing',message:'חסרה נקודת מבט עצמאית: חפשו גם את העד/ה בחדר האחר.'};
  if(c.id===4 && !facts.includes('porter-window')) return {ok:false,kind:'missing',message:'העדות עדיין אינה קובעת מי פתח ומתי. איזו שאלה תחשוף את הפרט החסר?'};
  if(h.activity!==c.activity) return {ok:false,kind:'activity',message:'הפעילות שסומנה אינה הפעילות בעדות. חזרו למילים שמתארות מה היה בעיצומו.',fact:'porter-account'};
  if(h.eventTime!==c.open || !inside(h.eventTime,c.carrying)) return {ok:false,kind:'time',message:'האירוע שסומן אינו מתאים לזמן בעדויות. הפעילות המתמשכת היא טווח, והפתיחה היא רגע אחד.',fact:c.id===4?'porter-window':'visitor-account'};
  if(c.id===2 && (!(h.readingStart<h.readingEnd)||!inside(c.bell,[h.readingStart,h.readingEnd]) || h.readingStart!==c.reading[0] || h.readingEnd!==c.reading[1])) return {ok:false,kind:'overlap',message:'בצלצול הפעמון שתי הפעולות היו בעיצומן. סדר של אחת ואז השנייה סותר את while.',fact:'visitor-account'};
  if(h.vessel!==c.target) return {ok:false,kind:'identity',message:'החפץ ממשיך עם כלי אחר. בדקו את השם בעדות; צבע או מיקום לבדם אינם מספיקים.',fact:'visitor-account'};
  return {ok:true,kind:'success',message:'שתי נקודות המבט מתחברות. עכשיו אפשר לבדוק שינוי פיזי בלולאה.'};
}
export function interventionWorks(c:Case,i:Intervention):boolean {
  if(i.kind==='secure') return i.time>=0 && i.time<c.gust;
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
