import { useQueryClient } from '@tanstack/react-query';

import { FC, useCallback } from 'react';

import { RequestStatusOptions, client } from '@storeo/core';
import { Button, success, useConfirm } from '@storeo/theme';

import { RequestData, requestApi } from '../../../../../api';

export type A7ButtonProps = {
  request: RequestData;
  onSuccess?: () => void;
};

export const A7Button: FC<A7ButtonProps> = ({ request, onSuccess }) => {
  const queryClient = useQueryClient();
  const updateRequest = requestApi.updateStatus.useMutation({
    onSuccess: async () => {
      success('Cập nhật thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.userInfo.getKey()
        })
      ]);
      onSuccess?.();
    }
  });

  const { confirm } = useConfirm();

  const handleClick = useCallback(() => {
    confirm('Bạn có chắc chắn muốn kết thúc yêu cầu này?', () => {
      updateRequest.mutate({
        note: 'Kết thúc',
        status: RequestStatusOptions.A7,
        assignee: client.authStore.model?.id,
        id: request.id
      });
    });
  }, [confirm, request.id, updateRequest]);

  return <Button onClick={handleClick}>Kết thúc</Button>;
};
