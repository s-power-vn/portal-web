import { client2, currentEmployeeId, currentUserId } from 'portal-core';

import { router } from 'react-query-kit';

import { EmployeeItem } from '../../setting/general';
import { ObjectItem } from '../../setting/operation';
import { ListParams } from '../../types';
import { ProjectItem } from '../project/project.type';
import {
  IssueFileItem,
  IssueItem,
  IssueListItem,
  IssueListResponse
} from './issue.type';

export const issueApi = router('issue', {
  list: router.query({
    fetcher: async (
      params?: ListParams & { projectId: string }
    ): Promise<IssueListResponse> => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        if (!currentEmployeeId.value) {
          throw new Error('Không tìm thấy người dùng');
        }

        if (!params?.projectId) {
          throw new Error('Không tìm thấy dự án');
        }

        const { data, count, error } = await client2.rest
          .from('issues')
          .select(
            ` *,
              project:project_id(
                id,
                name
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
          .eq('project_id', params.projectId)
          .range(from, to);

        if (error) {
          throw error;
        }

        const items = data.map(it => {
          return {
            id: it.id,
            title: it.title,
            code: it.code,
            status: it.status,
            startDate: it.start_date,
            endDate: it.end_date,
            deadlineStatus: it.deadline_status,
            processStatus: it.process_status,
            object: it.object,
            project: it.project as ProjectItem,
            approvers: it.approvers,
            assignees: (it.assignees as EmployeeItem[]) || [],
            lastAssignees: (it.last_assignees as EmployeeItem[]) || [],
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
          `Không thể lấy danh sách công việc: ${(error as Error).message}`
        );
      }
    }
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

        if (!currentEmployeeId.value) {
          throw new Error('Không tìm thấy người dùng');
        }

        if (!params?.projectId) {
          throw new Error('Không tìm thấy dự án');
        }

        const { data, count, error } = await client2.rest
          .from('issues')
          .select(
            ` *,
              project:project_id(
                id,
                name
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
          .contains('assignees', `["${currentEmployeeId.value}"]`)
          .eq('project_id', params.projectId)
          .range(from, to);

        if (error) {
          throw error;
        }

        const items = data.map(it => {
          return {
            id: it.id,
            title: it.title,
            code: it.code,
            status: it.status,
            startDate: it.start_date,
            endDate: it.end_date,
            deadlineStatus: it.deadline_status,
            processStatus: it.process_status,
            object: it.object,
            project: it.project as ProjectItem,
            approvers: it.approvers,
            assignees: (it.assignees as EmployeeItem[]) || [],
            lastAssignees: (it.last_assignees as EmployeeItem[]) || [],
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
    ) => {
      try {
        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        if (!currentEmployeeId.value) {
          throw new Error('Không tìm thấy người dùng');
        }

        if (!params?.projectId) {
          throw new Error('Không tìm thấy dự án');
        }

        if (!params?.objectTypeId) {
          throw new Error('Không tìm thấy loại đối tượng');
        }

        const { data, count, error } = await client2.rest
          .from('issues')
          .select(
            ` *,
              project:project_id(
                id,
                name
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
          .eq('project_id', params.projectId)
          .eq('object.type.id', params.objectTypeId)
          .range(from, to);

        if (error) {
          throw error;
        }

        const items = data.map(it => {
          return {
            id: it.id,
            title: it.title,
            code: it.code,
            status: it.status,
            startDate: it.start_date,
            endDate: it.end_date,
            deadlineStatus: it.deadline_status,
            processStatus: it.process_status,
            object: it.object,
            project: it.project as ProjectItem,
            approvers: it.approvers,
            assignees: (it.assignees as EmployeeItem[]) || [],
            lastAssignees: (it.last_assignees as EmployeeItem[]) || [],
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
          `Không thể lấy danh sách công việc theo loại đối tượng: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (id: string) => {
      try {
        const { data, error } = await client2.rest
          .from('issues')
          .select(
            ` *,
            project:project_id(
              id,
              name
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
            ),
            createdBy:organization_members!created_by(*),
            updatedBy:organization_members!updated_by(*)
          `
          )
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(`Không tìm thấy công việc với id: ${id}`);
        }

        return {
          id: data.id,
          title: data.title,
          code: data.code,
          status: data.status,
          startDate: data.start_date,
          endDate: data.end_date,
          deadlineStatus: data.deadline_status,
          processStatus: data.process_status,
          object: data.object as ObjectItem,
          project: data.project as ProjectItem,
          approvers: data.approvers,
          assignees: (data.assignees as EmployeeItem[]) || [],
          lastAssignees: (data.last_assignees as EmployeeItem[]) || [],
          assigned: data.assigned,
          files: data.files as IssueFileItem[],
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        } as IssueItem;
      } catch (error) {
        throw new Error(
          `Không thể lấy chi tiết công việc: ${(error as Error).message}`
        );
      }
    }
  }),
  delete: router.mutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await client2.rest
          .from('issues')
          .update({ is_deleted: true })
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error) {
        throw new Error(`Không thể xóa công việc: ${(error as Error).message}`);
      }
    }
  }),
  forward: router.mutation({
    mutationFn: async (params: {
      id: string;
      assignees: string[];
      status: string;
      note?: string;
    }) => {
      return;
    }
  }),
  return: router.mutation({
    mutationFn: async (params: {
      id: string;
      status: string;
      note?: string;
    }) => {
      return;
    }
  }),
  finish: router.mutation({
    mutationFn: async (params: {
      id: string;
      status: string;
      note?: string;
    }) => {
      return;
    }
  }),
  reset: router.mutation({
    mutationFn: async (params: { id: string }) => {
      return;
    }
  }),
  approve: router.mutation({
    mutationFn: async (params: {
      id: string;
      nodeName: string;
      nodeId: string;
      userName: string;
      userId: string;
    }) => {
      return;
    }
  }),
  reject: router.mutation({
    mutationFn: async (params: { id: string; nodeId: string }) => {
      return;
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
        if (!currentUserId.value) {
          return 0;
        }

        if (isAll) {
          const { data, error } = await client2.rest
            .from('issue_user_info')
            .select('count')
            .eq('user_id', currentUserId.value);

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
            .eq('user_id', currentUserId.value);

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
