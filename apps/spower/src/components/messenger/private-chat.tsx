import { PlusCircle, Send } from 'lucide-react';
import { MsgChat, api, subscribeChats, subscribeMessages } from 'portal-api';
import {
  MsgChatTypeOptions,
  MsgMessageTypeOptions,
  getUser
} from 'portal-core';

import { FC, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { Button, Textarea, showModal } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../hooks';
import { ChatHeader } from './chat-header';
import { ChatList } from './chat-list';
import { NewChatForm } from './form/new-chat-form';
import { MessageList } from './message-list';
import { Skeleton } from './skeleton';
import { triggerScrollToBottom } from './utils';

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
