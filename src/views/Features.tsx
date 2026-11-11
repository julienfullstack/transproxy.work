import { BioFrame } from '../components/BioFrame'
import { AVAILABLE_FEATURES, FEATURE_STATUS_LABELS, FUTURE_FEATURES, PLANNED_FEATURES } from '../content/features'
import type { FeatureItem } from '../content/features'

function FeatureGroup({ title, items, tone }: { title: string; items: readonly FeatureItem[]; tone: string }) {
  return <section className={`feature-group ${tone}`}>
    <h2>{title}</h2>
    <ul className="feature-list">{items.map((item, index) => <li className="bio-pane" key={item.title}><BioFrame compact />
      <span className="feature-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><h3>{item.title}</h3><p>{item.text}</p></div>
    </li>)}</ul>
  </section>
}

export function Features() {
  return <div className="page features-page">
    <FeatureGroup title={FEATURE_STATUS_LABELS.available} items={AVAILABLE_FEATURES} tone="available" />
    <FeatureGroup title={FEATURE_STATUS_LABELS.planned} items={PLANNED_FEATURES} tone="planned" />
    <FeatureGroup title={FEATURE_STATUS_LABELS.future} items={FUTURE_FEATURES} tone="future" />
    <a className="glass-link" href="#waitlist">Join waiting list ›</a>
  </div>
}
