# Scope

## Current delivery

Create the new public `julienfullstack/transproxy.work` repository at `/Volumes/good/transproxy.work`, licensed AGPL-3.0, for **transproxy.org**. First publish documentation and ignore rules. Then build and launch a React/TypeScript landing page and working encrypted 18+ waiting list, with editable Figma designs and a new isolated Coolify project on the existing server.

The full patient/member platform is the planned product scope below. It is not part of the first waiting-list deployment. Implementation status must remain explicit.

## Authorized instructions

- “Make us a new public repo.Make it react full version typescript, just call it transproxy dot work open source, but don't share secrets in the GitHub.Make sure the right files are ignored.Because things are gonna store encrypted on their own.A p I and their own database , a new project et cetera in coolify self hosted”
- “Make a new read me commit push first commit with ignore”
- “Okay, make the scope the goals.The allowed file change areas and the to-do list and get this all together.Make a plan to put this all together , but first , let's do the first commit and do the read me showing that the features we want to build and are open source and our commitment and blah blah blah”
- “Give js cool trans colors and dark theme” and “Make s figma build use the desjgn skill”
- “and also lets put it up with awaitling list com eon”
- “Yea new project reaource self host coolfiy all that shit same server”

The selected license is AGPL-3.0. The repository name uses `.work`; the purchased website domain is `.org`.

## Launch deliverables

1. Documentation-first public commit with README, full license, Git/Docker ignores, design decisions, scope, goals, build plan and TODO.
2. Landing page preserving the real hospital-parody composition and typography, renamed TransProxy with the requested dark trans-blue/pink palette.
3. Prominent source-backed founder story/purpose and clearly labelled planned features.
4. Private waiting list with a discarded DOB eligibility check, server-validated adult eligibility and consent, encrypted contact persistence, duplicate-safe responses, rate limiting and accurate browser success/error behavior.
5. New isolated frontend, API and private Postgres resources in a new self-hosted Coolify project on the existing server. Serve `transproxy.org` over HTTPS; proxy `/api` to the private API resource without a public API hostname.
6. Editable desktop/mobile Figma launch screens and planned core-product screens, with synthetic representative data and screenshot review.
7. Publication review, environment-change listing before deployment, focused functional/security checks and actual desktop/mobile/live browser verification.

No email, invitation or campaign send is included in this delivery.

## Planned member product

### Before, during and after care

- Wishes, goals, expected outcomes, communication preferences, questions, uncertainties, boundaries, agreements, refusals and withdrawn decisions.
- General wishes and appointment/procedure-specific versions; exact dated revisions; separate event and entry timestamps; preserved conflicting edits.
- Surgery folders with clinician, nurse, social worker, advocacy, pharmacy, office and after-hours contacts.
- Appointment summaries, explanations, promises, decisions, unanswered questions and follow-up; attach the exact wishes version in effect.
- A record of what was explained, understood, agreed/refused and later performed. Compare the patient's understanding, surgical plan, consent documents, operative record and experience without automated legal conclusions.
- Encrypted supporting forms, messages, diagrams and photos; distinguish patient recollection from a clinician's directly acknowledged response. Silence never means agreement.
- Healing timelines by surgery, wound or injury; dated photos and milestones; comfort, pain, sensation and function notes; fluid/drain logs by time, unit, side or drain with daily totals/charts.

### Encryption, ownership and sharing

- Private by default, with a user-selected end-to-end or server-managed encryption mode. Explain recovery behavior before selection; mode changes require deliberate re-encryption.
- Browser-side end-to-end encryption with a separate vault unlock/recovery secret; private content and keys must not appear in server plaintext, logs or moderation calls.
- Server-managed content encryption with versioned keys outside Postgres and role-gated audited access; user-granted support access.
- Selected read-only snapshots shared with account invitations or expiring revocable links; exports and printable packets tied to exact versions.
- Recipient/key handling appropriate to the chosen encryption mode; URL-fragment secrets for end-to-end links. Revocation stops future retrieval but cannot erase saved recipient copies.
- Export, withdrawal, sharing revocation and deletion, with documented backup retention and tested recovery. The roadmap target is deletion from active storage promptly and backup expiry within 30 days; validate before promising operational compliance.

### Reports, public experiences and patterns

- Multi-target reports for staff, departments, hospitals, clinics and independent providers; concerns include dismissal/gaslighting, neglect, consent discrepancies/non-consent, medical transphobia, misgendering, advocacy failures, complaint handling and records access.
- Separate patient accounts, documentary evidence, provider responses and independently verified facts. Staff names and publication require review.
- Separate private original records from the selected publication snapshot, with exact text, attribution, names and images previewed before submission.
- Anonymous public attribution by default or an explicit chosen display name. Moderation queues, requested redactions, decisions, corrections, withdrawal and re-review after edits.
- Complaint status: submitted, acknowledged, substantive response and communicated corrective action.
- Public chronological Confessional with selected experiences/healing updates, pictures, replies, editing/deletion and emoji reactions. Anonymous posts must not link to a public profile. Reaction counts do not reveal account identities or change visibility.
- Patterns from reviewed public reports plus separately opted-in limited private contributions. Explain fields contributed; exclude private narrative, images, exact dates and identity.
- Deduplicate incidents and distinguish report counts from contributing-account counts. Suppress small cohorts and revealing filter combinations. The planned initial rule is weekly count bands with at least five distinct contributing accounts.
- Reviewed provider identity normalization; never merge names alone. Label counts as submitted-report patterns, not automated findings of wrongdoing.

### Images and anonymous results

- Encrypted original images and filenames. Planned initial upload limits: three JPEG, PNG or WebP images per entry, up to 5 MB each; validate/decoding limits before storage.
- Stream.io with a separate TransProxy policy allowing gore. Cruush policy remains unchanged. Metadata-stripped selected copies are screened for public review only; incomplete/failed checks remain pending.
- Approved graphic public images behind a warning and deliberate reveal control.
- Anonymous surgery-results gallery searchable by surgery, technique/procedure, surgeon, hospital, location and time since surgery. Before/after timelines, healing, revisions and contributor notes.
- Gallery contributions default to invited members. Contributors may explicitly choose public access; remove metadata, offer crop/redaction, preview selected journal entries and permit withdrawal.
- Optional requested guided feedback about the contributor's stated concerns, with respectful personal observations and care-team contact paths; no medical-safety or attractiveness score. Authors can close replies, block members and report abuse.

### Directories, reference and advocacy

- Provider directory imports from official sources, beginning with NYC hospitals across all five boroughs and relevant departments/surgeons; major international cities in the first expansion.
- Worldwide country/city/local identifiers and original-language names from the data-model stage. Keep facility, system, department, clinician and affiliation distinct; reviewed community additions/corrections, provenance and last-checked dates.
- Professional patient advocacy/relations, directors and escalation contacts with published emails/phones/hours, sources and freshness. Use the department contact when a director's direct details are not published.
- Quick call/email/copy/save actions and a complaint composer: selected hospital, recipients, exact message, chosen attachments, final review, then deliberate send. Track case numbers, replies and follow-up.
- Queer/trans-friendly lawyer directory by state/jurisdiction and legal need; sourced experience, registry/licensing details, costs/languages/remote availability where verified, corrections and optional selected-case sharing.
- Searchable transgender healthcare encyclopedia: terminology, anatomy, hormones, surgery, fertility, sexual health and routine care, with citations, editions, revision history and explicit medical-review status.
- Full procedure guides covering options/alternatives, intended changes/limits, consent questions, preparation, hospital/follow-up expectations, variable healing timelines, function/sensation, complications, revisions and documentation tools. Use permissioned images and qualified review; personal experience stays labelled separately.

### Community and support

- Main member community with channels for general support, surgery, healing and volunteering; separately invited private subgroups by procedure, hospital, location or experience.
- Text, threads, reactions, pins and notification controls. Volunteer facilitators moderate only assigned groups; that role grants no access to private records.
- Selected sharing, graphic-image reveal, leaving/muting, blocking and reporting. The public Confessional remains a separate surface.
- Optional fundraiser cards on profiles, updates and group posts, linking to public external donation pages. Display destination, allow correction/closure/reporting and require deliberate inclusion on anonymous posts because links may reveal identity.

## Future service, separately planned

Verified incapacity/death delivery of selected wishes and records, named trusted contacts, backup recipients and explicitly authorized human advocates. Do not trigger release merely because of a missed check-in. Legal appointment and jurisdiction-specific operating requirements need their own design; the app must not claim to create a legal proxy automatically.

## Access decisions

- Worldwide audience, **18+ launch**. The waiting list and membership must enforce eligibility; invitations do not bypass it.
- Public reading of the founder story, approved reports and public feed, plus reviewed reference/directories when built.
- Invite-only accounts, posting, replies, reactions and private tools. Initial invitations planned as single-use, email-bound and expiring after seven days.
- Main support community restricted to members; private groups require separate invitations.
- Surgery-result visibility chosen per contribution, members-only by default.

## Allowed change areas

| Area | Current allowed changes |
| --- | --- |
| Root documentation | `README.md`, `LICENSE`, `.gitignore`, `.dockerignore`, `DESIGN.md`, `TODO.md`; docs scope/goals/build plan/deployment/Figma records. |
| Frontend | Root package/lock/config files; `src/` launch page, source composition/styles, waiting-list component; `index.html`; public favicon, robots and privacy page. |
| API/data | `server/` TypeScript waiting-list API, configuration/startup/migration, encryption, focused tests, package/lock/config, numbered `server/sql/` migrations. |
| Deployment | Frontend/API Dockerfiles, nginx and entrypoint, compose and safe `.env.example`; new isolated Coolify resources and domain settings only. |
| Design | New TransProxy Figma file, editable desktop/mobile launch and labelled planned product screens. |
| Session records | Current session scope, TODO and review evidence under `/Volumes/good/ai-queues/01a1c822-f16e-7d11-805e-0cd5cabac8da/`; these stay out of Git/build context. |

Only task-owned changes within these areas are authorized. A listed area does not authorize unrelated redesign, content invention, cleanup or release.

## Preservation and exclusions

- Preserve all existing repositories, dirty work, Coolify resources, databases, keys and moderation policies outside the new TransProxy resources.
- Never copy private records, uploads, emails, database contents or secrets into the new public repository or Figma.
- Preserve actual source composition and typography apart from requested rename/theme and new launch content/behavior.
- Do not publish member-product claims as available until implemented and verified.
- No unsolicited messages, campaigns, purchases, domain transfers, existing-resource deletion or privacy/age-rule relaxation.

## DOB and welcome email update —2026-11-10

The requested date-of-birth field is required for server-side18+ validation. The full date is discarded and never stored, logged or sent to the email provider. Existing email/adult/consent controls and all unrelated presentation remain. Same-Cruush waiting-list email setup means one transactional welcome for a new consenting signup, backed by a self-hosted Postgres queue and safe retries, with signed unsubscribe. Resend handles delivery using the existing approved account. This update does not add member accounts, password reset, contact synchronization or campaigns. Existing entries are not backfilled or emailed by this release.
