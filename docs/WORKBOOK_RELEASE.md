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
