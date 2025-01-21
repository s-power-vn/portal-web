import type { IssueRecord, IssueResponse } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { UserData } from './employee';
import type { Search } from './types';

export type IssueData = IssueResponse & {
  expand: {
    createdBy: UserData;
    assignee: UserData;
  };
};

export const issueApi = router('issue', {
  list: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
          && title ~ "${search?.filter ?? ''}"
          && deleted = false`,
          sort: '-changed'
        })
  }),
  listMine: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
        && assignee = "${client.authStore.model?.id}"
        && title ~ "${search?.filter ?? ''}"
        && deleted = false`,
          sort: '-changed'
        })
  }),
  listRequest: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
        && title ~ "${search?.filter ?? ''}"
        && type = "Request"
        && deleted = false`,
          sort: '-changed'
        })
  }),
  listPrice: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
        && title ~ "${search?.filter ?? ''}"
        && type = "Price"
        && deleted = false`,
          sort: '-changed'
        })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<IssueData>(Collections.Issue).getOne(id, {
        expand: `createdBy, assignee`
      })
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
      params: Partial<IssueRecord> & {
        issueId: string;
      }
    ) => {
      const { issueId, ...data } = params;
      return client.collection(Collections.Issue).update(issueId, data);
    }
  }),
  delete: router.mutation({
    mutationFn: (issueId: string) =>
      client.collection(Collections.Issue).update(issueId, {
        deleted: true
      })
  })
});
