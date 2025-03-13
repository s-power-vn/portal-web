import {
  Collections,
  ObjectTypeResponse,
  ProcessRecord,
  ProcessResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';
import { ObjectData } from './object';

export type ProcessDbData = ProcessResponse<
  {},
  {
    objectType: ObjectTypeResponse;
    object_via_process: ObjectData[];
  }
>;

export const processApi = router('process', {
  list: router.query({
    fetcher: (params?: ListParams) => {
      return client
        .collection<ProcessDbData>(Collections.Process)
        .getList(params?.pageIndex ?? 1, params?.pageSize ?? 10, {
          expand: 'objectType, object_via_process, object_via_process.type'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => {
      return client.collection<ProcessDbData>(Collections.Process).getOne(id, {
        expand: 'objectType, object_via_process'
      });
    }
  }),
  byIds: router.query({
    fetcher: (ids: string[]) => {
      if (ids.length === 0) {
        return [];
      }

      return client.collection<ProcessDbData>(Collections.Process).getFullList({
        filter: `id ~ "${ids.join('" || id ~ "')}"`
      });
    }
  }),
  create: router.mutation({
    mutationFn: (params: Partial<ProcessRecord>) => {
      if (!params.name) {
        throw new Error('Thiếu tên quy trình');
      }

      params.createdBy = client.authStore.record?.id;

      return client.collection(Collections.Process).create(params);
    }
  }),
  update: router.mutation({
    mutationFn: (params: Partial<ProcessRecord>) => {
      if (!params.id) {
        throw new Error('Thiếu id quy trình');
      }

      return client.collection(Collections.Process).update(params.id, params);
    }
  }),
  delete: router.mutation({
    mutationFn: (id: string) => {
      return client.collection(Collections.Process).delete(id);
    }
  }),
  apply: router.mutation({
    mutationFn: (params: { processId: string; objectIds: string[] }) => {
      return client.send('/apply-process', {
        method: 'POST',
        body: params
      });
    }
  }),
  duplicate: router.mutation({
    mutationFn: (id: string) => {
      console.log('id', id);
      return client.send('/duplicate-process', {
        method: 'POST',
        body: {
          processId: id
        }
      });
    }
  })
});
