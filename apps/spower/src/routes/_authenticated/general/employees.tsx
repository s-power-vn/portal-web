import { useQueryClient } from '@tanstack/react-query';
import {
  Outlet,
  SearchSchemaInput,
  createFileRoute,
  useNavigate
} from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EditIcon, PlusIcon, UserIcon, XIcon } from 'lucide-react';

import { useState } from 'react';

import { Collections, getImageUrl } from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DebouncedInput,
  SubmitButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  success,
  useConfirm
} from '@storeo/theme';

import { UserData, employeeApi } from '../../../api';
import { SearchSchema } from '../../../api/types';
import { PageHeader } from '../../../components';

const Component = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const [search, setSearch] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const listEmployees = employeeApi.listFull.useSuspenseQuery({
    variables: search
  });

  const deleteEmployee = employeeApi.delete.useMutation({
    onSuccess: async () => {
      success('Xóa nhân viên thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: employeeApi.listFull.getKey(search)
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
      footer: info => info.column.id,
      size: 30
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
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
            <SubmitButton
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
            </SubmitButton>
            <SubmitButton
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={() =>
                confirm('Bạn chắc chắn muốn xóa nhân viên này?', () => {
                  deleteEmployee.mutate(row.original.id);
                })
              }
            >
              <XIcon className={'h-3 w-3'} />
            </SubmitButton>
          </div>
        );
      },
      header: () => 'Thao tác',
      size: 50
    })
  ];

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: listEmployees.data || []
  });

  return (
    <>
      <Outlet />
      <PageHeader title={'Quản lý nhân viên'} />
      <div className={'flex flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <SubmitButton
            className={'flex gap-1'}
            onClick={() =>
              navigate({
                to: './new',
                search
              })
            }
          >
            <PlusIcon className={'h-5 w-5'} />
            Thêm nhân viên
          </SubmitButton>
          <DebouncedInput
            value={search}
            className={'h-9 w-56'}
            placeholder={'Tìm kiếm...'}
            onChange={value => {
              setSearch(value);
            }}
          />
        </div>
        <div
          className={
            'border-appBlue h-[calc(100vh-10rem)] overflow-auto rounded-md border'
          }
        >
          <Table>
            <TableHeader
              className={'bg-appBlueLight'}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2
              }}
            >
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className={'hover:bg-appBlue'}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={'text-appWhite whitespace-nowrap'}
                      style={{
                        width: table.getRowModel().rows.length
                          ? header.getSize()
                          : undefined
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className={'cursor-pointer last:border-b-0'}
                    onClick={() =>
                      navigate({
                        to: './$employeeId/edit',
                        params: {
                          employeeId: row.original.id
                        }
                      })
                    }
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className={
                          'max-w-60 truncate whitespace-nowrap text-left'
                        }
                        style={{
                          width: table.getRowModel().rows.length
                            ? cell.column.getSize()
                            : undefined
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
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_authenticated/general/employees')({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    SearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(employeeApi.list.getOptions(deps.search)),
  beforeLoad: () => {
    return {
      title: 'Quản lý nhân viên'
    };
  }
});
