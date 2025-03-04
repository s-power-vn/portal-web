import { useInfiniteQuery } from '@tanstack/react-query';
import { MoreHorizontal, PlusCircle, Send, Users } from 'lucide-react';
import {
  api,
  subscribeToChat,
  subscribeToChats,
  subscribeToTeam
} from 'portal-api';
import {
  MsgChannelTypeOptions,
  MsgChatTypeOptions,
  MsgMessageTypeOptions,
  getUser
} from 'portal-core';

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Avatar, Button, Input, showModal } from '@minhdtb/storeo-theme';

// Skeleton component
const Skeleton: FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('animate-pulse rounded bg-gray-200', className)} />;
};

type MessageProps = {
  message: any;
  isCurrentUser: boolean;
};

const Message: FC<MessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isCurrentUser && (
        <Avatar
          size="md"
          alt={message.expand?.sender?.name || 'User'}
          src={
            message.expand?.sender?.avatar
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(message.expand.sender.name)}&background=random`
              : undefined
          }
          className="mr-3"
        />
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-lg px-4 py-2',
          isCurrentUser
            ? 'bg-appBlue text-white'
            : 'border border-gray-200 bg-gray-100 text-gray-800'
        )}
      >
        {!isCurrentUser && (
          <div className="mb-1 text-xs font-medium">
            {message.expand?.sender?.name || 'User'}
          </div>
        )}
        <div>{message.content}</div>
        <div className="mt-1 text-xs opacity-70">
          {new Date(message.created).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      {isCurrentUser && (
        <Avatar
          size="md"
          alt="Me"
          src={
            getUser()?.avatar
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(getUser()?.name || 'Me')}&background=random`
              : undefined
          }
          className="ml-3"
        />
      )}
    </div>
  );
};

type NewTeamModalProps = {
  onSuccess: (teamId: string) => void;
  onCancel: () => void;
};

type User = {
  id: string;
  name: string;
  avatar?: string;
};

const NewTeamModal: FC<NewTeamModalProps> = ({ onSuccess, onCancel }) => {
  const [teamName, setTeamName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const createTeam = api.chat.createTeam.useMutation();

  // Use infinite query for loading employees
  const {
    data: employeesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingEmployees,
    isError
  } = useInfiniteQuery({
    queryKey: ['employees', ''],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return api.employee.list.fetcher({
        filter: '',
        pageIndex: pageParam,
        pageSize: 20
      });
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1
  });

  // Flatten the pages data into a single array of users
  useEffect(() => {
    if (employeesData) {
      const allUsers = employeesData.pages.flatMap(page =>
        page.items.map(employee => ({
          id: employee.id,
          name: employee.name,
          avatar: employee.avatar
        }))
      );
      setUsers(allUsers);
    }
  }, [employeesData]);

  // Load more users when scrolling to the bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleCreateTeam = useCallback(async () => {
    if (!teamName.trim() || selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      const result = await createTeam.mutateAsync({
        name: teamName,
        members: selectedUsers
      });
      onSuccess(result.id);
    } catch (error) {
      console.error('Failed to create team:', error);
    } finally {
      setIsLoading(false);
    }
  }, [teamName, selectedUsers, onSuccess, createTeam]);

  return (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-medium">Tạo nhóm mới</h3>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Tên nhóm</label>
        <Input
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          placeholder="Nhập tên nhóm..."
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium">Chọn thành viên:</p>
        <div className="max-h-60 overflow-y-auto" onScroll={handleScroll}>
          {isLoadingEmployees && !users.length ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin">
                <Users size={20} />
              </div>
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500">
              Không thể tải danh sách nhân viên
            </div>
          ) : (
            users.map(user => (
              <div
                key={user.id}
                className="mb-2 flex cursor-pointer items-center rounded p-2 hover:bg-gray-100"
                onClick={() => {
                  setSelectedUsers(prev =>
                    prev.includes(user.id)
                      ? prev.filter(id => id !== user.id)
                      : [...prev, user.id]
                  );
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => {}}
                  className="mr-2"
                />
                <Avatar
                  size="sm"
                  alt={user.name}
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                  }
                  className="mr-2"
                />
                <span>{user.name}</span>
              </div>
            ))
          )}
          {isFetchingNextPage && (
            <div className="flex justify-center p-2">
              <div className="animate-spin">
                <Users size={16} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={handleCreateTeam}
          disabled={!teamName.trim() || selectedUsers.length === 0 || isLoading}
        >
          {isLoading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </div>
    </div>
  );
};

type NewChannelModalProps = {
  teamId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const NewChannelModal: FC<NewChannelModalProps> = ({
  teamId,
  onSuccess,
  onCancel
}) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const createChannel = api.chat.createChannel.useMutation();

  const handleCreateChannel = useCallback(async () => {
    if (!channelName.trim()) return;

    setIsLoading(true);
    try {
      await createChannel.mutateAsync({
        name: channelName,
        description: channelDescription,
        teamId: teamId,
        type: MsgChannelTypeOptions.Public
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setIsLoading(false);
    }
  }, [channelName, channelDescription, teamId, onSuccess, createChannel]);

  return (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-medium">Tạo kênh mới</h3>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Tên kênh</label>
        <Input
          value={channelName}
          onChange={e => setChannelName(e.target.value)}
          placeholder="Nhập tên kênh..."
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Mô tả</label>
        <Input
          value={channelDescription}
          onChange={e => setChannelDescription(e.target.value)}
          placeholder="Nhập mô tả kênh..."
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={handleCreateChannel}
          disabled={!channelName.trim() || isLoading}
        >
          {isLoading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </div>
    </div>
  );
};

export const GroupChat: FC = () => {
  const currentUser = getUser();
  const currentUserId = currentUser?.id || '';

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load teams
  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    refetch: refetchTeams
  } = api.chat.listTeams.useQuery({
    variables: currentUserId,
    enabled: !!currentUserId
  });

  // Update teams when data is loaded
  useEffect(() => {
    if (teamsData) {
      setTeams(teamsData);
      setIsLoading(false);

      // Select first team if none selected
      if (!selectedTeam && teamsData.length > 0) {
        setSelectedTeam(teamsData[0].id);
      }
    }
  }, [teamsData, selectedTeam]);

  // Load channels for selected team
  const {
    data: channelsData,
    isLoading: isLoadingChannels,
    refetch: refetchChannels
  } = api.chat.listChannels.useQuery({
    variables: selectedTeam || '',
    enabled: !!selectedTeam
  });

  // Update channels when data is loaded
  useEffect(() => {
    if (channelsData) {
      setChannels(channelsData);

      // Select first channel if none selected
      if (!selectedChannel && channelsData.length > 0) {
        setSelectedChannel(channelsData[0].id);
      }
    }
  }, [channelsData, selectedChannel]);

  // Load chats for selected channel
  const {
    data: chatsData,
    isLoading: isLoadingChats,
    refetch: refetchChats
  } = api.chat.getChatsByChannel.useQuery({
    variables: selectedChannel || '',
    enabled: !!selectedChannel
  });

  // Update chats when data is loaded
  useEffect(() => {
    if (chatsData) {
      setChats(chatsData);
      // If there are chats, select the first one
      if (chatsData.length > 0 && !selectedChat) {
        setSelectedChat(chatsData[0].id);
      }
    }
  }, [chatsData, selectedChat]);

  // Load messages for selected chat
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = api.chat.listMessages.useQuery({
    variables: { chatId: selectedChat || '', page: 1, limit: 50 },
    enabled: !!selectedChat
  });

  // Update messages when data is loaded
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.items);
    }
  }, [messagesData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create message mutation
  const sendMessage = api.chat.sendMessage.useMutation();

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      // Send message using the API
      await sendMessage.mutateAsync({
        chatId: selectedChat,
        content: newMessage.trim(),
        type: MsgMessageTypeOptions.Text
      });

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [newMessage, selectedChat, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleNewTeam = useCallback(() => {
    showModal({
      title: 'Tạo nhóm mới',
      className: 'w-[500px]',
      children: ({ close }) => (
        <NewTeamModal
          onSuccess={teamId => {
            // Refresh teams to get the new team
            refetchTeams();
            setSelectedTeam(teamId);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [refetchTeams]);

  const handleNewChannel = useCallback(() => {
    if (!selectedTeam) return;

    showModal({
      title: 'Tạo kênh mới',
      className: 'w-[500px]',
      children: ({ close }) => (
        <NewChannelModal
          teamId={selectedTeam}
          onSuccess={() => {
            // Refresh channels to get the new channel
            refetchChannels();
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [selectedTeam, refetchChannels]);

  // Create a chat for a channel
  const createChannelChat = api.chat.createChat.useMutation();

  const handleCreateChannelChat = useCallback(async () => {
    if (!selectedChannel || !selectedTeam) return;

    try {
      const team = teams.find(t => t.id === selectedTeam);
      if (!team) return;

      // Create a new chat for the channel
      const result = await createChannelChat.mutateAsync({
        type: MsgChatTypeOptions.Group,
        participants: team.members || [],
        teamId: selectedTeam,
        channelId: selectedChannel
      });

      // Refresh chats to get the new chat
      refetchChats();
      setSelectedChat(result.id);
    } catch (error) {
      console.error('Failed to create chat for channel:', error);
    }
  }, [selectedChannel, selectedTeam, teams, createChannelChat, refetchChats]);

  const getTeamName = useCallback(
    (teamId: string) => {
      const team = teams.find(t => t.id === teamId);
      return team?.name || 'Nhóm';
    },
    [teams]
  );

  const getChannelName = useCallback(
    (channelId: string) => {
      const channel = channels.find(c => c.id === channelId);
      return channel?.name || 'Kênh';
    },
    [channels]
  );

  const getUnreadCount = useCallback(
    (chat: any) => {
      if (!chat.lastMessage || !chat.expand?.lastMessage) return 0;

      const settings = chat.settings?.find(
        (s: any) => s.user === currentUserId
      );
      if (!settings) return 1; // Assume unread if no settings

      const lastMessageTime = new Date(
        chat.expand.lastMessage.created
      ).getTime();
      const lastReadTime = settings.lastRead
        ? new Date(settings.lastRead).getTime()
        : 0;

      return lastMessageTime > lastReadTime ? 1 : 0;
    },
    [currentUserId]
  );

  // Subscribe to teams
  useEffect(() => {
    if (!currentUserId) return;

    let unsubscribe: () => void;

    // Subscribe to teams for the current user
    subscribeToChats(currentUserId, () => {
      // Refresh teams when a team is updated
      refetchTeams();
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUserId, refetchTeams]);

  // Subscribe to channels for the selected team
  useEffect(() => {
    if (!selectedTeam) return;

    let unsubscribe: () => void;

    // Subscribe to the selected team for channel updates
    subscribeToTeam(selectedTeam, () => {
      // Refresh channels when a channel is added or updated
      refetchChannels();
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedTeam, refetchChannels]);

  // Subscribe to selected chat for real-time messages
  useEffect(() => {
    if (!selectedChat) return;

    let unsubscribe: () => void;

    // Subscribe to the selected chat for real-time messages
    subscribeToChat(selectedChat, () => {
      // Refresh messages when a new message is sent or received
      refetchMessages();
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChat, refetchMessages]);

  return (
    <div className="flex h-full">
      {/* Teams and Channels sidebar */}
      <div className="flex w-1/4 flex-col border-r">
        <div className="flex items-center justify-between border-b p-3">
          <h2 className="text-sm font-semibold">Nhóm</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNewTeam}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && teams.length === 0 ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="py-2">
              {teams.map(team => (
                <div key={team.id} className="mb-4">
                  <div
                    className={cn(
                      'mx-2 mb-1 cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-gray-100',
                      selectedTeam === team.id && 'bg-gray-100'
                    )}
                    onClick={() => {
                      setSelectedTeam(team.id);
                      setSelectedChannel(null);
                      setSelectedChat(null);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <Avatar
                          size="md"
                          alt={team.name}
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=random`}
                        />
                        <div className="bg-appBlue absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white">
                          <Users className="h-3 w-3" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-sm font-medium">
                            {team.name}
                          </span>
                        </div>
                        <p className="truncate text-xs text-gray-600">
                          {team.members?.length || 0} thành viên
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Channels for this team */}
                  {selectedTeam === team.id && (
                    <div className="ml-8 mt-2">
                      <div className="flex items-center justify-between px-3 py-1">
                        <span className="text-xs font-medium text-gray-500">
                          Kênh
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={handleNewChannel}
                        >
                          <PlusCircle className="h-3 w-3" />
                        </Button>
                      </div>

                      {isLoading && channels.length === 0 ? (
                        <div className="space-y-2 p-2">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : channels.length > 0 ? (
                        channels.map(channel => (
                          <div
                            key={channel.id}
                            className={cn(
                              'mx-2 cursor-pointer rounded-md px-3 py-1 transition-colors hover:bg-gray-100',
                              selectedChannel === channel.id && 'bg-gray-100'
                            )}
                            onClick={() => {
                              setSelectedChannel(channel.id);
                              setSelectedChat(null);
                            }}
                          >
                            <div className="flex items-center">
                              <span className="truncate text-sm">
                                # {channel.name}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Chưa có kênh nào
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {teams.length === 0 && !isLoading && (
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Chưa có nhóm nào</p>
                    <Button className="mt-2" size="sm" onClick={handleNewTeam}>
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Tạo nhóm mới
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white p-3">
              <div className="flex items-center">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">
                    {getTeamName(selectedTeam || '')}
                  </div>
                  <div className="text-xs text-gray-500">
                    # {getChannelName(selectedChannel || '')}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {isLoading || messages.length === 0 ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="ml-auto h-16 w-3/4" />
                  <Skeleton className="h-16 w-3/4" />
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <Message
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender === currentUserId}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t bg-white p-3">
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : selectedChannel ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">
                Kênh: {getChannelName(selectedChannel)}
              </p>
              <p className="text-sm text-gray-500">
                Đang tạo cuộc trò chuyện cho kênh này...
              </p>
            </div>
          </div>
        ) : selectedTeam ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">
                Nhóm: {getTeamName(selectedTeam)}
              </p>
              <p className="text-sm text-gray-500">
                Hãy chọn một kênh để bắt đầu
              </p>
              <Button className="mt-4" onClick={handleNewChannel}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Tạo kênh mới
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">Chọn một nhóm</p>
              <p className="text-sm text-gray-500">Hoặc tạo một nhóm mới</p>
              <Button className="mt-4" onClick={handleNewTeam}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Tạo nhóm mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
