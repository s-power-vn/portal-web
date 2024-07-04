import { useRouter } from '@tanstack/react-router';

import { FC, useCallback, useRef } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { Button, closeModal, showModal } from '@storeo/theme';

import { RequestData } from '../../../../api';
import { ChangeRequestStatusForm } from './change-request-status-form';

export type A1fButtonProps = {
  request: RequestData;
};

export const A1fButton: FC<A1fButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Chuyển phó giám đốc',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <ChangeRequestStatusForm
          status={RequestStatusOptions.A1F}
          request={request}
          title={'Phó giám đốc'}
          onSuccess={() => {
            if (modalId.current) {
              closeModal(modalId.current);
            }
            router.history.back();
          }}
        />
      )
    });
  }, [request]);

  return <Button onClick={handleClick}>Chuyển phó giám đốc</Button>;
};
