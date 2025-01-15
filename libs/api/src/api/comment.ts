import type { CommentResponse, IssueResponse, UserResponse } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

export type CommentData = CommentResponse & {
  expand: {
    issue: IssueResponse;
    createdBy: UserResponse;
  };
};

export const commentApi = router('comment', {
  list: router.query({
    fetcher: (issueId: string) =>
      client.collection<CommentData>(Collections.Comment).getFullList({
        filter: `issue = "${issueId}"`,
        expand: 'issue,createdBy',
        sort: '-created'
      })
  }),
  create: router.mutation({
    mutationFn: async ({
      comment,
      issueId
    }: {
      comment: string;
      issueId: string;
    }) => {
      return client.collection(Collections.Comment).create({
        content: comment,
        issue: issueId,
        createdBy: client.authStore.model?.id
      });
    }
  }),
  delete: router.mutation({
    mutationFn: (id: string) => {
      return client.collection(Collections.Comment).delete(id);
    }
  })
});
