import { FC, Suspense } from 'react';

import { Match, Switch, cn } from '@storeo/core';
import { Button } from '@storeo/theme';

import { requestApi } from '../../../api';

export type RequestStatusProps = {
  issueId: string;
  className?: string;
};

const Component: FC<RequestStatusProps> = ({ issueId, className }) => {
  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const style = `text-appWhite flex w-fit h-fit items-center
  justify-center whitespace-nowrap rounded-full px-2 py-1 text-xs shadow`;

  return (
    <Switch
      fallback={
        <span className={cn(style, 'bg-appGrayDark text-appBlack', className)}>
          Không xác định
        </span>
      }
    >
      <Match when={request.data.status?.charAt(0) === 'A'}>
        <Button
          variant={'outline'}
          className={cn(style, 'bg-appError', className)}
        >
          {request.data.status}
        </Button>
      </Match>
    </Switch>
  );
};

export const RequestStatus: FC<RequestStatusProps> = props => {
  return (
    <Suspense fallback={<span className={'text-xs'}>Loading...</span>}>
      <Component {...props}></Component>
    </Suspense>
  );
};
