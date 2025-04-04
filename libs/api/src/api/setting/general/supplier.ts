import { type PaginatedResponse, type Supplier, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

export type SupplierListResponse = PaginatedResponse<Supplier>;

type SupplierInsert = {
  name: string;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  note?: string | null;
  organization_id?: string | null;
  created?: string | null;
  updated?: string | null;
};

type SupplierUpdate = {
  name?: string;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  note?: string | null;
  organization_id?: string | null;
  updated?: string | null;
};

export const supplierApi = router('supplier', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<SupplierListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const { data, count, error } = await client2.rest
          .from('suppliers')
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
          items: (data as Supplier[]) || [],
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),

  byIds: router.query({
    fetcher: async (ids: string[]): Promise<Supplier[]> => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('suppliers')
          .select('*')
          .in('id', ids);

        if (error) {
          throw error;
        }

        return (data as Supplier[]) || [];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),

  byId: router.query({
    fetcher: async (id: string): Promise<Supplier> => {
      try {
        const { data, error } = await client2.rest
          .from('suppliers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy nhà cung cấp với id: ${id}`);
        }

        return data as Supplier;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),

  create: router.mutation({
    mutationFn: async (params: SupplierInsert): Promise<Supplier> => {
      try {
        const { data, error } = await client2.rest
          .from('suppliers')
          .insert({
            ...params,
            created: new Date().toISOString()
          } as SupplierInsert)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Không có dữ liệu trả về');
        }

        return data as Supplier;
      } catch (error) {
        throw new Error(
          `Không thể tạo nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),

  update: router.mutation({
    mutationFn: async (
      params: SupplierUpdate & { id: string }
    ): Promise<Supplier> => {
      try {
        const { id, ...updateParams } = params;
        const { data, error } = await client2.rest
          .from('suppliers')
          .update({
            ...updateParams,
            updated: new Date().toISOString()
          } as SupplierUpdate)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy nhà cung cấp với id: ${id}`);
        }

        return data as Supplier;
      } catch (error) {
        throw new Error(
          `Không thể cập nhật nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),

  delete: router.mutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('suppliers')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể xóa nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  })
});
