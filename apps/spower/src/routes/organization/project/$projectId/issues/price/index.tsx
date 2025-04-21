import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { FilesIcon, Loader } from 'lucide-react';
import { IssueItem, ListSchema, api } from 'portal-api';

import { useCallback, useMemo } from 'react';

import { Show, formatDateTime } from '@minhdtb/storeo-core';
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

export const Route = createFileRoute(
  '/_private/$organizationId/project/$projectId/issues/price/'
)({
  component: Component,
  validateSearch: input => {
    const validated = ListSchema.validateSync(input);
    return {
      ...validated,
      objectTypeName: 'Price'
    };
  },
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: async ({ deps, params, context: { queryClient } }) => {
    const priceType = await queryClient?.ensureQueryData(
      api.objectType.byType.getOptions(deps.search.objectTypeName)
    );

    await queryClient?.ensureQueryData(
      api.issue.listByObjectType.getOptions({
        ...deps.search,
        projectId: params.projectId,
        objectTypeId: priceType?.id
      })
    );
  }
});

function Component() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const { data: priceType } = api.objectType.byType.useSuspenseQuery({
    variables: search.objectTypeName
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: api.issue.listByObjectType.getKey({
        filter: search.filter ?? '',
        projectId,
        objectTypeId: priceType?.id
      }),
      queryFn: ({ pageParam = 1 }) =>
        api.issue.listByObjectType.fetcher({
          filter: search.filter ?? '',
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

  const columnHelper = createColumnHelper<IssueItem>();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => info.row.index + 1,
      header: () => '#'
    }),
    columnHelper.accessor('title', {
      cell: info => {
        const typeObject = info.row.original.object?.objectType;

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
      maxSize: 300
    }),
    columnHelper.accessor('deadlineStatus', {
      cell: ({ row }) => <IssueDeadlineStatus issueId={row.original.id} />,
      header: () => 'Tiến độ',
      footer: info => info.column.id
    }),
    columnHelper.accessor('assignees', {
      cell: ({ row }) => (
        <IssueAssigneeDisplay issueId={row.original.id} maxVisible={1} />
      ),
      header: () => 'Người thực hiện',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'expand.issueFile_via_issue',
      cell: info => {
        const files = info.row.original.files;
        return files && files.length > 0 ? (
          <FilesIcon className="h-4 w-4 text-gray-500" />
        ) : null;
      },
      header: () => '',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'state',
      cell: ({ row }) => <IssueStatus issueId={row.original.id} />,
      header: () => 'Trạng thái',
      footer: info => info.column.id
    }),
    columnHelper.accessor('createdBy', {
      cell: ({ row }) => (
        <EmployeeDisplay employeeId={row.original.createdBy?.id} />
      ),
      header: () => 'Người tạo',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'object',
      cell: ({ row }) => <IssueType issueId={row.original.id} />,
      header: () => 'Loại',
      footer: info => info.column.id
    }),
    columnHelper.accessor('created', {
      cell: ({ row }) => formatDateTime(row.original.created ?? ''),
      header: () => 'Ngày tạo',
      footer: info => info.column.id
    }),
    columnHelper.accessor('updated', {
      cell: ({ row }) => formatDateTime(row.original.updated ?? ''),
      header: () => 'Ngày cập nhật',
      footer: info => info.column.id
    })
  ];

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: issues
  });

  const { rows } = table.getRowModel();

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
          value={search.filter}
          className={'h-8 w-56'}
          placeholder={'Tìm kiếm...'}
          onChange={value =>
            navigate({
              to: '.',
              search: { ...search, filter: value ?? '' }
            })
          }
        />
      </div>
      <div
        className={'relative min-h-0 flex-1 overflow-auto rounded-md'}
        onScroll={handleScroll}
      >
        <Table>
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
                      width: 'auto',
                      maxWidth: header.column.columnDef.maxSize
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
          <TableBody>
            <Show when={isLoading}>
              <TableRow className={'border-b-0'}>
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            </Show>
            <Show when={!isLoading}>
              {rows.length ? (
                rows.map(row => {
                  return (
                    <TableRow
                      key={row.id}
                      className={'w-full cursor-pointer'}
                      data-index={row.index}
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
                            width: 'auto',
                            maxWidth: cell.column.columnDef.maxSize
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
                      <span className="text-gray-500">Không có dữ liệu.</span>
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
  );
}
