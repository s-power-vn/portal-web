import { FC } from 'react';

import { Button } from '@storeo/theme';

export type MultipleFileSelectProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
};

export const MultipleFileSelect: FC<MultipleFileSelectProps> = props => {
  return (
    <div
      className={
        'border-appBlue flex h-20 w-full items-center justify-center rounded-lg border border-dashed'
      }
    >
      <Button className={'rounded-lg p-2 text-xs'}>Tải lên</Button>
    </div>
  );
};
