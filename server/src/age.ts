// Reused from cruush's calendar-date validation: compare actual UTC birthdays,
// not birth years or JavaScript's permissive date-string normalization.
export function ageFromDateOfBirth(value: string, today = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  const birthdayHasPassed = today.getUTCMonth() + 1 > month ||
    (today.getUTCMonth() + 1 === month && today.getUTCDate() >= day)
  return today.getUTCFullYear() - year - (birthdayHasPassed ? 0 : 1)
}

export function isAdultDateOfBirth(value: string, today = new Date()): boolean {
  const age = ageFromDateOfBirth(value, today)
  return age !== null && age >= 18 && age <= 120
}
