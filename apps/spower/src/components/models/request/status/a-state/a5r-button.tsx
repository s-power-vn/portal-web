import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';
import { useRouter } from '@tanstack/react-router';
import { RequestStatusOptions } from 'portal-core';

import { FC, useCallback, useRef } from 'react';

import { RequestData } from '../../../../../api';
import { ReturnRequestForm } from '../return-request-form';

export type A5rButtonProps = {
  request: RequestData;
};

export const A5rButton: FC<A5rButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Hoàn thành',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <ReturnRequestForm
          status={RequestStatusOptions.A5R}
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

  return <Button onClick={handleClick}>Hoàn thành</Button>;
};
