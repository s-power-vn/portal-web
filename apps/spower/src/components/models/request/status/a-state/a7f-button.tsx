import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';
import { useRouter } from '@tanstack/react-router';
import { RequestStatusOptions } from 'portal-core';

import { FC, useCallback, useRef } from 'react';

import { RequestData } from '../../../../../api';
import { SendRequestForm } from '../send-request-form';

export type A7ButtonProps = {
  request: RequestData;
};

export const A7fButton: FC<A7ButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển tiếp',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A7F}
          request={request}
          title={'Chuyển tiếp'}
          condition={'(role = 3 && department.code = "KH") || role = 1'}
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

  return <Button onClick={handleClick}>Chuyển tiếp</Button>;
};
