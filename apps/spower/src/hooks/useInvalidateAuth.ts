import { useRouter } from '@tanstack/react-router';

import { useCallback } from 'react';

export function useInvalidateAuth() {
  const router = useRouter();

  return useCallback(async () => {
    await router.invalidate();
  }, [router]);
}
