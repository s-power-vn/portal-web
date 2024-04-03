import { CaretSortIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
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

import { FC, useEffect, useMemo, useState } from 'react';

import { DialogProps, DocumentDetailData, arrayToTree, cn } from '@storeo/core';
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

import { IndeterminateCheckbox } from '../../checkbox/indeterminate-checkbox';
import { getDocumentDetailsOptions } from '../document/document-overview-tab';

const Content: FC<Omit<PickDocumentDetailDialogProps, 'open'>> = ({
  documentId,
  setOpen,
  value = [],
  onChange
}) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const documentDetailsQuery = useQuery(getDocumentDetailsOptions(documentId));

  const data = useMemo(
    () => arrayToTree(documentDetailsQuery.data ?? []),
    [documentDetailsQuery.data]
  );

  const columnHelper = createColumnHelper<DocumentDetailData>();

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
    <DialogContent className="h-[500px] min-w-[800px]">
      <DialogHeader>
        <DialogTitle>Chọn hạng mục</DialogTitle>
        <DialogDescription className={'italic'}>
          Chọn hạng mục yêu cầu.
        </DialogDescription>
      </DialogHeader>
      <DebouncedInput
        value={globalFilter}
        className={'h-8 w-56'}
        placeholder={'Tìm kiếm...'}
        onChange={value => setGlobalFilter(String(value))}
      />
      <div className="overflow-auto rounded-md border pb-2">
        <Table
          style={{
            width: table.getTotalSize() + 10
          }}
        >
          <TableHeader
            className={
              'bg-appGrayLight  items-center whitespace-nowrap border-r p-1'
            }
          >
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={
                      'bg-appGrayLight  items-center whitespace-nowrap border-r p-1'
                    }
                    style={{
                      width: header.column.getSize()
                    }}
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
                <TableRow
                  key={row.id}
                  className={cn(
                    'cursor-pointer',
                    row.getIsSelected() ||
                      row.getIsSomeSelected() ||
                      row.getIsAllSubRowsSelected()
                      ? 'bg-appBlueLight text-appWhite hover:bg-appBlueLight'
                      : null
                  )}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                      }}
                      className={'border-r px-2 py-1'}
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
                  className="h-16 border-r text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
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
    </DialogContent>
  );
};

export type PickDocumentDetailDialogProps = DialogProps & {
  documentId: string;
  value?: DocumentDetailData[];
  onChange?: (value: DocumentDetailData[]) => void;
};

export const PickDocumentDetailDialog: FC<PickDocumentDetailDialogProps> = ({
  documentId,
  open,
  setOpen,
  value = [],
  onChange
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('w-64 justify-between text-sm font-normal')}
        >
          Chọn hạng mục
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <Content
        setOpen={setOpen}
        documentId={documentId}
        onChange={onChange}
        value={value}
      />
    </Dialog>
  );
};
