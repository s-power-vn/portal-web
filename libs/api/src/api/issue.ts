import type {
  IssueFileResponse,
  IssueRecord,
  IssueResponse
} from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import { UserData } from './employee';
import { ObjectData } from './object';
import type { Search } from './types';

export type IssueData = IssueResponse<
  Record<string, string>[],
  string[],
  {
    createdBy: UserData;
    assignee: UserData;
    issueFile_via_issue: IssueFileResponse[];
    object: ObjectData;
  }
>;

export const issueApi = router('issue', {
  list: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueData>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
          && title ~ "${search?.filter ?? ''}"
          && deleted = false`,
          expand: `object, object.process, issueFile_via_issue`,
          sort: '-changed'
        })
  }),
  listMine: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueData>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
        && assignee = "${client.authStore.record?.id}"
        && title ~ "${search?.filter ?? ''}"
        && deleted = false`,
          expand: `object, object.process, issueFile_via_issue`,
          sort: '-changed'
        })
  }),
  listRequest: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueData>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
        && title ~ "${search?.filter ?? ''}"
        && object.type = "Request"
        && deleted = false`,
          expand: `object, object.process, issueFile_via_issue`,
          sort: '-changed'
        })
  }),
  listPrice: router.query({
    fetcher: (search?: Search & { projectId: string }) =>
      client
        .collection<IssueData>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${search?.projectId}"
        && title ~ "${search?.filter ?? ''}"
        && object.type = "Price"
        && deleted = false`,
          expand: `object, object.process, issueFile_via_issue`,
          sort: '-changed'
        })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<IssueData>(Collections.Issue).getOne(id, {
        expand: `createdBy, assignee, object, object.process, issueFile_via_issue`
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
      client.collection(Collections.Issue).delete(issueId)
  }),
  forward: router.mutation({
    mutationFn: (params: {
      id: string;
      assignee: string;
      status: string;
      note?: string;
    }) => {
      return client.send('/issue-forward', {
        method: 'POST',
        body: params
      });
    }
  }),
  return: router.mutation({
    mutationFn: async (params: {
      id: string;
      status: string;
      note?: string;
    }) => {
      return client.send('/issue-return', {
        method: 'POST',
        body: params
      });
    }
  }),
  finish: router.mutation({
    mutationFn: async (params: {
      id: string;
      status: string;
      note?: string;
    }) => {
      return client.send('/issue-finish', {
        method: 'POST',
        body: params
      });
    }
  }),
  reset: router.mutation({
    mutationFn: (params: { id: string }) => {
      return client.send('/issue-reset', {
        method: 'POST',
        body: params
      });
    }
  }),
  approve: router.mutation({
    mutationFn: (params: {
      id: string;
      nodeName: string;
      nodeId: string;
      userName: string;
      userId: string;
    }) => {
      return client.send('/issue-approve', {
        method: 'POST',
        body: params
      });
    }
  }),
  unApprove: router.mutation({
    mutationFn: (params: { id: string; nodeId: string }) => {
      return client.send('/issue-unapprove', {
        method: 'POST',
        body: params
      });
    }
  }),
  userInfo: router.query({
    fetcher: async ({
      projectId = '',
      isAll = false
    }: {
      projectId?: string;
      isAll?: boolean;
    }) => {
      try {
        if (isAll) {
          const infos = await client
            .collection(Collections.IssueUserInfo)
            .getFullList({
              filter: `user = "${client.authStore.record?.id}"`
            });

          return infos.reduce((acc, item) => acc + item.count, 0);
        } else {
          const info = await client
            .collection(Collections.IssueUserInfo)
            .getFirstListItem(
              `project = "${projectId}" && user = "${client.authStore.record?.id}"`,
              {
                requestKey: null
              }
            );

          return info?.count;
        }
      } catch (e) {
        return null;
      }
    }
  })
});
