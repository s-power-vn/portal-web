import { PlusIcon } from '@radix-ui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { SheetIcon, UserIcon } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  CommonTable,
  DebouncedInput
} from '@storeo/theme';

import { EmployeesSearchSchema, UserData, getEmployees } from '../../../api';

const Component = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const employees = useSuspenseQuery(getEmployees(search));

  const columnHelper = createColumnHelper<UserData>();

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
        return row.original.expand.department.name;
      },
      header: () => 'Phòng ban',
      footer: info => info.column.id
    })
  ];

  return (
    <>
      <Outlet />
      <div className={'flex flex-col gap-2 p-2'}>
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
        <CommonTable
          data={employees.data?.items ?? []}
          columns={columns}
          rowCount={employees.data?.totalItems}
          pageCount={employees.data?.totalPages}
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
        ></CommonTable>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_authenticated/general/employees')({
  component: Component,
  validateSearch: (search?: Record<string, unknown>) =>
    EmployeesSearchSchema.validateSync(search),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(getEmployees(deps.search)),
  beforeLoad: () => {
    return {
      title: 'Quản lý nhân viên'
    };
  }
});
