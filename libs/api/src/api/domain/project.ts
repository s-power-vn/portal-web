import {
  type Customer,
  type PaginatedResponse,
  type Project,
  type User,
  client2
} from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../types';

export type ProjectData = Project & {
  customer?: Customer;
  created_by?: User;
};

export type ProjectListResponse = PaginatedResponse<ProjectData>;

export type CreateProjectInput = {
  name: string;
  bidding?: string;
  customer_id?: string;
  organization_id?: string;
};

export type UpdateProjectInput = {
  id: string;
  name?: string;
  bidding?: string;
  customer_id?: string;
  organization_id?: string;
};

export const projectApi = router('project', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<ProjectListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const { data, count, error } = await client2.rest
          .from('projects')
          .select(
            `
            *,
            customer:customers(*),
            created_by:users!created_by(*)
          `,
            { count: 'exact' }
          )
          .range(from, to)
          .order('created', { ascending: false })
          .or(
            `name.ilike.%${params?.filter ?? ''}%,bidding.ilike.%${params?.filter ?? ''}%`
          );

        if (error) {
          throw error;
        }

        return {
          items: data as unknown as ProjectData[],
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
    fetcher: async (id: string): Promise<ProjectData> => {
      try {
        const { data, error } = await client2.rest
          .from('projects')
          .select(
            `
            *,
            customer:customers(*),
            created_by:users!created_by(*)
          `
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy dự án với id: ${id}`);
        }

        return data as unknown as ProjectData;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin dự án: ${(error as Error).message}`
        );
      }
    }
  }),

  create: router.mutation({
    mutationFn: async (params: CreateProjectInput): Promise<ProjectData> => {
      try {
        const userId = localStorage.getItem('userId');
        const { data, error } = await client2.rest
          .from('projects')
          .insert({
            ...params,
            created_by: userId,
            created: new Date().toISOString()
          })
          .select(
            `
            *,
            customer:customers(*),
            created_by:users!created_by(*)
          `
          )
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Không có dữ liệu trả về');
        }

        return data as unknown as ProjectData;
      } catch (error) {
        throw new Error(`Không thể tạo dự án: ${(error as Error).message}`);
      }
    }
  }),

  update: router.mutation({
    mutationFn: async (params: UpdateProjectInput): Promise<ProjectData> => {
      try {
        const { id, ...updateParams } = params;
        const { data, error } = await client2.rest
          .from('projects')
          .update({
            ...updateParams,
            updated: new Date().toISOString()
          })
          .eq('id', id)
          .select(
            `
            *,
            customer:customers(*),
            created_by:users(*)
          `
          )
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy dự án với id: ${id}`);
        }

        return data as unknown as ProjectData;
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
