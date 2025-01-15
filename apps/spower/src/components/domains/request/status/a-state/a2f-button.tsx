import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback, useRef } from 'react';

import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';

export type A2fButtonProps = {
  request: RequestData | null;
};

export const A2fButton: FC<A2fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển T.Phòng kỹ thuật',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A2F}
          request={request}
          title={'T.Phòng kỹ thuật'}
          condition={'role = 3 && department.code = "KTh"'}
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

  return <Button onClick={handleClick}>Chuyển T.Phòng kỹ thuật</Button>;
};
