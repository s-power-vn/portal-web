import { client2 } from 'portal-core';

import { router } from 'react-query-kit';

import { ListParams } from '../../types';
import { RequestListItem, RequestListResponse } from './request.type';

export const requestApi = router('request', {
  listFinished: router.query({
    fetcher: async (
      params?: ListParams & { projectId: string }
    ): Promise<RequestListResponse> => {
      try {
        if (!params?.projectId) {
          throw new Error('Thiếu thông tin dự án');
        }

        const pageIndex = params?.pageIndex ?? 1;
        const pageSize = params?.pageSize ?? 10;
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize;

        const query = client2.rest
          .from('request_finished')
          .select(
            ` *,
              project!project_id(*),
              issue!issue_id(*),
              details:request_details!request_id(*)
            `,
            { count: 'exact' }
          )
          .eq('project_id', params?.projectId)
          .order('created', { ascending: false })
          .range(from, to);

        const filter = params?.filter
          ? `title.ilike.%${params?.filter}%`
          : undefined;

        if (filter) {
          query.or(filter);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (!data) {
          return {
            items: [],
            page: pageIndex,
            perPage: pageSize,
            totalItems: 0,
            totalPages: 0
          };
        }

        const items = data.map(item => {
          return {
            id: item.id,
            project: item.project,
            issue: item.issue,
            details: item.details,
            created: item.created,
            updated: item.updated
          } as RequestListItem;
        });

        return {
          items,
          page: pageIndex,
          perPage: pageSize,
          totalItems: data.length,
          totalPages: Math.ceil(data.length / pageSize)
        };
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách yêu cầu: ${(error as Error).message}`
        );
      }
    }
  }),
  byId: router.query({
    fetcher: async (requestId?: string) => {
      if (!requestId) return null;

      return;
    }
  }),
  byIssueId: router.query({
    fetcher: async (issueId: string) => {
      return;
    }
  }),
  create: router.mutation({
    mutationFn: async (params: {
      title: string;
      project: string;
      object: string;
      code: string;
      startDate?: Date;
      endDate?: Date;
      details: {
        level?: string;
        id?: string;
        index?: string;
        requestVolume?: number;
        title?: string;
        note?: string;
        unit?: string;
      }[];
      attachments?: {
        id?: string;
        name?: string;
        size?: number;
        type?: string;
        file?: File;
        deleted?: boolean;
      }[];
    }) => {
      return;
    }
  }),
  update: router.mutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      project: string;
      code: string;
      startDate?: Date;
      endDate?: Date;
      details: {
        level?: string;
        id?: string;
        index?: string;
        requestVolume?: number;
        title?: string;
        note?: string;
        unit?: string;
      }[];
      deletedIds?: (string | undefined)[];
      attachments?: {
        id?: string;
        name?: string;
        size?: number;
        type?: string;
        file?: File;
        deleted?: boolean;
      }[];
    }) => {
      return;
    }
  })
});
