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
    fetcher: ({ pageIndex = 1, pageSize = 10, filter }: ListParams) => {
      return client
        .collection<ProcessDbData>(Collections.Process)
        .getList(pageIndex, pageSize, {
          filter,
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
      return client.send('/process/apply', {
        method: 'POST',
        body: params
      });
    }
  }),
  duplicate: router.mutation({
    mutationFn: (id: string) => {
      return client.send('/process/duplicate', {
        method: 'POST',
        body: {
          processId: id
        }
      });
    }
  })
});
