import { useQueryClient } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ObjectData } from 'libs/api/src/api/object';
import { CheckIcon, CopyIcon, EditIcon, PlusIcon, XIcon } from 'lucide-react';
import { api } from 'portal-api';
import { ObjectTypeOptions } from 'portal-core';

import { useCallback, useMemo, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  error,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { PageHeader } from '../../../components';
import { IndeterminateCheckbox } from '../../../components/checkbox';
import { useInvalidateQueries } from '../../../hooks';

export const Route = createFileRoute('/_authenticated/settings/objects')({
  component: Component,
  loader: ({ context: { queryClient } }) =>
    queryClient?.ensureQueryData(api.object.listFull.getOptions()),
  beforeLoad: () => {
    return {
      title: 'Quản lý đối tượng'
    };
  }
});

function Component() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const listObjects = api.object.listFull.useSuspenseQuery();
  const invalidates = useInvalidateQueries();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columnHelper = createColumnHelper<ObjectData>();

  const deleteObject = api.object.delete.useMutation({
    onSuccess: async () => {
      success('Xóa đối tượng thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: api.object.listFull.getKey()
        })
      ]);
    },
    onError: () => {
      error('Xóa đối tượng thất bại');
    }
  });

  const duplicateObject = api.object.duplicate.useMutation({
    onSuccess: async () => {
      success('Nhân bản đối tượng thành công');
      invalidates([api.object.listFull.getKey()]);
    },
    onError: () => {
      error('Nhân bản đối tượng thất bại');
    }
  });

  const activateObjects = api.object.actives.useMutation({
    onSuccess: async () => {
      success('Kích hoạt đối tượng thành công');
      setRowSelection({});
      invalidates([api.object.listFull.getKey()]);
    },
    onError: () => {
      error('Kích hoạt đối tượng thất bại');
    }
  });

  const { confirm } = useConfirm();

  const handleDuplicateObject = useCallback(
    (objectId: string) => {
      confirm('Bạn có chắc chắn muốn nhân bản đối tượng này?', () => {
        duplicateObject.mutate(objectId);
      });
    },
    [confirm, duplicateObject]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        cell: ({ row }) => (
          <div className={'flex items-center justify-center'}>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        ),
        header: () => (
          <div className={'flex items-center justify-center'}>
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          </div>
        ),
        size: 40
      }),
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
                    to: './$objectId/edit',
                    params: {
                      objectId: row.original.id
                    }
                  });
                }}
              >
                <EditIcon className={'h-3 w-3'} />
              </Button>
              <Button
                className={'h-6 px-3'}
                onClick={e => {
                  e.stopPropagation();
                  handleDuplicateObject(row.original.id);
                }}
              >
                <CopyIcon className={'h-3 w-3'} />
              </Button>
              <Button
                variant={'destructive'}
                className={'h-6 px-3'}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  confirm('Bạn chắc chắn muốn xóa đối tượng này?', () => {
                    deleteObject.mutate(row.original.id);
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
        header: () => 'Tên đối tượng',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('active', {
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              ''
            )}
          </div>
        ),
        header: () => 'Kích hoạt',
        footer: info => info.column.id,
        size: 100
      }),

      columnHelper.accessor('type', {
        cell: info => {
          const type = info.getValue();
          const badgeStyle =
            'rounded-full px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap';

          switch (type) {
            case ObjectTypeOptions.Task:
              return (
                <span className={cn(badgeStyle, 'bg-green-500')}>
                  Công việc
                </span>
              );
            case ObjectTypeOptions.Request:
              return (
                <span className={cn(badgeStyle, 'bg-red-500')}>Yêu cầu</span>
              );
            case ObjectTypeOptions.Price:
              return (
                <span className={cn(badgeStyle, 'bg-blue-500')}>Báo giá</span>
              );
            case ObjectTypeOptions.Document:
              return (
                <span className={cn(badgeStyle, 'bg-purple-500')}>
                  Tài liệu
                </span>
              );
            default:
              return (
                <span className={cn(badgeStyle, 'bg-gray-500')}>{type}</span>
              );
          }
        },
        header: () => 'Loại',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor(row => row.expand?.process?.name, {
        id: 'processName',
        cell: info => info.getValue() || '',
        header: () => 'Quy trình',
        footer: info => info.column.id,
        size: 150
      }),

      columnHelper.accessor('base', {
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() ? (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                Cơ bản
              </span>
            ) : null}
          </div>
        ),
        header: () => 'Cơ bản',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('description', {
        cell: info => info.getValue() || '',
        header: () => 'Mô tả',
        footer: info => info.column.id
      })
    ],
    [columnHelper, navigate, handleDuplicateObject, deleteObject, confirm]
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: listObjects.data || [],
    state: {
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection
  });

  const handleActivateSelected = useCallback(() => {
    const selectedIds = Object.keys(rowSelection)
      .map(index => {
        const row = table.getRowModel().rows.find(row => row.id === index);
        return row?.original.id;
      })
      .filter(Boolean) as string[];

    if (selectedIds.length === 0) return;

    confirm('Bạn có chắc chắn muốn kích hoạt các đối tượng đã chọn?', () => {
      activateObjects.mutate(selectedIds);
    });
  }, [activateObjects, confirm, rowSelection, table]);

  const selectedRows = Object.keys(rowSelection).length;

  return (
    <div className={'flex h-full flex-col'}>
      <Outlet />
      <PageHeader title={'Quản lý đối tượng'} />
      <div className={'flex min-h-0 flex-1 flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button
            className={'flex gap-1'}
            onClick={() =>
              navigate({
                to: './new'
              })
            }
          >
            <PlusIcon className={'h-5 w-5'} />
            Thêm đối tượng
          </Button>
          <Button
            className={'flex gap-1'}
            onClick={handleActivateSelected}
            disabled={selectedRows === 0}
          >
            <CheckIcon className={'h-4 w-4'} />
            Kích hoạt ({selectedRows})
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
                      className={cn(
                        'cursor-pointer last:border-b-0',
                        row.getIsSelected() && 'bg-blue-50'
                      )}
                      onClick={() => {
                        navigate({
                          to: './$objectId/edit',
                          params: {
                            objectId: row.original.id
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
  );
}
