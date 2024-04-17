import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
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
import {
  EditIcon,
  PrinterIcon,
  SquareMinusIcon,
  SquarePlusIcon,
  StoreIcon
} from 'lucide-react';

import { FC, useEffect, useMemo, useState } from 'react';

import { cn, formatCurrency, formatDate, formatNumber } from '@storeo/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import {
  RequestDetailData,
  getAllRequestsKey,
  getRequestById,
  useDeleteRequest
} from '../../../api';
import {
  TreeData,
  arrayToTree,
  getCommonPinningStyles
} from '../../../commons/utils';
import { ListRequestSupplierDialog } from '../request-detail/list-request-supplier-dialog';
import { EditRequestDialog } from './edit-request-dialog';

export type RequestItemProps = {
  requestId: string;
};

export const RequestItem: FC<RequestItemProps> = ({ requestId }) => {
  const [openDocumentRequestEdit, setOpenDocumentRequestEdit] = useState(false);
  const [openListSupplier, setOpenListSupplier] = useState(false);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const request = useSuspenseQuery(getRequestById(requestId));
  const queryClient = useQueryClient();

  const deleteRequest = useDeleteRequest(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getAllRequestsKey(request.data.project)
      })
    ]);
  });

  const requests = useMemo(() => {
    const v = _.chain(
      request.data ? request.data.expand.requestDetail_via_request : []
    )
      .map(it => {
        return {
          ...it,
          group: it.expand.detail.id,
          level: it.expand.detail.level,
          parent: it.expand.detail.parent,
          suppliers: it.expand.requestDetailSupplier_via_requestDetail?.map(
            st => {
              return {
                id: st.expand.supplier.id,
                name: st.expand.supplier.name,
                price: st.price,
                volume: st.volume
              };
            }
          )
        };
      })
      .value();

    const list = [];
    for (const vi of v) {
      if (vi.suppliers?.length > 0) {
        let index = 0;
        for (const s of vi.suppliers) {
          list.push({
            ..._.omit(vi, ['suppliers']),
            supplier: s.id,
            supplierUnitPrice: s.price,
            supplierName: s.name,
            supplierVolume: s.volume,
            rowSpan: index === 0 ? vi.suppliers.length : 0
          });
          index++;
        }
      } else {
        list.push({ ..._.omit(vi, ['suppliers']) });
      }
    }

    return arrayToTree(list, `${request.data.project}-root`);
  }, [request.data]);

  const columnHelper = createColumnHelper<TreeData<RequestDetailData>>();

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
        size: 30,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'level',
        cell: ({ row }) => row.original.level,
        header: () => (
          <div className={'flex w-full items-center justify-center'}>ID</div>
        ),
        footer: info => info.column.id,
        size: 50,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'title',
        cell: ({ row }) => row.original.expand.detail.title,
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'volume',
        cell: ({ row }) => (
          <div className={'flex gap-1'}>
            <span className={'font-semibold'}>
              {formatNumber(row.original.expand.detail.volume)}
            </span>
            <span>{row.original.expand.detail.unit}</span>
          </div>
        ),
        header: () => 'KL thầu',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'unitPrice',
        cell: ({ row }) => (
          <span className={'font-semibold'}>
            {formatCurrency(row.original.expand.detail.unitPrice)}
          </span>
        ),
        header: () => 'Đơn giá thầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'requestVolume',
        cell: ({ row }) => (
          <div className={'flex gap-1'}>
            <span className={'font-semibold'}>
              {formatNumber(row.original.volume)}
            </span>
            <span>{row.original.expand.detail.unit}</span>
          </div>
        ),
        header: () => 'KL yêu cầu',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('supplierUnitPrice', {
        cell: ({ row }) =>
          row.original.supplierUnitPrice ? (
            <span className={'font-semibold'}>
              {formatCurrency(row.original.supplierUnitPrice)}
            </span>
          ) : null,
        header: () => 'Đơn giá NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'exceedUnitPrice',
        cell: ({ row }) => {
          if (row.original.supplierUnitPrice) {
            const exceed =
              row.original.supplierUnitPrice -
              row.original.expand.detail.unitPrice;
            if (exceed > 0) {
              return (
                <span className={'font-semibold text-red-500'}>
                  {formatCurrency(exceed)}
                </span>
              );
            } else {
              return (
                <span className={'font-semibold text-green-500'}>
                  {formatCurrency(-exceed)}
                </span>
              );
            }
          }
          return null;
        },
        header: () => 'Đơn giá phát sinh',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('supplierVolume', {
        cell: ({ row }) =>
          row.original.supplierVolume ? (
            <div className={'flex gap-1'}>
              <span className={'font-semibold'}>
                {formatNumber(row.original.supplierVolume)}
              </span>
              <span>{row.original.expand.detail.unit}</span>
            </div>
          ) : null,
        header: () => 'Khối lượng NCC',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.accessor('supplierName', {
        cell: info => info.getValue(),
        header: () => 'Nhà cung cấp',
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
      {table.getSelectedRowModel() &&
      table.getSelectedRowModel().flatRows.length > 0 ? (
        <ListRequestSupplierDialog
          requestDetail={table.getSelectedRowModel().flatRows[0].original}
          open={openListSupplier}
          setOpen={setOpenListSupplier}
        />
      ) : null}
      <EditRequestDialog
        requestId={request.data.id}
        open={openDocumentRequestEdit}
        setOpen={setOpenDocumentRequestEdit}
      />
      <div className={'bg-appWhite flex flex-col'}>
        <div className={'flex justify-between p-2'}>
          <div className={'flex h-full flex-col gap-4'}>
            <div className={'text-sm italic'}>
              <div className={'flex justify-between gap-20'}>
                <span>Người đề nghị:</span>
                <span>{request.data?.expand?.issue.expand.createdBy.name}</span>
              </div>
              <div className={'flex justify-between'}>
                <span>Phòng ban:</span>
                <span>
                  {
                    request.data?.expand?.issue.expand.createdBy.expand
                      .department.name
                  }
                </span>
              </div>
              <div className={'flex justify-between'}>
                <span>Ngày tạo:</span>
                <span>{formatDate(request.data?.created)}</span>
              </div>
            </div>
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
              onClick={() => setOpenListSupplier(true)}
            >
              <StoreIcon className={'h-5 w-5'} />
              Nhà cung cấp (NCC)
            </Button>
            <Button className={'text-appWhite'} size="icon">
              <PrinterIcon className={'h-4 w-4'} />
            </Button>
            <Button
              className={'text-appWhite'}
              size="icon"
              onClick={() => setOpenDocumentRequestEdit(true)}
            >
              <EditIcon className={'h-4 w-4'} />
            </Button>
            <Button
              className={'text-appWhite bg-red-500 hover:bg-red-600'}
              size="icon"
              onClick={() => deleteRequest.mutate(requestId)}
            >
              <Cross2Icon className={'h-4 w-4'} />
            </Button>
          </div>
        </div>
        <div className={'flex flex-col p-2'}>
          <div className={'overflow-x-auto rounded-md border pb-2'}>
            <Table
              style={{
                width: table.getTotalSize()
              }}
            >
              <TableHeader className={'bg-appGrayLight'}>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...getCommonPinningStyles(header.column),
                            width: header.getSize()
                          }}
                          className={`bg-appGrayLight whitespace-nowrap p-1 after:absolute after:right-0
                          after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`}
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
                        className={'group w-full cursor-pointer'}
                        onClick={() => {
                          setRowSelection(() => {
                            const object: Record<string, boolean> = {};
                            object[row.id] = true;
                            return object;
                          });
                        }}
                      >
                        {row.getVisibleCells().map(cell => {
                          return cell.column.columnDef.meta?.hasRowSpan &&
                            !cell.row.original[
                              cell.column.columnDef.meta?.hasRowSpan
                            ] ? null : (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles(cell.column),
                                width: cell.column.getSize()
                              }}
                              className={cn(
                                `bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight p-1 text-xs after:absolute
                                 after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`,
                                row.getIsSelected()
                                  ? 'bg-appBlueLight text-appWhite hover:bg-appBlue group-hover:bg-appBlue'
                                  : null
                              )}
                              rowSpan={
                                cell.column.columnDef.meta?.hasRowSpan
                                  ? cell.row.original[
                                      cell.column.columnDef.meta?.hasRowSpan
                                    ]
                                  : undefined
                              }
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
                      colSpan={columns.length}
                      className={'text-center'}
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
