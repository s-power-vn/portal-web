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
import { ObjectData, api } from 'portal-api';

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

import { PageHeader } from '../../../../components';
import { IndeterminateCheckbox } from '../../../../components/checkbox';
import { useInvalidateQueries } from '../../../../hooks';

export const Route = createFileRoute(
  '/_authenticated/settings/operation/objects'
)({
  component: Component,
  loader: ({ context: { queryClient } }) =>
    queryClient?.ensureQueryData(api.object.list.getOptions()),
  beforeLoad: () => {
    return {
      title: 'Quản lý đối tượng'
    };
  }
});

function Component() {
  const navigate = useNavigate({ from: Route.fullPath });
  const [search, setSearch] = useState<string | undefined>();
  const invalidates = useInvalidateQueries();
  const parentRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: api.object.list.getKey({ filter: search ?? '' }),
      queryFn: ({ pageParam = 1 }) =>
        api.object.list.fetcher({
          filter: search ?? '',
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

  const columnHelper = createColumnHelper<ObjectData>();

  const deleteObject = api.object.delete.useMutation({
    onSuccess: async () => {
      success('Xóa đối tượng thành công');
      invalidates([api.object.list.getKey({ filter: search ?? '' })]);
    },
    onError: () => {
      error('Xóa đối tượng thất bại');
    }
  });

  const duplicateObject = api.object.duplicate.useMutation({
    onSuccess: async () => {
      success('Nhân bản đối tượng thành công');
      invalidates([api.object.list.getKey({ filter: search ?? '' })]);
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
                    }
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

      columnHelper.accessor(row => row.expand?.type, {
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
      columnHelper.accessor(row => row.expand?.process?.name, {
        id: 'processName',
        cell: info => info.getValue() || '',
        header: () => 'Quy trình',
        footer: info => info.column.id,
        size: 150
      }),

      columnHelper.accessor('base', {
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() ? (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                Cơ bản
              </span>
            ) : null}
          </div>
        ),
        header: () => 'Cơ bản',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('description', {
        cell: info => info.getValue() || '',
        header: () => 'Mô tả',
        footer: info => info.column.id
      })
    ],
    [columnHelper, navigate, handleDuplicateObject, deleteObject, confirm]
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: objects,
    state: {
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection
  });

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
        }
      });
    },
    [navigate]
  );

  const handleAddObject = useCallback(() => {
    navigate({
      to: './new'
    });
  }, [navigate]);

  const handleSearchChange = useCallback((value: string | undefined) => {
    setSearch(value);
  }, []);

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
            value={search}
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
                          className={`text-appWhite whitespace-nowrap ${
                            header.column.id === 'select' ||
                            header.column.id === 'index'
                              ? 'bg-appBlueLight sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                              : header.column.id === 'name'
                                ? 'bg-appBlueLight sticky left-[70px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                                : ''
                          }`}
                          style={{
                            width: header.getSize(),
                            maxWidth: header.getSize(),
                            left:
                              header.column.id === 'select'
                                ? 0
                                : header.column.id === 'index'
                                  ? 40
                                  : header.column.id === 'name'
                                    ? 70
                                    : 'auto'
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
                              className={`truncate text-left ${
                                cell.column.id === 'select' ||
                                cell.column.id === 'index'
                                  ? 'sticky left-0 z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                                  : cell.column.id === 'name'
                                    ? 'sticky left-[70px] z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                                    : ''
                              }`}
                              style={{
                                width: cell.column.getSize(),
                                maxWidth: cell.column.getSize(),
                                left:
                                  cell.column.id === 'select'
                                    ? 0
                                    : cell.column.id === 'index'
                                      ? 40
                                      : cell.column.id === 'name'
                                        ? 70
                                        : 'auto',
                                backgroundColor:
                                  row.getIsSelected() &&
                                  (cell.column.id === 'select' ||
                                    cell.column.id === 'index' ||
                                    cell.column.id === 'name')
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
