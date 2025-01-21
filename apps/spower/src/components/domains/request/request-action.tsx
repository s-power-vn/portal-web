import { useQueryClient } from '@tanstack/react-query';
import { api } from 'portal-api';
import { client } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Show } from '@minhdtb/storeo-core';

export type RequestActionProps = {
  issueId: string;
};

export const RequestAction: FC<RequestActionProps> = ({ issueId }) => {
  const request = api.request.byIssueId.useSuspenseQuery({
    variables: issueId
  });

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

  return (
    <Show
      when={request.data?.expand.issue.assignee === client.authStore.model?.id}
    >
      <div className={'flex items-center gap-2'}></div>
    </Show>
  );
};
