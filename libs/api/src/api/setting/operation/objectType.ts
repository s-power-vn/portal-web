import { ObjectType, PaginatedResponse, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';

export type ObjectTypeListResponse = PaginatedResponse<ObjectType>;

export const objectTypeApi = router('objectType', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<ObjectTypeListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        const filter = params?.filter
          ? `name.ilike.%${params.filter}%`
          : undefined;

        const { data, count, error } = await client2.rest
          .from('object_types')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('created', { ascending: false });

        if (filter) {
          (client2.rest as any).url.searchParams.append('and', filter);
        }

        if (error) {
          throw error;
        }

        const items = data as unknown as ObjectType[];

        return {
          items,
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<ObjectType> => {
      try {
        const { data, error } = await client2.rest
          .from('object_types')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy loại đối tượng với id: ${id}`);
        }

        return data as unknown as ObjectType;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<ObjectType[]> => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('object_types')
          .select('*')
          .in('id', ids);

        if (error) {
          throw error;
        }

        return data as unknown as ObjectType[];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byType: router.query({
    fetcher: async (typeName: string): Promise<ObjectType> => {
      try {
        const { data, error } = await client2.rest
          .from('object_types')
          .select('*')
          .eq('name', typeName)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy loại đối tượng với tên: ${typeName}`);
        }

        return data as unknown as ObjectType;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  })
});
