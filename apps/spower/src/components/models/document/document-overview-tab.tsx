import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  ExpandedState,
  Row,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import _ from 'lodash';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DownloadIcon,
  EditIcon,
  SheetIcon,
  SquareMinusIcon,
  SquarePlusIcon
} from 'lucide-react';

import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { cn, formatCurrency, formatNumber } from '@storeo/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { DetailData, useDeleteDetails, useGetAllDetails } from '../../../api';
import { arrayToTree, getCommonPinningStyles } from '../../../commons/utils';
import { IndeterminateCheckbox } from '../../checkbox/indeterminate-checkbox';
import { EditDetailDialog } from '../detail/edit-detail-dialog';
import { NewDetailDialog } from '../detail/new-detail-dialog';

export type DocumentOverviewProps = {
  documentId: string;
};

export const DocumentOverviewTab: FC<DocumentOverviewProps> = ({
  documentId
}) => {
  const [openDocumentDetailNew, setOpenDocumentDetailNew] = useState(false);
  const [openDocumentDetailEdit, setOpenDocumentDetailEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Row<DetailData>>();

  const details = useGetAllDetails(documentId);
  const deleteDetails = useDeleteDetails(documentId);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const data = useMemo(
    () => arrayToTree(details.data ?? [], `${documentId}_root`),
    [details.data]
  );

  const columnHelper = createColumnHelper<DetailData>();

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
      columnHelper.display({
        id: 'biddingTotal',
        cell: ({ row }) =>
          formatCurrency(row.original.unitPrice * row.original.volume),
        header: () => 'Thành tiền',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'requestVolume',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'KL yêu cầu',
        footer: info => info.column.id,
        size: 100
      }),
      columnHelper.display({
        id: 'exceedVolume',
        cell: info => (info.getValue() !== 0 ? info.getValue() : ''),
        header: () => 'KL phát sinh',
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
        size: 100
      })
    ],
    [columnHelper]
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

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 3,
    measureElement: element => {
      return element?.getBoundingClientRect().height;
    }
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

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
    <>
      <NewDetailDialog
        open={openDocumentDetailNew}
        setOpen={setOpenDocumentDetailNew}
        documentId={documentId}
        parent={selectedRow ? selectedRow.original : undefined}
      />
      {selectedRow ? (
        <EditDetailDialog
          open={openDocumentDetailEdit}
          setOpen={setOpenDocumentDetailEdit}
          detailId={selectedRow.original.id}
        />
      ) : null}
      <div className={'flex flex-col gap-2'}>
        <div className={'flex gap-2'}>
          <Button variant={'outline'} className={'flex gap-1'}>
            <SheetIcon className={'h-5 w-5'} />
            Nhập từ Excel
          </Button>
          <Button
            className={'flex gap-1'}
            onClick={() => {
              setSelectedRow(undefined);
              setOpenDocumentDetailNew(true);
            }}
          >
            <PlusIcon />
            Thêm mục
          </Button>
          <Button
            disabled={!selectedRow}
            className={'flex gap-1'}
            onClick={e => {
              e.stopPropagation();
              setOpenDocumentDetailNew(true);
            }}
          >
            <PlusIcon />
            Thêm mục con
          </Button>
          <Button disabled={!selectedRow} variant="outline" size="icon">
            <ArrowUpIcon className={'h-5 w-5'} />
          </Button>
          <Button disabled={!selectedRow} variant="outline" size="icon">
            <ArrowDownIcon className={'h-5 w-5'} />
          </Button>
          <Button
            disabled={!selectedRow}
            size="icon"
            onClick={() => {
              setOpenDocumentDetailEdit(true);
            }}
          >
            <EditIcon className={'h-5 w-5'} />
          </Button>
          <Button
            disabled={_.keys(rowSelection).length === 0}
            variant="outline"
            className={'text-appWhite bg-red-500'}
            size="icon"
            onClick={() => {
              const selected = table.getSelectedRowModel();
              deleteDetails
                .mutateAsync(selected.flatRows.map(row => row.original.id))
                .then(() => setRowSelection({}));
            }}
          >
            <Cross2Icon className={'h-5 w-5'} />
          </Button>
          <Button variant={'outline'} className={'flex gap-1'}>
            <DownloadIcon className={'h-5 w-5'} />
            Xuất Excel
          </Button>
        </div>
        <div
          ref={parentRef}
          className={
            'relative h-[calc(100vh-214px)] grow overflow-auto rounded-md border'
          }
        >
          <Table
            style={{
              width: table.getTotalSize()
            }}
          >
            <TableHeader
              className={'bg-appGrayLight'}
              style={{
                display: 'grid',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}
            >
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
            <TableBody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                position: 'relative' //needed for absolute positioning of rows
              }}
            >
              {virtualRows.length ? (
                virtualRows.map(virtualRow => {
                  const row = rows[virtualRow.index] as Row<DetailData>;
                  return (
                    <TableRow
                      data-index={virtualRow.index} //needed for dynamic row height measurement
                      ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                      key={row.id}
                      className={'group absolute w-full cursor-pointer'}
                      style={{
                        transform: `translateY(${virtualRow.start}px)` //this should always be a `style` as it changes on scroll
                      }}
                      onClick={() => {
                        if (selectedRow?.id !== row.id) {
                          setSelectedRow(row);
                        } else {
                          setSelectedRow(undefined);
                        }
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
                              `bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight p-1 text-xs
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
    </>
  );
};
