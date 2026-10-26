# Independent English and gameplay review

**Renewed pass, 26 October 2026:** the final strict three-clip/world-route check passes all five cases, mistake/correction, restart, normal touch actions, model persistence, changed transfer and Play Again. No navigation recoveries, browser errors or HTTP errors occurred. The discovered corner defect was corrected and rechecked. Current evidence and the portable harness are recorded at the end; the earlier sections distinguish historical pre-asset results.

Reviewed the implemented content, pure simulation and actual browser UI on 25–26 October 2026. All five case chains, mistake/recovery paths, mobile reading/controls, exposure tracking and completion/fullscreen controls passed. All scenario sentences are original. Tripo assets/rigs were unavailable at that baseline stage; the renewed verification below supersedes that asset status. This review does not establish learning gains or enjoyment.

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

Changed object, actor, opening, container, timing and vessel layout prevent reuse of the first solution. The attendant explicitly gives opening time; `while` alone does not. Courtyard-window latching at 17, side-door latching at 20, securing at 20, and choosing STAGE all fail. No solution hint is supplied.

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

The current `npm test` run passes all 48 tests: 20 independent semantic checks, two model-asset checks, eleven navigation checks and 15 other checks including exposure/identity regressions. The original pre-asset suite contained 35 checks; the first walk-rig milestone contained 37. The final two navigation checks exercise the same stepped movement helper as the live controller; the strict browser rerun also clears the previously observed corner stalls. `tests/reviewer-semantics.test.ts` uses an independent hard-coded authored oracle rather than deriving expected answers from the implementation table. It covers all five outcomes, two-viewpoint necessity, no retroactive effects, event/interval boundaries, overlap versus sequence, same-colour identity, useful questions, `did + find` / `found`, and changed transfer route/time/identity.

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

Real images were opened and inspected beside the generated target. The actual station uses the planned elevated 3D cutaway, teal/ivory/copper palette, clock mechanism and narrow timeline. The final transfer visibly changes the object/vessels/privacy cover to the side-door area and shows the ladder. The actual scene remains much simpler and more matte than the target’s detailed reflective theater. The original baseline captures did not establish Tripo acquisition or rig animation; their runtime hooks reported no loaded models/animations. The renewed model verification below supersedes that asset status.

Selected local evidence is under `work/reviewer-final/`: `00-mobile-witness.png`, `00-mobile-notebook.png`, `00-mobile-restart-history.png`, `01-wrong-identity.png`, `06-attendant-account.png`, `06-transfer-recovered.png`, `07-finished.png`, with paired state JSON. `work/reviewer-controls/02-win-after-controls.png` establishes the final completion guard without X. Curated images can be copied to public documentation; raw reports/state remain local test artifacts. Earlier captures with invisible panels are superseded and must not be used as visual proof.

The overloaded host caused initial loading/screenshot delays and one earlier mobile navigation timeout. The final one-page mobile/desktop run and focused controls run completed. This review does not establish hardware-accelerated performance on student devices, audible speech availability, enjoyment or learning gains. Speech depends on a local English browser voice; absence must leave readable text and a clear fallback message.


### Focused overlap and trail evidence

`work/reviewer-overlap.mjs` completed through normal case 1 → Next → case 2 UI with exit 0 and no page/console errors. Both accounts were read, AVI was selected, and the player walked west. At t=0 the trail hook returned 0. At t=24 it returned 5 enabled samples, corresponding to source times 8,12,16,20,24; the future sample at 28 was hidden. The current-time sample at 24 is included, so this is a ≤ current time rule. Both ongoing-world activity flags were true at 24.

Opened and inspected the actual full-page `work/reviewer-overlap/tracks-at24.png` and `overlap.png`. The former shows two visible, spatially overlapping timeline tracks at 24. The latter shows the opaque contradiction panel after proposing reading 28–34, with the English witness account and both historical tracks visible. DOM checks confirmed opacity 1 for both tracks and the contradiction, plus positive pixel overlap between the tracks. These replace the earlier canvas-only case 2 evidence.


## Renewed gameplay review — current baseline e93fa65

Read the 26 October resume handoff, common contract, scoped brief, existing asset status and generated target/prompt. Reopened the generated target. Started the unchanged dev command on 5202 because no server responded; no implementation file was changed. No native Chrome or Tripo controls were used by this reviewer.

`work/reviewer-resume.mjs` inspected the actual 1280×720 build through UI handlers and deterministic stepping. It completed case 1 by reading both witnesses, physically marking NOA, latching at 17 and recovering at 23 **before** validating the notebook. The current build correctly reported physical recovery while retaining `validated:false` and `mode:replay`; supplying the supported reconstruction afterward completed the case. Exit 0, no page/console errors. Actual images `03-current-notebook.png`, `04-before-physical-action.png` and `05-world-success-before-form.png` were opened directly.

The world-first route already exists, but the interface presents the notebook as the primary place to choose the English activity, enter opening time and run the test. At 1280×720 the notebook covers approximately one third of the width, reaches the footer and hides the intervention area. The lever action opens a second large panel for a single confirmation. A minimal case route cycles through at least seven account/label/reconstruction/action/completion panels. This interrupts the station’s most distinctive verbs even though its underlying time and physical rules work.

### Three bounded changes recommended to the lead

1. **Record the hypothesis in the station.** Let the player scrub and stamp the chosen opening moment at the window/door or clock. Keep an explicit English activity/source choice; record case 2’s reading start/end from the player’s selected times at the visitor. Put Test at the physical clock. Make the notebook mainly a quote recap, with its existing detailed controls collapsed as an accessible alternative. The record action must use the player’s current candidate, never snap to the correct case time or fill the activity/identity from hidden truth. A wrong candidate must remain editable and can still fail the unchanged pure checker.

2. **Show the consequential seconds.** Play a short local segment around the player’s chosen moment when testing, instead of jumping immediately to departure+3. At a contradiction, quote the relevant English account and keep pause/edit available. Use the same authoritative world table and preserve the opaque luggage destination; do not show a complete bird-to-labelled-container trajectory. This makes overlapping activity and a completed event visible together without turning `while` into a cause or attributing intention. A failed test still records an attempt and clears first-unaided status. Transfer receives no pre-attempt solution hint or automatic correct timestamp.

3. **Act directly after reading.** In replay, E and a compact nearby touch/pointer action should operate latch/secure/recover after any necessary explanation, rather than reopening a large modal for every physical action. Reuse the existing `act` rules, key requirement, timing boundaries and exposure accounting. A clunk, stopped gust and visible recovery can supply payoff. Wrong or early action remains consequential and recoverable. Witness/vocabulary reading stays fully pausable; shortcuts must not fire through a reading/input panel or strand completion.

These changes preserve the original five cases and English semantics. They are reasoned improvements based on observed friction, not a claim of demonstrated fun or learning gains. No new game chapter, grammar gate, omniscient CCTV view, automatic answer inference or runtime AI is needed.

### Integration verification checklist — completed below

The integration checklist required actual UI success, a recoverable mistake, restart after assistance, altered transfer and touch. Specifically: world-recorded candidates can be wrong; two independent English viewpoints remain required; case 2 tracks can overlap without sequence; wrong attempts/repeated completion remain assisted; hidden container identity remains English-dependent; imported porter animation preserves authored prop/role positions; Hebrew/LTR reading and pause behavior survive the smaller controls. The final runs below complete this checklist and retain the original pure semantics checks.

Current loader risks to resolve during integration: `Station.loadAsset(..., porter)` clears the parent, detaching authored carried-box/ladder groups unless they are reattached or given a separate model root. `configure()` clears the bird group on every chapter, so a once-loaded bird GLB would be replaced after case 1 while the load-status array could remain positive. Actual scene presence and prop/clip behavior must be checked across chapter transitions and restart; a positive `loadedModels` string alone is insufficient evidence.

### Model verification prepared during processing

Read-only `liveModels` data now reports actual mounted meshes/skins, bone quaternions, asset markers, independent skeletons, attached props and mixer roles/times/weights. The prepared `work/reviewer-model-checks.mjs` checks those live properties, not merely load-status strings. It will sample fractional times 11.137, 11.431, 11.733 through Play→deterministic step→Pause UI in one browser task, then return to 11.137. This avoids falsely rejecting a valid one-second looping walk because integer samples coincide. It checks pose variation, exact scrub repeatability, the authored porter path, and independent player animation with the clock paused.

The chapter-flow review will additionally verify mounted bird assets through cases 1–4 and restart, a lantern without the bird in transfer, and bird restoration on Play Again. At this preparation stage, the interim porter-base and bird exports were real local mesh GLBs with embedded resources and zero skins/animation clips. That interim porter has since been replaced by the skinned export described below; the old base cannot establish fulfilled rig animation.


### First integrated world-route and walk-rig smoke

`work/reviewer-world-smoke.mjs` completed with exit 0 and no page/console errors after the first animated porter export was integrated. No notebook was opened during the case route. The actual 1600×900 imported-world, original-history trial and completion images were opened directly.

- The registered porter GLB independently parses as 1,577,744 bytes, one bound skin, 65 joints and a `walk` clip with 195 channels targeting 65 nodes. Bird is real local mesh geometry. Two new structural regression checks in `tests/reviewer-models.test.ts` reject an unrigged-base substitution or missing/nonlocal runtime resources. All 37 tests pass.
- Live scene checks found mounted porter/player skinned meshes, independent skeletons, actual changing bone quaternions across fractional samples, exact pose repeat after scrubbing back, attached authored boxes/ladder and the deterministic porter path. Walking the player with the clock paused changed the player pose/position without changing the porter’s pose.
- Witness activity choice and opening stamps work without the notebook. A deliberately recorded 30 remained 30 instead of snapping to 20. Clock validation with only the porter account was refused without accepting the hypothesis. The second viewpoint and physical NOA tag were still required.
- With a real latch stored at 17, the clock’s chosen 20 test staged original history from 17 through 24 at 2×. At 22 the hook and actual capture showed the original open window/gust, while the stored latch was retained. Completion restored the changed replay with the latch effective. Direct E recovery at 23 completed case 1.
- Actual Next into case 2 retained the imported bird, porter rig, independent player and attached props. This checks the first chapter transition; remaining chapters, restart and touch still need the final integrated pass.

The new world controls reduce reliance on the notebook and let temporal evidence be recorded near relevant objects. The physical-first trial also exposed a wording concern: testing should explicitly say it plays the **original loop recording**, then resumes the changed loop. Otherwise an original gust shown despite a stored latch can look like a failed intervention. This is a copy clarification, not a new rule or solution hint.

A dedicated carry clip and final fit/presentation were still being processed at this milestone. The verified clip in this bounded pass was `walk`; the later carry verification is recorded separately below. Evidence and state are local under `work/reviewer-world-smoke/`.

### Three-clip integration — defect found and corrected

The current `porter.glb` is the completed 2,021,208-byte three-clip export with one bound skin and 65 joints. Its clips are `walk`, `idle` and the custom Tripo carrying animation, aliased to `carry` at runtime. The two independent asset tests now require all three roles and multi-joint animation for every clip. The live browser check verifies actual carry/walk selection, idle crossfade weights, changing carrying poses, deterministic scrub repeatability and independent player animation, rather than inferring animation from a loaded filename.

`work/reviewer-integrated.mjs` uses an isolated Chrome headless profile with Metal rendering, the installed skill Playwright runtime, actual UI handlers and deterministic time stepping. At 1600×900 and 390×844 it passed: a deliberately wrong opening stamp remaining wrong; original-history trial/pause/Skip; attempted exposure retained after restart; model/prop persistence; actual near-touch latch and recovery; a collapsed notebook editor; readable LTR mobile witness and recap; and case 2's wrong sequence, corrected overlap and alternate physical securing. The near-action element retained its identity across more than 250 ms before a normal locator tap. Actual screenshots were opened directly. No console, page, audio-device or HTTP errors were recorded.

The first strict run stopped on a real movement blocker. In case 3, wrong AVI → clock trial → retry → correct NOA stalled for eight simulated walking seconds at `(7.88,-0.63)`. The northeast bay waypoint is approximately `(7.96,-0.66)`, only .04 beyond its collider. Movement consumed the waypoint at a .12 distance, so the next leg cut the corner and was repeatedly rejected by collision. A diagnostic normal-keyboard recovery also exposed the reverse-direction stall at `(7.96,-0.56)` and the southwest corner in case 4 at `(2.26,4.00)`. Pure exact-segment route tests did not cover this stepped arrival behavior. The lead replaced this with `stepRoute`, which caps travel to the remaining distance, reaches each waypoint exactly and spends remaining travel along the next safe edge. Two 60-fps stepped corner regressions cover both layouts. The reviewer did not edit implementation.

The strict failure, state and actual image are preserved under `work/reviewer-nav-blocker/`. A separate diagnostic run under `work/reviewer-tail-with-recovery/` finished all five cases, finite finish and Play Again in 10.394 seconds of automation wall time. It explicitly logs seven ordinary-keyboard corner recoveries, including the mirrored transfer bay and the west crate corners; it cannot count as a clean navigation pass. It confirms case 3's wrong-identity correction, case 4's useful questions/key/latch, mounted bird through cases 1–4, the distinct transfer attendant, changed ladder/CANVAS/side-door solution, lantern without bird in case 5, and restored bird on Play Again. The transfer reconstruction/intervention remained first-attempt with zero hints/retries; ordinary movement recovery does not reveal English facts. Exposure still marks repeated completion assisted. Actual case 4, transfer account/win and restored-bird PNGs were opened. No page/console/audio/HTTP errors occurred. These are interaction outcomes, not a human completion-time measurement.

The portable harness is `work/reviewer-integrated.mjs`, with `work/reviewer-model-checks.mjs`. Its strict default never performs recovery. The optional `REVIEWER_NAV_RECOVERY=1` flag exists only for the explicitly qualified historical diagnostic. The final strict run used:

```sh
REVIEWER_PLAYWRIGHT_MODULE=/Users/acedzn/.codex/skills/develop-web-game/node_modules/playwright/index.mjs REVIEWER_CHANNEL=chrome REVIEWER_ANGLE=metal node work/reviewer-integrated.mjs
```

Run from the repository root. `REVIEWER_URL` and `REVIEWER_OUTPUT_DIR` optionally change the port/output folder. Chrome uses a new isolated temporary headless profile; this reviewer did not operate native Chrome or the user's account tabs.

The actual scene now includes the imported porter, independent player clone and bird, with the same station cutaway and narrow timeline. The luggage canopy still hides both destination lids. Mobile panels are readable; the dpad overlaps part of the witness Continue button, though a remaining area is tappable and the normal tap succeeds. This bounded interaction check is not a device-performance, enjoyment or learning-outcome study.

### Final strict integrated pass

The post-fix strict run exited 0: `diagnosticRecoveries:[]`, `errors:[]`, `httpErrors:[]`. All 47 target visits completed through real movement; the longest needed 3.5 simulated walking seconds. The full automated run took 24.54 seconds of wall time, including state/PNG capture. This measures this deterministic harness on this host, not human playtime or a student-device frame rate.

- All five case routes use world activity recording, the player's chosen time stamp, physical identity inspection, clock testing and physical replay action. No detailed notebook answer controls were opened. The notebook was opened once only to verify its collapsed quote recap on mobile.
- Wrong opening 31 remains 31 and fails. Wrong reading 28–34 fails against the original two tracks; changing it to 14–34 succeeds. Wrong same-colour AVI identity fails, and correcting to NOA completes case 3.
- A stored latch is retained while the clock test explicitly plays the original history. The original gust is visible during testing; afterward the stored changed replay is restored. Pause, Space and accessible Skip work during the trial.
- Ordinary mobile locator taps latch at 17 and recover at 23. The near-action button remains the same DOM node across a 250 ms HUD-update interval. Witness reading pauses the loop and is LTR within Hebrew controls; the recap's detailed fallback is collapsed.
- Case 4's three questions reveal distinct facts. The completed found-key answer offers no ongoing-activity recording. Actual clock pickup at 24, latch at 27 and recovery at 34 succeed.
- Case 5 changes to ladder, side door at 13, CANVAS and lantern. The attendant observer is distinct from the visitor opener. Door latch at 11 and recovery at 17 succeed on the first attempted reconstruction with zero hints/retries. The lantern has no mounted bird asset.
- Live mounted meshes, skins, independent skeletons, carry/walk/idle roles/weights, deterministic pose, player walking while time is paused and attached authored props pass. The bird remains through chapters 1–4 and restart, disappears for the lantern incident, then returns on Play Again. Prior attempt/completion exposure survives restart and repeated play.

Fresh actual images under `work/reviewer-integrated/` were opened: target-time station, mobile latch/account/recap, original trial, two-track overlap/contradiction, case 4 completion, transfer account/completion and restored bird. Paired state JSON and `rig-dynamics.json` corroborate the observed state. The old failure remains in `work/reviewer-nav-blocker/` as regression history and is superseded by this clean run.
