import { RequestData, requestApi } from 'portal-api';
import { RequestStatusOptions, client } from 'portal-core';

import { FC, useCallback } from 'react';

import { Button, success } from '@minhdtb/storeo-theme';

export type A8rButtonProps = {
  request: RequestData | null;
  onSuccess?: () => void;
};

export const A8rButton: FC<A8rButtonProps> = ({ request, onSuccess }) => {
  const updateRequest = requestApi.updateStatus.useMutation({
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
