# Curriculum mapping

Clockwork Alibi is an original English mystery for Hebrew-speaking Israeli grade-8 students. Its scope follows saved Workbook grade-8 chapter-2 snapshots. Scenario sentences are original. This is not a claim of Ministry approval or evidence of learning gains. The broader reference is the 2020 junior-high action-oriented framework; A2 is the junior-high exit level, not a measured outcome of this slice.

Primary sources:

- [When Stories Intersect](https://english.workbook.co.il/grade-8/chapter-2/when-stories-intersect)
- [Events and Past Questions](https://english.workbook.co.il/grade-8/chapter-2/events-and-past-questions)
- [Feelings, Motives, and Sequence](https://english.workbook.co.il/grade-8/chapter-2/feelings-motives-and-sequence)

This table matches `src/content.ts` and the pure simulation reviewed on 25 October 2026. Detailed fixtures, timing and adversarial checks are in [docs/ENGLISH_REVIEW.md](docs/ENGLISH_REVIEW.md).

| Chapter | Exact Workbook source | Intended skill | Original task-bearing fixture | World outcome | Misconception to expose |
|---|---|---|---|---|---|
| 1 — A moment inside an action | [When Stories Intersect](https://english.workbook.co.il/grade-8/chapter-2/when-stories-intersect) | Locate a completed event within ongoing background; combine viewpoints | “While I was carrying boxes, the musician opened the window.” / “I saw the bird fall into Noa’s open blue suitcase just after the bell.” | Place window opening at 20 inside carrying 10–30, identify NOA, then latch shutter 15–20 or secure bird before 22 | An event ends the ongoing activity; same colour proves same object; while alone gives exact seconds |
| 2 — Two actions at once | [When Stories Intersect](https://english.workbook.co.il/grade-8/chapter-2/when-stories-intersect) | Reconstruct overlapping activities and an event within both | “I was carrying boxes from 00:08 to 00:28 while the visitor was reading.” / “I was reading from 00:14 to 00:34. The bell rang at 00:24.” | Align both tracks at bell24; opening26 and AVI identity guide a changed replay | While means one activity finishes before the other begins; when forces one tense |
| 3 — Before and after | [When Stories Intersect](https://english.workbook.co.il/grade-8/chapter-2/when-stories-intersect), [Feelings, Motives, and Sequence](https://english.workbook.co.il/grade-8/chapter-2/feelings-motives-and-sequence) | Use event order and stable owner identity; distinguish cause from intention | “Avi closed his suitcase at 00:12 before Noa opened hers.” / “The bird fell after Noa opened her suitcase at 00:19.” | Identify NOA despite two blue cases, place opening25, intervene before gust27 | Colour alone identifies a container; event order proves intention |
| 4 — Ask for the missing fact | [Events and Past Questions](https://english.workbook.co.il/grade-8/chapter-2/events-and-past-questions) | Ask complete questions to reveal distinct facts; use irregular past in context | “What were you carrying when the bell rang?” / “What did you find after the bell rang?” → “I found a brass key at 00:24.” | Ask who opened window to learn31; identify STAGE; find key beside clock for latch route or secure bird before33 | Every question reveals the same fact; did is followed by a past-form verb; one route must invalidate other physical solutions |
| 5 — Unaided transfer | [When Stories Intersect](https://english.workbook.co.il/grade-8/chapter-2/when-stories-intersect), [Events and Past Questions](https://english.workbook.co.il/grade-8/chapter-2/events-and-past-questions) | Transfer overlap, order and viewpoint reasoning to changed nouns/layout/timing | “While I was moving the ladder, the visitor opened the side door.” / “The visitor opened the side door at 00:13. The lantern fell into the CANVAS cart before the curtain closed at 00:18.” | Protect lantern through side-door latch9–13 or secure before16; identify CANVAS; old window/time fails | Memorizing an earlier action, number or container is sufficient |

## Hebrew and evidence boundaries

Hebrew explains controls and misconceptions. English supplies missing facts. English passages require explicit LTR layout within the RTL interface. On-demand vocabulary and replayable speech support access, and reading pauses the loop. Action success is separate from first unaided evidence-consistent reconstruction. Hints and retries cannot count as unaided decisions.

`While` indicates overlap here; it does not establish cause. `When` does not independently choose a tense. Temporal relations do not establish motive. The source snapshots contain inconsistent character names; original game fixtures use stable identities and do not reproduce those inconsistencies. The first case’s revised visitor account explicitly anchors window opening to the 00:20 bell; the overlap clause alone would not establish an exact second.

## Verification status

Pure fixture review completed. The pre-asset baseline passed 35 checks, including the independent authored-oracle tests in `tests/reviewer-semantics.test.ts`, and its browser UI checks passed all five cases, wrong identity, sequence-only overlap, alternate securing, key pickup, and first-attempt transfer without solution hints. Focused verification confirmed opaque readable completion/contradiction panels and usable 390×844 mobile witness/notebook/movement controls after the rendering fix. Hint exposure remains assisted after restart. Play Again also preserves completed exposure and the assisted/repeated flag. The transfer attendant is explicitly distinct from the visitor who opens the door. Completion guarding, start/Space, notebook Escape, fullscreen F/Escape and Next navigation also passed baseline browser checks. The current integrated suite passes 48 checks and the final strict model/world-route browser chain passes all five cases, as recorded below. Automated checks can establish rule consistency and observed interaction outcomes; they cannot establish enjoyment or learning gains.


## Renewed interaction pass — verified

The resumed commission retains the original five English fixtures and truth table. World controls move recording/testing toward the clock, window/door and visitor; the notebook provides quote review with a collapsed detailed accessibility fallback. These controls record the player’s candidate rather than infer the correct answer. A short chosen-moment original-history replay and direct physical actions preserve overlap versus sequence, limited viewpoints, no motive inference and separate action/comprehension outcomes.

The earlier 35-test and browser results above describe the pre-asset baseline. Fresh current-build inspection at commit `e93fa65` confirmed physical recovery can precede reconstruction without bypassing the final two-viewpoint requirement. The final three-clip asset/control pass verifies live carry/walk/idle roles, restart exposure, normal touch actions, original-history replay and all five cases. A discovered corner-navigation defect was corrected with exact waypoint stepping and two stepped regressions; the strict rerun needs zero recoveries. See the renewed section in `docs/ENGLISH_REVIEW.md`.


### First integrated milestone

A new first-case world route passed without opening the notebook: explicit witness activity choice, player-selected opening stamp, physical identity, clock test and direct replay action still required both English viewpoints. A wrong stamp stayed wrong and a one-viewpoint test did not validate. The clock trial correctly used original history before restoring the stored changed replay. Actual imported walk-rig dynamics and the first bird-model chapter transition passed; the suite at that milestone contained 37 tests.

The final strict run additionally confirms the completed carrying clip, independent walking/idle player mixer, bird persistence through restart, normal touch latch/recovery and world-recorded case 2 overlap. A recorded reading interval 28–34 remains wrong and fails; recording 14–34 at the visitor then succeeds with the alternate secure-object route. These controls preserve temporal deduction rather than filling correct values automatically. Wrong time and same-colour identity also remain consequential and editable.

The strict current-build transfer preserves the distinct attendant/visitor identities, ladder activity, door opening at 13, CANVAS cart and first-attempt/no-hint status. Bird assets persist in chapters 1–4, the lantern alone appears in transfer, and Play Again restores the bird while preserving repeated exposure. All 47 target visits finish through ordinary movement, with no diagnostic recovery or browser/HTTP errors. Fresh full-page mobile/overlap/transfer images and state were inspected. The historical seven-recovery diagnostic is superseded by this clean run.
