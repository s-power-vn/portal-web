import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../../types';
import {
  CreateMaterialInput,
  MaterialItem,
  MaterialListItem,
  MaterialListResponse,
  UpdateMaterialInput
} from './material.type';

export const materialApi = router('material', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<MaterialListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const query = client2.rest
          .from('materials')
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

        const items = data.map(it => {
          return {
            id: it.id,
            name: it.name,
            code: it.code,
            unit: it.unit,
            note: it.note,
            created: it.created,
            updated: it.updated
          } as MaterialListItem;
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
          `Không thể lấy danh sách vật tư: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<MaterialItem> => {
      try {
        const { data, error } = await client2.rest
          .from('materials')
          .select(
            `
            *,
            createdBy:users!created_by(*),
            updatedBy:users!updated_by(*)
          `
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy vật tư với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          code: data.code,
          unit: data.unit,
          note: data.note,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as MaterialItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin vật tư: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateMaterialInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('materials').insert({
          ...params
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể tạo vật tư: ${(error as Error).message}`);
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateMaterialInput): Promise<void> => {
      try {
        const { id, ...updateParams } = params;
        const { error } = await client2.rest
          .from('materials')
          .update({
            ...updateParams
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
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
