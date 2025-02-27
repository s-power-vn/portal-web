import type { RegisteredRouter, ToPathOption } from '@tanstack/react-router';
import { Link, useRouter } from '@tanstack/react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';

import type { FC, HTMLAttributes, ReactNode } from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo
} from 'react';

import { Show, cn } from '@minhdtb/storeo-core';

import { useLink } from '../../hooks';
import { useSidebar } from './sidebar';

export type SidebarGroupProps<
  TRouteTree extends RegisteredRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string | undefined = undefined
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
  const { collapsed, expanded } = useSidebar();

  const childrenWithProps = useCallback(
    (padding: number) => {
      return Children.map(children, child => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            isChild: true,
            padding
          } as {
            isChild: boolean;
          });
        }
        return child;
      });
    },
    [children]
  );

  const link = useMemo(
    () => (
      <Link
        className={cn(
          `hover:bg-appGrayLight flex w-full items-center justify-between
           border-b text-sm`
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
              `duration-default truncate transition-opacity`,
              collapsed && `w-0 opacity-0`
            )}
          >
            {routeContext?.title}
          </div>
        </div>
        <Show when={!expanded}>
          <Show
            when={isActive}
            fallback={
              <ChevronUp
                className={cn(
                  `duration-default mr-2 w-4 transition-opacity`,
                  collapsed && `w-0 opacity-0`
                )}
              />
            }
          >
            <ChevronDown
              className={cn(
                `duration-default mr-2 w-4 transition-opacity`,
                collapsed && `w-0 opacity-0`
              )}
            />
          </Show>
        </Show>
      </Link>
    ),
    [to, icon, collapsed, routeContext?.title, isActive]
  );

  return (
    <div {...props}>
      {link}
      <Show when={isActive || expanded}>
        <div
          className={cn(
            `bg-appGrayLight relative after:absolute after:bottom-0 after:left-0 after:top-0 after:w-1`,
            isActive && `after:bg-appGray`
          )}
        >
          {childrenWithProps(collapsed ? 0 : 20)}
        </div>
      </Show>
    </div>
  );
};
