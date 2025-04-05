import { useQuery } from '@tanstack/react-query';
import {
  authStatus,
  client2,
  isAuthenticating,
  organizationId,
  restToken,
  userEmail,
  userId
} from 'portal-core';

export function useAuth() {
  const {
    data: result,
    isLoading,
    error
  } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      isAuthenticating.value = true;

      try {
        await client2.auth.authStateReady();
        if (!client2.auth.currentUser) {
          authStatus.value = 'unauthorized';
          return false;
        }

        userEmail.value = client2.auth.currentUser.email ?? '';

        const isHasUser = await client2.api.checkUser();
        if (!isHasUser) {
          authStatus.value = 'not-registered';
          return false;
        }

        const token = await client2.api.getRestToken(organizationId.value);
        restToken.value = token.token;
        userId.value = token.user_id;
        authStatus.value = 'authorized';

        return true;
      } finally {
        isAuthenticating.value = false;
      }
    }
  });

  return {
    data: result,
    isLoading,
    error
  };
}
