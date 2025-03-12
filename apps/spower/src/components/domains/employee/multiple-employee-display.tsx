import { Loader, UserIcon, UsersIcon } from 'lucide-react';
import { api } from 'portal-api';
import { Collections, getImageUrl, getUser } from 'portal-core';

import type { FC } from 'react';
import { Suspense, useMemo } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@minhdtb/storeo-theme';

const EmployeeItem = ({ employeeId }: { employeeId: string }) => {
  const employee = api.employee.byId.useSuspenseQuery({
    variables: employeeId
  });

  return (
    <div className={'flex items-center justify-end gap-2 whitespace-nowrap'}>
      <Avatar className={'h-6 w-6'}>
        <AvatarImage
          src={getImageUrl(
            Collections.User,
            employee.data.id,
            employee.data.avatar
          )}
        />
        <AvatarFallback className={'text-sm'}>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <span className={'truncate'}>{employee.data.name}</span>
    </div>
  );
};

export type MultipleEmployeeDisplayProps = {
  assigneeIds?: string[];
  issueAssignData?: any[];
  maxVisible?: number;
};

const Component = ({
  assigneeIds = [],
  issueAssignData = [],
  maxVisible = 3
}: MultipleEmployeeDisplayProps) => {
  const userIds =
    assigneeIds.length > 0
      ? assigneeIds
      : issueAssignData
          .map(item => item.expand?.assign?.id || '')
          .filter(Boolean);

  const totalAssignees = userIds.length;
  const visibleAvatars = Math.min(maxVisible, totalAssignees);
  const hasMoreAssignees = totalAssignees > visibleAvatars;

  const currentUser = getUser();

  const sortedUserIds = useMemo(() => {
    if (!currentUser) return userIds;

    return [...userIds].sort((a, b) => {
      const aIsCurrentUser = a === currentUser.id;
      const bIsCurrentUser = b === currentUser.id;

      if (aIsCurrentUser && !bIsCurrentUser) return -1;
      if (!aIsCurrentUser && bIsCurrentUser) return 1;
      return 0;
    });
  }, [userIds, currentUser]);

  const firstUserId = sortedUserIds[0];

  if (totalAssignees === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Chưa có người được phân công
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {firstUserId && (
        <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
          <FirstEmployee employeeId={firstUserId} />
        </Suspense>
      )}
      {hasMoreAssignees && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className="ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring ml-1 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              title="Xem danh sách người được phân công"
            >
              <UsersIcon className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-[300px] overflow-y-auto"
            side="bottom"
            align="start"
            sideOffset={2}
          >
            {sortedUserIds.map(userId => (
              <DropdownMenuItem key={userId} className="py-2">
                <Suspense
                  fallback={<Loader className={'h-4 w-4 animate-spin'} />}
                >
                  <EmployeeItem employeeId={userId} />
                </Suspense>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

const FirstEmployee = ({ employeeId }: { employeeId: string }) => {
  const employee = api.employee.byId.useSuspenseQuery({
    variables: employeeId
  });

  return employee ? (
    <div className={'flex items-center gap-2 whitespace-nowrap'}>
      <Avatar className={'h-5 w-5'}>
        <AvatarImage
          src={getImageUrl(
            Collections.User,
            employee.data.id,
            employee.data.avatar
          )}
        />
        <AvatarFallback className={'text-sm'}>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <span className={'truncate'}>{employee.data.name}</span>
    </div>
  ) : null;
};

export const MultipleEmployeeDisplay: FC<
  MultipleEmployeeDisplayProps
> = props => {
  const hasAssignees =
    (props.assigneeIds && props.assigneeIds.length > 0) ||
    (props.issueAssignData && props.issueAssignData.length > 0);

  if (!hasAssignees) {
    return null;
  }

  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <Component {...props} />
    </Suspense>
  );
};
