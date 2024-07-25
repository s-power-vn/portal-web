import { router } from 'react-query-kit';

import { client } from '@storeo/core';

export const userApi = router('user', {
  update: router.mutation({
    mutationFn: (params: { id: string; name?: string }) => {
      return client.collection('user').update(params.id, params);
    }
  })
});
