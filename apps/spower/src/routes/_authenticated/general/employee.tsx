import { PlusIcon } from '@radix-ui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import { UsersResponse, usePb } from '@storeo/core';
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { employeesOptions } from '../../../api';

type EmployeeSearch = {
  pageIndex: number;
  pageSize: number;
};

const Employee = () => {
  const pb = usePb();
  const navigate = useNavigate({ from: Route.fullPath });
  const pagination = Route.useSearch();
  const employeesQuery = useSuspenseQuery(employeesOptions(pb, pagination));

  const columnHelper = createColumnHelper<UsersResponse>();

  const columns = [
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
      cell: info => info.getValue(),
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
                replace: false,
                search: pagination
              })
            }
          >
            <PlusIcon />
            Thêm nhân viên
          </Button>
        </div>
        <div className={'rounded-md border'}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
          <Pagination
            totalItems={employeesQuery.data?.totalItems}
            currentPage={pagination.pageIndex + 1}
            onPageChange={page =>
              navigate({
                to: './',
                replace: false,
                search: {
                  ...pagination,
                  pageIndex: page - 1
                }
              })
            }
          ></Pagination>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_authenticated/general/employee')({
  component: Employee,
  validateSearch: (search?: Record<string, unknown>): EmployeeSearch => {
    return {
      pageIndex: Number(search?.pageIndex ?? 0),
      pageSize: Number(search?.pageSize ?? 10)
    };
  },
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { pb, queryClient } }) => {
    return queryClient?.ensureQueryData(employeesOptions(pb, deps.search));
  }
});
