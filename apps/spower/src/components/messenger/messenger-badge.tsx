import _ from 'lodash';
import { Loader } from 'lucide-react';
import { api, subscribeChats, subscribeSettings } from 'portal-api';
import { cn, getUser } from 'portal-core';

import { FC, Suspense, useCallback, useEffect } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { Badge } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../hooks';

export type MessageBadgeProps = {
  className?: string;
};

const BadgeComponent: FC<MessageBadgeProps> = ({ className }) => {
  const user = getUser();
  const invalidates = useInvalidateQueries();

  const unreadCount = api.chat.getUnreadCount.useSuspenseQuery({
    variables: {
      userId: user?.id
    }
  });

  const debouncedInvalidate = useCallback(
    _.debounce((userId: string) => {
      invalidates([api.chat.getUnreadCount.getKey({ userId })]);
    }, 200),
    [invalidates]
  );

  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe: () => void;

    subscribeChats(user.id, () => {
      debouncedInvalidate(user.id);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      debouncedInvalidate.cancel();
    };
  }, [user?.id, debouncedInvalidate]);

  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe: () => void;

    subscribeSettings(user.id, () => {
      debouncedInvalidate(user.id);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      debouncedInvalidate.cancel();
    };
  }, [user?.id, debouncedInvalidate]);

  return (
    <Show fallback="" when={unreadCount.data && unreadCount.data > 0}>
      <Badge
        className={cn('bg-appErrorLight pointer-events-none mr-1', className)}
      >
        {unreadCount.data}
      </Badge>
    </Show>
  );
};

export const MessengerBadge: FC<MessageBadgeProps> = props => {
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
