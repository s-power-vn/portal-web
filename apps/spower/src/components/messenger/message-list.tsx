import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { MsgChat, api, subscribeMessages } from 'portal-api';
import { getUser } from 'portal-core';

import { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import { useInvalidateQueries } from '../../hooks';
import { MessageListItem } from './message-list-item';
import { Skeleton } from './skeleton';
import { scrollToBottomSignal } from './utils';

export type MessageListProps = {
  chat?: MsgChat;
};

export const MessageList: FC<MessageListProps> = ({ chat }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const prevHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const currentUser = getUser();
  const invalidates = useInvalidateQueries();
  const perPage = 20;

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    setTimeout(() => {
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottomSignal.value, scrollToBottom]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchMessages
  } = useInfiniteQuery({
    queryKey: api.chat.listMessages.getKey({ chatId: chat?.id || '' }),
    queryFn: ({ pageParam = 1 }) =>
      api.chat.listMessages.fetcher({
        chatId: chat?.id || '',
        page: pageParam,
        perPage
      }),
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!chat?.id
  });

  const allMessages = useMemo(
    () => data?.pages.flatMap(page => page.items).reverse() ?? [],
    [data]
  );

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    if (container.scrollTop < 50) {
      scrollPositionRef.current = container.scrollHeight - container.scrollTop;
      prevHeightRef.current = container.scrollHeight;
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (
      isFetchingNextPage &&
      prevHeightRef.current &&
      scrollPositionRef.current
    ) {
      return;
    }

    if (
      !isFetchingNextPage &&
      prevHeightRef.current &&
      scrollPositionRef.current
    ) {
      if (container.scrollHeight > prevHeightRef.current) {
        const newPosition = container.scrollHeight - scrollPositionRef.current;
        container.scrollTop = newPosition;

        setTimeout(() => {
          if (!isFetchingNextPage) {
            scrollPositionRef.current = 0;
            prevHeightRef.current = 0;
          }
        }, 100);
      }
    }
  }, [allMessages, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (
      isInitialLoadRef.current ||
      (isAtBottom && !isFetchingNextPage && !scrollPositionRef.current)
    ) {
      scrollToBottom();
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }
    }
  }, [allMessages, isFetchingNextPage, scrollToBottom]);

  useEffect(() => {
    if (!chat) return;

    let unsubscribe: () => void;

    subscribeMessages(chat.id, () => {
      invalidates([api.chat.listMessages.getKey({ chatId: chat.id })]);

      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const isAtBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;

        if (isAtBottom) {
          scrollToBottom();
        }
      }, 100);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chat, invalidates, scrollToBottom]);

  useEffect(() => {
    isInitialLoadRef.current = true;
    scrollPositionRef.current = 0;
    prevHeightRef.current = 0;
  }, [chat?.id]);

  if (!chat) return null;

  return (
    <div
      ref={messagesContainerRef}
      className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 h-full overflow-y-auto pr-4"
      onScroll={handleScroll}
    >
      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      )}

      {allMessages.length === 0 ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="ml-auto h-16 w-3/4" />
          <Skeleton className="h-16 w-3/4" />
        </div>
      ) : (
        <>
          {allMessages.map(message => (
            <MessageListItem
              key={message.id}
              message={message}
              isCurrentUser={message.sender === currentUser?.id}
            />
          ))}
        </>
      )}
    </div>
  );
};
