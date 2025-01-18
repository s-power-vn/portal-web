import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Button, showModal } from '@minhdtb/storeo-theme';

import { SendRequestForm } from '../send-request-form';

export type A1fButtonProps = {
  request: RequestData | null;
};

export const A1fButton: FC<A1fButtonProps> = ({ request }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    showModal({
      title: 'Chuyển phó giám đốc',
      className: 'flex min-w-[400px] flex-col',
      children: ({ close }) => (
        <SendRequestForm
          status={RequestStatusOptions.A1F}
          request={request}
          title={'Phó giám đốc'}
          condition={'role = 2'}
          onSuccess={() => {
            close();
            router.history.back();
          }}
          onCancel={close}
        />
      )
    });
  }, [request, router.history]);

  return <Button onClick={handleClick}>Chuyển phó giám đốc</Button>;
};
