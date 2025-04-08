import { Object, ObjectType, Process, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';

export type ProcessData = Process & {
  object_type?: ObjectType;
  objects?: Object[];
};

export const processApi = router('process', {
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
          .from('processes')
          .select(
            '*, object_type:object_types(*), objects!objects_process_id_fkey(*)',
            { count: 'exact' }
          )
          .range(from, to)
          .order('created', { ascending: false });

        if (filter) {
          query = query.or(filter);
        }

        const { data, count, error } = await query;

        if (error) {
          throw error;
        }

        const items = data as unknown as ProcessData[];

        return {
          items,
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách quy trình: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string) => {
      try {
        const { data, error } = await client2.rest
          .from('processes')
          .select(
            '*, object_type:object_types(*), objects!objects_process_id_fkey(*)'
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy quy trình với id: ${id}`);
        }

        return data as unknown as ProcessData;
      } catch (error) {
        throw new Error(
          `Không thể lấy thông tin quy trình: ${(error as Error).message}`
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
          .from('processes')
          .select(
            '*, object_type:object_types(*), objects!objects_process_id_fkey(*)'
          )
          .in('id', ids);

        if (error) {
          throw error;
        }

        return data as unknown as ProcessData[];
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách quy trình: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: Partial<Process>) => {
      try {
        if (!params.name) {
          throw new Error('Thiếu tên quy trình');
        }

        // We'll skip setting the user ID and let the backend handle it

        // Cast to any to bypass type checking for now
        const { data, error } = await client2.rest
          .from('processes')
          .insert(params as any)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data as Process;
      } catch (error) {
        throw new Error(`Không thể tạo quy trình: ${(error as Error).message}`);
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: Partial<Process>) => {
      try {
        if (!params.id) {
          throw new Error('Thiếu id quy trình');
        }

        const { id, ...updateData } = params;

        // Cast to any to bypass type checking for now
        const { data, error } = await client2.rest
          .from('processes')
          .update(updateData as any)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data as Process;
      } catch (error) {
        throw new Error(
          `Không thể cập nhật quy trình: ${(error as Error).message}`
        );
      }
    }
  }),
  delete: router.mutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await client2.rest
          .from('processes')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return true;
      } catch (error) {
        throw new Error(`Không thể xóa quy trình: ${(error as Error).message}`);
      }
    }
  }),
  apply: router.mutation({
    mutationFn: async (params: { processId: string; objectIds: string[] }) => {
      try {
        const response = await fetch(
          `${client2.rest.url}/rest/v1/rpc/apply_process`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${client2.rest.headers.Authorization}`
            },
            body: JSON.stringify({
              process_id: params.processId,
              object_ids: params.objectIds
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(
          `Không thể áp dụng quy trình: ${(error as Error).message}`
        );
      }
    }
  }),
  duplicate: router.mutation({
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(
          `${client2.rest.url}/rest/v1/rpc/duplicate_process`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${client2.rest.headers.Authorization}`
            },
            body: JSON.stringify({ process_id: id })
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(
          `Không thể nhân bản quy trình: ${(error as Error).message}`
        );
      }
    }
  })
});
