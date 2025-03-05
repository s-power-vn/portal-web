import { useInfiniteQuery } from '@tanstack/react-query';
import {
  Loader,
  MoreHorizontal,
  PlusCircle,
  Send,
  UserIcon
} from 'lucide-react';
import { MsgChat, api, subscribeChats, subscribeMessages } from 'portal-api';
import {
  Collections,
  MsgChatTypeOptions,
  MsgMessageTypeOptions,
  getImageUrl,
  getUser
} from 'portal-core';

import {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { cn } from '@minhdtb/storeo-core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
  showModal
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../hooks';
import { NewChatForm } from './form/new-chat-form';
import { MessengerBadge } from './messenger-badge';

const Skeleton: FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('animate-pulse rounded bg-gray-200', className)} />;
};

type MessageProps = {
  message: any;
  isCurrentUser: boolean;
};

const Message: FC<MessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-lg px-4 py-2',
          isCurrentUser
            ? 'bg-appBlue text-white'
            : 'border border-gray-200 bg-gray-100 text-gray-800'
        )}
      >
        <div>{message.content}</div>
        <div className="mt-1 text-xs opacity-70">
          {new Date(message.created).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export type ChatHeaderProps = {
  chat: MsgChat;
  getOtherParticipant: (chat: MsgChat) => any;
};

const ChatHeader: FC<ChatHeaderProps> = ({ chat, getOtherParticipant }) => {
  const otherParticipant = getOtherParticipant(chat);
  return (
    <div className="flex items-center justify-between border-b bg-white p-3">
      <div className="flex items-center gap-2">
        <Avatar className={'h-8 w-8'}>
          <AvatarImage
            src={getImageUrl(
              Collections.User,
              otherParticipant.id,
              otherParticipant.avatar
            )}
          />
          <AvatarFallback className={'text-sm'}>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{otherParticipant?.name}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
};

export type ChatListProps = {
  userId: string;
  selectedChat: MsgChat | undefined;
  setSelectedChat: (chat: MsgChat) => void;
  onNewChat: () => void;
  getOtherParticipant: (chat: any) => any;
};

export const ChatList: FC<ChatListProps> = ({
  userId,
  selectedChat,
  setSelectedChat,
  onNewChat,
  getOtherParticipant
}) => {
  const perPage = 20;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const invalidates = useInvalidateQueries();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: api.chat.listPrivateChats.getKey({ userId }),
    queryFn: ({ pageParam = 1 }) =>
      api.chat.listPrivateChats.fetcher({
        userId,
        page: pageParam,
        perPage
      }),
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1
  });

  const allChats = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data]
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceToBottom < 50 && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetching]
  );

  useEffect(() => {
    if (!userId) return;

    let unsubscribe: () => void;

    subscribeChats(userId, () => {
      invalidates([api.chat.listPrivateChats.getKey({ userId })]);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, invalidates]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto py-2"
      onScroll={handleScroll}
    >
      {allChats.map((chat: MsgChat) => {
        const otherParticipant = getOtherParticipant(chat);
        if (!otherParticipant) return null;

        return (
          <div
            key={chat.id}
            className={cn(
              'm-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-100',
              selectedChat?.id === chat.id && 'bg-gray-100'
            )}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="relative flex items-center gap-2">
              <MessengerBadge className="absolute right-0 top-1/2 z-50 -translate-y-1/2" />
              <Avatar className={'h-8 w-8'}>
                <AvatarImage
                  src={getImageUrl(
                    Collections.User,
                    otherParticipant.id,
                    otherParticipant.avatar
                  )}
                />
                <AvatarFallback className={'text-sm'}>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div className="flex w-full flex-col overflow-hidden">
                <div className="flex min-w-0">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                    {otherParticipant.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {chat.expand?.lastMessage?.content}
                  </span>
                  <span className="text-xs">
                    {chat.expand?.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(
                          chat.expand.lastMessage.created
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {isFetching && (
        <div className="flex items-center justify-center py-2">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      )}
      {allChats.length === 0 && !isFetching && (
        <div className="flex h-40 items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500">Chưa có cuộc trò chuyện nào</p>
            <Button className="mt-2" size="sm" onClick={onNewChat}>
              <PlusCircle className="mr-1 h-4 w-4" />
              Tạo cuộc trò chuyện mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export type MessageListProps = {
  chat?: MsgChat;
};

export const MessageList: FC<MessageListProps> = ({ chat }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const prevHeightRef = useRef<number>(0);
  const currentUser = getUser();
  const invalidates = useInvalidateQueries();
  const perPage = 20;

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
    if (!container || !scrollPositionRef.current) return;

    if (
      prevHeightRef.current &&
      container.scrollHeight > prevHeightRef.current
    ) {
      const newPosition = container.scrollHeight - scrollPositionRef.current;
      container.scrollTop = newPosition;

      if (!isFetchingNextPage) {
        scrollPositionRef.current = 0;
        prevHeightRef.current = 0;
      }
    }
  }, [allMessages, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if ((isAtBottom || !scrollPositionRef.current) && !isFetchingNextPage) {
      setTimeout(() => {
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 0);
    }
  }, [allMessages, isFetchingNextPage]);

  useEffect(() => {
    if (!chat) return;

    let unsubscribe: () => void;

    subscribeMessages(chat.id, () => {
      invalidates([api.chat.listMessages.getKey({ chatId: chat.id })]);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chat, invalidates]);

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
            <Message
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

export const PrivateChat: FC = () => {
  const currentUser = getUser();
  const currentUserId = currentUser?.id || '';

  const [selectedChat, setSelectedChat] = useState<MsgChat | undefined>();
  const [newMessage, setNewMessage] = useState('');
  const lastKeypressTime = useRef<number>(0);

  const createChat = api.chat.createChat.useMutation();
  const markChatAsRead = api.chat.markChatAsRead.useMutation();
  const sendMessage = api.chat.sendMessage.useMutation();

  const handleSelectChat = useCallback(
    (chat: MsgChat) => {
      setSelectedChat(chat);
      markChatAsRead.mutate(chat.id);
    },
    [markChatAsRead]
  );

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedChat) return;

    sendMessage.mutate(
      {
        chatId: selectedChat.id,
        content: newMessage,
        type: MsgMessageTypeOptions.Text
      },
      {
        onSuccess: () => {
          setNewMessage('');
        }
      }
    );
  }, [newMessage, selectedChat, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (now - lastKeypressTime.current < 100) {
          return;
        }
        lastKeypressTime.current = now;

        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleNewChat = useCallback(() => {
    showModal({
      title: 'Tạo cuộc trò chuyện mới',
      children: ({ close }) => (
        <NewChatForm
          onSuccess={async values => {
            const result = await createChat.mutateAsync({
              type: MsgChatTypeOptions.Private,
              participants: values?.users ?? []
            });

            handleSelectChat(result);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [createChat, handleSelectChat]);

  const getOtherParticipant = useCallback(
    (chat: MsgChat) => {
      if (!chat.expand?.participants) return null;

      return chat.expand.participants.find((p: any) => p.id !== currentUserId);
    },
    [currentUserId]
  );

  useEffect(() => {
    if (!selectedChat) return;

    let unsubscribe: () => void;

    subscribeMessages(selectedChat.id, () => {
      markChatAsRead.mutate(selectedChat.id);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChat, markChatAsRead]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex h-full w-1/4 flex-col overflow-hidden border-r">
        <div className="flex flex-none items-center justify-between border-b p-3">
          <h2 className="text-sm font-semibold">Tin nhắn</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNewChat}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <div className="space-y-3 p-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            }
          >
            <ChatList
              userId={currentUserId}
              selectedChat={selectedChat}
              setSelectedChat={handleSelectChat}
              onNewChat={handleNewChat}
              getOtherParticipant={getOtherParticipant}
            />
          </Suspense>
        </div>
      </div>
      <div className="flex h-full w-3/4 flex-col overflow-hidden">
        {selectedChat ? (
          <>
            <div className="flex-none">
              <ChatHeader
                chat={selectedChat}
                getOtherParticipant={getOtherParticipant}
              />
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 pl-4 pr-0">
              <Suspense
                fallback={
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                }
              >
                <MessageList chat={selectedChat} />
              </Suspense>
            </div>
            <div className="flex-none border-t bg-white p-3">
              <div className="flex items-center gap-2">
                <Textarea
                  className="flex-1 border-none shadow-none"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  size="icon"
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
};
