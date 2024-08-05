import { useRouterState } from '@tanstack/react-router';
import _ from 'lodash';
import { HomeIcon } from 'lucide-react';

import { FC, useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { Show } from '@storeo/core';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@storeo/theme';

export type BreadProps = {
  /**/
};

export const Bread: FC<BreadProps> = () => {
  const matches = useRouterState({ select: s => s.matches });

  const breadcrumbs = useMemo(() => {
    return _.chain(
      matches.map(match => {
        const { routeContext } = match;
        return {
          title: (routeContext as { title: string }).title,
          path: match.pathname
        };
      })
    )
      .groupBy('title')
      .map(values => {
        return _.chain(values)
          .groupBy('path')
          .map(values => values[0])
          .value()[0];
      })
      .value();
  }, [matches]);

  console.log(matches);

  return (
    <Breadcrumb>
      <BreadcrumbList className={'sm:gap-2'}>
        {breadcrumbs.map((it, index) => (
          <Fragment key={it.path}>
            <BreadcrumbItem>
              <Show
                when={index === breadcrumbs.length - 1}
                fallback={
                  <BreadcrumbLink href={it.path}>
                    <Show when={it.path === '/'} fallback={it.title}>
                      <HomeIcon width={20} height={20} />
                    </Show>
                  </BreadcrumbLink>
                }
              >
                <BreadcrumbPage className={'font-bold'}>
                  {it.title}
                </BreadcrumbPage>
              </Show>
            </BreadcrumbItem>
            <Show when={index !== breadcrumbs.length - 1}>
              <BreadcrumbSeparator />
            </Show>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
