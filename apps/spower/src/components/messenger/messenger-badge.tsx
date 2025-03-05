import { Loader } from 'lucide-react';
import { api, subscribeChats, subscribeSettings } from 'portal-api';
import { cn, getUser } from 'portal-core';

import { FC, Suspense, useEffect } from 'react';

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

  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe: () => void;

    subscribeChats(user.id, () => {
      invalidates([api.chat.getUnreadCount.getKey({ userId: user.id })]);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id, invalidates]);

  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe: () => void;

    subscribeSettings(user.id, () => {
      console.log('subscribeSettings');
      invalidates([api.chat.getUnreadCount.getKey({ userId: user.id })]);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id, invalidates]);

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
        <span className="mr-1">
          <Loader className={'h-3 w-3 animate-spin'} />
        </span>
      }
    >
      <BadgeComponent {...props} />
    </Suspense>
  );
};
