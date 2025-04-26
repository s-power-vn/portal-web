import { useInfiniteQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { CopyIcon, Loader, PlusIcon, XIcon } from 'lucide-react';
import { ListSchema, ProcessListItem, processApi } from 'portal-api';

import { useCallback, useMemo, useRef } from 'react';

import { Show, formatDateTime } from '@minhdtb/storeo-core';
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  showModal,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { EmployeeDisplay, PageHeader } from '../../../../../components';
import { ApplyProcessForm } from '../../../../../components/domains/process/form/apply-process-form';
import {
  useIntersectionObserver,
  useInvalidateQueries
} from '../../../../../hooks';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/operation/process'
)({
  component: Component,
  validateSearch: input => ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(
      processApi.list.getOptions({
        ...deps.search,
        filter: deps.search.filter
          ? `(name ~ "${deps.search.filter}") || (description ~ "${deps.search.filter}")`
          : ''
      })
    ),
  beforeLoad: () => ({ title: 'Quản lý quy trình' })
});

function Component() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const invalidates = useInvalidateQueries();
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: processApi.list.getKey({
        filter: search.filter ?? ''
      }),
      queryFn: ({ pageParam = 1 }) =>
        processApi.list.fetcher({
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

  const processes = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage
  });

  const handleAddProcess = useCallback(() => {
    navigate({
      to: './new',
      search
    });
  }, [navigate, search]);

  const deleteProcess = processApi.delete.useMutation({
    onSuccess: async () => {
      success('Xóa quy trình thành công');
      invalidates([processApi.list.getKey({ filter: search.filter ?? '' })]);
    }
  });

  const duplicateProcess = processApi.duplicate.useMutation({
    onSuccess: async () => {
      success('Nhân bản quy trình thành công');
      invalidates([processApi.list.getKey({ filter: search.filter ?? '' })]);
    }
  });

  const { confirm } = useConfirm();

  const columnHelper = createColumnHelper<ProcessListItem>();

  const handleApplyProcess = useCallback(
    (processId: string) => {
      showModal({
        title: 'Áp dụng quy trình',
        children: ({ close }) => (
          <ApplyProcessForm
            processId={processId}
            onSuccess={() => {
              close();
              invalidates([
                processApi.list.getKey({ filter: search.filter ?? '' }),
                processApi.byId.getKey()
              ]);
            }}
            onCancel={close}
          />
        )
      });
    },
    [search, invalidates]
  );

  const handleDuplicateProcess = useCallback(
    (processId: string) => {
      confirm('Bạn có chắc chắn muốn nhân bản quy trình này?', () => {
        duplicateProcess.mutate(processId);
      });
    },
    [confirm, duplicateProcess]
  );

  const handleDeleteProcess = useCallback(
    (id: string) => {
      confirm('Bạn có chắc chắn muốn xóa quy trình này không?', () => {
        deleteProcess.mutate(id);
      });
    },
    [confirm, deleteProcess]
  );

  const handleEditProcess = useCallback(
    (id: string) => {
      navigate({
        to: './$processId/edit',
        params: {
          processId: id
        },
        search
      });
    },
    [navigate, search]
  );

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
      columnHelper.display({
        size: 180,
        id: 'actions',
        cell: ({ row }) => {
          return (
            <div className={'flex gap-1'}>
              <Button
                className={'flex h-6 gap-1 px-3 text-xs'}
                onClick={e => {
                  e.stopPropagation();
                  handleApplyProcess(row.original.id);
                }}
              >
                Áp dụng
              </Button>
              <Button
                className={'h-6 px-3'}
                onClick={e => {
                  e.stopPropagation();
                  handleDuplicateProcess(row.original.id);
                }}
              >
                <CopyIcon className={'h-3 w-3'} />
              </Button>
              <Button
                variant={'destructive'}
                className={'h-6 px-3'}
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteProcess(row.original.id);
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
        header: () => 'Tên quy trình',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('objectType', {
        cell: info => {
          const objectType = info.row.original.objectType;
          if (!objectType) {
            return null;
          }
          return (
            <Badge
              className="text-appWhite text-xs"
              style={{ backgroundColor: objectType.color }}
            >
              {objectType.display}
            </Badge>
          );
        },
        header: () => 'Loại đối tượng',
        footer: info => info.column.id,
        size: 200
      }),
      columnHelper.display({
        id: 'objects',
        cell: info => {
          const objects = info.row.original.objects;
          if (!objects || objects.length === 0) {
            return (
              <span className="text-xs italic text-gray-400">Chưa áp dụng</span>
            );
          }

          const displayLimit = 3;
          const hasMore = objects.length > displayLimit;
          const displayObjects = hasMore
            ? objects.slice(0, displayLimit)
            : objects;

          return (
            <div className="flex flex-wrap gap-1">
              {displayObjects.map(object => (
                <Badge
                  key={object.id}
                  className=" text-appWhite text-xs"
                  style={{
                    backgroundColor: info.row.original.objectType?.color
                  }}
                >
                  {object.name}
                </Badge>
              ))}
              {hasMore && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="cursor-pointer bg-gray-500 text-xs text-white">
                        +{objects.length - displayLimit}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-1">
                        {objects.slice(displayLimit).map(object => (
                          <div
                            key={object.id}
                            className="whitespace-nowrap text-xs"
                          >
                            {object.name}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        },
        header: () => 'Đang áp dụng',
        footer: info => info.column.id,
        size: 200
      }),
      columnHelper.accessor('createdBy', {
        cell: info => <EmployeeDisplay employeeId={info.getValue()?.id} />,
        header: () => 'Người tạo',
        footer: info => info.column.id,
        size: 200
      }),
      columnHelper.accessor('created', {
        cell: info => formatDateTime(info.getValue() || ''),
        header: () => 'Ngày tạo',
        footer: info => info.column.id
      }),
      columnHelper.accessor('updated', {
        cell: info => formatDateTime(info.getValue() || ''),
        header: () => 'Ngày cập nhật',
        footer: info => info.column.id
      })
    ],
    [
      columnHelper,
      handleApplyProcess,
      handleDeleteProcess,
      handleDuplicateProcess
    ]
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: processes || []
  });

  return (
    <>
      <div className={'flex h-full flex-col'} ref={parentRef}>
        <PageHeader title={'Quản lý quy trình'} />
        <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
          <div className={'flex gap-2'}>
            <Button className={'flex gap-1'} onClick={handleAddProcess}>
              <PlusIcon className={'h-5 w-5'} />
              Thêm quy trình
            </Button>
            <Outlet />
          </div>
          <div className={'relative min-h-0 flex-1 overflow-hidden rounded-md'}>
            <div className="absolute inset-0 overflow-auto">
              <Table
                style={{
                  width: '100%',
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
                <TableBody>
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
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map(row => (
                        <TableRow
                          key={row.id}
                          className={'cursor-pointer last:border-b-0'}
                          onClick={() => {
                            handleEditProcess(row.original.id);
                          }}
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
                      ))
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
    </>
  );
}
