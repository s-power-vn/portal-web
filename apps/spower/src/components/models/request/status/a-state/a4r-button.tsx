import { useRouter } from '@tanstack/react-router';
import { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import { FC, useCallback, useRef } from 'react';

import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import { ReturnRequestForm } from '../return-request-form';


export type A4rButtonProps = {
  request: RequestData;
};

export const A4rButton: FC<A4rButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển trả lại',
      description: 'Công việc chưa hoàn thành, có vấn đề cần xử lý thêm',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <ReturnRequestForm
          status={RequestStatusOptions.A4R}
          request={request}
          onSuccess={() => {
            if (modalId.current) {
              closeModal(modalId.current);
            }
            router.history.back();
          }}
          onCancel={() => {
            if (modalId.current) {
              closeModal(modalId.current);
            }
          }}
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
