import { signal } from '@preact/signals-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader, PlusCircle, Send, User as UserIcon } from 'lucide-react';
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

const Skeleton: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('animate-pulse rounded-md bg-gray-200', className)} />
  );
};

export type ChatHeaderProps = {
  chat: MsgChat;
  getOtherParticipant: (chat: MsgChat) => any;
};

const ChatHeader: FC<ChatHeaderProps> = ({ chat, getOtherParticipant }) => {
  const otherParticipant = getOtherParticipant(chat);

  return (
    <div className="flex items-center border-b p-3">
      <Avatar className="mr-2 h-8 w-8">
        <AvatarImage
          src={getImageUrl(
            Collections.User,
            otherParticipant.id,
            otherParticipant.avatar
          )}
        />
        <AvatarFallback>
          <UserIcon className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-sm font-medium">{otherParticipant.name}</h3>
      </div>
    </div>
  );
};

export type ChatListItemProps = {
  chatId: string;
  isSelected: boolean;
  onClick: () => void;
  getOtherParticipant: (chat?: MsgChat) => any;
};

const ChatListItem: FC<ChatListItemProps> = ({
  chatId,
  isSelected,
  onClick,
  getOtherParticipant
}) => {
  const user = getUser();

  const { data: chat } = api.chat.getChat.useSuspenseQuery({
    variables: chatId
  });

  const unreadCount = api.chat.getUnreadCount.useSuspenseQuery({
    variables: {
      userId: user?.id
    }
  });

  const hasNewMessage = useMemo(() => {
    return unreadCount.data && unreadCount.data > 0;
  }, [unreadCount]);

  const otherParticipant = getOtherParticipant(chat);

  return (
    <div
      className={cn(
        'm-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-100',
        isSelected && 'bg-gray-100'
      )}
      onClick={onClick}
    >
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
        <div className="flex w-full flex-col overflow-hidden">
          <div className="flex min-w-0">
            <span
              className={cn(
                'overflow-hidden text-ellipsis whitespace-nowrap text-sm',
                hasNewMessage && 'font-bold'
              )}
            >
              {otherParticipant.name}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span
              className={cn(
                'flex-1 overflow-hidden truncate text-xs italic',
                hasNewMessage && 'font-bold'
              )}
            >
              {chat?.expand?.lastMessage?.content}
            </span>
            <span className="text-xs">
              {chat?.expand?.lastMessage && (
                <span className="text-xs text-gray-500">
                  {new Date(chat.expand.lastMessage.created).toLocaleTimeString(
                    [],
                    {
                      hour: '2-digit',
                      minute: '2-digit'
                    }
                  )}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
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
  const { data: chatsData } = api.chat.listPrivateChats.useSuspenseQuery({
    variables: {
      userId
    }
  });

  const allChats = useMemo(() => {
    const chats = chatsData?.items || [];
    return [...chats].sort((a, b) => {
      const aTime = a.expand?.lastMessage?.created
        ? new Date(a.expand.lastMessage.created).getTime()
        : new Date(a.updated).getTime();

      const bTime = b.expand?.lastMessage?.created
        ? new Date(b.expand.lastMessage.created).getTime()
        : new Date(b.updated).getTime();

      return bTime - aTime;
    });
  }, [chatsData]);

  return (
    <div className="h-full overflow-y-auto">
      {allChats.map(chat => (
        <ChatListItem
          key={chat.id}
          chatId={chat.id}
          isSelected={selectedChat?.id === chat.id}
          onClick={() => setSelectedChat(chat)}
          getOtherParticipant={getOtherParticipant}
        />
      ))}

      {allChats.length === 0 && (
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

const scrollToBottomSignal = signal<number>(0);

export const triggerScrollToBottom = () => {
  scrollToBottomSignal.value++;
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
  const invalidates = useInvalidateQueries();

  const [selectedChat, setSelectedChat] = useState<MsgChat>();
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
          triggerScrollToBottom();
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

  useEffect(() => {
    if (!currentUserId) return;

    let unsubscribe: () => void;

    subscribeChats(currentUserId, () => {
      invalidates([
        api.chat.listPrivateChats.getKey({ userId: currentUserId })
      ]);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUserId, invalidates]);

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
