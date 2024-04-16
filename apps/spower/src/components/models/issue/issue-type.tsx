import { FC } from 'react';

import { IssueTypeOptions } from '@storeo/core';

export type IssueTypeProps = {
  type: IssueTypeOptions;
};

export const IssueType: FC<IssueTypeProps> = ({ type }) => {
  if (type === IssueTypeOptions.Request) {
    return (
      <div className="flex items-center justify-center rounded-full bg-orange-600 py-1 text-xs text-white shadow">
        Yêu cầu mua hàng
      </div>
    );
  } else if (type === IssueTypeOptions.Contract) {
    return (
      <div className="flex items-center justify-center rounded-full bg-blue-500 py-1 text-xs text-white shadow">
        Hợp đồng
      </div>
    );
  }

  return null;
};
