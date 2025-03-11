import { Collections, ObjectTypeResponse, client } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';

export type ObjectTypeData = ObjectTypeResponse;

export const objectTypeApi = router('objectType', {
  list: router.query({
    fetcher: (params?: ListParams) =>
      client
        .collection<ObjectTypeData>(Collections.ObjectType)
        .getList(params?.pageIndex ?? 1, params?.pageSize ?? 10, {
          filter: params?.filter ?? ''
        })
  }),
  listFull: router.query({
    fetcher: () =>
      client
        .collection<ObjectTypeData>(Collections.ObjectType)
        .getFullList({ sort: 'name' })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ObjectTypeData>(Collections.ObjectType).getOne(id)
  }),
  byType: router.query({
    fetcher: (typeName: string) =>
      client
        .collection<ObjectTypeData>(Collections.ObjectType)
        .getFirstListItem(`name = "${typeName}"`)
  })
});
