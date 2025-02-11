import { ArrowRight } from 'lucide-react';

import type { FC } from 'react';

import { extractStatus, getNode } from '../../flow';

export type IssueStatusTextProps = {
  type: 'request' | 'price';
  status: string;
};

export const IssueStatusText: FC<IssueStatusTextProps> = props => {
  const extracted = extractStatus(props.status);
  const from = getNode(props.type, extracted?.from);
  const to = getNode(props.type, extracted?.to);

  return (
    <div className={'flex items-center gap-1'}>
      <div className={'text-appBlue text-xs font-bold'}>{from?.name}</div>
      <ArrowRight className={'text-appError h-3 w-3'} />
      <div className={'text-appBlue text-xs font-bold'}>{to?.name}</div>
    </div>
  );
};
