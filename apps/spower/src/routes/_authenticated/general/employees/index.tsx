import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { CircleCheckIcon, EditIcon, SheetIcon, UserIcon } from 'lucide-react';

import { Collections, getImageUrl } from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  CommonTable,
  DebouncedInput,
  success,
  useConfirm
} from '@storeo/theme';

import { EmployeesSearchSchema, UserData, employeeApi } from '../../../../api';

const Component = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const listEmployees = employeeApi.list.useQuery({
    variables: search
  });

  const deleteEmployee = employeeApi.delete.useMutation({
    onSuccess: async () => {
      success('Xóa nhân viên thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: employeeApi.list.getKey(search)
        })
      ]);
    }
  });

  const { confirm } = useConfirm();

  const columnHelper = createColumnHelper<UserData>();

  const columns = [
    columnHelper.accessor('avatar', {
      cell: ({ row }) => (
        <div className={'flex justify-center'}>
          <Avatar className={'h-6 w-6 '}>
            <AvatarImage
              src={getImageUrl(
                Collections.User,
                row.original.id,
                row.original.avatar
              )}
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
    }),
    columnHelper.accessor('title', {
      cell: ({ row }) => {
        return row.original.title;
      },
      header: () => 'Chức danh',
      footer: info => info.column.id
    }),
    columnHelper.accessor('role', {
      cell: ({ row }) => {
        return row.original.role === 1 ? (
          <div className={'flex w-full justify-center'}>
            <CircleCheckIcon className={'text-appBlue'} />
          </div>
        ) : null;
      },
      header: () => 'Quyền duyệt',
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
            <Button
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={() =>
                confirm('Bạn chắc chắn muốn xóa nhân viên này?', () => {
                  deleteEmployee.mutate(row.original.id);
                })
              }
            >
              <Cross2Icon className={'h-3 w-3'} />
            </Button>
          </div>
        );
      },
      header: () => 'Thao tác'
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
          data={listEmployees.data?.items ?? []}
          columns={columns}
          rowCount={listEmployees.data?.totalItems}
          pageCount={listEmployees.data?.totalPages}
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

export const Route = createFileRoute('/_authenticated/general/employees/')({
  component: Component,
  validateSearch: (search?: Record<string, unknown>) =>
    EmployeesSearchSchema.validateSync(search),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(employeeApi.list.getOptions(deps.search))
});