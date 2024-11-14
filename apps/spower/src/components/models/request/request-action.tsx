import { useQueryClient } from '@tanstack/react-query';

import { FC, useCallback } from 'react';

import {
  Match,
  RequestStatusOptions,
  Show,
  Switch,
  client
} from '@storeo/core';

import { commentApi, requestApi } from '../../../api';
import { A1fButton } from './status/a-state/a1f-button';
import { A1rButton } from './status/a-state/a1r-button';
import { A2fButton } from './status/a-state/a2f-button';
import { A2rButton } from './status/a-state/a2r-button';
import { A3fButton } from './status/a-state/a3f-button';
import { A3rButton } from './status/a-state/a3r-button';
import { A4fButton } from './status/a-state/a4f-button';
import { A4rButton } from './status/a-state/a4r-button';
import { A5fButton } from './status/a-state/a5f-button';
import { A5rButton } from './status/a-state/a5r-button';
import { A6fButton } from './status/a-state/a6f-button';
import { A6rButton } from './status/a-state/a6r-button';
import { A7fButton } from './status/a-state/a7f-button';
import { A7rButton } from './status/a-state/a7r-button';
import { A8Button } from './status/a-state/a8-button';
import { A8rButton } from './status/a-state/a8r-button';

export type RequestActionProps = {
  issueId: string;
};

export const RequestAction: FC<RequestActionProps> = ({ issueId }) => {
  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const queryClient = useQueryClient();

  const handleSuccess = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: requestApi.byIssueId.getKey(issueId)
      }),
      queryClient.invalidateQueries({
        queryKey: commentApi.list.getKey(issueId)
      })
    ]);
  }, [issueId, queryClient]);

  return (
    <Show
      when={request.data.expand.issue.assignee === client.authStore.model?.id}
    >
      <div className={'flex items-center gap-2'}>
        <Switch>
          <Match when={request.data.status === RequestStatusOptions.A1}>
            <A1fButton request={request.data}></A1fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A1F}>
            <A1rButton request={request.data}></A1rButton>
            <A2fButton request={request.data}></A2fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A1R}>
            <A1fButton request={request.data}></A1fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A2F}>
            <A2rButton request={request.data}></A2rButton>
            <A3fButton request={request.data}></A3fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A2R}>
            <A1rButton request={request.data}></A1rButton>
            <A2fButton request={request.data}></A2fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A3F}>
            <A3rButton request={request.data}></A3rButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A3R}>
            <A2rButton request={request.data}></A2rButton>
            <A3fButton request={request.data}></A3fButton>
            <A4fButton request={request.data}></A4fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A4F}>
            <A4rButton request={request.data}></A4rButton>
            <A5fButton request={request.data}></A5fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A4R}>
            <A2rButton request={request.data}></A2rButton>
            <A3fButton request={request.data}></A3fButton>
            <A4fButton request={request.data}></A4fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A5F}>
            <A5rButton request={request.data}></A5rButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A5R}>
            <A4rButton request={request.data}></A4rButton>
            <A5fButton request={request.data}></A5fButton>
            <A6fButton request={request.data}></A6fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A6F}>
            <A6rButton request={request.data}></A6rButton>
            <A7fButton request={request.data}></A7fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A6R}>
            <A4rButton request={request.data}></A4rButton>
            <A5fButton request={request.data}></A5fButton>
            <A6fButton request={request.data}></A6fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A7F}>
            <A7rButton request={request.data}></A7rButton>
            <A8Button
              request={request.data}
              onSuccess={handleSuccess}
            ></A8Button>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A7R}>
            <A6rButton request={request.data}></A6rButton>
            <A7fButton request={request.data}></A7fButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A8}>
            <A8rButton
              request={request.data}
              onSuccess={handleSuccess}
            ></A8rButton>
          </Match>
          <Match when={request.data.status === RequestStatusOptions.A8R}>
            <A7rButton request={request.data}></A7rButton>
            <A8Button
              request={request.data}
              onSuccess={handleSuccess}
            ></A8Button>
          </Match>
        </Switch>
      </div>
    </Show>
  );
};
