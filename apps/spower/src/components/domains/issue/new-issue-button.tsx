import {
  DollarSignIcon,
  FileTextIcon,
  PlusIcon,
  ShoppingCartIcon
} from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import { useCallback } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  showModal
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import { NewPriceRequestForm } from '../price/new-price-request-form';
import { NewRequestForm } from '../request/new-request-form';

export type NewIssueButtonProps = {
  projectId: string;
};

export const NewIssueButton: FC<NewIssueButtonProps> = ({ projectId }) => {
  const invalidates = useInvalidateQueries();

  const handleNewRequestClick = useCallback(() => {
    showModal({
      title: 'Tạo yêu cầu mua hàng',
      className: 'flex min-w-[1000px] flex-col',
      description:
        'Tạo yêu cầu mua hàng mới. Cho phép chọn từ danh sách hạng mục',
      children: ({ close }) => {
        return (
          <NewRequestForm
            projectId={projectId}
            onSuccess={async () => {
              await invalidates([
                api.issue.list.getKey({
                  projectId
                }),
                api.issue.listMine.getKey({
                  projectId
                }),
                api.issue.listRequest.getKey({
                  projectId
                })
              ]);
              close();
            }}
            onCancel={close}
          />
        );
      }
    });
  }, [invalidates, projectId]);

  const handleNewPriceRequestClick = useCallback(() => {
    showModal({
      title: 'Tạo yêu cầu đơn giá',
      className: 'flex min-w-[1000px] flex-col',
      description:
        'Tạo yêu cầu đơn giá mới. Cho phép chọn từ danh sách hạng mục',
      children: ({ close }) => {
        return <NewPriceRequestForm projectId={projectId} onSuccess={close} />;
      }
    });
  }, [projectId]);

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
        <DropdownMenuItem onClick={handleNewPriceRequestClick}>
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
