import { useRouter } from '@tanstack/react-router';

import { FC, useCallback, useRef } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { Button, closeModal, showModal } from '@storeo/theme';

import { RequestData } from '../../../../../api';
import { SendRequestForm } from '../send-request-form';

export type A3fButtonProps = {
  request: RequestData;
};

export const A3fButton: FC<A3fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển nhân viên kỹ thuật',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A3F}
          request={request}
          title={'Nhân viên kỹ thuật'}
          condition={'role = 4 && department.id = "borwi0hynfjgp8q"'}
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

  return <Button onClick={handleClick}>Chuyển nhân viên kỹ thuật</Button>;
};