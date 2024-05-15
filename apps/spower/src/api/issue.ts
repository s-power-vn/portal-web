import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import { Collections, IssueResponse, client } from '@storeo/core';

export const IssuesSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

export type IssuesSearch = InferType<typeof IssuesSearchSchema>;

export const issueApi = router('issue', {
  list: router.query({
    fetcher: (search?: IssuesSearch & { projectId: string }) =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
          && title ~ "${search?.filter ?? ''}"
          && deleted = false`,
          sort: '-created'
        })
  }),
  listMine: router.query({
    fetcher: (search?: IssuesSearch & { projectId: string }) =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
        && assignee = "${client.authStore.model?.id}"
        && title ~ "${search?.filter ?? ''}"
        && deleted = false`,
          sort: '-created'
        })
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Issue).getOne(id)
  })
});
