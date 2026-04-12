import { afterEach, beforeEach, vi } from 'vitest'

type StorageRecord = Record<string, string>

type StorageLike = {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
    removeItem: (key: string) => void
    clear: () => void
    key: (index: number) => string | null
    length: number
}

const createMemoryStorage = (): StorageLike => {
    let storage: StorageRecord = {}

    return {
        get length() {
            return Object.keys(storage).length
        },
        key(index: number): string | null {
            return Object.keys(storage)[index] ?? null
        },
        getItem(key: string): string | null {
            return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null
        },
        setItem(key: string, value: string): void {
            storage[key] = String(value)
        },
        removeItem(key: string): void {
            delete storage[key]
        },
        clear(): void {
            storage = {}
        }
    }
}

const ensureStorage = (storageName: 'localStorage' | 'sessionStorage'): StorageLike => {
    const currentStorage = globalThis[storageName] as Partial<StorageLike> | undefined

    if (
            currentStorage &&
            typeof currentStorage.getItem === 'function' &&
            typeof currentStorage.setItem === 'function' &&
            typeof currentStorage.removeItem === 'function' &&
            typeof currentStorage.clear === 'function'
    ) {
        return currentStorage as StorageLike
    }

    const memoryStorage = createMemoryStorage()

    Object.defineProperty(globalThis, storageName, {
        value: memoryStorage,
        configurable: true,
        writable: true
    })

    return memoryStorage
}

const safeClearStorage = (): void => {
    ensureStorage('localStorage').clear()
    ensureStorage('sessionStorage').clear()
}

beforeEach(() => {
    safeClearStorage()
})

afterEach(() => {
    safeClearStorage()
    vi.restoreAllMocks()
})