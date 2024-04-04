import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EditIcon } from 'lucide-react';

import React, { FC, useState } from 'react';

import {
  DialogProps,
  DocumentDetailData,
  DocumentDetailResponse,
  DocumentRequestDetailResponse,
  DocumentRequestDetailSupplierResponse,
  SupplierResponse,
  client,
  formatCurrency,
  formatNumber
} from '@storeo/core';
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

import { EditDocumentRequestSupplierDialog } from './edit-document-request-supplier-dialog';
import { NewDocumentRequestSupplierDialog } from './new-document-request-supplier-dialog';

export type DocumentRequestDetailSupplierData =
  DocumentRequestDetailSupplierResponse & {
    expand: {
      supplier: SupplierResponse;
      documentRequestDetail: DocumentRequestDetailResponse & {
        expand: {
          documentDetail: DocumentDetailResponse;
        };
      };
    };
  };

export function getDocumentRequestSuppliersOptions(
  documentRequestDetailId: string
) {
  return queryOptions({
    queryKey: ['getDocumentRequestSuppliers', documentRequestDetailId],
    queryFn: () =>
      client
        .collection<DocumentRequestDetailSupplierData>(
          'documentRequestDetailSupplier'
        )
        .getFullList({
          filter: `documentRequestDetail = "${documentRequestDetailId}"`,
          expand: 'supplier,documentRequestDetail.documentDetail'
        })
  });
}

const Content: FC<ListDocumentSupplierDialogProps> = ({
  open,
  documentRequestDetail
}) => {
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [documentRequestSupplier, setDocumentRequestSupplier] =
    useState<DocumentRequestDetailSupplierData>();

  const documentRequestSuppliersQuery = useQuery({
    ...getDocumentRequestSuppliersOptions(documentRequestDetail?.id ?? ''),
    enabled: open
  });

  const queryClient = useQueryClient();

  const deleteDocumentRequestSupplierMutation = useMutation({
    mutationKey: ['deleteDocumentRequestSupplier', documentRequestDetail?.id],
    mutationFn: async (documentRequestSupplierId: string) => {
      await client
        .collection<DocumentRequestDetailSupplierResponse>(
          'documentRequestDetailSupplier'
        )
        .delete(documentRequestSupplierId);
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getDocumentRequestSuppliers', documentRequestDetail?.id]
        }),
        queryClient.invalidateQueries({
          queryKey: ['getDocumentRequest']
        })
      ])
  });
  const columnHelper = createColumnHelper<DocumentRequestDetailSupplierData>();

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
      cell: ({ row }) =>
        row.original.expand.documentRequestDetail.expand.documentDetail.unit,
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
                setDocumentRequestSupplier(row.original);
                setOpenEdit(true);
              }}
            >
              <EditIcon className={'h-3 w-3'} />
            </Button>
            <Button variant={'destructive'} className={'h-6 px-3'}>
              <Cross2Icon
                className={'h-3 w-3'}
                onClick={() => {
                  deleteDocumentRequestSupplierMutation.mutate(row.original.id);
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
    data: documentRequestSuppliersQuery.data ?? [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <DialogContent className={'min-w-[600px]'}>
      <DialogHeader>
        <DialogTitle>Quản lý nhà cung cấp</DialogTitle>
        <DialogDescription className={'italic'}>
          {documentRequestDetail ? (
            <>
              <span
                className={'inline font-bold'}
              >{`Hạng mục: ${documentRequestDetail.level} `}</span>
              {` (${documentRequestDetail.title})`}
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
      <NewDocumentRequestSupplierDialog
        open={openNew}
        setOpen={setOpenNew}
        documentRequestDetailId={documentRequestDetail?.id ?? ''}
      />
      <EditDocumentRequestSupplierDialog
        open={openEdit}
        setOpen={setOpenEdit}
        documentRequestSupplier={documentRequestSupplier}
      />
      <div className={'rounded-md border'}>
        <Table>
          <TableHeader className={'bg-appGrayLight'}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={
                      'border-r first:rounded-tl-md last:rounded-tr-md last:border-r-0'
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
  );
};

export type ListDocumentSupplierDialogProps = DialogProps & {
  documentRequestDetail?: DocumentDetailData;
};

export const ListDocumentRequestSupplierDialog: FC<
  ListDocumentSupplierDialogProps
> = ({ open, setOpen, documentRequestDetail }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Content
        open={open}
        setOpen={setOpen}
        documentRequestDetail={documentRequestDetail}
      />
    </Dialog>
  );
};
