import { useQueryClient } from '@tanstack/react-query';
import { api } from 'portal-api';

import type { FC } from 'react';
import { useCallback } from 'react';

export type IssueActionProps = {
  issueId: string;
};

export const IssueAction: FC<IssueActionProps> = ({ issueId }) => {
  const queryClient = useQueryClient();

  const handleSuccess = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: api.request.byIssueId.getKey(issueId)
      }),
      queryClient.invalidateQueries({
        queryKey: api.comment.list.getKey(issueId)
      })
    ]);
  }, [issueId, queryClient]);

  return <div className={'flex items-center gap-2'}></div>;
};
