import { Organization, User, client2 } from 'portal-core';

import { router } from 'react-query-kit';

export type OrganizationData = Organization & {
  owner: {
    role: string;
    user: User;
  };
  members: {
    role: string;
    user: User;
  }[];
};

export const organizationApi = router('organization', {
  list: router.query({
    fetcher: async () => {
      const { data, error } = await client2.rest.from('organizations').select(
        `
            id,
            name,
            roles:organization_members!organization_id (
              role,
              user:users!organization_members_user_id_fkey (
                id,
                name,
                email,
                avatar
              )
            ),
            members:organization_members!organization_id (
              role,
              user:users!organization_members_user_id_fkey (
                id,
                name,
                email,
                avatar
              )
            )
          `
      );

      if (error) {
        throw new Error(error.message);
      }

      return data.map(org => ({
        ...org,
        owner: {
          role: org.roles[0].role,
          user: org.roles[0].user
        },
        members: org.members.map(member => ({
          role: member.role,
          user: member.user
        }))
      }));
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
