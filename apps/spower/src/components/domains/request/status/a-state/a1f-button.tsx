import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback, useRef } from 'react';

import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';

export type A1fButtonProps = {
  request: RequestData | null;
};

export const A1fButton: FC<A1fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển phó giám đốc',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <SendRequestForm
          status={RequestStatusOptions.A1F}
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
