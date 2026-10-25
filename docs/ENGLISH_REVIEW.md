# Independent English and gameplay review

Reviewed the implemented content, pure simulation and actual browser UI on 25–26 October 2026. All five case chains, mistake/recovery paths, mobile reading/controls, exposure tracking and completion/fullscreen controls passed. All scenario sentences are original. Required Tripo assets/rigs remain an external blocker; this review does not establish learning gains or enjoyment.

## Semantic guardrails

- `was carrying`, `was reading` and `was moving` are activities with duration. `opened`, `rang`, `fell`, `took` and `found` are events. An event inside an activity does not automatically end that activity.
- `While` connects overlapping activities; it does not prove cause or intention. `When` does not select one fixed tense by itself.
- Each witness has a limited viewpoint. Shared colour does not establish shared object identity. The game uses stable owner/cart labels.
- Closing a window before a scripted opening would not preserve closure. The implemented intervention **latches** its shutter before the opening. Securing the object before the gust is an accepted alternate solution.
- Wind causing movement does not establish that the musician or visitor intended the outcome. No accusation is supported.
- Original fixtures do not copy the Noga/Noor and Lihi/Lina name inconsistencies in the source snapshots.

## Implemented deterministic incidents

Activity intervals use `[start,end)`: their end is excluded. A moment at 00:30 is outside carrying from 00:10 to 00:30. The same case data drives the simulation and witness-text construction.

| Case | Activity and anchor | Completed events | Identity | Valid latch window |
|---|---|---|---|---|
| 1 | Carrying 10–30; reading 15–35; bell 20 | Window opens 20; gust 22; trolley 40 | NOA, blue suitcase | 15 ≤ t < 20 |
| 2 | Carrying 8–28; reading 14–34; both at bell 24 | Window opens 26; gust 28; trolley 46 | AVI, blue suitcase | 20 ≤ t < 26 |
| 3 | Carrying 9–32; reading 15–36; bell 25 | Avi closes 12; Noa opens 19; window 25; gust 27; trolley 42 | NOA; both suitcases blue | 19 ≤ t < 25 |
| 4 | Carrying 11–33; reading 16–38; bell 23 | Key found 24; window 31; gust 33; trolley 48 | STAGE cart; MAIL decoy | 24 ≤ t < 31 |
| 5 | Ladder moving 5–17; reading 8–24; bell 13 | Side door opens 13; gust 16; curtain closes 18; cart 34 | CANVAS cart; STAGE decoy | 9 ≤ t < 13; side door only |

A `secure` action strictly before the case’s gust also saves the object. It does not replace the separate supported-reconstruction requirement. The fourth case’s key is left beside the clock; the runtime should require reaching it and collecting it after its appearance if using the latch route.

### 1. A moment inside an action

Porter: “While I was carrying boxes, the musician opened the window. I started at 00:10 and finished at 00:30.”

Visitor: “The bell rang at 00:20 when the musician opened the window. I saw the bird fall into Noa’s open blue suitcase just after the bell. I was reading, not carrying boxes.”

The visitor explicitly anchors opening to the 00:20 bell. The accounts therefore establish the exact instant, overlap and object identity without asking players to infer precise seconds from `while` or `just after` alone. This resolves the earlier source-review concern.

Near misses: `reading` as the porter’s activity; opening at 30; AVI’s blue case. Noa’s case begins open; Avi’s remains closed.

### 2. Two actions at once

Porter: “I was carrying boxes from 00:08 to 00:28 while the visitor was reading. The bell rang before I put the boxes down.”

Visitor: “I was reading from 00:14 to 00:34. The bell rang at 00:24. The musician opened the window two seconds later. The bird fell into Avi’s suitcase.”

Both activities contain the bell. Sequence-only reading after carrying, reading ending at the bell, or an invented interval that merely overlaps are rejected. The text explicitly supplies the exact reading interval, making that precision fair. The correct owner differs from case 1.

### 3. Before and after

Porter: “Avi closed his suitcase at 00:12 before Noa opened hers. Both suitcases were blue. I was carrying boxes from 00:09 to 00:32.”

Visitor: “The bird fell after Noa opened her suitcase at 00:19. The musician opened the window at 00:25; the trolley took Noa’s suitcase at 00:42.”

Names and order distinguish two blue cases. A fall at 18 contradicts opening-before-fall. Their spatial positions change from case 1. The implemented physical alternatives are shutter latch and securing the bird; there is no suitcase-covering mechanic.

### 4. Ask for a missing fact

| Question | Distinct answer |
|---|---|
| “What were you carrying when the bell rang?” | Carrying boxes 11–33, bell 23 |
| “What did you find after the bell rang?” | “I found a brass key at 00:24. I left it beside the clock. It opens the shutter latch.” |
| “Who opened the window?” | Musician at 31, while porter carried boxes |

Visitor: “The bird fell into the STAGE cart, not the MAIL cart. The trolley took it at 00:48.”

The opening question is required to support opening time; carrying alone does not reveal it. The key question informs the latch route. Securing the bird remains valid, so requiring the key for every possible win would be unfair. The questions model `did + find`, while the answer uses irregular `found` meaningfully.

### 5. Unaided transfer

Painter: “While I was moving the ladder, the visitor opened the side door. I moved the ladder from 00:05 to 00:17.”

Attendant: “The visitor opened the side door at 00:13. The lantern fell into the CANVAS cart before the curtain closed at 00:18.”

Changed object, actor, opening, container, timing and vessel layout prevent reuse of the first solution. The visitor explicitly gives opening time; `while` alone does not. Courtyard-window latching at 17, side-door latching at 20, securing at 20, and choosing STAGE all fail. No solution hint is supplied.

## Language-bypass and fairness checks

1. No witness, porter only, and visitor only must fail reconstruction even if a guessed physical intervention saves the object. Keep action and comprehension outcomes separate.
2. One witness must leave at least two plausible hypotheses. Room occlusion must prevent continuously visible trajectories from revealing offscreen vessel identity.
3. A contradiction should quote the relevant evidence and permit editing. Do not reveal each field’s correctness before submission.
4. Mistakes require a replay and change the first-unaided flag. A sequence of guesses cannot be counted as first unaided comprehension.
5. Transfer has no solution hint. On-demand vocabulary, replayable audio and reading pause remain accessibility tools; log them separately from solution hints.
6. Make the shutter mechanism’s valid latching interval physically clear. A rejected action after opening must have a visible mechanical explanation rather than an unexplained timing rule.
7. Accept every implemented physically valid intervention. Securing before the gust is a valid alternate route.
8. Keep all task-bearing English LTR inside Hebrew RTL chrome. Pause time while reading or using vocabulary.

## Verification

`npm test` passed all 35 tests (20 independent reviewer checks and 15 other checks, including exposure/identity regression tests), with 0 failures. `tests/reviewer-semantics.test.ts` uses an independent hard-coded authored oracle rather than deriving expected answers from the implementation table. It covers all five outcomes, two-viewpoint necessity, no retroactive effects, event/interval boundaries, overlap versus sequence, same-colour identity, useful questions, `did + find` / `found`, and changed transfer route/time/identity.

Actual browser checks used the web-game skill’s installed Playwright 1.61.1 and Chromium headless shell 1228. The repository’s pinned Playwright 1.56.1 expected a browser revision unavailable on this host, so the existing skill runtime was used without package changes. Actions invoked actual UI controls and form input handlers; only `advanceTime` stepped time, and `render_game_to_text` supplied assertions. No win-state injection or direct simulation-state mutation was used.

### Complete five-case UI flow

`work/reviewer-final.mjs` completed with exit 0 and no page/console errors, using one page, mobile first and then desktop.

- Timeline scrubbing pauses time; arrow-key movement remains available while the investigation clock is paused.
- Witness reading pauses time and uses LTR English. On-demand `while` vocabulary produces Hebrew support.
- Case 1: selecting AVI produces an identity contradiction quoting the visitor’s English account. Selecting NOA and correcting the reconstruction, then latching at 17 and physically recovering at 23, produces `won`, `validated:true` and `recovered:true`. Retry clears the unaided flag.
- Case 2: reading 28–34 is rejected as sequence-only; changing to 14–34 passes. Securing at 10 and physically recovering at 29 verifies the alternate route.
- Case 3: NOA identity in the changed vessel position, opening 25, latch 21 and recovery 28 complete the case despite both cases being blue.
- Case 4: all three complete questions reveal distinct answers. The known key becomes collectible beside the clock at 24; collecting it, latching at 27 and recovering at 34 complete the case.
- Transfer: moving-the-ladder activity, opening 13 and CANVAS identity pass. Side-door latch 11 and recovery 17 complete the changed incident on the first attempted reconstruction/intervention, with `hints:0`, `retries:0`, `unaided:true`. The hint control is disabled. This is an automated run flag, not a student-learning assessment.
- Transfer’s actual account panel is headed “עובדת התחנה” and reports the visitor’s action in third person. Authoritative fields separately identify attendant observer and visitor opener.
- The fifth case advances to finite `finished` state. Play Again preserves completed exposure and `unaided:false`, preventing repeated success from appearing first unaided.

### Mobile, visual panels and restart

At 390×844, actual full-page images show opaque readable LTR witness text, a notebook that fits the viewport, and usable 44px movement controls. Dpad movement, mute/reduced-motion toggles and restart pass. Hint→restart retains `unaided:false` and `previousExposure.hinted:true`, while clearing current facts. Desktop completion and contradiction panels are visibly readable with computed opacity 1.

The initial source review found an exact-time inference gap in case 1, a visible-open-lid shortcut, ambiguous transfer witness/opener identity, resettable first-unaided tracking, and opacity/screenshot starvation under software rendering. The final build resolves these with an explicit bell anchor, opaque luggage cover, distinct attendant/visitor roles, a persistent minimal exposure ledger, immediate panel visibility and rendering on change while paused.

### Completion and keyboard controls

`work/reviewer-controls.mjs` completed with exit 0 and no page/console errors. It produced a real case 1 win before checking controls:

- Start is idempotent. Space toggles pause/resume while exactly one start event remains recorded.
- Escape closes the notebook even while its range input has focus.
- Escape and R preserve the completion panel. Toolbar controls cannot replace it or strand the player, and the completion panel has no close X.
- F enters fullscreen and Escape exits it while preserving completion.
- Next remains visibly available and advances to case 2.

At 1280×720, the observed Start button bounds were x 106.796875, y 457.625, width 399, height 52; center approximately (306,484).

### Evidence and remaining limits

Real images were opened and inspected beside the generated target. The actual station uses the planned elevated 3D cutaway, teal/ivory/copper palette, clock mechanism and narrow timeline. The final transfer visibly changes the object/vessels/privacy cover to the side-door area and shows the ladder. The actual scene remains much simpler and more matte than the target’s detailed reflective theater. Required Tripo model acquisition and rig animation are not established by these captures; runtime hooks report no loaded models/animations.

Selected local evidence is under `work/reviewer-final/`: `00-mobile-witness.png`, `00-mobile-notebook.png`, `00-mobile-restart-history.png`, `01-wrong-identity.png`, `06-attendant-account.png`, `06-transfer-recovered.png`, `07-finished.png`, with paired state JSON. `work/reviewer-controls/02-win-after-controls.png` establishes the final completion guard without X. Curated images can be copied to public documentation; raw reports/state remain local test artifacts. Earlier captures with invisible panels are superseded and must not be used as visual proof.

The overloaded host caused initial loading/screenshot delays and one earlier mobile navigation timeout. The final one-page mobile/desktop run and focused controls run completed. This review does not establish hardware-accelerated performance on student devices, audible speech availability, enjoyment or learning gains. Speech depends on a local English browser voice; absence must leave readable text and a clear fallback message.


### Focused overlap and trail evidence

`work/reviewer-overlap.mjs` completed through normal case 1 → Next → case 2 UI with exit 0 and no page/console errors. Both accounts were read, AVI was selected, and the player walked west. At t=0 the trail hook returned 0. At t=24 it returned 5 enabled samples, corresponding to source times 8,12,16,20,24; the future sample at 28 was hidden. The current-time sample at 24 is included, so this is a ≤ current time rule. Both ongoing-world activity flags were true at 24.

Opened and inspected the actual full-page `work/reviewer-overlap/tracks-at24.png` and `overlap.png`. The former shows two visible, spatially overlapping timeline tracks at 24. The latter shows the opaque contradiction panel after proposing reading 28–34, with the English witness account and both historical tracks visible. DOM checks confirmed opacity 1 for both tracks and the contradiction, plus positive pixel overlap between the tracks. These replace the earlier canvas-only case 2 evidence.
