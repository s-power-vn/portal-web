import type {
  ColumnResponse,
  CustomerResponse,
  ProjectResponse,
  UserResponse
} from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { Search } from './types';

export type ProjectData = ProjectResponse & {
  expand: {
    customer: CustomerResponse;
    createdBy: UserResponse;
    column_via_project: ColumnResponse[];
  };
};

export const projectApi = router('project', {
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ProjectData>(Collections.Project).getOne(id, {
        expand: 'customer,createdBy,column_via_project'
      })
  }),
  list: router.query({
    fetcher: (search?: Search) =>
      client
        .collection<ProjectData>(Collections.Project)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `(name ~ "${search?.filter ?? ''}" || bidding ~ "${search?.filter ?? ''}")`,
          expand: 'customer,createdBy',
          sort: '-created'
        })
  }),
  create: router.mutation({
    mutationFn: (params: Partial<ProjectResponse>) =>
      client.collection(Collections.Project).create({
        ...params,
        createdBy: client.authStore.model?.id
      })
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Project).delete(id)
  }),
  update: router.mutation({
    mutationFn: (params: Partial<ColumnResponse> & { id: string }) =>
      client.collection(Collections.Project).update(params.id, params)
  }),
  addColumn: router.mutation({
    mutationFn: (params: Partial<ColumnResponse>) =>
      client.collection(Collections.Column).create({
        ...params
      })
  }),
  listColumn: router.query({
    fetcher: (projectId: string) =>
      client.collection<ColumnResponse>(Collections.Column).getFullList({
        filter: `project = "${projectId}"`
      })
  }),
  deleteColumn: router.mutation({
    mutationFn: (id: string) => client.collection(Collections.Column).delete(id)
  })
});
