import { router } from 'react-query-kit';

import { client } from '@storeo/core';

export const userApi = router('user', {
  update: router.mutation({
    mutationFn: (params: { id: string; name?: string }) => {
      return client.collection('user').update(params.id, params);
    }
  }),
  changePassword: router.mutation({
    mutationFn: (params: {
      id: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      return client.send('/change-password', {
        method: 'PUT',
        body: params
      });
    }
  })
});
