import type { CommentResponse, IssueResponse, UserResponse } from 'portal-core';
import { Collections, client, client2 } from 'portal-core';

import { router } from 'react-query-kit';

import {
  CreateIssueCommentInput,
  IssueCommentListFullResponse,
  IssueCommentListItem
} from './issue-comment.type';

export type CommentData = CommentResponse<{
  issue: IssueResponse;
  createdBy: UserResponse;
}>;

export const issueCommentApi = router('issue-comment', {
  list: router.query({
    fetcher: async (issueId: string): Promise<IssueCommentListFullResponse> => {
      try {
        const { data, error } = await client2.rest
          .from('issues_comments')
          .select(
            ` *,
            createdBy:organizations_members!created_by(*),
            updatedBy:organizations_members!updated_by(*)`
          )
          .eq('issue_id', issueId);

        if (error) {
          throw error;
        }

        return data.map(
          it =>
            ({
              id: it.id,
              content: it.content,
              created: it.created,
              updated: it.updated,
              createdBy: it.createdBy,
              updatedBy: it.updatedBy
            }) as IssueCommentListItem
        );
      } catch (error) {
        throw new Error(
          `Không thể lấy danh sách bình luận công việc: ${(error as Error).message}`
        );
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreateIssueCommentInput) => {
      return client.collection(Collections.Comment).create({
        content: params.content,
        issue: params.issueId,
        createdBy: client.authStore.record?.id
      });
    }
  }),
  delete: router.mutation({
    mutationFn: (id: string) => {
      return client.collection(Collections.Comment).delete(id);
    }
  })
});
