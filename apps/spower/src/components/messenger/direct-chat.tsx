import { useInfiniteQuery } from '@tanstack/react-query';
import {
  subscribeToChat,
  subscribeToChats
} from 'libs/api/src/api/messenger/chat';
import { MoreHorizontal, PlusCircle, Send } from 'lucide-react';
import { api } from 'portal-api';
import {
  MsgChatTypeOptions,
  MsgMessageTypeOptions,
  getUser
} from 'portal-core';

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Avatar, Button, Input, showModal } from '@minhdtb/storeo-theme';

// Skeleton component
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
      {!isCurrentUser && (
        <Avatar
          size="md"
          alt={message.expand?.sender?.name || 'User'}
          src={
            message.expand?.sender?.avatar
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(message.expand.sender.name)}&background=random`
              : undefined
          }
          className="mr-3"
        />
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-lg px-4 py-2',
          isCurrentUser
            ? 'bg-appBlue text-white'
            : 'border border-gray-200 bg-gray-100 text-gray-800'
        )}
      >
        {!isCurrentUser && (
          <div className="mb-1 text-xs font-medium">
            {message.expand?.sender?.name || 'User'}
          </div>
        )}
        <div>{message.content}</div>
        <div className="mt-1 text-xs opacity-70">
          {new Date(message.created).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      {isCurrentUser && (
        <Avatar
          size="md"
          alt="Me"
          src={
            getUser()?.avatar
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(getUser()?.name || 'Me')}&background=random`
              : undefined
          }
          className="ml-3"
        />
      )}
    </div>
  );
};

type NewChatModalProps = {
  onSuccess: (chatId: string) => void;
  onCancel: () => void;
};

type User = {
  id: string;
  name: string;
  avatar?: string;
};

const NewChatModal: FC<NewChatModalProps> = ({ onSuccess, onCancel }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const createChat = api.chat.createChat.useMutation();

  // Use infinite query for loading employees
  const {
    data: employeesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingEmployees,
    isError
  } = useInfiniteQuery({
    queryKey: ['employees', ''],
    queryFn: async ({ pageParam }) => {
      return api.employee.list.fetcher({
        filter: '',
        pageIndex: pageParam as number,
        pageSize: 20
      });
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1
  });

  // Flatten the pages data into a single array of users
  useEffect(() => {
    if (employeesData) {
      const allUsers = employeesData.pages.flatMap(page =>
        page.items.map(employee => ({
          id: employee.id,
          name: employee.name,
          avatar: employee.avatar
        }))
      );
      setUsers(allUsers);
    }
  }, [employeesData]);

  // Load more users when scrolling to the bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleCreateChat = useCallback(async () => {
    if (selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      const result = await createChat.mutateAsync({
        type: MsgChatTypeOptions.Private,
        participants: selectedUsers
      });

      onSuccess(result.id);
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUsers, createChat, onSuccess]);

  return (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-medium">Tạo cuộc trò chuyện mới</h3>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium">Chọn người dùng:</p>
        <div className="max-h-60 overflow-y-auto" onScroll={handleScroll}>
          {isLoadingEmployees && users.length === 0 ? (
            <div className="flex justify-center p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500">
              Không thể tải danh sách người dùng
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Không có người dùng nào
            </div>
          ) : (
            users.map(user => (
              <div
                key={user.id}
                className="mb-2 flex cursor-pointer items-center rounded p-2 hover:bg-gray-100"
                onClick={() => {
                  setSelectedUsers(prev =>
                    prev.includes(user.id)
                      ? prev.filter(id => id !== user.id)
                      : [...prev, user.id]
                  );
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => {}}
                  className="mr-3 h-4 w-4"
                />
                {user.avatar ? (
                  <Avatar src={user.avatar} alt={user.name} className="mr-3" />
                ) : (
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
            ))
          )}
          {isFetchingNextPage && (
            <div className="flex justify-center p-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={handleCreateChat}
          disabled={selectedUsers.length === 0 || isLoading}
        >
          Tạo
        </Button>
      </div>
    </div>
  );
};

export const DirectChat: FC = () => {
  const currentUser = getUser();
  const currentUserId = currentUser?.id || '';

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the API for chats
  const {
    data: chatsData,
    isLoading: isLoadingChats,
    refetch: refetchChats
  } = api.chat.listChats.useQuery({
    variables: currentUserId,
    enabled: !!currentUserId
  });

  // Update chats state when data changes
  useEffect(() => {
    if (chatsData) {
      setChats(chatsData);
      setIsLoading(false);
    }
  }, [chatsData]);

  // Use the API for messages
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = api.chat.listMessages.useQuery({
    variables: { chatId: selectedChat || '', page: 1, limit: 50 },
    enabled: !!selectedChat
  });

  // Update messages state when data changes
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.items);
      setIsLoading(false);
    }
  }, [messagesData]);

  // Send message mutation
  const sendMessage = api.chat.sendMessage.useMutation();

  // Subscribe to chats
  useEffect(() => {
    if (!currentUserId) return;

    // Use the real subscription function
    let unsubscribe: () => void;

    // We need to handle the Promise returned by subscribeToChats
    subscribeToChats(currentUserId, () => {
      // Refresh chats when a new chat is created or updated
      refetchChats();
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUserId, refetchChats]);

  // Subscribe to selected chat for real-time messages
  useEffect(() => {
    if (!selectedChat) return;

    let unsubscribe: () => void;

    // Subscribe to the selected chat for real-time messages
    subscribeToChat(selectedChat, () => {
      // Refresh messages when a new message is sent or received
      refetchMessages();
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChat, refetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedChat) return;

    sendMessage.mutate(
      {
        chatId: selectedChat,
        content: newMessage,
        type: MsgMessageTypeOptions.Text
      },
      {
        onSuccess: () => {
          setNewMessage('');
          refetchMessages();
        }
      }
    );
  }, [newMessage, selectedChat, sendMessage, refetchMessages]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleNewChat = useCallback(() => {
    showModal({
      title: 'Tạo cuộc trò chuyện mới',
      className: 'w-[500px]',
      children: ({ close }) => (
        <NewChatModal
          onSuccess={chatId => {
            setSelectedChat(chatId);
            // Refresh chats after creating a new one
            refetchChats();
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [refetchChats]);

  const getOtherParticipant = useCallback(
    (chat: any) => {
      if (!chat.expand?.participants) return null;

      return chat.expand.participants.find((p: any) => p.id !== currentUserId);
    },
    [currentUserId]
  );

  return (
    <div className="flex h-full">
      {/* Chat list */}
      <div className="flex w-1/4 flex-col border-r">
        <div className="flex items-center justify-between border-b p-3">
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
          {isLoading && chats.length === 0 ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="py-2">
              {chats.map(chat => {
                const otherParticipant = getOtherParticipant(chat);
                if (!otherParticipant) return null;

                return (
                  <div
                    key={chat.id}
                    className={cn(
                      'mx-2 mb-1 cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-gray-100',
                      selectedChat === chat.id && 'bg-gray-100'
                    )}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-center">
                      <Avatar
                        size="md"
                        alt={otherParticipant.name}
                        src={
                          otherParticipant?.avatar
                            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`
                            : undefined
                        }
                        className="mr-3"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-sm font-medium">
                            {otherParticipant.name}
                          </span>
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
                        </div>
                        <div className="flex items-center justify-between">
                          {chat.expand?.lastMessage ? (
                            <p className="truncate text-sm text-gray-600">
                              {chat.expand.lastMessage.expand?.sender?.name ===
                              otherParticipant.name
                                ? chat.expand.lastMessage.content
                                : `Bạn: ${chat.expand.lastMessage.content}`}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400">
                              Chưa có tin nhắn nào
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {chats.length === 0 && !isLoading && (
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Chưa có cuộc trò chuyện nào
                    </p>
                    <Button className="mt-2" size="sm" onClick={handleNewChat}>
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Tạo cuộc trò chuyện mới
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white p-3">
              {chats.find(c => c.id === selectedChat) && (
                <div className="flex items-center">
                  <Avatar
                    size="sm"
                    alt={
                      getOtherParticipant(
                        chats.find(c => c.id === selectedChat)
                      )?.name || 'User'
                    }
                    src={
                      getOtherParticipant(
                        chats.find(c => c.id === selectedChat)
                      )?.avatar
                        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(getOtherParticipant(chats.find(c => c.id === selectedChat))?.name || 'User')}&background=random`
                        : undefined
                    }
                    className="mr-2"
                  />
                  <span className="font-medium">
                    {
                      getOtherParticipant(
                        chats.find(c => c.id === selectedChat)
                      )?.name
                    }
                  </span>
                </div>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {isLoading && messages.length === 0 ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="ml-auto h-16 w-3/4" />
                  <Skeleton className="h-16 w-3/4" />
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <Message
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender === currentUserId}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t bg-white p-3">
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  size="icon"
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
