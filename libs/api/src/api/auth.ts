import { Collections, client, client2 } from 'portal-core';

import { router } from 'react-query-kit';

export const authApi = router(`auth`, {
  login: router.mutation({
    mutationFn: async ({
      email,
      password
    }: {
      email: string;
      password: string;
    }) => {
      return client
        .collection(Collections.User)
        .authWithPassword(email, password);
    }
  }),
  logout: router.mutation({
    mutationFn: async () => {
      localStorage.removeItem('organizationId');
      return client2.auth.signOut();
    }
  })
});
