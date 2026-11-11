import { BioFrame } from './BioFrame'
import { LOCAL_STORAGE_NOTE, PLANNED_TOOL_CARDS, STORAGE_CURRENT_NOTE, STORAGE_OPTIONS } from '../content/plannedTools'
import type { ToolPageKey } from '../content/plannedTools'

export function PlannedToolContent({ page }: { page: ToolPageKey }) {
  return <div className="tool-page-grid">
    {PLANNED_TOOL_CARDS[page].map(card => <article className="glass-panel tool-card bio-pane" key={card.title}><BioFrame compact />
      <h3>{card.title}</h3>
      <p>{card.text}</p>
      {card.items && <ul>{card.items.map(item => <li key={item}>{item}</li>)}</ul>}
    </article>)}
  </div>
}

export function PlannedStorageOptions() {
  return <section className="storage-guide" aria-labelledby="storage-options-title">
    <h3 id="storage-options-title">Local and encrypted storage options</h3>
    <p className="planned-label">Planned member options · Not available yet</p>
    <div className="storage-options">
      {STORAGE_OPTIONS.map(option => <article className="glass-panel storage-option bio-pane" key={option.title}><BioFrame compact />
        <h4>{option.title}</h4><p>{option.summary}</p>
        <dl>{option.details.map(detail => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.text}</dd></div>)}</dl>
      </article>)}
    </div>
    <p className="local-storage-note">{LOCAL_STORAGE_NOTE}</p>
    <aside className="storage-current-note"><h4>Current waiting-list storage</h4><p>{STORAGE_CURRENT_NOTE}</p>
      <div className="tool-related-links"><a href="#/privacy">Privacy Notice</a><a href="#/security">Security &amp; cookies</a></div>
    </aside>
  </section>
}
