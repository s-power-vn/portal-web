import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Button, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';

export type A2fButtonProps = {
  request: RequestData | null;
};

export const A2fButton: FC<A2fButtonProps> = ({ request }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    showModal({
      title: 'Chuyển T.Phòng kỹ thuật',
      className: 'flex min-w-[400px] flex-col',
      children: ({ close }) => (
        <SendRequestForm
          status={RequestStatusOptions.A2F}
          request={request}
          title={'T.Phòng kỹ thuật'}
          condition={'role = 3 && department.code = "KTh"'}
          onSuccess={() => {
            close();
            router.history.back();
          }}
          onCancel={close}
        />
      )
    });
  }, [request, router.history]);

  return <Button onClick={handleClick}>Chuyển T.Phòng kỹ thuật</Button>;
};
