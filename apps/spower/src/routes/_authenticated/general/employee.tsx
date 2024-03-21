import { PlusIcon } from '@radix-ui/react-icons';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { UserIcon } from 'lucide-react';
import PocketBase from 'pocketbase';

import { DepartmentsResponse, UsersResponse, usePb } from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DebouncedInput,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

type EmployeeSearch = {
  pageIndex: number;
  pageSize: number;
  filter?: string | number;
};

function getEmployees(search: EmployeeSearch, pb?: PocketBase) {
  const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
  return pb
    ?.collection('users')
    .getList<UsersResponse>(search.pageIndex, search.pageSize, {
      filter,
      sort: '-created',
      expand: 'department'
    });
}

export function employeesOptions(search: EmployeeSearch, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['employees', search],
    queryFn: () => getEmployees(search, pb)
  });
}

const Employee = () => {
  const pb = usePb();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const employeesQuery = useSuspenseQuery(employeesOptions(search, pb));

  const columnHelper = createColumnHelper<UsersResponse>();

  const columns = [
    columnHelper.accessor('avatar', {
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage
            src={`http://localhost:8090/api/files/users/${row.original.id}/${row.original.avatar}`}
          />
          <AvatarFallback className={'text-sm'}>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      ),
      header: () => 'Ảnh',
      footer: info => info.column.id
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Họ tên',
      footer: info => info.column.id
    }),
    columnHelper.accessor('email', {
      cell: info => info.getValue(),
      header: () => 'Email',
      footer: info => info.column.id
    }),
    columnHelper.accessor('department', {
      cell: ({ row }) => {
        return (
          row.original.expand as {
            department: DepartmentsResponse;
          }
        ).department.name;
      },
      header: () => 'Phòng ban',
      footer: info => info.column.id
    })
  ];

  const table = useReactTable({
    data: employeesQuery.data?.items ?? [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <Outlet />
      <div className={'flex flex-col gap-2'}>
        <div className={'flex'}>
          <Button
            className={'flex gap-1'}
            onClick={() =>
              navigate({
                to: './new',
                search
              })
            }
          >
            <PlusIcon />
            Thêm nhân viên
          </Button>
        </div>
        <DebouncedInput
          value={search.filter}
          className={'h-8 w-56'}
          placeholder={'Tìm kiếm...'}
          onChange={value =>
            navigate({
              to: './',
              replace: false,
              search: {
                ...search,
                filter: value
              }
            })
          }
        />
        <div className={'rounded-md border'}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
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
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          totalItems={employeesQuery.data?.totalItems}
          totalPages={employeesQuery.data?.totalPages}
          pageIndex={search.pageIndex}
          pageSize={search.pageSize}
          onPageNext={() =>
            navigate({
              to: './',
              replace: false,
              search: prev => {
                return { ...prev, pageIndex: prev.pageIndex + 1 };
              }
            })
          }
          onPagePrev={() =>
            navigate({
              to: './',
              replace: false,
              search: prev => {
                return { ...prev, pageIndex: prev.pageIndex - 1 };
              }
            })
          }
          onPageSizeChange={pageSize =>
            navigate({
              to: './',
              replace: false,
              search: {
                ...search,
                pageSize
              }
            })
          }
        ></Pagination>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_authenticated/general/employee')({
  component: Employee,
  validateSearch: (search?: Record<string, unknown>): EmployeeSearch => {
    return {
      pageIndex: Number(search?.pageIndex ?? 1),
      pageSize: Number(search?.pageSize ?? 10),
      filter: search?.filter as string
    };
  },
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { pb, queryClient } }) => {
    return queryClient?.ensureQueryData(employeesOptions(deps.search, pb));
  }
});
