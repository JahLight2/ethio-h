import { useSyncExternalStore } from 'react'
import { keys, read, write } from '../lib/storage'
import type { AddonId, FrequencyId, WindowId } from '../content'

export type Draft = {
  bedrooms: number
  bathrooms: number
  frequency: FrequencyId
  addons: AddonId[]
  date: string | null
  window: WindowId | null
  name: string
  address: string
  neighbourhood: string
  phone: string
  note: string
}

export type BookingState = {
  draft: Draft
  booked: boolean
  reference: string
}

export const initialDraft: Draft = {
  bedrooms: 3,
  bathrooms: 2,
  frequency: 'fortnight',
  addons: [],
  date: null,
  window: null,
  name: '',
  address: '',
  neighbourhood: '',
  phone: '',
  note: '',
}

const initial: BookingState = { draft: initialDraft, booked: false, reference: '' }

let state: BookingState = (() => {
  const saved = read<Partial<BookingState>>(keys.draft, {})
  return {
    ...initial,
    ...saved,
    draft: { ...initialDraft, ...(saved.draft ?? {}) },
  }
})()

const listeners = new Set<() => void>()

function emit() {
  state = { ...state }
  write(keys.draft, state)
  listeners.forEach((l) => l())
}

export const bookingStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  get(): BookingState {
    return state
  },
  patch(patch: Partial<Draft>) {
    state = { ...state, draft: { ...state.draft, ...patch } }
    emit()
  },
  toggleAddon(id: AddonId) {
    const has = state.draft.addons.includes(id)
    const addons = has ? state.draft.addons.filter((a) => a !== id) : [...state.draft.addons, id]
    state = { ...state, draft: { ...state.draft, addons } }
    emit()
  },
  confirm() {
    // No clock in the reference — four block letters, then four alphanumerics.
    const letters = () =>
      Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]).join('')
    const chars = () =>
      Array.from({ length: 4 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]).join('')
    const ref = `EH-${letters()}-${chars()}`
    state = { ...state, booked: true, reference: ref }
    emit()
  },
  reopen() {
    state = { ...state, booked: false }
    emit()
  },
  reset() {
    state = { ...initial, draft: { ...initialDraft } }
    emit()
  },
}

export function useBooking(): BookingState {
  return useSyncExternalStore(bookingStore.subscribe, bookingStore.get, bookingStore.get)
}
