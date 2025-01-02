import { error } from '@minhdtb/storeo-theme';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Collections, client } from 'portal-core';

export function useLogin(redirect?: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      client.collection(Collections.User).authWithPassword(email, password),
    onSuccess: () => router.history.push(redirect ?? '/'),
    onError: () => error('Tên đăng nhập hoặc mật khẩu không đúng')
  });
}
