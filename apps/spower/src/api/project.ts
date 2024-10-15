import { router } from 'react-query-kit';

import {
  Collections,
  ColumnResponse,
  CustomerResponse,
  ProjectResponse,
  UserResponse,
  client
} from '@storeo/core';

import { Search } from './types';

export type ProjectData = ProjectResponse & {
  expand: {
    customer: CustomerResponse;
    createdBy: UserResponse;
  };
};

export const projectApi = router('project', {
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ProjectData>(Collections.Project).getOne(id, {
        expand: 'customer,createdBy'
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
    mutationFn: (params: ProjectResponse) =>
      client.collection(Collections.Project).create({
        ...params,
        createdBy: client.authStore.model?.id
      })
  }),
  update: router.mutation({
    mutationFn: (params: ProjectResponse) =>
      client.collection(Collections.Project).update(params.id, params)
  }),
  addColumn: router.mutation({
    mutationFn: (params: Partial<ColumnResponse>) =>
      client.collection(Collections.Column).create({
        ...params
      })
  })
});
