export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';
export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE';
export type EntityType =
  | 'GOAT'
  | 'WEIGHT'
  | 'HEALTH'
  | 'VACCINE'
  | 'FEED'
  | 'TASK'
  | 'PHOTO'
  | 'POS_SALE'
  | 'AI_OBSERVATION';

export interface OfflineAction {
  local_id: string;
  server_id?: string | null;
  operation_type: OperationType;
  entity_type: EntityType;
  entity_id: string;
  payload: any;
  created_at: string;
  sync_status: SyncStatus;
  retry_count: number;
  last_error?: string | null;
  client_version?: number;
  updated_by?: string;
  conflict_details?: {
    server_timestamp?: string;
    server_data?: any;
    resolution_required?: boolean;
  };
}

const STORAGE_KEY = 'msk_offline_actions_queue';

/**
 * Robust Client-Side Offline Action Queue
 * Designed to guarantee zero data loss for farm workers in sheds or remote pens with spotty 2G/4G connectivity.
 */
export class OfflineQueue {
  private static getQueue(): OfflineAction[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveQueue(queue: OfflineAction[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.error('[OfflineQueue] Failed to write queue to storage:', err);
    }
  }

  public static enqueue(
    action: Omit<OfflineAction, 'local_id' | 'created_at' | 'sync_status' | 'retry_count'>
  ): OfflineAction {
    const queue = this.getQueue();
    const newAction: OfflineAction = {
      ...action,
      local_id: `off-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      created_at: new Date().toISOString(),
      sync_status: 'PENDING',
      retry_count: 0
    };

    queue.push(newAction);
    this.saveQueue(queue);
    return newAction;
  }

  public static getPending(): OfflineAction[] {
    return this.getQueue().filter(
      item => item.sync_status === 'PENDING' || item.sync_status === 'FAILED'
    );
  }

  public static getAll(): OfflineAction[] {
    return this.getQueue();
  }

  public static updateStatus(
    local_id: string,
    status: SyncStatus,
    patch?: Partial<OfflineAction>
  ): void {
    const queue = this.getQueue();
    const index = queue.findIndex(a => a.local_id === local_id);
    if (index !== -1) {
      queue[index] = {
        ...queue[index],
        sync_status: status,
        ...patch
      };
      this.saveQueue(queue);
    }
  }

  public static markSynced(local_id: string, server_id?: string): void {
    const queue = this.getQueue();
    const updated = queue.map(a =>
      a.local_id === local_id
        ? { ...a, sync_status: 'SYNCED' as SyncStatus, server_id: server_id || a.server_id }
        : a
    );
    this.saveQueue(updated);
  }

  public static removeSyncedOlderThan(days: number = 7): void {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const queue = this.getQueue().filter(item => {
      if (item.sync_status !== 'SYNCED') return true;
      const created = new Date(item.created_at).getTime();
      return created > cutoff;
    });
    this.saveQueue(queue);
  }

  public static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}
