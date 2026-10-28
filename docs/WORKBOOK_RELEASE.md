# Workbook English Games release · 2026-10-28

Clockwork Alibi now has one 50-level campaign across ten story settings, with saved progress and a Continue action. Difficulty grows with level position; every level is selectable and no grade selection limits the campaign. New chapters add original reading incidents, container logs, relative-time reasoning, reported speech, passive agents, conditions and four required conclusions in the final chapter.

- Game page: https://english-games.workbook.co.il/clockwork-alibi
- Player: https://english-games.workbook.co.il/clockwork-alibi/play
- Direct levels: `?level=1` through `?level=50`.
- Game build source: `2dacc795b530abaa7395a53ab16e10a26ee8b3fa`.
- Catalog PR: https://github.com/AceDZN/acedzn-tools/pull/367 (merged).
- Catalog merge: `11f3a34b30c4e0c90a3a477e2d6d6ab1953119ad`.
- Immutable release: https://assets.acedzn.xyz/games/clockwork-alibi/2026-10-28/
- Preview: `dpl_GTu88HeS1gxg1XudENecJ2DzrrAC`, READY; successful English Games build in 55 seconds.
- Production: `dpl_9aJC9wGJiyFocBrrVovWou3UkXmf`, READY on the public custom domain, from main commit `877f116bf5afd27fffed139031abae0d1fa7a4ad`, which contains the catalog merge above. The initially queued deployment was superseded by this newer main build.

All 203 game checks and the static build/typecheck pass. The browser campaign completed every reconstruction and physical rescue across all 50 levels, rejected/corrected the final inference, rejected an early clamp, collected the key with the live timeline control, and verified the last-level ending, all 50 saved completions, reload/Continue and actual 390×844 touch map/reading. Console and HTTP error lists were empty. It uses ordinary UI controls and deterministic movement/time stepping, batched in the browser under host contention; it never assigns internal game state or injects victories. The installed action/capture client also passed at level 50. Actual scene, map, conclusion, contradiction, ending and mobile screenshots were opened and inspected.

The final production bundle passes fresh iframe links at levels 1, 4, 5, 6, 16, 26, 36 and 50; ready precedes start after both models mount, and actual first-case reconstruction/recovery emits one completion before Next starts level 2. All 29 public files (4,621,764 bytes including poster) return 200, match the tested SHA-256 hashes and use immutable caching. All nine mapped English lesson pages return 200. Catalog tests (9), shared lesson/analytics tests (9), catalog typecheck/lint and the remote app build pass.

The actual public flow passes home → Clockwork Alibi → level 50, all 50 catalog links, four required conclusions, loaded models/readiness, witness questions and the unrestricted 50-entry map. At 390×844, level 46 supports actual touch navigation, LTR reading, activity saving and the next-step transition. Game-console and game-asset HTTP errors were empty. The surrounding shell logged two nonblocking 403 responses; sign-in was not tested. A scoped production error/fatal log query returned no groups. The game page, player, versioned iframe entry, manifest and porter model all return 200; the iframe entry matches the tested bundle. An initial extra HTTP probe used obsolete unversioned asset URLs and was corrected to the catalog’s versioned play path. The first public browser attempt timed out starting local Chrome under host load; the retry with a longer launch allowance completed all public checks. Selected real public screenshots were opened and inspected.

The ten settings reuse the station architecture with distinct signs, background colours, set dressing and recovered objects. The original character rigs remain; the new props are procedural meshes. These checks establish functional consistency and observed interaction behaviour, not learning gains, student-device performance or enjoyment. Detailed campaign scope: [CAMPAIGN.md](CAMPAIGN.md). Evidence: [evidence/campaign](evidence/campaign/).

---

The initial five-case release below is historical.

# Workbook English Games release · 2026-10-26

- Game page: https://english-games.workbook.co.il/clockwork-alibi
- Player: https://english-games.workbook.co.il/clockwork-alibi/play
- Cases: add `?level=1` through `?level=5` to the player URL.
- Catalog integration: https://github.com/AceDZN/acedzn-tools/pull/358 (merged).
- Game build source: `2440ec041d8c37094574bdaff2284da05346f51b`.
- Catalog merge: `38fdff952d9868df1bf320f6ae5bc78eeec49391`.
- Immutable release: `https://assets.acedzn.xyz/games/clockwork-alibi/2026-10-26/`.
- Production deployment: `dpl_CdrJ26N4B54RqAmWmVAJF4r3Ybyw`, READY, on the existing `acedzn-workbook-english-games` project. Preview and production builds completed in47s and53s respectively, including the app's TypeScript check.

The network hosts all five cases, with a gameplay poster and Grade8 chapter2 mappings for `when-stories-intersect`, `feelings-motives-and-sequence` and `events-and-past-questions`. The final changed transfer names no lesson or solution hint. The shared catalog supplies the existing app's card, page, level links, lesson links and same-origin bundle rewrite; the game was not ported to React and no new Vercel project or backend was created.

## Verification

60 game checks and the static build/typecheck pass. The full five-case regression covers mistakes/corrections, normal touch actions, original-history replay, questions/key, imported animations, transfer and Play Again. Final iframe checks verify every deep link, ready/start ordering, actual case1 completion and subsequent case2 start. A deep-link race was fixed so downloading the bird during case5 caches it without replacing the lantern.

All29 public release files (4.4MB with poster) were fetched and matched local SHA-256 hashes. The actual public site was then tested from home → card → game page → case4, including all three lesson mappings, mounted models, loading-overlay dismissal and three witness questions. At390×844, actual touch navigation, English reading, activity recording and the next-step transition pass. HTTP checks return200 for the game page, case player, iframe entry, model manifest and GLB rewrite. All three live English lesson pages also return200 and link back to the expected cases1,3 and4. Selected real PNGs and reports are under `evidence/workbook/live/`; the screenshots were opened and visually inspected.

The scoped production error/fatal log scan after those requests returned no records in its15-minute window. The surrounding site's Clerk client returns403 at `https://clerk.workbook.co.il/v1/client` during automation, reproduced on both existing Rule Rascals and Clockwork Alibi pages. Game assets and game-console checks are clean, and anonymous play succeeds. Sign-in itself was not tested, and no authentication settings were changed here.

Catalog/release checks(6), lesson/analytics checks(9), catalog typecheck and formatting pass. A broad unchanged-wrapper typecheck was stopped locally after20minutes under severe host load; Vercel's successful English Games preview/production builds supplied the app TypeScript/build validation. These are functional checks, not student-device, enjoyment or learning-gain claims.

Reproduce the public UI check with installed Chrome and Playwright using `node scripts/browser-network.mjs`. It accepts `NETWORK_URL`, `REVIEWER_OUTPUT_DIR` and `REVIEWER_PLAYWRIGHT_MODULE`. Local iframe validation is `node scripts/browser-host.mjs` with the usual `REVIEWER_*` options described in PLAYTEST.md.
