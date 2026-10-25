# Independent English and gameplay review

Reviewed `src/content.ts` and `src/simulation.ts`, 25 October 2026. The fixtures below describe the implemented pure rules. Browser findings remain pending until the playable scene exists. All scenario sentences are original.

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

Visitor: “The visitor opened the side door at 00:13. The lantern fell into the CANVAS cart before the curtain closed at 00:18.”

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

`tests/reviewer-semantics.test.ts` uses an independent hard-coded authored oracle rather than generating expected answers from the implementation’s table. It checks five physical outcomes, two-viewpoint necessity, no retroactive effects, event/interval boundaries, overlap versus sequence, same-colour owner identity, distinct useful questions, `did + find` / `found`, and changed transfer route/time/identity.

`npm test` passed all 32 tests (20 independent reviewer checks and 12 existing checks), with 0 failures. Runtime/browser review pending. These tests do not establish enjoyment or learning gains.

## Independent visual inspection, 26 October 2026

Opened `docs/evidence/gameplay-investigation.png`, `docs/evidence/gameplay-witness.png`, and `docs/visual-targets/target-01.png` directly. The actual scene is real 3D and visibly uses the intended elevated cutaway station, teal iron, ivory clock, copper details, and narrow bottom timeline. The witness account has explicit LTR English and readable contrast within the Hebrew shell. The compact notebook replaces the target’s single caption as a practical reading surface.

The visual gap is material: the actual station has simple matte geometry and much less character/architectural detail than the generated target’s reflective mechanical theater. Required Tripo model/rig integration remains an external asset limitation, not a requirement these captures establish. Footer labels appear very small at 1440×900; mobile usability requires its own capture. This inspection does not establish frame rate, fun, or learning gains.

Source-review corrections made by the lead before the independent browser chain: visitor explicitly anchors case1 opening at the bell; luggage canopy remains opaque so lid states do not become a visual identity shortcut; transfer route/object/vessels move to the side-door area; transfer painter receives a visible ladder and wind uses the side-door source. These corrections still need completed browser-chain evidence.

## Independent browser gameplay results, 26 October 2026

Used `work/reviewer-browser.mjs` with the web-game skill’s installed Playwright 1.61.1 and Chromium headless shell 1228. The repository’s pinned Playwright 1.56.1 expected an unavailable browser revision, so the existing skill runtime was used without changing packages. Actions invoked actual UI controls and form input handlers; only `advanceTime` stepped time, and `render_game_to_text` supplied assertions. No win-state injection or direct simulation-state mutation was used.

Passed through actual UI:

- Timeline scrubbing pauses time; arrow-key movement remains available while the investigation clock is paused.
- Witness reading pauses time and uses LTR English; on-demand `while` vocabulary produces Hebrew support.
- Case 1: selecting AVI produces an identity contradiction quoting the visitor’s English account; selecting NOA and correcting the reconstruction, then latching at17 and physically recovering at23 produces `won`, with `validated` and `recovered` true. Retry correctly clears the unaided flag.
- Case 2: reading28–34 is rejected as a sequence-only reconstruction; changing to14–34 passes. Securing the object at10 and physically recovering at29 validates the alternate route.
- Case 3: NOA identity in the changed vessel position, opening25, latch21 and recovery28 complete the case despite both cases being blue.
- Case 4: all three complete questions reveal distinct answers. The known key becomes collectible beside the clock at24; collecting it, latching at27 and recovering at34 completes the case.
- Transfer: moving-the-ladder activity, opening13 and CANVAS identity pass; side-door latch11 and recovery17 complete the changed incident on the first attempted reconstruction/intervention, with `hints:0`, `retries:0`, `unaided:true`. The hint control is disabled. This is an automated run flag, not a student-learning assessment.
- The fifth case advances to the finite `finished` state.

Evidence: paired stage JSON and real browser images are under `work/reviewer-browser/`. Captures include wrong identity, overlap mistake, cases1/3/4 recovery, transfer recovery and finish. State JSON is saved before screenshots. The first full-page screenshot exceeded60 seconds under host load, so an actual canvas image was used as fallback; another earlier run retained a visible full-UI contradiction capture.

Visual limitation discovered by opening captures: several stage PNGs show the 3D scene but omit the expected panel while their paired JSON has `panel:win` or `panel:contradiction`. Decorative opacity entrance animation and continuous software rendering are plausible causes under the overloaded host. These images **do not establish visible completion/contradiction panels**. Lead will remove that opacity entrance and stop redundant paused rendering, then perform focused visual verification. Rule assertions above passed before those rendering-only changes. Mobile checks remain in progress at this entry.
