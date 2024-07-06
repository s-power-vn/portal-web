import { useRouter } from '@tanstack/react-router';

import { FC, useCallback, useRef } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { Button, closeModal, showModal } from '@storeo/theme';

import { RequestData } from '../../../../../api';
import { ReturnRequestForm } from '../return-request-form';

export type A1rButtonProps = {
  request: RequestData;
};

export const A1rButton: FC<A1rButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển trả lại',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <ReturnRequestForm
          status={RequestStatusOptions.A1R}
          request={request}
          onSuccess={() => {
            if (modalId.current) {
              closeModal(modalId.current);
            }
            router.history.back();
          }}
        />
      )
    });
  }, [request, router.history]);

  return <Button onClick={handleClick}>Chuyển trả lại</Button>;
};
