/**
 * IndexedDB utilities for offline storage and caching
 */

const DB_NAME = 'AIaBLE_DB';
const DB_VERSION = 1;

// Store names
export const STORES = {
    OPTIMIZER_HISTORY: 'optimizer_history',
    SANDBOX_HISTORY: 'sandbox_history',
    RECIPES: 'recipes',
    CACHED_RESPONSES: 'cached_responses'
} as const;

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
    if (db) return db;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create stores if they don't exist
            if (!db.objectStoreNames.contains(STORES.OPTIMIZER_HISTORY)) {
                const store = db.createObjectStore(STORES.OPTIMIZER_HISTORY, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }

            if (!db.objectStoreNames.contains(STORES.SANDBOX_HISTORY)) {
                const store = db.createObjectStore(STORES.SANDBOX_HISTORY, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }

            if (!db.objectStoreNames.contains(STORES.RECIPES)) {
                const store = db.createObjectStore(STORES.RECIPES, {
                    keyPath: 'id'
                });
                store.createIndex('category', 'category', { unique: false });
            }

            if (!db.objectStoreNames.contains(STORES.CACHED_RESPONSES)) {
                const store = db.createObjectStore(STORES.CACHED_RESPONSES, {
                    keyPath: 'key'
                });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

/**
 * Add item to store
 */
export async function addItem<T>(storeName: string, item: T): Promise<IDBValidKey> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get item from store
 */
export async function getItem<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get all items from store
 */
export async function getAllItems<T>(storeName: string, limit?: number): Promise<T[]> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = limit ? store.getAll(undefined, limit) : store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete item from store
 */
export async function deleteItem(storeName: string, key: IDBValidKey): Promise<void> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Clear all items from store
 */
export async function clearStore(storeName: string): Promise<void> {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get cached response with TTL check
 */
export async function getCachedResponse(
    key: string,
    maxAge: number = 5 * 60 * 1000 // 5 minutes default
): Promise<any | null> {
    try {
        const cached = await getItem<{ key: string; data: any; timestamp: number }>(
            STORES.CACHED_RESPONSES,
            key
        );

        if (!cached) return null;

        const age = Date.now() - cached.timestamp;
        if (age > maxAge) {
            await deleteItem(STORES.CACHED_RESPONSES, key);
            return null;
        }

        return cached.data;
    } catch (e) {
        console.error('[Cache Read Error]:', e);
        return null;
    }
}

/**
 * Set cached response
 */
export async function setCachedResponse(key: string, data: any): Promise<void> {
    try {
        await addItem(STORES.CACHED_RESPONSES, {
            key,
            data,
            timestamp: Date.now()
        });
    } catch (e) {
        // If add fails (duplicate key), update instead
        const database = await initDB();
        const transaction = database.transaction(STORES.CACHED_RESPONSES, 'readwrite');
        const store = transaction.objectStore(STORES.CACHED_RESPONSES);
        store.put({
            key,
            data,
            timestamp: Date.now()
        });
    }
}

/**
 * Clean old cache entries
 */
export async function cleanOldCache(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    try {
        const database = await initDB();
        const transaction = database.transaction(STORES.CACHED_RESPONSES, 'readwrite');
        const store = transaction.objectStore(STORES.CACHED_RESPONSES);
        const index = store.index('timestamp');
        const cutoff = Date.now() - maxAge;

        const request = index.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                if (cursor.value.timestamp < cutoff) {
                    cursor.delete();
                }
                cursor.continue();
            }
        };
    } catch (e) {
        console.error('[Cache Clean Error]:', e);
    }
}
