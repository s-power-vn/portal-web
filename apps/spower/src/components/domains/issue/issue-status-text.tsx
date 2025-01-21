import type { FC } from 'react';

import { Switch } from '@minhdtb/storeo-core';

export type IssueStatusTextProps = {
  status: string;
};

export const IssueStatusText: FC<IssueStatusTextProps> = props => {
  return (
    <Switch>
      <></>
    </Switch>
  );
};
