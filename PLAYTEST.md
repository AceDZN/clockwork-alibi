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
