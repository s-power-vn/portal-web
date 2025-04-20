import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../../types';
import {
  CreateSupplierInput,
  SupplierItem,
  SupplierListItem,
  SupplierListResponse,
  UpdateSupplierInput
} from './supplier.type';

export const supplierApi = router('supplier', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<SupplierListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const query = client2.rest
          .from('suppliers')
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
            code: item.code,
            email: item.email,
            phone: item.phone,
            address: item.address,
            note: item.note,
            created: item.created,
            updated: item.updated
          } as SupplierListItem;
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
          `Không thể lấy danh sách nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<SupplierItem> => {
      try {
        const { data, error } = await client2.rest
          .from('suppliers')
          .select(
            `
            *,
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
          throw new Error(`Không tìm thấy nhà cung cấp với id: ${id}`);
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
        } as SupplierItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<SupplierListItem[]> => {
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

        if (!data) {
          return [];
        }

        const items = data.map(item => {
          return {
            id: item.id,
            name: item.name,
            code: item.code,
            email: item.email,
            phone: item.phone,
            address: item.address,
            note: item.note,
            created: item.created,
            updated: item.updated
          } as SupplierListItem;
        });

        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateSupplierInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('suppliers').insert({
          ...params
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể tạo nhà cung cấp: ${(error as Error).message}`
        );
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateSupplierInput): Promise<void> => {
      try {
        const { id, ...updateParams } = params;
        const { error } = await client2.rest
          .from('suppliers')
          .update({
            ...updateParams
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
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
