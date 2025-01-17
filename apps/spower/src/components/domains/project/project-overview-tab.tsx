import { useNavigate } from '@tanstack/react-router';
import type {
  ExpandedState,
  Row,
  RowSelectionState
} from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import _ from 'lodash';
import { SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import { api } from 'portal-api';
import type { DetailInfoResponse, RequestResponse } from 'portal-core';
import { client, maskVolumeString } from 'portal-core';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Show, cn, formatCurrency, formatNumber } from '@minhdtb/storeo-core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@minhdtb/storeo-theme';

import type { TreeData } from '../../../commons/utils';
import { arrayToTree, getCommonPinningStyles } from '../../../commons/utils';
import { Route } from '../../../routes/_authenticated/project/$projectId';

export const ADMIN_ID = '4jepkf28idxcfij'; /* TODO */

export type ProjectOverviewTabProps = {
  projectId: string;
};

export const ProjectOverviewTab: FC<ProjectOverviewTabProps> = ({
  projectId
}) => {
  const navigate = useNavigate({ from: Route.fullPath });

  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<DetailInfoResponse>>>();

  const listDetailInfos = api.detailInfo.listFull.useSuspenseQuery({
    variables: projectId
  });

  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const data = useMemo(
    () =>
      arrayToTree(listDetailInfos.data, `${projectId}-root`, (value, item) => {
        return _.chain(value)
          .filter(it => it.group === item.group)
          .uniqBy('request')
          .sumBy('requestVolume')
          .value();
      }).sort((v1, v2) => {
        return parseInt(v1.level) - parseInt(v2.level);
      }),
    [listDetailInfos.data, projectId]
  );

  const columnHelper = createColumnHelper<
    TreeData<
      DetailInfoResponse & {
        expand: {
          request: RequestResponse;
        };
      }
    >
  >();

  const handleGotoIssue = useCallback(
    (issueId: string) => {
      return navigate({
        to: '/project/$projectId/issues/me/$issueId',
        params: {
          issueId
        }
      });
    },
    [navigate]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center'}>
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
      columnHelper.accessor('level', {
        cell: info => info.getValue(),
        header: () => (
          <div className={'flex w-full items-center justify-center'}>ID</div>
        ),
        footer: info => info.column.id,
        size: 50,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc mời thầu',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('volume', {
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1'}>
            {maskVolumeString(formatNumber(row.original.volume))}
          </div>
        ),
        header: () => 'Khối lượng mời thầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('unit', {
        cell: ({ row }) => (
          <div className={'flex justify-center gap-1'}>{row.original.unit}</div>
        ),
        header: () => 'Đơn vị tính',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('unitPrice', {
        cell: ({ row }) => (
          <Show when={row.original.unitPrice}>
            <div className={'flex justify-end'}>
              {formatCurrency(row.original.unitPrice)}
              <span>₫</span>
            </div>
          </Show>
        ),
        header: () => 'Đơn giá dự thầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'biddingTotal',
        cell: ({ row }) => (
          <Show when={row.original.unitPrice}>
            <div className={'flex justify-end'}>
              {formatCurrency(row.original.unitPrice * row.original.volume)}
              <span>₫</span>
            </div>
          </Show>
        ),
        header: () => 'Thành tiền',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'requestTitle',
        cell: ({ row }) => (
          <Show when={row.original.issue}>
            <button
              className={'max-w-60 cursor-pointer truncate text-left underline'}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                return handleGotoIssue(row.original.issue);
              }}
            >
              {row.original.expand?.request.code}
            </button>
          </Show>
        ),
        header: () => 'Yêu cầu mua hàng',
        footer: info => info.column.id,
        size: 250,
        meta: {
          hasRowSpan: 'requestRowSpan'
        }
      }),
      columnHelper.display({
        id: 'requestVolume',
        cell: ({ row }) => (
          <Show when={row.original.requestVolume}>
            <div className={'flex justify-end gap-1'}>
              {formatNumber(row.original.requestVolume)}
            </div>
          </Show>
        ),
        header: () => 'Khối lượng yêu cầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'requestRowSpan'
        }
      }),
      columnHelper.display({
        id: 'totalRequestVolume',
        cell: ({ row }) => (
          <Show when={row.original.extra}>
            <div className={'flex justify-end gap-1'}>
              {formatNumber(row.original.extra as number)}
            </div>
          </Show>
        ),
        header: () => 'Tổng KL yêu cầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'exceedVolume',
        cell: ({ row }) => {
          if (row.original.extra) {
            const exceed = (row.original.extra as number) - row.original.volume;

            return (
              <Show when={exceed}>
                <div
                  className={cn(
                    'flex w-full justify-end gap-1',
                    exceed < 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {formatNumber(exceed < 0 ? -exceed : exceed)}
                </div>
              </Show>
            );
          }
          return null;
        },
        header: () => 'Khối lượng phát sinh',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('price', {
        cell: info => (
          <Show when={info.getValue()}>
            <div className={'flex justify-end gap-1'}>
              {formatCurrency(info.getValue())}
              <span>₫</span>
            </div>
          </Show>
        ),
        header: () => 'Đơn giá NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'exceedUnitPrice',
        cell: ({ row }) => {
          if (row.original.price) {
            const exceed = row.original.price - row.original.unitPrice;
            if (exceed > 0) {
              return (
                <div className={'flex justify-end text-red-500'}>
                  {formatCurrency(exceed)}
                  <span>₫</span>
                </div>
              );
            } else {
              return (
                <div className={'flex justify-end text-green-500'}>
                  {formatCurrency(-exceed)}
                  <span>₫</span>
                </div>
              );
            }
          }
          return null;
        },
        header: () => 'Đơn giá phát sinh',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('supplier', {
        cell: info => info.row.original.supplierName,
        header: () => 'Nhà cung cấp',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.display({
        id: 'supplierStatus',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Trạng thái NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'contractStatus',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'Trạng thái HĐ',
        footer: info => info.column.id,
        size: 150
      })
    ],
    [columnHelper, handleGotoIssue]
  );

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnPinning: {
        left: ['id', 'level', 'select', 'title']
      }
    },
    state: {
      expanded,
      rowSelection,
      columnVisibility: {
        unitPrice: client.authStore.model?.id === ADMIN_ID,
        biddingTotal: client.authStore.model?.id === ADMIN_ID
      }
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

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 20
  });

  useEffect(() => {
    const { rows } = table.getRowModel();

    rows.forEach(row => {
      if (row.subRows.length > 0) {
        if (row.getIsAllSubRowsSelected()) {
          row.toggleSelected(true);
        } else {
          row.toggleSelected(false, {
            selectChildren: false
          });
        }
      }
    });
  }, [rowSelection, table]);

  return (
    <div className={'px-2'}>
      <div
        className={
          'border-appBlue h-[calc(100vh-150px)] overflow-auto rounded-md border '
        }
        ref={parentRef}
      >
        <Table
          style={{
            width: table.getTotalSize()
          }}
        >
          <TableHeader className={'sticky top-0 z-10'}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className={'!border-b-0'}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles(header.column),
                        width: header.getSize()
                      }}
                      className={`bg-appBlueLight text-appWhite relative whitespace-nowrap p-1 text-center after:pointer-events-none
                          after:absolute after:right-0 after:top-0 after:h-full after:w-full after:border-b
                          after:border-r after:content-[''] last:after:border-r-0`}
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
          <TableBody
            className={'relative'}
            style={{
              height: `${virtualizer.getTotalSize()}px`
            }}
          >
            {virtualizer.getVirtualItems().length ? (
              virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    className={'group absolute w-full cursor-pointer'}
                    onClick={() => {
                      if (selectedRow?.id !== row.id) {
                        setSelectedRow(row);
                      } else {
                        setSelectedRow(undefined);
                      }
                    }}
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`
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
                            ` bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight relative p-1 text-xs
                              after:absolute after:right-0 after:top-0 after:h-full after:border-r after:content-[''] last:after:border-r-0`,
                            selectedRow?.id === row.id
                              ? 'bg-appBlueLight text-appWhite hover:bg-appBlueLight group-hover:bg-appBlue'
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
                <TableCell className={'text-center'} colSpan={columns.length}>
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
