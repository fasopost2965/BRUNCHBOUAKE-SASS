import { OfflineSyncItem } from '../types';

const DB_NAME = 'BrunchBouakeOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'sync_queue';

/**
 * Initializes the IndexedDB database for offline queue persistence.
 */
export function initOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Retrieves all items currently queued in IndexedDB.
 */
export async function getSyncQueueDB(): Promise<OfflineSyncItem[]> {
  try {
    const db = await initOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB getSyncQueueDB failed, falling back to localStorage:', error);
    const saved = localStorage.getItem('bb_sync_queue');
    return saved ? JSON.parse(saved) : [];
  }
}

/**
 * Adds or updates an item in the IndexedDB offline sync queue.
 */
export async function saveSyncQueueItemDB(item: OfflineSyncItem): Promise<void> {
  try {
    const db = await initOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB saveSyncQueueItemDB failed, falling back to localStorage:', error);
    // Sync to localStorage as fallback
    const saved = localStorage.getItem('bb_sync_queue');
    const queue: OfflineSyncItem[] = saved ? JSON.parse(saved) : [];
    const index = queue.findIndex(q => q.id === item.id);
    if (index > -1) {
      queue[index] = item;
    } else {
      queue.push(item);
    }
    localStorage.setItem('bb_sync_queue', JSON.stringify(queue));
  }
}

/**
 * Removes a synced item from IndexedDB.
 */
export async function deleteSyncQueueItemDB(id: string): Promise<void> {
  try {
    const db = await initOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB deleteSyncQueueItemDB failed, falling back to localStorage:', error);
    const saved = localStorage.getItem('bb_sync_queue');
    if (saved) {
      const queue: OfflineSyncItem[] = JSON.parse(saved);
      const filtered = queue.filter(q => q.id !== id);
      localStorage.setItem('bb_sync_queue', JSON.stringify(filtered));
    }
  }
}

/**
 * Clears the entire IndexedDB sync queue.
 */
export async function clearSyncQueueDB(): Promise<void> {
  try {
    const db = await initOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB clearSyncQueueDB failed, falling back to localStorage:', error);
    localStorage.removeItem('bb_sync_queue');
  }
}
