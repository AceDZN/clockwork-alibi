# Clockwork Alibi · תעלומת שעון התחנה

A finite real-3D browser time-loop mystery for Hebrew-speaking grade-8 English learners. Explore a miniature station, combine partial English witness accounts, scrub a sixty-second loop, test an editable reconstruction and physically change the replay. Five short cases end with a changed lantern/side-door transfer incident.

## Play locally

```sh
npm ci
npm run dev
```

Open http://localhost:5202. Dev uses strict port 5202; static preview uses strict port 4202. No backend, authentication, keys or runtime AI. Dependencies and Hebrew fonts bundle locally.

Click the floor or a world label to walk. Arrow keys / WASD move; E inspects the nearest target; Space pauses time; R opens the notebook; F toggles fullscreen; Escape closes reading and pauses. Touch uses world labels or the on-screen arrows. Witness reading pauses time. Words with dotted underlines give Hebrew vocabulary help; replayable speech uses an available local English system voice, with text always present. Sound and reduced motion are in options.

The bottom timeline scrubs the historical loop. `לנסות לשנות` starts an interactive replay. Investigate both viewpoints, inspect a suitcase/cart label, then record activity, opening instant and identity in the notebook. A failed reconstruction remains editable. In a replay, physically latch the relevant closed opening while its mechanism is available, or secure the object before the gust; advance past the gust and return to collect it. Chapter completion requires both supported reconstruction and physical recovery. Reading/pausing does not consume an unaided attempt; solution hints and consequential mistakes do. The final case has no solution hint.

## Build and verify

```sh
npm test
npm run build
npm run preview
```

Pure truth and sentence fixtures live in `src/content.ts` and `src/simulation.ts`. Tests include an independent authored oracle for all five cases. `window.render_game_to_text()` reports state for browser verification; `window.advanceTime(ms)` deterministically steps controls and time while respecting time pause. Events stay in localStorage on this device; no student identities or remote analytics are collected.

## Asset status — important

The initial imagegen design target was generated and inspected before implementation; exact prompt and image are in `docs/visual-targets`. It is a design target, not an actual screenshot.

**Required Tripo GLBs and the porter rig are blocked.** Chrome control timed out repeatedly, briefly recovered to inspect owned assets, then failed again before any submission. No generation, download, rig or credit spend was initiated. Current automata and bird are original procedural temporary geometry; they do not meet the requested Tripo asset requirement. `ASSETS.md` records the blocker and prepared prompts. A local GLTFLoader entry point exists; model scale, rig playback and chapter transitions still require testing when files arrive. No missing models are silently fetched at runtime. The geometry is independent from authoritative temporal/collision rules.

## Static deployment preparation

Vite uses `base: './'`; `npm run build` produces `dist/`. For a future Vercel deployment choose framework Vite, build command `npm run build`, output directory `dist`, and no environment variables. Production deployment is intentionally left for the user.

See `CURRICULUM.md`, `GAME_IDENTITY.md`, `ASSETS.md`, `PLAYTEST.md`, `VISUAL_REVIEW.md` and `progress.md` for verified scope, evidence and limitations. This is a learning-game prototype, not a validated assessment of English proficiency.

For the optional reproducible browser chain, start the dev server, install Playwright’s matching browser with `npx playwright install chromium`, then run `node scripts/browser-check.mjs`. It interacts with normal controls and the deterministic time hook; it never injects a winning state. `GAME_URL`, `BROWSER_EVIDENCE_DIR`, and `PLAYWRIGHT_EXECUTABLE_PATH` may override the URL, capture folder, or installed browser executable. Browser captures default to untracked work/.

First-decision exposure (attempts, hints and completions) also persists locally across restarting and replaying a case, so a repeated completion cannot be described as a first unaided decision.

`node scripts/browser-controls.mjs` separately verifies start/pause focus, notebook Escape, completed-case toolbar guards, fullscreen entry/exit and Next through a legitimate solved case.
