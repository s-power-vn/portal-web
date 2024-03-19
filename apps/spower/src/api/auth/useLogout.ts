import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { usePb } from '@storeo/core';

export function useLogout() {
  const pb = usePb();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      pb.authStore.clear();
    },
    onSuccess: () => navigate({ to: '/login' })
  });
}
