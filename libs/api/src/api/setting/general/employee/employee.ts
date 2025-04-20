import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../../types';
import {
  CreateEmployeeInput,
  EmployeeItem,
  EmployeeListFullResponse,
  EmployeeListItem,
  EmployeeListResponse,
  UpdateEmployeeInput
} from './employee.type';

export const employeeApi = router('employee', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<EmployeeListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        const query = client2.rest
          .from('employees')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('created', { ascending: false });

        if (params?.filter) {
          query.or(
            `user_name.ilike.*${params.filter}*,user_email.ilike.*${params.filter}*,user_phone.ilike.*${params.filter}*`
          );
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

        const items = data.map(it => {
          return {
            id: it.id,
            name: it.name,
            user: {
              id: it.user_id,
              name: it.user_name,
              email: it.user_email,
              phone: it.user_phone,
              avatar: it.user_avatar
            },
            department: {
              id: it.department_id,
              name: it.department_name,
              role: it.department_role,
              title: it.department_title
            },
            role: it.role,
            created: it.created,
            updated: it.updated
          } as EmployeeListItem;
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
          `Không thể lấy danh sách nhân viên: ${(error as Error).message}`
        );
      }
    }
  }),
  listFull: router.query({
    fetcher: async (params?: ListParams): Promise<EmployeeListFullResponse> => {
      try {
        const query = client2.rest
          .from('employees')
          .select('*', { count: 'exact' });

        if (params?.filter) {
          query.or(
            `user_name.ilike.*${params.filter}*,user_email.ilike.*${params.filter}*,user_phone.ilike.*${params.filter}*`
          );
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (!data) {
          return [];
        }

        const items = data.map(it => {
          return {
            id: it.id,
            name: it.name,
            user: {
              id: it.user_id,
              name: it.user_name,
              email: it.user_email,
              phone: it.user_phone,
              avatar: it.user_avatar
            },
            department: {
              id: it.department_id,
              name: it.department_name,
              role: it.department_role,
              title: it.department_title
            },
            role: it.role,
            created: it.created,
            updated: it.updated
          } as EmployeeListItem;
        });

        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách nhân viên: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<EmployeeItem> => {
      try {
        const { data, error } = await client2.rest
          .from('organization_members')
          .select(
            `
            *,
            user:users!user_id(*),
            department:departments!department_id(name),
            createdBy:organization_members!created_by(*),
            updatedBy:organization_members!updated_by(*)
          `
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy nhân viên với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          user: {
            id: data.user_id,
            name: data.user?.name,
            email: data.user?.email,
            phone: data.user?.phone,
            avatar: data.user?.avatar
          },
          department: {
            id: data.department_id,
            name: data.department?.name,
            role: data.department_role,
            title: data.department_title
          },
          role: data.role,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as EmployeeItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin nhân viên: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<EmployeeListItem[]> => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('organization_members')
          .select(
            `
            *,
            user:users!user_id(*),
            department:departments!department_id(*)
          `
          )
          .in('id', ids);

        if (error) {
          throw error;
        }

        if (!data) {
          return [];
        }

        const items = data.map(it => {
          return {
            id: it.id,
            name: it.name,
            user: {
              id: it.user_id,
              name: it.user?.name,
              email: it.user?.email,
              phone: it.user?.phone,
              avatar: it.user?.avatar
            },
            department: {
              id: it.department_id,
              name: it.department?.name,
              role: it.department_role,
              title: it.department_title
            },
            role: it.role,
            created: it.created,
            updated: it.updated
          } as EmployeeListItem;
        });
        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách nhân viên: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateEmployeeInput): Promise<void> => {
      throw new Error('Not implemented');
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateEmployeeInput): Promise<void> => {
      try {
        const { id, ...updateParams } = params;
        const { error } = await client2.rest
          .from('organization_members')
          .update({
            ...updateParams
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể cập nhật nhân viên: ${(error as Error).message}`
        );
      }
    }
  }),
  delete: router.mutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('organization_members')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể xóa nhân viên: ${(error as Error).message}`);
      }
    }
  })
});
