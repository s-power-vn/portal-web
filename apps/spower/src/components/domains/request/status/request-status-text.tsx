import type { FC } from 'react';

import { Switch } from '@minhdtb/storeo-core';

export type RequestStatusTextProps = {
  status: string;
};

export const RequestStatusText: FC<RequestStatusTextProps> = props => {
  return (
    <Switch>
      <></>
    </Switch>
  );
};
