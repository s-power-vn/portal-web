import { useInfiniteQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { CheckIcon, ChevronsUpDownIcon, Loader, X } from 'lucide-react';

import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  disabled?: boolean;
  lookupFn?: (
    values: string | string[]
  ) => Promise<ComboboxItem | ComboboxItem[] | undefined>;
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
  multiple = false,
  disabled = false,
  lookupFn
}: ComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ComboboxItem | undefined>();
  const [selectedItems, setSelectedItems] = useState<ComboboxItem[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);

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

  useEffect(() => {
    if (!value) {
      if (multiple) {
        setSelectedItems([]);
      } else {
        setSelectedItem(undefined);
      }
      return;
    }

    if (lookupFn) {
      setIsLookingUp(true);
      lookupFn(value)
        .then(result => {
          if (result) {
            if (multiple) {
              const lookupItems = Array.isArray(result) ? result : [result];
              setSelectedItems(lookupItems);
            } else {
              const item = Array.isArray(result) ? result[0] : result;
              setSelectedItem(item);
            }
          }
        })
        .catch(error => {
          console.error('Error looking up items:', error);
        })
        .finally(() => {
          setIsLookingUp(false);
        });
    }

    if (allItems.length > 0) {
      if (multiple) {
        const values = value as string[];

        const foundItems = values
          .map(v => allItems.find(it => it.value === v))
          .filter(Boolean) as ComboboxItem[];

        if (foundItems.length > 0) {
          setSelectedItems(prevItems => {
            const newItems = [...prevItems];

            for (const foundItem of foundItems) {
              if (!newItems.some(item => item.value === foundItem.value)) {
                newItems.push(foundItem);
              }
            }

            return newItems;
          });
        }
      } else {
        const singleValue = value as string;
        const found = allItems.find(it => it.value === singleValue);

        if (found) {
          setSelectedItem(found);
        }
      }
    }
  }, [value, allItems, multiple, lookupFn]);

  const handleScroll = useCallback(
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

  const handleClear = useCallback(
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

  const handleRemoveItem = useCallback(
    (e: React.MouseEvent, item: ComboboxItem) => {
      e.stopPropagation();
      const newItems = selectedItems.filter(it => it.value !== item.value);
      setSelectedItems(newItems);
      onChange?.(newItems.map(it => it.value));
    },
    [selectedItems, onChange]
  );

  const displayContent = useMemo(() => {
    const showLoading =
      isLookingUp &&
      ((multiple && selectedItems.length === 0) ||
        (!multiple && !selectedItem));

    if (showLoading) {
      return (
        <div className="flex items-center gap-2">
          <Loader className="h-3 w-3 animate-spin" />
          <span className="text-muted-foreground">Đang tải...</span>
        </div>
      );
    }

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
  }, [
    multiple,
    selectedItems,
    selectedItem,
    placeholder,
    handleRemoveItem,
    isLookingUp
  ]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (disabled) {
        return;
      }
      setOpen(isOpen);
    },
    [disabled]
  );

  return (
    <div ref={containerRef} className={'flex-1'}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <ThemeButton
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'relative h-auto min-h-9 w-full px-3 py-1.5 text-sm font-normal',
              'flex flex-wrap items-center justify-start gap-1.5',
              'pr-10',
              placeholder && !value ? 'text-muted-foreground' : 'text-appBlack',
              disabled && 'cursor-not-allowed opacity-50',
              className
            )}
          >
            {multiple && selectedItems.length > 0 ? (
              <div className="flex w-full flex-wrap items-center gap-1.5">
                {selectedItems.map(item => (
                  <span
                    key={item.value}
                    className={cn(
                      'bg-appGrayLight border-appGray flex items-center gap-1 rounded-md border px-2 py-1',
                      !disabled && 'cursor-pointer'
                    )}
                    onClick={e => handleRemoveItem(e, item)}
                  >
                    <span className="max-w-[200px] truncate text-sm">
                      {item.label}
                    </span>
                    {!disabled && (
                      <X className="text-appBlack hover:text-appError h-3.5 w-3.5 flex-shrink-0 cursor-pointer" />
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <span className="truncate pr-6">
                {selectedItem?.label ?? placeholder}
              </span>
            )}
            <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
              {showClear &&
                !disabled &&
                ((multiple && selectedItems.length > 0) ||
                  (!multiple && selectedItem)) && (
                  <div
                    className={cn(
                      'bg-appError flex h-4 w-4 items-center justify-center rounded-full text-white shadow hover:opacity-90'
                    )}
                    onClick={handleClear}
                  >
                    <X className="h-2.5 w-2.5" />
                  </div>
                )}
              <ChevronsUpDownIcon
                className={cn(
                  'h-4 w-4 shrink-0 opacity-50',
                  disabled && 'opacity-30'
                )}
              />
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
              className="h-9"
            />
            <CommandList className="h-48">
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
                _.keys(normalizedItems).map(key => (
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
                            className={cn(
                              'hover:bg-appGrayLight',
                              disabled &&
                                'pointer-events-none cursor-not-allowed opacity-50'
                            )}
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
                ))}
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
