import { Edit2, User as UserIcon, Users } from 'lucide-react';
import { api } from 'portal-api';
import { Collections, getImageUrl, getUser } from 'portal-core';

import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  success
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
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: chat } = api.chat.getChat.useSuspenseQuery({
    variables: selectedChatIdSignal.value
  });

  const updateChatName = api.chat.updateChatName.useMutation({
    onSuccess: () => {
      success('Cập nhật tên nhóm chat thành công');
      setIsEditing(false);
    }
  });

  useEffect(() => {
    if (chat) {
      setChatName(chat.name || 'Nhóm chat');
    }
  }, [chat]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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

  const handleSaveChatName = () => {
    if (chat && chatName.trim() !== '' && chatName.trim() !== chat.name) {
      updateChatName.mutate({
        id: chat.id,
        name: chatName.trim()
      });
    } else {
      setIsEditing(false);
      setChatName(chat.name);
    }
  };

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
            <div className="flex items-center gap-1">
              {isEditing ? (
                <Input
                  ref={inputRef}
                  value={chatName}
                  onChange={e => setChatName(e.target.value)}
                  onBlur={handleSaveChatName}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSaveChatName();
                    } else if (e.key === 'Escape') {
                      setIsEditing(false);
                      setChatName(chat.name);
                    }
                  }}
                  className="h-6 w-[180px] text-sm font-medium"
                />
              ) : (
                <>
                  <h3 className="text-sm font-medium">{chat.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <p
                className="max-w-[160px] truncate text-xs text-gray-500"
                title={participantNames}
              >
                {participantNames}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    className="ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    title="Xem danh sách thành viên"
                  >
                    <Users className="h-3 w-3" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="max-h-[300px] overflow-y-auto"
                  side="bottom"
                  align="start"
                  sideOffset={2}
                >
                  {otherParticipants.map(participant => (
                    <DropdownMenuItem key={participant.id} className="py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
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
                        <span className="text-sm">{participant.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
