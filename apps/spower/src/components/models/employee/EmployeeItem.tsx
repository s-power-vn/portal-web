import { UserIcon } from 'lucide-react';

import { FC } from 'react';

import { UserResponse } from '@storeo/core';
import { Avatar, AvatarFallback, AvatarImage } from '@storeo/theme';

export type EmployeeItemProps = {
  data?: UserResponse;
};

export const EmployeeItem: FC<EmployeeItemProps> = ({ data }) => {
  return data ? (
    <div className={'flex items-center justify-center gap-2'}>
      <Avatar className={'h-6 w-6'}>
        <AvatarImage
          src={`http://localhost:8090/api/files/user/${data.id}/${data.avatar}`}
        />
        <AvatarFallback className={'text-sm'}>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <span>{data.name}</span>
    </div>
  ) : null;
};
