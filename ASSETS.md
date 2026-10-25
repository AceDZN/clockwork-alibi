# Asset provenance and acquisition status

## Built-in image target

The lead generated and inspected the gameplay target with the built-in `image_gen` tool before implementation. The target and exact prompt are in `docs/visual-targets/target-01.png` and `docs/visual-targets/target-01-prompt.txt`. This is a generated design target, not a capture of implemented gameplay.

## Tripo acquisition — external blocker

Status: **not acquired**. No Tripo model or rig has been downloaded by this crew yet. Do not describe procedural scene meshes as Tripo assets, rigged characters, or a replacement satisfying this requirement.

The art agent attempted the normal browser entry points through `mcp__cua_repl` in the user's Chrome after the lead confirmed target inspection:

1. `cua.createBrowserTab("chrome", "https://studio.tripo3d.ai/assets", { sessionName: "🕰 Clockwork Alibi assets" })`: timed out after 36.404 seconds; kernel reset.
2. `cua.getState()`: timed out after 32.529 seconds; kernel reset.
3. One bounded availability retry, `cua.getState()` with 60-second tool timeout: timed out after 71.069 seconds; kernel reset.

No usable browser documentation, tab state, asset list, account balance, license statement, task ID or download UI was returned. It is unknown whether the first operation created a tab before timing out. No other crew's tab was claimed, navigated or changed. No purchase, upgrade, generation, cancellation, rigging operation or credit spend was initiated by this agent. No Tripo API, token extraction or alternate modeling service was used.

This is a browser-control availability blocker, not a reported credit/login blocker. Existing asset ownership and current credit balance could not be verified. Stop repeated retries until browser availability changes.

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

These prompts are prepared and **have not been submitted**. Maximum three new model generations is still intact. Account-owned existing assets must be inspected first.

## Resumption procedure

Use the user's Chrome through current `mcp__cua_repl` documentation. Identify only the Clockwork Alibi tab or open a new own tab. Inspect owned assets at `https://studio.tripo3d.ai/assets`. If appropriate assets are absent, generate using the above prompts and existing credits, without purchases/upgrades/legal changes. Record displayed cost, task URL/id and ownership basis. Download through normal UI. Rig the chosen porter in Tripo with full-body walk/carry animation and export GLB.

For each acquired GLB record original and optimized bytes plus SHA-256, mesh/triangle counts, bounds, clip names, license/ownership evidence and runtime path. Keep originals under `work/` (untracked); optimize runtime models to roughly 3 MB each and initial total under 20 MB where possible. Test actual animation playback in the browser before marking complete.

## Original geometry and font

Station architecture, temporary automata, bird/lantern and mechanical props are original procedural Three.js geometry in src/scene.ts. They are not acquired or rigged Tripo models. Heebo is bundled from @fontsource/heebo; its SIL Open Font License is included at public/fonts/Heebo-LICENSE.txt. No remote font or model is needed to run the current slice.
