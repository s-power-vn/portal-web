import { useInfiniteQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  CheckIcon,
  CopyIcon,
  EditIcon,
  Loader,
  PlusIcon,
  XIcon
} from 'lucide-react';
import { ListSchema, ObjectListItem, api } from 'portal-api';

import { useCallback, useMemo, useRef, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';
import {
  Button,
  DebouncedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  error,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { PageHeader } from '../../../../../components';
import { IndeterminateCheckbox } from '../../../../../components/checkbox';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/operation/objects'
)({
  component: Component,
  validateSearch: input => ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(
      api.object.list.getOptions({
        ...deps.search,
        filter: deps.search.filter
          ? `(name ~ "${deps.search.filter}") || (description ~ "${deps.search.filter}")`
          : ''
      })
    ),
  beforeLoad: () => {
    return {
      title: 'Quản lý đối tượng'
    };
  }
});

function Component() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const invalidates = useInvalidateQueries();
  const parentRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: api.object.list.getKey({
        filter: search.filter ?? ''
      }),
      queryFn: ({ pageParam = 1 }) =>
        api.object.list.fetcher({
          filter: search.filter
            ? `(name ~ "${search.filter}") || (description ~ "${search.filter}")`
            : '',
          pageIndex: pageParam,
          pageSize: 20
        }),
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1
    });

  const objects = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const columnHelper = createColumnHelper<ObjectListItem>();

  const deleteObject = api.object.delete.useMutation({
    onSuccess: async () => {
      success('Xóa đối tượng thành công');
      invalidates([api.object.list.getKey({ filter: search.filter ?? '' })]);
    },
    onError: () => {
      error('Xóa đối tượng thất bại');
    }
  });

  const duplicateObject = api.object.duplicate.useMutation({
    onSuccess: async () => {
      success('Nhân bản đối tượng thành công');
      invalidates([api.object.list.getKey({ filter: search.filter ?? '' })]);
    },
    onError: () => {
      error('Nhân bản đối tượng thất bại');
    }
  });

  const { confirm } = useConfirm();

  const handleDuplicateObject = useCallback(
    (objectId: string) => {
      confirm('Bạn có chắc chắn muốn nhân bản đối tượng này?', () => {
        duplicateObject.mutate(objectId);
      });
    },
    [confirm, duplicateObject]
  );

  const table = useReactTable({
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    data: objects,
    state: {
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection
  });

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        cell: ({ row }) => (
          <div className={'flex items-center justify-center'}>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        ),
        header: () => (
          <div className={'flex items-center justify-center'}>
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          </div>
        ),
        size: 40
      }),
      columnHelper.display({
        id: 'index',
        cell: info => (
          <div className={'flex items-center justify-center'}>
            {info.row.index + 1}
          </div>
        ),
        header: () => (
          <div className={'flex items-center justify-center'}>#</div>
        ),
        size: 30
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          return (
            <div className={'flex gap-1'}>
              <Button
                className={'h-6 px-3'}
                onClick={e => {
                  e.stopPropagation();
                  navigate({
                    to: './$objectId/edit',
                    params: {
                      objectId: row.original.id
                    },
                    search
                  });
                }}
              >
                <EditIcon className={'h-3 w-3'} />
              </Button>
              <Button
                className={'h-6 px-3'}
                onClick={e => {
                  e.stopPropagation();
                  handleDuplicateObject(row.original.id);
                }}
              >
                <CopyIcon className={'h-3 w-3'} />
              </Button>
              <Button
                variant={'destructive'}
                className={'h-6 px-3'}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  confirm('Bạn chắc chắn muốn xóa đối tượng này?', () => {
                    deleteObject.mutate(row.original.id);
                  });
                }}
              >
                <XIcon className={'h-3 w-3'} />
              </Button>
            </div>
          );
        },
        header: () => 'Thao tác'
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => 'Tên đối tượng',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('active', {
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              ''
            )}
          </div>
        ),
        header: () => 'Kích hoạt',
        footer: info => info.column.id,
        size: 100
      }),

      columnHelper.accessor(row => row.objectType, {
        id: 'type',
        cell: info => {
          const objectType = info.getValue();
          if (!objectType) return null;

          const badgeStyle =
            'rounded-full px-2 py-1 text-xs font-medium text-white whitespace-nowrap';

          return (
            <span
              className={cn(badgeStyle)}
              style={{ backgroundColor: objectType.color || '#888888' }}
            >
              {objectType.display || 'Không xác định'}
            </span>
          );
        },
        header: () => 'Loại',
        footer: info => info.column.id
      }),
      columnHelper.accessor(row => row.process?.name, {
        id: 'processName',
        cell: info => info.getValue() || '',
        header: () => 'Quy trình',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('description', {
        cell: info => info.getValue() || '',
        header: () => 'Mô tả',
        footer: info => info.column.id
      })
    ],
    [
      columnHelper,
      table,
      navigate,
      search,
      handleDuplicateObject,
      confirm,
      deleteObject
    ]
  );

  table.setOptions(prev => ({
    ...prev,
    columns
  }));

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 20
  });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
      if (
        scrollHeight - scrollTop - clientHeight < 20 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleNavigateToEdit = useCallback(
    (objectId: string) => {
      navigate({
        to: './$objectId/edit',
        params: {
          objectId
        },
        search
      });
    },
    [navigate, search]
  );

  const handleAddObject = useCallback(() => {
    navigate({
      to: './new',
      search
    });
  }, [navigate, search]);

  const handleSearchChange = useCallback(
    (value: string | undefined) => {
      navigate({
        to: '.',
        search: {
          ...search,
          filter: value ?? ''
        }
      });
    },
    [navigate, search]
  );

  return (
    <div className={'flex h-full flex-col'}>
      <Outlet />
      <PageHeader title={'Quản lý đối tượng'} />
      <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'} onClick={handleAddObject}>
            <PlusIcon className={'h-5 w-5'} />
            Thêm đối tượng
          </Button>
          <DebouncedInput
            value={search.filter}
            className={'h-9 w-56'}
            placeholder={'Tìm kiếm...'}
            onChange={handleSearchChange}
          />
        </div>
        <div
          className={
            'border-appBlue relative min-h-0 flex-1 overflow-hidden rounded-md border'
          }
        >
          <div
            className="absolute inset-0 overflow-auto"
            ref={parentRef}
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div className="flex h-20 items-center justify-center">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Table
                style={{
                  width: '100%',
                  tableLayout: 'fixed'
                }}
                className="relative"
              >
                <TableHeader
                  className={'bg-appBlueLight'}
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}
                >
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow
                      key={headerGroup.id}
                      className={'hover:bg-appBlue'}
                    >
                      {headerGroup.headers.map(header => (
                        <TableHead
                          key={header.id}
                          className={`text-appWhite whitespace-nowrap`}
                          style={{
                            width: header.getSize(),
                            maxWidth: header.getSize()
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody
                  className={'relative'}
                  style={{
                    height: `${virtualizer.getTotalSize()}px`
                  }}
                >
                  {rows.length ? (
                    virtualizer.getVirtualItems().map(virtualRow => {
                      const row = rows[virtualRow.index];
                      return (
                        <TableRow
                          key={virtualRow.key}
                          className={cn(
                            'absolute w-full cursor-pointer last:border-b-0',
                            row.getIsSelected() && 'bg-blue-50'
                          )}
                          data-index={virtualRow.index}
                          ref={virtualizer.measureElement}
                          style={{
                            transform: `translateY(${virtualRow.start}px)`
                          }}
                          onClick={() => handleNavigateToEdit(row.original.id)}
                        >
                          {row.getVisibleCells().map(cell => (
                            <TableCell
                              key={cell.id}
                              className={`truncate text-left`}
                              style={{
                                width: cell.column.getSize(),
                                maxWidth: cell.column.getSize(),
                                backgroundColor: row.getIsSelected()
                                  ? '#EBF5FF'
                                  : ''
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className={'border-b-0'}>
                      <TableCell
                        colSpan={columns.length}
                        className="h-16 text-center"
                      >
                        Không có dữ liệu.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            {isFetchingNextPage && (
              <div className="flex h-20 items-center justify-center">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
