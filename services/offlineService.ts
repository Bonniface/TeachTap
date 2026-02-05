
import { FeedItemData, SyncAction } from '../types';

const DB_NAME = 'TeachTapDB';
const DB_VERSION = 1;
const STORE_VIDEOS = 'videos';
const STORE_SYNC_QUEUE = 'syncQueue';
const DOWNLOAD_LIMIT = 10;

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
                db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
                db.createObjectStore(STORE_SYNC_QUEUE, { keyPath: 'id' });
            }
        };
    });
};

export const offlineService = {
    async getDownloadedCount(): Promise<number> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_VIDEOS, 'readonly');
            const store = transaction.objectStore(STORE_VIDEOS);
            const countRequest = store.count();
            
            countRequest.onsuccess = () => resolve(countRequest.result);
            countRequest.onerror = () => reject(countRequest.error);
        });
    },

    async saveVideo(item: FeedItemData): Promise<void> {
        const count = await this.getDownloadedCount();
        if (count >= DOWNLOAD_LIMIT) {
            throw new Error(`Offline limit reached. You can only save ${DOWNLOAD_LIMIT} videos.`);
        }

        // Fetch the image/video as a blob to store offline
        try {
            const response = await fetch(item.videoPosterUrl);
            const blob = await response.blob();
            
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_VIDEOS, 'readwrite');
                const store = transaction.objectStore(STORE_VIDEOS);
                
                const offlineItem = {
                    ...item,
                    blob: blob, // Store the raw data
                    savedAt: Date.now()
                };

                const request = store.put(offlineItem);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error("Failed to fetch media for offline storage", error);
            throw error;
        }
    },

    async removeVideo(id: string): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_VIDEOS, 'readwrite');
            const store = transaction.objectStore(STORE_VIDEOS);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async getAllDownloadedVideos(): Promise<FeedItemData[]> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_VIDEOS, 'readonly');
            const store = transaction.objectStore(STORE_VIDEOS);
            const request = store.getAll();

            request.onsuccess = () => {
                const results = request.result;
                // Convert blobs back to ObjectURLs for display
                const items = results.map((item: any) => ({
                    ...item,
                    localPosterUrl: URL.createObjectURL(item.blob),
                    isDownloaded: true
                }));
                resolve(items);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async queueSyncAction(action: Omit<SyncAction, 'id' | 'timestamp'>): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_SYNC_QUEUE, 'readwrite');
            const store = transaction.objectStore(STORE_SYNC_QUEUE);
            
            const syncItem: SyncAction = {
                ...action,
                id: crypto.randomUUID(),
                timestamp: Date.now()
            };

            const request = store.put(syncItem);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async processSyncQueue(processor: (action: SyncAction) => void): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_SYNC_QUEUE, 'readwrite');
            const store = transaction.objectStore(STORE_SYNC_QUEUE);
            const request = store.getAll();

            request.onsuccess = () => {
                const actions: SyncAction[] = request.result;
                if (actions.length > 0) {
                    console.log(`Syncing ${actions.length} offline actions...`);
                    actions.forEach(processor);
                    store.clear(); // Clear queue after processing
                }
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
};
