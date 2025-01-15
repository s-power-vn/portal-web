import type { RequestData } from 'portal-api';
import { api } from 'portal-api';
import { RequestStatusOptions, client } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Button, success } from '@minhdtb/storeo-theme';

export type A8rButtonProps = {
  request: RequestData | null;
  onSuccess?: () => void;
};

export const A8rButton: FC<A8rButtonProps> = ({ request, onSuccess }) => {
  const updateRequest = api.request.updateStatus.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      onSuccess?.();
    }
  });

  const handleClick = useCallback(() => {
    if (request) {
      updateRequest.mutate({
        note: 'Hủy kết thúc',
        status: RequestStatusOptions.A8R,
        assignee: client.authStore.model?.id,
        id: request.id
      });
    }
  }, [request, updateRequest]);

  return <Button onClick={handleClick}>Hủy kết thúc</Button>;
};
