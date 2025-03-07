import { signal } from '@preact/signals-react';
import { MsgChat } from 'portal-api';
import { MsgChatTypeOptions, UserResponse } from 'portal-core';

export const scrollToBottomSignal = signal<number>(0);

export const selectedChatIdSignal = signal<string | undefined>(undefined);

export const triggerScrollToBottom = () => {
  scrollToBottomSignal.value++;
};

export const setSelectedChatId = (chatId: string) => {
  selectedChatIdSignal.value = chatId;
};

/**
 * Kiểm tra xem chat có phải là group chat hay không
 */
export const isGroupChatType = (chat?: MsgChat): boolean => {
  return chat?.type === MsgChatTypeOptions.Group;
};

/**
 * Lấy danh sách người tham gia khác (không bao gồm người dùng hiện tại)
 */
export const getOtherParticipants = (
  chat?: MsgChat,
  currentUserId?: string
): UserResponse[] => {
  if (!chat?.expand?.participants || !currentUserId) return [];

  return chat.expand.participants.filter(
    (p: UserResponse) => p.id !== currentUserId
  );
};

/**
 * Lấy người tham gia khác đầu tiên (cho private chat)
 */
export const getFirstOtherParticipant = (
  otherParticipants: UserResponse[]
): UserResponse | undefined => {
  return otherParticipants[0];
};

/**
 * Lấy danh sách tên của những người tham gia
 */
export const getParticipantNames = (participants: UserResponse[]): string => {
  return participants.map(p => p.name).join(', ');
};

/**
 * Format thời gian tin nhắn
 * @param date Thời gian cần format
 * @param includeTimeForOlderMessages Có hiển thị giờ cho tin nhắn cũ hơn không
 * @returns Chuỗi thời gian đã được format
 */
export const formatMessageTime = (
  date: Date,
  includeTimeForOlderMessages = false
): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const timeString = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (messageDate.getTime() === today.getTime()) {
    return timeString;
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return includeTimeForOlderMessages ? `Hôm qua ${timeString}` : 'Hôm qua';
  } else {
    return includeTimeForOlderMessages
      ? `${date.getDate()}/${date.getMonth() + 1} ${timeString}`
      : `${date.getDate()}/${date.getMonth() + 1}`;
  }
};
