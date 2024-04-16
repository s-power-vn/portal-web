import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import {
  CustomerResponse,
  ProjectResponse,
  UserResponse,
  client
} from '@storeo/core';

export type ProjectData = ProjectResponse & {
  expand: {
    customer: CustomerResponse;
    assignee: UserResponse;
    createdBy: UserResponse;
  };
};

export const ProjectSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

export type ProjectSearch = InferType<typeof ProjectSearchSchema>;

export function getWaitingProjectsKey(search?: ProjectSearch) {
  return ['getWaitingProjectsKey', search];
}

export function getWaitingProjects(search?: ProjectSearch) {
  return queryOptions({
    queryKey: getWaitingProjectsKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search?.filter ?? ''}" || bidding ~ "${search?.filter ?? ''}")`;
      return client
        ?.collection<ProjectData>('project')
        .getList(search?.pageIndex, search?.pageSize, {
          filter: filter,
          sort: '-created',
          expand: 'customer,assignee,createdBy'
        });
    }
  });
}

export function useGetWaitingProjects(search?: ProjectSearch) {
  return useQuery(getWaitingProjects(search));
}

export function getMineProjectsKey(search?: ProjectSearch) {
  return ['getMineProjectsKey', search];
}

export function getMineProjects(search?: ProjectSearch) {
  return queryOptions({
    queryKey: getMineProjectsKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search?.filter ?? ''}" || bidding ~ "${search?.filter ?? ''}")`;
      return client
        .collection<ProjectData>('project')
        .getList(search?.pageIndex, search?.pageSize, {
          filter: filter + `&& (createdBy = "${client.authStore.model?.id}")`,
          sort: '-created',
          expand: 'customer,assignee,createdBy'
        });
    }
  });
}

export function useGetMineProjects(search?: ProjectSearch) {
  return useQuery(getMineProjects(search));
}

export function getAllProjectsKey(search?: ProjectSearch) {
  return ['getAllProjectsKey', search];
}

export function getAllProjects(search?: ProjectSearch) {
  return queryOptions({
    queryKey: getAllProjectsKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search?.filter ?? ''}" || bidding ~ "${search?.filter ?? ''}")`;
      return client
        .collection<ProjectData>('project')
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created',
          expand: 'customer,assignee,createdBy'
        });
    }
  });
}

export function useGetAllProjects(search?: ProjectSearch) {
  return useQuery(getAllProjects(search));
}

export function getProjectByIdKey(projectId: string) {
  return ['getProjectByIdKey', projectId];
}

export function getProjectById(projectId: string) {
  return queryOptions({
    queryKey: getProjectByIdKey(projectId),
    queryFn: () => {
      return client.collection<ProjectData>('project').getOne(projectId, {
        expand: 'customer,assignee,createdBy'
      });
    }
  });
}

export function useGetProjectById(projectId: string) {
  return useQuery(getProjectById(projectId));
}

export const CreateProjectSchema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

export type CreateProjectInput = InferType<typeof CreateProjectSchema>;

export function useCreateProject(onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['createProject'],
    mutationFn: (params: CreateProjectInput) =>
      client.collection('project').create<ProjectResponse>({
        ...params,
        createdBy: client.authStore.model?.id
      }),
    onSuccess
  });
}

export const UpdateProjectSchema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

export type UpdateProjectInput = InferType<typeof UpdateProjectSchema>;

export function useUpdateProject(projectId: string, onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['updateProject', projectId],
    mutationFn: (params: UpdateProjectInput) =>
      client.collection('project').update(projectId, params),
    onSuccess
  });
}
