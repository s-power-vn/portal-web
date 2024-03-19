import {
  AnyRoute,
  Link,
  RegisteredRouter,
  RoutePaths,
  ToPathOption
} from '@tanstack/react-router';

import { FC, HTMLAttributes, ReactNode, useMemo } from 'react';

import { cn, useLink } from '@storeo/core';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useSideBar } from './SideBar';

export type SideBarItemProps<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = ''
> = {
  to?: ToPathOption<TRouteTree, TFrom, TTo>;
  title?: string;
  icon?: ReactNode;
  isChild?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export const SideBarItem: FC<SideBarItemProps> = ({
  to,
  title,
  icon,
  isChild,
  ...props
}) => {
  const { isActive } = useLink({ to });
  const { collapsed } = useSideBar();

  const iconElement = useMemo(
    () => (
      <div
        className={cn(
          `flex h-10 w-10 items-center justify-center p-2`,
          isChild && `p-3`
        )}
      >
        {icon}
      </div>
    ),
    [icon, isChild]
  );

  return (
    <div
      className={cn(
        `relative w-full`,
        isActive &&
          `before:bg-appBlue before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5`
      )}
      {...props}
    >
      <Link
        className={cn(
          `hover:bg-appGray flex w-full items-center justify-start truncate whitespace-nowrap text-sm`,
          isActive && `bg-appGray font-bold`
        )}
        to={to}
      >
        {icon &&
          (collapsed ? (
            <Tooltip>
              <TooltipTrigger>{iconElement}</TooltipTrigger>
              <TooltipContent
                side={'right'}
                arrowPadding={5}
                className={'font-normal'}
              >
                {title}
              </TooltipContent>
            </Tooltip>
          ) : (
            iconElement
          ))}
        <div
          className={cn(
            `duration-default transition-opacity`,
            collapsed && `w-0 opacity-0`
          )}
        >
          {title}
        </div>
      </Link>
    </div>
  );
};
