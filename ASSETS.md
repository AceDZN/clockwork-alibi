# Asset provenance and runtime models

## Current status

The required original bird prop and full-body Tripo-rigged porter are acquired and integrated as local GLBs. `public/models/porter.glb` now contains all three completed Tripo clips: walking, custom carrying walk and idle. The runtime loader aliases the long custom export name to `carry`, uses it for the porter, uses `walk` for the player and selects `idle` when stopped. `public/models/asset-status.json` records complete acquisition status. Only the final porter, bird and status manifest remain in `public/models/`; backups have moved to untracked `work/model-originals/`. Final in-game visual/playback evidence is recorded separately from acquisition evidence.

These outputs were generated from original prompts for the commissioned Clockwork Alibi game in the user's account. No third-party discovery model was copied and no other crew's generation was modified. The human authorized public repository use of this game's original assets. The signed-in account selector was read on 26 October and displayed **Pro**. Tripo’s [official commercial-use help](https://www.tripo3d.ai/help/privacy-policy/how-to-use-tripo-models-commercially) describes paid-plan output use and distribution rights; [Terms section 5.2.2](https://www.tripo3d.ai/terms) is the primary paid-user ownership provision. No terms were newly accepted or account plan changed. This records the acquisition basis; it does not assert ownership of unrelated discoverable models.

## Runtime files

| File | Bytes (original = runtime) | SHA-256 | Rig / clips |
|---|---:|---|---|
| `public/models/porter.glb` | 2,021,208 | `2923e98d6526c3944c081796f319402f78ab1bc1c0dbe8316be7f43671011c56` | Tripo Mixamo; one `Armature` skin, 65 joints; `walk` 2.333333 s; custom carrying clip 4.958333 s; `idle` 15.333333 s; each 195 channels; in-place export |
| `public/models/clockwork-bird.glb` | 1,320,748 | `fffa44835dda7e830c66ed243861c16fba4a2c3a4617d36883f49a3d9028fb6f` | Static bird prop; no skin or clip; rigid-body world motion |

The two runtime GLBs total **3,341,956 bytes** (~3.19 MiB). No optimization was needed to meet the per-model ~3 MB target. Exports used GLB and 1k textures. `extensionsUsed` is empty: no Draco, Meshopt or KTX decoder is needed. Original downloaded bytes are preserved under untracked `work/model-source/` and `work/model-originals/`; the runtime files match their final downloaded exports byte for byte. Archived base T-pose: 1,244,004 bytes, SHA-256 `eb03eb0ab4ec98dccdf06d6c9f581dddddad81703c845403772146af9d38fb24`. Archived walk-only version: 1,577,744 bytes, SHA-256 `1b58332793b866aa3213c84eb51cbc4bea9ddc759047354de5484fe1939ee28e`.

Bird geometry bounds: min `[-0.49945074, 0, -0.31747440]`, max `[0.49945074, 1, 0.31747440]`. Porter geometry bounds: min `[-0.49999994, -0.00000013, -0.12113153]`, max `[0.49999988, 0.97711205, 0.12113199]`. These are glTF POSITION accessor bounds; the renderer must compute the complete posed object bounds when fitting/scaling. Tripo displayed porter 19,546 triangle faces / 12,366 vertices and bird 19,070 / 12,813. See `docs/asset-gltf-metadata.json` for local file inspection.

The custom carrying clip exports under the exact truncated prompt name `Clockwork Alibi porter walks slowly in place while carefully ca`, despite its UI title `Balanced Box Carry`. The runtime loader explicitly normalizes this clip name to `carry`; the GLB bytes retain the original export name. Local Three.js checks at t=0.7, 2.5 and 4.5 seconds show a real walking cycle, but the arms remain mostly lowered. The model does not consistently produce the requested bent-elbow chest-height support pose. The lead therefore aligned two handled crates to the actual `mixamorigLeftHand` and `mixamorigRightHand` bone sockets, with upright crates following the real bone motion. This changes the presentation to side-carried handled crates rather than a floating chest-height stack. Final integrated captures show that presentation and browser QA verifies the real carry/walk/idle poses and model persistence. Fine finger-to-handle contact is not claimed as motion-capture-quality gripping. Do not claim the AI gesture precisely matched its prompt.

The lead integrated fitting, animation selection and an independently cloned player skeleton/mixer. File inspection establishes real skin and animation data; the clean final `docs/evidence/integrated/report.json` verifies actual carry/walk/idle use, changing bone pose, independent player skeleton and model persistence through five cases, finish and replay. The selected final PNGs were opened for visual review.

## Tripo jobs and displayed credits

| Operation | Task / page | Displayed cost | Balance observed at action | Status |
|---|---|---:|---|---|
| Original porter, HD Model H3.1, T-Pose on | [Porter generation](https://studio.tripo3d.ai/workspace/generate/de9faa4f-3704-4fc7-9519-dc5919794331) | 30 | 6,815 → 6,785 | Generated and downloaded |
| Original bird, HD Model H3.1, T-Pose off | [Bird generation](https://studio.tripo3d.ai/workspace/generate/4a15e747-79c9-468b-859e-bd1d24b62175) | 30 | 6,785 → 6,755 | Generated and downloaded |
| Porter Humanoid → Mixamo Auto Rig | [Porter rig](https://studio.tripo3d.ai/workspace/rigging/clockwork-alibi-original-clockwork-railway-porter-single-full-body-sl-de9faa4f-3704-4fc7-9519-dc5919794331) | 20 | 6,755 → 6,735 | Complete; 65-joint skin exported |
| `walk` preset retarget | [Porter animations](https://studio.tripo3d.ai/workspace/animate/clockwork-alibi-original-clockwork-railway-porter-single-full-body-sl-de9faa4f-3704-4fc7-9519-dc5919794331) | No extra cost shown | Shared balance later changed independently | Complete; `walk` exported |
| `idle` preset retarget | Same porter animation page | No extra cost shown | Shared account | Complete; exported in combined GLB |
| Custom five-second carrying walk, titled `Balanced Box Carry` | Same porter animation page; prompt below | 20 | 6,675 → 6,655 | Generated, retargeted and exported in combined GLB |

Crew-attributable displayed spend: **100 credits** (30 + 30 + 20 + 20). Two of the maximum three new model generations were used. Required rig/animation processing is additional to that limit. Other crews share the account, so changes outside our confirmed actions are not attributed to this game. Balances are historical observations, not current promises or credit reservations. No purchase, upgrade, subscription, cancellation of another job, or new legal agreement was performed.

## Exact submitted prompts

Porter:

> Clockwork Alibi original clockwork railway porter, single full-body slender friendly brass-and-teal humanoid automaton, ivory faceplate, railway vest, articulated arms and sturdy boots, neutral A pose with hands empty and separated, stylized miniature mechanical theater game asset, no platform no background props no text, clean animation-ready geometry.

Bird:

> Clockwork Alibi original small clockwork festival bird, friendly sparrow silhouette, burnished copper and brass body, teal enamel wing panels, tiny ivory face, visible mechanical wing hinges, standing neutral pose, single game prop, miniature mechanical theater style, no plinth no background props no text.

Custom carrying walk (five seconds):

> Clockwork Alibi porter walks slowly in place while carefully carrying two boxes at chest height. Both elbows stay bent, both palms face up together in front of the torso supporting a stable invisible load. Friendly balanced walking cycle, small steps, no turning, no jumping, no running, no extra objects.

No third model prompt has been submitted. A separate clock generation is unnecessary for the current scope: the acquired porter has an ivory clock face and the acquired bird supplies the required distinctive prop, while the station dial/architecture remain original procedural geometry.

## Browser acquisition method and evidence

Earlier extension-only attempts timed out, recorded in `docs/asset-browser-blocker.md`. On 26 October the crew resumed through documented native `cua.getApp('com.google.Chrome')`. Before every bounded native work session, it atomically acquired `/Users/acedzn/dev/AceDZN-exp/.english-tripo-ui-lock`, wrote crew ownership, and released only its own lock while jobs processed. It opened a new own tab and inspected owned assets before generation. No suitable porter/bird was identified in the inspected subset.

Native input stopped when the human changed Chrome focus. Tab-scoped extension control later recovered on the same own tab (`512279130`) and completed normal export UI downloads without navigating the human's active tab. That tab was later cleaned up, so the crew reopened its own exact porter animation page in a new own tab (`512279154`) to finish the three-clip export, then closed that completed tab. No crew UI lock remains held. No raw Tripo API, token extraction, hidden browser state or alternate modeling service was used.

Evidence:

- `docs/asset-generation-submitted.png`: two original generation jobs and displayed balance.
- `docs/asset-porter-rig-submitted.png`: Mixamo rig job and displayed balance.
- `docs/asset-bird-export.png`: normal bird GLB export UI.
- `docs/asset-porter-three-clips-export.png`: skeleton, in-place setting and three selected animation clips at combined export.
- `docs/asset-carry-animation-submitted.png`: carrying-motion prompt/submission state.
- `docs/asset-local-model-check.png`: actual isolated Three.js render of local bird and porter GLBs, confirming bird identity and porter posed by its real walking clip. This is file/asset verification, not an in-game screenshot.
- `docs/asset-local-carry-check.png`: isolated renderer capture of the real custom clip, showing the lowered-arm limitation.

## Image target, original geometry and font

The lead generated and inspected `docs/visual-targets/target-01.png` with built-in `image_gen` before initial implementation. The exact prompt and mode are preserved beside it. It is a design target, not implemented-game proof.

Station architecture, clock mechanism, containers, lantern, interaction markers and remaining temporary NPC automata are original procedural Three.js geometry. Procedural limbs are not presented as acquired/rigged Tripo characters. Heebo is bundled from `@fontsource/heebo`; its SIL Open Font License is included at `public/fonts/Heebo-LICENSE.txt`. Runtime uses local assets and requires no Tripo service connection.
