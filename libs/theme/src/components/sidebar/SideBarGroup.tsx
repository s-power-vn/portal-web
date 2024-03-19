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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../ui/hover-card';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '../ui/navigation-menu';
import { useSideBar } from './SideBar';

export type SideBarGroupProps<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = ''
> = {
  to?: ToPathOption<TRouteTree, TFrom, TTo>;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const SideBarGroup: FC<SideBarGroupProps> = ({
  to,
  title,
  icon,
  children,
  ...props
}) => {
  const { isActive } = useLink({ to });
  const { collapsed } = useSideBar();

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
        to={to}
        className={cn(
          `hover:bg-appGray flex w-full items-center justify-start truncate whitespace-nowrap pl-[3px] text-sm`,
          isActive && `bg-appGrayLight font-semibold`
        )}
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
