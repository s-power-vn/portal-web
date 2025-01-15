import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { api } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback, useRef } from 'react';

import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';

export type A5fButtonProps = {
  request: RequestData | null;
};

export const A5fButton: FC<A5fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển NV.Phòng kế hoạch',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A5F}
          request={request}
          title={'NV.Phòng kế hoạch'}
          condition={'role = 4 && department.code = "KH"'}
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

  return <Button onClick={handleClick}>Chuyển NV.Phòng kế hoạch</Button>;
};
