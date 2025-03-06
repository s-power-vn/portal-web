import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { MsgMessage, api, subscribeMessages } from 'portal-api';
import { getUser } from 'portal-core';

import { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import { cn } from '@minhdtb/storeo-core';

import { useInvalidateQueries } from '../../hooks';
import { MessageListItem } from './message-list-item';
import { Skeleton } from './skeleton';
import { scrollToBottomSignal, selectedChatIdSignal } from './utils';

export type MessageListProps = {};

export const MessageList: FC<MessageListProps> = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const prevHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const currentUser = getUser();
  const invalidates = useInvalidateQueries();
  const perPage = 20;

  const markChatAsRead = api.chat.markChatAsRead.useMutation();

  const { data: chat } = api.chat.getChat.useSuspenseQuery({
    variables: selectedChatIdSignal.value
  });

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

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
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
    let unsubscribe: () => void;

    if (!selectedChatIdSignal.value) return;

    subscribeMessages(selectedChatIdSignal.value, value => {
      const currentChatId = value.record.chat;
      if (currentChatId === selectedChatIdSignal.value) {
        markChatAsRead.mutate(selectedChatIdSignal.value);
      }
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChatIdSignal.value]);

  useEffect(() => {
    isInitialLoadRef.current = true;
    scrollPositionRef.current = 0;
    prevHeightRef.current = 0;
  }, [chat?.id]);

  const shouldGroupMessages = (current: MsgMessage, previous?: MsgMessage) => {
    if (!previous) return false;
    if (previous.sender !== current.sender) return false;

    const currentTime = new Date(current.created);
    const previousTime = new Date(previous.created);
    const diffInMinutes =
      (currentTime.getTime() - previousTime.getTime()) / (1000 * 60);

    return diffInMinutes <= 1;
  };

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

      {isFetching && !isFetchingNextPage && allMessages.length === 0 ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="ml-auto h-16 w-3/4" />
          <Skeleton className="h-16 w-3/4" />
        </div>
      ) : allMessages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-center">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {allMessages.map((message, index) => {
            const previousMessage =
              index > 0 ? allMessages[index - 1] : undefined;
            const isGrouped = shouldGroupMessages(message, previousMessage);

            return (
              <div
                key={message.id}
                className={cn(
                  isGrouped ? 'mt-0.5' : 'mt-2',
                  index === 0 && 'mt-0'
                )}
              >
                <MessageListItem
                  message={message}
                  isCurrentUser={message.sender === currentUser?.id}
                  previousMessage={previousMessage}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
