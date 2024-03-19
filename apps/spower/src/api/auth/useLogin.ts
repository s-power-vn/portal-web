import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { usePb } from '@storeo/core';

export function useLogin(redirect?: string) {
  const pb = usePb();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      pb.collection('users').authWithPassword(email, password),
    onSuccess: () => router.history.push(redirect ?? '/'),
    onError: () => {}
  });
}
