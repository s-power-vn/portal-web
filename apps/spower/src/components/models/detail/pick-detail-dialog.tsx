import {
  ExpandedState,
  RowSelectionState,
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
import _ from 'lodash';
import { SquareMinusIcon, SquarePlusIcon } from 'lucide-react';

import { FC, Suspense, useEffect, useMemo, useState } from 'react';

import { DetailResponse, DialogProps, For, Show, cn } from '@storeo/core';
import {
  Button,
  DebouncedInput,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { detailApi } from '../../../api';
import { TreeData, arrayToTree } from '../../../commons/utils';
import { IndeterminateCheckbox } from '../../checkbox/indeterminate-checkbox';

const Content: FC<PickDetailDialogProps> = ({
  projectId,
  setOpen,
  value = [],
  onChange
}) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const listDetails = detailApi.listFull.useSuspenseQuery({
    variables: projectId
  });

  const data = useMemo(() => {
    const v = listDetails.data.map(it => {
      return {
        ...it,
        group: it.id
      };
    });
    return arrayToTree(v, `${projectId}-root`);
  }, [listDetails.data, projectId]);

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
    initialState: {
      rowSelection: _.chain(value)
        .map(item => ({
          id: item.id
        }))
        .keyBy('id')
        .mapValues(() => true)
        .value()
    },
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
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true
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

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  return (
    <DialogContent className="min-w-[800px]">
      <DialogHeader>
        <DialogTitle>Chọn hạng mục</DialogTitle>
        <DialogDescription className={'italic'}>
          Chọn hạng mục yêu cầu.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <DebouncedInput
          value={globalFilter}
          className={'h-8 w-56'}
          placeholder={'Tìm kiếm...'}
          onChange={value => setGlobalFilter(String(value))}
        />
        <div className="border-appBlue max-h-[300px] overflow-auto rounded-md border pb-2">
          <Table
            style={{
              width: table.getTotalSize() + 10
            }}
          >
            <TableHeader
              className={'items-center whitespace-nowrap border-r p-1'}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2
              }}
            >
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
            <TableBody>
              <For
                each={table.getRowModel().rows}
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
                {row => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      'cursor-pointer',
                      row.getIsSelected() ||
                        row.getIsSomeSelected() ||
                        row.getIsAllSubRowsSelected()
                        ? 'bg-appBlueLight text-appWhite hover:bg-appBlue'
                        : null
                    )}
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
                )}
              </For>
            </TableBody>
          </Table>
        </div>
        <DialogFooter className={'mt-4'}>
          <Button
            type="submit"
            onClick={() => {
              onChange?.(
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
              setOpen(false);
            }}
          >
            Chấp nhận
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

export type PickDetailDialogProps = DialogProps & {
  projectId?: string;
  value?: DetailResponse[];
  onChange?: (value: DetailResponse[]) => void;
};

export const PickDetailDialog: FC<PickDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between text-sm font-normal')}
        >
          Chọn
        </Button>
      </DialogTrigger>
      <Suspense>
        <Content {...props} />
      </Suspense>
    </Dialog>
  );
};
