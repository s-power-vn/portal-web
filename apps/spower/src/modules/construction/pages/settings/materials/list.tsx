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
import { ListSchema, api } from 'portal-api';
import type { MaterialResponse } from 'portal-core';

import { useCallback, useMemo, useRef } from 'react';

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

export const Route = createFileRoute('/_private/settings/general/materials')({
  component: Component,
  validateSearch: input => ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(
      api.material.list.getOptions({
        ...deps.search,
        filter: deps.search.filter
          ? `(name ~ "${deps.search.filter}") || (code ~ "${deps.search.filter}")`
          : ''
      })
    ),
  beforeLoad: () => {
    return {
      title: 'Quản lý danh mục vật tư'
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
      queryKey: api.material.list.getKey({
        filter: search.filter ?? ''
      }),
      queryFn: ({ pageParam = 1 }) =>
        api.material.list.fetcher({
          filter: search.filter
            ? `(name ~ "${search.filter}") || (code ~ "${search.filter}")`
            : '',
          pageIndex: pageParam,
          pageSize: 20
        }),
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1
    });

  const materials = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const deleteMaterial = api.material.delete.useMutation({
    onSuccess: async () => {
      success('Xóa vật tư thành công');
      invalidates([api.material.list.getKey({ filter: search.filter ?? '' })]);
    }
  });

  const { confirm } = useConfirm();

  const columnHelper = createColumnHelper<MaterialResponse>();

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
        header: () => 'Tên vật tư',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('code', {
        cell: info => info.getValue(),
        header: () => 'Mã vật tư',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('unit', {
        cell: info => info.getValue(),
        header: () => 'Đơn vị',
        footer: info => info.column.id,
        size: 100
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
                    to: './$materialId/edit',
                    params: {
                      materialId: row.original.id
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
                  confirm('Bạn chắc chắn muốn xóa vật tư này?', () => {
                    deleteMaterial.mutate(row.original.id);
                  });
                }}
              >
                <XIcon className={'h-3 w-3'} />
              </Button>
            </div>
          );
        },
        header: () => 'Thao tác',
        size: 120
      })
    ],
    [columnHelper, navigate, confirm, deleteMaterial, search]
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: materials
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
    (materialId: string) => {
      navigate({
        to: './$materialId/edit',
        params: {
          materialId
        },
        search
      });
    },
    [navigate, search]
  );

  const handleAddMaterial = useCallback(() => {
    navigate({
      to: './new',
      search
    });
  }, [navigate, search]);

  const handleSearchChange = useCallback((value: string | undefined) => {
    navigate({
      to: '.',
      search: {
        ...search,
        filter: value ?? ''
      }
    });
  }, []);

  return (
    <div className={'flex h-full flex-col'}>
      <Outlet />
      <PageHeader title={'Quản lý danh mục vật tư'} />
      <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'} onClick={handleAddMaterial}>
            <PlusIcon className={'h-5 w-5'} />
            Thêm vật tư
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
