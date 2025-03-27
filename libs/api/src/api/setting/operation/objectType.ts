import { Collections, ObjectTypeResponse, client } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';

export type ObjectTypeData = ObjectTypeResponse;

export const objectTypeApi = router('objectType', {
  list: router.query({
    fetcher: ({ pageIndex = 1, pageSize = 10, filter }: ListParams) =>
      client
        .collection<ObjectTypeData>(Collections.ObjectType)
        .getList(pageIndex ?? 1, pageSize ?? 10, {
          filter
        })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ObjectTypeData>(Collections.ObjectType).getOne(id)
  }),
  byIds: router.query({
    fetcher: (ids: string[]) => {
      if (ids.length === 0) {
        return [];
      }

      return client
        .collection<ObjectTypeData>(Collections.ObjectType)
        .getFullList({
          filter: `id ~ "${ids.join('" || id ~ "')}"`
        });
    }
  }),
  byType: router.query({
    fetcher: (typeName: string) =>
      client
        .collection<ObjectTypeData>(Collections.ObjectType)
        .getFirstListItem(`name = "${typeName}"`)
  })
});
