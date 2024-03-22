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
      className={cn(`hover:bg-appGrayLight relative w-full border-b`)}
      {...props}
    >
      <Link
        className={cn(
          `flex w-full items-center justify-start truncate whitespace-nowrap pl-[3px] text-sm`,
          isActive && `bg-primary text-appWhite`
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
