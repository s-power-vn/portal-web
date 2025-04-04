import { useQuery } from '@tanstack/react-query';
import { client2 } from 'portal-core';

export type AuthData = {
  status: 'authorized' | 'unauthorized' | 'not-registered';
  user_id: string;
  user_email: string;
  token: string;
  isLoading: boolean;
};

export function useAuth() {
  const {
    data: result,
    isLoading,
    error
  } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      console.log('queryFn auth');
      try {
        await client2.auth.authStateReady();
        if (!client2.auth.currentUser) {
          return {
            status: 'unauthorized' as const,
            user_id: '',
            user_email: '',
            token: ''
          };
        }

        const isHasUser = await client2.api.checkUser();
        if (!isHasUser) {
          return {
            status: 'not-registered' as const,
            user_id: '',
            user_email: client2.auth.currentUser.email ?? '',
            token: ''
          };
        }

        const organizationId =
          localStorage.getItem('organizationId') ?? undefined;
        const restToken = await client2.api.getRestToken(organizationId);

        localStorage.setItem('restToken', restToken.token);
        localStorage.setItem('userId', restToken.user_id);

        return {
          status: 'authorized' as const,
          user_id: restToken.user_id,
          user_email: client2.auth.currentUser.email ?? '',
          token: restToken.token
        };
      } catch (error) {
        throw error;
      } finally {
      }
    }
  });

  const data: AuthData = {
    ...(result || {
      status: 'unauthorized' as const,
      user_id: '',
      user_email: '',
      token: ''
    }),
    isLoading
  };

  return { data, error };
}
