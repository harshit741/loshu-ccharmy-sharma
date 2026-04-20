const DMY_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

function buildDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function parseDmyDate(value: string): Date | null {
  const match = DMY_DATE_REGEX.exec(value.trim())
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  return buildDate(year, month, day)
}

export function parseIsoDate(value: string): Date | null {
  const match = ISO_DATE_REGEX.exec(value.trim())
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  return buildDate(year, month, day)
}

export function isValidDobDmy(value: string): boolean {
  const date = parseDmyDate(value)
  if (!date) return false

  const min = new Date(1900, 0, 1)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return date >= min && date <= today
}

export function formatDobInputValue(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function formatDobForDisplay(value: string): string {
  const date = parseDmyDate(value) ?? parseIsoDate(value)
  if (!date) return value

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
