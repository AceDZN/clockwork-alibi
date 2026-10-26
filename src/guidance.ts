import type {Case} from './content';

export type RecordedClues = {activity:boolean;moment:boolean;vessel:boolean;readingStart:boolean;readingEnd:boolean};
export const emptyRecords = ():RecordedClues => ({activity:false,moment:false,vessel:false,readingStart:false,readingEnd:false});
export type GuideStep = {id:string;phase:0|1|2;title:string;detail:string;button:string;action:'visit'|'luggage'|'replay'|'outcome'|'changes';target?:string};
type GuideState = {facts:readonly string[];recorded:RecordedClues;validated:boolean;mode:string;saved:boolean;afterGust:boolean};

// Navigation help follows what the player has deliberately recorded. It never
// checks an answer or chooses the correct timestamp/container before the trial.
export function nextStep(c:Case,s:GuideState):GuideStep {
  const actor=c.actor==='painter'?'הציירת':'הסבל',observer=c.observer==='attendant'?'עובדת התחנה':'העדה';
  const object=c.object==='bird'?'הציפור':'הפנס',opening=c.opening==='window'?'החלון':'הדלת';
  if(!s.facts.some(f=>f.startsWith('porter-')))return {id:'first-witness',phase:0,title:`דברו עם ${actor}`,detail:'לחצו על הכפתור כדי ללכת אל הדמות. קראו מה היא ראתה באנגלית.',button:`ללכת אל ${actor} ←`,action:'visit',target:'porter'};
  if(!s.recorded.activity)return {id:'activity',phase:0,title:'שמרו את הפעולה מהעדות',detail:`מה ${actor} ${c.actor==='painter'?'עשתה':'עשה'} באותו זמן? בחרו את הפעולה בתפריט שמתחת לעדות ושמרו אותה.`,button:'לחזור לעדות ←',action:'visit',target:'porter'};
  if(!s.facts.includes('visitor-account'))return {id:'second-witness',phase:0,title:`שמעו גם את ${observer}`,detail:'כל דמות ראתה רק חלק מהסיפור. בעדות השנייה חפשו שעה ושם של מזוודה או עגלה.',button:`ללכת אל ${observer} ←`,action:'visit',target:'visitor'};
  if(c.id===4&&!s.facts.includes('porter-window'))return {id:'question',phase:0,title:'שאלו מי פתח ומתי',detail:'חזרו לסבל ובחרו שאלה שמשלימה את הפרט החסר על הפתיחה.',button:'לשאול את הסבל ←',action:'visit',target:'porter'};
  if(c.id===2&&(!s.recorded.readingStart||!s.recorded.readingEnd))return {id:'reading',phase:1,title:'סמנו מתי העדה קראה',detail:'בעדות שלה: גררו את ציר הזמן להתחלת הקריאה ושמרו, ואז לסיום ושמרו שוב.',button:'לסמן בעדות ←',action:'visit',target:'visitor'};
  if(!s.recorded.vessel)return {id:'identity',phase:1,title:'בחרו את המזוודה או העגלה מהעדות',detail:'קראו את השם בעדות השנייה. בדקו את התווית במרחב ולחצו לשמירה.',button:'לבדוק את התוויות ←',action:'luggage'};
  if(!s.recorded.moment)return {id:'moment',phase:1,title:`סמנו מתי ${opening} ${c.opening==='window'?'נפתח':'נפתחה'}`,detail:'גררו את ציר הזמן למטה לשעה שעליה העדים דיברו. בשעון שמרו אותה כשעת הפתיחה.',button:'לשמור רגע בשעון ←',action:'visit',target:'clock'};
  if(!s.validated)return {id:'test',phase:1,title:'בדקו אם הסיפור מתחבר',detail:'השעון יריץ את הרגע שבחרתם ויבדוק אותו מול שתי העדויות. אפשר לתקן כל בחירה.',button:'לבדוק בשעון ←',action:'visit',target:'clock'};
  if(s.mode!=='replay')return {id:'replay',phase:2,title:'עכשיו אפשר לשנות את מה שקרה',detail:'העדויות מתחברות. התחילו לולאה חדשה ובצעו שינוי בעולם.',button:'להתחיל לולאה לשינוי ↻',action:'replay'};
  if(!s.saved)return c.transfer
    ? {id:'change',phase:2,title:'בצעו שינוי בעולם',detail:'בחרו חפץ או מנגנון בתחנה. נסו פעולה בזמן שבחרתם, ואז בדקו את התוצאה.',button:'לבחור מה לבדוק ←',action:'changes'}
    : {id:'change',phase:2,title:`מנעו את הנפילה של ${object}`,detail:`חזרו לרגע מוקדם בציר הזמן. אפשר לקבע את ${object} למדף, או לנעול את ${opening} לפני הפתיחה.`,button:`לגשת אל ${object} ←`,action:'visit',target:'object'};
  if(!s.afterGust)return {id:'outcome',phase:2,title:'השינוי בוצע. בדקו את התוצאה',detail:'המשיכו בזמן כדי לראות אם החפץ נשאר בטוח גם אחרי הרוח.',button:'לצפות בתוצאה ▶',action:'outcome'};
  return {id:'recover',phase:2,title:`${object} ${c.object==='bird'?'בטוחה':'בטוח'} — אספו והחזירו`,detail:'גשו למדף ולחצו על איסוף. המקרה יסתיים אחרי שתחזירו את החפץ.',button:`לאסוף את ${object} ←`,action:'visit',target:'object'};
}
