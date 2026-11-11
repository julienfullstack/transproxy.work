# Legal readiness — TransProxy launch

Research and implementation record, **November 11, 2026**. This is not a legal opinion or a guarantee of compliance, immunity or protection from claims.

This release includes the policy set as clearly labelled **draft documents, not yet in effect**. Their presence on the website does not resolve the missing contact/hosting facts below or establish legal completeness. Do not replace unresolved facts with assumptions.

## Operator and contact

Julien confirmed: “technosovereign aka cruush technologies llc”. The operator is identified as **cruush technologies LLC (Technosovereign)**, without claiming a registered DBA.

Julien requested a new **hello@transproxy.org** address through Namecheap. The current Namecheap session is at a password prompt and has been handed to Julien. The address is not yet established as a usable, monitored inbox. No private home, billing or domain-registration address is authorized for publication; Julien instructed use of the same address as Cruush on November 11: **41 State Street, Suite 112, Albany, NY 12207**, copied from its existing email footer. This address is now included in the policy contact sections and welcome-email HTML/text footer.

The existing Resend sending identity is verified. Sending authorization does not establish an inbound mailbox or monitoring process.

## Current processing and implemented work

The current public service has an adult waiting list and first-party project/story content. Member accounts, clinical tools, payments, medical uploads, reports, galleries and public/community contributions remain planned.

The local release adds:

- Separate, unchecked terms acceptance and specific health-related waiting-list/email consent, with a fixed server-controlled wording version. Date of birth remains a transient eligibility check and is discarded. Old rows are not relabelled and duplicates do not generate another welcome message.
- Website/waiting-list terms; general privacy and distinct consumer-health notices; factual security/cookie information; medical/legal limitations; correction/removal guidance; accessibility contact; and clearly future-labelled publication safeguards.
- An encrypted privacy/contact/content-removal request form. No attachments, public request lookup, automated URL retrieval, external payload forwarding, automatic disclosure or automatic deletion.
- A private operator workflow. Routine listing exposes references/status/deadlines; private interactive review is required for decrypted content. A request is not proof of authority. Verify proportionately before action.
- Enforced retention: active handling, then purge 90 days after closure; earlier purge available; a necessary hold requires a reason encrypted with the payload and a bounded expiry. Startup/hourly maintenance enforces closed-record expiry.
- Printable HTML policy copies generated from the same content as the application, with no JavaScript required to read them. Draft status remains explicit until release facts are resolved.

Current storage encrypts email and request payloads before database persistence. Metadata such as identifiers, status, wording version and timestamps remains operational data. This is server-managed encryption; authorized operators and delivery code can access information as needed. No claim of end-to-end encryption, zero knowledge, full-disk/backup encryption, HIPAA certification or universal security is made.

## Verified infrastructure facts

- Coolify frontend/API and private PostgreSQL use Hetzner Ashburn, Virginia, US infrastructure. The API has no public hostname and PostgreSQL has no public port.
- Ordinary frontend page/asset requests are logged by nginx, potentially including IP/forwarded address, path/query, referrer, user agent and response information. API access logs and Fastify request logging are disabled. API abuse controls process addresses in memory; they are not persisted in the contact tables.
- Docker logs rotate by size: three files of up to 10 MB per container. That is not an exact number of retention days.
- Resend domain and sending DNS records were verified. Its sending region is US East; open/click tracking are off. Its message/delivery history is separate from active-list deletion. No precise account-specific provider/backup erasure period is promised without verifying applicable terms and arrangements.
- Current source has no advertising pixels, product analytics or non-essential browser-profile storage. Self-hosted fonts/icons/effects do not require an external font or CDN request.

## Provider contracts and transfers

[Resend’s Terms §1](https://resend.com/legal/terms-of-service) incorporate its [DPA](https://resend.com/legal/dpa). The DPA binds through terms acceptance and includes applicable EU SCCs and a UK Addendum. This is different from a claim that TransProxy itself is certified or compliant. [Resend’s GDPR disclosure](https://resend.com/security/gdpr/) describes US processing and provider retention; it also states that the service does not provide a HIPAA BAA.

[Hetzner’s Terms §6.2](https://www.hetzner.com/legal/terms-and-conditions/) require customer acceptance of a data-processing agreement through the account, with the relevant selected categories. The terms describe a supplement for third-country products. Acceptance for this account is **unverified**. Two targeted email searches found no supporting message; that is not proof that acceptance is absent. Check the actual account/contract record. Do not publish a claim that this hosting DPA/SCC arrangement has been verified before doing so.

The planned launch scope is the NYC tri-state area (New York, New Jersey and Connecticut), followed by expansion across the United States; worldwide availability is not the launch plan. The controller’s establishment, targeting and any representative, special-category condition, consumer-health or transfer duties need fact-specific review; a general checkbox is not an exemption.

## Primary-source findings

| Topic | What applies to this work |
| --- | --- |
| Honest health claims | Express and implied claims need appropriate support; a disclaimer does not repair a misleading overall impression. The site must not promise diagnosis, treatment, cure, clinical safety or legal results. [FTC guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) |
| Device status | Intended use and each actual function matter. A waiting list and basic records differ from clinical image analysis or treatment recommendations. Do not claim FDA approval or a blanket non-device exemption. [FDA software policy](https://www.fda.gov/medical-devices/digital-health-center-excellence/device-software-functions-including-mobile-medical-applications), [non-device examples](https://www.fda.gov/medical-devices/device-software-functions-including-mobile-medical-applications/examples-software-functions-are-not-medical-devices) |
| GDPR | Controller/contact, purposes/bases, recipients, retention, rights and transfers need accurate notices; special-category processing requires its additional condition. Terms acceptance is not blanket health-data consent. [Official Regulation](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [EDPB lawful-processing guidance](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en) |
| Consumer health privacy | Washington’s law includes sensitive inferences and can reach small entities. Email-only collection is not an automatic exemption. A distinct homepage-linked health-data policy and appropriate purpose/consent/rights operations matter where applicable. [Official statute](https://apps.leg.wa.gov/rcw/default.aspx?cite=19.373&full=true), [Attorney General guidance](https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy) |
| Health breaches/HIPAA | Future multi-source personal health records require a fresh FTC HBNR analysis. HIPAA status depends on relationships and functions, not branding or an encryption label. No automatic HIPAA-compliance claim. [FTC HBNR guidance](https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0), [HHS health-app resources](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-apps/index.html) |
| Email | Primary purpose determines CAN-SPAM classification; naming code “transactional” does not establish exemption. Commercial launch/update messages need accurate identity, a valid public postal address and a functioning opt-out, subject to the actual rule. Keep confirmation narrowly administrative. [FTC guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) |
| UK/EU marketing and cookies | Obtain appropriately specific electronic-mail consent where required. Do not assume that all noncommercial aims fall outside UK direct marketing. Assess actual storage technology; no blanket cookie banner or obsolete analytics exception claims. [ICO electronic-mail guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/key-concepts-for-direct-marketing-using-electronic-mail/), [current storage/access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/) |
| Copyright/UGC immunity | A policy alone does not create a registered DMCA agent or blanket immunity. Do not import adult-platform statements into this first-party waiting-list launch. [Copyright Office §512](https://www.copyright.gov/512/), [agent requirements](https://www.copyright.gov/dmca-directory/faq.html), [official §230](https://uscode.house.gov/us/usc/119-136/t47/s230/) |
| Future medical imagery | Medical nudity is not automatically statutory sexually explicit conduct, but labels are not categorical exemptions. Review actual depictions, activities and age requirements before enabling images. [§2256](https://uscode.house.gov/us/usc/t18/s2256/), [§2257](https://uscode.house.gov/us/usc/t18/s2257/) |
| Future EU/UK hosting/community | Private/invite-only labels do not automatically remove scope. DSA and UK Online Safety duties depend on services, users and content. Review contacts, representatives, illegal-content notices, reasons/appeals and age/access safeguards before launch. [DSA](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng), [Ofcom guide](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/guide-for-services) |
| Intimate-image removal | Covered future platforms need the TAKE IT DOWN Act’s distinct notice/removal operation; copyright procedures alone are insufficient. FTC enforcement began May 19, 2026. [FTC guidance](https://www.ftc.gov/business-guidance/resources/complying-take-it-down-act) |

## Cruush material actually reviewed

The live October 28 legal bundle was matched to the current source snapshot rather than an older July copy. Exact local evidence remains in the ignored session record.

Relevant current files are `src/app/lib/publicLegalContent.tsx`, `src/app/components/PublicInfoPage.tsx`, `src/app/components/SupportRequestForm.tsx`, `src/app/lib/supportApi.ts` and the support-request server route. The actual content-removal page mounts a required-contact form; it is not merely mailto instructions.

The reusable part is the labelled form/state pattern and subject-specific policies. The existing Cruush support storage/provider forwarding pattern was not copied: TransProxy requests are encrypted in its own database. Cruush’s US-only scope, dating/location/face-check details, billing, arbitration, explicit-media/performer provisions and operational promises do not automatically apply here.

## Remaining release evidence and operating duties

Before treating the draft documents as finalized policies:

1. Establish and verify the requested contact mailbox/alias and monitored destination. Preserve existing Private Email MX and Resend sending DNS.
2. Public postal address and email footer populated using the Cruush address selected by Julien on November 11. Final email classification review remains outstanding.
3. Check the actual Hetzner DPA/account record and applicable transfer/representative obligations. Do not manufacture evidence or a compliance badge.
4. Finish policy wording with those facts; remove draft status only after the content matches the actual service and verified operator facts. Show new wording before publishing finalized notices.
5. Verify actual desktop/mobile signup, privacy/request flow, printable policies and native validation. Run a simulator-only live signup after deployment and verify encryption, email delivery and signed removal; delete only synthetic QA data.
6. Verify the deployed API image includes numbered migration003 and the request table/retention worker. Local TypeScript/PostgreSQL checks do not prove Docker image inclusion.

Operators must check the private request queue every business day, assess verification and deadlines, fulfill/record actions appropriately, apply valid holds narrowly and keep provider/backup arrangements current. Policies and an automated purge worker do not replace those responsibilities or qualified jurisdiction-specific legal review.
