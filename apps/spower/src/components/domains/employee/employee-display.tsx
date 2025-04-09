import { Loader, UserIcon } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import { Suspense } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

const Component = ({ employeeId }: { employeeId: string }) => {
  const { data: user } = api.user.byId.useSuspenseQuery({
    variables: employeeId
  });

  return user ? (
    <div className={'flex items-center gap-2 whitespace-nowrap'}>
      <Avatar className={'h-5 w-5'}>
        <AvatarImage src={user.avatar} />
        <AvatarFallback className={'text-sm'}>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <span className={'truncate'}>{user.name}</span>
    </div>
  ) : null;
};

export type EmployeeDisplayProps = {
  employeeId?: string;
};

export const EmployeeDisplay: FC<EmployeeDisplayProps> = ({ employeeId }) => {
  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      {employeeId ? <Component employeeId={employeeId} /> : null}
    </Suspense>
  );
};
