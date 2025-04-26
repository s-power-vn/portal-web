import { CalendarIcon, Loader } from 'lucide-react';
import { issueCommentApi } from 'portal-api';
import { Collections, getImageUrl } from 'portal-core';

import type { FC } from 'react';
import { Suspense } from 'react';

import { timeSince } from '@minhdtb/storeo-core';
import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

export type IssueCommentProps = {
  issueId: string;
};

const CommentComponent: FC<IssueCommentProps> = props => {
  const comments = issueCommentApi.list.useSuspenseQuery({
    variables: props.issueId
  });

  return comments.data && comments.data.length > 0 ? (
    <div className={'flex flex-col gap-2 border-t'}>
      <div className={'flex flex-col gap-2'}>
        {comments.data.map(it => (
          <div className={'flex border-b p-2 last:border-b-0'} key={it.id}>
            <div className={'flex flex-col pr-3'}>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={getImageUrl(
                    Collections.User,
                    it.createdBy.id,
                    it.createdBy.user?.avatar
                  )}
                />
                <AvatarFallback className={'text-sm'}>
                  {it.createdBy.name.split(' ')[0][0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={'flex flex-col gap-1'}>
              <div className={'flex items-center gap-2'}>
                <div className={'text-sm font-bold'}>
                  {it.createdBy.user?.name}
                </div>
                <div
                  className={'flex items-center gap-1 text-xs text-gray-500'}
                >
                  <CalendarIcon className={'h-3 w-3'} />
                  {timeSince(new Date(Date.parse(it.created)))}
                </div>
              </div>
              <div className={'text-sm'}>{it.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export const IssueComment: FC<IssueCommentProps> = props => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center pt-4">
          <Loader className={'h-4 w-4 animate-spin'} />
        </div>
      }
    >
      <CommentComponent {...props} />
    </Suspense>
  );
};
