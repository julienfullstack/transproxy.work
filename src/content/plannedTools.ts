export type ToolPageKey = 'reports' | 'correspondence' | 'records' | 'advocacy'

export type ToolCard = {
  title: string
  text: string
  items?: readonly string[]
}

export const PLANNED_TOOL_CARDS: Record<ToolPageKey, readonly ToolCard[]> = {
  reports: [
    {
      title: 'Private incident reports',
      text: 'Document concerns about staff, departments, hospitals and independent providers. Connect an incident to selected appointment notes, records and photos while keeping the private draft separate from any publication submission.',
      items: ['Incident and entry dates', 'People and organizations involved', 'Selected supporting records and images'],
    },
    {
      title: 'Publication and attribution choices',
      text: 'Preview the exact text, names and images before submitting a report for review. Choose anonymous attribution or a display name, request redactions, and manage corrections or withdrawal separately from the private original.',
    },
    {
      title: 'Complaint follow-up',
      text: 'Keep case numbers, acknowledgments, replies and follow-up together. Distinguish submission, acknowledgment, a substantive response and any corrective action communicated by the provider.',
    },
    {
      title: 'Patterns from reviewed reports',
      text: 'Explore reviewed public reports and separately opted-in limited contributions. Distinguish incidents from contributing accounts and limit revealing small-group breakdowns. Report patterns do not establish wrongdoing.',
    },
  ],
  correspondence: [
    {
      title: 'Original messages and attachments',
      text: 'Keep selected emails, letters and care messages with their dates, sources and attachments. Preserve the original material and distinguish quoted messages from your own notes about a conversation.',
    },
    {
      title: 'Linked care context',
      text: 'Connect correspondence to an appointment, complaint or the exact wishes version in effect. Keep explanations, promises, unanswered questions and later responses together without treating silence as agreement.',
    },
    {
      title: 'Selected correspondence sharing',
      text: 'Choose the exact messages and attachments for a read-only invitation or expiring, revocable link. Review the selected snapshot and recipient access before sharing.',
    },
    {
      title: 'Chronological packets and final review',
      text: 'Arrange selected correspondence by date for a care, advocacy or legal packet. For an outgoing complaint, review the recipients, message and chosen attachments before a deliberate send.',
    },
  ],
  records: [
    {
      title: 'Compare wishes and records',
      text: 'Place your recorded understanding alongside care plans, consent documents, operative records and later experience. Keep patient recollections, source documents and provider responses clearly identified.',
    },
    {
      title: 'Dates and revision history',
      text: 'Distinguish when something happened from when it was recorded. Preserve exact dated versions, link the version used for an appointment, and keep conflicting edits visible for review.',
    },
    {
      title: 'Selected snapshots and exports',
      text: 'Choose exact record versions for read-only sharing, downloads and printable packets. Expiry or revocation can stop future access through a link; it cannot erase a copy a recipient has already saved.',
    },
    {
      title: 'Storage and recovery choices',
      text: 'Compare a local-only encrypted vault, end-to-end encrypted sync and server-managed encrypted storage. Review where records live, who can read them, and the backup and recovery responsibilities before choosing a mode.',
    },
  ],
  advocacy: [
    {
      title: 'Patient relations and escalation contacts',
      text: 'Find sourced hospital and department contacts for patient relations, advocacy and escalation. Listings would identify the organization, published contact details, sources and last-reviewed dates.',
    },
    {
      title: 'Queer- and trans-friendly legal help',
      text: 'Find legal-help listings by state, jurisdiction and legal need, with sourced experience and checked licensing information. Review a listing’s sources and freshness before contacting a professional.',
    },
    {
      title: 'Complaint packets and chosen recipients',
      text: 'Prepare a complaint with the selected hospital, recipients, exact message and supporting records. Review the complete packet before choosing to send, then keep case numbers, replies and follow-up together.',
    },
    {
      title: 'Member support and fundraiser links',
      text: 'Use member channels and separately invited private groups for support. Volunteer roles would stay limited to assigned groups; sharing private records remains a separate choice.',
      items: [
        'Threads, reactions, pinned resources and notification controls',
        'Leaving, muting, blocking and reporting',
        'Optional external fundraiser links, with explicit inclusion on anonymous posts because a destination may reveal identity',
      ],
    },
  ],
}

export type StorageOption = {
  title: string
  summary: string
  details: readonly { label: string; text: string }[]
}

export const STORAGE_OPTIONS: readonly StorageOption[] = [
  {
    title: 'Local-only encrypted vault',
    summary: 'A planned vault that encrypts records before keeping them on this device, without record sync by default.',
    details: [
      { label: 'Where it lives', text: 'In this browser on this device. A separate encrypted backup would be your responsibility.' },
      { label: 'Who can read', text: 'The vault would open on your device using your unlock material. Anyone with access to the unlocked vault could read its records.' },
      { label: 'Recovery and sharing', text: 'Recovery would depend on your encrypted backup and recovery secret. Share only deliberately selected exports; local-only storage would not provide hosted sharing links.' },
    ],
  },
  {
    title: 'End-to-end encrypted sync',
    summary: 'A planned way to sync encrypted records while keeping their unlock keys with you and your authorized devices.',
    details: [
      { label: 'Where it lives', text: 'Encrypted copies on the server and your authorized devices, with content encrypted before upload.' },
      { label: 'Who can read', text: 'You and recipients you deliberately grant the necessary access. The design would keep record-content unlock keys off the server; account and delivery metadata would still be processed by the service.' },
      { label: 'Recovery and sharing', text: 'Recovery would depend on retained unlock or recovery material. Selected sharing would need recipient access appropriate to this mode; resetting an account password alone would not recover a lost vault key.' },
    ],
  },
  {
    title: 'Server-managed encrypted storage',
    summary: 'A planned hosted vault whose encryption and authorized access are managed by the service.',
    details: [
      { label: 'Where it lives', text: 'Encrypted records in hosted storage, with access managed through your account and chosen sharing permissions.' },
      { label: 'Who can read', text: 'You, chosen recipients and authorized operators when permitted for service administration or support. This mode would not keep record content inaccessible to the service.' },
      { label: 'Recovery and sharing', text: 'The service would manage the recovery process and access for chosen recipients. Review its recovery and retention terms before selecting this mode.' },
    ],
  },
]

export const STORAGE_CURRENT_NOTE = 'Available today: waiting-list emails and privacy/contact request details are encrypted before storage in our private database. This is server-managed encryption; authorized operators can access information for service administration. The member vault options described here are planned.'

export const LOCAL_STORAGE_NOTE = 'A local vault needs an encrypted backup stored separately, with its recovery secret kept safe. Browser cleanup, private-browsing cleanup, storage eviction or device loss can remove the only local copy. Without a usable backup and recovery secret, lost records may be unrecoverable.'
