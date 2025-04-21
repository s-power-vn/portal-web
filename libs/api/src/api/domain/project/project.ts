import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';
import {
  CreateProjectInput,
  ProjectItem,
  ProjectListItem,
  ProjectListResponse,
  UpdateProjectInput
} from './project.type';

export const projectApi = router('project', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<ProjectListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const query = client2.rest
          .from('projects')
          .select(
            `*,
            createdBy:organization_members!created_by(*),
            updatedBy:organization_members!updated_by(*)`,
            { count: 'exact' }
          )
          .range(from, to)
          .order('created', { ascending: false });

        const filter = params?.filter
          ? `name.ilike.%${params?.filter}%`
          : undefined;

        if (filter) {
          query.or(filter);
        }

        const { data, count, error } = await query;

        if (error) {
          throw error;
        }

        if (!data) {
          return {
            items: [],
            page: pageIndex,
            perPage: pageSize,
            totalItems: 0,
            totalPages: 0
          };
        }

        const items = data.map(item => {
          return {
            id: item.id,
            name: item.name,
            created: item.created,
            updated: item.updated,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy
          } as ProjectListItem;
        });

        return {
          items,
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách dự án: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<ProjectItem> => {
      try {
        const { data, error } = await client2.rest
          .from('projects')
          .select(
            `*,
            createdBy:organization_members!created_by(*),
            updatedBy:organization_members!updated_by(*)`
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy dự án với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as ProjectItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin dự án: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateProjectInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('projects').insert({
          ...params
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể tạo dự án: ${(error as Error).message}`);
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateProjectInput): Promise<void> => {
      try {
        const { id, ...updateParams } = params;
        const { error } = await client2.rest
          .from('projects')
          .update({
            ...updateParams
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể cập nhật dự án: ${(error as Error).message}`
        );
      }
    }
  }),
  delete: router.mutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể xóa dự án: ${(error as Error).message}`);
      }
    }
  })
});
