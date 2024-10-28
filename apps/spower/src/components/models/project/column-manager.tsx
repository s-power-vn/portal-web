import { PlusIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { XIcon } from 'lucide-react';

import { FC, useCallback, useRef } from 'react';

import { ColumnResponse } from '@storeo/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  closeModal,
  showModal,
  success,
  useConfirm
} from '@storeo/theme';

import { projectApi } from '../../../api';
import { NewColumnForm } from './new-column-form';

export type ColumnManagerProps = {
  projectId: string;
  onClose?: () => void;
};

export const ColumnManager: FC<ColumnManagerProps> = ({
  projectId,
  onClose
}) => {
  const modalId = useRef<string | undefined>();

  const queryClient = useQueryClient();
  const listColumn = projectApi.listColumn.useSuspenseQuery({
    variables: projectId
  });

  const onSuccessHandler = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: projectApi.listColumn.getKey()
      }),
      queryClient.invalidateQueries({
        queryKey: projectApi.byId.getKey(projectId)
      })
    ]);
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, [projectId, queryClient]);

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleNewColumn = useCallback(() => {
    modalId.current = showModal({
      title: 'Thêm cột',
      className: 'w-[25rem]',
      children: (
        <NewColumnForm
          projectId={projectId}
          onSuccess={onSuccessHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onSuccessHandler, projectId]);

  const columnHelper = createColumnHelper<ColumnResponse>();

  const deleteColumn = projectApi.deleteColumn.useMutation({
    onSuccess: async () => {
      success('Xóa cột thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectApi.listColumn.getKey()
        }),
        queryClient.invalidateQueries({
          queryKey: projectApi.byId.getKey(projectId)
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