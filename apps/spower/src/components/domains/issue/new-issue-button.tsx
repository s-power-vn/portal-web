import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader, PlusIcon } from 'lucide-react';
import { ObjectData, api } from 'portal-api';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DebouncedInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ThemeButton,
  showModal
} from '@minhdtb/storeo-theme';

import { useIntersectionObserver, useInvalidateQueries } from '../../../hooks';
import { DynamicIcon } from '../../icon/dynamic-icon';
import { NewPriceForm } from '../price';
import { NewRequestForm } from '../request';

export type NewIssueButtonProps = {
  projectId: string;
};

export const NewIssueButton: FC<NewIssueButtonProps> = ({ projectId }) => {
  const invalidates = useInvalidateQueries();
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: api.object.listActive.getKey({
        filter: `name ~ "${search}"`
      }),
      queryFn: ({ pageParam = 1 }) =>
        api.object.listActive.fetcher({
          filter: `name ~ "${search}"`,
          pageIndex: pageParam,
          pageSize: 10
        }),
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1,
      enabled: open
    });

  const listObjects = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleScroll = useCallback(() => {
    if (!loadMoreRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const loadMoreElement = loadMoreRef.current;
    const containerRect = container.getBoundingClientRect();
    const loadMoreRect = loadMoreElement.getBoundingClientRect();

    if (
      loadMoreRect.top >= containerRect.top &&
      loadMoreRect.bottom <= containerRect.bottom &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && open
  });

  const { data: objectTypesResult } = api.objectType.list.useQuery();
  const objectTypes = objectTypesResult?.items || [];

  const typeMap = useMemo(() => {
    if (!objectTypes.length) return new Map();

    return new Map(objectTypes.map(type => [type.id, type]));
  }, [objectTypes]);

  const handleNewRequestClick = useCallback(
    (objectId: string) => {
      showModal({
        title: 'Tạo yêu cầu mua hàng',
        className: 'flex min-w-[1000px] flex-col',
        description:
          'Tạo yêu cầu mua hàng mới. Cho phép chọn từ danh sách hạng mục',
        children: ({ close }) => {
          return (
            <NewRequestForm
              projectId={projectId}
              objectId={objectId}
              onSuccess={() => {
                invalidates([
                  api.issue.list.getKey({
                    projectId
                  }),
                  api.issue.listMine.getKey({
                    projectId
                  }),
                  api.issue.listByObjectType.getKey({
                    projectId
                  })
                ]);
                close();
              }}
              onCancel={close}
            />
          );
        }
      });
    },
    [invalidates, projectId]
  );

  const handleNewPriceRequestClick = useCallback(
    (objectId: string) => {
      showModal({
        title: 'Tạo đề nghị báo giá',
        className: 'flex min-w-[1000px] flex-col',
        description:
          'Tạo đề nghị báo giá mới. Cho phép chọn từ danh sách hạng mục',
        children: ({ close }) => {
          return (
            <NewPriceForm
              projectId={projectId}
              objectId={objectId}
              onSuccess={() => {
                invalidates([
                  api.issue.list.getKey({
                    projectId
                  }),
                  api.issue.listMine.getKey({
                    projectId
                  }),
                  api.issue.listByObjectType.getKey({
                    projectId
                  })
                ]);
                close();
              }}
              onCancel={close}
            />
          );
        }
      });
    },
    [invalidates, projectId]
  );

  const handleObjectClick = useCallback(
    (object: ObjectData) => {
      const type = typeMap.get(object.type)?.name;

      if (type === 'Request') {
        handleNewRequestClick(object.id);
        setOpen(false);
      } else if (type === 'Price') {
        handleNewPriceRequestClick(object.id);
        setOpen(false);
      }
    },
    [handleNewRequestClick, handleNewPriceRequestClick, typeMap]
  );

  const handleSearchChange = useCallback((value: string | undefined) => {
    setSearch(value || '');
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ThemeButton className={'flex gap-1'}>
          <PlusIcon className={'h-5 w-5'} />
          Tạo công việc mới
        </ThemeButton>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0"
        side="bottom"
        align="start"
        sideOffset={2}
      >
        <div className="p-2">
          <DebouncedInput
            value={search}
            className={'h-8 w-full'}
            placeholder={'Tìm kiếm loại công việc...'}
            onChange={handleSearchChange}
          />
        </div>
        <div
          className="max-h-[300px] overflow-y-auto"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {listObjects.length ? (
            listObjects.map(object => {
              const type = typeMap.get(object.type);

              return (
                <div
                  key={object.id}
                  className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center px-2 py-1.5 text-sm outline-none"
                  onClick={() => handleObjectClick(object)}
                >
                  <DynamicIcon
                    svgContent={type?.icon}
                    className="mr-2 h-4 w-4"
                    style={{ color: type?.color || '#6b7280' }}
                  />
                  {object.name}
                </div>
              );
            })
          ) : (
            <div className="px-2 py-1.5 text-xs text-gray-500">
              Không có đối tượng tạo công việc
            </div>
          )}
          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="flex h-8 w-full items-center justify-center text-xs text-gray-500"
            >
              {isFetchingNextPage && (
                <Loader className="h-4 w-4 animate-spin" />
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
