import { useEffect, useState } from 'react'
import { WaitlistForm } from './components/WaitlistForm'

const REPO = 'https://github.com/julienfullstack/transproxy.work'

function Home() {
  return <>
    <section className="waitlist-layout" id="waitlist">
      <div className="waitlist-meta"><p className="status-label">Invite-only · Worldwide · 18+</p><h1>Join the TransProxy waiting list</h1><p>Membership is in development. Join for invitations and launch updates.</p><p>The waiting list is open. Accounts, records, reports and community features below are planned.</p><a href={REPO}>View the open-source project ›</a></div>
      <WaitlistForm />
    </section>
    <section className="content-section story" id="story"><h2>My Story</h2><p>Julien Lenaz · Founder</p><blockquote><p>“What I want is accountability.</p><p>I want transgender patients to be able to report what happened to them.</p><p>I want repeated complaints to become visible as patterns rather than disappearing into separate private correspondence.</p><p>I want patients to know whether other people have reported similar experiences.”</p></blockquote><p>From Julien’s account:</p><blockquote><p>“My recollection is that immediately before surgery I specifically sought reassurance that the area would be completely buried and that I would wake up with the appearance I had requested. I have been saying this since shortly after I woke from surgery.”</p></blockquote></section>
    <PlannedFeatures />
    <section className="content-section" id="commitment"><h2>Our commitment</h2><ul><li>Open-source software under AGPL-3.0.</li><li>Self-hosted, with a separate API and private database.</li><li>Private records by default; sharing and publication require an explicit choice.</li><li>Separate patient accounts, documentary evidence, provider responses and verified facts.</li><li>Member control over sharing, export and withdrawal.</li></ul><a href={REPO + '/blob/main/docs/BUILD_PLAN.md'}>Read the build plan ›</a></section>
    <section className="content-section" id="privacy"><h2>Waiting-list privacy</h2><p>We collect your email address, confirmation that you are 18 or older, consent to invitations and launch updates, and the time you join. We ask for your date of birth to check that you are 18 or older, then discard the full date. We use this information to manage invitations and launch updates. Joining does not create an account or guarantee access.</p><p>Your email is encrypted before it is stored in our private database. Authorized project operators can access it to manage the list. It is not public. We use Resend to deliver waiting-list emails and share your email address with that service for delivery; your date of birth is never shared. This launch does not store dates of birth or collect medical records, photos or identity documents, and uses no advertising trackers.</p><p>Contact <a href="https://www.linkedin.com/in/julienlenaz/">Julien Lenaz</a> to withdraw consent or request removal. We retain your address while invitations are being managed, or until you request removal.</p></section>
  </>
}

const PLANNED = [
  ['Wishes, appointments & records', 'Versioned wishes and boundaries, appointment notes, surgery folders, and side-by-side records of what was explained, agreed, refused and performed.'],
  ['Healing journal & results', 'Recovery timelines, photos and drain tracking. Anonymous surgery results searchable by procedure, surgeon and hospital.'],
  ['Reports & patterns', 'Reports across hospitals and providers, reviewed publication, provider responses and complaint timelines. Separate opt-in contributions to patterns.'],
  ['Private sharing', 'User-selected encryption, account invitations, expiring and revocable read-only links, and exports.'],
  ['Community & support', 'Anonymous Confessional posts, replies and reactions. Member channels, private support groups and volunteer facilitators.'],
  ['Directories & advocacy', 'Providers, surgeons, patient advocates and queer/trans-friendly lawyers. Sourced procedure guides, complaint tools and optional fundraiser links.'],
] as const
function PlannedFeatures() { return <section className="content-section" id="planned"><h2>Planned features</h2><p className="planned-label">In development · Not available yet</p><ul className="plan-list">{PLANNED.map(([title,text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ul><p><a href={REPO + '/blob/main/docs/SCOPE.md'}>Full project scope ›</a></p></section> }
function PlannedPage({title, children}: {title: string; children: React.ReactNode}) { return <section><p className="planned-label">Planned · Not available yet</p><h2>{title}</h2>{children}<p><a href="#/my-story">Join waiting list ›</a></p></section> }
function WallOfShame() {return <PlannedPage title="Wall of Shame"><p>Reports across hospitals, departments and providers, with explicit publication review, response tracking and separate evidence types.</p></PlannedPage>}
function Emails() {return <PlannedPage title="Emails"><p>Selected correspondence connected to appointments, complaints and responses. Private records stay private unless the author chooses to share.</p></PlannedPage>}
function RecordsVsEmails() {return <PlannedPage title="Records vs Emails"><p>Compare selected medical records and correspondence on a dated timeline.</p></PlannedPage>}
function DepartmentOfSludge() {return <PlannedPage title="The Department of Sludge"><p>Patient advocacy, complaint handling and response timelines.</p></PlannedPage>}
const ROUTES = [
 {path:'my-story', label:'My Story', view:Home},
 {path:'wall-of-shame', label:'Wall of Shame', view:WallOfShame},
 {path:'emails', label:'Emails', view:Emails},
 {path:'records-vs-emails', label:'Records vs Emails', view:RecordsVsEmails},
 {path:'department-of-sludge', label:'The Department of Sludge', view:DepartmentOfSludge},
] as const
type RoutePath = (typeof ROUTES)[number]['path']
const UTILITY_LINKS: {label: string; to: RoutePath}[] = [{label:'Join waiting list',to:'my-story'},{label:'Wall of Shame',to:'wall-of-shame'},{label:'Records vs Emails',to:'records-vs-emails'},{label:'The Department of Sludge',to:'department-of-sludge'}]
const SLIDES = [
 {title:'TransProxy',text:'Invite-only · Worldwide · 18+',to:'#waitlist'},
 {title:'Wishes & expectations',text:'Planned · Private records and selected sharing',to:'#planned'},
 {title:'Anonymous surgery results',text:'Planned · Browse by procedure and surgeon',to:'#planned'},
]
const FEATURES: {title: string; text: string; button: string; to: RoutePath; icon: React.ReactNode}[] = [
 {title:'Wishes & records',text:'Planned · Private by default',button:'Join waiting list',to:'my-story',icon:<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="12" r="7" fill="currentColor"/><path d="M10 44c0-10 6-17 14-17s14 7 14 17Z" fill="currentColor"/><path d="M17 31v6a4 4 0 0 0 8 0M31 31v4" fill="none" stroke="#fff" strokeWidth="2.5"/></svg>},
 {title:'Wall of Shame',text:'Planned · Hospitals and providers worldwide',button:'View report plans',to:'wall-of-shame',icon:<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="9" width="36" height="34" rx="2" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M6 17h36M15 4v9M33 4v9M12 23h6M21 23h6M30 23h6M12 30h6M21 30h6M30 30h6M12 37h6M21 37h6" stroke="currentColor" strokeWidth="3"/></svg>},
 {title:'Healing & support',text:'Planned · Journals, results and member groups',button:'View community plans',to:'my-story',icon:<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="14" y="4" width="20" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M21 38h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>},
]
const FOOTER_COLUMNS: {title:string;links:RoutePath[]}[] = [{title:'Patient Information',links:['my-story','wall-of-shame']},{title:'Research & Evasion',links:['emails','records-vs-emails']},{title:'For Health Professionals',links:['department-of-sludge']}]
const labelFor=(path:RoutePath)=>ROUTES.find(r=>r.path===path)!.label
const currentPath=()=>location.hash.startsWith('#/') ? location.hash.replace(/^#\//,'') : 'my-story'
function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="currentColor" /><path d="m6.5 4.5 3.5 3.5-3.5 3.5" fill="none" stroke="#fff" strokeWidth="1.8" /></svg>
  )
}

function Hero() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 7000)
    return () => clearInterval(id)
  }, [index])
  const slide = SLIDES[index]
  const go = (step: number) => setIndex((i) => (i + step + SLIDES.length) % SLIDES.length)

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="TransProxy planned features">
      <button className="hero-arrow hero-prev" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
      <div className="hero-caption">
        <a className="hero-title" href={slide.to}>
          {slide.title} <span aria-hidden="true">›</span>
        </a>
        <p>{slide.text}</p>
      </div>
      <button className="hero-arrow hero-next" onClick={() => go(1)} aria-label="Next slide">›</button>
      <div className="hero-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            className={i === index ? 'active' : undefined}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </section>
  )
}

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
  const route = ROUTES.find((r) => r.path === path) ?? ROUTES[0]
  const View = route.view
  const isHome = route.path === 'my-story'

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#/my-story">
            <span className="wordmark-name">
              <span>TransProxy</span>
            </span>
            <span className="wordmark-sub">transproxy.org</span>
          </a>
          <div className="utility">
            <p className="utility-parody">
              Hospital-website parody. Independent of hospitals and healthcare providers.
            </p>
            <ul className="utility-links">
              <li className="utility-phone">1-800-MD-SILENCE</li>
              {UTILITY_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.label === 'Join waiting list' ? '#waitlist' : `#/${l.to}`}><Chevron />{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav className="main-nav">
          <ul>
            {ROUTES.map((r) => (
              <li key={r.path}>
                <a href={`#/${r.path}`} aria-current={r.path === route.path ? 'page' : undefined}>
                  {r.label}
                </a>
              </li>
            ))}
            <li className="nav-search">
              <a href="#/wall-of-shame">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="m15 15 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
                <span>Search</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {isHome ? (
        <>
          <Hero />
          <section className="feature-band">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature">
                <span className="feature-icon">{f.icon}</span>
                <h2>{f.title}</h2>
                <p>{f.text}</p>
                <a className="btn-white" href={f.button === 'Join waiting list' ? '#waitlist' : f.button === 'View community plans' ? '#planned' : `#/${f.to}`}>{f.button}</a>
              </div>
            ))}
          </section>

        </>
      ) : (
        <div className="title-band">
          <h1>{route.label}</h1>
        </div>
      )}

      <main>
        <View />
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <a href="https://github.com/julienfullstack/transproxy.work">Open source · AGPL-3.0</a>
          <span aria-hidden="true">|</span>
          <span>1-800-MD-SILENCE</span>
        </div>
        <div className="footer-columns">
          {FOOTER_COLUMNS.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <ul>
                {c.links.map((p) => (
                  <li key={p}><a href={`#/${p}`}>{labelFor(p)}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="footer-parody">Hospital-website parody. Independent of hospitals and healthcare providers.</p>
      </footer>
    </>
  )
}
