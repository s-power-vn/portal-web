import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';
import { useRouter } from '@tanstack/react-router';
import { RequestStatusOptions } from 'portal-core';

import { FC, useCallback, useRef } from 'react';

import { RequestData } from '../../../../../api';
import { SendRequestForm } from '../send-request-form';

export type A2fButtonProps = {
  request: RequestData;
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
