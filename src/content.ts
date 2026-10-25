export type Interval = readonly [number, number];
export type Vessel = { id: string; label: string; color: string; x: number; z: number; openAt: number; closeAt?: number };
export type Case = {
  id: number; title: string; englishTitle: string; objective: string; actor: 'porter'|'painter';
  observer:'visitor'|'attendant';opener:'musician'|'visitor';activity: string; carrying: Interval; reading: Interval; bell: number; open: number; gust: number; depart: number;
  latchFrom: number; opening: 'window'|'door'; object: 'bird'|'lantern'; target: string; vessels: Vessel[];
  hint: string; feedback: string; transfer: boolean;
};
export const CASES: Case[] = [
  {id:1,title:'רגע בתוך תנועה',englishTitle:'THE MISSING BIRD',objective:'מי ראה את מה שקרה לציפור? חברו שתי עדויות ושנו את הלולאה.',actor:'porter',observer:'visitor',opener:'musician',activity:'carrying boxes',carrying:[10,30],reading:[15,35],bell:20,open:20,gust:22,depart:40,latchFrom:15,opening:'window',object:'bird',target:'NOA',vessels:[{id:'NOA',label:'NOA',color:'#214e76',x:4,z:0.8,openAt:0},{id:'AVI',label:'AVI',color:'#315578',x:5.7,z:2.4,openAt:99}],hint:'בדקו מתי נפתח החלון, ומה שם הבעלים של המזוודה. אפשר לנעול את התריס לפני הפתיחה או לקבע את הציפור לפני הרוח.',feedback:'was carrying מתאר פעולה שהייתה בעיצומה בזמן שהחלון נפתח.',transfer:false},
  {id:2,title:'שני דברים בבת אחת',englishTitle:'THE SHARED BELL',objective:'נשיאה וקריאה: האם אחת הסתיימה לפני שהשנייה התחילה?',actor:'porter',observer:'visitor',opener:'musician',activity:'carrying boxes',carrying:[8,28],reading:[14,34],bell:24,open:26,gust:28,depart:46,latchFrom:20,opening:'window',object:'bird',target:'AVI',vessels:[{id:'NOA',label:'NOA',color:'#315578',x:5.7,z:2.4,openAt:99},{id:'AVI',label:'AVI',color:'#214e76',x:4,z:0.8,openAt:0}],hint:'while מחבר פעולות חופפות. סמנו לקריאה טווח שמכיל את צלצול הפעמון, והקשיבו גם לפרט על החלון.',feedback:'while מחבר כאן פעולות שחפפו בזמן; הוא אינו קובע שאחת הסתיימה קודם.',transfer:false},
  {id:3,title:'אותו צבע, סיפור אחר',englishTitle:'TWO BLUE SUITCASES',objective:'שתי מזוודות כחולות. עקבו אחרי השמות ואחרי סדר האירועים.',actor:'porter',observer:'visitor',opener:'musician',activity:'carrying boxes',carrying:[9,32],reading:[15,36],bell:25,open:25,gust:27,depart:42,latchFrom:19,opening:'window',object:'bird',target:'NOA',vessels:[{id:'AVI',label:'AVI',color:'#214e76',x:4,z:0.8,openAt:0,closeAt:12},{id:'NOA',label:'NOA',color:'#214e76',x:5.7,z:2.4,openAt:19}],hint:'הצבע לבדו אינו מספיק. מי סגר ומי פתח? השוו before ו־after עם תוויות השם.',feedback:'before ו־after מסדרים אירועים. צבע משותף אינו מוכיח שזה אותו חפץ.',transfer:false},
  {id:4,title:'השאלה שחסרה',englishTitle:'ASK THE RIGHT PERSON',objective:'שאלות שונות חושפות פרטים שונים. שאלו, מצאו את המפתח ושנו את העבר.',actor:'porter',observer:'visitor',opener:'musician',activity:'carrying boxes',carrying:[11,33],reading:[16,38],bell:23,open:31,gust:33,depart:48,latchFrom:24,opening:'window',object:'bird',target:'STAGE',vessels:[{id:'MAIL',label:'MAIL',color:'#745640',x:4,z:0.8,openAt:0},{id:'STAGE',label:'STAGE',color:'#745640',x:5.7,z:2.4,openAt:0}],hint:'השאלה על הפתיחה נותנת זמן; השאלה על המציאה חושפת מפתח. העדה השנייה מכירה את העגלה.',feedback:'שאלה משלימה מידע חסר. found הוא העבר של find; אחרי did משתמשים ב־find.',transfer:false},
  {id:5,title:'האור שמאחורי הווילון',englishTitle:'THE TRAVELLING LANTERN',objective:'מקרה חדש. פנס, ציירת ודלת צדדית. חקרו בלי רמז לפתרון.',actor:'painter',observer:'attendant',opener:'visitor',activity:'moving the ladder',carrying:[5,17],reading:[8,24],bell:13,open:13,gust:16,depart:34,latchFrom:9,opening:'door',object:'lantern',target:'CANVAS',vessels:[{id:'STAGE',label:'STAGE',color:'#745640',x:-4,z:2.8,openAt:0},{id:'CANVAS',label:'CANVAS',color:'#745640',x:-6,z:0.6,openAt:0}],hint:'',feedback:'חיברתם פעילות מתמשכת, אירוע ופרט זיהוי גם בסיפור חדש.',transfer:true}
];
export const stamp = (t:number) => `00:${Math.floor(t).toString().padStart(2,'0')}`;
export type Evidence = {id:string;speaker:string;question?:string;text:string};
// All times, subjects, locations and labels below come from the same table as the simulation.
export function evidenceFor(c:Case, witness:'porter'|'visitor'):Evidence[] {
  const vessel=c.vessels.find(v=>v.id===c.target)!;
  if(witness==='visitor') {
    const text = c.id===5
      ? `The visitor opened the side door at ${stamp(c.open)}. The lantern fell into the ${vessel.label} cart before the curtain closed at ${stamp(c.gust+2)}.`
      : c.id===4 ? `The bird fell into the ${vessel.label} cart, not the MAIL cart. The trolley took it at ${stamp(c.depart)}.`
      : c.id===3 ? `The bird fell after Noa opened her suitcase at ${stamp(vessel.openAt)}. The musician opened the window at ${stamp(c.open)}; the trolley took Noa’s suitcase at ${stamp(c.depart)}.`
      : c.id===2 ? `I was reading from ${stamp(c.reading[0])} to ${stamp(c.reading[1])}. The bell rang at ${stamp(c.bell)}. The musician opened the window two seconds later. The bird fell into Avi’s suitcase.`
      : `The bell rang at ${stamp(c.bell)} when the musician opened the window. I saw the bird fall into Noa’s open blue suitcase just after the bell. I was reading, not carrying boxes.`;
    return [{id:'visitor-account',speaker:c.observer==='attendant'?'The attendant':'The visitor',text}];
  }
  if(c.id===4) return [
    {id:'porter-carry',speaker:'The porter',question:'What were you carrying when the bell rang?',text:`I was carrying boxes from ${stamp(c.carrying[0])} to ${stamp(c.carrying[1])}. The bell rang at ${stamp(c.bell)}.`},
    {id:'porter-key',speaker:'The porter',question:'What did you find after the bell rang?',text:`I found a brass key at ${stamp(c.latchFrom)}. I left it beside the clock. It opens the shutter latch.`},
    {id:'porter-window',speaker:'The porter',question:'Who opened the window?',text:`The musician opened the window at ${stamp(c.open)}, while I was carrying boxes.`}
  ];
  const text=c.id===5
    ? `While I was moving the ladder, the visitor opened the side door. I moved the ladder from ${stamp(c.carrying[0])} to ${stamp(c.carrying[1])}.`
    : c.id===3 ? `Avi closed his suitcase at ${stamp(c.vessels.find(v=>v.id==='AVI')!.closeAt!)} before Noa opened hers. Both suitcases were blue. I was carrying boxes from ${stamp(c.carrying[0])} to ${stamp(c.carrying[1])}.`
    : c.id===2 ? `I was carrying boxes from ${stamp(c.carrying[0])} to ${stamp(c.carrying[1])} while the visitor was reading. The bell rang before I put the boxes down.`
    : `While I was carrying boxes, the musician opened the window. I started at ${stamp(c.carrying[0])} and finished at ${stamp(c.carrying[1])}.`;
  return [{id:'porter-account',speaker:c.actor==='painter'?'The painter':'The porter',text}];
}
export const VOCAB:Record<string,string> = {while:'בזמן ש־ / במהלך',when:'כאשר',carrying:'נושא/ת',boxes:'ארגזים',opened:'פתח/ה',window:'חלון',reading:'קורא/ת',bell:'פעמון',rang:'צלצל',fell:'נפל/ה',suitcase:'מזוודה',before:'לפני',after:'אחרי',found:'מצא/ה',key:'מפתח',ladder:'סולם',lantern:'פנס',curtain:'וילון',cart:'עגלה',took:'לקח/ה',latch:'בריח',shutter:'תריס',moving:'מזיז/ה',door:'דלת',while2:'פעולות חופפות אינן מוכיחות כוונה'};
