import { useRouterState } from '@tanstack/react-router';
import _ from 'lodash';
import { LucideHome } from 'lucide-react';

import { Fragment } from 'react';

import { Show } from '@storeo/core';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@storeo/theme';

import { HeaderMenu } from './header-menu';

const Logo = () => (
  <img
    src={'https://s-power.vn/wp-content/uploads/2021/04/spower-non-bg-1.png'}
    className={`h-9 w-20`}
    alt="logo"
  />
);

export const Header = () => {
  const matches = useRouterState({ select: s => s.matches });

  // const breadcrumbs = _.chain(
  //   matches.map(match => {
  //     const { routeContext } = match;
  //     return {
  //       title: (routeContext as { title: string }).title,
  //       path: match.pathname
  //     };
  //   })
  // )
  //   .groupBy('title')
  //   .map(values => {
  //     return _.chain(values)
  //       .groupBy('path')
  //       .map(values => values[0])
  //       .value()[0];
  //   })
  //   .value();

  return (
    <div className={'flex w-full justify-between px-2 py-1 shadow'}>
      <div className={'flex items-center justify-center gap-4'}>
        <Logo />
        {/*<Breadcrumb>*/}
        {/*  <BreadcrumbList>*/}
        {/*    {breadcrumbs.map((it, index) => (*/}
        {/*      <Fragment key={it.path}>*/}
        {/*        <BreadcrumbItem>*/}
        {/*          <Show*/}
        {/*            when={index === breadcrumbs.length - 1}*/}
        {/*            fallback={*/}
        {/*              <BreadcrumbLink href={it.path}>*/}
        {/*                <Show when={it.path === '/'} fallback={it.title}>*/}
        {/*                  <LucideHome width={20} height={20} />*/}
        {/*                </Show>*/}
        {/*              </BreadcrumbLink>*/}
        {/*            }*/}
        {/*          >*/}
        {/*            <BreadcrumbPage>{it.title}</BreadcrumbPage>*/}
        {/*          </Show>*/}
        {/*        </BreadcrumbItem>*/}
        {/*        <Show when={index !== breadcrumbs.length - 1}>*/}
        {/*          <BreadcrumbSeparator />*/}
        {/*        </Show>*/}
        {/*      </Fragment>*/}
        {/*    ))}*/}
        {/*  </BreadcrumbList>*/}
        {/*</Breadcrumb>*/}
      </div>
      <HeaderMenu />
    </div>
  );
};
