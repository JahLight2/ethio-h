import { brandSlug } from './brand'

/** localStorage that never throws — private mode, quota, disabled storage. */
export function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(`${brandSlug}:${key}`)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(`${brandSlug}:${key}`, JSON.stringify(value))
  } catch {
    /* storage unavailable — the page still works for this session */
  }
}

export function clear(key: string): void {
  try {
    window.localStorage.removeItem(`${brandSlug}:${key}`)
  } catch {
    /* no-op */
  }
}

export const keys = {
  draft: 'booking',
}
