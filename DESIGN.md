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

The waiting-list form requests only an email and the necessary age/consent confirmations. Saving must produce an accurate success or error state. A waiting-list entry must not expose email addresses publicly, create an account, send invitations or grant member access.

## Figma

Create editable desktop and mobile screens for the landing page and waiting list, plus planned product surfaces: wishes/understanding, appointments, healing, reports, sharing and patterns. Include the expanded roadmap through navigation and labelled planned surfaces. Preserve the same source composition, fonts and dark palette. Render text and layout as editable layers rather than a flattened screenshot.

Prototype data must be synthetic. Do not import private records, medical images, correspondence, real member details or credentials.

## Privacy and content boundaries

Private records are not public posts. Private sharing, public posting, report publication, anonymous-gallery contribution and pattern contribution are separate choices. Show selected snapshots and exact versions before sharing. Graphic public medical images require a warning and deliberate reveal; their presence must not expand access to private originals.

Future incapacity/death delivery and human advocacy must be labelled planned. The interface must not imply that an app entry alone establishes consent, appoints a proxy or makes a diagnosis.
