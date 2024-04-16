import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
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
import _ from 'lodash';
import {
  DownloadIcon,
  EditIcon,
  SheetIcon,
  SquareMinusIcon,
  SquarePlusIcon
} from 'lucide-react';

import { FC, useEffect, useMemo, useRef, useState } from 'react';

import {
  DetailInfoResponse,
  cn,
  formatCurrency,
  formatNumber
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

import { getAllDetailInfos, useDeleteDetails } from '../../../api';
import {
  TreeData,
  arrayToTree,
  getCommonPinningStyles
} from '../../../commons/utils';
import { IndeterminateCheckbox } from '../../checkbox/indeterminate-checkbox';
import { EditDetailDialog } from '../detail/edit-detail-dialog';
import { NewDetailDialog } from '../detail/new-detail-dialog';

export type DocumentOverviewProps = {
  projectId: string;
};

export const DocumentOverviewTab: FC<DocumentOverviewProps> = ({
  projectId
}) => {
  const [openDocumentDetailNew, setOpenDocumentDetailNew] = useState(false);
  const [openDocumentDetailEdit, setOpenDocumentDetailEdit] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<Row<TreeData<DetailInfoResponse>>>();

  const details = useSuspenseQuery(getAllDetailInfos(projectId));
  const deleteDetails = useDeleteDetails(projectId);

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const data = useMemo(
    () =>
      arrayToTree(details.data, `${projectId}-root`, (value, item) => {
        return _.chain(value)
          .filter(it => it.group === item.group)
          .uniqBy('request')
          .sumBy('requestVolume')
          .value();
      }),
    [details.data, projectId]
  );

  const columnHelper = createColumnHelper<TreeData<DetailInfoResponse>>();

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
          <div className={'text-center'}>
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
        size: 30,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('title', {
        cell: info => info.getValue(),
        header: () => 'Mô tả công việc',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('volume', {
        cell: ({ row }) => formatNumber(row.original.volume),
        header: () => 'KL thầu',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('unit', {
        cell: info => info.getValue(),
        header: () => 'Đơn vị',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('unitPrice', {
        cell: ({ row }) => formatCurrency(row.original.unitPrice),
        header: () => 'Đơn giá thầu',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'biddingTotal',
        cell: ({ row }) =>
          formatCurrency(row.original.unitPrice * row.original.volume),
        header: () => 'Thành tiền',
        footer: info => info.column.id,
        size: 150,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'totalRequestVolume',
        cell: ({ row }) => {
          return formatNumber(row.original.extra as number);
        },
        header: () => 'Tổng KL yêu cầu',
        footer: info => info.column.id,
        size: 120,
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
              <div
                className={cn(
                  'flex w-full',
                  exceed < 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {formatNumber(exceed < 0 ? -exceed : exceed)}
              </div>
            );
          }
          return null;
        },
        header: () => 'KL phát sinh',
        footer: info => info.column.id,
        size: 120,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'requestVolume',
        cell: info => formatNumber(info.row.original.requestVolume),
        header: () => 'KL yêu cầu',
        footer: info => info.column.id,
        size: 120,
        meta: {
          hasRowSpan: 'requestRowSpan'
        }
      }),
      columnHelper.accessor('supplierPrice', {
        cell: info => formatCurrency(info.getValue()),
        header: () => 'Đơn giá NCC',
        footer: info => info.column.id,
        size: 150
      }),
      columnHelper.display({
        id: 'exceedUnitPrice',
        cell: ({ row }) => {
          if (row.original.supplierPrice) {
            const exceed = row.original.supplierPrice - row.original.unitPrice;
            if (exceed > 0) {
              return (
                <span className={'text-red-500'}>{formatCurrency(exceed)}</span>
              );
            } else {
              return (
                <span className={'text-green-500'}>
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
      columnHelper.accessor('supplierName', {
        cell: info => info.getValue(),
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

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

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
        projectId={projectId}
        parent={selectedRow ? selectedRow.original : undefined}
      />
      {selectedRow ? (
        <EditDetailDialog
          open={openDocumentDetailEdit}
          setOpen={setOpenDocumentDetailEdit}
          detailId={selectedRow.original.group}
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
          className={'h-[calc(100vh-214px)] overflow-auto rounded-md border'}
        >
          <Table
            style={{
              width: table.getTotalSize()
            }}
          >
            <TableHeader
              className={'bg-appGrayLight'}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2
              }}
            >
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
                        className={`bg-appGrayLight relative whitespace-nowrap p-1 after:pointer-events-none after:absolute
                          after:right-0 after:top-0 after:h-full after:w-full after:border-b after:border-r
                          after:content-[''] last:after:border-r-0`}
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
                        if (selectedRow?.id !== row.id) {
                          setSelectedRow(row);
                        } else {
                          setSelectedRow(undefined);
                        }
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
                              `bg-appWhite hover:bg-appGrayLight group-hover:bg-appGrayLight relative p-1 text-xs
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
    </>
  );
};
