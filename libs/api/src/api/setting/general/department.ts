import { type Department, type PaginatedResponse, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';

/**
 * Input types for department operations
 */
export type CreateDepartmentInput = {
  name: string;
  description?: string;
  roles?: {
    id: string;
    name: string;
  }[];
  organization_id?: string;
};

export type UpdateDepartmentInput = {
  id: string;
  name?: string;
  description?: string;
  roles?: {
    id: string;
    name: string;
  }[];
  organization_id?: string;
};

export type DepartmentListResponse = PaginatedResponse<Department>;

export const departmentApi = router('department', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<DepartmentListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const { data, count, error } = await client2.rest
          .from('departments')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('created', { ascending: false })
          .or(
            `name.ilike.%${params?.filter ?? ''}%,description.ilike.%${params?.filter ?? ''}%`
          );

        if (error) {
          throw error;
        }

        return {
          items: (data as unknown as Department[]) || [],
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),

  listFull: router.query({
    fetcher: async (): Promise<Department[]> => {
      try {
        const { data, error } = await client2.rest
          .from('departments')
          .select('*')
          .order('created', { ascending: false });

        if (error) {
          throw error;
        }

        return (data as unknown as Department[]) || [];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),

  byId: router.query({
    fetcher: async (id: string): Promise<Department> => {
      try {
        const { data, error } = await client2.rest
          .from('departments')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy phòng ban với id: ${id}`);
        }

        return data as unknown as Department;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),

  byIds: router.query({
    fetcher: async (ids: string[]): Promise<Department[]> => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('departments')
          .select('*')
          .in('id', ids);

        if (error) {
          throw error;
        }

        return (data as unknown as Department[]) || [];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),

  create: router.mutation({
    mutationFn: async (params: CreateDepartmentInput): Promise<Department> => {
      try {
        const { data, error } = await client2.rest
          .from('departments')
          .insert({
            ...params,
            created: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Không có dữ liệu trả về');
        }

        return data as unknown as Department;
      } catch (error) {
        throw new Error(`Không thể tạo phòng ban: ${(error as Error).message}`);
      }
    }
  }),

  update: router.mutation({
    mutationFn: async (params: UpdateDepartmentInput): Promise<Department> => {
      try {
        console.log('params', params);
        const { id, ...updateParams } = params;
        const { data, error } = await client2.rest
          .from('departments')
          .update({
            ...updateParams,
            updated: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy phòng ban với id: ${id}`);
        }

        return data as unknown as Department;
      } catch (error) {
        throw new Error(
          `Không thể cập nhật phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),

  delete: router.mutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('departments')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể xóa phòng ban: ${(error as Error).message}`);
      }
    }
  })
});
