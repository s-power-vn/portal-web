import {
  AnyRoute,
  Link,
  RegisteredRouter,
  RoutePaths,
  ToPathOption,
  useRouter
} from '@tanstack/react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';

import {
  Children,
  FC,
  HTMLAttributes,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo
} from 'react';

import { Show, cn } from '@storeo/core';

import { useLink } from '../../hooks';
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

  const childrenWithProps = useCallback(
    (padding: number) =>
      Children.map(children, child => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            isChild: true,
            padding
          } as {
            isChild: boolean;
          });
        }
        return child;
      }),
    [children]
  );

  console.log('to', to);
  console.log('isActive', isActive);

  const link = useMemo(
    () => (
      <Link
        className={cn(
          `hover:bg-appGrayLight flex w-full items-center justify-between
          truncate whitespace-nowrap border-b px-1 text-sm`
        )}
        to={to}
      >
        <div className={'flex items-center'}>
          <Show when={icon}>
            <div className={cn(`flex h-10 w-10 items-center justify-center`)}>
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
        </div>
        <Show
          when={isActive}
          fallback={
            <ChevronUp
              className={cn(
                `duration-default w-4 transition-opacity`,
                collapsed && `w-0 opacity-0`
              )}
            />
          }
        >
          <ChevronDown
            className={cn(
              `duration-default w-4 transition-opacity`,
              collapsed && `w-0 opacity-0`
            )}
          />
        </Show>
      </Link>
    ),
    [to, icon, collapsed, routeContext?.title, isActive]
  );

  return (
    <div {...props}>
      {link}
      <Show when={isActive}>
        <div
          className={cn(
            `bg-appGrayLight relative after:absolute after:bottom-0 after:left-0 after:top-0 after:w-1`,
            isActive && `after:bg-appGray`
          )}
        >
          {childrenWithProps(collapsed ? 3 : 20)}
        </div>
      </Show>
    </div>
  );
};
