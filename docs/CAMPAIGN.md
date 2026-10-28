# The 50-level campaign

Clockwork Alibi has one ordered campaign. Every level is available from the
map and through `?level=N`, 1–50. There is no grade selector, grade-based
difficulty, placement test or grade-dependent level limit.

The original five cases are the opening chapter; their facts and solutions
remain stable. `src/campaign.ts` authors 45 additional incidents, each with
its own title, witness passage, reading question, distractors and explanation.
Ten scene themes add signs, lighting colour and physical set dressing to
the shared navigable station architecture. The original character rigs
remain in use; the new objects and environment props are procedural meshes.

| Levels | Setting | Increasing demands |
| --- | --- | --- |
| 1–5 | Meridian Station | Guided activity/event reconstruction, overlap, identity, questions, first transfer |
| 6–10 | Botanical House | A required English conclusion about detail, cause or purpose; new seed capsule |
| 11–15 | Night Gallery | Three container candidates, relative time, pronoun reference and limited evidence |
| 16–20 | Harbour Depot | Third independent source, container open/close log, reading interval and two conclusions |
| 21–25 | Observatory | Four same-colour candidates, negation, comparisons and justified inference |
| 26–30 | City Archive | Earlier completed events, key information, narrower physical action windows |
| 31–35 | Festival Theatre | Reported claims versus observation and three required conclusions |
| 36–40 | Restoration Workshop | Fourth independent source, passive agents, dispatch log and source agreement |
| 41–45 | Storm Lab | Necessary conditions, purpose versus actual outcome and counterfactual past |
| 46–50 | Clockwork Vault | Four conclusions, clock correction, conflicting/corrected claims and multi-clause synthesis |

Difficulty advances with the level number. A chapter's fifth case removes the
solution hint. Help with controls remains available. Later levels require all
sources, exact reading intervals, the candidate event time, container identity
and all English conclusions before the reconstruction can validate. Merely
saving the physical object never supplies those missing facts.

From level 16, the shelf clamp has a limited availability window stated in
the register. From level 26, the latch route needs the key described by the
assistant. Both routes preserve player control over the timeline and the
separate rescue, outcome observation and recovery steps.

The map records completed levels and current position locally under
`clockwork-campaign-v1`. Continue resumes that position. Completion advances
the saved position to the next level, deduplicates repeats and never erases
earlier completions. Deep links override the saved position for that visit.
Existing exposure history for the original five cases remains intact.

## Curriculum

Workbook links are discovery/help metadata and never gate gameplay. The new
catalog links real grade 7–9 lessons for connected ideas, reference tracking,
sequence, reported speech, passive voice and conditionals. Past perfect and
the final synthesis include enrichment beyond the original chapter-2 scope.
The campaign makes no measured proficiency or learning-gain claim.

## Verification

The rule suite covers every level's physical and English constraints, all
reachable witnesses/documents/containers, an independently specified solution
at levels 6, 16, 26, 36 and 50, invalid inference, missing sources, unique
open-container evidence, all 50 deep-link values and progress persistence.

`scripts/browser-campaign.mjs` exercises all 50 levels via witness reading,
record controls, physical target navigation, conclusion selections, clock
trials and recovery. It also checks a wrong advanced inference, an action
before the clamp releases, the key/latch route, the last-level ending,
reload/resume, the all-open map and touch reading. The harness uses the
ordinary DOM controls and deterministic movement/time stepping; it does not
write game state or inject victories.

For a source build with installed Chrome:

```sh
REVIEWER_URL=http://localhost:5202 \
REVIEWER_PLAYWRIGHT_MODULE=/Users/acedzn/.codex/skills/develop-web-game/node_modules/playwright/index.mjs \
node --import tsx scripts/browser-campaign.mjs
```

The final source run completed all 50 reconstructions and physical rescues, rejected and corrected the level-50 inference, rejected an early clamp, collected the key through the live timeline control, and passed ending/reload/resume and 390×844 touch-map/reading checks. Its console and HTTP error lists are empty. All 203 unit checks and the static build/typecheck pass. The installed action/capture client also loaded and moved in level 50. Actual screenshots were opened and inspected. Results are under [evidence/campaign](evidence/campaign/). Automated play establishes consistency and
observed control behaviour, not student enjoyment or English proficiency.
