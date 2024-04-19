import { PlusIcon } from 'lucide-react';

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
            Yêu cầu mua hàng
          </DropdownMenuItem>
          <DropdownMenuItem>Hợp đồng</DropdownMenuItem>
          <DropdownMenuItem>Tạm ứng</DropdownMenuItem>
          <DropdownMenuItem>Biên bản bàn giao</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
