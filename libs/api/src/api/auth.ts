import { Collections, client } from 'portal-core';

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
      return client.authStore.clear();
    }
  })
});
