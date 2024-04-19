import {
  DollarSignIcon,
  FileTextIcon,
  NotebookPenIcon,
  PlusIcon,
  ShoppingCartIcon
} from 'lucide-react';

import { FC, useState } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@storeo/theme';

import { NewRequestDialog } from '../request/new-request-dialog';

export type NewIssueButtonProps = {
  projectId: string;
};

export const NewIssueButton: FC<NewIssueButtonProps> = ({ projectId }) => {
  const [openRequestNew, setOpenRequestNew] = useState(false);

  return (
    <>
      <NewRequestDialog
        projectId={projectId}
        open={openRequestNew}
        setOpen={setOpenRequestNew}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={'flex gap-1'}>
            <PlusIcon />
            Thêm công việc
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side="bottom"
          align="start"
          sideOffset={2}
        >
          <DropdownMenuItem
            onClick={() => {
              setOpenRequestNew(true);
            }}
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4 text-red-500" />
            Yêu cầu mua hàng
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileTextIcon className="mr-2 h-4 w-4 text-green-500" />
            Hợp đồng
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DollarSignIcon className="mr-2 h-4 w-4 text-blue-500" />
            Tạm ứng
          </DropdownMenuItem>
          <DropdownMenuItem>
            <NotebookPenIcon className="mr-2 h-4 w-4 text-orange-500" />
            Biên bản bàn giao
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
