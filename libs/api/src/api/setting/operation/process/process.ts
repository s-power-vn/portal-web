import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../../types';
import {
  CreateProcessInput,
  ProcessItem,
  ProcessListItem,
  ProcessListResponse,
  UpdateProcessInput
} from './process.type';

export const processApi = router('process', {
  list: router.query({
    fetcher: async (params?: ListParams): Promise<ProcessListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = client2.rest
          .from('processes')
          .select(
            `*, 
            objectType:object_types(*), 
            objects!objects_process_id_fkey(*),
            createdBy:organization_members!created_by(*),
            updatedBy:organization_members!updated_by(*)
            `,
            { count: 'exact' }
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
            description: item.description,
            process: item.process,
            objectType: item.objectType,
            objects: item.objects,
            startNode: item.start_node,
            finishNode: item.finish_node,
            created: item.created,
            updated: item.updated,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy
          } as ProcessListItem;
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
          `Không thể lấy danh sách quy trình: ${(error as Error).message}`
        );
      }
    }
  }),
  listByType: router.query({
    fetcher: async (
      params?: ListParams & { objectType?: string }
    ): Promise<ProcessListResponse> => {
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
            `*, 
            objectType:object_types(*), 
            objects!objects_process_id_fkey(*),
            createdBy:organization_members!created_by(*),
            updatedBy:organization_members!updated_by(*)
            `,
            { count: 'exact' }
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
            description: item.description,
            process: item.process,
            objectType: item.objectType,
            objects: item.objects,
            startNode: item.start_node,
            finishNode: item.finish_node,
            created: item.created,
            updated: item.updated,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy
          } as ProcessListItem;
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
            `*, 
            objectType:object_types(*), 
            objects:objects!objects_process_id_fkey(*),
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
          throw new Error(`Không tìm thấy quy trình với id: ${id}`);
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description,
          process: data.process,
          objectType: data.objectType,
          objects: data.objects,
          startNode: data.start_node,
          finishNode: data.finish_node,
          created: data.created,
          updated: data.updated,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as ProcessItem;
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
            `*,
            objectType:object_types(*),
            objects:objects!objects_process_id_fkey(*)`,
            { count: 'exact' }
          )
          .in('id', ids);

        if (error) {
          throw error;
        }

        if (!data) {
          return [];
        }

        return data.map(item => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            process: item.process,
            objectType: item.objectType,
            objects: item.objects,
            startNode: item.start_node,
            finishNode: item.finish_node,
            created: item.created,
            updated: item.updated
          } as ProcessListItem;
        });
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách quy trình: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateProcessInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('processes').insert({
          ...params
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể tạo quy trình: ${(error as Error).message}`);
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateProcessInput): Promise<void> => {
      try {
        const { id, ...updateData } = params;

        const { error } = await client2.rest
          .from('processes')
          .update({
            ...updateData
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
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
    mutationFn: (params: { processId: string; objectIds: string[] }) => {
      throw new Error('Not implemented');
    }
  }),
  duplicate: router.mutation({
    mutationFn: (id: string) => {
      throw new Error('Not implemented');
    }
  })
});
