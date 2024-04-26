import {
  AnyRoute,
  Link,
  RegisteredRouter,
  RoutePaths,
  ToPathOption,
  useRouter
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

import { Show, cn, useLink } from '@storeo/core';

import { useSidebar } from './sidebar';

export type SidebarGroupProps<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = ''
> = {
  to?: ToPathOption<TRouteTree, TFrom, TTo>;
  icon?: ReactNode;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const SidebarGroup: FC<SidebarGroupProps> = ({
  to,
  icon,
  children,
  ...props
}) => {
  const { flatRoutes } = useRouter();
  const foundedRoute = flatRoutes.find(it => it.fullPath === to);
  const routeContext = foundedRoute?.options.beforeLoad?.({} as never) as {
    title?: string;
  };
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
          `hover:bg-appGrayLight flex w-full items-center justify-start truncate whitespace-nowrap border-b pl-[3px] text-sm`
        )}
        to={to}
      >
        <Show when={icon}>
          <div className={cn(`flex h-10 w-10 items-center justify-center p-2`)}>
            {icon}
          </div>
        </Show>
        <div
          className={cn(
            `duration-default transition-opacity`,
            collapsed && `w-0 opacity-0`
          )}
        >
          {routeContext?.title}
        </div>
      </Link>
    ),
    [icon, to, isActive, collapsed]
  );

  return (
    <div {...props}>
      {link}
      <Show when={isActive}>
        <div
          className={cn(
            `bg-appGrayLight relative`,
            isActive &&
              `after:bg-appGray after:absolute after:bottom-0 after:left-0 after:top-0 after:w-1`
          )}
        >
          {childrenWithProps}
        </div>
      </Show>
    </div>
  );
};
