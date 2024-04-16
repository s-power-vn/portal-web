import { queryOptions, useQuery } from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import { Collections, IssueResponse, client } from '@storeo/core';

export const IssuesSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
})

export type IssuesSearch = InferType<typeof IssuesSearchSchema>;

export function getAllIssuesKey(projectId: string, search?: IssuesSearch) {
  return ['getAllIssuesKey', projectId, search];
}

export function getAllIssues(projectId: string, search?: IssuesSearch) {
  return queryOptions({
    queryKey: getAllIssuesKey(projectId, search),
    queryFn: () =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${projectId}" && title ~ "${search?.filter ?? ''}"`,
          sort: '-created'
        })
  });
}

export function useGetAllIssue(projectId: string, search?: IssuesSearch) {
  return useQuery(getAllIssues(projectId, search));
}

export function getMyIssuesKey(projectId: string, search?: IssuesSearch) {
  return ['getMyIssuesKey', projectId, search];
}

export function getMyIssues(projectId: string, search?: IssuesSearch) {
  return queryOptions({
    queryKey: getMyIssuesKey(projectId, search),
    queryFn: () =>
      client
        .collection<IssueResponse>(Collections.Issue)
        .getList(search?.pageIndex, search?.pageSize, {
          filter: `project = "${projectId}"
        && assignee = "${client.authStore.model?.id}"
        && title ~ "${search?.filter ?? ''}"`
        })
  });
}

export function useGetMyIssues(projectId: string, search?: IssuesSearch) {
  return useQuery(getMyIssues(projectId, search));
}
