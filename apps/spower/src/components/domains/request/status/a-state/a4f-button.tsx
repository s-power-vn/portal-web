import { useRouter } from '@tanstack/react-router';
import { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import { FC, useCallback, useRef } from 'react';

import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';


export type A4fButtonProps = {
  request: RequestData | null;
};

export const A4fButton: FC<A4fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển T.Phòng kế hoạch',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A4F}
          request={request}
          title={'T.Phòng kế hoạch'}
          condition={'role = 3 && department.code = "KH"'}
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

  return <Button onClick={handleClick}>Chuyển TP Kế hoạch</Button>;
};
