import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../../types';
import {
  ObjectTypeItem,
  ObjectTypeListItem,
  ObjectTypeListResponse
} from './object-type.type';

export const objectTypeApi = router('objectType', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<ObjectTypeListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        const query = client2.rest
          .from('object_types')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('created', { ascending: false });

        const filter = params?.filter
          ? `name.ilike.%${params.filter}%`
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
              description: item.description,
              display: item.display,
              color: item.color,
              icon: item.icon,
              created: item.created,
              updated: item.updated
            }) as ObjectTypeListItem
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
          `Không thể lấy danh sách loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<ObjectTypeItem> => {
      try {
        const { data, error } = await client2.rest
          .from('object_types')
          .select(
            `*, 
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
          throw new Error(`Không tìm thấy loại đối tượng với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          display: data.display,
          color: data.color,
          icon: data.icon,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as ObjectTypeItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byType: router.query({
    fetcher: async (typeName: string): Promise<ObjectTypeItem> => {
      try {
        const { data, error } = await client2.rest
          .from('object_types')
          .select(
            `*, 
            createdBy:users!created_by(*),
            updatedBy:users!updated_by(*)
          `
          )
          .eq('name', typeName)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy loại đối tượng với tên: ${typeName}`);
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          display: data.display,
          color: data.color,
          icon: data.icon,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as ObjectTypeItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<ObjectTypeListItem[]> => {
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

        if (!data) {
          return [];
        }

        return data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          display: item.display,
          color: item.color,
          icon: item.icon,
          created: item.created,
          updated: item.updated
        })) as ObjectTypeListItem[];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  })
});
