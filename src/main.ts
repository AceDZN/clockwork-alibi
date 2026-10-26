import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import './style.css';
import * as THREE from 'three';
import {CASES,stamp,evidenceFor,VOCAB,type Evidence} from './content';
import {checkReconstruction,newHypothesis,worldAt,interventionWorks,type Intervention,type Check} from './simulation';
import {Station,type Target} from './scene';
import {firstDecision,recordExposure,type ExposureLedger} from './exposure';
import {emptyRecords,nextStep,type GuideStep} from './guidance';
import {initHost,parseLevelParam,postToHost,type HostMessage} from './host';

initHost('clockwork-alibi');
let hostReady=false,levelStartedAt=performance.now(),levelCompleted=false;
const hostQueue:HostMessage[]=[];
function toHost(message:HostMessage){if(hostReady)postToHost(message);else hostQueue.push(message);}
function hostLevelStart(){levelStartedAt=performance.now();levelCompleted=false;toHost({type:'level-start',level:chapter+1});}
function markHostReady(){hostReady=true;postToHost({type:'ready'});for(const message of hostQueue.splice(0))postToHost(message);}

declare global {interface Window {render_game_to_text:()=>string;advanceTime:(ms:number)=>void;}}
const $=<T extends HTMLElement=HTMLElement>(s:string)=>document.querySelector<T>(s)!;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
$('#app').innerHTML=`<main id="game"><canvas id="world" tabindex="0" aria-label="תחנת מרידיאן — מרחב תלת ממדי לחקירה"></canvas>
 <header><div class="brand" dir="ltr"><span class="brand-mark">◷</span><div>CLOCKWORK ALIBI<small>MERIDIAN STATION · תעלומת שעון התחנה</small></div></div><div class="case-heading"><span id="chapter" dir="ltr"></span><h1 id="case-title"></h1></div></header>
 <div id="objective"></div><aside id="guide" hidden aria-label="הצעד הבא בחקירה"><div class="guide-top"><span id="guide-phase"></span><button id="guide-help">איך משחקים?</button></div><h2 id="guide-title"></h2><p id="guide-detail"></p><button id="guide-action" class="primary"></button></aside><div id="hotspots" aria-label="דמויות וחפצים בתחנה"></div>
 <div id="notice" role="status" aria-live="polite"></div><div id="nearest"></div>
 <div id="panel" hidden></div><div id="intro"><span class="eyebrow" dir="ltr">CLOCKWORK ALIBI · THE MISSING BIRD</span><h2>הציפור נעלמה.<br>החזירו אותה.</h2><p>שני עדים ראו חלקים שונים של הסיפור.<br>גלו מה קרה דרך העדויות באנגלית,<br>ואז חזרו בזמן כדי למנוע את הנפילה.</p><ol class="intro-steps"><li>שומעים שני עדים</li><li>בודקים מה קרה</li><li>משנים את העבר ומצילים</li></ol><button id="start" class="primary">להתחיל בחקירה <span>←</span></button><div class="intro-controls">לחצו על דמות או חפץ — הדמות שלכם תלך אליהם.<br>החקירה מתחילה בזמן עצור. אפשר להתקדם בקצב שלכם.</div></div>
 <footer id="time-tools"><div class="time-main" dir="ltr"><button id="play" aria-label="הפעלה או עצירה" title="רווח — הפעלה / עצירה">▶</button><div id="time">00:10<small>LOOP 01</small></div><div class="scrubber"><div class="timeline-caption">ציר הזמן · גררו כדי לבחור רגע</div><div class="ticks"><span>00</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><span>60</span></div><input id="timeline" type="range" min="0" max="60" step="1" value="10" aria-label="זמן בלולאה"><div class="track"><span id="porter-track"></span><span id="visitor-track"></span></div></div><button id="rewind" title="חזרה לתחילת הלולאה" aria-label="לולאה חדשה">↶</button></div><div class="time-actions"><div id="mode-label">חקירת העבר</div><button id="notebook">מחברת השחזור <span id="fact-count">0/2</span></button><button id="replay">לולאה לשינוי ↻</button><button id="skip-test" hidden>לסיים בדיקה</button><button id="hint">רמז</button><button id="settings" aria-label="אפשרויות">⚙</button><span class="keyboard-help">תנועה בחצים · E לבדיקה · רווח לעצירה</span></div></footer>
 <div id="dpad" aria-label="כפתורי תנועה"><button data-key="ArrowUp" aria-label="קדימה">↑</button><button data-key="ArrowLeft" aria-label="שמאלה">←</button><button data-key="ArrowDown" aria-label="אחורה">↓</button><button data-key="ArrowRight" aria-label="ימינה">→</button></div>
 </main>`;
let station:Station;try{station=new Station($('#world'));}catch(e){$('#app').innerHTML='<div class="webgl-error"><h1>התחנה זקוקה ל־WebGL</h1><p>אפשר להפעיל האצת חומרה בדפדפן ולרענן. המשחק אינו דורש חשבון.</p></div>';throw e;}
let chapter=0,c=CASES[0],mode:'intro'|'explore'|'replay'|'testing'|'won'|'finished'='intro',time=10,paused=true,panel:string|null=null;
let trial:{end:number;result:Check;returnMode:'explore'|'replay'}|null=null;
let facts:string[]=[],known:Evidence[]=[],hypothesis=newHypothesis(c),validated=false,interventions:Intervention[]=[],recovered=false,hasKey=false;
let attempts=0,retries=0,hints=0,unaided=true,physicalSaves=0,languageWins=0,loop=1,selected:string|null=null,pending:string|null=null,muted=false,reduced=false;
let recorded=emptyRecords(),guide:GuideStep|null=null,guideSignature='';
let needsRender=true,renderedFrames=0;
const keys=new Set<string>();let noticeUntil=0,noticeText='',last=performance.now(),fpsSamples:number[]=[],frames=0,frameSeconds=0;
type LocalEvent={challenge:number;action:string;success:boolean;hint:boolean;retries:number;unaided:boolean};
let exposure:ExposureLedger={};try{exposure=JSON.parse(localStorage.getItem('clockwork-exposure-v1')??'{}');}catch{}
function expose(action:'attempt'|'hint'|'complete'){exposure=recordExposure(exposure,c.id,action);try{localStorage.setItem('clockwork-exposure-v1',JSON.stringify(exposure));}catch{}}
let events:LocalEvent[]=[];try{events=JSON.parse(localStorage.getItem('clockwork-events')??'[]');}catch{}
function log(action:string,success=false){events.push({challenge:c.id,action,success,hint:hints>0,retries,unaided:unaided&&retries===0&&hints===0});events=events.slice(-120);try{localStorage.setItem('clockwork-events',JSON.stringify(events));}catch{}}
let audio:AudioContext|null=null;
function sound(kind:'tick'|'bell'|'success'|'fail'='tick'){if(muted)return;try{audio??=new AudioContext();void audio.resume();const n=kind==='success'?3:1;for(let i=0;i<n;i++){const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);const start=audio.currentTime+i*.12;osc.type='sine';osc.frequency.value=kind==='fail'?165:kind==='tick'?650:[523,659,784][i];gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(kind==='tick'?.015:.07,start+.01);gain.gain.exponentialRampToValueAtTime(.0001,start+.25);osc.start(start);osc.stop(start+.3);}}catch{}}
function notify(text:string,duration=6){noticeText=text;noticeUntil=performance.now()+duration*1000;$('#notice').textContent=text;$('#notice').classList.add('visible');}
function closePanel(){needsRender=true;panel=null;$('#world').focus();$('#panel').hidden=true;$('#panel').innerHTML='';window.speechSynthesis?.cancel();keys.clear();syncGuide();}
function showPanel(html:string,name:string){paused=true;keys.clear();panel=name;$('#panel').dataset.kind=name;$('#panel').hidden=false;$('#panel').innerHTML=` ${(name==='win'||name==='finish')?'':'<button class="close-panel" aria-label="סגירה">×</button>'}${html}`;const closer=$('.close-panel');if(closer)closer.onclick=closePanel;$('#panel').querySelector<HTMLButtonElement>('button:not(.close-panel)')?.focus();sync();}
function words(text:string){return text.split(/(\b[A-Za-z]+\b)/).map(w=>VOCAB[w.toLowerCase()]?`<button class="word" data-word="${w.toLowerCase()}" title="פירוש בעברית">${esc(w)}</button>`:esc(w)).join('');}
function wireWords(){document.querySelectorAll<HTMLButtonElement>('.word').forEach(b=>b.onclick=()=>{const k=b.dataset.word!;$('#gloss').textContent=`${b.textContent} — ${VOCAB[k]}`;log(`vocabulary:${k}`);});}
function activityOptions(){return `<option value="" ${!recorded.activity?'selected':''} disabled>בחרו פעולה לפי העדות…</option>`+['reading','carrying boxes','moving the ladder','finished carrying boxes'].map(v=>`<option value="${v}" ${recorded.activity&&hypothesis.activity===v?'selected':''}>${v}</option>`).join('');}
function wireRecords(){
  const activity=$<HTMLButtonElement>('#record-activity');if(activity){const choice=$<HTMLSelectElement>('#source-activity');activity.disabled=!choice.value;choice.onchange=()=>activity.disabled=!choice.value;activity.onclick=()=>{if(!choice.value)return;hypothesis.activity=choice.value;recorded.activity=true;validated=false;activity.textContent='✓ הפעולה נשמרה';log('record-background');notify('הפעולה נשמרה. סיימו את הקריאה והמשיכו לצעד הבא.');sync();};}
  for(const [id,field]of [['record-reading-start','readingStart'],['record-reading-end','readingEnd']]as const){const b=$('#'+id);if(b)b.onclick=()=>{hypothesis[field]=Math.floor(time);recorded[field]=true;validated=false;log(`record:${field}`);notify(`טווח הקריאה נרשם: ${stamp(hypothesis.readingStart)}–${stamp(hypothesis.readingEnd)}`);b.classList.add('recorded');sync();};}
  const moment=$('#record-moment');if(moment)moment.onclick=()=>{hypothesis.eventTime=Math.floor(time);recorded.moment=true;validated=false;log('record-opening-moment');notify(`רגע הפתיחה שסימנתם: ${stamp(hypothesis.eventTime)}. אפשר לבדוק אותו בשעון התחנה.`);moment.textContent='✓ שעת הפתיחה נשמרה';sync();};
  const test=$('#test-at-clock');if(test)test.onclick=testReconstruction;
}
function read(e:Evidence){if(!facts.includes(e.id)){facts.push(e.id);known.push(e);log(`read:${e.id}`,true);}showPanel(`<div class="eyebrow" dir="ltr">WITNESS ACCOUNT</div><h2>${e.speaker==='The porter'?'הסבל':e.speaker==='The painter'?'הציירת':e.speaker==='The attendant'?'עובדת התחנה':'העדה'}</h2><p class="reading-task">${['porter-account','porter-carry','porter-window'].includes(e.id)?'קראו: מה הייתה הפעולה בעיצומה? בחרו אותה למטה ושמרו.':e.id==='visitor-account'?'חפשו בעדות שעה ושם של מזוודה או עגלה. תצטרכו אותם בשחזור.':'קראו איזה פרט נוסף מתגלה בתשובה.'}</p><p class="english" lang="en" dir="ltr">“${words(e.text)}”</p><div id="gloss">לחצו על מילה מסומנת לפירוש</div><div class="record-tools">${['porter-account','porter-carry','porter-window'].includes(e.id)?`<label>מה הדמות עשתה באותו זמן? <select id="source-activity" dir="ltr">${activityOptions()}</select></label><button id="record-activity">לשמור את הפעולה</button>`:''}${c.id===2&&e.id==='visitor-account'?`<p>סמנו את גבולות הקריאה בעזרת ציר הזמן.</p><div class="panel-actions"><button id="record-reading-start">התחלה · <b data-current-time>${stamp(time)}</b></button><button id="record-reading-end">סיום · <b data-current-time>${stamp(time)}</b></button></div>`:''}</div><div class="panel-actions"><button id="listen">◖ האזנה חוזרת</button><button id="done-reading" class="primary">סיום קריאה ←</button></div><small>הזמן עצור בזמן הקריאה. ההאזנה תלויה בקול אנגלי מקומי בדפדפן.</small>`,'dialogue');wireWords();wireRecords();$('#done-reading').onclick=closePanel;$('#listen').onclick=()=>{const speech=window.speechSynthesis;if(!speech){$('#gloss').textContent='אין קול מקומי זמין; אפשר לקרוא את הטקסט.';return;}speech.cancel();const voices=speech.getVoices().filter(v=>v.localService&&/^en/i.test(v.lang));if(!voices.length){$('#gloss').textContent='אין קול אנגלי מקומי זמין בדפדפן זה. הטקסט נשאר כאן לקריאה.';return;}const utterance=new SpeechSynthesisUtterance(e.text);utterance.voice=voices[0];utterance.rate=.85;speech.speak(utterance);log('audio');};}
function speakTo(w:'porter'|'visitor'){const ev=evidenceFor(c,w);if(ev.length===1){read(ev[0]);return;}showPanel(`<div class="eyebrow" dir="ltr">A QUESTION OPENS A VIEWPOINT</div><h2>מה תרצו לברר?</h2><p>לכל שאלה יש תשובה אחרת. אפשר לחזור ולשאול.</p><div class="questions">${ev.map((e,i)=>`<button data-question="${i}" dir="ltr" lang="en">${esc(e.question!)} ${facts.includes(e.id)?'✓':''}</button>`).join('')}</div>`,'questions');document.querySelectorAll<HTMLButtonElement>('[data-question]').forEach(b=>b.onclick=()=>read(ev[+b.dataset.question!]));}
function targetPanel(t:Target){
  selected=t.id;paused=true;
  if(t.id==='porter'||t.id==='visitor'){speakTo(t.id);return;}
  if(t.id.startsWith('vessel-')){const v=c.vessels.find(v=>`vessel-${v.id}`===t.id)!;showPanel(`<div class="eyebrow" dir="ltr">LUGGAGE TAG</div><h2>${c.id>=4?'עגלה':'מזוודה'}</h2><div class="luggage-tag" dir="ltr">${esc(v.label)}</div><p>שתי תוויות, שתי זהויות. איזו מהן מופיעה בעדות?</p><button id="mark-vessel" class="primary">לסמן את ${esc(v.label)} בשחזור</button>`,'vessel');$('#mark-vessel').onclick=()=>{hypothesis.vessel=v.id;recorded.vessel=true;validated=false;log(`mark:${v.id}`);closePanel();notify(`התווית ${v.label} נרשמה בהשערה.`);};return;}
  if(t.id==='clock'){
    showPanel(`<div class="eyebrow" dir="ltr">REPLAY MECHANISM</div><h2>שעון השחזור</h2><p>גררו את הידית בציר הזמן שבתחתית המסך לשעת הפתיחה שמצאתם בעדות. אחר כך שמרו את השעה כאן.</p><div class="world-record"><b data-current-time dir="ltr">${stamp(time)}</b><button id="record-moment">לשמור כשעת הפתיחה</button></div><p>פעולה: <bdi data-saved-activity>${recorded.activity?esc(hypothesis.activity):'טרם נשמרה פעולה'}</bdi><br>רגע שסומן: <bdi data-saved-moment>${recorded.moment?stamp(hypothesis.eventTime):'טרם נשמר'}</bdi> · תווית: <bdi>${hypothesis.vessel||'—'}</bdi></p><button id="test-at-clock" class="primary">לבדוק את השחזור בעולם ▶</button>${c.id===4?`<p>בבסיס השעון ${time>=c.latchFrom?'מונח מפתח פליז.':'אין כרגע מפתח.'}</p><button id="take-key" ${time<c.latchFrom||!facts.includes('porter-key')?'disabled':''}>לאסוף מפתח</button>`:''}`,'clock');
    wireRecords();if(c.id===4)$('#take-key').onclick=()=>{hasKey=true;log('take-key',true);closePanel();notify('מפתח הפליז נאסף. אפשר להשתמש בו בבריח.');};return;
  }
  const isObject=t.id==='object';const world=worldAt(c,time,interventions);
  const title=isObject?(c.object==='bird'?'ציפור השעון':'פנס הפסטיבל'):t.id==='window'?'תריס החצר':'דלת הצד';
  showPanel(`<div class="eyebrow" dir="ltr">${mode==='replay'?'CHANGE THE LOOP':'OBSERVE THE PAST'} · ${stamp(time)}</div><h2>${title}</h2><p>${isObject?(world.object==='shelf'?'החפץ מונח על המדף. אפשר לקבע אותו לפני שהרוח מגיעה.':world.object==='secured'?'החפץ מקובע ובטוח.':'המדף ריק. העבר עוד ניתן לשינוי.'):(world.opened&&t.id===c.opening?'הפתח פתוח. הבריח נתפס רק כשהפתח סגור; כאן אפשר להפעיל רק את הבריח.':'בריח מכני יכול למנוע פתיחה. נסו אותו כשהמנגנון משתחרר.')}</p>
  ${mode!=='replay'?`<div class="world-record"><b data-current-time dir="ltr">${stamp(time)}</b><button id="record-moment">לשמור כשעת הפתיחה</button></div><button id="begin-replay" class="primary">להתחיל לולאה לשינוי ↻</button>`:`<button id="physical-action" class="primary">${isObject?(world.saved&&time>=c.gust?'לאסוף ולהחזיר לפסטיבל':'לקבע את החפץ למדף'):'לנעול את הבריח'}</button>`}
  ${mode==='replay'&&world.saved&&time<c.gust?'<small>כדי לבדוק שהשינוי עבד, העבירו את הזמן מעבר לרוח ואז חזרו לאסוף.</small>':''}`,'interact');
  wireRecords();if(mode!=='replay')$('#begin-replay').onclick=()=>{closePanel();beginReplay();};else $('#physical-action').onclick=()=>{closePanel();act(t.id);};
}
function act(id:string){
  expose('attempt');
  const w=worldAt(c,time,interventions);
  if(id==='object'&&w.saved&&time>=c.gust){recovered=true;physicalSaves++;log('recover',true);if(validated)win();else notify('החפץ הוחזר! כדי להשלים את המקרה, חברו גם את העדויות במחברת.');return;}
  const kind:Intervention['kind']=id==='object'?'secure':id==='window'?'latch-window':'latch-door';
  if(c.id===4&&kind==='latch-window'&&!hasKey){notify('הבריח נעול. מי יודע איפה המפתח?');log('locked-latch');return;}
  const i={kind,time};interventions.push(i);
  if(interventionWorks(c,i)){sound('bell');notify(kind==='secure'?'החפץ קובע למדף. קדמו את הזמן ובדקו את השינוי.':'הבריח ננעל. קדמו את הזמן ובדקו מה קורה לרוח.');log(`intervene:${kind}`,true);}else{retries++;unaided=false;sound('fail');notify(kind==='secure'?'מאוחר מדי — המדף כבר ריק. אפשר להחזיר את הזמן ולנסות שוב.':id!==c.opening?'הבריח ננעל כאן. האם זה הפתח שעליו דיברו העדים?':time<c.latchFrom?'המנגנון עדיין תפוס. נסו שוב אחרי שהגלגל משתחרר.':'הפתיחה כבר התרחשה. צריך לשנות רגע מוקדם יותר.');log(`intervene:${kind}`,false);}
  sync();
}
function beginReplay(){mode='replay';time=0;paused=true;interventions=[];recovered=false;hasKey=false;loop++;station.playerDestination=null;log('replay');notify('לולאה לשינוי: זזו בזמן ובמרחב. בדקו חפץ כדי לפעול ברגע שבחרתם.',8);sync();}
function showNotebook(){
  const readCount=(facts.some(f=>f.startsWith('porter-'))?1:0)+(facts.includes('visitor-account')?1:0);
  showPanel(`<div class="eyebrow" dir="ltr">RECONSTRUCTION · ${readCount}/2 VIEWPOINTS</div><h2>מה קרה באותו רגע?</h2>
  <div class="evidence-list">${known.length?known.map(e=>`<button class="saved-evidence" data-evidence="${e.id}"><span dir="ltr">${esc(e.speaker)}</span> <span>↗</span></button>`).join(''):'<p>בדקו את הדמויות כדי לשמוע עדויות.</p>'}</div>
  <p class="hypothesis-summary">פעולה: <bdi data-saved-activity>${recorded.activity?esc(hypothesis.activity):'טרם נשמרה פעולה'}</bdi><br>רגע הפתיחה: <bdi data-saved-moment>${recorded.moment?stamp(hypothesis.eventTime):'טרם נשמר'}</bdi> · תווית: <bdi>${hypothesis.vessel||'—'}</bdi></p><button id="go-clock" class="primary">לגשת לשעון ולבדוק ←</button><details id="detailed-edit"><summary>עריכה מפורטת של ההשערה</summary><label>מה היה בעיצומו?<select id="hyp-activity" dir="ltr"><option value="reading">reading</option><option value="carrying boxes">carrying boxes</option><option value="moving the ladder">moving the ladder</option><option value="finished carrying boxes">finished carrying boxes</option></select></label>
  <label>רגע פתיחת ${c.opening==='window'?'החלון':'הדלת'} <output id="hyp-output" dir="ltr">${stamp(hypothesis.eventTime)}</output><input id="hyp-time" type="range" min="0" max="59" step="1" value="${hypothesis.eventTime}"></label>
  ${c.id===2?`<fieldset><legend>טווח הקריאה של העדה</legend><label>תחילת הקריאה <input id="reading-start" type="number" min="0" max="59" value="${hypothesis.readingStart}"></label><label>סיום הקריאה <input id="reading-end" type="number" min="1" max="60" value="${hypothesis.readingEnd}"></label></fieldset>`:''}
  <div class="identity-row">תווית החפץ שנבחרה: <b dir="ltr">${hypothesis.vessel||'—'}</b><small>משנים באמצעות בדיקת מזוודה / עגלה במרחב.</small></div>
  <button id="test-reconstruction" class="primary">להריץ את השחזור ▶</button></details><small>השערה שגויה צורכת ניסיון. אפשר לערוך ולחזור לבדוק את העדויות.</small>`,'notebook');
  $('#hyp-activity').setAttribute('aria-label','הפעילות שהייתה בעיצומה');($('#hyp-activity')as HTMLSelectElement).value=hypothesis.activity;
  $('#hyp-activity').onchange=()=>{hypothesis.activity=($('#hyp-activity')as HTMLSelectElement).value;recorded.activity=true;validated=false;sync();};
  $('#hyp-time').oninput=()=>{hypothesis.eventTime=+($('#hyp-time')as HTMLInputElement).value;$('#hyp-output').textContent=stamp(hypothesis.eventTime);recorded.moment=true;validated=false;sync();};
  if(c.id===2){$('#reading-start').onchange=()=>{hypothesis.readingStart=+($('#reading-start')as HTMLInputElement).value;recorded.readingStart=true;validated=false;sync();};$('#reading-end').onchange=()=>{hypothesis.readingEnd=+($('#reading-end')as HTMLInputElement).value;recorded.readingEnd=true;validated=false;sync();};}
  document.querySelectorAll<HTMLButtonElement>('[data-evidence]').forEach(b=>b.onclick=()=>read(known.find(e=>e.id===b.dataset.evidence)!));
  $('#test-reconstruction').onclick=testReconstruction;$('#go-clock').onclick=()=>{closePanel();go(station.targets.find(t=>t.id==='clock')!);};
}
function testReconstruction(){
  const result=checkReconstruction(c,hypothesis,facts);if(result.kind==='missing'){notify(result.message);return;}
  if(attempts>0)unaided=false;attempts++;expose('attempt');log('test-reconstruction',result.ok);closePanel();
  trial={end:Math.min(60,hypothesis.eventTime+4),result,returnMode:mode==='replay'?'replay':'explore'};
  mode='testing';time=Math.max(0,hypothesis.eventTime-3);paused=false;
  notify(`הקלטת הלולאה המקורית · הרגע שסימנתם: ${stamp(hypothesis.eventTime)}. צפו במרחב ובפעולות שחופפות לו.`,8);sync();
}
function finishTrial(){
  if(!trial)return;const {result,returnMode}=trial;trial=null;mode=returnMode;paused=true;
  if(result.ok){validated=true;languageWins++;sound('success');if(recovered){win();return;}if(mode!=='replay')beginReplay();notify('שתי העדויות מתחברות. עכשיו שנו את הלולאה והחזירו את החפץ.',8);}
  else{if(result.kind==='activity')recorded.activity=false;if(result.kind==='time')recorded.moment=false;if(result.kind==='identity')recorded.vessel=false;if(result.kind==='overlap'){recorded.readingStart=false;recorded.readingEnd=false;}retries++;unaided=false;sound('fail');const evidence=known.find(e=>e.id===result.fact)??known[0];showPanel(`<div class="eyebrow" dir="ltr">THE REPLAY CONTRADICTS A FACT</div><h2>הסיפור עדיין לא מתחבר</h2><p>${result.message}</p><p class="english" lang="en" dir="ltr">“${esc(evidence?.text??'')}”</p><p>כל עד ראה חלק. אפשר לחזור לרגע אחר ולבדוק שוב.</p><div class="panel-actions"><button id="retry-world" class="primary">לחזור לחקירה ↶</button><button id="edit-again">לעיין בעדויות</button></div>`,'contradiction');$('#edit-again').onclick=showNotebook;$('#retry-world').onclick=()=>{closePanel();time=hypothesis.eventTime;sync();};}
  sync();
}
function win(){if(levelCompleted)return;levelCompleted=true;toHost({type:'level-complete',level:c.id,durationMs:Math.max(0,Math.round(performance.now()-levelStartedAt))});expose('complete');mode='won';paused=true;sound('success');log('chapter-complete',true);showPanel(`<div class="eyebrow" dir="ltr">LOOP REWRITTEN · CASE ${c.id}/5</div><h2>${c.object==='bird'?'הציפור חזרה לפסטיבל':'האור חזר לתחנה'} ✦</h2><p>${c.feedback}</p><div class="result-line"><span>פעולה במרחב <b>✓</b></span><span>חיבור עדויות <b>✓</b></span></div><p>${unaided&&retries===0&&hints===0?'נפתר בלי רמז לפתרון או ניסיון שגוי.':'נפתר בעזרת בדיקה חוזרת. הידע נשאר ללולאה הבאה.'}</p><button id="next-case" class="primary">${chapter===4?'לסיים את המסע':'למקרה הבא'} ←</button>`,'win');$('#next-case').onclick=()=>{closePanel();if(chapter<4){chapter++;setup();notify(c.objective,8);}else{mode='finished';showPanel(`<div class="eyebrow" dir="ltr">THE STATION REMEMBERS</div><h2>חמישה מקרים. עולם אחד השתנה.</h2><p>חיברתם נקודות מבט באנגלית, בדקתם מה חפף ומה הושלם, ושיניתם את התוצאה בתוך התחנה.</p><p>האירועים נשמרים במכשיר הזה בלבד. הביצוע במשחק אינו מדידה של רמת אנגלית.</p><button id="play-again" class="primary">מסע חדש ↻</button>`,'finish');$('#play-again').onclick=()=>{chapter=0;closePanel();setup();};}};}
function setup(){trial=null;c=CASES[chapter];mode='explore';time=10;paused=true;facts=[];known=[];hypothesis=newHypothesis(c);recorded=emptyRecords();validated=false;interventions=[];recovered=false;hasKey=false;attempts=0;retries=0;hints=0;unaided=firstDecision(exposure,c.id);selected=null;pending=null;loop=1;station.configure(c);station.reduced=reduced;sync();log('chapter-start');hostLevelStart();}
function sync(){
  needsRender=true;
  document.querySelectorAll<HTMLElement>('[data-current-time]').forEach(el=>el.textContent=stamp(time));
  document.querySelectorAll<HTMLElement>('[data-saved-activity]').forEach(el=>el.textContent=recorded.activity?hypothesis.activity:'טרם נשמרה פעולה');
  document.querySelectorAll<HTMLElement>('[data-saved-moment]').forEach(el=>el.textContent=recorded.moment?stamp(hypothesis.eventTime):'טרם נשמר');
  $('#chapter').textContent=`CASE ${c.id} / 5 · ${c.englishTitle}`;$('#case-title').textContent=c.title;$('#objective').textContent=c.object==='bird'?'המטרה: להחזיר את ציפור השעון לפסטיבל.':'המטרה: להחזיר את הפנס לתחנה.';$('#game').dataset.mode=mode;syncGuide();
  $('#time').innerHTML=`${stamp(time)}<small>LOOP ${loop.toString().padStart(2,'0')}</small>`;($('#timeline')as HTMLInputElement).value=String(Math.floor(time));$('#play').textContent=paused?'▶':'Ⅱ';$('#play').setAttribute('aria-label',paused?'להפעיל זמן':'לעצור זמן');
  $('#fact-count').textContent=`${(facts.some(f=>f.startsWith('porter-'))?1:0)+(facts.includes('visitor-account')?1:0)}/2`;
  $('#mode-label').textContent=mode==='replay'?(validated?'שחזור עקבי · משנים את הלולאה':'שינוי פיזי · השחזור עדיין חסר'):mode==='testing'?'הקלטת הלולאה המקורית':mode==='won'?'הלולאה השתנתה':'חקירת העבר';
  const p=$('#porter-track');p.style.left=`${c.carrying[0]/60*100}%`;p.style.width=`${(c.carrying[1]-c.carrying[0])/60*100}%`;p.style.opacity=facts.some(f=>f.startsWith('porter-'))?'1':'0';
  const v=$('#visitor-track');v.style.left=`${c.reading[0]/60*100}%`;v.style.width=`${(c.reading[1]-c.reading[0])/60*100}%`;v.style.opacity=c.id===2&&facts.includes('visitor-account')?'1':'0';
  const completed=mode==='won'||mode==='finished'||mode==='testing';$('#skip-test').hidden=mode!=='testing';for(const id of ['play','timeline','rewind','notebook','replay','settings'])$('#'+id).toggleAttribute('disabled',completed&&(id!=='play'||mode!=='testing'));$('#hint').toggleAttribute('disabled',completed||c.transfer);$('#hint').title=c.transfer?'מקרה העברה ללא רמז לפתרון':'רמז לפתרון';
}
function syncGuide(){
  const w=worldAt(c,time,interventions);
  guide=nextStep(c,{facts,recorded,validated,mode,saved:w.saved,afterGust:time>=c.gust});
  $('#guide').hidden=Boolean(panel)||['intro','testing','won','finished'].includes(mode);
  const signature=JSON.stringify(guide);if(signature===guideSignature)return;guideSignature=signature;
  $('#guide-phase').textContent=['שלב 1 · אוספים עדויות','שלב 2 · בודקים מה קרה','שלב 3 · מצילים ומשנים'][guide.phase];
  $('#guide-title').textContent=guide.title;$('#guide-detail').textContent=guide.detail;$('#guide-action').textContent=guide.button;
}
function chooseDestination(ids:string[],title:string,detail:string){
  showPanel(`<div class="eyebrow">הצעד הבא בחקירה</div><h2>${title}</h2><p>${detail}</p><div class="questions">${station.targets.filter(t=>ids.includes(t.id)).map(t=>`<button data-destination="${esc(t.id)}">${esc(t.label)} ←</button>`).join('')}</div>`,'destinations');
  document.querySelectorAll<HTMLButtonElement>('[data-destination]').forEach(b=>b.onclick=()=>{const target=station.targets.find(t=>t.id===b.dataset.destination);closePanel();if(target)go(target);});
}
function showHelp(){
  showPanel(`<div class="eyebrow" dir="ltr">HOW TO PLAY</div><h2>איך מחזירים את ${c.object==='bird'?'הציפור':'הפנס'}?</h2><ol class="help-steps"><li><b>שומעים שני עדים.</b><p>לחצו על דמות כדי ללכת אליה. קראו באנגלית ושמרו את הפעולה בעדות.</p></li><li><b>מספרים מה קרה.</b><p>בחרו את המזוודה או העגלה לפי השם בעדות. גררו את ציר הזמן לשעת הפתיחה, שמרו אותה בשעון ובדקו.</p></li><li><b>משנים את העבר.</b><p>אחרי שהסיפור מתחבר, בצעו פעולה בעולם. בדקו שהחפץ ניצל ואז אספו אותו.</p></li></ol><p>אפשר לנוע גם כשהזמן עצור. קריאה עוצרת את השעון, וכל בחירה ניתנת לתיקון.</p><button id="back-to-case" class="primary">בחזרה לצעד הבא ←</button>`,'help');
  $('#back-to-case').onclick=closePanel;
}
$('#guide-help').onclick=showHelp;
$('#guide-action').onclick=()=>{
  if(!guide||panel)return;
  if(guide.action==='visit'){const target=station.targets.find(t=>t.id===guide?.target);if(target)go(target);}
  else if(guide.action==='luggage')chooseDestination(c.vessels.map(v=>'vessel-'+v.id),'איזה שם הופיע בעדות?','בחרו תווית לבדיקה. שום בחירה לא נשמרת עד שתבדקו את החפץ ותלחצו לשמירה.');
  else if(guide.action==='changes')chooseDestination(['object','window','door'],'מה תרצו לבדוק?','בחרו חפץ או מנגנון. אתם קובעים איזו פעולה לבצע ובאיזה רגע.');
  else if(guide.action==='replay')beginReplay();
  else if(guide.action==='outcome'){time=Math.max(time,c.gust+1);paused=true;log('observe-change');sync();notify('הרוח כבר עברה. בדקו במרחב אם החפץ נשאר בטוח.');}
};
function go(t:Target){if(panel||mode==='intro'||mode==='won'||mode==='finished'||mode==='testing')return;selected=t.id;if(station.player.position.distanceTo(t.position)<(t.id.startsWith('vessel-')?2.35:1.65)){targetPanel(t);return;}pending=t.id;station.moveTo(station.approach(t));}
function nearest(){
  const available=station.targets.filter(t=>!(t.id==='object'&&!station.bird.visible));
  const focused=available.find(t=>t.id===selected);
  if(focused&&station.player.position.distanceTo(focused.position)<(focused.id.startsWith('vessel-')?2.35:1.8))return focused;
  return available.sort((a,b)=>station.player.position.distanceTo(a.position)-station.player.position.distanceTo(b.position))[0];
}
function interactionLabel(t:Target){
  if(mode!=='replay')return t.label;
  if(t.id==='window'||t.id==='door')return 'לנעול את הבריח';
  if(t.id==='object'){const w=worldAt(c,time,interventions);return w.saved&&time>=c.gust?'לאסוף ולהחזיר':'לקבע למדף';}
  return t.label;
}
function drawHotspots(){
  const el=$('#hotspots'),nearRoot=$('#nearest');
  if(mode==='intro'||panel||mode==='won'||mode==='finished'||mode==='testing'){el.replaceChildren();nearRoot.replaceChildren();return;}
  const visible=new Set<string>();
  for(const t of station.targets){
    if(t.id==='object'&&!station.bird.visible)continue;
    const p=station.screen(t.position);if(p.x<10||p.x>innerWidth-10||p.y<70||p.y>innerHeight-140)continue;
    visible.add(t.id);let button=el.querySelector<HTMLButtonElement>(`[data-target="${t.id}"]`);
    if(!button){button=document.createElement('button');button.className='world-label';button.dataset.target=t.id;button.onclick=()=>{const target=station.targets.find(v=>v.id===t.id);if(target)go(target);};el.appendChild(button);}
    const close=station.player.position.distanceTo(t.position)<(t.id.startsWith('vessel-')?2.35:1.7);
    button.classList.toggle('near',close);button.classList.toggle('guided',guide?.target===t.id||(guide?.action==='luggage'&&t.id.startsWith('vessel-')));button.title=`לחצו כדי לגשת: ${t.label}`;button.style.left=`${p.x}px`;button.style.top=`${p.y}px`;button.setAttribute('aria-label',`בדיקת ${t.label}`);
    const label=close||t.id==='porter'||t.id==='visitor'||guide?.target===t.id||guide?.action==='luggage'&&t.id.startsWith('vessel-')?t.label:'';
    if(button.dataset.label!==label){button.dataset.label=label;button.innerHTML=`<span>◇</span>${esc(label)}`;}
  }
  el.querySelectorAll<HTMLButtonElement>('[data-target]').forEach(b=>{if(!visible.has(b.dataset.target!))b.remove();});
  const n=nearest();
  if(!n||station.player.position.distanceTo(n.position)>=(n.id.startsWith('vessel-')?2.35:1.8)){nearRoot.replaceChildren();return;}
  let near=nearRoot.querySelector<HTMLButtonElement>('button');
  if(!near){near=document.createElement('button');near.id='interact-near';near.onclick=()=>{const target=station.targets.find(t=>t.id===near!.dataset.target);if(!target)return;if(mode==='replay'&&['window','door','object'].includes(target.id)){selected=target.id;act(target.id);}else go(target);};nearRoot.appendChild(near);}
  near.dataset.target=n.id;near.textContent=`E · ${interactionLabel(n)}`;
}
$('#start').onclick=()=>{if(mode!=='intro')return;$('#intro').hidden=true;$('#start').blur();$('#world').focus();mode='explore';paused=true;sound('bell');log('start');hostLevelStart();notify('הזמן עצור. התחילו בכפתור ״ללכת אל הסבל״ — הוא יוביל אתכם לעדות הראשונה.',8);sync();};
$('#play').onclick=()=>{if(mode==='intro'||panel)return;paused=!paused;log(paused?'pause':'resume');sync();};
$('#timeline').oninput=()=>{if(mode==='intro')return;paused=true;time=+($('#timeline')as HTMLInputElement).value;interventions=interventions.filter(i=>i.time<=time);if(time<c.gust)recovered=false;sync();};
$('#rewind').onclick=()=>{if(mode==='intro')return;closePanel();if(mode==='replay')beginReplay();else{time=0;paused=true;loop++;sync();}};
$('#notebook').onclick=()=>{if(mode!=='intro')showNotebook();};$('#replay').onclick=()=>{if(mode!=='intro'){closePanel();beginReplay();}};
$('#skip-test').onclick=()=>{if(trial){time=trial.end;finishTrial();}};
$('#hint').onclick=()=>{if(mode==='intro'||c.transfer)return;hints++;unaided=false;expose('hint');paused=true;notify(c.hint,12);log('solution-hint');};
$('#settings').onclick=()=>showPanel(`<div class="eyebrow" dir="ltr">PAUSE · OPTIONS</div><h2>רגע לנשום</h2><button id="toggle-mute">${muted?'להפעיל':'להשתיק'} צלילים</button><button id="toggle-motion">${reduced?'להפעיל תנועה מלאה':'להפחית תנועה'}</button><button id="restart-case">להתחיל את המקרה מחדש</button><p>חצים / WASD לתנועה · E לבדיקה<br>רווח להפעלה ועצירה · R למחברת · F למסך מלא<br>בטלפון: לחצו על יעד או השתמשו בחצים.</p>`,'settings');
$('#panel').addEventListener('click',e=>{const id=(e.target as HTMLElement).id;if(id==='toggle-mute'){muted=!muted;(e.target as HTMLElement).textContent=muted?'להפעיל צלילים':'להשתיק צלילים';}if(id==='toggle-motion'){reduced=!reduced;station.reduced=reduced;(e.target as HTMLElement).textContent=reduced?'להפעיל תנועה מלאה':'להפחית תנועה';}if(id==='restart-case'){closePanel();setup();}});
$('#world').addEventListener('pointerdown',e=>{if(panel||mode==='intro')return;const pick=station.pick(e.clientX,e.clientY);if(pick?.target)go(pick.target);else if(pick){pending=null;selected=null;station.moveTo(pick.point);}});
window.addEventListener('keydown',e=>{
  const target=e.target as HTMLElement;
  const completed=mode==='won'||mode==='finished';
  if(e.code==='Escape'){
    if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});
    if(!completed)closePanel();paused=true;keys.clear();sync();return;
  }
  if(target.matches('input,select,textarea'))return;
  if((e.code==='Space'||e.code==='Enter')&&target.matches('button'))return;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  if(e.repeat)return;
  if(e.code==='KeyF'){
    if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});
    else void $('#game').requestFullscreen().catch(()=>notify('מסך מלא אינו זמין בדפדפן הזה.'));
    return;
  }
  if(mode==='intro'||completed)return;if(mode==='testing'){if(e.code==='Space'){paused=!paused;sync();}return;}
  if(e.code==='KeyR'){panel?closePanel():showNotebook();return;}
  if(panel)return;
  if(e.code==='Space'){paused=!paused;sync();}
  else if(e.code==='KeyE'){const n=nearest();if(n&&station.player.position.distanceTo(n.position)<(n.id.startsWith('vessel-')?2.35:1.8)){if(mode==='replay'&&['window','door','object'].includes(n.id)){selected=n.id;act(n.id);}else go(n);}}
  else{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))selected=null;keys.add(e.code);}
});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{paused=true;keys.clear();sync();});document.addEventListener('visibilitychange',()=>{if(document.hidden){paused=true;keys.clear();sync();}});
document.querySelectorAll<HTMLButtonElement>('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();keys.add(b.dataset.key!);b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key!);});
function resize(){needsRender=true;station.resize(innerWidth,innerHeight);drawHotspots();}window.addEventListener('resize',resize);
let lastHotspot=0;
function update(dt:number,render=true){
  if(!paused&&!panel&&mode!=='intro'&&mode!=='won'&&mode!=='finished'){const before=time;time=Math.min(60,time+dt*(mode==='testing'?2:1));if(Math.floor(time)!==Math.floor(before)){sync();if(Math.floor(time)===c.bell)sound('bell');}if(trial&&time>=trial.end){time=trial.end;finishTrial();}else if(time>=60){paused=true;notify(worldAt(c,time,interventions).saved?'השינוי עבד. חזרו למדף לאסוף את החפץ.':'העגלה יצאה. אפשר לגרור את הזמן לאחור ולנסות לולאה חדשה.');sync();}}
  station.update(dt,time,mode==='testing'?[]:interventions,keys,!panel&&mode!=='intro'&&mode!=='won'&&mode!=='finished'&&mode!=='testing',render);if(recovered&&mode!=='testing')station.bird.visible=false;
  if(pending&&!panel){const t=station.targets.find(t=>t.id===pending);if(t&&station.player.position.distanceTo(t.position)<(t.id.startsWith('vessel-')?2.35:1.7)){pending=null;station.playerDestination=null;targetPanel(t);}}
}
function frame(now:number){
  const rawDt=Math.max(0,(now-last)/1000);last=now;
  const active=(!paused&&!panel&&mode!=='intro'&&mode!=='won'&&mode!=='finished')||keys.size>0||Boolean(station.playerDestination);
  const shouldRender=needsRender||active;
  const elapsed=Math.min(rawDt,1);const count=Math.max(1,Math.ceil(elapsed/.05));
  for(let i=0;i<count;i++)update(elapsed/count,false);
  if(shouldRender){station.renderer.render(station.scene,station.camera);renderedFrames++;needsRender=false;}
  if(active){frames++;frameSeconds+=rawDt;if(frameSeconds>1){fpsSamples.push(Math.round(frames/frameSeconds));fpsSamples=fpsSamples.slice(-20);frames=0;frameSeconds=0;}}else{frames=0;frameSeconds=0;}
  if(now-lastHotspot>160){drawHotspots();lastHotspot=now;}
  if(noticeUntil&&now>noticeUntil){$('#notice').classList.remove('visible');noticeUntil=0;}
  requestAnimationFrame(frame);
}
window.advanceTime=(ms:number)=>{const n=Math.max(1,Math.ceil(ms/16.6667));for(let i=0;i<n;i++)update(ms/n/1000,false);station.renderer.render(station.scene,station.camera);renderedFrames++;sync();needsRender=false;drawHotspots();};
window.render_game_to_text=()=>JSON.stringify({mode,chapter:c.id,time:Math.round(time*100)/100,paused,panel,objective:c.objective,coordinateSystem:'x east/right; y up; z south/front; world floor y=0',player:{x:+station.player.position.x.toFixed(2),z:+station.player.position.z.toFixed(2)},selectedTarget:selected,guidance:guide,recordedClues:recorded,targets:station.targets.map(t=>({id:t.id,label:t.label,x:+t.position.x.toFixed(1),z:+t.position.z.toFixed(1),screen:station.screen(t.position)})),facts,knownAccounts:known.map(e=>({id:e.id,text:e.text})),hypothesis,validated,interventions,world:worldAt(c,time,mode==='testing'?[]:interventions),testing:trial?{end:trial.end,chosenMoment:hypothesis.eventTime}:null,recovered,hasKey,attempts,retries,hints,unaided,physicalSaves,languageWins,notice:noticeText,loadedModels:station.loadedModels,modelAnimations:station.modelClips,modelDetails:station.modelDetails,liveModels:station.modelState(),fpsAverage:fpsSamples.length?Math.round(fpsSamples.reduce((a,b)=>a+b,0)/fpsSamples.length):null,renderedFrames,visiblePastTrails:station.trails.visible?station.trails.children.filter(o=>o.visible).length:0,fpsScope:'active rendered frames over wall time, paused idle excluded',previousExposure:exposure[c.id]??null,roles:{primary:c.actor,observer:c.observer,opener:c.opener},localOnlyEvents:events.slice(-8)});
unaided=firstDecision(exposure,c.id);station.configure(c);resize();sync();requestAnimationFrame(frame);
const requestedLevel=parseLevelParam(location.search,CASES.length);
if(requestedLevel!==null){chapter=requestedLevel;$('#intro').hidden=true;setup();$('#world').focus();}
// Tell the network player we are ready only after both local models mount.
void fetch(import.meta.env.BASE_URL+'models/asset-status.json').then(async response=>{
  if(!response.ok)throw new Error('Asset manifest unavailable');
  const manifest=await response.json();
  if(!manifest?.runtime?.porter||!manifest?.runtime?.bird)throw new Error('Asset manifest incomplete');
  await Promise.all([
    station.loadAsset(manifest.runtime.porter,station.porter,1.8,'porter'),
    station.loadAsset(manifest.runtime.bird,station.bird,.6,'bird')
  ]);
  sync();markHostReady();
}).catch(error=>{console.error('Station asset loading failed',error);postToHost({type:'error',message:'The station models did not load. Reload the game to try again.'});});
