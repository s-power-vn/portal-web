import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ProcessDbData } from 'libs/api/src/api/process';
import { CopyIcon, PlusIcon, XIcon } from 'lucide-react';
import { api } from 'portal-api';

import { useCallback } from 'react';

import { formatDateTime } from '@minhdtb/storeo-core';
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  showModal,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { EmployeeDisplay, PageHeader } from '../../../components';
import { ApplyProcessForm } from '../../../components/domains/process/form/apply-process-form';
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

  const duplicateProcess = api.process.duplicate.useMutation({
    onSuccess: async () => {
      success('Nhân bản quy trình thành công');
      invalidates([api.process.listFull.getKey()]);
    }
  });

  const { confirm } = useConfirm();

  const columnHelper = createColumnHelper<ProcessDbData>();

  const handleApplyProcess = useCallback((processId: string) => {
    showModal({
      title: 'Áp dụng quy trình',
      children: ({ close }) => (
        <ApplyProcessForm
          processId={processId}
          onSuccess={() => {
            close();
            invalidates([
              api.process.listFull.getKey(),
              api.process.byId.getKey()
            ]);
          }}
          onCancel={close}
        />
      )
    });
  }, []);

  const handleDuplicateProcess = useCallback(
    (processId: string) => {
      confirm('Bạn có chắc chắn muốn nhân bản quy trình này?', () => {
        duplicateProcess.mutate(processId);
      });
    },
    [confirm, duplicateProcess]
  );

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
    columnHelper.display({
      size: 180,
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
            <Button
              className={'flex h-6 gap-1 px-3 text-xs'}
              onClick={e => {
                e.stopPropagation();
                handleApplyProcess(row.original.id);
              }}
            >
              Áp dụng
            </Button>
            <Button
              className={'h-6 px-3'}
              onClick={e => {
                e.stopPropagation();
                handleDuplicateProcess(row.original.id);
              }}
            >
              <CopyIcon className={'h-3 w-3'} />
            </Button>
            <Button
              variant={'destructive'}
              className={'h-6 px-3'}
              onClick={e => {
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
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Tên quy trình',
      footer: info => info.column.id,
      size: 300
    }),
    columnHelper.accessor('expand.object_via_process', {
      cell: info => {
        const objects = info.getValue();
        if (!objects || objects.length === 0) {
          return (
            <span className="text-xs italic text-gray-400">Chưa áp dụng</span>
          );
        }

        // Display up to 3 badges, then show a count for the rest
        const displayLimit = 3;
        const hasMore = objects.length > displayLimit;
        const displayObjects = hasMore
          ? objects.slice(0, displayLimit)
          : objects;

        return (
          <div className="flex flex-wrap gap-1">
            {displayObjects.map(object => (
              <Badge
                key={object.id}
                className="bg-appBlueLight text-appWhite text-xs"
              >
                {object.name}
              </Badge>
            ))}
            {hasMore && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="cursor-pointer bg-gray-500 text-xs text-white">
                      +{objects.length - displayLimit}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-1">
                      {objects.slice(displayLimit).map(object => (
                        <div
                          key={object.id}
                          className="whitespace-nowrap text-xs"
                        >
                          {object.name}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
      header: () => 'Đối tượng áp dụng',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('createdBy', {
      cell: info => <EmployeeDisplay employeeId={info.getValue()} />,
      header: () => 'Người tạo',
      footer: info => info.column.id,
      size: 200
    }),
    columnHelper.accessor('created', {
      cell: info => formatDateTime(info.getValue()),
      header: () => 'Ngày tạo',
      footer: info => info.column.id
    }),
    columnHelper.accessor('updated', {
      cell: info => formatDateTime(info.getValue()),
      header: () => 'Ngày cập nhật',
      footer: info => info.column.id
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
