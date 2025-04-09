import { PaginatedResponse, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

export type EmployeeData = {
  id?: string;
  name?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  department?: {
    id?: string;
    name?: string;
    role?: string;
    title?: string;
  };
  role?: string;
  created?: string;
  updated?: string;
  created_by?: string;
  updated_by?: string;
};

export type CreateEmployeeInput = {
  user_id: string;
  name?: string;
  department_id?: string;
  department_role?: string;
  department_title?: string;
};

export type UpdateEmployeeInput = {
  id: string;
  name?: string;
  user_id?: string;
  department_id?: string;
  department_role?: string;
  department_title?: string;
};

export type EmployeeListResponse = PaginatedResponse<EmployeeData>;

type RawEmployee = {
  id: string;
  name: string | null;
  user_id: string | null;
  department_id: string | null;
  department_role: string | null;
  department_title: string | null;
  organization_id: string | null;
  role: string | null;
  created: string | null;
  updated: string | null;
  created_by: string | null;
  updated_by: string | null;
  users: {
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
  } | null;
  departments: {
    name: string;
  } | null;
};

type RawEmployeeView = {
  id: string;
  name: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_avatar: string;
  department_id: string;
  department_name: string;
  department_role: string;
  department_title: string;
  role: string;
  created: string;
  updated: string;
  created_by: string;
  updated_by: string;
};

const transformEmployee = (data: RawEmployee): EmployeeData => ({
  id: data.id,
  name: data.name || '',
  user: {
    id: data.user_id || '',
    name: data.users?.name || '',
    email: data.users?.email || '',
    phone: data.users?.phone || '',
    avatar: data.users?.avatar || ''
  },
  department: {
    id: data.department_id || '',
    name: data.departments?.name || '',
    role: data.department_role || '',
    title: data.department_title || ''
  },
  role: data.role || '',
  created: data.created || '',
  updated: data.updated || '',
  created_by: data.created_by || '',
  updated_by: data.updated_by || ''
});

export const employeeApi = router('employee', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<EmployeeListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        const query = client2.rest
          .from('organization_members_with_users')
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

        const items = (data as unknown as RawEmployeeView[]).map(it => {
          return {
            id: it.id,
            name: it.name || '',
            user: {
              id: it.user_id || '',
              name: it.user_name || '',
              email: it.user_email || '',
              phone: it.user_phone || '',
              avatar: it.user_avatar || ''
            },
            department: {
              id: it.department_id || '',
              name: it.department_name || '',
              role: it.department_role || '',
              title: it.department_title || ''
            },
            role: it.role || ''
          };
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
    fetcher: async (params?: ListParams): Promise<EmployeeData[]> => {
      try {
        const query = client2.rest
          .from('organization_members_with_users')
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

        return (data as unknown as RawEmployeeView[]).map(it => {
          return {
            id: it.id,
            name: it.name || '',
            user: {
              id: it.user_id || '',
              name: it.user_name || '',
              email: it.user_email || '',
              phone: it.user_phone || '',
              avatar: it.user_avatar || ''
            },
            department: {
              id: it.department_id || '',
              name: it.department_name || '',
              role: it.department_role || '',
              title: it.department_title || ''
            },
            role: it.role || ''
          };
        });
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách nhân viên: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<EmployeeData> => {
      try {
        const { data, error } = await client2.rest
          .from('organization_members')
          .select(
            `
            *,
            users!user_id(
              name,
              email,
              phone,
              avatar
            ),
            departments!department_id(name)
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

        return transformEmployee(data as unknown as RawEmployee);
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin nhân viên: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<EmployeeData[]> => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('organization_members')
          .select(
            `
            *,
            users!user_id(
              name,
              email,
              phone,
              avatar
            ),
            departments!department_id(name)
          `
          )
          .in('id', ids);

        if (error) {
          throw error;
        }

        return (data as unknown as RawEmployee[]).map(transformEmployee);
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
    mutationFn: async (params: UpdateEmployeeInput): Promise<EmployeeData> => {
      try {
        const { id, ...updateParams } = params;
        const { data, error } = await client2.rest
          .from('organization_members')
          .update({
            ...updateParams
          })
          .eq('id', id)
          .select(
            `
            *,
            users!user_id(
              name,
              email,
              phone,
              avatar
            ),
            departments!department_id(name)
          `
          )
          .single();
        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy nhân viên với id: ${id}`);
        }

        return transformEmployee(data as unknown as RawEmployee);
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
