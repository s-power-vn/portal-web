import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import { FC, Suspense, useEffect } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { Badge } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';

export type IssueBadgeProps = {
  projectId?: string;
  isAll?: boolean;
};

const BadgeComponent: FC<IssueBadgeProps> = ({ projectId, isAll }) => {
  const { data: count } = api.issue.userInfo.useSuspenseQuery({
    variables: {
      projectId,
      isAll: isAll ?? false
    }
  });

  const invalidates = useInvalidateQueries();

  useEffect(() => {
    // let unsubscribe: () => void;
    // client
    //   .collection(Collections.Issue)
    //   .subscribe('*', () => {
    //     invalidates([api.issue.userInfo.getKey()]);
    //   })
    //   .then(unsub => {
    //     unsubscribe = unsub;
    //   });
    // return () => {
    //   if (unsubscribe) {
    //     unsubscribe();
    //   }
    // };
  }, [projectId, invalidates]);

  return (
    <Show fallback="" when={count && count > 0}>
      <Badge className={'bg-appErrorLight pointer-events-none mr-1'}>
        {count}
      </Badge>
    </Show>
  );
};

export const IssueBadge: FC<IssueBadgeProps> = props => {
  return (
    <Suspense
      fallback={
        <span className="text-appBlue rounded-full bg-white">
          <Loader className={'h-3 w-3 animate-spin'} />
        </span>
      }
    >
      <BadgeComponent {...props} />
    </Suspense>
  );
};
