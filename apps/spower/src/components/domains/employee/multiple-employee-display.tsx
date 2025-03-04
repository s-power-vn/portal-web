import { useSuspenseQuery } from '@tanstack/react-query';
import { Loader, UserIcon, UsersIcon } from 'lucide-react';
import { Collections, client, getImageUrl, getUser } from 'portal-core';

import type { FC } from 'react';
import { Fragment, Suspense, useMemo, useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@minhdtb/storeo-theme';

// Helper component to display a single employee
const EmployeeItem = ({ employeeId }: { employeeId: string }) => {
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
      <span className={'truncate'}>{query.data.name}</span>
    </div>
  ) : null;
};

export type MultipleEmployeeDisplayProps = {
  assigneeIds?: string[];
  issueAssignData?: any[]; // Maintaining for backward compatibility
  maxVisible?: number;
};

const Component = ({
  assigneeIds = [],
  issueAssignData = [],
  maxVisible = 1
}: MultipleEmployeeDisplayProps) => {
  // Use assigneeIds if provided, otherwise extract from issueAssignData for backward compatibility
  const userIds =
    assigneeIds.length > 0
      ? assigneeIds
      : issueAssignData
          .map(item => item.expand?.assign?.id || '')
          .filter(Boolean);

  const [showAll, setShowAll] = useState(false);
  const totalAssignees = userIds.length;
  const visibleAssignees = showAll
    ? totalAssignees
    : Math.min(maxVisible, totalAssignees);
  const hasMoreAssignees = totalAssignees > visibleAssignees;

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

  if (totalAssignees === 0) {
    return (
      <div className="text-muted-foreground text-xs italic">
        Chưa có người được phân công
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {sortedUserIds.slice(0, visibleAssignees).map((userId, index) => (
        <Fragment key={userId}>
          <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
            <EmployeeItem employeeId={userId} />
          </Suspense>
        </Fragment>
      ))}

      {hasMoreAssignees && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAll(!showAll);
                }}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
              >
                <UsersIcon className="h-3 w-3" />
                <span>
                  {showAll
                    ? 'Thu gọn'
                    : `+${totalAssignees - visibleAssignees} người khác`}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {!showAll && (
                <div className="flex flex-col gap-1">
                  {sortedUserIds.slice(visibleAssignees).map(userId => (
                    <Suspense key={userId} fallback={<div>Loading...</div>}>
                      <EmployeeItem employeeId={userId} />
                    </Suspense>
                  ))}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export const MultipleEmployeeDisplay: FC<
  MultipleEmployeeDisplayProps
> = props => {
  // Check if we have either assigneeIds or issueAssignData
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
