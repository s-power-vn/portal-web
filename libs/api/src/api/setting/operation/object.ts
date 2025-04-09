import { Object, ObjectType, Process, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';

export type ObjectData = Object & {
  type: ObjectType;
  process?: Process;
};

export type CreateObjectInput = {
  name: string;
  object_type_id: string;
  process_id?: string;
  description?: string;
  active?: boolean;
};

export type UpdateObjectInput = {
  id: string;
  name?: string;
  object_type_id?: string;
  process_id?: string;
  description?: string;
};

export const objectApi = router('object', {
  list: router.query({
    fetcher: async (params?: ListParams) => {
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
          .select('*, type:object_types(*), process:processes(*)', {
            count: 'exact'
          })
          .range(from, to)
          .order('created', { ascending: false });

        if (filter) {
          query = query.or(filter);
        }

        const { data, count, error } = await query;

        if (error) {
          throw error;
        }

        const items = data as unknown as ObjectData[];

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
  listActive: router.query({
    fetcher: async (params?: ListParams) => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = client2.rest
          .from('objects')
          .select('*, type:object_types(*), process:processes(*)', {
            count: 'exact'
          })
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

        const items = data as unknown as ObjectData[];

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
  byId: router.query({
    fetcher: async (id: string) => {
      try {
        const { data, error } = await client2.rest
          .from('objects')
          .select('*, type:object_types(*), process:processes(*)')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy đối tượng với id: ${id}`);
        }

        return data as unknown as ObjectData;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byIds: router.query({
    fetcher: async (ids: string[]) => {
      try {
        if (ids.length === 0) {
          return [];
        }

        const { data, error } = await client2.rest
          .from('objects')
          .select('*, type:object_types(*), process:processes(*)')
          .in('id', ids);

        if (error) {
          throw error;
        }

        return data as unknown as ObjectData[];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateObjectInput) => {
      try {
        const { data, error } = await client2.rest
          .from('objects')
          .insert(params)
          .select('*, type:object_types(*), process:processes(*)')
          .single();

        if (error) {
          throw error;
        }

        return data as unknown as ObjectData;
      } catch (error) {
        throw new Error(`Không thể tạo đối tượng: ${(error as Error).message}`);
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateObjectInput) => {
      try {
        const { data, error } = await client2.rest
          .from('objects')
          .update(params)
          .eq('id', params.id)
          .select('*, type:object_types(*), process:processes(*)')
          .single();

        if (error) {
          throw error;
        }

        return data as unknown as ObjectData;
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
