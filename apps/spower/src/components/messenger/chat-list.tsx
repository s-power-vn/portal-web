import { PlusCircle } from 'lucide-react';
import { MsgChat, api, subscribeChats } from 'portal-api';
import { UserResponse, getUser } from 'portal-core';

import { FC, useEffect, useMemo } from 'react';

import { Button } from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../hooks';
import { ChatListItem } from './chat-list-item';

export type ChatListProps = {
  userId: string;
  selectedChatId: string | undefined;
  setSelectedChatId: (chatId: string) => void;
  onNewChat: () => void;
  getOtherParticipant: (chat?: MsgChat) => UserResponse | undefined;
};

export const ChatList: FC<ChatListProps> = ({
  userId,
  selectedChatId,
  setSelectedChatId,
  onNewChat,
  getOtherParticipant
}) => {
  const user = getUser();
  const invalidates = useInvalidateQueries();

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

  useEffect(() => {
    if (!user?.id) return;

    let unsubscribe: () => void;

    subscribeChats(user.id, value => {
      invalidates([api.chat.getChat.getKey(value.record.id)]);
      if (allChats.find(chat => chat.id === value.record.id) === undefined) {
        invalidates([api.chat.listPrivateChats.getKey({ userId: user.id })]);
      }
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
    <div className="h-full overflow-y-auto">
      {allChats.map(chat => (
        <ChatListItem
          key={chat.id}
          chatId={chat.id}
          isSelected={selectedChatId === chat.id}
          onClick={() => setSelectedChatId(chat.id)}
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
