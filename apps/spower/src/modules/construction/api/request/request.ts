import { ListParams } from 'portal-api';

import { router } from 'react-query-kit';

import {
  CreateRequestInput,
  RequestItem,
  RequestListResponse,
  UpdateRequestInput
} from './request.type';

export const requestApi = router('request', {
  listFinished: router.query({
    fetcher: async (params: ListParams): Promise<RequestListResponse> => {
      return {
        items: [],
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0
      };
    }
  }),
  byId: router.query({
    fetcher: async (id: string): Promise<RequestItem | undefined> => {
      return;
    }
  }),
  byIssueId: router.query({
    fetcher: async (issueId: string): Promise<RequestItem | undefined> => {
      return;
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateRequestInput): Promise<void> => {
      return;
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdateRequestInput): Promise<void> => {
      return;
    }
  })
});
