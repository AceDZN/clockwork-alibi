# Verified scope and browser evidence

26 October 2026. Functional verification establishes program behavior, not learning gains or enjoyment with students.

## Build and pure rules

- `npm test`: **35 passed, 0 failed**. Twenty independent reviewer checks use a separate authored oracle, plus simulation and exposure-history checks.
- `npm run build`: TypeScript and Vite production build pass. Relative base, static dist and vercel.json are ready for a future user deployment.
- Patched Vite7.3.7. npm audit after the patch and final production-dependency audit: zero vulnerabilities.

Tests cover all five lost/saved outcomes; two independent viewpoints; instant versus half-open ongoing interval; overlap versus sequence; same-colour owner identity; useful questions with did + find and irregular found; non-retroactive interventions; transfer rejecting old route/time/identity; assistance history across restart/storage/replay; distinct attendant observer and visitor opener.

## Real browser gameplay

The independent reviewer used the matching bundled Playwright browser, normal DOM controls, and `window.advanceTime`. It did not inject a win or call internal game actions. Form input events run the same handlers as user input. The text hook supplied assertions, not hidden state mutations.

| Case | Verified consequence and recovery |
|---|---|
|1|Wrong AVI identity causes a contradiction; physically inspect NOA, edit, latch at17, advance past gust22 and recover at23.|
|2|Sequence-only reading28–34 fails; corrected overlapping14–34 succeeds. Securing the object before the gust is accepted as an alternate route.|
|3|Same-blue owner identity and changed luggage position solve correctly; latch21 and recover after27.|
|4|Three questions reveal different facts; find key beside clock24, latch27 and recover after33.|
|5|Changed left layout, painter/ladder, distinct attendant witness, visitor/side door13 and CANVAS cart. First automated attempt used latch11 and recovery17 with no hint/retry. This is an automated first attempt, not evidence of a student's unaided comprehension.|

Finite finish and play-again work. Prior hints, attempts and completions persist locally, so restart/repeated completion cannot be described as a first unaided decision. No page or console errors were recorded in the successful chains.

Separate final control checks solved a case legitimately and verified: exactly one Start event; Space pause/resume; notebook Escape from an input; completion survives Escape/R and toolbar attempts; completed toolbar disabled; no dismiss X; F fullscreen; explicit Escape exit; Next advances visibly. Earlier checks caught hidden-start focus and completion-dismissal traps; both were fixed and rerun successfully.

## Mobile layout and accessibility

At390×844, actual captures were opened and inspected: English account stays LTR/readable, notebook button is reachable,44px directional controls move, mute/reduced-motion/settings work, and hint→restart keeps unaidedfalse while clearing case facts. These are responsive-browser/pointer checks, not tests on a physical student phone or tablet. Hebrew keyboard compatibility uses physical event.code; arrows were exercised. Local English system speech is optional and depends on installed voices; visible text remains available.

## Required skill client

The existing `/Users/acedzn/.codex/skills/develop-web-game/scripts/web_game_playwright_client.js` was run repeatedly after meaningful changes with real action bursts and its screenshots were opened. Early runs hit HMR or its5-second stable-click timeout under heavy software-WebGL load; those intro-only captures were not counted as gameplay passes. An observed Start button bounding box at1280×720 supplied a normal pointer click at306,484 for a successful gameplay/movement run. The final pointer/keyboard state and canvas are included alongside the supplementary UI chains.

Reproduce the broader chains with `node scripts/browser-check.mjs` and `node scripts/browser-controls.mjs` after installing the matching Playwright browser. See README for overrides.

## Curated evidence

- `docs/evidence/gameplay-investigation.png`, `gameplay-witness.png`: initial real desktop investigation/read state.
- `wrong-identity.png`, `overlap-mistake.png`: editable evidence contradictions.
- `case1-recovered.png`: final guarded completion panel, visibly opaque, no X, toolbar disabled.
- `mobile-witness.png`, `mobile-notebook.png`, `mobile-history-state.json`: responsive reading and persistent assistance.
- `transfer-account.png`, `transfer-state.json`: changed left layout, ladder, attendant and successful transfer.
- `five-case-browser-report.json`, `completion-controls-report.json`: successful functional reports with empty error lists.

The lead and independent reviewers opened the actual selected images. Generated target imagery is separately labelled under docs/visual-targets. Initial captures precede the lower/wider canopy and final controls; the selected follow-up images show those changes. Source motion trails now reveal only sampled past positions inside the authoritative activity interval, never future positions.

## Download, frame budget and actual limitations

Final static output:848,043bytes on disk; aggregate gzip357,285bytes across all output files (not a network waterfall). Main JavaScript646.79KB raw /171.67KB gzip; CSS17.43KB raw /4.71KB gzip. Includes locally bundled font alternatives and license. No GLB bytes are included because required models remain missing; this does not establish the full asset budget.

A startup software-WebGL run under shared-host load measured about1FPS and later samples could round to0. That was a poor result. Static architecture now merges by material, shadows cache at1024, DPR caps at2, deterministic bursts render once, and unchanged paused scenes do not redraw. Final active rendering uses wall-clock deltas; idle animation-frame callbacks are excluded from the FPS hook. Representative hardware/GPU and student-device performance remain unverified; no smooth-performance claim is made.

**Required Tripo models and porter rig remain blocked.** Chrome control briefly recovered, opened the crew's own tab and showed6835credits/owned assets, then failed again before submission. No generation, download, rig or credit spend occurred. Procedural automata and bird are temporary geometry, not rigged Tripo assets. ASSETS.md records the exact attempts and prepared prompts. Model scaling, clip playback and chapter transitions require verification after acquisition. Real-model visual parity, student fun and learning gains remain outstanding.

Final focused visual check passed with no errors: `overlapping-tracks.png` shows both ongoing activities at24 and gold/cyan tracks at opacity1 with253.30px overlap; `overlap-mistake.png` shows an opaque, evidence-backed contradiction. The trail hook reports0 at time0 and5 at24 (8,12,16,20,24); future28 is hidden. The lead opened both full UI images. The final skill-client readback also confirms one Start event, paused time10, arrow movement and one valid past trail.

Built-preview smoke at http://localhost:4202 also passed through the required client: Start, Space and arrow movement; mode explore, pausedtrue, time10, playerx−3.87, one Start event, no error file. This verifies the compiled static bundle runs, beyond an HTTP200 index response. Dev5202 and preview4202 remain running.
