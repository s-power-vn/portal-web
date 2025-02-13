import { useQueryClient } from '@tanstack/react-query';
import { api } from 'portal-api';
import { Collections, client } from 'portal-core';

import { FC, useEffect } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { Badge } from '@minhdtb/storeo-theme';

export type IssueBadgeProps = {
  projectId?: string;
  isAll?: boolean;
};

export const IssueBadge: FC<IssueBadgeProps> = ({ projectId, isAll }) => {
  const queryClient = useQueryClient();
  const issueUserInfo = api.issue.userInfo.useSuspenseQuery({
    variables: {
      projectId,
      isAll: isAll ?? false
    }
  });

  useEffect(() => {
    client.collection(Collections.Issue).subscribe('*', () =>
      queryClient.invalidateQueries({
        queryKey: api.issue.userInfo.getKey()
      })
    );

    return () => {
      client.collection(Collections.Issue).unsubscribe();
    };
  }, [projectId]);

  return (
    <Show fallback="" when={issueUserInfo.data && issueUserInfo.data > 0}>
      <Badge className={'bg-appErrorLight pointer-events-none mr-1'}>
        {issueUserInfo.data}
      </Badge>
    </Show>
  );
};
