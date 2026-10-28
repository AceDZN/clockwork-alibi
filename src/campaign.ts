import type {Case,Deduction,Evidence,ObjectKind,Vessel} from './content';

// One continuous campaign. Scene/tier comes from level position, never a grade.
export const SCENES=[
 {name:'תחנת מרידיאן',en:'MERIDIAN STATION',prop:'station',sky:'#0d202c',accent:'#b58b4d'},
 {name:'בית הגן',en:'BOTANICAL HOUSE',prop:'garden',sky:'#132d28',accent:'#7ca475'},
 {name:'גלריית הלילה',en:'NIGHT GALLERY',prop:'gallery',sky:'#251e35',accent:'#ad8bb4'},
 {name:'מחסן הנמל',en:'HARBOUR DEPOT',prop:'harbour',sky:'#142e40',accent:'#6eacbf'},
 {name:'מצפה הכוכבים',en:'OBSERVATORY',prop:'observatory',sky:'#111b39',accent:'#899ecc'},
 {name:'ארכיון העיר',en:'CITY ARCHIVE',prop:'archive',sky:'#30271f',accent:'#be9762'},
 {name:'תיאטרון הפסטיבל',en:'FESTIVAL THEATRE',prop:'theatre',sky:'#301b2c',accent:'#bd7e87'},
 {name:'סדנת השחזור',en:'RESTORATION WORKSHOP',prop:'workshop',sky:'#233132',accent:'#86aaa0'},
 {name:'מעבדת הסערה',en:'STORM LAB',prop:'weather',sky:'#192c3d',accent:'#92b5c5'},
 {name:'כספת השעונים',en:'CLOCKWORK VAULT',prop:'vault',sky:'#25283a',accent:'#d0af64'}
] as const;
export const SKILLS=[
 'פעולה מתמשכת ואירוע בעבר','פרטים וסיבה בתוך עדות','זמן יחסי והפניות בטקסט',
 'חפיפה וסדר אירועים משלושה מקורות','שלילה, השוואה והסקה לפי ראיות',
 'עבר מושלם ופעולה שהושלמה קודם','דיבור עקיף והבדל בין טענה לעובדה',
 'סביל, מבצע הפעולה וארבעה מקורות','תנאים, כוונה ותוצאה בפועל',
 'שילוב זמנים והערכת מסקנות'
];
type Story=readonly [title:string,en:string,account:string,question:string,answer:string,wrong:string,other:string,explanation:string];
// Each incident has an authored reading question. Timing and container records
// below supply additional independent clues; they do not replace these stories.
const STORIES:readonly (readonly Story[])[]=[
 [
  ['העציץ המכוסה','THE COVERED POT','The gardener covered the seedlings because the cold wind was damaging their leaves.','Why did the gardener cover the seedlings?','To protect the leaves from the wind.','To hide them from the visitors.','To make them grow without light.','because מציג את הסיבה: הרוח פגעה בעלים.'],
  ['המשמרת של מיה','MIA’S WATERING TURN','Mia watered the ferns while Dan cleaned the empty pots. Mia did not clean the pots.','Who cleaned the empty pots?','Dan.','Mia.','Both Mia and Dan.','שתי פעולות התרחשו יחד, אך כל אחת שייכת לאדם אחר.'],
  ['הפתק הירוק','THE GREEN NOTE','The note said: “Keep the small plants inside until the rain stops.” The rain had not stopped.','Where should the small plants remain?','Inside.','Outside in the rain.','On the departing cart.','until קובע שהצמחים נשארים בפנים כל עוד הגשם נמשך.'],
  ['השתיל האחרון','THE LAST SEEDLING','The gardener carried the last seedling to the warm room. She left the empty tray outside.','What was left outside?','The empty tray.','The last seedling.','The warm room’s key.','הטקסט מבחין בין השתיל שנלקח למגש שנשאר.'],
  ['בלי להשאיר עקבות','NO MUDDY FOOTPRINTS','The assistant changed his muddy boots before entering the greenhouse so that the floor would stay clean.','Why did the assistant change his boots?','To keep the floor clean.','To water the plants.','To leave muddy footprints.','so that מציג את מטרת החלפת הנעליים.']
 ],
 [
  ['המסגרת הריקה','THE EMPTY FRAME','Lena removed the painting from its frame, wrapped it in cloth and placed it in a wooden box. The frame stayed on the wall.','What does “it” in “wrapped it” refer to?','The painting.','The frame.','The wall.','הכינוי ממשיך להתייחס לציור שהוצא מהמסגרת.'],
  ['הצל של הפסל','THE STATUE’S SHADOW','The visitor noticed a shadow behind the statue, but she did not see anyone touch the display.','Which claim is supported?','She saw a shadow.','She saw someone steal the display.','She touched the display herself.','מראה של צל אינו עדות לזהות אדם או לגניבה.'],
  ['שתי הזמנות','TWO INVITATIONS','Amir gave his invitation to Neta because she had lost hers. He then waited outside.','Whose invitation did Neta use?','Amir’s.','Her own lost invitation.','The curator’s.','his והמשפט הבא מראים שההזמנה שהועברה הייתה של אמיר.'],
  ['הצבע שהתייבש','THE DRY PAINT','The curator checked the paint before moving the canvas. It was dry, so she moved the canvas without touching its surface.','Why could the canvas be moved safely?','The paint was dry and its surface was not touched.','The paint was still wet.','The curator repainted it first.','המסקנה נשענת על מצב הצבע ועל אופן ההזזה.'],
  ['המבט האחרון','THE FINAL LOOK','Although the gallery was closing, the visitor stayed for one final look at the portrait. She left before the lights went out.','Which happened first?','The visitor left.','The lights went out.','The portrait was removed.','before מסדר את היציאה לפני כיבוי האורות.']
 ],
 [
  ['החותם שלא נשבר','THE UNBROKEN SEAL','The inspector checked the parcel’s seal before the courier loaded it. The seal was intact during the check.','What can the inspector confirm?','The seal was intact when it was checked.','The parcel could never be opened later.','The courier packed the parcel.','העדות מאשרת מצב בזמן הבדיקה בלבד.'],
  ['המעיל שהושאל','THE BORROWED COAT','The sailor lent the courier a coat while her own coat was drying. She returned the borrowed coat after the delivery.','Why did the courier need a borrowed coat?','Her own coat was drying.','The sailor had lost his coat.','She had not made the delivery.','הסיבה נמסרת בפסוקית while; ההחזרה מתרחשת מאוחר יותר.'],
  ['התיבה הלא נכונה','THE WRONG CRATE','The porter reached for the heavy crate, then chose the lighter one because the lift could not carry the heavier crate.','Which crate was chosen?','The lighter crate.','The heavier crate.','Both crates together.','then והסיבה שבאה אחריו מבטלים את הבחירה הראשונה.'],
  ['איתות מהסירה','THE BOAT SIGNAL','The boat signalled while the workers were unloading. The signal did not mean that unloading had finished.','What was true when the signal sounded?','Unloading was still in progress.','Unloading had finished.','No workers were present.','פעולה מתמשכת חופפת לאיתות ואינה מסתיימת בגללו.'],
  ['החבל האחרון','THE LAST ROPE','Before the boat departed, the worker untied the final rope. The courier was already back on the quay.','Where was the courier when the boat departed?','On the quay.','On the boat.','The account does not place her anywhere.','already back מציב את השליחה על הרציף לפני ההפלגה.']
 ],
 [
  ['כוכב ללא שם','THE UNNAMED STAR','Neither telescope was pointed at the moon. One was aimed at a star; the other was covered.','Which statement is true?','No telescope was aimed at the moon.','Both telescopes were aimed at the moon.','The covered telescope was being used.','neither שולל את הטענה עבור שניהם.'],
  ['המחברת ההפוכה','THE UPSIDE-DOWN NOTEBOOK','The notebook was beside the compass, not beneath it. The assistant moved only the notebook.','What remained in place?','The compass.','The notebook.','Neither object.','only מגביל את ההזזה למחברת.'],
  ['העדשה השנייה','THE SECOND LENS','The larger lens was less clear than the smaller one, so the observer used the smaller lens.','Why was the smaller lens used?','It gave a clearer view.','It was larger.','The larger lens had disappeared.','less clear than יוצר השוואה; הגודל אינו הסיבה לבחירה.'],
  ['האור הרחוק','THE DISTANT LIGHT','The observer saw a light move across the sky. She could not tell whether it was a plane or a satellite.','Which conclusion goes beyond the evidence?','It was definitely a satellite.','A light moved across the sky.','The observer was unsure what it was.','could not tell אינו מאפשר לזהות את האור בוודאות.'],
  ['אחרי שהעננים חלפו','AFTER THE CLOUDS','The northern telescope was ready, but only the southern telescope had a clear view after the clouds moved away.','Which telescope could be used for a clear observation?','The southern telescope.','The northern telescope.','Neither telescope.','ready אינו זהה ליכולת לראות; only מצמצם את הבחירה.']
 ],
 [
  ['מכתב שכבר נשלח','THE LETTER ALREADY SENT','By the time the clerk found the draft, the original letter had already been sent. Finding the draft did not stop the delivery.','What had happened before the draft was found?','The original letter had been sent.','The delivery had been cancelled.','The original letter had been destroyed.','had already been sent מציין פעולה שהושלמה לפני המציאה.'],
  ['החותמת הישנה','THE OLD STAMP','The archivist had replaced the damaged stamp before the visitor arrived. The visitor used the replacement.','Which stamp did the visitor use?','The replacement stamp.','The damaged stamp.','An unspecified third stamp.','ההחלפה קדמה להגעה ולכן המבקר השתמש בחותמת החלופית.'],
  ['הדף החסר','THE MISSING PAGE','The clerk had copied the page before it went missing, so its contents were still available.','Why were the contents still available?','A copy had been made earlier.','The page never went missing.','The visitor remembered every word.','העבר המושלם מציג את ההעתקה שקדמה להיעלמות.'],
  ['קודם למי','WHO ARRIVED FIRST','When Ada reached the archive, Ben had already left. They did not meet there that evening.','Which sequence matches the account?','Ben left, then Ada arrived.','Ada arrived, then Ben left.','Ada and Ben arrived together.','had already left קובע שהעזיבה קדמה להגעה.'],
  ['התיק שננעל','THE LOCKED FILE','The librarian had locked the original file away before lending the copy. The borrowed pages were not originals.','What was lent?','A copy of the file.','The locked original file.','The key to the original file.','המשפט האחרון והנעילה המוקדמת מזהים את העותק.']
 ],
 [
  ['מה שהשחקנית אמרה','THE ACTOR’S WORDS','The actor said that she had left her violin backstage. The attendant checked backstage and found only an empty case.','Which statement is an observed fact?','The attendant found an empty case.','The violin was definitely backstage.','The actor carried the violin away.','אמרה של דמות אינה שקולה לבדיקה; הממצא הנצפה הוא הנרתיק הריק.'],
  ['הבטחה לחזור','A PROMISE TO RETURN','The stage manager said that he would return after the rehearsal. The log records his return before the audience entered.','What does the log confirm?','He returned before the audience entered.','He returned during the performance.','He never returned.','היומן מאמת אירוע בפועל מעבר להבטחה המקורית.'],
  ['השמועה על האור','THE LIGHT RUMOUR','A visitor claimed that the lights had failed. The technician reported that they had been switched off for a planned test.','Which explanation is supported by the technician?','A planned test.','An accidental power failure.','A stolen lamp.','העד הטכני מבחין בין תקלה נטענת לבין בדיקה מתוכננת.'],
  ['ההודעה שנמסרה','THE RELAYED MESSAGE','Nora told Eli that the rehearsal had moved to the small hall. Eli passed the message to the drummer without changing it.','Where should the drummer go?','The small hall.','The original rehearsal room.','The ticket office.','המסר הועבר ללא שינוי ולכן יעדו נשמר.'],
  ['הכרטיס שנשמר','THE RESERVED TICKET','The usher said that a seat had been reserved for the guest, but the guest chose to stand near the exit.','Which is true about the guest’s actual choice?','The guest stood near the exit.','The guest sat in the reserved seat.','The guest left before arriving.','but מבחין בין מה שהוצע לבין הבחירה בפועל.']
 ],
 [
  ['מי תיקן את הגביע','WHO REPAIRED THE TROPHY','The trophy was repaired by the apprentice and inspected by the master. The master did not perform the repair.','Who repaired the trophy?','The apprentice.','The master.','Both the apprentice and the master.','by בסביל מזהה את מבצע התיקון; הבדיקה היא פעולה אחרת.'],
  ['החלק שהוחלף','THE REPLACED PART','A broken wheel was replaced with a wooden wheel. The broken wheel was kept as evidence rather than thrown away.','What was kept as evidence?','The broken wheel.','The replacement wheel.','The entire cart.','הסביל והמשפט השני מזהים איזה חלק נשמר.'],
  ['שתי חתימות','TWO SIGNATURES','The repair form was signed by the restorer after it had been checked by the inspector.','Who checked the form?','The inspector.','The restorer.','The person who delivered the trophy.','checked by ו־signed by מייחסים פעולות שונות לאנשים שונים.'],
  ['משלוח שהוחזר','THE RETURNED DELIVERY','The parcel was delivered to the workshop by mistake and was returned unopened to its sender.','Which claim is supported?','The workshop returned the parcel without opening it.','The workshop repaired its contents.','The sender collected a repaired object.','unopened מתאר את מצב החבילה בהחזרה, לא תיקון.'],
  ['הדלת שלא נפרצה','THE UNDAMAGED DOOR','The door had been opened with an authorised key. No damage was found around the lock.','Which conclusion is justified?','The account supports key access.','The door was forced open.','The key holder’s identity is proven.','המפתח מסביר גישה אך אינו מזהה בוודאות את המחזיק בו.']
 ],
 [
  ['אם הרוח תתחזק','IF THE WIND RISES','The researcher planned to close the vent if the wind rose. The wind stayed weak, and the vent remained open.','What actually happened?','The vent remained open.','The vent was closed.','The researcher proved the wind was strong.','תוכנית מותנית אינה אירוע בפועל; התנאי לא התקיים.'],
  ['אלא אם יישמע אות','UNLESS THE SIGNAL SOUNDS','The assistant was told to stay indoors unless the signal sounded. The signal never sounded.','What did the instruction require?','Stay indoors.','Go outside immediately.','Ignore whether the signal sounded.','unless מציג חריג שלא התרחש.'],
  ['מטרת הניסוי','THE PURPOSE OF THE TEST','The scientist covered the sensor so that rain would not reach it. Later, water entered through a loose cable seal.','Which statement separates intention from result?','The sensor was covered to keep it dry, but water still entered.','Covering the sensor proved it stayed dry.','The scientist intended water to enter.','so that מתאר מטרה; המשפט הבא מציג תוצאה אחרת.'],
  ['בלעדיו לא מתחילים','NO TEST WITHOUT IT','The test could begin only if both assistants were present. One assistant arrived, but the other remained outside.','Could the test begin under the rule?','No; both assistants were required.','Yes; one assistant was enough.','Yes; arriving outside counted as being present.','only if מציג תנאי הכרחי שלא הושלם.'],
  ['מה היה קורה','WHAT WOULD HAVE HAPPENED','If the latch had been fastened, the vent would have stayed shut. The vent opened because the latch had not been fastened.','What does the account say actually happened?','The latch was not fastened and the vent opened.','The latch was fastened and the vent stayed shut.','The vent stayed shut without a latch.','תנאי בטל בעבר מתאר חלופה; הסיפור מציין שהבריח לא נסגר.']
 ],
 [
  ['שלושה שעונים','THREE CLOCKS','The guard said the display clock was accurate, but the calibration note showed that it was three seconds fast. The station clock was the reference.','Which clock should anchor the reconstruction?','The station clock.','The fast display clock without correction.','Whichever clock shows the later time.','כיול מתועד גובר על טענה לא מאומתת לגבי דיוק.'],
  ['העדות שתוקנה','THE CORRECTED ACCOUNT','The first report named the east door. After checking the hinge marks, the investigator corrected it to the side door. The correction replaced the first report.','Which report is current?','The corrected report naming the side door.','The original east-door report.','Both reports describe two confirmed openings.','תיקון מחליף את הטענה הראשונה; אין כאן שתי פתיחות מוכחות.'],
  ['לא כל מי שהיה שם','PRESENCE IS NOT PROOF','Two workers were near the shelf when the object fell. Neither account says that either worker touched it.','Which conclusion is unsupported?','One of the workers must have pushed the object.','Two workers were nearby.','The accounts do not establish physical contact.','נוכחות וחפיפה בזמן אינן הוכחת מגע או סיבתיות.'],
  ['הסדר שלא נכתב','THE ORDER BETWEEN LINES','The courier arrived after the guard had left but before the technician returned. The technician found the courier waiting.','Which order follows from both sentences?','The guard left, the courier arrived, the technician returned.','The technician returned, the guard left, the courier arrived.','The courier arrived before the guard left.','after ו־before יחד מגבילים את האירוע האמצעי.'],
  ['הלולאה החמישים','THE FIFTIETH LOOP','The final report distinguishes a warning, an attempted repair and the observed result. Although a repair had been promised, the latch was still loose when the opening occurred.','Which evidence matters for what happened?','The observed loose latch at the opening.','The promise alone proves the latch was repaired.','The warning proves the opening never happened.','משלבים זמנים ומבחינים בין כוונה, ניסיון ותוצאה שנצפתה.']
 ]
];
const pad=(n:number)=>`00:${n.toString().padStart(2,'0')}`;
const num=(n:number)=>['zero','one','two','three','four','five','six','seven','eight','nine','ten'][n]??String(n);
const objects:ObjectKind[]=['bird','seed','vase','parcel','compass','parcel','violin','trophy','compass','bird'];
const nouns:Record<ObjectKind,string>={bird:'clockwork bird',seed:'seed capsule',vase:'glass vase',parcel:'sealed parcel',compass:'brass compass',violin:'miniature violin',trophy:'exhibition trophy',lantern:'festival lantern'};
const labels=[['NOA','AVI'],['FERN','MOSS','PALM','ROSE'],['FRAME','CANVAS','BRUSH','PAINT'],['QUAY','SAIL','DOCK','TIDE'],['NORTH','SOUTH','EAST','WEST'],['DRAFT','COPY','INDEX','SEAL'],['STAGE','LIGHT','SCORE','WINGS'],['GEAR','BRASS','WOOD','STEEL'],['RAIN','WIND','CLOUD','FROST'],['DAWN','DUSK','NOON','NIGHT']];
function question(id:string,prompt:string,answers:string[],explanation:string,fact:string,seed:number):Deduction{
 const choices=answers.map((text,i)=>({id:`option-${i}`,text}));
 // Stable shuffled order; the correct option is never inferred from position.
 for(let i=choices.length-1;i>0;i--){const j=(seed*13+i*7)%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {id,prompt,choices,answer:'option-0',explanation,fact};
}
export function extendedCases():Case[]{
 return STORIES.flatMap((stories,chapter)=>stories.map((story,slot)=>{
  const scene=chapter+1,tier=scene+1,id=scene*5+slot+1;
  const open=20+(slot*7+scene*3)%21,delta=2+slot,bell=open-delta,gust=open+2,depart=gust+11;
  const carrying:[number,number]=[Math.max(1,open-12),open+5],reading:[number,number]=[open-7,open+7];
  const west=(scene+slot)%2===1,opening=west?'door':'window',object=objects[scene],noun=nouns[object],count=tier>=5?4:tier>=3?3:2;
  const names=labels[scene].slice(0,count),targetIndex=(id*7)%count,target=names[targetIndex];
  const vessels:Vessel[]=names.map((label,i)=>({id:label,label,color:tier>=4?'#43647a':['#43647a','#876a4d','#586d50'][i%3],x:west?[-4,-6,-4,-6][i]:[4,5.7,4,5.7][i],z:[.8,2.4,2.4,.8][i],openAt:i===targetIndex?open-3:0,...(i===targetIndex?{}:{closeAt:gust-2+i%2})}));
  const activity=slot%2?'moving the ladder':'carrying boxes',actor=slot%2?'painter':'porter';
  const latchFrom=open-Math.max(2,8-Math.floor(tier/2)),secureFrom=tier>=4?gust-Math.max(2,9-Math.floor(tier/2)):0;
  const place=opening==='door'?'side door':'window';
  const timeClue=tier===2?`The technician opened the ${place} at ${pad(open)}.`
   :tier<=5?`The bell rang at ${pad(bell)}. The technician opened the ${place} ${num(delta)} seconds after the bell.`
   :tier===6?`By ${pad(open+3)}, the ${place} had already been open for three seconds.`
   :tier===7?`The technician said that the ${place} had been opened ${num(delta)} seconds after the bell, which rang at ${pad(bell)}.`
   :tier===8?`The ${place} was opened by the technician ${num(delta)} seconds after the bell at ${pad(bell)}.`
   :tier===9?`If the latch had held, the ${place} would have stayed shut. Instead it opened ${num(delta)} seconds after the ${pad(bell)} bell.`
   :`The station bell rang at ${pad(bell)}. A display clock, three seconds fast, showed ${pad(open+3)} when the ${place} opened. Use station time.`;
  const porter:Evidence[]=[{id:'porter-account',speaker:actor==='painter'?'The restorer':'The assistant',question:'What were you doing, and what else did you notice?',text:`I was ${activity} from ${pad(carrying[0])} to ${pad(carrying[1])}. ${story[2]}`}];
  const visitor:Evidence[]=[{id:'visitor-account',speaker:'The observer',question:'What did you see when the opening occurred?',text:`${timeClue} I was reading from ${pad(reading[0])} to ${pad(reading[1])}. ${tier<4?`The ${noun} fell into the ${target} case.`:`The ${noun} landed in the only case that was still open when the gust arrived at ${pad(gust)}.`}`}];
  const records:Evidence[]=tier>=4?[{id:'ledger-account',speaker:'Container register',text:`${vessels.map(v=>v.id===target?`${v.label}: opened at ${pad(v.openAt)} and remained open.`:`${v.label}: closed at ${pad(v.closeAt!)} and was not reopened.`).join(' ')} The gust arrived at ${pad(gust)}. The shelf clamp was released at ${pad(secureFrom)}; it could not be used earlier.`}]:[];
  if(tier>=6)porter.push({id:'porter-key',speaker:'The assistant',question:'Where was the latch key left?',text:`I found the latch key at ${pad(latchFrom)} and left it beside the station clock. The latch could be fastened from then until the ${place} opened.`});
  if(tier>=8)records.push({id:'dispatch-account',speaker:'Dispatch log',text:`All cases departed at ${pad(depart)}. The gust was recorded at ${pad(gust)}, after the opening. No case reopened after its recorded closing time. The shelf clamp was unavailable before ${pad(secureFrom)}.`});
  const deductions=[question('story',story[3],[story[4],story[5],story[6]],story[7],'porter-account',id)];
  if(tier>=4)deductions.push(question('sequence','Which sequence is consistent with the incident?',[
   'The opening occurred, then the gust arrived, then the cases departed.',
   'The cases departed before the opening occurred.','The gust arrived before the opening occurred.'
  ],'משווים את רגע הפתיחה, הרוח והיציאה. סדר שונה סותר לפחות אחד מן המקורות.','visitor-account',id+1));
  if(tier>=7)deductions.push(question('identity','What makes the destination case identifiable?',[
   'Its tag and its open interval match the register at the gust.','Its colour alone proves it was the destination.','Its position proves who caused the opening.'
  ],'התווית וטווח הפתיחה מזהים את הכלי; צבע ומיקום אינם מוכיחים זהות או כוונה.','ledger-account',id+2));
  if(tier===10)deductions.push(question('clock','The display clock is three seconds fast. How should its reading be used?',[
   'Subtract three seconds to recover station time.','Add three seconds to recover station time.','Use the displayed time without a correction.'
  ],'שעון שמקדים בשלוש שניות מציג זמן גדול מהזמן הנכון בשלוש שניות.','visitor-account',id+3));
  return {id,title:story[0],englishTitle:story[1],scene,tier,skill:SKILLS[scene],objective:`${SCENES[scene].name}: חברו את המקורות, בדקו את המסקנות ושנו את הלולאה.`,
   actor,actorName:actor==='painter'?'המשחזרת':'עוזר המקום',observer:'attendant',observerName:'העדה',opener:'visitor',activity,carrying,reading,bell,open,gust,depart,latchFrom,secureFrom,opening,object,target,vessels,
   requiresReading:tier>=4,requiresKey:tier>=6,accounts:{porter,visitor,records},deductions,transfer:slot===4,
   hint:SKILLS[scene]+' — חפשו את המילים שמגבילות את המסקנה. השוו את כל המקורות ואת זמני הפתיחה והסגירה.',
   feedback:story[7]+' '+SKILLS[scene]+'.'};
 }));
}
