import { useQueryClient } from '@tanstack/react-query';
import type { SearchSchemaInput } from '@tanstack/react-router';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EditIcon, PlusIcon, XIcon } from 'lucide-react';
import { SearchSchema, api } from 'portal-api';
import type { CustomerResponse } from 'portal-core';

import { useState } from 'react';

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

import { PageHeader } from '../../../components';

const Component = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const [search, setSearch] = useState<string | undefined>();

  const listCustomers = api.customer.listFull.useSuspenseQuery({
    variables: search
  });

  const columnHelper = createColumnHelper<CustomerResponse>();

  const deleteCustomer = api.customer.delete.useMutation({
    onSuccess: async () => {
      success('Xóa chủ đầu tư thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: api.customer.listFull.getKey(search)
        })
      ]);
    }
  });

  const { confirm } = useConfirm();

  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => (
        <div className={'flex items-center justify-center'}>
          {info.row.index + 1}
        </div>
      ),
      header: () => <div className={'flex items-center justify-center'}>#</div>,
      size: 30
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Tên chủ đầu tư',
      footer: info => info.column.id,
      size: 300
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
    columnHelper.accessor('address', {
      cell: info => info.getValue(),
      header: () => 'Địa chỉ',
      footer: info => info.column.id
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
              onClick={() =>
                navigate({
                  to: './$customerId/edit',
                  params: {
                    customerId: row.original.id
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
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                confirm('Bạn chắc chắn muốn xóa chủ đầu tư này?', () => {
                  deleteCustomer.mutate(row.original.id);
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
  ];

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: listCustomers.data || []
  });

  return (
    <div className={'flex h-full flex-col'}>
      <Outlet />
      <PageHeader title={'Quản lý chủ đầu tư'} />
      <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
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
            <PlusIcon className={'h-5 w-5'} />
            Thêm chủ đầu tư
          </Button>
          <DebouncedInput
            value={search}
            className={'h-9 w-56'}
            placeholder={'Tìm kiếm...'}
            onChange={value => setSearch(value)}
          />
        </div>
        <div
          className={
            'border-appBlue relative min-h-0 flex-1 overflow-hidden rounded-md border'
          }
        >
          <div className="absolute inset-0 overflow-auto">
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
                  <TableRow key={headerGroup.id} className={'hover:bg-appBlue'}>
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
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      className={'cursor-pointer last:border-b-0'}
                      onClick={() =>
                        navigate({
                          to: './$customerId/edit',
                          params: {
                            customerId: row.original.id
                          }
                        })
                      }
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
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/settings/customers')({
  component: Component,
  validateSearch: (input: unknown & SearchSchemaInput) =>
    SearchSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return { search };
  },
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(api.customer.list.getOptions(deps.search)),
  beforeLoad: () => {
    return {
      title: 'Quản lý chủ đầu tư'
    };
  }
});
