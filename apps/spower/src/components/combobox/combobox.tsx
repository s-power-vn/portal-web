import { useInfiniteQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { CheckIcon, ChevronsUpDown, Loader, X } from 'lucide-react';

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
  Popover,
  PopoverContent,
  PopoverTrigger,
  ThemeButton
} from '@minhdtb/storeo-theme';

type Align = 'start' | 'center' | 'end';

export type ComboboxItem = {
  label: string;
  value: string;
  group?: string;
  subLabel?: string;
};

export type ComboboxProps = {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchHint?: string;
  queryKey: string[];
  queryFn: (params: { search?: string; page?: number }) => Promise<{
    items: ComboboxItem[];
    hasMore: boolean;
  }>;
  className?: string;
  showGroups?: boolean;
  align?: Align;
  showClear?: boolean;
  multiple?: boolean;
};

export function Combobox({
  value,
  onChange,
  placeholder = 'Chọn...',
  emptyText = 'Không tìm thấy kết quả',
  searchHint = 'Tìm kiếm...',
  queryKey,
  queryFn,
  className,
  showGroups = true,
  showClear = true,
  align = 'start',
  multiple = false
}: ComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<
    ComboboxItem | undefined
  >();
  const [selectedItems, setSelectedItems] = React.useState<ComboboxItem[]>([]);

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

  // Update selected items when value changes or when items are loaded
  React.useEffect(() => {
    if (value && allItems.length > 0) {
      if (multiple) {
        const values = value as string[];
        const items = values
          .map(v => allItems.find(it => it.value === v))
          .filter(Boolean) as ComboboxItem[];
        setSelectedItems(items);
      } else {
        const found = allItems.find(it => it.value === value);
        if (found) {
          setSelectedItem(found);
        }
      }
    }
  }, [value, allItems, multiple]);

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

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (multiple) {
        setSelectedItems([]);
        onChange?.([]);
      } else {
        setSelectedItem(undefined);
        onChange?.('');
      }
    },
    [onChange, multiple]
  );

  const handleRemoveItem = React.useCallback(
    (e: React.MouseEvent, item: ComboboxItem) => {
      e.stopPropagation();
      const newItems = selectedItems.filter(it => it.value !== item.value);
      setSelectedItems(newItems);
      onChange?.(newItems.map(it => it.value));
    },
    [selectedItems, onChange]
  );

  const displayContent = React.useMemo(() => {
    if (multiple && selectedItems.length > 0) {
      return (
        <div className="flex w-full flex-wrap items-start gap-1 pr-4">
          {selectedItems.map(item => (
            <span
              key={item.value}
              className="bg-appGrayLight border-appGr flex max-w-full items-center gap-1 rounded-md border px-2 py-0.5"
            >
              <span className="max-w-[200px] truncate">{item.label}</span>
              <X
                className="text-appBlack hover:text-appError h-3 w-3 flex-shrink-0 cursor-pointer"
                onClick={e => handleRemoveItem(e, item)}
              />
            </span>
          ))}
        </div>
      );
    }

    return (
      <span className="!truncate">{selectedItem?.label ?? placeholder}</span>
    );
  }, [multiple, selectedItems, selectedItem, placeholder, handleRemoveItem]);

  return (
    <div ref={containerRef} className={'flex-1'}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ThemeButton
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'relative h-auto min-h-10 w-full p-1.5 text-sm font-normal',
              'flex flex-wrap items-center gap-1',
              multiple ? 'justify-start' : 'justify-between',
              (multiple && selectedItems.length > 0) ||
                (selectedItem && !multiple)
                ? 'text-appBlack'
                : 'text-muted-foreground',
              className
            )}
          >
            {displayContent}
            <div className="absolute right-2 flex items-center gap-1">
              {showClear &&
                ((multiple && selectedItems.length > 0) ||
                  (!multiple && selectedItem)) && (
                  <div
                    className={cn(
                      `bg-appError flex h-4 w-4 items-center
                   justify-center rounded-full p-0 text-white shadow`
                    )}
                    onClick={handleClear}
                  >
                    <X className="h-2 w-2" />
                  </div>
                )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
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
              placeholder={searchHint}
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
                      <CommandGroup heading={showGroups ? key : undefined}>
                        {normalizedItems[key].map(it => {
                          const isSelectedInMultiple =
                            multiple &&
                            selectedItems.some(item => item.value === it.value);
                          const isSelectedInSingle =
                            !multiple && selectedItem?.value === it.value;

                          return (
                            <CommandItem
                              key={it.value}
                              className={'hover:bg-appGrayLight'}
                              onSelect={() => {
                                if (multiple) {
                                  const isSelected = selectedItems.some(
                                    item => item.value === it.value
                                  );
                                  let newItems: ComboboxItem[];

                                  if (isSelected) {
                                    newItems = selectedItems.filter(
                                      item => item.value !== it.value
                                    );
                                  } else {
                                    newItems = [...selectedItems, it];
                                  }

                                  setSelectedItems(newItems);
                                  onChange?.(newItems.map(item => item.value));
                                } else {
                                  setSelectedItem(it);
                                  onChange?.(it.value);
                                  setOpen(false);
                                }
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
                                  isSelectedInMultiple || isSelectedInSingle
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
