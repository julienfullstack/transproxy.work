# TransProxy design decisions

## Source and scope

The starting visual composition is the actual existing Mount Sinai parody application: `/Volumes/good/mtsinaitransgendervictims/src/App.tsx` and `src/index.css`. Reuse its code for the utility header, text wordmark, navigation, captioned hero carousel, three-column band and footer. The old repository remains read-only. Do not replace the composition with an unrelated landing-page template.

Preserve the source composition, relative arrangement and typography except for the explicitly requested TransProxy rename, dark trans-color theme and landing/waiting-list content. The source uses `Helvetica Neue`, Helvetica, Arial and sans-serif for interface text, and Georgia / Times New Roman for the serif wordmark. No hospital logo or mark is authorized.

## Recorded instructions — 2026-11-10

These are Julien's lasting design instructions, recovered from session `01a1c792-cf38-79b3-87e1-8c798f9b6f18`:

- “all.prkcisers put keep the paridy  change the name” — cover all providers, retain the hospital-parody style and rename it TransProxy.
- “Give js cool trans colors and dark theme” — use a dark theme with trans blue and pink.
- “Make s figma build use the desjgn skill” — build editable Figma designs using the Figma design workflow.
- “A place to share my story and qhy i amde this too, promiebattely.” — prominently include Julien's actual story and purpose; use his source material and dated updates without inventing experiences.
- “Make a waiting list.It'll be invite only.” — launch with a waiting list; membership requires an invitation.
- “18+ launch (Recommended)” — the selected launch-age option; retain the adult-only boundary.
- “Same moderator as cruush but allow gore ofc” — use Stream.io with a separate site policy that permits gore; do not change Cruush.
- “Guided feedback (Recommended)” — the selected format for requested feedback on healing photos; no medical-safety score or appearance ranking.
- “Contributor chooses (Recommended)” — the selected surgery-gallery access model; invited members by default, explicit public opt-in per contribution.
- “Members + private groups (Recommended)” — the selected group model; main community for members and separate invitations for private groups.

The current launch instruction adds the landing page and working waiting list: “and also lets put it up with awaitling list com eon”. It does not make the planned member product available now.

## Theme

The recovered design direction uses:

| Role | Color |
| --- | --- |
| Page background | Midnight navy `#0B0D16` |
| Cards/surfaces | Slate navy `#151925` |
| Primary accent/actions | Trans blue `#5BCEFA` |
| Secondary accent/highlights | Trans pink `#F5A9B8` |
| Main text | Soft white `#F7F7FC` |

Use readable text contrast and retain the original source's square-button and hospital-parody structure. The dark palette supersedes the source's light colors; it does not authorize unrelated changes to spacing, sizes, controls or animation.

## Launch UI

The public launch contains a founder/story section based on approved public material, an explicitly planned-feature overview, an adult-only waiting list and privacy information. Keep status honest: waiting-list submission is the working action; member features remain labelled planned. Show new visible wording before committing it.

The waiting-list form requests an email, DOB for an eligibility check only, and the existing age/consent confirmations. Saving must produce an accurate success or error state. A waiting-list entry must not expose email addresses publicly, create an account, send invitations or grant member access. New signups may receive the requested transactional welcome email; this does not grant membership.

## Figma

Create editable desktop and mobile screens for the landing page and waiting list, plus planned product surfaces: wishes/understanding, appointments, healing, reports, sharing and patterns. Include the expanded roadmap through navigation and labelled planned surfaces. Preserve the same source composition, fonts and dark palette. Render text and layout as editable layers rather than a flattened screenshot.

Prototype data must be synthetic. Do not import private records, medical images, correspondence, real member details or credentials.

## Privacy and content boundaries

Private records are not public posts. Private sharing, public posting, report publication, anonymous-gallery contribution and pattern contribution are separate choices. Show selected snapshots and exact versions before sharing. Graphic public medical images require a warning and deliberate reveal; their presence must not expand access to private originals.

Future incapacity/death delivery and human advocacy must be labelled planned. The interface must not imply that an app entry alone establishes consent, appoints a proxy or makes a diagnosis.

## DOB waiting-list update —2026-11-10

Julien: “I want a waiting list out as soon as possible.So make the API and the reset and all the bullshit we use for that same thing as crush.I want to do everything stuff hosted possible.Come on , please tell me you're killing me ask for dob”. Add a required Date of birth field to the existing waiting list and validate18+ on the API. Preserve all existing unrequested presentation and controls. Exact DOB is used only to check eligibility and discarded; it must not enter storage, logs or email delivery. This supersedes the earlier email-only input wording. The app/API/database remain self-hosted; inspect actual Cruush mail setup rather than inventing a different service.

## Julien’s Story and visual refinement —2026-11-10

Julien: “Julien's Story”; “Like make a tab for my story”; “Make a feature list”. Add a dedicated story/blog surface, fuller source-based personal account, brief purpose summary and explicit available/planned feature list. Preserve the changed-decision immediately-before-surgery chronology; distinguish Julien’s experience/recollection from provider replies and independent findings.

Julien: “Use the figma design skill to make a better looking UI I like that you parody Mount Sinai.Can you give me that Mount Sinai vibe?But dark colors and transgender , so I want the mount sinai parody still but make the colors like dark themed and trans”. He explained: “Mount sinai is evil , but they're light colored , so I 'm gonna be good , but dark colored get it”. The visual direction is an inversion of the light institutional hospital site: keep its recognizable utility header, serif wordmark, navigation, carousel, service columns and footer; refine hierarchy and spacing with dark navy surfaces, trans-blue actions and trans-pink emphasis. These words explain the design concept; do not turn them into a new factual allegation in site copy. Keep all waiting-list functionality and all existing navigation destinations.

## Matrix glass refinement —2026-11-10

Julien: “https://codepen.io/simeydotme/pen/PwwYZO

https://codepen.io/unframework/pen/pqorjJ

This matrix shit in the back.I think I want it to be these matrix colors actually.So I like the dark green and these other like blue and pinks and extra , let's make it matrix themed actually , but these colors in this matrix code ben , I want that matrix thing falling down in the background , and I want glass neon shit for the cards and everything else”.

Julien: “It should be glossy , beautiful glass themed . Something beautiful out of pain, neon , a new future”.

Julien: “Same stick t v effect in the back with the matrix stuff falling down for the background”.

This latest direction supersedes the earlier navy-only surface treatment. Retain the recognizable hospital-parody composition and typography; add a dark green Matrix background with falling code and restrained TV/CRT static/scanlines, neon cyan/pink accents and glossy glass cards. The background is decorative, never captures clicks or obscures copy. Respect reduced motion and pause hidden animation. The first reference currently returns404; the second is the inspected CRT/matrix visual reference. No third-party scripts or paid asset generation are needed.

## Glass buttons and palette —2026-11-10

Julien: “https://codepen.io/editor/LukyVj/pen/01a13f4f-03a2-7912-b810-f80a101db33b

Do cool gss stuff for the buttons”.

Julien: “Pick out a good matrix , inspired color palette , where it has some greens , some blues , some pinks and some other cool colors ,”.

Use blackpine#02100d/deepteal#002a2a as foundations; Matrixmint#5dffb4,transcyan#5bcefa,neonpink#ff8bcb andviolet#ad8cff as accents; ice#f4fff9text. Existingsoftpink#f5a9b8canremainintext. Requestedglassbuttonsgetsheenedges/reflectionwithhover/focus/pressedstates while preserving every label, action anddisabledstate.

Julien’s final palette check: “Just make sure the colors of the elements match our theme”. Apply the same palette to every requested surface and effect, including the GSS core; use icy white rather than a separate warm gold accent.
