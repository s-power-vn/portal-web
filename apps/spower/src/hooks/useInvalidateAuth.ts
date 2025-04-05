import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { useCallback } from 'react';

export function useInvalidateAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
    await router.invalidate();
  }, [queryClient, router]);
}
