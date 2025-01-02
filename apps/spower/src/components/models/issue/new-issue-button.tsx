import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  closeModal,
  showModal
} from '@minhdtb/storeo-theme';
import { useQueryClient } from '@tanstack/react-query';
import {
  DollarSignIcon,
  FileTextIcon,
  PlusIcon,
  ShoppingCartIcon
} from 'lucide-react';

import { FC, useCallback, useRef } from 'react';

import { requestApi } from '../../../api';
import { issueApi } from '../../../api/issue';
import { NewRequestForm } from '../request/new-request-form';

export type NewIssueButtonProps = {
  projectId: string;
};

export const NewIssueButton: FC<NewIssueButtonProps> = ({ projectId }) => {
  const modalId = useRef<string | undefined>();
  const queryClient = useQueryClient();

  const onSuccessHandler = useCallback(async () => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: requestApi.listFull.getKey(projectId)
      }),
      queryClient.invalidateQueries({
        queryKey: issueApi.list.getKey({
          projectId
        })
      }),
      queryClient.invalidateQueries({
        queryKey: issueApi.listMine.getKey({
          projectId
        })
      })
    ]);
  }, [queryClient, projectId]);

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleNewRequestClick = useCallback(() => {
    modalId.current = showModal({
      title: 'Tạo yêu cầu mua hàng',
      className: 'flex min-w-[800px] flex-col',
      description:
        'Tạo yêu cầu mua hàng mới. Cho phép chọn từ danh sách hạng mục',
      children: (
        <NewRequestForm
          projectId={projectId}
          onSuccess={onSuccessHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onSuccessHandler, projectId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ThemeButton className={'flex gap-1'}>
          <PlusIcon className={'h-5 w-5'} />
          Thêm công việc
        </ThemeButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        side="bottom"
        align="start"
        sideOffset={2}
      >
        <DropdownMenuItem onClick={handleNewRequestClick}>
          <ShoppingCartIcon className="mr-2 h-4 w-4 text-red-500" />
          Yêu cầu mua hàng
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DollarSignIcon className="mr-2 h-4 w-4 text-blue-500" />
          Yêu cầu đơn giá
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileTextIcon className="mr-2 h-4 w-4 text-green-500" />
          Hợp đồng
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
