import { User as UserIcon } from 'lucide-react';
import { MsgChat, api } from 'portal-api';
import { Collections, UserResponse, getImageUrl, getUser } from 'portal-core';

import { FC, memo, useMemo } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

export type ChatListItemProps = {
  chatId: string;
  isSelected: boolean;
  onClick: () => void;
  getOtherParticipant: (chat?: MsgChat) => UserResponse | undefined;
};

export const ChatListItemComponent: FC<ChatListItemProps> = ({
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
      userId: user?.id,
      chatId
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
              otherParticipant?.id,
              otherParticipant?.avatar
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
              {otherParticipant?.name}
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

export const ChatListItem = memo(
  ChatListItemComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.chatId === nextProps.chatId &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);
