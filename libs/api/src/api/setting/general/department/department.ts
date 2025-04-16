import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../../types';
import {
  CreateDepartmentInput,
  DepartmentItem,
  DepartmentListFullResponse,
  DepartmentListItem,
  DepartmentListResponse,
  UpdateDepartmentInput
} from './department.type';

export const departmentApi = router('department', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<DepartmentListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const query = client2.rest
          .from('departments')
          .select('*', { count: 'exact' })
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
            description: item.description,
            roles: item.roles,
            created: item.created,
            updated: item.updated
          } as DepartmentListItem;
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
          `Không thể lấy danh sách phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),
  listFull: router.query({
    fetcher: async (): Promise<DepartmentListFullResponse> => {
      try {
        const { data, error } = await client2.rest
          .from('departments')
          .select('*')
          .order('created', { ascending: false });

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
            description: item.description,
            roles: item.roles,
            created: item.created,
            updated: item.updated
          } as DepartmentListItem;
        });

        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<DepartmentItem> => {
      try {
        const { data, error } = await client2.rest
          .from('departments')
          .select(
            `*, 
            createdBy:users!created_by(*),
            updatedBy:users!updated_by(*)`
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy phòng ban với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          roles: data.roles as { id: string; name: string }[],
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as DepartmentItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<DepartmentListItem[]> => {
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

        if (!data) {
          return [];
        }

        const items = data.map(item => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            roles: item.roles,
            created: item.created,
            updated: item.updated
          } as DepartmentListItem;
        });

        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách phòng ban: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateDepartmentInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('departments').insert({
          ...params
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể tạo phòng ban: ${(error as Error).message}`);
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateDepartmentInput): Promise<void> => {
      try {
        const { id, ...updateParams } = params;
        const { error } = await client2.rest
          .from('departments')
          .update({
            ...updateParams
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
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
