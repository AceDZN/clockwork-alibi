# Asset provenance and acquisition status

## Built-in image target

The lead generated and inspected the gameplay target with the built-in `image_gen` tool before implementation. The target and exact prompt are in `docs/visual-targets/target-01.png` and `docs/visual-targets/target-01-prompt.txt`. This is a generated design target, not a capture of implemented gameplay.

## Tripo acquisition — external blocker

Status: **not acquired**. No Tripo model or rig has been downloaded by this crew yet. Do not describe procedural scene meshes as Tripo assets, rigged characters, or a replacement satisfying this requirement.

The art agent attempted the normal browser entry points through `mcp__cua_repl` in the user's Chrome after the lead confirmed target inspection:

1. `cua.createBrowserTab("chrome", "https://studio.tripo3d.ai/assets", { sessionName: "🕰 Clockwork Alibi assets" })`: timed out after 36.404 seconds; kernel reset.
2. `cua.getState()`: timed out after 32.529 seconds; kernel reset.
3. One bounded availability retry, `cua.getState()` with 60-second tool timeout: timed out after 71.069 seconds; kernel reset.

Those initial calls returned no usable browser state. A later availability audit on 26 October succeeded after host load improved: `cua.getState()` returned Chrome inventory in 13.746 seconds, and a new own tab was opened successfully at My Assets in 10.153 seconds. Own tab ID: `512279088`, session “🕰 Clockwork Alibi assets”. The visible account balance at that moment was **6,835 credits**. Native apps reported the Mac locked, but the Chrome extension surface worked temporarily.

The agent inspected the first approximately 40 named My Assets thumbnails and another screen of older asset thumbnails. They included steampunk pump/spotlight/thermometer props, various buildings, children and other characters. No suitable clockwork porter or mechanical bird was identified in that inspected subset. This was not a complete search of every owned asset, and public discoverability was never treated as license evidence.

Navigation of the own tab to `https://studio.tripo3d.ai/workspace/generate/` timed out after 22.675 seconds. A fresh AX read then timed out after 31.866 seconds and reset the kernel. Post-reset binding of the same own tab timed out after 36.632 seconds. A lighter browser-only binding, without a page accessibility read, also timed out after 35.934 seconds. This prevented reaching the documented screenshot surface and supports a renewed browser-connection availability blocker, rather than simply a slow 3D page tree.

No other crew's tab was claimed, navigated or changed. No purchase, upgrade, generation, cancellation, rigging operation or credit spend was initiated by this agent. No Tripo API, token extraction or alternate modeling service was used. No model task URL, model download or rig operation was reached.

Current blocker: **intermittent browser-control connection**, not a verified credit/login problem. The 6,835-credit balance is a historical observation, not a reserved or current balance. Repeated retries stopped after the renewed unchanged boundary.

## Required local model manifest

| Runtime path | Intended asset | Acquisition | Rig/animation | Bytes/hash |
|---|---|---|---|---|
| `public/models/porter.glb` | Original brass/teal full-body porter | Missing; browser blocked | Tripo full-body rig and walk/carry clip required | Not available |
| `public/models/clockwork-bird.glb` | Small mechanical bird prop | Missing; browser blocked | Static prop may use rigid-body motion | Not available |
| `public/models/station-clock.glb` | Optional owned/generated clock | Missing; browser blocked | Static prop | Not available |

`public/models/asset-status.json` records this state for handoff. It is a status manifest, not a runtime model.

## Approved prompts for resumption

Character (first priority):

> Clockwork Alibi original clockwork railway porter, single full-body slender friendly brass-and-teal humanoid automaton, ivory faceplate, railway vest, articulated arms and sturdy boots, neutral A pose with hands empty and separated, stylized miniature mechanical theater game asset, no platform no background props no text, clean animation-ready geometry.

Bird (second priority):

> Clockwork Alibi original small clockwork festival bird, friendly sparrow silhouette, burnished copper and brass body, teal enamel wing panels, tiny ivory face, visible mechanical wing hinges, standing neutral pose, single game prop, miniature mechanical theater style, no plinth no background props no text.

Optional clock only if no appropriate owned asset:

> Clockwork Alibi original railway station clock, round ivory dial with dark simple hour marks and two hands, teal iron case and copper gear details, single freestanding game prop, stylized miniature mechanical theater, no characters no background no text.

These prompts are prepared and **have not been submitted**. Maximum three new model generations is still intact. The inspected My Assets subset lacked a suitable porter/bird; complete the owned-asset check when browser control is stable.

## Resumption procedure

Use the user's Chrome through current `mcp__cua_repl` documentation. Identify only the Clockwork Alibi tab or open a new own tab. Inspect owned assets at `https://studio.tripo3d.ai/assets`. If appropriate assets are absent, generate using the above prompts and existing credits, without purchases/upgrades/legal changes. Record displayed cost, task URL/id and ownership basis. Download through normal UI. Rig the chosen porter in Tripo with full-body walk/carry animation and export GLB.

For each acquired GLB record original and optimized bytes plus SHA-256, mesh/triangle counts, bounds, clip names, license/ownership evidence and runtime path. Keep originals under `work/` (untracked); optimize runtime models to roughly 3 MB each and initial total under 20 MB where possible. Test actual animation playback in the browser before marking complete.

## Original geometry and font

Station architecture, temporary automata, bird/lantern and mechanical props are original procedural Three.js geometry in src/scene.ts. They are not acquired or rigged Tripo models. Heebo is bundled from @fontsource/heebo; its SIL Open Font License is included at public/fonts/Heebo-LICENSE.txt. No remote font or model is needed to run the current slice.
