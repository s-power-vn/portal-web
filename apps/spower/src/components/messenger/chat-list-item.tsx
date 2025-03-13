import { User as UserIcon } from 'lucide-react';
import { api } from 'portal-api';
import { Collections, getImageUrl, getUser } from 'portal-core';

import { FC, memo, useMemo } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

import {
  formatMessageTime,
  getFirstOtherParticipant,
  getOtherParticipants,
  isGroupChatType
} from './utils';

const stripHtml = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

export type ChatListItemProps = {
  chatId: string;
  isSelected: boolean;
  onClick: () => void;
};

export const ChatListItemComponent: FC<ChatListItemProps> = ({
  chatId,
  isSelected,
  onClick
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

  const isGroupChat = useMemo(() => {
    return isGroupChatType(chat);
  }, [chat]);

  const otherParticipants = useMemo(() => {
    return getOtherParticipants(chat, user?.id);
  }, [chat, user?.id]);

  const otherParticipant = useMemo(() => {
    return getFirstOtherParticipant(otherParticipants);
  }, [otherParticipants]);

  const lastMessageContent = useMemo(() => {
    if (!chat?.expand?.lastMessage?.content) return '';
    return stripHtml(chat.expand.lastMessage.content);
  }, [chat?.expand?.lastMessage?.content]);

  return (
    <div
      className={cn(
        'm-2 cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-100',
        isSelected && 'bg-gray-100'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {isGroupChat ? (
          <div className="relative h-8 w-8">
            {otherParticipants.slice(0, 2).map((participant, index) => (
              <Avatar
                key={participant.id}
                className={cn(
                  'absolute h-6 w-6 border border-white',
                  index === 0 && 'left-0 top-0',
                  index === 1 && 'bottom-0 right-0'
                )}
              >
                <AvatarImage
                  src={getImageUrl(
                    Collections.User,
                    participant.id,
                    participant.avatar
                  )}
                />
                <AvatarFallback>
                  <UserIcon className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
            ))}
            {otherParticipants.length > 2 && (
              <div className="bg-primary absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full text-[8px] text-white">
                +{otherParticipants.length - 2}
              </div>
            )}
          </div>
        ) : (
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
        )}
        <div className="flex w-full flex-col overflow-hidden">
          <div className="flex min-w-0">
            <span
              className={cn(
                'overflow-hidden text-ellipsis whitespace-nowrap text-sm',
                hasNewMessage && 'font-bold'
              )}
            >
              {isGroupChat
                ? chat.name || `Nhóm (${otherParticipants.length} người)`
                : otherParticipant?.name}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span
              className={cn(
                'flex-1 overflow-hidden truncate text-xs italic',
                hasNewMessage && 'font-bold'
              )}
            >
              {chat?.expand?.lastMessage ? (
                <>
                  {chat.expand.lastMessage.expand?.sender && (
                    <>
                      {isGroupChat ? (
                        <span className="font-medium text-gray-700">
                          {chat.expand.lastMessage.expand.sender.id === user?.id
                            ? 'Bạn: '
                            : `${chat.expand.lastMessage.expand.sender.name}: `}
                        </span>
                      ) : (
                        <>
                          {chat.expand.lastMessage.expand.sender.id ===
                            user?.id && (
                            <span className="font-medium text-gray-700">
                              Bạn:{' '}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {lastMessageContent}
                </>
              ) : (
                <span className="text-gray-400">Chưa có tin nhắn</span>
              )}
            </span>
            <span className="text-xs">
              {chat?.expand?.lastMessage ? (
                <span className="text-xs text-gray-500">
                  {formatMessageTime(new Date(chat.expand.lastMessage.created))}
                </span>
              ) : (
                <span className="text-xs text-gray-400">
                  {formatMessageTime(new Date(chat.updated))}
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
