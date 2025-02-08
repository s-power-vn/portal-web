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
import { Loader2Icon, SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import { api } from 'portal-api';

import { FC, useEffect, useMemo, useState } from 'react';

import { formatDate, formatNumber } from '@minhdtb/storeo-core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@minhdtb/storeo-theme';

import { TreeData, arrayToTree } from '../../../../commons/utils';
import { IndeterminateCheckbox } from '../../../checkbox/indeterminate-checkbox';
import { RequestDetailItem } from '../request';
import { SelectFinishedRequest } from './select-finished-request';

export type PickRequestDetailInputProps = {
  projectId?: string;
  value?: RequestDetailItem[];
  onChange?: (value: RequestDetailItem[]) => void;
};

export const PickRequestDetailInput: FC<PickRequestDetailInputProps> = ({
  value,
  onChange,
  projectId
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<
    string | undefined
  >(undefined);
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const request = api.request.byId.useQuery({
    variables: selectedRequestId
  });

  const v = useMemo<RequestDetailItem[]>(() => {
    return _.chain(
      request.data ? request.data?.expand.requestDetail_via_request : []
    )
      .map(it => {
        const { customLevel, customUnit, customTitle } = it;

        return {
          id: it.id,
          title: it.expand?.detail.title ?? customTitle,
          unit: it.expand?.detail.unit ?? customUnit,
          group: it.expand?.detail.id ?? customLevel,
          level: it.expand?.detail.level ?? customLevel,
          requestVolume: it.requestVolume,
          deliveryDate: it.deliveryDate,
          note: it.note,
          index: it.index,
          parent: it.expand?.detail.parent ?? `${request.data?.project}-root`
        };
      })
      .orderBy('level')
      .value();
  }, [request.data]);

  const requestDetails = useMemo(() => {
    return arrayToTree(v, `${request.data?.project}-root`);
  }, [request.data?.project, v]);

  const columnHelper = createColumnHelper<TreeData<RequestDetailItem>>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        cell: ({ row }) => (
          <div className={'flex h-full w-full items-center justify-center'}>
            {row.subRows.length > 0 ? (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsAllSubRowsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />
            ) : (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />
            )}
          </div>
        ),
        header: () => (
          <div className={'flex h-full w-full items-center justify-center'}>
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
        cell: ({ row }) => (
          <div className={'flex justify-center'}>{row.original.index}</div>
        ),
        header: () => 'STT',
        size: 50
      }),
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center justify-center'}>
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
        header: () => <div></div>,
        size: 30
      }),
      columnHelper.display({
        id: 'level',
        cell: ({ row }) => (
          <div className={'flex justify-start'}>{row.original.level}</div>
        ),
        header: () => 'ID',
        size: 100
      }),

      columnHelper.display({
        id: 'title',
        cell: ({ row }) => row.original.title,
        header: () => 'Mô tả công việc mời thầu',
        minSize: 300
      }),
      columnHelper.display({
        id: 'unit',
        cell: ({ row }) => (
          <div className={'flex justify-center'}>{row.original.unit}</div>
        ),
        header: () => 'Đơn vị tính',
        size: 50
      }),
      columnHelper.display({
        id: 'requestVolume',
        cell: ({ row }) => (
          <div className={'flex justify-end'}>
            {formatNumber(row.original.requestVolume ?? 0)}
          </div>
        ),
        header: () => 'Khối lượng',
        size: 100
      }),
      columnHelper.accessor('deliveryDate', {
        cell: ({ row }) => (
          <div className={'flex justify-center'}>
            {formatDate(row.original.deliveryDate ?? '')}
          </div>
        ),
        header: () => 'Ngày cấp',
        size: 100
      }),
      columnHelper.display({
        id: 'note',
        cell: ({ row }) => (
          <div className={'flex justify-start'}>{row.original.note}</div>
        ),
        header: () => 'Ghi chú',
        size: 150
      })
    ],
    [columnHelper, rowSelection, onChange, v]
  );

  const table = useReactTable({
    data: requestDetails,
    columns,
    state: {
      expanded,
      rowSelection
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true
  });

  useEffect(() => {
    const selectedItems = table
      .getRowModel()
      .flatRows.filter(row => row.getIsSelected() && !row.getCanExpand())
      .map(row => row.original);

    console.log(selectedItems);

    onChange?.(selectedItems);
  }, [rowSelection, table]);

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex flex-col'}>
        <span className={'text-sm font-medium'}>
          Yêu cầu mua hàng đã hoàn thành
        </span>
        <SelectFinishedRequest
          projectId={projectId}
          onChange={value => {
            setSelectedRequestId(value);
            setRowSelection({});
          }}
        />
      </div>
      <div className={'flex flex-col'}>
        <span className={'text-sm font-medium'}>Danh sách công việc</span>
        <div
          className={
            'border-appBlue relative h-[300px] overflow-auto rounded-md border pb-2'
          }
        >
          {request.isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-lg">
                <Loader2Icon className="text-appBlue h-5 w-5 animate-spin" />
                <span className="text-sm">Đang tải...</span>
              </div>
            </div>
          )}
          <Table>
            <TableHeader className={'sticky top-0 z-10'}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className={'!border-b-0'}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize()
                      }}
                      className={`bg-appBlueLight text-appWhite relative whitespace-nowrap p-1 after:pointer-events-none after:absolute
                      after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r
                      after:content-[''] last:after:border-r-0`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} className="hover:bg-appGrayLight">
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize()
                        }}
                        className={`relative p-1 text-xs after:absolute after:right-0 after:top-0 after:h-full
                        after:border-r after:content-['']`}
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
