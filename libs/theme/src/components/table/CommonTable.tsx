/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import { cn } from '@storeo/core';

import { Pagination } from '../pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';

export type CommonTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  rowCount?: number;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageNext?: () => void;
  onPagePrev?: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowClick?: (row: Row<T>) => void;
  className?: string;
  fixedWidth?: boolean;
};

export const CommonTable = <T,>(props: CommonTableProps<T>) => {
  const table = useReactTable({
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    ...props
  });

  return (
    <>
      <div
        className={cn(
          'border-appBlueLight overflow-auto rounded-md border',
          props.className
        )}
      >
        <Table
          style={
            table.getRowModel().rows.length
              ? {
                  width: props.fixedWidth ? table.getTotalSize() : undefined
                }
              : undefined
          }
        >
          <TableHeader className={'bg-appBlueLight'}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className={'hover:bg-appBlue'}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={'text-appWhite whitespace-nowrap'}
                    style={
                      table.getRowModel().rows.length
                        ? {
                            width: props.fixedWidth
                              ? header.getSize()
                              : undefined
                          }
                        : undefined
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className={'cursor-pointer last:border-b-0'}
                  onClick={() => props.onRowClick?.(row)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={
                        'max-w-60 truncate whitespace-nowrap text-left'
                      }
                      style={
                        table.getRowModel().rows.length
                          ? {
                              width: props.fixedWidth
                                ? cell.column.getSize()
                                : undefined
                            }
                          : undefined
                      }
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
              <TableRow className={'border-b-0'}>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-16 text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        totalItems={props.rowCount}
        totalPages={props.pageCount}
        pageIndex={props.pageIndex}
        pageSize={props.pageSize}
        onPageNext={props.onPageNext}
        onPagePrev={props.onPagePrev}
        onPageSizeChange={props.onPageSizeChange}
      ></Pagination>
    </>
  );
};
