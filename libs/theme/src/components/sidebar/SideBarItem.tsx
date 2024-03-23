import {
  AnyRoute,
  Link,
  RegisteredRouter,
  RoutePaths,
  ToPathOption,
  useRouter
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
  icon?: ReactNode;
  isChild?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>;

export const SideBarItem: FC<SideBarItemProps> = ({
  to,
  icon,
  isChild,
  ...props
}) => {
  const { flatRoutes } = useRouter();
  const foundedRoute = flatRoutes.find(it => it.fullPath === to);
  const routeContext = foundedRoute?.options.beforeLoad?.({} as never) as {
    title?: string;
  };

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
                {routeContext?.title}
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
          {routeContext?.title}
        </div>
      </Link>
    </div>
  );
};
