import { type Material, type PaginatedResponse, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

export type MaterialListResponse = PaginatedResponse<Material>;

type MaterialInsert = {
  name: string;
  code?: string | null;
  unit?: string | null;
  note?: string | null;
  organization_id?: string | null;
  created?: string | null;
  updated?: string | null;
};

type MaterialUpdate = {
  name?: string;
  code?: string | null;
  unit?: string | null;
  note?: string | null;
  organization_id?: string | null;
  updated?: string | null;
};

export const materialApi = router('material', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<MaterialListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const { data, count, error } = await client2.rest
          .from('materials')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('created', { ascending: false })
          .or(
            `name.ilike.%${params?.filter ?? ''}%,code.ilike.%${params?.filter ?? ''}%`
          );

        if (error) {
          throw error;
        }

        return {
          items: (data as Material[]) || [],
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách vật tư: ${(error as Error).message}`
        );
      }
    }
  }),

  byId: router.query({
    fetcher: async (id: string): Promise<Material> => {
      try {
        const { data, error } = await client2.rest
          .from('materials')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy vật tư với id: ${id}`);
        }

        return data as Material;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin vật tư: ${(error as Error).message}`
        );
      }
    }
  }),

  create: router.mutation({
    mutationFn: async (params: MaterialInsert): Promise<Material> => {
      try {
        const { data, error } = await client2.rest
          .from('materials')
          .insert({
            ...params,
            created: new Date().toISOString()
          } as MaterialInsert)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Không có dữ liệu trả về');
        }

        return data as Material;
      } catch (error) {
        throw new Error(`Không thể tạo vật tư: ${(error as Error).message}`);
      }
    }
  }),

  update: router.mutation({
    mutationFn: async (
      params: MaterialUpdate & { id: string }
    ): Promise<Material> => {
      try {
        const { id, ...updateParams } = params;
        const { data, error } = await client2.rest
          .from('materials')
          .update({
            ...updateParams,
            updated: new Date().toISOString()
          } as MaterialUpdate)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy vật tư với id: ${id}`);
        }

        return data as Material;
      } catch (error) {
        throw new Error(
          `Không thể cập nhật vật tư: ${(error as Error).message}`
        );
      }
    }
  }),

  delete: router.mutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('materials')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể xóa vật tư: ${(error as Error).message}`);
      }
    }
  })
});
