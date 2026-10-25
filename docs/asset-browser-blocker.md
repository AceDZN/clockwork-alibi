# Browser acquisition evidence

The Clockwork Alibi art agent used the required `mcp__cua_repl` browser control tool after the lead's design target was generated and inspected. Calls returned only timeout/reset errors, never browser state or documentation.

| Attempt | API | Result |
|---|---|---|
| 1 | createBrowserTab, Chrome, Tripo My Assets, own descriptive session | 36.404 s timeout; kernel reset |
| 2 | getState | 32.529 s timeout; kernel reset |
| 3 | getState, bounded 60 s tool timeout | 71.069 s timeout; kernel reset |

The generation budget has not been used. No asset, license, current balance or rig status is verified. No screenshots exist for these failed entry calls because no UI snapshot was returned. This file is an acquisition limitation record, not proof of successful Tripo access.

## Availability audit after host-load change — 26 October

Chrome inventory recovered in 13.746 seconds. A new own My Assets tab opened in 10.153 seconds: tab `512279088`, session “🕰 Clockwork Alibi assets”. My Assets UI visibly showed **6,835 credits**. The first approximately 40 named thumbnails and an additional older thumbnail screen were inspected; no appropriate clockwork porter or bird was found in that subset. This was not a complete asset-library search. The screenshot displayed the owned-asset grid and credit balance in the tool result; no local screenshot file was persisted before the connection reset.

| Later attempt | Result |
|---|---|
| Own-tab navigation to Tripo generate page | 22.675 s navigation timeout |
| Fresh own-tab AX state | 31.866 s timeout; kernel reset |
| Post-reset own-tab binding | 36.632 s timeout; kernel reset |
| Lighter Chrome-only binding without page AX | 35.934 s timeout; kernel reset |

The lighter binding failed as well, so the documented screenshot surface could not be reached. Stop further retries until availability changes. No generation or rig was submitted; no credits spent by this crew; no model downloaded. The observed balance is historical and is not a budget reservation. The own tab may be closed automatically by session cleanup or remain open if cleanup failed; do not claim or modify other crews' tabs.
