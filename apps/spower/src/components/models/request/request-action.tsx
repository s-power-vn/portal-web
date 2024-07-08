import { FC } from 'react';

import { Match, RequestStatusOptions, Switch } from '@storeo/core';

import { requestApi } from '../../../api';
import { A1fButton } from './status/a-state/a1f-button';
import { A1rButton } from './status/a-state/a1r-button';
import { A2fButton } from './status/a-state/a2f-button';
import { A2rButton } from './status/a-state/a2r-button';
import { A3fButton } from './status/a-state/a3f-button';
import { A3rButton } from './status/a-state/a3r-button';
import { A4Button } from './status/a-state/a4-button';
import { A5fButton } from './status/a-state/a5f-button';
import { A5rButton } from './status/a-state/a5r-button';
import { A6fButton } from './status/a-state/a6f-button';
import { A6rButton } from './status/a-state/a6r-button';

export type RequestActionProps = {
  issueId: string;
};

export const RequestAction: FC<RequestActionProps> = ({ issueId }) => {
  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  return (
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
          <A2fButton request={request.data}></A2fButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A3F}>
          <A3rButton request={request.data}></A3rButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A3R}>
          <A3fButton request={request.data}></A3fButton>
          <A4Button request={request.data}></A4Button>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A4}>
          <A5fButton request={request.data}></A5fButton>
          <A6fButton request={request.data}></A6fButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A5F}>
          <A5rButton request={request.data}></A5rButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A5R}>
          <A5fButton request={request.data}></A5fButton>
          <A6fButton request={request.data}></A6fButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A6F}>
          <A6rButton request={request.data}></A6rButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A6R}>
          <A5fButton request={request.data}></A5fButton>
          <A6fButton request={request.data}></A6fButton>
        </Match>
      </Switch>
    </div>
  );
};
