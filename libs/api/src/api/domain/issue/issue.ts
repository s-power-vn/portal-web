import type { IssueRecord } from 'portal-core';
import { client2, userId } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';
import { ProjectItem } from '../project/project.type';
import { UserItem } from '../user/user.type';
import { IssueListItem, IssueListResponse } from './issue.type';

export const issueApi = router('issue', {
  list: router.query({
    fetcher: async (params?: ListParams & { projectId: string }) => {}
  }),
  listMine: router.query({
    fetcher: async (
      params?: ListParams & { projectId: string }
    ): Promise<IssueListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        if (!userId.value) {
          throw new Error('Không tìm thấy người dùng');
        }

        if (!params?.projectId) {
          throw new Error('Không tìm thấy dự án');
        }

        const { data, count, error } = await client2.rest
          .from('issues')
          .select(
            `
            *,
            project:project_id(
              id,
              name,
              bidding
            ),
            object:object_id(
              id,
              name,
              type:object_type_id(
                id,
                name,
                icon,
                color
              )
            ),
            files:issue_files(
              id,
              name,
              type,
              size,
              url
            )
            `,
            { count: 'exact' }
          )
          .contains('assignees', `["${userId.value}"]`)
          .eq('project_id', params.projectId)
          .range(from, to);

        if (error) {
          throw error;
        }

        const items = data.map(it => {
          return {
            id: it.id,
            title: it.title,
            status: it.status,
            deadlineStatus: it.deadline_status,
            code: it.code,
            startDate: it.start_date,
            endDate: it.end_date,
            object: it.object,
            project: it.project as ProjectItem,
            assignees: (it.assignees as UserItem[]) || [],
            assigned: it.assigned,
            files: it.files
          } as IssueListItem;
        });

        return {
          items,
          page: pageIndex,
          perPage: pageSize,
          totalItems: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách công việc của bạn: ${(error as Error).message}`
        );
      }
    }
  }),
  listByObjectType: router.query({
    fetcher: async (
      params?: ListParams & { projectId: string; objectTypeId?: string }
    ) => {}
  }),
  byId: router.query({
    fetcher: async (id: string) => {
      try {
        const { data, error } = await client2.rest.from('issues').select(
          `
            *,
            object:object_id(
              id,
              name,
              type:object_type_id(id, name, icon, color))
          `
        );
        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        throw new Error(
          `Không thể lấy chi tiết công việc: ${(error as Error).message}`
        );
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (
      params: Partial<IssueRecord> & {
        issueId: string;
      }
    ) => {}
  }),
  delete: router.mutation({
    mutationFn: async (issueId: string) => {}
  }),
  forward: router.mutation({
    mutationFn: async (params: {
      id: string;
      assignees: string[];
      status: string;
      note?: string;
    }) => {}
  }),
  return: router.mutation({
    mutationFn: async (params: {
      id: string;
      status: string;
      note?: string;
    }) => {}
  }),
  finish: router.mutation({
    mutationFn: async (params: {
      id: string;
      status: string;
      note?: string;
    }) => {}
  }),
  reset: router.mutation({
    mutationFn: async (params: { id: string }) => {}
  }),
  approve: router.mutation({
    mutationFn: async (params: {
      id: string;
      nodeName: string;
      nodeId: string;
      userName: string;
      userId: string;
    }) => {}
  }),
  reject: router.mutation({
    mutationFn: async (params: { id: string; nodeId: string }) => {}
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
        if (!userId.value) {
          return 0;
        }

        if (isAll) {
          const { data, error } = await client2.rest
            .from('issue_user_info')
            .select('count')
            .eq('user_id', userId.value);

          if (error) {
            return 0;
          }

          if (!data || data.length === 0) {
            return 0;
          }

          return data.reduce(
            (acc: number, item: { count: number | null }) =>
              acc + (item.count || 0),
            0
          );
        } else {
          const { data, error } = await client2.rest
            .from('issue_user_info')
            .select('count')
            .eq('project_id', projectId)
            .eq('user_id', userId.value);

          if (error) {
            return 0;
          }

          if (!data || data.length === 0) {
            return 0;
          }

          return data[0]?.count || 0;
        }
      } catch (e) {
        return 0;
      }
    }
  })
});
