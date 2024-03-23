import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EditIcon, SheetIcon, UserIcon } from 'lucide-react';
import PocketBase from 'pocketbase';
import { InferType, number, object, string } from 'yup';

import { DepartmentResponse, UserResponse, usePb } from '@storeo/core';
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

const employeeSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type EmployeeSearch = InferType<typeof employeeSearchSchema>;

function getEmployees(search: EmployeeSearch, pb?: PocketBase) {
  const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
  return pb
    ?.collection<UserResponse>('user')
    .getList(search.pageIndex, search.pageSize, {
      filter,
      sort: '-created',
      expand: 'department'
    });
}

function employeesOptions(search: EmployeeSearch, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['employees', search],
    queryFn: () => getEmployees(search, pb)
  });
}

const Component = () => {
  const pb = usePb();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const employeesQuery = useSuspenseQuery(employeesOptions(search, pb));

  const columnHelper = createColumnHelper<UserResponse>();

  const columns = [
    columnHelper.accessor('avatar', {
      cell: ({ row }) => (
        <div className={'flex justify-center'}>
          <Avatar className={'h-6 w-6 '}>
            <AvatarImage
              src={`http://localhost:8090/api/files/user/${row.original.id}/${row.original.avatar}`}
            />
            <AvatarFallback className={'text-sm'}>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </div>
      ),
      header: () => <div className={'flex justify-center'}>Ảnh</div>,
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
            department: DepartmentResponse;
          }
        ).department.name;
      },
      header: () => 'Phòng ban',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
            <Button
              className={'h-6 px-3'}
              onClick={() =>
                navigate({
                  to: './$employeeId/edit',
                  params: {
                    employeeId: row.original.id
                  },
                  search
                })
              }
            >
              <EditIcon className={'h-3 w-3'} />
            </Button>
            <Button variant={'destructive'} className={'h-6 px-3'}>
              <Cross2Icon className={'h-3 w-3'} />
            </Button>
          </div>
        );
      },
      header: () => 'Thao tác'
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
        <div className={'flex gap-2'}>
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
          <Button
            variant={'outline'}
            className={'flex gap-1'}
            onClick={() =>
              navigate({
                to: './new',
                search
              })
            }
          >
            <SheetIcon />
            Nhập từ Excel
          </Button>
        </div>
        <DebouncedInput
          value={search.filter}
          className={'h-8 w-56'}
          placeholder={'Tìm kiếm...'}
          onChange={value =>
            navigate({
              to: './',
              search: {
                ...search,
                filter: value ?? ''
              }
            })
          }
        />
        <div className={'rounded-md border'}>
          <Table>
            <TableHeader className={'bg-appGrayLight'}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={'border-r last:border-r-0'}
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
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={'border-r px-2 py-1 last:border-r-0'}
                    >
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
              search: prev => {
                return { ...prev, pageIndex: prev.pageIndex + 1 };
              }
            })
          }
          onPagePrev={() =>
            navigate({
              to: './',
              search: prev => {
                return { ...prev, pageIndex: prev.pageIndex - 1 };
              }
            })
          }
          onPageSizeChange={pageSize =>
            navigate({
              to: './',
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

export const Route = createFileRoute('/_authenticated/general/employees')({
  component: Component,
  validateSearch: (search?: Record<string, unknown>) =>
    employeeSearchSchema.validateSync(search),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { pb, queryClient } }) =>
    queryClient?.ensureQueryData(employeesOptions(deps.search, pb)),
  beforeLoad: () => {
    return {
      title: 'Quản lý nhân viên'
    };
  }
});
