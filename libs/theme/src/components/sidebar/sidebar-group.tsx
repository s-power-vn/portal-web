import {
  AnyRoute,
  Link,
  RegisteredRouter,
  RoutePaths,
  ToPathOption
} from '@tanstack/react-router';

import {
  Children,
  FC,
  HTMLAttributes,
  ReactNode,
  cloneElement,
  isValidElement,
  useMemo
} from 'react';

import { cn, useLink } from '@storeo/core';

import { useSidebar } from './sidebar';

export type SidebarGroupProps<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = ''
> = {
  to?: ToPathOption<TRouteTree, TFrom, TTo>;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const SidebarGroup: FC<SidebarGroupProps> = ({
  to,
  title,
  icon,
  children,
  ...props
}) => {
  const { isActive } = useLink({ to });
  const { collapsed } = useSidebar();

  const childrenWithProps = useMemo(
    () =>
      Children.map(children, child => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            isChild: true
          } as {
            isChild: boolean;
          });
        }
        return child;
      }),
    [children]
  );

  const link = useMemo(
    () => (
      <Link
        className={cn(
          `hover:bg-appGrayLight flex w-full items-center justify-start truncate whitespace-nowrap border-b pl-[3px] text-sm`,
          isActive && `bg-appGrayLight font-semibold`
        )}
        to={to}
      >
        {icon && (
          <div className={cn(`flex h-10 w-10 items-center justify-center p-2`)}>
            {icon}
          </div>
        )}
        <div
          className={cn(
            `duration-default transition-opacity`,
            collapsed && `w-0 opacity-0`
          )}
        >
          {title}
        </div>
      </Link>
    ),
    [icon, to, title, isActive, collapsed]
  );

  return (
    <div
      className={cn(
        `relative`,
        isActive &&
          `before:bg-appGray before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5`
      )}
      {...props}
    >
      {link}
      {isActive && (
        <div className={cn(isActive && `bg-appGrayLight`)}>
          {childrenWithProps}
        </div>
      )}
    </div>
  );
};
