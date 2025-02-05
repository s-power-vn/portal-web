import type { ExpandedState, RowSelectionState } from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import _ from 'lodash';
import { SquareMinusIcon, SquarePlusIcon } from 'lucide-react';
import { api } from 'portal-api';
import type { DetailResponse } from 'portal-core';

import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { For, Show, cn } from '@minhdtb/storeo-core';
import {
  Button,
  DebouncedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@minhdtb/storeo-theme';

import type { TreeData } from '../../../commons/utils';
import { arrayToTree, compareVersion } from '../../../commons/utils';
import { IndeterminateCheckbox } from '../../checkbox/indeterminate-checkbox';

export type PickDetailInputProps = {
  projectId: string;
  value?: DetailResponse[];
  onChange: (value: DetailResponse[]) => void;
};

export const PickDetailInput: FC<PickDetailInputProps> = props => {
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    setRowSelection(
      _.chain(props.value)
        .map(item => ({
          id: item.id
        }))
        .keyBy('id')
        .mapValues(() => true)
        .value()
    );
  }, [props.value]);

  const listDetails = api.detail.listFull.useSuspenseQuery({
    variables: props.projectId
  });

  const data = useMemo(() => {
    const v = listDetails.data.map(it => {
      return {
        ...it,
        group: it.id
      };
    });
    return arrayToTree(v, `${props.projectId}-root`).sort((v1, v2) =>
      compareVersion(v1.level, v2.level)
    );
  }, [listDetails.data, props.projectId]);

  const columnHelper = createColumnHelper<TreeData<DetailResponse>>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: ({ row }) => {
          return (
            <div className={'flex w-full items-center '}>
              <Show when={row.getCanExpand()}>
                <button
                  className={'cursor-pointer'}
                  onClick={e => {
                    e.stopPropagation();
                    row.toggleExpanded();
                  }}
                >
                  <Show
                    when={row.getIsExpanded()}
                    fallback={<SquarePlusIcon width={18} height={18} />}
                  >
                    <SquareMinusIcon width={18} height={18} />
                  </Show>
                </button>
              </Show>
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
      columnHelper.display({
        id: 'select',
        cell: ({ row }) => (
          <div className={'flex h-full w-full items-center justify-center'}>
            <Show
              when={row.subRows.length > 0}
              fallback={
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler()
                  }}
                />
              }
            >
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsAllSubRowsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />
            </Show>
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
        footer: info => info.column.id,
        size: 30
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 620
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableFilters: true,
    enableGlobalFilter: true,
    filterFromLeafRows: true,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getSubRows: row =>
      row.children?.sort((v1, v2) => compareVersion(v1.level, v2.level)),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    getRowId: row => row.id
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
    <div className="flex flex-col gap-2">
      <DebouncedInput
        value={globalFilter}
        className={'h-8 w-56'}
        placeholder={'Tìm kiếm...'}
        onChange={value => setGlobalFilter(String(value))}
      />
      <div
        className="border-appBlue h-[300px] overflow-auto rounded-md border pb-2"
        ref={parentRef}
      >
        <Table
          style={{
            width: table.getTotalSize() + 10
          }}
        >
          <TableHeader className={'sticky top-0 z-10'}>
            <For each={table.getHeaderGroups()}>
              {headerGroup => (
                <TableRow key={headerGroup.id} className={'!border-b-0'}>
                  <For each={headerGroup.headers}>
                    {header => (
                      <TableHead
                        key={header.id}
                        className={`bg-appBlueLight text-appWhite relative whitespace-nowrap p-1 after:pointer-events-none after:absolute
                          after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r
                          after:content-[''] last:after:border-r-0`}
                        style={{
                          width: header.column.getSize()
                        }}
                      >
                        <Show when={!header.isPlaceholder}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Show>
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody
            className={'relative'}
            style={{
              height: `${virtualizer.getTotalSize()}px`
            }}
          >
            <For
              each={virtualizer.getVirtualItems()}
              fallback={
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 border-r text-center"
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              }
            >
              {virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    className={cn(
                      'absolute cursor-pointer',
                      row.getIsSelected() ||
                        row.getIsSomeSelected() ||
                        row.getIsAllSubRowsSelected()
                        ? 'bg-appBlueLight text-appWhite hover:bg-appBlue'
                        : null
                    )}
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    <For each={row.getVisibleCells()}>
                      {cell => (
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
                      )}
                    </For>
                  </TableRow>
                );
              }}
            </For>
          </TableBody>
        </Table>
      </div>
      <div className={'mt-4'}>
        <Button
          type="submit"
          onClick={() => {
            props.onChange?.(
              _.uniqBy(
                [
                  ...table
                    .getRowModel()
                    .flatRows.filter(row => row.getIsSomeSelected())
                    .map(it => it.original),
                  ...table
                    .getSelectedRowModel()
                    .flatRows.map(item => item.original)
                ],
                'id'
              )
            );
          }}
        >
          Chấp nhận
        </Button>
      </div>
    </div>
  );
};
