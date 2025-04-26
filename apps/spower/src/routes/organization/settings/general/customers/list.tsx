import { useInfiniteQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { EditIcon, Loader, PlusIcon, XIcon } from 'lucide-react';
import { CustomerItem, ListSchema, customerApi } from 'portal-api';

import { useCallback, useMemo, useRef } from 'react';

import { Show } from '@minhdtb/storeo-core';
import {
  Button,
  DebouncedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { PageHeader } from '../../../../../components';
import { useInvalidateQueries } from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/general/customers'
)({
  component: Component,
  validateSearch: input => ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(
      customerApi.list.getOptions({
        ...deps.search,
        filter: deps.search.filter ?? ''
      })
    ),
  beforeLoad: () => {
    return {
      title: 'Quản lý chủ đầu tư'
    };
  }
});

function Component() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const invalidates = useInvalidateQueries();
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: customerApi.list.getKey({
        filter: search.filter ?? ''
      }),
      queryFn: ({ pageParam = 1 }) =>
        customerApi.list.fetcher({
          filter: search.filter ?? '',
          pageIndex: pageParam,
          pageSize: 20
        }),
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1
    });

  const customers = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const deleteCustomer = customerApi.delete.useMutation({
    onSuccess: async () => {
      success('Xóa chủ đầu tư thành công');
      invalidates([customerApi.list.getKey({ filter: search.filter ?? '' })]);
    }
  });

  const { confirm } = useConfirm();

  const columnHelper = createColumnHelper<CustomerItem>();

  const columns = useMemo(
    () => [
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
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => 'Tên chủ đầu tư',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('phone', {
        cell: info => info.getValue(),
        header: () => 'Số điện thoại',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('email', {
        cell: info => info.getValue(),
        header: () => 'Email',
        footer: info => info.column.id,
        size: 200
      }),
      columnHelper.accessor('address', {
        cell: info => info.getValue(),
        header: () => 'Địa chỉ',
        footer: info => info.column.id
      }),
      columnHelper.accessor('note', {
        cell: info => info.getValue(),
        header: () => 'Ghi chú',
        footer: info => info.column.id
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
                    to: './$customerId/edit',
                    params: {
                      customerId: row.original.id
                    },
                    search
                  });
                }}
              >
                <EditIcon className={'h-3 w-3'} />
              </Button>
              <Button
                variant={'destructive'}
                className={'h-6 px-3'}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  confirm('Bạn chắc chắn muốn xóa chủ đầu tư này?', () => {
                    deleteCustomer.mutate(row.original.id);
                  });
                }}
              >
                <XIcon className={'h-3 w-3'} />
              </Button>
            </div>
          );
        },
        header: () => 'Thao tác'
      })
    ],
    [columnHelper, navigate, confirm, deleteCustomer, search]
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: customers
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
    (customerId: string) => {
      navigate({
        to: './$customerId/edit',
        params: {
          customerId
        },
        search
      });
    },
    [navigate, search]
  );

  const handleAddCustomer = useCallback(() => {
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
      <PageHeader title={'Quản lý chủ đầu tư'} />
      <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'} onClick={handleAddCustomer}>
            <PlusIcon className={'h-5 w-5'} />
            Thêm chủ đầu tư
          </Button>
          <DebouncedInput
            value={search.filter}
            className={'h-9 w-56'}
            placeholder={'Tìm kiếm...'}
            onChange={handleSearchChange}
          />
          <Outlet />
        </div>
        <div className={'relative min-h-0 flex-1 overflow-hidden rounded-md'}>
          <div
            className="absolute inset-0 overflow-auto"
            ref={parentRef}
            onScroll={handleScroll}
          >
            <Table
              style={{
                width: table.getTotalSize(),
                tableLayout: 'fixed'
              }}
            >
              <TableHeader
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 2
                }}
              >
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className={'text-appBlue whitespace-nowrap'}
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
                <Show when={isLoading}>
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="flex items-center justify-center">
                        <Loader className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                </Show>
                <Show when={!isLoading}>
                  {rows.length ? (
                    virtualizer.getVirtualItems().map(virtualRow => {
                      const row = rows[virtualRow.index];
                      return (
                        <TableRow
                          key={virtualRow.key}
                          className={'absolute w-full cursor-pointer'}
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
                              className={'truncate text-left'}
                              style={{
                                width: cell.column.getSize(),
                                maxWidth: cell.column.getSize()
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
                      <TableCell colSpan={columns.length}>
                        <div className="flex items-center justify-center">
                          <span className="text-gray-500">
                            Không có dữ liệu.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Show>
              </TableBody>
            </Table>
            <Show when={isFetchingNextPage}>
              <div className="flex items-center justify-center">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
