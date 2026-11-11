# Build plan

## 1. Documentation-first foundation

Create the fresh repository and first commit containing README, AGPL-3.0 LICENSE, Git/Docker ignore rules, design decisions, scope, goals, build plan and TODO. Review the exact staged files for secrets/private material. Preserve safe environment examples, lockfiles, migrations and synthetic fixtures. Create the public remote and push the documentation commit as authorized.

## 2. Waiting-list launch and Figma

Reuse the actual old application's header/navigation/carousel/three-column/footer composition and typography in the new project; apply TransProxy naming and the requested dark blue/pink theme. Build the public landing page, source-backed founder section, labelled planned features and privacy information.

Build a dedicated TypeScript API and private Postgres waiting list. Accept the email and adult/consent confirmations, validate server-side, encrypt contacts before persistence, handle duplicates without exposing membership, reject invalid origins, rate-limit requests and avoid contact/request-body logging. Joining creates neither an account nor an invitation. Keep runtime keys outside the database/repository and document recovery needs.

Create editable desktop/mobile Figma screens for the launch and labelled planned member flows using synthetic data. Match the source layout, type and palette; inspect screenshots and editable hierarchy.

Run focused API checks and frontend/backend builds. Check the actual form on desktop and mobile with normal application styling. Have a separate reviewer compare the task-owned diff against the recorded request and preservation requirements.

Before deployment, list environment-variable changes. Create a new isolated Coolify project and separate frontend/API/Postgres resources on the existing server. Keep Postgres private, configure domain/CORS/TLS, deploy, then verify actual HTTPS pages/API and browser submission/persistence with synthetic data. Leave all old resources untouched. Record any domain-access blocker honestly.

## 3. Accounts, encrypted records and care folders — planned

Implement invite-only adult accounts and email-bound single-use invitations, session revocation and moderator second-factor authentication. The planned architecture is React/Vite, Fastify, Postgres and Better Auth; validate the actual integration/version contracts at implementation time.

Model accounts, encrypted records/revisions, attachment metadata, care-team contacts and provider identities separately. Add wishes/understanding, surgery folders and appointment records, followed by experiences and the healing journal with fluid/drain logs. Preserve event time, save time and exact linked revisions.

Add user-selected encryption. Evaluate browser libsodium authenticated record/file encryption for end-to-end mode, with separate unlock/recovery secrets; use per-record keys wrapped by versioned server keys for server-managed mode. Verify recovery, key rotation, ownership and interrupted operations before claiming security properties.

## 4. Selected sharing and exports — planned

Add read-only selected snapshots, recipient account invitations and expiring revocable links. Match key wrapping to encryption mode, keep end-to-end link secrets in fragments and avoid secret-bearing logs. Support printable/downloadable care, advocacy and legal packets tied to exact versions. Verify two-account isolation, unselected-field exclusion, expiry/revocation and export contents.

## 5. Reports, publication and respectful public exchange — planned

Add private reporting and a publication moderation queue, reviewed staff/provider identity matching, exact publication previews, correction/withdrawal and complaint follow-up. Build the public Confessional, replies and emoji reactions with anonymous-by-default attribution choices.

Integrate Stream.io through a separate TransProxy policy permitting gore; never change Cruush's policy. Retain encrypted originals, screen selected metadata-stripped copies only with explicit submission, and keep incomplete checks pending. Put approved graphic images behind deliberate reveal controls.

Add anonymous surgery-result contributions from selected journal items, procedure/surgeon filters, default member access, explicit public opt-in and respectful guided feedback. Verify publication boundaries and contributor control with representative photo states.

## 6. Directories, reference, community and advocacy — planned

Build sourced provider imports and reviewed corrections, NYC first and major international cities in the first expansion. Separate systems, facilities, departments, clinicians and affiliation history. Add professional advocacy contacts and state/jurisdiction legal listings with sources and last-checked dates.

Build a source-cited healthcare encyclopedia and procedure guides with editions, revision history, permissioned illustrations and explicit review status. Commission and record the required clinical review rather than presenting unsourced generated content as reviewed guidance.

Add member channels, separately invited private support groups and bounded volunteer roles. Add external fundraiser cards, quick professional contact actions and the complaint composer with selected recipients/records and a final deliberate send step. No automated sending is authorized by this build plan alone.

## 7. Patterns and full-product release — planned

Implement reviewed public-report counts plus separate limited opt-ins from private records, incident deduplication, ambiguous-identity review, count bands and small-cohort/filter suppression. Explain contributions and evidence without automated findings of wrongdoing.

Verify complete mobile/desktop care-to-sharing/publication journeys, adult eligibility, invitations, group isolation, encryption modes/recovery, publication boundaries, moderation policy, backup restore, deletion/retention and operational access. List environment changes before any separately authorized deployment. Do not import old patient data or migrate existing encryption formats without a specific reviewed plan and authorization.

## 8. Future service design

Plan verified incapacity/death delivery, trusted and backup recipients, and authorized human advocates separately. Resolve event verification, disputes, revocation and jurisdiction-specific proxy appointment/operations before building or promising the service. A missed check-in must not automatically release records.

## Repository boundaries

Frontend lives at the root/`src/`, API in `server/`, numbered migrations in `server/sql/`, and source-controlled project documentation in `docs/`. Secret/local configuration uses ignored environment files; only safe examples enter Git. Private records, uploads, dumps, backups, logs, dependencies, generated builds and agent queues remain outside published source and Docker contexts.
