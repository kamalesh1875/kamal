import { OfflineQueue, OfflineAction } from '../offline/offline-queue';

export type SyncState = 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';

type SyncListener = (state: {
  isOnline: boolean;
  syncState: SyncState;
  pendingCount: number;
  lastSyncedAt: string | null;
}) => void;

/**
 * Mobile Field Sync Engine
 * Handles automatic and on-demand synchronization between mobile devices and backend ERP.
 */
export class SyncEngine {
  private static isSyncing = false;
  private static lastSyncedAt: string | null = null;
  private static listeners: Set<SyncListener> = new Set();
  private static initialized = false;

  public static init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Listen to network status changes
    window.addEventListener('online', () => {
      this.notifyListeners();
      this.syncNow();
    });

    window.addEventListener('offline', () => {
      this.notifyListeners();
    });

    // Auto-sync heartbeat every 45 seconds if online and has pending items
    setInterval(() => {
      if (this.isOnline() && !this.isSyncing && OfflineQueue.getPending().length > 0) {
        this.syncNow();
      }
    }, 45000);
  }

  public static isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    return window.navigator.onLine;
  }

  public static subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener({
      isOnline: this.isOnline(),
      syncState: this.isSyncing ? 'SYNCING' : 'IDLE',
      pendingCount: OfflineQueue.getPending().length,
      lastSyncedAt: this.lastSyncedAt
    });

    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifyListeners(overrideState?: SyncState) {
    const state = {
      isOnline: this.isOnline(),
      syncState: overrideState || (this.isSyncing ? 'SYNCING' : 'IDLE'),
      pendingCount: OfflineQueue.getPending().length,
      lastSyncedAt: this.lastSyncedAt
    };

    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('[SyncEngine] Listener error:', err);
      }
    });
  }

  /**
   * Execute bidirectional synchronization with conflict handling
   */
  public static async syncNow(): Promise<{ processed: number; failed: number; conflicts: number }> {
    if (this.isSyncing || !this.isOnline()) {
      return { processed: 0, failed: 0, conflicts: 0 };
    }

    const pendingActions = OfflineQueue.getPending();
    if (pendingActions.length === 0) {
      this.notifyListeners('IDLE');
      return { processed: 0, failed: 0, conflicts: 0 };
    }

    this.isSyncing = true;
    this.notifyListeners('SYNCING');

    let processed = 0;
    let failed = 0;
    let conflicts = 0;

    for (const action of pendingActions) {
      OfflineQueue.updateStatus(action.local_id, 'SYNCING');

      try {
        const response = await fetch('/api/mobile-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          OfflineQueue.markSynced(action.local_id, data.server_id);
          processed++;
        } else if (response.status === 409 || data.conflict) {
          // Conflict detected: Requires non-destructive review
          OfflineQueue.updateStatus(action.local_id, 'CONFLICT', {
            last_error: data.message || 'Server data version is newer',
            conflict_details: {
              server_timestamp: data.server_timestamp,
              server_data: data.server_data,
              resolution_required: true
            }
          });
          conflicts++;
        } else {
          // Failure with retry count increment
          OfflineQueue.updateStatus(action.local_id, 'FAILED', {
            retry_count: (action.retry_count || 0) + 1,
            last_error: data.error || 'Server rejected synchronization'
          });
          failed++;
        }
      } catch (networkErr: any) {
        OfflineQueue.updateStatus(action.local_id, 'FAILED', {
          retry_count: (action.retry_count || 0) + 1,
          last_error: networkErr.message || 'Network unreachable'
        });
        failed++;
        // If network failed completely, break loop early
        break;
      }
    }

    this.lastSyncedAt = new Date().toISOString();
    this.isSyncing = false;
    this.notifyListeners(failed > 0 ? 'ERROR' : 'SUCCESS');

    // Reset back to idle after brief status display
    setTimeout(() => {
      this.notifyListeners('IDLE');
    }, 4000);

    return { processed, failed, conflicts };
  }
}
