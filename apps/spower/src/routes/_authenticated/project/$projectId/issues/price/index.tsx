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
import { FilesIcon, Loader } from 'lucide-react';
import { IssueData, ListSchema, api } from 'portal-api';

import { useCallback, useMemo, useRef, useState } from 'react';

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

import {
  DynamicIcon,
  EmployeeDisplay,
  IssueAssigneeDisplay,
  IssueDeadlineStatus,
  IssueStatus,
  IssueType,
  NewIssueButton
} from '../../../../../../components';

const ThisRoute = createFileRoute(
  '/_authenticated/project/$projectId/issues/price/'
)();

const Component = () => {
  const { projectId } = ThisRoute.useParams();
  const navigate = useNavigate({ from: ThisRoute.fullPath });
  const [search, setSearch] = useState<string | undefined>();
  const parentRef = useRef<HTMLDivElement>(null);

  const { data: priceType } = api.objectType.byType.useSuspenseQuery({
    variables: 'Price'
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: api.issue.listByObjectType.getKey({
        filter: search ?? '',
        projectId,
        objectTypeId: priceType?.id
      }),
      queryFn: ({ pageParam = 1 }) =>
        api.issue.listByObjectType.fetcher({
          filter: search ?? '',
          pageIndex: pageParam,
          pageSize: 20,
          projectId,
          objectTypeId: priceType?.id
        }),
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1
    });

  const issues = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const columnHelper = createColumnHelper<IssueData>();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => info.row.index + 1,
      header: () => '#',
      size: 50
    }),
    columnHelper.accessor('title', {
      cell: info => {
        const typeObject = info.row.original.expand?.object.expand?.type;

        return (
          <div className={'flex w-full min-w-0 items-center gap-2'}>
            <DynamicIcon
              svgContent={typeObject?.icon}
              className={'h-4 w-4 flex-shrink-0'}
              style={{ color: typeObject?.color || '#6b7280' }}
            />
            <span className={'truncate'}>{info.getValue()}</span>
          </div>
        );
      },
      header: () => 'Nội dung',
      footer: info => info.column.id,
      size: 400,
      minSize: 400,
      maxSize: 400
    }),
    columnHelper.accessor('deadlineStatus', {
      cell: ({ row }) => <IssueDeadlineStatus issueId={row.original.id} />,
      header: () => 'Tiến độ',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('assignees', {
      cell: ({ row }) => (
        <IssueAssigneeDisplay issueId={row.original.id} maxVisible={1} />
      ),
      header: () => 'Người thực hiện',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.display({
      id: 'expand.issueFile_via_issue',
      cell: info => {
        const files = info.row.original.expand?.issueFile_via_issue;
        return files && files.length > 0 ? (
          <FilesIcon className="h-4 w-4 text-gray-500" />
        ) : null;
      },
      header: () => '',
      footer: info => info.column.id,
      size: 100
    }),
    columnHelper.display({
      id: 'state',
      cell: ({ row }) => <IssueStatus issueId={row.original.id} />,
      header: () => 'Trạng thái',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('createdBy', {
      cell: ({ row }) => (
        <EmployeeDisplay employeeId={row.original.createdBy} />
      ),
      header: () => 'Người tạo',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.display({
      id: 'object',
      cell: ({ row }) => <IssueType issueId={row.original.id} />,
      header: () => 'Loại',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('created', {
      cell: ({ row }) => formatDateTime(row.original.created),
      header: () => 'Ngày tạo',
      footer: info => info.column.id,
      size: 150
    }),
    columnHelper.accessor('updated', {
      cell: ({ row }) => formatDateTime(row.original.updated),
      header: () => 'Ngày cập nhật',
      footer: info => info.column.id,
      size: 150
    })
  ];

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: issues
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

  return (
    <div className={'flex h-full flex-col gap-2 p-2'}>
      <div className={'flex items-center justify-between gap-2'}>
        <NewIssueButton projectId={projectId} />
        <DebouncedInput
          value={search}
          className={'h-8 w-56'}
          placeholder={'Tìm kiếm...'}
          onChange={value => setSearch(value)}
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
                  <TableRow className="hover:bg-appBlue" key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className={'text-appWhite whitespace-nowrap'}
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
                        className={'absolute w-full cursor-pointer'}
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}
                        style={{
                          transform: `translateY(${virtualRow.start}px)`
                        }}
                        onClick={() =>
                          navigate({
                            to: './$issueId',
                            params: {
                              issueId: row.original.id
                            }
                          })
                        }
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

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/price/'
)({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  }
});
