import { MoreHorizontal, PlusCircle, Send, Users } from 'lucide-react';

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

export const GroupChat: FC = () => {
  const currentUserId = 'current-user';
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      // Giả lập API call
      setTimeout(() => {
        setGroups([
          {
            id: '1',
            name: 'Nhóm Dự Án A',
            avatar: '',
            memberCount: 5,
            lastMessage: 'Khi nào chúng ta họp lại?',
            lastMessageTime: new Date().toISOString(),
            lastSender: 'Nguyễn Văn A',
            unreadCount: 3
          },
          {
            id: '2',
            name: 'Ban Quản Lý',
            avatar: '',
            memberCount: 8,
            lastMessage: 'Báo cáo tuần đã được gửi',
            lastMessageTime: new Date(
              Date.now() - 1000 * 60 * 45
            ).toISOString(), // 45 phút trước
            lastSender: 'Trần Thị B',
            unreadCount: 0
          }
        ]);
        setSelectedGroup('1');
        setIsLoading(false);
      }, 500);
    };

    fetchGroups();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      // Giả lập API call
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            senderId: 'user-1',
            senderName: 'Nguyễn Văn A',
            content: 'Khi nào chúng ta họp lại?',
            created: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 phút trước
          },
          {
            id: '2',
            senderId: 'user-2',
            senderName: 'Trần Thị B',
            content: 'Tôi nghĩ là vào thứ 5 này.',
            created: new Date(Date.now() - 1000 * 60 * 25).toISOString() // 25 phút trước
          },
          {
            id: '3',
            senderId: currentUserId,
            senderName: 'Tôi',
            content: 'Tôi đồng ý với lịch thứ 5.',
            created: new Date(Date.now() - 1000 * 60 * 20).toISOString() // 20 phút trước
          }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchMessages();
  }, [selectedGroup]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

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

  const handleCreateGroup = () => {
    // Giả lập tạo nhóm mới
    const newGroup = {
      id: `group-${Date.now()}`,
      name: 'Nhóm mới',
      avatar: '',
      memberCount: 1,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      lastSender: '',
      unreadCount: 0
    };

    setGroups(prev => [...prev, newGroup]);
    setIsNewGroupModalOpen(false);
  };

  return (
    <div className="flex h-full">
      {/* Danh sách nhóm chat */}
      <div className="flex w-1/4 flex-col border-r">
        <div className="flex items-center justify-between border-b p-3">
          <h2 className="text-sm font-semibold">Nhóm chat</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsNewGroupModalOpen(true)}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && !groups.length ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="py-2">
              {groups.map(group => (
                <div
                  key={group.id}
                  className={cn(
                    'mx-2 mb-1 cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-gray-100',
                    selectedGroup === group.id && 'bg-gray-100'
                  )}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <Avatar size="md" alt={group.name} />
                      <div className="bg-appBlue absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white">
                        <Users className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">
                          {group.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(group.lastMessageTime).toLocaleTimeString(
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
                          {group.lastSender
                            ? `${group.lastSender}: ${group.lastMessage}`
                            : group.lastMessage}
                        </p>
                        {group.unreadCount > 0 && (
                          <span className="bg-appBlue inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-medium text-white">
                            {group.unreadCount}
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
        {selectedGroup ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white p-3">
              {groups.find(g => g.id === selectedGroup) && (
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <Avatar
                      size="sm"
                      alt={groups.find(g => g.id === selectedGroup)?.name}
                    />
                    <div className="bg-appBlue absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white">
                      <Users className="h-2 w-2" />
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">
                      {groups.find(g => g.id === selectedGroup)?.name}
                    </span>
                    <div className="text-xs text-gray-500">
                      {groups.find(g => g.id === selectedGroup)?.memberCount}{' '}
                      thành viên
                    </div>
                  </div>
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
            Chọn một nhóm để bắt đầu
          </div>
        )}
      </div>

      {/* Modal tạo nhóm mới - Đây chỉ là giả lập */}
      {isNewGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Tạo nhóm mới</h3>
            <Input className="mb-4" placeholder="Tên nhóm" />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsNewGroupModalOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateGroup}>Tạo nhóm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
