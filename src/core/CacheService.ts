type CacheItem = {
    data: any;
    cachedAt: Date;
}

class MissingStorageKeyException extends Error {}

interface ICacheService {
    /**
     * Get the cached data, if exists. Returns <null> when empty.
     * @param key StorageKey that identifies the value
     */
    getCache(key: string): CacheItem | null;

    /**
     * Stores the data in cache with a given key
     *
     * @param key StorageKey used to retrieve the value later
     * @param data Data to cache
     */
    setCache(key: string, data: any): void;

    /**
     * Delete data with key
     *
     * @param key Key associated with the data to delete
     */
    delete(key: string): void;

    /**
     * Clear the cached data associated with current key.
     */
    clear(): void;
}


export default class CacheService implements ICacheService {
    private cacheKey: string;
    private storageEngine: Storage;

    constructor(key: string, storage = sessionStorage) {
        if (!key || !key.length) {
            throw MissingStorageKeyException;
        }
        this.cacheKey = key;
        this.storageEngine = storage;
    }

    private getStorageKey(key: string): string {
        key = key.trim().replace(' ', '_');
        return `${this.cacheKey}:${key}`;
    }

    setCache(key: string, dataToCache: any): void {
        if (!key || !key.length) {
            throw MissingStorageKeyException;
        }
        const storageKey = this.getStorageKey(key);
        const cacheData: CacheItem = {
            data: dataToCache,
            cachedAt: new Date()
        };
        this.storageEngine.setItem(storageKey, JSON.stringify(cacheData));
    }

    getCache(key: string): CacheItem | null {
        if (!key || !key.length) {
            throw MissingStorageKeyException;
        }
        const storageKey = this.getStorageKey(key);

        const cacheData = this.storageEngine.getItem(storageKey);
        if (!cacheData) return null;
        const parsedData = JSON.parse(cacheData);
        parsedData.cachedAt = new Date(parsedData.cachedAt);
        return parsedData;
    }

    delete(key: string): void {
        if (!key || !key.length) {
            throw MissingStorageKeyException;
        }
        const storageKey = this.getStorageKey(key);

        this.storageEngine.removeItem(storageKey);
    }

    clear(): void {
        for(let i = 0; this.storageEngine.length > i; i++) {
            const key = this.storageEngine.key(i);
            if (key && key.startsWith(this.cacheKey)) {
                this.storageEngine.removeItem(key);
            }
        }
    }

}
