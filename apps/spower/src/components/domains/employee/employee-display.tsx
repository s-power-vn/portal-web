import { useSuspenseQuery } from '@tanstack/react-query';
import { Loader, UserIcon } from 'lucide-react';
import { Collections, client, getImageUrl } from 'portal-core';

import type { FC } from 'react';
import { Suspense } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@minhdtb/storeo-theme';

const Component = ({ employeeId }: { employeeId: string }) => {
  const query = useSuspenseQuery({
    queryKey: ['getEmployee', employeeId],
    queryFn: () => client.collection('user').getOne(employeeId)
  });

  return query.data ? (
    <div className={'flex items-center gap-2 whitespace-nowrap'}>
      <Avatar className={'h-6 w-6'}>
        <AvatarImage
          src={getImageUrl(Collections.User, query.data.id, query.data.avatar)}
        />
        <AvatarFallback className={'text-sm'}>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <span>{query.data.name}</span>
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
