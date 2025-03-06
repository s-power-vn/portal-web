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
