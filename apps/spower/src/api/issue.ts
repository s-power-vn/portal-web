import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import { Collections, IssueRecord, IssueResponse, client } from '@storeo/core';

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
  }),
  changeAssignee: router.mutation({
    mutationFn: async ({
      issueId,
      assigneeId
    }: {
      issueId: string;
      assigneeId?: string;
    }) => {
      const issue = await client.collection('issue').getOne(issueId);
      const lastAssignee = issue.assignee;
      return await client.collection('issue').update(issueId, {
        assignee: assigneeId,
        lastAssignee
      });
    }
  }),
  updateTitle: router.mutation({
    mutationFn: async ({
      title,
      issueId
    }: {
      title: string;
      issueId: string;
    }) => {
      return await client.collection('issue').update(issueId, {
        title
      });
    }
  }),
  update: router.mutation({
    mutationFn: (params: IssueRecord & { issueId: string }) => {
      const { issueId, ...data } = params;
      return client.collection(Collections.Issue).update(issueId, data);
    }
  })
});
