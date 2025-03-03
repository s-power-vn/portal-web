import type {
  DetailInfoResponse,
  DetailRecord,
  IssueResponse,
  RequestResponse
} from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

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
    mutationFn: (params: Partial<DetailRecord>) => {
      const parent = params.parent ? params.parent : `${params.project}-root`;
      return client.collection(Collections.Detail).create({
        ...params,
        project: params.project,
        parent
      });
    }
  }),
  update: router.mutation({
    mutationFn: (params: Partial<DetailRecord> & { id: string }) =>
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
      client
        .collection<
          DetailInfoResponse & {
            expand: {
              request: RequestResponse;
              issue: IssueResponse;
            };
          }
        >(Collections.DetailInfo)
        .getFullList({
          filter: `project = "${projectId}"`,
          expand: 'request,issue',
          sort: '-created'
        })
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
