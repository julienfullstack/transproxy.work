export type FeatureItem = {
  title: string
  text: string
}

export const FEATURE_STATUS_LABELS = {
  available: 'Available now',
  planned: 'Planned',
  future: 'Future service',
} as const

export const AVAILABLE_FEATURES: readonly FeatureItem[] = [
  {
    title: '18+ waiting list',
    text: 'Join with your email address and consent to invitations and launch updates. Your complete date of birth is checked for eligibility, then discarded. Joining does not create an account or guarantee access.',
  },
  {
    title: 'Private contact storage',
    text: 'Your email is encrypted before it is stored in our private database. The waiting list has no public contact directory.',
  },
  {
    title: 'Welcome email',
    text: 'A new signup queues one welcome email through Resend. Repeated signups do not create another welcome message.',
  },
  {
    title: 'Waiting-list removal',
    text: 'Use the removal link in your welcome email to leave the waiting list without creating an account.',
  },
  {
    title: 'Open source and self-hosted',
    text: 'Application source is published under AGPL-3.0. The website, API and database are self-hosted; Resend handles email delivery.',
  },
]

export const PLANNED_FEATURES: readonly FeatureItem[] = [
  {
    title: 'Wishes and informed understanding',
    text: 'Record goals, boundaries, questions, agreements and refusals in dated versions. Compare your understanding with the documented plan, operative record and later experience.',
  },
  {
    title: 'Care folders and appointments',
    text: 'Keep care-team contacts, appointment notes, explanations, promises, unanswered questions and follow-up together.',
  },
  {
    title: 'Healing journal',
    text: 'Document recovery with private photo timelines, milestones and comfort, pain, sensation and function notes. Track drain and fluid measurements by time, unit and side.',
  },
  {
    title: 'Encryption choices',
    text: 'Choose end-to-end or server-managed encryption, with clear unlock, recovery and authorized-access controls.',
  },
  {
    title: 'Private sharing and exports',
    text: 'Select exact records and attachments for read-only invitations, expiring revocable links, exports and printable care or advocacy packets.',
  },
  {
    title: 'Reports and complaint tracking',
    text: 'Report staff, departments, hospitals and providers. Preview selected material before publication review and track acknowledgments, responses and corrective action.',
  },
  {
    title: 'Patterns in patient reports',
    text: 'Explore reviewed reports and separately opted-in contributions, with incident deduplication and protection for small groups.',
  },
  {
    title: 'Anonymous Shared Experiences',
    text: 'Share chronological experiences and healing updates anonymously by default, with optional display names, pictures, replies and emoji reactions.',
  },
  {
    title: 'Anonymous surgery results',
    text: 'Browse results by surgery, procedure, surgeon, hospital and healing stage. Contributors control visibility, selected photographs and optional guided feedback.',
  },
  {
    title: 'Provider directory',
    text: 'Find hospitals, departments and surgeons through sourced listings and reviewed corrections, beginning with NYC’s five boroughs before expanding internationally.',
  },
  {
    title: 'Patient advocacy tools',
    text: 'Find professional advocacy contacts, use quick call and email actions, and prepare complaints with chosen recipients, records and attachments before a final review.',
  },
  {
    title: 'Queer- and trans-friendly legal help',
    text: 'Search by state, jurisdiction and legal need, with sourced experience, checked licensing information and last-reviewed dates.',
  },
  {
    title: 'Transgender healthcare encyclopedia',
    text: 'Search terminology, anatomy, hormones, surgery, fertility, sexual health and routine care, with citations, revisions and explicit review status.',
  },
  {
    title: 'Procedure and recovery guides',
    text: 'Read about options, anticipated changes, consent questions, preparation, healing, complications, revisions and follow-up.',
  },
  {
    title: 'Member channels and private groups',
    text: 'Join member conversations and separately invited support groups, with threads, reactions, pinned resources and volunteer facilitators whose roles do not grant access to private records.',
  },
  {
    title: 'Fundraiser cards',
    text: 'Share optional external donation links on profiles, updates and group posts, with visible destinations and explicit control on anonymous posts.',
  },
]

export const FUTURE_FEATURES: readonly FeatureItem[] = [
  {
    title: 'Wishes delivery and human advocacy',
    text: 'Selected wishes and records delivered after verified incapacity or death, with trusted recipients and explicitly authorized human advocates. This separate future service does not automatically appoint a legal proxy.',
  },
]
