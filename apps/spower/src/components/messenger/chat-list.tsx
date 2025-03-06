import { PlusCircle } from 'lucide-react';
import { MsgChat, api } from 'portal-api';

import { FC, useMemo } from 'react';

import { Button } from '@minhdtb/storeo-theme';

import { ChatListItem } from './chat-list-item';

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
