import { ArrowRight } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';

import { ProcessData, extractStatus, getNode } from '../flow';

export type IssueStatusTextProps = {
  issueId: string;
};

export const IssueStatusText: FC<IssueStatusTextProps> = props => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: props.issueId
  });

  const process = api.process.byType.useSuspenseQuery({
    variables: issue.data.expand?.type.id
  });

  const extracted = extractStatus(issue.data.status);
  const from = getNode(process.data.process as ProcessData, extracted?.from);
  const to = getNode(process.data.process as ProcessData, extracted?.to);

  return (
    <div className={'flex items-center gap-1'}>
      <div className={'text-appBlue text-xs font-bold'}>{from?.name}</div>
      <ArrowRight className={'text-appError h-3 w-3'} />
      <div className={'text-appBlue text-xs font-bold'}>{to?.name}</div>
    </div>
  );
};
