import { FC } from 'react';

export type DocumentStatusProps = {
  value: 'ToDo' | 'Done';
};

export const DocumentStatus: FC<DocumentStatusProps> = ({ value }) => {
  if (value === 'ToDo') {
    return (
      <div
        className={`text-appWhite flex h-0 items-center justify-center
          rounded-full bg-orange-400 px-2 py-3 text-xs`}
      >
        Chờ xử lý
      </div>
    );
  } else {
    return (
      <div
        className={`text-appWhite flex h-0 items-center justify-center
          rounded-full bg-blue-400 px-1 py-3 text-xs`}
      >
        Hoàn thành
      </div>
    );
  }
};
