import { MoreHorizontal, PlusCircle, Send } from 'lucide-react';

import { FC, useEffect, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Avatar, Button, Input } from '@minhdtb/storeo-theme';

// Skeleton component đơn giản
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
        <Avatar size="md" alt={message.senderName} className="mr-3" />
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
          <div className="mb-1 text-xs font-medium">{message.senderName}</div>
        )}
        <div>{message.content}</div>
        <div className="mt-1 text-xs opacity-70">
          {new Date(message.created).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      {isCurrentUser && <Avatar size="md" alt="Me" className="ml-3" />}
    </div>
  );
};

export const DirectChat: FC = () => {
  const currentUserId = 'current-user';
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [channels, setChannels] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch channels
  useEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      // Giả lập API call
      setTimeout(() => {
        setChannels([
          {
            id: '1',
            name: 'Nguyễn Văn A',
            avatar: '',
            lastMessage: 'Xin chào, bạn có khỏe không?',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 2
          },
          {
            id: '2',
            name: 'Trần Thị B',
            avatar: '',
            lastMessage: 'Báo cáo đã hoàn thành',
            lastMessageTime: new Date(
              Date.now() - 1000 * 60 * 30
            ).toISOString(), // 30 phút trước
            unreadCount: 0
          }
        ]);
        setSelectedChannel('1');
        setIsLoading(false);
      }, 500);
    };

    fetchChannels();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!selectedChannel) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      // Giả lập API call
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            senderId: 'other-user',
            senderName: 'Nguyễn Văn A',
            content: 'Xin chào, bạn có khỏe không?',
            created: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 phút trước
          },
          {
            id: '2',
            senderId: currentUserId,
            senderName: 'Tôi',
            content: 'Chào, tôi khỏe. Bạn thế nào?',
            created: new Date(Date.now() - 1000 * 60 * 4).toISOString() // 4 phút trước
          },
          {
            id: '3',
            senderId: 'other-user',
            senderName: 'Nguyễn Văn A',
            content: 'Tôi cũng khỏe, cảm ơn. Dự án tiến triển thế nào rồi?',
            created: new Date(Date.now() - 1000 * 60 * 3).toISOString() // 3 phút trước
          }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchMessages();
  }, [selectedChannel]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return;

    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'Tôi',
      content: newMessage.trim(),
      created: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-full">
      {/* Danh sách kênh chat */}
      <div className="flex w-1/4 flex-col border-r">
        <div className="flex items-center justify-between border-b p-3">
          <h2 className="text-sm font-semibold">Tin nhắn trực tiếp</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && !channels.length ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="py-2">
              {channels.map(channel => (
                <div
                  key={channel.id}
                  className={cn(
                    'mx-2 mb-1 cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-gray-100',
                    selectedChannel === channel.id && 'bg-gray-100'
                  )}
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <div className="flex items-center">
                    <Avatar size="md" alt={channel.name} className="mr-3" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">
                          {channel.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(channel.lastMessageTime).toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm text-gray-600">
                          {channel.lastMessage}
                        </p>
                        {channel.unreadCount > 0 && (
                          <span className="bg-appBlue inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-medium text-white">
                            {channel.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Khu vực chat */}
      <div className="flex flex-1 flex-col">
        {selectedChannel ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white p-3">
              {channels.find(c => c.id === selectedChannel) && (
                <div className="flex items-center">
                  <Avatar
                    size="sm"
                    alt={channels.find(c => c.id === selectedChannel)?.name}
                    className="mr-2"
                  />
                  <span className="font-medium">
                    {channels.find(c => c.id === selectedChannel)?.name}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {isLoading && !messages.length ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="ml-auto h-16 w-3/4" />
                  <Skeleton className="h-16 w-3/4" />
                </div>
              ) : (
                messages.map(message => (
                  <Message
                    key={message.id}
                    message={message}
                    isCurrentUser={message.senderId === currentUserId}
                  />
                ))
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
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="default"
                  size="icon"
                  className="bg-appBlue h-10 w-10 rounded-full"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
};
