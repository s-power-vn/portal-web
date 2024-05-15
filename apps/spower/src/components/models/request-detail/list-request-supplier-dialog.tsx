import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EditIcon } from 'lucide-react';

import React, { FC, useState } from 'react';

import { DialogProps, formatCurrency, formatNumber } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import {
  RequestDetailData,
  RequestDetailSupplierData,
  requestApi,
  requestDetailSupplierApi
} from '../../../api';
import { TreeData } from '../../../commons/utils';
import { EditRequestSupplierDialog } from './edit-request-supplier-dialog';
import { NewRequestSupplierDialog } from './new-request-supplier-dialog';

const Content: FC<ListRequestSupplierDialogProps> = ({ requestDetail }) => {
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [requestDetailSupplier, setRequestDetailSupplier] =
    useState<RequestDetailSupplierData>();

  const requestDetailSuppliers = requestDetailSupplierApi.listFull.useQuery({
    variables: requestDetail.id
  });

  const queryClient = useQueryClient();

  const deleteRequestDetailSupplier =
    requestDetailSupplierApi.delete.useMutation({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: requestDetailSupplierApi.listFull.getKey(requestDetail.id)
          }),
          queryClient.invalidateQueries({
            queryKey: requestApi.byId.getKey(requestDetail.request)
          })
        ]);
      }
    });

  const columnHelper = createColumnHelper<RequestDetailSupplierData>();

  const columns = [
    columnHelper.accessor('supplier', {
      cell: ({ row }) => row.original.expand?.supplier?.name,
      header: () => 'Nhà cung cấp',
      footer: info => info.column.id
    }),
    columnHelper.accessor('price', {
      cell: ({ row }) => formatCurrency(row.original.price),
      header: () => 'Đơn giá',
      footer: info => info.column.id
    }),
    columnHelper.accessor('volume', {
      cell: ({ row }) => formatNumber(row.original.volume),
      header: () => 'Khối lượng',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'unit',
      cell: ({ row }) => row.original.expand.requestDetail.expand.detail.unit,
      header: () => 'Đơn vị',
      footer: info => info.column.id
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className={'flex gap-1'}>
            <Button
              className={'h-6 px-3'}
              onClick={() => {
                setRequestDetailSupplier(row.original);
                setOpenEdit(true);
              }}
            >
              <EditIcon className={'h-3 w-3'} />
            </Button>
            <Button variant={'destructive'} className={'h-6 px-3'}>
              <Cross2Icon
                className={'h-3 w-3'}
                onClick={() => {
                  deleteRequestDetailSupplier.mutate(row.original.id);
                }}
              />
            </Button>
          </div>
        );
      },
      header: () => 'Thao tác'
    })
  ];

  const table = useReactTable({
    data: requestDetailSuppliers.data ?? [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <NewRequestSupplierDialog
        open={openNew}
        setOpen={setOpenNew}
        requestDetailId={requestDetail.id}
      />
      {requestDetailSupplier ? (
        <EditRequestSupplierDialog
          open={openEdit}
          setOpen={setOpenEdit}
          requestDetailSupplierId={requestDetailSupplier.id}
        />
      ) : null}
      <DialogContent className={'min-w-[600px]'}>
        <DialogHeader>
          <DialogTitle>Quản lý nhà cung cấp</DialogTitle>
          <DialogDescription className={'italic'}>
            {requestDetail ? (
              <>
                <span
                  className={'inline font-bold'}
                >{`Hạng mục: ${requestDetail.level} `}</span>
                {` (${requestDetail.expand.detail.title})`}
              </>
            ) : (
              'Tạo đầu mục mô tả công việc chính'
            )}
          </DialogDescription>
        </DialogHeader>
        <div className={'flex gap-2'}>
          <Button
            className={'flex gap-1'}
            onClick={() => {
              setOpenNew(true);
            }}
          >
            <PlusIcon />
            Thêm nhà cung cấp
          </Button>
        </div>
        <div className={'border-appBlue rounded-md border'}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={
                        'bg-appBlueLight text-appWhite border-r first:rounded-tl last:rounded-tr last:border-r-0'
                      }
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
                  <TableRow key={row.id} className={'last:border-b-0'}>
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    Chưa có nhà cung cấp nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </>
  );
};

export type ListRequestSupplierDialogProps = DialogProps & {
  requestDetail: TreeData<RequestDetailData>;
};

export const ListRequestSupplierDialog: FC<
  ListRequestSupplierDialogProps
> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
