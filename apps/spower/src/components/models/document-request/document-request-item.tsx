import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import {
  ExpandedState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import _ from 'lodash';
import { Edit3, EditIcon, SquareMinusIcon, SquarePlusIcon } from 'lucide-react';

import { FC, useEffect, useMemo, useState } from 'react';

import {
  DocumentDetailData,
  DocumentDetailResponse,
  DocumentRequestDetailResponse,
  DocumentRequestDetailSupplierResponse,
  DocumentRequestResponse,
  SupplierResponse,
  arrayToTree,
  client,
  cn,
  formatCurrency,
  formatNumber,
  getCommonPinningStyles
} from '@storeo/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { EditDocumentRequestDialog } from './edit-document-request-dialog';

export function getDocumentRequestOptions(documentRequestId: string) {
  return queryOptions({
    queryKey: ['getDocumentRequest', documentRequestId],
    queryFn: () =>
      client
        ?.collection<
          DocumentRequestResponse & {
            expand: {
              documentRequestDetail_via_documentRequest: (DocumentRequestDetailResponse & {
                expand: {
                  documentDetail: DocumentDetailResponse;
                  documentRequestDetailSupplier_via_documentRequestDetail: (DocumentRequestDetailSupplierResponse & {
                    expand: {
                      supplier: SupplierResponse;
                    };
                  })[];
                };
              })[];
            };
          }
        >('documentRequest')
        .getOne(documentRequestId, {
          expand:
            'documentRequestDetail_via_documentRequest.documentDetail,' +
            'documentRequestDetail_via_documentRequest.documentRequestDetailSupplier_via_documentRequestDetail.supplier'
        })
  });
}

export type DocumentRequestItemProps = {
  documentRequestId: string;
};

export const DocumentRequestItem: FC<DocumentRequestItemProps> = ({
  documentRequestId
}) => {
  const [openDocumentRequestEdit, setOpenDocumentRequestEdit] = useState(false);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const queryClient = useQueryClient();

  const documentRequestQuery = useSuspenseQuery(
    getDocumentRequestOptions(documentRequestId)
  );

  const deleteDocumentRequest = useMutation({
    mutationKey: ['deleteDocumentRequest'],
    mutationFn: () => {
      return client.send('/delete-document-request', {
        method: 'DELETE',
        body: {
          id: documentRequestId
        }
      });
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getDocumentRequests']
        })
      ])
  });

  const requests = useMemo(() => {
    const v = _.chain(
      documentRequestQuery.data
        ? documentRequestQuery.data.expand[
            'documentRequestDetail_via_documentRequest'
          ]
        : []
    )
      .map(it => {
        return {
          ...it.expand.documentDetail,
          id: it.id,
          documentDetailId: it.expand.documentDetail.id,
          requestVolume: it.volume,
          suppliers:
            it.expand.documentRequestDetailSupplier_via_documentRequestDetail?.map(
              st => {
                return {
                  id: st.expand.supplier.id,
                  name: st.expand.supplier.name,
                  price: st.price
                };
              }
            )
        };
      })
      .value();

    const list = [];
    for (const vi of v) {
      if (vi.suppliers?.length > 0) {
        for (const s of vi.suppliers) {
          list.push({
            ..._.omit(vi, ['suppliers']),
            id: vi.id,
            supplier: s.id,
            supplierUnitPrice: s.price,
            supplierName: s.name
          });
        }
      } else {
        list.push(vi);
      }
    }

    return arrayToTree(list, 'root', 'documentDetailId');
  }, [documentRequestQuery.data]);

  const columnHelper = createColumnHelper<
    DocumentDetailData & {
      requestVolume?: number;
      supplierUnitPrice?: number;
      supplierName?: string;
    }
  >();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center '}>
              {row.getCanExpand() ? (
                <button
                  className={'cursor-pointer'}
                  onClick={e => {
                    e.stopPropagation();
                    row.toggleExpanded();
                  }}
                >
                  {row.getIsExpanded() ? (
                    <SquareMinusIcon width={18} height={18} />
                  ) : (
                    <SquarePlusIcon width={18} height={18} />
                  )}
                </button>
              ) : null}
            </div>
          );
        },
        header: () => (
          <div className={'flex w-full items-center justify-center'}>#</div>
        ),
        footer: info => info.column.id,
        size: 30
      }),
      columnHelper.accessor('level', {
        cell: info => info.getValue(),
        header: () => (
          <div className={'flex w-full items-center justify-center'}>ID</div>
        ),
        footer: info => info.column.id,
        size: 50
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('volume', {
        cell: ({ row }) => formatNumber(row.original.volume),
        header: () => 'KL thầu',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('unit', {
        cell: info => info.getValue(),
        header: () => 'Đơn vị',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('unitPrice', {
        cell: ({ row }) => formatCurrency(row.original.unitPrice),
        header: () => 'Đơn giá thầu',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('requestVolume', {
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'KL yêu cầu',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('supplierUnitPrice', {
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Đơn giá NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'exceedUnitPrice',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Đơn giá phát sinh',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('supplierName', {
        cell: info => info.getValue(),
        header: () => 'NCC',
        footer: info => info.column.id,
        size: 300
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: requests,
    columns,
    initialState: {
      columnPinning: {
        left: ['id', 'level', 'title']
      }
    },
    state: {
      expanded,
      rowSelection
    },
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true
  });

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  return (
    <>
      <EditDocumentRequestDialog
        documentRequestId={documentRequestId}
        open={openDocumentRequestEdit}
        setOpen={setOpenDocumentRequestEdit}
      />
      <div className={'bg-appWhite flex flex-col rounded-md border'}>
        <div className={'flex justify-between border-b p-4'}>
          <div className={'flex-1 text-lg font-bold'}>
            {documentRequestQuery.data?.name}
          </div>
          <div className={'flex gap-2'}>
            <Button
              disabled={
                !(
                  table.getSelectedRowModel().flatRows.length > 0 &&
                  table.getSelectedRowModel().flatRows[0].original.children
                    ?.length === 0
                )
              }
              className={'flex gap-1'}
            >
              <PlusIcon />
              Thêm nhà cung cấp
            </Button>
            <Button
              disabled={
                !(
                  table.getSelectedRowModel().flatRows.length > 0 &&
                  table.getSelectedRowModel().flatRows[0].original.children
                    ?.length === 0
                )
              }
              className={'flex gap-1'}
            >
              <Edit3 width={14} height={14} />
              Thay đổi nhà cung cấp
            </Button>
            <Button
              className={'text-appWhite'}
              size="icon"
              onClick={() => setOpenDocumentRequestEdit(true)}
            >
              <EditIcon className={'h-5 w-5'} />
            </Button>
            <Button
              className={'text-appWhite bg-red-500 hover:bg-red-600'}
              size="icon"
              onClick={() => deleteDocumentRequest.mutate()}
            >
              <Cross2Icon className={'h-5 w-5'} />
            </Button>
          </div>
        </div>
        <div className={'flex flex-col p-2'}>
          <div className={'overflow-x-auto rounded-md border pb-2'}>
            <Table
              style={{
                width: table.getTotalSize() + 10
              }}
            >
              <TableHeader className={'bg-appGrayLight'}>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow className={'flex'} key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...getCommonPinningStyles(header.column),
                            width: header.getSize()
                          }}
                          className={
                            'bg-appGrayLight flex items-center whitespace-nowrap border-r p-1'
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
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => {
                    return (
                      <TableRow
                        key={row.id}
                        className={'group flex w-full cursor-pointer'}
                        onClick={() => {
                          setRowSelection(() => {
                            const test: Record<string, boolean> = {};
                            test[row.id] = true;
                            return test;
                          });
                        }}
                      >
                        {row.getVisibleCells().map(cell => {
                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(cell.column),
                                width: cell.column.getSize()
                              }}
                              className={cn(
                                `bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight
                                      flex items-center border-r p-1 text-xs`,
                                row.getIsSelected()
                                  ? 'bg-appBlueLight text-appWhite hover:bg-appBlue group-hover:bg-appBlue'
                                  : null
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      className={'flex items-center justify-center'}
                      colSpan={columns.length}
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
    </>
  );
};
