import { client2, userId } from 'portal-core';

import { router } from 'react-query-kit';

export const organizationApi = router('organization', {
  list: router.query({
    fetcher: async () => {
      const { data, error } = await client2.rest
        .from('organizations')
        .select(
          `
            id,
            name,
            role:organization_members!organization_id (
              role
            ),
            members:organization_members!organization_id (
              role,
              user:users (
                id,
                name,
                email,
                avatar
              )
            )
          `
        )
        .eq('organization_members.user_id', userId.value ?? '');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  }),
  create: router.mutation({
    mutationFn: async (params: { name: string }) => {
      const { data, error } = await client2.rest
        .from('organizations')
        .insert(params);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  }),
  update: router.mutation({
    mutationFn: async (params: { id: string; name: string }) => {
      const { data, error } = await client2.rest
        .from('organizations')
        .update(params)
        .eq('id', params.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  }),
  delete: router.mutation({
    mutationFn: async (params: { id: string }) => {
      const { data, error } = await client2.rest
        .from('organizations')
        .delete()
        .eq('id', params.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  })
});
