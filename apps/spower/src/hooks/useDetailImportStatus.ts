import { useEffect } from 'react';

import { Collections, client } from '@storeo/core';

export function useDetailImportStatus(
  onStatusChange?: (id: string, status: string) => void
) {
  useEffect(() => {
    client.collection(Collections.DetailImport).subscribe('*', record => {
      onStatusChange?.(record.record.id, record.record.status);
    });

    return () => {
      client.collection(Collections.DetailImport).unsubscribe();
    };
  }, [onStatusChange]);
}
