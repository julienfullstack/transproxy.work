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

## Website-first Figma handoff —2026-11-10

Julien: “Make a figma thing too but do fhe website first”. Publish and verify the real website before finishing matching editable desktop/mobile launch, story and feature designs. The v2 story design may reproduce Julien’s approved public personal account so it matches the requested website. Future member-product mock data stays fictional; raw private records, correspondence, contacts and medical images remain excluded. Figma’s Matrix/GSS decoration is an editable still; the actual site supplies and verifies the motion.

## Actual CodePen correction —2026-11-10

Julien: “Looks ugly as shit.I hate it.Where's The Matrix shit in the background?I x for”.

Julien: “I want the falling matrix stuff in the background with the TV static. You didn't do that.”.

Julien: “I gave you a codepen for it and use it”.

Julien: “Bruh use the codepena i send thats the point”.

Use the supplied working unframework/pqorjJ falling-code and WebGL CRT/TV effect itself, rather than a newly drawn imitation. Keep the actual locally bundled GSS button reference. Self-host runtime files and retain source/license notices; preserve all current content and controls. Make the requested background clearly visible and finish the website before updating Figma.

## Original hospital parody, black/trans palette — 2026-11-10

Julien: “Use a design skill and make a better u I this looks like ass”. “I want to go back to the original idea where it looks like a parody amounts on his website , but in dark theme and transgender neon colors”. “So I wanted to look at like mountaineer's website , like I did before , but in a dark theme with neon transgender colors”.

Julien: “Keep it subtly in blue and pink”. “Maybe remove the t v static effect and just keep the matrix stuff”. “Yes, sounds sexy.So no green , dark black , or something similar color background”.

These latest instructions supersede the earlier green/teal palette and CRT direction. Restore the selected original hospital composition: compact utility header, divided navigation, modest hero caption, continuous three-column service band and square glossy controls. Use near-black foundations with trans-blue/pink accents. Keep the actual supplied falling-code logic subtly behind the interface; remove TV static, scanlines, distortion and glitch. Preserve existing content, all controls and backend behavior.

Julien supplied https://codepen.io/yoksel/pen/BZwWOO: “Maybe also, this in the background as a shader, just some cool butterfly things to represent healing, but we color them, I guess to match the themes of the website.I guess”. Inspect and reuse that actual effect as restrained blue/pink decorative motion; keep content legible, clicks unobstructed, and reduced motion supported.

Julien: “So put the butterflies on top of the matrix effect , and then put this stuff on top of that”. Required layer order: Matrix at the back, butterflies above Matrix, website UI above both; decoration remains inert and click-through.

## Own medical/queer identity — 2026-11-10

Julien: “Remove the mount sinai kind of accents and make it our own”.

Julien: “Yes, remove them”.

Julien: “Make the headers and cards in content glass , black , clear glass or frosted glass with neon styling”.

Julien: “I'm still not feeling to say you.I.We have a different direction from the original plan.With the amount signing website, look at our new plan and design AU.I, that is elegant, dignified.That feels medical, but in a fun queer way.Butterfly accents are preferred , as well as the symbol with the snake that doctors use in medicine do no harm”.

Julien: “I want a dark seam, though, with transgender colors as the primary accents, it might be a dark blue as opposed to a black theme, but I want it to be AD theme that's opposed to light themed for sure.I want the matrix accents and butterfly accents somewhere I want the u I to feel easy to use and fit the features that will have”.

Julien: “Use the design decode or whatever fuck you use to design the flash feature.Initially, you use a skill that made a good result, use it again.I want something that feels medital.Queer and dignified all the same time , but also transformative”.

Latest direction replaces hospital imitation as the design target. Remove the hospital jokes, fake phone, parody disclaimers and hospital-specific visual accents. Use own TransProxy brand: elegant and dignified, medical and queer, transformative; deep midnight blue/black rather than light, trans blue/pink primary accents, frosted/clear dark glass headers and cards with restrained neon. Retain Matrix and butterfly accents in the requested layer order; add the requested single-snake medical staff symbol. Preserve actual feature content, privacy/eligibility and backend behavior; keep legacy route URLs while using straightforward Reports/Advocacy labels.

Julien: “So you can rename things like the wall of shame.I want it to better fit the features we discussed”.

Julien: “But i need a tab up top about my story too and why i made this”.

Julien: “I like the idea of individual complaints being kind of like post notes on a wall like you had before though that looked nice.That could be like artificial or something like that.I don't want the holiday confessional , call something else”.

Use clear feature-led labels: Reports & patterns, Correspondence, Records & timeline, Advocacy, and Shared Experiences (replaces Confessional). Keep Julien’s Story top-level, including why TransProxy was created. Individual complaint reports retain the note-on-a-wall visual metaphor. These future member capabilities remain labelled planned.

## Feature-first techno refinement — 2026-11-10

Julien: “You made a very random quote for the like things about my story.You talked about me talking about the correspondence, but that is so out of place.I want the features that we're going to build to be the main point and I want to make sure the waiting list is encrypted.And I'll put in rescent and all in the database , and correct in dns etc

Make sure you're putting the right stuff and getting ignored anything that would reveal our secrets as well as the type of encryption we use should be in git ignore”.

Julien: “I'm still not feeling this u I i want a complete redesign based on the features we'll have”.

Julien: “Pretty good , but no a I generated illustrations , please , and can we pick a different font”.

Julien: “Let's do something techno”.

Julien: “This one, but can you make it more original?Let me show you some references”.

Julien: “And why are the emails?So that's when people sign up for the emailing list , they'll get a email in the right theme to match the website , confirming them”.

Julien: “Techno vibes”.

The attached6693.jpg selects the third displayed concept as the base, then requests greater originality and additional references before refinement. Feature information leads, story remains in its dedicated topnav/tab with purpose summary; remove the out-of-context homepage quotation blocks. Use techno typography and no AI-generated illustration assets: the actual supplied CodePen butterfly/Matrix effects and licensed icon assets remain. Transactional signup confirmation emails must follow the final dark trans-blue/pink website theme; Correspondence is the separate planned records feature.

Julien supplied https://codepen.io/BlurSoulx/pen/PoVRBaz and clarified: “That if I but neon and trans colors , so neon pick and neon blue”. Blend that actual Y2K window/technical-type visual reference with the selected feature-first design, neon pink and neon blue. Do not carry over its unrelated mascots, personal branding, social links or external textures.

## Implemented selected refinement — 2026-11-10

Julien: “Like that but also glass”. The selected feature-first mock plus BlurSoulx Y2K reference were combined and shown before implementation. Use Chakra Petch headings and Inter body, neon blue/pink glass window bars, six planned feature categories, a note-wall preview and a wide encrypted-email signup panel. The complete redesign replaces the earlier hospital utility bar, hero carousel and service band. Legacy routes remain reachable through primary navigation, More and footer; on phones Reports is a shorter visual label with the full accessible name. Actual source butterflies use one original six-face cube and omit the dark-matter inset shadow; original wing and group motion remain. No AI-generated illustration is shipped. The medical-staff favicon reuses the licensed source icon.

## Signup-first patient journey — 2026-11-11

Julien: “The number one thing should be the waiting list and then the features right below it”. Julien: “Trying to sell a thing, make it attractive.Use a design skill that makes you think like a natural designer to sell something”. This supersedes the earlier feature-grid-first ordering. The complete actual signup form leads in one purposeful glass opening section; features follow immediately in three different patient-journey scenes (before care, recovery, reports/support), with honest planned product previews. Keep the story tab, techno/trans/glass/source-effect direction and all privacy/eligibility controls. New wording was shown in the combined revision before implementation. No fake live patient records, clinical outcomes or window controls; no AI illustrations. Legal policy research/implementation is also requested, without cure, compliance or legal-immunity claims.

## Approved design and button-only refinement — 2026-11-11

Julien: “I like it but lets amke the buttons better”. Julien supplied https://codepen.io/simeydotme/pen/NPxaprq and confirmed “This for buttons”. Use this corrected actual reference for existing primary glass buttons in the current trans blue/pink theme. Preserve approved layout, sizes, typography, labels, actions, validation and disabled states; no unrelated redesign.

Julien corrected the earlier references: “Aorru wrong onrs”. He then cancelled the separate blur request: “Sorry dont use the blur my bad”. Do not use a blur wipe anywhere; do not apply the two retracted references as button targets.

## Feature scrolling sequence — 2026-11-11

Julien supplied https://codepen.io/editor/powen-cs/pen/01a1c63d-0e3b-76e5-9fa6-a1d8dc6fc008: “Maybe some of this cool scrolling down shit for like the features I don't know should serve with the features and then end with a wait list or vice versa”.

Use the actual Animation Timeline reference by Phil Owen for the existing home feature sequence: scroll-filled left rail, restrained hinged product-preview entrances and drawn neon borders. Keep the previously explicit waiting-list-first priority and finish the feature sequence with a button back to that form. Retain View all features. Keep feature text stable and all content available in unsupported/reduced-motion browsers. No blur wipe, original demo hero/year counter, new fonts/background, scroll capture or exaggerated full-screen spacers. Preserve the approved gel buttons, source backgrounds, story/legal content and form behavior.
