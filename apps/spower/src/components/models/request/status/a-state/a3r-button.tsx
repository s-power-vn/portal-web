import { useRouter } from '@tanstack/react-router';

import { FC, useCallback, useRef } from 'react';

import { RequestStatusOptions } from '@storeo/core';
import { SubmitButton, closeModal, showModal } from '@storeo/theme';

import { RequestData } from '../../../../../api';
import { ReturnRequestForm } from '../return-request-form';

export type A3rButtonProps = {
  request: RequestData;
};

export const A3rButton: FC<A3rButtonProps> = ({ request }) => {
  const router = useRouter();
  const modalId = useRef<string | undefined>();

  const handleClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Hoàn thành',
      className: 'flex min-w-[400px] flex-col',
      children: (
        <ReturnRequestForm
          status={RequestStatusOptions.A3R}
          request={request}
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

  return <SubmitButton onClick={handleClick}>Hoàn thành</SubmitButton>;
};
