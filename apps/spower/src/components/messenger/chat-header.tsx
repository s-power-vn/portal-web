import { User as UserIcon } from 'lucide-react';
import { MsgChat } from 'portal-api';
import { Collections, getImageUrl } from 'portal-core';

import { FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

export type ChatHeaderProps = {
  chat: MsgChat;
  getOtherParticipant: (chat: MsgChat) => any;
};

export const ChatHeader: FC<ChatHeaderProps> = ({
  chat,
  getOtherParticipant
}) => {
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
