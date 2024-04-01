import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
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
import PocketBase from 'pocketbase';

import { FC, useEffect, useMemo, useState } from 'react';

import {
  DocumentDetailData,
  DocumentDetailResponse,
  DocumentRequestDetailResponse,
  DocumentRequestResponse,
  arrayToTree,
  cn,
  formatCurrency,
  formatNumber,
  getCommonPinningStyles,
  usePb
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

function getDocumentRequest(documentRequestId: string, pb?: PocketBase) {
  return pb
    ?.collection<
      DocumentRequestResponse & {
        expand: {
          'documentRequestDetail(documentRequest)': (DocumentRequestDetailResponse & {
            expand: {
              documentDetail: DocumentDetailResponse;
            };
          })[];
        };
      }
    >('documentRequest')
    .getOne(documentRequestId, {
      expand: 'documentRequestDetail(documentRequest).documentDetail'
    });
}

export function documentRequestOptions(
  documentRequestId: string,
  pb?: PocketBase
) {
  return queryOptions({
    queryKey: ['documentRequest', documentRequestId],
    queryFn: () => getDocumentRequest(documentRequestId, pb)
  });
}

export type DocumentRequestItemProps = {
  documentRequestId: string;
};

export const DocumentRequestItem: FC<DocumentRequestItemProps> = ({
  documentRequestId
}) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const pb = usePb();

  const documentRequestQuery = useSuspenseQuery(
    documentRequestOptions(documentRequestId, pb)
  );

  const data = useMemo(() => {
    const v = _.chain(
      documentRequestQuery.data
        ? documentRequestQuery.data.expand[
            'documentRequestDetail(documentRequest)'
          ]
        : []
    )
      .map(it => ({
        ...it.expand.documentDetail,
        requestVolume: it.volume
      }))
      .value();
    return arrayToTree(v);
  }, [documentRequestQuery.data]);

  const columnHelper = createColumnHelper<
    DocumentDetailData & {
      requestVolume?: number;
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
      columnHelper.display({
        id: 'supplierUnitPrice',
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
      columnHelper.display({
        id: 'supplier',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'NCC',
        footer: info => info.column.id,
        size: 300
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
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
    <div className={'bg-appWhite flex flex-col rounded-md border'}>
      <div className={'flex justify-between border-b p-4'}>
        <div className={'flex-1 text-lg font-bold'}>
          {documentRequestQuery.data?.name}
        </div>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'}>
            <PlusIcon />
            Thêm nhà cung cấp
          </Button>
          <Button disabled={true} className={'flex gap-1'}>
            <Edit3 width={14} height={14} />
            Thay đổi nhà cung cấp
          </Button>
          <Button className={'text-appWhite'} size="icon">
            <EditIcon className={'h-5 w-5'} />
          </Button>
          <Button
            className={'text-appWhite bg-red-500 hover:bg-red-600'}
            size="icon"
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
                                      flex items-center border-r p-1 text-xs`
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
  );
};
