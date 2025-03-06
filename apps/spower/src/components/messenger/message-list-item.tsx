import { MsgMessage } from 'portal-api';

import { FC, useCallback } from 'react';

import { cn } from '@minhdtb/storeo-core';

import { formatMessageTime } from './utils';

export type MessageListItemProps = {
  message: MsgMessage;
  isCurrentUser: boolean;
  previousMessage?: MsgMessage;
};

export const MessageListItem: FC<MessageListItemProps> = ({
  message,
  isCurrentUser,
  previousMessage
}) => {
  const shouldShowTimestamp = useCallback(() => {
    if (!previousMessage) return true;

    const currentMessageTime = new Date(message.created);
    const previousMessageTime = new Date(previousMessage.created);

    const diffInMinutes =
      (currentMessageTime.getTime() - previousMessageTime.getTime()) /
      (1000 * 60);

    return diffInMinutes > 1;
  }, [message.created, previousMessage]);

  const isCloseMessage = useCallback(() => {
    if (!previousMessage) return false;
    if (previousMessage.sender !== message.sender) return false;

    const currentMessageTime = new Date(message.created);
    const previousMessageTime = new Date(previousMessage.created);

    const diffInMinutes =
      (currentMessageTime.getTime() - previousMessageTime.getTime()) /
      (1000 * 60);

    return diffInMinutes <= 1;
  }, [message.created, message.sender, previousMessage]);

  return (
    <div className="flex w-full flex-col text-sm">
      {shouldShowTimestamp() && (
        <div
          className={cn(
            'mb-0.5 text-xs text-gray-500',
            isCurrentUser ? 'pr-1 text-right' : 'pl-1 text-left'
          )}
        >
          {formatMessageTime(new Date(message.created), true)}
        </div>
      )}
      <div
        className={cn(
          'flex w-full',
          isCurrentUser ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-[75%] rounded-lg px-4 py-1.5',
            isCloseMessage() ? 'rounded-t-md' : '',
            isCurrentUser
              ? 'bg-appBlue text-white'
              : 'border border-gray-200 bg-gray-100 text-gray-800'
          )}
        >
          <div>{message.content}</div>
        </div>
      </div>
    </div>
  );
};
