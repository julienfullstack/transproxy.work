import { BioFrame } from './components/BioFrame'
import { GlassMaterial } from './components/GlassMaterial'
import { useEffect, useState } from 'react'
import { WaitlistForm } from './components/WaitlistForm'
import { MatrixBackground } from './components/MatrixBackground'
import { UiIcon } from './components/UiIcon'
import { PlannedStorageOptions, PlannedToolContent } from './components/PlannedToolContent'
import { BeforeCarePreview, RecoveryPreview, ReportsPreview } from './components/PlannedPreviews'
import { JulienStory } from './views/JulienStory'
import { Features } from './views/Features'
import { LegalDocument } from './views/LegalDocument'
import { LegalRequests } from './views/LegalRequests'
import { LEGAL_DOCUMENTS, OPERATOR } from './content/legalDocuments'
import { juliensStory } from './content/juliensStory'
import './effects/featureScroll.css'

const REPO = 'https://github.com/julienfullstack/transproxy.work'
const PREVIEW_NOTES = ['Communication', 'Consent', 'Follow-up'] as const

function ReportNotes({ full = false }: { full?: boolean }) {
  return <div className={full ? 'report-wall' : 'report-notes'} aria-label="Planned report categories">
    {PREVIEW_NOTES.map(title => <div className="report-note" key={title}>
      <span className="note-pin" aria-hidden="true" /><strong>{title}</strong><small>Planned</small>
    </div>)}
  </div>
}

function Home() {
  return <>
    <section className="waitlist-layout signup-first bio-signup" id="waitlist-section" aria-labelledby="waitlist-title">
      <div className="waitlist-meta"><h1 id="waitlist-title">Join the TransProxy waiting list</h1><p className="opening-purpose">For transgender patients to record what they want before care, document their experiences afterward, and choose what to share.</p><p>Invite-only · NYC tri-state first · USA expansion planned · 18+</p><p className="encryption-label"><UiIcon name="lock" />Encrypted email storage</p></div>
      <div className="bio-form-pane"><BioFrame /><WaitlistForm biotech /></div>
    </section>
    <FeatureJourney />
    <section className="content-section home-story" id="story"><div className="section-bar"><UiIcon name="butterfly" /><span>Julien’s Story</span></div><h2>Why I made TransProxy</h2><p>{juliensStory.summary}</p><a className="glass-link" href="#/juliens-story">Read Julien’s story <UiIcon name="arrow-up-right" /></a></section>
    <PreservedHomeSections />
  </>
}

function FeatureJourney() {
  return <section className="feature-journey" id="planned" aria-labelledby="planned-title">
    <header className="page-heading"><h2 id="planned-title">Planned member tools</h2><p>In development · Not available yet</p></header>
    <div className="journey-chapters">
      <section className="journey-step before-care"><div className="journey-card"><span className="journey-number" aria-hidden="true">01</span><BioFrame card /><div className="journey-copy"><h3>Before care</h3><p>Record goals, boundaries, questions, agreements and refusals in dated versions.</p><a href="#/features">Wishes, appointments & records <UiIcon name="arrow-up-right" /></a><a href="#/features">Private sharing <UiIcon name="arrow-up-right" /></a></div></div><BeforeCarePreview /></section>
      <section className="journey-step during-recovery"><div className="journey-card"><span className="journey-number" aria-hidden="true">02</span><BioFrame card /><div className="journey-copy"><h3>During recovery</h3><p>Keep recovery notes, selected photos and drain measurements together.</p><a href="#/features">Healing journal <UiIcon name="arrow-up-right" /></a><a href="#/features">Surgery results gallery <UiIcon name="arrow-up-right" /></a></div></div><RecoveryPreview /></section>
      <section className="journey-step answers-support"><div className="journey-card"><span className="journey-number" aria-hidden="true">03</span><BioFrame card /><div className="journey-copy"><h3>Reports & support</h3><p>Choose records to share, prepare a report and track responses.</p><a href="#/features"><UiIcon name="users" />Shared Experiences <UiIcon name="arrow-up-right" /></a><a href="#/department-of-sludge"><UiIcon name="shield-plus" />Directories & advocacy <UiIcon name="arrow-up-right" /></a></div></div><ReportsPreview /></section>
    </div><div className="journey-actions"><a className="all-features-link" href="#/features">View all features <UiIcon name="arrow-up-right" /></a><a className="glass-link" href="#waitlist">Join waiting list <UiIcon name="arrow-up-right" /></a></div>
  </section>
}

function PreservedHomeSections() {
  return <>
    <section className="content-section" id="commitment"><h2>Our commitment</h2><ul><li>Open-source software under AGPL-3.0.</li><li>Self-hosted, with a separate API and private database.</li><li>Private records by default; sharing and publication require an explicit choice.</li><li>Separate patient accounts, documentary evidence, provider responses and verified facts.</li><li>Member control over sharing, export and withdrawal.</li></ul><a href={REPO + '/blob/main/docs/BUILD_PLAN.md'}>Read the build plan ›</a></section>
    <section className="content-section" id="privacy"><h2>Waiting-list privacy</h2><p>We will never sell your data or use it to train AI models.</p><p>Your email is encrypted before storage in our private database. Your complete date of birth is checked for adult eligibility and then discarded. Joining does not create an account or guarantee access.</p><p>We use Resend to deliver the requested confirmation, invitations and launch updates; it receives your email and message, not your date of birth. Authorized operators can access information to administer the service. This is server-managed encryption.</p><p>Our notices explain website logs, provider history, retention, rights and the separate privacy/contact request form. Do not send medical records, identity documents or photos through these forms.</p><div className="privacy-links"><a href="#/privacy">Privacy Notice</a><a href="#/health-privacy">Consumer Health Privacy Policy</a><a href="#/legal-requests">Make a privacy or removal request</a></div></section>
  </>
}

function PlannedPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="planned-page glass-panel bio-pane"><BioFrame compact /><p className="planned-label">Planned · Not available yet</p><h2>{title}</h2>{children}<a className="glass-link" href="#waitlist">Join waiting list <UiIcon name="arrow-up-right" /></a></section>
}
function Reports() { return <PlannedPage title="Reports & patterns"><p>Reports across hospitals, departments and providers, with explicit publication review, response tracking and separate evidence types.</p><ReportNotes full /><PlannedToolContent page="reports" /></PlannedPage> }
function Correspondence() { return <PlannedPage title="Correspondence"><p>Selected correspondence connected to appointments, complaints and responses. Private records stay private unless the author chooses to share.</p><PlannedToolContent page="correspondence" /></PlannedPage> }
function RecordsTimeline() { return <PlannedPage title="Records & timeline"><p>Compare selected medical records and correspondence on a dated timeline.</p><PlannedToolContent page="records" /><PlannedStorageOptions /></PlannedPage> }
function Advocacy() { return <PlannedPage title="Advocacy"><p>Patient advocacy, complaint handling and response timelines.</p><PlannedToolContent page="advocacy" /></PlannedPage> }

const ROUTES = [
  { path: 'my-story', label: 'Home', view: Home },
  { path: 'juliens-story', label: 'Julien’s Story', view: JulienStory },
  { path: 'features', label: 'Features', view: Features },
  { path: 'wall-of-shame', label: 'Reports & patterns', view: Reports },
  { path: 'emails', label: 'Correspondence', view: Correspondence },
  { path: 'records-vs-emails', label: 'Records & timeline', view: RecordsTimeline },
  { path: 'department-of-sludge', label: 'Advocacy', view: Advocacy },
] as const
type RoutePath = (typeof ROUTES)[number]['path']
const labelFor = (path: RoutePath) => ROUTES.find(route => route.path === path)!.label
const currentPath = () => location.hash.startsWith('#/') ? location.hash.replace(/^#\//, '') : 'my-story'
const FOOTER_COLUMNS: { title: string; links: RoutePath[] }[] = [
  { title: 'Project', links: ['my-story', 'juliens-story', 'features'] },
  { title: 'Resources', links: ['wall-of-shame', 'emails', 'records-vs-emails'] },
  { title: 'Community', links: ['department-of-sludge'] },
]

export default function App() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onHash = () => {
      setPath(currentPath())
      if (location.hash.startsWith('#/')) scrollTo(0, 0)
      else requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView())
    }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])
  const legalDocument = LEGAL_DOCUMENTS.find(item => item.path === path)
  const isLegalRequest = path === 'legal-requests'
  const route = ROUTES.find(item => item.path === path) ?? (legalDocument || isLegalRequest ? undefined : ROUTES[0])
  const View = route?.view
  const pageTitle = legalDocument?.title ?? (isLegalRequest ? 'Privacy, removal & contact' : route?.label ?? 'Home')
  const moreActive = Boolean(legalDocument || isLegalRequest) || ROUTES.slice(4).some(item => item.path === route?.path)

  return <>
    <GlassMaterial />
    <MatrixBackground />
    <header className="site-header biotech-header">
      <BioFrame compact />
      <a className="wordmark" href="#/my-story"><span className="medical-staff" aria-hidden="true" /><span className="wordmark-name">TransProxy</span><UiIcon name="butterfly" /></a>
      <nav className="main-nav" aria-label="Main navigation">
        {ROUTES.slice(0, 4).map(item => <a key={item.path} href={`#/${item.path}`} aria-current={item.path === route?.path ? 'page' : undefined} aria-label={item.label}>{item.path === 'wall-of-shame' ? <><span className="nav-label-full">{item.label}</span><span className="nav-label-short" aria-hidden="true">Reports</span></> : item.label}</a>)}
        <details className="more-nav" onKeyDown={event => { if (event.key === 'Escape') event.currentTarget.removeAttribute('open') }}>
          <summary className={moreActive ? 'more-current' : undefined}>More <UiIcon name="chevron-down" /></summary>
          <div className="more-menu">{ROUTES.slice(4).map(item => <a key={item.path} href={`#/${item.path}`} aria-current={item.path === route?.path ? 'page' : undefined} onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}>{item.label}</a>)}<a href="#/wall-of-shame" onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}><UiIcon name="search" />Search</a><a className="more-legal-start" href="#/terms" onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}>Terms &amp; privacy</a><a href="#/legal-requests" onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}>Contact &amp; requests</a></div>
        </details>
      </nav>
      <a className="header-join glass-link" href="#waitlist">Join waiting list</a>
    </header>
    <main className={route?.path === 'my-story' ? 'biotech-home' : 'biotech-page'}>{route?.path !== 'my-story' && <header className="page-heading route-heading"><h1>{pageTitle}</h1></header>}{legalDocument ? <LegalDocument document={legalDocument} /> : isLegalRequest ? <LegalRequests /> : View ? <View /> : null}</main>
    <footer className="site-footer">
      <div className="footer-brand"><a className="wordmark" href="#/my-story"><span className="medical-staff" aria-hidden="true" /><span className="wordmark-name">TransProxy</span></a><a href={REPO}><UiIcon name="brand-github" />Open source · AGPL-3.0</a></div>
      <div className="footer-columns">{FOOTER_COLUMNS.map(column => <div key={column.title}><h3>{column.title}</h3><ul>{column.links.map(item => <li key={item}><a href={`#/${item}`}>{labelFor(item)}</a></li>)}</ul></div>)}</div>
      <nav className="footer-bottom" aria-label="Legal and contact"><a href="#/terms">Terms</a><a href="#/privacy">Privacy</a><a href="#/health-privacy">Health data privacy</a><a href="#/security">Security &amp; cookies</a><a href="#/medical-legal">Medical &amp; legal information</a><a href="#/content-removal">Content correction &amp; removal</a><a href="#/community-guidelines">Planned publication rules</a><a href="#/accessibility">Accessibility</a><a href="#/legal-requests">Contact &amp; requests</a><a href="/licenses/codepen-butterflies.txt">Butterfly credits</a></nav><p className="operator-line">Operated by {OPERATOR.name} · <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a></p>
    </footer>
  </>
}
