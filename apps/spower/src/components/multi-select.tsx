import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';

import { FC, useEffect, useRef, useState } from 'react';

import { Badge } from '@minhdtb/storeo-theme';

export type SelectItem = {
  label: string;
  value: string;
  group?: string;
  subLabel?: string;
};

export type MultiSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  queryKey: unknown[];
  queryFn: (params: { search?: string; page?: number }) => Promise<{
    items: SelectItem[];
    hasMore: boolean;
  }>;
};

export const MultiSelect: FC<MultiSelectProps> = ({
  value = [],
  onChange,
  placeholder = 'Select items',
  emptyText = 'No items found',
  disabled = false,
  className = '',
  queryKey,
  queryFn
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SelectItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 40,
    overscan: 5
  });

  const loadItems = async (searchTerm: string, pageNum: number) => {
    setLoading(true);
    try {
      const result = await queryFn({ search: searchTerm, page: pageNum });

      if (pageNum === 1) {
        setItems(result.items);
      } else {
        setItems(prev => [...prev, ...result.items]);
      }

      setHasMore(result.hasMore);
      setLoading(false);
    } catch (error) {
      console.error('Error loading items:', error);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadItems(search, 1);
  }, [queryKey]);

  // Load selected items data
  useEffect(() => {
    const loadSelectedItems = async () => {
      if (value.length === 0) {
        setSelectedItems([]);
        return;
      }

      // Check if all values are already in the items list
      const missingValues = value.filter(
        v => !items.some(item => item.value === v)
      );

      if (missingValues.length > 0) {
        // We need to fetch the missing items
        try {
          const promises = missingValues.map(async v => {
            // This is simplified - in a real implementation, you might need a separate API call to fetch by ID
            const results = await queryFn({ search: v, page: 1 });
            return results.items.find(item => item.value === v);
          });

          const fetched = (await Promise.all(promises)).filter(
            Boolean
          ) as SelectItem[];

          // Merge with existing items
          const existingItems = items.filter(
            item =>
              value.includes(item.value) && !missingValues.includes(item.value)
          );

          setSelectedItems([...existingItems, ...fetched]);
        } catch (error) {
          console.error('Error loading selected items:', error);
        }
      } else {
        // All selected values are in the current items list
        setSelectedItems(items.filter(item => value.includes(item.value)));
      }
    };

    loadSelectedItems();
  }, [value, items]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    setPage(1);
    loadItems(term, 1);
  };

  const handleScroll = () => {
    if (!listRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const scrollEnd = scrollHeight - scrollTop - clientHeight < 10;

    if (scrollEnd) {
      setPage(prev => prev + 1);
      loadItems(search, page + 1);
    }
  };

  const toggleSelection = (item: SelectItem) => {
    const isSelected = value.includes(item.value);
    let newValue: string[];

    if (isSelected) {
      newValue = value.filter(v => v !== item.value);
    } else {
      newValue = [...value, item.value];
    }

    onChange(newValue);
  };

  const removeItem = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== itemValue));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-0 focus-visible:outline-none focus-visible:ring-2 ${
          isOpen ? 'ring-ring ring-2' : ''
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.length > 0 ? (
            selectedItems.map(item => (
              <Badge
                key={item.value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item.label}
                <button
                  type="button"
                  onClick={e => removeItem(item.value, e)}
                  className="hover:bg-muted inline-flex h-4 w-4 items-center justify-center rounded-full"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <div className="min-w-[80px] flex-1">
            {isOpen && (
              <input
                type="text"
                ref={inputRef}
                className="w-full border-0 bg-transparent p-0 outline-none"
                value={search}
                onChange={handleSearch}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
                placeholder={
                  selectedItems.length > 0 ? 'Tìm kiếm...' : placeholder
                }
              />
            )}
          </div>
        </div>
        <div className="ml-auto pl-3">
          {isOpen ? (
            <ChevronUp size={16} className="opacity-50" />
          ) : (
            <ChevronDown size={16} className="opacity-50" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="bg-popover absolute z-50 mt-1 w-full rounded-md border shadow-md">
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-auto rounded-md p-1"
          >
            {items.length === 0 ? (
              <div className="text-muted-foreground px-3 py-2 text-sm">
                {loading ? 'Đang tải...' : emptyText}
              </div>
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative'
                }}
              >
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                  const item = items[virtualItem.index];
                  const isSelected = value.includes(item.value);
                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`
                      }}
                    >
                      <div
                        className={`flex cursor-pointer items-center rounded-sm px-2 py-1.5 ${
                          isSelected
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => toggleSelection(item)}
                      >
                        <div className="border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border">
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <div className="flex flex-col">
                          <div>{item.label}</div>
                          {item.subLabel && (
                            <div className="text-muted-foreground text-xs">
                              {item.subLabel}
                            </div>
                          )}
                        </div>
                        {item.group && (
                          <div className="text-muted-foreground ml-auto text-xs">
                            {item.group}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {loading && hasMore && (
              <div className="text-muted-foreground py-2 text-center text-sm">
                Đang tải thêm...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
