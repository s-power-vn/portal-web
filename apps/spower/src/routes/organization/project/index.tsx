import { useInfiniteQuery } from '@tanstack/react-query';
import type { SearchSchemaInput } from '@tanstack/react-router';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader } from 'lucide-react';
import { ListSchema, ProjectListItem, api } from 'portal-api';

import { useCallback, useMemo, useRef } from 'react';

import { formatDateTime } from '@minhdtb/storeo-core';
import {
  DebouncedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@minhdtb/storeo-theme';

import { EmployeeDisplay, IssueBadge } from '../../../components';

const Component = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: api.project.list.getKey({
        ...search,
        filter: search.filter ?? ''
      }),
      queryFn: ({ pageParam = 1 }) =>
        api.project.list.fetcher({
          ...search,
          filter: search.filter ?? '',
          pageIndex: pageParam,
          pageSize: search.pageSize
        }),
      getNextPageParam: lastPage => {
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      },
      initialPageParam: 1
    });

  const projects = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const columnHelper = createColumnHelper<ProjectListItem>();

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
        size: 60
      }),
      columnHelper.accessor('name', {
        cell: info => <div className={'truncate'}>{info.getValue()}</div>,
        header: () => 'Tên công trình',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.display({
        id: 'badge',
        cell: info => <IssueBadge projectId={info.row.original.id} />,
        header: () => '',
        footer: info => info.column.id
      }),
      columnHelper.accessor('createdBy', {
        cell: ({ row }) => (
          <EmployeeDisplay employeeId={row.original.createdBy?.id} />
        ),
        header: () => 'Người tạo',
        footer: info => info.column.id,
        size: 200
      }),
      columnHelper.accessor('created', {
        cell: ({ row }) => formatDateTime(row.original.created ?? ''),
        header: () => 'Ngày tạo',
        footer: info => info.column.id,
        size: 170
      }),
      columnHelper.accessor('updated', {
        cell: ({ row }) => formatDateTime(row.original.updated ?? ''),
        header: () => 'Ngày cập nhật',
        footer: info => info.column.id,
        size: 170
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: projects
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

  const handleRowClick = useCallback(
    (row: ProjectListItem) => {
      navigate({
        to: './$projectId',
        params: {
          projectId: row.id
        }
      });
    },
    [navigate]
  );

  return (
    <div className={'flex h-full flex-col gap-2 p-2'}>
      <DebouncedInput
        value={search.filter}
        className={'h-8 w-56'}
        placeholder={'Tìm kiếm...'}
        onChange={handleSearchChange}
      />
      <div
        className={
          'border-appGray relative min-h-0 flex-1 overflow-hidden rounded-md border'
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
                width: table.getTotalSize(),
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
                  <TableRow key={headerGroup.id} className={'hover:bg-appBlue'}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className={'text-appWhite whitespace-nowrap'}
                        style={{
                          width: header.getSize(),
                          minWidth: header.getSize(),
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
                        className={'absolute w-full cursor-pointer'}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                        style={{
                          transform: `translateY(${virtualRow.start}px)`
                        }}
                        onClick={() => handleRowClick(row.original)}
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell
                            key={cell.id}
                            className={'truncate text-left last:border-r'}
                            style={{
                              width: cell.column.getSize(),
                              minWidth: cell.column.getSize(),
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
  );
};

export const Route = createFileRoute('/_private/$organizationId/project/')({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) => {
    return queryClient?.ensureQueryData(
      api.project.list.getOptions({
        filter: deps.search.filter
      })
    );
  }
});
