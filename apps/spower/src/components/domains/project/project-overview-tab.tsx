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
import { SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import { api } from 'portal-api';
import type { DetailInfoResponse } from 'portal-core';
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
import {
  arrayToTree,
  compareVersion,
  getCommonPinningStyles
} from '../../../commons/utils';
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
      arrayToTree(listDetailInfos.data, `${projectId}-root`, [
        'issue',
        'issueCode',
        'issueTitle',
        'requestVolume'
      ]).sort((v1, v2) => compareVersion(v1.level, v2.level)),
    [listDetailInfos.data, projectId]
  );

  const columnHelper = createColumnHelper<
    TreeData<
      DetailInfoResponse & {
        issue: string | string[];
        issueCode: string | string[];
        issueTitle: string | string[];
        requestVolume: number | number[];
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
        header: () => 'Mô tả công việc mời thầu',
        footer: info => info.column.id,
        size: 300
      }),
      columnHelper.accessor('volume', {
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1'}>
            {maskVolumeString(formatNumber(row.original.volume))}
          </div>
        ),
        header: () => 'Khối lượng mời thầu',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.accessor('unit', {
        cell: ({ row }) => (
          <div className={'flex justify-center gap-1'}>{row.original.unit}</div>
        ),
        header: () => 'Đơn vị tính',
        footer: info => info.column.id,
        size: 100
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
        size: 150
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
        size: 150
      }),
      columnHelper.display({
        id: 'requestTitle',
        cell: ({ row }) => (
          <Show when={row.original.issueCode}>
            <div className="flex flex-wrap gap-1">
              {typeof row.original.issueCode === 'string' ? (
                <div
                  className="bg-appBlueLight text-appWhite hover:bg-appBlue cursor-pointer rounded px-2 py-0.5 text-xs"
                  onClick={() => handleGotoIssue(row.original.issue as string)}
                >
                  {row.original.issueCode}
                </div>
              ) : (
                (row.original.issueCode as string[]).map((code, index) => (
                  <div
                    key={code}
                    className="bg-appBlueLight text-appWhite hover:bg-appBlue cursor-pointer rounded px-2 py-0.5 text-xs"
                    onClick={() => handleGotoIssue(row.original.issue[index])}
                  >
                    {code}
                  </div>
                ))
              )}
            </div>
          </Show>
        ),
        header: () => 'Yêu cầu mua hàng',
        footer: info => info.column.id,
        size: 250
      }),
      columnHelper.display({
        id: 'totalRequestVolume',
        cell: ({ row }) => (
          <div className={'flex justify-end gap-1 font-medium'}>
            {typeof row.original.requestVolume === 'number'
              ? formatNumber(row.original.requestVolume)
              : (row.original.requestVolume as number[]).reduce(
                  (acc, curr) => acc + curr,
                  0
                )}
          </div>
        ),
        header: () => 'Tổng KL yêu cầu',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'exceedVolume',
        cell: ({ row }) => {
          const exceed =
            (row.original.volume as number) -
            (typeof row.original.requestVolume === 'number'
              ? row.original.requestVolume
              : (row.original.requestVolume as number[]).reduce(
                  (acc, curr) => acc + curr,
                  0
                ));

          return (
            <Show when={row.original.requestVolume}>
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-end px-2 font-medium',
                  exceed === 0
                    ? 'text-gray-700'
                    : exceed < 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                )}
              >
                {formatNumber(exceed < 0 ? -exceed : exceed)}
              </div>
            </Show>
          );
        },
        header: () => 'Khối lượng phát sinh',
        footer: info => info.column.id,
        size: 150
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
        unitPrice: client.authStore.record?.id === ADMIN_ID,
        biddingTotal: client.authStore.record?.id === ADMIN_ID
      }
    },
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getSubRows: row =>
      row.children?.sort((v1, v2) => compareVersion(v1.level, v2.level)),
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
                      return (
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
