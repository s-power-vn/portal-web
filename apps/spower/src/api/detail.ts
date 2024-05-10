import { router } from 'react-query-kit';

import { Collections, DetailRecord, client } from '@storeo/core';

export const detailApi = router('detail', {
  listFull: router.query({
    fetcher: (projectId: string) =>
      client.collection(Collections.Detail).getFullList({
        filter: `project = "${projectId}"`,
        sort: '-created'
      })
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Detail).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (
      params: DetailRecord & { projectId: string; parentId?: string }
    ) => {
      const parent = params.parentId
        ? params.parentId
        : `${params.projectId}-root`;
      return client.collection(Collections.Detail).create({
        ...params,
        project: params.projectId,
        parent
      });
    }
  }),
  update: router.mutation({
    mutationFn: (params: DetailRecord & { id: string }) =>
      client.collection(Collections.Detail).update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (detailIds: string[]) =>
      Promise.all(
        detailIds.map(projectId =>
          client.collection(Collections.Detail).delete(projectId, {
            requestKey: null
          })
        )
      )
  })
});

export const detailInfoApi = router('detailInfo', {
  listFull: router.query({
    fetcher: (projectId: string) =>
      client.collection(Collections.DetailInfo).getFullList({
        filter: `project = "${projectId}"`,
        sort: '-created'
      })
  })
});
