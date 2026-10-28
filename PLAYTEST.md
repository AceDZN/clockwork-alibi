# Verified art and gameplay milestone

26 October2026. Current evidence is under `docs/evidence/integrated/`. Earlier captures/reports outside that folder document the initial procedural prototype and are historical, not proof of the current models.

## Automated checks

- `npm test`: **48 passed, 0 failed**. Includes20 independent English/truth-oracle checks, exposure history, actual local GLB skin/animation contracts, reachable interaction approaches and stepped corner regressions.
- `npm run build`: TypeScript and static Vite build pass. Patched Vite7.3.7, committed lockfile, relative base and vercel.json. Production deployment was not performed.
- Runtime assets are real original Tripo files: a65-joint porter skin with walk, idle and custom carrying-walk clips, plus a copper/teal bird. The player uses an independent skeleton clone. Hashes, source/export names, license basis and100-credit spend are in ASSETS.md.

The pure tests distinguish events from ongoing half-open intervals, overlapping from sequential activities, stable owner identity despite matching colour, useful questions/did+find/found, non-retroactive interventions, two-viewpoint necessity, changed transfer, and assistance history across restart/replay. Model tests parse actual embedded GLB geometry, skin joints and multi-joint nonzero animation channels.

## Current strict browser run

The independent reviewer ran `work/reviewer-integrated.mjs` using a separate temporary Chrome/Metal profile with normal controls and deterministic time stepping. It did not inject wins, bypass the notebook gate internally, or use private game mutation. The final strict run completed all assertions in24.54seconds with **zero diagnostic recoveries, page/console/audio errors or HTTP errors**. It made47 ordinary target visits; longest walk3.5simulated seconds.

| Check | Observed result |
|---|---|
|Real rig|Mounted skins/bones, carry versus player walk, idle weights, fractional pose changes, exact scrub repeat and independent player skeleton all passed.|
|First case|World-first record activity→mark vessel→stamp moment→clock trial→physical latch/recovery passed without opening the detailed notebook editor.|
|Mistake/restart|An incorrect stamp31 stays31, consumes a trial and contradicts evidence; pause/Skip work; restart preserves assistance history and mounted models.|
|Original history|A stored latch is ignored during the explicitly labelled original-history trial, then restored when the changed replay resumes.|
|Overlap|World-recorded reading28–34 fails; correction14–34 succeeds. Securing the object is accepted as the alternate route.|
|Identity|Wrong AVI identity fails despite the same colour; corrected NOA plus physical intervention/recovery wins.|
|Useful questions|Three distinct questions, meaningful found-key account, key pickup at clock24, latch and recovery pass.|
|Transfer|Distinct attendant observer/visitor opener, new left layout, ladder, CANVAS cart and side door13; lantern only, first automated attempt/no solution hint.|
|Persistence|Bird remains mounted through cases1–4, lantern replaces it in5, PlayAgain restores bird/rig/props and retains prior completion exposure.|
|Touch|390×844 real locator taps, readable LTR witness, collapsed quote recap, nearby latch/recovery button and persistent button identity across250ms pass.|

This automated first-attempt transfer is not evidence of a pupil's unaided comprehension. The language and action decisions are logged separately; no student identity or remote analytics are collected.

A separate current controls harness legitimately solved case1 and verified one Start event, Space pause/resume, notebook Escape from a focused input, completion guards, disabled toolbar, no dismiss X, fullscreen F/Escape and visible Next. It passed with no browser errors.

## Defects caught and repaired

- Replacing HUD buttons every160ms could detach a touch target. Buttons now persist and update in place; real tap and node-identity checks pass.
- Popping a waypoint within.12m cut corners whose clearance was.04m, causing collision deadlock. The controller now caps travel to the waypoint, arrives exactly and consumes safe remaining edges. Stepped east/west tests and the clean complete route pass without keyboard recovery.
- Transfer object/painter approaches initially landed inside crate/bay colliders. Authored external approaches now have regression coverage for every case.
- Prior loading code detached carried props and discarded the bird on chapter reset. Props are reattached; the imported bird is cached and restored.
- Hidden Start focus and completed-panel dismissal traps were repaired and retested.
- The directional pad is now hidden during reading/recap so it cannot cover Continue. Movement is already paused in these panels.

Diagnostic runs with explicit ordinary-keyboard recovery are retained under untracked work history and are not counted as the clean pass.

## Required skill client and captures

The existing develop-web-game client was run against the built4202 preview with observed Start coordinates306,484 and actual pointer/arrow/Space input. It produced gameplay, mounted model state and a canvas capture, with no error file. Its forced software-renderer setting is separate from the hardware performance run below. Supplementary UI harnesses provide the complete success/mistake/transfer/touch evidence.

The lead opened the actual final target-state, original-history, mobile recap and transfer-success PNGs. Independent reviewers opened all selected views. Source camera/material/model changes are compared with the built-in generated target in VISUAL_REVIEW.md. A generated target is never used as game-capture proof.

## Performance and download sizes

Measured separate temporary Chrome/Metal profile: AppleM2Max renderer,1600×900 at DPR1,483 actual rendered frames in8.008seconds: **60.32FPS**. Simulation advanced8.03seconds. This is one development-machine sample, not a student-device benchmark. Forced SwiftShader software fallback measured0.50FPS in the same scene and is unsuitable for smooth play; earlier software-only results were not representative of this hardware path.

Runtime model bytes total3,341,956 (porter2,021,208; bird1,320,748), both below3MB. Full static output is approximately4.21MB including locally bundled font alternatives. Main JS approximately661KB raw/176KB gzip. No remote model/font or Tripo service is needed at runtime.

## Reproduction and remaining limits

Run `npm ci`, `npm test`, `npm run dev`. Install the matching automation browser with `npx playwright install chromium`, then `node scripts/browser-check.mjs`; `node scripts/browser-controls.mjs` checks completion/fullscreen and the optional detailed editor. The integrated harness supports REVIEWER_URL, REVIEWER_OUTPUT_DIR, REVIEWER_PLAYWRIGHT_MODULE, REVIEWER_BROWSER_PATH, REVIEWER_CHANNEL and REVIEWER_ANGLE. On this Mac, Chrome/Metal was selected explicitly. The default route is strict: do not enable the diagnostic REVIEWER_NAV_RECOVERY flag to claim a pass.

The custom carrying clip approximates the prompt and keeps its arms low, so two handled boxes follow the actual hand sockets rather than a chest-high stack. Architecture, secondary static figures and materials remain simpler than the target. Low-end school hardware, physical touch devices, student enjoyment and learning gains remain unvalidated. Optional local English speech depends on installed voices. No required Tripo acquisition or rig blocker remains.

### Final compiled-preview confirmation

After hiding the movement pad during reading, the portable strict harness was run against the exact built http://localhost:4202 preview. All five routes, mistakes, actual touch taps, model/clip checks and restoration passed again in20.388seconds, with zero recoveries/errors/failedHTTP requests. `integrated/report.json` and the refreshed selected PNGs record that built-preview run; `independent-report.json` preserves the independent24.54second run. This confirms the packaged bundle and model paths as well as the development server.

## Player-requested onboarding revision · 2026-10-26

The player reported that the idea was appealing but the required actions were unclear. The opening now states the rescue goal and three phases; it starts paused. A single persistent next-step strip offers direct walking to witnesses/objects. Reading alone does not count as deliberately saving an activity, time or container. Clue controls explain what to do locally. Failed trials return guidance to the field that needs revision without correcting its value. After a successful physical change, a separate result-view action advances beyond the gust; collection remains a separate action. Transfer navigation gives no correct time, container or preferred intervention.

`npm test`: **56/56 pass** (48 existing plus 8 guidance checks). `npm run build`: typecheck and static build pass. A test-fixture empty array needed an explicit string type; no runtime workaround was required.

`node scripts/browser-onboarding.mjs` against the built 4202 preview passed the complete guided route at **1600×900 desktop and 390×844 actual locator touch taps**: paused start, help, deliberately missed recording, both witnesses, neutral two-label choice, wrong31/correction20, natural trial playback, physical change, result view, separate collection and fresh case2 records. Page/console/HTTP errors were empty. Selected actual full-viewport images and report are in `docs/evidence/onboarding/`. Opening, first-step, witness, clock, outcome and success pixels were opened and inspected, including portrait account/success. These checks establish operation and visible instructions, not student usability or learning gains.

The separate controls harness also passed idempotent paused Start, Space, focused-input Escape, legitimate rescue, completion guards, fullscreen F/Escape and Next, with no console/page errors; `controls-report.json` records it. The harness expectation now matches the intentional paused opening.

The first onboarding harness tried the optional Skip button after real-time playback had already finished under heavy machine load. It was changed to wait for natural trial completion. Two unmodified required skill-client runs timed out during their default30-second navigation with forced SwiftShader, before gameplay. They are not claimed as successful captures. A further run keeps that installed action/capture client unchanged and adapts its browser transport to Chrome/Metal with a120-second navigation budget; result recorded below when complete. Earlier performance observations remain historical, not fresh benchmarks for this revision.

The installed skill action/capture client completed with the Chrome/Metal launch adaptation: real Start/left-arrow/Space input, explore mode, player movement, loaded rig/bird and no error file. The actual canvas PNG was opened and inspected; `skill-canvas.png`/`skill-state.json` preserve it. This uses the installed client unchanged; only browser launch and navigation timeout were adapted in a local bootstrap after the two stock navigation failures. No performance benchmark is claimed from that input check.

The complete five-case regression also passed: carry/walk/idle dynamics, mistakes and restart, world-first records, original-history replay, touch latch/recovery, overlap correction, same-colour identity, key/questions, changed no-solution-hint transfer and Play Again. Error/HTTP/recovery lists were empty; `five-case-report.json` preserves it. Its312.9-second wall time reflects the heavily loaded host and is not a new FPS or device benchmark. Visual inspection then caught a saved-time summary still saying “unsaved”; it was bound to the same live record state and a focused browser assertion was added before the final onboarding rerun.

Final built-preview onboarding rerun after the live-summary correction passed again at both viewports, including an explicit DOM assertion that the saved time updates immediately. Final clock/mobile PNGs were reopened and show the corrected label. Refreshed `report.json` and selected captures supersede the earlier onboarding captures. The last installed-client rerun emitted its5-second Start-selector timeout while the input was being dispatched, but completed with exactlyone recorded Start event, explore mode, moved player, mounted assets and no runtime error file; its final actual canvas/state were inspected and retained. This timing warning is distinct from the clean full desktop/touch onboarding harness.

## Workbook network integration · 2026-10-26

60 unit/rule/model/navigation/host checks and the static build/typecheck pass. `scripts/browser-host.mjs` loads the actual built game inside a local same-origin iframe at each `?level=1..5`; every link opens its correct paused case, mounts the local models, and sends exactly one `ready` followed by its `level-start`. The final-case check explicitly proves late bird loading leaves the lantern mounted. An actual case1 reconstruction/rescue emits exactly one `level-complete` with duration, followed by case2's start on Next. Standalone play keeps its title opening. The final host run has empty console/page/HTTP errors; its rescue uses the game's mute option because an earlier otherwise-functional host run encountered two browser audio-device errors. No audio-device success is inferred from that muted bridge check.

The separate full five-case regression, with audio enabled, also passes all prior mistake/retry, touch, original-history, key, transfer, model and Play Again checks with empty console/page/HTTP/recovery lists. Its916.765-second wall time reflects the overloaded host, not a new device/FPS benchmark. The installed skill action/capture client ran through the existing Chrome/Metal bootstrap and produced real Start/arrow/Space gameplay with mounted models and no runtime error file; its fixed5-second Start-selector timing warning remains disclosed. Latest actual canvas, deep-linked final lantern and embedded success pixels were opened. Selected reports, messages and PNGs are in `docs/evidence/workbook/`.

## Production publication · verified

Release `2026-10-26` is live at https://english-games.workbook.co.il/clockwork-alibi through the existing English Games app. Catalog PR358 is merged (`38fdff9`); the immutable29-file R2 bundle records game source `2440ec0`. Every public release file matches its local SHA-256. Vercel preview and production builds/TypeScript checks pass in47s/53s; production deployment `dpl_CdrJ26N4B54RqAmWmVAJF4r3Ybyw` is READY on the public custom domain.

The real public flow home→card→game page→case4 passed: all three lesson links, iframe mounted models/ready and three witness questions. Actual390×844 touches opened case1's English account, saved an activity and advanced guidance. Game/asset error lists are empty; public page, player, iframe entry, manifest and GLB paths answer200. Full-page desktop/detail and portrait reading PNGs were opened and inspected. Evidence is `docs/evidence/workbook/live/`, plus `asset-proof.json`.

Two parent-console403s come from `https://clerk.workbook.co.il/v1/client`; the same response was reproduced on existing Rule Rascals. This did not block anonymous game play. Sign-in was not tested or changed. The scoped post-traffic production error/fatal log scan had no records in its15-minute window. A broad unchanged-wrapper local typecheck was stopped after20minutes under severe host load; successful Vercel app builds supplied app TypeScript/build verification. No claim of a clean parent-auth console or student-device validation is made.


## 2026-10-28 — 50-level campaign

All 50 levels completed through ordinary witness/record/conclusion/clock/physical-recovery controls with deterministic time and movement stepping. The final run batches DOM-control calls inside the browser to reduce transport overhead under heavy machine load; it does not assign internal state or inject victories. It verifies 50 completion records, a wrong level-50 inference and correction, the early-clamp rejection, the level-26 key/latch route with a live disabled→enabled control, the finite last-level ending, persistence/resume and actual 390×844 taps on the map and advanced witness record. Game console and HTTP errors: none. All 203 rule/navigation/progression/model tests pass.

Browser QA found and fixed an inherited pointer-events rule on the map button, an unreachable document desk, and approach points that were reachable but outside the expanded containers’ interaction radius. The navigation regression now checks both path reachability and interaction distance for every target in every level. The final capture client passed with installed Chrome/Metal; its canvas and text state at level 50 were opened and inspected. Selected map, scene, advanced-reading, contradiction and ending screenshots were also opened. Evidence: docs/evidence/campaign. Browser runs under host contention are not a performance benchmark.


The final built iframe checks pass levels 1, 4, 5, 6, 16, 26, 36 and 50, one ready/start ordering and real first-case completion/Next. Production is live on release 2026-10-28. Its real home→detail→level50, all 50 links/unrestricted map and 390×844 level46 touch read/record flow pass. Child-console/asset HTTP errors are empty; two nonblocking shell 403s remain outside the game. All 29 R2 files match SHA-256; all nine lesson targets and five actual public/versioned player/model routes return 200. Runtime error/fatal aggregation returned no groups. An obsolete unversioned model probe was corrected to the actual versioned path. The initial local Chrome startup timeout was resolved by retrying with a longer launch allowance. Public captures and reports are under docs/evidence/campaign/live; release provenance is in docs/WORKBOOK_RELEASE.md.
