import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import {
  CreateOrganizationInput,
  OrganizationFullListResponse,
  OrganizationItem,
  OrganizationListItem,
  UpdateOrganizationInput
} from './organization.type';

export const organizationApi = router('organization', {
  list: router.query({
    fetcher: async (): Promise<OrganizationFullListResponse> => {
      const query = client2.rest.from('organizations').select(
        `*,
        roles:organization_members!organization_id (
          role,
          user:users!organization_members_user_id_fkey(*)
        ),
        members:organization_members!organization_id(
          role,
          user:users!organization_members_user_id_fkey(*)
        ),
        createdBy:users!created_by(*),
        updatedBy:users!updated_by(*)`
      );

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data) {
        return [];
      }

      const items = data.map(item => {
        return {
          id: item.id,
          name: item.name,
          role: item.roles[0].role,
          settings: item.settings,
          members: item.members,
          created: item.created,
          updated: item.updated,
          createdBy: item.createdBy,
          updatedBy: item.updatedBy
        } as OrganizationListItem;
      });

      return items;
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<OrganizationItem> => {
      const { data, error } = await client2.rest
        .from('organizations')
        .select(
          `*,
          roles:organization_members!organization_id (
            role,
            user:users!organization_members_user_id_fkey(*)
          ),
          members:organization_members!organization_id(
            role,
            user:users!organization_members_user_id_fkey(*)
          ),
          createdBy:users!created_by(*),
          updatedBy:users!updated_by(*)`
        )
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(`Không tìm thấy tổ chức với id: ${id}`);
      }

      return {
        id: data.id,
        name: data.name,
        role: data.roles[0].role,
        settings: data.settings,
        members: data.members,
        created: data.created,
        updated: data.updated,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy
      } as OrganizationItem;
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateOrganizationInput) => {
      const { data, error } = await client2.rest
        .from('organizations')
        .insert(params);

      if (error) {
        throw error;
      }

      return data;
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateOrganizationInput) => {
      const { id, ...updateParams } = params;

      const { data, error } = await client2.rest
        .from('organizations')
        .update(updateParams)
        .eq('id', id);

      if (error) {
        throw error;
      }

      return data;
    }
  }),
  delete: router.mutation({
    mutationFn: async (id: string) => {
      const { data, error } = await client2.rest
        .from('organizations')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return data;
    }
  })
});
