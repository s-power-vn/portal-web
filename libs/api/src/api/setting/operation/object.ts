import {
  Collections,
  ObjectResponse,
  ObjectTypeResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';
import { ProcessDbData } from './process';

export type ObjectData = ObjectResponse<{
  type: ObjectTypeResponse;
  process: ProcessDbData;
}>;

export const objectApi = router('object', {
  list: router.query({
    fetcher: ({ pageIndex = 1, pageSize = 10, filter }: ListParams) =>
      client
        .collection<ObjectData>(Collections.Object)
        .getList(pageIndex, pageSize, {
          filter,
          expand: `process, type`
        })
  }),
  listActive: router.query({
    fetcher: ({ pageIndex = 1, pageSize = 10, filter }: ListParams) =>
      client
        .collection<ObjectData>(Collections.Object)
        .getList(pageIndex, pageSize, {
          filter: (filter ? `${filter} && ` : '') + `( active = true )`,
          expand: `process, type`
        })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ObjectData>(Collections.Object).getOne(id, {
        expand: `process, type`
      })
  }),
  byIds: router.query({
    fetcher: (ids: string[]) => {
      if (ids.length === 0) {
        return [];
      }

      return client.collection<ObjectData>(Collections.Object).getFullList({
        filter: ids.map(id => `id = "${id}"`).join(' || '),
        expand: `process, type`
      });
    }
  }),
  create: router.mutation({
    mutationFn: (params: Partial<ObjectResponse>) =>
      client.collection<ObjectData>(Collections.Object).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: Partial<ObjectResponse> & { id: string }) =>
      client
        .collection<ObjectData>(Collections.Object)
        .update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection<ObjectData>(Collections.Object).delete(id)
  }),
  duplicate: router.mutation({
    mutationFn: (id: string) =>
      client.send('/object/duplicate', {
        method: 'POST',
        body: {
          objectId: id
        }
      })
  }),
  actives: router.mutation({
    mutationFn: (ids: string[]) =>
      Promise.all(
        ids.map(id =>
          client.collection<ObjectData>(Collections.Object).update(id, {
            active: true
          })
        )
      )
  }),
  getVariables: router.query({
    fetcher: async (objectType: string) => {
      return await client.send<
        {
          name: string;
          type: string;
          display: string;
        }[]
      >('/object/list-variables', {
        method: 'GET',
        query: {
          objectType
        }
      });
    }
  })
});
