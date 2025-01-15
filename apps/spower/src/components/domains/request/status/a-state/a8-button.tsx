import { RequestData, api } from 'portal-api';
import { RequestStatusOptions, client } from 'portal-core';

import { FC, useCallback } from 'react';

import { Button, success, useConfirm } from '@minhdtb/storeo-theme';

export type A8ButtonProps = {
  request: RequestData | null;
  onSuccess?: () => void;
};

export const A8Button: FC<A8ButtonProps> = ({ request, onSuccess }) => {
  const updateRequest = api.request.updateStatus.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      onSuccess?.();
    }
  });

  const { confirm } = useConfirm();

  const handleClick = useCallback(() => {
    confirm('Bạn có chắc chắn muốn kết thúc yêu cầu này?', () => {
      if (request) {
        updateRequest.mutate({
          note: 'Kết thúc',
          status: RequestStatusOptions.A8,
          assignee: client.authStore.model?.id,
          id: request.id
        });
      }
    });
  }, [confirm, request, updateRequest]);

  return <Button onClick={handleClick}>Kết thúc</Button>;
};
