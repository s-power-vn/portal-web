import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { PlusIcon, XIcon } from 'lucide-react';
import { api } from 'portal-api';
import { ProcessResponse, formatDate } from 'portal-core';

import { useCallback } from 'react';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { EmployeeDisplay, PageHeader } from '../../../components';
import { useInvalidateQueries } from '../../../hooks';

export const Route = createFileRoute('/_authenticated/settings/process')({
  component: RouteComponent,
  beforeLoad: () => ({ title: 'Quản lý quy trình' })
});

function RouteComponent() {
  const { data: process } = api.process.listFull.useSuspenseQuery();
  const navigate = useNavigate({ from: Route.fullPath });
  const invalidates = useInvalidateQueries();

  const handleAddProcess = useCallback(() => {
    navigate({
      to: './new'
    });
  }, [navigate]);

  const deleteProcess = api.process.delete.useMutation({
    onSuccess: async () => {
      success('Xóa quy trình thành công');
      invalidates([api.process.listFull.getKey()]);
    }
  });

  const { confirm } = useConfirm();

  const columnHelper = createColumnHelper<ProcessResponse>();

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
      header: () => 'Tên quy trình',
      footer: info => info.column.id
    }),
    columnHelper.accessor('type', {
      cell: info => info.getValue(),
      header: () => 'Đối tượng áp dụng',
      footer: info => info.column.id,
      size: 120
    }),
    columnHelper.accessor('createdBy', {
      cell: info => <EmployeeDisplay employeeId={info.getValue()} />,
      header: () => 'Người tạo',
      footer: info => info.column.id,
      size: 150
    }),
    columnHelper.accessor('created', {
      cell: info => formatDate(info.getValue()),
      header: () => 'Ngày tạo',
      footer: info => info.column.id,
      size: 100
    }),
    columnHelper.accessor('updated', {
      cell: info => formatDate(info.getValue()),
      header: () => 'Ngày cập nhật',
      footer: info => info.column.id,
      size: 100
    }),
    columnHelper.display({
      size: 100,
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
            <Button className={'flex h-6 gap-1 px-3 text-xs'}>Áp dụng</Button>
            <Button
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                confirm('Bạn chắc chắn muốn xóa quy trình này?', () => {
                  deleteProcess.mutate(row.original.id);
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
    data: process || []
  });

  return (
    <>
      <Outlet />
      <div className={'flex h-full flex-col'}>
        <PageHeader title={'Quản lý quy trình'} />
        <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
          <div className={'flex gap-2'}>
            <Button className={'flex gap-1'} onClick={handleAddProcess}>
              <PlusIcon className={'h-5 w-5'} />
              Thêm quy trình
            </Button>
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
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map(row => (
                      <TableRow
                        key={row.id}
                        className={'cursor-pointer last:border-b-0'}
                        onClick={() => {
                          navigate({
                            to: './$processId/edit',
                            params: {
                              processId: row.original.id
                            }
                          });
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
    </>
  );
}
