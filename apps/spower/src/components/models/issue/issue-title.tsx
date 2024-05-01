import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';

import React, { FC, useCallback, useState } from 'react';

import { Show, client } from '@storeo/core';
import { Button, Textarea } from '@storeo/theme';

export type IssueTitleProps = {
  title: string;
  issueId: string;
};

export const IssueTitle: FC<IssueTitleProps> = ({ title, issueId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const queryClient = useQueryClient();

  const updateTitle = useMutation({
    mutationKey: ['updateTitle', issueId],
    mutationFn: async (title: string) => {
      return await client.collection('issue').update(issueId, {
        title
      });
    },
    onSuccess: async () => {
      setIsEditing(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getRequest', issueId]
        })
      ]);
    }
  });

  const onBlur = useCallback(() => {
    setIsEditing(false);
    updateTitle.mutate(value);
  }, [updateTitle, value]);

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
      <div className={'flex items-center'}>
        <Button
          className={'flex h-4 items-center p-0 text-gray-500'}
          variant={'link'}
          onClick={() => setIsEditing(prevState => !prevState)}
        >
          <PencilIcon width={15} height={15} />
        </Button>
      </div>
    </div>
  );
};
