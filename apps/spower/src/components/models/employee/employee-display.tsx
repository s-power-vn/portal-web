import { useSuspenseQuery } from '@tanstack/react-query';
import { UserIcon } from 'lucide-react';

import { FC, Suspense } from 'react';

import { client } from '@storeo/core';
import { Avatar, AvatarFallback, AvatarImage } from '@storeo/theme';

const Component = ({ employeeId }: { employeeId: string }) => {
  const query = useSuspenseQuery({
    queryKey: ['getEmployee', employeeId],
    queryFn: () => client.collection('user').getOne(employeeId)
  });

  return query.data ? (
    <div className={'flex items-center justify-center gap-2 whitespace-nowrap'}>
      <Avatar className={'h-6 w-6'}>
        <AvatarImage
          src={`http://localhost:8090/api/files/user/${query.data.id}/${query.data.avatar}`}
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
    <Suspense fallback={'...'}>
      {employeeId ? <Component employeeId={employeeId} /> : null}
    </Suspense>
  );
};
