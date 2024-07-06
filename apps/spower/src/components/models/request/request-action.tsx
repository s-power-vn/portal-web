import { FC } from 'react';

import { Match, RequestStatusOptions, Switch } from '@storeo/core';

import { requestApi } from '../../../api';
import { A1fButton } from './status/a-state/a1f-button';
import { A1rButton } from './status/a-state/a1r-button';
import { A2fButton } from './status/a-state/a2f-button';
import { A2rButton } from './status/a-state/a2r-button';

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
        <Match
          when={
            request.data.status === RequestStatusOptions.A1 ||
            request.data.status === RequestStatusOptions.A1R
          }
        >
          <A1fButton request={request.data}></A1fButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A1F}>
          <A1rButton request={request.data}></A1rButton>
          <A2fButton request={request.data}></A2fButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A2F}>
          <A2rButton request={request.data}></A2rButton>
        </Match>
        <Match when={request.data.status === RequestStatusOptions.A2R}>
          <></>
        </Match>
      </Switch>
    </div>
  );
};
