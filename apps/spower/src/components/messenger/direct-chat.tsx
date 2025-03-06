import { PlusCircle, Send } from 'lucide-react';
import { api } from 'portal-api';
import { MsgMessageTypeOptions, getUser } from 'portal-core';

import { FC, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { Button, Textarea, showModal } from '@minhdtb/storeo-theme';

import { ChatHeader } from './chat-header';
import { ChatList } from './chat-list';
import { NewChatForm } from './form/new-chat-form';
import { MessageList } from './message-list';
import { Skeleton } from './skeleton';
import {
  selectedChatIdSignal,
  setSelectedChatId,
  triggerScrollToBottom
} from './utils';

export const DirectChat: FC = () => {
  const currentUser = getUser();
  const currentUserId = currentUser?.id || '';

  const [newMessage, setNewMessage] = useState('');
  const lastKeypressTime = useRef<number>(0);

  const markChatAsRead = api.chat.markChatAsRead.useMutation();
  const sendMessage = api.chat.sendMessage.useMutation();

  useEffect(() => {
    return () => {
      selectedChatIdSignal.value = undefined;
    };
  }, []);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      setSelectedChatId(chatId);
      markChatAsRead.mutate(chatId);
    },
    [markChatAsRead]
  );

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedChatIdSignal.value) return;

    sendMessage.mutate(
      {
        chatId: selectedChatIdSignal.value,
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
  }, [newMessage, sendMessage]);

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
          onSuccess={values => {
            if (values) {
              handleSelectChat(values.id);
            }
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [handleSelectChat]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex h-full w-1/4 flex-col overflow-hidden border-r">
        <div className="flex flex-none items-center justify-between border-b p-3">
          <h2 className="text-sm font-semibold">Tin nhắn trực tiếp</h2>
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
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
            />
          </Suspense>
        </div>
      </div>
      <div className="flex h-full w-3/4 flex-col overflow-hidden">
        {selectedChatIdSignal.value ? (
          <>
            <div className="flex-none">
              <ChatHeader />
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
                <MessageList />
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
