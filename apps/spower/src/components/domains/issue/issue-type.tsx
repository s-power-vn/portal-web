import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import { FC, Suspense } from 'react';

import { cn } from '@minhdtb/storeo-core';

import { DynamicIcon } from '../../icon/dynamic-icon';

export type IssueTypeProps = {
  issueId: string;
  className?: string;
};

const Component: FC<IssueTypeProps> = ({ issueId, className }) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const objectTypes = api.objectType.listFull.useQuery();

  // Find the matched object type
  const matchedType = objectTypes.data?.find(
    type => type.id === issue.data.expand?.object.type
  );

  const style =
    'rounded-full px-2 py-1 text-xs text-white flex items-center gap-1';

  return (
    <div className={'flex items-center whitespace-nowrap'}>
      {matchedType ? (
        <span
          className={cn(style, className)}
          style={{ backgroundColor: matchedType.color || '#6b7280' }}
        >
          <DynamicIcon
            svgContent={matchedType.icon}
            className="h-3 w-3"
            style={{ color: 'white' }}
          />
          {issue.data.expand?.object.name}
        </span>
      ) : (
        <span className={cn(style, 'bg-gray-500', className)}>
          <DynamicIcon className="h-3 w-3" style={{ color: 'white' }} />
          {issue.data.expand?.object.name || 'Không xác định'}
        </span>
      )}
    </div>
  );
};

export const IssueType: FC<IssueTypeProps> = props => {
  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <Component {...props} />
    </Suspense>
  );
};
