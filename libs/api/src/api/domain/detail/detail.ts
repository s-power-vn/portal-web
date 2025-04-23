import { Collections, client, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import {
  CreateDetailInput,
  DetailFullListResponse,
  DetailItem,
  DetailListItem,
  UpdateDetailInput
} from './detail.type';

export const detailApi = router('detail', {
  listFull: router.query({
    fetcher: async (projectId: string): Promise<DetailFullListResponse> => {
      const { data, error } = await client2.rest
        .from('details')
        .select(
          `
            *,
            parent:parent_id(
              id,
              title,
              level
            ),
            project:project_id(
              id,
              name
            )
          `
        )
        .eq('project_id', projectId)
        .order('created', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      const items = data.map(item => {
        return {
          id: item.id,
          title: item.title,
          level: item.level,
          note: item.note,
          parent: item.parent,
          parent_id: item.parent_id,
          project: item.project,
          project_id: item.project_id,
          volume: item.volume,
          unit: item.unit,
          unitPrice: item.unit_price,
          extend: item.extend,
          created: item.created,
          updated: item.updated,
          createdBy: item.created_by,
          updatedBy: item.updated_by
        } as DetailListItem;
      });

      return items;
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<DetailItem> => {
      const { data, error } = await client2.rest
        .from('details')
        .select(
          `
            *,
            parent:parent_id(
              id,
              title,
              level
            ),
            project:project_id(
              id,
              name
            ),
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
        throw new Error(`Không tìm thấy hạng mục công việc ${id}`);
      }

      return {
        id: data.id,
        title: data.title,
        note: data.note,
        parent: data.parent,
        project: data.project,
        volume: data.volume,
        unit: data.unit,
        unitPrice: data.unit_price,
        level: data.level,
        extend: data.extend,
        created: data.created,
        updated: data.updated,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy
      } as DetailItem;
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateDetailInput): Promise<void> => {
      try {
        const { error } = await client2.rest.from('details').insert({
          title: params.title,
          note: params.note,
          volume: params.volume,
          unit: params.unit,
          unit_price: params.unit_price,
          level: params.level,
          parent_id: params.parent_id,
          project_id: params.project_id
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể tạo hạng mục công việc: ${(error as Error).message}`
        );
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateDetailInput): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('details')
          .update({
            title: params.title,
            note: params.note,
            volume: params.volume,
            unit: params.unit,
            unit_price: params.unit_price,
            level: params.level
          })
          .eq('id', params.id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể cập nhật hạng mục công việc: ${(error as Error).message}`
        );
      }
    }
  }),
  delete: router.mutation({
    mutationFn: async (detailIds: string[]): Promise<void> => {
      try {
        const { error } = await client2.rest
          .from('details')
          .delete()
          .in('id', detailIds);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(
          `Không thể xóa hạng mục công việc: ${(error as Error).message}`
        );
      }
    }
  })
});

export const detailImportApi = router('detailImport', {
  upload: router.mutation({
    mutationFn: ({
      projectId,
      files
    }: {
      projectId: string;
      files: FileList;
    }) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append('file', file);
      }
      formData.append('project', projectId);
      formData.append('status', 'Working');
      return client.collection(Collections.DetailImport).create(formData);
    }
  })
});
