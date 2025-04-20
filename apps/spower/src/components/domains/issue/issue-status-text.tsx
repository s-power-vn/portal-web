import { ArrowRight, Loader } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import { Suspense } from 'react';

import { ProcessData, extractStatus, getNode } from '../flow';

export type IssueStatusTextProps = {
  issueId: string;
  status: string;
};

const StatusTextComponent: FC<IssueStatusTextProps> = props => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: props.issueId
  });

  const issueObject = issue.data.object;

  const process = issueObject?.process;

  const extracted = extractStatus(props.status);
  const from = getNode(process?.process as ProcessData, extracted?.from);
  const to = getNode(process?.process as ProcessData, extracted?.to);

  return (
    <div className={'flex items-center gap-1'}>
      <div className={'text-appBlue text-xs font-bold'}>{from?.name}</div>
      <ArrowRight className={'text-appError h-3 w-3'} />
      <div className={'text-appBlue text-xs font-bold'}>{to?.name}</div>
    </div>
  );
};

export const IssueStatusText: FC<IssueStatusTextProps> = props => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-1">
          <Loader className={'h-3 w-3 animate-spin'} />
        </div>
      }
    >
      <StatusTextComponent {...props} />
    </Suspense>
  );
};
