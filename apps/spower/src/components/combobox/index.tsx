import { useInfiniteQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { CheckIcon, ChevronsUpDown, Loader } from 'lucide-react';

import * as React from 'react';
import { useMemo, useRef } from 'react';

import { cn } from '@minhdtb/storeo-core';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  ThemeButton
} from '@minhdtb/storeo-theme';
import { Popover, PopoverContent, PopoverTrigger } from '@minhdtb/storeo-theme';

type Align = 'start' | 'center' | 'end';

export type ComboboxItem = {
  label: string;
  value: string;
  group?: string;
  subLabel?: string;
};

export type ComboboxProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  queryKey: string[];
  queryFn: (params: { search?: string; page?: number }) => Promise<{
    items: ComboboxItem[];
    hasMore: boolean;
  }>;
  className?: string;
  showGroups?: boolean;
  align?: Align;
};

export function Combobox({
  value,
  onChange,
  placeholder = 'Select an item...',
  emptyText = 'No results found.',
  queryKey,
  queryFn,
  className,
  showGroups = true,
  align = 'start'
}: ComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: [...queryKey, search],
      queryFn: ({ pageParam = 1 }) => queryFn({ search, page: pageParam }),
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length + 1 : undefined,
      initialPageParam: 1
    });

  const allItems = React.useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data]
  );

  const normalizedItems = useMemo(
    () => _.groupBy(allItems, it => it.group),
    [allItems]
  );

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
      if (
        scrollHeight - scrollTop - clientHeight < 10 &&
        hasNextPage &&
        !isFetching
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetching]
  );

  return (
    <div ref={containerRef} className={'flex-1'}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ThemeButton
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'relative w-full justify-between text-sm font-normal',
              placeholder && !value ? 'text-muted-foreground' : 'text-appBlack',
              className
            )}
          >
            <span className="!truncate">
              {value
                ? allItems.find(it => it.value == value)?.label
                : placeholder}
            </span>
            <ChevronsUpDown className="absolute right-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
          </ThemeButton>
        </PopoverTrigger>
        <PopoverContent
          className="popover-content p-0"
          style={{
            width: containerRef.current?.offsetWidth
          }}
          container={containerRef.current}
          align={align}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={'Tìm kiếm...'}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList
              className="h-48 overflow-y-auto"
              onScroll={handleScroll}
            >
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  emptyText
                )}
              </CommandEmpty>
              {!isLoading &&
                _.keys(normalizedItems).map(key => {
                  return (
                    <React.Fragment key={key}>
                      <CommandGroup heading={key}>
                        {normalizedItems[key].map(it => {
                          return (
                            <CommandItem
                              key={it.value}
                              className={'hover:bg-appGrayLight'}
                              onSelect={() => {
                                onChange?.(it.value);
                                setOpen(false);
                              }}
                              value={it.value}
                            >
                              <div className="flex items-center gap-1">
                                <span>{it.label}</span>
                                {it.subLabel && (
                                  <span className="text-xs text-gray-400">
                                    ({it.subLabel})
                                  </span>
                                )}
                              </div>
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  value === it.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                      {showGroups ? <CommandSeparator /> : null}
                    </React.Fragment>
                  );
                })}
              {isFetching && (
                <>
                  <CommandSeparator />
                  <CommandItem disabled>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  </CommandItem>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
