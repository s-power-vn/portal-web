import { FC } from 'react';

import { Match, RequestStatusOptions, Switch } from '@storeo/core';

import { requestApi } from '../../../api';
import { A1fButton } from './status/a1f-button';
import { A1rButton } from './status/a1r-button';

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
          <A1rButton></A1rButton>
        </Match>
      </Switch>
    </div>
  );
};
