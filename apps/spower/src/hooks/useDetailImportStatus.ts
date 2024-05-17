import { useEffect } from 'react';

import { Collections, client } from '@storeo/core';

export function useDetailImportStatus(
  detailImportId?: string,
  onStatusChange?: (status: string) => void
) {
  useEffect(() => {
    if (detailImportId) {
      client
        .collection(Collections.DetailImport)
        .subscribe(detailImportId, record => {
          onStatusChange?.(record.record.status);
        });

      return () => {
        client.collection(Collections.DetailImport).unsubscribe(detailImportId);
      };
    }
  }, [detailImportId, onStatusChange]);
}
