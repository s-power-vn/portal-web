import { type Customer, type PaginatedResponse, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';

/**
 * Input types for customer operations
 */
export type CreateCustomerInput = {
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  organization_id?: string;
};

export type UpdateCustomerInput = {
  id: string;
  name?: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  organization_id?: string;
};

export type CustomerListResponse = PaginatedResponse<Customer>;

export const customerApi = router('customer', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<CustomerListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const { data, count, error } = await client2.rest
          .from('customers')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('created', { ascending: false })
          .or(
            `name.ilike.%${params?.filter ?? ''}%,email.ilike.%${params?.filter ?? ''}%`
          );

        if (error) {
          throw error;
        }

        return {
          items: (data as Customer[]) || [],
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),

  byId: router.query({
    fetcher: async (id: string): Promise<Customer> => {
      try {
        const { data, error } = await client2.rest
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy chủ đầu tư với id: ${id}`);
        }

        return data as Customer;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),

  byIds: router.query({
    fetcher: async (ids: string[]): Promise<Customer[]> => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('customers')
          .select('*')
          .in('id', ids);

        if (error) {
          throw error;
        }

        return (data as Customer[]) || [];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),

  create: router.mutation({
    mutationFn: async (params: CreateCustomerInput): Promise<Customer> => {
      try {
        const { data, error } = await client2.rest
          .from('customers')
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

        return data as Customer;
      } catch (error) {
        throw new Error(
          `Không thể tạo chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),

  update: router.mutation({
    mutationFn: async (params: UpdateCustomerInput): Promise<Customer> => {
      try {
        const { id, ...updateParams } = params;
        const { data, error } = await client2.rest
          .from('customers')
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
          throw new Error(`Không tìm thấy chủ đầu tư với id: ${id}`);
        }

        return data as Customer;
      } catch (error) {
        throw new Error(
          `Không thể cập nhật chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),

  delete: router.mutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('customers')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể xóa chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  })
});
