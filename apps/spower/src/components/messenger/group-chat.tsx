import { MoreHorizontal, PlusCircle, Send, Users } from 'lucide-react';
import {
  MsgChannelTypeOptions,
  MsgChatTypeOptions,
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

const NewTeamModal: FC<NewTeamModalProps> = ({ onSuccess, onCancel }) => {
  const [teamName, setTeamName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use a mock user list
  const [users, setUsers] = useState<any[]>([]);

  // Fetch users
  useEffect(() => {
    // Mock user data
    setUsers([
      { id: '1', name: 'User 1', avatar: '' },
      { id: '2', name: 'User 2', avatar: '' },
      { id: '3', name: 'User 3', avatar: '' }
    ]);
  }, []);

  const handleCreateTeam = useCallback(async () => {
    if (!teamName.trim() || selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        onSuccess('new-team-' + Date.now());
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to create team:', error);
      setIsLoading(false);
    }
  }, [teamName, selectedUsers, onSuccess]);

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
        <div className="max-h-60 overflow-y-auto">
          {users.map(user => (
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
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                className="mr-2"
              />
              <span>{user.name}</span>
            </div>
          ))}
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
          Tạo
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

  const handleCreateChannel = useCallback(async () => {
    if (!channelName.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        onSuccess();
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to create channel:', error);
      setIsLoading(false);
    }
  }, [channelName, onSuccess]);

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
          Tạo
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

  // Load mock data
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setTeams([
        { id: '1', name: 'Team 1', members: ['1', '2', '3'], logo: '' }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      setIsLoading(true);
      setTimeout(() => {
        setChannels([
          {
            id: '1',
            name: 'General',
            teamId: selectedTeam,
            type: MsgChannelTypeOptions.Public
          }
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedChannel) {
      setIsLoading(true);
      setTimeout(() => {
        setChats([
          {
            id: '1',
            channelId: selectedChannel,
            teamId: selectedTeam,
            participants: ['1', '2', '3']
          }
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedChannel, selectedTeam]);

  useEffect(() => {
    if (selectedChat) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            chatId: selectedChat,
            content: 'Hello team!',
            sender: '1',
            created: new Date().toISOString(),
            expand: { sender: { id: '1', name: 'User 1', avatar: '' } }
          },
          {
            id: '2',
            chatId: selectedChat,
            content: 'Hi there!',
            sender: '2',
            created: new Date().toISOString(),
            expand: { sender: { id: '2', name: 'User 2', avatar: '' } }
          }
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedChat]);

  // Update teams when data changes
  useEffect(() => {
    // Select first team if none selected
    if (!selectedTeam && teams.length > 0) {
      setSelectedTeam(teams[0].id);
    }
  }, [teams, selectedTeam]);

  // Update channels when data changes
  useEffect(() => {
    // Select first channel if none selected
    if (!selectedChannel && channels.length > 0) {
      setSelectedChannel(channels[0].id);
    }
  }, [channels, selectedChannel]);

  // Update chats when data changes
  useEffect(() => {
    // Select first chat if none selected
    if (!selectedChat && chats.length > 0) {
      setSelectedChat(chats[0].id);
    } else if (chats.length === 0 && selectedChannel) {
      // Create a new chat for this channel if none exists
      handleCreateChannelChat();
    }
  }, [chats, selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      // Add message to the list
      const newMsg = {
        id: Date.now().toString(),
        chatId: selectedChat,
        content: newMessage.trim(),
        sender: currentUserId,
        created: new Date().toISOString(),
        expand: { sender: { id: currentUserId, name: 'Me', avatar: '' } }
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [newMessage, selectedChat, currentUserId]);

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
            // Add new team to the list
            const newTeam = {
              id: teamId,
              name: 'New Team',
              members: ['1', '2', '3'],
              logo: ''
            };
            setTeams(prev => [...prev, newTeam]);
            setSelectedTeam(teamId);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, []);

  const handleNewChannel = useCallback(() => {
    if (!selectedTeam) return;

    showModal({
      title: 'Tạo kênh mới',
      className: 'w-[500px]',
      children: ({ close }) => (
        <NewChannelModal
          teamId={selectedTeam}
          onSuccess={() => {
            // Add new channel to the list
            const newChannel = {
              id: 'new-channel-' + Date.now(),
              name: 'New Channel',
              teamId: selectedTeam,
              type: MsgChannelTypeOptions.Public
            };
            setChannels(prev => [...prev, newChannel]);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [selectedTeam]);

  const handleCreateChannelChat = useCallback(() => {
    if (!selectedChannel || !selectedTeam) return;

    try {
      const team = teams.find(t => t.id === selectedTeam);
      if (!team) return;

      // Create a new chat
      const newChat = {
        id: 'new-chat-' + Date.now(),
        type: MsgChatTypeOptions.Group,
        participants: team.members || [],
        teamId: selectedTeam,
        channelId: selectedChannel
      };

      setChats(prev => [...prev, newChat]);
      setSelectedChat(newChat.id);
    } catch (error) {
      console.error('Failed to create chat for channel:', error);
    }
  }, [selectedChannel, selectedTeam, teams]);

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
