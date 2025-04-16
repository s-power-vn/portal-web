import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../../types';
import {
  CreateObjectInput,
  ObjectItem,
  ObjectListFullResponse,
  ObjectListItem,
  ObjectListResponse,
  UpdateObjectInput
} from './object.type';

export const objectApi = router('object', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<ObjectListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = client2.rest
          .from('objects')
          .select(
            `*, 
            objectType:object_types(*), 
            process:processes(*)`,
            {
              count: 'exact'
            }
          )
          .range(from, to)
          .order('created', { ascending: false });

        const filter = params?.filter
          ? `name.ilike.%${params.filter}%`
          : undefined;

        if (filter) {
          query = query.or(filter);
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
            objectType: item.objectType,
            process: item.process,
            description: item.description,
            active: item.active,
            created: item.created,
            updated: item.updated
          } as ObjectListItem;
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
          `Không thể lấy danh sách đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  listByType: router.query({
    fetcher: async (
      params?: ListParams & {
        objectType: string;
      }
    ): Promise<ObjectListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        const filter = params?.filter
          ? `name.ilike.%${params.filter}%`
          : undefined;

        let query = client2.rest
          .from('objects')
          .select(
            `*, 
            objectType:object_types(*), 
            process:processes(*)`,
            {
              count: 'exact'
            }
          )
          .range(from, to)
          .eq('object_type_id', params?.objectType ?? '')
          .order('created', { ascending: false });

        if (filter) {
          query = query.or(filter);
        }

        const { data, count, error } = await query;

        if (error) {
          throw error;
        }

        console.log(params?.filter);

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
            objectType: item.objectType,
            process: item.process,
            description: item.description,
            active: item.active,
            created: item.created,
            updated: item.updated
          } as ObjectListItem;
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
          `Không thể lấy danh sách đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  listByActive: router.query({
    fetcher: async (params?: ListParams): Promise<ObjectListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = client2.rest
          .from('objects')
          .select(
            `*, 
            objectType:object_types(*), 
            process:processes(*)`,
            {
              count: 'exact'
            }
          )
          .eq('active', true)
          .range(from, to)
          .order('created', { ascending: false });

        if (params?.filter) {
          query = query.or(`name.ilike.%${params.filter}%`);
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
            objectType: item.objectType,
            process: item.process,
            description: item.description,
            active: item.active,
            created: item.created,
            updated: item.updated
          } as ObjectListItem;
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
          `Không thể lấy danh sách đối tượng hoạt động: ${(error as Error).message}`
        );
      }
    }
  }),
  listFullActiveByType: router.query({
    fetcher: async (objectType: string): Promise<ObjectListFullResponse> => {
      try {
        const { data, error } = await client2.rest
          .from('objects')
          .select(
            `*,
            objectType:object_types(*),
            process:processes(*)`,
            { count: 'exact' }
          )
          .eq('object_type_id', objectType)
          .eq('active', true)
          .order('created', { ascending: false });

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
            objectType: item.objectType,
            process: item.process,
            description: item.description,
            active: item.active,
            created: item.created,
            updated: item.updated
          } as ObjectListItem;
        });

        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách đối tượng hoạt động theo loại: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<ObjectItem> => {
      try {
        const { data, error } = await client2.rest
          .from('objects')
          .select(
            `*,
            objectType:object_types(*),
            process:processes(*),
            createdBy:users!created_by(*),
            updatedBy:users!updated_by(*)`,
            { count: 'exact' }
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy đối tượng với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          objectType: data.objectType,
          process: data.process,
          description: data.description,
          active: data.active,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as ObjectItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]): Promise<ObjectListItem[]> => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('objects')
          .select(
            `*,
            objectType:object_types(*),
            process:processes(*)`,
            { count: 'exact' }
          )
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
            objectType: item.objectType,
            process: item.process,
            description: item.description,
            active: item.active,
            created: item.created,
            updated: item.updated
          } as ObjectListItem;
        });

        return items;
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateObjectInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('objects').insert(params);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể tạo đối tượng: ${(error as Error).message}`);
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateObjectInput): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('objects')
          .update(params)
          .eq('id', params.id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể cập nhật đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  delete: router.mutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await client2.rest
          .from('objects')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return true;
      } catch (error) {
        throw new Error(`Không thể xóa đối tượng: ${(error as Error).message}`);
      }
    }
  }),
  duplicate: router.mutation({
    mutationFn: async (id: string) => {
      try {
        // Use direct HTTP request instead of RPC
        const response = await fetch(
          `${client2.rest.url}/rest/v1/rpc/duplicate_object`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${client2.rest.headers.Authorization}`
            },
            body: JSON.stringify({ object_id: id })
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(
          `Không thể nhân bản đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  getVariables: router.query({
    fetcher: async (objectType: string) => {
      try {
        const response = await fetch(
          `${client2.rest.url}/rest/v1/rpc/list_object_variables`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${client2.rest.headers.Authorization}`
            },
            body: JSON.stringify({ object_type: objectType })
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data as {
          name: string;
          type: string;
          display: string;
        }[];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách biến: ${(error as Error).message}`
        );
      }
    }
  })
});
