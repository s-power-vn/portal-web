import type {
  ColumnResponse,
  CustomerResponse,
  ProjectResponse,
  UserResponse
} from 'portal-core';
import { Collections, client, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../types';

export type ProjectData = ProjectResponse<{
  customer: CustomerResponse;
  createdBy: UserResponse;
  column_via_project: ColumnResponse[];
}>;

export const projectApi = router('project', {
  list: router.query({
    fetcher: async (params?: ListParams) => {
      const pageIndex = params?.pageIndex ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const from = (pageIndex - 1) * pageSize;
      const to = from + pageSize;
      const { data, error } = await client2.rest
        .from('projects')
        .select('*')
        .range(from, to)
        .order('created', { ascending: false })
        .or(`name.like.%${params?.filter}%, bidding.like.%${params?.filter}%`);
      console.log(data, error);

      return client
        .collection<ProjectData>(Collections.Project)
        .getList(params?.pageIndex ?? 1, params?.pageSize ?? 10, {
          filter: `(name ~ "${params?.filter ?? ''}" || bidding ~ "${params?.filter ?? ''}")`,
          expand: 'customer, createdBy',
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ProjectData>(Collections.Project).getOne(id, {
        expand: 'customer, createdBy, column_via_project'
      })
  }),
  create: router.mutation({
    mutationFn: (params: Partial<ProjectResponse>) =>
      client.collection(Collections.Project).create({
        ...params,
        createdBy: client.authStore.record?.id
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
