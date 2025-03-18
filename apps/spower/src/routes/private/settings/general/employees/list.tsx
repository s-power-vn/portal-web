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
import type { UserData } from 'portal-api';
import { ListSchema, api } from 'portal-api';

import { FC, Suspense, useCallback, useMemo, useRef } from 'react';

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

export const Route = createFileRoute('/_private/settings/general/employees')({
  component: Component,
  validateSearch: input => ListSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(
      api.employee.list.getOptions({
        ...deps.search,
        filter: deps.search.filter
          ? `(name ~ "${deps.search.filter}") || (email ~ "${deps.search.filter}")`
          : ''
      })
    ),
  beforeLoad: () => {
    return {
      title: 'Quản lý nhân viên'
    };
  }
});

export type RoleNameDisplayProps = {
  departmentId?: string;
  roleId?: string;
};

export const RoleNameDisplay: FC<RoleNameDisplayProps> = ({
  departmentId,
  roleId
}) => {
  if (!departmentId || !roleId) return <span>-</span>;

  const department = api.department.byId.useSuspenseQuery({
    variables: departmentId
  });

  const role = useMemo(() => {
    if (department.data?.roles && Array.isArray(department.data.roles)) {
      return department.data.roles.find(r => r.id === roleId);
    }
    return undefined;
  }, [department.data, roleId]);

  return <span>{role?.name || roleId}</span>;
};

function Component() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const invalidates = useInvalidateQueries();
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: api.employee.list.getKey({
        filter: search.filter ?? ''
      }),
      queryFn: ({ pageParam = 1 }) =>
        api.employee.list.fetcher({
          filter: search.filter
            ? `(name ~ "${search.filter}") || (email ~ "${search.filter}")`
            : '',
          pageIndex: pageParam,
          pageSize: 20
        }),
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1
    });

  const employees = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const deleteEmployee = api.employee.delete.useMutation({
    onSuccess: async () => {
      success('Xóa nhân viên thành công');
      invalidates([api.employee.list.getKey({ filter: search.filter ?? '' })]);
    }
  });

  const { confirm } = useConfirm();

  const columnHelper = createColumnHelper<UserData>();

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
        header: () => 'Họ tên',
        footer: info => info.column.id,
        size: 300,
        id: 'name'
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
      columnHelper.accessor('department', {
        cell: ({ row }) => {
          return row.original.expand?.department.name;
        },
        header: () => 'Phòng ban',
        footer: info => info.column.id
      }),
      columnHelper.accessor('role', {
        cell: ({ row }) => {
          const departmentId = row.original.expand?.department.id;
          const roleId = row.original.role;

          return (
            <Suspense
              fallback={<span className="text-gray-400">Loading...</span>}
            >
              <RoleNameDisplay departmentId={departmentId} roleId={roleId} />
            </Suspense>
          );
        },
        header: () => 'Chức danh',
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
                    to: './$employeeId/edit',
                    params: {
                      employeeId: row.original.id
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
                  confirm('Bạn chắc chắn muốn xóa nhân viên này?', () => {
                    deleteEmployee.mutate(row.original.id);
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
    [columnHelper, navigate, confirm, deleteEmployee, search]
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: employees
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
    (employeeId: string) => {
      navigate({
        to: './$employeeId/edit',
        params: {
          employeeId
        },
        search
      });
    },
    [navigate, search]
  );

  const handleAddEmployee = useCallback(() => {
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
      <PageHeader title={'Quản lý nhân viên'} />
      <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'} onClick={handleAddEmployee}>
            <PlusIcon className={'h-5 w-5'} />
            Thêm nhân viên
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
                          className={`text-appWhite whitespace-nowrap ${
                            header.column.id === 'index'
                              ? 'bg-appBlueLight sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                              : header.column.id === 'name'
                                ? 'bg-appBlueLight sticky left-[30px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                                : ''
                          }`}
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
                              className={`truncate text-left ${
                                cell.column.id === 'index'
                                  ? 'sticky left-0 z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                                  : cell.column.id === 'name'
                                    ? 'sticky left-[30px] z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                                    : ''
                              }`}
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
