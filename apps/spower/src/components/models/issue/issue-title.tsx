import { useQueryClient } from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';

import React, { FC, useCallback, useState } from 'react';

import { Show } from '@storeo/core';
import { Button, Textarea } from '@storeo/theme';

import { requestApi } from '../../../api';
import { issueApi } from '../../../api/issue';

export type IssueTitleProps = {
  title: string;
  issueId: string;
};

export const IssueTitle: FC<IssueTitleProps> = ({ title, issueId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const queryClient = useQueryClient();

  const updateTitle = issueApi.updateTitle.useMutation({
    onSuccess: async () => {
      setIsEditing(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueApi.byId.getKey(issueId)
        }),
        queryClient.invalidateQueries({
          queryKey: requestApi.byIssueId.getKey(issueId)
        })
      ]);
    }
  });

  const onBlur = useCallback(() => {
    setIsEditing(false);
    updateTitle.mutate({
      issueId,
      title: value
    });
  }, [issueId, updateTitle, value]);

  const onFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target?.select();
  }, []);

  return (
    <div className={'flex w-full gap-2'}>
      <Show
        when={isEditing}
        fallback={<span className={'text-base font-bold'}>{title}</span>}
      >
        <Textarea
          className={'w-full bg-white p-1 text-base font-bold'}
          value={value}
          autoFocus
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </Show>
      <Show when={!isEditing}>
        <div className={'flex items-center'}>
          <Button
            className={'flex h-4 items-center p-0 text-gray-500'}
            variant={'link'}
            onClick={() => setIsEditing(prevState => !prevState)}
          >
            <PencilIcon width={15} height={15} />
          </Button>
        </div>
      </Show>
    </div>
  );
};
