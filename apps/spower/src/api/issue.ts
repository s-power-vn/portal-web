import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import { Collections, IssueRecord, IssueResponse, client } from '@storeo/core';

import { UserData } from './employee';

export const IssuesSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

export type IssuesSearch = InferType<typeof IssuesSearchSchema>;

export type IssueData = IssueResponse & {
  expand: {
    createdBy: UserData;
    assignee: UserData;
  };
};

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
    fetcher: (id: string) =>
      client.collection<IssueData>(Collections.Issue).getOne(id, {
        expand: `createdBy, assignee`
      })
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
    mutationFn: (
      params: Omit<IssueRecord, 'startDate' | 'endDate'> & {
        issueId: string;
        startDate?: Date;
        endDate?: Date;
      }
    ) => {
      const { issueId, ...data } = params;
      return client.collection(Collections.Issue).update(issueId, data);
    }
  })
});
