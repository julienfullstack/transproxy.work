import type { ReactNode } from 'react'
import { UiIcon, type IconName } from './UiIcon'

function PreviewWindow({ name, icon, className, children }: { name: string; icon: IconName; className: string; children: ReactNode }) {
  return <figure className={`product-preview ${className}`}>
    <figcaption>Planned product preview</figcaption>
    <div className="preview-window"><div className="preview-title"><UiIcon name={icon} /><span>{name}</span></div>{children}</div>
  </figure>
}

/** Static planned interfaces; no patient data or simulated live account actions. */
export function BeforeCarePreview() {
  const rows: { label: string; icon: IconName }[] = [
    { label: 'Goals', icon: 'calendar-check' }, { label: 'Questions', icon: 'users' },
    { label: 'Boundaries', icon: 'shield-plus' }, { label: 'Appointment notes', icon: 'calendar-check' },
    { label: 'Selected sharing', icon: 'share' },
  ]
  return <PreviewWindow name="Wishes & records" icon="calendar-check" className="before-preview">
    <div className="wishes-preview-body"><ul className="preview-sections">{rows.map(row => <li key={row.label} className={row.label === 'Selected sharing' ? 'preview-selected' : undefined}><UiIcon name={row.icon} />{row.label}</li>)}</ul>
      <div className="preview-records"><div className="preview-versions"><span>Version</span><span>V1</span><strong>V2</strong></div><ol className="preview-timeline">
        <li><UiIcon name="calendar-check" /><span>Appointment notes</span></li>
        <li><UiIcon name="shield-plus" /><span>Wishes & records <small>V2</small></span></li>
        <li><UiIcon name="share" /><span>Selected sharing</span></li>
      </ol></div>
    </div>
  </PreviewWindow>
}

export function RecoveryPreview() {
  return <PreviewWindow name="Recovery journal" icon="first-aid-kit" className="recovery-preview">
    <div className="journal-preview-body"><div className="preview-record-types"><span>Note</span><span>Photo</span><span>Measurement</span></div><ol className="preview-journal">
      {['Day 1', 'Day 7', 'Day 14'].map(day => <li key={day}><UiIcon name="calendar-check" /><span>{day}</span><UiIcon name="arrow-up-right" /></li>)}
    </ol></div>
  </PreviewWindow>
}

export function ReportsPreview() {
  return <PreviewWindow name="Reports & support" icon="chart-bar" className="reports-preview">
    <div className="preview-note-wall">{['Communication', 'Consent', 'Follow-up'].map(label => <div className="preview-report-note" key={label}><span className="note-pin" aria-hidden="true" /><strong>{label}</strong><span className="status-chip">Planned</span></div>)}</div>
  </PreviewWindow>
}
