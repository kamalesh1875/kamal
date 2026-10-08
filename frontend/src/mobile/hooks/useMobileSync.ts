'use client';

import { useState, useEffect, useCallback } from 'react';
import { SyncEngine, SyncState } from '../sync/sync-engine';
import { OfflineQueue, OfflineAction, EntityType, OperationType } from '../offline/offline-queue';

export function useMobileSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>('IDLE');
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    SyncEngine.init();
    const unsubscribe = SyncEngine.subscribe(state => {
      setIsOnline(state.isOnline);
      setSyncState(state.syncState);
      setPendingCount(state.pendingCount);
      setLastSyncedAt(state.lastSyncedAt);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const queueAction = useCallback(
    (
      operation_type: OperationType,
      entity_type: EntityType,
      entity_id: string,
      payload: any,
      updated_by?: string
    ) => {
      const action = OfflineQueue.enqueue({
        operation_type,
        entity_type,
        entity_id,
        payload,
        updated_by
      });

      setPendingCount(OfflineQueue.getPending().length);

      // Attempt immediate sync if online
      if (isOnline) {
        SyncEngine.syncNow();
      }

      return action;
    },
    [isOnline]
  );

  const triggerSync = useCallback(() => {
    return SyncEngine.syncNow();
  }, []);

  return {
    isOnline,
    syncState,
    pendingCount,
    lastSyncedAt,
    queueAction,
    triggerSync,
    allActions: OfflineQueue.getAll()
  };
}
