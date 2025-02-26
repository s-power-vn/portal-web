import type { QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { useCallback } from 'react';

export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return useCallback(
    (queryKeys: QueryKey[]) => {
      return Promise.all(
        queryKeys.map(queryKey => {
          return queryClient.invalidateQueries({
            queryKey,
            type: 'all'
          });
        })
      );
    },
    [queryClient]
  );
}
