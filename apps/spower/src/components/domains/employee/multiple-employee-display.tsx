import { useSuspenseQuery } from '@tanstack/react-query';
import { IssueAssignData } from 'libs/api/src/api/domain/issue';
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
  issueAssignData?: IssueAssignData[];
  maxVisible?: number;
};

const Component = ({
  issueAssignData = [],
  maxVisible = 1
}: MultipleEmployeeDisplayProps) => {
  const [showAll, setShowAll] = useState(false);
  const totalAssignees = issueAssignData.length;
  const visibleAssignees = showAll
    ? totalAssignees
    : Math.min(maxVisible, totalAssignees);
  const hasMoreAssignees = totalAssignees > visibleAssignees;

  const currentUser = getUser();

  const sortedAssignees = useMemo(() => {
    if (!currentUser) return issueAssignData;

    return [...issueAssignData].sort((a, b) => {
      const aIsCurrentUser = a.expand?.assign?.id === currentUser.id;
      const bIsCurrentUser = b.expand?.assign?.id === currentUser.id;

      if (aIsCurrentUser && !bIsCurrentUser) return -1;
      if (!aIsCurrentUser && bIsCurrentUser) return 1;
      return 0;
    });
  }, [issueAssignData, currentUser]);

  if (totalAssignees === 0) {
    return (
      <div className="text-muted-foreground text-xs italic">
        Chưa có người được phân công
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {sortedAssignees.slice(0, visibleAssignees).map((item, index) => (
        <Fragment key={item.id}>
          <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
            <EmployeeItem employeeId={item.expand?.assign?.id || ''} />
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
                  {sortedAssignees.slice(visibleAssignees).map(item => (
                    <div key={item.id}>{item.expand?.assign?.name || ''}</div>
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
  if (!props.issueAssignData || props.issueAssignData.length === 0) {
    return null;
  }

  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <Component {...props} />
    </Suspense>
  );
};
