import { describe, expect, it } from 'vitest'
import { DEFAULT_PERSISTED_STATE, loadPersistedState, savePersistedState, type StorageLike } from './storage'

function memoryStorage(initial: string | null = null): StorageLike & { value: string | null } {
  return {
    value: initial,
    getItem() { return this.value },
    setItem(_key, value) { this.value = value },
  }
}

describe('storage adapter', () => {
  it('round-trips versioned state without calculator mode or theme preference', () => {
    const storage = memoryStorage()
    const state = { ...DEFAULT_PERSISTED_STATE, memory: 42 }
    expect(savePersistedState(state, storage)).toBe(true)
    expect(loadPersistedState(storage)).toEqual(state)
    expect(storage.value).not.toContain('"mode"')
    expect(storage.value).not.toContain('"theme"')
  })

  it('loads legacy state with mode and theme fields and preserves user data', () => {
    const history = [{ id: 'legacy-1', expression: '2+2', result: '4', createdAt: 123 }]
    const legacy = JSON.stringify({
      version: 1,
      state: {
        angleMode: 'RAD',
        theme: 'dark',
        mode: 'advanced',
        memory: 7,
        history,
      },
    })
    expect(loadPersistedState(memoryStorage(legacy))).toEqual({
      angleMode: 'RAD',
      memory: 7,
      history,
    })
  })

  it('accepts every valid legacy theme value but ignores it', () => {
    for (const theme of ['system', 'light', 'dark']) {
      const legacy = JSON.stringify({ version: 1, state: { ...DEFAULT_PERSISTED_STATE, theme } })
      expect(loadPersistedState(memoryStorage(legacy))).toEqual(DEFAULT_PERSISTED_STATE)
    }
  })

  it('falls back for corrupt or inaccessible storage', () => {
    expect(loadPersistedState(memoryStorage('{broken'))).toEqual(DEFAULT_PERSISTED_STATE)
    const blocked: StorageLike = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
    expect(loadPersistedState(blocked)).toEqual(DEFAULT_PERSISTED_STATE)
    expect(savePersistedState(DEFAULT_PERSISTED_STATE, blocked)).toBe(false)
  })

  it('rejects invalid schemas', () => {
    const invalid = JSON.stringify({ version: 1, state: { ...DEFAULT_PERSISTED_STATE, theme: 'neon' } })
    expect(loadPersistedState(memoryStorage(invalid))).toEqual(DEFAULT_PERSISTED_STATE)
  })
})
