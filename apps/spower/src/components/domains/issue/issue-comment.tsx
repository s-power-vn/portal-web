import { CalendarIcon } from 'lucide-react';
import { api } from 'portal-api';
import { Collections, getImageUrl } from 'portal-core';

import type { FC } from 'react';
import React from 'react';

import { timeSince } from '@minhdtb/storeo-core';
import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

import { IssueStatusText } from './issue-status-text';

export type IssueCommentProps = {
  issueId: string;
};

export const IssueComment: FC<IssueCommentProps> = props => {
  const comments = api.comment.list.useSuspenseQuery({
    variables: props.issueId
  });

  return (
    <div className={'flex flex-col gap-2 pt-4'}>
      <div className={'flex flex-col gap-2'}>
        {comments.data && comments.data.length > 0
          ? comments.data.map(it => (
              <div className={'relative flex border-b p-2'} key={it.id}>
                <div className={'flex flex-col pr-3'}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getImageUrl(
                        Collections.User,
                        it.expand.createdBy.id,
                        it.expand.createdBy.avatar
                      )}
                    />
                    <AvatarFallback className={'text-sm'}>
                      {it.expand.createdBy.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className={'flex flex-col gap-1'}>
                  <div className={'flex items-center gap-2'}>
                    <div className={'text-sm font-bold'}>
                      {it.expand.createdBy.name}
                    </div>
                    <div
                      className={
                        'flex items-center gap-1 text-xs text-gray-500'
                      }
                    >
                      <CalendarIcon className={'h-3 w-3'} />
                      {timeSince(new Date(Date.parse(it.created)))}
                    </div>
                    <IssueStatusText status={it.status} />
                  </div>
                  <div className={'text-sm'}>{it.content}</div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};
