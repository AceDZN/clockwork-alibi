# Playtest evidence

26 October 2026. These checks establish implementation behavior, not learning gains or classroom enjoyment.

## Pure rules and English

`npm test`: 32 checks passed before final visual iteration. The independent reviewer owns `tests/reviewer-semantics.test.ts`, whose expected times/identities are an authored oracle rather than generated from implementation values. Checks cover every case’s lost/saved outcome, two-viewpoint necessity, exact instant versus half-open ongoing interval, overlap versus sequence, owner identity despite matching colour, useful questions with did + find / irregular found, non-retroactive actions, and transfer rejection of old route/time/identity. A final rerun follows final source changes.

`npm run build`: typecheck and production build passed for the initial playable pass. The final build is being rerun after visual and transfer layout changes. Patched Vite 7.3.7; npm audit reported zero vulnerabilities after updating.

## Browser runs

The required skill client was invoked from `/Users/acedzn/.codex/skills/develop-web-game/scripts/web_game_playwright_client.js` with real keyboard bursts on port5202. Initial attempt lost its execution context during a Vite edit. Later attempts produced actual canvas captures/state with no console errors, but its built-in 5-second stable-element click timed out under heavy software-WebGL host load and those runs remained in intro. These are not counted as successful gameplay verification.

A supplementary matching-Playwright browser run used normal UI handlers (`dispatchEvent('click')` on the same visible controls) and `window.advanceTime` for deterministic movement. It entered gameplay, walked from (-4,3) to the porter, opened a witness account and verified paused time and collected fact. No page or console errors were reported. Full viewport captures:

- `docs/evidence/gameplay-investigation.png`
- `docs/evidence/gameplay-witness.png`

The lead opened and visually inspected both captures. The first real capture caused camera zoom, amber window light and static-geometry merging improvements. It also revealed a major art-detail gap versus the generated target. The reviewer independently inspected both captures.

Full five-case browser success/failure/transfer/mobile verification is in progress; do not treat it as passed until the report below is updated.

## Performance and asset limits

The captured software-WebGL run reported approximately1FPS during startup/shared-host load; this is a poor interactive result and not a representative GPU benchmark. Architecture meshes are merged by material, shadows cache at1024, DPR is capped at2, and deterministic time bursts render once instead of once per simulation substep. Hardware-browser performance and classroom devices remain unverified.

Initial production output before the final layout pass was 864KiB on disk: raw bundled assets834,255bytes, aggregate gzip352,368bytes (includes all generated font alternatives, not an exact network waterfall). JavaScript was639KB raw /169.54KB gzip. No model bytes are included because required Tripo assets remain blocked; measuring that budget as satisfied would be misleading.

## Actual outstanding external step

Tripo Chrome automation timed out before obtaining any UI. Zero acquired GLBs, zero rig clips and zero credit spend. Temporary procedural automata/bird are visible; they are explicitly not Tripo completion. Details: ASSETS.md and docs/asset-browser-blocker.md.
