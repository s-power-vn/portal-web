import { client } from 'portal-core';

import { router } from 'react-query-kit';

export const userApi = router('user', {
  update: router.mutation({
    mutationFn: (params: {
      id: string;
      name?: string;
      avatar?: string | File;
    }) => {
      const formData = new FormData();
      if (params.avatar && typeof params.avatar !== 'string') {
        formData.append('avatar', params.avatar);
      }
      if (params.name) {
        formData.append('name', params.name);
      }
      return client.collection('user').update(params.id, formData);
    }
  }),
  changePassword: router.mutation({
    mutationFn: (params: {
      id: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      return client.send('/user/change-password', {
        method: 'PUT',
        body: params
      });
    }
  })
});
