import { Collections, client } from 'portal-core';

import { useEffect } from 'react';

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
  }, []);
}
