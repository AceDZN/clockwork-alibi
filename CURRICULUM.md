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

Pure fixture review completed. `npm test` passed all 32 checks, including the independent authored-oracle tests in `tests/reviewer-semantics.test.ts`. Browser success/mistake/transfer review pending. Automated checks can establish rule consistency and observed interaction outcomes; they cannot establish enjoyment or learning gains.
