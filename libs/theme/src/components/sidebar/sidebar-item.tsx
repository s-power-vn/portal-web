import {
  Link,
  RegisteredRouter,
  ToPathOption,
  useRouter
} from '@tanstack/react-router';

import { FC, HTMLAttributes, ReactNode, useMemo } from 'react';

import { Show, cn } from '@storeo/core';

import { useLink } from '../../hooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useSidebar } from './sidebar';

export type SidebarItemProps<
  TRouteTree extends RegisteredRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string | undefined = undefined
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
  padding,
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
          `flex h-10 w-10 items-center justify-center`,
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
          `flex w-full items-center justify-start truncate whitespace-nowrap text-sm`,
          isActive &&
            `bg-appBlueLight text-appWhite after:bg-appBlue after:absolute after:bottom-0 after:left-0 after:top-0 after:z-20 after:w-1`
        )}
        to={to}
        style={{
          paddingLeft: padding
        }}
      >
        {icon &&
          (collapsed ? (
            <Tooltip>
              <TooltipTrigger>
                <Show when={!!badge}>
                  <div
                    className={cn(
                      `absolute left-2 top-2 transition-opacity`,
                      collapsed ? `opacity-100` : 'w-0 opacity-0 '
                    )}
                  >
                    {badge}
                  </div>
                </Show>
                {iconElement}
              </TooltipTrigger>
              <TooltipContent side={'right'} className={'font-normal'}>
                {routeContext?.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            iconElement
          ))}
        <div
          className={cn(
            `duration-default flex-1 justify-between truncate transition-opacity`,
            collapsed && `w-0 opacity-0`
          )}
        >
          {routeContext?.title}
        </div>
        <Show when={!!badge}>
          <div
            className={cn(`transition-opacity`, collapsed && `w-0 opacity-0`)}
          >
            {badge}
          </div>
        </Show>
      </Link>
    </div>
  );
};
