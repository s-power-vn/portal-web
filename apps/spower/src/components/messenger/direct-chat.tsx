import console from 'console';
import { MoreHorizontal, PlusCircle, Send, UserIcon } from 'lucide-react';
import { MsgChat, api, subscribeToChat, subscribeToChats } from 'portal-api';
import {
  Collections,
  MsgChatTypeOptions,
  MsgMessageTypeOptions,
  getImageUrl,
  getUser
} from 'portal-core';

import { FC, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
  showModal
} from '@minhdtb/storeo-theme';

import { NewChatForm } from './form/new-chat-form';

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
  const { data: chatsData, refetch: refetchChats } =
    api.chat.listChats.useSuspenseQuery({
      variables: userId
    });

  useEffect(() => {
    if (!userId) return;

    let unsubscribe: () => void;

    subscribeToChats(userId, () => {
      refetchChats();
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, refetchChats]);

  return (
    <div className="py-2">
      {chatsData.map(chat => {
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
              <div className="flex w-full flex-col">
                <span className="truncate text-sm font-medium">
                  {otherParticipant.name}
                </span>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="truncate">
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
      {chatsData.length === 0 && (
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

export const DirectChat: FC = () => {
  const currentUser = getUser();
  const currentUserId = currentUser?.id || '';

  const [selectedChat, setSelectedChat] = useState<MsgChat | undefined>();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createChat = api.chat.createChat.useMutation();

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = api.chat.listMessages.useQuery({
    variables: { chatId: selectedChat?.id || '', page: 1, limit: 50 },
    enabled: !!selectedChat
  });

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.items);
    }
  }, [messagesData]);

  const sendMessage = api.chat.sendMessage.useMutation();

  useEffect(() => {
    if (!selectedChat) return;

    let unsubscribe: () => void;

    subscribeToChat(selectedChat.id, () => {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      children: ({ close }) => (
        <NewChatForm
          onSuccess={async values => {
            const result = await createChat.mutateAsync({
              type: MsgChatTypeOptions.Private,
              participants: values?.users ?? []
            });

            setSelectedChat(result);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [createChat]);

  const getOtherParticipant = useCallback(
    (chat: MsgChat) => {
      console.log(chat.expand?.participants);
      if (!chat.expand?.participants) return null;

      return chat.expand.participants.find((p: any) => p.id !== currentUserId);
    },
    [currentUserId]
  );

  return (
    <div className="flex h-full">
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
              setSelectedChat={setSelectedChat}
              onNewChat={handleNewChat}
              getOtherParticipant={getOtherParticipant}
            />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {selectedChat ? (
          <>
            <ChatHeader
              chat={selectedChat}
              getOtherParticipant={getOtherParticipant}
            />
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {isLoadingMessages && messages.length === 0 ? (
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

            <div className="border-t bg-white p-3">
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
