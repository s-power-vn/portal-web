import { User as UserIcon } from 'lucide-react';
import { api } from 'portal-api';
import { Collections, getImageUrl, getUser } from 'portal-core';

import { FC, useMemo } from 'react';

import { cn } from '@minhdtb/storeo-core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@minhdtb/storeo-theme';

import {
  getFirstOtherParticipant,
  getOtherParticipants,
  getParticipantNames,
  isGroupChatType,
  selectedChatIdSignal
} from './utils';

export type ChatHeaderProps = {};

export const ChatHeader: FC<ChatHeaderProps> = () => {
  const currentUser = getUser();

  const { data: chat } = api.chat.getChat.useSuspenseQuery({
    variables: selectedChatIdSignal.value
  });

  const isGroupChat = useMemo(() => {
    return isGroupChatType(chat);
  }, [chat]);

  const otherParticipants = useMemo(() => {
    return getOtherParticipants(chat, currentUser?.id);
  }, [chat, currentUser?.id]);

  const otherParticipant = useMemo(() => {
    return getFirstOtherParticipant(otherParticipants);
  }, [otherParticipants]);

  const displayParticipants = useMemo(() => {
    return otherParticipants.slice(0, 3);
  }, [otherParticipants]);

  const participantNames = useMemo(() => {
    return getParticipantNames(otherParticipants);
  }, [otherParticipants]);

  return (
    <div className="flex items-center border-b p-3">
      {isGroupChat ? (
        <>
          <div className="relative h-10 w-12">
            {displayParticipants.map((participant, index) => (
              <Avatar
                key={participant.id}
                className={cn(
                  'absolute h-8 w-8 border-2 border-white',
                  index === 0 && 'left-0 top-0 z-30',
                  index === 1 && 'left-2 top-1 z-20',
                  index === 2 && 'left-4 top-2 z-10'
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
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            ))}
            {otherParticipants.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-primary absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white">
                      +{otherParticipants.length - 3}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-[200px]">
                      {otherParticipants
                        .slice(3)
                        .map(p => p.name)
                        .join(', ')}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium">Nhóm chat</h3>
            <p
              className="max-w-[200px] truncate text-xs text-gray-500"
              title={participantNames}
            >
              {participantNames}
            </p>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
