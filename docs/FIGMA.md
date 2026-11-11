# Figma design delivery

Created **2026-11-10**: [TransProxy — Launch & Product](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc).

This is an editable design deliverable: two waiting-list launch views and twelve **planned** member-product views. The planned screens use fictional example records, providers, contacts and counts. They do not imply that the member product is implemented. The six member-navigation tabs have 60 inter-screen prototype links, connecting the other five views at the matching desktop/mobile size. Other action buttons are visual specifications, not implemented product flows.

## Screens

| View | Desktop | Mobile |
| --- | --- | --- |
| Waiting-list launch | [1440 × 3115](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=4-215) | [390 × 5292](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=4-417) |
| Wishes, appointments and record comparison — planned | [1440 × 2443](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-1883) | [390 × 3247](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-2035) |
| Healing and anonymous surgery results — planned | [1440 × 2763](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-2191) | [390 × 3119](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-2330) |
| Selected encrypted private sharing — planned | [1440 × 2520](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-2473) | [390 × 3147](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-2628) |
| Reports, publication review and patterns — planned | [1440 × 2792](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-2787) | [390 × 3402](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-2948) |
| Confessional, support groups and fundraising — planned | [1440 × 2662](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-3113) | [390 × 3220](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-3270) |
| Provider/advocacy/legal directories and encyclopedia — planned | [1440 × 2669](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-3431) | [390 × 3328](https://www.figma.com/design/02pSNpXxS6TQldcA5jbCWc?node-id=5-3594) |

Pages: `00 · Components & source theme` (`0:1`), `01 · Waiting-list launch` (`2:2`), and `02 · Planned member product` (`2:3`).

## Source and preserved composition

The launch views were built from the actual `src/App.tsx`, `src/index.css` and `src/components/WaitlistForm.tsx`, checked against actual application screenshots. They retain the hospital-parody utility header, four utility links, six navigation cells, captioned striped carousel with arrows and three dots, three-column feature band, source person/calendar/phone SVG order, square buttons, waiting-list/story/plans/privacy content and three-column footer. On mobile, these groups wrap or stack.

The requested dark palette is bound through twelve local Figma color variables derived from source CSS. Shared desktop/mobile headers and footers and the source feature band use reusable local components. Button and checkbox assets were discovered in the Simple Design System library and reused with source-style overrides. A generic library landing template was inspected and rejected because its image-led composition did not match the real source.

**Typography limitation:** the actual application uses `Helvetica Neue`, Helvetica/Arial fallbacks and Georgia for its wordmark. The connected Figma renderer has none of those families: both inventory and explicit font-load checks failed. The editable Figma previews therefore use **Arimo** for interface text and **Lora Bold** for the wordmark. Font readback explicitly confirms these substitutions. **Exact typography and pixel-for-pixel source matching are unverified.** The application's source fonts were not changed. The Figma artifact preserves the composition and intended font specification; replace the preview families when those actual fonts are available in Figma.

## Scope check

| Actual design change | Authorizing instruction |
| --- | --- |
| Rename and all-provider scope while retaining the parody composition | “all.prkcisers put keep the paridy  change the name” |
| Midnight/navy surfaces, trans-blue actions and trans-pink accents | “Give js cool trans colors and dark theme” |
| New editable launch and planned product design views | “Make s figma build use the desjgn skill” and “@figma do it” |
| Waiting-list form, adult eligibility and launch status | “Make a waiting list.It'll be invite only.”; selected “18+ launch (Recommended)”; “and also lets put it up with awaitling list com eon” |
| Wishes, appointments, boundaries, record comparison and care contacts | “a way to record your expectations and your experiences”; “a way to report what you understand your surgery might be and what might actually be done to you” |
| Healing photos, stages and fluid/drain entries | “A way to track how your wound and injury or surgery is healing ... things like fluids from top surgery” |
| Selected sharing, encryption choices, reports and separate pattern opt-in | Selected “user choice”, “Invites and links (Recommended)” and “Separate opt-in (Recommended)” |
| Anonymous results, community, groups, directories, guides and fundraising | Recovered feature requests recorded in `SCOPE.md` and `TODO.md`; these screens remain explicitly planned. |

No private medical record, email, upload, image, identity document, credential or actual provider allegation was imported. Medical-image areas are explicitly labelled fictional placeholders; no real patient pictures appear. The pattern counts are labelled fictional. Incapacity/death delivery remains in the documented future roadmap and is not presented as an available service or legal appointment.

## Evidence

The final structural read returned:

- **14 screen frames**, each with editable text and auto-layout hierarchy.
- **81 text layers per launch view**; **68–83 text layers per planned view**.
- **11 component instances per launch view**, and **5–7 per planned view**.
- **No image-filled nodes** in any screen; no flattened full-UI screenshot is used as a design layer.
- **60 member-navigation links** to other planned screens on the same page and viewport class.
- No horizontal content overflow on any of the twelve planned screens. The launch stripe SVG includes off-frame decorative paths clipped by its fixed hero frame, matching the CSS background treatment; screenshots retain the intended 1440/390-pixel widths.
- Rendered font families: Arimo and Lora, with the source-font mismatch explicitly recorded above.

All fourteen final full-view screenshots were captured and visually inspected. The screenshot pass identified and corrected text reflow, library button-label sizing, mobile checkbox wrapping and feature widths. Final desktop/mobile launch views were compared with actual application screenshots, including the restored fourth utility link and original icon order. The views have readable labels and no observed clipping or text overlap after those corrections.

Screenshot evidence remains in the ignored session queue, not the public repository: `figma-launch-desktop.png`, `figma-launch-mobile.png`, and corresponding `figma-{care,healing,sharing,reports,community,directory}-{desktop,mobile}.png` files under `/Volumes/good/ai-queues/01a1c822-f16e-7d11-805e-0cd5cabac8da/`.

Figma file key: `02pSNpXxS6TQldcA5jbCWc`. Work session: `ddd14bf9-0483-40c4-bc79-2bad3a4f3ab9`. This document records design evidence only; live deployment and API validation are recorded separately.
