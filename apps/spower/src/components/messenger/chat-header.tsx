import { User as UserIcon } from 'lucide-react';
import { MsgChat, api } from 'portal-api';
import { Collections, UserResponse, getImageUrl } from 'portal-core';

import { FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

export type ChatHeaderProps = {
  chatId: string;
  getOtherParticipant: (chat?: MsgChat) => UserResponse | undefined;
};

export const ChatHeader: FC<ChatHeaderProps> = ({
  chatId,
  getOtherParticipant
}) => {
  const { data: chat } = api.chat.getChat.useSuspenseQuery({
    variables: chatId
  });

  const otherParticipant = getOtherParticipant(chat);

  return (
    <div className="flex items-center border-b p-3">
      <Avatar className="mr-2 h-8 w-8">
        <AvatarImage
          src={getImageUrl(
            Collections.User,
            otherParticipant?.id,
            otherParticipant?.avatar
          )}
        />
        <AvatarFallback>
          <UserIcon className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-sm font-medium">
          {otherParticipant?.name || 'Tên không xác định'}
        </h3>
      </div>
    </div>
  );
};
