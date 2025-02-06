import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { PlusIcon, XIcon } from 'lucide-react';
import { api } from 'portal-api';
import type { ColumnResponse } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  showModal,
  success,
  useConfirm
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import { NewColumnForm } from './form/new-column-form';

export type ColumnManagerProps = {
  projectId: string;
  onClose?: () => void;
};

export const ColumnManager: FC<ColumnManagerProps> = ({
  projectId,
  onClose
}) => {
  const invalidates = useInvalidateQueries();
  const listColumn = api.project.listColumn.useSuspenseQuery({
    variables: projectId
  });

  const handleNewColumn = useCallback(() => {
    showModal({
      title: 'Thêm cột',
      className: 'w-[25rem]',
      children: ({ close }) => {
        return (
          <NewColumnForm
            projectId={projectId}
            onSuccess={() => {
              invalidates([
                api.project.listColumn.getKey(),
                api.project.byId.getKey(projectId)
              ]);
              close();
            }}
            onCancel={close}
          />
        );
      }
    });
  }, [invalidates, projectId]);

  const columnHelper = createColumnHelper<ColumnResponse>();

  const deleteColumn = api.project.deleteColumn.useMutation({
    onSuccess: async () => {
      success('Xóa cột thành công');
      await invalidates([
        api.project.listColumn.getKey(),
        api.project.byId.getKey(projectId)
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
    columnHelper.accessor('title', {
      cell: info => info.getValue(),
      header: () => 'Tên cột',
      footer: info => info.column.id
    }),
    columnHelper.accessor('type', {
      cell: info => info.getValue(),
      header: () => 'Loại dữ liệu',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <Button
            variant={'destructive'}
            className={'h-6 px-3'}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              confirm('Bạn chắc chắn muốn xóa cột này?', () => {
                deleteColumn.mutate(row.original.id);
              });
            }}
          >
            <XIcon className={'h-3 w-3'} />
          </Button>
        );
      },
      header: () => 'Thao tác'
    })
  ];

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: listColumn.data || []
  });

  return (
    <>
      <div className={'mb-2 flex justify-start gap-2'}>
        <Button onClick={handleNewColumn}>
          <PlusIcon />
        </Button>
      </div>
      <div className={'border-appBlue rounded-md border'}>
        <Table
          style={{
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
      <div className={'mt-6 flex justify-end gap-2'}>
        <Button onClick={onClose}>Bỏ qua</Button>
      </div>
    </>
  );
};
