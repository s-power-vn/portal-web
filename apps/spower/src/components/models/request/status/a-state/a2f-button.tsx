import { useRouter } from '@tanstack/react-router';

import { FC, useCallback, useRef } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { Button, closeModal, showModal } from '@storeo/theme';

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
      title: 'Chuyển trưởng phòng kỹ thuật',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A2F}
          request={request}
          title={'Trưởng phòng kỹ thuật'}
          condition={'role = 3'}
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

  return <Button onClick={handleClick}>Chuyển trưởng phòng KT</Button>;
};
