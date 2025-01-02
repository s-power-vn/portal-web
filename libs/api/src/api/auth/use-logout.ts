import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { client } from 'portal-core';

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      client.authStore.clear();
    },
    onSuccess: () => navigate({ to: '/login' })
  });
}
