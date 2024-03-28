import { PlusIcon } from '@radix-ui/react-icons';

import { FC } from 'react';

import { Button } from '@storeo/theme';

export type DocumentRequestProps = {
  documentId: string;
};

export const DocumentRequest: FC<DocumentRequestProps> = ({ documentId }) => {
  return (
    <>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'} onClick={() => {}}>
            <PlusIcon />
            Thêm yêu cầu mua hàng
          </Button>
          <Button disabled={true} className={'flex gap-1'} onClick={() => {}}>
            <PlusIcon />
            Thêm nhà cung cấp
          </Button>
        </div>
      </div>
    </>
  );
};
