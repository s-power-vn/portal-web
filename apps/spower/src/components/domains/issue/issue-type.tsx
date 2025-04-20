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

  const objectTypeId = issue.data.object?.objectType?.id;

  let objectType = null;
  try {
    const queryId = objectTypeId;
    const { data } = api.objectType.byId.useSuspenseQuery({
      variables: queryId
    });

    if (objectTypeId) {
      objectType = data;
    }
  } catch {
    objectType = null;
  }

  const style =
    'rounded-full px-2 py-1 text-xs text-white flex items-center gap-1';

  return (
    <div className={'flex items-center whitespace-nowrap'}>
      {objectType ? (
        <span
          className={cn(style, className)}
          style={{ backgroundColor: objectType.color || '#6b7280' }}
        >
          <DynamicIcon
            svgContent={objectType.icon}
            className="h-3 w-3"
            style={{ color: 'white' }}
          />
          {issue.data.object?.name}
        </span>
      ) : (
        <span className={cn(style, 'bg-gray-500', className)}>
          <DynamicIcon className="h-3 w-3" style={{ color: 'white' }} />
          {issue.data.object?.name || 'Không xác định'}
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
