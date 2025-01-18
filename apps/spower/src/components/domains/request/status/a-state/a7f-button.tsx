import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Button, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';

export type A7ButtonProps = {
  request: RequestData | null;
};

export const A7fButton: FC<A7ButtonProps> = ({ request }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    showModal({
      title: 'Chuyển tiếp',
      className: 'flex min-w-[400px] flex-col',
      children: ({ close }) => (
        <SendRequestForm
          status={RequestStatusOptions.A7F}
          request={request}
          title={'Chuyển tiếp'}
          condition={'(role = 3 && department.code = "KH") || role = 1'}
          onSuccess={() => {
            close();
            router.history.back();
          }}
          onCancel={close}
        />
      )
    });
  }, [request, router.history]);

  return <Button onClick={handleClick}>Chuyển tiếp</Button>;
};
