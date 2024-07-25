import { router } from 'react-query-kit';

import { client } from '@storeo/core';

export const userApi = router('user', {
  update: router.mutation({
    mutationFn: (params: {
      id: string;
      name?: string;
      avatar?: string | File;
    }) => {
      const formData = new FormData();
      if (params.avatar && typeof params.avatar !== 'string') {
        console.log('xxx', params.avatar);
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
      return client.send('/change-password', {
        method: 'PUT',
        body: params
      });
    }
  })
});
