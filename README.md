# Clockwork Alibi · תעלומת שעון התחנה

A real3D browser time-loop mystery for Hebrew-speaking grade8 English learners. Explore a miniature railway station, combine partial English witness accounts, scrub intersecting past activities and physically change a replay. Five finite cases end with a changed lantern/side-door incident.

[Play on Workbook English Games](https://english-games.workbook.co.il/clockwork-alibi) · five cases with direct lesson links. Release details and verification: [docs/WORKBOOK_RELEASE.md](docs/WORKBOOK_RELEASE.md).

## Run

```sh
npm ci
npm run dev
```

Play http://localhost:5202. Built preview: http://localhost:4202 after `npm run build` and `npm run preview`. Both ports are strict. Standalone play has no backend, authentication, runtime AI, remote analytics or keys. Models and Hebrew fonts are bundled. The Workbook player uses the network's existing consent-aware analytics for its bridge events.

## Play

The opening case starts paused. Follow the **next-step strip**: its button walks to the relevant witness or object. Read both English accounts, deliberately save the activity, choose the labelled container and mark the opening time. The clock checks your reconstruction. After a successful check, change the past, view the result and collect the rescued object. **איך משחקים?** reopens the short three-stage explanation. Wrong choices stay editable; the guide returns to the relevant field.

Click a target/floor to walk, or use arrows/WASD. E performs the contextual interaction; Space pauses/resumes; F toggles fullscreen; Escape exits fullscreen/closes reading and pauses. Touch uses world targets,44px arrows and the nearby action button. Reading pauses time; dotted English words offer Hebrew meaning. Optional local English speech uses an installed system voice. Options include mute, reduced motion and restart.

Record the ongoing activity in a witness account. Use the bottom timeline to choose a moment and mark it beside the window/door or station clock. Inspect a suitcase/cart to mark its identity. In case2, record the visitor's reading bounds from the timeline. The station clock tests the reconstruction with a short segment of **original history** around your chosen moment. Then start/change the replay: latch the appropriate closed opening at a viable time, or secure the object before the wind; advance past the gust and collect it. Both supported reconstruction and physical recovery are required. The notebook is a quote recap; optional detailed editing remains available for accessibility.

Wrong reconstructions remain editable and consume an attempt. Hints, attempts and prior completions persist locally across restart/play-again, so repeated success cannot be labelled first unaided. No personal student information is collected. Final transfer has no solution hint.

## Art and assets

Built-in imagegen target and exact prompt preceded implementation; see docs/visual-targets. It is a generated design target, not a game capture.

The required **original Tripo porter and bird are acquired and local**. The porter has a65-joint Mixamo rig and exported walk, idle and custom carrying-walk animations. The player uses an independent rig clone; the porter follows deterministic authored paths and timeline phases. Two handled boxes follow real hand sockets. The bird persists through cases1–4; transfer uses a lantern, then replay restores the bird. Source architecture and collision rules are independent of mesh details.

Runtime models total3,341,956bytes: porter2,021,208 and bird1,320,748. Two model generations, auto-rig and custom-motion processing spent100crewcredits; no purchase/upgrade. ASSETS.md records ownership basis, exact prompts/job URLs, source/export hashes and the custom clip's approximate grip limitation. Earlier browser outages are historical and resolved.

## Verify and publish to Workbook

```sh
npm test
npm run build
```

Tests cover authored truth, English semantics, independent expected solutions, exposure history, real GLB skin/animation contracts and navigation reachability. Browser harnesses use ordinary UI and deterministic `window.advanceTime(ms)`, never injected wins. `window.render_game_to_text()` exposes current state and read-only actual model/pose diagnostics. See PLAYTEST.md for observed scope/results and VISUAL_REVIEW.md for actual-versus-target images and remaining limits.

For browser reproduction install the matching browser using `npx playwright install chromium`; then run scripts/browser-check.mjs and scripts/browser-controls.mjs. The integrated harness accepts REVIEWER_URL, REVIEWER_OUTPUT_DIR, REVIEWER_PLAYWRIGHT_MODULE, REVIEWER_BROWSER_PATH, REVIEWER_CHANNEL and REVIEWER_ANGLE. The controls harness also accepts GAME_URL and BROWSER_EVIDENCE_DIR. Work captures are untracked. Current model-integrated harness details are recorded in PLAYTEST.md.

Vite uses relative base and runs inside the Workbook English Games player. `?level=1` through `?level=5` opens the requested case directly, paused, with its guide. The host receives `ready` after both local models mount, `level-start` for each case/attempt and `level-complete` only after the English reconstruction and physical rescue succeed. Messages use the Workbook bridge contract and an explicit allowed parent origin. Standalone play retains the title opening and collects no remote analytics by itself.

The network release uses `pnpm games:release` in `AceDZN/acedzn-tools`, uploading `dist/` and the actual-gameplay poster in `workbook/poster.png` to an immutable R2 folder. The shared catalog supplies the English Games page, five case links and three Grade 8 lesson mappings. No separate Vercel project or runtime keys are required for this game. The catalog commit records the exact game commit used to build each release.
