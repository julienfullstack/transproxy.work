export type IconName = 'calendar-check' | 'first-aid-kit' | 'chart-bar' | 'share' | 'users' | 'shield-plus' | 'lock' | 'arrow-up-right' | 'chevron-down' | 'search' | 'butterfly' | 'brand-github'

/** Unmodified, locally served Tabler outline assets. See /licenses/tabler-icons.txt. */
export function UiIcon({ name, className = '' }: { name: IconName; className?: string }) {
  return <span className={`ui-icon icon-${name} ${className}`} aria-hidden="true" />
}
