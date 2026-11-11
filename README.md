# TransProxy

TransProxy is an open-source project for transgender patients to record what they understand and want before care, document their experiences afterward, and choose what to share. Its initial focus is hospitals, departments, staff and independent providers in the NYC tri-state area (New York, New Jersey and Connecticut), with expansion across the United States planned afterward. The website domain is **transproxy.org**; the source repository is **julienfullstack/transproxy.work**.

Julien's experience and account of why he created TransProxy will be prominent. Personal testimony, documentary evidence, provider responses and verified facts must remain distinguishable. No patient records or private correspondence belong in this public repository.

## Development status

**Waiting-list launch.** The React/TypeScript landing page and dedicated encrypted, adult-only waiting-list API are deployed on **[transproxy.org](https://transproxy.org)** and checked with desktop/mobile production signups. See [deployment notes](docs/DEPLOYMENT.md) for the verification method and hosting state. The complete member platform described below is **planned**, not implemented or available at launch. The first commit established the documentation, AGPL-3.0 license and ignore rules.

The landing-page launch uses a new isolated self-hosted Coolify project with separate frontend, API and private Postgres resources. Existing Cruush and Mount Sinai projects, resources and data are outside this repository's deployment scope. Implementation, deployment and live verification are separate milestones; documentation is not evidence that a feature works.

The site includes a dedicated **Julien’s Story** page and a feature list separating available waiting-list functions from planned member tools. Its own medical/queer identity uses dark frosted glass, neon trans-blue/pink window frames and locally hosted Chakra Petch/Inter typography. The complete waiting-list form leads the landing page, followed by three planned-tool scenes and a closing signup button. The feature previews use the source-derived scrolling timeline; individual report previews keep a note-wall layout. Primary buttons adapt the selected glass/gel surface in the same blue/pink palette. The actual [falling-code effect by Nick Matantsev](https://codepen.io/unframework/pen/pqorjJ) runs with a clean blue/pink output and no TV/CRT effects. The [butterfly effect by yoksel](https://codepen.io/yoksel/pen/BZwWOO) uses its source wing mask and motion as restrained accents above Matrix and behind the interface. Required code/artwork credits are included locally. The main signup button bundles `gss-lang`0.0.6, with a lightweight fallback and reduced-motion support. Fonts, icons and runtime assets are self-hosted; no CDN or relaxed security policy is required.

## Commitments

- **Open source:** publish the application source under AGPL-3.0 and support self-hosting. Publish code, migrations and safe configuration examples; keep secrets and patient data private.
- **Patient control:** private records stay private by default. Sharing, public posting, publication review, gallery contributions and pattern contributions each require a deliberate choice.
- **Encryption:** encrypt waiting-list contacts at rest. The planned member product will offer user-selected end-to-end or server-managed encryption with clear recovery behavior.
- **Recorded understanding:** preserve dated versions of expectations, questions, agreements and refusals. Distinguish when an event happened from when it was recorded. Silence is never clinician agreement.
- **Dignity:** allow medical and graphic recovery images with controlled access and reveal controls. Use respectful, requested feedback rather than attractiveness rankings or medical-safety scores.
- **Accountability:** retain source links, dates, corrections, provider responses and review history. An allegation, moderation verdict or pattern count is not an automatic finding of wrongdoing.
- **Bounded access:** launch for adults aged 18 and over in the NYC tri-state area first, followed by planned expansion across the United States, with a waiting list and invitation-only membership. Public reading and private membership have separate access rules.

## Planned features

| Area | Planned capability |
| --- | --- |
| Wishes and informed understanding | Goals, boundaries, desired outcomes, questions, agreements, refusals and exact dated versions before an appointment or procedure; comparison with the documented plan, operative report and later experience. |
| Surgery folders and appointments | Care-team contacts, surgeon/nurse/social-worker/advocacy numbers, appointment summaries, promises, decisions, supporting documents and follow-up. |
| Healing journal | Private surgery, wound and injury timelines; dated pictures; recovery stages; comfort, pain, sensation and function notes; fluid/drain measurements by time, unit and side, with totals and charts. |
| Selected private sharing | Read-only account invitations, expiring revocable links, selected snapshots, exports and printable care/advocacy/legal packets. |
| Reports and patterns | Reports about staff, departments, hospitals and providers; review before publication; complaint tracking; sourced patterns from reviewed public reports and separately opted-in limited contributions. |
| Shared Experiences | Public chronological experiences and healing updates; anonymous attribution by default; optional display names, pictures, replies and emoji reactions. |
| Anonymous surgery results | Contributor-controlled gallery searchable by surgery, procedure, surgeon, hospital and healing stage, with selected photographs, timelines and optional guided feedback. |
| Provider and advocacy directories | NYC hospitals across all five boroughs first, then major cities including international cities; departments, surgeons, professional advocacy contacts, sources, last-checked dates and reviewed corrections. |
| Legal help | Queer- and trans-friendly legal directory by state/jurisdiction and legal need, with verified licensing information and sourced experience. |
| Healthcare encyclopedia | Searchable transgender healthcare reference and complete procedure guides covering preparation, choices, expected changes, recovery, complications and questions to ask, with sources and review status. |
| Support and volunteering | A members' main community with Discord-style channels and separately invited private subgroups, threads, reactions, pinned resources and volunteer facilitators. |
| Advocacy and fundraising | Quick professional call/email actions, a complaint composer with chosen recipients and records, follow-up history, and optional external fundraiser cards. |

Stream.io is the selected moderation provider for the planned community/publication flows, with a separate TransProxy policy allowing gore. Cruush's moderation policy must remain unchanged. End-to-end private pictures must not be sent to screening without a deliberate selected-copy submission for review.

**Future planned features:** release selected wishes and records after verified incapacity or death, trusted contacts, backup recipients and explicitly authorized human advocates. These are a separate future service, not part of the waiting-list launch. Saving a wish in TransProxy does not itself appoint a legal healthcare proxy or establish legally valid informed consent.

## Access model

Public visitors can read the founder story and, when implemented and reviewed, approved reports, the public feed and reference directories. Invitations are required for accounts, posting, replies, reactions and personal tracking. The main support community is members-only; private groups need separate invitations. Anonymous surgery results default to invited members unless the contributor explicitly chooses public access.

The waiting list checks a complete date of birth against the actual18th birthday and discards that date. It stores the email privately and encrypted. New signups queue one welcome email when delivery is configured; duplicates do not send another. The queue and worker run on our self-hosted API/Postgres; Resend handles external email delivery. Email links support removal from the list. Joining does not create an account or grant access. Invitations must not bypass age eligibility.

## Project documents

- [Scope and allowed change areas](docs/SCOPE.md)
- [Goals and acceptance evidence](docs/GOALS.md)
- [Build plan](docs/BUILD_PLAN.md)
- [Design decisions and source instructions](DESIGN.md)
- [Build checklist](TODO.md)
- [Editable Figma designs and font limitation](docs/FIGMA.md)
- [Deployment and verification evidence](docs/DEPLOYMENT.md)

Local secret files, uploads, patient records, database exports, backups, logs, dependencies, generated builds and agent queues are excluded by `.gitignore` and `.dockerignore`. Safe `.env.example` files, lockfiles, migrations and synthetic source fixtures remain publishable. Ignore rules do not remove already tracked data; every publication still needs a staged-file review.

## License

Licensed under the **GNU Affero General Public License, version 3 (AGPL-3.0)**. See [LICENSE](LICENSE) for the complete license. The license covers this repository's code and documentation; private patient content is not contributed to this repository.

## Local development

Install frontend dependencies with `npm ci` and run `npm run dev` (port 5328). Install API dependencies in `server/` with `npm ci`, build with `npm run build`, then start with `npm start`. For local development set API `PORT=3028`; Vite forwards `/api` there. Configure a separate local Postgres database and the private variables shown in `.env.example`; placeholders are not usable keys. Migrations run before the API listens.

Frontend build: `npm run build`. API build/checks: `cd server && npm run build && npm test`. Set `TEST_DATABASE_URL` to a dedicated disposable database to include the real database integration check; that check deletes its own synthetic test rows. Never point it at production.
