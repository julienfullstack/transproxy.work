import { LEGAL_DOCUMENTS, LEGAL_RELEASE_STATUS, LEGAL_VERSION } from '../content/legalDocuments'
import type { LegalDocumentData } from '../content/legalDocuments'

function LinkedText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return <>{parts.map((part, index) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    return link ? <a href={link[2]} key={index}>{link[1]}</a> : part
  })}</>
}

export function LegalDocument({ document: policy }: { document: LegalDocumentData }) {
  return <div className="legal-document">
    {LEGAL_RELEASE_STATUS === 'draft' && <p className="legal-draft-notice">Draft policy · Not yet published or in effect</p>}
    <header className="legal-document-intro"><p className="status-label">Version {LEGAL_VERSION}</p><p>{policy.summary}</p><a className="printable-legal-link" href={`/legal/${policy.path}.html`}>Read printable version</a></header>
    <div className="legal-reading-layout"><aside className="legal-index"><h2>In this document</h2><ol>{policy.sections.map((section, index) => <li key={section.heading}><button type="button" onClick={() => document.getElementById(`legal-section-${index}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{section.heading}</button></li>)}</ol><a href="#/legal-requests">Make a request</a></aside>
      <article className="legal-reading glass-panel">{policy.sections.map((section, index) => <section id={`legal-section-${index}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}><LinkedText text={paragraph} /></p>)}{section.items && <ul>{section.items.map(item => <li key={item}><LinkedText text={item} /></li>)}</ul>}</section>)}</article>
    </div><nav className="related-legal" aria-label="Legal documents">{LEGAL_DOCUMENTS.filter(item => item.path !== policy.path).map(item => <a key={item.path} href={`#/${item.path}`}>{item.title}</a>)}</nav>
  </div>
}
