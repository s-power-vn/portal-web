/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import { FC, useEffect, useMemo, useState } from 'react';

import { cn, useOutsideClick } from '@storeo/core';
import {
  IntegerInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@storeo/theme';

import { getRequestById, useUpdateContract } from '../../../api';
import { getCommonPinningStyles } from '../../../commons/utils';
import { ContractItem } from './contract-item';

export function EditableInput(props: {
  initialValue: string;
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState<string>(props.toString());
  const [showInput, setShowInput] = useState(false);
  const ref = useOutsideClick(() => {
    setShowInput(false);
  });

  useEffect(() => {
    setValue(props.initialValue.toString());
  }, [props.initialValue]);

  return (
    <div
      className={
        'absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center px-4'
      }
      onClick={() => {
        setShowInput(true);
      }}
      ref={ref}
    >
      {showInput ? (
        <IntegerInput
          max={10}
          value={value}
          onChange={e => {
            if (e.target.value) {
              setValue(e.target.value);
            }
          }}
          onBlur={() => props.onChange?.(value)}
        />
      ) : (
        <span className={'pointer-events-none'}>{value}</span>
      )}
    </div>
  );
}

export type ContractBlockProps = {
  requestId: string;
};

export const ContractBlock: FC<ContractBlockProps> = ({ requestId }) => {
  const request = useSuspenseQuery(getRequestById(requestId));
  const updateContract = useUpdateContract();

  const data = useMemo(() => {
    const v = request.data.expand.contract_via_request.map(it => ({
      supplier: {
        id: it.expand.supplier.id,
        name: it.expand.supplier.name
      },
      item: undefined as any,
      items:
        it.expand.contractItem_via_contract?.map(ci => ({
          id: ci.id,
          index: ci.index,
          status: ci.status
        })) ?? [],
      id: it.id,
      count: it.count,
      note: it.note,
      index: 0,
      levelRowSpan: 0,
      requestRowSpan: 0
    }));

    let list: typeof v = [];
    for (const vi of v) {
      list = [
        ...list,
        ...[...Array(vi.count).keys()].map((_, index) => {
          const item = vi.items.find(i => i.index === index);
          return {
            ...vi,
            index,
            item,
            levelRowSpan: index === 0 ? vi.count : 0,
            requestRowSpan: 0
          };
        })
      ];
    }

    return list;
  }, [request.data]);

  const columnHelper = createColumnHelper<(typeof data)[0]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('supplier', {
        cell: ({ row }) => row.original.supplier.name,
        header: () => 'Nhà cung cấp',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('count', {
        cell: ({ getValue, row }) => (
          <EditableInput
            initialValue={getValue().toString()}
            onChange={value => {
              updateContract.mutate({
                contractId: row.original.id,
                count: parseInt(value)
              });
            }}
          />
        ),
        header: () => 'Số lượng HĐ',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.display({
        id: 'status',
        cell: ({ row }) => {
          const successCount = row.original.items.filter(
            it => it.status === 'Done'
          ).length;
          const totalCount = row.original.count;

          return (
            <div
              className={cn(
                'flex justify-center',
                successCount === totalCount
                  ? 'text-appSuccess'
                  : 'text-appError'
              )}
            >
              {successCount}/{totalCount}
            </div>
          );
        },
        header: () => 'Trạng thái HĐ',
        footer: info => info.column.id,
        size: 100,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      }),
      columnHelper.accessor('index', {
        cell: ({ row }) => (
          <ContractItem
            requestId={requestId}
            contractId={row.original.id}
            index={row.original.index}
            itemId={row.original.item ? row.original.item.id : undefined}
          />
        ),
        header: () => 'Tệp đính kèm',
        footer: info => info.column.id,
        size: 400
      }),
      columnHelper.accessor('note', {
        cell: ({ row }) => row.original.note,
        header: () => 'Ghi chú',
        footer: info => info.column.id,
        size: 300,
        meta: {
          hasRowSpan: 'levelRowSpan'
        }
      })
    ],
    [columnHelper, requestId, updateContract]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true
  });

  return (
    <>
      <div className={'bg-appWhite flex flex-col rounded-md border'}>
        <div className={'flex justify-between border-b p-4'}>
          <div className={'flex-1 text-lg font-bold'}>{request.data?.name}</div>
        </div>
        <div className={'flex flex-col p-2'}>
          <div className={'overflow-x-auto rounded-md border pb-2'}>
            <Table>
              <TableHeader className={'bg-appGrayLight'}>
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
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => {
                    return (
                      <TableRow key={row.id} className={'h-14 w-full'}>
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
                                `bg-appWhite p-1 after:absolute
                                 after:right-0 after:top-0 after:h-full after:border-r after:content-['']`,
                                cell.column.columnDef.meta?.hasRowSpan
                                  ? 'last:after:border-r-0'
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
                    <TableCell
                      colSpan={columns.length}
                      className={'text-center'}
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
    </>
  );
};
