import { router } from 'react-query-kit';

import {
  Collections,
  CommentResponse,
  IssueResponse,
  UserResponse,
  client
} from '@storeo/core';

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
  })
});
