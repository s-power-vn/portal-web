import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Button, showModal } from '@minhdtb/storeo-theme';

import { ReturnRequestForm } from '../return-request-form';

export type A1rButtonProps = {
  request: RequestData | null;
};

export const A1rButton: FC<A1rButtonProps> = ({ request }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    showModal({
      title: 'Chuyển trả lại',
      description: 'Công việc chưa hoàn thành, có vấn đề cần xử lý thêm',
      className: 'flex min-w-[400px] flex-col',
      children: ({ close }) => (
        <ReturnRequestForm
          status={RequestStatusOptions.A1R}
          request={request}
          onSuccess={() => {
            close();
            router.history.back();
          }}
          onCancel={close}
        />
      )
    });
  }, [request, router.history]);

  return (
    <Button variant={'destructive'} onClick={handleClick}>
      Chuyển trả lại
    </Button>
  );
};
