import { useRouter } from '@tanstack/react-router';
import { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import { FC, useCallback, useRef } from 'react';

import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';


export type A3fButtonProps = {
  request: RequestData;
};

export const A3fButton: FC<A3fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển NV.Phòng kỹ thuật',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A3F}
          request={request}
          title={'NV.Phòng kỹ thuật'}
          condition={'role = 4 && department.code = "KTh"'}
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

  return <Button onClick={handleClick}>Chuyển NV.Phòng kỹ thuật</Button>;
};
