import { useRouter } from '@tanstack/react-router';

import { FC, useCallback, useRef } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { Button, closeModal, showModal } from '@storeo/theme';

import { RequestData } from '../../../../../api';
import { SendRequestForm } from '../send-request-form';

export type A6fButtonProps = {
  request: RequestData;
};

export const A6fButton: FC<A6fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển phó giám đốc',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A6F}
          request={request}
          title={'Phó giám đốc'}
          condition={'role = 2'}
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

  return <Button onClick={handleClick}>Chuyển phó giám đốc</Button>;
};
