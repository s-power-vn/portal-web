import {
  AnyRoute,
  Link,
  RegisteredRouter,
  RoutePaths,
  ToPathOption,
  useRouter
} from '@tanstack/react-router';

import { FC, HTMLAttributes, ReactNode, useMemo } from 'react';

import { cn } from '@storeo/core';
import { Tooltip, TooltipContent, TooltipTrigger } from '@storeo/theme';

import { useLink } from '../../hooks';
import { useSidebar } from './sidebar';

export type SidebarItemProps<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = ''
> = {
  to?: ToPathOption<TRouteTree, TFrom, TTo>;
  icon?: ReactNode;
  isChild?: boolean;
  badge?: ReactNode;
  padding?: number;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>;

export const SidebarItem: FC<SidebarItemProps> = ({
  to,
  icon,
  isChild,
  badge,
  padding = 3,
  ...props
}) => {
  const { flatRoutes } = useRouter();
  const foundedRoute = flatRoutes.find(it => it.fullPath === to);
  const routeContext = foundedRoute?.options.beforeLoad?.({} as never) as {
    title?: string;
  };

  const { isActive } = useLink({ to });
  const { collapsed } = useSidebar();

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
          `flex w-full items-center justify-start truncate whitespace-nowrap pl-[${padding}px] text-sm`,
          isActive &&
            `bg-appBlueLight text-appWhite after:bg-appBlue after:absolute after:bottom-0 after:left-0 after:top-0 after:z-20 after:w-1`
        )}
        to={to}
      >
        {icon &&
          (collapsed ? (
            <Tooltip>
              <TooltipTrigger>{iconElement}</TooltipTrigger>
              <TooltipContent side={'right'} className={'font-normal'}>
                {routeContext?.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            iconElement
          ))}
        <div
          className={cn(
            `duration-default flex w-full justify-between pr-2 transition-opacity`,
            collapsed && `w-0 opacity-0`
          )}
        >
          {routeContext?.title}
          {badge}
        </div>
      </Link>
    </div>
  );
};
