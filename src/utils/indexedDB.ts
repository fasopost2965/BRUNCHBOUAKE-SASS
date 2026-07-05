import { OfflineSyncItem, WhatsAppMessage } from '../types';

const DB_NAME = 'BrunchBouakeOfflineDB';
const DB_VERSION = 2;
const STORE_NAME = 'sync_queue';
const WA_STORE_NAME = 'whatsapp_queue';

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
      if (!db.objectStoreNames.contains(WA_STORE_NAME)) {
        db.createObjectStore(WA_STORE_NAME, { keyPath: 'id' });
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

/**
 * Processes a single offline sync item with smart retry and idempotency logic.
 */
export async function processSyncItem(
  item: OfflineSyncItem,
  simulateNetworkCall: (idempotencyKey: string, transaction: any) => Promise<void>
): Promise<OfflineSyncItem | null> {
  // If already failed permanently, we don't auto-retry unless reset
  if (item.status === 'failed' && item.attempts >= 3) {
    return item;
  }

  const updatedItem: OfflineSyncItem = {
    ...item,
    status: 'syncing',
    lastAttempt: new Date().toISOString()
  };

  try {
    // 1. Send the transaction with its original idempotencyKey to prevent duplicates
    await simulateNetworkCall(updatedItem.idempotencyKey, updatedItem.transaction);
    
    // 2. Success: remove from IndexedDB and return null
    await deleteSyncQueueItemDB(item.id);
    return null; 
  } catch (error: any) {
    const nextAttempts = item.attempts + 1;
    const errorMessage = error.message || 'Network error';
    
    updatedItem.attempts = nextAttempts;
    updatedItem.error = errorMessage;

    if (nextAttempts >= 3) {
      updatedItem.status = 'failed';
      updatedItem.errorDetail = `[IDEMPOTENCY SECURE RETRY EXCEEDED] Échec permanent après 3 tentatives. Dernière erreur: ${errorMessage}. Clé d'idempotence: ${updatedItem.idempotencyKey}`;
      console.error(`[OfflineSync] Permanent sync failure for item ${item.id}:`, updatedItem.errorDetail);
    } else {
      updatedItem.status = 'pending';
      updatedItem.errorDetail = `Tentative ${nextAttempts}/3 échouée: ${errorMessage}. Nouvelle tentative programmée à la reconnexion.`;
      console.warn(`[OfflineSync] Sync attempt ${nextAttempts}/3 failed for item ${item.id}:`, errorMessage);
    }

    // Save updated item back to IndexedDB
    await saveSyncQueueItemDB(updatedItem);
    return updatedItem;
  }
}

/**
 * Processes the entire offline sync queue with smart retry logic.
 */
export async function processSyncQueue(
  currentQueue: OfflineSyncItem[],
  simulateNetworkCall: (idempotencyKey: string, transaction: any) => Promise<void>
): Promise<{ remainingQueue: OfflineSyncItem[]; syncedCount: number; failedCount: number }> {
  let syncedCount = 0;
  let failedCount = 0;
  const remainingQueue: OfflineSyncItem[] = [];

  for (const item of currentQueue) {
    // Skip already permanently failed ones to prevent infinite loop
    if (item.status === 'failed' && item.attempts >= 3) {
      remainingQueue.push(item);
      continue;
    }

    const result = await processSyncItem(item, simulateNetworkCall);
    if (result === null) {
      syncedCount++;
    } else {
      remainingQueue.push(result);
      if (result.status === 'failed') {
        failedCount++;
      }
    }
  }

  return {
    remainingQueue,
    syncedCount,
    failedCount
  };
}

/**
 * Retrieves all WhatsApp messages currently queued in IndexedDB.
 */
export async function getWhatsAppQueueDB(): Promise<WhatsAppMessage[]> {
  try {
    const db = await initOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(WA_STORE_NAME, 'readonly');
      const store = transaction.objectStore(WA_STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB getWhatsAppQueueDB failed, falling back to localStorage:', error);
    const saved = localStorage.getItem('bb_whatsapp_queue');
    return saved ? JSON.parse(saved) : [];
  }
}

/**
 * Adds or updates an item in the IndexedDB WhatsApp message queue.
 */
export async function saveWhatsAppItemDB(item: WhatsAppMessage): Promise<void> {
  try {
    const db = await initOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(WA_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(WA_STORE_NAME);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB saveWhatsAppItemDB failed, falling back to localStorage:', error);
    const saved = localStorage.getItem('bb_whatsapp_queue');
    const queue: WhatsAppMessage[] = saved ? JSON.parse(saved) : [];
    const index = queue.findIndex(q => q.id === item.id);
    if (index > -1) {
      queue[index] = item;
    } else {
      queue.push(item);
    }
    localStorage.setItem('bb_whatsapp_queue', JSON.stringify(queue));
  }
}

/**
 * Removes a sent or cancelled WhatsApp message from IndexedDB.
 */
export async function deleteWhatsAppItemDB(id: string): Promise<void> {
  try {
    const db = await initOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(WA_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(WA_STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB deleteWhatsAppItemDB failed, falling back to localStorage:', error);
    const saved = localStorage.getItem('bb_whatsapp_queue');
    if (saved) {
      const queue: WhatsAppMessage[] = JSON.parse(saved);
      const filtered = queue.filter(q => q.id !== id);
      localStorage.setItem('bb_whatsapp_queue', JSON.stringify(filtered));
    }
  }
}

/**
 * Clears the entire IndexedDB WhatsApp message queue.
 */
export async function clearWhatsAppQueueDB(): Promise<void> {
  try {
    const db = await initOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(WA_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(WA_STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB clearWhatsAppQueueDB failed, falling back to localStorage:', error);
    localStorage.removeItem('bb_whatsapp_queue');
  }
}
