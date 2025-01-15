import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { api } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback, useRef } from 'react';

import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import { ReturnRequestForm } from '../return-request-form';

export type A5rButtonProps = {
  request: RequestData | null;
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
