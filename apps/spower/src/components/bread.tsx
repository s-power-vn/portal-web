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
        const { context, params, loaderData } = match;
        const title = (context as { title: string }).title;
        return {
          title,
          path: match.pathname,
          name: (loaderData as { name: string })?.name,
          projectId: (params as { projectId: string }).projectId
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
                    <Show
                      when={it.path === '/'}
                      fallback={
                        <Show
                          when={it.title === it.projectId}
                          fallback={
                            <div className={'max-w-60 truncate'}>
                              {it.title}
                            </div>
                          }
                        >
                          <div className={'max-w-80 truncate'}>{it.name}</div>
                        </Show>
                      }
                    >
                      <HomeIcon width={20} height={20} />
                    </Show>
                  </BreadcrumbLink>
                }
              >
                <BreadcrumbPage className={'max-w-60 truncate font-bold'}>
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
