# Clockwork Alibi — תעלומת שעון התחנה

Read COMMON.md first. Your repo: `/Users/acedzn/dev/AceDZN-exp/clockwork-alibi`. Dev 5202, preview 4202. Public origin is AceDZN/clockwork-alibi; verify. You own this game only. Build in this chat, with two helper agents and screenshot-first/Chrome-Tripo workflow.

## The game

A compact time-loop detective toy set in a fantastical railway station. The clockwork festival bird has vanished. Player verbs: explore, observe, scrub, replay, connect accounts, test reconstruction, intervene. Players reconstruct the event from partial English accounts and spatial tracks, then make one physical intervention at the correct moment to change the outcome. Knowledge persists; the world loops. No combat, deaths or adult themes. Source mechanics: The Sexy Brutale (552590) and Outer Wilds (753640). Pair cosine .334, relatedness passes shared-tag rule; centroid NN .817, isolation 13.3%. This is seed evidence, not a novelty or market claim.

First minute: walk to a clockwork witness; pause and read “While I was carrying boxes, the musician opened the window.” Scrub a visible 60-second clock; investigate a partly occluded room; establish the carrying interval and window event; replay a test reconstruction and see a gust move the bird. A second witness identifies the suitcase that caught it. You must combine accounts to learn what happened offscreen. Then shut a shutter before the gust in the replay and recover the bird. Wrong reconstructions visibly contradict a witness fact and stay editable. The objective is evidence-consistent cause and recovery, not accusing an NPC.

## Visual identity

Teal-painted iron, midnight-blue stone, ivory clock faces, amber window light and subtle copper. A detailed compact station cross-section with three rooms, deep shadowed portals and a cutaway roof; elevated 3/4 camera, not a flat dashboard. Scrubbing creates translucent trails and clockwork motion. Art is miniature mechanical theater, distinct from the kitchen and outdoor raccoon heist. Main canvas ≥80% of view. Bottom timeline is narrow; witness English appears near the speaker or in one small notebook panel, no board of many cards. World and temporal cause are the centerpiece.

## Exact curriculum

Grade 8 chapter 2:

- https://english.workbook.co.il/grade-8/chapter-2/when-stories-intersect
- https://english.workbook.co.il/grade-8/chapter-2/events-and-past-questions
- https://english.workbook.co.il/grade-8/chapter-2/feelings-motives-and-sequence

Snapshots are in docs/curriculum. Main learning: completed event versus ongoing background; overlapping actions; chronological evidence, person/object identity and the limits of a witness's viewpoint. **When is not a tense selector by itself.** While connects overlapping activity, not necessarily cause. A temporal relationship does not establish intention. The Workbook intersecting-story source itself contains an inconsistent Noga/Noor name; our original fixtures must have stable identities and must not reproduce that inconsistency. No deliberate liar mechanic: different witnesses can both be accurate about limited facts.

## World truth and content specification

Use one authoritative deterministic simulation event table. Every witness statement and visual trail must derive from that same table. Suggested first-case truth, in loop seconds:

- Porter carries boxes in west hall from t=10 to t=30.
- Musician opens courtyard window at t=20.
- Gust moves the clockwork bird from shelf into the **open blue suitcase** at t=22.
- Visitor is reading in the waiting room from t=15 to t=35; not carrying boxes.
- Trolley takes the blue suitcase from the platform at t=40.

The player must determine which suitcase and the relevant window action, then close the window between t=15 and t=20 (or secure the bird beforehand if your puzzle explicitly allows that). A second allowed intervention is a good player-choice reward when consistent; don't invalidate physically valid solutions to force one sentence. Controls must expose pause/scrub/replay and physical interaction. Event “opened” is an instant; “was carrying” spans time. Scrubbing outside a witnessed room does not reveal all offscreen events and remove the need for reading. A reconstruction requires at least two independent facts; do not give full information via colored correctness checks.

## Five authored case chapters

1. **A moment inside an action.** One ongoing action and an event: porter carrying at t=20, window opens. Guided explore/scrub/test and recover bird. First complete tutorial loop, 60–90 seconds.
2. **While.** Porter carries while visitor reads; put both intervals on the same period. Sequence-only reconstruction cannot explain two observed locations at the bell. Two visible tracks, one textual offscreen fact.
3. **Before and after.** Recover the right suitcase using event order and stable identity. Two similar cases/containers; color alone is insufficient. A stated label or owner resolves it. Witnesses tell partial consistent truths.
4. **Ask a useful question.** Choose a complete question to a witness, e.g. “What were you carrying when the bell rang?” versus “Who opened the window?” Each question reveals the relevant different fact; no multiple-choice right/wrong gate. Use answers to make a viable intervention. Include an irregular past verb in an original account, not an isolated verb quiz.
5. **Transfer incident.** New short case: a lantern, a curtain and a painter. “While the painter was moving a ladder, the visitor opened the side door.” A gust moved the lantern into a cart; actual timing/layout/identities differ. No solution hints or repeated fixed timeline. Require two facts and a physical intervention. Test that the old action/number cannot win.

Each chapter is about one relationship with 1–3 short sentences; five chapters collectively target 6–10 minutes, not five 10-minute mysteries. Scope down animation detail before cutting temporal interaction. Keep all content original and review the English for natural phrasing. Reviewer can adjust truth and fixtures together.

## Tripo plan

In your own Chrome tab, search owned assets first. Up to three new generations: (1) original clockwork porter, humanoid neutral A pose, **rig** for walk/carry; (2) distinctive clockwork bird prop; (3) old station clock/suitcase prop if an owned asset cannot serve. Build accurate architecture/timeline procedurally. A Tripo station clock from another active project is not automatically available to overwrite or modify; use a copy with recorded provenance if the owned asset is appropriate. Full-body character animation requires actual Tripo rig/animations. No facial rig needed for text speech. Record assets and displayed credits in ASSETS.md; no purchases.

Character prompt: “Clockwork Alibi original clockwork railway porter, single full-body slender friendly brass-and-teal humanoid automaton, ivory faceplate, railway vest, articulated arms and sturdy boots, neutral A pose with hands empty and separated, stylized miniature mechanical theater game asset, no platform no background props no text, clean animation-ready geometry.”

## Generate the target before implementation

Built-in imagegen, using the provided skill. Save prompt(s) and copies in docs/visual-targets.

> Use case: ui-mockup. Asset type: gameplay design target for an actual browser 3D time-loop mystery. Create a believable 16:9 in-game frame of Clockwork Alibi. Elevated three-quarter camera looking into a miniature cutaway railway station with a waiting room, luggage platform, window and clock tower mechanism. Teal iron pillars, midnight blue stone, ivory clock dials, copper gears and amber afternoon light. A brass clockwork porter is halfway along the hall carrying two boxes, leaving a faint translucent movement trail. At the side, a musician has just opened a tall window; a small mechanical bird is tipping toward an open blue suitcase. The spatial cause should be clear but other rooms remain partially occluded. A slim bottom timeline shows “00:20”, play/pause and a draggable ivory hand with two overlapping action tracks. One compact witness caption reads exactly “While I was carrying boxes, the musician opened the window.” Tiny upper-right text reads “CASE 1 · THE MISSING BIRD”. Polished achievable Three.js game render, deep actual 3D spaces, tactile mechanical props, world occupies at least 80 percent of the frame. No title screen, browser frame, card dashboard, grammar gaps or quiz answers. This is a functional gameplay frame with the investigation and time tool visible, not concept key art.

Second target if useful: the same scene at t=40 after a test reconstruction, a ghost trail leading the wrong suitcase to the trolley and a small contradiction marker tied to a quoted fact. Preserve identity/camera/UI. In implementation, ensure the screenshot does not disclose all answers continuously; target is one reveal state, not default visibility.

## Acceptance

Actual walk/inspect and deterministic time scrubbing; overlapping intervals and instantaneous events; useful question/answer interaction; editable evidence-consistent reconstruction; physical intervention changes the replay; wrong hypothesis visibly fails; five case chapters incl. changed transfer. Unit tests for witness/truth consistency, interval/event constraints, each solution and false timeline, two-fact necessity and transfer. Browser test exploration → evidence → reconstruct → intervention → recovery and one mistake/retry, pause/restart/mobile. Tripo character and clock/bird visible, rig animation tested. VISUAL_REVIEW target vs actual. Build/tests/typecheck; main pushed; README real limitations. Do not settle for a static evidence board or a 3D scene with text overlays.
