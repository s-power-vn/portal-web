import { useRouter } from '@tanstack/react-router';
import type { RequestData } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Button, showModal } from '@minhdtb/storeo-theme';

import { ReturnRequestForm } from '../return-request-form';

export type A3rButtonProps = {
  request: RequestData | null;
};

export const A3rButton: FC<A3rButtonProps> = ({ request }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    showModal({
      title: 'Hoàn thành',
      className: 'flex min-w-[400px] flex-col',
      children: ({ close }) => (
        <ReturnRequestForm
          status={RequestStatusOptions.A3R}
          request={request}
          onSuccess={() => {
            close();
            router.history.back();
          }}
          onCancel={close}
        />
      )
    });
  }, [request, router.history]);

  return <Button onClick={handleClick}>Hoàn thành</Button>;
};
