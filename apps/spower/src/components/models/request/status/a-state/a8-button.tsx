import { FC, useCallback } from 'react';

import { RequestStatusOptions, client } from '@storeo/core';
import { Button, success, useConfirm } from '@storeo/theme';

import { RequestData, requestApi } from '../../../../../api';

export type A8ButtonProps = {
  request: RequestData;
  onSuccess?: () => void;
};

export const A8Button: FC<A8ButtonProps> = ({ request, onSuccess }) => {
  const updateRequest = requestApi.updateStatus.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      onSuccess?.();
    }
  });

  const { confirm } = useConfirm();

  const handleClick = useCallback(() => {
    confirm('Bạn có chắc chắn muốn kết thúc yêu cầu này?', () => {
      updateRequest.mutate({
        note: 'Kết thúc',
        status: RequestStatusOptions.A8,
        assignee: client.authStore.model?.id,
        id: request.id
      });
    });
  }, [confirm, request.id, updateRequest]);

  return <Button onClick={handleClick}>Kết thúc</Button>;
};
