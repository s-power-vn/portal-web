import { FC } from 'react';

export type DocumentStatusProps = {
  value: 'ToDo' | 'Done';
};

export const DocumentStatus: FC<DocumentStatusProps> = ({ value }) => {
  if (value === 'ToDo') {
    return (
      <div
        className={`text-appBlack flex h-0 select-none items-center
          justify-center whitespace-nowrap rounded-full bg-orange-300 px-2 py-3 text-xs`}
      >
        Đang triển khai
      </div>
    );
  } else {
    return (
      <div
        className={`text-appWhite flex h-0 select-none items-center
          justify-center rounded-full bg-green-600 px-1 py-3 text-xs`}
      >
        Hoàn thành
      </div>
    );
  }
};
