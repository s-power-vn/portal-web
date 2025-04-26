import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../../types';
import {
  CreateCustomerInput,
  CustomerItem,
  CustomerListItem,
  CustomerListResponse,
  UpdateCustomerInput
} from './customer.type';

export const customerApi = router('customer', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<CustomerListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const query = client2.rest
          .from('customers')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('created', { ascending: false });

        const filter = params?.filter
          ? `name.ilike.%${params?.filter ?? ''}%,email.ilike.%${params?.filter ?? ''}%`
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

        const items = data.map(
          item =>
            ({
              id: item.id,
              name: item.name,
              code: item.code,
              email: item.email,
              phone: item.phone,
              address: item.address,
              note: item.note,
              created: item.created,
              updated: item.updated
            }) as CustomerListItem
        );

        return {
          items,
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
    fetcher: async (id: string): Promise<CustomerItem> => {
      try {
        const { data, error } = await client2.rest
          .from('customers')
          .select(
            `*, 
            createdBy:organizations_members!created_by(*),
            updatedBy:organizations_members!updated_by(*)`
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy chủ đầu tư với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          code: data.code,
          email: data.email,
          phone: data.phone,
          address: data.address,
          note: data.note,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as CustomerItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<CustomerListItem[]> => {
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

        if (!data) {
          return [];
        }

        const items = data.map(
          item =>
            ({
              id: item.id,
              name: item.name,
              code: item.code,
              email: item.email,
              phone: item.phone,
              address: item.address,
              note: item.note,
              created: item.created,
              updated: item.updated
            }) as CustomerListItem
        );

        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateCustomerInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('customers').insert({
          ...params
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể tạo chủ đầu tư: ${(error as Error).message}`
        );
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateCustomerInput): Promise<void> => {
      try {
        const { id, ...updateParams } = params;
        const { error } = await client2.rest
          .from('customers')
          .update({
            ...updateParams
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
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
